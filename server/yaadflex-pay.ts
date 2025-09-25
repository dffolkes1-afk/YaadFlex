import { Request, Response } from 'express';

// YaadFlex Pay - Custom Caribbean Mobile Money System
// Works like M-Pesa but uses JN Bank and VM Bank for transfers

interface YaadFlexPayUser {
  phone: string;
  balance: number;
  currency: 'JMD' | 'USD';
  bankAccount?: string;
  preferredBank: 'JN_BANK' | 'VM_BANK';
  pin?: string;
}

interface YaadFlexTransaction {
  id: string;
  fromPhone: string;
  toPhone?: string;
  amount: number;
  currency: 'JMD' | 'USD';
  type: 'SEND_MONEY' | 'BUY_GOODS' | 'DEPOSIT' | 'WITHDRAW' | 'PAY_BILL';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  reference: string;
  merchantCode?: string;
  bankTransactionId?: string;
  fee: number;
  timestamp: Date;
}

// YaadFlex Pay fee structure (competitive with African mobile money)
const YAADFLEX_PAY_FEES = {
  // Send Money Fees (like M-Pesa)
  send_money: {
    'JMD': [
      { min: 1, max: 500, fee: 20 },      // $20 JMD for under $500
      { min: 501, max: 2500, fee: 35 },   // $35 JMD for $501-$2500
      { min: 2501, max: 10000, fee: 50 }, // $50 JMD for $2501-$10000
      { min: 10001, max: 50000, fee: 75 }, // $75 JMD for higher amounts
    ],
    'USD': [
      { min: 1, max: 10, fee: 0.25 },     // $0.25 USD for under $10
      { min: 11, max: 50, fee: 0.50 },    // $0.50 USD for $11-$50
      { min: 51, max: 200, fee: 1.00 },   // $1.00 USD for $51-$200
      { min: 201, max: 1000, fee: 2.00 }, // $2.00 USD for higher amounts
    ]
  },
  // Merchant Payment Fees (for clothing purchases)
  pay_merchant: {
    'JMD': 1.5, // 1.5% like African systems
    'USD': 2.0  // 2% for USD
  }
};

// Bank Integration Configs
const BANK_CONFIGS = {
  JN_BANK: {
    name: 'JN Bank',
    apiEndpoint: 'https://api.jnbank.com/transfers',
    transferLimit: { JMD: 500000, USD: 3000 },
    dailyLimit: { JMD: 1000000, USD: 6000 }
  },
  VM_BANK: {
    name: 'VM Bank', 
    apiEndpoint: 'https://api.vmbank.com/transfers',
    transferLimit: { JMD: 300000, USD: 2000 },
    dailyLimit: { JMD: 800000, USD: 5000 }
  }
};

export class YaadFlexPayService {
  
  /**
   * Register new YaadFlex Pay user (like M-Pesa registration)
   */
  async registerUser(phone: string, preferredBank: 'JN_BANK' | 'VM_BANK', pin: string) {
    // In real implementation, this would create user in database
    const user: YaadFlexPayUser = {
      phone: this.formatPhone(phone),
      balance: 0,
      currency: 'JMD',
      preferredBank,
      pin: this.hashPin(pin)
    };

    console.log(`📱 YaadFlex Pay user registered: ${phone} via ${preferredBank}`);
    return {
      success: true,
      message: `Welcome to YaadFlex Pay! Your account is linked to ${BANK_CONFIGS[preferredBank].name}`,
      accountNumber: `YF${phone.slice(-7)}`,
      user
    };
  }

  /**
   * Send money between YaadFlex Pay users (like M-Pesa Lipa)
   */
  async sendMoney(fromPhone: string, toPhone: string, amount: number, currency: 'JMD' | 'USD', pin: string) {
    const fee = this.calculateSendMoneyFee(amount, currency);
    const totalDeduction = amount + fee;
    
    const transaction: YaadFlexTransaction = {
      id: `YF${Date.now()}`,
      fromPhone: this.formatPhone(fromPhone),
      toPhone: this.formatPhone(toPhone),
      amount,
      currency,
      type: 'SEND_MONEY',
      status: 'PENDING',
      reference: `Send ${currency}${amount} to ${toPhone}`,
      fee,
      timestamp: new Date()
    };

    // In real implementation, verify PIN and process transfer via JN/VM Bank
    console.log(`💸 YaadFlex Pay transfer: ${fromPhone} → ${toPhone} ${currency}${amount} (fee: ${currency}${fee})`);
    
    return {
      success: true,
      transaction,
      message: `${currency}${amount} sent successfully to ${toPhone}. Fee: ${currency}${fee}`,
      newBalance: 0 // Would calculate actual balance
    };
  }

