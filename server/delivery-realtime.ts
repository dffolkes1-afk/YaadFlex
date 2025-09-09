// YaadFlex Real-Time Delivery System (Uber-Like)
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { db } from "./db";
import { 
  deliveryPersonnel, 
  deliveryOrders, 
  deliveryRoutes,
  users 
} from "@shared/schema";
import { eq, and, sql, lt, gte } from "drizzle-orm";
import { 
  findAvailableDeliveryPersonnel,
  updateDeliveryPersonnelLocation,
  updateDeliveryPersonnelStatus
} from "./delivery-service";

interface ConnectedClient {
  ws: WebSocket;
  userId: string;
  userType: 'customer' | 'driver' | 'admin';
  personnelId?: string;
  lastPing: number;
}

interface DriverLocation {
  personnelId: string;
  lat: number;
  lng: number;
  isOnline: boolean;
  lastUpdate: number;
}

interface OrderUpdate {
  orderId: string;
  status: string;
  location?: {
    lat: number;
    lng: number;
  };
  estimatedArrival?: number;
  message?: string;
}

export class DeliveryRealtimeManager {
  private wss: WebSocketServer;
  private clients: Map<string, ConnectedClient> = new Map();
  private driverLocations: Map<string, DriverLocation> = new Map();
  private orderAssignmentQueue: string[] = [];
  private isProcessingQueue = false;

