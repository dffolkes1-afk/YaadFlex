import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ================== GLAMOROUS CARD VARIANTS ==================

const glamorousCardVariants = cva(
  "relative overflow-hidden rounded-xl transition-all duration-300 transform-gpu will-change-transform group",
  {
    variants: {
      variant: {
        luxury: "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-emerald-500/20 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]",
        premium: "bg-gradient-to-br from-gold-50/80 to-amber-50/60 backdrop-blur-md border border-gold-200/50 shadow-xl hover:shadow-gold-500/25 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]",
        glass: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/10 hover:border-white/20 hover:shadow-white/10 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]",
        gradient: "bg-gradient-to-br from-emerald-500/20 via-gold-500/20 to-rose-500/20 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.03]",
        floating: "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg border border-white/25 shadow-2xl hover:shadow-emerald-500/30 hover:shadow-3xl hover:-translate-y-4 hover:scale-[1.05] animate-float",
        neon: "bg-black/40 backdrop-blur-md border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/25 hover:border-cyan-300 hover:shadow-cyan-500/50 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]",
        holographic: "bg-gradient-to-br from-emerald-400/20 via-gold-400/20 via-rose-400/20 to-purple-400/20 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.03] holographic",
        depth3d: "bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-3xl depth-3d hover:-translate-y-2 hover:scale-[1.02]",
        corporate: "bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      glow: {
        none: "",
        subtle: "hover:drop-shadow-lg",
        medium: "hover:drop-shadow-xl",
        intense: "hover:drop-shadow-2xl",
        extreme: "drop-shadow-lg hover:drop-shadow-2xl animate-pulse-glow",
      },
      shine: {
        none: "",
        subtle: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000 before:ease-out",
        medium: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000 before:ease-out",
        intense: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000 before:ease-out",
      },
    },
    defaultVariants: {
      variant: "luxury",
      size: "default",
      glow: "medium",
      shine: "medium",
    },
  }
)

// ================== AMBIENT PARTICLES COMPONENT ==================

interface AmbientParticlesProps {
  intensity: 'subtle' | 'medium' | 'bold';
  enabled: boolean;
}

