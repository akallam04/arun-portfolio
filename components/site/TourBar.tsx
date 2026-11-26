"use client";

import { forwardRef } from "react";
import { PAGES } from "@/lib/pages";
import { BackIcon, CloseIcon, PauseIcon, PlayIcon, SkipIcon } from "../icons";
import { cn } from "@/lib/cn";

const BUTTON =
  "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-900/[0.10] bg-white/75 px-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-accent/40 hover:text-accent-strong desk:h-[clamp(30px,4.4vh,44px)] desk:px-[clamp(8px,1.2vh,14px)] desk:text-[clamp(12.5px,1.7vh,17px)]";

export const TourBar = forwardRef<
  HTMLDivElement,
  {
    index: number;
    progress: number;
    paused: boolean;
    onBack: () => void;
    onTogglePause: () => void;
    onSkip: () => void;
    onEnd: () => void;
    onJump: (index: number) => void;
  }
>(function TourBar({ index, progress, paused, onBack, onTogglePause, onSkip, onEnd, onJump }, ref) {
  const page = PAGES[index];
  return (
    <div
      ref={ref}
      role="region"
      aria-label="60-second tour"
      className="glass pointer-events-auto relative flex w-full max-w-[1280px] flex-wrap items-center gap-x-3 gap-y-1.5 rounded-2xl px-3 pb-3 pt-2 lg:h-[var(--nav-h)] lg:flex-nowrap lg:gap-x-4 lg:py-0 lg:pl-4 lg:pr-2"
    >
      <div className="relative z-[1] flex shrink-0 items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-white shadow-[0_6px_16px_rgba(2,132,199,0.35)]" aria-hidden="true">
          <PlayIcon size={11} />
        </span>
        <span className="text-[15px] font-extrabold text-ink desk:text-[clamp(14px,2vh,20px)]" style={{ fontStretch: "112%" }}>
          Tour
        </span>
        <span className="text-[13px] font-semibold tabular-nums text-muted desk:text-[clamp(12.5px,1.7vh,17px)]">
          {index + 1} of {PAGES.length}
        </span>
      </div>
      <p
        className="relative z-[1] order-last min-w-0 basis-full text-[14px] leading-snug text-ink lg:order-none lg:flex-1 lg:basis-auto desk:text-[clamp(13px,1.85vh,19px)]"
        aria-live="polite"
      >
        {page.caption}
      </p>
      <div className="relative z-[1] ml-auto flex shrink-0 items-center gap-1.5">
        <button type="button" onClick={onBack} disabled={index === 0} className={cn(BUTTON, "disabled:opacity-40")} aria-label="Back">
          <BackIcon size={15} />
          <span className="hidden sm:inline" aria-hidden="true">
            Back
          </span>
        </button>
        <button type="button" onClick={onTogglePause} className={BUTTON} aria-label={paused ? "Play" : "Pause"}>
          {paused ? <PlayIcon size={12} /> : <PauseIcon size={12} />}
          <span className="hidden sm:inline" aria-hidden="true">
            {paused ? "Play" : "Pause"}
          </span>
        </button>
        <button type="button" onClick={onSkip} className={BUTTON} aria-label="Skip this page">
          <SkipIcon size={13} />
          <span className="hidden sm:inline" aria-hidden="true">
            Skip this page
          </span>
        </button>
        <button
          type="button"
          onClick={onEnd}
          className={cn(BUTTON, "border-accent/30 text-accent-strong")}
          aria-label="End tour"
        >
          <CloseIcon size={14} />
          <span className="hidden sm:inline" aria-hidden="true">
            End tour
          </span>
        </button>
      </div>
      <div className="absolute inset-x-4 bottom-0 z-0 flex h-3 items-end gap-1" role="group" aria-label="Tour pages">
        {PAGES.map((item, i) => {
          const fill = i < index ? 1 : i === index ? Math.min(1, Math.max(0, progress)) : 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onJump(i)}
              aria-label={`Go to page ${i + 1}: ${item.label}`}
              aria-current={i === index ? "step" : undefined}
              className="group flex h-full flex-1 items-end pb-[3px] outline-offset-0"
            >
              <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-slate-900/[0.12] transition-[height] group-hover:h-[5px]">
                <span
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-accent"
                  style={{ transform: `scaleX(${fill})` }}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
