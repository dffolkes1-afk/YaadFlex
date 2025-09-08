// YaadFlex Global Vybz - Country Themes & Cultural Authenticity System
// Supporting Jamaica 🇯🇲, Kenya 🇰🇪, UK 🇬🇧, and expanding globally

export interface CountryTheme {
  country: string;
  countryCode: string; // ISO alpha-2
  flag: string; // emoji or svg
  teamName: string;
  primaryColors: [string, string];
  secondaryColors: [string, string];
  backgroundTheme: string;
  animations: string[];
  culturalElements: CulturalElements;
  paymentMethods: PaymentMethod[];
  languages: LanguagePack[];
  transportTypes: TransportType[];
  marketplaceFeatures: MarketplaceFeature[];
  optionalModes?: ThemeMode[];
}

export interface CulturalElements {
  greeting: string;
  currency: string;
  musicGenres: string[];
  foodCategories: string[];
  culturalLandmarks: string[];
  localSlang: Record<string, string>;
  festivalsEvents: Festival[];
  traditionalColors: string[];
  culturalSymbols: string[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'digital_wallet' | 'bank_transfer' | 'mobile_money' | 'crypto';
  availability: string[]; // country codes
  icon: string;
  processingFee: number;
}

export interface LanguagePack {
  code: string; // e.g., 'en-JM', 'sw-KE'
  name: string;
  isDefault: boolean;
  dialectSupport: boolean;
  voiceSupport: boolean;
  translationAccuracy: number;
}

export interface TransportType {
  id: string;
  name: string;
  icon: string;
  availability: string[];
  basePrice: number;
  culturalName?: string; // Local name like 'matatu' for Kenya
}

export interface MarketplaceFeature {
  id: string;
  name: string;
  description: string;
  culturalRelevance: string;
  icon: string;
}

export interface Festival {
  name: string;
  date: string;
  description: string;
  specialOffers: boolean;
  themeModifications: Record<string, string>;
}

export interface ThemeMode {
  id: string;
  name: string;
  trigger: 'manual' | 'time_based' | 'event_based';
  colorOverrides: Record<string, string>;
  animationOverrides: string[];
  musicPlaylist?: string;
}

// Pre-defined country themes
export const COUNTRY_THEMES: Record<string, CountryTheme> = {
  'JM': {
    country: 'Jamaica',
    countryCode: 'JM',
    flag: '🇯🇲',
    teamName: 'YaadFlex Jamaica',
    primaryColors: ['#009B3A', '#FED100'], // Green and Gold
    secondaryColors: ['#000000', '#FFFFFF'], // Black and White
    backgroundTheme: 'tropical-gradient',
    animations: ['flag_wave', 'palm_sway', 'reggae_pulse'],
    culturalElements: {
      greeting: 'Wah gwaan!',
      currency: 'JMD',
      musicGenres: ['Reggae', 'Dancehall', 'Ska', 'Rocksteady'],
      foodCategories: ['Jerk', 'Curry', 'Rice & Peas', 'Ackee & Saltfish'],
      culturalLandmarks: ['Blue Mountains', 'Negril Beach', 'Bob Marley Museum'],
      localSlang: {
        'hello': 'wah gwaan',
        'goodbye': 'likkle more',
        'friend': 'bredrin',
        'good': 'criss',
        'money': 'bread',
        'car': 'ride',
        'house': 'yard'
      },
      festivalsEvents: [
        {
          name: 'Reggae Sumfest',
          date: 'July',
          description: 'Jamaica\'s premier reggae festival',
          specialOffers: true,
          themeModifications: { background: 'reggae-festival', music: 'reggae-classics' }
        },
        {
          name: 'Independence Day',
          date: 'August 6',
          description: 'Jamaica Independence celebration',
          specialOffers: true,
          themeModifications: { colors: 'independence-pride', animations: 'flag-celebration' }
        }
      ],
      traditionalColors: ['#009B3A', '#FED100', '#000000'],
      culturalSymbols: ['🦜', '🥥', '🏝️', '🎵', '⚡']
    },
    paymentMethods: [
      {
        id: 'visa_jm',
        name: 'Visa',
        type: 'card',
        availability: ['JM'],
        icon: '💳',
        processingFee: 0.035
      },
      {
        id: 'mastercard_jm',
        name: 'MasterCard',
        type: 'card',
        availability: ['JM'],
        icon: '💳',
        processingFee: 0.035
      },
      {
        id: 'lynk_jm',
        name: 'LYNK',
        type: 'mobile_money',
        availability: ['JM'],
        icon: '📱',
        processingFee: 0.02
      }
    ],
    languages: [
      {
        code: 'en-JM',
        name: 'Jamaican Patois',
        isDefault: true,
        dialectSupport: true,
        voiceSupport: true,
        translationAccuracy: 0.95
      },
      {
        code: 'en-US',
        name: 'English',
        isDefault: false,
        dialectSupport: false,
        voiceSupport: true,
        translationAccuracy: 0.98
      }
    ],
    transportTypes: [
      {
        id: 'taxi',
        name: 'Taxi',
        icon: '🚕',
        availability: ['JM'],
        basePrice: 200, // JMD
        culturalName: 'Cab'
      },
      {
        id: 'route_taxi',
        name: 'Route Taxi',
        icon: '🚐',
        availability: ['JM'],
        basePrice: 150,
        culturalName: 'Coaster'
      }
    ],
    marketplaceFeatures: [
      {
        id: 'jerk_delivery',
        name: 'Jerk Delivery',
        description: 'Authentic Jamaican jerk food delivery',
        culturalRelevance: 'Traditional cooking method with cultural significance',
        icon: '🔥'
      },
      {
        id: 'craft_market',
        name: 'Craft Market',
        description: 'Local artisan goods and crafts',
        culturalRelevance: 'Supporting local artisans and cultural heritage',
        icon: '🎨'
      }
    ],
    optionalModes: [
      {
        id: 'reggae_mode',
        name: 'Reggae Mode',
        trigger: 'manual',
        colorOverrides: { '--accent': '#009B3A', '--secondary': '#FED100' },
        animationOverrides: ['reggae_pulse', 'music_wave'],
        musicPlaylist: 'reggae-classics'
      },
      {
        id: 'festival_mode',
        name: 'Festival Mode',
        trigger: 'event_based',
        colorOverrides: { '--accent': '#FF6B35', '--secondary': '#F7931E' },
        animationOverrides: ['celebration_burst', 'flag_wave']
      }
    ]
  },

  'KE': {
    country: 'Kenya',
    countryCode: 'KE',
    flag: '🇰🇪',
    teamName: 'YaadFlex Kenya',
    primaryColors: ['#000000', '#FF0000'], // Black and Red
    secondaryColors: ['#FFFFFF', '#006600'], // White and Green
    backgroundTheme: 'safari-gradient',
    animations: ['flag_wave', 'acacia_sway', 'tribal_pulse'],
    culturalElements: {
      greeting: 'Habari!',
      currency: 'KES',
      musicGenres: ['Benga', 'Kapuka', 'Genge', 'Afrobeat'],
      foodCategories: ['Ugali', 'Nyama Choma', 'Sukuma Wiki', 'Chapati'],
      culturalLandmarks: ['Mount Kenya', 'Maasai Mara', 'Lake Victoria'],
      localSlang: {
        'hello': 'habari',
        'goodbye': 'kwaheri',
        'friend': 'rafiki',
        'good': 'mzuri',
        'money': 'pesa',
        'car': 'gari',
        'house': 'nyumba'
      },
      festivalsEvents: [
        {
          name: 'Mashujaa Day',
          date: 'October 20',
          description: 'Heroes Day celebration',
          specialOffers: true,
          themeModifications: { background: 'heroes-pride', colors: 'national-colors' }
        }
      ],
      traditionalColors: ['#000000', '#FF0000', '#FFFFFF', '#006600'],
      culturalSymbols: ['🦁', '🐘', '🌍', '🏔️', '🌅']
    },
    paymentMethods: [
      {
        id: 'mpesa_ke',
        name: 'M-Pesa',
        type: 'mobile_money',
        availability: ['KE'],
        icon: '📱',
        processingFee: 0.015
      },
      {
        id: 'airtel_money_ke',
        name: 'Airtel Money',
        type: 'mobile_money',
        availability: ['KE'],
        icon: '📱',
        processingFee: 0.018
      }
    ],
    languages: [
      {
        code: 'sw-KE',
        name: 'Kiswahili',
        isDefault: true,
        dialectSupport: true,
        voiceSupport: true,
        translationAccuracy: 0.92
      },
      {
        code: 'en-KE',
        name: 'English (Kenya)',
        isDefault: false,
        dialectSupport: true,
        voiceSupport: true,
        translationAccuracy: 0.96
      }
    ],
    transportTypes: [
      {
        id: 'matatu',
        name: 'Matatu',
        icon: '🚐',
        availability: ['KE'],
        basePrice: 50, // KES
        culturalName: 'Matatu'
      },
      {
        id: 'boda_boda',
        name: 'Boda Boda',
        icon: '🏍️',
        availability: ['KE'],
        basePrice: 100,
        culturalName: 'Boda Boda'
      }
    ],
    marketplaceFeatures: [
      {
        id: 'nyama_choma',
        name: 'Nyama Choma Delivery',
        description: 'Traditional grilled meat delivery',
        culturalRelevance: 'Popular social dining tradition',
        icon: '🥩'
      },
      {
        id: 'maasai_market',
        name: 'Maasai Market',
        description: 'Traditional crafts and beadwork',
        culturalRelevance: 'Supporting Maasai artisan community',
        icon: '📿'
      }
    ]
  },

  'GB': {
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    teamName: 'YaadFlex UK',
    primaryColors: ['#012169', '#C8102E'], // Navy Blue and Red
    secondaryColors: ['#FFFFFF', '#000000'], // White and Black
    backgroundTheme: 'britannia-gradient',
    animations: ['flag_wave', 'london_pulse', 'royal_glow'],
    culturalElements: {
      greeting: 'Alright!',
      currency: 'GBP',
      musicGenres: ['Grime', 'UK Garage', 'Drum & Bass', 'Britpop'],
      foodCategories: ['Fish & Chips', 'Sunday Roast', 'Curry', 'Full English'],
      culturalLandmarks: ['Big Ben', 'Tower Bridge', 'Stonehenge'],
      localSlang: {
        'hello': 'alright',
        'goodbye': 'cheers',
        'friend': 'mate',
        'good': 'brilliant',
        'money': 'quid',
        'car': 'motor',
        'house': 'gaff'
      },
      festivalsEvents: [
        {
          name: 'Notting Hill Carnival',
          date: 'August',
          description: 'Caribbean festival in London',
          specialOffers: true,
          themeModifications: { background: 'carnival-vibes', music: 'caribbean-uk' }
        }
      ],
      traditionalColors: ['#012169', '#C8102E', '#FFFFFF'],
      culturalSymbols: ['👑', '☂️', '🍵', '🚌', '🏰']
    },
    paymentMethods: [
      {
        id: 'visa_gb',
        name: 'Visa',
        type: 'card',
        availability: ['GB'],
        icon: '💳',
        processingFee: 0.025
      },
      {
        id: 'paypal_gb',
        name: 'PayPal',
        type: 'digital_wallet',
        availability: ['GB'],
        icon: '💰',
        processingFee: 0.03
      },
      {
        id: 'revolut_gb',
        name: 'Revolut',
        type: 'digital_wallet',
        availability: ['GB'],
        icon: '🏦',
        processingFee: 0.02
      }
    ],
    languages: [
      {
        code: 'en-GB',
        name: 'English (UK)',
        isDefault: true,
        dialectSupport: true,
        voiceSupport: true,
        translationAccuracy: 0.99
      }
    ],
    transportTypes: [
      {
        id: 'black_cab',
        name: 'Black Cab',
        icon: '🚕',
        availability: ['GB'],
        basePrice: 3.20, // GBP
        culturalName: 'Black Cab'
      },
      {
        id: 'uber_gb',
        name: 'Private Hire',
        icon: '🚗',
        availability: ['GB'],
        basePrice: 2.50
      }
    ],
    marketplaceFeatures: [
      {
        id: 'caribbean_food_uk',
        name: 'Caribbean Cuisine',
        description: 'Authentic Caribbean food in the UK',
        culturalRelevance: 'Supporting Caribbean diaspora businesses',
        icon: '🍛'
      },
      {
        id: 'vintage_market',
        name: 'Vintage Market',
        description: 'British vintage goods and antiques',
        culturalRelevance: 'Traditional British craftsmanship and heritage',
        icon: '🕰️'
      }
    ]
  }
};

// Theme management class
export class GlobalThemeManager {
  private currentTheme: CountryTheme;
  private themeOverrides: Record<string, string> = {};

