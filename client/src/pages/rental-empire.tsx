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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RentalProperty = {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  category: string;
  address: string;
  parish: string;
  dailyRate?: string;
  monthlyRate?: string;
  primaryImageUrl?: string;
  isAvailable: boolean;
  averageRating: string;
  totalBookings: number;
  isVerified: boolean;
  amenities: string[];
  createdAt: string;
};

export default function RentalEmpire() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedParish, setSelectedParish] = useState('all');
  const [maxBudget, setMaxBudget] = useState('');

  const [newPropertyForm, setNewPropertyForm] = useState({
    title: '',
    description: '',
    propertyType: 'residential',
    category: 'house',
    address: '',
    parish: 'Kingston',
    dailyRate: '',
    monthlyRate: '',
    amenities: [] as string[],
    contactPhone: '',
  });

  // Fetch available rental properties
  const { data: properties, isLoading: propertiesLoading } = useQuery<RentalProperty[]>({
    queryKey: ['/api/rental-properties', selectedCategory, selectedParish, maxBudget],
    retry: false,
  });

  // Fetch user's rental properties (if owner)
  const { data: myProperties, isLoading: myPropertiesLoading } = useQuery<RentalProperty[]>({
    queryKey: ['/api/my-rental-properties'],
    retry: false,
  });

  // Add new rental property
  const addPropertyMutation = useMutation({
    mutationFn: async (data: typeof newPropertyForm) => {
      const response = await apiRequest('POST', '/api/rental-properties', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Property Added! 🏠",
        description: "Your rental property is now live on YardFlex!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/my-rental-properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rental-properties'] });
      setNewPropertyForm({
        title: '',
        description: '',
        propertyType: 'residential',
        category: 'house',
        address: '',
        parish: 'Kingston',
        dailyRate: '',
        monthlyRate: '',
        amenities: [],
        contactPhone: '',
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please log in to add rental properties.",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Property Add Failed",
        description: "Unable to add your property. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set availability alert
  const alertMutation = useMutation({
    mutationFn: async (alertData: any) => {
      const response = await apiRequest('POST', '/api/availability-alerts', alertData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Alert Set! 🔔",
        description: "We'll notify you instantly when matching properties become available!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) return;
      toast({
        title: "Alert Failed",
        description: "Unable to set availability alert.",
        variant: "destructive",
      });
    },
  });

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropertyForm.title || !newPropertyForm.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and address.",
        variant: "destructive",
      });
      return;
    }
    addPropertyMutation.mutate(newPropertyForm);
  };

  const rentalCategories = [
    { value: 'house', label: '🏠 Houses', type: 'residential', emoji: '🏠' },
    { value: 'apartment', label: '🏢 Apartments', type: 'residential', emoji: '🏢' },
    { value: 'room', label: '🛏️ Rooms', type: 'residential', emoji: '🛏️' },
    { value: 'store', label: '🏪 Stores', type: 'commercial', emoji: '🏪' },
    { value: 'office', label: '🏢 Offices', type: 'commercial', emoji: '🏢' },
    { value: 'warehouse', label: '🏭 Warehouses', type: 'commercial', emoji: '🏭' },
    { value: 'car', label: '🚗 Cars', type: 'vehicle', emoji: '🚗' },
    { value: 'truck', label: '🚛 Trucks', type: 'vehicle', emoji: '🚛' },
    { value: 'van', label: '🚐 Vans', type: 'vehicle', emoji: '🚐' },
    { value: 'pool', label: '🏊 Pools', type: 'recreational', emoji: '🏊' },
    { value: 'party_hall', label: '🎉 Event Spaces', type: 'recreational', emoji: '🎉' },
    { value: 'equipment', label: '🔧 Equipment', type: 'equipment', emoji: '🔧' },
  ];

  const jamaicaParishes = [
    'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary', 'St. Ann',
    'Trelawny', 'St. James', 'Hanover', 'Westmoreland', 'St. Elizabeth',
    'Manchester', 'Clarendon', 'St. Catherine'
  ];

  const availableAmenities = [
    'WiFi', 'AC', 'Parking', 'Pool', 'Security', 'Generator',
    'Kitchen', 'Laundry', 'Furnished', 'Pet Friendly', 'Garden'
  ];

  return (
    <div className="min-h-screen text-foreground relative">
      {/* Starfield Background */}
      <div className="starfield fixed inset-0 z-0"></div>
      
      {/* Header */}
      <header className="glass-card border-b border-border relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/')}
                data-testid="button-back-home"
              >
                ← Back to YardFlex
              </Button>
              <span className="text-2xl font-bold text-premium">🏠 Rental Empire</span>
              <Badge className="bg-green-600 text-white">INSTANT</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Everything for Rent!</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-to-r from-green-900/30 via-blue-900/30 to-purple-900/30 border-green-500/30" data-testid="rental-empire-hero">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-300">
              <span className="text-3xl">🏠</span>
              <span className="text-2xl font-black">YARDFLEX RENTAL EMPIRE!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <h3 className="text-2xl font-black text-yellow-400 mb-4">
                🏠 HOUSES • 🚗 CARS • 🏪 STORES • 🏢 APARTMENTS • EVERYTHING! 
              </h3>
              <p className="text-white mb-4 text-lg">
                <strong>The moment something becomes available - it's INSTANTLY on YardFlex!</strong><br/>
                House empty? Store vacant? Car available? Pool ready? It's all here in one place!
              </p>
              
              {/* SMART CAR CONTROL SECTION */}
              <div className="bg-gradient-to-r from-red-600/40 to-orange-600/40 border-2 border-red-400/70 rounded-xl p-6 mb-6">
                <h4 className="text-2xl font-black text-red-300 mb-4">🚗⚡ SMART CAR CONTROL! ⚡🚗</h4>
                <div className="space-y-3 text-white">
                  <div className="flex items-center justify-center space-x-2">
                    <span>📊</span>
                    <span><strong>REAL-TIME DRIVER MONITORING</strong></span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🛑</span>
                    <span><strong>AUTO-SLOW DOWN BAD DRIVERS</strong></span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>💬</span>
                    <span><strong>TELL THEM WHAT THEY'RE DOING WRONG</strong></span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🛡️</span>
                    <span><strong>PROTECT YOUR CAR FROM DAMAGE</strong></span>
                  </div>
                  <div className="bg-yellow-600/40 rounded-lg p-3 mt-4">
                    <div className="text-sm font-bold text-yellow-200">
                      ⚡ <strong>YardFlex controls how people drive your rental car!</strong><br/>
                      Bad driving = Car slows down + Driver gets instant warning!
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <div className="text-sm text-green-300">Instant Listing</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔔</div>
                  <div className="text-sm text-blue-300">Alert System</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">💰</div>
                  <div className="text-sm text-purple-300">Easy Money</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🌍</div>
                  <div className="text-sm text-yellow-300">All Jamaica</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="browse">🔍 Find Rentals</TabsTrigger>
            <TabsTrigger value="list">🏠 List Property</TabsTrigger>
            <TabsTrigger value="manage">📊 My Properties</TabsTrigger>
            <TabsTrigger value="alerts">🔔 Alerts</TabsTrigger>
          </TabsList>

          {/* Browse Rentals Tab */}
          <TabsContent value="browse">
            {/* Filters */}
            <Card className="mb-6" data-testid="rental-filters">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔍</span>
                  <span>Find Your Perfect Rental</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 rounded border border-border bg-background text-foreground"
                      data-testid="select-category"
                    >
                      <option value="all">All Categories</option>
                      {rentalCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label>Parish</Label>
                    <select 
                      value={selectedParish}
                      onChange={(e) => setSelectedParish(e.target.value)}
                      className="w-full p-2 rounded border border-border bg-background text-foreground"
                      data-testid="select-parish"
                    >
                      <option value="all">All Parishes</option>
                      {jamaicaParishes.map(parish => (
                        <option key={parish} value={parish}>
                          {parish}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label>Max Budget (JMD/day)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 5000"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      data-testid="input-max-budget"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={() => {
                        // Trigger search
                        queryClient.invalidateQueries({ queryKey: ['/api/rental-properties'] });
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      data-testid="button-search-rentals"
                    >
                      🔍 Search Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Properties */}
            <Card data-testid="available-properties">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🏠 Available Now</span>
                  <Badge className="bg-green-600 text-white">
                    {properties?.length || 0} Properties
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {propertiesLoading ? (
                  <div className="text-center text-muted-foreground py-8">
                    Loading available properties...
                  </div>
                ) : properties && properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <Card key={property.id} className="overflow-hidden" data-testid={`property-${property.id}`}>
                        {property.primaryImageUrl && (
                          <div className="h-48 bg-cover bg-center" 
                               style={{ backgroundImage: `url(${property.primaryImageUrl})` }}>
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg">{property.title}</h3>
                            {property.isVerified && <Badge className="bg-green-600 text-white">VERIFIED</Badge>}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            📍 {property.address}, {property.parish}
                          </p>
                          
                          <p className="text-sm mb-3">
                            {property.description.substring(0, 100)}...
                          </p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-lg font-bold text-green-600">
                              ${property.dailyRate || property.monthlyRate}/
                              {property.dailyRate ? 'day' : 'month'}
                            </div>
                            <div className="text-sm">
                              ⭐ {property.averageRating} ({property.totalBookings} bookings)
                            </div>
                          </div>
                          
                          {property.amenities && property.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {property.amenities.slice(0, 3).map(amenity => (
                                <Badge key={amenity} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {property.amenities.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{property.amenities.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="flex space-x-2">
                            <Button 
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                              data-testid={`button-view-${property.id}`}
                            >
                              👁️ View Details
                            </Button>
                            <Button 
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                              data-testid={`button-book-${property.id}`}
                            >
                              📅 Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <div className="text-6xl mb-4">🏠</div>
                    <p className="text-lg mb-2">No properties found</p>
                    <p className="text-sm">Try adjusting your search criteria or set up an alert!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* List Property Tab */}
          <TabsContent value="list">
            <Card data-testid="add-property-form">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>List Your Property</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProperty} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        value={newPropertyForm.title}
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, title: e.target.value})}
                        placeholder="e.g., Beautiful 2BR Apartment in New Kingston"
                        data-testid="input-property-title"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Property Category *</Label>
                      <select 
                        id="category"
                        value={newPropertyForm.category}
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, category: e.target.value})}
                        className="w-full p-2 rounded border border-border bg-background text-foreground"
                        data-testid="select-property-category"
                        required
                      >
                        {rentalCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Property Description *</Label>
                    <Textarea
                      id="description"
                      value={newPropertyForm.description}
                      onChange={(e) => setNewPropertyForm({...newPropertyForm, description: e.target.value})}
                      placeholder="Describe your property, amenities, and what makes it special..."
                      className="min-h-[120px]"
                      data-testid="textarea-property-description"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={newPropertyForm.address}
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, address: e.target.value})}
                        placeholder="Full street address"
                        data-testid="input-property-address"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="parish">Parish *</Label>
                      <select 
                        id="parish"
                        value={newPropertyForm.parish}
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, parish: e.target.value})}
                        className="w-full p-2 rounded border border-border bg-background text-foreground"
                        data-testid="select-property-parish"
                        required
                      >
                        {jamaicaParishes.map(parish => (
                          <option key={parish} value={parish}>
                            {parish}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="dailyRate">Daily Rate (JMD)</Label>
                      <Input
                        id="dailyRate"
                        type="number"
                        value={newPropertyForm.dailyRate}
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, dailyRate: e.target.value})}
                        placeholder="e.g., 5000"
                        data-testid="input-daily-rate"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="monthlyRate">Monthly Rate (JMD)</Label>
                      <Input
                        id="monthlyRate"
                        type="number"
                        value={newPropertyForm.monthlyRate}
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, monthlyRate: e.target.value})}
                        placeholder="e.g., 120000"
                        data-testid="input-monthly-rate"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={newPropertyForm.contactPhone}
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, contactPhone: e.target.value})}
                        placeholder="+1876-123-4567"
                        data-testid="input-contact-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {availableAmenities.map(amenity => (
                        <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newPropertyForm.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewPropertyForm({
                                  ...newPropertyForm, 
                                  amenities: [...newPropertyForm.amenities, amenity]
                                });
                              } else {
                                setNewPropertyForm({
                                  ...newPropertyForm, 
                                  amenities: newPropertyForm.amenities.filter(a => a !== amenity)
                                });
                              }
                            }}
                            data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(' ', '-')}`}
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={addPropertyMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                    data-testid="button-list-property"
                  >
                    {addPropertyMutation.isPending ? "Listing..." : "🚀 LIST MY PROPERTY NOW!"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Properties Tab */}
          <TabsContent value="manage">
            <Card data-testid="my-properties">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🏠 My Rental Properties</span>
                  <Badge className="bg-blue-600 text-white">
                    {myProperties?.length || 0} Properties
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myPropertiesLoading ? (
                  <div className="text-center text-muted-foreground py-8">
                    Loading your properties...
                  </div>
                ) : myProperties && myProperties.length > 0 ? (
                  <div className="space-y-4">
                    {myProperties.map((property) => (
                      <Card key={property.id} className="p-4" data-testid={`my-property-${property.id}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{property.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              📍 {property.address}, {property.parish}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge className={property.isAvailable ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                                {property.isAvailable ? "AVAILABLE" : "BOOKED"}
                              </Badge>
                              <span className="text-sm">
                                💰 ${property.dailyRate || property.monthlyRate}/{property.dailyRate ? 'day' : 'month'}
                              </span>
                              <span className="text-sm">
                                ⭐ {property.averageRating} ({property.totalBookings} bookings)
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" data-testid={`button-edit-${property.id}`}>
                              ✏️ Edit
                            </Button>
                            <Button variant="outline" size="sm" data-testid={`button-view-bookings-${property.id}`}>
                              📅 Bookings
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <div className="text-6xl mb-4">🏠</div>
                    <p className="text-lg mb-2">No properties listed yet</p>
                    <p className="text-sm">List your first property to start earning!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card data-testid="availability-alerts">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔔</span>
                  <span>Instant Availability Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                    ⚡ Get Notified INSTANTLY!
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                    The moment a property matching your criteria becomes available, you'll get notified via 
                    WhatsApp, SMS, email, and push notification. Be the first to book!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>What are you looking for?</Label>
                    <select 
                      className="w-full p-2 rounded border border-border bg-background text-foreground"
                      data-testid="select-alert-category"
                    >
                      {rentalCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label>Preferred Parish</Label>
                    <select 
                      className="w-full p-2 rounded border border-border bg-background text-foreground"
                      data-testid="select-alert-parish"
                    >
                      <option value="all">Any Parish</option>
                      {jamaicaParishes.map(parish => (
                        <option key={parish} value={parish}>
                          {parish}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label>Max Budget (JMD/day)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 5000"
                      data-testid="input-alert-budget"
                    />
                  </div>
                  
                  <div>
                    <Label>Alert Method</Label>
                    <div className="space-y-2 mt-2">
                      {['WhatsApp', 'SMS', 'Email', 'Push Notification'].map(method => (
                        <label key={method} className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked data-testid={`checkbox-alert-${method.toLowerCase().replace(' ', '-')}`} />
                          <span className="text-sm">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => alertMutation.mutate({})}
                  disabled={alertMutation.isPending}
                  className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold"
                  data-testid="button-create-alert"
                >
                  {alertMutation.isPending ? "Setting Alert..." : "🔔 SET INSTANT ALERT!"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}