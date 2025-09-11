// YaadFlex Universal Delivery Network Routes
import { Router } from "express";
import { 
  generateOrderNumber,
  calculateDeliveryFee,
  findAvailableDeliveryPersonnel,
  autoAssignOrder,
  getDeliveryPersonnelStats,
  calculateOrderEarnings,
  getOrdersWithFilters,
  updateDeliveryPersonnelLocation,
  updateDeliveryPersonnelStatus
} from "./delivery-service";
import { seedDeliverySystem } from "./delivery-seed";
import { db } from "./db";
import { 
  deliveryPersonnel, 
  deliveryOrders, 
  deliveryCategories,
  deliveryAreas,
  deliveryEarnings,
  deliveryRoutes,
  deliveryReviews,
  users,
  insertDeliveryOrderSchema,
  insertDeliveryPersonnelSchema
} from "@shared/schema";
import { eq, desc, and, or, sql } from "drizzle-orm";
import crypto from "node:crypto";
import { isAuthenticated } from "./replitAuth";

const router = Router();

// ===== CUSTOMER ROUTES =====

// Get available delivery categories
router.get("/api/delivery/categories", async (req, res) => {
  try {
    const categories = await db.select()
      .from(deliveryCategories)
      .where(eq(deliveryCategories.isActive, true))
      .orderBy(deliveryCategories.name);
    
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch delivery categories" });
  }
});

// Get delivery areas
router.get("/api/delivery/areas", async (req, res) => {
  try {
    const areas = await db.select()
      .from(deliveryAreas)
      .where(eq(deliveryAreas.isActive, true))
      .orderBy(deliveryAreas.name);
    
    res.json(areas);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch delivery areas" });
  }
});

