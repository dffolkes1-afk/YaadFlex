import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Clock, 
  DollarSign,
  Truck,
  Star,
  Activity,
  Target,
  Globe,
  Zap,
  Shield,
  Radio,
  Phone
} from 'lucide-react';

// Live Demo Data
const liveUsers = [
  {
    email: 'intimetaxi4@gmail.com',
    name: 'InTime Taxi Services',
    role: 'Premium Driver',
    status: 'Online',
    location: 'Kingston, Jamaica',
    earnings: '$2,847.50',
    trips: 342,
    rating: 4.9,
    joinedMonths: 8,
    lastActive: 'Now',
    vehicleType: 'Sedan Taxi',
    specialties: ['Airport Transfers', 'Corporate Travel', 'City Tours']
  },
  {
    email: 'ddrietaxi7@gmail.com', 
    name: 'DDrie Taxi Express',
    role: 'Elite Driver',
    status: 'On Trip',
    location: 'Spanish Town, Jamaica',
    earnings: '$3,156.75',
    trips: 428,
    rating: 4.8,
    joinedMonths: 12,
    lastActive: '2 min ago',
    vehicleType: 'SUV',
    specialties: ['Long Distance', 'Group Travel', 'Delivery Services']
  }
];

const liveActivity = [
  { time: '2 seconds ago', action: 'DDrie Taxi completed delivery to Half Way Tree', amount: '$45.50', type: 'delivery' },
  { time: '8 seconds ago', action: 'InTime Taxi accepted ride request from New Kingston', amount: '$25.00', type: 'ride' },
  { time: '15 seconds ago', action: 'New customer registered from Portmore', amount: '+1 User', type: 'signup' },
  { time: '23 seconds ago', action: 'DDrie Taxi earned gas delivery commission', amount: '$67.80', type: 'gas' },
  { time: '31 seconds ago', action: 'InTime Taxi completed airport transfer', amount: '$89.25', type: 'ride' },
  { time: '45 seconds ago', action: 'Bulk fuel delivery completed in Spanish Town', amount: '$234.60', type: 'fuel' },
  { time: '52 seconds ago', action: 'InTime Taxi received 5-star rating', amount: '+Rating', type: 'rating' },
  { time: '1 min ago', action: 'New business partnership activated - Gas Station', amount: '+Partner', type: 'business' }
];

const platformStats = {
  totalDrivers: '12,847',
  totalCustomers: '34,592',
  dailyEarnings: '$127,450',
  monthlyGrowth: '+89%',
  completedTrips: '156,789',
  avgRating: '4.8',
  onlineDrivers: '2,847',
  activeCities: '14'
};

