// YaadFlex RBAC + Area Locking Routes
import { Router } from "express";
import { 
  acquireArea, 
  releaseArea, 
  resetArea, 
  getAreaStatus,
  requirePermission, 
  getUserPermissions,
  assignRoleToUser,
  removeRoleFromUser,
  canUserAccessArea
} from "./rbac-service";
import { db } from "./db";
import { rbacPayouts, rbacAuditLogs, rbacWorkAreas, rbacRoles } from "@shared/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { isAuthenticated } from "./replitAuth";

const router = Router();

// Area Management Routes

// Acquire exclusive lock on work area
router.post("/api/rbac/areas/:code/acquire", isAuthenticated, requirePermission("area:*"), async (req, res) => {
  try {
    const user = (req as any).user;
    const areaCode = req.params.code;
    const { ttlMinutes = 120 } = req.body;

    await acquireArea(areaCode, user.claims.sub, ttlMinutes);
    
    res.json({ 
      success: true, 
      message: `Area "${areaCode}" acquired successfully`,
      expiresIn: ttlMinutes 
    });
  } catch (error: any) {
    res.status(400).json({ 
      error: error.message,
      success: false 
    });
  }
});

// Release area lock
router.post("/api/rbac/areas/:code/release", isAuthenticated, requirePermission("area:*"), async (req, res) => {
  try {
    const user = (req as any).user;
    const areaCode = req.params.code;

    await releaseArea(areaCode, user.claims.sub);
    
    res.json({ 
      success: true, 
      message: `Area "${areaCode}" released successfully` 
    });
  } catch (error: any) {
    res.status(400).json({ 
      error: error.message,
      success: false 
    });
  }
});

// Get area status (public endpoint)
router.get("/api/rbac/areas/:code/status", async (req, res) => {
  try {
    const area = await getAreaStatus(req.params.code);
    
    if (!area) {
      return res.status(404).json({ error: "Area not found" });
    }
    
    res.json(area);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to get area status" });
  }
});

// Reset/Override area lock (CEO only)
router.post("/api/rbac/areas/:code/reset", isAuthenticated, requirePermission("area:reset"), async (req, res) => {
  try {
    const user = (req as any).user;
    const areaCode = req.params.code;

    await resetArea(areaCode, user.claims.sub);
    
    res.json({ 
      success: true, 
      message: `Area "${areaCode}" reset successfully by admin override` 
    });
  } catch (error: any) {
    res.status(400).json({ 
      error: error.message,
      success: false 
    });
  }
});

// Check user access to area
router.get("/api/rbac/areas/:code/access", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    const areaCode = req.params.code;
    
    const hasAccess = await canUserAccessArea(user.claims.sub, areaCode);
    
    res.json({ 
      hasAccess,
      areaCode,
      userId: user.claims.sub
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to check area access" });
  }
});

// Payout Management Routes

// Approve payout (requires permission)
router.post("/api/rbac/payouts/:id/approve", isAuthenticated, requirePermission("payout:approve"), async (req, res) => {
  try {
    const payoutId = req.params.id;
    const user = (req as any).user;
    
    await db.update(rbacPayouts)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(rbacPayouts.id, payoutId));
    
    // Log the approval
    await db.insert(rbacAuditLogs).values({
      id: crypto.randomUUID(),
      userId: user.claims.sub,
      action: "PAYOUT_APPROVE",
      metadata: { payoutId }
    });
    
    res.json({ 
      success: true, 
      message: "Payout approved successfully" 
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: "Failed to approve payout",
      success: false 
    });
  }
});

// Reject payout (requires permission)
router.post("/api/rbac/payouts/:id/reject", isAuthenticated, requirePermission("payout:approve"), async (req, res) => {
  try {
    const payoutId = req.params.id;
    const user = (req as any).user;
    const { reason } = req.body;
    
    await db.update(rbacPayouts)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(rbacPayouts.id, payoutId));
    
    // Log the rejection
    await db.insert(rbacAuditLogs).values({
      id: crypto.randomUUID(),
      userId: user.claims.sub,
      action: "PAYOUT_REJECT",
      metadata: { payoutId, reason }
    });
    
    res.json({ 
      success: true, 
      message: "Payout rejected successfully" 
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: "Failed to reject payout",
      success: false 
    });
  }
});

// Get pending payouts
router.get("/api/rbac/payouts/pending", isAuthenticated, requirePermission("payout:approve"), async (req, res) => {
  try {
    const pendingPayouts = await db.select()
      .from(rbacPayouts)
      .where(eq(rbacPayouts.status, "pending"));
    
    res.json(pendingPayouts);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch pending payouts" });
  }
});

// User & Role Management Routes

// Get user permissions
router.get("/api/rbac/users/me/permissions", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    const permissions = await getUserPermissions(user.claims.sub);
    
    res.json(permissions);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to get user permissions" });
  }
});

// Assign role to user (admin only)
router.post("/api/rbac/users/:userId/roles/:roleCode", isAuthenticated, requirePermission("area:reset"), async (req, res) => {
  try {
    const { userId, roleCode } = req.params;
    
    await assignRoleToUser(userId, roleCode);
    
    res.json({ 
      success: true, 
      message: `Role "${roleCode}" assigned to user successfully` 
    });
  } catch (error: any) {
    res.status(400).json({ 
      error: error.message,
      success: false 
    });
  }
});

// Remove role from user (admin only)
router.delete("/api/rbac/users/:userId/roles/:roleCode", isAuthenticated, requirePermission("area:reset"), async (req, res) => {
  try {
    const { userId, roleCode } = req.params;
    
    await removeRoleFromUser(userId, roleCode);
    
    res.json({ 
      success: true, 
      message: `Role "${roleCode}" removed from user successfully` 
    });
  } catch (error: any) {
    res.status(400).json({ 
      error: error.message,
      success: false 
    });
  }
});

// Get all work areas
router.get("/api/rbac/areas", isAuthenticated, async (req, res) => {
  try {
    const areas = await db.select().from(rbacWorkAreas);
    res.json(areas);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch work areas" });
  }
});

// Get all roles
router.get("/api/rbac/roles", isAuthenticated, requirePermission("area:reset"), async (req, res) => {
  try {
    const roles = await db.select().from(rbacRoles);
    res.json(roles);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
});

// Get audit logs (admin only)
router.get("/api/rbac/audit", isAuthenticated, requirePermission("area:reset"), async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const auditLogs = await db.select()
      .from(rbacAuditLogs)
      .limit(Number(limit))
      .offset(Number(offset))
      .orderBy((logs) => logs.createdAt);
    
    res.json(auditLogs);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

export default router;