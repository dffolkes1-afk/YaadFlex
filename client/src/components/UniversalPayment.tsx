import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, Wallet, Zap, Shield, CheckCircle, Globe,
  Smartphone, NfcIcon, QrCode, Building, Banknote, Star
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'wallet' | 'bank' | 'crypto';
  icon: React.ReactNode;
  supported: boolean;
  processingTime: string;
}

interface UniversalPaymentProps {
  amount: number;
  currency: string;
  description: string;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: any) => void;
}

export function UniversalPayment({ 
  amount, 
  currency = 'USD', 
  description,
  onPaymentSuccess,
  onPaymentError 
}: UniversalPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('universal-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const { toast } = useToast();

  // Universal payment methods - ALL BANKS ACCEPTED!
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'universal-card',
      name: 'ANY Bank Card',
      type: 'card',
      icon: <CreditCard className="h-5 w-5" />,
      supported: true,
      processingTime: 'Instant'
    },
    {
      id: 'visa',
      name: 'Visa (All Banks)',
      type: 'card',
      icon: <CreditCard className="h-5 w-5 text-blue-600" />,
      supported: true,
      processingTime: 'Instant'
    },
    {
      id: 'mastercard',
      name: 'Mastercard (All Banks)',
      type: 'card',
      icon: <CreditCard className="h-5 w-5 text-red-600" />,
      supported: true,
      processingTime: 'Instant'
    },
    {
      id: 'amex',
      name: 'American Express',
      type: 'card',
      icon: <CreditCard className="h-5 w-5 text-green-600" />,
      supported: true,
      processingTime: 'Instant'
    },
    {
      id: 'discover',
      name: 'Discover',
      type: 'card',
      icon: <CreditCard className="h-5 w-5 text-orange-600" />,
      supported: true,
      processingTime: 'Instant'
    },
    {
      id: 'digital-wallet',
      name: 'Digital Wallets',
      type: 'wallet',
      icon: <Wallet className="h-5 w-5 text-purple-600" />,
      supported: true,
      processingTime: 'Instant'
    },
    {
      id: 'contactless',
      name: 'Contactless/Cordless',
      type: 'card',
      icon: <NfcIcon className="h-5 w-5 text-green-500" />,
      supported: true,
      processingTime: 'Instant'
    },
    {
      id: 'mobile-money',
      name: 'Mobile Money',
      type: 'wallet',
      icon: <Smartphone className="h-5 w-5 text-blue-500" />,
      supported: true,
      processingTime: 'Instant'
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        amount,
        currency,
        method: selectedMethod,
        cardNumber: cardNumber.slice(-4),
        transactionId: `yaad_${Date.now()}`,
        status: 'completed'
      };

      toast({
        title: "🎉 Payment Successful!",
        description: `${currency} ${amount} paid successfully with your ${selectedMethod} card!`,
      });

      onPaymentSuccess?.(paymentData);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method.",
        variant: "destructive",
      });
      onPaymentError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-yellow-500" />
          ⚡ Universal Link Payment
        </CardTitle>
        <CardDescription>
          Pay with ANY bank card, wallet card, or cordless card - SPEED guaranteed!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Payment Amount */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600">
            {currency} {amount.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>

        {/* Universal Acceptance Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="h-5 w-5" />
            <span className="font-bold">UNIVERSAL ACCEPTANCE</span>
          </div>
          <div className="text-center text-sm">
            ✅ ALL Bank Cards ✅ ANY Bank ✅ Wallet Cards ✅ Cordless Cards ✅ Instant Speed
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Choose Payment Method</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                data-testid={`payment-method-${method.id}`}
              >
                <div className="flex flex-col items-center gap-2">
                  {method.icon}
                  <span className="text-xs font-medium text-center">{method.name}</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    {method.processingTime}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Card Details Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                data-testid="input-card-number"
              />
              <div className="text-xs text-gray-500 mt-1">
                Accepts cards from ANY bank worldwide
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                  data-testid="input-expiry-date"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                  data-testid="input-cvv"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="Name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                data-testid="input-card-name"
              />
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Shield className="h-4 w-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Zap className="h-4 w-4" />
            <span>Instant</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <Globe className="h-4 w-4" />
            <span>Global</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <Star className="h-4 w-4" />
            <span>Any Bank</span>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !cardNumber || !expiryDate || !cvv || !cardName}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-6"
          data-testid="button-pay-now"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Processing Payment...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Pay {currency} {amount.toFixed(2)} - INSTANT
            </div>
          )}
        </Button>

        {/* Supported Banks Banner */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <div className="font-semibold text-gray-700 mb-2">
              🏦 SUPPORTED BANKS & CARDS
            </div>
            <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-2">
              <span>✅ Chase</span>
              <span>✅ Bank of America</span>
              <span>✅ Wells Fargo</span>
              <span>✅ Citibank</span>
              <span>✅ Capital One</span>
              <span>✅ ALL Caribbean Banks</span>
              <span>✅ ALL European Banks</span>
              <span>✅ ALL Asian Banks</span>
              <span>✅ ALL Digital Wallets</span>
            </div>
            <div className="mt-2 text-xs text-green-600 font-medium">
              + Thousands more banks worldwide!
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}