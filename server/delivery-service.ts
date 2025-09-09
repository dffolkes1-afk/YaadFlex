// YaadFlex Universal Delivery Network Service
import { db } from "./db";
import { 
  deliveryPersonnel, 
  deliveryOrders, 
  deliveryEarnings, 
  deliveryCategories,
  deliveryAreas,
  deliveryRoutes,
  deliveryReviews,
  users
} from "@shared/schema";
import { eq, and, or, sql, desc, asc, gte, lte } from "drizzle-orm";
import crypto from "node:crypto";

export interface DeliveryPersonnelStats {
  totalDeliveries: number;
  totalEarnings: number;
  averageRating: number;
  activeOrders: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
}

export interface OrderSearchFilters {
  status?: string[];
  deliveryType?: string[];
  area?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minValue?: number;
  maxValue?: number;
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `DEL-${timestamp}-${random}`.toUpperCase();
}

// Calculate delivery fee based on category and distance
export async function calculateDeliveryFee(
  categoryCode: string, 
  distance: number, 
  areaCode?: string
): Promise<number> {
  const [category] = await db.select()
    .from(deliveryCategories)
    .where(eq(deliveryCategories.code, categoryCode));
  
  if (!category) {
    throw new Error(`Delivery category '${categoryCode}' not found`);
  }

  let baseFee = Number(category.baseRate) + (Number(category.ratePerKm) * distance);
  
  // Apply minimum fee
  baseFee = Math.max(baseFee, Number(category.minFee));
  
  // Apply maximum fee if set
  if (category.maxFee) {
    baseFee = Math.min(baseFee, Number(category.maxFee));
  }

  // Apply area multiplier if specified
  if (areaCode) {
    const [area] = await db.select()
      .from(deliveryAreas)
      .where(eq(deliveryAreas.code, areaCode));
    
    if (area) {
      baseFee *= Number(area.deliveryFeeMultiplier);
    }
  }

  return Math.round(baseFee * 100) / 100; // Round to 2 decimal places
}

// Find available delivery personnel for an order
export async function findAvailableDeliveryPersonnel(
  deliveryType: string,
  pickupLat: number,
  pickupLng: number,
  vehicleTypes?: string[]
) {
  const availablePersonnel = await db.select({
    id: deliveryPersonnel.id,
    userId: deliveryPersonnel.userId,
    deliveryTypes: deliveryPersonnel.deliveryTypes,
    vehicleType: deliveryPersonnel.vehicleType,
    currentLat: deliveryPersonnel.currentLat,
    currentLng: deliveryPersonnel.currentLng,
    rating: deliveryPersonnel.rating,
    totalDeliveries: deliveryPersonnel.totalDeliveries,
    phoneNumber: deliveryPersonnel.phoneNumber,
    firstName: users.firstName,
    lastName: users.lastName
  })
  .from(deliveryPersonnel)
  .innerJoin(users, eq(deliveryPersonnel.userId, users.id))
  .where(and(
    eq(deliveryPersonnel.isActive, true),
    eq(deliveryPersonnel.isOnline, true),
    sql`${deliveryPersonnel.deliveryTypes} ? ${deliveryType}` // Check if deliveryType exists in jsonb array
  ));

  // Filter by vehicle type if specified
  const filtered = vehicleTypes 
    ? availablePersonnel.filter(p => vehicleTypes.includes(p.vehicleType))
    : availablePersonnel;

  // Sort by distance (if GPS coordinates available) and rating
  return filtered.map(person => ({
    ...person,
    distance: person.currentLat && person.currentLng 
      ? calculateDistance(
          pickupLat, pickupLng, 
          Number(person.currentLat), Number(person.currentLng)
        )
      : null
  }))
  .sort((a, b) => {
    // Prioritize by rating, then by distance
    if (a.distance && b.distance) {
      return (Number(b.rating) - Number(a.rating)) || (a.distance - b.distance);
    }
    return Number(b.rating) - Number(a.rating);
  });
}

