// Broker Network API Routes for YaadFlex Delaware Insurance Business
import express from "express";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { isAuthenticated } from "./replitAuth";
import {
  brokers,
  brokerRegions,
  regServiceCatalog,
  regRequests,
  regEvents,
  regAssignments,
  regPayouts,
  regSLA,
  registrationApplications,
  insertBrokerSchema,
  insertBrokerRegionSchema,
  insertRegServiceCatalogSchema,
  insertRegRequestSchema,
  insertRegEventSchema,
  insertRegAssignmentSchema,
  insertRegPayoutSchema
} from "@shared/schema";

const router = express.Router();

// Commission policy - 60% to broker, 40% to YaadFlex
const COMMISSION = {
  brokerShare: 0.6,
  yardflexShare: 0.4
};

// Helper to create event logs
async function logEvent(requestId: string, type: string, meta: any = {}) {
  await db.insert(regEvents).values({
    requestId,
    type,
    meta
  });
}

// 1) Create or update broker (Protected - Admin only)
router.post("/api/brokers", isAuthenticated, async (req: any, res) => {
  try {
    const validatedData = insertBrokerSchema.parse(req.body);
    
    const [row] = await db.insert(brokers).values(validatedData)
      .onConflictDoUpdate({
        target: brokers.email,
        set: {
          fullName: validatedData.fullName,
          phone: validatedData.phone,
          govId: validatedData.govId,
          verified: validatedData.verified,
          isActive: validatedData.isActive,
          updatedAt: new Date()
        }
      }).returning();
      
    res.json(row);
  } catch (error) {
    console.error("Error creating broker:", error);
    res.status(400).json({ error: "Failed to create broker" });
  }
});

// 2) Add broker regions (Protected - Admin only)
router.post("/api/brokers/:brokerId/regions", isAuthenticated, async (req, res) => {
  try {
    const regionData = {
      brokerId: req.params.brokerId,
      parish: req.body.parish,
      active: true
    };
    
    const validatedData = insertBrokerRegionSchema.parse(regionData);
    const [row] = await db.insert(brokerRegions).values(validatedData).returning();
    res.json(row);
  } catch (error) {
    console.error("Error adding broker region:", error);
    res.status(400).json({ error: "Failed to add broker region" });
  }
});

// 3) Service catalog management (Protected - Admin only)
router.post("/api/reg/services", isAuthenticated, async (req, res) => {
  try {
    const validatedData = insertRegServiceCatalogSchema.parse(req.body);
    const [row] = await db.insert(regServiceCatalog).values(validatedData).returning();
    res.json(row);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(400).json({ error: "Failed to create service" });
  }
});

// 4) Get available services (Public)
router.get("/api/reg/services", async (_req, res) => {
  try {
    const services = await db.select()
      .from(regServiceCatalog)
      .where(eq(regServiceCatalog.active, true));
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(400).json({ error: "Failed to fetch services" });
  }
});

// 5) Create registration request (Protected - Vehicle owner)
router.post("/api/reg/requests", isAuthenticated, async (req, res) => {
  try {
    // Get service pricing
    const [svc] = await db.select()
      .from(regServiceCatalog)
      .where(eq(regServiceCatalog.code, req.body.serviceCode));
      
    if (!svc) {
      return res.status(400).json({ error: "Unknown service code" });
    }
    
    const requestData = {
      ...req.body,
      quotedFeeJMD: Number(svc.baseFeeJMD),
      govFeeJMD: svc.estGovFeeJMD,
      status: "pending_payment"
    };
    
    const validatedData = insertRegRequestSchema.parse(requestData);
    const [row] = await db.insert(regRequests).values(validatedData).returning();
    
    await logEvent(row.id, "QUOTE_CREATED", { 
      quoted: svc.baseFeeJMD, 
      govFee: svc.estGovFeeJMD 
    });
    
    res.json(row);
  } catch (error) {
    console.error("Error creating registration request:", error);
    res.status(400).json({ error: "Failed to create registration request" });
  }
});

// 6) List registration requests (Protected - Admin/Broker)
router.get("/api/reg/requests", isAuthenticated, async (req, res) => {
  try {
    const parish = req.query.parish as string | undefined;
    
    let query = db.select({
      id: regRequests.id,
      applicationId: regRequests.applicationId,
      ownerId: regRequests.ownerId,
      vehicleId: regRequests.vehicleId,
      serviceCode: regRequests.serviceCode,
      parish: regRequests.parish,
      pickupAddress: regRequests.pickupAddress,
      deliveryAddress: regRequests.deliveryAddress,
      notes: regRequests.notes,
      quotedFeeJMD: regRequests.quotedFeeJMD,
      govFeeJMD: regRequests.govFeeJMD,
      status: regRequests.status,
      createdAt: regRequests.createdAt,
      serviceName: regServiceCatalog.name
    })
    .from(regRequests)
    .innerJoin(regServiceCatalog, eq(regRequests.serviceCode, regServiceCatalog.code))
    .orderBy(desc(regRequests.createdAt));
    
    const requests = await query;
    
    // Filter by parish if specified
    const filteredRequests = parish 
      ? requests.filter(r => r.parish === parish)
      : requests;
      
    res.json(filteredRequests);
  } catch (error) {
    console.error("Error fetching registration requests:", error);
    res.status(400).json({ error: "Failed to fetch registration requests" });
  }
});

