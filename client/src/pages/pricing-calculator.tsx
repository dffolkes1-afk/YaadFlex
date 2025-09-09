import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, 
  MapPin, 
  Clock, 
  Plus, 
  Car, 
  DollarSign, 
  Coffee,
  PartyPopper,
  Plane,
  Mountain,
  Users,
  Cigarette
} from 'lucide-react';

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

export default function PricingCalculator() {
  const { toast } = useToast();
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [distance, setDistance] = useState<number>(5);
  const [vehicleType, setVehicleType] = useState<'lipstick' | 'shadow'>('lipstick');
  const [plateType, setPlateType] = useState<'red' | 'white'>('red');
  const [selectedAddons, setSelectedAddons] = useState<{[key: string]: number}>({});
  const [isCalculating, setIsCalculating] = useState(false);

  // Base rates for different vehicle types (JMD)
  const baseRates = {
    lipstick: { red: 150, white: 200 }, // Red plate standard, white plate premium
    shadow: { red: 150, white: 250 }   // Shadow fleet (white plates) get premium rates
  };

  // Calculate total fare
  const calculateFare = () => {
    if (!selectedZone) return 0;

    const zone = yaadflexZones.find(z => z.id === selectedZone);
    if (!zone) return 0;

    // Check if plate type is allowed in zone
    if (!zone.allowedPlates.includes(plateType)) {
      toast({
        title: "Invalid Vehicle Assignment",
        description: `${plateType.charAt(0).toUpperCase() + plateType.slice(1)} plates not allowed in ${zone.name}`,
        variant: "destructive",
      });
      return 0;
    }

    // Base fare calculation
    const baseRate = baseRates[vehicleType][plateType];
    const baseFare = baseRate + (distance * 30); // 30 JMD per km
    
    // Apply zone multiplier
    const zoneFare = baseFare * zone.multiplier;
    
    // Add lifestyle add-ons
    const addonTotal = Object.entries(selectedAddons).reduce((total, [addonId, quantity]) => {
      const addon = lifestyleAddons.find(a => a.id === addonId);
      return total + (addon ? addon.basePrice * quantity : 0);
    }, 0);

    return Math.round(zoneFare + addonTotal);
  };

  const driverEarnings = Math.round(calculateFare() * 0.85); // 85% to driver
  const platformFee = calculateFare() - driverEarnings;

  const handleAddonChange = (addonId: string, quantity: number) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonId]: quantity
    }));
  };

  // Auto-select appropriate vehicle based on zone
  useEffect(() => {
    if (selectedZone) {
      const zone = yaadflexZones.find(z => z.id === selectedZone);
      if (zone) {
        // Auto-assign vehicle type based on zone
        if (zone.type === 'upscale' && zone.allowedPlates.includes('white')) {
          setVehicleType('shadow');
          setPlateType('white');
        } else if (zone.type === 'municipal') {
          setVehicleType('lipstick');
          setPlateType('red');
        }
      }
    }
  }, [selectedZone]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent mb-2">
            💄 YaadFlex Pricing Calculator
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Fair pricing with Lipstick Fleet automatic assignment - No cherry picking!
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-green-600">✓ Automatic Assignment</Badge>
            <Badge variant="secondary" className="text-blue-600">✓ Area-Based Pricing</Badge>
            <Badge variant="secondary" className="text-purple-600">✓ Lifestyle Add-ons</Badge>
            <Badge variant="secondary" className="text-orange-600">✓ 85% Driver Earnings</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Trip Configuration */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Zone Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Select Area (Automatic Fleet Assignment)
                </CardTitle>
                <CardDescription>
                  System automatically assigns Lipstick (red) or Shadow (white) fleet based on area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="zone">Pickup/Dropoff Area</Label>
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger data-testid="select-zone">
                      <SelectValue placeholder="Choose area for automatic vehicle assignment" />
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

                <div>
                  <Label htmlFor="distance">Trip Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    min="1"
                    max="100"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    data-testid="input-distance"
                  />
                </div>

                {selectedZone && (
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardContent className="p-4">
                      <div className="space-y-2 text-sm">
                        <div className="font-medium text-blue-700 dark:text-blue-300">
                          🚗 Auto-Assigned Vehicle:
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          <span>{vehicleType === 'lipstick' ? '💄 Lipstick Fleet' : '👻 Shadow Fleet'}</span>
                          <Badge className={plateType === 'red' ? 'bg-red-600' : 'bg-gray-100 text-black'}>
                            {plateType.toUpperCase()} PLATE
                          </Badge>
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          System selected based on area type and availability
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Lifestyle Add-ons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Lifestyle Add-ons (Fair But Fun!)
                </CardTitle>
                <CardDescription>
                  Enjoy your ride with extras - fairly priced, nobody gets crushed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lifestyleAddons.map((addon) => {
                    const IconComponent = addon.icon;
                    return (
                      <div key={addon.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span className="font-medium text-sm">{addon.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
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
                            className="w-20 h-8"
                            value={selectedAddons[addon.id] || 0}
                            onChange={(e) => handleAddonChange(addon.id, Number(e.target.value))}
                            data-testid={`addon-${addon.id}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-6">
            
            {/* Live Pricing */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Live Pricing
                </CardTitle>
                <CardDescription>
                  Real-time fare calculation with 85% driver earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Total Fare */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    ${calculateFare()} JMD
                  </div>
                  <div className="text-sm text-muted-foreground">Total Trip Cost</div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Base Fare + Distance</span>
                    <span>${Math.round((baseRates[vehicleType][plateType] + (distance * 30)) * (yaadflexZones.find(z => z.id === selectedZone)?.multiplier || 1))} JMD</span>
                  </div>
                  
                  {Object.entries(selectedAddons).filter(([_, qty]) => qty > 0).map(([addonId, quantity]) => {
                    const addon = lifestyleAddons.find(a => a.id === addonId);
                    return addon ? (
                      <div key={addonId} className="flex justify-between text-sm">
                        <span>{addon.name} ({quantity}x)</span>
                        <span>${addon.basePrice * quantity} JMD</span>
                      </div>
                    ) : null;
                  })}
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between font-medium text-green-600">
                      <span>Driver Earnings (85%)</span>
                      <span>${driverEarnings} JMD</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Platform Fee (15%)</span>
                      <span>${platformFee} JMD</span>
                    </div>
                  </div>
                </div>

                {/* Book Ride Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700"
                  disabled={!selectedZone || calculateFare() === 0}
                  onClick={() => {
                    toast({
                      title: "🚗 Ride Requested!",
                      description: `Your ${vehicleType === 'lipstick' ? 'Lipstick' : 'Shadow'} driver will be assigned automatically. No cherry-picking!`,
                    });
                  }}
                  data-testid="button-book-ride"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Book {vehicleType === 'lipstick' ? 'Lipstick' : 'Shadow'} Ride
                </Button>
              </CardContent>
            </Card>

            {/* Policy Information */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
              <CardHeader>
                <CardTitle className="text-purple-700 dark:text-purple-300 text-lg">
                  🎯 YaadFlex Fair Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>No Cherry-Picking:</strong> System assigns jobs automatically</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Fair Distribution:</strong> All drivers get equal opportunities</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Area-Based Pricing:</strong> Lipstick in municipal, Shadow in upscale</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Lifestyle Freedom:</strong> Add-ons for stops, waiting, party runs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Everybody Eats:</strong> 85% to driver, fair but profitable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}