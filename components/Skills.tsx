"use client";

import { useState } from "react";
import { SKILL_GROUPS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { Chip, Reveal, SectionHeader, SpotlightCard, cn } from "./ui";

const CX = 190;
const CY = 150;
const MAX_R = 100;
const LABEL_R = 120;

function point(i: number, r: number): [number, number] {
  const angle = (-90 + i * 60) * (Math.PI / 180);
  return [CX + Math.cos(angle) * r, CY + Math.sin(angle) * r];
}

function anchorFor(i: number): "start" | "middle" | "end" {
  if (i === 0 || i === 3) return "middle";
  return i === 1 || i === 2 ? "start" : "end";
}

function SkillRadar({
  hovered,
  onHover,
}: {
  hovered: number | null;
  onHover: (i: number | null) => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const rings = [0.25, 0.5, 0.75, 1];
  const valuePoints = SKILL_GROUPS.map((g, i) =>
    point(i, (g.level / 100) * MAX_R)
  );
  const polygon = valuePoints.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <div ref={ref} className="mx-auto w-full max-w-[380px] lg:max-w-[330px]">
      <svg
        viewBox="0 0 380 300"
        className="w-full"
        role="img"
        aria-label="Skill radar chart across six domains"
      >
        {/* Grid rings */}
        {rings.map((f) => (
          <polygon
            key={f}
            points={SKILL_GROUPS.map((_, i) => point(i, MAX_R * f).join(","))
              .join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines + labels */}
        {SKILL_GROUPS.map((g, i) => {
          const [ax, ay] = point(i, MAX_R);
          const [lx, ly] = point(i, LABEL_R);
          const isHot = hovered === i;
          return (
            <g key={g.label}>
              <line
                x1={CX}
                y1={CY}
                x2={ax}
                y2={ay}
                stroke={
                  isHot ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.09)"
                }
                strokeWidth="1"
              />
              <text
                x={lx}
                y={ly + 3}
                textAnchor={anchorFor(i)}
                fontSize="11"
                fontWeight={isHot ? 700 : 500}
                fill={isHot ? g.color : "rgba(255,255,255,0.45)"}
                style={{ transition: "fill 0.2s", cursor: "default" }}
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(null)}
              >
                {g.axis}
              </text>
            </g>
          );
        })}

        {/* Value shape */}
        <g className={cn("radar-shape", inView && "drawn")}>
          <polygon
            points={polygon}
            fill="rgba(96,165,250,0.14)"
            stroke="rgba(96,165,250,0.75)"
            strokeWidth="1.5"
          />
          {valuePoints.map(([x, y], i) => {
            const isHot = hovered === i;
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHot ? 6.5 : 4}
                  fill={SKILL_GROUPS[i].color}
                  stroke="#05070c"
                  strokeWidth="2"
                  style={{ transition: "r 0.2s" }}
                  onMouseEnter={() => onHover(i)}
                  onMouseLeave={() => onHover(null)}
                />
                {isHot && (
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={700}
                    fill="#fff"
                  >
                    {SKILL_GROUPS[i].level}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <p className="mt-2 text-center text-[11px] text-white/30">
        Tap or hover a category to explore depth across six domains
      </p>
    </div>
  );
}

export function Skills() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="skills"
      data-key="skills"
      className="scroll-mt-20 py-20 sm:py-24 lg:flex lg:min-h-[calc(100svh-56px)] lg:items-center lg:py-12"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeader index="02" title="Skills" compact />

        <div className="grid items-center gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8">
          <Reveal className="order-first">
            <SkillRadar hovered={hovered} onHover={setHovered} />
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-3">
            {SKILL_GROUPS.map((group, i) => (
              <Reveal key={group.label} delay={i * 70}>
                <SpotlightCard
                  className="h-full p-4 transition-colors duration-300 sm:p-5 lg:p-4"
                  style={{
                    background: `${group.color}10`,
                    borderColor:
                      hovered === i ? `${group.color}66` : undefined,
                  }}
                >
                  <div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="mb-3 flex items-center justify-between lg:mb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: group.color }}
                        />
                        <span className="text-sm font-bold text-white/85 sm:text-base lg:text-sm">
                          {group.label}
                        </span>
                      </div>
                      <span
                        className="font-mono text-[11px] font-semibold"
                        style={{ color: `${group.color}cc` }}
                      >
                        {group.level}
                      </span>
                    </div>
                    {/* Mini level bar */}
                    <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/[0.07] lg:mb-2.5">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${group.level}%`,
                          background: `linear-gradient(90deg, ${group.color}55, ${group.color})`,
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 lg:gap-1">
                      {group.items.map((item) => (
                        <Chip key={item} compact>
                          {item}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
