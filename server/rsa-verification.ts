/**
 * YaadFlex RSA Verification System
 * Provides secure RSA encryption and digital signatures for financial verification
 */

import NodeRSA from 'node-rsa';
import crypto from 'crypto';

export interface RSAVerification {
  signature: string;
  publicKey: string;
  timestamp: string;
  transactionId: string;
}

export interface VerificationResult {
  isValid: boolean;
  verifiedBy: string;
  timestamp: string;
  signature?: string;
}

export class YaadFlexRSAVerification {
  private static instance: YaadFlexRSAVerification;
  private rsaKey: NodeRSA;
  private publicKey: string;
  private privateKey: string;

  private constructor() {
    // Generate RSA 2048-bit key pair for YaadFlex verification
    this.rsaKey = new NodeRSA({ b: 2048 });
    this.publicKey = this.rsaKey.exportKey('public');
    this.privateKey = this.rsaKey.exportKey('private');
    
    console.log('🔐 YaadFlex RSA Verification System initialized');
  }

  public static getInstance(): YaadFlexRSAVerification {
    if (!YaadFlexRSAVerification.instance) {
      YaadFlexRSAVerification.instance = new YaadFlexRSAVerification();
    }
    return YaadFlexRSAVerification.instance;
  }

  /**
   * Generate RSA digital signature for transaction verification
   */
  public signTransaction(transactionData: {
    id: string;
    amount: number;
    fromPhone: string;
    toPhone?: string;
    type: string;
    timestamp: Date;
  }): RSAVerification {
    const dataToSign = JSON.stringify({
      transactionId: transactionData.id,
      amount: transactionData.amount,
      fromPhone: transactionData.fromPhone,
      toPhone: transactionData.toPhone,
      type: transactionData.type,
      timestamp: transactionData.timestamp.toISOString()
    });

    // Create RSA digital signature
    const signature = this.rsaKey.sign(dataToSign, 'base64');
    
    const verification: RSAVerification = {
      signature,
      publicKey: this.publicKey,
      timestamp: new Date().toISOString(),
      transactionId: transactionData.id
    };

    console.log(`🔏 RSA signature generated for transaction ${transactionData.id}`);
    return verification;
  }

  /**
   * Verify RSA digital signature for transaction authentication
   */
  public verifyTransaction(
    transactionData: any,
    verification: RSAVerification
  ): VerificationResult {
    try {
      const dataToVerify = JSON.stringify({
        transactionId: verification.transactionId,
        amount: transactionData.amount,
        fromPhone: transactionData.fromPhone,
        toPhone: transactionData.toPhone,
        type: transactionData.type,
        timestamp: transactionData.timestamp
      });

      // Verify RSA digital signature
      const isValid = this.rsaKey.verify(dataToVerify, verification.signature, 'base64');

      const result: VerificationResult = {
        isValid,
        verifiedBy: 'YaadFlex-RSA-System',
        timestamp: new Date().toISOString(),
        signature: verification.signature
      };

      if (isValid) {
        console.log(`✅ RSA verification successful for transaction ${verification.transactionId}`);
      } else {
        console.log(`❌ RSA verification failed for transaction ${verification.transactionId}`);
      }

      return result;
    } catch (error) {
      console.error('🚨 RSA verification error:', error);
      return {
        isValid: false,
        verifiedBy: 'YaadFlex-RSA-System',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate secure ATM collection code with RSA verification
   */
  public generateSecureATMCode(transactionId: string, amount: number, recipientPhone: string): {
    collectionCode: string;
    rsaVerification: RSAVerification;
    securityHash: string;
  } {
    // Generate 6-digit collection code
    const collectionCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create transaction data for RSA signing
    const transactionData = {
      id: transactionId,
      amount,
      fromPhone: 'ATM-SYSTEM',
      toPhone: recipientPhone,
      type: 'ATM_COLLECTION',
      timestamp: new Date()
    };

    // Generate RSA signature
    const rsaVerification = this.signTransaction(transactionData);
    
    // Create additional security hash
    const securityHash = crypto
      .createHash('sha256')
      .update(`${collectionCode}${transactionId}${amount}${recipientPhone}`)
      .digest('hex')
      .substring(0, 16);

    console.log(`🏧 Secure ATM code ${collectionCode} generated with RSA verification`);

    return {
      collectionCode,
      rsaVerification,
      securityHash
    };
  }

  /**
   * Verify ATM collection with RSA authentication
   */
  public verifyATMCollection(
    collectionCode: string,
    transactionData: any,
    rsaVerification: RSAVerification,
    securityHash: string
  ): VerificationResult & { codeValid: boolean } {
    // Verify security hash
    const expectedHash = crypto
      .createHash('sha256')
      .update(`${collectionCode}${transactionData.id}${transactionData.amount}${transactionData.toPhone}`)
      .digest('hex')
      .substring(0, 16);

    const codeValid = expectedHash === securityHash;

    // Verify RSA signature
    const rsaResult = this.verifyTransaction(transactionData, rsaVerification);

    const result = {
      ...rsaResult,
      codeValid,
      isValid: rsaResult.isValid && codeValid
    };

    if (result.isValid) {
      console.log(`✅ ATM collection verified: Code ${collectionCode} with RSA authentication`);
    } else {
      console.log(`❌ ATM collection failed: Code ${collectionCode} verification failed`);
    }

    return result;
  }

  /**
   * Get public key for external verification
   */
  public getPublicKey(): string {
    return this.publicKey;
  }

  /**
   * Encrypt sensitive data with RSA
   */
  public encrypt(data: string): string {
    return this.rsaKey.encrypt(data, 'base64');
  }

  /**
   * Decrypt sensitive data with RSA
   */
  public decrypt(encryptedData: string): string {
    return this.rsaKey.decrypt(encryptedData, 'utf8');
  }
}

// Export singleton instance
export const rsaVerification = YaadFlexRSAVerification.getInstance();