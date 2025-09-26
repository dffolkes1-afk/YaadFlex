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
  uuid,
  numeric,
  time,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { LEGAL_VERSIONS, LEGAL_VALIDATION_MESSAGES } from "./legal-versions";

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
  
  // Legal Acceptance Fields - CRITICAL for legal compliance
  termsAccepted: boolean("terms_accepted").default(false).notNull(),
  privacyAccepted: boolean("privacy_accepted").default(false).notNull(),
  userAgreementAccepted: boolean("user_agreement_accepted").default(false).notNull(),
  driverAgreementAccepted: boolean("driver_agreement_accepted").default(false), // Only for drivers
  businessAgreementAccepted: boolean("business_agreement_accepted").default(false), // Only for businesses
  legalAcceptedAt: timestamp("legal_accepted_at"), // When legal agreements were accepted
  termsVersion: varchar("terms_version").default('1.0'), // Policy version tracking
  privacyVersion: varchar("privacy_version").default('1.0'),
  agreementVersion: varchar("agreement_version").default('1.0'),
  ipAddressAtAcceptance: varchar("ip_address_at_acceptance"), // Legal audit trail
  userAgentAtAcceptance: text("user_agent_at_acceptance"), // Browser/device info
  
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

// YaadFlex Driver Fleet Management - Lipstick vs Shadow Fleet
export const driverFleets = pgTable("driver_fleets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id).notNull(),
  fleetType: varchar("fleet_type").notNull(), // 'lipstick', 'shadow'
  plateType: varchar("plate_type").notNull(), // 'red', 'white'
  operatingZones: jsonb("operating_zones"), // Array of allowed zones ['downtown', 'uptown', 'rural']
  isActive: boolean("is_active").default(true),
  exclusiveAccess: boolean("exclusive_access").default(false), // White plate exclusive status
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// YaadFlex Pricing Zones and Area Configuration
export const pricingZones = pgTable("pricing_zones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  zoneName: varchar("zone_name").notNull(), // 'downtown', 'uptown', 'rural', 'airport'
  zoneType: varchar("zone_type").notNull(), // 'municipal', 'upscale', 'rural', 'special'
  baseFareMultiplier: decimal("base_fare_multiplier", { precision: 5, scale: 2 }).default('1.0'),
  allowedPlateTypes: jsonb("allowed_plate_types"), // ['red', 'white']
  maxWhitePlateDrivers: integer("max_white_plate_drivers").default(2),
  currentWhitePlateCount: integer("current_white_plate_count").default(0),
  coordinates: jsonb("coordinates"), // Geographic boundaries
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// YaadFlex Trip Assignment Queue - No Cherry Picking
export const tripAssignments = pgTable("trip_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").references(() => trips.id).notNull(),
  assignedDriverId: varchar("assigned_driver_id").references(() => users.id),
  zoneId: varchar("zone_id").references(() => pricingZones.id),
  assignmentMethod: varchar("assignment_method").default('automatic'), // 'automatic', 'manual_override'
  algorithmScore: decimal("algorithm_score", { precision: 8, scale: 4 }), // Assignment algorithm score
  distanceToPickup: decimal("distance_to_pickup", { precision: 8, scale: 2 }),
  driverWorkloadScore: decimal("driver_workload_score", { precision: 5, scale: 2 }),
  priorityLevel: integer("priority_level").default(1), // 1-5 priority
  status: varchar("status").default('pending'), // 'pending', 'accepted', 'rejected', 'completed'
  assignedAt: timestamp("assigned_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

// YaadFlex Lifestyle Add-ons and Extra Charges
export const lifestyleAddons = pgTable("lifestyle_addons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").references(() => trips.id).notNull(),
  addonType: varchar("addon_type").notNull(), // 'waiting_time', 'extra_stop', 'party_run', 'airport', 'uphill'
  quantity: integer("quantity").default(1), // e.g., number of extra stops, waiting minutes
  unitPrice: decimal("unit_price", { precision: 8, scale: 2 }),
  totalCharge: decimal("total_charge", { precision: 8, scale: 2 }),
  isApproved: boolean("is_approved").default(true),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// YaadFlex Errand Grouping for Efficiency
export const errandGroups = pgTable("errand_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupName: varchar("group_name"),
  assignedDriverId: varchar("assigned_driver_id").references(() => users.id),
  zoneId: varchar("zone_id").references(() => pricingZones.id),
  totalTripIds: jsonb("total_trip_ids"), // Array of trip IDs in this group
  estimatedDuration: integer("estimated_duration"), // Total estimated minutes
  estimatedDistance: decimal("estimated_distance", { precision: 8, scale: 2 }),
  totalFare: decimal("total_fare", { precision: 10, scale: 2 }),
  status: varchar("status").default('pending'), // 'pending', 'in_progress', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
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

// YaadFlex Fare Rules System - Dynamic pricing toggles
export const fareRules = pgTable("fare_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ruleName: varchar("rule_name").notNull().unique(), // 'airport_extra', 'tour_excursion_fee', 'hilly_area', etc.
  displayName: varchar("display_name").notNull(), // 'Airport Extra', 'Tour/Excursion Fee', 'Hilly Area'
  description: text("description"),
  ruleType: varchar("rule_type").notNull(), // 'multiplier', 'fixed_amount', 'percentage', 'mode'
  value: decimal("value", { precision: 8, scale: 2 }), // Multiplier (1.5), fixed amount (50.00), percentage (15.00)
  currency: varchar("currency", { length: 3 }).default('JMD'),
  isEnabled: boolean("is_enabled").default(false), // Toggle state
  minApplicableAmount: decimal("min_applicable_amount", { precision: 8, scale: 2 }).default('0.00'),
  maxApplicableAmount: decimal("max_applicable_amount", { precision: 8, scale: 2 }),
  applicableVehicleTypes: jsonb("applicable_vehicle_types"), // ['bike', 'car', 'van', 'truck']
  applicableZones: jsonb("applicable_zones"), // Zone restrictions
  timeRestrictions: jsonb("time_restrictions"), // Peak hour restrictions
  priority: integer("priority").default(1), // Rule application order
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fare calculation breakdown for transparency
export const fareCalculations = pgTable("fare_calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").references(() => trips.id).notNull(),
  baseFare: decimal("base_fare", { precision: 10, scale: 2 }).notNull(),
  distanceCost: decimal("distance_cost", { precision: 8, scale: 2 }).default('0.00'),
  timeCost: decimal("time_cost", { precision: 8, scale: 2 }).default('0.00'),
  appliedRules: jsonb("applied_rules"), // Array of applied rule details
  ruleAdjustments: decimal("rule_adjustments", { precision: 8, scale: 2 }).default('0.00'),
  totalBeforeAddons: decimal("total_before_addons", { precision: 10, scale: 2 }).notNull(),
  addonsCost: decimal("addons_cost", { precision: 8, scale: 2 }).default('0.00'),
  finalFare: decimal("final_fare", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('JMD'),
  calculationBreakdown: jsonb("calculation_breakdown"), // Detailed breakdown for audit
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Fare rules types
export type FareRule = typeof fareRules.$inferSelect;
export type InsertFareRule = typeof fareRules.$inferInsert;
export type FareCalculation = typeof fareCalculations.$inferSelect;
export type InsertFareCalculation = typeof fareCalculations.$inferInsert;

// Fare rules Zod schemas
export const insertFareRuleSchema = createInsertSchema(fareRules);
export const insertFareCalculationSchema = createInsertSchema(fareCalculations);

// Observability and Error Monitoring Schema
export const subsystems = pgTable("subsystems", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 64 }).notNull(), // e.g. "payments", "wallet", "rides", "voice", "auth"
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const systemErrors = pgTable("system_errors", {
  id: varchar("id", { length: 36 }).primaryKey(),
  subsystemId: varchar("subsystem_id", { length: 36 }).references(() => subsystems.id),
  errorType: varchar("error_type", { length: 32 }).notNull(), // 'critical', 'error', 'warning', 'info'
  component: varchar("component", { length: 128 }).notNull(),
  message: text("message").notNull(),
  location: text("location"), // File path and line number
  stackTrace: text("stack_trace"),
  metadata: jsonb("metadata"), // Additional error context
  count: integer("count").default(1),
  isResolved: boolean("is_resolved").default(false),
  firstOccurred: timestamp("first_occurred").defaultNow(),
  lastOccurred: timestamp("last_occurred").defaultNow(),
  resolvedAt: timestamp("resolved_at")
});

export const systemHealthChecks = pgTable("system_health_checks", {
  id: varchar("id", { length: 36 }).primaryKey(),
  subsystemId: varchar("subsystem_id", { length: 36 }).references(() => subsystems.id),
  status: varchar("status", { length: 16 }).notNull(), // 'healthy', 'warning', 'error', 'offline'
  responseTime: integer("response_time"), // in milliseconds
  uptime: varchar("uptime", { length: 16 }),
  details: text("details"),
  checkedAt: timestamp("checked_at").defaultNow()
});

export type Subsystem = typeof subsystems.$inferSelect;
export type InsertSubsystem = typeof subsystems.$inferInsert;
export type SystemError = typeof systemErrors.$inferSelect;
export type InsertSystemError = typeof systemErrors.$inferInsert;
export type SystemHealthCheck = typeof systemHealthChecks.$inferSelect;
export type InsertSystemHealthCheck = typeof systemHealthChecks.$inferInsert;

// =============================================================
// YAADFLEX PROMOTIONAL CREDITS SYSTEM - Pre-Launch Value
// Compliant loyalty system that converts to real money later
// =============================================================

// Promotional campaigns
export const promoCampaigns = pgTable("promo_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // 'launch_bonus', 'referral_program', 'task_rewards'
  description: text("description"),
  type: varchar("type").notNull(), // 'welcome', 'referral', 'task_completion', 'admin_grant'
  maxCreditsPerUser: decimal("max_credits_per_user", { precision: 10, scale: 2 }).default('50.00'),
  totalBudget: decimal("total_budget", { precision: 12, scale: 2 }),
  creditsGranted: decimal("credits_granted", { precision: 12, scale: 2 }).default('0.00'),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 4 }).default('1.0000'), // 1 promo credit = 1 YFD
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User promotional credit wallets
export const promoWallets = pgTable("promo_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  campaignId: varchar("campaign_id").references(() => promoCampaigns.id).notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default('0.00'),
  totalEarned: decimal("total_earned", { precision: 10, scale: 2 }).default('0.00'),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default('0.00'),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_campaign").on(table.userId, table.campaignId),
]);

// Promotional credits transaction ledger
export const promoLedger = pgTable("promo_ledger", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  campaignId: varchar("campaign_id").references(() => promoCampaigns.id).notNull(),
  walletId: varchar("wallet_id").references(() => promoWallets.id).notNull(),
  transactionType: varchar("transaction_type").notNull(), // 'earn', 'spend', 'expire', 'convert', 'admin_adjust'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reason: varchar("reason").notNull(), // 'signup_bonus', 'profile_complete', 'referral_reward', 'task_reward', 'fee_waiver'
  description: text("description"),
  referenceId: varchar("reference_id"), // Task ID, referral ID, etc.
  balanceBefore: decimal("balance_before", { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
  isReversible: boolean("is_reversible").default(false),
  reversedAt: timestamp("reversed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_user_ledger").on(table.userId, table.createdAt),
]);

// Task definitions for earning credits
export const promoTasks = pgTable("promo_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").references(() => promoCampaigns.id).notNull(),
  taskKey: varchar("task_key").notNull().unique(), // 'signup_bonus', 'profile_complete', 'first_login_streak'
  name: varchar("name").notNull(), // 'Complete Profile Setup'
  description: text("description"), // 'Add your name, phone, and photo to unlock $10 credits'
  rewardAmount: decimal("reward_amount", { precision: 8, scale: 2 }).notNull(),
  maxCompletions: integer("max_completions").default(1), // How many times user can complete this task
  requiresVerification: boolean("requires_verification").default(false),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1), // Display order
  unlockConditions: jsonb("unlock_conditions"), // Prerequisites for this task
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User task completion tracking
export const userPromoTasks = pgTable("user_promo_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  taskId: varchar("task_id").references(() => promoTasks.id).notNull(),
  campaignId: varchar("campaign_id").references(() => promoCampaigns.id).notNull(),
  status: varchar("status").notNull().default('pending'), // 'pending', 'completed', 'verified', 'rewarded'
  completedAt: timestamp("completed_at"),
  rewardedAt: timestamp("rewarded_at"),
  verificationData: jsonb("verification_data"), // Any data needed to verify task completion
  rewardAmount: decimal("reward_amount", { precision: 8, scale: 2 }),
  ledgerEntryId: varchar("ledger_entry_id").references(() => promoLedger.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_user_task").on(table.userId, table.taskId),
]);

// Referral tracking for promotional system
export const promoReferrals = pgTable("promo_referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").references(() => promoCampaigns.id).notNull(),
  referrerId: varchar("referrer_id").references(() => users.id).notNull(),
  refereeId: varchar("referee_id").references(() => users.id),
  referralCode: varchar("referral_code").notNull().unique(),
  refereeEmail: varchar("referee_email"),
  refereePhone: varchar("referee_phone"),
  status: varchar("status").notNull().default('pending'), // 'pending', 'signed_up', 'activated', 'rewarded'
  referrerReward: decimal("referrer_reward", { precision: 8, scale: 2 }).default('5.00'),
  refereeReward: decimal("referee_reward", { precision: 8, scale: 2 }).default('5.00'),
  signedUpAt: timestamp("signed_up_at"),
  activatedAt: timestamp("activated_at"), // When referee completed activation requirements
  rewardedAt: timestamp("rewarded_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_referrer").on(table.referrerId),
  index("idx_referral_code").on(table.referralCode),
]);

// Types for promotional system
export type PromoCampaign = typeof promoCampaigns.$inferSelect;
export type InsertPromoCampaign = typeof promoCampaigns.$inferInsert;
export type PromoWallet = typeof promoWallets.$inferSelect;
export type InsertPromoWallet = typeof promoWallets.$inferInsert;
export type PromoLedgerEntry = typeof promoLedger.$inferSelect;
export type InsertPromoLedgerEntry = typeof promoLedger.$inferInsert;
export type PromoTask = typeof promoTasks.$inferSelect;
export type InsertPromoTask = typeof promoTasks.$inferInsert;
export type UserPromoTask = typeof userPromoTasks.$inferSelect;
export type InsertUserPromoTask = typeof userPromoTasks.$inferInsert;
export type PromoReferral = typeof promoReferrals.$inferSelect;
export type InsertPromoReferral = typeof promoReferrals.$inferInsert;

// Zod schemas for promotional system
export const insertPromoCampaignSchema = createInsertSchema(promoCampaigns);
export const insertPromoWalletSchema = createInsertSchema(promoWallets);
export const insertPromoLedgerSchema = createInsertSchema(promoLedger);
export const insertPromoTaskSchema = createInsertSchema(promoTasks);
export const insertUserPromoTaskSchema = createInsertSchema(userPromoTasks);
export const insertPromoReferralSchema = createInsertSchema(promoReferrals);

// =============================================================
// YAADFLEX LUXURY CLOTHING LINE & DROP SHIPPING SYSTEM
// Premium branded merchandise with Gucci-style luxury aesthetic
// =============================================================

// YaadFlex Product Categories (Clothing, Accessories, Coffee, etc.)
export const yaadflexCategories = pgTable("yaadflex_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // 'YF Shirts', 'YF Shoes', 'YF Coffee', 'YF Accessories'
  displayName: varchar("display_name").notNull(), // 'YaadFlex Premium Shirts'
  description: text("description"),
  categoryType: varchar("category_type").notNull(), // 'clothing', 'accessories', 'lifestyle', 'beverages'
  iconUrl: varchar("icon_url"), // Category icon for display
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// YaadFlex Luxury Products
export const yaadflexProducts = pgTable("yaadflex_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => yaadflexCategories.id).notNull(),
  name: varchar("name").notNull(), // 'YF Gold Luxury Tee', 'YF Premium Coffee Blend'
  description: text("description").notNull(),
  shortDescription: varchar("short_description"), // For quick displays
  
  // Pricing & Inventory
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }), // Optional sale price
  currency: varchar("currency", { length: 3 }).default('USD'),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }), // For profit calculations
  
  // Product Details
  sku: varchar("sku").unique().notNull(), // 'YF-SHIRT-001', 'YF-COFFEE-PREMIUM'
  brand: varchar("brand").default('YaadFlex'),
  sizes: jsonb("sizes"), // ['XS', 'S', 'M', 'L', 'XL', 'XXL'] for clothing
  colors: jsonb("colors"), // ['Emerald', 'Gold', 'Rose', 'Black', 'White']
  materials: jsonb("materials"), // ['100% Cotton', 'Premium Leather', 'Organic Beans']
  
  // Images & Media
  images: jsonb("images"), // Array of image URLs
  primaryImageUrl: varchar("primary_image_url"),
  videoUrl: varchar("video_url"), // Product showcase video
  
  // Drop Shipping Info
  supplierId: varchar("supplier_id").references(() => yaadflexSuppliers.id),
  supplierProductId: varchar("supplier_product_id"), // Supplier's internal product ID
  shippingWeight: decimal("shipping_weight", { precision: 6, scale: 2 }), // in kg
  shippingDimensions: jsonb("shipping_dimensions"), // {length, width, height} in cm
  processingDays: integer("processing_days").default(3), // Days to process order
  estimatedShippingDays: integer("estimated_shipping_days").default(7),
  
  // Status & Inventory
  status: varchar("status").default('active'), // 'active', 'inactive', 'discontinued', 'out_of_stock'
  stockQuantity: integer("stock_quantity").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(10),
  isDropShipped: boolean("is_drop_shipped").default(true),
  isFeatured: boolean("is_featured").default(false),
  isLuxury: boolean("is_luxury").default(true), // All YF products are luxury
  
  // SEO & Marketing
  seoTitle: varchar("seo_title"),
  seoDescription: text("seo_description"),
  tags: jsonb("tags"), // ['luxury', 'premium', 'gucci-style', 'caribbean']
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Drop Shipping Suppliers
export const yaadflexSuppliers = pgTable("yaadflex_suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // 'Premium Apparel Co', 'Luxury Coffee Roasters'
  contactEmail: varchar("contact_email").notNull(),
  contactPhone: varchar("contact_phone"),
  website: varchar("website"),
  
  // Supplier Details
  address: text("address"),
  country: varchar("country"),
  apiEndpoint: varchar("api_endpoint"), // For automated order processing
  apiKey: varchar("api_key"), // Encrypted supplier API key
  
  // Business Terms
  minimumOrder: decimal("minimum_order", { precision: 10, scale: 2 }).default('0.00'),
  shippingCost: decimal("shipping_cost", { precision: 8, scale: 2 }).default('0.00'),
  freeShippingThreshold: decimal("free_shipping_threshold", { precision: 10, scale: 2 }),
  paymentTerms: varchar("payment_terms").default('prepaid'), // 'prepaid', 'net_30', 'cod'
  
  // Performance Metrics
  reliability: decimal("reliability", { precision: 3, scale: 2 }).default('5.00'), // 0-5 rating
  averageProcessingTime: integer("average_processing_time").default(3), // days
  qualityRating: decimal("quality_rating", { precision: 3, scale: 2 }).default('5.00'),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// YaadFlex Drop Shipping Orders
export const yaadflexOrders = pgTable("yaadflex_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  
  // Order Details
  orderNumber: varchar("order_number").unique().notNull(), // 'YF-2024-001234'
  status: varchar("status").default('pending'), // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  
  // Pricing
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 8, scale: 2 }).default('0.00'),
  taxAmount: decimal("tax_amount", { precision: 8, scale: 2 }).default('0.00'),
  discountAmount: decimal("discount_amount", { precision: 8, scale: 2 }).default('0.00'),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('USD'),
  
  // Shipping Information
  shippingAddress: jsonb("shipping_address"), // Full address object
  billingAddress: jsonb("billing_address"),
  shippingMethod: varchar("shipping_method").default('standard'), // 'standard', 'express', 'overnight'
  trackingNumber: varchar("tracking_number"),
  trackingUrl: varchar("tracking_url"),
  
  // Drop Shipping Details
  supplierId: varchar("supplier_id").references(() => yaadflexSuppliers.id),
  supplierOrderId: varchar("supplier_order_id"), // Supplier's order reference
  
  // Timestamps
  orderDate: timestamp("order_date").defaultNow(),
  processedAt: timestamp("processed_at"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  estimatedDelivery: timestamp("estimated_delivery"),
  
  // Notes & Communication
  customerNotes: text("customer_notes"),
  internalNotes: text("internal_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order Items (individual products in each order)
export const yaadflexOrderItems = pgTable("yaadflex_order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => yaadflexOrders.id).notNull(),
  productId: varchar("product_id").references(() => yaadflexProducts.id).notNull(),
  
  // Product Details at time of order (for history)
  productName: varchar("product_name").notNull(),
  productSku: varchar("product_sku").notNull(),
  productImage: varchar("product_image"),
  
  // Variation Details
  selectedSize: varchar("selected_size"), // 'M', 'L', etc.
  selectedColor: varchar("selected_color"), // 'Emerald', 'Gold', etc.
  customization: text("customization"), // Any custom text/embroidery
  
  // Pricing
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  
  // Drop Shipping Status
  itemStatus: varchar("item_status").default('pending'), // 'pending', 'processing', 'shipped', 'delivered'
  supplierStatus: varchar("supplier_status"), // Supplier's status for this item
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Reviews for YaadFlex merchandise
export const yaadflexProductReviews = pgTable("yaadflex_product_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => yaadflexProducts.id).notNull(),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  orderId: varchar("order_id").references(() => yaadflexOrders.id), // Optional link to purchase
  
  // Review Details
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title"),
  reviewText: text("review_text"),
  pros: text("pros"), // What they liked
  cons: text("cons"), // What could be improved
  
  // Verification
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  isVisible: boolean("is_visible").default(true),
  isModerated: boolean("is_moderated").default(false),
  
  // Images/Video
  reviewImages: jsonb("review_images"), // Customer photos of product
  reviewVideo: varchar("review_video"),
  
  // Helpful votes
  helpfulVotes: integer("helpful_votes").default(0),
  unhelpfulVotes: integer("unhelpful_votes").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================
// YAADLEX ULTIMATE AI VEHICLE VALUATOR + OBD SYSTEM
// Revolutionary honest pricing engine to prevent dealership lowballs
// =============================================================

// VIN Decoding Table - Stores decoded VIN information
export const vinDecodes = pgTable("vin_decodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vin: varchar("vin", { length: 24 }).notNull(),
  make: varchar("make", { length: 64 }),
  model: varchar("model", { length: 64 }),
  year: integer("year"),
  body: varchar("body", { length: 64 }),
  engine: varchar("engine", { length: 64 }),
  trim: varchar("trim", { length: 64 }),
  raw: jsonb("raw"), // Raw VIN decode response
  createdAt: timestamp("created_at").defaultNow(),
});

// Market Comparables - Regional pricing data
export const marketComps = pgTable("market_comps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  make: varchar("make", { length: 64 }),
  model: varchar("model", { length: 64 }),
  year: integer("year"),
  region: varchar("region", { length: 64 }), // e.g., "JM-KIN", "US-FL"
  sample: jsonb("sample"), // Array of {price, mileage, location, date}
  medianPrice: decimal("median_price"),
  medianMileage: integer("median_mileage"),
  refreshedAt: timestamp("refreshed_at").defaultNow(),
});

// AI Vehicle Valuations - The heart of honest pricing
export const valuations = pgTable("valuations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id"), // Link to vehicle listing
  vin: varchar("vin", { length: 24 }),
  make: varchar("make", { length: 64 }),
  model: varchar("model", { length: 64 }),
  year: integer("year"),
  mileage: integer("mileage"),
  region: varchar("region", { length: 64 }),
  conditionScore: integer("condition_score"), // 0–100 from visual assessment
  obdHealthScore: integer("obd_health_score"), // 0–100 from OBD scan
  estimateLow: decimal("estimate_low"),
  estimateMid: decimal("estimate_mid"), 
  estimateHigh: decimal("estimate_high"),
  inputs: jsonb("inputs"), // All input data used for valuation
  currency: varchar("currency", { length: 3 }).default("USD"),
  method: varchar("method", { length: 32 }).default("hedonic_v1"), // Algorithm version
  createdAt: timestamp("created_at").defaultNow(),
});

