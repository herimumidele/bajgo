import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Store, 
  Globe, 
  Palette, 
  CreditCard, 
  Clock, 
  Share2,
  Search,
  DollarSign,
  Truck,
  Shield,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Smartphone
} from "lucide-react";

interface StoreSettingsProps {
  vendorId: number;
}

export default function StoreSettings({ vendorId }: StoreSettingsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const { data: store, isLoading } = useQuery({
    queryKey: ["/api/vendors", vendorId],
    enabled: !!vendorId,
  });

  const { data: availableSlug } = useQuery({
    queryKey: ["/api/check-slug", store?.storeSlug],
    enabled: !!store?.storeSlug,
  });

  const updateStoreMutation = useMutation({
    mutationFn: async (data: any) => {
      // Clean the data to avoid JSON parsing issues
      const cleanData = {
        ...data,
        businessHours: typeof data.businessHours === 'string' ? JSON.parse(data.businessHours) : data.businessHours,
      };
      
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update store settings");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors", vendorId] });
      toast({
        title: "Settings Updated",
        description: "Store settings and mobile app have been synchronized.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateSlugMutation = useMutation({
    mutationFn: async (storeName: string) => {
      const response = await fetch("/api/generate-slug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storeName }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate slug");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      updateStoreMutation.mutate({ storeSlug: data.slug });
      toast({
        title: "Domain Generated",
        description: `Your store domain is now ${data.slug}.bajgo.my`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateSlug = async () => {
    if (!store?.storeName) {
      toast({
        title: "Store Name Required",
        description: "Please set a store name first",
        variant: "destructive",
      });
      return;
    }
    
    setGenerating(true);
    await generateSlugMutation.mutateAsync(store.storeName);
    setGenerating(false);
  };

  const handleSaveSettings = (section: string, data: any) => {
    // Clean data before sending to prevent JSON parsing issues
    const cleanData = { ...data };
    
    // Handle potential JSON string issues
    Object.keys(cleanData).forEach(key => {
      if (typeof cleanData[key] === 'string' && cleanData[key].startsWith('{')) {
        try {
          cleanData[key] = JSON.parse(cleanData[key]);
        } catch (e) {
          // Keep as string if not valid JSON
        }
      }
    });
    
    updateStoreMutation.mutate(cleanData);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    });
  };

  const getStoreUrl = () => {
    if (store?.customDomain) {
      return `https://${store.customDomain}`;
    }
    return store?.storeSlug ? `https://${store.storeSlug}.bajgo.my` : "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Settings</h2>
          <p className="text-gray-600">Customize your store appearance and functionality</p>
        </div>
        {getStoreUrl() && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              <Globe className="h-3 w-3 mr-1" />
              Live Store
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(getStoreUrl(), "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Store
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="appearance">Design</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Essential store details and contact information (automatically synced with mobile app)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    defaultValue={store?.storeName}
                    placeholder="Enter your store name"
                    onBlur={(e) => handleSaveSettings("basic", { storeName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={store?.description}
                    placeholder="Describe your store and what you sell"
                    rows={3}
                    onBlur={(e) => handleSaveSettings("basic", { description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue={store?.phone}
                    placeholder="+60123456789"
                    onBlur={(e) => handleSaveSettings("basic", { phone: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    defaultValue={store?.address}
                    placeholder="Your store address"
                    rows={2}
                    onBlur={(e) => handleSaveSettings("basic", { address: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Currency & Locale
                </CardTitle>
                <CardDescription>
                  Set your preferred currency and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      defaultValue={store?.currency}
                      onValueChange={(value) => {
                        const symbols = { MYR: "RM", USD: "$", SGD: "S$", EUR: "€", GBP: "£" };
                        handleSaveSettings("currency", { 
                          currency: value, 
                          currencySymbol: symbols[value as keyof typeof symbols] 
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MYR">Malaysian Ringgit (MYR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="SGD">Singapore Dollar (SGD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      defaultValue={store?.timezone}
                      onValueChange={(value) => handleSaveSettings("locale", { timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur</SelectItem>
                        <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
                        <SelectItem value="Asia/Bangkok">Asia/Bangkok</SelectItem>
                        <SelectItem value="Asia/Jakarta">Asia/Jakarta</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    defaultValue={store?.language}
                    onValueChange={(value) => handleSaveSettings("locale", { language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    defaultValue={store?.whatsappNumber}
                    placeholder="+60123456789"
                    onBlur={(e) => handleSaveSettings("contact", { whatsappNumber: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Store Domain
              </CardTitle>
              <CardDescription>
                Set up your store's web address for easy access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">BajGo Subdomain</h4>
                      <p className="text-sm text-blue-700">Free subdomain on bajgo.my</p>
                    </div>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={store?.storeSlug || ""}
                        onChange={(e) => handleSaveSettings("domain", { storeSlug: e.target.value })}
                        placeholder="your-store-name"
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600">.bajgo.my</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleGenerateSlug}
                        disabled={generating}
                        variant="outline"
                        className="flex-1"
                      >
                        {generating ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Auto Generate
                      </Button>
                      
                      {store?.storeSlug && (
                        <Button
                          onClick={() => copyToClipboard(`https://${store.storeSlug}.bajgo.my`, "Store URL")}
                          variant="outline"
                          className="flex-1"
                        >
                          {copied === "Store URL" ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          Copy URL
                        </Button>
                      )}
                    </div>
                    
                    {store?.storeSlug && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Your store URL:</p>
                        <p className="text-sm text-primary break-all">
                          https://{store.storeSlug}.bajgo.my
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Custom Domain</h4>
                      <p className="text-sm text-gray-600">Use your own domain name</p>
                    </div>
                    <Badge variant="outline">Pro</Badge>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <Input
                      value={store?.customDomain || ""}
                      onChange={(e) => handleSaveSettings("domain", { customDomain: e.target.value })}
                      placeholder="www.your-store.com"
                      disabled
                    />
                    <p className="text-xs text-gray-500">
                      Custom domains are available with Pro plan. Contact support for setup.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  Store Branding
                </CardTitle>
                <CardDescription>
                  Upload your store logo and banner images
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Store Logo URL</Label>
                  <Input
                    id="logo"
                    type="url"
                    defaultValue={store?.logo}
                    placeholder="https://example.com/logo.png"
                    onBlur={(e) => handleSaveSettings("branding", { logo: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended: 200x200px square logo in PNG or JPG format
                  </p>
                  {store?.logo && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Logo Preview:</p>
                      <img 
                        src={store.logo} 
                        alt="Store logo" 
                        className="w-16 h-16 object-contain border rounded" 
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="banner">Store Banner URL</Label>
                  <Input
                    id="banner"
                    type="url"
                    defaultValue={store?.banner}
                    placeholder="https://example.com/banner.jpg"
                    onBlur={(e) => handleSaveSettings("branding", { banner: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended: 1200x300px banner image in JPG or PNG format
                  </p>
                  {store?.banner && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Banner Preview:</p>
                      <img 
                        src={store.banner} 
                        alt="Store banner" 
                        className="w-full h-20 object-cover border rounded" 
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Colors & Theme
                </CardTitle>
                <CardDescription>
                  Customize your store's visual appearance (automatically synced with mobile app colors)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="themeColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="themeColor"
                        defaultValue={store?.themeColor}
                        className="w-10 h-10 rounded border"
                        onChange={(e) => handleSaveSettings("appearance", { themeColor: e.target.value })}
                      />
                      <Input
                        value={store?.themeColor}
                        onChange={(e) => handleSaveSettings("appearance", { themeColor: e.target.value })}
                        placeholder="#E53E3E"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="accentColor"
                        defaultValue={store?.accentColor}
                        className="w-10 h-10 rounded border"
                        onChange={(e) => handleSaveSettings("appearance", { accentColor: e.target.value })}
                      />
                      <Input
                        value={store?.accentColor}
                        onChange={(e) => handleSaveSettings("appearance", { accentColor: e.target.value })}
                        placeholder="#FEB2B2"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select
                    defaultValue={store?.fontFamily}
                    onValueChange={(value) => handleSaveSettings("appearance", { fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Nunito">Nunito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeLayout">Store Layout</Label>
                  <Select
                    defaultValue={store?.storeLayout}
                    onValueChange={(value) => handleSaveSettings("appearance", { storeLayout: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid Layout</SelectItem>
                      <SelectItem value="list">List Layout</SelectItem>
                      <SelectItem value="card">Card Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Social Media
                </CardTitle>
                <CardDescription>
                  Connect your social media accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl">Facebook</Label>
                  <Input
                    id="facebookUrl"
                    defaultValue={store?.facebookUrl}
                    placeholder="https://facebook.com/yourstore"
                    onBlur={(e) => handleSaveSettings("social", { facebookUrl: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">Instagram</Label>
                  <Input
                    id="instagramUrl"
                    defaultValue={store?.instagramUrl}
                    placeholder="https://instagram.com/yourstore"
                    onBlur={(e) => handleSaveSettings("social", { instagramUrl: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitterUrl">Twitter</Label>
                  <Input
                    id="twitterUrl"
                    defaultValue={store?.twitterUrl}
                    placeholder="https://twitter.com/yourstore"
                    onBlur={(e) => handleSaveSettings("social", { twitterUrl: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Methods
                </CardTitle>
                <CardDescription>
                  Choose how customers can pay for orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableCOD">Cash on Delivery</Label>
                    <p className="text-sm text-gray-600">Accept cash payments on delivery</p>
                  </div>
                  <Switch
                    id="enableCOD"
                    defaultChecked={store?.enableCOD}
                    onCheckedChange={(checked) => handleSaveSettings("payment", { enableCOD: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableOnlinePayment">Online Payment</Label>
                    <p className="text-sm text-gray-600">Accept credit/debit cards and e-wallets</p>
                  </div>
                  <Switch
                    id="enableOnlinePayment"
                    defaultChecked={store?.enableOnlinePayment}
                    onCheckedChange={(checked) => handleSaveSettings("payment", { enableOnlinePayment: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableWallet">Digital Wallet</Label>
                    <p className="text-sm text-gray-600">Accept GrabPay, Touch 'n Go, etc.</p>
                  </div>
                  <Switch
                    id="enableWallet"
                    defaultChecked={store?.enableWallet}
                    onCheckedChange={(checked) => handleSaveSettings("payment", { enableWallet: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Delivery Settings
                </CardTitle>
                <CardDescription>
                  Configure delivery fees and minimum orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount">Minimum Order Amount</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{store?.currencySymbol}</span>
                    <Input
                      id="minOrderAmount"
                      type="number"
                      step="0.01"
                      defaultValue={store?.minOrderAmount}
                      onBlur={(e) => handleSaveSettings("delivery", { minOrderAmount: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Delivery Fee</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{store?.currencySymbol}</span>
                    <Input
                      id="deliveryFee"
                      type="number"
                      step="0.01"
                      defaultValue={store?.deliveryFee}
                      onBlur={(e) => handleSaveSettings("delivery", { deliveryFee: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{store?.currencySymbol}</span>
                    <Input
                      id="freeDeliveryThreshold"
                      type="number"
                      step="0.01"
                      defaultValue={store?.freeDeliveryThreshold}
                      onBlur={(e) => handleSaveSettings("delivery", { freeDeliveryThreshold: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Store Policies
                </CardTitle>
                <CardDescription>
                  Set up your store's terms and policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="returnPolicy">Return Policy</Label>
                  <Textarea
                    id="returnPolicy"
                    defaultValue={store?.returnPolicy}
                    placeholder="Describe your return policy..."
                    rows={3}
                    onBlur={(e) => handleSaveSettings("policies", { returnPolicy: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                  <Textarea
                    id="shippingPolicy"
                    defaultValue={store?.shippingPolicy}
                    placeholder="Describe your shipping policy..."
                    rows={3}
                    onBlur={(e) => handleSaveSettings("policies", { shippingPolicy: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Operating Hours
                </CardTitle>
                <CardDescription>
                  Set your store's operating hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${day}-enabled`}
                        defaultChecked={!store?.operatingHours?.[day.toLowerCase()]?.closed}
                        onCheckedChange={(checked) => {
                          const hours = { ...store?.operatingHours };
                          hours[day.toLowerCase()] = { 
                            ...hours[day.toLowerCase()], 
                            closed: !checked 
                          };
                          handleSaveSettings("hours", { operatingHours: hours });
                        }}
                      />
                      <Label htmlFor={`${day}-enabled`} className="w-20">{day}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        defaultValue={store?.operatingHours?.[day.toLowerCase()]?.open || "09:00"}
                        className="w-24"
                        disabled={store?.operatingHours?.[day.toLowerCase()]?.closed}
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <Input
                        type="time"
                        defaultValue={store?.operatingHours?.[day.toLowerCase()]?.close || "18:00"}
                        className="w-24"
                        disabled={store?.operatingHours?.[day.toLowerCase()]?.closed}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Optimize your store for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  defaultValue={store?.metaTitle}
                  placeholder="Your Store Name - Best Products Online"
                  onBlur={(e) => handleSaveSettings("seo", { metaTitle: e.target.value })}
                />
                <p className="text-xs text-gray-500">60 characters or less recommended</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  defaultValue={store?.metaDescription}
                  placeholder="Shop the best products at great prices. Fast delivery, quality guaranteed."
                  rows={3}
                  onBlur={(e) => handleSaveSettings("seo", { metaDescription: e.target.value })}
                />
                <p className="text-xs text-gray-500">160 characters or less recommended</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  defaultValue={store?.metaKeywords}
                  placeholder="online store, products, delivery, shopping"
                  onBlur={(e) => handleSaveSettings("seo", { metaKeywords: e.target.value })}
                />
                <p className="text-xs text-gray-500">Separate keywords with commas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}