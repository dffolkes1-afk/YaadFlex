// ================== PAGE MODE MAPPING CONFIGURATION ==================
// Defines which pages should be GLAMOROUS vs PROFESSIONAL in YaadFlex

export type PageMode = 'glamorous' | 'professional';
export type IntensityLevel = 'subtle' | 'medium' | 'bold';
export type BackgroundStyle = 'corporate' | 'luxury' | 'tech' | 'caribbean' | 'classic' | 'textured' | 'old-english' | 'default';

export interface PageModeConfig {
  mode: PageMode;
  intensity?: IntensityLevel;
  backgroundStyle?: BackgroundStyle;
  enableParticles?: boolean;
  enableFloatingElements?: boolean;
  enableAmbientLighting?: boolean;
  showYFWatermark?: boolean;
  watermarkOpacity?: number;
  disableOnMobile?: boolean;
  // SEO overrides
  title?: string;
  description?: string;
  ogImage?: string;
}

// ================== ROUTE-BASED PAGE MAPPING ==================

export const PAGE_MODE_MAPPING: Record<string, PageModeConfig> = {
  
  // ========== GLAMOROUS PAGES - Consumer-facing, marketing, entertainment ==========
  
  // Landing & Home Pages - Full glamour to grab crowds
  '/': {
    mode: 'professional',
    title: 'YaadFlex - Jamaica Taking Over The World 🇯🇲',
    description: 'Join the revolution! 85% driver earnings, instant payments, and the most advanced transport platform in the Caribbean.',
    ogImage: '/api/og-image/home'
  },
  '/home': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'caribbean',
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true,
    showYFWatermark: true
  },
  '/modern-landing': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'tech',
    enableParticles: true,
    enableAmbientLighting: true
  },
  '/original-landing': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'luxury',
    enableFloatingElements: true,
    enableAmbientLighting: true
  },
  
  // Marketplace & Shopping - Attract customers with luxury feel
  '/marketplace': {
    mode: 'professional',
    title: 'YaadFlex Marketplace - Premium Services & Products',
    description: 'Discover premium services, exclusive deals, and luxury experiences in Jamaica\'s premier marketplace.'
  },
  '/buy': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'luxury'
  },
  '/sell': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'luxury'
  },
  '/car-marketplace': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'luxury',
    enableParticles: true
  },
  '/premium-storefront': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'luxury',
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true
  },
  '/real-estate': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'luxury'
  },
  '/rental-empire': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'luxury'
  },
  
  // Sponsorship & Partnership - Captivating for partnerships
  '/sponsorship': {
    mode: 'professional',
    title: 'Partner with YaadFlex - Revolutionary Sponsorship Opportunities',
    description: 'Join the most dynamic transport platform in the Caribbean. Premium sponsorship packages available.'
  },
  
  // Media, Social & Entertainment - Attention-grabbing content
  '/social': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'caribbean',
    enableParticles: true
  },
  '/social-feed': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'caribbean'
  },
  '/social-hub': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'caribbean'
  },
  '/world-vybz': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'caribbean',
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true
  },
  '/global-content': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'caribbean'
  },
  '/world-content': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'caribbean'
  },
  '/media-hub': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'tech',
    enableParticles: true
  },
  '/media': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'tech'
  },
  '/live-tv': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'tech'
  },
  '/party': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'caribbean',
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true
  },
  '/fun': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'caribbean'
  },
  '/yaad-party': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'caribbean'
  },
  
  // World & Global Features - Maximum impact
  '/world': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'tech',
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true
  },
  '/world-takeover': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'tech'
  },
  '/global': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'tech'
  },
  '/emblem': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'luxury',
    enableParticles: true,
    enableFloatingElements: true
  },
  
  // Branding & Design - Showcase glamour
  '/glamour': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'luxury',
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true
  },
  '/glamour-showcase': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'luxury'
  },
  '/design-system': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'luxury'
  },
  '/luxury-demo': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'luxury'
  },
  '/yf-branding': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'luxury',
    enableParticles: true
  },
  '/branding': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'luxury'
  },
  '/wallpapers': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'luxury'
  },
  
  // Special Features & Magic
  '/magic': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'tech',
    enableParticles: true,
    enableFloatingElements: true
  },
  '/magic-drop': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'tech'
  },
  '/surprise/:code': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'caribbean'
  },
  '/contacts': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'tech'
  },
  '/contact-magic': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'tech'
  },
  '/contact-share': {
    mode: 'glamorous',
    intensity: 'medium',
    backgroundStyle: 'tech'
  },
  
  // Portal & Galactic
  '/portal': {
    mode: 'glamorous',
    intensity: 'bold',
    backgroundStyle: 'tech',
    enableParticles: true,
    enableFloatingElements: true,
    enableAmbientLighting: true
  },
  
  // ========== PROFESSIONAL PAGES - Business-focused, clean, trustworthy ==========
  
  // Payment & Financial - Trustworthy and secure feel
  '/wallet': {
    mode: 'professional',
    title: 'YaadFlex Wallet - Secure Digital Banking',
    description: 'Manage your money securely with YaadFlex\'s institutional-grade digital banking platform.'
  },
  '/bank': {
    mode: 'professional'
  },
  '/money': {
    mode: 'professional'
  },
  '/banking': {
    mode: 'professional'
  },
  '/universal-payment': {
    mode: 'professional'
  },
  '/link-payment': {
    mode: 'professional'
  },
  '/pricing': {
    mode: 'professional'
  },
  
  // Legal & Compliance - Serious professional styling
  '/terms': {
    mode: 'professional',
    title: 'Terms of Service - YaadFlex',
    description: 'Terms and conditions for using YaadFlex transport platform and related services.'
  },
  '/terms-of-service': {
    mode: 'professional'
  },
  '/privacy': {
    mode: 'professional',
    title: 'Privacy Policy - YaadFlex',
    description: 'How YaadFlex protects your privacy and handles your personal data.'
  },
  '/privacy-policy': {
    mode: 'professional'
  },
  '/user-agreement': {
    mode: 'professional'
  },
  '/driver-agreement': {
    mode: 'professional'
  },
  '/business-agreement': {
    mode: 'professional'
  },
  '/business-partner-agreement': {
    mode: 'professional'
  },
  '/legal': {
    mode: 'professional'
  },
  '/legal-center': {
    mode: 'professional'
  },
  '/corporate': {
    mode: 'professional'
  },
  '/corporate-compliance': {
    mode: 'professional'
  },
  '/compliance': {
    mode: 'professional'
  },
  '/blackrock': {
    mode: 'professional'
  },
  
  // Forms & Applications - Clean and functional
  '/business-registration': {
    mode: 'professional',
    title: 'Business Registration - Join YaadFlex Partner Network',
    description: 'Register your transportation business with YaadFlex and access our partner network.'
  },
  '/driver-registration': {
    mode: 'professional',
    title: 'Driver Registration - Earn with YaadFlex',
    description: 'Join YaadFlex as a driver and earn up to 85% of trip fares with instant daily payouts.'
  },
  '/contact': {
    mode: 'professional'
  },
  '/signup': {
    mode: 'professional'
  },
  '/secure-login': {
    mode: 'professional'
  },
  '/social-signup': {
    mode: 'professional'
  },
  
  // Dashboards & Analytics - Data-focused and clear
  '/dashboard': {
    mode: 'professional',
    title: 'YaadFlex Dashboard - Business Intelligence',
    description: 'Comprehensive dashboard for managing your YaadFlex business operations and analytics.'
  },
  '/business-dashboard': {
    mode: 'professional'
  },
  '/company-dashboard': {
    mode: 'professional'
  },
  '/taxi-company': {
    mode: 'professional'
  },
  '/business-control': {
    mode: 'professional'
  },
  '/ceo-dashboard': {
    mode: 'professional'
  },
  '/trading-dashboard': {
    mode: 'professional'
  },
  '/fleet-owner': {
    mode: 'professional'
  },
  '/car-owner': {
    mode: 'professional'
  },
  '/vehicle-owner': {
    mode: 'professional'
  },
  '/vendor-management': {
    mode: 'professional'
  },
  '/rbac-dashboard': {
    mode: 'professional'
  },
  '/delivery-dashboard': {
    mode: 'professional'
  },
  '/timeless-core': {
    mode: 'professional'
  },
  '/workforce': {
    mode: 'professional'
  },
  '/error-dashboard': {
    mode: 'professional'
  },
  '/diagnostics': {
    mode: 'professional'
  },
  
  // Operations & Logistics - Professional service interfaces
  '/ride-booking': {
    mode: 'professional'
  },
  '/book-ride': {
    mode: 'professional'
  },
  '/book-delivery': {
    mode: 'professional'
  },
  '/delivery-booking': {
    mode: 'professional'
  },
  '/track-delivery': {
    mode: 'professional'
  },
  '/tracking': {
    mode: 'professional'
  },
  '/live-delivery-tracking': {
    mode: 'professional'
  },
  '/travel-booking': {
    mode: 'professional'
  },
  '/services': {
    mode: 'professional'
  },
  '/service-marketplace': {
    mode: 'professional'
  },
  '/logistics-brokers': {
    mode: 'professional'
  },
  '/port-clearing': {
    mode: 'professional'
  },
  '/barrel-service': {
    mode: 'professional'
  },
  '/brokers': {
    mode: 'professional'
  },
  '/heritage-delivery': {
    mode: 'professional'
  },
  '/delivery-riders': {
    mode: 'professional'
  },
  
  // Job & Workforce Management
  '/jobs': {
    mode: 'professional'
  },
  '/global-jobs': {
    mode: 'professional'
  },
  '/post-job': {
    mode: 'professional'
  },
  
  // Insurance & Safety - Professional trust
  '/insurance': {
    mode: 'professional'
  },
  '/insurance-faq': {
    mode: 'professional'
  },
  '/safety': {
    mode: 'professional'
  },
  
  // Support & Assistance
  '/support': {
    mode: 'professional'
  },
  '/email-assistant': {
    mode: 'professional'
  },
  
  // Testing & Development
  '/demo': {
    mode: 'professional'
  },
  '/upload-test': {
    mode: 'professional'
  },
  '/simple-upload': {
    mode: 'professional'
  },
  '/tiny-upload': {
    mode: 'professional'
  },
  
  // Technical Features (can be either, defaulting to professional for trust)
  '/cb-radio': {
    mode: 'professional'
  },
  '/secure-browser': {
    mode: 'professional'
  },
  '/universal-remote': {
    mode: 'professional'
  },
  '/translator': {
    mode: 'professional'
  },
  '/voice-control': {
    mode: 'professional'
  },
  '/voice-interactive': {
    mode: 'professional'
  },
  '/voice-demo': {
    mode: 'professional'
  },
  '/voice-workspace': {
    mode: 'professional'
  },
  '/workspace': {
    mode: 'professional'
  },
  '/voice-studio': {
    mode: 'professional'
  },
  '/tts': {
    mode: 'professional'
  },
  '/speech': {
    mode: 'professional'
  },
  '/ripley': {
    mode: 'professional'
  },
  '/ripley-test': {
    mode: 'professional'
  },
  '/voice-test': {
    mode: 'professional'
  },
  '/driving-coach': {
    mode: 'professional'
  },
  '/learn-driving': {
    mode: 'professional'
  },
  '/driving-lessons': {
    mode: 'professional'
  }
};

