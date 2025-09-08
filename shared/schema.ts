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
  
  // YaadFlex Ultimate Translator - User Language Preferences
  preferredLang: varchar("preferred_lang").default('en-JM'), // User's preferred language (e.g., en-JM, es-HN, sw-KE)
  fallbackLang: varchar("fallback_lang").default('en-US'), // Fallback language
  showAlwaysEnglishToggle: boolean("show_always_english_toggle").default(true),
  captionVoiceMessages: boolean("caption_voice_messages").default(true),
  autoTranslateEnabled: boolean("auto_translate_enabled").default(true),
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

// YaadFlex Ultimate Translator Types
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export const insertMessageTranslationSchema = createInsertSchema(messageTranslations).omit({ id: true, createdAt: true });
export type InsertMessageTranslation = z.infer<typeof insertMessageTranslationSchema>;
export type MessageTranslation = typeof messageTranslations.$inferSelect;

export const insertChatParticipantSchema = createInsertSchema(chatParticipants).omit({ id: true, joinedAt: true });
export type InsertChatParticipant = z.infer<typeof insertChatParticipantSchema>;
export type ChatParticipant = typeof chatParticipants.$inferSelect;

export const insertTranslationReportSchema = createInsertSchema(translationReports).omit({ id: true, createdAt: true });
export type InsertTranslationReport = z.infer<typeof insertTranslationReportSchema>;
export type TranslationReport = typeof translationReports.$inferSelect;

// DEMO YFX WALLET SYSTEM - For Private Pilot Testing
export const demoWallets = pgTable("demo_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  balanceYfx: decimal("balance_yfx", { precision: 18, scale: 6 }).notNull().default('0.000000'),
  isDemoMode: boolean("is_demo_mode").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_demo_wallet_user").on(table.userId),
]);

// YaadFlex Ultimate Translator - Chat Messages (separate from CB Radio for global users)
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatId: varchar("chat_id").notNull(), // Conversation/thread identifier
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  messageType: varchar("message_type").notNull().default('text'), // 'text', 'voice', 'image', 'location'
  
  // Original message content
  originalText: text("original_text"), // Original message text
  originalLang: varchar("original_lang"), // Detected language (e.g., sw-KE, es-HN)
  langConfidence: decimal("lang_confidence", { precision: 5, scale: 2 }).default('0.95'), // Detection confidence
  
  // Message metadata
  voiceFileUrl: varchar("voice_file_url"), // For voice messages
  voiceDuration: integer("voice_duration"), // Duration in seconds
  imageUrl: varchar("image_url"), // For image messages
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  // Moderation and safety
  toxicityScore: decimal("toxicity_score", { precision: 5, scale: 2 }).default('0.01'), // Safety score 0-1
  isSafe: boolean("is_safe").default(true),
  isReported: boolean("is_reported").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_chat_messages_chat").on(table.chatId),
  index("idx_chat_messages_sender").on(table.senderId),
  index("idx_chat_messages_created").on(table.createdAt),
]);

// YaadFlex Ultimate Translator - Message Translations Cache
export const messageTranslations = pgTable("message_translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").references(() => chatMessages.id).notNull(),
  targetLang: varchar("target_lang").notNull(), // Target language (e.g., en-JM, es-HN)
  translatedText: text("translated_text").notNull(),
  translationQuality: decimal("translation_quality", { precision: 5, scale: 2 }).default('0.94'), // Quality score 0-1
  translationModel: varchar("translation_model").default('v-best'), // Model version used
  isHumanVerified: boolean("is_human_verified").default(false),
  translationTime: integer("translation_time"), // Time taken in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_translation_message_lang").on(table.messageId, table.targetLang),
]);

// YaadFlex Ultimate Translator - Chat Participants
export const chatParticipants = pgTable("chat_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatId: varchar("chat_id").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role").default('participant'), // 'participant', 'admin', 'moderator'
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  isActive: boolean("is_active").default(true),
  
  // Per-chat translation preferences
  preferredLangOverride: varchar("preferred_lang_override"), // Override global preference for this chat
  alwaysShowOriginal: boolean("always_show_original").default(false), // From specific users
  alwaysShowEnglish: boolean("always_show_english").default(false),
  
  lastReadAt: timestamp("last_read_at").defaultNow(),
}, (table) => [
  index("idx_chat_participants_chat").on(table.chatId),
  index("idx_chat_participants_user").on(table.userId),
]);

// YaadFlex Ultimate Translator - Translation Reports for Quality Improvement
export const translationReports = pgTable("translation_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").references(() => chatMessages.id).notNull(),
  translationId: varchar("translation_id").references(() => messageTranslations.id).notNull(),
  reporterId: varchar("reporter_id").references(() => users.id).notNull(),
  issueType: varchar("issue_type").notNull(), // 'accuracy', 'context', 'offensive', 'technical'
  originalText: text("original_text").notNull(), // Copy for analysis
  incorrectTranslation: text("incorrect_translation").notNull(),
  suggestedTranslation: text("suggested_translation"), // User's correction
  reportDescription: text("report_description"),
  status: varchar("status").default('pending'), // 'pending', 'reviewed', 'resolved', 'dismissed'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_translation_reports_message").on(table.messageId),
  index("idx_translation_reports_status").on(table.status),
]);

// DEMO TRANSACTIONS - Track all YFX movements
export const demoTransactions = pgTable("demo_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // 'topup_sandbox', 'send', 'request', 'spend', 'earn', 'refund'
  amountYfx: decimal("amount_yfx", { precision: 18, scale: 6 }).notNull(),
  fxKwdToJmd: decimal("fx_kwd_to_jmd", { precision: 10, scale: 4 }).default('500.0000'), // 1 KWD = 500 JMD
  fxKwdToUsd: decimal("fx_kwd_to_usd", { precision: 10, scale: 4 }).default('3.2500'), // 1 KWD = 3.25 USD
  toUserId: varchar("to_user_id").references(() => users.id),
  fromUserId: varchar("from_user_id").references(() => users.id),
  orderId: varchar("order_id"),
  note: text("note"),
  status: varchar("status").notNull().default('completed'), // 'pending', 'completed', 'failed'
  meta: jsonb("meta"), // Additional data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_demo_tx_user").on(table.userId, table.createdAt),
  index("idx_demo_tx_type").on(table.type),
]);

// DEMO ORDERS - For testing marketplace
export const demoOrders = pgTable("demo_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").references(() => users.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id),
  totalYfx: decimal("total_yfx", { precision: 18, scale: 6 }).notNull(),
  platformFeeYfx: decimal("platform_fee_yfx", { precision: 18, scale: 6 }).notNull(),
  sellerEarningsYfx: decimal("seller_earnings_yfx", { precision: 18, scale: 6 }).notNull(),
  items: jsonb("items").notNull(), // Array of items
  deliveryAddress: text("delivery_address"),
  status: varchar("status").notNull().default('created'), // 'created', 'paid', 'preparing', 'en_route', 'delivered', 'completed'
  driverEta: integer("driver_eta"), // minutes
  isDemoMode: boolean("is_demo_mode").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// DEMO FEATURE FLAGS - Control what users see
