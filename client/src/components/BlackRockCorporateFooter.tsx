import { COMPANY_INFO, CORPORATE_TEMPLATES } from '@shared/company';
import { Link } from 'wouter';

interface BlackRockCorporateFooterProps {
  className?: string;
  variant?: "full" | "minimal" | "legal";
}

export function BlackRockCorporateFooter({ 
  className = "", 
  variant = "full" 
}: BlackRockCorporateFooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === "minimal") {
    return (
      <footer className={`bg-slate-900 text-slate-300 py-4 border-t border-slate-700 ${className}`} data-testid="blackrock-footer-minimal">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            {CORPORATE_TEMPLATES.footer_text}
          </p>
        </div>
      </footer>
    );
  }

  if (variant === "legal") {
    return (
      <footer className={`bg-slate-950 text-slate-400 py-8 border-t border-slate-800 ${className}`} data-testid="blackrock-footer-legal">
        <div className="container mx-auto px-6 space-y-6">
          {/* BlackRock Corporate Disclosure */}
          <div className="border border-slate-800 bg-slate-900/50 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BR</span>
              </div>
              <h4 className="text-white font-semibold text-lg">BlackRock Corporate Disclosure</h4>
            </div>
            
            <p className="text-sm leading-relaxed mb-4">
              <strong>{COMPANY_INFO.COMPANY_NAME}</strong> is a {COMPANY_INFO.PORTFOLIO_DESIGNATION} under the management 
              and oversight of <strong>{COMPANY_INFO.PARENT_COMPANY}</strong> (NYSE: BLK). All operations are conducted 
              in accordance with BlackRock's global standards for risk management, compliance, and fiduciary responsibility.
            </p>
            
            <p className="text-xs text-slate-500">
              Investment advisory services provided by BlackRock Financial Management, Inc., member FINRA/SIPC. 
              <span className="text-slate-400 ml-2">
                Legal Entity: {COMPANY_INFO.LEGAL_NAME} | Registration: {COMPANY_INFO.HEADQUARTERS.registration}
              </span>
            </p>
          </div>

          {/* Corporate Contact & Legal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Corporate Contact</h4>
              <div className="space-y-2 text-sm">
                <p>{COMPANY_INFO.HEADQUARTERS.legal_address}</p>
                <p>Executive: <a href={`mailto:${COMPANY_INFO.CONTACT.corporate_email}`} className="text-blue-400 hover:text-blue-300">{COMPANY_INFO.CONTACT.corporate_email}</a></p>
                <p>Legal: <a href={`mailto:${COMPANY_INFO.CONTACT.blackrock_legal}`} className="text-blue-400 hover:text-blue-300">{COMPANY_INFO.CONTACT.blackrock_legal}</a></p>
                <p>Compliance: <a href={`mailto:${COMPANY_INFO.CONTACT.blackrock_compliance}`} className="text-blue-400 hover:text-blue-300">{COMPANY_INFO.CONTACT.blackrock_compliance}</a></p>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Legal & Compliance</h4>
              <div className="space-y-2 text-sm">
                <p><Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link></p>
                <p><Link href="/terms-of-service" className="text-blue-400 hover:text-blue-300">Terms of Service</Link></p>
                <p><Link href="/legal-center" className="text-blue-400 hover:text-blue-300">Legal Center</Link></p>
                <p className="text-slate-500">Regulatory Compliance: {COMPANY_INFO.LEGAL.regulatory_compliance}</p>
              </div>
            </div>
          </div>

          {/* Copyright & Attribution */}
          <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            <p>{CORPORATE_TEMPLATES.footer_text}</p>
            <p className="mt-2">
              BlackRock and the BlackRock logo are registered trademarks of BlackRock, Inc. 
              Used under license for portfolio companies.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Full variant (default)
  return (
    <footer className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 ${className}`} data-testid="blackrock-footer-full">
      {/* Main Footer Content */}
      <div className="border-t border-slate-700">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{COMPANY_INFO.BRANDING.flag_emoji}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{COMPANY_INFO.BRANDING.logo_text}</h3>
                  <p className="text-xs text-slate-400">{COMPANY_INFO.PORTFOLIO_DESIGNATION}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {COMPANY_INFO.DESCRIPTION.short}
              </p>
              <p className="text-xs text-slate-500">
                Managed by {COMPANY_INFO.PARENT_COMPANY}
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ride-booking" className="text-slate-400 hover:text-white transition-colors">Ride Sharing</Link></li>
                <li><Link href="/wallet" className="text-slate-400 hover:text-white transition-colors">Digital Wallet</Link></li>
                <li><Link href="/services" className="text-slate-400 hover:text-white transition-colors">Service Marketplace</Link></li>
                <li><Link href="/business-registration" className="text-slate-400 hover:text-white transition-colors">Business Solutions</Link></li>
                <li><Link href="/real-estate" className="text-slate-400 hover:text-white transition-colors">Real Estate</Link></li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support & Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link href="/legal-center" className="text-slate-400 hover:text-white transition-colors">Legal Center</Link></li>
                <li><Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/insurance-faq" className="text-slate-400 hover:text-white transition-colors">Safety & Insurance</Link></li>
              </ul>
            </div>

            {/* Corporate Information */}
            <div>
              <h4 className="text-white font-semibold mb-4">Corporate</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 font-medium">Headquarters</p>
                  <p className="text-slate-500 text-xs">{COMPANY_INFO.HEADQUARTERS.legal_address}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Operations</p>
                  <p className="text-slate-500 text-xs">{COMPANY_INFO.HEADQUARTERS.operational_address}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Contact</p>
                  <p className="text-slate-500 text-xs">
                    <a href={`mailto:${COMPANY_INFO.CONTACT.public_support}`} className="hover:text-slate-400">
                      {COMPANY_INFO.CONTACT.public_support}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BlackRock Corporate Badge */}
        <div className="border-t border-slate-700 bg-slate-900/50">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              
              {/* BlackRock Corporate Identity */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BR</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{COMPANY_INFO.PORTFOLIO_DESIGNATION}</p>
                  <p className="text-slate-400 text-xs">Investment Management & Financial Services</p>
                </div>
              </div>

              {/* Corporate Links */}
              <div className="flex items-center space-x-6 text-xs">
                <a 
                  href="https://www.blackrock.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  BlackRock.com
                </a>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500">NYSE: BLK</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500">FINRA/SIPC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Legal Notice */}
        <div className="bg-slate-950 border-t border-slate-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-2 md:space-y-0">
              <p>{CORPORATE_TEMPLATES.footer_text}</p>
              <p>Regulated by BlackRock Global Standards | Entity: {COMPANY_INFO.LEGAL_NAME}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}