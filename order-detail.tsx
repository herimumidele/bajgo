import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle,
  MapPin,
  Phone,
  Calendar,
  Receipt,
  Download,
  Star
} from "lucide-react";
import LalamoveTracking from "@/components/lalamove-tracking";
import OrderStatusTracker from "@/components/order-status-tracker";
import OrderManagementPanel from "@/components/order-management-panel";

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: order, isLoading } = useQuery<any>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const { data: orderItems = [] } = useQuery<any[]>({
    queryKey: ["/api/orders", orderId, "items"],
    enabled: !!orderId,
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
      case "shipped": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isVendorOrAdmin = user?.role === "vendor" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {order.orderNumber}
                </h1>
                <p className="text-gray-600">
                  Order placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status.replace(/_/g, ' ').toUpperCase()}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderStatusTracker 
                  currentStatus={order.status}
                  createdAt={order.createdAt}
                  estimatedDeliveryTime={order.estimatedDeliveryTime}
                  actualDeliveryTime={order.actualDeliveryTime}
                />
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderItems.length === 0 ? (
                  <p className="text-gray-500">Loading order items...</p>
                ) : (
                  <div className="space-y-4">
                    {orderItems.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">RM {item.price}</p>
                          <p className="text-sm text-gray-600">
                            Total: RM {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Delivery Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                    <p className="text-gray-600">
                      {typeof order.deliveryAddress === 'string' ? 
                        order.deliveryAddress : 
                        JSON.stringify(order.deliveryAddress)
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Name:</span> {order.customerName}</p>
                      <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lalamove Tracking */}
            {order.deliveryMethod === "lalamove" && order.lalamoveOrderId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Live Delivery Tracking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LalamoveTracking 
                    orderId={order.id} 
                    lalamoveOrderId={order.lalamoveOrderId} 
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="h-5 w-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>RM {(parseFloat(order.total) - parseFloat(order.deliveryFee || "0")).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>RM {order.deliveryFee || "0.00"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-red-600">RM {order.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment & Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle>Payment & Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Payment Method:</span>
                    <p className="capitalize">{order.paymentMethod || "COD"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Payment Status:</span>
                    <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                      {order.paymentStatus || "Pending"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Delivery Method:</span>
                    <p className="capitalize">{order.deliveryMethod || "Standard"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Order Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Order Placed:</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  {order.status !== "pending" && (
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span>{new Date(order.updatedAt).toLocaleString()}</span>
                    </div>
                  )}
                  {order.estimatedDeliveryTime && (
                    <div className="flex justify-between">
                      <span>Estimated Delivery:</span>
                      <span>{new Date(order.estimatedDeliveryTime).toLocaleString()}</span>
                    </div>
                  )}
                  {order.actualDeliveryTime && (
                    <div className="flex justify-between">
                      <span>Delivered At:</span>
                      <span>{new Date(order.actualDeliveryTime).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Actions */}
            {user?.role === "customer" && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.status === "delivered" && !order.rating && (
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Star className="h-4 w-4 mr-2" />
                      Rate This Order
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Vendor
                  </Button>
                  
                  {order.status === "pending" && (
                    <Button variant="destructive" className="w-full">
                      Cancel Order
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Vendor Management Panel */}
            {isVendorOrAdmin && (
              <OrderManagementPanel 
                order={order} 
                userRole={user?.role as "vendor" | "admin"} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}