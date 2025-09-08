import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Diamond, 
  Crown, 
  Sparkles, 
  Zap,
  Trophy,
  Eye,
  Heart,
  Share2,
  ShoppingBag,
  CreditCard,
  Phone,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Award,
  Gem,
  Palette,
  Wand2
} from 'lucide-react';

type BusinessTheme = 'luxury' | 'gaming' | 'financial' | 'restaurant' | 'retail' | 'automotive' | 'technology';

type BusinessStorefront = {
  id: string;
  businessName: string;
  tagline: string;
  description: string;
  theme: BusinessTheme;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  coverImage?: string;
  features: string[];
  location: string;
  phone: string;
  hours: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  premium: boolean;
  specialOffers: string[];
};

export default function PremiumStorefrontPage() {
  const { user } = useAuth();
  
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>('supreme-venture');
  const [customizationMode, setCustomizationMode] = useState(false);

  // Sample premium business storefronts
  const premiumBusinesses: BusinessStorefront[] = [
    {
      id: 'supreme-venture',
      businessName: 'Supreme Venture',
      tagline: 'Jamaica\'s Premier Gaming & Entertainment Destination',
      description: 'Experience luxury gaming with our premium lottery, sports betting, and entertainment services. Trusted by over 2 million Jamaicans.',
      theme: 'gaming',
      primaryColor: '#FFD700', // Gold
      secondaryColor: '#8B0000', // Dark Red
      features: ['Premium Lottery Games', 'Live Sports Betting', 'VIP Gaming Lounges', 'Instant Payouts', 'Mobile Gaming'],
      location: 'Multiple Locations Across Jamaica',
      phone: '1-800-SUPREME',
      hours: '24/7 Online • Locations 6AM-11PM',
      rating: 4.8,
      reviewCount: 15420,
      verified: true,
      premium: true,
      specialOffers: ['Free $500 JMD Welcome Bonus', 'VIP Member Exclusive Games', 'Double Points Weekend']
    },
    {
      id: 'devon-house',
      businessName: 'Devon House',
      tagline: 'Taste The Difference - Premium Jamaican Ice Cream',
      description: 'Indulge in Jamaica\'s finest artisanal ice cream and gourmet dining experience in our historic mansion setting.',
      theme: 'luxury',
      primaryColor: '#E6E6FA', // Lavender
      secondaryColor: '#4B0082', // Indigo
      features: ['31 Premium Ice Cream Flavors', 'Historic Mansion Tours', 'Fine Dining Restaurant', 'Private Events', 'Gift Shop'],
      location: 'Hope Road, Kingston',
      phone: '1-876-929-6602',
      hours: '10AM-6PM Daily',
      rating: 4.9,
      reviewCount: 8750,
      verified: true,
      premium: true,
      specialOffers: ['Buy 2 Get 1 Free Ice Cream', 'Historic Tour + Ice Cream Package', 'Birthday Party Specials']
    },
    {
      id: 'scotiabank',
      businessName: 'Scotiabank Jamaica',
      tagline: 'Your Partner in Financial Success',
      description: 'Leading Caribbean financial institution offering premium banking, investment, and wealth management services.',
      theme: 'financial',
      primaryColor: '#FF0000', // Scotiabank Red
      secondaryColor: '#000000', // Black
      features: ['Private Banking', 'Investment Services', 'Mortgage Solutions', 'Business Banking', '24/7 Digital Banking'],
      location: '200+ Locations Island-wide',
      phone: '1-888-SCOTIA',
      hours: '24/7 Digital • Branches Mon-Fri 9AM-4PM',
      rating: 4.6,
      reviewCount: 23100,
      verified: true,
      premium: true,
      specialOffers: ['No Fee Banking for 6 Months', 'Premium Credit Cards', 'Mortgage Pre-approval in 24hrs']
    }
  ];

  const getThemeGradient = (theme: BusinessTheme, primaryColor: string, secondaryColor: string) => {
    switch (theme) {
      case 'gaming':
        return `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22)`;
      case 'luxury':
        return `linear-gradient(135deg, ${primaryColor}33, ${secondaryColor}33)`;
      case 'financial':
        return `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22)`;
      default:
        return `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22)`;
    }
  };

  const getThemeIcon = (theme: BusinessTheme) => {
    switch (theme) {
      case 'gaming': return <Diamond className="h-6 w-6" />;
      case 'luxury': return <Crown className="h-6 w-6" />;
      case 'financial': return <Trophy className="h-6 w-6" />;
      case 'restaurant': return <Star className="h-6 w-6" />;
      case 'retail': return <ShoppingBag className="h-6 w-6" />;
      case 'automotive': return <Zap className="h-6 w-6" />;
      default: return <Sparkles className="h-6 w-6" />;
    }
  };

  const selectedBusinessData = premiumBusinesses.find(b => b.id === selectedBusiness);

  const PremiumStorefront = ({ business }: { business: BusinessStorefront }) => (
    <div className="relative overflow-hidden">
      {/* Hero Section with Dynamic Gradient */}
      <div 
        className="relative h-96 flex items-center justify-center text-white"
        style={{ 
          background: `linear-gradient(135deg, ${business.primaryColor}DD, ${business.secondaryColor}DD), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="g"><stop offset="0%25" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%25" stop-color="%23000000" stop-opacity="0.1"/></radialGradient></defs><rect width="1000" height="1000" fill="url(%23g)"/></svg>')`,
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-white/5 animate-bounce"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 rounded-full bg-white/10 animate-pulse delay-1000"></div>
        </div>

        <div className="relative text-center z-10">
          <div className="flex items-center justify-center mb-4">
            <div 
              className="p-4 rounded-full mr-4"
              style={{ backgroundColor: business.primaryColor + '33' }}
            >
              {getThemeIcon(business.theme)}
            </div>
            {business.verified && (
              <Badge className="bg-green-500 text-white">
                <Award className="h-4 w-4 mr-1" />
                YaadFlex Verified
              </Badge>
            )}
          </div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            {business.businessName}
          </h1>
          
          <p className="text-2xl mb-6 text-yellow-100">
            {business.tagline}
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-bold">{business.rating}</span>
              <span className="text-lg opacity-75">({business.reviewCount.toLocaleString()} reviews)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-lg">Trusted by 2M+ Jamaicans</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4">
              <Phone className="h-5 w-5 mr-2" />
              Contact
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Business Info Cards */}
      <div className="p-8 bg-gradient-to-br from-background to-accent/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Business Details */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Location</Label>
                <p className="font-medium">{business.location}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Phone</Label>
                <p className="font-medium">{business.phone}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Hours</Label>
                <p className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  {business.hours}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="h-5 w-5 text-purple-600" />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {business.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Special Offers */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Exclusive YaadFlex Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {business.specialOffers.map((offer, index) => (
                  <div key={index} className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">{offer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Description */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-blue-600" />
              About {business.businessName}
            </h3>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {business.description}
            </p>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold">2M+</div>
              <div className="text-sm text-muted-foreground">Customers Served</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6">
              <Star className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <div className="text-2xl font-bold">{business.rating}/5</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6">
              <Award className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6">
              <Diamond className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold">Premium</div>
              <div className="text-sm text-muted-foreground">YaadFlex Partner</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto max-w-7xl py-8 px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-4">
            💎 Premium Business Storefronts
          </h1>
          <p className="text-2xl text-muted-foreground mb-6">
            Glamorous, Luxury Business Presentation on YaadFlex
          </p>
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            <Badge variant="secondary" className="text-purple-600 text-lg px-4 py-2">✨ Luxury Design</Badge>
            <Badge variant="secondary" className="text-blue-600 text-lg px-4 py-2">🎨 Custom Branding</Badge>
            <Badge variant="secondary" className="text-green-600 text-lg px-4 py-2">📈 Premium Features</Badge>
            <Badge variant="secondary" className="text-orange-600 text-lg px-4 py-2">💫 Animated Effects</Badge>
          </div>
        </div>

        <Tabs defaultValue="showcase" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="showcase" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Premium Showcase
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Customize Design
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Business Templates
            </TabsTrigger>
          </TabsList>

          {/* Premium Business Showcase */}
          <TabsContent value="showcase" className="space-y-6">
            
            {/* Business Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select a Premium Business to View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-wrap">
                  {premiumBusinesses.map((business) => (
                    <Button
                      key={business.id}
                      variant={selectedBusiness === business.id ? 'default' : 'outline'}
                      onClick={() => setSelectedBusiness(business.id)}
                      className="flex items-center gap-2"
                    >
                      {getThemeIcon(business.theme)}
                      {business.businessName}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Business Storefront */}
            {selectedBusinessData && (
              <div className="border rounded-lg overflow-hidden shadow-2xl">
                <PremiumStorefront business={selectedBusinessData} />
              </div>
            )}

          </TabsContent>

          {/* Customization Tools */}
          <TabsContent value="customize" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Design Your Glamorous Storefront
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Business Name</Label>
                    <Input placeholder="Enter your business name" />
                  </div>
                  <div>
                    <Label>Business Tagline</Label>
                    <Input placeholder="Your premium tagline" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>Primary Brand Color</Label>
                    <Input type="color" defaultValue="#FFD700" />
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <Input type="color" defaultValue="#8B0000" />
                  </div>
                  <div>
                    <Label>Business Theme</Label>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <Button size="sm" variant="outline">💎 Luxury</Button>
                      <Button size="sm" variant="outline">🎮 Gaming</Button>
                      <Button size="sm" variant="outline">💰 Financial</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Premium Features (one per line)</Label>
                  <textarea 
                    className="w-full p-3 border rounded-lg mt-2"
                    rows={5}
                    placeholder="Premium Service 1&#10;Luxury Experience 2&#10;Exclusive Offering 3"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate My Glamorous Storefront
                </Button>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Luxury Template */}
              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-purple-600" />
                    Luxury Theme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg mb-4 flex items-center justify-center">
                    <Crown className="h-16 w-16 text-purple-600 opacity-50" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Perfect for high-end services, luxury brands, and premium experiences.
                  </p>
                  <Button className="w-full">Use Luxury Theme</Button>
                </CardContent>
              </Card>

              {/* Gaming Template */}
              <Card className="border-2 border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Diamond className="h-5 w-5 text-yellow-600" />
                    Gaming Theme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-gradient-to-br from-yellow-100 to-red-100 dark:from-yellow-900/20 dark:to-red-900/20 rounded-lg mb-4 flex items-center justify-center">
                    <Diamond className="h-16 w-16 text-yellow-600 opacity-50" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Designed for gaming, entertainment, and lottery businesses.
                  </p>
                  <Button className="w-full">Use Gaming Theme</Button>
                </CardContent>
              </Card>

              {/* Financial Template */}
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-blue-600" />
                    Financial Theme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg mb-4 flex items-center justify-center">
                    <Trophy className="h-16 w-16 text-blue-600 opacity-50" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Professional design for banks, investment firms, and financial services.
                  </p>
                  <Button className="w-full">Use Financial Theme</Button>
                </CardContent>
              </Card>

            </div>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Gem className="h-5 w-5 text-green-600" />
                  Premium Storefront Benefits for Your Business Partners
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    <span>Luxury Visual Design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Increased Customer Trust</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span>Professional Credibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    <span>Enhanced Brand Image</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>Higher Customer Engagement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span>Premium Revenue Stream</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}