// ================== PATTERN-BASED ROUTE MATCHING ==================

export interface RoutePattern {
  pattern: RegExp;
  config: PageModeConfig;
  description: string;
}

export const ROUTE_PATTERNS: RoutePattern[] = [
  {
    pattern: /^\/dashboard/,
    config: { mode: 'professional' },
    description: 'All dashboard routes are professional'
  },
  {
    pattern: /^\/admin/,
    config: { mode: 'professional' },
    description: 'All admin routes are professional'
  },
  {
    pattern: /^\/api/,
    config: { mode: 'professional' },
    description: 'All API routes are professional'
  },
  {
    pattern: /^\/auth/,
    config: { mode: 'professional' },
    description: 'All auth routes are professional'
  },
  {
    pattern: /\/(terms|privacy|legal|agreement|policy)/,
    config: { mode: 'professional' },
    description: 'Legal and policy pages are professional'
  },
  {
    pattern: /\/(wallet|pay|bank|money|finance)/,
    config: { mode: 'professional' },
    description: 'Financial pages are professional'
  },
  {
    pattern: /\/(party|fun|magic|glamour|world|global)/,
    config: { 
      mode: 'glamorous', 
      intensity: 'bold',
      backgroundStyle: 'caribbean',
      enableParticles: true
    },
    description: 'Fun and global pages are glamorous'
  },
  {
    pattern: /\/(social|media|entertainment|vybz)/,
    config: { 
      mode: 'glamorous', 
      intensity: 'medium',
      backgroundStyle: 'caribbean'
    },
    description: 'Social and media pages are glamorous'
  },
  {
    pattern: /\/(marketplace|shop|buy|sell|premium)/,
    config: { 
      mode: 'glamorous', 
      intensity: 'medium',
      backgroundStyle: 'luxury',
      enableParticles: true
    },
    description: 'Commerce pages are glamorous'
  }
];

