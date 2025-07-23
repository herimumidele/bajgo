import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentGatewaySetupProps {
  vendorId: number;
}

interface PaymentGateway {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  fees: string;
  supportedMethods: string[];
  config?: any;
}

export default function PaymentGatewaySetup({ vendorId }: PaymentGatewaySetupProps) {
  const { toast } = useToast();
  const [activeGateway, setActiveGateway] = useState<string>("stripe");

  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept international cards with low fees",
      icon: CreditCard,
      enabled: false,
      fees: "2.9% + RM0.30 per transaction",
      supportedMethods: ["Credit Card", "Debit Card", "Apple Pay", "Google Pay"],
      config: {
        publicKey: "",
        secretKey: "",
        webhookSecret: ""
      }
    },
    {
      id: "billplz",
      name: "Billplz",
      description: "Popular Malaysian payment gateway",
      icon: Wallet,
      enabled: false,
      fees: "2.9% per transaction",
      supportedMethods: ["Online Banking", "Credit Card", "E-Wallet"],
      config: {
        apiKey: "",
        xSignature: "",
        collectionId: ""
      }
    },
    {
      id: "senangpay",
      name: "SenangPay",
      description: "Simple Malaysian payment solution",
      icon: Banknote,
      enabled: false,
      fees: "2.9% per transaction",
      supportedMethods: ["Online Banking", "Credit Card", "E-Wallet"],
      config: {
        merchantId: "",
        secretKey: "",
        environment: "sandbox"
      }
    }
  ]);

  const [codSettings, setCodSettings] = useState({
    enabled: true,
    minimumOrder: 20,
    maximumOrder: 500,
    additionalFee: 5
  });

  const updateGatewayConfig = (gatewayId: string, config: any) => {
    setPaymentGateways(prev => prev.map(gateway => 
      gateway.id === gatewayId 
        ? { ...gateway, config: { ...gateway.config, ...config } }
        : gateway
    ));
  };

  const toggleGateway = (gatewayId: string) => {
    setPaymentGateways(prev => prev.map(gateway => 
      gateway.id === gatewayId 
        ? { ...gateway, enabled: !gateway.enabled }
        : gateway
    ));
    
    toast({
      title: "Payment Gateway Updated",
      description: `Payment gateway has been ${paymentGateways.find(g => g.id === gatewayId)?.enabled ? 'disabled' : 'enabled'}.`
    });
  };

  const saveSettings = async () => {
    try {
      // Mock API call - in production, this would save to backend
      toast({
        title: "Settings Saved",
        description: "Payment gateway settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const testGateway = async (gatewayId: string) => {
    try {
      // Mock API call - in production, this would test the gateway
      toast({
        title: "Gateway Test Successful",
        description: "Payment gateway connection is working properly."
      });
    } catch (error) {
      toast({
        title: "Gateway Test Failed",
        description: "Please check your API credentials and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateway Setup
          </CardTitle>
          <CardDescription>
            Configure payment methods for your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="gateways" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
              <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
            </TabsList>

            <TabsContent value="gateways" className="space-y-4">
              {paymentGateways.map((gateway) => {
                const IconComponent = gateway.icon;
                return (
                  <Card key={gateway.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-6 w-6" />
                          <div>
                            <CardTitle className="text-lg">{gateway.name}</CardTitle>
                            <CardDescription>{gateway.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {gateway.enabled && (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                          <Switch
                            checked={gateway.enabled}
                            onCheckedChange={() => toggleGateway(gateway.id)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Transaction Fees:</span>
                            <p className="text-gray-600">{gateway.fees}</p>
                          </div>
                          <div>
                            <span className="font-medium">Supported Methods:</span>
                            <p className="text-gray-600">{gateway.supportedMethods.join(", ")}</p>
                          </div>
                        </div>

                        {gateway.enabled && (
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">Configuration</h4>
                            <div className="grid gap-4">
                              {gateway.id === "stripe" && (
                                <>
                                  <div>
                                    <Label htmlFor="stripe-public">Publishable Key</Label>
                                    <Input
                                      id="stripe-public"
                                      placeholder="pk_test_..."
                                      value={gateway.config?.publicKey || ""}
                                      onChange={(e) => updateGatewayConfig("stripe", { publicKey: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="stripe-secret">Secret Key</Label>
                                    <Input
                                      id="stripe-secret"
                                      type="password"
                                      placeholder="sk_test_..."
                                      value={gateway.config?.secretKey || ""}
                                      onChange={(e) => updateGatewayConfig("stripe", { secretKey: e.target.value })}
                                    />
                                  </div>
                                </>
                              )}

                              {gateway.id === "billplz" && (
                                <>
                                  <div>
                                    <Label htmlFor="billplz-api">API Key</Label>
                                    <Input
                                      id="billplz-api"
                                      placeholder="Your Billplz API Key"
                                      value={gateway.config?.apiKey || ""}
                                      onChange={(e) => updateGatewayConfig("billplz", { apiKey: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="billplz-collection">Collection ID</Label>
                                    <Input
                                      id="billplz-collection"
                                      placeholder="Collection ID"
                                      value={gateway.config?.collectionId || ""}
                                      onChange={(e) => updateGatewayConfig("billplz", { collectionId: e.target.value })}
                                    />
                                  </div>
                                </>
                              )}

                              {gateway.id === "senangpay" && (
                                <>
                                  <div>
                                    <Label htmlFor="senang-merchant">Merchant ID</Label>
                                    <Input
                                      id="senang-merchant"
                                      placeholder="Your Merchant ID"
                                      value={gateway.config?.merchantId || ""}
                                      onChange={(e) => updateGatewayConfig("senangpay", { merchantId: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="senang-secret">Secret Key</Label>
                                    <Input
                                      id="senang-secret"
                                      type="password"
                                      placeholder="Your Secret Key"
                                      value={gateway.config?.secretKey || ""}
                                      onChange={(e) => updateGatewayConfig("senangpay", { secretKey: e.target.value })}
                                    />
                                  </div>
                                </>
                              )}

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => testGateway(gateway.id)}
                                >
                                  Test Connection
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="cod" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="h-5 w-5" />
                    Cash on Delivery Settings
                  </CardTitle>
                  <CardDescription>
                    Configure cash on delivery options for your customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable Cash on Delivery</h4>
                        <p className="text-sm text-gray-600">Allow customers to pay with cash upon delivery</p>
                      </div>
                      <Switch
                        checked={codSettings.enabled}
                        onCheckedChange={(checked) => setCodSettings(prev => ({ ...prev, enabled: checked }))}
                      />
                    </div>

                    {codSettings.enabled && (
                      <div className="border-t pt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="min-order">Minimum Order (RM)</Label>
                            <Input
                              id="min-order"
                              type="number"
                              value={codSettings.minimumOrder}
                              onChange={(e) => setCodSettings(prev => ({ ...prev, minimumOrder: Number(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="max-order">Maximum Order (RM)</Label>
                            <Input
                              id="max-order"
                              type="number"
                              value={codSettings.maximumOrder}
                              onChange={(e) => setCodSettings(prev => ({ ...prev, maximumOrder: Number(e.target.value) }))}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="cod-fee">Additional COD Fee (RM)</Label>
                          <Input
                            id="cod-fee"
                            type="number"
                            step="0.01"
                            value={codSettings.additionalFee}
                            onChange={(e) => setCodSettings(prev => ({ ...prev, additionalFee: Number(e.target.value) }))}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Additional fee charged for cash on delivery orders
                          </p>
                        </div>

                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            COD orders are subject to verification. High-value orders may require additional confirmation.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button onClick={saveSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Save Payment Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}