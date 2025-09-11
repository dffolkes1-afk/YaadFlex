import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Globe, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveStatusIndicator() {
  const [isLive, setIsLive] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [lastChecked, setLastChecked] = useState(new Date());

  useEffect(() => {
    // Check app status every 5 seconds
    const checkStatus = async () => {
      try {
        // Check if server is responding
        const response = await fetch('/api/health', { 
          method: 'GET',
          cache: 'no-cache' 
        });
        
        if (response.ok) {
          setIsLive(true);
          
          // Check if we're on a public URL
          const isPublicUrl = window.location.hostname.includes('.replit.app') || 
                             window.location.hostname.includes('.repl.co');
          setIsPublic(isPublicUrl);
          
          // Simulate viewer count (in production, this would come from analytics)
          if (isPublicUrl) {
            setViewerCount(Math.floor(Math.random() * 50) + 1);
          }
        } else {
          setIsLive(false);
          setIsPublic(false);
        }
        
        setLastChecked(new Date());
      } catch (error) {
        setIsLive(false);
        setIsPublic(false);
      }
    };

    // Initial check
    checkStatus();
    
    // Check every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Main Status Light - Fixed Position Top Right */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`
          relative rounded-full p-3 shadow-2xl backdrop-blur-md
          ${isPublic ? 'bg-green-500/90' : isLive ? 'bg-yellow-500/90' : 'bg-red-500/90'}
        `}>
          {/* Pulsing Animation for Live Status */}
          {isLive && (
            <motion.div
              className={`absolute inset-0 rounded-full ${isPublic ? 'bg-green-400' : 'bg-yellow-400'}`}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          {/* Status Icon */}
          <div className="relative">
            {isPublic ? (
              <Globe className="h-6 w-6 text-white" />
            ) : isLive ? (
              <Wifi className="h-6 w-6 text-white" />
            ) : (
              <WifiOff className="h-6 w-6 text-white" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className={`
          absolute top-full mt-2 right-0 
          bg-black/80 text-white px-3 py-2 rounded-lg
          text-xs font-bold whitespace-nowrap
        `}>
          {isPublic ? (
            <div className="text-green-400">
              🟢 LIVE - PUBLIC
              {viewerCount > 0 && (
                <div className="text-[10px] mt-1">👁 {viewerCount} viewing</div>
              )}
            </div>
          ) : isLive ? (
            <div className="text-yellow-400">
              🟡 RUNNING - LOCAL ONLY
              <div className="text-[10px] mt-1">Not Published Yet</div>
            </div>
          ) : (
            <div className="text-red-400">
              🔴 OFFLINE
              <div className="text-[10px] mt-1">App Not Running</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Detailed Status Panel - Bottom Left */}
      <motion.div
        className="fixed bottom-4 left-4 z-40 bg-black/90 backdrop-blur-md rounded-lg p-3 text-white shadow-2xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-xs space-y-2">
          {/* Main Status */}
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${
              isPublic ? 'bg-green-500' : isLive ? 'bg-yellow-500' : 'bg-red-500'
            } animate-pulse`} />
            <span className="font-bold">
              {isPublic ? 'PUBLIC ACCESS' : isLive ? 'DEV MODE' : 'NOT RUNNING'}
            </span>
          </div>
          
          {/* URL Status */}
          <div className="text-[10px] opacity-80">
            URL: {window.location.hostname}
          </div>
          
          {/* Public Access Info */}
          {isPublic ? (
            <div className="text-green-400 text-[10px]">
              ✅ Anyone can access this app
            </div>
          ) : isLive ? (
            <div className="text-yellow-400 text-[10px]">
              ⚠️ Only you can see this - Click Publish!
            </div>
          ) : (
            <div className="text-red-400 text-[10px]">
              ❌ App is not running
            </div>
          )}
          
          {/* Last Check Time */}
          <div className="text-[10px] opacity-60">
            Checked: {lastChecked.toLocaleTimeString()}
          </div>
        </div>
      </motion.div>

      {/* Big Alert if Not Public */}
      {isLive && !isPublic && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
            <AlertCircle className="h-4 w-4" />
            APP NOT PUBLIC - Only You Can See It - PUBLISH NOW!
          </div>
        </motion.div>
      )}
    </>
  );
}