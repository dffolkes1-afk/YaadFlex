import { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { LanguageSettings } from '@/components/LanguageSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Languages, MessageCircle, Settings } from 'lucide-react';

export function TranslatorDemoPage() {
  const [activeLanguage, setActiveLanguage] = useState('en-JM');
  const [showSettings, setShowSettings] = useState(false);

  const demoChats = [
    { id: 'global-jamaica', title: '🇯🇲 Jamaica Global Chat', participants: 45 },
    { id: 'global-honduras', title: '🇭🇳 Honduras Global Chat', participants: 32 },
    { id: 'global-kenya', title: '🇰🇪 Kenya Global Chat', participants: 67 },
    { id: 'global-multilingual', title: '🌍 International Mix', participants: 128 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Globe className="h-8 w-8 text-accent animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              YaadFlex Ultimate Translator
            </h1>
            <Languages className="h-8 w-8 text-accent animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground">
            Chat in any language, understand everyone
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Badge variant="secondary">🇯🇲 Jamaican Patois</Badge>
            <Badge variant="secondary">🇭🇳 Honduran Spanish</Badge>
            <Badge variant="secondary">🇰🇪 Kenyan Swahili</Badge>
            <Badge variant="secondary">+8 more languages</Badge>
          </div>
        </div>

        {showSettings ? (
          <LanguageSettings 
            onClose={() => setShowSettings(false)}
          />
        ) : (
          <Tabs defaultValue="demo" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="demo" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Live Demo</span>
              </TabsTrigger>
              <TabsTrigger value="chats" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Global Chats</span>
              </TabsTrigger>
              <TabsTrigger value="settings" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="demo" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Main Chat Interface */}
                <div>
                  <ChatInterface 
                    chatId="demo-global-chat"
                    chatTitle="🌍 Global Demo Chat"
                    userPreferredLang={activeLanguage}
                  />
                </div>

                {/* Language Demo Panel */}
                <div className="space-y-4">
                  <Card className="bg-card/95 border-accent/20">
                    <CardHeader>
                      <CardTitle className="text-lg">How It Works</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-accent/10 rounded-lg">
                        <div className="text-sm font-medium mb-2">🇯🇲 You type in Jamaican:</div>
                        <div className="italic">"Wah gwaan, mi deh yah!"</div>
                      </div>

                      <div className="flex justify-center">
                        <div className="text-accent">⬇️ Auto-Translation ⬇️</div>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 bg-secondary/20 rounded-lg text-sm">
                          <strong>🇭🇳 Honduran sees:</strong> "¡Hola, estoy aquí!"
                        </div>
                        <div className="p-3 bg-secondary/20 rounded-lg text-sm">
                          <strong>🇰🇪 Kenyan sees:</strong> "Habari, niko hapa!"
                        </div>
                        <div className="p-3 bg-secondary/20 rounded-lg text-sm">
                          <strong>🇺🇸 American sees:</strong> "What's up, I'm here!"
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground text-center">
                        Everyone can toggle to see Original, English, or Report issues
                      </div>
                    </CardContent>
                  </Card>

                  {/* Language Selector */}
                  <Card className="bg-card/95 border-accent/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Your Language</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { code: 'en-JM', flag: '🇯🇲', name: 'Jamaican' },
                          { code: 'es-HN', flag: '🇭🇳', name: 'Honduran' },
                          { code: 'sw-KE', flag: '🇰🇪', name: 'Kenyan' },
                          { code: 'en-US', flag: '🇺🇸', name: 'American' }
                        ].map(lang => (
                          <Button
                            key={lang.code}
                            variant={activeLanguage === lang.code ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveLanguage(lang.code)}
                            className="justify-start"
                            data-testid={`button-lang-${lang.code}`}
                          >
                            <span className="mr-2">{lang.flag}</span>
                            {lang.name}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chats" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {demoChats.map((chat) => (
                  <Card key={chat.id} className="bg-card/95 border-accent/20 hover:bg-card cursor-pointer transition-colors">
                    <CardContent className="p-4">
                      <div className="text-sm font-medium mb-2">{chat.title}</div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{chat.participants} active</span>
                        <Badge variant="outline" className="text-xs">Live</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <ChatInterface 
                chatId="global-multilingual"
                chatTitle="🌍 International Global Chat"
                userPreferredLang={activeLanguage}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}