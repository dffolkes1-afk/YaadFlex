import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Eye, Banknote } from 'lucide-react';

// Realistic YFD Bills with Egyptian and World Heritage Elements
const realisticBills = [
  {
    value: 1,
    color: 'from-emerald-600 via-green-500 to-emerald-700',
    bgPattern: 'from-emerald-50 to-green-100',
    primaryHero: 'Bob Marley',
    heroQuote: '"Get up, stand up, stand up for your rights"',
    jamaicaSymbol: '🎵 Reggae Legend',
    worldHeritage: {
      name: 'Pyramids of Giza',
      country: 'Egypt 🇪🇬',
      symbol: '🔺',
      element: 'Ancient Wonder'
    },
    securityFeatures: ['Watermark Portrait', 'Security Thread', 'Microprinting'],
    serialNumber: 'YF001234567',
    backDesign: {
      theme: 'Egyptian Pharaoh',
      god: 'Horus - Sky God',
      symbol: '𓅃',
      heritage: 'Valley of the Kings'
    }
  },
  {
    value: 5,
    color: 'from-blue-600 via-cyan-500 to-blue-700',
    bgPattern: 'from-blue-50 to-cyan-100',
    primaryHero: 'Marcus Garvey',
    heroQuote: '"A people without knowledge of their past history is like a tree without roots"',
    jamaicaSymbol: '⭐ Black Star Line',
    worldHeritage: {
      name: 'Machu Picchu',
      country: 'Peru 🇵🇪',
      symbol: '🏔️',
      element: 'Lost City of Incas'
    },
    securityFeatures: ['Holographic Strip', 'Color-Changing Ink', 'Raised Print'],
    serialNumber: 'YF005678901',
    backDesign: {
      theme: 'Inca Sun God',
      god: 'Inti - Sun Deity',
      symbol: '☀️',
      heritage: 'Sacred Valley'
    }
  },
  {
    value: 10,
    color: 'from-purple-600 via-violet-500 to-purple-700',
    bgPattern: 'from-purple-50 to-violet-100',
    primaryHero: 'Jimmy Cliff',
    heroQuote: '"The harder they come, the harder they fall"',
    jamaicaSymbol: '🎬 Rude Boy Culture',
    worldHeritage: {
      name: 'Taj Mahal',
      country: 'India 🇮🇳',
      symbol: '🕌',
      element: 'Monument of Love'
    },
    securityFeatures: ['3D Security Ribbon', 'Tactile Feature', 'UV Fluorescent'],
    serialNumber: 'YF010234567',
    backDesign: {
      theme: 'Indian Elephant God',
      god: 'Ganesha - Remover of Obstacles',
      symbol: '🐘',
      heritage: 'Agra Fort'
    }
  },
  {
    value: 20,
    color: 'from-orange-600 via-amber-500 to-orange-700',
    bgPattern: 'from-orange-50 to-amber-100',
    primaryHero: 'Nelson Mandela',
    heroQuote: '"It always seems impossible until it is done"',
    jamaicaSymbol: '🤝 Unity & Freedom',
    worldHeritage: {
      name: 'Great Wall of China',
      country: 'China 🇨🇳',
      symbol: '🏯',
      element: 'Dragon\'s Backbone'
    },
    securityFeatures: ['Motion Thread', 'Iridescent Ink', 'Embossed Seal'],
    serialNumber: 'YF020345678',
    backDesign: {
      theme: 'Chinese Dragon',
      god: 'Long Wang - Dragon King',
      symbol: '🐉',
      heritage: 'Forbidden City'
    }
  },
  {
    value: 50,
    color: 'from-red-600 via-rose-500 to-red-700',
    bgPattern: 'from-red-50 to-rose-100',
    primaryHero: 'Haile Selassie I',
    heroQuote: '"Throughout history, it has been the inaction of those who could have acted"',
    jamaicaSymbol: '🦁 Lion of Judah',
    worldHeritage: {
      name: 'Petra',
      country: 'Jordan 🇯🇴',
      symbol: '🏛️',
      element: 'Rose City'
    },
    securityFeatures: ['Hologram Patch', 'Metameric Ink', 'Microtext'],
    serialNumber: 'YF050456789',
    backDesign: {
      theme: 'Desert Guardian',
      god: 'Anubis - Guardian of Afterlife',
      symbol: '𓁢',
      heritage: 'City of Stone'
    }
  },
  {
    value: 100,
    color: 'from-yellow-500 via-amber-400 to-yellow-600',
    bgPattern: 'from-yellow-50 to-amber-100',
    primaryHero: 'Louise Bennett-Coverley',
    heroQuote: '"If yu cyaan tek bad tings mek joke, yu gonna dead before yu time"',
    jamaicaSymbol: '📚 Miss Lou Culture',
    worldHeritage: {
      name: 'Angkor Wat',
      country: 'Cambodia 🇰🇭',
      symbol: '🏛️',
      element: 'Temple of Temples'
    },
    securityFeatures: ['Golden Hologram', 'Raised Tactile', 'Security Fibers'],
    serialNumber: 'YF100567890',
    backDesign: {
      theme: 'Khmer Empire',
      god: 'Vishnu - Preserver',
      symbol: '🕉️',
      heritage: 'Angkor Complex'
    }
  }
];

