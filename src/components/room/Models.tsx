import { useGLTF } from "@react-three/drei";

function TV() {
  const { scene } = useGLTF("/models/TVplusStandplusTT.glb");
  return <primitive object={scene} scale={0.13} position={[0, -1, -1.7]} />;
}

function Sofa() {
  const { scene } = useGLTF("/models/leather-sofa.glb");
  scene.rotation.y = Math.PI;
  return <primitive object={scene} scale={0.95} position={[0, -1, 0.5]} />;
}

function Piano() {
  const { scene } = useGLTF("/models/piano.glb");
  return <primitive object={scene} scale={0.9} position={[0, -1, 1.125]} />;
}

function TableBase() {
  return (
    <mesh position={[0, -0.9, -0.6]}>
      <boxGeometry args={[1.2, 0.2, 0.6]} />
      <meshStandardMaterial color="SaddleBrown" />
    </mesh>
  );
}

export function Models() {
  return (
    <>
      <Sofa />
      <Piano />
      <TableBase />
      <TV />
    </>
  );
}
