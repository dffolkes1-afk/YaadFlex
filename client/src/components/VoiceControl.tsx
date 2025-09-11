import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VoiceControl() {
  const [isListening, setIsListening] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Simple voice navigation
    if (lowerCommand.includes('home')) {
      window.location.href = '/';
    } else if (lowerCommand.includes('ride') || lowerCommand.includes('drive')) {
      window.location.href = '/ride';
    } else if (lowerCommand.includes('wallet') || lowerCommand.includes('money')) {
      window.location.href = '/wallet';
    } else if (lowerCommand.includes('shop') || lowerCommand.includes('market')) {
      window.location.href = '/marketplace';
    } else if (lowerCommand.includes('party') || lowerCommand.includes('fun')) {
      window.location.href = '/party';
    } else if (lowerCommand.includes('share')) {
      window.location.href = '/share';
    }
  };

  const handleClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handlePressStart = () => {
    // Start timer for long press (5 seconds for options)
    const timer = setTimeout(() => {
      setShowOptions(true);
      setPressTimer(null);
      // Voice feedback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Voice options opened");
        utterance.rate = 1.2;
        window.speechSynthesis.speak(utterance);
      }
    }, 5000);
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    // If released before 5 seconds, just toggle voice
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
      handleClick();
    }
  };

  return (
    <>
      {/* Single Simple Voice Button - Bottom Right Corner */}
      <motion.button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        className={`fixed bottom-6 right-6 z-40 rounded-full p-3 shadow-lg transition-all ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-green-500 hover:bg-green-600'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-voice-control"
      >
        {isListening ? (
          <MicOff className="h-5 w-5 text-white" />
        ) : (
          <Mic className="h-5 w-5 text-white" />
        )}
      </motion.button>

      {/* Tiny Listening Dot - Minimal indicator */}
      {isListening && (
        <div className="fixed bottom-6 right-20 z-40">
          <div className="bg-red-500 rounded-full h-2 w-2 animate-pulse" />
        </div>
      )}

      {/* Options Menu - Only on 5 second press */}
      {showOptions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 z-40"
        >
          <div className="text-xs space-y-1">
            <div className="font-bold mb-2">Voice Commands:</div>
            <div>"Home" - Go home</div>
            <div>"Ride" - Book ride</div>
            <div>"Wallet" - Open wallet</div>
            <div>"Shop" - Marketplace</div>
            <div>"Party" - Fun page</div>
            <button
              onClick={() => setShowOptions(false)}
              className="mt-2 text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}