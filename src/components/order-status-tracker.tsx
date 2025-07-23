import { CheckCircle, Clock, Package, Truck, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OrderStatusTrackerProps {
  currentStatus: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  size?: "sm" | "lg";
}

const orderSteps = [
  { 
    key: "pending", 
    label: "Order Placed", 
    icon: Clock,
    description: "Your order has been received"
  },
  { 
    key: "confirmed", 
    label: "Confirmed", 
    icon: CheckCircle,
    description: "Order confirmed by vendor"
  },
  { 
    key: "preparing", 
    label: "Preparing", 
    icon: Package,
    description: "Your order is being prepared"
  },
  { 
    key: "ready_for_pickup", 
    label: "Ready", 
    icon: CheckCircle,
    description: "Ready for pickup/delivery"
  },
  { 
    key: "out_for_delivery", 
    label: "Out for Delivery", 
    icon: Truck,
    description: "On the way to you"
  },
  { 
    key: "delivered", 
    label: "Delivered", 
    icon: MapPin,
    description: "Order completed"
  }
];

export default function OrderStatusTracker({ 
  currentStatus, 
  createdAt, 
  estimatedDeliveryTime,
  actualDeliveryTime,
  size = "lg" 
}: OrderStatusTrackerProps) {
  const currentStepIndex = orderSteps.findIndex(step => step.key === currentStatus);
  const progress = currentStatus === "cancelled" ? 0 : ((currentStepIndex + 1) / orderSteps.length) * 100;

  const getStepStatus = (stepIndex: number) => {
    if (currentStatus === "cancelled") return "cancelled";
    if (stepIndex <= currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex + 1) return "current";
    return "upcoming";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100";
      case "current": return "text-blue-600 bg-blue-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-400 bg-gray-100";
    }
  };

  if (currentStatus === "cancelled") {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-red-600 text-xl">✕</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-1">Order Cancelled</h3>
            <p className="text-red-600 text-sm">This order has been cancelled</p>
          </div>
        </div>
      </div>
    );
  }

  if (size === "sm") {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Order Progress</span>
          <Badge className={getStatusColor("current")}>
            {orderSteps[currentStepIndex]?.label || currentStatus}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Placed</span>
          <span>Delivered</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
          <Badge className={getStatusColor("current")} variant="outline">
            {orderSteps[currentStepIndex]?.label || currentStatus}
          </Badge>
        </div>
        <Progress value={progress} className="h-3 mb-2" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Order placed: {new Date(createdAt).toLocaleDateString()}</span>
          {estimatedDeliveryTime && (
            <span>ETA: {new Date(estimatedDeliveryTime).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {orderSteps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const IconComponent = step.icon;
          
          return (
            <div key={step.key} className="flex items-start space-x-4">
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${getStatusColor(stepStatus)}
                ${stepStatus === "current" ? "ring-4 ring-blue-100" : ""}
              `}>
                <IconComponent className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`
                    text-sm font-medium
                    ${stepStatus === "completed" ? "text-green-800" : ""}
                    ${stepStatus === "current" ? "text-blue-800" : ""}
                    ${stepStatus === "upcoming" ? "text-gray-500" : ""}
                  `}>
                    {step.label}
                  </h4>
                  {stepStatus === "completed" && (
                    <span className="text-xs text-gray-500">
                      {index === 0 ? new Date(createdAt).toLocaleTimeString() : ""}
                      {index === orderSteps.length - 1 && actualDeliveryTime ? 
                        new Date(actualDeliveryTime).toLocaleTimeString() : ""}
                    </span>
                  )}
                </div>
                <p className={`
                  text-sm mt-1
                  ${stepStatus === "completed" ? "text-green-600" : ""}
                  ${stepStatus === "current" ? "text-blue-600" : ""}
                  ${stepStatus === "upcoming" ? "text-gray-400" : ""}
                `}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {currentStatus === "delivered" && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-medium text-green-800">Order Completed</span>
          </div>
          <p className="text-sm text-green-700">
            {actualDeliveryTime ? 
              `Delivered on ${new Date(actualDeliveryTime).toLocaleString()}` :
              "Your order has been successfully delivered!"
            }
          </p>
        </div>
      )}
    </div>
  );
}