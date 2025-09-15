import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Globe, 
  Phone,
  Building2,
  Calendar,
  FileText,
  Users
} from 'lucide-react';
import { Link } from 'wouter';

export default function PrivacyPolicy() {
  // LEGAL COMPLIANCE: Version tracking for audit trails and GDPR/CCPA compliance
  const policyVersion = "v2.1.0";
  const lastUpdated = "September 15, 2025";
  const effectiveDate = "September 15, 2025";

  const sections = [
    {
      id: 'overview',
      title: 'Privacy Overview & Corporate Information',
      icon: <Building2 className="h-5 w-5" />,
      content: `
**Data Controller:** BlackRock, Inc., a Delaware corporation with its principal place of business at 50 Hudson Yards, New York, NY 10001.

**Platform:** This Privacy Policy applies to YaadFlex, BlackRock's proprietary multi-service platform operating in Jamaica and the Caribbean region.

**Our Commitment:** BlackRock is committed to protecting your privacy and handling your personal data responsibly. We comply with applicable data protection laws including GDPR, CCPA, and Jamaica's Data Protection Act.

**Global Standards:** As a global financial services corporation, BlackRock maintains enterprise-grade privacy and security standards across all operations, including YaadFlex services.

**Contact Information:**
- Privacy Officer: privacy@yaadflex.com
- Data Protection Officer: dpo@blackrock.com
- Corporate Address: BlackRock, Inc., 50 Hudson Yards, New York, NY 10001
      `
    },
    {
      id: 'information-collected',
      title: 'Information We Collect',
      icon: <Database className="h-5 w-5" />,
      content: `
**Account Information:**
- Name, email address, phone number
- Government-issued ID verification (driver's license)
- Payment information (bank account, credit/debit cards)
- Profile photos and verification documents

**Location Data:**
- Real-time GPS location during active rides/deliveries
- Pickup and destination addresses
- Route and trip history
- Geofenced area data for service optimization

**Transaction Data:**
- Payment history and methods
- Ride/delivery details and pricing
- Currency exchange transactions (JMD, USD, KWD, EUR, GBP)
- Merchant and business transaction records

**Communication Data:**
- Voice messages and call recordings (for safety and quality)
- In-app messages and chat history
- Customer service interactions
- Emergency contact information

**Device and Technical Data:**
- Device type, operating system, app version
- IP address and network information
- Usage analytics and app performance data
- Cookie and session data

**Business Information (For Partners):**
- Business registration details
- Tax identification numbers
- Business bank account information
- Operating licenses and permits
      `
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Information',
      icon: <Users className="h-5 w-5" />,
      content: `
**Service Provision:**
- Connecting riders with drivers and coordinating transportation
- Processing payments and currency conversions
- Facilitating deliveries and logistics services
- Providing customer support and resolving disputes

**Safety and Security:**
- Verifying user identities and preventing fraud
- Monitoring for suspicious activity
- Emergency response and incident reporting
- Insurance claim processing and investigation

**Platform Optimization:**
- Improving app functionality and user experience
- Analyzing usage patterns and service demand
- Developing new features and services
- Personalizing content and recommendations

**Compliance and Legal:**
- Meeting regulatory requirements in operating jurisdictions
- Responding to legal requests and court orders
- Tax reporting and financial compliance
- Anti-money laundering (AML) monitoring

**Business Operations:**
- Marketing and promotional communications
- Partner and driver onboarding and management
- Financial reporting and business analytics
- Corporate governance and risk management
      `
    },
    {
      id: 'data-sharing',
      title: 'Information Sharing & Disclosure',
      icon: <Globe className="h-5 w-5" />,
      content: `
**Service Providers:**
- Payment processors (Stripe, PayPal, banking partners)
- Cloud infrastructure providers (AWS, Google Cloud)
- Identity verification services
- Mapping and navigation services

**Legal and Regulatory:**
- Government agencies and regulatory bodies
- Law enforcement when legally required
- Tax authorities for reporting obligations
- Court orders and legal proceedings

**Business Partners:**
- Insurance providers for coverage and claims
- Financial institutions for banking services
- Technology vendors for platform operations
- Audit firms and legal counsel

**Within BlackRock:**
- Other BlackRock subsidiaries and affiliates
- Shared corporate services (IT, legal, compliance)
- Risk management and internal audit functions
- Executive reporting and governance

**Third-Party Limitations:**
- We do not sell personal data to marketers
- All third parties must meet BlackRock's data protection standards
- Data sharing agreements include strict confidentiality provisions
- We require deletion of data when relationships end
      `
    },
    {
      id: 'voice-communications',
      title: 'Voice Communications & Recording',
      icon: <Phone className="h-5 w-5" />,
      content: `
**Voice Message System:**
- Voice messages are encrypted during transmission and storage
- Messages are automatically deleted after 30 days unless saved
- Voice data is processed for transcription and translation services
- No biometric voice analysis or identification is performed

**Emergency Call Recording:**
- Calls placed through YaadFlex emergency features are recorded
- Recordings are retained for 6 months for safety and quality purposes
- Emergency recordings may be shared with law enforcement if required
- Call recordings are encrypted and access-controlled

**Voice Data Processing:**
- Voice-to-text conversion may be used for accessibility
- Language detection and translation services
- No voice biometric profiling or identification
- Voice data is not used for marketing or advertising

**User Controls:**
- You can disable voice features in app settings
- Option to use text-only communication
- Request deletion of voice data (subject to legal retention requirements)
- Report concerns about voice data handling
      `
    },
    {
      id: 'data-protection-rights',
      title: 'Your Data Protection Rights',
      icon: <Shield className="h-5 w-5" />,
      content: `
**Universal Rights (All Users):**
- Right to access your personal data
- Right to correct inaccurate information
- Right to delete your account and data
- Right to data portability (download your data)

**GDPR Rights (EU Users):**
- Right to restrict processing
- Right to object to processing
- Right to withdraw consent
- Right to lodge complaints with supervisory authorities

**CCPA Rights (California Users):**
- Right to know what personal information is collected
- Right to delete personal information
- Right to opt-out of sale of personal information
- Right to non-discrimination for exercising privacy rights

**Jamaica Data Protection Act Rights:**
- Right to be informed about data processing
- Right to access personal data held by BlackRock
- Right to correct inaccurate personal data
- Right to complain to the Office of the Information Commissioner

**How to Exercise Rights:**
- Email: privacy@yaadflex.com
- In-app privacy settings
- Written request to BlackRock Legal Department
- Contact our Data Protection Officer at dpo@blackrock.com

**Response Timeline:**
- We respond to requests within 30 days
- Complex requests may require additional time
- We verify identity before processing requests
- No fees for reasonable requests
      `
    },
    {
      id: 'data-security',
      title: 'Data Security & Protection',
      icon: <Lock className="h-5 w-5" />,
      content: `
**BlackRock Enterprise Security:**
- SOC 2 Type II compliance
- ISO 27001 certified security management
- End-to-end encryption for sensitive data
- Multi-factor authentication requirements

**Platform Security Measures:**
- AES-256 encryption for data at rest
- TLS 1.3 encryption for data in transit
- Regular security audits and penetration testing
- 24/7 security monitoring and incident response

**Financial Data Protection:**
- PCI DSS compliance for payment processing
- Tokenization of sensitive payment information
- Secure API integrations with banking partners
- Real-time fraud detection and prevention

**Access Controls:**
- Role-based access to personal data
- Principle of least privilege access
- Regular access reviews and updates
- Secure employee authentication systems

**Data Backup and Recovery:**
- Encrypted backups with geographic redundancy
- Regular disaster recovery testing
- Business continuity planning
- Incident response and data breach procedures

**Employee Training:**
- Mandatory privacy and security training
- Background checks for data access roles
- Confidentiality agreements and NDAs
- Regular updates on privacy regulations
      `
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: <Globe className="h-5 w-5" />,
      content: `
**Transfer Mechanisms:**
- Standard Contractual Clauses (SCCs) for EU transfers
- Adequacy decisions where available
- Corporate binding rules within BlackRock group
- Additional safeguards as required by law

**Transfer Locations:**
- United States (BlackRock headquarters and data centers)
- European Union (EU data processing facilities)
- Caribbean region (local service delivery)
- Other jurisdictions with adequate protection

**Safeguards in Place:**
- Data localization where legally required
- Encryption during international transfers
- Contractual data protection obligations
- Regular compliance monitoring and audits

**User Control:**
- Notification of significant changes to transfer arrangements
- Right to object to transfers in certain circumstances
- Option to request local data processing where feasible
- Transparency about transfer destinations and safeguards
      `
    },
    {
      id: 'data-retention',
      title: 'Data Retention & Deletion',
      icon: <Calendar className="h-5 w-5" />,
      content: `
**General Retention Periods:**
- Account data: Retained while account is active
- Transaction records: 7 years (financial compliance requirements)
- Location data: 3 years or until user deletion request
- Communication records: 6 months to 3 years based on type

**Automatic Deletion:**
- Inactive accounts: Deleted after 3 years of inactivity
- Voice messages: Auto-deleted after 30 days
- Trip tracking data: Anonymized after 1 year
- Marketing data: Deleted upon opt-out

**Legal Retention Requirements:**
- Financial records: Retained per banking regulations
- Safety records: Retained per transportation regulations
- Tax records: Retained per tax authority requirements
- Litigation holds: Suspended deletion for legal proceedings

**User-Requested Deletion:**
- Account deletion: Processed within 30 days
- Specific data deletion: Processed within 14 days
- Verification required for deletion requests
- Some data may be retained for legal compliance

**Data Anonymization:**
- Personal identifiers removed from retained data
- Aggregated analytics with no personal data
- Anonymized data used for service improvement
- No re-identification attempts made
      `
    },
    {
      id: 'updates-contact',
      title: 'Policy Updates & Contact Information',
      icon: <FileText className="h-5 w-5" />,
      content: `
**Policy Updates:**
- We may update this Privacy Policy periodically
- Material changes will be communicated via email and in-app notifications
- Continued use after changes constitutes acceptance
- Previous versions available upon request

**Notification Methods:**
- Email to registered account address
- In-app notifications and banners
- Website posting with effective date
- 30-day notice period for material changes

**Contact Information:**

**Privacy Inquiries:**
- Email: privacy@yaadflex.com
- Phone: +1-876-YAAD-PRI (876-922-3774)
- Caribbean Support: +1-876-555-0199

**Data Protection Officer:**
- Email: dpo@blackrock.com
- Phone: +1-212-810-5300
- Address: BlackRock DPO, 50 Hudson Yards, New York, NY 10001

**Corporate Legal Department:**
- Email: legal@yaadflex.com
- Address: BlackRock Legal, 50 Hudson Yards, New York, NY 10001

**Regulatory Complaints:**
- Jamaica: Office of the Information Commissioner
- EU: Local data protection authority
- California: Attorney General's Office
- Delaware: Department of Justice

**Business Hours:**
- Customer Support: 24/7
- Privacy Office: Monday-Friday, 9 AM-6 PM EST
- Legal Department: Monday-Friday, 9 AM-5 PM EST
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
              <p className="text-lg text-muted-foreground">BlackRock YaadFlex Data Protection</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            <Badge variant="secondary" className="text-green-600">
              <Shield className="h-3 w-3 mr-1" />
              GDPR Compliant
            </Badge>
            <Badge variant="secondary" className="text-blue-600">
              <Lock className="h-3 w-3 mr-1" />
              CCPA Compliant
            </Badge>
            <Badge variant="secondary" className="text-purple-600">
              <FileText className="h-3 w-3 mr-1" />
              Jamaica DPA
            </Badge>
            <Badge variant="secondary" className="text-orange-600">
              <Calendar className="h-3 w-3 mr-1" />
              Updated: {lastUpdated}
            </Badge>
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            BlackRock is committed to protecting your privacy and maintaining the security of your personal information 
            across all YaadFlex services. This policy explains how we collect, use, and protect your data.
          </p>
        </div>

        {/* Privacy Promise */}
        <Card className="mb-8 border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  BlackRock Privacy Promise
                </h3>
                <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                  As a global financial services leader, BlackRock applies institutional-grade privacy protection to YaadFlex. 
                  We never sell your personal data, we use bank-level security, and we give you complete control over your information. 
                  Your privacy is protected by the same standards that safeguard trillion-dollar investment portfolios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Complete Privacy Policy
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

        {/* Quick Access Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold mb-1">Data Rights</h3>
            <p className="text-sm text-muted-foreground mb-3">Access, correct, or delete your data</p>
            <Button size="sm" variant="outline" data-testid="button-data-rights">
              Manage Data
            </Button>
          </Card>
          
          <Card className="p-4 text-center">
            <Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Contact Privacy Team</h3>
            <p className="text-sm text-muted-foreground mb-3">Questions about your privacy</p>
            <Button size="sm" variant="outline" data-testid="button-contact-privacy">
              privacy@yaadflex.com
            </Button>
          </Card>
          
          <Card className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold mb-1">Legal Documents</h3>
            <p className="text-sm text-muted-foreground mb-3">Terms, agreements, and policies</p>
            <Link href="/terms">
              <Button size="sm" variant="outline" data-testid="link-terms-privacy">
                View Terms
              </Button>
            </Link>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Last Updated: {lastUpdated} | Version 1.0 | GDPR/CCPA/Jamaica DPA Compliant
          </div>
          <div className="flex gap-3">
            <Link href="/terms">
              <Button variant="outline" size="sm" data-testid="link-terms-from-privacy">
                Terms of Service
              </Button>
            </Link>
            <Link href="/legal">
              <Button variant="outline" size="sm" data-testid="link-legal-center-privacy">
                Legal Center
              </Button>
            </Link>
            <Button size="sm" data-testid="button-contact-dpo">
              Contact DPO
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}