import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  ShoppingCart, 
  Smartphone, 
  BarChart3, 
  CreditCard, 
  MessageSquare, 
  Truck, 
  Users, 
  Settings, 
  Globe, 
  Zap,
  Shield,
  HeadphonesIcon,
  Check,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: <ShoppingCart className="h-8 w-8 text-red-500" />,
    title: "Complete E-commerce Solution",
    description: "Full-featured online store with product management, inventory tracking, and order processing",
    benefits: ["Product catalog management", "Inventory tracking", "Order management", "Customer management"]
  },
  {
    icon: <Smartphone className="h-8 w-8 text-red-500" />,
    title: "Mobile App Builder",
    description: "Create and publish your own branded mobile app for iOS and Android",
    benefits: ["Custom app design", "App store publishing", "Push notifications", "Mobile-first experience"]
  },
  {
    icon: <Truck className="h-8 w-8 text-red-500" />,
    title: "Lalamove Integration",
    description: "Seamless delivery integration with real-time tracking and automated logistics",
    benefits: ["Real-time delivery tracking", "Automated logistics", "Driver management", "Proof of delivery"]
  },
  {
    icon: <CreditCard className="h-8 w-8 text-red-500" />,
    title: "Multi-Payment Gateway",
    description: "Accept payments through multiple channels including Stripe, Billplz, and SenangPay",
    benefits: ["Multiple payment methods", "Secure transactions", "Automated invoicing", "Payment analytics"]
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-red-500" />,
    title: "WhatsApp Business Integration",
    description: "Manage customer communications and orders directly through WhatsApp",
    benefits: ["WhatsApp ordering", "Customer support", "Automated responses", "Order notifications"]
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-red-500" />,
    title: "Advanced Analytics",
    description: "Comprehensive business intelligence and reporting tools",
    benefits: ["Sales analytics", "Customer insights", "Performance tracking", "Revenue reports"]
  },
  {
    icon: <Users className="h-8 w-8 text-red-500" />,
    title: "Multi-User Management",
    description: "Role-based access control for team collaboration",
    benefits: ["Team collaboration", "Role permissions", "User management", "Access control"]
  },
  {
    icon: <Globe className="h-8 w-8 text-red-500" />,
    title: "Custom Domain Support",
    description: "Professional branding with your own domain name",
    benefits: ["Custom domains", "SSL certificates", "Professional branding", "SEO optimization"]
  },
  {
    icon: <Zap className="h-8 w-8 text-red-500" />,
    title: "API & Integrations",
    description: "Connect with third-party services and build custom integrations",
    benefits: ["REST API access", "Webhook support", "Third-party integrations", "Custom development"]
  }
];

const plans = [
  {
    name: "Starter",
    price: "RM29",
    period: "/month",
    description: "Perfect for small businesses starting their online journey",
    features: [
      "Up to 100 products",
      "Basic analytics",
      "WhatsApp integration",
      "5% transaction fee",
      "Standard support"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "RM99",
    period: "/month",
    description: "Advanced features for growing businesses",
    features: [
      "Up to 1,000 products",
      "Advanced analytics",
      "Mobile app builder",
      "3% transaction fee",
      "Priority support",
      "Custom domain"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "RM299",
    period: "/month",
    description: "Full-scale solution for large businesses",
    features: [
      "Unlimited products",
      "Full analytics suite",
      "White-label solution",
      "2% transaction fee",
      "24/7 dedicated support",
      "Custom integrations"
    ],
    popular: false
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Powerful Features for Your
              <span className="text-red-500"> Online Business</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to sell online with instant to scheduled delivery. 
              From product management to mobile apps, we've got you covered.
            </p>
            <div className="mt-10">
              <Link href="/auth">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Complete E-commerce Solution
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              All the tools you need to build, manage, and grow your online business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <CardTitle className="ml-3 text-xl">{feature.title}</CardTitle>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <Check className="h-4 w-4 text-red-500 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Choose Your Plan
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Simple, transparent pricing that grows with your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-red-500 border-2' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-gray-600">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 text-red-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/auth">
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-900 hover:bg-gray-800'}`}
                      >
                        Start Free Trial
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Selling Online?
          </h2>
          <p className="mt-4 text-xl text-red-100 max-w-2xl mx-auto">
            Join thousands of businesses already using BajGo to grow their online presence
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" variant="outline" className="bg-white text-red-500 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-500">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}