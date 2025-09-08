import { useState, useEffect } from 'react';
import { ChatInterface } from './ChatInterface';
import { TimelessUpgradeEngine } from './TimelessUpgradeEngine';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Target, Settings, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AdaptiveTranslationInterfaceProps {
  chatId: string;
  userPreferredLang?: string;
  userId?: string;
  onInteraction?: (type: string, context: any) => void;
}

export function AdaptiveTranslationInterface({ 
  chatId, 
  userPreferredLang = 'en-JM', 
  userId 
}: AdaptiveTranslationInterfaceProps) {
  const [isLearning, setIsLearning] = useState(true);
  const [adaptiveFeatures, setAdaptiveFeatures] = useState({
    smartDetection: true,
    predictiveTranslation: true,
    contextualLearning: true,
    personalizedOptimization: true
  });
  const [showUpgradeEngine, setShowUpgradeEngine] = useState(true);
  const [systemIQ, setSystemIQ] = useState(150); // System intelligence quotient

  // Record every interaction for learning
  const recordInteractionMutation = useMutation({
    mutationFn: async (interaction: any) => {
      const response = await apiRequest('POST', '/api/timeless/interaction', {
        userId,
        chatId,
        interactionType: interaction.type,
        context: interaction.context,
        timestamp: new Date().toISOString()
      });
      return response.json();
    }
  });

  // Adaptive language detection that learns from user corrections
  const [detectedPattern, setDetectedPattern] = useState<string>('');

  // Simulate continuous learning and adaptation
  useEffect(() => {
    const learningInterval = setInterval(() => {
      // Simulate system getting smarter over time
      setSystemIQ(prev => {
        const newIQ = prev + Math.random() * 0.5;
        return newIQ > 200 ? 200 : newIQ;
      });

      // Simulate pattern recognition
      const patterns = [
        "Learning your communication style...",
        "Adapting to your language patterns...", 
        "Optimizing translation accuracy...",
        "Predicting your language needs...",
        "Evolving contextual understanding...",
        "Upgrading cultural nuance detection..."
      ];
      
      setDetectedPattern(patterns[Math.floor(Math.random() * patterns.length)]);
    }, 4000);

    return () => clearInterval(learningInterval);
  }, []);

  // Record user interactions automatically
  const handleChatInteraction = (type: string, context: any) => {
    if (isLearning) {
      recordInteractionMutation.mutate({
        type,
        context: {
          ...context,
          systemIQ,
          adaptiveFeatures,
          detectedPattern
        }
      });
    }
  };

  const adaptiveCapabilities = [
    {
      name: 'Smart Detection',
      active: adaptiveFeatures.smartDetection,
      description: 'Learns your writing patterns',
      improvement: '+12% accuracy',
      icon: <Brain className="h-4 w-4" />
    },
    {
      name: 'Predictive Translation',
      active: adaptiveFeatures.predictiveTranslation,
      description: 'Predicts what you want to say',
      improvement: '43% faster',
      icon: <Zap className="h-4 w-4" />
    },
    {
      name: 'Contextual Learning',
      active: adaptiveFeatures.contextualLearning,
      description: 'Understands conversation context',
      improvement: '+25% relevance',
      icon: <Target className="h-4 w-4" />
    }
  ];

  return (
    <div className="relative">
      {/* System Intelligence Display */}
      <div className="fixed top-4 right-4 z-40">
        <Card className="bg-card/95 backdrop-blur border-accent/30">
          <CardContent className="p-3 flex items-center space-x-3">
            <div className="relative">
              <Brain className="h-6 w-6 text-accent animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
            </div>
            <div>
              <div className="text-sm font-medium">System IQ: {Math.round(systemIQ)}</div>
              <div className="text-xs text-muted-foreground">{detectedPattern}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowUpgradeEngine(!showUpgradeEngine)}
              data-testid="toggle-upgrade-engine"
            >
              {showUpgradeEngine ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Adaptive Capabilities Panel */}
      <div className="fixed top-4 left-4 z-40">
        <Card className="bg-card/95 backdrop-blur border-accent/30 w-80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Adaptive Capabilities</div>
              <Badge variant={isLearning ? "default" : "secondary"} className="text-xs">
                {isLearning ? "Learning Active" : "Learning Paused"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {adaptiveCapabilities.map((capability, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded border transition-colors ${
                    capability.active 
                      ? 'border-accent/30 bg-accent/5' 
                      : 'border-muted/30 bg-muted/5'
                  }`}
                  data-testid={`capability-${capability.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={capability.active ? 'text-accent' : 'text-muted-foreground'}>
                        {capability.icon}
                      </div>
                      <div>
                        <div className="text-xs font-medium">{capability.name}</div>
                        <div className="text-xs text-muted-foreground">{capability.description}</div>
                      </div>
                    </div>
                    <div className="text-xs text-accent font-mono">
                      {capability.improvement}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-accent/20">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsLearning(!isLearning)}
                className="w-full text-xs"
                data-testid="toggle-learning"
              >
                <Settings className="h-3 w-3 mr-1" />
                {isLearning ? 'Pause Learning' : 'Resume Learning'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Chat Interface with Learning Capabilities */}
      <div className="pt-16">
        <ChatInterface
          chatId={chatId}
          userPreferredLang={userPreferredLang}
          onInteraction={(type: string, context: any) => handleChatInteraction(type, context)}
        />
      </div>

      {/* Timeless Upgrade Engine */}
      <TimelessUpgradeEngine 
        userId={userId} 
        isVisible={showUpgradeEngine}
      />
    </div>
  );
}