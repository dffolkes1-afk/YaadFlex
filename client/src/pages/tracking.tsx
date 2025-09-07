import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { isUnauthorizedError } from '@/lib/authUtils';
import { 
  MapPin, 
  Car, 
  Truck, 
  Bike, 
  Shield, 
  Eye, 
  AlertTriangle,
  Navigation,
  Clock,
  Users,
  Activity
} from 'lucide-react';

type Vehicle = {
  id: string;
  driverId: string;
  vehicleType: 'bike' | 'car' | 'van' | 'truck';
  licensePlate: string;
  model?: string;
  color?: string;
  isActive: boolean;
  currentLatitude?: string;
  currentLongitude?: string;
  lastLocationUpdate?: string;
  createdAt: string;
};

type Trip = {
  id: string;
  riderId: string;
  driverId?: string;
  vehicleId?: string;
  type: 'ride' | 'delivery' | 'package';
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  pickupLatitude: string;
  pickupLongitude: string;
  pickupAddress?: string;
  dropoffLatitude?: string;
  dropoffLongitude?: string;
  dropoffAddress?: string;
  estimatedFare?: string;
  distance?: string;
  duration?: number;
  isPubliclyVisible: boolean;
  securityLevel: string;
  createdAt: string;
};

type SecurityEvent = {
  id: string;
  tripId?: string;
  vehicleId?: string;
  userId?: string;
  eventType: string;
  threatLevel: string;
  aiConfidence?: string;
  description: string;
  actionTaken?: string;
  isResolved: boolean;
  latitude?: string;
  longitude?: string;
  createdAt: string;
};

const getVehicleIcon = (type: string) => {
  switch (type) {
    case 'bike': return <Bike className="h-4 w-4" />;
    case 'car': return <Car className="h-4 w-4" />;
    case 'van': return <Truck className="h-4 w-4" />;
    case 'truck': return <Truck className="h-4 w-4" />;
    default: return <Car className="h-4 w-4" />;
  }
};

