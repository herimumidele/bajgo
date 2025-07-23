import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { Search, Star, Store, ArrowRight, MapPin, Clock } from "lucide-react";

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["/api/vendors"],
  });

  const filteredVendors = vendors?.filter(vendor => 
    vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleVisitStore = (vendor: any) => {
    // Navigate to vendor storefront using subdomain structure
    if (vendor.customDomain) {
      window.open(`https://${vendor.customDomain}`, '_blank');
    } else {
      window.open(`https://${vendor.slug}.bajgo.my`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Vendors</h1>
          <p className="text-gray-600">Discover local vendors and their amazing products</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Vendors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-64">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  {/* Vendor Banner */}
                  <div className="relative h-32 mb-4 rounded-lg overflow-hidden bg-gradient-to-r from-red-500 to-red-600">
                    {vendor.bannerUrl ? (
                      <img 
                        src={vendor.bannerUrl} 
                        alt={vendor.storeName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="h-8 w-8 text-white" />
                      </div>
                    )}
                    
                    {/* Vendor Logo */}
                    <div className="absolute -bottom-4 left-4">
                      <div className="w-12 h-12 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center">
                        {vendor.logoUrl ? (
                          <img 
                            src={vendor.logoUrl} 
                            alt={vendor.storeName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <Store className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {vendor.storeName}
                    </CardTitle>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">(4.8) • 127 reviews</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{vendor.address || "Kuala Lumpur, Malaysia"}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {vendor.description || "Quality products with fast delivery"}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Fast delivery
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Verified
                      </Badge>
                      {vendor.enableLalamove && (
                        <Badge className="text-xs bg-blue-100 text-blue-800">
                          Express delivery
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Button 
                    className="w-full group-hover:bg-red-700 transition-colors"
                    onClick={() => handleVisitStore(vendor)}
                  >
                    Visit Store
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No vendors found' : 'No vendors available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Check back later for new vendors'
              }
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}