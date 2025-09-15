import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Store, 
  CreditCard, 
  Shield, 
  Globe, 
  CheckCircle2,
  Users,
  Calendar,
  FileText,
  Phone,
  DollarSign
} from 'lucide-react';
import { Link } from 'wouter';

export default function BusinessPartnerAgreement() {
  // LEGAL COMPLIANCE: Version tracking for audit trails and GDPR/CCPA compliance
  const policyVersion = "v2.1.0";
  const lastUpdated = "September 15, 2025";
  const effectiveDate = "September 15, 2025";

  const sections = [
    {
      id: 'partnership-overview',
      title: 'Business Partnership Overview',
      icon: <Building2 className="h-5 w-5" />,
      content: `
**Platform Provider:** BlackRock, Inc., a Delaware corporation, operates YaadFlex as a comprehensive business marketplace and service coordination platform.

**Partnership Structure:** This agreement establishes a commercial partnership between BlackRock and registered business partners for service delivery through the YaadFlex platform.

**Business Categories Covered:**
- Travel agents and tourism services
- Restaurants and food service providers
- Transportation and logistics companies
- Accommodation providers (hotels, guest houses)
- Entertainment and event services
- Beauty, wellness, and personal services
- Professional services and consultants
- Photography, media, and creative services
- Education and training providers
- Healthcare and medical services

**Platform Benefits:**
- Access to YaadFlex's growing customer base
- Multi-currency payment processing capabilities
- Professional business listing and marketing tools
- Customer review and rating system
- Booking and reservation management
- Analytics and business intelligence tools

**Corporate Infrastructure:** BlackRock provides enterprise-grade technology, secure payment processing, regulatory compliance, and customer support infrastructure to all business partners.
      `
    },
    {
      id: 'business-registration',
      title: 'Business Registration & Verification',
      icon: <CheckCircle2 className="h-5 w-5" />,
      content: `
**Registration Requirements:** All business partners must complete BlackRock's verification process before accessing platform services.

**Required Documentation:**
- Valid business registration certificate
- Tax identification number (TIN/TRN)
- Business insurance verification
- Operating licenses and permits as applicable
- Bank account information for payment processing
- Principal owner identification and background verification

**Verification Process:**
- Document review and authentication
- Business legitimacy verification
- Insurance and compliance confirmation
- Background checks on business principals
- Financial verification and credit assessment

**Business Classifications:**
- Sole proprietorship and individual operators
- Partnership and joint ventures
- Private limited companies
- Public companies and corporations
- Non-profit organizations (where applicable)

**Ongoing Compliance:**
- Annual registration renewals
- Continuous compliance monitoring
- Updated documentation as required
- Regular business performance reviews

**International Businesses:**
- Foreign business registration requirements
- Tax treaty considerations and compliance
- Multi-jurisdictional regulatory adherence
- Currency exchange and reporting obligations
      `
    },
    {
      id: 'service-delivery',
      title: 'Service Delivery & Quality Standards',
      icon: <Store className="h-5 w-5" />,
      content: `
**Service Excellence:** Business partners must maintain high standards of service delivery to YaadFlex customers.

**Quality Standards:**
- Professional service delivery and customer interaction
- Timely response to customer inquiries and bookings
- Accurate service descriptions and pricing information
- Compliance with industry-specific quality requirements

**Customer Service Requirements:**
- Professional and courteous customer interaction
- Prompt response to customer communications
- Resolution of customer complaints and concerns
- Participation in quality improvement initiatives

**Service Availability:**
- Accurate listing of business hours and availability
- Timely updates to service offerings and pricing
- Holiday and closure notifications
- Capacity management and booking coordination

**Performance Monitoring:**
- Customer rating and review system participation
- Regular performance metrics and analytics
- Quality audits and assessments
- Continuous improvement programs

**Platform Integration:**
- Use of YaadFlex booking and scheduling systems
- Integration with payment processing systems
- Utilization of customer communication tools
- Compliance with platform policies and procedures

**Marketing and Promotion:**
- Professional business profile presentation
- Accurate marketing materials and descriptions
- Compliance with advertising standards
- Participation in platform promotional activities
      `
    },
    {
      id: 'payment-financial',
      title: 'Payment Processing & Financial Terms',
      icon: <CreditCard className="h-5 w-5" />,
      content: `
**Payment Infrastructure:** BlackRock processes all customer payments through secure, enterprise-grade financial systems supporting multiple currencies.

**Supported Currencies:**
- Jamaican Dollar (JMD) - Primary business currency
- US Dollar (USD) - International and tourism services
- Kuwaiti Dinar (KWD) - Specialized business services
- Euro (EUR) and British Pound (GBP) - European market services

**Payment Processing:**
- Secure payment gateway integration
- Real-time transaction processing
- Automatic currency conversion at competitive rates
- PCI DSS compliant payment handling

**Business Payment Terms:**
- **Net-15 Payment Schedule:** Business partners receive payments 15 days after service completion
- **Platform Fee:** 3-7% processing fee depending on service category and volume
- **Currency Exchange:** Competitive rates with transparent fee structure
- **Monthly Statements:** Detailed financial reporting and analytics

**Fee Structure by Business Type:**
- **Food & Delivery:** 5% platform fee
- **Transportation:** 15% platform fee (includes insurance and safety infrastructure)
- **Accommodation:** 3% platform fee
- **Professional Services:** 4% platform fee
- **Entertainment & Events:** 6% platform fee
- **Tourism & Travel:** 4% platform fee

**Banking Requirements:**
- Verified business bank account in operating jurisdiction
- Modern electronic banking capabilities
- Compliance with anti-money laundering (AML) regulations
- Multi-currency account capabilities recommended

**Financial Reporting:**
- Monthly revenue and transaction reports
- Tax documentation and compliance assistance
- Financial analytics and business intelligence
- Audit trail and transaction history
      `
    },
    {
      id: 'marketing-promotion',
      title: 'Marketing & Brand Partnership',
      icon: <Globe className="h-5 w-5" />,
      content: `
**Brand Partnership:** Business partners benefit from association with BlackRock's established global brand and YaadFlex's growing market presence.

**Marketing Benefits:**
- Professional business listing in YaadFlex marketplace
- Search engine optimization and online visibility
- Customer review and rating system
- Social media integration and promotion
- Featured listing opportunities

**Co-Marketing Opportunities:**
- Participation in YaadFlex promotional campaigns
- Cross-promotion with complementary businesses
- Special event and seasonal marketing
- Tourism and visitor promotion programs

**Brand Guidelines:**
- Use of YaadFlex partner badges and certifications
- Compliance with brand standards and guidelines
- Professional representation of partnership
- Consistent brand messaging and quality

**Digital Marketing Tools:**
- Business analytics and customer insights
- Social media management tools
- Email marketing and customer communication
- Online reputation management

**Promotional Programs:**
- New business partner introduction campaigns
- Seasonal and special event promotions
- Customer loyalty and rewards programs
- Referral and partnership incentives

**Content and Advertising:**
- Professional photography and content creation support
- Advertising space in YaadFlex promotional materials
- Partnership announcements and press coverage
- Industry recognition and awards programs
      `
    },
    {
      id: 'compliance-regulatory',
      title: 'Regulatory Compliance & Legal Requirements',
      icon: <Shield className="h-5 w-5" />,
      content: `
**Legal Compliance:** Business partners must comply with all applicable laws and regulations in their operating jurisdictions.

**Business Licensing:**
- Valid operating licenses for business category
- Professional certifications and qualifications
- Health and safety compliance certifications
- Environmental and zoning compliance

**Tax Obligations:**
- Business tax registration and compliance
- Value-added tax (VAT/GCT) registration where applicable
- Income tax reporting and payment
- International tax compliance for cross-border services

**Insurance Requirements:**
- General business liability insurance
- Professional indemnity insurance where applicable
- Property and equipment insurance
- Business interruption insurance recommended

**Data Protection:**
- Compliance with Jamaica Data Protection Act
- GDPR compliance for European customers
- Customer privacy and confidentiality protection
- Secure handling of customer information

**Industry-Specific Regulations:**
- Food safety regulations for restaurants
- Transportation authority compliance for logistics
- Tourism board registration for travel services
- Professional body membership where required

**International Compliance:**
- Cross-border service delivery regulations
- International trade and customs compliance
- Currency exchange and reporting requirements
- Anti-money laundering (AML) compliance
      `
    },
    {
      id: 'platform-technology',
      title: 'Technology Platform & Integration',
      icon: <FileText className="h-5 w-5" />,
      content: `
**Technology Access:** Business partners receive access to YaadFlex's comprehensive business management and customer engagement platform.

**Platform Features:**
- Business dashboard and analytics
- Customer booking and reservation system
- Payment processing and financial management
- Customer communication and messaging tools
- Inventory and service management
- Marketing and promotional tools

**Integration Requirements:**
- Use of YaadFlex booking and scheduling systems
- Integration with platform payment processing
- Compliance with platform communication standards
- Participation in customer rating and review system

**Technical Support:**
- Platform training and onboarding assistance
- Ongoing technical support and troubleshooting
- Regular platform updates and enhancements
- Business process optimization guidance

**Data and Analytics:**
- Customer behavior and preferences analytics
- Business performance metrics and reporting
- Market trends and competitive analysis
- Revenue optimization and forecasting tools

**Mobile and Web Access:**
- Mobile application for business management
- Web dashboard for comprehensive business control
- Real-time notifications and alerts
- Offline capability for essential functions

**Security and Reliability:**
- Enterprise-grade security and data protection
- 99.9% platform uptime guarantee
- Regular security updates and monitoring
- Disaster recovery and business continuity
      `
    },
    {
      id: 'termination-dispute',
      title: 'Agreement Termination & Dispute Resolution',
      icon: <Users className="h-5 w-5" />,
      content: `
**Voluntary Termination:** Business partners may terminate this agreement with 30 days written notice to BlackRock.

**Termination Process:**
- Formal written notice of termination intention
- Completion of outstanding customer commitments
- Final payment processing and settlement
- Return of platform materials and access credentials

**Involuntary Termination:** BlackRock may terminate partnerships for violations of this agreement or quality standards.

**Grounds for Termination:**
- Consistent failure to meet quality standards
- Violation of legal or regulatory requirements
- Customer safety or security concerns
- Fraudulent or deceptive business practices
- Failure to maintain required licenses or insurance

**Termination Consequences:**
- Loss of access to YaadFlex platform and services
- Removal of business listings and promotional materials
- Final settlement of outstanding payments
- Confidentiality obligations continue post-termination

**Dispute Resolution:**
- Direct negotiation and mediation as first resort
- Formal arbitration through American Arbitration Association
- Jurisdiction in Delaware courts for legal proceedings
- Applicable law: Delaware state law and US federal law

**Appeal Process:**
- Formal appeal mechanism for partnership terminations
- Review by senior management and legal teams
- Opportunity to address issues and request reinstatement
- Final determination communicated within 30 days

**Post-Termination:**
- Customer transition and continuity planning
- Data retention and deletion according to privacy policies
- Non-compete and confidentiality obligations
- Professional references and recommendation procedures
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Business Partner Agreement</h1>
              <p className="text-lg text-muted-foreground">Commercial Partnership Terms</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            <Badge variant="secondary" className="text-purple-600">
              <Building2 className="h-3 w-3 mr-1" />
              Business Partners
            </Badge>
            <Badge variant="secondary" className="text-green-600">
              <DollarSign className="h-3 w-3 mr-1" />
              Net-15 Payments
            </Badge>
            <Badge variant="secondary" className="text-blue-600">
              <Globe className="h-3 w-3 mr-1" />
              Multi-Currency
            </Badge>
            <Badge variant="secondary" className="text-orange-600">
              <Calendar className="h-3 w-3 mr-1" />
              Updated: {lastUpdated}
            </Badge>
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            This Business Partner Agreement governs commercial partnerships between BlackRock and businesses 
            registered on the YaadFlex platform. Join Jamaica's premier business marketplace.
          </p>
        </div>

        {/* Partnership Benefits */}
        <Card className="mb-8 border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Store className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  BlackRock Business Partnership Benefits
                </h3>
                <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                  Partner with BlackRock's global infrastructure to reach more customers across Jamaica and the Caribbean. 
                  Benefit from enterprise-grade payment processing, marketing tools, and customer management systems. 
                  Low platform fees, fast payments, and professional business growth support.
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
              Business Partnership Agreement
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

        {/* Business Categories */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Store className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold mb-1">Retail & Food</h3>
            <p className="text-sm text-muted-foreground mb-3">Restaurants, shops, vendors</p>
            <Badge variant="secondary" className="text-purple-600">5% Platform Fee</Badge>
          </Card>
          
          <Card className="p-4 text-center">
            <Building2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Professional Services</h3>
            <p className="text-sm text-muted-foreground mb-3">Consulting, legal, medical</p>
            <Badge variant="secondary" className="text-blue-600">4% Platform Fee</Badge>
          </Card>
          
          <Card className="p-4 text-center">
            <Globe className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold mb-1">Tourism & Travel</h3>
            <p className="text-sm text-muted-foreground mb-3">Hotels, tours, experiences</p>
            <Badge variant="secondary" className="text-green-600">3% Platform Fee</Badge>
          </Card>
        </div>

        {/* Registration CTA */}
        <Card className="mt-8 text-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Ready to Partner with BlackRock?</h3>
            <p className="text-muted-foreground mb-4">
              Join the YaadFlex business network and start reaching more customers today.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/business-registration">
                <Button data-testid="button-register-business">
                  Register Your Business
                </Button>
              </Link>
              <Button variant="outline" data-testid="button-business-support">
                <Phone className="h-4 w-4 mr-2" />
                Business Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Last Updated: {lastUpdated} | Version 1.0 | Business Partner Agreement
          </div>
          <div className="flex gap-3">
            <Link href="/terms">
              <Button variant="outline" size="sm" data-testid="link-terms-from-business">
                Terms of Service
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="outline" size="sm" data-testid="link-privacy-from-business">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/legal">
              <Button size="sm" data-testid="link-legal-center-business">
                Legal Center
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}