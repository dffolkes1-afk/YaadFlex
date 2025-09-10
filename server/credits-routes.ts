// YaadFlex Credits Digital Top-Up System API Routes
import express from "express";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { db } from "./db";
import { isAuthenticated } from "./replitAuth";
import { requirePermission } from "./rbac-service";
import {
  creditWallets,
  creditTopUps,
  creditTransactions,
  driverPayouts,
  creditPromotions,
  creditTransfers,
  paymentMethodConfigs,
  insertCreditWalletSchema,
  insertCreditTopUpSchema,
  insertCreditTransactionSchema,
  insertDriverPayoutSchema,
  insertCreditPromotionSchema,
  insertCreditTransferSchema,
} from "@shared/schema";

const router = express.Router();

// ===== WALLET MANAGEMENT =====

// Get or create wallet for user
router.get("/api/credits/wallet", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Check if wallet exists
    let [wallet] = await db.select()
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId));
    
    // Create wallet if it doesn't exist
    if (!wallet) {
      const walletData = {
        userId,
        balanceJMD: "0.00",
        bonusCreditsJMD: "0.00",
        isActive: true,
      };
      
      const validatedData = insertCreditWalletSchema.parse(walletData);
      [wallet] = await db.insert(creditWallets).values(validatedData).returning();
    }
    
    res.json(wallet);
  } catch (error) {
    console.error("Error getting wallet:", error);
    res.status(400).json({ error: "Failed to get wallet" });
  }
});

// Get wallet balance
router.get("/api/credits/balance", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    const [wallet] = await db.select({
      balanceJMD: creditWallets.balanceJMD,
      bonusCreditsJMD: creditWallets.bonusCreditsJMD,
      totalBalance: sql`${creditWallets.balanceJMD} + ${creditWallets.bonusCreditsJMD}`,
    })
    .from(creditWallets)
    .where(eq(creditWallets.userId, userId));
    
    if (!wallet) {
      return res.json({ 
        balanceJMD: "0.00", 
        bonusCreditsJMD: "0.00", 
        totalBalance: "0.00" 
      });
    }
    
    res.json(wallet);
  } catch (error) {
    console.error("Error getting balance:", error);
    res.status(400).json({ error: "Failed to get balance" });
  }
});

// ===== TOP-UP FLOW =====

// Get available payment methods
router.get("/api/credits/payment-methods", async (_req, res) => {
  try {
    const methods = await db.select()
      .from(paymentMethodConfigs)
      .where(eq(paymentMethodConfigs.isActive, true))
      .orderBy(paymentMethodConfigs.displayName);
    
    res.json(methods);
  } catch (error) {
    console.error("Error getting payment methods:", error);
    res.status(400).json({ error: "Failed to get payment methods" });
  }
});

