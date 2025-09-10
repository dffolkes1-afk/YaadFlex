// Vehicle Registration API Routes for Delaware Insurance Business
import express from "express";
import { eq, desc, and, isNull } from "drizzle-orm";
import { db } from "./db";
import { isAuthenticated } from "./replitAuth";
import { requirePermission } from "./rbac-service";
import {
  vehicleOwners,
  registrationVehicles,
  vehicleDocuments,
  insurancePolicies,
  vehicleInspections,
  registrationApplications,
  registrationPayments,
  insertVehicleOwnerSchema,
  insertRegistrationVehicleSchema,
  insertVehicleDocumentSchema,
  insertInsurancePolicySchema,
  insertVehicleInspectionSchema,
  insertRegistrationApplicationSchema,
  insertRegistrationPaymentSchema,
  securityLogs,
  insertSecurityLogSchema
} from "@shared/schema";

const router = express.Router();

// Audit logging helper
async function logAdminAction(userId: string, action: string, details: any, ipAddress?: string, userAgent?: string) {
  try {
    const logData = {
      userId,
      eventType: 'admin_action',
      severity: 'high',
      description: `Vehicle Registration Admin: ${action}`,
      metadata: details,
      ipAddress,
      userAgent
    };
    await db.insert(securityLogs).values(insertSecurityLogSchema.parse(logData));
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

// Data access control helper - Enhanced for current schema
async function verifyOwnership(userId: string, ownerId: string): Promise<boolean> {
  try {
    const owner = await db.query.vehicleOwners.findFirst({
      where: (o, { eq }) => eq(o.id, ownerId)
    });
    
    if (!owner) return false;
    
    // Check if owner has userId field (new schema) or fall back to email matching
    if ('userId' in owner && owner.userId) {
      return owner.userId === userId;
    }
    
    // Fallback: check if user's email matches owner email (temporary until migration complete)
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId)
    });
    
    return user?.email === owner.email;
  } catch (error) {
    console.error('Error verifying ownership:', error);
    return false;
  }
}

async function verifyVehicleOwnership(userId: string, vehicleId: string): Promise<boolean> {
  try {
    const vehicle = await db.query.registrationVehicles.findFirst({
      where: (v, { eq }) => eq(v.id, vehicleId),
      with: {
        vehicleOwners: true
      }
    });
    
    if (!vehicle?.vehicleOwners) return false;
    
    // Use the verifyOwnership function to check ownership
    return await verifyOwnership(userId, vehicle.ownerId);
  } catch (error) {
    console.error('Error verifying vehicle ownership:', error);
    return false;
  }
}

// 1) Owner create/update - For vehicle owners
router.post("/api/vehicle-registration/owners", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const validatedData = insertVehicleOwnerSchema.parse({
      ...req.body,
      userId // Ensure owner is linked to authenticated user
    });
    
    const [row] = await db.insert(vehicleOwners).values(validatedData).returning();
    res.json(row);
  } catch (error) {
    console.error("Error creating vehicle owner:", error);
    res.status(400).json({ error: "Failed to create vehicle owner" });
  }
});

// 2) Vehicle register (initial) - Start the process
router.post("/api/vehicle-registration/vehicles", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Verify ownership of the owner record
    if (req.body.ownerId && !(await verifyOwnership(userId, req.body.ownerId))) {
      return res.status(403).json({ error: "Access denied: Cannot register vehicle for another owner" });
    }
    
    const validatedData = insertRegistrationVehicleSchema.parse(req.body);
    
    const [row] = await db.insert(registrationVehicles).values(validatedData).returning();
    res.json(row);
  } catch (error) {
    console.error("Error registering vehicle:", error);
    res.status(400).json({ error: "Failed to register vehicle" });
  }
});

// 3) Upload supporting document (store in Object Storage; save URL here)
router.post("/api/vehicle-registration/vehicles/:vehicleId/documents", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Verify vehicle ownership
    if (!(await verifyVehicleOwnership(userId, req.params.vehicleId))) {
      return res.status(403).json({ error: "Access denied: Cannot upload documents for vehicle you don't own" });
    }
    
    const documentData = {
      vehicleId: req.params.vehicleId,
      type: req.body.type,
      title: req.body.title,
      url: req.body.url,
      notes: req.body.notes
    };
    
    const validatedData = insertVehicleDocumentSchema.parse(documentData);
    const [row] = await db.insert(vehicleDocuments).values(validatedData).returning();
    res.json(row);
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(400).json({ error: "Failed to upload document" });
  }
});

