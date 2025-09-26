import { Router } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { storage } from './storage';
import { requireAuth } from './security-patch';

const router = Router();

// Mock employee data for demo (in production this would come from database)
const mockEmployees = [
  {
    id: 'emp1',
    email: 'driver1@yaadflex.com',
    firstName: 'Marcus',
    lastName: 'Campbell',
    role: 'driver',
    mfaEnabled: true,
    mfaSecret: 'JBSWY3DPEHPK3PXP',
    lastLogin: new Date(Date.now() - 3600000),
    isActive: true,
    workAreas: ['driver_operations', 'vehicle_management']
  },
  {
    id: 'emp2', 
    email: 'finance@yaadflex.com',
    firstName: 'Lisa',
    lastName: 'Johnson',
    role: 'finance_ops',
    mfaEnabled: false,
    mfaSecret: null,
    lastLogin: new Date(Date.now() - 86400000),
    isActive: true,
    workAreas: ['finance_operations', 'payout_management']
  },
  {
    id: 'emp3',
    email: 'support@yaadflex.com', 
    firstName: 'Devon',
    lastName: 'Brown',
    role: 'customer_support',
    mfaEnabled: true,
    mfaSecret: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ',
    lastLogin: new Date(Date.now() - 1800000),
    isActive: true,
    workAreas: ['customer_support', 'dispute_resolution']
  },
  {
    id: 'emp4',
    email: 'manager@yaadflex.com',
    firstName: 'Patricia',
    lastName: 'Williams',
    role: 'area_manager',
    mfaEnabled: false,
    mfaSecret: null,
    lastLogin: null,
    isActive: true,
    workAreas: ['area_management', 'driver_registration']
  }
];

// Get all employees with MFA status
router.get('/api/admin/employees', requireAuth, async (req, res) => {
  try {
    const employees = mockEmployees;
    
    const stats = {
      totalEmployees: employees.length,
      mfaEnabled: employees.filter(emp => emp.mfaEnabled).length,
      pendingSetup: employees.filter(emp => !emp.mfaSecret).length,
      securityScore: Math.round((employees.filter(emp => emp.mfaEnabled).length / employees.length) * 100)
    };

    res.json({
      employees,
      stats
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Setup MFA for an employee (admin creates the secret)
router.post('/api/admin/employees/:employeeId/mfa/setup', requireAuth, async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Generate TOTP secret for the employee
    const secret = speakeasy.generateSecret({
      name: `YaadFlex (${employee.email})`,
      issuer: 'YaadFlex Security',
      length: 32
    });

    // Store the secret for the employee
    employee.mfaSecret = secret.base32;
    
    // Generate QR code for easy setup
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Log security event
    await storage.logSecurityEvent({
      userId: employee.id,
      eventType: 'mfa_setup_initiated',
      severity: 'medium',
      description: `Admin initiated MFA setup for employee ${employee.email}`,
      ipAddress: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      threatBlocked: false,
      defenseSystemActivated: true
    });

    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
      message: 'MFA secret generated. Employee must scan QR code or enter secret manually.'
    });
  } catch (error) {
    console.error('Error setting up MFA:', error);
    res.status(500).json({ error: 'Failed to setup MFA' });
  }
});

// Enable/disable MFA for an employee
router.put('/api/admin/employees/:employeeId/mfa', requireAuth, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { enabled } = req.body;
    
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // If enabling MFA, ensure secret exists
    if (enabled && !employee.mfaSecret) {
      return res.status(400).json({ error: 'Cannot enable MFA without setting up secret first' });
    }

    employee.mfaEnabled = enabled;

    // Log security event
    await storage.logSecurityEvent({
      userId: employee.id,
      eventType: enabled ? 'mfa_enabled' : 'mfa_disabled',
      severity: enabled ? 'low' : 'high',
      description: `Admin ${enabled ? 'enabled' : 'disabled'} MFA for employee ${employee.email}`,
      ipAddress: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      threatBlocked: false,
      defenseSystemActivated: enabled
    });

    res.json({
      success: true,
      employee: {
        id: employee.id,
        email: employee.email,
        mfaEnabled: employee.mfaEnabled
      },
      message: `MFA ${enabled ? 'enabled' : 'disabled'} for ${employee.email}`
    });
  } catch (error) {
    console.error('Error updating MFA status:', error);
    res.status(500).json({ error: 'Failed to update MFA status' });
  }
});

