import { Column, Flex, Heading } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/test/Posts";
import { baseURL } from "@/app/resources";
import { room, person, newsletter } from "@/app/resources/content";
import dynamic from 'next/dynamic';

import Room3DWrapper from "@/components/RoomWrapper";

export async function generateMetadata() {
  const title = room.title;
  const description = room.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/room`,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Room() {
  return (
    <Column maxWidth="s">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Test",
            headline: room.title,
            description: room.description,
            url: `https://${baseURL}/test`,
            image: `${baseURL}/og?title=${encodeURIComponent(room.title)}`,
            author: {
              "@type": "Person",
              name: person.name,
              image: {
                "@type": "ImageObject",
                url: `${baseURL}${person.avatar}`,
              },
            },
          }),
        }}
      />
      <div className="flex items-center justify-center h-screen">
        <Room3DWrapper />
      </div>
    </Column>
  );
}
