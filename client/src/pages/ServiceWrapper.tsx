import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Shield, DollarSign, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { getServiceBySlug } from "@/config/services";
import { useToast } from "@/hooks/use-toast";

export default function ServiceWrapper() {
  const [match, params] = useRoute("/wrapper/:service");
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [embedError, setEmbedError] = useState(false);
  
  const serviceName = params?.service as string;
  const config = serviceName ? getServiceBySlug(serviceName) : null;
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!config) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsLoading(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [config]);

  const handleDirectAccess = () => {
    if (config?.externalUrl) {
      window.open(config.externalUrl, '_blank');
      toast({
        title: `Opened ${config.displayName}`,
        description: "External service opened in new tab with YardFlex tracking"
      });
    }
  };

  const handleEmbedError = () => {
    setEmbedError(true);
    toast({
      title: "Embedding Failed", 
      description: `${config?.displayName} cannot be embedded. Click to open in new tab.`,
      variant: "destructive"
    });
  };

  if (!match || !config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-red-600" data-testid="text-error-title">Service Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4" data-testid="text-error-message">The requested service wrapper is not available.</p>
            <Link to="/super-app">
              <Button data-testid="button-back-to-hub">Back to Super-App Hub</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <div className={`w-16 h-16 mx-auto rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center mb-4`}>
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-center text-2xl" data-testid="text-loading-title">
              Launching {config.displayName}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-yellow-500" data-testid="text-countdown">
              {countdown}
            </div>
            <p className="text-lg" data-testid="text-loading-message">
              Connecting to {config.displayName} through YardFlex secure wrapper...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400" data-testid="text-loading-subtitle">
              {config.description}
            </p>
            
            {config.warning && (
              <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 p-3 rounded-r-lg">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-yellow-600 mr-2" />
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm" data-testid="text-service-warning">
                    {config.warning}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <p className="text-blue-800 dark:text-blue-200 font-semibold" data-testid="text-revenue-info">
                  Powered by YardFlex
                </p>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-xs" data-testid="text-revenue-details">
                A small service fee supports YardFlex development and fair platform economics
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/super-app">
            <Button variant="outline" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
          </Link>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center`}>
            <config.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-service-title">
              {config.displayName} via YardFlex
            </h1>
            <p className="text-gray-600 dark:text-gray-400" data-testid="text-service-subtitle">
              {config.description}
            </p>
          </div>
        </div>

        {/* Service Access */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-access-title">
              <Shield className="w-5 h-5 text-green-600" />
              Secure Access via YardFlex
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {config.embedSupported && !embedError ? (
                /* Embedded Service */
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2 min-h-96 border">
                  <div className="flex items-center justify-between mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Wrapped by YardFlex • All activity tracked
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleDirectAccess}
                      data-testid="button-open-external"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open External
                    </Button>
                  </div>
                  <iframe 
                    src={config.externalUrl}
                    className="w-full h-96 rounded border-0"
                    title={`${config.displayName} - Powered by YardFlex`}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    data-testid="iframe-embedded-service"
                    onError={handleEmbedError}
                    onLoad={(e) => {
                      const iframe = e.target as HTMLIFrameElement;
                      try {
                        // Test if iframe loaded successfully
                        if (!iframe.contentDocument && !iframe.contentWindow) {
                          handleEmbedError();
                        }
                      } catch (error) {
                        // Cross-origin iframe - this is expected for external sites
                        console.log(`${config.displayName} loaded in iframe (cross-origin)`);
                      }
                    }}
                  />
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      🔒 Secure embedded access • Revenue sharing active • Data protected
                    </p>
                  </div>
                </div>
              ) : (
                /* External Launch */
                <div>
                  {embedError && (
                    <div className="bg-orange-100 dark:bg-orange-900/20 border-l-4 border-orange-500 p-3 rounded-r-lg mb-4">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                        <p className="text-orange-800 dark:text-orange-200 text-sm">
                          {config.displayName} cannot be embedded due to security restrictions. Opening in new tab instead.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2" data-testid="text-security-title">
                      🔒 Protected Connection
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm" data-testid="text-security-details">
                      Your activity is tracked through YardFlex for enhanced security and revenue sharing.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleDirectAccess}
                      className="flex-1"
                      data-testid="button-launch-service"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Launch {config.displayName}
                    </Button>
                    
                    <Link to="/super-app" className="flex-1">
                      <Button variant="outline" className="w-full" data-testid="button-choose-different">
                        Choose Different Service
                      </Button>
                    </Link>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4" data-testid="text-disclaimer">
                    External service • Wrapped by YardFlex • Revenue sharing applies
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* YardFlex Alternative Suggestion */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200" data-testid="text-alternative-title">
                💡 Try YardFlex Native Services
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm" data-testid="text-alternative-description">
                Get better rates, more features, and keep 85% of earnings with YardFlex's own services
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <Link to="/ride-booking">
                  <Button size="sm" variant="outline" data-testid="button-native-rides">YardFlex Rides</Button>
                </Link>
                <Link to="/wallet">
                  <Button size="sm" variant="outline" data-testid="button-native-wallet">YardFlex Wallet</Button>
                </Link>
                <Link to="/media-hub">
                  <Button size="sm" variant="outline" data-testid="button-native-media">YardFlex Media</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}