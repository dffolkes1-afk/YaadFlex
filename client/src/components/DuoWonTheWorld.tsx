import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DuoWonTheWorldProps {
  height?: number;
  accentColor?: string;
}

export default function DuoWonTheWorld({ 
  height = 3.9, 
  accentColor = "#e83e8c" 
}: DuoWonTheWorldProps) {
  const group = useRef<THREE.Group>(null);
  const t0 = useRef(performance.now());
  
  useFrame((state) => {
    const elapsed = (performance.now() - t0.current) / 1000;
    // 0 → 1 over ~1.2s for the enhanced drop-down animation
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

      {/* Accent glow with customizable color */}
      <mesh position={[0, -0.1, 0]}>
        <ringGeometry args={[1.5, 1.8, 64]} />
        <meshBasicMaterial color={accentColor} opacity={0.4} transparent />
      </mesh>
    </group>
  );
}