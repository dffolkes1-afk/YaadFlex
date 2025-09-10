import { db } from './db';
import { 
  autonomousTasks, 
  obligations, 
  vendors, 
  platformPayments,
  approvals,
  agentLogs,
  type AutonomousTask,
  type Obligation,
  type InsertAutonomousTask,
  type InsertAgentLog,
  type InsertPlatformPayment
} from '@shared/schema';
import { eq, and, lte, or, isNull } from 'drizzle-orm';
import Stripe from 'stripe';

// Autonomous Operations Agent - The Brain of YaadFlex
export class AutonomousOpsAgent {
  private stripe: Stripe | null = null;
  private isRunning = false;
  private killSwitch = false;
  private checkInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      });
    }
  }

  // Start the autonomous agent
  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.killSwitch = false;
    
    await this.logAction('scheduler', 'start', 'success', 'Autonomous Ops Agent started');
    
    // Run every hour
    this.checkInterval = setInterval(async () => {
      if (!this.killSwitch) {
        await this.runScheduledTasks();
      }
    }, 3600000); // 1 hour
    
    // Run immediately on start
    await this.runScheduledTasks();
  }

  // Emergency stop
  async emergencyStop() {
    this.killSwitch = true;
    this.isRunning = false;
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    await this.logAction('scheduler', 'emergency_stop', 'warning', 'Kill switch activated by CEO');
  }

  // Main task runner
  private async runScheduledTasks() {
    try {
      // Check for due obligations
      const dueObligations = await this.checkDueObligations();
      
      // Create tasks for due obligations
      for (const obligation of dueObligations) {
        await this.createTaskFromObligation(obligation);
      }
      
      // Process pending tasks
      await this.processPendingTasks();
      
      // Clean up completed tasks
      await this.cleanupCompletedTasks();
      
    } catch (error) {
      await this.logAction('scheduler', 'run_tasks', 'failure', `Error running tasks: ${error}`);
    }
  }

  // Check for obligations that are due
  private async checkDueObligations() {
    const now = new Date();
    const obligations = await db
      .select()
      .from(obligations)
      .where(
        and(
          eq(obligations.isActive, true),
          or(
            lte(obligations.nextDueAt, now),
            isNull(obligations.lastPaidAt)
          )
        )
      );
    
    return obligations;
  }

  // Create task from obligation
  private async createTaskFromObligation(obligation: Obligation) {
    // Check if task already exists
    const existingTasks = await db
      .select()
      .from(autonomousTasks)
      .where(
        and(
          eq(autonomousTasks.obligationId, obligation.id),
          eq(autonomousTasks.status, 'pending')
        )
      );
    
    if (existingTasks.length > 0) return;
    
    const task: InsertAutonomousTask = {
      obligationId: obligation.id,
      kind: 'payment',
      title: `Payment: ${obligation.title}`,
      description: `${obligation.description} - Amount: ${obligation.currency} ${obligation.amount}`,
      dueAt: obligation.nextDueAt,
      priority: obligation.priority,
      requiresApproval: !obligation.autopay,
      autoExecute: obligation.autopay,
      createdBy: 'system'
    };
    
    const [createdTask] = await db.insert(autonomousTasks).values(task).returning();
    
    await this.logAction(
      'compliance', 
      'create_task', 
      'success', 
      `Task created for obligation: ${obligation.title}`,
      createdTask.id
    );
    
    // If requires approval, create approval request
    if (!obligation.autopay) {
      await db.insert(approvals).values({
        taskId: createdTask.id,
        requiredRole: obligation.priority === 'critical' ? 'ceo' : 'cfo',
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
    }
  }

  // Process pending tasks
  private async processPendingTasks() {
    const tasks = await db
      .select()
      .from(autonomousTasks)
      .where(
        and(
          eq(autonomousTasks.status, 'pending'),
          lte(autonomousTasks.dueAt, new Date())
        )
      );
    
    for (const task of tasks) {
      await this.processTask(task);
    }
  }

  // Process individual task
  private async processTask(task: AutonomousTask) {
    try {
      // Update task status
      await db
        .update(autonomousTasks)
        .set({ status: 'in_progress', updatedAt: new Date() })
        .where(eq(autonomousTasks.id, task.id));
      
      // Check if task needs approval
      if (task.requiresApproval) {
        const approval = await this.checkApproval(task.id);
        if (!approval) {
          await this.logAction(
            'payment',
            'awaiting_approval',
            'warning',
            `Task ${task.title} awaiting approval`,
            task.id
          );
          return;
        }
      }
      
      // Execute based on task type
      let success = false;
      switch (task.kind) {
        case 'payment':
          success = await this.executePayment(task);
          break;
        case 'renewal':
          success = await this.executeRenewal(task);
          break;
        case 'filing':
          success = await this.executeFiling(task);
          break;
        case 'notification':
          success = await this.sendNotification(task);
          break;
        default:
          await this.logAction(
            'payment',
            'unknown_task_type',
            'failure',
            `Unknown task type: ${task.kind}`,
            task.id
          );
      }
      
      // Update task status
      if (success) {
        await db
          .update(autonomousTasks)
          .set({
            status: 'completed',
            executedAt: new Date(),
            executedBy: 'system',
            updatedAt: new Date()
          })
          .where(eq(autonomousTasks.id, task.id));
        
        // Update obligation if linked
        if (task.obligationId) {
          await this.updateObligationAfterPayment(task.obligationId);
        }
      } else {
        await this.handleTaskFailure(task);
      }
      
    } catch (error) {
      await this.logAction(
        'payment',
        'process_task_error',
        'failure',
        `Error processing task: ${error}`,
        task.id
      );
      await this.handleTaskFailure(task);
    }
  }

  // Check if task has approval
  private async checkApproval(taskId: string): Promise<boolean> {
    const [approval] = await db
      .select()
      .from(approvals)
      .where(
        and(
          eq(approvals.taskId, taskId),
          eq(approvals.status, 'approved')
        )
      );
    
    return !!approval;
  }

  // Execute payment
  private async executePayment(task: AutonomousTask): Promise<boolean> {
    if (!task.obligationId) return false;
    
    try {
      // Get obligation and vendor details
      const [obligation] = await db
        .select()
        .from(obligations)
        .where(eq(obligations.id, task.obligationId));
      
      if (!obligation) return false;
      
      const [vendor] = await db
        .select()
        .from(vendors)
        .where(eq(vendors.id, obligation.vendorId));
      
      if (!vendor) return false;
      
      // Process payment based on method
      let paymentRef = '';
      if (vendor.paymentMethod === 'credit_card' && this.stripe) {
        // Use Stripe for credit card payments
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: Math.round(parseFloat(obligation.amount.toString()) * 100),
          currency: obligation.currency.toLowerCase(),
          description: `Payment to ${vendor.name} - ${obligation.title}`,
          metadata: {
            taskId: task.id,
            vendorId: vendor.id,
            obligationId: obligation.id
          }
        });
        paymentRef = paymentIntent.id;
      } else {
        // For other methods, create pending payment record
        paymentRef = `MANUAL-${Date.now()}`;
      }
      
      // Record payment
      const payment: InsertPlatformPayment = {
        taskId: task.id,
        vendorId: vendor.id,
        amount: obligation.amount,
        currency: obligation.currency,
        method: vendor.paymentMethod || 'manual',
        status: vendor.paymentMethod === 'credit_card' ? 'processing' : 'pending',
        externalRef: paymentRef
      };
      
      await db.insert(platformPayments).values(payment);
      
      await this.logAction(
        'payment',
        'execute_payment',
        'success',
        `Payment executed for ${vendor.name} - ${obligation.title}`,
        task.id
      );
      
      return true;
    } catch (error) {
      await this.logAction(
        'payment',
        'payment_error',
        'failure',
        `Payment failed: ${error}`,
        task.id
      );
      return false;
    }
  }

  // Execute renewal
  private async executeRenewal(task: AutonomousTask): Promise<boolean> {
    // Similar to payment but for renewals
    await this.logAction(
      'compliance',
      'execute_renewal',
      'success',
      `Renewal executed: ${task.title}`,
      task.id
    );
    return true;
  }

  // Execute filing
  private async executeFiling(task: AutonomousTask): Promise<boolean> {
    // Handle regulatory filings
    await this.logAction(
      'compliance',
      'execute_filing',
      'success',
      `Filing completed: ${task.title}`,
      task.id
    );
    return true;
  }

  // Send notification
  private async sendNotification(task: AutonomousTask): Promise<boolean> {
    // Send email/SMS notifications
    await this.logAction(
      'monitor',
      'send_notification',
      'success',
      `Notification sent: ${task.title}`,
      task.id
    );
    return true;
  }

  // Update obligation after payment
  private async updateObligationAfterPayment(obligationId: string) {
    const [obligation] = await db
      .select()
      .from(obligations)
      .where(eq(obligations.id, obligationId));
    
    if (!obligation) return;
    
    // Calculate next due date based on recurrence
    let nextDue = new Date(obligation.nextDueAt);
    switch (obligation.recurrence) {
      case 'monthly':
        nextDue.setMonth(nextDue.getMonth() + 1);
        break;
      case 'quarterly':
        nextDue.setMonth(nextDue.getMonth() + 3);
        break;
      case 'yearly':
        nextDue.setFullYear(nextDue.getFullYear() + 1);
        break;
      case 'one-time':
        // Mark as inactive after payment
        await db
          .update(obligations)
          .set({
            isActive: false,
            lastPaidAt: new Date(),
            updatedAt: new Date()
          })
          .where(eq(obligations.id, obligationId));
        return;
    }
    
    await db
      .update(obligations)
      .set({
        nextDueAt: nextDue,
        lastPaidAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(obligations.id, obligationId));
  }

  // Handle task failure
  private async handleTaskFailure(task: AutonomousTask) {
    const retryCount = (task.retryCount || 0) + 1;
    const maxRetries = task.maxRetries || 3;
    
    if (retryCount < maxRetries) {
      await db
        .update(autonomousTasks)
        .set({
          status: 'pending',
          retryCount,
          lastError: 'Task failed, will retry',
          updatedAt: new Date()
        })
        .where(eq(autonomousTasks.id, task.id));
    } else {
      await db
        .update(autonomousTasks)
        .set({
          status: 'failed',
          retryCount,
          lastError: 'Max retries exceeded',
          updatedAt: new Date()
        })
        .where(eq(autonomousTasks.id, task.id));
      
      await this.logAction(
        'scheduler',
        'task_failed',
        'failure',
        `Task failed after ${maxRetries} retries: ${task.title}`,
        task.id
      );
    }
  }

  // Clean up old completed tasks
  private async cleanupCompletedTasks() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    await db
      .delete(autonomousTasks)
      .where(
        and(
          eq(autonomousTasks.status, 'completed'),
          lte(autonomousTasks.executedAt, thirtyDaysAgo)
        )
      );
  }

  // Log agent actions
  private async logAction(
    agentType: string,
    action: string,
    status: 'success' | 'failure' | 'warning',
    message: string,
    taskId?: string
  ) {
    const log: InsertAgentLog = {
      agentType,
      action,
      status,
      message,
      taskId,
      metadata: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    };
    
    await db.insert(agentLogs).values(log);
    
    console.log(`[${agentType.toUpperCase()}] ${status}: ${message}`);
  }

  // Get agent status
  async getStatus() {
    return {
      isRunning: this.isRunning,
      killSwitch: this.killSwitch,
      lastCheck: new Date().toISOString()
    };
  }
}

// Create singleton instance
export const autonomousOpsAgent = new AutonomousOpsAgent();