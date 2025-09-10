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
          title: "🎤 Voice Active",
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
        title: "🚗 Booking Ride!",
        description: "Opening YaadFlex ride booking...",
      });
      setTimeout(() => window.location.href = '/ride-booking', 1000);
    } 
    else if (lowerText.includes('call') && lowerText.includes('driver')) {
      actionTaken = 'Start driver call';
      toast({
        title: "📞 Calling Driver!",
        description: "Connecting to your YaadFlex driver...",
      });
    }
    else if (lowerText.includes('wallet') || lowerText.includes('money') || lowerText.includes('pay')) {
      actionTaken = 'Open YaadWallet';
      toast({
        title: "💰 Opening Wallet!",
        description: "YaadWallet loading...",
      });
      setTimeout(() => window.location.href = '/yaad-wallet', 1000);
    }
    else if (lowerText.includes('social') || lowerText.includes('post') || lowerText.includes('share')) {
      actionTaken = 'Open social feed';
      toast({
        title: "📱 Opening Social!",
        description: "YaadFlex social feed loading...",
      });
      setTimeout(() => window.location.href = '/social-feed', 1000);
    }
    else if (lowerText.includes('delivery') || lowerText.includes('package')) {
      actionTaken = 'Open Heritage Delivery';
      toast({
        title: "🚴‍♂️ Delivery Jobs!",
        description: "Heritage Delivery loading...",
      });
      setTimeout(() => window.location.href = '/heritage-delivery', 1000);
    }
    else if (lowerText.includes('payment') || lowerText.includes('pay with card')) {
      actionTaken = 'Open Universal Payment';
      toast({
        title: "💳 Universal Payment!",
        description: "Opening payment system...",
      });
      setTimeout(() => window.location.href = '/universal-payment', 1000);
    }
    else if (lowerText.includes('music') || lowerText.includes('play')) {
      actionTaken = 'Start music player';
      toast({
        title: "🎵 Playing Music!",
        description: "YaadFlex music starting...",
      });
    }
    else if (lowerText.includes('home') || lowerText.includes('main')) {
      actionTaken = 'Navigate home';
      toast({
        title: "🏠 Going Home!",
        description: "Navigating to main page...",
      });
      setTimeout(() => window.location.href = '/', 1000);
    }
    else {
      // Generic text input - write what they said
      actionTaken = 'Text recognized and written';
      writeToActiveInput(spokenText);
      toast({
        title: "✍️ Text Written!",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-6">
            <Mic className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-5xl font-bold mb-4">
              🎤 YaadFlex Voice Interactive Demo
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Talk to your app - it writes what you say AND does what you want! 🚀
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Better than TalkBack - real interactive voice that actually takes action. 
              No login required for this demo!
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-yellow-400 text-black text-lg px-4 py-2">
              <Zap className="h-4 w-4 mr-1" />
              Faster than TalkBack
            </Badge>
            <Badge variant="secondary" className="bg-green-400 text-black text-lg px-4 py-2">
              <Volume2 className="h-4 w-4 mr-1" />
              Actually Does Things
            </Badge>
            <Badge variant="secondary" className="bg-blue-400 text-white text-lg px-4 py-2">
              <MessageSquare className="h-4 w-4 mr-1" />
              Writes What You Say
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        
        {/* Main Voice Controller */}
        <Card className="w-full max-w-2xl mx-auto mb-8">
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
            {transcript && (
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
          </CardContent>
        </Card>

        {/* Voice Commands Help */}
        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <div className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
              <Star className="h-6 w-6" />
              🗣️ What you can say:
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <div className="font-bold mb-2">🚗 Transportation</div>
                <ul className="space-y-1">
                  <li>• "Book a ride to [destination]"</li>
                  <li>• "Call my driver"</li>
                  <li>• "Where's my ride?"</li>
                </ul>
              </div>
              <div>
                <div className="font-bold mb-2">💰 Money & Payments</div>
                <ul className="space-y-1">
                  <li>• "Open my wallet"</li>
                  <li>• "Pay with my card"</li>
                  <li>• "Send money"</li>
                </ul>
              </div>
              <div>
                <div className="font-bold mb-2">📱 Social & Communication</div>
                <ul className="space-y-1">
                  <li>• "Post to social"</li>
                  <li>• "Share this photo"</li>
                  <li>• "Open social feed"</li>
                </ul>
              </div>
              <div>
                <div className="font-bold mb-2">🚴‍♂️ Work & Delivery</div>
                <ul className="space-y-1">
                  <li>• "Show delivery jobs"</li>
                  <li>• "Find work"</li>
                  <li>• "Track my package"</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <div className="text-yellow-800 font-medium">✨ Or just talk and I'll write what you say!</div>
              <div className="text-yellow-700 text-sm">Click in any text field first, then say something - I'll type it for you!</div>
            </div>
          </CardContent>
        </Card>

        {/* Test Input Field */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🧪 Test Voice-to-Text Here</CardTitle>
          </CardHeader>
          <CardContent>
            <input 
              type="text" 
              placeholder="Click here, then use voice - I'll write what you say!"
              className="w-full p-3 border rounded-lg text-lg"
              data-testid="test-input"
            />
            <p className="text-sm text-gray-600 mt-2">
              👆 Click in this text field, then tap the microphone and speak. Watch me write exactly what you say!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}