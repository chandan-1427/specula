/**
 * Main application configuration. Sets up middleware, routes, and
 * websocket handling for real-time agent updates and alerts.
 */
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { HTTPException } from "hono/http-exception";
import { createNodeWebSocket } from "@hono/node-ws";
import { decode, verify } from "hono/jwt"

import { env } from "./config/env.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { requestId } from "./middleware/requestId.js";
import authRoutes from "./routes/auth.routes.js";
import { isAuthorized } from "./middleware/auth.middleware.js";
import { redisSubscriber } from "./cache/redis.js";
import { collector } from "./routes/collector.routes.js";
import agentsRoute from "./routes/agents.routes.js";

// define binding types for request context
type AppBindings = {
  Variables: {
    requestId: string;
  };
};

export const app = new Hono<AppBindings>();

export const wsHandler = createNodeWebSocket({ app });
const { upgradeWebSocket } = wsHandler;

const connectedClients = new Set<any>();

// Redis pub/sub channels that drive websocket broadcasts
const channels = ["agent_updates", "agent_alerts"];

channels.forEach((channel) => {
  redisSubscriber.subscribe(channel, (message) => {
    const data = JSON.parse(message);
    
    // tag payload with streamType to distinguish alerts from updates
    const payload = {
      ...data,
      streamType: channel === "agent_alerts" ? "ALERT" : "UPDATE"
    };

    for (const ws of connectedClients) {
      const client = ws as any;
      // only forward messages to clients belonging to the same owner
      if (client.readyState === 1 && client.userId === data.ownerId) {
        client.send(JSON.stringify(payload));
      }
    }
  });
});

app.use("*", secureHeaders());
app.use("*", requestId);

if (env.NODE_ENV !== "test") {
  app.use("*", logger());
}

app.use("*", cors({
  origin: (origin) =>
    origin && origin === env.FRONTEND_URL ? origin : null,
  credentials: true,
}));

if (env.NODE_ENV === "production") {
  app.use("*", rateLimiter(100, 15 * 60));
  app.use("/api/auth/*", rateLimiter(5, 15 * 60));
} else if (env.NODE_ENV === "development") {
  app.use("*", rateLimiter(1000, 60));
  app.use("/api/auth/*", rateLimiter(50, 60));
}

app.get("/health", (c) =>
  c.json({
    status: "ok",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
);

app.route("/api/auth", authRoutes);

app.route("/api/ingest", collector);

app.get("/api/me", isAuthorized, (c) => {
  const payload = c.get("jwtPayload");
  return c.json({
    message: "Authorized access",
    userId: payload.sub,
  });
});

app.route("/api/agents", agentsRoute);

app.get("/ws", upgradeWebSocket(async (c) => {
  const token = c.req.query("token");

  if (!token) {
    console.error("WS Connection refused: no token provided");
    return { onClose: () => {} }; // early exit
  }

  try {
    // verify and decode provided JWT
    const payload = await verify(token, env.JWT_SECRET, "HS256");
    const userId = payload.sub;

    return {
      onOpen(_, ws) {
        console.log(`Dashboard connected for User: ${userId}`);
        
        // attach userId for later filtering
        (ws as any).userId = userId; 
        connectedClients.add(ws);
      },

      onClose(_, ws) {
        console.log("Dashboard disconnected");
        connectedClients.delete(ws);
      },
    };
  } catch (err) {
    console.error("❌ WS Connection refused: Invalid Token");
    return { onClose: () => {} };
  }
}));

app.onError((err, c) => {
  const requestId = c.get("requestId");

  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
        requestId,
      },
      err.status
    );
  }

  console.error({
    message: err.message,
    requestId,
  });

  return c.json(
    {
      success: false,
      message: "Internal server error",
      requestId,
    },
    500
  );
});

export default app;