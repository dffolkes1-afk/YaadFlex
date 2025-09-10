// shared/wallet-schema.ts
import {
  pgTable, varchar, text, boolean, integer, timestamp, decimal, jsonb, unique, primaryKey
} from "drizzle-orm/pg-core";

// Core identity (extends existing users table)
export const walletUsers = pgTable("wallet_users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 160 }).notNull(),
  displayName: varchar("display_name", { length: 120 }),
  role: varchar("role", { length: 24 }).default("customer"), // "driver" | "worker" | "merchant" | "admin"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
}, (t) => ({
  emailUnique: unique("wallet_users_email_unique").on(t.email)
}));

// One wallet per user (multi-currency)
export const wallets = pgTable("wallets", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Per-currency balance (JMD, USD, YFD)
export const walletBalances = pgTable("wallet_balances", {
  walletId: varchar("wallet_id", { length: 36 }).notNull(),
  currency: varchar("currency", { length: 8 }).notNull(), // "JMD" | "USD" | "YFD" (YaadFlex Dollar)
  amount: decimal("amount", { precision: 16, scale: 2 }).default("0.00"),
  updatedAt: timestamp("updated_at").defaultNow()
}, (t) => ({
  pk: primaryKey({ columns: [t.walletId, t.currency] })
}));

// Idempotency for safe transfers / deposits
export const idempotency = pgTable("idempotency", {
  key: varchar("key", { length: 64 }).primaryKey(),
  createdAt: timestamp("created_at").defaultNow()
});

// Transactions (double-entry modeled in a single row with references)
export const walletTx = pgTable("wallet_tx", {
  id: varchar("id", { length: 36 }).primaryKey(),
  type: varchar("type", { length: 24 }).notNull(), // "deposit" | "transfer" | "payout" | "refund" | "payment" | "ride_earnings"
  currency: varchar("currency", { length: 8 }).notNull(), // JMD/USD/YFD
  amount: decimal("amount", { precision: 16, scale: 2 }).notNull(),
  fee: decimal("fee", { precision: 12, scale: 2 }).default("0.00"),
  fromWalletId: varchar("from_wallet_id", { length: 36 }), // null for deposit
  toWalletId: varchar("to_wallet_id", { length: 36 }),     // null for cash-out
  externalRef: varchar("external_ref", { length: 128 }),  // processor ref / bank ref
  meta: jsonb("meta"),                                   // {rideId, jobId, orderId, note}
  status: varchar("status", { length: 16 }).default("pending"), // "pending" | "succeeded" | "failed"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Payment Requests (QR / links)
export const paymentRequests = pgTable("payment_requests", {
  id: varchar("id", { length: 36 }).primaryKey(),
  merchantWalletId: varchar("merchant_wallet_id", { length: 36 }).notNull(),
  currency: varchar("currency", { length: 8 }).notNull(),
  amount: decimal("amount", { precision: 16, scale: 2 }).notNull(),
  description: text("description"),
  expiresAt: timestamp("expires_at"),
  status: varchar("status", { length: 16 }).default("open"), // "open" | "paid" | "expired" | "cancelled"
  createdAt: timestamp("created_at").defaultNow()
});

// KYC / Compliance
export const kycVerifications = pgTable("kyc_verifications", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  tier: varchar("tier", { length: 16 }).default("basic"), // "basic" | "plus" | "pro"
  status: varchar("status", { length: 16 }).default("pending"),
  data: jsonb("data"), // {idType, idNumber, selfieRef, addressProofRef}
  reviewedBy: varchar("reviewed_by", { length: 36 }),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// Payout destinations (bank, card, wallet)
export const payoutMethods = pgTable("payout_methods", {
  id: varchar("id", { length: 36 }).primaryKey(),
  walletId: varchar("wallet_id", { length: 36 }).notNull(),
  kind: varchar("kind", { length: 24 }).notNull(), // "bank_transfer" | "card" | "mobile_money"
  label: varchar("label", { length: 80 }),
  details: jsonb("details"), // masked account/card info
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// FX rates for multi-currency
export const fxRates = pgTable("fx_rates", {
  pair: varchar("pair", { length: 16 }).primaryKey(), // "USD/JMD", "JMD/YFD", "USD/YFD"
  rate: decimal("rate", { precision: 16, scale: 8 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// YaadFlex coin model (denominations up to 2000)
export const coinDenominations = pgTable("coin_denominations", {
  code: varchar("code", { length: 8 }).primaryKey(), // "1","5","10","20","50","100","500","1000","2000"
  value: integer("value").notNull(),                 // integer units of YFD
  face: varchar("face", { length: 64 }),             // "Doctor Bird", "Ackee", "Blue Mahoe", etc.
  theme: varchar("theme", { length: 64 }),           // "National Icon", "Heritage", etc.
  artworkUrl: text("artwork_url")                    // optional image url
});

// Reward points (optional)
export const rewardPoints = pgTable("reward_points", {
  walletId: varchar("wallet_id", { length: 36 }).primaryKey(),
  points: integer("points").default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Export types
export type WalletUser = typeof walletUsers.$inferSelect;
export type InsertWalletUser = typeof walletUsers.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;
export type WalletBalance = typeof walletBalances.$inferSelect;
export type InsertWalletBalance = typeof walletBalances.$inferInsert;
export type WalletTransaction = typeof walletTx.$inferSelect;
export type InsertWalletTransaction = typeof walletTx.$inferInsert;
export type CoinDenomination = typeof coinDenominations.$inferSelect;
export type InsertCoinDenomination = typeof coinDenominations.$inferInsert;
export type PaymentRequest = typeof paymentRequests.$inferSelect;
export type InsertPaymentRequest = typeof paymentRequests.$inferInsert;