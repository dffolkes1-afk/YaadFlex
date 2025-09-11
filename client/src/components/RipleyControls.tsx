import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRipleyTTS } from '@/hooks/use-ripley-tts';
import { useEffect, useRef } from 'react';

export function RipleyControls() {
  const { say, stop, pause, resume, supported } = useRipleyTTS();
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlsRef.current && window.RipleyTTS) {
      // Mount advanced controls
      window.RipleyTTS.mountControls(controlsRef.current);
    }
  }, []);

  if (!supported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 backdrop-blur rounded-lg shadow-lg p-4 border">
      <div className="flex items-center gap-2 mb-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => say("Welcome to YaadFlex! I can read everything on this page for you.")}
          data-testid="button-ripley-test"
        >
          <Volume2 className="h-4 w-4 mr-1" />
          Test Voice
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={stop}
          data-testid="button-ripley-stop"
        >
          <VolumeX className="h-4 w-4 mr-1" />
          Stop
        </Button>
      </div>
      <div ref={controlsRef} className="text-xs" />
    </div>
  );
}