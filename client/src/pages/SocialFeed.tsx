import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { 
  Heart, MessageCircle, Share2, Camera, Video, Smile, Send, 
  MoreHorizontal, MapPin, Star, Zap, Home, Search, Plus, User
} from 'lucide-react';

interface Post {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  profileImage?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  location?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  createdAt: string;
}

interface PostData {
  content: string;
  imageUrl?: string;
  location?: string;
}

export default function SocialFeed() {
  const [newPost, setNewPost] = useState<PostData>({ content: '' });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Sample data for now
  const samplePosts: Post[] = [
    {
      id: '1',
      userId: 'user1',
      username: 'marcus_driver',
      fullName: 'Marcus Thompson',
      profileImage: '',
      content: 'Just completed my 50th ride as a YaadFlex driver! 🚗 Love connecting with people across Kingston and earning that 85%. Big up to all the drivers making moves! #YaadFlexDriver #KingstonVibes',
      imageUrl: '',
      location: 'Kingston, Jamaica',
      likes: 47,
      comments: 12,
      shares: 5,
      isLiked: false,
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      userId: 'user2',
      username: 'keisha_entrepreneur',
      fullName: 'Keisha Williams',
      profileImage: '',
      content: 'Started my online boutique through YaadFlex marketplace! 🛍️ From selling clothes to my friends to having my own storefront. Dreams do come true when you take action! Special thanks to the YaadFlex business team for the support. 💪🇯🇲',
      imageUrl: '',
      location: 'Montego Bay, Jamaica',
      likes: 128,
      comments: 23,
      shares: 15,
      isLiked: true,
      createdAt: '1 day ago'
    },
    {
      id: '3',
      userId: 'user3',
      username: 'chef_andre',
      fullName: 'Andre Campbell',
      profileImage: '',
      content: 'Food delivery through YaadFlex has changed my restaurant game! 📱 Orders coming in steady, customers happy, and my jerk chicken reaching all over the island. Technology meets tradition! 🔥',
      imageUrl: '',
      location: 'Spanish Town, Jamaica',
      likes: 89,
      comments: 18,
      shares: 8,
      isLiked: false,
      createdAt: '3 days ago'
    }
  ];

  const { data: posts = samplePosts } = useQuery<Post[]>({
    queryKey: ['/api/social/posts'],
    enabled: false // Using sample data for now
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: PostData) => {
      const response = await apiRequest('POST', '/api/social/posts', postData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Posted! 🎉",
        description: "Your post is live on YaadFlex Social!",
      });
      setNewPost({ content: '' });
      setShowCreatePost(false);
      queryClient.invalidateQueries({ queryKey: ['/api/social/posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Post Failed",
        description: error.message || "Unable to share your post. Try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Empty Post",
        description: "Write something to share with the community!",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate(newPost);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const getProfileInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                YaadFlex Social
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                data-testid="button-search"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreatePost(true)}
                data-testid="button-create-post"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-profile"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        
        {/* Create Post Section */}
        {showCreatePost && (
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    ME
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="What's happening in your YaadFlex journey?"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[100px] resize-none border-0 text-lg placeholder-gray-500 focus-visible:ring-0"
                    data-testid="textarea-post-content"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleImageUpload}
                        className="text-purple-600 hover:text-purple-700"
                        data-testid="button-add-image"
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Photo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700"
                        data-testid="button-add-location"
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Location
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700"
                        data-testid="button-add-emoji"
                      >
                        <Smile className="h-4 w-4 mr-1" />
                        Feeling
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreatePost(false)}
                        data-testid="button-cancel-post"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCreatePost}
                        disabled={createPostMutation.isPending}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        data-testid="button-publish-post"
                      >
                        {createPostMutation.isPending ? 'Posting...' : 'Share'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Post Button */}
        {!showCreatePost && (
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    ME
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  className="flex-1 justify-start text-gray-500 h-12"
                  onClick={() => setShowCreatePost(true)}
                  data-testid="button-quick-post"
                >
                  What's your YaadFlex story today?
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                
                {/* Post Header */}
                <div className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        {post.profileImage ? (
                          <AvatarImage src={post.profileImage} alt={post.fullName} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                            {getProfileInitials(post.fullName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{post.fullName}</div>
                        <div className="text-xs text-gray-500">@{post.username} • {post.createdAt}</div>
                        {post.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {post.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-900 leading-relaxed">{post.content}</p>
                </div>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="px-4 pb-3">
                    <img src={post.imageUrl} alt="Post content" className="w-full rounded-lg" />
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-2 hover:text-red-500 ${post.isLiked ? 'text-red-500' : 'text-gray-600'}`}
                        data-testid={`button-like-${post.id}`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{post.likes}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                        data-testid={`button-comment-${post.id}`}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{post.comments}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-gray-600 hover:text-green-500"
                        data-testid={`button-share-${post.id}`}
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">{post.shares}</span>
                      </Button>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          <Button variant="outline" className="px-8">
            Load More Posts
          </Button>
        </div>

      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          // Handle file upload logic here
          console.log('File selected:', e.target.files?.[0]);
        }}
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-around">
            <Button variant="ghost" size="icon" className="text-purple-600">
              <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowCreatePost(true)}>
              <Plus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="h-16"></div> {/* Spacer for fixed nav */}
    </div>
  );
}