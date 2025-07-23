import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Check, X, ArrowRight, Star } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "RM29",
    period: "/month",
    description: "Perfect for small businesses starting their online journey",
    features: [
      { name: "Up to 100 products", included: true },
      { name: "Basic analytics", included: true },
      { name: "WhatsApp integration", included: true },
      { name: "5% transaction fee", included: true },
      { name: "Standard support", included: true },
      { name: "Custom domain", included: false },
      { name: "Mobile app builder", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Priority support", included: false },
      { name: "White-label solution", included: false }
    ],
    popular: false,
    color: "gray"
  },
  {
    name: "Professional",
    price: "RM99",
    period: "/month",
    description: "Advanced features for growing businesses",
    features: [
      { name: "Up to 1,000 products", included: true },
      { name: "Advanced analytics", included: true },
      { name: "WhatsApp integration", included: true },
      { name: "3% transaction fee", included: true },
      { name: "Priority support", included: true },
      { name: "Custom domain", included: true },
      { name: "Mobile app builder", included: true },
      { name: "Lalamove integration", included: true },
      { name: "API access", included: true },
      { name: "White-label solution", included: false }
    ],
    popular: true,
    color: "red"
  },
  {
    name: "Enterprise",
    price: "RM299",
    period: "/month",
    description: "Full-scale solution for large businesses",
    features: [
      { name: "Unlimited products", included: true },
      { name: "Full analytics suite", included: true },
      { name: "WhatsApp integration", included: true },
      { name: "2% transaction fee", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Custom domain", included: true },
      { name: "Mobile app builder", included: true },
      { name: "Lalamove integration", included: true },
      { name: "API access", included: true },
      { name: "White-label solution", included: true }
    ],
    popular: false,
    color: "gray"
  }
];

const faqs = [
  {
    question: "What's included in the free trial?",
    answer: "All paid plans include a 14-day free trial with full access to all features. No credit card required to start."
  },
  {
    question: "Can I change my plan anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated."
  },
  {
    question: "What are transaction fees?",
    answer: "Transaction fees are charged on each successful sale. This covers payment processing, security, and platform maintenance."
  },
  {
    question: "Do I need technical skills to use BajGo?",
    answer: "No technical skills required! Our platform is designed to be user-friendly with drag-and-drop tools and guided setup."
  },
  {
    question: "Is there a setup fee?",
    answer: "No setup fees! You only pay the monthly subscription fee. We include onboarding support for all plans."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, online banking, and local payment methods through our integrated payment gateways."
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Simple, Transparent
              <span className="text-red-500"> Pricing</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include a 14-day free trial.
              No setup fees, no hidden costs.
            </p>
            <div className="mt-8">
              <Badge className="bg-red-100 text-red-800 text-sm px-4 py-2">
                <Star className="h-4 w-4 mr-1" />
                14-day free trial • No credit card required
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-red-500 border-2 shadow-lg' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-gray-600">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-red-500 mr-3" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400 mr-3" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link to={`/auth?plan=${plan.name.toLowerCase()}&price=${plan.price}`}>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-900 hover:bg-gray-800'}`}
                    >
                      Choose {plan.name} Plan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Compare Plans
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6">Features</th>
                  <th className="text-center py-4 px-6">Starter</th>
                  <th className="text-center py-4 px-6">Professional</th>
                  <th className="text-center py-4 px-6">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Products", starter: "100", professional: "1,000", enterprise: "Unlimited" },
                  { name: "Transaction Fee", starter: "5%", professional: "3%", enterprise: "2%" },
                  { name: "Custom Domain", starter: false, professional: true, enterprise: true },
                  { name: "Mobile App", starter: false, professional: true, enterprise: true },
                  { name: "Advanced Analytics", starter: false, professional: true, enterprise: true },
                  { name: "Priority Support", starter: false, professional: true, enterprise: true },
                  { name: "White-label", starter: false, professional: false, enterprise: true },
                ].map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium text-gray-900">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <Check className="h-5 w-5 text-red-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{feature.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.professional === 'boolean' ? (
                        feature.professional ? (
                          <Check className="h-5 w-5 text-red-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{feature.professional}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <Check className="h-5 w-5 text-red-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
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
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-xl text-red-100 max-w-2xl mx-auto">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" variant="outline" className="bg-white text-red-500 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-500">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}