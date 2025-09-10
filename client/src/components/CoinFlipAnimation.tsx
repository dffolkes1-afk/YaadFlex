import { useState } from 'react';
import { motion } from 'framer-motion';

interface CoinFlipProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  size?: string;
  autoFlip?: boolean;
  flipDuration?: number;
  className?: string;
  onClick?: () => void;
}

export default function CoinFlipAnimation({
  frontContent,
  backContent,
  size = 'w-32 h-32',
  autoFlip = false,
  flipDuration = 0.6,
  className = '',
  onClick
}: CoinFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setIsFlipped(!isFlipped);
      
      // Play a subtle click sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y');
      audio.volume = 0.1;
      audio.play().catch(() => {});
      
      setTimeout(() => {
        setIsFlipping(false);
        onClick?.();
      }, flipDuration * 1000);
    }
  };

  return (
    <div 
      className={`relative ${size} ${className} cursor-pointer perspective-1000`}
      onClick={handleFlip}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className={`absolute inset-0 ${size} preserve-3d`}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          duration: flipDuration,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {frontContent}
        </div>
        
        {/* Back Face */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {backContent}
        </div>
      </motion.div>
    </div>
  );
}