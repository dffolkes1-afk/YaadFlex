import { useEffect, useState } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface RealTimeCameraProps {
  onFrameCapture?: (imageData: string) => void;
  onCameraActive?: (active: boolean) => void;
  showControls?: boolean;
  className?: string;
}

export const RealTimeCamera = ({ 
  onFrameCapture, 
  onCameraActive,
  showControls = true,
  className = ""
}: RealTimeCameraProps) => {
  const { 
    isActive, 
    error, 
    isSupported, 
    videoRef, 
    startCamera, 
    stopCamera, 
    captureFrame 
  } = useCamera();

  const [isCapturing, setIsCapturing] = useState(false);

  // Notify parent when camera status changes
  useEffect(() => {
    onCameraActive?.(isActive);
  }, [isActive, onCameraActive]);

  // Auto-capture frames when active (for driving analysis)
  useEffect(() => {
    if (!isActive || !onFrameCapture) return;

    const interval = setInterval(() => {
      const frameData = captureFrame();
      if (frameData) {
        onFrameCapture(frameData);
      }
    }, 1000); // Capture every second for real-time analysis

    return () => clearInterval(interval);
  }, [isActive, captureFrame, onFrameCapture]);

  const handleStartCamera = async () => {
    await startCamera();
  };

  const handleStopCamera = () => {
    stopCamera();
  };

  const handleCaptureFrame = () => {
    const frameData = captureFrame();
    if (frameData && onFrameCapture) {
      setIsCapturing(true);
      onFrameCapture(frameData);
      setTimeout(() => setIsCapturing(false), 500); // Visual feedback
    }
  };

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Camera Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your device doesn't support camera access. Please use a modern browser on a mobile device.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Real-Time Road Camera
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Element */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            data-testid="camera-video"
          />
          
          {/* Overlay indicators */}
          {isActive && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                LIVE
              </span>
            </div>
          )}
          
          {isCapturing && (
            <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
              <div className="text-white text-lg font-bold">📸</div>
            </div>
          )}
          
          {!isActive && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Camera Ready</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Controls */}
        {showControls && (
          <div className="flex gap-2">
            {!isActive ? (
              <Button 
                onClick={handleStartCamera} 
                className="flex-1"
                data-testid="button-start-camera"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleStopCamera} 
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-stop-camera"
                >
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Camera
                </Button>
                
                <Button 
                  onClick={handleCaptureFrame}
                  variant="outline"
                  data-testid="button-capture-frame"
                >
                  📸
                </Button>
              </>
            )}
          </div>
        )}

        {/* Camera Info */}
        {isActive && (
          <div className="text-sm text-gray-600 space-y-1">
            <p>✅ Real-time road monitoring active</p>
            <p>🎯 AI analyzing your driving in real-time</p>
            <p>🎧 Put on headphones for voice coaching</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};