# YaadFlex Ultimate AI Vehicle Valuator + OBD System Blueprint

## Complete Database Schema (shared/schema.ts additions)

```typescript
// =============================================================
// YAADLEX ULTIMATE AI VEHICLE VALUATOR + OBD SYSTEM
// Revolutionary honest pricing engine to prevent dealership lowballs
// =============================================================

// VIN Decoding Table - Stores decoded VIN information
export const vinDecodes = pgTable("vin_decodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vin: varchar("vin", { length: 24 }).notNull(),
  make: varchar("make", { length: 64 }),
  model: varchar("model", { length: 64 }),
  year: integer("year"),
  body: varchar("body", { length: 64 }),
  engine: varchar("engine", { length: 64 }),
  trim: varchar("trim", { length: 64 }),
  raw: jsonb("raw"), // Raw VIN decode response
  createdAt: timestamp("created_at").defaultNow(),
});

// Market Comparables - Regional pricing data
export const marketComps = pgTable("market_comps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  make: varchar("make", { length: 64 }),
  model: varchar("model", { length: 64 }),
  year: integer("year"),
  region: varchar("region", { length: 64 }), // e.g., "JM-KIN", "US-FL"
  sample: jsonb("sample"), // Array of {price, mileage, location, date}
  medianPrice: decimal("median_price"),
  medianMileage: integer("median_mileage"),
  refreshedAt: timestamp("refreshed_at").defaultNow(),
});

// AI Vehicle Valuations - The heart of honest pricing
export const valuations = pgTable("valuations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id"), // Link to vehicle listing
  vin: varchar("vin", { length: 24 }),
  make: varchar("make", { length: 64 }),
  model: varchar("model", { length: 64 }),
  year: integer("year"),
  mileage: integer("mileage"),
  region: varchar("region", { length: 64 }),
  conditionScore: integer("condition_score"), // 0–100 from visual assessment
  obdHealthScore: integer("obd_health_score"), // 0–100 from OBD scan
  estimateLow: decimal("estimate_low"),
  estimateMid: decimal("estimate_mid"), 
  estimateHigh: decimal("estimate_high"),
  inputs: jsonb("inputs"), // All input data used for valuation
  currency: varchar("currency", { length: 3 }).default("USD"),
  method: varchar("method", { length: 32 }).default("hedonic_v1"), // Algorithm version
  createdAt: timestamp("created_at").defaultNow(),
});

// OBD Diagnostic Tests - Vehicle health scanning
export const obdTests = pgTable("obd_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id"),
  vin: varchar("vin", { length: 24 }),
  startedAt: timestamp("started_at").defaultNow(),
  finishedAt: timestamp("finished_at"),
  status: varchar("status", { length: 16 }).default("started"), // started|ok|warning|critical
  dtcCount: integer("dtc_count").default(0), // Diagnostic Trouble Code count
  summary: text("summary"), // Human-readable test summary
});

// OBD Sensor Readings - Real-time vehicle data
export const obdReadings = pgTable("obd_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  testId: varchar("test_id").notNull().references(() => obdTests.id),
  pid: varchar("pid", { length: 24 }).notNull(), // Parameter ID (e.g., "010C" for RPM)
  value: varchar("value", { length: 64 }).notNull(),
  unit: varchar("unit", { length: 16 }), // rpm, °C, mph, etc.
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// INSERT SCHEMAS AND TYPES (add to end of schema.ts)
export const insertVinDecodeSchema = createInsertSchema(vinDecodes).omit({
  id: true,
  createdAt: true,
});
export type InsertVinDecode = z.infer<typeof insertVinDecodeSchema>;
export type VinDecode = typeof vinDecodes.$inferSelect;

export const insertMarketCompSchema = createInsertSchema(marketComps).omit({
  id: true,
  refreshedAt: true,
});
export type InsertMarketComp = z.infer<typeof insertMarketCompSchema>;
export type MarketComp = typeof marketComps.$inferSelect;

export const insertValuationSchema = createInsertSchema(valuations).omit({
  id: true,
  createdAt: true,
});
export type InsertValuation = z.infer<typeof insertValuationSchema>;
export type Valuation = typeof valuations.$inferSelect;

export const insertObdTestSchema = createInsertSchema(obdTests).omit({
  id: true,
  startedAt: true,
});
export type InsertObdTest = z.infer<typeof insertObdTestSchema>;
export type ObdTest = typeof obdTests.$inferSelect;

export const insertObdReadingSchema = createInsertSchema(obdReadings).omit({
  id: true,
  recordedAt: true,
});
export type InsertObdReading = z.infer<typeof insertObdReadingSchema>;
export type ObdReading = typeof obdReadings.$inferSelect;
```

## Valuation Engine (server/valuation/engine.ts)

