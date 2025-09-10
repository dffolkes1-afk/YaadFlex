import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UniversalPayment } from '@/components/UniversalPayment';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, CreditCard, Globe, Shield, CheckCircle, Star,
  Building, Wallet, Smartphone, NfcIcon, TrendingUp
} from 'lucide-react';

export default function UniversalPaymentPage() {
  const [paymentAmount, setPaymentAmount] = useState(25.00);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  const handlePaymentSuccess = (paymentData: any) => {
    toast({
      title: "🎉 Payment Complete!",
      description: `Successfully processed ${paymentData.currency} ${paymentData.amount}`,
    });
    setShowPayment(false);
  };

  const handlePaymentError = (error: any) => {
    toast({
      title: "Payment Error",
      description: "Please try again or contact support",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-6">
            <Zap className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-5xl font-bold mb-4">
              ⚡ Universal Link Payment
            </h1>
            <p className="text-xl opacity-90 mb-6">
              ALL Bank Cards • ANY Bank • INSTANT Speed 🚀
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Pay with ANY card from ANY bank worldwide. Wallet cards, cordless cards, 
              contactless cards - we accept them ALL with lightning-fast processing!
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-yellow-400 text-black text-lg px-4 py-2">
              <Globe className="h-4 w-4 mr-1" />
              ALL Banks Accepted
            </Badge>
            <Badge variant="secondary" className="bg-green-400 text-black text-lg px-4 py-2">
              <Zap className="h-4 w-4 mr-1" />
              Instant Processing
            </Badge>
            <Badge variant="secondary" className="bg-blue-400 text-white text-lg px-4 py-2">
              <Shield className="h-4 w-4 mr-1" />
              100% Secure
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <CreditCard className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <CardTitle className="text-lg">Any Bank Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Visa, Mastercard, Amex, Discover from ANY bank worldwide
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Wallet className="h-12 w-12 mx-auto text-purple-600 mb-2" />
              <CardTitle className="text-lg">Digital Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Apple Pay, Google Pay, Samsung Pay, and all mobile wallets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <NfcIcon className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Contactless</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Tap to pay, cordless cards, NFC payments - all supported
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Zap className="h-12 w-12 mx-auto text-yellow-600 mb-2" />
              <CardTitle className="text-lg">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Instant processing and confirmation - no waiting around
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Payment Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Try Universal Payment</h2>
          <p className="text-gray-600 mb-6">
            Test our system with any card from any bank - see how fast it is!
          </p>
          
          {!showPayment ? (
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="text-center text-xl"
                  data-testid="input-payment-amount"
                />
              </div>
              <Button
                onClick={() => setShowPayment(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg"
                data-testid="button-start-payment"
              >
                ⚡ Start Universal Payment
              </Button>
            </div>
          ) : (
            <UniversalPayment
              amount={paymentAmount}
              currency="USD"
              description="YaadFlex Universal Payment Demo"
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
        </div>

        {/* Supported Banks Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-3">
              <Building className="h-6 w-6 text-blue-600" />
              🏦 Supported Banks & Financial Institutions
            </CardTitle>
            <CardDescription className="text-center">
              We accept cards from thousands of banks worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-blue-600">🇺🇸 US Banks</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Chase Bank
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Bank of America
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Wells Fargo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Citibank
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Capital One
                  </li>
                  <li className="text-gray-500">+ All other US banks</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-600">🌴 Caribbean Banks</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    NCB Jamaica
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Scotiabank Caribbean
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    FirstCaribbean
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    RBTT Bank
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Republic Bank
                  </li>
                  <li className="text-gray-500">+ All Caribbean banks</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3 text-purple-600">🌍 Global Banks</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    European Banks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Asian Banks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    African Banks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Australian Banks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Canadian Banks
                  </li>
                  <li className="text-gray-500">+ Banks worldwide</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg px-6 py-2">
                <Globe className="h-4 w-4 mr-2" />
                5,000+ Banks Supported Worldwide
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Why Universal Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-3">
              <Star className="h-6 w-6 text-yellow-500" />
              🌟 Why Choose Universal Link Payment?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-blue-600">Speed & Convenience</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-yellow-500 mt-1" />
                    <span className="text-sm">Instant payment processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-yellow-500 mt-1" />
                    <span className="text-sm">No waiting for authorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-yellow-500 mt-1" />
                    <span className="text-sm">One-click payment links</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-yellow-500 mt-1" />
                    <span className="text-sm">Mobile-optimized interface</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-600">Universal Acceptance</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span className="text-sm">ANY bank card accepted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span className="text-sm">Wallet cards supported</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span className="text-sm">Contactless/cordless payments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span className="text-sm">Global currency support</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}