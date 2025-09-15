import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { Camera, Heart, MessageCircle, Share2 } from 'lucide-react';
import { COMPANY_INFO } from '@shared/company';

interface SignupData {
  username: string;
  email: string;
  fullName: string;
  password: string;
}

export default function SocialSignup() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    email: '',
    fullName: '',
    password: ''
  });
  const { toast } = useToast();

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await apiRequest('POST', '/api/social/signup', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: `Welcome to ${COMPANY_INFO.COMPANY_NAME} Social! 🎉`,
        description: "Your account is ready. Start sharing your story!",
      });
      // Redirect to social feed
      if (typeof window !== 'undefined') {
        window.location.href = '/social-feed';
      }
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Unable to create account. Try again.",
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/social/login', data);
      return response.json();
    },
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/social-feed';
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      loginMutation.mutate({ email: formData.email, password: formData.password });
    } else {
      if (!formData.username || !formData.email || !formData.fullName || !formData.password) {
        toast({
          title: "Missing Information",
          description: "Please fill in all fields to continue.",
          variant: "destructive",
        });
        return;
      }
      signupMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 text-6xl">📱</div>
        <div className="absolute top-40 right-32 text-4xl">💬</div>
        <div className="absolute bottom-32 left-16 text-5xl">❤️</div>
        <div className="absolute bottom-20 right-20 text-3xl">📸</div>
        <div className="absolute top-60 left-1/2 text-4xl">🌟</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            YaadFlex Social
          </h1>
          <p className="text-gray-600">
            Share your Caribbean story with the world
          </p>
        </div>

        {/* Preview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
              <div>
                <div className="text-xs font-semibold">Marcus D.</div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 mb-2">Just picked up my first passenger as a YaadFlex driver! 🚗</div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>24</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>5</span>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded-full"></div>
              <div>
                <div className="text-xs font-semibold">Keisha M.</div>
                <div className="text-xs text-gray-500">1 day ago</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 mb-2">Beautiful sunset in Kingston today! 🌅</div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>89</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>12</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>{isLogin ? 'Welcome Back!' : 'Join YaadFlex Social'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to see what your friends are sharing' : 'Connect with drivers, customers, and the Caribbean community'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      data-testid="input-fullname"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Choose a unique username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      data-testid="input-username"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  data-testid="input-password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                disabled={signupMutation.isPending || loginMutation.isPending}
                data-testid="button-submit"
              >
                {(signupMutation.isPending || loginMutation.isPending) ? 'Please wait...' : (isLogin ? 'Sign In' : 'Join YaadFlex Social')}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  data-testid="button-toggle-mode"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>

              {!isLogin && (
                <div className="text-xs text-gray-500 text-center leading-relaxed">
                  By joining, you agree to our community guidelines: Be respectful, share authentic content, and help build a positive Caribbean community.
                </div>
              )}

            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to YaadFlex
          </Link>
        </div>

      </div>
    </div>
  );
}