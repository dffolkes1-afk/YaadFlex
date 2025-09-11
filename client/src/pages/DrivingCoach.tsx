import { useState, useEffect, useCallback } from 'react';
import { RealTimeCamera } from '@/components/RealTimeCamera';
import { useVoice } from '@/hooks/use-voice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Car, DollarSign, AlertTriangle, CheckCircle, Headphones, Camera } from 'lucide-react';

interface DrivingSession {
  startTime: number;
  mistakes: Array<{
    type: string;
    timestamp: number;
    cost: number;
    description: string;
  }>;
  totalCost: number;
  isActive: boolean;
}

export default function DrivingCoach() {
  const [session, setSession] = useState<DrivingSession | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState(0);
  const { speak, speaking } = useVoice();

  const BASE_COST = 500; // 500 JMD base cost
  const MISTAKE_COSTS = {
    'turn-signal': 50,
    'speed-limit': 75,
    'lane-drift': 60,
    'braking': 40,
    'mirror-check': 30,
    'parking': 100,
    'intersection': 80
  };

  // Start a new driving session
  const startSession = useCallback(() => {
    const newSession: DrivingSession = {
      startTime: Date.now(),
      mistakes: [],
      totalCost: BASE_COST,
      isActive: true
    };
    
    setSession(newSession);
    setSkillLevel(0);
    
    // Welcome message
    speak("Welcome to YaadFlex Driving Coach! Put on your headphones and start your engine. We'll guide you step by step. Remember - fewer mistakes means lower cost!");
    
    setTimeout(() => {
      setCurrentInstruction("Check your mirrors and adjust your seat");
      speak("First, check all your mirrors and adjust your seat for comfort");
    }, 3000);
  }, [speak]);

  // End driving session
  const endSession = useCallback(() => {
    if (!session) return;
    
    setSession(prev => prev ? { ...prev, isActive: false } : null);
    
    const finalMessage = `Session complete! You made ${session.mistakes.length} mistakes. Total cost: ${session.totalCost} Jamaican dollars. ${session.mistakes.length <= 2 ? 'Excellent driving!' : 'Keep practicing to reduce costs!'}`;
    speak(finalMessage);
    
    setCurrentInstruction('Session completed');
  }, [session, speak]);

  // Add mistake to session
  const addMistake = useCallback((type: keyof typeof MISTAKE_COSTS, description: string) => {
    if (!session || !session.isActive) return;
    
    const cost = MISTAKE_COSTS[type];
    const mistake = {
      type,
      timestamp: Date.now(),
      cost,
      description
    };
    
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        mistakes: [...prev.mistakes, mistake],
        totalCost: prev.totalCost + cost
      };
    });
    
    // Voice feedback for mistake
    speak(`Mistake detected: ${description}. That costs ${cost} dollars. Current total: ${session.totalCost + cost} dollars. Stay focused!`);
  }, [session, speak]);

  // Simulate AI driving analysis from camera feed
  const analyzeFrame = useCallback((imageData: string) => {
    if (!session?.isActive) return;
    
    // Simulate driving analysis (in real app, this would use AI/CV)
    const random = Math.random();
    
    // Simulate occasional mistakes for demo
    if (random < 0.02) { // 2% chance per frame
      const mistakes = [
        { type: 'lane-drift' as const, desc: 'Lane drifting detected' },
        { type: 'speed-limit' as const, desc: 'Speed limit exceeded' },
        { type: 'mirror-check' as const, desc: 'Mirror check needed' },
        { type: 'turn-signal' as const, desc: 'Turn signal required' }
      ];
      
      const mistake = mistakes[Math.floor(Math.random() * mistakes.length)];
      addMistake(mistake.type, mistake.desc);
    }
    
    // Progress skill level
    if (random < 0.1) {
      setSkillLevel(prev => Math.min(100, prev + 1));
    }
  }, [session, addMistake]);

  // Voice instructions based on progress
  useEffect(() => {
    if (!session?.isActive) return;
    
    const instructions = [
      "Check your mirrors and signal before changing lanes",
      "Maintain safe following distance - 3 second rule",
      "Check blind spots before merging",
      "Use turn signals early and clearly",
      "Keep steady speed and smooth acceleration",
      "Practice parallel parking slowly",
      "Stop completely at stop signs",
      "Look both ways at intersections"
    ];
    
    const interval = setInterval(() => {
      if (!speaking) {
        const instruction = instructions[Math.floor(Math.random() * instructions.length)];
        setCurrentInstruction(instruction);
        speak(instruction);
      }
    }, 15000); // New instruction every 15 seconds
    
    return () => clearInterval(interval);
  }, [session, speak, speaking]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <Car className="h-8 w-8" />
          YaadFlex Driving Coach
        </h1>
        <p className="text-gray-600">Voice-guided real driving lessons with pay-per-mistake pricing</p>
      </div>

      {/* Session Status */}
      {session && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Session</span>
              <Badge variant={session.isActive ? "default" : "secondary"}>
                {session.isActive ? "Active" : "Complete"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cost Display */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold">Total Cost</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${session.totalCost} JMD
                </div>
              </div>
              
              {/* Mistakes Counter */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">Mistakes</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {session.mistakes.length}
                </div>
              </div>
              
              {/* Skill Level */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Skill Level</span>
                </div>
                <Progress value={skillLevel} className="w-full mb-1" />
                <div className="text-sm text-gray-600">{skillLevel}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera Feed */}
      <RealTimeCamera
        onFrameCapture={analyzeFrame}
        onCameraActive={setCameraActive}
        className="w-full"
      />

      {/* Current Instruction */}
      {session?.isActive && currentInstruction && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Headphones className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">Current Instruction:</p>
                <p className="text-blue-800">{currentInstruction}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Controls */}
      <Card>
        <CardContent className="pt-6">
          {!session ? (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Ready to Learn?</h3>
              <p className="text-gray-600">
                Start at $500 JMD base cost. Each mistake adds to your bill. 
                Learn faster = pay less!
              </p>
              <Button 
                onClick={startSession} 
                size="lg" 
                className="w-full md:w-auto"
                data-testid="button-start-session"
                disabled={!cameraActive}
              >
                <Car className="h-5 w-5 mr-2" />
                Start Driving Lesson
              </Button>
              {!cameraActive && (
                <p className="text-sm text-red-600 flex items-center justify-center gap-2">
                  <Camera className="h-4 w-4" />
                  Camera must be active to start lesson
                </p>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              {session.isActive ? (
                <Button 
                  onClick={endSession} 
                  variant="destructive" 
                  size="lg"
                  data-testid="button-end-session"
                >
                  End Session
                </Button>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Session Complete!</h3>
                  <p className="text-gray-600 mb-4">
                    Final Cost: ${session.totalCost} JMD ({session.mistakes.length} mistakes)
                  </p>
                  <Button 
                    onClick={startSession} 
                    size="lg"
                    data-testid="button-new-session"
                  >
                    Start New Session
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mistake History */}
      {session && session.mistakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mistakes This Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {session.mistakes.map((mistake, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{mistake.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(mistake.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="destructive">
                    +${mistake.cost} JMD
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Base Cost</h4>
              <p className="text-2xl font-bold text-green-600">$500 JMD</p>
              <p className="text-sm text-gray-600">If you drive perfectly</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Mistake Penalties</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Lane drifting:</span>
                  <span>+$60 JMD</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed violation:</span>
                  <span>+$75 JMD</span>
                </div>
                <div className="flex justify-between">
                  <span>Turn signal miss:</span>
                  <span>+$50 JMD</span>
                </div>
                <div className="flex justify-between">
                  <span>Poor parking:</span>
                  <span>+$100 JMD</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}