// ================== PAGE MODE DETECTION HOOK ==================
// Automatically detects and applies page modes based on current route

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { 
  getPageModeConfigWithOverrides,
  isGlamorousPage,
  isProfessionalPage,
  type PageModeConfig,
  type PageMode
} from '@/config/page-modes';

export interface PageModeState {
  mode: PageMode;
  config: PageModeConfig;
  isGlamorous: boolean;
  isProfessional: boolean;
  path: string;
  isLoading: boolean;
}

/**
 * Hook for detecting and managing page modes based on current route
 * Automatically determines whether current page should be glamorous or professional
 */
export function usePageMode(): PageModeState {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [pageMode, setPageMode] = useState<PageModeState>({
    mode: 'professional', // Safe default
    config: { mode: 'professional' },
    isGlamorous: false,
    isProfessional: true,
    path: '/',
    isLoading: true
  });

  useEffect(() => {
    setIsLoading(true);
    
    // Small delay to prevent flickering during navigation
    const timeoutId = setTimeout(() => {
      const currentPath = location || '/';
      const config = getPageModeConfigWithOverrides(currentPath);
      
      const newPageMode: PageModeState = {
        mode: config.mode,
        config: config,
        isGlamorous: isGlamorousPage(currentPath),
        isProfessional: isProfessionalPage(currentPath),
        path: currentPath,
        isLoading: false
      };
      
      setPageMode(newPageMode);
      setIsLoading(false);
      
      // Debug logging in development
      if (import.meta.env.DEV) {
        console.log(`🎭 Page Mode Detection:`, {
          path: currentPath,
          mode: config.mode,
          intensity: config.intensity || 'N/A',
          backgroundStyle: config.backgroundStyle || 'default',
          effects: {
            particles: config.enableParticles || false,
            floating: config.enableFloatingElements || false,
            ambient: config.enableAmbientLighting || false,
            watermark: config.showYFWatermark || false
          }
        });
      }
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [location]);

  return pageMode;
}

/**
 * Hook for detecting if current page is glamorous
 * Simple boolean check for conditional rendering
 */
export function useIsGlamorousPage(): boolean {
  const { isGlamorous } = usePageMode();
  return isGlamorous;
}

/**
 * Hook for detecting if current page is professional
 * Simple boolean check for conditional rendering
 */
export function useIsProfessionalPage(): boolean {
  const { isProfessional } = usePageMode();
  return isProfessional;
}

/**
 * Hook for getting current page mode configuration
 * Returns the full configuration object for advanced usage
 */
export function usePageModeConfig(): PageModeConfig {
  const { config } = usePageMode();
  return config;
}

/**
 * Hook for getting current page mode string
 * Returns just the mode ('glamorous' | 'professional')
 */
export function usePageModeString(): PageMode {
  const { mode } = usePageMode();
  return mode;
}

/**
 * Hook for getting page mode with route information
 * Returns both mode and path information
 */
export function usePageModeWithRoute(): { mode: PageMode; path: string; config: PageModeConfig } {
  const { mode, path, config } = usePageMode();
  return { mode, path, config };
}