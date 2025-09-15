// Seed script for time-locked authentication system
import { db } from "./db";
import { users, workSchedules, authPolicies, userMfa } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import crypto from "node:crypto";
import { COMPANY_INFO } from '@shared/company';

export async function seedTimeAuthSystem() {
  try {
    console.log(`🔐 Setting up ${COMPANY_INFO.COMPANY_NAME} Time-Locked Authentication System...`);

    // Create CEO user if not exists
    const ceoId = "ceo-yaadflex-admin-001";
    const existingCeo = await db.select().from(users).where(eq(users.id, ceoId)).limit(1);
    
    if (existingCeo.length === 0) {
      await db.insert(users).values({
        id: ceoId,
        email: COMPANY_INFO.CONTACT.ceo_email,
        firstName: "Dwayne",
        lastName: "Ffolkes",
        mfaEnabled: true,
        securityLevel: "fortress",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ CEO user created");
    }

    // Create sample work schedules for CEO (24/7 access)
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (const day of daysOfWeek) {
      const existingSchedule = await db.select().from(workSchedules)
        .where(and(
          eq(workSchedules.userId, ceoId),
          eq(workSchedules.dayOfWeek, day)
        )).limit(1);
      
      if (existingSchedule.length === 0) {
        await db.insert(workSchedules).values({
          id: crypto.randomUUID(),
          userId: ceoId,
          dayOfWeek: day,
          startTime: "00:00:00", // 24/7 access for CEO
          endTime: "23:59:59",
          createdAt: new Date(),
        });
      }
    }
    console.log("✅ CEO work schedules configured (24/7 access)");

    // Create default authentication policy
    const existingPolicy = await db.select().from(authPolicies).limit(1);
    if (existingPolicy.length === 0) {
      await db.insert(authPolicies).values({
        id: "default-policy",
        minSessionMinutes: 30,
        cooldownMinutes: 15,
        graceMinutesBefore: 10,
        graceMinutesAfter: 10,
        singleSessionOnly: true,
        deviceBindDays: 14,
        createdAt: new Date(),
      });
      console.log("✅ Default authentication policy created");
    }

    console.log("🎉 Time-locked authentication system ready!");
    console.log("📱 Next steps:");
    console.log(`   1. Navigate to /api/mfa/setup with userId: ceo-${COMPANY_INFO.BRANDING.logo_text.toLowerCase()}-admin-001`);
    console.log("   2. Scan QR code with authenticator app");
    console.log("   3. Verify setup with /api/mfa/verify");
    console.log("   4. Login with /api/auth/login using TOTP code");
    
    return {
      success: true,
      ceoId,
      message: "Time-locked authentication system initialized"
    };
  } catch (error) {
    console.error("❌ Failed to seed time-locked authentication system:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}