// 4) Insurance link - Connect insurance policy
router.post("/api/vehicle-registration/vehicles/:vehicleId/insurance", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Verify vehicle ownership
    if (!(await verifyVehicleOwnership(userId, req.params.vehicleId))) {
      return res.status(403).json({ error: "Access denied: Cannot link insurance for vehicle you don't own" });
    }
    
    const insuranceData = {
      vehicleId: req.params.vehicleId,
      insurer: req.body.insurer,
      policyNumber: req.body.policyNumber,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      coverage: req.body.coverage,
      monthlyPremium: req.body.monthlyPremium,
      managedByYaadFlex: req.body.managedByYaadFlex || false
    };
    
    const validatedData = insertInsurancePolicySchema.parse(insuranceData);
    const [row] = await db.insert(insurancePolicies).values(validatedData).returning();
    res.json(row);
  } catch (error) {
    console.error("Error linking insurance:", error);
    res.status(400).json({ error: "Failed to link insurance" });
  }
});

// 5) Vehicle inspection record - YaadFlex evaluator assessment
router.post("/api/vehicle-registration/vehicles/:vehicleId/inspection", isAuthenticated, requirePermission('vehicle:inspect'), async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Log admin action
    await logAdminAction(
      userId,
      'vehicle_inspection',
      { vehicleId: req.params.vehicleId, passed: req.body.passed },
      req.ip,
      req.get('User-Agent')
    );
    
    const inspectionData = {
      vehicleId: req.params.vehicleId,
      inspectorName: req.body.inspectorName,
      station: req.body.station,
      passed: Boolean(req.body.passed),
      reportUrl: req.body.reportUrl,
      conditionScore: req.body.conditionScore,
      evaluatorId: req.body.evaluatorId,
      evaluatorNotes: req.body.evaluatorNotes,
      photos: req.body.photos,
      inspectedAt: req.body.inspectedAt ? new Date(req.body.inspectedAt) : new Date()
    };
    
    const validatedData = insertVehicleInspectionSchema.parse(inspectionData);
    const [row] = await db.insert(vehicleInspections).values(validatedData).returning();
    res.json(row);
  } catch (error) {
    console.error("Error recording inspection:", error);
    res.status(400).json({ error: "Failed to record inspection" });
  }
});

// 6) Submit registration application (for red plate / ppv etc.)
router.post("/api/vehicle-registration/applications/submit", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Verify ownership of both vehicle and owner
    if (!(await verifyOwnership(userId, req.body.ownerId))) {
      return res.status(403).json({ error: "Access denied: Cannot submit application for another owner" });
    }
    
    if (!(await verifyVehicleOwnership(userId, req.body.vehicleId))) {
      return res.status(403).json({ error: "Access denied: Cannot submit application for vehicle you don't own" });
    }
    
    const applicationData = {
      vehicleId: req.body.vehicleId,
      ownerId: req.body.ownerId,
      desiredPlateType: req.body.desiredPlateType,
      insuranceProvider: req.body.insuranceProvider,
      estimatedValue: req.body.estimatedValue,
      status: "submitted",
      submittedAt: new Date()
    };
    
    const validatedData = insertRegistrationApplicationSchema.parse(applicationData);
    const [row] = await db.insert(registrationApplications).values(validatedData).returning();
    res.json(row);
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(400).json({ error: "Failed to submit application" });
  }
});

// 7) Admin/Delaware Authority: update application status
router.post("/api/vehicle-registration/applications/:id/status", isAuthenticated, requirePermission('admin:vehicle_registration'), async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Log admin action
    await logAdminAction(
      userId,
      'status_update',
      { applicationId: req.params.id, newStatus: req.body.status, remarks: req.body.remarks },
      req.ip,
      req.get('User-Agent')
    );
    
    const updateData = {
      status: req.body.status,
      remarks: req.body.remarks || null,
      approvedBy: userId, // Use authenticated user ID
      decidedAt: new Date(),
      updatedAt: new Date()
    };
    
    const [row] = await db.update(registrationApplications)
      .set(updateData)
      .where(eq(registrationApplications.id, req.params.id))
      .returning();
      
    if (!row) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    res.json(row);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(400).json({ error: "Failed to update application status" });
  }
});

// 8) Assign plate (upon approved/issued)
router.post("/api/vehicle-registration/vehicles/:vehicleId/assign-plate", isAuthenticated, requirePermission('admin:vehicle_registration'), async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Log admin action
    await logAdminAction(
      userId,
      'plate_assignment',
      { vehicleId: req.params.vehicleId, plateNumber: req.body.plateNumber, plateType: req.body.plateType },
      req.ip,
      req.get('User-Agent')
    );
    
    const updateData = {
      plateNumber: req.body.plateNumber,
      plateType: req.body.plateType,
      isActive: true,
      updatedAt: new Date()
    };
    
    const [row] = await db.update(registrationVehicles)
      .set(updateData)
      .where(eq(registrationVehicles.id, req.params.vehicleId))
      .returning();
      
    if (!row) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    res.json(row);
  } catch (error) {
    console.error("Error assigning plate:", error);
    res.status(400).json({ error: "Failed to assign plate" });
  }
});

