/**
 * Validates that a URL is safe to fetch server-side (anti-SSRF).
 * Blocks private/reserved IPs, non-HTTP(S) schemes, and localhost.
 */
export function isSafeUrl(input: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    return false;
  }

  // Only allow http and https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost variants
  if (
    hostname === "localhost" ||
    hostname === "[::1]" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    return false;
  }

  // Block private/reserved IPv4 ranges and link-local
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (
      a === 10 ||                          // 10.0.0.0/8
      a === 127 ||                         // 127.0.0.0/8
      (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
      (a === 192 && b === 168) ||          // 192.168.0.0/16
      (a === 169 && b === 254) ||          // 169.254.0.0/16 (link-local / cloud metadata)
      a === 0                              // 0.0.0.0/8
    ) {
      return false;
    }
  }

  // Block IPv6 private/loopback (bracketed notation)
  if (hostname.startsWith("[")) {
    const inner = hostname.slice(1, -1).toLowerCase();
    if (
      inner === "::1" ||
      inner.startsWith("fc") ||
      inner.startsWith("fd") ||
      inner.startsWith("fe80")
    ) {
      return false;
    }
  }

  return true;
}
