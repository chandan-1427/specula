import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useDashboard } from "./useDashboard";
import { useAgentLogs } from "./useAgentLogs";

import Button from "../../components/ui/Button";
import AlertStack from "./components/AlertStack";
import AgentCard from "./components/AgentCard";
import MetricCard from "./components/MetricCard";
import LogDrawer from "./components/LogDrawer";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    agents,
    loading,
    wsConnected,
    activeAlerts,
    stats,
    isOnline,
    handleHealAgent,
    dismissAlert,
  } = useDashboard();

  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Update the time every second to keep pulses fresh
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { selectedAgent, logs, logsLoading, openDrawer, closeDrawer } =
    useAgentLogs();

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Not authenticated.
      </div>
    );

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Dashboard Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 py-2">
        <div className="border-b border-zinc-900 bg-black/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold tracking-tight cursor-default text-white">
                Specula
              </span>
              <span className="hidden text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-500 sm:inline">
                Dashboard
              </span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-xs text-zinc-400">
                WS:{" "}
                <span
                  className={
                    wsConnected ? "text-zinc-200" : "text-zinc-500"
                  }
                >
                  {wsConnected ? "Connected" : "Disconnected"}
                </span>
              </span>
              <Button size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none h-5 w-full bg-gradient-to-b from-black/70 to-transparent" />
      </header>

      {/* Content */}
      <div className="px-6 sm:px-8 pt-24 pb-6 relative max-w-7xl mx-auto">
        <AlertStack
          alerts={activeAlerts}
          onDismiss={dismissAlert}
          onHeal={handleHealAgent}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
          <MetricCard title="Total Agents" value={agents.length} />
          <MetricCard title="Online" value={stats.online} accent="emerald" />
          <MetricCard title="Offline" value={stats.offline} accent="red" />
        </div>

        {loading ? (
          <p className="text-sm text-zinc-400">Initializing infrastructure...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isOnline={isOnline(agent.lastSeen)}
                onClick={() => openDrawer(agent)}
                now={currentTime}
              />
            ))}
          </div>
        )}

        <LogDrawer
          agent={selectedAgent}
          logs={logs}
          loading={logsLoading}
          onClose={closeDrawer}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
