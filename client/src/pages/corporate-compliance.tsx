import { BlackRockComplianceMonitor } from '@/components/BlackRockComplianceMonitor';
import { BlackRockDomainConfig } from '@/components/BlackRockDomainConfig';
import { COMPANY_INFO } from '@shared/company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Globe, Building, AlertTriangle } from 'lucide-react';

export default function CorporateCompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200" data-testid="page-title">
                Corporate Compliance Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400" data-testid="page-subtitle">
                {COMPANY_INFO.PARENT_COMPANY} Portfolio Management & Oversight
              </p>
            </div>
          </div>
          
          {/* Corporate Identity Bar */}
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {COMPANY_INFO.COMPANY_NAME}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {COMPANY_INFO.PORTFOLIO_DESIGNATION}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">NYSE: BLK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Compliance Monitor Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200" data-testid="compliance-section-title">
                Compliance Monitoring
              </h2>
            </div>
            <BlackRockComplianceMonitor />
          </div>

          {/* Domain Configuration Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200" data-testid="domain-section-title">
                Domain Configuration
              </h2>
            </div>
            <BlackRockDomainConfig />
          </div>
        </div>

        {/* Corporate Oversight Panel */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Corporate Oversight Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg" data-testid="oversight-legal">
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {COMPANY_INFO.LEGAL.regulatory_compliance}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Regulatory Compliance
                  </div>
                </div>
                
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg" data-testid="oversight-corporate">
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {COMPANY_INFO.HEADQUARTERS.registration}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Registration Status
                  </div>
                </div>
                
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg" data-testid="oversight-contact">
                  <div className="text-sm font-mono text-slate-700 dark:text-slate-300 mb-2">
                    {COMPANY_INFO.CONTACT.corporate_email}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Corporate Contact
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Corporate Notice:</strong> This dashboard provides real-time monitoring of {COMPANY_INFO.COMPANY_NAME} 
                  compliance with {COMPANY_INFO.PARENT_COMPANY} corporate standards. All data is monitored for 
                  regulatory compliance and corporate governance requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}