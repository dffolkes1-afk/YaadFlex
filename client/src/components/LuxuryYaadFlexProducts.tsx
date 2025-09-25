import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingBag, Heart, Eye, Crown, Diamond } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface YaadFlexProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  sizes: string[];
  colors: string[];
  material: string;
  images: string[];
  isFeatured: boolean;
  stock: number;
  rating: number;
}

interface YaadFlexCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export function LuxuryYaadFlexProducts() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch categories
  const { data: categories = [] } = useQuery<YaadFlexCategory[]>({
    queryKey: ['/api/yaadflex/categories'],
  });

  // Fetch products based on selected category
  const { data: products = [], isLoading } = useQuery<YaadFlexProduct[]>({
    queryKey: ['/api/yaadflex/products', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === 'all' 
        ? '/api/yaadflex/products'
        : `/api/yaadflex/products?category=${selectedCategory}`;
      const response = await apiRequest('GET', url);
      return await response.json() as YaadFlexProduct[];
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest('POST', '/api/yaadflex/orders', {
        items: [{ productId, quantity: 1 }]
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: "Luxury item added to your YaadFlex collection!",
        className: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-gold-300",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/yaadflex/orders'] });
    },
    onError: () => {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'shirts':
      case 'clothing':
        return <Crown className="w-5 h-5 text-gold-400" />;
      case 'shoes':
      case 'footwear':
        return <Diamond className="w-5 h-5 text-gold-400" />;
      case 'coffee':
      case 'beverages':
        return <Heart className="w-5 h-5 text-gold-400" />;
      case 'accessories':
        return <Star className="w-5 h-5 text-gold-400" />;
      default:
        return <Crown className="w-5 h-5 text-gold-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <Crown className="w-8 h-8 animate-pulse" />
            <span className="text-xl font-bold">Loading Luxury Collection...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-gradient-to-br from-emerald-50 to-gold-50 dark:from-emerald-900/20 dark:to-gold-900/20">
              <div className="h-48 bg-gradient-to-br from-emerald-200 to-gold-200 dark:from-emerald-800 dark:to-gold-800 rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gradient-to-r from-emerald-300 to-gold-300 rounded" />
                <div className="h-3 bg-emerald-200 rounded w-3/4" />
                <div className="h-6 bg-gold-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Luxury Header */}
      <div className="text-center py-8 bg-gradient-to-r from-emerald-600 via-gold-500 to-rose-500 text-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Crown className="w-10 h-10 text-gold-200" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-200 to-rose-200 bg-clip-text text-transparent">
            YaadFlex Luxury Collection
          </h1>
          <Diamond className="w-10 h-10 text-gold-200" />
        </div>
        <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
          Discover premium Caribbean-inspired luxury fashion that outshines even the finest boutiques
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 py-6">
        <Button
          onClick={() => setSelectedCategory('all')}
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className={`${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-emerald-600 to-gold-600 text-white border-gold-300'
              : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-600 dark:hover:bg-emerald-900/20'
          } rounded-full px-6 py-2 transition-all duration-300`}
          data-testid="filter-all"
        >
          <Crown className="w-4 h-4 mr-2" />
          All Luxury Items
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={`${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-emerald-600 to-gold-600 text-white border-gold-300'
                : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-600 dark:hover:bg-emerald-900/20'
            } rounded-full px-6 py-2 transition-all duration-300`}
            data-testid={`filter-${category.name.toLowerCase()}`}
          >
            {getCategoryIcon(category.name)}
            <span className="ml-2">{category.name}</span>
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      {(products as YaadFlexProduct[]).length === 0 ? (
        <div className="text-center py-12">
          <Crown className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
            No Luxury Items Found
          </h3>
          <p className="text-emerald-600 dark:text-emerald-400">
            Check back soon for new arrivals in our exclusive collection
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(products as YaadFlexProduct[]).map((product: YaadFlexProduct) => (
            <Card
              key={product.id}
              className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-white via-emerald-50 to-gold-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gold-900/10 border-2 ${
                hoveredProduct === product.id
                  ? 'border-gold-400 shadow-gold-200/50'
                  : 'border-emerald-200 dark:border-emerald-700'
              }`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              data-testid={`product-card-${product.id}`}
            >
              <CardHeader className="p-0 relative overflow-hidden rounded-t-lg">
                {product.isFeatured && (
                  <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-gold-500 to-rose-500 text-white border-none">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-gold-100 dark:from-emerald-800 dark:to-gold-800">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Crown className="w-16 h-16 text-emerald-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all duration-300" />
                </div>
              </CardHeader>
              
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-200 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Product Details */}
                <div className="space-y-2">
                  {product.material && (
                    <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-600 dark:border-emerald-600 dark:text-emerald-400">
                      {product.material}
                    </Badge>
                  )}
                  
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.colors.slice(0, 3).map((color: string, index: number) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 3}</span>
                      )}
                    </div>
                  )}

                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'text-gold-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        ({product.rating})
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-emerald-100 dark:border-emerald-800">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-gold-600 bg-clip-text text-transparent">
                      {formatPrice(product.price, product.currency)}
                    </p>
                    {product.stock > 0 ? (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        {product.stock} in stock
                      </p>
                    ) : (
                      <p className="text-xs text-red-500">Out of stock</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                      data-testid={`view-product-${product.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => addToCartMutation.mutate(product.id)}
                      disabled={product.stock === 0 || addToCartMutation.isPending}
                      className="bg-gradient-to-r from-emerald-600 to-gold-600 hover:from-emerald-700 hover:to-gold-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}