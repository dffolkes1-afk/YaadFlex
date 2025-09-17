import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Settings, 
  Move, 
  Plus, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Wallet, 
  ShoppingBag, 
  Car, 
  MessageCircle, 
  Bell,
  Activity,
  DollarSign,
  Users,
  Globe,
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type DashboardWidget = {
  id: string;
  type: 'stats' | 'quick_actions' | 'recent_activity' | 'marketplace' | 'wallet' | 'notifications';
  title: string;
  position: { x: number; y: number; width: number; height: number };
  visible: boolean;
  data?: any;
};

type UserDashboardPrefs = {
  userId: string;
  widgets: DashboardWidget[];
  theme: 'light' | 'dark' | 'auto';
  lastUpdated: string;
};

const defaultWidgets: DashboardWidget[] = [
  {
    id: 'stats',
    type: 'stats',
    title: 'Quick Stats',
    position: { x: 0, y: 0, width: 2, height: 1 },
    visible: true
  },
  {
    id: 'wallet',
    type: 'wallet',
    title: 'YaadFlex Wallet',
    position: { x: 2, y: 0, width: 2, height: 1 },
    visible: true
  },
  {
    id: 'quick_actions',
    type: 'quick_actions',
    title: 'Quick Actions',
    position: { x: 0, y: 1, width: 1, height: 1 },
    visible: true
  },
  {
    id: 'marketplace',
    type: 'marketplace',
    title: 'Marketplace Activity',
    position: { x: 1, y: 1, width: 2, height: 1 },
    visible: true
  },
  {
    id: 'recent_activity',
    type: 'recent_activity',
    title: 'Recent Activity',
    position: { x: 3, y: 1, width: 1, height: 2 },
    visible: true
  },
  {
    id: 'notifications',
    type: 'notifications',
    title: 'Notifications',
    position: { x: 0, y: 2, width: 3, height: 1 },
    visible: true
  }
];

