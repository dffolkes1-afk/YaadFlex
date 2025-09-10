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
import { MusicPlayer } from '@/components/MusicPlayer';
import { MediaUploader } from '@/components/MediaUploader';
import { 
  Heart, MessageCircle, Share2, Camera, Video, Smile, Send, 
  MoreHorizontal, MapPin, Star, Zap, Home, Search, Plus, User,
  Music, Play, Volume2, TrendingUp, Fire, Globe, Headphones
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
  audioUrl?: string;
  musicTrack?: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    url: string;
  };
  location?: string;
  likes: number;
  comments: number;
  shares: number;
  plays?: number;
  isLiked: boolean;
  isVerified?: boolean;
  isTrending?: boolean;
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
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Sample data with multimedia - Better than TikTok!
  const samplePosts: Post[] = [
    {
      id: '1',
      userId: 'user1',
      username: 'marcus_driver',
      fullName: 'Marcus Thompson',
      profileImage: '',
      content: 'Just completed my 50th ride as a YaadFlex driver! 🚗 Love connecting with people across Kingston and earning that 85%. Big up to all the drivers making moves! #YaadFlexDriver #KingstonVibes',
      imageUrl: '',
      musicTrack: {
        id: 'track1',
        title: 'Drive Fi Life',
        artist: 'YaadFlex Riddim',
        duration: 180,
        url: 'https://example.com/drive-fi-life.mp3'
      },
      location: 'Kingston, Jamaica',
      likes: 147,
      comments: 32,
      shares: 25,
      plays: 1250,
      isLiked: false,
      isVerified: true,
      isTrending: true,
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      userId: 'user2',
      username: 'keisha_entrepreneur',
      fullName: 'Keisha Williams',
      profileImage: '',
      content: 'Started my online boutique through YaadFlex marketplace! 🛍️ From selling clothes to my friends to having my own storefront. Dreams do come true when you take action! Special thanks to the YaadFlex business team for the support. 💪🇯🇲',
      videoUrl: 'https://example.com/boutique-story.mp4',
      musicTrack: {
        id: 'track2',
        title: 'Boss Lady',
        artist: 'Keisha Williams',
        duration: 210,
        url: 'https://example.com/boss-lady.mp3'
      },
      location: 'Montego Bay, Jamaica',
      likes: 528,
      comments: 89,
      shares: 156,
      plays: 3400,
      isLiked: true,
      isVerified: false,
      isTrending: true,
      createdAt: '1 day ago'
    },
    {
      id: '3',
      userId: 'user3',
      username: 'chef_andre',
      fullName: 'Andre Campbell',
      profileImage: '',
      content: 'Food delivery through YaadFlex has changed my restaurant game! 📱 Orders coming in steady, customers happy, and my jerk chicken reaching all over the island. Technology meets tradition! 🔥',
      imageUrl: 'https://example.com/jerk-chicken.jpg',
      audioUrl: 'https://example.com/cooking-sounds.mp3',
      location: 'Spanish Town, Jamaica',
      likes: 289,
      comments: 45,
      shares: 78,
      plays: 890,
      isLiked: false,
      isVerified: true,
      isTrending: false,
      createdAt: '3 days ago'
    },
    {
      id: '4',
      userId: 'user4',
      username: 'yaad_musician',
      fullName: 'Dancehall Star',
      profileImage: '',
      content: '🎵 New track dropping on YaadFlex! This is why we better than Spotify - artists get 95% of streams! Support independent Caribbean music! 🇯🇲🎶 #YaadFlexMusic #BetterThanSpotify',
      musicTrack: {
        id: 'track3',
        title: 'Caribbean Digital',
        artist: 'Dancehall Star',
        duration: 195,
        url: 'https://example.com/caribbean-digital.mp3'
      },
      location: 'Global',
      likes: 1250,
      comments: 234,
      shares: 456,
      plays: 15600,
      isLiked: false,
      isVerified: true,
      isTrending: true,
      createdAt: '5 hours ago'
    },
    {
      id: '5',
      userId: 'user5',
      username: 'global_creator',
      fullName: 'Content Creator Pro',
      profileImage: '',
      content: '🌍 YaadFlex Social is taking over! Better engagement than Twitter, better music than TikTok, better community than Facebook! We building something special here family! 💪 #YaadFlexTakeover #SocialRevolution',
      videoUrl: 'https://example.com/social-revolution.mp4',
      musicTrack: {
        id: 'track4',
        title: 'Social Revolution',
        artist: 'YaadFlex Anthem',
        duration: 160,
        url: 'https://example.com/social-revolution.mp3'
      },
      location: 'Global Network',
      likes: 2150,
      comments: 567,
      shares: 890,
      plays: 28400,
      isLiked: true,
      isVerified: true,
      isTrending: true,
      createdAt: '12 hours ago'
    }
  ];

  const { data: posts = samplePosts } = useQuery<Post[]>({
    queryKey: ['/api/social/posts'],
    enabled: true // Enable real API calls
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
      
      {/* Header - Better than TikTok, Twitter, Facebook! */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 text-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  🎵 YaadFlex Social 
                  <Fire className="h-5 w-5 text-yellow-300" />
                </h1>
                <p className="text-xs opacity-90">
                  Better Music than TikTok • Better Community than Twitter • Better Features than Facebook
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                data-testid="button-trending"
              >
                <TrendingUp className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                data-testid="button-music"
              >
                <Music className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreatePost(true)}
                className="text-white hover:bg-white/20"
                data-testid="button-create-post"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
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
                    placeholder="Share your music, video, or story! Better than TikTok 🎵"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[100px] resize-none border-0 text-lg placeholder-gray-500 focus-visible:ring-0"
                    data-testid="textarea-post-content"
                  />
                  
                  {/* Media Uploader */}
                  <div className="mt-3">
                    <MediaUploader 
                      onMediaSelect={setSelectedMedia}
                      maxFiles={3}
                      showPreview={false}
                    />
                  </div>
                  
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
                        className="text-blue-600 hover:text-blue-700"
                        data-testid="button-add-video"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Video
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        data-testid="button-add-music"
                      >
                        <Music className="h-4 w-4 mr-1" />
                        Music
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
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{post.fullName}</span>
                          {post.isVerified && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                          {post.isTrending && <Fire className="h-3 w-3 text-red-500" />}
                        </div>
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

                {/* Music Player - Better than TikTok! */}
                {post.musicTrack && (
                  <div className="px-4 pb-3">
                    <MusicPlayer track={post.musicTrack} showFullPlayer={false} />
                  </div>
                )}

                {/* Video Player */}
                {post.videoUrl && (
                  <div className="px-4 pb-3">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video 
                        controls 
                        className="w-full h-auto"
                        poster={post.imageUrl}
                      >
                        <source src={post.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="absolute top-3 right-3">
                        <div className="bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Video
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Audio Player */}
                {post.audioUrl && !post.musicTrack && (
                  <div className="px-4 pb-3">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20 h-8 w-8 p-0"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Audio Recording</div>
                          <div className="text-xs opacity-75">Tap to play</div>
                        </div>
                        <Headphones className="h-4 w-4" />
                      </div>
                      <audio controls className="w-full mt-2" style={{filter: 'invert(1)'}}>
                        <source src={post.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}

                {/* Post Image */}
                {post.imageUrl && !post.videoUrl && (
                  <div className="px-4 pb-3">
                    <img src={post.imageUrl} alt="Post content" className="w-full rounded-lg" />
                  </div>
                )}

                {/* Post Actions - Better than Twitter/Facebook! */}
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
                        <span className="text-sm">{post.likes.toLocaleString()}</span>
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

                      {/* Play Count for Music/Video */}
                      {(post.musicTrack || post.videoUrl || post.audioUrl) && post.plays && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-gray-600 hover:text-purple-500"
                          data-testid={`button-plays-${post.id}`}
                        >
                          <Play className="h-4 w-4" />
                          <span className="text-sm">{post.plays.toLocaleString()}</span>
                        </Button>
                      )}

                      {/* Music/Audio specific actions */}
                      {(post.musicTrack || post.audioUrl) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-gray-600 hover:text-purple-500"
                          data-testid={`button-listen-${post.id}`}
                        >
                          <Volume2 className="h-4 w-4" />
                          <span className="text-sm">Listen</span>
                        </Button>
                      )}
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