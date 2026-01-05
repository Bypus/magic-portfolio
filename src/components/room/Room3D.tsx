"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Models } from "./Models";
import { RoomShell } from "./RoomShell";
import { Lighting } from "./Lighting";

export default function Room3D() {
  return (
    <div
      style={{
        height: "88vh",
        width: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <Lighting />

        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 5}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={2}
          maxDistance={10}
        />

        <Suspense fallback={null}>
          <RoomShell />
          <Models />
        </Suspense>
      </Canvas>
    </div>
  );
}
