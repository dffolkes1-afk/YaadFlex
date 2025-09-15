import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function VoiceTestPanel() {
  const [text, setText] = useState("Welcome to YaadFlex! Your smart hustle hub is here.");
  const [tone, setTone] = useState("corporate");
  const [gender, setGender] = useState("male");
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const speakText = async (service: 'yaadflex-voice' | 'azure' | 'elevenlabs') => {
    try {
      setIsPlaying(true);
      
      let endpoint = '/api/tts/azure';
      let body: any = { text };

      if (service === 'yaadflex-voice') {
        endpoint = '/api/tts/yaadflex-voice';
        body = { text, tone, gender };
      } else if (service === 'elevenlabs') {
        endpoint = '/api/tts/elevenlabs';
        body = { text };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audio.onended = () => setIsPlaying(false);
        await audio.play();
        
        toast({
          title: "🎤 Voice Playing!",
          description: `${service} voice is now speaking your text.`,
        });
      } else {
        throw new Error(`Voice service error: ${response.status}`);
      }
    } catch (error) {
      setIsPlaying(false);
      toast({
        title: "Voice Error",
        description: "Voice system not configured yet. Add your API keys to enable.",
        variant: "destructive",
      });
    }
  };

  const quickPhrases = [
    "Welcome to YaadFlex! Your smart hustle hub is here.",
    "Your ride is confirmed and driver is on the way.",
    "Payment processed successfully. Thank you!",
    "YaadFlex - One App, Two Countries, Infinite Possibilities."
  ];

  return (
    <Card className="border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-2xl">🎤</span>
          <span>YaadFlex Voice System</span>
          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
            TTS READY
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Text Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Text to Speak:</label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            data-testid="input-voice-text"
          />
        </div>

        {/* Quick Phrases */}
        <div className="grid grid-cols-2 gap-2">
          {quickPhrases.map((phrase, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setText(phrase)}
              className="text-xs"
              data-testid={`button-phrase-${index}`}
            >
              {phrase.slice(0, 20)}...
            </Button>
          ))}
        </div>

        {/* Voice Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tone:</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger data-testid="select-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laid-back">🌴 Laid-back</SelectItem>
                <SelectItem value="corporate">💼 Corporate</SelectItem>
                <SelectItem value="energetic">⚡ Energetic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Voice:</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger data-testid="select-gender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">👨 Male</SelectItem>
                <SelectItem value="female">👩 Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Voice Service Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => speakText('yaadflex-voice')}
            disabled={isPlaying || !text.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
            data-testid="button-yaadflex-voice"
          >
            {isPlaying ? "🎵" : "🎤"} YaadFlex Voice
          </Button>
          
          <Button
            onClick={() => speakText('azure')}
            disabled={isPlaying || !text.trim()}
            variant="secondary"
            data-testid="button-azure-voice"
          >
            {isPlaying ? "🎵" : "☁️"} Azure TTS
          </Button>
          
          <Button
            onClick={() => speakText('elevenlabs')}
            disabled={isPlaying || !text.trim()}
            variant="outline"
            data-testid="button-elevenlabs-voice"
          >
            {isPlaying ? "🎵" : "🤖"} ElevenLabs
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-yellow-900/20 p-3 rounded">
          <strong>Setup Required:</strong> Add AZURE_SPEECH_KEY and ELEVENLABS_API_KEY to environment variables to enable voice synthesis.
        </div>
      </CardContent>
    </Card>
  );
}