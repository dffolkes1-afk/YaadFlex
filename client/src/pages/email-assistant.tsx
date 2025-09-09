import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Mail, 
  Send, 
  MessageSquare, 
  Phone,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";

const emailTemplates = [
  {
    id: "driver-registration",
    name: "Driver Registration Help",
    subject: "YaadFlex Driver Registration Assistance",
    template: "Hi YaadFlex Support,\n\nI need help with driver registration. Please assist with:\n\n[Describe your issue here]\n\nDriver Name: [Your Name]\nPhone Number: [Your Phone]\n\nThank you!"
  },
  {
    id: "customer-support",
    name: "General Customer Support",
    subject: "YaadFlex Customer Support Request",
    template: "Hi YaadFlex Support,\n\nI need assistance with:\n\n[Describe your issue here]\n\nCustomer Name: [Your Name]\nPhone Number: [Your Phone]\nAccount Email: [Your Email]\n\nThank you!"
  },
  {
    id: "insurance-question",
    name: "Insurance Questions",
    subject: "YaadFlex Insurance Coverage Question",
    template: "Hi YaadFlex Support,\n\nI have questions about insurance coverage:\n\n[Your insurance question here]\n\nSpecifically about:\n- General Liability\n- Professional Liability\n- Cyber Protection\n- Travel Insurance\n\nThank you!"
  },
  {
    id: "travel-agent",
    name: "Travel Agent Partnership",
    subject: "YaadFlex Travel Agent Network Application",
    template: "Hi YaadFlex Travel Team,\n\nI'm interested in joining the YaadFlex Travel Agent Network:\n\n[Tell us about your travel experience]\n\nExperience:\nSpecializations:\nCertifications:\nContact Information:\n\nI understand the 85/15 commission structure and would like to get started.\n\nThank you!"
  }
];

interface EmailData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
}

export default function EmailAssistant() {
  const [formData, setFormData] = useState<EmailData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const { toast } = useToast();

  const sendEmailMutation = useMutation({
    mutationFn: async (data: EmailData) => {
      return apiRequest("POST", "/api/send-support-email", data);
    },
    onSuccess: () => {
      toast({
        title: "Email Sent Successfully! ✅",
        description: "We'll get back to you within 24 hours.",
      });
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        category: "general"
      });
      setSelectedTemplate(null);
    },
    onError: (error: any) => {
      toast({
        title: "Email Failed to Send",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        subject: template.subject,
        message: template.template,
        category: templateId
      });
      setSelectedTemplate(templateId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    sendEmailMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Mail className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              YaadFlex Email Assistant
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Send us a message directly from the app
          </p>
          <Badge variant="secondary" className="text-lg px-6 py-2 bg-blue-100 text-blue-800">
            📧 24/7 Support Available
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Email Templates */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Quick Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emailTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    className="w-full text-left justify-start"
                    onClick={() => handleTemplateSelect(template.id)}
                    data-testid={`template-${template.id}`}
                  >
                    {template.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Direct Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-semibold">Email:</p>
                  <p className="text-blue-600">support@yaadflexglobalvybz.com</p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold">Response Time:</p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Within 24 hours
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold">Support Hours:</p>
                  <p>24/7 via email</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Email to YaadFlex Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Your Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Dwayne Christopher"
                        required
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Your Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Phone Number (Optional)
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 876 xxx-xxxx"
                      data-testid="input-phone"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Subject *
                    </label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="What do you need help with?"
                      required
                      data-testid="input-subject"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Your Message *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Describe your question or issue in detail..."
                      rows={6}
                      required
                      data-testid="input-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={sendEmailMutation.isPending}
                    data-testid="button-send-email"
                  >
                    {sendEmailMutation.isPending ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Sending Email...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send to YaadFlex Support
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-green-600">500+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Support Tickets Resolved</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-blue-600">&lt; 24hr</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Response Time</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-purple-600">98%</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}