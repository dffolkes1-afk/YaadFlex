import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoiceInteractive } from '@/components/VoiceInteractive';
import { useToast } from '@/hooks/use-toast';
import { COMPANY_INFO } from '@shared/company';
import { 
  Zap, Mic, MessageSquare, Car, Wallet, Phone, Music, 
  ShoppingBag, MapPin, Search, Home, User, Settings,
  Volume2, Star, TrendingUp, Globe, Heart
} from 'lucide-react';

interface VoiceCommand {
  command: string;
  action: string;
  params?: any;
}

export default function VoiceControlCenter() {
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  const handleVoiceCommand = (command: VoiceCommand) => {
    setCommandHistory(prev => [command, ...prev.slice(0, 9)]); // Keep last 10 commands
    setIsActive(true);
    
    toast({
      title: "🎤 Voice Command Executed!",
      description: command.action,
    });

    // Auto-hide active state after 3 seconds
    setTimeout(() => setIsActive(false), 3000);
  };

  const voiceFeatures = [
    {
      title: "🚗 Ride Booking",
      description: "Book rides with voice",
      examples: ["Book a ride to downtown", "Call my driver", "Where's my ride?"],
      icon: <Car className="h-6 w-6 text-blue-600" />
    },
    {
      title: "💰 Wallet Control",
      description: "Manage money with voice",
      examples: ["Open my wallet", "Send money to John", "Check my balance"],
      icon: <Wallet className="h-6 w-6 text-green-600" />
    },
    {
      title: "📱 Social Actions",
      description: "Post and interact socially",
      examples: ["Post to social", "Share this photo", "Check my messages"],
      icon: <MessageSquare className="h-6 w-6 text-purple-600" />
    },
    {
      title: "🚴‍♂️ Delivery Jobs",
      description: "Find and manage delivery work",
      examples: ["Show delivery jobs", "Accept this delivery", "Track my package"],
      icon: <ShoppingBag className="h-6 w-6 text-orange-600" />
    },
    {
      title: "🎵 Music Control",
      description: "Play and control music",
      examples: ["Play reggae music", "Skip this song", "Turn up volume"],
      icon: <Music className="h-6 w-6 text-pink-600" />
    },
    {
      title: "💳 Payments",
      description: "Make payments with voice",
      examples: ["Pay with my card", "Send payment link", "Check transaction"],
      icon: <Zap className="h-6 w-6 text-yellow-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-6">
            <Mic className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-5xl font-bold mb-4">
              🎤 {COMPANY_INFO.COMPANY_NAME} Voice Control
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Talk to your app - it writes what you say AND does what you want! 🚀
            </p>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Better than TalkBack - real interactive voice that actually takes action. 
              Book rides, send money, post to social, find jobs - all with your voice!
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

      <div className="max-w-6xl mx-auto p-6">
        
        {/* Main Voice Controller */}
        <div className="mb-8">
          <VoiceInteractive 
            onVoiceCommand={handleVoiceCommand}
            showTranscript={true}
          />
        </div>

        {/* Command History */}
        {commandHistory.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                📊 Recent Voice Commands
              </CardTitle>
              <CardDescription>
                Your voice interactions with YaadFlex
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commandHistory.slice(0, 5).map((cmd, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{cmd.action}</div>
                      <div className="text-xs text-gray-500">Command: {cmd.command}</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      ✅ Done
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {voiceFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  {feature.icon}
                  {feature.title}
                </CardTitle>
                <CardDescription>
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    🗣️ Say things like:
                  </div>
                  {feature.examples.map((example, i) => (
                    <div key={i} className="text-xs bg-gray-50 p-2 rounded italic">
                      "{example}"
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-500" />
              🌟 How Voice Interactive Works
            </CardTitle>
            <CardDescription>
              Better than TalkBack - actually interactive and DOES things!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mic className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">1. You Talk</h3>
                <p className="text-sm text-gray-600">
                  Tap the mic and say what you want - book a ride, send money, anything!
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">2. App Understands</h3>
                <p className="text-sm text-gray-600">
                  Fast speech recognition writes your words AND understands what you want to do.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">3. Takes Action</h3>
                <p className="text-sm text-gray-600">
                  App actually DOES what you said - opens pages, makes calls, sends payments!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Commands Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-600" />
              🗺️ Voice Commands Reference
            </CardTitle>
            <CardDescription>
              Complete list of what you can say to control YaadFlex
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-blue-600">🚗 Transportation</h3>
                <ul className="space-y-1 text-sm">
                  <li>• "Book a ride to [destination]"</li>
                  <li>• "Call my driver"</li>
                  <li>• "Where's my ride?"</li>
                  <li>• "Cancel my booking"</li>
                  <li>• "Show nearby drivers"</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-600">💰 Money & Payments</h3>
                <ul className="space-y-1 text-sm">
                  <li>• "Open my wallet"</li>
                  <li>• "Send money to [name]"</li>
                  <li>• "Check my balance"</li>
                  <li>• "Pay with my card"</li>
                  <li>• "Show payment history"</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3 text-purple-600">📱 Social & Communication</h3>
                <ul className="space-y-1 text-sm">
                  <li>• "Post to social"</li>
                  <li>• "Share this photo"</li>
                  <li>• "Check my messages"</li>
                  <li>• "Call [contact name]"</li>
                  <li>• "Send voice message"</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3 text-orange-600">🚴‍♂️ Work & Delivery</h3>
                <ul className="space-y-1 text-sm">
                  <li>• "Show delivery jobs"</li>
                  <li>• "Accept this delivery"</li>
                  <li>• "Track my package"</li>
                  <li>• "Start working"</li>
                  <li>• "Check my earnings"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}