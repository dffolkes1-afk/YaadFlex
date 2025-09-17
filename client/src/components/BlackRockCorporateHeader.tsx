import { useState } from 'react';
import { COMPANY_INFO } from '@shared/company';
import { BlackRockLogo, BlackRockBadge } from './BlackRockLogo';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User, Globe } from 'lucide-react';
import { Link } from 'wouter';

interface BlackRockCorporateHeaderProps {
  variant?: "full" | "minimal" | "compliance";
  showNavigation?: boolean;
  showUserActions?: boolean;
  className?: string;
}

export function BlackRockCorporateHeader({ 
  variant = "full",
  showNavigation = true,
  showUserActions = true,
  className = ""
}: BlackRockCorporateHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (variant === "minimal") {
    return (
      <header className={`bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 ${className}`} data-testid="blackrock-header-minimal">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BlackRockLogo size="sm" variant="icon" />
              <div className="yf-header-logo">YaadFlex</div>
              <div className="hidden md:block">
                <BlackRockBadge size="sm" />
              </div>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {COMPANY_INFO.COMPANY_NAME}
            </span>
          </div>
        </div>
      </header>
    );
  }

  if (variant === "compliance") {
    return (
      <header className={`bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b-2 border-slate-300 dark:border-slate-600 ${className}`} data-testid="blackrock-header-compliance">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <BlackRockLogo size="md" variant="full" />
              <div className="hidden lg:flex items-center space-x-4">
                <div className="w-1 h-8 bg-slate-300 dark:bg-slate-600"></div>
                <div>
                  <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                    {COMPANY_INFO.COMPANY_NAME}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {COMPANY_INFO.PORTFOLIO_DESIGNATION}
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Indicators */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">FINRA/SIPC</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">NYSE: BLK</span>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Global
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Full variant (default)
  return (
    <header className={`bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm ${className}`} data-testid="blackrock-header-full">
      {/* Top Bar - Corporate Identity */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-medium">{COMPANY_INFO.PARENT_COMPANY}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">Investment Management & Financial Services</span>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-xs">
              <span className="text-slate-400">NYSE: BLK</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">FINRA/SIPC</span>
              <span className="text-slate-400">•</span>
              <a 
                href="https://www.blackrock.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
              >
                BlackRock.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <BlackRockLogo size="lg" variant="icon" />
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  {COMPANY_INFO.BRANDING.logo_text}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {COMPANY_INFO.CORPORATE_STRUCTURE.tagline}
                </p>
              </div>
            </Link>
            
            <div className="hidden lg:block">
              <BlackRockBadge size="md" />
            </div>
          </div>

          {/* Navigation Links */}
          {showNavigation && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/services" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors">
                Services
              </Link>
              <Link href="/business-dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors">
                Business
              </Link>
              <Link href="/ceo-dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors">
                Executive
              </Link>
              <Link href="/legal-center" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors">
                Legal
              </Link>
              <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors">
                Support
              </Link>
            </nav>
          )}

          {/* User Actions */}
          {showUserActions && (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
              
              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="w-4 h-4 flex flex-col justify-center space-y-1">
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isExpanded && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <nav className="flex flex-col space-y-3">
              <Link href="/services" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-2">
                Services
              </Link>
              <Link href="/business-dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-2">
                Business
              </Link>
              <Link href="/ceo-dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-2">
                Executive
              </Link>
              <Link href="/legal-center" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-2">
                Legal
              </Link>
              <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-2">
                Support
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}