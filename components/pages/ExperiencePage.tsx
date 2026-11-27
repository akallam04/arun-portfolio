"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { BYLD_SECTIONS, BYLD_TILES, EXPERIENCE, FOOD_FOREST_STEPS, type Job } from "@/lib/data";
import { along, clamp01, ease, loopTime, phase, useFigureClock, useMedia, type Pt } from "@/lib/figure";
import { CalendarIcon, CheckIcon, PinIcon } from "../icons";
import { SpotlightCard } from "../ui";
import { cn } from "@/lib/cn";

const START = 300;
const LEG = 1150;
const LIT_FOR = 900;
const UNTIL = START + LEG * (EXPERIENCE.length - 1) + LIT_FOR + 100;

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

const DESK = "(min-width: 1024px) and (min-height: 600px)";

/** Each strip loops on its own clock: it plays, holds its finished frame for a short pause, then plays again. */
function useStripClock(delay: number, loop: number) {
  const { ref, t, reduced } = useFigureClock<HTMLDivElement>({ page: "experience", replay: true });
  const local = reduced ? null : loopTime(t, delay, loop);
  const round = local === null ? -1 : Math.floor((t - delay) / loop);
  return { ref, local, round };
}

function pulse(local: number | null, start: number, length: number) {
  if (local === null) return 0;
  const u = (local - start) / length;
  return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u);
}

const BYLD_LOOP = 3600;
const BYLD_LINES = [12, 30, 48];

