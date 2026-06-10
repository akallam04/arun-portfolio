"use client";

import { EXPERIENCE } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { Chip, Reveal, SectionHeader, SpotlightCard, cn } from "./ui";
import { BriefcaseIcon, PinIcon } from "./icons";

export function Experience() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <section
      id="experience"
      data-key="experience"
      className="scroll-mt-20 py-20 sm:py-24 lg:flex lg:min-h-[calc(100svh-56px)] lg:items-center lg:py-12"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeader index="03" title="Experience" compact />

        <div ref={ref} className="relative">
          {/* Timeline rail */}
          <div className="absolute bottom-4 left-[7px] top-1 w-px bg-white/[0.07] sm:left-[9px]" />
          <div
            className={cn(
              "timeline-line absolute bottom-4 left-[7px] top-1 w-px bg-gradient-to-b from-blue-400 via-emerald-400 to-purple-400/60 sm:left-[9px]",
              inView && "drawn"
            )}
          />

          <div className="space-y-8 sm:space-y-10 lg:space-y-5">
            {EXPERIENCE.map((exp, i) => (
              <Reveal key={exp.company} delay={i * 150}>
                <div className="relative pl-8 sm:pl-12">
                  {/* Timeline node */}
                  <span
                    className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 sm:h-[19px] sm:w-[19px]"
                    style={{
                      borderColor: exp.color,
                      background: "#05070c",
                      boxShadow: `0 0 14px ${exp.color}55`,
                    }}
                  >
                    <span
                      className="h-[5px] w-[5px] rounded-full sm:h-[7px] sm:w-[7px]"
                      style={{ background: exp.color }}
                    />
                  </span>

                  <SpotlightCard
                    className="p-5 sm:p-7 lg:p-5"
                    style={{ background: `${exp.color}0d` }}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <div className="text-lg font-bold text-white sm:text-xl">
                          {exp.role}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/45">
                          <span className="flex items-center gap-1.5">
                            <BriefcaseIcon size={13} />
                            {exp.company}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <PinIcon size={13} />
                            {exp.location}
                          </span>
                        </div>
                      </div>
                      <div
                        className="w-fit shrink-0 rounded-lg border px-3 py-1 font-mono text-xs"
                        style={{
                          borderColor: `${exp.color}33`,
                          color: `${exp.color}dd`,
                          background: `${exp.color}0d`,
                        }}
                      >
                        {exp.period}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2 lg:mt-3 lg:gap-1.5">
                      {exp.tags.map((t) => (
                        <Chip key={t} compact>
                          {t}
                        </Chip>
                      ))}
                    </div>

                    <ul className="mt-5 space-y-3 lg:mt-3.5 lg:space-y-2">
                      {exp.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-sm leading-relaxed text-white/70 sm:text-base lg:text-[15px]"
                        >
                          <span
                            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full sm:mt-[11px]"
                            style={{ background: `${exp.color}99` }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </SpotlightCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
