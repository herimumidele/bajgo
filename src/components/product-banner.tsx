import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Share2 } from "lucide-react";

interface ProductBannerProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onShare?: (product: Product) => void;
}

export default function ProductBanner({ product, onAddToCart, onShare }: ProductBannerProps) {
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  return (
    <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
      {/* Banner Image */}
      {product.banner ? (
        <img 
          src={product.banner} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : product.thumbnail ? (
        <img 
          src={product.thumbnail} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">{product.name}</span>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <div className="space-y-3">
          {/* Discount Badge */}
          {hasDiscount && (
            <Badge className="w-fit bg-red-500 text-white text-sm">
              {discountPercentage}% OFF - Limited Time!
            </Badge>
          )}

          {/* Product Title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {product.name}
          </h1>

          {/* Description */}
          {product.description && (
            <p className="text-lg text-gray-200 max-w-2xl">
              {product.description}
            </p>
          )}

          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                RM{parseFloat(product.price).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-lg line-through text-gray-300">
                  RM{parseFloat(product.originalPrice!).toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={() => onAddToCart?.(product)}
                disabled={product.stock === 0}
                className="bg-white text-black hover:bg-gray-100"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => onShare?.(product)}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="text-sm">
            {product.stock > 0 ? (
              <span className="text-green-300">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-300">✗ Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}