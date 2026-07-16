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
        el.style.transform = `scaleX(${p})`;
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
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#05070c]/65 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => scrollToSection("home")}
          aria-label="Back to top"
          className="group flex items-center gap-2.5 text-sm font-bold tracking-widest text-white/60 transition hover:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-[11px] transition group-hover:border-white/30">
            AK
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
              className="absolute inset-y-0 z-0 rounded-lg bg-white/[0.10]"
              style={{
                left: pill.left,
                width: pill.width,
                transition:
                  "left 350ms cubic-bezier(0.22,1,0.36,1), width 350ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <span className="absolute -bottom-[1px] left-3 right-3 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/80 to-blue-400/0" />
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
                    ? "font-medium text-white"
                    : "text-white/40 hover:text-white/85"
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
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/45 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80"
          >
            <SearchIcon size={14} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-white/50 sm:inline">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Scroll progress */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </header>
  );
}
