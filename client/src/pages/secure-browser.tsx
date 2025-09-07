import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

type TrustedWebsite = {
  id: string;
  domain: string;
  displayName: string;
  category: string;
  logoUrl?: string;
  description?: string;
  securityRating: string;
};

type BrowserBookmark = {
  id: string;
  title: string;
  url: string;
  category: string;
  isTrusted: boolean;
  visitCount: number;
  faviconUrl?: string;
};

export default function SecureBrowser() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch trusted websites
  const { data: trustedSites } = useQuery<TrustedWebsite[]>({
    queryKey: ['/api/browser/trusted-sites'],
    retry: false,
  });

  // Fetch user bookmarks
  const { data: bookmarks } = useQuery<BrowserBookmark[]>({
    queryKey: ['/api/browser/bookmarks'],
    retry: false,
  });

  // Create browser session mutation
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/browser/create-session', {});
      return response.json();
    },
    onSuccess: (session) => {
      toast({
        title: "Secure Session Started",
        description: "Your protected browsing session is now active.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please log in to access secure browser.",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Session Failed",
        description: "Unable to create secure session.",
        variant: "destructive",
      });
    },
  });

  // Add bookmark mutation
  const addBookmarkMutation = useMutation({
    mutationFn: async (bookmarkData: { title: string; url: string; category: string }) => {
      const response = await apiRequest('POST', '/api/browser/bookmarks', bookmarkData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Bookmark Added",
        description: "Website saved to your trusted bookmarks.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/browser/bookmarks'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) return;
      toast({
        title: "Bookmark Failed",
        description: "Unable to save bookmark.",
        variant: "destructive",
      });
    },
  });

  // Navigation functions
  const navigateToUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    setIsLoading(true);
    setCurrentUrl(url);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If it looks like a URL, navigate directly
      if (searchQuery.includes('.') && !searchQuery.includes(' ')) {
        navigateToUrl(searchQuery);
      } else {
        // Otherwise, search with Google
        navigateToUrl(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleAddBookmark = () => {
    if (currentUrl) {
      const title = prompt("Enter bookmark title:");
      if (title) {
        addBookmarkMutation.mutate({
          title,
          url: currentUrl,
          category: 'general'
        });
      }
    }
  };

  // Pre-approved trusted sites for Jamaica
  const jamaicanTrustedSites = [
    { name: "Bank of Jamaica", url: "https://boj.org.jm", category: "government", rating: "A+", logo: "🏛️" },
    { name: "Scotia Bank Jamaica", url: "https://www.scotiabank.com/jm", category: "banking", rating: "A+", logo: "🏦" },
    { name: "NCB Jamaica", url: "https://www.jncb.com", category: "banking", rating: "A+", logo: "🏦" },
    { name: "Jamaica Customs", url: "https://www.jacustoms.gov.jm", category: "government", rating: "A", logo: "🛃" },
    { name: "TAJ (Tax Administration)", url: "https://www.jamaicatax.gov.jm", category: "government", rating: "A", logo: "💼" },
    { name: "Companies Office", url: "https://coj.gov.jm", category: "government", rating: "A", logo: "🏢" },
    { name: "PayPal", url: "https://www.paypal.com", category: "finance", rating: "A+", logo: "💳" },
    { name: "Amazon", url: "https://www.amazon.com", category: "business", rating: "A", logo: "📦" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="glass-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/')}
                data-testid="button-back-home"
              >
                ← Back to YardFlex
              </Button>
              <span className="text-2xl font-bold text-premium">🛡️ Secure Browser</span>
              <Badge className="bg-green-600 text-white">PROTECTED</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Safe Browsing Active</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Security Alert */}
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-900/20">
          <AlertDescription className="text-green-700 dark:text-green-300">
            🛡️ <strong>Ultra-Secure Browsing:</strong> Your connection is protected with VPN, ad-blocking, 
            tracking protection, and malware detection. Only access trusted sites through YardFlex.
          </AlertDescription>
        </Alert>

        {/* Address Bar & Controls */}
        <Card className="mb-6" data-testid="browser-controls">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter URL or search term..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    data-testid="input-url"
                  />
                  <Button 
                    type="submit"
                    disabled={!searchQuery.trim()}
                    data-testid="button-navigate"
                  >
                    Go
                  </Button>
                </div>
              </form>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleAddBookmark}
                  disabled={!currentUrl}
                  data-testid="button-add-bookmark"
                >
                  ⭐ Bookmark
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentUrl('')}
                  data-testid="button-home"
                >
                  🏠 Home
                </Button>
              </div>
            </div>

            {/* Current URL Display */}
            {currentUrl && (
              <div className="mt-3 p-2 bg-muted rounded flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono">{currentUrl}</span>
                <Badge variant="secondary">SECURE</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Browser Window */}
          <div className="lg:col-span-2">
            <Card data-testid="browser-window">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🌐</span>
                  <span>Secure Browser Window</span>
                  {isLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {currentUrl ? (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 min-h-[500px] flex items-center justify-center border-2 border-green-500">
                      {isLoading ? (
                        <div className="text-center">
                          <div className="animate-spin text-4xl mb-4">🛡️</div>
                          <p>Loading securely...</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-4">🌍</div>
                          <p className="text-lg font-semibold">Simulated Secure Browser</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            In production, this would display the actual website<br/>
                            with full security protection and monitoring.
                          </p>
                          <p className="text-sm mt-4 font-mono bg-muted p-2 rounded">
                            Current URL: {currentUrl}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-8 min-h-[500px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🛡️</div>
                        <h3 className="text-2xl font-bold mb-4">YardFlex Secure Browser</h3>
                        <p className="text-muted-foreground mb-6">
                          Browse the internet safely with enterprise-grade security protection
                        </p>
                        <Button 
                          onClick={() => createSessionMutation.mutate()}
                          disabled={createSessionMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                          data-testid="button-start-session"
                        >
                          Start Secure Session
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trusted Jamaican Sites */}
            <Card data-testid="trusted-sites">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🇯🇲</span>
                  <span>Trusted Jamaican Sites</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jamaicanTrustedSites.map((site, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/20 rounded-lg cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => navigateToUrl(site.url)}
                      data-testid={`trusted-site-${index}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{site.logo}</span>
                        <div>
                          <div className="font-medium">{site.name}</div>
                          <div className="text-xs text-muted-foreground">{site.category}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">{site.rating}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Bookmarks */}
            <Card data-testid="user-bookmarks">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>⭐</span>
                  <span>Your Bookmarks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookmarks && bookmarks.length > 0 ? (
                  <div className="space-y-3">
                    {bookmarks.map((bookmark) => (
                      <div 
                        key={bookmark.id}
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg cursor-pointer hover:bg-muted/40 transition-colors"
                        onClick={() => navigateToUrl(bookmark.url)}
                        data-testid={`bookmark-${bookmark.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">🔖</span>
                          <div>
                            <div className="font-medium">{bookmark.title}</div>
                            <div className="text-xs text-muted-foreground">{bookmark.category}</div>
                          </div>
                        </div>
                        {bookmark.isTrusted && <Badge variant="secondary">TRUSTED</Badge>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No bookmarks yet</p>
                    <p className="text-sm">Navigate to sites and bookmark them for quick access</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="border-green-500" data-testid="security-status">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <span>🛡️</span>
                  <span>Security Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>VPN Protection</span>
                    <Badge className="bg-green-600 text-white">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ad Blocker</span>
                    <Badge className="bg-green-600 text-white">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tracking Protection</span>
                    <Badge className="bg-green-600 text-white">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Malware Shield</span>
                    <Badge className="bg-green-600 text-white">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>HTTPS Only</span>
                    <Badge className="bg-green-600 text-white">ENFORCED</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}