  constructor(countryCode: string = 'JM') {
    this.currentTheme = COUNTRY_THEMES[countryCode] || COUNTRY_THEMES['JM'];
  }

  setCountryTheme(countryCode: string): void {
    if (COUNTRY_THEMES[countryCode]) {
      this.currentTheme = COUNTRY_THEMES[countryCode];
      this.applyTheme();
    }
  }

  getCurrentTheme(): CountryTheme {
    return this.currentTheme;
  }

  applyTheme(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const theme = this.currentTheme;

    // Apply color scheme
    root.style.setProperty('--theme-primary', theme.primaryColors[0]);
    root.style.setProperty('--theme-primary-accent', theme.primaryColors[1]);
    root.style.setProperty('--theme-secondary', theme.secondaryColors[0]);
    root.style.setProperty('--theme-secondary-accent', theme.secondaryColors[1]);

    // Apply cultural colors
    theme.culturalElements.traditionalColors.forEach((color, index) => {
      root.style.setProperty(`--cultural-${index + 1}`, color);
    });

    // Apply background theme
    root.setAttribute('data-background-theme', theme.backgroundTheme);
    root.setAttribute('data-country-theme', theme.countryCode);

    // Apply any active overrides
    Object.entries(this.themeOverrides).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  enableThemeMode(mode: ThemeMode): void {
    // Apply color overrides
    Object.entries(mode.colorOverrides).forEach(([property, value]) => {
      this.themeOverrides[property] = value;
    });

    // Apply animations
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme-mode', mode.id);
    }

    this.applyTheme();
  }

