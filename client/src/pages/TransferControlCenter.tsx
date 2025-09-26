import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, TrendingUp, Users, DollarSign, AlertTriangle, 
  CheckCircle, Clock, BarChart3, Activity, Shield,
  MapPin, Zap, Target, Settings, Eye, Pause, Play
} from 'lucide-react';

interface GlobalTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'processing';
  country: string;
  method: string;
  timestamp: string;
  fee: number;
}

interface CountryStats {
  country: string;
  flag: string;
  totalTransactions: number;
  totalVolume: number;
  currency: string;
  growthRate: number;
  status: 'active' | 'maintenance' | 'high-volume';
}

export default function TransferControlCenter() {
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('ALL');

  // Global transaction data
  const recentTransactions: GlobalTransaction[] = [
    {
      id: 'TX001',
      from: 'marcus@gmail.com',
      to: '+234-800-123-4567',
      amount: 50.00,
      currency: 'USD',
      status: 'completed',
      country: 'Nigeria',
      method: 'Email to Phone',
      timestamp: '2 minutes ago',
      fee: 0.75
    },
    {
      id: 'TX002', 
      from: '+1-876-555-0123',
      to: 'sarah@outlook.com',
      amount: 25000,
      currency: 'NGN',
      status: 'processing',
      country: 'USA',
      method: 'Phone to Email',
      timestamp: '5 minutes ago',
      fee: 125.00
    },
    {
      id: 'TX003',
      from: '@john.yaad',
      to: '+91-98765-43210',
      amount: 75.50,
      currency: 'USD',
      status: 'completed',
      country: 'India',
      method: 'Username to Phone',
      timestamp: '8 minutes ago',
      fee: 1.13
    },
    {
      id: 'TX004',
      from: 'ahmed@yahoo.com',
      to: '+44-20-7946-0958',
      amount: 200.00,
      currency: 'GBP',
      status: 'completed', 
      country: 'UK',
      method: 'Email to Phone',
      timestamp: '12 minutes ago',
      fee: 3.00
    },
    {
      id: 'TX005',
      from: '+233-24-123-4567',
      to: 'marie@gmail.com', 
      amount: 1500,
      currency: 'GHS',
      status: 'pending',
      country: 'Ghana',
      method: 'Phone to Email',
      timestamp: '15 minutes ago',
      fee: 22.50
    }
  ];

  // Country statistics
  const countryStats: CountryStats[] = [
    {
      country: 'Nigeria',
      flag: '🇳🇬',
      totalTransactions: 2847,
      totalVolume: 425600,
      currency: 'NGN',
      growthRate: 23.5,
      status: 'high-volume'
    },
    {
      country: 'Ghana',
      flag: '🇬🇭', 
      totalTransactions: 1523,
      totalVolume: 89750,
      currency: 'GHS',
      growthRate: 18.2,
      status: 'active'
    },
    {
      country: 'India',
      flag: '🇮🇳',
      totalTransactions: 3241,
      totalVolume: 157820,
      currency: 'INR',
      growthRate: 31.7,
      status: 'high-volume'
    },
    {
      country: 'Canada',
      flag: '🇨🇦',
      totalTransactions: 1876,
      totalVolume: 94200,
      currency: 'CAD',
      growthRate: 15.3,
      status: 'active'
    },
    {
      country: 'Jamaica',
      flag: '🇯🇲',
      totalTransactions: 4523,
      totalVolume: 567890,
      currency: 'JMD',
      growthRate: 41.2,
      status: 'high-volume'
    },
    {
      country: 'Kenya',
      flag: '🇰🇪',
      totalTransactions: 1945,
      totalVolume: 123450,
      currency: 'KES',
      growthRate: 28.1,
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCountryStatusColor = (status: string) => {
    switch (status) {
      case 'high-volume': return 'bg-purple-100 text-purple-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalVolume = countryStats.reduce((sum, country) => sum + country.totalVolume, 0);
  const totalTransactions = countryStats.reduce((sum, country) => sum + country.totalTransactions, 0);
  const avgGrowthRate = countryStats.reduce((sum, country) => sum + country.growthRate, 0) / countryStats.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🌍 Global Transfer Control Center
          </h1>
          <p className="text-xl text-purple-300 mb-4">
            Your worldwide money transfer empire - Better than TapTap!
          </p>
          
          {/* System Status */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isSystemActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-lg font-semibold">
                System: {isSystemActive ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <Button 
              onClick={() => setIsSystemActive(!isSystemActive)}
              variant={isSystemActive ? "destructive" : "default"}
              className={isSystemActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              data-testid={`button-${isSystemActive ? 'pause' : 'activate'}-system`}
            >
              {isSystemActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isSystemActive ? 'Pause System' : 'Activate System'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600">
              <Activity className="h-4 w-4 mr-2" />
              Live Transactions
            </TabsTrigger>
            <TabsTrigger value="countries" className="data-[state=active]:bg-purple-600">
              <Globe className="h-4 w-4 mr-2" />
              Countries
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm font-medium">Total Volume</p>
                      <p className="text-3xl font-bold text-white">
                        ${totalVolume.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">Total Transactions</p>
                      <p className="text-3xl font-bold text-white">
                        {totalTransactions.toLocaleString()}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm font-medium">Countries Active</p>
                      <p className="text-3xl font-bold text-white">
                        {countryStats.length}
                      </p>
                    </div>
                    <Globe className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900 to-orange-800 border-orange-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-300 text-sm font-medium">Growth Rate</p>
                      <p className="text-3xl font-bold text-white">
                        +{avgGrowthRate.toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* YaadFlex vs TapTap Advantage */}
            <Card className="bg-gradient-to-r from-cyan-900 to-purple-900 border-cyan-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-300">
                  <Target className="h-6 w-6" />
                  🏆 Your Global Transfer Advantage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-300">195+</div>
                    <div className="text-sm text-green-200">Countries Supported</div>
                    <div className="text-xs text-green-100 mt-1">vs TapTap's limited reach</div>
                  </div>
                  <div className="text-center p-4 bg-blue-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-300">0.5%</div>
                    <div className="text-sm text-blue-200">Average Fee</div>
                    <div className="text-xs text-blue-100 mt-1">vs TapTap's 3-5% fees</div>
                  </div>
                  <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300">14</div>
                    <div className="text-sm text-purple-200">Currencies</div>
                    <div className="text-xs text-purple-100 mt-1">vs TapTap's limited options</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5" />
                  Live Global Transactions
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Real-time money transfers happening worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Globe className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {tx.from} → {tx.to}
                          </div>
                          <div className="text-sm text-slate-300">
                            {tx.method} • {tx.country} • {tx.timestamp}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-white">
                          {tx.amount.toLocaleString()} {tx.currency}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            Fee: {tx.fee} {tx.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Countries Tab */}
          <TabsContent value="countries" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="h-5 w-5" />
                  Global Country Performance
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Transfer volume and growth by country
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {countryStats.map((country) => (
                    <div key={country.country} className="p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="font-semibold text-white">{country.country}</span>
                        </div>
                        <Badge className={getCountryStatusColor(country.status)}>
                          {country.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Volume:</span>
                          <span className="text-white font-medium">
                            {country.totalVolume.toLocaleString()} {country.currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Transactions:</span>
                          <span className="text-white font-medium">
                            {country.totalTransactions.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Growth:</span>
                          <span className="text-green-400 font-medium">
                            +{country.growthRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Transfer Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Email to Phone</span>
                      <span className="text-white font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Phone to Email</span>
                      <span className="text-white font-medium">32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Username Transfers</span>
                      <span className="text-white font-medium">23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Peak Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">9:00 AM - 12:00 PM</span>
                      <span className="text-green-400 font-medium">HIGH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">1:00 PM - 5:00 PM</span>
                      <span className="text-yellow-400 font-medium">MEDIUM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">6:00 PM - 11:00 PM</span>
                      <span className="text-green-400 font-medium">HIGH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Success Metrics */}
            <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle className="h-5 w-5" />
                  🎯 Your TapTap Competitor Success Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-300">99.8%</div>
                    <div className="text-sm text-green-200">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-300">12sec</div>
                    <div className="text-sm text-blue-200">Avg Transfer Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-300">24/7</div>
                    <div className="text-sm text-purple-200">Global Coverage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-300">195+</div>
                    <div className="text-sm text-yellow-200">Countries Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}