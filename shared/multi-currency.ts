// YaadFlex Multi-Currency System - KWD/YFD with Global Payment Methods
// Supporting Visa, MasterCard, AmEx, PayPal, Wise, Revolut, Local Top-ups

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  isActive: boolean;
  isCryptoCurrency: boolean;
  isLocalCurrency: boolean;
  supportedRegions: string[];
  exchangeRateSource: string;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: Date;
  source: string;
  spread: number; // bid-ask spread
  confidence: number; // 0-1, reliability of rate
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'digital_wallet' | 'bank_transfer' | 'mobile_money' | 'crypto' | 'yaad_wallet';
  provider: string;
  supportedCurrencies: string[];
  supportedRegions: string[];
  processingFees: ProcessingFee[];
  icon: string;
  isInstant: boolean;
  requiresVerification: boolean;
  maxTransactionAmount: Record<string, number>;
  features: PaymentFeatures;
}

export interface ProcessingFee {
  currency: string;
  feeStructure: 'percentage' | 'fixed' | 'tiered';
  domesticFee: number;
  internationalFee: number;
  crossCurrencyFee: number;
  minFee?: number;
  maxFee?: number;
}

export interface PaymentFeatures {
  recurringPayments: boolean;
  instantTransfers: boolean;
  disputeProtection: boolean;
  multiCurrency: boolean;
  offlinePayments: boolean;
  contactlessPayments: boolean;
  voicePayments: boolean;
  biometricAuth: boolean;
}

export interface KWDYFDSystem {
  KWD: YaadFlexCurrency;
  YFD: YaadFlexCurrency;
  exchangeRatio: number; // 1 KWD = X YFD
  earnRates: EarnRates;
  spendBonuses: SpendBonuses;
  stakingProgram: StakingProgram;
}

export interface YaadFlexCurrency {
  symbol: string;
  name: string;
  description: string;
  totalSupply: number;
  circulatingSupply: number;
  earningMethods: EarningMethod[];
  spendingOptions: SpendingOption[];
  transferFee: number;
  minimumBalance: number;
}

export interface EarningMethod {
  method: string;
  description: string;
  ratePerAction: number;
  currency: 'KWD' | 'YFD';
  maxPerDay?: number;
  requirements?: string[];
}

export interface SpendingOption {
  category: string;
  description: string;
  discountRate: number;
  currency: 'KWD' | 'YFD';
  minimumSpend: number;
}

export interface EarnRates {
  rideCompleted: { KWD: number; YFD: number };
  deliveryCompleted: { KWD: number; YFD: number };
  marketplacePurchase: { KWD: number; YFD: number };
  referralBonus: { KWD: number; YFD: number };
  culturalEngagement: { KWD: number; YFD: number };
  languageLearning: { KWD: number; YFD: number };
  communitySupport: { KWD: number; YFD: number };
  sustainableActions: { KWD: number; YFD: number };
}

export interface SpendBonuses {
  ridesDiscount: number; // percentage discount when paying with KWD/YFD
  marketplaceBonus: number; // extra YFD when spending KWD on marketplace
  culturalProducts: number; // bonus for cultural authenticity purchases
  localArtisans: number; // extra support for local artisan purchases
  groupBookings: number; // bonus for group activities
  crossBorderPayments: number; // reduced fees for international transactions
}

export interface StakingProgram {
  minimumStake: number;
  currency: 'KWD' | 'YFD';
  rewardRate: number; // annual percentage
  lockupPeriod: number; // days
  earlyWithdrawalPenalty: number;
  stakingTiers: StakingTier[];
}

export interface StakingTier {
  name: string;
  minimumAmount: number;
  rewardMultiplier: number;
  additionalBenefits: string[];
}

export interface CurrencyWallet {
  userId: string;
  balances: Record<string, WalletBalance>;
  preferredCurrency: string;
  autoConvert: boolean;
  autoConvertThreshold: number;
  paymentMethods: UserPaymentMethod[];
  transactionHistory: WalletTransaction[];
}

export interface WalletBalance {
  currency: string;
  available: number;
  pending: number;
  staked: number;
  locked: number;
  lastUpdated: Date;
}

