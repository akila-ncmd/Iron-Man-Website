"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, useGLTF, Center } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { ScrambleText } from "@/components/ui/ScrambleText";

function CameraMotion() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    // Slow dramatic push inward
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6, 0.005);
  });
  return null;
}

function TitleModel() {
  const { scene } = useGLTF("/avengers_doomsday_title.glb");
  const lightRef1 = useRef<THREE.SpotLight>(null);
  const lightRef2 = useRef<THREE.SpotLight>(null);

  // Sweep two lights crossing each other for maximum drama
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lightRef1.current) {
      lightRef1.current.position.x = Math.sin(t * 1.2) * 10;
    }
    if (lightRef2.current) {
      lightRef2.current.position.x = Math.cos(t * 1.5) * -10;
    }
  });

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (
          child.name.toLowerCase().includes("plane") ||
          child.name.toLowerCase().includes("bg") ||
          child.name.toLowerCase().includes("ground") ||
          child.name.toLowerCase().includes("background")
        ) {
          child.visible = false;
        }

        if (child.material) {
          child.material.color = new THREE.Color("#71717a"); // Zinc-500 base color for subtle visibility
          child.material.metalness = 1;
          child.material.roughness = 0.15; // Slightly glossier
          child.material.envMapIntensity = 2; // Stronger reflections
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <group>
      {/* Primary Emerald Sweep */}
      <spotLight
        ref={lightRef1}
        position={[-10, 2, 6]}
        angle={0.5}
        penumbra={0.8}
        intensity={25}
        color="#10b981"
        distance={30}
      />
      {/* Secondary Silver/Steel Sweep */}
      <spotLight
        ref={lightRef2}
        position={[10, -2, 6]}
        angle={0.5}
        penumbra={0.8}
        intensity={15}
        color="#94a3b8"
        distance={30}
      />
      {/* Backlight for silhouette separation */}
      <pointLight position={[0, 0, -5]} intensity={5} color="#10b981" />
      
      <Float
        speed={1.5} 
        rotationIntensity={0.08} 
        floatIntensity={0.3}
      >
        <Center>
          <primitive 
            object={scene} 
            scale={1.0} 
            rotation={[Math.PI / 2, 0, 0]} 
            position={[0, 0, 0]} 
          />
        </Center>
      </Float>
    </group>
  );
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1200);
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Glitch Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-overlay bg-[url('/noise.svg')]" />
            <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
              <CameraMotion />
              <color attach="background" args={["#000000"]} />
              
              {/* Subtle ambient lighting to prevent pure blackness */}
              <ambientLight intensity={0.5} />
              {/* Soft front light so the face of the letters is readable */}
              <directionalLight position={[0, 0, 10]} intensity={1.5} color="#ffffff" />
              
              <Suspense fallback={null}>
                <TitleModel />
                <Environment preset="night" />
              </Suspense>
            </Canvas>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-16 z-30 font-mono text-[10px] uppercase tracking-[0.4em] text-accent/80 flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse-emerald" />
            <ScrambleText text="INITIATING SOVEREIGN PROTOCOL" duration={2000} delay={1000} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