export const demoFeatureFlags = pgTable("demo_feature_flags", {
  key: varchar("key").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  audience: varchar("audience").notNull().default('all'), // 'all', 'beta_tester', 'partner_tester'
  rollout: integer("rollout").notNull().default(0), // 0-100 percentage
  meta: jsonb("meta"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// PILOT TESTERS - For private access control
export const pilotTesters = pgTable("pilot_testers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  phone: varchar("phone"),
  region: varchar("region"), // "JM", "US", etc
  device: varchar("device"), // "Android", "iOS", "Web"
  role: varchar("role").notNull().default('waitlist'), // 'waitlist', 'invited', 'beta_tester', 'partner_tester', 'admin'
  orgCode: varchar("org_code"), // Partner org identifier
  inviteToken: varchar("invite_token").unique(),
  inviteExpiresAt: timestamp("invite_expires_at"),
  inviteUsedAt: timestamp("invite_used_at"),
  consentAt: timestamp("consent_at"), // When they agreed to NDA
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DemoWallet = typeof demoWallets.$inferSelect;
export type InsertDemoWallet = typeof demoWallets.$inferInsert;
export type DemoTransaction = typeof demoTransactions.$inferSelect;
export type InsertDemoTransaction = typeof demoTransactions.$inferInsert;
export type DemoOrder = typeof demoOrders.$inferSelect;
export type InsertDemoOrder = typeof demoOrders.$inferInsert;
export type DemoFeatureFlag = typeof demoFeatureFlags.$inferSelect;
export type InsertDemoFeatureFlag = typeof demoFeatureFlags.$inferInsert;
export type PilotTester = typeof pilotTesters.$inferSelect;
export type InsertPilotTester = typeof pilotTesters.$inferInsert;

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

// ===================== CORPORATE LOGISTICS INTEGRATION SYSTEM =====================

// Major Logistics Company Partnerships
export const logisticsPartners = pgTable("logistics_partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Company Information
  companyName: varchar("company_name").notNull(), // "Amazon", "FedEx", "UPS", "DHL", "USPS"
  companyCode: varchar("company_code").unique().notNull(), // "AMZN", "FEDX", "UPS", "DHL", "USPS"
  apiEndpoint: varchar("api_endpoint"), // Their API URL
  webhookUrl: varchar("webhook_url"), // Where they send us jobs
  
  // Integration Details
  integrationType: varchar("integration_type").notNull(), // "api", "webhook", "ftp", "email"
  authMethod: varchar("auth_method"), // "api_key", "oauth", "basic_auth", "certificate"
  isActive: boolean("is_active").default(true),
  testMode: boolean("test_mode").default(true), // Start in test mode
  
  // Business Terms
  contractType: varchar("contract_type").default("partner"), // "partner", "subcontractor", "franchise"
  paymentTerms: varchar("payment_terms").default("net_7"), // "net_7", "net_14", "net_30"
  baseRate: decimal("base_rate", { precision: 8, scale: 2 }), // Per delivery
  volumeDiscounts: jsonb("volume_discounts"), // Tiered pricing
  
  // Performance Requirements (SLAs)
  deliveryTimeRequirement: integer("delivery_time_requirement"), // Hours
  onTimeRequirement: decimal("on_time_requirement", { precision: 5, scale: 2 }).default("95.0"), // %
  damageRate: decimal("damage_rate", { precision: 5, scale: 4 }).default("0.1"), // Max % damaged packages
  
  // Service Areas & Capabilities
  serviceAreas: jsonb("service_areas"), // Geographic coverage
  serviceTypes: jsonb("service_types"), // ["standard", "express", "same_day", "fragile"]
  maxPackageWeight: decimal("max_package_weight", { precision: 6, scale: 2 }), // kg
  maxPackageSize: jsonb("max_package_size"), // {"length": 100, "width": 80, "height": 60}
  
  // Integration Status
  totalJobsReceived: integer("total_jobs_received").default(0),
  totalJobsCompleted: integer("total_jobs_completed").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  lastJobReceived: timestamp("last_job_received"),
  
  // Contact Information
  contactPerson: varchar("contact_person"),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  escalationContact: varchar("escalation_contact"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Corporate Delivery Jobs from Partners
export const corporateJobs = pgTable("corporate_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Job Identification
  partnerJobId: varchar("partner_job_id").notNull(), // Their tracking number
  partnerId: varchar("partner_id").notNull().references(() => logisticsPartners.id),
  yardflexTrackingNumber: varchar("yardflex_tracking_number").unique().notNull(),
  
  // Job Details
  jobType: varchar("job_type").notNull(), // "pickup", "delivery", "pickup_delivery"
  priority: varchar("priority").default("standard"), // "low", "standard", "high", "urgent", "rush"
  serviceType: varchar("service_type").default("standard"), // "standard", "express", "same_day", "next_day"
  
  // Pickup Information
  pickupAddress: text("pickup_address").notNull(),
  pickupCoordinates: jsonb("pickup_coordinates"),
  pickupContact: varchar("pickup_contact").notNull(),
  pickupPhone: varchar("pickup_phone").notNull(),
  pickupInstructions: text("pickup_instructions"),
  pickupTimeWindow: jsonb("pickup_time_window"), // {"start": "09:00", "end": "17:00"}
  
  // Delivery Information
  deliveryAddress: text("delivery_address").notNull(),
  deliveryCoordinates: jsonb("delivery_coordinates"),
  recipientName: varchar("recipient_name").notNull(),
  recipientPhone: varchar("recipient_phone"),
  deliveryInstructions: text("delivery_instructions"),
  deliveryTimeWindow: jsonb("delivery_time_window"),
  
  // Package Details
  packageCount: integer("package_count").default(1),
  totalWeight: decimal("total_weight", { precision: 8, scale: 3 }), // kg
  dimensions: jsonb("dimensions"), // Per package
  packageValue: decimal("package_value", { precision: 10, scale: 2 }),
  isFragile: boolean("is_fragile").default(false),
  requiresSignature: boolean("requires_signature").default(false),
  requiresIdCheck: boolean("requires_id_check").default(false),
  
  // Pricing
  partnerRate: decimal("partner_rate", { precision: 8, scale: 2 }), // What partner pays us
  driverPayout: decimal("driver_payout", { precision: 8, scale: 2 }), // What driver gets
  yardflexMargin: decimal("yardflex_margin", { precision: 8, scale: 2 }), // Our cut
  
  // Assignment & Status
  assignedDriverId: varchar("assigned_driver_id").references(() => users.id),
  status: varchar("status").default("pending"), // "pending", "assigned", "picked_up", "in_transit", "delivered", "failed", "cancelled"
  assignedAt: timestamp("assigned_at"),
  pickedUpAt: timestamp("picked_up_at"),
  deliveredAt: timestamp("delivered_at"),
  
  // SLA Tracking
  slaDeadline: timestamp("sla_deadline"), // When it must be delivered
  slaStatus: varchar("sla_status").default("on_track"), // "on_track", "at_risk", "breach"
  partnerNotified: boolean("partner_notified").default(false), // If we notified partner of issues
  
  // Quality & Feedback
  customerRating: decimal("customer_rating", { precision: 3, scale: 2 }),
  partnerFeedback: text("partner_feedback"),
  issueReports: jsonb("issue_reports"), // Damage, delay, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Corporate Performance Analytics
export const corporatePerformance = pgTable("corporate_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => logisticsPartners.id),
  period: varchar("period").notNull(), // "daily", "weekly", "monthly"
  periodDate: date("period_date").notNull(),
  
  // Volume Metrics
  totalJobs: integer("total_jobs").default(0),
  completedJobs: integer("completed_jobs").default(0),
  failedJobs: integer("failed_jobs").default(0),
  cancelledJobs: integer("cancelled_jobs").default(0),
  
  // Performance Metrics
  onTimeDeliveries: integer("on_time_deliveries").default(0),
  onTimePercentage: decimal("on_time_percentage", { precision: 5, scale: 2 }),
  averageDeliveryTime: decimal("average_delivery_time", { precision: 5, scale: 1 }), // Hours
  customerSatisfactionScore: decimal("customer_satisfaction_score", { precision: 3, scale: 2 }),
  
  // Financial Metrics
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }),
  totalDriverPayouts: decimal("total_driver_payouts", { precision: 10, scale: 2 }),
  totalYardflexEarnings: decimal("total_yardflex_earnings", { precision: 10, scale: 2 }),
  averageJobValue: decimal("average_job_value", { precision: 8, scale: 2 }),
  
  // Quality Metrics
  damageReports: integer("damage_reports").default(0),
  lostPackages: integer("lost_packages").default(0),
  customerComplaints: integer("customer_complaints").default(0),
  issueResolutionTime: decimal("issue_resolution_time", { precision: 5, scale: 1 }), // Hours
  
  // Capacity Utilization
  totalDriversUsed: integer("total_drivers_used"),
  peakHourDemand: integer("peak_hour_demand"),
  capacityUtilization: decimal("capacity_utilization", { precision: 5, scale: 2 }), // %
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Driver Corporate Job Preferences
export const driverCorporatePreferences = pgTable("driver_corporate_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => users.id),
  
  // Partner Preferences
  preferredPartners: jsonb("preferred_partners"), // Which companies they like working with
  excludedPartners: jsonb("excluded_partners"), // Companies they don't want jobs from
  
  // Job Type Preferences  
  preferredJobTypes: jsonb("preferred_job_types"), // "pickup", "delivery", "pickup_delivery"
  preferredServiceTypes: jsonb("preferred_service_types"), // "standard", "express", "same_day"
  maxPackageWeight: decimal("max_package_weight", { precision: 6, scale: 2 }),
  
  // Schedule Preferences
  corporateHoursOnly: boolean("corporate_hours_only").default(false), // 9-5 jobs only
  weekendsAvailable: boolean("weekends_available").default(true),
  eveningsAvailable: boolean("evenings_available").default(true),
  
  // Performance Tracking
  corporateJobsCompleted: integer("corporate_jobs_completed").default(0),
  corporateRating: decimal("corporate_rating", { precision: 3, scale: 2 }).default("5.0"),
  preferredByPartners: jsonb("preferred_by_partners"), // Which partners rate them highly
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API Integration Logs
export const integrationLogs = pgTable("integration_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => logisticsPartners.id),
  
  // Request Details
  requestType: varchar("request_type").notNull(), // "job_received", "status_update", "webhook", "api_call"
  requestData: jsonb("request_data"), // Full request payload
  responseData: jsonb("response_data"), // Our response
  
  // Status & Timing
  status: varchar("status").notNull(), // "success", "error", "timeout", "retry"
  errorMessage: text("error_message"),
  processingTime: integer("processing_time"), // Milliseconds
  retryCount: integer("retry_count").default(0),
  
  // Related Records
  corporateJobId: varchar("corporate_job_id").references(() => corporateJobs.id),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// ===================== RELATIONS =====================

export const logisticsPartnersRelations = relations(logisticsPartners, ({ many }) => ({
  corporateJobs: many(corporateJobs),
  performanceMetrics: many(corporatePerformance),
  integrationLogs: many(integrationLogs),
}));

export const corporateJobsRelations = relations(corporateJobs, ({ one }) => ({
  partner: one(logisticsPartners, {
    fields: [corporateJobs.partnerId],
    references: [logisticsPartners.id],
  }),
  assignedDriver: one(users, {
    fields: [corporateJobs.assignedDriverId],
    references: [users.id],
  }),
}));

export const corporatePerformanceRelations = relations(corporatePerformance, ({ one }) => ({
  partner: one(logisticsPartners, {
    fields: [corporatePerformance.partnerId],
    references: [logisticsPartners.id],
  }),
}));

export const driverCorporatePreferencesRelations = relations(driverCorporatePreferences, ({ one }) => ({
  driver: one(users, {
    fields: [driverCorporatePreferences.driverId],
    references: [users.id],
  }),
}));

export const integrationLogsRelations = relations(integrationLogs, ({ one }) => ({
  partner: one(logisticsPartners, {
    fields: [integrationLogs.partnerId],
    references: [logisticsPartners.id],
  }),
  corporateJob: one(corporateJobs, {
    fields: [integrationLogs.corporateJobId],
    references: [corporateJobs.id],
  }),
}));

// ===================== INSERT SCHEMAS =====================

export const insertLogisticsPartnerSchema = createInsertSchema(logisticsPartners);
export const insertCorporateJobSchema = createInsertSchema(corporateJobs);
export const insertCorporatePerformanceSchema = createInsertSchema(corporatePerformance);
export const insertDriverCorporatePreferencesSchema = createInsertSchema(driverCorporatePreferences);
export const insertIntegrationLogSchema = createInsertSchema(integrationLogs);

// ===================== TYPES =====================

export type LogisticsPartner = typeof logisticsPartners.$inferSelect;
export type InsertLogisticsPartner = typeof logisticsPartners.$inferInsert;
export type CorporateJob = typeof corporateJobs.$inferSelect;
export type InsertCorporateJob = typeof corporateJobs.$inferInsert;
export type CorporatePerformance = typeof corporatePerformance.$inferSelect;
export type InsertCorporatePerformance = typeof corporatePerformance.$inferInsert;
export type DriverCorporatePreferences = typeof driverCorporatePreferences.$inferSelect;
export type InsertDriverCorporatePreferences = typeof driverCorporatePreferences.$inferInsert;
export type IntegrationLog = typeof integrationLogs.$inferSelect;
export type InsertIntegrationLog = typeof integrationLogs.$inferInsert;

// ===================== MICRO-TASK & APPRENTICE SYSTEM =====================

// Quick Tasks - Small jobs for quick cash
export const quickTasks = pgTable("quick_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  posterId: varchar("poster_id").notNull().references(() => users.id),
  
  // Task Details
  title: varchar("title").notNull(), // "Clean my yard", "Paint small room", "Move furniture"
  description: text("description").notNull(),
  category: varchar("category").notNull(), // "cleaning", "painting", "moving", "landscaping", "handyman"
  skillLevel: varchar("skill_level").default("beginner"), // "beginner", "apprentice", "experienced"
  
  // Location
  address: text("address").notNull(),
  coordinates: jsonb("coordinates"),
  workLocation: varchar("work_location").default("customer_location"), // "customer_location", "remote", "pickup_required"
  
  // Pricing - Multiple options for different skill levels
  budget: decimal("budget", { precision: 8, scale: 2 }).notNull(), // What customer wants to pay
  professionalRate: decimal("professional_rate", { precision: 8, scale: 2 }), // Full professional cost
  apprenticeRate: decimal("apprentice_rate", { precision: 8, scale: 2 }), // Reduced rate for learners
  helperRate: decimal("helper_rate", { precision: 8, scale: 2 }), // Basic helper rate
  
  // Task Requirements
  estimatedHours: decimal("estimated_hours", { precision: 4, scale: 1 }).default("1.0"),
  peopleNeeded: integer("people_needed").default(1),
  toolsRequired: jsonb("tools_required"), // ["rake", "paint_brush", "ladder"]
  toolsProvided: jsonb("tools_provided"), // What customer provides
  
  // Scheduling
  flexibleTiming: boolean("flexible_timing").default(true),
  urgency: varchar("urgency").default("flexible"), // "urgent", "today", "this_week", "flexible"
  availableHours: jsonb("available_hours"), // When work can be done
  
  // Task Status
  status: varchar("status").default("open"), // "open", "assigned", "in_progress", "completed", "cancelled"
  assignedWorkerId: varchar("assigned_worker_id").references(() => users.id),
  assignedAt: timestamp("assigned_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  
  // Payment & Reviews
  finalPayment: decimal("final_payment", { precision: 8, scale: 2 }),
  customerRating: decimal("customer_rating", { precision: 3, scale: 2 }),
  workerRating: decimal("worker_rating", { precision: 3, scale: 2 }),
  customerReview: text("customer_review"),
  workerReview: text("worker_review"),
  
  // Special Features
  teachingOpportunity: boolean("teaching_opportunity").default(false), // Professional teaches apprentice
  groupTask: boolean("group_task").default(false), // Multiple people work together
  repeatTask: boolean("repeat_task").default(false), // Recurring job
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Worker Profiles for Micro-Tasks
export const taskWorkers = pgTable("task_workers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Worker Level
  workerLevel: varchar("worker_level").default("helper"), // "helper", "apprentice", "skilled", "professional"
  experienceYears: decimal("experience_years", { precision: 3, scale: 1 }).default("0.0"),
  
  // Skills & Categories
  skillCategories: jsonb("skill_categories"), // ["cleaning", "painting", "moving", "yard_work"]
  toolsOwned: jsonb("tools_owned"), // Tools they have
  transportation: varchar("transportation"), // "walk", "bike", "car", "truck"
  maxTravelDistance: decimal("max_travel_distance", { precision: 4, scale: 1 }).default("5.0"), // km
  
  // Availability
  availableHours: jsonb("available_hours"), // When they can work
  minJobSize: decimal("min_job_size", { precision: 6, scale: 2 }).default("15.00"), // Minimum they'll take
  preferredJobSize: varchar("preferred_job_size").default("small"), // "micro", "small", "medium", "large"
  
  // Performance
  tasksCompleted: integer("tasks_completed").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("100.0"), // % of tasks completed
  responseTime: decimal("response_time", { precision: 4, scale: 1 }), // Average hours to respond
  
  // Earnings & Goals
  totalEarned: decimal("total_earned", { precision: 10, scale: 2 }).default("0"),
  weeklyGoal: decimal("weekly_goal", { precision: 8, scale: 2 }), // How much they want to earn
  dailyGoal: decimal("daily_goal", { precision: 6, scale: 2 }),
  
  // Learning & Development
  learningMode: boolean("learning_mode").default(false), // Wants to learn from professionals
  teachingMode: boolean("teaching_mode").default(false), // Can teach others
  skillsLearning: jsonb("skills_learning"), // What they're trying to learn
  mentorId: varchar("mentor_id").references(() => users.id), // Professional who guides them
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Task Applications - When workers apply for tasks
export const taskApplications = pgTable("task_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").notNull().references(() => quickTasks.id),
  workerId: varchar("worker_id").notNull().references(() => users.id),
  
  // Application Details
  proposedRate: decimal("proposed_rate", { precision: 8, scale: 2 }).notNull(),
  proposedHours: decimal("proposed_hours", { precision: 4, scale: 1 }),
  proposedStartTime: timestamp("proposed_start_time"),
  
  // Worker's Message
  message: text("message"), // Why they're right for the job
  experience: text("experience"), // Relevant experience
  approach: text("approach"), // How they'll do the work
  
  // Status
  status: varchar("status").default("pending"), // "pending", "accepted", "rejected", "withdrawn"
  responseMessage: text("response_message"), // Customer's response
  
  createdAt: timestamp("created_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

// Apprentice Learning System
export const learningPrograms = pgTable("learning_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mentorId: varchar("mentor_id").notNull().references(() => users.id), // Professional
  apprenticeId: varchar("apprentice_id").notNull().references(() => users.id), // Learner
  
  // Program Details
  skillArea: varchar("skill_area").notNull(), // "painting", "electrical", "plumbing", "construction"
  programLevel: varchar("program_level").default("basic"), // "basic", "intermediate", "advanced"
  
  // Structure
  totalLessons: integer("total_lessons").default(10),
  completedLessons: integer("completed_lessons").default(0),
  practicalTasks: integer("practical_tasks").default(5), // Real jobs done together
  completedTasks: integer("completed_tasks").default(0),
  
  // Progress Tracking
  skillAssessments: jsonb("skill_assessments"), // Periodic skill tests
  strengths: jsonb("strengths"), // What apprentice is good at
  improvements: jsonb("improvements"), // What needs work
  
  // Financials
  programFee: decimal("program_fee", { precision: 8, scale: 2 }), // What apprentice pays
  earningsShare: decimal("earnings_share", { precision: 5, scale: 2 }).default("60.0"), // % apprentice gets from shared jobs
  
  // Status
  status: varchar("status").default("active"), // "active", "completed", "paused", "cancelled"
  graduationRequirements: jsonb("graduation_requirements"),
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Task Categories with Pricing Guidelines
export const taskCategories = pgTable("task_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  name: varchar("name").notNull(), // "Yard Cleanup", "Room Painting", "Furniture Moving"
  description: text("description"),
  parentCategory: varchar("parent_category"), // "cleaning", "painting", "moving"
  
  // Pricing Guidelines
  typicalHelperRate: decimal("typical_helper_rate", { precision: 6, scale: 2 }), // $15-25
  typicalApprenticeRate: decimal("typical_apprentice_rate", { precision: 6, scale: 2 }), // $25-35
  typicalProfessionalRate: decimal("typical_professional_rate", { precision: 6, scale: 2 }), // $40-60
  
  // Time Estimates
  minHours: decimal("min_hours", { precision: 3, scale: 1 }).default("0.5"),
  maxHours: decimal("max_hours", { precision: 3, scale: 1 }).default("8.0"),
  averageHours: decimal("average_hours", { precision: 3, scale: 1 }).default("2.0"),
  
  // Requirements
  commonTools: jsonb("common_tools"), // Tools usually needed
  skillsRequired: jsonb("skills_required"), // Basic skills needed
  safetyRequirements: jsonb("safety_requirements"), // Safety gear, precautions
  
  // Popular Tasks
  totalTasks: integer("total_tasks").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Quick Payment System for Micro-Tasks
export const taskPayments = pgTable("task_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").notNull().references(() => quickTasks.id),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  workerId: varchar("worker_id").notNull().references(() => users.id),
  
  // Payment Details
  agreedAmount: decimal("agreed_amount", { precision: 8, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 6, scale: 2 }), // YardFlex cut (15%)
  workerEarnings: decimal("worker_earnings", { precision: 8, scale: 2 }),
  
  // Payment Status
  status: varchar("status").default("pending"), // "pending", "paid", "disputed", "refunded"
  paymentMethod: varchar("payment_method").default("kwd_wallet"), // "kwd_wallet", "cash", "bank_transfer"
  
  // Timing
  paidAt: timestamp("paid_at"),
  disputeReason: text("dispute_reason"),
  resolvedAt: timestamp("resolved_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// ===================== RELATIONS =====================

export const quickTasksRelations = relations(quickTasks, ({ one, many }) => ({
  poster: one(users, {
    fields: [quickTasks.posterId],
    references: [users.id],
  }),
  assignedWorker: one(users, {
    fields: [quickTasks.assignedWorkerId],
    references: [users.id],
  }),
  applications: many(taskApplications),
  payment: one(taskPayments),
}));

export const taskWorkersRelations = relations(taskWorkers, ({ one }) => ({
  user: one(users, {
    fields: [taskWorkers.userId],
    references: [users.id],
  }),
  mentor: one(users, {
    fields: [taskWorkers.mentorId],
    references: [users.id],
  }),
}));

export const taskApplicationsRelations = relations(taskApplications, ({ one }) => ({
  task: one(quickTasks, {
    fields: [taskApplications.taskId],
    references: [quickTasks.id],
  }),
  worker: one(users, {
    fields: [taskApplications.workerId],
    references: [users.id],
  }),
}));

export const learningProgramsRelations = relations(learningPrograms, ({ one }) => ({
  mentor: one(users, {
    fields: [learningPrograms.mentorId],
    references: [users.id],
  }),
  apprentice: one(users, {
    fields: [learningPrograms.apprenticeId],
    references: [users.id],
  }),
}));

export const taskPaymentsRelations = relations(taskPayments, ({ one }) => ({
  task: one(quickTasks, {
    fields: [taskPayments.taskId],
    references: [quickTasks.id],
  }),
  customer: one(users, {
    fields: [taskPayments.customerId],
    references: [users.id],
  }),
  worker: one(users, {
    fields: [taskPayments.workerId],
    references: [users.id],
  }),
}));

// ===================== INSERT SCHEMAS =====================

export const insertQuickTaskSchema = createInsertSchema(quickTasks);
export const insertTaskWorkerSchema = createInsertSchema(taskWorkers);
export const insertTaskApplicationSchema = createInsertSchema(taskApplications);
export const insertLearningProgramSchema = createInsertSchema(learningPrograms);
export const insertTaskCategorySchema = createInsertSchema(taskCategories);
export const insertTaskPaymentSchema = createInsertSchema(taskPayments);

// ===================== TYPES =====================

export type QuickTask = typeof quickTasks.$inferSelect;
export type InsertQuickTask = typeof quickTasks.$inferInsert;
export type TaskWorker = typeof taskWorkers.$inferSelect;
export type InsertTaskWorker = typeof taskWorkers.$inferInsert;
export type TaskApplication = typeof taskApplications.$inferSelect;
export type InsertTaskApplication = typeof taskApplications.$inferInsert;
export type LearningProgram = typeof learningPrograms.$inferSelect;
export type InsertLearningProgram = typeof learningPrograms.$inferInsert;
export type TaskCategory = typeof taskCategories.$inferSelect;
export type InsertTaskCategory = typeof taskCategories.$inferInsert;
export type TaskPayment = typeof taskPayments.$inferSelect;
export type InsertTaskPayment = typeof taskPayments.$inferInsert;

// ===================== B2B WHOLESALE MARKETPLACE =====================

// Business Account Types - Strict B2B Only
export const businessAccounts = pgTable("business_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Business Type - VERY IMPORTANT FOR ACCESS CONTROL
  businessType: varchar("business_type").notNull(), // "manufacturer", "wholesaler", "retailer", "distributor"
  businessCategory: varchar("business_category").notNull(), // "furniture", "hardware", "construction", "automotive"
  
  // Business Information
  businessName: varchar("business_name").notNull(),
  businessRegistration: varchar("business_registration"), // TRN number in Jamaica
  businessLicense: varchar("business_license"),
  tradingName: varchar("trading_name"), // DBA name
  
  // Verification Status
  isVerified: boolean("is_verified").default(false),
  verificationLevel: varchar("verification_level").default("pending"), // "pending", "basic", "premium", "enterprise"
  verificationDocuments: jsonb("verification_documents"), // Uploaded docs
  
  // Contact & Location
  businessAddress: text("business_address").notNull(),
  businessPhone: varchar("business_phone").notNull(),
  businessEmail: varchar("business_email").notNull(),
  website: varchar("website"),
  
  // Business Details
  establishedYear: integer("established_year"),
  employeeCount: varchar("employee_count"), // "1-5", "6-20", "21-100", "100+"
  annualRevenue: varchar("annual_revenue"), // "under_100k", "100k_500k", "500k_1m", "1m+"
  
  // Trading Credentials
  minimumOrderValue: decimal("minimum_order_value", { precision: 10, scale: 2 }),
  paymentTerms: varchar("payment_terms").default("net_30"), // "cash", "net_15", "net_30", "net_60"
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }),
  
  // Access Controls - WHO CAN SEE WHAT
  sellsTo: jsonb("sells_to"), // ["retailer", "distributor"] - NOT "consumer"
  buysFrom: jsonb("buys_from"), // ["manufacturer", "wholesaler"]
  allowedCategories: jsonb("allowed_categories"), // What they can access
  
  // Performance
  totalOrders: integer("total_orders").default(0),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).default("0"),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  paymentHistory: varchar("payment_history").default("excellent"), // "excellent", "good", "fair", "poor"
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wholesale Product Catalog - B2B ONLY
export const wholesaleProducts = pgTable("wholesale_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull().references(() => businessAccounts.id),
  
  // Product Information
  productName: varchar("product_name").notNull(),
  productCode: varchar("product_code").unique(), // Supplier's internal code
  category: varchar("category").notNull(), // "chairs", "tables", "bed_heads", "coffee_tables"
  subcategory: varchar("subcategory"), // "dining_chairs", "office_chairs", "bar_stools"
  
  // Product Details
  description: text("description").notNull(),
  specifications: jsonb("specifications"), // Dimensions, materials, colors, etc.
  materials: jsonb("materials"), // "solid_wood", "metal", "fabric", etc.
  finishOptions: jsonb("finish_options"), // Available colors/finishes
  
  // Wholesale Pricing - NO RETAIL PRICES
  unitWholesalePrice: decimal("unit_wholesale_price", { precision: 10, scale: 2 }).notNull(),
  bulkPricing: jsonb("bulk_pricing"), // Tiered pricing for quantities
  minimumOrderQty: integer("minimum_order_qty").default(1),
  
  // Business Terms
  leadTime: integer("lead_time").default(7), // Days to manufacture/prepare
  shelfLife: integer("shelf_life"), // Days product stays good
  warranty: varchar("warranty"), // "1_year", "2_years", "lifetime"
  
  // Stock Information
  currentStock: integer("current_stock").default(0),
  productionCapacity: integer("production_capacity"), // Units per month
  isCustomizable: boolean("is_customizable").default(false),
  customizationOptions: jsonb("customization_options"),
  
  // Visibility Control
  visibleTo: jsonb("visible_to"), // ["retailer", "distributor"] - NEVER "consumer"
  requiredBusinessTypes: jsonb("required_business_types"), // Who can see this
  
  // Product Images & Media
  imageUrls: jsonb("image_urls"),
  catalogPdfUrl: varchar("catalog_pdf_url"),
  videoUrl: varchar("video_url"),
  
  // Performance Tracking
  totalOrders: integer("total_orders").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// B2B Orders - Wholesale Only
export const wholesaleOrders = pgTable("wholesale_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number").unique().notNull(),
  
  // Business Relationship
  buyerId: varchar("buyer_id").notNull().references(() => businessAccounts.id), // Store/Retailer
  supplierId: varchar("supplier_id").notNull().references(() => businessAccounts.id), // Manufacturer
  
  // Order Details
  orderItems: jsonb("order_items").notNull(), // Products and quantities
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
  shippingCost: decimal("shipping_cost", { precision: 8, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  
  // Business Terms
  paymentTerms: varchar("payment_terms").notNull(), // "net_30", "cash_on_delivery"
  deliveryTerms: varchar("delivery_terms").default("fob_supplier"), // "fob_supplier", "delivered"
  expectedDelivery: timestamp("expected_delivery"),
  
  // Order Status
  status: varchar("status").default("pending"), // "pending", "confirmed", "production", "shipped", "delivered", "cancelled"
  confirmationDate: timestamp("confirmation_date"),
  productionStartDate: timestamp("production_start_date"),
  shippedDate: timestamp("shipped_date"),
  deliveredDate: timestamp("delivered_date"),
  
  // Communication
  buyerNotes: text("buyer_notes"),
  supplierNotes: text("supplier_notes"),
  internalNotes: text("internal_notes"),
  
  // Payment Tracking
  paymentStatus: varchar("payment_status").default("pending"), // "pending", "partial", "paid", "overdue"
  paymentDueDate: timestamp("payment_due_date"),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).default("0"),
  paidDate: timestamp("paid_date"),
  
  // YardFlex Commission
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }), // 3-5% for B2B
  platformFeePaid: boolean("platform_fee_paid").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business Verification System
export const businessVerifications = pgTable("business_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessAccountId: varchar("business_account_id").notNull().references(() => businessAccounts.id),
  
  // Verification Type
  verificationType: varchar("verification_type").notNull(), // "trn", "business_license", "address", "references"
  
  // Documentation
  documentType: varchar("document_type"), // "tax_registration", "business_license", "utility_bill"
  documentUrl: varchar("document_url"),
  documentNumber: varchar("document_number"),
  
  // Verification Status
  status: varchar("status").default("pending"), // "pending", "approved", "rejected", "expired"
  verifiedBy: varchar("verified_by"), // YardFlex staff member
  verificationDate: timestamp("verification_date"),
  expiryDate: timestamp("expiry_date"),
  
  // Notes
  rejectionReason: text("rejection_reason"),
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Access Control Matrix - Who Can See What
export const businessAccessControls = pgTable("business_access_controls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Access Rules
  fromBusinessType: varchar("from_business_type").notNull(), // "manufacturer"
  toBusinessType: varchar("to_business_type").notNull(), // "retailer" 
  category: varchar("category").notNull(), // "furniture"
  
  // Permissions
  canViewProducts: boolean("can_view_products").default(true),
  canViewPricing: boolean("can_view_pricing").default(true),
  canPlaceOrders: boolean("can_place_orders").default(true),
  canRequestQuotes: boolean("can_request_quotes").default(true),
  
  // Minimum Requirements
  minVerificationLevel: varchar("min_verification_level").default("basic"),
  minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===================== RELATIONS =====================

export const businessAccountsRelations = relations(businessAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [businessAccounts.userId],
    references: [users.id],
  }),
  suppliedProducts: many(wholesaleProducts),
  buyerOrders: many(wholesaleOrders, { relationName: "buyerOrders" }),
  supplierOrders: many(wholesaleOrders, { relationName: "supplierOrders" }),
  verifications: many(businessVerifications),
}));

export const wholesaleProductsRelations = relations(wholesaleProducts, ({ one }) => ({
  supplier: one(businessAccounts, {
    fields: [wholesaleProducts.supplierId],
    references: [businessAccounts.id],
  }),
}));

export const wholesaleOrdersRelations = relations(wholesaleOrders, ({ one }) => ({
  buyer: one(businessAccounts, {
    fields: [wholesaleOrders.buyerId],
    references: [businessAccounts.id],
  }),
  supplier: one(businessAccounts, {
    fields: [wholesaleOrders.supplierId],
    references: [businessAccounts.id],
  }),
}));

export const businessVerificationsRelations = relations(businessVerifications, ({ one }) => ({
  businessAccount: one(businessAccounts, {
    fields: [businessVerifications.businessAccountId],
    references: [businessAccounts.id],
  }),
}));

// ===================== INSERT SCHEMAS =====================

export const insertBusinessAccountSchema = createInsertSchema(businessAccounts);
export const insertWholesaleProductSchema = createInsertSchema(wholesaleProducts);
export const insertWholesaleOrderSchema = createInsertSchema(wholesaleOrders);
export const insertBusinessVerificationSchema = createInsertSchema(businessVerifications);
export const insertBusinessAccessControlSchema = createInsertSchema(businessAccessControls);

// ===================== TYPES =====================

export type BusinessAccount = typeof businessAccounts.$inferSelect;
export type InsertBusinessAccount = typeof businessAccounts.$inferInsert;
export type WholesaleProduct = typeof wholesaleProducts.$inferSelect;
export type InsertWholesaleProduct = typeof wholesaleProducts.$inferInsert;
export type WholesaleOrder = typeof wholesaleOrders.$inferSelect;
export type InsertWholesaleOrder = typeof wholesaleOrders.$inferInsert;
export type BusinessVerification = typeof businessVerifications.$inferSelect;
export type InsertBusinessVerification = typeof businessVerifications.$inferInsert;
export type BusinessAccessControl = typeof businessAccessControls.$inferSelect;
export type InsertBusinessAccessControl = typeof businessAccessControls.$inferInsert;

// ===================== SECURE BROWSER SYSTEM =====================

// Secure Browser Sessions - Track safe browsing within YardFlex
export const secureBrowserSessions = pgTable("secure_browser_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Session Details
  sessionToken: varchar("session_token").unique().notNull(),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  
  // Security Features
  vpnEnabled: boolean("vpn_enabled").default(true),
  adBlockEnabled: boolean("ad_block_enabled").default(true),
  trackingProtection: boolean("tracking_protection").default(true),
  httpsOnly: boolean("https_only").default(true),
  
  // Browsing History (for security monitoring)
  visitedSites: jsonb("visited_sites"), // Array of safe visited sites
  blockedSites: jsonb("blocked_sites"), // Array of blocked malicious sites
  securityWarnings: jsonb("security_warnings"), // Any security alerts
  
  // Session Management
  isActive: boolean("is_active").default(true),
  lastActivity: timestamp("last_activity").defaultNow(),
  sessionDuration: integer("session_duration").default(0), // Minutes
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trusted Website Whitelist - Pre-approved safe sites
export const trustedWebsites = pgTable("trusted_websites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Website Details
  domain: varchar("domain").unique().notNull(), // "banking.scotiabank.com"
  displayName: varchar("display_name").notNull(), // "Scotia Bank"
  category: varchar("category").notNull(), // "banking", "government", "business", "education"
  
  // Trust Metrics
  verificationLevel: varchar("verification_level").default("verified"), // "verified", "trusted", "premium"
  securityRating: varchar("security_rating").default("A+"), // "A+", "A", "B", "C"
  lastSecurityCheck: timestamp("last_security_check").defaultNow(),
  
  // Visual Indicators
  logoUrl: varchar("logo_url"), // Website logo for recognition
  primaryColor: varchar("primary_color"), // Brand color
  description: text("description"), // "Jamaica's trusted banking partner"
  
  // Usage Statistics
  totalVisits: integer("total_visits").default(0),
  uniqueUsers: integer("unique_users").default(0),
  averageSessionTime: integer("average_session_time").default(0),
  
  // Admin Controls
  isActive: boolean("is_active").default(true),
  addedBy: varchar("added_by"), // YardFlex admin who approved it
  approvalDate: timestamp("approval_date").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Browser Security Events - Log all security incidents
export const browserSecurityEvents = pgTable("browser_security_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => secureBrowserSessions.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Event Details
  eventType: varchar("event_type").notNull(), // "blocked_malware", "phishing_attempt", "unsafe_download", "ssl_warning"
  severity: varchar("severity").default("medium"), // "low", "medium", "high", "critical"
  
  // Threat Information
  threatUrl: text("threat_url"), // The dangerous URL that was blocked
  threatType: varchar("threat_type"), // "malware", "phishing", "scam", "adult", "gambling"
  threatDescription: text("threat_description"),
  
  // Protection Action
  actionTaken: varchar("action_taken").notNull(), // "blocked", "warned", "redirected", "quarantined"
  userResponse: varchar("user_response"), // "accepted_warning", "navigated_away", "force_proceeded"
  
  // Context
  referrerUrl: text("referrer_url"), // Where they came from
  browserData: jsonb("browser_data"), // Technical details
  
  // Resolution
  isResolved: boolean("is_resolved").default(false),
  resolutionNotes: text("resolution_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Browser Bookmarks - User's saved trusted sites
export const browserBookmarks = pgTable("browser_bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Bookmark Details
  title: varchar("title").notNull(),
  url: text("url").notNull(),
  faviconUrl: varchar("favicon_url"),
  
  // Organization
  category: varchar("category").default("general"), // "banking", "business", "personal", "work"
  tags: jsonb("tags"), // Array of tags for organization
  sortOrder: integer("sort_order").default(0),
  
  // Security
  isTrusted: boolean("is_trusted").default(false), // Verified safe site
  lastVerified: timestamp("last_verified"),
  securityNotes: text("security_notes"),
  
  // Usage
  visitCount: integer("visit_count").default(0),
  lastVisited: timestamp("last_visited"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===================== RELATIONS =====================

export const secureBrowserSessionsRelations = relations(secureBrowserSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [secureBrowserSessions.userId],
    references: [users.id],
  }),
  securityEvents: many(browserSecurityEvents),
}));

export const browserSecurityEventsRelations = relations(browserSecurityEvents, ({ one }) => ({
  session: one(secureBrowserSessions, {
    fields: [browserSecurityEvents.sessionId],
    references: [secureBrowserSessions.id],
  }),
  user: one(users, {
    fields: [browserSecurityEvents.userId],
    references: [users.id],
  }),
}));

export const browserBookmarksRelations = relations(browserBookmarks, ({ one }) => ({
  user: one(users, {
    fields: [browserBookmarks.userId],
    references: [users.id],
  }),
}));

// ===================== INSERT SCHEMAS =====================

export const insertSecureBrowserSessionSchema = createInsertSchema(secureBrowserSessions);
export const insertTrustedWebsiteSchema = createInsertSchema(trustedWebsites);
export const insertBrowserSecurityEventSchema = createInsertSchema(browserSecurityEvents);
export const insertBrowserBookmarkSchema = createInsertSchema(browserBookmarks);

// ===================== TYPES =====================

export type SecureBrowserSession = typeof secureBrowserSessions.$inferSelect;
export type InsertSecureBrowserSession = typeof secureBrowserSessions.$inferInsert;
export type TrustedWebsite = typeof trustedWebsites.$inferSelect;
export type InsertTrustedWebsite = typeof trustedWebsites.$inferInsert;
export type BrowserSecurityEvent = typeof browserSecurityEvents.$inferSelect;
export type InsertBrowserSecurityEvent = typeof browserSecurityEvents.$inferInsert;
export type BrowserBookmark = typeof browserBookmarks.$inferSelect;
export type InsertBrowserBookmark = typeof browserBookmarks.$inferInsert;

// ===================== SOCIAL COMMERCE & VIRAL MARKETING SYSTEM =====================

// Business Profile Pages - Everyone Gets Their Own Space  
export const businessProfiles = pgTable("business_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Profile Information
  businessName: varchar("business_name").notNull(),
  displayName: varchar("display_name").notNull(), // How they appear publicly
  slug: varchar("slug").unique().notNull(), // yardflex.com/@username
  tagline: text("tagline"), // Short business description
  description: text("description").notNull(), // Full business description
  
  // Business Category & Type
  category: varchar("category").notNull(), // "transport", "beauty", "food", "entertainment", "personal_services"
  subcategory: varchar("subcategory"), // "hair_salon", "massage", "DJ", "catering"
  businessType: varchar("business_type").default("individual"), // "individual", "team", "company"
  
  // Contact & Location
  phone: varchar("phone"),
  email: varchar("email"),
  whatsappNumber: varchar("whatsapp_number"),
  address: text("address"),
  parish: varchar("parish"), // Jamaica parishes
  servicesArea: jsonb("services_area"), // Areas they cover
  
  // Profile Media
  profileImageUrl: varchar("profile_image_url"),
  coverImageUrl: varchar("cover_image_url"),
  portfolioImages: jsonb("portfolio_images"), // Array of work samples
  videoIntroUrl: varchar("video_intro_url"), // 30-second intro video
  
  // Pricing & Services
  services: jsonb("services"), // Array of services offered
  startingPrice: decimal("starting_price", { precision: 10, scale: 2 }),
  currency: varchar("currency").default("JMD"),
  paymentMethods: jsonb("payment_methods"), // ["cash", "card", "mobile_money"]
  
  // Availability
  workingHours: jsonb("working_hours"), // Schedule by day
  availableDays: jsonb("available_days"), // Days of week
  isAvailable: boolean("is_available").default(true),
  responseTime: varchar("response_time").default("within_1_hour"), // How fast they respond
  
  // Age Verification & Compliance
  isAgeVerified: boolean("is_age_verified").default(false),
  ageVerificationDate: timestamp("age_verification_date"),
  requiresAgeVerification: boolean("requires_age_verification").default(false), // For adult services
  complianceLevel: varchar("compliance_level").default("standard"), // "standard", "verified", "premium"
  
  // Social Media Links
  instagramHandle: varchar("instagram_handle"),
  tiktokHandle: varchar("tiktok_handle"),
  facebookPage: varchar("facebook_page"),
  youtubeChannel: varchar("youtube_channel"),
  websiteUrl: varchar("website_url"),
  
  // Performance Metrics
  totalBookings: integer("total_bookings").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default("100.0"),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).default("100.0"),
  
  // Visibility & Status
  isPublished: boolean("is_published").default(true),
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  isPremium: boolean("is_premium").default(false),
  
  // SEO & Discovery
  keywords: jsonb("keywords"), // Search keywords
  seoTitle: varchar("seo_title"),
  seoDescription: text("seo_description"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social Media Auto-Posting System
export const socialMediaPosts = pgTable("social_media_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => businessProfiles.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Post Content
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  hashtags: jsonb("hashtags"), // Array of hashtags
  imageUrls: jsonb("image_urls"), // Multiple images
  videoUrl: varchar("video_url"),
  
  // Posting Schedule
  scheduledFor: timestamp("scheduled_for"),
  platforms: jsonb("platforms"), // ["facebook", "instagram", "tiktok", "telegram"]
  postType: varchar("post_type").default("promotional"), // "promotional", "educational", "showcase"
  
  // Platform-Specific Content
  facebookContent: text("facebook_content"),
  instagramContent: text("instagram_content"),
  tiktokContent: text("tiktok_content"),
  telegramContent: text("telegram_content"),
  
  // Auto-Generation Settings
  isAutoGenerated: boolean("is_auto_generated").default(false),
  templateUsed: varchar("template_used"), // Which template was used
  aiGenerated: boolean("ai_generated").default(false),
  
  // Performance Tracking
  totalReach: integer("total_reach").default(0),
  totalEngagement: integer("total_engagement").default(0),
  clickThroughs: integer("click_throughs").default(0),
  bookingsGenerated: integer("bookings_generated").default(0),
  
  // Status
  status: varchar("status").default("draft"), // "draft", "scheduled", "published", "failed"
  publishedAt: timestamp("published_at"),
  errorMessage: text("error_message"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Viral Marketing Templates
export const marketingTemplates = pgTable("marketing_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Template Info
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // Business category this template is for
  platform: varchar("platform").notNull(), // "facebook", "instagram", "tiktok", etc
  
  // Template Content
  titleTemplate: text("title_template"), // "🔥 {business_name} - {service} in {location}!"
  contentTemplate: text("content_template").notNull(), // Full post template with placeholders
  hashtagTemplate: text("hashtag_template"), // "#{category} #{location} #YardFlex"
  
  // Design Elements
  backgroundColor: varchar("background_color").default("#000000"),
  textColor: varchar("text_color").default("#FFFFFF"),
  accentColor: varchar("accent_color").default("#FFD700"),
  fontStyle: varchar("font_style").default("bold"),
  
  // Template Variables
  variables: jsonb("variables"), // Available placeholders like {business_name}
  examples: jsonb("examples"), // Example posts using this template
  
  // Performance
  usageCount: integer("usage_count").default(0),
  avgEngagementRate: decimal("avg_engagement_rate", { precision: 5, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer Reviews & Testimonials
export const customerReviews = pgTable("customer_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => businessProfiles.id),
  customerId: varchar("customer_id").references(() => users.id),
  
  // Review Content
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title"),
  content: text("content").notNull(),
  images: jsonb("images"), // Photos of work/service
  
  // Customer Info (if not registered user)
  customerName: varchar("customer_name"),
  customerPhone: varchar("customer_phone"),
  
  // Review Details
  serviceType: varchar("service_type"), // What service was reviewed
  serviceCost: decimal("service_cost", { precision: 10, scale: 2 }),
  serviceDate: timestamp("service_date"),
  
  // Verification
  isVerified: boolean("is_verified").default(false),
  verificationMethod: varchar("verification_method"), // "phone", "receipt", "photo"
  
  // Moderation
  isApproved: boolean("is_approved").default(true),
  moderationNotes: text("moderation_notes"),
  
  // Usage in Marketing
  canUseInMarketing: boolean("can_use_in_marketing").default(true),
  featuredInPosts: integer("featured_in_posts").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Age Verification System
export const ageVerifications = pgTable("age_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Verification Method
  verificationType: varchar("verification_type").notNull(), // "drivers_license", "passport", "national_id"
  documentNumber: varchar("document_number").notNull(),
  documentImageUrl: varchar("document_image_url"),
  
  // Verification Details
  birthDate: timestamp("birth_date").notNull(),
  age: integer("age").notNull(),
  isOver18: boolean("is_over18").notNull(),
  isOver21: boolean("is_over21").notNull(),
  
  // Verification Status
  status: varchar("status").default("pending"), // "pending", "approved", "rejected", "expired"
  verifiedBy: varchar("verified_by"), // Staff member who verified
  verificationDate: timestamp("verification_date"),
  expiryDate: timestamp("expiry_date"),
  
  // Rejection Details
  rejectionReason: text("rejection_reason"),
  resubmissionAllowed: boolean("resubmission_allowed").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Professional Guidelines & Compliance
export const complianceGuidelines = pgTable("compliance_guidelines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Guideline Info
  category: varchar("category").notNull(), // Business category
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  
  // Requirements
  requirements: jsonb("requirements"), // List of requirements
  prohibitedContent: jsonb("prohibited_content"), // What's not allowed
  recommendedPractices: jsonb("recommended_practices"), // Best practices
  
  // Compliance Level
  complianceLevel: varchar("compliance_level").default("standard"),
  isRequired: boolean("is_required").default(true),
  
  // Content
  fullGuidelines: text("full_guidelines").notNull(),
  examples: jsonb("examples"), // Good and bad examples
  resources: jsonb("resources"), // Helpful resources
  
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===================== RELATIONS =====================

export const businessProfilesRelations = relations(businessProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [businessProfiles.userId],
    references: [users.id],
  }),
  posts: many(socialMediaPosts),
  reviews: many(customerReviews),
}));

export const socialMediaPostsRelations = relations(socialMediaPosts, ({ one }) => ({
  profile: one(businessProfiles, {
    fields: [socialMediaPosts.profileId],
    references: [businessProfiles.id],
  }),
  user: one(users, {
    fields: [socialMediaPosts.userId],
    references: [users.id],
  }),
}));

export const customerReviewsRelations = relations(customerReviews, ({ one }) => ({
  profile: one(businessProfiles, {
    fields: [customerReviews.profileId],
    references: [businessProfiles.id],
  }),
  customer: one(users, {
    fields: [customerReviews.customerId],
    references: [users.id],
  }),
}));

export const ageVerificationsRelations = relations(ageVerifications, ({ one }) => ({
  user: one(users, {
    fields: [ageVerifications.userId],
    references: [users.id],
  }),
}));

// ===================== INSERT SCHEMAS =====================

export const insertBusinessProfileSchema = createInsertSchema(businessProfiles);
export const insertSocialMediaPostSchema = createInsertSchema(socialMediaPosts);
export const insertMarketingTemplateSchema = createInsertSchema(marketingTemplates);
export const insertCustomerReviewSchema = createInsertSchema(customerReviews);
export const insertAgeVerificationSchema = createInsertSchema(ageVerifications);
export const insertComplianceGuidelineSchema = createInsertSchema(complianceGuidelines);

// ===================== TYPES =====================

export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type InsertBusinessProfile = typeof businessProfiles.$inferInsert;
export type SocialMediaPost = typeof socialMediaPosts.$inferSelect;
export type InsertSocialMediaPost = typeof socialMediaPosts.$inferInsert;
export type MarketingTemplate = typeof marketingTemplates.$inferSelect;
export type InsertMarketingTemplate = typeof marketingTemplates.$inferInsert;
export type CustomerReview = typeof customerReviews.$inferSelect;
export type InsertCustomerReview = typeof customerReviews.$inferInsert;
export type AgeVerification = typeof ageVerifications.$inferSelect;
export type InsertAgeVerification = typeof ageVerifications.$inferInsert;
export type ComplianceGuideline = typeof complianceGuidelines.$inferSelect;
export type InsertComplianceGuideline = typeof complianceGuidelines.$inferInsert;

// ===================== COMPLETE RENTAL EMPIRE SYSTEM =====================

// Rental Properties - EVERYTHING Can Be Rented
export const rentalProperties = pgTable("rental_properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  
  // Property Basic Info
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  slug: varchar("slug").unique().notNull(), // yardflex.com/rent/property-name
  
  // Property Type & Category
  propertyType: varchar("property_type").notNull(), // "residential", "commercial", "vehicle", "equipment", "recreational"
  category: varchar("category").notNull(), // "house", "apartment", "store", "car", "pool", "office", "warehouse"
  subcategory: varchar("subcategory"), // "studio", "1bedroom", "sedan", "SUV", "retail_shop", "restaurant_space"
  
  // Location Details
  address: text("address").notNull(),
  parish: varchar("parish").notNull(), // Jamaica parishes
  coordinates: jsonb("coordinates"), // GPS coordinates
  landmark: varchar("landmark"), // Near KFC, beside gas station
  gpsLocation: varchar("gps_location"), // What3words or GPS
  
  // Property Specifications
  specifications: jsonb("specifications"), // Bedrooms, bathrooms, size, features
  amenities: jsonb("amenities"), // Pool, parking, AC, WiFi, etc
  condition: varchar("condition").default("excellent"), // "excellent", "good", "fair", "needs_work"
  furnishingStatus: varchar("furnishing_status"), // "furnished", "unfurnished", "semi_furnished"
  
  // Visual Media
  primaryImageUrl: varchar("primary_image_url"),
  imageUrls: jsonb("image_urls"), // Multiple photos
  videoTourUrl: varchar("video_tour_url"), // Virtual tour video
  floorPlanUrl: varchar("floor_plan_url"), // For properties
  
  // Rental Details
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }),
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }),
  yearlyRate: decimal("yearly_rate", { precision: 10, scale: 2 }),
  currency: varchar("currency").default("JMD"),
  
  // Rental Terms
  minimumRentalPeriod: varchar("minimum_rental_period").default("1_day"), // "1_hour", "1_day", "1_week", "1_month"
  maximumRentalPeriod: varchar("maximum_rental_period"), // Optional max limit
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  cleaningFee: decimal("cleaning_fee", { precision: 8, scale: 2 }),
  
  // Availability
  isAvailable: boolean("is_available").default(true),
  availableFrom: timestamp("available_from").defaultNow(),
  availableUntil: timestamp("available_until"), // Optional end date
  instantBooking: boolean("instant_booking").default(true), // Can book immediately
  
  // Requirements & Rules  
  minimumAge: integer("minimum_age").default(18),
  requiresDeposit: boolean("requires_deposit").default(true),
  requiresLicense: boolean("requires_license").default(false), // For vehicles
  allowsPets: boolean("allows_pets").default(true),
  allowsSmoking: boolean("allows_smoking").default(false),
  maxOccupancy: integer("max_occupancy"), // Max people allowed
  
  // Owner Contact
  contactPhone: varchar("contact_phone"),
  contactWhatsapp: varchar("contact_whatsapp"),
  contactEmail: varchar("contact_email"),
  preferredContactMethod: varchar("preferred_contact_method").default("whatsapp"),
  
  // Performance Metrics
  totalBookings: integer("total_bookings").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0"),
  occupancyRate: decimal("occupancy_rate", { precision: 5, scale: 2 }).default("0"), // % of time booked
  
  // SEO & Discovery
  keywords: jsonb("keywords"), // Search keywords
  tags: jsonb("tags"), // Property tags for filtering
  
  // Status & Verification
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  isPremium: boolean("is_premium").default(false),
  verificationDate: timestamp("verification_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Rental Bookings & Reservations
export const rentalBookings = pgTable("rental_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingNumber: varchar("booking_number").unique().notNull(),
  
  // Parties Involved
  propertyId: varchar("property_id").notNull().references(() => rentalProperties.id),
  renterId: varchar("renter_id").notNull().references(() => users.id), // Person renting
  ownerId: varchar("owner_id").notNull().references(() => users.id), // Property owner
  
  // Booking Dates
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  totalDays: integer("total_days").notNull(),
  
  // Pricing Breakdown
  baseRate: decimal("base_rate", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }).default("0"),
  cleaningFee: decimal("cleaning_fee", { precision: 8, scale: 2 }).default("0"),
  serviceFee: decimal("service_fee", { precision: 8, scale: 2 }).default("0"), // YardFlex fee
  taxes: decimal("taxes", { precision: 8, scale: 2 }).default("0"),
  
  // Booking Details
  guestCount: integer("guest_count").default(1),
  purpose: varchar("purpose"), // "vacation", "business", "event", "storage"
  specialRequests: text("special_requests"),
  
  // Status & Timeline
  status: varchar("status").default("pending"), // "pending", "confirmed", "checked_in", "checked_out", "cancelled", "completed"
  confirmationDate: timestamp("confirmation_date"),
  paymentStatus: varchar("payment_status").default("pending"), // "pending", "partial", "paid", "refunded"
  
  // Communication
  renterNotes: text("renter_notes"),
  ownerNotes: text("owner_notes"),
  checkInInstructions: text("check_in_instructions"),
  
  // YardFlex Commission
  platformFeeAmount: decimal("platform_fee_amount", { precision: 8, scale: 2 }),
  platformFeeRate: decimal("platform_fee_rate", { precision: 5, scale: 2 }).default("15.0"), // 15%
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Rental Reviews & Ratings
export const rentalReviews = pgTable("rental_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => rentalBookings.id),
  propertyId: varchar("property_id").notNull().references(() => rentalProperties.id),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
  
  // Review Content
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title"),
  content: text("content").notNull(),
  photos: jsonb("photos"), // Review photos
  
  // Review Categories
  cleanlinessRating: integer("cleanliness_rating"), // 1-5
  accuracyRating: integer("accuracy_rating"), // How accurate was listing
  communicationRating: integer("communication_rating"), // Owner responsiveness
  locationRating: integer("location_rating"), // Location convenience
  valueRating: integer("value_rating"), // Value for money
  
  // Review Type
  reviewType: varchar("review_type").default("renter"), // "renter", "owner" (owner can review renter too)
  
  // Verification
  isVerified: boolean("is_verified").default(true), // Must have stayed to review
  isPublic: boolean("is_public").default(true),
  
  // Response
  ownerResponse: text("owner_response"), // Owner can respond to reviews
  ownerResponseDate: timestamp("owner_response_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Property Availability Calendar
export const propertyAvailability = pgTable("property_availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => rentalProperties.id),
  
  // Date Range
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  // Availability Status
  status: varchar("status").notNull(), // "available", "booked", "blocked", "maintenance"
  blockReason: varchar("block_reason"), // "maintenance", "owner_use", "renovation"
  
  // Pricing Overrides (for special dates)
  specialRate: decimal("special_rate", { precision: 10, scale: 2 }), // Holiday pricing
  minimumStay: integer("minimum_stay"), // Minimum nights for this period
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Instant Notifications - When Properties Become Available
export const availabilityAlerts = pgTable("availability_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Search Criteria
  propertyType: varchar("property_type"), // What they're looking for
  category: varchar("category"),
  parish: varchar("parish"), // Preferred location
  maxBudget: decimal("max_budget", { precision: 10, scale: 2 }),
  minBedrooms: integer("min_bedrooms"),
  requiredAmenities: jsonb("required_amenities"),
  
  // Alert Preferences
  alertFrequency: varchar("alert_frequency").default("instant"), // "instant", "daily", "weekly"
  isActive: boolean("is_active").default(true),
  
  // Notification Methods
  notifyEmail: boolean("notify_email").default(true),
  notifySMS: boolean("notify_sms").default(true),
  notifyWhatsapp: boolean("notify_whatsapp").default(true),
  notifyPush: boolean("notify_push").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Property Management Tools
export const propertyMaintenance = pgTable("property_maintenance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => rentalProperties.id),
  
  // Maintenance Details
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // "cleaning", "repair", "inspection", "upgrade"
  priority: varchar("priority").default("medium"), // "low", "medium", "high", "urgent"
  
  // Scheduling
  scheduledDate: timestamp("scheduled_date"),
  estimatedDuration: integer("estimated_duration"), // Hours
  
  // Cost
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  
  // Status
  status: varchar("status").default("pending"), // "pending", "scheduled", "in_progress", "completed", "cancelled"
  completionDate: timestamp("completion_date"),
  
  // Provider
  serviceProvider: varchar("service_provider"), // Company/person doing the work
  serviceProviderContact: varchar("service_provider_contact"),
  
  // Documentation
  beforePhotos: jsonb("before_photos"),
  afterPhotos: jsonb("after_photos"),
  receipts: jsonb("receipts"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===================== RELATIONS =====================

export const rentalPropertiesRelations = relations(rentalProperties, ({ one, many }) => ({
  owner: one(users, {
    fields: [rentalProperties.ownerId],
    references: [users.id],
  }),
  bookings: many(rentalBookings, { relationName: "propertyBookings" }),
  reviews: many(rentalReviews),
  availability: many(propertyAvailability),
  maintenance: many(propertyMaintenance),
}));

export const rentalBookingsRelations = relations(rentalBookings, ({ one }) => ({
  property: one(rentalProperties, {
    fields: [rentalBookings.propertyId],
    references: [rentalProperties.id],
  }),
  renter: one(users, {
    fields: [rentalBookings.renterId],
    references: [users.id],
  }),
  owner: one(users, {
    fields: [rentalBookings.ownerId],
    references: [users.id],
  }),
}));

export const rentalReviewsRelations = relations(rentalReviews, ({ one }) => ({
  booking: one(rentalBookings, {
    fields: [rentalReviews.bookingId],
    references: [rentalBookings.id],
  }),
  property: one(rentalProperties, {
    fields: [rentalReviews.propertyId],
    references: [rentalProperties.id],
  }),
  reviewer: one(users, {
    fields: [rentalReviews.reviewerId],
    references: [users.id],
  }),
}));

export const propertyAvailabilityRelations = relations(propertyAvailability, ({ one }) => ({
  property: one(rentalProperties, {
    fields: [propertyAvailability.propertyId],
    references: [rentalProperties.id],
  }),
}));

export const availabilityAlertsRelations = relations(availabilityAlerts, ({ one }) => ({
  user: one(users, {
    fields: [availabilityAlerts.userId],
    references: [users.id],
  }),
}));

export const propertyMaintenanceRelations = relations(propertyMaintenance, ({ one }) => ({
  property: one(rentalProperties, {
    fields: [propertyMaintenance.propertyId],
    references: [rentalProperties.id],
  }),
}));

// ===================== INSERT SCHEMAS =====================

export const insertRentalPropertySchema = createInsertSchema(rentalProperties);
export const insertRentalBookingSchema = createInsertSchema(rentalBookings);
export const insertRentalReviewSchema = createInsertSchema(rentalReviews);
export const insertPropertyAvailabilitySchema = createInsertSchema(propertyAvailability);
export const insertAvailabilityAlertSchema = createInsertSchema(availabilityAlerts);
export const insertPropertyMaintenanceSchema = createInsertSchema(propertyMaintenance);

// ===================== TYPES =====================

export type RentalProperty = typeof rentalProperties.$inferSelect;
export type InsertRentalProperty = typeof rentalProperties.$inferInsert;
export type RentalBooking = typeof rentalBookings.$inferSelect;
export type InsertRentalBooking = typeof rentalBookings.$inferInsert;
export type RentalReview = typeof rentalReviews.$inferSelect;
export type InsertRentalReview = typeof rentalReviews.$inferInsert;
export type PropertyAvailability = typeof propertyAvailability.$inferSelect;
export type InsertPropertyAvailability = typeof propertyAvailability.$inferInsert;
export type AvailabilityAlert = typeof availabilityAlerts.$inferSelect;
export type InsertAvailabilityAlert = typeof availabilityAlerts.$inferInsert;
export type PropertyMaintenance = typeof propertyMaintenance.$inferSelect;
export type InsertPropertyMaintenance = typeof propertyMaintenance.$inferInsert;

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
