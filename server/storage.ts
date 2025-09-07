import {
  users,
  transactions,
  userWallets,
  securityLogs,
  vehicles,
  trips,
  locationUpdates,
  securityEvents,
  cbRadioChannels,
  cbRadioMessages,
  driverCbProfiles,
  cbChannelSubscriptions,
  serviceCategories,
  serviceProviders,
  serviceRequests,
  serviceQuotes,
  toolEquipment,
  serviceReviews,
  type User,
  type UpsertUser,
  type Transaction,
  type InsertTransaction,
  type UserWallet,
  type InsertUserWallet,
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
  type CbRadioChannel,
  type InsertCbRadioChannel,
  type CbRadioMessage,
  type InsertCbRadioMessage,
  type DriverCbProfile,
  type InsertDriverCbProfile,
  type CbChannelSubscription,
  type InsertCbChannelSubscription,
  type ServiceCategory,
  type InsertServiceCategory,
  type ServiceProvider,
  type InsertServiceProvider,
  type ServiceRequest,
  type InsertServiceRequest,
  type ServiceQuote,
  type InsertServiceQuote,
  type ToolEquipment,
  type InsertToolEquipment,
  type ServiceReview,
  type InsertServiceReview,
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
  
  // Wallet operations (KWD/YFD Currency System)
  createWallet(wallet: InsertUserWallet): Promise<UserWallet>;
  getUserWallets(userId: string): Promise<UserWallet[]>;
  getUserWalletByCurrency(userId: string, currency: string): Promise<UserWallet | undefined>;
  updateWalletBalance(userId: string, currency: string, amount: number): Promise<UserWallet>;
  addKWDFunds(userId: string, amount: number): Promise<{ wallet: UserWallet; transaction: Transaction }>;
  exchangeCurrency(userId: string, fromCurrency: string, toCurrency: string, amount: number): Promise<{ transaction: Transaction; fromWallet: UserWallet; toWallet: UserWallet }>;
  
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
  
  // CB Radio operations (Driver-to-driver communication)
  getCbRadioChannels(): Promise<CbRadioChannel[]>;
  createCbRadioChannel(channel: InsertCbRadioChannel): Promise<CbRadioChannel>;
  getDriverCbProfile(driverId: string): Promise<DriverCbProfile | undefined>;
  createDriverCbProfile(profile: InsertDriverCbProfile): Promise<DriverCbProfile>;
  updateDriverCbProfile(driverId: string, updateData: Partial<DriverCbProfile>): Promise<DriverCbProfile>;
  getCbRadioMessages(channelId: string, limit?: number): Promise<CbRadioMessage[]>;
  getOnlineDriversInChannel(channelId: string): Promise<DriverCbProfile[]>;
  
  // Services Marketplace operations
  getServiceCategories(): Promise<ServiceCategory[]>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  getServiceProviders(categoryId?: string): Promise<ServiceProvider[]>;
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  getServiceProvider(id: string): Promise<ServiceProvider | undefined>;
  updateServiceProvider(id: string, updateData: Partial<ServiceProvider>): Promise<ServiceProvider>;
  getServiceRequests(userId?: string, status?: string): Promise<ServiceRequest[]>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  getServiceRequest(id: string): Promise<ServiceRequest | undefined>;
  updateServiceRequestStatus(id: string, status: string, providerId?: string): Promise<ServiceRequest>;
  getServiceQuotes(requestId: string): Promise<ServiceQuote[]>;
  createServiceQuote(quote: InsertServiceQuote): Promise<ServiceQuote>;
  acceptServiceQuote(quoteId: string): Promise<ServiceQuote>;
  getToolEquipment(ownerId?: string): Promise<ToolEquipment[]>;
  createToolEquipment(tool: InsertToolEquipment): Promise<ToolEquipment>;
  getServiceReviews(providerId?: string): Promise<ServiceReview[]>;
  createServiceReview(review: InsertServiceReview): Promise<ServiceReview>;
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

  // Wallet operations (KWD/YFD Currency System)
  async createWallet(walletData: InsertUserWallet): Promise<UserWallet> {
    const [wallet] = await db
      .insert(userWallets)
      .values(walletData)
      .returning();
    return wallet;
  }

  async getUserWallets(userId: string): Promise<UserWallet[]> {
    return await db
      .select()
      .from(userWallets)
      .where(and(
        eq(userWallets.userId, userId),
        eq(userWallets.isActive, true)
      ))
      .orderBy(desc(userWallets.updatedAt));
  }

  async getUserWalletByCurrency(userId: string, currency: string): Promise<UserWallet | undefined> {
    const [wallet] = await db
      .select()
      .from(userWallets)
      .where(and(
        eq(userWallets.userId, userId),
        eq(userWallets.currency, currency),
        eq(userWallets.isActive, true)
      ));
    return wallet;
  }

  async updateWalletBalance(userId: string, currency: string, amount: number): Promise<UserWallet> {
    // Get or create wallet
    let wallet = await this.getUserWalletByCurrency(userId, currency);
    
    if (!wallet) {
      wallet = await this.createWallet({
        userId,
        currency,
        balance: '0.00',
        isActive: true,
      });
    }

    const currentBalance = parseFloat(wallet.balance);
    const newBalance = (currentBalance + amount).toFixed(2);

    const [updatedWallet] = await db
      .update(userWallets)
      .set({ 
        balance: newBalance,
        lastTransactionAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(
        eq(userWallets.userId, userId),
        eq(userWallets.currency, currency)
      ))
      .returning();
    return updatedWallet;
  }

  async addKWDFunds(userId: string, amount: number): Promise<{ wallet: UserWallet; transaction: Transaction }> {
    // Update KWD wallet balance
    const wallet = await this.updateWalletBalance(userId, 'KWD', amount);
    
    // Create transaction record
    const transaction = await this.createTransaction({
      userId,
      type: 'yard_cash_add',
      amount: amount.toFixed(2),
      currency: 'KWD',
      status: 'completed',
      description: `Added ${amount} KWD to YardFlex wallet`,
      securityLevel: 'enhanced',
      isSecureTransfer: true,
      exchangeRate: '1.0000', // 1 KWD = 1 YFD
    });

    return { wallet, transaction };
  }

  async exchangeCurrency(userId: string, fromCurrency: string, toCurrency: string, amount: number): Promise<{ transaction: Transaction; fromWallet: UserWallet; toWallet: UserWallet }> {
    // For KWD/YFD: 1 KWD = 1 YFD (perfect 1:1 exchange)
    const exchangeRate = 1.0;
    const convertedAmount = amount * exchangeRate;

    // Update source wallet (subtract)
    const fromWallet = await this.updateWalletBalance(userId, fromCurrency, -amount);
    
    // Update destination wallet (add)
    const toWallet = await this.updateWalletBalance(userId, toCurrency, convertedAmount);

    // Create exchange transaction
    const transaction = await this.createTransaction({
      userId,
      type: 'exchange',
      amount: convertedAmount.toFixed(2),
      currency: toCurrency,
      status: 'completed',
      description: `Exchanged ${amount} ${fromCurrency} to ${convertedAmount} ${toCurrency}`,
      securityLevel: 'enhanced',
      isSecureTransfer: true,
      exchangeRate: exchangeRate.toFixed(4),
      originalCurrency: fromCurrency,
      originalAmount: amount.toFixed(2),
    });

    return { transaction, fromWallet, toWallet };
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

  // CB Radio operations (Driver-to-driver communication)
  async getCbRadioChannels(): Promise<CbRadioChannel[]> {
    return await db
      .select()
      .from(cbRadioChannels)
      .where(eq(cbRadioChannels.isActive, true))
      .orderBy(cbRadioChannels.channelNumber);
  }

  async createCbRadioChannel(channelData: InsertCbRadioChannel): Promise<CbRadioChannel> {
    const [channel] = await db
      .insert(cbRadioChannels)
      .values(channelData)
      .returning();
    return channel;
  }

  async getDriverCbProfile(driverId: string): Promise<DriverCbProfile | undefined> {
    const [profile] = await db
      .select()
      .from(driverCbProfiles)
      .where(eq(driverCbProfiles.driverId, driverId));
    return profile;
  }

  async createDriverCbProfile(profileData: InsertDriverCbProfile): Promise<DriverCbProfile> {
    const [profile] = await db
      .insert(driverCbProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  async updateDriverCbProfile(driverId: string, updateData: Partial<DriverCbProfile>): Promise<DriverCbProfile> {
    const [profile] = await db
      .update(driverCbProfiles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(driverCbProfiles.driverId, driverId))
      .returning();
    return profile;
  }

  async getCbRadioMessages(channelId: string, limit: number = 50): Promise<CbRadioMessage[]> {
    return await db
      .select()
      .from(cbRadioMessages)
      .where(eq(cbRadioMessages.channelId, channelId))
      .orderBy(desc(cbRadioMessages.createdAt))
      .limit(limit);
  }

  async getOnlineDriversInChannel(channelId: string): Promise<DriverCbProfile[]> {
    return await db
      .select()
      .from(driverCbProfiles)
      .innerJoin(cbChannelSubscriptions, eq(driverCbProfiles.driverId, cbChannelSubscriptions.driverId))
      .where(and(
        eq(cbChannelSubscriptions.channelId, channelId),
        eq(cbChannelSubscriptions.isActive, true),
        eq(driverCbProfiles.isOnline, true)
      ))
      .then(results => results.map(row => row.driver_cb_profiles));
  }

  // Services Marketplace operations
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.isActive, true))
      .orderBy(serviceCategories.name);
  }

  async createServiceCategory(categoryData: InsertServiceCategory): Promise<ServiceCategory> {
    const [category] = await db
      .insert(serviceCategories)
      .values(categoryData)
      .returning();
    return category;
  }

  async getServiceProviders(categoryId?: string): Promise<ServiceProvider[]> {
    if (categoryId) {
      // For providers with experience in specific category
      const results = await db
        .selectDistinct({ serviceProvider: serviceProviders })
        .from(serviceProviders)
        .innerJoin(serviceRequests, eq(serviceProviders.id, serviceRequests.providerId))
        .where(and(
          eq(serviceRequests.categoryId, categoryId),
          eq(serviceProviders.isActive, true)
        ));
      return results.map(r => r.serviceProvider);
    }
    
    return await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.isActive, true))
      .orderBy(desc(serviceProviders.rating));
  }

  async createServiceProvider(providerData: InsertServiceProvider): Promise<ServiceProvider> {
    const [provider] = await db
      .insert(serviceProviders)
      .values(providerData)
      .returning();
    return provider;
  }

  async getServiceProvider(id: string): Promise<ServiceProvider | undefined> {
    const [provider] = await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.id, id));
    return provider;
  }

  async updateServiceProvider(id: string, updateData: Partial<ServiceProvider>): Promise<ServiceProvider> {
    const [provider] = await db
      .update(serviceProviders)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(serviceProviders.id, id))
      .returning();
    return provider;
  }

  async getServiceRequests(userId?: string, status?: string): Promise<ServiceRequest[]> {
    const conditions = [];
    if (userId) conditions.push(eq(serviceRequests.customerId, userId));
    if (status) conditions.push(eq(serviceRequests.status, status));
    
    let query = db.select().from(serviceRequests);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(serviceRequests.createdAt));
  }

  async createServiceRequest(requestData: InsertServiceRequest): Promise<ServiceRequest> {
    const [request] = await db
      .insert(serviceRequests)
      .values(requestData)
      .returning();
    return request;
  }

  async getServiceRequest(id: string): Promise<ServiceRequest | undefined> {
    const [request] = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.id, id));
    return request;
  }

  async updateServiceRequestStatus(id: string, status: string, providerId?: string): Promise<ServiceRequest> {
    const updateData: any = { status, updatedAt: new Date() };
    if (providerId) updateData.providerId = providerId;
    
    const [request] = await db
      .update(serviceRequests)
      .set(updateData)
      .where(eq(serviceRequests.id, id))
      .returning();
    return request;
  }

  async getServiceQuotes(requestId: string): Promise<ServiceQuote[]> {
    return await db
      .select()
      .from(serviceQuotes)
      .where(eq(serviceQuotes.requestId, requestId))
      .orderBy(serviceQuotes.amount);
  }

  async createServiceQuote(quoteData: InsertServiceQuote): Promise<ServiceQuote> {
    const [quote] = await db
      .insert(serviceQuotes)
      .values(quoteData)
      .returning();
    return quote;
  }

  async acceptServiceQuote(quoteId: string): Promise<ServiceQuote> {
    const [quote] = await db
      .update(serviceQuotes)
      .set({ isAccepted: true })
      .where(eq(serviceQuotes.id, quoteId))
      .returning();
    return quote;
  }

  async getToolEquipment(ownerId?: string): Promise<ToolEquipment[]> {
    const query = db.select().from(toolEquipment);
    
    if (ownerId) {
      return await query
        .where(eq(toolEquipment.ownerId, ownerId))
        .orderBy(desc(toolEquipment.createdAt));
    }
    
    return await query
      .where(eq(toolEquipment.isAvailable, true))
      .orderBy(toolEquipment.dailyRate);
  }

  async createToolEquipment(toolData: InsertToolEquipment): Promise<ToolEquipment> {
    const [tool] = await db
      .insert(toolEquipment)
      .values(toolData)
      .returning();
    return tool;
  }

  async getServiceReviews(providerId?: string): Promise<ServiceReview[]> {
    const query = db.select().from(serviceReviews);
    
    if (providerId) {
      return await query
        .where(eq(serviceReviews.providerId, providerId))
        .orderBy(desc(serviceReviews.createdAt));
    }
    
    return await query.orderBy(desc(serviceReviews.createdAt));
  }

  async createServiceReview(reviewData: InsertServiceReview): Promise<ServiceReview> {
    const [review] = await db
      .insert(serviceReviews)
      .values(reviewData)
      .returning();
    return review;
  }
}

export const storage = new DatabaseStorage();
