import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { Brain, Zap, Shield, Eye } from 'lucide-react';

interface AIStatus {
  mode: string;
  isRunning: boolean;
  status: {
    isRunning: boolean;
    killSwitch: boolean;
    lastCheck: string;
  };
  aiControlled: boolean;
  timestamp: string;
}

export function AIAutonomousStatus() {
  const [isVisible, setIsVisible] = useState(false);

  // Query AI status every 5 seconds
  const { data: aiStatus, isLoading } = useQuery<AIStatus>({
    queryKey: ['/api/ai/status'],
    refetchInterval: 5000,
    retry: false,
  });

  // Auto-hide after 10 seconds if everything is running well
  useEffect(() => {
    if (aiStatus?.isRunning) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [aiStatus]);

  if (isLoading || !aiStatus) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Minimized indicator when hidden */}
      {!isVisible && aiStatus.isRunning && (
        <div 
          className="cursor-pointer animate-pulse"
          onClick={() => setIsVisible(true)}
          data-testid="ai-status-minimized"
        >
          <Badge 
            variant={aiStatus.isRunning ? "default" : "destructive"}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2"
          >
            <Brain className="w-4 h-4 mr-1" />
            AI
          </Badge>
        </div>
      )}

      {/* Full status panel when visible */}
      {isVisible && (
        <Card className="w-80 shadow-lg border-emerald-500/50 bg-slate-900/95 backdrop-blur-sm" data-testid="ai-status-panel">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-emerald-400">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>YaadFlex AI Control</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white"
                data-testid="button-hide-ai-status"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* AI Mode Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Mode:</span>
              <Badge 
                variant={aiStatus.mode === 'FULL_AUTONOMY' ? "default" : "secondary"}
                className="bg-emerald-600 text-white"
                data-testid="badge-ai-mode"
              >
                <Zap className="w-3 h-3 mr-1" />
                {aiStatus.mode}
              </Badge>
            </div>

            {/* AI Running Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">AI Agent:</span>
              <Badge 
                variant={aiStatus.isRunning ? "default" : "destructive"}
                className={aiStatus.isRunning ? "bg-emerald-600" : "bg-red-600"}
                data-testid="badge-ai-running"
              >
                <Eye className="w-3 h-3 mr-1" />
                {aiStatus.isRunning ? 'ACTIVE' : 'STOPPED'}
              </Badge>
            </div>

            {/* Kill Switch Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Safety:</span>
              <Badge 
                variant={aiStatus.status.killSwitch ? "destructive" : "default"}
                className={!aiStatus.status.killSwitch ? "bg-emerald-600" : "bg-red-600"}
                data-testid="badge-kill-switch"
              >
                <Shield className="w-3 h-3 mr-1" />
                {aiStatus.status.killSwitch ? 'KILL SWITCH ON' : 'AUTONOMOUS'}
              </Badge>
            </div>

            {/* Last Check */}
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
              Last check: {new Date(aiStatus.status.lastCheck).toLocaleTimeString()}
            </div>

            {/* AI Control Confirmation */}
            {aiStatus.aiControlled && (
              <div className="text-center pt-2">
                <div className="text-xs text-emerald-400 font-medium animate-pulse">
                  ✨ YaadFlex is fully AI-controlled ✨
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}