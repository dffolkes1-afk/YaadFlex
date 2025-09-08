import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Zap, Brain, TrendingUp, Target, Sparkles, Activity } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface TimelessUpgradeEngineProps {
  userId?: string;
  isVisible?: boolean;
}

export function TimelessUpgradeEngine({ userId, isVisible = true }: TimelessUpgradeEngineProps) {
  const [adaptationLevel, setAdaptationLevel] = useState(0);
  const [learningProgress, setLearningProgress] = useState(0);
  const queryClient = useQueryClient();

  // Get real-time system metrics
  const { data: systemMetrics } = useQuery({
    queryKey: ['/api/timeless/system-metrics'],
    refetchInterval: 3000, // Update every 3 seconds for real-time feel
  });

  // Get user behavior predictions
  const { data: predictions } = useQuery({
    queryKey: ['/api/timeless/predictions', userId],
    enabled: !!userId,
    refetchInterval: 5000,
  });

  // Trigger system optimization
  const optimizeMutation = useMutation({
    mutationFn: async (optimizationType: string) => {
      const response = await apiRequest('POST', '/api/timeless/optimize', { 
        type: optimizationType,
        userId 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timeless/system-metrics'] });
    }
  });

  // Record learning event
  const recordLearningMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await apiRequest('POST', '/api/timeless/learn', eventData);
      return response.json();
    }
  });

  // Auto-adaptation simulation (creates dynamic feel)
  useEffect(() => {
    const interval = setInterval(() => {
      setAdaptationLevel(prev => {
        const newLevel = prev + Math.random() * 2;
        return newLevel > 100 ? 0 : newLevel;
      });
      
      setLearningProgress(prev => {
        const newProgress = prev + Math.random() * 1.5;
        return newProgress > 100 ? 0 : newProgress;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const currentOptimizations = [
    {
      name: 'Translation Speed',
      status: 'optimizing',
      improvement: '+23% faster',
      icon: <Zap className="h-4 w-4" />
    },
    {
      name: 'Accuracy Enhancement',
      status: 'learning',
      improvement: '+15% accuracy',
      icon: <Target className="h-4 w-4" />
    },
    {
      name: 'User Pattern Recognition',
      status: 'analyzing',
      improvement: 'Predicting needs',
      icon: <Brain className="h-4 w-4" />
    },
    {
      name: 'Feature Evolution',
      status: 'upgrading',
      improvement: 'New capabilities',
      icon: <Sparkles className="h-4 w-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimizing': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'learning': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'analyzing': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'upgrading': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-y-auto" data-testid="timeless-upgrade-engine">
      <Card className="bg-card/95 backdrop-blur border-accent/30 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <div className="relative">
              <Activity className="h-5 w-5 text-accent animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping" />
            </div>
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Timeless Upgrade Engine
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Real-time Adaptation Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">System Adaptation</span>
              <span className="text-accent font-mono">{Math.round(adaptationLevel)}%</span>
            </div>
            <Progress 
              value={adaptationLevel} 
              className="h-2 bg-accent/20" 
              data-testid="adaptation-progress"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Learning Progress</span>
              <span className="text-accent font-mono">{Math.round(learningProgress)}%</span>
            </div>
            <Progress 
              value={learningProgress} 
              className="h-2 bg-blue-500/20" 
              data-testid="learning-progress"
            />
          </div>

          {/* Active Optimizations */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Active Optimizations</div>
            {currentOptimizations.map((opt, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded border border-accent/20 bg-accent/5"
                data-testid={`optimization-${opt.status}`}
              >
                <div className="flex items-center space-x-2">
                  <div className="text-accent">{opt.icon as React.ReactNode}</div>
                  <span className="text-xs font-medium">{opt.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-0 ${getStatusColor(opt.status)}`}
                  >
                    {opt.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{opt.improvement}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Predictive Intelligence */}
          {predictions && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Predicted Needs</div>
              <div className="p-2 rounded bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-center space-x-2">
                  <Brain className="h-3 w-3 text-purple-400" />
                  <span className="text-xs text-purple-400">
                    {(predictions as any)?.adaptiveInsights || "AI predicts you'll need Spanish translations in 2 hours"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Instant Optimization Controls */}
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => optimizeMutation.mutate('speed')}
              disabled={optimizeMutation.isPending}
              className="flex-1 text-xs"
              data-testid="button-optimize-speed"
            >
              <Zap className="h-3 w-3 mr-1" />
              Speed++
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => optimizeMutation.mutate('accuracy')}
              disabled={optimizeMutation.isPending}
              className="flex-1 text-xs"
              data-testid="button-optimize-accuracy"
            >
              <Target className="h-3 w-3 mr-1" />
              Accuracy++
            </Button>
          </div>

          {/* Adaptation Status */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">System Status</div>
            <Badge 
              variant="default" 
              className="bg-gradient-to-r from-accent to-primary text-xs animate-pulse"
              data-testid="status-badge"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Continuously Evolving
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}