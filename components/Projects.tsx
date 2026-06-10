"use client";

import React, { useRef } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import { Chip, Reveal, SectionHeader, cn } from "./ui";
import { ExternalIcon, GitHubIcon } from "./icons";
import { GitHubPanel } from "./GitHubPanel";

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
          Live app
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
  const featured = PROJECTS.find((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      data-key="projects"
      className="scroll-mt-20 py-20 sm:py-24 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeader index="04" title="Projects" />

        <div className="space-y-4 sm:space-y-5">
          {featured && (
            <Reveal>
              <FeaturedProject project={featured} />
            </Reveal>
          )}
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.name} delay={i * 100} className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
          <GitHubPanel />
        </div>
      </div>
    </section>
  );
}
