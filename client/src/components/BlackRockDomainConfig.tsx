import { useQuery } from '@tanstack/react-query';
import { COMPANY_INFO } from '@shared/company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Globe, Mail, Shield, ExternalLink, RefreshCw } from 'lucide-react';

interface DomainStatus {
  domain: string;
  status: 'active' | 'pending' | 'error';
  type: 'primary' | 'corporate' | 'redirect';
  ssl: boolean;
  description: string;
  lastCheck: string;
}

interface DomainConfigResponse {
  status: string;
  timestamp: string;
  environment: string;
  current_host: string;
  domains: DomainStatus[];
  metrics: {
    total_domains: number;
    active_domains: number;
    ssl_secured: number;
    corporate_domains: number;
    pending_domains: number;
  };
  corporate_config: {
    parent_company: string;
    legal_entity: string;
    primary_contact_domain: string;
    corporate_email_structure: string;
    compliance_email: string;
    legal_email: string;
    headquarters: string;
    portfolio_designation: string;
  };
  blackrock_integration: {
    status: string;
    domain_strategy: string;
    ssl_policy: string;
    compliance_status: string;
  };
}

export function BlackRockDomainConfig() {
  // Fetch real domain configuration from backend API
  const { data: domainConfig, isLoading, error, refetch } = useQuery<DomainConfigResponse>({
    queryKey: ['/api/corporate/domains'],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time status
  });

  const domainStatuses = domainConfig?.domains || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Globe className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      pending: 'secondary',
      error: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      corporate: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
      redirect: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card data-testid="domain-config-loading">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>BlackRock Domain Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="domain-config-error">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Domain Configuration Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Failed to Load Domain Configuration
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Unable to retrieve BlackRock domain status information.
            </p>
            <Button onClick={() => refetch()} variant="outline" data-testid="button-retry-domains">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="blackrock-domain-config">
      
      {/* Domain Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>BlackRock Domain Integration Status</span>
            </div>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
              data-testid="button-refresh-domains"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {domainStatuses.filter(d => d.status === 'active').length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Active Domains</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {domainStatuses.filter(d => d.ssl).length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">SSL Secured</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                {domainStatuses.filter(d => d.type === 'corporate').length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Corporate Domains</div>
            </div>
          </div>

          <div className="space-y-3">
            {domainStatuses.map((domain, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(domain.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {domain.domain}
                      </span>
                      {domain.ssl && <Shield className="w-3 h-3 text-green-500" />}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {domain.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTypeBadge(domain.type)}
                  {getStatusBadge(domain.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>BlackRock Email Domain Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Corporate Email Structure */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Corporate Email Structure
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Support:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {COMPANY_INFO.CONTACT.support_email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Corporate:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {COMPANY_INFO.CONTACT.corporate_email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Legal:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {COMPANY_INFO.CONTACT.legal_email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Business:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {COMPANY_INFO.CONTACT.business_email}
                  </span>
                </div>
              </div>
            </div>

            {/* BlackRock Direct Channels */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
                BlackRock Direct Channels
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Legal:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {COMPANY_INFO.CONTACT.blackrock_legal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Compliance:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {COMPANY_INFO.CONTACT.blackrock_compliance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Executive:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {COMPANY_INFO.CONTACT.blackrock_executive}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Signature Domain:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {COMPANY_INFO.CONTACT.signature_domain}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Globe className="w-4 h-4 mr-2" />
              Test All Domains
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Check SSL Status
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Verify Email Config
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              BlackRock Portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}