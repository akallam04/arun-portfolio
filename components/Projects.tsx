"use client";

import React, { useEffect, useRef, useState } from "react";
import { DOMAIN_LABELS, PROJECTS, type Project } from "@/lib/data";
import { Chip, Reveal, SectionHeader, SpotlightCard, cn } from "./ui";
import { ExternalIcon, GitHubIcon } from "./icons";
import { GitHubPanel } from "./GitHubPanel";

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-5 flex items-center gap-2">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-medium text-emerald-700 transition hover:border-emerald-600/50 hover:bg-emerald-500/15"
        >
          <ExternalIcon size={12} />
          {project.liveLabel ?? "Live app"}
        </a>
      )}
      <a
        href={project.github}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900/[0.10] px-3.5 py-2 text-xs text-slate-500 transition hover:border-sky-500/50 hover:text-slate-800"
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
    <div className="space-y-2 rounded-xl border border-slate-900/[0.08] bg-white/70 p-3.5">
      {project.compare.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span
              className={cn(
                "text-[11px]",
                row.highlight ? "font-semibold text-slate-800" : "text-slate-500"
              )}
            >
              {row.label}
            </span>
            <span
              className="font-mono text-[11px] font-semibold"
              style={{
                color: row.highlight ? project.color : "rgba(71,85,105,0.8)",
              }}
            >
              {row.value}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-900/[0.08]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${row.value}%`,
                background: row.highlight
                  ? `linear-gradient(90deg, ${project.color}66, ${project.color})`
                  : "rgba(15,42,67,0.25)",
              }}
            />
          </div>
        </div>
      ))}
      {project.compareCaption && (
        <p className="pt-0.5 text-[10px] leading-snug text-slate-400">
          {project.compareCaption}
        </p>
      )}
    </div>
  );
}

/**
 * Full-width case-study placard. Every project gets the same treatment:
 * big index, domain badges, story column, and a metrics aside that
 * alternates sides on desktop.
 */
function Placard({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  return (
    <SpotlightCard
      blur={false}
      className="p-6 shadow-[0_14px_40px_rgba(30,80,150,0.10)] sm:p-8"
      style={{
        background: `linear-gradient(150deg, ${project.color}14 0%, rgba(255,255,255,0) 55%), rgba(250,253,255,0.9)`,
        borderColor: `${project.color}30`,
      }}
    >
      {/* Header row */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span
          className="font-mono text-2xl font-bold sm:text-3xl"
          style={{ color: `${project.color}cc` }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {project.name}
        </h3>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {project.domains.map((d) => (
            <span
              key={d}
              className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{
                borderColor: `${project.color}40`,
                color: `${project.color}dd`,
                background: `${project.color}12`,
              }}
            >
              {DOMAIN_LABELS[d]}
            </span>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-6 lg:gap-10",
          flip
            ? "lg:grid-cols-[0.72fr_1.28fr]"
            : "lg:grid-cols-[1.28fr_0.72fr]"
        )}
      >
        {/* Story column */}
        <div className={cn(flip && "lg:order-last")}>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {project.desc}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <Chip key={t} compact>
                {t}
              </Chip>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {project.bullets.map((b, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm leading-relaxed text-slate-600"
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

        {/* Metrics aside */}
        <div className="flex flex-col justify-center gap-3">
          <CompareBars project={project} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-slate-900/[0.10] bg-white/70 px-4 py-3"
              >
                <div
                  className="text-lg font-bold"
                  style={{ color: project.color }}
                >
                  {m.value}
                </div>
                <div className="text-xs text-slate-500">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

export function Projects() {
  const liveCount = PROJECTS.filter((p) => p.live && !p.liveLabel).length;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Track which placard owns the viewport so the index rail can follow.
  // Observer-driven: no scroll handler, no per-frame layout reads.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(
      list.querySelectorAll<HTMLElement>("[data-project-index]")
    );
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number(
              (e.target as HTMLElement).dataset.projectIndex ?? 0
            );
            setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  const jumpTo = (i: number) => {
    document
      .getElementById(`project-${i}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="projects"
      data-key="projects"
      className="scroll-mt-20 py-20 sm:py-24 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeader index="04" title="Projects" />

        <Reveal>
          <p className="mb-6 text-sm text-slate-400 sm:mb-8">
            {PROJECTS.length} case studies, every one shipped ·{" "}
            {liveCount} live demos · 1 published model.
          </p>
        </Reveal>

        <div className="lg:grid lg:grid-cols-[56px_1fr] lg:gap-8">
          {/* Index rail: sticky, tiny, and the only sticky thing here */}
          <nav
            aria-label="Project index"
            className="hidden lg:block"
          >
            <div className="sticky top-24 flex flex-col gap-1">
              {PROJECTS.map((p, i) => {
                const on = active === i;
                return (
                  <button
                    key={p.name}
                    onClick={() => jumpTo(i)}
                    aria-label={p.name}
                    aria-current={on ? "true" : undefined}
                    className="group flex items-center gap-2 py-1.5 text-left"
                  >
                    <span
                      className="h-px transition-all duration-300"
                      style={{
                        width: on ? 20 : 10,
                        background: on ? p.color : "rgba(15,42,67,0.25)",
                      }}
                    />
                    <span
                      className="font-mono text-[11px] font-semibold transition-colors duration-300"
                      style={{
                        color: on ? p.color : "rgba(15,42,67,0.35)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div ref={listRef} className="space-y-5 sm:space-y-6">
            {PROJECTS.map((p, i) => (
              <div
                key={p.name}
                id={`project-${i}`}
                data-project-index={i}
                className="scroll-mt-24"
              >
                <Reveal>
                  <Placard project={p} index={i} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <GitHubPanel />
        </div>
      </div>
    </section>
  );
}
