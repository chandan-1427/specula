// routes/agents.routes.ts

/**
 * API endpoints for managing agent entities and retrieving logs.
 *
 * All routes require JWT authentication (isAuthorized middleware).
 */
import { Hono } from "hono";
import { db } from "../database/index.js";
import { agents, agentLogs } from "../database/schema.js";
import { eq, desc } from "drizzle-orm";
import { isAuthorized } from "../middleware/auth.middleware.js";
import { redis } from "../cache/redis.js";

const agentsRoute = new Hono();

agentsRoute.use("*", isAuthorized);

agentsRoute.get("/", async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.sub;

  // fetch all agents belonging to the authenticated user
  const dbAgents = await db
    .select()
    .from(agents)
    .where(eq(agents.ownerId, userId));

  // return early when there are no agents to prevent unnecessary Redis calls
  if (dbAgents.length === 0) return c.json([]);

  // build Redis keys for status lookup
  const keys = dbAgents.map((agent) => `agent:${agent.externalAgentId}:status`);

  // get status entries from Redis with a single mGet call
  const redisStatuses = await redis.mGet(keys);

  // merge database records with live status information
  const hydratedAgents = dbAgents.map((agent, index) => {
    const liveStatus = redisStatuses[index];

    if (liveStatus) {
      const parsed = JSON.parse(liveStatus);
      return {
        ...agent,
        lastSeen: parsed.timestamp || agent.lastSeen,
        status: parsed.status,
        metadata: parsed.metadata,
      };
    }

    // Default to offline if no Redis entry exists
    return { ...agent, status: "offline" };
  });

  return c.json(hydratedAgents);
});

agentsRoute.get("/:agentId/logs", async (c) => {
  const agentId = c.req.param("agentId");

  const logs = await db
    .select()
    .from(agentLogs)
    .where(eq(agentLogs.agentId, agentId))
    .orderBy(desc(agentLogs.createdAt))
    .limit(50);

  return c.json(logs);
});

// Add this new route to trigger self-healing commands
agentsRoute.post("/:agentId/command", async (c) => {
  const agentId = c.req.param("agentId");
  // agentId corresponds to the externalAgentId provided by the client
  const { command } = await c.req.json();
  const payload = c.get("jwtPayload");

  // ensure the authenticated user owns the target agent before queuing a command
  const agent = await db
    .select()
    .from(agents)
    .where(eq(agents.externalAgentId, agentId))
    .limit(1);

  if (!agent.length || agent[0].ownerId !== payload.sub) {
    return c.json({ success: false, message: "Unauthorized" }, 403);
  }

  // Queue the command in Redis for the next heartbeat to pick up
  await redis.set(`agent_command:${agentId}`, JSON.stringify(command), { EX: 300 });

  return c.json({ success: true, message: "Command queued for dispatch" });
});

export default agentsRoute;