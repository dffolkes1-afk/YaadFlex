# African Payment Systems Setup Guide for YaadFlex

## 🌍 Available Payment Methods

Your YaadFlex platform now supports the following African and Caribbean payment systems:

### Mobile Money Systems
- **M-Pesa** (Kenya, Tanzania, Uganda)
- **MTN Mobile Money** (Ghana, Uganda, Cameroon, Ivory Coast, South Africa)
- **Airtel Money** (Nigeria, Kenya, Uganda, Zambia)

### Payment Gateways  
- **Flutterwave** (Pan-African - 150+ currencies)
- **Paystack** (Nigeria, Ghana, South Africa)

### Caribbean Banking
- **JN Bank** (Jamaica - Caribbean diaspora market)

## 🔑 Required Environment Variables

Add these to your Replit secrets to enable each payment method:

### Flutterwave (Recommended - Supports most countries)
```
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key_here
```

### Paystack (Nigeria, Ghana, South Africa)
```
PAYSTACK_SECRET_KEY=your_paystack_secret_key_here
```

### M-Pesa (Kenya, Tanzania)
```
MPESA_CONSUMER_KEY=your_mpesa_consumer_key_here
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret_here
```

### JN Bank (Jamaica/Caribbean)
```
JN_BANK_API_KEY=your_jn_bank_api_key_here
```

### MTN Mobile Money
```
MTN_MOMO_API_KEY=your_mtn_momo_api_key_here
```

### Airtel Money
```
AIRTEL_MONEY_API_KEY=your_airtel_money_api_key_here
```

## 📱 API Endpoints Now Available

### Get Available Payment Methods
```
GET /api/african-payments/methods?country=NG&currency=NGN
```

### Initialize Payment
```
POST /api/african-payments/initialize
{
  "provider": "flutterwave",
  "amount": 5000,
  "currency": "NGN", 
  "email": "customer@example.com",
  "phone": "+2348123456789"
}
```

### Payment Callbacks
```
POST /api/african-payments/callback/:provider
```

## 🚀 Quick Start for Drop Shipping

1. **Start with Flutterwave** - supports most African countries
2. **Add Paystack** for Nigeria market specifically  
3. **Add M-Pesa** for East Africa (Kenya/Tanzania)
4. **Add JN Bank** for Caribbean diaspora customers

## 💰 Competitive Rates

- **Flutterwave**: ~3.8% + ₦50 per transaction
- **Paystack**: ~1.5% + ₦100 per transaction  
- **M-Pesa**: ~1-2% per transaction
- **JN Bank**: Competitive Caribbean rates

Your YaadFlex clothing line can now accept payments from customers across Africa and the Caribbean! 🎉