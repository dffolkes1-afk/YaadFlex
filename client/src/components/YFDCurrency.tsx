import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Globe, MapPin } from 'lucide-react';

// YaadFlex Dollar (YFD) Currency Designs
const currencyDesigns = [
  {
    denomination: 1,
    color: 'from-green-600 to-emerald-700',
    figure: 'Marcus Garvey',
    title: 'National Hero & Pan-Africanist',
    quote: 'One God, One Aim, One Destiny',
    watermark: 'Africa Unity Symbol',
    features: ['Jamaican Map', 'African Continent', 'Unity Emblem']
  },
  {
    denomination: 5,
    color: 'from-yellow-600 to-amber-700',
    figure: 'Nanny of the Maroons',
    title: 'National Hero & Freedom Fighter',
    quote: 'Queen Mother of Jamaica',
    watermark: 'Maroon Symbol',
    features: ['Blue Mountains', 'African Heritage', 'Freedom Torch']
  },
  {
    denomination: 10,
    color: 'from-red-600 to-rose-700',
    figure: 'Paul Bogle',
    title: 'National Hero & Baptist Deacon',
    quote: 'Champion of the Oppressed',
    watermark: 'Morant Bay Courthouse',
    features: ['Jamaican Coat of Arms', 'African Roots', 'Justice Scale']
  },
  {
    denomination: 20,
    color: 'from-purple-600 to-violet-700',
    figure: 'Sam Sharpe',
    title: 'National Hero & Freedom Fighter',
    quote: 'I would rather die than be a slave',
    watermark: 'Freedom Monument',
    features: ['Jamaican Flag Colors', 'African Diaspora Map', 'Liberty Bell']
  },
  {
    denomination: 50,
    color: 'from-blue-600 to-indigo-700',
    figure: 'George William Gordon',
    title: 'National Hero & Politician',
    quote: 'Justice for All People',
    watermark: 'Parliament Building',
    features: ['Caribbean Sea', 'African Connection', 'Unity Bridge']
  },
  {
    denomination: 100,
    color: 'from-teal-600 to-cyan-700',
    figure: 'Bob Marley',
    title: 'Cultural Icon & Musical Legend',
    quote: 'One Love, One Heart',
    watermark: 'Guitar & Lion',
    features: ['Reggae Waves', 'Rastafari Colors', 'World Peace Symbol']
  },
  {
    denomination: 500,
    color: 'from-orange-600 to-red-700',
    figure: 'Jimmy Cliff',
    title: 'Cultural Ambassador',
    quote: 'The Harder They Come',
    watermark: 'Musical Notes',
    features: ['Jamaican Sunrise', 'African Drums', 'Cultural Bridge']
  },
  {
    denomination: 1000,
    color: 'from-pink-600 to-rose-700',
    figure: 'Nelson Mandela',
    title: 'African Unity Leader',
    quote: 'It always seems impossible until it\'s done',
    watermark: 'Fist of Freedom',
    features: ['African Union Flag', 'Table Mountain', 'Unity Chain']
  },
  {
    denomination: 2500,
    color: 'from-indigo-600 to-purple-700',
    figure: 'Haile Selassie I',
    title: 'Ethiopian Emperor & Unity Symbol',
    quote: 'Until the philosophy which holds one race superior',
    watermark: 'Lion of Judah',
    features: ['Ethiopian Cross', 'African Crown', 'Peace Dove']
  },
  {
    denomination: 10000,
    color: 'from-gray-700 to-black',
    figure: 'Kwame Nkrumah',
    title: 'Pan-African Visionary',
    quote: 'We face neither East nor West; we face forward',
    watermark: 'Black Star',
    features: ['Ghana Independence Arch', 'African Unity Map', 'Global South Symbol']
  }
];

export default function YFDCurrency() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  
  const currentBill = currencyDesigns[currentIndex];
  
  const nextBill = () => {
    setCurrentIndex((prev) => (prev + 1) % currencyDesigns.length);
    setShowBack(false);
  };
  
  const prevBill = () => {
    setCurrentIndex((prev) => (prev - 1 + currencyDesigns.length) % currencyDesigns.length);
    setShowBack(false);
  };
  
  const formatCurrency = (amount: number) => {
    return amount >= 1000 
      ? `$${(amount / 1000).toFixed(amount === 2500 ? 1 : 0)}K`
      : `$${amount}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">YaadFlex Dollar (YFD)</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Honoring Our Heroes • Celebrating Our Culture • Building Our Future
        </p>
      </div>

      <div className="relative">
        {/* Currency Display */}
        <Card className={`
          relative overflow-hidden h-[400px] 
          bg-gradient-to-br ${currentBill.color}
          text-white shadow-2xl
          transform transition-all duration-500
          ${showBack ? 'rotate-y-180' : ''}
        `}>
          {!showBack ? (
            // Front of Bill
            <div className="relative h-full p-8 flex flex-col justify-between">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="text-[200px] font-bold">
                  {formatCurrency(currentBill.denomination)}
                </div>
              </div>
              
              {/* Top Section */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-4xl font-bold">
                      {formatCurrency(currentBill.denomination)}
                    </h3>
                    <p className="text-sm opacity-90 mt-1">YaadFlex Dollar</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-white/20 backdrop-blur-sm border-white/30">
                      Series 2025
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Center Section - Hero */}
              <div className="relative z-10 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                  <h4 className="text-2xl font-bold mb-2">{currentBill.figure}</h4>
                  <p className="text-sm opacity-90 mb-3">{currentBill.title}</p>
                  <p className="text-lg italic">"{currentBill.quote}"</p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="relative z-10">
                <div className="flex justify-between items-end">
                  <div className="flex gap-2">
                    <MapPin className="w-5 h-5 opacity-70" />
                    <Globe className="w-5 h-5 opacity-70" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowBack(true)}
                  >
                    View Features →
                  </Button>
                </div>
              </div>

              {/* Security Pattern */}
              <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white/20 rounded-full">
                <div className="w-full h-full border border-white/10 rounded-full m-1"></div>
              </div>
            </div>
          ) : (
            // Back of Bill
            <div className="relative h-full p-8 flex flex-col justify-between">
              <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-4">Security Features</h4>
                <div className="space-y-3">
                  {currentBill.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative z-10 text-center">
                <p className="text-sm opacity-80 mb-2">Watermark:</p>
                <p className="text-lg font-semibold">{currentBill.watermark}</p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 relative z-10"
                onClick={() => setShowBack(false)}
              >
                ← View Front
              </Button>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12"
          onClick={prevBill}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12"
          onClick={nextBill}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Denomination Selector */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        {currencyDesigns.map((bill, idx) => (
          <Button
            key={bill.denomination}
            variant={idx === currentIndex ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setCurrentIndex(idx);
              setShowBack(false);
            }}
            className="min-w-[80px]"
          >
            {formatCurrency(bill.denomination)}
          </Button>
        ))}
      </div>

      {/* Info Section */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-950 dark:to-yellow-950">
        <h3 className="text-xl font-bold mb-3">About YFD Currency</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          The YaadFlex Dollar (YFD) celebrates our rich Jamaican heritage and African roots. 
          Each denomination honors our national heroes and cultural icons who fought for freedom, 
          unity, and justice.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Security:</strong> Advanced watermarks and multi-layer protection
          </div>
          <div>
            <strong>Global:</strong> Accepted worldwide through YaadFlex network
          </div>
          <div>
            <strong>Digital:</strong> Seamlessly converts to digital transactions
          </div>
          <div>
            <strong>Cultural:</strong> Preserving our history for future generations
          </div>
        </div>
      </Card>
    </div>
  );
}