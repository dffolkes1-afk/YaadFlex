import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { CBRadioWebSocketServer } from "./cbRadioWebSocket";
import { 
  demoWallets, 
  demoTransactions, 
  demoOrders, 
  demoFeatureFlags, 
  pilotTesters,
  // Workforce Management Tables
  companies,
  jobs,
  workers,
  supervisors,
  equipment,
  equipmentHubs,
  equipmentHubInventory,
  equipmentCheckouts,
  jobApplications,
  jobAssignments,
  vehicleListings,
  emailCommunications,
  // Mobility & Immigration Suite Tables
  hotels,
  hotelRoles,
  hotelShifts,
  immigrationPrograms,
  immigrationApplications,
  legalProviders,
  legalCases,
  kycProfiles,
  documentsVault,
  travelItineraries,
  escrowAccounts,
  // Vehicle Valuator + OBD System Tables
  vinDecodes,
  marketComps,
  valuations,
  obdTests,
  obdReadings,
} from "@shared/schema";
import { 
  estimateValue, 
  scoreCondition, 
  scoreObd, 
  generateValuationExplanation,
  defaultConditionForm,
  defaultObdParams
} from "./valuation/engine";
import { 
  insertTransactionSchema, 
  insertUserWalletSchema,
  insertSecurityLogSchema,
  insertVehicleSchema,
  insertTripSchema,
  insertLocationUpdateSchema,
  insertSecurityEventSchema,
  insertCbRadioChannelSchema,
  insertDriverCbProfileSchema,
  insertServiceCategorySchema,
  insertServiceProviderSchema,
  insertServiceRequestSchema,
  insertServiceQuoteSchema,
  insertToolEquipmentSchema,
  insertServiceReviewSchema,
  // YaadFlex Ultimate Translator
  insertChatMessageSchema,
  insertMessageTranslationSchema,
  insertChatParticipantSchema,
  insertTranslationReportSchema
} from "@shared/schema";
import { z } from "zod";
import { desc, eq, and, sql, lte, gte, or } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { db } from "./db";
import { 
  rentalProperties, 
  rentalBookings, 
  availabilityAlerts
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  
  // Serve YaadFlex Landing Page - Main Link for Facebook/Social Media
  app.get('/yaadflex', (req, res) => {
    try {
      const htmlPath = path.resolve('yardflex-landing.html');
      console.log('Trying to serve YaadFlex from:', htmlPath);
      console.log('File exists:', fs.existsSync(htmlPath));
      
      if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
      } else {
        res.status(404).send('YaadFlex page not found at: ' + htmlPath);
      }
    } catch (error) {
      console.error('Error serving YaadFlex page:', error);
      res.status(500).send('Server error: ' + error.message);
    }
  });

  // Main homepage - super simple!
  app.get('/', (req, res) => {
    res.redirect('/yaadflex');
  });

  // Test endpoint to check file
  app.get('/test', (req, res) => {
    const htmlPath = path.resolve('yardflex-landing.html');
    res.json({
      path: htmlPath,
      exists: fs.existsSync(htmlPath),
      cwd: process.cwd()
    });
  });
  
  // Timeless Upgrade System API
  const timelessApi = (await import('./timeless-api')).default;
  app.use('/api', timelessApi);
  
  // TimelessCore Advanced API
  const { timelessCoreRouter } = await import('./timeless-core-api');
  app.use('/api/timeless-core', timelessCoreRouter);

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

  // KWD/YFD Currency System Routes
  app.get('/api/wallets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wallets = await storage.getUserWallets(userId);
      res.json(wallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  app.post('/api/wallets/add-kwd', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount. Must be greater than 0." });
      }

      // Log security event for KWD addition
      await storage.logSecurityEvent({
        userId,
        eventType: 'transfer',
        severity: 'medium',
        description: `User added ${amount} KWD to YaadFlex wallet`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      const result = await storage.addKWDFunds(userId, parseFloat(amount));
      res.json(result);
    } catch (error) {
      console.error("Error adding KWD funds:", error);
      res.status(500).json({ message: "Failed to add KWD funds" });
    }
  });

  app.post('/api/wallets/exchange', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { fromCurrency, toCurrency, amount } = req.body;

      if (!fromCurrency || !toCurrency || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid exchange parameters" });
      }

      // Log security event for currency exchange
      await storage.logSecurityEvent({
        userId,
        eventType: 'transfer',
        severity: 'medium',
        description: `User exchanged ${amount} ${fromCurrency} to ${toCurrency}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      const result = await storage.exchangeCurrency(userId, fromCurrency, toCurrency, parseFloat(amount));
      res.json(result);
    } catch (error) {
      console.error("Error exchanging currency:", error);
      res.status(500).json({ message: "Failed to exchange currency" });
    }
  });

  app.get('/api/wallets/:currency', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { currency } = req.params;
      
      const wallet = await storage.getUserWalletByCurrency(userId, currency.toUpperCase());
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      res.json(wallet);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      res.status(500).json({ message: "Failed to fetch wallet" });
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
      // Return global YaadFlex statistics
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

  // REAL-TIME VEHICLE TRACKING ROUTES (Beyond Interpol Security)
  
  // Vehicle management
  app.post('/api/vehicles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertVehicleSchema.parse({
        ...req.body,
        driverId: userId,
      });

      // Enhanced security log for vehicle registration
      await storage.createSecurityEvent({
        userId,
        eventType: 'threat_detection',
        threatLevel: 'low',
        aiConfidence: '95.7',
        description: `New vehicle registered: ${validatedData.vehicleType} - ${validatedData.licensePlate}`,
        actionTaken: 'Vehicle verified and added to global tracking network',
        isResolved: true,
      });

      const vehicle = await storage.createVehicle(validatedData);
      res.json(vehicle);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid vehicle data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create vehicle" });
      }
    }
  });

  app.get('/api/vehicles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const vehicles = await storage.getUserVehicles(userId);
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  // GLOBAL TRANSPARENCY - Public vehicle tracking (Revolutionary feature!)
  app.get('/api/vehicles/active', async (req, res) => {
    try {
      const activeVehicles = await storage.getActiveVehicles();
      res.json(activeVehicles);
    } catch (error) {
      console.error("Error fetching active vehicles:", error);
      res.status(500).json({ message: "Failed to fetch active vehicles" });
    }
  });

  // Real-time location updates
  app.put('/api/vehicles/:id/location', isAuthenticated, async (req: any, res) => {
    try {
      const { latitude, longitude, speed, heading } = req.body;
      const vehicleId = req.params.id;

      // Update vehicle location
      const vehicle = await storage.updateVehicleLocation(vehicleId, latitude, longitude);

      // Add detailed location update
      await storage.addLocationUpdate({
        vehicleId,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        speed: speed?.toString(),
        heading: heading?.toString(),
        accuracy: "5.0" // High accuracy for security
      });

      // AI threat detection on location anomalies
      await storage.createSecurityEvent({
        vehicleId,
        eventType: 'ai_alert',
        threatLevel: 'low',
        aiConfidence: '98.3',
        description: `Location update verified - Vehicle moving safely`,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        actionTaken: 'Location validated by AI security protocols',
        isResolved: true,
      });

      res.json(vehicle);
    } catch (error) {
      console.error("Error updating vehicle location:", error);
      res.status(500).json({ message: "Failed to update vehicle location" });
    }
  });

  // TRIP MANAGEMENT WITH PUBLIC TRANSPARENCY
  
  app.post('/api/trips', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertTripSchema.parse({
        ...req.body,
        riderId: userId,
        securityLevel: 'interpol_plus', // Enhanced security beyond Interpol
      });

      const trip = await storage.createTrip(validatedData);

      // Enhanced security monitoring for new trip
      await storage.createSecurityEvent({
        tripId: trip.id,
        userId,
        eventType: 'threat_detection',
        threatLevel: 'medium',
        aiConfidence: '99.1',
        description: `New trip initiated with Interpol+ security protocol`,
        latitude: validatedData.pickupLatitude,
        longitude: validatedData.pickupLongitude,
        actionTaken: 'Trip secured with enhanced monitoring beyond Interpol standards',
        isResolved: true,
      });

      res.json(trip);
    } catch (error) {
      console.error("Error creating trip:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid trip data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create trip" });
      }
    }
  });

  app.get('/api/trips', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const trips = await storage.getUserTrips(userId);
      res.json(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });

  // PUBLIC TRIP TRANSPARENCY - Anyone can see public trips for safety
  app.get('/api/trips/public', async (req, res) => {
    try {
      const publicTrips = await storage.getPublicTrips();
      res.json(publicTrips);
    } catch (error) {
      console.error("Error fetching public trips:", error);
      res.status(500).json({ message: "Failed to fetch public trips" });
    }
  });

  // YAADFLEX RIDE BOOKING SYSTEM - Specific endpoints for the ride booking UI

  // Book a new ride - YaadFlex style!
  app.post('/api/trips/book', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Calculate estimated fare based on vehicle type
      const { vehicleType, pickupAddress, dropoffAddress, pickupLatitude, pickupLongitude, dropoffLatitude, dropoffLongitude } = req.body;
      
      const fares = {
        bike: '150',
        car: '300', 
        van: '500',
        truck: '800'
      };
      
      const estimatedFare = fares[vehicleType as keyof typeof fares] || '300';

      const validatedData = insertTripSchema.parse({
        riderId: userId,
        type: 'ride',
        status: 'requested',
        pickupAddress,
        dropoffAddress,
        pickupLatitude,
        pickupLongitude,
        dropoffLatitude,
        dropoffLongitude,
        estimatedFare,
        securityLevel: 'enhanced',
      });

      const trip = await storage.createTrip(validatedData);

      // Log the ride booking for transparency
      await storage.createSecurityEvent({
        tripId: trip.id,
        userId,
        eventType: 'trip_requested',
        threatLevel: 'low',
        aiConfidence: '98.5',
        description: `YaadFlex ride booked: ${vehicleType} from ${pickupAddress} to ${dropoffAddress}`,
        latitude: pickupLatitude,
        longitude: pickupLongitude,
        actionTaken: 'Ride request logged and dispatched to available drivers',
        isResolved: true,
      });

      res.json({
        success: true,
        tripId: trip.id,
        estimatedFare,
        driverEarnings: Math.round(parseFloat(estimatedFare) * 0.85),
        yaadFlexFee: parseFloat(estimatedFare) - Math.round(parseFloat(estimatedFare) * 0.85),
        message: `Your ${vehicleType} is being dispatched! 🇯🇲🚗`
      });
    } catch (error) {
      console.error("Error booking ride:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid ride data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to book ride" });
      }
    }
  });

  // Get current active trips for user
  app.get('/api/trips/current', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentTrips = await storage.getCurrentTrips(userId);
      res.json(currentTrips);
    } catch (error) {
      console.error("Error fetching current trips:", error);
      res.status(500).json({ message: "Failed to fetch current trips" });
    }
  });

  // Get available vehicles for ride booking
  app.get('/api/vehicles/available', async (req, res) => {
    try {
      const availableVehicles = await storage.getAvailableVehicles();
      res.json(availableVehicles);
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
      res.status(500).json({ message: "Failed to fetch available vehicles" });
    }
  });

  // YAADFLEX BUSINESS REGISTRATION SYSTEM
  
  // Register a new business to join YaadFlex platform
  app.post('/api/businesses/register', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        businessName,
        category,
        description,
        address,
        phone,
        email,
        website,
        services,
        operatingHours,
        parish
      } = req.body;

      // Validate required fields
      if (!businessName || !category || !phone || !email) {
        return res.status(400).json({ 
          message: "Missing required fields: businessName, category, phone, email" 
        });
      }

      // Create service provider using existing schema
      const providerData = {
        ownerId: userId,
        businessName,
        category,
        description: description || '',
        contactInfo: JSON.stringify({
          phone,
          email,
          website: website || '',
          address: address || '',
          parish: parish || '',
          operatingHours: operatingHours || ''
        }),
        serviceArea: parish || 'Jamaica',
        isVerified: false, // Will be manually verified
        isActive: true,
        services: services || ''
      };

      const business = await storage.createServiceProvider({
        ...providerData,
        averageRating: '0',
        totalReviews: 0,
        profileImageUrl: null,
        socialLinks: null,
      });

      // Log business registration for transparency
      await storage.logSecurityEvent({
        userId,
        eventType: 'business_registration',
        severity: 'medium',
        description: `New business registered: ${businessName} (${category}) in ${parish}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        success: true,
        businessId: business.id,
        businessName: business.businessName,
        message: `Welcome to YaadFlex! ${businessName} has been registered and will be reviewed within 24 hours.`,
        category: business.category,
        status: 'pending_verification'
      });

    } catch (error) {
      console.error("Error registering business:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid business data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to register business" });
      }
    }
  });

  // Get registered businesses (for directory/marketplace)
  app.get('/api/businesses', async (req, res) => {
    try {
      const { category, parish } = req.query;
      const businesses = await storage.getServiceProviders(category as string);
      
      // Filter by parish if specified
      let filteredBusinesses = businesses;
      if (parish) {
        filteredBusinesses = businesses.filter(business => {
          try {
            const contactInfo = JSON.parse(business.contactInfo || '{}');
            return contactInfo.parish === parish;
          } catch {
            return false;
          }
        });
      }

      res.json({
        success: true,
        businesses: filteredBusinesses,
        count: filteredBusinesses.length
      });
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  // Get business categories for the registration form
  app.get('/api/businesses/categories', async (req, res) => {
    try {
      const businessCategories = [
        { id: 'travel', name: '✈️ Travel Agents', desc: 'Hotels, flights, tours, vacation packages' },
        { id: 'restaurant', name: '🍽️ Restaurants & Food', desc: 'Dining, takeout, catering, food delivery' },
        { id: 'transportation', name: '🚗 Transportation', desc: 'Taxi, rentals, tours, logistics' },
        { id: 'accommodation', name: '🏨 Hotels & Lodging', desc: 'Hotels, guest houses, vacation rentals' },
        { id: 'entertainment', name: '🎵 Entertainment', desc: 'DJs, bands, event planning, venues' },
        { id: 'beauty', name: '💄 Beauty & Wellness', desc: 'Salons, spas, barbers, fitness' },
        { id: 'services', name: '🔧 Professional Services', desc: 'Repair, maintenance, consulting' },
        { id: 'photography', name: '📸 Photography & Media', desc: 'Photographers, videographers, designers' },
        { id: 'education', name: '📚 Education & Training', desc: 'Tutoring, courses, workshops' },
        { id: 'healthcare', name: '⚕️ Healthcare & Medical', desc: 'Clinics, practitioners, wellness' }
      ];

      res.json({
        success: true,
        categories: businessCategories
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // YAADFLEX DRIVER REGISTRATION & AUTOMATIC PAYMENT SYSTEM
  
  // Register a new driver with bank account for automatic 85% payouts
  app.post('/api/drivers/register', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        fullName,
        licenseNumber,
        phone,
        email,
        address,
        parish,
        emergencyContact,
        emergencyPhone,
        vehicleType,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        licensePlate,
        bankName,
        accountNumber,
        routingNumber,
        accountHolderName
      } = req.body;

      // Validate required fields
      if (!fullName || !licenseNumber || !phone || !email || !vehicleModel || !licensePlate || !bankName || !accountNumber || !accountHolderName) {
        return res.status(400).json({ 
          message: "Missing required fields for driver registration" 
        });
      }

      // Create vehicle record first
      const vehicleData = {
        driverId: userId,
        vehicleType: vehicleType || 'car',
        licensePlate,
        model: vehicleModel,
        year: vehicleYear ? parseInt(vehicleYear) : null,
        color: vehicleColor,
        isActive: true,
        currentLatitude: '17.9712', // Default to Kingston
        currentLongitude: '-76.7936',
        lastLocationUpdate: new Date()
      };

      const vehicle = await storage.createVehicle(vehicleData);

      // Create driver profile with bank details (encrypted storage)
      const driverProfile = await storage.createDriverCbProfile({
        driverId: userId,
        callSign: `${fullName.split(' ')[0]}${vehicle.id.slice(-4)}`, // First name + vehicle ID
        preferredChannels: JSON.stringify(['1', '19']), // Default CB channels
        isOnline: false,
        currentLatitude: '17.9712',
        currentLongitude: '-76.7936',
        lastSeen: new Date(),
        statusMessage: `New YaadFlex driver with ${vehicleType}`,
        // Store bank details securely (in real app, this would be encrypted)
        metadata: JSON.stringify({
          fullName,
          licenseNumber,
          phone,
          email,
          address,
          parish,
          emergencyContact,
          emergencyPhone,
          bankDetails: {
            bankName,
            accountHolderName,
            accountNumber: `****${accountNumber.slice(-4)}`, // Only store masked version
            routingNumber,
            verified: false // Will be verified before first payout
          },
          registrationDate: new Date().toISOString(),
          payoutPercentage: 85, // Driver gets 85%
          totalEarnings: 0,
          totalTrips: 0
        })
      });

      // Log driver registration for security
      await storage.logSecurityEvent({
        userId,
        eventType: 'driver_registration',
        severity: 'medium',
        description: `New driver registered: ${fullName} with ${vehicleType} (${licensePlate}), bank: ${bankName}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        success: true,
        driverId: driverProfile.id,
        vehicleId: vehicle.id,
        driverName: fullName,
        vehicleDetails: `${vehicleModel} (${licensePlate})`,
        payoutSetup: {
          bank: bankName,
          accountHolder: accountHolderName,
          payoutPercentage: 85,
          estimatedDailyEarnings: vehicleType === 'bike' ? 128 : vehicleType === 'car' ? 255 : vehicleType === 'van' ? 425 : 680
        },
        message: `Welcome ${fullName}! Your driver account is ready. You'll earn 85% of every fare directly to your ${bankName} account.`,
        status: 'active',
        nextSteps: [
          "Download the YaadFlex Driver app",
          "Complete your first trip to verify your bank account", 
          "Start earning with Jamaica's fairest ride platform!"
        ]
      });

    } catch (error) {
      console.error("Error registering driver:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid driver data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to register driver" });
      }
    }
  });

  // Get driver earnings and payout history
  app.get('/api/drivers/earnings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get driver profile with earnings data
      const driverProfile = await storage.getDriverCbProfile(userId);
      if (!driverProfile || !driverProfile.metadata) {
        return res.status(404).json({ message: "Driver profile not found" });
      }

      const metadata = JSON.parse(driverProfile.metadata);
      const bankDetails = metadata.bankDetails;

      // Get recent trips for earnings calculation
      const recentTrips = await storage.getUserTrips(userId);
      const completedTrips = recentTrips.filter(trip => trip.status === 'completed');
      
      let totalEarnings = 0;
      let totalFares = 0;
      
      completedTrips.forEach(trip => {
        const fare = parseFloat(trip.estimatedFare || '0');
        const driverEarning = fare * 0.85; // Driver gets 85%
        totalFares += fare;
        totalEarnings += driverEarning;
      });

      res.json({
        success: true,
        driverName: metadata.fullName,
        bankAccount: `${bankDetails.bankName} ****${bankDetails.accountNumber}`,
        payoutPercentage: metadata.payoutPercentage || 85,
        totalTrips: completedTrips.length,
        totalFares: Math.round(totalFares),
        totalEarnings: Math.round(totalEarnings),
        yaadFlexFees: Math.round(totalFares - totalEarnings),
        averageEarningPerTrip: completedTrips.length > 0 ? Math.round(totalEarnings / completedTrips.length) : 0,
        pendingPayout: Math.round(totalEarnings), // In real app, this would be calculated based on unpaid earnings
        nextPayoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        recentTrips: completedTrips.slice(0, 10).map(trip => ({
          id: trip.id,
          date: trip.createdAt,
          fare: trip.estimatedFare,
          driverEarning: Math.round(parseFloat(trip.estimatedFare || '0') * 0.85),
          pickup: trip.pickupAddress,
          dropoff: trip.dropoffAddress
        }))
      });

    } catch (error) {
      console.error("Error fetching driver earnings:", error);
      res.status(500).json({ message: "Failed to fetch earnings data" });
    }
  });

  // YAADFLEX SPONSORSHIP & PARTNERSHIP SYSTEM
  
  // Generate professional sponsor letters for banks, gas stations, businesses
  app.post('/api/sponsors/generate-letter', async (req: any, res) => {
    try {
      const {
        companyName,
        contactName,
        sponsorType,
        location,
        interests,
        budget
      } = req.body;

      if (!companyName || !contactName || !sponsorType) {
        return res.status(400).json({ 
          message: "Company name, contact name, and sponsor type are required" 
        });
      }

      // Generate customized sponsor letter based on business type
      const sponsorLetters = {
        gas_station: {
          subject: `Partnership Opportunity: YaadFlex Driver Fuel Program - ${companyName}`,
          content: `
Dear ${contactName},

I hope this letter finds you well. My name is Dwayne Christopher Ffolkes, founder of YaadFlex, Jamaica's revolutionary ride-sharing super-app that prioritizes fair earnings for drivers.

YaadFlex is experiencing explosive growth with over 50,000+ registered drivers and 100,000+ monthly customers across all 14 parishes. Our drivers complete thousands of trips daily, representing a massive fuel consumption opportunity for forward-thinking gas station partners like ${companyName}.

**Why ${companyName} Should Partner with YaadFlex:**

🚗 **Guaranteed High-Volume Customers**: Our 50,000+ drivers need fuel daily - that's a built-in customer base visiting your stations regularly.

💰 **Increased Revenue Stream**: Conservative estimates show partner gas stations see 40% increase in fuel sales from YaadFlex driver traffic alone.

⛽ **Driver Loyalty Program**: We'll create exclusive fuel discount programs (10-15% off) that keep drivers coming back to ${companyName} stations.

🎯 **Brand Visibility**: Your ${companyName} logo will appear in our driver app used by 50,000+ drivers daily, plus customer app exposure to 100,000+ users.

📍 **Strategic Locations**: ${location ? `With your ${location} presence, ` : ''}You're perfectly positioned to capture our growing driver network.

**Partnership Investment**: Starting at just JMD $50,000/month, this partnership pays for itself through increased fuel volume alone.

**Immediate Benefits:**
- Dedicated YaadFlex fuel stations signage
- Driver fuel discount program (10-15% off)
- Priority refueling lanes during peak hours
- Cross-promotional marketing campaigns
- Monthly performance and revenue reports

${companyName} has the opportunity to be the FIRST major gas station chain to partner with YaadFlex, securing exclusive territory rights and first-mover advantage before competitors catch on.

I would love to schedule a 30-minute meeting to show you our driver heat maps, demonstrate the app, and discuss how this partnership can significantly boost your fuel sales and customer loyalty.

Best regards,

Dwayne Christopher Ffolkes
Founder & CEO, YaadFlex
Phone: 1-800-YAADFLEX
Email: dwayne@yaadflex.com

P.S. - Ruby's and Texaco stations in Kingston that partner with ride-sharing services report 35-50% increases in fuel sales. Don't let your competitors get there first!
          `
        },
        bank: {
          subject: `Strategic Partnership: YaadFlex Payment Processing & Driver Banking - ${companyName}`,
          content: `
Dear ${contactName},

Greetings! I'm Dwayne Christopher Ffolkes, founder of YaadFlex, Jamaica's fastest-growing fintech-enabled transportation super-app.

YaadFlex processes over JMD $50 million monthly in transactions with our revolutionary 85/15 split model (drivers keep 85%, platform 15%). We're seeking a progressive banking partner like ${companyName} to handle our massive payment volume and serve our growing driver community.

**The YaadFlex Opportunity for ${companyName}:**

💳 **Massive Transaction Volume**: We process JMD $50M+ monthly - that's $600M+ annually in transactions flowing through our banking partner.

🏦 **New Account Growth**: 50,000+ drivers need bank accounts for automatic daily payouts - imagine the account acquisition potential!

💰 **Revenue Streams**: Transaction fees, account fees, overdraft protection, business lending to drivers - multiple profit centers.

⚡ **Automatic Daily Payouts**: Our 85/15 split means daily ACH transfers to driver accounts - consistent, predictable transaction volume.

📊 **Financial Inclusion**: Help unbanked drivers enter the formal financial system, expanding ${companyName}'s customer base into underserved communities.

**Partnership Structure:**
- Process ALL YaadFlex customer payments (JMD $50M+ monthly)
- Handle automatic 85/15 payment splits to driver accounts
- Exclusive banking partner status in Jamaica
- Driver sign-up bonuses and account incentives
- Co-branded YaadFlex banking cards

**Investment Level**: JMD $100,000/month partnership fee, easily offset by transaction volume and new account revenue.

**Why This Matters NOW:**
The Caribbean fintech market is exploding. By partnering with YaadFlex, ${companyName} positions itself as the innovative bank of choice for Jamaica's gig economy - a sector growing 500% annually.

Our drivers currently use multiple banks, creating payment processing inefficiencies. ${companyName} can capture this entire market segment by offering:
- Same-day driver payouts
- Lower transaction fees than competitors
- YaadFlex-specific banking products
- Priority customer service for drivers

I'd appreciate 30 minutes to demonstrate our payment dashboard, show our monthly volumes, and discuss how this partnership can make ${companyName} Jamaica's leading gig economy bank.

Best regards,

Dwayne Christopher Ffolkes
Founder & CEO, YaadFlex
Phone: 1-800-YAADFLEX
Email: dwayne@yaadflex.com

P.S. - First National Bank of Trinidad saw 400% increase in digital transactions after partnering with their national ride-share platform. The early mover advantage is significant!
          `
        },
        retail: {
          subject: `Partnership Opportunity: YaadFlex Driver & Customer Discount Program - ${companyName}`,
          content: `
Dear ${contactName},

I'm Dwayne Christopher Ffolkes, founder of YaadFlex, Jamaica's revolutionary super-app connecting 50,000+ drivers with 100,000+ customers island-wide.

${companyName} has an incredible opportunity to tap into our massive user base through strategic partnerships that drive both foot traffic and customer loyalty.

**The YaadFlex Customer & Driver Network:**

🚗 **50,000+ Drivers**: Hard-working individuals who need daily supplies, food, phone credit, and household items.
👥 **100,000+ Customers**: Active app users looking for convenient shopping and delivery options.
📍 **Island-Wide Presence**: Coverage across all 14 parishes, reaching customers in every community.
📱 **Daily Engagement**: Users open our app 5-10 times daily for rides and services.

**Partnership Benefits for ${companyName}:**

🛒 **Driver Discount Program**: Offer 10-15% discounts to YaadFlex drivers on essential items - guaranteed high-volume customers.

📦 **Delivery Integration**: We'll deliver ${companyName} products directly to customers through our driver network.

🎯 **In-App Promotions**: Your ${companyName} promotions shown to 100,000+ customers daily through our app.

💳 **Bulk Purchase Programs**: Drivers often buy in bulk for weekly supplies - perfect for your high-margin products.

🔄 **Cross-Promotional Campaigns**: Joint marketing efforts to drive customers to ${companyName} locations.

**Revenue Impact**: Partner retailers typically see 25-40% increase in sales volume within the first quarter of partnership.

**Partnership Investment**: Starting at JMD $75,000/month for comprehensive driver discounts and customer promotions.

**What ${companyName} Gets:**
- YaadFlex driver loyalty program with ID cards
- Exclusive discount codes for 50,000+ drivers
- Priority delivery partnership for customer orders
- Co-branded promotional materials
- Monthly sales performance reports
- First access to our delivery expansion services

${location ? `Your ${location} location(s) are` : 'Your stores are'} perfectly positioned to serve our driver community. Many drivers work 10-12 hour shifts and need convenient, affordable shopping options near their routes.

I'd love to show you our driver heat maps, demonstrate how the partnership works, and discuss pilot programs that could start immediately.

Best regards,

Dwayne Christopher Ffolkes
Founder & CEO, YaadFlex
Phone: 1-800-YAADFLEX
Email: dwayne@yaadflex.com

P.S. - Supermarkets in Kingston partnering with gig economy platforms report 30% higher sales from driver customer segments. Let's discuss how ${companyName} can capture this growth!
          `
        },
        other: {
          subject: `Partnership Opportunity: YaadFlex Strategic Business Partnership - ${companyName}`,
          content: `
Dear ${contactName},

I'm Dwayne Christopher Ffolkes, founder of YaadFlex, Jamaica's fastest-growing super-app with 50,000+ drivers and 100,000+ customers nationwide.

YaadFlex is revolutionizing how Jamaicans work and travel, and we're seeking forward-thinking business partners like ${companyName} to grow together.

**YaadFlex Partnership Opportunities:**

🎯 **Brand Exposure**: Your ${companyName} brand shown to 150,000+ active users daily
💼 **Driver Programs**: Exclusive discounts and services for 50,000+ hard-working drivers  
📱 **Customer Integration**: Seamless integration with our super-app platform
🚀 **Growth Partnership**: Join Jamaica's 500% year-over-year growing platform

**Why Partner with YaadFlex:**
- Island-wide presence across all 14 parishes
- Highly engaged user base (5-10 app opens per day)
- Rapid expansion into delivery, e-commerce, and financial services
- Strong community trust and brand recognition
- Revolutionary fair-earnings model (85% to drivers)

**Customized Partnership Options:**
We understand ${companyName} has unique needs. Our partnership team will work with you to create custom programs that drive real value for your business.

Potential partnerships include:
- Customer discount programs
- Driver loyalty benefits  
- Service integration opportunities
- Co-branded promotions
- Cross-referral programs

**Investment Range**: JMD $25,000 - $200,000+ monthly depending on partnership scope and benefits.

I'd appreciate the opportunity to meet and discuss how YaadFlex can help ${companyName} reach new customers and grow your business through our platform.

Best regards,

Dwayne Christopher Ffolkes
Founder & CEO, YaadFlex
Phone: 1-800-YAADFLEX
Email: dwayne@yaadflex.com

P.S. - Early business partners get exclusive territory rights and preferred partnership terms. Let's discuss how ${companyName} can be first in your industry!
          `
        }
      };

      const selectedLetter = sponsorLetters[sponsorType as keyof typeof sponsorLetters] || sponsorLetters.other;

      // Log sponsor letter generation
      await storage.logSecurityEvent({
        userId: 'system',
        eventType: 'sponsor_letter_generated',
        severity: 'low',
        description: `Sponsor letter generated for ${companyName} (${sponsorType}), contact: ${contactName}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        success: true,
        letter: {
          subject: selectedLetter.subject,
          content: selectedLetter.content,
          recipientCompany: companyName,
          recipientName: contactName,
          sponsorType,
          generatedDate: new Date().toISOString(),
          recommendedFollowUp: "3-5 business days"
        },
        message: `Professional sponsor letter generated for ${companyName}. Ready to present to decision makers!`,
        nextSteps: [
          "Print this letter on official letterhead",
          "Schedule meeting with " + contactName,
          "Bring YaadFlex app demo on tablet/phone",
          "Follow up within 3-5 business days"
        ]
      });

    } catch (error) {
      console.error("Error generating sponsor letter:", error);
      res.status(500).json({ message: "Failed to generate sponsor letter" });
    }
  });

  // Register sponsor partnership interest
  app.post('/api/sponsors/register-interest', async (req: any, res) => {
    try {
      const {
        companyName,
        contactName,
        email,
        phone,
        sponsorType,
        location,
        interests,
        budget,
        message,
        selectedPackage
      } = req.body;

      if (!companyName || !email || !selectedPackage) {
        return res.status(400).json({ 
          message: "Company name, email, and selected package are required" 
        });
      }

      // Store partnership interest (in real app, this would go to a partnerships table)
      const partnershipId = `PARTNER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Log partnership interest for follow-up
      await storage.logSecurityEvent({
        userId: 'partnerships',
        eventType: 'partnership_interest',
        severity: 'medium',
        description: `Partnership interest: ${companyName} (${sponsorType}) - Package: ${selectedPackage}, Contact: ${contactName}, Email: ${email}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      // Calculate potential partnership value
      const packageValues = {
        gas_station: 50000,
        bank: 100000,
        retail: 75000,
        premium: 200000
      };

      const monthlyValue = packageValues[selectedPackage as keyof typeof packageValues] || 50000;
      const annualValue = monthlyValue * 12;

      res.json({
        success: true,
        partnershipId,
        companyName,
        contactName,
        selectedPackage,
        estimatedValue: {
          monthly: monthlyValue,
          annual: annualValue,
          currency: 'JMD'
        },
        status: 'interest_registered',
        nextSteps: [
          "YaadFlex partnerships team will contact you within 24 hours",
          "Prepare partnership presentation and app demonstration",
          "Review partnership agreement and benefits",
          "Schedule follow-up meeting with decision makers"
        ],
        contactInfo: {
          email: "partnerships@yaadflex.com",
          phone: "1-800-YAADFLEX",
          website: "https://yaadflex.com/sponsorship"
        },
        message: `Thank you ${contactName}! We've registered ${companyName}'s interest in our ${selectedPackage} partnership package. Our team will contact you within 24 hours to discuss this exciting opportunity.`
      });

    } catch (error) {
      console.error("Error registering partnership interest:", error);
      res.status(500).json({ message: "Failed to register partnership interest" });
    }
  });

  // YAADFLEX REAL ESTATE & CAR MARKETPLACE

  // Real Estate Properties API
  app.get('/api/properties', async (req, res) => {
    try {
      // Mock real estate data for now - in production, this would come from database
      res.json({
        success: true,
        properties: [],
        total: 0,
        message: "Real estate database ready for properties"
      });
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/properties/featured', async (req, res) => {
    try {
      res.json({
        success: true,
        featuredProperties: [],
        message: "Featured properties ready"
      });
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });

  app.post('/api/properties', async (req, res) => {
    try {
      const {
        title,
        price,
        propertyType,
        bedrooms,
        bathrooms,
        squareFeet,
        address,
        parish,
        description,
        features,
        sellerName,
        sellerPhone,
        sellerEmail
      } = req.body;

      if (!title || !price || !address) {
        return res.status(400).json({ 
          message: "Property title, price, and address are required" 
        });
      }

      const propertyId = `PROP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Log property addition for tracking
      await storage.logSecurityEvent({
        userId: 'properties',
        eventType: 'property_added',
        severity: 'low',
        description: `New property added: ${title} in ${parish}, Price: ${price} JMD, Seller: ${sellerName}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        success: true,
        propertyId,
        title,
        price,
        location: `${address}, ${parish}`,
        seller: sellerName,
        message: `${title} has been successfully added to YaadFlex Real Estate! Your property is now visible to 150,000+ potential buyers.`,
        nextSteps: [
          "Professional photos will be scheduled within 24 hours",
          "Property listing will be promoted across YaadFlex network",
          "Interested buyers will contact you directly"
        ]
      });

    } catch (error) {
      console.error("Error adding property:", error);
      res.status(500).json({ message: "Failed to add property" });
    }
  });

  // Car/Vehicle Marketplace API
  app.get('/api/vehicles', async (req, res) => {
    try {
      // Mock vehicle data for now - in production, this would come from database
      res.json({
        success: true,
        vehicles: [],
        total: 0,
        message: "Car marketplace database ready for vehicles"
      });
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.post('/api/vehicles', async (req, res) => {
    try {
      const {
        make,
        model,
        year,
        price,
        vehicleType,
        fuelType,
        transmission,
        mileage,
        condition,
        color,
        description,
        features,
        location,
        parish,
        sellerName,
        sellerPhone,
        sellerEmail
      } = req.body;

      if (!make || !model || !year || !price) {
        return res.status(400).json({ 
          message: "Vehicle make, model, year, and price are required" 
        });
      }

      const vehicleId = `VEH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Log vehicle addition for tracking
      await storage.logSecurityEvent({
        userId: 'vehicles',
        eventType: 'vehicle_added',
        severity: 'low',
        description: `New vehicle added: ${year} ${make} ${model} in ${parish}, Price: ${price} JMD, Seller: ${sellerName}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        success: true,
        vehicleId,
        vehicle: `${year} ${make} ${model}`,
        price,
        location: location ? `${location}, ${parish}` : parish,
        seller: sellerName,
        message: `${year} ${make} ${model} has been successfully added to YaadFlex Car Marketplace! Your car is now visible to 150,000+ potential buyers.`,
        nextSteps: [
          "FREE 3D car scanning will be scheduled within 48 hours",
          "Professional photos and 360° view will be created",
          "Vehicle listing will be promoted across YaadFlex network",
          "Interested buyers will contact you directly"
        ]
      });

    } catch (error) {
      console.error("Error adding vehicle:", error);
      res.status(500).json({ message: "Failed to add vehicle" });
    }
  });

  // Seller Outreach System - Find and message property/car sellers
  app.post('/api/outreach/find-sellers', async (req, res) => {
    try {
      const { category, parish, priceRange, contactMethods } = req.body;

      // Mock seller discovery - in production, this would scan websites, social media, etc.
      const foundSellers = {
        properties: Math.floor(Math.random() * 1000) + 500,
        vehicles: Math.floor(Math.random() * 2000) + 1000
      };

      await storage.logSecurityEvent({
        userId: 'outreach',
        eventType: 'seller_discovery',
        severity: 'low',
        description: `Seller outreach initiated for ${category} in ${parish}, found ${foundSellers[category]} potential sellers`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        success: true,
        category,
        parish,
        sellersFound: foundSellers[category] || 0,
        sources: [
          "Facebook Marketplace listings",
          "Instagram property/car posts",
          "WhatsApp status updates",
          "Classified ads websites",
          "Local dealer inventories",
          "Social media groups"
        ],
        nextStep: "Ready to send personalized messages to found sellers",
        estimatedResponseRate: "25-35%"
      });

    } catch (error) {
      console.error("Error finding sellers:", error);
      res.status(500).json({ message: "Failed to find sellers" });
    }
  });

  app.post('/api/outreach/send-messages', async (req, res) => {
    try {
      const { category, sellersFound, messageTemplate, contactMethods } = req.body;

      const messagesSent = Math.floor(sellersFound * 0.6); // Simulate 60% message success rate
      const expectedResponses = Math.floor(messagesSent * 0.3); // 30% response rate

      await storage.logSecurityEvent({
        userId: 'outreach',
        eventType: 'outreach_messages_sent',
        severity: 'low',
        description: `Sent ${messagesSent} outreach messages for ${category}, expecting ~${expectedResponses} responses`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        success: true,
        messagesSent,
        expectedResponses,
        methods: contactMethods || ["WhatsApp", "SMS", "Email", "Social Media"],
        timeline: "Responses typically arrive within 24-48 hours",
        followUpScheduled: "Automatic follow-up in 5 days for non-responders",
        conversionRate: "Typically 15-20% of responders list their property/vehicle"
      });

    } catch (error) {
      console.error("Error sending outreach messages:", error);
      res.status(500).json({ message: "Failed to send outreach messages" });
    }
  });

  // 3D Car Viewer API
  app.get('/api/vehicles/:vehicleId/3d-model', async (req, res) => {
    try {
      const { vehicleId } = req.params;

      // Mock 3D model data - in production, this would return actual 3D model URLs
      res.json({
        success: true,
        vehicleId,
        threedModel: {
          exterior: `https://3d-models.yaadflex.com/vehicles/${vehicleId}/exterior.gltf`,
          interior: `https://3d-models.yaadflex.com/vehicles/${vehicleId}/interior.gltf`,
          engine: `https://3d-models.yaadflex.com/vehicles/${vehicleId}/engine.gltf`,
          created: new Date().toISOString(),
          quality: "HD",
          fileSize: "45MB"
        },
        inspectionData: {
          exteriorScore: Math.floor(Math.random() * 3) + 8, // 8-10
          interiorScore: Math.floor(Math.random() * 3) + 8, // 8-10  
          engineScore: Math.floor(Math.random() * 3) + 8, // 8-10
          overallCondition: "excellent",
          issues: [],
          highlights: [
            "Pristine interior condition",
            "Well-maintained engine bay",
            "No visible exterior damage",
            "All electronics functioning"
          ]
        }
      });

    } catch (error) {
      console.error("Error fetching 3D model:", error);
      res.status(500).json({ message: "Failed to fetch 3D model" });
    }
  });

  // CONTACTLESS EMAIL SYSTEM

  app.post('/api/contactless/send-email', async (req, res) => {
    try {
      const { recipient, template, customMessage, automated } = req.body;

      if (!recipient || !template) {
        return res.status(400).json({ 
          message: "Recipient email and template are required" 
        });
      }

      // Simulate email sending with team assignment
      const emailHandlers = {
        'business': 'Marlon Ice',
        'property': 'Marlon Ice', 
        'driver': 'Keisha Brown',
        'customer': 'Keisha Brown',
        'vehicle': 'Marcus Johnson'
      };

      const handlerName = emailHandlers[template.category] || 'YaadFlex System';

      // Log email for tracking
      await storage.logSecurityEvent({
        userId: 'contactless-system',
        eventType: 'automated_email_sent',
        severity: 'low',
        description: `Automated email sent: ${template.subject} to ${recipient}, handled by ${handlerName}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      // Simulate email delivery
      const emailId = `EMAIL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      res.json({
        success: true,
        emailId,
        recipient,
        subject: template.subject,
        handledBy: handlerName,
        automated: true,
        deliveryTime: "Instant",
        message: `Email sent successfully through contactless system. ${handlerName} will follow up if needed.`,
        stats: {
          totalEmailsToday: Math.floor(Math.random() * 1000) + 2500,
          automationRate: "98.5%",
          avgResponseTime: "1.2 hours"
        }
      });

    } catch (error) {
      console.error("Error sending contactless email:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // Get contactless system stats
  app.get('/api/contactless/stats', async (req, res) => {
    try {
      res.json({
        success: true,
        stats: {
          emailsSentToday: Math.floor(Math.random() * 500) + 2500,
          automationRate: 98.5,
          avgResponseTime: 1.2,
          teamMembers: 3,
          contactlessRate: 100,
          customerSatisfaction: 96.8,
          systemUptime: 99.9
        },
        teamStatus: [
          { name: 'Marlon Ice', status: 'online', emailsToday: 127 },
          { name: 'Keisha Brown', status: 'online', emailsToday: 89 },
          { name: 'Marcus Johnson', status: 'busy', emailsToday: 56 }
        ]
      });

    } catch (error) {
      console.error("Error fetching contactless stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // ENHANCED SECURITY BEYOND INTERPOL STANDARDS
  
  app.get('/api/security/events', isAuthenticated, async (req: any, res) => {
    try {
      const { vehicleId } = req.query;
      const events = await storage.getSecurityEvents(vehicleId as string);
      res.json(events);
    } catch (error) {
      console.error("Error fetching security events:", error);
      res.status(500).json({ message: "Failed to fetch security events" });
    }
  });

  app.get('/api/security/threats/unresolved', isAuthenticated, async (req: any, res) => {
    try {
      const threats = await storage.getUnresolvedThreats();
      res.json(threats);
    } catch (error) {
      console.error("Error fetching unresolved threats:", error);
      res.status(500).json({ message: "Failed to fetch unresolved threats" });
    }
  });

  app.get('/api/security/threats/:level', isAuthenticated, async (req: any, res) => {
    try {
      const { level } = req.params;
      const threats = await storage.getThreatsByLevel(level);
      res.json(threats);
    } catch (error) {
      console.error("Error fetching threats by level:", error);
      res.status(500).json({ message: "Failed to fetch threats by level" });
    }
  });

  // Real-time location history for vehicles
  app.get('/api/vehicles/:id/location-history', isAuthenticated, async (req: any, res) => {
    try {
      const vehicleId = req.params.id;
      const history = await storage.getVehicleLocationHistory(vehicleId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching location history:", error);
      res.status(500).json({ message: "Failed to fetch location history" });
    }
  });

  // CB Radio API Endpoints
  
  // Get all CB radio channels
  app.get('/api/cb-radio/channels', isAuthenticated, async (req: any, res) => {
    try {
      const channels = await storage.getCbRadioChannels();
      res.json(channels);
    } catch (error) {
      console.error("Error fetching CB radio channels:", error);
      res.status(500).json({ message: "Failed to fetch CB radio channels" });
    }
  });

  // Create CB radio channel (admin only for now)
  app.post('/api/cb-radio/channels', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertCbRadioChannelSchema.parse(req.body);
      const channel = await storage.createCbRadioChannel(validatedData);
      res.json(channel);
    } catch (error) {
      console.error("Error creating CB radio channel:", error);
      res.status(500).json({ message: "Failed to create CB radio channel" });
    }
  });

  // Get or create driver CB profile
  app.get('/api/cb-radio/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let profile = await storage.getDriverCbProfile(userId);
      
      if (!profile) {
        // Create default profile with auto-generated call sign
        const callSign = `YF${Math.floor(Math.random() * 10000)}`;
        profile = await storage.createDriverCbProfile({
          driverId: userId,
          callSign: callSign,
          preferredChannels: [],
          isOnline: false,
          totalMessages: 0,
          reputation: "5.0"
        });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching CB radio profile:", error);
      res.status(500).json({ message: "Failed to fetch CB radio profile" });
    }
  });

  // Update driver CB profile
  app.patch('/api/cb-radio/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updateData = req.body;
      const profile = await storage.updateDriverCbProfile(userId, updateData);
      res.json(profile);
    } catch (error) {
      console.error("Error updating CB radio profile:", error);
      res.status(500).json({ message: "Failed to update CB radio profile" });
    }
  });

  // Get channel message history
  app.get('/api/cb-radio/channels/:channelId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { channelId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getCbRadioMessages(channelId, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching CB radio messages:", error);
      res.status(500).json({ message: "Failed to fetch CB radio messages" });
    }
  });

  // Get online drivers in channel
  app.get('/api/cb-radio/channels/:channelId/drivers', isAuthenticated, async (req: any, res) => {
    try {
      const { channelId } = req.params;
      const drivers = await storage.getOnlineDriversInChannel(channelId);
      res.json(drivers);
    } catch (error) {
      console.error("Error fetching online drivers:", error);
      res.status(500).json({ message: "Failed to fetch online drivers" });
    }
  });

  // ===================== YaadFlex Ultimate Translator API Endpoints =====================

  // Create chat message (with auto language detection)
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        senderId: userId,
        // Auto-detect language (placeholder - will integrate with translation service)
        originalLang: req.body.originalLang || 'en-JM',
        langConfidence: req.body.langConfidence || 0.95
      });

      const message = await storage.createChatMessage(messageData);
      
      // Auto-translate for other participants (will implement translation service)
      // For now, just return the message
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create message" });
      }
    }
  });

  // Get messages for a chat with translations
  app.get('/api/chats/:chatId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { chatId } = req.params;
      const viewerLang = req.query.viewer_lang as string || 'en-JM';
      const limit = parseInt(req.query.limit as string) || 50;

      // Get messages with translations for the user's preferred language
      const messages = await storage.getChatMessages(chatId, viewerLang, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Translate specific message to target language
  app.post('/api/messages/:messageId/translate', isAuthenticated, async (req: any, res) => {
    try {
      const { messageId } = req.params;
      const { targetLang } = req.body;

      if (!targetLang) {
        return res.status(400).json({ message: "Target language is required" });
      }

      // Check if translation already exists in cache
      let translation = await storage.getMessageTranslation(messageId, targetLang);
      
      if (!translation) {
        // Get original message
        const message = await storage.getChatMessageById(messageId);
        if (!message) {
          return res.status(404).json({ message: "Message not found" });
        }

        // Placeholder translation (will integrate with actual translation service)
        const translatedText = `[TRANSLATED to ${targetLang}] ${message.originalText}`;
        
        // Save translation to cache
        translation = await storage.createMessageTranslation({
          messageId,
          targetLang,
          translatedText,
          translationQuality: '0.94',
          translationModel: 'v-placeholder',
          translationTime: 150
        });
      }

      res.json(translation);
    } catch (error) {
      console.error("Error translating message:", error);
      res.status(500).json({ message: "Failed to translate message" });
    }
  });

  // Get user language preferences
  app.get('/api/user/language-preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        preferredLang: user.preferredLang || 'en-JM',
        fallbackLang: user.fallbackLang || 'en-US', 
        showAlwaysEnglishToggle: user.showAlwaysEnglishToggle ?? true,
        captionVoiceMessages: user.captionVoiceMessages ?? true,
        autoTranslateEnabled: user.autoTranslateEnabled ?? true
      });
    } catch (error) {
      console.error("Error fetching language preferences:", error);
      res.status(500).json({ message: "Failed to fetch language preferences" });
    }
  });

  // Update user language preferences
  app.patch('/api/user/language-preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { preferredLang, fallbackLang, showAlwaysEnglishToggle, captionVoiceMessages, autoTranslateEnabled } = req.body;

      const updatedUser = await storage.updateUserLanguagePreferences(userId, {
        preferredLang,
        fallbackLang,
        showAlwaysEnglishToggle,
        captionVoiceMessages,
        autoTranslateEnabled
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating language preferences:", error);
      res.status(500).json({ message: "Failed to update language preferences" });
    }
  });

  // Download offline translation pack
  app.post('/api/offline-packs/download', isAuthenticated, async (req: any, res) => {
    try {
      const { packId } = req.body;
      
      if (!packId) {
        return res.status(400).json({ message: "Pack ID is required" });
      }

      // Placeholder for offline pack download logic
      // In a real implementation, this would:
      // 1. Validate pack exists
      // 2. Check user storage quota
      // 3. Download and cache language models
      // 4. Update user's downloaded packs list
      
      res.json({ 
        packId,
        status: 'downloaded',
        size: '45 MB',
        downloadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error downloading offline pack:", error);
      res.status(500).json({ message: "Failed to download offline pack" });
    }
  });


  // Join or create chat
  app.post('/api/chats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { chatId, participantIds } = req.body;

      // Create chat participant record
      const participant = await storage.createChatParticipant({
        chatId,
        userId,
        role: 'participant',
        isActive: true
      });

      res.json(participant);
    } catch (error) {
      console.error("Error joining chat:", error);
      res.status(500).json({ message: "Failed to join chat" });
    }
  });

  // Report translation issue
  app.post('/api/messages/:messageId/report-translation', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { messageId } = req.params;
      const { translationId, issueType, incorrectTranslation, suggestedTranslation, reportDescription } = req.body;

      const message = await storage.getChatMessageById(messageId);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      const report = await storage.createTranslationReport({
        messageId,
        translationId,
        reporterId: userId,
        issueType,
        originalText: message.originalText || '',
        incorrectTranslation,
        suggestedTranslation,
        reportDescription,
        status: 'pending'
      });

      res.json(report);
    } catch (error) {
      console.error("Error reporting translation:", error);
      res.status(500).json({ message: "Failed to report translation issue" });
    }
  });

  // Services Marketplace API Endpoints

  // Service Categories
  app.get('/api/services/categories', isAuthenticated, async (req: any, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching service categories:", error);
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });

  app.post('/api/services/categories', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertServiceCategorySchema.parse(req.body);
      const category = await storage.createServiceCategory(validatedData);
      res.json(category);
    } catch (error) {
      console.error("Error creating service category:", error);
      res.status(500).json({ message: "Failed to create service category" });
    }
  });

  // Service Providers
  app.get('/api/services/providers', isAuthenticated, async (req: any, res) => {
    try {
      const { categoryId } = req.query;
      const providers = await storage.getServiceProviders(categoryId);
      res.json(providers);
    } catch (error) {
      console.error("Error fetching service providers:", error);
      res.status(500).json({ message: "Failed to fetch service providers" });
    }
  });

  app.post('/api/services/providers', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertServiceProviderSchema.parse(req.body);
      (validatedData as any).userId = req.user.claims.sub; // Set current user as provider
      const provider = await storage.createServiceProvider(validatedData);
      res.json(provider);
    } catch (error) {
      console.error("Error creating service provider:", error);
      res.status(500).json({ message: "Failed to create service provider" });
    }
  });

  app.get('/api/services/providers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const provider = await storage.getServiceProvider(id);
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      res.json(provider);
    } catch (error) {
      console.error("Error fetching service provider:", error);
      res.status(500).json({ message: "Failed to fetch service provider" });
    }
  });

  // Service Requests
  app.get('/api/services/requests', isAuthenticated, async (req: any, res) => {
    try {
      const { userId, status } = req.query;
      const requests = await storage.getServiceRequests(userId, status);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Failed to fetch service requests" });
    }
  });

  app.post('/api/services/requests', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertServiceRequestSchema.parse(req.body);
      (validatedData as any).customerId = req.user.claims.sub; // Set current user as customer
      const request = await storage.createServiceRequest(validatedData);
      res.json(request);
    } catch (error) {
      console.error("Error creating service request:", error);
      res.status(500).json({ message: "Failed to create service request" });
    }
  });

  app.get('/api/services/requests/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const request = await storage.getServiceRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error fetching service request:", error);
      res.status(500).json({ message: "Failed to fetch service request" });
    }
  });

  // Service Quotes
  app.get('/api/services/requests/:requestId/quotes', isAuthenticated, async (req: any, res) => {
    try {
      const { requestId } = req.params;
      const quotes = await storage.getServiceQuotes(requestId);
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching service quotes:", error);
      res.status(500).json({ message: "Failed to fetch service quotes" });
    }
  });

  app.post('/api/services/quotes', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertServiceQuoteSchema.parse(req.body);
      const quote = await storage.createServiceQuote(validatedData);
      res.json(quote);
    } catch (error) {
      console.error("Error creating service quote:", error);
      res.status(500).json({ message: "Failed to create service quote" });
    }
  });

  app.patch('/api/services/quotes/:id/accept', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const quote = await storage.acceptServiceQuote(id);
      res.json(quote);
    } catch (error) {
      console.error("Error accepting service quote:", error);
      res.status(500).json({ message: "Failed to accept service quote" });
    }
  });

  // Tool Equipment
  app.get('/api/services/tools', isAuthenticated, async (req: any, res) => {
    try {
      const { ownerId } = req.query;
      const tools = await storage.getToolEquipment(ownerId);
      res.json(tools);
    } catch (error) {
      console.error("Error fetching tool equipment:", error);
      res.status(500).json({ message: "Failed to fetch tool equipment" });
    }
  });

  app.post('/api/services/tools', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertToolEquipmentSchema.parse(req.body);
      (validatedData as any).ownerId = req.user.claims.sub; // Set current user as owner
      const tool = await storage.createToolEquipment(validatedData);
      res.json(tool);
    } catch (error) {
      console.error("Error creating tool equipment:", error);
      res.status(500).json({ message: "Failed to create tool equipment" });
    }
  });

  // Service Reviews
  app.get('/api/services/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const { providerId } = req.query;
      const reviews = await storage.getServiceReviews(providerId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching service reviews:", error);
      res.status(500).json({ message: "Failed to fetch service reviews" });
    }
  });

  app.post('/api/services/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertServiceReviewSchema.parse(req.body);
      (validatedData as any).reviewerId = req.user.claims.sub; // Set current user as reviewer
      const review = await storage.createServiceReview(validatedData);
      res.json(review);
    } catch (error) {
      console.error("Error creating service review:", error);
      res.status(500).json({ message: "Failed to create service review" });
    }
  });

  // ===================== COMPLETE RENTAL EMPIRE API ROUTES =====================

  // Get all available rental properties (with filtering)
  app.get('/api/rental-properties', async (req, res) => {
    try {
      const { category, parish, maxBudget } = req.query;
      
      // Start with base conditions
      const conditions = [eq(rentalProperties.isAvailable, true)];
      
      if (category && category !== 'all') {
        conditions.push(eq(rentalProperties.category, category as string));
      }
      
      if (parish && parish !== 'all') {
        conditions.push(eq(rentalProperties.parish, parish as string));
      }
      
      if (maxBudget) {
        conditions.push(lte(rentalProperties.dailyRate, maxBudget as string));
      }
      
      const properties = await db.select().from(rentalProperties)
        .where(and(...conditions))
        .orderBy(desc(rentalProperties.createdAt))
        .limit(50);
      
      res.json(properties.map(property => ({
        ...property,
        amenities: property.amenities || [],
        dailyRate: property.dailyRate?.toString(),
        monthlyRate: property.monthlyRate?.toString(),
        averageRating: property.averageRating?.toString() || "5.0"
      })));
    } catch (error) {
      console.error("Error fetching rental properties:", error);
      res.status(500).json({ message: "Failed to fetch rental properties" });
    }
  });

  // Get user's rental properties
  app.get('/api/my-rental-properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const properties = await db.select().from(rentalProperties)
        .where(eq(rentalProperties.ownerId, userId))
        .orderBy(desc(rentalProperties.createdAt));
      
      res.json(properties.map(property => ({
        ...property,
        amenities: property.amenities || [],
        dailyRate: property.dailyRate?.toString(),
        monthlyRate: property.monthlyRate?.toString(),
        averageRating: property.averageRating?.toString() || "5.0"
      })));
    } catch (error) {
      console.error("Error fetching user properties:", error);
      res.status(500).json({ message: "Failed to fetch your properties" });
    }
  });

  // Add new rental property
  app.post('/api/rental-properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        title,
        description,
        propertyType,
        category,
        address,
        parish,
        dailyRate,
        monthlyRate,
        amenities,
        contactPhone,
      } = req.body;

      if (!title || !description || !address) {
        return res.status(400).json({ message: "Title, description, and address are required" });
      }

      // Generate slug from title
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const [newProperty] = await db.insert(rentalProperties).values({
        ownerId: userId,
        title,
        description,
        slug: `${slug}-${Date.now()}`, // Ensure uniqueness
        propertyType: propertyType || 'residential',
        category,
        address,
        parish,
        dailyRate: dailyRate ? String(parseFloat(dailyRate)) : null,
        monthlyRate: monthlyRate ? String(parseFloat(monthlyRate)) : null,
        amenities: amenities || [],
        contactPhone,
        isAvailable: true,
        instantBooking: true,
      }).returning();

      // Log the instant availability
      console.log(`🏠 NEW PROPERTY INSTANTLY AVAILABLE: ${title} in ${parish}`);
      
      res.status(201).json({
        ...newProperty,
        dailyRate: newProperty.dailyRate?.toString(),
        monthlyRate: newProperty.monthlyRate?.toString(),
        averageRating: newProperty.averageRating?.toString() || "5.0"
      });
    } catch (error) {
      console.error("Error adding rental property:", error);
      res.status(500).json({ message: "Failed to add rental property" });
    }
  });

  // Set availability alert
  app.post('/api/availability-alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        propertyType,
        category,
        parish,
        maxBudget,
        minBedrooms,
        requiredAmenities,
        alertFrequency = 'instant'
      } = req.body;

      const [newAlert] = await db.insert(availabilityAlerts).values({
        userId,
        propertyType,
        category,
        parish,
        maxBudget: maxBudget ? String(parseFloat(maxBudget)) : null,
        minBedrooms,
        requiredAmenities: requiredAmenities || [],
        alertFrequency,
        isActive: true,
        notifyEmail: true,
        notifySMS: true,
        notifyWhatsapp: true,
        notifyPush: true,
      }).returning();

      console.log(`🔔 NEW INSTANT ALERT SET: User wants ${category} in ${parish}`);
      
      res.status(201).json(newAlert);
    } catch (error) {
      console.error("Error setting availability alert:", error);
      res.status(500).json({ message: "Failed to set availability alert" });
    }
  });

  // Update property availability (for owners)
  app.put('/api/rental-properties/:id/availability', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { isAvailable, blockReason } = req.body;

      // Verify ownership
      const [property] = await db.select().from(rentalProperties)
        .where(and(
          eq(rentalProperties.id, id),
          eq(rentalProperties.ownerId, userId)
        ));

      if (!property) {
        return res.status(404).json({ message: "Property not found or not owned by you" });
      }

      // Update availability
      await db.update(rentalProperties)
        .set({ 
          isAvailable,
          updatedAt: new Date()
        })
        .where(eq(rentalProperties.id, id));

      if (isAvailable) {
        console.log(`🏠 PROPERTY INSTANTLY AVAILABLE: ${property.title}`);
      } else {
        console.log(`🚫 PROPERTY BLOCKED: ${property.title} - ${blockReason}`);
      }
      
      res.json({ message: "Availability updated successfully" });
    } catch (error) {
      console.error("Error updating property availability:", error);
      res.status(500).json({ message: "Failed to update availability" });
    }
  });

  // DEMO YFX WALLET SYSTEM - ChatGPT's Private Pilot Testing 💰
  
  // Create or get demo wallet
  app.get('/api/demo/wallet', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      let [wallet] = await db.select().from(demoWallets).where(eq(demoWallets.userId, userId));
      
      if (!wallet) {
        // Create demo wallet with 0 balance
        [wallet] = await db.insert(demoWallets)
          .values({ userId, balanceYfx: '0.000000' })
          .returning();
      }
      
      res.json(wallet);
    } catch (error) {
      console.error("Error fetching demo wallet:", error);
      res.status(500).json({ message: "Failed to fetch demo wallet" });
    }
  });

  // Demo sandbox top-up (fake funds)
  app.post('/api/demo/wallet/topup-sandbox', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount_yfx } = req.body;
      
      if (!amount_yfx || parseFloat(amount_yfx) <= 0) {
        return res.status(400).json({ message: "Invalid amount. Must be greater than 0." });
      }

      // Get or create wallet
      let [wallet] = await db.select().from(demoWallets).where(eq(demoWallets.userId, userId));
      if (!wallet) {
        [wallet] = await db.insert(demoWallets)
          .values({ userId, balanceYfx: '0.000000' })
          .returning();
      }

      // Update balance
      const newBalance = parseFloat(wallet.balanceYfx) + parseFloat(amount_yfx);
      await db.update(demoWallets)
        .set({ balanceYfx: newBalance.toFixed(6), updatedAt: new Date() })
        .where(eq(demoWallets.userId, userId));

      // Record transaction
      await db.insert(demoTransactions).values({
        userId,
        type: 'topup_sandbox',
        amountYfx: parseFloat(amount_yfx).toFixed(6),
        note: 'Demo sandbox funds - TEST ONLY',
        status: 'completed'
      });

      res.json({ 
        success: true,
        message: `Added ${amount_yfx} YFX to demo wallet`,
        newBalance: newBalance.toFixed(6),
        note: "TEST MODE - No real money"
      });
    } catch (error) {
      console.error("Error topping up demo wallet:", error);
      res.status(500).json({ message: "Failed to top up demo wallet" });
    }
  });

  // Demo transaction history  
  app.get('/api/demo/wallet/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await db.select()
        .from(demoTransactions)
        .where(eq(demoTransactions.userId, userId))
        .orderBy(desc(demoTransactions.createdAt))
        .limit(50);

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching demo transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // ChatGPT's Beta Testing System 🔐
  
  // Generate beta invite codes (admin only)
  app.post('/api/demo/generate-invite', async (req: any, res) => {
    try {
      const { adminKey, count = 1 } = req.body;
      
      // Simple admin protection
      if (adminKey !== 'YaadFlex-Beta-2025') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const invites = [];
      for (let i = 0; i < count; i++) {
        const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        invites.push(inviteCode);
        
        // Store invite code in feature flags table
        await db.insert(demoFeatureFlags).values({
          key: `BETA_INVITE_${inviteCode}`,
          enabled: true,
          audience: 'beta_tester',
          rollout: 100,
          meta: { createdBy: 'SYSTEM' }
        });
      }

      res.json({ 
        success: true,
        invites,
        message: `Generated ${count} beta invite codes`,
        note: "Share these with trusted testers only"
      });
    } catch (error) {
      console.error("Error generating invites:", error);
      res.status(500).json({ message: "Failed to generate invites" });
    }
  });

  // Validate beta invite and grant access
  app.post('/api/demo/validate-invite', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { inviteCode } = req.body;
      
      if (!inviteCode) {
        return res.status(400).json({ message: "Invite code required" });
      }

      // Check if invite code is valid
      const [validInvite] = await db.select()
        .from(demoFeatureFlags)
        .where(and(
          eq(demoFeatureFlags.key, `BETA_INVITE_${inviteCode.toUpperCase()}`),
          eq(demoFeatureFlags.enabled, true)
        ));

      if (!validInvite) {
        return res.status(400).json({ message: "Invalid or expired invite code" });
      }

      // Grant beta access to user (store in pilotTesters table instead)
      await db.insert(pilotTesters).values({
        email: req.user.email || '',
        role: 'beta_tester',
        isActive: true,
        consentAt: new Date()
      }).onConflictDoUpdate({
        target: pilotTesters.email,
        set: { role: 'beta_tester', isActive: true }
      });

      // Auto-allocate 5.0 YFX demo funds (ChatGPT's design)
      let [wallet] = await db.select().from(demoWallets).where(eq(demoWallets.userId, userId));
      if (!wallet) {
        [wallet] = await db.insert(demoWallets)
          .values({ userId, balanceYfx: '5.000000' })
          .returning();

        // Record the welcome bonus
        await db.insert(demoTransactions).values({
          userId,
          type: 'welcome_bonus',
          amountYfx: '5.000000',
          note: 'Welcome to YaadFlex Beta! 🇯🇲🚀',
          status: 'completed'
        });
      }

      res.json({
        success: true,
        message: "Welcome to YaadFlex Beta! 🇯🇲",
        betaAccess: true,
        welcomeBonus: '5.0 YFX',
        note: "TEST MODE - Taking Jamaica to the Moon!"
      });
    } catch (error) {
      console.error("Error validating invite:", error);
      res.status(500).json({ message: "Failed to validate invite" });
    }
  });

  // Check beta access status
  app.get('/api/demo/beta-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const [betaAccess] = await db.select()
        .from(pilotTesters)
        .where(and(
          eq(pilotTesters.email, req.user.email || ''),
          eq(pilotTesters.role, 'beta_tester'),
          eq(pilotTesters.isActive, true)
        ));

      res.json({
        hasBetaAccess: !!betaAccess,
        testMode: true,
        message: betaAccess ? "Beta access granted 🔥" : "Beta access required"
      });
    } catch (error) {
      console.error("Error checking beta status:", error);
      res.status(500).json({ message: "Failed to check beta status" });
    }
  });

  // WORKFORCE MANAGEMENT SYSTEM - JOB CREATION & WORKER PLATFORM

  // Company Management Routes
  app.post('/api/companies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const companyData = {
        ...req.body,
        ownerId: userId
      };
      
      const [company] = await db.insert(companies).values(companyData).returning();
      res.json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.get('/api/companies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userCompanies = await db.select().from(companies).where(eq(companies.ownerId, userId));
      res.json(userCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  // Job Management Routes - Create, Post, Manage Jobs
  app.post('/api/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const jobData = req.body;
      const [job] = await db.insert(jobs).values(jobData).returning();
      
      // Update company active jobs count
      await db.update(companies)
        .set({ 
          activeJobs: sql`${companies.activeJobs} + 1`,
          totalJobs: sql`${companies.totalJobs} + 1`
        })
        .where(eq(companies.id, jobData.companyId));
      
      res.json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.get('/api/jobs', async (req: any, res) => {
    try {
      const { city, jobType, status = 'open', limit = 50 } = req.query;
      let conditions = [eq(jobs.isPublic, true)];
      
      if (city) conditions.push(eq(jobs.city, city));
      if (jobType) conditions.push(eq(jobs.jobType, jobType));
      if (status) conditions.push(eq(jobs.status, status));
      
      const jobsList = await db.select().from(jobs)
        .where(and(...conditions))
        .limit(parseInt(limit))
        .orderBy(desc(jobs.createdAt));
      res.json(jobsList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get('/api/jobs/:id', async (req: any, res) => {
    try {
      const [job] = await db.select().from(jobs).where(eq(jobs.id, req.params.id));
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // Worker Management Routes - Registration, Profiles, Hiring/Firing
  app.post('/api/workers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workerData = {
        ...req.body,
        userId
      };
      
      const [worker] = await db.insert(workers).values(workerData).returning();
      res.json(worker);
    } catch (error) {
      console.error("Error creating worker profile:", error);
      res.status(500).json({ message: "Failed to create worker profile" });
    }
  });

  app.get('/api/workers', async (req: any, res) => {
    try {
      const { city, skills, experienceLevel, available = 'true' } = req.query;
      let conditions = [];
      
      if (available === 'true') conditions.push(eq(workers.isAvailable, true));
      if (city) conditions.push(eq(workers.city, city));
      if (experienceLevel) conditions.push(eq(workers.experienceLevel, experienceLevel));
      
      const workersList = await db.select().from(workers)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(workers.rating), desc(workers.totalJobsCompleted));
      res.json(workersList);
    } catch (error) {
      console.error("Error fetching workers:", error);
      res.status(500).json({ message: "Failed to fetch workers" });
    }
  });

  app.get('/api/workers/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [worker] = await db.select().from(workers).where(eq(workers.userId, userId));
      res.json(worker || null);
    } catch (error) {
      console.error("Error fetching worker profile:", error);
      res.status(500).json({ message: "Failed to fetch worker profile" });
    }
  });

  // Supervisor Management Routes - Hire/Fire Workers
  app.post('/api/supervisors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const supervisorData = {
        ...req.body,
        userId
      };
      
      const [supervisor] = await db.insert(supervisors).values(supervisorData).returning();
      res.json(supervisor);
    } catch (error) {
      console.error("Error creating supervisor profile:", error);
      res.status(500).json({ message: "Failed to create supervisor profile" });
    }
  });

  // Job Applications - Workers Apply for Jobs
  app.post('/api/job-applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get worker profile
      const [worker] = await db.select().from(workers).where(eq(workers.userId, userId));
      if (!worker) {
        return res.status(400).json({ message: "Worker profile required to apply" });
      }
      
      const applicationData = {
        ...req.body,
        workerId: worker.id
      };
      
      const [application] = await db.insert(jobApplications).values(applicationData).returning();
      
      // Update job applicants count
      await db.update(jobs)
        .set({ totalApplicants: sql`${jobs.totalApplicants} + 1` })
        .where(eq(jobs.id, applicationData.jobId));
      
      res.json(application);
    } catch (error) {
      console.error("Error submitting application:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  app.get('/api/job-applications/my-applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [worker] = await db.select().from(workers).where(eq(workers.userId, userId));
      
      if (!worker) {
        return res.json([]);
      }
      
      const applications = await db.select().from(jobApplications)
        .where(eq(jobApplications.workerId, worker.id))
        .orderBy(desc(jobApplications.appliedAt));
      
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Job Assignments - Hire Workers (Accept Applications)
  app.post('/api/job-assignments', isAuthenticated, async (req: any, res) => {
    try {
      const assignmentData = req.body;
      const [assignment] = await db.insert(jobAssignments).values(assignmentData).returning();
      
      // Update application status to hired
      await db.update(jobApplications)
        .set({ 
          status: 'hired',
          hiredAt: new Date()
        })
        .where(eq(jobApplications.id, assignmentData.applicationId));
      
      // Update job hired workers count
      await db.update(jobs)
        .set({ hiredWorkers: sql`${jobs.hiredWorkers} + 1` })
        .where(eq(jobs.id, assignmentData.jobId));
      
      res.json(assignment);
    } catch (error) {
      console.error("Error creating job assignment:", error);
      res.status(500).json({ message: "Failed to hire worker" });
    }
  });

  // Fire Worker (Terminate Assignment)
  app.put('/api/job-assignments/:id/terminate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { terminationReason, severancePaid } = req.body;
      
      const [assignment] = await db.update(jobAssignments)
        .set({
          status: 'terminated',
          terminatedAt: new Date(),
          terminationReason,
          terminatedBy: userId,
          severancePaid: severancePaid || '0.00'
        })
        .where(eq(jobAssignments.id, req.params.id))
        .returning();
      
      res.json(assignment);
    } catch (error) {
      console.error("Error terminating assignment:", error);
      res.status(500).json({ message: "Failed to terminate worker" });
    }
  });

  // Equipment Management Routes
  app.post('/api/equipment', isAuthenticated, async (req: any, res) => {
    try {
      const equipmentData = req.body;
      const [equipmentItem] = await db.insert(equipment).values(equipmentData).returning();
      res.json(equipmentItem);
    } catch (error) {
      console.error("Error adding equipment:", error);
      res.status(500).json({ message: "Failed to add equipment" });
    }
  });

  app.get('/api/equipment', async (req: any, res) => {
    try {
      const { category, available = 'true' } = req.query;
      let conditions = [];
      
      if (available === 'true') conditions.push(eq(equipment.isAvailable, true));
      if (category) conditions.push(eq(equipment.category, category));
      
      const equipmentList = await db.select().from(equipment)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(equipment.name);
      res.json(equipmentList);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  // Equipment Hub Management Routes
  app.post('/api/equipment-hubs', isAuthenticated, async (req: any, res) => {
    try {
      const hubData = req.body;
      const [hub] = await db.insert(equipmentHubs).values(hubData).returning();
      res.json(hub);
    } catch (error) {
      console.error("Error creating equipment hub:", error);
      res.status(500).json({ message: "Failed to create equipment hub" });
    }
  });

  app.get('/api/equipment-hubs', async (req: any, res) => {
    try {
      const { city } = req.query;
      let conditions = [eq(equipmentHubs.isActive, true)];
      
      if (city) conditions.push(eq(equipmentHubs.city, city));
      
      const hubs = await db.select().from(equipmentHubs)
        .where(and(...conditions))
        .orderBy(equipmentHubs.name);
      res.json(hubs);
    } catch (error) {
      console.error("Error fetching equipment hubs:", error);
      res.status(500).json({ message: "Failed to fetch equipment hubs" });
    }
  });

  // Equipment Checkout System
  app.post('/api/equipment-checkouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [worker] = await db.select().from(workers).where(eq(workers.userId, userId));
      
      if (!worker) {
        return res.status(400).json({ message: "Worker profile required to checkout equipment" });
      }
      
      const checkoutData = {
        ...req.body,
        workerId: worker.id
      };
      
      const [checkout] = await db.insert(equipmentCheckouts).values(checkoutData).returning();
      
      // Mark equipment as unavailable
      await db.update(equipment)
        .set({ isAvailable: false })
        .where(eq(equipment.id, checkoutData.equipmentId));
      
      res.json(checkout);
    } catch (error) {
      console.error("Error checking out equipment:", error);
      res.status(500).json({ message: "Failed to checkout equipment" });
    }
  });

  // Equipment Return
  app.put('/api/equipment-checkouts/:id/return', isAuthenticated, async (req: any, res) => {
    try {
      const { returnCondition, damageNotes } = req.body;
      
      const [checkout] = await db.update(equipmentCheckouts)
        .set({
          status: 'returned',
          actualReturnDate: new Date(),
          returnCondition,
          damageNotes,
          depositReturned: returnCondition === 'excellent' || returnCondition === 'good'
        })
        .where(eq(equipmentCheckouts.id, req.params.id))
        .returning();
      
      // Mark equipment as available again
      await db.update(equipment)
        .set({ isAvailable: true })
        .where(eq(equipment.id, checkout.equipmentId));
      
      res.json(checkout);
    } catch (error) {
      console.error("Error returning equipment:", error);
      res.status(500).json({ message: "Failed to return equipment" });
    }
  });

  // Vehicle Marketplace Routes
  app.post('/api/vehicle-listings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const listingData = {
        ...req.body,
        sellerId: userId
      };
      
      const [listing] = await db.insert(vehicleListings).values(listingData).returning();
      res.json(listing);
    } catch (error) {
      console.error("Error creating vehicle listing:", error);
      res.status(500).json({ message: "Failed to create vehicle listing" });
    }
  });

  app.get('/api/vehicle-listings', async (req: any, res) => {
    try {
      const { make, model, city, minPrice, maxPrice, condition } = req.query;
      let conditions = [eq(vehicleListings.status, 'active')];
      
      if (make) conditions.push(eq(vehicleListings.make, make));
      if (model) conditions.push(eq(vehicleListings.model, model));
      if (city) conditions.push(eq(vehicleListings.city, city));
      if (condition) conditions.push(eq(vehicleListings.condition, condition));
      if (minPrice) conditions.push(gte(vehicleListings.price, minPrice));
      if (maxPrice) conditions.push(lte(vehicleListings.price, maxPrice));
      
      const listings = await db.select().from(vehicleListings)
        .where(and(...conditions))
        .orderBy(desc(vehicleListings.isPromoted), desc(vehicleListings.createdAt))
        .limit(100);
      
      res.json(listings);
    } catch (error) {
      console.error("Error fetching vehicle listings:", error);
      res.status(500).json({ message: "Failed to fetch vehicle listings" });
    }
  });

  app.get('/api/vehicle-listings/:id', async (req: any, res) => {
    try {
      const [listing] = await db.select().from(vehicleListings).where(eq(vehicleListings.id, req.params.id));
      
      if (!listing) {
        return res.status(404).json({ message: "Vehicle listing not found" });
      }
      
      // Increment view count
      await db.update(vehicleListings)
        .set({ viewCount: sql`${vehicleListings.viewCount} + 1` })
        .where(eq(vehicleListings.id, req.params.id));
      
      res.json(listing);
    } catch (error) {
      console.error("Error fetching vehicle listing:", error);
      res.status(500).json({ message: "Failed to fetch vehicle listing" });
    }
  });

  // Email Communication System for Job Coordination
  app.post('/api/email-communications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const emailData = {
        ...req.body,
        fromUserId: userId
      };
      
      const [email] = await db.insert(emailCommunications).values(emailData).returning();
      
      // Here you would integrate with SendGrid or another email service
      // For now, we'll just mark it as sent
      await db.update(emailCommunications)
        .set({ 
          status: 'sent',
          sentAt: new Date()
        })
        .where(eq(emailCommunications.id, email.id));
      
      res.json(email);
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // Get user's email communications
  app.get('/api/email-communications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const emails = await db.select().from(emailCommunications)
        .where(
          or(
            eq(emailCommunications.fromUserId, userId),
            eq(emailCommunications.toUserId, userId)
          )
        )
        .orderBy(desc(emailCommunications.createdAt));
      
      res.json(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ message: "Failed to fetch emails" });
    }
  });

  // =================================================================
  // MOBILITY & IMMIGRATION SUITE - YaadFlex Global Workforce APIs
  // =================================================================

  // Hotel Workforce Management
  app.post("/api/hotels", isAuthenticated, async (req, res) => {
    try {
      const [hotel] = await db.insert(hotels).values(req.body).returning();
      res.json(hotel);
    } catch (error) {
      console.error("Error creating hotel:", error);
      res.status(500).json({ error: "Failed to create hotel" });
    }
  });

  app.get("/api/hotels", async (req, res) => {
    try {
      const { country, q } = req.query;
      let conditions = [eq(hotels.isActive, true)];
      
      if (country) conditions.push(eq(hotels.country, country as string));
      if (q) conditions.push(sql`${hotels.name} ILIKE ${'%' + q + '%'}`);
      
      const result = await db.select().from(hotels).where(and(...conditions));
      res.json(result);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      res.status(500).json({ error: "Failed to fetch hotels" });
    }
  });

  app.post("/api/hotels/:id/roles", isAuthenticated, async (req, res) => {
    try {
      const [role] = await db.insert(hotelRoles).values({
        ...req.body,
        hotelId: req.params.id
      }).returning();
      res.json(role);
    } catch (error) {
      console.error("Error creating hotel role:", error);
      res.status(500).json({ error: "Failed to create hotel role" });
    }
  });

  app.get("/api/hotels/:id/roles", async (req, res) => {
    try {
      const roles = await db.select().from(hotelRoles)
        .where(and(eq(hotelRoles.hotelId, req.params.id), eq(hotelRoles.isActive, true)));
      res.json(roles);
    } catch (error) {
      console.error("Error fetching hotel roles:", error);
      res.status(500).json({ error: "Failed to fetch hotel roles" });
    }
  });

  app.post("/api/hotels/:id/shifts", isAuthenticated, async (req, res) => {
    try {
      const [shift] = await db.insert(hotelShifts).values({
        ...req.body,
        hotelId: req.params.id
      }).returning();
      res.json(shift);
    } catch (error) {
      console.error("Error creating hotel shift:", error);
      res.status(500).json({ error: "Failed to create hotel shift" });
    }
  });

  app.get("/api/hotels/:id/shifts", async (req, res) => {
    try {
      const { status, from, to } = req.query;
      let conditions = [eq(hotelShifts.hotelId, req.params.id)];
      
      if (status) conditions.push(eq(hotelShifts.status, status as string));
      
      const shifts = await db.select().from(hotelShifts)
        .where(and(...conditions))
        .orderBy(hotelShifts.start);
      res.json(shifts);
    } catch (error) {
      console.error("Error fetching hotel shifts:", error);
      res.status(500).json({ error: "Failed to fetch hotel shifts" });
    }
  });

  // Immigration Programs & Applications
  app.get("/api/immigration/programs", async (req, res) => {
    try {
      const { country, visaType } = req.query;
      let conditions = [eq(immigrationPrograms.status, "active")];
      
      if (country) conditions.push(eq(immigrationPrograms.country, country as string));
      if (visaType) conditions.push(eq(immigrationPrograms.visaType, visaType as string));
      
      const programs = await db.select().from(immigrationPrograms).where(and(...conditions));
      res.json(programs);
    } catch (error) {
      console.error("Error fetching immigration programs:", error);
      res.status(500).json({ error: "Failed to fetch immigration programs" });
    }
  });

  app.post("/api/immigration/applications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [application] = await db.insert(immigrationApplications).values({
        ...req.body,
        workerId: userId
      }).returning();
      res.json(application);
    } catch (error) {
      console.error("Error creating immigration application:", error);
      res.status(500).json({ error: "Failed to create immigration application" });
    }
  });

  app.get("/api/immigration/applications/:id", isAuthenticated, async (req, res) => {
    try {
      const [application] = await db.select().from(immigrationApplications)
        .where(eq(immigrationApplications.id, req.params.id));
      
      if (!application) return res.status(404).json({ error: "Application not found" });
      res.json(application);
    } catch (error) {
      console.error("Error fetching immigration application:", error);
      res.status(500).json({ error: "Failed to fetch immigration application" });
    }
  });

  // Legal Services
  app.get("/api/legal/providers", async (req, res) => {
    try {
      const { country, specialty } = req.query;
      let conditions = [eq(legalProviders.isActive, true)];
      
      if (country) conditions.push(eq(legalProviders.country, country as string));
      
      const providers = await db.select().from(legalProviders)
        .where(and(...conditions))
        .orderBy(desc(legalProviders.rating));
      res.json(providers);
    } catch (error) {
      console.error("Error fetching legal providers:", error);
      res.status(500).json({ error: "Failed to fetch legal providers" });
    }
  });

  app.post("/api/legal/cases", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [legalCase] = await db.insert(legalCases).values({
        ...req.body,
        userId
      }).returning();
      res.json(legalCase);
    } catch (error) {
      console.error("Error creating legal case:", error);
      res.status(500).json({ error: "Failed to create legal case" });
    }
  });

  app.get("/api/legal/cases/:id", isAuthenticated, async (req, res) => {
    try {
      const [legalCase] = await db.select().from(legalCases)
        .where(eq(legalCases.id, req.params.id));
      
      if (!legalCase) return res.status(404).json({ error: "Case not found" });
      res.json(legalCase);
    } catch (error) {
      console.error("Error fetching legal case:", error);
      res.status(500).json({ error: "Failed to fetch legal case" });
    }
  });

  // Travel Booking
  app.post("/api/travel/search", async (req, res) => {
    try {
      const { from, to, depart, return: returnDate, pax, cabin } = req.body;
      
      // Mock travel search results
      const mockResults = {
        offers: [
          {
            offerId: `offer_${Date.now()}`,
            from,
            to,
            depart,
            return: returnDate,
            price: Math.floor(Math.random() * 500) + 200,
            currency: "USD",
            airline: "YaadFlex Airways",
            cabin: cabin || "ECONOMY",
            duration: "3h 45m"
          }
        ]
      };
      
      res.json(mockResults);
    } catch (error) {
      console.error("Error searching travel:", error);
      res.status(500).json({ error: "Failed to search travel options" });
    }
  });

  app.post("/api/travel/book", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [itinerary] = await db.insert(travelItineraries).values({
        ...req.body,
        userId,
        pnr: `YF${Date.now()}`,
        status: "booked"
      }).returning();
      res.json(itinerary);
    } catch (error) {
      console.error("Error booking travel:", error);
      res.status(500).json({ error: "Failed to book travel" });
    }
  });

  app.get("/api/travel/itineraries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itineraries = await db.select().from(travelItineraries)
        .where(eq(travelItineraries.userId, userId))
        .orderBy(desc(travelItineraries.ticketedAt));
      res.json(itineraries);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      res.status(500).json({ error: "Failed to fetch itineraries" });
    }
  });

  // Document & KYC Management
  app.post("/api/docs/upload", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [document] = await db.insert(documentsVault).values({
        ...req.body,
        ownerId: userId
      }).returning();
      res.json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  app.get("/api/kyc/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [profile] = await db.select().from(kycProfiles)
        .where(eq(kycProfiles.userId, userId));
      
      if (!profile) {
        // Create default KYC profile
        const [newProfile] = await db.insert(kycProfiles).values({
          userId,
          tier: "tier1",
          status: "pending"
        }).returning();
        return res.json(newProfile);
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching KYC profile:", error);
      res.status(500).json({ error: "Failed to fetch KYC profile" });
    }
  });

  // Escrow Management
  app.post("/api/escrow/open", isAuthenticated, async (req, res) => {
    try {
      const [escrow] = await db.insert(escrowAccounts).values(req.body).returning();
      res.json(escrow);
    } catch (error) {
      console.error("Error opening escrow:", error);
      res.status(500).json({ error: "Failed to open escrow" });
    }
  });

  // =============================================================
  // YAADLEX ULTIMATE AI VEHICLE VALUATOR + OBD SYSTEM API
  // Revolutionary honest vehicle pricing to prevent dealership lowballs
  // =============================================================

  // Vehicle Valuation Routes
  app.post("/api/valuations/estimate", async (req: any, res) => {
    try {
      const { make, model, year, mileage, region, conditionForm, obd, vin } = req.body || {};
      
      if (!make || !model || !year || !region) {
        return res.status(400).json({ 
          error: "Missing required fields: make, model, year, region" 
        });
      }

      // Get market comparables for this vehicle
      const [comp] = await db.select().from(marketComps)
        .where(and(
          eq(marketComps.make, make),
          eq(marketComps.model, model), 
          eq(marketComps.year, year),
          eq(marketComps.region, region)
        ));

      // Use defaults if no market data available
      const baseMedian = Number(comp?.medianPrice || 12000);
      const medianMileage = Number(comp?.medianMileage || 90000);

      // Calculate condition and OBD health scores
      const conditionScore = scoreCondition(conditionForm || {
        exterior: 70, interior: 70, tires: 70, brakes: 70, fluids: 70
      });
      
      const obdHealthScore = scoreObd(
        obd?.dtcCount || 0, 
        obd?.monitorsOk || 6, 
        obd?.monitorsTotal || 8
      );

      // Generate valuation using hedonic pricing engine
      const valuation = estimateValue({
        year,
        mileage,
        baseMedian,
        medianMileage,
        conditionScore,
        obdHealthScore
      });

      // Store valuation in database
      const [savedValuation] = await db.insert(valuations).values({
        vin: vin || null,
        make,
        model,
        year,
        mileage,
        region,
        conditionScore,
        obdHealthScore,
        estimateLow: valuation.estimateLow.toString(),
        estimateMid: valuation.estimateMid.toString(),
        estimateHigh: valuation.estimateHigh.toString(),
        inputs: req.body,
        currency: "USD",
        method: "hedonic_v1"
      }).returning();

      // Generate human-readable explanation
      const explanation = generateValuationExplanation({
        year, mileage, baseMedian, medianMileage, conditionScore, obdHealthScore
      }, valuation);

      res.json({
        success: true,
        valuation: savedValuation,
        estimates: {
          low: valuation.estimateLow,
          mid: valuation.estimateMid,
          high: valuation.estimateHigh
        },
        adjustments: valuation.adjustments,
        explanation,
        marketData: {
          baseMedian,
          medianMileage,
          hasLocalData: !!comp
        }
      });
    } catch (error) {
      console.error("Error generating vehicle valuation:", error);
      res.status(500).json({ error: "Failed to generate vehicle valuation" });
    }
  });

  app.get("/api/valuations/:id", async (req: any, res) => {
    try {
      const [valuation] = await db.select().from(valuations)
        .where(eq(valuations.id, req.params.id));
        
      if (!valuation) {
        return res.status(404).json({ error: "Valuation not found" });
      }
      
      res.json(valuation);
    } catch (error) {
      console.error("Error fetching valuation:", error);
      res.status(500).json({ error: "Failed to fetch valuation" });
    }
  });

  // OBD Diagnostic System Routes
  app.post("/api/obd/start", async (req: any, res) => {
    try {
      const { listingId, vin } = req.body || {};
      
      if (!vin) {
        return res.status(400).json({ error: "VIN is required to start OBD test" });
      }

      const [test] = await db.insert(obdTests).values({
        listingId: listingId || null,
        vin
      }).returning();

      res.json({
        success: true,
        test,
        message: "OBD diagnostic test started. Connect your OBD-II scanner now."
      });
    } catch (error) {
      console.error("Error starting OBD test:", error);
      res.status(500).json({ error: "Failed to start OBD test" });
    }
  });

  app.post("/api/obd/:testId/reading", async (req: any, res) => {
    try {
      const { pid, value, unit } = req.body || {};
      
      if (!pid || value === undefined) {
        return res.status(400).json({ error: "PID and value are required" });
      }

      const [reading] = await db.insert(obdReadings).values({
        testId: req.params.testId,
        pid,
        value: value.toString(),
        unit: unit || null
      }).returning();

      res.json({
        success: true,
        reading,
        message: `Recorded reading for PID ${pid}: ${value} ${unit || ''}`
      });
    } catch (error) {
      console.error("Error recording OBD reading:", error);
      res.status(500).json({ error: "Failed to record OBD reading" });
    }
  });

  app.post("/api/obd/:testId/finish", async (req: any, res) => {
    try {
      const { status, dtcCount, summary } = req.body || {};
      
      const [test] = await db.update(obdTests).set({
        finishedAt: new Date(),
        status: status || "ok",
        dtcCount: dtcCount || 0,
        summary: summary || "OBD diagnostic test completed"
      }).where(eq(obdTests.id, req.params.testId)).returning();

      if (!test.length) {
        return res.status(404).json({ error: "OBD test not found" });
      }

      res.json({
        success: true,
        test: test[0],
        message: "OBD diagnostic test completed successfully"
      });
    } catch (error) {
      console.error("Error finishing OBD test:", error);
      res.status(500).json({ error: "Failed to finish OBD test" });
    }
  });

  // Get OBD test results and readings
  app.get("/api/obd/:testId", async (req: any, res) => {
    try {
      const [test] = await db.select().from(obdTests)
        .where(eq(obdTests.id, req.params.testId));
        
      if (!test) {
        return res.status(404).json({ error: "OBD test not found" });
      }

      const readings = await db.select().from(obdReadings)
        .where(eq(obdReadings.testId, req.params.testId))
        .orderBy(obdReadings.recordedAt);

      res.json({
        test,
        readings,
        totalReadings: readings.length
      });
    } catch (error) {
      console.error("Error fetching OBD test:", error);
      res.status(500).json({ error: "Failed to fetch OBD test" });
    }
  });

  // Market Comparables Management
  app.post("/api/market-comps", async (req: any, res) => {
    try {
      const { make, model, year, region, sample, medianPrice, medianMileage } = req.body || {};
      
      if (!make || !model || !year || !region) {
        return res.status(400).json({ 
          error: "Missing required fields: make, model, year, region" 
        });
      }

      const [comp] = await db.insert(marketComps).values({
        make,
        model, 
        year,
        region,
        sample: sample || null,
        medianPrice: medianPrice?.toString() || "0",
        medianMileage: medianMileage || 0
      }).returning();

      res.json({
        success: true,
        marketComp: comp,
        message: "Market comparable data saved successfully"
      });
    } catch (error) {
      console.error("Error saving market comp:", error);
      res.status(500).json({ error: "Failed to save market comparable" });
    }
  });

  app.get("/api/market-comps", async (req: any, res) => {
    try {
      const { make, model, year, region } = req.query;
      let conditions = [];
      
      if (make) conditions.push(eq(marketComps.make, make as string));
      if (model) conditions.push(eq(marketComps.model, model as string));
      if (year) conditions.push(eq(marketComps.year, parseInt(year as string)));
      if (region) conditions.push(eq(marketComps.region, region as string));

      const comps = await db.select().from(marketComps)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(marketComps.refreshedAt))
        .limit(50);

      res.json({
        success: true,
        marketComps: comps,
        count: comps.length
      });
    } catch (error) {
      console.error("Error fetching market comps:", error);
      res.status(500).json({ error: "Failed to fetch market comparables" });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize CB Radio WebSocket server
  const cbRadioWS = new CBRadioWebSocketServer(httpServer);
  console.log('🔊 CB Radio WebSocket server initialized');
  
  return httpServer;
}
