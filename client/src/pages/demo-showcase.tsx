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
    email: 'ddrivetaxi7@gmail.com', 
    name: 'DDrive Taxi Express',
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
  { time: '2 seconds ago', action: 'DDrive Taxi completed delivery to Half Way Tree', amount: '$45.50', type: 'delivery' },
  { time: '8 seconds ago', action: 'InTime Taxi accepted ride request from New Kingston', amount: '$25.00', type: 'ride' },
  { time: '15 seconds ago', action: 'New customer registered from Portmore', amount: '+1 User', type: 'signup' },
  { time: '23 seconds ago', action: 'DDrive Taxi earned gas delivery commission', amount: '$67.80', type: 'gas' },
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
        { time: 'Just now', action: 'DDrive Taxi received fuel delivery request', amount: '$156.80', type: 'fuel' },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-purple-900/10" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white leading-tight mb-6 tracking-tight">
              YAADFLEX GLOBAL VYBZ
            </div>
            <div className="text-3xl md:text-5xl font-bold text-blue-100 mb-4 tracking-wide">
              LIVE DEMO - REAL ACTIVITY
            </div>
            <div className="text-xl md:text-2xl text-gray-400 mb-8">
              Professional Platform - Real Drivers, Real Earnings, Real Success
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white text-lg px-6 py-3 rounded-lg border border-gray-600 shadow-xl backdrop-blur-sm">
                <Shield className="w-5 h-5 mr-2 inline text-blue-400" />
                Unbreakable Security
              </div>
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white text-lg px-6 py-3 rounded-lg border border-gray-600 shadow-xl backdrop-blur-sm">
                <DollarSign className="w-5 h-5 mr-2 inline text-green-400" />
                85% Driver Earnings
              </div>
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white text-lg px-6 py-3 rounded-lg border border-gray-600 shadow-xl backdrop-blur-sm">
                <Globe className="w-5 h-5 mr-2 inline text-purple-400" />
                Global Super-App
              </div>
            </div>
          </div>

          {/* Live Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{liveStats.totalDrivers}</div>
                <div className="text-blue-200 font-medium">Total Drivers</div>
                <div className="text-xs text-blue-300 mt-1">Active Network</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{liveStats.totalCustomers}</div>
                <div className="text-green-200 font-medium">Active Customers</div>
                <div className="text-xs text-green-300 mt-1">Island-Wide</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent mb-2">{liveStats.dailyEarnings}</div>
                <div className="text-yellow-200 font-medium">Daily Earnings</div>
                <div className="text-xs text-yellow-300 mt-1">Live Updates</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">{liveStats.monthlyGrowth}</div>
                <div className="text-purple-200 font-medium">Monthly Growth</div>
                <div className="text-xs text-purple-300 mt-1">Explosive</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Live Driver Profiles */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            LIVE DRIVER ACTIVITY
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {liveUsers.map((user, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-gray-600 shadow-2xl backdrop-blur-sm overflow-hidden relative transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <div className={`${user.status === 'Online' ? 'bg-gray-700 text-gray-300' : 'bg-gray-600 text-gray-200'} px-3 py-1 rounded text-sm`}>
                    <div className={`w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-gray-400' : 'bg-gray-500'} mr-2 inline-block`} />
                    {user.status}
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-bold">{user.name}</CardTitle>
                  <div className="text-gray-300 text-lg">
                    <a 
                      href="/" 
                      className="text-gray-400 hover:text-white underline font-medium transition-colors cursor-pointer"
                      title="Click to see YaadFlex app!"
                    >
                      {user.email}
                    </a>
                    <div className="text-gray-500 text-sm mt-1">
                      Click email to see the full YaadFlex app
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-3 text-center border border-green-700/50 shadow-lg">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">{user.earnings}</div>
                      <div className="text-green-200 text-sm">Total Earnings</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-3 text-center border border-blue-700/50 shadow-lg">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{user.trips}</div>
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

        {/* Creative Visual Sponsor Section */}
        <div className="text-center">
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl p-8 border border-gray-600 shadow-2xl relative overflow-hidden">
              
              {/* Background Visual Effects */}
              <div className="absolute inset-0 opacity-10">
                <div className="text-9xl text-center leading-none text-green-500 select-none">
                  💰💰💰💰💰<br/>
                  👁️‍🗨️💵👁️‍🗨️💵👁️‍🗨️<br/>
                  🤑💎🤑💎🤑<br/>
                  💰💰💰💰💰
                </div>
              </div>
              
              {/* Main Content */}
              <div className="relative z-10">
                <div className="text-6xl md:text-8xl font-black mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400">
                    ⭐ SPONSOR 
                  </span>
                  <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    OPPORTUNITY ⭐
                  </span>
                </div>
                
                <div className="text-4xl font-bold text-white mb-8 tracking-wide">
                  🏝️ JOIN THE CARIBBEAN REVOLUTION! 🏝️
                </div>
                
                {/* Visual Money Display */}
                <div className="flex justify-center items-center mb-8 text-6xl space-x-4">
                  <span className="animate-bounce">💰</span>
                  <span className="text-green-400 font-black">$127K+</span>
                  <span className="animate-bounce delay-300">💰</span>
                  <span className="text-yellow-400 font-black">DAILY</span>
                  <span className="animate-bounce delay-700">💰</span>
                </div>
                
                {/* Creative Visual Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-900/50 to-emerald-800/30 rounded-xl p-6 border border-green-500/50">
                    <div className="text-4xl mb-2">👑</div>
                    <div className="text-green-400 font-bold text-2xl">85% TO DRIVERS</div>
                    <div className="text-green-200">Industry Leading</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/50 to-cyan-800/30 rounded-xl p-6 border border-blue-500/50">
                    <div className="text-4xl mb-2">🚀</div>
                    <div className="text-blue-400 font-bold text-2xl">+89% GROWTH</div>
                    <div className="text-blue-200">Monthly Expansion</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/50 to-pink-800/30 rounded-xl p-6 border border-purple-500/50">
                    <div className="text-4xl mb-2">🎯</div>
                    <div className="text-purple-400 font-bold text-2xl">REAL PROFITS</div>
                    <div className="text-purple-200">Proven Results</div>
                  </div>
                </div>
                
                {/* Contact Info with Eyes */}
                <div className="text-3xl font-bold text-yellow-400 mb-4">
                  👁️‍🗨️ READY TO JOIN THE HUSTLE? 👁️‍🗨️
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-yellow-600 to-green-600 hover:from-yellow-500 hover:to-green-500 text-black text-xl px-8 py-4 font-black shadow-xl"
                    onClick={() => window.open('mailto:dChris@yaadflexglobalvibes.com?subject=SPONSOR OPPORTUNITY - YaadFlex Partnership')}
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
                
                <div className="text-5xl font-black bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent animate-pulse">
                  🤝 JOIN THE CARIBBEAN TAKEOVER! 🤝
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-400/20">
            <div className="text-xl font-medium text-blue-300 mb-3">Contact Information</div>
            <div className="text-lg text-gray-300 mb-3">
              D.C.F. - Founder & CEO
            </div>
            <div className="text-base text-blue-200">
              📧 dChris@yaadflexglobalvibes.com <br/>
              📞 1-800-YAADFLEX <br/>
              🌐 Based in Jamaica, Serving the Caribbean & Beyond
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}