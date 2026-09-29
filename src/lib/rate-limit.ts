import "server-only";

type Bucket = { count: number; resetAt: number };

/**
 * In-memory fixed-window rate limiter. Deliberately simple: single-instance
 * only — state resets on restart and isn't shared across multiple server
 * instances. Fine at this app's current scale; a production deployment
 * running more than one instance (which most serverless hosts do) needs a
 * shared store (Redis/Upstash) instead — swap the Map below for that when
 * it matters.
 */
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();

  // Cheap opportunistic cleanup so this Map doesn't grow unbounded in a
  // long-running process.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (now > b.resetAt) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

export async function getClientIp(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
