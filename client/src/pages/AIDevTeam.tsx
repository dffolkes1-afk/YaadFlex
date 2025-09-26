import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, Cpu, Shield, AlertTriangle, CheckCircle, Clock, 
  Zap, Activity, Code, Wrench, Database, DollarSign,
  PlayCircle, Pause, RotateCcw, Settings, Monitor
} from 'lucide-react';

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'standby' | 'working' | 'debugging';
  lastAction: string;
  timestamp: string;
  tasksCompleted: number;
  priority: 'high' | 'medium' | 'low';
}

interface SystemDebt {
  id: string;
  type: 'maintenance' | 'upgrade' | 'security' | 'performance';
  description: string;
  cost: number;
  currency: string;
  status: 'pending' | 'approved' | 'processing' | 'completed';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  aiConfidence: number;
}

interface AutoTask {
  id: string;
  title: string;
  type: 'debug' | 'repair' | 'optimize' | 'monitor' | 'payment';
  status: 'pending' | 'running' | 'completed' | 'failed';
  assignedAgent: string;
  progress: number;
  estimatedCompletion: string;
}

export default function AIDevTeam() {
  const [systemStatus, setSystemStatus] = useState('fully_operational');
  const [aiAgentsActive, setAiAgentsActive] = useState(true);
  const [autoRepairEnabled, setAutoRepairEnabled] = useState(true);

  // Your AI Development Team
  const aiAgents: AIAgent[] = [
    {
      id: 'agent-001',
      name: 'Marcus AI',
      role: 'Senior Full-Stack Developer',
      status: 'active',
      lastAction: 'Fixed transfer timeout issue in Nigeria route',
      timestamp: '3 minutes ago',
      tasksCompleted: 847,
      priority: 'high'
    },
    {
      id: 'agent-002',
      name: 'Ripley AI',
      role: 'Database Engineer',
      status: 'working',
      lastAction: 'Optimizing transaction table performance',
      timestamp: '8 minutes ago',
      tasksCompleted: 623,
      priority: 'high'
    },
    {
      id: 'agent-003',
      name: 'Phoenix AI',
      role: 'Security Engineer',
      status: 'active',
      lastAction: 'Blocked 12 suspicious login attempts',
      timestamp: '1 minute ago',
      tasksCompleted: 1205,
      priority: 'high'
    },
    {
      id: 'agent-004',
      name: 'Trinity AI',
      role: 'Performance Engineer',
      status: 'standby',
      lastAction: 'Reduced API response time by 15%',
      timestamp: '25 minutes ago',
      tasksCompleted: 534,
      priority: 'medium'
    },
    {
      id: 'agent-005',
      name: 'Neo AI',
      role: 'Payment Systems Specialist',
      status: 'working',
      lastAction: 'Processing YFD to NGN exchanges',
      timestamp: '5 minutes ago',
      tasksCompleted: 392,
      priority: 'high'
    },
    {
      id: 'agent-006',
      name: 'Oracle AI',
      role: 'System Administrator',
      status: 'active',
      lastAction: 'Deployed hotfix for memory leak',
      timestamp: '12 minutes ago',
      tasksCompleted: 756,
      priority: 'medium'
    }
  ];

  // System Debt Management (AI handles financial obligations)
  const systemDebts: SystemDebt[] = [
    {
      id: 'debt-001',
      type: 'maintenance',
      description: 'Server cluster optimization for Africa region',
      cost: 250.00,
      currency: 'USD',
      status: 'approved',
      urgency: 'high',
      aiConfidence: 94.7
    },
    {
      id: 'debt-002',
      type: 'upgrade',
      description: 'Enhanced fraud detection algorithms',
      cost: 500.00,
      currency: 'USD',
      status: 'processing',
      urgency: 'medium',
      aiConfidence: 89.2
    },
    {
      id: 'debt-003',
      type: 'security',
      description: 'Multi-factor authentication upgrade',
      cost: 150.00,
      currency: 'USD',
      status: 'completed',
      urgency: 'critical',
      aiConfidence: 98.5
    },
    {
      id: 'debt-004',
      type: 'performance',
      description: 'Real-time currency exchange optimization',
      cost: 320.00,
      currency: 'USD',
      status: 'pending',
      urgency: 'high',
      aiConfidence: 91.8
    }
  ];

  // Current Autonomous Tasks
  const autoTasks: AutoTask[] = [
    {
      id: 'task-001',
      title: 'Optimize Nigerian Naira conversion rates',
      type: 'optimize',
      status: 'running',
      assignedAgent: 'Neo AI',
      progress: 75,
      estimatedCompletion: '8 minutes'
    },
    {
      id: 'task-002',
      title: 'Debug Ghana mobile money integration',
      type: 'debug',
      status: 'running',
      assignedAgent: 'Marcus AI',
      progress: 45,
      estimatedCompletion: '15 minutes'
    },
    {
      id: 'task-003',
      title: 'Monitor India transfer volume surge',
      type: 'monitor',
      status: 'pending',
      assignedAgent: 'Oracle AI',
      progress: 0,
      estimatedCompletion: '5 minutes'
    },
    {
      id: 'task-004',
      title: 'Process pending vendor payments',
      type: 'payment',
      status: 'completed',
      assignedAgent: 'Trinity AI',
      progress: 100,
      estimatedCompletion: 'Completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'working': return 'bg-blue-100 text-blue-800';
      case 'standby': return 'bg-yellow-100 text-yellow-800';
      case 'debugging': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalDebtAmount = systemDebts.reduce((sum, debt) => sum + debt.cost, 0);
  const completedTasks = autoTasks.filter(task => task.status === 'completed').length;
  const runningTasks = autoTasks.filter(task => task.status === 'running').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🤖 AI Development Team
          </h1>
          <p className="text-xl text-purple-300 mb-4">
            Your 24/7 AI developers keeping your money transfer empire running
          </p>
          
          {/* System Status */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${systemStatus === 'fully_operational' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-lg font-semibold">
                Status: {systemStatus === 'fully_operational' ? 'FULLY OPERATIONAL' : 'MAINTENANCE MODE'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-400" />
              <span className="text-lg font-semibold">
                {aiAgents.filter(agent => agent.status === 'active' || agent.status === 'working').length} AI Devs Active
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="agents" className="data-[state=active]:bg-purple-600">
              <Bot className="h-4 w-4 mr-2" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="debts" className="data-[state=active]:bg-purple-600">
              <DollarSign className="h-4 w-4 mr-2" />
              System Debts
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-600">
              <Activity className="h-4 w-4 mr-2" />
              Auto Tasks
            </TabsTrigger>
            <TabsTrigger value="controls" className="data-[state=active]:bg-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Controls
            </TabsTrigger>
          </TabsList>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiAgents.map((agent) => (
                <Card key={agent.id} className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-300">
                      {agent.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-slate-400">Last Action:</div>
                        <div className="text-sm text-white">{agent.lastAction}</div>
                        <div className="text-xs text-slate-500">{agent.timestamp}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="text-xs text-slate-400">Tasks Completed</div>
                          <div className="text-lg font-bold text-green-400">{agent.tasksCompleted}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Priority</div>
                          <Badge variant={agent.priority === 'high' ? 'destructive' : 'secondary'}>
                            {agent.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* System Debts Tab */}
          <TabsContent value="debts" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5" />
                  System Financial Management
                </CardTitle>
                <CardDescription className="text-slate-300">
                  AI automatically manages system costs and maintenance payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-green-900/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">
                      ${totalDebtAmount.toFixed(2)} USD
                    </div>
                    <div className="text-sm text-green-200">
                      Total System Investment Managed by AI
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {systemDebts.map((debt) => (
                    <div key={debt.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-white">{debt.description}</div>
                        <div className="text-sm text-slate-300">
                          AI Confidence: {debt.aiConfidence}%
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-bold text-white">
                          ${debt.cost.toFixed(2)} {debt.currency}
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getUrgencyColor(debt.urgency)}>
                            {debt.urgency}
                          </Badge>
                          <Badge variant={debt.status === 'completed' ? 'default' : 'secondary'}>
                            {debt.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auto Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5" />
                  Autonomous Task Queue
                </CardTitle>
                <CardDescription className="text-slate-300">
                  AI agents working on system improvements and fixes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-300">{runningTasks}</div>
                    <div className="text-sm text-blue-200">Running</div>
                  </div>
                  <div className="text-center p-3 bg-green-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-300">{completedTasks}</div>
                    <div className="text-sm text-green-200">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300">{autoTasks.length}</div>
                    <div className="text-sm text-purple-200">Total</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {autoTasks.map((task) => (
                    <div key={task.id} className="p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-white">{task.title}</div>
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-slate-300">
                          Assigned to: {task.assignedAgent}
                        </div>
                        <div className="text-sm text-slate-300">
                          ETA: {task.estimatedCompletion}
                        </div>
                      </div>
                      {task.status === 'running' && (
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">System Controls</CardTitle>
                  <CardDescription className="text-slate-300">
                    Manage your AI development team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">AI Agents Active</span>
                    <Button
                      onClick={() => setAiAgentsActive(!aiAgentsActive)}
                      variant={aiAgentsActive ? "default" : "destructive"}
                      className={aiAgentsActive ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {aiAgentsActive ? <PlayCircle className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                      {aiAgentsActive ? 'Active' : 'Paused'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">Auto-Repair System</span>
                    <Button
                      onClick={() => setAutoRepairEnabled(!autoRepairEnabled)}
                      variant={autoRepairEnabled ? "default" : "secondary"}
                      className={autoRepairEnabled ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {autoRepairEnabled ? <Shield className="h-4 w-4 mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
                      {autoRepairEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-600">
                    <Button className="w-full bg-red-600 hover:bg-red-700 mb-2">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency Stop All AI
                    </Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restart All Systems
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                  <CardDescription className="text-slate-300">
                    Real-time system monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">CPU Usage</span>
                    <span className="text-green-400 font-medium">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Memory Usage</span>
                    <span className="text-blue-400 font-medium">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Database Load</span>
                    <span className="text-yellow-400 font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Network I/O</span>
                    <span className="text-purple-400 font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Active Transfers</span>
                    <span className="text-green-400 font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">AI Confidence</span>
                    <span className="text-cyan-400 font-medium">94.2%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}