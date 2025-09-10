import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Car, 
  Bike, 
  Truck, 
  DollarSign, 
  Clock, 
  Navigation,
  Users,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Phone
} from 'lucide-react';
import { LiveChat } from '@/components/LiveChat';

type Vehicle = {
  id: string;
  vehicleType: 'bike' | 'car' | 'van' | 'truck';
  licensePlate: string;
  model?: string;
  color?: string;
  isActive: boolean;
  currentLatitude?: string;
  currentLongitude?: string;
};

type Trip = {
  id: string;
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  vehicleType: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  estimatedFare?: string;
  createdAt: string;
};

const getVehicleIcon = (type: string) => {
  switch (type) {
    case 'bike': return <Bike className="h-5 w-5" />;
    case 'car': return <Car className="h-5 w-5" />;
    case 'van': return <Truck className="h-5 w-5" />;
    case 'truck': return <Truck className="h-5 w-5" />;
    default: return <Car className="h-5 w-5" />;
  }
};

const getVehicleInfo = (type: string) => {
  switch (type) {
    case 'bike': return { name: 'YaadBike', desc: 'Quick & affordable', price: '150', capacity: '1 passenger' };
    case 'car': return { name: 'YaadCar', desc: 'Comfortable rides', price: '300', capacity: '4 passengers' };
    case 'van': return { name: 'YaadVan', desc: 'Group & luggage', price: '500', capacity: '8 passengers' };
    case 'truck': return { name: 'YaadTruck', desc: 'Moving & delivery', price: '800', capacity: 'Large cargo' };
    default: return { name: 'YaadCar', desc: 'Comfortable rides', price: '300', capacity: '4 passengers' };
  }
};

