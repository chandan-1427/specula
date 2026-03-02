import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layouts/Navbar"
import Footer from "../components/layouts/Footer";

import Button from "../components/ui/Button";
import { Card, CardTitle, CardContent } from "../components/ui/Card";
import Section from "../components/ui/Section";

/**
 * Public landing page marketing the product. Contains hero,
 * value propositions and navigation buttons. Preloads authentication
 * pages on mount to improve perceived performance.
 */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

useEffect(() => {
  // preload auth routes asynchronously
  import("./LoginPage");
  import("./SignupPage");
});

return (
<div className="relative min-h-screen bg-black text-white overflow-hidden">
<div className="ai-heartbeat-bg">
<div className="ai-heartbeat-pulse" />
</div>
  <Navbar />

  <Section
    containerWidth="md"
    centered
    className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6"
  >
    <p className="mb-2 sm:mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400">
      Specula -  Agent Infrastructure Observability
    </p>

    <h1 className="mb-3 sm:mb-4 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
      Infrastructure observability for distributed AI agents.
    </h1>

    <p className="mx-auto mb-4 sm:mb-5 max-w-2xl text-xs sm:text-sm font-medium text-zinc-400">
      Not a prompt logger. Not a tracing tool.
    </p>

    <p className="mx-auto mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base text-zinc-400">
      Specula gives infra teams a real-time view of tunnels, protocols, and
      system health for multi-agent networks running on Bindu, Agno, CrewAI
      and your own Python stacks.
    </p>

    <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3 w-full sm:w-auto">
      <Button
        className="w-full sm:w-auto"
        onClick={() => navigate("/signup")}
      >
        Start free workspace
      </Button>

      <Button
        variant="secondary"
        className="w-full sm:w-auto"
        onClick={() => navigate("/login")}
      >
        View live dashboard demo
      </Button>
    </div>

    <p className="mt-4 text-[11px] text-zinc-500">
      Built for infra and AI teams who need protocol-aware visibility, not
      more log firehoses.
    </p>
  </Section>

  <Section containerWidth="md" className="px-4 sm:px-6 pb-12 sm:pb-16">
    <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
      {[
        {
          title: "Infra-first, not LLM-first",
          description:
            "Watch tunnels, ports, and agent lifecycles instead of prompt payloads. See when infrastructure breaks before prompts do.",
        },
        {
          title: "Agent network, not single runs",
          description:
            "Understand how agents talk to each other and external services with a live graph, not scattered logs.",
        },
        {
          title: "Drop-in for existing stacks",
          description:
            "JSON-RPC 2.0 ingestion, Redis, PostgreSQL, and WebSockets so you can add observability without changing how you ship.",
        },
      ].map((card, i) => (
        <Card key={i} className="h-full">
          <CardTitle>{card.title}</CardTitle>
          <CardContent>{card.description}</CardContent>
        </Card>
      ))}
    </div>
  </Section>

  {/* How it works */}
  <Section containerWidth="lg" className="px-4 sm:px-6 pb-14 sm:pb-18">
    <div className="mb-6 sm:mb-8 text-left sm:text-center">
      <h2 className="mb-2 text-xl sm:text-2xl font-semibold tracking-tight">
        How Specula fits into your stack.
      </h2>
      <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
        From ingestion to live dashboards and historical analysis, Specula
        sits alongside your agents and infrastructure without getting in the
        way.
      </p>
    </div>

    <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
      {[
        {
          label: "01",
          title: "Ingestion",
          description:
            "Agents send JSON-RPC 2.0 telemetry over HTTP with API keys. Heartbeats, tunnel events, protocol messages, and payments are all normalized.",
        },
        {
          label: "02",
          title: "Real-time",
          description:
            "Redis and WebSockets keep the dashboard live. You see health, topology, and protocol flows update as your agents run.",
        },
        {
          label: "03",
          title: "Historical",
          description:
            "PostgreSQL stores aggregates and event history so you can review incidents, compare deploys, and track stability over time.",
        },
      ].map((step, i) => (
        <Card key={i} className="h-full">
          <CardTitle className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-indigo-400">
              {step.label}
            </span>
            <span>{step.title}</span>
          </CardTitle>
          <CardContent>{step.description}</CardContent>
        </Card>
      ))}
    </div>
  </Section>

  {/* Protocol-aware observability */}
  <Section containerWidth="lg" className="px-4 sm:px-6 pb-16 sm:pb-20">
    <div className="grid gap-10 sm:gap-12 md:grid-cols-2 md:items-start">
      <div>
        <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold tracking-tight">
          Protocol-aware observability for agent ecosystems.
        </h2>

        <p className="mb-5 sm:mb-6 text-sm sm:text-base text-zinc-400 leading-relaxed">
          Specula understands A2A, AP2, and X402-style patterns so you can
          see agent-to-agent traffic, negotiations, and payments as first
          class signals—not opaque blobs.
        </p>

        <ul className="space-y-3.5 sm:space-y-4">
          {[
            {
              title: "A2A sessions",
              text: "Follow how agents coordinate tasks, hand off work, and recover from failures across the network.",
            },
            {
              title: "AP2 tunnels",
              text: "Monitor local-to-internet tunnels, ports, and endpoints so you know when networks flap or regress.",
            },
            {
              title: "X402 payments",
              text: "Track payment requests, settlements, and errors so economic flows are as visible as traffic flows.",
            },
            {
              title: "Graph-native view",
              text: "Cytoscape visualizations show which agents are talking, which are idle, and where pressure is building.",
            },
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 text-indigo-400">●</span>
              <div>
                <h3 className="font-medium text-zinc-200">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Card className="p-6 sm:p-7 md:p-8">
        <CardTitle className="mb-4 sm:mb-5">
          What you see instead of log noise
        </CardTitle>
        <ul className="space-y-3 sm:space-y-3.5 text-zinc-400 text-sm">
          <li>-  Live agent graph with health state and protocol edges.</li>
          <li>-  Recharts dashboards for tunnel uptime and error rates.</li>
          <li>-  Per-agent heartbeat, latency, and retry behavior.</li>
          <li>-  Clear views of failed negotiations and payment attempts.</li>
        </ul>
      </Card>
    </div>
  </Section>

  {/* Architecture / credibility */}
  <Section containerWidth="lg" className="px-4 sm:px-6 pb-16 sm:pb-20">
    <div className="mb-5 sm:mb-6 text-left sm:text-center">
      <h2 className="mb-2 text-xl sm:text-2xl font-semibold tracking-tight">
        Built like the infra you already trust.
      </h2>
      <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
        A small, composable stack: Hono, PostgreSQL, Redis, WebSockets, and
        a React 18 dashboard. No black boxes, no proprietary agents.
      </p>
    </div>

    <div className="grid gap-4 sm:gap-5 md:grid-cols-4">
      {[
        {
          title: "JSON-RPC ingestion",
          text: "Standard JSON-RPC 2.0 over HTTP for agent telemetry and control paths.",
        },
        {
          title: "Hono backend",
          text: "Stateless, horizontally scalable edge-friendly API layer with JWT auth.",
        },
        {
          title: "Redis + rate limits",
          text: "Real-time state, WebSocket fan-out, and per-key rate limiting for safety.",
        },
        {
          title: "PostgreSQL analytics",
          text: "Durable event history and rollups for long-term trend analysis.",
        },
      ].map((item, i) => (
        <Card key={i} className="h-full">
          <CardTitle>{item.title}</CardTitle>
          <CardContent>{item.text}</CardContent>
        </Card>
      ))}
    </div>
  </Section>

  {/* How it helps / team outcomes */}
  <Section containerWidth="lg" className="px-4 sm:px-6 pb-16 sm:pb-20">
    <div className="grid gap-10 sm:gap-14 md:grid-cols-2 md:items-start">
      <div>
        <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold tracking-tight">
          Built for teams who need to trust their agents in production.
        </h2>

        <p className="mb-6 sm:mb-8 text-sm sm:text-base text-zinc-400 leading-relaxed">
          Specula gives engineering and ops a shared, real-time view of what
          the agent network is doing, how stable it is, and exactly where to
          look when something breaks.
        </p>

        <ul className="space-y-4 sm:space-y-5">
          {[
            {
              title: "Stay ahead of incidents",
              text: "Get clear signals when agents go silent, tunnels flap, or traffic patterns change.",
            },
            {
              title: "Shorten debugging time",
              text: "Jump from an alert to the affected agent, tunnel, and protocol edge in seconds.",
            },
            {
              title: "Align the whole team",
              text: "Give infra, ML, and product a shared dashboard instead of siloed tools.",
            },
            {
              title: "Scale without losing control",
              text: "Add more agents and workflows while keeping latency and failure visible.",
            },
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 text-indigo-400">✓</span>
              <div>
                <h3 className="font-medium text-zinc-200">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Card className="p-6 sm:p-8">
        <CardTitle className="mb-5 sm:mb-6">
          A typical day with Specula
        </CardTitle>

        <ul className="space-y-3.5 sm:space-y-4 text-zinc-400 text-sm">
          <li>-  Morning: confirm all agents, tunnels, and protocols are green.</li>
          <li>-  During deploys: watch error rates and topology shifts in real time.</li>
          <li>-  When something breaks: jump straight to the failing agent and edge.</li>
          <li>-  After incidents: review traces, rollups, and stability over time.</li>
        </ul>
      </Card>
    </div>
  </Section>

  {/* CTA */}
  <Section
    containerWidth="sm"
    centered
    className="px-4 sm:px-6 pb-16 sm:pb-20"
  >
    <h2 className="mb-2.5 sm:mb-3 text-lg sm:text-xl font-semibold tracking-tight">
      Get from “what is this agent doing?” to clarity in under 10 minutes.
    </h2>

    <p className="mb-5 sm:mb-6 text-sm text-zinc-400">
      Create a workspace, connect a few agents with API keys, and get a live
      view of your agent network&apos;s health, tunnels, and protocols.
    </p>

    <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3 w-full sm:w-auto">
      <Button
        className="w-full sm:w-auto"
        onClick={() => navigate("/signup")}
      >
        Create free workspace
      </Button>

      <Button
        variant="secondary"
        className="w-full sm:w-auto"
        onClick={() => navigate("/login")}
      >
        Sign in and inspect agents
      </Button>
    </div>

    <p className="mt-3 text-[11px] text-zinc-500">
      No SDK lock-in. Send JSON-RPC from any Python agent or service.
    </p>
  </Section>

  <Footer />
</div>

);
};

export default LandingPage;