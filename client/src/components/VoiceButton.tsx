import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoice } from '@/hooks/use-voice';

interface VoiceButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function VoiceButton({ text, className, size = 'sm' }: VoiceButtonProps) {
  const { speak, stop, speaking } = useVoice();

  const handleClick = () => {
    if (speaking) {
      stop();
    } else {
      speak(text, { rate: 1.0 });
    }
  };

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant="outline"
      className={className}
      data-testid="button-voice"
    >
      {speaking ? (
        <>
          <VolumeX className="h-4 w-4 mr-1" />
          Stop
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4 mr-1" />
          Listen
        </>
      )}
    </Button>
  );
}