```typescript
// =============================================================
// YAADLEX ULTIMATE AI VEHICLE VALUATOR ENGINE
// Revolutionary hedonic pricing model for honest vehicle assessment
// Prevents dealership lowballs with transparent, AI-powered valuations
// =============================================================

export type ValuationInput = {
  year: number;
  mileage: number;
  baseMedian: number; // Regional median price for make/model/year
  medianMileage: number; // Regional median mileage
  conditionScore: number; // 0–100 from visual assessment
  obdHealthScore: number; // 0–100 from OBD diagnostic scan
};

export type ValuationResult = {
  estimateLow: number;
  estimateMid: number;
  estimateHigh: number;
  adjustments: {
    agePenalty: number;
    mileageAdj: number;
    conditionAdj: number;
    obdAdj: number;
    totalAdjPct: number;
  };
};

export type ConditionForm = {
  exterior: number; // 0-100 exterior condition score
  interior: number; // 0-100 interior condition score
  tires: number; // 0-100 tire condition score
  brakes: number; // 0-100 brake condition score
  fluids: number; // 0-100 fluid levels score
};

/**
 * YaadFlex Revolutionary Hedonic Pricing Engine
 * 
 * Uses transparent, mathematically-sound adjustments to provide honest 
 * vehicle valuations that prevent dealership lowballing tactics.
 * 
 * Core Philosophy: Every adjustment is explainable and fair
 */
export function estimateValue(input: ValuationInput): ValuationResult {
  const currentYear = new Date().getFullYear();
  
  // 1. Age Penalty: 1.5% depreciation per year (industry standard)
  const vehicleAge = Math.max(0, currentYear - input.year);
  const agePenalty = vehicleAge * 0.015; // 1.5% per year
  
  // 2. Mileage Adjustment: 2% per 10,000 miles over/under median
  const mileageDiff = input.mileage - input.medianMileage;
  const mileageAdj = (mileageDiff / 10000) * 0.02;
  
  // 3. Condition Adjustment: ±10% based on visual condition (70 = baseline)
  const conditionAdj = (input.conditionScore - 70) / 100 * 0.10;
  
  // 4. OBD Health Adjustment: ±8% based on diagnostic health (80 = baseline) 
  const obdAdj = (input.obdHealthScore - 80) / 100 * 0.08;
  
  // 5. Combine all adjustments (negative = penalty, positive = bonus)
  const totalAdjPct = -agePenalty - mileageAdj + conditionAdj + obdAdj;
  
  // 6. Calculate adjusted price (minimum $500 floor)
  const adjustedPrice = Math.max(500, input.baseMedian * (1 + totalAdjPct));
  
  // 7. Create pricing range (±8% spread for negotiation room)
  const spread = Math.max(300, adjustedPrice * 0.08);
  
  return {
    estimateLow: Number((adjustedPrice - spread).toFixed(0)),
    estimateMid: Number(adjustedPrice.toFixed(0)),
    estimateHigh: Number((adjustedPrice + spread).toFixed(0)),
    adjustments: {
      agePenalty: Number(agePenalty.toFixed(4)),
      mileageAdj: Number(mileageAdj.toFixed(4)),
      conditionAdj: Number(conditionAdj.toFixed(4)),
      obdAdj: Number(obdAdj.toFixed(4)),
      totalAdjPct: Number(totalAdjPct.toFixed(4))
    }
  };
}

/**
 * Convert visual condition assessment to 0-100 score
 * 
 * Weighted scoring system:
 * - Exterior: 25% (paint, body damage, rust)
 * - Interior: 25% (seats, dashboard, electronics)
 * - Tires: 20% (tread depth, wear patterns)
 * - Brakes: 20% (pad thickness, rotor condition) 
 * - Fluids: 10% (oil, coolant, brake fluid levels)
 */
export function scoreCondition(form: ConditionForm): number {
  const { exterior, interior, tires, brakes, fluids } = form;
  
  const weightedScore = 
    exterior * 0.25 + 
    interior * 0.25 + 
    tires * 0.2 + 
    brakes * 0.2 + 
    fluids * 0.1;
    
  return Math.max(0, Math.min(100, Math.round(weightedScore)));
}

/**
 * Convert OBD diagnostic data to 0-100 health score
 * 
 * Factors considered:
 * - Diagnostic Trouble Codes (DTCs): Each code = -8 points (max -40)
 * - Monitor Readiness: Percentage of systems ready for testing
 * - Baseline: Healthy vehicle starts at 80 points
 */
export function scoreObd(dtcCount: number, monitorsOk: number, monitorsTotal: number): number {
  // Penalty for diagnostic trouble codes (max 40 point penalty)
  const dtcPenalty = Math.min(40, dtcCount * 8);
  
  // Bonus/penalty for monitor readiness (±20 points)
  const monitorRatio = monitorsTotal > 0 ? monitorsOk / monitorsTotal : 0.6;
  const monitorBonus = Math.round((monitorRatio - 0.5) * 40);
  
  // Baseline healthy score: 80 points
  const healthScore = 80 - dtcPenalty + monitorBonus;
  
  return Math.max(0, Math.min(100, healthScore));
}

/**
 * Generate human-readable valuation explanation
 * 
 * Helps users understand exactly why their vehicle received 
 * a specific valuation - full transparency!
 */
export function generateValuationExplanation(
  input: ValuationInput, 
  result: ValuationResult
): string {
  const explanations: string[] = [];
  
  explanations.push(`🚗 **YaadFlex AI Vehicle Valuation**`);
  explanations.push(`Base market value: $${input.baseMedian.toLocaleString()}`);
  explanations.push(`Regional median mileage: ${input.medianMileage.toLocaleString()} miles`);
  explanations.push('');
  
  // Age adjustment
  const vehicleAge = new Date().getFullYear() - input.year;
  const agePct = (result.adjustments.agePenalty * 100).toFixed(1);
  explanations.push(`📅 Age (${vehicleAge} years): -${agePct}% ($${(input.baseMedian * result.adjustments.agePenalty).toFixed(0)})`);
  
  // Mileage adjustment  
  const mileageDiff = input.mileage - input.medianMileage;
  const mileageDirection = mileageDiff >= 0 ? 'above' : 'below';
  const mileagePct = Math.abs(result.adjustments.mileageAdj * 100).toFixed(1);
  const mileageSign = result.adjustments.mileageAdj >= 0 ? '+' : '-';
  explanations.push(`🛣️ Mileage (${Math.abs(mileageDiff).toLocaleString()} ${mileageDirection} median): ${mileageSign}${mileagePct}% ($${mileageSign}${(input.baseMedian * Math.abs(result.adjustments.mileageAdj)).toFixed(0)})`);
  
  // Condition adjustment
  const conditionPct = (result.adjustments.conditionAdj * 100).toFixed(1);
  const conditionSign = result.adjustments.conditionAdj >= 0 ? '+' : '-';
  explanations.push(`🔧 Condition (${input.conditionScore}/100): ${conditionSign}${Math.abs(Number(conditionPct))}% ($${conditionSign}${(input.baseMedian * Math.abs(result.adjustments.conditionAdj)).toFixed(0)})`);
  
  // OBD health adjustment
  const obdPct = (result.adjustments.obdAdj * 100).toFixed(1);
  const obdSign = result.adjustments.obdAdj >= 0 ? '+' : '-';
  explanations.push(`🔬 Diagnostic Health (${input.obdHealthScore}/100): ${obdSign}${Math.abs(Number(obdPct))}% ($${obdSign}${(input.baseMedian * Math.abs(result.adjustments.obdAdj)).toFixed(0)})`);
  
  explanations.push('');
  explanations.push(`💰 **Final Honest Valuation Range:**`);
  explanations.push(`Low: $${result.estimateLow.toLocaleString()}`);
  explanations.push(`Fair: $${result.estimateMid.toLocaleString()}`);
  explanations.push(`High: $${result.estimateHigh.toLocaleString()}`);
  
  return explanations.join('\n');
}

/**
 * Default condition form for quick valuations
 * Represents average vehicle condition
 */
export const defaultConditionForm: ConditionForm = {
  exterior: 70,
  interior: 70, 
  tires: 70,
  brakes: 70,
  fluids: 70
};

/**
 * Default OBD parameters for vehicles without diagnostic scan
 * Represents typical vehicle health
 */
export const defaultObdParams = {
  dtcCount: 0,
  monitorsOk: 6,
  monitorsTotal: 8
};
```

