// ================== PAGE MODE WRAPPER COMPONENT ==================
// Automatically wraps pages with appropriate layout based on page mode detection

import { ReactNode } from 'react';
import { usePageMode } from '@/hooks/usePageMode';
import { GlamourLayout } from './GlamourLayout';

interface PageModeWrapperProps {
  children: ReactNode;
  
  // Override options - these will override automatic detection
  forceMode?: 'glamorous' | 'professional';
  forceProfessional?: boolean; // Quick override for professional mode
  forceGlamorous?: boolean; // Quick override for glamorous mode
  
  // Glamorous mode customization
  glamourIntensity?: 'subtle' | 'medium' | 'bold';
  glamourBackgroundStyle?: 'corporate' | 'luxury' | 'tech' | 'caribbean' | 'classic' | 'textured' | 'old-english' | 'default';
  disableGlamourOnMobile?: boolean;
  
  // SEO overrides
  title?: string;
  description?: string;
  ogImage?: string;
  
  // Custom styling
  className?: string;
  professionalClassName?: string; // Additional classes for professional mode
  glamorousClassName?: string;    // Additional classes for glamorous mode
  
  // Debug mode
  showModeIndicator?: boolean; // Show visual indicator of current mode (dev only)
}

export function PageModeWrapper({
  children,
  forceMode,
  forceProfessional = false,
  forceGlamorous = false,
  glamourIntensity,
  glamourBackgroundStyle,
  disableGlamourOnMobile = false,
  title,
  description,
  ogImage,
  className = '',
  professionalClassName = '',
  glamorousClassName = '',
  showModeIndicator = false
}: PageModeWrapperProps) {
  
  const { mode, config, isLoading, path } = usePageMode();

  // Determine final mode based on overrides
  const finalMode = forceMode || 
                   (forceProfessional ? 'professional' : null) ||
                   (forceGlamorous ? 'glamorous' : null) ||
                   mode;

  // Show loading state briefly to prevent flash
  if (isLoading) {
    return (
      <div className={`min-h-screen bg-background ${className}`}>
        {children}
      </div>
    );
  }

  // Professional mode - clean, minimal wrapper
  if (finalMode === 'professional') {
    return (
      <div className={`min-h-screen bg-background text-foreground ${professionalClassName} ${className}`} data-page-mode="professional">
        
        {/* SEO Updates for Professional Pages */}
        {title && (
          <title>{title}</title>
        )}
        
        {/* Debug Mode Indicator */}
        {showModeIndicator && import.meta.env.DEV && (
          <div className="fixed top-2 left-2 z-[9999] px-2 py-1 bg-blue-500 text-white text-xs rounded shadow-lg font-mono">
            PROFESSIONAL: {path}
          </div>
        )}
        
        {children}
      </div>
    );
  }

  // Glamorous mode - wrap with GlamourLayout
  const glamourConfig = {
    intensity: glamourIntensity || config.intensity || 'medium',
    backgroundStyle: glamourBackgroundStyle || config.backgroundStyle || 'luxury',
    enableParticles: config.enableParticles ?? true,
    enableFloatingElements: config.enableFloatingElements ?? false,
    enableAmbientLighting: config.enableAmbientLighting ?? true,
    showYFWatermark: config.showYFWatermark ?? true,
    watermarkOpacity: config.watermarkOpacity ?? 0.1,
    disableOnMobile: disableGlamourOnMobile || (config.disableOnMobile ?? false),
    useWallpaper: true,
    wallpaperOpacity: 0.05,
    watermarkPosition: 'bottom-right' as const,
    enableScrollEffects: true,
    enableHoverEffects: true,
    // SEO
    title: title || config.title,
    description: description || config.description,
    ogImage: ogImage || config.ogImage,
    ogType: 'website',
    // Styling
    className: `${glamorousClassName} ${className}`
  };

  return (
    <div data-page-mode="glamorous">
      
      {/* Debug Mode Indicator */}
      {showModeIndicator && import.meta.env.DEV && (
        <div className="fixed top-2 left-2 z-[9999] px-2 py-1 bg-gradient-to-r from-emerald-500 to-gold-500 text-white text-xs rounded shadow-lg font-mono">
          GLAMOROUS ({glamourConfig.intensity}): {path}
        </div>
      )}
      
      <GlamourLayout {...glamourConfig}>
        {children}
      </GlamourLayout>
    </div>
  );
}

// ================== CONVENIENCE COMPONENTS ==================

/**
 * Force Professional Mode Wrapper
 * Explicitly wraps content in professional styling regardless of route
 */
interface ProfessionalWrapperProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function ProfessionalWrapper({ 
  children, 
  className = '', 
  title, 
  description 
}: ProfessionalWrapperProps) {
  return (
    <PageModeWrapper 
      forceProfessional={true}
      className={className}
      title={title}
      description={description}
    >
      {children}
    </PageModeWrapper>
  );
}

/**
 * Force Glamorous Mode Wrapper
 * Explicitly wraps content in glamorous styling regardless of route
 */
interface GlamorousWrapperProps {
  children: ReactNode;
  intensity?: 'subtle' | 'medium' | 'bold';
  backgroundStyle?: 'corporate' | 'luxury' | 'tech' | 'caribbean' | 'classic' | 'textured' | 'old-english' | 'default';
  className?: string;
  title?: string;
  description?: string;
}

export function GlamorousWrapper({ 
  children, 
  intensity = 'medium',
  backgroundStyle = 'luxury',
  className = '', 
  title, 
  description 
}: GlamorousWrapperProps) {
  return (
    <PageModeWrapper 
      forceGlamorous={true}
      glamourIntensity={intensity}
      glamourBackgroundStyle={backgroundStyle}
      className={className}
      title={title}
      description={description}
    >
      {children}
    </PageModeWrapper>
  );
}

/**
 * Automatic Page Mode Wrapper
 * Uses route-based detection with optional customization
 */
export function AutoPageModeWrapper({ 
  children, 
  className = '',
  showModeIndicator = false
}: { 
  children: ReactNode; 
  className?: string;
  showModeIndicator?: boolean;
}) {
  return (
    <PageModeWrapper 
      className={className}
      showModeIndicator={showModeIndicator}
    >
      {children}
    </PageModeWrapper>
  );
}

// ================== LAYOUT UTILITIES ==================

/**
 * Conditional wrapper that only applies glamour if page should be glamorous
 */
interface ConditionalGlamourProps {
  children: ReactNode;
  intensity?: 'subtle' | 'medium' | 'bold';
  fallbackClassName?: string;
}

export function ConditionalGlamour({
  children,
  intensity = 'medium',
  fallbackClassName = 'min-h-screen bg-background'
}: ConditionalGlamourProps) {
  const { isGlamorous } = usePageMode();
  
  if (isGlamorous) {
    return (
      <GlamorousWrapper intensity={intensity}>
        {children}
      </GlamorousWrapper>
    );
  }
  
  return (
    <div className={fallbackClassName}>
      {children}
    </div>
  );
}

/**
 * Mode-aware container with different styling for each mode
 */
interface ModeAwareContainerProps {
  children: ReactNode;
  professionalClass?: string;
  glamorousClass?: string;
}

export function ModeAwareContainer({
  children,
  professionalClass = 'container mx-auto px-4 py-8',
  glamorousClass = 'container mx-auto px-4 py-12'
}: ModeAwareContainerProps) {
  const { isGlamorous } = usePageMode();
  
  return (
    <div className={isGlamorous ? glamorousClass : professionalClass}>
      {children}
    </div>
  );
}