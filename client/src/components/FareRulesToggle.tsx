import { useQuery, useMutation } from '@tanstack/react-query';
import { Switch } from "@radix-ui/react-switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, MapPin, Clock, Car, DollarSign, Route, Calendar, AlertTriangle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FareRule } from "@shared/schema";

interface FareRulesToggleProps {
  onRuleToggle?: (ruleId: string, enabled: boolean) => void;
  isAdmin?: boolean;
}

export function FareRulesToggle({ onRuleToggle, isAdmin = false }: FareRulesToggleProps) {
  const { toast } = useToast();

  // Fetch fare rules from backend
  const { data: rules = [], isLoading, error } = useQuery<FareRule[]>({
    queryKey: ['/api/fare-rules'],
    retry: false,
  });

  // Individual rule toggle mutation
  const toggleRuleMutation = useMutation({
    mutationFn: async ({ ruleId, enabled }: { ruleId: string; enabled: boolean }) => {
      const response = await apiRequest('PUT', `/api/fare-rules/${ruleId}/toggle`, { enabled });
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Rule Updated",
        description: `Fare rule ${variables.enabled ? 'enabled' : 'disabled'} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/fare-rules'] });
      onRuleToggle?.(variables.ruleId, variables.enabled);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update fare rule. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Batch enable all rules mutation
  const enableAllMutation = useMutation({
    mutationFn: async () => {
      const ruleIds = rules.map(rule => rule.id);
      const response = await apiRequest('PUT', '/api/fare-rules/batch', {
        ruleIds,
        isEnabled: true
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "All Rules Enabled",
        description: "All fare rules have been activated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/fare-rules'] });
    },
    onError: () => {
      toast({
        title: "Batch Update Failed",
        description: "Failed to enable all rules. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Batch disable all rules mutation
  const disableAllMutation = useMutation({
    mutationFn: async () => {
      const ruleIds = rules.map(rule => rule.id);
      const response = await apiRequest('PUT', '/api/fare-rules/batch', {
        ruleIds,
        isEnabled: false
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "All Rules Disabled",
        description: "All fare rules have been deactivated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/fare-rules'] });
    },
    onError: () => {
      toast({
        title: "Batch Update Failed",
        description: "Failed to disable all rules. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (ruleId: string, enabled: boolean) => {
    toggleRuleMutation.mutate({ ruleId, enabled });
  };

  const getRuleIcon = (ruleName: string) => {
    switch (ruleName) {
      case 'airport_extra': return <MapPin className="h-4 w-4" />;
      case 'tour_excursion_fee': return <Route className="h-4 w-4" />;
      case 'hilly_area': return <MapPin className="h-4 w-4" />;
      case 'full_car_load': return <Car className="h-4 w-4" />;
      case 'peak_hour_factor': return <Clock className="h-4 w-4" />;
      case 'traffic_factor': return <Car className="h-4 w-4" />;
      case 'extra_stops': return <Route className="h-4 w-4" />;
      case 'fixed_fare_mode': return <DollarSign className="h-4 w-4" />;
      case 'time_based_mode': return <Calendar className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const formatRuleValue = (rule: FareRule) => {
    const value = rule.value ? (typeof rule.value === 'string' ? parseFloat(rule.value) : rule.value) : 0;
    switch (rule.ruleType) {
      case 'multiplier':
        return `${value}x`;
      case 'fixed_amount':
        return `${rule.currency} $${value.toFixed(2)}`;
      case 'percentage':
        return `+${value}%`;
      case 'mode':
        return 'Mode';
      default:
        return value?.toString() || 'N/A';
    }
  };

  const enabledRulesCount = rules.filter(rule => rule.isEnabled).length;

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-black/40 via-emerald-900/20 to-amber-900/20 border-emerald-500/30 backdrop-blur-md" data-testid="card-fare-rules">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48 bg-gray-700/50" />
            <Skeleton className="h-6 w-16 bg-gray-700/50" />
          </div>
          <Skeleton className="h-4 w-64 bg-gray-700/50" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-black/30 to-gray-900/30 border border-gray-700/50">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-8 w-8 rounded-full bg-gray-700/50" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1 bg-gray-700/50" />
                  <Skeleton className="h-3 w-48 bg-gray-700/50" />
                </div>
              </div>
              <Skeleton className="h-6 w-11 rounded-full bg-gray-700/50" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-gradient-to-br from-black/40 via-red-900/20 to-amber-900/20 border-red-500/30 backdrop-blur-md" data-testid="card-fare-rules">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Failed to Load Fare Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-500/30 bg-red-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-300">
              Unable to fetch fare rules from server. Please refresh the page or try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-black/40 via-emerald-900/20 to-amber-900/20 border-emerald-500/30 backdrop-blur-md" data-testid="card-fare-rules">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-400" />
            YardFlex Fare Rules
          </CardTitle>
          <Badge 
            variant={enabledRulesCount > 0 ? "default" : "secondary"}
            className={`${enabledRulesCount > 0 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
              : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
            } px-3 py-1`}
            data-testid="badge-enabled-rules"
          >
            {enabledRulesCount} Active
          </Badge>
        </div>
        <p className="text-sm text-gray-300">
          Configure dynamic pricing rules with luxury toggle controls
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {rules.map((rule, index) => (
          <div key={rule.id}>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-black/30 to-gray-900/30 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-full ${rule.isEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-gray-500/20 text-gray-400'
                } transition-colors duration-300`}>
                  {getRuleIcon(rule.ruleName)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${rule.isEnabled 
                      ? 'text-emerald-300' 
                      : 'text-gray-300'
                    } transition-colors duration-300`}>
                      {rule.displayName}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-amber-500/10 text-amber-300 border-amber-500/30"
                      data-testid={`badge-rule-value-${rule.ruleName}`}
                    >
                      {formatRuleValue(rule)}
                    </Badge>
                  </div>
                  <p className={`text-sm ${rule.isEnabled 
                    ? 'text-emerald-200/80' 
                    : 'text-gray-400'
                  } transition-colors duration-300`}>
                    {rule.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Custom Toggle Switch with Premium Design */}
                <div className="relative">
                  <Switch
                    checked={rule.isEnabled || false}
                    onCheckedChange={(enabled) => handleToggle(rule.id, enabled)}
                    disabled={toggleRuleMutation.isPending}
                    className={`
                      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                      ${rule.isEnabled 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30' 
                        : 'bg-gray-600/50'
                      }
                      ${toggleRuleMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    data-testid={`toggle-${rule.ruleName}`}
                  >
                    <span
                      className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 
                        transition duration-200 ease-in-out
                        ${rule.isEnabled 
                          ? 'translate-x-5 bg-white shadow-emerald-300/50' 
                          : 'translate-x-0 bg-gray-300'
                        }
                      `}
                    />
                  </Switch>
                  
                  {/* Glow Effect for Active Toggles */}
                  {rule.isEnabled && (
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-sm animate-pulse" />
                  )}
                </div>

                {/* Status Text */}
                <span className={`text-xs font-medium w-8 ${rule.isEnabled 
                  ? 'text-emerald-400' 
                  : 'text-gray-500'
                } transition-colors duration-300`}>
                  {rule.isEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
            
            {/* Separator except for last item */}
            {index < rules.length - 1 && (
              <Separator className="my-2 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
            )}
          </div>
        ))}

        {/* Summary Section */}
        {enabledRulesCount > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-emerald-900/20 to-amber-900/20 border border-emerald-500/30">
            <h4 className="font-semibold text-emerald-300 mb-2">Active Rules Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {rules.filter(rule => rule.isEnabled).map(rule => (
                <div key={rule.id} className="flex justify-between text-gray-300">
                  <span>{rule.displayName}</span>
                  <span className="text-amber-300 font-medium">{formatRuleValue(rule)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-amber-900/20 to-red-900/20 border border-amber-500/30">
            <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin Controls
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => enableAllMutation.mutate()}
                disabled={enableAllMutation.isPending || rules.length === 0}
                className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-enable-all"
              >
                {enableAllMutation.isPending ? 'Enabling...' : 'Enable All'}
              </button>
              <button 
                onClick={() => disableAllMutation.mutate()}
                disabled={disableAllMutation.isPending || rules.length === 0}
                className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-disable-all"
              >
                {disableAllMutation.isPending ? 'Disabling...' : 'Disable All'}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}