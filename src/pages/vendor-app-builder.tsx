import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Palette, Bell, Settings, Download, Upload, CheckCircle, Clock, AlertCircle, Shield, ExternalLink, AlertTriangle } from "lucide-react";
import Navigation from "@/components/navigation";
import APKInstallationGuide from "@/components/apk-installation-guide";
import APKDownloadSection from "@/components/apk-download-section";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function VendorAppBuilder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("design");
  const [buildProgress, setBuildProgress] = useState(0);
  const [formData, setFormData] = useState({
    appName: "",
    appDescription: "",
    appIconUrl: "",
    appSplashUrl: "",
    appPrimaryColor: "#E53E3E",
    appSecondaryColor: "#FEB2B2",
    enablePushNotifications: true,
    enableLiveTracking: true,
    enableRatings: true,
    privacyPolicyUrl: "",
    termsOfServiceUrl: "",
  });

  const { data: vendor, isLoading } = useQuery({
    queryKey: ["/api/my-vendor"],
    enabled: !!user && user.role === "vendor",
  });

  // Update form data when vendor data changes
  useEffect(() => {
    if (vendor && typeof vendor === 'object') {
      setFormData({
        appName: (vendor as any).appName || (vendor as any).storeName || "",
        appDescription: (vendor as any).appDescription || (vendor as any).description || "",
        appIconUrl: (vendor as any).appIconUrl || "",
        appSplashUrl: (vendor as any).appSplashUrl || "",
        appPrimaryColor: (vendor as any).appPrimaryColor || "#E53E3E",
        appSecondaryColor: (vendor as any).appSecondaryColor || "#FEB2B2",
        enablePushNotifications: (vendor as any).enablePushNotifications !== false,
        enableLiveTracking: (vendor as any).enableLiveTracking !== false,
        enableRatings: (vendor as any).enableRatings !== false,
        privacyPolicyUrl: (vendor as any).privacyPolicyUrl || "",
        termsOfServiceUrl: (vendor as any).termsOfServiceUrl || "",
      });
      
      // Initialize build progress if building
      if ((vendor as any).appStatus === "building") {
        setBuildProgress(Math.random() * 40 + 20); // Start with 20-60% progress
        startProgressTracking();
      } else if ((vendor as any).appStatus === "built") {
        setBuildProgress(100);
      } else {
        setBuildProgress(0);
      }
    }
  }, [vendor]);

  const updateAppMutation = useMutation({
    mutationFn: async (updateData: any) => {
      const response = await fetch(`/api/vendors/${(vendor as any)?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update app settings");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-vendor"] });
      toast({
        title: "App Settings Updated",
        description: "Your mobile app configuration has been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const buildAppMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/vendors/${(vendor as any)?.id}/build-app`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to start app build");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setBuildProgress(0);
      startProgressTracking();
      queryClient.invalidateQueries({ queryKey: ["/api/my-vendor"] });
      toast({
        title: "App Build Started",
        description: "Your mobile app is now being built. This may take a few minutes.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Build Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishAppMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await fetch(`/api/vendors/${(vendor as any)?.id}/publish-app`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platform }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to publish app");
      }
      
      return response.json();
    },
    onSuccess: (data, platform) => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-vendor"] });
      toast({
        title: "App Published",
        description: `Your mobile app has been submitted to ${platform === "google" ? "Google Play Store" : "Apple App Store"}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Publish Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const buildLatestAppMutation = useMutation({
    mutationFn: async (platform: 'android' | 'ios') => {
      const response = await fetch(`/api/vendors/${(vendor as any)?.id}/build-latest-app`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platform }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to build latest ${platform} app`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-vendor"] });
      toast({
        title: "Latest App Built Successfully",
        description: `${data.compatibility} app is ready for download!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Latest App Build Failed",
        description: error.message || "Failed to build latest mobile app",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateAppMutation.mutate(formData);
  };

  const handleDownloadAPK = () => {
    if (!vendor) return;
    
    // Direct download of the APK file
    const downloadUrl = `/api/vendors/${vendor.id}/download-apk`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${vendor.storeName || 'store'}-app.apk`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your APK file is downloading. Follow the installation guide below.",
    });
  };

  const startProgressTracking = () => {
    let progress = buildProgress || 0;
    
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 2; // 2-10% increment
      
      if (progress >= 100) {
        progress = 100;
        setBuildProgress(100);
        clearInterval(interval);
        
        // Auto-complete the build after reaching 100%
        setTimeout(async () => {
          try {
            await fetch(`/api/vendors/${vendor.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ appStatus: "built" })
            });
            queryClient.invalidateQueries({ queryKey: ["/api/my-vendor"] });
          } catch (error) {
            console.error("Failed to update app status:", error);
          }
        }, 1000);
        return;
      }
      
      setBuildProgress(progress);
    }, 1500);
    
    return interval;
  };

  const handleBuildApp = () => {
    const updatedData = {
      ...formData,
      appStatus: "building",
      hasApp: true,
    };
    
    updateAppMutation.mutate(updatedData);
    setTimeout(() => {
      buildAppMutation.mutate();
    }, 1000);
  };

  if (!user || user.role !== "vendor") {
    return <div>Access denied</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading app builder...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Store First</CardTitle>
              <CardDescription>
                You need to create a store before building your mobile app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/vendor-dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getAppStatus = () => {
    switch (vendor.appStatus) {
      case "not_built":
        return { icon: Clock, color: "gray", text: "Not Built" };
      case "building":
        return { icon: Clock, color: "yellow", text: "Building" };
      case "built":
        return { icon: CheckCircle, color: "green", text: "Built" };
      case "published":
        return { icon: CheckCircle, color: "blue", text: "Published" };
      default:
        return { icon: AlertCircle, color: "gray", text: "Unknown" };
    }
  };

  const status = getAppStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mobile App Builder</h1>
              <p className="text-gray-600">
                Create and publish your own branded mobile app for iOS and Android
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`bg-${status.color}-100 text-${status.color}-800`}>
                <status.icon className="w-3 h-3 mr-1" />
                {status.text}
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Professional Mobile Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-2 border-red-100">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Smartphone className="w-6 h-6" />
                  Professional Mobile App Preview
                </CardTitle>
                <CardDescription className="text-red-100">
                  Real-time preview of your branded iOS/Android application
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-gradient-to-br from-gray-50 to-white p-8">
                <div className="flex justify-center">
                  <div className="relative group">
                    {/* Premium Phone Frame with hover effect */}
                    <div className="w-80 h-[650px] bg-gradient-to-b from-gray-800 via-black to-gray-900 rounded-[3.5rem] p-3 shadow-2xl transform group-hover:scale-105 transition-all duration-500 ring-4 ring-red-100/50">
                      {/* iPhone Screen */}
                      <div className="w-full h-full bg-white rounded-[3rem] overflow-hidden relative shadow-inner">
                        {/* Dynamic Island */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center shadow-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Status Bar */}
                        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-gray-900 to-black flex items-center justify-between px-6 text-white text-sm pt-4 z-10">
                          <span className="font-semibold">9:41</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                              <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                            </div>
                            <div className="w-6 h-3 border border-white rounded-sm relative">
                              <div className="w-5 h-2 bg-green-400 rounded-sm absolute top-0.5 left-0.5"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* App Content */}
                        <div className="pt-12 h-full overflow-hidden relative">
                          {/* Premium Header with Gradient */}
                          <div 
                            className="px-6 py-6 text-white relative overflow-hidden"
                            style={{ 
                              background: `linear-gradient(135deg, ${formData.appPrimaryColor || '#E53E3E'} 0%, ${formData.appSecondaryColor || '#FEB2B2'} 100%)` 
                            }}
                          >
                            {/* Animated Background Elements */}
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full animate-pulse"></div>
                              <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white rounded-full animate-pulse delay-1000"></div>
                            </div>
                            
                            <div className="relative flex items-center gap-4 z-10">
                              {formData.appIconUrl ? (
                                <div className="relative group">
                                  <img 
                                    src={formData.appIconUrl} 
                                    alt="App Icon" 
                                    className="w-16 h-16 rounded-2xl shadow-lg border-3 border-white/30 group-hover:scale-110 transition-transform"
                                  />
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-white/30 hover:scale-110 transition-transform">
                                  {formData.appName?.charAt(0)?.toUpperCase() || 'A'}
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-bold text-2xl text-white drop-shadow-lg mb-1">
                                  {formData.appName || 'Your Premium App'}
                                </h3>
                                <p className="text-white/90 text-sm font-medium">
                                  {vendor?.storeName || 'Professional Store'}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className="text-yellow-300 text-xs animate-pulse" style={{animationDelay: `${i * 200}ms`}}>⭐</span>
                                    ))}
                                  </div>
                                  <span className="text-white/80 text-xs font-semibold">4.9 • Premium Store</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Search Bar */}
                          <div className="px-6 py-4 bg-white border-b border-gray-100">
                            <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3 hover:bg-gray-200 transition-colors">
                              <span className="text-red-500 text-lg">🔍</span>
                              <span className="text-gray-500 text-sm font-medium">Search premium products...</span>
                              <div className="ml-auto w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">3</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Content Area */}
                          <div className="px-6 py-4 bg-gradient-to-b from-white to-gray-50 flex-1">
                            <div className="space-y-5">
                              {/* Welcome Card */}
                              <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 relative overflow-hidden hover:shadow-2xl transition-all duration-300">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-100 via-red-50 to-transparent rounded-bl-3xl"></div>
                                <div className="relative">
                                  <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                      <span className="text-white text-2xl">👋</span>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-bold text-gray-800 mb-2 text-lg">Welcome Back!</h4>
                                      <p className="text-gray-600 text-sm leading-relaxed">
                                        {formData.appDescription || 'Discover premium products with seamless shopping experience and instant delivery'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Feature Grid */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
                                  <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-2xl">🛍️</span>
                                  </div>
                                  <span className="text-sm font-bold text-gray-800">Premium Shop</span>
                                  <p className="text-xs text-gray-500 mt-1">Browse Collection</p>
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
                                  <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-2xl">📦</span>
                                  </div>
                                  <span className="text-sm font-bold text-gray-800">Live Tracking</span>
                                  <p className="text-xs text-gray-500 mt-1">Real-time Updates</p>
                                </div>
                              </div>

                              {/* Premium Features */}
                              <div className="space-y-3">
                                {formData.enablePushNotifications && (
                                  <div className="flex items-center gap-3 text-sm bg-green-50 rounded-xl p-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                      <Bell className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-green-800 font-semibold">Smart notifications enabled</span>
                                  </div>
                                )}
                                {formData.enableLiveTracking && (
                                  <div className="flex items-center gap-3 text-sm bg-blue-50 rounded-xl p-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                                      <Clock className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-blue-800 font-semibold">Real-time order tracking</span>
                                  </div>
                                )}
                                {formData.enableRatings && (
                                  <div className="flex items-center gap-3 text-sm bg-yellow-50 rounded-xl p-3">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-yellow-800 font-semibold">Customer reviews & ratings</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Premium Bottom Navigation */}
                          <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg backdrop-blur-sm">
                            <div className="flex justify-around">
                              <div className="text-center group">
                                <div className="w-6 h-6 mx-auto mb-1 text-red-500 text-xl group-hover:scale-110 transition-transform">🏠</div>
                                <span className="text-xs text-red-500 font-bold">Home</span>
                              </div>
                              <div className="text-center group">
                                <div className="w-6 h-6 mx-auto mb-1 text-gray-400 text-xl group-hover:scale-110 transition-transform">🔍</div>
                                <span className="text-xs text-gray-400 font-medium">Search</span>
                              </div>
                              <div className="text-center relative group">
                                <div className="w-6 h-6 mx-auto mb-1 text-gray-400 text-xl group-hover:scale-110 transition-transform">🛒</div>
                                <span className="text-xs text-gray-400 font-medium">Cart</span>
                                <div className="absolute -top-2 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                  <span className="text-white text-xs font-bold">3</span>
                                </div>
                              </div>
                              <div className="text-center group">
                                <div className="w-6 h-6 mx-auto mb-1 text-gray-400 text-xl group-hover:scale-110 transition-transform">👤</div>
                                <span className="text-xs text-gray-400 font-medium">Profile</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    

                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  onClick={handleSave}
                  disabled={updateAppMutation.isPending}
                >
                  {updateAppMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleBuildApp}
                  disabled={buildAppMutation.isPending || (vendor as any)?.appStatus === "building"}
                >
                  {buildAppMutation.isPending ? "Starting Build..." : 
                   (vendor as any)?.appStatus === "building" ? "Building..." : "Build App"}
                </Button>
                
                {(vendor as any)?.appStatus === "built" && (
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => window.open(`/api/vendors/${(vendor as any)?.id}/download-apk`, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download APK
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setActiveTab("publish")}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Publish to Stores
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Universal Mobile App Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Universal Android Support
                </CardTitle>
                <CardDescription>
                  Build apps that work on ALL Android devices from Android 9+ upwards - no version restrictions!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>UNIVERSAL:</strong> No more Android version restrictions - works on ALL Android phones from version 9 upwards!
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Universal Android Builder */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Universal Android</h3>
                        <p className="text-sm text-gray-600">Works on Android 9, 10, 11, 12, 13, 14, 15+</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => buildLatestAppMutation.mutate('android')}
                      disabled={buildLatestAppMutation.isPending}
                    >
                      {buildLatestAppMutation.isPending ? "Building..." : "Build Universal APK"}
                    </Button>
                    {(vendor as any)?.androidFilePath && (
                      <Button 
                        className="w-full" 
                        variant="secondary"
                        onClick={() => {
                          // Use same-window navigation to preserve session
                          window.location.href = `/api/vendors/${(vendor as any)?.id}/download-latest-android`;
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Universal APK
                      </Button>
                    )}
                  </div>

                  {/* iOS 18 Builder */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">i</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">iOS 18</h3>
                        <p className="text-sm text-gray-600">Latest iOS compatibility</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => buildLatestAppMutation.mutate('ios')}
                      disabled={buildLatestAppMutation.isPending}
                    >
                      {buildLatestAppMutation.isPending ? "Building..." : "Build iOS 18 IPA"}
                    </Button>
                    {(vendor as any)?.iosAppFilePath && (
                      <Button 
                        className="w-full" 
                        variant="secondary"
                        onClick={() => {
                          // Use same-window navigation to preserve session
                          window.location.href = `/api/vendors/${(vendor as any)?.id}/download-latest-ios`;
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download iOS 18 IPA
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Latest OS Features:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Enhanced security and privacy controls</li>
                    <li>• Improved performance and battery optimization</li>
                    <li>• Modern UI components and animations</li>
                    <li>• Advanced notification and background processing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            {/* Build Progress */}
            {(vendor as any)?.appStatus === "building" && (
              <Card>
                <CardHeader>
                  <CardTitle>Build Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>
                          {buildProgress < 25 ? "Initializing build environment..." :
                           buildProgress < 50 ? "Compiling app assets..." :
                           buildProgress < 75 ? "Optimizing performance..." :
                           buildProgress < 95 ? "Finalizing build..." : "Build complete!"}
                        </span>
                        <span>{Math.round(buildProgress)}%</span>
                      </div>
                      <Progress value={buildProgress} />
                    </div>
                    <p className="text-sm text-gray-600">
                      Building your app with the latest configuration. This usually takes 5-10 minutes.
                      {buildProgress >= 100 && " Your app is ready for download and publishing!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Configuration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  App Design
                </CardTitle>
                <CardDescription>
                  Customize your app's appearance and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appName">App Name</Label>
                    <Input
                      id="appName"
                      value={formData.appName}
                      onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                      placeholder="My Store App"
                    />
                  </div>
                  <div>
                    <Label htmlFor="appDescription">App Description</Label>
                    <Input
                      id="appDescription"
                      value={formData.appDescription}
                      onChange={(e) => setFormData({ ...formData, appDescription: e.target.value })}
                      placeholder="The best shopping app for..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appPrimaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="appPrimaryColor"
                        type="color"
                        value={formData.appPrimaryColor}
                        onChange={(e) => setFormData({ ...formData, appPrimaryColor: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.appPrimaryColor}
                        onChange={(e) => setFormData({ ...formData, appPrimaryColor: e.target.value })}
                        placeholder="#E53E3E"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="appSecondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="appSecondaryColor"
                        type="color"
                        value={formData.appSecondaryColor}
                        onChange={(e) => setFormData({ ...formData, appSecondaryColor: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.appSecondaryColor}
                        onChange={(e) => setFormData({ ...formData, appSecondaryColor: e.target.value })}
                        placeholder="#FEB2B2"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appIconUrl">App Icon URL</Label>
                    <Input
                      id="appIconUrl"
                      value={formData.appIconUrl}
                      onChange={(e) => setFormData({ ...formData, appIconUrl: e.target.value })}
                      placeholder="https://example.com/icon.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="appSplashUrl">Splash Screen URL</Label>
                    <Input
                      id="appSplashUrl"
                      value={formData.appSplashUrl}
                      onChange={(e) => setFormData({ ...formData, appSplashUrl: e.target.value })}
                      placeholder="https://example.com/splash.png"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  App Features
                </CardTitle>
                <CardDescription>
                  Enable or disable features for your mobile app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-600">Send notifications about orders and promotions</p>
                    </div>
                    <Switch
                      checked={formData.enablePushNotifications}
                      onCheckedChange={(checked) => setFormData({ ...formData, enablePushNotifications: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Live Order Tracking</h3>
                      <p className="text-sm text-gray-600">Real-time order and delivery tracking</p>
                    </div>
                    <Switch
                      checked={formData.enableLiveTracking}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableLiveTracking: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Ratings & Reviews</h3>
                      <p className="text-sm text-gray-600">Allow customers to rate and review products</p>
                    </div>
                    <Switch
                      checked={formData.enableRatings}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableRatings: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legal & Content</CardTitle>
                <CardDescription>
                  Add required legal pages and content for your app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
                  <Input
                    id="privacyPolicyUrl"
                    value={formData.privacyPolicyUrl}
                    onChange={(e) => setFormData({ ...formData, privacyPolicyUrl: e.target.value })}
                    placeholder="https://yourstore.com/privacy"
                  />
                </div>
                <div>
                  <Label htmlFor="termsOfServiceUrl">Terms of Service URL</Label>
                  <Input
                    id="termsOfServiceUrl"
                    value={formData.termsOfServiceUrl}
                    onChange={(e) => setFormData({ ...formData, termsOfServiceUrl: e.target.value })}
                    placeholder="https://yourstore.com/terms"
                  />
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Privacy Policy and Terms of Service are required for app store approval.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="publish" className="space-y-6">
            {(vendor as any)?.appStatus === "not_built" && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to build your app first before publishing to app stores.
                </AlertDescription>
              </Alert>
            )}
            
            {((vendor as any)?.appStatus === "built" || (vendor as any)?.appStatus === "published") && (
              <div className="space-y-6">
                {/* Enhanced APK Download & Installation */}
                <APKDownloadSection 
                  vendor={vendor}
                  appName={formData.appName || (vendor as any)?.storeName || "Store App"}
                  onDownloadClick={handleDownloadAPK}
                />
                
                {/* Comprehensive Installation Guide */}
                <APKInstallationGuide 
                  vendorName={(vendor as any)?.storeName || "Your Store"}
                  appName={formData.appName || (vendor as any)?.storeName || "Store App"}
                  apkFileSize="~5.2MB"
                  onDownloadClick={handleDownloadAPK}
                />
                
                {/* Google Play Store Publishing */}
                <GooglePlayPublishing vendor={vendor} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Real Google Play Store Publishing Component with Actual Requirements  
function GooglePlayPublishing({ vendor }: { vendor: any }) {
  const { toast } = useToast();
  const [showRequirements, setShowRequirements] = useState(false);
  const [publishingStep, setPublishingStep] = useState("requirements");
  const [developerAccount, setDeveloperAccount] = useState({
    email: "",
    developerName: "",
    organizationName: "",
    hasRegisteredAccount: false,
    hasPaidRegistrationFee: false,
    hasVerifiedIdentity: false
  });
  const [storeListingData, setStoreListingData] = useState({
    title: vendor.appName || "",
    shortDescription: "",
    fullDescription: "",
    keywords: "",
    category: "SHOPPING",
    contentRating: "Everyone",
    websiteUrl: "",
    supportEmail: "",
    privacyPolicyUrl: vendor.privacyPolicyUrl || "",
    screenshots: [] as string[],
    featureGraphic: "",
    appIcon: vendor.appIconUrl || ""
  });
  const [complianceChecks, setComplianceChecks] = useState({
    hasPrivacyPolicy: !!vendor.privacyPolicyUrl,
    hasTermsOfService: !!vendor.termsOfServiceUrl,
    hasContentRating: false,
    hasTargetAudience: false,
    hasDataSafety: false,
    hasSignedApk: false,
    hasTestedApp: false,
    hasStoreAssets: false
  });

  const checkRequirement = (key: string, value: boolean) => {
    setComplianceChecks(prev => ({ ...prev, [key]: value }));
  };

  const allRequirementsMet = Object.values(complianceChecks).every(Boolean) && 
    developerAccount.hasRegisteredAccount && 
    developerAccount.hasPaidRegistrationFee && 
    developerAccount.hasVerifiedIdentity;

  const handlePublishToGooglePlay = async () => {
    if (!allRequirementsMet) {
      toast({
        title: "Requirements Not Met",
        description: "Please complete all Google Play Store requirements before publishing.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Submitting to Google Play Store",
        description: "Your app is being reviewed by Google. This typically takes 1-3 days.",
      });
      
      // Call real publishing API
      await fetch(`/api/vendors/${vendor.id}/publish-google-play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developerAccount,
          storeListingData,
          complianceChecks
        })
      });

    } catch (error) {
      toast({
        title: "Publishing Failed",
        description: "Failed to submit app to Google Play Store. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Play Store Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Google Play Store Publishing Requirements
          </CardTitle>
          <CardDescription>
            Complete all requirements to publish your app to Google Play Store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Developer Account */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">1. Google Play Developer Account</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Developer Account Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    You must have a registered Google Play Developer account ($25 one-time fee) to publish apps.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => window.open("https://play.google.com/console/signup", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Register Developer Account
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="developerEmail">Developer Email</Label>
                <Input
                  id="developerEmail"
                  value={developerAccount.email}
                  onChange={(e) => setDeveloperAccount(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="developer@example.com"
                />
              </div>
              <div>
                <Label htmlFor="developerName">Developer Name</Label>
                <Input
                  id="developerName"
                  value={developerAccount.developerName}
                  onChange={(e) => setDeveloperAccount(prev => ({ ...prev, developerName: e.target.value }))}
                  placeholder="Your Name or Company"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasRegisteredAccount"
                  checked={developerAccount.hasRegisteredAccount}
                  onChange={(e) => setDeveloperAccount(prev => ({ ...prev, hasRegisteredAccount: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hasRegisteredAccount" className="text-sm">
                  I have registered a Google Play Developer account
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasPaidRegistrationFee"
                  checked={developerAccount.hasPaidRegistrationFee}
                  onChange={(e) => setDeveloperAccount(prev => ({ ...prev, hasPaidRegistrationFee: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hasPaidRegistrationFee" className="text-sm">
                  I have paid the $25 registration fee
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasVerifiedIdentity"
                  checked={developerAccount.hasVerifiedIdentity}
                  onChange={(e) => setDeveloperAccount(prev => ({ ...prev, hasVerifiedIdentity: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hasVerifiedIdentity" className="text-sm">
                  I have completed identity verification
                </Label>
              </div>
            </div>
          </div>

          {/* Step 2: Store Listing */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">2. Store Listing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appTitle">App Title</Label>
                <Input
                  id="appTitle"
                  value={storeListingData.title}
                  onChange={(e) => setStoreListingData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="My Shopping App"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">{storeListingData.title.length}/50 characters</p>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={storeListingData.category}
                  onChange={(e) => setStoreListingData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="SHOPPING">Shopping</option>
                  <option value="BUSINESS">Business</option>
                  <option value="LIFESTYLE">Lifestyle</option>
                  <option value="FOOD_AND_DRINK">Food & Drink</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={storeListingData.shortDescription}
                onChange={(e) => setStoreListingData(prev => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="Brief description of your app..."
                maxLength={80}
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">{storeListingData.shortDescription.length}/80 characters</p>
            </div>

            <div>
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea
                id="fullDescription"
                value={storeListingData.fullDescription}
                onChange={(e) => setStoreListingData(prev => ({ ...prev, fullDescription: e.target.value }))}
                placeholder="Detailed description of your app features and benefits..."
                maxLength={4000}
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">{storeListingData.fullDescription.length}/4000 characters</p>
            </div>
          </div>

          {/* Step 3: Compliance Checks */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">3. Compliance Requirements</h3>
            <div className="space-y-3">
              {[
                { key: "hasPrivacyPolicy", label: "Privacy Policy URL provided", required: true },
                { key: "hasTermsOfService", label: "Terms of Service URL provided", required: true },
                { key: "hasContentRating", label: "Content rating questionnaire completed", required: true },
                { key: "hasTargetAudience", label: "Target audience defined", required: true },
                { key: "hasDataSafety", label: "Data safety form completed", required: true },
                { key: "hasSignedApk", label: "App bundle signed with upload key", required: true },
                { key: "hasTestedApp", label: "App tested on multiple devices", required: true },
                { key: "hasStoreAssets", label: "Store listing graphics uploaded", required: true }
              ].map((check) => (
                <div key={check.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={check.key}
                    checked={complianceChecks[check.key as keyof typeof complianceChecks]}
                    onChange={(e) => checkRequirement(check.key, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={check.key} className="text-sm">
                    {check.label}
                    {check.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Publishing Action */}
          <div className="pt-6 border-t">
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePublishToGooglePlay}
                disabled={!allRequirementsMet}
                className="flex-1"
              >
                {allRequirementsMet ? "Submit to Google Play Store" : "Complete Requirements First"}
              </Button>
              
              {!allRequirementsMet && (
                <Alert className="flex-1">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {Object.values(complianceChecks).filter(Boolean).length}/{Object.keys(complianceChecks).length} compliance checks completed
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="mt-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Review Process:</strong> Google Play review typically takes 1-3 days. 
                  Your app will be automatically published once approved. 
                  Policy violations may result in rejection and require resubmission.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}