// Calculate distance between two GPS coordinates (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Auto-assign order to best available delivery personnel
export async function autoAssignOrder(orderId: string): Promise<string | null> {
  const [order] = await db.select()
    .from(deliveryOrders)
    .where(eq(deliveryOrders.id, orderId));

  if (!order || order.status !== 'pending') {
    throw new Error('Order not found or not in pending status');
  }

  const availablePersonnel = await findAvailableDeliveryPersonnel(
    order.deliveryType,
    Number(order.pickupLat),
    Number(order.pickupLng)
  );

  if (availablePersonnel.length === 0) {
    return null; // No available personnel
  }

  // Assign to the best-ranked personnel
  const bestPersonnel = availablePersonnel[0];
  
  await db.update(deliveryOrders)
    .set({
      deliveryPersonnelId: bestPersonnel.id,
      status: 'accepted',
      acceptedAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(deliveryOrders.id, orderId));

  return bestPersonnel.id;
}

// Get delivery personnel statistics
export async function getDeliveryPersonnelStats(personnelId: string): Promise<DeliveryPersonnelStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [stats] = await db.select({
    totalDeliveries: sql<number>`COUNT(${deliveryOrders.id})`,
    completedDeliveries: sql<number>`COUNT(CASE WHEN ${deliveryOrders.status} = 'delivered' THEN 1 END)`,
    totalEarnings: sql<number>`COALESCE(SUM(${deliveryEarnings.netEarning}), 0)`,
    todayEarnings: sql<number>`COALESCE(SUM(CASE WHEN ${deliveryEarnings.earnedAt} >= ${today.toISOString()} THEN ${deliveryEarnings.netEarning} ELSE 0 END), 0)`,
    weeklyEarnings: sql<number>`COALESCE(SUM(CASE WHEN ${deliveryEarnings.earnedAt} >= ${weekStart.toISOString()} THEN ${deliveryEarnings.netEarning} ELSE 0 END), 0)`,
    monthlyEarnings: sql<number>`COALESCE(SUM(CASE WHEN ${deliveryEarnings.earnedAt} >= ${monthStart.toISOString()} THEN ${deliveryEarnings.netEarning} ELSE 0 END), 0)`,
    averageRating: sql<number>`COALESCE(AVG(${deliveryReviews.rating}), 5.0)`,
  })
  .from(deliveryOrders)
  .leftJoin(deliveryEarnings, eq(deliveryOrders.id, deliveryEarnings.orderId))
  .leftJoin(deliveryReviews, eq(deliveryOrders.id, deliveryReviews.orderId))
  .where(eq(deliveryOrders.deliveryPersonnelId, personnelId))
  .groupBy();

  const [activeOrdersResult] = await db.select({
    activeOrders: sql<number>`COUNT(*)`
  })
  .from(deliveryOrders)
  .where(and(
    eq(deliveryOrders.deliveryPersonnelId, personnelId),
    or(
      eq(deliveryOrders.status, 'accepted'),
      eq(deliveryOrders.status, 'picked_up'),
      eq(deliveryOrders.status, 'in_transit')
    )
  ));

  return {
    totalDeliveries: stats?.completedDeliveries || 0,
    totalEarnings: Number(stats?.totalEarnings || 0),
    averageRating: Number(stats?.averageRating || 5.0),
    activeOrders: activeOrdersResult?.activeOrders || 0,
    todayEarnings: Number(stats?.todayEarnings || 0),
    weeklyEarnings: Number(stats?.weeklyEarnings || 0),
    monthlyEarnings: Number(stats?.monthlyEarnings || 0),
  };
}

