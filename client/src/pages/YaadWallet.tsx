import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, Send, ArrowDownToLine, ArrowUpFromLine, CreditCard, 
  DollarSign, Users, Globe, Zap, QrCode, Phone, Mail,
  TrendingUp, Shield, Clock, Plus, Minus, Eye, EyeOff, Banknote, Coins
} from 'lucide-react';
import YFDCurrency from '@/components/YFDCurrency';
import YFDCoins from '@/components/YFDCoins';
import MiniCoinFlip from '@/components/MiniCoinFlip';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'ride' | 'job' | 'topup';
  amount: number;
  currency: 'JMD' | 'USD' | 'KWD' | 'YFD';
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  from?: string;
  to?: string;
}

export default function YaadWallet() {
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(true);
  const [sendAmount, setSendAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendCurrency, setSendCurrency] = useState('JMD');
  const [quickAmount, setQuickAmount] = useState('');

  // Wallet balances in different currencies
  const balances = {
    JMD: 45750.00,
    USD: 285.50,
    KWD: 95.25,
    YFD: 2000.00  // YaadFlex Digital - The global currency
  };

  // Exchange rates (1 YFD = X currency)
  const exchangeRates = {
    USD: 0.0075,  // 1 YFD = $0.0075 USD (2000 YFD = $15 USD)
    JMD: 1.15,    // 1 YFD = $1.15 JMD
    EUR: 0.0068,  // 1 YFD = €0.0068 EUR
    GBP: 0.0058   // 1 YFD = £0.0058 GBP
  };

  // Calculate YFD value in other currencies
  const yfdValueInUSD = (balances.YFD * exchangeRates.USD).toFixed(2);
  const yfdValueInJMD = (balances.YFD * exchangeRates.JMD).toFixed(2);

  // Recent transactions
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'receive',
      amount: 450,
      currency: 'YFD',
      description: 'YaadFlex Ride Earnings (85% driver share)',
      timestamp: '2 minutes ago',
      status: 'completed',
      from: 'Trip #YF2024'
    },
    {
      id: '2', 
      type: 'send',
      amount: 200,
      currency: 'YFD',
      description: 'Sent to family member',
      timestamp: '1 hour ago',
      status: 'completed',
      to: 'marcus.family@yaad.flex'
    },
    {
      id: '3',
      type: 'job',
      amount: 850,
      currency: 'YFD',
      description: 'Freelance Work Payment ($6.38 USD)',
      timestamp: '3 hours ago',
      status: 'completed'
    },
    {
      id: '4',
      type: 'receive',
      amount: 1200,
      currency: 'YFD',
      description: 'Shop Sales Today ($9.00 USD)',
      timestamp: '5 hours ago',
      status: 'completed'
    },
    {
      id: '5',
      type: 'topup',
      amount: 500,
      currency: 'YFD',
      description: 'Added funds from bank',
      timestamp: '1 day ago',
      status: 'completed'
    }
  ];

  const handleQuickSend = (amount: string) => {
    if (!sendTo) {
      toast({
        title: "Enter Recipient",
        description: "Please enter who you want to send money to",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "💸 Money Sent!",
      description: `Sent ${amount} ${sendCurrency} to ${sendTo} - As easy as email!`,
    });
    setSendTo('');
    setQuickAmount('');
  };

  const handleEmailSend = () => {
    if (!sendAmount || !sendTo) {
      toast({
        title: "Missing Info",
        description: "Enter amount and recipient (email, phone, or @username)",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "💰 Money Sent Like Email!",
      description: `Sent ${sendAmount} ${sendCurrency} to ${sendTo}`,
    });
    setSendAmount('');
    setSendTo('');
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'USD': return '🇺🇸';
      case 'JMD': return '🇯🇲';
      case 'KWD': return '🇰🇼';
      case 'YFD': return '🌍';
      default: return '💰';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpFromLine className="h-4 w-4 text-red-500" />;
      case 'receive': return <ArrowDownToLine className="h-4 w-4 text-green-500" />;
      case 'ride': return <ArrowDownToLine className="h-4 w-4 text-blue-500" />;
      case 'job': return <ArrowDownToLine className="h-4 w-4 text-purple-500" />;
      case 'topup': return <Plus className="h-4 w-4 text-green-600" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent mb-2">
            💼 YaadFlex Bank
          </h1>
          <p className="text-xl text-gray-600">
            Your pocket bank - Send money as easy as email!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Balance Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Balance Display */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-6 w-6" />
                    Total Balance
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-2">
                  <MiniCoinFlip 
                    value={balances.YFD.toLocaleString()} 
                    currency="YFD"
                    color="from-green-500 to-yellow-500"
                    size="w-20 h-20"
                  />
                  <div className="text-3xl font-bold">
                    {showBalance ? `${balances.YFD.toLocaleString()} YFD` : '••••••'}
                  </div>
                </div>
                <div className="text-lg opacity-90 mb-4">
                  Worth: ${yfdValueInUSD} USD • J${yfdValueInJMD} JMD
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(balances).map(([currency, amount]) => (
                    <div key={currency} className="text-center">
                      <div className="text-2xl mb-1">{getCurrencyIcon(currency)}</div>
                      <div className="text-sm opacity-90">{currency}</div>
                      <div className="font-semibold">
                        {showBalance ? amount.toLocaleString() : '••••'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* YFD Exchange Rate Display */}
            <Card className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-950 dark:to-yellow-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  YFD Exchange Rates
                </CardTitle>
                <CardDescription>
                  Real value of YaadFlex Digital currency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">1 YFD =</div>
                    <div className="text-xl font-bold">${exchangeRates.USD} USD</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">1 YFD =</div>
                    <div className="text-xl font-bold">J${exchangeRates.JMD} JMD</div>
                  </div>
                </div>
                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                  <div className="text-sm font-medium mb-2">Worker Earnings Example:</div>
                  <div className="space-y-1 text-sm">
                    <div>• Driver earns 500 YFD/day = ${(500 * exchangeRates.USD).toFixed(2)} USD</div>
                    <div>• Developer earns 5000 YFD/week = ${(5000 * exchangeRates.USD).toFixed(2)} USD</div>
                    <div>• Shop owner earns 10000 YFD/month = ${(10000 * exchangeRates.USD).toFixed(2)} USD</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-all cursor-pointer bg-green-50">
                <CardContent className="p-4 text-center">
                  <Send className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium text-green-700">Send Money</div>
                  <div className="text-xs text-green-600">Like Email</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all cursor-pointer bg-blue-50">
                <CardContent className="p-4 text-center">
                  <QrCode className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium text-blue-700">Scan & Pay</div>
                  <div className="text-xs text-blue-600">Instant</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all cursor-pointer bg-purple-50">
                <CardContent className="p-4 text-center">
                  <Plus className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium text-purple-700">Add Money</div>
                  <div className="text-xs text-purple-600">Top Up</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all cursor-pointer bg-orange-50">
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="font-medium text-orange-700">Pay Bills</div>
                  <div className="text-xs text-orange-600">Utilities</div>
                </CardContent>
              </Card>
            </div>

            {/* Send Money - Email Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Money (Email Style)
                </CardTitle>
                <CardDescription>
                  Send to email, phone number, or @username - as simple as sending an email!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="send-to">To: (Email, Phone, or @Username)</Label>
                    <Input
                      id="send-to"
                      placeholder="user@email.com, +876-123-4567, or @username"
                      value={sendTo}
                      onChange={(e) => setSendTo(e.target.value)}
                      data-testid="input-send-to"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <div className="flex gap-2">
                      <Input
                        id="amount"
                        placeholder="0.00"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className="flex-1"
                        data-testid="input-send-amount"
                      />
                      <Select value={sendCurrency} onValueChange={setSendCurrency}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JMD">🇯🇲 JMD</SelectItem>
                          <SelectItem value="USD">🇺🇸 USD</SelectItem>
                          <SelectItem value="KWD">🇰🇼 KWD</SelectItem>
                          <SelectItem value="YFD">🌍 YFD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 mr-2">Quick amounts:</span>
                  {['100', '500', '1000', '5000'].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setSendAmount(amount)}
                      data-testid={`button-quick-${amount}`}
                    >
                      {amount} {sendCurrency}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  onClick={handleEmailSend}
                  className="w-full bg-green-600 hover:bg-green-700"
                  data-testid="button-send-money"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Money (Like Email!)
                </Button>
              </CardContent>
            </Card>

            {/* Cash Pocket Buttons */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Zap className="h-5 w-5" />
                  💰 Cash Pocket Buttons
                </CardTitle>
                <CardDescription>
                  Instant one-tap payments for common amounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {['50', '100', '200', '500', '1000', '2000'].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="h-16 flex-col bg-yellow-100 hover:bg-yellow-200 border-yellow-300"
                      onClick={() => handleQuickSend(amount)}
                      data-testid={`cash-pocket-${amount}`}
                    >
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="font-bold text-yellow-800">{amount}</span>
                      <span className="text-xs text-yellow-600">JMD</span>
                    </Button>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Input
                    placeholder="Enter custom amount"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    className="max-w-xs mx-auto mb-2"
                    data-testid="input-custom-amount"
                  />
                  <Button
                    onClick={() => handleQuickSend(quickAmount)}
                    disabled={!quickAmount}
                    className="bg-orange-500 hover:bg-orange-600"
                    data-testid="button-send-custom"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Cash Pocket Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Money Sent</span>
                  <span className="font-semibold text-red-600">-$125.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Money Received</span>
                  <span className="font-semibold text-green-600">+$2,550.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ride Earnings</span>
                  <span className="font-semibold text-blue-600">+$850.25</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {transactions.slice(0, 6).map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {tx.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tx.timestamp}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${
                        tx.type === 'send' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {tx.type === 'send' ? '-' : '+'}
                        {tx.amount.toLocaleString()} {tx.currency}
                      </div>
                      <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-4">
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Global Features */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Globe className="h-5 w-5" />
                  🌍 Global Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span>Real-time exchange rates</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>Send to any country</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span>Instant transactions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* YFD Currency Display Section */}
        <div className="mt-12 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Banknote className="h-6 w-6" />
                YaadFlex Dollar (YFD) - Our Heroes, Our Currency
              </CardTitle>
              <CardDescription>
                Celebrating Jamaican National Heroes and African Unity Leaders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YFDCurrency />
            </CardContent>
          </Card>

          {/* YFD Coins Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Coins className="h-6 w-6" />
                YFD Coins - From Cents to Sovereigns
              </CardTitle>
              <CardDescription>
                Each coin carries our heritage, from hummingbirds to the Lion of Judah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YFDCoins />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}