export default function RideBooking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<'bike' | 'car' | 'van' | 'truck'>('car');
  const [isBooking, setIsBooking] = useState(false);

  // Fetch available vehicles
  const { data: availableVehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles/available'],
    retry: false,
  });

  // Fetch user's current trips
  const { data: currentTrips = [] } = useQuery<Trip[]>({
    queryKey: ['/api/trips/current'],
    retry: false,
  });

  // Book ride mutation
  const bookRideMutation = useMutation({
    mutationFn: async (rideData: any) => {
      const response = await apiRequest('POST', '/api/trips/book', rideData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🇯🇲 Ride Booked Successfully!",
        description: `Your ${getVehicleInfo(selectedVehicleType).name} is on the way! Trip ID: ${data.tripId}`,
      });
      setPickupLocation('');
      setDropoffLocation('');
      setIsBooking(false);
      queryClient.invalidateQueries({ queryKey: ['/api/trips/current'] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to book ride. Please try again.",
        variant: "destructive",
      });
      setIsBooking(false);
    },
  });

  const handleBookRide = async () => {
    if (!pickupLocation.trim() || !dropoffLocation.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both pickup and dropoff locations.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    
    const rideData = {
      pickupAddress: pickupLocation,
      dropoffAddress: dropoffLocation,
      vehicleType: selectedVehicleType,
      // Using Kingston coordinates as default for demo
      pickupLatitude: "17.9712",
      pickupLongitude: "-76.7936",
      dropoffLatitude: "17.9712", 
      dropoffLongitude: "-76.7936",
    };

    bookRideMutation.mutate(rideData);
  };

  const estimatedFare = getVehicleInfo(selectedVehicleType).price;
  const driverEarnings = Math.round(parseFloat(estimatedFare) * 0.85);
  const yaadFlexFee = parseFloat(estimatedFare) - driverEarnings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent mb-2">
            🇯🇲 YaadFlex Rides
          </h1>
          <p className="text-xl text-muted-foreground">
            Fair rides across Jamaica - Drivers keep 85%!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Book Your Ride
              </CardTitle>
              <CardDescription>
                Quick, safe, and fair transportation across Jamaica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Inputs */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickup">Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pickup"
                      placeholder="Where are you?"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="pl-10"
                      data-testid="input-pickup-location"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dropoff">Dropoff Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dropoff"
                      placeholder="Where are you going?"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="pl-10"
                      data-testid="input-dropoff-location"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div>
                <Label>Choose Your Ride</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {(['bike', 'car', 'van', 'truck'] as const).map((type) => {
                    const info = getVehicleInfo(type);
                    return (
                      <Card 
                        key={type}
                        className={`cursor-pointer transition-all ${
                          selectedVehicleType === type ? 'ring-2 ring-accent bg-accent/10' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedVehicleType(type)}
                        data-testid={`vehicle-${type}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            {getVehicleIcon(type)}
                            <span className="font-medium text-sm">{info.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{info.desc}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-green-600">${info.price} JMD</span>
                            <span className="text-xs text-muted-foreground">{info.capacity}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Fare Breakdown */}
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-700 dark:text-green-300">Fair Pricing Breakdown</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Fare:</span>
                      <span className="font-medium">${estimatedFare} JMD</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Driver Earnings (85%):</span>
                      <span className="font-bold">${driverEarnings} JMD</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>YaadFlex Fee (15%):</span>
                      <span>${yaadFlexFee} JMD</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    🏆 Most fair in the world!
                  </Badge>
                </CardContent>
              </Card>

              {/* Book Button */}
              <Button 
                onClick={handleBookRide}
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600"
                disabled={isBooking || bookRideMutation.isPending}
                data-testid="button-book-ride"
              >
                {isBooking || bookRideMutation.isPending ? (
                  <>Booking Your Ride...</>
                ) : (
                  <>🚗 Book YaadFlex Ride - ${estimatedFare} JMD</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Current Trips & Status */}
          <div className="space-y-6">
            {/* Active Rides */}
            {currentTrips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Your Active Rides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentTrips.map((trip) => (
                      <Card key={trip.id} className="bg-blue-50 dark:bg-blue-950/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={trip.status === 'accepted' ? 'default' : trip.status === 'in_progress' ? 'secondary' : 'outline'}>
                              {trip.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {trip.vehicleType.toUpperCase()}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span>{trip.pickupAddress || 'Pickup location'}</span>
                            </div>
                            {trip.dropoffAddress && (
                              <div className="flex items-center gap-2">
                                <Navigation className="h-3 w-3" />
                                <span>{trip.dropoffAddress}</span>
                              </div>
                            )}
                            {trip.estimatedFare && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-3 w-3" />
                                <span>${trip.estimatedFare} JMD</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Vehicles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Drivers ({availableVehicles.length})
                </CardTitle>
                <CardDescription>
                  YaadFlex drivers are online and ready to serve you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {['bike', 'car', 'van', 'truck'].map((type) => {
                    const count = availableVehicles.filter(v => v.vehicleType === type).length;
                    return (
                      <div key={type} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        {getVehicleIcon(type)}
                        <div>
                          <p className="font-medium text-sm capitalize">{type}s</p>
                          <p className="text-xs text-muted-foreground">{count} available</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Live Chat & Calling - Global Communication */}
            {currentTrips.length > 0 && currentTrips.some(trip => trip.status === 'accepted' || trip.status === 'in_progress') && (
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <MessageCircle className="h-5 w-5" />
                    🌍 Talk to Your Driver - No Phone Numbers!
                  </CardTitle>
                  <CardDescription>
                    Call and chat through YaadFlex - Works worldwide, private and secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LiveChat 
                    rideId={currentTrips.find(trip => trip.status === 'in_progress' || trip.status === 'accepted')?.id}
                    otherUser={{
                      id: 'driver_123',
                      name: 'Marcus Thompson',
                      role: 'driver'
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* YaadFlex Benefits */}
            <Card className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-950/20 dark:to-yellow-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle2 className="h-5 w-5" />
                  🇯🇲 YaadFlex Global Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-green-600">85%</Badge>
                  <span>Drivers keep most of the fare</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-blue-600">Global</Badge>
                  <span>Expanding to 3/4 of every country</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-purple-600">Voice Calls</Badge>
                  <span>Talk directly through the app</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-yellow-600">Jobs</Badge>
                  <span>Work opportunities for everyone</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-red-600">Fair</Badge>
                  <span>No surge pricing exploitation</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}