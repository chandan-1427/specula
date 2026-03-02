import { pgTable, uuid, text, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(), // This will store the Hash
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agents = pgTable(
  "agents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    externalAgentId: varchar("external_agent_id", { length: 100 }).notNull().unique(),
    
    currentMethod: varchar("current_method", { length: 50 }), 
    metadata: jsonb("metadata").default({}), 
    
    description: text("description"),
    lastSeen: timestamp("last_seen", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    // compound index used for efficient lookups during agent hydration
    ownerAgentIdx: index("agents_owner_external_idx").on(table.ownerId, table.externalAgentId),
    
    ownerIdx: index("agents_owner_idx").on(table.ownerId),
    externalIdIdx: index("agents_external_id_idx").on(table.externalAgentId),
  })
);

// ─────────────────────────────────────────
// AGENT LOGS TABLE
// ─────────────────────────────────────────
export const agentLogs = pgTable(
  "agent_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Proper foreign key reference
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),

    type: varchar("type", { length: 50 }).notNull(), 
    // example values: 'heartbeat', 'task', 'a2a', 'payment'

    payload: jsonb("payload").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    agentIdx: index("agent_logs_agent_idx").on(table.agentId),
    typeIdx: index("agent_logs_type_idx").on(table.type),
  })
);

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    key: varchar("key", { length: 255 })
      .notNull()
      .unique(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("api_keys_user_idx").on(table.userId),
  })
);

export const alerts = pgTable(
  "alerts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    agentId: uuid("agent_id").notNull().references(() => agents.id, { onDelete: "cascade" }),
    severity: varchar("severity", { length: 20 }).notNull(), // one of 'info', 'warning', 'critical'
    message: text("message").notNull(),
    type: varchar("type", { length: 50 }).notNull(), // 'tunnel_offline' | 'protocol_stall' | 'payment_fail'
    resolved: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    agentIdx: index("alerts_agent_idx").on(table.agentId),
    statusIdx: index("alerts_resolved_idx").on(table.resolved),
  })
);
