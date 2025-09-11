import { ReactNode } from 'react';

interface AutoSpeakProps {
  children: ReactNode;
  className?: string;
}

export function AutoSpeak({ children, className }: AutoSpeakProps) {
  return (
    <div data-tts="auto" className={className}>
      {children}
    </div>
  );
}