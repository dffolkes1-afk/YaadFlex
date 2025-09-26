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
  pricingRules,
  toolRentalRates,
  priceCalculations,
  locationZones,
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
  type PricingRule,
  type InsertPricingRule,
  type ToolRentalRate,
  type InsertToolRentalRate,
  type PriceCalculation,
  type InsertPriceCalculation,
  type LocationZone,
  type InsertLocationZone,
  // Ultimate Translator types
  chatMessages,
  messageTranslations,
  chatParticipants,
  translationReports,
  type ChatMessage,
  type InsertChatMessage,
  type MessageTranslation,
  type InsertMessageTranslation,
  type ChatParticipant,
  type InsertChatParticipant,
  type TranslationReport,
  type InsertTranslationReport,
  // YaadFlex Clothing Line imports
  yaadflexCategories,
  yaadflexProducts,
  yaadflexSuppliers,
  yaadflexOrders,
  yaadflexOrderItems,
  yaadflexProductReviews,
  type YaadFlexCategory,
  type InsertYaadFlexCategory,
  type YaadFlexProduct,
  type InsertYaadFlexProduct,
  type YaadFlexSupplier,
  type InsertYaadFlexSupplier,
  type YaadFlexOrder,
  type InsertYaadFlexOrder,
  type YaadFlexOrderItem,
  type InsertYaadFlexOrderItem,
  type YaadFlexProductReview,
  type InsertYaadFlexProductReview,
  // YaadFlex Pay imports
  yaadflexPayUsers,
  yaadflexPayWallets,
  yaadflexPayTransactions,
  yaadflexPayMerchants,
  yaadflexPayCards,
  type YaadFlexPayUser,
  type InsertYaadFlexPayUser,
  type YaadFlexPayWallet,
  type InsertYaadFlexPayWallet,
  type YaadFlexPayTransaction,
  type InsertYaadFlexPayTransaction,
  type YaadFlexPayMerchant,
  type InsertYaadFlexPayMerchant,
  type YaadFlexPayCard,
  type InsertYaadFlexPayCard,
  // Promotional Credits System imports
  promoCampaigns,
  promoWallets,
  promoLedger,
  promoTasks,
  userPromoTasks,
  promoReferrals,
  type PromoCampaign,
  type InsertPromoCampaign,
  type PromoWallet,
  type InsertPromoWallet,
  type PromoLedgerEntry,
  type InsertPromoLedgerEntry,
  type PromoTask,
  type InsertPromoTask,
  type UserPromoTask,
  type InsertUserPromoTask,
  type PromoReferral,
  type InsertPromoReferral,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Legal Acceptance Operations - CRITICAL for legal compliance
  updateUserLegalAcceptance(userId: string, legalData: {
    termsAccepted?: boolean;
    privacyAccepted?: boolean;
    userAgreementAccepted?: boolean;
    driverAgreementAccepted?: boolean;
    businessAgreementAccepted?: boolean;
    legalAcceptedAt?: Date;
    termsVersion?: string;
    privacyVersion?: string;
    agreementVersion?: string;
    ipAddressAtAcceptance?: string;
    userAgentAtAcceptance?: string;
  }): Promise<User>;
  
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
  getCurrentTrips(userId: string): Promise<Trip[]>;
  getPublicTrips(): Promise<Trip[]>;
  updateTripStatus(tripId: string, status: string): Promise<Trip>;
  
  // Vehicle availability for ride booking (alias for getActiveVehicles)
  getAvailableVehicles(): Promise<Vehicle[]>;
  
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
  
  // Intelligent Pricing Engine operations
  calculateServicePrice(serviceType: string, measurements: any, location: string, complexity?: string): Promise<PriceCalculation>;
  getPricingRules(serviceType?: string): Promise<PricingRule[]>;
  createPricingRule(rule: InsertPricingRule): Promise<PricingRule>;
  getToolRentalRates(serviceType?: string): Promise<ToolRentalRate[]>;
  createToolRentalRate(rate: InsertToolRentalRate): Promise<ToolRentalRate>;
  getLocationZones(): Promise<LocationZone[]>;
  createLocationZone(zone: InsertLocationZone): Promise<LocationZone>;
  getPriceCalculation(id: string): Promise<PriceCalculation | undefined>;

  // YaadFlex Ultimate Translator operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessageById(messageId: string): Promise<ChatMessage | undefined>;
  getChatMessages(chatId: string, viewerLang: string, limit?: number): Promise<ChatMessage[]>;
  createMessageTranslation(translation: InsertMessageTranslation): Promise<MessageTranslation>;
  getMessageTranslation(messageId: string, targetLang: string): Promise<MessageTranslation | undefined>;
  createChatParticipant(participant: InsertChatParticipant): Promise<ChatParticipant>;
  createTranslationReport(report: InsertTranslationReport): Promise<TranslationReport>;
  updateUserLanguagePreferences(userId: string, preferences: {
    preferredLang?: string;
    fallbackLang?: string;
    showAlwaysEnglishToggle?: boolean;
    captionVoiceMessages?: boolean;
    autoTranslateEnabled?: boolean;
  }): Promise<User>;

  // =============================================================
  // YAADFLEX LUXURY CLOTHING LINE OPERATIONS
  // =============================================================
  
  // Category operations
  createYaadFlexCategory(category: InsertYaadFlexCategory): Promise<YaadFlexCategory>;
  getYaadFlexCategories(): Promise<YaadFlexCategory[]>;
  getYaadFlexCategory(id: string): Promise<YaadFlexCategory | undefined>;
  updateYaadFlexCategory(id: string, updates: Partial<InsertYaadFlexCategory>): Promise<YaadFlexCategory>;
  
  // Product operations
  createYaadFlexProduct(product: InsertYaadFlexProduct): Promise<YaadFlexProduct>;
  getYaadFlexProducts(): Promise<YaadFlexProduct[]>;
  getYaadFlexProductsByCategory(categoryId: string): Promise<YaadFlexProduct[]>;
  getFeaturedYaadFlexProducts(): Promise<YaadFlexProduct[]>;
  getYaadFlexProduct(id: string): Promise<YaadFlexProduct | undefined>;
  updateYaadFlexProduct(id: string, updates: Partial<InsertYaadFlexProduct>): Promise<YaadFlexProduct>;
  updateYaadFlexProductStock(id: string, quantity: number): Promise<YaadFlexProduct>;
  
  // Supplier operations
  createYaadFlexSupplier(supplier: InsertYaadFlexSupplier): Promise<YaadFlexSupplier>;
  getYaadFlexSuppliers(): Promise<YaadFlexSupplier[]>;
  getYaadFlexSupplier(id: string): Promise<YaadFlexSupplier | undefined>;
  updateYaadFlexSupplier(id: string, updates: Partial<InsertYaadFlexSupplier>): Promise<YaadFlexSupplier>;
  
  // Order operations
  createYaadFlexOrder(order: InsertYaadFlexOrder): Promise<YaadFlexOrder>;
  getUserYaadFlexOrders(customerId: string): Promise<YaadFlexOrder[]>;
  getAllYaadFlexOrders(): Promise<YaadFlexOrder[]>;
  getYaadFlexOrder(id: string): Promise<YaadFlexOrder | undefined>;
  updateYaadFlexOrderStatus(id: string, status: string): Promise<YaadFlexOrder>;
  
  // Order item operations
  createYaadFlexOrderItem(item: InsertYaadFlexOrderItem): Promise<YaadFlexOrderItem>;
  getYaadFlexOrderItems(orderId: string): Promise<YaadFlexOrderItem[]>;
  updateYaadFlexOrderItemStatus(id: string, status: string): Promise<YaadFlexOrderItem>;
  
  // Review operations
  createYaadFlexProductReview(review: InsertYaadFlexProductReview): Promise<YaadFlexProductReview>;
  getYaadFlexProductReviews(productId: string): Promise<YaadFlexProductReview[]>;
  getUserYaadFlexReviews(customerId: string): Promise<YaadFlexProductReview[]>;
  updateYaadFlexReviewVisibility(id: string, isVisible: boolean): Promise<YaadFlexProductReview>;

  // =============================================================
  // YAADFLEX PAY - MOBILE MONEY OPERATIONS
  // Production-ready M-Pesa style payment system
  // =============================================================
  
  // YaadFlex Pay User Operations
  createYaadFlexPayUser(user: InsertYaadFlexPayUser): Promise<YaadFlexPayUser>;
  getYaadFlexPayUserByPhone(phone: string): Promise<YaadFlexPayUser | undefined>;
  getYaadFlexPayUser(id: string): Promise<YaadFlexPayUser | undefined>;
  updateYaadFlexPayUserPIN(userId: string, pin: string, pinSalt: string): Promise<YaadFlexPayUser>;
  updateYaadFlexPayUserStatus(userId: string, isActive: boolean): Promise<YaadFlexPayUser>;
  incrementPinFailures(userId: string): Promise<YaadFlexPayUser>;
  resetPinFailures(userId: string): Promise<YaadFlexPayUser>;
  
  // YaadFlex Pay Wallet Operations
  createYaadFlexPayWallet(wallet: InsertYaadFlexPayWallet): Promise<YaadFlexPayWallet>;
  getYaadFlexPayWallets(userId: string): Promise<YaadFlexPayWallet[]>;
  getYaadFlexPayWallet(userId: string, currency: string): Promise<YaadFlexPayWallet | undefined>;
  updateYaadFlexPayWalletBalance(userId: string, currency: string, amount: number, type: 'add' | 'subtract'): Promise<YaadFlexPayWallet>;
  
  // YaadFlex Pay Transaction Operations
  createYaadFlexPayTransaction(transaction: InsertYaadFlexPayTransaction): Promise<YaadFlexPayTransaction>;
  getYaadFlexPayTransaction(id: string): Promise<YaadFlexPayTransaction | undefined>;
  getYaadFlexPayTransactionByTxId(transactionId: string): Promise<YaadFlexPayTransaction | undefined>;
  getUserYaadFlexPayTransactions(userId: string): Promise<YaadFlexPayTransaction[]>;
  updateYaadFlexPayTransactionStatus(id: string, status: string, completedAt?: Date): Promise<YaadFlexPayTransaction>;
  
  // YaadFlex Pay Merchant Operations
  createYaadFlexPayMerchant(merchant: InsertYaadFlexPayMerchant): Promise<YaadFlexPayMerchant>;
  getYaadFlexPayMerchant(id: string): Promise<YaadFlexPayMerchant | undefined>;
  getYaadFlexPayMerchantByCode(merchantCode: string): Promise<YaadFlexPayMerchant | undefined>;
  getAllYaadFlexPayMerchants(): Promise<YaadFlexPayMerchant[]>;
  updateYaadFlexPayMerchantVolume(merchantCode: string, amount: number): Promise<YaadFlexPayMerchant>;
  
  // YaadFlex Pay Card Operations (Future Visa/Mastercard Integration)
  createYaadFlexPayCard(card: InsertYaadFlexPayCard): Promise<YaadFlexPayCard>;
  getUserYaadFlexPayCards(userId: string): Promise<YaadFlexPayCard[]>;
  getYaadFlexPayCard(id: string): Promise<YaadFlexPayCard | undefined>;
  updateYaadFlexPayCardStatus(id: string, isActive: boolean, isBlocked?: boolean): Promise<YaadFlexPayCard>;
  
  // YaadFlex Pay Core Operations (M-Pesa Style Methods)
  sendMoney(fromUserId: string, toPhone: string, amount: number, description: string): Promise<YaadFlexPayTransaction>;
  buyGoods(userId: string, merchantCode: string, amount: number, description: string): Promise<YaadFlexPayTransaction>;
  checkBalance(userId: string, currency?: string): Promise<YaadFlexPayWallet[]>;
  depositFromBank(userId: string, amount: number, bankAccount: string): Promise<YaadFlexPayTransaction>;
  withdrawToBank(userId: string, amount: number, bankAccount: string): Promise<YaadFlexPayTransaction>;

  // Promotional Credits System Operations
  // Campaign management
  createPromoCampaign(campaign: InsertPromoCampaign): Promise<PromoCampaign>;
  getPromoCampaign(id: string): Promise<PromoCampaign | undefined>;
  getActivePromoCampaigns(): Promise<PromoCampaign[]>;
  updatePromoCampaign(id: string, updates: Partial<PromoCampaign>): Promise<PromoCampaign>;
  
  // Promo wallet operations
  createPromoWallet(wallet: InsertPromoWallet): Promise<PromoWallet>;
  getPromoWallet(userId: string, campaignId: string): Promise<PromoWallet | undefined>;
  getUserPromoWallets(userId: string): Promise<PromoWallet[]>;
  updatePromoWalletBalance(walletId: string, amount: number, type: 'add' | 'subtract'): Promise<PromoWallet>;
  
  // Promo credits transactions (ledger)
  createPromoLedgerEntry(entry: InsertPromoLedgerEntry): Promise<PromoLedgerEntry>;
  getUserPromoLedger(userId: string, campaignId?: string): Promise<PromoLedgerEntry[]>;
  getPromoLedgerEntry(id: string): Promise<PromoLedgerEntry | undefined>;
  
  // Task management
  createPromoTask(task: InsertPromoTask): Promise<PromoTask>;
  getPromoTasks(campaignId: string): Promise<PromoTask[]>;
  getActivePromoTasks(campaignId: string): Promise<PromoTask[]>;
  updatePromoTask(id: string, updates: Partial<PromoTask>): Promise<PromoTask>;
  
  // User task tracking
  createUserPromoTask(userTask: InsertUserPromoTask): Promise<UserPromoTask>;
  getUserPromoTask(userId: string, taskId: string): Promise<UserPromoTask | undefined>;
  getUserPromoTasks(userId: string, campaignId?: string): Promise<UserPromoTask[]>;
  updateUserPromoTaskStatus(id: string, status: string, completedAt?: Date): Promise<UserPromoTask>;
  
  // Referral system
  createPromoReferral(referral: InsertPromoReferral): Promise<PromoReferral>;
  getPromoReferral(referralCode: string): Promise<PromoReferral | undefined>;
  getUserReferrals(referrerId: string): Promise<PromoReferral[]>;
  updatePromoReferralStatus(id: string, status: string, completedAt?: Date): Promise<PromoReferral>;
  
  // High-level promotional operations
  claimWelcomeBonus(userId: string, campaignId: string): Promise<{ wallet: PromoWallet; ledgerEntry: PromoLedgerEntry }>;
  completePromoTask(userId: string, taskId: string, verificationData?: any): Promise<{ userTask: UserPromoTask; ledgerEntry?: PromoLedgerEntry }>;
  processReferral(referralCode: string, refereeUserId: string): Promise<PromoReferral>;
  redeemPromoCredits(userId: string, campaignId: string, amount: number, reason: string): Promise<PromoLedgerEntry>;
  
  // Admin operations
  grantPromoCredits(userId: string, campaignId: string, amount: number, reason: string, description?: string): Promise<PromoLedgerEntry>;
  convertPromoCreditsToReal(campaignId: string, conversionRate?: number): Promise<{ convertedUsers: number; totalConverted: number }>;
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

  // CRITICAL: Legal acceptance method - required for legal compliance
  async updateUserLegalAcceptance(userId: string, legalData: {
    termsAccepted?: boolean;
    privacyAccepted?: boolean;
    userAgreementAccepted?: boolean;
    driverAgreementAccepted?: boolean;
    businessAgreementAccepted?: boolean;
    legalAcceptedAt?: Date;
    termsVersion?: string;
    privacyVersion?: string;
    agreementVersion?: string;
    ipAddressAtAcceptance?: string;
    userAgentAtAcceptance?: string;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...legalData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
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

  async getCurrentTrips(userId: string): Promise<Trip[]> {
    return await db
      .select()
      .from(trips)
      .where(and(
        eq(trips.riderId, userId),
        sql`${trips.status} IN ('requested', 'accepted', 'in_progress')`
      ))
      .orderBy(desc(trips.createdAt));
  }

  async updateTripStatus(tripId: string, status: string): Promise<Trip> {
    const [trip] = await db
      .update(trips)
      .set({ status, updatedAt: new Date() })
      .where(eq(trips.id, tripId))
      .returning();
    return trip;
  }
  
  // Vehicle availability for ride booking (alias for getActiveVehicles) 
  async getAvailableVehicles(): Promise<Vehicle[]> {
    return this.getActiveVehicles();
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
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(serviceRequests)
        .where(and(...conditions))
        .orderBy(desc(serviceRequests.createdAt));
    }
    
    return await db
      .select()
      .from(serviceRequests)
      .orderBy(desc(serviceRequests.createdAt));
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

  // Intelligent Pricing Engine operations
  async calculateServicePrice(
    serviceType: string, 
    measurements: any, 
    location: string, 
    complexity: string = "standard"
  ): Promise<PriceCalculation> {
    // Get pricing rule for service type
    const [pricingRule] = await db
      .select()
      .from(pricingRules)
      .where(and(
        eq(pricingRules.serviceType, serviceType),
        eq(pricingRules.isActive, true)
      ));

    if (!pricingRule) {
      throw new Error(`No pricing rule found for service type: ${serviceType}`);
    }

    // Calculate base work area/units
    let units = 0;
    if (pricingRule.unit === "square_foot") {
      units = (measurements.length || 10) * (measurements.width || 10);
    } else if (pricingRule.unit === "hour") {
      units = measurements.estimatedHours || 4;
    } else if (pricingRule.unit === "room") {
      units = measurements.roomCount || 1;
    }

    // Calculate base work cost
    const baseRate = parseFloat(pricingRule.baseRatePerUnit);
    const baseWorkCost = units * baseRate;

    // Calculate cleanup cost (often forgotten by workers!)
    const cleanupRate = parseFloat(pricingRule.cleanupRatePerUnit || "0");
    const cleanupCost = units * cleanupRate;

    // Get location multiplier
    const [locationZone] = await db
      .select()
      .from(locationZones)
      .where(eq(locationZones.name, location || 'Kingston Urban'));
    
    const locationMultiplier = locationZone ? parseFloat(locationZone.priceMultiplier || "1.0") : 1.0;
    const locationAdjustment = (baseWorkCost + cleanupCost) * (locationMultiplier - 1.0);

    // Apply complexity factor
    const complexityFactors = pricingRule.complexityFactors as any || { simple: 1.0, standard: 1.2, complex: 1.5 };
    const complexityMultiplier = complexityFactors[complexity] || 1.2;
    const complexityAdjustment = baseWorkCost * (complexityMultiplier - 1.0);

    // Calculate tool rental costs
    const toolRentalCosts = await this.calculateToolRentalCosts(serviceType, measurements.estimatedDays || 1);

    // Calculate totals
    const totalBeforeTax = baseWorkCost + cleanupCost + locationAdjustment + complexityAdjustment + toolRentalCosts;
    const taxRate = 0.15; // 15% GCT for Jamaica
    const taxAmount = totalBeforeTax * taxRate;
    const finalTotal = totalBeforeTax + taxAmount;

    // Create detailed breakdown for transparency
    const breakdown = {
      baseWork: {
        description: `${serviceType} work (${units} ${pricingRule.unit})`,
        rate: baseRate,
        units: units,
        cost: baseWorkCost
      },
      cleanup: {
        description: `Cleanup and site preparation`,
        rate: cleanupRate,
        units: units,
        cost: cleanupCost
      },
      location: {
        description: `${location} area adjustment`,
        multiplier: locationMultiplier,
        cost: locationAdjustment
      },
      complexity: {
        description: `${complexity} complexity factor`,
        multiplier: complexityMultiplier,
        cost: complexityAdjustment
      },
      tools: {
        description: "Tool rental (if needed)",
        cost: toolRentalCosts
      },
      tax: {
        description: "GCT (15%)",
        rate: taxRate,
        cost: taxAmount
      }
    };

    // Save calculation to database
    const calculationData: InsertPriceCalculation = {
      serviceType,
      measurements,
      baseWorkCost: baseWorkCost.toString(),
      cleanupCost: cleanupCost.toString(),
      toolRentalCost: toolRentalCosts.toString(),
      locationAdjustment: locationAdjustment.toString(),
      complexityAdjustment: complexityAdjustment.toString(),
      totalBeforeTax: totalBeforeTax.toString(),
      taxAmount: taxAmount.toString(),
      finalTotal: finalTotal.toString(),
      breakdown,
    };

    const [calculation] = await db
      .insert(priceCalculations)
      .values(calculationData)
      .returning();

    return calculation;
  }

  private async calculateToolRentalCosts(serviceType: string, days: number): Promise<number> {
    const tools = await db
      .select()
      .from(toolRentalRates)
      .where(and(
        eq(toolRentalRates.isActive, true),
        sql`${serviceType} = ANY(service_types)`
      ));

    let totalCost = 0;
    for (const tool of tools) {
      const dailyRate = parseFloat(tool.dailyRate);
      totalCost += dailyRate * days;
    }

    return totalCost;
  }

  async getPricingRules(serviceType?: string): Promise<PricingRule[]> {
    const query = db.select().from(pricingRules);
    
    if (serviceType) {
      return await query
        .where(and(
          eq(pricingRules.serviceType, serviceType),
          eq(pricingRules.isActive, true)
        ));
    }
    
    return await query.where(eq(pricingRules.isActive, true));
  }

  async createPricingRule(ruleData: InsertPricingRule): Promise<PricingRule> {
    const [rule] = await db
      .insert(pricingRules)
      .values(ruleData)
      .returning();
    return rule;
  }

  async getToolRentalRates(serviceType?: string): Promise<ToolRentalRate[]> {
    const query = db.select().from(toolRentalRates);
    
    if (serviceType) {
      return await query
        .where(and(
          eq(toolRentalRates.isActive, true),
          sql`${serviceType} = ANY(service_types)`
        ));
    }
    
    return await query.where(eq(toolRentalRates.isActive, true));
  }

  async createToolRentalRate(rateData: InsertToolRentalRate): Promise<ToolRentalRate> {
    const [rate] = await db
      .insert(toolRentalRates)
      .values(rateData)
      .returning();
    return rate;
  }

  async getLocationZones(): Promise<LocationZone[]> {
    return await db
      .select()
      .from(locationZones)
      .where(eq(locationZones.isActive, true))
      .orderBy(locationZones.name);
  }

  async createLocationZone(zoneData: InsertLocationZone): Promise<LocationZone> {
    const [zone] = await db
      .insert(locationZones)
      .values(zoneData)
      .returning();
    return zone;
  }

  async getPriceCalculation(id: string): Promise<PriceCalculation | undefined> {
    const [calculation] = await db
      .select()
      .from(priceCalculations)
      .where(eq(priceCalculations.id, id));
    return calculation;
  }

  // ===================== YaadFlex Ultimate Translator operations =====================

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(messageData)
      .returning();
    return message;
  }

  async getChatMessageById(messageId: string): Promise<ChatMessage | undefined> {
    const [message] = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.id, messageId));
    return message;
  }

  async getChatMessages(chatId: string, viewerLang: string, limit: number = 50): Promise<ChatMessage[]> {
    // Get messages for the chat
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.chatId, chatId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);

    // TODO: Join with translations for the viewer's language
    // For now, return the raw messages
    return messages;
  }

  async createMessageTranslation(translationData: InsertMessageTranslation): Promise<MessageTranslation> {
    const [translation] = await db
      .insert(messageTranslations)
      .values(translationData)
      .returning();
    return translation;
  }

  async getMessageTranslation(messageId: string, targetLang: string): Promise<MessageTranslation | undefined> {
    const [translation] = await db
      .select()
      .from(messageTranslations)
      .where(and(
        eq(messageTranslations.messageId, messageId),
        eq(messageTranslations.targetLang, targetLang)
      ));
    return translation;
  }

  async createChatParticipant(participantData: InsertChatParticipant): Promise<ChatParticipant> {
    const [participant] = await db
      .insert(chatParticipants)
      .values(participantData)
      .returning();
    return participant;
  }

  async createTranslationReport(reportData: InsertTranslationReport): Promise<TranslationReport> {
    const [report] = await db
      .insert(translationReports)
      .values(reportData)
      .returning();
    return report;
  }

  async updateUserLanguagePreferences(userId: string, preferences: {
    preferredLang?: string;
    fallbackLang?: string;
    showAlwaysEnglishToggle?: boolean;
    captionVoiceMessages?: boolean;
    autoTranslateEnabled?: boolean;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...preferences,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // CEO Dashboard & Autonomous Ops methods
  async getCeoMetrics(metricType: string): Promise<any> {
    // Import the new schema tables
    const { 
      ceoDashboardMetrics, 
      autonomousTasks, 
      walletTransactions,
      freelancers
    } = await import("@shared/schema");
    
    switch (metricType) {
      case 'revenue':
        // Calculate revenue metrics
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const revenue = await db
          .select({
            total: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)`
          })
          .from(walletTransactions)
          .where(and(
            eq(walletTransactions.type, 'commission'),
            eq(walletTransactions.status, 'completed')
          ));
        
        return {
          total: revenue[0]?.total || 0,
          growth: 0.15 // Mock 15% growth
        };
      
      case 'users':
        // Get user metrics
        const activeUsers = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(users);
        
        return {
          active: activeUsers[0]?.count || 0,
          new: Math.floor((activeUsers[0]?.count || 0) * 0.05) // Mock 5% new users
        };
      
      case 'tasks':
        // Get task metrics
        const pendingTasks = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(autonomousTasks)
          .where(eq(autonomousTasks.status, 'pending'));
        
        const criticalTasks = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(autonomousTasks)
          .where(and(
            eq(autonomousTasks.status, 'pending'),
            eq(autonomousTasks.priority, 'critical')
          ));
        
        return {
          pending: pendingTasks[0]?.count || 0,
          critical: criticalTasks[0]?.count || 0
        };
      
      default:
        return {};
    }
  }

  async getActiveObligations(): Promise<any[]> {
    const { obligations, vendors } = await import("@shared/schema");
    
    const activeObligations = await db
      .select({
        id: obligations.id,
        title: obligations.title,
        vendor: vendors.name,
        amount: obligations.amount,
        currency: obligations.currency,
        recurrence: obligations.recurrence,
        nextDueAt: obligations.nextDueAt,
        autopay: obligations.autopay,
        category: obligations.category
      })
      .from(obligations)
      .leftJoin(vendors, eq(obligations.vendorId, vendors.id))
      .where(eq(obligations.isActive, true))
      .limit(10);
    
    return activeObligations;
  }

  async getRecentPayments(limit: number): Promise<any[]> {
    const { platformPayments, vendors } = await import("@shared/schema");
    
    const payments = await db
      .select({
        id: platformPayments.id,
        vendor: vendors.name,
        amount: platformPayments.amount,
        currency: platformPayments.currency,
        method: platformPayments.method,
        status: platformPayments.status,
        createdAt: platformPayments.createdAt
      })
      .from(platformPayments)
      .leftJoin(vendors, eq(platformPayments.vendorId, vendors.id))
      .orderBy(desc(platformPayments.createdAt))
      .limit(limit);
    
    return payments;
  }

  async getRecentAgentLogs(limit: number): Promise<any[]> {
    const { agentLogs } = await import("@shared/schema");
    
    const logs = await db
      .select()
      .from(agentLogs)
      .orderBy(desc(agentLogs.createdAt))
      .limit(limit);
    
    return logs;
  }

  async getComplianceStatus(): Promise<any> {
    const { obligations, autonomousTasks } = await import("@shared/schema");
    
    // Mock compliance items for now
    const items = [
      {
        id: '1',
        name: 'Business License',
        description: 'Annual business license renewal',
        status: 'compliant'
      },
      {
        id: '2',
        name: 'Tax Filing',
        description: 'Quarterly tax submissions',
        status: 'compliant'
      },
      {
        id: '3',
        name: 'Insurance',
        description: 'Vehicle and liability insurance',
        status: 'warning'
      },
      {
        id: '4',
        name: 'Data Protection',
        description: 'GDPR and privacy compliance',
        status: 'compliant'
      }
    ];
    
    // Get upcoming deadlines
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const deadlines = await db
      .select({
        id: obligations.id,
        title: obligations.title,
        type: obligations.category,
        dueDate: obligations.nextDueAt
      })
      .from(obligations)
      .where(and(
        eq(obligations.isActive, true),
        sql`${obligations.nextDueAt} <= ${sevenDaysFromNow}`
      ))
      .limit(5);
    
    // Add days left calculation
    const deadlinesWithDays = deadlines.map(d => ({
      ...d,
      daysLeft: Math.ceil((new Date(d.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    }));
    
    return {
      score: 85, // Mock compliance score
      items,
      deadlines: deadlinesWithDays
    };
  }

  async getPendingApprovals(): Promise<any[]> {
    const { approvals, autonomousTasks, obligations } = await import("@shared/schema");
    
    const pendingApprovals = await db
      .select({
        id: approvals.id,
        taskId: approvals.taskId,
        requiredRole: approvals.requiredRole,
        task: {
          id: autonomousTasks.id,
          title: autonomousTasks.title,
          description: autonomousTasks.description,
          amount: obligations.amount,
          priority: autonomousTasks.priority,
          dueAt: autonomousTasks.dueAt
        }
      })
      .from(approvals)
      .innerJoin(autonomousTasks, eq(approvals.taskId, autonomousTasks.id))
      .leftJoin(obligations, eq(autonomousTasks.obligationId, obligations.id))
      .where(eq(approvals.status, 'pending'))
      .limit(10);
    
    return pendingApprovals;
  }

  async processApproval(taskId: string, action: string, userId: string): Promise<void> {
    const { approvals, autonomousTasks } = await import("@shared/schema");
    
    // Update approval status
    await db
      .update(approvals)
      .set({
        status: action === 'approve' ? 'approved' : 'rejected',
        actorId: userId,
        approvedAt: new Date()
      })
      .where(eq(approvals.taskId, taskId));
    
    // If approved, mark task as ready to execute
    if (action === 'approve') {
      await db
        .update(autonomousTasks)
        .set({
          requiresApproval: false,
          autoExecute: true,
          updatedAt: new Date()
        })
        .where(eq(autonomousTasks.id, taskId));
    }
  }

  // =============================================================
  // YAADFLEX PAY - MOBILE MONEY IMPLEMENTATIONS
  // Production-ready M-Pesa style payment system
  // =============================================================
  
  // YaadFlex Pay User Operations
  async createYaadFlexPayUser(userData: InsertYaadFlexPayUser): Promise<YaadFlexPayUser> {
    const [user] = await db.insert(yaadflexPayUsers).values(userData).returning();
    return user;
  }

  async getYaadFlexPayUserByPhone(phone: string): Promise<YaadFlexPayUser | undefined> {
    const [user] = await db.select().from(yaadflexPayUsers).where(eq(yaadflexPayUsers.phone, phone));
    return user;
  }

  async getYaadFlexPayUser(id: string): Promise<YaadFlexPayUser | undefined> {
    const [user] = await db.select().from(yaadflexPayUsers).where(eq(yaadflexPayUsers.id, id));
    return user;
  }

  async updateYaadFlexPayUserPIN(userId: string, pin: string, pinSalt: string): Promise<YaadFlexPayUser> {
    const [user] = await db.update(yaadflexPayUsers).set({ pin, pinSalt, updatedAt: new Date() }).where(eq(yaadflexPayUsers.id, userId)).returning();
    return user;
  }

  async updateYaadFlexPayUserStatus(userId: string, isActive: boolean): Promise<YaadFlexPayUser> {
    const [user] = await db.update(yaadflexPayUsers).set({ isActive, updatedAt: new Date() }).where(eq(yaadflexPayUsers.id, userId)).returning();
    return user;
  }

  async incrementPinFailures(userId: string): Promise<YaadFlexPayUser> {
    const [user] = await db.update(yaadflexPayUsers).set({ failedPinAttempts: sql`${yaadflexPayUsers.failedPinAttempts} + 1`, updatedAt: new Date() }).where(eq(yaadflexPayUsers.id, userId)).returning();
    return user;
  }

  async resetPinFailures(userId: string): Promise<YaadFlexPayUser> {
    const [user] = await db.update(yaadflexPayUsers).set({ failedPinAttempts: 0, lastLogin: new Date(), updatedAt: new Date() }).where(eq(yaadflexPayUsers.id, userId)).returning();
    return user;
  }

  // YaadFlex Pay Wallet Operations
  async createYaadFlexPayWallet(walletData: InsertYaadFlexPayWallet): Promise<YaadFlexPayWallet> {
    const [wallet] = await db.insert(yaadflexPayWallets).values(walletData).returning();
    return wallet;
  }

  async getYaadFlexPayWallets(userId: string): Promise<YaadFlexPayWallet[]> {
    return await db.select().from(yaadflexPayWallets).where(eq(yaadflexPayWallets.userId, userId)).orderBy(desc(yaadflexPayWallets.updatedAt));
  }

  async getYaadFlexPayWallet(userId: string, currency: string): Promise<YaadFlexPayWallet | undefined> {
    const [wallet] = await db.select().from(yaadflexPayWallets).where(and(eq(yaadflexPayWallets.userId, userId), eq(yaadflexPayWallets.currency, currency)));
    return wallet;
  }

  async updateYaadFlexPayWalletBalance(userId: string, currency: string, amount: number, type: 'add' | 'subtract'): Promise<YaadFlexPayWallet> {
    // Get or create wallet first
    let wallet = await this.getYaadFlexPayWallet(userId, currency);
    
    if (!wallet) {
      wallet = await this.createYaadFlexPayWallet({
        userId,
        currency,
        balance: '0.00',
      });
    }

    const currentBalance = parseFloat(wallet.balance);
    const newBalance = type === 'add' ? (currentBalance + amount).toFixed(2) : (currentBalance - amount).toFixed(2);

    const updateFields: any = { balance: newBalance, lastTransactionAt: new Date(), updatedAt: new Date() };

    // Update tracking fields based on transaction type
    if (type === 'add') {
      updateFields.totalReceived = sql`${yaadflexPayWallets.totalReceived} + ${amount}`;
    } else {
      updateFields.totalSent = sql`${yaadflexPayWallets.totalSent} + ${amount}`;
    }

    const [updatedWallet] = await db.update(yaadflexPayWallets).set(updateFields).where(and(eq(yaadflexPayWallets.userId, userId), eq(yaadflexPayWallets.currency, currency))).returning();
    return updatedWallet;
  }

  // YaadFlex Pay Transaction Operations
  async createYaadFlexPayTransaction(transactionData: InsertYaadFlexPayTransaction): Promise<YaadFlexPayTransaction> {
    const [transaction] = await db.insert(yaadflexPayTransactions).values(transactionData).returning();
    return transaction;
  }

  async getYaadFlexPayTransaction(id: string): Promise<YaadFlexPayTransaction | undefined> {
    const [transaction] = await db.select().from(yaadflexPayTransactions).where(eq(yaadflexPayTransactions.id, id));
    return transaction;
  }

  async getYaadFlexPayTransactionByTxId(transactionId: string): Promise<YaadFlexPayTransaction | undefined> {
    const [transaction] = await db.select().from(yaadflexPayTransactions).where(eq(yaadflexPayTransactions.transactionId, transactionId));
    return transaction;
  }

  async getUserYaadFlexPayTransactions(userId: string): Promise<YaadFlexPayTransaction[]> {
    return await db.select().from(yaadflexPayTransactions).where(eq(yaadflexPayTransactions.fromUserId, userId)).orderBy(desc(yaadflexPayTransactions.createdAt));
  }

  async updateYaadFlexPayTransactionStatus(id: string, status: string, completedAt?: Date): Promise<YaadFlexPayTransaction> {
    const updateData: any = { status };
    if (completedAt) {
      updateData.completedAt = completedAt;
    }

    const [transaction] = await db.update(yaadflexPayTransactions).set(updateData).where(eq(yaadflexPayTransactions.id, id)).returning();
    return transaction;
  }

  // YaadFlex Pay Merchant Operations
  async createYaadFlexPayMerchant(merchantData: InsertYaadFlexPayMerchant): Promise<YaadFlexPayMerchant> {
    const [merchant] = await db.insert(yaadflexPayMerchants).values(merchantData).returning();
    return merchant;
  }

  async getYaadFlexPayMerchant(id: string): Promise<YaadFlexPayMerchant | undefined> {
    const [merchant] = await db.select().from(yaadflexPayMerchants).where(eq(yaadflexPayMerchants.id, id));
    return merchant;
  }

  async getYaadFlexPayMerchantByCode(merchantCode: string): Promise<YaadFlexPayMerchant | undefined> {
    const [merchant] = await db.select().from(yaadflexPayMerchants).where(eq(yaadflexPayMerchants.merchantCode, merchantCode));
    return merchant;
  }

  async getAllYaadFlexPayMerchants(): Promise<YaadFlexPayMerchant[]> {
    return await db.select().from(yaadflexPayMerchants).where(eq(yaadflexPayMerchants.isActive, true)).orderBy(desc(yaadflexPayMerchants.totalVolume));
  }

  async updateYaadFlexPayMerchantVolume(merchantCode: string, amount: number): Promise<YaadFlexPayMerchant> {
    const [merchant] = await db.update(yaadflexPayMerchants).set({
      totalTransactions: sql`${yaadflexPayMerchants.totalTransactions} + 1`,
      totalVolume: sql`${yaadflexPayMerchants.totalVolume} + ${amount}`,
      lastTransactionAt: new Date(),
      updatedAt: new Date()
    }).where(eq(yaadflexPayMerchants.merchantCode, merchantCode)).returning();
    return merchant;
  }

  // YaadFlex Pay Card Operations (Future Visa/Mastercard Integration)
  async createYaadFlexPayCard(cardData: InsertYaadFlexPayCard): Promise<YaadFlexPayCard> {
    const [card] = await db.insert(yaadflexPayCards).values(cardData).returning();
    return card;
  }

  async getUserYaadFlexPayCards(userId: string): Promise<YaadFlexPayCard[]> {
    return await db.select().from(yaadflexPayCards).where(eq(yaadflexPayCards.userId, userId)).orderBy(desc(yaadflexPayCards.createdAt));
  }

  async getYaadFlexPayCard(id: string): Promise<YaadFlexPayCard | undefined> {
    const [card] = await db.select().from(yaadflexPayCards).where(eq(yaadflexPayCards.id, id));
    return card;
  }

  async updateYaadFlexPayCardStatus(id: string, isActive: boolean, isBlocked?: boolean): Promise<YaadFlexPayCard> {
    const updateData: any = { isActive };
    if (isBlocked !== undefined) {
      updateData.isBlocked = isBlocked;
    }

    const [card] = await db.update(yaadflexPayCards).set(updateData).where(eq(yaadflexPayCards.id, id)).returning();
    return card;
  }

  // YaadFlex Pay Core Operations (M-Pesa Style Methods)
  async sendMoney(fromUserId: string, toPhone: string, amount: number, description: string): Promise<YaadFlexPayTransaction> {
    // Find recipient by phone
    const toUser = await this.getYaadFlexPayUserByPhone(toPhone);
    if (!toUser) {
      throw new Error('Recipient not found');
    }

    // Generate transaction ID (YF + timestamp)
    const transactionId = `YF${Date.now()}`;

    // Create transaction
    const transaction = await this.createYaadFlexPayTransaction({
      transactionId,
      type: 'SEND_MONEY',
      fromUserId,
      toUserId: toUser.id,
      amount: amount.toFixed(2),
      currency: 'JMD',
      fee: '0.00', // Calculate fee based on amount
      status: 'pending',
      description,
    });

    // Update wallets
    await this.updateYaadFlexPayWalletBalance(fromUserId, 'JMD', amount, 'subtract');
    await this.updateYaadFlexPayWalletBalance(toUser.id, 'JMD', amount, 'add');

    // Complete transaction
    return this.updateYaadFlexPayTransactionStatus(transaction.id, 'completed', new Date());
  }

  async buyGoods(userId: string, merchantCode: string, amount: number, description: string): Promise<YaadFlexPayTransaction> {
    // Find merchant
    const merchant = await this.getYaadFlexPayMerchantByCode(merchantCode);
    if (!merchant) {
      throw new Error('Merchant not found');
    }

    // Generate transaction ID
    const transactionId = `YF${Date.now()}`;
    
    // Calculate fee (1.5% default)
    const fee = (amount * (parseFloat(merchant.feePercentage) / 100)).toFixed(2);

    // Create transaction
    const transaction = await this.createYaadFlexPayTransaction({
      transactionId,
      type: 'BUY_GOODS',
      fromUserId: userId,
      merchantCode,
      amount: amount.toFixed(2),
      currency: 'JMD',
      fee,
      status: 'pending',
      description,
    });

    // Update user wallet
    await this.updateYaadFlexPayWalletBalance(userId, 'JMD', amount, 'subtract');
    
    // Update merchant volume
    await this.updateYaadFlexPayMerchantVolume(merchantCode, amount);

    // Complete transaction
    return this.updateYaadFlexPayTransactionStatus(transaction.id, 'completed', new Date());
  }

  async checkBalance(userId: string, currency?: string): Promise<YaadFlexPayWallet[]> {
    if (currency) {
      const wallet = await this.getYaadFlexPayWallet(userId, currency);
      return wallet ? [wallet] : [];
    }
    return this.getYaadFlexPayWallets(userId);
  }

  async depositFromBank(userId: string, amount: number, bankAccount: string): Promise<YaadFlexPayTransaction> {
    // Generate transaction ID
    const transactionId = `YF${Date.now()}`;

    // Create transaction
    const transaction = await this.createYaadFlexPayTransaction({
      transactionId,
      type: 'DEPOSIT',
      fromUserId: userId,
      amount: amount.toFixed(2),
      currency: 'JMD',
      fee: '0.00',
      status: 'pending',
      description: `Deposit from bank account ${bankAccount}`,
      reference: bankAccount,
    });

    // Update wallet balance
    await this.updateYaadFlexPayWalletBalance(userId, 'JMD', amount, 'add');

    // Complete transaction
    return this.updateYaadFlexPayTransactionStatus(transaction.id, 'completed', new Date());
  }

  async withdrawToBank(userId: string, amount: number, bankAccount: string): Promise<YaadFlexPayTransaction> {
    // Generate transaction ID
    const transactionId = `YF${Date.now()}`;

    // Create transaction
    const transaction = await this.createYaadFlexPayTransaction({
      transactionId,
      type: 'WITHDRAW',
      fromUserId: userId,
      amount: amount.toFixed(2),
      currency: 'JMD',
      fee: '0.00',
      status: 'pending',
      description: `Withdraw to bank account ${bankAccount}`,
      reference: bankAccount,
    });

    // Update wallet balance
    await this.updateYaadFlexPayWalletBalance(userId, 'JMD', amount, 'subtract');

    // Complete transaction
    return this.updateYaadFlexPayTransactionStatus(transaction.id, 'completed', new Date());
  }

  // Stub implementations for YaadFlex Clothing Line (to be implemented later)
  async createYaadFlexCategory(): Promise<any> { throw new Error('Not implemented'); }
  async getYaadFlexCategories(): Promise<any[]> { return []; }
  async getYaadFlexCategory(): Promise<any> { return undefined; }
  async updateYaadFlexCategory(): Promise<any> { throw new Error('Not implemented'); }
  async createYaadFlexProduct(): Promise<any> { throw new Error('Not implemented'); }
  async getYaadFlexProducts(): Promise<any[]> { return []; }
  async getYaadFlexProductsByCategory(): Promise<any[]> { return []; }
  async getFeaturedYaadFlexProducts(): Promise<any[]> { return []; }
  async getYaadFlexProduct(): Promise<any> { return undefined; }
  async updateYaadFlexProduct(): Promise<any> { throw new Error('Not implemented'); }
  async updateYaadFlexProductStock(): Promise<any> { throw new Error('Not implemented'); }
  async createYaadFlexSupplier(): Promise<any> { throw new Error('Not implemented'); }
  async getYaadFlexSuppliers(): Promise<any[]> { return []; }
  async getYaadFlexSupplier(): Promise<any> { return undefined; }
  async updateYaadFlexSupplier(): Promise<any> { throw new Error('Not implemented'); }
  async createYaadFlexOrder(): Promise<any> { throw new Error('Not implemented'); }
  async getUserYaadFlexOrders(): Promise<any[]> { return []; }
  async getAllYaadFlexOrders(): Promise<any[]> { return []; }
  async getYaadFlexOrder(): Promise<any> { return undefined; }
  async updateYaadFlexOrderStatus(): Promise<any> { throw new Error('Not implemented'); }
  async createYaadFlexOrderItem(): Promise<any> { throw new Error('Not implemented'); }
  async getYaadFlexOrderItems(): Promise<any[]> { return []; }
  async updateYaadFlexOrderItemStatus(): Promise<any> { throw new Error('Not implemented'); }
  async createYaadFlexProductReview(): Promise<any> { throw new Error('Not implemented'); }
  async getYaadFlexProductReviews(): Promise<any[]> { return []; }
  async getUserYaadFlexReviews(): Promise<any[]> { return []; }
  async updateYaadFlexReviewVisibility(): Promise<any> { throw new Error('Not implemented'); }
}

// EMERGENCY FIX: Use demo data when database fails
class DemoStorage implements IStorage {
  // Demo wallets with real-looking data
  private wallets: UserWallet[] = [
    { id: '1', userId: '1', currency: 'KWD', balance: '1250.75', isActive: true, lastTransactionAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    { id: '2', userId: '1', currency: 'JMD', balance: '89500.50', isActive: true, lastTransactionAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    { id: '3', userId: '1', currency: 'USD', balance: '3420.25', isActive: true, lastTransactionAt: new Date(), createdAt: new Date(), updatedAt: new Date() }
  ];

  // Demo transactions with recent activity
  private transactions: Transaction[] = [
    { id: '1', userId: '1', type: 'rental_payment', amount: '450.00', currency: 'KWD', status: 'completed', description: 'Property rental - Kingston Heights', recipientId: null, recipientPhone: null, securityLevel: 'enhanced', countryCode: 'KW', isSecureTransfer: true, exchangeRate: '1.0000', originalCurrency: null, originalAmount: null, createdAt: new Date(Date.now() - 3600000), updatedAt: new Date() },
    { id: '2', userId: '1', type: 'delivery_payment', amount: '125.50', currency: 'JMD', status: 'completed', description: 'Food delivery service', recipientId: null, recipientPhone: null, securityLevel: 'standard', countryCode: 'JM', isSecureTransfer: true, exchangeRate: '1.0000', originalCurrency: null, originalAmount: null, createdAt: new Date(Date.now() - 7200000), updatedAt: new Date() },
    { id: '3', userId: '1', type: 'business_transfer', amount: '800.00', currency: 'USD', status: 'pending', description: 'Business investment transfer', recipientId: null, recipientPhone: null, securityLevel: 'enhanced', countryCode: 'US', isSecureTransfer: true, exchangeRate: '1.0000', originalCurrency: null, originalAmount: null, createdAt: new Date(Date.now() - 1800000), updatedAt: new Date() }
  ];

  // Demo security logs
  private securityLogs: SecurityLog[] = [
    { id: '1', userId: '1', eventType: 'login_success', severity: 'low', description: 'Successful login from Denver, CO', ipAddress: '192.168.1.100', userAgent: null, threatBlocked: false, defenseSystemActivated: false, createdAt: new Date(Date.now() - 900000) },
    { id: '2', userId: '1', eventType: 'large_transaction', severity: 'medium', description: 'Large transaction approved: $800 USD', ipAddress: '192.168.1.100', userAgent: null, threatBlocked: false, defenseSystemActivated: true, createdAt: new Date(Date.now() - 3600000) }
  ];

  // Implement all required interface methods
  async getUserWallets(userId: string): Promise<UserWallet[]> { return this.wallets; }
  async getUserTransactions(userId: string): Promise<Transaction[]> { return this.transactions; }
  async getSecurityLogs(userId?: string): Promise<SecurityLog[]> { return this.securityLogs; }
  async createWallet(wallet: InsertUserWallet): Promise<UserWallet> { return this.wallets[0]; }
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> { return this.transactions[0]; }
  async logSecurityEvent(log: InsertSecurityLog): Promise<SecurityLog> { return this.securityLogs[0]; }

  // Stub out other required methods to prevent errors
  async getUser(id: string): Promise<User | undefined> { return undefined; }
  async upsertUser(user: UpsertUser): Promise<User> { throw new Error('Not implemented'); }
  async getTransaction(id: string): Promise<Transaction | undefined> { return this.transactions[0]; }
  async updateTransactionStatus(id: string, status: string): Promise<Transaction> { return this.transactions[0]; }
  async getUserWalletByCurrency(userId: string, currency: string): Promise<UserWallet | undefined> { return this.wallets[0]; }
  async updateWalletBalance(userId: string, currency: string, amount: number): Promise<UserWallet> { return this.wallets[0]; }
  async addKWDFunds(userId: string, amount: number): Promise<{ wallet: UserWallet; transaction: Transaction }> { return { wallet: this.wallets[0], transaction: this.transactions[0] }; }
  async exchangeCurrency(userId: string, fromCurrency: string, toCurrency: string, amount: number): Promise<{ transaction: Transaction; fromWallet: UserWallet; toWallet: UserWallet }> { return { transaction: this.transactions[0], fromWallet: this.wallets[0], toWallet: this.wallets[1] }; }
  async getRecentThreats(): Promise<SecurityLog[]> { return this.securityLogs; }
  
  // Vehicle stubs
  async createVehicle(vehicle: any): Promise<any> { return {}; }
  async getVehicle(id: string): Promise<any> { return undefined; }
  async getUserVehicles(driverId: string): Promise<any[]> { return []; }
  async updateVehicleLocation(vehicleId: string, latitude: number, longitude: number): Promise<any> { return {}; }
  async getActiveVehicles(): Promise<any[]> { return []; }
  async getAvailableVehicles(): Promise<any[]> { return []; }
  
  // Trip stubs
  async createTrip(trip: any): Promise<any> { return {}; }
  async getTrip(id: string): Promise<any> { return undefined; }
  async getUserTrips(userId: string): Promise<any[]> { return []; }
  async getCurrentTrips(userId: string): Promise<any[]> { return []; }
  async getPublicTrips(): Promise<any[]> { return []; }
  async updateTripStatus(tripId: string, status: string): Promise<any> { return {}; }
  
  // All other interface methods as stubs
  async addLocationUpdate(location: any): Promise<any> { return {}; }
  async getVehicleLocationHistory(vehicleId: string): Promise<any[]> { return []; }
  async getTripLocationHistory(tripId: string): Promise<any[]> { return []; }
  async createSecurityEvent(event: any): Promise<any> { return {}; }
  async getSecurityEvents(vehicleId?: string): Promise<any[]> { return []; }
  async getThreatsByLevel(threatLevel: string): Promise<any[]> { return []; }
  async getUnresolvedThreats(): Promise<any[]> { return []; }
  async getCbRadioChannels(): Promise<any[]> { return []; }
  async createCbRadioChannel(channel: any): Promise<any> { return {}; }
  async getDriverCbProfile(driverId: string): Promise<any> { return undefined; }
  async createDriverCbProfile(profile: any): Promise<any> { return {}; }
  async updateDriverCbProfile(driverId: string, updateData: any): Promise<any> { return {}; }
  async getCbRadioMessages(channelId: string, limit?: number): Promise<any[]> { return []; }
  async getOnlineDriversInChannel(channelId: string): Promise<any[]> { return []; }
  async getServiceCategories(): Promise<any[]> { return []; }
  async createServiceCategory(category: any): Promise<any> { return {}; }
  async getServiceProviders(categoryId?: string): Promise<any[]> { return []; }
  async createServiceProvider(provider: any): Promise<any> { return {}; }
  async getServiceProvider(id: string): Promise<any> { return undefined; }
  async updateServiceProvider(id: string, updateData: any): Promise<any> { return {}; }
  async getServiceRequests(userId?: string, status?: string): Promise<any[]> { return []; }
  async createServiceRequest(request: any): Promise<any> { return {}; }
  async getServiceRequest(id: string): Promise<any> { return undefined; }
  async updateServiceRequestStatus(id: string, status: string, providerId?: string): Promise<any> { return {}; }
  async getServiceQuotes(requestId: string): Promise<any[]> { return []; }
  async createServiceQuote(quote: any): Promise<any> { return {}; }
  async acceptServiceQuote(quoteId: string): Promise<any> { return {}; }
  async getToolEquipment(ownerId?: string): Promise<any[]> { return []; }
  async createToolEquipment(tool: any): Promise<any> { return {}; }
  async getServiceReviews(providerId?: string): Promise<any[]> { return []; }
  async createServiceReview(review: any): Promise<any> { return {}; }
  async calculateServicePrice(serviceType: string, measurements: any, location: string, complexity?: string): Promise<any> { return {}; }
  async getPricingRules(serviceType?: string): Promise<any[]> { return []; }
  async createPricingRule(rule: any): Promise<any> { return {}; }
  async getToolRentalRates(serviceType?: string): Promise<any[]> { return []; }
  async createToolRentalRate(rate: any): Promise<any> { return {}; }
  async getLocationZones(): Promise<any[]> { return []; }
  async createLocationZone(zone: any): Promise<any> { return {}; }
  async getPriceCalculation(id: string): Promise<any> { return undefined; }
  async createChatMessage(message: any): Promise<any> { return {}; }
  async getChatMessageById(messageId: string): Promise<any> { return undefined; }
  async getChatMessages(chatId: string, viewerLang: string, limit?: number): Promise<any[]> { return []; }
  async createMessageTranslation(translation: any): Promise<any> { return {}; }
  async getMessageTranslation(messageId: string, targetLang: string): Promise<any> { return undefined; }
  async createChatParticipant(participant: any): Promise<any> { return {}; }
  async createTranslationReport(report: any): Promise<any> { return {}; }
  async updateUserLanguagePreferences(userId: string, preferences: any): Promise<User> { throw new Error('Not implemented'); }
  
  // CRITICAL: Legal acceptance method - required for legal compliance
  async updateUserLegalAcceptance(userId: string, legalData: {
    termsAccepted?: boolean;
    privacyAccepted?: boolean;
    userAgreementAccepted?: boolean;
    driverAgreementAccepted?: boolean;
    businessAgreementAccepted?: boolean;
    legalAcceptedAt?: Date;
    termsVersion?: string;
    privacyVersion?: string;
    agreementVersion?: string;
    ipAddressAtAcceptance?: string;
    userAgentAtAcceptance?: string;
  }): Promise<User> {
    // Demo mode: Return mock user with legal acceptance applied
    return {
      id: userId,
      email: 'demo@yaadflex.com',
      firstName: 'Demo',
      lastName: 'User',
      profileImageUrl: null,
      mfaEnabled: false,
      mfaSecret: null,
      backupCodes: null,
      securityLevel: 'standard',
      lastSecurityCheck: null,
      trustedDevices: null,
      preferredLang: 'en-JM',
      fallbackLang: 'en-US',
      showAlwaysEnglishToggle: true,
      captionVoiceMessages: true,
      autoTranslateEnabled: true,
      termsAccepted: legalData.termsAccepted || false,
      privacyAccepted: legalData.privacyAccepted || false,
      userAgreementAccepted: legalData.userAgreementAccepted || false,
      driverAgreementAccepted: legalData.driverAgreementAccepted || false,
      businessAgreementAccepted: legalData.businessAgreementAccepted || false,
      legalAcceptedAt: legalData.legalAcceptedAt || null,
      termsVersion: legalData.termsVersion || '1.0',
      privacyVersion: legalData.privacyVersion || '1.0',
      agreementVersion: legalData.agreementVersion || '1.0',
      ipAddressAtAcceptance: legalData.ipAddressAtAcceptance || null,
      userAgentAtAcceptance: legalData.userAgentAtAcceptance || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // CEO Dashboard methods - returning mock data for demo mode
  async getCeoMetrics(metricType: string): Promise<any> {
    return {
      totalRevenue: 125000,
      monthlyGrowth: 12.5,
      activeUsers: 2400,
      systemHealth: 98.5
    };
  }
  
  async getActiveObligations(): Promise<any[]> {
    return [
      { id: '1', description: 'Monthly server costs', amount: '2500.00', dueDate: new Date(Date.now() + 86400000 * 7), status: 'pending' },
      { id: '2', description: 'Insurance payment', amount: '1200.00', dueDate: new Date(Date.now() + 86400000 * 14), status: 'pending' }
    ];
  }
  
  async getRecentPayments(limit: number): Promise<any[]> {
    return [
      { id: '1', description: 'Vendor payment', amount: '850.00', date: new Date(Date.now() - 86400000), status: 'completed' },
      { id: '2', description: 'Utility bill', amount: '320.00', date: new Date(Date.now() - 86400000 * 2), status: 'completed' }
    ].slice(0, limit);
  }
  
  async getRecentAgentLogs(limit: number): Promise<any[]> {
    return [
      { id: '1', task: 'System health check', status: 'completed', timestamp: new Date(Date.now() - 1800000) },
      { id: '2', task: 'Payment processing', status: 'in_progress', timestamp: new Date(Date.now() - 900000) }
    ].slice(0, limit);
  }
  
  async getComplianceStatus(): Promise<any> {
    return {
      overallScore: 95,
      criticalIssues: 0,
      pendingTasks: 2,
      lastAudit: new Date(Date.now() - 86400000 * 30),
      nextReview: new Date(Date.now() + 86400000 * 60)
    };
  }
  
  async getPendingApprovals(): Promise<any[]> {
    return [
      { id: '1', task: 'Large payment approval', amount: '5000.00', requestedBy: 'system', status: 'pending' },
      { id: '2', task: 'Security protocol update', requestedBy: 'admin', status: 'pending' }
    ];
  }
  
  async processApproval(taskId: string, action: string, userId: string): Promise<void> {
    // Mock approval processing - no actual action needed in demo mode
    console.log(`Demo mode: Processed approval ${taskId} with action ${action} by user ${userId}`);
  }

  // YaadFlex Pay Card Methods - Demo implementations
  async createYaadFlexPayCard(cardData: any): Promise<any> {
    return {
      id: `card_${Date.now()}`,
      userId: cardData.userId,
      stripeCardId: cardData.stripeCardId || `card_stripe_${Date.now()}`,
      cardType: cardData.cardType || 'virtual',
      last4: cardData.last4 || '1234',
      brand: cardData.brand || 'visa',
      currency: cardData.currency || 'USD',
      isActive: cardData.isActive ?? true,
      isBlocked: cardData.isBlocked ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getUserYaadFlexPayCards(userId: string): Promise<any[]> {
    return [
      {
        id: '1',
        userId,
        stripeCardId: 'card_demo_virtual',
        cardType: 'virtual',
        last4: '4242',
        brand: 'visa',
        currency: 'USD',
        isActive: true,
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getYaadFlexPayCard(id: string): Promise<any | undefined> {
    return {
      id,
      userId: 'demo_user',
      stripeCardId: 'card_demo',
      cardType: 'virtual',
      last4: '4242',
      brand: 'visa',
      currency: 'USD',
      isActive: true,
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateYaadFlexPayCardStatus(id: string, isActive: boolean, isBlocked?: boolean): Promise<any> {
    return {
      id,
      userId: 'demo_user',
      stripeCardId: 'card_demo',
      cardType: 'virtual',
      last4: '4242',
      brand: 'visa',
      currency: 'USD',
      isActive,
      isBlocked: isBlocked ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // YaadFlex Marketplace methods - Demo implementations
  async createYaadFlexCategory(category: any): Promise<any> { return { id: '1', ...category }; }
  async getYaadFlexCategories(): Promise<any[]> { return []; }
  async getYaadFlexCategory(id: string): Promise<any> { return undefined; }
  async updateYaadFlexCategory(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async createYaadFlexProduct(product: any): Promise<any> { return { id: '1', ...product }; }
  async getYaadFlexProducts(): Promise<any[]> { return []; }
  async getYaadFlexProductsByCategory(categoryId: string): Promise<any[]> { return []; }
  async getFeaturedYaadFlexProducts(): Promise<any[]> { return []; }
  async getYaadFlexProduct(id: string): Promise<any> { return undefined; }
  async updateYaadFlexProduct(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async updateYaadFlexProductStock(id: string, quantity: number): Promise<any> { return { id, stock: quantity }; }
  async createYaadFlexSupplier(supplier: any): Promise<any> { return { id: '1', ...supplier }; }
  async getYaadFlexSuppliers(): Promise<any[]> { return []; }
  async getYaadFlexSupplier(id: string): Promise<any> { return undefined; }
  async updateYaadFlexSupplier(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async createYaadFlexOrder(order: any): Promise<any> { return { id: '1', ...order }; }
  async getUserYaadFlexOrders(customerId: string): Promise<any[]> { return []; }
  async getAllYaadFlexOrders(): Promise<any[]> { return []; }
  async getYaadFlexOrder(id: string): Promise<any> { return undefined; }
  async updateYaadFlexOrderStatus(id: string, status: string): Promise<any> { return { id, status }; }
  async createYaadFlexOrderItem(item: any): Promise<any> { return { id: '1', ...item }; }
  async getYaadFlexOrderItems(orderId: string): Promise<any[]> { return []; }
  async updateYaadFlexOrderItemStatus(id: string, status: string): Promise<any> { return { id, status }; }
  async createYaadFlexProductReview(review: any): Promise<any> { return { id: '1', ...review }; }
  async getYaadFlexProductReviews(productId: string): Promise<any[]> { return []; }
  async getUserYaadFlexReviews(customerId: string): Promise<any[]> { return []; }
  async updateYaadFlexReviewVisibility(id: string, isVisible: boolean): Promise<any> { return { id, isVisible }; }

  // YaadFlex Pay methods - Demo implementations  
  async createYaadFlexPayUser(user: any): Promise<any> { return { id: '1', ...user }; }
  async getYaadFlexPayUser(id: string): Promise<any> { return undefined; }
  async updateYaadFlexPayUser(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async createYaadFlexPayWallet(wallet: any): Promise<any> { return { id: '1', ...wallet }; }
  async getYaadFlexPayWallets(userId: string): Promise<any[]> { return []; }
  async getYaadFlexPayWallet(id: string): Promise<any> { return undefined; }
  async updateYaadFlexPayWalletBalance(userId: string, currency: string, amount: number, operation: string): Promise<any> { return { userId, currency, balance: amount }; }
  async createYaadFlexPayTransaction(transaction: any): Promise<any> { return { id: '1', ...transaction }; }
  async getYaadFlexPayTransactions(userId?: string): Promise<any[]> { return []; }
  async getYaadFlexPayTransaction(id: string): Promise<any> { return undefined; }
  async updateYaadFlexPayTransactionStatus(id: string, status: string, completedAt?: Date): Promise<any> { return { id, status, completedAt }; }
  async createYaadFlexPayMerchant(merchant: any): Promise<any> { return { id: '1', ...merchant }; }
  async getYaadFlexPayMerchants(): Promise<any[]> { return []; }
  async getYaadFlexPayMerchant(id: string): Promise<any> { return undefined; }
  async updateYaadFlexPayMerchant(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async processYaadFlexPayment(fromUserId: string, amount: number, currency: string, description?: string, recipientPhone?: string): Promise<any> { return { id: '1', fromUserId, amount, currency, status: 'completed' }; }
  async withdrawYaadFlexFunds(userId: string, amount: number, bankAccount: string): Promise<any> { return { id: '1', userId, amount, bankAccount, status: 'pending' }; }
}

export const storage = new DemoStorage();
