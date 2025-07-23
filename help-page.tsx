import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/navigation";
import { Search, HelpCircle, Book, Video, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600">
            Find answers to your questions and get the support you need.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <Input 
              placeholder="Search for help articles..." 
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Link href="/setup-guide">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Book className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Setup Guide</h3>
                <p className="text-gray-600">
                  Step-by-step instructions to get your store up and running.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tutorials">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Video className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-gray-600">
                  Watch detailed video guides for all platform features.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/contact">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                <p className="text-gray-600">
                  Get personalized help from our support team.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 text-red-500 mr-2" />
                    How do I set up my online store?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Setting up your store is easy! Sign up for an account, choose your plan, 
                    and follow our 5-step onboarding process. You'll be live in under 30 minutes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 text-red-500 mr-2" />
                    What payment methods do you support?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We support all major payment gateways including Stripe, Billplz, and SenangPay. 
                    You can also enable cash on delivery for your customers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 text-red-500 mr-2" />
                    How does the delivery integration work?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our Lalamove integration provides instant delivery quotes and real-time tracking. 
                    Customers can choose from instant delivery to scheduled delivery options.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Getting Started with BajGo
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Complete guide to setting up your first online store...
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Managing Your Products
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Learn how to add, edit, and organize your product catalog...
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Order Management
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Handle orders, track delivery, and manage customer communications...
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Mobile App Builder
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Create and publish your mobile app to app stores...
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}