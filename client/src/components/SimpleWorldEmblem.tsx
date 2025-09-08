import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import DuoWonTheWorld from "./DuoWonTheWorld";


// Globe component for simple orbit
function Globe({ speed }: { speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color="#0e3a5b"
        emissive="#0a6cab"
        emissiveIntensity={0.3}
        metalness={0.2}
        roughness={0.8}
      />
    </mesh>
  );
}

// People orbit component
function PeopleOrbit({ speed }: { speed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
    }
  });

  const positions = [
    [3, 0, 0],
    [-3, 0, 0],
    [0, 0, 3],
    [0, 0, -3],
    [2.1, 0, 2.1],
    [-2.1, 0, -2.1],
    [2.1, 0, -2.1],
    [-2.1, 0, 2.1]
  ];

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  );
}

// Main scene component
function EmblemScene({ globeSpeed = 0.4, orbitSpeed = 0.6 }: { globeSpeed?: number; orbitSpeed?: number }) {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Globe speed={globeSpeed} />
      <PeopleOrbit speed={orbitSpeed} />
      
      {/* New "won the world" duo */}
      <DuoWonTheWorld height={3.9} accentColor="#e83e8c" />
      
      <OrbitControls enablePan={false} />
    </Suspense>
  );
}

interface SimpleWorldEmblemProps {
  className?: string;
  height?: string;
}

export default function SimpleWorldEmblem({ 
  className = "", 
  height = "600px" 
}: SimpleWorldEmblemProps) {
  const [globeSpeed, setGlobeSpeed] = useState(0.4);
  const [orbitSpeed, setOrbitSpeed] = useState(0.6);

  return (
    <div 
      className={`w-full bg-gradient-to-b from-black to-blue-900 ${className}`}
      style={{ height }}
    >
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <EmblemScene globeSpeed={globeSpeed} orbitSpeed={orbitSpeed} />
      </Canvas>
    </div>
  );
}