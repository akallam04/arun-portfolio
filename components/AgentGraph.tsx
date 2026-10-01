"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { PauseIcon, PlayIcon } from "./icons";
import type { AgentGraphHandle } from "./agentGraphEngine";

/**
 * Arun's own agent architecture, running: the Shopify support agent's
 * LangGraph topology, with requests drawn as packets on the real edges.
 * Nothing here is decoration: every node and edge exists in the repo.
 * The canvas engine is code-split (see ./agentGraphEngine).
 */

export function AgentGraph() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  // WCAG 2.2.2: endless motion in the content needs a pause control.
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const resumeRef = useRef<() => void>(() => {});

  const togglePaused = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (!next) resumeRef.current();
  };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let engine: AgentGraphHandle | null = null;
    let cancelled = false;

    // Fetch and start the engine only when the band is about to scroll in.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        import("./agentGraphEngine").then(({ startAgentGraph }) => {
          if (cancelled) return;
          engine = startAgentGraph(canvas, () => pausedRef.current);
          if (engine) resumeRef.current = engine.resume;
        });
      },
      { rootMargin: "400px 0px" }
    );
    near.observe(canvas);

    return () => {
      cancelled = true;
      near.disconnect();
      engine?.stop();
    };
  }, []);

  return (
    <section
      aria-label="Live agent pipeline"
      className="relative border-y border-slate-900/[0.07] bg-white/35 backdrop-blur-sm"
    >
      <div className="mx-auto w-full max-w-6xl px-5 pb-5 pt-6 sm:px-8">
        <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-sky-500/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
            </span>
            Live topology
          </span>
          {/* Visually sm+ only, but always in the accessibility tree, so
              phone screen readers get the full description of the graph. */}
          <span className="sr-only text-xs text-muted sm:not-sr-only sm:inline">
            my Shopify support agent, as it actually runs: requests are
            sanitized, routed by intent, answered from RAG or MCP tools, then
            grounding-checked before they may reply
          </span>
          <span className="text-xs text-muted sm:hidden" aria-hidden="true">
            my Shopify agent, as it actually runs
          </span>
          {!reducedMotion && (
            <button
              type="button"
              onClick={togglePaused}
              // Same sky-700 as the "Live topology" label, in the site's
              // chip style; hover darkens to sky-900 for more contrast.
              className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-sky-600/30 bg-white/70 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700 transition-colors hover:border-sky-600/55 hover:bg-white/90 hover:text-sky-900"
            >
              {paused ? <PlayIcon size={10} /> : <PauseIcon size={10} />}
              {paused ? "play" : "pause"}
              <span className="sr-only"> animation</span>
            </button>
          )}
        </div>
        <div className="relative h-[330px] w-full sm:h-[240px] lg:h-[230px]">
          <canvas
            ref={ref}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="mt-1 flex flex-col gap-1 font-mono text-[10px] text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> request
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" /> prompt
            injection refused before any model call
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" /> ungrounded
            draft sent back to re-route
          </span>
        </div>
      </div>
    </section>
  );
}
