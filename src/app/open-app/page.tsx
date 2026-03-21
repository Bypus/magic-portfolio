import { Column, Heading, SmartLink, Text } from "@once-ui-system/core";

export default function OpenAppIndexPage() {
  return (
    <Column as="section" maxWidth="s" horizontal="center" align="center" gap="16" paddingY="32">
      <Heading variant="display-strong-s">App launcher</Heading>
      <Text onBackground="neutral-weak" align="center">
        Open a game store page directly in its native launcher.
      </Text>
      <Text align="center">
        Steam: <SmartLink href="/open-app/steam/730">/open-app/steam/730</SmartLink>
      </Text>
      <Text align="center">
        Epic: <SmartLink href="/open-app/epic/fortnite">/open-app/epic/fortnite</SmartLink>
      </Text>
    </Column>
  );
}
