import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Smartphone, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  MessageSquare,
  Truck,
  DollarSign,
  Globe,
  CreditCard,
  BarChart3,
  Coffee,
  ShoppingCart,
  Package,
  Timer,
  Target,
  Rocket
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";

export default function LandingPage() {
  // Safely try to get user, handle case where hook might not be available
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext?.user;
  } catch (error) {
    // Hook not available in this context, user remains null
    user = null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-red-400/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-red-100 text-red-800 border-red-200 px-4 py-2">
              🚀 White-Label SaaS Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Every One Can <br />
              <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                Sell Online
              </span> <br />
              with Instant Delivery
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Complete white-label platform enabling instant delivery to scheduled delivery. 
              Perfect for any business ready to go digital and start selling online.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {!user ? (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/vendor-tutorial">
                    <Button size="lg" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-4 text-lg">
                      Watch Tutorial
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to={user?.role === 'vendor' ? '/vendor-dashboard' : user?.role === 'admin' ? '/admin-dashboard' : '/customer/dashboard'}>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-red-500" />
                <span>30-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-500" />
                <span>5-Minute Setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect for Every Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our mission: Every One can sell online with instant delivery to schedule delivery. 
              From small businesses to growing enterprises, BajGo empowers everyone to go digital.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Small Business</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Any local business ready to expand their reach online</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Retail Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Product sellers looking to reach more customers</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Service Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Service businesses wanting to offer online booking</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Entrepreneurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Anyone with a business idea ready to start selling</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed Online
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete white-label solution with professional features and instant delivery integration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Branded Storefront</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Custom domain, logo, colors, and themes. Your brand, your way.</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Instant to Scheduled Delivery</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">From instant delivery to scheduled delivery - complete flexibility for your customers.</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Multiple Payments</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Stripe, Billplz, SenangPay, and cash on delivery options.</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Mobile App Builder</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Create your own branded mobile app with our app builder tool.</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Track orders, revenue, delivery status, and customer insights.</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-red-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Customer Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">WhatsApp, SMS, and email notifications for seamless communication.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business size. All plans include 30-day free trial.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow border-2 hover:border-red-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  RM29<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">Perfect for small businesses</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>Up to 50 products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>Lalamove delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>10% commission</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow border-2 border-red-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-red-500 text-white px-4 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  RM99<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">For growing businesses</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>Up to 500 products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>Custom domain</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>7% commission</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-red-500 hover:bg-red-600">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow border-2 hover:border-red-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  RM299<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">For large operations</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>Unlimited products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>Full analytics suite</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>White-label mobile app</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>5% commission</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="success" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how businesses are thriving with BajGo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "BajGo helped us launch our online store in just one day. Sales increased 300% in the first month!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Store className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Ahmad's Electronics</div>
                    <div className="text-sm text-gray-500">Local Electronics Store</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The instant delivery integration is amazing. Our customers love getting fresh flowers within an hour."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Blooming Petals</div>
                    <div className="text-sm text-gray-500">Flower Shop</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "From food truck to online empire. BajGo's mobile app builder was a game-changer for our business."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Coffee className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Mama's Kitchen</div>
                    <div className="text-sm text-gray-500">Local Restaurant</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Launch Your Online Store?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of businesses already selling online with BajGo. No setup fees, no contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                Schedule Demo
              </Button>
            </Link>
          </div>
          <p className="text-red-100 mt-6">
            30-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">BajGo</span>
              </div>
              <p className="text-gray-400">
                The complete white-label e-commerce solution for Malaysian businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-white">Integrations</Link></li>
                <li><Link to="/api-docs" className="hover:text-white">API Docs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/setup-guide" className="hover:text-white">Setup Guide</Link></li>
                <li><Link to="/tutorials" className="hover:text-white">Video Tutorials</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/partners" className="hover:text-white">Partners</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BajGo. All rights reserved. Built for Malaysian entrepreneurs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}