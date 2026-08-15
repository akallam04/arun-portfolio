"use client";

import { useState } from "react";
import { SKILL_GROUPS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { Reveal, SectionHeader, cn } from "./ui";

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
            stroke="rgba(15,42,67,0.10)"
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
                  isHot ? "rgba(15,42,67,0.35)" : "rgba(15,42,67,0.12)"
                }
                strokeWidth="1"
              />
              <text
                x={lx}
                y={ly + 3}
                textAnchor={anchorFor(i)}
                fontSize="11"
                fontWeight={isHot ? 700 : 500}
                fill={isHot ? g.color : "rgba(51,65,85,0.75)"}
                style={{ transition: "fill 0.2s", cursor: "default" }}
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(null)}
              >
                {g.axis}
              </text>
            </g>
          );
        })}

        {/* Radar sweep: rotates like a real scope */}
        <g
          className="radar-sweep"
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <defs>
            <linearGradient id="sweep-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(2,132,199,0)" />
              <stop offset="100%" stopColor="rgba(2,132,199,0.45)" />
            </linearGradient>
          </defs>
          <path
            d={`M ${CX} ${CY} L ${CX + MAX_R} ${CY} A ${MAX_R} ${MAX_R} 0 0 0 ${
              CX + MAX_R * Math.cos(-0.55)
            } ${CY + MAX_R * Math.sin(-0.55)} Z`}
            fill="url(#sweep-grad)"
            opacity="0.5"
          />
          <line
            x1={CX}
            y1={CY}
            x2={CX + MAX_R}
            y2={CY}
            stroke="rgba(2,132,199,0.5)"
            strokeWidth="1"
          />
        </g>

        {/* Value shape */}
        <g className={cn("radar-shape", inView && "drawn")}>
          <polygon
            points={polygon}
            fill="rgba(37,99,235,0.13)"
            stroke="rgba(37,99,235,0.65)"
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
                  stroke="#eef5fd"
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
                    fill="#0f172a"
                  >
                    {SKILL_GROUPS[i].level}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <p className="mt-2 text-center text-[11px] text-slate-400">
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

          <div className="divide-y divide-slate-900/[0.07] border-y border-slate-900/[0.07]">
            {SKILL_GROUPS.map((group, i) => {
              const on = hovered === i;
              return (
                <Reveal key={group.label} delay={i * 60}>
                  <div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="group py-3.5 transition-colors duration-300 lg:py-3"
                    style={{
                      background: on ? `${group.color}0c` : "transparent",
                    }}
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full transition-transform duration-300"
                        style={{
                          background: group.color,
                          transform: on ? "scale(1.4)" : "scale(1)",
                        }}
                      />
                      <span className="text-sm font-bold text-slate-800">
                        {group.label}
                      </span>
                      <span
                        className="ml-auto font-mono text-[11px] font-semibold"
                        style={{ color: `${group.color}cc` }}
                      >
                        {group.level}
                      </span>
                    </div>

                    <div className="mt-2 ml-5 h-[3px] overflow-hidden rounded-full bg-slate-900/[0.07]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${group.level}%`,
                          background: `linear-gradient(90deg, ${group.color}55, ${group.color})`,
                        }}
                      />
                    </div>

                    <div className="ml-5 mt-2 flex flex-wrap gap-x-2.5 gap-y-1">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="text-[12px] text-slate-600 lg:text-[11px]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="ml-5 mt-1.5 font-mono text-[10px] text-slate-400">
                      proven in{" "}
                      <span style={{ color: `${group.color}dd` }}>
                        {group.proof.join(", ")}
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
