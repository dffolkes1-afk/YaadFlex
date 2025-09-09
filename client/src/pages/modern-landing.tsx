import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Car, MapPin, DollarSign, Users, Star, Calculator, Phone, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
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
      color: "from-blue-500 to-cyan-500"
    },
    {
      route: "Uptown Party Run → Barbican", 
      distance: "5km, 15 mins + extras",
      price: "J$1,175",
      breakdown: "Base J$300 + Distance J$350 + Time J$225 + Party J$200 + Stop J$100",
      color: "from-purple-500 to-pink-500"
    },
    {
      route: "Rural Clarendon → May Pen",
      distance: "10km, 25 mins",
      price: "J$1,675", 
      breakdown: "Rural Base J$400 + Distance J$700 + Time J$375 + 2 Extra Pass J$200",
      color: "from-green-500 to-emerald-500"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                YaadFlex Global Vybz
              </h1>
              <p className="text-xs text-gray-300">Level Up Your Ride!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black" asChild>
              <a href="https://t.me/yaadflex" target="_blank" rel="noopener" data-testid="link-telegram">
                Join Telegram
              </a>
            </Button>
            <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg" asChild>
              <Link href="/links" data-testid="button-enter-app">
                Enter App
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 px-4 py-2 rounded-full border border-green-500/30">
              <Globe className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">Caribbean-Born • Global Reach</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Level Up
                </span>
                <br />
                <span className="text-white">Your Vybz!</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                The Caribbean super-app that <strong className="text-yellow-400">actually PAYS drivers 85%!</strong> 
                Real Jamaican Dollar pricing, no games, no gimmicks. Join the revolution!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-xl transform hover:scale-105 transition-all" asChild>
                <Link href="/pricing" data-testid="button-see-pricing">
                  <Calculator className="h-5 w-5 mr-2" />
                  See Real Pricing
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black" asChild>
                <Link href="/driver-registration" data-testid="button-start-driving">
                  <Car className="h-5 w-5 mr-2" />
                  Start Driving
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black" asChild>
                <Link href="/book-ride" data-testid="button-book-ride">
                  <MapPin className="h-5 w-5 mr-2" />
                  Book A Ride
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black" asChild>
                <Link href="/universal-remote" data-testid="button-remote-control">
                  <Monitor className="h-5 w-5 mr-2" />
                  Remote Control
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Professional: dChris@yaadflexglobalvybz.com</span>
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
                        i === currentExample ? 'bg-yellow-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fleet Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-500/30">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2"></div>
                  <div className="font-bold text-red-400">Lipstick Fleet</div>
                  <div className="text-xs text-gray-300">Municipal Areas</div>
                  <div className="text-sm font-semibold text-red-300">85% Earnings</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-gray-400/20 to-gray-600/20 border border-gray-400/30">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2"></div>
                  <div className="font-bold text-gray-300">Shadow Fleet</div>
                  <div className="text-xs text-gray-300">Upscale Zones</div>
                  <div className="text-sm font-semibold text-gray-200">Premium Service</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Revolutionary Features
            </span>
          </h3>
          <p className="text-xl text-gray-300">Why YaadFlex is changing the game</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: DollarSign,
              title: "85% Driver Earnings",
              description: "Stop hustling for crumbs! Keep 85% of every fare - the highest in Jamaica!",
              gradient: "from-green-400 to-emerald-500"
            },
            {
              icon: Calculator,
              title: "Real JMD Pricing",
              description: "No hidden fees. Base fare + J$70/km + J$15/min. Simple and transparent.",
              gradient: "from-blue-400 to-cyan-500"
            },
            {
              icon: Shield,
              title: "No Cherry-Picking",
              description: "Fair job distribution. System assigns automatically - everyone gets opportunities.",
              gradient: "from-purple-400 to-pink-500"
            },
            {
              icon: Users,
              title: "Lifestyle Add-ons",
              description: "Party runs, extra stops, smoke breaks - your ride, your way!",
              gradient: "from-yellow-400 to-orange-500"
            },
            {
              icon: Zap,
              title: "100% Contactless",
              description: "Automated payments, real estate, car marketplace, CB radio - all in one app.",
              gradient: "from-red-400 to-pink-500"
            },
            {
              icon: Star,
              title: "Teen-Friendly",
              description: "Challenges, rewards, squad building. Level up your vybz with every ride!",
              gradient: "from-indigo-400 to-purple-500"
            }
          ].map((feature, i) => (
            <Card key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-yellow-500/30 transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-white">{feature.title}</h4>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-3xl p-8 border border-yellow-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "85%", label: "Driver Earnings", color: "text-green-400" },
              { number: "J$1,040", label: "Avg. Trip Cost", color: "text-yellow-400" },
              { number: "2", label: "Fleet Types", color: "text-blue-400" },
              { number: "100%", label: "Contactless", color: "text-purple-400" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className={`text-4xl font-bold ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl p-12 border border-yellow-500/30">
          <h3 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Ready For The Revolution?
            </span>
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join YaadFlex Global Vybz today and start earning real money. No more getting crushed by other apps!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-xl" asChild>
              <Link href="/driver-registration" data-testid="button-join-drivers">
                Start Driving Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black" asChild>
              <Link href="/pricing" data-testid="button-calculate-earnings">
                Calculate Your Earnings
              </Link>
            </Button>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            Professional inquiries: <a href="mailto:dChris@yaadflexglobalvybz.com" className="text-yellow-400 hover:underline">dChris@yaadflexglobalvybz.com</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-gray-800">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="text-gray-400">
            © 2025 YaadFlex Global Vybz - Level Up Your Ride!
          </div>
          <div className="flex gap-4">
            {[
              { name: "Instagram", emoji: "📷", url: "https://instagram.com/yaadflex" },
              { name: "TikTok", emoji: "🎵", url: "https://tiktok.com/@yaadflex" },
              { name: "Facebook", emoji: "📘", url: "https://facebook.com/yaadflex" },
              { name: "Telegram", emoji: "✈️", url: "https://t.me/yaadflex" }
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                data-testid={`link-${social.name.toLowerCase()}`}
              >
                <span className="mr-1">{social.emoji}</span>
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}