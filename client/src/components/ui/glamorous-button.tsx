import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ================== GLAMOROUS BUTTON VARIANTS ==================

const glamorousButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group transform-gpu will-change-transform",
  {
    variants: {
      variant: {
        luxury: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-lg hover:shadow-emerald-500/25 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 active:scale-95",
        premium: "bg-gradient-to-r from-gold-500 via-amber-500 to-orange-500 text-white hover:from-gold-400 hover:via-amber-400 hover:to-orange-400 shadow-lg hover:shadow-gold-500/25 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 active:scale-95",
        glamour: "bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white hover:from-rose-400 hover:via-pink-400 hover:to-purple-400 shadow-lg hover:shadow-rose-500/25 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 active:scale-95",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-white/10 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 active:scale-95",
        neon: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 active:scale-95 border-2 border-cyan-400/50 hover:border-cyan-300",
        party: "bg-gradient-to-r from-emerald-500 via-gold-500 to-rose-500 text-white hover:from-emerald-400 hover:via-gold-400 hover:to-rose-400 shadow-lg hover:shadow-emerald-500/25 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 active:scale-95 bg-size-200 animate-gradient",
        magnetic: "bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-700 hover:to-slate-800 shadow-lg hover:shadow-slate-500/25 hover:shadow-2xl hover:-translate-y-2 hover:scale-110 hover:rotate-1 active:scale-95 active:rotate-0",
        holographic: "bg-gradient-to-r from-emerald-400 via-gold-400 via-rose-400 to-purple-400 text-white hover:bg-gradient-to-l shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105 active:scale-95 bg-size-400 animate-gradient",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm: "h-10 rounded-md px-4 py-2 text-xs",
        lg: "h-14 rounded-lg px-8 py-4 text-base",
        xl: "h-16 rounded-xl px-10 py-5 text-lg",
        icon: "h-12 w-12",
      },
      glow: {
        none: "",
        subtle: "hover:drop-shadow-lg",
        medium: "hover:drop-shadow-xl",
        intense: "hover:drop-shadow-2xl",
        extreme: "drop-shadow-lg hover:drop-shadow-2xl animate-pulse-glow",
      },
      sparkle: {
        none: "",
        enabled: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-out",
      },
    },
    defaultVariants: {
      variant: "luxury",
      size: "default",
      glow: "medium",
      sparkle: "enabled",
    },
  }
)

// ================== FLOATING ELEMENTS COMPONENT ==================

interface FloatingElementsProps {
  intensity: 'subtle' | 'medium' | 'bold';
  enabled: boolean;
}

function FloatingElements({ intensity, enabled }: FloatingElementsProps) {
  if (!enabled) return null;
  
  const getElementCount = () => {
    switch (intensity) {
      case 'subtle': return 2;
      case 'medium': return 4;
      case 'bold': return 6;
      default: return 2;
    }
  };
  
  const elements = ['✨', '💎', '⭐', '🌟', '💫', '✴️'];
  const elementCount = getElementCount();
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {elements.slice(0, elementCount).map((element, i) => (
        <div
          key={i}
          className="absolute text-xs opacity-30 animate-float"
          style={{
            left: `${20 + (i * 15)}%`,
            top: `${10 + (i * 10)}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + i}s`,
          }}
        >
          {element}
        </div>
      ))}
    </div>
  );
}

// ================== GLAMOROUS BUTTON COMPONENT ==================

export interface GlamorousButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glamorousButtonVariants> {
  asChild?: boolean;
  floatingElements?: boolean;
  elementIntensity?: 'subtle' | 'medium' | 'bold';
  rippleEffect?: boolean;
  magneticHover?: boolean;
  'data-testid'?: string;
}

const GlamorousButton = React.forwardRef<HTMLButtonElement, GlamorousButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    glow, 
    sparkle,
    asChild = false, 
    floatingElements = false,
    elementIntensity = 'medium',
    rippleEffect = true,
    magneticHover = false,
    'data-testid': testId,
    onClick,
    children,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    
    React.useImperativeHandle(ref, () => buttonRef.current!);
    
    // Ripple effect handler
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (rippleEffect && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const id = Date.now();
        
        setRipples(prev => [...prev, { id, x, y }]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== id));
        }, 600);
      }
      
      onClick?.(event);
    }, [onClick, rippleEffect]);
    
    // Magnetic hover effect
    const handleMouseMove = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (magneticHover && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        
        buttonRef.current.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
      }
    }, [magneticHover]);
    
    const handleMouseLeave = React.useCallback(() => {
      if (magneticHover && buttonRef.current) {
        buttonRef.current.style.transform = '';
      }
    }, [magneticHover]);
    
    const Comp = asChild ? Slot : "button";
    
    const buttonClasses = cn(
      glamorousButtonVariants({ variant, size, glow, sparkle }),
      magneticHover && "transition-transform duration-200 ease-out",
      className
    );
    
    return (
      <Comp
        className={buttonClasses}
        ref={buttonRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-testid={testId}
        {...props}
      >
        {/* Floating Elements */}
        {floatingElements && (
          <FloatingElements intensity={elementIntensity} enabled={floatingElements} />
        )}
        
        {/* Ripple Effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full animate-ping pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              animationDuration: '0.6s',
            }}
          />
        ))}
        
        {/* Button Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        
        {/* Shine overlay for certain variants */}
        {(variant === 'luxury' || variant === 'premium' || variant === 'party') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
      </Comp>
    );
  }
);

