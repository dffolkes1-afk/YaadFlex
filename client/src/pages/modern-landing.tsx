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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      
      {/* Gothic Kryptonian Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-gray-900/90 to-black/95"></div>
        {/* Sharp angular patterns */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-gray-700/5 to-transparent transform rotate-12"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-gray-600/5 to-transparent transform -rotate-12"></div>
        {/* Subtle dark glow */}
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-gradient-radial from-gray-700/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 bg-black/90 backdrop-blur-lg border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center shadow-lg border border-gray-600/30">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                YaadFlex Global Vybz
              </h1>
              <p className="text-xs text-gray-400">Dark • Sharp • Gothic</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white transition-all" asChild>
              <a href="https://t.me/yaadflex" target="_blank" rel="noopener" data-testid="link-telegram">
                Join Network
              </a>
            </Button>
            <Button className="bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:shadow-xl hover:shadow-gray-700/25 transition-all" asChild>
              <Link href="/links" data-testid="button-enter-app">
                Enter Platform
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
            <div className="inline-flex items-center gap-2 bg-gray-900/40 px-4 py-2 rounded-lg border border-gray-600/30 backdrop-blur-sm">
              <Globe className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-300 font-medium">Caribbean-Born • Global Reach</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-white">
                  Dark
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
                  Gothic Platform
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                The Caribbean super-app with that <strong className="text-gray-300">dark gothic finish!</strong> 
                Sharp edges, menacing design. <strong className="text-gray-200">Drivers keep 85%</strong> - dark, sharp, powerful.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button size="lg" className="bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:shadow-xl hover:shadow-gray-700/25 border border-gray-600/30" asChild>
                <Link href="/pricing" data-testid="button-see-pricing">
                  <Calculator className="h-5 w-5 mr-2" />
                  View Pricing
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white backdrop-blur-sm" asChild>
                <Link href="/driver-registration" data-testid="button-start-driving">
                  <Car className="h-5 w-5 mr-2" />
                  Driver Access
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-500 text-gray-300 hover:bg-gray-500 hover:text-white backdrop-blur-sm" asChild>
                <Link href="/book-ride" data-testid="button-book-ride">
                  <MapPin className="h-5 w-5 mr-2" />
                  Book Ride
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white backdrop-blur-sm" asChild>
                <Link href="/universal-remote" data-testid="button-remote-control">
                  <Monitor className="h-5 w-5 mr-2" />
                  IoT Control
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-500 text-gray-300 hover:bg-gray-500 hover:text-white backdrop-blur-sm" asChild>
                <Link href="/travel-booking" data-testid="button-travel-booking">
                  <Plane className="h-5 w-5 mr-2" />
                  Travel
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white backdrop-blur-sm" asChild>
                <Link href="/trading-dashboard" data-testid="button-trading">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Trading
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Business: dChris@yaadflexglobalvybz.com</span>
              </div>
            </div>
          </div>

          {/* Right Column - Live Jamaica Map */}
          <div className="relative">
            <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-gray-300" />
                Live Jamaica Map
              </h3>
              
              {/* Map Container */}
              <div className="relative h-80 bg-gradient-to-br from-gray-900/40 to-black/80 rounded-xl border border-gray-600/30 overflow-hidden">
                {/* Map Grid Overlay */}
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full bg-gradient-to-br from-gray-600/10 to-transparent" style={{
                    backgroundImage: `linear-gradient(rgba(107, 114, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(107, 114, 128, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
                
                {/* Jamaica Outline */}
                <div className="absolute inset-4 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Jamaica Island Shape */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-16 bg-gradient-to-r from-gray-700/40 to-gray-600/30 rounded-full border border-gray-500/50 shadow-lg">
                      {/* Live Driver Dots */}
                      <div className="absolute top-2 left-8 w-2 h-2 bg-gray-400 rounded-full animate-pulse shadow-lg"></div>
                      <div className="absolute top-6 left-20 w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-300 shadow-lg"></div>
                      <div className="absolute top-3 left-32 w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-700 shadow-lg"></div>
                      <div className="absolute top-8 left-40 w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-1000 shadow-lg"></div>
                      
                      {/* Location Labels */}
                      <div className="absolute -top-6 left-4 text-xs text-gray-300 font-medium">Kingston</div>
                      <div className="absolute -top-6 left-36 text-xs text-gray-300 font-medium">Montego Bay</div>
                    </div>
                  </div>
                </div>
                
                {/* Live Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs">
                  <div className="bg-black/70 px-3 py-2 rounded-lg border border-gray-600/30">
                    <div className="text-gray-300 font-medium">Active Drivers</div>
                    <div className="text-white text-lg font-bold">247</div>
                  </div>
                  <div className="bg-black/70 px-3 py-2 rounded-lg border border-gray-600/30">
                    <div className="text-gray-300 font-medium">Live Trips</div>
                    <div className="text-white text-lg font-bold">89</div>
                  </div>
                  <div className="bg-black/70 px-3 py-2 rounded-lg border border-gray-600/30">
                    <div className="text-gray-300 font-medium">Avg. Fare</div>
                    <div className="text-white text-lg font-bold">J$1,040</div>
                  </div>
                </div>
              </div>
              
              {/* Map Features */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-900/30 p-3 rounded-lg border border-gray-600/20">
                  <div className="text-gray-300 text-sm font-medium">Municipal Fleet</div>
                  <div className="text-white text-xs">Red Plates • 85% Earnings</div>
                </div>
                <div className="bg-gray-900/30 p-3 rounded-lg border border-gray-600/20">
                  <div className="text-gray-300 text-sm font-medium">Premium Fleet</div>
                  <div className="text-white text-xs">White Plates • Executive</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Live Pricing Display */}
          <div className="space-y-6">
            {/* Real-Time Pricing Card */}
            <div className="bg-black/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30 shadow-xl">
              <h4 className="flex items-center gap-2 text-gray-300 text-xl font-bold mb-4">
                <DollarSign className="h-5 w-5" />
                Real JMD Pricing
              </h4>
              <div className="space-y-4">
                <div className={`p-6 rounded-xl bg-gradient-to-r ${pricingExamples[currentExample].color} text-white shadow-lg`}>
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
                        i === currentExample ? 'bg-gray-400' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Fleet Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/60 backdrop-blur-lg rounded-xl p-4 border border-gray-700/30 text-center shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg mx-auto mb-2 shadow-md"></div>
                <div className="font-bold text-white">Municipal Fleet</div>
                <div className="text-xs text-gray-300">Standard Areas</div>
                <div className="text-sm font-semibold text-gray-300">85% Earnings</div>
              </div>
              <div className="bg-black/60 backdrop-blur-lg rounded-xl p-4 border border-gray-700/30 text-center shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg mx-auto mb-2 shadow-md"></div>
                <div className="font-bold text-white">Premium Fleet</div>
                <div className="text-xs text-gray-300">Executive Zones</div>
                <div className="text-sm font-semibold text-gray-300">Premium Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
              Gothic Features
            </span>
          </h3>
          <p className="text-xl text-gray-400">Dark, sharp, menacing power</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: DollarSign,
              title: "85% Driver Earnings",
              description: "Dark money! Drivers keep 85% - no games, no tricks. Pure power.",
              gradient: "from-gray-600 to-gray-700"
            },
            {
              icon: Calculator,
              title: "Sharp Pricing",
              description: "Base fare + J$70/km + J$15/min. Sharp, dark pricing - no nonsense.",
              gradient: "from-gray-700 to-gray-800"
            },
            {
              icon: Shield,
              title: "Dark Distribution",
              description: "System assigns jobs automatically. No cherry-picking - everyone serves.",
              gradient: "from-gray-500 to-gray-600"
            },
            {
              icon: Users,
              title: "Gothic Services",
              description: "Executive rides, shadow runs, dark transfers - menacing service.",
              gradient: "from-gray-600 to-gray-800"
            },
            {
              icon: Zap,
              title: "100% Shadow",
              description: "Dark payments, shadow estate, void control - everything dark.",
              gradient: "from-gray-700 to-gray-900"
            },
            {
              icon: Star,
              title: "Dark Platform",
              description: "Shadow radio, void viewing, dark booking - we're different.",
              gradient: "from-gray-500 to-gray-700"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-black/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all hover:scale-105 shadow-xl">
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">{feature.title}</h4>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="bg-black/60 backdrop-blur-lg rounded-xl p-8 border border-gray-700/30 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "85%", label: "Driver Earnings", color: "text-gray-300" },
              { number: "J$1,040", label: "Avg. Trip Cost", color: "text-gray-400" },
              { number: "Live", label: "Real-Time Map", color: "text-gray-300" },
              { number: "Dark", label: "Gothic Design", color: "text-gray-400" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className={`text-4xl font-bold ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-br from-gray-900/40 to-black/80 backdrop-blur-lg rounded-xl p-12 border border-gray-700/30 shadow-2xl">
          <h3 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
              Ready for Dark Power?
            </span>
          </h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Step into the dark world of YaadFlex - gothic, sharp, menacing. That's how we dominate.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:shadow-xl hover:shadow-gray-700/25 border border-gray-600/30" asChild>
              <Link href="/driver-registration" data-testid="button-join-drivers">
                Join the Dark Side
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white backdrop-blur-sm" asChild>
              <Link href="/pricing" data-testid="button-calculate-earnings">
                Check Pricing
              </Link>
            </Button>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            Business: <a href="mailto:dChris@yaadflexglobalvybz.com" className="text-gray-300 hover:text-gray-200 hover:underline">dChris@yaadflexglobalvybz.com</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-gray-700/30">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="text-gray-500">
            © 2025 YaadFlex Global Vybz - Dark • Sharp • Gothic
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
                className="text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium"
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