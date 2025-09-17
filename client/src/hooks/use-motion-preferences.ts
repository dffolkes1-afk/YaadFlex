import { useState, useEffect } from 'react';

// ================== MOTION PREFERENCES HOOK ==================

export interface MotionPreferences {
  prefersReducedMotion: boolean;
  isLowPowerDevice: boolean;
  reducedEffects: boolean;
  animationDuration: 'none' | 'fast' | 'normal' | 'slow';
}

/**
 * Hook to detect user motion preferences and device capabilities
 * Provides graceful degradation for animations and visual effects
 */
export function useMotionPreferences(): MotionPreferences {
  const [preferences, setPreferences] = useState<MotionPreferences>({
    prefersReducedMotion: false,
    isLowPowerDevice: false,
    reducedEffects: false,
    animationDuration: 'normal',
  });

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Detect low-power devices (approximate heuristics)
    const isLowPowerDevice = detectLowPowerDevice();
    
    const updatePreferences = () => {
      const prefersReducedMotion = mediaQuery.matches;
      const reducedEffects = prefersReducedMotion || isLowPowerDevice;
      
      setPreferences({
        prefersReducedMotion,
        isLowPowerDevice,
        reducedEffects,
        animationDuration: getAnimationDuration(prefersReducedMotion, isLowPowerDevice),
      });
    };

    // Initial check
    updatePreferences();

    // Listen for changes
    mediaQuery.addEventListener('change', updatePreferences);

    return () => {
      mediaQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  return preferences;
}

/**
 * Detect low-power devices using various heuristics
 */
function detectLowPowerDevice(): boolean {
  // Check for reduced CPU cores (likely mobile/low-power)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    return true;
  }

  // Check for low memory devices
  if ('memory' in performance && (performance as any).memory) {
    const memory = (performance as any).memory;
    // Less than 2GB RAM
    if (memory.jsHeapSizeLimit && memory.jsHeapSizeLimit < 2 * 1024 * 1024 * 1024) {
      return true;
    }
  }

  // Check for mobile device
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  }

  // Check for slow connection
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      return true;
    }
  }

  return false;
}

/**
 * Get appropriate animation duration based on preferences
 */
function getAnimationDuration(prefersReducedMotion: boolean, isLowPowerDevice: boolean): 'none' | 'fast' | 'normal' | 'slow' {
  if (prefersReducedMotion) {
    return 'none';
  }
  if (isLowPowerDevice) {
    return 'fast';
  }
  return 'normal';
}

// ================== MOTION UTILITIES ==================

/**
 * Get CSS animation duration based on motion preferences
 */
export function getMotionDuration(preferences: MotionPreferences): Record<string, string> {
  switch (preferences.animationDuration) {
    case 'none':
      return {
        'transition-duration': '0ms',
        'animation-duration': '0ms',
      };
    case 'fast':
      return {
        'transition-duration': '150ms',
        'animation-duration': '300ms',
      };
    case 'slow':
      return {
        'transition-duration': '500ms',
        'animation-duration': '1000ms',
      };
    default:
      return {
        'transition-duration': '300ms',
        'animation-duration': '600ms',
      };
  }
}

/**
 * Get motion-safe CSS classes
 */
export function getMotionClasses(preferences: MotionPreferences) {
  if (preferences.prefersReducedMotion) {
    return {
      transform: '',
      animation: '',
      transition: '',
    };
  }
  
  if (preferences.isLowPowerDevice) {
    return {
      transform: 'transform-gpu',
      animation: 'animate-none motion-safe:animate-pulse',
      transition: 'transition-fast',
    };
  }
  
  return {
    transform: 'transform-gpu will-change-transform',
    animation: 'animate-float',
    transition: 'transition-all duration-300 ease-out',
  };
}

/**
 * Hook to conditionally apply effects based on motion preferences
 */
export function useConditionalEffect<T>(
  normalEffect: T,
  reducedEffect: T,
  motionPreferences?: MotionPreferences
): T {
  const preferences = motionPreferences || useMotionPreferences();
  return preferences.reducedEffects ? reducedEffect : normalEffect;
}