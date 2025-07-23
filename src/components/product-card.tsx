import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { ShoppingCart, Eye } from "lucide-react";
import { useLocation } from "wouter";
import AddToCartButton from "@/components/add-to-cart-button";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  showActions?: boolean;
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onViewDetails, 
  showActions = true 
}: ProductCardProps) {
  const [, setLocation] = useLocation();
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        {product.thumbnail ? (
          <img 
            src={product.thumbnail} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            -{discountPercentage}%
          </Badge>
        )}

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="secondary" className="text-white bg-red-600">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div>
          {/* Description */}
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-primary">
              RM{parseFloat(product.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm line-through text-muted-foreground">
                RM{parseFloat(product.originalPrice!).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Info */}
          <div className="text-sm text-muted-foreground mb-4">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Navigate to product view page using wouter
                setLocation(`/product/${product.id}`);
              }}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <AddToCartButton product={product} size="sm" className="flex-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}