// Initiate top-up
router.post("/api/credits/top-up", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { amountJMD, paymentMethod, promoCode } = req.body;
    
    // Get or create wallet
    let [wallet] = await db.select()
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId));
    
    if (!wallet) {
      const walletData = {
        userId,
        balanceJMD: "0.00",
        bonusCreditsJMD: "0.00",
        isActive: true,
      };
      const validatedWallet = insertCreditWalletSchema.parse(walletData);
      [wallet] = await db.insert(creditWallets).values(validatedWallet).returning();
    }
    
    // Check for promo bonus
    let bonusAmount = 0;
    if (promoCode) {
      const [promo] = await db.select()
        .from(creditPromotions)
        .where(
          and(
            eq(creditPromotions.code, promoCode),
            eq(creditPromotions.isActive, true),
            lte(creditPromotions.validFrom, new Date()),
          )
        );
      
      if (promo && Number(amountJMD) >= Number(promo.minTopUpJMD || 0)) {
        if (promo.bonusPercent) {
          bonusAmount = (Number(amountJMD) * promo.bonusPercent) / 100;
        } else if (promo.bonusAmountJMD) {
          bonusAmount = Number(promo.bonusAmountJMD);
        }
        
        // Update promo usage count
        await db.update(creditPromotions)
          .set({ currentUses: (promo.currentUses || 0) + 1 })
          .where(eq(creditPromotions.id, promo.id));
      }
    }
    
    // Create top-up record
    const topUpData = {
      walletId: wallet.id,
      amountJMD: String(amountJMD),
      bonusJMD: String(bonusAmount),
      paymentMethod,
      status: "pending" as const,
      meta: { promoCode },
    };
    
    const validatedTopUp = insertCreditTopUpSchema.parse(topUpData);
    const [topUp] = await db.insert(creditTopUps).values(validatedTopUp).returning();
    
    // TODO: Process payment with provider based on paymentMethod
    // For now, auto-complete for testing
    if (paymentMethod === "test") {
      await completeTopUp(topUp.id);
    }
    
    res.json({ 
      topUpId: topUp.id, 
      amountJMD, 
      bonusJMD: bonusAmount,
      status: "pending",
      message: "Top-up initiated. Processing payment..." 
    });
  } catch (error) {
    console.error("Error initiating top-up:", error);
    res.status(400).json({ error: "Failed to initiate top-up" });
  }
});

// Verify webhook signature for security
async function verifyWebhookSignature(provider: string, signature: string, payload: any): Promise<boolean> {
  // In production, implement provider-specific verification
  // For Stripe: use stripe.webhooks.constructEvent
  // For other providers: use HMAC validation with shared secret
  
  if (provider === "test") {
    // Test provider always passes in dev mode
    return process.env.NODE_ENV === "development";
  }
  
  // TODO: Implement real provider verification
  console.warn(`Webhook verification not implemented for provider: ${provider}`);
  return false;
}

// Complete top-up with idempotency and proper locking
async function completeTopUp(topUpId: string, providerRefId?: string) {
  return await db.transaction(async (tx) => {
    // Get top-up details with FOR UPDATE lock
    const [topUp] = await tx.select()
      .from(creditTopUps)
      .where(eq(creditTopUps.id, topUpId))
      .for("update");
    
    if (!topUp || topUp.status !== "pending") {
      throw new Error("Invalid top-up");
    }
    
    // Check for idempotency - prevent double processing
    if (providerRefId && topUp.providerRefId === providerRefId) {
      throw new Error("Top-up already processed");
    }
    
    // Get wallet
    const [wallet] = await tx.select()
      .from(creditWallets)
      .where(eq(creditWallets.id, topUp.walletId))
      .for("update");
    
    // Use SQL arithmetic for precision - no JS Number conversion
    const [updatedWallet] = await tx.execute(sql`
      UPDATE credit_wallets
      SET 
        balance_jmd = balance_jmd + ${topUp.amountJMD},
        bonus_credits_jmd = COALESCE(bonus_credits_jmd, 0) + ${topUp.bonusJMD || 0},
        total_top_ups = COALESCE(total_top_ups, 0) + ${topUp.amountJMD},
        updated_at = NOW()
      WHERE id = ${wallet.id}
      RETURNING *
    `);
    
    // Update top-up status with provider reference for idempotency
    await tx.update(creditTopUps)
      .set({ 
        status: "completed",
        completedAt: new Date(),
        providerRefId: providerRefId || topUp.providerRefId,
      })
      .where(eq(creditTopUps.id, topUpId));
    
    // Record transaction with exact amounts from database
    const transactionData = {
      walletId: wallet.id,
      type: "top_up" as const,
      amountJMD: sql`${topUp.amountJMD} + ${topUp.bonusJMD || 0}`,
      balanceBeforeJMD: sql`${wallet.balanceJMD} + COALESCE(${wallet.bonusCreditsJMD}, 0)`,
      balanceAfterJMD: sql`${updatedWallet.balance_jmd} + COALESCE(${updatedWallet.bonus_credits_jmd}, 0)`,
      referenceType: "top_up",
      referenceId: topUpId,
      description: `Top-up of ${topUp.amountJMD} JMD${topUp.bonusJMD ? ` + ${topUp.bonusJMD} bonus` : ""}`,
    };
    
    await tx.insert(creditTransactions).values(transactionData);
    
    return { 
      newBalance: updatedWallet.balance_jmd,
      newBonus: updatedWallet.bonus_credits_jmd,
      totalBalance: sql`${updatedWallet.balance_jmd} + COALESCE(${updatedWallet.bonus_credits_jmd}, 0)`
    };
  });
}

