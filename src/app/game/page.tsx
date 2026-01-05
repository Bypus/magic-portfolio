import { Column, Flex, Heading } from "@once-ui-system/core";

import { baseURL } from "@/resources";
// import { game, person, newsletter } from "@/resources/content";

// import GameComponent from "@/components/Game";

export async function generateMetadata() {
  // const title = game.title;
  // const description = game.description;
  const title = "Game";
  const description = "Game page";
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/game`,
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

export default function Game() {
  return (
    <Flex fillHeight fillWidth>
      {/* <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Test",
            headline: game.title,
            description: game.description,
            url: `https://${baseURL}/test`,
            image: `${baseURL}/og?title=${encodeURIComponent(game.title)}`,
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
      /> */}

      {/* <GameComponent /> */}
    </Flex>
  );
}
