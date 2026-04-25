"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, useGLTF, ContactShadows, Center } from "@react-three/drei";
import * as THREE from "three";

function TitleModel() {
  const { scene } = useGLTF("/avengers_doomsday_title.glb");
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          child.material.envMapIntensity = 2;
          child.material.metalness = 0.9;
          child.material.roughness = 0.1;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const targetRotationX = -state.mouse.y * 0.2;
    const targetRotationY = state.mouse.x * 0.3;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.05
    );
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.4}
      floatingRange={[-0.1, 0.1]}
    >
      <Center>
        <group ref={groupRef}>
          <primitive object={scene} scale={2} rotation={[0, 0, 0]} />
        </group>
      </Center>
    </Float>
  );
}

export function DoomsdayTitle3D({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`w-full h-full relative z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={2.5} 
          color="#10b981"
        />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
        <directionalLight position={[0, 5, 5]} intensity={1.5} />

        <Suspense fallback={null}>
          <TitleModel />
          <Environment preset="night" />
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.6} 
            scale={10} 
            blur={2} 
            far={4} 
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
