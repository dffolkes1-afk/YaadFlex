import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Bike, Package, MapPin, DollarSign, Clock, Star, Users, 
  Zap, Shield, Phone, Mail, User, CheckCircle, TrendingUp,
  Globe, Heart, Award, Target, Briefcase, Home
} from 'lucide-react';

interface RiderStats {
  totalEarnings: string;
  deliveriesCompleted: number;
  rating: number;
  hoursWorked: number;
}

export default function HeritageDelivery() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  // Sample rider stats
  const topRiders: RiderStats[] = [
    { totalEarnings: '$2,450', deliveriesCompleted: 156, rating: 4.9, hoursWorked: 45 },
    { totalEarnings: '$1,980', deliveriesCompleted: 134, rating: 4.8, hoursWorked: 38 },
    { totalEarnings: '$1,750', deliveriesCompleted: 98, rating: 4.9, hoursWorked: 32 }
  ];

  const handleQuickStart = () => {
    setIsRegistering(true);
    toast({
      title: "🚀 Welcome to Heritage Delivery!",
      description: "Let's get you started earning money right away!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="mb-6">
              <Bike className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
              <h1 className="text-5xl font-bold mb-4">
                🏛️ YaadFlex Heritage Delivery
              </h1>
              <p className="text-xl opacity-90 mb-6">
                Jump In, Start Earning, Build Your Legacy 🇯🇲
              </p>
              <p className="text-lg opacity-80 max-w-3xl mx-auto">
                Easy e-bike and package delivery system. Separate pickup and delivery riders. 
                Start earning within 30 minutes. No complicated requirements - just bring your energy!
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-yellow-400 text-black text-lg px-4 py-2">
                <DollarSign className="h-4 w-4 mr-1" />
                85% Rider Earnings
              </Badge>
              <Badge variant="secondary" className="bg-green-400 text-black text-lg px-4 py-2">
                <Clock className="h-4 w-4 mr-1" />
                Start in 30 Minutes
              </Badge>
              <Badge variant="secondary" className="bg-blue-400 text-white text-lg px-4 py-2">
                <Bike className="h-4 w-4 mr-1" />
                E-Bikes Available
              </Badge>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg"
                onClick={handleQuickStart}
                data-testid="button-quick-start"
              >
                🚀 Start Earning Now!
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg"
                data-testid="button-learn-more"
              >
                📚 Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">🏠 Overview</TabsTrigger>
            <TabsTrigger value="pickup">📦 Pickup Riders</TabsTrigger>
            <TabsTrigger value="delivery">🚴‍♂️ Delivery Riders</TabsTrigger>
            <TabsTrigger value="earnings">💰 Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Heritage Concept */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-yellow-500" />
                  🏛️ Heritage Delivery Concept
                </CardTitle>
                <CardDescription>
                  Building a legacy of opportunity for Caribbean riders and beyond
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Why Heritage?
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                        <span>Easy entry - no complicated requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                        <span>Separate pickup & delivery system for efficiency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                        <span>E-bikes and traditional bikes welcome</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                        <span>Build generational wealth through delivery</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      Jump In & Start
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-1" />
                        <span>Register in under 10 minutes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-1" />
                        <span>Get your first delivery within 30 minutes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-1" />
                        <span>No vehicle? We have e-bike partnerships</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-1" />
                        <span>Work when you want, earn what you deserve</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Earners */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  🌟 Top Heritage Riders This Week
                </CardTitle>
                <CardDescription>
                  See what our successful riders are earning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {topRiders.map((rider, index) => (
                    <div key={index} className="bg-gradient-to-br from-yellow-50 to-green-50 p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="bg-yellow-400 text-black">
                          #{index + 1} Rider
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{rider.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-green-600">{rider.totalEarnings}</div>
                        <div className="text-sm text-gray-600">
                          {rider.deliveriesCompleted} deliveries • {rider.hoursWorked}h worked
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pickup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-blue-600" />
                  📦 Pickup Rider System
                </CardTitle>
                <CardDescription>
                  Specialized riders for package collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-blue-600">What Pickup Riders Do:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Visit Businesses</div>
                          <div className="text-sm text-gray-600">Collect packages from restaurants, shops, and businesses</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Package Processing</div>
                          <div className="text-sm text-gray-600">Verify items, take photos, update system</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Home className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Hub Delivery</div>
                          <div className="text-sm text-gray-600">Transport to local delivery hubs</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-green-600">Pickup Rider Benefits:</h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          $12-18 per pickup
                        </div>
                        <div className="text-sm text-gray-600">Plus distance bonuses</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          Flexible Schedule
                        </div>
                        <div className="text-sm text-gray-600">Choose your pickup routes</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="font-medium flex items-center gap-2">
                          <Bike className="h-4 w-4 text-green-600" />
                          Vehicle Options
                        </div>
                        <div className="text-sm text-gray-600">E-bike, regular bike, or scooter</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700"
                    data-testid="button-become-pickup-rider"
                  >
                    📦 Become a Pickup Rider
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Bike className="h-6 w-6 text-green-600" />
                  🚴‍♂️ Delivery Rider System
                </CardTitle>
                <CardDescription>
                  Fast final-mile delivery to customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-green-600">What Delivery Riders Do:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Home className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Hub Collection</div>
                          <div className="text-sm text-gray-600">Pick up packages from local hubs</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Customer Delivery</div>
                          <div className="text-sm text-gray-600">Fast delivery to customer locations</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Customer Service</div>
                          <div className="text-sm text-gray-600">Friendly service and updates</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-purple-600">Delivery Rider Benefits:</h3>
                    <div className="space-y-3">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-purple-600" />
                          $8-15 per delivery
                        </div>
                        <div className="text-sm text-gray-600">Plus tips and bonuses</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="font-medium flex items-center gap-2">
                          <Zap className="h-4 w-4 text-purple-600" />
                          Quick Turnaround
                        </div>
                        <div className="text-sm text-gray-600">Multiple deliveries per hour</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="font-medium flex items-center gap-2">
                          <Heart className="h-4 w-4 text-purple-600" />
                          Customer Connection
                        </div>
                        <div className="text-sm text-gray-600">Build relationships, get ratings</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="button-become-delivery-rider"
                  >
                    🚴‍♂️ Become a Delivery Rider
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <DollarSign className="h-6 w-6 text-green-600" />
                    💰 Weekly Earnings Potential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">$800-1,500</div>
                        <div className="text-sm text-gray-600">Part-time (20-30 hours/week)</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">$1,500-2,500</div>
                        <div className="text-sm text-gray-600">Full-time (40+ hours/week)</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">$3,000+</div>
                        <div className="text-sm text-gray-600">Top performers with bonuses</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                    🎯 Getting Started Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Valid ID or driver's license</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Smartphone with GPS</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Bike, e-bike, or scooter (or we help you get one)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Basic helmet and safety gear</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Positive attitude and work ethic</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      data-testid="button-start-registration"
                    >
                      🚀 Start Your Heritage Journey
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Registration Modal */}
        {isRegistering && (
          <Card className="fixed inset-4 z-50 bg-white shadow-2xl max-w-2xl mx-auto my-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  🚀 Quick Start Registration
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsRegistering(false)}
                  data-testid="button-close-registration"
                >
                  ✕
                </Button>
              </CardTitle>
              <CardDescription>
                Get started earning with Heritage Delivery in minutes!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" data-testid="input-name" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Your phone number" data-testid="input-phone" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" data-testid="input-email" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="vehicle">Vehicle Type</Label>
                  <select className="w-full p-2 border rounded-md" data-testid="select-vehicle">
                    <option>E-bike</option>
                    <option>Regular bike</option>
                    <option>Scooter</option>
                    <option>Need to get one</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  data-testid="button-register-pickup"
                >
                  📦 Pickup Rider
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  data-testid="button-register-delivery"
                >
                  🚴‍♂️ Delivery Rider
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}