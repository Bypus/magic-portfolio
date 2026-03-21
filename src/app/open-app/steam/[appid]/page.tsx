"use client";

import { useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button, Column, Heading, Row, Text } from "@once-ui-system/core";

function normalizeAppId(raw: string | string[] | undefined): string | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return undefined;
  return /^\d+$/.test(value) ? value : undefined;
}

function tryOpenProtocol(url: string) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  setTimeout(() => iframe.remove(), 500);
}

export default function SteamLauncherPage() {
  const params = useParams<{ appid: string }>();
  const appid = normalizeAppId(params?.appid);
  const attempted = useRef(false);

  const protocolUrl = appid ? `steam://store/${appid}` : undefined;
  const webUrl = appid
    ? `https://store.steampowered.com/app/${appid}/`
    : "https://store.steampowered.com/";

  useEffect(() => {
    if (!protocolUrl || attempted.current) return;
    attempted.current = true;
    tryOpenProtocol(protocolUrl);
  }, [protocolUrl]);

  const handleOpen = useCallback(() => {
    if (protocolUrl) tryOpenProtocol(protocolUrl);
  }, [protocolUrl]);

  return (
    <Column as="section" maxWidth="s" horizontal="center" align="center" gap="20" paddingY="32">
      <Heading variant="display-strong-s">Opening Steam...</Heading>

      {appid ? (
        <Text align="center" onBackground="neutral-weak">
          If Steam does not open automatically, use one of the buttons below.
        </Text>
      ) : (
        <Text align="center" onBackground="danger-weak">
          Invalid app ID. Use a numeric value, for example /open-app/steam/730.
        </Text>
      )}

      <Row gap="12" s={{ direction: "column" }}>
        <Button disabled={!protocolUrl} onClick={handleOpen}>
          Open in Steam
        </Button>
        <Button href={webUrl} variant="secondary">
          Open web store page
        </Button>
      </Row>
    </Column>
  );
}
