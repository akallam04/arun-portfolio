"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS, type SectionKey } from "@/lib/data";
import { scrollToSection, useActiveSection } from "@/lib/hooks";
import { cn } from "./ui";
import { SearchIcon } from "./icons";

export function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const active = useActiveSection();
  const progressRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Partial<Record<SectionKey, HTMLButtonElement>>>({});
  const [pill, setPill] = useState<{ left: number; width: number } | null>(
    null
  );

  // Slide the highlight pill to whichever link is active.
  useEffect(() => {
    const measure = () => {
      const el = linkRefs.current[active];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  // Scroll progress bar driven outside React state to avoid re-renders.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = progressRef.current;
      if (el) {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        el.style.width = `${(p * 100).toFixed(2)}%`;
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-900/[0.07] bg-white/65 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => scrollToSection("home")}
          aria-label="Back to top"
          className="group flex items-center gap-2.5 text-sm font-bold tracking-widest transition"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-400/40 bg-white/60 transition group-hover:border-sky-500/60 group-hover:shadow-[0_0_14px_rgba(96,165,250,0.35)]">
            <span className="gradient-name text-[11px] font-bold">AK</span>
          </span>
        </button>

        {/* Desktop section links with a sliding highlight */}
        <nav
          className="relative hidden items-center gap-0.5 lg:flex"
          aria-label="Sections"
        >
          {pill && (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 z-0 rounded-lg bg-sky-600/10"
              style={{
                left: pill.left,
                width: pill.width,
                transition:
                  "left 350ms cubic-bezier(0.22,1,0.36,1), width 350ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <span className="absolute -bottom-[1px] left-3 right-3 h-px bg-gradient-to-r from-sky-500/0 via-sky-500/80 to-sky-500/0" />
            </span>
          )}
          {SECTIONS.map((s) => {
            const isActive = active === s.key;
            return (
              <button
                key={s.key}
                ref={(el) => {
                  if (el) linkRefs.current[s.key] = el;
                }}
                onClick={() => scrollToSection(s.key)}
                className={cn(
                  "relative z-10 rounded-lg px-3.5 py-1.5 text-sm transition-colors duration-300",
                  isActive
                    ? "font-medium text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPalette}
            aria-label="Open command palette"
            className="flex items-center gap-2 rounded-lg border border-slate-400/30 bg-white/60 px-2.5 py-1.5 text-xs text-slate-500 transition hover:border-sky-500/40 hover:bg-slate-900/[0.05] hover:text-slate-800"
          >
            <SearchIcon size={14} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-slate-400/40 bg-white/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 sm:inline">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Scroll progress with a comet head */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]">
        <div
          ref={progressRef}
          className="relative h-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500"
          style={{ width: "0%" }}
        >
          <span className="absolute -right-1 -top-[3px] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.65)]" />
        </div>
      </div>
    </header>
  );
}