// ================== DEFAULT CONFIGURATIONS ==================

export const DEFAULT_GLAMOROUS_CONFIG: PageModeConfig = {
  mode: 'professional',
  intensity: 'subtle',
  backgroundStyle: 'corporate',
  enableParticles: false,
  enableFloatingElements: false,
  enableAmbientLighting: false,
  showYFWatermark: false,
  watermarkOpacity: 0.05,
  disableOnMobile: true
};

export const DEFAULT_PROFESSIONAL_CONFIG: PageModeConfig = {
  mode: 'professional'
};

// ================== UTILITY FUNCTIONS ==================

/**
 * Get page mode configuration for a given route path
 */
export function getPageModeConfig(path: string): PageModeConfig {
  // 1. Check exact route mapping first
  const exactMatch = PAGE_MODE_MAPPING[path];
  if (exactMatch) {
    return exactMatch;
  }
  
  // 2. Check pattern-based matching
  for (const { pattern, config } of ROUTE_PATTERNS) {
    if (pattern.test(path)) {
      return config;
    }
  }
  
  // 3. Default to professional for all routes (Uber-style approach)
  return DEFAULT_PROFESSIONAL_CONFIG;
}

/**
 * Check if a route should use glamorous mode
 */
export function isGlamorousPage(path: string): boolean {
  const config = getPageModeConfig(path);
  return config.mode === 'glamorous';
}

