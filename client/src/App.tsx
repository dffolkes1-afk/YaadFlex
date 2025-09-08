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

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/tracking" component={RealTimeTracking} />
          <Route path="/cb-radio" component={CBRadio} />
          <Route path="/secure-browser" component={SecureBrowser} />
          <Route path="/social-commerce" component={SocialCommerce} />
          <Route path="/rental-empire" component={RentalEmpire} />
          <Route path="/wallet" component={Wallet} />
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
