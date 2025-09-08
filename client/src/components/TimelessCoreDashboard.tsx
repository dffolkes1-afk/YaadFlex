import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Brain, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Lock,
  Eye,
  RefreshCw
} from 'lucide-react';

interface SystemHealth {
  component: string;
  health: 'healthy' | 'warning' | 'critical' | 'failure';
  errorRate?: number;
  latencyP95?: number;
  lastCheck: string;
  autoRepairAttempted?: boolean;
  repairSuccessful?: boolean;
}

interface AdaptiveMetrics {
  systemIq: number;
  adaptiveInsights: string;
  predictionConfidence: number;
  nextOptimization: string;
}

interface TimelessConfig {
  version: string;
  safetyMode: 'strict' | 'moderate' | 'permissive';
  privacyMode: 'maximum' | 'balanced' | 'minimal';
  rollbackEnabled: boolean;
  humanApprovalRequired: boolean;
  lastKnownGoodVersion?: string;
}

export function TimelessCoreDashboard() {
  // Demo data for the dashboard
  const [systemIq, setSystemIq] = useState(150);
  const [optimizationCount, setOptimizationCount] = useState(0);
  const [isLearning, setIsLearning] = useState(false);

  // Simulate system IQ growth
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemIq(prev => Math.min(200, prev + Math.random() * 0.5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const config: TimelessConfig = {
    version: 'core-voice-1.0.0',
    safetyMode: 'strict',
    privacyMode: 'maximum',
    rollbackEnabled: true,
    humanApprovalRequired: true,
    lastKnownGoodVersion: 'core-voice-1.0.0'
  };

  const metrics: AdaptiveMetrics = {
    systemIq: Math.round(systemIq),
    adaptiveInsights: 'AI predicts you\'ll need Spanish translations in 2 hours based on your patterns',
    predictionConfidence: 0.85 + (Math.random() * 0.1),
    nextOptimization: `Adaptive learning will optimize translations in ${Math.ceil(Math.random() * 120)} minutes`
  };

  const systemHealth: Record<string, SystemHealth> = {
    translator: {
      component: 'translator',
      health: 'healthy',
      errorRate: 0.02,
      latencyP95: 450,
      lastCheck: new Date().toISOString(),
      autoRepairAttempted: false
    },
    policy_engine: {
      component: 'policy_engine',
      health: 'healthy',
      errorRate: 0.001,
      latencyP95: 50,
      lastCheck: new Date().toISOString(),
      autoRepairAttempted: false
    },
    learning_loop: {
      component: 'learning_loop',
      health: 'healthy',
      errorRate: 0.005,
      latencyP95: 200,
      lastCheck: new Date().toISOString(),
      autoRepairAttempted: false
    },
    safety_monitor: {
      component: 'safety_monitor',
      health: 'healthy',
      errorRate: 0.0,
      latencyP95: 25,
      lastCheck: new Date().toISOString(),
      autoRepairAttempted: false
    }
  };

  const handleOptimizeSystem = () => {
    setIsLearning(true);
    setOptimizationCount(prev => prev + 1);
    setTimeout(() => {
      setIsLearning(false);
      setSystemIq(prev => Math.min(200, prev + 1));
    }, 2000);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'critical': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'failure': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getSafetyModeColor = (mode: string) => {
    switch (mode) {
      case 'strict': return 'text-green-400 bg-green-500/10';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/10';
      case 'permissive': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-accent" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              TimelessCore Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced safety-first AI system with continuous learning, human oversight, and enterprise-grade security
          </p>
          <Badge className="text-accent bg-accent/10 border-accent/30">
            🔥 LIVE DEMO - Revolutionary AI Learning System
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
            <TabsTrigger value="safety">Safety Controls</TabsTrigger>
            <TabsTrigger value="monitoring">Health Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card/95 backdrop-blur border-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-accent" />
                    <span>System Version</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {config.version}
                  </div>
                  <p className="text-xs text-muted-foreground">Latest stable</p>
                </CardContent>
              </Card>

              <Card className="bg-card/95 backdrop-blur border-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-blue-400" />
                    <span>System IQ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {metrics.systemIq}
                    {isLearning && <span className="text-xs ml-2 text-green-400 animate-pulse">↗️ Growing</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">Growing intelligently</p>
                </CardContent>
              </Card>

              <Card className="bg-card/95 backdrop-blur border-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span>Safety Mode</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`text-xs ${getSafetyModeColor(config.safetyMode)}`}>
                    {config.safetyMode.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">Maximum protection</p>
                </CardContent>
              </Card>

              <Card className="bg-card/95 backdrop-blur border-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-purple-400" />
                    <span>Privacy Mode</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="text-xs text-purple-400 bg-purple-500/10">
                    {config.privacyMode.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">PII protected</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="bg-card/95 backdrop-blur border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  <span>Adaptive Intelligence Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-blue-400 font-medium mb-2">Current Prediction</p>
                  <p className="text-sm text-muted-foreground mb-3">{metrics.adaptiveInsights}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-muted-foreground">
                      Confidence: {Math.round(metrics.predictionConfidence * 100)}%
                    </span>
                    <span className="text-muted-foreground">{metrics.nextOptimization}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={handleOptimizeSystem} 
                    disabled={isLearning}
                    className="bg-accent/20 hover:bg-accent/30 text-accent border-accent/30"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {isLearning ? 'Optimizing...' : 'Optimize System'}
                  </Button>
                  
                  <Badge variant="outline" className="text-xs">
                    Optimizations: {optimizationCount}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <Card className="bg-card/95 backdrop-blur border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  <span>Adaptive Learning Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* System IQ Growth */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">System Intelligence Quotient</span>
                    <span className="text-blue-400 font-mono font-bold">{metrics.systemIq}</span>
                  </div>
                  <Progress 
                    value={((metrics.systemIq - 150) / 50) * 100} 
                    className="h-3 bg-blue-500/20" 
                  />
                  <p className="text-xs text-muted-foreground">Target: 200+ (Current growth trajectory excellent)</p>
                </div>

                {/* Prediction Accuracy */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Prediction Accuracy</span>
                    <span className="text-green-400 font-mono font-bold">
                      {Math.round(metrics.predictionConfidence * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={metrics.predictionConfidence * 100} 
                    className="h-3 bg-green-500/20" 
                  />
                </div>

                {/* Learning Insights */}
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
                  <h4 className="font-medium text-blue-400 mb-2">Current Learning Focus</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    System is actively learning from translation patterns, user feedback, and contextual cues.
                    Privacy-safe anonymized data is being processed to improve accuracy.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>🧠 Pattern Recognition: Active</span>
                    <span>🔒 Privacy Protection: Maximum</span>
                    <span>⚡ Real-time Adaptation: Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Safety Configuration */}
              <Card className="bg-card/95 backdrop-blur border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span>Safety Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Human Approval Required</span>
                    <Badge className={config.humanApprovalRequired ? 'text-green-400 bg-green-500/10' : 'text-orange-400 bg-orange-500/10'}>
                      {config.humanApprovalRequired ? 'ENABLED' : 'DISABLED'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Rollback Protection</span>
                    <Badge className={config.rollbackEnabled ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}>
                      {config.rollbackEnabled ? 'ENABLED' : 'DISABLED'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Privacy Mode</span>
                    <Badge className="text-purple-400 bg-purple-500/10">
                      {config.privacyMode.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Last Known Good</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {config.lastKnownGoodVersion}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Controls */}
              <Card className="bg-card/95 backdrop-blur border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-purple-400" />
                    <span>Privacy Protection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <h4 className="font-medium text-purple-400 mb-2">Active Protections</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>✓ PII Redaction and Anonymization</li>
                      <li>✓ Context Hash Generation</li>
                      <li>✓ Session Anonymization</li>
                      <li>✓ 30-day Data Retention Limit</li>
                      <li>✓ User Consent Required</li>
                    </ul>
                  </div>
                  
                  <div className="text-center pt-2">
                    <Badge className="text-green-400 bg-green-500/10">
                      GDPR & CCPA Compliant
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-card/95 backdrop-blur border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-accent" />
                  <span>System Health Monitoring</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(systemHealth).map(([component, health]) => (
                  <div key={component} className={`p-4 rounded-lg border ${getHealthColor(health.health)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{component.replace('_', ' ')}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getHealthColor(health.health)}`}>
                          {health.health.toUpperCase()}
                        </Badge>
                        {health.autoRepairAttempted && (
                          <Badge className="text-xs text-blue-400 bg-blue-500/10">
                            AUTO-REPAIR
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      {health.errorRate !== undefined && (
                        <div>Error Rate: {(health.errorRate * 100).toFixed(2)}%</div>
                      )}
                      {health.latencyP95 !== undefined && (
                        <div>Latency P95: {health.latencyP95}ms</div>
                      )}
                      <div className="col-span-2">
                        Last Check: {new Date(health.lastCheck).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}