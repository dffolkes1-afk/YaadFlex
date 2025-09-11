import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Gift, Smartphone, Zap, Share2, QrCode, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';

export default function MagicDrop() {
  const [magicLink, setMagicLink] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { toast } = useToast();
  
  // Generate unique magic drop code
  const generateMagicCode = () => {
    return `MAGIC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
  };

  useEffect(() => {
    // Check if app is installable (PWA)
    const checkInstallable = () => {
      if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
        setIsInstallable(true);
      }
    };
    
    // Capture install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    checkInstallable();
    
    // Generate initial magic link
    const code = generateMagicCode();
    const link = `${window.location.origin}/surprise/${code}`;
    setMagicLink(link);
    
    // Generate QR code
    QRCode.toDataURL(link, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      }
    }).then(setQrCode);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstantInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "✨ App Installed!",
          description: "YaadFlex is now on your home screen!",
        });
      }
      setDeferredPrompt(null);
    } else {
      // For iOS or already installed
      toast({
        title: "Add to Home Screen",
        description: "Tap Share → Add to Home Screen to install",
      });
    }
  };

  const handleMagicDrop = async () => {
    // Check for Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🎁 Someone dropped YaadFlex on you!',
          text: 'Tap to get this surprise app instantly!',
          url: magicLink
        });
        
        toast({
          title: "Magic Drop Sent! ✨",
          description: "Your friend will be surprised!",
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(magicLink);
      toast({
        title: "Magic Link Copied! 📋",
        description: "Send this to surprise someone!",
      });
    }
  };

  const handleNFCDrop = () => {
    // Check for WebNFC support (Android Chrome only)
    if ('NDEFReader' in window) {
      toast({
        title: "NFC Drop Ready! 📲",
        description: "Tap phones together to share instantly!",
      });
      
      // In production, this would write to NFC tag
      // For now, show the concept
    } else {
      toast({
        title: "NFC Not Available",
        description: "Use QR code or Magic Link instead",
        variant: "destructive",
      });
    }
  };

  const handleAirdropStyle = () => {
    // Simulate Airdrop-like experience
    toast({
      title: "🍎 Airdrop-Style Sharing",
      description: "Opening native share menu...",
    });
    
    if (navigator.share) {
      navigator.share({
        title: 'YaadFlex App',
        text: 'Get YaadFlex instantly!',
        url: magicLink
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Magic Drop ✨
            </CardTitle>
            <CardDescription className="text-lg">
              Drop YaadFlex on someone's phone like magic!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Instant Install Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Instant App Install
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Install YaadFlex instantly to your home screen - no app store needed!
              </p>
              <Button
                onClick={handleInstantInstall}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                data-testid="button-instant-install"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Install to Home Screen NOW
              </Button>
            </div>

            {/* Magic Drop Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Method 1: Share API */}
              <Card className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Magic Drop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Send app directly to someone's phone
                  </p>
                  <Button
                    onClick={handleMagicDrop}
                    variant="outline"
                    className="w-full"
                    data-testid="button-magic-drop"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Drop on Friend's Phone
                  </Button>
                </CardContent>
              </Card>

              {/* Method 2: NFC Drop */}
              <Card className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    NFC Tap Drop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Tap phones together to share
                  </p>
                  <Button
                    onClick={handleNFCDrop}
                    variant="outline"
                    className="w-full"
                    data-testid="button-nfc-drop"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Activate Phone Tap
                  </Button>
                </CardContent>
              </Card>

              {/* Method 3: QR Magic */}
              <Card className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    QR Magic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Show this code for instant access
                  </p>
                  {qrCode && (
                    <img 
                      src={qrCode} 
                      alt="Magic QR Code" 
                      className="w-32 h-32 mx-auto"
                      data-testid="image-qr-code"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Method 4: Airdrop Style */}
              <Card className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Airdrop Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Share like iPhone Airdrop
                  </p>
                  <Button
                    onClick={handleAirdropStyle}
                    variant="outline"
                    className="w-full"
                    data-testid="button-airdrop"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Airdrop to Nearby
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Magic Link Display */}
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Your Magic Drop Link:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background p-2 rounded border">
                  {magicLink}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(magicLink);
                    toast({
                      title: "Copied!",
                      description: "Magic link copied to clipboard",
                    });
                  }}
                  data-testid="button-copy-magic"
                >
                  Copy
                </Button>
              </div>
            </div>

            {/* How It Works */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>How the magic works:</strong> When someone opens your magic link,
                YaadFlex instantly loads and prompts to install on their home screen.
                It feels like the app just "appears" on their phone! 
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                No app store needed • Works on any phone • Instant surprise! ✨
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}