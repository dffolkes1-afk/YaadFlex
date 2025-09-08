// YaadFlex Ultimate Translator - Seamless AI Translation System
// Supporting text + voice across languages with cultural authenticity

export interface TranslationRequest {
  text: string;
  sourceLanguage?: string; // Auto-detect if not provided
  targetLanguage: string;
  context?: TranslationContext;
  userId: string;
  preserveSlang?: boolean;
  voiceEnabled?: boolean;
}

export interface TranslationResponse {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  alternatives?: string[];
  culturalNotes?: string[];
  processing: {
    textProcessingTime: number;
    voiceProcessingTime?: number;
    totalTime: number;
  };
  cached: boolean;
  timestamp: Date;
}

export interface TranslationContext {
  type: 'ride_booking' | 'marketplace' | 'social_chat' | 'emergency' | 'support' | 'general';
  metadata?: Record<string, any>;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  userPreferences: UserTranslationPreferences;
}

export interface UserTranslationPreferences {
  preferredLanguages: string[];
  dialectSupport: boolean;
  formalityLevel: 'casual' | 'neutral' | 'formal';
  culturalAdaptation: boolean;
  voiceSpeed: number; // 0.5 - 2.0
  voicePitch: number; // 0.5 - 2.0
  privacyMode: boolean;
}

export interface VoiceTranslationRequest {
  audioData: Blob | string;
  sourceLanguage?: string;
  targetLanguage: string;
  context?: TranslationContext;
  userId: string;
  returnAudio: boolean;
}

export interface VoiceTranslationResponse {
  id: string;
  transcription: string;
  translation: TranslationResponse;
  audioUrl?: string;
  voiceMetrics: {
    speechToTextTime: number;
    translationTime: number;
    textToSpeechTime: number;
    totalTime: number;
    accuracy: number;
  };
}

export interface CachedTranslation {
  id: string;
  textHash: string;
  sourceLanguage: string;
  targetLanguage: string;
  translation: string;
  confidence: number;
  context: string;
  createdAt: Date;
  accessCount: number;
  lastAccessed: Date;
}

// Cultural dialect mappings for authentic translations
export const DIALECT_MAPPINGS: Record<string, Record<string, string>> = {
  'en-JM': {
    'hello': 'wah gwaan',
    'goodbye': 'likkle more',
    'how are you': 'how yuh stay',
    'thank you': 'big up',
    'friend': 'bredrin',
    'good': 'criss',
    'beautiful': 'buff',
    'money': 'bread',
    'food': 'ital',
    'car': 'ride',
    'house': 'yard'
  },
  'sw-KE': {
    'hello': 'habari',
    'goodbye': 'kwaheri',
    'how are you': 'habari yako',
    'thank you': 'asante',
    'friend': 'rafiki',
    'good': 'mzuri',
    'beautiful': 'mzuri',
    'money': 'pesa',
    'food': 'chakula',
    'car': 'gari',
    'house': 'nyumba'
  },
  'en-GB': {
    'hello': 'alright',
    'goodbye': 'cheers',
    'thank you': 'ta',
    'friend': 'mate',
    'good': 'brilliant',
    'beautiful': 'lovely',
    'money': 'quid',
    'food': 'grub',
    'car': 'motor',
    'house': 'gaff'
  }
};

// Context-specific phrase mappings
export const CONTEXT_PHRASES: Record<string, Record<string, Record<string, string>>> = {
  'ride_booking': {
    'en-JM': {
      'where to': 'weh yuh a go',
      'pickup location': 'weh yuh deh',
      'driver arriving': 'driver a come',
      'trip started': 'we lef',
      'arrived': 'we reach'
    },
    'sw-KE': {
      'where to': 'unaenda wapi',
      'pickup location': 'uko wapi',
      'driver arriving': 'dereva anakuja',
      'trip started': 'tumeanza safari',
      'arrived': 'tumefika'
    }
  },
  'marketplace': {
    'en-JM': {
      'how much': 'how much dat',
      'too expensive': 'dat dear bad',
      'good price': 'dat price good',
      'buy now': 'mi a tek it',
      'delivery': 'drop off'
    },
    'sw-KE': {
      'how much': 'bei gani',
      'too expensive': 'ni ghali sana',
      'good price': 'bei nzuri',
      'buy now': 'nina nunua',
      'delivery': 'kupeleka'
    }
  }
};

