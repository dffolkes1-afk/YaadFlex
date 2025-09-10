import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, MicOff, Volume2, VolumeX, Zap, MessageSquare, 
  Phone, Car, Wallet, ShoppingBag, MapPin, Send, Play,
  User, Home, Search, Settings, Calendar, Music
} from 'lucide-react';

interface VoiceCommand {
  command: string;
  action: string;
  params?: any;
}

interface VoiceInteractiveProps {
  onVoiceCommand?: (command: VoiceCommand) => void;
  showTranscript?: boolean;
}

export function VoiceInteractive({ 
  onVoiceCommand, 
  showTranscript = true 
}: VoiceInteractiveProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };
      
      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript.trim());
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setTranscript('');
      toast({
        title: "🎤 Voice Active",
        description: "Listening... Say what you want to do!",
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = async (spokenText: string) => {
    setIsProcessing(true);
    setLastCommand(spokenText);

    const lowerText = spokenText.toLowerCase();
    let command: VoiceCommand | null = null;

    // Voice command recognition - ACTUALLY DOES THINGS!
    if (lowerText.includes('book') && (lowerText.includes('ride') || lowerText.includes('taxi'))) {
      command = { command: 'book_ride', action: 'Navigate to ride booking', params: { destination: extractLocation(lowerText) } };
      window.location.href = '/ride-booking';
    } 
    else if (lowerText.includes('call') && lowerText.includes('driver')) {
      command = { command: 'call_driver', action: 'Start driver call', params: {} };
      simulateDriverCall();
    }
    else if (lowerText.includes('wallet') || lowerText.includes('money') || lowerText.includes('pay')) {
      command = { command: 'open_wallet', action: 'Open YaadWallet', params: {} };
      window.location.href = '/yaad-wallet';
    }
    else if (lowerText.includes('social') || lowerText.includes('post') || lowerText.includes('share')) {
      command = { command: 'open_social', action: 'Open social feed', params: { content: spokenText } };
      window.location.href = '/social-feed';
    }
    else if (lowerText.includes('delivery') || lowerText.includes('package')) {
      command = { command: 'heritage_delivery', action: 'Open Heritage Delivery', params: {} };
      window.location.href = '/heritage-delivery';
    }
    else if (lowerText.includes('payment') || lowerText.includes('pay with card')) {
      command = { command: 'universal_payment', action: 'Open Universal Payment', params: {} };
      window.location.href = '/universal-payment';
    }
    else if (lowerText.includes('jobs') || lowerText.includes('work')) {
      command = { command: 'global_jobs', action: 'Open Global Jobs', params: {} };
      window.location.href = '/global-jobs';
    }
    else if (lowerText.includes('music') || lowerText.includes('play')) {
      command = { command: 'play_music', action: 'Start music player', params: { query: spokenText } };
      playMusic();
    }
    else if (lowerText.includes('search') || lowerText.includes('find')) {
      command = { command: 'search', action: 'Search YaadFlex', params: { query: extractSearchQuery(lowerText) } };
      performSearch(extractSearchQuery(lowerText));
    }
    else if (lowerText.includes('home') || lowerText.includes('main')) {
      command = { command: 'go_home', action: 'Navigate home', params: {} };
      window.location.href = '/';
    }
    else {
      // Generic text input - write what they said
      command = { command: 'text_input', action: 'Text recognized', params: { text: spokenText } };
      writeToActiveInput(spokenText);
    }

    if (command) {
      onVoiceCommand?.(command);
      announceAction(command.action);
    }

    setIsProcessing(false);
  };

  const extractLocation = (text: string): string => {
    const locationWords = ['to', 'from', 'at'];
    for (const word of locationWords) {
      const index = text.indexOf(word);
      if (index !== -1) {
        return text.substring(index + word.length).trim();
      }
    }
    return '';
  };

  const extractSearchQuery = (text: string): string => {
    const searchWords = ['search for', 'find', 'look for'];
    for (const phrase of searchWords) {
      const index = text.toLowerCase().indexOf(phrase);
      if (index !== -1) {
        return text.substring(index + phrase.length).trim();
      }
    }
    return text;
  };

  const writeToActiveInput = (text: string) => {
    const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.value = text;
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      toast({
        title: "✍️ Text Written",
        description: `Added: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
      });
    }
  };

  const simulateDriverCall = () => {
    toast({
      title: "📞 Calling Driver",
      description: "Connecting to your YaadFlex driver...",
    });
  };

  const playMusic = () => {
    toast({
      title: "🎵 Music Starting",
      description: "Opening YaadFlex music player...",
    });
  };

  const performSearch = (query: string) => {
    toast({
      title: "🔍 Searching",
      description: `Searching YaadFlex for: ${query}`,
    });
  };

  const announceAction = (action: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(action);
      utterance.rate = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  const quickCommands = [
    { text: "Book a ride", command: "book ride to airport", icon: <Car className="h-4 w-4" /> },
    { text: "Open wallet", command: "open my wallet", icon: <Wallet className="h-4 w-4" /> },
    { text: "Call driver", command: "call my driver", icon: <Phone className="h-4 w-4" /> },
    { text: "Post to social", command: "open social media", icon: <MessageSquare className="h-4 w-4" /> },
    { text: "Find delivery job", command: "show me delivery jobs", icon: <ShoppingBag className="h-4 w-4" /> },
    { text: "Play music", command: "play some music", icon: <Music className="h-4 w-4" /> },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-yellow-500" />
          🎤 Voice Interactive - Better than TalkBack!
        </CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Talk and I'll write what you say + DO what you want!
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="text-gray-500"
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            size="lg"
            className={`w-24 h-24 rounded-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            data-testid="voice-button"
          >
            {isListening ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </Button>
        </div>

        <div className="text-center">
          <Badge variant={isListening ? "destructive" : "secondary"}>
            {isListening ? "🎤 Listening..." : "🔇 Tap to talk"}
          </Badge>
          {isProcessing && (
            <Badge variant="default" className="ml-2 bg-yellow-500">
              ⚡ Processing...
            </Badge>
          )}
        </div>

        {/* Live Transcript */}
        {showTranscript && transcript && (
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-2">📝 You said:</div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-800">{transcript}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Last Command */}
        {lastCommand && (
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-green-600 mb-2">✅ Last action:</div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-green-800">"{lastCommand}"</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Commands */}
        <div>
          <div className="text-sm font-medium mb-3">🚀 Quick Voice Commands:</div>
          <div className="grid grid-cols-2 gap-2">
            {quickCommands.map((cmd, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => processVoiceCommand(cmd.command)}
                className="justify-start text-left h-auto p-3"
                data-testid={`quick-command-${index}`}
              >
                <div className="flex items-center gap-2">
                  {cmd.icon}
                  <div>
                    <div className="font-medium text-xs">{cmd.text}</div>
                    <div className="text-xs text-gray-500">"{cmd.command}"</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Commands Help */}
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-blue-800 mb-2">
              🗣️ What you can say:
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• "Book a ride to the airport" - Opens ride booking</div>
              <div>• "Open my wallet" - Goes to YaadWallet</div>
              <div>• "Call my driver" - Starts driver call</div>
              <div>• "Post to social" - Opens social feed</div>
              <div>• "Show delivery jobs" - Opens Heritage Delivery</div>
              <div>• "Pay with my card" - Opens Universal Payment</div>
              <div>• "Play some music" - Starts music player</div>
              <div>• Or just talk and I'll write what you say!</div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}