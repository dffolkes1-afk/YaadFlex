import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ================== GLAMOROUS SECTION VARIANTS ==================

const glamorousSectionVariants = cva(
  "relative overflow-hidden transition-all duration-500 transform-gpu will-change-transform",
  {
    variants: {
      variant: {
        luxury: "bg-gradient-to-br from-emerald-50/50 via-white/80 to-gold-50/50 dark:from-emerald-950/20 dark:via-slate-900/80 dark:to-gold-950/20",
        premium: "bg-gradient-to-br from-gold-50/60 via-amber-50/40 to-orange-50/60 dark:from-gold-950/30 dark:via-amber-950/20 dark:to-orange-950/30",
        glass: "bg-white/5 backdrop-blur-xl border-y border-white/10",
        gradient: "bg-gradient-to-br from-emerald-500/10 via-gold-500/10 via-rose-500/10 to-purple-500/10",
        heroic: "bg-gradient-to-br from-slate-900 via-emerald-900/20 to-gold-900/20 text-white",
        spotlight: "bg-radial-gradient from-emerald-50 via-white to-gold-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-gold-950/40",
        floating: "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg",
        neon: "bg-slate-900 border-y-2 border-cyan-400/30",
        holographic: "bg-gradient-to-br from-emerald-400/10 via-gold-400/10 via-rose-400/10 to-purple-400/10 backdrop-blur-md",
        minimal: "bg-background",
        corporate: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
      },
      size: {
        sm: "py-8 px-4",
        default: "py-16 px-6 lg:px-8",
        lg: "py-24 px-6 lg:px-8",
        xl: "py-32 px-6 lg:px-8",
        hero: "py-40 px-6 lg:px-8 min-h-screen flex items-center",
      },
      spacing: {
        tight: "max-w-4xl mx-auto",
        default: "max-w-6xl mx-auto",
        wide: "max-w-7xl mx-auto",
        full: "w-full",
        contained: "container mx-auto",
      },
      glow: {
        none: "",
        subtle: "shadow-lg",
        medium: "shadow-xl",
        intense: "shadow-2xl shadow-emerald-500/10",
        extreme: "shadow-2xl shadow-emerald-500/20 animate-pulse-glow",
      },
    },
    defaultVariants: {
      variant: "luxury",
      size: "default",
      spacing: "default",
      glow: "subtle",
    },
  }
)

// ================== AMBIENT ORBS COMPONENT ==================

interface AmbientOrbsProps {
  intensity: 'subtle' | 'medium' | 'bold';
  enabled: boolean;
  colorScheme: 'emerald' | 'gold' | 'rose' | 'multi' | 'neon';
}

