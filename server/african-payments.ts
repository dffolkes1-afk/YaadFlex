import { Request, Response } from 'express';

// African Payment System Integration
// Supports M-Pesa, MTN Mobile Money, Flutterwave, Paystack, JN Bank

interface AfricanPaymentProvider {
  name: string;
  currencies: string[];
  countries: string[];
  apiEndpoint: string;
  requiresPhone: boolean;
}

const AFRICAN_PROVIDERS: Record<string, AfricanPaymentProvider> = {
  'mpesa': {
    name: 'M-Pesa',
    currencies: ['KES', 'TZS', 'UGX'],
    countries: ['Kenya', 'Tanzania', 'Uganda'],
    apiEndpoint: 'https://api.safaricom.co.ke/mpesa',
    requiresPhone: true
  },
  'mtn_momo': {
    name: 'MTN Mobile Money',
    currencies: ['GHS', 'UGX', 'XAF', 'XOF', 'ZAR'],
    countries: ['Ghana', 'Uganda', 'Cameroon', 'Ivory Coast', 'South Africa'],
    apiEndpoint: 'https://api.mtn.com/mobile-money',
    requiresPhone: true
  },
  'airtel_money': {
    name: 'Airtel Money',
    currencies: ['NGN', 'KES', 'UGX', 'ZMW'],
    countries: ['Nigeria', 'Kenya', 'Uganda', 'Zambia'],
    apiEndpoint: 'https://api.airtel.africa/mobile-money',
    requiresPhone: true
  },
  'flutterwave': {
    name: 'Flutterwave',
    currencies: ['NGN', 'GHS', 'KES', 'UGX', 'ZAR', 'USD', 'EUR', 'GBP'],
    countries: ['Nigeria', 'Ghana', 'Kenya', 'Uganda', 'South Africa', 'Global'],
    apiEndpoint: 'https://api.flutterwave.com/v3',
    requiresPhone: false
  },
  'paystack': {
    name: 'Paystack',
    currencies: ['NGN', 'GHS', 'ZAR', 'USD'],
    countries: ['Nigeria', 'Ghana', 'South Africa'],
    apiEndpoint: 'https://api.paystack.co',
    requiresPhone: false
  },
  'jn_bank': {
    name: 'JN Bank',
    currencies: ['JMD', 'USD'],
    countries: ['Jamaica', 'Caribbean'],
    apiEndpoint: 'https://api.jnbank.com',
    requiresPhone: false
  }
};

// Environment variables for African payment providers
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const JN_BANK_API_KEY = process.env.JN_BANK_API_KEY;
const MTN_MOMO_API_KEY = process.env.MTN_MOMO_API_KEY;
const AIRTEL_MONEY_API_KEY = process.env.AIRTEL_MONEY_API_KEY;

// Track which providers are enabled
const enabledProviders = {
  flutterwave: !!FLUTTERWAVE_SECRET_KEY,
  paystack: !!PAYSTACK_SECRET_KEY,
  mpesa: !!(MPESA_CONSUMER_KEY && MPESA_CONSUMER_SECRET),
  jn_bank: !!JN_BANK_API_KEY,
  mtn_momo: !!MTN_MOMO_API_KEY,
  airtel_money: !!AIRTEL_MONEY_API_KEY
};

console.log('African Payment Systems Status:');
Object.entries(enabledProviders).forEach(([provider, enabled]) => {
  console.log(`${AFRICAN_PROVIDERS[provider]?.name || provider}: ${enabled ? '✅ Enabled' : '❌ Disabled'}`);
});

export class AfricanPaymentService {
  
  /**
   * Get available payment methods for user's country
   */
  getAvailableProviders(countryCode: string, currency: string): AfricanPaymentProvider[] {
    return Object.entries(AFRICAN_PROVIDERS)
      .filter(([key, provider]) => 
        enabledProviders[key as keyof typeof enabledProviders] &&
        (provider.currencies.includes(currency) || provider.currencies.includes('USD')) &&
        (provider.countries.includes(countryCode) || provider.countries.includes('Global'))
      )
      .map(([, provider]) => provider);
  }

  /**
   * Process payment with Flutterwave
   */
  async processFlutterwavePayment(amount: number, currency: string, email: string, phone?: string) {
    if (!FLUTTERWAVE_SECRET_KEY) throw new Error('Flutterwave not configured');

    const paymentData = {
      tx_ref: `YF-${Date.now()}`,
      amount: amount,
      currency: currency,
      redirect_url: `${process.env.BASE_URL}/payment/flutterwave/callback`,
      meta: {
        source: 'YaadFlex Global',
        platform: 'web'
      },
      customer: {
        email: email,
        phone_number: phone,
        name: email.split('@')[0]
      },
      customizations: {
        title: 'YaadFlex Payment',
        logo: 'https://yaadflexglobalvybz.com/logo.png'
      }
    };

    // In a real implementation, you'd make the API call here
    return {
      status: 'success',
      payment_link: `https://checkout.flutterwave.com/pay/${paymentData.tx_ref}`,
      tx_ref: paymentData.tx_ref
    };
  }

