import type { Context, Next } from "hono";
import { db } from "../database/index.js";
import { apiKeys } from "../database/schema.js";
import { eq } from "drizzle-orm";

/**
 * Middleware that validates an `x-api-key` header against the
 * `api_keys` table. On success the associated userId is attached to
 * the context under `apiUserId`.
 */
export const apiKeyAuth = async (c: Context, next: Next) => {
  const key = c.req.header("x-api-key");

  if (!key) {
    return c.json({ success: false, message: "Missing API key" }, 401);
  }

  const record = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.key, key))
    .limit(1);

  if (!record.length) {
    return c.json({ success: false, message: "Invalid API key" }, 401);
  }

  // Attach userId to context
  c.set("apiUserId", record[0].userId);

  await next();
};