"use client";

import dynamic from "next/dynamic";

const Room3D = dynamic(() => import("@/components/room/Room3D"), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh",
      fontSize: "1.2rem",
      color: "#666"
    }}>
      Loading 3D Room...
    </div>
  ),
});

export default function RoomWrapper() {
  return <Room3D />;
}
