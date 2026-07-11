"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  PROJECTS,
  PROJECT_FILTERS,
  type Project,
  type ProjectDomain,
} from "@/lib/data";
import { Chip, Reveal, SectionHeader, cn } from "./ui";
import { ExternalIcon, GitHubIcon } from "./icons";
import { GitHubPanel } from "./GitHubPanel";

type FilterKey = ProjectDomain | "all";

/** 3D tilt wrapper for desktop pointers only, capped at ~5deg. */
function TiltCard({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 5}deg) rotateX(${
      -py * 5
    }deg) translateY(-2px)`;
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "tilt-card spotlight-card relative overflow-hidden rounded-2xl border border-white/[0.08] backdrop-blur-xl",
        className
      )}
      style={style}
    >
      <div className="spotlight-glow pointer-events-none absolute inset-0" />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-auto flex items-center gap-2 pt-4">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-500/[0.15]"
        >
          <ExternalIcon size={12} />
          {project.liveLabel ?? "Live app"}
        </a>
      )}
      <a
        href={project.github}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.10] px-3 py-1.5 text-xs text-white/45 transition hover:border-white/25 hover:text-white/80"
      >
        <GitHubIcon size={12} />
        Code
      </a>
    </div>
  );
}

/** Labeled comparison bars, e.g. the CEFR benchmark result. */
function CompareBars({ project }: { project: Project }) {
  if (!project.compare) return null;
  return (
    <div className="mt-3 space-y-2 rounded-xl border border-white/[0.07] bg-[#070a11]/60 p-3">
      {project.compare.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span
              className={cn(
                "text-[11px]",
                row.highlight ? "font-semibold text-white/85" : "text-white/45"
              )}
            >
              {row.label}
            </span>
            <span
              className="font-mono text-[11px] font-semibold"
              style={{
                color: row.highlight ? project.color : "rgba(255,255,255,0.4)",
              }}
            >
              {row.value}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${row.value}%`,
                background: row.highlight
                  ? `linear-gradient(90deg, ${project.color}66, ${project.color})`
                  : "rgba(255,255,255,0.22)",
              }}
            />
          </div>
        </div>
      ))}
      {project.compareCaption && (
        <p className="pt-0.5 text-[10px] leading-snug text-white/30">
          {project.compareCaption}
        </p>
      )}
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <TiltCard
      className="p-6 sm:p-8"
      style={{ background: `${project.color}0e` }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span
          className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{
            borderColor: `${project.color}55`,
            color: project.color,
            background: `${project.color}14`,
          }}
        >
          Featured
        </span>
        <h3 className="text-xl font-bold text-white sm:text-2xl">
          {project.name}
        </h3>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm leading-relaxed text-white/55 sm:text-base">
            {project.desc}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {project.bullets.map((b, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm leading-relaxed text-white/55"
              >
                <span
                  className="mt-[8px] h-1 w-1 shrink-0 rounded-full"
                  style={{ background: project.color }}
                />
                {b}
              </li>
            ))}
          </ul>
          <ProjectLinks project={project} />
        </div>

        {project.metrics && (
          <div className="grid content-center gap-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-white/[0.08] bg-[#070a11]/70 px-4 py-3"
              >
                <div
                  className="text-lg font-bold"
                  style={{ color: project.color }}
                >
                  {m.value}
                </div>
                <div className="text-xs text-white/40">{m.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </TiltCard>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard
      className="h-full p-5 sm:p-6"
      style={{ background: `${project.color}0c` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: project.color }}
        />
        <h3 className="text-base font-bold text-white/90">{project.name}</h3>
      </div>
      <p className="text-sm leading-relaxed text-white/50">{project.desc}</p>
      <CompareBars project={project} />
      <div className="mt-3 flex flex-wrap gap-1">
        {project.tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {project.bullets.map((b, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-[13px] leading-relaxed text-white/45"
          >
            <span
              className="mt-[8px] h-1 w-1 shrink-0 rounded-full"
              style={{ background: `${project.color}aa` }}
            />
            {b}
          </li>
        ))}
      </ul>
      <ProjectLinks project={project} />
    </TiltCard>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: PROJECTS.length,
      ai: 0,
      fullstack: 0,
      data: 0,
    };
    for (const p of PROJECTS)
      for (const d of p.domains) c[d] += 1;
    return c;
  }, []);

  const visible = useMemo(
    () =>
      filter === "all"
        ? PROJECTS
        : PROJECTS.filter((p) => p.domains.includes(filter)),
    [filter]
  );

  const featured = visible.find((p) => p.featured);
  const rest = visible.filter((p) => !p.featured);
  const liveCount = PROJECTS.filter(
    (p) => p.live && !p.liveLabel
  ).length;

  return (
    <section
      id="projects"
      data-key="projects"
      className="scroll-mt-20 py-20 sm:py-24 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeader index="04" title="Projects" />

        {/* Domain filter */}
        <Reveal>
          <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8">
            {PROJECT_FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all",
                    active
                      ? "border-white bg-white font-semibold text-black"
                      : "border-white/12 bg-white/[0.03] text-white/50 hover:border-white/30 hover:text-white/85"
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "font-mono text-[10px]",
                      active ? "text-black/50" : "text-white/30"
                    )}
                  >
                    {counts[f.key]}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto hidden text-xs text-white/30 sm:block">
              {PROJECTS.length} projects · {liveCount} live demos · 1 published
              model
            </span>
          </div>
        </Reveal>

        {/* Re-mounts on filter change so cards animate back in */}
        <div key={filter} className="space-y-4 sm:space-y-5">
          {featured && (
            <Reveal>
              <FeaturedProject project={featured} />
            </Reveal>
          )}
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.name} delay={i * 80} className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>

        <GitHubPanel />
      </div>
    </section>
  );
}
