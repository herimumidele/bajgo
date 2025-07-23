import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  User,
  Store,
  Package,
  CreditCard,
  Truck,
  BarChart3,
  Smartphone
} from "lucide-react";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  duration: string;
  content: string[];
  tips: string[];
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Create Your Vendor Account",
    description: "Sign up and set up your vendor profile",
    icon: User,
    duration: "2 min",
    content: [
      "Go to /auth on the BajGo platform",
      "Click 'Sign Up' and fill in your details",
      "Select 'vendor' as your role",
      "Verify your email address",
      "Complete your profile information"
    ],
    tips: [
      "Use a professional email address",
      "Choose a memorable username",
      "Keep your password secure"
    ],
    action: "Start Registration"
  },
  {
    id: 2,
    title: "Choose Your Subscription Plan",
    description: "Select the plan that fits your business needs",
    icon: CreditCard,
    duration: "3 min",
    content: [
      "Review available subscription plans",
      "Free: Basic storefront, 5 products, COD only",
      "Starter (RM29): 50 products, Lalamove delivery",
      "Professional (RM99): 200 products, advanced analytics",
      "Enterprise (RM299): Unlimited products, mobile app"
    ],
    tips: [
      "Start with Free plan to test the platform",
      "Upgrade to Starter for delivery services",
      "Professional plan best for growing businesses"
    ],
    action: "Choose Plan"
  },
  {
    id: 3,
    title: "Set Up Your Storefront",
    description: "Create your branded online store",
    icon: Store,
    duration: "5 min",
    content: [
      "Access your Vendor Dashboard",
      "Go to Store Settings",
      "Enter your store name and description",
      "Upload your store logo and banner",
      "Set your business address and phone",
      "Configure operating hours"
    ],
    tips: [
      "Choose a memorable store name",
      "Use high-quality logo and banner images",
      "Complete all fields for better SEO"
    ],
    action: "Setup Store"
  },
  {
    id: 4,
    title: "Upload Your Perfume Products",
    description: "Add your product catalog",
    icon: Package,
    duration: "10 min",
    content: [
      "Navigate to Products section",
      "Click 'Add New Product'",
      "Enter product name and description",
      "Set price and select 'Health & Beauty' category",
      "Upload high-quality product images",
      "Set stock quantity and variants (sizes, scents)",
      "Add SKU/product codes"
    ],
    tips: [
      "Use clear, professional product photos",
      "Write detailed product descriptions",
      "Set competitive but profitable prices"
    ],
    action: "Add Products"
  },
  {
    id: 5,
    title: "Configure Payment Methods",
    description: "Set up how customers can pay",
    icon: CreditCard,
    duration: "3 min",
    content: [
      "Go to Payment Settings",
      "Free Plan: COD (Cash on Delivery) only",
      "Paid Plans: Enable online payments",
      "Connect Stripe, Billplz, or SenangPay",
      "Set minimum order amounts",
      "Configure payment policies"
    ],
    tips: [
      "COD is great for building initial trust",
      "Online payments increase sales conversion",
      "Set clear payment terms"
    ],
    action: "Setup Payments"
  },
  {
    id: 6,
    title: "Set Up Delivery Options",
    description: "Configure shipping and delivery",
    icon: Truck,
    duration: "4 min",
    content: [
      "Access Delivery Settings",
      "Configure Lalamove integration (Starter+)",
      "Set delivery areas and fees",
      "Configure pickup location",
      "Set delivery time slots",
      "Enable same-day delivery options"
    ],
    tips: [
      "Lalamove provides same-day delivery",
      "Set realistic delivery timeframes",
      "Offer free delivery for larger orders"
    ],
    action: "Setup Delivery"
  },
  {
    id: 7,
    title: "Launch Your Store",
    description: "Go live and start selling",
    icon: Smartphone,
    duration: "2 min",
    content: [
      "Preview your storefront",
      "Test the ordering process",
      "Check mobile responsiveness",
      "Activate your store",
      "Get your store URL: yourstore.bajgo.my",
      "Share with customers"
    ],
    tips: [
      "Test everything before launching",
      "Share your store URL on social media",
      "Start with friends and family"
    ],
    action: "Launch Store"
  },
  {
    id: 8,
    title: "Manage Orders & Analytics",
    description: "Track sales and grow your business",
    icon: BarChart3,
    duration: "Ongoing",
    content: [
      "Monitor incoming orders",
      "Update order status",
      "Track delivery progress",
      "View sales analytics",
      "Manage customer communications",
      "Optimize product listings"
    ],
    tips: [
      "Respond quickly to orders",
      "Use analytics to improve sales",
      "Keep customers updated on order status"
    ],
    action: "Manage Business"
  }
];

export default function VendorTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const currentStepData = tutorialSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markCompleted = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    nextStep();
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                BajGo Vendor Tutorial
              </h1>
              <p className="text-gray-600 mt-2">
                Complete step-by-step guide to start selling on BajGo
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-red-600 border-red-600">
                {completedSteps.length} of {tutorialSteps.length} completed
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Steps List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tutorial Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tutorialSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      index === currentStep
                        ? "bg-red-50 border-2 border-red-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => jumpToStep(index)}
                  >
                    <div className="flex items-center space-x-3">
                      {completedSteps.includes(index) ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <step.icon className={`w-5 h-5 ${
                          index === currentStep ? "text-red-600" : "text-gray-400"
                        }`} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          index === currentStep ? "text-red-900" : "text-gray-700"
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500">{step.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <currentStepData.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        Step {currentStep + 1}: {currentStepData.title}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        {currentStepData.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{currentStepData.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Video-like Player Interface */}
                <div className="bg-gray-900 rounded-lg p-8 mb-6">
                  <div className="text-center">
                    <div className="mb-4">
                      <currentStepData.icon className="w-16 h-16 text-white mx-auto mb-4" />
                      <h3 className="text-white text-lg font-semibold mb-2">
                        {currentStepData.title}
                      </h3>
                      <p className="text-gray-300">
                        {currentStepData.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 mr-2" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        {isPlaying ? "Pause" : "Play"} Tutorial
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      What you'll do:
                    </h4>
                    <ul className="space-y-2">
                      {currentStepData.content.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <ChevronRight className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Pro Tips:
                    </h4>
                    <ul className="space-y-2">
                      {currentStepData.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-4">
                    {currentStepData.action && (
                      <Button
                        onClick={markCompleted}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {currentStepData.action}
                      </Button>
                    )}
                    
                    <Button
                      onClick={nextStep}
                      disabled={currentStep === tutorialSteps.length - 1}
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Tutorial Progress</span>
                <span className="text-sm text-gray-600">
                  {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}