function AmbientParticles({ intensity, enabled }: AmbientParticlesProps) {
  if (!enabled) return null;
  
  const getParticleCount = () => {
    switch (intensity) {
      case 'subtle': return 3;
      case 'medium': return 6;
      case 'bold': return 10;
      default: return 3;
    }
  };
  
  const particles = ['✨', '💎', '⭐', '🌟', '💫', '✴️', '💰', '👑', '🏆', '💍'];
  const particleCount = getParticleCount();
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 group-hover:opacity-40 transition-opacity duration-500">
      {particles.slice(0, particleCount).map((particle, i) => (
        <div
          key={i}
          className="absolute text-xs animate-float"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + i * 0.5}s`,
          }}
        >
          {particle}
        </div>
      ))}
    </div>
  );
}

// ================== GLOW BORDER COMPONENT ==================

interface GlowBorderProps {
  variant: 'emerald' | 'gold' | 'rose' | 'cyan' | 'gradient';
  intensity: 'subtle' | 'medium' | 'intense';
  enabled: boolean;
}

function GlowBorder({ variant, intensity, enabled }: GlowBorderProps) {
  if (!enabled) return null;
  
  const getGlowClasses = () => {
    const baseClasses = "absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300";
    
    const variants = {
      emerald: "border-2 border-emerald-400/50 shadow-emerald-500/25",
      gold: "border-2 border-gold-400/50 shadow-gold-500/25", 
      rose: "border-2 border-rose-400/50 shadow-rose-500/25",
      cyan: "border-2 border-cyan-400/50 shadow-cyan-500/25",
      gradient: "border-2 border-transparent bg-gradient-to-r from-emerald-400/50 via-gold-400/50 to-rose-400/50 bg-clip-border",
    };
    
    const intensities = {
      subtle: "shadow-md",
      medium: "shadow-lg", 
      intense: "shadow-2xl",
    };
    
    return cn(baseClasses, variants[variant], intensities[intensity]);
  };
  
  return <div className={getGlowClasses()} />;
}

// ================== LUXURY BACKGROUND COMPONENT ==================

interface LuxuryBackgroundProps {
  pattern: 'dots' | 'grid' | 'waves' | 'orbs' | 'none';
  intensity: 'subtle' | 'medium' | 'bold';
}

function LuxuryBackground({ pattern, intensity }: LuxuryBackgroundProps) {
  if (pattern === 'none') return null;
  
  const getOpacity = () => {
    switch (intensity) {
      case 'subtle': return 'opacity-10';
      case 'medium': return 'opacity-20';
      case 'bold': return 'opacity-30';
      default: return 'opacity-10';
    }
  };
  
  const patterns = {
    dots: (
      <div className={`absolute inset-0 ${getOpacity()}`}>
        <div className="absolute inset-0 bg-radial-gradient bg-repeat" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>
    ),
    grid: (
      <div className={`absolute inset-0 ${getOpacity()}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>
    ),
    waves: (
      <div className={`absolute inset-0 ${getOpacity()}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,20 50,50 T100,50 V100 H0 V50" fill="currentColor" fillOpacity="0.1" />
        </svg>
      </div>
    ),
    orbs: (
      <div className={`absolute inset-0 ${getOpacity()}`}>
        <div className="absolute top-4 right-4 w-16 h-16 bg-emerald-400 rounded-full blur-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-gold-400 rounded-full blur-lg" />
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-rose-400 rounded-full blur-md transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    ),
  };
  
  return patterns[pattern];
}

// ================== MAIN GLAMOROUS CARD COMPONENT ==================

export interface GlamorousCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glamorousCardVariants> {
  ambientParticles?: boolean;
  particleIntensity?: 'subtle' | 'medium' | 'bold';
  glowBorder?: boolean;
  glowVariant?: 'emerald' | 'gold' | 'rose' | 'cyan' | 'gradient';
  glowIntensity?: 'subtle' | 'medium' | 'intense';
  backgroundPattern?: 'dots' | 'grid' | 'waves' | 'orbs' | 'none';
  backgroundIntensity?: 'subtle' | 'medium' | 'bold';
  entrance?: 'none' | 'fade' | 'slide' | 'scale' | 'float';
  'data-testid'?: string;
}

const GlamorousCard = React.forwardRef<HTMLDivElement, GlamorousCardProps>(
  ({ 
    className, 
    variant,
    size,
    glow,
    shine,
    ambientParticles = false,
    particleIntensity = 'medium',
    glowBorder = false,
    glowVariant = 'emerald',
    glowIntensity = 'medium',
    backgroundPattern = 'none',
    backgroundIntensity = 'subtle',
    entrance = 'none',
    'data-testid': testId,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);
    
    React.useImperativeHandle(ref, () => cardRef.current!);
    
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
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      if (cardRef.current) {
        observer.observe(cardRef.current);
      }
      
      return () => observer.disconnect();
    }, [entrance]);
    
    const getEntranceClasses = () => {
      if (entrance === 'none' || !isVisible) return '';
      
      const entranceAnimations = {
        fade: 'animate-in fade-in duration-700',
        slide: 'animate-in slide-in-from-bottom-4 duration-700',
        scale: 'animate-in zoom-in-95 duration-700',
        float: 'animate-in slide-in-from-bottom-8 fade-in duration-1000',
      };
      
      return entranceAnimations[entrance] || '';
    };
    
    const cardClasses = cn(
      glamorousCardVariants({ variant, size, glow, shine }),
      getEntranceClasses(),
      !isVisible && entrance !== 'none' && 'opacity-0',
      className
    );
    
    return (
      <div
        className={cardClasses}
        ref={cardRef}
        data-testid={testId}
        {...props}
      >
        {/* Background Pattern */}
        <LuxuryBackground pattern={backgroundPattern} intensity={backgroundIntensity} />
        
        {/* Ambient Particles */}
        <AmbientParticles intensity={particleIntensity} enabled={ambientParticles} />
        
        {/* Glow Border */}
        <GlowBorder variant={glowVariant} intensity={glowIntensity} enabled={glowBorder} />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* YF Branding Watermark for luxury variants */}
        {(variant === 'luxury' || variant === 'premium' || variant === 'gradient') && (
          <div className="absolute bottom-2 right-2 text-xs font-bold text-current opacity-5 pointer-events-none select-none">
            YF
          </div>
        )}
      </div>
    );
  }
);

GlamorousCard.displayName = "GlamorousCard";

// ================== CARD HEADER COMPONENT ==================

export interface GlamorousCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  'data-testid'?: string;
}

const GlamorousCardHeader = React.forwardRef<HTMLDivElement, GlamorousCardHeaderProps>(
  ({ className, gradient = false, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-2 p-0 pb-4",
        gradient && "bg-gradient-to-r from-emerald-500/10 via-gold-500/10 to-rose-500/10 -m-6 p-6 mb-2 rounded-t-xl",
        className
      )}
      data-testid={testId}
      {...props}
    />
  )
);
GlamorousCardHeader.displayName = "GlamorousCardHeader";

// ================== CARD TITLE COMPONENT ==================

export interface GlamorousCardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  glamour?: boolean;
  'data-testid'?: string;
}

const GlamorousCardTitle = React.forwardRef<HTMLDivElement, GlamorousCardTitleProps>(
  ({ className, glamour = false, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-2xl font-bold leading-tight tracking-tight",
        glamour && "text-glamour bg-gradient-to-r from-emerald-600 via-gold-600 to-rose-600 bg-clip-text text-transparent",
        className
      )}
      data-testid={testId}
      {...props}
    />
  )
);
GlamorousCardTitle.displayName = "GlamorousCardTitle";

// ================== CARD DESCRIPTION COMPONENT ==================

export interface GlamorousCardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

const GlamorousCardDescription = React.forwardRef<HTMLDivElement, GlamorousCardDescriptionProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      data-testid={testId}
      {...props}
    />
  )
);
GlamorousCardDescription.displayName = "GlamorousCardDescription";

// ================== CARD CONTENT COMPONENT ==================

export interface GlamorousCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

const GlamorousCardContent = React.forwardRef<HTMLDivElement, GlamorousCardContentProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div ref={ref} className={cn("p-0 pt-0", className)} data-testid={testId} {...props} />
  )
);
GlamorousCardContent.displayName = "GlamorousCardContent";

// ================== CARD FOOTER COMPONENT ==================

export interface GlamorousCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

const GlamorousCardFooter = React.forwardRef<HTMLDivElement, GlamorousCardFooterProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-0 pt-4", className)}
      data-testid={testId}
      {...props}
    />
  )
);
GlamorousCardFooter.displayName = "GlamorousCardFooter";

// ================== PRESET CONFIGURATIONS ==================

export const GlamorousCardPresets = {
  // Consumer-facing luxury variants
  luxuryShowcase: {
    variant: 'luxury' as const,
    size: 'lg' as const,
    glow: 'medium' as const,
    shine: 'medium' as const,
    ambientParticles: true,
    particleIntensity: 'medium' as const,
    glowBorder: true,
    glowVariant: 'emerald' as const,
    backgroundPattern: 'dots' as const,
    entrance: 'float' as const,
    'data-testid': 'card-luxury-showcase',
  },
  
  premiumFeature: {
    variant: 'premium' as const,
    size: 'lg' as const,
    glow: 'intense' as const,
    shine: 'intense' as const,
    ambientParticles: true,
    particleIntensity: 'bold' as const,
    glowBorder: true,
    glowVariant: 'gold' as const,
    backgroundPattern: 'orbs' as const,
    entrance: 'scale' as const,
    'data-testid': 'card-premium-feature',
  },
  
  glassElegant: {
    variant: 'glass' as const,
    size: 'default' as const,
    glow: 'subtle' as const,
    shine: 'subtle' as const,
    ambientParticles: false,
    glowBorder: false,
    backgroundPattern: 'none' as const,
    entrance: 'fade' as const,
    'data-testid': 'card-glass-elegant',
  },
  
  gradientSpectacular: {
    variant: 'gradient' as const,
    size: 'xl' as const,
    glow: 'extreme' as const,
    shine: 'intense' as const,
    ambientParticles: true,
    particleIntensity: 'bold' as const,
    glowBorder: true,
    glowVariant: 'gradient' as const,
    backgroundPattern: 'waves' as const,
    entrance: 'float' as const,
    'data-testid': 'card-gradient-spectacular',
  },
  
  floatingMagic: {
    variant: 'floating' as const,
    size: 'lg' as const,
    glow: 'intense' as const,
    shine: 'medium' as const,
    ambientParticles: true,
    particleIntensity: 'medium' as const,
    glowBorder: true,
    glowVariant: 'emerald' as const,
    backgroundPattern: 'dots' as const,
    entrance: 'float' as const,
    'data-testid': 'card-floating-magic',
  },
  
  neonCyber: {
    variant: 'neon' as const,
    size: 'default' as const,
    glow: 'extreme' as const,
    shine: 'intense' as const,
    ambientParticles: true,
    particleIntensity: 'medium' as const,
    glowBorder: true,
    glowVariant: 'cyan' as const,
    backgroundPattern: 'grid' as const,
    entrance: 'slide' as const,
    'data-testid': 'card-neon-cyber',
  },
  
  holographicFuture: {
    variant: 'holographic' as const,
    size: 'lg' as const,
    glow: 'intense' as const,
    shine: 'intense' as const,
    ambientParticles: true,
    particleIntensity: 'bold' as const,
    glowBorder: true,
    glowVariant: 'gradient' as const,
    backgroundPattern: 'orbs' as const,
    entrance: 'scale' as const,
    'data-testid': 'card-holographic-future',
  },
  
  depth3dImmersive: {
    variant: 'depth3d' as const,
    size: 'lg' as const,
    glow: 'medium' as const,
    shine: 'medium' as const,
    ambientParticles: false,
    glowBorder: true,
    glowVariant: 'emerald' as const,
    backgroundPattern: 'none' as const,
    entrance: 'scale' as const,
    'data-testid': 'card-depth3d-immersive',
  },
  
  // Professional fallbacks for business pages
  corporateClean: {
    variant: 'corporate' as const,
    size: 'default' as const,
    glow: 'none' as const,
    shine: 'none' as const,
    ambientParticles: false,
    glowBorder: false,
    backgroundPattern: 'none' as const,
    entrance: 'fade' as const,
    'data-testid': 'card-corporate-clean',
  },
  
  professionalMinimal: {
    variant: 'glass' as const,
    size: 'default' as const,
    glow: 'none' as const,
    shine: 'none' as const,
    ambientParticles: false,
    glowBorder: false,
    backgroundPattern: 'none' as const,
    entrance: 'none' as const,
    'data-testid': 'card-professional-minimal',
  },
};

// ================== HELPER FUNCTIONS ==================

export function createGlamorousCard(preset: keyof typeof GlamorousCardPresets) {
  return function PresetGlamorousCard(props: Omit<GlamorousCardProps, keyof typeof GlamorousCardPresets[typeof preset]>) {
    return <GlamorousCard {...GlamorousCardPresets[preset]} {...props} />;
  };
}

// Pre-built preset components
export const LuxuryCard = createGlamorousCard('luxuryShowcase');
export const PremiumCard = createGlamorousCard('premiumFeature');
export const GlassCard = createGlamorousCard('glassElegant');
export const GradientCard = createGlamorousCard('gradientSpectacular');
export const FloatingCard = createGlamorousCard('floatingMagic');
export const NeonCard = createGlamorousCard('neonCyber');
export const HolographicCard = createGlamorousCard('holographicFuture');
export const Depth3DCard = createGlamorousCard('depth3dImmersive');
export const CorporateCard = createGlamorousCard('corporateClean');
export const ProfessionalCard = createGlamorousCard('professionalMinimal');

export { 
  GlamorousCard, 
  GlamorousCardHeader, 
  GlamorousCardFooter, 
  GlamorousCardTitle, 
  GlamorousCardDescription, 
  GlamorousCardContent,
  glamorousCardVariants 
};