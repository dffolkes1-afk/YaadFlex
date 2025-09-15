/**
 * LEGAL VERSIONS - Centralized policy version management
 * 
 * CRITICAL: These versions MUST be updated when legal documents change.
 * Used for audit trails and legal compliance tracking.
 */
export const LEGAL_VERSIONS = {
  TERMS_OF_SERVICE: '2.1.0',
  PRIVACY_POLICY: '2.1.0', 
  USER_AGREEMENT: '2.1.0',
  DRIVER_AGREEMENT: '2.1.0',
  BUSINESS_AGREEMENT: '2.1.0'
} as const;

/**
 * Legal acceptance validation schema data for server-side validation
 */
export const LEGAL_VALIDATION_MESSAGES = {
  MISSING_TERMS: 'Terms of Service must be accepted',
  MISSING_PRIVACY: 'Privacy Policy must be accepted', 
  MISSING_USER_AGREEMENT: 'User Agreement must be accepted',
  MISSING_DRIVER_AGREEMENT: 'Driver Agreement must be accepted',
  MISSING_BUSINESS_AGREEMENT: 'Business Partner Agreement must be accepted',
  GENERIC_ERROR: 'All legal agreements must be accepted to continue registration'
} as const;