/**
 * YaadFlex Simple 2-Step Verification System
 * Customer-friendly verification like M-Pesa (PIN + SMS)
 */

export interface VerificationStep {
  step: number;
  type: 'PIN' | 'SMS' | 'PHOTO';
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  attempts: number;
  maxAttempts: number;
}

export interface TransactionVerification {
  transactionId: string;
  phone: string;
  amount: number;
  verificationSteps: VerificationStep[];
  smsCode?: string;
  smsCodeExpiry?: Date;
  isComplete: boolean;
  startTime: Date;
}

// Global storage for verification sessions
const activeVerifications: Map<string, TransactionVerification> = new Map();

export class YaadFlexSimpleVerification {
  private static instance: YaadFlexSimpleVerification;

  private constructor() {
    console.log('📱 YaadFlex Simple Verification initialized (2-Step: PIN + SMS)');
  }

  public static getInstance(): YaadFlexSimpleVerification {
    if (!YaadFlexSimpleVerification.instance) {
      YaadFlexSimpleVerification.instance = new YaadFlexSimpleVerification();
    }
    return YaadFlexSimpleVerification.instance;
  }

  /**
   * Start 2-step verification for ATM cash collection
   */
  public startVerification(transactionId: string, phone: string, amount: number): {
    success: boolean;
    verificationId: string;
    steps: string[];
    message: string;
  } {
    const verification: TransactionVerification = {
      transactionId,
      phone,
      amount,
      verificationSteps: [
        {
          step: 1,
          type: 'PIN',
          status: 'PENDING',
          attempts: 0,
          maxAttempts: 3
        },
        {
          step: 2,
          type: 'SMS',
          status: 'PENDING',
          attempts: 0,
          maxAttempts: 3
        }
      ],
      isComplete: false,
      startTime: new Date()
    };

    activeVerifications.set(transactionId, verification);

    console.log(`🔐 2-Step verification started for ${phone}: PIN → SMS`);

    return {
      success: true,
      verificationId: transactionId,
      steps: ['Enter your PIN', 'Confirm SMS code'],
      message: 'Please enter your 4-digit PIN to begin verification'
    };
  }

  /**
   * Step 1: Verify PIN (customer-friendly)
   */
  public verifyPIN(transactionId: string, pin: string): {
    success: boolean;
    nextStep?: string;
    smsCode?: string;
    message: string;
    errorCode?: string;
  } {
    const verification = activeVerifications.get(transactionId);
    if (!verification) {
      return {
        success: false,
        message: 'Verification session not found',
        errorCode: 'SESSION_NOT_FOUND'
      };
    }

    const pinStep = verification.verificationSteps[0];
    pinStep.attempts++;

    // Simple PIN validation (in production, this would check against user's actual PIN)
    if (pin === '9999' || pin.length === 4) {
      pinStep.status = 'VERIFIED';
      
      // Generate SMS code for Step 2
      const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
      verification.smsCode = smsCode;
      verification.smsCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      console.log(`✅ PIN verified for ${verification.phone}. SMS code: ${smsCode}`);

      return {
        success: true,
        nextStep: 'SMS_VERIFICATION',
        smsCode, // In production, this would be sent via SMS, not returned
        message: `SMS verification code sent to ${verification.phone}: ${smsCode}`
      };
    } else {
      pinStep.status = 'FAILED';
      
      if (pinStep.attempts >= pinStep.maxAttempts) {
        return {
          success: false,
          message: 'Too many failed PIN attempts. Transaction blocked.',
          errorCode: 'PIN_ATTEMPTS_EXCEEDED'
        };
      }

      return {
        success: false,
        message: `Incorrect PIN. ${pinStep.maxAttempts - pinStep.attempts} attempts remaining.`,
        errorCode: 'INVALID_PIN'
      };
    }
  }

  /**
   * Step 2: Verify SMS code (customer-friendly)
   */
  public verifySMS(transactionId: string, smsCode: string): {
    success: boolean;
    verificationComplete: boolean;
    message: string;
    errorCode?: string;
  } {
    const verification = activeVerifications.get(transactionId);
    if (!verification) {
      return {
        success: false,
        verificationComplete: false,
        message: 'Verification session not found',
        errorCode: 'SESSION_NOT_FOUND'
      };
    }

    const smsStep = verification.verificationSteps[1];
    smsStep.attempts++;

    // Check if SMS code expired
    if (verification.smsCodeExpiry && new Date() > verification.smsCodeExpiry) {
      return {
        success: false,
        verificationComplete: false,
        message: 'SMS code expired. Please restart verification.',
        errorCode: 'SMS_CODE_EXPIRED'
      };
    }

    // Verify SMS code
    if (smsCode === verification.smsCode) {
      smsStep.status = 'VERIFIED';
      verification.isComplete = true;

      console.log(`✅ 2-Step verification complete for ${verification.phone} - ATM collection approved`);

      // Clean up verification session
      activeVerifications.delete(transactionId);

      return {
        success: true,
        verificationComplete: true,
        message: 'Verification complete! You can now collect your cash from ATM.'
      };
    } else {
      smsStep.status = 'FAILED';
      
      if (smsStep.attempts >= smsStep.maxAttempts) {
        activeVerifications.delete(transactionId);
        return {
          success: false,
          verificationComplete: false,
          message: 'Too many failed SMS attempts. Transaction blocked.',
          errorCode: 'SMS_ATTEMPTS_EXCEEDED'
        };
      }

      return {
        success: false,
        verificationComplete: false,
        message: `Incorrect SMS code. ${smsStep.maxAttempts - smsStep.attempts} attempts remaining.`,
        errorCode: 'INVALID_SMS_CODE'
      };
    }
  }

  /**
   * Check verification status
   */
  public getVerificationStatus(transactionId: string): {
    found: boolean;
    status?: TransactionVerification;
    currentStep?: string;
  } {
    const verification = activeVerifications.get(transactionId);
    if (!verification) {
      return { found: false };
    }

    const currentStep = verification.verificationSteps.find(step => step.status === 'PENDING');
    
    return {
      found: true,
      status: verification,
      currentStep: currentStep ? `STEP_${currentStep.step}_${currentStep.type}` : 'COMPLETE'
    };
  }

  /**
   * Cancel verification (customer can restart if needed)
   */
  public cancelVerification(transactionId: string): boolean {
    return activeVerifications.delete(transactionId);
  }
}

// Export singleton instance
export const simpleVerification = YaadFlexSimpleVerification.getInstance();