export default function RealisticYFDCurrency() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const currentBill = realisticBills[currentIndex];
  
  const nextBill = () => {
    setCurrentIndex((prev) => (prev + 1) % realisticBills.length);
    setShowBack(false);
    setIsFlipped(false);
  };
  
  const prevBill = () => {
    setCurrentIndex((prev) => (prev - 1 + realisticBills.length) % realisticBills.length);
    setShowBack(false);
    setIsFlipped(false);
  };

  const flipBill = () => {
    setIsFlipped(!isFlipped);
    setTimeout(() => setShowBack(!showBack), 300);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
          💰 YaadFlex Dollar - Realistic Currency
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Jamaican Heroes + World Heritage Sites + Egyptian Gods = Global Currency
        </p>
        <Badge className="mt-2 bg-gradient-to-r from-emerald-600 to-amber-600 text-white">
          Bank-Grade Security Features
        </Badge>
      </div>

      {/* Main Bill Display */}
      <div className="relative flex justify-center items-center min-h-[500px]">
        <div 
          className={`
            relative w-96 h-60 rounded-2xl shadow-2xl cursor-pointer transform transition-all duration-700
            ${isFlipped ? 'rotate-y-180' : ''} preserve-3d hover:scale-105
          `}
          onClick={flipBill}
        >
          {/* Front Side */}
          <div className={`
            absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden
            bg-gradient-to-br ${currentBill.color}
            border-4 border-yellow-400 shadow-2xl
          `}>
            {/* Background Pattern */}
            <div className={`
              absolute inset-0 opacity-20
              bg-gradient-to-br ${currentBill.bgPattern}
            `}>
              {/* Pyramid Pattern */}
              <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute opacity-10"
                    style={{
                      top: `${Math.random() * 80}%`,
                      left: `${Math.random() * 80}%`,
                      fontSize: `${12 + Math.random() * 8}px`,
                    }}
                  >
                    🔺
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-3xl font-bold">{currentBill.value}</div>
                  <div className="text-sm opacity-90">YaadFlex Dollar</div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-80">Serial: {currentBill.serialNumber}</div>
                  <div className="text-xl">{currentBill.worldHeritage.symbol}</div>
                </div>
              </div>

              {/* Center Hero Section */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                  <div className="text-2xl">🎭</div>
                </div>
                <div className="font-bold text-lg">{currentBill.primaryHero}</div>
                <div className="text-xs opacity-90">{currentBill.jamaicaSymbol}</div>
              </div>

              {/* Bottom Section */}
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-80">World Heritage</div>
                  <div className="text-sm font-semibold">{currentBill.worldHeritage.name}</div>
                  <div className="text-xs">{currentBill.worldHeritage.country}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">YFD</div>
                  <div className="text-xs opacity-80">Jamaica 🇯🇲</div>
                </div>
              </div>
            </div>

            {/* Security Elements */}
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
            <div className="absolute bottom-2 left-2 text-xs text-white/60">
              🔒 Holographic • 🌟 Watermark • 💎 Security Thread
            </div>
          </div>

          {/* Back Side */}
          <div className={`
            absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden rotate-y-180
            bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-700
            border-4 border-amber-400 shadow-2xl
          `}>
            {/* Egyptian/World Heritage Back */}
            <div className="absolute inset-0 opacity-30">
              {/* Egyptian Pattern */}
              <div className="absolute inset-0">
                {['𓂀', '𓁢', '𓅃', '𓋹', '𓎡'].map((symbol, i) => (
                  <div
                    key={i}
                    className="absolute text-amber-300 opacity-20"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: `${10 + (i % 2) * 40}%`,
                      fontSize: '24px',
                    }}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              {/* Top Section */}
              <div className="text-center">
                <div className="text-4xl mb-2">{currentBill.backDesign.symbol}</div>
                <div className="font-bold text-lg">{currentBill.backDesign.god}</div>
                <div className="text-sm opacity-90">{currentBill.backDesign.theme}</div>
              </div>

              {/* Center Pyramid */}
              <div className="text-center">
                <div className="text-6xl text-amber-300 animate-pulse">🔺</div>
                <div className="text-sm font-semibold mt-2">{currentBill.backDesign.heritage}</div>
              </div>

              {/* Quote Section */}
              <div className="text-center border-t border-white/20 pt-3">
                <div className="text-xs italic opacity-90 mb-2">
                  "{currentBill.heroQuote}"
                </div>
                <div className="text-xs opacity-80">
                  YaadFlex: Global Unity Through Heritage
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 bg-white/80 hover:bg-white"
          onClick={(e) => { e.stopPropagation(); prevBill(); }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 bg-white/80 hover:bg-white"
          onClick={(e) => { e.stopPropagation(); nextBill(); }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Bill Details */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            {currentBill.value} YFD Bill Details
          </CardTitle>
          <CardDescription>
            Click the bill above to see the Egyptian gods and world heritage back design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Jamaican Hero</h4>
              <p className="text-sm">{currentBill.primaryHero}</p>
              <p className="text-xs text-gray-500 italic mt-1">"{currentBill.heroQuote}"</p>
              <Badge className="mt-2">{currentBill.jamaicaSymbol}</Badge>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">World Heritage (Front)</h4>
              <p className="text-sm">{currentBill.worldHeritage.name}</p>
              <p className="text-xs text-gray-500">{currentBill.worldHeritage.country}</p>
              <p className="text-xs mt-1">{currentBill.worldHeritage.element}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Egyptian God (Back)</h4>
              <p className="text-sm">{currentBill.backDesign.god}</p>
              <p className="text-xs text-gray-500">{currentBill.backDesign.heritage}</p>
              <div className="text-2xl mt-2">{currentBill.backDesign.symbol}</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Security Features</h4>
            <div className="flex flex-wrap gap-2">
              {currentBill.securityFeatures.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  🔒 {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flip Instruction */}
      <div className="text-center mt-6">
        <Button onClick={flipBill} className="gap-2" variant="outline">
          <Eye className="h-4 w-4" />
          {showBack ? 'View Front (Jamaican Heroes)' : 'View Back (Egyptian Gods)'}
        </Button>
      </div>

      {/* Information Card */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
        <h3 className="text-xl font-bold mb-3">🏛️ Realistic Money Design Strategy</h3>
        <div className="space-y-3 text-sm">
          <p>
            <strong>🇯🇲 Front:</strong> Jamaican national heroes with their powerful quotes, combined with world heritage sites 
            like Pyramids, Machu Picchu, Taj Mahal, and Great Wall of China.
          </p>
          <p>
            <strong>🔺 Back:</strong> Egyptian gods (Horus, Inti, Ganesha, Dragon King, Anubis, Vishnu) with hieroglyphics 
            and ancient symbols, representing timeless wisdom and power.
          </p>
          <p>
            <strong>💎 Security Features:</strong> Holographic strips, watermarks, security threads, color-changing ink, 
            and tactile features - just like real international currency.
          </p>
          <p className="bg-amber-100 dark:bg-amber-900 p-3 rounded">
            <strong>🎯 Global Appeal:</strong> Every person worldwide sees something they recognize and respect - 
            their heritage sites, spiritual symbols, or cultural heroes. This creates instant trust and desire to use YFD!
          </p>
        </div>
      </Card>
    </div>
  );
}