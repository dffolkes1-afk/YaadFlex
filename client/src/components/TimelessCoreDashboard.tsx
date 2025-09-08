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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
  const queryClient = useQueryClient();
  
  // Fetch TimelessCore configuration
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['/api/timeless-core/config'],
  });

  // Fetch adaptive metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/timeless-core/adaptive-metrics'],
    refetchInterval: 5000, // Update every 5 seconds
  });

  // Fetch system health
  const { data: healthData, isLoading: healthLoading } = useQuery({
    queryKey: ['/api/timeless-core/system-health'],
    refetchInterval: 10000, // Update every 10 seconds
  });

  // Learning signal mutation
  const recordSignalMutation = useMutation({
    mutationFn: (signal: any) => apiRequest('/api/timeless-core/learning-signals', {
      method: 'POST',
      body: JSON.stringify(signal)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timeless-core/adaptive-metrics'] });
    }
  });

  // Batch learning mutation
  const batchLearningMutation = useMutation({
    mutationFn: () => apiRequest('/api/timeless-core/batch-learning', {
      method: 'POST',
    }),
  });

  const handleOptimizeSystem = () => {
    recordSignalMutation.mutate({
      signalType: 'manual_optimization',
      targetLang: 'en-US',
      feedbackScore: 5,
      privacyConsent: true
    });
  };

  const handleBatchLearning = () => {
    batchLearningMutation.mutate();
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

  if (configLoading || metricsLoading || healthLoading) {
    return (
      <div className=\"min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center\">
        <div className=\"text-center space-y-4\">
          <Activity className=\"h-8 w-8 text-accent animate-spin mx-auto\" />
          <p className=\"text-muted-foreground\">Loading TimelessCore Dashboard...</p>
        </div>
      </div>
    );
  }

  const typedConfig = config?.config as TimelessConfig;
  const typedMetrics = metrics?.metrics as AdaptiveMetrics;
  const systemHealth = healthData?.systemHealth as Record<string, SystemHealth>;

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4\">
      <div className=\"container mx-auto max-w-7xl space-y-6\">
        
        {/* Header */}
        <div className=\"text-center space-y-4 mb-8\">
          <div className=\"flex items-center justify-center space-x-3\">
            <div className=\"relative\">
              <Shield className=\"h-8 w-8 text-accent\" />
              <div className=\"absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse\" />
            </div>
            <h1 className=\"text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent\">
              TimelessCore Dashboard
            </h1>
          </div>
          <p className=\"text-muted-foreground max-w-2xl mx-auto\">
            Advanced safety-first AI system with continuous learning, human oversight, and enterprise-grade security
          </p>
        </div>

        <Tabs defaultValue=\"overview\" className=\"space-y-6\">
          <TabsList className=\"grid w-full grid-cols-4 bg-card/50 backdrop-blur\">
            <TabsTrigger value=\"overview\">System Overview</TabsTrigger>
            <TabsTrigger value=\"intelligence\">AI Intelligence</TabsTrigger>
            <TabsTrigger value=\"safety\">Safety Controls</TabsTrigger>
            <TabsTrigger value=\"monitoring\">Health Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value=\"overview\" className=\"space-y-6\">
            {/* System Status Cards */}
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
              <Card className=\"bg-card/95 backdrop-blur border-accent/20\">
                <CardHeader className=\"pb-3\">
                  <CardTitle className=\"text-sm flex items-center space-x-2\">
                    <Activity className=\"h-4 w-4 text-accent\" />
                    <span>System Version</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className=\"text-2xl font-bold text-accent mb-1\">
                    {typedConfig?.version || 'v1.0.0'}
                  </div>
                  <p className=\"text-xs text-muted-foreground\">Latest stable</p>
                </CardContent>
              </Card>

              <Card className=\"bg-card/95 backdrop-blur border-accent/20\">
                <CardHeader className=\"pb-3\">
                  <CardTitle className=\"text-sm flex items-center space-x-2\">
                    <Brain className=\"h-4 w-4 text-blue-400\" />
                    <span>System IQ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className=\"text-2xl font-bold text-blue-400 mb-1\">
                    {typedMetrics?.systemIq || 150}
                  </div>
                  <p className=\"text-xs text-muted-foreground\">Growing intelligently</p>
                </CardContent>
              </Card>

              <Card className=\"bg-card/95 backdrop-blur border-accent/20\">
                <CardHeader className=\"pb-3\">
                  <CardTitle className=\"text-sm flex items-center space-x-2\">
                    <Shield className=\"h-4 w-4 text-green-400\" />
                    <span>Safety Mode</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`text-xs ${getSafetyModeColor(typedConfig?.safetyMode || 'strict')}`}>
                    {typedConfig?.safetyMode?.toUpperCase() || 'STRICT'}
                  </Badge>
                  <p className=\"text-xs text-muted-foreground mt-2\">Maximum protection</p>
                </CardContent>
              </Card>

              <Card className=\"bg-card/95 backdrop-blur border-accent/20\">
                <CardHeader className=\"pb-3\">
                  <CardTitle className=\"text-sm flex items-center space-x-2\">
                    <Lock className=\"h-4 w-4 text-purple-400\" />
                    <span>Privacy Mode</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className=\"text-xs text-purple-400 bg-purple-500/10\">
                    {typedConfig?.privacyMode?.toUpperCase() || 'MAXIMUM'}
                  </Badge>
                  <p className=\"text-xs text-muted-foreground mt-2\">PII protected</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            {typedMetrics && (
              <Card className=\"bg-card/95 backdrop-blur border-accent/20\">
                <CardHeader>
                  <CardTitle className=\"flex items-center space-x-2\">
                    <Brain className=\"h-5 w-5 text-blue-400\" />
                    <span>Adaptive Intelligence Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className=\"space-y-4\">
                  <div className=\"p-4 bg-blue-500/10 rounded-lg border border-blue-500/30\">
                    <p className=\"text-blue-400 font-medium mb-2\">Current Prediction</p>
                    <p className=\"text-sm text-muted-foreground mb-3\">{typedMetrics.adaptiveInsights}</p>
                    <div className=\"flex items-center space-x-4 text-xs\">
                      <span className=\"text-muted-foreground\">
                        Confidence: {Math.round((typedMetrics.predictionConfidence || 0.5) * 100)}%
                      </span>
                      <span className=\"text-muted-foreground\">{typedMetrics.nextOptimization}</span>
                    </div>
                  </div>
                  
                  <div className=\"flex space-x-2\">
                    <Button 
                      size=\"sm\" 
                      onClick={handleOptimizeSystem} 
                      disabled={recordSignalMutation.isPending}
                      className=\"bg-accent/20 hover:bg-accent/30 text-accent border-accent/30\"
                    >
                      <Zap className=\"h-3 w-3 mr-1\" />
                      Optimize System
                    </Button>
                    
                    <Button 
                      size=\"sm\" 
                      variant=\"outline\"
                      onClick={handleBatchLearning} 
                      disabled={batchLearningMutation.isPending}
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${batchLearningMutation.isPending ? 'animate-spin' : ''}`} />
                      Process Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value=\"intelligence\" className=\"space-y-6\">
            <Card className=\"bg-card/95 backdrop-blur border-accent/20\">
              <CardHeader>
                <CardTitle className=\"flex items-center space-x-2\">
                  <Brain className=\"h-5 w-5 text-blue-400\" />
                  <span>Adaptive Learning Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-6\">
                {/* System IQ Growth */}
                <div className=\"space-y-2\">
                  <div className=\"flex items-center justify-between text-sm\">
                    <span className=\"text-muted-foreground\">System Intelligence Quotient</span>
                    <span className=\"text-blue-400 font-mono font-bold\">{typedMetrics?.systemIq || 150}</span>
                  </div>
                  <Progress 
                    value={((typedMetrics?.systemIq || 150) - 150) * 2} 
                    className=\"h-3 bg-blue-500/20\" 
                  />
                  <p className=\"text-xs text-muted-foreground\">Target: 200+ (Current growth trajectory excellent)</p>
                </div>

                {/* Prediction Accuracy */}
                <div className=\"space-y-2\">
                  <div className=\"flex items-center justify-between text-sm\">
                    <span className=\"text-muted-foreground\">Prediction Accuracy</span>
                    <span className=\"text-green-400 font-mono font-bold\">
                      {Math.round((typedMetrics?.predictionConfidence || 0.5) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(typedMetrics?.predictionConfidence || 0.5) * 100} 
                    className=\"h-3 bg-green-500/20\" 
                  />
                </div>

                {/* Learning Insights */}
                <div className=\"p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30\">
                  <h4 className=\"font-medium text-blue-400 mb-2\">Current Learning Focus</h4>
                  <p className=\"text-sm text-muted-foreground mb-3\">
                    System is actively learning from translation patterns, user feedback, and contextual cues.
                    Privacy-safe anonymized data is being processed to improve accuracy.
                  </p>
                  <div className=\"flex items-center space-x-4 text-xs text-muted-foreground\">
                    <span>🧠 Pattern Recognition: Active</span>
                    <span>🔒 Privacy Protection: Maximum</span>
                    <span>⚡ Real-time Adaptation: Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value=\"safety\" className=\"space-y-6\">
            <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
              {/* Safety Configuration */}
              <Card className=\"bg-card/95 backdrop-blur border-accent/20\">
                <CardHeader>
                  <CardTitle className=\"flex items-center space-x-2\">
                    <Shield className=\"h-5 w-5 text-green-400\" />
                    <span>Safety Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className=\"space-y-4\">
                  <div className=\"flex items-center justify-between py-2 border-b border-border/50\">
                    <span className=\"text-sm text-muted-foreground\">Human Approval Required</span>
                    <Badge className={typedConfig?.humanApprovalRequired ? 'text-green-400 bg-green-500/10' : 'text-orange-400 bg-orange-500/10'}>
                      {typedConfig?.humanApprovalRequired ? 'ENABLED' : 'DISABLED'}
                    </Badge>
                  </div>
                  <div className=\"flex items-center justify-between py-2 border-b border-border/50\">
                    <span className=\"text-sm text-muted-foreground\">Rollback Protection</span>
                    <Badge className={typedConfig?.rollbackEnabled ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}>
                      {typedConfig?.rollbackEnabled ? 'ENABLED' : 'DISABLED'}
                    </Badge>
                  </div>
                  <div className=\"flex items-center justify-between py-2 border-b border-border/50\">
                    <span className=\"text-sm text-muted-foreground\">Privacy Mode</span>
                    <Badge className=\"text-purple-400 bg-purple-500/10\">
                      {typedConfig?.privacyMode?.toUpperCase() || 'MAXIMUM'}
                    </Badge>
                  </div>
                  <div className=\"flex items-center justify-between py-2\">
                    <span className=\"text-sm text-muted-foreground\">Last Known Good</span>
                    <span className=\"text-xs font-mono text-muted-foreground\">
                      {typedConfig?.lastKnownGoodVersion || 'v1.0.0'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Controls */}
              <Card className=\"bg-card/95 backdrop-blur border-accent/20\">
                <CardHeader>
                  <CardTitle className=\"flex items-center space-x-2\">
                    <Eye className=\"h-5 w-5 text-purple-400\" />
                    <span>Privacy Protection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className=\"space-y-4\">
                  <div className=\"p-3 bg-purple-500/10 rounded-lg border border-purple-500/30\">
                    <h4 className=\"font-medium text-purple-400 mb-2\">Active Protections</h4>
                    <ul className=\"space-y-1 text-xs text-muted-foreground\">
                      <li>✓ PII Redaction and Anonymization</li>
                      <li>✓ Context Hash Generation</li>
                      <li>✓ Session Anonymization</li>
                      <li>✓ 30-day Data Retention Limit</li>
                      <li>✓ User Consent Required</li>
                    </ul>
                  </div>
                  
                  <div className=\"text-center pt-2\">
                    <Badge className=\"text-green-400 bg-green-500/10\">
                      GDPR & CCPA Compliant
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value=\"monitoring\" className=\"space-y-6\">
            <Card className=\"bg-card/95 backdrop-blur border-accent/20\">
              <CardHeader>
                <CardTitle className=\"flex items-center space-x-2\">
                  <Activity className=\"h-5 w-5 text-accent\" />
                  <span>System Health Monitoring</span>
                </CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                {systemHealth && Object.entries(systemHealth).map(([component, health]) => (
                  <div key={component} className={`p-4 rounded-lg border ${getHealthColor(health.health)}`}>
                    <div className=\"flex items-center justify-between mb-2\">
                      <h4 className=\"font-medium capitalize\">{component.replace('_', ' ')}</h4>
                      <div className=\"flex items-center space-x-2\">
                        <Badge className={`text-xs ${getHealthColor(health.health)}`}>
                          {health.health.toUpperCase()}
                        </Badge>
                        {health.autoRepairAttempted && (
                          <Badge className=\"text-xs text-blue-400 bg-blue-500/10\">
                            AUTO-REPAIR
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className=\"grid grid-cols-2 gap-4 text-xs text-muted-foreground\">
                      {health.errorRate !== undefined && (
                        <div>Error Rate: {(health.errorRate * 100).toFixed(2)}%</div>
                      )}
                      {health.latencyP95 !== undefined && (
                        <div>Latency P95: {health.latencyP95}ms</div>
                      )}
                      <div className=\"col-span-2\">
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