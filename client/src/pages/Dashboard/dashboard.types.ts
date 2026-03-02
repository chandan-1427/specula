import type { Agent, AgentLog, Alert } from "../../lib/api";

export type DashboardState = {
  agents: Agent[];
  activeAlerts: Alert[];
  logs: AgentLog[];
};