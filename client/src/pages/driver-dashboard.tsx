import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Radio,
  Navigation,
  Activity,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react';

type Assignment = {
  id: string;
  tripId: string;
  assignedDriverId: string;
  zoneId: string;
  assignmentMethod: string;
  algorithmScore: string;
  distanceToPickup: string;
  driverWorkloadScore: string;
  priorityLevel: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  assignedAt: string;
  respondedAt?: string;
};

type Trip = {
  id: string;
  riderId: string;
  type: 'ride' | 'delivery' | 'package';
  status: string;
  pickupLatitude: string;
  pickupLongitude: string;
  pickupAddress?: string;
  dropoffLatitude?: string;
  dropoffLongitude?: string;
  dropoffAddress?: string;
  estimatedFare?: string;
  distance?: string;
  duration?: number;
};

type DriverStats = {
  totalTrips: number;
  completedTrips: number;
  totalEarnings: number;
  averageRating: number;
  acceptanceRate: number;
  todayEarnings: number;
  weeklyEarnings: number;
  fleetType: 'lipstick' | 'shadow';
  plateType: 'red' | 'white';
};

export default function DriverDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(false);

  // Fetch pending assignments (automatic, no cherry-picking!)
  const { data: pendingAssignments, isLoading: assignmentsLoading } = useQuery<Assignment[]>({
    queryKey: ['/api/drivers/assignments/pending'],
    enabled: isAuthenticated,
    refetchInterval: 3000, // Real-time assignment updates
    retry: false,
  });

  // Fetch driver stats
  const { data: driverStats, isLoading: statsLoading } = useQuery<DriverStats>({
    queryKey: ['/api/drivers/stats'],
    enabled: isAuthenticated,
    refetchInterval: 30000, // Update every 30 seconds
    retry: false,
  });

  // Accept assignment mutation
  const acceptAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const response = await apiRequest('POST', `/api/drivers/assignments/${assignmentId}/accept`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "🚗 Assignment Accepted!",
        description: "Navigate to pickup location. Trip started!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/drivers/assignments/pending'] });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Assignment Failed",
        description: error.message || "Unable to accept assignment",
        variant: "destructive",
      });
    },
  });

  // Toggle online status
  const toggleOnlineMutation = useMutation({
    mutationFn: async (online: boolean) => {
      const response = await apiRequest('POST', '/api/drivers/status', { isOnline: online });
      return response.json();
    },
    onSuccess: (data) => {
      setIsOnline(data.isOnline);
      toast({
        title: data.isOnline ? "🟢 You're Online!" : "🔴 You're Offline",
        description: data.isOnline ? "Ready to receive trip assignments" : "No new assignments will be sent",
      });
    },
  });

  const handleAcceptAssignment = (assignmentId: string) => {
    acceptAssignmentMutation.mutate(assignmentId);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Driver Login Required</h2>
            <p className="text-muted-foreground mb-6">Please log in to access your driver dashboard</p>
            <Button onClick={() => window.location.href = "/api/login"}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent mb-2">
            🚗 YaadFlex Driver Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            {driverStats?.fleetType === 'lipstick' ? '💄 Lipstick Fleet' : '👻 Shadow Fleet'} • 
            {driverStats?.plateType === 'red' ? ' Red Plate' : ' White Plate'} Driver
          </p>
          
          {/* Online Status Toggle */}
          <div className="flex justify-center items-center gap-4">
            <Button
              variant={isOnline ? "destructive" : "default"}
              onClick={() => toggleOnlineMutation.mutate(!isOnline)}
              className={isOnline ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              data-testid="button-toggle-online"
            >
              {isOnline ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Go Offline
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Go Online
                </>
              )}
            </Button>
            <Badge className={isOnline ? "bg-green-600" : "bg-red-600"}>
              {isOnline ? "🟢 ONLINE" : "🔴 OFFLINE"}
            </Badge>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card data-testid="card-today-earnings">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-600 text-sm flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Today's Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${driverStats?.todayEarnings || 0} JMD
              </div>
              <p className="text-xs text-muted-foreground">85% driver share</p>
            </CardContent>
          </Card>

          <Card data-testid="card-weekly-earnings">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-600 text-sm flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${driverStats?.weeklyEarnings || 0} JMD
              </div>
              <p className="text-xs text-muted-foreground">Week total</p>
            </CardContent>
          </Card>

          <Card data-testid="card-completed-trips">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-600 text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {driverStats?.completedTrips || 0}
              </div>
              <p className="text-xs text-muted-foreground">Total: {driverStats?.totalTrips || 0}</p>
            </CardContent>
          </Card>

          <Card data-testid="card-acceptance-rate">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-600 text-sm flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Acceptance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {driverStats?.acceptanceRate || 0}%
              </div>
              <p className="text-xs text-muted-foreground">Auto-assigned trips</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pending Assignments - No Cherry Picking! */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="title-pending-assignments">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Pending Assignments (Auto-Assigned)
              </CardTitle>
              <CardDescription>
                System automatically assigns trips - accept within 30 seconds or assignment moves to next driver
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignmentsLoading ? (
                <div className="text-muted-foreground" data-testid="loading-assignments">Loading assignments...</div>
              ) : pendingAssignments && pendingAssignments.length > 0 ? (
                <div className="space-y-3">
                  {pendingAssignments.map((assignment) => (
                    <Card key={assignment.id} className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-yellow-600 text-white">
                            AUTO-ASSIGNED
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Priority: {assignment.priorityLevel}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                            <span>Distance to pickup: {parseFloat(assignment.distanceToPickup).toFixed(1)} km</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span>Algorithm score: {parseFloat(assignment.algorithmScore).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span>Assigned: {new Date(assignment.assignedAt).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={() => handleAcceptAssignment(assignment.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={acceptAssignmentMutation.isPending}
                            data-testid={`button-accept-${assignment.id}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Assignment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" data-testid="no-assignments">
                  <div className="text-muted-foreground mb-2">No pending assignments</div>
                  <div className="text-sm text-muted-foreground">
                    {isOnline ? "Waiting for system to assign trips..." : "Go online to receive assignments"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fleet Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="title-fleet-info">
                <Car className="h-5 w-5" />
                Your Fleet Assignment
              </CardTitle>
              <CardDescription>
                Your automatic assignment profile and operating zones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Fleet Type */}
              <div className={`p-4 rounded-lg ${driverStats?.fleetType === 'lipstick' ? 'bg-red-50 dark:bg-red-950/20 border border-red-200' : 'bg-gray-50 dark:bg-gray-950/20 border border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">
                    {driverStats?.fleetType === 'lipstick' ? '💄' : '👻'}
                  </div>
                  <div>
                    <div className="font-medium">
                      {driverStats?.fleetType === 'lipstick' ? 'Lipstick Fleet' : 'Shadow Fleet'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {driverStats?.plateType === 'red' ? 'Red Plate' : 'White Plate'} Vehicle
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {driverStats?.fleetType === 'lipstick' 
                    ? 'Operating openly in municipal/city areas. Main public face of YaadFlex.'
                    : 'Selective operation in upscale and rural areas. Exclusive access driver.'
                  }
                </div>
              </div>

              {/* Operating Zones */}
              <div>
                <div className="font-medium mb-2">Authorized Operating Zones</div>
                <div className="grid grid-cols-2 gap-2">
                  {driverStats?.fleetType === 'lipstick' ? (
                    <>
                      <Badge variant="secondary">Downtown Kingston</Badge>
                      <Badge variant="secondary">Spanish Town</Badge>
                      <Badge variant="secondary">May Pen</Badge>
                      <Badge variant="secondary">Municipal Areas</Badge>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary">Hope Pastures</Badge>
                      <Badge variant="secondary">Stony Hill</Badge>
                      <Badge variant="secondary">Blue Mountains</Badge>
                      <Badge variant="secondary">Rural Areas</Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Assignment Algorithm Info */}
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="font-medium text-blue-700 dark:text-blue-300">
                      🤖 How Assignment Works:
                    </div>
                    <div className="space-y-1 text-blue-600 dark:text-blue-400">
                      <div>• System assigns based on distance & workload</div>
                      <div>• No cherry-picking - fair distribution</div>
                      <div>• Multiple errands grouped automatically</div>
                      <div>• 30-second acceptance window</div>
                      <div>• Rejection affects acceptance rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex-col">
                <Radio className="h-6 w-6 mb-2" />
                CB Radio
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <MapPin className="h-6 w-6 mb-2" />
                Navigation
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <DollarSign className="h-6 w-6 mb-2" />
                Earnings
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Activity className="h-6 w-6 mb-2" />
                Trip History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}