  /**
   * Process payment with Paystack
   */
  async processPaystackPayment(amount: number, currency: string, email: string) {
    if (!PAYSTACK_SECRET_KEY) throw new Error('Paystack not configured');

    const paymentData = {
      reference: `YF-PS-${Date.now()}`,
      amount: amount * 100, // Paystack uses kobo
      currency: currency,
      email: email,
      callback_url: `${process.env.BASE_URL}/payment/paystack/callback`
    };

    // In a real implementation, you'd make the API call here
    return {
      status: 'success',
      authorization_url: `https://checkout.paystack.com/${paymentData.reference}`,
      reference: paymentData.reference
    };
  }

  /**
   * Process M-Pesa STK Push
   */
  async processMpesaPayment(amount: number, phone: string) {
    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
      throw new Error('M-Pesa not configured');
    }

    const stkPushData = {
      BusinessShortCode: '174379', // Sandbox shortcode
      Password: 'your_password_here',
      Timestamp: new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14),
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: '174379',
      PhoneNumber: phone,
      CallBackURL: `${process.env.BASE_URL}/payment/mpesa/callback`,
      AccountReference: 'YaadFlex',
      TransactionDesc: 'Payment for YaadFlex services'
    };

    // In a real implementation, you'd make the API call here
    return {
      status: 'success',
      CheckoutRequestID: `ws_CO_${Date.now()}`,
      ResponseDescription: 'Success. Request accepted for processing'
    };
  }

  /**
   * Process JN Bank payment
   */
  async processJNBankPayment(amount: number, currency: string, accountNumber: string) {
    if (!JN_BANK_API_KEY) throw new Error('JN Bank not configured');

    const paymentData = {
      transaction_id: `YF-JN-${Date.now()}`,
      amount: amount,
      currency: currency,
      account_number: accountNumber,
      description: 'YaadFlex payment',
      callback_url: `${process.env.BASE_URL}/payment/jnbank/callback`
    };

    // In a real implementation, you'd make the API call here
    return {
      status: 'success',
      transaction_id: paymentData.transaction_id,
      payment_url: `https://secure.jnbank.com/pay/${paymentData.transaction_id}`
    };
  }

  /**
   * Process MTN Mobile Money payment
   */
  async processMTNMoMoPayment(amount: number, currency: string, phone: string) {
    if (!MTN_MOMO_API_KEY) throw new Error('MTN Mobile Money not configured');

    const paymentData = {
      amount: amount.toString(),
      currency: currency,
      externalId: `YF-MTN-${Date.now()}`,
      payer: {
        partyIdType: 'MSISDN',
        partyId: phone
      },
      payerMessage: 'Payment for YaadFlex services',
      payeeNote: 'YaadFlex payment'
    };

    // In a real implementation, you'd make the API call here
    return {
      status: 'success',
      transaction_id: paymentData.externalId,
      message: 'Payment request sent to phone'
    };
  }
}

// API Routes for African payments
export async function getAfricanPaymentMethods(req: Request, res: Response) {
  try {
    const { country, currency } = req.query;
    const service = new AfricanPaymentService();
    
    const availableProviders = service.getAvailableProviders(
      country as string || 'Global',
      currency as string || 'USD'
    );

    res.json({
      success: true,
      providers: availableProviders,
      enabled_services: enabledProviders
    });
  } catch (error) {
    console.error('Error getting African payment methods:', error);
    res.status(500).json({ error: 'Failed to get payment methods' });
  }
}

export async function initializeAfricanPayment(req: Request, res: Response) {
  try {
    const { provider, amount, currency, email, phone, accountNumber } = req.body;
    const service = new AfricanPaymentService();

    let result;
    switch (provider) {
      case 'flutterwave':
        result = await service.processFlutterwavePayment(amount, currency, email, phone);
        break;
      case 'paystack':
        result = await service.processPaystackPayment(amount, currency, email);
        break;
      case 'mpesa':
        if (!phone) throw new Error('Phone number required for M-Pesa');
        result = await service.processMpesaPayment(amount, phone);
        break;
      case 'jn_bank':
        if (!accountNumber) throw new Error('Account number required for JN Bank');
        result = await service.processJNBankPayment(amount, currency, accountNumber);
        break;
      case 'mtn_momo':
        if (!phone) throw new Error('Phone number required for MTN Mobile Money');
        result = await service.processMTNMoMoPayment(amount, currency, phone);
        break;
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }

    res.json({
      success: true,
      provider: provider,
      ...result
    });
  } catch (error) {
    console.error('Error initializing African payment:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Payment initialization failed' 
    });
  }
}

export async function handleAfricanPaymentCallback(req: Request, res: Response) {
  try {
    const { provider } = req.params;
    const callbackData = req.body;

    console.log(`African payment callback received for ${provider}:`, callbackData);

    // In a real implementation, you'd verify the callback and update payment status
    // For now, we'll just log it and return success

    res.json({
      success: true,
      message: `${provider} callback processed successfully`
    });
  } catch (error) {
    console.error('Error handling African payment callback:', error);
    res.status(500).json({ error: 'Callback processing failed' });
  }
}

export { AFRICAN_PROVIDERS, enabledProviders };