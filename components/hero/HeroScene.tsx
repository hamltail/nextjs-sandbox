"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import type { Group } from "three";

type CubeProps = {
  position: [number, number, number];
};

const cubePositions: [number, number, number][] = [];

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      cubePositions.push([x, y, z]);
    }
  }
}

function Cube({ position }: CubeProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />

      <meshPhysicalMaterial
        color="#dbeafe"
        transparent
        opacity={0.35}
        roughness={0.1}
        metalness={0}
        transmission={0.6}
        thickness={0.5}
        ior={1.5}
      />

      <Edges color="#00e5ff" />
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
      {cubePositions.map((position) => (
        <Cube key={position.join(",")} position={position} />
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="h-[500px] w-full">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 3, 5]} intensity={2} />

        <CubeGroup />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
            intensity={1.2}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
