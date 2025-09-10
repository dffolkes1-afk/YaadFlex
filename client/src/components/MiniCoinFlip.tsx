import { useState } from 'react';
import { motion } from 'framer-motion';

interface MiniCoinFlipProps {
  value: string;
  currency: string;
  color?: string;
  size?: string;
}

export default function MiniCoinFlip({
  value,
  currency,
  color = 'from-yellow-400 to-amber-600',
  size = 'w-16 h-16'
}: MiniCoinFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    
    // Subtle click sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp');
    audio.volume = 0.05;
    audio.play().catch(() => {});
  };

  return (
    <div 
      className={`relative ${size} cursor-pointer perspective-1000 inline-block`}
      onClick={handleFlip}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className={`absolute inset-0 ${size} preserve-3d`}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          duration: 0.4,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-full shadow-lg bg-gradient-to-br ${color} border-2 border-gray-300 flex items-center justify-center`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-white font-bold text-xs text-center">
            <div className="text-lg">{currency}</div>
          </div>
        </div>
        
        {/* Back Face */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-full shadow-lg bg-gradient-to-br ${color} border-2 border-gray-300 flex items-center justify-center`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-white font-bold text-xs">
            {value}
          </div>
        </div>
      </motion.div>
    </div>
  );
}