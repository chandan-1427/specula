import { useState } from "react";
import { getAgentLogs, type Agent, type AgentLog } from "../../lib/api";

export const useAgentLogs = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const openDrawer = async (agent: Agent) => {
    setSelectedAgent(agent);
    setLogsLoading(true);
    try {
      const data = await getAgentLogs(agent.id);
      setLogs(data);
    } finally {
      setLogsLoading(false);
    }
  };

  const closeDrawer = () => setSelectedAgent(null);

  return {
    selectedAgent,
    logs,
    logsLoading,
    openDrawer,
    closeDrawer,
  };
};