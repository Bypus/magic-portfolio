"use client";

import dynamic from "next/dynamic";

const Room3D = dynamic(() => import("./Room"), { ssr: false });

export default function Room3DWrapper() {
  return <Room3D />;
}