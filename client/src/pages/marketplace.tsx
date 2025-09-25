import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LuxuryYaadFlexProducts } from '@/components/LuxuryYaadFlexProducts';
import { GlamorousCard } from '@/components/ui/glamorous-card';
import { GlamorousButton } from '@/components/ui/glamorous-button';
import { GlamorousSection, PremiumSection, LuxuryHeroSection } from '@/components/ui/glamorous-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  DollarSign, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  Camera,
  Package,
  Globe,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  location: string;
  parish: string;
  datePosted: string;
  viewCount: number;
  favoriteCount: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  negotiable: boolean;
  deliveryAvailable: boolean;
  culturalSignificance?: string;
};

type NewItemForm = {
  title: string;
  description: string;
  price: string;
  currency: string;
  category: string;
  condition: string;
  location: string;
  parish: string;
  tags: string;
  negotiable: boolean;
  deliveryAvailable: boolean;
  culturalSignificance: string;
};

const categories = [
  { id: 'electronics', name: '📱 Electronics', desc: 'Phones, computers, gadgets' },
  { id: 'clothing', name: '👕 Fashion & Clothing', desc: 'Apparel, shoes, accessories' },
  { id: 'home_garden', name: '🏡 Home & Garden', desc: 'Furniture, decor, tools' },
  { id: 'sports', name: '⚽ Sports & Recreation', desc: 'Equipment, gear, outdoor items' },
  { id: 'books_media', name: '📚 Books & Media', desc: 'Books, movies, music, games' },
  { id: 'automotive', name: '🚗 Automotive', desc: 'Car parts, accessories, tools' },
  { id: 'collectibles', name: '🎨 Collectibles & Art', desc: 'Antiques, artwork, vintage items' },
  { id: 'baby_kids', name: '👶 Baby & Kids', desc: 'Toys, clothes, baby gear' },
  { id: 'beauty_health', name: '💄 Beauty & Health', desc: 'Cosmetics, wellness, fitness' },
  { id: 'caribbean_culture', name: '🇯🇲 Caribbean Culture', desc: 'Traditional crafts, spices, music' },
  { id: 'business', name: '💼 Business & Industrial', desc: 'Office supplies, equipment' },
  { id: 'other', name: '📦 Other', desc: 'Everything else' }
];

const jamaicaParishes = [
  'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary',
  'St. Ann', 'Trelawny', 'St. James', 'Hanover', 'Westmoreland',
  'St. Elizabeth', 'Manchester', 'Clarendon', 'St. Catherine'
];