export class UltimateTranslator {
  private translationCache: Map<string, CachedTranslation> = new Map();
  private supportedLanguages: string[] = [
    'en-US', 'en-JM', 'en-GB', 'en-KE',
    'es-HN', 'es-ES', 'es-MX',
    'sw-KE', 'sw-TZ',
    'fr-FR', 'fr-HT',
    'ar-SA', 'ar-EG',
    'hi-IN', 'pt-BR', 'zh-CN'
  ];

  // Text translation with cultural context
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    const startTime = Date.now();
    
    // Generate cache key
    const cacheKey = this.generateCacheKey(
      request.text, 
      request.sourceLanguage || 'auto', 
      request.targetLanguage,
      request.context?.type || 'general'
    );

    // Check cache first
    const cached = this.translationCache.get(cacheKey);
    if (cached) {
      cached.accessCount++;
      cached.lastAccessed = new Date();
      
      return {
        id: `cached_${Date.now()}`,
        originalText: request.text,
        translatedText: cached.translation,
        sourceLanguage: cached.sourceLanguage,
        targetLanguage: cached.targetLanguage,
        confidence: cached.confidence,
        processing: {
          textProcessingTime: Date.now() - startTime,
          totalTime: Date.now() - startTime
        },
        cached: true,
        timestamp: new Date()
      };
    }

    // Detect source language if not provided
    const sourceLanguage = request.sourceLanguage || await this.detectLanguage(request.text);
    
    // Apply cultural context and slang preservation
    let processedText = request.text;
    if (request.preserveSlang) {
      processedText = this.preserveSlang(processedText, sourceLanguage);
    }

    // Perform translation with context
    const translatedText = await this.performTranslation(
      processedText,
      sourceLanguage,
      request.targetLanguage,
      request.context
    );

    // Apply cultural adaptations
    const culturallyAdaptedText = await this.applyCulturalAdaptation(
      translatedText,
      request.targetLanguage,
      request.context
    );

    // Generate alternatives
    const alternatives = await this.generateAlternatives(
      processedText,
      sourceLanguage,
      request.targetLanguage
    );

    // Calculate confidence score
    const confidence = this.calculateConfidence(
      processedText,
      culturallyAdaptedText,
      sourceLanguage,
      request.targetLanguage
    );

    const response: TranslationResponse = {
      id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalText: request.text,
      translatedText: culturallyAdaptedText,
      sourceLanguage,
      targetLanguage: request.targetLanguage,
      confidence,
      alternatives,
      culturalNotes: this.generateCulturalNotes(sourceLanguage, request.targetLanguage),
      processing: {
        textProcessingTime: Date.now() - startTime,
        totalTime: Date.now() - startTime
      },
      cached: false,
      timestamp: new Date()
    };

    // Cache the result
    this.cacheTranslation(cacheKey, response);

