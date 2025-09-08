import { Router } from 'express';
import { timelessCore } from './timeless-core-service';
// Note: In production, would use actual authentication middleware
const authenticateUser = (req: any, res: any, next: any) => {
  // Mock authentication - in production use proper auth middleware
  req.user = { id: 'demo-user-123' };
  next();
};
import {
  insertLearningSignalSchema,
  insertSystemDiagnosticsSchema,
  insertAdaptiveLearningMetricsSchema
} from '../shared/schema';
import { z } from 'zod';

export const timelessCoreRouter = Router();

// ===================== SAFETY-FIRST LEARNING =====================

// Record user feedback for continuous learning
timelessCoreRouter.post('/learning-signals', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    
    // Validate the learning signal data
    const validatedSignal = insertLearningSignalSchema.parse({
      ...req.body,
      userId,
      privacyConsent: req.body.privacyConsent || false
    });

    if (!validatedSignal.privacyConsent) {
      return res.status(400).json({ 
        error: 'Privacy consent required for learning signals',
        code: 'PRIVACY_CONSENT_REQUIRED'
      });
    }

    await timelessCore.recordLearningSignal(validatedSignal);
    
    res.json({ 
      success: true, 
      message: 'Learning signal recorded safely with privacy protection' 
    });
  } catch (error) {
    console.error('Error recording learning signal:', error);
    res.status(500).json({ 
      error: 'Failed to record learning signal',
      code: 'LEARNING_SIGNAL_ERROR' 
    });
  }
});

// ===================== ADAPTIVE INTELLIGENCE METRICS =====================

// Get user's adaptive learning metrics and system IQ
timelessCoreRouter.get('/adaptive-metrics', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    
    // Get predictive insights with safety checks
    const insights = await timelessCore.generatePredictiveInsights(userId);
    
    res.json({
      success: true,
      metrics: insights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching adaptive metrics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch adaptive metrics',
      code: 'METRICS_ERROR'
    });
  }
});

// Update adaptive learning metrics (from UI interactions)
timelessCoreRouter.post('/adaptive-metrics', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    
    // Validate metrics data
    const metricsUpdate = z.object({
      translationAccuracy: z.number().min(0).max(1).optional(),
      responseSpeed: z.number().min(0).optional(),
      userSatisfactionScore: z.number().min(1).max(5).optional(),
      successfulPredictions: z.number().min(0).optional()
    }).parse(req.body);

    // Convert numeric values to strings for database compatibility
    const dbMetrics: any = {};
    if (metricsUpdate.translationAccuracy) dbMetrics.translationAccuracy = metricsUpdate.translationAccuracy.toString();
    if (metricsUpdate.responseSpeed) dbMetrics.responseSpeed = metricsUpdate.responseSpeed;
    if (metricsUpdate.userSatisfactionScore) dbMetrics.userSatisfactionScore = metricsUpdate.userSatisfactionScore.toString();
    if (metricsUpdate.successfulPredictions) dbMetrics.successfulPredictions = metricsUpdate.successfulPredictions;

    await timelessCore.updateAdaptiveMetrics(userId, dbMetrics);
    
    res.json({ 
      success: true, 
      message: 'Adaptive metrics updated - system intelligence growing' 
    });
  } catch (error) {
    console.error('Error updating adaptive metrics:', error);
    res.status(500).json({ 
      error: 'Failed to update adaptive metrics',
      code: 'METRICS_UPDATE_ERROR'
    });
  }
});

// ===================== SYSTEM HEALTH & AUTO-REPAIR =====================

