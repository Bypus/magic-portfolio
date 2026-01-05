export function RoomShell() {
  return (
    <>
      {/* Floor */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="beige" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0.25, -2]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-2, 0.25, -0.75]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Right wall */}
      <mesh position={[2, 0.25, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
}
