import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  AlertTriangle, XCircle, CheckCircle, RefreshCw, 
  Activity, Zap, Eye, Settings, AlertCircle, Wifi, Server
} from 'lucide-react';

interface LiveError {
  id: string;
  type: 'critical' | 'error' | 'warning';
  component: string;
  message: string;
  location: string;
  timestamp: Date;
  count: number;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    frontend: 'healthy' | 'warning' | 'error';
    backend: 'healthy' | 'warning' | 'error';
    voice: 'healthy' | 'warning' | 'error';
    database: 'healthy' | 'warning' | 'error';
  };
}

export function BuiltInErrorMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<LiveError[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    components: {
      frontend: 'healthy',
      backend: 'warning',
      voice: 'error',
      database: 'healthy'
    }
  });
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeErrorMonitoring();
    startLiveMonitoring();
  }, []);

  const initializeErrorMonitoring = () => {
    // Real-time JavaScript error monitoring
    window.addEventListener('error', (event) => {
      const newError: LiveError = {
        id: Date.now().toString(),
        type: 'error',
        component: 'Frontend Runtime',
        message: event.message,
        location: `${event.filename}:${event.lineno}:${event.colno}`,
        timestamp: new Date(),
        count: 1
      };
      addError(newError);
      showWarningToast(newError);
    });

    // Promise rejection monitoring
    window.addEventListener('unhandledrejection', (event) => {
      const newError: LiveError = {
        id: Date.now().toString(),
        type: 'error',
        component: 'Promise Handler',
        message: event.reason?.message || 'Unhandled promise rejection',
        location: 'Runtime',
        timestamp: new Date(),
        count: 1
      };
      addError(newError);
      showWarningToast(newError);
    });

    // Console error monitoring
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      const newError: LiveError = {
        id: Date.now().toString(),
        type: 'warning',
        component: 'Console',
        message: errorMessage,
        location: 'Console Output',
        timestamp: new Date(),
        count: 1
      };
      addError(newError);
      originalConsoleError.apply(console, args);
    };

    // Check existing issues
    checkCurrentIssues();
  };

  const checkCurrentIssues = () => {
    const initialErrors: LiveError[] = [];

    // Check if voice recognition is working
    if (!('webkitSpeechRecognition' in window)) {
      initialErrors.push({
        id: 'voice-not-supported',
        type: 'error',
        component: 'Voice Recognition',
        message: 'Speech Recognition API not supported in this browser',
        location: 'Browser Compatibility',
        timestamp: new Date(),
        count: 1
      });
    }

    // Check backend connection
    fetch('/api/auth/user')
      .then(response => {
        if (!response.ok) {
          initialErrors.push({
            id: 'auth-failed',
            type: 'warning',
            component: 'Authentication',
            message: `Auth endpoint returned ${response.status} - Unauthorized`,
            location: '/api/auth/user',
            timestamp: new Date(),
            count: 1
          });
        }
      })
      .catch(error => {
        initialErrors.push({
          id: 'backend-offline',
          type: 'critical',
          component: 'Backend API',
          message: 'Cannot connect to backend server',
          location: 'Network Connection',
          timestamp: new Date(),
          count: 1
        });
      });

    if (initialErrors.length > 0) {
      setErrors(initialErrors);
      updateSystemHealth();
    }
  };

  const addError = (newError: LiveError) => {
    setErrors(prev => {
      // Check if similar error already exists
      const existingError = prev.find(e => 
        e.component === newError.component && 
        e.message === newError.message
      );
      
      if (existingError) {
        // Update count and timestamp
        return prev.map(e => 
          e.id === existingError.id 
            ? { ...e, count: e.count + 1, timestamp: new Date() }
            : e
        );
      } else {
        // Add new error
        return [newError, ...prev.slice(0, 19)]; // Keep last 20 errors
      }
    });
    
    updateSystemHealth();
    setIsVisible(true); // Show monitor when error occurs
  };

  const updateSystemHealth = () => {
    setSystemHealth(prev => {
      const criticalErrors = errors.filter(e => e.type === 'critical').length;
      const errorCount = errors.filter(e => e.type === 'error').length;
      const warningCount = errors.filter(e => e.type === 'warning').length;

      let overall: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (criticalErrors > 0) overall = 'critical';
      else if (errorCount > 0) overall = 'warning';
      else if (warningCount > 2) overall = 'warning';

      return {
        ...prev,
        overall
      };
    });
  };

  const showWarningToast = (error: LiveError) => {
    const title = error.type === 'critical' ? '🚨 CRITICAL ERROR' :
                  error.type === 'error' ? '⚠️ ERROR DETECTED' : '⚠️ WARNING';
    
    toast({
      title,
      description: `${error.component}: ${error.message}`,
      variant: error.type === 'critical' || error.type === 'error' ? "destructive" : "default",
    });

    // Also log to database
    logErrorToDatabase(error);
  };

  const logErrorToDatabase = async (error: LiveError) => {
    try {
      await apiRequest('POST', '/api/observability/errors', {
        subsystemName: 'frontend',
        errorType: error.type,
        component: error.component,
        message: error.message,
        location: error.location,
        metadata: { timestamp: error.timestamp, count: error.count }
      });
    } catch (dbError) {
      console.log('Failed to log error to database:', dbError);
    }
  };

  const startLiveMonitoring = () => {
    // Continuous health monitoring
    setInterval(() => {
      performHealthCheck();
    }, 10000); // Check every 10 seconds
  };

  const performHealthCheck = async () => {
    setIsScanning(true);
    
    // Check various system components
    const healthChecks = [
      checkBackendHealth(),
      checkVoiceHealth(),
      checkDatabaseHealth()
    ];

    await Promise.all(healthChecks);
    setIsScanning(false);
  };

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (!response.ok && response.status !== 401) {
        // 401 is expected when not logged in, but other errors are issues
        const error: LiveError = {
          id: 'backend-health-' + Date.now(),
          type: 'warning',
          component: 'Backend Health',
          message: `Server returned status ${response.status}`,
          location: '/api/auth/user',
          timestamp: new Date(),
          count: 1
        };
        addError(error);
      }
    } catch (error) {
      const networkError: LiveError = {
        id: 'network-' + Date.now(),
        type: 'critical',
        component: 'Network',
        message: 'Cannot reach backend server',
        location: 'Network Connection',
        timestamp: new Date(),
        count: 1
      };
      addError(networkError);
    }
  };

  const checkVoiceHealth = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setSystemHealth(prev => ({
        ...prev,
        components: { ...prev.components, voice: 'error' }
      }));
    }
  };

  const checkDatabaseHealth = () => {
    // This would normally check database connectivity
    // For now, assume it's healthy unless we get specific errors
    setSystemHealth(prev => ({
      ...prev,
      components: { ...prev.components, database: 'healthy' }
    }));
  };

  const clearError = (errorId: string) => {
    setErrors(prev => prev.filter(e => e.id !== errorId));
    updateSystemHealth();
  };

  const clearAllErrors = () => {
    setErrors([]);
    setSystemHealth(prev => ({ ...prev, overall: 'healthy' }));
    toast({
      title: "✅ All Errors Cleared",
      description: "Error monitor reset",
    });
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-gray-400';
      case 'warning': return 'bg-amber-400';
      case 'critical': return 'bg-red-400';
      case 'error': return 'bg-red-400';
      default: return 'bg-gray-300';
    }
  };

  const getHealthText = (status: string) => {
    switch (status) {
      case 'healthy': return 'All Good';
      case 'warning': return 'Issues Found';
      case 'critical': return 'Critical Error';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  // Calculate total active errors
  const totalErrors = errors.length;
  const criticalCount = errors.filter(e => e.type === 'critical').length;

  return (
    <>
      {/* Sleek Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div 
          className={`flex items-center gap-2 px-3 py-2 rounded-md shadow-sm cursor-pointer transition-all border ${
            systemHealth.overall === 'healthy' 
              ? 'bg-white border-gray-200 text-gray-700' 
              : systemHealth.overall === 'warning'
              ? 'bg-white border-amber-200 text-amber-700'
              : 'bg-white border-red-200 text-red-700'
          }`}
          onClick={() => setIsVisible(!isVisible)}
        >
          {isScanning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : systemHealth.overall === 'healthy' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span className="text-xs font-medium">
            {getHealthText(systemHealth.overall)}
          </span>
          {totalErrors > 0 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs border-0">
              {totalErrors}
            </Badge>
          )}
        </div>
      </div>

      {/* Sleek Monitor Panel */}
      {isVisible && (
        <div className="fixed top-16 right-4 w-96 max-h-96 z-50">
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <span className="font-medium text-sm">System Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={clearAllErrors}
                    className="text-xs h-6"
                  >
                    Clear
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setIsVisible(false)}
                    className="text-xs h-6"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* System Status */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.entries(systemHealth.components).map(([component, status]) => (
                  <div key={component} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${getHealthColor(status)}`} />
                    <span className="capitalize">{component}</span>
                  </div>
                ))}
              </div>

              {/* Error List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {errors.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-xs">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    System running smoothly
                  </div>
                ) : (
                  errors.slice(0, 10).map((error) => (
                    <div key={error.id} className="bg-gray-50 p-3 rounded border border-gray-100 text-xs">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          {error.type === 'critical' ? (
                            <XCircle className="h-3 w-3 text-red-400 mt-0.5" />
                          ) : error.type === 'error' ? (
                            <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-gray-400 mt-0.5" />
                          )}
                          <div>
                            <div className="font-medium">{error.component}</div>
                            <div className="text-gray-700">{error.message}</div>
                            <div className="text-gray-500">
                              📍 {error.location}
                              {error.count > 1 && ` (${error.count}x)`}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => clearError(error.id)}
                          className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-3 border-t">
                <Button 
                  size="sm" 
                  onClick={performHealthCheck}
                  disabled={isScanning}
                  className="w-full text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Activity className="h-3 w-3 mr-1" />
                      Run Health Check
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}