import { 
  Instagram, 
  Facebook, 
  Youtube, 
  CreditCard,
  Car,
  Home,
  DollarSign,
  Video,
  MessageCircle,
  UtensilsCrossed,
  Play,
  Plane
} from "lucide-react";
import { SiTiktok, SiWhatsapp, SiPaypal, SiStripe, SiUber, SiAirbnb, SiNetflix } from "react-icons/si";

export interface ServiceConfig {
  slug: string;
  displayName: string;
  description: string;
  icon: any;
  color: string;
  category: 'social' | 'payment' | 'services' | 'entertainment';
  status: 'native' | 'wrapped' | 'coming-soon';
  externalUrl?: string;
  nativeRoute?: string;
  embedSupported: boolean;
  warning?: string;
}

export const serviceConfigs: Record<string, ServiceConfig> = {
  // Social Media
  'instagram': {
    slug: 'instagram',
    displayName: 'Instagram',
    description: 'Post reels & photos',
    icon: Instagram,
    color: 'from-purple-500 to-pink-500',
    category: 'social',
    status: 'wrapped',
    externalUrl: 'https://www.instagram.com',
    embedSupported: false
  },
  'tiktok': {
    slug: 'tiktok',
    displayName: 'TikTok',
    description: 'Short video clips',
    icon: SiTiktok,
    color: 'from-black to-gray-800',
    category: 'social',
    status: 'wrapped',
    externalUrl: 'https://www.tiktok.com',
    embedSupported: false
  },
  'whatsapp': {
    slug: 'whatsapp',
    displayName: 'WhatsApp',
    description: 'Chat & messaging',
    icon: SiWhatsapp,
    color: 'from-green-500 to-green-600',
    category: 'social',
    status: 'wrapped',
    externalUrl: 'https://web.whatsapp.com',
    embedSupported: true
  },
  'facebook': {
    slug: 'facebook',
    displayName: 'Facebook',
    description: 'Groups & updates',
    icon: Facebook,
    color: 'from-blue-600 to-blue-700',
    category: 'social',
    status: 'wrapped',
    externalUrl: 'https://www.facebook.com',
    embedSupported: false
  },

  // Payments
  'yardflex-wallet': {
    slug: 'yardflex-wallet',
    displayName: 'YardFlex Wallet',
    description: 'Your main wallet',
    icon: DollarSign,
    color: 'from-yellow-500 to-orange-500',
    category: 'payment',
    status: 'native',
    nativeRoute: '/wallet',
    embedSupported: true
  },
  'paypal': {
    slug: 'paypal',
    displayName: 'PayPal',
    description: 'Global payments',
    icon: SiPaypal,
    color: 'from-blue-500 to-blue-600',
    category: 'payment',
    status: 'wrapped',
    externalUrl: 'https://www.paypal.com',
    embedSupported: false,
    warning: 'All transactions are processed through YardFlex Wallet for security'
  },
  'stripe': {
    slug: 'stripe',
    displayName: 'Stripe',
    description: 'Card payments',
    icon: SiStripe,
    color: 'from-indigo-500 to-purple-500',
    category: 'payment',
    status: 'wrapped',
    externalUrl: 'https://dashboard.stripe.com',
    embedSupported: false
  },
  'lynk-jamaica': {
    slug: 'lynk-jamaica',
    displayName: 'LYNK Jamaica',
    description: 'Local JA payments',
    icon: CreditCard,
    color: 'from-green-600 to-yellow-500',
    category: 'payment',
    status: 'wrapped',
    externalUrl: 'https://www.lynk.co.jm',
    embedSupported: false
  },

  // Services
  'yardflex-rides': {
    slug: 'yardflex-rides',
    displayName: 'YardFlex Rides',
    description: '85% driver earnings',
    icon: Car,
    color: 'from-yellow-500 to-orange-500',
    category: 'services',
    status: 'native',
    nativeRoute: '/ride-booking',
    embedSupported: true
  },
  'uber': {
    slug: 'uber',
    displayName: 'Uber',
    description: 'More ride options',
    icon: SiUber,
    color: 'from-black to-gray-700',
    category: 'services',
    status: 'wrapped',
    externalUrl: 'https://www.uber.com',
    embedSupported: false,
    warning: 'Consider YardFlex Rides for 85% driver earnings!'
  },
  'indrive': {
    slug: 'indrive',
    displayName: 'inDrive',
    description: 'Alternative rides',
    icon: Car,
    color: 'from-blue-500 to-green-500',
    category: 'services',
    status: 'wrapped',
    externalUrl: 'https://indrive.com',
    embedSupported: false
  },
  'airbnb': {
    slug: 'airbnb',
    displayName: 'Airbnb',
    description: 'Travel & stays',
    icon: SiAirbnb,
    color: 'from-red-500 to-pink-500',
    category: 'services',
    status: 'wrapped',
    externalUrl: 'https://www.airbnb.com',
    embedSupported: false
  },
  'yardflex-eats': {
    slug: 'yardflex-eats',
    displayName: 'YardFlex Eats',
    description: 'Food delivery',
    icon: UtensilsCrossed,
    color: 'from-yellow-500 to-orange-500',
    category: 'services',
    status: 'coming-soon',
    embedSupported: true
  },

  // Entertainment
  'youtube': {
    slug: 'youtube',
    displayName: 'YouTube',
    description: 'Video hub',
    icon: Youtube,
    color: 'from-red-500 to-red-600',
    category: 'entertainment',
    status: 'wrapped',
    externalUrl: 'https://www.youtube.com',
    embedSupported: true
  },
  'netflix': {
    slug: 'netflix',
    displayName: 'Netflix',
    description: 'Movie streaming',
    icon: SiNetflix,
    color: 'from-red-600 to-black',
    category: 'entertainment',
    status: 'wrapped',
    externalUrl: 'https://www.netflix.com',
    embedSupported: false
  },
  'yardflex-media': {
    slug: 'yardflex-media',
    displayName: 'YardFlex Media',
    description: 'Caribbean content',
    icon: Video,
    color: 'from-yellow-500 to-orange-500',
    category: 'entertainment',
    status: 'native',
    nativeRoute: '/media-hub',
    embedSupported: true
  },
  'tvj-cvm': {
    slug: 'tvj-cvm',
    displayName: 'TVJ/CVM Live',
    description: 'JA live TV',
    icon: Play,
    color: 'from-blue-500 to-green-500',
    category: 'entertainment',
    status: 'wrapped',
    externalUrl: 'https://www.televisionjamaica.com/live',
    embedSupported: true
  }
};

export const categories = [
  { id: 'social', name: 'Social Media', icon: MessageCircle },
  { id: 'payment', name: 'Payments & Wallet', icon: CreditCard },
  { id: 'services', name: 'Services', icon: Car },
  { id: 'entertainment', name: 'Entertainment', icon: Play }
] as const;

export const getServicesByCategory = (category: string) => {
  return Object.values(serviceConfigs).filter(service => service.category === category);
};

export const getServiceBySlug = (slug: string) => {
  return serviceConfigs[slug];
};