// Process payment webhook with signature verification
router.post("/api/credits/webhook/payment", async (req, res) => {
  try {
    // Verify webhook signature based on provider
    const signature = req.headers['x-webhook-signature'] as string;
    const provider = req.headers['x-payment-provider'] as string;
    
    if (!signature || !provider) {
      return res.status(401).json({ error: "Missing webhook signature or provider" });
    }
    
    // Provider-specific signature verification
    const isValid = await verifyWebhookSignature(provider, signature, req.body);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }
    
    const { topUpId, status, providerRefId } = req.body;
    
    if (status === "completed") {
      const result = await completeTopUp(topUpId, providerRefId);
      res.json({ success: true, ...result });
    } else {
      // Update top-up status to failed
      await db.update(creditTopUps)
        .set({ 
          status: "failed",
          meta: { failureReason: req.body.reason },
        })
        .where(eq(creditTopUps.id, topUpId));
      
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    res.status(400).json({ error: "Failed to process webhook" });
  }
});

// ===== RIDE/DELIVERY PAYMENT =====

// Deduct credits for ride/service
router.post("/api/credits/deduct", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { amountJMD, referenceType, referenceId, description } = req.body;
    
    const result = await db.transaction(async (tx) => {
      // Get wallet
      const [wallet] = await tx.select()
        .from(creditWallets)
        .where(eq(creditWallets.userId, userId))
        .for("update"); // Lock for update
      
      if (!wallet) {
        throw new Error("Wallet not found");
      }
      
      // Check balance using SQL to avoid precision errors
      const [balanceCheck] = await tx.execute(sql`
        SELECT 
          balance_jmd + COALESCE(bonus_credits_jmd, 0) as total_balance,
          balance_jmd,
          bonus_credits_jmd
        FROM credit_wallets
        WHERE id = ${wallet.id}
      `);
      
      if (Number(balanceCheck.total_balance) < Number(amountJMD)) {
        throw new Error("Insufficient balance");
      }
      
      // Deduct using SQL arithmetic - bonus first, then main balance
      const [updatedWallet] = await tx.execute(sql`
        UPDATE credit_wallets
        SET
          bonus_credits_jmd = GREATEST(0, COALESCE(bonus_credits_jmd, 0) - ${amountJMD}),
          balance_jmd = CASE
            WHEN COALESCE(bonus_credits_jmd, 0) >= ${amountJMD} THEN balance_jmd
            ELSE balance_jmd - (${amountJMD} - COALESCE(bonus_credits_jmd, 0))
          END,
          total_spent = COALESCE(total_spent, 0) + ${amountJMD},
          updated_at = NOW()
        WHERE id = ${wallet.id}
        RETURNING *
      `);
      
      // Record transaction
      const transactionData = {
        walletId: wallet.id,
        type: `${referenceType}_payment` as any,
        amountJMD: String(deductAmount),
        balanceBeforeJMD: String(totalBalance),
        balanceAfterJMD: String(newBalance + newBonus),
        referenceType,
        referenceId,
        description: description || `Payment for ${referenceType}`,
      };
      
      const validatedTransaction = insertCreditTransactionSchema.parse(transactionData);
      await tx.insert(creditTransactions).values(validatedTransaction);
      
      return {
        success: true,
        deducted: deductAmount,
        remainingBalance: newBalance + newBonus,
        mainBalance: newBalance,
        bonusBalance: newBonus,
      };
    });
    
    res.json(result);
  } catch (error: any) {
    console.error("Error deducting credits:", error);
    if (error.message === "Insufficient balance") {
      res.status(400).json({ 
        error: "Insufficient balance",
        topUpRequired: true,
      });
    } else {
      res.status(400).json({ error: "Failed to process payment" });
    }
  }
});

