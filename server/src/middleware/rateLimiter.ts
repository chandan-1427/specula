import type { Context, Next } from "hono";
import { Redis } from "ioredis";
import { env } from "../config/env.js";

const redis = new Redis(env.REDIS_URL);

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

/**
 * Create a simple IP-based rate limiting middleware using Redis.
 *
 * @param limit maximum number of requests allowed in the window
 * @param windowSeconds duration of the rate limit window in seconds
 * @returns Hono middleware that attaches rate limit headers and returns
 *          429 when the limit is exceeded.
 */
export const rateLimiter = (limit: number, windowSeconds: number) => {
  return async (c: Context, next: Next) => {
    const ip =
      c.req.header("x-forwarded-for")?.split(",")[0].trim() ||
      c.req.header("cf-connecting-ip") ||
      "unknown";

    const key = `rate-limit:${c.req.path}:${ip}`;

    try {
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }

      c.header("X-RateLimit-Limit", limit.toString());
      c.header("X-RateLimit-Remaining", Math.max(0, limit - current).toString());

      if (current > limit) {
        c.header("Retry-After", windowSeconds.toString());

        return c.json(
          {
            success: false,
            message: "Too many requests. Please try again later.",
          },
          429
        );
      }

      await next();
    } catch (err) {
      console.error("Rate limiter failed:", err);
      // on redis error we choose to fail open rather than block traffic
      await next();
    }
  };
};