// OBD Diagnostic Tests - Vehicle health scanning
export const obdTests = pgTable("obd_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id"),
  vin: varchar("vin", { length: 24 }),
  startedAt: timestamp("started_at").defaultNow(),
  finishedAt: timestamp("finished_at"),
  status: varchar("status", { length: 16 }).default("started"), // started|ok|warning|critical
  dtcCount: integer("dtc_count").default(0), // Diagnostic Trouble Code count
  summary: text("summary"), // Human-readable test summary
});

// OBD Sensor Readings - Real-time vehicle data
export const obdReadings = pgTable("obd_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  testId: varchar("test_id").notNull().references(() => obdTests.id),
  pid: varchar("pid", { length: 24 }).notNull(), // Parameter ID (e.g., "010C" for RPM)
  value: varchar("value", { length: 64 }).notNull(),
  unit: varchar("unit", { length: 16 }), // rpm, °C, mph, etc.
  recordedAt: timestamp("recorded_at").defaultNow(),
});
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

// YaadFlex Pricing System Types
export type InsertDriverFleet = typeof driverFleets.$inferInsert;
export type DriverFleet = typeof driverFleets.$inferSelect;
export type InsertPricingZone = typeof pricingZones.$inferInsert;
export type PricingZone = typeof pricingZones.$inferSelect;
export type InsertTripAssignment = typeof tripAssignments.$inferInsert;
export type TripAssignment = typeof tripAssignments.$inferSelect;
export type InsertLifestyleAddon = typeof lifestyleAddons.$inferInsert;
export type LifestyleAddon = typeof lifestyleAddons.$inferSelect;
export type InsertErrandGroup = typeof errandGroups.$inferInsert;
export type ErrandGroup = typeof errandGroups.$inferSelect;

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

// WORKFORCE MANAGEMENT TYPES
export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;
export type Worker = typeof workers.$inferSelect;
export type InsertWorker = typeof workers.$inferInsert;
export type Supervisor = typeof supervisors.$inferSelect;
export type InsertSupervisor = typeof supervisors.$inferInsert;
export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = typeof equipment.$inferInsert;
export type EquipmentHub = typeof equipmentHubs.$inferSelect;
export type InsertEquipmentHub = typeof equipmentHubs.$inferInsert;
export type EquipmentHubInventory = typeof equipmentHubInventory.$inferSelect;
export type InsertEquipmentHubInventory = typeof equipmentHubInventory.$inferInsert;
export type EquipmentCheckout = typeof equipmentCheckouts.$inferSelect;
export type InsertEquipmentCheckout = typeof equipmentCheckouts.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;
export type JobAssignment = typeof jobAssignments.$inferSelect;
export type InsertJobAssignment = typeof jobAssignments.$inferInsert;
export type VehicleListing = typeof vehicleListings.$inferSelect;
export type InsertVehicleListing = typeof vehicleListings.$inferInsert;
export type EmailCommunication = typeof emailCommunications.$inferSelect;
export type InsertEmailCommunication = typeof emailCommunications.$inferInsert;

// =================================================================
// MOBILITY & IMMIGRATION SUITE - YaadFlex Global Workforce Platform
// =================================================================

// Hotels for workforce management
export const hotels = pgTable("hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  address: varchar("address", { length: 300 }),
  country: varchar("country", { length: 2 }).notNull(),
  starRating: integer("star_rating").default(3),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hotel roles and positions
export const hotelRoles = pgTable("hotel_roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id),
  title: varchar("title", { length: 120 }).notNull(),
  dept: varchar("dept", { length: 120 }),
  minSkill: varchar("min_skill", { length: 40 }),
  payRate: decimal("pay_rate", { precision: 10, scale: 2 }),
  payType: varchar("pay_type", { length: 20 }),
  notes: varchar("notes", { length: 500 }),
  isActive: boolean("is_active").default(true),
});

// Hotel shifts scheduling
export const hotelShifts = pgTable("hotel_shifts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").notNull().references(() => hotels.id),
  roleId: varchar("role_id").notNull().references(() => hotelRoles.id),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  slots: integer("slots").default(1),
  notes: varchar("notes", { length: 500 }),
  status: varchar("status", { length: 20 }).default("open"),
});

// Immigration programs (visas, work permits)
export const immigrationPrograms = pgTable("immigration_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 200 }).notNull(),
  country: varchar("country", { length: 2 }).notNull(),
  visaType: varchar("visa_type", { length: 60 }).notNull(),
  seasonal: boolean("seasonal").default(false),
  requirements: jsonb("requirements"), // string[]
  documentsRequired: jsonb("documents_required"), // string[]
  feeUsd: decimal("fee_usd", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 20 }).default("active"),
});

// Immigration applications
export const immigrationApplications = pgTable("immigration_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programId: varchar("program_id").notNull().references(() => immigrationPrograms.id),
  workerId: varchar("worker_id").notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  decisionAt: timestamp("decision_at"),
  assignedLawyerId: varchar("assigned_lawyer_id"),
  notes: varchar("notes", { length: 500 }),
});

// Legal service providers
export const legalProviders = pgTable("legal_providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firmName: varchar("firm_name", { length: 200 }).notNull(),
  contactEmail: varchar("contact_email", { length: 200 }).notNull(),
  barId: varchar("bar_id", { length: 120 }),
  country: varchar("country", { length: 2 }).notNull(),
  specialties: jsonb("specialties"), // string[]
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  isActive: boolean("is_active").default(true),
});

// Legal cases
export const legalCases = pgTable("legal_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  lawyerId: varchar("lawyer_id").notNull().references(() => legalProviders.id),
  type: varchar("type", { length: 60 }).notNull(),
  status: varchar("status", { length: 20 }).default("open"),
  openedAt: timestamp("opened_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  documents: jsonb("documents"), // string[] of doc IDs
  messagesThreadId: varchar("messages_thread_id"),
});

// KYC profiles for compliance
export const kycProfiles = pgTable("kyc_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  tier: varchar("tier", { length: 20 }).default("tier1"),
  status: varchar("status", { length: 20 }).default("pending"),
  pepScreen: boolean("pep_screen").default(false),
  sanctionsHit: boolean("sanctions_hit").default(false),
  lastReviewedAt: timestamp("last_reviewed_at"),
});

// Document vault
export const documentsVault = pgTable("documents_vault", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull(),
  type: varchar("type", { length: 60 }).notNull(),
  path: varchar("path", { length: 400 }).notNull(),
  hash: varchar("hash", { length: 128 }),
  issuedBy: varchar("issued_by", { length: 200 }),
  expiresAt: timestamp("expires_at"),
  verified: boolean("verified").default(false),
  notes: varchar("notes", { length: 500 }),
});

