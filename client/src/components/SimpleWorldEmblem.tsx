import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

// Simple rotating globe component
function RotatingGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
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

// Simple orbiting elements
function OrbitingElements() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
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

// Duo characters above
function DuoCharacters() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 3.5 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 3.5, 0]}>
      {/* Character 1 - Brain style */}
      <group position={[-0.8, 0, 0]} scale={0.5}>
        <mesh>
          <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
      
      {/* Character 2 - Pinky style */}
      <group position={[0.8, 0, 0]} scale={0.6}>
        <mesh>
          <capsuleGeometry args={[0.25, 1.0, 8, 16]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>
      
      {/* Glow effect */}
      <mesh position={[0, -0.3, 0]}>
        <ringGeometry args={[1.2, 1.5, 32]} />
        <meshBasicMaterial color="#e83e8c" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Main scene component
function EmblemScene() {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <RotatingGlobe />
      <OrbitingElements />
      <DuoCharacters />
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
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
        <EmblemScene />
      </Canvas>
    </div>
  );
}