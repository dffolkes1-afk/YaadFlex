import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Car, 
  Bike, 
  Truck, 
  DollarSign, 
  CreditCard, 
  Shield, 
  CheckCircle2,
  User,
  FileText,
  MapPin
} from 'lucide-react';
import { Link } from 'wouter';

type DriverFormData = {
  fullName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address: string;
  parish: string;
  emergencyContact: string;
  emergencyPhone: string;
  vehicleType: 'bike' | 'car' | 'van' | 'truck';
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  licensePlate: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
};

export default function DriverRegistration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<DriverFormData>({
    fullName: '',
    licenseNumber: '',
    phone: '',
    email: '',
    address: '',
    parish: '',
    emergencyContact: '',
    emergencyPhone: '',
    vehicleType: 'car',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    licensePlate: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToDriverAgreement, setAgreedToDriverAgreement] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const jamaicaParishes = [
    'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary',
    'St. Ann', 'Trelawny', 'St. James', 'Hanover', 'Westmoreland',
    'St. Elizabeth', 'Manchester', 'Clarendon', 'St. Catherine'
  ];

  const jamaicaBanks = [
    'National Commercial Bank (NCB)',
    'JN Bank',
    'JMMB Bank',
    'Sagicor Bank',
    'First Caribbean International Bank',
    'Scotiabank Jamaica',
    'Capital & Credit Bank',
    'Victoria Mutual Building Society',
    'Other'
  ];

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return <Bike className="h-8 w-8" />;
      case 'car': return <Car className="h-8 w-8" />;
      case 'van': case 'truck': return <Truck className="h-8 w-8" />;
      default: return <Car className="h-8 w-8" />;
    }
  };

  const getVehicleEarnings = (type: string) => {
    const baseRates = { bike: 150, car: 300, van: 500, truck: 800 };
    const daily = (baseRates[type as keyof typeof baseRates] || 300) * 0.85 * 8; // 8 trips per day, 85% earnings
    return Math.round(daily);
  };

  // Driver registration mutation
  const registerDriverMutation = useMutation({
    mutationFn: async (driverData: DriverFormData) => {
      const response = await apiRequest('POST', '/api/drivers/register', driverData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🎉 Welcome to YaadFlex Driver Network!",
        description: `${formData.fullName}, you're now registered! You'll earn 85% of every fare directly to your ${formData.bankName} account.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/drivers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to register as driver. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof DriverFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['fullName', 'licenseNumber', 'phone', 'email', 'vehicleModel', 'licensePlate', 'bankName', 'accountNumber', 'accountHolderName'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof DriverFormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to complete registration.",
        variant: "destructive",
      });
      return;
    }

    // Check legal agreements
    if (!agreedToTerms || !agreedToDriverAgreement || !agreedToPrivacy) {
      toast({
        title: "Legal Agreements Required",
        description: "Please review and accept all legal agreements to complete registration.",
        variant: "destructive",
      });
      return;
    }

    // CRITICAL: Include legal acceptance fields in POST payload for backend persistence
    const completeDriverData = {
      ...formData,
      // Legal acceptance fields - required for legal compliance
      agreedToTerms,
      agreedToDriverAgreement,
      agreedToPrivacy
    };

    registerDriverMutation.mutate(completeDriverData);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent mb-2">
            🇯🇲 Become a YaadFlex Driver
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Join Jamaica's fairest ride-sharing platform - Keep 85% of every fare!
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-green-600">✓ Earn 85% of Fares</Badge>
            <Badge variant="secondary" className="text-blue-600">✓ Instant Bank Payouts</Badge>
            <Badge variant="secondary" className="text-purple-600">✓ No Hidden Fees</Badge>
            <Badge variant="secondary" className="text-orange-600">✓ 24/7 Support</Badge>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 4 && <div className={`h-1 w-24 ${step < currentStep ? 'bg-accent' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Personal Info</span>
            <span>Vehicle Details</span>
            <span>Bank Setup</span>
            <span>Review</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === 1 && <><User className="h-5 w-5" /> Personal Information</>}
                {currentStep === 2 && <><Car className="h-5 w-5" /> Vehicle Information</>}
                {currentStep === 3 && <><CreditCard className="h-5 w-5" /> Bank Account Setup</>}
                {currentStep === 4 && <><CheckCircle2 className="h-5 w-5" /> Review & Submit</>}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about yourself and your contact information"}
                {currentStep === 2 && "Details about your vehicle for YaadFlex rides"}
                {currentStep === 3 && "Set up automatic payments directly to your bank account"}
                {currentStep === 4 && "Review your information and start earning with YaadFlex!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Your full legal name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        data-testid="input-full-name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="licenseNumber">Driver's License Number *</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="Jamaica License Number"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        data-testid="input-license-number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+1-876-XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        data-testid="input-phone"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Home Address</Label>
                      <Input
                        id="address"
                        placeholder="Street address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        data-testid="input-address"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="parish">Parish</Label>
                      <Select 
                        onValueChange={(value) => handleInputChange('parish', value)}
                        value={formData.parish}
                      >
                        <SelectTrigger data-testid="select-parish">
                          <SelectValue placeholder="Select Parish" />
                        </SelectTrigger>
                        <SelectContent>
                          {jamaicaParishes.map((parish) => (
                            <SelectItem key={parish} value={parish}>{parish}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="Emergency contact person"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        data-testid="input-emergency-contact"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        placeholder="+1-876-XXX-XXXX"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        data-testid="input-emergency-phone"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Vehicle Information */}
              {currentStep === 2 && (
                <>
                  <div>
                    <Label>Vehicle Type *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {(['bike', 'car', 'van', 'truck'] as const).map((type) => (
                        <Card 
                          key={type}
                          className={`cursor-pointer transition-all ${
                            formData.vehicleType === type ? 'ring-2 ring-accent bg-accent/10' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handleInputChange('vehicleType', type)}
                          data-testid={`vehicle-${type}`}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="mb-2">{getVehicleIcon(type)}</div>
                            <div className="font-medium text-sm capitalize">{type}</div>
                            <div className="text-xs text-muted-foreground">
                              ~${getVehicleEarnings(type)} JMD/day
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="vehicleModel">Vehicle Make/Model *</Label>
                      <Input
                        id="vehicleModel"
                        placeholder="e.g., Toyota Corolla"
                        value={formData.vehicleModel}
                        onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                        data-testid="input-vehicle-model"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="vehicleYear">Year</Label>
                      <Input
                        id="vehicleYear"
                        placeholder="e.g., 2020"
                        value={formData.vehicleYear}
                        onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                        data-testid="input-vehicle-year"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vehicleColor">Color</Label>
                      <Input
                        id="vehicleColor"
                        placeholder="e.g., White"
                        value={formData.vehicleColor}
                        onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
                        data-testid="input-vehicle-color"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="licensePlate">License Plate Number *</Label>
                    <Input
                      id="licensePlate"
                      placeholder="Jamaica license plate number"
                      value={formData.licensePlate}
                      onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                      data-testid="input-license-plate"
                    />
                  </div>

                  {/* Earnings Preview */}
                  <Card className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-950/20 dark:to-yellow-950/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-700 dark:text-green-300">Your Earning Potential + FREE 7 DAYS!</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">${getVehicleEarnings(formData.vehicleType)}</div>
                          <div className="text-muted-foreground">Per Day (JMD)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">${getVehicleEarnings(formData.vehicleType) * 7}</div>
                          <div className="text-muted-foreground">Per Week (JMD)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">${getVehicleEarnings(formData.vehicleType) * 30}</div>
                          <div className="text-muted-foreground">Per Month (JMD)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">85%</div>
                          <div className="text-muted-foreground">Your Share</div>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-sm font-bold text-center text-yellow-700 dark:text-yellow-300">
                          🎉 SPECIAL LAUNCH OFFER: First 7 days FREE! No platform fees!
                        </div>
                        <div className="text-xs text-center text-yellow-600 dark:text-yellow-400 mt-1">
                          Keep 100% of earnings for your first week to attract customers and build your reputation
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Step 3: Bank Account Setup */}
              {currentStep === 3 && (
                <>
                  <div className="mb-4">
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        🏦 Automatic Payment Setup
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Your earnings (85% of each fare) will be automatically deposited to this bank account within 24 hours of each completed trip. 
                        No waiting, no manual transfers!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                      <Input
                        id="accountHolderName"
                        placeholder="Name on bank account"
                        value={formData.accountHolderName}
                        onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                        data-testid="input-account-holder"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Select 
                        onValueChange={(value) => handleInputChange('bankName', value)}
                        value={formData.bankName}
                      >
                        <SelectTrigger data-testid="select-bank">
                          <SelectValue placeholder="Select Your Bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {jamaicaBanks.map((bank) => (
                            <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Your bank account number"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        data-testid="input-account-number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="routingNumber">Routing/Branch Code</Label>
                      <Input
                        id="routingNumber"
                        placeholder="Bank routing or branch code"
                        value={formData.routingNumber}
                        onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                        data-testid="input-routing-number"
                      />
                    </div>
                  </div>

                  <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-700 dark:text-green-300">Security & Privacy</span>
                      </div>
                      <div className="space-y-2 text-sm text-green-600 dark:text-green-400">
                        <div>• Your bank details are encrypted and never stored in plain text</div>
                        <div>• We use bank-grade security for all transactions</div>
                        <div>• Automatic payments are processed securely through licensed providers</div>
                        <div>• You can update your bank details anytime in the driver app</div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Personal Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Name:</strong> {formData.fullName}</div>
                        <div><strong>License:</strong> {formData.licenseNumber}</div>
                        <div><strong>Phone:</strong> {formData.phone}</div>
                        <div><strong>Email:</strong> {formData.email}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Vehicle Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Type:</strong> {formData.vehicleType.charAt(0).toUpperCase() + formData.vehicleType.slice(1)}</div>
                        <div><strong>Model:</strong> {formData.vehicleModel}</div>
                        <div><strong>Plate:</strong> {formData.licensePlate}</div>
                        <div><strong>Daily Earnings:</strong> ~${getVehicleEarnings(formData.vehicleType)} JMD</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Payment Setup</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Bank:</strong> {formData.bankName}</div>
                        <div><strong>Account Holder:</strong> {formData.accountHolderName}</div>
                        <div><strong>Account:</strong> ****{formData.accountNumber.slice(-4)}</div>
                        <div><strong>Payout:</strong> 85% of fares, automatic</div>
                      </div>
                    </div>

                    <Card className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-950/20 dark:to-yellow-950/20">
                      <CardContent className="p-6 text-center">
                        <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
                          🎉 Welcome to YaadFlex Driver Network!
                        </h3>
                        <p className="text-lg mb-4">
                          You're about to join <strong>Jamaica's fairest ride-sharing platform</strong> where drivers actually make money!
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">85%</div>
                            <div className="text-sm text-muted-foreground">You Keep</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">24h</div>
                            <div className="text-sm text-muted-foreground">Payout Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">0</div>
                            <div className="text-sm text-muted-foreground">Hidden Fees</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">24/7</div>
                            <div className="text-sm text-muted-foreground">Support</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Legal Agreements - Only show on final step */}
              {currentStep === 4 && (
                <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Legal Agreements & Terms
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                      By registering as a YaadFlex driver, you're entering into an independent contractor agreement with BlackRock, Inc. 
                      Please review and accept the following legal documents:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <Checkbox 
                          id="terms-agreement"
                          checked={agreedToTerms}
                          onCheckedChange={setAgreedToTerms}
                          data-testid="checkbox-terms"
                        />
                        <div className="flex-1">
                          <label htmlFor="terms-agreement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            I agree to BlackRock's Terms of Service
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            General platform terms and conditions. 
                            <Link href="/terms" className="text-blue-600 hover:underline ml-1">Read Terms →</Link>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <Checkbox 
                          id="driver-agreement"
                          checked={agreedToDriverAgreement}
                          onCheckedChange={setAgreedToDriverAgreement}
                          data-testid="checkbox-driver-agreement"
                        />
                        <div className="flex-1">
                          <label htmlFor="driver-agreement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            I agree to the Driver Agreement (85% earnings, independent contractor terms)
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your earnings structure and working relationship with BlackRock. 
                            <Link href="/driver-agreement" className="text-blue-600 hover:underline ml-1">Read Agreement →</Link>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <Checkbox 
                          id="privacy-policy"
                          checked={agreedToPrivacy}
                          onCheckedChange={setAgreedToPrivacy}
                          data-testid="checkbox-privacy"
                        />
                        <div className="flex-1">
                          <label htmlFor="privacy-policy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            I acknowledge BlackRock's Privacy Policy
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            How your personal data and location information is protected. 
                            <Link href="/privacy" className="text-blue-600 hover:underline ml-1">Read Policy →</Link>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-300">
                        <strong>BlackRock Corporate Information:</strong> BlackRock, Inc. (Delaware Corporation, SEC File: 001-15305) 
                        operates YaadFlex as a multi-service platform. Address: 50 Hudson Yards, New York, NY 10001.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep} className="ml-auto">
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className="ml-auto h-12 px-8 text-lg font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600"
                    disabled={registerDriverMutation.isPending || !agreedToTerms || !agreedToDriverAgreement || !agreedToPrivacy}
                    data-testid="button-register-driver"
                  >
                    {registerDriverMutation.isPending ? (
                      "Setting Up Your Driver Account..."
                    ) : (
                      "🚗 Start Earning with YaadFlex!"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}