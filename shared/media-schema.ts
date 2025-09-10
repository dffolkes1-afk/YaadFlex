// shared/media-schema.ts - Media Hub Schema
import { pgTable, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const mediaChannels = pgTable("media_channels", {
  id: varchar("id", { length: 36 }).primaryKey(),
  ownerUserId: varchar("owner_user_id", { length: 36 }).notNull(),
  handle: varchar("handle", { length: 48 }).notNull().unique(), // e.g. "tvj", "cvm", "gleaner"
  displayName: varchar("display_name", { length: 120 }).notNull(),
  about: text("about"),
  verified: boolean("verified").default(false),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow()
});

export const mediaStreams = pgTable("media_streams", {
  id: varchar("id", { length: 36 }).primaryKey(),
  channelId: varchar("channel_id", { length: 36 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  // Supported: HLS .m3u8, YouTube, Twitch, Vimeo (we render smartly on frontend)
  streamUrl: text("stream_url").notNull(),
  provider: varchar("provider", { length: 24 }).notNull(), // "hls" | "youtube" | "twitch" | "vimeo" | "other"
  posterImage: text("poster_image"),
  isLive: boolean("is_live").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Create insert schemas for validation
export const insertMediaChannelSchema = createInsertSchema(mediaChannels);
export const insertMediaStreamSchema = createInsertSchema(mediaStreams);

// Create TypeScript types
export type MediaChannel = typeof mediaChannels.$inferSelect;
export type MediaStream = typeof mediaStreams.$inferSelect;
export type InsertMediaChannel = z.infer<typeof insertMediaChannelSchema>;
export type InsertMediaStream = z.infer<typeof insertMediaStreamSchema>;