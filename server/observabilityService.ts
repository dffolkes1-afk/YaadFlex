import { db } from "./db";
import { subsystems, systemErrors, systemHealthChecks, type InsertSystemError, type InsertSystemHealthCheck, type InsertSubsystem } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export class ObservabilityService {
  
  // Initialize default subsystems if they don't exist
  async initializeSubsystems() {
    const defaultSubsystems = [
      { id: nanoid(), name: 'frontend', description: 'React frontend application' },
      { id: nanoid(), name: 'backend', description: 'Express.js backend server' },
      { id: nanoid(), name: 'voice', description: 'Voice recognition system' },
      { id: nanoid(), name: 'auth', description: 'Authentication system' },
      { id: nanoid(), name: 'database', description: 'PostgreSQL database' },
      { id: nanoid(), name: 'payments', description: 'Payment processing system' },
      { id: nanoid(), name: 'websocket', description: 'WebSocket communication' }
    ];

    for (const subsystem of defaultSubsystems) {
      try {
        const existing = await db.select().from(subsystems).where(eq(subsystems.name, subsystem.name)).limit(1);
        if (existing.length === 0) {
          await db.insert(subsystems).values(subsystem);
        }
      } catch (error) {
        console.log(`Note: Subsystem ${subsystem.name} may already exist or schema not ready yet`);
      }
    }
  }

  // Log a system error
  async logError(error: {
    subsystemName: string;
    errorType: 'critical' | 'error' | 'warning' | 'info';
    component: string;
    message: string;
    location?: string;
    stackTrace?: string;
    metadata?: any;
  }): Promise<string | null> {
    try {
      // Get subsystem ID
      const subsystemResult = await db.select().from(subsystems).where(eq(subsystems.name, error.subsystemName)).limit(1);
      if (subsystemResult.length === 0) {
        console.log(`Subsystem ${error.subsystemName} not found, creating it...`);
        const newSubsystem: InsertSubsystem = {
          id: nanoid(),
          name: error.subsystemName,
          description: `Auto-created for error logging`
        };
        await db.insert(subsystems).values(newSubsystem);
        return this.logError(error); // Retry
      }

      const subsystemId = subsystemResult[0].id;

      // Check if similar error exists recently (last 5 minutes)
      const recentErrors = await db.select()
        .from(systemErrors)
        .where(
          and(
            eq(systemErrors.subsystemId, subsystemId),
            eq(systemErrors.component, error.component),
            eq(systemErrors.message, error.message),
            eq(systemErrors.isResolved, false)
          )
        )
        .orderBy(desc(systemErrors.lastOccurred))
        .limit(1);

      if (recentErrors.length > 0) {
        // Update existing error count and timestamp
        const existingError = recentErrors[0];
        await db.update(systemErrors)
          .set({
            count: (existingError.count || 0) + 1,
            lastOccurred: new Date()
          })
          .where(eq(systemErrors.id, existingError.id));
        
        return existingError.id;
      } else {
        // Create new error record
        const newError: InsertSystemError = {
          id: nanoid(),
          subsystemId,
          errorType: error.errorType,
          component: error.component,
          message: error.message,
          location: error.location,
          stackTrace: error.stackTrace,
          metadata: error.metadata,
          count: 1,
          isResolved: false,
          firstOccurred: new Date(),
          lastOccurred: new Date()
        };

        const result = await db.insert(systemErrors).values(newError).returning();
        return result[0].id;
      }
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
      return null;
    }
  }

  // Log system health check
  async logHealthCheck(healthCheck: {
    subsystemName: string;
    status: 'healthy' | 'warning' | 'error' | 'offline';
    responseTime?: number;
    uptime?: string;
    details?: string;
  }) {
    try {
      // Get subsystem ID
      const subsystemResult = await db.select().from(subsystems).where(eq(subsystems.name, healthCheck.subsystemName)).limit(1);
      if (subsystemResult.length === 0) {
        console.log(`Subsystem ${healthCheck.subsystemName} not found for health check`);
        return null;
      }

      const subsystemId = subsystemResult[0].id;

      const newHealthCheck: InsertSystemHealthCheck = {
        id: nanoid(),
        subsystemId,
        status: healthCheck.status,
        responseTime: healthCheck.responseTime,
        uptime: healthCheck.uptime,
        details: healthCheck.details,
        checkedAt: new Date()
      };

      const result = await db.insert(systemHealthChecks).values(newHealthCheck).returning();
      return result[0].id;
    } catch (dbError) {
      console.error('Failed to log health check to database:', dbError);
      return null;
    }
  }

  // Get recent errors for a subsystem
  async getRecentErrors(subsystemName?: string, limit: number = 20) {
    try {
      let query = db.select({
        error: systemErrors,
        subsystem: subsystems
      })
      .from(systemErrors)
      .leftJoin(subsystems, eq(systemErrors.subsystemId, subsystems.id))
      .where(eq(systemErrors.isResolved, false))
      .orderBy(desc(systemErrors.lastOccurred))
      .limit(limit);

      if (subsystemName) {
        query = db.select({
          error: systemErrors,
          subsystem: subsystems
        })
        .from(systemErrors)
        .leftJoin(subsystems, eq(systemErrors.subsystemId, subsystems.id))
        .where(
          and(
            eq(systemErrors.isResolved, false),
            eq(subsystems.name, subsystemName)
          )
        )
        .orderBy(desc(systemErrors.lastOccurred))
        .limit(limit);
      }

      const results = await query;
      return results.map(r => ({
        ...r.error,
        subsystemName: r.subsystem?.name || 'unknown'
      }));
    } catch (dbError) {
      console.error('Failed to get recent errors from database:', dbError);
      return [];
    }
  }

  // Mark error as resolved
  async markErrorResolved(errorId: string) {
    try {
      await db.update(systemErrors)
        .set({
          isResolved: true,
          resolvedAt: new Date()
        })
        .where(eq(systemErrors.id, errorId));
      return true;
    } catch (dbError) {
      console.error('Failed to mark error as resolved:', dbError);
      return false;
    }
  }

  // Get system health summary
  async getSystemHealthSummary() {
    try {
      // Get latest health check for each subsystem
      const healthChecks = await db.select({
        subsystem: subsystems,
        lastCheck: systemHealthChecks
      })
      .from(subsystems)
      .leftJoin(
        systemHealthChecks,
        eq(subsystems.id, systemHealthChecks.subsystemId)
      )
      .where(eq(subsystems.isActive, true));

      // Group by subsystem and get latest health check
      const healthSummary = [];
      const subsystemMap = new Map();

      for (const item of healthChecks) {
        const subsystemName = item.subsystem.name;
        if (!subsystemMap.has(subsystemName) || 
            (item.lastCheck && item.lastCheck.checkedAt && 
             item.lastCheck.checkedAt > subsystemMap.get(subsystemName).checkedAt)) {
          subsystemMap.set(subsystemName, {
            name: subsystemName,
            status: item.lastCheck?.status || 'unknown',
            details: item.lastCheck?.details || 'No health checks recorded',
            responseTime: item.lastCheck?.responseTime,
            uptime: item.lastCheck?.uptime,
            checkedAt: item.lastCheck?.checkedAt || new Date(0)
          });
        }
      }

      return Array.from(subsystemMap.values());
    } catch (dbError) {
      console.error('Failed to get system health summary:', dbError);
      return [];
    }
  }

  // Get error statistics
  async getErrorStats() {
    try {
      const stats = await db.select({
        errorType: systemErrors.errorType,
        count: systemErrors.count
      })
      .from(systemErrors)
      .where(eq(systemErrors.isResolved, false));

      const summary = {
        critical: 0,
        error: 0,
        warning: 0,
        info: 0,
        total: 0
      };

      for (const stat of stats) {
        summary[stat.errorType as keyof typeof summary] += stat.count || 1;
        summary.total += stat.count || 1;
      }

      return summary;
    } catch (dbError) {
      console.error('Failed to get error statistics:', dbError);
      return { critical: 0, error: 0, warning: 0, info: 0, total: 0 };
    }
  }
}

// Global instance
export const observabilityService = new ObservabilityService();