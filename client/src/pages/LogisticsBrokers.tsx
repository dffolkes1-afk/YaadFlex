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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="find-brokers">🔍 Find Brokers</TabsTrigger>
            <TabsTrigger value="services">📋 Services</TabsTrigger>
            <TabsTrigger value="become-broker">👥 Join as Broker</TabsTrigger>
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