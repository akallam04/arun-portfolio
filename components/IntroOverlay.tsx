"use client";

import { useEffect, useState } from "react";
import { PROFILE } from "@/lib/data";

/**
 * First visit of a session opens on the agent graph building itself: edges
 * draw, nodes land, one request runs the pipeline, then the veil lifts. It is
 * the same topology the Live band renders, so the intro states the thesis
 * instead of decorating it. Skipped for returning visitors and reduced motion.
 */

const N = {
  in: [18, 78],
  san: [80, 78],
  ref: [80, 132],
  route: [142, 78],
  rag: [204, 40],
  tool: [204, 78],
  ver: [266, 59],
  out: [322, 59],
} as const;

type Id = keyof typeof N;

const EDGES: [Id, Id][] = [
  ["in", "san"],
  ["san", "route"],
  ["san", "ref"],
  ["route", "rag"],
  ["route", "tool"],
  ["rag", "ver"],
  ["tool", "ver"],
  ["ver", "out"],
];

const NODE_ORDER: Id[] = ["in", "san", "ref", "route", "rag", "tool", "ver", "out"];

const tint = (id: Id) =>
  id === "ref" ? "#dc2626" : id === "out" ? "#059669" : "#0284c7";

export function IntroOverlay() {
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");

  useEffect(() => {
    let seen = false;
    try {
      seen =
        !!sessionStorage.getItem("intro-seen") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!seen) sessionStorage.setItem("intro-seen", "1");
    } catch {
      // storage unavailable: still play once
    }
    const t1 = window.setTimeout(() => setPhase("exit"), seen ? 0 : 1750);
    const t2 = window.setTimeout(() => setPhase("done"), seen ? 0 : 2350);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 px-6"
      style={{
        background:
          "linear-gradient(180deg, #dcecfb 0%, #eaf3fc 55%, #f6faff 100%)",
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 600ms cubic-bezier(0.72, 0, 0.24, 1)",
      }}
    >
      <svg
        viewBox="0 0 340 160"
        className="w-full max-w-[400px] sm:max-w-[520px]"
        style={{ opacity: phase === "exit" ? 0 : 1, transition: "opacity 250ms ease" }}
      >
        {EDGES.map(([a, b], i) => {
          const [x1, y1] = N[a];
          const [x2, y2] = N[b];
          const len = Math.hypot(x2 - x1, y2 - y1);
          return (
            <line
              key={`${a}-${b}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={b === "ref" ? "rgba(220,38,38,0.35)" : "rgba(2,132,199,0.4)"}
              strokeWidth="1.2"
              strokeDasharray={len}
              strokeDashoffset={len}
              style={{
                animation: `intro-edge 0.34s cubic-bezier(0.22,1,0.36,1) ${
                  0.12 + i * 0.1
                }s forwards`,
              }}
            />
          );
        })}

        {NODE_ORDER.map((id, i) => {
          const [cx, cy] = N[id];
          return (
            <circle
              key={id}
              cx={cx}
              cy={cy}
              r="5"
              fill={tint(id)}
              className="intro-node"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            />
          );
        })}

        {/* one request runs the finished pipeline */}
        <circle r="3.5" fill="#0284c7" className="intro-packet">
          <animateMotion
            dur="1s"
            begin="0.95s"
            fill="freeze"
            path="M18,78 L80,78 L142,78 L204,78 L266,59 L322,59"
          />
        </circle>
      </svg>

      <div className="intro-word text-center">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.42em] text-sky-700/70">
          {PROFILE.name}
        </div>
      </div>
    </div>
  );
}
