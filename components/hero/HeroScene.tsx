"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

type CubeProps = {
  position: [number, number, number];
};

function Cube({ position }: CubeProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />

      <meshPhysicalMaterial
        color="#7dd3fc"
        transparent
        opacity={0.55}
        roughness={0.15}
        metalness={0.1}
      />
    </mesh>
  );
}

function CubeGroup() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.x += delta * 0.1;
    groupRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* center */}
      <Cube position={[0, 0, 0]} />

      {/* x */}
      <Cube position={[1, 0, 0]} />
      <Cube position={[-1, 0, 0]} />

      {/* y */}
      <Cube position={[0, 1, 0]} />
      <Cube position={[0, -1, 0]} />

      {/* z */}
      <Cube position={[0, 0, 1]} />
      <Cube position={[0, 0, -1]} />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="h-[500px] w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 3, 5]} intensity={2} />

        <CubeGroup />
      </Canvas>
    </div>
  );
}
