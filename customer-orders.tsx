import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, Star } from "lucide-react";
import Navigation from "@/components/navigation";
import { format } from "date-fns";
import OrderStatusTracker from "@/components/order-status-tracker";
import { useLocation } from "wouter";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-green-100 text-green-800",
  delivering: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Package,
  ready: CheckCircle,
  delivering: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function CustomerOrders() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: orders = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Track your orders and view order history</p>
          </div>

          {orders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-4">When you place orders, they'll appear here</p>
                <Button className="bg-red-600 hover:bg-red-700">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => {
                const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] || Clock;
                
                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow border border-gray-200">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            Order {order.orderNumber}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {format(new Date(order.createdAt), "PPP 'at' p")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-red-600">RM {order.total}</p>
                          <Badge className={`mt-1 ${statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {order.status.replace(/_/g, ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="mb-4">
                        <OrderStatusTracker 
                          currentStatus={order.status}
                          createdAt={order.createdAt}
                          estimatedDeliveryTime={order.estimatedDeliveryTime}
                          actualDeliveryTime={order.actualDeliveryTime}
                          size="sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                          <p className="text-sm text-gray-600">
                            {typeof order.deliveryAddress === 'string' ? 
                              order.deliveryAddress : 
                              `${order.customerName}\n${order.customerPhone}\n${order.deliveryAddress}`
                            }
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>RM {order.subtotal || order.total}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Delivery:</span>
                              <span>RM {order.deliveryFee || "0.00"}</span>
                            </div>
                            <Separator className="my-1" />
                            <div className="flex justify-between font-medium">
                              <span>Total:</span>
                              <span>RM {order.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Payment: {order.paymentMethod?.toUpperCase() || 'COD'}</span>
                          <span>•</span>
                          <span>Delivery: {order.deliveryMethod || 'Standard'}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/orders/${order.id}`)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </Button>
                          
                          {order.status === "delivered" && !order.rating && (
                            <Button 
                              size="sm" 
                              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700"
                            >
                              <Star className="w-4 h-4" />
                              <span>Rate Order</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}