import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Car, MapPin, DollarSign, Users, Star, Calculator, Phone, ArrowRight, Zap, Shield, Globe, Monitor, Plane } from 'lucide-react';
import { InteractiveMap } from '@/components/InteractiveMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InsuranceBadge } from '@/components/InsuranceBadge';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      
      {/* Clean Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-black/95"></div>
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
              <p className="text-xs text-gray-400">Premium • Quality • Caribbean</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Social Media Links */}
            <div className="flex items-center gap-2">
              <a href="https://instagram.com/yaadflex" target="_blank" rel="noopener" className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-all" data-testid="link-instagram">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://facebook.com/yaadflex" target="_blank" rel="noopener" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-all" data-testid="link-facebook">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://tiktok.com/@yaadflex" target="_blank" rel="noopener" className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center hover:scale-110 transition-all" data-testid="link-tiktok">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a href="https://x.com/yaadflex" target="_blank" rel="noopener" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 transition-all" data-testid="link-twitter">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@yaadflex" target="_blank" rel="noopener" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:scale-110 transition-all" data-testid="link-youtube">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
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

      {/* Hero Section - Full Space Utilization */}
      <div className="relative z-10 max-w-full mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            
            {/* Left Column - Hero Text */}
            <div className="lg:col-span-2 space-y-8">
            <div className="inline-flex items-center gap-2 bg-gray-900/40 px-4 py-2 rounded-lg border border-gray-600/30 backdrop-blur-sm">
              <Globe className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-300 font-medium">Caribbean-Born • Global Reach</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
                  YaadFlex
                </span>
                <br />
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Super-App
                </span>
              </h1>

              <p className="text-2xl text-gray-300 leading-relaxed">
                <span className="text-white font-semibold">The Caribbean super-app</span> built for the world.<br/>
                Rides • Delivery • Social • Investment<br/>
                <strong className="text-green-400 text-3xl">Drivers earn 85%</strong> of every trip!
              </p>
              
              <div className="flex items-center gap-4 text-xl">
                <span className="text-2xl">🇯🇲</span>
                <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent font-semibold">
                  Born in Jamaica • Made for Everyone
                </span>
              </div>
            </div>

            {/* CHOOSE YOUR JOURNEY - Modern Clean Design */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-white/10 to-gray-900/30 rounded-2xl p-8 border border-gray-600/30 backdrop-blur-lg shadow-2xl">
                <h3 className="text-3xl font-bold text-center mb-8">
                  <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    🌟 Join the YaadFlex Experience
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* PASSENGER SIDE */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-xl p-6 border border-blue-400/50 hover:border-blue-300/70 transition-all group hover:scale-105 backdrop-blur-sm">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <MapPin className="h-10 w-10 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-blue-300">🚖 Need a Ride?</h4>
                      <p className="text-blue-200 text-sm">Premium rides across Jamaica<br/>From Kingston to anywhere</p>
                      <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 shadow-lg" asChild>
                        <Link href="/book-ride" data-testid="button-passenger">
                          Book Ride
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* DRIVER SIDE */}
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/30 rounded-xl p-6 border border-green-400/50 hover:border-green-300/70 transition-all group hover:scale-105 backdrop-blur-sm">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Car className="h-10 w-10 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-green-300">🚗 Drive & Earn</h4>
                      <p className="text-green-200 text-sm">Keep 85% of every fare<br/>Join Caribbean's fairest platform</p>
                      <Button size="lg" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-lg" asChild>
                        <Link href="/driver-registration" data-testid="button-driver">
                          Start Earning
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* SOCIAL SIDE - NEW! */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/30 rounded-xl p-6 border border-purple-400/50 hover:border-purple-300/70 transition-all group hover:scale-105 backdrop-blur-sm">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-purple-300">🌟 Social Vybz</h4>
                      <p className="text-purple-200 text-sm">Connect, share, discover<br/>More than just rides</p>
                      <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 shadow-lg" asChild>
                        <Link href="/social" data-testid="button-social">
                          Explore Social
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SIMPLE QUICK ACCESS */}
              <div className="flex gap-4">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600" asChild>
                  <Link href="/pricing" data-testid="button-pricing">
                    View Pricing
                  </Link>
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600" asChild>
                  <Link href="/contact" data-testid="button-contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Business: dChris@yaadflexglobalvybz.com</span>
              </div>
            </div>
          </div>

          {/* Right Column - LIVE MAP SYSTEM - Full Width Utilization */}
          <div className="lg:col-span-3 relative">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-blue-400/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                  <h3 className="text-2xl font-bold text-white">Live Driver Map</h3>
                  <div className="text-xs bg-green-500/20 px-3 py-1 rounded-full text-green-300 font-medium border border-green-500/30">
                    Professional Grade
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="text-xs bg-blue-500/20 px-3 py-1 rounded-full text-blue-300 border border-blue-500/30">Kingston</div>
                  <div className="text-xs bg-purple-500/20 px-3 py-1 rounded-full text-purple-300 border border-purple-500/30">Real-Time</div>
                </div>
              </div>
              
              {/* ENHANCED FULL-WIDTH MAP */}
              <InteractiveMap 
                className="h-[600px] w-full rounded-2xl"
                showDrivers={true}
                zoom={12}
                center={{ lat: 18.0179, lng: -76.8099 }}
              />
              
              {/* BOTTOM STATS - Better Space Usage */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/20 p-4 rounded-xl border border-green-500/30 text-center">
                  <div className="text-2xl font-bold text-green-400">47</div>
                  <div className="text-sm text-green-300">Live Drivers</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/20 p-4 rounded-xl border border-blue-500/30 text-center">
                  <div className="text-2xl font-bold text-blue-400">12</div>
                  <div className="text-sm text-blue-300">Active Routes</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/20 p-4 rounded-xl border border-purple-500/30 text-center">
                  <div className="text-2xl font-bold text-purple-400">5.0</div>
                  <div className="text-sm text-purple-300">Avg Rating</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/20 p-4 rounded-xl border border-orange-500/30 text-center">
                  <div className="text-2xl font-bold text-orange-400">2min</div>
                  <div className="text-sm text-orange-300">Avg Pickup</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Why Choose YaadFlex
            </span>
          </h3>
          <p className="text-xl text-gray-300">Professional service with Caribbean heart</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: DollarSign,
              title: "85% Driver Earnings",
              description: "Fair earnings! Drivers keep 85% of every fare - transparent and honest.",
              gradient: "from-green-500 to-emerald-600"
            },
            {
              icon: Calculator,
              title: "Transparent Pricing",
              description: "Clear pricing: Base fare + J$70/km + J$15/min. Simple and fair.",
              gradient: "from-blue-500 to-blue-600"
            },
            {
              icon: Shield,
              title: "Fair Distribution",
              description: "Smart job assignment ensures fair opportunities for all drivers.",
              gradient: "from-purple-500 to-purple-600"
            },
            {
              icon: Users,
              title: "Premium Services",
              description: "Executive rides, delivery services, and social connections - complete ecosystem.",
              gradient: "from-orange-500 to-red-500"
            },
            {
              icon: Zap,
              title: "Complete Platform",
              description: "Rides, payments, social features, and investment opportunities all in one.",
              gradient: "from-cyan-500 to-teal-600"
            },
            {
              icon: Star,
              title: "Caribbean Innovation",
              description: "CB Radio, community features, and local culture built for global reach.",
              gradient: "from-yellow-500 to-orange-500"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all hover:scale-105 shadow-xl">
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
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-gray-600/30 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "85%", label: "Driver Earnings", color: "text-green-400" },
              { number: "J$1,040", label: "Avg. Trip Cost", color: "text-blue-400" },
              { number: "Live", label: "Real-Time Map", color: "text-purple-400" },
              { number: "Pro", label: "Quality Service", color: "text-orange-400" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className={`text-4xl font-bold ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INVESTMENT PLATFORM SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl mx-4 border border-green-500/40 mb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-900/40 px-6 py-3 rounded-lg border border-green-500/40 backdrop-blur-sm mb-6">
            <span className="text-2xl">💰</span>
            <span className="text-lg text-green-300 font-bold">YAADFLEX INVESTMENT PLATFORM</span>
          </div>
          <h3 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-yellow-300 bg-clip-text text-transparent">
              💎 INVEST IN YAADFLEX 💎
            </span>
          </h3>
          <p className="text-2xl text-green-200 mb-4 font-bold">BE AN OWNER! MAKE MONEY WITH THE CARIBBEAN SUPER-APP!</p>
          <p className="text-xl text-gray-300 mb-8">🚀 Future IPO • Stock Market Ready • Caribbean Empire 🌍</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* STARTER INVESTMENT */}
          <div className="bg-gradient-to-br from-blue-600/30 to-blue-700/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-blue-500/50 hover:border-blue-400/80 transition-all group text-center transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <span className="text-3xl">🌱</span>
            </div>
            <h4 className="text-2xl font-bold text-blue-300 mb-4">STARTER SHARES</h4>
            <div className="text-4xl font-bold text-blue-200 mb-2">J$50,000</div>
            <p className="text-lg text-blue-200 font-semibold mb-4">Minimum Investment</p>
            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-blue-200">0.1% Company Ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-blue-200">Quarterly Dividends</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-blue-200">Priority Ride Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-blue-200">10% Projected Annual ROI</span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all">
              INVEST NOW
            </button>
          </div>

          {/* PREMIUM INVESTMENT */}
          <div className="bg-gradient-to-br from-yellow-600/30 to-yellow-700/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-yellow-500/50 hover:border-yellow-400/80 transition-all group text-center transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-black px-4 py-1 rounded-full text-sm font-bold">
              ⭐ MOST POPULAR
            </div>
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <span className="text-3xl">👑</span>
            </div>
            <h4 className="text-2xl font-bold text-yellow-300 mb-4">PREMIUM SHARES</h4>
            <div className="text-4xl font-bold text-yellow-200 mb-2">J$500,000</div>
            <p className="text-lg text-yellow-200 font-semibold mb-4">Premium Investment</p>
            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-yellow-200">1% Company Ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-yellow-200">Monthly Dividends</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-yellow-200">VIP Customer Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-yellow-200">15% Projected Annual ROI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-yellow-200">Voting Rights</span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black py-3 rounded-lg font-bold hover:shadow-lg transition-all">
              INVEST NOW
            </button>
          </div>

          {/* ELITE INVESTMENT */}
          <div className="bg-gradient-to-br from-purple-600/30 to-purple-700/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500/50 hover:border-purple-400/80 transition-all group text-center transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <span className="text-3xl">💎</span>
            </div>
            <h4 className="text-2xl font-bold text-purple-300 mb-4">ELITE SHARES</h4>
            <div className="text-4xl font-bold text-purple-200 mb-2">J$2M+</div>
            <p className="text-lg text-purple-200 font-semibold mb-4">Elite Investment</p>
            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-purple-200">5%+ Company Ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-purple-200">Weekly Dividends</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-purple-200">Board Member Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-purple-200">25% Projected Annual ROI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-purple-200">IPO Priority Access</span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all">
              INVEST NOW
            </button>
          </div>
        </div>

        {/* INVESTMENT BENEFITS */}
        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-2xl p-8 border border-green-500/40 text-center">
          <h4 className="text-3xl font-bold text-green-300 mb-6">🌟 WHY INVEST IN YAADFLEX? 🌟</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-900/30 rounded-lg p-6 border border-green-500/30">
              <div className="text-4xl mb-4">📈</div>
              <h5 className="text-xl font-bold text-green-300 mb-2">Stock Market Ready</h5>
              <p className="text-green-200">Preparing for IPO within 2-3 years. Early investors get massive returns!</p>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-6 border border-blue-500/30">
              <div className="text-4xl mb-4">🌍</div>
              <h5 className="text-xl font-bold text-blue-300 mb-2">Caribbean Empire</h5>
              <p className="text-blue-200">Expanding across Jamaica, Nigeria, Kenya and entire Caribbean region!</p>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-6 border border-yellow-500/30">
              <div className="text-4xl mb-4">💰</div>
              <h5 className="text-xl font-bold text-yellow-300 mb-2">Multiple Revenue</h5>
              <p className="text-yellow-200">Rides, wallet, marketplace, delivery - 4 income streams growing fast!</p>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-500/30">
              <div className="text-4xl mb-4">🚀</div>
              <h5 className="text-xl font-bold text-purple-300 mb-2">First Mover</h5>
              <p className="text-purple-200">First Caribbean super-app! No competition = massive market domination!</p>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-2xl font-bold text-green-300 mb-4">📊 PROJECTED COMPANY VALUE: J$50 BILLION BY 2027! 📊</p>
            <p className="text-lg text-gray-300">Early investors could see 10x-50x returns when we go public!</p>
          </div>
        </div>
      </div>

      {/* PROMINENT SOCIAL MEDIA SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl mx-4 border border-purple-500/40">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-900/40 px-6 py-3 rounded-lg border border-purple-500/40 backdrop-blur-sm mb-6">
            <span className="text-2xl">📱</span>
            <span className="text-lg text-purple-300 font-bold">FIND US ON SOCIAL MEDIA</span>
          </div>
          <h3 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              🌟 FOLLOW YAADFLEX 🌟
            </span>
          </h3>
          <p className="text-2xl text-purple-200 mb-4 font-bold">GET THE LATEST UPDATES & CARIBBEAN VIBES!</p>
          <p className="text-xl text-gray-300">👆 Click any platform below to follow us! 👆</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <a href="https://instagram.com/yaadflex" target="_blank" rel="noopener" 
             className="bg-gradient-to-br from-pink-600/30 to-purple-600/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-pink-500/50 hover:border-pink-400/80 transition-all group text-center transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25" 
             data-testid="social-instagram">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-pink-300 mb-2">📸 Instagram</h4>
            <p className="text-lg text-pink-200 font-semibold">@yaadflex</p>
            <p className="text-sm text-gray-300 mt-2">Photos & Stories</p>
            <div className="mt-4 px-4 py-2 bg-pink-600/20 rounded-lg border border-pink-500/30">
              <p className="text-sm text-pink-300 font-bold">👆 TAP TO FOLLOW 👆</p>
            </div>
          </a>

          <a href="https://tiktok.com/@yaadflex" target="_blank" rel="noopener" 
             className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-lg rounded-2xl p-8 border-2 border-gray-600/50 hover:border-white/80 transition-all group text-center transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25" 
             data-testid="social-tiktok">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">🎥 TikTok</h4>
            <p className="text-lg text-gray-200 font-semibold">@yaadflex</p>
            <p className="text-sm text-gray-300 mt-2">Caribbean Vibes</p>
            <div className="mt-4 px-4 py-2 bg-gray-800/30 rounded-lg border border-gray-600/30">
              <p className="text-sm text-white font-bold">👆 TAP TO FOLLOW 👆</p>
            </div>
          </a>

          <a href="https://facebook.com/yaadflex" target="_blank" rel="noopener" 
             className="bg-gradient-to-br from-blue-600/30 to-blue-700/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-blue-500/50 hover:border-blue-400/80 transition-all group text-center transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25" 
             data-testid="social-facebook">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-blue-300 mb-2">👥 Facebook</h4>
            <p className="text-lg text-blue-200 font-semibold">YaadFlex</p>
            <p className="text-sm text-gray-300 mt-2">Community & Updates</p>
            <div className="mt-4 px-4 py-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <p className="text-sm text-blue-300 font-bold">👆 TAP TO FOLLOW 👆</p>
            </div>
          </a>

          <a href="https://x.com/yaadflex" target="_blank" rel="noopener" 
             className="bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-lg rounded-2xl p-8 border-2 border-gray-600/50 hover:border-gray-400/80 transition-all group text-center transform hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/25" 
             data-testid="social-twitter">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">🐦 X/Twitter</h4>
            <p className="text-lg text-gray-200 font-semibold">@yaadflex</p>
            <p className="text-sm text-gray-300 mt-2">Quick Updates</p>
            <div className="mt-4 px-4 py-2 bg-gray-800/30 rounded-lg border border-gray-600/30">
              <p className="text-sm text-white font-bold">👆 TAP TO FOLLOW 👆</p>
            </div>
          </a>

          <a href="https://youtube.com/@yaadflex" target="_blank" rel="noopener" 
             className="bg-gradient-to-br from-red-600/30 to-red-700/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-red-500/50 hover:border-red-400/80 transition-all group text-center transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25" 
             data-testid="social-youtube">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-red-300 mb-2">🎥 YouTube</h4>
            <p className="text-lg text-red-200 font-semibold">@yaadflex</p>
            <p className="text-sm text-gray-300 mt-2">Videos & Tutorials</p>
            <div className="mt-4 px-4 py-2 bg-red-600/20 rounded-lg border border-red-500/30">
              <p className="text-sm text-red-300 font-bold">👆 TAP TO FOLLOW 👆</p>
            </div>
          </a>

          <a href="https://t.me/yaadflex" target="_blank" rel="noopener" 
             className="bg-gradient-to-br from-blue-500/30 to-blue-600/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-blue-400/50 hover:border-blue-300/80 transition-all group text-center transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25" 
             data-testid="social-telegram">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.820 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-blue-300 mb-2">💬 Telegram</h4>
            <p className="text-lg text-blue-200 font-semibold">@yaadflex</p>
            <p className="text-sm text-gray-300 mt-2">Join Our Chat</p>
            <div className="mt-4 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <p className="text-sm text-blue-300 font-bold">👆 TAP TO JOIN 👆</p>
            </div>
          </a>
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-8 border border-purple-500/40">
            <h4 className="text-3xl font-bold text-purple-300 mb-4">🚀 DON'T MISS OUT! 🚀</h4>
            <p className="text-xl text-purple-200 font-bold mb-4">Follow YaadFlex on ALL platforms for:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <p className="text-lg font-bold text-purple-300">🇯🇲 Caribbean Culture</p>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                <p className="text-lg font-bold text-blue-300">📱 App Updates</p>
              </div>
              <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                <p className="text-lg font-bold text-green-300">🚗 Driver Stories</p>
              </div>
              <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/30">
                <p className="text-lg font-bold text-orange-300">🌍 Community Vibes</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-6">👆 TAP ANY SOCIAL MEDIA ABOVE! 👆</p>
            <p className="text-lg text-gray-300 mt-2">Connect with thousands of YaadFlex users across the Caribbean!</p>
          </div>
        </div>
      </div>

      {/* Insurance Trust Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
              Secured & Protected
            </span>
          </h3>
          <p className="text-lg text-gray-400">Your safety is our top priority</p>
        </div>
        <div className="flex justify-center">
          <InsuranceBadge className="max-w-sm bg-black/70 border-green-500/70" variant="full" />
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-br from-gray-900/40 to-black/80 backdrop-blur-lg rounded-xl p-12 border border-gray-700/30 shadow-2xl">
          <h3 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
              Ready to Get Started?
            </span>
          </h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the premium Caribbean super-app - quality service, fair prices, community first.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:shadow-xl hover:shadow-gray-700/25 border border-gray-600/30" asChild>
              <Link href="/driver-registration" data-testid="button-join-drivers">
                Join Our Network
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
            © 2025 YaadFlex Global Vybz - Premium • Quality • Caribbean
          </div>
          <div className="flex gap-6">
            {[
              { name: "Instagram", url: "https://instagram.com/yaadflex" },
              { name: "TikTok", url: "https://tiktok.com/@yaadflex" },
              { name: "Facebook", url: "https://facebook.com/yaadflex" },
              { name: "Twitter/X", url: "https://x.com/yaadflex" },
              { name: "YouTube", url: "https://youtube.com/@yaadflex" },
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