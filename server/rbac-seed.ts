// RBAC + Area Locking Seed Script
import { db } from "./db";
import { COMPANY_INFO } from '@shared/company';
import { 
  users, 
  rbacRoles, 
  rbacUserRoles, 
  rbacPermissions, 
  rbacRolePermissions, 
  rbacWorkAreas 
} from "@shared/schema";
import crypto from "node:crypto";
import { eq, and } from "drizzle-orm";

export async function seedRbacSystem() {
  console.log("🔐 Seeding RBAC + Area Locking system...");

  try {
    // Create CEO user if doesn't exist
    const [existingCEO] = await db.select()
      .from(users)
      .where(eq(users.email, COMPANY_INFO.CONTACT.ceo_email));

    let ceoUserId: string;
    if (!existingCEO) {
      ceoUserId = crypto.randomUUID();
      await db.insert(users).values({
        id: ceoUserId,
        email: COMPANY_INFO.CONTACT.ceo_email,
        firstName: COMPANY_INFO.PARENT_COMPANY,
        lastName: "Executive",
        profileImageUrl: null
      });
      console.log("✅ Created CEO user");
    } else {
      ceoUserId = existingCEO.id;
      console.log("✅ CEO user already exists");
    }

    // Create other team members
    const teamMembers = [
      { id: crypto.randomUUID(), email: COMPANY_INFO.CONTACT.support_email, firstName: "BlackRock", lastName: "Support Executive" },
      { id: crypto.randomUUID(), email: COMPANY_INFO.CONTACT.legal_email, firstName: "BlackRock", lastName: "Legal Executive" },
      { id: crypto.randomUUID(), email: COMPANY_INFO.CONTACT.support_email, firstName: "Support", lastName: "Team" },
      { id: crypto.randomUUID(), email: COMPANY_INFO.CONTACT.business_email, firstName: "Business", lastName: "Team" }
    ];

    for (const member of teamMembers) {
      const [existing] = await db.select()
        .from(users)
        .where(eq(users.email, member.email));
      
      if (!existing) {
        await db.insert(users).values(member);
        console.log(`✅ Created user: ${member.firstName} ${member.lastName}`);
      }
    }

    // Create roles
    const roles = [
      { id: crypto.randomUUID(), code: "ceo", label: "BlackRock Executive / CEO" },
      { id: crypto.randomUUID(), code: "driver_reg", label: "Driver Registration Specialist" },
      { id: crypto.randomUUID(), code: "customer_support", label: "Customer Support Agent" },
      { id: crypto.randomUUID(), code: "finance_ops", label: "Finance Operations" },
      { id: crypto.randomUUID(), code: "area_manager", label: "Area Manager" },
      { id: crypto.randomUUID(), code: "payout_approver", label: "Payout Approver" }
    ];

    for (const role of roles) {
      const [existing] = await db.select()
        .from(rbacRoles)
        .where(eq(rbacRoles.code, role.code));
      
      if (!existing) {
        await db.insert(rbacRoles).values(role);
        console.log(`✅ Created role: ${role.label}`);
      }
    }

    // Create permissions
    const permissions = [
      { id: crypto.randomUUID(), code: "area:*", label: "Access any work area (scoped by lock)" },
      { id: crypto.randomUUID(), code: "area:driver_registration", label: "Access Driver Registration Area" },
      { id: crypto.randomUUID(), code: "area:customer_support", label: "Access Customer Support Area" },
      { id: crypto.randomUUID(), code: "area:finance_ops", label: "Access Finance Operations Area" },
      { id: crypto.randomUUID(), code: "area:ceo_dashboard", label: "Access CEO Dashboard Area" },
      { id: crypto.randomUUID(), code: "area:vendor_management", label: "Access Vendor Management Area" },
      { id: crypto.randomUUID(), code: "area:reset", label: "Reset/Override any work area lock" },
      { id: crypto.randomUUID(), code: "payout:approve", label: "Approve driver payouts" },
      { id: crypto.randomUUID(), code: "payout:reject", label: "Reject driver payouts" },
      { id: crypto.randomUUID(), code: "user:manage", label: "Manage user roles and permissions" },
      { id: crypto.randomUUID(), code: "system:admin", label: "System administration access" },
      { id: crypto.randomUUID(), code: "blackrock:compliance", label: "BlackRock Corporate Compliance Override" }
    ];

    for (const permission of permissions) {
      const [existing] = await db.select()
        .from(rbacPermissions)
        .where(eq(rbacPermissions.code, permission.code));
      
      if (!existing) {
        await db.insert(rbacPermissions).values(permission);
        console.log(`✅ Created permission: ${permission.label}`);
      }
    }

    // Get role IDs for permission assignment
    const [ceoRole] = await db.select().from(rbacRoles).where(eq(rbacRoles.code, "ceo"));
    const [driverRegRole] = await db.select().from(rbacRoles).where(eq(rbacRoles.code, "driver_reg"));
    const [supportRole] = await db.select().from(rbacRoles).where(eq(rbacRoles.code, "customer_support"));
    const [financeRole] = await db.select().from(rbacRoles).where(eq(rbacRoles.code, "finance_ops"));

    // Assign permissions to roles
    const rolePermissions = [
      // BlackRock Executive / CEO gets everything
      { id: crypto.randomUUID(), roleId: ceoRole.id, permissionCode: "area:*" },
      { id: crypto.randomUUID(), roleId: ceoRole.id, permissionCode: "area:reset" },
      { id: crypto.randomUUID(), roleId: ceoRole.id, permissionCode: "payout:approve" },
      { id: crypto.randomUUID(), roleId: ceoRole.id, permissionCode: "payout:reject" },
      { id: crypto.randomUUID(), roleId: ceoRole.id, permissionCode: "user:manage" },
      { id: crypto.randomUUID(), roleId: ceoRole.id, permissionCode: "system:admin" },
      { id: crypto.randomUUID(), roleId: ceoRole.id, permissionCode: "blackrock:compliance" },
      
      // Driver Registration Team
      { id: crypto.randomUUID(), roleId: driverRegRole.id, permissionCode: "area:driver_registration" },
      
      // Customer Support Team
      { id: crypto.randomUUID(), roleId: supportRole.id, permissionCode: "area:customer_support" },
      
      // Finance Team
      { id: crypto.randomUUID(), roleId: financeRole.id, permissionCode: "area:finance_ops" },
      { id: crypto.randomUUID(), roleId: financeRole.id, permissionCode: "payout:approve" },
      { id: crypto.randomUUID(), roleId: financeRole.id, permissionCode: "payout:reject" }
    ];

    for (const rolePermission of rolePermissions) {
      const existingPermissions = await db.select()
        .from(rbacRolePermissions)
        .where(and(
          eq(rbacRolePermissions.roleId, rolePermission.roleId),
          eq(rbacRolePermissions.permissionCode, rolePermission.permissionCode)
        ));
      
      if (existingPermissions.length === 0) {
        await db.insert(rbacRolePermissions).values(rolePermission);
      }
    }

    console.log("✅ Assigned permissions to roles");

    // Create work areas
    const workAreas = [
      { id: crypto.randomUUID(), code: "driver_registration", label: "Driver Registration & Onboarding" },
      { id: crypto.randomUUID(), code: "customer_support", label: "Customer Support & Help Desk" },
      { id: crypto.randomUUID(), code: "finance_ops", label: "Finance Operations & Payouts" },
      { id: crypto.randomUUID(), code: "ceo_dashboard", label: "CEO Dashboard & Executive Functions" },
      { id: crypto.randomUUID(), code: "vendor_management", label: "Vendor Management & Payments" },
      { id: crypto.randomUUID(), code: "marketplace_ops", label: "Marketplace Operations" },
      { id: crypto.randomUUID(), code: "ride_dispatch", label: "Ride Dispatch & Coordination" },
      { id: crypto.randomUUID(), code: "business_registration", label: "Business Registration & Verification" }
    ];

    for (const area of workAreas) {
      const [existing] = await db.select()
        .from(rbacWorkAreas)
        .where(eq(rbacWorkAreas.code, area.code));
      
      if (!existing) {
        await db.insert(rbacWorkAreas).values(area);
        console.log(`✅ Created work area: ${area.label}`);
      }
    }

    // Assign CEO role to CEO user
    const existingCEORole = await db.select()
      .from(rbacUserRoles)
      .where(and(eq(rbacUserRoles.userId, ceoUserId), eq(rbacUserRoles.roleId, ceoRole.id)));
    
    if (existingCEORole.length === 0) {
      await db.insert(rbacUserRoles).values({
        id: crypto.randomUUID(),
        userId: ceoUserId,
        roleId: ceoRole.id
      });
      console.log("✅ Assigned CEO role to CEO user");
    }

    console.log("🎉 RBAC + Area Locking system seeded successfully!");
    console.log("📋 Test User IDs:");
    console.log(`   CEO: ${ceoUserId} (${COMPANY_INFO.CONTACT.ceo_email})`);
    
    return {
      success: true,
      ceoUserId,
      message: "RBAC system initialized with roles, permissions, and work areas"
    };

  } catch (error) {
    console.error("❌ Failed to seed RBAC system:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}