// Calculate earnings for completed order
export async function calculateOrderEarnings(orderId: string): Promise<void> {
  const [order] = await db.select()
    .from(deliveryOrders)
    .where(eq(deliveryOrders.id, orderId));

  if (!order || order.status !== 'delivered' || !order.deliveryPersonnelId) {
    throw new Error('Order not eligible for earnings calculation');
  }

  // Get delivery route information for distance bonus
  const [route] = await db.select()
    .from(deliveryRoutes)
    .where(eq(deliveryRoutes.orderId, orderId));

  const baseEarning = Number(order.deliveryFee) * 0.85; // Driver gets 85% of delivery fee
  let distanceBonus = 0;
  let timeBonus = 0;
  const tipEarning = Number(order.tip || 0);
  
  // Distance bonus: $0.50 per km over 5km
  if (route?.actualDistance && Number(route.actualDistance) > 5) {
    distanceBonus = (Number(route.actualDistance) - 5) * 0.50;
  }

  // Time bonus for quick deliveries (under estimated time)
  if (route?.actualDuration && route?.estimatedDuration && 
      route.actualDuration < route.estimatedDuration) {
    timeBonus = 2.00; // $2 bonus for fast delivery
  }

  // Priority bonus
  let priorityBonus = 0;
  if (order.priority === 'high') priorityBonus = 3.00;
  if (order.priority === 'urgent') priorityBonus = 5.00;

  const totalEarning = baseEarning + distanceBonus + timeBonus + tipEarning + priorityBonus;
  const platformFee = totalEarning * 0.15; // 15% platform fee
  const netEarning = totalEarning - platformFee;

  // Check if earnings already calculated
  const [existingEarning] = await db.select()
    .from(deliveryEarnings)
    .where(eq(deliveryEarnings.orderId, orderId));

  if (!existingEarning) {
    await db.insert(deliveryEarnings).values({
      id: crypto.randomUUID(),
      deliveryPersonnelId: order.deliveryPersonnelId,
      orderId: orderId,
      baseEarning: baseEarning.toFixed(2),
      distanceBonus: distanceBonus.toFixed(2),
      timeBonus: timeBonus.toFixed(2),
      tipEarning: tipEarning.toFixed(2),
      priorityBonus: priorityBonus.toFixed(2),
      totalEarning: totalEarning.toFixed(2),
      platformFee: platformFee.toFixed(2),
      netEarning: netEarning.toFixed(2),
    });

    // Update delivery personnel total earnings
    await db.update(deliveryPersonnel)
      .set({
        totalEarnings: sql`${deliveryPersonnel.totalEarnings} + ${netEarning}`,
        totalDeliveries: sql`${deliveryPersonnel.totalDeliveries} + 1`,
        updatedAt: new Date()
      })
      .where(eq(deliveryPersonnel.id, order.deliveryPersonnelId));
  }
}

// Get orders with filters
export async function getOrdersWithFilters(
  filters: OrderSearchFilters,
  limit: number = 50,
  offset: number = 0
) {
  let whereClause = sql`1=1`; // Base condition

  if (filters.status?.length) {
    whereClause = sql`${whereClause} AND ${deliveryOrders.status} IN ${filters.status}`;
  }

  if (filters.deliveryType?.length) {
    whereClause = sql`${whereClause} AND ${deliveryOrders.deliveryType} IN ${filters.deliveryType}`;
  }

  if (filters.dateFrom) {
    whereClause = sql`${whereClause} AND ${deliveryOrders.createdAt} >= ${filters.dateFrom}`;
  }

  if (filters.dateTo) {
    whereClause = sql`${whereClause} AND ${deliveryOrders.createdAt} <= ${filters.dateTo}`;
  }

  if (filters.minValue) {
    whereClause = sql`${whereClause} AND ${deliveryOrders.totalValue} >= ${filters.minValue}`;
  }

  if (filters.maxValue) {
    whereClause = sql`${whereClause} AND ${deliveryOrders.totalValue} <= ${filters.maxValue}`;
  }

  return await db.select({
    id: deliveryOrders.id,
    orderNumber: deliveryOrders.orderNumber,
    deliveryType: deliveryOrders.deliveryType,
    status: deliveryOrders.status,
    pickupAddress: deliveryOrders.pickupAddress,
    deliveryAddress: deliveryOrders.deliveryAddress,
    deliveryFee: deliveryOrders.deliveryFee,
    totalValue: deliveryOrders.totalValue,
    priority: deliveryOrders.priority,
    createdAt: deliveryOrders.createdAt,
    customerName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
    deliveryPersonnelName: sql<string>`CONCAT(dp_user.first_name, ' ', dp_user.last_name)`,
  })
  .from(deliveryOrders)
  .leftJoin(users, eq(deliveryOrders.customerId, users.id))
  .leftJoin(deliveryPersonnel, eq(deliveryOrders.deliveryPersonnelId, deliveryPersonnel.id))
.leftJoin(
    sql`${users} AS dp_user`, 
    eq(deliveryPersonnel.userId, sql`dp_user.id`)
  )
  .where(whereClause)
  .orderBy(desc(deliveryOrders.createdAt))
  .limit(limit)
  .offset(offset);
}

// Update delivery personnel location
export async function updateDeliveryPersonnelLocation(
  personnelId: string, 
  lat: number, 
  lng: number
): Promise<void> {
  await db.update(deliveryPersonnel)
    .set({
      currentLat: lat.toString(),
      currentLng: lng.toString(),
      lastActiveAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(deliveryPersonnel.id, personnelId));
}

// Update delivery personnel online status
export async function updateDeliveryPersonnelStatus(
  personnelId: string, 
  isOnline: boolean
): Promise<void> {
  await db.update(deliveryPersonnel)
    .set({
      isOnline,
      lastActiveAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(deliveryPersonnel.id, personnelId));
}