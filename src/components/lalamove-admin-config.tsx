import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Truck, Key, Globe, AlertCircle, CheckCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LalamoveAdminConfig() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    environment: "sandbox",
    apiKey: "",
    apiSecret: "",
    webhookSecret: "",
    market: "MY"
  });

  // Get current Lalamove configuration
  const { data: config, isLoading } = useQuery({
    queryKey: ["/api/admin/lalamove-config"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/lalamove-config");
      return response.json();
    }
  });

  // Update configuration mutation
  const updateConfigMutation = useMutation({
    mutationFn: async (configData: typeof formData) => {
      const response = await apiRequest("POST", "/api/admin/lalamove-config", configData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration Updated",
        description: "Lalamove API configuration has been saved successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lalamove-config"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update configuration",
        variant: "destructive"
      });
    }
  });

  // Test API connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/lalamove-config/test");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Connection Test",
        description: data.success ? "API connection successful!" : "API connection failed",
        variant: data.success ? "default" : "destructive"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Test Failed",
        description: error.message || "Failed to test API connection",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfigMutation.mutate(formData);
  };

  const handleTestConnection = () => {
    testConnectionMutation.mutate();
  };

  // Set form data when config is loaded
  useEffect(() => {
    if (config) {
      setFormData({
        environment: config.environment || "sandbox",
        apiKey: config.apiKey || "",
        apiSecret: config.apiSecret || "",
        webhookSecret: config.webhookSecret || "",
        market: config.market || "MY"
      });
    }
  }, [config]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Lalamove Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading configuration...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Lalamove Delivery Configuration
        </CardTitle>
        <CardDescription>
          Configure centralized Lalamove API settings. All vendors will use these credentials for delivery services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="environment">Environment</Label>
              <Select 
                value={formData.environment} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, environment: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                  <SelectItem value="production">Production (Live)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="market">Market</Label>
              <Select 
                value={formData.market} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, market: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MY">Malaysia (MY)</SelectItem>
                  <SelectItem value="SG">Singapore (SG)</SelectItem>
                  <SelectItem value="TH">Thailand (TH)</SelectItem>
                  <SelectItem value="PH">Philippines (PH)</SelectItem>
                  <SelectItem value="VN">Vietnam (VN)</SelectItem>
                  <SelectItem value="HK">Hong Kong (HK)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter Lalamove API Key"
                value={formData.apiKey}
                onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                type="password"
                placeholder="Enter Lalamove API Secret"
                value={formData.apiSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, apiSecret: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
              <Input
                id="webhookSecret"
                type="password"
                placeholder="Enter Webhook Secret"
                value={formData.webhookSecret}
                onChange={(e) => setFormData(prev => ({ ...prev, webhookSecret: e.target.value }))}
              />
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> These API credentials will be used by all vendors on the platform. 
              Make sure to use production credentials only when you're ready to go live.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={updateConfigMutation.isPending}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {updateConfigMutation.isPending ? "Saving..." : "Save Configuration"}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={testConnectionMutation.isPending || !formData.apiKey || !formData.apiSecret}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {testConnectionMutation.isPending ? "Testing..." : "Test Connection"}
            </Button>
          </div>

          {config && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Current Configuration Status</h4>
              <div className="flex items-center gap-2">
                <Badge variant={config.isActive ? "default" : "destructive"}>
                  {config.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">{config.environment}</Badge>
                <Badge variant="outline">{config.market}</Badge>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}