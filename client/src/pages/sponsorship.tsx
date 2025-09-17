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
  Car,
  CheckCircle
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
        description: "Try again or contact support for assistance.",
        variant: "destructive",
      });
    }
  });

  // Submit partnership interest mutation
  const partnershipMutation = useMutation({
    mutationFn: async (data: typeof sponsorForm & { selectedPackage: string }) => {
      const response = await apiRequest('POST', '/api/partnerships', data);
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
      setSelectedPackage('');
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact our partnerships team directly.",
        variant: "destructive",
      });
    }
  });

  const generateLetter = () => {
    if (!sponsorForm.companyName || !sponsorForm.email || !selectedPackage) {
      toast({
        title: "Missing Information",
        description: "Please fill in company name, email, and select a package to generate a sponsor letter.",
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative">
      
      {/* Luxury Magazine Paper Texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='1' cy='1' r='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10 py-16">
        
        {/* Premium Magazine Masthead */}
        <div className="text-center mb-24 relative">
          {/* Elegant Top Border */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent mb-8"></div>
          
          {/* Magazine Title Section */}
          <div className="mb-12">
            <div className="inline-block px-8 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 mb-8">
              <span className="text-xs font-medium tracking-[0.4em] text-slate-600 dark:text-slate-400 uppercase">Partnership Portfolio</span>
            </div>
            <h1 className="text-8xl font-extralight text-slate-900 dark:text-white mb-6 tracking-[-0.02em] leading-none">
              YAADFLEX
            </h1>
            <div className="text-lg font-light text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase mb-8">
              Executive Partnerships
            </div>
            <div className="w-24 h-px bg-slate-400 dark:bg-slate-500 mx-auto mb-8"></div>
          </div>

          {/* Sophisticated Subtitle */}
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl font-light text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
              Exclusive partnership opportunities with Jamaica's premier mobility platform
            </p>
            <div className="text-sm font-light text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              Est. 2024 • Kingston, Jamaica
            </div>
          </div>
          
          {/* Premium Statistics Bar */}
          <div className="mt-16 border-t border-b border-slate-200 dark:border-slate-700 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-extralight text-slate-900 dark:text-white mb-1">150K+</div>
                <div className="text-xs font-light tracking-[0.15em] text-slate-600 dark:text-slate-400 uppercase">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extralight text-slate-900 dark:text-white mb-1">50K+</div>
                <div className="text-xs font-light tracking-[0.15em] text-slate-600 dark:text-slate-400 uppercase">Professional Drivers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extralight text-slate-900 dark:text-white mb-1">24/7</div>
                <div className="text-xs font-light tracking-[0.15em] text-slate-600 dark:text-slate-400 uppercase">Operations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extralight text-slate-900 dark:text-white mb-1">14</div>
                <div className="text-xs font-light tracking-[0.15em] text-slate-600 dark:text-slate-400 uppercase">Parishes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Feature Spread */}
        <div className="mb-32 py-20 border-t border-slate-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-extralight text-slate-900 dark:text-white mb-6 tracking-[-0.01em]">
                The Platform
              </h2>
              <div className="w-16 h-px bg-slate-400 dark:bg-slate-500 mx-auto mb-8"></div>
              <p className="text-xl font-light text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                A comprehensive ecosystem connecting premium brands with Jamaica's most sophisticated mobile platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                  <Users className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="text-3xl font-extralight text-slate-900 dark:text-white mb-3">150,000+</div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400 tracking-[0.1em] uppercase mb-4">Monthly Active Users</div>
                <p className="text-sm font-light text-slate-500 dark:text-slate-500 leading-relaxed">
                  Premium customer base across all 14 parishes with high engagement rates and loyalty
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="text-3xl font-extralight text-slate-900 dark:text-white mb-3">$2M+</div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400 tracking-[0.1em] uppercase mb-4">Monthly Transaction Volume</div>
                <p className="text-sm font-light text-slate-500 dark:text-slate-500 leading-relaxed">
                  Substantial economic impact with consistent growth and premium transaction values
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Statement */}
        <div className="mb-32 py-20 bg-slate-50 dark:bg-slate-900/30 border-t border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-3xl mx-auto text-center px-8">
            <div className="text-7xl font-serif text-slate-300 dark:text-slate-600 mb-6 leading-none">"</div>
            <blockquote className="text-3xl font-extralight text-slate-800 dark:text-slate-200 leading-relaxed mb-8 italic">
              Partnership excellence through strategic alignment with Jamaica's premier mobility ecosystem
            </blockquote>
            <div className="w-20 h-px bg-slate-400 dark:bg-slate-500 mx-auto mb-6"></div>
            <cite className="text-sm font-light text-slate-600 dark:text-slate-400 tracking-[0.2em] uppercase">
              Executive Leadership Team
            </cite>
          </div>
        </div>

        {/* Partnership Portfolio */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extralight text-slate-900 dark:text-white mb-6 tracking-[-0.01em]">
              Partnership Portfolio
            </h2>
            <div className="w-16 h-px bg-slate-400 dark:bg-slate-500 mx-auto mb-8"></div>
            <p className="text-xl font-light text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Curated partnership opportunities designed for discerning organizations seeking strategic market positioning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {sponsorshipPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`group cursor-pointer transition-all duration-700 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-slate-400 dark:hover:border-slate-500 ${
                  selectedPackage === pkg.id ? 'ring-1 ring-slate-400 shadow-xl border-slate-400 dark:border-slate-500' : ''
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
                data-testid={`package-${pkg.id}`}
              >
                {/* Premium Package Layout */}
                <div className="p-10">
                  {/* Package Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                        <div className="text-slate-700 dark:text-slate-300">
                          {pkg.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-extralight text-slate-900 dark:text-white leading-tight">
                          {pkg.name.split(' ').slice(1).join(' ')}
                        </h3>
                        <div className="text-sm font-light text-slate-500 dark:text-slate-400 tracking-[0.1em] uppercase mt-1">
                          Partnership Program
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-light text-slate-500 dark:text-slate-400 tracking-[0.1em] uppercase mb-1">
                        Investment
                      </div>
                      <div className="text-2xl font-extralight text-slate-900 dark:text-white">
                        {pkg.price.split(' ')[1]}
                      </div>
                      <div className="text-sm font-light text-slate-500 dark:text-slate-400">
                        {pkg.price.split(' ')[2]}
                      </div>
                    </div>
                  </div>

                  {/* Elegant Divider */}
                  <div className="w-full h-px bg-slate-200 dark:bg-slate-700 mb-8"></div>

                  {/* Benefits List */}
                  <div className="space-y-4">
                    {pkg.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-1 h-1 bg-slate-400 dark:bg-slate-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-slate-700 dark:text-slate-300 font-light leading-relaxed">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Selection Indicator */}
                  {selectedPackage === pkg.id && (
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-center">
                        <span className="text-sm font-light text-slate-600 dark:text-slate-400 tracking-[0.15em] uppercase">
                          Selected for Partnership
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Contact Form */}
        <div className="mt-32 py-20 border-t border-slate-200 dark:border-slate-700">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-extralight text-slate-900 dark:text-white mb-6 tracking-[-0.01em]">
                Partnership Inquiry
              </h2>
              <div className="w-16 h-px bg-slate-400 dark:bg-slate-500 mx-auto mb-8"></div>
              <p className="text-xl font-light text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit your partnership inquiry for executive review and strategic consultation
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-12">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label htmlFor="companyName" className="text-sm font-light tracking-[0.1em] text-slate-600 dark:text-slate-400 uppercase mb-3 block">
                      Organization
                    </Label>
                    <Input
                      id="companyName"
                      value={sponsorForm.companyName}
                      onChange={(e) => setSponsorForm({...sponsorForm, companyName: e.target.value})}
                      className="border-0 border-b border-slate-300 dark:border-slate-600 rounded-none bg-transparent px-0 py-3 text-lg font-light focus:border-slate-500 focus:ring-0"
                      placeholder="Company or Organization Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactName" className="text-sm font-light tracking-[0.1em] text-slate-600 dark:text-slate-400 uppercase mb-3 block">
                      Executive Contact
                    </Label>
                    <Input
                      id="contactName"
                      value={sponsorForm.contactName}
                      onChange={(e) => setSponsorForm({...sponsorForm, contactName: e.target.value})}
                      className="border-0 border-b border-slate-300 dark:border-slate-600 rounded-none bg-transparent px-0 py-3 text-lg font-light focus:border-slate-500 focus:ring-0"
                      placeholder="Full Name and Title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label htmlFor="email" className="text-sm font-light tracking-[0.1em] text-slate-600 dark:text-slate-400 uppercase mb-3 block">
                      Executive Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={sponsorForm.email}
                      onChange={(e) => setSponsorForm({...sponsorForm, email: e.target.value})}
                      className="border-0 border-b border-slate-300 dark:border-slate-600 rounded-none bg-transparent px-0 py-3 text-lg font-light focus:border-slate-500 focus:ring-0"
                      placeholder="executive@organization.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-light tracking-[0.1em] text-slate-600 dark:text-slate-400 uppercase mb-3 block">
                      Direct Line
                    </Label>
                    <Input
                      id="phone"
                      value={sponsorForm.phone}
                      onChange={(e) => setSponsorForm({...sponsorForm, phone: e.target.value})}
                      className="border-0 border-b border-slate-300 dark:border-slate-600 rounded-none bg-transparent px-0 py-3 text-lg font-light focus:border-slate-500 focus:ring-0"
                      placeholder="876.XXX.XXXX"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-light tracking-[0.1em] text-slate-600 dark:text-slate-400 uppercase mb-3 block">
                    Strategic Objectives
                  </Label>
                  <Textarea
                    id="message"
                    value={sponsorForm.message}
                    onChange={(e) => setSponsorForm({...sponsorForm, message: e.target.value})}
                    className="border-0 border-b border-slate-300 dark:border-slate-600 rounded-none bg-transparent px-0 py-3 text-lg font-light focus:border-slate-500 focus:ring-0 min-h-32 resize-none"
                    placeholder="Please outline your partnership objectives and strategic vision..."
                  />
                </div>
              </div>

              <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-600">
                <Button
                  onClick={submitPartnership}
                  disabled={partnershipMutation.isPending}
                  className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-light tracking-[0.15em] uppercase transition-all duration-300"
                >
                  {partnershipMutation.isPending ? 'Submitting Inquiry...' : 'Submit Partnership Inquiry'}
                </Button>
                
                <Button
                  onClick={generateLetter}
                  variant="outline"
                  disabled={generateLetterMutation.isPending}
                  className="px-12 py-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-light tracking-[0.15em] uppercase transition-all duration-300"
                >
                  {generateLetterMutation.isPending ? 'Preparing...' : 'Request Executive Proposal'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}