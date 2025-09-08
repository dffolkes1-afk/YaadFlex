// YaadFlex Global Country Themes System
// Born in Jamaica 🇯🇲, Built for the World 🌍

export interface CountryTheme {
  code: string;
  name: string;
  flag: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  cosmic: {
    starColor1: string;
    starColor2: string;
    galaxyGradient: string;
  };
}

export const countryThemes: Record<string, CountryTheme> = {
  // 🇯🇲 JAMAICA - The Original YardFlex Theme
  JM: {
    code: 'JM',
    name: 'Jamaica',
    flag: '🇯🇲',
    colors: {
      primary: 'hsl(153, 100%, 26%)',  // Jamaica Green
      secondary: 'hsl(153, 100%, 20%)', // Darker Green  
      accent: 'hsl(50, 100%, 50%)',     // Jamaica Gold
      background: 'hsl(0, 0%, 8%)',     // Jamaica Black
      foreground: 'hsl(50, 100%, 95%)', // Light Gold
    },
    cosmic: {
      starColor1: 'hsl(50, 100%, 50%)',   // Gold stars
      starColor2: 'hsl(153, 100%, 26%)',  // Green stars
      galaxyGradient: 'linear-gradient(135deg, hsl(0, 0%, 8%) 0%, hsl(153, 50%, 10%) 50%, hsl(0, 0%, 8%) 100%)',
    }
  },

  // 🇺🇸 UNITED STATES - Stars & Stripes Galactic
  US: {
    code: 'US', 
    name: 'United States',
    flag: '🇺🇸',
    colors: {
      primary: 'hsl(224, 100%, 45%)',   // USA Blue
      secondary: 'hsl(224, 100%, 35%)', // Darker Blue
      accent: 'hsl(0, 100%, 50%)',      // USA Red
      background: 'hsl(220, 15%, 8%)',  // Dark Blue-Black
      foreground: 'hsl(0, 0%, 95%)',    // Pure White
    },
    cosmic: {
      starColor1: 'hsl(0, 0%, 100%)',     // White stars
      starColor2: 'hsl(0, 100%, 50%)',    // Red stars
      galaxyGradient: 'linear-gradient(135deg, hsl(220, 15%, 8%) 0%, hsl(224, 60%, 15%) 50%, hsl(220, 15%, 8%) 100%)',
    }
  },

  // 🇳🇬 NIGERIA - Green White Green Cosmic
  NG: {
    code: 'NG',
    name: 'Nigeria', 
    flag: '🇳🇬',
    colors: {
      primary: 'hsl(120, 100%, 25%)',   // Nigeria Green
      secondary: 'hsl(120, 100%, 20%)', // Darker Green
      accent: 'hsl(0, 0%, 100%)',       // Nigeria White
      background: 'hsl(120, 20%, 8%)',  // Dark Green-Black
      foreground: 'hsl(0, 0%, 95%)',    // White
    },
    cosmic: {
      starColor1: 'hsl(0, 0%, 100%)',     // White stars
      starColor2: 'hsl(120, 100%, 40%)',  // Green stars
      galaxyGradient: 'linear-gradient(135deg, hsl(120, 20%, 8%) 0%, hsl(120, 60%, 12%) 50%, hsl(120, 20%, 8%) 100%)',
    }
  },

  // 🇬🇧 UNITED KINGDOM - Union Jack Cosmic
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧', 
    colors: {
      primary: 'hsl(220, 100%, 40%)',   // UK Blue
      secondary: 'hsl(220, 100%, 30%)', // Darker Blue
      accent: 'hsl(0, 100%, 45%)',      // UK Red
      background: 'hsl(220, 20%, 8%)',  // Dark Blue-Black
      foreground: 'hsl(0, 0%, 95%)',    // White
    },
    cosmic: {
      starColor1: 'hsl(0, 0%, 100%)',     // White stars
      starColor2: 'hsl(0, 100%, 45%)',    // Red stars
      galaxyGradient: 'linear-gradient(135deg, hsl(220, 20%, 8%) 0%, hsl(220, 60%, 12%) 50%, hsl(220, 20%, 8%) 100%)',
    }
  },

  // 🇨🇦 CANADA - Maple Leaf Galactic
  CA: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    colors: {
      primary: 'hsl(0, 100%, 45%)',     // Canada Red
      secondary: 'hsl(0, 100%, 35%)',   // Darker Red
      accent: 'hsl(0, 0%, 100%)',       // Canada White
      background: 'hsl(0, 15%, 8%)',    // Dark Red-Black
      foreground: 'hsl(0, 0%, 95%)',    // White
    },
    cosmic: {
      starColor1: 'hsl(0, 0%, 100%)',     // White stars
      starColor2: 'hsl(0, 100%, 45%)',    // Red stars
      galaxyGradient: 'linear-gradient(135deg, hsl(0, 15%, 8%) 0%, hsl(0, 60%, 12%) 50%, hsl(0, 15%, 8%) 100%)',
    }
  },
};

// Get user's country theme (defaults to Jamaica)
export function getCountryTheme(countryCode?: string): CountryTheme {
  return countryThemes[countryCode?.toUpperCase() || 'JM'] || countryThemes.JM;
}

// Apply country theme to CSS variables
export function applyCountryTheme(countryCode?: string) {
  const theme = getCountryTheme(countryCode);
  const root = document.documentElement;
  
  // Apply colors to CSS custom properties
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  
  // Apply cosmic colors
  root.style.setProperty('--cosmic-star-1', theme.cosmic.starColor1);
  root.style.setProperty('--cosmic-star-2', theme.cosmic.starColor2);
  root.style.setProperty('--galaxy-bg', theme.cosmic.galaxyGradient);
}

// Get all available countries
export function getAvailableCountries(): CountryTheme[] {
  return Object.values(countryThemes);
}