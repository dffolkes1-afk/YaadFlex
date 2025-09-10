import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign, 
  Car, 
  CheckCircle,
  Coffee,
  Plus,
  PartyPopper,
  Mountain,
  Plane,
  Users,
  Cigarette,
  AlertTriangle
} from 'lucide-react';

type BookingFormData = {
  pickupAddress: string;
  dropoffAddress: string;
  tripType: 'ride' | 'delivery' | 'package';
  selectedZone: string;
  estimatedDistance: number;
  addons: {[key: string]: number};
  specialInstructions: string;
  phoneNumber: string;
  paymentMethod: 'cash' | 'card' | 'wallet';
};

type PricingZone = {
  id: string;
  name: string;
  type: 'municipal' | 'upscale' | 'rural' | 'special';
  multiplier: number;
  allowedPlates: ('red' | 'white')[];
};

type LifestyleAddon = {
  id: string;
  name: string;
  type: string;
  basePrice: number;
  unit: string;
  icon: any;
  description: string;
};

const yaadflexZones: PricingZone[] = [
  { id: 'downtown', name: 'Downtown Kingston', type: 'municipal', multiplier: 1.0, allowedPlates: ['red', 'white'] },
  { id: 'spanish_town', name: 'Spanish Town', type: 'municipal', multiplier: 1.0, allowedPlates: ['red', 'white'] },
  { id: 'may_pen', name: 'May Pen', type: 'municipal', multiplier: 0.9, allowedPlates: ['red'] },
  { id: 'hope_pastures', name: 'Hope Pastures', type: 'upscale', multiplier: 1.5, allowedPlates: ['white'] },
  { id: 'stony_hill', name: 'Stony Hill', type: 'upscale', multiplier: 1.4, allowedPlates: ['white'] },
  { id: 'blue_mountains', name: 'Blue Mountains', type: 'rural', multiplier: 1.3, allowedPlates: ['red', 'white'] },
  { id: 'norman_manley', name: 'Norman Manley Airport', type: 'special', multiplier: 1.6, allowedPlates: ['red', 'white'] },
];

const lifestyleAddons: LifestyleAddon[] = [
  { id: 'waiting', name: 'Waiting Time', type: 'waiting_time', basePrice: 50, unit: 'per minute (after 5 min free)', icon: Clock, description: 'First 5 minutes free' },
  { id: 'extra_stop', name: 'Extra Stop', type: 'extra_stop', basePrice: 200, unit: 'per stop', icon: Plus, description: 'Pick up friend, quick errands' },
  { id: 'smoke_stop', name: 'Smoke/Chill Stop', type: 'smoke_stop', basePrice: 150, unit: 'per stop', icon: Cigarette, description: 'Quick smoke or chill break' },
  { id: 'food_stop', name: 'Food Stop', type: 'food_stop', basePrice: 250, unit: 'per stop', icon: Coffee, description: 'Stop for food pickup' },
  { id: 'party_run', name: 'Party Run', type: 'party_run', basePrice: 300, unit: 'late night surcharge', icon: PartyPopper, description: 'Club/party pickup (10pm-6am)' },
  { id: 'airport_trip', name: 'Airport Trip', type: 'airport', basePrice: 400, unit: 'airport surcharge', icon: Plane, description: 'Travelers only, workers pay standard' },
  { id: 'uphill', name: 'Uphill/Mountain', type: 'uphill', basePrice: 200, unit: 'terrain surcharge', icon: Mountain, description: 'Steep or difficult terrain' },
  { id: 'overload', name: 'Extra Passenger', type: 'overload', basePrice: 100, unit: 'per extra person', icon: Users, description: 'Beyond vehicle comfort limit' },
];

