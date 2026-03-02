import { useEffect } from "react";
import type { Agent, Alert } from "../../lib/api";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";

export const useDashboardWebSocket = (
  token: string | null,
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>,
  setActiveAlerts: React.Dispatch<React.SetStateAction<Alert[]>>,
  setWsConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.streamType === "ALERT") {
        const newAlert = { id: Date.now(), ...data };

        setActiveAlerts((prev) => [newAlert, ...prev]);

        setTimeout(() => {
          setActiveAlerts((prev) =>
            prev.filter((a) => a.id !== newAlert.id)
          );
        }, 15000);

        return;
      }

      setAgents((prev) =>
        prev.map((agent) =>
          agent.externalAgentId === data.agentId
            ? {
                ...agent,
                lastSeen: data.timestamp,
                status: data.status,
                currentMethod: data.method,
                metadata: data.metadata,
              }
            : agent
        )
      );
    };

    return () => ws.close();
  }, [token, setActiveAlerts, setAgents, setWsConnected]); 
};