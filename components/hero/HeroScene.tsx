"use client";

import { Edges } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import type { Group } from "three";

type CubeProps = {
  position: [number, number, number];
  color: string;
};

const cubePositions: [number, number, number][] = [];

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      cubePositions.push([x, y, z]);
    }
  }
}

const neonColors = [
  "#00e5ff", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#d946ef", // magenta
];

function Cube({ position, color }: CubeProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />

      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.35}
        roughness={0.1}
        metalness={0}
        transmission={0.6}
        thickness={0.5}
        ior={1.5}
      />

      <Edges color={color} />
    </mesh>
  );
}

function CubeGroup() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsedTime = state.clock.getElapsedTime();

    groupRef.current.rotation.x += delta * 0.1;
    groupRef.current.rotation.y += delta * 0.2;
    groupRef.current.position.y = Math.sin(elapsedTime) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {cubePositions.map((position, index) => {
        const color = neonColors[index % neonColors.length];

        return (
          <Cube key={position.join(",")} position={position} color={color} />
        );
      })}
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
            intensity={1.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
