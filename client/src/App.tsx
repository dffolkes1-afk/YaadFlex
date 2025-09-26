import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { RipleyControls } from "@/components/RipleyControls";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import RealTimeTracking from "@/pages/tracking";
import CBRadio from "@/pages/cb-radio";
import SecureBrowser from "@/pages/secure-browser";
import SocialCommerce from "@/pages/social-commerce";
import RentalEmpire from "@/pages/rental-empire";
import Wallet from "@/pages/wallet";
import RideBooking from "@/pages/ride-booking";
import BusinessRegistration from "@/pages/business-registration";
import DriverRegistration from "@/pages/driver-registration";
import SponsorshipPage from "@/pages/sponsorship";
import RealEstatePage from "@/pages/real-estate";
import CarMarketplacePage from "@/pages/car-marketplace";
import PremiumStorefrontPage from "@/pages/premium-storefront";
import MarketplacePage from "@/pages/marketplace";
import DashboardPage from "@/pages/dashboard";
import YFBrandingPage from "@/pages/yf-branding";
import SimpleLinksPage from "@/pages/simple-links";
import ContactlessSystemPage from "@/pages/contactless-system";
import CBRadioPage from "@/pages/cb-radio";
import YaadFlexBankingPage from "@/pages/yaadflex-banking";
import GalacticPortalPage from "@/pages/galactic-portal";
import ProfessionalLanding from "@/pages/professional-landing";
import ModernLanding from "@/pages/modern-landing";
import UniversalRemote from "@/pages/universal-remote";
import ContactForm from "@/pages/contact-form";
import SocialHub from "./pages/SocialHub";
import { TranslatorDemoPage } from "@/pages/translator-demo";
import { TimelessDashboardPage } from "@/pages/timeless-dashboard";
import WorldEmblemPage from "@/pages/world-emblem";
import WorkforceDashboard from "@/pages/WorkforceDashboard";
import JobPosting from "@/pages/JobPosting";
import DuoWonTheWorld3D from "@/components/DuoWonTheWorld3D";
import PricingCalculator from "@/pages/pricing-calculator";
import CustomerBooking from "@/pages/customer-booking";
import BusinessDashboard from "@/pages/business-dashboard";
import TradingDashboard from "@/pages/trading-dashboard";
import TravelBooking from "@/pages/travel-booking";
import ServiceMarketplace from "@/pages/service-marketplace";
import InsuranceFAQ from "@/pages/insurance-faq";
import EmailAssistant from "@/pages/email-assistant";
import CeoDashboard from "@/pages/ceo-dashboard";
import AdminSecurityPage from "@/pages/admin-security";
import VendorManagement from "@/pages/vendor-management";
import TimeAuthLogin from "@/pages/time-auth-login";
import RBACDashboard from "@/pages/rbac-dashboard";
import DeliveryPersonnelDashboard from "@/pages/delivery-personnel-dashboard";
import DeliveryBooking from "@/pages/delivery-booking";
import LiveDeliveryTracking from "@/pages/live-delivery-tracking";
import DemoShowcase from "@/pages/demo-showcase";
import SocialSignup from "@/pages/SocialSignup";
import SocialFeed from "@/pages/SocialFeed";
import GlobalJobs from "@/pages/GlobalJobs";
import YaadWallet from "@/pages/YaadWallet";
import CompanyDashboard from "@/pages/CompanyDashboard";
import LogisticsBrokers from "@/pages/LogisticsBrokers";
import HeritageDelivery from "@/pages/HeritageDelivery";
import FounderProfile from "@/pages/FounderProfile";
import UniversalPaymentPage from "@/pages/UniversalPaymentPage";
import VoiceControlCenter from "@/pages/VoiceControlCenter";
import VoiceDemo from "@/pages/VoiceDemo";
import VoiceWorkspace from "@/pages/VoiceWorkspace";
import ErrorDashboard from "@/pages/ErrorDashboard";
import UploadTest from "@/pages/UploadTest";
import SimpleUpload from "@/pages/SimpleUpload";
import TinyUpload from "@/pages/TinyUpload";
import WorldVybz from "@/pages/WorldVybz";
import MediaHub from "@/pages/MediaHub";
import RipleyTest from "@/pages/ripley-test";
import DrivingCoach from "@/pages/DrivingCoach";
import SuperAppWrapper from "@/pages/SuperAppWrapper";
import ServiceWrapper from "@/pages/ServiceWrapper";
import FleetOwnerDashboard from "@/pages/FleetOwnerDashboard";
import ShareApp from "@/pages/ShareApp";
import MagicDrop from "@/pages/MagicDrop";
import SurpriseLanding from "@/pages/SurpriseLanding";
import ContactMagic from "@/pages/ContactMagic";
import WorldTakeover from "@/pages/WorldTakeover";
import YaadParty from "@/pages/YaadParty";
import GlamourShowcase from "@/pages/glamour-showcase";
import YaadFlexGothicConcept from "@/pages/YaadFlexGothicConcept";
import VoiceControl from "@/components/VoiceControl";
import LiveStatusIndicator from "@/components/LiveStatusIndicator";
import DashboardButton from "@/components/DashboardButton";
import { BlackRockCorporateHeader } from "@/components/BlackRockCorporateHeader";
import { BlackRockCorporateFooter } from "@/components/BlackRockCorporateFooter";
import { PageModeWrapper } from "@/components/PageModeWrapper";

