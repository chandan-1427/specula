import React from "react";
import type { Alert } from "../../../lib/api";

interface AlertStackProps {
  alerts: Alert[];
  onDismiss: (id: number) => void;
  onHeal: (agentId: string) => void;
}

const AlertStack: React.FC<AlertStackProps> = ({
  alerts,
  onDismiss,
  onHeal,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 w-80">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border shadow-2xl flex flex-col gap-2 ${
            alert.severity === "critical"
              ? "bg-red-950/90 border-red-500/50"
              : "bg-zinc-900/90 border-white/10"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">
              System Alert
            </span>
            <button
              onClick={() => onDismiss(alert.id)}
              className="text-zinc-500 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <p className="text-sm font-medium">{alert.message}</p>

          <p className="text-[10px] text-zinc-400 font-mono">
            Agent: {alert.agentId}
          </p>

          <button
            onClick={() => onHeal(alert.agentId)}
            className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase rounded transition"
          >
            Restart Network Tunnel
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertStack;