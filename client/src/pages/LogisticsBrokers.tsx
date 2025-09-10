import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Ship, Package, Car, Home, MapPin, Star, Phone, Clock, 
  Truck, Shield, Globe, CheckCircle, AlertCircle, DollarSign
} from 'lucide-react';

export default function LogisticsBrokers() {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const brokerServices = [
    {
      id: 1,
      name: "Marcus Port Services",
      rating: 4.9,
      reviews: 156,
      location: "Kingston Port",
      phone: "+1-876-555-0123",
      services: ["Port Clearing", "Barrel Clearing", "Vehicle Import", "Home Delivery"],
      specialties: "🚢 Port Expert • 📦 Barrel Specialist • 🚗 Car Import",
      experience: "12 years",
      pricing: "J$8,500 - J$25,000",
      avatar: "🏆",
      verified: true,
      description: "Professional port clearing with direct home delivery. Specializes in barrel clearing and vehicle imports from US/UK."
    },
    {
      id: 2,
      name: "Island Logistics Pro",
      rating: 4.8,
      reviews: 203,
      location: "Montego Bay",
      phone: "+1-876-555-0456",
      services: ["Customs Clearing", "Freight", "Express Delivery", "Storage"],
      specialties: "✈️ Air Cargo • 🚚 Freight Services • 📦 Express",
      experience: "8 years",
      pricing: "J$5,000 - J$18,000",
      avatar: "⭐",
      verified: true,
      description: "Fast customs clearing and island-wide delivery. Express services for urgent shipments."
    },
    {
      id: 3,
      name: "JA Clearing House",
      rating: 4.7,
      reviews: 89,
      location: "Spanish Town",
      phone: "+1-876-555-0789",
      services: ["Port Clearing", "Document Prep", "Tax Assistance", "Inspection"],
      specialties: "📋 Document Expert • 💼 Tax Help • 🔍 Inspection",
      experience: "15 years",
      pricing: "J$6,000 - J$22,000",
      avatar: "📋",
      verified: true,
      description: "Complete document preparation and tax assistance for all types of imports."
    },
    {
      id: 4,
      name: "Quick Clear Jamaica",
      rating: 4.6,
      reviews: 124,
      location: "Kingston",
      phone: "+1-876-555-0321",
      services: ["Same Day Clearing", "Emergency Service", "Perishable Goods"],
      specialties: "⚡ Same Day • 🆘 Emergency • 🥗 Perishables",
      experience: "6 years",
      pricing: "J$10,000 - J$30,000",
      avatar: "⚡",
      verified: true,
      description: "Emergency and same-day clearing services. Perfect for time-sensitive shipments."
    }
  ];

  const serviceCategories = [
    { id: 'port_clearing', name: 'Port Clearing', icon: '🚢', description: 'Clear goods, barrels, vehicles at ports' },
    { id: 'barrel_service', name: 'Barrel Services', icon: '📦', description: 'Barrel clearing and home delivery' },
    { id: 'vehicle_import', name: 'Vehicle Import', icon: '🚗', description: 'Car clearing and registration' },
    { id: 'home_delivery', name: 'Home Delivery', icon: '🏠', description: 'Direct delivery to your location' },
    { id: 'customs', name: 'Customs', icon: '📋', description: 'Documentation and customs clearing' },
    { id: 'express', name: 'Express Service', icon: '⚡', description: 'Urgent and emergency clearing' }
  ];

  const handleContactBroker = (broker: any) => {
    toast({
      title: "Contacting Broker! 📞",
      description: `Connecting you with ${broker.name} - ${broker.phone}`,
    });
  };

  const handleRequestQuote = (broker: any) => {
    toast({
      title: "Quote Requested! 💼",
      description: `Quote request sent to ${broker.name}. They'll contact you within 2 hours.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Ship className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">
                🚢 Logistics Brokers
              </h1>
              <p className="text-xl text-gray-600">
                Port clearing, barrels, cars & delivery services
              </p>
            </div>
          </div>
          
          {/* Service Overview Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 p-4 rounded-2xl border-2 border-blue-300 shadow-lg mb-6">
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
              🎯 Professional Port Clearing & Logistics Services
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Clear barrels, cars & goods at ports • Direct home delivery • Customs assistance
            </div>
          </div>

          {/* Broker Platform Benefits Banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-yellow-50 dark:from-emerald-950 dark:to-yellow-950 p-6 rounded-2xl border-2 border-emerald-400 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                🚀 RUN YOUR OWN PLATFORM WITH YAADFLEX! 
              </div>
              <div className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
                ⚡ 85% EARNINGS TO YOU • 15% Platform Fee • SET YOUR OWN STANDARDS!
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                  <div className="font-bold text-emerald-600">💰 Keep 85% of Earnings</div>
                  <div className="text-gray-700 dark:text-gray-300">Only 15% to YaadFlex - You keep the rest!</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                  <div className="font-bold text-blue-600">⚙️ Set Your Own Standards</div>
                  <div className="text-gray-700 dark:text-gray-300">Your rules, your prices, your service quality</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                  <div className="font-bold text-purple-600">🏢 Your Own Platform</div>
                  <div className="text-gray-700 dark:text-gray-300">Operate like you own the business - because you do!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="find-brokers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 text-xs">
            <TabsTrigger value="find-brokers">🔍 Find</TabsTrigger>
            <TabsTrigger value="earnings-advisor">💡 Advisor</TabsTrigger>
            <TabsTrigger value="autonomous-ops">🤖 Auto</TabsTrigger>
            <TabsTrigger value="dashboard-system">🚗 Dash</TabsTrigger>
            <TabsTrigger value="pricing-system">💰 Price</TabsTrigger>
            <TabsTrigger value="qr-system">📱 QR</TabsTrigger>
            <TabsTrigger value="become-broker">👥 Join</TabsTrigger>
            <TabsTrigger value="track-shipment">📍 Track</TabsTrigger>
          </TabsList>

          {/* Find Brokers Tab */}
          <TabsContent value="find-brokers">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-sm font-semibold mb-2 block">Service Type</label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="port_clearing">Port Clearing</SelectItem>
                    <SelectItem value="barrel_service">Barrel Services</SelectItem>
                    <SelectItem value="vehicle_import">Vehicle Import</SelectItem>
                    <SelectItem value="home_delivery">Home Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-2 block">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="kingston">Kingston Port</SelectItem>
                    <SelectItem value="montego_bay">Montego Bay</SelectItem>
                    <SelectItem value="spanish_town">Spanish Town</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-2 block">Search</label>
                <Input placeholder="Search brokers..." />
              </div>
            </div>

            {/* Brokers List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {brokerServices.map((broker) => (
                <Card key={broker.id} className="hover:shadow-lg transition-all border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{broker.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{broker.name}</CardTitle>
                            {broker.verified && <Shield className="h-4 w-4 text-green-600" />}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-semibold">{broker.rating}</span>
                              <span>({broker.reviews} reviews)</span>
                              {broker.rating >= 4.8 && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 ml-2">
                                  🏆 Elite
                                </Badge>
                              )}
                              {broker.rating >= 4.5 && broker.rating < 4.8 && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-300 ml-2">
                                  ⭐ Pro
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        {broker.experience}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-700">
                      {broker.description}
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-semibold text-blue-800">{broker.specialties}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {broker.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{broker.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>{broker.pricing}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleContactBroker(broker)}
                        className="flex-1"
                        data-testid={`button-contact-${broker.id}`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button 
                        onClick={() => handleRequestQuote(broker)}
                        variant="outline"
                        className="flex-1"
                        data-testid={`button-quote-${broker.id}`}
                      >
                        💼 Get Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Reputation System Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  🏆 Build & Keep Your Reputation
                </CardTitle>
                <CardDescription>
                  How brokers build lasting reputation and keep their standing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">🏆</div>
                      <div className="font-bold text-yellow-800">Elite Status</div>
                    </div>
                    <div className="text-sm text-yellow-700">
                      <div className="font-semibold">4.8+ Rating</div>
                      <div>• Premium visibility</div>
                      <div>• Top search results</div>
                      <div>• Elite badge display</div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">⭐</div>
                      <div className="font-bold text-blue-800">Pro Status</div>
                    </div>
                    <div className="text-sm text-blue-700">
                      <div className="font-semibold">4.5+ Rating</div>
                      <div>• Pro badge</div>
                      <div>• Higher visibility</div>
                      <div>• Trusted broker status</div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">📈</div>
                      <div className="font-bold text-green-800">Build Reputation</div>
                    </div>
                    <div className="text-sm text-green-700">
                      <div className="font-semibold">How to Improve:</div>
                      <div>• Fast service delivery</div>
                      <div>• Clear communication</div>
                      <div>• Professional handling</div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">🛡️</div>
                      <div className="font-bold text-purple-800">Keep Standing</div>
                    </div>
                    <div className="text-sm text-purple-700">
                      <div className="font-semibold">Maintain Quality:</div>
                      <div>• Consistent performance</div>
                      <div>• Customer satisfaction</div>
                      <div>• Long-term reliability</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-300">
                  <div className="text-center">
                    <div className="font-bold text-emerald-800 text-lg mb-2">
                      💎 REPUTATION = MORE EARNINGS!
                    </div>
                    <div className="text-sm text-emerald-700">
                      <strong>Elite brokers (4.8+):</strong> Get 40% more customers • Higher prices • Premium listings<br/>
                      <strong>Pro brokers (4.5+):</strong> Get 25% more customers • Better visibility • Trust badges<br/>
                      <strong>Your reputation follows you everywhere</strong> - Build it once, keep it forever!
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Earnings Advisor Tab */}
          <TabsContent value="earnings-advisor">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">💡 WE TEACH YOU WHERE TO EARN MORE!</h2>
                <div className="text-2xl font-semibold mb-6">
                  🧠 APP KNOWS WHAT WORKS FOR YOU • 📈 SHOWS BEST OPPORTUNITIES • 💰 MAXIMIZE EARNINGS
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="font-bold">PERSONALIZED</div>
                    <div className="text-sm opacity-90">App learns what works best for YOU</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="font-bold">TEACHES</div>
                    <div className="text-sm opacity-90">Shows you new ways to earn</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">🚀</div>
                    <div className="font-bold">GROWS</div>
                    <div className="text-sm opacity-90">Helps you expand into more services</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Smart Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">🧠</div>
                    App KNOWS What Works Best For You!
                  </CardTitle>
                  <CardDescription>
                    We analyze your patterns and show you where to earn MORE
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="font-bold text-blue-800 mb-2">📍 LOCATION-BASED OPPORTUNITIES</div>
                      <div className="text-sm text-blue-700">
                        • "Kingston Port area is HOT for barrel services!"<br/>
                        • "Airport runs peak at 5-8 AM - great earnings!"<br/>
                        • "New Mall area needs more food delivery"<br/>
                        • "Tourist hotels looking for trusted drivers"
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-bold text-green-800 mb-2">💼 NEW SERVICES YOU CAN ADD</div>
                      <div className="text-sm text-green-700">
                        • "You're already at the airport - add customs clearance!"<br/>
                        • "Your route passes 3 schools - morning school runs?"<br/>
                        • "Medical transport pays 2x regular rides"<br/>
                        • "Corporate contracts available in your area"
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="font-bold text-purple-800 mb-2">📊 YOUR EARNING POTENTIAL</div>
                      <div className="text-sm text-purple-700">
                        • "Current: J$8,000/day with rides only"<br/>
                        • "Add barrel service: +J$4,000/day"<br/>
                        • "Add school runs: +J$3,500/day"<br/>
                        • "Total potential: J$15,500/day!"
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <div className="font-bold text-amber-800 mb-2">⏰ BEST TIMES FOR EACH SERVICE</div>
                      <div className="text-sm text-amber-700">
                        • "Morning: School runs + airport trips"<br/>
                        • "Midday: Barrel pickups + deliveries"<br/>
                        • "Evening: Food delivery + rides"<br/>
                        • "Weekend: Tourism + events"
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Multiple Income Streams */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">💰</div>
                    Don't Just Drive - Do EVERYTHING!
                  </CardTitle>
                  <CardDescription>
                    One app, multiple ways to earn - we show you how
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xl">🚗</div>
                        <div className="font-semibold text-purple-800">TAXI/RIDES</div>
                      </div>
                      <div className="text-sm text-purple-700">
                        Regular rides, airport runs, corporate accounts
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xl">📦</div>
                        <div className="font-semibold text-green-800">LOGISTICS/DELIVERY</div>
                      </div>
                      <div className="text-sm text-green-700">
                        Barrel service, port clearing, package delivery
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-amber-50 to-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xl">🍕</div>
                        <div className="font-semibold text-amber-800">FOOD/GROCERY</div>
                      </div>
                      <div className="text-sm text-amber-700">
                        Restaurant delivery, grocery shopping, meal pickup
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xl">🎒</div>
                        <div className="font-semibold text-red-800">SCHOOL TRANSPORT</div>
                      </div>
                      <div className="text-sm text-red-700">
                        Morning/afternoon runs, field trips, after-school
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-purple-50 to-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xl">🏥</div>
                        <div className="font-semibold text-purple-800">MEDICAL/PHARMACY</div>
                      </div>
                      <div className="text-sm text-purple-700">
                        Hospital trips, prescription delivery, elderly care
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xl">🏖️</div>
                        <div className="font-semibold text-blue-800">TOURISM</div>
                      </div>
                      <div className="text-sm text-blue-700">
                        Hotel transfers, island tours, cruise ship pickups
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-300">
                    <div className="font-bold text-emerald-800 text-center mb-2">🎯 THE KEY:</div>
                    <div className="text-sm text-emerald-700 text-center">
                      • Mix services throughout the day<br/>
                      • Never have idle time<br/>
                      • App tells you what's hot RIGHT NOW<br/>
                      • Earn from MULTIPLE streams daily!
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning & Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">📚</div>
                    We TEACH You How to Succeed
                  </CardTitle>
                  <CardDescription>
                    Never kick you off - always show you better ways
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">🎓</div>
                        <div className="font-bold text-blue-800">In-App Training</div>
                      </div>
                      <div className="text-sm text-blue-700">
                        • Quick videos on new services<br/>
                        • Tips from top earners<br/>
                        • Best practices for each area<br/>
                        • Safety and customer service guides
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">💡</div>
                        <div className="font-bold text-green-800">Smart Suggestions</div>
                      </div>
                      <div className="text-sm text-green-700">
                        • "Try barrel service - you're already at the port!"<br/>
                        • "School run would fit your morning schedule"<br/>
                        • "Medical transport needs drivers like you"<br/>
                        • "Tourism pays extra on weekends"
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">🏆</div>
                        <div className="font-bold text-purple-800">Success Stories</div>
                      </div>
                      <div className="text-sm text-purple-700">
                        • "John added delivery - now earns 40% more!"<br/>
                        • "Mary does school runs - steady morning income"<br/>
                        • "Paul combines taxi + barrels - J$20K days!"<br/>
                        • "Lisa focuses on medical - premium rates"
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
                    <div className="text-center">
                      <div className="font-bold text-purple-800 text-lg mb-2">❤️ OUR PROMISE:</div>
                      <div className="text-sm text-purple-700">
                        <strong>We NEVER kick you off</strong><br/>
                        <strong>We TEACH you to earn more</strong><br/>
                        <strong>We SHOW you what works</strong><br/>
                        <strong>We HELP you grow!</strong>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Area Intelligence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">🗺️</div>
                    Know Your Area - Own Your Zone!
                  </CardTitle>
                  <CardDescription>
                    App tells you exactly what works in YOUR area
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="font-bold text-red-800 mb-2">🔥 HOT ZONES RIGHT NOW</div>
                      <div className="text-sm text-red-700">
                        • "Downtown Kingston - High demand for rides"<br/>
                        • "Montego Bay Airport - Need more drivers"<br/>
                        • "Spanish Town - Barrel service shortage"<br/>
                        • "New Kingston - Corporate lunch delivery"
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <div className="font-bold text-amber-800 mb-2">📈 TRENDING SERVICES</div>
                      <div className="text-sm text-amber-700">
                        • "School transport up 300% this month"<br/>
                        • "Medical delivery growing fast"<br/>
                        • "Tourism bookings increasing"<br/>
                        • "Corporate accounts expanding"
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-bold text-green-800 mb-2">💎 HIDDEN OPPORTUNITIES</div>
                      <div className="text-sm text-green-700">
                        • "Early morning airport runs - no competition"<br/>
                        • "Sunday church pickups - steady income"<br/>
                        • "Late night pharmacy runs - premium rates"<br/>
                        • "Weekend event transport - big tips!"
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="font-bold text-blue-800 mb-2">🎯 YOUR PERFECT FIT</div>
                      <div className="text-sm text-blue-700">
                        Based on your location, vehicle, and schedule:<br/>
                        <strong>• Morning: School runs (J$3,500)</strong><br/>
                        <strong>• Midday: Barrel service (J$4,000)</strong><br/>
                        <strong>• Evening: Food delivery (J$3,000)</strong><br/>
                        <strong>• Total daily potential: J$10,500+</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-gold-50 to-yellow-50 rounded-lg border-2 border-yellow-400">
                    <div className="text-center">
                      <div className="font-bold text-yellow-800 text-lg mb-2">🌟 BOTTOM LINE:</div>
                      <div className="text-sm text-yellow-700">
                        <strong>The app KNOWS your area</strong><br/>
                        <strong>SHOWS you opportunities</strong><br/>
                        <strong>TEACHES you to maximize</strong><br/>
                        <strong>You EARN MORE every day!</strong>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Autonomous Operations Tab */}
          <TabsContent value="autonomous-ops">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">🤖 THE APP OPERATES ITSELF!</h2>
                <div className="text-2xl font-semibold mb-6">
                  🗣️ TALK TO YOUR BUSINESS • 🤖 AUTO-HANDLES EVERYTHING • 🚀 RUNS ITSELF
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">🗣️</div>
                    <div className="font-bold">VOICE CONTROL</div>
                    <div className="text-sm opacity-90">"Show me today's earnings"</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">🤖</div>
                    <div className="font-bold">AUTO-OPERATIONS</div>
                    <div className="text-sm opacity-90">Handles bookings automatically</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">🧠</div>
                    <div className="font-bold">SMART DECISIONS</div>
                    <div className="text-sm opacity-90">Learns and improves itself</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Voice Control Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">🗣️</div>
                    Talk to Your Business Like a Person
                  </CardTitle>
                  <CardDescription>
                    Control everything with your voice - the app understands and responds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="font-bold text-blue-800 mb-1">💰 "How much did I earn today?"</div>
                      <div className="text-sm text-blue-700">
                        App: "You earned J$15,750 today from 23 completed orders. That's 18% more than yesterday!"
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-bold text-green-800 mb-1">🚚 "Any new pickup requests?"</div>
                      <div className="text-sm text-green-700">
                        App: "Yes! 3 new barrel pickups from Kingston Port. Should I accept them all?"
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="font-bold text-purple-800 mb-1">📊 "Show me this week's performance"</div>
                      <div className="text-sm text-purple-700">
                        App: "This week: J$89,340 earnings, 4.9 rating, 127 deliveries completed. Excellent week!"
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <div className="font-bold text-amber-800 mb-1">⚙️ "Increase my barrel clearing price to J$6,000"</div>
                      <div className="text-sm text-amber-700">
                        App: "Done! Barrel service price updated to J$6,000. I'll notify existing customers."
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-300">
                    <div className="font-bold text-emerald-800 text-center mb-2">🎯 VOICE CONTROL PERKS:</div>
                    <div className="text-sm text-emerald-700 text-center">
                      • Control business while driving<br/>
                      • Get instant updates anywhere<br/>
                      • Change prices on the go<br/>
                      • Monitor everything hands-free
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Autonomous Operations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">🤖</div>
                    The App Runs Your Business Automatically
                  </CardTitle>
                  <CardDescription>
                    Set it up once - it handles everything while you focus on service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">📞</div>
                        <div className="font-bold text-blue-800">Auto-Accept Bookings</div>
                      </div>
                      <div className="text-sm text-blue-700">
                        App automatically accepts orders that match your criteria and availability
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">💰</div>
                        <div className="font-bold text-green-800">Smart Pricing</div>
                      </div>
                      <div className="text-sm text-green-700">
                        Adjusts prices based on demand, time, and competition automatically
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">🗺️</div>
                        <div className="font-bold text-purple-800">Route Optimization</div>
                      </div>
                      <div className="text-sm text-purple-700">
                        Plans most efficient pickup and delivery routes to save time and fuel
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">📊</div>
                        <div className="font-bold text-amber-800">Auto-Reports</div>
                      </div>
                      <div className="text-sm text-amber-700">
                        Generates daily/weekly earnings and performance reports automatically
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">💬</div>
                        <div className="font-bold text-red-800">Customer Communication</div>
                      </div>
                      <div className="text-sm text-red-700">
                        Sends updates, ETAs, and confirmations to customers automatically
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Self-Management Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">🧠</div>
                    Gets Smarter Every Day
                  </CardTitle>
                  <CardDescription>
                    The more you use it, the better it becomes at running your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="font-semibold text-purple-800">🎯 Learns Your Patterns</div>
                      <div className="text-sm text-purple-700">Knows your best times, routes, and customer preferences</div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div className="font-semibold text-green-800">📈 Improves Performance</div>
                      <div className="text-sm text-green-700">Suggests better prices and strategies to increase earnings</div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-amber-50 to-green-50 rounded-lg">
                      <div className="font-semibold text-amber-800">🔧 Self-Maintenance</div>
                      <div className="text-sm text-amber-700">Updates itself, fixes issues, and stays current automatically</div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg">
                      <div className="font-semibold text-red-800">⚠️ Predicts Problems</div>
                      <div className="text-sm text-red-700">Warns you about potential issues before they happen</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
                    <div className="text-center">
                      <div className="font-bold text-purple-800 text-lg mb-2">🚀 THE RESULT:</div>
                      <div className="text-sm text-purple-700">
                        <strong>You focus on service delivery</strong><br/>
                        <strong>The app handles the business</strong><br/>
                        <strong>More earnings, less stress!</strong>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Control & Ownership */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">👑</div>
                    YOU Stay in Complete Control
                  </CardTitle>
                  <CardDescription>
                    The app operates itself, but YOU make all the final decisions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                      <div className="text-2xl">✋</div>
                      <div>
                        <div className="font-bold text-emerald-800">Override Anytime</div>
                        <div className="text-sm text-emerald-700">Stop, change, or redirect any automated action instantly</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="text-2xl">⚙️</div>
                      <div>
                        <div className="font-bold text-blue-800">Set Your Rules</div>
                        <div className="text-sm text-blue-700">Define what the app can and cannot do automatically</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="text-2xl">👀</div>
                      <div>
                        <div className="font-bold text-purple-800">Monitor Everything</div>
                        <div className="text-sm text-purple-700">See all actions, decisions, and results in real-time</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <div className="text-2xl">🔒</div>
                      <div>
                        <div className="font-bold text-amber-800">Your Data, Your Rules</div>
                        <div className="text-sm text-amber-700">Complete ownership of all business data and decisions</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-gold-50 to-yellow-50 rounded-lg border-2 border-yellow-400">
                    <div className="text-center">
                      <div className="font-bold text-yellow-800 text-lg mb-2">💎 ULTIMATE FREEDOM:</div>
                      <div className="text-sm text-yellow-700">
                        <strong>App handles routine tasks</strong><br/>
                        <strong>You focus on growing your empire</strong><br/>
                        <strong>Best of both worlds!</strong>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Dashboard & Vehicle Tracking Tab */}
          <TabsContent value="dashboard-system">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">🚗 IN-CAR DASHBOARD + GPS TRACKING!</h2>
                <div className="text-2xl font-semibold mb-6">
                  💻 SAFER THAN PHONE • 📡 COMPLETE CAR TRACKING • 🛡️ SECURITY MONITORING
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">💻</div>
                    <div className="font-bold">DASHBOARD DISPLAY</div>
                    <div className="text-sm opacity-90">Better than phone - park phone safely</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">📡</div>
                    <div className="font-bold">GPS TRACKING</div>
                    <div className="text-sm opacity-90">Know where every vehicle is</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">🛡️</div>
                    <div className="font-bold">SECURITY SYSTEM</div>
                    <div className="text-sm opacity-90">Car movement alerts & protection</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Dashboard Display System */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">💻</div>
                    In-Car Dashboard Display - SAFER Than Phone!
                  </CardTitle>
                  <CardDescription>
                    Professional dashboard display - park your phone and drive safely
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-400">
                    <div className="font-bold text-green-800 mb-2">✅ SIMPLE AS THAT - Sign In & GO!</div>
                    <div className="text-sm text-green-700">
                      • Just sign yourself in - BOOM - off and running!<br/>
                      • Phone still works if you want<br/>
                      • But dashboard is BEST for safety<br/>
                      • Your choice - we keep it SIMPLE!
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">📱</div>
                        <div className="font-bold text-blue-800">Phone STILL Works!</div>
                      </div>
                      <div className="text-sm text-blue-700">
                        • YES - you can still use your phone<br/>
                        • Your choice - phone or dashboard<br/>
                        • We recommend dashboard for safety<br/>
                        • But we keep it FLEXIBLE for you!
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">🖥️</div>
                        <div className="font-bold text-green-800">Dashboard Display (BEST Option)</div>
                      </div>
                      <div className="text-sm text-green-700">
                        • Connect to car's display system<br/>
                        • Mount laptop/tablet on dashboard<br/>
                        • SAFER - hands on wheel<br/>
                        • BIGGER screen - easier to see
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">⚡</div>
                        <div className="font-bold text-purple-800">SIMPLE Sign-In Process</div>
                      </div>
                      <div className="text-sm text-purple-700">
                        • Sign yourself in - that's it!<br/>
                        • BOOM - off and running!<br/>
                        • Works on phone OR dashboard<br/>
                        • Simple as that - no complications!
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-300">
                    <div className="font-bold text-emerald-800 text-center mb-2">🎯 THE BOTTOM LINE:</div>
                    <div className="text-sm text-emerald-700 text-center">
                      <strong>• Phone still works if you want it!</strong><br/>
                      <strong>• Dashboard is BEST for safety</strong><br/>
                      <strong>• Sign in - BOOM - off and running!</strong><br/>
                      <strong>• SIMPLE AS THAT!</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* GPS Vehicle Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">📡</div>
                    Complete Vehicle GPS Tracking System
                  </CardTitle>
                  <CardDescription>
                    Know exactly where every vehicle is - complete fleet control
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">🗺️</div>
                        <div className="font-bold text-blue-800">Real-Time Location</div>
                      </div>
                      <div className="text-sm text-blue-700">
                        • See all vehicles on live map<br/>
                        • GPS coordinates updated every 30 seconds<br/>
                        • Route history and patterns<br/>
                        • Distance traveled tracking
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">⚡</div>
                        <div className="font-bold text-green-800">Movement Alerts</div>
                      </div>
                      <div className="text-sm text-green-700">
                        • Instant alerts when car moves<br/>
                        • Unauthorized movement detection<br/>
                        • Speed limit monitoring<br/>
                        • Idle time tracking for efficiency
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">📊</div>
                        <div className="font-bold text-purple-800">Fleet Insights</div>
                      </div>
                      <div className="text-sm text-purple-700">
                        • Fuel efficiency analysis<br/>
                        • Driver performance metrics<br/>
                        • Route optimization suggestions<br/>
                        • Maintenance scheduling based on usage
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
                    <div className="font-bold text-blue-800 text-center mb-2">🎯 TRACKING CONTROL:</div>
                    <div className="text-sm text-blue-700 text-center">
                      • WE control the GPS system<br/>
                      • ANY amount of GPS points you want<br/>
                      • COMPLETE insights into vehicle operations<br/>
                      • SECURITY protection for your fleet
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Protection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">🛡️</div>
                    Complete Vehicle Security System
                  </CardTitle>
                  <CardDescription>
                    Protect your entire fleet with advanced security monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">🚨</div>
                        <div className="font-bold text-red-800">Theft Protection</div>
                      </div>
                      <div className="text-sm text-red-700">
                        • Instant alerts if car moves without authorization<br/>
                        • GPS tracking even if engine is off<br/>
                        • Emergency contact notifications<br/>
                        • Integration with security companies
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">🔍</div>
                        <div className="font-bold text-amber-800">24/7 Monitoring</div>
                      </div>
                      <div className="text-sm text-amber-700">
                        • Continuous vehicle monitoring<br/>
                        • Battery level tracking<br/>
                        • Engine diagnostics alerts<br/>
                        • Maintenance reminders
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">📱</div>
                        <div className="font-bold text-green-800">Mobile Control</div>
                      </div>
                      <div className="text-sm text-green-700">
                        • Remote engine disable (if supported)<br/>
                        • Horn/light activation for location<br/>
                        • Geofence alerts (enter/leave areas)<br/>
                        • Driver behavior monitoring
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">💰</div>
                        <div className="font-bold text-blue-800">Insurance Benefits</div>
                      </div>
                      <div className="text-sm text-blue-700">
                        • Lower insurance premiums with tracking<br/>
                        • Accident reconstruction data<br/>
                        • Driver safety scoring<br/>
                        • Proof of vehicle usage for claims
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Installation & Setup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">🔧</div>
                    Easy Installation & Setup
                  </CardTitle>
                  <CardDescription>
                    Professional installation and complete system setup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <div className="font-semibold">GPS Tracker Installation</div>
                        <div className="text-sm text-gray-600">Professional install in your vehicle (hidden location)</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <div className="font-semibold">Dashboard Setup</div>
                        <div className="text-sm text-gray-600">Connect to your car display or mount tablet/laptop</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <div className="font-semibold">YaadFlex Integration</div>
                        <div className="text-sm text-gray-600">Link tracking system to your broker account</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <div className="font-semibold">Complete Control</div>
                        <div className="text-sm text-gray-600">Monitor and manage everything from anywhere</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-gold-50 to-yellow-50 rounded-lg border-2 border-yellow-400">
                    <div className="text-center">
                      <div className="font-bold text-yellow-800 text-lg mb-2">💎 COMPLETE SYSTEM:</div>
                      <div className="text-sm text-yellow-700">
                        <strong>Dashboard Display + GPS Tracking + Security</strong><br/>
                        <strong>Everything you need for professional operations</strong><br/>
                        <strong>Control your entire fleet from anywhere!</strong>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing System Tab */}
          <TabsContent value="pricing-system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    💰 Set Your Pricing & Weights
                  </CardTitle>
                  <CardDescription>
                    Create your pricing structure based on weight, distance, and service type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Weight-Based Pricing */}
                  <div>
                    <h3 className="font-semibold mb-3">⚖️ Weight-Based Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-2 block">0-10 kg</label>
                        <Input placeholder="J$2,500" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block">10-25 kg</label>
                        <Input placeholder="J$4,500" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block">25-50 kg</label>
                        <Input placeholder="J$7,500" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block">50+ kg</label>
                        <Input placeholder="J$12,000" />
                      </div>
                    </div>
                  </div>

                  {/* Service Type Pricing */}
                  <div>
                    <h3 className="font-semibold mb-3">📦 Service Type Pricing</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-semibold">🚢 Port Clearing</div>
                          <div className="text-sm text-gray-600">Basic port processing</div>
                        </div>
                        <Input className="w-32" placeholder="J$8,500" />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-semibold">📦 Barrel Service</div>
                          <div className="text-sm text-gray-600">Barrel clearing + delivery</div>
                        </div>
                        <Input className="w-32" placeholder="J$5,500" />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-semibold">🚗 Vehicle Import</div>
                          <div className="text-sm text-gray-600">Car clearing + registration</div>
                        </div>
                        <Input className="w-32" placeholder="J$25,000" />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" data-testid="button-save-pricing">
                    💾 Save Pricing Structure
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📊 Price Calculator Preview</CardTitle>
                  <CardDescription>
                    See how your pricing works for different scenarios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Sample Calculations */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-semibold mb-2">📦 Example: Barrel from Kingston Port</div>
                    <div className="text-sm space-y-1">
                      <div>Weight: 15 kg → <span className="font-semibold">J$4,500</span></div>
                      <div>Barrel Service: <span className="font-semibold">J$5,500</span></div>
                      <div>Home Delivery: <span className="font-semibold">J$2,000</span></div>
                      <div className="border-t pt-2 font-bold text-lg">Total: J$12,000</div>
                      <div className="text-xs text-green-600">You keep: J$10,200 (85%)</div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-semibold mb-2">🚗 Example: Car Import</div>
                    <div className="text-sm space-y-1">
                      <div>Vehicle Import: <span className="font-semibold">J$25,000</span></div>
                      <div>Registration: <span className="font-semibold">J$8,000</span></div>
                      <div>Port Processing: <span className="font-semibold">J$5,000</span></div>
                      <div className="border-t pt-2 font-bold text-lg">Total: J$38,000</div>
                      <div className="text-xs text-green-600">You keep: J$32,300 (85%)</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="font-semibold mb-2">💡 Pro Tip</div>
                    <div className="text-sm">
                      Set competitive prices to win more customers. Remember - you keep 85% of everything you earn!
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* QR System Tab */}
          <TabsContent value="qr-system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-2xl">📱</div>
                    QR Code Scanning System
                  </CardTitle>
                  <CardDescription>
                    Professional QR codes replace names for privacy and efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* QR Code Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border">
                      <div className="text-3xl">📦</div>
                      <div>
                        <div className="font-bold text-blue-800">Barrel QR Codes</div>
                        <div className="text-sm text-blue-700">Each barrel gets unique QR code - no names written on barrels</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border">
                      <div className="text-3xl">🚚</div>
                      <div>
                        <div className="font-bold text-green-800">Driver Pickup Scanning</div>
                        <div className="text-sm text-green-700">Riders/drivers scan QR codes to confirm pickups</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border">
                      <div className="text-3xl">🏷️</div>
                      <div>
                        <div className="font-bold text-purple-800">No Names - Just Numbers</div>
                        <div className="text-sm text-purple-700">Everything tracked by QR codes and ID numbers for privacy</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">📋 Generate QR Code</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Item Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select item type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="barrel">📦 Barrel</SelectItem>
                            <SelectItem value="package">📮 Package</SelectItem>
                            <SelectItem value="vehicle">🚗 Vehicle</SelectItem>
                            <SelectItem value="documents">📄 Documents</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Weight (kg)</label>
                          <Input placeholder="15.5" />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Pickup Location</label>
                          <Input placeholder="Kingston Port" />
                        </div>
                      </div>

                      <Button className="w-full" data-testid="button-generate-qr">
                        📱 Generate QR Code
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📱 Sample QR Code System</CardTitle>
                  <CardDescription>
                    How the QR scanning system works in practice
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Sample QR Display */}
                  <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-8xl mb-3">⬛</div>
                    <div className="font-bold text-lg">QR Code</div>
                    <div className="text-sm text-gray-600 mt-2">
                      ID: YF-BRL-789234<br/>
                      Weight: 15.5 kg<br/>
                      Type: Barrel
                    </div>
                  </div>

                  {/* Scanning Process */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">🔄 Scanning Process:</h3>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <div className="font-semibold">Item Arrives at Port</div>
                        <div className="text-sm text-gray-600">QR code generated automatically</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <div className="font-semibold">Driver Scans QR</div>
                        <div className="text-sm text-gray-600">Confirms pickup with mobile app</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <div className="font-semibold">Customer Tracking</div>
                        <div className="text-sm text-gray-600">Real-time updates via QR code</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <div className="font-semibold">Delivery Confirmation</div>
                        <div className="text-sm text-gray-600">Scan QR at delivery address</div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Benefits */}
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="font-bold text-green-800 mb-1">🔒 Privacy & Efficiency Benefits:</div>
                    <div className="text-sm text-green-700">
                      • No personal names on packages<br/>
                      • Faster processing with scanning<br/>
                      • Reduces errors and mix-ups<br/>
                      • Professional tracking system
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceCategories.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-all border-2 hover:border-blue-300">
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-3">{service.icon}</div>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <div className="font-semibold mb-2">What's Included:</div>
                        <ul className="space-y-1">
                          {service.id === 'port_clearing' && (
                            <>
                              <li>• Port documentation handling</li>
                              <li>• Customs clearance assistance</li>
                              <li>• Inspection coordination</li>
                              <li>• Payment processing</li>
                            </>
                          )}
                          {service.id === 'barrel_service' && (
                            <>
                              <li>• Barrel pickup from port</li>
                              <li>• Customs duty payment</li>
                              <li>• Direct home delivery</li>
                              <li>• Unpacking service available</li>
                            </>
                          )}
                          {service.id === 'vehicle_import' && (
                            <>
                              <li>• Vehicle inspection</li>
                              <li>• Registration assistance</li>
                              <li>• Insurance coordination</li>
                              <li>• Plate acquisition</li>
                            </>
                          )}
                          {service.id === 'home_delivery' && (
                            <>
                              <li>• Direct to your address</li>
                              <li>• Schedule flexibility</li>
                              <li>• Real-time tracking</li>
                              <li>• Safe handling guaranteed</li>
                            </>
                          )}
                          {service.id === 'customs' && (
                            <>
                              <li>• Document preparation</li>
                              <li>• Duty calculation</li>
                              <li>• Tax assistance</li>
                              <li>• Compliance verification</li>
                            </>
                          )}
                          {service.id === 'express' && (
                            <>
                              <li>• Same-day service</li>
                              <li>• Emergency clearing</li>
                              <li>• Priority processing</li>
                              <li>• 24/7 availability</li>
                            </>
                          )}
                        </ul>
                      </div>
                      <Button className="w-full" data-testid={`button-service-${service.id}`}>
                        Find {service.name} Brokers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Become a Broker Tab */}
          <TabsContent value="become-broker">
            {/* Massive Benefits Banner */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">🚀 RUN YOUR OWN LOGISTICS EMPIRE!</h2>
                <div className="text-2xl font-semibold mb-6">
                  ⚡ KEEP 85% OF ALL EARNINGS ⚡ SET YOUR OWN STANDARDS ⚡
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="font-bold">85% YOURS</div>
                    <div className="text-sm opacity-90">Only 15% platform fee</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">⚙️</div>
                    <div className="font-bold">YOUR RULES</div>
                    <div className="text-sm opacity-90">Set your own standards</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">🏢</div>
                    <div className="font-bold">OWN PLATFORM</div>
                    <div className="text-sm opacity-90">Like owning your business</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <div className="text-3xl mb-2">📈</div>
                    <div className="font-bold">UNLIMITED</div>
                    <div className="text-sm opacity-90">Growth potential</div>
                  </div>
                </div>
                <Button className="mt-6 bg-white text-green-600 hover:bg-gray-100 text-xl px-8 py-4 font-bold" size="lg">
                  🚀 START YOUR EMPIRE NOW!
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Join as a Logistics Broker
                  </CardTitle>
                  <CardDescription>
                    <span className="text-green-600 font-bold">85% earnings to you!</span> Grow your business by connecting with customers who need logistics services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Business Name</label>
                    <Input placeholder="Your logistics company name" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Services Offered</label>
                    <div className="grid grid-cols-2 gap-2">
                      {serviceCategories.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <input type="checkbox" id={service.id} className="rounded" />
                          <label htmlFor={service.id} className="text-sm">{service.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Experience (years)</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="4-7">4-7 years</SelectItem>
                        <SelectItem value="8-12">8-12 years</SelectItem>
                        <SelectItem value="12+">12+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">Contact Number</label>
                    <Input placeholder="+1-876-555-0000" />
                  </div>

                  <Button className="w-full" data-testid="button-register-broker">
                    📝 Register as Broker
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>💎 TREMENDOUS BENEFITS - RUN YOUR OWN PLATFORM!</CardTitle>
                  <CardDescription>
                    <span className="text-emerald-600 font-bold text-lg">Why YaadFlex Brokers Earn More & Control Everything!</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                      <div className="text-2xl">💰</div>
                      <div>
                        <div className="font-bold text-emerald-800">85% EARNINGS TO YOU!</div>
                        <div className="text-sm text-emerald-700">Keep 85% of every transaction - Only 15% platform fee vs 25-30% elsewhere!</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="text-2xl">⚙️</div>
                      <div>
                        <div className="font-bold text-blue-800">SET YOUR OWN STANDARDS</div>
                        <div className="text-sm text-blue-700">Your prices, your rules, your service quality - Total control!</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="text-2xl">🏢</div>
                      <div>
                        <div className="font-bold text-purple-800">RUN YOUR OWN PLATFORM</div>
                        <div className="text-sm text-purple-700">Operate like you OWN the business - because you practically do!</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <div className="text-2xl">📈</div>
                      <div>
                        <div className="font-bold text-amber-800">UNLIMITED GROWTH</div>
                        <div className="text-sm text-amber-700">Build your logistics empire - No limits on earnings or customers!</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="text-2xl">🌍</div>
                      <div>
                        <div className="font-bold text-green-800">GLOBAL REACH</div>
                        <div className="text-sm text-green-700">Access customers worldwide, not just locally - YaadFlex goes global!</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="text-2xl">🚫</div>
                      <div>
                        <div className="font-bold text-red-800">NO CORPORATE CONTROL</div>
                        <div className="text-sm text-red-700">Unlike other platforms - YOU control your business, not some corporation!</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg border-2 border-emerald-300">
                    <div className="text-center">
                      <div className="font-bold text-emerald-800 text-lg mb-2">
                        🎯 THE BOTTOM LINE: TREMENDOUS BENEFITS!
                      </div>
                      <div className="text-sm text-emerald-700">
                        <strong>Other platforms:</strong> 25-30% fees, corporate rules, limited control<br/>
                        <strong>YaadFlex:</strong> 15% fee, YOUR rules, YOUR platform, UNLIMITED growth!
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Track Shipment Tab */}
          <TabsContent value="track-shipment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Track Your Shipment
                </CardTitle>
                <CardDescription>
                  Enter your tracking number to see your shipment status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Input 
                    placeholder="Enter tracking number (e.g., YF-12345-JA)" 
                    className="flex-1"
                    data-testid="input-tracking-number"
                  />
                  <Button data-testid="button-track-shipment">
                    <MapPin className="h-4 w-4 mr-2" />
                    Track
                  </Button>
                </div>
                
                {/* Sample Tracking Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-center text-gray-500 mb-4">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <div>Enter a tracking number to see shipment details</div>
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