## API Routes (add to server/routes.ts)

### Required Imports
```typescript
// Add these imports to the schema import section
  vinDecodes,
  marketComps,
  valuations,
  obdTests,
  obdReadings,

// Add this import after the schema imports
import { 
  estimateValue, 
  scoreCondition, 
  scoreObd, 
  generateValuationExplanation,
  defaultConditionForm,
  defaultObdParams
} from "./valuation/engine";
```

### API Routes (add before httpServer creation)
```typescript
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
```

## Required Dependencies (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "zod": "^3.22.4",
    "dotenv": "^16.3.1",
    "pg": "^8.11.3",
    "drizzle-orm": "^0.28.6"
  }
}
```

## Database Setup Commands
```bash
# Push schema changes to database
npm run db:push

# Or force push if needed
npm run db:push --force
```

## Test API Endpoint
```bash
curl -X POST http://localhost:5000/api/valuations/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Toyota",
    "model": "Corolla", 
    "year": 2018,
    "mileage": 65000,
    "region": "JM-KIN",
    "vin": "1HGCM82633A123456",
    "conditionForm": {
      "exterior": 75,
      "interior": 70, 
      "tires": 65,
      "brakes": 80,
      "fluids": 70
    },
    "obd": {
      "dtcCount": 0,
      "monitorsOk": 7,
      "monitorsTotal": 8
    }
  }'
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/valuations/estimate` | AI vehicle valuation |
| GET | `/api/valuations/:id` | Get valuation by ID |
| POST | `/api/obd/start` | Start OBD diagnostic test |
| POST | `/api/obd/:testId/reading` | Record OBD sensor reading |
| POST | `/api/obd/:testId/finish` | Complete OBD test |
| GET | `/api/obd/:testId` | Get OBD test results |
| POST | `/api/market-comps` | Add market comparable data |
| GET | `/api/market-comps` | Get market comparables |

This blueprint contains everything needed for the complete YaadFlex Vehicle Valuator system. Compare it with what you have and see what might be missing!