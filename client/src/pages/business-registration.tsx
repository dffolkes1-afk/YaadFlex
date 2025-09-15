import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Store,
  Plane,
  Utensils,
  Car,
  Home,
  Briefcase,
  Music,
  Scissors,
  Wrench,
  Camera,
  GraduationCap,
  Heart,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { Link } from 'wouter';

const businessCategories = [
  { id: 'travel', name: '✈️ Travel Agents', desc: 'Hotels, flights, tours, vacation packages', icon: <Plane className="h-5 w-5" />, color: 'bg-blue-500' },
  { id: 'restaurant', name: '🍽️ Restaurants & Food', desc: 'Dining, takeout, catering, food delivery', icon: <Utensils className="h-5 w-5" />, color: 'bg-green-500' },
  { id: 'transportation', name: '🚗 Transportation', desc: 'Taxi, rentals, tours, logistics', icon: <Car className="h-5 w-5" />, color: 'bg-yellow-500' },
  { id: 'accommodation', name: '🏨 Hotels & Lodging', desc: 'Hotels, guest houses, vacation rentals', icon: <Home className="h-5 w-5" />, color: 'bg-purple-500' },
  { id: 'entertainment', name: '🎵 Entertainment', desc: 'DJs, bands, event planning, venues', icon: <Music className="h-5 w-5" />, color: 'bg-pink-500' },
  { id: 'beauty', name: '💄 Beauty & Wellness', desc: 'Salons, spas, barbers, fitness', icon: <Scissors className="h-5 w-5" />, color: 'bg-orange-500' },
  { id: 'services', name: '🔧 Professional Services', desc: 'Repair, maintenance, consulting', icon: <Wrench className="h-5 w-5" />, color: 'bg-red-500' },
  { id: 'photography', name: '📸 Photography & Media', desc: 'Photographers, videographers, designers', icon: <Camera className="h-5 w-5" />, color: 'bg-indigo-500' },
  { id: 'education', name: '📚 Education & Training', desc: 'Tutoring, courses, workshops', icon: <GraduationCap className="h-5 w-5" />, color: 'bg-teal-500' },
  { id: 'healthcare', name: '⚕️ Healthcare & Medical', desc: 'Clinics, practitioners, wellness', icon: <Heart className="h-5 w-5" />, color: 'bg-emerald-500' },
];

type BusinessFormData = {
  businessName: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  services: string;
  operatingHours: string;
  parish: string;
};

