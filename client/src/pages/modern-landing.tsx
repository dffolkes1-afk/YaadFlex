import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Car, MapPin, DollarSign, Users, Star, Calculator, Phone, ArrowRight, Zap, Shield, Globe, Monitor, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ModernLanding() {
  const [currentExample, setCurrentExample] = useState(0);

  const pricingExamples = [
    {
      route: "Downtown → Half Way Tree",
      distance: "7km, 20 mins",
      price: "J$1,040",
      breakdown: "Base J$250 + Distance J$490 + Time J$300",
      color: "from-gray-600 to-blue-600"
    },
    {
      route: "Uptown Business → Barbican", 
      distance: "5km, 15 mins + extras",
      price: "J$1,175",
      breakdown: "Base J$300 + Distance J$350 + Time J$225 + Service J$200 + Stop J$100",
      color: "from-blue-600 to-gray-700"
    },
    {
      route: "Rural Clarendon → May Pen",
      distance: "10km, 25 mins",
      price: "J$1,675", 
      breakdown: "Rural Base J$400 + Distance J$700 + Time J$375 + 2 Extra Pass J$200",
      color: "from-gray-700 to-blue-700"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % pricingExamples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.title = "YaadFlex Global Vybz - Level Up Your Ride!";
    
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "YaadFlex Global Vybz - The Caribbean super-app that pays drivers 85%! Real JMD pricing, Lipstick & Shadow fleets. Level up your ride, level up your vybz!";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-gray-900 dark:text-white">
      
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-gray-500/5"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                YaadFlex Global Vybz
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Professional Business Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
              <a href="https://t.me/yaadflex" target="_blank" rel="noopener" data-testid="link-telegram">
                Join Network
              </a>
            </Button>
            <Button className="bg-gradient-to-r from-gray-800 to-blue-600 text-white hover:shadow-lg" asChild>
              <Link href="/links" data-testid="button-enter-app">
                Access Platform
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Hero Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Caribbean-Born • Global Reach</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-white">
                  Professional
                </span>
                <br />
                <span className="text-blue-600">Business Platform</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                The Caribbean super-app that <strong className="text-blue-600">actually PAYS drivers 85%!</strong> 
                Real Jamaican Dollar pricing, no games, no gimmicks. Professional business solutions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button size="lg" className="bg-gradient-to-r from-gray-800 to-blue-600 text-white hover:shadow-xl" asChild>
                <Link href="/pricing" data-testid="button-see-pricing">
                  <Calculator className="h-5 w-5 mr-2" />
                  View Pricing
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white" asChild>
                <Link href="/driver-registration" data-testid="button-start-driving">
                  <Car className="h-5 w-5 mr-2" />
                  Driver Portal
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
                <Link href="/book-ride" data-testid="button-book-ride">
                  <MapPin className="h-5 w-5 mr-2" />
                  Book Transport
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white" asChild>
                <Link href="/universal-remote" data-testid="button-remote-control">
                  <Monitor className="h-5 w-5 mr-2" />
                  IoT Control
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white" asChild>
                <Link href="/travel-booking" data-testid="button-travel-booking">
                  <Plane className="h-5 w-5 mr-2" />
                  Travel Services
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white" asChild>
                <Link href="/trading-dashboard" data-testid="button-trading">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Trading Platform
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Business Inquiries: dChris@yaadflexglobalvybz.com</span>
              </div>
            </div>
          </div>

          {/* Right Column - Live Pricing Display */}
          <div className="space-y-6">
            {/* Real-Time Pricing Card */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-yellow-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <DollarSign className="h-5 w-5" />
                  Real Jamaica Pricing (Live!)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-6 rounded-xl bg-gradient-to-r ${pricingExamples[currentExample].color} text-white`}>
                  <div className="text-lg font-semibold">{pricingExamples[currentExample].route}</div>
                  <div className="text-sm opacity-90">{pricingExamples[currentExample].distance}</div>
                  <div className="text-3xl font-bold mt-2">{pricingExamples[currentExample].price}</div>
                  <div className="text-sm mt-2 opacity-80">{pricingExamples[currentExample].breakdown}</div>
                </div>
                
                {/* Example Dots */}
                <div className="flex justify-center gap-2">
                  {pricingExamples.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentExample ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fleet Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-red-600 rounded-lg mx-auto mb-2"></div>
                  <div className="font-bold text-gray-900 dark:text-white">Municipal Fleet</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Standard Areas</div>
                  <div className="text-sm font-semibold text-red-600">85% Earnings</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg mx-auto mb-2"></div>
                  <div className="font-bold text-gray-900 dark:text-white">Premium Fleet</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Executive Zones</div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Premium Service</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Professional Features
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300">Enterprise-grade business solutions</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: DollarSign,
              title: "85% Driver Earnings",
              description: "Industry-leading commission structure. Drivers keep 85% of every fare - highest in the Caribbean.",
              color: "text-green-600"
            },
            {
              icon: Calculator,
              title: "Transparent Pricing",
              description: "No hidden fees. Base fare + J$70/km + J$15/min. Professional pricing structure.",
              color: "text-blue-600"
            },
            {
              icon: Shield,
              title: "Fair Distribution",
              description: "Automated job assignment system ensures equal opportunities for all drivers.",
              color: "text-gray-600"
            },
            {
              icon: Users,
              title: "Business Services",
              description: "Corporate transport, executive services, and premium business solutions.",
              color: "text-blue-700"
            },
            {
              icon: Zap,
              title: "Digital Platform",
              description: "Automated payments, real estate, marketplace, IoT control - integrated business suite.",
              color: "text-gray-700"
            },
            {
              icon: Star,
              title: "Professional Network",
              description: "Quality service standards, verified drivers, and business-grade reliability.",
              color: "text-blue-800"
            }
          ].map((feature, i) => (
            <Card key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className={`w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "85%", label: "Driver Earnings", color: "text-green-600" },
              { number: "J$1,040", label: "Avg. Trip Cost", color: "text-blue-600" },
              { number: "2", label: "Fleet Types", color: "text-gray-600" },
              { number: "100%", label: "Digital Platform", color: "text-blue-700" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className={`text-4xl font-bold ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-12 border border-blue-200 dark:border-gray-700">
          <h3 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Join Our Platform?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join YaadFlex Global Vybz today and start building your professional business network.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-gray-800 to-blue-600 text-white hover:shadow-xl" asChild>
              <Link href="/driver-registration" data-testid="button-join-drivers">
                Start Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
              <Link href="/pricing" data-testid="button-calculate-earnings">
                View Pricing
              </Link>
            </Button>
          </div>
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Business inquiries: <a href="mailto:dChris@yaadflexglobalvybz.com" className="text-blue-600 hover:underline">dChris@yaadflexglobalvybz.com</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="text-gray-600 dark:text-gray-400">
            © 2025 YaadFlex Global Vybz - Professional Business Platform
          </div>
          <div className="flex gap-6">
            {[
              { name: "Instagram", url: "https://instagram.com/yaadflex" },
              { name: "LinkedIn", url: "https://linkedin.com/company/yaadflex" },
              { name: "Facebook", url: "https://facebook.com/yaadflex" },
              { name: "Telegram", url: "https://t.me/yaadflex" }
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors text-sm font-medium"
                data-testid={`link-${social.name.toLowerCase()}`}
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}