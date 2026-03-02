import { useEffect, useState, useMemo } from "react";
import { getAgents, sendAgentCommand, type Agent, type Alert } from "../../lib/api";
import { useDashboardWebSocket } from "./useDashboardWebSocket";

export const useDashboard = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useDashboardWebSocket(token, setAgents, setActiveAlerts, setWsConnected);

  const handleHealAgent = async (externalId: string) => {
    await sendAgentCommand(externalId, "RESTART_TUNNEL");
    setActiveAlerts((prev) =>
      prev.filter((a) => a.agentId !== externalId)
    );
  };

  const dismissAlert = (id: number) => {
    setActiveAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const isOnline = (lastSeen: string) =>
    Date.now() - new Date(lastSeen).getTime() < 60000;

  const stats = useMemo(() => {
    const online = agents.filter((a) => isOnline(a.lastSeen)).length;
    return { online, offline: agents.length - online };
  }, [agents]);

  return {
    agents,
    loading,
    wsConnected,
    activeAlerts,
    stats,
    isOnline,
    dismissAlert,
    handleHealAgent,
  };
};