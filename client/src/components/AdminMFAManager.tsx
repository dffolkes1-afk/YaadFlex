import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Users, 
  Settings, 
  AlertTriangle,
  Plus,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  lastLogin?: Date;
  isActive: boolean;
  workAreas: string[];
}

interface MFAStats {
  totalEmployees: number;
  mfaEnabled: number;
  pendingSetup: number;
  securityScore: number;
}

export function AdminMFAManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<MFAStats>({
    totalEmployees: 0,
    mfaEnabled: 0,
    pendingSetup: 0,
    securityScore: 0
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [showSecrets, setShowSecrets] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/admin/employees');
      setEmployees(response.employees || []);
      setStats(response.stats || stats);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load employee list',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const registerEmployeeMFA = async (employeeId: string) => {
    try {
      setLoading(true);
      const response = await apiRequest('POST', `/api/admin/employees/${employeeId}/mfa/setup`);
      
      toast({
        title: 'MFA Setup Initiated',
        description: `Authenticator setup created for employee. Secret: ${response.secret}`,
        duration: 10000
      });
      
      await loadEmployees();
    } catch (error: any) {
      toast({
        title: 'MFA Setup Failed',
        description: error.message || 'Failed to setup authenticator',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeMFA = async (employeeId: string, enable: boolean) => {
    try {
      setLoading(true);
      await apiRequest('PUT', `/api/admin/employees/${employeeId}/mfa`, {
        enabled: enable
      });
      
      toast({
        title: enable ? 'MFA Enabled' : 'MFA Disabled',
        description: `Employee authenticator ${enable ? 'activated' : 'deactivated'}`,
        variant: enable ? 'default' : 'destructive'
      });
      
      await loadEmployees();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update MFA status',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewEmployee = async () => {
    if (!newEmployeeEmail.trim()) return;
    
    try {
      setLoading(true);
      await apiRequest('POST', '/api/admin/employees', {
        email: newEmployeeEmail,
        requireMFA: true
      });
      
      toast({
        title: 'Employee Added',
        description: 'New employee added with mandatory MFA requirement'
      });
      
      setNewEmployeeEmail('');
      await loadEmployees();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add employee',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetEmployeeAccess = async (employeeId: string) => {
    try {
      setLoading(true);
      await apiRequest('POST', `/api/admin/employees/${employeeId}/reset-access`);
      
      toast({
        title: 'Access Reset',
        description: 'Employee access has been reset. They must re-setup MFA.',
        variant: 'destructive'
      });
      
      await loadEmployees();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset access',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSecurityBadge = (employee: Employee) => {
    if (!employee.mfaEnabled) {
      return <Badge variant="destructive" data-testid={`badge-mfa-disabled-${employee.id}`}>
        <ShieldX className="h-3 w-3 mr-1" />
        No MFA
      </Badge>;
    }
    
    return <Badge variant="default" className="bg-green-100 text-green-800" data-testid={`badge-mfa-enabled-${employee.id}`}>
      <ShieldCheck className="h-3 w-3 mr-1" />
      Secured
    </Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="title-admin-mfa">
            <Shield className="h-6 w-6 text-blue-600" />
            Admin MFA Control Center
          </h1>
          <p className="text-gray-600 mt-1">Manage employee authenticators and security access</p>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold" data-testid="stat-total-employees">{stats.totalEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">MFA Enabled</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-mfa-enabled">{stats.mfaEnabled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Setup</p>
                <p className="text-2xl font-bold text-amber-600" data-testid="stat-pending-setup">{stats.pendingSetup}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Security Score</p>
                <p className="text-2xl font-bold text-purple-600" data-testid="stat-security-score">{stats.securityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Employee */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Employee
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="new-employee-email">Employee Email</Label>
              <Input
                id="new-employee-email"
                data-testid="input-new-employee-email"
                type="email"
                placeholder="employee@yaadflex.com"
                value={newEmployeeEmail}
                onChange={(e) => setNewEmployeeEmail(e.target.value)}
              />
            </div>
            <div className="pt-6">
              <Button 
                onClick={addNewEmployee}
                disabled={loading || !newEmployeeEmail.trim()}
                data-testid="button-add-employee"
              >
                Add Employee
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Employee Security Management</span>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSecrets(!showSecrets)}
                data-testid="button-toggle-secrets"
              >
                {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showSecrets ? 'Hide Secrets' : 'Show Secrets'}
              </Button>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-employees"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div 
                key={employee.id} 
                className="border rounded-lg p-4 hover:bg-gray-50"
                data-testid={`employee-card-${employee.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold" data-testid={`text-employee-name-${employee.id}`}>
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-gray-600" data-testid={`text-employee-email-${employee.id}`}>
                        {employee.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Role: {employee.role} | Areas: {employee.workAreas.join(', ')}
                      </p>
                      {showSecrets && employee.mfaSecret && (
                        <p className="text-xs font-mono bg-gray-100 p-1 rounded mt-1">
                          Secret: {employee.mfaSecret}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {getSecurityBadge(employee)}
                    
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`mfa-toggle-${employee.id}`} className="text-sm">
                        MFA Active
                      </Label>
                      <Switch
                        id={`mfa-toggle-${employee.id}`}
                        data-testid={`switch-mfa-${employee.id}`}
                        checked={employee.mfaEnabled}
                        onCheckedChange={(checked) => toggleEmployeeMFA(employee.id, checked)}
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      {!employee.mfaSecret && (
                        <Button
                          size="sm"
                          onClick={() => registerEmployeeMFA(employee.id)}
                          disabled={loading}
                          data-testid={`button-setup-mfa-${employee.id}`}
                        >
                          Setup MFA
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetEmployeeAccess(employee.id)}
                        disabled={loading}
                        data-testid={`button-reset-access-${employee.id}`}
                      >
                        Reset Access
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredEmployees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No employees found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}