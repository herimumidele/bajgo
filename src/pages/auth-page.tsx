import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Store, Users, BarChart3, Truck, Clock, MapPin } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    role: "vendor" // Default to vendor since most people come here to start business
  });

  // Parse URL parameters for selected subscription plan
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    const price = params.get('price');
    if (plan && price) {
      setSelectedPlan({ name: plan, price });
      setRegisterForm(prev => ({ ...prev, role: "vendor" })); // Auto-select vendor for subscription
    }
  }, []);

  // Redirect if already logged in - role-based navigation handled by useAuth hook
  React.useEffect(() => {
    if (user) {
      // Navigation is handled by the auth hook based on user role
      // Admin -> /admin-dashboard
      // Vendor -> /vendor-dashboard  
      // Customer -> /customer/dashboard
    }
  }, [user]);

  if (user) {
    return null; // Don't render while redirecting
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center mobile-safe mobile-padding">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src="/bajgo-logo.jpg" alt="BajGo" className="h-8 w-8 sm:h-10 sm:w-10 mr-2 rounded-full object-cover" />
              <h1 className="text-xl sm:text-2xl font-bold text-primary">BajGo</h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Your trusted delivery marketplace</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>
                    {selectedPlan ? `Start your ${selectedPlan.name} plan (${selectedPlan.price}/month)` : "Create your account to get started"}
                  </CardDescription>
                  {selectedPlan && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                      <p className="text-sm text-red-800">
                        <strong>Selected Plan:</strong> {selectedPlan.name.charAt(0).toUpperCase() + selectedPlan.name.slice(1)} - {selectedPlan.price}/month
                      </p>
                      <p className="text-xs text-red-600 mt-1">14-day free trial included</p>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input
                        id="reg-username"
                        type="text"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Account Type</Label>
                      <select
                        id="role"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={registerForm.role}
                        onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                      >
                        <option value="customer">Customer</option>
                        <option value="vendor">Vendor</option>
                      </select>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-red-700 text-white mobile-safe mobile-padding items-center justify-center">
        <div className="max-w-lg text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Fast, Reliable Delivery
          </h2>
          <p className="text-lg lg:text-xl mb-8 text-red-100">
            Connect with trusted vendors and get your orders delivered quickly. BajGo makes delivery simple and fast.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <Truck className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 text-red-200" />
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm text-red-100">Quick pickup and delivery service</p>
            </div>
            <div className="text-center">
              <Clock className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 text-red-200" />
              <h3 className="font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-sm text-red-100">Track your order every step of the way</p>
            </div>
            <div className="text-center">
              <MapPin className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 text-red-200" />
              <h3 className="font-semibold mb-2">Local Vendors</h3>
              <p className="text-sm text-red-100">Support local businesses in your area</p>
            </div>
            <div className="text-center">
              <Store className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 text-red-200" />
              <h3 className="font-semibold mb-2">Trusted Stores</h3>
              <p className="text-sm text-red-100">Verified vendors you can rely on</p>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <p className="text-sm">
              <strong>1000+ Vendors</strong> • <strong>Fast Delivery</strong> • <strong>24/7 Support</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