function StatsWidget({ widget }: { widget: DashboardWidget }) {
  const { data: stats } = useQuery<any>({
    queryKey: ['/api/stats/global'],
    retry: false,
  });

  return (
    <Card className="h-full" data-testid="widget-stats">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-2xl font-bold text-emerald-600">{stats?.countries || 195}</p>
            <p className="text-muted-foreground">Countries</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{stats?.uptime || '99.99%'}</p>
            <p className="text-muted-foreground">Uptime</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{stats?.activeDefenses || 47}</p>
            <p className="text-muted-foreground">Active Defenses</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{stats?.threatsBlocked || 1247}</p>
            <p className="text-muted-foreground">Threats Blocked</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WalletWidget({ widget }: { widget: DashboardWidget }) {
  const { data: wallets } = useQuery<any[]>({
    queryKey: ['/api/wallets'],
    retry: false,
  });

  const totalBalance = wallets?.reduce((sum: number, wallet: any) => 
    sum + parseFloat(wallet.balance || '0'), 0
  ) || 0;

  return (
    <Card className="h-full" data-testid="widget-wallet">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wallet className="h-4 w-4 text-emerald-600" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold">JMD {totalBalance.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Balance</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Plus className="h-3 w-3 mr-1" />
              Add Money
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <DollarSign className="h-3 w-3 mr-1" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsWidget({ widget }: { widget: DashboardWidget }) {
  return (
    <Card className="h-full" data-testid="widget-quick-actions">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-600" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Button size="sm" variant="outline" className="justify-start">
            <Car className="h-3 w-3 mr-2" />
            Book Ride
          </Button>
          <Button size="sm" variant="outline" className="justify-start">
            <ShoppingBag className="h-3 w-3 mr-2" />
            Marketplace
          </Button>
          <Button size="sm" variant="outline" className="justify-start">
            <MessageCircle className="h-3 w-3 mr-2" />
            CB Radio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MarketplaceWidget({ widget }: { widget: DashboardWidget }) {
  const { data: myListings } = useQuery<any[]>({
    queryKey: ['/api/marketplace/my-listings'],
    retry: false,
  });

  return (
    <Card className="h-full" data-testid="widget-marketplace">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-blue-600" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Your Listings</span>
            <Badge variant="secondary">{myListings?.length || 0}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-lg font-semibold">0</p>
              <p className="text-muted-foreground">Active</p>
            </div>
            <div>
              <p className="text-lg font-semibold">0</p>
              <p className="text-muted-foreground">Views</p>
            </div>
          </div>
          <Button size="sm" className="w-full">
            <Plus className="h-3 w-3 mr-1" />
            Add Listing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivityWidget({ widget }: { widget: DashboardWidget }) {
  const { data: transactions } = useQuery<any[]>({
    queryKey: ['/api/transactions'],
    retry: false,
  });

  const recentTransactions = transactions?.slice(0, 3) || [];

  return (
    <Card className="h-full" data-testid="widget-recent-activity">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-purple-600" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            recentTransactions.map((transaction: any) => (
              <div key={transaction.id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                <div>
                  <p className="text-xs font-medium">{transaction.type}</p>
                  <p className="text-xs text-muted-foreground">{transaction.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{transaction.amount} {transaction.currency}</p>
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsWidget({ widget }: { widget: DashboardWidget }) {
  return (
    <Card className="h-full" data-testid="widget-notifications">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bell className="h-4 w-4 text-orange-600" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Shield className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Welcome to YaadFlex!</p>
              <p className="text-xs text-muted-foreground">Complete your profile to get started</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950 rounded-lg">
            <Globe className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-sm font-medium">Marketplace Ready</p>
              <p className="text-xs text-muted-foreground">Start buying and selling on YaadFlex</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets);
  const [editMode, setEditMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Load user dashboard preferences
  useEffect(() => {
    const savedPrefs = localStorage.getItem(`dashboard_prefs_${user?.id}`);
    if (savedPrefs) {
      try {
        const prefs: UserDashboardPrefs = JSON.parse(savedPrefs);
        setWidgets(prefs.widgets);
      } catch (error) {
        console.log('Failed to load dashboard preferences, using defaults');
      }
    }
  }, [user?.id]);

  // Save dashboard preferences
  const savePreferences = (newWidgets: DashboardWidget[]) => {
    if (!user?.id) return;
    
    const prefs: UserDashboardPrefs = {
      userId: user.id,
      widgets: newWidgets,
      theme: 'auto',
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(`dashboard_prefs_${user.id}`, JSON.stringify(prefs));
    setWidgets(newWidgets);
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    const newWidgets = widgets.map(widget => 
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    );
    savePreferences(newWidgets);
  };

  const renderWidget = (widget: DashboardWidget) => {
    if (!widget.visible) return null;

    const widgetProps = { widget };

    switch (widget.type) {
      case 'stats':
        return <StatsWidget {...widgetProps} />;
      case 'wallet':
        return <WalletWidget {...widgetProps} />;
      case 'quick_actions':
        return <QuickActionsWidget {...widgetProps} />;
      case 'marketplace':
        return <MarketplaceWidget {...widgetProps} />;
      case 'recent_activity':
        return <RecentActivityWidget {...widgetProps} />;
      case 'notifications':
        return <NotificationsWidget {...widgetProps} />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please sign in to access your dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3" data-testid="text-dashboard-title">
              <LayoutDashboard className="h-8 w-8 text-emerald-600" />
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.firstName || user.email}! Here's your personalized YaadFlex overview.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={editMode ? "default" : "outline"} 
              onClick={() => setEditMode(!editMode)}
              data-testid="button-edit-mode"
            >
              <Settings className="h-4 w-4 mr-2" />
              {editMode ? 'Done Editing' : 'Customize'}
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="widgets">Widget Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Widget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {widgets.map(widget => (
                <div key={widget.id} className="relative">
                  {editMode && (
                    <div className="absolute -top-2 -right-2 z-10 flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleWidgetVisibility(widget.id)}
                        data-testid={`button-toggle-${widget.id}`}
                      >
                        {widget.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 cursor-move"
                        data-testid={`button-move-${widget.id}`}
                      >
                        <Move className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {renderWidget(widget)}
                </div>
              ))}
            </div>

            {/* System Status Footer */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">All YaadFlex systems operational</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Secure
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget Configuration</CardTitle>
                <CardDescription>
                  Customize which widgets appear on your dashboard and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {widgets.map(widget => (
                    <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{widget.title}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{widget.type.replace('_', ' ')} widget</p>
                      </div>
                      <Button
                        variant={widget.visible ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleWidgetVisibility(widget.id)}
                        data-testid={`button-config-${widget.id}`}
                      >
                        {widget.visible ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                        {widget.visible ? 'Visible' : 'Hidden'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}