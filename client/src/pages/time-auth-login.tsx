import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Shield, Smartphone, Clock, Key } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface LoginFormData {
  userId: string;
  token: string;
  deviceId: string;
}

export default function TimeAuthLogin() {
  const { toast } = useToast();
  const [step, setStep] = useState<'login' | 'setup'>('login');
  const [formData, setFormData] = useState<LoginFormData>({
    userId: '',
    token: '',
    deviceId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [mfaSecret, setMfaSecret] = useState<string>('');

  const handleSetupMFA = async () => {
    if (!formData.userId) {
      toast({
        title: 'User ID Required',
        description: 'Please enter your User ID first',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/mfa/setup', {
        userId: formData.userId
      });
      const data = await response.json() as { qr: string; secret: string };
      
      setQrCode(data.qr);
      setMfaSecret(data.secret);
      setStep('setup');
      
      toast({
        title: 'MFA Setup Started',
        description: 'Scan the QR code with your authenticator app',
      });
    } catch (error: any) {
      toast({
        title: 'Setup Failed',
        description: error.message || 'Failed to setup MFA',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!formData.token) {
      toast({
        title: 'Token Required',
        description: 'Please enter the 6-digit code from your authenticator app',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/mfa/verify', {
        userId: formData.userId,
        token: formData.token
      });
      
      toast({
        title: 'MFA Enabled Successfully',
        description: 'You can now login with your authenticator app',
      });
      
      setStep('login');
      setFormData(prev => ({ ...prev, token: '' }));
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid token',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.userId || !formData.token) {
      toast({
        title: 'Required Fields',
        description: 'Please enter both User ID and authenticator token',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        userId: formData.userId,
        token: formData.token,
        deviceId: formData.deviceId || `device-${Date.now()}`
      }) as { ok: boolean; user?: { firstName?: string; lastName?: string } };
      
      if (response.ok) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back! Authentication successful.',
        });
        
        // Redirect to CEO Dashboard
        window.location.href = '/ceo-dashboard';
      }
    } catch (error: any) {
      let errorMessage = 'Login failed';
      
      if (error.message?.includes('MFA_REQUIRED')) {
        errorMessage = 'MFA setup required. Click "Setup MFA" first.';
      } else if (error.message?.includes('OUTSIDE_SHIFT_WINDOW')) {
        errorMessage = 'Access denied: Outside of authorized work hours';
      } else if (error.message?.includes('LOGIN_COOLDOWN_ACTIVE')) {
        errorMessage = 'Login cooldown active. Please wait before trying again.';
      } else if (error.message?.includes('ACTIVE_SESSION_EXISTS')) {
        errorMessage = 'You already have an active session. Please logout first.';
      } else if (error.message?.includes('INVALID_TOTP')) {
        errorMessage = 'Invalid authenticator code. Please try again.';
      }
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
              Setup MFA
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Secure your YaadFlex account with time-locked authentication
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Scan QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrCode && (
                <div className="text-center">
                  <img src={qrCode} alt="MFA QR Code" className="mx-auto border rounded-lg" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Scan with Google Authenticator, Authy, or similar app
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Manual Entry Key:</label>
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs break-all">
                  {mfaSecret}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Verification Code:</label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={formData.token}
                  onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                  maxLength={6}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('login')}
                  className="flex-1"
                >
                  Back to Login
                </Button>
                <Button 
                  onClick={handleVerifySetup}
                  disabled={isLoading || !formData.token}
                  className="flex-1"
                >
                  {isLoading ? 'Verifying...' : 'Verify Setup'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            YaadFlex Secure Login
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Time-locked authentication with MFA protection
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Secure Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Access is restricted to your authorized work schedule. MFA required for all logins.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <label className="text-sm font-medium">User ID:</label>
              <Input
                type="text"
                placeholder="Enter your User ID"
                value={formData.userId}
                onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Authenticator Code:</label>
              <Input
                type="text"
                placeholder="6-digit code from your app"
                value={formData.token}
                onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                maxLength={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Device ID (Optional):</label>
              <Input
                type="text"
                placeholder="Device identifier"
                value={formData.deviceId}
                onChange={(e) => setFormData(prev => ({ ...prev, deviceId: e.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleSetupMFA}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Setting up...' : 'Setup MFA'}
              </Button>
              <Button 
                onClick={handleLogin}
                disabled={isLoading || !formData.userId || !formData.token}
                className="flex-1"
              >
                {isLoading ? 'Logging in...' : 'Secure Login'}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Demo User ID: ceo-yaadflex-admin-001</p>
              <p>First time? Use "Setup MFA" to configure your authenticator</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}