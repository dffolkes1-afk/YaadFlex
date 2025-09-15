import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import {
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Calendar as CalendarIcon,
  Shield,
  Cpu,
  BarChart3,
  Rocket,
  CheckCircle,
  XCircle,
  Clock,
  Bell,
  Target,
  Activity,
  Users,
  Car,
  Plane,
  Building2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { FareRulesToggle } from '@/components/FareRulesToggle';

interface BusinessExpense {
  id: string;
  category: string;
  name: string;
  provider: string;
  amount: string;
  currency: string;
  frequency: string;
  nextDueDate: string;
  lastPaidDate?: string;
  autoRenewal: boolean;
  isActive: boolean;
  status: 'upcoming' | 'overdue' | 'paid' | 'cancelled';
  description?: string;
}

interface AiAdvisoryReport {
  id: string;
  advisorType: 'risk' | 'tech' | 'finance' | 'growth';
  reportType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  summary: string;
  recommendations: string[];
  status: 'unread' | 'read' | 'action_taken' | 'dismissed';
  actionRequired: boolean;
  generatedAt: string;
}

interface BusinessGoal {
  id: string;
  goalType: string;
  name: string;
  targetValue: string;
  currentValue: string;
  unit: string;
  targetDate: string;
  status: 'in_progress' | 'achieved' | 'overdue' | 'cancelled';
}

const advisorIcons = {
  risk: Shield,
  tech: Cpu,
  finance: BarChart3,
  growth: Rocket,
};

const advisorColors = {
  risk: 'bg-red-500/10 text-red-600 dark:text-red-400',
  tech: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  finance: 'bg-green-500/10 text-green-600 dark:text-green-400',
  growth: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

const categoryIcons = {
  domain: Building2,
  hosting: Cpu,
  insurance: Shield,
  licenses: CheckCircle,
  marketing: TrendingUp,
  compliance: AlertTriangle,
  developer_tools: Cpu,
  email: Bell,
};

export default function CeoDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Fetch business expenses
  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['/api/ceo/expenses'],
    retry: false,
  });

  // Fetch AI advisory reports
  const { data: advisoryReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['/api/ceo/advisory-reports'],
    retry: false,
  });

  // Fetch business goals
  const { data: businessGoals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['/api/ceo/business-goals'],
    retry: false,
  });

  // Mark advisory report as read
  const markReportRead = useMutation({
    mutationFn: async (reportId: string) => {
      await apiRequest('PUT', `/api/ceo/advisory-reports/${reportId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ceo/advisory-reports'] });
    },
  });

  // Mark expense as paid
  const markExpensePaid = useMutation({
    mutationFn: async (expenseId: string) => {
      await apiRequest('PUT', `/api/ceo/expenses/${expenseId}/paid`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ceo/expenses'] });
      toast({
        title: 'Expense Marked as Paid',
        description: 'The expense has been updated successfully.',
      });
    },
  });

  // Process automatic payment for an expense
  const processPayment = useMutation({
    mutationFn: async (expenseId: string) => {
      await apiRequest('POST', '/api/payments/process-payment', { expenseId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ceo/expenses'] });
      toast({
        title: 'Payment Processed',
        description: 'The automatic payment has been initiated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to process automatic payment',
        variant: 'destructive',
      });
    },
  });

  // Process all due payments
  const processAllDue = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/payments/process-all-due');
      return response;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ceo/expenses'] });
      toast({
        title: 'All Due Payments Processed',
        description: `Processed: ${data.results.processed}, Successful: ${data.results.successful}, Failed: ${data.results.failed}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Payment Processing Failed',
        description: error.message || 'Failed to process due payments',
        variant: 'destructive',
      });
    },
  });

  // Get upcoming expenses (next 30 days)
  const upcomingExpenses = expenses.filter((expense: BusinessExpense) => {
    const dueDate = new Date(expense.nextDueDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return dueDate <= thirtyDaysFromNow && expense.status === 'upcoming';
  });

  // Get overdue expenses
  const overdueExpenses = expenses.filter((expense: BusinessExpense) => 
    expense.status === 'overdue'
  );

  // Calculate total monthly expenses
  const monthlyExpenses = expenses
    .filter((expense: BusinessExpense) => expense.frequency === 'monthly' && expense.isActive)
    .reduce((sum: number, expense: BusinessExpense) => sum + parseFloat(expense.amount), 0);

  // Get unread critical reports
  const criticalReports = advisoryReports.filter((report: AiAdvisoryReport) => 
    report.priority === 'critical' && report.status === 'unread'
  );

  // Group reports by advisor type
  const reportsByAdvisor = advisoryReports.reduce((acc: any, report: AiAdvisoryReport) => {
    if (!acc[report.advisorType]) acc[report.advisorType] = [];
    acc[report.advisorType].push(report);
    return acc;
  }, {});

  // Calculate goal progress
  const getGoalProgress = (goal: BusinessGoal) => {
    const current = parseFloat(goal.currentValue);
    const target = parseFloat(goal.targetValue);
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="ceo-dashboard-page">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
              CEO Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2" data-testid="page-subtitle">
              Your complete business command center for YaadFlex Global
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/vendor-management" 
              className="inline-flex items-center px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
              data-testid="vendor-management-link"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Vendor Management
            </Link>
            <Button 
              onClick={() => processAllDue.mutate()}
              disabled={processAllDue.isPending}
              variant="outline"
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
              data-testid="process-all-payments-btn"
            >
              {processAllDue.isPending ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pay All Due
                </>
              )}
            </Button>
            <Badge variant="secondary" className="px-3 py-1">
              <Activity className="w-4 h-4 mr-1" />
              All Systems Operational
            </Badge>
          </div>
        </div>

        {/* Critical Alerts */}
        {(overdueExpenses.length > 0 || criticalReports.length > 0) && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Urgent Attention Required:</strong>{' '}
              {overdueExpenses.length > 0 && `${overdueExpenses.length} overdue expense${overdueExpenses.length > 1 ? 's' : ''}`}
              {overdueExpenses.length > 0 && criticalReports.length > 0 && ', '}
              {criticalReports.length > 0 && `${criticalReports.length} critical advisory report${criticalReports.length > 1 ? 's' : ''}`}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="monthly-expenses">
                    J${monthlyExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Renewals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="upcoming-renewals">
                    {upcomingExpenses.length}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Goals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="active-goals">
                    {businessGoals.filter((goal: BusinessGoal) => goal.status === 'in_progress').length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Alerts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="ai-alerts">
                    {advisoryReports.filter((report: AiAdvisoryReport) => report.status === 'unread').length}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="expenses" data-testid="tab-expenses">Expenses</TabsTrigger>
            <TabsTrigger value="advisory" data-testid="tab-advisory">AI Advisory</TabsTrigger>
            <TabsTrigger value="goals" data-testid="tab-goals">Goals</TabsTrigger>
            <TabsTrigger value="pricing" data-testid="tab-pricing">Pricing</TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">Reports</TabsTrigger>
          </TabsList>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Expense List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Business Expenses & Renewals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expenses.map((expense: BusinessExpense) => {
                        const IconComponent = categoryIcons[expense.category as keyof typeof categoryIcons] || Building2;
                        const dueDate = new Date(expense.nextDueDate);
                        const isOverdue = expense.status === 'overdue';
                        const isUpcomingSoon = dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                        return (
                          <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {expense.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {expense.provider} • {expense.frequency}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {expense.currency} ${expense.amount}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className={`text-sm ${isOverdue ? 'text-red-600 dark:text-red-400' : 
                                  isUpcomingSoon ? 'text-yellow-600 dark:text-yellow-400' : 
                                  'text-gray-600 dark:text-gray-400'}`}>
                                  Due: {dueDate.toLocaleDateString()}
                                </p>
                                {expense.status === 'upcoming' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => markExpensePaid.mutate(expense.id)}
                                    data-testid={`mark-paid-${expense.id}`}
                                  >
                                    Mark Paid
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Calendar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Renewal Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* AI Advisory Tab */}
          <TabsContent value="advisory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(reportsByAdvisor).map(([advisorType, reports]: [string, any]) => {
                const IconComponent = advisorIcons[advisorType as keyof typeof advisorIcons];
                const colorClass = advisorColors[advisorType as keyof typeof advisorColors];
                
                return (
                  <Card key={advisorType}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        {advisorType.charAt(0).toUpperCase() + advisorType.slice(1)} Advisor
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reports.slice(0, 3).map((report: AiAdvisoryReport) => (
                          <div key={report.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {report.title}
                              </h4>
                              <Badge variant={report.priority === 'critical' ? 'destructive' : 'secondary'}>
                                {report.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {report.summary}
                            </p>
                            {report.status === 'unread' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markReportRead.mutate(report.id)}
                                data-testid={`mark-read-${report.id}`}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Pricing Rules Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Fare Pricing Management
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Configure dynamic fare rules for rides across all YaadFlex services. Toggle pricing factors on or off to adjust fare calculations in real-time.
                </p>
              </div>
              
              <FareRulesToggle 
                isAdmin={true}
                onRuleToggle={(ruleId, enabled) => {
                  console.log(`Rule ${ruleId} ${enabled ? 'enabled' : 'disabled'}`);
                  toast({
                    title: `Fare Rule ${enabled ? 'Enabled' : 'Disabled'}`,
                    description: `Rule ${ruleId} has been ${enabled ? 'activated' : 'deactivated'}.`,
                  });
                }}
              />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <DollarSign className="w-5 h-5" />
                      Fare Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Average Fare</span>
                        <span className="font-semibold text-gray-900 dark:text-white">J$425</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Peak Adjustment</span>
                        <span className="font-semibold text-emerald-600">+40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Airport Premium</span>
                        <span className="font-semibold text-blue-600">+J$200</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <TrendingUp className="w-5 h-5" />
                      Rule Usage Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Most Used Rule</span>
                        <span className="font-semibold text-gray-900 dark:text-white">Peak Hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Applications Today</span>
                        <span className="font-semibold text-amber-600">147</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Revenue Impact</span>
                        <span className="font-semibold text-green-600">+J$12,450</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Business Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {businessGoals.map((goal: BusinessGoal) => {
                const progress = getGoalProgress(goal);
                const isOverdue = new Date(goal.targetDate) < new Date() && goal.status === 'in_progress';
                
                return (
                  <Card key={goal.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{goal.name}</span>
                        <Badge variant={goal.status === 'achieved' ? 'default' : 
                                       isOverdue ? 'destructive' : 'secondary'}>
                          {goal.status.replace('_', ' ')}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Current: {goal.currentValue} {goal.unit}</span>
                          <span>Target: {goal.targetValue} {goal.unit}</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Weekly Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Weekly YaadFlex CEO Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Sample Weekly Report */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4">
                      🗓️ Weekly Report - {new Date().toLocaleDateString()}
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-2">
                        <span>•</span>
                        <span>Domain (yaadflex.com) renewal due in 22 days — J$6,500</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span>•</span>
                        <span>Google Workspace (email) auto-renews monthly — J$3,000</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span>•</span>
                        <span>Insurance (General + Cyber) premium due September — J$35,000</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span>•</span>
                        <span>Hosting (Replit Pro) auto-renews 12 Sept — J$2,400</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span>•</span>
                        <span>Travel feature booking volume up 12% this week</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span>•</span>
                        <span>Driver payout system stable, average wait time: 2.5 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}