"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// A custom animated inner core representing the Crucible energy
function EnergyCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Rotate and pulse
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.x = t * 0.3;
    const scale = 1.1 + Math.sin(t * 2) * 0.08;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.7, 32, 32]} />
      <meshBasicMaterial 
        color="#D28E2B" 
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// The Outer Glass Crucible Cube
function GlassCube() {
  const groupRef = useRef<THREE.Group>(null);
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Slow float movement
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.15;
    
    // Auto rotation
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Outer translucent glass box */}
      <mesh ref={boxRef}>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshPhysicalMaterial
          color="#FAF8F5"
          transparent
          transmission={0.9} // Glass opacity/transmission
          opacity={1}
          roughness={0.08}
          metalness={0.05}
          ior={1.5} // Index of refraction
          thickness={1.5}
          specularIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer wireframe/edges with bold navy stroke */}
      <mesh>
        <boxGeometry args={[2.22, 2.22, 2.22]} />
        <meshBasicMaterial
          color="#0F1D30"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Cute smiley face inside representing the logo's smile */}
      <group position={[0, -0.2, 1.12]}>
        {/* Left eye outline */}
        <mesh position={[-0.35, 0.2, 0]}>
          <ringGeometry args={[0.08, 0.1, 16, 1, 0, Math.PI]} />
          <meshBasicMaterial color="#0F1D30" side={THREE.DoubleSide} />
        </mesh>
        {/* Right eye outline */}
        <mesh position={[0.35, 0.2, 0]}>
          <ringGeometry args={[0.08, 0.1, 16, 1, 0, Math.PI]} />
          <meshBasicMaterial color="#0F1D30" side={THREE.DoubleSide} />
        </mesh>
        {/* Smile mouth */}
        <mesh position={[0, -0.1, 0]}>
          <ringGeometry args={[0.12, 0.14, 16, 1, Math.PI, Math.PI]} />
          <meshBasicMaterial color="#0F1D30" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Nested glowing core */}
      <EnergyCore />
    </group>
  );
}

// Particle field surrounding the cube
function FloatingParticles({ count = 250 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const nextPositions = new Float32Array(count * 3);
    const nextColors = new Float32Array(count * 3);
    const seeded = (index: number, salt: number) => {
      const wave = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
      return wave - Math.floor(wave);
    };

    for (let i = 0; i < count; i++) {
      nextPositions[i * 3] = (seeded(i, 1) - 0.5) * 12;
      nextPositions[i * 3 + 1] = (seeded(i, 2) - 0.5) * 12;
      nextPositions[i * 3 + 2] = (seeded(i, 3) - 0.5) * 12;

      const isAmber = seeded(i, 4) > 0.4;
      nextColors[i * 3] = isAmber ? 210 / 255 : 15 / 255;
      nextColors[i * 3 + 1] = isAmber ? 142 / 255 : 29 / 255;
      nextColors[i * 3 + 2] = isAmber ? 43 / 255 : 48 / 255;
    }

    return { positions: nextPositions, colors: nextColors };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = t * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          args={[positions, 3]} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          args={[colors, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

// Camera parallax mouse controller
function Rig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 2.2,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 2.2 + 0.5,
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ThreeHeroCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        {/* Sleek static CSS fallback during loading */}
        <div className="w-32 h-32 relative animate-bounce flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            <path d="M 50 15 L 80 30 L 50 45 L 20 30 Z" fill="#D28E2B" stroke="#0F1D30" strokeWidth="5" />
            <path d="M 20 30 L 50 45 L 50 80 L 20 65 Z" fill="#FFFFFF" stroke="#0F1D30" strokeWidth="5" />
            <path d="M 50 45 L 80 30 L 80 65 L 50 80 Z" fill="#FAF8F5" stroke="#0F1D30" strokeWidth="5" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        className="w-full h-full bg-transparent"
        gl={{ antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        
        {/* Lights */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} color="#FFFFFF" />
        <directionalLight position={[-5, -5, -5]} intensity={1.2} color="#D28E2B" />
        <pointLight position={[0, 0, 0]} intensity={3} distance={5} color="#E89D30" />
        
        {/* 3D Glass Box */}
        <GlassCube />
        
        {/* Dynamic Stars */}
        <FloatingParticles count={280} />
        
        {/* Parallax Mouse Rig */}
        <Rig />
      </Canvas>
    </div>
  );
}
