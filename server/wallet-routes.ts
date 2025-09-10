// server/wallet-routes.ts
import express from "express";
import crypto from "node:crypto";
import { db } from "./db";
import {
  walletUsers, wallets, walletBalances, walletTx, idempotency,
  payoutMethods, paymentRequests, kycVerifications, coinDenominations, fxRates
} from "@shared/wallet-schema";
import { eq, and, or, desc, sql } from "drizzle-orm";

export const walletRouter = express.Router();

// Helper to generate unique IDs
const uid = () => crypto.randomUUID();

// Ensure a balance row exists for a wallet/currency pair
async function ensureBalance(walletId: string, currency: string) {
  const [row] = await db.select().from(walletBalances)
    .where(and(eq(walletBalances.walletId, walletId), eq(walletBalances.currency, currency)));
  
  if (!row) {
    await db.insert(walletBalances).values({ 
      walletId, 
      currency, 
      amount: "0.00" 
    });
  }
}

// Create wallet for a user
walletRouter.post("/api/wallets", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const id = uid();
    await db.insert(wallets).values({ id, userId });
    
    // Initialize balances for main currencies
    await ensureBalance(id, "JMD");
    await ensureBalance(id, "USD");
    await ensureBalance(id, "YFD"); // YaadFlex Dollar
    
    res.json({ id, userId, message: "Wallet created successfully" });
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ error: "Failed to create wallet" });
  }
});

// Deposit money to wallet (e.g., via card/bank processor webhook)
walletRouter.post("/api/wallets/:walletId/deposit", async (req, res) => {
  try {
    const { walletId } = req.params;
    const { currency = "JMD", amount, idemKey } = req.body;
    
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Check idempotency to prevent duplicate deposits
    if (idemKey) {
      const [exists] = await db.select().from(idempotency)
        .where(eq(idempotency.key, idemKey));
      
      if (exists) {
        return res.json({ ok: true, duplicate: true, message: "Transaction already processed" });
      }
      
      await db.insert(idempotency).values({ key: idemKey });
    }
    
    await ensureBalance(walletId, currency);
    
    // Create transaction record
    const txId = uid();
    const [tx] = await db.insert(walletTx).values({
      id: txId, 
      type: "deposit", 
      currency, 
      amount, 
      toWalletId: walletId, 
      status: "succeeded", 
      meta: { source: "manual_deposit" }
    }).returning();

    // Update balance
    await db.execute(sql`
      UPDATE wallet_balances 
      SET amount = (amount::numeric + ${amount}::numeric)::text, 
          updated_at = NOW()
      WHERE wallet_id = ${walletId} 
        AND currency = ${currency}
    `);
    
    res.json({ 
      ok: true, 
      transaction: tx,
      message: `Deposited ${amount} ${currency} successfully`
    });
  } catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ error: "Failed to process deposit" });
  }
});

