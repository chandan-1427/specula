import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { redis } from "../cache/redis.js";
import { db } from "../database/index.js";
import { agents, agentLogs, alerts } from "../database/schema.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";

type Bindings = {
  Variables: {
    apiUserId: string;
  };
};

/**
 * Telemetry collector endpoint for external agents.
 *
 * Exposed at POST /
 * - authenticates requests using a static API key (middleware)
 * - performs upsert of agent metadata
 * - logs each event and publishes status updates to Redis
 * - optionally enqueues alerts and backchannel commands
 */
const collector = new Hono<Bindings>();

const telemetrySchema = z.object({
  jsonrpc: z.literal("2.0"),
  method: z.string(),
  params: z.object({
    agentId: z.string(), 
    status: z.string(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

collector.post("/", apiKeyAuth, zValidator("json", telemetrySchema), async (c) => {
    const data = c.req.valid("json");
    const { agentId: externalAgentId, status, metadata } = data.params;
    const ownerId = c.get("apiUserId"); 
    const now = new Date();

    // upsert agent record, creating or updating fields atomically
    const [agentRecord] = await db
      .insert(agents)
      .values({
        ownerId,
        name: externalAgentId,
        externalAgentId,
        currentMethod: data.method,
        metadata: metadata ?? {},
        lastSeen: now,
      })
      .onConflictDoUpdate({
        target: agents.externalAgentId,
        set: { currentMethod: data.method, metadata: metadata ?? {}, lastSeen: now },
      })
      .returning({ id: agents.id });

    // write event to agent_logs table
    await db.insert(agentLogs).values({
      agentId: agentRecord.id, 
      type: data.method,
      payload: { method: data.method, params: data.params },
    });

    // cache and broadcast current status payload to Redis
    const livePayload = {
      agentId: externalAgentId,
      ownerId,
      status,
      method: data.method,
      metadata: metadata ?? {},
      timestamp: now.toISOString(),
    };

    await Promise.all([
      redis.set(`agent:${externalAgentId}:status`, JSON.stringify(livePayload), { EX: 60 }),
      redis.publish("agent_updates", JSON.stringify(livePayload))
    ]);

    // alert engine: log critical failures and notify via pub/sub
    if (data.method === "payment_settlement" && status === "failed") {
      try {
        await db.insert(alerts).values({
          agentId: agentRecord.id,
          severity: "critical",
          type: "payment_fail",
          message: `Payment failed for agent ${externalAgentId}.`,
        });
        
        await redis.publish("agent_alerts", JSON.stringify({
          agentId: externalAgentId,
          ownerId,
          severity: "critical",
          message: "Payment Settlement Failed",
          timestamp: now.toISOString(),
        }));
      } catch (err) {
        console.error("Alert logging failed:", err);
      }
    }

    // backchannel: check for pending commands set by dashboard
    const commandKey = `agent_command:${externalAgentId}`;
    const pendingCommand = await redis.get(commandKey);

    if (pendingCommand) {
      await redis.del(commandKey); // Clear once dispatched
      
      // Return 202 with the command payload
      return c.json({ 
        success: true, 
        command: JSON.parse(pendingCommand) 
      }, 202);
    }

    // Standard response if no command is pending
    return c.json({ success: true }, 202);
});

export { collector };