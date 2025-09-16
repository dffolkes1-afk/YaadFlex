import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRipleyTTS } from '@/hooks/use-ripley-tts';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Settings, 
  Save, 
  History, 
  Trash2,
  Copy,
  Download,
  Upload,
  BookOpen,
  Mic,
  VolumeX
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SavedPhrase {
  id: string;
  text: string;
  title: string;
  dateCreated: Date;
}

interface HistoryItem {
  id: string;
  text: string;
  timestamp: Date;
}

export default function VoiceWorkspace() {
  // Core voice state
  const [currentText, setCurrentText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Voice settings
  const [voiceRate, setVoiceRate] = useState([1.0]);
  const [voicePitch, setVoicePitch] = useState([1.0]);
  const [voiceVolume, setVoiceVolume] = useState([1.0]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  
  // Workspace features
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  const { say, stop, pause, resume, setRate, supported } = useRipleyTTS();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('voiceWorkspace_savedPhrases');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((p: any) => ({
          ...p,
          dateCreated: new Date(p.dateCreated)
        }));
        setSavedPhrases(parsed);
      } catch (e) {
        console.error('Error loading saved phrases:', e);
      }
    }
    
    const savedHistory = localStorage.getItem('voiceWorkspace_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory).map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        }));
        setHistory(parsed);
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('voiceWorkspace_savedPhrases', JSON.stringify(savedPhrases));
  }, [savedPhrases]);
  
  useEffect(() => {
    localStorage.setItem('voiceWorkspace_history', JSON.stringify(history));
  }, [history]);

  // Get available voices
  const getAvailableVoices = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  };

  const handlePlay = () => {
    if (!currentText.trim()) {
      toast({
        title: "Nothing to Read",
        description: "Please type some text first.",
        variant: "destructive",
      });
      return;
    }

    if (isPaused) {
      resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      // Set voice parameters
      if (window.RipleyTTS) {
        window.RipleyTTS.setRate(voiceRate[0]);
        window.RipleyTTS.setPitch(voicePitch[0]);
        window.RipleyTTS.setVolume(voiceVolume[0]);
        if (selectedVoice) {
          window.RipleyTTS.selectVoice(selectedVoice);
        }
      }
      
      say(currentText);
      setIsPlaying(true);
      
      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        text: currentText,
        timestamp: new Date()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 49)]); // Keep last 50 items
      
      toast({
        title: "Playing",
        description: "Reading your text aloud...",
      });
    }
  };

  const handlePause = () => {
    pause();
    setIsPlaying(false);
    setIsPaused(true);
    toast({
      title: "Paused",
      description: "Voice reading paused.",
    });
  };

  const handleStop = () => {
    stop();
    setIsPlaying(false);
    setIsPaused(false);
    toast({
      title: "Stopped",
      description: "Voice reading stopped.",
    });
  };

  const handleSavePhrase = () => {
    if (!currentText.trim()) return;
    
    const title = prompt('Enter a name for this phrase:');
    if (!title) return;
    
    const newPhrase: SavedPhrase = {
      id: Date.now().toString(),
      text: currentText,
      title: title.trim(),
      dateCreated: new Date()
    };
    
    setSavedPhrases(prev => [newPhrase, ...prev]);
    toast({
      title: "Phrase Saved",
      description: `"${title}" has been saved to your collection.`,
    });
  };

  const loadPhrase = (phrase: SavedPhrase) => {
    setCurrentText(phrase.text);
    toast({
      title: "Phrase Loaded",
      description: `"${phrase.title}" loaded into workspace.`,
    });
  };

  const deletePhrase = (id: string) => {
    setSavedPhrases(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Phrase Deleted",
      description: "Phrase removed from your collection.",
    });
  };

  const loadFromHistory = (item: HistoryItem) => {
    setCurrentText(item.text);
    toast({
      title: "Loaded from History",
      description: "Text loaded into workspace.",
    });
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Voice reading history has been cleared.",
    });
  };

  const exportText = () => {
    const blob = new Blob([currentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-workspace-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importText = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCurrentText(content);
          toast({
            title: "Text Imported",
            description: "File content loaded into workspace.",
          });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (!supported) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VolumeX className="h-5 w-5" />
              Voice Not Supported
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Your browser doesn't support text-to-speech functionality. 
              Please try using Chrome, Safari, or Edge for the best experience.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Voice Workspace
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Type your text and press play - Professional text-to-speech workspace
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Mic className="h-3 w-3 mr-1" />
                Voice Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Text Input</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={importText}
                      data-testid="button-import-text"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Import
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportText}
                      disabled={!currentText.trim()}
                      data-testid="button-export-text"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  ref={textareaRef}
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="Type your text here and press play to hear it read aloud..."
                  className="min-h-[300px] text-lg leading-relaxed"
                  data-testid="textarea-voice-text"
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {currentText.length} characters, ~{Math.ceil(currentText.length / 5)} words
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSavePhrase}
                    disabled={!currentText.trim()}
                    data-testid="button-save-phrase"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Phrase
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Voice Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Voice Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4 mb-6">
                  {/* Main Play Button */}
                  <Button
                    onClick={handlePlay}
                    disabled={!currentText.trim() || isPlaying}
                    size="lg"
                    className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 text-white"
                    data-testid="button-voice-play"
                  >
                    <Play className="h-8 w-8" />
                  </Button>

                  {/* Pause Button */}
                  <Button
                    onClick={handlePause}
                    disabled={!isPlaying}
                    size="lg"
                    className="w-16 h-16 rounded-full"
                    variant="outline"
                    data-testid="button-voice-pause"
                  >
                    <Pause className="h-6 w-6" />
                  </Button>

                  {/* Stop Button */}
                  <Button
                    onClick={handleStop}
                    disabled={!isPlaying && !isPaused}
                    size="lg"
                    className="w-16 h-16 rounded-full"
                    variant="outline"
                    data-testid="button-voice-stop"
                  >
                    <Square className="h-6 w-6" />
                  </Button>
                </div>

                {/* Status */}
                <div className="text-center mb-4">
                  <Badge 
                    variant={isPlaying ? "default" : isPaused ? "secondary" : "outline"}
                    data-testid="badge-voice-status"
                  >
                    {isPlaying ? "Playing" : isPaused ? "Paused" : "Ready"}
                  </Badge>
                </div>

                {/* Voice Settings */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Speed Control */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Speed: {voiceRate[0].toFixed(1)}x
                    </label>
                    <Slider
                      value={voiceRate}
                      onValueChange={setVoiceRate}
                      max={2.0}
                      min={0.5}
                      step={0.1}
                      data-testid="slider-voice-rate"
                    />
                  </div>

                  {/* Volume Control */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Volume: {Math.round(voiceVolume[0] * 100)}%
                    </label>
                    <Slider
                      value={voiceVolume}
                      onValueChange={setVoiceVolume}
                      max={1.0}
                      min={0.1}
                      step={0.1}
                      data-testid="slider-voice-volume"
                    />
                  </div>

                  {/* Pitch Control */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Pitch: {voicePitch[0].toFixed(1)}
                    </label>
                    <Slider
                      value={voicePitch}
                      onValueChange={setVoicePitch}
                      max={2.0}
                      min={0.5}
                      step={0.1}
                      data-testid="slider-voice-pitch"
                    />
                  </div>
                </div>

                {/* Voice Selection */}
                <div className="mt-4">
                  <label className="text-sm font-medium mb-2 block">Voice Selection</label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger data-testid="select-voice">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableVoices().map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Saved Phrases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Saved Phrases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {savedPhrases.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No saved phrases yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {savedPhrases.map((phrase) => (
                        <div
                          key={phrase.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{phrase.title}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePhrase(phrase.id)}
                              data-testid={`button-delete-phrase-${phrase.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {phrase.text.substring(0, 100)}...
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadPhrase(phrase)}
                              data-testid={`button-load-phrase-${phrase.id}`}
                            >
                              Load
                            </Button>
                            <span className="text-xs text-gray-500">
                              {phrase.dateCreated.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    History
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      data-testid="button-clear-history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {history.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No reading history yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => loadFromHistory(item)}
                          data-testid={`history-item-${item.id}`}
                        >
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.text.substring(0, 80)}...
                          </p>
                          <span className="text-xs text-gray-500">
                            {item.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setCurrentText("Welcome to YaadFlex Voice Workspace! This is a professional text-to-speech interface where you can type any content and have it read aloud with customizable voice settings.")}
                  data-testid="button-demo-text"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Load Demo Text
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentText("");
                    textareaRef.current?.focus();
                  }}
                  data-testid="button-clear-text"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Workspace
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    navigator.clipboard.writeText(currentText);
                    toast({
                      title: "Copied",
                      description: "Text copied to clipboard.",
                    });
                  }}
                  disabled={!currentText.trim()}
                  data-testid="button-copy-text"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}