import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Coins } from 'lucide-react';

// YFD Coin System - The "DINAR" is the supreme denomination
const coinDesigns = [
  {
    value: 1,
    name: '1 Cent',
    metal: 'Copper',
    color: 'from-orange-600 to-amber-700',
    centerColor: 'from-orange-700 to-amber-800',
    size: 'w-24 h-24',
    symbol: 'Hummingbird',
    emblem: '🌺',
    description: 'Doctor Bird - National Symbol',
    edge: 'Smooth',
    features: ['Lignum Vitae Flower', 'National Bird', 'Unity Symbol'],
    historicalPlace: 'Hope Botanical Gardens'
  },
  {
    value: 5,
    name: '5 Cents',
    metal: 'Bronze',
    color: 'from-amber-600 to-yellow-700',
    centerColor: 'from-amber-700 to-yellow-800',
    size: 'w-28 h-28',
    symbol: 'Ackee',
    emblem: '🌿',
    description: 'National Fruit',
    edge: 'Reeded',
    features: ['Ackee Tree', 'Agricultural Heritage', 'Nourishment Symbol'],
    historicalPlace: 'St. Elizabeth Breadbasket'
  },
  {
    value: 10,
    name: '10 Cents',
    metal: 'Nickel',
    color: 'from-gray-500 to-gray-700',
    centerColor: 'from-gray-600 to-gray-800',
    size: 'w-32 h-32',
    symbol: 'Blue Mountain',
    emblem: '⛰️',
    description: 'Blue Mountain Peak',
    edge: 'Grooved',
    features: ['Mountain Range', 'Coffee Heritage', 'Natural Beauty'],
    historicalPlace: 'Blue Mountain Coffee Estate'
  },
  {
    value: 25,
    name: '25 Cents',
    metal: 'Silver Alloy',
    color: 'from-slate-400 to-slate-600',
    centerColor: 'from-slate-500 to-slate-700',
    size: 'w-36 h-36',
    symbol: 'Port Royal',
    emblem: '⚓',
    description: 'Historic Port City',
    edge: 'Inscribed',
    features: ['Pirate History', 'Maritime Heritage', 'Trading Post'],
    historicalPlace: 'Sunken City of Port Royal'
  },
  {
    value: 50,
    name: '50 Cents',
    metal: 'Bi-Metallic',
    color: 'from-yellow-500 to-gray-600',
    centerColor: 'from-yellow-600 to-gray-700',
    size: 'w-40 h-40',
    symbol: 'Maroon Settlement',
    emblem: '🛡️',
    description: 'Freedom Fighters Legacy',
    edge: 'Alternating',
    features: ['Accompong Town', 'Freedom Trail', 'Warrior Spirit'],
    historicalPlace: 'Nanny Town, Moore Town'
  },
  {
    value: 100,
    name: '1 Dinar',
    metal: 'Gold Plated',
    color: 'from-yellow-400 to-amber-600',
    centerColor: 'from-yellow-500 to-amber-700',
    size: 'w-44 h-44',
    symbol: 'Black Star Gate',
    emblem: '⭐',
    description: 'The Supreme Dinar',
    edge: 'Security Ridge',
    features: ['Marcus Garvey Star', 'African Unity', 'Supreme Value'],
    historicalPlace: 'National Heroes Park'
  },
  {
    value: 500,
    name: '5 Dinar',
    metal: 'Platinum Plated',
    color: 'from-purple-400 to-indigo-600',
    centerColor: 'from-purple-500 to-indigo-700',
    size: 'w-48 h-48',
    symbol: 'Lion of Judah',
    emblem: '🦁',
    description: 'Royal Authority',
    edge: 'Diamond Cut',
    features: ['Rastafari Symbol', 'Royal Seal', 'Divine Protection'],
    historicalPlace: 'Nine Mile, Trench Town'
  }
];