// Get real-time system health status
timelessCoreRouter.get('/system-health', authenticateUser, async (req, res) => {
  try {
    // Trigger health check (non-blocking)
    timelessCore.performSystemHealthCheck().catch(error => {
      console.error('Background health check failed:', error);
    });

    // Get recent health status from database
    const { db } = await import('./db');
    const { systemDiagnostics } = await import('../shared/schema');
    const { desc } = await import('drizzle-orm');

    const recentDiagnostics = await db
      .select()
      .from(systemDiagnostics)
      .orderBy(desc(systemDiagnostics.checkTimestamp))
      .limit(10);

    const healthSummary = recentDiagnostics.reduce((summary: any, diagnostic) => {
      summary[diagnostic.component] = {
        health: diagnostic.health,
        errorRate: diagnostic.errorRate,
        latencyP95: diagnostic.latencyP95,
        lastCheck: diagnostic.checkTimestamp,
        autoRepairAttempted: diagnostic.autoRepairAttempted,
        repairSuccessful: diagnostic.repairSuccessful
      };
      return summary;
    }, {});

    res.json({
      success: true,
      systemHealth: healthSummary,
      overallStatus: calculateOverallHealth(recentDiagnostics),
      lastHealthCheck: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({ 
      error: 'Failed to fetch system health',
      code: 'HEALTH_CHECK_ERROR'
    });
  }
});

// ===================== FEATURE FLAGS & ROLLOUT CONTROL =====================

// Check if feature is enabled for user (with safety controls)
timelessCoreRouter.get('/feature-flags/:flagName', authenticateUser, async (req, res) => {
  try {
    const { flagName } = req.params;
    const userId = req.user?.id || 'demo-user';
    
    const isEnabled = await timelessCore.isFeatureEnabled(flagName, userId);
    
    res.json({
      success: true,
      flagName,
      enabled: isEnabled,
      userId: userId.slice(-4), // Only show last 4 chars for privacy
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking feature flag:', error);
    res.status(500).json({ 
      error: 'Failed to check feature flag',
      code: 'FEATURE_FLAG_ERROR'
    });
  }
});

// ===================== CONTINUOUS LEARNING PIPELINE =====================

// Trigger batch learning process (admin only)
timelessCoreRouter.post('/batch-learning', authenticateUser, async (req, res) => {
  try {
    // In production, this would check for admin privileges
    const config = await timelessCore.getCurrentConfig();
    
    if (config.humanApprovalRequired) {
      return res.status(403).json({
        error: 'Batch learning requires human approval in current safety mode',
        safetyMode: config.safetyMode,
        code: 'HUMAN_APPROVAL_REQUIRED'
      });
    }

    // Start batch learning (non-blocking)
    timelessCore.processBatchLearning().catch(error => {
      console.error('Batch learning failed:', error);
    });

    res.json({ 
      success: true, 
      message: 'Batch learning process started with safety controls',
      safetyMode: config.safetyMode
    });
  } catch (error) {
    console.error('Error starting batch learning:', error);
    res.status(500).json({ 
      error: 'Failed to start batch learning',
      code: 'BATCH_LEARNING_ERROR'
    });
  }
});

// Get TimelessCore configuration
timelessCoreRouter.get('/config', authenticateUser, async (req, res) => {
  try {
    const config = await timelessCore.getCurrentConfig();
    
    // Return safe configuration info (hide sensitive details)
    res.json({
      success: true,
      config: {
        version: config.version,
        safetyMode: config.safetyMode,
        privacyMode: config.privacyMode,
        rollbackEnabled: config.rollbackEnabled,
        humanApprovalRequired: config.humanApprovalRequired,
        lastKnownGoodVersion: config.lastKnownGoodVersion
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching TimelessCore config:', error);
    res.status(500).json({ 
      error: 'Failed to fetch configuration',
      code: 'CONFIG_ERROR'
    });
  }
});

// ===================== ENHANCED TRANSLATION WITH TIMELESS FEATURES =====================

// Enhanced translation endpoint with TimelessCore integration
timelessCoreRouter.post('/enhanced-translate', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { text, sourceLang, targetLang, context } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({
        error: 'Text and target language are required',
        code: 'MISSING_PARAMETERS'
      });
    }

    // Check if enhanced features are enabled for this user
    const enhancedFeaturesEnabled = await timelessCore.isFeatureEnabled('enhanced_translation', userId);
    
    // Simulate translation with TimelessCore enhancements
    const startTime = Date.now();
    
    // Mock translation result (in production, would call actual translation API)
    const translatedText = await performEnhancedTranslation(text, sourceLang, targetLang, context);
    
    const translationTime = Date.now() - startTime;
    
    // Record learning signal if user consents
    if (req.body.privacyConsent) {
      await timelessCore.recordLearningSignal({
        userId,
        signalType: 'enhanced_translation',
        originalText: text,
        targetLang,
        translatedText: translatedText.text,
        privacyConsent: true,
        processed: false
      });
    }

    // Update adaptive metrics
    await timelessCore.updateAdaptiveMetrics(userId, {
      translationAccuracy: translatedText.accuracy,
      responseSpeed: translationTime
    });

    // Get predictive insights
    const insights = enhancedFeaturesEnabled ? 
      await timelessCore.generatePredictiveInsights(userId) : null;

    res.json({
      success: true,
      translation: {
        originalText: text,
        translatedText: translatedText.text,
        sourceLang: sourceLang || 'auto',
        targetLang,
        accuracy: translatedText.accuracy,
        responseTime: translationTime
      },
      timelessFeatures: {
        enhancedFeaturesEnabled,
        adaptiveInsights: insights,
        systemLearning: req.body.privacyConsent ? 'Signal recorded for improvement' : 'Privacy mode - no learning data stored'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in enhanced translation:', error);
    res.status(500).json({ 
      error: 'Enhanced translation failed',
      code: 'ENHANCED_TRANSLATION_ERROR'
    });
  }
});

// Helper function to calculate overall system health
function calculateOverallHealth(diagnostics: any[]): string {
  if (diagnostics.length === 0) return 'unknown';
  
  const healthCounts = diagnostics.reduce((counts: any, d) => {
    counts[d.health] = (counts[d.health] || 0) + 1;
    return counts;
  }, {});

  if (healthCounts.failure || healthCounts.critical) return 'critical';
  if (healthCounts.warning) return 'warning';
  return 'healthy';
}

// Helper function for enhanced translation
async function performEnhancedTranslation(text: string, sourceLang: string | undefined, targetLang: string, context?: string): Promise<{ text: string; accuracy: number }> {
  // Mock enhanced translation with TimelessCore improvements
  // In production, this would use advanced AI models with context awareness
  
  const translations: { [key: string]: { [key: string]: string } } = {
    'en-JM': {
      'es-HN': text.replace(/hello/gi, 'Hola').replace(/how are you/gi, 'Cómo estás'),
      'sw-KE': text.replace(/hello/gi, 'Habari').replace(/how are you/gi, 'Hujambo'),
      'en-US': text.replace(/wah gwaan/gi, 'what\'s up').replace(/yuh good/gi, 'you good')
    },
    'es-HN': {
      'en-JM': text.replace(/hola/gi, 'Hello').replace(/cómo estás/gi, 'How yuh stay'),
      'en-US': text.replace(/hola/gi, 'Hello').replace(/cómo estás/gi, 'How are you')
    }
  };

  const sourceKey = sourceLang || 'en-JM';
  const translatedText = translations[sourceKey]?.[targetLang] || 
    `[Enhanced Translation] ${text} (${sourceKey} → ${targetLang})`;

  // Simulate accuracy score with TimelessCore intelligence
  const accuracy = 0.94 + (Math.random() * 0.06); // 94-100% accuracy

  return { text: translatedText, accuracy };
}