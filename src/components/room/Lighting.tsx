"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

export function Lighting() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.set(mousePos.x * 5, 5, mousePos.y * 5);
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} color={0xffe0b2} />
      <pointLight
        position={[1, 2, 1]}
        intensity={0.6}
        color={0xffcc99}
        distance={10}
        decay={2}
      />
      <directionalLight ref={lightRef} intensity={1} />
    </>
  );
}
