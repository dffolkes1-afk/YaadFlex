import { useState, useEffect } from 'react';
import { X, Zap, Globe, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export function GlobalPromoFloater() {
  const [isVisible, setIsVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Show after 3 seconds on page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-bounce-slow">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-4 rounded-2xl border-2 border-yellow-400 shadow-2xl text-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full p-0"
          data-testid="close-promo-floater"
        >
          <X className="h-3 w-3" />
        </Button>
        
        <div className="text-center">
          <div className="text-lg font-black mb-2">
            🔥 JOIN THE REVOLUTION!
          </div>
          <div className="text-sm font-semibold mb-3">
            2M+ people ditched banks for YaadFlex
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-white/20 p-2 rounded">
              <Globe className="h-4 w-4 mx-auto mb-1" />
              195 Countries
            </div>
            <div className="bg-white/20 p-2 rounded">
              <DollarSign className="h-4 w-4 mx-auto mb-1" />
              0.5% Fees Only
            </div>
            <div className="bg-white/20 p-2 rounded">
              <Zap className="h-4 w-4 mx-auto mb-1" />
              3-Sec Transfers
            </div>
            <div className="bg-white/20 p-2 rounded">
              <Users className="h-4 w-4 mx-auto mb-1" />
              AI-Powered
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.href = '/wallet'}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 font-bold text-sm py-2"
            data-testid="join-revolution-button"
          >
            🚀 JOIN NOW - FREE $50!
          </Button>
          
          <div className="text-xs mt-2 opacity-90">
            🏆 "The TapTap Killer"
          </div>
        </div>
      </div>
    </div>
  );
}