import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sparkles, Rocket, Zap, Globe, ArrowRight, Star } from 'lucide-react';

export default function GalacticPortalPage() {
  const [stage, setStage] = useState(0);
  const [showPortal, setShowPortal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPortal(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const transformationStages = [
    {
      title: "STONE AGE BUSINESS",
      subtitle: "Manual processes, paperwork, bank visits...",
      icon: "🏪",
      color: "from-gray-600 to-gray-800",
      description: "Traditional methods holding you back"
    },
    {
      title: "DIGITAL EVOLUTION", 
      subtitle: "Basic apps, simple websites...",
      icon: "💻",
      color: "from-blue-500 to-blue-700",
      description: "First steps into the digital world"
    },
    {
      title: "ADVANCED CIVILIZATION",
      subtitle: "AI-powered, automated, contactless...",
      icon: "🤖",
      color: "from-purple-500 to-purple-700",
      description: "Smart systems working for you"
    },
    {
      title: "GALACTIC STANDARD",
      subtitle: "YaadFlex Global Vybz - The Future is NOW!",
      icon: "🌌",
      color: "from-gold-500 to-purple-600",
      description: "Welcome to the ultimate business dimension"
    }
  ];

  const startTransformation = () => {
    setStage(1);
    const interval = setInterval(() => {
      setStage(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated space background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
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

      {/* Portal entrance effect */}
      {showPortal && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 border-4 border-purple-500 rounded-full animate-spin opacity-20" />
          <div className="absolute w-80 h-80 border-2 border-gold-400 rounded-full animate-ping opacity-30" />
          <div className="absolute w-64 h-64 border border-cyan-300 rounded-full animate-pulse opacity-40" />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-white">
        
        {stage === 0 ? (
          // Welcome Portal
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-gold-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                🌌 GALACTIC PORTAL 🌌
              </h1>
              <p className="text-2xl text-gray-300">
                PREPARE FOR DIMENSIONAL SHIFT
              </p>
            </div>

            <div className="max-w-2xl text-center space-y-6">
              <p className="text-xl text-purple-300">
                You are about to enter the <span className="text-gold-400 font-bold">MOST ADVANCED BUSINESS DIMENSION</span> in the Caribbean Universe.
              </p>
              
              <p className="text-lg text-gray-300">
                Your business will be <span className="text-cyan-400 font-bold">TRANSFORMED</span> from primitive methods to 
                <span className="text-purple-400 font-bold"> GALACTIC-LEVEL OPERATIONS</span>.
              </p>

              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <Sparkles className="animate-spin" />
                <span className="text-lg font-bold">CIVILIZATION UPGRADE AVAILABLE</span>
                <Sparkles className="animate-spin" />
              </div>
            </div>

            <Button
              onClick={startTransformation}
              className="text-2xl py-8 px-12 bg-gradient-to-r from-purple-600 via-gold-500 to-cyan-500 hover:from-purple-700 hover:via-gold-600 hover:to-cyan-600 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              data-testid="button-start-transformation"
            >
              <Rocket className="mr-4" size={32} />
              INITIATE TRANSFORMATION
              <ArrowRight className="ml-4" size={32} />
            </Button>
          </div>
        ) : (
          // Transformation sequence
          <div className="text-center space-y-8">
            <div className="text-8xl mb-8 animate-bounce">
              {transformationStages[stage].icon}
            </div>
            
            <div className={`p-8 rounded-lg bg-gradient-to-r ${transformationStages[stage].color} transform transition-all duration-1000`}>
              <h2 className="text-4xl font-bold mb-4">
                {transformationStages[stage].title}
              </h2>
              <p className="text-xl mb-4">
                {transformationStages[stage].subtitle}
              </p>
              <p className="text-lg text-gray-200">
                {transformationStages[stage].description}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-purple-500 to-gold-400 h-4 rounded-full transition-all duration-2000"
                style={{ width: `${((stage + 1) / 4) * 100}%` }}
              />
            </div>

            {stage === 3 && (
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: '1s' }}>
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-bold text-gold-400">
                    🎉 TRANSFORMATION COMPLETE! 🎉
                  </h3>
                  <p className="text-xl text-purple-300">
                    Welcome to <span className="text-gold-400">YaadFlex Global Vybz</span>
                  </p>
                  <p className="text-lg text-cyan-300">
                    You now operate at <span className="font-bold">GALACTIC STANDARD</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-2xl">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-lg">
                    <Zap className="mx-auto mb-2" size={24} />
                    <p className="text-sm font-bold">85% Driver Earnings</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg">
                    <Globe className="mx-auto mb-2" size={24} />
                    <p className="text-sm font-bold">Global Marketplace</p>
                  </div>
                  <div className="bg-gradient-to-r from-gold-500 to-yellow-500 p-4 rounded-lg text-black">
                    <Star className="mx-auto mb-2" size={24} />
                    <p className="text-sm font-bold">Automatic Payments</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg">
                    <Sparkles className="mx-auto mb-2" size={24} />
                    <p className="text-sm font-bold">100% Contactless</p>
                  </div>
                </div>

                <Link href="/links">
                  <Button 
                    className="text-2xl py-6 px-10 bg-gradient-to-r from-gold-500 via-purple-600 to-cyan-500 hover:from-gold-600 hover:via-purple-700 hover:to-cyan-600 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse"
                    data-testid="button-enter-yaadflex"
                  >
                    <Rocket className="mr-3" size={28} />
                    ENTER YAADFLEX UNIVERSE
                    <ArrowRight className="ml-3" size={28} />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}