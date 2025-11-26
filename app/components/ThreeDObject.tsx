"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function RecordModel() {
  const { scene } = useGLTF("/models/disco_ball.glb");
  const meshRef = useRef<THREE.Group>(null);

  // Auto-rotate the model itself instead of camera
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      position={[0, 0, 0]}
      scale={0.015}
    />
  );
}
export default function SpinningRecord() {
  return (
    <div className="w-full h-[700px] tall-screen:h-[800px] mt-[5vh] md:mt-[10vh] tall-screen:mt-[14vh] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 0.75], fov: 50 }}
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#D52D00"]} />
        
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <directionalLight position={[-10, 10, 10]} intensity={2} />
        <pointLight position={[0, 0, 5]} intensity={3} />
        
        <Environment preset="city" resolution={256} />
        <RecordModel />
      </Canvas>
    </div>
  );
}