const getThreatLevelColor = (level: string) => {
  switch (level) {
    case 'low': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-orange-500';
    case 'critical': return 'bg-red-500';
    case 'interpol_level': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export default function RealTimeTracking() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [trackingMode, setTrackingMode] = useState<'public' | 'secure'>('public');

  // Fetch active vehicles (public data for transparency)
  const { data: activeVehicles, isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles/active'],
    refetchInterval: 5000, // Update every 5 seconds for real-time tracking
    retry: false,
  });

  // Fetch public trips (transparency feature)
  const { data: publicTrips, isLoading: tripsLoading } = useQuery<Trip[]>({
    queryKey: ['/api/trips/public'],
    refetchInterval: 10000, // Update every 10 seconds
    retry: false,
  });

  // Fetch security events (for authenticated users)
  const { data: securityEvents, error: securityError } = useQuery<SecurityEvent[]>({
    queryKey: ['/api/security/events'],
    enabled: isAuthenticated,
    refetchInterval: 3000, // Real-time security monitoring
    retry: false,
  });

  // Handle security events errors
  useEffect(() => {
    if (securityError && isUnauthorizedError(securityError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [securityError, toast]);

  // Calculate security statistics
  const securityStats = securityEvents ? {
    total: securityEvents.length,
    resolved: securityEvents.filter((e: SecurityEvent) => e.isResolved).length,
    unresolved: securityEvents.filter((e: SecurityEvent) => !e.isResolved).length,
    highThreat: securityEvents.filter((e: SecurityEvent) => ['high', 'critical', 'interpol_level'].includes(e.threatLevel)).length,
  } : { total: 0, resolved: 0, unresolved: 0, highThreat: 0 };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-green-400" data-testid="tracking-title">
            🛡️ YardFlex Global Tracking Network
          </h1>
          <p className="text-lg text-green-300" data-testid="tracking-subtitle">
            Real-time vehicle monitoring with security beyond Interpol standards
          </p>
          
          {/* Mode Toggle */}
          <div className="flex justify-center gap-4">
            <Button
              variant={trackingMode === 'public' ? 'default' : 'outline'}
              onClick={() => setTrackingMode('public')}
              className="bg-green-700 hover:bg-green-600 text-black"
              data-testid="button-public-mode"
            >
              <Eye className="h-4 w-4 mr-2" />
              Public Transparency
            </Button>
            {isAuthenticated && (
              <Button
                variant={trackingMode === 'secure' ? 'default' : 'outline'}
                onClick={() => setTrackingMode('secure')}
                className="bg-red-700 hover:bg-red-600 text-white"
                data-testid="button-secure-mode"
              >
                <Shield className="h-4 w-4 mr-2" />
                Secure Monitoring
              </Button>
            )}
          </div>
        </div>

        {/* Security Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-green-500 border-opacity-50" data-testid="card-active-vehicles">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Active Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {activeVehicles?.length || 0}
              </div>
              <p className="text-xs text-green-300">Live tracking enabled</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-blue-500 border-opacity-50" data-testid="card-public-trips">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Public Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {publicTrips?.length || 0}
              </div>
              <p className="text-xs text-blue-300">Transparent journeys</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-yellow-500 border-opacity-50" data-testid="card-security-events">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-400 text-sm flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {securityStats.total}
              </div>
              <p className="text-xs text-yellow-300">AI monitored</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-500 border-opacity-50" data-testid="card-threat-level">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-400 text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                High Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {securityStats.highThreat}
              </div>
              <p className="text-xs text-red-300">Interpol+ monitoring</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Live Vehicle Tracking */}
          <Card className="bg-gray-900 border-green-500 border-opacity-50">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center" data-testid="title-live-vehicles">
                <Navigation className="h-5 w-5 mr-2" />
                Live Vehicle Locations
              </CardTitle>
              <CardDescription className="text-green-300">
                Real-time tracking of all active vehicles for public safety
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehiclesLoading ? (
                <div className="text-green-300" data-testid="loading-vehicles">Loading vehicles...</div>
              ) : activeVehicles && activeVehicles.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activeVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center justify-between p-3 bg-black border border-green-600 rounded-lg hover:border-green-400 transition-colors cursor-pointer"
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      data-testid={`vehicle-${vehicle.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-green-400">
                          {getVehicleIcon(vehicle.vehicleType)}
                        </div>
                        <div>
                          <div className="font-medium text-green-400">
                            {vehicle.licensePlate}
                          </div>
                          <div className="text-xs text-green-300">
                            {vehicle.vehicleType} • {vehicle.model || 'Unknown Model'}
                          </div>
                          {vehicle.currentLatitude && vehicle.currentLongitude && (
                            <div className="text-xs text-green-300">
                              📍 {parseFloat(vehicle.currentLatitude).toFixed(4)}, {parseFloat(vehicle.currentLongitude).toFixed(4)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge className="bg-green-600 text-black">
                          {vehicle.isActive ? 'ACTIVE' : 'OFFLINE'}
                        </Badge>
                        {vehicle.lastLocationUpdate && (
                          <div className="text-xs text-green-300">
                            Updated: {new Date(vehicle.lastLocationUpdate).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-green-300 text-center py-8" data-testid="no-vehicles">
                  No active vehicles currently tracked
                </div>
              )}
            </CardContent>
          </Card>

          {/* Public Trip Transparency */}
          <Card className="bg-gray-900 border-blue-500 border-opacity-50">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center" data-testid="title-public-trips">
                <Eye className="h-5 w-5 mr-2" />
                Public Trip Transparency
              </CardTitle>
              <CardDescription className="text-blue-300">
                Live view of public trips for community safety and trust
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tripsLoading ? (
                <div className="text-blue-300" data-testid="loading-trips">Loading trips...</div>
              ) : publicTrips && publicTrips.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {publicTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="p-3 bg-black border border-blue-600 rounded-lg"
                      data-testid={`trip-${trip.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          className={`${
                            trip.status === 'in_progress' ? 'bg-green-600' :
                            trip.status === 'requested' ? 'bg-yellow-600' :
                            trip.status === 'completed' ? 'bg-blue-600' :
                            'bg-gray-600'
                          } text-white`}
                        >
                          {trip.status.toUpperCase()}
                        </Badge>
                        <Badge className="bg-purple-600 text-white">
                          {trip.securityLevel}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="text-blue-400">
                          📍 Pickup: {parseFloat(trip.pickupLatitude).toFixed(4)}, {parseFloat(trip.pickupLongitude).toFixed(4)}
                        </div>
                        {trip.dropoffLatitude && trip.dropoffLongitude && (
                          <div className="text-blue-400">
                            🏁 Dropoff: {parseFloat(trip.dropoffLatitude).toFixed(4)}, {parseFloat(trip.dropoffLongitude).toFixed(4)}
                          </div>
                        )}
                        <div className="text-blue-300">
                          Type: {trip.type} • Started: {new Date(trip.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-blue-300 text-center py-8" data-testid="no-trips">
                  No public trips currently active
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Security Events (Authenticated Users Only) */}
        {isAuthenticated && trackingMode === 'secure' && (
          <Card className="bg-gray-900 border-red-500 border-opacity-50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center" data-testid="title-security-events">
                <Shield className="h-5 w-5 mr-2" />
                Enhanced Security Monitoring (Beyond Interpol)
              </CardTitle>
              <CardDescription className="text-red-300">
                AI-powered threat detection and security event monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityEvents && securityEvents.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {securityEvents.slice(0, 10).map((event: SecurityEvent) => (
                    <div
                      key={event.id}
                      className="p-3 bg-black border border-red-600 rounded-lg"
                      data-testid={`security-event-${event.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${getThreatLevelColor(event.threatLevel)} text-white`}>
                          {event.threatLevel.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-red-300">
                          AI Confidence: {event.aiConfidence}%
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="text-red-400 font-medium">
                          {event.eventType.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-red-300">
                          {event.description}
                        </div>
                        {event.actionTaken && (
                          <div className="text-red-200 text-xs">
                            Action: {event.actionTaken}
                          </div>
                        )}
                        <div className="text-red-300 text-xs">
                          {new Date(event.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-red-300 text-center py-8" data-testid="no-security-events">
                  No security events detected
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Feature Highlight */}
        <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500 border-opacity-50">
          <CardHeader>
            <CardTitle className="text-purple-400 text-center" data-testid="title-feature-highlight">
              🚀 Revolutionary Transparency Features
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-purple-300">
              YardFlex provides unprecedented transparency with real-time tracking visible to everyone.
            </p>
            <p className="text-purple-200">
              See exactly where vehicles are going, pickup and dropoff locations, and AI-powered security monitoring
              that exceeds Interpol standards for global safety.
            </p>
            <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
              🛡️ TWICE AS SECURE AS INTERPOL
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}