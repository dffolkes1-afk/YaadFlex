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
    <Card className="card-elegant h-full" data-testid="widget-stats">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{stats?.countries || 195}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Countries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">{stats?.uptime || '99.99%'}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{stats?.activeDefenses || 47}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Defenses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{stats?.threatsBlocked || 1247}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Blocked</p>
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
    <Card className="card-elegant h-full" data-testid="widget-wallet">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-semibold text-foreground">JMD {totalBalance.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Available Balance</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 btn-primary">
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
          <Button size="sm" variant="outline" className="flex-1 btn-secondary">
            <DollarSign className="h-3 w-3 mr-1" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsWidget({ widget }: { widget: DashboardWidget }) {
  return (
    <Card className="card-elegant h-full" data-testid="widget-quick-actions">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
          <Zap className="h-4 w-4 text-muted-foreground" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button size="sm" variant="outline" className="w-full justify-start btn-secondary">
            <Car className="h-3 w-3 mr-2 text-muted-foreground" />
            Book Ride
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start btn-secondary">
            <ShoppingBag className="h-3 w-3 mr-2 text-muted-foreground" />
            Marketplace
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start btn-secondary">
            <MessageCircle className="h-3 w-3 mr-2 text-muted-foreground" />
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
    <Card className="card-elegant h-full" data-testid="widget-marketplace">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Your Listings</span>
          <Badge variant="secondary" className="badge">{myListings?.length || 0}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xl font-semibold text-foreground">0</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Active</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground">0</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Views</p>
          </div>
        </div>
        <Button size="sm" className="w-full btn-primary">
          <Plus className="h-3 w-3 mr-2" />
          New Listing
        </Button>
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
    <Card className="card-elegant h-full" data-testid="widget-recent-activity">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
          <Activity className="h-4 w-4 text-muted-foreground" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            recentTransactions.map((transaction: any) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 border border-border rounded bg-card">
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction.type}</p>
                  <p className="text-xs text-muted-foreground">{transaction.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{transaction.amount} {transaction.currency}</p>
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="badge-success text-xs">
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
    <Card className="card-elegant h-full" data-testid="widget-notifications">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 border border-border rounded bg-card">
            <Shield className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Welcome to YaadFlex</p>
              <p className="text-xs text-muted-foreground">Complete your profile to get started</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 border border-border rounded bg-card">
            <Globe className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Marketplace Ready</p>
              <p className="text-xs text-muted-foreground">Start buying and selling</p>
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display-md text-foreground flex items-center gap-3" data-testid="text-dashboard-title">
              <LayoutDashboard className="h-7 w-7 text-primary" />
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              Welcome back, {user.firstName || user.email}. Your personalized YaadFlex overview.
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant={editMode ? "default" : "outline"}
              size="sm"
              onClick={() => setEditMode(!editMode)}
              data-testid="button-edit-mode"
              className="transition-smooth"
            >
              <Settings className="h-4 w-4 mr-2" />
              {editMode ? 'Done' : 'Customize'}
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Overview</TabsTrigger>
            <TabsTrigger value="widgets" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Widget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {widgets.map(widget => (
                <div key={widget.id} className="relative transition-smooth">
                  {editMode && (
                    <div className="absolute -top-2 -right-2 z-10 flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 btn-secondary"
                        onClick={() => toggleWidgetVisibility(widget.id)}
                        data-testid={`button-toggle-${widget.id}`}
                      >
                        {widget.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 cursor-move btn-secondary"
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
            <Card className="card-elegant">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-sm text-foreground">All systems operational</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Updated: {new Date().toLocaleTimeString()}</span>
                    <Badge variant="outline" className="badge text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Secure
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="text-foreground">Widget Configuration</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Customize which widgets appear on your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {widgets.map(widget => (
                    <div key={widget.id} className="flex items-center justify-between p-4 border border-border rounded bg-card">
                      <div>
                        <h4 className="font-medium text-foreground">{widget.title}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{widget.type.replace('_', ' ')}</p>
                      </div>
                      <Button
                        variant={widget.visible ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleWidgetVisibility(widget.id)}
                        data-testid={`button-config-${widget.id}`}
                        className={widget.visible ? 'btn-primary' : 'btn-secondary'}
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