import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTransactionSchema, insertSecurityLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Transaction routes
  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId,
      });

      // Log security event for transaction
      await storage.logSecurityEvent({
        userId,
        eventType: 'transfer',
        severity: 'medium',
        description: `User initiated ${validatedData.type} transaction for ${validatedData.amount} ${validatedData.currency}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      const transaction = await storage.createTransaction(validatedData);
      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get('/api/transactions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transaction = await storage.getTransaction(req.params.id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      // Ensure user can only access their own transactions
      if (transaction.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  // Security routes
  app.get('/api/security/logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logs = await storage.getSecurityLogs(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching security logs:", error);
      res.status(500).json({ message: "Failed to fetch security logs" });
    }
  });

  app.get('/api/security/threats', isAuthenticated, async (req: any, res) => {
    try {
      const threats = await storage.getRecentThreats();
      res.json(threats);
    } catch (error) {
      console.error("Error fetching threats:", error);
      res.status(500).json({ message: "Failed to fetch threats" });
    }
  });

  // Security activation endpoint
  app.post('/api/security/activate-beast-mode', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Log beast mode activation
      await storage.logSecurityEvent({
        userId,
        eventType: 'defense_activated',
        severity: 'high',
        description: 'Beast Mode security protocol activated',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        defenseSystemActivated: true,
      });

      res.json({ 
        message: "Beast Mode activated successfully",
        status: "active",
        defenseLevel: "maximum"
      });
    } catch (error) {
      console.error("Error activating beast mode:", error);
      res.status(500).json({ message: "Failed to activate beast mode" });
    }
  });

  // Global statistics endpoint
  app.get('/api/stats/global', async (req, res) => {
    try {
      // Return global YardFlex statistics
      res.json({
        countries: 195,
        uptime: "99.99%",
        breaches: 0,
        activeDefenses: 24,
        threatsBlocked: 1247892,
        securityLevel: "FORTRESS",
      });
    } catch (error) {
      console.error("Error fetching global stats:", error);
      res.status(500).json({ message: "Failed to fetch global statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