export default function CustomerBooking() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [assignedVehicle, setAssignedVehicle] = useState<{type: 'lipstick' | 'shadow', plate: 'red' | 'white'} | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    pickupAddress: '',
    dropoffAddress: '',
    tripType: 'ride',
    selectedZone: '',
    estimatedDistance: 5,
    addons: {},
    specialInstructions: '',
    phoneNumber: '',
    paymentMethod: 'cash',
  });

  // Base fares by zone (JMD) - Real Jamaican pricing
  const getBaseFare = (zoneId: string) => {
    switch (zoneId) {
      case 'downtown':
      case 'spanish_town':
        return 250; // Downtown Kingston/Spanish Town
      case 'uptown':
      case 'barbican':
        return 300; // Uptown areas
      case 'rural':
        return 400; // Rural areas
      case 'norman_manley':
        return 300; // Airport (plus surcharge)
      default:
        return 300;
    }
  };

  // Calculate total fare
  const calculateFare = () => {
    if (!bookingData.selectedZone || !assignedVehicle) return 0;

    const zone = yaadflexZones.find(z => z.id === bookingData.selectedZone);
    if (!zone) return 0;

    // Real JMD pricing calculation
    const baseFare = getBaseFare(bookingData.selectedZone);
    const distanceCost = bookingData.estimatedDistance * 70; // J$70 per km
    const estimatedTime = bookingData.estimatedDistance * 3; // Estimate ~3 min per km in traffic
    const timeCost = estimatedTime * 15; // J$15 per minute
    
    // Base trip cost
    let zoneFare = baseFare + distanceCost + timeCost;
    
    // Apply zone-specific multipliers for hilly/special areas
    if (bookingData.selectedZone === 'stony_hill') {
      zoneFare *= 1.1; // +10% for hilly areas
    }
    
    // Add lifestyle add-ons
    const addonTotal = Object.entries(bookingData.addons).reduce((total, [addonId, quantity]) => {
      const addon = lifestyleAddons.find(a => a.id === addonId);
      return total + (addon ? addon.basePrice * quantity : 0);
    }, 0);

    return Math.round(zoneFare + addonTotal);
  };

  // Auto-assign vehicle type based on zone
  useEffect(() => {
    if (bookingData.selectedZone) {
      const zone = yaadflexZones.find(z => z.id === bookingData.selectedZone);
      if (zone) {
        // Automatic vehicle assignment based on zone type
        if (zone.type === 'upscale' && zone.allowedPlates.includes('white')) {
          setAssignedVehicle({ type: 'shadow', plate: 'white' });
        } else if (zone.type === 'municipal') {
          setAssignedVehicle({ type: 'lipstick', plate: 'red' });
        } else {
          // For rural/special zones, prefer red plates if available
          setAssignedVehicle({ 
            type: zone.allowedPlates.includes('red') ? 'lipstick' : 'shadow', 
            plate: zone.allowedPlates.includes('red') ? 'red' : 'white' 
          });
        }
      }
    }
  }, [bookingData.selectedZone]);

  // Book ride mutation
  const bookRideMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest('POST', '/api/bookings/create', {
        ...data,
        assignedVehicle,
        estimatedFare: calculateFare(),
      });
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "🚗 Ride Booked Successfully!",
        description: `Your ${assignedVehicle?.type === 'lipstick' ? 'Lipstick' : 'Shadow'} driver will be assigned automatically. No cherry-picking!`,
      });
      setStep(4); // Go to confirmation step
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to book ride. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddonChange = (addonId: string, quantity: number) => {
    setBookingData(prev => ({
      ...prev,
      addons: { ...prev.addons, [addonId]: quantity }
    }));
  };

  const handleBookRide = () => {
    // Validation
    if (!bookingData.pickupAddress || !bookingData.dropoffAddress || !bookingData.selectedZone || !bookingData.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    bookRideMutation.mutate(bookingData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent mb-2">
            🚗 Book Your YaadFlex Ride
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Automatic vehicle assignment • No cherry-picking • Fair pricing
          </p>
          
          {/* Step Indicator */}
          <div className="flex justify-center items-center gap-4 mb-6">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > stepNum ? <CheckCircle className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-12 h-1 ${step > stepNum ? 'bg-green-600' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Trip Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Trip Details
              </CardTitle>
              <CardDescription>
                Enter your pickup and dropoff locations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Trip Type */}
              <div>
                <Label>Trip Type</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {(['ride', 'delivery', 'package'] as const).map((type) => (
                    <Card 
                      key={type}
                      className={`cursor-pointer transition-all ${
                        bookingData.tripType === type ? 'ring-2 ring-accent bg-accent/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleInputChange('tripType', type)}
                      data-testid={`trip-type-${type}`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="mb-2">
                          {type === 'ride' && <Car className="h-6 w-6 mx-auto" />}
                          {type === 'delivery' && <Coffee className="h-6 w-6 mx-auto" />}
                          {type === 'package' && <Users className="h-6 w-6 mx-auto" />}
                        </div>
                        <div className="font-medium text-sm capitalize">{type}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Addresses */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickup">Pickup Location *</Label>
                  <Input
                    id="pickup"
                    placeholder="Enter pickup address"
                    value={bookingData.pickupAddress}
                    onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                    data-testid="input-pickup"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dropoff">Dropoff Location *</Label>
                  <Input
                    id="dropoff"
                    placeholder="Enter destination address"
                    value={bookingData.dropoffAddress}
                    onChange={(e) => handleInputChange('dropoffAddress', e.target.value)}
                    data-testid="input-dropoff"
                  />
                </div>
              </div>

              {/* Zone Selection */}
              <div>
                <Label htmlFor="zone">Area (Auto-assigns fleet) *</Label>
                <Select value={bookingData.selectedZone} onValueChange={(value) => handleInputChange('selectedZone', value)}>
                  <SelectTrigger data-testid="select-zone">
                    <SelectValue placeholder="Select pickup area for automatic vehicle assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {yaadflexZones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name} ({zone.type}) - {zone.multiplier}x rate
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Assignment Display */}
              {assignedVehicle && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Auto-Assigned Vehicle:
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{assignedVehicle.type === 'lipstick' ? '💄 Lipstick Fleet' : '👻 Shadow Fleet'}</span>
                        <Badge className={assignedVehicle.plate === 'red' ? 'bg-red-600' : 'bg-gray-100 text-black'}>
                          {assignedVehicle.plate.toUpperCase()} PLATE
                        </Badge>
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        System selected based on area and availability
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div>
                <Label htmlFor="distance">Estimated Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  min="1"
                  max="100"
                  value={bookingData.estimatedDistance}
                  onChange={(e) => handleInputChange('estimatedDistance', Number(e.target.value))}
                  data-testid="input-distance"
                />
              </div>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                disabled={!bookingData.pickupAddress || !bookingData.dropoffAddress || !bookingData.selectedZone}
                data-testid="button-next-step"
              >
                Continue to Add-ons
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Lifestyle Add-ons */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Lifestyle Add-ons (Optional)
              </CardTitle>
              <CardDescription>
                Customize your ride with fair extras
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lifestyleAddons.map((addon) => {
                  const IconComponent = addon.icon;
                  return (
                    <div key={addon.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{addon.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {addon.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          ${addon.basePrice} JMD {addon.unit}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          className="w-20"
                          value={bookingData.addons[addon.id] || 0}
                          onChange={(e) => handleAddonChange(addon.id, Number(e.target.value))}
                          data-testid={`addon-${addon.id}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Instructions */}
              <div>
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Input
                  id="instructions"
                  placeholder="Any special requests for your driver..."
                  value={bookingData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  data-testid="input-instructions"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" data-testid="button-next-payment">
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment & Contact */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment & Contact Details
              </CardTitle>
              <CardDescription>
                Final step before booking your ride
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Pricing Summary */}
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-600">
                      J${calculateFare()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Trip Cost</div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Fare ({assignedVehicle?.type} fleet)</span>
                      <span>J${getBaseFare(bookingData.selectedZone) + (bookingData.estimatedDistance * 70) + (Math.round(bookingData.estimatedDistance * 3) * 15)}</span>
                    </div>
                    
                    {Object.entries(bookingData.addons).filter(([_, qty]) => qty > 0).map(([addonId, quantity]) => {
                      const addon = lifestyleAddons.find(a => a.id === addonId);
                      return addon ? (
                        <div key={addonId} className="flex justify-between">
                          <span>{addon.name} ({quantity}x)</span>
                          <span>J${addon.basePrice * quantity}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="Your phone number for driver contact"
                  value={bookingData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  data-testid="input-phone"
                />
              </div>

              {/* Payment Method */}
              <div>
                <Label>Payment Method</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {(['cash', 'card', 'wallet'] as const).map((method) => (
                    <Card 
                      key={method}
                      className={`cursor-pointer transition-all ${
                        bookingData.paymentMethod === method ? 'ring-2 ring-accent bg-accent/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleInputChange('paymentMethod', method)}
                      data-testid={`payment-${method}`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="font-medium text-sm capitalize">{method}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleBookRide} 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={bookRideMutation.isPending || !bookingData.phoneNumber}
                  data-testid="button-book-ride"
                >
                  {bookRideMutation.isPending ? 'Booking...' : 'Book Ride'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Ride Booked Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Your {assignedVehicle?.type === 'lipstick' ? 'Lipstick' : 'Shadow'} driver will be automatically assigned within minutes.
                No cherry-picking - fair distribution system!
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2">What happens next:</h3>
                <div className="text-sm text-left space-y-1">
                  <div>• System assigns nearest available driver</div>
                  <div>• Driver contacts you within 2-5 minutes</div>
                  <div>• Real-time tracking starts when driver accepts</div>
                  <div>• Payment processed on completion</div>
                </div>
              </div>

              <Button onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }} className="w-full">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}