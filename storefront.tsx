import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Phone, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "@/components/cart-sidebar";

declare global {
  interface Window {
    VENDOR_DATA?: any;
    IS_STOREFRONT?: boolean;
  }
}

export default function Storefront() {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const [vendorData, setVendorData] = useState<any>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { toast } = useToast();
  const { getTotalItems } = useCart();
  
  // Check if we're in subdomain/custom domain mode
  const isSubdomainMode = typeof window !== 'undefined' && window.IS_STOREFRONT;
  
  useEffect(() => {
    if (isSubdomainMode && window.VENDOR_DATA) {
      setVendorData(window.VENDOR_DATA);
    }
  }, [isSubdomainMode]);
  
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ["/api/storefront", storeSlug || vendorData?.storeSlug],
    enabled: !!(storeSlug || vendorData?.storeSlug) && !isSubdomainMode,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: isSubdomainMode ? ["/api/vendor-products", vendorData?.id] : ["/api/storefront", storeSlug || vendorData?.storeSlug, "products"],
    enabled: !!(store?.id || vendorData?.id),
  });

  // Use vendorData if available, otherwise use store data
  const storeData = vendorData || store;

  if (storeLoading && !isSubdomainMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600">The store you're looking for doesn't exist or has been deactivated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{storeData.storeName}</h1>
              {storeData.description && (
                <p className="text-gray-600 mt-2">{storeData.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3">
                {storeData.phone && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-1" />
                    {storeData.phone}
                  </div>
                )}
                {storeData.address && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {storeData.address}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center">
                <Star className="h-3 w-3 mr-1" />
                4.8 (128 reviews)
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Open Now
              </Badge>
              
              {/* Cart Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCartOpen(true)}
                className="relative ml-2"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {getTotalItems() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button variant="outline" size="sm">Sort</Button>
          </div>
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">This store hasn't added any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                showActions={true}
                onAddToCart={(product) => {
                  toast({
                    title: "Added to Cart",
                    description: `${product.name} has been added to your cart.`,
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}