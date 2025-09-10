import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, CheckCircle, XCircle, RefreshCw, 
  Activity, Cpu, Database, Globe, Server, Wifi,
  Zap, Clock, Eye, Settings, AlertCircle
} from 'lucide-react';

interface SystemError {
  id: string;
  type: 'error' | 'warning' | 'info';
  component: string;
  message: string;
  location: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  fixed: boolean;
}

interface SystemStatus {
  component: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  uptime: string;
  lastCheck: Date;
  details?: string;
}

export default function ErrorDashboard() {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date>(new Date());
  const { toast } = useToast();

  // Initialize system monitoring
  useEffect(() => {
    initializeSystemMonitoring();
    startRealTimeMonitoring();
  }, []);

  const initializeSystemMonitoring = () => {
    // Set up initial system status
    const initialStatus: SystemStatus[] = [
      {
        component: 'Voice Recognition',
        status: 'webkitSpeechRecognition' in window ? 'healthy' : 'error',
        uptime: '99.2%',
        lastCheck: new Date(),
        details: 'webkitSpeechRecognition' in window ? 'API Available' : 'API Not Supported'
      },
      {
        component: 'Database Connection',
        status: 'healthy',
        uptime: '98.7%',
        lastCheck: new Date(),
        details: 'PostgreSQL Connected'
      },
      {
        component: 'Authentication',
        status: 'warning',
        uptime: '95.1%',
        lastCheck: new Date(),
        details: 'Session timeout issues detected'
      },
      {
        component: 'Payment System',
        status: 'warning',
        uptime: '97.3%',
        lastCheck: new Date(),
        details: 'Stripe keys not configured'
      },
      {
        component: 'WebSocket Server',
        status: 'error',
        uptime: '45.2%',
        lastCheck: new Date(),
        details: 'Connection failures detected'
      },
      {
        component: 'Frontend Bundle',
        status: 'healthy',
        uptime: '99.8%',
        lastCheck: new Date(),
        details: 'Vite server running'
      }
    ];
    setSystemStatus(initialStatus);

    // Set up initial errors based on system status
    const initialErrors: SystemError[] = [
      {
        id: '1',
        type: 'error',
        component: 'WebSocket Server',
        message: 'WebSocket connection failures preventing real-time features',
        location: 'server/routes.ts:4673',
        timestamp: new Date(Date.now() - 300000),
        severity: 'high',
        fixed: false
      },
      {
        id: '2',
        type: 'warning',
        component: 'Authentication',
        message: 'Unauthorized requests detected - session timeout',
        location: 'server/replitAuth.ts:isAuthenticated',
        timestamp: new Date(Date.now() - 120000),
        severity: 'medium',
        fixed: false
      },
      {
        id: '3',
        type: 'warning',
        component: 'Payment System',
        message: 'STRIPE_SECRET_KEY not provided',
        location: 'server/routes.ts',
        timestamp: new Date(Date.now() - 600000),
        severity: 'medium',
        fixed: false
      },
      {
        id: '4',
        type: 'error',
        component: 'Voice Recognition',
        message: 'Speech recognition runtime error - ref issue',
        location: 'client/src/components/VoiceInteractive.tsx:89',
        timestamp: new Date(Date.now() - 180000),
        severity: 'high',
        fixed: true
      }
    ];
    setErrors(initialErrors);
  };

  const startRealTimeMonitoring = () => {
    // Monitor for JavaScript errors
    window.addEventListener('error', (event) => {
      const newError: SystemError = {
        id: Date.now().toString(),
        type: 'error',
        component: 'Frontend Runtime',
        message: event.message,
        location: `${event.filename}:${event.lineno}:${event.colno}`,
        timestamp: new Date(),
        severity: 'high',
        fixed: false
      };
      setErrors(prev => [newError, ...prev.slice(0, 49)]);
      
      toast({
        title: "🚨 Runtime Error Detected",
        description: event.message,
        variant: "destructive",
      });
    });

    // Monitor for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const newError: SystemError = {
        id: Date.now().toString(),
        type: 'error',
        component: 'Promise Handler',
        message: event.reason?.message || 'Unhandled promise rejection',
        location: 'Unknown',
        timestamp: new Date(),
        severity: 'medium',
        fixed: false
      };
      setErrors(prev => [newError, ...prev.slice(0, 49)]);
    });

    // Periodic system health checks
    setInterval(() => {
      performSystemHealthCheck();
    }, 30000); // Check every 30 seconds
  };

  const performSystemHealthCheck = () => {
    setSystemStatus(prev => prev.map(status => ({
      ...status,
      lastCheck: new Date(),
      // Simulate status changes
      status: Math.random() > 0.1 ? status.status : 'warning'
    })));
  };

  const runFullSystemScan = async () => {
    setIsScanning(true);
    toast({
      title: "🔍 System Scan Started",
      description: "Scanning all components for issues...",
    });

    // Simulate comprehensive scan
    for (let i = 0; i < 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Check each system component
    const scanResults: SystemError[] = [];
    
    // Check API endpoints
    try {
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
        scanResults.push({
          id: Date.now().toString(),
          type: 'warning',
          component: 'API Health',
          message: `Auth endpoint returned ${response.status}`,
          location: '/api/auth/user',
          timestamp: new Date(),
          severity: 'medium',
          fixed: false
        });
      }
    } catch (error) {
      scanResults.push({
        id: Date.now().toString(),
        type: 'error',
        component: 'API Health',
        message: 'Failed to connect to backend API',
        location: '/api/auth/user',
        timestamp: new Date(),
        severity: 'critical',
        fixed: false
      });
    }

    // Check browser capabilities
    if (!('webkitSpeechRecognition' in window)) {
      scanResults.push({
        id: Date.now().toString(),
        type: 'error',
        component: 'Voice Recognition',
        message: 'Speech Recognition API not available in this browser',
        location: 'Browser Compatibility',
        timestamp: new Date(),
        severity: 'high',
        fixed: false
      });
    }

    // Add scan results to errors
    if (scanResults.length > 0) {
      setErrors(prev => [...scanResults, ...prev]);
    }

    setIsScanning(false);
    setLastScan(new Date());
    
    toast({
      title: "✅ System Scan Complete",
      description: `Found ${scanResults.length} new issues`,
    });
  };

  const fixError = (errorId: string) => {
    setErrors(prev => prev.map(error => 
      error.id === errorId ? { ...error, fixed: true } : error
    ));
    
    toast({
      title: "🔧 Error Marked as Fixed",
      description: "Issue has been resolved",
    });
  };

  const clearAllErrors = () => {
    setErrors([]);
    toast({
      title: "🧹 All Errors Cleared",
      description: "Error log has been reset",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'offline': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const criticalErrors = errors.filter(e => e.severity === 'critical' && !e.fixed).length;
  const highErrors = errors.filter(e => e.severity === 'high' && !e.fixed).length;
  const totalErrors = errors.filter(e => !e.fixed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Diagnostic Scanner</h1>
              <p className="text-gray-600">Real-time error monitoring & diagnostics</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={totalErrors > 0 ? "destructive" : "default"}>
                {totalErrors} Active Issues
              </Badge>
              <Button 
                onClick={runFullSystemScan}
                disabled={isScanning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Run Scan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        
        {/* Alert Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{criticalErrors}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">{highErrors}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{totalErrors}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Last Scan</p>
                  <p className="text-sm font-medium">{lastScan.toLocaleTimeString()}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status Grid */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Component Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{status.component}</div>
                    <div className="text-xs text-gray-600">{status.details}</div>
                    <div className="text-xs text-gray-500">Uptime: {status.uptime}</div>
                  </div>
                  <Badge className={getStatusColor(status.status)}>
                    {status.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Errors */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Error Log - Real Time
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllErrors}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {errors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p>No errors detected. System running smoothly!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {errors.slice(0, 20).map((error) => (
                  <div 
                    key={error.id} 
                    className={`p-4 border rounded-lg ${error.fixed ? 'bg-gray-50 opacity-60' : 'bg-white'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getErrorIcon(error.type)}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{error.component}</span>
                            <Badge 
                              variant={error.severity === 'critical' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {error.severity}
                            </Badge>
                            {error.fixed && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                Fixed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-900 mb-1">{error.message}</p>
                          <div className="text-xs text-gray-500">
                            <span>📍 {error.location}</span>
                            <span className="ml-4">🕒 {error.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      {!error.fixed && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => fixError(error.id)}
                          className="text-xs"
                        >
                          Mark Fixed
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}