import { RateLimiter, clientKey } from "./rateLimit";

export function guardApiRequest(request: Request, limiter?: RateLimiter, sameOrigin = true): Response | null {
  if (request.url.length > 8192) {
    return Response.json({ error: "URL too long" }, { status: 414, headers: { "Cache-Control": "no-store" } });
  }
  const source = request.headers.get("origin") ?? request.headers.get("referer");
  let crossOrigin = request.headers.get("sec-fetch-site") === "cross-site";
  if (source) {
    try {
      // Next can use an internal hostname in request.url. Host is the origin
      // addressed by the browser (browsers cannot forge the Host header).
      const ownUrl = new URL(request.url);
      const host = request.headers.get("host");
      if (host) ownUrl.host = host;
      crossOrigin ||= new URL(source).origin !== ownUrl.origin;
    } catch {
      crossOrigin = true;
    }
  }
  if (sameOrigin && crossOrigin) {
    return Response.json({ error: "Forbidden" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const retryAfter = limiter?.take(clientKey(request.headers)) ?? 0;
  return retryAfter > 0
    ? Response.json({ error: "Too many requests" }, {
        status: 429,
        headers: { "Retry-After": String(retryAfter), "Cache-Control": "no-store" },
      })
    : null;
}

export class RequestBodyError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export async function readSmallJson(request: Request, maxBytes = 4096, timeoutMs = 5000): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new RequestBodyError(415, "Expected application/json");
  }
  if (Number(request.headers.get("content-length")) > maxBytes) {
    throw new RequestBodyError(413, "Request body too large");
  }
  if (!request.body) throw new RequestBodyError(400, "Invalid request");
  const reader = request.body.getReader();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new RequestBodyError(408, "Request timed out")), timeoutMs);
  });
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new RequestBodyError(413, "Request body too large");
      chunks.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder().decode(body));
  } catch (error) {
    if (error instanceof RequestBodyError) throw error;
    throw new RequestBodyError(400, "Invalid request");
  } finally {
    clearTimeout(timer);
    void reader.cancel().catch(() => undefined);
  }
}
