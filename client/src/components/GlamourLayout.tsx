import { useEffect, useState, ReactNode } from 'react';
import { YFBackgroundSystem } from './YFBackgroundSystem';

// ================== TYPES & INTERFACES ==================

interface GlamourLayoutProps {
  children: ReactNode;
  
  // Intensity Control
  intensity?: 'subtle' | 'medium' | 'bold';
  
  // Background & Style
  backgroundStyle?: 'corporate' | 'luxury' | 'tech' | 'caribbean' | 'classic' | 'textured' | 'old-english' | 'default';
  useWallpaper?: boolean;
  wallpaperOpacity?: number;
  
  // Floating Effects
  enableParticles?: boolean;
  enableFloatingElements?: boolean;
  enableAmbientLighting?: boolean;
  
  // Watermark & Branding
  showYFWatermark?: boolean;
  watermarkPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  watermarkOpacity?: number;
  
  // SEO & Meta
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  
  // Layout & Behavior
  className?: string;
  enableScrollEffects?: boolean;
  enableHoverEffects?: boolean;
  disableOnMobile?: boolean;
}

// ================== FLOATING PARTICLES COMPONENT ==================

interface FloatingParticlesProps {
  intensity: 'subtle' | 'medium' | 'bold';
  disableOnMobile: boolean;
}

function FloatingParticles({ intensity, disableOnMobile }: FloatingParticlesProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (isMobile && disableOnMobile) return null;
  
  const getParticleCount = () => {
    if (isMobile) return intensity === 'bold' ? 8 : 4;
    
    switch (intensity) {
      case 'subtle': return 12;
      case 'medium': return 24;
      case 'bold': return 48;
      default: return 12;
    }
  };
  
  const particleCount = getParticleCount();
  
  return (
    <div className="glamour-particles fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(particleCount)].map((_, i) => {
        const size = Math.random() * (intensity === 'bold' ? 8 : 4) + 2;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        const colors = ['var(--emerald-400)', 'var(--gold-400)', 'var(--rose-400)', 'var(--orange-400)'];
        const color = colors[i % colors.length];
        
        const style = {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          boxShadow: `0 0 ${size * 3}px ${color}`,
          animation: `twinkle ${duration}s ease-in-out infinite ${delay}s`,
        };
        
        return (
          <div
            key={i}
            className="absolute rounded-full opacity-60"
            style={style}
          />
        );
      })}
    </div>
  );
}

// ================== AMBIENT LIGHTING COMPONENT ==================

interface AmbientLightingProps {
  intensity: 'subtle' | 'medium' | 'bold';
  disableOnMobile: boolean;
}

function AmbientLighting({ intensity, disableOnMobile }: AmbientLightingProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  if (isMobile && disableOnMobile) return null;
  
  const getOpacity = () => {
    switch (intensity) {
      case 'subtle': return 0.1;
      case 'medium': return 0.2;
      case 'bold': return 0.35;
      default: return 0.1;
    }
  };
  
  const opacity = getOpacity();
  
  return (
    <div className="glamour-ambient-lighting fixed inset-0 pointer-events-none z-0">
      {/* Primary ambient orbs */}
      <div 
        className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-400/30 to-emerald-600/20 rounded-full blur-3xl animate-pulse"
        style={{ opacity }}
      />
      <div 
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-gold-400/25 to-orange-400/20 rounded-full blur-3xl animate-pulse"
        style={{ opacity, animationDelay: '2s' }}
      />
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-rose-400/20 to-rose-600/15 rounded-full blur-2xl animate-pulse"
        style={{ opacity, animationDelay: '4s' }}
      />
      
      {/* Additional lighting for medium/bold */}
      {intensity !== 'subtle' && (
        <>
          <div 
            className="absolute top-10 right-1/4 w-64 h-64 bg-gradient-to-r from-orange-400/20 to-amber-400/15 rounded-full blur-2xl animate-pulse"
            style={{ opacity: opacity * 0.7, animationDelay: '1s' }}
          />
          <div 
            className="absolute bottom-40 left-1/4 w-56 h-56 bg-gradient-to-r from-emerald-400/15 to-teal-400/10 rounded-full blur-xl animate-pulse"
            style={{ opacity: opacity * 0.8, animationDelay: '3s' }}
          />
        </>
      )}
      
      {/* Intense lighting for bold only */}
      {intensity === 'bold' && (
        <>
          <div 
            className="absolute top-1/4 right-1/6 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-400/15 rounded-full blur-xl animate-pulse"
            style={{ opacity: opacity * 0.6, animationDelay: '5s' }}
          />
          <div 
            className="absolute bottom-1/3 left-1/6 w-52 h-52 bg-gradient-to-r from-cyan-400/15 to-blue-400/10 rounded-full blur-xl animate-pulse"
            style={{ opacity: opacity * 0.5, animationDelay: '6s' }}
          />
        </>
      )}
    </div>
  );
}

