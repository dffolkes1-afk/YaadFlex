import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, MicOff, Volume2, VolumeX, Zap, MessageSquare, 
  Phone, Car, Wallet, ShoppingBag, Music, 
  Star, TrendingUp, Globe, Heart
} from 'lucide-react';
import { BuiltInErrorMonitor } from '@/components/BuiltInErrorMonitor';

export default function VoiceDemo() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);
  const recognitionRef = useRef<any>(null);
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
        toast({
          title: "Voice Error",
          description: `Speech recognition error: ${event.error}. Try again!`,
          variant: "destructive",
        });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      recognitionRef.current = recognitionInstance;
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition. Try Chrome or Safari!",
        variant: "destructive",
      });
    }
  }, []);

  const startListening = () => {
    const rec = recognitionRef.current || recognition;
    if (rec) {
      try {
        rec.start();
        setTranscript('');
        toast({
          title: "Voice Active",
          description: "Listening... Say what you want to do!",
        });
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        toast({
          title: "Voice Error",
          description: "Could not start voice recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    const rec = recognitionRef.current || recognition;
    if (rec) {
      try {
        rec.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
        setIsListening(false);
      }
    }
  };

  const processVoiceCommand = async (spokenText: string) => {
    setIsProcessing(true);
    setLastCommand(spokenText);

    const lowerText = spokenText.toLowerCase();
    let actionTaken = '';

    // Voice command recognition - ACTUALLY DOES THINGS!
    if (lowerText.includes('book') && (lowerText.includes('ride') || lowerText.includes('taxi'))) {
      actionTaken = 'Navigate to ride booking';
      toast({
        title: "Booking Ride",
        description: "Opening YaadFlex ride booking...",
      });
      setTimeout(() => window.location.href = '/ride-booking', 1000);
    } 
    else if (lowerText.includes('call') && lowerText.includes('driver')) {
      actionTaken = 'Start driver call';
      toast({
        title: "Calling Driver",
        description: "Connecting to your YaadFlex driver...",
      });
    }
    else if (lowerText.includes('wallet') || lowerText.includes('money') || lowerText.includes('pay')) {
      actionTaken = 'Open YaadWallet';
      toast({
        title: "Opening Wallet",
        description: "YaadWallet loading...",
      });
      setTimeout(() => window.location.href = '/yaad-wallet', 1000);
    }
    else if (lowerText.includes('social') || lowerText.includes('post') || lowerText.includes('share')) {
      actionTaken = 'Open social feed';
      toast({
        title: "Opening Social",
        description: "YaadFlex social feed loading...",
      });
      setTimeout(() => window.location.href = '/social-feed', 1000);
    }
    else if (lowerText.includes('delivery') || lowerText.includes('package')) {
      actionTaken = 'Open Heritage Delivery';
      toast({
        title: "Delivery Jobs",
        description: "Heritage Delivery loading...",
      });
      setTimeout(() => window.location.href = '/heritage-delivery', 1000);
    }
    else if (lowerText.includes('payment') || lowerText.includes('pay with card')) {
      actionTaken = 'Open Universal Payment';
      toast({
        title: "Universal Payment",
        description: "Opening payment system...",
      });
      setTimeout(() => window.location.href = '/universal-payment', 1000);
    }
    else if (lowerText.includes('music') || lowerText.includes('play')) {
      actionTaken = 'Start music player';
      toast({
        title: "Playing Music",
        description: "YaadFlex music starting...",
      });
    }
    else if (lowerText.includes('home') || lowerText.includes('main')) {
      actionTaken = 'Navigate home';
      toast({
        title: "Going Home",
        description: "Navigating to main page...",
      });
      setTimeout(() => window.location.href = '/', 1000);
    }
    else {
      // Generic text input - write what they said
      actionTaken = 'Text recognized and written';
      writeToActiveInput(spokenText);
      toast({
        title: "Text Written",
        description: `Wrote: "${spokenText.substring(0, 30)}${spokenText.length > 30 ? '...' : ''}"`,
      });
    }

    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(actionTaken);
      utterance.rate = 1.2;
      speechSynthesis.speak(utterance);
    }

    setIsProcessing(false);
  };

  const writeToActiveInput = (text: string) => {
    const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.value = text;
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
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
    <div className="min-h-screen bg-white">
      {/* Built-in Error Monitor - Always watching like car dashboard */}
      <BuiltInErrorMonitor />
      
      {/* Simple Header */}
      <div className="bg-gray-50 border-b py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-medium text-gray-900 mb-3">
            Voice Interactive
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Talk to your app - it writes what you say and does what you want. Better than TalkBack.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        
        {/* Simple Voice Controller */}
        <Card className="w-full max-w-xl mx-auto mb-8 border border-gray-200">
          <CardContent className="p-8">
            
            {/* Clean Voice Button */}
            <div className="flex flex-col items-center space-y-6">
              <Button
                onClick={isListening ? stopListening : startListening}
                size="lg"
                className={`w-20 h-20 rounded-full border transition-all ${
                  isListening 
                    ? 'bg-gray-900 hover:bg-gray-800 border-gray-900' 
                    : 'bg-gray-800 hover:bg-gray-900 border-gray-800'
                }`}
                data-testid="voice-button"
              >
                {isListening ? (
                  <MicOff className="h-6 w-6 text-white" />
                ) : (
                  <Mic className="h-6 w-6 text-white" />
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isListening ? "Listening..." : "Tap to speak"}
                </p>
                {isProcessing && (
                  <p className="text-xs text-gray-600 mt-1">Processing...</p>
                )}
              </div>
            </div>

            {/* Live Transcript */}
            {transcript && (
              <div className="mt-6">
                <div className="text-xs text-gray-500 mb-2">You said:</div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-gray-900 text-sm">{transcript}</p>
                </div>
              </div>
            )}

            {/* Last Command */}
            {lastCommand && (
              <div className="mt-4">
                <div className="text-xs text-gray-600 mb-2">Action taken:</div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-gray-800 text-sm">"{lastCommand}"</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Simple Quick Commands */}
        <Card className="w-full max-w-xl mx-auto mb-8 border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Commands</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickCommands.map((cmd, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => processVoiceCommand(cmd.command)}
                  className="justify-start text-left h-auto p-3 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  data-testid={`quick-command-${index}`}
                >
                  <div className="flex items-center gap-2">
                    {cmd.icon}
                    <span className="text-xs">{cmd.text}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Simple Commands List */}
        <Card className="w-full max-w-xl mx-auto border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Voice Commands</h3>
            <div className="grid md:grid-cols-2 gap-3 text-xs text-gray-600">
              <div>
                <div className="font-medium mb-2 text-gray-800">Rides</div>
                <ul className="space-y-1">
                  <li>"Book a ride"</li>
                  <li>"Call my driver"</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-800">Money</div>
                <ul className="space-y-1">
                  <li>"Open my wallet"</li>
                  <li>"Pay with card"</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-800">Social</div>
                <ul className="space-y-1">
                  <li>"Post to social"</li>
                  <li>"Open social feed"</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-800">Work</div>
                <ul className="space-y-1">
                  <li>"Show delivery jobs"</li>
                  <li>"Find work"</li>
                </ul>
              </div>
            </div>
            
            {/* Test Input Field */}
            <div className="mt-6 pt-4 border-t">
              <div className="text-xs text-gray-600 mb-2">Test voice-to-text:</div>
              <input 
                type="text" 
                placeholder="Click here, then speak..."
                className="w-full p-2 border border-gray-200 rounded text-sm focus:border-gray-400 focus:outline-none"
                data-testid="test-input"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}