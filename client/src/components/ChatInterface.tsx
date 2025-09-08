import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TranslatedMessage } from './TranslatedMessage';
import { Send, Globe, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ChatInterfaceProps {
  chatId: string;
  chatTitle?: string;
  userPreferredLang?: string;
}

export function ChatInterface({ chatId, chatTitle = "Global Chat", userPreferredLang = 'en-JM' }: ChatInterfaceProps) {
  const [messageText, setMessageText] = useState('');
  const [detectedLang, setDetectedLang] = useState('en-JM');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Get chat messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/chats', chatId, 'messages', { viewer_lang: userPreferredLang }],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time feel
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      const response = await apiRequest('POST', '/api/messages', messageData);
      return response.json();
    },
    onSuccess: () => {
      setMessageText('');
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['/api/chats', chatId, 'messages'] });
    }
  });

  // Join chat mutation
  const joinChatMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/chats', { chatId, participantIds: [] });
      return response.json();
    }
  });

  // Auto-join chat on mount
  useEffect(() => {
    joinChatMutation.mutate();
  }, [chatId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simple language detection (placeholder - would use real service)
  const detectLanguage = (text: string): string => {
    const patterns = {
      'es-HN': /\b(hola|como|estas|donde|que|cuando|quien|porque)\b/i,
      'sw-KE': /\b(habari|nzuri|wapi|nini|lini|nani|kwa|nini)\b/i,
      'fr-FR': /\b(bonjour|comment|allez|vous|ou|quand|qui|pourquoi)\b/i,
      'pt-BR': /\b(ola|como|vai|onde|que|quando|quem|porque)\b/i,
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }
    return userPreferredLang;
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const detected = detectLanguage(messageText);
    setDetectedLang(detected);

    sendMessageMutation.mutate({
      chatId,
      messageType: 'text',
      originalText: messageText,
      originalLang: detected,
      langConfidence: 0.95
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getLanguageFlag = (langCode: string) => {
    const flagMap: { [key: string]: string } = {
      'en-JM': '🇯🇲', 'en-US': '🇺🇸', 'es-HN': '🇭🇳', 'sw-KE': '🇰🇪',
      'fr-FR': '🇫🇷', 'pt-BR': '🇧🇷', 'zh-CN': '🇨🇳', 'hi-IN': '🇮🇳'
    };
    return flagMap[langCode] || '🌐';
  };

  return (
    <Card className="h-[600px] flex flex-col bg-card/95 border-accent/20" data-testid="chat-interface">
      {/* Chat Header */}
      <CardHeader className="border-b border-accent/20 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-accent" />
            <span>{chatTitle}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Global Translation
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getLanguageFlag(userPreferredLang)} {userPreferredLang}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-2" data-testid="messages-area">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="animate-spin mr-2">🔄</div>
            Loading messages...
          </div>
        ) : (messages as any[]).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Globe className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-center">
              Start a conversation in any language!<br />
              <span className="text-sm">Messages will be auto-translated for everyone.</span>
            </p>
          </div>
        ) : (
          (messages as any[]).map((message: any) => (
            <TranslatedMessage
              key={message.id}
              messageId={message.id}
              originalText={message.originalText || ''}
              originalLang={message.originalLang || 'en-JM'}
              senderName={message.senderName || 'Anonymous'}
              timestamp={new Date(message.createdAt).toLocaleTimeString()}
              userPreferredLang={userPreferredLang}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="border-t border-accent/20 p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message in any language..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessageMutation.isPending}
              className="pr-12"
              data-testid="input-message"
            />
            {messageText && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                {getLanguageFlag(detectedLang)}
              </div>
            )}
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            data-testid="button-send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Language Detection Hint */}
        {messageText && detectedLang !== userPreferredLang && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center space-x-1">
            <span>Detected: {getLanguageFlag(detectedLang)} {detectedLang}</span>
            <span>•</span>
            <span>Others will see this in their language</span>
          </div>
        )}
      </div>
    </Card>
  );
}