  /**
   * Pay for goods/services (like M-Pesa Lipa na M-Pesa)
   */
  async payMerchant(customerPhone: string, merchantCode: string, amount: number, currency: 'JMD' | 'USD', pin: string) {
    const feePercent = YAADFLEX_PAY_FEES.pay_merchant[currency];
    const fee = Math.round(amount * (feePercent / 100));
    
    const transaction: YaadFlexTransaction = {
      id: `YF${Date.now()}`,
      fromPhone: this.formatPhone(customerPhone),
      amount,
      currency,
      type: 'BUY_GOODS',
      status: 'PENDING',
      reference: `Payment to merchant ${merchantCode}`,
      merchantCode,
      fee,
      timestamp: new Date()
    };

    // Process payment via preferred bank
    console.log(`🛍️ YaadFlex Pay merchant payment: ${customerPhone} → ${merchantCode} ${currency}${amount}`);
    
    return {
      success: true,
      transaction,
      message: `Payment of ${currency}${amount} successful to ${merchantCode}`,
      receiptCode: `YF${Date.now().toString().slice(-8)}`
    };
  }

  /**
   * Deposit money from bank account to YaadFlex Pay wallet
   */
  async depositMoney(phone: string, amount: number, currency: 'JMD' | 'USD', bankAccount: string, preferredBank: 'JN_BANK' | 'VM_BANK') {
    const transaction: YaadFlexTransaction = {
      id: `YF${Date.now()}`,
      fromPhone: this.formatPhone(phone),
      amount,
      currency,
      type: 'DEPOSIT',
      status: 'PENDING',
      reference: `Deposit from ${BANK_CONFIGS[preferredBank].name}`,
      bankTransactionId: `${preferredBank}_${Date.now()}`,
      fee: 0, // No fee for deposits
      timestamp: new Date()
    };

    console.log(`💰 YaadFlex Pay deposit: ${currency}${amount} from ${preferredBank} to ${phone}`);
    
    return {
      success: true,
      transaction,
      message: `${currency}${amount} deposited successfully from ${BANK_CONFIGS[preferredBank].name}`,
      newBalance: amount // Would calculate actual balance
    };
  }

  /**
   * Withdraw money from YaadFlex Pay to bank account
   */
  async withdrawMoney(phone: string, amount: number, currency: 'JMD' | 'USD', bankAccount: string, preferredBank: 'JN_BANK' | 'VM_BANK') {
    const withdrawFee = currency === 'JMD' ? 50 : 1; // Flat withdrawal fee
    
    const transaction: YaadFlexTransaction = {
      id: `YF${Date.now()}`,
      fromPhone: this.formatPhone(phone),
      amount,
      currency,
      type: 'WITHDRAW',
      status: 'PENDING',
      reference: `Withdraw to ${BANK_CONFIGS[preferredBank].name}`,
      bankTransactionId: `${preferredBank}_${Date.now()}`,
      fee: withdrawFee,
      timestamp: new Date()
    };

    console.log(`🏦 YaadFlex Pay withdrawal: ${currency}${amount} from ${phone} to ${preferredBank}`);
    
    return {
      success: true,
      transaction,
      message: `${currency}${amount} withdrawn to ${BANK_CONFIGS[preferredBank].name}. Fee: ${currency}${withdrawFee}`,
      newBalance: 0 // Would calculate actual balance
    };
  }

  /**
   * Check YaadFlex Pay balance (like M-Pesa balance inquiry)
   */
  async checkBalance(phone: string, pin: string) {
    // In real implementation, verify PIN and get balance from database
    const mockBalance = {
      JMD: 15000,
      USD: 95
    };

    return {
      success: true,
      phone: this.formatPhone(phone),
      balances: mockBalance,
      message: `Your YaadFlex Pay balance: J$${mockBalance.JMD} | US$${mockBalance.USD}`,
      lastTransaction: new Date()
    };
  }

