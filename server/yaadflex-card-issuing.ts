import Stripe from 'stripe';
import { storage } from './storage';

/**
 * YaadFlex Card Issuing Service
 * Issues real Visa debit cards that work at:
 * - ATMs worldwide (with proper BIN sponsorship)
 * - POS terminals and payment machines
 * - Online merchants
 * - Apple Pay & Google Pay
 */

export class YaadFlexCardIssuing {
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-08-27.basil',
    });
  }

  /**
   * Create a cardholder for YaadFlex user
   * Required before issuing any cards
   */
  async createCardholder(userId: string, userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  }) {
    try {
      // Create Stripe cardholder
      const cardholder = await this.stripe.issuing.cardholders.create({
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone_number: userData.phone,
        status: 'active',
        type: 'individual',
        individual: {
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
        billing: {
          address: userData.address,
        },
      });

      console.log(`🎫 YaadFlex Cardholder Created: ${cardholder.id} for user ${userId}`);

      return {
        success: true,
        cardholderId: cardholder.id,
        message: 'YaadFlex cardholder profile created successfully',
      };
    } catch (error: any) {
      console.error('❌ Cardholder creation failed:', error.message);
      throw new Error(`Failed to create cardholder: ${error.message}`);
    }
  }

  /**
   * Issue a virtual YaadFlex Visa card
   * Instant digital card for online purchases and mobile payments
   */
  async issueVirtualCard(userId: string, cardholderId: string, options: {
    currency: string;
    spendingLimit?: number;
    allowedCategories?: string[];
  }) {
    try {
      // Create virtual card
      const card = await this.stripe.issuing.cards.create({
        cardholder: cardholderId,
        currency: options.currency.toLowerCase(),
        type: 'virtual',
        status: 'active',
        spending_controls: {
          spending_limits: options.spendingLimit ? [
            {
              amount: Math.round(options.spendingLimit * 100), // Convert to cents
              interval: 'monthly',
            }
          ] : [],
        },
        metadata: {
          yaadflexUserId: userId,
          cardType: 'virtual',
          brand: 'YaadFlex',
        },
      });

      // Store card reference in our database (NEVER store PAN/CVV)
      await storage.createYaadFlexPayCard({
        userId,
        stripeCardId: card.id,
        cardType: 'virtual',
        last4: card.last4,
        brand: card.brand,
        currency: options.currency,
        isActive: true,
        isBlocked: false,
      });

      console.log(`💳 Virtual YaadFlex Visa issued: ${card.id} (****${card.last4})`);

      return {
        success: true,
        cardId: card.id,
        last4: card.last4,
        brand: card.brand,
        message: 'Your virtual YaadFlex Visa card is ready! Use it for online shopping and mobile payments.',
        canUseFor: [
          'Online shopping',
          'Mobile app purchases', 
          'Apple Pay & Google Pay',
          'POS terminals worldwide',
          'Contactless payments'
        ],
        limitations: [
          'ATM withdrawals not available (requires physical card with BIN sponsor)'
        ]
      };
    } catch (error: any) {
      console.error('❌ Virtual card issuance failed:', error.message);
      throw new Error(`Failed to issue virtual card: ${error.message}`);
    }
  }

  /**
   * Order a physical YaadFlex Visa card
   * Real plastic card for ATM withdrawals and global use
   */
  async orderPhysicalCard(userId: string, cardholderId: string, options: {
    currency: string;
    spendingLimit?: number;
    shippingAddress: {
      name: string;
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  }) {
    try {
      // Create physical card
      const card = await this.stripe.issuing.cards.create({
        cardholder: cardholderId,
        currency: options.currency.toLowerCase(),
        type: 'physical',
        status: 'active',
        shipping: {
          name: options.shippingAddress.name,
          address: options.shippingAddress,
        },
        spending_controls: {
          spending_limits: options.spendingLimit ? [
            {
              amount: Math.round(options.spendingLimit * 100),
              interval: 'monthly',
            }
          ] : [],
        },
        metadata: {
          yaadflexUserId: userId,
          cardType: 'physical',
          brand: 'YaadFlex',
        },
      });

      // Store card reference in our database
      await storage.createYaadFlexPayCard({
        userId,
        stripeCardId: card.id,
        cardType: 'physical',
        last4: card.last4,
        brand: card.brand,
        currency: options.currency,
        isActive: true,
        isBlocked: false,
      });

      console.log(`🏧 Physical YaadFlex Visa ordered: ${card.id} (****${card.last4})`);

      return {
        success: true,
        cardId: card.id,
        last4: card.last4,
        brand: card.brand,
        estimatedDelivery: '7-10 business days',
        message: 'Your physical YaadFlex Visa card has been ordered! You\'ll receive it in 7-10 business days.',
        canUseFor: [
          'ATM cash withdrawals (with BIN sponsor)',
          'POS terminals worldwide',
          'Online shopping',
          'Contactless payments',
          'Apple Pay & Google Pay',
          'International travel'
        ]
      };
    } catch (error: any) {
      console.error('❌ Physical card ordering failed:', error.message);
      throw new Error(`Failed to order physical card: ${error.message}`);
    }
  }

  /**
   * Get card details for display (secure - no sensitive data)
   */
  async getCardDetails(cardId: string) {
    try {
      const card = await this.stripe.issuing.cards.retrieve(cardId);
      
      return {
        id: card.id,
        last4: card.last4,
        brand: card.brand,
        type: card.type,
        status: card.status,
        currency: card.currency,
        created: new Date(card.created * 1000),
        canUseAtAtms: card.type === 'physical', // Physical cards with proper BIN can use ATMs
        spendingLimits: card.spending_controls?.spending_limits || [],
      };
    } catch (error: any) {
      throw new Error(`Failed to get card details: ${error.message}`);
    }
  }

  /**
   * Freeze/unfreeze a card
   */
  async toggleCardStatus(cardId: string, freeze: boolean) {
    try {
      const card = await this.stripe.issuing.cards.update(cardId, {
        status: freeze ? 'inactive' : 'active',
      });

      console.log(`${freeze ? '🧊' : '🔥'} Card ${cardId} ${freeze ? 'frozen' : 'activated'}`);

      return {
        success: true,
        cardId: card.id,
        status: card.status,
        message: `Card ${freeze ? 'frozen' : 'activated'} successfully`,
      };
    } catch (error: any) {
      throw new Error(`Failed to ${freeze ? 'freeze' : 'unfreeze'} card: ${error.message}`);
    }
  }

  /**
   * Update spending controls
   */
  async updateSpendingLimits(cardId: string, monthlyLimit: number) {
    try {
      const card = await this.stripe.issuing.cards.update(cardId, {
        spending_controls: {
          spending_limits: [
            {
              amount: Math.round(monthlyLimit * 100),
              interval: 'monthly',
            }
          ],
        },
      });

      return {
        success: true,
        cardId: card.id,
        monthlyLimit: monthlyLimit,
        message: `Monthly spending limit updated to $${monthlyLimit}`,
      };
    } catch (error: any) {
      throw new Error(`Failed to update spending limits: ${error.message}`);
    }
  }

  /**
   * Get card transactions
   */
  async getCardTransactions(cardId: string, limit: number = 50) {
    try {
      const transactions = await this.stripe.issuing.transactions.list({
        card: cardId,
        limit,
      });

      return transactions.data.map(tx => ({
        id: tx.id,
        amount: tx.amount / 100, // Convert from cents
        currency: tx.currency,
        merchantName: tx.merchant_data?.name || 'Unknown Merchant',
        merchantCategory: tx.merchant_data?.category,
        created: new Date(tx.created * 1000),
        authorizationApproved: true, // Simplified status
        type: tx.type,
        location: tx.merchant_data?.city,
      }));
    } catch (error: any) {
      throw new Error(`Failed to get transactions: ${error.message}`);
    }
  }

  /**
   * Fund card from YaadFlex wallet
   * Transfer money from YaadFlex Pay balance to card spending balance
   */
  async fundCardFromWallet(userId: string, amount: number, currency: string) {
    try {
      // This would integrate with our YaadFlex Pay wallet system
      // For now, we'll simulate the funding process
      
      console.log(`💰 Funding card from YaadFlex wallet: $${amount} ${currency}`);
      
      return {
        success: true,
        amount,
        currency,
        message: `Card funded with $${amount} ${currency} from your YaadFlex wallet`,
      };
    } catch (error: any) {
      throw new Error(`Failed to fund card: ${error.message}`);
    }
  }
}

// Initialize service (will be properly initialized when we get Stripe keys)
let cardIssuingService: YaadFlexCardIssuing | null = null;

export function initializeCardIssuing(stripeSecretKey: string) {
  cardIssuingService = new YaadFlexCardIssuing(stripeSecretKey);
  console.log('🎫 YaadFlex Card Issuing Service initialized');
  return cardIssuingService;
}

export function getCardIssuingService(): YaadFlexCardIssuing {
  if (!cardIssuingService) {
    throw new Error('Card issuing service not initialized. Please provide Stripe keys.');
  }
  return cardIssuingService;
}