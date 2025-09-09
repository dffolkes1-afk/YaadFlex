import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  CheckCircle, 
  HelpCircle,
  Car,
  Globe,
  Lock,
  Users,
  AlertTriangle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    id: "driver-insurance",
    icon: Car,
    question: "Are YaadFlex drivers insured?",
    answer: "Yes. All our red plate taxi and PPV drivers carry their own motor vehicle insurance, as required by Jamaican law. This covers accidents, damages, and third-party liability while they are on the road.",
    category: "driver"
  },
  {
    id: "company-insurance", 
    icon: Shield,
    question: "Does YaadFlex itself have insurance?",
    answer: "Yes. YaadFlex carries business-level protection, including:",
    details: [
      "✅ General Liability – covers accidents, injuries, or damages involving the company.",
      "✅ Professional Liability (Errors & Omissions) – covers system errors, booking issues, or technology mistakes.", 
      "✅ Cyber Liability – covers data breaches and keeps your information safe."
    ],
    category: "business"
  },
  {
    id: "travel-insurance",
    icon: Globe,
    question: "Do I need travel insurance when booking trips or excursions?",
    answer: "Travel insurance is optional but recommended. YaadFlex offers customer travel insurance as an add-on when booking tours or trips. It covers medical emergencies, luggage, cancellations, and delays. The cost depends on trip length and destination, but averages about J$36,000 per 8-day trip.",
    category: "travel"
  },
  {
    id: "vehicle-responsibility",
    icon: AlertTriangle,
    question: "Who pays for vehicle insurance?",
    answer: "Drivers are responsible for their own PPV (red plate) vehicle insurance. This is not handled by YaadFlex.",
    category: "driver"
  },
  {
    id: "data-protection",
    icon: Lock,
    question: "Does YaadFlex insure my data?",
    answer: "Yes. Our cyber insurance ensures that if there's a data breach or attack, your personal and payment information is covered and protected.",
    category: "security"
  },
  {
    id: "why-matters",
    icon: Users,
    question: "Why does this matter?",
    answer: "Insurance is about trust and safety. By protecting our riders, drivers, and digital systems, YaadFlex ensures peace of mind every time you use the app.",
    category: "trust"
  }
];

const categoryColors = {
  driver: "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700",
  business: "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700", 
  travel: "bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700",
  security: "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700",
  trust: "bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700"
};

export default function InsuranceFAQ() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = selectedCategory 
    ? faqData.filter(faq => faq.category === selectedCategory)
    : faqData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Shield className="h-12 w-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Insurance & Safety FAQ
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Your safety and protection is our priority
          </p>
          <Badge variant="secondary" className="text-lg px-6 py-2 bg-green-100 text-green-800">
            ✅ Safe & Insured Platform
          </Badge>
        </div>

        {/* Insurance Badge/Seal */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border-2 border-green-200 dark:border-green-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <span className="text-lg font-semibold">Business Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-lg font-semibold">Data Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-8 w-8 text-purple-600" />
                <span className="text-lg font-semibold">Drivers Insured</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
              🇯🇲 Fully compliant with Jamaican insurance requirements
            </p>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            data-testid="filter-all"
          >
            All Questions
          </Button>
          <Button
            variant={selectedCategory === "driver" ? "default" : "outline"}
            onClick={() => setSelectedCategory("driver")}
            data-testid="filter-driver"
          >
            <Car className="h-4 w-4 mr-2" />
            Driver Insurance
          </Button>
          <Button
            variant={selectedCategory === "business" ? "default" : "outline"}
            onClick={() => setSelectedCategory("business")}
            data-testid="filter-business"
          >
            <Shield className="h-4 w-4 mr-2" />
            Business Protection
          </Button>
          <Button
            variant={selectedCategory === "travel" ? "default" : "outline"}
            onClick={() => setSelectedCategory("travel")}
            data-testid="filter-travel"
          >
            <Globe className="h-4 w-4 mr-2" />
            Travel Insurance
          </Button>
        </div>

        {/* FAQ Accordion */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => {
                const IconComponent = faq.icon;
                return (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className={`border rounded-lg mb-4 ${categoryColors[faq.category as keyof typeof categoryColors]}`}
                  >
                    <AccordionTrigger 
                      className="px-6 py-4 hover:no-underline"
                      data-testid={`faq-trigger-${faq.id}`}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <IconComponent className="h-6 w-6 flex-shrink-0" />
                        <span className="font-semibold">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {faq.answer}
                      </p>
                      {faq.details && (
                        <div className="space-y-2">
                          {faq.details.map((detail, index) => (
                            <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              {detail}
                            </p>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our customer support team is here to help you understand our insurance coverage and safety measures.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-contact-support"
              >
                📞 Contact Support
              </Button>
              <Button 
                variant="outline"
                data-testid="button-view-policies"
              >
                📄 View Full Policies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}