export interface UserPaymentMethod {
  id: string;
  paymentMethodId: string;
  nickname: string;
  isDefault: boolean;
  verificationStatus: 'pending' | 'verified' | 'failed';
  lastUsed: Date;
  metadata: Record<string, any>;
}

export interface WalletTransaction {
  id: string;
  type: 'earn' | 'spend' | 'transfer' | 'convert' | 'stake' | 'unstake';
  amount: number;
  currency: string;
  counterparty?: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  fees: number;
  exchangeRate?: number;
  culturalContext?: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

// Supported currencies
export const SUPPORTED_CURRENCIES: Record<string, Currency> = {
  'KWD': {
    code: 'KWD',
    name: 'YaadFlex Karma Dollars',
    symbol: '♢',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: true,
    isLocalCurrency: true,
    supportedRegions: ['GLOBAL'],
    exchangeRateSource: 'yaadFlex_internal'
  },
  'YFD': {
    code: 'YFD',
    name: 'YaadFlex Dollars',
    symbol: '⚡',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: true,
    isLocalCurrency: true,
    supportedRegions: ['GLOBAL'],
    exchangeRateSource: 'yaadFlex_internal'
  },
  'USD': {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['US', 'GLOBAL'],
    exchangeRateSource: 'xe_api'
  },
  'JMD': {
    code: 'JMD',
    name: 'Jamaican Dollar',
    symbol: 'J$',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['JM'],
    exchangeRateSource: 'central_bank_jamaica'
  },
  'GBP': {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['GB'],
    exchangeRateSource: 'bank_of_england'
  },
  'KES': {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['KE'],
    exchangeRateSource: 'central_bank_kenya'
  },
  'EUR': {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['EU'],
    exchangeRateSource: 'ecb'
  },
  'NGN': {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['NG'],
    exchangeRateSource: 'central_bank_nigeria'
  },
  'GHS': {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: '₵',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['GH'],
    exchangeRateSource: 'bank_of_ghana'
  },
  'INR': {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['IN'],
    exchangeRateSource: 'reserve_bank_india'
  },
  'CAD': {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['CA'],
    exchangeRateSource: 'bank_of_canada'
  },
  'AUD': {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['AU'],
    exchangeRateSource: 'reserve_bank_australia'
  },
  'MXN': {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['MX'],
    exchangeRateSource: 'banco_de_mexico'
  },
  'BRL': {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    decimals: 2,
    isActive: true,
    isCryptoCurrency: false,
    isLocalCurrency: false,
    supportedRegions: ['BR'],
    exchangeRateSource: 'central_bank_brazil'
  }
};

// Global payment methods
export const GLOBAL_PAYMENT_METHODS: Record<string, PaymentMethod> = {
  'visa': {
    id: 'visa',
    name: 'Visa',
    type: 'credit_card',
    provider: 'Visa Inc.',
    supportedCurrencies: ['USD', 'GBP', 'EUR', 'JMD', 'KES', 'KWD', 'YFD'],
    supportedRegions: ['GLOBAL'],
    processingFees: [
      {
        currency: 'USD',
        feeStructure: 'percentage',
        domesticFee: 0.029,
        internationalFee: 0.035,
        crossCurrencyFee: 0.015,
        minFee: 0.30
      }
    ],
    icon: '💳',
    isInstant: true,
    requiresVerification: true,
    maxTransactionAmount: { 'USD': 10000, 'GBP': 8000, 'KWD': 5000 },
    features: {
      recurringPayments: true,
      instantTransfers: true,
      disputeProtection: true,
      multiCurrency: true,
      offlinePayments: true,
      contactlessPayments: true,
      voicePayments: false,
      biometricAuth: true
    }
  },
  'mastercard': {
    id: 'mastercard',
    name: 'MasterCard',
    type: 'credit_card',
    provider: 'MasterCard Inc.',
    supportedCurrencies: ['USD', 'GBP', 'EUR', 'JMD', 'KES', 'KWD', 'YFD'],
    supportedRegions: ['GLOBAL'],
    processingFees: [
      {
        currency: 'USD',
        feeStructure: 'percentage',
        domesticFee: 0.029,
        internationalFee: 0.035,
        crossCurrencyFee: 0.015,
        minFee: 0.30
      }
    ],
    icon: '💳',
    isInstant: true,
    requiresVerification: true,
    maxTransactionAmount: { 'USD': 10000, 'GBP': 8000, 'KWD': 5000 },
    features: {
      recurringPayments: true,
      instantTransfers: true,
      disputeProtection: true,
      multiCurrency: true,
      offlinePayments: true,
      contactlessPayments: true,
      voicePayments: false,
      biometricAuth: true
    }
  },
  'amex': {
    id: 'amex',
    name: 'American Express',
    type: 'credit_card',
    provider: 'American Express',
    supportedCurrencies: ['USD', 'GBP', 'EUR', 'KWD', 'YFD'],
    supportedRegions: ['US', 'GB', 'CA', 'AU'],
    processingFees: [
      {
        currency: 'USD',
        feeStructure: 'percentage',
        domesticFee: 0.035,
        internationalFee: 0.040,
        crossCurrencyFee: 0.020,
        minFee: 0.30
      }
    ],
    icon: '💳',
    isInstant: true,
    requiresVerification: true,
    maxTransactionAmount: { 'USD': 15000, 'GBP': 12000, 'KWD': 8000 },
    features: {
      recurringPayments: true,
      instantTransfers: true,
      disputeProtection: true,
      multiCurrency: true,
      offlinePayments: true,
      contactlessPayments: true,
      voicePayments: false,
      biometricAuth: true
    }
  },
  'paypal': {
    id: 'paypal',
    name: 'PayPal',
    type: 'digital_wallet',
    provider: 'PayPal Inc.',
    supportedCurrencies: ['USD', 'GBP', 'EUR', 'KWD', 'YFD'],
    supportedRegions: ['GLOBAL'],
    processingFees: [
      {
        currency: 'USD',
        feeStructure: 'percentage',
        domesticFee: 0.030,
        internationalFee: 0.045,
        crossCurrencyFee: 0.025,
        minFee: 0.30
      }
    ],
    icon: '💰',
    isInstant: false,
    requiresVerification: true,
    maxTransactionAmount: { 'USD': 60000, 'GBP': 48000, 'KWD': 30000 },
    features: {
      recurringPayments: true,
      instantTransfers: false,
      disputeProtection: true,
      multiCurrency: true,
      offlinePayments: false,
      contactlessPayments: false,
      voicePayments: true,
      biometricAuth: true
    }
  },
  'wise': {
    id: 'wise',
    name: 'Wise',
    type: 'digital_wallet',
    provider: 'Wise Ltd.',
    supportedCurrencies: ['USD', 'GBP', 'EUR', 'JMD', 'KES', 'KWD', 'YFD'],
    supportedRegions: ['GLOBAL'],
    processingFees: [
      {
        currency: 'USD',
        feeStructure: 'percentage',
        domesticFee: 0.010,
        internationalFee: 0.015,
        crossCurrencyFee: 0.005,
        minFee: 0.50
      }
    ],
    icon: '🌍',
    isInstant: false,
    requiresVerification: true,
    maxTransactionAmount: { 'USD': 1000000, 'GBP': 800000, 'KWD': 500000 },
    features: {
      recurringPayments: true,
      instantTransfers: false,
      disputeProtection: false,
      multiCurrency: true,
      offlinePayments: false,
      contactlessPayments: false,
      voicePayments: false,
      biometricAuth: true
    }
  },
  'revolut': {
    id: 'revolut',
    name: 'Revolut',
    type: 'digital_wallet',
    provider: 'Revolut Ltd.',
    supportedCurrencies: ['USD', 'GBP', 'EUR', 'KWD', 'YFD'],
    supportedRegions: ['GB', 'EU', 'US'],
    processingFees: [
      {
        currency: 'USD',
        feeStructure: 'tiered',
        domesticFee: 0.000, // Free for premium users
        internationalFee: 0.015,
        crossCurrencyFee: 0.005,
        minFee: 0.00
      }
    ],
    icon: '🏦',
    isInstant: true,
    requiresVerification: true,
    maxTransactionAmount: { 'USD': 25000, 'GBP': 20000, 'KWD': 12000 },
    features: {
      recurringPayments: true,
      instantTransfers: true,
      disputeProtection: true,
      multiCurrency: true,
      offlinePayments: true,
      contactlessPayments: true,
      voicePayments: false,
      biometricAuth: true
    }
  },
  'mpesa': {
    id: 'mpesa',
    name: 'M-Pesa',
    type: 'mobile_money',
    provider: 'Safaricom',
    supportedCurrencies: ['KES', 'KWD', 'YFD'],
    supportedRegions: ['KE', 'TZ', 'UG'],
    processingFees: [
      {
        currency: 'KES',
        feeStructure: 'tiered',
        domesticFee: 0.015,
        internationalFee: 0.025,
        crossCurrencyFee: 0.020,
        minFee: 1.00
      }
    ],
    icon: '📱',
    isInstant: true,
    requiresVerification: false,
    maxTransactionAmount: { 'KES': 300000, 'KWD': 1500, 'YFD': 3000 },
    features: {
      recurringPayments: true,
      instantTransfers: true,
      disputeProtection: false,
      multiCurrency: false,
      offlinePayments: true,
      contactlessPayments: true,
      voicePayments: true,
      biometricAuth: false
    }
  },
  'yaad_wallet': {
    id: 'yaad_wallet',
    name: 'YaadFlex Wallet',
    type: 'yaad_wallet',
    provider: 'YaadFlex Inc.',
    supportedCurrencies: ['KWD', 'YFD', 'USD', 'GBP', 'EUR', 'JMD', 'KES'],
    supportedRegions: ['GLOBAL'],
    processingFees: [
      {
        currency: 'KWD',
        feeStructure: 'fixed',
        domesticFee: 0.000, // Free for KWD/YFD transactions
        internationalFee: 0.005,
        crossCurrencyFee: 0.010,
        minFee: 0.00,
        maxFee: 0.50
      }
    ],
    icon: '♢',
    isInstant: true,
    requiresVerification: false,
    maxTransactionAmount: { 'KWD': 100000, 'YFD': 200000, 'USD': 50000 },
    features: {
      recurringPayments: true,
      instantTransfers: true,
      disputeProtection: true,
      multiCurrency: true,
      offlinePayments: true,
      contactlessPayments: true,
      voicePayments: true,
      biometricAuth: true
    }
  }
};

// KWD/YFD system configuration
export const KWD_YFD_SYSTEM: KWDYFDSystem = {
  KWD: {
    symbol: '♢',
    name: 'YaadFlex Karma Dollars',
    description: 'Premium rewards currency for cultural engagement and community support',
    totalSupply: 100000000,
    circulatingSupply: 25000000,
    earningMethods: [
      {
        method: 'Complete Ride',
        description: 'Earn KWD for each completed ride as passenger',
        ratePerAction: 0.5,
        currency: 'KWD',
        maxPerDay: 10
      },
      {
        method: 'Cultural Marketplace Purchase',
        description: 'Earn KWD for supporting cultural artisans',
        ratePerAction: 2.0,
        currency: 'KWD',
        maxPerDay: 50
      },
      {
        method: 'Successful Translation',
        description: 'Earn KWD for high-quality translation contributions',
        ratePerAction: 1.0,
        currency: 'KWD',
        maxPerDay: 25
      }
    ],
    spendingOptions: [
      {
        category: 'Ride Discounts',
        description: '10% discount on all rides',
        discountRate: 0.10,
        currency: 'KWD',
        minimumSpend: 5
      },
      {
        category: 'Cultural Products',
        description: '15% discount on authentic cultural items',
        discountRate: 0.15,
        currency: 'KWD',
        minimumSpend: 10
      }
    ],
    transferFee: 0.1,
    minimumBalance: 0
  },
  YFD: {
    symbol: '⚡',
    name: 'YaadFlex Dollars',
    description: 'Utility currency for everyday transactions and app usage',
    totalSupply: 1000000000,
    circulatingSupply: 250000000,
    earningMethods: [
      {
        method: 'Daily App Usage',
        description: 'Earn YFD for daily active usage',
        ratePerAction: 5.0,
        currency: 'YFD',
        maxPerDay: 50
      },
      {
        method: 'Referral Bonus',
        description: 'Earn YFD for successful referrals',
        ratePerAction: 100.0,
        currency: 'YFD'
      },
      {
        method: 'Voice Command Usage',
        description: 'Earn YFD for using accessibility features',
        ratePerAction: 2.0,
        currency: 'YFD',
        maxPerDay: 20
      }
    ],
    spendingOptions: [
      {
        category: 'Transaction Fees',
        description: 'Pay transaction fees with YFD',
        discountRate: 0.00,
        currency: 'YFD',
        minimumSpend: 1
      },
      {
        category: 'Premium Features',
        description: 'Access premium app features',
        discountRate: 0.00,
        currency: 'YFD',
        minimumSpend: 50
      }
    ],
    transferFee: 0.01,
    minimumBalance: 0
  },
  exchangeRatio: 5.0, // 1 KWD = 5 YFD
  earnRates: {
    rideCompleted: { KWD: 0.5, YFD: 2.0 },
    deliveryCompleted: { KWD: 0.3, YFD: 1.5 },
    marketplacePurchase: { KWD: 2.0, YFD: 5.0 },
    referralBonus: { KWD: 5.0, YFD: 25.0 },
    culturalEngagement: { KWD: 1.0, YFD: 3.0 },
    languageLearning: { KWD: 1.5, YFD: 4.0 },
    communitySupport: { KWD: 2.5, YFD: 6.0 },
    sustainableActions: { KWD: 1.2, YFD: 3.5 }
  },
  spendBonuses: {
    ridesDiscount: 0.10,
    marketplaceBonus: 0.15,
    culturalProducts: 0.20,
    localArtisans: 0.25,
    groupBookings: 0.12,
    crossBorderPayments: 0.50
  },
  stakingProgram: {
    minimumStake: 100,
    currency: 'KWD',
    rewardRate: 0.08, // 8% annual
    lockupPeriod: 90, // days
    earlyWithdrawalPenalty: 0.02, // 2%
    stakingTiers: [
      {
        name: 'Community',
        minimumAmount: 100,
        rewardMultiplier: 1.0,
        additionalBenefits: ['Basic rewards tracking']
      },
      {
        name: 'Ambassador',
        minimumAmount: 1000,
        rewardMultiplier: 1.2,
        additionalBenefits: ['Priority support', 'Cultural event access']
      },
      {
        name: 'Cultural Guardian',
        minimumAmount: 5000,
        rewardMultiplier: 1.5,
        additionalBenefits: ['VIP marketplace access', 'Exclusive cultural content', 'Direct artisan connections']
      }
    ]
  }
};

export class MultiCurrencySystem {
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private userWallets: Map<string, CurrencyWallet> = new Map();

