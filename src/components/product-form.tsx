import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface ProductFormProps {
  onClose: () => void;
  vendorId: number;
  product?: any; // For editing mode
}

export default function ProductForm({ onClose, vendorId, product }: ProductFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    stock: product?.stock?.toString() || "",
    categoryId: product?.categoryId?.toString() || "",
    thumbnail: product?.thumbnail || "",
    banner: product?.banner || "",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Product operation error:", errorData);
        throw new Error(errorData.message || `Failed to ${product ? 'update' : 'create'} product`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors", vendorId, "products"] });
      toast({
        title: "Success",
        description: `Product ${product ? 'updated' : 'created'} successfully!`,
      });
      if (!product) {
        setFormData({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          stock: "",
          categoryId: "",
          thumbnail: "",
          banner: "",
        });
      }
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${product ? 'update' : 'create'} product`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: formData.price,
      originalPrice: formData.originalPrice || null,
      stock: parseInt(formData.stock) || 0,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      vendorId: vendorId,
      images: [],
      thumbnail: formData.thumbnail || null,
      banner: formData.banner || null,
      isActive: true,
    };
    
    createProductMutation.mutate(productData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <CardDescription>{product ? 'Update your product details below' : 'Create a new product for your store'}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (RM)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (RM)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Product Thumbnail URL</Label>
              <Input
                id="thumbnail"
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
              />
              <p className="text-sm text-muted-foreground">Main product image (recommended: 400x400px)</p>
              {formData.thumbnail && (
                <div className="mt-2 border rounded-lg p-2">
                  <img 
                    src={formData.thumbnail} 
                    alt="Thumbnail preview" 
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <p className="text-xs text-red-500 mt-1 hidden">Invalid image URL</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner">Product Banner URL</Label>
              <Input
                id="banner"
                type="url"
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                placeholder="https://example.com/banner.jpg"
              />
              <p className="text-sm text-muted-foreground">Product banner image (recommended: 1200x400px)</p>
              {formData.banner && (
                <div className="mt-2 border rounded-lg p-2">
                  <img 
                    src={formData.banner} 
                    alt="Banner preview" 
                    className="w-32 h-12 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <p className="text-xs text-red-500 mt-1 hidden">Invalid image URL</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProductMutation.isPending}>
              {createProductMutation.isPending ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
