import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  CreditCard, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

interface VendorProfile {
  id: string;
  name: string;
  category: string;
  contactEmail: string;
  billingEmail?: string;
  supportEmail?: string;
  accountNumber?: string;
  customerNumber?: string;
  paymentTerms: string;
  preferredPaymentMethod: string;
  website?: string;
  phone?: string;
  address?: string;
  notes?: string;
  autoPayEnabled: boolean;
  isActive: boolean;
  createdAt: string;
}

const categoryIcons: Record<string, any> = {
  domain: Globe,
  email: Mail,
  hosting: Building2,
  insurance: AlertCircle,
  legal: Building2,
  default: Building2,
};

const paymentMethodColors = {
  card: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  bank_transfer: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  check: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  paypal: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
};

export default function VendorManagement() {
  const { toast } = useToast();

  // Fetch vendor profiles
  const { data: vendors = [], isLoading } = useQuery<VendorProfile[]>({
    queryKey: ['/api/vendor-profiles'],
    retry: false,
  });

  // Seed vendor profiles
  const seedVendors = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/payments/seed-vendors');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vendor-profiles'] });
      toast({
        title: 'Vendor Profiles Created',
        description: 'Default vendor profiles have been set up successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Seeding Failed',
        description: error.message || 'Failed to create vendor profiles',
        variant: 'destructive',
      });
    },
  });

  // Toggle auto-pay for vendor
  const toggleAutoPay = useMutation({
    mutationFn: async ({ vendorId, enabled }: { vendorId: string; enabled: boolean }) => {
      await apiRequest('PUT', `/api/vendor-profiles/${vendorId}`, {
        autoPayEnabled: enabled
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vendor-profiles'] });
      toast({
        title: 'Auto-Pay Updated',
        description: 'Vendor auto-payment setting has been updated.',
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="vendor-management-page">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
              Vendor Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2" data-testid="page-subtitle">
              Manage your business payment recipients and automatic payment settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            {vendors.length === 0 && (
              <Button 
                onClick={() => seedVendors.mutate()}
                disabled={seedVendors.isPending}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="seed-vendors-btn"
              >
                {seedVendors.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 mr-2" />
                    Setup Vendors
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading vendors...</span>
          </div>
        ) : vendors.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building2 className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Vendors Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
                Set up your vendor profiles to manage automatic payments for business expenses like insurance, Google services, and domain renewals.
              </p>
              <Button 
                onClick={() => seedVendors.mutate()}
                disabled={seedVendors.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {seedVendors.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 mr-2" />
                    Setup Default Vendors
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {vendors.map((vendor: VendorProfile) => {
              const IconComponent = categoryIcons[vendor.category] || categoryIcons.default;
              const paymentMethodColor = paymentMethodColors[vendor.preferredPaymentMethod as keyof typeof paymentMethodColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';

              return (
                <Card key={vendor.id} className="relative" data-testid={`vendor-card-${vendor.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{vendor.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {vendor.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {vendor.autoPayEnabled ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{vendor.contactEmail}</span>
                      </div>
                      {vendor.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{vendor.phone}</span>
                        </div>
                      )}
                      {vendor.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Globe className="w-4 h-4" />
                          <a 
                            href={vendor.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {vendor.website}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <Badge className={`text-xs ${paymentMethodColor}`}>
                          {vendor.preferredPaymentMethod.replace('_', ' ')}
                        </Badge>
                      </div>
                      {vendor.paymentTerms !== 'due_on_receipt' && (
                        <div className="text-xs text-gray-500">
                          Terms: {vendor.paymentTerms.replace('net', 'Net ')}
                        </div>
                      )}
                      {vendor.accountNumber && (
                        <div className="text-xs text-gray-500">
                          Account: {vendor.accountNumber}
                        </div>
                      )}
                    </div>

                    {/* Auto-Pay Toggle */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Auto-Pay</span>
                        {vendor.autoPayEnabled ? (
                          <Badge variant="default" className="bg-green-600">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={vendor.autoPayEnabled ? "destructive" : "default"}
                        onClick={() => toggleAutoPay.mutate({
                          vendorId: vendor.id,
                          enabled: !vendor.autoPayEnabled
                        })}
                        disabled={toggleAutoPay.isPending}
                        data-testid={`toggle-autopay-${vendor.id}`}
                      >
                        {vendor.autoPayEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>

                    {/* Notes */}
                    {vendor.notes && (
                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <strong>Notes:</strong> {vendor.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}