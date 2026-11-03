// Per-instance protection, not a distributed quota. The fixed capacity prevents
// attackers from growing the map indefinitely by rotating client identifiers.
export class RateLimiter {
  private entries = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly capacity = 10_000,
  ) {}

  take(key: string, now = Date.now()): number {
    if (this.entries.size >= this.capacity) {
      for (const [client, entry] of this.entries) {
        if (entry.resetAt <= now) this.entries.delete(client);
      }
    }
    const entry = this.entries.get(key);
    if (!entry || entry.resetAt <= now) {
      if (!entry && this.entries.size >= this.capacity) {
        return Math.ceil(this.windowMs / 1000);
      }
      this.entries.set(key, { count: 1, resetAt: now + this.windowMs });
      return 0;
    }
    entry.count += 1;
    return entry.count > this.limit ? Math.ceil((entry.resetAt - now) / 1000) : 0;
  }

  clear(key: string): void {
    this.entries.delete(key);
  }
}

export function clientKey(headers: Headers): string {
  // Vercel overwrites this header. On other hosts, don't trust client-supplied
  // forwarding headers: use one shared bucket until a trusted proxy is configured.
  return process.env.VERCEL === "1"
    ? headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    : "local";
}
