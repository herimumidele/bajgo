import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Store, 
  DollarSign, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Settings, 
  CreditCard,
  Percent,
  Truck,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import Navigation from "@/components/navigation";
import LalamoveAdminConfig from "@/components/lalamove-admin-config";
import { useToast } from "@/hooks/use-toast";

interface AdminStats {
  totalVendors: number;
  activeVendors: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  activeCustomers: number;
  commissionEarned: number;
  subscriptionRevenue: number;
}

interface VendorPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  commissionRate: number;
  maxProducts: number;
  maxOrders: number;
  isActive: boolean;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<VendorPlan | null>(null);

  const [planFormData, setPlanFormData] = useState({
    name: "",
    price: 0,
    features: "",
    commissionRate: 5,
    maxProducts: 100,
    maxOrders: 1000,
    isActive: true
  });

  const [globalSettings, setGlobalSettings] = useState({
    defaultCommissionRate: 5,
    minimumOrderValue: 10,
    deliveryRadius: 25,
    lalamoveApiKey: "",
    lalamoveSecret: "",
    supportEmail: "support@bajgo.my",
    supportPhone: "+60123456789",
    maintenanceMode: false
  });

  // Fetch admin stats
  const { data: adminStats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user && user.role === "admin"
  });

  // Fetch all vendors
  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ["/api/admin/vendors"],
    enabled: !!user && user.role === "admin"
  });

  // Fetch subscription plans
  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery<VendorPlan[]>({
    queryKey: ["/api/admin/plans"],
    enabled: !!user && user.role === "admin"
  });

  const createPlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      const response = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData)
      });
      if (!response.ok) throw new Error("Failed to create plan");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/plans"] });
      setShowPlanDialog(false);
      setPlanFormData({
        name: "",
        price: 0,
        features: "",
        commissionRate: 5,
        maxProducts: 100,
        maxOrders: 1000,
        isActive: true
      });
      toast({
        title: "Plan Created",
        description: "New subscription plan has been created successfully."
      });
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Global settings have been updated successfully."
      });
    }
  });

  const suspendVendorMutation = useMutation({
    mutationFn: async (vendorId: number) => {
      const response = await fetch(`/api/admin/vendors/${vendorId}/suspend`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to suspend vendor");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vendors"] });
      toast({
        title: "Vendor Suspended",
        description: "Vendor has been suspended successfully."
      });
    }
  });

  const handleCreatePlan = () => {
    const features = planFormData.features.split('\n').filter(f => f.trim());
    createPlanMutation.mutate({
      ...planFormData,
      features
    });
  };

  const handleUpdateSettings = () => {
    updateSettingsMutation.mutate(globalSettings);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Access denied. Admin privileges required.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage your white-label SaaS platform
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminStats?.totalVendors || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {adminStats?.activeVendors || 0} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">RM {adminStats?.totalRevenue || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +RM {adminStats?.monthlyRevenue || 0} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">RM {adminStats?.commissionEarned || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    From {adminStats?.totalOrders || 0} orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscription Revenue</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">RM {adminStats?.subscriptionRevenue || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Monthly recurring revenue
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">New vendor registration</p>
                      <p className="text-xs text-gray-500">Tech Solutions Store - 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Order completed</p>
                      <p className="text-xs text-gray-500">Order #12345 - RM 150.00 - 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Subscription renewed</p>
                      <p className="text-xs text-gray-500">Premium Plan - RM 99.00 - 1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
                <CardDescription>
                  Manage all vendors on your platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Store Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors?.map((vendor: any) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.storeName}</TableCell>
                        <TableCell>{vendor.user?.username}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Premium</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={vendor.isActive ? "default" : "secondary"}>
                            {vendor.isActive ? "Active" : "Suspended"}
                          </Badge>
                        </TableCell>
                        <TableCell>RM 2,450</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => suspendVendorMutation.mutate(vendor.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Subscription Plans</CardTitle>
                    <CardDescription>
                      Manage subscription plans for vendors
                    </CardDescription>
                  </div>
                  <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Plan</DialogTitle>
                        <DialogDescription>
                          Create a new subscription plan for vendors
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="planName">Plan Name</Label>
                          <Input
                            id="planName"
                            value={planFormData.name}
                            onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})}
                            placeholder="Premium Plan"
                          />
                        </div>
                        <div>
                          <Label htmlFor="planPrice">Monthly Price (RM)</Label>
                          <Input
                            id="planPrice"
                            type="number"
                            value={planFormData.price}
                            onChange={(e) => setPlanFormData({...planFormData, price: Number(e.target.value)})}
                            placeholder="99"
                          />
                        </div>
                        <div>
                          <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                          <Input
                            id="commissionRate"
                            type="number"
                            value={planFormData.commissionRate}
                            onChange={(e) => setPlanFormData({...planFormData, commissionRate: Number(e.target.value)})}
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxProducts">Max Products</Label>
                          <Input
                            id="maxProducts"
                            type="number"
                            value={planFormData.maxProducts}
                            onChange={(e) => setPlanFormData({...planFormData, maxProducts: Number(e.target.value)})}
                            placeholder="100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="features">Features (one per line)</Label>
                          <Textarea
                            id="features"
                            value={planFormData.features}
                            onChange={(e) => setPlanFormData({...planFormData, features: e.target.value})}
                            placeholder="Unlimited products&#10;Custom domain&#10;Advanced analytics"
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreatePlan}>
                            Create Plan
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Starter</CardTitle>
                      <div className="text-3xl font-bold">RM 29</div>
                      <p className="text-sm text-gray-600">per month</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>✓ Up to 50 products</li>
                        <li>✓ Basic analytics</li>
                        <li>✓ Standard support</li>
                        <li>✓ 10% commission</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Professional</CardTitle>
                      <div className="text-3xl font-bold">RM 99</div>
                      <p className="text-sm text-gray-600">per month</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>✓ Up to 500 products</li>
                        <li>✓ Advanced analytics</li>
                        <li>✓ Priority support</li>
                        <li>✓ 7% commission</li>
                        <li>✓ Custom domain</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Enterprise</CardTitle>
                      <div className="text-3xl font-bold">RM 299</div>
                      <p className="text-sm text-gray-600">per month</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>✓ Unlimited products</li>
                        <li>✓ Full analytics suite</li>
                        <li>✓ 24/7 support</li>
                        <li>✓ 5% commission</li>
                        <li>✓ White-label app</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  Monitor all orders across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#12345</TableCell>
                      <TableCell>Tech Store</TableCell>
                      <TableCell>john@example.com</TableCell>
                      <TableCell>RM 150.00</TableCell>
                      <TableCell>RM 7.50</TableCell>
                      <TableCell>
                        <Badge variant="default">Completed</Badge>
                      </TableCell>
                      <TableCell>2024-01-15</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#12346</TableCell>
                      <TableCell>Fashion Hub</TableCell>
                      <TableCell>jane@example.com</TableCell>
                      <TableCell>RM 89.00</TableCell>
                      <TableCell>RM 4.45</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
                      </TableCell>
                      <TableCell>2024-01-15</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">RM 12,450</div>
                  <p className="text-sm text-gray-600">This month</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>5% Commission</span>
                      <span>RM 8,300</span>
                    </div>
                    <div className="flex justify-between">
                      <span>7% Commission</span>
                      <span>RM 3,150</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10% Commission</span>
                      <span>RM 1,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">RM 5,670</div>
                  <p className="text-sm text-gray-600">Monthly recurring</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Starter Plan</span>
                      <span>RM 1,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Plan</span>
                      <span>RM 2,970</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enterprise Plan</span>
                      <span>RM 1,250</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Settings</CardTitle>
                <CardDescription>
                  Configure platform-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Default Commission Rate (%)</Label>
                    <Input
                      type="number"
                      value={globalSettings.defaultCommissionRate}
                      onChange={(e) => setGlobalSettings({...globalSettings, defaultCommissionRate: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Minimum Order Value (RM)</Label>
                    <Input
                      type="number"
                      value={globalSettings.minimumOrderValue}
                      onChange={(e) => setGlobalSettings({...globalSettings, minimumOrderValue: Number(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Support Email</Label>
                    <Input
                      value={globalSettings.supportEmail}
                      onChange={(e) => setGlobalSettings({...globalSettings, supportEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Support Phone</Label>
                    <Input
                      value={globalSettings.supportPhone}
                      onChange={(e) => setGlobalSettings({...globalSettings, supportPhone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Maintenance Mode</h3>
                    <p className="text-sm text-gray-600">Enable maintenance mode for all vendors</p>
                  </div>
                  <Switch
                    checked={globalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGlobalSettings({...globalSettings, maintenanceMode: checked})}
                  />
                </div>
                
                <Button onClick={handleUpdateSettings}>
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <LalamoveAdminConfig />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}