import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Send, 
  Users, 
  Zap,
  CheckCircle,
  Clock,
  Eye,
  Bot,
  Shield,
  Smartphone,
  Globe,
  CreditCard,
  MessageSquare,
  UserCheck,
  Settings,
  BarChart3
} from 'lucide-react';

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'business' | 'driver' | 'customer' | 'property' | 'vehicle';
  automated: boolean;
};

type EmailHandler = {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedCategories: string[];
  emailsHandled: number;
  responseTime: string;
  status: 'online' | 'offline' | 'busy';
};

export default function ContactlessSystemPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  // Email Templates for Automated System
  const emailTemplates: EmailTemplate[] = [
    {
      id: 'business-welcome',
      name: 'Business Partner Welcome',
      subject: '🎉 Welcome to YaadFlex - Your Premium Storefront is Ready!',
      content: `Dear Business Partner,

Welcome to YaadFlex! Your premium storefront is now live and reaching 150,000+ customers across Jamaica.

✅ Your Profile: Premium verified business listing
✅ Payment System: Automatic processing and payouts
✅ Customer Reach: Island-wide exposure
✅ Support Team: 24/7 assistance available

Next Steps:
• Update your business hours and contact info
• Upload high-quality photos of your products/services  
• Set up special offers for YaadFlex customers

Questions? Our team (including Marlon Ice) will respond within 2 hours.

Best regards,
YaadFlex Team`,
      category: 'business',
      automated: true
    },
    {
      id: 'driver-approval',
      name: 'Driver Application Approved',
      subject: '🚗 Congratulations! You\'re Approved as a YaadFlex Driver',
      content: `Dear New Driver,

Congratulations! Your YaadFlex driver application has been approved.

✅ Earnings: Keep 85% of every fare
✅ Payments: Daily automatic deposits to your account
✅ Schedule: Work anytime, anywhere in Jamaica
✅ Support: 24/7 driver assistance available

Getting Started:
• Download the driver app
• Complete your first ride within 7 days (free trial bonus)
• Join our driver community WhatsApp group

Start earning today! No office visits required - everything is contactless.

Welcome to the YaadFlex family!`,
      category: 'driver',
      automated: true
    },
    {
      id: 'property-listed',
      name: 'Property Listed Successfully',
      subject: '🏠 Your Property is Now Live on YaadFlex Real Estate',
      content: `Dear Property Owner,

Your property has been successfully listed on YaadFlex Real Estate marketplace.

✅ Listing: Now visible to 150,000+ potential buyers
✅ Photos: Professional photography scheduled (if requested)
✅ Promotion: Featured across our network
✅ Inquiries: Forwarded directly to you

Property Details:
• Address: [PROPERTY_ADDRESS]
• Price: [PROPERTY_PRICE] JMD
• Type: [PROPERTY_TYPE]

Expect inquiries within 24-48 hours. Our team handles all initial screening.

Questions? Marlon Ice and our team are standing by.`,
      category: 'property',
      automated: true
    },
    {
      id: 'vehicle-3d-ready',
      name: 'Vehicle 3D Scanning Complete',
      subject: '🚗 Your Car\'s 3D Virtual Tour is Ready!',
      content: `Dear Car Owner,

Your vehicle's 3D scanning is complete! Buyers can now inspect your car inside and out virtually.

✅ 3D Model: 360° interior and exterior view
✅ Condition Report: Professional evaluation included
✅ Listing: Now live with premium 3D features
✅ Buyer Interest: Already generating views

View your 3D model: [3D_MODEL_LINK]

This revolutionary feature increases buyer confidence and typically results in 40% faster sales.

Sit back and let YaadFlex work for you - completely contactless!`,
      category: 'vehicle',
      automated: true
    },
    {
      id: 'customer-booking-confirmed',
      name: 'Ride Booking Confirmed',
      subject: '🚕 Your YaadFlex Ride is Confirmed',
      content: `Hi there!

Your ride has been confirmed and your driver is on the way.

🚗 Driver: [DRIVER_NAME]
📱 Phone: [DRIVER_PHONE] 
🚗 Vehicle: [VEHICLE_DETAILS]
📍 Pickup: [PICKUP_LOCATION]
📍 Destination: [DESTINATION]
💰 Fare: [FARE_AMOUNT] JMD

Track your driver in real-time through the app. Everything is contactless for your safety.

Need help? Our support team responds instantly.

Safe travels!`,
      category: 'customer',
      automated: true
    }
  ];

  // Email Team Members
  const emailHandlers: EmailHandler[] = [
    {
      id: 'marlon-ice',
      name: 'Marlon Ice',
      email: 'marlon.ice@yaadflex.com',
      role: 'Lead Email Specialist',
      assignedCategories: ['business', 'property'],
      emailsHandled: 847,
      responseTime: '1.2 hours avg',
      status: 'online'
    },
    {
      id: 'support-agent-1',
      name: 'Keisha Brown',
      email: 'keisha@yaadflex.com',
      role: 'Customer Support Agent',
      assignedCategories: ['customer', 'driver'],
      emailsHandled: 623,
      responseTime: '45 mins avg',
      status: 'online'
    },
    {
      id: 'support-agent-2',
      name: 'Marcus Johnson',
      email: 'marcus@yaadflex.com',
      role: 'Vehicle Specialist',
      assignedCategories: ['vehicle'],
      emailsHandled: 412,
      responseTime: '1.8 hours avg',
      status: 'busy'
    }
  ];

  // Send Email Mutation
  const sendEmailMutation = useMutation({
    mutationFn: async (emailData: any) => {
      const response = await apiRequest('POST', '/api/contactless/send-email', emailData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Email Sent Successfully!",
        description: `Email sent via automated YaadFlex system. ${data.handledBy ? `Assigned to: ${data.handledBy}` : 'Fully automated'}`,
      });
      setEmailRecipient('');
      setCustomMessage('');
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Email",
        description: error.message || "Unable to send email through contactless system.",
        variant: "destructive",
      });
    },
  });

  const handleSendEmail = () => {
    if (!emailRecipient || !selectedTemplate) {
      toast({
        title: "Missing Information",
        description: "Please select a template and enter recipient email.",
        variant: "destructive",
      });
      return;
    }

    const template = emailTemplates.find(t => t.id === selectedTemplate);
    sendEmailMutation.mutate({
      recipient: emailRecipient,
      template: template,
      customMessage: customMessage,
      automated: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-gray-600';  
      case 'busy': return 'text-orange-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'offline': return <Clock className="h-4 w-4 text-gray-600" />;
      case 'busy': return <Eye className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent mb-4">
            📧 100% Contactless YaadFlex System
          </h1>
          <p className="text-2xl text-muted-foreground mb-6">
            Zero Contact Required - Everything Automated Through App + Email Team
          </p>
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            <Badge variant="secondary" className="text-blue-600 text-lg px-4 py-2">🚫 No Office Visits</Badge>
            <Badge variant="secondary" className="text-green-600 text-lg px-4 py-2">📧 Automated Emails</Badge>
            <Badge variant="secondary" className="text-purple-600 text-lg px-4 py-2">👥 Expert Team</Badge>
            <Badge variant="secondary" className="text-orange-600 text-lg px-4 py-2">⚡ Instant Response</Badge>
          </div>
        </div>

        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Contactless System
            </TabsTrigger>
            <TabsTrigger value="email-automation" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Email Automation
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Email Team
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              System Analytics
            </TabsTrigger>
          </TabsList>

          {/* Contactless System Overview */}
          <TabsContent value="system" className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* How Contactless Works */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    How Contactless YaadFlex Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">1. App-Only Operations</div>
                        <div className="text-sm text-muted-foreground">Everything done through YaadFlex app</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">2. Automated Emails</div>
                        <div className="text-sm text-muted-foreground">System sends perfect emails instantly</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">3. Expert Team Response</div>
                        <div className="text-sm text-muted-foreground">Marlon Ice + team handle all emails</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="font-medium">4. Automatic Payments</div>
                        <div className="text-sm text-muted-foreground">Money flows to your account daily</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits for You */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Benefits for You (Dwayne)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Never visit banks or offices</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">No phone calls or meetings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Money arrives automatically</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Expert team handles everything</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Watch profits grow remotely</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Contactless Workflow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Complete Contactless Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  
                  <div className="text-center p-4 border rounded-lg">
                    <UserCheck className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <h4 className="font-semibold mb-2">Partner Joins</h4>
                    <p className="text-sm text-muted-foreground">Business registers through app → Automatic welcome email sent</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Bot className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <h4 className="font-semibold mb-2">System Responds</h4>
                    <p className="text-sm text-muted-foreground">Automated email with setup instructions → No manual work</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <h4 className="font-semibold mb-2">Team Handles</h4>
                    <p className="text-sm text-muted-foreground">Marlon Ice answers questions → Professional support</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <CreditCard className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                    <h4 className="font-semibold mb-2">Money Flows</h4>
                    <p className="text-sm text-muted-foreground">Revenue goes to your account → Completely automated</p>
                  </div>

                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Email Automation */}
          <TabsContent value="email-automation" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Automated Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Select Email Template</Label>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {emailTemplates.slice(0, 3).map((template) => (
                        <Button
                          key={template.id}
                          variant={selectedTemplate === template.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          {template.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Recipient Email</Label>
                    <Input
                      placeholder="customer@email.com"
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      data-testid="input-email-recipient"
                    />
                  </div>
                </div>

                <div>
                  <Label>Custom Message (Optional)</Label>
                  <Textarea
                    placeholder="Add any custom message here..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    data-testid="textarea-custom-message"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSendEmail}
                  disabled={sendEmailMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  data-testid="button-send-email"
                >
                  {sendEmailMutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Automated Email
                    </>
                  )}
                </Button>

              </CardContent>
            </Card>

            {/* Email Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emailTemplates.map((template) => (
                <Card key={template.id} className="h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {template.name}
                      <Badge variant="outline" className="capitalize">
                        {template.category}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Subject:</Label>
                        <p className="text-sm text-muted-foreground">{template.subject}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Preview:</Label>
                        <p className="text-xs text-muted-foreground bg-muted p-3 rounded max-h-32 overflow-y-auto">
                          {template.content.substring(0, 200)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Fully Automated</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </TabsContent>

          {/* Email Team */}
          <TabsContent value="team" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  YaadFlex Email Support Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {emailHandlers.map((handler) => (
                    <Card key={handler.id} className="text-center">
                      <CardContent className="p-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {handler.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{handler.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{handler.role}</p>
                        
                        <div className="flex items-center justify-center gap-2 mb-3">
                          {getStatusIcon(handler.status)}
                          <span className={`text-sm ${getStatusColor(handler.status)}`}>
                            {handler.status.charAt(0).toUpperCase() + handler.status.slice(1)}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Emails Handled:</span>
                            <span className="font-medium">{handler.emailsHandled}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Response Time:</span>
                            <span className="font-medium">{handler.responseTime}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label className="text-xs">Specializes in:</Label>
                          <div className="flex gap-1 flex-wrap mt-1">
                            {handler.assignedCategories.map((cat) => (
                              <Badge key={cat} variant="secondary" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  ))}

                </div>

                <Card className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-orange-600" />
                      How the Email Team Works for You
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <strong>📧 Marlon Ice</strong><br/>
                        <span className="text-sm">Handles business inquiries, property questions, partnership applications</span>
                      </div>
                      <div>
                        <strong>👥 Support Team</strong><br/>
                        <span className="text-sm">Manages customer support, driver assistance, general inquiries</span>
                      </div>
                      <div>
                        <strong>🚗 Vehicle Specialists</strong><br/>
                        <span className="text-sm">Car marketplace questions, 3D scanning, vehicle evaluations</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </CardContent>
            </Card>

          </TabsContent>

          {/* System Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <Mail className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-2xl font-bold">2,847</div>
                  <div className="text-sm text-muted-foreground">Emails Sent Today</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-bold">98.5%</div>
                  <div className="text-sm text-muted-foreground">Automated Success</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                  <div className="text-2xl font-bold">1.2hr</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Contactless Operations</div>
                </CardContent>
              </Card>

            </div>

            <Card>
              <CardHeader>
                <CardTitle>📊 Contactless System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Email Automation Rate</span>
                      <span>98.5%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '98.5%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Customer Satisfaction</span>
                      <span>96.8%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '96.8%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Response Speed</span>
                      <span>94.2%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '94.2%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}