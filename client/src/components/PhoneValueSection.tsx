import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Crown, TrendingUp, Globe } from 'lucide-react';

export default function PhoneValueSection() {
  const powerTaglines = [
    {
      main: "Your $50 Android > $1000 iPhone",
      sub: "Without YaadFlex, expensive phones are just expensive paperweights",
      icon: "📱"
    },
    {
      main: "Every Phone Becomes a World Bank", 
      sub: "Transform ANY device into the planet's most powerful economic tool",
      icon: "🌍"
    },
    {
      main: "iPhone? More like iWish-I-Had-YaadFlex",
      sub: "Apple users will line up to trade with you",
      icon: "🍎"
    },
    {
      main: "Your Phone Is Now Worth More Than Gold",
      sub: "Access to global economy > expensive hardware",
      icon: "💰"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-emerald-50 via-amber-50 to-yellow-50 dark:from-emerald-950 dark:via-amber-950 dark:to-yellow-950 border-4 border-gradient-to-r from-emerald-400 via-amber-400 to-yellow-500 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
          📱✨ THE PHONE VALUE REVOLUTION
        </CardTitle>
        <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          YaadFlex: Making Every Phone More Valuable Than an iPhone
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Power Taglines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {powerTaglines.map((tagline, idx) => (
            <div 
              key={idx}
              className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border-2 border-amber-300 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{tagline.icon}</div>
                <div className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-2">
                  {tagline.main}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300 italic">
                  {tagline.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Ultimate Statement */}
        <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-6 rounded-2xl text-white text-center shadow-2xl">
          <div className="text-2xl font-bold mb-3">
            🏆 "STEAL A YAADLEX PHONE = STEAL THE WORLD" 🏆
          </div>
          <div className="text-lg mb-4">
            Because it's not just a phone anymore - it's the entire global economy in your pocket
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/20 p-3 rounded-lg">
              <Smartphone className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">Hardware Value</div>
              <div>iPhone: $1000+</div>
              <div>Any Phone + YaadFlex: PRICELESS</div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Crown className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">Economic Power</div>
              <div>iPhone: Limited</div>
              <div>YaadFlex Phone: UNLIMITED</div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Globe className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">Global Reach</div>
              <div>iPhone: App Store</div>
              <div>YaadFlex: WORLD ECONOMY</div>
            </div>
          </div>
        </div>

        {/* Marketing Badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge className="bg-emerald-600 text-white">📱 Any Phone = World Bank</Badge>
          <Badge className="bg-amber-600 text-white">💰 Real Money Maker</Badge>
          <Badge className="bg-yellow-600 text-white">🌍 Global Economy Access</Badge>
          <Badge className="bg-purple-600 text-white">👑 iPhone Killer</Badge>
          <Badge className="bg-blue-600 text-white">🚀 Beyond Apple</Badge>
        </div>

        {/* Final Power Statement */}
        <div className="text-center bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-4 rounded-xl border-2 border-purple-300">
          <div className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">
            "Why Buy iPhone When You Can Own The World?"
          </div>
          <div className="text-purple-700 dark:text-purple-300 italic">
            YaadFlex transforms ANY device into humanity's most powerful economic tool
          </div>
        </div>
      </CardContent>
    </Card>
  );
}