// ===== DRIVER PAYOUTS =====

// Request payout (driver)
router.post("/api/credits/payout/request", isAuthenticated, async (req: any, res) => {
  try {
    const driverId = req.user.claims.sub;
    const { amountJMD, method, bankAccount } = req.body;
    
    // TODO: Verify driver has sufficient earnings balance
    
    const payoutData = {
      driverId,
      amountJMD: String(amountJMD),
      method,
      bankAccount: method === "bank_transfer" ? bankAccount : undefined,
      status: "pending" as const,
    };
    
    const validatedPayout = insertDriverPayoutSchema.parse(payoutData);
    const [payout] = await db.insert(driverPayouts).values(validatedPayout).returning();
    
    res.json({
      payoutId: payout.id,
      amountJMD,
      method,
      status: "pending",
      message: method === "link_wallet" 
        ? "Payout will be processed instantly" 
        : "Payout will be processed within 1-2 business days",
    });
  } catch (error) {
    console.error("Error requesting payout:", error);
    res.status(400).json({ error: "Failed to request payout" });
  }
});

// Process payouts (admin)
router.post("/api/credits/payout/:id/process", isAuthenticated, requirePermission("area:*"), async (req, res) => {
  try {
    const payoutId = req.params.id;
    const { status, providerRefId } = req.body;
    
    const [payout] = await db.update(driverPayouts)
      .set({
        status,
        providerRefId,
        processedAt: new Date(),
        meta: req.body.meta,
      })
      .where(eq(driverPayouts.id, payoutId))
      .returning();
    
    res.json(payout);
  } catch (error) {
    console.error("Error processing payout:", error);
    res.status(400).json({ error: "Failed to process payout" });
  }
});

// ===== TRANSACTIONS HISTORY =====

// Get transaction history
router.get("/api/credits/transactions", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const limit = parseInt(req.query.limit as string) || 50;
    
    // Get user's wallet
    const [wallet] = await db.select()
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId));
    
    if (!wallet) {
      return res.json([]);
    }
    
    const transactions = await db.select()
      .from(creditTransactions)
      .where(eq(creditTransactions.walletId, wallet.id))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit);
    
    res.json(transactions);
  } catch (error) {
    console.error("Error getting transactions:", error);
    res.status(400).json({ error: "Failed to get transactions" });
  }
});

// ===== ADMIN DASHBOARD =====

// Get credits analytics (admin only)
router.get("/api/credits/analytics", isAuthenticated, requirePermission("area:*"), async (_req, res) => {
  try {
    // Get totals
    const [totals] = await db.select({
      totalWallets: sql<number>`count(*)`,
      totalBalance: sql<number>`sum(${creditWallets.balanceJMD} + ${creditWallets.bonusCreditsJMD})`,
      totalTopUps: sql<number>`sum(${creditWallets.totalTopUps})`,
      totalSpent: sql<number>`sum(${creditWallets.totalSpent})`,
    }).from(creditWallets);
    
    // Get recent top-ups
    const recentTopUps = await db.select({
      date: creditTopUps.createdAt,
      amount: creditTopUps.amountJMD,
      method: creditTopUps.paymentMethod,
      status: creditTopUps.status,
    })
    .from(creditTopUps)
    .orderBy(desc(creditTopUps.createdAt))
    .limit(10);
    
    // Get pending payouts
    const pendingPayouts = await db.select({
      count: sql<number>`count(*)`,
      totalAmount: sql<number>`sum(${driverPayouts.amountJMD})`,
    })
    .from(driverPayouts)
    .where(eq(driverPayouts.status, "pending"));
    
    res.json({
      totals,
      recentTopUps,
      pendingPayouts: pendingPayouts[0],
    });
  } catch (error) {
    console.error("Error getting analytics:", error);
    res.status(400).json({ error: "Failed to get analytics" });
  }
});

