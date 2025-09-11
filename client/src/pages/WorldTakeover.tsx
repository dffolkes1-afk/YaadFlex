import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Globe, Plane, MapPin, Users, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorldTakeover() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const { toast } = useToast();
  
  const countries = [
    { name: 'Jamaica 🇯🇲', code: 'JM', status: 'LIVE', users: '250K+' },
    { name: 'Canada 🇨🇦', code: 'CA', status: 'LIVE', users: '180K+' },
    { name: 'USA 🇺🇸', code: 'US', status: 'LAUNCHING', users: '500K waiting' },
    { name: 'UK 🇬🇧', code: 'GB', status: 'LAUNCHING', users: '200K waiting' },
    { name: 'Nigeria 🇳🇬', code: 'NG', status: 'COMING', users: 'Pre-launch' },
    { name: 'Ghana 🇬🇭', code: 'GH', status: 'COMING', users: 'Pre-launch' },
    { name: 'Trinidad 🇹🇹', code: 'TT', status: 'COMING', users: 'Pre-launch' },
    { name: 'Barbados 🇧🇧', code: 'BB', status: 'COMING', users: 'Pre-launch' },
  ];

  const handleCountryLaunch = (country: string) => {
    setSelectedCountry(country);
    toast({
      title: `${country} Activated! 🚀`,
      description: "YaadFlex is spreading across the nation!",
    });
  };

  const handleWorldLaunch = () => {
    toast({
      title: "WORLD TAKEOVER INITIATED! 🌍",
      description: "YaadFlex is going GLOBAL!",
    });
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Globe className="h-16 w-16 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
            YAADFLEX WORLD TAKEOVER
          </h1>
          <p className="text-xl text-muted-foreground">
            From Jamaica & Canada to the ENTIRE WORLD
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Global Users</p>
                  <p className="text-3xl font-bold">2.5M+</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Countries</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <MapPin className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                  <p className="text-3xl font-bold">285%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Country Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Global Launch Status</CardTitle>
            <CardDescription>YaadFlex is taking over, one country at a time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {countries.map((country) => (
                <motion.div
                  key={country.code}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      country.status === 'LIVE' 
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20' 
                        : country.status === 'LAUNCHING'
                        ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20'
                        : 'border-gray-300'
                    }`}
                    onClick={() => handleCountryLaunch(country.name)}
                  >
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl mb-2">{country.name}</p>
                      <p className={`text-sm font-bold mb-1 ${
                        country.status === 'LIVE' ? 'text-green-600' :
                        country.status === 'LAUNCHING' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {country.status}
                      </p>
                      <p className="text-xs text-muted-foreground">{country.users}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-primary">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Jamaica & Canada Leading
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                The revolution started here - now we're taking it global
              </p>
              <Button
                className="w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:opacity-90"
                size="lg"
                onClick={() => {
                  toast({
                    title: "Jamaica & Canada STRONG! 💪",
                    description: "Leading the global revolution!",
                  });
                }}
                data-testid="button-jamaica-canada"
              >
                Jamaica + Canada Power
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Launch Worldwide NOW
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                One button to take YaadFlex to every corner of Earth
              </p>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                size="lg"
                onClick={handleWorldLaunch}
                data-testid="button-world-launch"
              >
                ACTIVATE WORLD TAKEOVER
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Simple Share Section */}
        <Card>
          <CardHeader>
            <CardTitle>Share YaadFlex Worldwide</CardTitle>
            <CardDescription>Simple. Direct. Powerful.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="font-medium mb-2">Your Global Link:</p>
                <code className="text-sm bg-background p-2 rounded block">
                  {window.location.origin}
                </code>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin);
                    toast({
                      title: "Link Copied!",
                      description: "Share it with the world!",
                    });
                  }}
                  data-testid="button-copy"
                >
                  Copy Link
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const text = `YaadFlex - THE FAIR ALTERNATIVE! 🌍 From Jamaica & Canada to the WORLD! Join the revolution: ${window.location.origin}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  data-testid="button-whatsapp"
                >
                  WhatsApp
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const text = `YaadFlex is taking over! 🚀 ${window.location.origin}`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  data-testid="button-twitter"
                >
                  Twitter/X
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Statement */}
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-3">THE MISSION</h2>
          <p className="text-lg">
            From the heart of Jamaica 🇯🇲 and the strength of Canada 🇨🇦
          </p>
          <p className="text-lg mt-2">
            YaadFlex is taking on the ENTIRE WORLD 🌍
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            No tricks. No gimmicks. Just the BEST app spreading naturally.
          </p>
        </div>
      </motion.div>
    </div>
  );
}