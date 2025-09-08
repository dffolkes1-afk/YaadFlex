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
  Car, 
  MapPin, 
  DollarSign, 
  Fuel, 
  Gauge,
  Calendar,
  Eye,
  Heart,
  Share2,
  Filter,
  Search,
  Camera,
  Phone,
  Mail,
  Users,
  Truck,
  Settings,
  Award,
  Zap,
  RotateCcw
} from 'lucide-react';

type VehicleType = 'sedan' | 'suv' | 'hatchback' | 'truck' | 'van' | 'motorcycle' | 'coupe' | 'convertible';
type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric';
type Transmission = 'automatic' | 'manual';
type Condition = 'excellent' | 'very_good' | 'good' | 'fair' | 'needs_work';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  vehicleType: VehicleType;
  fuelType: FuelType;
  transmission: Transmission;
  mileage: number;
  condition: Condition;
  color: string;
  description: string;
  features: string[];
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  location: string;
  parish: string;
  dateAdded: string;
  viewCount: number;
  isFeatured: boolean;
  hasCarfax: boolean;
  inspectionScore?: number;
  threedModelUrl?: string;
};

export default function CarMarketplacePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchFilters, setSearchFilters] = useState({
    make: '',
    model: '',
    yearMin: '',
    yearMax: '',
    priceMin: '',
    priceMax: '',
    vehicleType: '',
    fuelType: '',
    transmission: '',
    parish: ''
  });

  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    vehicleType: '' as VehicleType,
    fuelType: '' as FuelType,
    transmission: '' as Transmission,
    mileage: '',
    condition: '' as Condition,
    color: '',
    description: '',
    features: '',
    location: '',
    parish: '',
    sellerName: '',
    sellerPhone: '',
    sellerEmail: ''
  });

  const [show3DViewer, setShow3DViewer] = useState(false);

  const jamaicaParishes = [
    'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary',
    'St. Ann', 'Trelawny', 'St. James', 'Hanover', 'Westmoreland',
    'St. Elizabeth', 'Manchester', 'Clarendon', 'St. Catherine'
  ];

  const popularMakes = [
    'Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mitsubishi', 'Mazda',
    'BMW', 'Mercedes-Benz', 'Audi', 'Hyundai', 'Kia', 'Ford',
    'Chevrolet', 'Volkswagen', 'Lexus', 'Subaru', 'Jeep'
  ];

  const vehicleTypes = [
    { id: 'sedan', name: '🚗 Sedan', desc: '4-door family cars' },
    { id: 'suv', name: '🚙 SUV', desc: 'Sport utility vehicles' },
    { id: 'hatchback', name: '🚗 Hatchback', desc: 'Compact cars' },
    { id: 'truck', name: '🛻 Truck', desc: 'Pickup trucks' },
    { id: 'van', name: '🚐 Van', desc: 'Minivans & cargo vans' },
    { id: 'motorcycle', name: '🏍️ Motorcycle', desc: 'Bikes & scooters' },
    { id: 'coupe', name: '🚗 Coupe', desc: '2-door sports cars' },
    { id: 'convertible', name: '🚗 Convertible', desc: 'Soft-top vehicles' }
  ];

  // Get vehicles
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['/api/vehicles'],
  });

  // Add vehicle mutation
  const addVehicleMutation = useMutation({
    mutationFn: async (vehicleData: any) => {
      const response = await apiRequest('POST', '/api/vehicles', vehicleData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🚗 Vehicle Added Successfully!",
        description: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model} has been added to YaadFlex Car Marketplace.`,
      });
      // Reset form
      setNewVehicle({
        make: '',
        model: '',
        year: '',
        price: '',
        vehicleType: '' as VehicleType,
        fuelType: '' as FuelType,
        transmission: '' as Transmission,
        mileage: '',
        condition: '' as Condition,
        color: '',
        description: '',
        features: '',
        location: '',
        parish: '',
        sellerName: '',
        sellerPhone: '',
        sellerEmail: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Vehicle",
        description: error.message || "Unable to add vehicle to marketplace.",
        variant: "destructive",
      });
    },
  });

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVehicle.make || !newVehicle.model || !newVehicle.year || !newVehicle.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in make, model, year, and price.",
        variant: "destructive",
      });
      return;
    }

    addVehicleMutation.mutate({
      ...newVehicle,
      year: parseInt(newVehicle.year),
      price: parseFloat(newVehicle.price),
      mileage: parseInt(newVehicle.mileage) || 0,
      features: newVehicle.features.split(',').map(f => f.trim()).filter(f => f)
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-JM', { 
      style: 'currency', 
      currency: 'JMD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'sedan': case 'hatchback': case 'coupe': return '🚗';
      case 'suv': return '🚙';
      case 'truck': return '🛻';
      case 'van': return '🚐';
      case 'motorcycle': return '🏍️';
      case 'convertible': return '🚗';
      default: return '🚗';
    }
  };

  const getConditionColor = (condition: Condition) => {
    switch (condition) {
      case 'excellent': return 'text-green-600';
      case 'very_good': return 'text-blue-600';
      case 'good': return 'text-yellow-600';
      case 'fair': return 'text-orange-600';
      case 'needs_work': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  // 3D Car Viewer Component
  const ThreeDCarViewer = ({ vehicle }: { vehicle?: any }) => (
    <div className="relative w-full h-96 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <RotateCcw className="h-16 w-16 mx-auto mb-4 animate-spin" />
          <h3 className="text-2xl font-bold mb-2">🚗 3D Car Viewer</h3>
          <p className="text-lg mb-4">360° Interior & Exterior View</p>
          <div className="flex justify-center gap-2 mb-4">
            <Button variant="secondary" size="sm">🏠 Interior</Button>
            <Button variant="secondary" size="sm">🚗 Exterior</Button>
            <Button variant="secondary" size="sm">🔧 Engine</Button>
          </div>
          <div className="text-sm opacity-75">
            Click and drag to rotate • Scroll to zoom • Space to auto-rotate
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 rounded-lg p-3 text-white text-sm">
          <div className="flex justify-between items-center">
            <div>
              <strong>2020 Toyota Camry</strong><br/>
              Interior: 9/10 • Exterior: 8/10 • Engine: 9/10
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">$3.2M JMD</div>
              <div className="text-xs opacity-75">~$20K USD</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent mb-4">
            🇯🇲 YaadFlex Car Marketplace
          </h1>
          <p className="text-2xl text-muted-foreground mb-6">
            Jamaica's Premier Vehicle Marketplace with 3D Car Viewing
          </p>
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            <Badge variant="secondary" className="text-green-600 text-lg px-4 py-2">✓ 3D Car Viewer</Badge>
            <Badge variant="secondary" className="text-blue-600 text-lg px-4 py-2">✓ Virtual Test Drives</Badge>
            <Badge variant="secondary" className="text-purple-600 text-lg px-4 py-2">✓ Car Evaluations</Badge>
            <Badge variant="secondary" className="text-orange-600 text-lg px-4 py-2">✓ YaadFlex Delivery</Badge>
          </div>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Cars
            </TabsTrigger>
            <TabsTrigger value="3d-viewer" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              3D Viewer
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Sell Your Car
            </TabsTrigger>
            <TabsTrigger value="outreach" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Find Sellers
            </TabsTrigger>
          </TabsList>

          {/* Browse Cars Tab */}
          <TabsContent value="browse" className="space-y-6">
            
            {/* Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Find Your Perfect Car
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <Label>Make</Label>
                    <Select 
                      value={searchFilters.make}
                      onValueChange={(value) => setSearchFilters(prev => ({...prev, make: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any Make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Make</SelectItem>
                        {popularMakes.map((make) => (
                          <SelectItem key={make} value={make}>{make}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                    <Label>Vehicle Type</Label>
                    <Select 
                      value={searchFilters.vehicleType}
                      onValueChange={(value) => setSearchFilters(prev => ({...prev, vehicleType: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Type</SelectItem>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
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

            {/* Featured Vehicles */}
            <div>
              <h2 className="text-2xl font-bold mb-6">🌟 Featured Vehicles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                        <Car className="h-12 w-12 text-white opacity-50" />
                      </div>
                      <Badge className="absolute top-2 left-2 bg-red-500">Featured</Badge>
                      <Badge className="absolute top-2 right-2 bg-blue-500">3D View</Badge>
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
                        <h3 className="font-semibold">2020 Toyota Camry</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">$3.2M JMD</div>
                          <div className="text-xs text-muted-foreground">$20K USD</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        Kingston, St. Andrew
                      </div>
                      
                      <div className="flex gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span>2020</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gauge className="h-4 w-4 text-blue-600" />
                          <span>45K mi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Fuel className="h-4 w-4 text-blue-600" />
                          <span>Hybrid</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">Excellent</Badge>
                        <Badge variant="outline" className="text-xs">Automatic</Badge>
                        <Badge variant="outline" className="text-xs">Carfax ✓</Badge>
                      </div>
                      
                      <div className="flex gap-2 mb-3">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setShow3DViewer(true)}>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          3D View
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Listed by: <strong>James Car Sales</strong> • 3 days ago • 247 views
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Vehicles */}
            <div>
              <h2 className="text-2xl font-bold mb-6">🚗 All Vehicles ({vehiclesLoading ? '...' : '8,543'} listings)</h2>
              {vehiclesLoading ? (
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
                  <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Cars Loading...</h3>
                  <p className="text-muted-foreground mb-4">
                    YaadFlex is scanning Jamaica for the best car deals!
                  </p>
                  <Button>Add First Car</Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 3D Viewer Tab */}
          <TabsContent value="3d-viewer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  3D Car Viewer - See Inside & Outside Every Car!
                </CardTitle>
                <CardDescription>
                  Revolutionary 3D technology lets you inspect cars like you're there in person
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThreeDCarViewer />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Eye className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                      <h4 className="font-semibold mb-2">🏠 Interior View</h4>
                      <p className="text-sm text-muted-foreground">
                        See dashboard, seats, controls, and condition in full 360° detail
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Car className="h-8 w-8 mx-auto text-green-600 mb-2" />
                      <h4 className="font-semibold mb-2">🚗 Exterior View</h4>
                      <p className="text-sm text-muted-foreground">
                        Check paint, dents, tires, and body condition from every angle
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Settings className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                      <h4 className="font-semibold mb-2">🔧 Engine Bay</h4>
                      <p className="text-sm text-muted-foreground">
                        Inspect engine, fluids, belts, and mechanical condition
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sell Car Tab */}
          <TabsContent value="sell" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🚗 Sell Your Car on YaadFlex</CardTitle>
                <CardDescription>
                  Reach 150,000+ potential buyers across Jamaica. Free listing with 3D car scanning!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVehicleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="make">Make *</Label>
                      <Select 
                        value={newVehicle.make}
                        onValueChange={(value) => setNewVehicle(prev => ({...prev, make: value}))}
                      >
                        <SelectTrigger data-testid="select-make">
                          <SelectValue placeholder="Select Make" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularMakes.map((make) => (
                            <SelectItem key={make} value={make}>{make}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        placeholder="e.g., Camry"
                        value={newVehicle.model}
                        onChange={(e) => setNewVehicle(prev => ({...prev, model: e.target.value}))}
                        data-testid="input-model"
                      />
                    </div>

                    <div>
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        placeholder="2020"
                        value={newVehicle.year}
                        onChange={(e) => setNewVehicle(prev => ({...prev, year: e.target.value}))}
                        data-testid="input-year"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (JMD) *</Label>
                      <Input
                        id="price"
                        placeholder="3200000"
                        value={newVehicle.price}
                        onChange={(e) => setNewVehicle(prev => ({...prev, price: e.target.value}))}
                        data-testid="input-price"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mileage">Mileage</Label>
                      <Input
                        id="mileage"
                        placeholder="45000"
                        value={newVehicle.mileage}
                        onChange={(e) => setNewVehicle(prev => ({...prev, mileage: e.target.value}))}
                        data-testid="input-mileage"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Vehicle Type</Label>
                      <Select 
                        value={newVehicle.vehicleType}
                        onValueChange={(value) => setNewVehicle(prev => ({...prev, vehicleType: value as VehicleType}))}
                      >
                        <SelectTrigger data-testid="select-vehicle-type">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Fuel Type</Label>
                      <Select 
                        value={newVehicle.fuelType}
                        onValueChange={(value) => setNewVehicle(prev => ({...prev, fuelType: value as FuelType}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Fuel Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gasoline">⛽ Gasoline</SelectItem>
                          <SelectItem value="diesel">🛢️ Diesel</SelectItem>
                          <SelectItem value="hybrid">🔋 Hybrid</SelectItem>
                          <SelectItem value="electric">⚡ Electric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Transmission</Label>
                      <Select 
                        value={newVehicle.transmission}
                        onValueChange={(value) => setNewVehicle(prev => ({...prev, transmission: value as Transmission}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">🔄 Automatic</SelectItem>
                          <SelectItem value="manual">🕹️ Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Condition</Label>
                      <Select 
                        value={newVehicle.condition}
                        onValueChange={(value) => setNewVehicle(prev => ({...prev, condition: value as Condition}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">🌟 Excellent</SelectItem>
                          <SelectItem value="very_good">✨ Very Good</SelectItem>
                          <SelectItem value="good">👍 Good</SelectItem>
                          <SelectItem value="fair">⚖️ Fair</SelectItem>
                          <SelectItem value="needs_work">🔧 Needs Work</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        placeholder="Silver"
                        value={newVehicle.color}
                        onChange={(e) => setNewVehicle(prev => ({...prev, color: e.target.value}))}
                        data-testid="input-color"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., New Kingston"
                        value={newVehicle.location}
                        onChange={(e) => setNewVehicle(prev => ({...prev, location: e.target.value}))}
                        data-testid="input-location"
                      />
                    </div>

                    <div>
                      <Label>Parish</Label>
                      <Select 
                        value={newVehicle.parish}
                        onValueChange={(value) => setNewVehicle(prev => ({...prev, parish: value}))}
                      >
                        <SelectTrigger>
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
                    <Label htmlFor="description">Vehicle Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your vehicle, including condition, maintenance history, any modifications..."
                      value={newVehicle.description}
                      onChange={(e) => setNewVehicle(prev => ({...prev, description: e.target.value}))}
                      data-testid="textarea-description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Input
                      id="features"
                      placeholder="AC, Power Windows, Bluetooth, Backup Camera, Leather Seats"
                      value={newVehicle.features}
                      onChange={(e) => setNewVehicle(prev => ({...prev, features: e.target.value}))}
                      data-testid="input-features"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="sellerName">Your Name *</Label>
                      <Input
                        id="sellerName"
                        placeholder="Full Name"
                        value={newVehicle.sellerName}
                        onChange={(e) => setNewVehicle(prev => ({...prev, sellerName: e.target.value}))}
                        data-testid="input-seller-name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sellerPhone">Phone Number *</Label>
                      <Input
                        id="sellerPhone"
                        placeholder="+1-876-XXX-XXXX"
                        value={newVehicle.sellerPhone}
                        onChange={(e) => setNewVehicle(prev => ({...prev, sellerPhone: e.target.value}))}
                        data-testid="input-seller-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sellerEmail">Email Address</Label>
                      <Input
                        id="sellerEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={newVehicle.sellerEmail}
                        onChange={(e) => setNewVehicle(prev => ({...prev, sellerEmail: e.target.value}))}
                        data-testid="input-seller-email"
                      />
                    </div>
                  </div>

                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        📸 FREE 3D Car Scanning Service
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                        Our professional photographers will create a 3D model of your car - inside, outside, and engine bay - completely FREE!
                      </p>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="want3d" className="rounded" />
                        <Label htmlFor="want3d" className="text-sm">
                          Yes, I want FREE 3D scanning for my car listing
                        </Label>
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600"
                    disabled={addVehicleMutation.isPending}
                    data-testid="button-list-vehicle"
                  >
                    {addVehicleMutation.isPending ? (
                      "Adding Vehicle..."
                    ) : (
                      "🚗 List My Car FREE with 3D Scanning!"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Car Seller Outreach Tab */}
          <TabsContent value="outreach" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Find Car Sellers & Add Them to YaadFlex
                </CardTitle>
                <CardDescription>
                  Automatically find and contact people selling cars across Jamaica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-blue-200 dark:border-blue-800">
                      <CardHeader>
                        <CardTitle className="text-lg">🔍 Find Car Sellers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>✅ Scan Jamaican car websites</div>
                          <div>✅ Find Facebook Marketplace cars</div>
                          <div>✅ Check Instagram car posts</div>
                          <div>✅ Monitor WhatsApp status updates</div>
                          <div>✅ Search classified ads & AutoTrader</div>
                          <div>✅ Find dealership inventory</div>
                        </div>
                        <Button className="w-full mt-4">
                          <Search className="h-4 w-4 mr-2" />
                          Start Finding Car Sellers
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 dark:border-green-800">
                      <CardHeader>
                        <CardTitle className="text-lg">📩 Message Car Sellers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>✅ Send personalized WhatsApp messages</div>
                          <div>✅ Email professional invitations</div>
                          <div>✅ Call sellers with YaadFlex pitch</div>
                          <div>✅ Social media direct messages</div>
                          <div>✅ SMS text message campaigns</div>
                          <div>✅ Offer FREE 3D car scanning</div>
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
                      <h4 className="text-xl font-bold mb-4">📈 Car Seller Outreach Results</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">8,543</div>
                          <div className="text-sm text-muted-foreground">Car Sellers Found</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">4,287</div>
                          <div className="text-sm text-muted-foreground">Messages Sent</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">1,156</div>
                          <div className="text-sm text-muted-foreground">Responses</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">423</div>
                          <div className="text-sm text-muted-foreground">Cars Added</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <h4 className="text-lg font-semibold mb-4">🎯 Sample Car Seller Outreach Message</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg text-sm">
                          <strong>Hi [Seller Name]! 👋</strong><br/><br/>
                          
                          I saw your {'{year}'} {'{make}'} {'{model}'} for sale in {'{location}'}. That's a beautiful car!<br/><br/>
                          
                          I'm with YaadFlex, Jamaica's fastest-growing car marketplace with 150,000+ active users. We'd love to help you sell your car faster by listing it on our platform - completely FREE!<br/><br/>
                          
                          <strong>YaadFlex Benefits:</strong><br/>
                          ✅ Reach 150,000+ potential buyers<br/>
                          ✅ FREE car listings with professional photos<br/>
                          ✅ Revolutionary 3D car scanning (FREE!)<br/>
                          ✅ Our drivers can bring buyers to view your car<br/>
                          ✅ Secure payment processing<br/><br/>
                          
                          <strong>Special Offer:</strong> FREE 3D car scanning worth $500! Buyers can see inside, outside, and engine bay of your car online.<br/><br/>
                          
                          Would you be interested in a quick 5-minute call to learn how we can help sell your car faster with our 3D technology?<br/><br/>
                          
                          Best regards,<br/>
                          <strong>YaadFlex Car Marketplace Team</strong><br/>
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

        {/* 3D Viewer Modal */}
        {show3DViewer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">🚗 3D Car Viewer</h3>
                  <Button variant="outline" onClick={() => setShow3DViewer(false)}>
                    ✕ Close
                  </Button>
                </div>
                <ThreeDCarViewer />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}