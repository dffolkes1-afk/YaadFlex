import { z } from 'zod';

// TimelessCore Configuration Types
export interface TimelessCoreConfig {
  version: string;
  safetyMode: 'strict' | 'moderate' | 'permissive';
  learningRateLimit: number;
  humanApprovalRequired: boolean;
  privacyMode: 'maximum' | 'balanced' | 'minimal';
  driftThreshold: number;
  rollbackEnabled: boolean;
  lastKnownGoodVersion?: string;
}

export interface LearningSignal {
  userId: string;
  signalType: 'feedback_button' | 'translation_report' | 'voice_correction' | 'support_transcript' | 'usage_metric';
  originalText?: string; // PII redacted
  targetLang: string;
  translatedText?: string; // PII redacted
  feedbackScore?: number; // 1-5 or -1/1 for good/bad
  reportReason?: string;
  contextHash?: string; // anonymized context
  sessionId?: string; // anonymized session
  privacyConsent: boolean;
  processed: boolean;
}

export interface ModelVersion {
  version: string;
  status: 'training' | 'evaluating' | 'canary' | 'deployed' | 'rollback' | 'deprecated';
  accuracyScore?: number;
  latencyP95?: number; // milliseconds
  safetyScore?: number;
  evaluationPassed: boolean;
  rolloutPercentage: number;
  deployer: string;
  approver?: string;
  safetyApprover?: string;
  deployedAt?: Date;
}

export interface FeatureFlag {
  flagName: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetUserGroups: string[]; // ['beta', 'premium', 'all']
  safetyCheck: boolean;
  createdBy: string;
  description?: string;
}

export interface SystemDiagnostics {
  component: 'translator' | 'policy_engine' | 'learning_loop' | 'safety_monitor';
  health: 'healthy' | 'warning' | 'critical' | 'failure';
  errorRate?: number;
  latencyP95?: number;
  throughput?: number;
  memoryUsage?: number;
  cpuUsage?: number;
  alertTriggered: boolean;
  autoRepairAttempted: boolean;
  repairSuccessful?: boolean;
  checkTimestamp: Date;
}

// TimelessCore Safety Policies
export const SafetyPolicies = {
  // Translation Quality Gates
  ACCURACY_THRESHOLD: 0.92,
  LATENCY_P95_MAX: 1500, // milliseconds
  ERROR_RATE_MAX: 0.02, // 2%
  
  // Learning Rate Limits
  MAX_UPDATES_PER_HOUR: 100,
  MAX_UPDATES_PER_DAY: 1000,
  
  // Privacy Protection
  PII_REDACTION_ENABLED: true,
  HASH_ANONYMIZATION: true,
  DATA_RETENTION_DAYS: 30,
  
  // Rollback Triggers
  ROLLBACK_TRIGGERS: [
    'error_rate>2%',
    'latency_p95>2s', 
    'policy_violation_detected',
    'accuracy_drop>5%',
    'user_complaints>10/hour'
  ]
};

// Learning Pipeline Configuration
export const LearningPipeline = {
  BATCH_SCHEDULE: '0 3 * * *', // 3 AM daily
  LEARNING_RATE: 0.0001,
  DRIFT_DETECTION_THRESHOLD: 0.2,
  
  UPGRADE_STAGES: [
    'data_validation',
    'redaction_and_anonymization', 
    'synthetic_augmentation',
    'model_training',
    'evaluation_suite',
    'safety_policy_checks',
    'canary_deploy',
    'progressive_rollout',
    'post_deploy_monitoring'
  ],
  
  ROLES: {
    OWNER_APPROVER: 'founder_or_delegate',
    SAFETY_OFFICER: 'policy_team', 
    ML_ENGINEER: 'infra_team'
  }
};

// Validation Schemas
export const timelessConfigSchema = z.object({
  version: z.string(),
  safetyMode: z.enum(['strict', 'moderate', 'permissive']),
  learningRateLimit: z.number().min(1).max(1000),
  humanApprovalRequired: z.boolean(),
  privacyMode: z.enum(['maximum', 'balanced', 'minimal']),
  driftThreshold: z.number().min(0.1).max(1.0),
  rollbackEnabled: z.boolean(),
  lastKnownGoodVersion: z.string().optional()
});

export const learningSignalSchema = z.object({
  userId: z.string(),
  signalType: z.enum(['feedback_button', 'translation_report', 'voice_correction', 'support_transcript', 'usage_metric']),
  originalText: z.string().optional(),
  targetLang: z.string(),
  translatedText: z.string().optional(), 
  feedbackScore: z.number().min(-1).max(5).optional(),
  reportReason: z.string().optional(),
  contextHash: z.string().optional(),
  sessionId: z.string().optional(),
  privacyConsent: z.boolean(),
  processed: z.boolean().default(false)
});

export const modelVersionSchema = z.object({
  version: z.string(),
  status: z.enum(['training', 'evaluating', 'canary', 'deployed', 'rollback', 'deprecated']),
  accuracyScore: z.number().min(0).max(1).optional(),
  latencyP95: z.number().min(0).optional(),
  safetyScore: z.number().min(0).max(1).optional(),
  evaluationPassed: z.boolean().default(false),
  rolloutPercentage: z.number().min(0).max(100).default(0),
  deployer: z.string(),
  approver: z.string().optional(),
  safetyApprover: z.string().optional(),
  deployedAt: z.date().optional()
});