  constructor() {
    this.initializeExchangeRates();
  }

  // Currency conversion with real-time rates
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    userId?: string
  ): Promise<CurrencyConversion> {
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        convertedAmount: amount,
        exchangeRate: 1,
        fees: 0,
        totalCost: amount,
        fromCurrency,
        toCurrency,
        timestamp: new Date()
      };
    }

    // Get exchange rate
    const rateKey = `${fromCurrency}_${toCurrency}`;
    const reverseRateKey = `${toCurrency}_${fromCurrency}`;
    
    let exchangeRate = this.exchangeRates.get(rateKey);
    if (!exchangeRate) {
      exchangeRate = this.exchangeRates.get(reverseRateKey);
      if (exchangeRate) {
        exchangeRate = {
          ...exchangeRate,
          rate: 1 / exchangeRate.rate,
          fromCurrency,
          toCurrency
        };
      }
    }

    if (!exchangeRate) {
      // Fetch new exchange rate
      exchangeRate = await this.fetchExchangeRate(fromCurrency, toCurrency);
    }

    // Calculate conversion
    const convertedAmount = amount * exchangeRate.rate;
    
    // Calculate fees
    const fees = this.calculateConversionFees(amount, fromCurrency, toCurrency, userId);
    
    return {
      originalAmount: amount,
      convertedAmount,
      exchangeRate: exchangeRate.rate,
      fees,
      totalCost: convertedAmount + fees,
      fromCurrency,
      toCurrency,
      timestamp: new Date(),
      rateSource: exchangeRate.source,
      rateConfidence: exchangeRate.confidence
    };
  }

  // KWD/YFD earning system
  async earnKWDYFD(
    userId: string,
    action: string,
    metadata?: Record<string, any>
  ): Promise<EarningResult> {
    const wallet = await this.getUserWallet(userId);
    const earnRates = KWD_YFD_SYSTEM.earnRates;
    
    let kwdEarned = 0;
    let yfdEarned = 0;
    let multiplier = 1.0;

    // Determine earning amounts based on action
    switch (action) {
      case 'ride_completed':
        kwdEarned = earnRates.rideCompleted.KWD;
        yfdEarned = earnRates.rideCompleted.YFD;
        break;
      case 'delivery_completed':
        kwdEarned = earnRates.deliveryCompleted.KWD;
        yfdEarned = earnRates.deliveryCompleted.YFD;
        break;
      case 'marketplace_purchase':
        kwdEarned = earnRates.marketplacePurchase.KWD;
        yfdEarned = earnRates.marketplacePurchase.YFD;
        // Cultural product bonus
        if (metadata?.culturalProduct) {
          multiplier = 1.5;
        }
        break;
      case 'referral_bonus':
        kwdEarned = earnRates.referralBonus.KWD;
        yfdEarned = earnRates.referralBonus.YFD;
        break;
      case 'cultural_engagement':
        kwdEarned = earnRates.culturalEngagement.KWD;
        yfdEarned = earnRates.culturalEngagement.YFD;
        break;
      case 'language_learning':
        kwdEarned = earnRates.languageLearning.KWD;
        yfdEarned = earnRates.languageLearning.YFD;
        break;
      case 'community_support':
        kwdEarned = earnRates.communitySupport.KWD;
        yfdEarned = earnRates.communitySupport.YFD;
        break;
      case 'sustainable_actions':
        kwdEarned = earnRates.sustainableActions.KWD;
        yfdEarned = earnRates.sustainableActions.YFD;
        break;
    }

    // Apply multiplier
    kwdEarned *= multiplier;
    yfdEarned *= multiplier;

    // Add to wallet
    if (kwdEarned > 0) {
      await this.addToWallet(userId, 'KWD', kwdEarned, 'earned', action);
    }
    
    if (yfdEarned > 0) {
      await this.addToWallet(userId, 'YFD', yfdEarned, 'earned', action);
    }

    return {
      action,
      kwdEarned,
      yfdEarned,
      multiplier,
      totalKWD: wallet.balances['KWD']?.available + kwdEarned,
      totalYFD: wallet.balances['YFD']?.available + yfdEarned,
      culturalBonus: metadata?.culturalProduct ? true : false
    };
  }

  // Process payment with preferred method
  async processPayment(
    userId: string,
    amount: number,
    currency: string,
    paymentMethodId: string,
    metadata?: PaymentMetadata
  ): Promise<PaymentResult> {
    const wallet = await this.getUserWallet(userId);
    const paymentMethod = GLOBAL_PAYMENT_METHODS[paymentMethodId];
    
    if (!paymentMethod) {
      throw new Error(`Payment method ${paymentMethodId} not found`);
    }

    // Check if currency is supported
    if (!paymentMethod.supportedCurrencies.includes(currency)) {
      throw new Error(`Currency ${currency} not supported by ${paymentMethod.name}`);
    }

    // Calculate fees
    const fees = this.calculatePaymentFees(amount, currency, paymentMethod);
    const totalAmount = amount + fees;

    // Try to use KWD/YFD for discounts
    let discount = 0;
    let discountCurrency = '';
    
    if (metadata?.allowCurrencyDiscount) {
      const kwdBalance = wallet.balances['KWD']?.available || 0;
      const yfdBalance = wallet.balances['YFD']?.available || 0;
      
      // Apply KWD discount if available
      const kwdDiscountAmount = Math.min(kwdBalance, amount * 0.2); // Max 20% discount with KWD
      if (kwdDiscountAmount > 0) {
        discount = kwdDiscountAmount * KWD_YFD_SYSTEM.spendBonuses.ridesDiscount;
        discountCurrency = 'KWD';
      }
    }

    const finalAmount = totalAmount - discount;

    // Process payment
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Record transaction
    const transaction: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'spend',
      amount: finalAmount,
      currency,
      description: metadata?.description || `Payment via ${paymentMethod.name}`,
      status: 'completed',
      fees,
      culturalContext: metadata?.culturalContext,
      timestamp: new Date(),
      metadata: { paymentId, paymentMethodId, originalAmount: amount, discount }
    };

    wallet.transactionHistory.push(transaction);

    return {
      paymentId,
      status: 'completed',
      originalAmount: amount,
      fees,
      discount,
      finalAmount,
      currency,
      paymentMethod: paymentMethod.name,
      culturalBonus: metadata?.culturalContext ? 'Applied cultural discount' : undefined,
      timestamp: new Date()
    };
  }

  // Get user wallet with all balances
  async getUserWallet(userId: string): Promise<CurrencyWallet> {
    let wallet = this.userWallets.get(userId);
    
    if (!wallet) {
      wallet = this.createNewWallet(userId);
      this.userWallets.set(userId, wallet);
    }

    return wallet;
  }

  private createNewWallet(userId: string): CurrencyWallet {
    return {
      userId,
      balances: {
        'KWD': { currency: 'KWD', available: 10, pending: 0, staked: 0, locked: 0, lastUpdated: new Date() }, // Welcome bonus
        'YFD': { currency: 'YFD', available: 50, pending: 0, staked: 0, locked: 0, lastUpdated: new Date() }, // Welcome bonus
        'USD': { currency: 'USD', available: 0, pending: 0, staked: 0, locked: 0, lastUpdated: new Date() },
        'GBP': { currency: 'GBP', available: 0, pending: 0, staked: 0, locked: 0, lastUpdated: new Date() },
        'JMD': { currency: 'JMD', available: 0, pending: 0, staked: 0, locked: 0, lastUpdated: new Date() },
        'KES': { currency: 'KES', available: 0, pending: 0, staked: 0, locked: 0, lastUpdated: new Date() }
      },
      preferredCurrency: 'USD',
      autoConvert: false,
      autoConvertThreshold: 100,
      paymentMethods: [],
      transactionHistory: []
    };
  }

  private async addToWallet(
    userId: string,
    currency: string,
    amount: number,
    type: 'earned' | 'deposited' | 'converted',
    description: string
  ): Promise<void> {
    const wallet = await this.getUserWallet(userId);
    
    if (!wallet.balances[currency]) {
      wallet.balances[currency] = {
        currency,
        available: 0,
        pending: 0,
        staked: 0,
        locked: 0,
        lastUpdated: new Date()
      };
    }

    wallet.balances[currency].available += amount;
    wallet.balances[currency].lastUpdated = new Date();

    // Record transaction
    const transaction: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type === 'earned' ? 'earn' : 'transfer',
      amount,
      currency,
      description,
      status: 'completed',
      fees: 0,
      timestamp: new Date(),
      metadata: { source: type }
    };

    wallet.transactionHistory.push(transaction);
  }

  private initializeExchangeRates(): void {
    // Mock exchange rates - in production would fetch from real API
    const rates = [
      { from: 'USD', to: 'JMD', rate: 150.0 },
      { from: 'USD', to: 'GBP', rate: 0.78 },
      { from: 'USD', to: 'KES', rate: 130.0 },
      { from: 'USD', to: 'EUR', rate: 0.85 },
      { from: 'KWD', to: 'USD', rate: 10.0 }, // 1 KWD = $10 USD
      { from: 'YFD', to: 'USD', rate: 2.0 },   // 1 YFD = $2 USD
      { from: 'KWD', to: 'YFD', rate: 5.0 }    // 1 KWD = 5 YFD
    ];

    rates.forEach(rate => {
      this.exchangeRates.set(`${rate.from}_${rate.to}`, {
        fromCurrency: rate.from,
        toCurrency: rate.to,
        rate: rate.rate,
        lastUpdated: new Date(),
        source: 'yaadFlex_api',
        spread: 0.01,
        confidence: 0.95
      });
    });
  }

  private async fetchExchangeRate(from: string, to: string): Promise<ExchangeRate> {
    // Mock API call - in production would use real exchange rate API
    const mockRate = Math.random() * 2 + 0.5; // Random rate between 0.5 and 2.5
    
    return {
      fromCurrency: from,
      toCurrency: to,
      rate: mockRate,
      lastUpdated: new Date(),
      source: 'external_api',
      spread: 0.02,
      confidence: 0.90
    };
  }

  private calculateConversionFees(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    userId?: string
  ): number {
    // Free conversion for KWD/YFD
    if ((fromCurrency === 'KWD' && toCurrency === 'YFD') ||
        (fromCurrency === 'YFD' && toCurrency === 'KWD')) {
      return 0;
    }

    // Standard conversion fee: 0.5%
    return amount * 0.005;
  }

  private calculatePaymentFees(
    amount: number,
    currency: string,
    paymentMethod: PaymentMethod
  ): number {
    const feeStructure = paymentMethod.processingFees.find(fee => fee.currency === currency) ||
                        paymentMethod.processingFees[0];

    let fee = 0;

    switch (feeStructure.feeStructure) {
      case 'percentage':
        fee = amount * feeStructure.domesticFee;
        break;
      case 'fixed':
        fee = feeStructure.domesticFee;
        break;
      case 'tiered':
        // Simplified tiered calculation
        if (amount < 100) fee = amount * 0.02;
        else if (amount < 1000) fee = amount * 0.015;
        else fee = amount * 0.01;
        break;
    }

    // Apply min/max fee limits
    if (feeStructure.minFee && fee < feeStructure.minFee) {
      fee = feeStructure.minFee;
    }
    if (feeStructure.maxFee && fee > feeStructure.maxFee) {
      fee = feeStructure.maxFee;
    }

    return fee;
  }

  // Utility methods
  getSupportedCurrencies(): Currency[] {
    return Object.values(SUPPORTED_CURRENCIES);
  }

  getPaymentMethods(region?: string): PaymentMethod[] {
    const methods = Object.values(GLOBAL_PAYMENT_METHODS);
    
    if (region) {
      return methods.filter(method => 
        method.supportedRegions.includes(region) || 
        method.supportedRegions.includes('GLOBAL')
      );
    }

    return methods;
  }

  getKWDYFDSystemInfo(): KWDYFDSystem {
    return KWD_YFD_SYSTEM;
  }
}

// Additional interfaces
export interface CurrencyConversion {
  originalAmount: number;
  convertedAmount: number;
  exchangeRate: number;
  fees: number;
  totalCost: number;
  fromCurrency: string;
  toCurrency: string;
  timestamp: Date;
  rateSource?: string;
  rateConfidence?: number;
}

export interface EarningResult {
  action: string;
  kwdEarned: number;
  yfdEarned: number;
  multiplier: number;
  totalKWD: number;
  totalYFD: number;
  culturalBonus: boolean;
}

export interface PaymentResult {
  paymentId: string;
  status: string;
  originalAmount: number;
  fees: number;
  discount: number;
  finalAmount: number;
  currency: string;
  paymentMethod: string;
  culturalBonus?: string;
  timestamp: Date;
}

export interface PaymentMetadata {
  description?: string;
  culturalContext?: string;
  allowCurrencyDiscount?: boolean;
  merchantId?: string;
  orderId?: string;
}

// Export singleton instance
export const multiCurrencySystem = new MultiCurrencySystem();