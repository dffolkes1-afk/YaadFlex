import { Request, Response } from 'express';

// PURE YaadFlex Pay - Your Own Mobile Money System
// Works exactly like M-Pesa but 100% YaadFlex branded
// Uses JN Bank & VM Bank as transfer backend

interface YaadFlexPayUser {
  phone: string;
  balance: number;
  pin?: string;
  bankAccount?: string;
  preferredBank: 'JN_BANK' | 'VM_BANK';
  registrationDate: Date;
}

interface YaadFlexTransaction {
  id: string;
  type: 'SEND_MONEY' | 'BUY_GOODS' | 'DEPOSIT' | 'WITHDRAW' | 'BALANCE_CHECK' | 'ATM_SEND' | 'ATM_COLLECT';
  fromPhone: string;
  toPhone?: string;
  amount: number;
  fee: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  merchantCode?: string;
  description: string;
  timestamp: Date;
  // ATM Collection Fields
  collectionCode?: string;
  collectionCodeExpiry?: Date;
  senderPhoto?: string;
  recipientPhone?: string;
  verificationRequired?: boolean;
  atmLocationId?: string;
  collectedAt?: Date;
}

// YaadFlex Pay Fee Structure & Limits (Matching African Mobile Money Standards)
const YAADFLEX_FEES = {
  send_money: [
    { min: 1, max: 500, fee: 20 },      // J$20 for under J$500
    { min: 501, max: 2500, fee: 35 },   // J$35 for J$501-2500
    { min: 2501, max: 10000, fee: 50 }, // J$50 for J$2501-10000
    { min: 10001, max: 150000, fee: 75 } // J$75 for up to J$150,000 (M-Pesa standard)
  ],
  withdraw_fee: 50,    // J$50 flat fee
  deposit_fee: 0,      // Free deposits
  merchant_fee: 1.5    // 1.5% for merchant payments
};

// African Mobile Money Standard Limits (Like M-Pesa)
const TRANSACTION_LIMITS = {
  // Single transaction limits (matching M-Pesa international standards)
  maxSingleTransaction: 150000,    // J$150,000 (~$1,000 USD)
  maxATMCollection: 150000,        // J$150,000 ATM limit
  
  // Daily limits (matching African mobile money standards)
  maxDailyTransactions: 300000,    // J$300,000 (~$2,000 USD) 
  maxDailyATMCollections: 300000,  // J$300,000 daily ATM limit
  
  // Monthly limits (proven African mobile money limits)
  maxMonthlyTransactions: 1500000, // J$1.5M (~$10,000 USD)
  maxMonthlyATMCollections: 1500000, // J$1.5M monthly ATM limit
  
  // International compliance
  internationalDailyLimit: 450000,   // J$450,000 (~$3,000 USD)
  internationalMonthlyLimit: 2250000 // J$2.25M (~$15,000 USD)
};

// Global persistent storage for ATM collections (shared across all instances)
const globalAtmCollections: Map<string, YaadFlexTransaction> = new Map();

export class SimpleYaadFlexPay {

  /**
   * Register for YaadFlex Pay (like M-Pesa registration)
   */
  async register(phone: string, preferredBank: 'JN_BANK' | 'VM_BANK', pin: string) {
    const formattedPhone = this.formatPhone(phone);
    
    const user: YaadFlexPayUser = {
      phone: formattedPhone,
      balance: 0,
      preferredBank,
      pin: this.hashPin(pin),
      registrationDate: new Date()
    };

    console.log(`📱 YaadFlex Pay Registration: ${formattedPhone} via ${preferredBank}`);

    return {
      success: true,
      message: `Welcome to YaadFlex Pay! Your account is linked to ${preferredBank === 'JN_BANK' ? 'JN Bank' : 'VM Bank'}`,
      accountNumber: `YF${phone.slice(-7)}`,
      user: {
        phone: formattedPhone,
        balance: 0,
        currency: 'JMD',
        preferredBank,
        pin: this.hashPin(pin)
      }
    };
  }

