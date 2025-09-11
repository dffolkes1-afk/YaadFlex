import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRipleyTTS } from '@/hooks/use-ripley-tts';

export default function RipleyTest() {
  const [testText, setTestText] = useState('Welcome to RIPLEY test page! I can read everything on this screen. Try typing in the box below or clicking the buttons to hear me talk!');
  const { say, stop } = useRipleyTTS();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">🎤 RIPLEY Voice Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Auto-read section - RIPLEY reads this automatically when it changes */}
          <div data-tts="auto" className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500">
            <h2 className="text-xl font-bold mb-2">📢 AUTO-READ ZONE (RIPLEY Reads This Automatically)</h2>
            <p className="text-lg">{testText}</p>
          </div>

          {/* Test buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => {
                const msg = "RIPLEY here! I'm reading everything for you. YaadFlex is the fair alternative where drivers earn 85 percent!";
                setTestText(msg);
                say(msg);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-test-ripley"
            >
              🔊 Test RIPLEY Voice
            </Button>
            
            <Button 
              onClick={() => {
                const msg = "Breaking news! YaadFlex Credits system is live! Top up with 9 payment methods including Digicel and Flow!";
                setTestText(msg);
                say(msg);
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-news"
            >
              📰 Read Latest News
            </Button>
            
            <Button 
              onClick={() => {
                const msg = "Welcome to Jamaica! The land of wood and water! YaadFlex taking Jamaica to the moon! FLEX FLEX GLOBAL FLEX!";
                setTestText(msg);
                say(msg);
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              data-testid="button-jamaica"
            >
              🇯🇲 Jamaica Pride
            </Button>
            
            <Button 
              onClick={stop}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-stop"
            >
              🛑 Stop RIPLEY
            </Button>
          </div>

          {/* Type to speak */}
          <div className="space-y-2">
            <label className="font-bold">Type Something for RIPLEY to Read:</label>
            <Textarea 
              placeholder="Type here and click 'Make RIPLEY Read This' button..."
              className="min-h-[100px]"
              id="custom-text"
              data-testid="textarea-custom"
            />
            <Button 
              onClick={() => {
                const textarea = document.getElementById('custom-text') as HTMLTextAreaElement;
                if (textarea?.value) {
                  setTestText(textarea.value);
                  say(textarea.value);
                }
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              data-testid="button-read-custom"
            >
              🎙️ Make RIPLEY Read This
            </Button>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-bold mb-2">How RIPLEY Works:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>The GREEN BOX above auto-reads when text changes</li>
              <li>Click any button to hear different messages</li>
              <li>Type your own text and make RIPLEY read it</li>
              <li>Focus on any input field to hear what's in it</li>
              <li>Use controls at bottom-right to change voice settings</li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}