import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag, MessageCircle, AlertTriangle, Languages } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface TranslatedMessageProps {
  messageId: string;
  originalText: string;
  originalLang: string;
  senderName: string;
  timestamp: string;
  userPreferredLang?: string;
  onReport?: (messageId: string) => void;
}

export function TranslatedMessage({ 
  messageId, 
  originalText, 
  originalLang, 
  senderName, 
  timestamp, 
  userPreferredLang = 'en-JM',
  onReport 
}: TranslatedMessageProps) {
  const [viewMode, setViewMode] = useState<'translated' | 'original' | 'english'>('translated');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportData, setReportData] = useState({
    issueType: 'accuracy',
    suggestedTranslation: '',
    description: ''
  });

  const queryClient = useQueryClient();

  // Get translation for user's preferred language
  const getTranslationMutation = useMutation({
    mutationFn: async (targetLang: string) => {
      const response = await apiRequest('POST', `/api/messages/${messageId}/translate`, { targetLang });
      return response.json();
    }
  });

  // Get English translation
  const getEnglishMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/messages/${messageId}/translate`, { targetLang: 'en-US' });
      return response.json();
    }
  });

  // Report translation mutation
  const reportMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', `/api/messages/${messageId}/report-translation`, data);
      return response.json();
    },
    onSuccess: () => {
      setIsReportDialogOpen(false);
      setReportData({ issueType: 'accuracy', suggestedTranslation: '', description: '' });
      // Could show success toast here
    }
  });

  // Auto-fetch translations when view mode changes
  const [preferredTranslation, setPreferredTranslation] = useState<any>(null);
  const [englishTranslation, setEnglishTranslation] = useState<any>(null);

  useEffect(() => {
    if (viewMode === 'translated' && userPreferredLang !== originalLang && !preferredTranslation) {
      getTranslationMutation.mutate(userPreferredLang, {
        onSuccess: (data) => setPreferredTranslation(data)
      });
    }
  }, [viewMode, userPreferredLang, originalLang, messageId]);

  useEffect(() => {
    if (viewMode === 'english' && originalLang !== 'en-US' && !englishTranslation) {
      getEnglishMutation.mutate(undefined, {
        onSuccess: (data) => setEnglishTranslation(data)
      });
    }
  }, [viewMode, originalLang, messageId]);

  const handleReport = () => {
    const translationId = viewMode === 'translated' 
      ? preferredTranslation?.id 
      : englishTranslation?.id;

    if (!translationId) return;

    reportMutation.mutate({
      translationId,
      issueType: reportData.issueType,
      incorrectTranslation: getCurrentDisplayText(),
      suggestedTranslation: reportData.suggestedTranslation,
      reportDescription: reportData.description
    });
  };

  const getCurrentDisplayText = () => {
    switch (viewMode) {
      case 'original':
        return originalText;
      case 'english':
        return englishTranslation?.translatedText || originalText;
      case 'translated':
      default:
        return preferredTranslation?.translatedText || originalText;
    }
  };

  const getLanguageFlag = (langCode: string) => {
    const flagMap: { [key: string]: string } = {
      'en-JM': '🇯🇲', 'en-US': '🇺🇸', 'es-HN': '🇭🇳', 'sw-KE': '🇰🇪',
      'fr-FR': '🇫🇷', 'pt-BR': '🇧🇷', 'zh-CN': '🇨🇳', 'hi-IN': '🇮🇳',
      'ar-SA': '🇸🇦', 'ru-RU': '🇷🇺', 'de-DE': '🇩🇪'
    };
    return flagMap[langCode] || '🌐';
  };

  const isLoading = (viewMode === 'translated' && getTranslationMutation.isPending) || 
                   (viewMode === 'english' && getEnglishMutation.isPending);

  return (
    <Card className="mb-4 bg-card/90 border-accent/20" data-testid={`message-${messageId}`}>
      <CardContent className="p-4">
        {/* Message Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-foreground">{senderName}</span>
            <span className="text-sm text-muted-foreground">{timestamp}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {getLanguageFlag(originalLang)} {originalLang}
          </div>
        </div>

        {/* Message Content */}
        <div className="mb-3">
          {isLoading ? (
            <div className="text-muted-foreground animate-pulse" data-testid="loading-translation">
              🔄 Translating...
            </div>
          ) : (
            <p className="text-foreground leading-relaxed" data-testid="message-text">
              {getCurrentDisplayText()}
            </p>
          )}
        </div>

        {/* Translation Controls */}
        {originalLang !== userPreferredLang && (
          <div className="flex items-center justify-between pt-2 border-t border-accent/20">
            <div className="text-xs text-muted-foreground flex items-center space-x-1">
              <Languages className="h-3 w-3" />
              <span>
                {viewMode === 'original' 
                  ? `Original in ${originalLang}`
                  : `Translated from ${originalLang}`
                }
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode Toggles */}
              <Button
                variant={viewMode === 'original' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('original')}
                data-testid="button-original"
              >
                Original
              </Button>
              
              <Button
                variant={viewMode === 'english' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('english')}
                data-testid="button-english"
              >
                English
              </Button>

              <Button
                variant={viewMode === 'translated' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('translated')}
                data-testid="button-translated"
              >
                {getLanguageFlag(userPreferredLang)} My Language
              </Button>

              {/* Report Translation */}
              <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid="button-report"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="report-dialog">
                  <DialogHeader>
                    <DialogTitle>Report Translation Issue</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Issue Type</label>
                      <Select 
                        value={reportData.issueType} 
                        onValueChange={(value) => setReportData({...reportData, issueType: value})}
                      >
                        <SelectTrigger data-testid="select-issue-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accuracy">Translation Accuracy</SelectItem>
                          <SelectItem value="context">Missing Context</SelectItem>
                          <SelectItem value="offensive">Offensive Content</SelectItem>
                          <SelectItem value="technical">Technical Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Suggested Translation (Optional)</label>
                      <Textarea
                        placeholder="How should this be translated?"
                        value={reportData.suggestedTranslation}
                        onChange={(e) => setReportData({...reportData, suggestedTranslation: e.target.value})}
                        data-testid="textarea-suggestion"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe the issue..."
                        value={reportData.description}
                        onChange={(e) => setReportData({...reportData, description: e.target.value})}
                        data-testid="textarea-description"
                      />
                    </div>

                    <Button 
                      onClick={handleReport} 
                      disabled={reportMutation.isPending}
                      className="w-full"
                      data-testid="button-submit-report"
                    >
                      {reportMutation.isPending ? 'Reporting...' : 'Report Issue'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}