export default function MarketplacePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // SEO Meta Tags
  useEffect(() => {
    document.title = "YaadFlex Marketplace - Buy & Sell Anything in Jamaica 🇯🇲";
    
    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Discover Jamaica\'s premier marketplace - buy and sell electronics, fashion, cars, Caribbean culture items, and more. Island-wide delivery, secure payments, trusted community.');
    
    // Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content);
    };
    
    updateOGTag('og:title', 'YaadFlex Marketplace - Buy & Sell Anything in Jamaica');
    updateOGTag('og:description', 'Jamaica\'s premier marketplace with island-wide delivery and secure payments');
    updateOGTag('og:type', 'website');
    updateOGTag('og:site_name', 'YaadFlex');
  }, []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedParish, setSelectedParish] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [showListingForm, setShowListingForm] = useState(false);
  
  const [newItemForm, setNewItemForm] = useState<NewItemForm>({
    title: '',
    description: '',
    price: '',
    currency: 'JMD',
    category: '',
    condition: 'good',
    location: '',
    parish: 'Kingston',
    tags: '',
    negotiable: true,
    deliveryAvailable: false,
    culturalSignificance: ''
  });

  // Fetch marketplace items
  const { data: items = [], isLoading: itemsLoading } = useQuery<MarketplaceItem[]>({
    queryKey: ['/api/marketplace/items', searchQuery, selectedCategory, selectedParish, maxPrice],
    retry: false,
  });

  // Fetch user's listings
  const { data: myListings = [], isLoading: myListingsLoading } = useQuery<MarketplaceItem[]>({
    queryKey: ['/api/marketplace/my-listings'],
    retry: false,
  });

  // Create new listing
  const createListingMutation = useMutation({
    mutationFn: async (data: NewItemForm) => {
      return apiRequest('POST', '/api/marketplace/items', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/my-listings'] });
      setShowListingForm(false);
      setNewItemForm({
        title: '',
        description: '',
        price: '',
        currency: 'JMD',
        category: '',
        condition: 'good',
        location: '',
        parish: 'Kingston',
        tags: '',
        negotiable: true,
        deliveryAvailable: false,
        culturalSignificance: ''
      });
      toast({
        title: "✅ Listing Created!",
        description: "Your item is now available in the marketplace",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Listing",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  // Contact seller
  const contactSeller = (item: MarketplaceItem) => {
    toast({
      title: "💬 Contacting Seller",
      description: `Opening chat with ${item.sellerName}`,
    });
  };

  // Make offer
  const makeOffer = (item: MarketplaceItem) => {
    toast({
      title: "💰 Make Offer",
      description: "Opening offer dialog",
    });
  };

  // Buy now
  const buyNow = (item: MarketplaceItem) => {
    toast({
      title: "🛒 Buy Now",
      description: "Redirecting to secure checkout",
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString()}`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like_new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">YaadFlex Marketplace</h1>
            <p className="text-xl opacity-90 mb-6">
              Buy & Sell Anything, Anytime, Anywhere in Jamaica 🇯🇲
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-yellow-400 text-black px-4 py-2">
                <Globe className="h-4 w-4 mr-1" />
                Island-Wide Delivery
              </Badge>
              <Badge variant="secondary" className="bg-green-400 text-black px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-1" />
                Secure Payments
              </Badge>
              <Badge variant="secondary" className="bg-blue-400 text-black px-4 py-2">
                <Users className="h-4 w-4 mr-1" />
                Trusted Community
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Items
            </TabsTrigger>
            <TabsTrigger value="yaadflex-fashion" className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-gold-500 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-gold-600">
              <Star className="h-4 w-4" />
              YaadFlex Fashion
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Sell Item
            </TabsTrigger>
            <TabsTrigger value="my-listings" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Listings
            </TabsTrigger>
          </TabsList>

          {/* YaadFlex Luxury Fashion Tab */}
          <TabsContent value="yaadflex-fashion">
            <LuxuryYaadFlexProducts />
          </TabsContent>

          {/* Browse Items Tab */}
          <TabsContent value="browse">
            {/* Search & Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find What You Need
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search Items</Label>
                    <Input
                      id="search"
                      placeholder="What are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="parish">Parish</Label>
                    <Select value={selectedParish} onValueChange={setSelectedParish}>
                      <SelectTrigger data-testid="select-parish">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Parishes</SelectItem>
                        {jamaicaParishes.map(parish => (
                          <SelectItem key={parish} value={parish}>{parish}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="max-price">Max Price (JMD)</Label>
                    <Input
                      id="max-price"
                      type="number"
                      placeholder="Max budget"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      data-testid="input-max-price"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Grid */}
            {itemsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading marketplace items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Items Found</h3>
                    <p className="text-muted-foreground">Try adjusting your search filters</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow" data-testid={`card-item-${item.id}`}>
                      <CardHeader className="p-0">
                        <div className="relative">
                          {item.images?.[0] ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                              <Camera className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          {item.isFeatured && (
                            <Badge className="absolute top-2 left-2 bg-yellow-500">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <Badge className={`absolute top-2 right-2 ${getConditionColor(item.condition)}`}>
                            {item.condition.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2" data-testid={`text-title-${item.id}`}>
                          {item.title}
                        </h3>
                        <p className="text-2xl font-bold text-primary mb-2" data-testid={`text-price-${item.id}`}>
                          {formatPrice(item.price, item.currency)}
                          {item.negotiable && <span className="text-sm text-muted-foreground ml-1">OBO</span>}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4" />
                          {item.location}, {item.parish}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Users className="h-4 w-4" />
                          {item.sellerName}
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1">{item.sellerRating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.deliveryAvailable && (
                            <Badge variant="outline" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Delivery Available
                            </Badge>
                          )}
                          {item.culturalSignificance && (
                            <Badge variant="outline" className="text-xs">
                              🇯🇲 Cultural Item
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <GlamorousButton 
                            variant="luxury"
                            size="sm" 
                            glow="intense"
                            sparkle="enabled"
                            className="flex-1"
                            onClick={() => buyNow(item)}
                            data-testid={`button-buy-${item.id}`}
                          >
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            Buy Now
                          </GlamorousButton>
                          <GlamorousButton 
                            variant="premium"
                            size="sm" 
                            glow="medium"
                            sparkle="enabled"
                            onClick={() => makeOffer(item)}
                            data-testid={`button-offer-${item.id}`}
                          >
                            💰 Offer
                          </GlamorousButton>
                          <GlamorousButton 
                            variant="glass"
                            size="sm" 
                            glow="subtle"
                            onClick={() => contactSeller(item)}
                            data-testid={`button-contact-${item.id}`}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </GlamorousButton>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          {/* Sell Item Tab */}
          <TabsContent value="sell">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  List Your Item for Sale
                </CardTitle>
                <CardDescription>
                  Reach thousands of buyers across Jamaica with your listing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  createListingMutation.mutate(newItemForm);
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Item Title *</Label>
                      <Input
                        id="title"
                        placeholder="What are you selling?"
                        value={newItemForm.title}
                        onChange={(e) => setNewItemForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                        data-testid="input-title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newItemForm.category}
                        onValueChange={(value) => setNewItemForm(prev => ({ ...prev, category: value }))}
                        required
                      >
                        <SelectTrigger data-testid="select-listing-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item in detail..."
                      value={newItemForm.description}
                      onChange={(e) => setNewItemForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                      rows={4}
                      data-testid="textarea-description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={newItemForm.price}
                        onChange={(e) => setNewItemForm(prev => ({ ...prev, price: e.target.value }))}
                        required
                        data-testid="input-price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={newItemForm.currency}
                        onValueChange={(value) => setNewItemForm(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger data-testid="select-currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JMD">JMD (Jamaican Dollar)</SelectItem>
                          <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="condition">Condition *</Label>
                      <Select
                        value={newItemForm.condition}
                        onValueChange={(value) => setNewItemForm(prev => ({ ...prev, condition: value }))}
                        required
                      >
                        <SelectTrigger data-testid="select-condition">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like_new">Like New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="Specific area/address"
                        value={newItemForm.location}
                        onChange={(e) => setNewItemForm(prev => ({ ...prev, location: e.target.value }))}
                        required
                        data-testid="input-location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="parish">Parish *</Label>
                      <Select
                        value={newItemForm.parish}
                        onValueChange={(value) => setNewItemForm(prev => ({ ...prev, parish: value }))}
                        required
                      >
                        <SelectTrigger data-testid="select-listing-parish">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {jamaicaParishes.map(parish => (
                            <SelectItem key={parish} value={parish}>{parish}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cultural-significance">Cultural Significance (Optional)</Label>
                    <Textarea
                      id="cultural-significance"
                      placeholder="Does this item have cultural or historical significance in Jamaica?"
                      value={newItemForm.culturalSignificance}
                      onChange={(e) => setNewItemForm(prev => ({ ...prev, culturalSignificance: e.target.value }))}
                      rows={2}
                      data-testid="textarea-cultural"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newItemForm.negotiable}
                        onChange={(e) => setNewItemForm(prev => ({ ...prev, negotiable: e.target.checked }))}
                        data-testid="checkbox-negotiable"
                      />
                      <span>Price is negotiable</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newItemForm.deliveryAvailable}
                        onChange={(e) => setNewItemForm(prev => ({ ...prev, deliveryAvailable: e.target.checked }))}
                        data-testid="checkbox-delivery"
                      />
                      <span>Delivery available</span>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createListingMutation.isPending}
                    data-testid="button-create-listing"
                  >
                    {createListingMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Listing...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Listing
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="my-listings">
            {myListingsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading your listings...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
                    <p className="text-muted-foreground mb-4">Start selling by creating your first listing</p>
                    <Button onClick={() => setShowListingForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Listing
                    </Button>
                  </div>
                ) : (
                  myListings.map((item) => (
                    <Card key={item.id} className="relative" data-testid={`card-my-listing-${item.id}`}>
                      <CardHeader className="p-0">
                        <div className="relative">
                          {item.images?.[0] ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                              <Camera className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <Badge className={`absolute top-2 right-2 ${item.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2" data-testid={`text-my-title-${item.id}`}>
                          {item.title}
                        </h3>
                        <p className="text-2xl font-bold text-primary mb-2" data-testid={`text-my-price-${item.id}`}>
                          {formatPrice(item.price, item.currency)}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {item.viewCount} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {item.favoriteCount} likes
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

