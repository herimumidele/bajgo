import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  Receipt,
  MapPin,
  Phone,
  Calendar,
  Filter
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"products" | "vendors">("products");

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ["/api/search", searchType, searchTerm],
    enabled: !!searchTerm && searchTerm.length > 2,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-purple-100 text-purple-800";
      case "shipped": return "bg-indigo-100 text-indigo-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "confirmed": return <CheckCircle className="h-4 w-4" />;
      case "processing": return <Package className="h-4 w-4" />;
      case "shipped": return <Package className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.username}!</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Products & Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder={`Search ${searchType}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={searchType === "products" ? "default" : "outline"}
                  onClick={() => setSearchType("products")}
                >
                  Products
                </Button>
                <Button
                  variant={searchType === "vendors" ? "default" : "outline"}
                  onClick={() => setSearchType("vendors")}
                >
                  Vendors
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {searchTerm && searchTerm.length > 2 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Search Results</h3>
                {searchLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-gray-500">No results found for "{searchTerm}"</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((result: any) => (
                      <Card key={result.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <img
                              src={result.thumbnail || result.logo || "/api/placeholder/60/60"}
                              alt={result.name || result.storeName}
                              className="w-15 h-15 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{result.name || result.storeName}</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {result.description}
                              </p>
                              {result.price && (
                                <p className="text-sm font-semibold text-red-600 mt-1">
                                  RM{result.price}
                                </p>
                              )}
                              <Button
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  if (searchType === "products") {
                                    setLocation(`/product/${result.id}`);
                                  } else {
                                    setLocation(`/store/${result.slug}`);
                                  }
                                }}
                              >
                                View {searchType === "products" ? "Product" : "Store"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="recent">Recent Orders</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* All Orders */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Orders</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                  <Button onClick={() => setLocation("/")}>Start Shopping</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Package className="h-4 w-4 mr-2" />
                              RM{parseFloat(order.totalAmount).toFixed(2)}
                            </div>
                            {order.deliveryMethod && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {order.deliveryMethod.replace('_', ' ')}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/customer/orders/${order.id}`)}
                          >
                            <Receipt className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {order.status === "delivered" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLocation(`/customer/orders/${order.id}/receipt`)}
                            >
                              <Receipt className="h-4 w-4 mr-2" />
                              Receipt
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Recent Orders */}
          <TabsContent value="recent" className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()} • RM{parseFloat(order.totalAmount).toFixed(2)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Delivered Orders */}
          <TabsContent value="delivered" className="space-y-4">
            <h2 className="text-xl font-semibold">Delivered Orders</h2>
            <div className="space-y-4">
              {orders.filter((order: any) => order.status === "delivered").map((order: any) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">
                          Delivered on {new Date(order.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLocation(`/customer/orders/${order.id}/receipt`)}
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLocation(`/customer/orders/${order.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <p className="text-gray-600">{user?.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-gray-600">{user?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <p className="text-gray-600">{user?.address || "Not provided"}</p>
                  </div>
                </div>
                <Button className="mt-4">Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}