// Travel itineraries
export const travelItineraries = pgTable("travel_itineraries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  pnr: varchar("pnr", { length: 12 }),
  segments: jsonb("segments"),
  price: decimal("price", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: varchar("status", { length: 20 }).default("hold"),
  provider: varchar("provider", { length: 60 }),
  ticketedAt: timestamp("ticketed_at"),
});

// Escrow accounts for secure payments
export const escrowAccounts = pgTable("escrow_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: varchar("status", { length: 20 }).default("open"),
  releasedAt: timestamp("released_at"),
  refundedAt: timestamp("refunded_at"),
});

// Mobility & Immigration Suite Types
export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = typeof hotels.$inferInsert;
export type HotelRole = typeof hotelRoles.$inferSelect;
export type InsertHotelRole = typeof hotelRoles.$inferInsert;
export type HotelShift = typeof hotelShifts.$inferSelect;
export type InsertHotelShift = typeof hotelShifts.$inferInsert;
export type ImmigrationProgram = typeof immigrationPrograms.$inferSelect;
export type InsertImmigrationProgram = typeof immigrationPrograms.$inferInsert;
export type ImmigrationApplication = typeof immigrationApplications.$inferSelect;
export type InsertImmigrationApplication = typeof immigrationApplications.$inferInsert;
export type LegalProvider = typeof legalProviders.$inferSelect;
export type InsertLegalProvider = typeof legalProviders.$inferInsert;
export type LegalCase = typeof legalCases.$inferSelect;
export type InsertLegalCase = typeof legalCases.$inferInsert;
export type KycProfile = typeof kycProfiles.$inferSelect;
export type InsertKycProfile = typeof kycProfiles.$inferInsert;
export type DocumentVault = typeof documentsVault.$inferSelect;
export type InsertDocumentVault = typeof documentsVault.$inferInsert;
export type TravelItinerary = typeof travelItineraries.$inferSelect;
export type InsertTravelItinerary = typeof travelItineraries.$inferInsert;
export type EscrowAccount = typeof escrowAccounts.$inferSelect;
export type InsertEscrowAccount = typeof escrowAccounts.$inferInsert;

// WORKFORCE MANAGEMENT SYSTEM - YaadFlex Job Creation Platform

// Companies that post jobs and hire workers
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  industry: varchar("industry").notNull(), // 'maintenance', 'cleaning', 'construction', 'automotive', etc.
  description: text("description"),
  email: varchar("email"),
  phone: varchar("phone"),
  address: text("address"),
  city: varchar("city"),
  country: varchar("country").default('JM'),
  logoUrl: varchar("logo_url"),
  isVerified: boolean("is_verified").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('5.00'),
  totalJobs: integer("total_jobs").default(0),
  activeJobs: integer("active_jobs").default(0),
  
  // Business Legal Acceptance Fields - CRITICAL for commercial partnerships
  businessTermsAccepted: boolean("business_terms_accepted").default(false).notNull(),
  businessPartnerAgreementAccepted: boolean("business_partner_agreement_accepted").default(false).notNull(),
  businessPrivacyAccepted: boolean("business_privacy_accepted").default(false).notNull(),
  legalAcceptedAt: timestamp("legal_accepted_at"), // When business agreements were accepted
  businessTermsVersion: varchar("business_terms_version").default('1.0'),
  businessAgreementVersion: varchar("business_agreement_version").default('1.0'),
  businessPrivacyVersion: varchar("business_privacy_version").default('1.0'),
  ipAddressAtAcceptance: varchar("ip_address_at_acceptance"), // Legal audit trail
  userAgentAtAcceptance: text("user_agent_at_acceptance"), // Browser/device info for compliance
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job postings for maintenance, cleanup, and any work
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").references(() => companies.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  jobType: varchar("job_type").notNull(), // 'maintenance', 'cleanup', 'construction', 'delivery', 'automotive'
  skillLevel: varchar("skill_level").notNull().default('entry'), // 'entry', 'intermediate', 'expert', 'supervisor'
  
  // Location and scheduling
  address: text("address").notNull(),
  city: varchar("city").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  isFlexibleSchedule: boolean("is_flexible_schedule").default(false),
  workingHours: varchar("working_hours"), // '9am-5pm', 'flexible', 'night_shift'
  
  // Compensation
  payRate: decimal("pay_rate", { precision: 10, scale: 2 }).notNull(),
  payType: varchar("pay_type").notNull().default('hourly'), // 'hourly', 'daily', 'project', 'commission'
  currency: varchar("currency", { length: 3 }).notNull().default('JMD'),
  estimatedDuration: integer("estimated_duration"), // hours for project completion
  
  // Requirements
  workersNeeded: integer("workers_needed").notNull().default(1),
  supervisorsNeeded: integer("supervisors_needed").default(0),
  equipmentProvided: boolean("equipment_provided").default(false),
  equipmentRequired: jsonb("equipment_required"), // Array of equipment IDs needed
  skillsRequired: jsonb("skills_required"), // Array of required skills
  
  // Status and visibility
  status: varchar("status").notNull().default('open'), // 'open', 'in_progress', 'completed', 'cancelled', 'paused'
  isUrgent: boolean("is_urgent").default(false),
  isPublic: boolean("is_public").default(true),
  applicationDeadline: date("application_deadline"),
  
  // Meta
  totalApplicants: integer("total_applicants").default(0),
  hiredWorkers: integer("hired_workers").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_jobs_type_status").on(table.jobType, table.status),
  index("idx_jobs_location").on(table.city, table.latitude, table.longitude),
  index("idx_jobs_company").on(table.companyId),
]);

// Worker profiles (separate from regular users - these are job workers)
export const workers = pgTable("workers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  
  // Worker details
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email").notNull(),
  dateOfBirth: date("date_of_birth"),
  
  // Location and availability
  address: text("address"),
  city: varchar("city").notNull(),
  country: varchar("country").default('JM'),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  maxTravelDistance: integer("max_travel_distance").default(25), // kilometers
  
  // Skills and experience
  skills: jsonb("skills"), // Array of skills: ['plumbing', 'electrical', 'cleaning', etc.]
  experienceLevel: varchar("experience_level").notNull().default('entry'), // 'entry', 'intermediate', 'expert'
  yearsExperience: integer("years_experience").default(0),
  specializations: jsonb("specializations"), // Specific areas of expertise
  
  // Work preferences
  preferredJobTypes: jsonb("preferred_job_types"), // Array of preferred job types
  availableDays: jsonb("available_days"), // Array: ['monday', 'tuesday', etc.]
  preferredHours: varchar("preferred_hours"), // 'morning', 'afternoon', 'evening', 'night', 'flexible'
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default('JMD'),
  
  // Status and performance
  isAvailable: boolean("is_available").default(true),
  isVerified: boolean("is_verified").default(false),
  backgroundCheckPassed: boolean("background_check_passed").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('5.00'),
  totalJobsCompleted: integer("total_jobs_completed").default(0),
  
  // Documents and verification
  profileImageUrl: varchar("profile_image_url"),
  resumeUrl: varchar("resume_url"),
  certifications: jsonb("certifications"), // Array of certification objects
  references: jsonb("references"), // Array of reference contacts
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_workers_location").on(table.city, table.latitude, table.longitude),
  index("idx_workers_skills").on(table.skills),
  index("idx_workers_available").on(table.isAvailable),
]);

// Supervisor profiles for managing workers
export const supervisors = pgTable("supervisors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  workerId: varchar("worker_id").references(() => workers.id), // Can also be a worker
  
  // Supervisor details
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email").notNull(),
  
  // Management experience
  managementExperience: integer("management_experience").default(0), // years
  maxTeamSize: integer("max_team_size").default(5), // max workers they can supervise
  industries: jsonb("industries"), // Array of industries they can supervise
  
  // Location and availability
  city: varchar("city").notNull(),
  country: varchar("country").default('JM'),
  maxTravelDistance: integer("max_travel_distance").default(50), // kilometers
  
  // Performance and rates
  supervisoryRate: decimal("supervisory_rate", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default('JMD'),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('5.00'),
  totalProjectsSupervised: integer("total_projects_supervised").default(0),
  
  // Status
  isAvailable: boolean("is_available").default(true),
  isVerified: boolean("is_verified").default(false),
  canHireWorkers: boolean("can_hire_workers").default(false),
  canFireWorkers: boolean("can_fire_workers").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Equipment available for rent/use
export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").references(() => companies.id),
  
  // Equipment details
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // 'tools', 'machinery', 'vehicles', 'safety', 'cleaning'
  subcategory: varchar("subcategory"), // 'power_tools', 'hand_tools', 'heavy_machinery', etc.
  brand: varchar("brand"),
  model: varchar("model"),
  serialNumber: varchar("serial_number"),
  
  // Availability and condition
  condition: varchar("condition").notNull().default('good'), // 'excellent', 'good', 'fair', 'poor'
  isAvailable: boolean("is_available").default(true),
  requiresTraining: boolean("requires_training").default(false),
  safetyRequirements: jsonb("safety_requirements"), // Array of safety gear needed
  
  // Rental information
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }),
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default('JMD'),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  
  // Images and documentation
  imageUrls: jsonb("image_urls"), // Array of image URLs
  manualUrl: varchar("manual_url"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_equipment_category").on(table.category, table.subcategory),
  index("idx_equipment_available").on(table.isAvailable),
]);

// Equipment hub locations for pickup/return
export const equipmentHubs = pgTable("equipment_hubs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").references(() => companies.id),
  managerId: varchar("manager_id").references(() => users.id),
  
  // Hub details
  name: varchar("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: varchar("city").notNull(),
  country: varchar("country").default('JM'),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  // Operating hours
  operatingHours: jsonb("operating_hours"), // Object with days and hours
  is24Hours: boolean("is_24_hours").default(false),
  
  // Capacity and features
  storageCapacity: integer("storage_capacity"), // total equipment slots
  currentOccupancy: integer("current_occupancy").default(0),
  hasSecuritySystem: boolean("has_security_system").default(false),
  hasClimateControl: boolean("has_climate_control").default(false),
  
  // Contact and access
  phone: varchar("phone"),
  email: varchar("email"),
  accessCode: varchar("access_code"), // For 24-hour access
  specialInstructions: text("special_instructions"),
  
  // Status
  isActive: boolean("is_active").default(true),
  lastInventoryCheck: timestamp("last_inventory_check"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_hubs_location").on(table.city, table.latitude, table.longitude),
  index("idx_hubs_active").on(table.isActive),
]);

// Equipment assignments to hubs
export const equipmentHubInventory = pgTable("equipment_hub_inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: varchar("equipment_id").references(() => equipment.id).notNull(),
  hubId: varchar("hub_id").references(() => equipmentHubs.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  storageLocation: varchar("storage_location"), // Rack/zone within hub
  lastChecked: timestamp("last_checked").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_hub_inventory_equipment").on(table.equipmentId),
  index("idx_hub_inventory_hub").on(table.hubId),
]);

// Equipment checkout/return tracking
export const equipmentCheckouts = pgTable("equipment_checkouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: varchar("equipment_id").references(() => equipment.id).notNull(),
  workerId: varchar("worker_id").references(() => workers.id).notNull(),
  hubId: varchar("hub_id").references(() => equipmentHubs.id).notNull(),
  jobId: varchar("job_id").references(() => jobs.id), // Optional job association
  
  // Checkout details
  checkedOutAt: timestamp("checked_out_at").defaultNow(),
  plannedReturnDate: date("planned_return_date").notNull(),
  actualReturnDate: timestamp("actual_return_date"),
  
  // Condition tracking
  checkoutCondition: varchar("checkout_condition").notNull(), // 'excellent', 'good', 'fair'
  returnCondition: varchar("return_condition"), // Set when returned
  damageNotes: text("damage_notes"),
  
  // Financial
  rentalRate: decimal("rental_rate", { precision: 10, scale: 2 }).notNull(),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  depositReturned: boolean("deposit_returned").default(false),
  
  // Status
  status: varchar("status").notNull().default('checked_out'), // 'checked_out', 'overdue', 'returned', 'damaged', 'lost'
  isOverdue: boolean("is_overdue").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_checkouts_worker").on(table.workerId),
  index("idx_checkouts_equipment").on(table.equipmentId),
  index("idx_checkouts_status").on(table.status),
  index("idx_checkouts_overdue").on(table.isOverdue),
]);

// Job applications from workers
export const jobApplications = pgTable("job_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id).notNull(),
  workerId: varchar("worker_id").references(() => workers.id).notNull(),
  
  // Application details
  coverLetter: text("cover_letter"),
  proposedRate: decimal("proposed_rate", { precision: 10, scale: 2 }),
  availability: varchar("availability"), // 'immediate', 'within_week', 'flexible'
  estimatedCompletionTime: integer("estimated_completion_time"), // hours
  
  // Status tracking
  status: varchar("status").notNull().default('pending'), // 'pending', 'reviewed', 'interviewed', 'hired', 'rejected'
  appliedAt: timestamp("applied_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  interviewedAt: timestamp("interviewed_at"),
  hiredAt: timestamp("hired_at"),
  rejectedAt: timestamp("rejected_at"),
  
  // Feedback
  companyNotes: text("company_notes"),
  rejectionReason: text("rejection_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_applications_job").on(table.jobId),
  index("idx_applications_worker").on(table.workerId),
  index("idx_applications_status").on(table.status),
]);

// Job assignments (hired workers)
export const jobAssignments = pgTable("job_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id).notNull(),
  workerId: varchar("worker_id").references(() => workers.id).notNull(),
  supervisorId: varchar("supervisor_id").references(() => supervisors.id),
  
  // Assignment details
  role: varchar("role").notNull().default('worker'), // 'worker', 'team_lead', 'specialist'
  assignedRate: decimal("assigned_rate", { precision: 10, scale: 2 }).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
  startDate: date("start_date").notNull(),
  expectedEndDate: date("expected_end_date"),
  actualEndDate: timestamp("actual_end_date"),
  
  // Status and performance
  status: varchar("status").notNull().default('assigned'), // 'assigned', 'started', 'in_progress', 'completed', 'terminated'
  hoursWorked: decimal("hours_worked", { precision: 8, scale: 2 }).default('0.00'),
  performanceRating: decimal("performance_rating", { precision: 3, scale: 2 }),
  companyFeedback: text("company_feedback"),
  workerFeedback: text("worker_feedback"),
  
  // Termination details (for hire/fire functionality)
  canBeTerminated: boolean("can_be_terminated").default(true),
  terminatedAt: timestamp("terminated_at"),
  terminationReason: text("termination_reason"),
  terminatedBy: varchar("terminated_by").references(() => users.id), // supervisor or company owner
  severancePaid: decimal("severance_paid", { precision: 10, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_assignments_job").on(table.jobId),
  index("idx_assignments_worker").on(table.workerId),
  index("idx_assignments_supervisor").on(table.supervisorId),
  index("idx_assignments_status").on(table.status),
]);

// Vehicle marketplace for cars and dealerships
export const vehicleListings = pgTable("vehicle_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  companyId: varchar("company_id").references(() => companies.id), // For dealerships
  
  // Vehicle details
  make: varchar("make").notNull(),
  model: varchar("model").notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage"),
  vin: varchar("vin"),
  licensePlate: varchar("license_plate"),
  
  // Specifications
  bodyType: varchar("body_type"), // 'sedan', 'suv', 'truck', 'motorcycle', 'bus'
  transmission: varchar("transmission"), // 'manual', 'automatic', 'cvt'
  fuelType: varchar("fuel_type"), // 'gasoline', 'diesel', 'electric', 'hybrid'
  engineSize: varchar("engine_size"),
  color: varchar("color"),
  
  // Pricing and availability
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('JMD'),
  isNegotiable: boolean("is_negotiable").default(true),
  financingAvailable: boolean("financing_available").default(false),
  tradeInAccepted: boolean("trade_in_accepted").default(false),
  
  // Condition and history
  condition: varchar("condition").notNull(), // 'excellent', 'good', 'fair', 'poor', 'salvage'
  accidentHistory: boolean("accident_history").default(false),
  serviceHistory: jsonb("service_history"), // Array of service records
  
  // Location
  city: varchar("city").notNull(),
  country: varchar("country").default('JM'),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  // Media and documentation
  imageUrls: jsonb("image_urls"), // Array of image URLs
  videoUrl: varchar("video_url"),
  documentsUrls: jsonb("documents_urls"), // Registration, inspection, etc.
  
  // Listing status
  status: varchar("status").notNull().default('active'), // 'active', 'sold', 'pending', 'withdrawn'
  isPromoted: boolean("is_promoted").default(false),
  promotionExpiresAt: timestamp("promotion_expires_at"),
  
  // Analytics
  viewCount: integer("view_count").default(0),
  inquiryCount: integer("inquiry_count").default(0),
  favoriteCount: integer("favorite_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_vehicles_make_model").on(table.make, table.model),
  index("idx_vehicles_price").on(table.price),
  index("idx_vehicles_location").on(table.city, table.latitude, table.longitude),
  index("idx_vehicles_status").on(table.status),
]);

