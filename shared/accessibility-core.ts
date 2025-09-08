// YaadFlex Accessibility Core - Voice-First AI System
// Making the app accessible to blind/low-vision, Deaf/HOH, non-verbal, low-literacy, and motor/cognitive users

export interface AccessibilityConfig {
  voiceFirst: boolean;
  textComplete: boolean;
  bigButtonMode: boolean;
  liveCaptions: boolean;
  hapticsEnabled: boolean;
  audioDescriptions: boolean;
  lowSpecMode: boolean;
  colorBlindSupport: boolean;
  motorAssistance: boolean;
  cognitiveSupport: boolean;
}

export interface VoiceCommandResult {
  intent: string;
  confidence: number;
  parameters: Record<string, any>;
  response: string;
  needsConfirmation: boolean;
}

export interface LiveCaptionData {
  id: string;
  text: string;
  speaker?: string;
  timestamp: Date;
  confidence: number;
  language: string;
}

export interface HapticFeedback {
  type: 'success' | 'error' | 'warning' | 'info' | 'navigation' | 'selection';
  intensity: number; // 0-1
  duration: number; // milliseconds
  pattern?: number[]; // vibration pattern
}

export class AccessibilityCore {
  private config: AccessibilityConfig;
  private speechSynthesis: SpeechSynthesis | null = null;
  private speechRecognition: any = null;
  private isListening = false;

  constructor(config: AccessibilityConfig) {
    this.config = config;
    this.initializeSpeechServices();
  }

