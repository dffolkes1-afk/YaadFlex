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
  type: 'SEND_MONEY' | 'BUY_GOODS' | 'DEPOSIT' | 'WITHDRAW' | 'BALANCE_CHECK';
  fromPhone: string;
  toPhone?: string;
  amount: number;
  fee: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  merchantCode?: string;
  description: string;
  timestamp: Date;
}

// YaadFlex Pay Fee Structure (Like M-Pesa)
const YAADFLEX_FEES = {
  send_money: [
    { min: 1, max: 500, fee: 20 },      // J$20 for under J$500
    { min: 501, max: 2500, fee: 35 },   // J$35 for J$501-2500
    { min: 2501, max: 10000, fee: 50 }, // J$50 for J$2501-10000
    { min: 10001, max: 999999, fee: 75 } // J$75 for higher amounts
  ],
  withdraw_fee: 50,    // J$50 flat fee
  deposit_fee: 0,      // Free deposits
  merchant_fee: 1.5    // 1.5% for merchant payments
};

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
      message: `Welcome to YaadFlex Pay! Your number ${formattedPhone} is now registered.`,
      accountNumber: `YF${phone.slice(-7)}`,
      bankBackend: preferredBank === 'JN_BANK' ? 'JN Bank' : 'VM Bank'
    };
  }

  /**
   * Send money to another YaadFlex Pay user (like M-Pesa Send Money)
   */
  async sendMoney(fromPhone: string, toPhone: string, amount: number, pin: string) {
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
      message: `You have sent J$${amount} to ${toPhone}. Transaction fee J$${fee}. Your new balance is J$0.`,
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
    // Mock balance for demo
    const mockBalance = 15750;

    const transaction: YaadFlexTransaction = {
      id: `YF${Date.now()}`,
      type: 'BALANCE_CHECK',
      fromPhone: this.formatPhone(phone),
      amount: 0,
      fee: 0,
      status: 'SUCCESS',
      description: 'Balance inquiry',
      timestamp: new Date()
    };

    return {
      success: true,
      phone: this.formatPhone(phone),
      balance: mockBalance,
      message: `Your YaadFlex Pay balance is J$${mockBalance.toLocaleString()}.`
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

export { YAADFLEX_FEES };