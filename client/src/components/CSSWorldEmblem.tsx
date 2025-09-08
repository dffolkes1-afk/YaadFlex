import React from "react";

interface CSSWorldEmblemProps {
  className?: string;
  height?: string;
}

export default function CSSWorldEmblem({ 
  className = "", 
  height = "600px" 
}: CSSWorldEmblemProps) {
  return (
    <div 
      className={`relative w-full overflow-hidden bg-gradient-to-b from-black via-blue-950 to-purple-950 ${className}`}
      style={{ height }}
    >
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        <div className="stars-field">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Central Globe */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Earth Globe */}
          <div className="earth-globe w-32 h-32 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-blue-400 via-green-500 to-blue-900 opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-400/30 to-transparent"></div>
            <div className="absolute inset-2 rounded-full border-2 border-blue-300/20"></div>
          </div>

          {/* Glow Ring around Earth */}
          <div className="absolute inset-0 w-32 h-32 rounded-full">
            <div className="glow-ring absolute inset-0 rounded-full border-2 border-cyan-400/50"></div>
          </div>

          {/* Orbiting People Silhouettes */}
          <div className="orbiting-people absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-6 h-6 -top-3 -left-3"
                style={{
                  transform: `rotate(${i * 45}deg) translateX(80px) rotate(-${i * 45}deg)`,
                  transformOrigin: '50% calc(50% + 3px)'
                }}
              >
                <div className="person-silhouette w-4 h-6 bg-gray-800 rounded-full relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rounded-full"></div>
                  <div className="absolute top-2 w-full h-4 bg-gray-800 rounded-b-full"></div>
                  <div className="absolute -inset-1 rounded-full bg-yellow-400/20 blur-sm"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Duo Characters Above Globe */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <div className="duo-container relative">
              {/* Brain-style Character */}
              <div className="absolute -left-8 top-0 duo-character brain-character">
                <div className="w-6 h-8 bg-gray-900 rounded-full relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full"></div>
                  <div className="absolute top-3 w-full h-5 bg-gray-900 rounded-b-full"></div>
                </div>
              </div>

              {/* Pinky-style Character */}
              <div className="absolute -right-8 top-0 duo-character pinky-character">
                <div className="w-5 h-10 bg-gray-800 rounded-full relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-800 rounded-full"></div>
                  <div className="absolute top-2 w-full h-8 bg-gray-800 rounded-b-full"></div>
                </div>
              </div>

              {/* Duo Glow Effect */}
              <div className="absolute -inset-4 rounded-full bg-pink-500/20 blur-md duo-glow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white/60 text-sm">
          ✨ YaadFlex World Unity Emblem ✨
        </p>
      </div>

    </div>
  );
}