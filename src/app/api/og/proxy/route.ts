import { createOgProxyRoute } from "@once-ui-system/core/next";
import { guardApiRequest } from "@/utils/apiSecurity";
import { RateLimiter } from "@/utils/rateLimit";

// Core's handler only fetches public addresses (every redirect is checked),
// passes raster image types only, caps the size, and sends nosniff plus a
// sandbox CSP. sameOrigin keeps it from being an open proxy for other sites.
const handler = createOgProxyRoute({ sameOrigin: true, timeout: 5000, maxBytes: 5 * 1024 * 1024 });
const limiter = new RateLimiter(60, 60_000);

export async function GET(request: Request) {
  return guardApiRequest(request, limiter) ?? handler.GET(request);
}
