import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Sparkles, Rocket } from 'lucide-react';

export default function SimpleLinksPage() {
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Animated space background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        
        {showGreeting ? (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">🌌</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gold-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              WELCOME TO THE FUTURE
            </h1>
            <p className="text-2xl text-purple-300">
              You are now operating at <span className="text-gold-400 font-bold">GALACTIC STANDARD</span>
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2 text-cyan-400">
              <Sparkles className="animate-spin" size={20} />
              <span className="text-lg">YaadFlex Global Vybz Universe</span>
              <Sparkles className="animate-spin" size={20} />
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gold-400 to-purple-500 bg-clip-text text-transparent">
                🇯🇲 YaadFlex Command Center
              </h1>
              <p className="text-lg text-gray-300">
                Access all galactic-level business operations
              </p>
              <Link href="/portal">
                <button className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-gold-500 rounded-full text-sm font-bold hover:from-purple-700 hover:to-gold-600 transition-all duration-300 transform hover:scale-105" data-testid="button-galactic-portal">
                  <Rocket className="inline mr-2" size={16} />
                  Experience Transformation Portal
                </button>
              </Link>
            </div>

            <div className="space-y-4 w-full max-w-md">
              
              {/* Galactic-Level Business Operations */}
              <a 
                href="/premium-storefront" 
                className="block w-full p-4 bg-gradient-to-r from-gold-500 via-yellow-500 to-gold-600 text-black text-center font-bold text-xl rounded-lg border-2 border-gold-400 shadow-lg shadow-gold-400/20 hover:shadow-gold-400/40 hover:scale-105 transition-all duration-300"
                data-testid="link-premium-storefront"
              >
                ✨ GALACTIC STOREFRONTS ✨<br/>
                <span className="text-sm font-normal">Premium Business Universe</span>
              </a>
              
              <a 
                href="/real-estate" 
                className="block w-full p-4 bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 text-white text-center font-bold text-xl rounded-lg border-2 border-green-400 shadow-lg shadow-green-400/20 hover:shadow-green-400/40 hover:scale-105 transition-all duration-300"
                data-testid="link-real-estate"
              >
                🌍 PLANETARY REAL ESTATE 🌍<br/>
                <span className="text-sm font-normal">Advanced Property Matrix</span>
              </a>
              
              <a 
                href="/car-marketplace" 
                className="block w-full p-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white text-center font-bold text-xl rounded-lg border-2 border-red-400 shadow-lg shadow-red-400/20 hover:shadow-red-400/40 hover:scale-105 transition-all duration-300"
                data-testid="link-car-marketplace"
              >
                🚀 3D VEHICLE DIMENSION 🚀<br/>
                <span className="text-sm font-normal">Holographic Car Viewing</span>
              </a>
              
              <a 
                href="/ride-booking" 
                className="block w-full p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white text-center font-bold text-xl rounded-lg border-2 border-purple-400 shadow-lg shadow-purple-400/20 hover:shadow-purple-400/40 hover:scale-105 transition-all duration-300"
                data-testid="link-ride-booking"
              >
                ⚡ QUANTUM TRANSPORTATION ⚡<br/>
                <span className="text-sm font-normal">Instant Ride Summoning</span>
              </a>
              
              <a 
                href="/driver-registration" 
                className="block w-full p-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-center font-bold text-xl rounded-lg border-2 border-emerald-400 shadow-lg shadow-emerald-400/20 hover:shadow-emerald-400/40 hover:scale-105 transition-all duration-300"
                data-testid="link-driver-registration"
              >
                💫 ELITE DRIVER STATUS 💫<br/>
                <span className="text-sm font-normal">85% Galactic Earnings</span>
              </a>
              
              <a 
                href="/business-registration" 
                className="block w-full p-4 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white text-center font-bold text-xl rounded-lg border-2 border-indigo-400 shadow-lg shadow-indigo-400/20 hover:shadow-indigo-400/40 hover:scale-105 transition-all duration-300"
                data-testid="link-business-registration"
              >
                🌟 BUSINESS ASCENSION 🌟<br/>
                <span className="text-sm font-normal">Civilization Upgrade</span>
              </a>
              
              <a 
                href="/contactless" 
                className="block w-full p-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white text-center font-bold text-xl rounded-lg border-2 border-yellow-400 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:scale-105 transition-all duration-300"
                data-testid="link-contactless"
              >
                🤖 AUTOMATED DIMENSION 🤖<br/>
                <span className="text-sm font-normal">Zero Human Contact Required</span>
              </a>
              
              <a 
                href="/cb-radio" 
                className="block w-full p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white text-center font-bold text-xl rounded-lg border-2 border-blue-400 shadow-lg shadow-blue-400/20 hover:shadow-blue-400/40 hover:scale-105 transition-all duration-300"
                data-testid="link-cb-radio"
              >
                📡 INTERDIMENSIONAL COMMS 📡<br/>
                <span className="text-sm font-normal">Driver Network Frequency</span>
              </a>
              
              <a 
                href="/banking" 
                className="block w-full p-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white text-center font-bold text-xl rounded-lg border-2 border-green-400 shadow-lg shadow-green-400/20 hover:shadow-green-400/40 hover:scale-105 transition-all duration-300"
                data-testid="link-banking"
              >
                💰 GALACTIC TREASURY 💰<br/>
                <span className="text-sm font-normal">Automatic Wealth Transfer</span>
              </a>
              
            </div>
            
            <div className="text-center mt-12 space-y-4">
              <p className="text-gray-400">
                <span className="text-cyan-400 font-bold">GALACTIC STATUS:</span> FULLY OPERATIONAL
              </p>
              <p className="text-sm text-purple-300">
                ⚡ All systems automated • 🌌 Operating at maximum efficiency • 💰 Revenue flowing automatically
              </p>
              <div className="flex items-center justify-center space-x-2 text-gold-400">
                <Sparkles size={16} />
                <span className="text-xs">YaadFlex Global Vybz - The Future is NOW</span>
                <Sparkles size={16} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}