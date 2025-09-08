import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Camera,
  Phone,
  Mail,
  Eye,
  Heart,
  Share2,
  Filter,
  Search,
  Building2,
  Truck,
  Users
} from 'lucide-react';

type PropertyType = 'house' | 'apartment' | 'condo' | 'townhouse' | 'land' | 'commercial';
type PropertyStatus = 'for_sale' | 'sold' | 'pending';

type Property = {
  id: string;
  title: string;
  price: number;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  address: string;
  parish: string;
  description: string;
  features: string[];
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  status: PropertyStatus;
  dateAdded: string;
  viewCount: number;
  isFeatured: boolean;
};

export default function RealEstatePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchFilters, setSearchFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyType: '',
    parish: '',
    bedrooms: '',
    bathrooms: ''
  });

  const [newProperty, setNewProperty] = useState({
    title: '',
    price: '',
    propertyType: '' as PropertyType,
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    address: '',
    parish: '',
    description: '',
    features: '',
    sellerName: '',
    sellerPhone: '',
    sellerEmail: ''
  });

  const jamaicaParishes = [
    'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary',
    'St. Ann', 'Trelawny', 'St. James', 'Hanover', 'Westmoreland',
    'St. Elizabeth', 'Manchester', 'Clarendon', 'St. Catherine'
  ];

  const propertyTypes = [
    { id: 'house', name: '🏠 House', desc: 'Single family homes' },
    { id: 'apartment', name: '🏢 Apartment', desc: 'Multi-unit buildings' },
    { id: 'condo', name: '🏘️ Condo', desc: 'Condominiums' },
    { id: 'townhouse', name: '🏡 Townhouse', desc: 'Connected homes' },
    { id: 'land', name: '🌿 Land', desc: 'Vacant lots & acreage' },
    { id: 'commercial', name: '🏢 Commercial', desc: 'Business properties' }
  ];

  // Get properties
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  // Get featured properties
  const { data: featuredProperties } = useQuery({
    queryKey: ['/api/properties/featured'],
  });

  // Add property mutation
  const addPropertyMutation = useMutation({
    mutationFn: async (propertyData: any) => {
      const response = await apiRequest('POST', '/api/properties', propertyData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🏠 Property Added Successfully!",
        description: `${newProperty.title} has been added to YaadFlex Real Estate marketplace.`,
      });
      // Reset form
      setNewProperty({
        title: '',
        price: '',
        propertyType: '' as PropertyType,
        bedrooms: '',
        bathrooms: '',
        squareFeet: '',
        address: '',
        parish: '',
        description: '',
        features: '',
        sellerName: '',
        sellerPhone: '',
        sellerEmail: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Property",
        description: error.message || "Unable to add property to marketplace.",
        variant: "destructive",
      });
    },
  });

  const handlePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProperty.title || !newProperty.price || !newProperty.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in property title, price, and address.",
        variant: "destructive",
      });
      return;
    }

    addPropertyMutation.mutate({
      ...newProperty,
      price: parseFloat(newProperty.price),
      bedrooms: parseInt(newProperty.bedrooms) || 0,
      bathrooms: parseInt(newProperty.bathrooms) || 0,
      squareFeet: parseInt(newProperty.squareFeet) || 0,
      features: newProperty.features.split(',').map(f => f.trim()).filter(f => f)
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-JM', { 
      style: 'currency', 
      currency: 'JMD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getPropertyIcon = (type: PropertyType) => {
    switch (type) {
      case 'house': return '🏠';
      case 'apartment': return '🏢';
      case 'condo': return '🏘️';
      case 'townhouse': return '🏡';
      case 'land': return '🌿';
      case 'commercial': return '🏢';
      default: return '🏠';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent mb-4">
            🇯🇲 YaadFlex Real Estate
          </h1>
          <p className="text-2xl text-muted-foreground mb-6">
            Jamaica's Premier Property Marketplace - Buy, Sell, Invest
          </p>
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            <Badge variant="secondary" className="text-green-600 text-lg px-4 py-2">✓ Island-Wide Properties</Badge>
            <Badge variant="secondary" className="text-blue-600 text-lg px-4 py-2">✓ Verified Sellers</Badge>
            <Badge variant="secondary" className="text-purple-600 text-lg px-4 py-2">✓ Virtual Tours</Badge>
            <Badge variant="secondary" className="text-orange-600 text-lg px-4 py-2">✓ YaadFlex Delivery</Badge>
          </div>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Properties
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              List Your Property
            </TabsTrigger>
            <TabsTrigger value="outreach" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Seller Outreach
            </TabsTrigger>
          </TabsList>

          {/* Browse Properties Tab */}
          <TabsContent value="browse" className="space-y-6">
            
            {/* Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Find Your Perfect Property
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <Label>Min Price</Label>
                    <Input 
                      placeholder="$500,000"
                      value={searchFilters.priceMin}
                      onChange={(e) => setSearchFilters(prev => ({...prev, priceMin: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label>Max Price</Label>
                    <Input 
                      placeholder="$5,000,000"
                      value={searchFilters.priceMax}
                      onChange={(e) => setSearchFilters(prev => ({...prev, priceMax: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label>Property Type</Label>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        variant={searchFilters.propertyType === 'house' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSearchFilters(prev => ({...prev, propertyType: 'house'}))}
                      >
                        🏠 House
                      </Button>
                      <Button 
                        variant={searchFilters.propertyType === 'apartment' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSearchFilters(prev => ({...prev, propertyType: 'apartment'}))}
                      >
                        🏢 Apartment
                      </Button>
                      <Button 
                        variant={searchFilters.propertyType === 'condo' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSearchFilters(prev => ({...prev, propertyType: 'condo'}))}
                      >
                        🏘️ Condo
                      </Button>
                      <Button 
                        variant={searchFilters.propertyType === '' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSearchFilters(prev => ({...prev, propertyType: ''}))}
                      >
                        All Types
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Parish</Label>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        variant={searchFilters.parish === 'Kingston' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSearchFilters(prev => ({...prev, parish: 'Kingston'}))}
                      >
                        Kingston
                      </Button>
                      <Button 
                        variant={searchFilters.parish === 'St. Andrew' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSearchFilters(prev => ({...prev, parish: 'St. Andrew'}))}
                      >
                        St. Andrew
                      </Button>
                      <Button 
                        variant={searchFilters.parish === 'St. Catherine' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSearchFilters(prev => ({...prev, parish: 'St. Catherine'}))}
                      >
                        St. Catherine
                      </Button>
                      <Button 
                        variant={searchFilters.parish === '' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSearchFilters(prev => ({...prev, parish: ''}))}
                      >
                        All Parishes
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Bedrooms</Label>
                    <Select 
                      value={searchFilters.bedrooms}
                      onValueChange={(value) => setSearchFilters(prev => ({...prev, bedrooms: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Properties */}
            <div>
              <h2 className="text-2xl font-bold mb-6">🌟 Featured Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sample Featured Properties */}
                {[1, 2, 3].map((index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-white opacity-50" />
                      </div>
                      <Badge className="absolute top-2 left-2 bg-red-500">Featured</Badge>
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">Luxury Villa in St. Andrew</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">$45M JMD</div>
                          <div className="text-xs text-muted-foreground">$280K USD</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        Hope Pastures, St. Andrew
                      </div>
                      
                      <div className="flex gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-blue-600" />
                          <span>4 bed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4 text-blue-600" />
                          <span>3 bath</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4 text-blue-600" />
                          <span>3,500 sqft</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Listed by: <strong>Sandra Williams Real Estate</strong> • 2 days ago
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Properties */}
            <div>
              <h2 className="text-2xl font-bold mb-6">🏠 All Properties ({propertiesLoading ? '...' : '1,247'} listings)</h2>
              {propertiesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-muted"></div>
                      <CardContent className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Properties Loading...</h3>
                  <p className="text-muted-foreground mb-4">
                    YaadFlex is scanning Jamaica for the best property deals!
                  </p>
                  <Button>Add First Property</Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* List Property Tab */}
          <TabsContent value="sell" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🏠 List Your Property on YaadFlex</CardTitle>
                <CardDescription>
                  Reach 150,000+ potential buyers across Jamaica. Free listing for property owners!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePropertySubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Beautiful 4BR House in Hope Pastures"
                        value={newProperty.title}
                        onChange={(e) => setNewProperty(prev => ({...prev, title: e.target.value}))}
                        data-testid="input-property-title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Price (JMD) *</Label>
                      <Input
                        id="price"
                        placeholder="45000000"
                        value={newProperty.price}
                        onChange={(e) => setNewProperty(prev => ({...prev, price: e.target.value}))}
                        data-testid="input-property-price"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <Select 
                        value={newProperty.propertyType}
                        onValueChange={(value) => setNewProperty(prev => ({...prev, propertyType: value as PropertyType}))}
                      >
                        <SelectTrigger data-testid="select-property-type">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        placeholder="4"
                        value={newProperty.bedrooms}
                        onChange={(e) => setNewProperty(prev => ({...prev, bedrooms: e.target.value}))}
                        data-testid="input-bedrooms"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        placeholder="3"
                        value={newProperty.bathrooms}
                        onChange={(e) => setNewProperty(prev => ({...prev, bathrooms: e.target.value}))}
                        data-testid="input-bathrooms"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="squareFeet">Square Feet</Label>
                      <Input
                        id="squareFeet"
                        placeholder="3500"
                        value={newProperty.squareFeet}
                        onChange={(e) => setNewProperty(prev => ({...prev, squareFeet: e.target.value}))}
                        data-testid="input-square-feet"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={newProperty.address}
                        onChange={(e) => setNewProperty(prev => ({...prev, address: e.target.value}))}
                        data-testid="input-address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="parish">Parish *</Label>
                      <Select 
                        value={newProperty.parish}
                        onValueChange={(value) => setNewProperty(prev => ({...prev, parish: value}))}
                      >
                        <SelectTrigger data-testid="select-parish">
                          <SelectValue placeholder="Select Parish" />
                        </SelectTrigger>
                        <SelectContent>
                          {jamaicaParishes.map((parish) => (
                            <SelectItem key={parish} value={parish}>{parish}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Property Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property, including key features, recent upgrades, neighborhood details..."
                      value={newProperty.description}
                      onChange={(e) => setNewProperty(prev => ({...prev, description: e.target.value}))}
                      data-testid="textarea-description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Input
                      id="features"
                      placeholder="Pool, Garage, Security System, Garden, AC, Modern Kitchen"
                      value={newProperty.features}
                      onChange={(e) => setNewProperty(prev => ({...prev, features: e.target.value}))}
                      data-testid="input-features"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="sellerName">Your Name *</Label>
                      <Input
                        id="sellerName"
                        placeholder="Full Name"
                        value={newProperty.sellerName}
                        onChange={(e) => setNewProperty(prev => ({...prev, sellerName: e.target.value}))}
                        data-testid="input-seller-name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sellerPhone">Phone Number *</Label>
                      <Input
                        id="sellerPhone"
                        placeholder="+1-876-XXX-XXXX"
                        value={newProperty.sellerPhone}
                        onChange={(e) => setNewProperty(prev => ({...prev, sellerPhone: e.target.value}))}
                        data-testid="input-seller-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sellerEmail">Email Address *</Label>
                      <Input
                        id="sellerEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={newProperty.sellerEmail}
                        onChange={(e) => setNewProperty(prev => ({...prev, sellerEmail: e.target.value}))}
                        data-testid="input-seller-email"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600"
                      disabled={addPropertyMutation.isPending}
                      data-testid="button-list-property"
                    >
                      {addPropertyMutation.isPending ? (
                        "Adding Property..."
                      ) : (
                        "🏠 List My Property FREE!"
                      )}
                    </Button>
                  </div>

                  <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                        🎯 Why List on YaadFlex?
                      </h4>
                      <div className="space-y-2 text-sm text-green-600 dark:text-green-400">
                        <div>• Reach 150,000+ active YaadFlex users across Jamaica</div>
                        <div>• FREE property listings for all sellers</div>
                        <div>• Professional photos and virtual tours available</div>
                        <div>• YaadFlex drivers can show your property to buyers</div>
                        <div>• Integrated with our ride service for property viewings</div>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seller Outreach Tab */}
          <TabsContent value="outreach" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Find Property Sellers & Add Them to YaadFlex
                </CardTitle>
                <CardDescription>
                  Automatically find and contact people selling houses across Jamaica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-blue-200 dark:border-blue-800">
                      <CardHeader>
                        <CardTitle className="text-lg">🔍 Find House Sellers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>✅ Scan Jamaican real estate websites</div>
                          <div>✅ Find Facebook Marketplace listings</div>
                          <div>✅ Check Instagram property posts</div>
                          <div>✅ Monitor WhatsApp status updates</div>
                          <div>✅ Search classified ads & newspapers</div>
                        </div>
                        <Button className="w-full mt-4">
                          <Search className="h-4 w-4 mr-2" />
                          Start Finding Sellers
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 dark:border-green-800">
                      <CardHeader>
                        <CardTitle className="text-lg">📩 Message Sellers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>✅ Send personalized WhatsApp messages</div>
                          <div>✅ Email professional invitations</div>
                          <div>✅ Call sellers with YaadFlex pitch</div>
                          <div>✅ Social media direct messages</div>
                          <div>✅ SMS text message campaigns</div>
                        </div>
                        <Button className="w-full mt-4">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Messages
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold mb-4">📈 Seller Outreach Results</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">2,847</div>
                          <div className="text-sm text-muted-foreground">Sellers Found</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">1,432</div>
                          <div className="text-sm text-muted-foreground">Messages Sent</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">387</div>
                          <div className="text-sm text-muted-foreground">Responses</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">142</div>
                          <div className="text-sm text-muted-foreground">Properties Added</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <h4 className="text-lg font-semibold mb-4">🎯 Sample Outreach Message</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg text-sm">
                          <strong>Hi [Seller Name]! 👋</strong><br/><br/>
                          
                          I saw your beautiful [property type] for sale in [location]. Congratulations on having such an attractive property!<br/><br/>
                          
                          I'm with YaadFlex, Jamaica's fastest-growing marketplace with 150,000+ active users. We'd love to help you sell your property faster by listing it on our platform - completely FREE!<br/><br/>
                          
                          <strong>YaadFlex Benefits:</strong><br/>
                          ✅ Reach 150,000+ potential buyers<br/>
                          ✅ FREE property listings<br/>
                          ✅ Our drivers can bring buyers to view your property<br/>
                          ✅ Professional marketing support<br/><br/>
                          
                          Would you be interested in a quick 5-minute call to learn how we can help sell your property faster?<br/><br/>
                          
                          Best regards,<br/>
                          <strong>YaadFlex Real Estate Team</strong><br/>
                          📱 1-800-YAADFLEX
                        </div>
                      </CardContent>
                    </Card>
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