// Transfer money between wallets (P2P or pay a merchant)
walletRouter.post("/api/wallets/transfer", async (req, res) => {
  try {
    const { fromWalletId, toWalletId, currency = "JMD", amount, fee = "0.00", idemKey, meta } = req.body;
    
    if (!fromWalletId || !toWalletId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const numAmount = parseFloat(amount);
    const numFee = parseFloat(fee);
    
    if (numAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Check idempotency
    if (idemKey) {
      const [exists] = await db.select().from(idempotency)
        .where(eq(idempotency.key, idemKey));
      
      if (exists) {
        return res.json({ ok: true, duplicate: true, message: "Transfer already processed" });
      }
      
      await db.insert(idempotency).values({ key: idemKey });
    }
    
    await ensureBalance(fromWalletId, currency);
    await ensureBalance(toWalletId, currency);

    // Check sender balance
    const [fromBal] = await db.select().from(walletBalances)
      .where(and(
        eq(walletBalances.walletId, fromWalletId), 
        eq(walletBalances.currency, currency)
      ));
    
    if (!fromBal || parseFloat(fromBal.amount) < numAmount + numFee) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    const txId = uid();
    const [tx] = await db.insert(walletTx).values({
      id: txId, 
      type: "transfer", 
      currency, 
      amount, 
      fee,
      fromWalletId, 
      toWalletId, 
      status: "succeeded",
      meta: meta || {}
    }).returning();

    // Apply debits and credits
    await db.execute(sql`
      UPDATE wallet_balances 
      SET amount = (amount::numeric - ${numAmount}::numeric - ${numFee}::numeric)::text, 
          updated_at = NOW()
      WHERE wallet_id = ${fromWalletId} 
        AND currency = ${currency}
    `);
    
    await db.execute(sql`
      UPDATE wallet_balances 
      SET amount = (amount::numeric + ${numAmount}::numeric)::text, 
          updated_at = NOW()
      WHERE wallet_id = ${toWalletId} 
        AND currency = ${currency}
    `);

    res.json({ 
      ok: true, 
      transaction: tx,
      message: `Transferred ${amount} ${currency} successfully`
    });
  } catch (error) {
    console.error("Error processing transfer:", error);
    res.status(500).json({ error: "Failed to process transfer" });
  }
});

// Create a payment request (for QR payments)
walletRouter.post("/api/payment-requests", async (req, res) => {
  try {
    const { merchantWalletId, currency = "JMD", amount, description, expiresAt } = req.body;
    
    if (!merchantWalletId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [row] = await db.insert(paymentRequests).values({
      id: uid(),
      merchantWalletId,
      currency,
      amount,
      description,
      expiresAt
    }).returning();
    
    res.json(row);
  } catch (error) {
    console.error("Error creating payment request:", error);
    res.status(500).json({ error: "Failed to create payment request" });
  }
});

// Pay a payment request
walletRouter.post("/api/payment-requests/:id/pay", async (req, res) => {
  try {
    const { id } = req.params;
    const { payerWalletId } = req.body;
    
    if (!payerWalletId) {
      return res.status(400).json({ error: "payerWalletId is required" });
    }

    const [pr] = await db.select().from(paymentRequests)
      .where(eq(paymentRequests.id, id));
    
    if (!pr || pr.status !== "open") {
      return res.status(404).json({ error: "Payment request not available" });
    }
    
    // Use internal transfer
    const transferResult = await fetch(`http://localhost:5000/api/wallets/transfer`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromWalletId: payerWalletId,
        toWalletId: pr.merchantWalletId,
        currency: pr.currency,
        amount: pr.amount,
        idemKey: `pr_${id}_${payerWalletId}`,
        meta: { paymentRequestId: id, description: pr.description }
      })
    });
    
    const tx = await transferResult.json();
    
    if (!transferResult.ok || tx.error) {
      return res.status(400).json(tx);
    }
    
    await db.execute(sql`
      UPDATE payment_requests 
      SET status = 'paid' 
      WHERE id = ${id}
    `);
    
    res.json({ ok: true, transaction: tx, message: "Payment completed" });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
});

// Get wallet balances
walletRouter.get("/api/wallets/:walletId/balances", async (req, res) => {
  try {
    const rows = await db.select().from(walletBalances)
      .where(eq(walletBalances.walletId, req.params.walletId));
    
    res.json(rows);
  } catch (error) {
    console.error("Error fetching balances:", error);
    res.status(500).json({ error: "Failed to fetch balances" });
  }
});

// Get wallet transactions
walletRouter.get("/api/wallets/:walletId/transactions", async (req, res) => {
  try {
    const { walletId } = req.params;
    
    const rows = await db.select().from(walletTx)
      .where(
        or(
          eq(walletTx.fromWalletId, walletId),
          eq(walletTx.toWalletId, walletId)
        )
      )
      .orderBy(desc(walletTx.createdAt))
      .limit(50);
    
    res.json(rows);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Get coin denominations
walletRouter.get("/api/coins", async (req, res) => {
  try {
    const coins = await db.select().from(coinDenominations);
    res.json(coins);
  } catch (error) {
    console.error("Error fetching coins:", error);
    res.status(500).json({ error: "Failed to fetch coin denominations" });
  }
});

// Initialize FX rates
walletRouter.post("/api/fx-rates/init", async (req, res) => {
  try {
    const rates = [
      { pair: "USD/JMD", rate: "150.00000000" },
      { pair: "USD/YFD", rate: "0.00750000" },  // 1 YFD = $0.0075 USD
      { pair: "JMD/YFD", rate: "1.15000000" },  // 1 YFD = 1.15 JMD
    ];
    
    for (const rate of rates) {
      await db.insert(fxRates).values(rate)
        .onConflictDoUpdate({
          target: fxRates.pair,
          set: { rate: rate.rate, updatedAt: new Date() }
        });
    }
    
    res.json({ message: "FX rates initialized", rates });
  } catch (error) {
    console.error("Error initializing FX rates:", error);
    res.status(500).json({ error: "Failed to initialize FX rates" });
  }
});

export default walletRouter;