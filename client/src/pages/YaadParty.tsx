import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Rocket, PartyPopper, Music, Heart, Star, Trophy, Flame, Gift } from 'lucide-react';

export default function YaadParty() {
  const [clickCount, setClickCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Floating emojis
  const floatingEmojis = ['🇯🇲', '🚀', '🎉', '💰', '🌟', '🔥', '💎', '🏆', '🎊', '🌍'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePartyClick = () => {
    setClickCount(clickCount + 1);
    // Create explosion effect
    const button = document.getElementById('party-button');
    if (button) {
      button.classList.add('animate-bounce');
      setTimeout(() => button.classList.remove('animate-bounce'), 500);
    }
  };

  const shareOnWhatsApp = () => {
    const message = `🎉🇯🇲 YAADFLEX PARTY TIME! 🎉🇯🇲\n\nJAMAICA TAKING OVER THE WORLD!\n85% DRIVER EARNINGS!\nJOIN THE REVOLUTION!\n\n${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-400 via-yellow-400 to-black animate-gradient-xy">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-yellow-500/20 to-red-500/20 animate-pulse" />
        
        {/* Moving Stripes */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-right"
              style={{
                top: `${i * 5}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${3 + i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingEmojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            initial={{ y: '100vh', x: `${Math.random() * 100}vw` }}
            animate={{
              y: '-100vh',
              x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
              rotate: [0, 360]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container max-w-4xl mx-auto p-6 text-center">
        {/* Animated Title */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl mb-4">
            <span className="bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 bg-clip-text text-transparent animate-pulse">
              YAADFLEX
            </span>
          </h1>
          <p className="text-3xl md:text-4xl text-white font-bold animate-bounce">
            🇯🇲 JAMAICA TO THE WORLD! 🇯🇲
          </p>
        </motion.div>

        {/* Spinning Icons */}
        <div className="flex justify-center gap-4 mb-8">
          {[Sparkles, Zap, Rocket, PartyPopper, Music].map((Icon, i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
            >
              <Icon className="h-10 w-10 text-white" />
            </motion.div>
          ))}
        </div>

        {/* Pulsing Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-4"
          >
            <p className="text-5xl font-bold text-white animate-pulse">85%</p>
            <p className="text-xl text-white">DRIVER EARNINGS!</p>
          </motion.div>
          
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-4"
          >
            <p className="text-5xl font-bold text-white animate-pulse">🌍</p>
            <p className="text-xl text-white">WORLDWIDE!</p>
          </motion.div>
          
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-4"
          >
            <p className="text-5xl font-bold text-white animate-pulse">🚀</p>
            <p className="text-xl text-white">TAKING OVER!</p>
          </motion.div>
        </div>

        {/* Interactive Party Button */}
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="mb-8"
        >
          <Button
            id="party-button"
            onClick={handlePartyClick}
            className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 text-white text-2xl px-12 py-8 rounded-full shadow-2xl hover:shadow-3xl transform hover:rotate-3 transition-all"
            data-testid="button-party"
          >
            <PartyPopper className="inline mr-2" />
            CLICK FOR JAMAICA POWER!
            <PartyPopper className="inline ml-2" />
          </Button>
        </motion.div>

        {/* Click Counter */}
        {clickCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-8"
          >
            <p className="text-3xl text-white font-bold">
              🔥 JAMAICA POWER LEVEL: {clickCount} 🔥
            </p>
          </motion.div>
        )}

        {/* Animated Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '💰', text: 'FAIR PAY' },
            { icon: '🚗', text: 'RIDE NOW' },
            { icon: '🛍️', text: 'SHOP LOCAL' },
            { icon: '🌟', text: 'BE FREE' }
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                rotate: [-5, 5, -5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md rounded-xl p-4"
            >
              <p className="text-4xl mb-2">{item.icon}</p>
              <p className="text-white font-bold">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp Share Button */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity
          }}
        >
          <Button
            onClick={shareOnWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-6 rounded-full shadow-2xl transform hover:scale-110 transition-all"
            data-testid="button-whatsapp-share"
          >
            <span className="text-3xl mr-2">📱</span>
            SHARE ON WHATSAPP NOW!
            <span className="text-3xl ml-2">🚀</span>
          </Button>
        </motion.div>

        {/* Dancing Text */}
        <motion.div
          animate={{ 
            x: [-20, 20, -20],
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity
          }}
          className="mt-8"
        >
          <p className="text-2xl text-white font-bold">
            THE FAIR ALTERNATIVE IS HERE!
          </p>
        </motion.div>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ 
                  y: '50vh',
                  x: '50vw',
                  opacity: 1
                }}
                animate={{ 
                  y: `${Math.random() * 100}vh`,
                  x: `${Math.random() * 100}vw`,
                  opacity: 0,
                  rotate: Math.random() * 720
                }}
                transition={{ 
                  duration: 1,
                  ease: "easeOut"
                }}
              >
                {['🎉', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 320" className="w-full">
          <motion.path
            fill="rgba(255,255,255,0.1)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,128C672,117,768,139,864,170.7C960,203,1056,245,1152,234.7C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </svg>
      </div>

      {/* Custom Animations in CSS */}
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}