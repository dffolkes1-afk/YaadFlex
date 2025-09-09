import { Shield, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InsuranceBadgeProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function InsuranceBadge({ className = "", variant = 'full' }: InsuranceBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 border-2 border-green-500 rounded-xl p-4 text-center shadow-lg ${className}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-green-600" />
          <span className="text-lg font-bold text-green-600">YaadFlex is Insured</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Your safety and trust are our priority.
        </p>
      </div>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border-2 border-green-500 shadow-lg ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-500 rounded-full p-3">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
          YaadFlex is Insured
        </h3>
        
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>General Liability</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Professional Liability</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Cyber Protection</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Travel Insurance Options</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-4 border-t pt-3">
          🇯🇲 Your safety and trust are our priority.
        </p>
      </CardContent>
    </Card>
  );
}