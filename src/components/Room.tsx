"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

useGLTF.preload("/models/leather-sofa.glb");
useGLTF.preload("/models/TVplusStandplusTT.glb");

function TableBasse() {
  return (
    <mesh position={[0, -0.9, -0.6]}>
      <boxGeometry args={[1.2, 0.2, 0.6]} />
      <meshStandardMaterial color="SaddleBrown" />
    </mesh>
  );
}

function TV() {
  const { scene } = useGLTF("/models/TVplusStandplusTT.glb") as any; // Utilisation de 'as any' pour contourner le problème de typage

  return <primitive object={scene} scale={0.13} position={[0, -1, -1.7]} />;
  
}

function Sofa() {
  const { scene } = useGLTF("/models/leather-sofa.glb") as any;
  scene.rotation.y = Math.PI;
  return <primitive object={scene} scale={0.95} position={[0, -1, 0.5]} />;
}

function Piano() {
  const { scene } = useGLTF("/models/piano.glb") as any;
  return <primitive object={scene} scale={0.9} position={[0, -1, 1.125]} />;
}

function RoomShell() {
  return (
    <>
      {/* Sol */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="beige" />
      </mesh>

      {/* Mur du fond */}
      <mesh position={[0, 0.25, -2]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Mur gauche */}
      <mesh position={[-2, 0.25, -0.75]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Mur droit */}
      <mesh position={[2, 0.25, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <Suspense fallback={null}>
        <Sofa />
        <Piano />
        <TableBasse />
        <TV />
      </Suspense>

    </>
  );
}

function DynamicLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
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

  return <directionalLight ref={lightRef} intensity={1} />;
}

export default function Room3D() {
  // const [lightPosition, setLightPosition] = useState(new THREE.Vector3(5, 5, 5));

  // useEffect(() => {
  //   const handleMouseMove = (event: MouseEvent) => {
  //     const x = (event.clientX / window.innerWidth) * 2 - 1;
  //     const y = -(event.clientY / window.innerHeight) * 2 + 1;

  //     // Mettez à jour la position de la lumière en fonction de la position de la souris
  //     setLightPosition(new THREE.Vector3(x * 5, y * 5, 5)); // Ajuste les valeurs pour obtenir un mouvement fluide
  //   };
  //   window.addEventListener("mousemove", handleMouseMove);

  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, []);
  
  return (
    <div style={{ 
      height: "88vh", // Prendre 100% de la hauteur de la fenêtre
      width: "90vh",   // Prendre 100% de la largeur
      margin: 0,       // Pas de marge
      padding: 0,      // Pas de padding
      overflow: "hidden", // Cache tout débordement
      }}>
      <Canvas 
        camera={{ position: [5, 5, 5], fov: 50 }} 
        // style={{ height: "100%", width: "100%" }}
      >
        <ambientLight intensity={0.3} color={0xffe0b2} />
        <pointLight position={[1, 2, 1]} intensity={0.6} color={0xffcc99} distance={10} decay={2} />

        <DynamicLight />

        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2}   // Limite à 90 degrés
          minPolarAngle={Math.PI / 5}   // Empêche de tourner sous l'axe horizontal
          enableDamping={true} // Active le damping
          dampingFactor={1} // L'intensité du ralentissement
          rotateSpeed={0.5} // Vitesse de rotation
          minDistance={2}     // Zoom in max
          maxDistance={10}
        />
        <RoomShell />
      </Canvas>
    </div>
  );
}


