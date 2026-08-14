"use client";

import { COURSEWORK_TRACKS, DEGREE, FOCUS_AREAS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { Reveal, SectionHeader, SpotlightCard } from "./ui";
import { CapIcon } from "./icons";

function GpaRing() {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);
  const r = 40;
  const C = 2 * Math.PI * r;
  return (
    <div ref={ref} className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(15,42,67,0.10)" strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#gpa-grad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={inView ? 0 : C}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <defs>
          <linearGradient id="gpa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="gradient-name text-2xl font-bold">4.0</span>
        <span className="text-[9px] uppercase tracking-wider text-slate-500">GPA</span>
      </div>
    </div>
  );
}

/** Eight terms of the degree, filled as they are completed. */
function DegreeProgress() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  return (
    <div ref={ref}>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Degree progress
        </span>
        <span className="font-mono text-[11px] text-slate-500">
          {DEGREE.termsDone} / {DEGREE.terms.length} terms
        </span>
      </div>
      <div className="flex gap-1">
        {DEGREE.terms.map((t, i) => {
          const done = i < DEGREE.termsDone;
          return (
            <div key={t} className="flex-1">
              <div
                className="h-1.5 rounded-full"
                style={{
                  background: done
                    ? "linear-gradient(90deg,#0ea5e9,#2563eb)"
                    : "rgba(15,42,67,0.10)",
                  transform: inView ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition: `transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 70}ms`,
                }}
              />
              <div className="mt-1.5 hidden text-center font-mono text-[8px] text-slate-400 sm:block">
                {t}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Education() {
  return (
    <section
      id="education"
      data-key="education"
      className="scroll-mt-20 py-20 sm:py-24 lg:flex lg:min-h-[calc(100svh-56px)] lg:items-center lg:py-12"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeader index="01" title="Education" compact />

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.55fr_1fr]">
          <Reveal>
            <SpotlightCard className="h-full bg-white/55 p-6 sm:p-8 lg:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CapIcon size={15} />
                    {DEGREE.school} · {DEGREE.place}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {DEGREE.title}
                  </div>
                  <div className="mt-1 font-mono text-xs text-slate-500">
                    {DEGREE.start} to {DEGREE.end}
                  </div>
                </div>
                <GpaRing />
              </div>

              <div className="mt-6 border-t border-slate-900/[0.08] pt-5">
                <DegreeProgress />
              </div>

              <div className="mt-6 border-t border-slate-900/[0.08] pt-5">
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Coursework, by what it feeds
                </div>
                <div className="space-y-3.5">
                  {COURSEWORK_TRACKS.map((track) => (
                    <div key={track.label} className="flex gap-3">
                      <div
                        className="mt-1 w-0.5 shrink-0 rounded-full"
                        style={{ background: track.color, opacity: 0.55 }}
                      />
                      <div className="min-w-0">
                        <div
                          className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                          style={{ color: track.color }}
                        >
                          {track.label}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {track.courses.map((c) => (
                            <span
                              key={c}
                              className="text-[13px] text-slate-600"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          <div className="flex flex-col gap-4">
            <Reveal delay={120}>
              <SpotlightCard className="bg-white/55 p-5 sm:p-6">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Standing
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-slate-800">
                      Dean&rsquo;s List
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                    <span className="text-sm text-slate-600">
                      Graduating {DEGREE.end}
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>

            <Reveal delay={200} className="flex-1">
              <SpotlightCard className="h-full bg-white/55 p-5 sm:p-6">
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Where it points
                </div>
                <div className="space-y-3.5">
                  {FOCUS_AREAS.map((area, i) => (
                    <div key={area.label} className="flex gap-3">
                      <span className="mt-0.5 font-mono text-[10px] text-slate-400">
                        0{i + 1}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {area.label}
                        </div>
                        <div className="text-xs leading-relaxed text-slate-500">
                          {area.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
