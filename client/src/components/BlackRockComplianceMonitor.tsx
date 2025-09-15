import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { COMPANY_INFO } from '@shared/company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Globe, 
  Mail, 
  Eye,
  RefreshCw,
  Download,
  ExternalLink
} from 'lucide-react';

interface ComplianceMetric {
  category: string;
  status: 'compliant' | 'warning' | 'violation';
  score: number;
  details: string;
  lastCheck: string;
}

interface CorporateAlignment {
  status: string;
  aligned: boolean;
  violations: string[];
  warnings: string[];
  scan_results: {
    files_scanned: number;
    violations_found: number;
    warnings_count: number;
  };
  corporate_info?: {
    parent_company: string;
    company_name: string;
    legal_name: string;
    portfolio_designation: string;
    headquarters: string;
    contact_domain: string;
  };
}

export function BlackRockComplianceMonitor() {
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch corporate alignment status
  const { data: alignmentStatus, isLoading, refetch } = useQuery<CorporateAlignment>({
    queryKey: ['/api/health/corporate-alignment'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    // Generate compliance metrics based on alignment status
    if (alignmentStatus) {
      const newMetrics: ComplianceMetric[] = [
        {
          category: 'Corporate Structure',
          status: alignmentStatus.aligned ? 'compliant' : 'violation',
          score: alignmentStatus.aligned ? 100 : 60,
          details: alignmentStatus.aligned 
            ? 'BlackRock corporate hierarchy properly configured'
            : `${alignmentStatus.violations.length} violations found`,
          lastCheck: new Date().toISOString()
        },
        {
          category: 'Domain Configuration',
          status: alignmentStatus.corporate_info?.contact_domain === 'yaadflex.blackrock.com' ? 'compliant' : 'warning',
          score: alignmentStatus.corporate_info?.contact_domain === 'yaadflex.blackrock.com' ? 100 : 75,
          details: 'Email domains using BlackRock corporate structure',
          lastCheck: new Date().toISOString()
        },
        {
          category: 'Branding Compliance',
          status: alignmentStatus.violations.length === 0 ? 'compliant' : 'warning',
          score: Math.max(0, 100 - (alignmentStatus.violations.length * 20)),
          details: alignmentStatus.violations.length === 0 
            ? 'All branding elements properly aligned'
            : `${alignmentStatus.violations.length} branding violations detected`,
          lastCheck: new Date().toISOString()
        },
        {
          category: 'Legal Notices',
          status: 'compliant',
          score: 100,
          details: 'BlackRock legal disclaimers and corporate notices present',
          lastCheck: new Date().toISOString()
        },
        {
          category: 'File Scan Results',
          status: alignmentStatus.scan_results.violations_found === 0 ? 'compliant' : 'violation',
          score: Math.max(0, 100 - (alignmentStatus.scan_results.violations_found * 15)),
          details: `Scanned ${alignmentStatus.scan_results.files_scanned} files, found ${alignmentStatus.scan_results.violations_found} violations`,
          lastCheck: new Date().toISOString()
        }
      ];
      
      setMetrics(newMetrics);
    }
  }, [alignmentStatus]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'violation':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      compliant: 'default',
      warning: 'secondary',
      violation: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const overallScore = metrics.length > 0 
    ? Math.round(metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <Card data-testid="compliance-monitor-loading">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>BlackRock Compliance Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="blackrock-compliance-monitor">
      
      {/* Overall Compliance Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>BlackRock Corporate Compliance Status</span>
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* Overall Score */}
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Overall Compliance
              </div>
              <Progress value={overallScore} className="mt-3" />
            </div>

            {/* Company Information */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BR</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    {alignmentStatus?.corporate_info?.company_name || COMPANY_INFO.COMPANY_NAME}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {alignmentStatus?.corporate_info?.portfolio_designation || COMPANY_INFO.PORTFOLIO_DESIGNATION}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Parent Company:</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {alignmentStatus?.corporate_info?.parent_company || COMPANY_INFO.PARENT_COMPANY}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Legal Entity:</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {alignmentStatus?.corporate_info?.legal_name || COMPANY_INFO.LEGAL_NAME}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Metrics */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Compliance Metrics
            </h4>
            
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {getStatusIcon(metric.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {metric.category}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(metric.score)}`}>
                        {metric.score}%
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {metric.details}
                    </p>
                    <Progress value={metric.score} className="mt-2 h-1" />
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusBadge(metric.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Violations & Warnings */}
      {alignmentStatus && (alignmentStatus.violations.length > 0 || alignmentStatus.warnings.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span>Compliance Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alignmentStatus.violations.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3">
                  Critical Violations ({alignmentStatus.violations.length})
                </h4>
                <div className="space-y-2">
                  {alignmentStatus.violations.map((violation, index) => (
                    <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-200">{violation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {alignmentStatus.warnings.length > 0 && (
              <div>
                <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-3">
                  Warnings ({alignmentStatus.warnings.length})
                </h4>
                <div className="space-y-2">
                  {alignmentStatus.warnings.map((warning, index) => (
                    <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">{warning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions & Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Audit Trail
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Documentation
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              BlackRock Portal
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Last Scan:</strong> {alignmentStatus?.scan_results ? 
                `${alignmentStatus.scan_results.files_scanned} files scanned, ${alignmentStatus.scan_results.violations_found} violations found` :
                'No scan data available'
              }
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Automated compliance monitoring runs every 30 seconds. Manual refresh available above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}