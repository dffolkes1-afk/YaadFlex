import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BusinessProfile = {
  id: string;
  businessName: string;
  displayName: string;
  slug: string;
  category: string;
  description: string;
  phone?: string;
  whatsappNumber?: string;
  profileImageUrl?: string;
  averageRating: string;
  totalBookings: number;
  isVerified: boolean;
  isPremium: boolean;
};

type SocialMediaPost = {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  status: string;
  scheduledFor?: string;
  totalReach: number;
  totalEngagement: number;
  createdAt: string;
};

export default function SocialCommerce() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    displayName: '',
    category: 'transport',
    description: '',
    phone: '',
    whatsappNumber: '',
    tagline: '',
    instagramHandle: '',
    services: [] as string[],
  });

  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    platforms: ['facebook', 'instagram'],
    scheduledFor: '',
  });

  // Fetch user's business profile
  const { data: profile, isLoading: profileLoading } = useQuery<BusinessProfile>({
    queryKey: ['/api/business-profile'],
    retry: false,
  });

  // Fetch user's social media posts
  const { data: posts, isLoading: postsLoading } = useQuery<SocialMediaPost[]>({
    queryKey: ['/api/social-posts'],
    retry: false,
  });

  // Create/Update business profile
  const profileMutation = useMutation({
    mutationFn: async (data: typeof profileForm) => {
      const method = profile ? 'PUT' : 'POST';
      const response = await apiRequest(method, '/api/business-profile', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated!",
        description: "Your business profile has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/business-profile'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please log in to manage your business profile.",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Profile Error",
        description: "Failed to update your business profile.",
        variant: "destructive",
      });
    },
  });

  // Create social media post
  const postMutation = useMutation({
    mutationFn: async (data: typeof postForm) => {
      const response = await apiRequest('POST', '/api/social-posts', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post Scheduled!",
        description: "Your post will be shared across selected platforms.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/social-posts'] });
      setPostForm({
        title: '',
        content: '',
        platforms: ['facebook', 'instagram'],
        scheduledFor: '',
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) return;
      toast({
        title: "Post Failed",
        description: "Unable to schedule your post.",
        variant: "destructive",
      });
    },
  });

  // Auto-generate viral post
  const viralPostMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/generate-viral-post', {
        category: profile?.category || 'transport',
        businessName: profile?.businessName || 'My Business',
      });
      return response.json();
    },
    onSuccess: (data) => {
      setPostForm({
        title: data.title,
        content: data.content,
        platforms: ['facebook', 'instagram', 'tiktok'],
        scheduledFor: '',
      });
      toast({
        title: "Viral Post Generated! 🔥",
        description: "AI created a viral post for your business!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) return;
      toast({
        title: "Generation Failed",
        description: "Unable to generate viral post.",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate(profileForm);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and content.",
        variant: "destructive",
      });
      return;
    }
    postMutation.mutate(postForm);
  };

  // Pre-fill form if profile exists
  useEffect(() => {
    if (profile) {
      setProfileForm({
        businessName: profile.businessName || '',
        displayName: profile.displayName || '',
        category: profile.category || 'transport',
        description: profile.description || '',
        phone: profile.phone || '',
        whatsappNumber: profile.whatsappNumber || '',
        tagline: '', // Would need to add to query
        instagramHandle: '', // Would need to add to query
        services: [], // Would need to add to query
      });
    }
  }, [profile]);

  const categories = [
    { value: 'transport', label: '🚗 Transportation', emoji: '🚗' },
    { value: 'beauty', label: '💄 Beauty & Wellness', emoji: '💄' },
    { value: 'food', label: '🍽️ Food & Catering', emoji: '🍽️' },
    { value: 'entertainment', label: '🎵 Entertainment', emoji: '🎵' },
    { value: 'personal_services', label: '💼 Personal Services', emoji: '💼' },
    { value: 'fitness', label: '💪 Fitness & Health', emoji: '💪' },
    { value: 'education', label: '📚 Education & Training', emoji: '📚' },
    { value: 'other', label: '✨ Other Services', emoji: '✨' },
  ];

  return (
    <div className="min-h-screen text-foreground relative">
      {/* Starfield Background */}
      <div className="starfield fixed inset-0 z-0"></div>
      
      {/* Header */}
      <header className="glass-card border-b border-border relative z-10">
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
              <span className="text-2xl font-bold text-premium">🌟 Social Commerce</span>
              <Badge className="bg-purple-600 text-white">VIRAL</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Get Your Business Everywhere!</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-yellow-900/30 border-purple-500/30" data-testid="social-commerce-hero">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-300">
              <span className="text-3xl">🚀</span>
              <span className="text-2xl font-black">YOUR BUSINESS EVERYWHERE!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <h3 className="text-2xl font-black text-yellow-400 mb-4">
                📱 Facebook • Instagram • TikTok • Telegram • EVERYWHERE! 📱
              </h3>
              <p className="text-white mb-4 text-lg">
                <strong>Create your business profile and YardFlex automatically promotes you across ALL social media!</strong><br/>
                Everyone gets their own space to advertise. Age verified. Professional guidelines. Clean business.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-sm text-purple-300">Auto-Posting</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-sm text-pink-300">Targeted Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">💼</div>
                  <div className="text-sm text-yellow-300">Professional</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔞</div>
                  <div className="text-sm text-green-300">Age Verified</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="profile">🏪 My Business Profile</TabsTrigger>
            <TabsTrigger value="posts">📱 Viral Marketing</TabsTrigger>
            <TabsTrigger value="analytics">📊 Performance</TabsTrigger>
          </TabsList>

          {/* Business Profile Tab */}
          <TabsContent value="profile">
            <Card data-testid="business-profile-form">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🏪</span>
                  <span>Your Business Profile</span>
                  {profile?.isVerified && <Badge className="bg-green-600 text-white">VERIFIED</Badge>}
                  {profile?.isPremium && <Badge className="bg-yellow-600 text-black">PREMIUM</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={profileForm.businessName}
                        onChange={(e) => setProfileForm({...profileForm, businessName: e.target.value})}
                        placeholder="e.g., Marcus Mobile Repairs"
                        data-testid="input-business-name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="displayName">Display Name *</Label>
                      <Input
                        id="displayName"
                        value={profileForm.displayName}
                        onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                        placeholder="e.g., Marcus - Phone Doctor"
                        data-testid="input-display-name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Business Category *</Label>
                    <select 
                      id="category"
                      value={profileForm.category}
                      onChange={(e) => setProfileForm({...profileForm, category: e.target.value})}
                      className="w-full p-2 rounded border border-border bg-background text-foreground"
                      data-testid="select-category"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="tagline">Business Tagline</Label>
                    <Input
                      id="tagline"
                      value={profileForm.tagline}
                      onChange={(e) => setProfileForm({...profileForm, tagline: e.target.value})}
                      placeholder="e.g., Fast, Reliable, Professional Service"
                      data-testid="input-tagline"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Business Description *</Label>
                    <Textarea
                      id="description"
                      value={profileForm.description}
                      onChange={(e) => setProfileForm({...profileForm, description: e.target.value})}
                      placeholder="Tell people about your business, experience, and what makes you special..."
                      className="min-h-[120px]"
                      data-testid="textarea-description"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        placeholder="+1876-123-4567"
                        data-testid="input-phone"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        value={profileForm.whatsappNumber}
                        onChange={(e) => setProfileForm({...profileForm, whatsappNumber: e.target.value})}
                        placeholder="+1876-123-4567"
                        data-testid="input-whatsapp"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="instagram">Instagram Handle</Label>
                    <Input
                      id="instagram"
                      value={profileForm.instagramHandle}
                      onChange={(e) => setProfileForm({...profileForm, instagramHandle: e.target.value})}
                      placeholder="@yourbusiness"
                      data-testid="input-instagram"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={profileMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    data-testid="button-save-profile"
                  >
                    {profileMutation.isPending ? "Saving..." : "💾 Save My Business Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Viral Marketing Tab */}
          <TabsContent value="posts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Post */}
              <Card data-testid="create-post-form">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>🔥</span>
                    <span>Create Viral Post</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <Button 
                      onClick={() => viralPostMutation.mutate()}
                      disabled={viralPostMutation.isPending || !profile}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
                      data-testid="button-generate-viral"
                    >
                      {viralPostMutation.isPending ? "Generating..." : "✨ AI Generate Viral Post"}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      Or create your own post below
                    </p>
                  </div>

                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="postTitle">Post Title</Label>
                      <Input
                        id="postTitle"
                        value={postForm.title}
                        onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                        placeholder="🔥 Amazing Service Alert!"
                        data-testid="input-post-title"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="postContent">Post Content</Label>
                      <Textarea
                        id="postContent"
                        value={postForm.content}
                        onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                        placeholder="Tell people about your amazing service..."
                        className="min-h-[120px]"
                        data-testid="textarea-post-content"
                        required
                      />
                    </div>

                    <div>
                      <Label>Platforms</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {['facebook', 'instagram', 'tiktok', 'telegram'].map(platform => (
                          <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={postForm.platforms.includes(platform)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPostForm({...postForm, platforms: [...postForm.platforms, platform]});
                                } else {
                                  setPostForm({...postForm, platforms: postForm.platforms.filter(p => p !== platform)});
                                }
                              }}
                              data-testid={`checkbox-${platform}`}
                            />
                            <span className="capitalize">📱 {platform}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={postMutation.isPending}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold"
                      data-testid="button-post-everywhere"
                    >
                      {postMutation.isPending ? "Posting..." : "🚀 POST EVERYWHERE!"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card data-testid="recent-posts">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>📱</span>
                    <span>Your Recent Posts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {postsLoading ? (
                    <div className="text-center text-muted-foreground py-8">
                      Loading your posts...
                    </div>
                  ) : posts && posts.length > 0 ? (
                    <div className="space-y-4">
                      {posts.slice(0, 5).map((post) => (
                        <div key={post.id} className="p-4 bg-muted/20 rounded-lg" data-testid={`post-${post.id}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{post.title}</h4>
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                              {post.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{post.content.substring(0, 100)}...</p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              📱 {post.platforms.join(', ')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              👥 {post.totalReach} reach • 💬 {post.totalEngagement} engagement
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <div className="text-4xl mb-4">📱</div>
                      <p>No posts yet</p>
                      <p className="text-sm">Create your first viral post to get started!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card data-testid="analytics-reach">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {posts?.reduce((sum, post) => sum + post.totalReach, 0) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Reach</div>
                </CardContent>
              </Card>
              
              <Card data-testid="analytics-engagement">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-pink-500 mb-2">
                    {posts?.reduce((sum, post) => sum + post.totalEngagement, 0) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Engagement</div>
                </CardContent>
              </Card>
              
              <Card data-testid="analytics-posts">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {posts?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Posts Created</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}