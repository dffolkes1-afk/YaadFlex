import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Truck, 
  MapPin, 
  DollarSign, 
  Clock,
  Package,
  Phone,
  Navigation,
  Star,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface DeliveryPersonnelStats {
  totalDeliveries: number;
  totalEarnings: number;
  averageRating: number;
  activeOrders: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
}

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  deliveryType: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupLat: string;
  pickupLng: string;
  deliveryLat: string;
  deliveryLng: string;
  deliveryContactName: string;
  deliveryContactPhone: string;
  pickupContactName?: string;
  pickupContactPhone?: string;
  items: any[];
  deliveryFee: string;
  priority: string;
  pickupInstructions?: string;
  deliveryInstructions?: string;
  createdAt: string;
  acceptedAt?: string;
  customerName: string;
}

interface PersonnelProfile {
  id: string;
  deliveryTypes: string[];
  vehicleType: string;
  phoneNumber: string;
  isActive: boolean;
  isOnline: boolean;
  totalDeliveries: number;
  totalEarnings: string;
  rating: string;
  firstName: string;
  lastName: string;
  email: string;
  stats: DeliveryPersonnelStats;
}

export default function DeliveryPersonnelDashboard() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<PersonnelProfile | null>(null);
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [profileResponse, ordersResponse] = await Promise.all([
        apiRequest('GET', '/api/delivery/personnel/me'),
        apiRequest('GET', '/api/delivery/personnel/orders')
      ]);
      
      const profileRes = await profileResponse.json() as PersonnelProfile;
      const ordersRes = await ordersResponse.json() as DeliveryOrder[];
      
      setProfile(profileRes);
      setOrders(ordersRes);
    } catch (error: any) {
      toast({
        title: 'Load Failed',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOnlineStatus = async (isOnline: boolean) => {
    try {
      await apiRequest('PUT', '/api/delivery/personnel/status', { isOnline });
      
      setProfile(prev => prev ? { ...prev, isOnline } : null);
      
      toast({
        title: isOnline ? 'Now Online' : 'Now Offline',
        description: isOnline 
          ? 'You will receive new delivery requests' 
          : 'You will not receive new delivery requests',
      });
    } catch (error: any) {
      toast({
        title: 'Status Update Failed',
        description: error.message || 'Failed to update online status',
        variant: 'destructive'
      });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      
      await apiRequest('PUT', `/api/delivery/orders/${orderId}/status`, {
        status: newStatus
      });
      
      // Reload orders to get updated data
      await loadDashboardData();
      
      toast({
        title: 'Status Updated',
        description: `Order marked as ${newStatus.replace('_', ' ')}`,
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update order status',
        variant: 'destructive'
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openMapsNavigation = (lat: string, lng: string, address: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-orange-100 text-orange-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-gray-600';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Truck className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 animate-pulse" />
          <p className="text-lg font-medium mt-4 text-gray-900 dark:text-white">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Not Registered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You are not registered as delivery personnel. Please contact support to get registered.
            </p>
            <Button onClick={() => window.location.href = '/delivery-registration'} className="w-full">
              Register as Delivery Personnel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeOrders = orders.filter(o => ['accepted', 'picked_up', 'in_transit'].includes(o.status));
  const completedToday = orders.filter(o => 
    o.status === 'delivered' && 
    new Date(o.acceptedAt || o.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              Delivery Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              BlackRock YaadFlex Operations Dashboard
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {profile.isOnline ? 'Online' : 'Offline'}
              </span>
              <Switch 
                checked={profile.isOnline}
                onCheckedChange={updateOnlineStatus}
              />
            </div>
            <Badge variant="outline" className="text-sm">
              <Star className="w-3 h-3 mr-1" />
              {Number(profile.rating).toFixed(1)}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Today's Earnings</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${profile.stats.todayEarnings.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {completedToday} deliveries completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Orders</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {profile.stats.activeOrders}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                In progress deliveries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.stats.totalDeliveries}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All time completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Earnings</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${profile.stats.weeklyEarnings.toFixed(2)}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This week's total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Active Deliveries ({activeOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{order.orderNumber}</span>
                          <Badge className={`text-xs ${getStatusBadgeColor(order.status)}`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className={`text-sm font-medium ${getPriorityColor(order.priority)}`}>
                            {order.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {order.deliveryType} • ${order.deliveryFee} • {order.customerName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Pickup Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Pickup</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                          {order.pickupAddress}
                        </p>
                        {order.pickupContactName && (
                          <div className="flex items-center gap-2 pl-6">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {order.pickupContactName}
                            </span>
                            {order.pickupContactPhone && (
                              <a href={`tel:${order.pickupContactPhone}`} className="text-xs text-blue-600 hover:underline">
                                {order.pickupContactPhone}
                              </a>
                            )}
                          </div>
                        )}
                        {order.pickupInstructions && (
                          <p className="text-xs text-gray-500 pl-6 italic">
                            "{order.pickupInstructions}"
                          </p>
                        )}
                      </div>

                      {/* Delivery Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">Delivery</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                          {order.deliveryAddress}
                        </p>
                        <div className="flex items-center gap-2 pl-6">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {order.deliveryContactName}
                          </span>
                          <a href={`tel:${order.deliveryContactPhone}`} className="text-xs text-blue-600 hover:underline">
                            {order.deliveryContactPhone}
                          </a>
                        </div>
                        {order.deliveryInstructions && (
                          <p className="text-xs text-gray-500 pl-6 italic">
                            "{order.deliveryInstructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                      <span className="text-sm font-medium">Items:</span>
                      <div className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        {order.items.map((item: any, index: number) => (
                          <span key={index}>
                            {item.name || item.description || 'Item'} {item.quantity && `x${item.quantity}`}
                            {index < order.items.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {order.status === 'accepted' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateOrderStatus(order.id, 'picked_up')}
                            disabled={updatingStatus === order.id}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Picked Up
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openMapsNavigation(order.pickupLat, order.pickupLng, order.pickupAddress)}
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Navigate to Pickup
                          </Button>
                        </>
                      )}

                      {order.status === 'picked_up' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateOrderStatus(order.id, 'in_transit')}
                            disabled={updatingStatus === order.id}
                          >
                            <Truck className="w-3 h-3 mr-1" />
                            Start Delivery
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openMapsNavigation(order.deliveryLat, order.deliveryLng, order.deliveryAddress)}
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Navigate to Delivery
                          </Button>
                        </>
                      )}

                      {order.status === 'in_transit' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            disabled={updatingStatus === order.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Delivered
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openMapsNavigation(order.deliveryLat, order.deliveryLng, order.deliveryAddress)}
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Navigate
                          </Button>
                        </>
                      )}

                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`tel:${order.deliveryContactPhone}`)}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call Customer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No orders assigned yet. Make sure you're online to receive new orders!
              </p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{order.orderNumber}</span>
                        <Badge className={`text-xs ${getStatusBadgeColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {order.deliveryType} • ${order.deliveryFee} • {order.customerName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}