/**
 * Check if a route should use professional mode
 */
export function isProfessionalPage(path: string): boolean {
  const config = getPageModeConfig(path);
  return config.mode === 'professional';
}

/**
 * Get all glamorous routes
 */
export function getGlamorousRoutes(): string[] {
  return Object.keys(PAGE_MODE_MAPPING).filter(route => 
    PAGE_MODE_MAPPING[route].mode === 'glamorous'
  );
}

/**
 * Get all professional routes
 */
export function getProfessionalRoutes(): string[] {
  return Object.keys(PAGE_MODE_MAPPING).filter(route => 
    PAGE_MODE_MAPPING[route].mode === 'professional'
  );
}

/**
 * Override page mode for a specific route (runtime override)
 */
const PAGE_MODE_OVERRIDES = new Map<string, PageModeConfig>();

export function setPageModeOverride(path: string, config: PageModeConfig): void {
  PAGE_MODE_OVERRIDES.set(path, config);
}

export function clearPageModeOverride(path: string): void {
  PAGE_MODE_OVERRIDES.delete(path);
}

export function getPageModeConfigWithOverrides(path: string): PageModeConfig {
  // Check for runtime overrides first
  const override = PAGE_MODE_OVERRIDES.get(path);
  if (override) {
    return override;
  }
  
  return getPageModeConfig(path);
}