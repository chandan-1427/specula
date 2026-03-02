import React from "react";
import type { Agent, AgentLog } from "../../../lib/api";

interface LogDrawerProps {
  agent: Agent | null;
  logs: AgentLog[];
  loading: boolean;
  onClose: () => void;
}

const LogDrawer: React.FC<LogDrawerProps> = ({
  agent,
  logs,
  loading,
  onClose,
}) => {
  if (!agent) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-zinc-950 border-l border-white/10 z-50 shadow-2xl flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h2 className="text-lg font-bold text-white">
              {agent.name}
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono">
              {agent.externalAgentId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-zinc-400"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-zinc-500 font-mono text-[10px]">
              RETRIEVING_LOGS...
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-zinc-900/50 rounded-lg p-3 border border-white/5"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase">
                    {log.type}
                  </span>
                  <span className="text-[9px] text-zinc-600 font-mono">
                    {new Date(
                      log.createdAt
                    ).toLocaleTimeString()}
                  </span>
                </div>

                <pre className="text-[9px] text-zinc-400 font-mono whitespace-pre-wrap break-all">
                  {JSON.stringify(
                    log.payload?.params?.metadata,
                    null,
                    2
                  )}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LogDrawer;