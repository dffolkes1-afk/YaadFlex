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
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-amber-100 to-rose-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-8 px-4 relative overflow-hidden">
      
      {/* Subtle Partnership Machine Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-20 right-20 w-32 h-32 border-4 border-emerald-600 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Magazine-Style Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-amber-500 to-emerald-600"></div>
          <div className="pt-8">
            <div className="inline-block border-2 border-amber-500 px-6 py-2 mb-6 bg-gradient-to-r from-amber-50 to-emerald-50">
              <span className="text-xs font-bold tracking-[0.3em] text-amber-700 uppercase">Luxury Partnership</span>
            </div>
            <h1 className="text-7xl font-light text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
              YAADFLEX
            </h1>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
            <p className="text-xl font-light text-slate-700 dark:text-slate-300 italic leading-relaxed max-w-2xl mx-auto">
              "Join Jamaica's most prestigious ride-sharing network and elevate your brand to luxury status"
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-light text-emerald-600 mb-2">150K+</div>
              <div className="text-xs tracking-wider text-slate-600 uppercase">Premium Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-amber-600 mb-2">50K+</div>
              <div className="text-xs tracking-wider text-slate-600 uppercase">Elite Drivers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-rose-600 mb-2">24/7</div>
              <div className="text-xs tracking-wider text-slate-600 uppercase">Operations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-purple-600 mb-2">100%</div>
              <div className="text-xs tracking-wider text-slate-600 uppercase">Island Coverage</div>
            </div>
          </div>
        </div>

        {/* Magazine-Style Feature Section */}
        <div className="mb-20 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 -mx-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block border-b-2 border-amber-500 pb-2 mb-4">
                <h2 className="text-4xl font-light tracking-wide text-slate-900 dark:text-white">THE YAADFLEX ADVANTAGE</h2>
              </div>
              <p className="text-lg font-light text-slate-600 dark:text-slate-400 italic">Luxury partnerships for discerning brands</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <div className="text-2xl font-light text-emerald-600 mb-2">150K+</div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400 uppercase tracking-wider">Active Users Monthly</div>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <div className="text-2xl font-light text-amber-600 mb-2">300%</div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400 uppercase tracking-wider">Growth Year Over Year</div>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <div className="text-2xl font-light text-rose-600 mb-2">14</div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400 uppercase tracking-wider">Parishes Covered</div>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign className="h-10 w-10 text-white" />
                </div>
                <div className="text-2xl font-light text-purple-600 mb-2">$2M+</div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400 uppercase tracking-wider">Monthly Transaction Volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Luxury Quote Section */}
        <div className="mb-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl text-amber-500 mb-4">"</div>
            <blockquote className="text-2xl font-light text-slate-700 dark:text-slate-300 italic leading-relaxed mb-6">
              Join the most exclusive partnership network in the Caribbean. Where luxury meets innovation.
            </blockquote>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent mx-auto mb-4"></div>
            <cite className="text-sm font-light text-slate-500 uppercase tracking-widest">YaadFlex Executive Team</cite>
          </div>
        </div>

        {/* Luxury Partnership Packages */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-block border-t-2 border-b-2 border-amber-500 py-4 px-8 mb-6">
              <h2 className="text-4xl font-light tracking-widest text-slate-900 dark:text-white uppercase">Partnership Tiers</h2>
            </div>
            <p className="text-lg font-light text-slate-600 dark:text-slate-400 italic">Exclusive opportunities for distinguished brands</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {sponsorshipPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`group cursor-pointer transition-all duration-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 ${
                  selectedPackage === pkg.id ? 'ring-2 ring-amber-500 shadow-2xl -translate-y-2 bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-slate-700 dark:to-slate-800' : ''
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
                data-testid={`package-${pkg.id}`}
              >
                {/* Luxury Package Header */}
                <div className="relative overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${pkg.color}`}></div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-full bg-gradient-to-r ${pkg.color} shadow-lg`}>
                        <div className="text-white">
                          {pkg.icon}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-light text-slate-500 uppercase tracking-widest mb-1">Starting At</div>
                        <div className="text-2xl font-light text-slate-900 dark:text-white">{pkg.price.split(' ')[1]}</div>
                        <div className="text-sm font-light text-slate-500">{pkg.price.split(' ')[2]}</div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-light text-slate-900 dark:text-white mb-2 group-hover:text-amber-700 transition-colors">
                      {pkg.name.split(' ').slice(1).join(' ')}
                    </h3>
                    <div className="w-16 h-px bg-gradient-to-r from-amber-500 to-transparent mb-6"></div>
                  </div>
                </div>

                {/* Luxury Benefits List */}
                <div className="px-8 pb-8">
                  <div className="space-y-4">
                    {pkg.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3 group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: `${idx * 100}ms` }}>
                        <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700 dark:text-slate-300 font-light leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
                    <div className="text-center">
                      <div className={`inline-block px-6 py-2 bg-gradient-to-r ${pkg.color} text-white text-sm font-light uppercase tracking-widest rounded-full`}>
                        Premium Tier
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Form */}
        <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border-amber-200 dark:border-amber-800">
          <CardHeader className="text-center">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-4"></div>
            <CardTitle className="text-3xl font-light tracking-wide text-slate-900 dark:text-white">Begin Your Partnership Journey</CardTitle>
            <CardDescription className="text-lg font-light text-slate-600 dark:text-slate-400 italic">
              Connect with Jamaica's premier ride-sharing network
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName" className="text-sm font-light uppercase tracking-wider text-slate-600 dark:text-slate-400">Company Name</Label>
                <Input
                  id="companyName"
                  value={sponsorForm.companyName}
                  onChange={(e) => setSponsorForm({...sponsorForm, companyName: e.target.value})}
                  className="mt-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  placeholder="Your distinguished company"
                />
              </div>
              <div>
                <Label htmlFor="contactName" className="text-sm font-light uppercase tracking-wider text-slate-600 dark:text-slate-400">Contact Person</Label>
                <Input
                  id="contactName"
                  value={sponsorForm.contactName}
                  onChange={(e) => setSponsorForm({...sponsorForm, contactName: e.target.value})}
                  className="mt-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  placeholder="Executive representative"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-light uppercase tracking-wider text-slate-600 dark:text-slate-400">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={sponsorForm.email}
                  onChange={(e) => setSponsorForm({...sponsorForm, email: e.target.value})}
                  className="mt-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  placeholder="executive@yourcompany.com"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-light uppercase tracking-wider text-slate-600 dark:text-slate-400">Phone Number</Label>
                <Input
                  id="phone"
                  value={sponsorForm.phone}
                  onChange={(e) => setSponsorForm({...sponsorForm, phone: e.target.value})}
                  className="mt-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  placeholder="1-876-XXX-XXXX"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="message" className="text-sm font-light uppercase tracking-wider text-slate-600 dark:text-slate-400">Partnership Vision</Label>
                <Textarea
                  id="message"
                  value={sponsorForm.message}
                  onChange={(e) => setSponsorForm({...sponsorForm, message: e.target.value})}
                  className="mt-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  rows={4}
                  placeholder="Share your vision for this luxury partnership..."
                />
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-600">
              <Button
                onClick={submitPartnership}
                disabled={partnershipMutation.isPending}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white font-light tracking-wider uppercase"
              >
                {partnershipMutation.isPending ? 'Processing...' : 'Join Partnership'}
              </Button>
              <Button
                onClick={generateLetter}
                variant="outline"
                disabled={generateLetterMutation.isPending}
                className="px-8 py-3 border-amber-500 text-amber-700 hover:bg-amber-50 font-light tracking-wider uppercase"
              >
                {generateLetterMutation.isPending ? 'Generating...' : 'Generate Proposal'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}