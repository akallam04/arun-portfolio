"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Background } from "../Background";
import { PAGES, type PageId } from "@/lib/pages";
import { restartFigures, useReducedMotion } from "@/lib/figure";
import { SiteContext, type SiteApi } from "./SiteContext";
import { FloatingNav } from "./FloatingNav";
import { PageRail } from "./PageRail";
import { TourBar } from "./TourBar";

const loadPalette = () => import("../CommandPalette").then((m) => m.CommandPalette);
const CommandPalette = dynamic(loadPalette, { ssr: false });
const AgentPanel = dynamic(() => import("./AgentPanel").then((m) => m.AgentPanel), { ssr: false });

const TOUR_STEP = 5500;

type Tour = { index: number; elapsed: number; paused: boolean };

function clearGlow() {
  document.querySelectorAll("[data-tour-glow]").forEach((node) => node.removeAttribute("data-tour-glow"));
}

export function SiteShell({
  agentEnabled,
  children,
}: {
  agentEnabled: boolean;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState<PageId>("home");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [agent, setAgent] = useState<{ open: boolean; question?: string; key: number }>({
    open: false,
    key: 0,
  });
  const [tour, setTour] = useState<Tour | null>(null);
  const tourBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-page]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id as PageId);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (page: PageId) => {
      const node = document.getElementById(page);
      if (!node) return;
      node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      if (window.location.hash !== `#${page}`) {
        window.history.replaceState(null, "", `#${page}`);
      }
    },
    [reduced]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      } else if (event.key === "Escape") {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const desk = window.matchMedia("(min-width: 1024px) and (min-height: 600px)");
    const onFocus = (event: FocusEvent) => {
      if (!desk.matches || !(event.target instanceof Element)) return;
      const page = event.target.closest<HTMLElement>("[data-page]");
      if (!page) return;
      const top = page.getBoundingClientRect().top;
      if (Math.abs(top) <= 1) return;
      page.scrollIntoView({ behavior: "instant", block: "start" });
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, []);

  useEffect(() => {
    const warm = () => void loadPalette();
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(warm, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  const tourActive = tour !== null;
  const tourIndex = tour?.index ?? -1;
  const tourPaused = tour?.paused ?? false;

  useEffect(() => {
    if (!tourActive) return;
    const root = document.documentElement;
    root.setAttribute("data-tour", "on");
    return () => {
      root.removeAttribute("data-tour");
      clearGlow();
    };
  }, [tourActive]);

  useEffect(() => {
    if (tourIndex < 0) return;
    const page = PAGES[tourIndex].id;
    goTo(page);
    restartFigures(page);
    clearGlow();
    document
      .querySelectorAll(`#${page} [data-tour-target]`)
      .forEach((node) => node.setAttribute("data-tour-glow", "true"));
  }, [tourIndex, goTo]);

  useEffect(() => {
    if (!tourActive || tourPaused) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(Math.max(now - last, 0), 100);
      last = now;
      setTour((state) => {
        if (!state || state.paused) return state;
        const elapsed = state.elapsed + delta;
        if (elapsed < TOUR_STEP) return { ...state, elapsed };
        if (state.index >= PAGES.length - 1) return null;
        return { index: state.index + 1, elapsed: 0, paused: false };
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [tourActive, tourPaused]);

  const endTour = useCallback(() => {
    setTour(null);
    const main = document.getElementById("main");
    if (tourBarRef.current?.contains(document.activeElement)) main?.focus({ preventScroll: true });
  }, []);

  const jumpTour = useCallback((index: number) => {
    setTour((state) => {
      if (!state) return state;
      if (index < 0) return { ...state, elapsed: 0 };
      if (index >= PAGES.length) return null;
      return { index, elapsed: 0, paused: state.paused };
    });
  }, []);

  const toggleTour = useCallback(() => {
    setTour((state) => {
      if (!state) return state;
      if (state.paused) {
        const page = PAGES[state.index].id;
        window.setTimeout(() => goTo(page), 0);
      }
      return { ...state, paused: !state.paused };
    });
  }, [goTo]);

  useEffect(() => {
    if (!tourActive) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (event.key === "Escape") {
        endTour();
        return;
      }
      if (target?.closest('input, textarea, select, [contenteditable="true"], [data-own-keys]')) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        jumpTour(tourIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        jumpTour(tourIndex + 1);
      } else if (event.key === " ") {
        if (target?.closest("button, a, summary, [role='button'], [role='switch']")) return;
        event.preventDefault();
        toggleTour();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourActive, tourIndex, endTour, jumpTour, toggleTour]);

  useEffect(() => {
    if (!tourActive) return;
    const inBar = (event: Event) =>
      !!tourBarRef.current && event.target instanceof Node && tourBarRef.current.contains(event.target);
    const hold = (event: Event) => {
      if (inBar(event)) return;
      setTour((state) => (state && !state.paused ? { ...state, paused: true } : state));
    };
    const options = { capture: true, passive: true } as const;
    window.addEventListener("wheel", hold, options);
    window.addEventListener("touchmove", hold, options);
    window.addEventListener("pointerdown", hold, options);
    return () => {
      window.removeEventListener("wheel", hold, options);
      window.removeEventListener("touchmove", hold, options);
      window.removeEventListener("pointerdown", hold, options);
    };
  }, [tourActive]);

  const startTour = useCallback(() => {
    setPaletteOpen(false);
    setAgent((state) => ({ ...state, open: false }));
    window.setTimeout(() => {
      setTour({ index: 0, elapsed: 0, paused: false });
      window.setTimeout(() => {
        tourBarRef.current?.querySelector<HTMLButtonElement>("button[aria-label='Pause']")?.focus({ preventScroll: true });
      }, 80);
    }, 60);
  }, []);

  const openAgent = useCallback(
    (question?: string) => {
      if (!agentEnabled) return;
      setTour(null);
      setAgent((state) => ({ open: true, question, key: state.key + 1 }));
    },
    [agentEnabled]
  );

  const replayRace = useCallback(() => {
    goTo("oversold");
    restartFigures("oversold");
  }, [goTo]);

  const api = useMemo<SiteApi>(
    () => ({
      agentEnabled,
      current,
      goTo,
      openPalette: () => setPaletteOpen(true),
      openAgent,
      startTour,
      replayRace,
    }),
    [agentEnabled, current, goTo, openAgent, startTour, replayRace]
  );

  return (
    <SiteContext.Provider value={api}>
      <Background />
      <header className="pointer-events-none fixed inset-x-0 top-[var(--nav-top)] z-50 flex justify-center px-3">
        {tour ? (
          <TourBar
            ref={tourBarRef}
            index={tour.index}
            progress={tour.elapsed / TOUR_STEP}
            paused={tour.paused}
            onBack={() => jumpTour(tour.index - 1)}
            onTogglePause={toggleTour}
            onSkip={() => jumpTour(tour.index + 1)}
            onEnd={endTour}
            onJump={jumpTour}
          />
        ) : (
          <FloatingNav current={current} onStartTour={startTour} />
        )}
      </header>
      <PageRail current={current} />
      {children}
      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} /> : null}
      {agentEnabled && agent.open ? (
        <AgentPanel
          key={agent.key}
          initialQuestion={agent.question}
          onClose={() => setAgent((state) => ({ ...state, open: false }))}
        />
      ) : null}
    </SiteContext.Provider>
  );
}