// Legal Pages
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import UserAgreement from "@/pages/user-agreement";
import DriverAgreement from "@/pages/driver-agreement";
import BusinessPartnerAgreement from "@/pages/business-partner-agreement";
import LegalCenter from "@/pages/legal-center";

// Corporate Pages
import CorporateCompliancePage from "@/pages/corporate-compliance";

function Router() {
  // SECURITY RESTORED: Use proper authentication
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;

  return (
    <Switch>
      {/* Corporate Pages - accessible to everyone */}
      <Route path="/corporate" component={CorporateCompliancePage} />
      <Route path="/corporate-compliance" component={CorporateCompliancePage} />
      <Route path="/compliance" component={CorporateCompliancePage} />
      <Route path="/blackrock" component={CorporateCompliancePage} />
      
      {/* Legal Pages - accessible to everyone */}
      <Route path="/terms" component={TermsOfService} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/user-agreement" component={UserAgreement} />
      <Route path="/driver-agreement" component={DriverAgreement} />
      <Route path="/business-agreement" component={BusinessPartnerAgreement} />
      <Route path="/business-partner-agreement" component={BusinessPartnerAgreement} />
      <Route path="/legal" component={LegalCenter} />
      <Route path="/legal-center" component={LegalCenter} />
      
      {/* Public routes - accessible to everyone */}
      <Route path="/ripley" component={RipleyTest} />
      <Route path="/ripley-test" component={RipleyTest} />
      <Route path="/voice-test" component={RipleyTest} />
      <Route path="/portal" component={GalacticPortalPage} />
      <Route path="/real-estate" component={RealEstatePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/yf-branding" component={YFBrandingPage} />
      <Route path="/branding" component={YFBrandingPage} />
      <Route path="/wallpapers" component={YFBrandingPage} />
      <Route path="/marketplace" component={MarketplacePage} />
      <Route path="/buy" component={MarketplacePage} />
      <Route path="/sell" component={MarketplacePage} />
      <Route path="/car-marketplace" component={CarMarketplacePage} />
      <Route path="/premium-storefront" component={PremiumStorefrontPage} />
      <Route path="/links" component={SimpleLinksPage} />
      <Route path="/contactless" component={ContactlessSystemPage} />
      <Route path="/cb-radio" component={CBRadioPage} />
      <Route path="/banking" component={YaadFlexBankingPage} />
      <Route path="/ride-booking" component={RideBooking} />
      <Route path="/business-registration" component={BusinessRegistration} />
      <Route path="/driver-registration" component={DriverRegistration} />
      <Route path="/sponsorship" component={SponsorshipPage} />
      <Route path="/emblem" component={WorldEmblemPage} />
      <Route path="/contact" component={ContactForm} />
      <Route path="/signup" component={ContactForm} />
      <Route path="/social" component={SocialFeed} />
      <Route path="/social-feed" component={SocialFeed} />
      <Route path="/social-hub" component={SocialHub} />
      <Route path="/world-vybz" component={WorldVybz} />
      <Route path="/global-content" component={WorldVybz} />
      <Route path="/world-content" component={WorldVybz} />
      <Route path="/media-hub" component={MediaHub} />
      <Route path="/media" component={MediaHub} />
      <Route path="/live-tv" component={MediaHub} />
      <Route path="/heritage-delivery" component={HeritageDelivery} />
      <Route path="/delivery-riders" component={HeritageDelivery} />
      <Route path="/universal-payment" component={UniversalPaymentPage} />
      <Route path="/link-payment" component={UniversalPaymentPage} />
      <Route path="/voice-control" component={VoiceControlCenter} />
      <Route path="/voice-interactive" component={VoiceControlCenter} />
      <Route path="/voice-demo" component={VoiceDemo} />
      <Route path="/voice-workspace" component={VoiceWorkspace} />
      <Route path="/workspace" component={VoiceWorkspace} />
      <Route path="/voice-studio" component={VoiceWorkspace} />
      <Route path="/tts" component={VoiceWorkspace} />
      <Route path="/speech" component={VoiceWorkspace} />
      <Route path="/driving-coach" component={DrivingCoach} />
      <Route path="/learn-driving" component={DrivingCoach} />
      <Route path="/driving-lessons" component={DrivingCoach} />
      <Route path="/super-app" component={SuperAppWrapper} />
      <Route path="/apps" component={SuperAppWrapper} />
      <Route path="/wrapper/:service" component={ServiceWrapper} />
      <Route path="/error-dashboard" component={ErrorDashboard} />
      <Route path="/upload-test" component={UploadTest} />
      <Route path="/simple-upload" component={SimpleUpload} />
      <Route path="/tiny-upload" component={TinyUpload} />
      <Route path="/diagnostics" component={ErrorDashboard} />
      <Route path="/pricing" component={PricingCalculator} />
      <Route path="/book-ride" component={CustomerBooking} />
      <Route path="/travel-booking" component={TravelBooking} />
      <Route path="/services" component={ServiceMarketplace} />
      <Route path="/service-marketplace" component={ServiceMarketplace} />
      <Route path="/insurance" component={InsuranceFAQ} />
      <Route path="/insurance-faq" component={InsuranceFAQ} />
      <Route path="/safety" component={InsuranceFAQ} />
      <Route path="/email-assistant" component={EmailAssistant} />
      <Route path="/support" component={EmailAssistant} />
      <Route path="/contact" component={EmailAssistant} />
      <Route path="/universal-remote" component={UniversalRemote} />
      <Route path="/ceo-dashboard" component={CeoDashboard} />
      <Route path="/company-dashboard" component={CompanyDashboard} />
      <Route path="/taxi-company" component={CompanyDashboard} />
      <Route path="/business-control" component={CompanyDashboard} />
      <Route path="/logistics-brokers" component={LogisticsBrokers} />
      <Route path="/port-clearing" component={LogisticsBrokers} />
      <Route path="/barrel-service" component={LogisticsBrokers} />
      <Route path="/brokers" component={LogisticsBrokers} />
      <Route path="/fleet-owner" component={FleetOwnerDashboard} />
      <Route path="/car-owner" component={FleetOwnerDashboard} />
      <Route path="/vehicle-owner" component={FleetOwnerDashboard} />
      <Route path="/share" component={ShareApp} />
      <Route path="/share-app" component={ShareApp} />
      <Route path="/send-link" component={ShareApp} />
      <Route path="/magic" component={MagicDrop} />
      <Route path="/magic-drop" component={MagicDrop} />
      <Route path="/surprise/:code" component={SurpriseLanding} />
      <Route path="/contacts" component={ContactMagic} />
      <Route path="/contact-magic" component={ContactMagic} />
      <Route path="/contact-share" component={ContactMagic} />
      <Route path="/world" component={WorldTakeover} />
      <Route path="/world-takeover" component={WorldTakeover} />
      <Route path="/global" component={WorldTakeover} />
      <Route path="/party" component={YaadParty} />
      <Route path="/fun" component={YaadParty} />
      <Route path="/yaad-party" component={YaadParty} />
      
      {/* Glamour Showcase - Design System Demo */}
      <Route path="/glamour" component={GlamourShowcase} />
      <Route path="/glamour-showcase" component={GlamourShowcase} />
      <Route path="/design-system" component={GlamourShowcase} />
      <Route path="/luxury-demo" component={GlamourShowcase} />
      
      {/* YaadFlex Gothic Concept Document */}
      <Route path="/yaadflex-gothic" component={YaadFlexGothicConcept} />
      <Route path="/blackrock-gothic" component={YaadFlexGothicConcept} />
      <Route path="/gothic-concept" component={YaadFlexGothicConcept} />
      <Route path="/concept-doc" component={YaadFlexGothicConcept} />
      
      {/* Hidden Founder Profile - Private */}
      <Route path="/founder-vision-2024" component={FounderProfile} />
      
      {/* ALL ROUTES NOW UNLOCKED - NO AUTHENTICATION BLOCKS */}
      <Route path="/" component={Home} />
      <Route path="/modern-landing" component={ModernLanding} />
      <Route path="/old-landing" component={ProfessionalLanding} />
      <Route path="/original-landing" component={Landing} />
      <Route path="/home" component={Home} />
      <Route path="/tracking" component={RealTimeTracking} />
      <Route path="/cb-radio" component={CBRadio} />
      <Route path="/secure-browser" component={SecureBrowser} />
      <Route path="/social-commerce" component={SocialCommerce} />
      <Route path="/rental-empire" component={RentalEmpire} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/translator" component={TranslatorDemoPage} />
      <Route path="/timeless-core" component={TimelessDashboardPage} />
      <Route path="/workforce" component={WorkforceDashboard} />
      <Route path="/post-job" component={JobPosting} />
      <Route path="/duo-world" component={DuoWonTheWorld3D} />
      <Route path="/business-dashboard" component={BusinessDashboard} />
      <Route path="/trading-dashboard" component={TradingDashboard} />
      <Route path="/ceo-dashboard" component={CeoDashboard} />
      <Route path="/admin-security" component={AdminSecurityPage} />
      <Route path="/vendor-management" component={VendorManagement} />
      <Route path="/secure-login" component={TimeAuthLogin} />
      <Route path="/rbac-dashboard" component={RBACDashboard} />
      <Route path="/delivery-dashboard" component={DeliveryPersonnelDashboard} />
      <Route path="/book-delivery" component={DeliveryBooking} />
      <Route path="/track-delivery" component={LiveDeliveryTracking} />
      <Route path="/demo" component={DemoShowcase} />
      <Route path="/secure-login" component={TimeAuthLogin} />
      <Route path="/demo" component={DemoShowcase} />
      <Route path="/social-signup" component={SocialSignup} />
      <Route path="/social-feed" component={SocialFeed} />
      <Route path="/global-jobs" component={GlobalJobs} />
      <Route path="/jobs" component={GlobalJobs} />
      <Route path="/wallet" component={YaadWallet} />
      <Route path="/bank" component={YaadWallet} />
      <Route path="/money" component={YaadWallet} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <BlackRockCorporateHeader />
          <main className="flex-1">
            <Toaster />
            <LiveStatusIndicator />
            <DashboardButton />
            <PageModeWrapper showModeIndicator={import.meta.env.DEV}>
              <Router />
            </PageModeWrapper>
            <RipleyControls />
            <VoiceControl />
          </main>
          <BlackRockCorporateFooter />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
