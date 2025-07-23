import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Store, BarChart3, Package, ShoppingCart, Star, Smartphone } from "lucide-react";
import Navigation from "@/components/navigation";
import VendorStats from "@/components/vendor-stats";
import ProductForm from "@/components/product-form";
import ProductCard from "@/components/product-card";
import OrderList from "@/components/order-list";
import StoreSettings from "@/components/store-settings";
import StoreOnboarding from "@/components/store-onboarding";
import LalamoveIntegration from "@/components/lalamove-integration";
import { useState } from "react";
import { Link } from "wouter";

export default function VendorDashboard() {
  const { user } = useAuth();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorFormData, setVendorFormData] = useState({
    storeName: "",
    description: "",
    address: "",
    phone: "",
  });

  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ["/api/my-vendor"],
    enabled: !!user && user.role === "vendor",
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/vendors", vendor?.id, "products"],
    enabled: !!vendor,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: !!vendor,
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: number) => 
      fetch(`/api/products/${productId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors", vendor?.id, "products"] });
    },
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
      setShowVendorForm(false);
    },
  });

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVendorMutation.mutate(vendorFormData);
  };

  if (!user || user.role !== "vendor") {
    return <div>Access denied</div>;
  }

  if (vendorLoading) {
    return <div>Loading...</div>;
  }

  if (!vendor) {
    return (
      <StoreOnboarding onComplete={() => {
        queryClient.invalidateQueries({ queryKey: ["/api/my-vendor"] });
      }} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto mobile-safe mobile-padding">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {vendor.storeName}
          </h1>
          <p className="text-gray-600">
            Manage your store and track your performance
          </p>
        </div>

        <VendorStats />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Mobile App</h3>
                  <p className="text-sm text-gray-600">Build your own app</p>
                </div>
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <Link href="/vendor-app-builder">
                <Button className="w-full mt-4">
                  Create App
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Web Store</h3>
                  <p className="text-sm text-gray-600">Manage your storefront</p>
                </div>
                <Store className="h-8 w-8 text-primary" />
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  const storeUrl = vendor.storeSlug ? `/storefront/${vendor.storeSlug}` : '#';
                  if (vendor.storeSlug) {
                    window.open(storeUrl, '_blank');
                  }
                }}
              >
                View Store
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Products</h3>
                  <p className="text-sm text-gray-600">{products.length} items</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setShowProductForm(true)}>
                Add Product
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Orders</h3>
                  <p className="text-sm text-gray-600">{orders.length} pending</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Orders
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="mt-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <Button onClick={() => setShowProductForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {showProductForm && (
              <ProductForm 
                onClose={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                vendorId={vendor.id}
                product={editingProduct}
              />
            )}

            {productsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : products.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
                  <p className="text-gray-600 mb-4">Start building your inventory by adding your first product.</p>
                  <Button onClick={() => setShowProductForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <div key={product.id} className="relative">
                    <ProductCard
                      product={product}
                      showActions={false}
                    />
                    <div className="absolute top-2 right-2 flex flex-col space-y-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                        disabled={deleteProductMutation.isPending}
                      >
                        {deleteProductMutation.isPending ? "..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {orders.filter((order: any) => order.status === 'pending').length} pending
                </Badge>
                <Badge variant="outline">
                  {orders.filter((order: any) => order.status === 'processing').length} processing
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  {orders.filter((order: any) => order.status === 'completed').length} completed
                </Badge>
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : orders.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600 mb-4">Orders will appear here once customers start purchasing from your store.</p>
                  <Button variant="outline" onClick={() => {
                    const storeUrl = vendor.storeSlug ? `/storefront/${vendor.storeSlug}` : '#';
                    if (vendor.storeSlug) {
                      window.open(storeUrl, '_blank');
                    }
                  }}>
                    View Your Store
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order #{order.orderNumber || order.id}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.customerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600 text-lg">RM {order.total}</p>
                          <Badge className={`mt-1 ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.replace(/_/g, ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Customer Info</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Name:</strong> {order.customerName}</p>
                            <p><strong>Phone:</strong> {order.customerPhone}</p>
                            <p><strong>Payment:</strong> {order.paymentMethod?.toUpperCase() || 'COD'}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                          <p className="text-sm text-gray-600">
                            {typeof order.deliveryAddress === 'string' ? 
                              order.deliveryAddress : 
                              JSON.stringify(order.deliveryAddress)
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          Last updated: {new Date(order.updatedAt || order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          {order.status === 'pending' && (
                            <Button 
                              size="sm" 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => {
                                // Quick accept functionality could be added here
                              }}
                            >
                              Process Order
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

          <TabsContent value="delivery">
            <LalamoveIntegration vendorId={vendor.id} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">RM 1,250</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">142</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active products
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">
                    Based on 342 reviews
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <StoreSettings vendorId={vendor.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
