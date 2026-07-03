/**
 * In-memory sliding-window rate limiter — adequate for a single Node
 * instance (Vercel function instances each keep their own window, which
 * still blunts bursts). For multi-region production, swap the Map for
 * Upstash/Redis behind the same signature.
 */

const buckets = new Map<string, number[]>();
const MAX_KEYS = 5_000;

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((hits[0] + windowMs - now) / 1000) };
  }

  hits.push(now);
  buckets.set(key, hits);

  // cheap memory cap — drop the oldest keys if a scan ever floods us
  if (buckets.size > MAX_KEYS) {
    for (const k of buckets.keys()) {
      buckets.delete(k);
      if (buckets.size <= MAX_KEYS / 2) break;
    }
  }
  return { ok: true, retryAfter: 0 };
}

/** Best-effort client identity behind proxies/CDNs. */
export function clientKey(request: Request): string {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
