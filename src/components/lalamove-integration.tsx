import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, MapPin, Clock, Shield, CheckCircle, AlertCircle, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface LalamoveIntegrationProps {
  vendorId: number;
}

export default function LalamoveIntegration({ vendorId }: LalamoveIntegrationProps) {
  const [config, setConfig] = useState({
    isEnabled: false,
    defaultVehicleType: "MOTORCYCLE",
    businessHours: {
      start: "09:00",
      end: "18:00",
    },
    deliveryRadius: 10,
    baseDeliveryFee: 5.00,
    pricePerKm: 2.00,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user's subscription info
  const { data: subscription } = useQuery({
    queryKey: ["/api/subscription/my-subscription"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/subscription/my-subscription");
      return response.json();
    },
  });

  const hasLalamoveAccess = subscription?.plan && subscription.plan.name !== 'free';

  useEffect(() => {
    fetchConfig();
  }, [vendorId]);

  const fetchConfig = async () => {
    try {
      const response = await apiRequest("GET", `/api/lalamove/config/${vendorId}`);
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("Failed to fetch Lalamove config:", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", `/api/lalamove/config/${vendorId}`, config);
      if (response.ok) {
        toast({
          title: "Settings saved",
          description: "Your Lalamove integration settings have been updated.",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const vehicleTypes = [
    { value: "MOTORCYCLE", label: "Motorcycle", icon: "🏍️" },
    { value: "CAR", label: "Car", icon: "🚗" },
    { value: "VAN", label: "Van", icon: "🚐" },
    { value: "TRUCK", label: "Truck", icon: "🚛" },
  ];

  if (!hasLalamoveAccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Lalamove Delivery Integration</h3>
            <p className="text-sm text-gray-600">
              Professional delivery services for your customers
            </p>
          </div>
          <Badge variant="secondary">Premium Feature</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-red-500" />
              Upgrade Required
            </CardTitle>
            <CardDescription>
              Lalamove delivery integration is included in our paid subscription plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Lalamove Delivery Features:</p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Real-time delivery tracking</li>
                    <li>• Multiple vehicle types (motorcycle, car, van, truck)</li>
                    <li>• Instant delivery quotes</li>
                    <li>• Professional driver network</li>
                    <li>• Delivery confirmation and proof of delivery</li>
                    <li>• Flexible delivery scheduling</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800">Starter Plan</h4>
                <p className="text-sm text-red-600">RM 29/month</p>
                <p className="text-xs text-red-500 mt-1">Basic Lalamove integration</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800">Professional Plan</h4>
                <p className="text-sm text-red-600">RM 99/month</p>
                <p className="text-xs text-red-500 mt-1">Full Lalamove features</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800">Enterprise Plan</h4>
                <p className="text-sm text-red-600">RM 299/month</p>
                <p className="text-xs text-red-500 mt-1">Advanced delivery management</p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button className="bg-red-600 hover:bg-red-700">
                Upgrade to Access Lalamove
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Lalamove Delivery Integration</h3>
          <p className="text-sm text-gray-600">
            Configure instant delivery services for your customers
          </p>
        </div>
        <Badge variant={config.isEnabled ? "default" : "secondary"}>
          {config.isEnabled ? "Active" : "Disabled"}
        </Badge>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Subscription-Based Delivery Service</p>
            <p className="text-sm">
              Your subscription includes access to our centralized Lalamove delivery network. 
              Simply configure your preferences below - no API keys needed!
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Preferences
              </CardTitle>
              <CardDescription>
                Configure your delivery service preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultVehicle">Default Vehicle Type</Label>
                <Select value={config.defaultVehicleType} onValueChange={(value) => setConfig({ ...config, defaultVehicleType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enable"
                  checked={config.isEnabled}
                  onCheckedChange={(checked) => setConfig({ ...config, isEnabled: checked })}
                />
                <Label htmlFor="enable">Enable Lalamove Integration</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours & Delivery Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={config.businessHours.start}
                    onChange={(e) => setConfig({
                      ...config,
                      businessHours: { ...config.businessHours, start: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={config.businessHours.end}
                    onChange={(e) => setConfig({
                      ...config,
                      businessHours: { ...config.businessHours, end: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                <Input
                  id="deliveryRadius"
                  type="number"
                  value={config.deliveryRadius}
                  onChange={(e) => setConfig({ ...config, deliveryRadius: parseInt(e.target.value) || 0 })}
                  placeholder="10"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Pricing
              </CardTitle>
              <CardDescription>
                Set your delivery fees and pricing structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseFee">Base Delivery Fee (RM)</Label>
                  <Input
                    id="baseFee"
                    type="number"
                    step="0.01"
                    value={config.baseDeliveryFee}
                    onChange={(e) => setConfig({ ...config, baseDeliveryFee: parseFloat(e.target.value) || 0 })}
                    placeholder="5.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerKm">Price per KM (RM)</Label>
                  <Input
                    id="pricePerKm"
                    type="number"
                    step="0.01"
                    value={config.pricePerKm}
                    onChange={(e) => setConfig({ ...config, pricePerKm: parseFloat(e.target.value) || 0 })}
                    placeholder="2.00"
                  />
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  These are your additional fees on top of Lalamove's base pricing. 
                  Final delivery cost will be calculated dynamically based on distance and vehicle type.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}