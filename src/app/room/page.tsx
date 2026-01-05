import { Meta, Schema } from "@once-ui-system/core";
import { baseURL, person } from "@/resources";
import RoomWrapper from "./RoomWrapper";

export async function generateMetadata() {
  return Meta.generate({
    title: "3D Room",
    description: "My 3D model showcase",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("3D Room")}`,
    path: "/room",
  });
}

export default function Room() {
  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        title="3D Room"
        description="My 3D model showcase"
        path="/room"
        image={`/api/og/generate?title=${encodeURIComponent("3D Room")}`}
        author={{
          name: person.name,
          url: `${baseURL}/room`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <RoomWrapper />
    </>
  );
}