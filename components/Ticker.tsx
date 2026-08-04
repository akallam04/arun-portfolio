"use client";

const ITEMS = [
  "AI Agents",
  "LangGraph",
  "MCP",
  "RAG",
  "QLoRA",
  "Claude API",
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "AWS",
  "Docker",
  "GraphQL",
  "MongoDB",
  "PyTorch",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span
          key={item}
          className="flex items-center gap-6 pr-6 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-sky-700/45"
        >
          {item}
          <span className="text-sky-500/40">✦</span>
        </span>
      ))}
    </div>
  );
}

/** Infinite glass tech ticker; pauses on hover, static under reduced motion. */
export function Ticker() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-slate-900/[0.06] bg-white/40 py-3 backdrop-blur-xl"
    >
      <div className="ticker-track flex w-max hover:[animation-play-state:paused]">
        <Row />
        <Row />
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#e9f2fb] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#e9f2fb] to-transparent" />
    </div>
  );
}
