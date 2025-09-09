import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Users, 
  Settings, 
  Activity,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface WorkArea {
  id: string;
  code: string;
  label: string;
  isLocked: boolean;
  lockedByUserId?: string;
  lockExpiresAt?: string;
}

interface Permission {
  roleCode: string;
  roleLabel: string;
  permissionCode: string;
}

interface Payout {
  id: string;
  driverUserId: string;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function RBACDashboard() {
  const { toast } = useToast();
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [areasRes, permissionsRes, payoutsRes] = await Promise.all([
        apiRequest('GET', '/api/rbac/areas'),
        apiRequest('GET', '/api/rbac/users/me/permissions'),
        apiRequest('GET', '/api/rbac/payouts/pending')
      ]) as [WorkArea[], Permission[], Payout[]];
      
      setWorkAreas(areasRes);
      setUserPermissions(permissionsRes);
      setPendingPayouts(payoutsRes);
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

  const acquireArea = async (areaCode: string) => {
    try {
      setActionLoading(areaCode);
      
      await apiRequest('POST', `/api/rbac/areas/${areaCode}/acquire`, {
        ttlMinutes: 120
      });
      
      toast({
        title: 'Area Acquired',
        description: `Successfully acquired lock on ${areaCode}`,
      });
      
      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: 'Acquire Failed',
        description: error.message || 'Failed to acquire area',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const releaseArea = async (areaCode: string) => {
    try {
      setActionLoading(areaCode);
      
      await apiRequest('POST', `/api/rbac/areas/${areaCode}/release`);
      
      toast({
        title: 'Area Released',
        description: `Successfully released lock on ${areaCode}`,
      });
      
      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: 'Release Failed',
        description: error.message || 'Failed to release area',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const resetArea = async (areaCode: string) => {
    try {
      setActionLoading(areaCode);
      
      await apiRequest('POST', `/api/rbac/areas/${areaCode}/reset`);
      
      toast({
        title: 'Area Reset',
        description: `Successfully reset lock on ${areaCode} (Admin Override)`,
      });
      
      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.message || 'Failed to reset area',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const approvePayout = async (payoutId: string) => {
    try {
      setActionLoading(payoutId);
      
      await apiRequest('POST', `/api/rbac/payouts/${payoutId}/approve`);
      
      toast({
        title: 'Payout Approved',
        description: 'Payout has been approved successfully',
      });
      
      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: 'Approval Failed',
        description: error.message || 'Failed to approve payout',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const rejectPayout = async (payoutId: string) => {
    try {
      setActionLoading(payoutId);
      
      await apiRequest('POST', `/api/rbac/payouts/${payoutId}/reject`, {
        reason: 'Manual rejection via dashboard'
      });
      
      toast({
        title: 'Payout Rejected',
        description: 'Payout has been rejected',
      });
      
      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: 'Rejection Failed',
        description: error.message || 'Failed to reject payout',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const seedRBACSystem = async () => {
    try {
      setActionLoading('seed');
      
      const result = await apiRequest('POST', '/api/rbac/seed') as { success: boolean; message: string };
      
      if (result.success) {
        toast({
          title: 'RBAC System Seeded',
          description: result.message,
        });
        await loadDashboardData();
      }
    } catch (error: any) {
      toast({
        title: 'Seed Failed',
        description: error.message || 'Failed to seed RBAC system',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const canAccessArea = (areaCode: string) => {
    return userPermissions.some(p => 
      p.permissionCode === `area:${areaCode}` || 
      p.permissionCode === 'area:*'
    );
  };

  const canResetAreas = () => {
    return userPermissions.some(p => p.permissionCode === 'area:reset');
  };

  const canApprovePayouts = () => {
    return userPermissions.some(p => p.permissionCode === 'payout:approve');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 animate-pulse" />
          <p className="text-lg font-medium mt-4 text-gray-900 dark:text-white">Loading RBAC Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              YaadFlex RBAC Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Role-Based Access Control & Area Locking System
            </p>
          </div>
          
          <Button 
            onClick={seedRBACSystem}
            disabled={actionLoading === 'seed'}
            variant="outline"
          >
            <Settings className="w-4 h-4 mr-2" />
            {actionLoading === 'seed' ? 'Seeding...' : 'Seed RBAC'}
          </Button>
        </div>

        {/* User Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              My Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userPermissions.map((permission, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {permission.roleLabel}: {permission.permissionCode}
                </Badge>
              ))}
              {userPermissions.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No permissions assigned</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Work Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workAreas.map((area) => {
            const hasAccess = canAccessArea(area.code);
            const isLocked = area.isLocked;
            const lockExpired = area.lockExpiresAt && new Date(area.lockExpiresAt) < new Date();
            
            return (
              <Card key={area.id} className={`${isLocked ? 'border-orange-200 dark:border-orange-800' : ''}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span className="truncate">{area.label}</span>
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Unlock className="w-4 h-4 text-green-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Code: {area.code}
                  </div>
                  
                  {isLocked && (
                    <Alert className="py-2">
                      <AlertTriangle className="h-3 w-3" />
                      <AlertDescription className="text-xs">
                        Locked{area.lockedByUserId ? ` by user ${area.lockedByUserId.slice(0, 8)}...` : ''}
                        {area.lockExpiresAt && (
                          <div className="mt-1">
                            Expires: {new Date(area.lockExpiresAt).toLocaleString()}
                            {lockExpired && <span className="text-red-600 ml-1">(EXPIRED)</span>}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex gap-2">
                    {hasAccess && !isLocked && (
                      <Button 
                        size="sm" 
                        onClick={() => acquireArea(area.code)}
                        disabled={actionLoading === area.code}
                        className="flex-1"
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        {actionLoading === area.code ? 'Acquiring...' : 'Acquire'}
                      </Button>
                    )}
                    
                    {hasAccess && isLocked && area.lockedByUserId && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => releaseArea(area.code)}
                        disabled={actionLoading === area.code}
                        className="flex-1"
                      >
                        <Unlock className="w-3 h-3 mr-1" />
                        {actionLoading === area.code ? 'Releasing...' : 'Release'}
                      </Button>
                    )}
                    
                    {canResetAreas() && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => resetArea(area.code)}
                        disabled={actionLoading === area.code}
                      >
                        <Activity className="w-3 h-3 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>
                  
                  {!hasAccess && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      No access permission
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pending Payouts */}
        {canApprovePayouts() && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pending Payouts ({pendingPayouts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingPayouts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No pending payouts</p>
              ) : (
                <div className="space-y-3">
                  {pendingPayouts.slice(0, 5).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          ${(payout.amountCents / 100).toFixed(2)} {payout.currency}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Driver: {payout.driverUserId.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(payout.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => approvePayout(payout.id)}
                          disabled={actionLoading === payout.id}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => rejectPayout(payout.id)}
                          disabled={actionLoading === payout.id}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}