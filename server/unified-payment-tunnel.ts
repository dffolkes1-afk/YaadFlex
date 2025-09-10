import { db } from './db';
import {
  walletTransactions,
  userWallets,
  platformPayments,
  type InsertWalletTransaction,
  type WalletTransaction
} from '@shared/schema';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import Stripe from 'stripe';

// Unified Payment Tunnel - Single wallet system for all money flow
export class UnifiedPaymentTunnel {
  private stripe: Stripe | null = null;
  private readonly PLATFORM_COMMISSION = 0.15; // 15% platform fee
  
  constructor() {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      });
    }
  }

  // Process incoming payment (from riders, customers, etc.)
  async processIncomingPayment(
    userId: string,
    amount: number,
    currency: string,
    type: string,
    referenceId?: string,
    referenceType?: string
  ): Promise<WalletTransaction> {
    // Create wallet transaction
    const transaction: InsertWalletTransaction = {
      userId,
      role: 'customer',
      amount: amount.toString(),
      currency,
      type: 'deposit',
      status: 'processing',
      referenceId,
      referenceType,
      description: `Payment for ${referenceType || 'service'}`
    };

    const [walletTx] = await db.insert(walletTransactions).values(transaction).returning();

    // Update user wallet balance
    await this.updateWalletBalance(userId, amount, currency, 'add');

    // Mark transaction as completed
    await db
      .update(walletTransactions)
      .set({
        status: 'completed',
        processedAt: new Date()
      })
      .where(eq(walletTransactions.id, walletTx.id));

    return walletTx;
  }

  // Process driver earnings (85% to driver, 15% to platform)
  async processDriverEarning(
    driverId: string,
    tripAmount: number,
    currency: string,
    tripId: string
  ) {
    const commission = tripAmount * this.PLATFORM_COMMISSION;
    const driverEarning = tripAmount - commission;

    // Get driver's user ID
    const [driver] = await db
      .select()
      .from(drivers)
      .where(eq(drivers.id, driverId));

    if (!driver) throw new Error('Driver not found');

    // Create driver earning transaction
    const driverTx: InsertWalletTransaction = {
      userId: driver.userId,
      role: 'driver',
      amount: driverEarning.toString(),
      currency,
      type: 'deposit',
      status: 'completed',
      referenceId: tripId,
      referenceType: 'ride',
      description: `Earning from trip ${tripId} (85% after commission)`,
      processedAt: new Date()
    };

    await db.insert(walletTransactions).values(driverTx);

    // Create platform commission transaction
    const platformTx: InsertWalletTransaction = {
      userId: 'PLATFORM',
      role: 'app',
      amount: commission.toString(),
      currency,
      type: 'commission',
      status: 'completed',
      referenceId: tripId,
      referenceType: 'ride',
      description: `Commission from trip ${tripId} (15%)`,
      processedAt: new Date()
    };

    await db.insert(walletTransactions).values(platformTx);

    // Update driver balance
    await db
      .update(drivers)
      .set({
        balance: sql`${drivers.balance} + ${driverEarning}`,
        totalEarnings: sql`${drivers.totalEarnings} + ${driverEarning}`,
        updatedAt: new Date()
      })
      .where(eq(drivers.id, driverId));

    return {
      driverEarning,
      platformCommission: commission,
      totalAmount: tripAmount
    };
  }

  // Process worker/freelancer payment
  async processWorkerPayment(
    workerId: string,
    amount: number,
    currency: string,
    jobId: string,
    description: string
  ) {
    // Get freelancer
    const [freelancer] = await db
      .select()
      .from(freelancers)
      .where(eq(freelancers.id, workerId));

    if (!freelancer) throw new Error('Worker not found');

    // Create worker earning transaction
    const workerTx: InsertWalletTransaction = {
      userId: freelancer.userId,
      role: 'worker',
      amount: amount.toString(),
      currency,
      type: 'deposit',
      status: 'completed',
      referenceId: jobId,
      referenceType: 'job',
      description,
      processedAt: new Date()
    };

    await db.insert(walletTransactions).values(workerTx);

    // Update freelancer balance
    await db
      .update(freelancers)
      .set({
        balance: sql`${freelancers.balance} + ${amount}`,
        totalEarnings: sql`${freelancers.totalEarnings} + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(freelancers.id, workerId));

    return workerTx;
  }

  // Process cash out request
  async processCashOut(
    userId: string,
    role: 'driver' | 'worker',
    amount: number,
    currency: string,
    method: 'bank' | 'card' | 'mobile_money'
  ) {
    // Check available balance
    const balance = await this.getAvailableBalance(userId, role);
    
    if (balance < amount) {
      throw new Error('Insufficient balance for cash out');
    }

    // Create withdrawal transaction
    const withdrawalTx: InsertWalletTransaction = {
      userId,
      role,
      amount: amount.toString(),
      currency,
      type: 'withdrawal',
      status: 'processing',
      description: `Cash out via ${method}`
    };

    const [tx] = await db.insert(walletTransactions).values(withdrawalTx).returning();

    // Process actual payout
    let payoutSuccess = false;
    let externalRef = '';

    try {
      if (this.stripe && method === 'card') {
        // Use Stripe for card payouts
        const transfer = await this.stripe.transfers.create({
          amount: Math.round(amount * 100),
          currency: currency.toLowerCase(),
          destination: userId, // Assumes Stripe Connect account
          description: `Payout for ${role}`,
          metadata: {
            transactionId: tx.id,
            role
          }
        });
        externalRef = transfer.id;
        payoutSuccess = true;
      } else if (method === 'mobile_money') {
        // Process mobile money transfer
        externalRef = `MM-${Date.now()}`;
        payoutSuccess = true; // Simulate success
      } else {
        // Bank transfer
        externalRef = `BANK-${Date.now()}`;
        payoutSuccess = true; // Simulate success
      }

      if (payoutSuccess) {
        // Update transaction status
        await db
          .update(walletTransactions)
          .set({
            status: 'completed',
            processedAt: new Date(),
            metadata: { externalRef }
          })
          .where(eq(walletTransactions.id, tx.id));

        // Update balance based on role
        if (role === 'driver') {
          const [driver] = await db
            .select()
            .from(drivers)
            .where(eq(drivers.userId, userId));
          
          if (driver) {
            await db
              .update(drivers)
              .set({
                balance: sql`${drivers.balance} - ${amount}`,
                lastPayoutAt: new Date(),
                updatedAt: new Date()
              })
              .where(eq(drivers.id, driver.id));
          }
        } else if (role === 'worker') {
          const [freelancer] = await db
            .select()
            .from(freelancers)
            .where(eq(freelancers.userId, userId));
          
          if (freelancer) {
            await db
              .update(freelancers)
              .set({
                balance: sql`${freelancers.balance} - ${amount}`,
                lastPayoutAt: new Date(),
                updatedAt: new Date()
              })
              .where(eq(freelancers.id, freelancer.id));
          }
        }
      }
    } catch (error) {
      // Mark transaction as failed
      await db
        .update(walletTransactions)
        .set({
          status: 'failed',
          metadata: { error: error.message }
        })
        .where(eq(walletTransactions.id, tx.id));
      
      throw error;
    }

    return tx;
  }

  // Get available balance for user
  async getAvailableBalance(userId: string, role: 'driver' | 'worker'): Promise<number> {
    if (role === 'driver') {
      const [driver] = await db
        .select()
        .from(drivers)
        .where(eq(drivers.userId, userId));
      
      return driver ? parseFloat(driver.balance.toString()) : 0;
    } else {
      const [freelancer] = await db
        .select()
        .from(freelancers)
        .where(eq(freelancers.userId, userId));
      
      return freelancer ? parseFloat(freelancer.balance.toString()) : 0;
    }
  }

  // Get transaction history
  async getTransactionHistory(
    userId: string,
    role?: string,
    startDate?: Date,
    endDate?: Date,
    limit = 50
  ) {
    let query = db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId));

    if (role) {
      query = query.where(
        and(
          eq(walletTransactions.userId, userId),
          eq(walletTransactions.role, role)
        )
      );
    }

    if (startDate && endDate) {
      query = query.where(
        and(
          eq(walletTransactions.userId, userId),
          gte(walletTransactions.createdAt, startDate),
          lte(walletTransactions.createdAt, endDate)
        )
      );
    }

    const transactions = await query
      .orderBy(desc(walletTransactions.createdAt))
      .limit(limit);

    return transactions;
  }

  // Get wallet summary
  async getWalletSummary(userId: string) {
    // Get all wallet balances
    const wallets = await db
      .select()
      .from(userWallets)
      .where(eq(userWallets.userId, userId));

    // Get driver balance if applicable
    const [driver] = await db
      .select()
      .from(drivers)
      .where(eq(drivers.userId, userId));

    // Get freelancer balance if applicable
    const [freelancer] = await db
      .select()
      .from(freelancers)
      .where(eq(freelancers.userId, userId));

    // Get recent transactions
    const recentTransactions = await this.getTransactionHistory(userId, undefined, undefined, undefined, 10);

    // Calculate totals
    const totalIncome = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)`
      })
      .from(walletTransactions)
      .where(
        and(
          eq(walletTransactions.userId, userId),
          eq(walletTransactions.type, 'deposit'),
          eq(walletTransactions.status, 'completed')
        )
      );

    const totalWithdrawals = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)`
      })
      .from(walletTransactions)
      .where(
        and(
          eq(walletTransactions.userId, userId),
          eq(walletTransactions.type, 'withdrawal'),
          eq(walletTransactions.status, 'completed')
        )
      );

    return {
      wallets,
      driverBalance: driver?.balance || 0,
      freelancerBalance: freelancer?.balance || 0,
      totalIncome: totalIncome[0]?.total || 0,
      totalWithdrawals: totalWithdrawals[0]?.total || 0,
      recentTransactions
    };
  }

  // Schedule automatic payouts (daily, weekly, monthly)
  async scheduleAutomaticPayouts(
    userId: string,
    role: 'driver' | 'worker',
    schedule: 'daily' | 'weekly' | 'monthly',
    method: 'bank' | 'card' | 'mobile_money'
  ) {
    // Implementation for scheduled payouts
    // This would be handled by a cron job or scheduler
    return {
      userId,
      role,
      schedule,
      method,
      nextPayout: this.calculateNextPayoutDate(schedule)
    };
  }

  // Calculate next payout date
  private calculateNextPayoutDate(schedule: 'daily' | 'weekly' | 'monthly'): Date {
    const now = new Date();
    switch (schedule) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
    }
    return now;
  }

  // Update wallet balance
  private async updateWalletBalance(
    userId: string,
    amount: number,
    currency: string,
    operation: 'add' | 'subtract'
  ) {
    // Check if wallet exists
    const [wallet] = await db
      .select()
      .from(userWallets)
      .where(
        and(
          eq(userWallets.userId, userId),
          eq(userWallets.currency, currency)
        )
      );

    if (wallet) {
      // Update existing wallet
      const newBalance = operation === 'add'
        ? sql`${userWallets.balance} + ${amount}`
        : sql`${userWallets.balance} - ${amount}`;

      await db
        .update(userWallets)
        .set({
          balance: newBalance,
          lastTransactionAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(userWallets.id, wallet.id));
    } else {
      // Create new wallet
      await db.insert(userWallets).values({
        userId,
        currency,
        balance: amount.toString(),
        isActive: true,
        lastTransactionAt: new Date()
      });
    }
  }
}

// Create singleton instance
export const paymentTunnel = new UnifiedPaymentTunnel();