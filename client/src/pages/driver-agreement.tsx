import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { COMPANY_INFO, CORPORATE_TEMPLATES } from '@shared/company';
import { 
  Car, 
  DollarSign, 
  Shield, 
  CreditCard, 
  Clock, 
  CheckCircle2,
  Building2,
  Calendar,
  FileText,
  Phone,
  Users
} from 'lucide-react';
import { Link } from 'wouter';

export default function DriverAgreement() {
  // LEGAL COMPLIANCE: Version tracking for audit trails and GDPR/CCPA compliance
  const policyVersion = "v2.1.0";
  const lastUpdated = "September 15, 2025";
  const effectiveDate = "September 15, 2025";

  const sections = [
    {
      id: 'contractor-relationship',
      title: 'Independent Contractor Relationship',
      icon: <Building2 className="h-5 w-5" />,
      content: `
**Service Provider:** ${COMPANY_INFO.PARENT_COMPANY}, a Delaware corporation, provides the ${COMPANY_INFO.COMPANY_NAME} platform connecting independent transportation providers with riders.

**Independent Contractor Status:** You are an independent contractor, not an employee of ${COMPANY_INFO.PARENT_COMPANY}. This agreement establishes a technology services relationship, not an employment relationship.

**Business Relationship:**
- You use BlackRock's YaadFlex technology platform to connect with potential customers
- You provide transportation services as an independent business operator
- BlackRock facilitates payment processing and platform operations
- You retain control over when, where, and how often you provide services

**No Employment Relationship:**
- You are not entitled to employment benefits
- No workers' compensation or unemployment insurance through BlackRock
- You are responsible for your own tax obligations and business insurance
- Freedom to work for other platforms or operate your own transportation business

**Corporate Structure:** BlackRock operates YaadFlex as a technology platform leveraging global financial services infrastructure to provide secure payment processing, insurance coordination, and regulatory compliance.
      `
    },
    {
      id: 'earnings-payment',
      title: 'Earnings Structure & Payment Terms',
      icon: <DollarSign className="h-5 w-5" />,
      content: `
**Earnings Model:** Drivers retain 85% of all service fees, with BlackRock retaining 15% for platform operations, payment processing, insurance, and technology infrastructure.

**Payment Breakdown:**
- **Driver Earnings:** 85% of total fare paid by rider
- **Platform Fee:** 15% covers technology, payment processing, insurance, customer support
- **No Hidden Fees:** All deductions clearly disclosed in app
- **Transparent Pricing:** Real-time fare calculation shown before trip acceptance

**Multi-Currency Earnings:**
- Jamaican Dollar (JMD) - Primary earning currency
- US Dollar (USD) - International riders and premium services
- Kuwaiti Dinar (KWD) - Specialized client services
- Euro (EUR) and British Pound (GBP) - Tourism and business travelers

**Payment Processing:**
- **Weekly Payouts:** Automatic bank transfers every Wednesday
- **Instant Pay Option:** Available for urgent withdrawals (small fee applies)
- **Direct Deposit:** Secure transfers to verified Jamaican bank accounts
- **Payment Security:** Enterprise-grade encryption and fraud protection

**Surge Pricing:** During high-demand periods, surge multipliers increase total fares, with drivers receiving 85% of the increased amount.

**Bonus and Incentives:**
- Peak hour bonuses during high-demand times
- Weekly earning goals with completion bonuses
- New driver onboarding incentives
- Long-term driver loyalty rewards

**Banking Requirements:**
- Verified business or personal bank account in Jamaica
- Account must be in driver's legal name
- Modern banking with electronic transfer capability
- Compliance with banking regulations and AML requirements
      `
    },
    {
      id: 'vehicle-requirements',
      title: 'Vehicle & Insurance Requirements',
      icon: <Car className="h-5 w-5" />,
      content: `
**Vehicle Standards:** All vehicles must meet YaadFlex safety and quality standards for passenger transportation.

**Vehicle Eligibility:**
- Maximum age: 15 years from current model year
- Valid registration and inspection certificates
- Clean, well-maintained interior and exterior
- Working air conditioning and safety features
- Minimum 4-door sedan or suitable passenger vehicle

**Insurance Requirements:**
- Valid motor vehicle insurance with commercial coverage
- Minimum liability coverage as required by Jamaican law
- Coverage for passenger transportation services
- Proof of insurance must be current and verifiable

**Vehicle Inspection:**
- Annual safety inspection by certified mechanics
- Platform compliance verification
- Documentation of maintenance records
- Re-inspection after any major repairs or incidents

**Vehicle Monitoring:**
- GPS tracking for safety and service optimization
- Real-time location sharing during active trips
- Vehicle performance and maintenance alerts
- Compliance with transportation regulations

**Commercial Vehicle Standards:**
- Professional appearance and cleanliness
- No advertising or branding without BlackRock approval
- Smoke-free environment required
- Emergency safety equipment recommended
      `
    },
    {
      id: 'background-safety',
      title: 'Background Checks & Safety Requirements',
      icon: <Shield className="h-5 w-5" />,
      content: `
**Background Verification:** BlackRock requires comprehensive background checks for all drivers to ensure passenger safety.

**Required Checks:**
- Criminal background check through Jamaica Constabulary Force
- Driving record verification for past 7 years
- Identity verification with government-issued documents
- Reference checks from previous employers or community members

**Ongoing Monitoring:**
- Annual background check renewals
- Continuous monitoring for driving violations
- Incident reporting and investigation
- Safety performance tracking and scoring

**Safety Standards:**
- Zero tolerance for impaired driving (alcohol or drugs)
- Professional conduct with all passengers
- Compliance with all traffic laws and regulations
- Immediate reporting of accidents or incidents

**Training Requirements:**
- Platform orientation and training completion
- Customer service standards training
- Safety and emergency response procedures
- Ongoing education and updates

**Safety Features:**
- Real-time trip monitoring and GPS tracking
- Emergency button and rapid response system
- Two-way rating system for drivers and passengers
- 24/7 safety support and incident response

**Disqualifying Factors:**
- Serious criminal convictions
- Multiple driving violations or license suspensions
- History of vehicle accidents due to negligence
- Failure to maintain required insurance coverage
      `
    },
    {
      id: 'platform-usage',
      title: 'Platform Usage & Performance Standards',
      icon: <Clock className="h-5 w-5" />,
      content: `
**Platform Access:** Drivers receive access to the YaadFlex driver application and platform features upon agreement acceptance and verification completion.

**Service Standards:**
- Maintain minimum 4.5-star average rating
- Accept reasonable trip requests based on availability
- Arrive at pickup locations within estimated time frames
- Provide professional and courteous service

**Availability and Scheduling:**
- Flexible scheduling - work when you choose
- No minimum hour requirements
- Option to set availability preferences
- Advanced scheduling for regular customers

**Communication Requirements:**
- Respond to passenger messages promptly
- Use platform communication systems (voice messages, emergency calling)
- Maintain professional communication standards
- Report platform issues or technical problems

**Navigation and Routing:**
- Use GPS navigation systems for efficient routing
- Follow passenger preferences for route selection
- Avoid unnecessary detours or delays
- Report traffic or road condition issues

**Performance Monitoring:**
- Regular performance reviews and feedback
- Data analytics to improve service quality
- Recognition programs for high-performing drivers
- Support and coaching for improvement opportunities

**Platform Updates:**
- Regular app updates and feature enhancements
- Training on new platform features
- Compliance with updated policies and procedures
- Feedback opportunities for platform improvements
      `
    },
    {
      id: 'customer-service',
      title: 'Customer Service & Professional Standards',
      icon: <Users className="h-5 w-5" />,
      content: `
**Professional Conduct:** Drivers represent the YaadFlex brand and must maintain high standards of professionalism.

**Customer Service Excellence:**
- Courteous and respectful interaction with all passengers
- Assistance with boarding and luggage when appropriate
- Clean, comfortable vehicle environment
- Punctual and reliable service delivery

**Communication Standards:**
- Professional language and tone
- Clear communication about pickup, routes, and timing
- Respectful handling of customer complaints or concerns
- Prompt response to platform messages

**Cultural Sensitivity:**
- Respect for diverse passenger backgrounds and preferences
- Accommodation of reasonable accessibility needs
- Professional conduct regardless of personal beliefs
- Inclusive service delivery for all community members

**Problem Resolution:**
- Direct resolution of minor service issues
- Escalation of serious concerns to platform support
- Documentation of incidents or unusual circumstances
- Cooperation with customer service investigations

**Continuous Improvement:**
- Acceptance of constructive feedback
- Participation in quality improvement initiatives
- Professional development and skill enhancement
- Commitment to service excellence and passenger satisfaction
      `
    },
    {
      id: 'compliance-legal',
      title: 'Legal Compliance & Regulatory Requirements',
      icon: <FileText className="h-5 w-5" />,
      content: `
**Legal Compliance:** Drivers must comply with all applicable local, national, and international laws while providing services through YaadFlex.

**Transportation Regulations:**
- Valid driver's license for commercial passenger transportation
- Compliance with Jamaica's transportation authority requirements
- Adherence to municipal taxi and transport regulations
- Registration with appropriate government agencies as required

**Tax Obligations:**
- Responsibility for personal and business tax compliance
- Independent contractor tax status and reporting
- Record keeping for business income and expenses
- Compliance with Jamaica Tax Administration requirements

**Data Protection:**
- Compliance with Jamaica Data Protection Act
- Respect for passenger privacy and confidentiality
- Secure handling of customer information
- Reporting of data breaches or security incidents

**International Compliance:**
- Compliance with applicable laws when serving international passengers
- Currency exchange regulations for multi-currency transactions
- Anti-money laundering (AML) compliance
- Know Your Customer (KYC) requirements for high-value transactions

**Platform Compliance:**
- Adherence to BlackRock policies and procedures
- Compliance with updated terms and conditions
- Cooperation with regulatory investigations or audits
- Maintenance of required licenses and certifications
      `
    },
    {
      id: 'termination-deactivation',
      title: 'Agreement Termination & Account Deactivation',
      icon: <CheckCircle2 className="h-5 w-5" />,
      content: `
**Voluntary Termination:** Drivers may terminate this agreement at any time by providing written notice to BlackRock.

**Termination Process:**
- Submit termination request through app or email
- Complete any pending trips and resolve outstanding issues
- Final payment processing within 7 business days
- Return of any BlackRock property or materials

**Involuntary Deactivation:** BlackRock may deactivate driver accounts for violations of this agreement or safety concerns.

**Grounds for Deactivation:**
- Safety violations or incidents
- Consistently poor performance ratings
- Violation of professional conduct standards
- Legal issues affecting driving eligibility
- Fraud or misuse of platform systems

**Deactivation Process:**
- Investigation of reported issues or violations
- Opportunity to respond and provide explanations
- Review by specialized team and final determination
- Appeal process available for disputed deactivations

**Effect of Termination:**
- Loss of access to YaadFlex platform and services
- Final payment of outstanding earnings
- Deletion of account data according to privacy policy
- Confidentiality obligations continue post-termination

**Data and Information:**
- Driver data retained according to legal requirements
- Trip and earning records maintained for tax and audit purposes
- Right to request data deletion subject to legal obligations
- Continued protection of confidential business information

**Appeal and Reactivation:**
- Appeal process for disputed deactivations
- Opportunity to address issues and request reactivation
- Requirements for account reinstatement
- Final decisions communicated within reasonable timeframes
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-full">
              <Car className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Driver Agreement</h1>
              <p className="text-lg text-muted-foreground">Independent Contractor Terms</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            <Badge variant="secondary" className="text-green-600">
              <DollarSign className="h-3 w-3 mr-1" />
              85% Earnings
            </Badge>
            <Badge variant="secondary" className="text-blue-600">
              <Car className="h-3 w-3 mr-1" />
              Independent Contractor
            </Badge>
            <Badge variant="secondary" className="text-purple-600">
              <Shield className="h-3 w-3 mr-1" />
              Safety Verified
            </Badge>
            <Badge variant="secondary" className="text-orange-600">
              <Calendar className="h-3 w-3 mr-1" />
              Updated: {lastUpdated}
            </Badge>
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            This Driver Agreement establishes the terms for independent transportation providers using the YaadFlex platform. 
            By signing up as a driver, you agree to these terms and BlackRock's operational standards.
          </p>
        </div>

        {/* Earnings Highlight */}
        <Card className="mb-8 border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <DollarSign className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Fair Earnings Structure - Keep 85% of Every Fare
                </h3>
                <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                  YaadFlex drivers earn 85% of every fare with transparent, fair deductions. BlackRock's 15% platform fee 
                  covers technology infrastructure, payment processing, insurance coordination, and 24/7 support. 
                  Weekly direct deposits to your Jamaican bank account with multi-currency earning opportunities.
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
              Driver Agreement Terms
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

        {/* Driver Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold mb-1">85% Earnings</h3>
            <p className="text-sm text-muted-foreground mb-3">Keep most of what you earn</p>
            <Badge variant="secondary" className="text-green-600">Weekly Payouts</Badge>
          </Card>
          
          <Card className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Flexible Schedule</h3>
            <p className="text-sm text-muted-foreground mb-3">Work when you want</p>
            <Badge variant="secondary" className="text-blue-600">Your Choice</Badge>
          </Card>
          
          <Card className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold mb-1">Safety & Support</h3>
            <p className="text-sm text-muted-foreground mb-3">24/7 safety assistance</p>
            <Badge variant="secondary" className="text-purple-600">Protected</Badge>
          </Card>
        </div>

        {/* Registration CTA */}
        <Card className="mt-8 text-center bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-950/20 dark:to-yellow-950/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Ready to Start Earning?</h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of drivers earning fair wages with YaadFlex's transparent platform.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/driver-registration">
                <Button data-testid="button-register-driver">
                  Register as Driver
                </Button>
              </Link>
              <Button variant="outline" data-testid="button-driver-support">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Last Updated: {lastUpdated} | Version 1.0 | Driver Agreement
          </div>
          <div className="flex gap-3">
            <Link href="/terms">
              <Button variant="outline" size="sm" data-testid="link-terms-from-driver">
                Terms of Service
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="outline" size="sm" data-testid="link-privacy-from-driver">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/legal">
              <Button size="sm" data-testid="link-legal-center-driver">
                Legal Center
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}