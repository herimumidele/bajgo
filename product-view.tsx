import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  Shield, 
  Truck, 
  RotateCcw, 
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingCart
} from "lucide-react";
import { useState } from "react";

export default function ProductView() {
  const { productId } = useParams<{ productId: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: vendor } = useQuery({
    queryKey: ["/api/vendors", product?.vendorId],
    enabled: !!product?.vendorId,
  });

  const handleAddToCart = () => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    
    if (product) {
      addToCart(product, quantity);
      setLocation("/checkout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-4 w-4 text-orange-600" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.thumbnail || "/api/placeholder/600/600"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge variant="secondary" className="text-white bg-red-600">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8) • 127 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-red-600">
                  RM{parseFloat(product.price).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl line-through text-gray-500">
                    RM{parseFloat(product.originalPrice!).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Vendor */}
              <div className="mb-4">
                <span className="text-sm text-gray-600">Sold by: </span>
                <span className="text-sm font-medium text-red-600">
                  {vendor?.storeName || "Unknown Vendor"}
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "Classic timeless fragrance with floral aldehydic notes"}
              </p>
            </div>

            <Separator />

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[50px]">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1"
                  variant="outline"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Truck className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium">Standard Delivery: 2-3 working days</p>
                <p className="text-sm text-gray-600">Free delivery for orders above RM50</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="h-4 w-4 text-red-600" />
              <div>
                <p className="font-medium">Express Delivery: Same day delivery available</p>
                <p className="text-sm text-gray-600">Order before 12PM for same day delivery</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Delivery options and fees will be calculated at checkout
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}