GlamorousButton.displayName = "GlamorousButton";

// ================== PRESET VARIANTS ==================

export const GlamorousButtonPresets = {
  // Consumer-facing luxury variants
  primaryLuxury: {
    variant: 'luxury' as const,
    size: 'lg' as const,
    glow: 'medium' as const,
    sparkle: 'enabled' as const,
    floatingElements: true,
    elementIntensity: 'medium' as const,
    rippleEffect: true,
    'data-testid': 'button-primary-luxury',
  },
  
  premiumGold: {
    variant: 'premium' as const,
    size: 'lg' as const,
    glow: 'intense' as const,
    sparkle: 'enabled' as const,
    floatingElements: true,
    elementIntensity: 'bold' as const,
    rippleEffect: true,
    'data-testid': 'button-premium-gold',
  },
  
  glamourRose: {
    variant: 'glamour' as const,
    size: 'default' as const,
    glow: 'medium' as const,
    sparkle: 'enabled' as const,
    floatingElements: false,
    rippleEffect: true,
    'data-testid': 'button-glamour-rose',
  },
  
  glassElegant: {
    variant: 'glass' as const,
    size: 'lg' as const,
    glow: 'subtle' as const,
    sparkle: 'enabled' as const,
    floatingElements: false,
    rippleEffect: true,
    'data-testid': 'button-glass-elegant',
  },
  
  neonCyber: {
    variant: 'neon' as const,
    size: 'default' as const,
    glow: 'extreme' as const,
    sparkle: 'enabled' as const,
    floatingElements: true,
    elementIntensity: 'medium' as const,
    rippleEffect: true,
    'data-testid': 'button-neon-cyber',
  },
  
  partyMode: {
    variant: 'party' as const,
    size: 'xl' as const,
    glow: 'extreme' as const,
    sparkle: 'enabled' as const,
    floatingElements: true,
    elementIntensity: 'bold' as const,
    rippleEffect: true,
    magneticHover: true,
    'data-testid': 'button-party-mode',
  },
  
  magneticDark: {
    variant: 'magnetic' as const,
    size: 'lg' as const,
    glow: 'medium' as const,
    sparkle: 'enabled' as const,
    floatingElements: false,
    rippleEffect: true,
    magneticHover: true,
    'data-testid': 'button-magnetic-dark',
  },
  
  holographicFuture: {
    variant: 'holographic' as const,
    size: 'lg' as const,
    glow: 'intense' as const,
    sparkle: 'enabled' as const,
    floatingElements: true,
    elementIntensity: 'bold' as const,
    rippleEffect: true,
    'data-testid': 'button-holographic-future',
  },
  
  // Professional fallbacks for business pages
  professionalPrimary: {
    variant: 'luxury' as const,
    size: 'default' as const,
    glow: 'subtle' as const,
    sparkle: 'none' as const,
    floatingElements: false,
    rippleEffect: true,
    'data-testid': 'button-professional-primary',
  },
  
  professionalSecondary: {
    variant: 'glass' as const,
    size: 'default' as const,
    glow: 'none' as const,
    sparkle: 'none' as const,
    floatingElements: false,
    rippleEffect: false,
    'data-testid': 'button-professional-secondary',
  },
};

// ================== HELPER FUNCTIONS ==================

export function createGlamorousButton(preset: keyof typeof GlamorousButtonPresets) {
  return function PresetGlamorousButton(props: Omit<GlamorousButtonProps, keyof typeof GlamorousButtonPresets[typeof preset]>) {
    return <GlamorousButton {...GlamorousButtonPresets[preset]} {...props} />;
  };
}

// Pre-built preset components
export const LuxuryButton = createGlamorousButton('primaryLuxury');
export const PremiumButton = createGlamorousButton('premiumGold');
export const GlamourButton = createGlamorousButton('glamourRose');
export const GlassButton = createGlamorousButton('glassElegant');
export const NeonButton = createGlamorousButton('neonCyber');
export const PartyButton = createGlamorousButton('partyMode');
export const MagneticButton = createGlamorousButton('magneticDark');
export const HolographicButton = createGlamorousButton('holographicFuture');
export const ProfessionalButton = createGlamorousButton('professionalPrimary');
export const ProfessionalSecondaryButton = createGlamorousButton('professionalSecondary');

export { GlamorousButton, glamorousButtonVariants };