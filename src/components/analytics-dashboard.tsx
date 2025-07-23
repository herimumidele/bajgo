import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  Clock,
  MapPin,
  Star,
  Activity,
  RefreshCw,
  Download
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface AnalyticsData {
  revenue: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    growth: number;
  };
  customers: {
    total: number;
    active: number;
    new: number;
    retention: number;
  };
  vendors: {
    total: number;
    active: number;
    new: number;
    topPerforming: any[];
  };
  deliveries: {
    total: number;
    onTime: number;
    avgDeliveryTime: number;
    success: number;
  };
  realTimeData: {
    activeUsers: number;
    liveOrders: number;
    avgResponseTime: number;
    serverLoad: number;
  };
  chartData: {
    revenueChart: any[];
    ordersChart: any[];
    userActivityChart: any[];
    deliveryChart: any[];
  };
}

interface AnalyticsDashboardProps {
  userRole: string;
  vendorId?: number;
}

export default function AnalyticsDashboard({ userRole, vendorId }: AnalyticsDashboardProps) {
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ["/api/analytics", userRole, vendorId],
    refetchInterval: isAutoRefresh ? refreshInterval : false,
    staleTime: 10000, // 10 seconds
  });

  const { data: realTimeMetrics } = useQuery({
    queryKey: ["/api/real-time-metrics", userRole, vendorId],
    refetchInterval: 5000, // 5 seconds for real-time data
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // Export analytics data to CSV
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const COLORS = ['#E53E3E', '#FEB2B2', '#FC8181', '#F56565', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Auto-refresh:</span>
            <Button
              variant={isAutoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            >
              {isAutoRefresh ? "ON" : "OFF"}
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Status Bar */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-semibold text-primary">Live Status</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{realTimeMetrics?.activeUsers || 0} Active Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>{realTimeMetrics?.liveOrders || 0} Live Orders</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>{realTimeMetrics?.avgResponseTime || 0}ms Response Time</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{realTimeMetrics?.serverLoad || 0}% Server Load</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {analytics?.revenue?.total?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`inline-flex items-center ${analytics?.revenue?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics?.revenue?.growth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(analytics?.revenue?.growth || 0)}%
              </span>
              {" "}from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.orders?.total?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`inline-flex items-center ${analytics?.orders?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics?.orders?.growth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(analytics?.orders?.growth || 0)}%
              </span>
              {" "}from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.customers?.active?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analytics?.customers?.new || 0}</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Success</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.deliveries?.success || 0}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">{analytics?.deliveries?.avgDeliveryTime || 0}min</span> avg delivery time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics?.chartData?.revenueChart || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#E53E3E" fill="#E53E3E" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Revenue breakdown by source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Food Orders', value: 65 },
                        { name: 'Delivery Fees', value: 25 },
                        { name: 'Subscriptions', value: 10 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Volume</CardTitle>
                <CardDescription>Daily orders over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.chartData?.ordersChart || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#E53E3E" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Current order status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pending</span>
                    <Badge variant="secondary">{analytics?.orders?.pending || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completed</span>
                    <Badge variant="default">{analytics?.orders?.completed || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cancelled</span>
                    <Badge variant="destructive">{analytics?.orders?.cancelled || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Daily active users over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.chartData?.userActivityChart || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activeUsers" fill="#E53E3E" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>Customer engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Retention Rate</span>
                    <span className="text-2xl font-bold">{analytics?.customers?.retention || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">New Customers</span>
                    <span className="text-2xl font-bold">{analytics?.customers?.new || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Customers</span>
                    <span className="text-2xl font-bold">{analytics?.customers?.total || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>Daily delivery metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.chartData?.deliveryChart || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="deliveries" stroke="#E53E3E" strokeWidth={2} />
                    <Line type="monotone" dataKey="onTimeDeliveries" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Stats</CardTitle>
                <CardDescription>Key delivery performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-2xl font-bold text-green-600">{analytics?.deliveries?.success || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">On-time Deliveries</span>
                    <span className="text-2xl font-bold text-blue-600">{analytics?.deliveries?.onTime || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Delivery Time</span>
                    <span className="text-2xl font-bold text-orange-600">{analytics?.deliveries?.avgDeliveryTime || 0}min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Top Performing Vendors (Admin only) */}
      {userRole === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>Best performing vendors by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.vendors?.topPerforming?.map((vendor: any, index: number) => (
                <div key={vendor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{vendor.storeName}</p>
                      <p className="text-sm text-gray-600">{vendor.orderCount} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">RM {vendor.revenue?.toLocaleString()}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{vendor.rating}</span>
                    </div>
                  </div>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}