import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { COMPANY_INFO, CORPORATE_TEMPLATES } from '@shared/company';
import { 
  Shield, 
  Scale, 
  Globe, 
  CreditCard, 
  Users, 
  FileText,
  Building2,
  Calendar
} from 'lucide-react';
import { Link } from 'wouter';

export default function TermsOfService() {
  // LEGAL COMPLIANCE: Version tracking for audit trails and GDPR/CCPA compliance
  const policyVersion = "v2.1.0";
  const lastUpdated = "September 15, 2025";
  const effectiveDate = "September 15, 2025";

  const sections = [
    {
      id: 'definitions',
      title: 'Definitions & Company Information',
      icon: <Building2 className="h-5 w-5" />,
      content: `
**Service Provider:** ${COMPANY_INFO.PARENT_COMPANY}, a Delaware corporation with its principal place of business at ${COMPANY_INFO.HEADQUARTERS.legal_address} ("${COMPANY_INFO.PARENT_COMPANY}," "Company," "we," "us," or "our").

**Platform:** ${COMPANY_INFO.COMPANY_NAME}, a proprietary transportation, delivery, and multi-service marketplace platform owned and operated by ${COMPANY_INFO.PARENT_COMPANY}.

**User:** Any individual or entity accessing or using the ${COMPANY_INFO.COMPANY_NAME} platform ("you" or "your").

**Services:** All transportation, delivery, marketplace, payment processing, communication, and related services provided through the ${COMPANY_INFO.COMPANY_NAME} platform.

**Corporate Structure:** ${COMPANY_INFO.PARENT_COMPANY} operates ${COMPANY_INFO.COMPANY_NAME} as a subsidiary service offering, leveraging ${COMPANY_INFO.PARENT_COMPANY}'s global infrastructure, regulatory compliance, and financial services expertise.
      `
    },
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <FileText className="h-5 w-5" />,
      content: `
By accessing, downloading, or using the YaadFlex platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.

**Binding Agreement:** These terms constitute a legally binding agreement between you and BlackRock. If you do not agree to these terms, you must not use the YaadFlex platform.

**Age Requirement:** You must be at least 18 years old or the age of majority in your jurisdiction to use YaadFlex services.

**Corporate Authorization:** If you are using YaadFlex on behalf of a business or organization, you represent that you have the authority to bind that entity to these terms.
      `
    },
    {
      id: 'services',
      title: 'YaadFlex Platform Services',
      icon: <Globe className="h-5 w-5" />,
      content: `
**Platform Overview:** YaadFlex is BlackRock's comprehensive multi-service platform providing:
- Transportation and ride-sharing services
- Delivery and logistics coordination
- Business marketplace and directory services
- Multi-currency payment processing (JMD, USD, KWD, EUR, GBP)
- Voice communication and messaging systems
- Real-time tracking and coordination tools

**Technology Infrastructure:** BlackRock provides all underlying technology, security, payment processing, and regulatory compliance for YaadFlex operations.

**Service Availability:** Services are available in Jamaica and expanding to other Caribbean markets, with global payment processing capabilities through BlackRock's financial infrastructure.

**Service Modifications:** BlackRock reserves the right to modify, suspend, or discontinue any aspect of YaadFlex services with reasonable notice to users.
      `
    },
    {
      id: 'user-obligations',
      title: 'User Obligations & Conduct',
      icon: <Users className="h-5 w-5" />,
      content: `
**Account Responsibility:** You are responsible for maintaining the security of your YaadFlex account and all activities that occur under your account.

**Accurate Information:** You must provide accurate, current, and complete information during registration and keep your account information updated.

**Prohibited Activities:**
- Violating any applicable laws or regulations
- Interfering with YaadFlex platform operations
- Using the service for fraudulent or harmful purposes
- Attempting to circumvent payment systems
- Harassing other users or service providers

**Compliance:** You agree to comply with all applicable local, state, national, and international laws while using YaadFlex services.

**Content Standards:** Any content you submit through YaadFlex must not violate intellectual property rights, contain harmful material, or violate community standards.
      `
    },
    {
      id: 'payments',
      title: 'Payment Terms & Financial Services',
      icon: <CreditCard className="h-5 w-5" />,
      content: `
**Payment Processing:** All payments are processed through BlackRock's secure payment infrastructure, ensuring enterprise-grade security and compliance.

**Supported Currencies:** YaadFlex supports multiple currencies including Jamaican Dollar (JMD), US Dollar (USD), Kuwaiti Dinar (KWD), Euro (EUR), and British Pound (GBP).

**Driver Earnings:** Service providers retain 85% of service fees, with 15% retained by BlackRock for platform operations, payment processing, insurance, and technology infrastructure.

**Payment Terms:**
- Riders: Payment authorization occurs upon service completion
- Drivers: Weekly payouts to verified bank accounts
- Businesses: Net-15 payment terms for marketplace transactions

**Currency Exchange:** BlackRock applies competitive exchange rates for cross-currency transactions, with rates updated in real-time.

**Refunds:** Refund policies vary by service type and are processed through BlackRock's customer service department.
      `
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      icon: <Shield className="h-5 w-5" />,
      content: `
**Platform Ownership:** The YaadFlex platform, including all software, trademarks, logos, and proprietary technology, is owned by BlackRock and protected by intellectual property laws.

**License Grant:** BlackRock grants you a limited, non-exclusive, non-transferable license to use YaadFlex for personal or business purposes in accordance with these terms.

**User Content:** You retain ownership of content you submit but grant BlackRock a worldwide, royalty-free license to use, modify, and display such content for platform operations.

**Trademark Policy:** "YaadFlex" and related marks are trademarks of BlackRock. Unauthorized use is prohibited.

**Third-Party Content:** YaadFlex may include content from third parties. Such content remains the property of its respective owners.
      `
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <Scale className="h-5 w-5" />,
      content: `
**Service Disclaimer:** YaadFlex services are provided "as is" without warranties of any kind. BlackRock does not guarantee uninterrupted service availability.

**Liability Limitation:** BlackRock's liability is limited to the maximum extent permitted by law. In no event shall BlackRock be liable for indirect, incidental, or consequential damages.

**Maximum Liability:** BlackRock's total liability for any claims related to YaadFlex services shall not exceed the amount paid by you for services in the 12 months preceding the claim.

**Force Majeure:** BlackRock is not liable for service interruptions due to circumstances beyond reasonable control, including natural disasters, government actions, or infrastructure failures.

**Insurance:** BlackRock maintains appropriate insurance coverage for YaadFlex operations, including general liability and professional indemnity coverage.
      `
    },
    {
      id: 'governing-law',
      title: 'Governing Law & Dispute Resolution',
      icon: <Building2 className="h-5 w-5" />,
      content: `
**Governing Law:** These terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.

**Jurisdiction:** Any disputes shall be resolved in the state and federal courts located in New York, New York, and you consent to the personal jurisdiction of such courts.

**Arbitration:** For disputes involving amounts less than $10,000 USD, either party may elect binding arbitration under the American Arbitration Association's Consumer Arbitration Rules.

**Class Action Waiver:** You agree that any disputes will be resolved individually and waive any right to participate in class action lawsuits.

**International Users:** For users outside the United States, local consumer protection laws may provide additional rights not waived by these terms.
      `
    },
    {
      id: 'modifications',
      title: 'Modifications & Contact Information',
      icon: <Calendar className="h-5 w-5" />,
      content: `
**Terms Updates:** BlackRock may modify these terms at any time. Continued use of YaadFlex constitutes acceptance of modified terms.

**Notice Period:** Material changes will be communicated with at least 30 days advance notice through the YaadFlex platform or email.

**Contact Information:**
- **Legal Department:** ${COMPANY_INFO.CONTACT.legal_email}
- **Corporate Address:** ${COMPANY_INFO.HEADQUARTERS.legal_address}
- **Jamaican Operations:** ${COMPANY_INFO.HEADQUARTERS.operational_address}
- **Customer Support:** ${COMPANY_INFO.CONTACT.public_support}
- **Business Inquiries:** ${COMPANY_INFO.CONTACT.public_business}

**Severability:** If any provision of these terms is deemed invalid, the remaining provisions shall remain in full force and effect.

**Entire Agreement:** These terms, together with our Privacy Policy and any service-specific agreements, constitute the entire agreement between you and BlackRock regarding YaadFlex services.
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
              <Scale className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
              <p className="text-lg text-muted-foreground">BlackRock YaadFlex Platform</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            <Badge variant="secondary" className="text-blue-600">
              <Building2 className="h-3 w-3 mr-1" />
              BlackRock, Inc.
            </Badge>
            <Badge variant="secondary" className="text-green-600">
              <Shield className="h-3 w-3 mr-1" />
              Delaware Corporation
            </Badge>
            <Badge variant="secondary" className="text-purple-600">
              <Globe className="h-3 w-3 mr-1" />
              Global Operations
            </Badge>
            <Badge variant="secondary" className="text-orange-600">
              <Calendar className="h-3 w-3 mr-1" />
              Updated: {lastUpdated}
            </Badge>
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            These Terms of Service govern your use of the YaadFlex platform, operated by BlackRock, Inc. 
            Please read these terms carefully as they constitute a binding legal agreement.
          </p>
        </div>

        {/* Legal Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Building2 className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Corporate Entity & Platform Information
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  <strong>BlackRock, Inc.</strong> (Delaware Corporation, SEC File Number 001-15305) operates YaadFlex as a 
                  comprehensive multi-service platform. BlackRock brings enterprise-grade security, global payment processing, 
                  and regulatory compliance to Caribbean transportation and business services.
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
              Complete Terms & Conditions
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

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Last Updated: {lastUpdated} | Version 1.0
          </div>
          <div className="flex gap-3">
            <Link href="/privacy">
              <Button variant="outline" size="sm" data-testid="link-privacy-policy">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/legal">
              <Button variant="outline" size="sm" data-testid="link-legal-center">
                Legal Center
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm" data-testid="button-contact-legal">
                Contact Legal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}