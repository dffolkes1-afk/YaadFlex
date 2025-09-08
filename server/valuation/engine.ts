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