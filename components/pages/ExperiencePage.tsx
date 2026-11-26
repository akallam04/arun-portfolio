"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { BYLD_SECTIONS, BYLD_TILES, EXPERIENCE, FOOD_FOREST_STEPS, type Job } from "@/lib/data";
import { along, clamp01, ease, phase, useFigureClock, type Pt } from "@/lib/figure";
import { CalendarIcon, CheckIcon, PinIcon } from "../icons";
import { SpotlightCard } from "../ui";
import { cn } from "@/lib/cn";

const START = 300;
const LEG = 1150;
const LIT_FOR = 900;
const STRIP_FOR = 1700;
const UNTIL = START + LEG * (EXPERIENCE.length - 1) + STRIP_FOR + 200;

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-bold text-ink">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

function ByldStrip({ p }: { p: number }) {
  const shown = Math.round(clamp01((p - 0.25) / 0.7) * (BYLD_TILES.length + BYLD_SECTIONS));
  const split = ease(phase(p, 0.05, 0.25));
  return (
    <div className="grid grid-cols-[auto_26px_minmax(0,1fr)] items-center" aria-hidden="true">
      <span className="max-w-[5.6em] rounded-lg border border-accent/40 bg-white px-2 py-1 text-center text-[12px] font-bold leading-tight text-accent-strong desk:text-[clamp(12px,1.45vh,15px)]">
        One codebase
      </span>
      <svg viewBox="0 0 26 60" className="h-[60px] w-[26px]" preserveAspectRatio="none">
        {[12, 30, 48].map((y) => (
          <line key={y} x1="0" y1="30" x2={26 * split} y2={30 + (y - 30) * split} stroke="#0284c7" strokeOpacity="0.5" strokeWidth="1.4" />
        ))}
      </svg>
      <div className="grid min-w-0 gap-1.5">
        <div className="flex flex-wrap gap-1">
          {BYLD_TILES.map((tile, i) => (
            <span
              key={tile}
              className={cn(
                "rounded-md border px-1.5 py-0.5 text-[12px] font-semibold transition-colors duration-200 desk:text-[clamp(12px,1.4vh,15px)]",
                i < shown ? "border-accent/50 bg-sky-50 text-accent-strong" : "border-slate-900/10 bg-white/50 text-muted/60"
              )}
            >
              {tile}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: BYLD_SECTIONS }, (_, i) => (
            <span
              key={i}
              className={cn(
                "block h-3.5 w-3.5 rounded-[4px] border transition-colors duration-200 desk:h-[clamp(11px,1.6vh,17px)] desk:w-[clamp(11px,1.6vh,17px)]",
                i + BYLD_TILES.length < shown ? "border-accent bg-accent/80" : "border-slate-900/10 bg-white/50"
              )}
            />
          ))}
        </div>
        <span className="text-[12px] font-medium text-muted desk:text-[clamp(12px,1.4vh,15px)]">
          {BYLD_SECTIONS} section blocks
        </span>
      </div>
    </div>
  );
}

const SNAKE: Pt[] = [
  [16.67, 25],
  [50, 25],
  [83.33, 25],
  [83.33, 75],
  [50, 75],
  [16.67, 75],
];
const SNAKE_CELL = ["col-start-1 row-start-1", "col-start-2 row-start-1", "col-start-3 row-start-1", "col-start-3 row-start-2", "col-start-2 row-start-2", "col-start-1 row-start-2"];

function FoodForestStrip({ p }: { p: number }) {
  const steps = FOOD_FOREST_STEPS.length;
  const at = clamp01(p) * (steps - 1);
  const done = p >= 1;
  const [x, y] = along(SNAKE, clamp01(p));
  return (
    <div className="relative grid grid-cols-3 grid-rows-2 gap-x-2 gap-y-3" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <polyline
          points={SNAKE.map(([px, py]) => `${px},${py}`).join(" ")}
          fill="none"
          stroke="rgba(20,48,74,0.16)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {p > 0 && !done ? (
        <span
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(14,165,233,0.22),0_0_12px_3px_rgba(14,165,233,0.45)]"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ) : null}
      {FOOD_FOREST_STEPS.map((step, i) => {
        const reached = i <= at + 0.001 && p > 0;
        const last = done && i === steps - 1;
        return (
          <span
            key={step}
            className={cn(
              "relative z-[1] justify-self-center whitespace-nowrap rounded-md border px-2 py-0.5 text-[12px] font-semibold transition-colors duration-200 desk:text-[clamp(12px,1.45vh,15px)]",
              SNAKE_CELL[i],
              last
                ? "border-accent bg-accent text-white"
                : reached
                  ? "border-accent/40 bg-sky-50 text-accent-strong"
                  : "border-slate-900/10 bg-white text-muted"
            )}
          >
            {step}
          </span>
        );
      })}
    </div>
  );
}