// 9) Payments for registration fees (Stripe integration)
router.post("/api/vehicle-registration/applications/:applicationId/payments", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Verify user owns the application (through vehicle ownership)
    const application = await db.query.registrationApplications.findFirst({
      where: (app, { eq }) => eq(app.id, req.params.applicationId)
    });
    
    if (!application || !(await verifyOwnership(userId, application.ownerId))) {
      return res.status(403).json({ error: "Access denied: Cannot make payment for another owner's application" });
    }
    
    const paymentData = {
      applicationId: req.params.applicationId,
      provider: req.body.provider || "stripe",
      providerIntentId: req.body.providerIntentId,
      amount: req.body.amount,
      currency: req.body.currency || "USD",
      paymentType: req.body.paymentType,
      status: "pending",
      meta: req.body.meta || {}
    };
    
    const validatedData = insertRegistrationPaymentSchema.parse(paymentData);
    const [row] = await db.insert(registrationPayments).values(validatedData).returning();
    res.json(row);
  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(400).json({ error: "Failed to record payment" });
  }
});

// 10) List owner's vehicles + application status
router.get("/api/vehicle-registration/owners/:ownerId/vehicles", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Verify ownership or admin access
    if (!(await verifyOwnership(userId, req.params.ownerId))) {
      return res.status(403).json({ error: "Access denied: Cannot view another owner's vehicles" });
    }
    
    const vehicles = await db.query.registrationVehicles.findMany({
      where: (v, { eq }) => eq(v.ownerId, req.params.ownerId),
      with: {
        vehicleOwners: true,
        vehicleDocuments: true,
        insurancePolicies: true,
        vehicleInspections: true,
        registrationApplications: true
      }
    });
    
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching owner vehicles:", error);
    res.status(400).json({ error: "Failed to fetch vehicles" });
  }
});

// 11) Get all pending applications (for Delaware admin dashboard)
router.get("/api/vehicle-registration/applications/pending", isAuthenticated, requirePermission('admin:vehicle_registration'), async (req: any, res) => {
  try {
    const pendingApps = await db.query.registrationApplications.findMany({
      where: (app, { eq, or }) => or(
        eq(app.status, "submitted"),
        eq(app.status, "pending_verification")
      ),
      with: {
        registrationVehicles: {
          with: {
            vehicleOwners: true,
            vehicleDocuments: true,
            vehicleInspections: true
          }
        }
      },
      orderBy: [desc(registrationApplications.submittedAt)]
    });
    
    res.json(pendingApps);
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    res.status(400).json({ error: "Failed to fetch pending applications" });
  }
});

// 12) Get evaluator jobs (for parish-based evaluators)
router.get("/api/vehicle-registration/evaluator-jobs", isAuthenticated, requirePermission('vehicle:inspect'), async (req: any, res) => {
  try {
    const { parish, evaluatorId } = req.query;
    
    // Find applications needing inspection using simple SQL query
    const needsInspection = await db.select({
      applicationId: registrationApplications.id,
      vehicleId: registrationApplications.vehicleId,
      ownerId: registrationApplications.ownerId,
      status: registrationApplications.status,
      desiredPlateType: registrationApplications.desiredPlateType,
      submittedAt: registrationApplications.submittedAt,
      vehicleMake: registrationVehicles.make,
      vehicleModel: registrationVehicles.model,
      vehicleYear: registrationVehicles.year,
      vehicleColor: registrationVehicles.color,
      ownerName: vehicleOwners.fullName,
      ownerPhone: vehicleOwners.phone,
      ownerAddress: vehicleOwners.address
    })
    .from(registrationApplications)
    .innerJoin(registrationVehicles, eq(registrationApplications.vehicleId, registrationVehicles.id))
    .innerJoin(vehicleOwners, eq(registrationApplications.ownerId, vehicleOwners.id))
    .leftJoin(vehicleInspections, eq(vehicleInspections.vehicleId, registrationApplications.vehicleId))
    .where(and(
      eq(registrationApplications.status, "submitted"),
      isNull(vehicleInspections.id) // Only show applications without inspections
    ))
    .orderBy(desc(registrationApplications.submittedAt));
    
    res.json(needsInspection);
  } catch (error) {
    console.error("Error fetching evaluator jobs:", error);
    res.status(400).json({ error: "Failed to fetch evaluator jobs" });
  }
});

export default router;