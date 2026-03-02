import { serve } from "@hono/node-server";
import { checkDatabaseConnection, closePool } from "./database/index.js";
import { env } from "./config/env.js";
import { connectAllRedis, disconnectAllRedis } from "./cache/redis.js";
import { app, wsHandler } from "./app.js";

const startServer = async () => {
  try {
    // connect infrastructure (database, redis) before launching server
    await Promise.all([
      checkDatabaseConnection(),
      connectAllRedis(),
    ]);

    console.log("Infrastructure ready");

    // start HTTP and WebSocket server
    const server = serve(
      {
        fetch: app.fetch,
        port: env.PORT,
      },
      (info) => {
        console.log(`Server running on port: ${info.port}`);
      }
    );

    wsHandler.injectWebSocket(server);

    // define graceful shutdown procedure
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("HTTP server closed.");

        try {
          await Promise.all([
            closePool(),
            disconnectAllRedis(),
          ]);

          console.log("All connections closed cleanly.");
          process.exit(0);
        } catch (err) {
          console.error("Error during shutdown:", err);
          process.exit(1);
        }
      });

      // force exit after timeout if shutdown hangs
      setTimeout(() => {
        console.error("⚠️ Forced shutdown after timeout.");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();