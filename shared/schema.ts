import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Enhanced Security Features
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: varchar("mfa_secret"), // TOTP secret for authenticator apps
  backupCodes: jsonb("backup_codes"), // Emergency backup codes
  securityLevel: varchar("security_level").notNull().default('standard'), // 'standard', 'enhanced', 'fortress'
  lastSecurityCheck: timestamp("last_security_check"),
  trustedDevices: jsonb("trusted_devices"), // Array of trusted device IDs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Device authentication and security
export const userDevices = pgTable("user_devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  deviceId: varchar("device_id").notNull(), // Unique device identifier
  deviceType: varchar("device_type").notNull(), // 'mobile', 'web', 'tablet'
  platform: varchar("platform"), // 'ios', 'android', 'web'
  deviceName: varchar("device_name"),
  isTrusted: boolean("is_trusted").default(false),
  canAccessFinancials: boolean("can_access_financials").default(false), // Mobile only
  biometricEnabled: boolean("biometric_enabled").default(false),
  lastUsed: timestamp("last_used").defaultNow(),
  securityToken: varchar("security_token"), // Device-specific security token
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced authentication logs
export const authenticationLogs = pgTable("authentication_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  deviceId: varchar("device_id").references(() => userDevices.id),
  authMethod: varchar("auth_method").notNull(), // 'password', 'mfa', 'biometric', 'backup_code'
  success: boolean("success").notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  location: varchar("location"), // Geo location if available
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }), // AI-calculated risk 0-100
  blockedReason: text("blocked_reason"), // If authentication was blocked
  createdAt: timestamp("created_at").defaultNow(),
});

// Financial transactions table for YardFlex
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // 'transfer', 'deposit', 'withdrawal', 'exchange', 'yard_cash_add'
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('USD'), // 'USD', 'KWD', 'YFD'
  recipientId: varchar("recipient_id").references(() => users.id),
  recipientPhone: varchar("recipient_phone"),
  status: varchar("status").notNull().default('pending'), // 'pending', 'completed', 'failed', 'cancelled'
  description: text("description"),
  securityLevel: varchar("security_level").notNull().default('standard'), // 'standard', 'enhanced', 'beast_mode'
  countryCode: varchar("country_code", { length: 2 }),
  isSecureTransfer: boolean("is_secure_transfer").default(true),
  // KWD/YFD specific fields
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 4 }).default('1.0000'), // 1 KWD = 1 YFD
  originalCurrency: varchar("original_currency", { length: 3 }), // For exchange transactions
  originalAmount: decimal("original_amount", { precision: 12, scale: 2 }), // For exchange transactions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User wallet balances for multi-currency support
export const userWallets = pgTable("user_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(), // 'USD', 'KWD', 'YFD'
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default('0.00'),
  isActive: boolean("is_active").default(true),
  lastTransactionAt: timestamp("last_transaction_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_currency").on(table.userId, table.currency),
]);

// Security logs for tracking defense activities
export const securityLogs = pgTable("security_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  eventType: varchar("event_type").notNull(), // 'login', 'transfer', 'threat_detected', 'defense_activated'
  severity: varchar("severity").notNull().default('low'), // 'low', 'medium', 'high', 'critical'
  description: text("description").notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  threatBlocked: boolean("threat_blocked").default(false),
  defenseSystemActivated: boolean("defense_system_activated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vehicles for real-time tracking
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id).notNull(),
  vehicleType: varchar("vehicle_type").notNull(), // 'bike', 'car', 'van', 'truck'
  licensePlate: varchar("license_plate").notNull(),
  model: varchar("model"),
  color: varchar("color"),
  isActive: boolean("is_active").default(true),
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 8 }),
  currentLongitude: decimal("current_longitude", { precision: 11, scale: 8 }),
  lastLocationUpdate: timestamp("last_location_update"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trips for tracking journeys
export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  riderId: varchar("rider_id").references(() => users.id).notNull(),
  driverId: varchar("driver_id").references(() => users.id),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id),
  type: varchar("type").notNull(), // 'ride', 'delivery', 'package'
  status: varchar("status").notNull().default('requested'), // 'requested', 'accepted', 'in_progress', 'completed', 'cancelled'
  pickupLatitude: decimal("pickup_latitude", { precision: 10, scale: 8 }).notNull(),
  pickupLongitude: decimal("pickup_longitude", { precision: 11, scale: 8 }).notNull(),
  pickupAddress: text("pickup_address"),
  dropoffLatitude: decimal("dropoff_latitude", { precision: 10, scale: 8 }),
  dropoffLongitude: decimal("dropoff_longitude", { precision: 11, scale: 8 }),
  dropoffAddress: text("dropoff_address"),
  estimatedFare: decimal("estimated_fare", { precision: 10, scale: 2 }),
  actualFare: decimal("actual_fare", { precision: 10, scale: 2 }),
  distance: decimal("distance", { precision: 8, scale: 2 }), // in kilometers
  duration: integer("duration"), // in minutes
  isPubliclyVisible: boolean("is_publicly_visible").default(true),
  securityLevel: varchar("security_level").notNull().default('enhanced'), // 'standard', 'enhanced', 'interpol_plus'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Real-time location tracking
export const locationUpdates = pgTable("location_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id).notNull(),
  tripId: varchar("trip_id").references(() => trips.id),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  speed: decimal("speed", { precision: 5, scale: 2 }), // km/h
  heading: decimal("heading", { precision: 5, scale: 2 }), // degrees
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }), // meters
  timestamp: timestamp("timestamp").defaultNow(),
});

// Enhanced security events (Beyond Interpol)
export const securityEvents = pgTable("security_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").references(() => trips.id),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id),
  userId: varchar("user_id").references(() => users.id),
  eventType: varchar("event_type").notNull(), // 'threat_detection', 'route_deviation', 'panic_button', 'ai_alert'
  threatLevel: varchar("threat_level").notNull(), // 'low', 'medium', 'high', 'critical', 'interpol_level'
  aiConfidence: decimal("ai_confidence", { precision: 5, scale: 2 }), // 0-100 AI confidence score
  description: text("description").notNull(),
  actionTaken: text("action_taken"),
  isResolved: boolean("is_resolved").default(false),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// CB Radio Channels for driver communication
export const cbRadioChannels = pgTable("cb_radio_channels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelNumber: integer("channel_number").notNull().unique(), // 1-40 (traditional CB channels)
  channelName: varchar("channel_name").notNull(), // 'Highway 1', 'Truckers Only', 'Emergency', etc.
  description: text("description"),
  isEmergencyChannel: boolean("is_emergency_channel").default(false),
  isActive: boolean("is_active").default(true),
  region: varchar("region"), // 'kingston', 'montego_bay', 'nationwide'
  createdAt: timestamp("created_at").defaultNow(),
});

// CB Radio Messages for real-time driver communication
export const cbRadioMessages = pgTable("cb_radio_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelId: varchar("channel_id").references(() => cbRadioChannels.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  senderCallSign: varchar("sender_call_sign").notNull(), // Driver's CB handle/call sign
  message: text("message").notNull(),
  messageType: varchar("message_type").notNull().default('chat'), // 'chat', 'alert', 'emergency', 'traffic_update'
  priority: varchar("priority").notNull().default('normal'), // 'low', 'normal', 'high', 'emergency'
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isLocationShared: boolean("is_location_shared").default(false),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_channel_timestamp").on(table.channelId, table.createdAt),
]);

