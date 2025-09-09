import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Activity, 
  PieChart,
  BarChart3,
  Wallet,
  Target,
  Zap,
  Clock,
  AlertTriangle,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

type TradingPosition = {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: string;
  entryPrice: string;
  currentPrice: string;
  pnl: string;
  pnlPercent: string;
  status: 'open' | 'closed';
  openedAt: string;
  closedAt?: string;
};

type TradingStats = {
  portfolioValue: string;
  totalPnL: string;
  totalPnLPercent: string;
  dayPnL: string;
  dayPnLPercent: string;
  tradingFeesPaid: string;
  yardFlexCommission: string;
  winRate: string;
  totalTrades: number;
  activeTrades: number;
};

type MarketData = {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  volume: string;
  high24h: string;
  low24h: string;
};

export default function TradingDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedMarket, setSelectedMarket] = useState('crypto');

  // Mock trading data - in production this would come from real trading APIs
  const tradingStats: TradingStats = {
    portfolioValue: "15,750.00",
    totalPnL: "+2,350.00",
    totalPnLPercent: "+17.5",
    dayPnL: "+450.00", 
    dayPnLPercent: "+2.9",
    tradingFeesPaid: "125.50",
    yardFlexCommission: "18.75",
    winRate: "68.5",
    totalTrades: 247,
    activeTrades: 3
  };

  const positions: TradingPosition[] = [
    {
      id: "1",
      symbol: "BTC/USD",
      side: "buy",
      quantity: "0.25",
      entryPrice: "42,500.00",
      currentPrice: "44,200.00",
      pnl: "+425.00",
      pnlPercent: "+4.0",
      status: "open",
      openedAt: new Date().toISOString()
    },
    {
      id: "2", 
      symbol: "ETH/USD",
      side: "buy",
      quantity: "2.5",
      entryPrice: "2,800.00",
      currentPrice: "2,950.00",
      pnl: "+375.00",
      pnlPercent: "+5.4",
      status: "open",
      openedAt: new Date().toISOString()
    }
  ];

  const marketData: MarketData[] = [
    {
      symbol: "BTC/USD",
      price: "44,200.00",
      change: "+1,200.00",
      changePercent: "+2.8",
      volume: "2.5B",
      high24h: "44,500.00",
      low24h: "42,800.00"
    },
    {
      symbol: "ETH/USD", 
      price: "2,950.00",
      change: "+85.00",
      changePercent: "+3.0",
      volume: "1.2B",
      high24h: "2,980.00",
      low24h: "2,820.00"
    },
    {
      symbol: "ADA/USD",
      price: "0.45",
      change: "-0.02",
      changePercent: "-4.2",
      volume: "350M",
      high24h: "0.48",
      low24h: "0.44"
    }
  ];

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please log in to access your trading dashboard.</p>
            <Button asChild className="w-full">
              <Link href="/api/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/10 via-background to-purple-900/10">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-foreground" data-testid="trading-title">
                  Trading Dashboard
                </h1>
                <p className="text-sm text-muted-foreground" data-testid="trading-subtitle">
                  Professional trading with YaadFlex commission structure
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32" data-testid="timeframe-selector">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" data-testid="button-alerts">
                <AlertTriangle className="w-4 h-4" />
                Alerts
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20" data-testid="card-portfolio-value">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
              <Wallet className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="text-portfolio-value">
                ${tradingStats.portfolioValue}
              </div>
              <p className="text-xs text-muted-foreground">
                Total account value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20" data-testid="card-total-pnl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total P&L
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="text-total-pnl">
                {tradingStats.totalPnL} ({tradingStats.totalPnLPercent}%)
              </div>
              <p className="text-xs text-muted-foreground">
                All-time performance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20" data-testid="card-day-pnl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                24h P&L
              </CardTitle>
              <Zap className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600" data-testid="text-day-pnl">
                {tradingStats.dayPnL} ({tradingStats.dayPnLPercent}%)
              </div>
              <p className="text-xs text-muted-foreground">
                Today's performance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20" data-testid="card-fees-paid">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                YaadFlex Commission
              </CardTitle>
              <Target className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600" data-testid="text-yaad-commission">
                ${tradingStats.yardFlexCommission}
              </div>
              <p className="text-xs text-muted-foreground">
                From ${tradingStats.tradingFeesPaid} total fees
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Trading Interface */}
        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4" data-testid="trading-tabs">
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-6">
            <Card data-testid="card-active-positions">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Active Positions</span>
                  <Badge variant="secondary">{tradingStats.activeTrades}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {positions.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No active positions</p>
                      <p className="text-sm">Start trading to see your positions here!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {positions.map((position, index) => (
                      <div key={position.id} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`position-${index}`}>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant={position.side === 'buy' ? 'default' : 'destructive'}>
                              {position.side.toUpperCase()}
                            </Badge>
                            <span className="font-semibold">{position.symbol}</span>
                            <span className="text-sm text-muted-foreground">
                              {position.quantity} @ ${position.entryPrice}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Current: ${position.currentPrice}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            {position.pnl.startsWith('+') ? (
                              <ArrowUpRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`font-semibold ${position.pnl.startsWith('+') ? 'text-green-600' : 'text-red-600'}`} data-testid={`pnl-${index}`}>
                              {position.pnl} ({position.pnlPercent}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markets" className="space-y-6">
            <Card data-testid="card-market-data">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Market Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.map((market, index) => (
                    <div key={market.symbol} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer" data-testid={`market-${index}`}>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{market.symbol}</span>
                          <Badge variant="outline">{market.volume} vol</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          H: ${market.high24h} L: ${market.low24h}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${market.price}</div>
                        <div className={`text-sm ${market.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {market.change} ({market.changePercent}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-trading-stats">
                <CardHeader>
                  <CardTitle>Trading Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Win Rate:</span>
                    <span className="font-semibold text-green-600">{tradingStats.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Trades:</span>
                    <span className="font-semibold">{tradingStats.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Trades:</span>
                    <span className="font-semibold">{tradingStats.activeTrades}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total Fees Paid:</span>
                    <span className="font-semibold">${tradingStats.tradingFeesPaid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>YaadFlex Commission:</span>
                    <span className="font-semibold text-blue-600">${tradingStats.yardFlexCommission}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20" data-testid="card-commission-info">
                <CardHeader>
                  <CardTitle className="text-blue-600">💼 Trading Commission</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Trading Fee:</span>
                      <span className="font-semibold">0.1% per trade</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">YaadFlex Share:</span>
                      <span className="font-semibold text-blue-600">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">You Keep:</span>
                      <span className="font-semibold text-green-600">85%</span>
                    </div>
                    <Separator />
                    <p className="text-xs text-muted-foreground">
                      <strong>Professional trading tools</strong> with transparent, low fees. Trade with confidence on YaadFlex!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card data-testid="card-trading-settings">
              <CardHeader>
                <CardTitle>Trading Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Risk Management</Label>
                  <Select defaultValue="moderate">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Default Position Size (%)</Label>
                  <Input type="number" defaultValue="5" min="1" max="100" />
                </div>

                <div className="space-y-2">
                  <Label>Stop Loss (%)</Label>
                  <Input type="number" defaultValue="5" min="1" max="50" />
                </div>

                <Button className="w-full" data-testid="button-save-settings">
                  Save Trading Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}