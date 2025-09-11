import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Download, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SurpriseLanding() {
  const params = useParams<{ code: string }>();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    // Capture install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Auto-show install prompt after 2 seconds for surprise effect
      setTimeout(() => {
        if (e) {
          e.prompt();
        }
      }, 2000);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Show welcome notification if supported
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('🎁 YaadFlex Arrived!', {
            body: 'Someone special dropped this app just for you!',
            icon: '/icon-192.png',
            badge: '/icon-192.png'
          });
        }
      });
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "✨ Welcome to YaadFlex!",
          description: "The app is now on your home screen!",
        });
      }
    } else if (isIOS) {
      toast({
        title: "Add to Home Screen",
        description: "Tap Share (↗) → Add to Home Screen",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-green-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1.5 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        {/* Animated Gift Box */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
          className="text-center mb-6"
        >
          <div className="relative inline-block">
            <Gift className="h-24 w-24 text-primary" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Surprise Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            SURPRISE! 🎉
          </h1>
          <p className="text-lg font-semibold mb-2">
            Someone dropped YaadFlex on you!
          </p>
          <p className="text-sm text-muted-foreground">
            Jamaica's revolutionary super-app is here
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-3 mb-8"
        >
          <div className="flex items-center gap-3 text-sm">
            <span className="text-2xl">🚗</span>
            <span>Fair rides with 85% driver earnings</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-2xl">💰</span>
            <span>Digital wallet for global payments</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-2xl">🛍️</span>
            <span>Marketplace, delivery & more!</span>
          </div>
        </motion.div>

        {/* Install Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        >
          <Button
            onClick={handleInstall}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            data-testid="button-get-app"
          >
            <Download className="h-5 w-5 mr-2" />
            Get YaadFlex NOW!
          </Button>
        </motion.div>

        {/* Start Using Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-4"
        >
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
            data-testid="button-start-using"
          >
            <Home className="h-4 w-4 mr-2" />
            Start Using YaadFlex
          </Button>
        </motion.div>

        {/* Magic Code */}
        {params.code && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Magic Drop Code: {params.code}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Emojis Animation */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {['🎁', '✨', '🚀', '💫', '🎉', '🌟'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}