// ===== PEER-TO-PEER TRANSFERS (Future) =====

// Transfer credits between users
router.post("/api/credits/transfer", isAuthenticated, async (req: any, res) => {
  try {
    const fromUserId = req.user.claims.sub;
    const { toUserId, amountJMD, reason } = req.body;
    
    const result = await db.transaction(async (tx) => {
      // Get sender wallet
      const [fromWallet] = await tx.select()
        .from(creditWallets)
        .where(eq(creditWallets.userId, fromUserId))
        .for("update");
      
      if (!fromWallet) {
        throw new Error("Sender wallet not found");
      }
      
      const senderBalance = Number(fromWallet.balanceJMD);
      const transferAmount = Number(amountJMD);
      
      if (senderBalance < transferAmount) {
        throw new Error("Insufficient balance");
      }
      
      // Get or create receiver wallet
      let [toWallet] = await tx.select()
        .from(creditWallets)
        .where(eq(creditWallets.userId, toUserId))
        .for("update");
      
      if (!toWallet) {
        const walletData = {
          userId: toUserId,
          balanceJMD: "0.00",
          bonusCreditsJMD: "0.00",
          isActive: true,
        };
        const validatedWallet = insertCreditWalletSchema.parse(walletData);
        [toWallet] = await tx.insert(creditWallets).values(validatedWallet).returning();
      }
      
      // Update balances
      await tx.update(creditWallets)
        .set({
          balanceJMD: String(senderBalance - transferAmount),
          updatedAt: new Date(),
        })
        .where(eq(creditWallets.id, fromWallet.id));
      
      await tx.update(creditWallets)
        .set({
          balanceJMD: String(Number(toWallet.balanceJMD) + transferAmount),
          updatedAt: new Date(),
        })
        .where(eq(creditWallets.id, toWallet.id));
      
      // Record transfer
      const transferData = {
        fromWalletId: fromWallet.id,
        toWalletId: toWallet.id,
        amountJMD: String(transferAmount),
        reason,
        status: "completed" as const,
      };
      
      const validatedTransfer = insertCreditTransferSchema.parse(transferData);
      const [transfer] = await tx.insert(creditTransfers).values(validatedTransfer).returning();
      
      // Record transactions for both wallets
      await tx.insert(creditTransactions).values([
        {
          walletId: fromWallet.id,
          type: "transfer_out",
          amountJMD: String(transferAmount),
          balanceBeforeJMD: String(senderBalance),
          balanceAfterJMD: String(senderBalance - transferAmount),
          referenceType: "transfer",
          referenceId: transfer.id,
          description: `Transfer to user ${toUserId}`,
        },
        {
          walletId: toWallet.id,
          type: "transfer_in",
          amountJMD: String(transferAmount),
          balanceBeforeJMD: toWallet.balanceJMD,
          balanceAfterJMD: String(Number(toWallet.balanceJMD) + transferAmount),
          referenceType: "transfer",
          referenceId: transfer.id,
          description: `Transfer from user ${fromUserId}`,
        },
      ]);
      
      return {
        success: true,
        transferId: transfer.id,
        amountJMD: transferAmount,
        newBalance: senderBalance - transferAmount,
      };
    });
    
    res.json(result);
  } catch (error: any) {
    console.error("Error transferring credits:", error);
    if (error.message === "Insufficient balance") {
      res.status(400).json({ error: "Insufficient balance" });
    } else {
      res.status(400).json({ error: "Failed to transfer credits" });
    }
  }
});

export default router;