import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

function GlowRing({ radius = 3.05, thickness = 0.03, color = "#1cb0f6" }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.15;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, thickness, 32, 128]} />
      <meshStandardMaterial
        emissive={color}
        emissiveIntensity={0.7}
        color="#0b1d35"
        metalness={0.2}
        roughness={0.3}
      />
    </mesh>
  );
}

function Globe({ speed = 0.4 }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * speed;
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          color="#0e3a5b"
          emissive="#0a6cab"
          emissiveIntensity={0.25}
          metalness={0.15}
          roughness={0.6}
        />
      </mesh>
      <GlowRing />
    </group>
  );
}

function Person({ scale = 0.18, color = "#000000" }) {
  return (
    <group scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.6, 1.8, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Simple arm lines (holding hands effect) */}
      <mesh position={[0.9, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.1, 0.8, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.9, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.1, 0.8, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function PeopleOrbit({ count = 8, radius = 3.4, speed = 0.6, glow = "#ffd700" }) {
  const group = useRef<THREE.Group>(null);
  const angles = useMemo(() => new Array(count).fill(0).map((_, i) => (i / count) * Math.PI * 2), [count]);
  
  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * speed;
  });
  
  return (
    <group ref={group}>
      {angles.map((a, i) => (
        <group key={i} rotation={[0, a, 0]} position={[0, 0, 0]}>
          <group position={[Math.sin(a) * radius, 0, Math.cos(a) * radius]} rotation={[0, -a, 0]}>
            <Person />
            {/* Glow ring around each person */}
            <mesh position={[0, -0.2, 0]}>
              <ringGeometry args={[0.8, 1.0, 16]} />
              <meshBasicMaterial color={glow} opacity={0.3} transparent />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

function DuoWonTheWorld({ height = 3.9 }) {
  const group = useRef<THREE.Group>(null);
  const t0 = useRef(performance.now());
  
  useFrame((state) => {
    const elapsed = (performance.now() - t0.current) / 1000;
    // 0 → 1 over ~1.2s
    const k = Math.min(1, elapsed / 1.2);
    if (group.current) {
      const y = height + (1 - k) * 1.6;       // drop from slightly above
      const s = 0.8 + 0.2 * k;                 // scale up to full
      group.current.position.y = y;
      group.current.scale.setScalar(s);
      group.current.rotation.y = (1 - k) * 0.6; // slight twist settle
    }
  });

  return (
    <group ref={group} position={[0, height, 0]}>
      {/* Brain-style: shorter, stockier */}
      <group position={[-0.6, 0, 0]} scale={0.6}>
        <mesh position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.7, 1.2, 8, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.1} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Arms folded */}
        <mesh position={[0.4, 1.0, 0]} rotation={[0, 0, Math.PI / 3]}>
          <capsuleGeometry args={[0.15, 0.6, 4, 8]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[-0.4, 1.0, 0]} rotation={[0, 0, -Math.PI / 3]}>
          <capsuleGeometry args={[0.15, 0.6, 4, 8]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Pinky-style: taller, slimmer */}
      <group position={[0.6, 0, 0]} scale={0.7}>
        <mesh position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.5, 1.8, 8, 16]} />
          <meshStandardMaterial color="#191919" />
        </mesh>
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#191919" />
        </mesh>
        {/* Relaxed arms */}
        <mesh position={[0.3, 1.2, 0]} rotation={[0, 0, Math.PI / 6]}>
          <capsuleGeometry args={[0.12, 0.7, 4, 8]} />
          <meshStandardMaterial color="#191919" />
        </mesh>
        <mesh position={[-0.3, 1.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <capsuleGeometry args={[0.12, 0.7, 4, 8]} />
          <meshStandardMaterial color="#191919" />
        </mesh>
      </group>

      {/* Accent glow */}
      <mesh position={[0, -0.1, 0]}>
        <ringGeometry args={[1.5, 1.8, 64]} />
        <meshBasicMaterial color="#e83e8c" opacity={0.4} transparent />
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
      <DuoWonTheWorld />
      <OrbitControls enablePan={false} />
    </>
  );
}

interface WorldEmblemAnimationProps {
  className?: string;
  showControls?: boolean;
}

export default function WorldEmblemAnimation({ className = "", showControls = false }: WorldEmblemAnimationProps) {
  const [globeSpeed, setGlobeSpeed] = useState(0.4);
  const [orbitSpeed, setOrbitSpeed] = useState(0.6);

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b from-black to-[#0b1d35] text-white ${className}`}>
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {showControls && (
          <header className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">YaadFlex World Emblem</h1>
            <div className="text-xs opacity-70">Unity • Ambition • Global Vybz</div>
          </header>
        )}

        <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <Canvas camera={{ position: [0, 4.2, 8], fov: 50 }}>
            <Scene globeSpeed={globeSpeed} orbitSpeed={orbitSpeed} />
            {showControls && (
              <Html position={[0, -4.2, 0]} center>
                <div className="text-center text-white/70 text-xs">Drag to orbit • Scroll to zoom</div>
              </Html>
            )}
          </Canvas>
        </div>

        {showControls && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
              <label className="text-sm">Globe speed</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={globeSpeed}
                onChange={(e) => setGlobeSpeed(parseFloat(e.target.value))}
                className="w-40"
                data-testid="slider-globe-speed"
              />
            </div>
            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
              <label className="text-sm">Orbit speed</label>
              <input
                type="range"
                min={0}
                max={1.2}
                step={0.01}
                value={orbitSpeed}
                onChange={(e) => setOrbitSpeed(parseFloat(e.target.value))}
                className="w-40"
                data-testid="slider-orbit-speed"
              />
            </div>
          </div>
        )}

        {showControls && (
          <p className="mt-4 text-sm text-white/70">
            <strong>YaadFlex Global Unity Emblem:</strong> Silhouettes represent people from all cultures holding hands around Earth, 
            with the Flex Vybz Duo above symbolizing ambition and global dreams. Original characters inspired by classic dynamics.
          </p>
        )}
      </div>
    </div>
  );
}