import { sql } from 'drizzle-orm';
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
