/**
 * YaadFlex Corporate Information
 * Centralized constants for company branding and information
 * A BlackRock Portfolio Company
 */

export const COMPANY_INFO = {
  // Core Company Information
  COMPANY_NAME: "YaadFlex Global",
  LEGAL_NAME: "YaadFlex Global Limited",
  PARENT_COMPANY: "BlackRock, Inc.",
  PORTFOLIO_DESIGNATION: "A BlackRock Portfolio Company",
  
  // Corporate Hierarchy
  CORPORATE_STRUCTURE: {
    parent: "BlackRock, Inc.",
    subsidiary: "YaadFlex Global Limited",
    brand: "YaadFlex",
    tagline: "The Fair Alternative"
  },
  
  // Executive Information
  CEO: {
    title: "Chief Executive Officer",
    company_designation: "BlackRock Executive",
    name: "CEO", // Generic placeholder for privacy
    full_title: "Chief Executive Officer, YaadFlex Global",
    department: "BlackRock Portfolio Management"
  },
  
  // Contact Information - BlackRock Corporate Email Structure
  CONTACT: {
    support_email: "support@yaadflex.blackrock.com",
    corporate_email: "executive@yaadflex.blackrock.com", 
    ceo_email: "ceo@yaadflex.blackrock.com",
    business_email: "business@yaadflex.blackrock.com",
    legal_email: "legal@yaadflex.blackrock.com",
    // BlackRock Corporate Channels
    blackrock_legal: "legal@blackrock.com",
    blackrock_compliance: "compliance@blackrock.com",
    blackrock_executive: "executive@blackrock.com",
    // Public-facing simplified emails (redirect to BlackRock)
    public_support: "support@yaadflex.com", // Redirects to BlackRock
    public_business: "business@yaadflex.com", // Redirects to BlackRock
    // Email signature template
    signature_domain: "yaadflex.blackrock.com"
  },
  
  // Corporate Address
  HEADQUARTERS: {
    legal_address: "1 BlackRock Plaza, New York, NY 10005, USA",
    operational_address: "Kingston, Jamaica (Caribbean Operations)",
    registration: "Incorporated in Jamaica, Managed by BlackRock"
  },
  
  // Branding
  BRANDING: {
    colors: {
      primary: "#FFD700", // Gold
      secondary: "#00AA00", // Green
      accent: "#FFA500", // Orange
      corporate: "#2C3E50", // BlackRock Dark
      background: "#FFFFFF"
    },
    logo_text: "YaadFlex",
    corporate_badge: "BlackRock Portfolio",
    flag_emoji: "🇯🇲"
  },
  
  // Legal & Compliance
  LEGAL: {
    entity_type: "Limited Company",
    incorporation_country: "Jamaica",
    parent_oversight: "BlackRock, Inc. (NYSE: BLK)",
    regulatory_compliance: "BlackRock Global Standards",
    privacy_policy: "BlackRock Privacy Policy Compliant"
  },
  
  // Business Description
  DESCRIPTION: {
    short: "Revolutionary Caribbean super-app transforming digital commerce globally",
    medium: "YaadFlex Global is a BlackRock portfolio company revolutionizing digital commerce in the Caribbean and beyond, offering comprehensive mobility, payment, and marketplace solutions.",
    long: "YaadFlex Global, a BlackRock portfolio company, is a comprehensive super-app born in Jamaica with global ambitions. We're transforming digital commerce through innovative ride-sharing, P2P wallet services, marketplace functionality, and cultural authenticity across different countries. Our platform features multi-currency support, voice-first accessibility, real-time translation capabilities, and enterprise-grade solutions for businesses worldwide.",
    mission: "To create the world's most inclusive and culturally-aware digital commerce platform, powered by BlackRock's global investment expertise and Jamaica's innovative spirit."
  },
  
  // Service Categories
  SERVICES: {
    mobility: "Ride-sharing and transportation services",
    payments: "Multi-currency digital wallet (KWD/YFD)",
    marketplace: "Global service and product marketplace",
    workforce: "Enterprise workforce management solutions",
    real_estate: "Property management and rental services",
    business: "B2B services and registration solutions"
  },
  
  // Social Media & Marketing
  MARKETING: {
    primary_message: "The Fair Alternative",
    value_proposition: "85% Driver Earnings (Industry Leading)",
    key_differentiators: [
      "BlackRock-backed financial stability",
      "Caribbean cultural authenticity",
      "Global digital currency (KWD/YFD)",
      "AI-powered operations",
      "Voice-first accessibility",
      "20+ services in one platform"
    ]
  }
} as const;

// Legacy email addresses to be phased out
export const LEGACY_CONTACTS = {
  deprecated: [
    "support@yardflex.com",
    "support@yaadflexglobalvybz.com"
  ],
  replacement: COMPANY_INFO.CONTACT.support_email
} as const;

// Corporate Templates
export const CORPORATE_TEMPLATES = {
  page_title: (title: string) => `${title} - ${COMPANY_INFO.COMPANY_NAME} | ${COMPANY_INFO.PORTFOLIO_DESIGNATION}`,
  
  footer_text: `© ${new Date().getFullYear()} ${COMPANY_INFO.COMPANY_NAME}. ${COMPANY_INFO.PORTFOLIO_DESIGNATION}. All rights reserved.`,
  
  email_signature: `
${COMPANY_INFO.COMPANY_NAME}
${COMPANY_INFO.PORTFOLIO_DESIGNATION}
${COMPANY_INFO.DESCRIPTION.short}
`,
  
  corporate_header: {
    title: `${COMPANY_INFO.COMPANY_NAME}`,
    subtitle: `${COMPANY_INFO.PORTFOLIO_DESIGNATION}`,
    description: `${COMPANY_INFO.DESCRIPTION.medium}`
  },
  
  social_media_bio: `${COMPANY_INFO.COMPANY_NAME} 🇯🇲 | ${COMPANY_INFO.PORTFOLIO_DESIGNATION} | ${COMPANY_INFO.MARKETING.primary_message} | Revolutionary super-app transforming digital commerce globally`,
  
  linkedin_description: `${COMPANY_INFO.DESCRIPTION.long}\n\nBacked by BlackRock's global investment expertise, we're building the future of inclusive digital commerce with Caribbean innovation at its heart.`
} as const;

// Export individual constants for backwards compatibility
export const COMPANY_NAME = COMPANY_INFO.COMPANY_NAME;
export const PARENT_COMPANY = COMPANY_INFO.PARENT_COMPANY;
export const SUPPORT_EMAIL = COMPANY_INFO.CONTACT.support_email;
export const CEO_EMAIL = COMPANY_INFO.CONTACT.ceo_email;
export const CORPORATE_DESCRIPTION = COMPANY_INFO.DESCRIPTION.medium;
export const HQ_ADDRESS = COMPANY_INFO.HEADQUARTERS.legal_address;
export const LEGAL_ENTITY = COMPANY_INFO.LEGAL_NAME;