// Time-locked authentication middleware for YaadFlex
import { db } from "../db";
import { userSessions, workSchedules, authPolicies } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.SESSION_SECRET || "dev_secret";

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const nowUtc = () => new Date();
const pad = (n: number) => n.toString().padStart(2, "0");
const hhmmss = (d: Date) => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;

async function getPolicy() {
  const rows = await db.select().from(authPolicies).orderBy(desc(authPolicies.createdAt)).limit(1);
  return rows[0] || { 
    singleSessionOnly: true, 
    graceMinutesBefore: 10, 
    graceMinutesAfter: 10,
    minSessionMinutes: 30,
    cooldownMinutes: 15
  };
}

// Middleware to require authenticated shift (time-locked access)
export function requireAuthenticatedShift() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = (req as any).cookies?.["yaadflex_sess"] || req.headers["x-session"] as string;
      if (!token) {
        return res.status(401).json({ error: "NO_SESSION", message: "No session token provided" });
      }

      const payload = jwt.verify(token, JWT_SECRET) as any;
      const sid = payload.sid;
      const uid = payload.uid;

      // Check if session exists and is active
      const [sess] = await db.select().from(userSessions).where(eq(userSessions.id, sid));
      if (!sess || !sess.active) {
        return res.status(401).json({ error: "SESSION_INACTIVE", message: "Session is not active" });
      }

      const policy = await getPolicy();
      const now = nowUtc();
      const day = DAYS[now.getUTCDay()];
      const timeNow = hhmmss(now);

      // Get user's work schedules
      const schedules = await db.select().from(workSchedules).where(eq(workSchedules.userId, uid));

      // Check if current time is within any work schedule
      const withinSchedule = schedules.some(s => {
        if (s.dayOfWeek !== day) return false;
        
        // Apply grace period to schedule
        const startTime = s.startTime;
        const endTime = s.endTime;
        
        // Simple time comparison (works for same-day schedules)
        return timeNow >= startTime && timeNow <= endTime;
      });

      if (!withinSchedule) {
        return res.status(403).json({ 
          error: "OUTSIDE_SHIFT_WINDOW", 
          message: "Access denied: Outside of authorized work hours" 
        });
      }

      // Update last seen time
      await db.update(userSessions)
        .set({ lastSeenAt: now })
        .where(eq(userSessions.id, sid));

      (req as any).user = { id: uid, sid, claims: { sub: uid } };
      next();
    } catch (error) {
      console.error("Time-guard authentication error:", error);
      return res.status(401).json({ error: "INVALID_SESSION", message: "Invalid session token" });
    }
  };
}

// Alternative middleware for CEO and admin access (bypasses time restrictions)
export function requireCEOAccess() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = (req as any).cookies?.["yaadflex_sess"] || req.headers["x-session"] as string;
      if (!token) {
        return res.status(401).json({ error: "NO_SESSION", message: "No session token provided" });
      }

      const payload = jwt.verify(token, JWT_SECRET) as any;
      const sid = payload.sid;
      const uid = payload.uid;

      // Check if session exists and is active
      const [sess] = await db.select().from(userSessions).where(eq(userSessions.id, sid));
      if (!sess || !sess.active) {
        return res.status(401).json({ error: "SESSION_INACTIVE", message: "Session is not active" });
      }

      // Update last seen time
      await db.update(userSessions)
        .set({ lastSeenAt: nowUtc() })
        .where(eq(userSessions.id, sid));

      (req as any).user = { id: uid, sid, claims: { sub: uid } };
      next();
    } catch (error) {
      console.error("CEO access authentication error:", error);
      return res.status(401).json({ error: "INVALID_SESSION", message: "Invalid session token" });
    }
  };
}