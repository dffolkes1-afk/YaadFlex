import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";

function GlowRing({ radius = 3.05, thickness = 0.03, color = "#1cb0f6" }) {
  const ref = useRef<any>();
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.15;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, thickness, 32, 128]} />
      <meshStandardMaterial emissive={color} emissiveIntensity={0.7} color="#0b1d35" />
    </mesh>
  );
}

function Globe({ speed = 0.4 }) {
  const ref = useRef<any>();
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * speed;
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial color="#0e3a5b" emissive="#0a6cab" emissiveIntensity={0.25} />
      </mesh>
      <GlowRing />
    </group>
  );
}

function Person({ scale = 0.18, color = "#000000" }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.6, 1.8, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function PeopleOrbit({ count = 8, radius = 3.4, speed = 0.6, glow = "#ffd700" }) {
  const group = useRef<any>();
  const angles = useMemo(() => new Array(count).fill(0).map((_, i) => (i / count) * Math.PI * 2), [count]);
  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * speed;
  });
  return (
    <group ref={group}>
      {angles.map((a, i) => (
        <group key={i} rotation={[0, a, 0]}>
          <group position={[Math.sin(a) * radius, 0, Math.cos(a) * radius]} rotation={[0, -a + Math.PI, 0]}>
            <Person />
            <pointLight color={glow} intensity={0.4} distance={2.5} />
          </group>
        </group>
      ))}
    </group>
  );
}

function DuoWonTheWorld() {
  // Brain-style: shorter, stockier, arms folded; Pinky-style: taller, lankier, slouched
  return (
    <group position={[0, 4.3, 0]}>
      {/* Brain-style */}
      <group position={[-0.7, 0, 0]} scale={0.65}>
        <mesh position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.7, 1.2, 8, 16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 1.9, 0]}>
          <torusGeometry args={[0.8, 0.05, 16, 64]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
      </group>

      {/* Pinky-style */}
      <group position={[0.7, 0, 0]} scale={0.75} rotation={[0, 0, -0.12]}>
        <mesh position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.5, 1.8, 8, 16]} />
          <meshStandardMaterial color="#191919" />
        </mesh>
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#191919" />
        </mesh>
      </group>

      {/* Crown/glow accent under silhouettes */}
      <mesh position={[0, -0.2, 0]}>
        <ringGeometry args={[1.8, 2.3, 64]} />
        <meshBasicMaterial color="#e83e8c" opacity={0.45} transparent />
      </mesh>
    </group>
  );
}

function Scene({ globeSpeed, orbitSpeed }: { globeSpeed: number; orbitSpeed: number }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 6]} intensity={1.2} />
      <Stars radius={60} depth={40} count={8000} factor={2} fade speed={0.4} />
      <Globe speed={globeSpeed} />
      <PeopleOrbit speed={orbitSpeed} />
      {/* Duo silhouettes now standing triumphantly above the globe */}
      <DuoWonTheWorld />
      <OrbitControls enablePan={false} />
    </>
  );
}

export default function DuoWonTheWorld3D() {
  const [globeSpeed, setGlobeSpeed] = useState(0.4);
  const [orbitSpeed, setOrbitSpeed] = useState(0.6);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-[#0b1d35] text-white">
      <div className="max-w-5xl mx-auto p-4">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">YaadFlex World Emblem – Duo Won the World</h1>
        </header>
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <Canvas camera={{ position: [0, 4.8, 8.5], fov: 50 }}>
            <Scene globeSpeed={globeSpeed} orbitSpeed={orbitSpeed} />
            <Html position={[0, -6, 0]} center>
              <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-white text-center">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <label htmlFor="globe-speed" className="text-sm font-medium">
                      Globe Speed:
                    </label>
                    <input
                      id="globe-speed"
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={globeSpeed}
                      onChange={(e) => setGlobeSpeed(parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-xs text-gray-300">{globeSpeed.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="orbit-speed" className="text-sm font-medium">
                      Orbit Speed:
                    </label>
                    <input
                      id="orbit-speed"
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={orbitSpeed}
                      onChange={(e) => setOrbitSpeed(parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-xs text-gray-300">{orbitSpeed.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  🌍 <strong>YaadFlex Global Vybz</strong> - Connecting the Caribbean to the World! 🌍
                </p>
              </div>
            </Html>
          </Canvas>
        </div>
      </div>
    </div>
  );
}