// ================== FLOATING ELEMENTS COMPONENT ==================

interface FloatingElementsProps {
  intensity: 'subtle' | 'medium' | 'bold';
  disableOnMobile: boolean;
}

function FloatingElements({ intensity, disableOnMobile }: FloatingElementsProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  if (isMobile && disableOnMobile) return null;
  
  const getElementCount = () => {
    if (isMobile) return 2;
    
    switch (intensity) {
      case 'subtle': return 3;
      case 'medium': return 6;
      case 'bold': return 10;
      default: return 3;
    }
  };
  
  const elementCount = getElementCount();
  
  const elements = [
    { symbol: '💎', size: 'text-2xl', color: 'text-emerald-400' },
    { symbol: '✨', size: 'text-xl', color: 'text-gold-400' },
    { symbol: '🌟', size: 'text-3xl', color: 'text-amber-400' },
    { symbol: '💫', size: 'text-lg', color: 'text-rose-400' },
    { symbol: '⭐', size: 'text-2xl', color: 'text-orange-400' },
    { symbol: '🔮', size: 'text-xl', color: 'text-purple-400' },
    { symbol: '💰', size: 'text-2xl', color: 'text-gold-400' },
    { symbol: '👑', size: 'text-3xl', color: 'text-amber-400' },
    { symbol: '🏆', size: 'text-2xl', color: 'text-gold-400' },
    { symbol: '💍', size: 'text-lg', color: 'text-rose-400' }
  ];
  
  return (
    <div className="glamour-floating-elements fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {elements.slice(0, elementCount).map((element, i) => {
        const duration = Math.random() * 8 + 6;
        const delay = Math.random() * 3;
        const xPosition = Math.random() * 90 + 5;
        const yPosition = Math.random() * 80 + 10;
        
        const style = {
          left: `${xPosition}%`,
          top: `${yPosition}%`,
          animation: `float ${duration}s ease-in-out infinite ${delay}s`,
        };
        
        return (
          <div
            key={i}
            className={`absolute ${element.size} ${element.color} opacity-30 hover:opacity-60 transition-opacity duration-300 drop-shadow-lg`}
            style={style}
          >
            {element.symbol}
          </div>
        );
      })}
    </div>
  );
}

// ================== YF WATERMARK COMPONENT ==================

interface YFWatermarkProps {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  opacity: number;
  intensity: 'subtle' | 'medium' | 'bold';
}

function YFWatermark({ position, opacity, intensity }: YFWatermarkProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right': return 'bottom-6 right-6';
      case 'bottom-left': return 'bottom-6 left-6';
      case 'top-right': return 'top-6 right-6';
      case 'top-left': return 'top-6 left-6';
      case 'center': return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default: return 'bottom-6 right-6';
    }
  };
  
  const getSizeClasses = () => {
    switch (intensity) {
      case 'subtle': return 'text-4xl';
      case 'medium': return 'text-5xl';
      case 'bold': return 'text-6xl';
      default: return 'text-4xl';
    }
  };
  
  return (
    <div 
      className={`yf-luxury-watermark fixed ${getPositionClasses()} pointer-events-none z-0 select-none`}
      style={{ opacity }}
    >
      <div className={`font-black ${getSizeClasses()} bg-gradient-to-r from-emerald-400 via-gold-400 to-rose-400 bg-clip-text text-transparent animate-pulse`}>
        YF
      </div>
      <div className="text-xs font-bold text-muted-foreground/50 text-center tracking-widest mt-1">
        YAADFLEX
      </div>
    </div>
  );
}