// Email communication system for job coordination
export const emailCommunications = pgTable("email_communications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").references(() => users.id).notNull(),
  toUserId: varchar("to_user_id").references(() => users.id).notNull(),
  
  // Related entities
  jobId: varchar("job_id").references(() => jobs.id),
  applicationId: varchar("application_id").references(() => jobApplications.id),
  assignmentId: varchar("assignment_id").references(() => jobAssignments.id),
  
  // Email content
  subject: varchar("subject").notNull(),
  body: text("body").notNull(),
  emailType: varchar("email_type").notNull(), // 'job_notification', 'application_status', 'assignment_update', 'general'
  
  // Delivery status
  status: varchar("status").notNull().default('pending'), // 'pending', 'sent', 'delivered', 'failed'
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
  
  // External email service tracking
  externalEmailId: varchar("external_email_id"), // ID from email service provider
  failureReason: text("failure_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_emails_from_user").on(table.fromUserId),
  index("idx_emails_to_user").on(table.toUserId),
  index("idx_emails_job").on(table.jobId),
  index("idx_emails_status").on(table.status),
]);

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

// CEO Dashboard - Business Expenses & Renewals
export const businessExpenses = pgTable("business_expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: varchar("category").notNull(), // 'domain', 'hosting', 'insurance', 'licenses', 'marketing', 'compliance', 'developer_tools', 'email'
  name: varchar("name").notNull(), // e.g., 'yaadflex.com Domain', 'Google Workspace', 'General Liability Insurance'
  provider: varchar("provider"), // e.g., 'GoDaddy', 'Google', 'Insurance Company'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('JMD'),
  frequency: varchar("frequency").notNull(), // 'monthly', 'quarterly', 'yearly', 'one-time'
  nextDueDate: timestamp("next_due_date").notNull(),
  lastPaidDate: timestamp("last_paid_date"),
  autoRenewal: boolean("auto_renewal").default(false),
  autoPayment: boolean("auto_payment").default(false), // Enable automatic payment
  paymentMethodId: varchar("payment_method_id"), // Stripe payment method ID
  stripeSubscriptionId: varchar("stripe_subscription_id"), // For recurring payments
  vendorProfileId: varchar("vendor_profile_id"), // Reference to vendor details
  paymentStatus: varchar("payment_status").default('pending'), // 'pending', 'processing', 'completed', 'failed'
  lastPaymentAttempt: timestamp("last_payment_attempt"),
  nextPaymentRetry: timestamp("next_payment_retry"),
  paymentFailureCount: integer("payment_failure_count").default(0),
  isActive: boolean("is_active").default(true),
  alertDays: integer("alert_days").default(30), // Days before due date to alert
  description: text("description"),
  invoiceUrl: text("invoice_url"), // URL to stored invoice/receipt
  status: varchar("status").default('upcoming'), // 'upcoming', 'overdue', 'paid', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment Methods table for automatic payments
export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stripePaymentMethodId: varchar("stripe_payment_method_id").notNull(),
  type: varchar("type").notNull(), // 'card', 'bank_account', 'digital_wallet'
  brand: varchar("brand"), // 'visa', 'mastercard', etc.
  last4: varchar("last_4"),
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  bankName: varchar("bank_name"),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment History table for tracking all payments
export const paymentHistory = pgTable("payment_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  expenseId: varchar("expense_id").references(() => businessExpenses.id).notNull(),
  paymentMethodId: varchar("payment_method_id").references(() => paymentMethods.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('JMD'),
  status: varchar("status").notNull(), // 'pending', 'processing', 'completed', 'failed', 'cancelled'
  paymentDate: timestamp("payment_date"),
  completedAt: timestamp("completed_at"),
  failureReason: text("failure_reason"),
  receiptUrl: varchar("receipt_url"),
  vendorConfirmation: varchar("vendor_confirmation"),
  stripeChargeId: varchar("stripe_charge_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vendor Profiles for managing payment recipients
export const vendorProfiles = pgTable("vendor_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // e.g., 'GoDaddy', 'Google LLC', 'Insurance Company'
  category: varchar("category").notNull(), // 'insurance', 'hosting', 'domain', 'email', 'legal'
  contactEmail: varchar("contact_email").notNull(),
  billingEmail: varchar("billing_email"),
  supportEmail: varchar("support_email"),
  accountNumber: varchar("account_number"), // Your account number with them
  customerNumber: varchar("customer_number"),
  paymentTerms: varchar("payment_terms").default('due_on_receipt'), // 'net15', 'net30', 'due_on_receipt'
  preferredPaymentMethod: varchar("preferred_payment_method").default('card'), // 'card', 'bank_transfer', 'check', 'paypal'
  website: varchar("website"),
  phone: varchar("phone"),
  address: text("address"),
  taxId: varchar("tax_id"),
  notes: text("notes"), // Special payment instructions
  autoPayEnabled: boolean("auto_pay_enabled").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Automatic Payment Jobs for scheduling
export const paymentJobs = pgTable("payment_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  expenseId: varchar("expense_id").references(() => businessExpenses.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  jobType: varchar("job_type").notNull(), // 'payment', 'reminder', 'retry'
  status: varchar("status").default('scheduled'), // 'scheduled', 'processing', 'completed', 'failed', 'cancelled'
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(3),
  lastAttemptAt: timestamp("last_attempt_at"),
  nextRetryAt: timestamp("next_retry_at"),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CEO Dashboard - AI Advisory Reports
export const aiAdvisoryReports = pgTable("ai_advisory_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  advisorType: varchar("advisor_type").notNull(), // 'risk', 'tech', 'finance', 'growth'
  reportType: varchar("report_type").notNull(), // 'weekly', 'monthly', 'alert', 'recommendation'
  priority: varchar("priority").notNull().default('medium'), // 'low', 'medium', 'high', 'critical'
  title: varchar("title").notNull(),
  summary: text("summary").notNull(), // Short summary for dashboard
  details: text("details"), // Full report details
  recommendations: jsonb("recommendations"), // Array of specific actions
  metrics: jsonb("metrics"), // Data points that triggered the report
  status: varchar("status").default('unread'), // 'unread', 'read', 'action_taken', 'dismissed'
  actionRequired: boolean("action_required").default(false),
  dueDate: timestamp("due_date"), // If action is required by specific date
  tags: jsonb("tags"), // Array of tags for categorization
  generatedAt: timestamp("generated_at").defaultNow(),
  readAt: timestamp("read_at"),
  actionTakenAt: timestamp("action_taken_at"),
});

// CEO Dashboard - Expense Reminders
export const expenseReminders = pgTable("expense_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  expenseId: varchar("expense_id").references(() => businessExpenses.id).notNull(),
  reminderDate: timestamp("reminder_date").notNull(),
  reminderType: varchar("reminder_type").notNull(), // 'email', 'whatsapp', 'dashboard'
  message: text("message").notNull(),
  isSent: boolean("is_sent").default(false),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// CEO Dashboard - System Health Monitoring
export const systemHealthMetrics = pgTable("system_health_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: varchar("metric_type").notNull(), // 'performance', 'errors', 'usage', 'revenue', 'security'
  metricName: varchar("metric_name").notNull(), // e.g., 'response_time', 'active_users', 'daily_revenue'
  value: decimal("value", { precision: 15, scale: 4 }).notNull(),
  unit: varchar("unit"), // e.g., 'ms', 'users', 'JMD', 'percentage'
  threshold: decimal("threshold", { precision: 15, scale: 4 }), // Alert threshold
  isHealthy: boolean("is_healthy").default(true),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// CEO Dashboard - Business Goals & KPIs
export const businessGoals = pgTable("business_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  goalType: varchar("goal_type").notNull(), // 'revenue', 'users', 'trips', 'market_share'
  name: varchar("name").notNull(),
  description: text("description"),
  targetValue: decimal("target_value", { precision: 15, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }).default('0.00'),
  unit: varchar("unit").notNull(), // 'JMD', 'users', 'trips', 'percentage'
  targetDate: timestamp("target_date").notNull(),
  status: varchar("status").default('in_progress'), // 'in_progress', 'achieved', 'overdue', 'cancelled'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// CEO Dashboard Insert Schemas
export const insertBusinessExpenseSchema = createInsertSchema(businessExpenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertAiAdvisoryReportSchema = createInsertSchema(aiAdvisoryReports).omit({
  id: true,
  generatedAt: true,
});
export const insertExpenseReminderSchema = createInsertSchema(expenseReminders).omit({
  id: true,
  createdAt: true,
});
export const insertSystemHealthMetricSchema = createInsertSchema(systemHealthMetrics).omit({
  id: true,
  recordedAt: true,
});
export const insertBusinessGoalSchema = createInsertSchema(businessGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Automatic Payment Insert Schemas
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertPaymentHistorySchema = createInsertSchema(paymentHistory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertVendorProfileSchema = createInsertSchema(vendorProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertPaymentJobSchema = createInsertSchema(paymentJobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type PrecisionMeasurement = typeof precisionMeasurements.$inferSelect;
export type InsertPrecisionMeasurement = typeof precisionMeasurements.$inferInsert;
export type LoyaltyProgram = typeof loyaltyProgram.$inferSelect;
export type InsertLoyaltyProgram = typeof loyaltyProgram.$inferInsert;
export type PlatformCommission = typeof platformCommissions.$inferSelect;
export type InsertPlatformCommission = typeof platformCommissions.$inferInsert;
export type CashbackTransaction = typeof cashbackTransactions.$inferSelect;
export type InsertCashbackTransaction = typeof cashbackTransactions.$inferInsert;

// CEO Dashboard Types
export type BusinessExpense = typeof businessExpenses.$inferSelect;
export type InsertBusinessExpense = z.infer<typeof insertBusinessExpenseSchema>;
export type AiAdvisoryReport = typeof aiAdvisoryReports.$inferSelect;
export type InsertAiAdvisoryReport = z.infer<typeof insertAiAdvisoryReportSchema>;
export type ExpenseReminder = typeof expenseReminders.$inferSelect;
export type InsertExpenseReminder = z.infer<typeof insertExpenseReminderSchema>;
export type SystemHealthMetric = typeof systemHealthMetrics.$inferSelect;
export type InsertSystemHealthMetric = z.infer<typeof insertSystemHealthMetricSchema>;
export type BusinessGoal = typeof businessGoals.$inferSelect;
export type InsertBusinessGoal = z.infer<typeof insertBusinessGoalSchema>;

// Automatic Payment Types
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentHistory = typeof paymentHistory.$inferSelect;
export type InsertPaymentHistory = z.infer<typeof insertPaymentHistorySchema>;
export type VendorProfile = typeof vendorProfiles.$inferSelect;
export type InsertVendorProfile = z.infer<typeof insertVendorProfileSchema>;
export type PaymentJob = typeof paymentJobs.$inferSelect;
export type InsertPaymentJob = z.infer<typeof insertPaymentJobSchema>;

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
  
  // YaadFlex Social Profile
  socialUsername: varchar("social_username").unique(),
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

// YaadFlex Social Posts (Independent Platform)
export const socialPosts = pgTable("social_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => businessProfiles.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Post Content
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  hashtags: jsonb("hashtags"), // Array of hashtags
  imageUrls: jsonb("image_urls"), // Multiple images
  videoUrl: varchar("video_url"),
  
  // Posting Schedule (YaadFlex Social Only)
  scheduledFor: timestamp("scheduled_for"),
  postType: varchar("post_type").default("community"), // "community", "business", "personal", "driver_story"
  
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

// YaadFlex Social Templates (Independent)
export const socialTemplates = pgTable("social_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Template Info
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // Business category this template is for
  templateType: varchar("template_type").notNull(), // "driver_story", "business_post", "community_update"
  
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
  posts: many(socialPosts),
  reviews: many(customerReviews),
}));

export const socialPostsRelations = relations(socialPosts, ({ one }) => ({
  profile: one(businessProfiles, {
    fields: [socialPosts.profileId],
    references: [businessProfiles.id],
  }),
  user: one(users, {
    fields: [socialPosts.userId],
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
export const insertSocialPostSchema = createInsertSchema(socialPosts);
export const insertSocialTemplateSchema = createInsertSchema(socialTemplates);
export const insertCustomerReviewSchema = createInsertSchema(customerReviews);
export const insertAgeVerificationSchema = createInsertSchema(ageVerifications);
export const insertComplianceGuidelineSchema = createInsertSchema(complianceGuidelines);

// ===================== TYPES =====================

export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type InsertBusinessProfile = typeof businessProfiles.$inferInsert;
export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = typeof socialPosts.$inferInsert;
export type SocialTemplate = typeof socialTemplates.$inferSelect;
export type InsertSocialTemplate = typeof socialTemplates.$inferInsert;
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

// ===================== TIMELESS UPGRADE SYSTEM TABLES =====================

// TimelessCore Safety System Configuration
export const timelessCoreConfig = pgTable('timeless_core_config', {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  version: varchar('version').notNull(), // e.g., "core-voice-2.1.0"
  safetyMode: varchar('safety_mode').notNull().default('strict'), // strict, moderate, permissive
  learningRateLimit: integer('learning_rate_limit').notNull().default(100), // max updates per hour
  humanApprovalRequired: boolean('human_approval_required').notNull().default(true),
  privacyMode: varchar('privacy_mode').notNull().default('maximum'), // maximum, balanced, minimal
  driftThreshold: decimal('drift_threshold', { precision: 3, scale: 2 }).notNull().default('0.20'),
  rollbackEnabled: boolean('rollback_enabled').notNull().default(true),
  lastKnownGoodVersion: varchar('last_known_good_version'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Learning Signals for Continuous Improvement
export const learningSignals = pgTable('learning_signals', {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id).notNull(),
  signalType: varchar('signal_type').notNull(), // feedback_button, translation_report, voice_correction, etc.
  originalText: text('original_text'), // PII redacted
  targetLang: varchar('target_lang').notNull(),
  translatedText: text('translated_text'), // PII redacted
  feedbackScore: integer('feedback_score'), // 1-5 or -1/1 for good/bad
  reportReason: text('report_reason'),
  contextHash: varchar('context_hash'), // anonymized context identifier
  sessionId: varchar('session_id'), // anonymized session
  privacyConsent: boolean('privacy_consent').notNull().default(false),
  processed: boolean('processed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Model Versions and Deployment Tracking
export const modelVersions = pgTable('model_versions', {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  version: varchar('version').notNull().unique(),
  status: varchar('status').notNull(), // training, evaluating, canary, deployed, rollback, deprecated
  accuracyScore: decimal('accuracy_score', { precision: 5, scale: 4 }),
  latencyP95: integer('latency_p95'), // milliseconds
  safetyScore: decimal('safety_score', { precision: 5, scale: 4 }),
  evaluationPassed: boolean('evaluation_passed').notNull().default(false),
  rolloutPercentage: integer('rollout_percentage').notNull().default(0),
  deployer: varchar('deployer').notNull(),
  approver: varchar('approver'),
  safetyApprover: varchar('safety_approver'),
  deployedAt: timestamp('deployed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Feature Flags for Controlled Rollouts
export const featureFlags = pgTable('feature_flags', {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flagName: varchar('flag_name').notNull().unique(),
  enabled: boolean('enabled').notNull().default(false),
  rolloutPercentage: integer('rollout_percentage').notNull().default(0),
  targetUserGroups: jsonb('target_user_groups'), // ['beta', 'premium', 'all']
  safetyCheck: boolean('safety_check').notNull().default(true),
  createdBy: varchar('created_by').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// System Diagnostics for Health Monitoring
export const systemDiagnostics = pgTable('system_diagnostics', {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  component: varchar('component').notNull(), // translator, policy_engine, learning_loop
  health: varchar('health').notNull(), // healthy, warning, critical, failure
  errorRate: decimal('error_rate', { precision: 5, scale: 4 }),
  latencyP95: integer('latency_p95'),
  throughput: integer('throughput'),
  memoryUsage: decimal('memory_usage', { precision: 5, scale: 2 }),
  cpuUsage: decimal('cpu_usage', { precision: 5, scale: 2 }),
  alertTriggered: boolean('alert_triggered').notNull().default(false),
  autoRepairAttempted: boolean('auto_repair_attempted').notNull().default(false),
  repairSuccessful: boolean('repair_successful'),
  checkTimestamp: timestamp('check_timestamp').defaultNow().notNull()
});

// Adaptive Learning Progress Tracking  
export const adaptiveLearningMetrics = pgTable('adaptive_learning_metrics', {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  systemIq: integer('system_iq').notNull().default(150), // Starts at 150, grows to 200+
  adaptationLevel: decimal('adaptation_level', { precision: 5, scale: 2 }).notNull().default('0.00'), // 0-100%
  learningProgress: decimal('learning_progress', { precision: 5, scale: 2 }).notNull().default('0.00'), // 0-100%
  translationAccuracy: decimal('translation_accuracy', { precision: 5, scale: 4 }).default('0.9400'),
  responseSpeed: integer('response_speed').default(800), // milliseconds
  userSatisfactionScore: decimal('user_satisfaction_score', { precision: 3, scale: 2 }).default('4.50'),
  totalInteractions: integer('total_interactions').default(0),
  successfulPredictions: integer('successful_predictions').default(0),
  modelVersion: varchar('model_version').default('v1.0.0'),
  lastOptimizationAt: timestamp('last_optimization_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

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

// =============================================================
// YAADLEX TRAVEL BOOKING SYSTEM
// Complete travel agent functionality for flights, hotels, cars
// =============================================================

// Travel Bookings - Main booking records
export const travelBookings = pgTable("travel_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  bookingType: varchar("booking_type").notNull(), // 'flight', 'hotel', 'car', 'package'
  status: varchar("status").notNull().default('pending'), // 'pending', 'confirmed', 'cancelled', 'completed'
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('JMD'),
  commission: decimal("commission", { precision: 12, scale: 2 }).notNull(), // YaadFlex commission (8%)
  bookingReference: varchar("booking_reference").notNull(),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  specialRequests: text("special_requests"),
  bookingDetails: jsonb("booking_details"), // Flight/hotel/car specific details
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Flight Bookings - Specific flight details
export const flightBookings = pgTable("flight_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  travelBookingId: varchar("travel_booking_id").references(() => travelBookings.id).notNull(),
  flightType: varchar("flight_type").notNull(), // 'round_trip', 'one_way', 'multi_city'
  departureAirport: varchar("departure_airport").notNull(), // 'KIN', 'MBJ', etc.
  arrivalAirport: varchar("arrival_airport").notNull(),
  departureDate: date("departure_date").notNull(),
  returnDate: date("return_date"),
  passengerCount: integer("passenger_count").notNull().default(1),
  cabinClass: varchar("cabin_class").notNull().default('economy'), // 'economy', 'business', 'first'
  airline: varchar("airline"),
  flightNumber: varchar("flight_number"),
  seatPreference: varchar("seat_preference"), // 'window', 'aisle', 'any'
  mealPreference: varchar("meal_preference"), // 'standard', 'vegetarian', 'kosher', etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Hotel Bookings - Accommodation details
export const hotelBookings = pgTable("hotel_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  travelBookingId: varchar("travel_booking_id").references(() => travelBookings.id).notNull(),
  hotelName: varchar("hotel_name").notNull(),
  destination: varchar("destination").notNull(), // City/Country
  checkInDate: date("check_in_date").notNull(),
  checkOutDate: date("check_out_date").notNull(),
  roomType: varchar("room_type").notNull(), // 'standard', 'deluxe', 'suite'
  guestCount: integer("guest_count").notNull().default(1),
  roomCount: integer("room_count").notNull().default(1),
  starRating: integer("star_rating"), // 1-5 stars
  amenities: jsonb("amenities"), // ['wifi', 'pool', 'gym', 'spa']
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Car Rental Bookings - Vehicle rental details
export const carRentalBookings = pgTable("car_rental_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  travelBookingId: varchar("travel_booking_id").references(() => travelBookings.id).notNull(),
  pickupLocation: varchar("pickup_location").notNull(),
  dropoffLocation: varchar("dropoff_location").notNull(),
  pickupDate: date("pickup_date").notNull(),
  dropoffDate: date("dropoff_date").notNull(),
  carType: varchar("car_type").notNull(), // 'economy', 'compact', 'midsize', 'luxury', 'suv'
  carMake: varchar("car_make"),
  carModel: varchar("car_model"),
  transmission: varchar("transmission").default('automatic'), // 'automatic', 'manual'
  fuelType: varchar("fuel_type").default('gasoline'), // 'gasoline', 'diesel', 'electric'
  insurance: boolean("insurance").default(false),
  gpsNavigation: boolean("gps_navigation").default(false),
  driverAge: integer("driver_age"),
  additionalDrivers: integer("additional_drivers").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Travel Packages - All-inclusive deals
export const travelPackages = pgTable("travel_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageName: varchar("package_name").notNull(),
  destination: varchar("destination").notNull(),
  duration: integer("duration").notNull(), // Number of days
  packageType: varchar("package_type").notNull(), // 'honeymoon', 'family', 'business', 'adventure'
  basePrice: decimal("base_price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('JMD'),
  maxCapacity: integer("max_capacity").notNull(),
  currentBookings: integer("current_bookings").default(0),
  includes: jsonb("includes"), // ['flight', 'hotel', 'meals', 'tours']
  excludes: jsonb("excludes"), // ['visa', 'personal_expenses']
  highlights: jsonb("highlights"), // Key attractions/features
  isActive: boolean("is_active").default(true),
  validFrom: date("valid_from").notNull(),
  validTo: date("valid_to").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Travel Agent Commissions - Track earnings
export const travelCommissions = pgTable("travel_commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  travelBookingId: varchar("travel_booking_id").references(() => travelBookings.id).notNull(),
  agentId: varchar("agent_id").references(() => users.id), // If using travel agents
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default('8.00'), // 8% default
  commissionAmount: decimal("commission_amount", { precision: 12, scale: 2 }).notNull(),
  bookingAmount: decimal("booking_amount", { precision: 12, scale: 2 }).notNull(),
  payoutStatus: varchar("payout_status").default('pending'), // 'pending', 'paid', 'cancelled'
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Popular Destinations - Marketing and recommendations
export const popularDestinations = pgTable("popular_destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  destination: varchar("destination").notNull(),
  country: varchar("country").notNull(),
  airportCode: varchar("airport_code", { length: 3 }),
  imageUrl: varchar("image_url"),
  description: text("description"),
  averagePrice: decimal("average_price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).notNull().default('JMD'),
  season: varchar("season"), // 'peak', 'shoulder', 'off'
  bookingCount: integer("booking_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('5.00'),
  isPromoted: boolean("is_promoted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertTravelBooking = typeof travelBookings.$inferInsert;
export type TravelBooking = typeof travelBookings.$inferSelect;
export type InsertFlightBooking = typeof flightBookings.$inferInsert;
export type FlightBooking = typeof flightBookings.$inferSelect;
export type InsertHotelBooking = typeof hotelBookings.$inferInsert;
export type HotelBooking = typeof hotelBookings.$inferSelect;
export type InsertCarRentalBooking = typeof carRentalBookings.$inferInsert;
export type CarRentalBooking = typeof carRentalBookings.$inferSelect;
export type InsertTravelPackage = typeof travelPackages.$inferInsert;
export type TravelPackage = typeof travelPackages.$inferSelect;
export type InsertTravelCommission = typeof travelCommissions.$inferInsert;
export type TravelCommission = typeof travelCommissions.$inferSelect;
export type InsertPopularDestination = typeof popularDestinations.$inferInsert;
export type PopularDestination = typeof popularDestinations.$inferSelect;

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

// TimelessCore INSERT SCHEMAS
export const insertTimelessCoreConfigSchema = createInsertSchema(timelessCoreConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLearningSignalSchema = createInsertSchema(learningSignals).omit({
  id: true,
  createdAt: true,
});

export const insertModelVersionSchema = createInsertSchema(modelVersions).omit({
  id: true,
  createdAt: true,
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSystemDiagnosticsSchema = createInsertSchema(systemDiagnostics).omit({
  id: true,
  checkTimestamp: true,
});

export const insertAdaptiveLearningMetricsSchema = createInsertSchema(adaptiveLearningMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// TimelessCore TYPES
export type TimelessCoreConfig = typeof timelessCoreConfig.$inferSelect;
export type InsertTimelessCoreConfig = z.infer<typeof insertTimelessCoreConfigSchema>;

export type LearningSignal = typeof learningSignals.$inferSelect;
export type InsertLearningSignal = z.infer<typeof insertLearningSignalSchema>;

export type ModelVersion = typeof modelVersions.$inferSelect;
export type InsertModelVersion = z.infer<typeof insertModelVersionSchema>;

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;

export type SystemDiagnostics = typeof systemDiagnostics.$inferSelect;
export type InsertSystemDiagnostics = z.infer<typeof insertSystemDiagnosticsSchema>;

export type AdaptiveLearningMetrics = typeof adaptiveLearningMetrics.$inferSelect;
export type InsertAdaptiveLearningMetrics = z.infer<typeof insertAdaptiveLearningMetricsSchema>;

// =============================================================
// VEHICLE VALUATOR + OBD SYSTEM TYPES & SCHEMAS
// =============================================================

export const insertVinDecodeSchema = createInsertSchema(vinDecodes).omit({
  id: true,
  createdAt: true,
});
export type InsertVinDecode = z.infer<typeof insertVinDecodeSchema>;
export type VinDecode = typeof vinDecodes.$inferSelect;

export const insertMarketCompSchema = createInsertSchema(marketComps).omit({
  id: true,
  refreshedAt: true,
});
export type InsertMarketComp = z.infer<typeof insertMarketCompSchema>;
export type MarketComp = typeof marketComps.$inferSelect;

export const insertValuationSchema = createInsertSchema(valuations).omit({
  id: true,
  createdAt: true,
});
export type InsertValuation = z.infer<typeof insertValuationSchema>;
export type Valuation = typeof valuations.$inferSelect;

export const insertObdTestSchema = createInsertSchema(obdTests).omit({
  id: true,
  startedAt: true,
});
export type InsertObdTest = z.infer<typeof insertObdTestSchema>;
export type ObdTest = typeof obdTests.$inferSelect;

export const insertObdReadingSchema = createInsertSchema(obdReadings).omit({
  id: true,
  recordedAt: true,
});
export type InsertObdReading = z.infer<typeof insertObdReadingSchema>;
export type ObdReading = typeof obdReadings.$inferSelect;

// =============================================================
// TIME-LOCKED AUTHENTICATION SYSTEM
// =============================================================

// Multi-Factor Authentication table
export const userMfa = pgTable("user_mfa", {
  userId: varchar("user_id", { length: 36 }).primaryKey().references(() => users.id),
  totpSecret: text("totp_secret"),             // base32 secret
  enabled: boolean("enabled").default(false),
  recoveryCodesHash: text("recovery_codes_hash"), // optional backup codes
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Time-locked user sessions
export const userSessions = pgTable("user_sessions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  deviceId: varchar("device_id", { length: 64 }),
  ip: varchar("ip", { length: 64 }),
  userAgent: text("user_agent"),
  startedAt: timestamp("started_at").defaultNow(),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  active: boolean("active").default(true),
});

// Work schedules for time-locked access
export const workSchedules = pgTable("work_schedules", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  dayOfWeek: varchar("day_of_week", { length: 16 }).notNull(), // "Sun".."Sat"
  startTime: time("start_time").notNull(), // 09:00:00
  endTime: time("end_time").notNull(),     // 17:00:00
  createdAt: timestamp("created_at").defaultNow(),
});

// Authentication policies
export const authPolicies = pgTable("auth_policies", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  minSessionMinutes: integer("min_session_minutes").default(30),
  cooldownMinutes: integer("cooldown_minutes").default(15),
  graceMinutesBefore: integer("grace_before").default(10),
  graceMinutesAfter: integer("grace_after").default(10),
  singleSessionOnly: boolean("single_session_only").default(true),
  deviceBindDays: integer("device_bind_days").default(14),
  createdAt: timestamp("created_at").defaultNow(),
});

// Time-locked authentication schema exports
export const insertUserMfaSchema = createInsertSchema(userMfa);
export type InsertUserMfa = z.infer<typeof insertUserMfaSchema>;
export type UserMfa = typeof userMfa.$inferSelect;

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  startedAt: true,
  lastSeenAt: true,
});
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type UserSession = typeof userSessions.$inferSelect;

export const insertWorkScheduleSchema = createInsertSchema(workSchedules).omit({
  id: true,
  createdAt: true,
});
export type InsertWorkSchedule = z.infer<typeof insertWorkScheduleSchema>;
export type WorkSchedule = typeof workSchedules.$inferSelect;

export const insertAuthPolicySchema = createInsertSchema(authPolicies).omit({
  id: true,
  createdAt: true,
});
export type InsertAuthPolicy = z.infer<typeof insertAuthPolicySchema>;
export type AuthPolicy = typeof authPolicies.$inferSelect;

// =========================================
// RBAC + AREA LOCKING SYSTEM
// =========================================

export const rbacRoles = pgTable("rbac_roles", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 64 }).notNull().unique(), // e.g. "driver_reg", "support", "finance"
  label: varchar("label", { length: 120 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rbacUserRoles = pgTable("rbac_user_roles", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id).notNull(),
  roleId: varchar("role_id", { length: 36 }).references(() => rbacRoles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rbacWorkAreas = pgTable("rbac_work_areas", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 64 }).notNull().unique(), // e.g. "driver_registration", "customer_support"
  label: varchar("label", { length: 120 }).notNull(),
  lockedByUserId: varchar("locked_by_user_id", { length: 36 }).references(() => users.id),
  lockExpiresAt: timestamp("lock_expires_at"),
  isLocked: boolean("is_locked").default(false),
  lastGoodSnapshot: jsonb("last_good_snapshot"),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rbacPermissions = pgTable("rbac_permissions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 64 }).notNull().unique(), // e.g. "area:driver_registration", "payout:approve"
  label: varchar("label", { length: 160 }).notNull(),
});

export const rbacRolePermissions = pgTable("rbac_role_permissions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  roleId: varchar("role_id", { length: 36 }).references(() => rbacRoles.id).notNull(),
  permissionCode: varchar("permission_code", { length: 64 }).notNull(),
});

export const rbacAuditLogs = pgTable("rbac_audit_logs", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  action: varchar("action", { length: 96 }).notNull(), // "AREA_ACQUIRE" | "AREA_RELEASE" | "RESET_OVERRIDE"
  areaCode: varchar("area_code", { length: 64 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rbacPayouts = pgTable("rbac_payouts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  driverUserId: varchar("driver_user_id", { length: 36 }).references(() => users.id).notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: varchar("currency", { length: 8 }).default("JMD"),
  status: varchar("status", { length: 24 }).notNull().default("pending"), // pending|approved|paid|rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RBAC Insert Schemas
export const insertRbacRoleSchema = createInsertSchema(rbacRoles);
export const insertRbacUserRoleSchema = createInsertSchema(rbacUserRoles);
export const insertRbacWorkAreaSchema = createInsertSchema(rbacWorkAreas);
export const insertRbacPermissionSchema = createInsertSchema(rbacPermissions);
export const insertRbacRolePermissionSchema = createInsertSchema(rbacRolePermissions);
export const insertRbacAuditLogSchema = createInsertSchema(rbacAuditLogs);
export const insertRbacPayoutSchema = createInsertSchema(rbacPayouts);

// RBAC Types
export type RbacRole = typeof rbacRoles.$inferSelect;
export type InsertRbacRole = z.infer<typeof insertRbacRoleSchema>;
export type RbacUserRole = typeof rbacUserRoles.$inferSelect;
export type InsertRbacUserRole = z.infer<typeof insertRbacUserRoleSchema>;
export type RbacWorkArea = typeof rbacWorkAreas.$inferSelect;
export type InsertRbacWorkArea = z.infer<typeof insertRbacWorkAreaSchema>;
export type RbacPermission = typeof rbacPermissions.$inferSelect;
export type InsertRbacPermission = z.infer<typeof insertRbacPermissionSchema>;
export type RbacRolePermission = typeof rbacRolePermissions.$inferSelect;
export type InsertRbacRolePermission = z.infer<typeof insertRbacRolePermissionSchema>;
export type RbacAuditLog = typeof rbacAuditLogs.$inferSelect;
export type InsertRbacAuditLog = z.infer<typeof insertRbacAuditLogSchema>;
export type RbacPayout = typeof rbacPayouts.$inferSelect;
export type InsertRbacPayout = z.infer<typeof insertRbacPayoutSchema>;

// =========================================
// UNIVERSAL DELIVERY NETWORK SYSTEM
// =========================================

export const deliveryPersonnel = pgTable("delivery_personnel", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id).notNull(),
  deliveryTypes: jsonb("delivery_types").notNull(), // ['gas', 'food', 'packages', 'pharmacy', 'grocery']
  vehicleType: varchar("vehicle_type").notNull(), // 'motorcycle', 'car', 'truck', 'bicycle', 'van'
  licenseNumber: varchar("license_number"),
  vehiclePlateNumber: varchar("vehicle_plate_number"),
  phoneNumber: varchar("phone_number").notNull(),
  emergencyContact: varchar("emergency_contact"),
  bankAccountNumber: varchar("bank_account_number"),
  routingNumber: varchar("routing_number"),
  preferredAreas: jsonb("preferred_areas"), // Array of area codes
  isActive: boolean("is_active").default(true),
  isOnline: boolean("is_online").default(false),
  currentLat: decimal("current_lat", { precision: 10, scale: 7 }),
  currentLng: decimal("current_lng", { precision: 10, scale: 7 }),
  totalDeliveries: integer("total_deliveries").default(0),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default('0.00'),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('5.00'),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const deliveryOrders = pgTable("delivery_orders", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number").unique().notNull(),
  customerId: varchar("customer_id", { length: 36 }).references(() => users.id).notNull(),
  deliveryPersonnelId: varchar("delivery_personnel_id", { length: 36 }).references(() => deliveryPersonnel.id),
  deliveryType: varchar("delivery_type").notNull(), // 'gas', 'food', 'packages', 'pharmacy', 'grocery'
  
  // Pickup Information
  pickupAddress: text("pickup_address").notNull(),
  pickupLat: decimal("pickup_lat", { precision: 10, scale: 7 }).notNull(),
  pickupLng: decimal("pickup_lng", { precision: 10, scale: 7 }).notNull(),
  pickupContactName: varchar("pickup_contact_name"),
  pickupContactPhone: varchar("pickup_contact_phone"),
  pickupInstructions: text("pickup_instructions"),
  
  // Delivery Information
  deliveryAddress: text("delivery_address").notNull(),
  deliveryLat: decimal("delivery_lat", { precision: 10, scale: 7 }).notNull(),
  deliveryLng: decimal("delivery_lng", { precision: 10, scale: 7 }).notNull(),
  deliveryContactName: varchar("delivery_contact_name").notNull(),
  deliveryContactPhone: varchar("delivery_contact_phone").notNull(),
  deliveryInstructions: text("delivery_instructions"),
  
  // Order Details
  items: jsonb("items").notNull(), // Array of items being delivered
  totalValue: decimal("total_value", { precision: 12, scale: 2 }),
  deliveryFee: decimal("delivery_fee", { precision: 8, scale: 2 }).notNull(),
  tip: decimal("tip", { precision: 8, scale: 2 }).default('0.00'),
  priority: varchar("priority").default('normal'), // 'low', 'normal', 'high', 'urgent'
  
  // Status and Timing
  status: varchar("status").notNull().default('pending'), // 'pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'
  scheduledPickupTime: timestamp("scheduled_pickup_time"),
  scheduledDeliveryTime: timestamp("scheduled_delivery_time"),
  acceptedAt: timestamp("accepted_at"),
  pickedUpAt: timestamp("picked_up_at"),
  deliveredAt: timestamp("delivered_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  
  // Payment
  paymentStatus: varchar("payment_status").default('pending'), // 'pending', 'paid', 'failed', 'refunded'
  paymentMethod: varchar("payment_method"), // 'cash', 'card', 'mobile_money', 'wallet'
  customerRating: integer("customer_rating"), // 1-5
  customerFeedback: text("customer_feedback"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const deliveryRoutes = pgTable("delivery_routes", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  deliveryPersonnelId: varchar("delivery_personnel_id", { length: 36 }).references(() => deliveryPersonnel.id).notNull(),
  orderId: varchar("order_id", { length: 36 }).references(() => deliveryOrders.id).notNull(),
  routeData: jsonb("route_data"), // GPS route coordinates and waypoints
  estimatedDistance: decimal("estimated_distance", { precision: 8, scale: 2 }), // in kilometers
  estimatedDuration: integer("estimated_duration"), // in minutes
  actualDistance: decimal("actual_distance", { precision: 8, scale: 2 }),
  actualDuration: integer("actual_duration"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  trackingPoints: jsonb("tracking_points"), // Real-time GPS tracking data
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveryEarnings = pgTable("delivery_earnings", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  deliveryPersonnelId: varchar("delivery_personnel_id", { length: 36 }).references(() => deliveryPersonnel.id).notNull(),
  orderId: varchar("order_id", { length: 36 }).references(() => deliveryOrders.id).notNull(),
  baseEarning: decimal("base_earning", { precision: 8, scale: 2 }).notNull(),
  distanceBonus: decimal("distance_bonus", { precision: 8, scale: 2 }).default('0.00'),
  timeBonus: decimal("time_bonus", { precision: 8, scale: 2 }).default('0.00'),
  tipEarning: decimal("tip_earning", { precision: 8, scale: 2 }).default('0.00'),
  priorityBonus: decimal("priority_bonus", { precision: 8, scale: 2 }).default('0.00'),
  totalEarning: decimal("total_earning", { precision: 8, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 8, scale: 2 }).default('0.00'),
  netEarning: decimal("net_earning", { precision: 8, scale: 2 }).notNull(), // Total - Platform Fee
  payoutStatus: varchar("payout_status").default('pending'), // 'pending', 'processing', 'paid', 'failed'
  paidAt: timestamp("paid_at"),
  earnedAt: timestamp("earned_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveryCategories = pgTable("delivery_categories", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 50 }).unique().notNull(), // 'gas', 'food', 'packages'
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"), // Icon name or URL
  baseRate: decimal("base_rate", { precision: 8, scale: 2 }).notNull(), // Base rate per delivery
  ratePerKm: decimal("rate_per_km", { precision: 6, scale: 2 }).notNull(), // Additional rate per kilometer
  minFee: decimal("min_fee", { precision: 6, scale: 2 }).notNull(), // Minimum delivery fee
  maxFee: decimal("max_fee", { precision: 8, scale: 2 }), // Maximum delivery fee (optional)
  isActive: boolean("is_active").default(true),
  requiresSpecialHandling: boolean("requires_special_handling").default(false),
  allowedVehicleTypes: jsonb("allowed_vehicle_types"), // ['motorcycle', 'car', 'truck']
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const deliveryAreas = pgTable("delivery_areas", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 50 }).unique().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  boundaries: jsonb("boundaries").notNull(), // GeoJSON polygon defining the area
  isActive: boolean("is_active").default(true),
  deliveryFeeMultiplier: decimal("delivery_fee_multiplier", { precision: 3, scale: 2 }).default('1.00'),
  estimatedDeliveryTime: integer("estimated_delivery_time").default(30), // minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const deliveryReviews = pgTable("delivery_reviews", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id", { length: 36 }).references(() => deliveryOrders.id).notNull(),
  customerId: varchar("customer_id", { length: 36 }).references(() => users.id).notNull(),
  deliveryPersonnelId: varchar("delivery_personnel_id", { length: 36 }).references(() => deliveryPersonnel.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  reviewType: varchar("review_type").default('delivery'), // 'delivery', 'pickup', 'overall'
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==========================
// AUTONOMOUS OPS AGENT TABLES
// ==========================

// Freelancers/Workers table for unified payment tunnel
export const freelancers = pgTable("freelancers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  displayName: varchar("display_name").notNull(),
  skills: jsonb("skills"), // Array of skill strings
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default('0.00'),
  currency: varchar("currency", { length: 3 }).notNull().default('USD'),
  status: varchar("status").notNull().default('active'), // 'active', 'inactive', 'suspended'
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default('0.00'),
  lastPayoutAt: timestamp("last_payout_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced wallet transactions for unified payment tunnel
export const walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role").notNull(), // 'driver', 'worker', 'customer', 'app'
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('USD'),
  type: varchar("type").notNull(), // 'deposit', 'withdrawal', 'commission', 'payout', 'refund'
  status: varchar("status").notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed'
  referenceId: varchar("reference_id"), // Links to ride, delivery, job, etc.
  referenceType: varchar("reference_type"), // 'ride', 'delivery', 'job', 'obligation'
  description: text("description"),
  metadata: jsonb("metadata"), // Additional transaction details
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vendors table for managing external entities
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // 'government', 'insurance', 'saas', 'contractor', 'utility'
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  website: varchar("website"),
  accountNumber: varchar("account_number"),
  paymentMethod: varchar("payment_method"), // 'ach', 'wire', 'credit_card', 'check'
  paymentDetails: jsonb("payment_details"), // Encrypted payment information
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Obligations table for tracking taxes, fees, insurance
export const obligations = pgTable("obligations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").references(() => vendors.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('USD'),
  recurrence: varchar("recurrence"), // 'monthly', 'yearly', 'quarterly', 'one-time'
  nextDueAt: timestamp("next_due_at").notNull(),
  lastPaidAt: timestamp("last_paid_at"),
  priority: varchar("priority").notNull().default('medium'), // 'critical', 'high', 'medium', 'low'
  autopay: boolean("autopay").default(false),
  category: varchar("category"), // 'tax', 'insurance', 'license', 'subscription', 'regulatory'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks table for autonomous operations
export const autonomousTasks = pgTable("autonomous_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  obligationId: varchar("obligation_id").references(() => obligations.id),
  kind: varchar("kind").notNull(), // 'payment', 'renewal', 'filing', 'notification', 'compliance'
  title: varchar("title").notNull(),
  description: text("description"),
  dueAt: timestamp("due_at").notNull(),
  status: varchar("status").notNull().default('pending'), // 'pending', 'in_progress', 'completed', 'failed', 'cancelled'
  priority: varchar("priority").notNull().default('medium'),
  requiresApproval: boolean("requires_approval").default(false),
  autoExecute: boolean("auto_execute").default(false),
  executedAt: timestamp("executed_at"),
  executedBy: varchar("executed_by"), // 'system', 'ceo', user_id
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  lastError: text("last_error"),
  metadata: jsonb("metadata"),
  createdBy: varchar("created_by").notNull().default('system'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Approvals table for CEO/admin approval workflow
export const approvals = pgTable("approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => autonomousTasks.id).notNull(),
  requiredRole: varchar("required_role").notNull(), // 'ceo', 'cfo', 'admin'
  status: varchar("status").notNull().default('pending'), // 'pending', 'approved', 'rejected', 'expired'
  actorId: varchar("actor_id").references(() => users.id),
  comments: text("comments"),
  approvedAt: timestamp("approved_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payments table for tracking all platform payments
export const platformPayments = pgTable("platform_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => autonomousTasks.id),
  vendorId: varchar("vendor_id").references(() => vendors.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('USD'),
  method: varchar("method").notNull(), // 'stripe', 'ach', 'wire', 'crypto', 'manual'
  status: varchar("status").notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed', 'reversed'
  externalRef: varchar("external_ref"), // Stripe payment ID, bank reference, etc.
  processedAt: timestamp("processed_at"),
  failureReason: text("failure_reason"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// CEO Dashboard metrics table
export const ceoDashboardMetrics = pgTable("ceo_dashboard_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: varchar("metric_type").notNull(), // 'revenue', 'expenses', 'compliance', 'efficiency'
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  unit: varchar("unit"), // 'USD', 'percentage', 'count'
  period: varchar("period").notNull(), // 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Autonomous agent logs for monitoring
export const agentLogs = pgTable("agent_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentType: varchar("agent_type").notNull(), // 'payment', 'compliance', 'scheduler', 'monitor'
  action: varchar("action").notNull(),
  status: varchar("status").notNull(), // 'success', 'failure', 'warning'
  message: text("message"),
  taskId: varchar("task_id").references(() => autonomousTasks.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Universal Delivery Insert Schemas
export const insertDeliveryPersonnelSchema = createInsertSchema(deliveryPersonnel).omit({
  id: true,
  totalDeliveries: true,
  totalEarnings: true,
  rating: true,
  joinedAt: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeliveryOrderSchema = createInsertSchema(deliveryOrders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeliveryRouteSchema = createInsertSchema(deliveryRoutes).omit({
  id: true,
  createdAt: true,
});

export const insertDeliveryEarningSchema = createInsertSchema(deliveryEarnings).omit({
  id: true,
  earnedAt: true,
  createdAt: true,
});

export const insertDeliveryCategorySchema = createInsertSchema(deliveryCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeliveryAreaSchema = createInsertSchema(deliveryAreas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeliveryReviewSchema = createInsertSchema(deliveryReviews).omit({
  id: true,
  createdAt: true,
});

// Universal Delivery Types
export type DeliveryPersonnel = typeof deliveryPersonnel.$inferSelect;
export type InsertDeliveryPersonnel = z.infer<typeof insertDeliveryPersonnelSchema>;
export type DeliveryOrder = typeof deliveryOrders.$inferSelect;
export type InsertDeliveryOrder = z.infer<typeof insertDeliveryOrderSchema>;
export type DeliveryRoute = typeof deliveryRoutes.$inferSelect;
export type InsertDeliveryRoute = z.infer<typeof insertDeliveryRouteSchema>;
export type DeliveryEarning = typeof deliveryEarnings.$inferSelect;
export type InsertDeliveryEarning = z.infer<typeof insertDeliveryEarningSchema>;
export type DeliveryCategory = typeof deliveryCategories.$inferSelect;
export type InsertDeliveryCategory = z.infer<typeof insertDeliveryCategorySchema>;
export type DeliveryArea = typeof deliveryAreas.$inferSelect;
export type InsertDeliveryArea = z.infer<typeof insertDeliveryAreaSchema>;
export type DeliveryReview = typeof deliveryReviews.$inferSelect;
export type InsertDeliveryReview = z.infer<typeof insertDeliveryReviewSchema>;

// ==========================
// ========== VEHICLE REGISTRATION SYSTEM FOR DELAWARE INSURANCE ==========
// Complete vehicle registration workflow for insurance business

export const vehicleOwners = pgTable("vehicle_owners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id), // Link to authenticated user
  fullName: varchar("full_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  trn: varchar("trn"), // Jamaica TRN
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const registrationVehicles = pgTable("registration_vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => vehicleOwners.id),
  vin: varchar("vin").notNull(), // VIN/Chassis
  engineNo: varchar("engine_no").notNull(),
  make: varchar("make").notNull(),
  model: varchar("model").notNull(),
  year: integer("year").notNull(),
  color: varchar("color"),
  plateNumber: varchar("plate_number"), // assigned once approved
  plateType: varchar("plate_type"), // 'red' | 'white' | 'ppv' | 'commercial'
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vehicleDocuments = pgTable("vehicle_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull().references(() => registrationVehicles.id),
  type: varchar("type").notNull(), // 'purchase_receipt'|'id'|'fitness'|'registration'|'insurance'|'customs'
  title: varchar("title"),
  url: text("url").notNull(), // S3/GCS link
  verified: boolean("verified").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insurancePolicies = pgTable("insurance_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull().references(() => registrationVehicles.id),
  insurer: varchar("insurer").notNull(), // Sagicor, GK, Advantage General, YaadFlex Insurance
  policyNumber: varchar("policy_number").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  coverage: text("coverage"), // JSON/string summary
  monthlyPremium: decimal("monthly_premium", { precision: 10, scale: 2 }),
  isValid: boolean("is_valid").default(true),
  managedByYaadFlex: boolean("managed_by_yaad_flex").default(false), // Your Delaware insurance
  createdAt: timestamp("created_at").defaultNow(),
});

export const vehicleInspections = pgTable("vehicle_inspections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull().references(() => registrationVehicles.id),
  inspectorName: varchar("inspector_name"),
  station: varchar("station"),
  passed: boolean("passed").default(false),
  reportUrl: text("report_url"),
  conditionScore: integer("condition_score"), // 0-100 from AI evaluation
  evaluatorId: varchar("evaluator_id").references(() => users.id), // YaadFlex evaluator
  evaluatorNotes: text("evaluator_notes"),
  photos: jsonb("photos"), // Array of photo URLs
  inspectedAt: timestamp("inspected_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const registrationApplications = pgTable("registration_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull().references(() => registrationVehicles.id),
  ownerId: varchar("owner_id").notNull().references(() => vehicleOwners.id),
  desiredPlateType: varchar("desired_plate_type").notNull(), // 'red'|'white'|'ppv'|'commercial'
  status: varchar("status").notNull().default("draft"), // 'draft'|'submitted'|'pending_verification'|'approved'|'rejected'|'issued'
  insuranceProvider: varchar("insurance_provider"), // Which insurance covering
  estimatedValue: decimal("estimated_value", { precision: 12, scale: 2 }), // AI valuation
  approvedBy: varchar("approved_by").references(() => users.id), // Delaware admin
  remarks: text("remarks"),
  submittedAt: timestamp("submitted_at"),
  decidedAt: timestamp("decided_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const registrationPayments = pgTable("registration_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => registrationApplications.id),
  provider: varchar("provider").notNull(), // 'stripe'
  providerIntentId: varchar("provider_intent_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("USD"),
  status: varchar("status").default("pending"), // 'pending'|'succeeded'|'failed'|'refunded'
  paymentType: varchar("payment_type").notNull(), // 'registration_fee'|'inspection_fee'|'insurance_premium'
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== BROKER NETWORK SYSTEM FOR REGISTRATION SERVICES ==========
// Complete broker network for handling TAJ paperwork and physical registration tasks

export const brokers = pgTable("brokers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: varchar("full_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  govId: varchar("gov_id"), // TRN or national ID  
  verified: boolean("verified").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const brokerRegions = pgTable("broker_regions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brokerId: varchar("broker_id").notNull().references(() => brokers.id),
  parish: varchar("parish").notNull(), // "Kingston", "St. Andrew", etc
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const regServiceCatalog = pgTable("reg_service_catalog", {
  code: varchar("code").primaryKey(), // 'NEW_REG', 'RENEWAL', 'TRANSFER', 'RED_PLATE', 'REPLACEMENT'
  name: varchar("name").notNull(),
  baseFeeJMD: integer("base_fee_jmd").notNull(), // YardFlex service fee
  estGovFeeJMD: integer("est_gov_fee_jmd").default(0), // TAJ/Transport Authority fees (informational)
  slaHours: integer("sla_hours").default(72),
  active: boolean("active").default(true),
});

export const regRequests = pgTable("reg_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => registrationApplications.id),
  ownerId: varchar("owner_id").notNull().references(() => vehicleOwners.id),
  vehicleId: varchar("vehicle_id").notNull().references(() => registrationVehicles.id),
  serviceCode: varchar("service_code").notNull().references(() => regServiceCatalog.code),
  parish: varchar("parish").notNull(),
  pickupAddress: text("pickup_address"),
  deliveryAddress: text("delivery_address"),
  notes: text("notes"),
  quotedFeeJMD: integer("quoted_fee_jmd"),
  govFeeJMD: integer("gov_fee_jmd"),
  status: varchar("status").default("pending_quote"), // 'pending_quote'|'pending_payment'|'assigned'|'in_progress'|'delivered'|'completed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const regEvents = pgTable("reg_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => regRequests.id),
  type: varchar("type").notNull(), // 'QUOTE_CREATED','ASSIGNED','PICKED_UP','SUBMITTED_TAJ','APPROVED','REJECTED','DELIVERED'
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const regAssignments = pgTable("reg_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => regRequests.id),
  brokerId: varchar("broker_id").notNull().references(() => brokers.id),
  status: varchar("status").default("assigned"), // 'assigned'|'in_progress'|'completed'|'cancelled'
  pickupAt: timestamp("pickup_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const regPayouts = pgTable("reg_payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brokerId: varchar("broker_id").notNull().references(() => brokers.id),
  requestId: varchar("request_id").notNull().references(() => regRequests.id),
  amountJMD: integer("amount_jmd").notNull(),
  status: varchar("status").default("pending"), // 'pending'|'paid'|'failed'
  provider: varchar("provider").default("stripe_connect"),
  providerPayoutId: varchar("provider_payout_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const regSLA = pgTable("reg_sla", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => regRequests.id),
  startAt: timestamp("start_at").defaultNow(),
  dueAt: timestamp("due_at"),
  breached: boolean("breached").default(false),
});

// ========== YAADFLEX CREDITS DIGITAL TOP-UP SYSTEM ==========
// Complete cashless payment system for rides, deliveries, and services

export const creditWallets = pgTable("credit_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(), // Links to auth system
  balanceJMD: decimal("balance_jmd", { precision: 10, scale: 2 }).notNull().default("0.00"),
  bonusCreditsJMD: decimal("bonus_credits_jmd", { precision: 10, scale: 2 }).default("0.00"),
  totalTopUps: decimal("total_top_ups", { precision: 12, scale: 2 }).default("0.00"),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const creditTopUps = pgTable("credit_top_ups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").notNull().references(() => creditWallets.id),
  amountJMD: decimal("amount_jmd", { precision: 10, scale: 2 }).notNull(),
  bonusJMD: decimal("bonus_jmd", { precision: 10, scale: 2 }).default("0.00"),
  paymentMethod: varchar("payment_method").notNull(), // 'link_wallet'|'visa'|'mastercard'|'ncb'|'scotia'|'jn'|'digicel'|'flow'
  providerRefId: varchar("provider_ref_id"), // External payment provider reference
  status: varchar("status").default("pending"), // 'pending'|'processing'|'completed'|'failed'|'refunded'
  meta: jsonb("meta"), // Payment provider response data
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const creditTransactions = pgTable("credit_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").notNull().references(() => creditWallets.id),
  type: varchar("type").notNull(), // 'top_up'|'ride_payment'|'delivery_payment'|'service_payment'|'refund'|'bonus'|'transfer_in'|'transfer_out'
  amountJMD: decimal("amount_jmd", { precision: 10, scale: 2 }).notNull(),
  balanceBeforeJMD: decimal("balance_before_jmd", { precision: 10, scale: 2 }).notNull(),
  balanceAfterJMD: decimal("balance_after_jmd", { precision: 10, scale: 2 }).notNull(),
  referenceType: varchar("reference_type"), // 'ride'|'delivery'|'top_up'|'payout'|'transfer'
  referenceId: varchar("reference_id"), // ID of related ride/delivery/top-up
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const driverPayouts = pgTable("driver_payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull(), // Driver user ID
  amountJMD: decimal("amount_jmd", { precision: 10, scale: 2 }).notNull(),
  method: varchar("method").notNull(), // 'link_wallet'|'bank_transfer'
  bankAccount: varchar("bank_account"), // Encrypted bank details if bank transfer
  status: varchar("status").default("pending"), // 'pending'|'processing'|'completed'|'failed'
  providerRefId: varchar("provider_ref_id"),
  processedAt: timestamp("processed_at"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const creditPromotions = pgTable("credit_promotions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code").notNull().unique(), // 'TOPUP2000'
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // 'top_up_bonus'|'first_ride'|'referral'
  minTopUpJMD: decimal("min_top_up_jmd", { precision: 10, scale: 2 }),
  bonusAmountJMD: decimal("bonus_amount_jmd", { precision: 10, scale: 2 }),
  bonusPercent: integer("bonus_percent"), // Alternative to fixed amount
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until"),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const creditTransfers = pgTable("credit_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromWalletId: varchar("from_wallet_id").notNull().references(() => creditWallets.id),
  toWalletId: varchar("to_wallet_id").notNull().references(() => creditWallets.id),
  amountJMD: decimal("amount_jmd", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason"),
  status: varchar("status").default("completed"), // 'pending'|'completed'|'reversed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const paymentMethodConfigs = pgTable("payment_method_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  method: varchar("method").notNull().unique(), // 'link_wallet'|'ncb'|'scotia'|etc
  displayName: varchar("display_name").notNull(),
  provider: varchar("provider"), // 'stripe'|'link'|'ncb_api'|etc
  isActive: boolean("is_active").default(true),
  minAmountJMD: decimal("min_amount_jmd", { precision: 10, scale: 2 }).default("100"),
  maxAmountJMD: decimal("max_amount_jmd", { precision: 10, scale: 2 }).default("50000"),
  processingTimeHours: integer("processing_time_hours").default(0), // 0 for instant
  fees: jsonb("fees"), // Fee structure
  config: jsonb("config"), // Provider-specific config
  createdAt: timestamp("created_at").defaultNow(),
});

// AUTONOMOUS OPS AGENT TYPES
// ==========================

// Insert Schemas
export const insertFreelancerSchema = createInsertSchema(freelancers).omit({
  id: true,
  totalEarnings: true,
  lastPayoutAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({
  id: true,
  processedAt: true,
  createdAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertObligationSchema = createInsertSchema(obligations).omit({
  id: true,
  lastPaidAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAutonomousTaskSchema = createInsertSchema(autonomousTasks).omit({
  id: true,
  executedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApprovalSchema = createInsertSchema(approvals).omit({
  id: true,
  approvedAt: true,
  createdAt: true,
});

export const insertPlatformPaymentSchema = createInsertSchema(platformPayments).omit({
  id: true,
  processedAt: true,
  createdAt: true,
});

export const insertCeoDashboardMetricSchema = createInsertSchema(ceoDashboardMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertAgentLogSchema = createInsertSchema(agentLogs).omit({
  id: true,
  createdAt: true,
});

// Vehicle Registration Insert Schemas
export const insertVehicleOwnerSchema = createInsertSchema(vehicleOwners).omit({
  id: true,
  createdAt: true,
});

export const insertRegistrationVehicleSchema = createInsertSchema(registrationVehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVehicleDocumentSchema = createInsertSchema(vehicleDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertInsurancePolicySchema = createInsertSchema(insurancePolicies).omit({
  id: true,
  createdAt: true,
});

export const insertVehicleInspectionSchema = createInsertSchema(vehicleInspections).omit({
  id: true,
  createdAt: true,
});

export const insertRegistrationApplicationSchema = createInsertSchema(registrationApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRegistrationPaymentSchema = createInsertSchema(registrationPayments).omit({
  id: true,
  createdAt: true,
});

// Broker Network Insert Schemas
export const insertBrokerSchema = createInsertSchema(brokers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBrokerRegionSchema = createInsertSchema(brokerRegions).omit({
  id: true,
  createdAt: true,
});

export const insertRegServiceCatalogSchema = createInsertSchema(regServiceCatalog);

// Allow ownerId in validation but server will override it
export const insertRegRequestSchema = createInsertSchema(regRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRegEventSchema = createInsertSchema(regEvents).omit({
  id: true,
  createdAt: true,
});

export const insertRegAssignmentSchema = createInsertSchema(regAssignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRegPayoutSchema = createInsertSchema(regPayouts).omit({
  id: true,
  createdAt: true,
});

export const insertRegSLASchema = createInsertSchema(regSLA).omit({
  id: true,
});

// YaadFlex Credits Insert Schemas
export const insertCreditWalletSchema = createInsertSchema(creditWallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCreditTopUpSchema = createInsertSchema(creditTopUps).omit({
  id: true,
  createdAt: true,
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertDriverPayoutSchema = createInsertSchema(driverPayouts).omit({
  id: true,
  createdAt: true,
});

export const insertCreditPromotionSchema = createInsertSchema(creditPromotions).omit({
  id: true,
  createdAt: true,
  currentUses: true,
});

export const insertCreditTransferSchema = createInsertSchema(creditTransfers).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentMethodConfigSchema = createInsertSchema(paymentMethodConfigs).omit({
  id: true,
  createdAt: true,
});

// Select Types
export type Freelancer = typeof freelancers.$inferSelect;
export type InsertFreelancer = z.infer<typeof insertFreelancerSchema>;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Obligation = typeof obligations.$inferSelect;
export type InsertObligation = z.infer<typeof insertObligationSchema>;
export type AutonomousTask = typeof autonomousTasks.$inferSelect;
export type InsertAutonomousTask = z.infer<typeof insertAutonomousTaskSchema>;
export type Approval = typeof approvals.$inferSelect;
export type InsertApproval = z.infer<typeof insertApprovalSchema>;
export type PlatformPayment = typeof platformPayments.$inferSelect;
export type InsertPlatformPayment = z.infer<typeof insertPlatformPaymentSchema>;
export type CeoDashboardMetric = typeof ceoDashboardMetrics.$inferSelect;
export type InsertCeoDashboardMetric = z.infer<typeof insertCeoDashboardMetricSchema>;
export type AgentLog = typeof agentLogs.$inferSelect;
export type InsertAgentLog = z.infer<typeof insertAgentLogSchema>;

// Vehicle Registration Types
export type VehicleOwner = typeof vehicleOwners.$inferSelect;
export type InsertVehicleOwner = z.infer<typeof insertVehicleOwnerSchema>;
export type RegistrationVehicle = typeof registrationVehicles.$inferSelect;
export type InsertRegistrationVehicle = z.infer<typeof insertRegistrationVehicleSchema>;
export type VehicleDocument = typeof vehicleDocuments.$inferSelect;
export type InsertVehicleDocument = z.infer<typeof insertVehicleDocumentSchema>;
export type InsurancePolicy = typeof insurancePolicies.$inferSelect;
export type InsertInsurancePolicy = z.infer<typeof insertInsurancePolicySchema>;
export type VehicleInspection = typeof vehicleInspections.$inferSelect;
export type InsertVehicleInspection = z.infer<typeof insertVehicleInspectionSchema>;
export type RegistrationApplication = typeof registrationApplications.$inferSelect;
export type InsertRegistrationApplication = z.infer<typeof insertRegistrationApplicationSchema>;
export type RegistrationPayment = typeof registrationPayments.$inferSelect;
export type InsertRegistrationPayment = z.infer<typeof insertRegistrationPaymentSchema>;

// Broker Network Types
export type Broker = typeof brokers.$inferSelect;
export type InsertBroker = z.infer<typeof insertBrokerSchema>;
export type BrokerRegion = typeof brokerRegions.$inferSelect;
export type InsertBrokerRegion = z.infer<typeof insertBrokerRegionSchema>;
export type RegServiceCatalog = typeof regServiceCatalog.$inferSelect;
export type InsertRegServiceCatalog = z.infer<typeof insertRegServiceCatalogSchema>;
export type RegRequest = typeof regRequests.$inferSelect;
export type InsertRegRequest = z.infer<typeof insertRegRequestSchema>;
export type RegEvent = typeof regEvents.$inferSelect;
export type InsertRegEvent = z.infer<typeof insertRegEventSchema>;
export type RegAssignment = typeof regAssignments.$inferSelect;
export type InsertRegAssignment = z.infer<typeof insertRegAssignmentSchema>;
export type RegPayout = typeof regPayouts.$inferSelect;
export type InsertRegPayout = z.infer<typeof insertRegPayoutSchema>;
export type RegSLA = typeof regSLA.$inferSelect;
export type InsertRegSLA = z.infer<typeof insertRegSLASchema>;

// YaadFlex Credits Types
export type CreditWallet = typeof creditWallets.$inferSelect;
export type InsertCreditWallet = z.infer<typeof insertCreditWalletSchema>;
export type CreditTopUp = typeof creditTopUps.$inferSelect;
export type InsertCreditTopUp = z.infer<typeof insertCreditTopUpSchema>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
export type DriverPayout = typeof driverPayouts.$inferSelect;
export type InsertDriverPayout = z.infer<typeof insertDriverPayoutSchema>;
export type CreditPromotion = typeof creditPromotions.$inferSelect;
export type InsertCreditPromotion = z.infer<typeof insertCreditPromotionSchema>;
export type CreditTransfer = typeof creditTransfers.$inferSelect;
export type InsertCreditTransfer = z.infer<typeof insertCreditTransferSchema>;
export type PaymentMethodConfig = typeof paymentMethodConfigs.$inferSelect;
export type InsertPaymentMethodConfig = z.infer<typeof insertPaymentMethodConfigSchema>;

// =============================================================
// YAADFLEX LUXURY CLOTHING LINE TYPES & SCHEMAS
// =============================================================

// YaadFlex Product Categories Types
export type YaadFlexCategory = typeof yaadflexCategories.$inferSelect;
export type InsertYaadFlexCategory = typeof yaadflexCategories.$inferInsert;

// YaadFlex Products Types
export type YaadFlexProduct = typeof yaadflexProducts.$inferSelect;
export type InsertYaadFlexProduct = typeof yaadflexProducts.$inferInsert;

// YaadFlex Suppliers Types
export type YaadFlexSupplier = typeof yaadflexSuppliers.$inferSelect;
export type InsertYaadFlexSupplier = typeof yaadflexSuppliers.$inferInsert;

// YaadFlex Orders Types
export type YaadFlexOrder = typeof yaadflexOrders.$inferSelect;
export type InsertYaadFlexOrder = typeof yaadflexOrders.$inferInsert;

// YaadFlex Order Items Types
export type YaadFlexOrderItem = typeof yaadflexOrderItems.$inferSelect;
export type InsertYaadFlexOrderItem = typeof yaadflexOrderItems.$inferInsert;

// YaadFlex Product Reviews Types
export type YaadFlexProductReview = typeof yaadflexProductReviews.$inferSelect;
export type InsertYaadFlexProductReview = typeof yaadflexProductReviews.$inferInsert;

// YaadFlex Clothing Line Zod Schemas
export const insertYaadFlexCategorySchema = createInsertSchema(yaadflexCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertYaadFlexProductSchema = createInsertSchema(yaadflexProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertYaadFlexSupplierSchema = createInsertSchema(yaadflexSuppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertYaadFlexOrderSchema = createInsertSchema(yaadflexOrders).omit({
  id: true,
  orderDate: true,
  createdAt: true,
  updatedAt: true,
});

export const insertYaadFlexOrderItemSchema = createInsertSchema(yaadflexOrderItems).omit({
  id: true,
  createdAt: true,
});

export const insertYaadFlexProductReviewSchema = createInsertSchema(yaadflexProductReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// =============================================================
// YAADFLEX PAY - MOBILE MONEY SYSTEM (PRODUCTION READY)
// Your own M-Pesa style payment system with real security
// =============================================================

// YaadFlex Pay User Accounts - Mobile Money Registration
export const yaadflexPayUsers = pgTable("yaadflex_pay_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: varchar("phone").notNull().unique(), // Formatted phone number
  pin: varchar("pin").notNull(), // Encrypted PIN (use bcrypt in production)
  pinSalt: varchar("pin_salt").notNull(), // Salt for PIN encryption
  preferredBank: varchar("preferred_bank").notNull(), // 'JN_BANK', 'VM_BANK', 'NCB', 'SCOTIA'
  bankAccount: varchar("bank_account"), // Optional linked bank account
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  kycStatus: varchar("kyc_status").default('pending'), // 'pending', 'verified', 'rejected'
  securityLevel: varchar("security_level").default('standard'), // 'standard', 'enhanced'
  dailyLimit: decimal("daily_limit", { precision: 10, scale: 2 }).default('100000.00'), // J$100K default
  monthlyLimit: decimal("monthly_limit", { precision: 10, scale: 2 }).default('500000.00'), // J$500K default
  failedPinAttempts: integer("failed_pin_attempts").default(0),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// YaadFlex Pay Wallets - Mobile Money Balances
export const yaadflexPayWallets = pgTable("yaadflex_pay_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => yaadflexPayUsers.id).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(), // 'JMD', 'USD'
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default('0.00'),
  pendingBalance: decimal("pending_balance", { precision: 12, scale: 2 }).default('0.00'),
  totalDeposited: decimal("total_deposited", { precision: 12, scale: 2 }).default('0.00'),
  totalWithdrawn: decimal("total_withdrawn", { precision: 12, scale: 2 }).default('0.00'),
  totalSent: decimal("total_sent", { precision: 12, scale: 2 }).default('0.00'),
  totalReceived: decimal("total_received", { precision: 12, scale: 2 }).default('0.00'),
  lastTransactionAt: timestamp("last_transaction_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_yf_pay_user_currency").on(table.userId, table.currency),
]);

// YaadFlex Pay Transactions - Mobile Money Activity
export const yaadflexPayTransactions = pgTable("yaadflex_pay_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull().unique(), // e.g., YF1758818245656
  type: varchar("type").notNull(), // 'SEND_MONEY', 'BUY_GOODS', 'DEPOSIT', 'WITHDRAW', 'BALANCE_CHECK', 'ATM_SEND', 'ATM_COLLECT'
  fromUserId: varchar("from_user_id").references(() => yaadflexPayUsers.id).notNull(),
  toUserId: varchar("to_user_id").references(() => yaadflexPayUsers.id), // For P2P transfers
  merchantCode: varchar("merchant_code"), // For merchant payments
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('JMD'),
  fee: decimal("fee", { precision: 8, scale: 2 }).notNull().default('0.00'),
  status: varchar("status").notNull().default('pending'), // 'pending', 'completed', 'failed', 'reversed'
  description: text("description").notNull(),
  reference: varchar("reference"), // Bank reference number
  bankTransactionId: varchar("bank_transaction_id"), // JN Bank/VM Bank transaction ID
  failureReason: text("failure_reason"), // If transaction fails
  ipAddress: varchar("ip_address"), // For security tracking
  
  // ATM Cash Collection Features
  collectionCode: varchar("collection_code"), // 6-digit code for ATM collection
  collectionCodeExpiry: timestamp("collection_code_expiry"), // When collection code expires
  senderPhoto: text("sender_photo"), // Base64 photo from sender for verification
  recipientPhone: varchar("recipient_phone"), // Phone number for SMS notification
  atmLocationId: varchar("atm_location_id"), // Which ATM was used for collection
  collectedAt: timestamp("collected_at"), // When cash was collected
  verificationRequired: boolean("verification_required").default(false), // Require photo verification
  deviceId: varchar("device_id"), // Device fingerprint
  location: varchar("location"), // Geographic location if available
  isReversible: boolean("is_reversible").default(true),
  reversedAt: timestamp("reversed_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_yf_pay_from_user").on(table.fromUserId),
  index("idx_yf_pay_to_user").on(table.toUserId),
  index("idx_yf_pay_status").on(table.status),
  index("idx_yf_pay_created").on(table.createdAt),
]);

// YaadFlex Pay Merchants - Businesses accepting YaadFlex Pay
export const yaadflexPayMerchants = pgTable("yaadflex_pay_merchants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  merchantCode: varchar("merchant_code").notNull().unique(), // e.g., YF-CLOTHING-001
  businessName: varchar("business_name").notNull(),
  contactPhone: varchar("contact_phone").notNull(),
  contactEmail: varchar("contact_email"),
  businessType: varchar("business_type").notNull(), // 'clothing', 'restaurant', 'gas_station', 'grocery'
  address: text("address"),
  isActive: boolean("is_active").default(true),
  feePercentage: decimal("fee_percentage", { precision: 5, scale: 2 }).default('1.50'), // 1.5% default
  dailyLimit: decimal("daily_limit", { precision: 12, scale: 2 }).default('1000000.00'), // J$1M
  totalTransactions: integer("total_transactions").default(0),
  totalVolume: decimal("total_volume", { precision: 14, scale: 2 }).default('0.00'),
  lastTransactionAt: timestamp("last_transaction_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// YaadFlex Pay Cards - Future Visa/Mastercard Integration via Stripe
export const yaadflexPayCards = pgTable("yaadflex_pay_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => yaadflexPayUsers.id).notNull(),
  cardType: varchar("card_type").notNull(), // 'debit', 'prepaid'
  cardBrand: varchar("card_brand").notNull(), // 'visa', 'mastercard'
  maskedNumber: varchar("masked_number").notNull(), // **** **** **** 1234
  stripeCardId: varchar("stripe_card_id"), // Stripe card issuing ID
  isActive: boolean("is_active").default(true),
  isBlocked: boolean("is_blocked").default(false),
  expiryMonth: integer("expiry_month").notNull(),
  expiryYear: integer("expiry_year").notNull(),
  spendingLimit: decimal("spending_limit", { precision: 10, scale: 2 }).default('50000.00'),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).default('0.00'),
  lastUsed: timestamp("last_used"),
  issuedAt: timestamp("issued_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// YaadFlex Pay Types & Schemas
export type YaadFlexPayUser = typeof yaadflexPayUsers.$inferSelect;
export type InsertYaadFlexPayUser = typeof yaadflexPayUsers.$inferInsert;
export type YaadFlexPayWallet = typeof yaadflexPayWallets.$inferSelect;
export type InsertYaadFlexPayWallet = typeof yaadflexPayWallets.$inferInsert;
export type YaadFlexPayTransaction = typeof yaadflexPayTransactions.$inferSelect;
export type InsertYaadFlexPayTransaction = typeof yaadflexPayTransactions.$inferInsert;
export type YaadFlexPayMerchant = typeof yaadflexPayMerchants.$inferSelect;
export type InsertYaadFlexPayMerchant = typeof yaadflexPayMerchants.$inferInsert;
export type YaadFlexPayCard = typeof yaadflexPayCards.$inferSelect;
export type InsertYaadFlexPayCard = typeof yaadflexPayCards.$inferInsert;

export const insertYaadFlexPayUserSchema = createInsertSchema(yaadflexPayUsers).omit({
  id: true,
  failedPinAttempts: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
});

export const insertYaadFlexPayTransactionSchema = createInsertSchema(yaadflexPayTransactions).omit({
  id: true,
  reversedAt: true,
  completedAt: true,
  createdAt: true,
});

export const insertYaadFlexPayMerchantSchema = createInsertSchema(yaadflexPayMerchants).omit({
  id: true,
  totalTransactions: true,
  totalVolume: true,
  lastTransactionAt: true,
  createdAt: true,
  updatedAt: true,
});

// LEGAL ACCEPTANCE VALIDATION SCHEMAS - CRITICAL FOR COMPLIANCE
export const legalAcceptanceSchema = z.object({
  agreedToTerms: z.boolean()
    .refine(val => val === true, { message: LEGAL_VALIDATION_MESSAGES.MISSING_TERMS }),
  agreedToPrivacy: z.boolean()
    .refine(val => val === true, { message: LEGAL_VALIDATION_MESSAGES.MISSING_PRIVACY }),
  agreedToUserAgreement: z.boolean()
    .refine(val => val === true, { message: LEGAL_VALIDATION_MESSAGES.MISSING_USER_AGREEMENT }).optional(),
});

export const driverLegalAcceptanceSchema = legalAcceptanceSchema.extend({
  agreedToDriverAgreement: z.boolean()
    .refine(val => val === true, { message: LEGAL_VALIDATION_MESSAGES.MISSING_DRIVER_AGREEMENT }),
});

export const businessLegalAcceptanceSchema = legalAcceptanceSchema.extend({
  agreedToBusinessAgreement: z.boolean()
    .refine(val => val === true, { message: LEGAL_VALIDATION_MESSAGES.MISSING_BUSINESS_AGREEMENT }),
});

// Legal acceptance update data for storage layer
export const userLegalAcceptanceUpdateSchema = z.object({
  termsAccepted: z.boolean().optional(),
  privacyAccepted: z.boolean().optional(), 
  userAgreementAccepted: z.boolean().optional(),
  driverAgreementAccepted: z.boolean().optional(),
  businessAgreementAccepted: z.boolean().optional(),
  legalAcceptedAt: z.date().optional(),
  termsVersion: z.string().optional(),
  privacyVersion: z.string().optional(),
  agreementVersion: z.string().optional(),
  ipAddressAtAcceptance: z.string().optional(),
  userAgentAtAcceptance: z.string().optional(),
});

export type UserLegalAcceptanceUpdate = z.infer<typeof userLegalAcceptanceUpdateSchema>;
