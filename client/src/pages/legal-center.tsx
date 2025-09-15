import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO, CORPORATE_TEMPLATES } from '@shared/company';
import { 
  Scale, 
  Shield, 
  Users, 
  Car, 
  Building2,
  FileText,
  Globe,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { Link } from 'wouter';

export default function LegalCenter() {
  const lastUpdated = "September 15, 2025";

  const legalDocuments = [
    {
      id: 'terms',
      title: 'Terms of Service',
      description: `Complete terms and conditions for using ${COMPANY_INFO.COMPANY_NAME} platform services`,
      icon: <Scale className="h-6 w-6" />,
      path: '/terms',
      audience: 'All Users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      updated: lastUpdated
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: `How ${COMPANY_INFO.PARENT_COMPANY} collects, uses, and protects your personal information`,
      icon: <Shield className="h-6 w-6" />,
      path: '/privacy',
      audience: 'All Users',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      updated: lastUpdated
    },
    {
      id: 'user-agreement',
      title: 'User Agreement',
      description: 'Terms for riders, customers, and general platform users',
      icon: <Users className="h-6 w-6" />,
      path: '/user-agreement',
      audience: 'Platform Users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      updated: lastUpdated
    },
    {
      id: 'driver-agreement',
      title: 'Driver Agreement',
      description: 'Independent contractor terms and 85% earnings structure',
      icon: <Car className="h-6 w-6" />,
      path: '/driver-agreement',
      audience: 'Drivers',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      updated: lastUpdated
    },
    {
      id: 'business-agreement',
      title: 'Business Partner Agreement',
      description: 'Commercial partnership terms for registered businesses',
      icon: <Building2 className="h-6 w-6" />,
      path: '/business-partner-agreement',
      audience: 'Business Partners',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      updated: lastUpdated
    }
  ];

  const contactInfo = [
    {
      type: 'Legal Department',
      email: COMPANY_INFO.CONTACT.legal_email,
      description: 'General legal inquiries and contract questions'
    },
    {
      type: 'Privacy Officer',
      email: COMPANY_INFO.CONTACT.support_email,
      description: 'Data protection and privacy concerns'
    },
    {
      type: 'Business Compliance',
      email: COMPANY_INFO.CONTACT.blackrock_compliance,
      description: 'Regulatory compliance and business matters'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
              <Scale className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Legal Center</h1>
              <p className="text-lg text-muted-foreground">BlackRock YaadFlex Legal Documents</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            <Badge variant="secondary" className="text-blue-600">
              <Building2 className="h-3 w-3 mr-1" />
              BlackRock, Inc.
            </Badge>
            <Badge variant="secondary" className="text-green-600">
              <Globe className="h-3 w-3 mr-1" />
              Delaware Corporation
            </Badge>
            <Badge variant="secondary" className="text-purple-600">
              <FileText className="h-3 w-3 mr-1" />
              5 Legal Documents
            </Badge>
            <Badge variant="secondary" className="text-orange-600">
              <Calendar className="h-3 w-3 mr-1" />
              Updated: {lastUpdated}
            </Badge>
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access all legal documents and agreements for YaadFlex platform services. 
            BlackRock maintains transparent, comprehensive legal frameworks for all users and partners.
          </p>
        </div>

        {/* Corporate Information */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Building2 className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  BlackRock Corporate Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800 dark:text-blue-200 text-sm">
                  <div>
                    <p><strong>Corporate Name:</strong> BlackRock, Inc.</p>
                    <p><strong>Incorporation:</strong> Delaware, United States</p>
                    <p><strong>SEC File Number:</strong> 001-15305</p>
                  </div>
                  <div>
                    <p><strong>Address:</strong> 50 Hudson Yards, New York, NY 10001</p>
                    <p><strong>Platform:</strong> YaadFlex - Multi-Service Marketplace</p>
                    <p><strong>Operations:</strong> Jamaica and Caribbean Region</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {legalDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className={`p-3 rounded-full ${doc.bgColor} w-fit mb-3`}>
                  <div className={doc.color}>
                    {doc.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{doc.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {doc.audience}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {doc.updated}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {doc.description}
                </p>
                <Link href={doc.path}>
                  <Button 
                    className="w-full" 
                    size="sm" 
                    data-testid={`button-legal-${doc.id}`}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Legal Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Legal Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactInfo.map((contact, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-1">{contact.type}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{contact.description}</p>
                  <Button variant="outline" size="sm" data-testid={`button-contact-${index}`}>
                    <Mail className="h-3 w-3 mr-2" />
                    {contact.email}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" data-testid="button-request-legal-help">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Legal Assistance
                </Button>
                
                <Button variant="outline" className="w-full justify-start" data-testid="button-report-legal-issue">
                  <Shield className="h-4 w-4 mr-2" />
                  Report Legal Issue
                </Button>
                
                <Button variant="outline" className="w-full justify-start" data-testid="button-business-inquiries">
                  <Building2 className="h-4 w-4 mr-2" />
                  Business Inquiries
                </Button>
                
                <Button variant="outline" className="w-full justify-start" data-testid="button-privacy-rights">
                  <Users className="h-4 w-4 mr-2" />
                  Exercise Privacy Rights
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  Need immediate assistance?
                </p>
                <div className="flex gap-2">
                  <Button size="sm" data-testid="button-contact-support">
                    <Phone className="h-3 w-3 mr-2" />
                    Call Support
                  </Button>
                  <Link href="/contact">
                    <Button variant="outline" size="sm" data-testid="button-contact-form">
                      Contact Form
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regulatory Compliance Notice */}
        <Card className="mt-8 border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Regulatory Compliance
                </h3>
                <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                  BlackRock maintains compliance with all applicable regulations including GDPR (EU), 
                  CCPA (California), Jamaica Data Protection Act, Delaware corporate law, and US federal regulations. 
                  All legal documents are reviewed by qualified legal counsel and updated regularly to reflect current law.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            BlackRock, Inc. | 50 Hudson Yards, New York, NY 10001 | SEC File Number: 001-15305
          </p>
          <p className="mt-2">
            All legal documents effective {lastUpdated} | For questions: legal@yaadflex.com
          </p>
        </div>
      </div>
    </div>
  );
}