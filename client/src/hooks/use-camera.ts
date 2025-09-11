import { useState, useEffect, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if camera is supported
  useEffect(() => {
    const checkSupport = () => {
      const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setIsSupported(supported);
      if (!supported) {
        setError('Camera not supported on this device');
      }
    };
    checkSupport();
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    if (!isSupported) {
      setError('Camera not supported');
      return;
    }

    try {
      setError(null);
      
      // Request camera access with optimal settings for driving
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: 'environment' // Back camera for road view
        },
        audio: false // No audio needed for visual analysis
      });

      setStream(mediaStream);
      
      // Attach to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setIsActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      if (err instanceof Error) {
        setError(`Camera access denied: ${err.message}`);
      } else {
        setError('Could not access camera');
      }
      setIsActive(false);
    }
  }, [isSupported]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
  }, [stream]);

  // Capture frame as image data
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isActive) return null;
    
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [isActive]);

  // Get video element dimensions
  const getVideoDimensions = useCallback(() => {
    if (!videoRef.current) return null;
    
    const video = videoRef.current;
    return {
      width: video.videoWidth,
      height: video.videoHeight,
      displayWidth: video.clientWidth,
      displayHeight: video.clientHeight
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    // States
    isActive,
    stream,
    error,
    isSupported,
    
    // Refs
    videoRef,
    
    // Actions
    startCamera,
    stopCamera,
    captureFrame,
    getVideoDimensions
  };
};