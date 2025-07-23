import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, MapPin, Truck, CreditCard, User, Phone, Building } from "lucide-react";
import { useLocation } from "wouter";

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
  icon: any;
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart, hasItems } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: user?.username || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    postcode: "",
    state: "",
    notes: ""
  });

  const [selectedDelivery, setSelectedDelivery] = useState<string>("standard");
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");

  const deliveryOptions: DeliveryOption[] = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "2-3 working days",
      price: 5,
      estimatedTime: "2-3 days",
      icon: Truck
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "Same day delivery",
      price: 15,
      estimatedTime: "Same day",
      icon: Truck
    },
    {
      id: "lalamove_bike",
      name: "Lalamove Bike",
      description: "Fast delivery by bike (1-2 hours)",
      price: 8,
      estimatedTime: "1-2 hours",
      icon: Truck
    },
    {
      id: "lalamove_car",
      name: "Lalamove Car",
      description: "Delivery by car (1-3 hours)",
      price: 12,
      estimatedTime: "1-3 hours",
      icon: Truck
    }
  ];

  const selectedDeliveryOption = deliveryOptions.find(option => option.id === selectedDelivery);
  const deliveryFee = selectedDeliveryOption?.price || 0;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${order.orderNumber} has been placed. You'll receive a confirmation email shortly.`,
      });
      setLocation(`/customer/orders/${order.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handlePlaceOrder = () => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.address || !deliveryAddress.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required delivery address fields.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        productName: item.name
      })),
      vendorId: items[0]?.vendorId, // Assuming single vendor orders for now
      totalAmount: total,
      status: "pending",
      deliveryAddress: deliveryAddress,
      deliveryMethod: selectedDelivery,
      deliveryFee: deliveryFee,
      paymentMethod: paymentMethod
    };

    createOrderMutation.mutate(orderData);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-4">Add some products to your cart to proceed with checkout.</p>
          <Button onClick={() => setLocation("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Review your order and complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={deliveryAddress.fullName}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, fullName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={deliveryAddress.phone}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={deliveryAddress.address}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                    placeholder="Enter your full address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      value={deliveryAddress.postcode}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, postcode: e.target.value})}
                      placeholder="Postcode"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select value={deliveryAddress.state} onValueChange={(value) => setDeliveryAddress({...deliveryAddress, state: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                        <SelectItem value="selangor">Selangor</SelectItem>
                        <SelectItem value="penang">Penang</SelectItem>
                        <SelectItem value="johor">Johor</SelectItem>
                        <SelectItem value="sabah">Sabah</SelectItem>
                        <SelectItem value="sarawak">Sarawak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={deliveryAddress.notes}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, notes: e.target.value})}
                    placeholder="Any special delivery instructions"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Delivery Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery}>
                  {deliveryOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor={option.id} className="font-medium">{option.name}</Label>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">RM{option.price}</span>
                            <p className="text-sm text-gray-600">{option.estimatedTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="font-medium">Cash on Delivery (COD)</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 opacity-50">
                    <RadioGroupItem value="online" id="online" disabled />
                    <Label htmlFor="online" className="font-medium">Online Payment (Coming Soon)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image || "/api/placeholder/60/60"}
                      alt={item.name}
                      className="w-15 h-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">RM{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>RM{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>RM{deliveryFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>RM{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  size="lg"
                  disabled={createOrderMutation.isPending || !hasItems()}
                >
                  {createOrderMutation.isPending ? "Placing Order..." : hasItems() ? "Place Order" : "Cart is Empty"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}