// 7) Assign request to broker (Protected - Admin only)
router.post("/api/reg/requests/:id/assign", isAuthenticated, async (req, res) => {
  try {
    const requestId = req.params.id;
    const assignmentData = {
      requestId,
      brokerId: req.body.brokerId,
      status: "assigned"
    };
    
    const validatedData = insertRegAssignmentSchema.parse(assignmentData);
    const [assignment] = await db.insert(regAssignments).values(validatedData).returning();
    
    // Update request status
    await db.update(regRequests)
      .set({ status: "assigned", updatedAt: new Date() })
      .where(eq(regRequests.id, requestId));
    
    await logEvent(requestId, "ASSIGNED", { brokerId: req.body.brokerId });
    
    res.json(assignment);
  } catch (error) {
    console.error("Error assigning request:", error);
    res.status(400).json({ error: "Failed to assign request" });
  }
});

// 8) Update assignment status (Protected - Assigned broker)
router.post("/api/reg/assignments/:id/status", isAuthenticated, async (req, res) => {
  try {
    const updateData: any = {
      status: req.body.status,
      updatedAt: new Date()
    };
    
    if (req.body.pickupAt) updateData.pickupAt = new Date(req.body.pickupAt);
    if (req.body.deliveredAt) updateData.deliveredAt = new Date(req.body.deliveredAt);
    
    const [assignment] = await db.update(regAssignments)
      .set(updateData)
      .where(eq(regAssignments.id, req.params.id))
      .returning();
      
    if (assignment) {
      await logEvent(assignment.requestId, `ASSIGN_${req.body.status.toUpperCase()}`, updateData);
    }
    
    res.json(assignment);
  } catch (error) {
    console.error("Error updating assignment status:", error);
    res.status(400).json({ error: "Failed to update assignment status" });
  }
});

// 9) Mark request status (Protected - Admin/Broker)
router.post("/api/reg/requests/:id/status", isAuthenticated, async (req, res) => {
  try {
    const [request] = await db.update(regRequests)
      .set({ status: req.body.status, updatedAt: new Date() })
      .where(eq(regRequests.id, req.params.id))
      .returning();
      
    await logEvent(req.params.id, req.body.status.toUpperCase(), {
      previousStatus: request.status,
      newStatus: req.body.status
    });
    
    res.json(request);
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(400).json({ error: "Failed to update request status" });
  }
});

// 10) Complete request and trigger payout (Protected - Admin)
router.post("/api/reg/requests/:id/complete", isAuthenticated, async (req, res) => {
  try {
    const requestId = req.params.id;
    
    // Mark request as delivered
    const [request] = await db.update(regRequests)
      .set({ status: "delivered", updatedAt: new Date() })
      .where(eq(regRequests.id, requestId))
      .returning();
      
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    
    // Find assignment
    const [assignment] = await db.select()
      .from(regAssignments)
      .where(eq(regAssignments.requestId, requestId));
      
    if (!assignment) {
      return res.status(400).json({ error: "No assignment found" });
    }
    
    // Calculate broker commission (60% of YaadFlex fee)
    const brokerAmount = Math.round(Number(request.quotedFeeJMD || 0) * COMMISSION.brokerShare);
    
    const payoutData = {
      requestId,
      brokerId: assignment.brokerId,
      amountJMD: brokerAmount,
      status: "pending" as const,
      provider: "stripe_connect"
    };
    
    const validatedPayoutData = insertRegPayoutSchema.parse(payoutData);
    const [payout] = await db.insert(regPayouts).values(validatedPayoutData).returning();
    
    await logEvent(requestId, "DELIVERED", { brokerAmount });
    
    res.json({ request, payout });
  } catch (error) {
    console.error("Error completing request:", error);
    res.status(400).json({ error: "Failed to complete request" });
  }
});

// 11) Get available brokers for parish (Public)
router.get("/api/brokers/available", async (req, res) => {
  try {
    const parish = req.query.parish as string;
    
    if (!parish) {
      return res.status(400).json({ error: "Parish parameter required" });
    }
    
    const availableBrokers = await db.select({
      id: brokers.id,
      fullName: brokers.fullName,
      rating: brokers.rating,
      verified: brokers.verified,
      parish: brokerRegions.parish
    })
    .from(brokers)
    .innerJoin(brokerRegions, eq(brokers.id, brokerRegions.brokerId))
    .where(eq(brokerRegions.parish, parish));
    
    res.json(availableBrokers);
  } catch (error) {
    console.error("Error fetching available brokers:", error);
    res.status(400).json({ error: "Failed to fetch available brokers" });
  }
});

// 12) Webhook for payout status updates (Stripe Connect)
router.post("/webhooks/payouts", async (req, res) => {
  try {
    // In production, validate Stripe signature here
    const { payoutId, providerPayoutId, status } = req.body;
    
    const [payout] = await db.update(regPayouts)
      .set({ 
        status, 
        providerPayoutId
      })
      .where(eq(regPayouts.id, payoutId))
      .returning();
      
    if (payout) {
      await logEvent(payout.requestId, "PAYOUT_" + status.toUpperCase(), {
        payoutId,
        providerPayoutId,
        amount: payout.amountJMD
      });
    }
    
    res.json(payout);
  } catch (error) {
    console.error("Error processing payout webhook:", error);
    res.status(400).json({ error: "Failed to process payout webhook" });
  }
});

export default router;