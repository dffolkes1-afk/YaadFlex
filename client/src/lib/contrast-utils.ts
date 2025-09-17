// ================== WCAG CONTRAST UTILITIES ==================

/**
 * Utility functions for ensuring WCAG 2.1 AA contrast compliance
 * in glamorous components
 */

// ================== COLOR CONVERSION UTILITIES ==================

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to relative luminance
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// ================== WCAG COMPLIANCE CHECKING ==================

/**
 * Check if contrast ratio meets WCAG AA standard (4.5:1)
 */
export function meetsWCAG_AA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standard (7:1)
 */
export function meetsWCAG_AAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 7;
}

/**
 * Check if contrast ratio meets WCAG AA Large Text standard (3:1)
 */
export function meetsWCAG_AA_Large(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 3;
}

// ================== GLAMOROUS COLOR PALETTE VALIDATION ==================

/**
 * Validate glamorous color combinations for accessibility
 */
export const glamorousColorValidation = {
  // Emerald combinations
  emerald: {
    onWhite: {
      '400': { contrast: getContrastRatio('#10b981', '#ffffff'), passes: meetsWCAG_AA('#10b981', '#ffffff') },
      '500': { contrast: getContrastRatio('#059669', '#ffffff'), passes: meetsWCAG_AA('#059669', '#ffffff') },
      '600': { contrast: getContrastRatio('#047857', '#ffffff'), passes: meetsWCAG_AA('#047857', '#ffffff') },
      '700': { contrast: getContrastRatio('#065f46', '#ffffff'), passes: meetsWCAG_AA('#065f46', '#ffffff') },
      '800': { contrast: getContrastRatio('#064e3b', '#ffffff'), passes: meetsWCAG_AA('#064e3b', '#ffffff') },
    },
    onBlack: {
      '400': { contrast: getContrastRatio('#10b981', '#000000'), passes: meetsWCAG_AA('#10b981', '#000000') },
      '300': { contrast: getContrastRatio('#6ee7b7', '#000000'), passes: meetsWCAG_AA('#6ee7b7', '#000000') },
      '200': { contrast: getContrastRatio('#a7f3d0', '#000000'), passes: meetsWCAG_AA('#a7f3d0', '#000000') },
    }
  },
  
  // Gold combinations  
  gold: {
    onWhite: {
      '500': { contrast: getContrastRatio('#f59e0b', '#ffffff'), passes: meetsWCAG_AA('#f59e0b', '#ffffff') },
      '600': { contrast: getContrastRatio('#d97706', '#ffffff'), passes: meetsWCAG_AA('#d97706', '#ffffff') },
      '700': { contrast: getContrastRatio('#b45309', '#ffffff'), passes: meetsWCAG_AA('#b45309', '#ffffff') },
      '800': { contrast: getContrastRatio('#92400e', '#ffffff'), passes: meetsWCAG_AA('#92400e', '#ffffff') },
    },
    onBlack: {
      '400': { contrast: getContrastRatio('#fbbf24', '#000000'), passes: meetsWCAG_AA('#fbbf24', '#000000') },
      '300': { contrast: getContrastRatio('#fcd34d', '#000000'), passes: meetsWCAG_AA('#fcd34d', '#000000') },
    }
  },
  
  // Rose combinations
  rose: {
    onWhite: {
      '500': { contrast: getContrastRatio('#f43f5e', '#ffffff'), passes: meetsWCAG_AA('#f43f5e', '#ffffff') },
      '600': { contrast: getContrastRatio('#e11d48', '#ffffff'), passes: meetsWCAG_AA('#e11d48', '#ffffff') },
      '700': { contrast: getContrastRatio('#be185d', '#ffffff'), passes: meetsWCAG_AA('#be185d', '#ffffff') },
      '800': { contrast: getContrastRatio('#9f1239', '#ffffff'), passes: meetsWCAG_AA('#9f1239', '#ffffff') },
    },
    onBlack: {
      '400': { contrast: getContrastRatio('#fb7185', '#000000'), passes: meetsWCAG_AA('#fb7185', '#000000') },
      '300': { contrast: getContrastRatio('#fda4af', '#000000'), passes: meetsWCAG_AA('#fda4af', '#000000') },
    }
  }
};