const PRODIGY_ROWS = [
  [46, 26],
  [38, 30],
];

/** From the bullet: an admin-only employee list where a new row is added, saved, then sits in the list. */
function ProdigyStrip({ p }: { p: number }) {
  const pressed = p > 0.04 && p < 0.2;
  const grow = ease(phase(p, 0.18, 0.24));
  const saved = p >= 0.52;
  const settle = phase(p, 0.78, 0.2);
  return (
    <div className="w-full max-w-[290px]" aria-hidden="true">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-bold text-ink desk:text-[clamp(12px,1.45vh,15px)]">Employees</span>
        <span className="flex items-center gap-1">
          <span className="rounded-md border border-slate-900/10 bg-white/70 px-1.5 py-px text-[12px] font-semibold text-muted desk:text-[clamp(12px,1.4vh,14.5px)]">
            Admin only
          </span>
          <span
            className={cn(
              "rounded-md px-1.5 py-px text-[12px] font-semibold text-white transition-colors desk:text-[clamp(12px,1.4vh,14.5px)]",
              pressed ? "bg-accent-strong" : "bg-accent"
            )}
            style={{ transform: pressed ? "scale(0.94)" : undefined }}
          >
            + Add
          </span>
        </span>
      </div>
      <ul className="mt-1.5 grid gap-[3px]">
        <li
          className="flex h-[18px] items-center gap-2 rounded-md border px-2 transition-colors duration-300 desk:h-[clamp(16px,2.4vh,24px)]"
          style={{
            opacity: grow,
            transform: `translateY(${(1 - grow) * -5}px)`,
            borderColor: settle < 1 ? "rgba(2,132,199,0.45)" : "rgba(20,48,74,0.08)",
            background: settle < 1 ? "rgba(224,242,254,0.95)" : "rgba(255,255,255,0.7)",
          }}
        >
          <span
            className={cn("h-2 w-[40%] rounded-full transition-colors duration-500", settle < 1 ? "bg-accent/55" : "bg-slate-900/15")}
          />
          <span
            className={cn("h-2 w-[22%] rounded-full transition-colors duration-500", settle < 1 ? "bg-accent/35" : "bg-slate-900/10")}
          />
          <span
            className="ml-auto inline-flex items-center gap-1 text-[12px] font-semibold leading-none text-good-strong transition-opacity duration-300 desk:text-[clamp(12px,1.4vh,14.5px)]"
            style={{ opacity: saved && settle < 1 ? 1 : 0 }}
          >
            <CheckIcon size={11} />
            Saved
          </span>
        </li>
        {PRODIGY_ROWS.map(([a, b], i) => (
          <li
            key={i}
            className="flex h-[18px] items-center gap-2 rounded-md border border-slate-900/[0.08] bg-white/70 px-2 desk:h-[clamp(16px,2.4vh,24px)]"
          >
            <span className="h-2 rounded-full bg-slate-900/15" style={{ width: `${a}%` }} />
            <span className="h-2 rounded-full bg-slate-900/10" style={{ width: `${b}%` }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function JobCard({ job, lit, strip }: { job: Job; lit: boolean; strip: number }) {
  const hasStrip = true;
  return (
    <SpotlightCard
      data-lit={lit}
      data-tour-target={job.id !== "prodigy" ? "" : undefined}
      className="rounded-[22px] bg-white/55 shadow-[0_14px_40px_rgba(30,80,150,0.10)]"
      contentClassName="p-4 desk:px-[clamp(16px,2.4vh,32px)] desk:py-[clamp(10px,1.7vh,24px)]"
    >
      <span className="lit-layer pointer-events-none absolute inset-0 rounded-[22px]" />
      <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <h3
            className="text-[19px] font-extrabold leading-tight text-ink desk:text-[clamp(15px,2.45vh,30px)]"
            style={{ fontStretch: "112%" }}
          >
            {job.role}
          </h3>
          <span className="text-[14px] font-semibold text-accent-strong desk:text-[clamp(13px,1.8vh,20px)]">{job.company}</span>
          <span className="inline-flex items-center gap-1 text-[14px] text-muted desk:text-[clamp(12.5px,1.7vh,19px)]">
            <PinIcon size={13} />
            {job.place}
          </span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-900/[0.09] bg-white/75 px-2.5 py-1 text-[13px] font-medium text-ink-2 desk:text-[clamp(12px,1.6vh,17px)]">
          <CalendarIcon size={13} className="text-accent-strong" />
          {job.dates}
        </span>
      </div>
      <div
        className={cn(
          "relative mt-2.5 grid gap-4 desk:mt-[clamp(6px,1.1vh,14px)]",
          hasStrip && "md:grid-cols-[minmax(0,1fr)_minmax(270px,29%)] desk:gap-[clamp(14px,2.2vw,44px)]"
        )}
      >
        <ul className="grid content-start gap-1.5 text-[14px] leading-snug text-ink-2 desk:gap-[clamp(2px,0.6vh,8px)] desk:text-[clamp(12.5px,1.78vh,19.5px)]">
          {job.lines.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" aria-hidden="true" />
              <span>
                <Rich text={line} />
              </span>
            </li>
          ))}
        </ul>
        {hasStrip ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-900/[0.06] bg-sky-50/40 px-3 py-2.5 desk:px-[clamp(8px,1.4vh,16px)] desk:py-[clamp(6px,1.1vh,14px)]">
            {job.id === "byld" ? (
              <ByldStrip p={strip} />
            ) : job.id === "foodforest" ? (
              <FoodForestStrip p={strip} />
            ) : (
              <ProdigyStrip p={strip} />
            )}
          </div>
        ) : null}
      </div>
    </SpotlightCard>
  );
}

export function ExperiencePage() {
  const { ref, t, reduced } = useFigureClock<HTMLDivElement>({ until: UNTIL, page: "experience" });
  const listRef = useRef<HTMLOListElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [stops, setStops] = useState<number[]>([]);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const top = list.getBoundingClientRect().top;
    setStops(
      nodeRefs.current.map((node) => {
        if (!node) return 0;
        const box = node.getBoundingClientRect();
        return box.top + box.height / 2 - top;
      })
    );
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  const arrive = (i: number) => START + i * LEG;
  const travel = clamp01((t - START) / (LEG * (EXPERIENCE.length - 1)));
  const segment = Math.min(EXPERIENCE.length - 2, Math.floor(travel * (EXPERIENCE.length - 1)));
  const local = travel * (EXPERIENCE.length - 1) - segment;
  const pulseY =
    stops.length === EXPERIENCE.length
      ? stops[segment] + (stops[segment + 1] - stops[segment]) * ease(local)
      : null;
  const running = !reduced && t >= START - 100 && t < START + LEG * (EXPERIENCE.length - 1) + 250;
  const first = stops[0] ?? 0;
  const last = stops[stops.length - 1] ?? 0;

  return (
    <section id="experience" data-page aria-labelledby="experience-title" className="page">
      <div className="page-inner gap-4 desk:gap-[clamp(10px,2.2vh,32px)]">
        <h2 id="experience-title" className="heading text-[40px] text-ink desk:text-[clamp(40px,7.4vh,104px)]">
          Experience
        </h2>
        <div ref={ref} className="desk:flex desk:min-h-0 desk:flex-1 desk:flex-col desk:justify-center-safe">
          <ol ref={listRef} className="relative grid gap-3 pl-9 desk:gap-[clamp(6px,1.3vh,18px)] desk:pl-[clamp(40px,3.6vw,64px)]">
            <span
              aria-hidden="true"
              className="glass absolute left-[9px] w-[12px] rounded-full desk:left-[clamp(10px,1.1vw,22px)]"
              style={{ top: first - 12, height: Math.max(0, last - first + 24) }}
            >
              <span className="absolute inset-y-2 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-slate-900/[0.12]" />
              {pulseY !== null ? (
                <span
                  className="absolute left-1/2 top-2 w-[2px] -translate-x-1/2 rounded-full bg-accent/70"
                  style={{ height: Math.max(0, (reduced ? last - first : pulseY - first)) }}
                />
              ) : null}
            </span>
            {running && pulseY !== null ? (
              <span
                aria-hidden="true"
                className="absolute left-[15px] z-[2] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_6px_rgba(14,165,233,0.22),0_0_18px_6px_rgba(14,165,233,0.45)] desk:left-[calc(clamp(10px,1.1vw,22px)_+_6px)]"
                style={{ top: pulseY }}
              />
            ) : null}
            {EXPERIENCE.map((job, i) => {
              const reached = reduced || t >= arrive(i) - 60;
              const lit = !reduced && t >= arrive(i) - 60 && t < arrive(i) + LIT_FOR;
              const strip = reduced ? 1 : clamp01((t - arrive(i)) / STRIP_FOR);
              return (
                <li key={job.id} className="relative">
                  <span
                    ref={(node) => {
                      nodeRefs.current[i] = node;
                    }}
                    aria-hidden="true"
                    className={cn(
                      "absolute -left-9 top-[26px] z-[1] h-4 w-4 translate-x-[7px] rounded-full border-2 bg-white transition-colors duration-300 desk:-left-[clamp(40px,3.6vw,64px)] desk:top-[clamp(14px,2.4vh,32px)] desk:translate-x-[calc(clamp(10px,1.1vw,22px)_-_2px)]",
                      reached ? "border-accent" : "border-slate-900/25"
                    )}
                  >
                    {lit ? <span className="absolute inset-[3px] rounded-full bg-accent" /> : null}
                  </span>
                  <JobCard job={job} lit={lit} strip={strip} />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
