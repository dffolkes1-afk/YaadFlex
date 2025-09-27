import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Wallet, Send, ArrowDownToLine, ArrowUpFromLine, CreditCard, 
  DollarSign, Users, Globe, Zap, QrCode, Phone, Mail,
  TrendingUp, Shield, Clock, Plus, Minus, Eye, EyeOff, Banknote, Coins,
  Gift, Star, Trophy, Target, Building, Plane
} from 'lucide-react';
import YFDCurrency from '@/components/YFDCurrency';
import YFDCoins from '@/components/YFDCoins';
import MiniCoinFlip from '@/components/MiniCoinFlip';
import RealisticYFDCurrency from '@/components/RealisticYFDCurrency';
import PhoneValueSection from '@/components/PhoneValueSection';
import YaadFlexLogo from '@assets/generated_images/YaadFlex_Bank_logo_09b86b5e.png';

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

// Promotional Credits Component
function PromoCreditsSection() {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  
  // Fetch active promotional campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['/api/promo/campaigns'],
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Fetch user's promotional wallets
  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ['/api/promo/wallets']
  });
  
  // Get campaign tasks
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/promo/tasks', selectedCampaign],
    enabled: !!selectedCampaign
  });
  
  // Welcome bonus claim mutation
  const claimWelcomeMutation = useMutation({
    mutationFn: (campaignId: string) => 
      apiRequest(`/api/promo/claim-welcome`, 'POST', { campaignId }),
    onSuccess: (data: any) => {
      toast({
        title: "🎉 Welcome Bonus Claimed!",
        description: `You've received ${data?.amount || '$50'} promotional credits!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/promo/wallets'] });
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Unable to claim welcome bonus",
        variant: "destructive"
      });
    }
  });
  
  // Calculate total promotional balance
  const walletsArray = Array.isArray(wallets) ? wallets : [];
  const totalPromoBalance = walletsArray.reduce((total: number, wallet: any) => 
    total + parseFloat(wallet.balance || '0'), 0);
  
  // Find the launch campaign
  const campaignsArray = Array.isArray(campaigns) ? campaigns : [];
  const launchCampaign = campaignsArray.find((c: any) => 
    c.name?.toLowerCase().includes('launch') || c.name?.toLowerCase().includes('welcome')
  );
  
  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white border-2 border-emerald-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Gift className="h-8 w-8" />
            🎁 YaadFlex Launch Credits
          </CardTitle>
          <CardDescription className="text-emerald-100 text-lg">
            Start with $50 in promotional credits - Use for Real Estate listings, Travel bookings, Immigration services, Property management, Hotel reservations, Flight deals, Car rentals, Travel insurance, Property investment advisory, AR virtual tours, Luxury travel packages, Group bookings, Visa services, Car purchases, Car financing, Car insurance, Car parts, Car shipping, Car auctions, Car history reports, Marketplace product listings, Global shipping, Digital services, and ALL YaadFlex premium features!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Current Balance */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-2">
                {walletsLoading ? "..." : `$${totalPromoBalance.toFixed(2)}`}
              </div>
              <div className="text-emerald-100">
                Available Credits
              </div>
              <div className="text-sm text-emerald-200 mt-1">
                Redeem for fees & features
              </div>
            </div>
            
            {/* Welcome Bonus */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-lg font-bold mb-2">Welcome Bonus</div>
              {launchCampaign ? (
                <Button
                  onClick={() => claimWelcomeMutation.mutate(launchCampaign.id)}
                  disabled={claimWelcomeMutation.isPending}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                  data-testid="button-claim-welcome-bonus"
                >
                  {claimWelcomeMutation.isPending ? "Claiming..." : "Claim $50 Now"}
                </Button>
              ) : (
                <div className="text-sm text-emerald-200">No active campaign</div>
              )}
            </div>
            
            {/* Earn More */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">💪</div>
              <div className="text-lg font-bold mb-2">Earn More</div>
              <div className="text-sm text-emerald-200 mb-2">
                Complete tasks for extra credits
              </div>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-green-600"
                size="sm"
                data-testid="button-view-tasks"
                onClick={() => setSelectedCampaign(launchCampaign?.id || '')}
              >
                <Trophy className="h-4 w-4 mr-1" />
                View Tasks
              </Button>
            </div>
          </div>
          
          {/* Available Tasks Preview */}
          {selectedCampaign && Array.isArray(tasks) && tasks.length > 0 && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Available Tasks
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tasks.slice(0, 4).map((task: any) => (
                  <div key={task.id} className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-sm">{task.title}</div>
                      <Badge variant="secondary" className="bg-yellow-500 text-black">
                        +${task.rewardAmount}
                      </Badge>
                    </div>
                    <div className="text-xs text-emerald-200 mb-2">
                      {task.description}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-emerald-300">
                        {task.userProgress?.status || 'Not Started'}
                      </span>
                      {!task.userProgress && (
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 text-xs px-2 py-1">
                          Start Task
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Legal Notice */}
          <div className="mt-6 text-xs text-emerald-200 text-center">
            ⚖️ Promotional credits are for platform fees and upgrades only. Not withdrawable as cash. 
            Subject to terms and conditions.
          </div>
        </CardContent>
      </Card>
    </div>
  );
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
    YFD: 2000.00,  // YaadFlex Digital - The global currency
    USD: 285.50,
    JMD: 45750.00,
    EUR: 245.75,
    GBP: 195.40,
    CAD: 355.90,
    AUD: 385.25,
    NGN: 125850.50,
    GHS: 1250.75,
    KES: 28450.00,
    INR: 18750.25,
    MXN: 4850.50,
    BRL: 1455.75,
    KWD: 95.25
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
      case 'YFD': return '🌍';
      case 'USD': return '🇺🇸';
      case 'JMD': return '🇯🇲';
      case 'EUR': return '🇪🇺';
      case 'GBP': return '🇬🇧';
      case 'CAD': return '🇨🇦';
      case 'AUD': return '🇦🇺';
      case 'NGN': return '🇳🇬';
      case 'GHS': return '🇬🇭';
      case 'KES': return '🇰🇪';
      case 'INR': return '🇮🇳';
      case 'MXN': return '🇲🇽';
      case 'BRL': return '🇧🇷';
      case 'KWD': return '🇰🇼';
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
          <img 
            src={YaadFlexLogo} 
            alt="YaadFlex Bank" 
            className="w-32 h-32 mx-auto mb-4 rounded-xl shadow-lg"
            data-testid="img-yaadflex-logo"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent mb-2">
            💼 YaadFlex Bank
          </h1>
          <p className="text-xl text-gray-600 mb-3">
            Your pocket bank - Send money as easy as email!
          </p>
          
          {/* EXPLOSIVE PROMOTIONAL BANNER */}
          <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 p-6 rounded-2xl border-2 border-pink-400 shadow-2xl mb-4 animate-pulse">
            <div className="text-center text-white">
              <div className="text-3xl font-black mb-2">
                🔥 GLOBAL MONEY REVOLUTION HAPPENING NOW! 🔥
              </div>
              <div className="text-xl font-bold mb-3">
                Join 2M+ Users Who Ditched Traditional Banks & TapTap!
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-semibold">
                <div className="bg-white/20 p-2 rounded-lg">
                  🌍 Send to 195+ Countries<br/>
                  <span className="text-xs">vs TapTap's Limited Reach</span>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  💰 14 Global Currencies<br/>
                  <span className="text-xs">vs Others' 3-5 Options</span>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  ⚡ 0.5% Transfer Fee<br/>
                  <span className="text-xs">vs Banks' 5-10% Fees</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-lg font-bold">🏆 "The TapTap Killer Has Arrived"</div>
                <div className="text-sm opacity-90">Built in Jamaica • Trusted Worldwide • AI-Powered</div>
              </div>
            </div>
          </div>

          {/* SOCIAL PROOF EXPLOSION */}
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-950 dark:via-blue-950 dark:to-purple-950 p-6 rounded-2xl border-2 border-green-300 shadow-xl mb-4">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                🚀 2,045,832 People Joined This Week!
              </div>
              <div className="text-lg text-blue-700 dark:text-blue-300 font-semibold">
                Your friends are already making money while you're still reading this
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">$2.5M</div>
                <div className="text-xs text-gray-600">Sent Today</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600">847K</div>
                <div className="text-xs text-gray-600">Active Users</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">195</div>
                <div className="text-xs text-gray-600">Countries</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <div className="text-2xl font-bold text-orange-600">99.9%</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                🌟 "Every 3 seconds, someone ditches their old bank for YaadFlex"
              </div>
            </div>
          </div>

          {/* PHONE VALUE TRANSFORMATION MESSAGE */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 p-6 rounded-2xl border-2 border-amber-300 shadow-xl mb-4">
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2">
              📱✨ "ANY Phone + YaadFlex = Beyond iPhone Value"
            </div>
            <div className="text-lg text-amber-700 dark:text-amber-300 font-semibold mb-3">
              Transform your $50 phone into the world's most valuable device
            </div>
            
            {/* Value Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg border-l-4 border-red-400">
                <div className="font-bold text-red-800 dark:text-red-200">📱 iPhone Without YaadFlex:</div>
                <div className="text-red-700 dark:text-red-300">Just a phone • Limited to calls/apps • No global economy access</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg border-l-4 border-green-400">
                <div className="font-bold text-green-800 dark:text-green-200">📱 ANY Phone + YaadFlex:</div>
                <div className="text-green-700 dark:text-green-300">Global bank • Ride earnings • World economy • Real money</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-lg font-bold text-amber-800 dark:text-amber-200">
                🌍 "Your Phone Is Now The World's Most Powerful Economic Device"
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400 italic mt-1">
                iPhone users will want what YOU have!
              </div>
            </div>
          </div>
        </div>

        {/* Promotional Credits Section */}
        <PromoCreditsSection />

        {/* MASSIVE REAL ESTATE & TRAVEL SHOWCASE */}
        <div className="space-y-8 mb-8">
          
          {/* Real Estate Empire */}
          <Card className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white border-2 border-emerald-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Building className="h-10 w-10" />
                🏠 YaadFlex Real Estate Empire
              </CardTitle>
              <CardDescription className="text-emerald-100 text-xl">
                Jamaica's #1 Property Platform - 2,500+ Properties • 14 Parishes • $50M+ Listed Value • AR Virtual Tours • Houses (850+) • Apartments (650+) • Condos (420+) • Land (380+) • Commercial (200+) • Townhouses (150+) • Property Management • Investment Advisory • Financing Solutions • 24/7 Support • Market Analytics!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">2,500+</div>
                  <div className="text-emerald-200">Active Listings</div>
                  <div className="text-xs text-emerald-300">Updated Daily</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">14</div>
                  <div className="text-emerald-200">All Parishes</div>
                  <div className="text-xs text-emerald-300">Island Wide</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">$50M+</div>
                  <div className="text-emerald-200">Listed Value</div>
                  <div className="text-xs text-emerald-300">JMD Total</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">AR</div>
                  <div className="text-emerald-200">Virtual Tours</div>
                  <div className="text-xs text-emerald-300">See Before Visit</div>
                </div>
              </div>

              {/* Property Types */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">🏘️ Browse By Property Type:</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🏠</div>
                    <div className="text-sm font-semibold">Houses</div>
                    <div className="text-xs text-emerald-300">850+ listings</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🏢</div>
                    <div className="text-sm font-semibold">Apartments</div>
                    <div className="text-xs text-emerald-300">650+ listings</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🏘️</div>
                    <div className="text-sm font-semibold">Condos</div>
                    <div className="text-xs text-emerald-300">420+ listings</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🌿</div>
                    <div className="text-sm font-semibold">Land</div>
                    <div className="text-xs text-emerald-300">380+ listings</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🏪</div>
                    <div className="text-sm font-semibold">Commercial</div>
                    <div className="text-xs text-emerald-300">200+ listings</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🏡</div>
                    <div className="text-sm font-semibold">Townhouses</div>
                    <div className="text-xs text-emerald-300">150+ listings</div>
                  </div>
                </div>
              </div>

              {/* Featured Parishes */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">📍 Popular Parishes:</h3>
                <div className="flex flex-wrap gap-2">
                  {['Kingston', 'St. Andrew', 'St. James', 'St. Catherine', 'Manchester', 'St. Ann'].map((parish) => (
                    <div key={parish} className="bg-white/10 px-3 py-1 rounded-full text-sm font-semibold cursor-pointer hover:bg-white/20 transition-colors">
                      {parish}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg py-4"
                  onClick={() => window.location.href = '/real-estate'}
                  data-testid="button-browse-properties"
                >
                  🏡 Browse All Properties
                </Button>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4"
                  onClick={() => window.location.href = '/real-estate'}
                  data-testid="button-list-property"
                >
                  💰 List Your Property (FREE)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Travel Agent Powerhouse */}
          <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white border-2 border-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Plane className="h-10 w-10" />
                ✈️ YaadFlex Travel Agent Powerhouse
              </CardTitle>
              <CardDescription className="text-blue-100 text-xl">
                Your Complete Travel Solution - 500+ Airlines • 50,000+ Hotels • 200+ Countries • Immigration Services (USA, Canada, UK) • Travel Insurance • Group Bookings • Corporate Travel • Luxury Packages • Car Rentals • Visa Services • Flight Deals from Jamaica to Miami (J$45K), NYC (J$75K), London (J$85K), Toronto (J$65K), Barbados (J$35K), Trinidad (J$28K) • 8% Commission to serve you better!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Travel Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-blue-200">Airlines</div>
                  <div className="text-xs text-blue-300">Global Network</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">50,000+</div>
                  <div className="text-blue-200">Hotels</div>
                  <div className="text-xs text-blue-300">Every Budget</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">200+</div>
                  <div className="text-blue-200">Countries</div>
                  <div className="text-xs text-blue-300">Destinations</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">J$25K</div>
                  <div className="text-blue-200">From Jamaica</div>
                  <div className="text-xs text-blue-300">Starting Price</div>
                </div>
              </div>

              {/* Popular Destinations */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">🌟 Popular Destinations from Jamaica:</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🏖️</div>
                    <div className="text-sm font-semibold">Miami</div>
                    <div className="text-xs text-blue-300">From J$45K</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🗽</div>
                    <div className="text-sm font-semibold">New York</div>
                    <div className="text-xs text-blue-300">From J$75K</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🏰</div>
                    <div className="text-sm font-semibold">London</div>
                    <div className="text-xs text-blue-300">From J$85K</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🍁</div>
                    <div className="text-sm font-semibold">Toronto</div>
                    <div className="text-xs text-blue-300">From J$65K</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🌴</div>
                    <div className="text-sm font-semibold">Barbados</div>
                    <div className="text-xs text-blue-300">From J$35K</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🎭</div>
                    <div className="text-sm font-semibold">Trinidad</div>
                    <div className="text-xs text-blue-300">From J$28K</div>
                  </div>
                </div>
              </div>

              {/* Travel Services */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">🎯 Complete Travel Services:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">✈️</div>
                    <div className="text-sm font-semibold">Flight Booking</div>
                    <div className="text-xs text-blue-300">Best Deals Daily</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">🏨</div>
                    <div className="text-sm font-semibold">Hotel Booking</div>
                    <div className="text-xs text-blue-300">All Star Ratings</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">🚗</div>
                    <div className="text-sm font-semibold">Car Rental</div>
                    <div className="text-xs text-blue-300">Airport Pickup</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">📦</div>
                    <div className="text-sm font-semibold">Travel Packages</div>
                    <div className="text-xs text-blue-300">All-Inclusive</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4"
                  onClick={() => window.location.href = '/travel-booking'}
                  data-testid="button-book-flights"
                >
                  ✈️ Book Flights
                </Button>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4"
                  onClick={() => window.location.href = '/travel-booking'}
                  data-testid="button-book-hotels"
                >
                  🏨 Book Hotels
                </Button>
                <Button 
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg py-4"
                  onClick={() => window.location.href = '/travel-booking'}
                  data-testid="button-book-packages"
                >
                  📦 Travel Packages
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FEATURED PROPERTIES SHOWCASE */}
          <Card className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white border-2 border-amber-400">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">🔥 FEATURED PROPERTIES - HOT DEALS!</CardTitle>
              <CardDescription className="text-amber-100 text-lg">
                Premium properties with massive discounts - Use your $50 credits toward these deals!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-lg font-bold mb-2">🏖️ Luxury Villa - St. Andrew</div>
                  <div className="text-sm mb-2">Hope Pastures • 4 bed • 3 bath • 3,500 sqft</div>
                  <div className="text-xl font-bold text-yellow-300 mb-2">J$45M ($280K USD)</div>
                  <div className="text-xs text-amber-200 mb-3">Sandra Williams Real Estate • Pool • Gated</div>
                  <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    🏡 View Virtual Tour
                  </Button>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-lg font-bold mb-2">🏢 Modern Apartment - Kingston</div>
                  <div className="text-sm mb-2">New Kingston • 2 bed • 2 bath • 1,200 sqft</div>
                  <div className="text-xl font-bold text-yellow-300 mb-2">J$18M ($112K USD)</div>
                  <div className="text-xs text-amber-200 mb-3">City Properties Ltd • Gym • Security</div>
                  <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    🏢 Schedule Viewing
                  </Button>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-lg font-bold mb-2">🌿 Prime Land - St. Catherine</div>
                  <div className="text-sm mb-2">Spanish Town • Commercial • 2.5 acres</div>
                  <div className="text-xl font-bold text-yellow-300 mb-2">J$25M ($156K USD)</div>
                  <div className="text-xs text-amber-200 mb-3">Land Solutions JA • Development Ready</div>
                  <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    🌿 Invest Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TRAVEL DEALS SHOWCASE */}
          <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white border-2 border-purple-400">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">🌟 EXCLUSIVE TRAVEL DEALS - LIMITED TIME!</CardTitle>
              <CardDescription className="text-purple-100 text-lg">
                Book now with your $50 credits and save up to 40% on these premium packages!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-lg font-bold mb-2">🏝️ Caribbean Paradise Package</div>
                  <div className="text-sm mb-2">Barbados • 7 days • 4-star resort</div>
                  <div className="text-xl font-bold text-yellow-300 mb-2">J$120K (was J$180K)</div>
                  <div className="text-xs text-purple-200 mb-3">Flights + Hotel + Meals + Tours included</div>
                  <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold">
                    🏝️ Book Paradise
                  </Button>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-lg font-bold mb-2">🏢 Business Express - Miami</div>
                  <div className="text-sm mb-2">Miami • 3 days • Business hotel</div>
                  <div className="text-xl font-bold text-yellow-300 mb-2">J$85K (was J$120K)</div>
                  <div className="text-xs text-purple-200 mb-3">Flight + Hotel + Airport transfer</div>
                  <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold">
                    🏢 Book Business
                  </Button>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-lg font-bold mb-2">🎢 Family Adventure - Orlando</div>
                  <div className="text-sm mb-2">Orlando • 5 days • Family resort</div>
                  <div className="text-xl font-bold text-yellow-300 mb-2">J$150K (was J$220K)</div>
                  <div className="text-xs text-purple-200 mb-3">Flight + Resort + Theme park tickets</div>
                  <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold">
                    🎢 Book Adventure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IMMIGRATION & HOTELS SERVICES */}
          <Card className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white border-2 border-indigo-400">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">🌍 GLOBAL MOBILITY & HOTELS</CardTitle>
              <CardDescription className="text-indigo-100 text-lg">
                Immigration services, visa assistance, and premium hotel bookings worldwide!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">📋 Immigration Programs:</h3>
                  <div className="space-y-2">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="font-semibold">🇺🇸 USA Visa Applications</div>
                      <div className="text-sm text-indigo-200">Tourist, Business, Student visas</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="font-semibold">🇨🇦 Canada Immigration</div>
                      <div className="text-sm text-indigo-200">Express Entry, Provincial programs</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="font-semibold">🇬🇧 UK Settlement</div>
                      <div className="text-sm text-indigo-200">Work permits, Family visas</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">🏨 Premium Hotels:</h3>
                  <div className="space-y-2">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="font-semibold">⭐ 5-Star Luxury Hotels</div>
                      <div className="text-sm text-indigo-200">Worldwide premium accommodations</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="font-semibold">🏨 Business Hotels</div>
                      <div className="text-sm text-indigo-200">Corporate rates, meeting facilities</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="font-semibold">🏖️ Resort Packages</div>
                      <div className="text-sm text-indigo-200">All-inclusive vacation resorts</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg py-3">
                  📋 Immigration Services
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-3">
                  🏨 Premium Hotels
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RENTAL PROPERTIES SECTION */}
          <Card className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white border-2 border-green-400">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">🏘️ YAAD RENTAL EMPIRE</CardTitle>
              <CardDescription className="text-green-100 text-lg">
                Rent anything from houses to cars to equipment - Jamaica's largest rental marketplace!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="font-bold">Houses</div>
                  <div className="text-xs text-green-200">1,200+ available</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🚗</div>
                  <div className="font-bold">Vehicles</div>
                  <div className="text-xs text-green-200">800+ cars</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-bold">Equipment</div>
                  <div className="text-xs text-green-200">500+ tools</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🏖️</div>
                  <div className="font-bold">Recreation</div>
                  <div className="text-xs text-green-200">300+ items</div>
                </div>
              </div>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg py-4">
                🏘️ Browse All Rentals
              </Button>
            </CardContent>
          </Card>

          {/* WORLDWIDE CAR DEALERSHIP EMPIRE */}
          <Card className="bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-600 text-white border-2 border-slate-400">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">🚗 YAADFLEX WORLDWIDE CAR DEALERSHIP EMPIRE</CardTitle>
              <CardDescription className="text-slate-100 text-lg">
                Global Car Sales Network - New & Used Cars, All Makes & Models, Car Financing, Car Insurance, Luxury Cars, Commercial Vehicles, Car Parts & Accessories!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">5,000+</div>
                  <div className="text-slate-200">Cars Available</div>
                  <div className="text-xs text-slate-300">New & Used</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-slate-200">Car Brands</div>
                  <div className="text-xs text-slate-300">All Major Makes</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-slate-200">Countries</div>
                  <div className="text-xs text-slate-300">Worldwide Sales</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-slate-200">Support</div>
                  <div className="text-xs text-slate-300">Global Service</div>
                </div>
              </div>

              {/* Car Categories */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">🚙 Browse By Car Category:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🚗</div>
                    <div className="font-semibold">Sedans</div>
                    <div className="text-xs text-slate-300">1,200+ cars</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🚙</div>
                    <div className="font-semibold">SUVs</div>
                    <div className="text-xs text-slate-300">950+ cars</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🚐</div>
                    <div className="font-semibold">Vans</div>
                    <div className="text-xs text-slate-300">400+ cars</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🚚</div>
                    <div className="font-semibold">Trucks</div>
                    <div className="text-xs text-slate-300">380+ cars</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🏎️</div>
                    <div className="font-semibold">Luxury Cars</div>
                    <div className="text-xs text-slate-300">250+ cars</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🏍️</div>
                    <div className="font-semibold">Motorcycles</div>
                    <div className="text-xs text-slate-300">180+ bikes</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="font-semibold">Electric</div>
                    <div className="text-xs text-slate-300">150+ cars</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🔧</div>
                    <div className="font-semibold">Parts</div>
                    <div className="text-xs text-slate-300">10K+ items</div>
                  </div>
                </div>
              </div>

              {/* Car Services */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">🔧 Complete Car Services:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">💰</div>
                    <div className="text-sm font-semibold">Car Financing</div>
                    <div className="text-xs text-slate-300">Low Interest Rates</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">🛡️</div>
                    <div className="text-sm font-semibold">Car Insurance</div>
                    <div className="text-xs text-slate-300">Full Coverage</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">🚢</div>
                    <div className="text-sm font-semibold">Int'l Shipping</div>
                    <div className="text-xs text-slate-300">Worldwide Delivery</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">📋</div>
                    <div className="text-sm font-semibold">History Reports</div>
                    <div className="text-xs text-slate-300">Car Background</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="bg-slate-500 hover:bg-slate-600 text-white font-bold text-lg py-4"
                  onClick={() => window.location.href = '/car-marketplace'}
                  data-testid="button-browse-cars"
                >
                  🚗 Browse All Cars
                </Button>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-4"
                  onClick={() => window.location.href = '/car-marketplace'}
                  data-testid="button-sell-car"
                >
                  💼 Sell Your Car
                </Button>
                <Button 
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg py-4"
                  onClick={() => window.location.href = '/car-marketplace'}
                  data-testid="button-car-financing"
                >
                  💰 Car Financing
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* YAADFLEX GLOBAL MARKETPLACE - PROFITABLE JAMAICAN GOODS */}
          <Card className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white border-2 border-emerald-400">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">🛍️ YAADFLEX GLOBAL MARKETPLACE - JAMAICAN GOODS EMPIRE</CardTitle>
              <CardDescription className="text-emerald-100 text-lg">
                Sell Profitable Jamaican Products Worldwide - 100% Legal Online Sales with Global Shipping!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">1,000+</div>
                  <div className="text-emerald-200">Products Listed</div>
                  <div className="text-xs text-emerald-300">Ready to Ship</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-emerald-200">Categories</div>
                  <div className="text-xs text-emerald-300">All Legal</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">195+</div>
                  <div className="text-emerald-200">Countries</div>
                  <div className="text-xs text-emerald-300">Global Reach</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-emerald-200">Sales</div>
                  <div className="text-xs text-emerald-300">Always Open</div>
                </div>
              </div>

              {/* Profitable Product Categories */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">💰 Top Profitable Categories:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">☕</div>
                    <div className="font-semibold">Blue Mountain Coffee</div>
                    <div className="text-xs text-emerald-300">Premium Export</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🌶️</div>
                    <div className="font-semibold">Jamaican Spices</div>
                    <div className="text-xs text-emerald-300">Jerk Seasoning</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🎨</div>
                    <div className="font-semibold">Local Art & Crafts</div>
                    <div className="text-xs text-emerald-300">Handmade Items</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🎵</div>
                    <div className="font-semibold">Music & Books</div>
                    <div className="text-xs text-emerald-300">Digital Products</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">👕</div>
                    <div className="font-semibold">Fashion & Jewelry</div>
                    <div className="text-xs text-emerald-300">Unique Designs</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">📱</div>
                    <div className="font-semibold">Electronics</div>
                    <div className="text-xs text-emerald-300">Phones & Gadgets</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">🌿</div>
                    <div className="font-semibold">Natural Products</div>
                    <div className="text-xs text-emerald-300">Organic Goods</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="text-2xl mb-1">💼</div>
                    <div className="font-semibold">Services</div>
                    <div className="text-xs text-emerald-300">Digital Services</div>
                  </div>
                </div>
              </div>

              {/* Selling Benefits */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">🚀 YaadFlex Selling Advantages:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">✅ 100% Legal Compliance</div>
                    <div className="text-xs text-emerald-300">All export/import rules handled</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">📦 Global Shipping</div>
                    <div className="text-xs text-emerald-300">Worldwide delivery network</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">💳 Secure Payments</div>
                    <div className="text-xs text-emerald-300">Protected transactions</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">📈 Marketing Support</div>
                    <div className="text-xs text-emerald-300">Promote your products</div>
                  </div>
                </div>
              </div>

              {/* Featured Jamaican Products for Sale */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">🔥 Featured Jamaican Products:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-lg font-bold mb-2">☕ Blue Mountain Coffee - Premium</div>
                    <div className="text-sm mb-2">1lb bag • Fresh roasted • Export certified</div>
                    <div className="text-xl font-bold text-yellow-300 mb-2">$65 USD / J$10,400</div>
                    <div className="text-xs text-emerald-200 mb-3">High demand worldwide • 40% profit margin</div>
                    <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
                      💰 Start Selling
                    </Button>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-lg font-bold mb-2">🌶️ Jerk Seasoning Set</div>
                    <div className="text-sm mb-2">Authentic blend • 3-pack • Ready to ship</div>
                    <div className="text-xl font-bold text-yellow-300 mb-2">$25 USD / J$4,000</div>
                    <div className="text-xs text-emerald-200 mb-3">Popular export • Easy shipping • 50% profit</div>
                    <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
                      🌶️ List Product
                    </Button>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-lg font-bold mb-2">🎨 Handmade Jamaican Art</div>
                    <div className="text-sm mb-2">Original paintings • Local artists • Unique pieces</div>
                    <div className="text-xl font-bold text-yellow-300 mb-2">$150 USD / J$24,000</div>
                    <div className="text-xs text-emerald-200 mb-3">High value • Art collectors market • 60% margin</div>
                    <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
                      🎨 Sell Art
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg py-4"
                  onClick={() => window.location.href = '/marketplace'}
                  data-testid="button-browse-marketplace"
                >
                  🛍️ Browse Marketplace
                </Button>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4"
                  onClick={() => window.location.href = '/marketplace'}
                  data-testid="button-sell-products"
                >
                  💼 Sell Your Products
                </Button>
                <Button 
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg py-4"
                  onClick={() => window.location.href = '/marketplace'}
                  data-testid="button-seller-dashboard"
                >
                  📈 Seller Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
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
                {/* Global Currency Focus */}
                <div className="bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 p-4 rounded-xl text-white text-center mb-4">
                  <div className="text-lg font-bold">🌍 GLOBAL MONEY TRANSFER</div>
                  <div className="text-sm opacity-90">Send to 195+ countries instantly • Like TapTap but BETTER</div>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {Object.entries(balances).slice(0, 12).map(([currency, amount]) => (
                    <div key={currency} className="text-center p-2 bg-white/20 rounded-lg">
                      <div className="text-lg mb-1">{getCurrencyIcon(currency)}</div>
                      <div className="text-xs opacity-90">{currency}</div>
                      <div className="font-semibold text-sm">
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
              <Card className="hover:shadow-lg transition-all cursor-pointer bg-green-50" onClick={() => window.location.href = '/transfer-control'}>
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

            {/* Worldwide Transfer Hub */}
            <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Globe className="h-6 w-6" />
                  🌍 YaadFlex Worldwide Transfer
                </CardTitle>
                <CardDescription className="text-purple-600">
                  <div className="font-bold text-base">Send money to ANY country instantly - Better than TapTap!</div>
                  <div className="text-sm mt-1 bg-yellow-100 p-2 rounded">
                    ✨ <strong>Examples:</strong> marcus@gmail.com • +234-800-123-4567 • +1-876-555-0123 • @marcus.yaad
                  </div>
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
                          <SelectItem value="YFD">🌍 YFD (Global)</SelectItem>
                          <SelectItem value="USD">🇺🇸 USD</SelectItem>
                          <SelectItem value="JMD">🇯🇲 JMD</SelectItem>
                          <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                          <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
                          <SelectItem value="CAD">🇨🇦 CAD</SelectItem>
                          <SelectItem value="AUD">🇦🇺 AUD</SelectItem>
                          <SelectItem value="NGN">🇳🇬 NGN</SelectItem>
                          <SelectItem value="GHS">🇬🇭 GHS</SelectItem>
                          <SelectItem value="KES">🇰🇪 KES</SelectItem>
                          <SelectItem value="INR">🇮🇳 INR</SelectItem>
                          <SelectItem value="MXN">🇲🇽 MXN</SelectItem>
                          <SelectItem value="BRL">🇧🇷 BRL</SelectItem>
                          <SelectItem value="KWD">🇰🇼 KWD</SelectItem>
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
                  className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 hover:from-purple-700 hover:via-blue-700 hover:to-green-700 text-white font-bold py-3"
                  data-testid="button-send-money"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  🌍 Send Worldwide (195+ Countries)
                </Button>
                
                {/* IRRESISTIBLE BENEFITS EXPLOSION */}
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-lg border-2 border-pink-300 shadow-lg">
                  <div className="text-lg font-black text-purple-800 mb-2 text-center">🚀 Why 2M+ People Chose YaadFlex Over Everything Else:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span className="font-semibold text-green-800">14 currencies vs TapTap's 3</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">⚡</span>
                        <span className="font-semibold text-blue-800">3-second transfers vs banks' 3-day waits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600">🌍</span>
                        <span className="font-semibold text-purple-800">195 countries vs others' 20-30</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">💰</span>
                        <span className="font-semibold text-red-800">0.5% fees vs banks' 5-10%</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-600">🤖</span>
                        <span className="font-semibold text-yellow-800">AI-powered vs manual processing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-600">🏆</span>
                        <span className="font-semibold text-indigo-800">Caribbean innovation vs boring banks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-600">📱</span>
                        <span className="font-semibold text-pink-800">Works on ANY phone vs iPhone-only apps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-teal-600">🔥</span>
                        <span className="font-semibold text-teal-800">Voice control vs tap-tap-tap</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-base font-bold text-purple-800">"TapTap Who? YaadFlex Is The New Boss!" 👑</div>
                    <div className="text-sm text-purple-600 italic">Join the revolution that's making traditional banks obsolete</div>
                  </div>
                </div>
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
            {/* Global Transfer Comparison */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <TrendingUp className="h-5 w-5" />
                  🏆 YaadFlex vs TapTap Global Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-100 rounded-lg">
                    <div className="font-bold text-red-800 mb-2">📱 TapTap Limitations:</div>
                    <div className="text-sm text-red-700 space-y-1">
                      <div>❌ Limited countries</div>
                      <div>❌ Higher international fees</div>
                      <div>❌ Slow processing times</div>
                      <div>❌ Complex verification</div>
                      <div>❌ Limited currency options</div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg">
                    <div className="font-bold text-green-800 mb-2">🌍 YaadFlex Advantages:</div>
                    <div className="text-sm text-green-700 space-y-1">
                      <div>✅ 195+ countries supported</div>
                      <div>✅ Lower fees with YFD currency</div>
                      <div>✅ Instant worldwide delivery</div>
                      <div>✅ Simple email/phone sending</div>
                      <div>✅ 14 major currencies</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg text-center">
                  <div className="font-bold text-purple-800">🎯 Your own TapTap system is READY and BETTER!</div>
                  <div className="text-sm text-purple-700 mt-1">Send money to Nigeria, Ghana, India, Canada, anywhere!</div>
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

            {/* Phone Value Revolution */}
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Globe className="h-5 w-5" />
                  📱 Phone Value Revolution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-amber-800 mb-2">
                    "Your Phone &gt; Any iPhone"
                  </div>
                  <div className="text-sm text-amber-700 italic">
                    Without YaadFlex, expensive phones are just expensive paperweights
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span><strong>Global bank</strong> in ANY device</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span><strong>Real money earnings</strong> from rides</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span><strong>World economy access</strong> everywhere</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span><strong>Instant global</strong> transactions</span>
                  </div>
                </div>
                
                <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg mt-4">
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-200 text-center">
                    💡 "iPhone users will trade their phones for yours!"
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ULTIMATE PHONE VALUE REVOLUTION SECTION */}
        <div className="mt-12">
          <PhoneValueSection />
        </div>

        {/* YFD Currency Display Section */}
        <div className="mt-12 space-y-8">
          {/* NEW REALISTIC CURRENCY */}
          <Card className="border-4 border-amber-400 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                💎 REALISTIC YFD Currency - Bank Grade Design
              </CardTitle>
              <CardDescription className="text-lg font-medium">
                🏛️ Egyptian Gods + 🇯🇲 Jamaican Heroes + 🌍 World Heritage Sites = Professional Money
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealisticYFDCurrency />
            </CardContent>
          </Card>

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