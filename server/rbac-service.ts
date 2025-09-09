// YaadFlex RBAC + Area Locking Service
import { db } from "./db";
import { 
  rbacRoles, 
  rbacUserRoles, 
  rbacPermissions, 
  rbacRolePermissions, 
  rbacWorkAreas, 
  rbacAuditLogs,
  users 
} from "@shared/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

export type AuthedUser = { id: string; email?: string; firstName?: string };

// Check if user has specific permission
export async function userHasPermission(userId: string, permissionCode: string): Promise<boolean> {
  const rows = await db
    .select({ permissionCode: rbacRolePermissions.permissionCode })
    .from(rbacUserRoles)
    .innerJoin(rbacRoles, eq(rbacUserRoles.roleId, rbacRoles.id))
    .innerJoin(rbacRolePermissions, eq(rbacRolePermissions.roleId, rbacRoles.id))
    .where(eq(rbacUserRoles.userId, userId));
  
  return rows.some((r) => r.permissionCode === permissionCode || r.permissionCode === "area:*");
}

// Middleware to require specific permission
export function requirePermission(permissionCode: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user: AuthedUser | undefined = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const hasPermission = await userHasPermission(user.id, permissionCode);
    if (!hasPermission) {
      return res.status(403).json({ error: `Permission denied: ${permissionCode}` });
    }
    
    next();
  };
}

// Acquire exclusive lock to a work area
export async function acquireArea(areaCode: string, userId: string, ttlMinutes = 120): Promise<void> {
  const now = new Date();
  const expires = new Date(now.getTime() + ttlMinutes * 60 * 1000);

  const [area] = await db.select().from(rbacWorkAreas).where(eq(rbacWorkAreas.code, areaCode));
  if (!area) {
    throw new Error("AREA_NOT_FOUND");
  }

  // Check if area is locked by someone else
  if (area.isLocked && area.lockExpiresAt && area.lockExpiresAt > now && area.lockedByUserId !== userId) {
    throw new Error("AREA_IN_USE");
  }

  // Acquire or renew the lock
  await db.update(rbacWorkAreas)
    .set({ 
      isLocked: true, 
      lockedByUserId: userId, 
      lockExpiresAt: expires, 
      updatedAt: new Date() 
    })
    .where(eq(rbacWorkAreas.code, areaCode));

  // Log the action
  await db.insert(rbacAuditLogs).values({
    id: crypto.randomUUID(),
    userId,
    action: "AREA_ACQUIRE",
    areaCode,
    metadata: { ttlMinutes },
  });
}

// Release area lock
export async function releaseArea(areaCode: string, userId: string): Promise<void> {
  const [area] = await db.select().from(rbacWorkAreas).where(eq(rbacWorkAreas.code, areaCode));
  if (!area) {
    throw new Error("AREA_NOT_FOUND");
  }
  
  if (area.lockedByUserId && area.lockedByUserId !== userId) {
    throw new Error("NOT_LOCK_OWNER");
  }

  await db.update(rbacWorkAreas)
    .set({ 
      isLocked: false, 
      lockedByUserId: null, 
      lockExpiresAt: null, 
      updatedAt: new Date() 
    })
    .where(eq(rbacWorkAreas.code, areaCode));

  await db.insert(rbacAuditLogs).values({
    id: crypto.randomUUID(),
    userId,
    action: "AREA_RELEASE",
    areaCode,
  });
}

// Force reset area (CEO/Admin only)
export async function resetArea(areaCode: string, adminUserId: string): Promise<void> {
  const [area] = await db.select().from(rbacWorkAreas).where(eq(rbacWorkAreas.code, areaCode));
  if (!area) {
    throw new Error("AREA_NOT_FOUND");
  }

  await db.update(rbacWorkAreas)
    .set({ 
      isLocked: false, 
      lockedByUserId: null, 
      lockExpiresAt: null, 
      updatedAt: new Date() 
    })
    .where(eq(rbacWorkAreas.code, areaCode));

  await db.insert(rbacAuditLogs).values({
    id: crypto.randomUUID(),
    userId: adminUserId,
    action: "RESET_OVERRIDE",
    areaCode,
    metadata: { restored: Boolean(area.lastGoodSnapshot) },
  });
}

// Get area status
export async function getAreaStatus(areaCode: string) {
  const [area] = await db.select().from(rbacWorkAreas).where(eq(rbacWorkAreas.code, areaCode));
  return area || null;
}

// Get user's roles and permissions
export async function getUserPermissions(userId: string) {
  const userRoles = await db
    .select({
      roleCode: rbacRoles.code,
      roleLabel: rbacRoles.label,
      permissionCode: rbacRolePermissions.permissionCode
    })
    .from(rbacUserRoles)
    .innerJoin(rbacRoles, eq(rbacUserRoles.roleId, rbacRoles.id))
    .innerJoin(rbacRolePermissions, eq(rbacRolePermissions.roleId, rbacRoles.id))
    .where(eq(rbacUserRoles.userId, userId));

  return userRoles;
}

// Check if user can access area
export async function canUserAccessArea(userId: string, areaCode: string): Promise<boolean> {
  // Check for area-specific permission or wildcard
  const hasAreaAccess = await userHasPermission(userId, `area:${areaCode}`) || 
                       await userHasPermission(userId, "area:*");
  
  if (!hasAreaAccess) {
    return false;
  }

  // Check if area is locked by someone else
  const area = await getAreaStatus(areaCode);
  if (!area) {
    return false;
  }

  const now = new Date();
  if (area.isLocked && area.lockExpiresAt && area.lockExpiresAt > now && area.lockedByUserId !== userId) {
    return false;
  }

  return true;
}

// Assign role to user
export async function assignRoleToUser(userId: string, roleCode: string): Promise<void> {
  const [role] = await db.select().from(rbacRoles).where(eq(rbacRoles.code, roleCode));
  if (!role) {
    throw new Error("ROLE_NOT_FOUND");
  }

  // Check if user already has this role
  const existing = await db.select()
    .from(rbacUserRoles)
    .where(eq(rbacUserRoles.userId, userId))
    .where(eq(rbacUserRoles.roleId, role.id));

  if (existing.length === 0) {
    await db.insert(rbacUserRoles).values({
      id: crypto.randomUUID(),
      userId,
      roleId: role.id
    });
  }
}

// Remove role from user
export async function removeRoleFromUser(userId: string, roleCode: string): Promise<void> {
  const [role] = await db.select().from(rbacRoles).where(eq(rbacRoles.code, roleCode));
  if (!role) {
    throw new Error("ROLE_NOT_FOUND");
  }

  await db.delete(rbacUserRoles)
    .where(eq(rbacUserRoles.userId, userId))
    .where(eq(rbacUserRoles.roleId, role.id));
}