import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  accent?: "emerald" | "red" | "yellow";
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, accent }) => {
  const accentColor =
    accent === "emerald"
      ? "text-emerald-400"
      : accent === "red"
      ? "text-red-400"
      : accent === "yellow"
      ? "text-yellow-400"
      : "text-zinc-50";

  const accentDotColor =
    accent === "emerald"
      ? "bg-emerald-400/70"
      : accent === "red"
      ? "bg-red-400/70"
      : accent === "yellow"
      ? "bg-yellow-400/70"
      : "bg-zinc-400/70";

  return (
    <div className="rounded-xl border border-zinc-900/80 bg-black/40 px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
          {title}
        </p>
        <span
          className={`h-1.5 w-1.5 rounded-full ${accentDotColor} shadow-[0_0_0_1px_rgba(24,24,27,0.9)]`}
        />
      </div>
      <p className={`text-2xl sm:text-3xl font-semibold tabular-nums ${accentColor}`}>
        {value}
      </p>
    </div>
  );
};

export default MetricCard;
