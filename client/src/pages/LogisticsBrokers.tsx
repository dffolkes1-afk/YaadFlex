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
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 p-4 rounded-2xl border-2 border-blue-300 shadow-lg">
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
              🎯 Professional Port Clearing & Logistics Services
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Clear barrels, cars & goods at ports • Direct home delivery • Customs assistance
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Join as a Logistics Broker
                  </CardTitle>
                  <CardDescription>
                    Grow your business by connecting with customers who need logistics services
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
                  <CardTitle>🎯 Why Join YaadFlex Brokers?</CardTitle>
                  <CardDescription>
                    Benefits of joining our logistics network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-semibold text-green-800">Direct Customer Access</div>
                        <div className="text-sm text-green-700">Connect with customers needing your services</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Star className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-800">Build Your Reputation</div>
                        <div className="text-sm text-blue-700">Customer reviews and ratings system</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-semibold text-purple-800">Verified Badge</div>
                        <div className="text-sm text-purple-700">Get verified status for trust</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                      <div>
                        <div className="font-semibold text-amber-800">Grow Your Business</div>
                        <div className="text-sm text-amber-700">Reach more customers across Jamaica</div>
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