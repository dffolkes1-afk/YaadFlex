// YaadFlex Real-Time Delivery WebSocket Hook (Uber-like)
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';

interface DriverLocation {
  personnelId: string;
  lat: number;
  lng: number;
  isOnline: boolean;
  lastUpdate: number;
}

interface NearbyDriver {
  id: string;
  firstName: string;
  lastName: string;
  rating: string;
  vehicleType: string;
  deliveryTypes: string[];
  location: { lat: number; lng: number };
  distance: number;
  estimatedArrival: number;
}

interface OrderUpdate {
  orderId: string;
  status: string;
  location?: { lat: number; lng: number };
  estimatedArrival?: number;
  message?: string;
  timestamp: number;
}

interface UseDeliveryRealtimeOptions {
  userType: 'customer' | 'driver' | 'admin';
  personnelId?: string;
  autoConnect?: boolean;
}

export function useDeliveryRealtime(options: UseDeliveryRealtimeOptions) {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [nearbyDrivers, setNearbyDrivers] = useState<NearbyDriver[]>([]);
  const [orderUpdates, setOrderUpdates] = useState<OrderUpdate[]>([]);
  const [driverLocations, setDriverLocations] = useState<Map<string, DriverLocation>>(new Map());
  const [onlineDriversCount, setOnlineDriversCount] = useState(0);
  const [lastHeartbeat, setLastHeartbeat] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const locationUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!isAuthenticated || !user || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/delivery-ws`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('🚚 Connected to YaadFlex Real-Time Delivery System');
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;

        // Authenticate immediately
        ws.send(JSON.stringify({
          type: 'auth',
          userId: user.id,
          userType: options.userType,
          personnelId: options.personnelId
        }));

        // Start location updates for drivers
        if (options.userType === 'driver' && navigator.geolocation) {
          startLocationUpdates();
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 Delivery WebSocket connection closed:', event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        stopLocationUpdates();
        
        // Auto-reconnect unless manually closed
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      ws.onerror = (error) => {
        console.error('🚨 Delivery WebSocket error:', error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [isAuthenticated, user, options.userType, options.personnelId]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    stopLocationUpdates();
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) return;

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Max 30s
    reconnectAttempts.current += 1;

    console.log(`🔄 Reconnecting to delivery system in ${delay}ms (attempt ${reconnectAttempts.current})`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectTimeoutRef.current = null;
      connect();
    }, delay);
  }, [connect]);

  const handleMessage = (message: any) => {
    switch (message.type) {
      case 'auth_success':
        console.log('✅ Delivery system authentication successful');
        break;

      case 'nearby_drivers':
        setNearbyDrivers(message.drivers || []);
        break;

      case 'order_update':
        setOrderUpdates(prev => [message, ...prev.slice(0, 49)]); // Keep last 50 updates
        break;

      case 'driver_location_update':
        setDriverLocations(prev => {
          const updated = new Map(prev);
          updated.set(message.personnelId, {
            personnelId: message.personnelId,
            lat: message.location.lat,
            lng: message.location.lng,
            isOnline: message.location.isOnline,
            lastUpdate: message.timestamp
          });
          return updated;
        });
        break;

      case 'new_order_available':
        // Handle new order notifications for drivers
        if (options.userType === 'driver') {
          console.log('📦 New delivery order available:', message.order);
          // Could trigger a notification here
        }
        break;

      case 'order_accepted':
        console.log('✅ Order accepted successfully:', message.orderId);
        break;

      case 'order_acceptance_failed':
        console.log('❌ Order acceptance failed:', message.message);
        break;

      case 'heartbeat':
        setLastHeartbeat(message.timestamp);
        setOnlineDriversCount(message.activeDrivers || 0);
        
        // Respond with pong
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'ping' }));
        }
        break;

      case 'pong':
        // Heartbeat response received
        break;

      case 'error':
        console.error('🚨 Delivery system error:', message.message);
        break;

      default:
        console.log('📨 Unknown message type:', message.type);
    }
  };

  const startLocationUpdates = () => {
    if (!navigator.geolocation || options.userType !== 'driver') return;

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'driver_location',
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              isOnline: true,
              accuracy: position.coords.accuracy,
              timestamp: Date.now()
            }));
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );
    };

    // Update location every 15 seconds
    updateLocation(); // Initial update
    locationUpdateIntervalRef.current = setInterval(updateLocation, 15000);
  };

  const stopLocationUpdates = () => {
    if (locationUpdateIntervalRef.current) {
      clearInterval(locationUpdateIntervalRef.current);
      locationUpdateIntervalRef.current = null;
    }
  };

  // Public methods
  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  const requestNearbyDrivers = useCallback((lat: number, lng: number, deliveryType: string) => {
    return sendMessage({
      type: 'request_nearby_drivers',
      lat,
      lng,
      deliveryType
    });
  }, [sendMessage]);

  const acceptOrder = useCallback((orderId: string) => {
    return sendMessage({
      type: 'accept_order',
      orderId
    });
  }, [sendMessage]);

  const updateOrderStatus = useCallback((orderId: string, status: string, location?: { lat: number; lng: number }, message?: string) => {
    return sendMessage({
      type: 'order_status',
      orderId,
      status,
      location,
      message
    });
  }, [sendMessage]);

  const updateDriverLocation = useCallback((lat: number, lng: number, isOnline: boolean) => {
    return sendMessage({
      type: 'driver_location',
      lat,
      lng,
      isOnline
    });
  }, [sendMessage]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (options.autoConnect !== false && isAuthenticated) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, options.autoConnect, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // Connection state
    isConnected,
    connectionStatus,
    lastHeartbeat,
    onlineDriversCount,
    
    // Data
    nearbyDrivers,
    orderUpdates,
    driverLocations,
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    requestNearbyDrivers,
    acceptOrder,
    updateOrderStatus,
    updateDriverLocation
  };
}