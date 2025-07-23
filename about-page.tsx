import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import { Users, Target, Award, Heart, Link } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About BajGo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering every Malaysian business to sell online with instant delivery solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At BajGo, we believe that "Every One Can Sell Online" with instant delivery to scheduled delivery. 
              Our mission is to democratize e-commerce for Malaysian businesses by providing a comprehensive 
              white-label SaaS platform that makes online selling accessible to everyone.
            </p>
            <p className="text-gray-600 mb-6">
              We bridge the gap between traditional businesses and the digital economy, offering not just 
              an online store, but a complete ecosystem including delivery management, payment processing, 
              and mobile app creation.
            </p>
            <Link href="/auth">
              <Button className="bg-red-600 hover:bg-red-700">
                Start Your Journey
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">1000+</h3>
                <p className="text-gray-600">Active Merchants</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">50K+</h3>
                <p className="text-gray-600">Orders Processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">99.9%</h3>
                <p className="text-gray-600">Uptime</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">4.9/5</h3>
                <p className="text-gray-600">Customer Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600">
                Every decision we make is centered around delivering value to our customers and their success.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to stay ahead of market trends and provide cutting-edge solutions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600">
                We build trust through transparency, reliability, and ethical business practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}