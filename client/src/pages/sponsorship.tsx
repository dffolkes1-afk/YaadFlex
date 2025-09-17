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
    <div className="yf-background-system min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative luxury-yf overflow-hidden">
      
      {/* Glamorous Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-amber-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-amber-400/30 to-orange-400/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-40 w-28 h-28 bg-gradient-to-r from-orange-400/25 to-rose-400/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 right-20 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-amber-500/10 transform rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-32 w-12 h-12 bg-gradient-to-br from-amber-500/15 to-orange-500/10 transform rotate-12 animate-reverse-spin"></div>
        
        {/* Glowing Lines */}
        <div className="absolute top-60 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent animate-pulse"></div>
        <div className="absolute bottom-80 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      {/* YF Watermark - subtle bottom right only */}
      <div className="yf-watermark"></div>
      
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
            <div className="inline-block px-8 py-3 border-2 border-amber-400 bg-gradient-to-r from-amber-100 to-emerald-100 dark:bg-gradient-to-r dark:from-amber-900 dark:to-emerald-900 mb-8">
              <span className="text-xs font-medium tracking-[0.4em] text-amber-800 dark:text-amber-200 uppercase">Partnership Portfolio</span>
            </div>
            <div className="relative group">
              {/* Glamorous Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 via-amber-400/20 to-orange-400/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse"></div>
              
              <h1 className="text-8xl font-extralight bg-gradient-to-r from-emerald-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-6 tracking-[-0.02em] leading-none relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700">
                YAADFLEX
              </h1>
              
              {/* YF Monogram Behind Title with Glow */}
              <div className="absolute -top-8 -left-8 yf-monogram text-[12rem] font-black text-emerald-200/20 dark:text-emerald-800/20 -z-10 drop-shadow-xl"></div>
            </div>
            <div className="text-lg font-light text-emerald-700 dark:text-emerald-400 tracking-[0.2em] uppercase mb-8">
              Executive Partnerships
            </div>
            <div className="w-24 h-px bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto mb-8"></div>
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
          <div className="mt-16 border-t-2 border-b-2 border-amber-400 bg-gradient-to-r from-emerald-100 via-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-700 py-8 relative caribbean-yf shadow-2xl backdrop-blur-sm">
            {/* Glamorous Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto relative z-10">
              <div className="text-center group">
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-xl group-hover:from-emerald-400/40 transition-all duration-500"></div>
                  <div className="text-3xl font-extralight text-emerald-700 dark:text-emerald-400 mb-1 relative z-10 group-hover:scale-110 transition-transform duration-300">150K+</div>
                  <div className="text-xs font-light tracking-[0.15em] text-emerald-600 dark:text-emerald-500 uppercase relative z-10">Active Users</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent rounded-xl group-hover:from-amber-400/40 transition-all duration-500"></div>
                  <div className="text-3xl font-extralight text-amber-700 dark:text-amber-400 mb-1 relative z-10 group-hover:scale-110 transition-transform duration-300">50K+</div>
                  <div className="text-xs font-light tracking-[0.15em] text-amber-600 dark:text-amber-500 uppercase relative z-10">Professional Drivers</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent rounded-xl group-hover:from-orange-400/40 transition-all duration-500"></div>
                  <div className="text-3xl font-extralight text-orange-700 dark:text-orange-400 mb-1 relative z-10 group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-xs font-light tracking-[0.15em] text-orange-600 dark:text-orange-500 uppercase relative z-10">Operations</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900 dark:to-rose-800 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 to-transparent rounded-xl group-hover:from-rose-400/40 transition-all duration-500"></div>
                  <div className="text-3xl font-extralight text-rose-700 dark:text-rose-400 mb-1 relative z-10 group-hover:scale-110 transition-transform duration-300">14</div>
                  <div className="text-xs font-light tracking-[0.15em] text-rose-600 dark:text-rose-500 uppercase relative z-10">Parishes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Feature Spread */}
        <div className="mb-32 py-20 bg-gradient-to-r from-emerald-100/50 via-amber-100/50 to-orange-100/50 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-slate-700/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-extralight bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent mb-6 tracking-[-0.01em]">
                The Platform
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto mb-8"></div>
              <p className="text-xl font-light text-emerald-800 dark:text-emerald-300 leading-relaxed max-w-2xl mx-auto">
                A comprehensive ecosystem connecting premium brands with Jamaica's most sophisticated mobile platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="text-center group">
                <div className="relative p-8 bg-gradient-to-br from-white via-emerald-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl group-hover:shadow-3xl group-hover:-translate-y-2 transition-all duration-700">
                  {/* Glamorous Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 rounded-2xl p-px">
                    <div className="h-full w-full bg-gradient-to-br from-white via-emerald-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/50 to-transparent rounded-full animate-pulse"></div>
                      <Users className="h-10 w-10 text-white relative z-10" />
                    </div>
                    <div className="text-4xl font-extralight text-emerald-700 dark:text-emerald-400 mb-3 group-hover:scale-105 transition-transform duration-300">150,000+</div>
                    <div className="text-sm font-light text-emerald-600 dark:text-emerald-500 tracking-[0.1em] uppercase mb-4">Monthly Active Users</div>
                    <p className="text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                      Premium customer base across all 14 parishes with high engagement rates and loyalty
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="relative p-8 bg-gradient-to-br from-white via-amber-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl group-hover:shadow-3xl group-hover:-translate-y-2 transition-all duration-700">
                  {/* Glamorous Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 rounded-2xl p-px">
                    <div className="h-full w-full bg-gradient-to-br from-white via-amber-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-300/50 to-transparent rounded-full animate-pulse"></div>
                      <TrendingUp className="h-10 w-10 text-white relative z-10" />
                    </div>
                    <div className="text-4xl font-extralight text-amber-700 dark:text-amber-400 mb-3 group-hover:scale-105 transition-transform duration-300">$2M+</div>
                    <div className="text-sm font-light text-amber-600 dark:text-amber-500 tracking-[0.1em] uppercase mb-4">Monthly Transaction Volume</div>
                    <p className="text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                      Substantial economic impact with consistent growth and premium transaction values
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Statement */}
        <div className="mb-32 py-20 bg-gradient-to-r from-amber-100 via-emerald-100 to-orange-100 dark:bg-slate-900/30 border-t-2 border-b-2 border-amber-400 relative luxury-yf">
          <div className="max-w-3xl mx-auto text-center px-8 relative z-10">
            <div className="text-7xl font-serif text-amber-400 mb-6 leading-none">
              "
            </div>
            <blockquote className="text-3xl font-extralight text-emerald-800 dark:text-emerald-200 leading-relaxed mb-8 italic">
              Partnership excellence through strategic alignment with Jamaica's premier mobility ecosystem
            </blockquote>
            <div className="w-20 h-px bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto mb-6"></div>
            <cite className="text-sm font-light text-amber-700 dark:text-amber-400 tracking-[0.2em] uppercase">
              Executive Leadership Team
            </cite>
          </div>
        </div>

        {/* Partnership Portfolio */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extralight bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent mb-6 tracking-[-0.01em]">
              Partnership Portfolio
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto mb-8"></div>
            <p className="text-xl font-light text-emerald-800 dark:text-emerald-300 leading-relaxed max-w-2xl mx-auto">
              Curated partnership opportunities designed for discerning organizations seeking strategic market positioning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto relative">
            {sponsorshipPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`group cursor-pointer transition-all duration-700 bg-gradient-to-br from-white via-amber-50/30 to-emerald-50/30 dark:bg-slate-900 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 hover:rotate-1 ${
                  selectedPackage === pkg.id ? 'shadow-3xl -translate-y-3 rotate-1 ring-4 ring-amber-400/50' : ''
                } relative overflow-hidden`}
                onClick={() => setSelectedPackage(pkg.id)}
                data-testid={`package-${pkg.id}`}
              >
                {/* Glamorous Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-amber-400/20 to-orange-400/20 rounded-2xl p-px opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="h-full w-full bg-gradient-to-br from-white via-amber-50/30 to-emerald-50/30 dark:bg-slate-900 rounded-2xl"></div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                {/* Premium Package Layout */}
                <div className="p-10 relative z-10">
                  {/* Package Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${pkg.color} rounded-2xl shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl animate-pulse"></div>
                        <div className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300">
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
              <h2 className="text-5xl font-extralight bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent mb-6 tracking-[-0.01em]">
                Partnership Inquiry
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto mb-8"></div>
              <p className="text-xl font-light text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Submit your partnership inquiry for executive review and strategic consultation
              </p>
            </div>
            
            <div className="relative bg-gradient-to-br from-white via-amber-50/20 to-emerald-50/20 dark:bg-slate-900 rounded-2xl p-12 shadow-3xl overflow-hidden">
              {/* Glamorous Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-amber-400 to-orange-400 rounded-2xl p-px">
                <div className="h-full w-full bg-gradient-to-br from-white via-amber-50/20 to-emerald-50/20 dark:bg-slate-900 rounded-2xl"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-10 right-10 w-6 h-6 bg-gradient-to-r from-emerald-400/30 to-amber-400/30 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-4 h-4 bg-gradient-to-r from-amber-400/40 to-orange-400/30 rounded-full blur-sm animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="space-y-8 relative z-10">
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
                  className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white shadow-2xl hover:shadow-3xl font-light tracking-[0.15em] uppercase transition-all duration-500 hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{partnershipMutation.isPending ? 'Submitting Inquiry...' : 'Submit Partnership Inquiry'}</span>
                </Button>
                
                <Button
                  onClick={generateLetter}
                  variant="outline"
                  disabled={generateLetterMutation.isPending}
                  className="px-12 py-4 border-2 border-amber-400 text-amber-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:bg-amber-900/20 font-light tracking-[0.15em] uppercase transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-200/50 to-orange-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{generateLetterMutation.isPending ? 'Preparing...' : 'Request Executive Proposal'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}