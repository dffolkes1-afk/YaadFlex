import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
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
import CEODashboard from "@/pages/ceo-dashboard";
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

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes - accessible to everyone */}
      <Route path="/portal" component={GalacticPortalPage} />
      <Route path="/real-estate" component={RealEstatePage} />
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
      <Route path="/social" component={SocialHub} />
      <Route path="/social-hub" component={SocialHub} />
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
      <Route path="/ceo-dashboard" component={CEODashboard} />
      
      {/* Authentication-based routes */}
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={ModernLanding} />
          <Route path="/old-landing" component={ProfessionalLanding} />
          <Route path="/original-landing" component={Landing} />
        </>
      ) : (
        <>
          <Route path="/" component={ModernLanding} />
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
          <Route path="/ceo-dashboard" component={CEODashboard} />
          <Route path="/vendor-management" component={VendorManagement} />
          <Route path="/secure-login" component={TimeAuthLogin} />
          <Route path="/rbac-dashboard" component={RBACDashboard} />
          <Route path="/delivery-dashboard" component={DeliveryPersonnelDashboard} />
          <Route path="/book-delivery" component={DeliveryBooking} />
          <Route path="/track-delivery" component={LiveDeliveryTracking} />
          <Route path="/demo" component={DemoShowcase} />
        </>
      )}
      <Route path="/secure-login" component={TimeAuthLogin} />
      <Route path="/demo" component={DemoShowcase} />
      <Route path="/social-signup" component={SocialSignup} />
      <Route path="/social-feed" component={SocialFeed} />
      <Route path="/global-jobs" component={GlobalJobs} />
      <Route path="/jobs" component={GlobalJobs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
