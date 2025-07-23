import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Users, Settings, BarChart3, ShoppingCart } from "lucide-react";
import Navigation from "@/components/navigation";

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto mobile-safe mobile-padding">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {user.role === "admin" 
              ? "Manage your BajGo white-label platform from here"
              : user.role === "vendor"
              ? "Manage your store with instant to scheduled delivery"
              : "Discover amazing vendors and get fast delivery"
            }
          </p>
        </div>

        <div className="card-grid">
          {user.role === "admin" && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin-dashboard")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-primary" />
                    Admin Dashboard
                  </CardTitle>
                  <CardDescription>
                    Manage clients, orders, and platform settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Open Dashboard
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-secondary" />
                    Platform Analytics
                  </CardTitle>
                  <CardDescription>
                    View comprehensive platform metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {user.role === "vendor" && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/vendor-dashboard")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="h-5 w-5 mr-2 text-primary" />
                    Vendor Dashboard
                  </CardTitle>
                  <CardDescription>
                    Manage your store, products, and orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Open Dashboard
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-secondary" />
                    Store Analytics
                  </CardTitle>
                  <CardDescription>
                    Track your store performance and sales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {user.role === "customer" && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/vendors")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="h-5 w-5 mr-2 text-primary" />
                    Browse Vendors
                  </CardTitle>
                  <CardDescription>
                    Discover local vendors and their products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => navigate("/vendors")}>
                    Browse Stores
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/orders")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-secondary" />
                    My Orders
                  </CardTitle>
                  <CardDescription>
                    Track your orders and order history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/orders")}>
                    View Orders
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/help")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-accent" />
                Support
              </CardTitle>
              <CardDescription>
                Get help and contact support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate("/help")}>
                Get Help
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Vendors</p>
                  <p className="text-2xl font-bold">500+</p>
                </div>
                <Store className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-secondary to-emerald-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Orders Processed</p>
                  <p className="text-2xl font-bold">50K+</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-emerald-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-accent to-orange-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Revenue</p>
                  <p className="text-2xl font-bold">RM 2M+</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Platform Uptime</p>
                  <p className="text-2xl font-bold">99.9%</p>
                </div>
                <Settings className="h-8 w-8 text-purple-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