function AmbientOrbs({ intensity, enabled, colorScheme }: AmbientOrbsProps) {
  if (!enabled) return null;
  
  const getOrbCount = () => {
    switch (intensity) {
      case 'subtle': return 2;
      case 'medium': return 4;
      case 'bold': return 6;
      default: return 2;
    }
  };
  
  const getOrbColors = () => {
    const schemes = {
      emerald: ['from-emerald-400/30 to-emerald-600/20'],
      gold: ['from-gold-400/30 to-amber-600/20'],
      rose: ['from-rose-400/30 to-pink-600/20'],
      neon: ['from-cyan-400/30 to-blue-600/20'],
      multi: [
        'from-emerald-400/30 to-emerald-600/20',
        'from-gold-400/30 to-amber-600/20',
        'from-rose-400/30 to-pink-600/20',
        'from-purple-400/30 to-indigo-600/20',
        'from-cyan-400/30 to-blue-600/20',
        'from-orange-400/30 to-red-600/20'
      ]
    };
    return schemes[colorScheme];
  };
  
  const orbCount = getOrbCount();
  const colors = getOrbColors();
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(orbCount)].map((_, i) => {
        const size = Math.random() * 200 + 150;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 10 + 8;
        const delay = Math.random() * 5;
        const colorIndex = i % colors.length;
        
        return (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br ${colors[colorIndex]} blur-3xl animate-pulse opacity-60`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${x}%`,
              top: `${y}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

// ================== FLOATING GEOMETRIC SHAPES ==================

interface FloatingShapesProps {
  enabled: boolean;
  intensity: 'subtle' | 'medium' | 'bold';
  shapes: 'geometric' | 'organic' | 'luxury' | 'tech';
}

function FloatingShapes({ enabled, intensity, shapes }: FloatingShapesProps) {
  if (!enabled) return null;
  
  const getShapeCount = () => {
    switch (intensity) {
      case 'subtle': return 3;
      case 'medium': return 6;
      case 'bold': return 10;
      default: return 3;
    }
  };
  
  const getShapeElements = () => {
    const shapeTypes = {
      geometric: ['◆', '▲', '●', '■', '◇', '△', '○', '□'],
      organic: ['✦', '❋', '✧', '❊', '✤', '❅', '✱', '❆'],
      luxury: ['💎', '👑', '💰', '🏆', '💍', '⭐', '🌟', '✨'],
      tech: ['⚡', '🔮', '🌐', '⚙️', '🔳', '🔹', '🔶', '🔸'],
    };
    return shapeTypes[shapes];
  };
  
  const shapeCount = getShapeCount();
  const elements = getShapeElements();
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity duration-1000">
      {[...Array(shapeCount)].map((_, i) => {
        const element = elements[i % elements.length];
        const size = Math.random() * 20 + 10;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 8;
        const rotation = Math.random() * 360;
        
        return (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {element}
          </div>
        );
      })}
    </div>
  );
}

// ================== LUXURY PATTERN OVERLAY ==================

interface LuxuryPatternProps {
  pattern: 'none' | 'dots' | 'grid' | 'waves' | 'hexagon' | 'diamond' | 'yf-brand';
  intensity: 'subtle' | 'medium' | 'bold';
}

function LuxuryPattern({ pattern, intensity }: LuxuryPatternProps) {
  if (pattern === 'none') return null;
  
  const getOpacity = () => {
    switch (intensity) {
      case 'subtle': return 'opacity-5';
      case 'medium': return 'opacity-10';
      case 'bold': return 'opacity-20';
      default: return 'opacity-5';
    }
  };
  
  const patterns = {
    dots: (
      <div 
        className={`absolute inset-0 ${getOpacity()}`}
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    ),
    grid: (
      <div 
        className={`absolute inset-0 ${getOpacity()}`}
        style={{
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    ),
    waves: (
      <div className={`absolute inset-0 ${getOpacity()}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="waves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 Q5,0 10,10 T20,10" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>
    ),
    hexagon: (
      <div 
        className={`absolute inset-0 ${getOpacity()}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    ),
    diamond: (
      <div 
        className={`absolute inset-0 ${getOpacity()}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M20 20l10-10V0L20 10 10 0v10l10 10zm0 0l10 10v10L20 30 10 40V30l10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    ),
    'yf-brand': (
      <div className={`absolute inset-0 ${getOpacity()}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-32 transform rotate-12 scale-150">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className="text-4xl font-black opacity-30 animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                YF
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  };
  
  return patterns[pattern];
}

// ================== SPOTLIGHT EFFECT ==================

interface SpotlightProps {
  enabled: boolean;
  color: 'emerald' | 'gold' | 'rose' | 'white';
  intensity: 'subtle' | 'medium' | 'bold';
  position: 'top' | 'center' | 'bottom' | 'left' | 'right';
}

function Spotlight({ enabled, color, intensity, position }: SpotlightProps) {
  if (!enabled) return null;
  
  const getColorClasses = () => {
    const colors = {
      emerald: 'from-emerald-400/30 via-emerald-200/10 to-transparent',
      gold: 'from-gold-400/30 via-amber-200/10 to-transparent',
      rose: 'from-rose-400/30 via-pink-200/10 to-transparent',
      white: 'from-white/30 via-white/10 to-transparent',
    };
    return colors[color];
  };
  
  const getPositionClasses = () => {
    const positions = {
      top: 'bg-radial-gradient top-0',
      center: 'bg-radial-gradient top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      bottom: 'bg-radial-gradient bottom-0',
      left: 'bg-radial-gradient left-0 top-1/2 transform -translate-y-1/2',
      right: 'bg-radial-gradient right-0 top-1/2 transform -translate-y-1/2',
    };
    return positions[position];
  };
  
  const getSize = () => {
    switch (intensity) {
      case 'subtle': return 'w-96 h-96';
      case 'medium': return 'w-[600px] h-[600px]';
      case 'bold': return 'w-[800px] h-[800px]';
      default: return 'w-96 h-96';
    }
  };
  
  return (
    <div 
      className={`absolute ${getSize()} rounded-full bg-gradient-radial ${getColorClasses()} ${getPositionClasses()} pointer-events-none blur-3xl`}
    />
  );
}

// ================== MAIN GLAMOROUS SECTION COMPONENT ==================

export interface GlamorousSectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof glamorousSectionVariants> {
  as?: 'section' | 'div' | 'header' | 'footer' | 'main';
  ambientOrbs?: boolean;
  orbIntensity?: 'subtle' | 'medium' | 'bold';
  orbColorScheme?: 'emerald' | 'gold' | 'rose' | 'multi' | 'neon';
  floatingShapes?: boolean;
  shapeIntensity?: 'subtle' | 'medium' | 'bold';
  shapeType?: 'geometric' | 'organic' | 'luxury' | 'tech';
  luxuryPattern?: 'none' | 'dots' | 'grid' | 'waves' | 'hexagon' | 'diamond' | 'yf-brand';
  patternIntensity?: 'subtle' | 'medium' | 'bold';
  spotlight?: boolean;
  spotlightColor?: 'emerald' | 'gold' | 'rose' | 'white';
  spotlightIntensity?: 'subtle' | 'medium' | 'bold';
  spotlightPosition?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  entrance?: 'none' | 'fade' | 'slide' | 'scale' | 'reveal';
  parallax?: boolean;
  'data-testid'?: string;
}

const GlamorousSection = React.forwardRef<any, GlamorousSectionProps>(
  ({ 
    className,
    as: Component = 'section',
    variant,
    size,
    spacing,
    glow,
    ambientOrbs = false,
    orbIntensity = 'medium',
    orbColorScheme = 'multi',
    floatingShapes = false,
    shapeIntensity = 'medium',
    shapeType = 'luxury',
    luxuryPattern = 'none',
    patternIntensity = 'subtle',
    spotlight = false,
    spotlightColor = 'emerald',
    spotlightIntensity = 'medium',
    spotlightPosition = 'center',
    entrance = 'none',
    parallax = false,
    'data-testid': testId,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [scrollY, setScrollY] = React.useState(0);
    const sectionRef = React.useRef<any>(null);
    
    React.useImperativeHandle(ref, () => sectionRef.current!);
    
    // Intersection Observer for entrance animations
    React.useEffect(() => {
      if (entrance === 'none') {
        setIsVisible(true);
        return;
      }
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );
      
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
      
      return () => observer.disconnect();
    }, [entrance]);
    
    // Parallax scroll effect
    React.useEffect(() => {
      if (!parallax) return;
      
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [parallax]);
    
    const getEntranceClasses = () => {
      if (entrance === 'none' || !isVisible) return '';
      
      const entranceAnimations = {
        fade: 'animate-in fade-in duration-1000',
        slide: 'animate-in slide-in-from-bottom-8 duration-1000',
        scale: 'animate-in zoom-in-95 duration-1000',
        reveal: 'animate-in slide-in-from-left-full duration-1200',
      };
      
      return entranceAnimations[entrance] || '';
    };
    
    const sectionClasses = cn(
      glamorousSectionVariants({ variant, size, spacing, glow }),
      getEntranceClasses(),
      !isVisible && entrance !== 'none' && 'opacity-0',
      'group',
      className
    );
    
    const parallaxStyle = parallax ? {
      transform: `translateY(${scrollY * 0.05}px)`,
    } : {};
    
    return (
      <Component
        className={sectionClasses}
        ref={sectionRef}
        style={parallaxStyle}
        data-testid={testId}
        {...props}
      >
        {/* Spotlight Effect */}
        <Spotlight 
          enabled={spotlight}
          color={spotlightColor}
          intensity={spotlightIntensity}
          position={spotlightPosition}
        />
        
        {/* Luxury Pattern Overlay */}
        <LuxuryPattern pattern={luxuryPattern} intensity={patternIntensity} />
        
        {/* Ambient Orbs */}
        <AmbientOrbs 
          enabled={ambientOrbs}
          intensity={orbIntensity}
          colorScheme={orbColorScheme}
        />
        
        {/* Floating Shapes */}
        <FloatingShapes 
          enabled={floatingShapes}
          intensity={shapeIntensity}
          shapes={shapeType}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* YF Branding for luxury variants */}
        {(variant === 'luxury' || variant === 'premium' || variant === 'heroic') && (
          <div className="absolute bottom-4 right-4 text-xs font-bold text-current opacity-5 pointer-events-none select-none">
            YF ✨
          </div>
        )}
      </Component>
    );
  }
);

GlamorousSection.displayName = "GlamorousSection";

// ================== PRESET CONFIGURATIONS ==================

export const GlamorousSectionPresets = {
  // Hero sections
  luxuryHero: {
    variant: 'heroic' as const,
    size: 'hero' as const,
    spacing: 'wide' as const,
    glow: 'intense' as const,
    ambientOrbs: true,
    orbIntensity: 'bold' as const,
    orbColorScheme: 'multi' as const,
    floatingShapes: true,
    shapeIntensity: 'medium' as const,
    shapeType: 'luxury' as const,
    spotlight: true,
    spotlightColor: 'emerald' as const,
    spotlightIntensity: 'bold' as const,
    entrance: 'fade' as const,
    parallax: true,
    'data-testid': 'section-luxury-hero',
  },
  
  premiumShowcase: {
    variant: 'premium' as const,
    size: 'lg' as const,
    spacing: 'default' as const,
    glow: 'medium' as const,
    ambientOrbs: true,
    orbIntensity: 'medium' as const,
    orbColorScheme: 'gold' as const,
    luxuryPattern: 'yf-brand' as const,
    patternIntensity: 'subtle' as const,
    entrance: 'scale' as const,
    'data-testid': 'section-premium-showcase',
  },
  
  glassElegant: {
    variant: 'glass' as const,
    size: 'default' as const,
    spacing: 'default' as const,
    glow: 'subtle' as const,
    floatingShapes: true,
    shapeIntensity: 'subtle' as const,
    shapeType: 'geometric' as const,
    entrance: 'fade' as const,
    'data-testid': 'section-glass-elegant',
  },
  
  gradientSpectacular: {
    variant: 'gradient' as const,
    size: 'lg' as const,
    spacing: 'wide' as const,
    glow: 'extreme' as const,
    ambientOrbs: true,
    orbIntensity: 'bold' as const,
    orbColorScheme: 'multi' as const,
    floatingShapes: true,
    shapeIntensity: 'bold' as const,
    shapeType: 'luxury' as const,
    luxuryPattern: 'diamond' as const,
    patternIntensity: 'medium' as const,
    entrance: 'reveal' as const,
    parallax: true,
    'data-testid': 'section-gradient-spectacular',
  },
  
  spotlightFeature: {
    variant: 'spotlight' as const,
    size: 'lg' as const,
    spacing: 'default' as const,
    glow: 'medium' as const,
    spotlight: true,
    spotlightColor: 'emerald' as const,
    spotlightIntensity: 'medium' as const,
    spotlightPosition: 'center' as const,
    floatingShapes: true,
    shapeIntensity: 'medium' as const,
    shapeType: 'organic' as const,
    entrance: 'slide' as const,
    'data-testid': 'section-spotlight-feature',
  },
  
  floatingMagic: {
    variant: 'floating' as const,
    size: 'default' as const,
    spacing: 'default' as const,
    glow: 'medium' as const,
    ambientOrbs: true,
    orbIntensity: 'medium' as const,
    orbColorScheme: 'emerald' as const,
    floatingShapes: true,
    shapeIntensity: 'medium' as const,
    shapeType: 'luxury' as const,
    entrance: 'scale' as const,
    'data-testid': 'section-floating-magic',
  },
  
  neonCyber: {
    variant: 'neon' as const,
    size: 'default' as const,
    spacing: 'default' as const,
    glow: 'extreme' as const,
    ambientOrbs: true,
    orbIntensity: 'medium' as const,
    orbColorScheme: 'neon' as const,
    floatingShapes: true,
    shapeIntensity: 'medium' as const,
    shapeType: 'tech' as const,
    luxuryPattern: 'grid' as const,
    patternIntensity: 'medium' as const,
    entrance: 'slide' as const,
    'data-testid': 'section-neon-cyber',
  },
  
  holographicFuture: {
    variant: 'holographic' as const,
    size: 'lg' as const,
    spacing: 'wide' as const,
    glow: 'intense' as const,
    ambientOrbs: true,
    orbIntensity: 'bold' as const,
    orbColorScheme: 'multi' as const,
    floatingShapes: true,
    shapeIntensity: 'bold' as const,
    shapeType: 'luxury' as const,
    luxuryPattern: 'hexagon' as const,
    patternIntensity: 'medium' as const,
    entrance: 'reveal' as const,
    parallax: true,
    'data-testid': 'section-holographic-future',
  },
  
  // Professional fallbacks
  corporateClean: {
    variant: 'corporate' as const,
    size: 'default' as const,
    spacing: 'default' as const,
    glow: 'none' as const,
    entrance: 'fade' as const,
    'data-testid': 'section-corporate-clean',
  },
  
  minimalProfessional: {
    variant: 'minimal' as const,
    size: 'default' as const,
    spacing: 'default' as const,
    glow: 'none' as const,
    entrance: 'none' as const,
    'data-testid': 'section-minimal-professional',
  },
};

// ================== HELPER FUNCTIONS ==================

export function createGlamorousSection(preset: keyof typeof GlamorousSectionPresets) {
  return function PresetGlamorousSection(props: Omit<GlamorousSectionProps, keyof typeof GlamorousSectionPresets[typeof preset]>) {
    return <GlamorousSection {...GlamorousSectionPresets[preset]} {...props} />;
  };
}

// Pre-built preset components
export const LuxuryHeroSection = createGlamorousSection('luxuryHero');
export const PremiumSection = createGlamorousSection('premiumShowcase');
export const GlassSection = createGlamorousSection('glassElegant');
export const GradientSection = createGlamorousSection('gradientSpectacular');
export const SpotlightSection = createGlamorousSection('spotlightFeature');
export const FloatingSection = createGlamorousSection('floatingMagic');
export const NeonSection = createGlamorousSection('neonCyber');
export const HolographicSection = createGlamorousSection('holographicFuture');
export const CorporateSection = createGlamorousSection('corporateClean');
export const MinimalSection = createGlamorousSection('minimalProfessional');

export { GlamorousSection, glamorousSectionVariants };