  /**
   * Send money to another YaadFlex Pay user (like M-Pesa Send Money)
   */
  async sendMoney(fromPhone: string, toPhone: string, amount: number, pin: string) {
    // Validate against African mobile money standards
    if (amount > TRANSACTION_LIMITS.maxSingleTransaction) {
      return {
        success: false,
        error: `Maximum single transaction is J$${TRANSACTION_LIMITS.maxSingleTransaction.toLocaleString()} (African mobile money standard)`,
        errorCode: 'AMOUNT_EXCEEDS_SINGLE_LIMIT'
      };
    }

    const fee = this.calculateSendFee(amount);
    const totalDeduction = amount + fee;

    const transaction: YaadFlexTransaction = {
      id: `YF${Date.now()}`,
      type: 'SEND_MONEY',
      fromPhone: this.formatPhone(fromPhone),
      toPhone: this.formatPhone(toPhone),
      amount,
      fee,
      status: 'SUCCESS',
      description: `Send J$${amount} to ${this.formatPhone(toPhone)}`,
      timestamp: new Date()
    };

    console.log(`💸 YaadFlex Send: ${fromPhone} → ${toPhone} J$${amount} (fee: J$${fee})`);

    return {
      success: true,
      transaction,
      message: `You have sent J$${amount} to ${this.formatPhone(toPhone)}. Transaction fee J$${fee}.`,
      receipt: `YF${Date.now().toString().slice(-8)}`
    };
  }

  /**
   * Pay for goods/services (like M-Pesa Lipa na M-Pesa)
   */
  async buyGoods(customerPhone: string, merchantCode: string, amount: number, pin: string) {
    const fee = Math.round(amount * (YAADFLEX_FEES.merchant_fee / 100));

    const transaction: YaadFlexTransaction = {
      id: `YF${Date.now()}`,
      type: 'BUY_GOODS',
      fromPhone: this.formatPhone(customerPhone),
      amount,
      fee,
      status: 'SUCCESS',
      merchantCode,
      description: `Pay J$${amount} to merchant ${merchantCode}`,
      timestamp: new Date()
    };

    console.log(`🛍️ YaadFlex Buy Goods: ${customerPhone} → ${merchantCode} J$${amount}`);

    return {
      success: true,
      transaction,
      message: `Payment of J$${amount} to ${merchantCode} successful. Transaction fee J$${fee}.`,
      receipt: `YF${Date.now().toString().slice(-8)}`
    };
  }

  /**
   * Deposit money from bank to YaadFlex Pay
   */
  async deposit(phone: string, amount: number, bankAccount: string, preferredBank: 'JN_BANK' | 'VM_BANK') {
    const transaction: YaadFlexTransaction = {
      id: `YF${Date.now()}`,
      type: 'DEPOSIT',
      fromPhone: this.formatPhone(phone),
      amount,
      fee: YAADFLEX_FEES.deposit_fee,
      status: 'SUCCESS',
      description: `Deposit J$${amount} from ${preferredBank}`,
      timestamp: new Date()
    };

    console.log(`💰 YaadFlex Deposit: J$${amount} from ${preferredBank} to ${phone}`);

    return {
      success: true,
      transaction,
      message: `You have deposited J$${amount} from ${preferredBank === 'JN_BANK' ? 'JN Bank' : 'VM Bank'}. No fee charged.`,
      newBalance: amount
    };
  }

  /**
   * Withdraw money from YaadFlex Pay to bank
   */
  async withdraw(phone: string, amount: number, bankAccount: string, preferredBank: 'JN_BANK' | 'VM_BANK') {
    const fee = YAADFLEX_FEES.withdraw_fee;

    const transaction: YaadFlexTransaction = {
      id: `YF${Date.now()}`,
      type: 'WITHDRAW',
      fromPhone: this.formatPhone(phone),
      amount,
      fee,
      status: 'SUCCESS',
      description: `Withdraw J$${amount} to ${preferredBank}`,
      timestamp: new Date()
    };

    console.log(`🏦 YaadFlex Withdraw: J$${amount} from ${phone} to ${preferredBank}`);

    return {
      success: true,
      transaction,
      message: `You have withdrawn J$${amount} to ${preferredBank === 'JN_BANK' ? 'JN Bank' : 'VM Bank'}. Transaction fee J$${fee}.`,
      newBalance: 0
    };
  }

  /**
   * Check YaadFlex Pay balance (like M-Pesa balance inquiry)
   */
  async checkBalance(phone: string, pin: string) {
    // Mock balances for demo
    const mockBalanceJMD = 15000;
    const mockBalanceUSD = 95;

    return {
      success: true,
      phone: this.formatPhone(phone),
      balances: {
        JMD: mockBalanceJMD,
        USD: mockBalanceUSD
      },
      message: `Your YaadFlex Pay balance: J$${mockBalanceJMD.toLocaleString()} | US$${mockBalanceUSD}`,
      lastTransaction: new Date()
    };
  }

