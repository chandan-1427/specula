import React from "react";

const FullScreenLoader: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-xl" />
          <div className="absolute inset-2 rounded-full bg-indigo-400 animate-pulse" />
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Loading…
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;