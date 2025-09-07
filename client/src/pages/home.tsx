import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import globalHeroImage from '@assets/generated_images/CEO_touching_global_world_silhouette_ad066b65.png';
import yardFlexLogo from '@assets/generated_images/YardFlex_global_connectivity_logo_d834a244.png';
import rocketToMoonImage from '@assets/generated_images/Jamaica_rocket_to_moon_launch_d8e2fc61.png';
import rocketLogoImage from '@assets/generated_images/Stylized_Jamaica_moon_rocket_400418f0.png';

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
        description: `Successfully added ${kwdAmount} KWD to your YardFlex wallet!`,
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
          <span className="text-premium">YardFlex Currency (KWD/YFD)</span>
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
            <Label htmlFor="kwd-amount">Add KWD to YardFlex Wallet</Label>
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
          <strong>How it works:</strong> KWD is YardFlex's ultimate currency. 1 KWD equals 1 YFD (YardFlex Dollar). 
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
          <img 
            src={globalHeroImage} 
            alt="YardFlex Global Vision - Connecting Jamaica to the World" 
            className="w-full h-64 md:h-96 object-cover opacity-90"
            data-testid="img-global-hero"
          />
          
          {/* Hero Overlay Content */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-black/40 to-transparent">
            <div className="text-center text-white z-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-hero-title">
                <span className="text-yellow-400 text-shadow-lg">YARD</span>
                <span className="text-green-500 text-shadow-lg">FLEX</span>
              </h1>
              <p className="text-xl md:text-2xl font-semibold mb-2" data-testid="text-hero-subtitle">
                🇯🇲 TAKING JAMAICA TO THE MOON 🚀🌙
              </p>
              <p className="text-lg md:text-xl" data-testid="text-hero-description">
                One App. Infinite Possibilities. Universal Success.
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
              <img 
                src={yardFlexLogo} 
                alt="YardFlex Logo" 
                className="w-10 h-10 rounded-full"
                data-testid="img-yardflex-logo"
              />
              <span className="text-2xl font-bold text-premium" data-testid="brand-name">YardFlex</span>
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
              <img 
                src={rocketToMoonImage} 
                alt="Jamaica Rocket to Moon" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3 text-purple-300">
                <img 
                  src={rocketLogoImage} 
                  alt="Rocket Logo" 
                  className="w-12 h-12"
                />
                <span className="text-2xl font-black">🚀 JAMAICA TO THE MOON MISSION 🌙</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-center">
                <h3 className="text-3xl font-black text-yellow-400 mb-4 animate-pulse">
                  🇯🇲 LAUNCH SEQUENCE INITIATED 🇯🇲
                </h3>
                <p className="text-white mb-4 text-lg">
                  <strong>YardFlex isn't just reaching for the stars - we're taking Jamaica TO THE MOON!</strong><br/>
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
                      <div className="bg-yellow-600/40 rounded-lg p-3 mt-4">
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
                    <strong>Store gets empty? It's INSTANTLY on YardFlex for rent!</strong><br/>
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
