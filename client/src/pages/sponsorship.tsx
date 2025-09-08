import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  FileText,
  Download,
  Fuel,
  CreditCard,
  Store,
  Car
} from 'lucide-react';

type SponsorType = 'bank' | 'gas_station' | 'retail' | 'restaurant' | 'hotel' | 'other';

type SponsorshipPackage = {
  id: string;
  name: string;
  price: string;
  benefits: string[];
  color: string;
  icon: React.ReactNode;
};

export default function SponsorshipPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [sponsorForm, setSponsorForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    sponsorType: '' as SponsorType,
    location: '',
    interests: '',
    budget: '',
    message: ''
  });

  const sponsorshipPackages: SponsorshipPackage[] = [
    {
      id: 'gas_station',
      name: '⛽ Gas Station Partner',
      price: 'JMD $50,000/month',
      benefits: [
        'YaadFlex drivers get 10% fuel discount',
        'Your logo on every driver app',
        '5,000+ driver visits monthly',
        'Exclusive fuel partner in your area',
        'Driver loyalty program management'
      ],
      color: 'from-red-500 to-orange-500',
      icon: <Fuel className="h-6 w-6" />
    },
    {
      id: 'bank',
      name: '🏦 Banking Partner',
      price: 'JMD $100,000/month',
      benefits: [
        'Process all driver payouts (85% split)',
        'Customer payment processing',
        'Exclusive banking partner status',
        'Driver account sign-up bonuses',
        '10,000+ monthly transactions'
      ],
      color: 'from-blue-500 to-indigo-500',
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      id: 'retail',
      name: '🛒 Retail Partner',
      price: 'JMD $75,000/month',
      benefits: [
        'Driver discounts at your stores',
        'Customer delivery partnerships',
        'In-app store promotions',
        'Bulk purchase programs',
        'Cross-promotional campaigns'
      ],
      color: 'from-green-500 to-emerald-500',
      icon: <Store className="h-6 w-6" />
    },
    {
      id: 'premium',
      name: '👑 Premium Sponsor',
      price: 'JMD $200,000/month',
      benefits: [
        'Logo on all YaadFlex materials',
        'Exclusive industry partnership',
        'Custom promotional campaigns',
        'VIP customer support channel',
        'Monthly performance reports',
        'Co-branding opportunities'
      ],
      color: 'from-purple-500 to-pink-500',
      icon: <Building2 className="h-6 w-6" />
    }
  ];

  // Generate sponsor letter mutation
  const generateLetterMutation = useMutation({
    mutationFn: async (data: typeof sponsorForm) => {
      const response = await apiRequest('POST', '/api/sponsors/generate-letter', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "📄 Sponsor Letter Generated!",
        description: `Professional letter ready for ${sponsorForm.companyName}. Download and present to decision makers.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Letter Generation Failed",
        description: error.message || "Unable to generate sponsor letter.",
        variant: "destructive",
      });
    },
  });

  // Submit partnership interest
  const partnershipMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/sponsors/register-interest', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🤝 Partnership Interest Recorded!",
        description: `We'll contact ${sponsorForm.companyName} within 24 hours to discuss partnership opportunities.`,
      });
      setSponsorForm({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        sponsorType: '' as SponsorType,
        location: '',
        interests: '',
        budget: '',
        message: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to register partnership interest.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof typeof sponsorForm, value: string) => {
    setSponsorForm(prev => ({ ...prev, [field]: value }));
  };

  const generateSponsorLetter = () => {
    if (!sponsorForm.companyName || !sponsorForm.contactName || !sponsorForm.sponsorType) {
      toast({
        title: "Missing Information",
        description: "Please fill in company name, contact name, and sponsor type.",
        variant: "destructive",
      });
      return;
    }
    generateLetterMutation.mutate(sponsorForm);
  };

  const submitPartnership = () => {
    if (!sponsorForm.companyName || !sponsorForm.email || !selectedPackage) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields and select a partnership package.",
        variant: "destructive",
      });
      return;
    }
    partnershipMutation.mutate({ ...sponsorForm, selectedPackage });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent mb-4">
            🇯🇲 YaadFlex Partnership Program
          </h1>
          <p className="text-2xl text-muted-foreground mb-6">
            Join Jamaica's fastest-growing super-app and reach 100,000+ active users
          </p>
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            <Badge variant="secondary" className="text-green-600 text-lg px-4 py-2">✓ 50,000+ Drivers</Badge>
            <Badge variant="secondary" className="text-blue-600 text-lg px-4 py-2">✓ 100,000+ Customers</Badge>
            <Badge variant="secondary" className="text-purple-600 text-lg px-4 py-2">✓ Island-Wide Coverage</Badge>
            <Badge variant="secondary" className="text-orange-600 text-lg px-4 py-2">✓ 24/7 Operations</Badge>
          </div>
        </div>

        {/* Why Partner With YaadFlex */}
        <Card className="mb-12 bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-950/20 dark:to-yellow-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-3xl text-center">🚀 Why Partner With YaadFlex?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <Users className="h-12 w-12 mx-auto text-green-600 mb-3" />
                <div className="text-2xl font-bold text-green-600">150K+</div>
                <div className="text-sm text-muted-foreground">Active Users Monthly</div>
              </div>
              <div>
                <TrendingUp className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                <div className="text-2xl font-bold text-blue-600">500%</div>
                <div className="text-sm text-muted-foreground">Growth This Year</div>
              </div>
              <div>
                <MapPin className="h-12 w-12 mx-auto text-purple-600 mb-3" />
                <div className="text-2xl font-bold text-purple-600">All 14</div>
                <div className="text-sm text-muted-foreground">Parishes Covered</div>
              </div>
              <div>
                <DollarSign className="h-12 w-12 mx-auto text-orange-600 mb-3" />
                <div className="text-2xl font-bold text-orange-600">$50M+</div>
                <div className="text-sm text-muted-foreground">JMD Monthly Volume</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partnership Packages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">🤝 Partnership Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sponsorshipPackages.map((pkg) => (
              <Card 
                key={pkg.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPackage === pkg.id ? 'ring-2 ring-accent shadow-lg' : ''
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
                data-testid={`package-${pkg.id}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${pkg.color} text-white`}>
                      {pkg.icon}
                    </div>
                    <div>
                      <div className="text-xl">{pkg.name}</div>
                      <div className="text-lg font-bold text-green-600">{pkg.price}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pkg.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  {selectedPackage === pkg.id && (
                    <div className="mt-4 p-3 bg-accent/20 rounded-lg">
                      <div className="text-sm font-medium text-accent-foreground">
                        ✅ Package Selected - Fill form below to proceed
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partnership Form */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Partnership Application & Letter Generator
            </CardTitle>
            <CardDescription>
              Generate professional sponsor letters for banks, gas stations, and businesses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="e.g., National Commercial Bank"
                  value={sponsorForm.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  data-testid="input-company-name"
                />
              </div>
              
              <div>
                <Label htmlFor="contactName">Contact Person *</Label>
                <Input
                  id="contactName"
                  placeholder="Full name of decision maker"
                  value={sponsorForm.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  data-testid="input-contact-name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  value={sponsorForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1-876-XXX-XXXX"
                  value={sponsorForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  data-testid="input-phone"
                />
              </div>

              <div>
                <Label htmlFor="sponsorType">Business Type *</Label>
                <Select 
                  onValueChange={(value) => handleInputChange('sponsorType', value)}
                  value={sponsorForm.sponsorType}
                >
                  <SelectTrigger data-testid="select-sponsor-type">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">🏦 Bank / Financial Institution</SelectItem>
                    <SelectItem value="gas_station">⛽ Gas Station (Ruby's, Texaco, etc.)</SelectItem>
                    <SelectItem value="retail">🛒 Retail Store / Supermarket</SelectItem>
                    <SelectItem value="restaurant">🍽️ Restaurant / Food Chain</SelectItem>
                    <SelectItem value="hotel">🏨 Hotel / Accommodation</SelectItem>
                    <SelectItem value="other">🏢 Other Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location / Parish</Label>
                <Input
                  id="location"
                  placeholder="e.g., Kingston, Montego Bay"
                  value={sponsorForm.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  data-testid="input-location"
                />
              </div>
              
              <div>
                <Label htmlFor="budget">Estimated Monthly Budget</Label>
                <Input
                  id="budget"
                  placeholder="e.g., JMD $50,000"
                  value={sponsorForm.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  data-testid="input-budget"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="interests">Partnership Interests</Label>
              <Textarea
                id="interests"
                placeholder="What specific partnership opportunities interest you? (e.g., fuel discounts, payment processing, customer rewards)"
                value={sponsorForm.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                data-testid="textarea-interests"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="message">Additional Message</Label>
              <Textarea
                id="message"
                placeholder="Any additional information or questions?"
                value={sponsorForm.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                data-testid="textarea-message"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                onClick={generateSponsorLetter}
                disabled={generateLetterMutation.isPending}
                variant="outline"
                className="flex-1"
                data-testid="button-generate-letter"
              >
                <Download className="h-4 w-4 mr-2" />
                {generateLetterMutation.isPending ? "Generating..." : "📄 Generate Sponsor Letter"}
              </Button>
              
              <Button
                onClick={submitPartnership}
                disabled={partnershipMutation.isPending}
                className="flex-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600"
                data-testid="button-submit-partnership"
              >
                <Building2 className="h-4 w-4 mr-2" />
                {partnershipMutation.isPending ? "Submitting..." : "🤝 Submit Partnership Interest"}
              </Button>
            </div>

            {/* Partnership Benefits */}
            {selectedPackage && (
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
                    🎯 Your Partnership Benefits
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Immediate Access:</strong>
                      <ul className="mt-1 space-y-1 text-blue-600 dark:text-blue-400">
                        <li>• 50,000+ active drivers</li>
                        <li>• 100,000+ monthly customers</li>
                        <li>• Island-wide brand exposure</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Growth Potential:</strong>
                      <ul className="mt-1 space-y-1 text-blue-600 dark:text-blue-400">
                        <li>• 500% annual user growth</li>
                        <li>• Expanding to other Caribbean islands</li>
                        <li>• First-mover advantage in Jamaica</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Success Stories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">🌟 Partnership Success Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">⛽</div>
                <h4 className="font-semibold mb-2">Gas Station Partners</h4>
                <p className="text-sm text-muted-foreground">
                  Partners see 40% increase in fuel sales from YaadFlex drivers and customer referrals.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🏦</div>
                <h4 className="font-semibold mb-2">Banking Partners</h4>
                <p className="text-sm text-muted-foreground">
                  Process $50M+ JMD monthly, gaining thousands of new accounts and transaction fees.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🛒</div>
                <h4 className="font-semibold mb-2">Retail Partners</h4>
                <p className="text-sm text-muted-foreground">
                  25% boost in sales through driver discounts and customer delivery partnerships.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Partner With YaadFlex?</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Join Jamaica's most successful businesses and grow together with YaadFlex!
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>partnerships@yaadflex.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600" />
                <span>1-800-YAADFLEX</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}