// ================== WALLPAPER BACKGROUND COMPONENT ==================

interface WallpaperBackgroundProps {
  style: string;
  opacity: number;
  intensity: 'subtle' | 'medium' | 'bold';
}

function WallpaperBackground({ style, opacity, intensity }: WallpaperBackgroundProps) {
  const getPatternDensity = () => {
    switch (intensity) {
      case 'subtle': return 8;
      case 'medium': return 16;
      case 'bold': return 32;
      default: return 8;
    }
  };
  
  const patternCount = getPatternDensity();
  
  return (
    <div className="glamour-wallpaper fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ opacity }}>
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-slate-900/10 to-amber-900/20" />
      
      {/* YF Monogram Pattern */}
      <div className="absolute inset-0 grid grid-cols-6 lg:grid-cols-8 gap-16 p-8 rotate-12 transform scale-110">
        {[...Array(patternCount)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <span 
              className="text-2xl lg:text-4xl font-black text-emerald-500/10 animate-pulse" 
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              YF
            </span>
          </div>
        ))}
      </div>
      
      {/* YAADFLEX Text Watermarks */}
      <div className="absolute top-20 left-1/4 text-xl lg:text-2xl font-extralight tracking-[0.5em] text-amber-400/05 rotate-45 transform">
        YAADFLEX
      </div>
      <div className="absolute bottom-32 right-1/4 text-xl lg:text-2xl font-extralight tracking-[0.5em] text-emerald-400/05 -rotate-45 transform">
        YAADFLEX
      </div>
      
      {/* Additional elements for medium/bold */}
      {intensity !== 'subtle' && (
        <>
          <div className="absolute top-1/2 left-1/6 text-lg lg:text-xl font-extralight tracking-[0.4em] text-orange-400/05 rotate-12 transform">
            YAADFLEX
          </div>
          <div className="absolute top-1/3 right-1/6 text-lg lg:text-xl font-extralight tracking-[0.4em] text-amber-400/05 -rotate-12 transform">
            YAADFLEX
          </div>
        </>
      )}
    </div>
  );
}

// ================== SEO HEAD COMPONENT ==================

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
}

