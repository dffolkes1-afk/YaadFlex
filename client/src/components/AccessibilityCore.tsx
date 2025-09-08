import React, { useState, useEffect, useContext, createContext } from 'react';
import { AccessibilityCore, defaultAccessibilityConfig, type AccessibilityConfig } from '@shared/accessibility-core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff,
  Smartphone,
  Heart,
  Settings,
  Accessibility,
  Headphones,
  Hand
} from 'lucide-react';

// Context for accessibility state
const AccessibilityContext = createContext<{
  accessibilityCore: AccessibilityCore | null;
  config: AccessibilityConfig;
  updateConfig: (config: Partial<AccessibilityConfig>) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}>({
  accessibilityCore: null,
  config: defaultAccessibilityConfig,
  updateConfig: () => {},
  isListening: false,
  setIsListening: () => {}
});

export const useAccessibility = () => useContext(AccessibilityContext);

// Accessibility Provider Component
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AccessibilityConfig>(defaultAccessibilityConfig);
  const [accessibilityCore, setAccessibilityCore] = useState<AccessibilityCore | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const core = new AccessibilityCore(config);
    setAccessibilityCore(core);

    // Announce app ready for screen readers
    if (config.voiceFirst) {
      setTimeout(() => {
        core.speak('YaadFlex is ready. Say "help" to hear available voice commands.');
      }, 2000);
    }

    return () => {
      // Cleanup if needed
    };
  }, [config]);

  const updateConfig = (newConfig: Partial<AccessibilityConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    
    if (accessibilityCore) {
      accessibilityCore.updateConfig(newConfig);
    }
    
    // Save to localStorage
    localStorage.setItem('yaad-accessibility-config', JSON.stringify(updatedConfig));
  };

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('yaad-accessibility-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...defaultAccessibilityConfig, ...parsed });
      } catch (error) {
        console.warn('Failed to load accessibility config:', error);
      }
    }
  }, []);

  const value = {
    accessibilityCore,
    config,
    updateConfig,
    isListening,
    setIsListening
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Voice Command Interface
export function VoiceCommandInterface() {
  const { accessibilityCore, config, isListening, setIsListening } = useAccessibility();
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandResult, setCommandResult] = useState<string>('');

  const startListening = async () => {
    if (!accessibilityCore || !config.voiceFirst) return;

    setIsListening(true);
    
    // Haptic feedback for voice start
    await accessibilityCore.triggerHapticFeedback({
      type: 'info',
      intensity: 0.3,
      duration: 100
    });

    await accessibilityCore.speak('Listening for your command...');
    
    // Mock voice recognition - in production would use real speech recognition
    setTimeout(async () => {
      const mockCommands = [
        'book ride to downtown',
        'check wallet balance',
        'translate hello to spanish',
        'navigate to home'
      ];
      
      const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
      setLastCommand(randomCommand);
      
      const result = await accessibilityCore.processVoiceCommand(randomCommand);
      setCommandResult(result.response);
      
      await accessibilityCore.speak(result.response);
      
      // Haptic feedback for command processed
      await accessibilityCore.triggerHapticFeedback({
        type: result.intent === 'emergency' ? 'error' : 'success',
        intensity: 0.6,
        duration: 150
      });
      
      setIsListening(false);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    accessibilityCore?.speak('Voice command cancelled');
  };

  if (!config.voiceFirst) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="h-5 w-5 text-blue-400" />
          <span>Voice Commands</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={!accessibilityCore}
            className={`w-24 h-24 rounded-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            style={config.bigButtonMode ? { minHeight: '96px', minWidth: '96px' } : {}}
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {isListening ? 'Listening...' : 'Tap to speak'}
          </p>
          
          {lastCommand && (
            <div className="p-2 bg-muted rounded text-xs">
              <strong>You said:</strong> "{lastCommand}"
            </div>
          )}
          
          {commandResult && (
            <div className="p-2 bg-blue-500/10 rounded text-xs text-blue-400">
              <strong>YaadFlex:</strong> {commandResult}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Try saying:</strong></p>
          <ul className="space-y-1 ml-4">
            <li>• "Book a ride to downtown"</li>
            <li>• "Check wallet balance"</li>
            <li>• "Translate hello to Spanish"</li>
            <li>• "Emergency help"</li>
            <li>• "Navigate to home"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Accessibility Settings Panel
export function AccessibilitySettings() {
  const { config, updateConfig, accessibilityCore } = useAccessibility();

  const handleConfigChange = (key: keyof AccessibilityConfig, value: boolean) => {
    updateConfig({ [key]: value });
    
    // Provide feedback
    accessibilityCore?.speak(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
    
    accessibilityCore?.triggerHapticFeedback({
      type: 'success',
      intensity: 0.4,
      duration: 100
    });
  };

  return (
    <Card className="bg-card/95 backdrop-blur border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Accessibility className="h-5 w-5 text-accent" />
          <span>Accessibility Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Voice & Audio */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <span>Voice & Audio</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Voice-First Interface</label>
                <p className="text-xs text-muted-foreground">Control app with voice commands</p>
              </div>
              <Switch
                checked={config.voiceFirst}
                onCheckedChange={(checked) => handleConfigChange('voiceFirst', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Live Captions</label>
                <p className="text-xs text-muted-foreground">Show captions for all audio</p>
              </div>
              <Switch
                checked={config.liveCaptions}
                onCheckedChange={(checked) => handleConfigChange('liveCaptions', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Audio Descriptions</label>
                <p className="text-xs text-muted-foreground">Describe visual content</p>
              </div>
              <Switch
                checked={config.audioDescriptions}
                onCheckedChange={(checked) => handleConfigChange('audioDescriptions', checked)}
              />
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Visual</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Big Button Mode</label>
                <p className="text-xs text-muted-foreground">Larger buttons and touch targets</p>
              </div>
              <Switch
                checked={config.bigButtonMode}
                onCheckedChange={(checked) => handleConfigChange('bigButtonMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Color-Blind Support</label>
                <p className="text-xs text-muted-foreground">High contrast colors and patterns</p>
              </div>
              <Switch
                checked={config.colorBlindSupport}
                onCheckedChange={(checked) => handleConfigChange('colorBlindSupport', checked)}
              />
            </div>
          </div>
        </div>

        {/* Physical */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center space-x-2">
            <Hand className="h-4 w-4" />
            <span>Physical</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Haptic Feedback</label>
                <p className="text-xs text-muted-foreground">Vibration for interactions</p>
              </div>
              <Switch
                checked={config.hapticsEnabled}
                onCheckedChange={(checked) => handleConfigChange('hapticsEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Motor Assistance</label>
                <p className="text-xs text-muted-foreground">Easier touch and gestures</p>
              </div>
              <Switch
                checked={config.motorAssistance}
                onCheckedChange={(checked) => handleConfigChange('motorAssistance', checked)}
              />
            </div>
          </div>
        </div>

        {/* Cognitive */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Cognitive</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Cognitive Support</label>
                <p className="text-xs text-muted-foreground">Simplified interface and clear feedback</p>
              </div>
              <Switch
                checked={config.cognitiveSupport}
                onCheckedChange={(checked) => handleConfigChange('cognitiveSupport', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Low-Spec Mode</label>
                <p className="text-xs text-muted-foreground">Optimized for older devices</p>
              </div>
              <Switch
                checked={config.lowSpecMode}
                onCheckedChange={(checked) => handleConfigChange('lowSpecMode', checked)}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-center space-x-2">
            <Badge className="text-green-400 bg-green-500/10">
              <Heart className="h-3 w-3 mr-1" />
              Accessibility Active
            </Badge>
            <Badge variant="outline" className="text-xs">
              {Object.values(config).filter(Boolean).length} features enabled
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Accessible Button Component with enhanced features
export function AccessibleButton({ 
  children, 
  onClick, 
  ariaLabel,
  variant = 'default',
  size = 'default',
  disabled = false,
  ...props 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'emergency';
  size?: 'default' | 'large' | 'small';
  disabled?: boolean;
  [key: string]: any;
}) {
  const { config, accessibilityCore } = useAccessibility();

  const handleClick = async () => {
    if (disabled || !onClick) return;

    // Haptic feedback
    if (accessibilityCore) {
      await accessibilityCore.triggerHapticFeedback({
        type: variant === 'emergency' ? 'warning' : 'selection',
        intensity: 0.5,
        duration: 50
      });
    }

    // Voice confirmation for important actions
    if (config.voiceFirst && (variant === 'emergency' || variant === 'primary')) {
      await accessibilityCore?.speak(`${ariaLabel || 'Button'} activated`);
    }

    onClick();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-accent hover:bg-accent/90 text-accent-foreground';
      case 'emergency':
        return 'bg-red-500 hover:bg-red-600 text-white animate-pulse';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/90 text-secondary-foreground';
      default:
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
    }
  };

  const getSizeStyles = () => {
    const baseSize = config.bigButtonMode ? 'px-8 py-4 text-lg' : 'px-4 py-2';
    
    switch (size) {
      case 'large':
        return config.bigButtonMode ? 'px-12 py-6 text-xl' : 'px-6 py-3 text-lg';
      case 'small':
        return config.bigButtonMode ? 'px-6 py-3' : 'px-3 py-1.5 text-sm';
      default:
        return baseSize;
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
        ${config.bigButtonMode ? 'min-h-[60px] min-w-[120px]' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
        ${props.className || ''}
      `}
      style={{
        ...config.colorBlindSupport && {
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'currentColor'
        },
        ...props.style
      }}
    >
      {children}
    </button>
  );
}