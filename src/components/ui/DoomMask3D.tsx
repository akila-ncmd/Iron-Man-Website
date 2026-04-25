"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, useGLTF, ContactShadows, Center } from "@react-three/drei";
import * as THREE from "three";

function MaskModel() {
  const { scene } = useGLTF("/doctor_dooms_mask.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Optional: tweak materials if they need to look more metallic/green tinted
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Ensure materials catch environment reflections well
        if (child.material) {
          child.material.envMapIntensity = 1.5;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Follow cursor with smooth lerping
    // We target a slight rotation based on mouse position (-1 to 1)
    const targetRotationX = -state.mouse.y * 0.4;
    const targetRotationY = state.mouse.x * 0.6;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.1
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.1
    );
  });

  return (
    <Float
      speed={1.5} // Animation speed
      rotationIntensity={0.2} // XYZ rotation intensity
      floatIntensity={0.5} // Up/down float intensity
      floatingRange={[-0.05, 0.05]} // Range of y-axis values
    >
      <Center>
        <group ref={groupRef}>
          <primitive object={scene} scale={2.8} rotation={[0, 0, 0]} />
        </group>
      </Center>
    </Float>
  );
}

export function DoomMask3D({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ minHeight: '400px' }}>
        <div className="w-8 h-8 rounded-full border-t-2 border-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full cursor-default relative z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        {/* Cinematic Lighting Setup */}
        <ambientLight intensity={0.4} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={2} 
          castShadow 
          color="#10b981"
        />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
        <directionalLight 
          position={[0, 5, 5]} 
          intensity={1.5} 
          color="#ffffff" 
        />

        <Suspense fallback={null}>
          <MaskModel />

          {/* High quality reflections */}
          <Environment preset="city" />
          
          {/* Subtle shadow beneath the mask to ground it */}
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4} 
            color="#000000"
          />
        </Suspense>
      </Canvas>
      
      {/* Decorative HUD Elements around the 3D canvas */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-accent/60 uppercase tracking-[0.2em] pointer-events-none">
        Target: Earth-616
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] pointer-events-none flex items-center gap-2">
        Scanning active
        <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
      </div>
    </div>
  );
}
