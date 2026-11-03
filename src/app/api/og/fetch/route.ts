import { createOgFetchRoute } from "@once-ui-system/core/next";
import { guardApiRequest } from "@/utils/apiSecurity";
import { RateLimiter } from "@/utils/rateLimit";

// Core's handler only fetches public addresses (every redirect is checked)
// and caps the size. sameOrigin keeps it from being an open fetcher for other sites.
const handler = createOgFetchRoute({ sameOrigin: true, timeout: 5000, maxBytes: 1024 * 1024 });
const limiter = new RateLimiter(60, 60_000);

export async function GET(request: Request) {
  return guardApiRequest(request, limiter) ?? handler.GET(request);
}
