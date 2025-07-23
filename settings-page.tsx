import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/navigation";
import { Settings, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      orderUpdates: true,
      promotions: false,
      weeklyReport: true,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
      allowMessages: true,
    },
    appearance: {
      theme: "light",
      language: "en",
      currency: "MYR",
      timezone: "Asia/Kuala_Lumpur",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      loginAlerts: true,
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: typeof settings) => {
      const res = await apiRequest("PUT", "/api/user/settings", settings);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your settings have been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive browser push notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="order-updates">Order Updates</Label>
                    <p className="text-sm text-gray-600">Get notified about order status changes</p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={settings.notifications.orderUpdates}
                    onCheckedChange={(checked) => updateSetting('notifications', 'orderUpdates', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="promotions">Promotions & Marketing</Label>
                    <p className="text-sm text-gray-600">Receive promotional emails and offers</p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={settings.notifications.promotions}
                    onCheckedChange={(checked) => updateSetting('notifications', 'promotions', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-report">Weekly Report</Label>
                    <p className="text-sm text-gray-600">Get weekly summary of your activity</p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={settings.notifications.weeklyReport}
                    onCheckedChange={(checked) => updateSetting('notifications', 'weeklyReport', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <p className="text-sm text-gray-600 mb-2">Control who can see your profile</p>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="private">Private - Only you can see</SelectItem>
                      <SelectItem value="contacts">Contacts only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-email">Show Email Address</Label>
                    <p className="text-sm text-gray-600">Display your email on your profile</p>
                  </div>
                  <Switch
                    id="show-email"
                    checked={settings.privacy.showEmail}
                    onCheckedChange={(checked) => updateSetting('privacy', 'showEmail', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-phone">Show Phone Number</Label>
                    <p className="text-sm text-gray-600">Display your phone number on your profile</p>
                  </div>
                  <Switch
                    id="show-phone"
                    checked={settings.privacy.showPhone}
                    onCheckedChange={(checked) => updateSetting('privacy', 'showPhone', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow-messages">Allow Messages</Label>
                    <p className="text-sm text-gray-600">Allow other users to send you messages</p>
                  </div>
                  <Switch
                    id="allow-messages"
                    checked={settings.privacy.allowMessages}
                    onCheckedChange={(checked) => updateSetting('privacy', 'allowMessages', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Appearance & Localization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-gray-600 mb-2">Choose your preferred theme</p>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) => updateSetting('appearance', 'theme', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <p className="text-sm text-gray-600 mb-2">Select your preferred language</p>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) => updateSetting('appearance', 'language', value)}
                  >
                    <SelectTrigger className="w-full">
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

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <p className="text-sm text-gray-600 mb-2">Default currency for prices</p>
                  <Select
                    value={settings.appearance.currency}
                    onValueChange={(value) => updateSetting('appearance', 'currency', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MYR">Malaysian Ringgit (RM)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="SGD">Singapore Dollar (S$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <p className="text-sm text-gray-600 mb-2">Your local timezone</p>
                  <Select
                    value={settings.appearance.timezone}
                    onValueChange={(value) => updateSetting('appearance', 'timezone', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur</SelectItem>
                      <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
                      <SelectItem value="Asia/Bangkok">Asia/Bangkok</SelectItem>
                      <SelectItem value="Asia/Jakarta">Asia/Jakarta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <p className="text-sm text-gray-600 mb-2">Automatically log out after inactivity</p>
                  <Select
                    value={settings.security.sessionTimeout}
                    onValueChange={(value) => updateSetting('security', 'sessionTimeout', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-alerts">Login Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    id="login-alerts"
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) => updateSetting('security', 'loginAlerts', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Password & Authentication</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline">Change Password</Button>
                    <Button variant="outline">View Active Sessions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSave} 
            className="px-8 bg-red-500 hover:bg-red-600 text-white"
            disabled={updateSettingsMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettingsMutation.isPending ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}