  /**
   * Generate YaadFlex Pay statement
   */
  async getMiniStatement(phone: string, pin: string) {
    // Mock transaction history
    const mockTransactions = [
      { date: '2025-09-25', type: 'Send Money', amount: 'J$2,500', balance: 'J$15,000' },
      { date: '2025-09-24', type: 'Buy Goods', amount: 'J$1,200', balance: 'J$17,500' },
      { date: '2025-09-23', type: 'Deposit', amount: 'J$5,000', balance: 'J$18,700' }
    ];

    return {
      success: true,
      phone: this.formatPhone(phone),
      transactions: mockTransactions,
      message: 'YaadFlex Pay Mini Statement'
    };
  }

  // Helper methods
  private formatPhone(phone: string): string {
    // Format to Caribbean standard (+1876 for Jamaica)
    if (phone.startsWith('876')) return `+1${phone}`;
    if (phone.startsWith('+1')) return phone;
    return `+1876${phone.slice(-7)}`;
  }

  private hashPin(pin: string): string {
    // In real implementation, use proper hashing
    return `hashed_${pin}`;
  }

  private calculateSendMoneyFee(amount: number, currency: 'JMD' | 'USD'): number {
    const feeStructure = YAADFLEX_PAY_FEES.send_money[currency];
    for (const tier of feeStructure) {
      if (amount >= tier.min && amount <= tier.max) {
        return tier.fee;
      }
    }
    return feeStructure[feeStructure.length - 1].fee; // Default to highest tier
  }
}

// API Routes for YaadFlex Pay
export async function registerYaadFlexPay(req: Request, res: Response) {
  try {
    const { phone, preferredBank, pin } = req.body;
    const service = new YaadFlexPayService();
    
    const result = await service.registerUser(phone, preferredBank, pin);
    res.json(result);
  } catch (error) {
    console.error('Error registering YaadFlex Pay user:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
}

export async function sendMoneyYaadFlexPay(req: Request, res: Response) {
  try {
    const { fromPhone, toPhone, amount, currency, pin } = req.body;
    const service = new YaadFlexPayService();
    
    const result = await service.sendMoney(fromPhone, toPhone, amount, currency, pin);
    res.json(result);
  } catch (error) {
    console.error('Error sending money via YaadFlex Pay:', error);
    res.status(500).json({ success: false, error: 'Transfer failed' });
  }
}

export async function payMerchantYaadFlexPay(req: Request, res: Response) {
  try {
    const { customerPhone, merchantCode, amount, currency, pin } = req.body;
    const service = new YaadFlexPayService();
    
    const result = await service.payMerchant(customerPhone, merchantCode, amount, currency, pin);
    res.json(result);
  } catch (error) {
    console.error('Error processing merchant payment:', error);
    res.status(500).json({ success: false, error: 'Payment failed' });
  }
}

export async function depositYaadFlexPay(req: Request, res: Response) {
  try {
    const { phone, amount, currency, bankAccount, preferredBank } = req.body;
    const service = new YaadFlexPayService();
    
    const result = await service.depositMoney(phone, amount, currency, bankAccount, preferredBank);
    res.json(result);
  } catch (error) {
    console.error('Error depositing to YaadFlex Pay:', error);
    res.status(500).json({ success: false, error: 'Deposit failed' });
  }
}

export async function withdrawYaadFlexPay(req: Request, res: Response) {
  try {
    const { phone, amount, currency, bankAccount, preferredBank } = req.body;
    const service = new YaadFlexPayService();
    
    const result = await service.withdrawMoney(phone, amount, currency, bankAccount, preferredBank);
    res.json(result);
  } catch (error) {
    console.error('Error withdrawing from YaadFlex Pay:', error);
    res.status(500).json({ success: false, error: 'Withdrawal failed' });
  }
}

export async function balanceYaadFlexPay(req: Request, res: Response) {
  try {
    const { phone, pin } = req.body;
    const service = new YaadFlexPayService();
    
    const result = await service.checkBalance(phone, pin);
    res.json(result);
  } catch (error) {
    console.error('Error checking YaadFlex Pay balance:', error);
    res.status(500).json({ success: false, error: 'Balance inquiry failed' });
  }
}

export async function statementYaadFlexPay(req: Request, res: Response) {
  try {
    const { phone, pin } = req.body;
    const service = new YaadFlexPayService();
    
    const result = await service.getMiniStatement(phone, pin);
    res.json(result);
  } catch (error) {
    console.error('Error getting YaadFlex Pay statement:', error);
    res.status(500).json({ success: false, error: 'Statement request failed' });
  }
}

export { YAADFLEX_PAY_FEES, BANK_CONFIGS };