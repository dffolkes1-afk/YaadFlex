// server/media-routes.ts - Media Hub API Routes
import express from "express";
import { z } from "zod";
import { insertMediaChannelSchema, insertMediaStreamSchema } from "../shared/media-schema";
import { nanoid } from "nanoid";

// Schema for allowed stream update properties - only allow safe user-modifiable fields
const updateStreamSchema = z.object({
  title: z.string().max(160).optional(),
  streamUrl: z.string().url().optional(),
  posterImage: z.string().url().optional(),
  isLive: z.boolean().optional()
});

const router = express.Router();

// Simple helper to detect provider
function detectProvider(url: string): "hls"|"youtube"|"twitch"|"vimeo"|"other" {
  const u = url.toLowerCase();
  if (u.endsWith(".m3u8")) return "hls";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("twitch.tv")) return "twitch";
  if (u.includes("vimeo.com")) return "vimeo";
  return "other";
}

// Mock storage - in real app would use database
const mediaChannels: any[] = [];

const mediaStreams: any[] = [];

// Create channel (admin/verified onboarding)
router.post("/api/media/channels", async (req, res) => {
  try {
    const validatedData = insertMediaChannelSchema.parse(req.body);
    const { id, ...dataWithoutId } = validatedData;
    const newChannel = {
      id: nanoid(),
      ...dataWithoutId,
      createdAt: new Date().toISOString()
    };
    
    mediaChannels.push(newChannel);
    res.json(newChannel);
  } catch (error) {
    res.status(400).json({ error: "Invalid channel data" });
  }
});

// List channels
router.get("/api/media/channels", async (_req, res) => {
  res.json(mediaChannels);
});

// Get specific channel
router.get("/api/media/channels/:id", async (req, res) => {
  const channel = mediaChannels.find(c => c.id === req.params.id);
  if (!channel) {
    return res.status(404).json({ error: "Channel not found" });
  }
  res.json(channel);
});

// Create/update live stream window (channel pastes their link)
router.post("/api/media/streams", async (req, res) => {
  try {
    const validatedData = insertMediaStreamSchema.parse(req.body);
    const provider = detectProvider(validatedData.streamUrl);
    const { id, ...dataWithoutId } = validatedData;
    
    const newStream = {
      id: nanoid(),
      ...dataWithoutId,
      provider,
      createdAt: new Date().toISOString()
    };
    
    mediaStreams.push(newStream);
    res.json(newStream);
  } catch (error) {
    res.status(400).json({ error: "Invalid stream data" });
  }
});

// Get streams by channel
router.get("/api/media/channels/:channelId/streams", async (req, res) => {
  const channelStreams = mediaStreams.filter(s => s.channelId === req.params.channelId);
  res.json(channelStreams);
});

// Get all live streams
router.get("/api/media/streams/live", async (_req, res) => {
  const liveStreams = mediaStreams.filter(s => s.isLive);
  res.json(liveStreams);
});

// Update stream status
router.patch("/api/media/streams/:id", async (req, res) => {
  const streamIndex = mediaStreams.findIndex(s => s.id === req.params.id);
  if (streamIndex === -1) {
    return res.status(404).json({ error: "Stream not found" });
  }
  
  try {
    const validatedUpdates = updateStreamSchema.parse(req.body);
    mediaStreams[streamIndex] = { ...mediaStreams[streamIndex], ...validatedUpdates };
    res.json(mediaStreams[streamIndex]);
  } catch (error) {
    res.status(400).json({ error: "Invalid update data" });
  }
});

export default router;