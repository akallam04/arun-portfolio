"use client";

import { OPENAUTODATA } from "@/lib/data";
import { clamp01, ease, phase, useFigureClock } from "@/lib/figure";
import { CheckIcon } from "../icons";
import { cn } from "@/lib/cn";

const STEP = 620;
const FIRST = 350;
const STEPS = OPENAUTODATA.steps.length;
const END = FIRST + STEPS * STEP;
const HOLD = 1500;
const LOOP = END + HOLD + 400;

export function AutodataLoop() {
  const { ref, t, reduced } = useFigureClock<HTMLDivElement>({ page: "more-projects" });
  const local = reduced ? END + 100 : t % LOOP;
  const fade = reduced ? 0 : clamp01((local - (LOOP - 400)) / 400);
  const at = clamp01((local - FIRST) / (STEPS * STEP)) * STEPS;
  const token = Math.min(STEPS - 1, Math.floor(at));
  const tokenP = at >= STEPS ? 1 : at - token;
  const smallBar = ease(phase(local, FIRST + 2 * STEP + 150, 450)) * (OPENAUTODATA.small / 100);
  const largeBar = ease(phase(local, FIRST + 3 * STEP + 150, 450)) * (OPENAUTODATA.large / 100);
  const accepted = local >= FIRST + 5 * STEP + 250;

  return (
    <div ref={ref} className="flex flex-col gap-1.5 desk:gap-[clamp(3px,0.8vh,10px)]" style={{ opacity: 1 - fade }}>
      <ol className="relative grid gap-1 pl-6 desk:gap-[clamp(1px,0.45vh,7px)]" aria-hidden="true">
        <span className="absolute bottom-3 left-[9px] top-3 w-[2px] rounded-full bg-slate-900/10" />
        {OPENAUTODATA.steps.map((step, i) => {
          const passed = at > i + 0.35;
          const active = !reduced && token === i && at < STEPS;
          const bar = i === 2 ? smallBar : i === 3 ? largeBar : null;
          return (
            <li key={step} className="relative flex min-h-[24px] items-center gap-2 desk:min-h-[clamp(16px,2.7vh,34px)]">
              <span
                className={cn(
                  "absolute -left-6 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-[2px] rounded-full border-2 bg-white transition-colors duration-200",
                  passed || active ? "border-accent" : "border-slate-900/20"
                )}
              />
              <span
                className={cn(
                  "w-[7.6em] shrink-0 whitespace-nowrap rounded-md px-1.5 py-px text-[12px] font-semibold leading-[1.3] transition-colors duration-200 desk:text-[clamp(12px,1.5vh,16px)]",
                  active ? "bg-accent text-white" : passed ? "bg-sky-50 text-accent-strong" : "text-ink-2"
                )}
              >
                {step}
              </span>
              {bar !== null ? (
                <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-900/[0.08] desk:h-[clamp(7px,1.1vh,12px)]">
                  <span
                    className={cn("block h-full origin-left rounded-full", i === 2 ? "bg-amber-400" : "bg-good")}
                    style={{ transform: `scaleX(${bar})` }}
                  />
                </span>
              ) : null}
              {i === STEPS - 1 ? (
                <span
                  className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-50 px-1.5 py-0 text-[12px] font-bold leading-[1.3] text-good-strong transition-opacity duration-300 desk:text-[clamp(12px,1.5vh,16px)]"
                  style={{ opacity: accepted ? 1 : 0 }}
                >
                  <CheckIcon size={12} />
                  Accepted
                </span>
              ) : null}
            </li>
          );
        })}
        {!reduced && at < STEPS ? (
          <span
            className="absolute left-[4px] h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(14,165,233,0.22),0_0_12px_3px_rgba(14,165,233,0.45)]"
            style={{ top: `${((Math.min(token + ease(tokenP), STEPS - 1) + 0.5) / STEPS) * 100}%` }}
          />
        ) : null}
      </ol>
      <p className="text-[12.5px] leading-snug text-ink-2 desk:text-[clamp(12px,1.55vh,16.5px)]">{OPENAUTODATA.kept}</p>
    </div>
  );
}