/** One codebase sends work down three lines, and the 14 outputs light up one after another. */
function ByldStrip({ delay }: { delay: number }) {
  const { ref, local } = useStripClock(delay, BYLD_LOOP);
  const source = pulse(local, 0, 380);
  return (
    <div ref={ref} className="grid grid-cols-[auto_26px_minmax(0,1fr)] items-center" aria-hidden="true">
      <span
        className="max-w-[5.6em] rounded-lg border border-accent/40 bg-white px-2 py-1 text-center text-[12px] font-bold leading-tight text-accent-strong desk:text-[clamp(12px,1.45vh,15px)]"
        style={{
          transform: `scale(${1 + 0.06 * source})`,
          boxShadow: source > 0 ? `0 0 0 ${4 * source}px rgba(14,165,233,${0.22 * source})` : undefined,
        }}
      >
        One codebase
      </span>
      <svg viewBox="0 0 26 60" className="h-[60px] w-[26px] overflow-visible" preserveAspectRatio="none">
        {BYLD_LINES.map((y) => (
          <line key={y} x1="0" y1="30" x2="26" y2={y} stroke="#0284c7" strokeOpacity="0.5" strokeWidth="1.4" />
        ))}
        {local !== null
          ? BYLD_LINES.map((y, j) => {
              const u = phase(local, 150 + j * 70, 520);
              if (u <= 0 || u >= 1) return null;
              const k = ease(u);
              return <circle key={y} cx={26 * k} cy={30 + (y - 30) * k} r="2.6" fill="#0284c7" />;
            })
          : null}
      </svg>
      <div className="grid min-w-0 gap-1.5">
        <div className="flex flex-wrap gap-1">
          {BYLD_TILES.map((tile, i) => {
            const k = pulse(local, 650 + i * 110, 360);
            return (
              <span
                key={tile}
                className={cn(
                  "rounded-md border px-1.5 py-0.5 text-[12px] font-semibold transition-colors duration-150 desk:text-[clamp(12px,1.4vh,15px)]",
                  k > 0.35 ? "border-accent bg-accent text-white" : "border-accent/50 bg-sky-50 text-accent-strong"
                )}
                style={{ transform: `scale(${1 + 0.08 * k})` }}
              >
                {tile}
              </span>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: BYLD_SECTIONS }, (_, i) => {
            const k = pulse(local, 650 + (BYLD_TILES.length + i) * 110, 360);
            return (
              <span
                key={i}
                className={cn(
                  "block h-3.5 w-3.5 rounded-[4px] border transition-colors duration-150 desk:h-[clamp(11px,1.6vh,17px)] desk:w-[clamp(11px,1.6vh,17px)]",
                  k > 0.35 ? "border-accent-strong bg-accent-strong" : "border-accent bg-accent/80"
                )}
                style={{ transform: `scale(${1 + 0.22 * k})` }}
              />
            );
          })}
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
const FOOD_LOOP = 3800;
const FOOD_TRAVEL = 2200;

/** A record moves through the pipeline, step by step, and lands in MySQL. */
function FoodForestStrip({ delay }: { delay: number }) {
  const { ref, local } = useStripClock(delay, FOOD_LOOP);
  const steps = FOOD_FOREST_STEPS.length;
  const u = local === null ? 1 : clamp01(local / FOOD_TRAVEL);
  const moving = local !== null && local < FOOD_TRAVEL + 160;
  const dotOpacity = local === null ? 0 : Math.min(phase(local, 0, 160), 1 - phase(local, FOOD_TRAVEL, 160));
  const [x, y] = along(SNAKE, ease(u));
  let near = -1;
  let best = 9;
  SNAKE.forEach(([px, py], i) => {
    const d = Math.hypot(px - x, py - y);
    if (d < best) {
      best = d;
      near = i;
    }
  });
  const land = pulse(local, FOOD_TRAVEL - 60, 420);
  return (
    <div ref={ref} className="relative grid grid-cols-3 grid-rows-2 gap-x-2 gap-y-3" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <polyline
          points={SNAKE.map(([px, py]) => `${px},${py}`).join(" ")}
          fill="none"
          stroke="rgba(2,132,199,0.28)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {moving && dotOpacity > 0 ? (
        <span
          className="absolute z-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(14,165,233,0.22),0_0_12px_3px_rgba(14,165,233,0.45)]"
          style={{ left: `${x}%`, top: `${y}%`, opacity: dotOpacity }}
        />
      ) : null}
      {FOOD_FOREST_STEPS.map((step, i) => {
        const last = i === steps - 1;
        const active = moving && near === i && !last;
        return (
          <span
            key={step}
            className={cn(
              "relative z-[1] justify-self-center whitespace-nowrap rounded-md border px-2 py-0.5 text-[12px] font-semibold transition-[background-color,border-color,color,transform] duration-200 desk:text-[clamp(12px,1.45vh,15px)]",
              SNAKE_CELL[i],
              last
                ? "border-accent bg-accent text-white"
                : active
                  ? "border-accent bg-white text-accent-strong shadow-[0_0_0_3px_rgba(14,165,233,0.18)]"
                  : "border-accent/40 bg-sky-50 text-accent-strong"
            )}
            style={{ transform: `scale(${last ? 1 + 0.1 * land : active ? 1.06 : 1})` }}
          >
            {step}
          </span>
        );
      })}
    </div>
  );
}

const PRODIGY_LOOP = 3400;
const PRODIGY_WIDTHS: [number, number][] = [
  [46, 26],
  [38, 30],
  [42, 22],
  [34, 28],
  [48, 24],
];

function rowWidths(index: number) {
  const n = PRODIGY_WIDTHS.length;
  return PRODIGY_WIDTHS[((index % n) + n) % n];
}

function mix(a: number[], b: number[], k: number) {
  const c = a.map((value, i) => value + (b[i] - value) * k);
  return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${c[3].toFixed(3)})`;
}

const NEW_BG = [224, 242, 254, 0.95];
const BASE_BG = [255, 255, 255, 0.7];
const NEW_BORDER = [2, 132, 199, 0.45];
const BASE_BORDER = [20, 48, 74, 0.08];
const NEW_BAR = [2, 132, 199, 0.5];
const BASE_BAR = [20, 48, 74, 0.15];

/** From the bullet: in an admin-only employee list, a new row is added, saved, and joins the list. */
function ProdigyStrip({ delay }: { delay: number }) {
  const { ref, local, round } = useStripClock(delay, PRODIGY_LOOP);
  const pressed = local !== null && local > 60 && local < 280;
  const grow = local === null ? 1 : ease(phase(local, 260, 500));
  const saved = local === null ? 0 : Math.min(phase(local, 760, 200), 1 - phase(local, 1500, 400));
  const settle = local === null ? 1 : ease(phase(local, 1100, 800));
  const top = round + 1;
  const sliding = local !== null && grow < 1;
  const rows = sliding ? [top, top - 1, top - 2, top - 3] : [top, top - 1, top - 2];
  return (
    <div ref={ref} className="w-full max-w-[290px]" aria-hidden="true">
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
      <div className="mt-1.5 h-[calc(var(--row)*3+6px)] overflow-hidden [--row:18px] desk:[--row:clamp(16px,2.4vh,24px)]">
        {rows.map((index, i) => {
          const fresh = i === 0;
          const [a, b] = rowWidths(index);
          const k = fresh ? settle : 1;
          return (
            <div
              key={index}
              className="flex items-center gap-2 overflow-hidden rounded-md border px-2"
              style={{
                height: fresh ? `calc(var(--row) * ${grow})` : "var(--row)",
                marginTop: i === 0 ? 0 : i === 1 ? `${3 * grow}px` : "3px",
                opacity: fresh ? grow : 1,
                borderColor: mix(NEW_BORDER, BASE_BORDER, k),
                background: mix(NEW_BG, BASE_BG, k),
              }}
            >
              <span className="h-2 min-w-0 rounded-full" style={{ width: `${a}%`, background: mix(NEW_BAR, BASE_BAR, k) }} />
              <span className="h-2 min-w-0 rounded-full" style={{ width: `${b}%`, background: mix(NEW_BAR, BASE_BAR, k * 0.9 + 0.1) }} />
              {fresh ? (
                <span
                  className="ml-auto inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold leading-none text-good-strong desk:text-[clamp(12px,1.4vh,14.5px)]"
                  style={{ opacity: saved }}
                >
                  <CheckIcon size={11} />
                  Saved
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JobCard({ job, lit, delay }: { job: Job; lit: boolean; delay: number }) {
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
              <ByldStrip delay={delay} />
            ) : job.id === "foodforest" ? (
              <FoodForestStrip delay={delay} />
            ) : (
              <ProdigyStrip delay={delay} />
            )}
          </div>
        ) : null}
      </div>
    </SpotlightCard>
  );
}

export function ExperiencePage() {
  const { ref, t, reduced } = useFigureClock<HTMLDivElement>({ until: UNTIL, page: "experience", replay: true });
  const desk = useMedia(DESK, true);
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
              const delay = desk ? arrive(i) : START;
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
                  <JobCard job={job} lit={lit} delay={delay} />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
