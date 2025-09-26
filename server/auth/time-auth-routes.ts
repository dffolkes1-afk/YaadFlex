// Time-locked authentication routes for YaadFlex
import express from "express";
import cookieParser from "cookie-parser";
import crypto from "node:crypto";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { userMfa, userSessions, workSchedules, authPolicies, users } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

const router = express.Router();
router.use(cookieParser());

const JWT_SECRET = process.env.SESSION_SECRET;

// Fail fast if no proper JWT secret is configured
if (!JWT_SECRET || JWT_SECRET === "dev_secret") {
  console.error("SECURITY ERROR: SESSION_SECRET environment variable must be set to a secure value");
  process.exit(1);
}

const nowUtc = () => new Date();
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

async function getPolicy() {
  const rows = await db.select().from(authPolicies).orderBy(desc(authPolicies.createdAt)).limit(1);
  return rows[0] || { 
    minSessionMinutes: 30, 
    cooldownMinutes: 15, 
    singleSessionOnly: true,
    graceMinutesBefore: 10,
    graceMinutesAfter: 10
  };
}

async function withinShiftWindow(userId: string) {
  const now = nowUtc();
  const currentDay = DAYS[now.getUTCDay()];
  const currentMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  
  const policy = await getPolicy();
  const graceBefore = policy.graceMinutesBefore || 0;
  const graceAfter = policy.graceMinutesAfter || 0;
  
  const rows = await db.select().from(workSchedules).where(eq(workSchedules.userId, userId));
  
  return rows.some(schedule => {
    const [startHour, startMin] = schedule.startTime.split(':').map(Number);
    const [endHour, endMin] = schedule.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin - graceBefore;
    const endMinutes = endHour * 60 + endMin + graceAfter;
    
    // Handle same-day shifts
    if (startMinutes <= endMinutes) {
      return schedule.dayOfWeek === currentDay && 
             currentMinutes >= startMinutes && 
             currentMinutes <= endMinutes;
    }
    
    // Handle overnight shifts (e.g., 22:00-06:00)
    if (schedule.dayOfWeek === currentDay) {
      // Current day, check if after start time
      return currentMinutes >= startMinutes;
    }
    
    // Check previous day for overnight shifts
    const previousDayIndex = (now.getUTCDay() - 1 + 7) % 7;
    const previousDay = DAYS[previousDayIndex];
    
    if (schedule.dayOfWeek === previousDay) {
      // Previous day's shift that goes into current day
      return currentMinutes <= endMinutes;
    }
    
    return false;
  });
}

async function hasCooldown(userId: string) {
  const policy = await getPolicy();
  const rows = await db.select().from(userSessions)
    .where(eq(userSessions.userId, userId))
    .orderBy(desc(userSessions.endedAt))
    .limit(1);
  
  const last = rows[0];
  if (!last || !last.endedAt) return false;
  
  const diff = nowUtc().getTime() - new Date(last.endedAt).getTime();
  return diff < (policy.cooldownMinutes || 15) * 60000;
}

async function activeSessionExists(userId: string) {
  const rows = await db.select().from(userSessions)
    .where(and(
      eq(userSessions.userId, userId),
      eq(userSessions.active, true)
    ));
  return rows.length > 0;
}

// === MFA SETUP ENDPOINTS ===

// Setup MFA for a user
router.post("/api/mfa/setup", async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "USER_ID_REQUIRED" });
    }

    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    const secret = speakeasy.generateSecret({ 
      length: 20,
      name: `YaadFlex:${user.email || userId}`,
      issuer: "YaadFlex Global"
    });
    
    const otpauth = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `YaadFlex:${user.email || userId}`,
      issuer: "YaadFlex Global",
      encoding: "base32",
    });
    
    const qr = await QRCode.toDataURL(otpauth);
    
    // Store MFA secret (disabled until verified)
    await db.insert(userMfa).values({ 
      userId, 
      totpSecret: secret.base32, 
      enabled: false 
    }).onConflictDoUpdate({ 
      target: userMfa.userId, 
      set: { 
        totpSecret: secret.base32, 
        enabled: false, 
        updatedAt: nowUtc() 
      } 
    });
    
    res.json({ otpauth, qr, secret: secret.base32 });
  } catch (error) {
    console.error("MFA setup error:", error);
    res.status(500).json({ error: "MFA_SETUP_FAILED" });
  }
});

