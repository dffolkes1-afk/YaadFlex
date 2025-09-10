import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  Activity,
  CreditCard,
  FileText,
  RefreshCw,
  Power,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function CeoDashboard() {
  const { toast } = useToast();
  const [killSwitch, setKillSwitch] = useState(false);

  // Fetch dashboard metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/ceo/metrics'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch compliance status
  const { data: compliance } = useQuery({
    queryKey: ['/api/ceo/compliance'],
    refetchInterval: 60000
  });

  // Fetch pending approvals
  const { data: approvals } = useQuery({
    queryKey: ['/api/ceo/approvals/pending']
  });

  // Fetch agent status
  const { data: agentStatus } = useQuery({
    queryKey: ['/api/autonomous/status'],
    refetchInterval: 5000
  });

  // Mutation for approval actions
  const approveMutation = useMutation({
    mutationFn: async ({ taskId, action }: { taskId: string; action: 'approve' | 'reject' }) => {
      return apiRequest('POST', `/api/ceo/approvals/${taskId}/${action}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ceo/approvals/pending'] });
      toast({
        title: "Success",
        description: "Approval action completed"
      });
    }
  });

  // Emergency stop mutation
  const emergencyStopMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/autonomous/emergency-stop');
    },
    onSuccess: () => {
      setKillSwitch(true);
      toast({
        title: "Emergency Stop Activated",
        description: "All autonomous operations have been halted",
        variant: "destructive"
      });
    }
  });

  // Start agent mutation
  const startAgentMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/autonomous/start');
    },
    onSuccess: () => {
      setKillSwitch(false);
      toast({
        title: "Agent Started",
        description: "Autonomous operations resumed"
      });
    }
  });

  // Format currency
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6" data-testid="ceo-dashboard">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">CEO Dashboard</h1>
          <p className="text-gray-400">Complete control over YaadFlex operations</p>
        </div>
        
        {/* Kill Switch */}
        <div className="flex items-center gap-4">
          <Badge 
            variant={agentStatus?.isRunning ? "default" : "destructive"}
            className="text-lg px-4 py-2"
          >
            <Activity className="w-4 h-4 mr-2" />
            Agent {agentStatus?.isRunning ? 'Active' : 'Stopped'}
          </Badge>
          
          <Button
            variant={killSwitch ? "default" : "destructive"}
            size="lg"
            onClick={() => {
              if (killSwitch) {
                startAgentMutation.mutate();
              } else {
                emergencyStopMutation.mutate();
              }
            }}
            data-testid="button-kill-switch"
          >
            <Power className="w-5 h-5 mr-2" />
            {killSwitch ? 'Start Agent' : 'EMERGENCY STOP'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(metrics?.revenue?.total || 0)}
            </div>
            <p className="text-xs text-green-500 mt-1">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              {formatPercentage(metrics?.revenue?.growth || 0)} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics?.users?.active?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics?.users?.new || 0} new this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {compliance?.score || 0}%
            </div>
            <Progress value={compliance?.score || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics?.tasks?.pending || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics?.tasks?.critical || 0} critical
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="compliance" className="w-full">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="obligations">Obligations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="agent-logs">Agent Logs</TabsTrigger>
        </TabsList>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Status */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Compliance Status</CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time compliance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compliance?.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.status === 'compliant' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : item.status === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          item.status === 'compliant' ? 'default' : 
                          item.status === 'warning' ? 'secondary' : 'destructive'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Deadlines</CardTitle>
                <CardDescription className="text-gray-400">
                  Critical dates and obligations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compliance?.deadlines?.map((deadline: any) => (
                    <div key={deadline.id} className="border-l-2 border-gray-700 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{deadline.title}</p>
                          <p className="text-sm text-gray-500">{deadline.type}</p>
                        </div>
                        <Badge variant={deadline.daysLeft <= 7 ? 'destructive' : 'secondary'}>
                          {deadline.daysLeft} days
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Due: {new Date(deadline.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="mt-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Pending Approvals</CardTitle>
              <CardDescription className="text-gray-400">
                Tasks requiring CEO approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approvals?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending approvals
                </div>
              ) : (
                <div className="space-y-4">
                  {approvals?.map((approval: any) => (
                    <div key={approval.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{approval.task.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {approval.task.description}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>Amount: {formatCurrency(approval.task.amount || 0)}</span>
                            <span>Priority: {approval.task.priority}</span>
                            <span>Due: {new Date(approval.task.dueAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{approval.requiredRole}</Badge>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => approveMutation.mutate({ 
                            taskId: approval.taskId, 
                            action: 'approve' 
                          })}
                          disabled={approveMutation.isPending}
                          data-testid={`button-approve-${approval.id}`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => approveMutation.mutate({ 
                            taskId: approval.taskId, 
                            action: 'reject' 
                          })}
                          disabled={approveMutation.isPending}
                          data-testid={`button-reject-${approval.id}`}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Obligations Tab */}
        <TabsContent value="obligations" className="mt-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Active Obligations</CardTitle>
              <CardDescription className="text-gray-400">
                Recurring payments and commitments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.obligations?.map((obligation: any) => (
                  <div key={obligation.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{obligation.title}</h4>
                        <p className="text-sm text-gray-400">{obligation.vendor}</p>
                        <div className="flex gap-4 mt-2">
                          <Badge variant="outline">{obligation.category}</Badge>
                          <span className="text-sm text-gray-500">
                            {obligation.recurrence}
                          </span>
                          {obligation.autopay && (
                            <Badge className="bg-green-900 text-green-100">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Autopay
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">
                          {formatCurrency(obligation.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Next: {new Date(obligation.nextDueAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Payments</CardTitle>
              <CardDescription className="text-gray-400">
                Platform payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics?.payments?.map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        payment.status === 'completed' ? 'bg-green-900' : 
                        payment.status === 'processing' ? 'bg-yellow-900' : 'bg-red-900'
                      }`}>
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{payment.vendor}</p>
                        <p className="text-sm text-gray-500">
                          {payment.method} • {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        {formatCurrency(payment.amount)}
                      </p>
                      <Badge variant={
                        payment.status === 'completed' ? 'default' : 
                        payment.status === 'processing' ? 'secondary' : 'destructive'
                      }>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agent Logs Tab */}
        <TabsContent value="agent-logs" className="mt-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Agent Activity Logs</CardTitle>
              <CardDescription className="text-gray-400">
                Autonomous agent actions and decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics?.agentLogs?.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 py-2">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      log.status === 'success' ? 'bg-green-500' : 
                      log.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {log.agentType}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Health Alert */}
      {agentStatus?.killSwitch && (
        <Alert className="mt-6 bg-red-900 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Emergency Stop Active</AlertTitle>
          <AlertDescription>
            All autonomous operations are currently halted. Click "Start Agent" to resume normal operations.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}