// ================== ADAPTIVE COLOR FUNCTIONS ==================

/**
 * Get accessible color variant based on background
 */
export function getAccessibleColorVariant(
  baseColor: 'emerald' | 'gold' | 'rose',
  background: 'light' | 'dark' = 'light',
  level: 'AA' | 'AAA' = 'AA'
): string {
  const colorMap = {
    emerald: {
      light: level === 'AAA' ? '#065f46' : '#047857', // emerald-700/800
      dark: '#10b981' // emerald-400
    },
    gold: {
      light: level === 'AAA' ? '#92400e' : '#b45309', // amber-800/700  
      dark: '#fbbf24' // amber-400
    },
    rose: {
      light: level === 'AAA' ? '#9f1239' : '#be185d', // rose-800/700
      dark: '#fb7185' // rose-400
    }
  };
  
  return colorMap[baseColor][background];
}

/**
 * Check if current environment supports high contrast mode
 */
export function supportsHighContrastMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Get high contrast version of glamorous variant
 */
export function getHighContrastVariant(variant: string): string {
  const highContrastMap: Record<string, string> = {
    'luxury': 'bg-emerald-800 text-white border-emerald-600',
    'premium': 'bg-amber-800 text-white border-amber-600', 
    'glamour': 'bg-rose-800 text-white border-rose-600',
    'glass': 'bg-white/95 text-slate-900 border-slate-600',
    'neon': 'bg-slate-900 text-cyan-300 border-cyan-400',
    'corporate': 'bg-slate-800 text-white border-slate-600'
  };
  
  return highContrastMap[variant] || variant;
}

// ================== FOCUS ENHANCEMENT UTILITIES ==================

/**
 * Generate enhanced focus styles for accessibility
 */
export function getEnhancedFocusStyles(variant?: 'emerald' | 'gold' | 'rose'): string {
  const baseStyles = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  
  const variantStyles = {
    emerald: 'focus-visible:ring-emerald-500/70',
    gold: 'focus-visible:ring-amber-500/70', 
    rose: 'focus-visible:ring-rose-500/70'
  };
  
  const ringColor = variant ? variantStyles[variant] : 'focus-visible:ring-blue-500/70';
  
  return `${baseStyles} ${ringColor}`;
}

// ================== VALIDATION HELPER ==================

/**
 * Validate all glamorous component color combinations
 */
export function validateGlamorousAccessibility(): {
  passed: boolean;
  results: Array<{
    combination: string;
    contrast: number;
    passes: boolean;
    level: 'AA' | 'AAA' | 'Fail';
  }>;
} {
  const results: Array<{
    combination: string;
    contrast: number;
    passes: boolean;
    level: 'AA' | 'AAA' | 'Fail';
  }> = [];

  // Test critical color combinations
  const testCombinations = [
    { name: 'Emerald 600 on White', fg: '#047857', bg: '#ffffff' },
    { name: 'Gold 700 on White', fg: '#b45309', bg: '#ffffff' },
    { name: 'Rose 700 on White', fg: '#be185d', bg: '#ffffff' },
    { name: 'Emerald 400 on Black', fg: '#10b981', bg: '#000000' },
    { name: 'Gold 400 on Black', fg: '#fbbf24', bg: '#000000' },
    { name: 'Rose 400 on Black', fg: '#fb7185', bg: '#000000' },
  ];

  testCombinations.forEach(combo => {
    const contrast = getContrastRatio(combo.fg, combo.bg);
    const passesAA = contrast >= 4.5;
    const passesAAA = contrast >= 7;
    
    results.push({
      combination: combo.name,
      contrast: Math.round(contrast * 100) / 100,
      passes: passesAA,
      level: passesAAA ? 'AAA' : passesAA ? 'AA' : 'Fail'
    });
  });

  const allPassed = results.every(result => result.passes);

  return { passed: allPassed, results };
}