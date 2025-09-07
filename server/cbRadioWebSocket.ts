import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { db } from './db';
import { 
  cbRadioChannels, 
  cbRadioMessages, 
  driverCbProfiles, 
  cbChannelSubscriptions 
} from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

interface CBWebSocketConnection extends WebSocket {
  driverId?: string;
  callSign?: string;
  channelId?: string;
  isAlive?: boolean;
}

interface CBMessage {
  type: 'join_channel' | 'leave_channel' | 'send_message' | 'channel_list' | 'online_drivers';
  channelId?: string;
  message?: string;
  callSign?: string;
  driverId?: string;
  messageType?: 'chat' | 'alert' | 'emergency' | 'traffic_update';
  priority?: 'low' | 'normal' | 'high' | 'emergency';
  location?: { latitude: number; longitude: number };
}

class CBRadioWebSocketServer {
  private wss: WebSocketServer;
  private connections: Map<string, CBWebSocketConnection> = new Map();
  private channelConnections: Map<string, Set<CBWebSocketConnection>> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/cb-radio' });
    
    this.wss.on('connection', (ws: CBWebSocketConnection, request) => {
      console.log('🔊 New CB Radio connection established');
      
      // Set up heartbeat
      ws.isAlive = true;
      ws.on('pong', () => { ws.isAlive = true; });

      ws.on('message', (data) => {
        try {
          const message: CBMessage = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('📻 CB Radio message parse error:', error);
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(ws);
      });

      // Send welcome message
      this.sendToConnection(ws, {
        type: 'channel_list',
        channels: []
      });
    });

    // Heartbeat interval
    setInterval(() => {
      this.wss.clients.forEach((ws: CBWebSocketConnection) => {
        if (ws.isAlive === false) {
          this.handleDisconnection(ws);
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    console.log('🚀 CB Radio WebSocket server initialized');
  }

  private async handleMessage(ws: CBWebSocketConnection, message: CBMessage) {
    switch (message.type) {
      case 'join_channel':
        await this.handleJoinChannel(ws, message);
        break;
      case 'leave_channel':
        this.handleLeaveChannel(ws, message);
        break;
      case 'send_message':
        await this.handleSendMessage(ws, message);
        break;
      case 'channel_list':
        await this.handleChannelList(ws);
        break;
      case 'online_drivers':
        await this.handleOnlineDrivers(ws, message);
        break;
    }
  }

  private async handleJoinChannel(ws: CBWebSocketConnection, message: CBMessage) {
    if (!message.channelId || !message.driverId || !message.callSign) {
      return;
    }

    try {
      // Update driver profile with current channel
      await db.update(driverCbProfiles)
        .set({ 
          currentChannelId: message.channelId, 
          isOnline: true,
          lastActivity: new Date()
        })
        .where(eq(driverCbProfiles.driverId, message.driverId));

      // Add to channel subscriptions if not exists
      const existingSubscription = await db.select()
        .from(cbChannelSubscriptions)
        .where(and(
          eq(cbChannelSubscriptions.driverId, message.driverId),
          eq(cbChannelSubscriptions.channelId, message.channelId)
        ));

      if (existingSubscription.length === 0) {
        await db.insert(cbChannelSubscriptions).values({
          driverId: message.driverId,
          channelId: message.channelId,
          isActive: true
        });
      }

      // Update WebSocket connection
      ws.driverId = message.driverId;
      ws.callSign = message.callSign;
      ws.channelId = message.channelId;

      // Add to connections map
      this.connections.set(message.driverId, ws);

      // Add to channel connections
      if (!this.channelConnections.has(message.channelId)) {
        this.channelConnections.set(message.channelId, new Set());
      }
      this.channelConnections.get(message.channelId)!.add(ws);

      // Notify channel of new driver
      const channel = await db.select().from(cbRadioChannels)
        .where(eq(cbRadioChannels.id, message.channelId));

      this.broadcastToChannel(message.channelId, {
        type: 'driver_joined',
        callSign: message.callSign,
        channelName: channel[0]?.channelName || 'Unknown'
      }, ws);

      // Send confirmation to driver
      this.sendToConnection(ws, {
        type: 'channel_joined',
        channelId: message.channelId,
        channelName: channel[0]?.channelName || 'Unknown'
      });

      console.log(`📻 Driver ${message.callSign} joined channel ${channel[0]?.channelName}`);

    } catch (error) {
      console.error('CB Radio join channel error:', error);
    }
  }

  private handleLeaveChannel(ws: CBWebSocketConnection, message: CBMessage) {
    if (ws.channelId && ws.callSign) {
      this.broadcastToChannel(ws.channelId, {
        type: 'driver_left',
        callSign: ws.callSign
      }, ws);

      // Remove from channel connections
      const channelConns = this.channelConnections.get(ws.channelId);
      if (channelConns) {
        channelConns.delete(ws);
      }
    }

    // Clear WebSocket data
    if (ws.driverId) {
      this.connections.delete(ws.driverId);
    }
    ws.channelId = undefined;
    ws.callSign = undefined;
    ws.driverId = undefined;
  }

  private async handleSendMessage(ws: CBWebSocketConnection, message: CBMessage) {
    if (!ws.channelId || !ws.driverId || !ws.callSign || !message.message) {
      return;
    }

    try {
      // Save message to database
      const [savedMessage] = await db.insert(cbRadioMessages).values({
        channelId: ws.channelId,
        senderId: ws.driverId,
        senderCallSign: ws.callSign,
        message: message.message,
        messageType: message.messageType || 'chat',
        priority: message.priority || 'normal',
        latitude: message.location?.latitude?.toString(),
        longitude: message.location?.longitude?.toString(),
        isLocationShared: !!message.location
      }).returning();

      // Broadcast to all drivers in channel
      this.broadcastToChannel(ws.channelId, {
        type: 'message_received',
        messageId: savedMessage.id,
        callSign: ws.callSign,
        message: message.message,
        messageType: message.messageType || 'chat',
        priority: message.priority || 'normal',
        timestamp: new Date().toISOString(),
        location: message.location
      });

      // Update driver activity and increment message count
      const [currentProfile] = await db.select({ totalMessages: driverCbProfiles.totalMessages })
        .from(driverCbProfiles)
        .where(eq(driverCbProfiles.driverId, ws.driverId));
      
      await db.update(driverCbProfiles)
        .set({ 
          lastActivity: new Date(),
          totalMessages: (currentProfile?.totalMessages || 0) + 1
        })
        .where(eq(driverCbProfiles.driverId, ws.driverId));

      console.log(`📻 Message from ${ws.callSign} in channel: ${message.message.substring(0, 50)}...`);

    } catch (error) {
      console.error('CB Radio send message error:', error);
    }
  }

  private async handleChannelList(ws: CBWebSocketConnection) {
    try {
      const channels = await db.select().from(cbRadioChannels)
        .where(eq(cbRadioChannels.isActive, true))
        .orderBy(cbRadioChannels.channelNumber);

      this.sendToConnection(ws, {
        type: 'channel_list',
        channels: channels
      });
    } catch (error) {
      console.error('CB Radio channel list error:', error);
    }
  }

  private async handleOnlineDrivers(ws: CBWebSocketConnection, message: CBMessage) {
    if (!message.channelId) return;

    try {
      const channelConns = this.channelConnections.get(message.channelId);
      const onlineDrivers = Array.from(channelConns || [])
        .filter(conn => conn.callSign && conn.driverId)
        .map(conn => ({
          callSign: conn.callSign,
          driverId: conn.driverId
        }));

      this.sendToConnection(ws, {
        type: 'online_drivers',
        drivers: onlineDrivers
      });
    } catch (error) {
      console.error('CB Radio online drivers error:', error);
    }
  }

  private handleDisconnection(ws: CBWebSocketConnection) {
    if (ws.driverId && ws.callSign && ws.channelId) {
      // Mark driver as offline
      db.update(driverCbProfiles)
        .set({ isOnline: false })
        .where(eq(driverCbProfiles.driverId, ws.driverId))
        .catch(console.error);

      // Notify channel
      this.broadcastToChannel(ws.channelId, {
        type: 'driver_left',
        callSign: ws.callSign
      }, ws);

      // Clean up connections
      this.connections.delete(ws.driverId);
      const channelConns = this.channelConnections.get(ws.channelId);
      if (channelConns) {
        channelConns.delete(ws);
      }

      console.log(`📻 Driver ${ws.callSign} disconnected from CB Radio`);
    }
  }

  private broadcastToChannel(channelId: string, data: any, excludeConnection?: CBWebSocketConnection) {
    const channelConns = this.channelConnections.get(channelId);
    if (!channelConns) return;

    const message = JSON.stringify(data);
    channelConns.forEach(conn => {
      if (conn !== excludeConnection && conn.readyState === WebSocket.OPEN) {
        conn.send(message);
      }
    });
  }

  private sendToConnection(ws: CBWebSocketConnection, data: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  public getConnectionCount(): number {
    return this.wss.clients.size;
  }

  public getChannelCounts(): Map<string, number> {
    const counts = new Map<string, number>();
    this.channelConnections.forEach((connections, channelId) => {
      counts.set(channelId, connections.size);
    });
    return counts;
  }
}

export { CBRadioWebSocketServer };