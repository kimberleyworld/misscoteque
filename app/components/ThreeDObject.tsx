"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";

function RecordModel() {
  const { scene } = useGLTF("/models/disco_ball.glb");

  return (
    <primitive
      object={scene}
      position={[0, 0, 0]}
      scale={0.02}
    />
  );
}
export default function SpinningRecord() {
  return (
    <div className="w-full h-[700px]">
      <Canvas
        camera={{ position: [0, 0, 0.75], fov: 50 }}
      >
        <color attach="background" args={["#D52D00"]} />
        
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <directionalLight position={[-10, 10, 10]} intensity={2} />
        <pointLight position={[0, 0, 5]} intensity={3} />
        
        <Environment preset="sunset" />
        <RecordModel />

        {/* Auto-rotate camera */}
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={1}
          minDistance={1}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}