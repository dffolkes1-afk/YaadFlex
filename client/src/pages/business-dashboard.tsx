import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Store, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  CreditCard,
  Calendar,
  PieChart,
  Download,
  Settings,
  Bell
} from 'lucide-react';

type BusinessCommission = {
  id: string;
  requestId: string;
  jobTotal: string;
  commissionRate: string;
  commissionAmount: string;
  workerEarnings: string;
  paymentStatus: string;
  processedAt: string;
};

type BusinessStats = {
  totalEarnings: string;
  totalCommissions: string;
  pendingPayments: string;
  completedJobs: number;
  customerCount: number;
  commissionRate: string;
};

export default function BusinessDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Fetch business stats
  const { data: businessStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/business/stats', selectedPeriod],
    enabled: !!user,
    retry: false,
  });

  // Fetch commission history
  const { data: commissions, isLoading: commissionsLoading } = useQuery({
    queryKey: ['/api/business/commissions', selectedPeriod],
    enabled: !!user,
    retry: false,
  });

  // Update commission rate
  const updateCommissionMutation = useMutation({
    mutationFn: async (data: { rate: number }) => {
      return await apiRequest("PUT", "/api/business/commission-rate", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Commission rate updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/business/stats'] });
    },
    onError: (error) => {
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
        title: "Error",
        description: "Failed to update commission rate. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please log in to access your business dashboard.</p>
            <Button asChild className="w-full">
              <Link href="/api/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats: BusinessStats = businessStats as BusinessStats || {
    totalEarnings: "0.00",
    totalCommissions: "0.00", 
    pendingPayments: "0.00",
    completedJobs: 0,
    customerCount: 0,
    commissionRate: "15.00"
  };

  const commissionList: BusinessCommission[] = (commissions as BusinessCommission[]) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/10 via-background to-yellow-900/10">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Store className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-foreground" data-testid="business-title">
                  Business Dashboard
                </h1>
                <p className="text-sm text-muted-foreground" data-testid="business-subtitle">
                  Manage your YaadFlex business and track earnings
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32" data-testid="period-selector">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" data-testid="button-notifications">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" data-testid="button-settings">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20" data-testid="card-total-earnings">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="text-total-earnings">
                J${stats.totalEarnings}
              </div>
              <p className="text-xs text-muted-foreground">
                After YaadFlex commission
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20" data-testid="card-yaad-commission">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                YaadFlex Commission
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="text-yaad-commission">
                J${stats.totalCommissions}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.commissionRate}% platform fee
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20" data-testid="card-pending-payments">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Payments
              </CardTitle>
              <CreditCard className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600" data-testid="text-pending-payments">
                J${stats.pendingPayments}
              </div>
              <p className="text-xs text-muted-foreground">
                Being processed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20" data-testid="card-customers">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Customers
              </CardTitle>
              <Users className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600" data-testid="text-customer-count">
                {stats.customerCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.completedJobs} jobs completed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Commission History */}
          <div className="lg:col-span-2">
            <Card data-testid="card-commission-history">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Commission History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {commissionsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : commissionList.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No commission records yet</p>
                      <p className="text-sm">Start selling to see your earnings here!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {commissionList.map((commission, index) => (
                      <div key={commission.id || index} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`commission-${index}`}>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant={commission.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                              {commission.paymentStatus}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(commission.processedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Job Total: J${commission.jobTotal}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600" data-testid={`earnings-${index}`}>
                            J${commission.workerEarnings}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Commission: J${commission.commissionAmount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full" data-testid="button-business-registration">
                  <Link href="/business-registration">
                    <Store className="w-4 h-4 mr-2" />
                    Update Business Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" data-testid="button-view-analytics">
                  <PieChart className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full" data-testid="button-download-reports">
                  <Download className="w-4 h-4 mr-2" />
                  Download Reports
                </Button>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="commission-rate">Commission Rate</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="commission-rate"
                      type="number"
                      value={stats.commissionRate}
                      onChange={(e) => {
                        if (e.target.value !== stats.commissionRate) {
                          updateCommissionMutation.mutate({ rate: parseFloat(e.target.value) });
                        }
                      }}
                      min="0"
                      max="50"
                      step="0.5"
                      data-testid="input-commission-rate"
                    />
                    <span className="flex items-center text-sm text-muted-foreground">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current YaadFlex platform commission rate
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-yellow-500/10 border-green-500/20" data-testid="card-earnings-info">
              <CardHeader>
                <CardTitle className="text-green-600">💰 Your Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">You keep:</span>
                    <span className="font-semibold text-green-600">
                      {(100 - parseFloat(stats.commissionRate)).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">YaadFlex fee:</span>
                    <span className="font-semibold text-blue-600">
                      {stats.commissionRate}%
                    </span>
                  </div>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    <strong>No hidden fees!</strong> This is the only cost for using YaadFlex.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}