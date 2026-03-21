"use client";

import { useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button, Column, Heading, Row, Text } from "@once-ui-system/core";

function normalizeProductId(raw: string | string[] | undefined): string | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return undefined;
  return /^[a-zA-Z0-9-_.]+$/.test(value) ? value : undefined;
}

function tryOpenProtocol(url: string) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  setTimeout(() => iframe.remove(), 500);
}

export default function EpicLauncherPage() {
  const params = useParams<{ productId: string }>();
  const productId = normalizeProductId(params?.productId);
  const attempted = useRef(false);

  const launcherUrl = productId
    ? `com.epicgames.launcher://store/product/${productId}`
    : undefined;
  const webUrl = productId
    ? `https://store.epicgames.com/p/${productId}`
    : "https://store.epicgames.com/";

  useEffect(() => {
    if (!launcherUrl || attempted.current) return;
    attempted.current = true;
    tryOpenProtocol(launcherUrl);
  }, [launcherUrl]);

  const handleOpen = useCallback(() => {
    if (launcherUrl) tryOpenProtocol(launcherUrl);
  }, [launcherUrl]);

  return (
    <Column as="section" maxWidth="s" horizontal="center" align="center" gap="20" paddingY="32">
      <Heading variant="display-strong-s">Opening Epic Games Launcher...</Heading>

      {productId ? (
        <Text align="center" onBackground="neutral-weak">
          If the launcher does not open automatically, use one of the buttons below.
        </Text>
      ) : (
        <Text align="center" onBackground="danger-weak">
          Invalid product ID. Use letters, numbers, dashes, underscores, or dots.
        </Text>
      )}

      <Row gap="12" s={{ direction: "column" }}>
        <Button disabled={!launcherUrl} onClick={handleOpen}>
          Open in Epic Launcher
        </Button>
        <Button href={webUrl} variant="secondary">
          Open web store page
        </Button>
      </Row>
    </Column>
  );
}