// Driver CB Radio Profiles
export const driverCbProfiles = pgTable("driver_cb_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id).notNull().unique(),
  callSign: varchar("call_sign").notNull().unique(), // Unique CB handle like 'BigRig42', 'YardFlex1'
  preferredChannels: jsonb("preferred_channels"), // Array of channel IDs they monitor
  currentChannelId: varchar("current_channel_id").references(() => cbRadioChannels.id),
  isOnline: boolean("is_online").default(false),
  lastActivity: timestamp("last_activity").defaultNow(),
  totalMessages: integer("total_messages").default(0),
  reputation: decimal("reputation", { precision: 5, scale: 2 }).default('5.0'), // 1.0-5.0 rating
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CB Radio Channel Subscriptions (which drivers are listening to which channels)
export const cbChannelSubscriptions = pgTable("cb_channel_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id).notNull(),
  channelId: varchar("channel_id").references(() => cbRadioChannels.id).notNull(),
  isActive: boolean("is_active").default(true),
  joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => [
  index("idx_driver_channel").on(table.driverId, table.channelId),
]);

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type InsertUserWallet = typeof userWallets.$inferInsert;
export type UserWallet = typeof userWallets.$inferSelect;
export type InsertSecurityLog = typeof securityLogs.$inferInsert;
export type SecurityLog = typeof securityLogs.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertTrip = typeof trips.$inferInsert;
export type Trip = typeof trips.$inferSelect;
export type InsertLocationUpdate = typeof locationUpdates.$inferInsert;
export type LocationUpdate = typeof locationUpdates.$inferSelect;
export type InsertSecurityEvent = typeof securityEvents.$inferInsert;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertUserDevice = typeof userDevices.$inferInsert;
export type UserDevice = typeof userDevices.$inferSelect;
export type InsertAuthenticationLog = typeof authenticationLogs.$inferInsert;
export type AuthenticationLog = typeof authenticationLogs.$inferSelect;
export type InsertCbRadioChannel = typeof cbRadioChannels.$inferInsert;
export type CbRadioChannel = typeof cbRadioChannels.$inferSelect;
export type InsertCbRadioMessage = typeof cbRadioMessages.$inferInsert;
export type CbRadioMessage = typeof cbRadioMessages.$inferSelect;
export type InsertDriverCbProfile = typeof driverCbProfiles.$inferInsert;
export type DriverCbProfile = typeof driverCbProfiles.$inferSelect;
export type InsertCbChannelSubscription = typeof cbChannelSubscriptions.$inferInsert;
export type CbChannelSubscription = typeof cbChannelSubscriptions.$inferSelect;

// Services Marketplace Tables (Construction, Cleaning, Trade Work)
export const serviceCategories = pgTable("service_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // "Construction", "Cleaning", "Plumbing", etc.
  description: text("description"),
  iconName: varchar("icon_name"), // Lucide icon name
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceProviders = pgTable("service_providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  businessName: varchar("business_name"),
  description: text("description"),
  skills: text("skills").array(), // ["drywall", "painting", "carpentry"]
  serviceAreas: text("service_areas").array(), // Geographic areas served
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  minimumJob: decimal("minimum_job", { precision: 10, scale: 2 }),
  availability: jsonb("availability"), // Weekly schedule
  isVerified: boolean("is_verified").default(false),
  hasInsurance: boolean("has_insurance").default(false),
  licenseNumber: varchar("license_number"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  totalJobs: integer("total_jobs").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceRequests = pgTable("service_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  categoryId: varchar("category_id").notNull().references(() => serviceCategories.id),
  providerId: varchar("provider_id").references(() => serviceProviders.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  urgency: varchar("urgency").notNull().default("normal"), // "low", "normal", "high", "emergency"
  estimatedHours: decimal("estimated_hours", { precision: 5, scale: 2 }),
  budgetRange: varchar("budget_range"), // "$100-$500", "$500-$1000", etc.
  preferredDate: timestamp("preferred_date"),
  images: text("images").array(), // Array of image URLs
  status: varchar("status").notNull().default("open"), // "open", "quoted", "accepted", "in_progress", "completed", "cancelled"
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  currency: varchar("currency").default("KWD"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceQuotes = pgTable("service_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => serviceRequests.id),
  providerId: varchar("provider_id").notNull().references(() => serviceProviders.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("KWD"),
  description: text("description"),
  estimatedDuration: varchar("estimated_duration"), // "2-3 hours", "1-2 days"
  startDate: timestamp("start_date"),
  materials: jsonb("materials"), // List of materials needed
  isAccepted: boolean("is_accepted").default(false),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const toolEquipment = pgTable("tool_equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // "power_tools", "hand_tools", "equipment"
  description: text("description"),
  condition: varchar("condition").default("good"), // "excellent", "good", "fair", "poor"
  dailyRate: decimal("daily_rate", { precision: 8, scale: 2 }),
  currency: varchar("currency").default("KWD"),
  location: text("location"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  images: text("images").array(),
  availability: jsonb("availability"),
  isAvailable: boolean("is_available").default(true),
  requiresDeposit: boolean("requires_deposit").default(false),
  depositAmount: decimal("deposit_amount", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceReviews = pgTable("service_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => serviceRequests.id),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
  providerId: varchar("provider_id").notNull().references(() => serviceProviders.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  workQuality: integer("work_quality"), // 1-5
  communication: integer("communication"), // 1-5
  punctuality: integer("punctuality"), // 1-5
  cleanliness: integer("cleanliness"), // 1-5
  wouldRecommend: boolean("would_recommend").default(true),
  images: text("images").array(), // Before/after photos
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for Services Marketplace
export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  serviceRequests: many(serviceRequests),
}));

export const serviceProvidersRelations = relations(serviceProviders, ({ one, many }) => ({
  user: one(users, {
    fields: [serviceProviders.userId],
    references: [users.id],
  }),
  serviceRequests: many(serviceRequests),
  quotes: many(serviceQuotes),
  reviews: many(serviceReviews),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one, many }) => ({
  customer: one(users, {
    fields: [serviceRequests.customerId],
    references: [users.id],
  }),
  category: one(serviceCategories, {
    fields: [serviceRequests.categoryId],
    references: [serviceCategories.id],
  }),
  provider: one(serviceProviders, {
    fields: [serviceRequests.providerId],
    references: [serviceProviders.id],
  }),
  quotes: many(serviceQuotes),
  reviews: many(serviceReviews),
}));

export const serviceQuotesRelations = relations(serviceQuotes, ({ one }) => ({
  request: one(serviceRequests, {
    fields: [serviceQuotes.requestId],
    references: [serviceRequests.id],
  }),
  provider: one(serviceProviders, {
    fields: [serviceQuotes.providerId],
    references: [serviceProviders.id],
  }),
}));

export const toolEquipmentRelations = relations(toolEquipment, ({ one }) => ({
  owner: one(users, {
    fields: [toolEquipment.ownerId],
    references: [users.id],
  }),
}));

export const serviceReviewsRelations = relations(serviceReviews, ({ one }) => ({
  request: one(serviceRequests, {
    fields: [serviceReviews.requestId],
    references: [serviceRequests.id],
  }),
  reviewer: one(users, {
    fields: [serviceReviews.reviewerId],
    references: [users.id],
  }),
  provider: one(serviceProviders, {
    fields: [serviceReviews.providerId],
    references: [serviceProviders.id],
  }),
}));

// Insert schemas using drizzle-zod
export const insertServiceCategorySchema = createInsertSchema(serviceCategories);
export const insertServiceProviderSchema = createInsertSchema(serviceProviders);
export const insertServiceRequestSchema = createInsertSchema(serviceRequests);
export const insertServiceQuoteSchema = createInsertSchema(serviceQuotes);
export const insertToolEquipmentSchema = createInsertSchema(toolEquipment);
export const insertServiceReviewSchema = createInsertSchema(serviceReviews);

// Types
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = typeof serviceCategories.$inferInsert;
export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceProvider = typeof serviceProviders.$inferInsert;
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = typeof serviceRequests.$inferInsert;
export type ServiceQuote = typeof serviceQuotes.$inferSelect;
export type InsertServiceQuote = typeof serviceQuotes.$inferInsert;
export type ToolEquipment = typeof toolEquipment.$inferSelect;
export type InsertToolEquipment = typeof toolEquipment.$inferInsert;
export type ServiceReview = typeof serviceReviews.$inferSelect;
export type InsertServiceReview = typeof serviceReviews.$inferInsert;

// Intelligent Pricing Engine Tables
export const pricingRules = pgTable("pricing_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => serviceCategories.id),
  serviceType: varchar("service_type").notNull(), // "drywall", "painting", "cleaning"
  baseRatePerUnit: decimal("base_rate_per_unit", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit").notNull(), // "square_foot", "hour", "room"
  cleanupRatePerUnit: decimal("cleanup_rate_per_unit", { precision: 8, scale: 2 }).default("0"),
  minimumCharge: decimal("minimum_charge", { precision: 8, scale: 2 }),
  locationMultipliers: jsonb("location_multipliers"), // {"urban": 1.2, "suburban": 1.0, "rural": 0.8}
  complexityFactors: jsonb("complexity_factors"), // {"simple": 1.0, "standard": 1.2, "complex": 1.5}
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const toolRentalRates = pgTable("tool_rental_rates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolName: varchar("tool_name").notNull(),
  category: varchar("category").notNull(), // "power_tools", "hand_tools", "equipment"
  dailyRate: decimal("daily_rate", { precision: 8, scale: 2 }).notNull(),
  weeklyRate: decimal("weekly_rate", { precision: 8, scale: 2 }),
  depositRequired: decimal("deposit_required", { precision: 8, scale: 2 }),
  serviceTypes: text("service_types").array(), // Which services typically need this tool
  availability: jsonb("availability"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const priceCalculations = pgTable("price_calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").references(() => serviceRequests.id),
  serviceType: varchar("service_type").notNull(),
  measurements: jsonb("measurements"), // {"length": 10, "width": 12, "height": 9}
  baseWorkCost: decimal("base_work_cost", { precision: 10, scale: 2 }).notNull(),
  cleanupCost: decimal("cleanup_cost", { precision: 8, scale: 2 }).default("0"),
  toolRentalCost: decimal("tool_rental_cost", { precision: 8, scale: 2 }).default("0"),
  locationAdjustment: decimal("location_adjustment", { precision: 8, scale: 2 }).default("0"),
  complexityAdjustment: decimal("complexity_adjustment", { precision: 8, scale: 2 }).default("0"),
  materialsCost: decimal("materials_cost", { precision: 10, scale: 2 }).default("0"),
  totalBeforeTax: decimal("total_before_tax", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 8, scale: 2 }).default("0"),
  finalTotal: decimal("final_total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("KWD"),
  breakdown: jsonb("breakdown"), // Detailed cost breakdown for transparency
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

export const locationZones = pgTable("location_zones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // "Kingston Urban", "Spanish Town", etc.
  zoneType: varchar("zone_type").notNull(), // "urban", "suburban", "rural"
  country: varchar("country").default("Jamaica"),
  priceMultiplier: decimal("price_multiplier", { precision: 4, scale: 2 }).default("1.0"),
  averageIncome: decimal("average_income", { precision: 10, scale: 2 }),
  demandLevel: varchar("demand_level").default("medium"), // "low", "medium", "high"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for Pricing Engine
export const pricingRulesRelations = relations(pricingRules, ({ one }) => ({
  category: one(serviceCategories, {
    fields: [pricingRules.categoryId],
    references: [serviceCategories.id],
  }),
}));

export const priceCalculationsRelations = relations(priceCalculations, ({ one }) => ({
  request: one(serviceRequests, {
    fields: [priceCalculations.requestId],
    references: [serviceRequests.id],
  }),
}));

// Insert schemas using drizzle-zod
export const insertPricingRuleSchema = createInsertSchema(pricingRules);
export const insertToolRentalRateSchema = createInsertSchema(toolRentalRates);
export const insertPriceCalculationSchema = createInsertSchema(priceCalculations);
export const insertLocationZoneSchema = createInsertSchema(locationZones);

// Types
export type PricingRule = typeof pricingRules.$inferSelect;
export type InsertPricingRule = typeof pricingRules.$inferInsert;
export type ToolRentalRate = typeof toolRentalRates.$inferSelect;
export type InsertToolRentalRate = typeof toolRentalRates.$inferInsert;
export type PriceCalculation = typeof priceCalculations.$inferSelect;
export type InsertPriceCalculation = typeof priceCalculations.$inferInsert;
export type LocationZone = typeof locationZones.$inferSelect;
export type InsertLocationZone = typeof locationZones.$inferInsert;

// Precision Measurement System
export const precisionMeasurements = pgTable("precision_measurements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").references(() => serviceRequests.id),
  measurementType: varchar("measurement_type").notNull(), // "room", "wall", "material"
  dimensions: jsonb("dimensions").notNull(), // {"length": 12.5, "width": 10.2, "height": 9.1}
  weight: decimal("weight", { precision: 8, scale: 3 }), // In kg, precise to grams
  volume: decimal("volume", { precision: 10, scale: 4 }), // In cubic meters
  surfaceArea: decimal("surface_area", { precision: 10, scale: 4 }), // In square meters
  materialType: varchar("material_type"), // "drywall", "paint", "tiles"
  difficulty: varchar("difficulty").default("standard"), // "easy", "standard", "complex"
  accessConditions: jsonb("access_conditions"), // stairs, tight spaces, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Loyalty & Cashback System
export const loyaltyProgram = pgTable("loyalty_program", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).default("0"),
  totalJobs: integer("total_jobs").default(0),
  loyaltyLevel: varchar("loyalty_level").default("bronze"), // "bronze", "silver", "gold", "platinum"
  cashbackEarned: decimal("cashback_earned", { precision: 10, scale: 2 }).default("0"),
  cashbackSpent: decimal("cashback_spent", { precision: 10, scale: 2 }).default("0"),
  currentCashback: decimal("current_cashback", { precision: 10, scale: 2 }).default("0"),
  nextLevelSpendRequired: decimal("next_level_spend_required", { precision: 10, scale: 2 }),
  joinedAt: timestamp("joined_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const platformCommissions = pgTable("platform_commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => serviceRequests.id),
  providerId: varchar("provider_id").notNull().references(() => serviceProviders.id),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  jobTotal: decimal("job_total", { precision: 10, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.15"), // 15%
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  workerEarnings: decimal("worker_earnings", { precision: 10, scale: 2 }).notNull(),
  customerCashbackRate: decimal("customer_cashback_rate", { precision: 5, scale: 4 }).default("0.05"), // 5%
  customerCashback: decimal("customer_cashback", { precision: 8, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status").default("pending"), // "pending", "paid", "failed"
  processedAt: timestamp("processed_at").defaultNow(),
});

export const cashbackTransactions = pgTable("cashback_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  transactionType: varchar("transaction_type").notNull(), // "earned", "spent", "expired"
  amount: decimal("amount", { precision: 8, scale: 2 }).notNull(),
  description: text("description"),
  relatedJobId: varchar("related_job_id").references(() => serviceRequests.id),
  expiresAt: timestamp("expires_at"), // Cashback expires after 1 year
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for Precision & Loyalty
export const precisionMeasurementsRelations = relations(precisionMeasurements, ({ one }) => ({
  request: one(serviceRequests, {
    fields: [precisionMeasurements.requestId],
    references: [serviceRequests.id],
  }),
}));

export const loyaltyProgramRelations = relations(loyaltyProgram, ({ one }) => ({
  customer: one(users, {
    fields: [loyaltyProgram.customerId],
    references: [users.id],
  }),
}));

export const platformCommissionsRelations = relations(platformCommissions, ({ one }) => ({
  request: one(serviceRequests, {
    fields: [platformCommissions.requestId],
    references: [serviceRequests.id],
  }),
  provider: one(serviceProviders, {
    fields: [platformCommissions.providerId],
    references: [serviceProviders.id],
  }),
  customer: one(users, {
    fields: [platformCommissions.customerId],
    references: [users.id],
  }),
}));

export const cashbackTransactionsRelations = relations(cashbackTransactions, ({ one }) => ({
  customer: one(users, {
    fields: [cashbackTransactions.customerId],
    references: [users.id],
  }),
  relatedJob: one(serviceRequests, {
    fields: [cashbackTransactions.relatedJobId],
    references: [serviceRequests.id],
  }),
}));

// Insert schemas
export const insertPrecisionMeasurementSchema = createInsertSchema(precisionMeasurements);
export const insertLoyaltyProgramSchema = createInsertSchema(loyaltyProgram);
export const insertPlatformCommissionSchema = createInsertSchema(platformCommissions);
export const insertCashbackTransactionSchema = createInsertSchema(cashbackTransactions);

// Types
export type PrecisionMeasurement = typeof precisionMeasurements.$inferSelect;
export type InsertPrecisionMeasurement = typeof precisionMeasurements.$inferInsert;
export type LoyaltyProgram = typeof loyaltyProgram.$inferSelect;
export type InsertLoyaltyProgram = typeof loyaltyProgram.$inferInsert;
export type PlatformCommission = typeof platformCommissions.$inferSelect;
export type InsertPlatformCommission = typeof platformCommissions.$inferInsert;
export type CashbackTransaction = typeof cashbackTransactions.$inferSelect;
export type InsertCashbackTransaction = typeof cashbackTransactions.$inferInsert;

// ===================== E-COMMERCE INVENTORY SYSTEM =====================

// Suppliers/Vendors Management
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  contactPerson: varchar("contact_person"),
  phone: varchar("phone"),
  email: varchar("email"),
  address: text("address"),
  country: varchar("country").default("Jamaica"),
  reliability: decimal("reliability", { precision: 3, scale: 2 }).default("5.0"), // Out of 5
  averageDeliveryTime: integer("average_delivery_time"), // Days
  paymentTerms: varchar("payment_terms").default("net_30"),
  isActive: boolean("is_active").default(true),
  totalOrders: integer("total_orders").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product Categories  
export const productCategories: any = pgTable("product_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  parentId: varchar("parent_id").references(() => productCategories.id),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products/Inventory Items
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sku: varchar("sku").unique().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  categoryId: varchar("category_id").references(() => productCategories.id),
  primarySupplierId: varchar("primary_supplier_id").references(() => suppliers.id),
  unitOfMeasure: varchar("unit_of_measure").default("each"), // "each", "kg", "liter", "meter"
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }).notNull(),
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }).notNull(),
  markup: decimal("markup", { precision: 5, scale: 2 }), // Percentage
  barcode: varchar("barcode"),
  weight: decimal("weight", { precision: 8, scale: 3 }), // In kg
  dimensions: jsonb("dimensions"), // {"length": 10, "width": 5, "height": 2}
  isActive: boolean("is_active").default(true),
  isTracked: boolean("is_tracked").default(true), // Whether to track inventory
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stock Levels & Inventory
export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  locationId: varchar("location_id"), // Store/warehouse location
  currentStock: decimal("current_stock", { precision: 10, scale: 3 }).default("0"),
  minimumStock: decimal("minimum_stock", { precision: 10, scale: 3 }).default("5"),
  maximumStock: decimal("maximum_stock", { precision: 10, scale: 3 }).default("100"),
  reorderPoint: decimal("reorder_point", { precision: 10, scale: 3 }).default("10"),
  reorderQuantity: decimal("reorder_quantity", { precision: 10, scale: 3 }).default("50"),
  reservedStock: decimal("reserved_stock", { precision: 10, scale: 3 }).default("0"), // Pending orders
  availableStock: decimal("available_stock", { precision: 10, scale: 3 }).default("0"), // Current - Reserved
  lastStockCheck: timestamp("last_stock_check"),
  stockStatus: varchar("stock_status").default("in_stock"), // "in_stock", "low_stock", "out_of_stock", "discontinued"
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Price History Tracking
export const priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  supplierId: varchar("supplier_id").references(() => suppliers.id),
  oldPrice: decimal("old_price", { precision: 10, scale: 2 }),
  newPrice: decimal("new_price", { precision: 10, scale: 2 }).notNull(),
  priceType: varchar("price_type").notNull(), // "cost", "selling", "supplier"
  changeReason: varchar("change_reason"), // "supplier_increase", "market_demand", "promotion"
  changePercentage: decimal("change_percentage", { precision: 5, scale: 2 }),
  effectiveDate: timestamp("effective_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stock Movements (IN/OUT transactions)
export const stockMovements = pgTable("stock_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  movementType: varchar("movement_type").notNull(), // "purchase", "sale", "adjustment", "transfer", "waste"
  quantity: decimal("quantity", { precision: 10, scale: 3 }).notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }),
  referenceNumber: varchar("reference_number"), // PO#, Invoice#, etc.
  supplierId: varchar("supplier_id").references(() => suppliers.id),
  userId: varchar("user_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Automatic Reorder System
export const reorderRequests = pgTable("reorder_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  supplierId: varchar("supplier_id").notNull().references(() => suppliers.id),
  requestedQuantity: decimal("requested_quantity", { precision: 10, scale: 3 }).notNull(),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  priority: varchar("priority").default("normal"), // "urgent", "normal", "low"
  status: varchar("status").default("pending"), // "pending", "approved", "ordered", "received", "cancelled"
  autoGenerated: boolean("auto_generated").default(false),
  expectedDelivery: timestamp("expected_delivery"),
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  orderNumber: varchar("order_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stock Alerts & Notifications
export const stockAlerts = pgTable("stock_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  alertType: varchar("alert_type").notNull(), // "low_stock", "out_of_stock", "price_change", "expired_soon"
  alertLevel: varchar("alert_level").default("warning"), // "info", "warning", "critical"
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  isResolved: boolean("is_resolved").default(false),
  triggeredAt: timestamp("triggered_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by").references(() => users.id),
});

// Business Intelligence - Sales Analytics
export const salesAnalytics = pgTable("sales_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id),
  categoryId: varchar("category_id").references(() => productCategories.id),
  period: varchar("period").notNull(), // "daily", "weekly", "monthly", "yearly"
  periodDate: date("period_date").notNull(),
  unitsSold: decimal("units_sold", { precision: 10, scale: 3 }).default("0"),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0"),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).default("0"),
  totalProfit: decimal("total_profit", { precision: 10, scale: 2 }).default("0"),
  profitMargin: decimal("profit_margin", { precision: 5, scale: 2 }).default("0"),
  averageOrderValue: decimal("average_order_value", { precision: 10, scale: 2 }),
  topCustomer: varchar("top_customer").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===================== RELATIONS =====================

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
  reorderRequests: many(reorderRequests),
  stockMovements: many(stockMovements),
  priceHistory: many(priceHistory),
}));

export const productCategoriesRelations = relations(productCategories, ({ many, one }) => ({
  products: many(products),
  parent: one(productCategories, {
    fields: [productCategories.parentId],
    references: [productCategories.id],
  }),
  children: many(productCategories),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  primarySupplier: one(suppliers, {
    fields: [products.primarySupplierId],
    references: [suppliers.id],
  }),
  inventory: many(inventory),
  priceHistory: many(priceHistory),
  stockMovements: many(stockMovements),
  reorderRequests: many(reorderRequests),
  stockAlerts: many(stockAlerts),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
  supplier: one(suppliers, {
    fields: [stockMovements.supplierId],
    references: [suppliers.id],
  }),
  user: one(users, {
    fields: [stockMovements.userId],
    references: [users.id],
  }),
}));

export const reorderRequestsRelations = relations(reorderRequests, ({ one }) => ({
  product: one(products, {
    fields: [reorderRequests.productId],
    references: [products.id],
  }),
  supplier: one(suppliers, {
    fields: [reorderRequests.supplierId],
    references: [suppliers.id],
  }),
  approvedByUser: one(users, {
    fields: [reorderRequests.approvedBy],
    references: [users.id],
  }),
}));

export const stockAlertsRelations = relations(stockAlerts, ({ one }) => ({
  product: one(products, {
    fields: [stockAlerts.productId],
    references: [products.id],
  }),
  resolvedByUser: one(users, {
    fields: [stockAlerts.resolvedBy],
    references: [users.id],
  }),
}));

// ===================== INSERT SCHEMAS =====================

export const insertSupplierSchema = createInsertSchema(suppliers);
export const insertProductCategorySchema = createInsertSchema(productCategories);
export const insertProductSchema = createInsertSchema(products);
export const insertInventorySchema = createInsertSchema(inventory);
export const insertPriceHistorySchema = createInsertSchema(priceHistory);
export const insertStockMovementSchema = createInsertSchema(stockMovements);
export const insertReorderRequestSchema = createInsertSchema(reorderRequests);
export const insertStockAlertSchema = createInsertSchema(stockAlerts);
export const insertSalesAnalyticsSchema = createInsertSchema(salesAnalytics);

// ===================== TYPES =====================

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = typeof suppliers.$inferInsert;
export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;
export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = typeof priceHistory.$inferInsert;
export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = typeof stockMovements.$inferInsert;
export type ReorderRequest = typeof reorderRequests.$inferSelect;
export type InsertReorderRequest = typeof reorderRequests.$inferInsert;
export type StockAlert = typeof stockAlerts.$inferSelect;
export type InsertStockAlert = typeof stockAlerts.$inferInsert;
export type SalesAnalytics = typeof salesAnalytics.$inferSelect;
export type InsertSalesAnalytics = typeof salesAnalytics.$inferInsert;

// ===================== PERSONAL SHIPPING & LOGISTICS WITH AI =====================

// Shipping Partners & Local Drivers
export const shippingPartners = pgTable("shipping_partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  contactPerson: varchar("contact_person").notNull(),
  phone: varchar("phone").notNull(),
  whatsappNumber: varchar("whatsapp_number"),
  email: varchar("email"),
  preferredContactMethod: varchar("preferred_contact_method").default("phone"), // "phone", "whatsapp", "email"
  serviceArea: jsonb("service_area"), // Geographic areas they cover
  vehicleTypes: jsonb("vehicle_types"), // ["motorcycle", "car", "van", "truck"]
  baseRatePerKm: decimal("base_rate_per_km", { precision: 8, scale: 2 }),
  expressRatePerKm: decimal("express_rate_per_km", { precision: 8, scale: 2 }),
  maxWeightCapacity: decimal("max_weight_capacity", { precision: 8, scale: 2 }), // In kg
  maxVolumeCapacity: decimal("max_volume_capacity", { precision: 8, scale: 3 }), // In cubic meters
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.0"),
  totalDeliveries: integer("total_deliveries").default(0),
  onTimePercentage: decimal("on_time_percentage", { precision: 5, scale: 2 }).default("100.0"),
  isActive: boolean("is_active").default(true),
  availableHours: jsonb("available_hours"), // {"monday": "8:00-18:00", "tuesday": "8:00-18:00"}
  specialServices: jsonb("special_services"), // ["fragile", "refrigerated", "same_day", "express"]
  notes: text("notes"),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
});

// Shipment Orders
export const shipments = pgTable("shipments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumber: varchar("tracking_number").unique().notNull(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  recipientId: varchar("recipient_id").references(() => users.id),
  shippingPartnerId: varchar("shipping_partner_id").references(() => shippingPartners.id),
  
  // Pickup Details
  pickupAddress: text("pickup_address").notNull(),
  pickupCoordinates: jsonb("pickup_coordinates"), // {"lat": 18.0, "lng": -77.0}
  pickupContactName: varchar("pickup_contact_name").notNull(),
  pickupContactPhone: varchar("pickup_contact_phone").notNull(),
  pickupDate: timestamp("pickup_date"),
  pickupTimeSlot: varchar("pickup_time_slot"), // "9:00-12:00", "12:00-15:00", etc.
  
  // Delivery Details
  deliveryAddress: text("delivery_address").notNull(),
  deliveryCoordinates: jsonb("delivery_coordinates"),
  recipientName: varchar("recipient_name").notNull(),
  recipientPhone: varchar("recipient_phone").notNull(),
  deliveryDate: timestamp("delivery_date"),
  deliveryTimeSlot: varchar("delivery_time_slot"),
  deliveryInstructions: text("delivery_instructions"),
  
  // Package Details
  packageDescription: text("package_description").notNull(),
  packageWeight: decimal("package_weight", { precision: 8, scale: 3 }).notNull(), // kg
  packageDimensions: jsonb("package_dimensions"), // {"length": 30, "width": 20, "height": 10}
  packageValue: decimal("package_value", { precision: 10, scale: 2 }), // For insurance
  isFragile: boolean("is_fragile").default(false),
  requiresSignature: boolean("requires_signature").default(false),
  
  // Service Type & Pricing
  serviceType: varchar("service_type").default("standard"), // "standard", "express", "same_day", "next_day"
  priority: varchar("priority").default("normal"), // "low", "normal", "high", "urgent"
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull(),
  insuranceCost: decimal("insurance_cost", { precision: 8, scale: 2 }).default("0"),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  
  // Status & Tracking
  status: varchar("status").default("pending"), // "pending", "confirmed", "pickup_scheduled", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed", "cancelled"
  currentLocation: text("current_location"),
  estimatedDeliveryTime: timestamp("estimated_delivery_time"),
  actualPickupTime: timestamp("actual_pickup_time"),
  actualDeliveryTime: timestamp("actual_delivery_time"),
  
  // AI Communication Log
  aiCommunicationEnabled: boolean("ai_communication_enabled").default(true),
  lastAiUpdate: timestamp("last_ai_update"),
  aiSummary: text("ai_summary"), // AI-generated status summary for human operators
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Communication & Human Oversight
export const communicationLogs = pgTable("communication_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shipmentId: varchar("shipment_id").notNull().references(() => shipments.id),
  communicationType: varchar("communication_type").notNull(), // "ai_automated", "human_initiated", "ai_escalated", "customer_inquiry"
  participantType: varchar("participant_type").notNull(), // "customer", "driver", "ai_assistant", "human_operator"
  participantId: varchar("participant_id"), // User ID or system identifier
  participantName: varchar("participant_name"),
  contactMethod: varchar("contact_method"), // "phone", "whatsapp", "sms", "email", "in_app"
  messageContent: text("message_content").notNull(),
  aiGenerated: boolean("ai_generated").default(false),
  humanReviewed: boolean("human_reviewed").default(false),
  escalatedToHuman: boolean("escalated_to_human").default(false),
  escalationReason: varchar("escalation_reason"), // "complex_issue", "customer_request", "ai_confidence_low"
  responseRequired: boolean("response_required").default(false),
  responseDeadline: timestamp("response_deadline"),
  responseProvided: boolean("response_provided").default(false),
  sentiment: varchar("sentiment"), // "positive", "neutral", "negative", "frustrated"
  urgency: varchar("urgency").default("normal"), // "low", "normal", "high", "critical"
  createdAt: timestamp("created_at").defaultNow(),
});

// Human Operators (YardFlex Staff)
export const humanOperators = pgTable("human_operators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  whatsappNumber: varchar("whatsapp_number"),
  email: varchar("email").notNull(),
  role: varchar("role").default("operator"), // "operator", "supervisor", "manager"
  specialties: jsonb("specialties"), // ["customer_service", "logistics", "technical_support"]
  languages: jsonb("languages").default('["English"]'), // Supported languages
  workingHours: jsonb("working_hours"), // Schedule availability
  isActive: boolean("is_active").default(true),
  isOnline: boolean("is_online").default(false),
  currentLoad: integer("current_load").default(0), // Number of active conversations
  maxLoad: integer("max_load").default(10), // Maximum concurrent conversations
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.0"),
  totalConversations: integer("total_conversations").default(0),
  averageResponseTime: integer("average_response_time"), // In minutes
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Real-time Location Tracking
export const shipmentTracking = pgTable("shipment_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shipmentId: varchar("shipment_id").notNull().references(() => shipments.id),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }), // GPS accuracy in meters
  altitude: decimal("altitude", { precision: 6, scale: 2 }), // Height above sea level
  speed: decimal("speed", { precision: 5, scale: 2 }), // km/h
  heading: decimal("heading", { precision: 5, scale: 2 }), // Direction in degrees
  driverNotes: text("driver_notes"),
  photoUrl: varchar("photo_url"), // Proof of delivery photo
  batteryLevel: integer("battery_level"), // Driver's device battery
  signalStrength: integer("signal_strength"), // Network signal strength
  timestamp: timestamp("timestamp").defaultNow(),
});

// Cost Reduction Analytics
export const costAnalytics = pgTable("cost_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  period: varchar("period").notNull(), // "daily", "weekly", "monthly"
  periodDate: date("period_date").notNull(),
  
  // Traditional vs YardFlex Costs
  traditionalShippingCost: decimal("traditional_shipping_cost", { precision: 10, scale: 2 }).default("0"),
  yardflexShippingCost: decimal("yardflex_shipping_cost", { precision: 10, scale: 2 }).default("0"),
  costSavings: decimal("cost_savings", { precision: 10, scale: 2 }).default("0"),
  savingsPercentage: decimal("savings_percentage", { precision: 5, scale: 2 }).default("0"),
  
  // Efficiency Metrics
  totalShipments: integer("total_shipments").default(0),
  averageDeliveryTime: decimal("average_delivery_time", { precision: 5, scale: 2 }), // Hours
  onTimeDeliveries: integer("on_time_deliveries").default(0),
  customerSatisfactionScore: decimal("customer_satisfaction_score", { precision: 3, scale: 2 }).default("5.0"),
  
  // Environmental Impact
  totalDistanceSaved: decimal("total_distance_saved", { precision: 10, scale: 2 }).default("0"), // km
  fuelSaved: decimal("fuel_saved", { precision: 8, scale: 2 }).default("0"), // Liters
  co2Reduced: decimal("co2_reduced", { precision: 8, scale: 2 }).default("0"), // kg
  
  createdAt: timestamp("created_at").defaultNow(),
});

// ===================== RELATIONS =====================

export const shippingPartnersRelations = relations(shippingPartners, ({ many }) => ({
  shipments: many(shipments),
}));

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  sender: one(users, {
    fields: [shipments.senderId],
    references: [users.id],
  }),
  recipient: one(users, {
    fields: [shipments.recipientId],
    references: [users.id],
  }),
  shippingPartner: one(shippingPartners, {
    fields: [shipments.shippingPartnerId],
    references: [shippingPartners.id],
  }),
  communicationLogs: many(communicationLogs),
  trackingData: many(shipmentTracking),
}));

export const communicationLogsRelations = relations(communicationLogs, ({ one }) => ({
  shipment: one(shipments, {
    fields: [communicationLogs.shipmentId],
    references: [shipments.id],
  }),
}));

export const humanOperatorsRelations = relations(humanOperators, ({ one }) => ({
  user: one(users, {
    fields: [humanOperators.userId],
    references: [users.id],
  }),
}));

export const shipmentTrackingRelations = relations(shipmentTracking, ({ one }) => ({
  shipment: one(shipments, {
    fields: [shipmentTracking.shipmentId],
    references: [shipments.id],
  }),
}));

// ===================== INSERT SCHEMAS =====================

export const insertShippingPartnerSchema = createInsertSchema(shippingPartners);
export const insertShipmentSchema = createInsertSchema(shipments);
export const insertCommunicationLogSchema = createInsertSchema(communicationLogs);
export const insertHumanOperatorSchema = createInsertSchema(humanOperators);
export const insertShipmentTrackingSchema = createInsertSchema(shipmentTracking);
export const insertCostAnalyticsSchema = createInsertSchema(costAnalytics);

// ===================== TYPES =====================

export type ShippingPartner = typeof shippingPartners.$inferSelect;
export type InsertShippingPartner = typeof shippingPartners.$inferInsert;
export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;
export type CommunicationLog = typeof communicationLogs.$inferSelect;
export type InsertCommunicationLog = typeof communicationLogs.$inferInsert;
export type HumanOperator = typeof humanOperators.$inferSelect;
export type InsertHumanOperator = typeof humanOperators.$inferInsert;
export type ShipmentTracking = typeof shipmentTracking.$inferSelect;
export type InsertShipmentTracking = typeof shipmentTracking.$inferInsert;
export type CostAnalytics = typeof costAnalytics.$inferSelect;
export type InsertCostAnalytics = typeof costAnalytics.$inferInsert;

// ===================== AR REAL ESTATE SCANNING SYSTEM =====================

// Property Listings with AR Integration
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingNumber: varchar("listing_number").unique().notNull(),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  
  // Basic Property Info
  title: varchar("title").notNull(),
  description: text("description"),
  propertyType: varchar("property_type").notNull(), // "house", "apartment", "condo", "commercial", "land"
  address: text("address").notNull(),
  city: varchar("city").notNull(),
  parish: varchar("parish").notNull(), // Jamaica parishes
  coordinates: jsonb("coordinates"), // {"lat": 18.0, "lng": -77.0}
  
  // Property Details
  bedrooms: integer("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }), // 2.5 bathrooms
  squareFootage: decimal("square_footage", { precision: 8, scale: 2 }),
  lotSize: decimal("lot_size", { precision: 10, scale: 2 }), // In square meters
  yearBuilt: integer("year_built"),
  
  // Pricing
  askingPrice: decimal("asking_price", { precision: 12, scale: 2 }).notNull(), // KWD
  pricePerSqFt: decimal("price_per_sq_ft", { precision: 8, scale: 2 }),
  negotiable: boolean("negotiable").default(true),
  
  // AR Scan Status
  hasScan: boolean("has_scan").default(false),
  scanQuality: varchar("scan_quality"), // "basic", "standard", "premium", "professional"
  scanDate: timestamp("scan_date"),
  scannerUserId: varchar("scanner_user_id").references(() => users.id),
  
  // Listing Status
  status: varchar("status").default("draft"), // "draft", "active", "pending", "sold", "withdrawn"
  listingDate: timestamp("listing_date"),
  soldDate: timestamp("sold_date"),
  soldPrice: decimal("sold_price", { precision: 12, scale: 2 }),
  buyerId: varchar("buyer_id").references(() => users.id),
  
  // Platform Fees
  yardflexCommission: decimal("yardflex_commission", { precision: 8, scale: 2 }).default("2.0"), // 2% vs 6% traditional
  sellerSavings: decimal("seller_savings", { precision: 10, scale: 2 }), // How much saved vs traditional agents
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AR 3D Scan Data Storage
export const arScans = pgTable("ar_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  scannerUserId: varchar("scanner_user_id").notNull().references(() => users.id),
  
  // Scan Technical Details
  scanType: varchar("scan_type").notNull(), // "lidar", "photogrammetry", "hybrid"
  deviceUsed: varchar("device_used"), // "iPhone 15 Pro", "Meta Ray-Ban", "HoloLens"
  scanResolution: varchar("scan_resolution"), // "low", "medium", "high", "ultra"
  pointCloudSize: integer("point_cloud_size"), // Number of points captured
  
  // 3D Model Files (URLs to cloud storage)
  pointCloudUrl: varchar("point_cloud_url"), // Raw scan data
  meshModelUrl: varchar("mesh_model_url"), // 3D mesh file
  texturedModelUrl: varchar("textured_model_url"), // With textures/colors
  floorPlanUrl: varchar("floor_plan_url"), // 2D floor plan extracted
  
  // Room-by-Room Breakdown
  roomData: jsonb("room_data"), // Detailed measurements for each room
  totalRooms: integer("total_rooms"),
  
  // Measurements & Calculations
  totalSquareFootage: decimal("total_square_footage", { precision: 8, scale: 2 }),
  ceilingHeights: jsonb("ceiling_heights"), // Per room
  wallDimensions: jsonb("wall_dimensions"), // Length, height per wall
  windowDimensions: jsonb("window_dimensions"),
  doorDimensions: jsonb("door_dimensions"),
  
  // Quality Metrics
  accuracyScore: decimal("accuracy_score", { precision: 3, scale: 2 }), // 0-100%
  completenessScore: decimal("completeness_score", { precision: 3, scale: 2 }), // 0-100%
  visualQuality: decimal("visual_quality", { precision: 3, scale: 2 }), // 0-100%
  
  // Processing Status
  processingStatus: varchar("processing_status").default("processing"), // "processing", "complete", "failed"
  processingProgress: integer("processing_progress").default(0), // 0-100%
  errorMessage: text("error_message"),
  
  scanDuration: integer("scan_duration"), // Minutes taken to scan
  fileSize: decimal("file_size", { precision: 8, scale: 2 }), // MB
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Virtual Tour Sessions
export const virtualTours = pgTable("virtual_tours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  viewerId: varchar("viewer_id").references(() => users.id), // Potential buyer
  
  // Tour Details
  tourType: varchar("tour_type").notNull(), // "ar_glasses", "mobile_app", "web_browser", "vr_headset"
  deviceInfo: jsonb("device_info"), // Device specifications
  sessionDuration: integer("session_duration"), // Minutes
  
  // Interaction Tracking
  roomsVisited: jsonb("rooms_visited"), // Which rooms they explored
  measurementsTaken: jsonb("measurements_taken"), // What they measured
  photosCapture: jsonb("photos_captured"), // Screenshots they took
  notesAdded: jsonb("notes_added"), // Their comments/observations
  
  // Interest Level Indicators
  viewingTime: integer("viewing_time"), // Total seconds spent
  returnVisits: integer("return_visits").default(1),
  sharedWith: jsonb("shared_with"), // Who they shared the tour with
  inquiryGenerated: boolean("inquiry_generated").default(false),
  
  // Location & Context
  viewerLocation: jsonb("viewer_location"), // Where they took the virtual tour
  realVisitScheduled: boolean("real_visit_scheduled").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Property Inquiries & Offers
export const propertyInquiries = pgTable("property_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  inquirerId: varchar("inquirer_id").notNull().references(() => users.id),
  
  // Inquiry Type
  inquiryType: varchar("inquiry_type").notNull(), // "viewing_request", "price_question", "offer", "general"
  message: text("message"),
  
  // Offer Details (if applicable)
  offerAmount: decimal("offer_amount", { precision: 12, scale: 2 }),
  financing: jsonb("financing"), // Financing details
  contingencies: jsonb("contingencies"), // Conditions
  closingDate: timestamp("closing_date"),
  
  // Response Tracking
  status: varchar("status").default("pending"), // "pending", "responded", "accepted", "rejected", "countered"
  ownerResponse: text("owner_response"),
  responseTime: integer("response_time"), // Hours to respond
  
  // AI-Assisted Matching
  aiMatchScore: decimal("ai_match_score", { precision: 3, scale: 2 }), // How well buyer matches property
  aiRecommendations: jsonb("ai_recommendations"), // AI suggestions for negotiation
  
  createdAt: timestamp("created_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

// AR Scanning Equipment & Certification
export const arScanners = pgTable("ar_scanners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Scanner Profile
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email").notNull(),
  serviceArea: jsonb("service_area"), // Areas they cover
  
  // Equipment & Certification
  equipment: jsonb("equipment"), // List of devices they use
  certificationLevel: varchar("certification_level").default("basic"), // "basic", "advanced", "professional"
  certificationDate: timestamp("certification_date"),
  scanAccuracy: decimal("scan_accuracy", { precision: 3, scale: 2 }).default("95.0"), // %
  
  // Performance Metrics
  totalScans: integer("total_scans").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  completionRate: decimal("completion_rate", { precision: 3, scale: 2 }).default("100.0"), // %
  averageTurnaround: decimal("average_turnaround", { precision: 4, scale: 1 }), // Hours
  
  // Pricing
  basicScanPrice: decimal("basic_scan_price", { precision: 8, scale: 2 }), // KWD
  premiumScanPrice: decimal("premium_scan_price", { precision: 8, scale: 2 }), // KWD
  rushJobMultiplier: decimal("rush_job_multiplier", { precision: 3, scale: 2 }).default("1.5"),
  
  // Availability
  isActive: boolean("is_active").default(true),
  availableHours: jsonb("available_hours"),
  currentBookings: integer("current_bookings").default(0),
  maxBookingsPerDay: integer("max_bookings_per_day").default(3),
  
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
});

// Real Estate Market Disruption Analytics
export const marketDisruption = pgTable("market_disruption", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  period: varchar("period").notNull(), // "daily", "weekly", "monthly"
  periodDate: date("period_date").notNull(),
  
  // Traditional vs YardFlex Comparison
  traditionalAgentFees: decimal("traditional_agent_fees", { precision: 12, scale: 2 }).default("0"), // 6% commission
  yardflexFees: decimal("yardflex_fees", { precision: 12, scale: 2 }).default("0"), // 2% commission
  customerSavings: decimal("customer_savings", { precision: 12, scale: 2 }).default("0"),
  
  // Market Activity
  propertiesListed: integer("properties_listed").default(0),
  propertiesSold: integer("properties_sold").default(0),
  averageDaysOnMarket: decimal("average_days_on_market", { precision: 5, scale: 1 }),
  averageSalePrice: decimal("average_sale_price", { precision: 12, scale: 2 }),
  
  // Virtual Tour Impact
  totalVirtualTours: integer("total_virtual_tours").default(0),
  virtualToPhysicalRatio: decimal("virtual_to_physical_ratio", { precision: 3, scale: 2 }), // How many virtual tours per physical visit
  virtualTourConversionRate: decimal("virtual_tour_conversion_rate", { precision: 3, scale: 2 }), // % that lead to offers
  
  // Disruption Metrics
  traditionalAgentsDisplaced: integer("traditional_agents_displaced").default(0),
  marketShareCapture: decimal("market_share_capture", { precision: 5, scale: 2 }).default("0"), // % of local market
  customerSatisfactionScore: decimal("customer_satisfaction_score", { precision: 3, scale: 2 }).default("5.0"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// ===================== RELATIONS =====================

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, {
    fields: [properties.ownerId],
    references: [users.id],
  }),
  buyer: one(users, {
    fields: [properties.buyerId], 
    references: [users.id],
  }),
  scanner: one(users, {
    fields: [properties.scannerUserId],
    references: [users.id],
  }),
  arScans: many(arScans),
  virtualTours: many(virtualTours),
  inquiries: many(propertyInquiries),
}));

export const arScansRelations = relations(arScans, ({ one }) => ({
  property: one(properties, {
    fields: [arScans.propertyId],
    references: [properties.id],
  }),
  scanner: one(users, {
    fields: [arScans.scannerUserId],
    references: [users.id],
  }),
}));

export const virtualToursRelations = relations(virtualTours, ({ one }) => ({
  property: one(properties, {
    fields: [virtualTours.propertyId],
    references: [properties.id],
  }),
  viewer: one(users, {
    fields: [virtualTours.viewerId],
    references: [users.id],
  }),
}));

export const propertyInquiriesRelations = relations(propertyInquiries, ({ one }) => ({
  property: one(properties, {
    fields: [propertyInquiries.propertyId],
    references: [properties.id],
  }),
  inquirer: one(users, {
    fields: [propertyInquiries.inquirerId],
    references: [users.id],
  }),
}));

export const arScannersRelations = relations(arScanners, ({ one }) => ({
  user: one(users, {
    fields: [arScanners.userId],
    references: [users.id],
  }),
}));

// ===================== INSERT SCHEMAS =====================

export const insertPropertySchema = createInsertSchema(properties);
export const insertArScanSchema = createInsertSchema(arScans);
export const insertVirtualTourSchema = createInsertSchema(virtualTours);
export const insertPropertyInquirySchema = createInsertSchema(propertyInquiries);
export const insertArScannerSchema = createInsertSchema(arScanners);
export const insertMarketDisruptionSchema = createInsertSchema(marketDisruption);

// ===================== TYPES =====================

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;
export type ArScan = typeof arScans.$inferSelect;
export type InsertArScan = typeof arScans.$inferInsert;
export type VirtualTour = typeof virtualTours.$inferSelect;
export type InsertVirtualTour = typeof virtualTours.$inferInsert;
export type PropertyInquiry = typeof propertyInquiries.$inferSelect;
export type InsertPropertyInquiry = typeof propertyInquiries.$inferInsert;
export type ArScanner = typeof arScanners.$inferSelect;
export type InsertArScanner = typeof arScanners.$inferInsert;
export type MarketDisruption = typeof marketDisruption.$inferSelect;
export type InsertMarketDisruption = typeof marketDisruption.$inferInsert;

// ===================== AR RENOVATION VISUALIZATION SYSTEM =====================

// Renovation Planning & Visualization
export const renovationPlans = pgTable("renovation_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  plannerId: varchar("planner_id").notNull().references(() => users.id), // Who created the plan
  
  // Plan Details
  planName: varchar("plan_name").notNull(),
  description: text("description"),
  renovationType: varchar("renovation_type").notNull(), // "cosmetic", "structural", "addition", "complete_remodel"
  difficultyLevel: varchar("difficulty_level").default("medium"), // "easy", "medium", "hard", "professional"
  
  // Before & After Visualization
  beforeScanId: varchar("before_scan_id").references(() => arScans.id),
  afterVisualizationUrl: varchar("after_visualization_url"), // 3D model of renovated space
  beforeAfterComparisonUrl: varchar("before_after_comparison_url"), // Side-by-side view
  
  // Cost Analysis
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }), // Total in KWD
  materialsCost: decimal("materials_cost", { precision: 10, scale: 2 }),
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }),
  permitsCost: decimal("permits_cost", { precision: 8, scale: 2 }),
  contingencyCost: decimal("contingency_cost", { precision: 8, scale: 2 }), // 10-20% buffer
  
  // Timeline
  estimatedDuration: integer("estimated_duration"), // Days
  phases: jsonb("phases"), // Breakdown of renovation phases
  
  // Value Addition
  currentPropertyValue: decimal("current_property_value", { precision: 12, scale: 2 }),
  projectedValueAfter: decimal("projected_value_after", { precision: 12, scale: 2 }),
  expectedRoi: decimal("expected_roi", { precision: 5, scale: 2 }), // Return on investment %
  
  // AI Confidence & Recommendations
  aiConfidenceScore: decimal("ai_confidence_score", { precision: 3, scale: 2 }), // 0-100%
  aiRecommendations: jsonb("ai_recommendations"),
  alternativePlans: jsonb("alternative_plans"), // Other suggested approaches
  
  // Status
  status: varchar("status").default("draft"), // "draft", "shared", "approved", "in_progress", "completed"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Room-by-Room Renovation Breakdown
export const roomRenovations = pgTable("room_renovations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  renovationPlanId: varchar("renovation_plan_id").notNull().references(() => renovationPlans.id),
  
  // Room Identification
  roomName: varchar("room_name").notNull(), // "Living Room", "Kitchen", "Master Bedroom"
  roomType: varchar("room_type").notNull(), // "bedroom", "bathroom", "kitchen", "living", "dining"
  currentDimensions: jsonb("current_dimensions"), // {"length": 12, "width": 10, "height": 9}
  proposedDimensions: jsonb("proposed_dimensions"), // After renovation
  
  // What's Being Changed
  wallsToRemove: jsonb("walls_to_remove"), // Which walls are being torn down
  wallsToAdd: jsonb("walls_to_add"), // New walls being built
  windowChanges: jsonb("window_changes"), // Add/remove/resize windows
  doorChanges: jsonb("door_changes"), // Door modifications
  ceilingChanges: jsonb("ceiling_changes"), // Height changes, coffers, etc.
  
  // Materials & Finishes
  flooringPlan: jsonb("flooring_plan"), // Type, cost, installation
  wallFinishes: jsonb("wall_finishes"), // Paint, wallpaper, tile, etc.
  ceilingFinishes: jsonb("ceiling_finishes"),
  lightingPlan: jsonb("lighting_plan"), // New fixtures, switches
  
  // Room-Specific Features
  kitchenUpgrades: jsonb("kitchen_upgrades"), // Cabinets, appliances, countertops
  bathroomUpgrades: jsonb("bathroom_upgrades"), // Fixtures, tile, vanity
  builtInFeatures: jsonb("built_in_features"), // Closets, shelving, entertainment centers
  
  // Costs & Timeline
  roomCost: decimal("room_cost", { precision: 10, scale: 2 }),
  roomDuration: integer("room_duration"), // Days
  priority: integer("priority").default(1), // Order of renovation
  
  // Before/After Images
  beforeImageUrls: jsonb("before_image_urls"),
  afterVisualizationUrls: jsonb("after_visualization_urls"),
  progressImageUrls: jsonb("progress_image_urls"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Material Detection & Replacement Suggestions
export const materialAnalysis = pgTable("material_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  arScanId: varchar("ar_scan_id").notNull().references(() => arScans.id),
  
  // Detected Materials
  materialType: varchar("material_type").notNull(), // "flooring", "wall", "ceiling", "fixture"
  currentMaterial: varchar("current_material"), // "hardwood", "carpet", "tile", "drywall"
  materialCondition: varchar("material_condition"), // "excellent", "good", "fair", "poor", "replace"
  
  // Location in Property
  roomLocation: varchar("room_location"),
  specificArea: varchar("specific_area"), // "north_wall", "center_floor", "around_window"
  coordinates: jsonb("coordinates"), // 3D position in scan
  
  // Replacement Suggestions
  suggestedMaterials: jsonb("suggested_materials"), // Array of alternatives with costs
  upgradeOptions: jsonb("upgrade_options"), // Premium alternatives
  budgetOptions: jsonb("budget_options"), // Economical alternatives
  
  // Cost Analysis
  currentValue: decimal("current_value", { precision: 8, scale: 2 }),
  replacementCost: decimal("replacement_cost", { precision: 8, scale: 2 }),
  upgradeValue: decimal("upgrade_value", { precision: 8, scale: 2 }), // Added property value
  
  // AI Analysis
  aiConfidence: decimal("ai_confidence", { precision: 3, scale: 2 }), // Accuracy of detection
  priorityScore: integer("priority_score"), // 1-10, urgency of replacement
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Structural Analysis & Safety Checks
export const structuralAnalysis = pgTable("structural_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  arScanId: varchar("ar_scan_id").notNull().references(() => arScans.id),
  
  // Wall Analysis
  loadBearingWalls: jsonb("load_bearing_walls"), // Which walls can't be removed
  removableWalls: jsonb("removable_walls"), // Safe to remove
  wallCondition: jsonb("wall_condition"), // Structural integrity per wall
  
  // Foundation & Support
  foundationVisible: boolean("foundation_visible").default(false),
  foundationCondition: varchar("foundation_condition"), // If visible
  supportBeams: jsonb("support_beams"), // Locations and conditions
  
  // Safety Concerns
  safetyIssues: jsonb("safety_issues"), // Electrical, plumbing, structural
  permitsRequired: jsonb("permits_required"), // What permits needed for changes
  professionalRequired: jsonb("professional_required"), // Architect, engineer, contractor
  
  // Modification Possibilities
  wallRemovalPossible: jsonb("wall_removal_possible"),
  additionPossible: jsonb("addition_possible"), // Where additions can be made
  secondFloorPossible: boolean("second_floor_possible").default(false),
  
  // Code Compliance
  buildingCodeIssues: jsonb("building_code_issues"),
  zoneRestrictions: jsonb("zone_restrictions"),
  hoa_restrictions: jsonb("hoa_restrictions"), // If applicable
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Design Style Suggestions
export const designSuggestions = pgTable("design_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  renovationPlanId: varchar("renovation_plan_id").notNull().references(() => renovationPlans.id),
  
  // Style Analysis
  currentStyle: varchar("current_style"), // "traditional", "modern", "colonial", "contemporary"
  suggestedStyles: jsonb("suggested_styles"), // Compatible styles for the space
  trendingStyles: jsonb("trending_styles"), // What's popular now
  
  // Color Palettes
  currentColors: jsonb("current_colors"),
  suggestedPalettes: jsonb("suggested_palettes"), // Multiple color scheme options
  seasonalOptions: jsonb("seasonal_options"),
  
  // Furniture & Layout
  currentLayout: jsonb("current_layout"),
  optimizedLayouts: jsonb("optimized_layouts"), // Better space utilization
  furnitureSuggestions: jsonb("furniture_suggestions"),
  
  // Lighting Design
  naturalLightAnalysis: jsonb("natural_light_analysis"),
  artificialLightingPlan: jsonb("artificial_lighting_plan"),
  ambientLightingSuggestions: jsonb("ambient_lighting_suggestions"),
  
  // Market Appeal
  marketAppealScore: decimal("market_appeal_score", { precision: 3, scale: 2 }), // 0-100
  targetDemographic: jsonb("target_demographic"), // Who would love this style
  resaleValueImpact: decimal("resale_value_impact", { precision: 8, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Contractor & Service Provider Matching
export const renovationContractors = pgTable("renovation_contractors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Contractor Details
  companyName: varchar("company_name").notNull(),
  licenseNumber: varchar("license_number"),
  insuranceInfo: jsonb("insurance_info"),
  bonded: boolean("bonded").default(false),
  
  // Specializations
  specialties: jsonb("specialties"), // ["kitchen", "bathroom", "electrical", "plumbing"]
  experienceYears: integer("experience_years"),
  portfolioUrls: jsonb("portfolio_urls"), // Links to completed projects
  
  // Service Area & Availability
  serviceArea: jsonb("service_area"),
  currentCapacity: integer("current_capacity"), // How many jobs they can take
  averageProjectDuration: integer("average_project_duration"), // Days
  
  // Performance Metrics
  totalProjectsCompleted: integer("total_projects_completed").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  onTimePercentage: decimal("on_time_percentage", { precision: 5, scale: 2 }).default("100.0"),
  budgetAccuracy: decimal("budget_accuracy", { precision: 5, scale: 2 }), // % within original estimate
  
  // Pricing
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
  minimumJobSize: decimal("minimum_job_size", { precision: 8, scale: 2 }),
  yardflexCommissionRate: decimal("yardflex_commission_rate", { precision: 5, scale: 4 }).default("0.15"), // 15%
  
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
});

// ===================== RELATIONS =====================

export const renovationPlansRelations = relations(renovationPlans, ({ one, many }) => ({
  property: one(properties, {
    fields: [renovationPlans.propertyId],
    references: [properties.id],
  }),
  planner: one(users, {
    fields: [renovationPlans.plannerId],
    references: [users.id],
  }),
  beforeScan: one(arScans, {
    fields: [renovationPlans.beforeScanId],
    references: [arScans.id],
  }),
  roomRenovations: many(roomRenovations),
  designSuggestions: many(designSuggestions),
}));

export const roomRenovationsRelations = relations(roomRenovations, ({ one }) => ({
  renovationPlan: one(renovationPlans, {
    fields: [roomRenovations.renovationPlanId],
    references: [renovationPlans.id],
  }),
}));

export const materialAnalysisRelations = relations(materialAnalysis, ({ one }) => ({
  arScan: one(arScans, {
    fields: [materialAnalysis.arScanId],
    references: [arScans.id],
  }),
}));

export const structuralAnalysisRelations = relations(structuralAnalysis, ({ one }) => ({
  arScan: one(arScans, {
    fields: [structuralAnalysis.arScanId],
    references: [arScans.id],
  }),
}));

export const designSuggestionsRelations = relations(designSuggestions, ({ one }) => ({
  renovationPlan: one(renovationPlans, {
    fields: [designSuggestions.renovationPlanId],
    references: [renovationPlans.id],
  }),
}));

export const renovationContractorsRelations = relations(renovationContractors, ({ one }) => ({
  user: one(users, {
    fields: [renovationContractors.userId],
    references: [users.id],
  }),
}));

// ===================== INSERT SCHEMAS =====================

export const insertRenovationPlanSchema = createInsertSchema(renovationPlans);
export const insertRoomRenovationSchema = createInsertSchema(roomRenovations);
export const insertMaterialAnalysisSchema = createInsertSchema(materialAnalysis);
export const insertStructuralAnalysisSchema = createInsertSchema(structuralAnalysis);
export const insertDesignSuggestionSchema = createInsertSchema(designSuggestions);
export const insertRenovationContractorSchema = createInsertSchema(renovationContractors);

// ===================== TYPES =====================

export type RenovationPlan = typeof renovationPlans.$inferSelect;
export type InsertRenovationPlan = typeof renovationPlans.$inferInsert;
export type RoomRenovation = typeof roomRenovations.$inferSelect;
export type InsertRoomRenovation = typeof roomRenovations.$inferInsert;
export type MaterialAnalysis = typeof materialAnalysis.$inferSelect;
export type InsertMaterialAnalysis = typeof materialAnalysis.$inferInsert;
export type StructuralAnalysis = typeof structuralAnalysis.$inferSelect;
export type InsertStructuralAnalysis = typeof structuralAnalysis.$inferInsert;
export type DesignSuggestion = typeof designSuggestions.$inferSelect;
export type InsertDesignSuggestion = typeof designSuggestions.$inferInsert;
export type RenovationContractor = typeof renovationContractors.$inferSelect;
export type InsertRenovationContractor = typeof renovationContractors.$inferInsert;

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserWalletSchema = createInsertSchema(userWallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLocationUpdateSchema = createInsertSchema(locationUpdates).omit({
  id: true,
});

export const insertSecurityEventSchema = createInsertSchema(securityEvents).omit({
  id: true,
  createdAt: true,
});

export const insertUserDeviceSchema = createInsertSchema(userDevices).omit({
  id: true,
  createdAt: true,
});

export const insertAuthenticationLogSchema = createInsertSchema(authenticationLogs).omit({
  id: true,
  createdAt: true,
});

export const insertCbRadioChannelSchema = createInsertSchema(cbRadioChannels).omit({
  id: true,
  createdAt: true,
});

export const insertCbRadioMessageSchema = createInsertSchema(cbRadioMessages).omit({
  id: true,
  createdAt: true,
});

export const insertDriverCbProfileSchema = createInsertSchema(driverCbProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCbChannelSubscriptionSchema = createInsertSchema(cbChannelSubscriptions).omit({
  id: true,
  joinedAt: true,
});