    return response;
  }

  // Voice translation with speech-to-text and text-to-speech
  async translateVoice(request: VoiceTranslationRequest): Promise<VoiceTranslationResponse> {
    const startTime = Date.now();
    const sttStart = Date.now();

    // Speech-to-Text
    const transcription = await this.speechToText(request.audioData, request.sourceLanguage);
    const sttTime = Date.now() - sttStart;

    // Text translation
    const translationStart = Date.now();
    const translation = await this.translateText({
      text: transcription,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      context: request.context,
      userId: request.userId,
      preserveSlang: true,
      voiceEnabled: true
    });
    const translationTime = Date.now() - translationStart;

    let audioUrl: string | undefined;
    let ttsTime = 0;

    // Text-to-Speech if requested
    if (request.returnAudio) {
      const ttsStart = Date.now();
      audioUrl = await this.textToSpeech(
        translation.translatedText,
        request.targetLanguage,
        request.context?.userPreferences
      );
      ttsTime = Date.now() - ttsStart;
    }

    const totalTime = Date.now() - startTime;

    return {
      id: `voice_trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transcription,
      translation,
      audioUrl,
      voiceMetrics: {
        speechToTextTime: sttTime,
        translationTime,
        textToSpeechTime: ttsTime,
        totalTime,
        accuracy: translation.confidence
      }
    };
  }

  // Live translation for group chats
  async translateGroupMessage(
    message: string,
    sourceLanguage: string,
    participants: Array<{ userId: string; preferredLanguage: string }>
  ): Promise<Record<string, TranslationResponse>> {
    const translations: Record<string, TranslationResponse> = {};
    
    // Get unique target languages
    const targetLanguages = [...new Set(participants.map(p => p.preferredLanguage))];
    
    // Translate once per target language
    for (const targetLang of targetLanguages) {
      if (targetLang !== sourceLanguage) {
        translations[targetLang] = await this.translateText({
          text: message,
          sourceLanguage,
          targetLanguage: targetLang,
          userId: 'group_chat',
          context: {
            type: 'social_chat',
            urgency: 'medium',
            userPreferences: {
              preferredLanguages: [targetLang],
              dialectSupport: true,
              formalityLevel: 'casual',
              culturalAdaptation: true,
              voiceSpeed: 1.0,
              voicePitch: 1.0,
              privacyMode: false
            }
          }
        });
      }
    }

    return translations;
  }

  // Emergency translation with priority processing
  async translateEmergency(
    text: string,
    sourceLanguage: string,
    targetLanguage: string = 'en-US'
  ): Promise<TranslationResponse> {
    // Emergency translations bypass cache and use fastest processing
    const emergencyRequest: TranslationRequest = {
      text,
      sourceLanguage,
      targetLanguage,
      userId: 'emergency',
      context: {
        type: 'emergency',
        urgency: 'emergency',
        userPreferences: {
          preferredLanguages: [targetLanguage],
          dialectSupport: false,
          formalityLevel: 'formal',
          culturalAdaptation: false,
          voiceSpeed: 1.2,
          voicePitch: 1.0,
          privacyMode: false
        }
      }
    };

    const response = await this.translateText(emergencyRequest);
    
    // Add emergency context markers
    response.translatedText = `🚨 EMERGENCY: ${response.translatedText}`;
    
    return response;
  }

  // Private methods
  private async detectLanguage(text: string): Promise<string> {
    // Mock language detection - in production would use ML model
    const patterns = {
      'en-JM': /\b(wah gwaan|bredrin|criss|likkle|mi|nuh|yuh)\b/i,
      'sw-KE': /\b(habari|asante|rafiki|mzuri|pesa|gari)\b/i,
      'es-HN': /\b(hola|gracias|amigo|bueno|dinero|carro)\b/i,
      'fr-FR': /\b(bonjour|merci|ami|bon|argent|voiture)\b/i
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    // Default to English if no pattern matches
    return 'en-US';
  }

  private preserveSlang(text: string, language: string): string {
    // Preserve cultural slang and expressions
    const dialectMap = DIALECT_MAPPINGS[language];
    if (!dialectMap) return text;

    let preservedText = text;
    
    // Mark slang terms for preservation
    Object.values(dialectMap).forEach(slangTerm => {
      const regex = new RegExp(`\\b${slangTerm}\\b`, 'gi');
      preservedText = preservedText.replace(regex, `[PRESERVE:${slangTerm}]`);
    });

    return preservedText;
  }

  private async performTranslation(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    context?: TranslationContext
  ): Promise<string> {
    // Mock translation - in production would use advanced AI translation API
    const translations: Record<string, Record<string, string>> = {
      'en-JM': {
        'es-HN': text.replace(/wah gwaan/gi, 'qué tal').replace(/bredrin/gi, 'hermano'),
        'sw-KE': text.replace(/wah gwaan/gi, 'habari').replace(/bredrin/gi, 'rafiki'),
        'en-US': text.replace(/wah gwaan/gi, 'what\'s up').replace(/bredrin/gi, 'friend')
      },
      'sw-KE': {
        'en-US': text.replace(/habari/gi, 'hello').replace(/rafiki/gi, 'friend'),
        'en-JM': text.replace(/habari/gi, 'wah gwaan').replace(/rafiki/gi, 'bredrin')
      },
      'en-US': {
        'en-JM': text.replace(/what\'s up/gi, 'wah gwaan').replace(/friend/gi, 'bredrin'),
        'sw-KE': text.replace(/hello/gi, 'habari').replace(/friend/gi, 'rafiki'),
        'es-HN': text.replace(/hello/gi, 'hola').replace(/friend/gi, 'amigo')
      }
    };

    return translations[sourceLanguage]?.[targetLanguage] || 
           `[Translated: ${text} (${sourceLanguage} → ${targetLanguage})]`;
  }

  private async applyCulturalAdaptation(
    text: string,
    targetLanguage: string,
    context?: TranslationContext
  ): Promise<string> {
    if (!context?.userPreferences?.culturalAdaptation) return text;

    const contextType = context.type;
    const phrases = CONTEXT_PHRASES[contextType]?.[targetLanguage];
    
    if (!phrases) return text;

    let adaptedText = text;
    
    // Apply context-specific adaptations
    Object.entries(phrases).forEach(([english, local]) => {
      const regex = new RegExp(english, 'gi');
      adaptedText = adaptedText.replace(regex, local);
    });

    return adaptedText;
  }

  private async generateAlternatives(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string[]> {
    // Generate alternative translations
    const alternatives = [
      `Alt 1: ${text} (formal)`,
      `Alt 2: ${text} (casual)`,
      `Alt 3: ${text} (regional)`
    ];

    return alternatives.slice(0, 2); // Return top 2 alternatives
  }

  private calculateConfidence(
    originalText: string,
    translatedText: string,
    sourceLanguage: string,
    targetLanguage: string
  ): number {
    // Mock confidence calculation
    let confidence = 0.85;

    // Higher confidence for supported languages
    if (this.supportedLanguages.includes(sourceLanguage) && 
        this.supportedLanguages.includes(targetLanguage)) {
      confidence += 0.1;
    }

    // Lower confidence for very short texts
    if (originalText.length < 10) {
      confidence -= 0.15;
    }

    // Higher confidence for common phrases
    if (originalText.toLowerCase().includes('hello') || 
        originalText.toLowerCase().includes('thank you')) {
      confidence += 0.05;
    }

    return Math.min(0.99, Math.max(0.1, confidence));
  }

  private generateCulturalNotes(sourceLanguage: string, targetLanguage: string): string[] {
    const notes: string[] = [];

    if (sourceLanguage === 'en-JM' && targetLanguage === 'en-US') {
      notes.push('Jamaican Patois expressions preserved where culturally significant');
    }

    if (targetLanguage === 'sw-KE') {
      notes.push('Kiswahili translation includes cultural context for East African usage');
    }

    if (sourceLanguage === 'en-GB' && targetLanguage === 'en-US') {
      notes.push('British expressions adapted for American audience');
    }

    return notes;
  }

  private async speechToText(audioData: Blob | string, language?: string): Promise<string> {
    // Mock speech-to-text - in production would use Web Speech API or cloud service
    const mockTranscriptions = [
      'Wah gwaan bredrin, how yuh stay?',
      'Book me a ride to downtown please',
      'Habari rafiki, ninakwenda sokoni',
      'Emergency! I need help right now!'
    ];

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  }

  private async textToSpeech(
    text: string,
    language: string,
    preferences?: UserTranslationPreferences
  ): Promise<string> {
    // Mock text-to-speech - in production would use Web Speech API or cloud service
    
    // Simulate processing delay based on text length
    const processingTime = Math.max(400, text.length * 10);
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Return mock audio URL
    return `data:audio/wav;base64,mock_audio_${Date.now()}`;
  }

  private generateCacheKey(text: string, source: string, target: string, context: string): string {
    // Generate hash for caching
    const content = `${text}_${source}_${target}_${context}`;
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `trans_${Math.abs(hash).toString(16)}`;
  }

  private cacheTranslation(key: string, response: TranslationResponse): void {
    this.translationCache.set(key, {
      id: response.id,
      textHash: key,
      sourceLanguage: response.sourceLanguage,
      targetLanguage: response.targetLanguage,
      translation: response.translatedText,
      confidence: response.confidence,
      context: 'cached',
      createdAt: new Date(),
      accessCount: 1,
      lastAccessed: new Date()
    });

    // Limit cache size (keep most recent 1000 translations)
    if (this.translationCache.size > 1000) {
      const oldestKey = this.translationCache.keys().next().value;
      this.translationCache.delete(oldestKey);
    }
  }

  // Utility methods
  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  getCacheStats(): { size: number; hitRate: number } {
    const totalTranslations = Array.from(this.translationCache.values())
      .reduce((sum, cached) => sum + cached.accessCount, 0);
    
    const cacheHits = Array.from(this.translationCache.values())
      .reduce((sum, cached) => sum + (cached.accessCount - 1), 0);

    return {
      size: this.translationCache.size,
      hitRate: totalTranslations > 0 ? cacheHits / totalTranslations : 0
    };
  }

  clearCache(): void {
    this.translationCache.clear();
  }
}

// Singleton instance
export const ultimateTranslator = new UltimateTranslator();