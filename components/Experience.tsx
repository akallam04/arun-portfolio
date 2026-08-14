"use client";

import { useState } from "react";
import { EXPERIENCE } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { Chip, Reveal, SectionHeader, SpotlightCard, cn } from "./ui";
import { BriefcaseIcon, PinIcon } from "./icons";

const months = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};

// Chronological, so the axis reads left to right like time does.
const ROLES = [...EXPERIENCE].sort((a, b) => months(a.start) - months(b.start));
const AXIS_START = months(ROLES[0].start) - 3;
const AXIS_END = months(ROLES[ROLES.length - 1].end) + 3;
const SPAN = AXIS_END - AXIS_START;
const pct = (ym: string) => ((months(ym) - AXIS_START) / SPAN) * 100;

const YEARS = Array.from(
  new Set(ROLES.flatMap((r) => [r.start.slice(0, 4), r.end.slice(0, 4)]))
).sort();

/**
 * A real time axis rather than the usual dot-timeline: each role is a bar
 * placed by its actual dates, so the gaps and the cadence are visible.
 */
function CareerAxis({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (i: number) => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className="mb-6 sm:mb-8">
      <div className="relative h-9">
        {/* baseline */}
        <div className="absolute left-0 right-0 top-[18px] h-px bg-slate-900/[0.12]" />
        {YEARS.map((y) => {
          const left = pct(`${y}-01`);
          if (left < 0 || left > 100) return null;
          return (
            <div
              key={y}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${left}%`, transform: "translateX(-50%)" }}
            >
              <span className="font-mono text-[10px] text-slate-400">{y}</span>
              <span className="mt-1 h-2 w-px bg-slate-900/15" />
            </div>
          );
        })}

        {ROLES.map((r, i) => {
          const left = pct(r.start);
          const width = Math.max(pct(r.end) - left, 3.5);
          const on = selected === i;
          return (
            <button
              key={r.company}
              onClick={() => onSelect(i)}
              aria-label={`${r.role} at ${r.company}`}
              aria-pressed={on}
              className="absolute top-[13px] rounded-full"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                height: 11,
                background: r.color,
                opacity: inView ? (on ? 1 : 0.45) : 0,
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                boxShadow: on ? `0 0 0 4px ${r.color}22` : "none",
                transition: `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 130}ms, opacity 0.4s ${i * 130}ms, box-shadow 0.3s`,
              }}
            />
          );
        })}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {ROLES.map((r, i) => (
          <button
            key={r.company}
            onClick={() => onSelect(i)}
            className={cn(
              "flex items-center gap-1.5 font-mono text-[10px] transition-colors",
              selected === i ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: r.color, opacity: selected === i ? 1 : 0.5 }}
            />
            {r.company}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Experience() {
  const [selected, setSelected] = useState(ROLES.length - 1);

  return (
    <section
      id="experience"
      data-key="experience"
      className="scroll-mt-20 py-20 sm:py-24 lg:flex lg:min-h-[calc(100svh-56px)] lg:items-center lg:py-12"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeader index="03" title="Experience" compact />

        <Reveal>
          <CareerAxis selected={selected} onSelect={setSelected} />
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
          {ROLES.map((exp, i) => {
            const on = selected === i;
            const latest = i === ROLES.length - 1;
            return (
              <Reveal key={exp.company} delay={i * 110} className="h-full">
                <SpotlightCard
                  blur={false}
                  onMouseEnter={() => setSelected(i)}
                  className="flex h-full flex-col p-5 transition-all duration-300 lg:p-5"
                  style={{
                    background: on
                      ? `linear-gradient(160deg, ${exp.color}16 0%, rgba(255,255,255,0) 60%), rgba(255,255,255,0.72)`
                      : "rgba(255,255,255,0.5)",
                    borderColor: on ? `${exp.color}45` : undefined,
                  }}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                      style={{ color: exp.color }}
                    >
                      {exp.kind}
                    </span>
                    {latest && (
                      <span
                        className="rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em]"
                        style={{
                          borderColor: `${exp.color}40`,
                          color: exp.color,
                          background: `${exp.color}12`,
                        }}
                      >
                        Most recent
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold leading-tight text-slate-900">
                    {exp.role}
                  </h3>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <BriefcaseIcon size={12} />
                      {exp.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <PinIcon size={12} />
                      {exp.location}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-400">
                    {exp.period}
                  </div>

                  <ul className="mt-4 space-y-2.5">
                    {exp.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex gap-2.5 text-[13px] leading-relaxed text-slate-600"
                      >
                        <span
                          className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
                          style={{ background: exp.color }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {exp.tags.map((t) => (
                      <Chip key={t} compact>
                        {t}
                      </Chip>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
