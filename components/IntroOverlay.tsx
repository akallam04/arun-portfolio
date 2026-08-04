"use client";

import { useEffect, useState } from "react";

/**
 * Once-per-session branded intro: the monogram blooms on a sky wash, then
 * the whole veil lifts. Fast (1.4s total), skipped for returning visitors
 * within the session and under reduced motion.
 */
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
    const t1 = window.setTimeout(() => setPhase("exit"), seen ? 0 : 850);
    const t2 = window.setTimeout(() => setPhase("done"), seen ? 0 : 1450);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #dcecfb 0%, #eaf3fc 55%, #f6faff 100%)",
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 600ms cubic-bezier(0.72, 0, 0.24, 1)",
      }}
    >
      <div
        className="flex flex-col items-center gap-4"
        style={{
          opacity: phase === "exit" ? 0 : 1,
          transition: "opacity 250ms ease",
        }}
      >
        <div className="intro-mark flex h-20 w-20 items-center justify-center rounded-3xl border border-white/80 bg-white/70 shadow-[0_18px_50px_rgba(30,80,150,0.25)] backdrop-blur-xl">
          <span className="gradient-name text-3xl font-bold tracking-widest">
            AK
          </span>
        </div>
        <div className="intro-word font-mono text-[10px] font-semibold uppercase tracking-[0.5em] text-sky-700/60">
          Portfolio
        </div>
      </div>
    </div>
  );
}
