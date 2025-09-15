import { useState, useEffect } from "react";

interface PremiumYaadFlexLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showCrest?: boolean;
  showBlackrockBranding?: boolean;
}

export function PremiumYaadFlexLogo({ 
  size = "md", 
  className = "", 
  showCrest = true,
  showBlackrockBranding = true
}: PremiumYaadFlexLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);

  // Dynamic glow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-4xl md:text-6xl", 
    lg: "text-6xl md:text-8xl",
    xl: "text-8xl md:text-9xl"
  };

  const crestSize = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl", 
    xl: "text-7xl"
  };

  const blackrockSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  return (
    <div 
      className={`relative flex items-center justify-center gap-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="premium-yaadflex-logo"
    >
      
      {/* Premium Crest Emblem */}
      {showCrest && (
        <div 
          className={`${crestSize[size]} transform transition-all duration-700 ${
            isHovered ? 'scale-110 rotate-12' : 'scale-100'
          }`}
          style={{
            filter: `drop-shadow(0 0 ${10 + glowIntensity/10}px hsl(168, 100%, 36%)) drop-shadow(0 0 ${20 + glowIntensity/5}px hsl(43, 100%, 70%))`,
            textShadow: `0 0 10px hsl(168, 100%, 36%), 0 0 20px hsl(43, 100%, 70%)`
          }}
        >
          <div className="relative">
            {/* 3D Crest Base */}
            <div className="absolute inset-0 text-black opacity-20 transform translate-x-2 translate-y-2">
              🛡️
            </div>
            {/* Crest with Premium Gradient */}
            <div 
              className="relative bg-gradient-to-br from-emerald-400 via-yellow-300 to-slate-300 bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, 
                  hsl(168, 100%, 36%) 0%, 
                  hsl(43, 100%, 70%) 30%,
                  hsl(0, 0%, 85%) 60%,
                  hsl(168, 80%, 45%) 100%
                )`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              🛡️
            </div>
          </div>
        </div>
      )}

      {/* Premium YaadFlex Logo Text */}
      <div className="relative">
        
        {/* 3D Shadow Layer - Deep Obsidian */}
        <div 
          className={`absolute ${sizeClasses[size]} font-black transform translate-x-3 translate-y-3 text-black opacity-30 blur-sm`}
          style={{ 
            transform: `translate(${3 + Math.sin(glowIntensity/10)}px, ${3 + Math.cos(glowIntensity/10)}px)` 
          }}
        >
          YaadFlex
        </div>
        
        {/* Mid-layer Glow - Platinum */}
        <div 
          className={`absolute ${sizeClasses[size]} font-black transform translate-x-1 translate-y-1 opacity-60`}
          style={{ 
            color: 'hsl(0, 0%, 85%)',
            textShadow: `0 0 20px hsl(0, 0%, 85%), 0 0 40px hsl(0, 0%, 75%)`,
            transform: `translate(${1 + Math.sin(glowIntensity/15)}px, ${1 + Math.cos(glowIntensity/15)}px)`
          }}
        >
          YaadFlex
        </div>

        {/* Main Logo - 3D Embossed Metallic Gradient */}
        <div 
          className={`relative ${sizeClasses[size]} font-black cursor-pointer transition-all duration-500 transform ${
            isHovered ? 'scale-105 -translate-y-1' : 'scale-100'
          }`}
          style={{
            background: `linear-gradient(145deg, 
              hsl(240, 5%, 4%) 0%,
              hsl(0, 0%, 85%) 25%,
              hsl(168, 100%, 36%) 50%,
              hsl(43, 100%, 70%) 75%,
              hsl(0, 0%, 96%) 100%
            )`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 200%',
            backgroundPosition: `${glowIntensity}% ${glowIntensity}%`,
            filter: `drop-shadow(0 0 ${5 + glowIntensity/20}px hsl(168, 100%, 36%)) drop-shadow(0 0 ${10 + glowIntensity/10}px hsl(43, 100%, 70%))`,
            textShadow: `
              0 1px 0 hsl(240, 5%, 4%),
              0 2px 0 hsl(240, 8%, 8%),
              0 3px 0 hsl(240, 8%, 12%),
              0 4px 8px rgba(0, 0, 0, 0.8),
              0 0 10px hsl(168, 100%, 36%),
              0 0 20px hsl(43, 100%, 70%)
            `
          }}
        >
          YaadFlex
        </div>

        {/* Highlight Reflection */}
        <div 
          className={`absolute top-0 left-0 ${sizeClasses[size]} font-black opacity-40 pointer-events-none`}
          style={{
            background: `linear-gradient(45deg, 
              transparent 0%,
              hsl(0, 0%, 100%) 20%,
              transparent 40%,
              hsl(168, 100%, 80%) 60%,
              transparent 80%,
              hsl(43, 100%, 90%) 100%
            )`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '300% 300%',
            backgroundPosition: `${glowIntensity * 3}% ${glowIntensity * 2}%`,
            animation: isHovered ? 'logoShimmer 2s ease-in-out infinite' : 'none'
          }}
        >
          YaadFlex
        </div>

        {/* BlackRock Corporate Branding */}
        {showBlackrockBranding && (
          <div 
            className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 ${blackrockSize[size]} font-semibold opacity-80 transition-all duration-500 ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-80'
            }`}
            style={{
              background: `linear-gradient(90deg, 
                hsl(240, 5%, 15%) 0%,
                hsl(0, 0%, 75%) 50%,
                hsl(240, 5%, 15%) 100%
              )`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `0 0 8px hsl(0, 0%, 60%)`,
              letterSpacing: '0.1em'
            }}
            data-testid="blackrock-branding"
          >
            A BLACKROCK COMPANY
          </div>
        )}
      </div>

      {/* Caribbean Flag Elements */}
      <div className={`flex flex-col gap-1 ${
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'
      }`}>
        <div 
          className="transform transition-all duration-500"
          style={{
            filter: `drop-shadow(0 0 ${5 + glowIntensity/20}px hsl(168, 100%, 36%))`,
            transform: isHovered ? 'scale-110 rotate-6' : 'scale-100'
          }}
        >
          🇯🇲
        </div>
        {size !== 'sm' && (
          <div 
            className="transform transition-all duration-700 delay-100"
            style={{
              filter: `drop-shadow(0 0 ${5 + glowIntensity/20}px hsl(43, 100%, 70%))`,
              transform: isHovered ? 'scale-110 rotate-12' : 'scale-100'
            }}
          >
            🌟
          </div>
        )}
      </div>

      {/* Particle Effects */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-ping"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + i * 5}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}