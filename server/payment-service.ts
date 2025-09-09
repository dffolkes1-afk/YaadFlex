import Stripe from 'stripe';
import { db } from './db';
import {
  businessExpenses,
  paymentMethods,
  paymentHistory,
  vendorProfiles,
  paymentJobs,
  type BusinessExpense,
  type PaymentMethod,
  type VendorProfile
} from '@shared/schema';
import { eq, and, lte, sql } from 'drizzle-orm';

// Initialize Stripe if secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

export class PaymentService {
  constructor() {
    if (!stripe) {
      console.warn('Stripe not initialized - STRIPE_SECRET_KEY not provided');
    }
  }

  /**
   * Set up automatic payment for a business expense
   */
  async setupAutomaticPayment(expenseId: string, paymentMethodId: string): Promise<boolean> {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const [expense] = await db.select()
        .from(businessExpenses)
        .where(eq(businessExpenses.id, expenseId));

      if (!expense) {
        throw new Error('Expense not found');
      }

      const [paymentMethod] = await db.select()
        .from(paymentMethods)
        .where(eq(paymentMethods.id, paymentMethodId));

      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      // For recurring expenses, create a Stripe subscription
      if (expense.frequency !== 'one-time') {
        const subscription = await this.createStripeSubscription(expense, paymentMethod);
        
        // Update expense with subscription ID and auto-payment enabled
        await db.update(businessExpenses)
          .set({
            autoPayment: true,
            paymentMethodId: paymentMethodId,
            stripeSubscriptionId: subscription.id,
            paymentStatus: 'pending',
            updatedAt: new Date()
          })
          .where(eq(businessExpenses.id, expenseId));
      } else {
        // For one-time expenses, just enable auto-payment
        await db.update(businessExpenses)
          .set({
            autoPayment: true,
            paymentMethodId: paymentMethodId,
            paymentStatus: 'pending',
            updatedAt: new Date()
          })
          .where(eq(businessExpenses.id, expenseId));
      }

      // Schedule payment job
      await this.schedulePaymentJob(expenseId, expense.nextDueDate);

      return true;
    } catch (error) {
      console.error('Error setting up automatic payment:', error);
      return false;
    }
  }

  /**
   * Create Stripe subscription for recurring expenses
   */
  private async createStripeSubscription(expense: BusinessExpense, paymentMethod: PaymentMethod) {
    if (!stripe) throw new Error('Stripe not configured');

    // Convert JMD to USD for Stripe (approximate conversion)
    const amountInUsd = Math.round(parseFloat(expense.amount.toString()) / 160); // 1 USD ≈ 160 JMD

    // Create a price for this specific expense
    const price = await stripe.prices.create({
      unit_amount: amountInUsd * 100, // Stripe uses cents
      currency: 'usd',
      recurring: {
        interval: this.getStripeInterval(expense.frequency)
      },
      product_data: {
        name: expense.name,
        description: expense.description || `${expense.category} expense - ${expense.provider}`
      }
    });

    // Create customer if needed
    let customerId = await this.getOrCreateStripeCustomer(paymentMethod.userId);

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: price.id }],
      default_payment_method: paymentMethod.stripePaymentMethodId,
      metadata: {
        expenseId: expense.id,
        provider: expense.provider || '',
        category: expense.category
      }
    });

    return subscription;
  }

  /**
   * Process immediate payment for an expense
   */
  async processPayment(expenseId: string): Promise<boolean> {
    if (!stripe) {
      console.log('Stripe not configured - marking payment as completed (development mode)');
      return this.mockPaymentSuccess(expenseId);
    }

    try {
      const [expense] = await db.select()
        .from(businessExpenses)
        .where(eq(businessExpenses.id, expenseId));

      if (!expense) {
        throw new Error('Expense not found');
      }

      let paymentMethod: PaymentMethod | undefined;
      if (expense.paymentMethodId) {
        const [pm] = await db.select()
          .from(paymentMethods)
          .where(eq(paymentMethods.id, expense.paymentMethodId));
        paymentMethod = pm;
      }

      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      // Update payment status to processing
      await db.update(businessExpenses)
        .set({
          paymentStatus: 'processing',
          lastPaymentAttempt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(businessExpenses.id, expenseId));

      // Convert JMD to USD for Stripe
      const amountInUsd = Math.round(parseFloat(expense.amount.toString()) / 160);

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInUsd * 100, // Stripe uses cents
        currency: 'usd',
        payment_method: paymentMethod.stripePaymentMethodId,
        confirm: true,
        return_url: `${process.env.REPLIT_DOMAINS?.split(',')[0]}/ceo-dashboard`,
        metadata: {
          expenseId: expense.id,
          provider: expense.provider || '',
          category: expense.category
        }
      });

      // Record payment history
      await db.insert(paymentHistory).values({
        expenseId: expenseId,
        paymentMethodId: paymentMethod.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: expense.amount,
        currency: expense.currency,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'processing',
        paymentDate: new Date(),
        completedAt: paymentIntent.status === 'succeeded' ? new Date() : undefined
      });

      if (paymentIntent.status === 'succeeded') {
        // Update expense as paid
        await db.update(businessExpenses)
          .set({
            status: 'paid',
            paymentStatus: 'completed',
            lastPaidDate: new Date(),
            paymentFailureCount: 0,
            nextPaymentRetry: undefined,
            updatedAt: new Date()
          })
          .where(eq(businessExpenses.id, expenseId));

        // Schedule next payment if recurring
        if (expense.frequency !== 'one-time') {
          await this.scheduleNextPayment(expense);
        }

        return true;
      } else {
        throw new Error(`Payment failed with status: ${paymentIntent.status}`);
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Update payment status and failure count
      await db.update(businessExpenses)
        .set({
          paymentStatus: 'failed',
          paymentFailureCount: sql`${businessExpenses.paymentFailureCount} + 1`,
          nextPaymentRetry: new Date(Date.now() + 24 * 60 * 60 * 1000), // Retry in 24 hours
          updatedAt: new Date()
        })
        .where(eq(businessExpenses.id, expenseId));

      return false;
    }
  }

  /**
   * Mock payment success for development mode
   */
  private async mockPaymentSuccess(expenseId: string): Promise<boolean> {
    try {
      const [expense] = await db.select()
        .from(businessExpenses)
        .where(eq(businessExpenses.id, expenseId));

      if (!expense) return false;

      // Record mock payment history
      await db.insert(paymentHistory).values({
        expenseId: expenseId,
        amount: expense.amount,
        currency: expense.currency,
        status: 'completed',
        paymentDate: new Date(),
        completedAt: new Date(),
        receiptUrl: 'https://mock-receipt.yaadflexglobalvybz.com/receipt'
      });

      // Update expense as paid
      await db.update(businessExpenses)
        .set({
          status: 'paid',
          paymentStatus: 'completed',
          lastPaidDate: new Date(),
          paymentFailureCount: 0,
          updatedAt: new Date()
        })
        .where(eq(businessExpenses.id, expenseId));

      console.log(`Mock payment successful for expense: ${expense.name} - J$${expense.amount}`);
      return true;
    } catch (error) {
      console.error('Error in mock payment:', error);
      return false;
    }
  }

  /**
   * Process all due payments
   */
  async processAllDuePayments(): Promise<{ processed: number; successful: number; failed: number }> {
    const now = new Date();
    
    // Find all expenses that are due for payment and have auto-payment enabled
    const dueExpenses = await db.select()
      .from(businessExpenses)
      .where(and(
        eq(businessExpenses.autoPayment, true),
        eq(businessExpenses.isActive, true),
        lte(businessExpenses.nextDueDate, now),
        eq(businessExpenses.status, 'upcoming')
      ));

    let processed = 0;
    let successful = 0;
    let failed = 0;

    for (const expense of dueExpenses) {
      processed++;
      const success = await this.processPayment(expense.id);
      if (success) {
        successful++;
      } else {
        failed++;
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { processed, successful, failed };
  }

  /**
   * Schedule next payment for recurring expenses
   */
  private async scheduleNextPayment(expense: BusinessExpense): Promise<void> {
    let nextDate = new Date(expense.nextDueDate);
    
    switch (expense.frequency) {
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    await db.update(businessExpenses)
      .set({
        nextDueDate: nextDate,
        status: 'upcoming',
        updatedAt: new Date()
      })
      .where(eq(businessExpenses.id, expense.id));

    // Schedule payment job
    await this.schedulePaymentJob(expense.id, nextDate);
  }

  /**
   * Schedule a payment job
   */
  private async schedulePaymentJob(expenseId: string, scheduledDate: Date): Promise<void> {
    await db.insert(paymentJobs).values({
      expenseId,
      scheduledDate,
      jobType: 'payment',
      status: 'scheduled'
    });
  }

  /**
   * Helper methods
   */
  private getStripeInterval(frequency: string): 'day' | 'week' | 'month' | 'year' {
    switch (frequency) {
      case 'monthly': return 'month';
      case 'quarterly': return 'month'; // Will handle 3-month intervals separately
      case 'yearly': return 'year';
      default: return 'month';
    }
  }

  private async getOrCreateStripeCustomer(userId: string): Promise<string> {
    if (!stripe) throw new Error('Stripe not configured');
    
    // For now, create a generic customer - in production, you'd want to link to actual user data
    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
        platform: 'YaadFlex'
      }
    });

    return customer.id;
  }

  /**
   * Create vendor profiles for common business expenses
   */
  async seedVendorProfiles(): Promise<void> {
    const vendors = [
      {
        name: 'GoDaddy',
        category: 'domain',
        contactEmail: 'support@godaddy.com',
        billingEmail: 'billing@godaddy.com',
        website: 'https://www.godaddy.com',
        phone: '1-781-373-6808',
        preferredPaymentMethod: 'card',
        autoPayEnabled: true
      },
      {
        name: 'Google LLC',
        category: 'email',
        contactEmail: 'workspace-support@google.com',
        billingEmail: 'workspace-billing@google.com',
        website: 'https://workspace.google.com',
        preferredPaymentMethod: 'card',
        autoPayEnabled: true
      },
      {
        name: 'Replit Inc.',
        category: 'hosting',
        contactEmail: 'support@replit.com',
        billingEmail: 'billing@replit.com',
        website: 'https://replit.com',
        preferredPaymentMethod: 'card',
        autoPayEnabled: true
      },
      {
        name: 'Insurance Company of Jamaica',
        category: 'insurance',
        contactEmail: 'customer.service@icj.co.jm',
        billingEmail: 'premiums@icj.co.jm',
        website: 'https://www.icj.co.jm',
        phone: '1-876-926-3590',
        preferredPaymentMethod: 'bank_transfer',
        paymentTerms: 'net30',
        autoPayEnabled: true
      }
    ];

    for (const vendor of vendors) {
      try {
        await db.insert(vendorProfiles).values(vendor);
      } catch (error) {
        // Vendor might already exist, continue
        console.log(`Vendor ${vendor.name} might already exist`);
      }
    }
  }
}

export const paymentService = new PaymentService();