  disableThemeMode(): void {
    this.themeOverrides = {};
    
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.removeAttribute('data-theme-mode');
    }
    
    this.applyTheme();
  }

  getAvailableCountries(): Array<{ code: string; name: string; flag: string }> {
    return Object.values(COUNTRY_THEMES).map(theme => ({
      code: theme.countryCode,
      name: theme.country,
      flag: theme.flag
    }));
  }

  getCulturalGreeting(): string {
    return this.currentTheme.culturalElements.greeting;
  }

  getLocalSlang(englishWord: string): string {
    return this.currentTheme.culturalElements.localSlang[englishWord.toLowerCase()] || englishWord;
  }

  getAvailablePaymentMethods(): PaymentMethod[] {
    return this.currentTheme.paymentMethods;
  }

  getTransportTypes(): TransportType[] {
    return this.currentTheme.transportTypes;
  }

  getFestivalTheme(): Festival | null {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    
    return this.currentTheme.culturalElements.festivalsEvents.find(
      festival => festival.date.includes(currentMonth)
    ) || null;
  }

  // Generate CSS variables for current theme
  generateThemeCSS(): string {
    const theme = this.currentTheme;
    
    return `
      :root[data-country-theme="${theme.countryCode}"] {
        --theme-primary: ${theme.primaryColors[0]};
        --theme-primary-accent: ${theme.primaryColors[1]};
        --theme-secondary: ${theme.secondaryColors[0]};
        --theme-secondary-accent: ${theme.secondaryColors[1]};
        
        /* Cultural colors */
        ${theme.culturalElements.traditionalColors.map((color, index) => 
          `--cultural-${index + 1}: ${color};`
        ).join('\n        ')}
      }

      /* Background themes */
      [data-background-theme="tropical-gradient"] {
        background: linear-gradient(135deg, #009B3A 0%, #FED100 50%, #009B3A 100%);
      }

      [data-background-theme="safari-gradient"] {
        background: linear-gradient(135deg, #000000 0%, #FF0000 25%, #FFFFFF 50%, #006600 100%);
      }

      [data-background-theme="britannia-gradient"] {
        background: linear-gradient(135deg, #012169 0%, #C8102E 50%, #FFFFFF 100%);
      }

      /* Animations */
      @keyframes flag_wave {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(2deg); }
        75% { transform: rotate(-2deg); }
      }

      @keyframes reggae_pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      @keyframes tribal_pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }

      /* Cultural elements */
      .flag-wave { animation: flag_wave 3s ease-in-out infinite; }
      .reggae-pulse { animation: reggae_pulse 2s ease-in-out infinite; }
      .tribal-pulse { animation: tribal_pulse 1.5s ease-in-out infinite; }
    `;
  }
}

// Singleton instance
export const globalThemeManager = new GlobalThemeManager();

// React hook for theme management
export const useGlobalTheme = () => {
  const [currentTheme, setCurrentTheme] = React.useState(globalThemeManager.getCurrentTheme());
  
  const changeTheme = (countryCode: string) => {
    globalThemeManager.setCountryTheme(countryCode);
    setCurrentTheme(globalThemeManager.getCurrentTheme());
  };

  const enableMode = (mode: ThemeMode) => {
    globalThemeManager.enableThemeMode(mode);
  };

  const disableMode = () => {
    globalThemeManager.disableThemeMode();
  };

  return {
    currentTheme,
    changeTheme,
    enableMode,
    disableMode,
    availableCountries: globalThemeManager.getAvailableCountries(),
    culturalGreeting: globalThemeManager.getCulturalGreeting(),
    getLocalSlang: globalThemeManager.getLocalSlang.bind(globalThemeManager),
    festivalTheme: globalThemeManager.getFestivalTheme()
  };
};