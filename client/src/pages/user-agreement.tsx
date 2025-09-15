import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Car, 
  CreditCard, 
  Shield, 
  MessageSquare, 
  MapPin,
  Building2,
  Calendar,
  FileText,
  Phone
} from 'lucide-react';
import { Link } from 'wouter';

export default function UserAgreement() {
  const lastUpdated = "September 15, 2025";

  const sections = [
    {
      id: 'platform-overview',
      title: 'YaadFlex Platform Overview',
      icon: <Building2 className="h-5 w-5" />,
      content: `
**Service Provider:** BlackRock, Inc. provides YaadFlex as a comprehensive platform connecting users with transportation, delivery, and marketplace services throughout Jamaica and the Caribbean.

**Platform Services:**
- Ride-sharing and transportation coordination
- Delivery and logistics services  
- Business marketplace and directory
- Multi-currency payment processing (JMD, USD, KWD, EUR, GBP)
- Voice communication and messaging systems
- Real-time tracking and safety features

**User Types:** This agreement applies to all YaadFlex users including:
- Riders requesting transportation services
- Customers booking delivery services
- Users browsing the business marketplace
- General platform users accessing information and services

**Geographic Coverage:** Services primarily available in Jamaica with expansion throughout the Caribbean region.
      `
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities & Conduct',
      icon: <Users className="h-5 w-5" />,
      content: `
**Account Management:**
- Maintain accurate and up-to-date account information
- Protect your login credentials and account security
- Use only one account per person
- Notify BlackRock immediately of any unauthorized access

**Acceptable Use:**
- Use YaadFlex only for lawful purposes
- Treat all service providers and users with respect
- Provide accurate pickup and delivery information
- Follow all local laws and regulations

**Prohibited Activities:**
- Harassment, abuse, or discrimination of any kind
- Fraudulent or deceptive behavior
- Attempting to circumvent payment systems
- Interfering with platform operations or security
- Using the platform for illegal activities

**Safety Requirements:**
- Follow all safety guidelines and recommendations
- Report unsafe behavior or incidents immediately
- Provide accurate emergency contact information
- Cooperate with safety investigations when required
      `
    },
    {
      id: 'ride-services',
      title: 'Transportation & Ride Services',
      icon: <Car className="h-5 w-5" />,
      content: `
**Service Coordination:** BlackRock facilitates connections between riders and independent transportation providers through the YaadFlex platform.

**Booking Process:**
- Request rides through the YaadFlex mobile application
- Confirm pickup location and destination
- Review driver information and estimated arrival time
- Track your ride in real-time

**Payment Terms:**
- Fares are calculated based on distance, time, and service type
- Payment is processed automatically through your selected method
- Surge pricing may apply during high-demand periods
- All transactions include applicable taxes and fees

**User Obligations:**
- Be ready at the pickup location at the scheduled time
- Provide accurate pickup and destination addresses
- Treat vehicles and drivers with respect
- Follow any specific instructions from drivers

**Cancellation Policy:**
- Free cancellation within 2 minutes of booking
- Cancellation fees may apply for late cancellations
- No-show fees apply if you fail to appear at pickup location
- Emergency cancellations are reviewed case-by-case

**Safety Features:**
- Real-time GPS tracking shared with emergency contacts
- Driver background checks and vehicle inspections
- 24/7 safety support line available
- Incident reporting and response system
      `
    },
    {
      id: 'delivery-services',
      title: 'Delivery & Logistics Services',
      icon: <MapPin className="h-5 w-5" />,
      content: `
**Delivery Coordination:** BlackRock connects users with delivery personnel for package, food, and courier services through YaadFlex.

**Service Types:**
- Food delivery from restaurants and vendors
- Package and parcel delivery
- Business-to-business courier services
- Same-day and scheduled delivery options

**Ordering Process:**
- Select items from marketplace vendors
- Confirm delivery address and timing preferences
- Track delivery progress in real-time
- Confirm receipt and rate service quality

**Delivery Terms:**
- Delivery fees based on distance, urgency, and item type
- Estimated delivery times are approximate
- Special handling fees for fragile or valuable items
- Delivery personnel may contact you for access instructions

**Item Restrictions:**
- No illegal, dangerous, or prohibited items
- Weight and size limitations apply
- Alcohol delivery requires age verification
- Valuable items may require signature confirmation

**Delivery Issues:**
- Report missing or damaged items immediately
- Provide clear delivery instructions and access codes
- Be available to receive deliveries during specified windows
- Contact support for delivery disputes or concerns
      `
    },
    {
      id: 'marketplace-services',
      title: 'Business Marketplace & Directory',
      icon: <Building2 className="h-5 w-5" />,
      content: `
**Marketplace Overview:** YaadFlex provides a platform for discovering and connecting with local businesses across Jamaica and the Caribbean.

**Business Categories:**
- Restaurants and food vendors
- Transportation and logistics companies
- Accommodation and tourism services
- Professional and personal services
- Entertainment and event services

**User Interactions:**
- Browse business listings and services
- Read reviews and ratings from other users
- Contact businesses directly through the platform
- Book services and make appointments

**Review System:**
- Leave honest reviews based on your experience
- Reviews must be factual and relevant
- No fake, misleading, or malicious reviews
- BlackRock may moderate reviews for quality and appropriateness

**Business Information:**
- Business listings are provided by the businesses themselves
- BlackRock does not guarantee accuracy of all business information
- Contact businesses directly to verify details and availability
- Report inaccurate or outdated information to platform support

**User Responsibilities:**
- Use business contact information responsibly
- Honor appointments and bookings made through the platform
- Pay for services according to business terms
- Resolve disputes directly with businesses when possible
      `
    },
    {
      id: 'communication-features',
      title: 'Communication & Voice Features',
      icon: <MessageSquare className="h-5 w-5" />,
      content: `
**Communication Systems:** YaadFlex provides voice messaging and emergency calling features to facilitate safe, efficient communication.

**Voice Messaging:**
- Send voice messages to drivers and delivery personnel
- Voice messages are encrypted and automatically deleted after 30 days
- Use voice messages for coordination and updates
- No inappropriate, offensive, or threatening messages

**Emergency Calling:**
- Emergency call feature available for safety situations
- Calls may be recorded for safety and quality purposes
- Emergency contacts are notified of safety incidents
- Use emergency features only for genuine emergencies

**Privacy and Safety:**
- All communications are monitored for safety and quality
- Inappropriate communication may result in account suspension
- Report harassment or inappropriate behavior immediately
- Communication features are subject to local telecommunication laws

**Communication Guidelines:**
- Keep communications professional and respectful
- Provide clear, helpful information
- Respond promptly to messages from service providers
- Use appropriate language and tone
      `
    },
    {
      id: 'payment-processing',
      title: 'Payment Processing & Currency',
      icon: <CreditCard className="h-5 w-5" />,
      content: `
**Payment Infrastructure:** BlackRock processes all payments through enterprise-grade secure systems supporting multiple currencies.

**Supported Payment Methods:**
- Credit and debit cards (Visa, Mastercard, Amex)
- Bank account transfers and direct debits
- Digital wallet services (PayPal, etc.)
- Cash payments where available and appropriate

**Multi-Currency Support:**
- Jamaican Dollar (JMD) - Primary currency
- US Dollar (USD) - International transactions
- Kuwaiti Dinar (KWD) - Middle East remittances
- Euro (EUR) and British Pound (GBP) - European transactions

**Payment Terms:**
- All prices displayed include applicable taxes and fees
- Currency conversion at competitive real-time rates
- Payment authorization occurs upon service completion
- Refunds processed according to service-specific policies

**Payment Security:**
- PCI DSS compliant payment processing
- Tokenized storage of payment information
- Fraud detection and prevention systems
- Secure API integrations with banking partners

**Billing and Receipts:**
- Digital receipts provided for all transactions
- Detailed billing statements available in app
- Tax documentation provided as required
- Payment history accessible through account dashboard
      `
    },
    {
      id: 'safety-insurance',
      title: 'Safety, Insurance & Liability',
      icon: <Shield className="h-5 w-5" />,
      content: `
**Safety Commitment:** BlackRock maintains comprehensive safety measures and insurance coverage for YaadFlex operations.

**Platform Safety Features:**
- Driver and delivery personnel background checks
- Vehicle inspections and insurance verification
- Real-time tracking and monitoring
- 24/7 safety support and incident response

**Insurance Coverage:**
- General liability insurance for platform operations
- Commercial coverage for transportation services
- Property protection for delivery services
- User protection and support programs

**Incident Response:**
- Immediate incident reporting through app emergency features
- Coordination with local emergency services when needed
- Investigation and resolution support
- Follow-up care and assistance programs

**User Safety Responsibilities:**
- Follow all safety guidelines and recommendations
- Report safety concerns immediately
- Provide accurate emergency contact information
- Cooperate with safety investigations

**Liability Limitations:**
- BlackRock provides platform services with reasonable care
- Service providers are independent contractors
- Users assume responsibility for their own safety decisions
- Liability limited to the maximum extent permitted by law

**Emergency Procedures:**
- Emergency button available in app during active services
- Automatic emergency contact notification
- GPS location sharing with emergency responders
- Post-incident support and assistance
      `
    },
    {
      id: 'account-termination',
      title: 'Account Management & Termination',
      icon: <FileText className="h-5 w-5" />,
      content: `
**Account Suspension:** BlackRock may suspend accounts for violations of this agreement or safety concerns.

**Grounds for Suspension:**
- Violation of community guidelines or platform rules
- Fraudulent or deceptive behavior
- Safety incidents or concerns
- Failure to pay for services
- Misuse of platform features or systems

**Suspension Process:**
- Investigation of reported issues
- Notification of suspension and reasons
- Opportunity to respond and appeal
- Resolution or permanent termination decision

**User-Initiated Termination:**
- Delete your account through app settings
- Request account deletion via customer support
- Account data deleted according to privacy policy
- Outstanding payments must be settled before closure

**Effect of Termination:**
- Loss of access to all YaadFlex services
- Cancellation of active bookings and reservations
- Deletion of account data subject to legal retention requirements
- No refund of fees already paid for completed services

**Data Retention After Termination:**
- Transaction records retained for financial compliance
- Safety and security records retained as legally required
- Personal data deleted according to privacy policy timelines
- Right to request accelerated deletion subject to legal requirements

**Appeal Process:**
- Submit appeals through customer support
- Provide relevant information and documentation
- Review by specialized appeals team
- Final decision communicated within 14 business days
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">User Agreement</h1>
              <p className="text-lg text-muted-foreground">YaadFlex Platform Terms for Users</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            <Badge variant="secondary" className="text-blue-600">
              <Users className="h-3 w-3 mr-1" />
              General Users
            </Badge>
            <Badge variant="secondary" className="text-green-600">
              <Car className="h-3 w-3 mr-1" />
              Ride Services
            </Badge>
            <Badge variant="secondary" className="text-purple-600">
              <MapPin className="h-3 w-3 mr-1" />
              Delivery Services
            </Badge>
            <Badge variant="secondary" className="text-orange-600">
              <Calendar className="h-3 w-3 mr-1" />
              Updated: {lastUpdated}
            </Badge>
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            This User Agreement governs your use of YaadFlex services as a rider, customer, or general platform user. 
            By using YaadFlex, you agree to these terms and BlackRock's service standards.
          </p>
        </div>

        {/* Service Overview */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Building2 className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  YaadFlex Platform Services
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  BlackRock operates YaadFlex as a comprehensive platform connecting you with transportation, delivery, 
                  and business services across Jamaica and the Caribbean. We facilitate safe, reliable connections while 
                  maintaining enterprise-grade security and customer protection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              User Agreement Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div key={section.id} id={section.id}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-accent/20 rounded-full text-accent-foreground">
                        {section.icon}
                      </div>
                      <h2 className="text-xl font-semibold">
                        {index + 1}. {section.title}
                      </h2>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert pl-6">
                      {section.content.split('\n\n').map((paragraph, pIndex) => (
                        <div key={pIndex} className="mb-4">
                          {paragraph.startsWith('**') ? (
                            <div className="font-semibold text-foreground mb-2">
                              {paragraph.replace(/\*\*/g, '')}
                            </div>
                          ) : (
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                              {paragraph}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    {index < sections.length - 1 && <Separator className="mt-8" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Car className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Book a Ride</h3>
            <p className="text-sm text-muted-foreground mb-3">Start using YaadFlex transportation</p>
            <Link href="/ride-booking">
              <Button size="sm" data-testid="button-book-ride">
                Book Now
              </Button>
            </Link>
          </Card>
          
          <Card className="p-4 text-center">
            <Phone className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold mb-1">Customer Support</h3>
            <p className="text-sm text-muted-foreground mb-3">Get help with your account</p>
            <Button size="sm" variant="outline" data-testid="button-contact-support">
              Contact Support
            </Button>
          </Card>
          
          <Card className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold mb-1">Safety Center</h3>
            <p className="text-sm text-muted-foreground mb-3">Learn about safety features</p>
            <Button size="sm" variant="outline" data-testid="button-safety-center">
              Safety Info
            </Button>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Last Updated: {lastUpdated} | Version 1.0 | User Agreement
          </div>
          <div className="flex gap-3">
            <Link href="/terms">
              <Button variant="outline" size="sm" data-testid="link-terms-from-user">
                Terms of Service
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="outline" size="sm" data-testid="link-privacy-from-user">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/legal">
              <Button size="sm" data-testid="link-legal-center-user">
                Legal Center
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}