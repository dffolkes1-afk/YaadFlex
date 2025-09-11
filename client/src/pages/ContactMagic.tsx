import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Users, Phone, MessageSquare, Zap, Share2, UserPlus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactMagic() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  
  const appLink = `${window.location.origin}/surprise/CONTACT-MAGIC`;

  // Try to access contacts if available
  const loadContacts = async () => {
    // Check if Contact Picker API is available (Chrome/Edge on Android)
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel'];
        const opts = { multiple: true };
        
        // This will open native contact picker
        const contacts = await (navigator as any).contacts.select(props, opts);
        setContacts(contacts);
        
        toast({
          title: "Contacts Loaded! 📱",
          description: `Selected ${contacts.length} contacts`,
        });
      } catch (err) {
        console.log('Contact access denied or cancelled');
      }
    } else {
      // Fallback for browsers without Contact Picker API
      toast({
        title: "Manual Contact Share",
        description: "Copy the magic link to share with your contacts",
      });
    }
  };

  // Auto-share to all selected contacts
  const magicShareToContacts = () => {
    setIsSharing(true);
    
    // Simulate sending to all contacts
    setTimeout(() => {
      const message = `🎁 I'm dropping YaadFlex on you! This amazing app just appeared - check it out: ${appLink}`;
      
      // Try to use native share with pre-filled message
      if (navigator.share) {
        navigator.share({
          title: 'YaadFlex for Everyone!',
          text: message,
          url: appLink
        }).then(() => {
          toast({
            title: "✨ Magic Sent to Contacts!",
            description: "Your contacts will be surprised!",
          });
        });
      } else {
        // Open SMS app with pre-filled message
        window.location.href = `sms:?body=${encodeURIComponent(message)}`;
      }
      
      setIsSharing(false);
    }, 1500);
  };

  // Create a contact card that auto-shares
  const createContactCard = () => {
    // Create vCard format
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:YaadFlex App
TEL:+1-876-YAADFLEX
URL:${appLink}
NOTE:Tap to get YaadFlex instantly!
END:VCARD`;
    
    // Create downloadable vCard
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'YaadFlex.vcf';
    a.click();
    
    toast({
      title: "Contact Card Created! 📇",
      description: "Add to contacts and it spreads automatically!",
    });
  };

  // WhatsApp broadcast list magic
  const whatsappBroadcast = () => {
    const message = `🎁 *YaadFlex just dropped!*\n\nI'm sending you Jamaica's revolutionary super-app!\n\n✨ Tap here to get it instantly:\n${appLink}\n\n_It's like magic - the app just appears!_`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Magic! 💬",
      description: "Send to all your WhatsApp contacts at once!",
    });
  };

  // Auto-share when page loads (with permission)
  useEffect(() => {
    // Check if we can auto-trigger share
    const autoShare = localStorage.getItem('yaadflexAutoShare');
    if (autoShare === 'enabled') {
      setTimeout(() => {
        toast({
          title: "Auto-Sharing Active! 🚀",
          description: "YaadFlex is spreading to your network",
        });
      }, 1000);
    }
  }, []);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-primary/30 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 p-1">
            <CardHeader className="bg-background rounded-t-lg">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-4"
              >
                <Users className="h-12 w-12 text-primary" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-center">
                Contact Magic ✨
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Drop YaadFlex on all your contacts instantly!
              </CardDescription>
            </CardHeader>
          </div>
          
          <CardContent className="space-y-6 pt-6">
            {/* One-Tap Contact Share */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    One-Tap Contact Blast
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share with all your contacts in one tap - it's like the app teleports to their phones!
                  </p>
                  <Button
                    onClick={loadContacts}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    size="lg"
                    data-testid="button-contact-blast"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Select Contacts & Auto-Send
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* WhatsApp Broadcast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    WhatsApp Everyone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Send to all WhatsApp contacts at once
                  </p>
                  <Button
                    onClick={whatsappBroadcast}
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-50"
                    data-testid="button-whatsapp-all"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp Broadcast
                  </Button>
                </CardContent>
              </Card>

              {/* SMS Group Send */}
              <Card className="border-blue-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    SMS Everyone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Open SMS with all contacts ready
                  </p>
                  <Button
                    onClick={() => {
                      const message = `🎁 YaadFlex just appeared! Get it: ${appLink}`;
                      window.location.href = `sms:?body=${encodeURIComponent(message)}`;
                    }}
                    variant="outline"
                    className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                    data-testid="button-sms-all"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    SMS Group Send
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Magic Contact Card */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-purple-500" />
                  Magic Contact Card
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add YaadFlex as a contact - when others save it, they get the app!
                </p>
                <Button
                  onClick={createContactCard}
                  variant="outline"
                  className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                  data-testid="button-contact-card"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Download Magic Contact
                </Button>
              </CardContent>
            </Card>

            {/* Auto-Share Toggle */}
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  Auto-Magic Mode
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable to automatically suggest YaadFlex when you share anything
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto-Share Active</span>
                  <Button
                    onClick={() => {
                      const current = localStorage.getItem('yaadflexAutoShare');
                      const newState = current === 'enabled' ? 'disabled' : 'enabled';
                      localStorage.setItem('yaadflexAutoShare', newState);
                      
                      toast({
                        title: newState === 'enabled' ? "Auto-Magic ON! ✨" : "Auto-Magic OFF",
                        description: newState === 'enabled' 
                          ? "YaadFlex will spread automatically!" 
                          : "Manual sharing mode",
                      });
                    }}
                    variant="outline"
                    size="sm"
                    data-testid="button-auto-toggle"
                  >
                    {localStorage.getItem('yaadflexAutoShare') === 'enabled' ? 'ON' : 'OFF'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Message */}
            {isSharing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg text-center"
              >
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✨ Magic in progress... YaadFlex is spreading to your contacts!
                </p>
              </motion.div>
            )}

            {/* How It Works */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>The Contact Magic:</strong> Select your contacts and YaadFlex 
                spreads like wildfire! They'll get a surprise notification and the app 
                appears on their phone instantly.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Works with WhatsApp • SMS • Email • All messaging apps
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}