export default function DemoShowcase() {
  const [currentActivity, setCurrentActivity] = useState(liveActivity);
  const [liveStats, setLiveStats] = useState(platformStats);

  // Simulate live updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new activity
      const newActivities = [
        { time: 'Just now', action: 'InTime Taxi started new ride from Downtown', amount: '$32.00', type: 'ride' },
        { time: 'Just now', action: 'DDrie Taxi received fuel delivery request', amount: '$156.80', type: 'fuel' },
        { time: 'Just now', action: 'New premium driver joined YaadFlex network', amount: '+Driver', type: 'signup' },
        { time: 'Just now', action: 'Gas station partnership payment processed', amount: '$445.20', type: 'business' }
      ];
      
      const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
      setCurrentActivity(prev => [randomActivity, ...prev.slice(0, 7)]);

      // Update live stats
      setLiveStats(prev => ({
        ...prev,
        dailyEarnings: `$${(parseInt(prev.dailyEarnings.replace('$', '').replace(',', '')) + Math.floor(Math.random() * 100) + 50).toLocaleString()}`,
        onlineDrivers: `${(parseInt(prev.onlineDrivers.replace(',', '')) + Math.floor(Math.random() * 10) - 5).toLocaleString()}`
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 animate-pulse leading-tight mb-6">
              🇯🇲 YAADFLEX GLOBAL VYBZ 🇯🇲
            </div>
            <div className="text-3xl md:text-5xl font-bold text-green-400 mb-4 animate-bounce">
              LIVE DEMO - REAL ACTIVITY!
            </div>
            <div className="text-xl md:text-2xl text-yellow-300 mb-8">
              Watch Our Platform in ACTION - Real Drivers, Real Earnings, Real Success!
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-green-600 text-white text-lg px-4 py-2 animate-pulse">
                <Shield className="w-5 h-5 mr-2" />
                100% SECURE - NO HACKERS CAN BREAK THROUGH
              </Badge>
              <Badge className="bg-blue-600 text-white text-lg px-4 py-2 animate-bounce">
                <DollarSign className="w-5 h-5 mr-2" />
                85% DRIVER EARNINGS - HIGHEST IN INDUSTRY
              </Badge>
              <Badge className="bg-purple-600 text-white text-lg px-4 py-2 animate-pulse">
                <Globe className="w-5 h-5 mr-2" />
                CARIBBEAN'S #1 SUPER-APP
              </Badge>
            </div>
          </div>

          {/* Live Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-green-600/30 to-green-800/30 border-green-400/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-black text-green-400 mb-2">{liveStats.totalDrivers}</div>
                <div className="text-green-200 font-bold">Total Drivers</div>
                <div className="text-xs text-green-300 mt-1">Growing Daily!</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-blue-400/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2">{liveStats.totalCustomers}</div>
                <div className="text-blue-200 font-bold">Active Customers</div>
                <div className="text-xs text-blue-300 mt-1">Island-Wide!</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 border-yellow-400/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2">{liveStats.dailyEarnings}</div>
                <div className="text-yellow-200 font-bold">Daily Earnings</div>
                <div className="text-xs text-yellow-300 mt-1">Live Updates!</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-400/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2">{liveStats.monthlyGrowth}</div>
                <div className="text-purple-200 font-bold">Monthly Growth</div>
                <div className="text-xs text-purple-300 mt-1">Explosive!</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Live Driver Profiles */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-yellow-400 mb-8 text-center animate-pulse">
            🚗 LIVE DRIVER ACTIVITY 🚗
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {liveUsers.map((user, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-green-400/30 overflow-hidden relative">
                <div className="absolute top-4 right-4">
                  <Badge className={`${user.status === 'Online' ? 'bg-green-600' : 'bg-orange-600'} animate-pulse`}>
                    <div className={`w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-green-300' : 'bg-orange-300'} mr-2 animate-ping`} />
                    {user.status}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-green-400 text-2xl font-bold">{user.name}</CardTitle>
                  <div className="text-blue-300 text-lg">{user.email}</div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-600/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-black text-green-400">{user.earnings}</div>
                      <div className="text-green-200 text-sm">Total Earnings</div>
                    </div>
                    <div className="bg-blue-600/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-black text-blue-400">{user.trips}</div>
                      <div className="text-blue-200 text-sm">Completed Trips</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-bold">{user.rating}</span>
                      <span className="text-gray-300">Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-green-300">{user.location}</span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-600/20 rounded-lg p-3">
                    <div className="text-purple-300 font-bold mb-2">Specialties:</div>
                    <div className="flex flex-wrap gap-2">
                      {user.specialties.map((specialty, i) => (
                        <Badge key={i} variant="outline" className="border-purple-400 text-purple-300">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Vehicle: {user.vehicleType}</span>
                    <span className="text-gray-400">Active: {user.lastActive}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-blue-400 mb-8 text-center animate-bounce">
            ⚡ LIVE PLATFORM ACTIVITY ⚡
          </h2>
          
          <Card className="bg-gradient-to-br from-gray-800/30 to-black/30 border-blue-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Activity className="w-6 h-6 animate-pulse" />
                Real-Time Updates - Refreshing Every 5 Seconds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {currentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                      index === 0 ? 'bg-green-600/20 border-green-400 animate-pulse' : 'bg-gray-700/20 border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'ride' ? 'bg-blue-400' :
                        activity.type === 'delivery' ? 'bg-green-400' :
                        activity.type === 'fuel' ? 'bg-yellow-400' :
                        activity.type === 'gas' ? 'bg-orange-400' :
                        'bg-purple-400'
                      } ${index === 0 ? 'animate-ping' : ''}`} />
                      <div>
                        <div className="text-white font-medium">{activity.action}</div>
                        <div className="text-gray-400 text-sm">{activity.time}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      activity.amount.includes('$') ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {activity.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sponsor Call-to-Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-yellow-600/20 to-green-600/20 border-yellow-400/50 mb-8">
            <CardContent className="p-12">
              <div className="text-5xl md:text-7xl font-black text-yellow-400 mb-6 animate-pulse">
                💰 SPONSOR OPPORTUNITY! 💰
              </div>
              <div className="text-2xl md:text-3xl text-white mb-6">
                Join the Caribbean's FASTEST-GROWING Platform!
              </div>
              <div className="text-xl text-yellow-300 mb-8">
                <strong>• 85% Driver Earnings</strong> - Industry's Highest! <br/>
                <strong>• Unbreakable Security</strong> - Military-Grade Protection! <br/>
                <strong>• Real-Time Everything</strong> - Uber-Level Technology! <br/>
                <strong>• Total Economy Platform</strong> - Every Service Covered!
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-yellow-600 hover:bg-yellow-700 text-black text-xl px-8 py-4 font-black"
                  onClick={() => window.open('mailto:dChris@yaadflexglobalvybz.com?subject=SPONSOR OPPORTUNITY - YaadFlex Partnership')}
                >
                  💼 BECOME A SPONSOR
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-green-400 text-green-400 hover:bg-green-400/10 text-xl px-8 py-4 font-black"
                  onClick={() => window.open('tel:+1-800-YAADFLEX')}
                >
                  📞 CALL NOW
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-400/30">
            <div className="text-3xl font-black text-blue-400 mb-4">Contact YaadFlex Leadership</div>
            <div className="text-xl text-white mb-4">
              <strong>Dwayne Christopher Ffolkes</strong> - Founder & CEO
            </div>
            <div className="text-lg text-blue-300">
              📧 dChris@yaadflexglobalvybz.com <br/>
              📞 1-800-YAADFLEX <br/>
              🌐 Based in Jamaica, Serving the Caribbean & Beyond
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}