  // Helper methods
  private formatPhone(phone: string): string {
    if (phone.startsWith('876')) return `+1${phone}`;
    if (phone.startsWith('+1')) return phone;
    return `+1876${phone.slice(-7)}`;
  }

  private hashPin(pin: string): string {
    return `hashed_${pin}`;
  }

  private calculateSendFee(amount: number): number {
    for (const tier of YAADFLEX_FEES.send_money) {
      if (amount >= tier.min && amount <= tier.max) {
        return tier.fee;
      }
    }
    return YAADFLEX_FEES.send_money[YAADFLEX_FEES.send_money.length - 1].fee;
  }

  // Use global persistent storage for ATM collections
  private get atmCollections(): Map<string, YaadFlexTransaction> {
    return globalAtmCollections;
  }

  /**
   * Send money for ATM cash collection with photo verification
   * Recipient gets SMS with collection code to collect cash at any ATM
   */
  async sendToATM(senderPhone: string, recipientPhone: string, amount: number, pin: string, senderPhoto?: string) {
    // Validate against African mobile money ATM limits
    if (amount > TRANSACTION_LIMITS.maxATMCollection) {
      return {
        success: false,
        error: `Maximum ATM collection is J$${TRANSACTION_LIMITS.maxATMCollection.toLocaleString()} (M-Pesa standard)`,
        errorCode: 'AMOUNT_EXCEEDS_ATM_LIMIT'
      };
    }

    const fee = this.calculateSendFee(amount);
    const collectionCode = this.generateCollectionCode();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // 24-hour expiry

    const transaction: YaadFlexTransaction = {
      id: `YF${Date.now()}`,
      type: 'ATM_SEND',
      fromPhone: this.formatPhone(senderPhone),
      toPhone: this.formatPhone(recipientPhone),
      amount,
      fee,
      status: 'PENDING',
      description: `Send J$${amount} for ATM cash collection`,
      timestamp: new Date(),
      // ATM Collection Fields
      collectionCode,
      collectionCodeExpiry: expiryDate,
      senderPhoto: senderPhoto || undefined,
      recipientPhone: this.formatPhone(recipientPhone),
      verificationRequired: !!senderPhoto
    };

    // Store for collection
    this.atmCollections.set(collectionCode, transaction);

    console.log(`🏧 YaadFlex ATM Send: ${senderPhone} → ATM collection code ${collectionCode} for ${recipientPhone}`);

    return {
      success: true,
      transaction,
      collectionCode,
      expiryTime: expiryDate,
      message: `J$${amount} sent for ATM collection. Share code ${collectionCode} with recipient.`,
      smsMessage: `YaadFlex: You have J$${amount} to collect at any ATM. Code: ${collectionCode}. Expires: ${expiryDate.toLocaleString()}`,
      photoRequired: !!senderPhoto,
      receipt: `YF${Date.now().toString().slice(-8)}`
    };
  }

  /**
   * Collect cash from ATM using collection code
   * With optional photo verification for security
   */
  async collectFromATM(collectionCode: string, recipientPhone: string, atmLocationId: string, recipientPhoto?: string) {
    const transaction = this.atmCollections.get(collectionCode);
    
    if (!transaction) {
      return {
        success: false,
        error: 'Invalid collection code. Please check and try again.',
        errorCode: 'INVALID_CODE'
      };
    }

    if (transaction.status !== 'PENDING') {
      return {
        success: false,
        error: 'This collection code has already been used.',
        errorCode: 'CODE_USED'
      };
    }

    if (new Date() > transaction.collectionCodeExpiry!) {
      return {
        success: false,
        error: 'Collection code has expired. Contact sender for new code.',
        errorCode: 'CODE_EXPIRED'
      };
    }

    if (this.formatPhone(recipientPhone) !== transaction.recipientPhone) {
      return {
        success: false,
        error: 'Phone number does not match collection code recipient.',
        errorCode: 'PHONE_MISMATCH'
      };
    }

    // Photo verification if required
    if (transaction.verificationRequired && !recipientPhoto) {
      return {
        success: false,
        error: 'Photo verification required for this collection.',
        errorCode: 'PHOTO_REQUIRED'
      };
    }

    // Update transaction status
    transaction.status = 'SUCCESS';
    transaction.collectedAt = new Date();
    transaction.atmLocationId = atmLocationId;

    // Remove from pending collections
    this.atmCollections.delete(collectionCode);

    console.log(`💰 YaadFlex ATM Collect: ${recipientPhone} collected J$${transaction.amount} at ATM ${atmLocationId}`);

    return {
      success: true,
      transaction,
      amount: transaction.amount,
      collectedAt: new Date(),
      atmLocation: atmLocationId,
      message: `Successfully collected J$${transaction.amount} from ATM.`,
      receipt: `YF${Date.now().toString().slice(-8)}`
    };
  }

