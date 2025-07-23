import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Store, Truck, CreditCard, Palette, Globe, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StoreOnboardingProps {
  onComplete: () => void;
}

export default function StoreOnboarding({ onComplete }: StoreOnboardingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Store Info
    storeName: "",
    description: "",
    address: "",
    phone: "",
    
    // Step 2: Delivery Setup
    enableLalamove: false,
    lalamoveApiKey: "",
    lalamoveSecret: "",
    lalamoveServiceType: "MOTORCYCLE",
    lalamoveMarket: "MY",
    deliveryRadius: 10,
    estimatedDeliveryTime: 30,
    deliveryFee: 5.00,
    freeDeliveryThreshold: 50.00,
    
    // Step 3: Payment Setup
    enableCOD: true,
    enableOnlinePayment: true,
    enableWallet: false,
    minOrderAmount: 0.00,
    
    // Step 4: Store Design
    themeColor: "#E53E3E",
    accentColor: "#FEB2B2",
    fontFamily: "Inter",
    storeLayout: "grid",
    
    // Step 5: Domain Setup
    customDomain: "",
  });

  const createVendorMutation = useMutation({
    mutationFn: async (vendorData: any) => {
      const response = await fetch("/api/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create vendor");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-vendor"] });
      toast({
        title: "Store Created Successfully!",
        description: "Your store is now live and ready to accept orders.",
      });
      onComplete();
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Store",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      const setupProgress = {
        storeInfo: true,
        deliverySetup: true,
        paymentSetup: true,
        storeDesign: true,
        domainSetup: true,
        completed: true,
      };
      
      createVendorMutation.mutate({ ...formData, setupProgress });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, title: "Store Information", icon: Store, completed: currentStep > 1 },
    { id: 2, title: "Delivery Setup", icon: Truck, completed: currentStep > 2 },
    { id: 3, title: "Payment Options", icon: CreditCard, completed: currentStep > 3 },
    { id: 4, title: "Store Design", icon: Palette, completed: currentStep > 4 },
    { id: 5, title: "Domain Setup", icon: Globe, completed: currentStep > 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Store</h1>
          <p className="text-gray-600">Set up your online store in just a few minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step.completed ? 'bg-green-500' : currentStep === step.id ? 'bg-red-500' : 'bg-gray-300'
                } text-white`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.completed ? 'text-green-600' : currentStep === step.id ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = steps[currentStep - 1].icon;
                return <StepIcon className="w-5 h-5" />;
              })()}
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your store"}
              {currentStep === 2 && "Set up delivery with Lalamove integration"}
              {currentStep === 3 && "Choose your payment methods"}
              {currentStep === 4 && "Customize your store appearance"}
              {currentStep === 5 && "Set up your domain"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Store Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeName">Store Name *</Label>
                    <Input
                      id="storeName"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      placeholder="My Awesome Store"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+60 12-345-6789"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Store Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what your store offers..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Store Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Your store's physical address"
                    rows={2}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Delivery Setup */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Lalamove Integration</h3>
                      <p className="text-sm text-gray-600">Enable professional delivery service with one click</p>
                    </div>
                    <Switch
                      checked={formData.enableLalamove}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableLalamove: checked })}
                    />
                  </div>
                  
                  {formData.enableLalamove && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lalamoveApiKey">Lalamove API Key</Label>
                          <Input
                            id="lalamoveApiKey"
                            type="password"
                            value={formData.lalamoveApiKey}
                            onChange={(e) => setFormData({ ...formData, lalamoveApiKey: e.target.value })}
                            placeholder="Your Lalamove API key"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lalamoveSecret">Lalamove Secret</Label>
                          <Input
                            id="lalamoveSecret"
                            type="password"
                            value={formData.lalamoveSecret}
                            onChange={(e) => setFormData({ ...formData, lalamoveSecret: e.target.value })}
                            placeholder="Your Lalamove secret"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="lalamoveServiceType">Service Type</Label>
                          <Select value={formData.lalamoveServiceType} onValueChange={(value) => setFormData({ ...formData, lalamoveServiceType: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                              <SelectItem value="CAR">Car</SelectItem>
                              <SelectItem value="WALKER">Walker</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="lalamoveMarket">Market</Label>
                          <Select value={formData.lalamoveMarket} onValueChange={(value) => setFormData({ ...formData, lalamoveMarket: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MY">Malaysia</SelectItem>
                              <SelectItem value="SG">Singapore</SelectItem>
                              <SelectItem value="TH">Thailand</SelectItem>
                              <SelectItem value="PH">Philippines</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                          <Input
                            id="deliveryRadius"
                            type="number"
                            value={formData.deliveryRadius}
                            onChange={(e) => setFormData({ ...formData, deliveryRadius: parseInt(e.target.value) })}
                            min="1"
                            max="50"
                          />
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Lalamove will handle all delivery logistics for you
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="deliveryFee">Delivery Fee (RM)</Label>
                    <Input
                      id="deliveryFee"
                      type="number"
                      step="0.01"
                      value={formData.deliveryFee}
                      onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="freeDeliveryThreshold">Free Delivery Above (RM)</Label>
                    <Input
                      id="freeDeliveryThreshold"
                      type="number"
                      step="0.01"
                      value={formData.freeDeliveryThreshold}
                      onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: parseFloat(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedDeliveryTime">Estimated Delivery (minutes)</Label>
                    <Input
                      id="estimatedDeliveryTime"
                      type="number"
                      value={formData.estimatedDeliveryTime}
                      onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: parseInt(e.target.value) })}
                      min="15"
                      max="120"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Setup */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Cash on Delivery</h3>
                      <Switch
                        checked={formData.enableCOD}
                        onCheckedChange={(checked) => setFormData({ ...formData, enableCOD: checked })}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Accept cash payments on delivery</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Online Payment</h3>
                      <Switch
                        checked={formData.enableOnlinePayment}
                        onCheckedChange={(checked) => setFormData({ ...formData, enableOnlinePayment: checked })}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Accept card & bank payments</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Digital Wallet</h3>
                      <Switch
                        checked={formData.enableWallet}
                        onCheckedChange={(checked) => setFormData({ ...formData, enableWallet: checked })}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Accept GrabPay, TNG, etc.</p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="minOrderAmount">Minimum Order Amount (RM)</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    step="0.01"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Store Design */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="themeColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="themeColor"
                        type="color"
                        value={formData.themeColor}
                        onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.themeColor}
                        onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                        placeholder="#E53E3E"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        placeholder="#FEB2B2"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select value={formData.fontFamily} onValueChange={(value) => setFormData({ ...formData, fontFamily: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="storeLayout">Store Layout</Label>
                    <Select value={formData.storeLayout} onValueChange={(value) => setFormData({ ...formData, storeLayout: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Domain Setup */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                  <Input
                    id="customDomain"
                    value={formData.customDomain}
                    onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                    placeholder="www.mystore.com"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Leave empty to use {formData.storeName.toLowerCase().replace(/\s+/g, '-')}.bajgo.my
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Your Store Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Store Name:</strong> {formData.storeName}</p>
                    <p><strong>Domain:</strong> {formData.customDomain || `${formData.storeName.toLowerCase().replace(/\s+/g, '-')}.bajgo.my`}</p>
                    <p><strong>Delivery:</strong> {formData.enableLalamove ? 'Lalamove Integrated' : 'Standard Delivery'}</p>
                    <p><strong>Payments:</strong> 
                      {[
                        formData.enableCOD && 'COD',
                        formData.enableOnlinePayment && 'Online',
                        formData.enableWallet && 'Wallet'
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={createVendorMutation.isPending || (currentStep === 1 && !formData.storeName)}
                className="min-w-32"
              >
                {createVendorMutation.isPending ? (
                  "Creating..."
                ) : currentStep === 5 ? (
                  "Create Store"
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}