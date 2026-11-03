// Keep static rendering: Next's bootstrap and the theme initializer need inline
// scripts. A nonce-based policy would require rendering every page per request.
export function securityHeaders(development = false, miniGame = false) {
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${miniGame ? " https://unpkg.com" : ""}${development ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self' https:${development ? " ws: wss:" : ""}`,
    "media-src 'self' blob: https:",
    "worker-src 'self' blob:",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com steam: com.epicgames.launcher:",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    ...(development ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ...(development ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]),
  ];
}
