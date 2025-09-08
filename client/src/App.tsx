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
import { TranslatorDemoPage } from "@/pages/translator-demo";
import { TimelessDashboardPage } from "@/pages/timeless-dashboard";
import WorldEmblemPage from "@/pages/world-emblem";
import WorkforceDashboard from "@/pages/WorkforceDashboard";
import JobPosting from "@/pages/JobPosting";
import DuoWonTheWorld3D from "@/components/DuoWonTheWorld3D";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes - accessible to everyone */}
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
      
      {/* Authentication-based routes */}
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
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
        </>
      )}
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