export default function BusinessRegistration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    services: '',
    operatingHours: '',
    parish: ''
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToBusinessAgreement, setAgreedToBusinessAgreement] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const jamaicaParishes = [
    'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary',
    'St. Ann', 'Trelawny', 'St. James', 'Hanover', 'Westmoreland',
    'St. Elizabeth', 'Manchester', 'Clarendon', 'St. Catherine'
  ];

  // Business registration mutation
  const registerBusinessMutation = useMutation({
    mutationFn: async (businessData: BusinessFormData) => {
      const response = await apiRequest('POST', '/api/businesses/register', businessData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🎉 Business Registered Successfully!",
        description: `Welcome to YaadFlex, ${formData.businessName}! Your business is now part of Jamaica's premier platform.`,
      });
      // Reset form
      setFormData({
        businessName: '', category: '', description: '', address: '', phone: '',
        email: '', website: '', services: '', operatingHours: '', parish: ''
      });
      setSelectedCategory('');
      queryClient.invalidateQueries({ queryKey: ['/api/businesses'] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to register business. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof BusinessFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFormData(prev => ({ ...prev, category: categoryId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.category || !formData.phone || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Business Name, Category, Phone, Email).",
        variant: "destructive",
      });
      return;
    }

    // Check legal agreements
    if (!agreedToTerms || !agreedToBusinessAgreement || !agreedToPrivacy) {
      toast({
        title: "Legal Agreements Required",
        description: "Please review and accept all legal agreements to complete business registration.",
        variant: "destructive",
      });
      return;
    }

    // CRITICAL: Include legal acceptance fields in POST payload for backend persistence
    const completeBusinessData = {
      ...formData,
      // Legal acceptance fields - required for legal compliance
      agreedToTerms,
      agreedToBusinessAgreement,
      agreedToPrivacy
    };

    registerBusinessMutation.mutate(completeBusinessData);
  };

  const selectedCategoryInfo = businessCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent mb-2">
            🇯🇲 Join YaadFlex Business Network
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Connect your business with customers across Jamaica and beyond!
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-green-600">✓ Free Registration</Badge>
            <Badge variant="secondary" className="text-blue-600">✓ Global Reach</Badge>
            <Badge variant="secondary" className="text-purple-600">✓ Instant Bookings</Badge>
            <Badge variant="secondary" className="text-orange-600">✓ Secure Payments</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Business Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Choose Your Category
                </CardTitle>
                <CardDescription>
                  Select the category that best describes your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {businessCategories.map((category) => (
                    <Card 
                      key={category.id}
                      className={`cursor-pointer transition-all ${
                        selectedCategory === category.id 
                          ? 'ring-2 ring-accent bg-accent/10' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleCategorySelect(category.id)}
                      data-testid={`category-${category.id}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${category.color} text-white`}>
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{category.name}</h4>
                            <p className="text-xs text-muted-foreground">{category.desc}</p>
                          </div>
                          {selectedCategory === category.id && (
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Business Registration Form
                </CardTitle>
                <CardDescription>
                  {selectedCategoryInfo 
                    ? `Registering as: ${selectedCategoryInfo.name}`
                    : "Please select a category first"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        placeholder="Your Business Name"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        data-testid="input-business-name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="parish">Parish *</Label>
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

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="+1-876-XXX-XXXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-10"
                          data-testid="input-phone"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="business@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10"
                          data-testid="input-email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address & Website */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Physical Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="address"
                          placeholder="Street address, town/city"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="pl-10 min-h-[80px]"
                          data-testid="input-address"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="website">Website (Optional)</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          placeholder="https://your-website.com"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="pl-10"
                          data-testid="input-website"
                        />
                      </div>
                      
                      <div className="mt-2">
                        <Label htmlFor="operatingHours">Operating Hours</Label>
                        <Input
                          id="operatingHours"
                          placeholder="Mon-Fri 9AM-5PM, Sat 10AM-3PM"
                          value={formData.operatingHours}
                          onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                          data-testid="input-hours"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Description */}
                  <div>
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your business, what makes it special..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="min-h-[100px]"
                      data-testid="input-description"
                    />
                  </div>

                  {/* Services Offered */}
                  <div>
                    <Label htmlFor="services">Services & Products</Label>
                    <Textarea
                      id="services"
                      placeholder="List your main services, products, or specialties..."
                      value={formData.services}
                      onChange={(e) => handleInputChange('services', e.target.value)}
                      className="min-h-[80px]"
                      data-testid="input-services"
                    />
                  </div>

                  {/* Benefits Display */}
                  <Card className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-950/20 dark:to-yellow-950/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">
                        🎯 Your YaadFlex Benefits:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600">✓</Badge>
                          <span>Reach customers across Jamaica & globally</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-blue-600">✓</Badge>
                          <span>Instant booking & payment system</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-purple-600">✓</Badge>
                          <span>Professional business profile</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-orange-600">✓</Badge>
                          <span>24/7 customer support platform</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Legal Agreements */}
                  <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Legal Agreements & Partnership Terms
                      </h3>
                      <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                        By registering your business on YaadFlex, you're entering into a commercial partnership with BlackRock, Inc. 
                        Please review and accept the following legal documents:
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <Checkbox 
                            id="business-terms-agreement"
                            checked={agreedToTerms}
                            onCheckedChange={setAgreedToTerms}
                            data-testid="checkbox-business-terms"
                          />
                          <div className="flex-1">
                            <label htmlFor="business-terms-agreement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                            id="business-partner-agreement"
                            checked={agreedToBusinessAgreement}
                            onCheckedChange={setAgreedToBusinessAgreement}
                            data-testid="checkbox-business-agreement"
                          />
                          <div className="flex-1">
                            <label htmlFor="business-partner-agreement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              I agree to the Business Partner Agreement (commercial partnership terms)
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Platform fees, payment terms, and business relationship with BlackRock. 
                              <Link href="/business-partner-agreement" className="text-blue-600 hover:underline ml-1">Read Agreement →</Link>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <Checkbox 
                            id="business-privacy-policy"
                            checked={agreedToPrivacy}
                            onCheckedChange={setAgreedToPrivacy}
                            data-testid="checkbox-business-privacy"
                          />
                          <div className="flex-1">
                            <label htmlFor="business-privacy-policy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              I acknowledge BlackRock's Privacy Policy
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">
                              How customer and business data is protected and managed. 
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

                  {/* Submit Button */}
                  <Button 
                    type="submit"
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600"
                    disabled={registerBusinessMutation.isPending || !selectedCategory}
                    data-testid="button-register-business"
                  >
                    {registerBusinessMutation.isPending ? (
                      "Registering Your Business..."
                    ) : (
                      "🚀 Join YaadFlex Business Network - FREE!"
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By registering, you agree to YaadFlex's Terms of Service and Privacy Policy. 
                    Your business will be reviewed and activated within 24 hours.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}