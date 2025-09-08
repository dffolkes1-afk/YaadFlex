import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Languages, Globe, Download, Settings } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface LanguageSettingsProps {
  userId?: string;
  onClose?: () => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en-JM', name: 'Jamaican English', flag: '🇯🇲', region: 'Caribbean' },
  { code: 'en-US', name: 'American English', flag: '🇺🇸', region: 'North America' },
  { code: 'es-HN', name: 'Honduran Spanish', flag: '🇭🇳', region: 'Central America' },
  { code: 'sw-KE', name: 'Kenyan Swahili', flag: '🇰🇪', region: 'East Africa' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷', region: 'Europe' },
  { code: 'pt-BR', name: 'Brazilian Portuguese', flag: '🇧🇷', region: 'South America' },
  { code: 'zh-CN', name: 'Simplified Chinese', flag: '🇨🇳', region: 'Asia' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', region: 'South Asia' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦', region: 'Middle East' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺', region: 'Eastern Europe' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪', region: 'Europe' },
];

const OFFLINE_PACKS = [
  { pair: 'en-es', name: 'English ↔ Spanish', size: '45 MB', downloaded: true },
  { pair: 'en-fr', name: 'English ↔ French', size: '42 MB', downloaded: false },
  { pair: 'en-sw', name: 'English ↔ Swahili', size: '38 MB', downloaded: false },
];

export function LanguageSettings({ userId, onClose }: LanguageSettingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [preferences, setPreferences] = useState({
    preferredLang: 'en-JM',
    fallbackLang: 'en-US',
    showAlwaysEnglishToggle: true,
    captionVoiceMessages: true,
    autoTranslateEnabled: true
  });

  const queryClient = useQueryClient();

  // Get current user language preferences
  const { data: userPreferences, isLoading } = useQuery({
    queryKey: ['/api/user/language-preferences'],
    enabled: !!userId
  });

  // Update preferences when data loads
  useEffect(() => {
    if (userPreferences) {
      setPreferences({
        preferredLang: (userPreferences as any).preferredLang || 'en-JM',
        fallbackLang: (userPreferences as any).fallbackLang || 'en-US',
        showAlwaysEnglishToggle: (userPreferences as any).showAlwaysEnglishToggle ?? true,
        captionVoiceMessages: (userPreferences as any).captionVoiceMessages ?? true,
        autoTranslateEnabled: (userPreferences as any).autoTranslateEnabled ?? true
      });
    }
  }, [userPreferences]);

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PATCH', '/api/user/language-preferences', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/language-preferences'] });
      // Could show success toast here
    }
  });

  // Download offline pack mutation
  const downloadPackMutation = useMutation({
    mutationFn: async (packId: string) => {
      const response = await apiRequest('POST', '/api/offline-packs/download', { packId });
      return response.json();
    }
  });

  const handleSavePreferences = () => {
    savePreferencesMutation.mutate(preferences);
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLanguageByCode = (code: string) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  };

  const groupedLanguages = filteredLanguages.reduce((acc, lang) => {
    if (!acc[lang.region]) acc[lang.region] = [];
    acc[lang.region].push(lang);
    return acc;
  }, {} as Record<string, typeof SUPPORTED_LANGUAGES>);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/95 border-accent/20" data-testid="language-settings">
      <CardHeader className="border-b border-accent/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Languages className="h-5 w-5 text-accent" />
            <span>Language Settings</span>
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close">
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <div className="animate-spin mr-2">🔄</div>
            Loading preferences...
          </div>
        ) : (
          <>
            {/* Primary Language Selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Preferred Language</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Messages will be translated to this language by default
                </p>
                <Select 
                  value={preferences.preferredLang} 
                  onValueChange={(value) => setPreferences({...preferences, preferredLang: value})}
                >
                  <SelectTrigger data-testid="select-preferred-lang">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(groupedLanguages).map(([region, languages]) => (
                      <div key={region}>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          {region}
                        </div>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <span className="flex items-center space-x-2">
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                
                {preferences.preferredLang && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <span className="mr-1">{getLanguageByCode(preferences.preferredLang)?.flag}</span>
                      {getLanguageByCode(preferences.preferredLang)?.name}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Fallback Language</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Used when your preferred language isn't available
                </p>
                <Select 
                  value={preferences.fallbackLang} 
                  onValueChange={(value) => setPreferences({...preferences, fallbackLang: value})}
                >
                  <SelectTrigger data-testid="select-fallback-lang">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Translation Behavior */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Translation Behavior</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Auto-translate messages</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically translate incoming messages
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.autoTranslateEnabled}
                    onCheckedChange={(checked) => setPreferences({...preferences, autoTranslateEnabled: checked})}
                    data-testid="switch-auto-translate"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Show "English" toggle</Label>
                    <p className="text-xs text-muted-foreground">
                      Always show option to view messages in English
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.showAlwaysEnglishToggle}
                    onCheckedChange={(checked) => setPreferences({...preferences, showAlwaysEnglishToggle: checked})}
                    data-testid="switch-english-toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Caption voice messages</Label>
                    <p className="text-xs text-muted-foreground">
                      Show text captions for voice messages
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.captionVoiceMessages}
                    onCheckedChange={(checked) => setPreferences({...preferences, captionVoiceMessages: checked})}
                    data-testid="switch-voice-captions"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Offline Translation Packs */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Offline Translation Packs</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Download language packs for offline translation in low-data situations
              </p>

              <div className="space-y-2">
                {OFFLINE_PACKS.map((pack) => (
                  <div key={pack.pair} className="flex items-center justify-between p-3 border border-accent/20 rounded-lg">
                    <div>
                      <div className="text-sm font-medium">{pack.name}</div>
                      <div className="text-xs text-muted-foreground">{pack.size}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {pack.downloaded ? (
                        <Badge variant="default" className="text-xs">Downloaded</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadPackMutation.mutate(pack.pair)}
                          disabled={downloadPackMutation.isPending}
                          data-testid={`button-download-${pack.pair}`}
                        >
                          {downloadPackMutation.isPending ? 'Downloading...' : 'Download'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button 
                onClick={handleSavePreferences} 
                disabled={savePreferencesMutation.isPending}
                className="w-full"
                data-testid="button-save"
              >
                {savePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}