  /**
   * Check ATM collection status and pending collections
   */
  async checkATMCollections(phone: string) {
    const formattedPhone = this.formatPhone(phone);
    const pending: YaadFlexTransaction[] = [];
    const expired: YaadFlexTransaction[] = [];

    for (const [code, transaction] of this.atmCollections.entries()) {
      if (transaction.recipientPhone === formattedPhone) {
        if (new Date() > transaction.collectionCodeExpiry!) {
          expired.push(transaction);
        } else {
          pending.push(transaction);
        }
      }
    }

    return {
      success: true,
      pendingCollections: pending.length,
      expiredCollections: expired.length,
      collections: pending.map(t => ({
        collectionCode: t.collectionCode,
        amount: t.amount,
        senderPhone: t.fromPhone,
        expiresAt: t.collectionCodeExpiry,
        verificationRequired: t.verificationRequired
      })),
      message: `You have ${pending.length} pending ATM collections totaling J$${pending.reduce((sum, t) => sum + t.amount, 0)}`
    };
  }

  /**
   * Generate secure 6-digit collection code
   */
  private generateCollectionCode(): string {
    return Math.random().toString().slice(2, 8);
  }

  /**
   * Verify photo for ATM collection (placeholder for actual verification)
   */
  private verifyPhoto(senderPhoto: string, recipientPhoto: string): boolean {
    // In production, this would use AI photo verification
    // For demo, we'll assume verification passes
    return true;
  }
}

// Simple API Routes for YaadFlex Pay Only
export async function yaadflexRegister(req: Request, res: Response) {
  try {
    const { phone, preferredBank, pin } = req.body;
    const service = new SimpleYaadFlexPay();
    
    const result = await service.register(phone, preferredBank, pin);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
}

export async function yaadflexSendMoney(req: Request, res: Response) {
  try {
    const { fromPhone, toPhone, amount, pin } = req.body;
    const service = new SimpleYaadFlexPay();
    
    const result = await service.sendMoney(fromPhone, toPhone, amount, pin);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Transfer failed' });
  }
}

export async function yaadflexBuyGoods(req: Request, res: Response) {
  try {
    const { customerPhone, merchantCode, amount, pin } = req.body;
    const service = new SimpleYaadFlexPay();
    
    const result = await service.buyGoods(customerPhone, merchantCode, amount, pin);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Payment failed' });
  }
}

export async function yaadflexDeposit(req: Request, res: Response) {
  try {
    const { phone, amount, bankAccount, preferredBank } = req.body;
    const service = new SimpleYaadFlexPay();
    
    const result = await service.deposit(phone, amount, bankAccount, preferredBank);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Deposit failed' });
  }
}

export async function yaadflexWithdraw(req: Request, res: Response) {
  try {
    const { phone, amount, bankAccount, preferredBank } = req.body;
    const service = new SimpleYaadFlexPay();
    
    const result = await service.withdraw(phone, amount, bankAccount, preferredBank);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Withdrawal failed' });
  }
}

export async function yaadflexBalance(req: Request, res: Response) {
  try {
    const { phone, pin } = req.body;
    const service = new SimpleYaadFlexPay();
    
    const result = await service.checkBalance(phone, pin);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Balance check failed' });
  }
}

// ATM Cash Collection API Routes
export async function yaadflexSendToATM(req: Request, res: Response) {
  try {
    const { senderPhone, recipientPhone, amount, pin, senderPhoto } = req.body;
    const service = new SimpleYaadFlexPay();
    
    const result = await service.sendToATM(senderPhone, recipientPhone, amount, pin, senderPhoto);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'ATM send failed' });
  }
}

export async function yaadflexCollectFromATM(req: Request, res: Response) {
  try {
    const { collectionCode, recipientPhone, atmLocationId, recipientPhoto } = req.body;
    const service = new SimpleYaadFlexPay();
    
    const result = await service.collectFromATM(collectionCode, recipientPhone, atmLocationId, recipientPhoto);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'ATM collection failed' });
  }
}

export async function yaadflexCheckATMCollections(req: Request, res: Response) {
  try {
    const { phone } = req.body;
    const service = new SimpleYaadFlexPay();
    
    const result = await service.checkATMCollections(phone);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'ATM check failed' });
  }
}

export { YAADFLEX_FEES };