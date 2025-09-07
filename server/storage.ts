import {
  users,
  transactions,
  securityLogs,
  vehicles,
  trips,
  locationUpdates,
  securityEvents,
  type User,
  type UpsertUser,
  type Transaction,
  type InsertTransaction,
  type SecurityLog,
  type InsertSecurityLog,
  type Vehicle,
  type InsertVehicle,
  type Trip,
  type InsertTrip,
  type LocationUpdate,
  type InsertLocationUpdate,
  type SecurityEvent,
  type InsertSecurityEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  updateTransactionStatus(id: string, status: string): Promise<Transaction>;
  
  // Security operations
  logSecurityEvent(log: InsertSecurityLog): Promise<SecurityLog>;
  getSecurityLogs(userId?: string): Promise<SecurityLog[]>;
  getRecentThreats(): Promise<SecurityLog[]>;
  
  // Vehicle operations (Real-time tracking)
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  getVehicle(id: string): Promise<Vehicle | undefined>;
  getUserVehicles(driverId: string): Promise<Vehicle[]>;
  updateVehicleLocation(vehicleId: string, latitude: number, longitude: number): Promise<Vehicle>;
  getActiveVehicles(): Promise<Vehicle[]>;
  
  // Trip operations (Public transparency)
  createTrip(trip: InsertTrip): Promise<Trip>;
  getTrip(id: string): Promise<Trip | undefined>;
  getUserTrips(userId: string): Promise<Trip[]>;
  getPublicTrips(): Promise<Trip[]>;
  updateTripStatus(tripId: string, status: string): Promise<Trip>;
  
  // Location tracking operations
  addLocationUpdate(location: InsertLocationUpdate): Promise<LocationUpdate>;
  getVehicleLocationHistory(vehicleId: string): Promise<LocationUpdate[]>;
  getTripLocationHistory(tripId: string): Promise<LocationUpdate[]>;
  
  // Enhanced security operations (Beyond Interpol)
  createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent>;
  getSecurityEvents(vehicleId?: string): Promise<SecurityEvent[]>;
  getThreatsByLevel(threatLevel: string): Promise<SecurityEvent[]>;
  getUnresolvedThreats(): Promise<SecurityEvent[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Transaction operations
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return transaction;
  }

  async updateTransactionStatus(id: string, status: string): Promise<Transaction> {
    const [transaction] = await db
      .update(transactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return transaction;
  }

  // Security operations
  async logSecurityEvent(logData: InsertSecurityLog): Promise<SecurityLog> {
    const [log] = await db
      .insert(securityLogs)
      .values(logData)
      .returning();
    return log;
  }

  async getSecurityLogs(userId?: string): Promise<SecurityLog[]> {
    if (userId) {
      return await db
        .select()
        .from(securityLogs)
        .where(eq(securityLogs.userId, userId))
        .orderBy(desc(securityLogs.createdAt));
    }
    return await db
      .select()
      .from(securityLogs)
      .orderBy(desc(securityLogs.createdAt));
  }

  async getRecentThreats(): Promise<SecurityLog[]> {
    return await db
      .select()
      .from(securityLogs)
      .where(and(
        eq(securityLogs.eventType, 'threat_detected'),
        eq(securityLogs.threatBlocked, true)
      ))
      .orderBy(desc(securityLogs.createdAt))
      .limit(10);
  }

  // Vehicle operations (Real-time tracking)
  async createVehicle(vehicleData: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db
      .insert(vehicles)
      .values(vehicleData)
      .returning();
    return vehicle;
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, id));
    return vehicle;
  }

  async getUserVehicles(driverId: string): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.driverId, driverId))
      .orderBy(desc(vehicles.createdAt));
  }

  async updateVehicleLocation(vehicleId: string, latitude: number, longitude: number): Promise<Vehicle> {
    const [vehicle] = await db
      .update(vehicles)
      .set({ 
        currentLatitude: latitude.toString(),
        currentLongitude: longitude.toString(),
        lastLocationUpdate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(vehicles.id, vehicleId))
      .returning();
    return vehicle;
  }

  async getActiveVehicles(): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.isActive, true))
      .orderBy(desc(vehicles.lastLocationUpdate));
  }

  // Trip operations (Public transparency)
  async createTrip(tripData: InsertTrip): Promise<Trip> {
    const [trip] = await db
      .insert(trips)
      .values(tripData)
      .returning();
    return trip;
  }

  async getTrip(id: string): Promise<Trip | undefined> {
    const [trip] = await db
      .select()
      .from(trips)
      .where(eq(trips.id, id));
    return trip;
  }

  async getUserTrips(userId: string): Promise<Trip[]> {
    return await db
      .select()
      .from(trips)
      .where(eq(trips.riderId, userId))
      .orderBy(desc(trips.createdAt));
  }

  async getPublicTrips(): Promise<Trip[]> {
    return await db
      .select()
      .from(trips)
      .where(eq(trips.isPubliclyVisible, true))
      .orderBy(desc(trips.createdAt))
      .limit(50);
  }

  async updateTripStatus(tripId: string, status: string): Promise<Trip> {
    const [trip] = await db
      .update(trips)
      .set({ status, updatedAt: new Date() })
      .where(eq(trips.id, tripId))
      .returning();
    return trip;
  }

  // Location tracking operations
  async addLocationUpdate(locationData: InsertLocationUpdate): Promise<LocationUpdate> {
    const [location] = await db
      .insert(locationUpdates)
      .values(locationData)
      .returning();
    return location;
  }

  async getVehicleLocationHistory(vehicleId: string): Promise<LocationUpdate[]> {
    return await db
      .select()
      .from(locationUpdates)
      .where(eq(locationUpdates.vehicleId, vehicleId))
      .orderBy(desc(locationUpdates.timestamp))
      .limit(100);
  }

  async getTripLocationHistory(tripId: string): Promise<LocationUpdate[]> {
    return await db
      .select()
      .from(locationUpdates)
      .where(eq(locationUpdates.tripId, tripId))
      .orderBy(desc(locationUpdates.timestamp));
  }

  // Enhanced security operations (Beyond Interpol)
  async createSecurityEvent(eventData: InsertSecurityEvent): Promise<SecurityEvent> {
    const [event] = await db
      .insert(securityEvents)
      .values(eventData)
      .returning();
    return event;
  }

  async getSecurityEvents(vehicleId?: string): Promise<SecurityEvent[]> {
    if (vehicleId) {
      return await db
        .select()
        .from(securityEvents)
        .where(eq(securityEvents.vehicleId, vehicleId))
        .orderBy(desc(securityEvents.createdAt));
    }
    return await db
      .select()
      .from(securityEvents)
      .orderBy(desc(securityEvents.createdAt));
  }

  async getThreatsByLevel(threatLevel: string): Promise<SecurityEvent[]> {
    return await db
      .select()
      .from(securityEvents)
      .where(eq(securityEvents.threatLevel, threatLevel))
      .orderBy(desc(securityEvents.createdAt))
      .limit(20);
  }

  async getUnresolvedThreats(): Promise<SecurityEvent[]> {
    return await db
      .select()
      .from(securityEvents)
      .where(eq(securityEvents.isResolved, false))
      .orderBy(desc(securityEvents.createdAt));
  }
}

export const storage = new DatabaseStorage();
