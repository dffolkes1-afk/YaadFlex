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
  Building2, Users, Clock, DollarSign, BarChart3, Settings,
  Car, MapPin, Calendar, TrendingUp, Shield, Zap
} from 'lucide-react';

export default function CompanyDashboard() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('BlackRock Caribbean Transport');
  const [baseRate, setBaseRate] = useState('150');
  const [commissionRate, setCommissionRate] = useState('15');

  // Company settings
  const [companySettings, setCompanySettings] = useState({
    operatingHours: '5:00 AM - 11:00 PM',
    serviceArea: 'Kingston Metro Area',
    fleetSize: '25',
    activeDrivers: '18'
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved! ✅",
      description: `${companyName} settings updated successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">
                🚕 BlackRock Enterprise Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Complete control of your BlackRock-powered transportation business
              </p>
            </div>
          </div>
          
          {/* BlackRock Advantage Banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-yellow-50 dark:from-emerald-950 dark:to-yellow-950 p-4 rounded-2xl border-2 border-emerald-300 shadow-lg">
            <div className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
              🎯 BlackRock-Backed Platform: 85% Driver Earnings vs 75% from Other Platforms
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              Enterprise-grade financial infrastructure = Better earnings = Superior business outcomes!
            </div>
          </div>

          {/* Preview Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border shadow-md hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="text-4xl mb-2">🚕</div>
                <div className="font-semibold text-blue-800">Real-Time Tracking</div>
                <div className="text-sm text-blue-600">Live GPS & Route Optimization</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border shadow-md hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="font-semibold text-green-800">BlackRock Digital Currency</div>
                <div className="text-sm text-green-600">Enterprise Financial Infrastructure</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border shadow-md hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <div className="font-semibold text-purple-800">Any Phone Works</div>
                <div className="text-sm text-purple-600">No iPhone Required</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="rates">💰 Rates</TabsTrigger>
            <TabsTrigger value="schedule">⏰ Schedule</TabsTrigger>
            <TabsTrigger value="drivers">👥 Drivers</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Quick Stats */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Car className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-800">{companySettings.fleetSize}</div>
                      <div className="text-sm text-blue-600">Total Vehicles</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-800">{companySettings.activeDrivers}</div>
                      <div className="text-sm text-green-600">Active Drivers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-800">J${baseRate}</div>
                      <div className="text-sm text-purple-600">Base Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-amber-600" />
                    <div>
                      <div className="text-2xl font-bold text-amber-800">847</div>
                      <div className="text-sm text-amber-600">Trips Today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Today's Performance - {new Date().toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg border hover:shadow-lg transition-all">
                    <div className="text-5xl mb-3">💵</div>
                    <div className="text-3xl font-bold text-green-600 mb-2">J$45,750</div>
                    <div className="text-sm text-green-700">Total Revenue</div>
                    <div className="text-xs text-green-600 mt-1">↗️ +12% vs yesterday</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border hover:shadow-lg transition-all">
                    <div className="text-5xl mb-3">👨‍💼</div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">J$38,888</div>
                    <div className="text-sm text-blue-700">Driver Earnings (85%)</div>
                    <div className="text-xs text-blue-600 mt-1">🎯 Higher than competitors!</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border hover:shadow-lg transition-all">
                    <div className="text-5xl mb-3">🏢</div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">J$6,862</div>
                    <div className="text-sm text-purple-700">Company Share (15%)</div>
                    <div className="text-xs text-purple-600 mt-1">💼 Sustainable profit</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rates Tab */}
          <TabsContent value="rates">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <Card>
                <CardHeader>
                  <CardTitle>💰 Rate Management</CardTitle>
                  <CardDescription>
                    Set your base rates and surge pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="base-rate">Base Rate (JMD per km)</Label>
                    <Input
                      id="base-rate"
                      value={baseRate}
                      onChange={(e) => setBaseRate(e.target.value)}
                      className="text-lg font-semibold"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="commission">Company Commission (%)</Label>
                    <Input
                      id="commission"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      className="text-lg font-semibold"
                    />
                    <div className="text-sm text-green-600 mt-1">
                      ✅ 15% commission = 85% to drivers (vs 75% elsewhere)
                    </div>
                  </div>

                  <div>
                    <Label>Surge Pricing</Label>
                    <Select defaultValue="auto">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Automatic (AI-driven)</SelectItem>
                        <SelectItem value="manual">Manual Control</SelectItem>
                        <SelectItem value="off">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSaveSettings} className="w-full">
                    💾 Save Rate Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📊 Rate Comparison</CardTitle>
                  <CardDescription>
                    See how your rates compare
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-l-4 border-green-400 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">🏆</div>
                        <div>
                          <div className="font-semibold">Your YaadFlex Rate</div>
                          <div className="text-sm text-gray-600">J${baseRate}/km • {commissionRate}% commission</div>
                        </div>
                      </div>
                      <Badge className="bg-green-600">✅ Best</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border-l-4 border-red-400 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">😞</div>
                        <div>
                          <div className="font-semibold">Competitor A (Uber)</div>
                          <div className="text-sm text-gray-600">J$180/km • 25% commission</div>
                        </div>
                      </div>
                      <Badge variant="destructive">Higher costs</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">⚠️</div>
                        <div>
                          <div className="font-semibold">Competitor B (InDrive)</div>
                          <div className="text-sm text-gray-600">J$165/km • 25% commission</div>
                        </div>
                      </div>
                      <Badge className="bg-yellow-600">Still higher</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  📅 Schedule Management
                </CardTitle>
                <CardDescription>
                  Manage your operating hours and peak times
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Operating Hours</Label>
                    <Select defaultValue="5am-11pm">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24hr">24/7 Service</SelectItem>
                        <SelectItem value="5am-11pm">5:00 AM - 11:00 PM</SelectItem>
                        <SelectItem value="6am-10pm">6:00 AM - 10:00 PM</SelectItem>
                        <SelectItem value="custom">Custom Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Service Area</Label>
                    <Select defaultValue="kingston">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kingston">Kingston Metro</SelectItem>
                        <SelectItem value="spanish-town">Spanish Town</SelectItem>
                        <SelectItem value="portmore">Portmore</SelectItem>
                        <SelectItem value="all-jamaica">All Jamaica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Peak Hours */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🕒 Peak Hours Setup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="font-semibold">Morning Rush</div>
                      <div className="text-sm text-gray-600">7:00 AM - 9:00 AM</div>
                      <div className="text-xs text-orange-600 mt-1">1.5x surge rate</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="font-semibold">Lunch Time</div>
                      <div className="text-sm text-gray-600">12:00 PM - 2:00 PM</div>
                      <div className="text-xs text-blue-600 mt-1">1.2x surge rate</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="font-semibold">Evening Rush</div>
                      <div className="text-sm text-gray-600">5:00 PM - 7:00 PM</div>
                      <div className="text-xs text-purple-600 mt-1">1.8x surge rate</div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSettings} className="w-full">
                  💾 Save Schedule Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  👥 Driver Management
                </CardTitle>
                <CardDescription>
                  Manage your fleet and driver performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Driver Stats */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">📊 Driver Performance Today</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🏆</div>
                          <div>
                            <div className="font-semibold">Marcus Johnson</div>
                            <div className="text-sm text-gray-600">License: TAX-001 • Toyota Corolla 🚗</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">J$3,250</div>
                          <div className="text-xs text-gray-500">24 trips 🎯</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">⭐</div>
                          <div>
                            <div className="font-semibold">Sarah Williams</div>
                            <div className="text-sm text-gray-600">License: TAX-002 • Honda Civic 🚙</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">J$2,890</div>
                          <div className="text-xs text-gray-500">19 trips 💪</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🚀</div>
                          <div>
                            <div className="font-semibold">Devon Brown</div>
                            <div className="text-sm text-gray-600">License: TAX-003 • Nissan Versa 🚘</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-purple-600">J$2,150</div>
                          <div className="text-xs text-gray-500">16 trips 📈</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Benefits */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">🎯 YaadFlex Driver Benefits</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                        <Shield className="h-5 w-5 text-emerald-600" />
                        <div>
                          <div className="font-semibold text-emerald-800">85% Earnings</div>
                          <div className="text-sm text-emerald-600">vs 75% from competitors</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-semibold text-blue-800">Instant Payments</div>
                          <div className="text-sm text-blue-600">YFD currency, real money</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-semibold text-purple-800">Any Phone Works</div>
                          <div className="text-sm text-purple-600">No expensive iPhone needed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <Card>
                <CardHeader>
                  <CardTitle>⚙️ Company Settings</CardTitle>
                  <CardDescription>
                    Configure your business profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="text-lg font-semibold"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input
                      id="contact"
                      placeholder="+1-876-123-4567"
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      placeholder="Kingston, Jamaica"
                      className="text-lg"
                    />
                  </div>

                  <Button onClick={handleSaveSettings} className="w-full">
                    💾 Save Company Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🌟 YaadFlex Advantages</CardTitle>
                  <CardDescription>
                    Why your business wins with YaadFlex
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-semibold text-green-800">💰 Higher Driver Retention</div>
                      <div className="text-sm text-green-700">85% earnings = happier drivers = less turnover</div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="font-semibold text-blue-800">📱 Universal Phone Support</div>
                      <div className="text-sm text-blue-700">Any phone becomes valuable with YaadFlex</div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="font-semibold text-purple-800">🌍 Global Currency System</div>
                      <div className="text-sm text-purple-700">YFD currency works worldwide</div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <div className="font-semibold text-amber-800">🎯 Complete Control</div>
                      <div className="text-sm text-amber-700">Your company, your rules, your rates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}