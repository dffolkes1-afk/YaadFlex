import { Router } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { db } from './db';
import { users, userMfa, userSessions } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { storage } from './storage';
import { requireAuth } from './security-patch';

const router = Router();

const nowUtc = () => new Date();

// Get all employees with MFA status
router.get('/api/admin/employees', requireAuth, async (req, res) => {
  try {
    // Get all users with their MFA status
    const employeeUsers = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.role, 'employee'));

    // Get MFA status for all employees
    const mfaRecords = await db.select().from(userMfa);
    const mfaMap = new Map(mfaRecords.map(mfa => [mfa.userId, mfa]));

    // Get last login info
    const sessionRecords = await db.select({
      userId: userSessions.userId,
      lastLogin: userSessions.startedAt
    })
    .from(userSessions)
    .orderBy(desc(userSessions.startedAt));
    
    const lastLoginMap = new Map();
    sessionRecords.forEach(session => {
      if (!lastLoginMap.has(session.userId)) {
        lastLoginMap.set(session.userId, session.lastLogin);
      }
    });

    // Combine data
    const employees = employeeUsers.map(user => {
      const mfa = mfaMap.get(user.id);
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        mfaEnabled: mfa?.enabled || false,
        mfaSecret: mfa?.totpSecret ? '[CONFIGURED]' : null,
        lastLogin: lastLoginMap.get(user.id) || null,
        isActive: user.isActive,
        workAreas: ['employee_access'] // Default work area for employees
      };
    });
    
    const stats = {
      totalEmployees: employees.length,
      mfaEnabled: employees.filter(emp => emp.mfaEnabled).length,
      pendingSetup: employees.filter(emp => !emp.mfaSecret).length,
      securityScore: employees.length > 0 ? Math.round((employees.filter(emp => emp.mfaEnabled).length / employees.length) * 100) : 0
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
    
    // Check if employee exists
    const [employee] = await db.select().from(users).where(eq(users.id, employeeId));
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Generate TOTP secret for the employee
    const secret = speakeasy.generateSecret({
      name: `YaadFlex (${employee.email})`,
      issuer: 'YaadFlex Security',
      length: 32
    });

    // Store the secret in database (disabled until verified)
    await db.insert(userMfa).values({
      userId: employeeId,
      totpSecret: secret.base32,
      enabled: false,
      createdAt: nowUtc(),
      updatedAt: nowUtc()
    }).onConflictDoUpdate({
      target: userMfa.userId,
      set: {
        totpSecret: secret.base32,
        enabled: false,
        updatedAt: nowUtc()
      }
    });
    
    // Generate QR code for easy setup
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Log security event
    await storage.logSecurityEvent({
      userId: employeeId,
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
    
    // Check if employee exists
    const [employee] = await db.select().from(users).where(eq(users.id, employeeId));
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if MFA record exists
    const [mfaRecord] = await db.select().from(userMfa).where(eq(userMfa.userId, employeeId));
    
    // If enabling MFA, ensure secret exists
    if (enabled && (!mfaRecord || !mfaRecord.totpSecret)) {
      return res.status(400).json({ error: 'Cannot enable MFA without setting up secret first' });
    }

    // Update MFA status in database
    if (mfaRecord) {
      await db.update(userMfa)
        .set({ 
          enabled, 
          updatedAt: nowUtc() 
        })
        .where(eq(userMfa.userId, employeeId));
    } else if (enabled) {
      return res.status(400).json({ error: 'No MFA setup found. Setup MFA first.' });
    }

    // If disabling MFA, also end all active sessions for immediate effect
    if (!enabled) {
      await db.update(userSessions)
        .set({ 
          active: false, 
          endedAt: nowUtc() 
        })
        .where(eq(userSessions.userId, employeeId));
    }

    // Log security event
    await storage.logSecurityEvent({
      userId: employeeId,
      eventType: enabled ? 'mfa_enabled' : 'mfa_disabled',
      severity: enabled ? 'low' : 'critical',
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
        mfaEnabled: enabled
      },
      message: `MFA ${enabled ? 'enabled' : 'disabled'} for ${employee.email}. ${!enabled ? 'All sessions terminated.' : ''}`
    });
  } catch (error) {
    console.error('Error updating MFA status:', error);
    res.status(500).json({ error: 'Failed to update MFA status' });
  }
});

