import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  XCircle,
  Phone,
  MessageSquare,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface OrderManagementPanelProps {
  order: any;
  userRole: "vendor" | "admin";
}

const statusOptions = [
  { value: "pending", label: "Pending", icon: Clock, color: "yellow" },
  { value: "confirmed", label: "Confirmed", icon: CheckCircle, color: "blue" },
  { value: "preparing", label: "Preparing", icon: Package, color: "purple" },
  { value: "ready_for_pickup", label: "Ready for Pickup", icon: CheckCircle, color: "green" },
  { value: "out_for_delivery", label: "Out for Delivery", icon: Truck, color: "orange" },
  { value: "delivered", label: "Delivered", icon: MapPin, color: "green" },
  { value: "cancelled", label: "Cancelled", icon: XCircle, color: "red" }
];

export default function OrderManagementPanel({ order, userRole }: OrderManagementPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [vendorNotes, setVendorNotes] = useState(order.vendorNotes || "");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(
    order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime).toISOString().slice(0, 16) : ""
  );
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");

  const updateOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/orders/${order.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", order.id.toString()] });
      toast({
        title: "Order Updated",
        description: "Order has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await apiRequest("PUT", `/api/orders/${order.id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", order.id.toString()] });
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "cancelled" && !order.cancellationReason) {
      const reason = prompt("Please provide a reason for cancellation:");
      if (!reason) return;
      
      updateOrderMutation.mutate({
        status: newStatus,
        cancellationReason: reason,
        actualDeliveryTime: newStatus === "delivered" ? new Date().toISOString() : null
      });
    } else {
      updateStatusMutation.mutate(newStatus);
    }
  };

  const handleUpdateDetails = () => {
    updateOrderMutation.mutate({
      vendorNotes,
      estimatedDeliveryTime: estimatedDeliveryTime || null,
      trackingNumber: trackingNumber || null,
    });
  };

  const canUpdateStatus = (status: string) => {
    if (userRole === "admin") return true;
    if (order.status === "cancelled") return false;
    if (order.status === "delivered") return false;
    
    // Vendors can move orders forward but not backward
    const currentIndex = statusOptions.findIndex(s => s.value === order.status);
    const newIndex = statusOptions.findIndex(s => s.value === status);
    
    return newIndex > currentIndex || status === "cancelled";
  };

  const getCurrentStatusOption = () => {
    return statusOptions.find(option => option.value === order.status) || statusOptions[0];
  };

  const currentStatusOption = getCurrentStatusOption();

  return (
    <div className="space-y-6">
      {/* Quick Status Update */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <currentStatusOption.icon className="h-5 w-5" />
            <span>Order Status Management</span>
          </CardTitle>
          <CardDescription>
            Update the order status and manage delivery information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="status">Current Status</Label>
            <Select value={order.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    disabled={!canUpdateStatus(option.value)}
                  >
                    <div className="flex items-center space-x-2">
                      <option.icon className="h-4 w-4" />
                      <span>{option.label}</span>
                      {!canUpdateStatus(option.value) && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Not allowed
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {order.status === "cancelled" && order.cancellationReason && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Cancellation Reason:</strong> {order.cancellationReason}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Order Details Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Order Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="vendorNotes">Vendor Notes</Label>
            <Textarea
              id="vendorNotes"
              value={vendorNotes}
              onChange={(e) => setVendorNotes(e.target.value)}
              placeholder="Add notes about this order (visible to customer)..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
              <Input
                id="estimatedDelivery"
                type="datetime-local"
                value={estimatedDeliveryTime}
                onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
          </div>

          <Button 
            onClick={handleUpdateDetails} 
            disabled={updateOrderMutation.isPending}
            className="w-full"
          >
            {updateOrderMutation.isPending ? "Updating..." : "Update Order Details"}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Call Customer</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Send WhatsApp</span>
            </Button>
            
            {order.deliveryMethod === "lalamove" && (
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Track Delivery</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment & Delivery Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Payment Method:</span>
              <p className="capitalize">{order.paymentMethod}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Payment Status:</span>
              <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                {order.paymentStatus}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-gray-600">Delivery Method:</span>
              <p className="capitalize">{order.deliveryMethod}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Delivery Fee:</span>
              <p>RM {order.deliveryFee || "0.00"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}