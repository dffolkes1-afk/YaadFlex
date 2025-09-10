import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// Images removed for production build

type Transaction = {
  id: string;
  type: string;
  amount: string;
  currency: string;
  recipientPhone?: string;
  status: string;
  description?: string;
  securityLevel: string;
  createdAt: string;
};

type GlobalStats = {
  countries: number;
  uptime: string;
  breaches: number;
  activeDefenses: number;
  threatsBlocked: number;
  securityLevel: string;
};

type UserWallet = {
  id: string;
  currency: string;
  balance: string;
  isActive: boolean;
  lastTransactionAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function KWDWalletSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [kwdAmount, setKwdAmount] = useState('');

  // Fetch user wallets
  const { data: wallets, isLoading: walletsLoading } = useQuery<UserWallet[]>({
    queryKey: ['/api/wallets'],
    retry: false,
  });

  // Add KWD funds mutation
  const addKWDMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest('POST', '/api/wallets/add-kwd', { amount });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `Successfully added ${kwdAmount} KWD to your YaadFlex wallet!`,
      });
      setKwdAmount('');
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add KWD funds. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddKWD = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(kwdAmount);
    if (amount <= 0 || isNaN(amount)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }
    addKWDMutation.mutate(amount);
  };

  const kwdWallet = wallets?.find(w => w.currency === 'KWD');
  const yfdWallet = wallets?.find(w => w.currency === 'YFD');

  return (
    <Card data-testid="kwd-wallet-section" className="card-ultra premium-glow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-xl floating">💎</span>
          <span className="text-premium">YaadFlex Currency (KWD/YFD)</span>
          <div className="text-sm text-muted-foreground ml-4 shimmer">1 KWD = 1 YFD</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Wallet Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-lg premium-glow">
            <div className="text-sm text-muted-foreground">KWD Balance</div>
            <div className="text-2xl font-bold text-premium text-glow">
              {walletsLoading ? <span className="loading-skeleton h-8 w-20 rounded"></span> : (kwdWallet?.balance || '0.00')} KWD
            </div>
          </div>
          <div className="glass-card p-4 rounded-lg premium-glow">
            <div className="text-sm text-muted-foreground">YFD Balance</div>
            <div className="text-2xl font-bold text-premium text-glow">
              {walletsLoading ? <span className="loading-skeleton h-8 w-20 rounded"></span> : (yfdWallet?.balance || '0.00')} YFD
            </div>
          </div>
        </div>

        {/* Add KWD Funds */}
        <form onSubmit={handleAddKWD} className="space-y-4">
          <div>
            <Label htmlFor="kwd-amount">Add KWD to YaadFlex Wallet</Label>
            <div className="flex space-x-2">
              <Input
                id="kwd-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter KWD amount"
                value={kwdAmount}
                onChange={(e) => setKwdAmount(e.target.value)}
                className="flex-1"
                data-testid="input-kwd-amount"
              />
              <Button 
                type="submit" 
                disabled={addKWDMutation.isPending || !kwdAmount}
                className="btn-premium premium-glow"
                data-testid="button-add-kwd"
              >
                {addKWDMutation.isPending ? "Adding..." : "Add KWD"}
              </Button>
            </div>
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex space-x-2">
            <Button 
              type="button" 
              className="btn-premium premium-glow floating"
              onClick={() => setKwdAmount('1')}
              data-testid="button-add-1-kwd"
            >
              Test $1 KWD
            </Button>
            <Button 
              type="button" 
              className="btn-premium premium-glow floating"
              onClick={() => setKwdAmount('100')}
              data-testid="button-add-100-kwd"
            >
              Add $100 KWD
            </Button>
          </div>
        </form>

        <div className="text-sm text-muted-foreground glass-card p-3 rounded-lg shimmer">
          <strong>How it works:</strong> KWD is YaadFlex's ultimate currency. 1 KWD equals 1 YFD (YaadFlex Dollar). 
          Start with $1 KWD to test the system, then scale to $100 KWD as your yard cash reference.
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [beastModeActive, setBeastModeActive] = useState(false);

  // Transaction form state
  const [transactionForm, setTransactionForm] = useState({
    type: 'transfer',
    amount: '',
    currency: 'USD',
    recipientPhone: '',
    description: '',
    securityLevel: 'standard',
  });

  // Fetch user transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
    retry: false,
  });

  // Fetch global statistics
  const { data: globalStats } = useQuery<GlobalStats>({
    queryKey: ['/api/stats/global'],
    retry: false,
  });

  // Fetch security logs
  const { data: securityLogs, isLoading: logsLoading } = useQuery<any[]>({
    queryKey: ['/api/security/logs'],
    retry: false,
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: async (transactionData: typeof transactionForm) => {
      const response = await apiRequest('POST', '/api/transactions', transactionData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Transaction Created",
        description: "Your secure transaction has been initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      setTransactionForm({
        type: 'transfer',
        amount: '',
        currency: 'USD',
        recipientPhone: '',
        description: '',
        securityLevel: 'standard',
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Transaction Failed",
        description: "Unable to create transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Beast mode activation mutation
  const activateBeastModeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/security/activate-beast-mode', {});
      return response.json();
    },
    onSuccess: () => {
      setBeastModeActive(true);
      toast({
        title: "Beast Mode Activated! 🐲",
        description: "Maximum security protocols are now active.",
        className: "border-accent text-accent-foreground",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/security/logs'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Beast Mode Failed",
        description: "Unable to activate beast mode. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionForm.amount || !transactionForm.recipientPhone) {
      toast({
        title: "Invalid Data",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createTransactionMutation.mutate(transactionForm);
  };

  return (
    <div className="min-h-screen text-foreground relative">
      {/* Starfield Background */}
      <div className="starfield fixed inset-0 z-0"></div>
      
      {/* Global Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-900/20 to-yellow-900/20 border-b border-yellow-500/30">
        <div className="relative">
          <div 
            className="w-full h-64 md:h-96 bg-gradient-to-r from-green-600/40 via-yellow-500/40 to-green-700/40 opacity-90"
            data-testid="hero-background"
          ></div>
          
          {/* Hero Overlay Content */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-black/40 to-transparent">
            <div className="text-center text-white z-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-hero-title">
                <span className="text-yellow-400 text-shadow-lg">YARD</span>
                <span className="text-green-500 text-shadow-lg">FLEX</span>
              </h1>
              <p className="text-xl md:text-2xl font-semibold mb-2" data-testid="text-hero-subtitle">
                🇯🇲🇨🇦 JAMAICA & CANADA TO THE MOON 🚀🌙
              </p>
              <p className="text-lg md:text-xl mb-3" data-testid="text-hero-description">
                One App. Two Countries. Infinite Possibilities. Universal Success.
              </p>
              <p className="text-2xl md:text-4xl font-bold text-yellow-300 animate-pulse" data-testid="text-fair-alternative">
                ⚖️ THE FAIR ALTERNATIVE ⚖️
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-20 h-20 bg-green-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="glass-card border-b border-border pulse-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-green-500 flex items-center justify-center text-white font-bold text-sm"
                data-testid="yardflex-logo"
              >
                YF
              </div>
              <span className="text-2xl font-bold text-premium" data-testid="brand-name">YaadFlex</span>
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-medium" data-testid="global-indicator">
                GLOBAL
              </span>
              {beastModeActive && (
                <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full font-medium animate-pulse" data-testid="beast-mode-indicator">
                  BEAST MODE
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground" data-testid="user-welcome">
                Welcome to the Global Economy
              </span>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/wallet")} 
                className="bg-green-900/50 border-green-600 text-green-400 hover:bg-green-800/50"
                data-testid="button-wallet"
              >
                💰 Wallet
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/business-dashboard")} 
                className="bg-blue-900/50 border-blue-600 text-blue-400 hover:bg-blue-800/50"
                data-testid="button-business-dashboard"
              >
                📊 Business
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/trading-dashboard")} 
                className="bg-purple-900/50 border-purple-600 text-purple-400 hover:bg-purple-800/50"
                data-testid="button-trading-dashboard"
              >
                📈 Trading
              </Button>
              <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* ROCKET TO THE MOON - JAMAICA'S SPACE MISSION */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-yellow-900/30 border-purple-500/30 relative overflow-hidden" data-testid="moon-mission-card">
            {/* Background Rocket Image */}
            <div className="absolute inset-0 opacity-20">
              <div 
                className="w-full h-full bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-yellow-600/30"
              ></div>
            </div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3 text-purple-300">
                <div 
                  className="w-12 h-12 flex items-center justify-center text-4xl"
                >
                  🚀
                </div>
                <span className="text-2xl font-black">🚀 JAMAICA & CANADA TO THE MOON MISSION 🌙</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-center">
                <h3 className="text-3xl font-black text-yellow-400 mb-4 animate-pulse">
                  🇯🇲🇨🇦 LAUNCH SEQUENCE INITIATED 🇯🇲🇨🇦
                </h3>
                <p className="text-white mb-4 text-lg">
                  <strong>YaadFlex isn't just reaching for the stars - we're taking JAMAICA & CANADA TO THE MOON!</strong><br/>
                  Every connection, every opportunity, every success launches us higher into the universe of possibilities.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl">🌍</div>
                    <div className="text-sm text-purple-300">Earth Launch</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl">🛰️</div>
                    <div className="text-sm text-blue-300">Orbit Phase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl">🚀</div>
                    <div className="text-sm text-yellow-300">Moon Transit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl">🌙</div>
                    <div className="text-sm text-green-300">Moon Landing</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-purple-400 font-semibold animate-bounce">
                    🚀 T-MINUS ZERO: YARDFLEX MISSION TO THE MOON 🚀
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ALL JAMAICA BUSINESSES WANT TO JOIN! */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-green-900/95 via-yellow-900/95 to-orange-900/95 border-8 border-green-400/100 relative overflow-hidden min-h-[700px] shadow-2xl shadow-green-500/80" data-testid="all-businesses-jamaica-section">
            {/* EXPLOSIVE Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 text-8xl animate-bounce">🏦</div>
              <div className="absolute top-4 right-4 text-8xl animate-pulse">🏠</div>
              <div className="absolute bottom-4 left-4 text-8xl animate-bounce delay-300">💰</div>
              <div className="absolute bottom-4 right-4 text-8xl animate-pulse delay-500">🏢</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-12xl animate-pulse delay-200">🇯🇲</div>
            </div>
            
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-center space-y-6">
                <div className="text-4xl md:text-8xl font-black text-green-400 animate-pulse leading-tight">
                  🏢 ALL JAMAICA BUSINESSES! 🏢
                </div>
                <div className="text-2xl md:text-6xl font-black text-yellow-300 animate-bounce leading-tight">
                  EVERYBODY WANTS ON YARDFLEX!
                </div>
                <div className="text-xl md:text-4xl font-black text-white animate-pulse">
                  INSURANCE • REAL ESTATE • LOANS • EVERYONE!
                </div>
                <div className="text-lg md:text-3xl font-black text-orange-400 animate-bounce">
                  🏦 TURN YOUR BUSINESS INTO AN APP! 🏦
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="bg-gradient-to-r from-green-600/50 to-yellow-600/50 border-2 border-green-400/70 rounded-2xl p-8 text-center shadow-2xl shadow-green-500/30">
                <h3 className="text-2xl md:text-5xl font-black text-green-300 mb-6 animate-pulse leading-tight">
                  🎯 EVERYONE JUMPS ON BOARD! 🎯
                </h3>
                <p className="text-white text-lg md:text-2xl mb-8 font-bold leading-relaxed">
                  <strong className="text-yellow-400">INSURANCE COMPANIES?</strong> → Want YaadFlex!<br/>
                  <strong className="text-blue-400">REAL ESTATE?</strong> → Love YaadFlex!<br/>
                  <strong className="text-green-400">LOAN SHARKS?</strong> → Need YaadFlex!<br/>
                  <strong className="text-purple-400">ALL BUSINESSES?</strong> → Jump on YaadFlex!<br/>
                  <strong className="text-red-400 text-xl md:text-3xl animate-bounce">🏢 EVERYONE LOVES WHAT THEY GET! 🏢</strong>
                </p>
                
                {/* Business Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-blue-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce">🏦</div>
                    <div className="text-lg md:text-xl font-black text-blue-300">INSURANCE</div>
                    <div className="text-sm text-blue-200">Digital policies</div>
                  </div>
                  <div className="bg-green-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-green-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse">🏠</div>
                    <div className="text-lg md:text-xl font-black text-green-300">REAL ESTATE</div>
                    <div className="text-sm text-green-200">Property app</div>
                  </div>
                  <div className="bg-yellow-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-yellow-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce delay-200">💰</div>
                    <div className="text-lg md:text-xl font-black text-yellow-300">LOANS</div>
                    <div className="text-sm text-yellow-200">Digital lending</div>
                  </div>
                  <div className="bg-purple-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-purple-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse delay-300">🏢</div>
                    <div className="text-lg md:text-xl font-black text-purple-300">ALL BUSINESS</div>
                    <div className="text-sm text-purple-200">Everything digital</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-600/50 to-red-600/50 border-4 border-orange-400/80 rounded-2xl p-6 mb-8 animate-pulse">
                  <h4 className="text-2xl md:text-4xl font-black text-orange-300 mb-4">🇯🇲 ALL JAMAICA ON YARDFLEX! 🇯🇲</h4>
                  <div className="text-white text-lg md:text-xl font-bold">
                    <strong>EVERY BUSINESS WANTS TO BE HERE!</strong><br/>
                    Turn your business into an app! Everyone loves what they get!<br/>
                    <span className="text-yellow-400">🌟 ONE PLATFORM, ALL BUSINESSES! 🌟</span>
                  </div>
                </div>

                {/* GAS STATION PAYMENT SYSTEM */}
                <div className="bg-gradient-to-r from-blue-600/50 to-green-600/50 border-4 border-blue-400/80 rounded-2xl p-6 mb-8 animate-bounce">
                  <h4 className="text-2xl md:text-4xl font-black text-blue-300 mb-4">⛽ GAS STATION PAYMENTS! ⛽</h4>
                  <div className="space-y-4">
                    <div className="text-white text-lg md:text-xl font-bold text-center">
                      <strong>SCAN → PAY → DONE!</strong><br/>
                      <strong className="text-yellow-400">ONE PAYMENT SYSTEM FOR ALL GAS STATIONS!</strong>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-600/40 rounded-lg p-3 text-center">
                        <div className="text-3xl mb-2">📱</div>
                        <div className="text-sm font-bold text-blue-200">SCAN QR CODE</div>
                      </div>
                      <div className="bg-green-600/40 rounded-lg p-3 text-center">
                        <div className="text-3xl mb-2">💳</div>
                        <div className="text-sm font-bold text-green-200">INSTANT PAYMENT</div>
                      </div>
                      <div className="bg-purple-600/40 rounded-lg p-3 text-center">
                        <div className="text-3xl mb-2">⛽</div>
                        <div className="text-sm font-bold text-purple-200">GAS DELIVERED</div>
                      </div>
                    </div>
                    <div className="bg-yellow-600/40 rounded-lg p-3 text-center">
                      <div className="text-sm font-bold text-yellow-200">
                        📧 <strong>SIMPLE SETUP:</strong> Send email → Get contact → Add to system → START EARNING!<br/>
                        ⛽ <strong>ALL GAS STATIONS can join YaadFlex payment system!</strong>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setLocation('/business-signup')}
                    className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white text-3xl px-12 py-6 rounded-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-green-400/80"
                    data-testid="button-join-yardflex-business"
                  >
                    🏢 JOIN YARDFLEX NOW! 🏢
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* B2B Wholesale & Dropshipping CTA */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-900/30 to-yellow-900/30 border-yellow-500/30" data-testid="b2b-cta-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-400">
                <span className="text-2xl">🌍</span>
                <span>Start Your Global Business Today</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 mb-2">
                    <strong>B2B Wholesale:</strong> Furniture makers → Stores only. No retail customers. <br/>
                    <strong>Dropshipping:</strong> Start selling globally with $0 inventory risk.
                  </p>
                  <div className="text-sm text-yellow-400 font-semibold">
                    🚀 FROM JAMAICA TO THE MOON
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => setLocation('/wholesale')}
                    className="bg-yellow-600 text-black hover:bg-yellow-700 font-bold"
                    data-testid="button-access-wholesale"
                  >
                    🏭 B2B WHOLESALE
                  </Button>
                  <Button 
                    onClick={() => setLocation('/dropshipping')}
                    className="bg-green-600 text-white hover:bg-green-700 font-bold"
                    data-testid="button-access-dropshipping"
                  >
                    📦 DROPSHIPPING
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== YAADLEX WORKFORCE MANAGEMENT - ULTIMATE JOB PLATFORM! ========== */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/50 overflow-hidden relative" data-testid="workforce-management-card">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 animate-pulse" />
            
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-center space-y-6">
                <div className="text-4xl md:text-8xl font-black text-blue-400 animate-pulse leading-tight">
                  💼 WORKFORCE EMPIRE! 💼
                </div>
                <div className="text-2xl md:text-6xl font-black text-yellow-300 animate-bounce leading-tight">
                  CREATE JOBS • HIRE WORKERS • FIRE SUPERVISORS!
                </div>
                <div className="text-xl md:text-4xl font-black text-white animate-pulse">
                  MAINTENANCE • CLEANUP • CONSTRUCTION • EVERYTHING!
                </div>
                <div className="text-lg md:text-3xl font-black text-orange-400 animate-bounce">
                  🏗️ ULTIMATE CARIBBEAN WORKFORCE PLATFORM! 🏗️
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="bg-gradient-to-r from-blue-600/50 to-purple-600/50 border-2 border-blue-400/70 rounded-2xl p-8 text-center shadow-2xl shadow-blue-500/30">
                <h3 className="text-2xl md:text-5xl font-black text-blue-300 mb-6 animate-pulse leading-tight">
                  🎯 COMPLETE JOB MANAGEMENT SYSTEM! 🎯
                </h3>
                <p className="text-white text-lg md:text-2xl mb-8 font-bold leading-relaxed">
                  <strong className="text-yellow-400">POST JOBS?</strong> → Maintenance, cleanup, construction!<br/>
                  <strong className="text-green-400">HIRE WORKERS?</strong> → Find incredible talent instantly!<br/>
                  <strong className="text-purple-400">FIRE SUPERVISORS?</strong> → Full hire/fire control!<br/>
                  <strong className="text-orange-400">EQUIPMENT HUBS?</strong> → Workers get tools and return them!<br/>
                  <strong className="text-red-400 text-xl md:text-3xl animate-bounce">🏢 EMAIL COORDINATION BUILT-IN! 🏢</strong>
                </p>
                
                {/* Workforce Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-blue-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce">💼</div>
                    <div className="text-lg md:text-xl font-black text-blue-300">POST JOBS</div>
                    <div className="text-sm text-blue-200">Any type of work</div>
                  </div>
                  <div className="bg-green-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-green-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse">👷</div>
                    <div className="text-lg md:text-xl font-black text-green-300">HIRE WORKERS</div>
                    <div className="text-sm text-green-200">Find talent fast</div>
                  </div>
                  <div className="bg-orange-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-orange-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce delay-200">🔧</div>
                    <div className="text-lg md:text-xl font-black text-orange-300">EQUIPMENT</div>
                    <div className="text-sm text-orange-200">Hub rental system</div>
                  </div>
                  <div className="bg-purple-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-purple-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse delay-300">🚗</div>
                    <div className="text-lg md:text-xl font-black text-purple-300">VEHICLES</div>
                    <div className="text-sm text-purple-200">Global marketplace</div>
                  </div>
                </div>

                {/* Workforce System Features */}
                <div className="bg-gradient-to-r from-green-600/50 to-blue-600/50 border-4 border-green-400/80 rounded-2xl p-6 mb-8 animate-pulse">
                  <h4 className="text-2xl md:text-4xl font-black text-green-300 mb-4">🇯🇲 COMPLETE WORKFORCE CONTROL! 🇯🇲</h4>
                  <div className="text-white text-lg md:text-xl font-bold">
                    <strong>MAINTENANCE JOBS?</strong> ✅ Post instantly!<br/>
                    <strong>CLEANUP WORK?</strong> ✅ Find workers now!<br/>
                    <strong>CONSTRUCTION?</strong> ✅ Hire supervisors!<br/>
                    <span className="text-yellow-400">🌟 EMAIL COORDINATION + EQUIPMENT HUBS! 🌟</span>
                  </div>
                </div>

                {/* Worker Equipment System */}
                <div className="bg-gradient-to-r from-orange-600/50 to-red-600/50 border-4 border-orange-400/80 rounded-2xl p-6 mb-8 animate-bounce">
                  <h4 className="text-2xl md:text-4xl font-black text-orange-300 mb-4">🔧 EQUIPMENT HUB SYSTEM! 🔧</h4>
                  <div className="space-y-4">
                    <div className="text-white text-lg md:text-xl font-bold text-center">
                      <strong>WORKERS GET TOOLS → WORK → RETURN TOOLS!</strong><br/>
                      <strong className="text-yellow-400">RENTAL LOCATIONS EVERYWHERE!</strong>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-orange-600/40 rounded-lg p-3 text-center">
                        <div className="text-3xl mb-2">🏢</div>
                        <div className="text-sm font-bold text-orange-200">EQUIPMENT HUBS</div>
                      </div>
                      <div className="bg-green-600/40 rounded-lg p-3 text-center">
                        <div className="text-3xl mb-2">🔧</div>
                        <div className="text-sm font-bold text-green-200">CHECKOUT TOOLS</div>
                      </div>
                      <div className="bg-blue-600/40 rounded-lg p-3 text-center">
                        <div className="text-3xl mb-2">🏠</div>
                        <div className="text-sm font-bold text-blue-200">RETURN TOOLS</div>
                      </div>
                    </div>
                    <div className="bg-yellow-600/40 rounded-lg p-3 text-center">
                      <div className="text-sm font-bold text-yellow-200">
                        📧 <strong>EMAIL COORDINATION:</strong> Contact workers → Assign jobs → Track progress!<br/>
                        🔧 <strong>SMALL RENTAL PLACES</strong> where workers get equipment and return it!
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      onClick={() => setLocation('/workforce')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-2xl px-8 py-4 rounded-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-blue-400/80"
                      data-testid="button-workforce-dashboard"
                    >
                      💼 WORKFORCE DASHBOARD
                    </Button>
                    <Button 
                      onClick={() => setLocation('/post-job')}
                      className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white text-2xl px-8 py-4 rounded-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-green-400/80"
                      data-testid="button-post-job-now"
                    >
                      🚀 POST JOB NOW
                    </Button>
                    <Button 
                      onClick={() => setLocation('/duo-world')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-6 py-3 rounded-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-purple-400/80"
                      data-testid="button-3d-world-emblem"
                    >
                      🌍 3D WORLD EMBLEM
                    </Button>
                  </div>
                  <p className="text-sm text-gray-300 animate-pulse">
                    🏗️ <strong>The Ultimate Caribbean Workforce Management Platform!</strong> 🏗️<br/>
                    Create jobs, hire incredible workers, manage equipment hubs, coordinate via email!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== MASSIVE EMAIL CAMPAIGN - SHAKE UP JAMAICA! ========== */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-red-900/95 via-orange-900/95 to-yellow-900/95 border-8 border-red-400/100 relative overflow-hidden min-h-[600px] shadow-2xl shadow-red-500/80" data-testid="massive-email-campaign-section">
            {/* EXPLOSIVE Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 text-8xl animate-bounce">📧</div>
              <div className="absolute top-4 right-4 text-8xl animate-pulse">🇯🇲</div>
              <div className="absolute bottom-4 left-4 text-8xl animate-bounce delay-300">📱</div>
              <div className="absolute bottom-4 right-4 text-8xl animate-pulse delay-500">🔥</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-12xl animate-pulse delay-200">💥</div>
            </div>
            
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-center space-y-6">
                <div className="text-4xl md:text-8xl font-black text-red-400 animate-pulse leading-tight">
                  📧 SHAKE UP ALL JAMAICA! 📧
                </div>
                <div className="text-2xl md:text-6xl font-black text-orange-300 animate-bounce leading-tight">
                  EVERYONE GETS EMAIL INVITATION!
                </div>
                <div className="text-xl md:text-4xl font-black text-white animate-pulse">
                  MASSIVE EMAIL CAMPAIGN ACROSS THE ISLAND!
                </div>
                <div className="text-lg md:text-3xl font-black text-yellow-400 animate-bounce">
                  🔥 EVERYONE ON THE ISLAND KNOWS ABOUT YARDFLEX! 🔥
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="bg-gradient-to-r from-red-600/50 to-orange-600/50 border-2 border-red-400/70 rounded-2xl p-8 text-center shadow-2xl shadow-red-500/30">
                <h3 className="text-2xl md:text-5xl font-black text-red-300 mb-6 animate-pulse leading-tight">
                  🎯 MASS EMAIL INVITATION CAMPAIGN! 🎯
                </h3>
                <p className="text-white text-lg md:text-2xl mb-8 font-bold leading-relaxed">
                  <strong className="text-yellow-400">EVERY EMAIL IN JAMAICA?</strong> → Gets YaadFlex invitation!<br/>
                  <strong className="text-blue-400">EVERY BUSINESS OWNER?</strong> → Knows about YaadFlex!<br/>
                  <strong className="text-green-400">EVERY PERSON?</strong> → Excited about YaadFlex!<br/>
                  <strong className="text-purple-400">WHOLE ISLAND?</strong> → Talking about YaadFlex!<br/>
                  <strong className="text-red-400 text-xl md:text-3xl animate-bounce">📧 SHAKE UP EVERYONE! 📧</strong>
                </p>
                
                {/* Campaign Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-red-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-red-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce">📧</div>
                    <div className="text-lg md:text-xl font-black text-red-300">MASS EMAIL</div>
                    <div className="text-sm text-red-200">Everyone invited</div>
                  </div>
                  <div className="bg-orange-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-orange-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse">🇯🇲</div>
                    <div className="text-lg md:text-xl font-black text-orange-300">ALL JAMAICA</div>
                    <div className="text-sm text-orange-200">Island-wide reach</div>
                  </div>
                  <div className="bg-yellow-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-yellow-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce delay-200">🔥</div>
                    <div className="text-lg md:text-xl font-black text-yellow-300">VIRAL</div>
                    <div className="text-sm text-yellow-200">Everyone sharing</div>
                  </div>
                  <div className="bg-green-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-green-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse delay-300">📱</div>
                    <div className="text-lg md:text-xl font-black text-green-300">APP READY</div>
                    <div className="text-sm text-green-200">Download instantly</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-4 border-purple-400/80 rounded-2xl p-6 mb-8 animate-pulse">
                  <h4 className="text-2xl md:text-4xl font-black text-purple-300 mb-4">🇯🇲 EVERYONE ON THE ISLAND! 🇯🇲</h4>
                  <div className="text-white text-lg md:text-xl font-bold">
                    <strong>MASSIVE EMAIL BLAST TO ALL JAMAICA!</strong><br/>
                    Every person gets excited! Everyone downloads YaadFlex!<br/>
                    <span className="text-yellow-400">💥 SHAKE UP THE WHOLE ISLAND! 💥</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setLocation('/email-campaign')}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-3xl px-12 py-6 rounded-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-red-400/80"
                    data-testid="button-launch-email-campaign"
                  >
                    📧 LAUNCH EMAIL CAMPAIGN! 📧
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== GLOBAL APP STORE DOMINATION - EVERYWHERE! ========== */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-blue-900/95 via-green-900/95 to-purple-900/95 border-8 border-blue-400/100 relative overflow-hidden min-h-[800px] shadow-2xl shadow-blue-500/80" data-testid="global-app-stores-section">
            {/* GLOBAL Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 text-8xl animate-bounce">🌍</div>
              <div className="absolute top-4 right-4 text-8xl animate-pulse">📱</div>
              <div className="absolute bottom-4 left-4 text-8xl animate-bounce delay-300">🚀</div>
              <div className="absolute bottom-4 right-4 text-8xl animate-pulse delay-500">🏪</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-12xl animate-pulse delay-200">🌎</div>
            </div>
            
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-center space-y-6">
                <div className="text-4xl md:text-8xl font-black text-blue-400 animate-pulse leading-tight">
                  🌍 ALL APP STORES WORLDWIDE! 🌍
                </div>
                <div className="text-2xl md:text-6xl font-black text-green-300 animate-bounce leading-tight">
                  YARDFLEX ON EVERY PLATFORM!
                </div>
                <div className="text-xl md:text-4xl font-black text-white animate-pulse">
                  JAMAICA → AMERICA → AFRICA → ASIA!
                </div>
                <div className="text-lg md:text-3xl font-black text-yellow-400 animate-bounce">
                  🚀 GLOBAL DOMINATION PLAN! 🚀
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              {/* EXPANSION PHASES */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-600/70 to-yellow-600/70 border-4 border-green-400/80 rounded-2xl p-6 text-center transform hover:scale-110 transition-all">
                  <div className="text-6xl mb-4 animate-bounce">🇯🇲</div>
                  <div className="text-2xl font-black text-green-300 mb-2">PHASE 1</div>
                  <div className="text-xl font-bold text-white">JAMAICA</div>
                  <div className="text-lg text-green-200">Launch First!</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600/70 to-red-600/70 border-4 border-blue-400/80 rounded-2xl p-6 text-center transform hover:scale-110 transition-all">
                  <div className="text-6xl mb-4 animate-pulse">🇺🇸</div>
                  <div className="text-2xl font-black text-blue-300 mb-2">PHASE 2</div>
                  <div className="text-xl font-bold text-white">AMERICA</div>
                  <div className="text-lg text-blue-200">Massive Market!</div>
                </div>
                <div className="bg-gradient-to-br from-orange-600/70 to-red-600/70 border-4 border-orange-400/80 rounded-2xl p-6 text-center transform hover:scale-110 transition-all">
                  <div className="text-6xl mb-4 animate-bounce delay-200">🌍</div>
                  <div className="text-2xl font-black text-orange-300 mb-2">PHASE 3</div>
                  <div className="text-xl font-bold text-white">AFRICA</div>
                  <div className="text-lg text-orange-200">Huge Growth!</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/70 to-pink-600/70 border-4 border-purple-400/80 rounded-2xl p-6 text-center transform hover:scale-110 transition-all">
                  <div className="text-6xl mb-4 animate-pulse delay-300">🌏</div>
                  <div className="text-2xl font-black text-purple-300 mb-2">PHASE 4</div>
                  <div className="text-xl font-bold text-white">ASIA</div>
                  <div className="text-lg text-purple-200">Billions of Users!</div>
                </div>
              </div>

              {/* ALL APP STORES */}
              <div className="bg-gradient-to-r from-blue-600/50 to-purple-600/50 border-2 border-blue-400/70 rounded-2xl p-8 text-center shadow-2xl shadow-blue-500/30">
                <h3 className="text-2xl md:text-5xl font-black text-blue-300 mb-6 animate-pulse leading-tight">
                  📱 ALL APP STORES WORLDWIDE! 📱
                </h3>
                
                {/* MAJOR GLOBAL STORES */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-black/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-gray-400/70">
                    <div className="text-4xl md:text-6xl mb-2">🍎</div>
                    <div className="text-lg md:text-xl font-black text-white">iOS APP STORE</div>
                    <div className="text-sm text-gray-300">iPhone/iPad Global</div>
                  </div>
                  <div className="bg-green-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-green-400/70">
                    <div className="text-4xl md:text-6xl mb-2">🤖</div>
                    <div className="text-lg md:text-xl font-black text-green-300">GOOGLE PLAY</div>
                    <div className="text-sm text-green-200">Android Global</div>
                  </div>
                  <div className="bg-blue-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-blue-400/70">
                    <div className="text-4xl md:text-6xl mb-2">💻</div>
                    <div className="text-lg md:text-xl font-black text-blue-300">MICROSOFT</div>
                    <div className="text-sm text-blue-200">Windows Store</div>
                  </div>
                  <div className="bg-purple-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-purple-400/70">
                    <div className="text-4xl md:text-6xl mb-2">📱</div>
                    <div className="text-lg md:text-xl font-black text-purple-300">SAMSUNG</div>
                    <div className="text-sm text-purple-200">Galaxy Store</div>
                  </div>
                  <div className="bg-orange-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-orange-400/70">
                    <div className="text-4xl md:text-6xl mb-2">🏪</div>
                    <div className="text-lg md:text-xl font-black text-orange-300">AMAZON</div>
                    <div className="text-sm text-orange-200">Appstore</div>
                  </div>
                  <div className="bg-red-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-red-400/70">
                    <div className="text-4xl md:text-6xl mb-2">🌐</div>
                    <div className="text-lg md:text-xl font-black text-red-300">WEB APP</div>
                    <div className="text-sm text-red-200">All Browsers</div>
                  </div>
                </div>

                {/* REGIONAL STORES */}
                <div className="bg-gradient-to-r from-yellow-600/50 to-green-600/50 border-4 border-yellow-400/80 rounded-2xl p-6 mb-6">
                  <h4 className="text-2xl md:text-4xl font-black text-yellow-300 mb-4">🌍 REGIONAL APP STORES! 🌍</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-white font-bold">
                    <div>🇯🇲 Caribbean Markets</div>
                    <div>🇺🇸 US Regional Stores</div>
                    <div>🇨🇦 Canadian Stores</div>
                    <div>🇬🇧 UK App Markets</div>
                    <div>🇳🇬 African App Stores</div>
                    <div>🇿🇦 South African Markets</div>
                    <div>🇨🇳 Chinese App Stores</div>
                    <div>🇮🇳 Indian App Markets</div>
                    <div>🇯🇵 Japanese Stores</div>
                    <div>🇰🇷 Korean App Markets</div>
                    <div>🇧🇷 Latin American</div>
                    <div>🇪🇺 European Markets</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-4 border-purple-400/80 rounded-2xl p-6 mb-8 animate-pulse">
                  <h4 className="text-2xl md:text-4xl font-black text-purple-300 mb-4">🚀 TOTAL GLOBAL COVERAGE! 🚀</h4>
                  <div className="text-white text-lg md:text-xl font-bold">
                    <strong>YARDFLEX EVERYWHERE!</strong><br/>
                    Every phone, every platform, every country!<br/>
                    <span className="text-yellow-400">🌍 COMPLETE WORLD DOMINATION! 🌍</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setLocation('/global-deployment')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-3xl px-12 py-6 rounded-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-blue-400/80"
                    data-testid="button-deploy-global"
                  >
                    🌍 DEPLOY WORLDWIDE! 🌍
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== AI ASSISTANT - HANDLES EVERYTHING INSTANTLY! ========== */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-cyan-900/95 via-blue-900/95 to-purple-900/95 border-8 border-cyan-400/100 relative overflow-hidden min-h-[700px] shadow-2xl shadow-cyan-500/80" data-testid="ai-assistant-section">
            {/* AI Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 text-8xl animate-bounce">🤖</div>
              <div className="absolute top-4 right-4 text-8xl animate-pulse">✨</div>
              <div className="absolute bottom-4 left-4 text-8xl animate-bounce delay-300">🎯</div>
              <div className="absolute bottom-4 right-4 text-8xl animate-pulse delay-500">🚀</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-12xl animate-pulse delay-200">🧠</div>
            </div>
            
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-center space-y-6">
                <div className="text-4xl md:text-8xl font-black text-cyan-400 animate-pulse leading-tight">
                  🤖 AI ASSISTANT FOR EVERYTHING! 🤖
                </div>
                <div className="text-2xl md:text-6xl font-black text-blue-300 animate-bounce leading-tight">
                  ANYTHING YOU WANT - INSTANT!
                </div>
                <div className="text-xl md:text-4xl font-black text-white animate-pulse">
                  POOLS! TOOLS! PARTIES! TAXIS! ANYTHING!
                </div>
                <div className="text-lg md:text-3xl font-black text-yellow-400 animate-bounce">
                  🧠 NO STRESS - EVERYTHING POPS UP! 🧠
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="bg-gradient-to-r from-cyan-600/50 to-blue-600/50 border-2 border-cyan-400/70 rounded-2xl p-8 text-center shadow-2xl shadow-cyan-500/30">
                <h3 className="text-2xl md:text-5xl font-black text-cyan-300 mb-6 animate-pulse leading-tight">
                  🎯 INTELLIGENT SYSTEM - HANDLES ANYTHING! 🎯
                </h3>
                <p className="text-white text-lg md:text-2xl mb-8 font-bold leading-relaxed">
                  <strong className="text-cyan-400">WANT POOL TOOLS?</strong> → System finds them instantly!<br/>
                  <strong className="text-blue-400">NEED PARTY SUPPLIES?</strong> → Everything pops up!<br/>
                  <strong className="text-green-400">WANT A TAXI?</strong> → Car appears immediately!<br/>
                  <strong className="text-purple-400">ANYTHING ELSE?</strong> → AI assistant handles it!<br/>
                  <strong className="text-yellow-400 text-xl md:text-3xl animate-bounce">🤖 YOUR PERSONAL ASSISTANT! 🤖</strong>
                </p>
                
                {/* AI Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-cyan-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-cyan-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce">🏊‍♂️</div>
                    <div className="text-lg md:text-xl font-black text-cyan-300">POOLS</div>
                    <div className="text-sm text-cyan-200">Tools, cleaning, parties</div>
                  </div>
                  <div className="bg-blue-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-blue-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse">🔧</div>
                    <div className="text-lg md:text-xl font-black text-blue-300">TOOLS</div>
                    <div className="text-sm text-blue-200">Any equipment needed</div>
                  </div>
                  <div className="bg-purple-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-purple-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce delay-200">🎉</div>
                    <div className="text-lg md:text-xl font-black text-purple-300">PARTIES</div>
                    <div className="text-sm text-purple-200">Everything for events</div>
                  </div>
                  <div className="bg-green-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-green-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse delay-300">🚖</div>
                    <div className="text-lg md:text-xl font-black text-green-300">TAXIS</div>
                    <div className="text-sm text-green-200">Transportation instantly</div>
                  </div>
                </div>

                {/* INSTANT RESPONSE SYSTEM */}
                <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-4 border-purple-400/80 rounded-2xl p-6 mb-8">
                  <h4 className="text-2xl md:text-4xl font-black text-purple-300 mb-4">⚡ INSTANT RESPONSE SYSTEM! ⚡</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white font-bold">
                    <div className="bg-purple-700/50 rounded-xl p-4">
                      <div className="text-4xl mb-2">💭</div>
                      <div className="text-xl font-black text-purple-200">YOU THINK IT</div>
                      <div className="text-sm">Want something? Just ask!</div>
                    </div>
                    <div className="bg-blue-700/50 rounded-xl p-4">
                      <div className="text-4xl mb-2">⚡</div>
                      <div className="text-xl font-black text-blue-200">IT POPS UP</div>
                      <div className="text-sm">System responds instantly!</div>
                    </div>
                    <div className="bg-green-700/50 rounded-xl p-4">
                      <div className="text-4xl mb-2">✅</div>
                      <div className="text-xl font-black text-green-200">YOU GET IT</div>
                      <div className="text-sm">No stress, everything handled!</div>
                    </div>
                  </div>
                </div>

                {/* COMPREHENSIVE AI SERVICES */}
                <div className="bg-gradient-to-r from-orange-600/50 to-red-600/50 border-4 border-orange-400/80 rounded-2xl p-6 mb-8">
                  <h4 className="text-2xl md:text-4xl font-black text-orange-300 mb-4">🧠 AI HANDLES EVERYTHING! 🧠</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-white font-bold text-sm">
                    <div>🏊‍♂️ Pool maintenance</div>
                    <div>🔧 Tool rentals</div>
                    <div>🎉 Party planning</div>
                    <div>🚖 Transportation</div>
                    <div>🏠 Home services</div>
                    <div>🍕 Food delivery</div>
                    <div>🛒 Shopping</div>
                    <div>💼 Business services</div>
                    <div>🎵 Entertainment</div>
                    <div>🧹 Cleaning</div>
                    <div>🔌 Repairs</div>
                    <div>📱 Tech support</div>
                    <div>🎯 Anything else!</div>
                    <div>✨ Magic happens!</div>
                    <div>🚀 Instant results!</div>
                    <div>😊 No stress ever!</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-600/50 to-orange-600/50 border-4 border-yellow-400/80 rounded-2xl p-6 mb-8 animate-pulse">
                  <h4 className="text-2xl md:text-4xl font-black text-yellow-300 mb-4">🤖 YOUR PERSONAL AI ASSISTANT! 🤖</h4>
                  <div className="text-white text-lg md:text-xl font-bold">
                    <strong>WHATEVER YOU WANT!</strong><br/>
                    Just tell YaadFlex and it happens instantly!<br/>
                    <span className="text-cyan-400">🧠 NO STRESS - EVERYTHING AUTOMATIC! 🧠</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setLocation('/ai-assistant')}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-3xl px-12 py-6 rounded-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-cyan-400/80"
                    data-testid="button-ai-assistant"
                  >
                    🤖 ASK AI ANYTHING! 🤖
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== FAIR TAXI PRICING - JUSTICE FOR ALL! ========== */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-green-900/95 via-yellow-900/95 to-orange-900/95 border-8 border-green-400/100 relative overflow-hidden min-h-[800px] shadow-2xl shadow-green-500/80" data-testid="fair-taxi-pricing-section">
            {/* FAIR PRICING Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 text-8xl animate-bounce">🚖</div>
              <div className="absolute top-4 right-4 text-8xl animate-pulse">⚖️</div>
              <div className="absolute bottom-4 left-4 text-8xl animate-bounce delay-300">💰</div>
              <div className="absolute bottom-4 right-4 text-8xl animate-pulse delay-500">🤝</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-12xl animate-pulse delay-200">💚</div>
            </div>
            
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-center space-y-6">
                <div className="text-4xl md:text-8xl font-black text-green-400 animate-pulse leading-tight">
                  ⚖️ THE FAIR ALTERNATIVE! ⚖️
                </div>
                <div className="text-2xl md:text-6xl font-black text-yellow-300 animate-bounce leading-tight">
                  JUSTICE FOR DRIVERS & PASSENGERS!
                </div>
                <div className="text-xl md:text-4xl font-black text-white animate-pulse">
                  COMPETITIVE PRICES + MORE MONEY FOR DRIVERS!
                </div>
                <div className="text-lg md:text-3xl font-black text-orange-400 animate-bounce">
                  💚 FAIR FOR EVERYONE - NO GREED! 💚
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="bg-gradient-to-r from-green-600/50 to-yellow-600/50 border-2 border-green-400/70 rounded-2xl p-8 text-center shadow-2xl shadow-green-500/30">
                <h3 className="text-2xl md:text-5xl font-black text-green-300 mb-6 animate-pulse leading-tight">
                  🚖 YARDFLEX TAXI PRICING SYSTEM! 🚖
                </h3>

                {/* PRICING COMPARISON */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-red-600/70 border-4 border-red-400/80 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-4">😞</div>
                    <div className="text-2xl font-black text-red-300 mb-2">OTHER APPS</div>
                    <div className="text-white font-bold">
                      ❌ High prices for passengers<br/>
                      ❌ Low pay for drivers<br/>
                      ❌ Company takes 25-30%<br/>
                      ❌ No transparency
                    </div>
                  </div>
                  <div className="bg-green-600/70 border-4 border-green-400/80 rounded-2xl p-6 text-center transform scale-110">
                    <div className="text-4xl mb-4 animate-bounce">🎯</div>
                    <div className="text-2xl font-black text-green-300 mb-2">YARDFLEX</div>
                    <div className="text-white font-bold">
                      ✅ Competitive prices<br/>
                      ✅ Drivers keep 85%!<br/>
                      ✅ Only 15% platform fee<br/>
                      ✅ 100% transparent
                    </div>
                  </div>
                  <div className="bg-blue-600/70 border-4 border-blue-400/80 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-4">🤔</div>
                    <div className="text-2xl font-black text-blue-300 mb-2">TRADITIONAL TAXI</div>
                    <div className="text-white font-bold">
                      ⚠️ Fixed high prices<br/>
                      ⚠️ No tracking<br/>
                      ⚠️ Cash only<br/>
                      ⚠️ No safety features
                    </div>
                  </div>
                </div>

                {/* DRIVER BENEFITS */}
                <div className="bg-gradient-to-r from-blue-600/50 to-green-600/50 border-4 border-blue-400/80 rounded-2xl p-6 mb-8">
                  <h4 className="text-2xl md:text-4xl font-black text-blue-300 mb-6">🚗 DRIVER BENEFITS - MORE MONEY! 🚗</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white font-bold">
                    <div className="bg-green-700/60 rounded-xl p-4">
                      <div className="text-3xl mb-2">💰</div>
                      <div className="text-xl font-black text-green-200 mb-2">KEEP 85% OF FARE!</div>
                      <div className="text-sm">Other apps take 25-30%, we only take 15%!</div>
                    </div>
                    <div className="bg-blue-700/60 rounded-xl p-4">
                      <div className="text-3xl mb-2">🛡️</div>
                      <div className="text-xl font-black text-blue-200 mb-2">SMART CAR PROTECTION</div>
                      <div className="text-sm">Vehicle monitoring keeps your car safe!</div>
                    </div>
                    <div className="bg-purple-700/60 rounded-xl p-4">
                      <div className="text-3xl mb-2">📱</div>
                      <div className="text-xl font-black text-purple-200 mb-2">INSTANT PAYMENTS</div>
                      <div className="text-sm">Get paid immediately after each ride!</div>
                    </div>
                    <div className="bg-orange-700/60 rounded-xl p-4">
                      <div className="text-3xl mb-2">🎯</div>
                      <div className="text-xl font-black text-orange-200 mb-2">MORE RIDES</div>
                      <div className="text-sm">AI system gets you more customers!</div>
                    </div>
                  </div>
                </div>

                {/* PASSENGER BENEFITS */}
                <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-4 border-purple-400/80 rounded-2xl p-6 mb-8">
                  <h4 className="text-2xl md:text-4xl font-black text-purple-300 mb-6">👥 PASSENGER BENEFITS - FAIR PRICES! 👥</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white font-bold">
                    <div className="bg-green-700/60 rounded-xl p-4">
                      <div className="text-3xl mb-2">💵</div>
                      <div className="text-xl font-black text-green-200 mb-2">COMPETITIVE PRICING</div>
                      <div className="text-sm">Same as Uber prices but better service!</div>
                    </div>
                    <div className="bg-blue-700/60 rounded-xl p-4">
                      <div className="text-3xl mb-2">⚖️</div>
                      <div className="text-xl font-black text-blue-200 mb-2">100% TRANSPARENT</div>
                      <div className="text-sm">See exactly how your fare is calculated!</div>
                    </div>
                    <div className="bg-purple-700/60 rounded-xl p-4">
                      <div className="text-3xl mb-2">🛡️</div>
                      <div className="text-xl font-black text-purple-200 mb-2">SAFER RIDES</div>
                      <div className="text-sm">Smart car control monitors your safety!</div>
                    </div>
                    <div className="bg-orange-700/60 rounded-xl p-4">
                      <div className="text-3xl mb-2">🚀</div>
                      <div className="text-xl font-black text-orange-200 mb-2">BETTER DRIVERS</div>
                      <div className="text-sm">Happy drivers = better service for you!</div>
                    </div>
                  </div>
                </div>

                {/* PRICING EXPLANATION */}
                <div className="bg-gradient-to-r from-yellow-600/50 to-orange-600/50 border-4 border-yellow-400/80 rounded-2xl p-6 mb-8 animate-pulse">
                  <h4 className="text-2xl md:text-4xl font-black text-yellow-300 mb-4">🤝 WHY YARDFLEX IS BETTER! 🤝</h4>
                  <div className="text-white text-lg md:text-xl font-bold text-left">
                    <div className="mb-4"><strong className="text-green-400">FOR DRIVERS:</strong> We only take 15% instead of 25-30% like other apps. You make more money from every ride!</div>
                    <div className="mb-4"><strong className="text-blue-400">FOR PASSENGERS:</strong> Same competitive prices as Uber, but your money supports local drivers better!</div>
                    <div className="mb-4"><strong className="text-purple-400">FOR JAMAICA:</strong> Money stays in Jamaica! Drivers earn more, economy grows stronger!</div>
                    <div className="text-center"><span className="text-yellow-400 text-2xl animate-bounce">💚 EVERYONE WINS! 💚</span></div>
                  </div>
                </div>

                {/* SAMPLE PRICING */}
                <div className="bg-gradient-to-r from-cyan-600/50 to-blue-600/50 border-4 border-cyan-400/80 rounded-2xl p-6 mb-8">
                  <h4 className="text-2xl md:text-4xl font-black text-cyan-300 mb-4">💰 SAMPLE JAMAICA TAXI PRICING! 💰</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white font-bold">
                    <div className="bg-cyan-700/60 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-cyan-200 mb-2">SHORT RIDE</div>
                      <div className="text-3xl text-green-400">$500 JMD</div>
                      <div className="text-sm">Driver keeps: $425 JMD</div>
                      <div className="text-xs text-cyan-300">Platform: $75 JMD</div>
                    </div>
                    <div className="bg-blue-700/60 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-blue-200 mb-2">MEDIUM RIDE</div>
                      <div className="text-3xl text-green-400">$1,200 JMD</div>
                      <div className="text-sm">Driver keeps: $1,020 JMD</div>
                      <div className="text-xs text-blue-300">Platform: $180 JMD</div>
                    </div>
                    <div className="bg-purple-700/60 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-purple-200 mb-2">LONG RIDE</div>
                      <div className="text-3xl text-green-400">$2,500 JMD</div>
                      <div className="text-sm">Driver keeps: $2,125 JMD</div>
                      <div className="text-xs text-purple-300">Platform: $375 JMD</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setLocation('/taxi-pricing')}
                    className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white text-3xl px-12 py-6 rounded-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-green-400/80"
                    data-testid="button-fair-taxi-pricing"
                  >
                    🚖 SEE FAIR PRICING! 🚖
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== UNIVERSAL BOOKING PLATFORM - EVERYTHING! ========== */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-red-900/95 border-8 border-purple-400/100 relative overflow-hidden min-h-[700px] shadow-2xl shadow-purple-500/80" data-testid="mega-booking-platform-section">
            {/* EXPLOSIVE Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 text-8xl animate-bounce">🎭</div>
              <div className="absolute top-4 right-4 text-8xl animate-pulse">✈️</div>
              <div className="absolute bottom-4 left-4 text-8xl animate-bounce delay-300">🏨</div>
              <div className="absolute bottom-4 right-4 text-8xl animate-pulse delay-500">🎉</div>
              <div className="absolute top-1/3 left-1/6 text-7xl animate-spin slow-spin">🎵</div>
              <div className="absolute bottom-1/3 right-1/6 text-7xl animate-bounce delay-700">📅</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-12xl animate-pulse delay-200">🌟</div>
            </div>
            
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-center space-y-6">
                <div className="text-4xl md:text-8xl font-black text-purple-400 animate-pulse leading-tight">
                  📅 YARDFLEX BOOKS EVERYTHING! 📅
                </div>
                <div className="text-2xl md:text-6xl font-black text-pink-300 animate-bounce leading-tight">
                  THE ULTIMATE BOOKING PLATFORM!
                </div>
                <div className="text-xl md:text-4xl font-black text-white animate-pulse">
                  ENTERTAINERS • HOTELS • FLIGHTS • PARTIES!
                </div>
                <div className="text-lg md:text-3xl font-black text-red-400 animate-bounce">
                  📅 BOOK EVERYTHING IN ONE PLACE! 📅
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-2 border-purple-400/70 rounded-2xl p-8 text-center shadow-2xl shadow-purple-500/30">
                <h3 className="text-2xl md:text-5xl font-black text-purple-300 mb-6 animate-pulse leading-tight">
                  🎯 WANT TO BOOK SOMETHING? IT'S HERE! 🎯
                </h3>
                <p className="text-white text-lg md:text-2xl mb-8 font-bold leading-relaxed">
                  <strong className="text-yellow-400">NEED ENTERTAINER?</strong> → Book on YaadFlex!<br/>
                  <strong className="text-blue-400">WANT HOTEL ROOM?</strong> → Book here!<br/>
                  <strong className="text-green-400">NEED PLANE TICKET?</strong> → Book right here!<br/>
                  <strong className="text-purple-400">PLANNING PARTY?</strong> → Book everything here!<br/>
                  <strong className="text-red-400 text-xl md:text-3xl animate-bounce">📅 ALL BOOKINGS IN ONE PLACE! 📅</strong>
                </p>
                
                {/* Booking Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-purple-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-purple-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce">🎭</div>
                    <div className="text-lg md:text-xl font-black text-purple-300">ENTERTAINERS</div>
                    <div className="text-sm text-purple-200">DJs, Models, Performers</div>
                  </div>
                  <div className="bg-blue-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-blue-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse">✈️</div>
                    <div className="text-lg md:text-xl font-black text-blue-300">TRAVEL</div>
                    <div className="text-sm text-blue-200">Hotels, Flights, Packages</div>
                  </div>
                  <div className="bg-pink-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-pink-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce delay-200">🎉</div>
                    <div className="text-lg md:text-xl font-black text-pink-300">PARTIES</div>
                    <div className="text-sm text-pink-200">Complete Party Setup</div>
                  </div>
                  <div className="bg-green-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-green-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse delay-300">🎵</div>
                    <div className="text-lg md:text-xl font-black text-green-300">SOUND</div>
                    <div className="text-sm text-green-200">Sound Systems, Equipment</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-600/50 to-orange-600/50 border-4 border-yellow-400/80 rounded-2xl p-6 mb-8 animate-pulse">
                  <h4 className="text-2xl md:text-4xl font-black text-yellow-300 mb-4">📅 ONE PLACE FOR EVERYTHING! 📅</h4>
                  <div className="text-white text-lg md:text-xl font-bold">
                    <strong>YARDFLEX IS THE BOOKING PLATFORM FOR JAMAICA & CANADA!</strong><br/>
                    Need anything? Book it here! We have EVERYTHING!<br/>
                    <span className="text-yellow-400">🌟 ALL BOOKINGS, ONE APP, TWO COUNTRIES! 🌟</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setLocation('/bookings')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-3xl px-12 py-6 rounded-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-purple-400/80"
                    data-testid="button-enter-booking-platform"
                  >
                    📅 BOOK EVERYTHING NOW! 📅
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== RENTAL EMPIRE CONTROLS EVERYTHING! ========== */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-green-900/95 via-blue-900/95 to-purple-900/95 border-8 border-yellow-400/100 relative overflow-hidden min-h-[600px] shadow-2xl shadow-green-500/80" data-testid="mega-rental-empire-section">
            {/* EXPLOSIVE Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 text-8xl animate-bounce">🏠</div>
              <div className="absolute top-4 right-4 text-8xl animate-pulse">🚗</div>
              <div className="absolute bottom-4 left-4 text-8xl animate-bounce delay-300">🏢</div>
              <div className="absolute bottom-4 right-4 text-8xl animate-pulse delay-500">🏊‍♀️</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-12xl animate-pulse delay-200">⚡</div>
            </div>
            
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-center space-y-6">
                <div className="text-4xl md:text-8xl font-black text-yellow-400 animate-pulse leading-tight">
                  🏠 YARDFLEX RENTAL EMPIRE! 🚗
                </div>
                <div className="text-2xl md:text-6xl font-black text-green-300 animate-bounce leading-tight">
                  PEER-TO-PEER TOOL SHARING MARKETPLACE!
                </div>
                <div className="text-xl md:text-4xl font-black text-white animate-pulse">
                  TOOLS • EQUIPMENT • ANYTHING YOU'RE NOT USING!
                </div>
                <div className="text-lg md:text-3xl font-black text-blue-400 animate-bounce">
                  🔧 IDLE TOOLS = INSTANT INCOME! 🔧
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="bg-gradient-to-r from-green-600/50 to-blue-600/50 border-2 border-green-400/70 rounded-2xl p-8 text-center shadow-2xl shadow-green-500/30">
                <h3 className="text-2xl md:text-5xl font-black text-green-300 mb-6 animate-pulse leading-tight">
                  🔧 TURN YOUR UNUSED TOOLS INTO MONEY! 🔧
                </h3>
                <p className="text-white text-lg md:text-2xl mb-8 font-bold leading-relaxed">
                  <strong className="text-yellow-400">POWER TOOLS SITTING IDLE?</strong> → List them for rent!<br/>
                  <strong className="text-blue-400">EQUIPMENT COLLECTING DUST?</strong> → Let neighbors pay to use!<br/>
                  <strong className="text-green-400">TOOLS YOU RARELY USE?</strong> → Turn into steady income!<br/>
                  <strong className="text-purple-400">NEED TOOLS FOR PROJECT?</strong> → Rent from locals nearby!<br/>
                  <strong className="text-red-400 text-xl md:text-3xl animate-bounce">🔧 COMMUNITY TOOL SHARING ECONOMY! 🔧</strong>
                </p>
                
                {/* SMART CAR CONTROL HIGHLIGHT */}
                <div className="bg-gradient-to-r from-red-600/50 to-orange-600/50 border-4 border-red-400/80 rounded-2xl p-6 mb-8 animate-pulse">
                  <h4 className="text-2xl md:text-4xl font-black text-red-300 mb-4">🚗⚡ SMART CAR CONTROL! ⚡🚗</h4>
                  <div className="text-white text-lg md:text-xl font-bold">
                    <strong>YARDFLEX CONTROLS HOW PEOPLE DRIVE YOUR RENTAL CAR!</strong><br/>
                    Bad driving? Car slows down + Driver gets warning!<br/>
                    <span className="text-yellow-400">🛡️ PROTECT YOUR CAR FROM DAMAGE! 🛡️</span>
                  </div>
                </div>
                
                {/* Tool & Equipment Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-orange-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-orange-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce">🔨</div>
                    <div className="text-lg md:text-xl font-black text-orange-300">POWER TOOLS</div>
                  </div>
                  <div className="bg-blue-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-blue-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse">⚙️</div>
                    <div className="text-lg md:text-xl font-black text-blue-300">EQUIPMENT</div>
                  </div>
                  <div className="bg-green-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-green-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce delay-200">🚗</div>
                    <div className="text-lg md:text-xl font-black text-green-300">VEHICLES</div>
                  </div>
                  <div className="bg-purple-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-purple-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse delay-300">🏡</div>
                    <div className="text-lg md:text-xl font-black text-purple-300">HOME & GARDEN</div>
                  </div>
                  <div className="bg-cyan-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-cyan-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-bounce delay-400">🎵</div>
                    <div className="text-lg md:text-xl font-black text-cyan-300">SOUND SYSTEMS</div>
                  </div>
                  <div className="bg-yellow-600/60 rounded-xl p-4 text-center transform hover:scale-110 transition-all border-2 border-yellow-400/70">
                    <div className="text-4xl md:text-6xl mb-2 animate-pulse delay-500">🔧</div>
                    <div className="text-lg md:text-xl font-black text-yellow-300">ANYTHING!</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setLocation('/rental-empire')}
                    className="bg-gradient-to-r from-yellow-600 to-green-600 hover:from-yellow-700 hover:to-green-700 text-white text-3xl px-12 py-6 rounded-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-yellow-400/80"
                    data-testid="button-enter-rental-empire-mega"
                  >
                    🏠 ENTER RENTAL EMPIRE NOW! 🚗
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========== ABSOLUTELY EXPLOSIVE SOCIAL COMMERCE - TAKING OVER THE ENTIRE PAGE! ========== */}
        <div className="mb-20">
          <Card className="bg-gradient-to-br from-pink-900/95 via-purple-900/95 via-red-900/95 to-orange-900/95 border-8 border-pink-400/100 relative overflow-hidden min-h-[1800px] shadow-2xl shadow-pink-500/80" data-testid="mega-social-commerce-explosion">
            {/* ABSOLUTELY EXPLOSIVE Animated Background - EVERYWHERE! */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-4 left-4 text-9xl animate-bounce">🔥</div>
              <div className="absolute top-4 right-4 text-9xl animate-pulse">💥</div>
              <div className="absolute bottom-4 left-4 text-9xl animate-bounce delay-300">⚡</div>
              <div className="absolute bottom-4 right-4 text-9xl animate-pulse delay-500">🚀</div>
              <div className="absolute top-1/4 left-1/6 text-8xl animate-spin slow-spin">📱</div>
              <div className="absolute top-3/4 right-1/6 text-8xl animate-bounce delay-700">💰</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-12xl animate-pulse delay-200">🌟</div>
              <div className="absolute top-1/6 right-1/3 text-7xl animate-bounce delay-1000">📘</div>
              <div className="absolute bottom-1/6 left-1/3 text-7xl animate-pulse delay-1200">📸</div>
              <div className="absolute top-2/3 left-1/6 text-7xl animate-bounce delay-1400">🎵</div>
              <div className="absolute top-1/3 right-1/6 text-7xl animate-pulse delay-1600">📧</div>
              <div className="absolute top-1/8 left-1/2 text-6xl animate-bounce delay-800">🗣️</div>
              <div className="absolute bottom-1/8 right-1/2 text-6xl animate-pulse delay-900">🌍</div>
            </div>
            
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-center space-y-8">
                <div className="text-5xl md:text-9xl font-black text-pink-300 animate-pulse leading-tight">
                  🔥💥 YARDFLEX SOCIAL COMMERCE 💥🔥
                </div>
                <div className="text-3xl md:text-7xl font-black text-yellow-400 animate-bounce leading-tight">
                  GET YOUR BUSINESS EVERYWHERE!
                </div>
                <div className="text-2xl md:text-6xl font-black text-white animate-pulse">
                  FACEBOOK • INSTAGRAM • TIKTOK • TELEGRAM!
                </div>
                <div className="text-xl md:text-5xl font-black text-red-400 animate-bounce">
                  ALL OVER THE PLACE TELLING EVERYONE ABOUT YOU!
                </div>
                <div className="text-lg md:text-4xl font-black text-green-400 animate-pulse">
                  🗣️ YOUR BUSINESS TALKING TO THE WHOLE WORLD! 🗣️
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-8">
              
              {/* MASSIVE MAIN ATTRACTION SECTION */}
              <div className="bg-gradient-to-r from-red-600/50 to-pink-600/50 border-2 border-red-400/70 rounded-2xl p-12 text-center mb-8 shadow-2xl shadow-red-500/30">
                <h3 className="text-3xl md:text-7xl font-black text-red-300 mb-6 md:mb-8 animate-pulse leading-tight">
                  🌍 TELL THE WORLD ABOUT YOURSELF! 🌍
                </h3>
                <p className="text-white text-lg md:text-3xl mb-8 md:mb-10 leading-relaxed font-bold">
                  <strong>CREATE YOUR BUSINESS PROFILE AND YARDFLEX AUTOMATICALLY POSTS EVERYWHERE!</strong><br/>
                  <strong>FACEBOOK! INSTAGRAM! TIKTOK! TELEGRAM! ALL PLATFORMS!</strong><br/>
                  <strong>YOUR BUSINESS WILL BE ALL OVER THE PLACE TELLING EVERYONE ABOUT ITSELF!</strong><br/>
                  <strong className="text-yellow-400 text-xl md:text-4xl animate-bounce">🗣️ YOUR BUSINESS TALKING TO THE WORLD! 🗣️</strong>
                </p>
                
                {/* EXPLOSIVE Social Media Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
                  <div className="bg-blue-600/60 rounded-xl md:rounded-2xl p-4 md:p-8 text-center transform hover:scale-110 md:hover:scale-125 transition-all shadow-2xl shadow-blue-500/50 border-2 border-blue-400/70">
                    <div className="text-4xl md:text-8xl mb-2 md:mb-4 animate-bounce">📘</div>
                    <div className="text-lg md:text-3xl font-black text-blue-300">FACEBOOK</div>
                    <div className="text-sm md:text-lg text-white font-bold">TELLING EVERYONE!</div>
                    <div className="text-xs md:text-sm text-blue-200">Auto-Post Daily</div>
                  </div>
                  <div className="bg-purple-600/60 rounded-xl md:rounded-2xl p-4 md:p-8 text-center transform hover:scale-110 md:hover:scale-125 transition-all shadow-2xl shadow-purple-500/50 border-2 border-purple-400/70">
                    <div className="text-4xl md:text-8xl mb-2 md:mb-4 animate-pulse">📸</div>
                    <div className="text-lg md:text-3xl font-black text-purple-300">INSTAGRAM</div>
                    <div className="text-sm md:text-lg text-white font-bold">SHOWING YOUR WORK!</div>
                    <div className="text-xs md:text-sm text-purple-200">Stories & Posts</div>
                  </div>
                  <div className="bg-pink-600/60 rounded-xl md:rounded-2xl p-4 md:p-8 text-center transform hover:scale-110 md:hover:scale-125 transition-all shadow-2xl shadow-pink-500/50 border-2 border-pink-400/70">
                    <div className="text-4xl md:text-8xl mb-2 md:mb-4 animate-bounce delay-200">🎵</div>
                    <div className="text-lg md:text-3xl font-black text-pink-300">TIKTOK</div>
                    <div className="text-sm md:text-lg text-white font-bold">MAKING YOU FAMOUS!</div>
                    <div className="text-xs md:text-sm text-pink-200">Viral Videos</div>
                  </div>
                  <div className="bg-cyan-600/60 rounded-xl md:rounded-2xl p-4 md:p-8 text-center transform hover:scale-110 md:hover:scale-125 transition-all shadow-2xl shadow-cyan-500/50 border-2 border-cyan-400/70">
                    <div className="text-4xl md:text-8xl mb-2 md:mb-4 animate-pulse delay-300">📧</div>
                    <div className="text-lg md:text-3xl font-black text-cyan-300">TELEGRAM</div>
                    <div className="text-sm md:text-lg text-white font-bold">BRINGING CUSTOMERS!</div>
                    <div className="text-xs md:text-sm text-cyan-200">Instant Messages</div>
                  </div>
                </div>
                
                {/* ABSOLUTELY EXPLOSIVE VIRAL MESSAGING SECTION */}
                <div className="bg-gradient-to-r from-yellow-600/60 to-orange-600/60 border-4 border-yellow-400/80 rounded-2xl p-12 mb-12 shadow-2xl shadow-yellow-500/50">
                  <h4 className="text-4xl md:text-8xl font-black text-yellow-300 mb-8 animate-pulse text-center leading-tight">
                    📢 YOUR BUSINESS EVERYWHERE! 📢
                  </h4>
                  <div className="text-center space-y-6">
                    <div className="text-xl md:text-4xl font-bold text-white animate-bounce bg-blue-600/40 rounded-xl p-4 border-2 border-blue-400/70">
                      🗣️ <strong>FACEBOOK TELLING PEOPLE ABOUT YOU!</strong> 🗣️
                    </div>
                    <div className="text-xl md:text-4xl font-bold text-white animate-pulse bg-purple-600/40 rounded-xl p-4 border-2 border-purple-400/70">
                      📸 <strong>INSTAGRAM SHOWING YOUR AMAZING WORK!</strong> 📸
                    </div>
                    <div className="text-xl md:text-4xl font-bold text-white animate-bounce delay-200 bg-pink-600/40 rounded-xl p-4 border-2 border-pink-400/70">
                      🎵 <strong>TIKTOK MAKING YOU FAMOUS!</strong> 🎵
                    </div>
                    <div className="text-xl md:text-4xl font-bold text-white animate-pulse delay-300 bg-cyan-600/40 rounded-xl p-4 border-2 border-cyan-400/70">
                      📧 <strong>TELEGRAM BRINGING CUSTOMERS TO YOU!</strong> 📧
                    </div>
                    <div className="text-3xl md:text-6xl font-black text-orange-300 animate-bounce mt-8 bg-orange-600/40 rounded-2xl p-6 border-4 border-orange-400/80">
                      🌍 <strong>ALL OVER THE PLACE!</strong> 🌍
                    </div>
                    <div className="text-2xl md:text-5xl font-black text-red-300 animate-pulse mt-6 bg-red-600/40 rounded-2xl p-6 border-4 border-red-400/80">
                      🗣️ <strong>TELLING EVERYONE ABOUT ITSELF!</strong> 🗣️
                    </div>
                  </div>
                </div>
              </div>

              {/* EVERYONE WELCOME SECTION - MAXIMUM EXCITEMENT */}
              <div className="bg-gradient-to-r from-green-600/60 to-emerald-600/60 border-4 border-green-400/80 rounded-2xl p-12 mb-12">
                <h3 className="text-3xl md:text-7xl font-black text-green-300 mb-8 text-center animate-bounce leading-tight">
                  🌈 EVERYBODY CAN BE ON IT! 🌈
                </h3>
                <div className="text-center text-2xl md:text-4xl font-bold text-white mb-8 animate-pulse">
                  <strong>ONCE YOU'RE WILLING TO BE AWESOME!</strong><br/>
                  <strong>EVERYBODY YOU HAVE PAID FOR!</strong>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Regular Services */}
                  <div className="bg-blue-600/30 rounded-xl p-6">
                    <h4 className="text-2xl font-black text-blue-300 mb-4">💼 REGULAR BUSINESSES</h4>
                    <div className="space-y-2 text-white">
                      <div>🚗 Transportation Services</div>
                      <div>🍽️ Food & Restaurant</div>
                      <div>💄 Beauty & Hair</div>
                      <div>🔧 Handyman & Repairs</div>
                      <div>🎵 Entertainment & DJ</div>
                      <div>📚 Education & Tutoring</div>
                    </div>
                  </div>
                  
                  {/* Age-Verified Services */}
                  <div className="bg-purple-600/30 rounded-xl p-6 border border-purple-400/50">
                    <h4 className="text-2xl font-black text-purple-300 mb-4">🔞 AGE-VERIFIED PRIVATE</h4>
                    <div className="space-y-3 text-white">
                      <div className="flex items-center space-x-2">
                        <span>🔐</span>
                        <span><strong>Adults Only - Age Verified</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>🏠</span>
                        <span><strong>Proper Place Required</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>💼</span>
                        <span><strong>Professional Standards</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>🚫</span>
                        <span><strong>NO KIDS - Protected Space</strong></span>
                      </div>
                      <div className="bg-red-600/40 rounded-lg p-3 mt-2">
                        <div className="text-sm font-bold text-red-300">
                          🎯 <strong>SMART ALGORITHM:</strong> Only shown to adults who want to see it
                        </div>
                      </div>
                      <div className="bg-green-600/40 rounded-lg p-3 mt-2">
                        <div className="text-sm font-bold text-green-300">
                          ✅ <strong>RIGHT PEOPLE:</strong> Perfect filtering - not like Facebook
                        </div>
                      </div>
                      <div className="bg-yellow-600/40 rounded-lg p-3 mt-2">
                        <div className="text-sm font-bold text-yellow-200">
                          Special guidelines provided for clean, professional business conduct
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FEATURES SHOWCASE */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-red-600/40 rounded-xl p-4 text-center animate-pulse">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-lg font-bold text-red-300">VIRAL REACH</div>
                  <div className="text-sm text-white">Millions See You</div>
                </div>
                <div className="bg-orange-600/40 rounded-xl p-4 text-center animate-bounce">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-lg font-bold text-orange-300">AUTO-POSTING</div>
                  <div className="text-sm text-white">Everywhere Daily</div>
                </div>
                <div className="bg-green-600/40 rounded-xl p-4 text-center animate-pulse delay-200">
                  <div className="text-4xl mb-2">💰</div>
                  <div className="text-lg font-bold text-green-300">EASY MONEY</div>
                  <div className="text-sm text-white">Get More Customers</div>
                </div>
                <div className="bg-blue-600/40 rounded-xl p-4 text-center animate-bounce delay-300">
                  <div className="text-4xl mb-2">🌟</div>
                  <div className="text-lg font-bold text-blue-300">PROFESSIONAL</div>
                  <div className="text-sm text-white">Clean Standards</div>
                </div>
              </div>

              {/* MASSIVE ACTION BUTTONS */}
              <div className="space-y-8">
                <Button 
                  onClick={() => setLocation('/social-commerce')}
                  className="w-full bg-gradient-to-r from-pink-600 via-red-600 via-orange-600 to-yellow-600 hover:from-pink-700 hover:via-red-700 hover:via-orange-700 hover:to-yellow-700 text-white font-black text-2xl md:text-5xl py-8 md:py-16 px-8 md:px-16 animate-pulse transform hover:scale-110 transition-all shadow-2xl shadow-pink-500/50 border-4 border-yellow-400/60 rounded-2xl md:rounded-3xl"
                  data-testid="button-access-mega-social-commerce"
                >
                  🚀💥 CREATE MY VIRAL BUSINESS NOW! 💥🚀
                  <br />
                  <span className="text-lg md:text-3xl">TELL THE WHOLE WORLD ABOUT YOURSELF!</span>
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button 
                    onClick={() => setLocation('/social-commerce')}
                    variant="outline"
                    className="border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-black font-black text-xl py-6 animate-bounce"
                    data-testid="button-regular-business"
                  >
                    💼 REGULAR BUSINESS PROFILE
                  </Button>
                  <Button 
                    onClick={() => setLocation('/social-commerce')}
                    variant="outline"
                    className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black font-black text-xl py-6 animate-pulse"
                    data-testid="button-private-verified"
                  >
                    🔞 AGE-VERIFIED PRIVATE
                  </Button>
                </div>
              </div>

              {/* MEGA EXPLOSIVE EXCITEMENT FOOTER */}
              <div className="text-center bg-black/60 rounded-2xl p-12 border-4 border-yellow-400/80 shadow-2xl shadow-yellow-500/50">
                <h4 className="text-2xl md:text-6xl font-black text-yellow-400 mb-6 animate-pulse leading-tight">
                  🌟 YOUR BUSINESS WILL BE EVERYWHERE! 🌟
                </h4>
                <p className="text-lg md:text-3xl text-white leading-relaxed font-bold space-y-3">
                  <div className="animate-bounce bg-blue-600/30 rounded-xl p-3 mb-3">
                    <strong>📘 FACEBOOK TELLING PEOPLE ABOUT YOU!</strong>
                  </div>
                  <div className="animate-pulse bg-purple-600/30 rounded-xl p-3 mb-3">
                    <strong>📸 INSTAGRAM SHOWING YOUR WORK!</strong>
                  </div>
                  <div className="animate-bounce bg-pink-600/30 rounded-xl p-3 mb-3">
                    <strong>🎵 TIKTOK MAKING YOU FAMOUS!</strong>
                  </div>
                  <div className="animate-pulse bg-cyan-600/30 rounded-xl p-3 mb-3">
                    <strong>📧 TELEGRAM BRINGING CUSTOMERS!</strong>
                  </div>
                  <div className="text-xl md:text-5xl font-black text-red-400 animate-bounce mt-6 bg-red-600/40 rounded-2xl p-6">
                    🗣️ <strong>ALL OVER THE PLACE - YOUR BUSINESS TALKING TO THE WORLD!</strong> 🗣️
                  </div>
                </p>
              </div>
              
            </CardContent>
          </Card>
        </div>

        {/* ========== COMPLETE RENTAL EMPIRE - EVERYTHING FOR RENT! ========== */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-green-900/40 via-emerald-900/40 to-teal-900/40 border-green-400/50 relative overflow-hidden" data-testid="rental-empire-mega-cta">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 text-6xl animate-bounce">🏠</div>
              <div className="absolute top-4 right-4 text-6xl animate-pulse">🚗</div>
              <div className="absolute bottom-4 left-4 text-6xl animate-bounce delay-500">🏪</div>
              <div className="absolute bottom-4 right-4 text-6xl animate-pulse delay-700">🏢</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl animate-spin slow-spin">💫</div>
            </div>
            
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-center">
                <div className="text-4xl font-black text-green-300 mb-2 animate-pulse">
                  🏠 YARDFLEX RENTAL EMPIRE! 🏠
                </div>
                <div className="text-2xl font-black text-yellow-400 animate-bounce">
                  EVERYTHING FOR RENT • INSTANTLY AVAILABLE!
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="text-center mb-6">
                <div className="text-3xl font-black text-white mb-4 leading-tight">
                  🏠 HOUSES • 🚗 CARS • 🏪 STORES • 🏢 APARTMENTS<br/>
                  🏊 POOLS • 🚛 TRUCKS • 🏭 WAREHOUSES • EVERYTHING!
                </div>
                
                <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg p-4 mb-6">
                  <h3 className="text-2xl font-black text-yellow-300 mb-2">
                    ⚡ INSTANT RENTAL SYSTEM ⚡
                  </h3>
                  <p className="text-white text-lg">
                    <strong>Store gets empty? It's INSTANTLY on YaadFlex for rent!</strong><br/>
                    <strong>House available? Boom - listed immediately!</strong><br/>
                    <strong>Car free? Up for rental in seconds!</strong>
                  </p>
                </div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-600/30 rounded-lg p-3 text-center">
                    <div className="text-3xl mb-1">⚡</div>
                    <div className="text-sm font-bold text-green-300">Instant Listing</div>
                  </div>
                  <div className="bg-blue-600/30 rounded-lg p-3 text-center">
                    <div className="text-3xl mb-1">🔔</div>
                    <div className="text-sm font-bold text-blue-300">Smart Alerts</div>
                  </div>
                  <div className="bg-purple-600/30 rounded-lg p-3 text-center">
                    <div className="text-3xl mb-1">💰</div>
                    <div className="text-sm font-bold text-purple-300">Easy Money</div>
                  </div>
                  <div className="bg-orange-600/30 rounded-lg p-3 text-center">
                    <div className="text-3xl mb-1">📱</div>
                    <div className="text-sm font-bold text-orange-300">One App</div>
                  </div>
                </div>
                
                {/* Rental Categories Showcase */}
                <div className="bg-black/30 rounded-lg p-4 mb-6">
                  <h4 className="text-xl font-black text-white mb-3">RENT EVERYTHING:</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="text-center">
                      <div className="text-2xl">🏠</div>
                      <div className="text-xs text-green-300">Houses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">🏢</div>
                      <div className="text-xs text-blue-300">Apartments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">🏪</div>
                      <div className="text-xs text-purple-300">Stores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">🚗</div>
                      <div className="text-xs text-yellow-300">Cars</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">🚛</div>
                      <div className="text-xs text-red-300">Trucks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">🏊</div>
                      <div className="text-xs text-cyan-300">Pools</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    onClick={() => setLocation('/rental-empire')}
                    className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-black text-2xl py-6 px-8 animate-pulse"
                    data-testid="button-access-rental-empire"
                  >
                    🚀 ACCESS RENTAL EMPIRE NOW! 🚀
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => setLocation('/rental-empire')}
                      variant="outline"
                      className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-bold py-4"
                      data-testid="button-list-property"
                    >
                      🏠 LIST MY PROPERTY
                    </Button>
                    <Button 
                      onClick={() => setLocation('/rental-empire')}
                      variant="outline"
                      className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black font-bold py-4"
                      data-testid="button-find-rental"
                    >
                      🔍 FIND RENTALS
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secure Browser CTA */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30" data-testid="secure-browser-cta-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-400">
                <span className="text-2xl">🛡️</span>
                <span>Ultra-Secure Browser - Your Safe Space Online</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 mb-2">
                    <strong>Enterprise-Grade Security:</strong> VPN protection, ad-blocking, malware detection.<br/>
                    <strong>Pre-approved Jamaican Sites:</strong> Banks, government, businesses - all verified safe.
                  </p>
                  <div className="text-sm text-blue-400 font-semibold">
                    🚀 SAFER THAN ANY OTHER BROWSER
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => setLocation('/secure-browser')}
                    className="bg-blue-600 text-white hover:bg-blue-700 font-bold"
                    data-testid="button-access-secure-browser"
                  >
                    🛡️ SECURE BROWSER
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Status Dashboard */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-premium text-glow floating mb-6" data-testid="dashboard-title">
            Global Command Center
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-ultra premium-glow floating" data-testid="stat-countries">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-premium text-glow mb-2">{globalStats?.countries || 195}</div>
                <div className="text-sm text-muted-foreground">Countries Protected</div>
              </CardContent>
            </Card>
            
            <Card className="card-ultra premium-glow floating" data-testid="stat-uptime">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-premium text-glow mb-2">{globalStats?.uptime || '99.99%'}</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
              </CardContent>
            </Card>
            
            <Card className="card-ultra premium-glow floating" data-testid="stat-breaches">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-premium text-glow mb-2">{globalStats?.breaches || 0}</div>
                <div className="text-sm text-muted-foreground">Security Breaches</div>
              </CardContent>
            </Card>
            
            <Card className="security-pulse" data-testid="stat-threats">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-chart-4 mb-2">{globalStats?.threatsBlocked?.toLocaleString() || '1,247,892'}</div>
                <div className="text-sm text-muted-foreground">Threats Blocked</div>
              </CardContent>
            </Card>
          </div>

          {/* Beast Mode Activation */}
          <Card className="mb-8 bg-gradient-to-r from-destructive/10 to-accent/10 border-accent/30" data-testid="beast-mode-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🐲</span>
                <span>Beast Mode Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-2">
                    Activate maximum security protocols for ultimate protection against any threat.
                  </p>
                  <div className="text-sm text-accent">
                    Status: {beastModeActive ? "🟢 ACTIVE" : "🔴 STANDBY"}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => setLocation('/tracking')}
                    className="bg-green-600 text-white hover:bg-green-700 font-bold"
                    data-testid="button-view-tracking"
                  >
                    🗺️ VIEW TRACKING
                  </Button>
                  <Button 
                    onClick={() => activateBeastModeMutation.mutate()}
                    disabled={activateBeastModeMutation.isPending || beastModeActive}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                    data-testid="button-activate-beast-mode"
                  >
                    {beastModeActive ? "🛡️ ACTIVE" : "⚡ ACTIVATE"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Global Tracking Alert */}
          <Card className="mb-8 bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30" data-testid="tracking-alert-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-400">
                <span className="text-2xl">🛡️</span>
                <span>Revolutionary Global Tracking System</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 mb-2">
                    Real-time vehicle tracking with security twice as powerful as Interpol. 
                    Complete transparency - anyone can see public trip movements for ultimate safety.
                  </p>
                  <div className="text-sm text-green-400 font-semibold">
                    🚨 INTERPOL+ SECURITY ACTIVE
                  </div>
                </div>
                <Button 
                  onClick={() => setLocation('/tracking')}
                  className="bg-green-600 text-white hover:bg-green-700 font-bold text-lg px-6 py-3"
                  data-testid="button-access-tracking"
                >
                  🌍 ACCESS TRACKING
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction Form */}
          <Card data-testid="transaction-form-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-xl">💸</span>
                <span>Secure Transaction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransactionSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select 
                    value={transactionForm.type} 
                    onValueChange={(value) => setTransactionForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger data-testid="select-transaction-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfer">Money Transfer</SelectItem>
                      <SelectItem value="deposit">Cash Deposit</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                      data-testid="input-amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={transactionForm.currency} 
                      onValueChange={(value) => setTransactionForm(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger data-testid="select-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="recipientPhone">Recipient Phone</Label>
                  <Input
                    id="recipientPhone"
                    type="tel"
                    placeholder="+1234567890"
                    value={transactionForm.recipientPhone}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, recipientPhone: e.target.value }))}
                    data-testid="input-recipient-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="securityLevel">Security Level</Label>
                  <Select 
                    value={transactionForm.securityLevel} 
                    onValueChange={(value) => setTransactionForm(prev => ({ ...prev, securityLevel: value }))}
                  >
                    <SelectTrigger data-testid="select-security-level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">🔒 Standard</SelectItem>
                      <SelectItem value="enhanced">🛡️ Enhanced</SelectItem>
                      <SelectItem value="beast_mode">🐲 Beast Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Transaction details..."
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                    data-testid="textarea-description"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={createTransactionMutation.isPending}
                  className="w-full bg-primary text-primary-foreground font-bold"
                  data-testid="button-submit-transaction"
                >
                  {createTransactionMutation.isPending ? "Securing..." : "🚀 Execute Secure Transfer"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* KWD/YFD Currency System */}
          <KWDWalletSection />

          {/* Recent Transactions */}
          <Card data-testid="recent-transactions-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-xl">📊</span>
                <span>Recent Transactions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="text-center text-muted-foreground" data-testid="transactions-loading">
                  Loading secure transactions...
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg" data-testid={`transaction-${transaction.id}`}>
                      <div>
                        <div className="font-semibold text-foreground">
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.recipientPhone || 'Internal'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Security: {transaction.securityLevel}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground">
                          {transaction.amount} {transaction.currency}
                        </div>
                        <div className={`text-sm ${
                          transaction.status === 'completed' ? 'text-chart-3' :
                          transaction.status === 'pending' ? 'text-accent' :
                          'text-destructive'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8" data-testid="no-transactions">
                  <div className="text-4xl mb-2">🔒</div>
                  <p>No transactions yet. Your fortress awaits your first secure transfer.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Logs */}
        <Card className="mt-8" data-testid="security-logs-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">🛡️</span>
              <span>Security Activity Log</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="text-center text-muted-foreground" data-testid="logs-loading">
                Loading security logs...
              </div>
            ) : securityLogs && securityLogs.length > 0 ? (
              <div className="space-y-3">
                {securityLogs.slice(0, 10).map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg" data-testid={`security-log-${log.id}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        log.severity === 'critical' ? 'bg-destructive' :
                        log.severity === 'high' ? 'bg-accent' :
                        log.severity === 'medium' ? 'bg-primary' :
                        'bg-chart-3'
                      }`} />
                      <div>
                        <div className="font-medium text-foreground">{log.eventType.replace('_', ' ').toUpperCase()}</div>
                        <div className="text-sm text-muted-foreground">{log.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                      {log.defenseSystemActivated && (
                        <div className="text-xs text-accent font-semibold">🛡️ DEFENSE ACTIVE</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8" data-testid="no-logs">
                <div className="text-4xl mb-2">🔐</div>
                <p>No security events recorded. Your fortress remains unbreached.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