  private initializeSpeechServices() {
    if (typeof window !== 'undefined') {
      this.speechSynthesis = window.speechSynthesis;
      
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = 'en-US';
      }
    }
  }

  // Voice-First Navigation and Commands
  async processVoiceCommand(audioData: string): Promise<VoiceCommandResult> {
    // Mock voice processing - in production would use advanced AI
    const command = audioData.toLowerCase();
    
    // Ride booking commands
    if (command.includes('book') && command.includes('ride')) {
      return {
        intent: 'book_ride',
        confidence: 0.95,
        parameters: this.extractRideParameters(command),
        response: 'I\'ll help you book a ride. Where would you like to go?',
        needsConfirmation: true
      };
    }
    
    // Navigation commands
    if (command.includes('go to') || command.includes('navigate')) {
      const destination = this.extractDestination(command);
      return {
        intent: 'navigate',
        confidence: 0.88,
        parameters: { destination },
        response: `Navigating to ${destination}. Please wait.`,
        needsConfirmation: false
      };
    }

    // Wallet commands
    if (command.includes('wallet') || command.includes('balance')) {
      return {
        intent: 'check_wallet',
        confidence: 0.92,
        parameters: {},
        response: 'Checking your wallet balance now.',
        needsConfirmation: false
      };
    }

    // Translate commands
    if (command.includes('translate') || command.includes('say in')) {
      const targetLang = this.extractLanguage(command);
      return {
        intent: 'translate',
        confidence: 0.89,
        parameters: { targetLanguage: targetLang, text: command },
        response: `Translating to ${targetLang}`,
        needsConfirmation: false
      };
    }

    // Emergency commands
    if (command.includes('emergency') || command.includes('help') || command.includes('panic')) {
      return {
        intent: 'emergency',
        confidence: 0.99,
        parameters: { urgency: 'high' },
        response: 'Emergency mode activated. Connecting you to help immediately.',
        needsConfirmation: false
      };
    }

    // Default fallback
    return {
      intent: 'unknown',
      confidence: 0.1,
      parameters: {},
      response: 'I didn\'t understand that command. You can say "book ride", "check wallet", "translate", or ask for help.',
      needsConfirmation: false
    };
  }

  private extractRideParameters(command: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract destinations
    const fromMatch = command.match(/from\s+([^to]+)/i);
    const toMatch = command.match(/to\s+(.+)/i);
    
    if (fromMatch) params.from = fromMatch[1].trim();
    if (toMatch) params.to = toMatch[1].trim();
    
    // Extract vehicle type
    if (command.includes('bike')) params.vehicleType = 'bike';
    else if (command.includes('car')) params.vehicleType = 'car';
    else if (command.includes('van')) params.vehicleType = 'van';
    else if (command.includes('truck')) params.vehicleType = 'truck';
    
    // Extract urgency
    if (command.includes('urgent') || command.includes('emergency')) params.priority = 'high';
    else if (command.includes('later') || command.includes('schedule')) params.priority = 'low';
    
    return params;
  }

  private extractDestination(command: string): string {
    const match = command.match(/(?:go to|navigate to)\s+(.+)/i);
    return match ? match[1].trim() : 'unknown destination';
  }

  private extractLanguage(command: string): string {
    if (command.includes('spanish')) return 'es-HN';
    if (command.includes('swahili')) return 'sw-KE';
    if (command.includes('patois') || command.includes('jamaican')) return 'en-JM';
    if (command.includes('french')) return 'fr-FR';
    if (command.includes('arabic')) return 'ar-SA';
    return 'en-US';
  }

  // Text-to-Speech for screen readers and voice feedback
  async speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }) {
    if (!this.speechSynthesis || !this.config.voiceFirst) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;
    
    // Use appropriate voice for the content language
    const voices = this.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Enhanced')
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.speechSynthesis.speak(utterance);
    
    return new Promise<void>((resolve) => {
      utterance.onend = () => resolve();
    });
  }

  // Live captions for audio content
  generateLiveCaption(audioText: string, speaker?: string): LiveCaptionData {
    return {
      id: `caption_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: audioText,
      speaker: speaker,
      timestamp: new Date(),
      confidence: 0.94,
      language: 'en-US' // Would be detected dynamically
    };
  }

  // Haptic feedback for touch interactions
  async triggerHapticFeedback(feedback: HapticFeedback) {
    if (!this.config.hapticsEnabled || typeof navigator === 'undefined') return;

    try {
      if ('vibrate' in navigator) {
        let pattern: number[];
        
        switch (feedback.type) {
          case 'success':
            pattern = [100, 50, 100];
            break;
          case 'error':
            pattern = [200, 100, 200, 100, 200];
            break;
          case 'warning':
            pattern = [150, 75, 150];
            break;
          case 'navigation':
            pattern = [50];
            break;
          case 'selection':
            pattern = [25];
            break;
          default:
            pattern = feedback.pattern || [feedback.duration || 100];
        }
        
        // Adjust intensity by modifying pattern
        const intensityAdjusted = pattern.map(duration => 
          Math.round(duration * (feedback.intensity || 1))
        );
        
        navigator.vibrate(intensityAdjusted);
      }
    } catch (error) {
      console.warn('Haptic feedback not supported:', error);
    }
  }

  // Audio descriptions for visual content
  generateAudioDescription(element: string, context?: string): string {
    const descriptions: Record<string, string> = {
      'ride_map': 'Interactive map showing available vehicles. Your location is marked with a blue dot. Tap anywhere to set your destination.',
      'wallet_balance': `Wallet showing KWD balance and transaction history. Current balance displayed prominently at the top.`,
      'driver_photo': 'Driver profile photo with star rating and vehicle information below.',
      'trip_progress': 'Live trip tracking showing route progress, estimated arrival time, and driver location.',
      'chat_messages': 'Chat conversation with real-time translation. Tap to speak or type your message.',
      'service_grid': 'Grid of available services including rides, delivery, marketplace, and tools.',
      'emergency_button': 'Large red emergency button. Press and hold for 3 seconds to activate emergency services.'
    };

    const baseDescription = descriptions[element] || `Interactive ${element} element`;
    return context ? `${baseDescription} ${context}` : baseDescription;
  }

  // Big button interface mode
  getBigButtonStyles(): React.CSSProperties {
    if (!this.config.bigButtonMode) return {};
    
    return {
      minHeight: '60px',
      minWidth: '120px',
      fontSize: '18px',
      padding: '16px 24px',
      borderRadius: '12px',
      border: '2px solid currentColor',
      touchAction: 'manipulation', // Prevents double-tap zoom
      userSelect: 'none'
    };
  }

  // Low-spec mode optimizations
  getLowSpecOptimizations(): Record<string, any> {
    if (!this.config.lowSpecMode) return {};
    
    return {
      disableAnimations: true,
      reduceImageQuality: true,
      limitMapDetails: true,
      disableVideoAutoplay: true,
      enableDataSaver: true,
      prefetchDisabled: true,
      renderOptimizations: {
        useVirtualScrolling: true,
        lazyLoadImages: true,
        deferNonCriticalJS: true
      }
    };
  }

  // Color accessibility for color-blind users
  getColorAccessibilityStyles(): Record<string, string> {
    if (!this.config.colorBlindSupport) return {};
    
    return {
      '--accent-primary': '#0066CC', // High contrast blue
      '--accent-success': '#228B22', // Forest green
      '--accent-warning': '#FFD700', // Gold instead of yellow
      '--accent-error': '#DC143C', // Crimson red
      '--accent-info': '#4169E1', // Royal blue
      // Ensure sufficient contrast ratios
      '--text-high-contrast': '#000000',
      '--background-high-contrast': '#FFFFFF'
    };
  }

  // Motor assistance - larger touch targets and gesture support
  getMotorAssistanceConfig(): Record<string, any> {
    if (!this.config.motorAssistance) return {};
    
    return {
      touchTargetMinSize: '48px', // WCAG AAA guideline
      gestureTimeouts: {
        tap: 500, // Extended tap recognition
        hold: 1000, // Longer hold duration
        swipe: 300 // More forgiving swipe timing
      },
      dragThreshold: 10, // Pixels before drag starts
      enableSticky: true, // Sticky drag for easier manipulation
      mouseSupport: true, // Full keyboard and mouse navigation
      focusVisible: true // Always show focus indicators
    };
  }

  // Cognitive support - simplified interfaces and clear feedback
  getCognitiveSupport(): Record<string, any> {
    if (!this.config.cognitiveSupport) return {};
    
    return {
      simplifiedUI: true,
      clearFeedback: true,
      progressIndicators: true,
      confirmationDialogs: true,
      undoActions: true,
      breadcrumbNavigation: true,
      consistentLayouts: true,
      minimizeOptions: true, // Reduce cognitive load
      timeoutExtensions: true // Longer timeouts for interactions
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<AccessibilityConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Trigger haptic feedback for config changes
    if (newConfig.hapticsEnabled !== undefined) {
      this.triggerHapticFeedback({
        type: 'success',
        intensity: 0.5,
        duration: 100
      });
    }
  }

  // Get current config
  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }
}

// Default accessibility configuration
export const defaultAccessibilityConfig: AccessibilityConfig = {
  voiceFirst: true,
  textComplete: true,
  bigButtonMode: false,
  liveCaptions: false,
  hapticsEnabled: true,
  audioDescriptions: false,
  lowSpecMode: false,
  colorBlindSupport: false,
  motorAssistance: false,
  cognitiveSupport: false
};

// Accessibility utility functions
export const AccessibilityUtils = {
  // Check if device supports accessibility features
  checkDeviceCapabilities: () => {
    const capabilities = {
      speechSynthesis: 'speechSynthesis' in window,
      speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
      vibration: 'vibrate' in navigator,
      mediaDevices: 'mediaDevices' in navigator,
      touchSupport: 'ontouchstart' in window,
      orientationSupport: 'orientation' in screen
    };
    
    return capabilities;
  },

  // Generate accessible ARIA labels
  generateAriaLabel: (element: string, state?: string, context?: string): string => {
    const labels: Record<string, string> = {
      'book_ride_button': 'Book a ride',
      'wallet_button': 'Open wallet',
      'emergency_button': 'Emergency assistance',
      'translate_button': 'Translate message',
      'settings_button': 'Accessibility settings'
    };
    
    const baseLabel = labels[element] || element.replace(/_/g, ' ');
    const stateLabel = state ? `, ${state}` : '';
    const contextLabel = context ? `. ${context}` : '';
    
    return `${baseLabel}${stateLabel}${contextLabel}`;
  },

  // Keyboard navigation helpers
  createKeyboardHandler: (onAction: () => void) => {
    return (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onAction();
      }
    };
  }
};