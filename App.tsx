import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./hooks/use-cart";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import VendorDashboard from "@/pages/vendor-dashboard";
import VendorAppBuilder from "@/pages/vendor-app-builder";
import AdminDashboard from "@/pages/admin-dashboard";
import Storefront from "@/pages/storefront";
import LandingPage from "@/pages/landing-page";
import VendorTutorial from "@/pages/vendor-tutorial";
import ContactPage from "@/pages/contact-page";
import AboutPage from "@/pages/about-page";
import HelpPage from "@/pages/help-page";
import ProfilePage from "@/pages/profile-page";
import SettingsPage from "@/pages/settings-page";
import FeaturesPage from "@/pages/features-page";
import PricingPage from "@/pages/pricing-page";
import CheckoutPage from "@/pages/checkout-page";
import CustomerOrders from "@/pages/customer-orders";
import ProductView from "@/pages/product-view";
import CustomerDashboard from "@/pages/customer-dashboard";
import OrderDetail from "@/pages/order-detail";
import VendorsPage from "@/pages/vendors-page";

function Router() {
  // Check if we're in storefront mode (subdomain/custom domain)
  const isStorefront = typeof window !== 'undefined' && window.IS_STOREFRONT;
  
  if (isStorefront) {
    // If in storefront mode, only show the storefront component
    return <Storefront />;
  }
  
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/vendor-tutorial" component={VendorTutorial} />
      <Route path="/storefront/:storeSlug" component={Storefront} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/help" component={HelpPage} />
      <Route path="/setup-guide" component={HelpPage} />
      <Route path="/tutorials" component={HelpPage} />
      <Route path="/integrations" component={AboutPage} />
      <Route path="/api-docs" component={HelpPage} />
      <Route path="/blog" component={AboutPage} />
      <Route path="/careers" component={AboutPage} />
      <Route path="/partners" component={AboutPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/orders" component={CustomerOrders} />
      <Route path="/vendors" component={VendorsPage} />
      <Route path="/product/:productId" component={ProductView} />
      <ProtectedRoute path="/customer/dashboard" component={() => <CustomerDashboard />} />
      <ProtectedRoute path="/customer/orders/:orderId" component={() => <OrderDetail />} />
      <ProtectedRoute path="/home" component={() => <HomePage />} />
      <ProtectedRoute path="/profile" component={() => <ProfilePage />} />
      <ProtectedRoute path="/settings" component={() => <SettingsPage />} />
      <ProtectedRoute path="/vendor-dashboard" component={() => <VendorDashboard />} />
      <ProtectedRoute path="/vendor-app-builder" component={() => <VendorAppBuilder />} />
      <ProtectedRoute path="/admin-dashboard" component={() => <AdminDashboard />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