export default function YFDCoins() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  const currentCoin = coinDesigns[currentIndex];
  
  const nextCoin = () => {
    setCurrentIndex((prev) => (prev + 1) % coinDesigns.length);
    setIsFlipped(false);
  };
  
  const prevCoin = () => {
    setCurrentIndex((prev) => (prev - 1 + coinDesigns.length) % coinDesigns.length);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">YFD Coin System</h2>
        <p className="text-gray-600 dark:text-gray-400">
          From Cents to Dinars - Each Coin Carries Our Sacred Places
        </p>
        <Badge className="mt-2 bg-gradient-to-r from-green-600 to-yellow-600 text-white">
          The "Dinar" - Supreme Value of YaadFlex
        </Badge>
      </div>

      {!showAll ? (
        <>
          {/* Single Coin Display */}
          <div className="relative flex justify-center items-center min-h-[400px]">
            <div className="relative">
              {/* Coin */}
              <div
                className={`${currentCoin.size} relative cursor-pointer transform transition-all duration-500 hover:scale-110`}
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}
              >
                {/* Front Side */}
                <div className={`
                  absolute inset-0 rounded-full shadow-2xl
                  bg-gradient-to-br ${currentCoin.color}
                  border-4 border-gray-300
                  flex flex-col items-center justify-center
                  ${isFlipped ? 'invisible' : ''}
                `}>
                  {/* Outer Ring */}
                  <div className="absolute inset-2 rounded-full border-2 border-white/30"></div>
                  
                  {/* Center Circle */}
                  <div className={`
                    w-3/4 h-3/4 rounded-full
                    bg-gradient-to-br ${currentCoin.centerColor}
                    flex flex-col items-center justify-center
                    border-2 border-white/20
                  `}>
                    <div className="text-4xl mb-1">{currentCoin.emblem}</div>
                    <div className="text-white font-bold text-lg">{currentCoin.name}</div>
                    <div className="text-white/80 text-xs">{currentCoin.symbol}</div>
                  </div>
                  
                  {/* Edge Pattern */}
                  <div className="absolute inset-0 rounded-full">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-2 bg-white/20"
                        style={{
                          top: '4px',
                          left: '50%',
                          transform: `rotate(${i * 10}deg) translateX(-50%)`,
                          transformOrigin: 'center 56px'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Back Side */}
                <div className={`
                  absolute inset-0 rounded-full shadow-2xl
                  bg-gradient-to-br ${currentCoin.color}
                  border-4 border-gray-300
                  flex flex-col items-center justify-center
                  ${!isFlipped ? 'invisible' : ''}
                  rotate-y-180
                `}>
                  <div className="text-white text-center px-4">
                    <div className="font-bold text-sm mb-2">{currentCoin.description}</div>
                    <div className="text-xs opacity-80">{currentCoin.metal}</div>
                    <div className="text-xs opacity-80 mt-1">Edge: {currentCoin.edge}</div>
                  </div>
                </div>
              </div>

              {/* Shadow */}
              <div className={`
                ${currentCoin.size} absolute top-2 rounded-full opacity-20 bg-black blur-xl
              `}></div>
            </div>

            {/* Navigation */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4"
              onClick={prevCoin}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4"
              onClick={nextCoin}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Coin Details */}
          <Card className="mt-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2">{currentCoin.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentCoin.value === 100 ? 'Base Dinar Unit' : 
                   currentCoin.value === 500 ? 'Premium Dinar' :
                   `Value: ${currentCoin.value} cent${currentCoin.value > 1 ? 's' : ''}`}
                </p>
                <Badge className="mt-2">{currentCoin.metal}</Badge>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Historical Place: {currentCoin.historicalPlace}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Symbol</h4>
                <p className="text-sm">{currentCoin.symbol}</p>
                <p className="text-xs text-gray-500 mt-1">{currentCoin.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Features</h4>
                <ul className="text-sm space-y-1">
                  {currentCoin.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* View All Button */}
          <div className="text-center mt-6">
            <Button onClick={() => setShowAll(true)} className="gap-2">
              <Coins className="h-4 w-4" />
              View All Coins
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* All Coins Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {coinDesigns.map((coin, idx) => (
              <Card 
                key={coin.value}
                className="p-4 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowAll(false);
                  setIsFlipped(false);
                }}
              >
                <div className="flex flex-col items-center">
                  <div className={`
                    w-20 h-20 rounded-full
                    bg-gradient-to-br ${coin.color}
                    border-2 border-gray-300
                    flex items-center justify-center
                    shadow-lg mb-3
                  `}>
                    <div className="text-2xl">{coin.emblem}</div>
                  </div>
                  <h4 className="font-bold">{coin.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{coin.symbol}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {coin.metal}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          {/* Back Button */}
          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => setShowAll(false)}>
              Back to Single View
            </Button>
          </div>
        </>
      )}

      {/* Information Card */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-950 dark:to-green-950">
        <h3 className="text-xl font-bold mb-3">The Dinar System</h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>The Dinar:</strong> Our supreme denomination, representing the highest value in the YaadFlex economy.
            1 Dinar = 100 cents, making it both prestigious and practical.
          </p>
          <p>
            <strong>Real Places, Real History:</strong> Each coin features actual Jamaican historical sites -
            from Hope Gardens to Port Royal, Blue Mountains to Trench Town. These aren't just symbols, they're our story.
          </p>
          <p>
            <strong>Surreal Design:</strong> Elegant metallic gradients with embedded cultural emblems,
            creating coins that feel both ancient and futuristic - uniquely YaadFlex.
          </p>
        </div>
      </Card>
    </div>
  );
}