// Calculate delivery fee estimate
router.post("/api/delivery/calculate-fee", async (req, res) => {
  try {
    const { deliveryType, pickupLat, pickupLng, deliveryLat, deliveryLng, areaCode } = req.body;
    
    if (!deliveryType || !pickupLat || !pickupLng || !deliveryLat || !deliveryLng) {
      return res.status(400).json({ error: "Missing required coordinates or delivery type" });
    }

    // Calculate distance (simple formula - in production use proper routing service)
    const R = 6371; // Earth's radius in km
    const dLat = (deliveryLat - pickupLat) * Math.PI / 180;
    const dLng = (deliveryLng - pickupLng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pickupLat * Math.PI / 180) * Math.cos(deliveryLat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    const fee = await calculateDeliveryFee(deliveryType, distance, areaCode);
    
    res.json({
      distance: Math.round(distance * 100) / 100,
      estimatedFee: fee,
      deliveryType,
      areaCode
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Create new delivery order (customer)
router.post("/api/delivery/orders", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    const orderData = insertDeliveryOrderSchema.parse({
      ...req.body,
      customerId: user.claims.sub,
      orderNumber: generateOrderNumber()
    });

    const [newOrder] = await db.insert(deliveryOrders)
      .values([orderData])
      .returning();

    // ALWAYS ACCEPT ORDERS - Try to auto-assign but NEVER reject
    let assignmentMessage = "Your order is confirmed and being processed! 🚀";
    try {
      const assignedPersonnelId = await autoAssignOrder(newOrder.id);
      if (assignedPersonnelId === 'QUEUED') {
        assignmentMessage = "Order ACCEPTED! We're finding you a driver right now - no cancellation needed! 🇯🇲";
        console.log(`Order ${newOrder.orderNumber} ACCEPTED and QUEUED - No drivers available but NEVER REJECTED!`);
      } else if (assignedPersonnelId) {
        assignmentMessage = "Order ACCEPTED and driver assigned! Your delivery is starting soon! 🚚";
        console.log(`Order ${newOrder.orderNumber} auto-assigned to personnel ${assignedPersonnelId}`);
      }
    } catch (assignError) {
      console.log(`Order ${newOrder.orderNumber} ACCEPTED - Assignment process continuing:`, assignError);
      assignmentMessage = "Order ACCEPTED! We're processing your request - guaranteed delivery! ✅";
    }

    res.status(201).json({
      success: true,
      order: newOrder,
      message: assignmentMessage,
      guaranteed: true,
      status: "ALL REQUESTS ACCEPTED - NO REJECTIONS EVER!"
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    res.status(400).json({ error: error.message || "Failed to create delivery order" });
  }
});

// Get customer's orders
router.get("/api/delivery/my-orders", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    const { status, limit = 20, offset = 0 } = req.query;

    let whereClause = eq(deliveryOrders.customerId, user.claims.sub);
    if (status && typeof status === 'string') {
      whereClause = and(whereClause, eq(deliveryOrders.status, status)) || whereClause;
    }

    const orders = await db.select({
      id: deliveryOrders.id,
      orderNumber: deliveryOrders.orderNumber,
      deliveryType: deliveryOrders.deliveryType,
      status: deliveryOrders.status,
      pickupAddress: deliveryOrders.pickupAddress,
      deliveryAddress: deliveryOrders.deliveryAddress,
      deliveryFee: deliveryOrders.deliveryFee,
      items: deliveryOrders.items,
      priority: deliveryOrders.priority,
      createdAt: deliveryOrders.createdAt,
      acceptedAt: deliveryOrders.acceptedAt,
      deliveredAt: deliveryOrders.deliveredAt,
      customerRating: deliveryOrders.customerRating,
      deliveryPersonnelName: sql<string>`CONCAT(dp_users.first_name, ' ', dp_users.last_name)`,
      deliveryPersonnelPhone: deliveryPersonnel.phoneNumber
    })
    .from(deliveryOrders)
    .leftJoin(deliveryPersonnel, eq(deliveryOrders.deliveryPersonnelId, deliveryPersonnel.id))
    .leftJoin(
      sql`${users} AS dp_users`, 
      eq(deliveryPersonnel.userId, sql`dp_users.id`)
    )
    .where(whereClause)
    .orderBy(desc(deliveryOrders.createdAt))
    .limit(Number(limit))
    .offset(Number(offset));

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ===== DELIVERY PERSONNEL ROUTES =====

// Get delivery personnel profile
router.get("/api/delivery/personnel/me", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    
    const [personnel] = await db.select({
      id: deliveryPersonnel.id,
      deliveryTypes: deliveryPersonnel.deliveryTypes,
      vehicleType: deliveryPersonnel.vehicleType,
      phoneNumber: deliveryPersonnel.phoneNumber,
      isActive: deliveryPersonnel.isActive,
      isOnline: deliveryPersonnel.isOnline,
      totalDeliveries: deliveryPersonnel.totalDeliveries,
      totalEarnings: deliveryPersonnel.totalEarnings,
      rating: deliveryPersonnel.rating,
      joinedAt: deliveryPersonnel.joinedAt,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email
    })
    .from(deliveryPersonnel)
    .innerJoin(users, eq(deliveryPersonnel.userId, users.id))
    .where(eq(deliveryPersonnel.userId, user.claims.sub));

    if (!personnel) {
      return res.status(404).json({ error: "Delivery personnel profile not found" });
    }

    // Get detailed stats
    const stats = await getDeliveryPersonnelStats(personnel.id);

    res.json({
      ...personnel,
      stats
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch personnel profile" });
  }
});

// Update delivery personnel online status
router.put("/api/delivery/personnel/status", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    const { isOnline } = req.body;

    const [personnel] = await db.select()
      .from(deliveryPersonnel)
      .where(eq(deliveryPersonnel.userId, user.claims.sub));

    if (!personnel) {
      return res.status(404).json({ error: "Delivery personnel not found" });
    }

    await updateDeliveryPersonnelStatus(personnel.id, isOnline);

    res.json({
      success: true,
      isOnline,
      message: isOnline ? "You are now online for deliveries" : "You are now offline"
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Update location
router.put("/api/delivery/personnel/location", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const [personnel] = await db.select()
      .from(deliveryPersonnel)
      .where(eq(deliveryPersonnel.userId, user.claims.sub));

    if (!personnel) {
      return res.status(404).json({ error: "Delivery personnel not found" });
    }

    await updateDeliveryPersonnelLocation(personnel.id, lat, lng);

    res.json({
      success: true,
      message: "Location updated successfully"
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update location" });
  }
});

// Get assigned orders for delivery personnel
router.get("/api/delivery/personnel/orders", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    const { status } = req.query;

    const [personnel] = await db.select()
      .from(deliveryPersonnel)
      .where(eq(deliveryPersonnel.userId, user.claims.sub));

    if (!personnel) {
      return res.status(404).json({ error: "Delivery personnel not found" });
    }

    let whereClause = eq(deliveryOrders.deliveryPersonnelId, personnel.id);
    if (status && typeof status === 'string') {
      whereClause = and(whereClause, eq(deliveryOrders.status, status)) || whereClause;
    }

    const orders = await db.select({
      id: deliveryOrders.id,
      orderNumber: deliveryOrders.orderNumber,
      deliveryType: deliveryOrders.deliveryType,
      status: deliveryOrders.status,
      pickupAddress: deliveryOrders.pickupAddress,
      deliveryAddress: deliveryOrders.deliveryAddress,
      pickupLat: deliveryOrders.pickupLat,
      pickupLng: deliveryOrders.pickupLng,
      deliveryLat: deliveryOrders.deliveryLat,
      deliveryLng: deliveryOrders.deliveryLng,
      deliveryContactName: deliveryOrders.deliveryContactName,
      deliveryContactPhone: deliveryOrders.deliveryContactPhone,
      pickupContactName: deliveryOrders.pickupContactName,
      pickupContactPhone: deliveryOrders.pickupContactPhone,
      items: deliveryOrders.items,
      deliveryFee: deliveryOrders.deliveryFee,
      priority: deliveryOrders.priority,
      pickupInstructions: deliveryOrders.pickupInstructions,
      deliveryInstructions: deliveryOrders.deliveryInstructions,
      createdAt: deliveryOrders.createdAt,
      acceptedAt: deliveryOrders.acceptedAt,
      scheduledPickupTime: deliveryOrders.scheduledPickupTime,
      scheduledDeliveryTime: deliveryOrders.scheduledDeliveryTime,
      customerName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`
    })
    .from(deliveryOrders)
    .innerJoin(users, eq(deliveryOrders.customerId, users.id))
    .where(whereClause)
    .orderBy(desc(deliveryOrders.createdAt))
    .limit(50);

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch assigned orders" });
  }
});

// Update order status (pickup, in-transit, delivered)
router.put("/api/delivery/orders/:orderId/status", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    const { orderId } = req.params;
    const { status, customerRating, customerFeedback } = req.body;

    const validStatuses = ['accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Verify order belongs to this delivery personnel
    const [personnel] = await db.select()
      .from(deliveryPersonnel)
      .where(eq(deliveryPersonnel.userId, user.claims.sub));

    if (!personnel) {
      return res.status(404).json({ error: "Delivery personnel not found" });
    }

    const [order] = await db.select()
      .from(deliveryOrders)
      .where(and(
        eq(deliveryOrders.id, orderId),
        eq(deliveryOrders.deliveryPersonnelId, personnel.id)
      ));

    if (!order) {
      return res.status(404).json({ error: "Order not found or not assigned to you" });
    }

    // Update order with appropriate timestamp
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (status === 'picked_up') {
      updateData.pickedUpAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
      if (customerRating) updateData.customerRating = customerRating;
      if (customerFeedback) updateData.customerFeedback = customerFeedback;
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    await db.update(deliveryOrders)
      .set(updateData)
      .where(eq(deliveryOrders.id, orderId));

    // Calculate earnings if delivered
    if (status === 'delivered') {
      try {
        await calculateOrderEarnings(orderId);
      } catch (earningsError) {
        console.error("Error calculating earnings:", earningsError);
      }
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      status
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Get earnings summary
router.get("/api/delivery/personnel/earnings", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    const { period = 'all' } = req.query;

    const [personnel] = await db.select()
      .from(deliveryPersonnel)
      .where(eq(deliveryPersonnel.userId, user.claims.sub));

    if (!personnel) {
      return res.status(404).json({ error: "Delivery personnel not found" });
    }

    // Get detailed earnings
    let whereClause = eq(deliveryEarnings.deliveryPersonnelId, personnel.id);
    
    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateCondition = sql`${deliveryEarnings.earnedAt} >= ${today.toISOString()}`;
      whereClause = and(whereClause, dateCondition) ?? whereClause;
    } else if (period === 'week') {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const dateCondition = sql`${deliveryEarnings.earnedAt} >= ${weekStart.toISOString()}`;
      whereClause = and(whereClause, dateCondition) ?? whereClause;
    } else if (period === 'month') {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const dateCondition = sql`${deliveryEarnings.earnedAt} >= ${monthStart.toISOString()}`;
      whereClause = and(whereClause, dateCondition) ?? whereClause;
    }

    const earnings = await db.select()
      .from(deliveryEarnings)
      .innerJoin(deliveryOrders, eq(deliveryEarnings.orderId, deliveryOrders.id))
      .where(whereClause)
      .orderBy(desc(deliveryEarnings.earnedAt))
      .limit(100);

    const summary = earnings.reduce((acc, earning) => {
      acc.totalEarnings += Number(earning.delivery_earnings.netEarning);
      acc.totalOrders += 1;
      acc.totalTips += Number(earning.delivery_earnings.tipEarning);
      acc.totalBonuses += Number(earning.delivery_earnings.distanceBonus) + 
                          Number(earning.delivery_earnings.timeBonus) + 
                          Number(earning.delivery_earnings.priorityBonus);
      return acc;
    }, {
      totalEarnings: 0,
      totalOrders: 0,
      totalTips: 0,
      totalBonuses: 0
    });

    res.json({
      summary,
      earnings: earnings.map(e => ({
        ...e.delivery_earnings,
        orderNumber: e.delivery_orders.orderNumber,
        deliveryType: e.delivery_orders.deliveryType
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch earnings" });
  }
});

// ===== ADMIN ROUTES =====

// Get all orders (admin/dispatcher)
router.get("/api/delivery/admin/orders", isAuthenticated, async (req, res) => {
  try {
    const { 
      status, 
      deliveryType, 
      dateFrom, 
      dateTo, 
      limit = 50, 
      offset = 0 
    } = req.query;

    const filters: any = {};
    if (status) filters.status = (status as string).split(',');
    if (deliveryType) filters.deliveryType = (deliveryType as string).split(',');
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);

    const orders = await getOrdersWithFilters(
      filters,
      Number(limit),
      Number(offset)
    );

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Register as delivery personnel
router.post("/api/delivery/personnel/register", isAuthenticated, async (req, res) => {
  try {
    const user = (req as any).user;
    
    // Check if already registered
    const [existing] = await db.select()
      .from(deliveryPersonnel)
      .where(eq(deliveryPersonnel.userId, user.claims.sub));

    if (existing) {
      return res.status(409).json({ error: "Already registered as delivery personnel" });
    }

    const personnelData = insertDeliveryPersonnelSchema.parse({
      ...req.body,
      userId: user.claims.sub
    });

    const [newPersonnel] = await db.insert(deliveryPersonnel)
      .values(personnelData)
      .returning();

    res.status(201).json({
      success: true,
      personnel: newPersonnel,
      message: "Successfully registered as delivery personnel"
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to register" });
  }
});

// Seed delivery system
router.post("/api/delivery/seed", async (req, res) => {
  try {
    const result = await seedDeliverySystem();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to seed delivery system"
    });
  }
});

export default router;