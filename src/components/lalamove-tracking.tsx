import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  CheckCircle,
  Car,
  Bike
} from "lucide-react";

interface LalamoveTrackingProps {
  orderId: number;
  lalamoveOrderId: string;
}

export default function LalamoveTracking({ orderId, lalamoveOrderId }: LalamoveTrackingProps) {
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  const { data: trackingData, isLoading, refetch } = useQuery({
    queryKey: ["/api/lalamove/track", lalamoveOrderId],
    refetchInterval: refreshInterval,
    enabled: !!lalamoveOrderId,
  });

  useEffect(() => {
    // Auto-refresh every 30 seconds for active deliveries
    if (trackingData?.status === "PICKING_UP" || trackingData?.status === "ON_GOING") {
      setRefreshInterval(30000);
    } else {
      setRefreshInterval(0); // Stop auto-refresh for completed deliveries
    }
  }, [trackingData?.status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ASSIGNING": return "bg-yellow-100 text-yellow-800";
      case "PICKING_UP": return "bg-blue-100 text-blue-800";
      case "ON_GOING": return "bg-purple-100 text-purple-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ASSIGNING": return <Clock className="h-4 w-4" />;
      case "PICKING_UP": return <Navigation className="h-4 w-4" />;
      case "ON_GOING": return <Car className="h-4 w-4" />;
      case "DELIVERED": return <CheckCircle className="h-4 w-4" />;
      case "CANCELLED": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "ASSIGNING": return "Finding a driver for your order";
      case "PICKING_UP": return "Driver is heading to pickup location";
      case "ON_GOING": return "Driver is on the way to deliver your order";
      case "DELIVERED": return "Order has been delivered successfully";
      case "CANCELLED": return "Delivery was cancelled";
      default: return "Processing your delivery request";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tracking information not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(trackingData.status)}>
            {getStatusIcon(trackingData.status)}
            <span className="ml-2">{trackingData.status.replace('_', ' ')}</span>
          </Badge>
          <span className="text-sm text-gray-600">
            {getStatusMessage(trackingData.status)}
          </span>
        </div>
        <button
          onClick={() => refetch()}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {/* Driver Information */}
      {trackingData.driver && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Driver Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {trackingData.deliveryMethod === "bike" ? (
                    <Bike className="h-6 w-6 text-gray-600" />
                  ) : (
                    <Car className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{trackingData.driver.name}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {trackingData.deliveryMethod} • {trackingData.driver.plateNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{trackingData.driver.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Pickup Location */}
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium">Pickup Location</p>
                <p className="text-sm text-gray-600">{trackingData.pickupAddress}</p>
                {trackingData.pickupTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    Picked up at {new Date(trackingData.pickupTime).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Location */}
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                trackingData.status === "DELIVERED" ? "bg-green-500" : "bg-gray-300"
              }`}></div>
              <div className="flex-1">
                <p className="font-medium">Delivery Location</p>
                <p className="text-sm text-gray-600">{trackingData.deliveryAddress}</p>
                {trackingData.deliveryTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    Delivered at {new Date(trackingData.deliveryTime).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ETA and Distance */}
      {trackingData.eta && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{trackingData.eta}</p>
                <p className="text-sm text-gray-600">Estimated Arrival</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{trackingData.distance}</p>
                <p className="text-sm text-gray-600">Distance Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Location */}
      {trackingData.driverLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Live Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Driver's Current Location</p>
              <p className="text-xs text-gray-500">
                Lat: {trackingData.driverLocation.lat}, 
                Lng: {trackingData.driverLocation.lng}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(trackingData.lastUpdated).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}