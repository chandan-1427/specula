import React from "react";
import type { Agent } from "../../../lib/api";

interface AgentCardProps {
  agent: Agent;
  isOnline: boolean;
  onClick: () => void;
  now: number;
}

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isOnline,
  onClick,
  now,
}) => {
  const isHandshake = agent.currentMethod === "a2a_handshake";
  const isPayment = agent.currentMethod === "payment_settlement";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-white/5 bg-zinc-900/40 p-6 transition hover:border-indigo-500/40 hover:bg-zinc-900/60"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-white group-hover:text-indigo-400 transition">
          {agent.name}
        </h3>
        <span
          className={`h-2 w-2 rounded-full ${
            isOnline
              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              : "bg-red-400"
          }`}
        />
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          {isHandshake && (
            <span className="bg-blue-500/10 text-blue-400 text-[9px] font-bold px-2 py-0.5 rounded border border-blue-500/20 uppercase">
              🤝 Handshake: {agent.status}
            </span>
          )}

          {isPayment && (
            <span className="bg-yellow-500/10 text-yellow-400 text-[9px] font-bold px-2 py-0.5 rounded border border-yellow-500/20 uppercase">
              💰 Payment: {agent.status}
            </span>
          )}

          {!isHandshake && !isPayment && (
            <span className="bg-zinc-800 text-zinc-400 text-[9px] font-bold px-2 py-0.5 rounded border border-white/5 uppercase">
              📡 {agent.status || "Idle"}
            </span>
          )}
        </div>

        {(agent.metadata?.peer ||
          agent.metadata?.to ||
          agent.metadata?.from) && (
          <p className="text-[10px] text-indigo-300/70 italic truncate">
            ↳ Connected to:{" "}
            {String(
              agent.metadata.peer ||
                agent.metadata.to ||
                agent.metadata.from
            )}
          </p>
        )}
      </div>

      <div className="space-y-1 text-[10px] text-zinc-500 font-mono">
        <p>ID: {agent.externalAgentId}</p>
        <p>
          Pulse:{" "}
          {Math.floor(
            (now - new Date(agent.lastSeen).getTime()) /
              1000
          )}
          s ago
        </p>
      </div>
    </div>
  );
};

export default AgentCard;