  constructor(server: Server) {
    // Create WebSocket server on /delivery-ws path
    this.wss = new WebSocketServer({ 
      server, 
      path: '/delivery-ws'
    });

    this.setupWebSocket();
    this.startLocationTracking();
    this.startOrderProcessing();
    this.startHeartbeat();

    console.log('🚚 YaadFlex Real-Time Delivery System initialized (Uber-like)');
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      console.log('📱 New delivery WebSocket connection');

      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(ws, message);
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Invalid message format' 
          }));
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private async handleMessage(ws: WebSocket, message: any) {
    const { type, userId, userType, personnelId, ...data } = message;

    switch (type) {
      case 'auth':
        this.authenticateClient(ws, userId, userType, personnelId);
        break;

      case 'driver_location':
        if (userType === 'driver' && personnelId) {
          await this.updateDriverLocation(personnelId, data.lat, data.lng, data.isOnline);
          this.broadcastDriverLocation(personnelId, data);
        }
        break;

      case 'order_status':
        if (userType === 'driver') {
          await this.updateOrderStatus(data.orderId, data.status, data);
        }
        break;

      case 'request_nearby_drivers':
        if (userType === 'customer') {
          this.sendNearbyDrivers(ws, data.lat, data.lng, data.deliveryType);
        }
        break;

      case 'accept_order':
        if (userType === 'driver' && personnelId) {
          await this.handleOrderAcceptance(personnelId, data.orderId);
        }
        break;

      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;

      default:
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: `Unknown message type: ${type}` 
        }));
    }
  }

  private authenticateClient(ws: WebSocket, userId: string, userType: string, personnelId?: string) {
    const clientId = `${userId}_${Date.now()}`;
    
    this.clients.set(clientId, {
      ws,
      userId,
      userType: userType as 'customer' | 'driver' | 'admin',
      personnelId,
      lastPing: Date.now()
    });

    ws.send(JSON.stringify({ 
      type: 'auth_success', 
      clientId,
      message: `Connected as ${userType}` 
    }));

    console.log(`🔐 Client authenticated: ${userType} - ${userId}`);
  }

  private handleDisconnection(ws: WebSocket) {
    let disconnectedClient = null;
    
    for (const [clientId, client] of this.clients.entries()) {
      if (client.ws === ws) {
        disconnectedClient = client;
        this.clients.delete(clientId);
        break;
      }
    }

    if (disconnectedClient?.personnelId && disconnectedClient.userType === 'driver') {
      // Mark driver as offline when they disconnect
      this.driverLocations.delete(disconnectedClient.personnelId);
      updateDeliveryPersonnelStatus(disconnectedClient.personnelId, false);
    }

    console.log('📱 Client disconnected');
  }

  private async updateDriverLocation(personnelId: string, lat: number, lng: number, isOnline: boolean) {
    const locationUpdate: DriverLocation = {
      personnelId,
      lat,
      lng,
      isOnline,
      lastUpdate: Date.now()
    };

    this.driverLocations.set(personnelId, locationUpdate);

    // Update database
    await updateDeliveryPersonnelLocation(personnelId, lat, lng);
    if (!isOnline) {
      await updateDeliveryPersonnelStatus(personnelId, false);
    }

    // Check for nearby pending orders and auto-assign
    await this.checkNearbyOrders(personnelId, lat, lng);
  }

  private async checkNearbyOrders(personnelId: string, driverLat: number, driverLng: number) {
    try {
      // Find pending orders within 10km radius
      const pendingOrders = await db.select({
        id: deliveryOrders.id,
        deliveryType: deliveryOrders.deliveryType,
        pickupLat: deliveryOrders.pickupLat,
        pickupLng: deliveryOrders.pickupLng,
        priority: deliveryOrders.priority,
        createdAt: deliveryOrders.createdAt
      })
      .from(deliveryOrders)
      .where(and(
        eq(deliveryOrders.status, 'pending'),
        sql`${deliveryOrders.deliveryPersonnelId} IS NULL`
      ))
      .limit(10);

      for (const order of pendingOrders) {
        const distance = this.calculateDistance(
          driverLat, driverLng,
          Number(order.pickupLat), Number(order.pickupLng)
        );

        // Auto-assign if within 5km and driver is qualified
        if (distance <= 5) {
          const [personnel] = await db.select()
            .from(deliveryPersonnel)
            .where(eq(deliveryPersonnel.id, personnelId));

          if (personnel && 
              Array.isArray(personnel.deliveryTypes) && 
              personnel.deliveryTypes.includes(order.deliveryType)) {
            
            // Add to assignment queue
            this.orderAssignmentQueue.push(order.id);
          }
        }
      }
    } catch (error) {
      console.error('Error checking nearby orders:', error);
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private broadcastDriverLocation(personnelId: string, locationData: any) {
    const message = JSON.stringify({
      type: 'driver_location_update',
      personnelId,
      location: locationData,
      timestamp: Date.now()
    });

    // Send to all connected customers and admin clients
    this.clients.forEach((client) => {
      if ((client.userType === 'customer' || client.userType === 'admin') && 
          client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }

  private async updateOrderStatus(orderId: string, status: string, data: any) {
    try {
      // Update order in database
      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'picked_up') {
        updateData.pickedUpAt = new Date();
      } else if (status === 'delivered') {
        updateData.deliveredAt = new Date();
      }

      await db.update(deliveryOrders)
        .set(updateData)
        .where(eq(deliveryOrders.id, orderId));

      // Broadcast update to all relevant clients
      const orderUpdate: OrderUpdate = {
        orderId,
        status,
        location: data.location,
        estimatedArrival: data.estimatedArrival,
        message: data.message
      };

      this.broadcastOrderUpdate(orderUpdate);

    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }

  private broadcastOrderUpdate(update: OrderUpdate) {
    const message = JSON.stringify({
      type: 'order_update',
      ...update,
      timestamp: Date.now()
    });

    // Send to all clients - they'll filter on frontend
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }

  private async sendNearbyDrivers(ws: WebSocket, lat: number, lng: number, deliveryType: string) {
    const nearbyDrivers = [];

    for (const [personnelId, location] of this.driverLocations.entries()) {
      if (!location.isOnline) continue;

      const distance = this.calculateDistance(lat, lng, location.lat, location.lng);
      
      if (distance <= 10) { // Within 10km
        // Get driver details
        const [personnel] = await db.select({
          id: deliveryPersonnel.id,
          deliveryTypes: deliveryPersonnel.deliveryTypes,
          vehicleType: deliveryPersonnel.vehicleType,
          rating: deliveryPersonnel.rating,
          firstName: users.firstName,
          lastName: users.lastName
        })
        .from(deliveryPersonnel)
        .innerJoin(users, eq(deliveryPersonnel.userId, users.id))
        .where(eq(deliveryPersonnel.id, personnelId));

        if (personnel && 
            Array.isArray(personnel.deliveryTypes) && 
            personnel.deliveryTypes.includes(deliveryType)) {
          
          nearbyDrivers.push({
            ...personnel,
            location: { lat: location.lat, lng: location.lng },
            distance: Math.round(distance * 100) / 100,
            estimatedArrival: Math.ceil(distance / 40 * 60) // Assume 40km/h average speed
          });
        }
      }
    }

    // Sort by distance and rating
    nearbyDrivers.sort((a, b) => (a.distance - b.distance) || (Number(b.rating) - Number(a.rating)));

    ws.send(JSON.stringify({
      type: 'nearby_drivers',
      drivers: nearbyDrivers.slice(0, 5), // Top 5 drivers
      timestamp: Date.now()
    }));
  }

  private async handleOrderAcceptance(personnelId: string, orderId: string) {
    try {
      // Check if order is still available
      const [order] = await db.select()
        .from(deliveryOrders)
        .where(and(
          eq(deliveryOrders.id, orderId),
          eq(deliveryOrders.status, 'pending'),
          sql`${deliveryOrders.deliveryPersonnelId} IS NULL`
        ));

      if (!order) {
        // Order already taken or doesn't exist
        const personnel = this.clients.get(personnelId);
        if (personnel?.ws.readyState === WebSocket.OPEN) {
          personnel.ws.send(JSON.stringify({
            type: 'order_acceptance_failed',
            orderId,
            message: 'Order is no longer available'
          }));
        }
        return;
      }

      // Assign order to driver
      await db.update(deliveryOrders)
        .set({
          deliveryPersonnelId: personnelId,
          status: 'accepted',
          acceptedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(deliveryOrders.id, orderId));

      // Notify driver
      this.clients.forEach((client) => {
        if (client.personnelId === personnelId && client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify({
            type: 'order_accepted',
            orderId,
            message: 'Order successfully accepted!'
          }));
        }
      });

      // Broadcast order assignment
      this.broadcastOrderUpdate({
        orderId,
        status: 'accepted',
        message: 'Driver assigned and en route to pickup'
      });

    } catch (error) {
      console.error('Error handling order acceptance:', error);
    }
  }

  private startLocationTracking() {
    // Update driver locations every 10 seconds
    setInterval(() => {
      const staleLocations = [];
      const cutoff = Date.now() - 30000; // 30 seconds

      for (const [personnelId, location] of this.driverLocations.entries()) {
        if (location.lastUpdate < cutoff) {
          staleLocations.push(personnelId);
        }
      }

      // Remove stale locations and mark drivers offline
      staleLocations.forEach(personnelId => {
        this.driverLocations.delete(personnelId);
        updateDeliveryPersonnelStatus(personnelId, false);
      });

    }, 10000);
  }

  private startOrderProcessing() {
    // Process order assignment queue every 2 seconds
    setInterval(async () => {
      if (this.isProcessingQueue || this.orderAssignmentQueue.length === 0) {
        return;
      }

      this.isProcessingQueue = true;

      try {
        while (this.orderAssignmentQueue.length > 0) {
          const orderId = this.orderAssignmentQueue.shift()!;
          
          // Check if order still needs assignment
          const [order] = await db.select()
            .from(deliveryOrders)
            .where(and(
              eq(deliveryOrders.id, orderId),
              eq(deliveryOrders.status, 'pending')
            ));

          if (order) {
            // Find best available driver and auto-assign
            const availableDrivers = await findAvailableDeliveryPersonnel(
              order.deliveryType,
              Number(order.pickupLat),
              Number(order.pickupLng)
            );

            if (availableDrivers.length > 0) {
              const bestDriver = availableDrivers[0];
              await this.handleOrderAcceptance(bestDriver.id, orderId);
            }
          }
        }
      } catch (error) {
        console.error('Error processing order queue:', error);
      } finally {
        this.isProcessingQueue = false;
      }
    }, 2000);
  }

  private startHeartbeat() {
    // Send heartbeat to all clients every 30 seconds
    setInterval(() => {
      const heartbeat = JSON.stringify({
        type: 'heartbeat',
        timestamp: Date.now(),
        activeDrivers: this.driverLocations.size,
        connectedClients: this.clients.size
      });

      this.clients.forEach((client) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(heartbeat);
          client.lastPing = Date.now();
        }
      });

      // Remove dead connections
      const deadClients = [];
      const cutoff = Date.now() - 60000; // 1 minute

      this.clients.forEach((client, clientId) => {
        if (client.lastPing < cutoff) {
          deadClients.push(clientId);
        }
      });

      deadClients.forEach(clientId => {
        this.clients.delete(clientId);
      });

    }, 30000);
  }

  // Public methods for API integration
  public async broadcastNewOrder(orderId: string) {
    try {
      const [order] = await db.select()
        .from(deliveryOrders)
        .innerJoin(users, eq(deliveryOrders.customerId, users.id))
        .where(eq(deliveryOrders.id, orderId));

      if (order) {
        const message = JSON.stringify({
          type: 'new_order_available',
          order: {
            id: order.delivery_orders.id,
            orderNumber: order.delivery_orders.orderNumber,
            deliveryType: order.delivery_orders.deliveryType,
            pickupAddress: order.delivery_orders.pickupAddress,
            deliveryAddress: order.delivery_orders.deliveryAddress,
            deliveryFee: order.delivery_orders.deliveryFee,
            priority: order.delivery_orders.priority,
            customerName: `${order.users.firstName} ${order.users.lastName}`,
            pickupLat: order.delivery_orders.pickupLat,
            pickupLng: order.delivery_orders.pickupLng
          },
          timestamp: Date.now()
        });

        // Broadcast to all online drivers
        this.clients.forEach((client) => {
          if (client.userType === 'driver' && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(message);
          }
        });
      }
    } catch (error) {
      console.error('Error broadcasting new order:', error);
    }
  }

  public getOnlineDriversCount(): number {
    return this.driverLocations.size;
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

// Export singleton instance
let realtimeManager: DeliveryRealtimeManager | null = null;

export function initializeDeliveryRealtime(server: Server): DeliveryRealtimeManager {
  if (!realtimeManager) {
    realtimeManager = new DeliveryRealtimeManager(server);
  }
  return realtimeManager;
}

export function getDeliveryRealtimeManager(): DeliveryRealtimeManager | null {
  return realtimeManager;
}