// Verify and enable MFA
router.post("/api/mfa/verify", async (req, res) => {
  try {
    const { userId, token } = req.body;
    
    const [mfaRecord] = await db.select().from(userMfa).where(eq(userMfa.userId, userId));
    if (!mfaRecord?.totpSecret) {
      return res.status(400).json({ error: "NO_MFA_SETUP" });
    }
    
    const isValid = speakeasy.totp.verify({ 
      secret: mfaRecord.totpSecret, 
      encoding: "base32", 
      token, 
      window: 1 
    });
    
    if (!isValid) {
      return res.status(400).json({ error: "INVALID_TOKEN" });
    }
    
    // Enable MFA
    await db.update(userMfa)
      .set({ enabled: true, updatedAt: nowUtc() })
      .where(eq(userMfa.userId, userId));
    
    res.json({ ok: true, message: "MFA enabled successfully" });
  } catch (error) {
    console.error("MFA verify error:", error);
    res.status(500).json({ error: "MFA_VERIFY_FAILED" });
  }
});

// === AUTHENTICATION ENDPOINTS ===

// Time-locked login
router.post("/api/auth/login", async (req, res) => {
  try {
    const { userId, token, deviceId } = req.body;
    
    // Check MFA
    const [mfaRecord] = await db.select().from(userMfa).where(eq(userMfa.userId, userId));
    if (!mfaRecord?.enabled) {
      return res.status(403).json({ error: "MFA_REQUIRED" });
    }
    
    const isValid = speakeasy.totp.verify({ 
      secret: mfaRecord.totpSecret!, 
      encoding: "base32", 
      token, 
      window: 1 
    });
    
    if (!isValid) {
      return res.status(401).json({ error: "INVALID_TOTP" });
    }
    
    // Check user status
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }
    
    // Check cooldown
    if (await hasCooldown(userId)) {
      return res.status(429).json({ error: "LOGIN_COOLDOWN_ACTIVE" });
    }
    
    // Check work schedule (for non-CEO users)
    const isWithinShift = await withinShiftWindow(userId);
    if (!isWithinShift && user.email !== 'ceo@yaadflex.com') {
      return res.status(403).json({ error: "OUTSIDE_SHIFT_WINDOW" });
    }
    
    // Check existing active sessions
    const policy = await getPolicy();
    if (policy.singleSessionOnly && await activeSessionExists(userId)) {
      return res.status(409).json({ error: "ACTIVE_SESSION_EXISTS" });
    }
    
    // Create new session
    const sessionId = crypto.randomUUID();
    await db.insert(userSessions).values({
      id: sessionId,
      userId,
      deviceId: deviceId || undefined,
      ip: (req.ip || "unknown"),
      userAgent: (req.headers["user-agent"] || "unknown"),
      startedAt: nowUtc(),
      lastSeenAt: nowUtc(),
      active: true
    });
    
    // Create JWT token
    const jwtToken = jwt.sign({ sid: sessionId, uid: userId }, JWT_SECRET, { expiresIn: "12h" });
    
    // Set secure cookie
    res.cookie("yaadflex_sess", jwtToken, { 
      httpOnly: true, 
      sameSite: "lax", 
      secure: process.env.NODE_ENV === "production",
      maxAge: 12 * 60 * 60 * 1000 // 12 hours
    });
    
    res.json({ 
      ok: true, 
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "LOGIN_FAILED" });
  }
});

// Session heartbeat
router.post("/api/auth/heartbeat", async (req, res) => {
  try {
    const token = (req as any).cookies?.["yaadflex_sess"];
    if (!token) {
      return res.status(401).json({ error: "NO_SESSION" });
    }
    
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    // Update last seen time
    const [session] = await db.update(userSessions)
      .set({ lastSeenAt: nowUtc() })
      .where(and(
        eq(userSessions.id, payload.sid),
        eq(userSessions.active, true)
      ))
      .returning();
    
    if (!session) {
      return res.status(401).json({ error: "SESSION_NOT_FOUND" });
    }
    
    res.json({ ok: true, lastSeen: session.lastSeenAt });
  } catch (error) {
    console.error("Heartbeat error:", error);
    res.status(401).json({ error: "INVALID_SESSION" });
  }
});

// Logout
router.post("/api/auth/logout", async (req, res) => {
  try {
    const token = (req as any).cookies?.["yaadflex_sess"];
    if (!token) {
      res.clearCookie("yaadflex_sess");
      return res.json({ ok: true });
    }
    
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    // End session
    await db.update(userSessions)
      .set({ active: false, endedAt: nowUtc() })
      .where(eq(userSessions.id, payload.sid));
    
    res.clearCookie("yaadflex_sess");
    res.json({ ok: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.clearCookie("yaadflex_sess");
    res.json({ ok: true });
  }
});

// Get current user
router.get("/api/auth/user", async (req, res) => {
  try {
    const token = (req as any).cookies?.["yaadflex_sess"];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    // Check session is active
    const [session] = await db.select().from(userSessions)
      .where(and(
        eq(userSessions.id, payload.sid),
        eq(userSessions.active, true)
      ));
    
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Get user details
    const [user] = await db.select().from(users).where(eq(users.id, session.userId));
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Update last seen
    await db.update(userSessions)
      .set({ lastSeenAt: nowUtc() })
      .where(eq(userSessions.id, payload.sid));
    
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;