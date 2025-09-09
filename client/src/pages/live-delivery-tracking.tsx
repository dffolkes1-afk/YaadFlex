import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useDeliveryRealtime } from '@/hooks/useDeliveryRealtime';
import { 
  MapPin, 
  Truck, 
  Clock,
  User,
  Phone,
  Navigation,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Radio
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  deliveryType: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryContactName: string;
  deliveryContactPhone: string;
  deliveryPersonnelName?: string;
  deliveryPersonnelPhone?: string;
  createdAt: string;
  acceptedAt?: string;
  deliveredAt?: string;
}

export default function LiveDeliveryTracking() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    isConnected,
    connectionStatus,
    orderUpdates,
    nearbyDrivers,
    onlineDriversCount,
    lastHeartbeat,
    requestNearbyDrivers
  } = useDeliveryRealtime({
    userType: 'customer',
    autoConnect: true
  });

  useEffect(() => {
    loadMyOrders();
  }, []);

  useEffect(() => {
    // Handle real-time order updates
    if (orderUpdates.length > 0) {
      const latestUpdate = orderUpdates[0];
      
      // Update local orders state
      setOrders(prev => prev.map(order => 
        order.id === latestUpdate.orderId 
          ? { ...order, status: latestUpdate.status }
          : order
      ));

      // Show toast notification for status changes
      const statusMessages: Record<string, string> = {
        'accepted': '📋 Your order has been accepted by a driver',
        'picked_up': '📦 Your order has been picked up',
        'in_transit': '🚚 Your order is on the way',
        'delivered': '✅ Your order has been delivered!'
      };

      const message = statusMessages[latestUpdate.status] || latestUpdate.message;
      if (message) {
        toast({
          title: 'Order Update',
          description: message,
        });
      }
    }
  }, [orderUpdates, toast]);

  const loadMyOrders = async () => {
    try {
      setLoading(true);
      const ordersRes = await apiRequest('GET', '/api/delivery/my-orders?limit=20') as DeliveryOrder[];
      setOrders(ordersRes);
      
      if (ordersRes.length > 0) {
        setSelectedOrder(ordersRes.find(o => ['accepted', 'picked_up', 'in_transit'].includes(o.status)) || ordersRes[0]);
      }
    } catch (error: any) {
      toast({
        title: 'Load Failed',
        description: 'Failed to load your orders',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'accepted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'picked_up': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'in_transit': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'picked_up': return <Truck className="w-4 h-4" />;
      case 'in_transit': return <Navigation className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const trackOrderOnMap = (order: DeliveryOrder) => {
    // In a real app, this would open a map view
    toast({
      title: 'Map View',
      description: 'Opening live map tracking...',
    });
  };

  const showNearbyDrivers = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          requestNearbyDrivers(
            position.coords.latitude,
            position.coords.longitude,
            selectedOrder?.deliveryType || 'packages'
          );
          
          toast({
            title: 'Finding Drivers',
            description: 'Looking for nearby delivery personnel...',
          });
        },
        (error) => {
          toast({
            title: 'Location Error',
            description: 'Could not get your location to find nearby drivers',
            variant: 'destructive'
          });
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Truck className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 animate-pulse" />
          <p className="text-lg font-medium mt-4 text-gray-900 dark:text-white">Loading Your Deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Real-time Status */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Target className="w-8 h-8 text-red-600 dark:text-red-400" />
              Live Delivery Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time updates powered by YaadFlex Network
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">
                {isConnected ? 'Live Connected' : 'Disconnected'}
              </span>
            </div>
            <Badge variant="outline" className="text-sm">
              <Radio className="w-3 h-3 mr-1" />
              {onlineDriversCount} Drivers Online
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Your Deliveries ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Truck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        No deliveries yet
                      </p>
                      <Button onClick={() => window.location.href = '/book-delivery'}>
                        Book Your First Delivery
                      </Button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedOrder?.id === order.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{order.orderNumber}</span>
                          <Badge className={`text-xs ${getStatusBadgeColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status.replace('_', ' ').toUpperCase()}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {order.deliveryType} • {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          To: {order.deliveryAddress}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Order Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Order Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Order {selectedOrder.orderNumber}
                      </CardTitle>
                      <Badge className={`${getStatusBadgeColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1">{selectedOrder.status.replace('_', ' ').toUpperCase()}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Delivery Details */}
                      <div>
                        <h4 className="font-medium mb-2">Delivery Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Delivery Address</div>
                              <div className="text-gray-600 dark:text-gray-400">{selectedOrder.deliveryAddress}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>{selectedOrder.deliveryContactName}</span>
                            <a 
                              href={`tel:${selectedOrder.deliveryContactPhone}`}
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              {selectedOrder.deliveryContactPhone}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Driver Info */}
                      <div>
                        <h4 className="font-medium mb-2">Driver Information</h4>
                        {selectedOrder.deliveryPersonnelName ? (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-green-600" />
                              <span className="font-medium">{selectedOrder.deliveryPersonnelName}</span>
                            </div>
                            {selectedOrder.deliveryPersonnelPhone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <a 
                                  href={`tel:${selectedOrder.deliveryPersonnelPhone}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {selectedOrder.deliveryPersonnelPhone}
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedOrder.status === 'pending' ? 'Looking for a driver...' : 'Driver not assigned yet'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button onClick={() => trackOrderOnMap(selectedOrder)} variant="outline">
                        <MapPin className="w-4 h-4 mr-2" />
                        Track on Map
                      </Button>
                      
                      {selectedOrder.status === 'pending' && (
                        <Button onClick={showNearbyDrivers} variant="outline">
                          <Target className="w-4 h-4 mr-2" />
                          Find Nearby Drivers
                        </Button>
                      )}

                      {selectedOrder.deliveryPersonnelPhone && (
                        <Button onClick={() => window.open(`tel:${selectedOrder.deliveryPersonnelPhone}`)}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call Driver
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Real-time Updates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Live Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {orderUpdates.filter(update => update.orderId === selectedOrder.id).length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          No recent updates. You'll see real-time status changes here.
                        </p>
                      ) : (
                        orderUpdates
                          .filter(update => update.orderId === selectedOrder.id)
                          .slice(0, 5)
                          .map((update, index) => (
                            <div key={index} className="flex items-start gap-3 p-2 border-l-2 border-blue-500">
                              <div className="text-xs text-gray-500 whitespace-nowrap">
                                {new Date(update.timestamp).toLocaleTimeString()}
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">
                                  Status: {update.status.replace('_', ' ').toUpperCase()}
                                </div>
                                {update.message && (
                                  <div className="text-gray-600 dark:text-gray-400 mt-1">
                                    {update.message}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Nearby Drivers */}
                {nearbyDrivers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Navigation className="w-5 h-5" />
                        Nearby Drivers ({nearbyDrivers.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {nearbyDrivers.map((driver) => (
                          <div key={driver.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">
                                {driver.firstName} {driver.lastName}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                ⭐ {Number(driver.rating).toFixed(1)}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {driver.vehicleType} • {driver.distance}km away
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              ETA: ~{driver.estimatedArrival} minutes
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Truck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an Order</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose an order from the list to see live tracking details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}