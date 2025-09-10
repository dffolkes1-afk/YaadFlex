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
            border-4 border-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 shadow-2xl
            bg-opacity-90 backdrop-blur-sm
          `} style={{
            background: `linear-gradient(135deg, 
              rgba(255,215,0,0.9) 0%, 
              rgba(255,193,7,0.95) 25%, 
              rgba(255,235,59,0.9) 50%, 
              rgba(255,193,7,0.95) 75%, 
              rgba(255,215,0,0.9) 100%), 
              url("data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="money-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.1)"/>
                      <text x="10" y="15" text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.05)">💎</text>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#money-pattern)"/>
                </svg>
              `)}")`,
            boxShadow: `
              0 0 30px rgba(255,215,0,0.5),
              0 0 60px rgba(255,193,7,0.3),
              inset 0 1px 0 rgba(255,255,255,0.3),
              inset 0 -1px 0 rgba(0,0,0,0.2)
            `
          }}>
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

              {/* Center Hero Section - LUXURY PORTRAIT */}
              <div className="text-center relative">
                {/* Gold Portrait Frame */}
                <div className="w-24 h-24 mx-auto mb-3 relative">
                  {/* Outer Gold Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 p-1 shadow-lg">
                    {/* Inner Portrait */}
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center border-2 border-amber-300 relative overflow-hidden">
                      {/* Hero "Photo" Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-yellow-900 opacity-80"></div>
                      <div className="relative text-3xl font-bold text-white drop-shadow-lg z-10">
                        {currentBill.value === 1 ? '🎵' : 
                         currentBill.value === 5 ? '⭐' : 
                         currentBill.value === 10 ? '🎬' : 
                         currentBill.value === 20 ? '✊' : 
                         currentBill.value === 50 ? '👑' : '📚'}
                      </div>
                      {/* Photo Shine Effect */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-full"></div>
                    </div>
                  </div>
                  {/* Diamond Corner Accents */}
                  <div className="absolute -top-1 -right-1 text-xs">💎</div>
                  <div className="absolute -bottom-1 -left-1 text-xs">💎</div>
                </div>
                
                {/* Hero Name with Gold Text */}
                <div className="font-bold text-lg text-yellow-100 drop-shadow-md mb-1"
                     style={{textShadow: '0 0 10px rgba(255,215,0,0.8), 0 2px 4px rgba(0,0,0,0.5)'}}>
                  {currentBill.primaryHero}
                </div>
                <div className="text-xs opacity-90 text-yellow-200">{currentBill.jamaicaSymbol}</div>
                
                {/* Holographic Security Strip */}
                <div className="absolute right-2 top-2 w-1 h-16 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-400 rounded opacity-70 animate-pulse"></div>
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

          {/* Back Side - EGYPTIAN LUXURY */}
          <div className={`
            absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden rotate-y-180
            bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900
            border-4 border-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 shadow-2xl
          `} style={{
            background: `linear-gradient(135deg, 
              rgba(75,0,130,0.95) 0%, 
              rgba(25,25,112,0.9) 25%, 
              rgba(72,61,139,0.95) 50%, 
              rgba(106,90,205,0.9) 75%, 
              rgba(138,43,226,0.95) 100%), 
              url("data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="egyptian-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                      <polygon points="12.5,5 20,20 5,20" fill="rgba(255,215,0,0.1)"/>
                      <circle cx="12.5" cy="12.5" r="1" fill="rgba(255,215,0,0.05)"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#egyptian-pattern)"/>
                </svg>
              `)}")`,
            boxShadow: `
              0 0 40px rgba(138,43,226,0.6),
              0 0 80px rgba(75,0,130,0.4),
              inset 0 1px 0 rgba(255,255,255,0.2),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `
          }}>
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
              {/* Top Section - EGYPTIAN GOD LUXURY */}
              <div className="text-center relative">
                {/* Golden God Frame */}
                <div className="w-16 h-16 mx-auto mb-2 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 p-1 shadow-xl">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center border border-amber-300">
                      <div className="text-2xl">{currentBill.backDesign.symbol}</div>
                    </div>
                  </div>
                  {/* Divine Light Rays */}
                  <div className="absolute -inset-2 opacity-50">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-4 bg-gradient-to-t from-amber-400 to-transparent"
                        style={{
                          top: '-8px',
                          left: '50%',
                          transform: `rotate(${i * 45}deg) translateX(-50%)`,
                          transformOrigin: 'center 32px'
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="font-bold text-lg text-amber-200 drop-shadow-lg mb-1"
                     style={{textShadow: '0 0 15px rgba(255,191,0,0.9), 0 2px 4px rgba(0,0,0,0.7)'}}>
                  {currentBill.backDesign.god}
                </div>
                <div className="text-xs opacity-90 text-amber-300">{currentBill.backDesign.theme}</div>
              </div>

              {/* Center MEGA PYRAMID */}
              <div className="text-center relative">
                {/* Pyramid with Golden Capstone */}
                <div className="relative">
                  <div className="text-8xl text-amber-400 drop-shadow-2xl animate-pulse" 
                       style={{textShadow: '0 0 30px rgba(255,191,0,0.8), 0 4px 8px rgba(0,0,0,0.6)'}}>
                    🔺
                  </div>
                  {/* Golden Capstone */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-300 text-lg animate-ping">
                    💎
                  </div>
                  {/* Eye of Horus */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-cyan-300 text-xl">
                    👁️
                  </div>
                </div>
                <div className="text-sm font-bold text-amber-200 mt-3 drop-shadow">{currentBill.backDesign.heritage}</div>
                
                {/* Hieroglyphic Border */}
                <div className="flex justify-center space-x-2 mt-2 opacity-60">
                  <span className="text-amber-400">𓂀</span>
                  <span className="text-amber-400">𓁢</span>
                  <span className="text-amber-400">𓅃</span>
                  <span className="text-amber-400">𓋹</span>
                  <span className="text-amber-400">𓎡</span>
                </div>
              </div>

              {/* Quote Section with Golden Border */}
              <div className="text-center border-t-2 border-amber-400/30 pt-3 relative">
                <div className="text-xs italic opacity-90 mb-2 text-amber-100">
                  "{currentBill.heroQuote}"
                </div>
                <div className="text-xs opacity-80 text-amber-200 font-semibold">
                  YaadFlex: Global Unity Through Heritage
                </div>
                
                {/* Corner Ankh Symbols */}
                <div className="absolute -top-1 left-0 text-amber-400 text-xs">☥</div>
                <div className="absolute -top-1 right-0 text-amber-400 text-xs">☥</div>
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