// Add new employee (with mandatory MFA requirement)
router.post('/api/admin/employees', requireAuth, async (req, res) => {
  try {
    const { email, firstName = 'New', lastName = 'Employee' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if employee already exists
    const [existingEmployee] = await db.select().from(users).where(eq(users.email, email));
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee already exists' });
    }

    // Create new employee in database
    const employeeId = `emp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const [newEmployee] = await db.insert(users).values({
      id: employeeId,
      email,
      firstName,
      lastName,
      role: 'employee',
      isActive: true,
      createdAt: nowUtc(),
      updatedAt: nowUtc()
    }).returning();

    // Log security event
    await storage.logSecurityEvent({
      userId: 'admin',
      eventType: 'employee_added',
      severity: 'medium',
      description: `New employee added: ${email} (MFA setup required)`,
      ipAddress: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      threatBlocked: false,
      defenseSystemActivated: true
    });

    res.json({
      success: true,
      employee: {
        id: newEmployee.id,
        email: newEmployee.email,
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        role: newEmployee.role,
        mfaEnabled: false,
        mfaSecret: null,
        isActive: newEmployee.isActive
      },
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
    
    // Check if employee exists
    const [employee] = await db.select().from(users).where(eq(users.id, employeeId));
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Delete MFA record completely to force re-setup
    await db.delete(userMfa).where(eq(userMfa.userId, employeeId));
    
    // End all active sessions immediately
    await db.update(userSessions)
      .set({ 
        active: false, 
        endedAt: nowUtc() 
      })
      .where(eq(userSessions.userId, employeeId));
    
    // Temporarily deactivate user until MFA re-setup
    await db.update(users)
      .set({ 
        isActive: false,
        updatedAt: nowUtc()
      })
      .where(eq(users.id, employeeId));

    // Log security event
    await storage.logSecurityEvent({
      userId: employeeId,
      eventType: 'access_reset',
      severity: 'critical',
      description: `Admin reset access for employee ${employee.email}. MFA disabled, secret cleared, all sessions terminated.`,
      ipAddress: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      threatBlocked: false,
      defenseSystemActivated: true
    });

    res.json({
      success: true,
      message: `Access completely reset for ${employee.email}. Employee must re-setup MFA and be reactivated to regain access.`
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
    
    // Check if employee exists
    const [employee] = await db.select().from(users).where(eq(users.id, employeeId));
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Get MFA record
    const [mfaRecord] = await db.select().from(userMfa).where(eq(userMfa.userId, employeeId));
    if (!mfaRecord || !mfaRecord.totpSecret) {
      return res.status(404).json({ error: 'MFA not setup for this employee' });
    }

    const isValid = speakeasy.totp.verify({
      secret: mfaRecord.totpSecret,
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
    // Get all employees
    const employees = await db.select().from(users).where(eq(users.role, 'employee'));
    
    // Get MFA status for all employees
    const mfaRecords = await db.select().from(userMfa);
    const mfaMap = new Map(mfaRecords.map(mfa => [mfa.userId, mfa]));
    
    // Count MFA-compliant employees
    const mfaCompliant = employees.filter(emp => {
      const mfa = mfaMap.get(emp.id);
      return mfa?.enabled === true;
    }).length;
    
    const recentLogs = await storage.getSecurityLogs();
    
    const overview = {
      totalEmployees: employees.length,
      mfaCompliant,
      securityScore: employees.length > 0 ? Math.round((mfaCompliant / employees.length) * 100) : 100,
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