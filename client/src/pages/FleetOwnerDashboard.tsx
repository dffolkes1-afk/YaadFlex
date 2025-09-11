import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Car, Users, DollarSign, Plus, Check, X, MapPin, 
  Calendar, Shield, Star, TrendingUp, AlertCircle
} from 'lucide-react';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'assigned' | 'maintenance';
  assignedDriver?: Driver;
  earnings: number;
  rating: number;
};

type Driver = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  tripsCompleted: number;
  verified: boolean;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
};

export default function FleetOwnerDashboard() {
  const { toast } = useToast();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      licensePlate: 'JA1234',
      status: 'assigned',
      assignedDriver: {
        id: 'd1',
        name: 'Marcus Campbell',
        phone: '+1876-555-0123',
        rating: 4.8,
        tripsCompleted: 234,
        verified: true,
        applicationDate: '2024-01-15',
        status: 'approved'
      },
      earnings: 125000,
      rating: 4.7
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      licensePlate: 'JB5678',
      status: 'available',
      earnings: 89000,
      rating: 4.5
    }
  ]);

  const [driverApplications, setDriverApplications] = useState<Driver[]>([
    {
      id: 'd2',
      name: 'Andre Thompson',
      phone: '+1876-555-0456',
      rating: 4.6,
      tripsCompleted: 156,
      verified: true,
      applicationDate: '2024-02-20',
      status: 'pending'
    },
    {
      id: 'd3',
      name: 'Michelle Brown',
      phone: '+1876-555-0789',
      rating: 4.9,
      tripsCompleted: 412,
      verified: true,
      applicationDate: '2024-02-22',
      status: 'pending'
    }
  ]);

  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: ''
  });

  const handleAddVehicle = () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.year || !newVehicle.licensePlate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all vehicle details",
        variant: "destructive"
      });
      return;
    }

    const vehicle: Vehicle = {
      id: Date.now().toString(),
      make: newVehicle.make,
      model: newVehicle.model,
      year: parseInt(newVehicle.year),
      licensePlate: newVehicle.licensePlate,
      status: 'available',
      earnings: 0,
      rating: 0
    };

    setVehicles([...vehicles, vehicle]);
    setNewVehicle({ make: '', model: '', year: '', licensePlate: '' });
    
    toast({
      title: "Vehicle Added! 🚗",
      description: `${vehicle.make} ${vehicle.model} is now available for drivers`,
    });
  };

  const handleApproveDriver = (driver: Driver, vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    setVehicles(vehicles.map(v => 
      v.id === vehicleId 
        ? { ...v, status: 'assigned' as const, assignedDriver: { ...driver, status: 'approved' as const } }
        : v
    ));

    setDriverApplications(driverApplications.filter(d => d.id !== driver.id));

    toast({
      title: "Driver Approved! ✅",
      description: `${driver.name} is now assigned to ${vehicle.make} ${vehicle.model}`,
    });
  };

  const handleRejectDriver = (driverId: string) => {
    setDriverApplications(driverApplications.filter(d => d.id !== driverId));
    toast({
      title: "Application Rejected",
      description: "The driver application has been declined",
    });
  };

  const handleRemoveDriver = (vehicleId: string) => {
    setVehicles(vehicles.map(v => 
      v.id === vehicleId 
        ? { ...v, status: 'available' as const, assignedDriver: undefined }
        : v
    ));
    
    toast({
      title: "Driver Removed",
      description: "Vehicle is now available for new driver assignment",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-green-600 bg-clip-text text-transparent mb-2" data-testid="text-header">
            🚗 Fleet Owner Dashboard
          </h1>
          <p className="text-xl text-gray-600" data-testid="text-subheader">
            Manage your vehicles and select your drivers
          </p>
          
          {/* YaadFlex Advantage */}
          <div className="bg-gradient-to-r from-yellow-100 to-green-100 p-4 rounded-xl mt-4 border-2 border-yellow-300">
            <div className="text-lg font-bold text-green-800">
              💰 Your Cars, Your Rules, Your Earnings!
            </div>
            <div className="text-sm text-green-700">
              Keep 100% ownership while drivers pay you rental fees • Full control over who drives your vehicles
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Car className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold" data-testid="text-total-vehicles">{vehicles.length}</div>
                  <div className="text-sm text-gray-600">Total Vehicles</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold" data-testid="text-active-drivers">
                    {vehicles.filter(v => v.status === 'assigned').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Drivers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold" data-testid="text-pending-applications">
                    {driverApplications.length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Applications</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold" data-testid="text-total-earnings">
                    ${vehicles.reduce((sum, v) => sum + v.earnings, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vehicles" data-testid="tab-vehicles">🚗 My Vehicles</TabsTrigger>
            <TabsTrigger value="drivers" data-testid="tab-drivers">👥 Driver Applications</TabsTrigger>
            <TabsTrigger value="add" data-testid="tab-add">➕ Add Vehicle</TabsTrigger>
          </TabsList>

          {/* My Vehicles Tab */}
          <TabsContent value="vehicles">
            <div className="grid gap-4">
              {vehicles.map(vehicle => (
                <Card key={vehicle.id} data-testid={`card-vehicle-${vehicle.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{vehicle.make} {vehicle.model} ({vehicle.year})</CardTitle>
                        <CardDescription>License Plate: {vehicle.licensePlate}</CardDescription>
                      </div>
                      <Badge 
                        variant={vehicle.status === 'assigned' ? 'default' : 'secondary'}
                        data-testid={`badge-status-${vehicle.id}`}
                      >
                        {vehicle.status === 'assigned' ? '🟢 Assigned' : '🟡 Available'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {vehicle.assignedDriver ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Assigned Driver</h4>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRemoveDriver(vehicle.id)}
                              data-testid={`button-remove-driver-${vehicle.id}`}
                            >
                              <X className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Name:</span> {vehicle.assignedDriver.name}
                            </div>
                            <div>
                              <span className="text-gray-600">Phone:</span> {vehicle.assignedDriver.phone}
                            </div>
                            <div>
                              <span className="text-gray-600">Rating:</span> ⭐ {vehicle.assignedDriver.rating}
                            </div>
                            <div>
                              <span className="text-gray-600">Trips:</span> {vehicle.assignedDriver.tripsCompleted}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-600">Vehicle Earnings:</span>
                            <div className="text-xl font-bold text-green-600">
                              ${vehicle.earnings.toLocaleString()} JMD
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Vehicle Rating:</span>
                            <div className="text-xl font-bold">⭐ {vehicle.rating || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-yellow-50 rounded-lg">
                        <Users className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                        <p className="text-gray-600">No driver assigned</p>
                        <p className="text-sm text-gray-500">Review driver applications to assign someone</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Driver Applications Tab */}
          <TabsContent value="drivers">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">How Driver Selection Works:</h3>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Drivers apply to rent your vehicles</li>
                  <li>2. You review their ratings and history</li>
                  <li>3. You select which driver gets which car</li>
                  <li>4. Driver pays you rental fees, keeps their ride earnings</li>
                </ol>
              </div>

              {driverApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending driver applications</p>
                  </CardContent>
                </Card>
              ) : (
                driverApplications.map(driver => (
                  <Card key={driver.id} data-testid={`card-driver-${driver.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{driver.name}</CardTitle>
                          <CardDescription>Applied: {driver.applicationDate}</CardDescription>
                        </div>
                        {driver.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Phone</span>
                          <div className="font-semibold">{driver.phone}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Rating</span>
                          <div className="font-semibold">⭐ {driver.rating}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Completed Trips</span>
                          <div className="font-semibold">{driver.tripsCompleted}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge variant="outline">Pending Review</Badge>
                        </div>
                      </div>

                      {vehicles.filter(v => v.status === 'available').length > 0 && (
                        <div className="flex items-center gap-2 mt-4">
                          <Select onValueChange={(vehicleId) => handleApproveDriver(driver, vehicleId)}>
                            <SelectTrigger className="flex-1" data-testid={`select-vehicle-${driver.id}`}>
                              <SelectValue placeholder="Select a vehicle to assign" />
                            </SelectTrigger>
                            <SelectContent>
                              {vehicles.filter(v => v.status === 'available').map(vehicle => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRejectDriver(driver.id)}
                            data-testid={`button-reject-${driver.id}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {vehicles.filter(v => v.status === 'available').length === 0 && (
                        <div className="bg-yellow-50 p-3 rounded-lg mt-4">
                          <p className="text-sm text-yellow-800">
                            No vehicles available. Add a vehicle or remove a driver to assign this applicant.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Add Vehicle Tab */}
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Vehicle</CardTitle>
                <CardDescription>
                  Register your vehicle to start earning rental income from drivers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input 
                      id="make"
                      placeholder="e.g., Toyota"
                      value={newVehicle.make}
                      onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                      data-testid="input-make"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input 
                      id="model"
                      placeholder="e.g., Camry"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                      data-testid="input-model"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input 
                      id="year"
                      type="number"
                      placeholder="e.g., 2021"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                      data-testid="input-year"
                    />
                  </div>
                  <div>
                    <Label htmlFor="plate">License Plate</Label>
                    <Input 
                      id="plate"
                      placeholder="e.g., JA1234"
                      value={newVehicle.licensePlate}
                      onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                      data-testid="input-license-plate"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">💰 Earning Potential</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Daily rental fees from drivers: $2,000 - $5,000 JMD</li>
                      <li>• You keep 100% vehicle ownership</li>
                      <li>• Drivers handle gas and daily maintenance</li>
                      <li>• YaadFlex provides insurance coverage</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handleAddVehicle}
                    className="w-full"
                    size="lg"
                    data-testid="button-add-vehicle"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Vehicle to Fleet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}