// Add new employee (with mandatory MFA requirement)
router.post('/api/admin/employees', requireAuth, async (req, res) => {
  try {
    const { email, requireMFA = true } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if employee already exists
    const existingEmployee = mockEmployees.find(emp => emp.email === email);
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee already exists' });
    }

    // Create new employee
    const newEmployee = {
      id: `emp${Date.now()}`,
      email,
      firstName: 'New',
      lastName: 'Employee',
      role: 'employee',
      mfaEnabled: false,
      mfaSecret: null,
      lastLogin: null,
      isActive: true,
      workAreas: ['general_access']
    };

    mockEmployees.push(newEmployee);

    // Log security event
    await storage.logSecurityEvent({
      userId: 'admin',
      eventType: 'employee_added',
      severity: 'medium',
      description: `New employee added: ${email} (MFA required: ${requireMFA})`,
      ipAddress: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      threatBlocked: false,
      defenseSystemActivated: true
    });

    res.json({
      success: true,
      employee: newEmployee,
      message: `Employee ${email} added successfully. MFA setup required.`
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

// Reset employee access (disables MFA and clears secret)
router.post('/api/admin/employees/:employeeId/reset-access', requireAuth, async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Reset MFA settings
    employee.mfaEnabled = false;
    employee.mfaSecret = null;
    employee.isActive = false; // Temporarily deactivate until re-setup

    // Log security event
    await storage.logSecurityEvent({
      userId: employee.id,
      eventType: 'access_reset',
      severity: 'high',
      description: `Admin reset access for employee ${employee.email}. MFA disabled and secret cleared.`,
      ipAddress: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      threatBlocked: false,
      defenseSystemActivated: true
    });

    res.json({
      success: true,
      message: `Access reset for ${employee.email}. Employee must re-setup MFA to regain access.`
    });
  } catch (error) {
    console.error('Error resetting employee access:', error);
    res.status(500).json({ error: 'Failed to reset employee access' });
  }
});

// Verify employee MFA token (for testing/validation)
router.post('/api/admin/employees/:employeeId/mfa/verify', requireAuth, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { token } = req.body;
    
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    if (!employee || !employee.mfaSecret) {
      return res.status(404).json({ error: 'Employee not found or MFA not setup' });
    }

    const isValid = speakeasy.totp.verify({
      secret: employee.mfaSecret,
      encoding: 'base32',
      token,
      window: 1
    });

    res.json({
      valid: isValid,
      message: isValid ? 'Token is valid' : 'Invalid token'
    });
  } catch (error) {
    console.error('Error verifying MFA token:', error);
    res.status(500).json({ error: 'Failed to verify token' });
  }
});

// Get security overview for admin dashboard
router.get('/api/admin/security/overview', requireAuth, async (req, res) => {
  try {
    const employees = mockEmployees;
    const recentLogs = await storage.getSecurityLogs();
    
    const overview = {
      totalEmployees: employees.length,
      mfaCompliant: employees.filter(emp => emp.mfaEnabled).length,
      securityScore: Math.round((employees.filter(emp => emp.mfaEnabled).length / employees.length) * 100),
      recentSecurityEvents: recentLogs.slice(0, 10),
      activeThreats: recentLogs.filter(log => log.severity === 'high' || log.severity === 'critical').length,
      lastSecurityCheck: new Date()
    };

    res.json(overview);
  } catch (error) {
    console.error('Error fetching security overview:', error);
    res.status(500).json({ error: 'Failed to fetch security overview' });
  }
});

export { router as adminMfaRoutes };