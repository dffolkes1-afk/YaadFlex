import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MessageSquare, Send, Link, Copy, Share2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function ShareApp() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const appLink = window.location.origin;
  const shareMessage = `Check out YaadFlex - The Fair Alternative! 🚀 Join Jamaica's revolutionary super-app: ${appLink}`;

  // SMS sending mutation
  const sendSMS = useMutation({
    mutationFn: async (data: { phone: string }) => {
      return apiRequest('/api/share/sms', 'POST', {
        phone: data.phone,
        message: shareMessage
      });
    },
    onSuccess: () => {
      toast({
        title: "SMS Sent! 📱",
        description: "App link sent successfully to the phone number",
      });
      setPhoneNumber('');
    },
    onError: () => {
      toast({
        title: "SMS Not Sent",
        description: "Please check the phone number and try again",
        variant: "destructive",
      });
    },
  });

  // Email sending mutation
  const sendEmail = useMutation({
    mutationFn: async (data: { email: string }) => {
      return apiRequest('/api/share/email', 'POST', {
        email: data.email,
        subject: 'Join YaadFlex - The Fair Alternative!',
        message: shareMessage
      });
    },
    onSuccess: () => {
      toast({
        title: "Email Sent! 📧",
        description: "App link sent successfully to the email address",
      });
      setEmail('');
    },
    onError: () => {
      toast({
        title: "Email Not Sent",
        description: "Please check the email address and try again",
        variant: "destructive",
      });
    },
  });

  const copyLink = () => {
    navigator.clipboard.writeText(appLink);
    setCopied(true);
    toast({
      title: "Link Copied! 📋",
      description: "Share it anywhere you want",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendSMS = () => {
    if (!phoneNumber) {
      toast({
        title: "Enter Phone Number",
        description: "Please enter a phone number first",
        variant: "destructive",
      });
      return;
    }
    sendSMS.mutate({ phone: phoneNumber });
  };

  const handleSendEmail = () => {
    if (!email) {
      toast({
        title: "Enter Email",
        description: "Please enter an email address first",
        variant: "destructive",
      });
      return;
    }
    sendEmail.mutate({ email });
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-6 w-6" />
            Share YaadFlex App
          </CardTitle>
          <CardDescription>
            Send the app link directly to anyone's phone or email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Copy Link Section */}
          <div className="mb-6 p-4 bg-secondary rounded-lg">
            <Label className="text-sm text-muted-foreground">Your App Link</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={appLink}
                readOnly
                className="font-mono text-sm"
                data-testid="input-app-link"
              />
              <Button
                onClick={copyLink}
                variant={copied ? "default" : "outline"}
                data-testid="button-copy-link"
              >
                {copied ? (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="sms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sms" data-testid="tab-sms">
                <Phone className="h-4 w-4 mr-2" />
                Send via SMS
              </TabsTrigger>
              <TabsTrigger value="email" data-testid="tab-email">
                <Mail className="h-4 w-4 mr-2" />
                Send via Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sms" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 876 555 0123"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    data-testid="input-phone"
                  />
                  <Button 
                    onClick={handleSendSMS}
                    disabled={sendSMS.isPending}
                    data-testid="button-send-sms"
                  >
                    {sendSMS.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send SMS
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter phone number with country code (e.g., +1 for USA, +1876 for Jamaica)
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Message Preview:</p>
                <p className="text-sm text-muted-foreground">
                  {shareMessage}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                  />
                  <Button 
                    onClick={handleSendEmail}
                    disabled={sendEmail.isPending}
                    data-testid="button-send-email"
                  >
                    {sendEmail.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  We'll send them an invitation email with your app link
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Email Preview:</p>
                <p className="text-sm font-medium">Subject: Join YaadFlex - The Fair Alternative!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {shareMessage}
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Share Buttons */}
          <div className="mt-6 pt-6 border-t">
            <Label className="text-sm text-muted-foreground">Quick Share Options</Label>
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank')}
                data-testid="button-whatsapp"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`sms:?body=${encodeURIComponent(shareMessage)}`, '_blank')}
                data-testid="button-native-sms"
              >
                <Phone className="h-4 w-4 mr-2" />
                Text Message
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = `mailto:?subject=Join YaadFlex&body=${encodeURIComponent(shareMessage)}`}
                data-testid="button-native-email"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email App
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}