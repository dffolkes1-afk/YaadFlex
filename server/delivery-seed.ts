// YaadFlex Universal Delivery Network Seed Data
import { db } from "./db";
import { 
  deliveryCategories, 
  deliveryAreas, 
  deliveryPersonnel, 
  users 
} from "@shared/schema";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";

export async function seedDeliverySystem() {
  console.log("🚚 Seeding Universal Delivery Network...");

  try {
    // Create delivery categories
    const categories = [
      {
        id: crypto.randomUUID(),
        code: "gas",
        name: "Cooking Gas Delivery",
        description: "LPG and cooking gas cylinder delivery and exchange",
        icon: "🔥",
        baseRate: "8.00",
        ratePerKm: "1.50",
        minFee: "10.00",
        maxFee: "35.00",
        requiresSpecialHandling: true,
        allowedVehicleTypes: ["motorcycle", "car", "truck"]
      },
      {
        id: crypto.randomUUID(),
        code: "food",
        name: "Food Delivery",
        description: "Restaurant food and meal delivery service",
        icon: "🍕",
        baseRate: "5.00",
        ratePerKm: "1.00",
        minFee: "6.00",
        maxFee: "25.00",
        requiresSpecialHandling: false,
        allowedVehicleTypes: ["motorcycle", "car", "bicycle"]
      },
      {
        id: crypto.randomUUID(),
        code: "packages",
        name: "Package Delivery",
        description: "General package and document delivery",
        icon: "📦",
        baseRate: "6.00",
        ratePerKm: "1.25",
        minFee: "8.00",
        maxFee: "50.00",
        requiresSpecialHandling: false,
        allowedVehicleTypes: ["motorcycle", "car", "van", "truck"]
      },
      {
        id: crypto.randomUUID(),
        code: "pharmacy",
        name: "Pharmacy Delivery",
        description: "Medication and pharmaceutical delivery",
        icon: "💊",
        baseRate: "7.00",
        ratePerKm: "1.00",
        minFee: "9.00",
        maxFee: "20.00",
        requiresSpecialHandling: true,
        allowedVehicleTypes: ["motorcycle", "car"]
      },
      {
        id: crypto.randomUUID(),
        code: "grocery",
        name: "Grocery Delivery",
        description: "Supermarket and grocery shopping delivery",
        icon: "🛒",
        baseRate: "10.00",
        ratePerKm: "2.00",
        minFee: "12.00",
        maxFee: "40.00",
        requiresSpecialHandling: false,
        allowedVehicleTypes: ["car", "van", "truck"]
      },
      {
        id: crypto.randomUUID(),
        code: "water",
        name: "Water Delivery",
        description: "Bottled water and beverage delivery",
        icon: "💧",
        baseRate: "8.00",
        ratePerKm: "1.75",
        minFee: "10.00",
        maxFee: "30.00",
        requiresSpecialHandling: false,
        allowedVehicleTypes: ["motorcycle", "car", "truck"]
      },
      {
        id: crypto.randomUUID(),
        code: "laundry",
        name: "Laundry Pickup & Delivery",
        description: "Laundry and dry cleaning pickup and delivery",
        icon: "👔",
        baseRate: "6.00",
        ratePerKm: "1.50",
        minFee: "8.00",
        maxFee: "25.00",
        requiresSpecialHandling: false,
        allowedVehicleTypes: ["motorcycle", "car"]
      },
      {
        id: crypto.randomUUID(),
        code: "electronics",
        name: "Electronics Delivery",
        description: "Electronics and fragile items delivery",
        icon: "📱",
        baseRate: "12.00",
        ratePerKm: "2.50",
        minFee: "15.00",
        maxFee: "75.00",
        requiresSpecialHandling: true,
        allowedVehicleTypes: ["car", "van"]
      }
    ];

    for (const category of categories) {
      const [existing] = await db.select()
        .from(deliveryCategories)
        .where(eq(deliveryCategories.code, category.code));
      
      if (!existing) {
        await db.insert(deliveryCategories).values(category);
        console.log(`✅ Created delivery category: ${category.name}`);
      }
    }

    // Create delivery areas (Jamaica regions)
    const areas = [
      {
        id: crypto.randomUUID(),
        code: "kingston_central",
        name: "Kingston Central",
        description: "Downtown Kingston and surrounding areas",
        boundaries: {
          type: "Polygon",
          coordinates: [[
            [-76.8000, 17.9600],
            [-76.7800, 17.9600], 
            [-76.7800, 17.9800],
            [-76.8000, 17.9800],
            [-76.8000, 17.9600]
          ]]
        },
        deliveryFeeMultiplier: "1.20",
        estimatedDeliveryTime: 25
      },
      {
        id: crypto.randomUUID(),
        code: "spanish_town",
        name: "Spanish Town",
        description: "Spanish Town and nearby communities",
        boundaries: {
          type: "Polygon", 
          coordinates: [[
            [-76.9600, 17.9800],
            [-76.9200, 17.9800],
            [-76.9200, 18.0200],
            [-76.9600, 18.0200],
            [-76.9600, 17.9800]
          ]]
        },
        deliveryFeeMultiplier: "1.10",
        estimatedDeliveryTime: 35
      },
      {
        id: crypto.randomUUID(),
        code: "portmore",
        name: "Portmore",
        description: "Portmore residential areas",
        boundaries: {
          type: "Polygon",
          coordinates: [[
            [-76.9000, 17.9200],
            [-76.8600, 17.9200],
            [-76.8600, 17.9600],
            [-76.9000, 17.9600],
            [-76.9000, 17.9200]
          ]]
        },
        deliveryFeeMultiplier: "1.15",
        estimatedDeliveryTime: 30
      },
      {
        id: crypto.randomUUID(),
        code: "half_way_tree",
        name: "Half Way Tree",
        description: "Half Way Tree commercial district",
        boundaries: {
          type: "Polygon",
          coordinates: [[
            [-76.8000, 18.0100],
            [-76.7900, 18.0100],
            [-76.7900, 18.0200],
            [-76.8000, 18.0200],
            [-76.8000, 18.0100]
          ]]
        },
        deliveryFeeMultiplier: "1.25",
        estimatedDeliveryTime: 20
      },
      {
        id: crypto.randomUUID(),
        code: "mandeville",
        name: "Mandeville",
        description: "Mandeville and Manchester parish areas",
        boundaries: {
          type: "Polygon",
          coordinates: [[
            [-77.5200, 18.0300],
            [-77.5000, 18.0300],
            [-77.5000, 18.0500],
            [-77.5200, 18.0500],
            [-77.5200, 18.0300]
          ]]
        },
        deliveryFeeMultiplier: "1.30",
        estimatedDeliveryTime: 45
      },
      {
        id: crypto.randomUUID(),
        code: "montego_bay",
        name: "Montego Bay",
        description: "Montego Bay and St. James parish",
        boundaries: {
          type: "Polygon",
          coordinates: [[
            [-77.9300, 18.4600],
            [-77.9000, 18.4600],
            [-77.9000, 18.4900],
            [-77.9300, 18.4900],
            [-77.9300, 18.4600]
          ]]
        },
        deliveryFeeMultiplier: "1.40",
        estimatedDeliveryTime: 40
      }
    ];

    for (const area of areas) {
      const [existing] = await db.select()
        .from(deliveryAreas)
        .where(eq(deliveryAreas.code, area.code));
      
      if (!existing) {
        await db.insert(deliveryAreas).values(area);
        console.log(`✅ Created delivery area: ${area.name}`);
      }
    }

    // Create sample delivery personnel
    const deliveryPeople = [
      {
        email: "marcus@yaadflex.com",
        firstName: "Marcus",
        lastName: "Campbell", 
        deliveryTypes: ["gas", "packages", "water"],
        vehicleType: "motorcycle",
        licenseNumber: "DL123456",
        vehiclePlateNumber: "JP1234",
        phoneNumber: "+1-876-555-0101"
      },
      {
        email: "keisha@yaadflex.com", 
        firstName: "Keisha",
        lastName: "Thompson",
        deliveryTypes: ["food", "pharmacy", "grocery"],
        vehicleType: "car",
        licenseNumber: "DL789012",
        vehiclePlateNumber: "JP5678",
        phoneNumber: "+1-876-555-0102"
      },
      {
        email: "devon@yaadflex.com",
        firstName: "Devon", 
        lastName: "Brown",
        deliveryTypes: ["packages", "electronics", "laundry"],
        vehicleType: "van",
        licenseNumber: "DL345678",
        vehiclePlateNumber: "JP9012",
        phoneNumber: "+1-876-555-0103"
      },
      {
        email: "tanya@yaadflex.com",
        firstName: "Tanya",
        lastName: "Williams",
        deliveryTypes: ["food", "pharmacy"],
        vehicleType: "motorcycle", 
        licenseNumber: "DL901234",
        vehiclePlateNumber: "JP3456",
        phoneNumber: "+1-876-555-0104"
      },
      {
        email: "andre@yaadflex.com",
        firstName: "Andre",
        lastName: "Davis",
        deliveryTypes: ["gas", "water", "grocery"],
        vehicleType: "truck",
        licenseNumber: "CDL567890",
        vehiclePlateNumber: "JP7890",
        phoneNumber: "+1-876-555-0105"
      }
    ];

    for (const person of deliveryPeople) {
      // Create user if doesn't exist
      const [existingUser] = await db.select()
        .from(users)
        .where(eq(users.email, person.email));

      let userId: string;
      if (!existingUser) {
        userId = crypto.randomUUID();
        await db.insert(users).values({
          id: userId,
          email: person.email,
          firstName: person.firstName,
          lastName: person.lastName,
        });
        console.log(`✅ Created delivery user: ${person.firstName} ${person.lastName}`);
      } else {
        userId = existingUser.id;
      }

      // Create delivery personnel record
      const [existingPersonnel] = await db.select()
        .from(deliveryPersonnel)
        .where(eq(deliveryPersonnel.userId, userId));

      if (!existingPersonnel) {
        await db.insert(deliveryPersonnel).values({
          id: crypto.randomUUID(),
          userId,
          deliveryTypes: person.deliveryTypes,
          vehicleType: person.vehicleType,
          licenseNumber: person.licenseNumber,
          vehiclePlateNumber: person.vehiclePlateNumber,
          phoneNumber: person.phoneNumber,
          preferredAreas: ["kingston_central", "spanish_town", "portmore"],
          isActive: true,
          isOnline: Math.random() > 0.5, // Random online status
          currentLat: (17.9600 + (Math.random() * 0.1) - 0.05).toFixed(7), // Random around Kingston
          currentLng: (-76.8000 + (Math.random() * 0.1) - 0.05).toFixed(7),
          totalDeliveries: Math.floor(Math.random() * 100),
          totalEarnings: (Math.random() * 5000).toFixed(2),
          rating: (4.0 + Math.random() * 1.0).toFixed(2), // Rating between 4.0-5.0
        });
        console.log(`✅ Created delivery personnel: ${person.firstName} ${person.lastName}`);
      }
    }

    console.log("🎉 Universal Delivery Network seeded successfully!");
    
    return {
      success: true,
      message: "Universal Delivery Network initialized with categories, areas, and personnel",
      stats: {
        categories: categories.length,
        areas: areas.length,
        personnel: deliveryPeople.length
      }
    };

  } catch (error) {
    console.error("❌ Failed to seed delivery system:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}