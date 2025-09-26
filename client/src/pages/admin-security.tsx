import { AdminMFAManager } from "@/components/AdminMFAManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  Lock,
  Eye,
  Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface SecurityOverview {
  totalEmployees: number;
  mfaCompliant: number;
  securityScore: number;
  activeThreats: number;
  recentSecurityEvents: any[];
  lastSecurityCheck: Date;
}

export default function AdminSecurityPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: securityOverview, refetch } = useQuery({
    queryKey: ['/api/admin/security/overview'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 70) return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3" data-testid="title-admin-security">
                <Shield className="h-8 w-8 text-blue-600" />
                Security Control Center
              </h1>
              <p className="text-gray-600 mt-2">
                Full security management for YaadFlex autonomous operations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                <Lock className="h-3 w-3 mr-1" />
                FULL SECURITY MODE
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid="tab-overview"
              >
                <Eye className="h-4 w-4 inline mr-2" />
                Security Overview
              </button>
              <button
                onClick={() => setActiveTab('mfa')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mfa'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid="tab-mfa"
              >
                <ShieldCheck className="h-4 w-4 inline mr-2" />
                MFA Management
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Security Score Card */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Overall Security Status
                  </span>
                  {securityOverview && getScoreBadge(securityOverview.securityScore)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(securityOverview?.securityScore || 0)}`} data-testid="score-overall">
                      {securityOverview?.securityScore || 0}%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Security Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600" data-testid="count-employees">
                      {securityOverview?.totalEmployees || 0}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Total Employees</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600" data-testid="count-mfa-compliant">
                      {securityOverview?.mfaCompliant || 0}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">MFA Compliant</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600" data-testid="count-active-threats">
                      {securityOverview?.activeThreats || 0}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Active Threats</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Recent Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityOverview?.recentSecurityEvents?.slice(0, 5).map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid={`security-event-${index}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${
                          event.severity === 'high' || event.severity === 'critical' ? 'bg-red-500' :
                          event.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{event.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        event.severity === 'high' || event.severity === 'critical' ? 'destructive' :
                        event.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {event.severity.toUpperCase()}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No recent security events
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Security Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('mfa')} 
                    className="h-20 flex flex-col items-center justify-center gap-2"
                    data-testid="button-manage-mfa"
                  >
                    <ShieldCheck className="h-6 w-6" />
                    Manage Employee MFA
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => refetch()}
                    data-testid="button-refresh-security"
                  >
                    <Shield className="h-6 w-6" />
                    Refresh Security Status
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center gap-2"
                    data-testid="button-security-audit"
                  >
                    <Eye className="h-6 w-6" />
                    Run Security Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* MFA Management Tab */}
        {activeTab === 'mfa' && (
          <div>
            <AdminMFAManager />
          </div>
        )}
      </div>
    </div>
  );
}