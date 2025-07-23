import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Plus } from "lucide-react";

interface AddToCartButtonProps {
  product: any;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export default function AddToCartButton({ product, size = "default", className }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Button
      onClick={handleAddToCart}
      size={size}
      className={`bg-red-600 hover:bg-red-700 ${className}`}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add to Cart
    </Button>
  );
}