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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Financial transactions table for YardFlex
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // 'transfer', 'deposit', 'withdrawal'
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('USD'),
  recipientId: varchar("recipient_id").references(() => users.id),
  recipientPhone: varchar("recipient_phone"),
  status: varchar("status").notNull().default('pending'), // 'pending', 'completed', 'failed', 'cancelled'
  description: text("description"),
  securityLevel: varchar("security_level").notNull().default('standard'), // 'standard', 'enhanced', 'beast_mode'
  countryCode: varchar("country_code", { length: 2 }),
  isSecureTransfer: boolean("is_secure_transfer").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type InsertSecurityLog = typeof securityLogs.$inferInsert;
export type SecurityLog = typeof securityLogs.$inferSelect;

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  createdAt: true,
});
