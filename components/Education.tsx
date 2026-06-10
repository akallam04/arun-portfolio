"use client";

import { COURSEWORK, FOCUS_AREAS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { Chip, Reveal, SectionHeader, SpotlightCard } from "./ui";
import { CapIcon } from "./icons";

function GpaRing() {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);
  const r = 40;
  const C = 2 * Math.PI * r;
  return (
    <div ref={ref} className="relative h-28 w-28">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="7"
        />
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
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">4.0</span>
        <span className="text-[9px] uppercase tracking-wider text-white/40">GPA</span>
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
        <SectionHeader index="01" title="Education" />

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <SpotlightCard className="h-full bg-white/[0.04] p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <CapIcon size={15} />
                    Arizona State University · Tempe, AZ
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    B.S. in Computer Science
                  </div>
                </div>
                <div className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/45 sm:text-right">
                  Aug 2023 — May 2027
                </div>
              </div>

              <div className="mt-6 border-t border-white/[0.06] pt-6 sm:mt-7">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    Relevant Coursework
                  </span>
                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {COURSEWORK.map((c) => (
                    <Chip key={c}>{c}</Chip>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          <div className="flex flex-col gap-4">
            <Reveal delay={120}>
              <SpotlightCard className="bg-white/[0.04] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                      Academic Standing
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-sm font-semibold text-white/80">
                          Dean&rsquo;s List
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        <span className="text-sm text-white/55">
                          Graduating May 2027
                        </span>
                      </div>
                    </div>
                  </div>
                  <GpaRing />
                </div>
              </SpotlightCard>
            </Reveal>

            <Reveal delay={200} className="flex-1">
              <SpotlightCard className="h-full bg-white/[0.04] p-5 sm:p-6">
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  Focus Areas
                </div>
                <div className="space-y-3.5">
                  {FOCUS_AREAS.map((area) => (
                    <div key={area.label} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
                      <div>
                        <div className="text-sm font-semibold text-white/80">
                          {area.label}
                        </div>
                        <div className="text-xs leading-relaxed text-white/40">
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
