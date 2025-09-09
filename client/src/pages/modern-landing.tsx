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
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* Left Column - Hero Text */}
          <div className="lg:col-span-2 space-y-8">
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

              {/* WE'RE DIFFERENT MESSAGING */}
              <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/40 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-blue-300 mb-1">🚀 WE'RE DIFFERENT FROM THE REST</h3>
                <p className="text-blue-100 font-semibold">We're here to make a REAL difference in Jamaica!</p>
              </div>

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

          {/* Right Column - MASSIVE RADAR TRACKING SYSTEM */}
          <div className="lg:col-span-3 relative">
            <div className="bg-black/95 backdrop-blur-lg rounded-3xl p-8 border-2 border-red-900/60 shadow-2xl shadow-red-900/20">
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full animate-ping shadow-lg shadow-blue-500/50"></div>
                <span>YAADTRACK PRO RADAR</span>
                <div className="text-sm bg-green-900/80 px-3 py-2 rounded-lg text-green-200 font-bold border border-green-700/50">● BROADCAST QUALITY</div>
                <div className="text-xs bg-red-900/80 px-2 py-1 rounded text-red-200 border border-red-700/50">PROFESSIONAL</div>
              </h3>
              
              {/* PROFESSIONAL STATS BAR */}
              <div className="mb-4 grid grid-cols-4 gap-2 text-xs">
                <div className="bg-green-900/60 px-2 py-1 rounded text-center border border-green-700/40">
                  <div className="text-green-300 font-bold">UPDATE RATE</div>
                  <div className="text-green-100">30Hz LIVE</div>
                </div>
                <div className="bg-blue-900/60 px-2 py-1 rounded text-center border border-blue-700/40">
                  <div className="text-blue-300 font-bold">PRECISION</div>
                  <div className="text-blue-100">±2m GPS</div>
                </div>
                <div className="bg-purple-900/60 px-2 py-1 rounded text-center border border-purple-700/40">
                  <div className="text-purple-300 font-bold">LATENCY</div>
                  <div className="text-purple-100">0.8s DELAY</div>
                </div>
                <div className="bg-orange-900/60 px-2 py-1 rounded text-center border border-orange-700/40">
                  <div className="text-orange-300 font-bold">COVERAGE</div>
                  <div className="text-orange-100">ISLAND-WIDE</div>
                </div>
              </div>
              
              {/* PROFESSIONAL SPORTS RADAR CONTAINER */}
              <div className="relative h-[500px] bg-gradient-to-br from-slate-900 via-black to-slate-900 rounded-2xl border-2 border-blue-500/60 overflow-hidden shadow-inner shadow-blue-900/30">
                
                {/* MASSIVE RADAR GRID SYSTEM */}
                <div className="absolute inset-0">
                  {/* Concentric circles like radar - BIGGER */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 border border-blue-600/70 rounded-full absolute shadow-lg shadow-blue-600/40"></div>
                    <div className="w-60 h-60 border border-blue-500/60 rounded-full absolute shadow-lg shadow-blue-500/30"></div>
                    <div className="w-80 h-80 border border-blue-400/50 rounded-full absolute shadow-lg shadow-blue-400/25"></div>
                    <div className="w-96 h-96 border border-blue-300/40 rounded-full absolute shadow-lg shadow-blue-300/20"></div>
                    <div className="w-[450px] h-[450px] border border-blue-200/50 rounded-full absolute shadow-lg shadow-blue-200/25"></div>
                    {/* MASSIVE WORLDWIDE CARIBBEAN RADAR CIRCLE */}
                    <div className="w-[500px] h-[500px] border-2 border-cyan-400/60 rounded-full absolute shadow-lg shadow-cyan-400/40 animate-pulse"></div>
                  </div>
                  
                  {/* PROFESSIONAL GRID SYSTEM */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-blue-400/80 shadow-lg shadow-blue-400/60"></div>
                  <div className="absolute left-0 top-1/2 w-full h-0.5 bg-blue-400/80 shadow-lg shadow-blue-400/60"></div>
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent via-blue-400/25 to-transparent transform rotate-45 origin-center"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-transparent via-blue-400/25 to-transparent transform -rotate-45 origin-center"></div>
                  
                  {/* DISTANCE MARKERS */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-blue-300 bg-black/70 px-2 py-1 rounded border border-blue-500/50">50km</div>
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs text-blue-300 bg-black/70 px-2 py-1 rounded border border-blue-500/50">25km</div>
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xs text-blue-300 bg-black/70 px-2 py-1 rounded border border-blue-500/50">10km</div>
                  {/* WORLDWIDE CARIBBEAN RANGE MARKER */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-cyan-300 bg-black/80 px-3 py-1 rounded-lg border border-cyan-400/70 font-bold animate-pulse">CARIBBEAN ZONE • 500km</div>
                </div>

                {/* MASSIVE RADAR SWEEP ANIMATION */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[450px] h-[450px] rounded-full relative">
                    <div className="absolute inset-0 bg-gradient-conic from-transparent via-blue-400/50 to-transparent animate-spin shadow-lg shadow-blue-400/40" style={{
                      background: 'conic-gradient(from 0deg, transparent 0deg, rgba(59, 130, 246, 0.6) 45deg, transparent 90deg)',
                      animationDuration: '3s'
                    }}></div>
                  </div>
                </div>

                {/* MASSIVE JAMAICA ISLAND OUTLINE */}
                <div className="absolute inset-12 flex items-center justify-center">
                  <div className="relative w-full h-full max-w-80">
                    {/* BIGGER Jamaica Island Shape */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-28 bg-gradient-to-r from-slate-800/80 via-blue-900/40 to-slate-800/80 rounded-full border-2 border-blue-400/80 shadow-2xl shadow-blue-600/60">
                      
                      {/* BIGGER LIVE MOVING DRIVERS - More visible */}
                      
                      {/* Kingston Area - PROFESSIONAL TRACKING */}
                      <div className="absolute top-4 left-16 w-5 h-5 bg-green-400 rounded-full shadow-lg shadow-green-500/60 animate-pulse border-2 border-green-200/50">
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-green-200 bg-black/90 px-2 py-1 rounded-lg border border-green-500/50 font-bold">KINGSTON • 47 ACTIVE</div>
                      </div>
                      
                      <div className="absolute top-10 left-20 w-5 h-5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 border-2 border-yellow-200/50" style={{
                        animation: 'bounce 2s infinite'
                      }}>
                        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-yellow-200 bg-black/90 px-2 py-1 rounded-lg border border-yellow-500/50 font-bold">HEAVY TRAFFIC</div>
                      </div>

                      {/* REAL-TIME MOVING CARS - FIFA STYLE TRACKING */}
                      
                      {/* Car 1 - Moving horizontally like FIFA player tracking */}
                      <div className="absolute top-8 left-4" style={{
                        animation: 'carMove1 6s linear infinite',
                        animationDelay: '0s'
                      }}>
                        <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/80 border border-white">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-200 bg-black/90 px-1 rounded font-bold">87km/h</div>
                        </div>
                      </div>

                      {/* Car 2 - Moving diagonally like FIFA */}
                      <div className="absolute top-12 left-8" style={{
                        animation: 'carMove2 8s linear infinite',
                        animationDelay: '1s'
                      }}>
                        <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/80 border border-white">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-green-200 bg-black/90 px-1 rounded font-bold">45km/h</div>
                        </div>
                      </div>

                      {/* Car 3 - Moving vertically */}
                      <div className="absolute top-4 left-20" style={{
                        animation: 'carMove3 7s linear infinite',
                        animationDelay: '2s'
                      }}>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/80 border border-white">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-yellow-200 bg-black/90 px-1 rounded font-bold">65km/h</div>
                        </div>
                      </div>

                      {/* Car 4 - Moving in curve */}
                      <div className="absolute top-16 right-16" style={{
                        animation: 'carMove4 9s linear infinite',
                        animationDelay: '0.5s'
                      }}>
                        <div className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/80 border border-white">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-purple-200 bg-black/90 px-1 rounded font-bold">92km/h</div>
                        </div>
                      </div>

                      {/* Car 5 - Moving around corners */}
                      <div className="absolute top-20 left-12" style={{
                        animation: 'carMove5 5s linear infinite',
                        animationDelay: '3s'
                      }}>
                        <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/80 border border-white">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-cyan-200 bg-black/90 px-1 rounded font-bold">38km/h</div>
                        </div>
                      </div>

                      {/* Spanish Town Area - HELLSING */}
                      <div className="absolute top-16 left-32 w-4 h-4 bg-red-200 rounded-full shadow-lg shadow-red-300/40 animate-pulse delay-500">
                        <div className="absolute inset-0 bg-red-200 rounded-full animate-ping"></div>
                      </div>

                      {/* Montego Bay Area - PROFESSIONAL ALERT */}
                      <div className="absolute top-5 right-16 w-5 h-5 bg-red-500 rounded-full shadow-lg shadow-red-500/60 animate-pulse delay-700 border-2 border-red-200/50">
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-80"></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-red-200 bg-black/90 px-2 py-1 rounded-lg border border-red-500/50 font-bold">MONTEGO BAY • INCIDENT</div>
                      </div>

                      <div className="absolute top-13 right-20 w-4 h-4 bg-red-100 rounded-full shadow-lg shadow-red-200/50 animate-pulse delay-300">
                        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
                      </div>

                      {/* Negril Area - HELLSING */}
                      <div className="absolute top-9 right-10 w-4 h-4 bg-red-200 rounded-full shadow-lg shadow-red-300/40 animate-pulse delay-1000">
                        <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-70"></div>
                      </div>

                      {/* Central Jamaica Drivers - HELLSING */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-300 rounded-full shadow-lg shadow-red-400/40 animate-pulse delay-200">
                        <div className="absolute inset-0 bg-red-300 rounded-full animate-ping"></div>
                      </div>

                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 translate-x-6 w-4 h-4 bg-red-100 rounded-full shadow-lg shadow-red-200/50 animate-pulse delay-800">
                        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-90"></div>
                      </div>

                      {/* MORE DRIVERS ACROSS JAMAICA - HELLSING */}
                      <div className="absolute top-6 left-36 w-4 h-4 bg-red-200 rounded-full shadow-lg shadow-red-300/40 animate-pulse delay-400">
                        <div className="absolute inset-0 bg-red-200 rounded-full animate-ping"></div>
                      </div>

                      <div className="absolute top-12 right-28 w-4 h-4 bg-red-300 rounded-full shadow-lg shadow-red-400/40 animate-pulse delay-600">
                        <div className="absolute inset-0 bg-red-300 rounded-full animate-ping"></div>
                      </div>

                      <div className="absolute top-18 left-1/2 transform -translate-x-1/2 translate-x-12 w-4 h-4 bg-red-100 rounded-full shadow-lg shadow-red-200/50 animate-pulse delay-900">
                        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
                      </div>
                      
                      {/* CARIBBEAN ISLAND MARKERS - WORLDWIDE FIFA VIEW */}
                      <div className="absolute -top-16 left-8 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/60 animate-pulse">
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-cyan-300 bg-black/80 px-1 rounded font-bold">CUBA</div>
                      </div>

                      <div className="absolute top-32 left-2 w-3 h-3 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/50 animate-pulse delay-200">
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-cyan-200 bg-black/80 px-1 rounded font-bold">HAITI</div>
                      </div>

                      <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/50 animate-pulse delay-400">
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-cyan-200 bg-black/80 px-1 rounded font-bold">BAHAMAS</div>
                      </div>

                      <div className="absolute top-40 right-8 w-3 h-3 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/50 animate-pulse delay-600">
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-cyan-200 bg-black/80 px-1 rounded font-bold">BARBADOS</div>
                      </div>

                      {/* JAMAICA CENTER ISLAND MARKER - HQ */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/80 animate-pulse border-2 border-white">
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-green-200 bg-black/90 px-2 py-1 rounded-lg border border-green-400/70 font-bold">🇯🇲 JAMAICA HQ</div>
                      </div>

                      {/* HELLSING LOCATION LABELS */}
                      <div className="absolute -top-10 left-12 text-sm text-red-200 font-bold bg-black/90 px-3 py-2 rounded-lg border border-red-800/60 shadow-sm shadow-red-900/30">KINGSTON</div>
                      <div className="absolute -top-10 right-12 text-sm text-red-200 font-bold bg-black/90 px-3 py-2 rounded-lg border border-red-800/60 shadow-sm shadow-red-900/30">MONTEGO BAY</div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-red-200 font-bold bg-black/90 px-3 py-2 rounded-lg border border-red-800/60 shadow-sm shadow-red-900/30">SPANISH TOWN</div>
                      <div className="absolute -bottom-8 right-16 text-sm text-red-200 font-bold bg-black/90 px-3 py-2 rounded-lg border border-red-800/60 shadow-sm shadow-red-900/30">NEGRIL</div>
                    </div>
                  </div>
                </div>

                {/* PROFESSIONAL BROADCAST PANEL */}
                <div className="absolute top-4 left-4 bg-slate-900/95 p-4 rounded-lg border border-blue-500/60 shadow-lg shadow-blue-600/40 backdrop-blur-sm">
                  <div className="text-xs text-blue-300 mb-2 font-bold">YAADTRACK LIVE</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                    <span className="text-xs text-green-100 font-bold">BROADCASTING</span>
                  </div>
                  <div className="text-xs text-blue-200 mb-1">30Hz • Real-time</div>
                  <div className="text-xs text-gray-300">Updated 0.8s ago</div>
                  <div className="text-xs text-blue-300 mt-2 font-bold">247 TRACKED VEHICLES</div>
                </div>

                {/* LIVE TRAFFIC DATA - YAADFLEX STYLE */}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-5 gap-1 text-xs">
                  <div className="bg-black/90 px-1 py-2 rounded border border-green-800/60 text-center shadow-sm shadow-green-900/20">
                    <div className="text-green-300 font-medium">ACTIVE</div>
                    <div className="text-green-100 text-lg font-bold">247</div>
                  </div>
                  <div className="bg-black/90 px-1 py-2 rounded border border-blue-800/60 text-center shadow-sm shadow-blue-900/20">
                    <div className="text-blue-300 font-medium">ROUTES</div>
                    <div className="text-blue-100 text-lg font-bold">89</div>
                  </div>
                  <div className="bg-black/90 px-1 py-2 rounded border border-yellow-800/60 text-center shadow-sm shadow-yellow-900/20">
                    <div className="text-yellow-300 font-medium">ALERTS</div>
                    <div className="text-yellow-100 text-lg font-bold">12</div>
                  </div>
                  <div className="bg-black/90 px-1 py-2 rounded border border-red-800/60 text-center shadow-sm shadow-red-900/20">
                    <div className="text-red-300 font-medium">TRAFFIC</div>
                    <div className="text-red-100 text-lg font-bold">3 JAM</div>
                  </div>
                  <div className="bg-black/90 px-1 py-2 rounded border border-purple-800/60 text-center shadow-sm shadow-purple-900/20">
                    <div className="text-purple-300 font-medium">SAVED</div>
                    <div className="text-purple-100 text-lg font-bold">45min</div>
                  </div>
                </div>
              </div>
              
              {/* OPERATIONAL STATUS */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-black/60 p-3 rounded border border-gray-600/30 text-center">
                  <div className="text-gray-300 text-sm font-medium">MUNICIPAL FLEET</div>
                  <div className="text-white text-xs">Red • 85% Earnings</div>
                  <div className="text-gray-400 text-xs">127 Active</div>
                </div>
                <div className="bg-black/60 p-3 rounded border border-gray-600/30 text-center">
                  <div className="text-gray-300 text-sm font-medium">PREMIUM FLEET</div>
                  <div className="text-white text-xs">White • Executive</div>
                  <div className="text-gray-400 text-xs">120 Active</div>
                </div>
                <div className="bg-black/60 p-3 rounded border border-gray-600/30 text-center">
                  <div className="text-gray-300 text-sm font-medium">SYSTEM STATUS</div>
                  <div className="text-gray-300 text-xs">● OPERATIONAL</div>
                  <div className="text-gray-400 text-xs">All Systems Go</div>
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