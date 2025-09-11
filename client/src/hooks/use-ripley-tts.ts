import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    RipleyTTS: {
      init?: () => void;
      say: (text: string, opts?: { interrupt?: boolean }) => void;
      stop: () => void;
      pause: () => void;
      resume: () => void;
      setRate: (v: number) => void;
      setPitch: (v: number) => void;
      setVolume: (v: number) => void;
      selectVoice: (name: string) => void;
      mountControls: (container: HTMLElement) => void;
      supported: boolean;
      voices: SpeechSynthesisVoice[];
    };
  }
}

export function useRipleyTTS() {
  const inited = useRef(false);

  useEffect(() => {
    if (!inited.current && window.RipleyTTS) {
      window.RipleyTTS.init?.();
      inited.current = true;
      
      // Welcome message on first init
      setTimeout(() => {
        window.RipleyTTS?.say("Welcome to YaadFlex! The fair alternative where drivers earn 85 percent.", { interrupt: false });
      }, 1000);
    }
  }, []);

  return {
    say: (text: string, interrupt = true) => {
      window.RipleyTTS?.say(text, { interrupt });
    },
    stop: () => window.RipleyTTS?.stop(),
    pause: () => window.RipleyTTS?.pause(),
    resume: () => window.RipleyTTS?.resume(),
    setRate: (rate: number) => window.RipleyTTS?.setRate(rate),
    supported: window.RipleyTTS?.supported || false
  };
}