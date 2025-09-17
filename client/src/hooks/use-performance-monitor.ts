import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ================== PERFORMANCE MONITORING HOOK ==================

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  isLowPerformance: boolean;
  recommendedIntensity: 'subtle' | 'medium' | 'bold';
}

export interface PerformanceThresholds {
  lowFpsThreshold: number;
  highMemoryThreshold: number;
  adaptiveIntensity: boolean;
}

/**
 * Hook to monitor performance and provide adaptive recommendations
 */
export function usePerformanceMonitor(
  options: PerformanceThresholds = {
    lowFpsThreshold: 30,
    highMemoryThreshold: 50,
    adaptiveIntensity: true,
  }
): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    isLowPerformance: false,
    recommendedIntensity: 'medium',
  });

  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const fpsHistoryRef = useRef<number[]>([]);

  // FPS Monitoring
  const measureFPS = useCallback(() => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    
    frameCountRef.current++;
    
    // Update FPS every second
    if (delta >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / delta);
      
      // Keep rolling average of last 5 measurements
      fpsHistoryRef.current.push(fps);
      if (fpsHistoryRef.current.length > 5) {
        fpsHistoryRef.current.shift();
      }
      
      const averageFPS = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
      
      setMetrics(prev => ({
        ...prev,
        fps: Math.round(averageFPS),
      }));
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
    
    frameRef.current = requestAnimationFrame(measureFPS);
  }, []);

  // Memory Usage Monitoring
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        const usedMB = memory.usedJSHeapSize / 1048576; // Convert to MB
        const limitMB = memory.jsHeapSizeLimit / 1048576;
        const usagePercent = (usedMB / limitMB) * 100;
        
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(usagePercent),
        }));
      }
    }
  }, []);

  // Update performance assessment
  useEffect(() => {
    const isLowPerformance = 
      metrics.fps < options.lowFpsThreshold || 
      metrics.memoryUsage > options.highMemoryThreshold;

    let recommendedIntensity: 'subtle' | 'medium' | 'bold' = 'medium';

    if (options.adaptiveIntensity) {
      if (metrics.fps < 20 || metrics.memoryUsage > 70) {
        recommendedIntensity = 'subtle';
      } else if (metrics.fps > 50 && metrics.memoryUsage < 30) {
        recommendedIntensity = 'bold';
      }
    }

    setMetrics(prev => ({
      ...prev,
      isLowPerformance,
      recommendedIntensity,
    }));
  }, [metrics.fps, metrics.memoryUsage, options]);

  // Start monitoring
  useEffect(() => {
    frameRef.current = requestAnimationFrame(measureFPS);
    
    const memoryInterval = setInterval(measureMemory, 2000);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      clearInterval(memoryInterval);
    };
  }, [measureFPS, measureMemory]);

  return metrics;
}

// ================== DEVICE CAPABILITIES DETECTION ==================

export interface DeviceCapabilities {
  supportsBackdropFilter: boolean;
  supportsWillChange: boolean;
  supportsTransform3d: boolean;
  hasHardwareAcceleration: boolean;
  isHighDPI: boolean;
  isTouchDevice: boolean;
  connectionSpeed: 'slow' | 'medium' | 'fast';
}

/**
 * Detect device capabilities for optimal effect selection
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    supportsBackdropFilter: false,
    supportsWillChange: false,
    supportsTransform3d: false,
    hasHardwareAcceleration: false,
    isHighDPI: false,
    isTouchDevice: false,
    connectionSpeed: 'medium',
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // Test CSS feature support
      const testElement = document.createElement('div');
      testElement.style.cssText = 'backdrop-filter: blur(1px); will-change: transform; transform: translate3d(0,0,0);';

      const supportsBackdropFilter = testElement.style.backdropFilter !== '';
      const supportsWillChange = testElement.style.willChange !== '';
      const supportsTransform3d = testElement.style.transform !== '';

      // Test hardware acceleration
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const hasHardwareAcceleration = !!gl;

      // High DPI detection
      const isHighDPI = window.devicePixelRatio > 1;

      // Touch device detection
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Connection speed estimation
      let connectionSpeed: 'slow' | 'medium' | 'fast' = 'medium';
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          const effectiveType = connection.effectiveType;
          if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            connectionSpeed = 'slow';
          } else if (effectiveType === '4g') {
            connectionSpeed = 'fast';
          }
        }
      }

      setCapabilities({
        supportsBackdropFilter,
        supportsWillChange,
        supportsTransform3d,
        hasHardwareAcceleration,
        isHighDPI,
        isTouchDevice,
        connectionSpeed,
      });
    };

    detectCapabilities();
  }, []);

  return capabilities;
}

// ================== ADAPTIVE INTENSITY HOOK ==================

/**
 * Hook that provides adaptive intensity based on performance and capabilities
 */
export function useAdaptiveIntensity(
  requestedIntensity: 'subtle' | 'medium' | 'bold' = 'medium'
): {
  actualIntensity: 'subtle' | 'medium' | 'bold';
  shouldReduceEffects: boolean;
  effectMultiplier: number;
} {
  const performance = usePerformanceMonitor();
  const capabilities = useDeviceCapabilities();

  const actualIntensity = useMemo(() => {
    // Always respect performance recommendations first
    if (performance.isLowPerformance) {
      return 'subtle';
    }

    // Consider device capabilities
    if (!capabilities.hasHardwareAcceleration || capabilities.connectionSpeed === 'slow') {
      return requestedIntensity === 'bold' ? 'medium' : requestedIntensity;
    }

    // Use performance recommendations if available
    if (performance.recommendedIntensity) {
      return performance.recommendedIntensity;
    }

    return requestedIntensity;
  }, [requestedIntensity, performance, capabilities]);

  const shouldReduceEffects = performance.isLowPerformance || capabilities.connectionSpeed === 'slow';

  const effectMultiplier = useMemo(() => {
    if (shouldReduceEffects) return 0.3;
    if (actualIntensity === 'subtle') return 0.5;
    if (actualIntensity === 'bold') return 1.5;
    return 1.0;
  }, [actualIntensity, shouldReduceEffects]);

  return {
    actualIntensity,
    shouldReduceEffects,
    effectMultiplier,
  };
}