function SEOHead({ title, description, ogImage, ogType = 'website' }: SEOHeadProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    
    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
    
    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content);
    };
    
    if (title) updateOGTag('og:title', title);
    if (description) updateOGTag('og:description', description);
    if (ogImage) updateOGTag('og:image', ogImage);
    updateOGTag('og:type', ogType);
    updateOGTag('og:site_name', 'YaadFlex');
    
    // Twitter Cards
    const updateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`);
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', name);
        document.head.appendChild(twitterTag);
      }
      twitterTag.setAttribute('content', content);
    };
    
    updateTwitterTag('twitter:card', 'summary_large_image');
    if (title) updateTwitterTag('twitter:title', title);
    if (description) updateTwitterTag('twitter:description', description);
    if (ogImage) updateTwitterTag('twitter:image', ogImage);
    
  }, [title, description, ogImage, ogType]);
  
  return null;
}

// ================== MAIN GLAMOUR LAYOUT COMPONENT ==================

export function GlamourLayout({
  children,
  intensity = 'medium',
  backgroundStyle = 'luxury',
  useWallpaper = true,
  wallpaperOpacity = 0.08,
  enableParticles = true,
  enableFloatingElements = true,
  enableAmbientLighting = true,
  showYFWatermark = true,
  watermarkPosition = 'bottom-right',
  watermarkOpacity = 0.15,
  title,
  description,
  ogImage,
  ogType = 'website',
  className = '',
  enableScrollEffects = true,
  enableHoverEffects = true,
  disableOnMobile = false,
}: GlamourLayoutProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      if (enableScrollEffects) {
        setScrollY(window.scrollY);
      }
    };
    
    window.addEventListener('resize', handleResize);
    if (enableScrollEffects) {
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (enableScrollEffects) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [enableScrollEffects]);
  
  // Disable effects on mobile if requested
  const shouldDisableEffects = isMobile && disableOnMobile;
  
  const containerClasses = [
    'glamour-layout-container',
    'relative',
    'min-h-screen',
    'overflow-x-hidden',
    className,
    // Add intensity-based classes
    intensity === 'bold' ? 'glamour-bold' : intensity === 'medium' ? 'glamour-medium' : 'glamour-subtle',
    // Add hover effects
    enableHoverEffects ? 'glamour-hover-effects' : '',
  ].filter(Boolean).join(' ');
  
  const scrollEffectStyle = enableScrollEffects ? {
    transform: `translateY(${scrollY * 0.1}px)`,
  } : {};
  
  return (
    <>
      {/* SEO Head */}
      <SEOHead 
        title={title} 
        description={description} 
        ogImage={ogImage} 
        ogType={ogType} 
      />
      
      <YFBackgroundSystem style={backgroundStyle} className={containerClasses}>
        {/* Wallpaper Background */}
        {useWallpaper && !shouldDisableEffects && (
          <WallpaperBackground 
            style={backgroundStyle}
            opacity={wallpaperOpacity}
            intensity={intensity}
          />
        )}
        
        {/* Ambient Lighting */}
        {enableAmbientLighting && !shouldDisableEffects && (
          <AmbientLighting 
            intensity={intensity} 
            disableOnMobile={disableOnMobile}
          />
        )}
        
        {/* Floating Particles */}
        {enableParticles && !shouldDisableEffects && (
          <FloatingParticles 
            intensity={intensity} 
            disableOnMobile={disableOnMobile}
          />
        )}
        
        {/* Floating Elements */}
        {enableFloatingElements && !shouldDisableEffects && (
          <FloatingElements 
            intensity={intensity} 
            disableOnMobile={disableOnMobile}
          />
        )}
        
        {/* YF Watermark */}
        {showYFWatermark && !shouldDisableEffects && (
          <YFWatermark 
            position={watermarkPosition}
            opacity={watermarkOpacity}
            intensity={intensity}
          />
        )}
        
        {/* Main Content */}
        <div 
          className="relative z-20" 
          style={scrollEffectStyle}
        >
          {children}
        </div>
      </YFBackgroundSystem>
    </>
  );
}

// ================== PRESET CONFIGURATIONS ==================

export const GlamourPresets = {
  subtle: {
    intensity: 'subtle' as const,
    wallpaperOpacity: 0.03,
    watermarkOpacity: 0.08,
    enableParticles: true,
    enableFloatingElements: false,
    enableAmbientLighting: true,
  },
  
  medium: {
    intensity: 'medium' as const,
    wallpaperOpacity: 0.08,
    watermarkOpacity: 0.15,
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true,
  },
  
  bold: {
    intensity: 'bold' as const,
    wallpaperOpacity: 0.15,
    watermarkOpacity: 0.25,
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true,
  },
  
  corporate: {
    intensity: 'subtle' as const,
    backgroundStyle: 'corporate' as const,
    wallpaperOpacity: 0.05,
    watermarkOpacity: 0.1,
    enableParticles: false,
    enableFloatingElements: false,
    enableAmbientLighting: true,
  },
  
  party: {
    intensity: 'bold' as const,
    backgroundStyle: 'caribbean' as const,
    wallpaperOpacity: 0.2,
    watermarkOpacity: 0.3,
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true,
  }
};

// ================== UTILITY FUNCTION ==================

export function withGlamour<T extends {}>(
  Component: React.ComponentType<T>,
  glamourProps?: Partial<GlamourLayoutProps>
) {
  return function GlamourWrappedComponent(props: T) {
    return (
      <GlamourLayout {...glamourProps}>
        <Component {...props} />
      </GlamourLayout>
    );
  };
}