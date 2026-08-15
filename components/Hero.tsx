"use client";

import {
  CORE_STACK,
  HERO_STATS,
  PROFILE,
  TYPED_ROLES,
} from "@/lib/data";
import React, { useRef } from "react";
import { scrollToSection, useTypewriter } from "@/lib/hooks";
import { CountUp, Reveal } from "./ui";
import { Magnetic } from "./Magnetic";
import {
  FileIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  PinIcon,
} from "./icons";

function AvailabilityBadge() {
  return (
    <div className="group inline-flex w-fit cursor-default items-center gap-2.5 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-700 transition-all duration-300 hover:border-emerald-600/50 hover:shadow-[0_0_24px_rgba(52,211,153,0.18)] sm:text-sm">
      <span className="relative inline-flex h-2 w-2">
        <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-500/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      {PROFILE.availability}
    </div>
  );
}

export function Hero() {
  const typed = useTypewriter(TYPED_ROLES);
  const photoRef = useRef<HTMLDivElement>(null);

  const onPhotoMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const el = photoRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${(px * 8).toFixed(2)}deg) rotateX(${(-py * 8).toFixed(2)}deg)`;
    el.style.setProperty("--bx", `${(px * -12).toFixed(1)}px`);
    el.style.setProperty("--by", `${(py * -12).toFixed(1)}px`);
  };
  const onPhotoLeave = () => {
    const el = photoRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--bx", "0px");
    el.style.setProperty("--by", "0px");
  };

  return (
    <section
      id="home"
      data-key="home"
      className="relative flex min-h-[calc(100svh-56px)] scroll-mt-14 items-center"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 lg:pb-8 lg:pt-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* Text block first on mobile so the pitch is above the fold */}
          <div className="flex flex-col gap-6 sm:gap-7 lg:gap-5">
            <Reveal>
              <AvailabilityBadge />
            </Reveal>

            <h1 className="text-[clamp(38px,9vw,72px)] font-bold leading-[1.04] tracking-tight lg:text-[clamp(38px,5vw,70px)]">
              <span className="block text-slate-900" aria-label={PROFILE.shortName}>
                {PROFILE.shortName.split("").map((ch, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="letter-rise"
                    style={{ animationDelay: `${0.25 + i * 0.035}s` }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </span>
                ))}
              </span>
              <span className="block">
                <span
                  className="gradient-name letter-rise"
                  style={{
                    animationDelay: `${0.25 + PROFILE.shortName.length * 0.035 + 0.1}s`,
                  }}
                >
                  {PROFILE.lastName}
                </span>
              </span>
            </h1>

            <Reveal delay={160}>
              <p className="text-lg leading-relaxed text-slate-700 sm:text-2xl">
                CS student at ASU. I build{" "}
                <span className="font-semibold text-slate-900">
                  {typed}
                  <span className="caret" aria-hidden="true" />
                </span>
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div>
                <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Core Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {CORE_STACK.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg border border-slate-400/30 bg-white/60 px-2.5 py-1 text-xs text-slate-600 transition hover:border-sky-500/40 hover:text-slate-800 sm:px-3 sm:py-1.5 sm:text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="flex flex-wrap items-center gap-2.5">
                <Magnetic>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(2,132,199,0.35)] transition hover:bg-sky-500 active:scale-[0.97] sm:px-6"
                  >
                    <MailIcon size={15} />
                    Email me
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={PROFILE.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-400/40 bg-white/60 px-4 py-2.5 text-sm text-slate-600 transition hover:border-sky-500/50 hover:bg-slate-900/[0.05] hover:text-slate-900 sm:px-5"
                  >
                    <FileIcon size={15} />
                    Resume
                  </a>
                </Magnetic>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-400/40 bg-white/60 text-slate-600 transition hover:border-sky-500/50 hover:bg-slate-900/[0.05] hover:text-slate-900"
                >
                  <GitHubIcon size={17} />
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-400/40 bg-white/60 text-slate-600 transition hover:border-sky-500/50 hover:bg-slate-900/[0.05] hover:text-slate-900"
                >
                  <LinkedInIcon size={17} />
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <p className="hidden items-center gap-2 text-xs text-slate-400 lg:flex">
                Press
                <kbd className="rounded border border-slate-400/40 bg-white/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                  ⌘K
                </kbd>
                to navigate anywhere
              </p>
            </Reveal>
          </div>

          {/* Photo with floating badges */}
          <Reveal
            delay={200}
            className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-[365px]"
          >
            <div
              ref={photoRef}
              onMouseMove={onPhotoMove}
              onMouseLeave={onPhotoLeave}
              className="relative"
              style={{
                transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute -inset-[2px] overflow-hidden rounded-[26px]">
                <div
                  className="conic-spin absolute left-1/2 top-1/2 h-[190%] w-[190%]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(14,165,233,0), rgba(14,165,233,0.95), rgba(34,211,238,0.8), rgba(37,99,235,0.95), rgba(14,165,233,0))",
                  }}
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/80 shadow-[0_24px_60px_rgba(30,80,150,0.25)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/arun-profile.jpeg"
                  alt={PROFILE.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950/20 via-transparent to-transparent" />
              </div>

              <div
                className="absolute -right-3 top-6 sm:-right-6"
                style={{
                  transform: "translate(var(--bx, 0px), var(--by, 0px))",
                  transition: "transform 250ms ease-out",
                }}
              >
              <div className="float-slow rounded-xl border border-slate-900/[0.12] bg-white/80 px-3.5 py-2 shadow-[0_10px_28px_rgba(30,80,150,0.18)] backdrop-blur-xl">
                <div className="text-sm font-bold text-slate-900">ASU &rsquo;27</div>
                <div className="text-[10px] text-slate-500">B.S. Computer Science</div>
              </div>
              </div>

              <div
                className="absolute -left-3 bottom-8 sm:-left-6"
                style={{
                  transform: "translate(calc(var(--bx, 0px) * -1), calc(var(--by, 0px) * -1))",
                  transition: "transform 250ms ease-out",
                }}
              >
              <div className="float-slower rounded-xl border border-sky-600/30 bg-white/80 px-3.5 py-2 shadow-[0_10px_28px_rgba(30,80,150,0.18)] backdrop-blur-xl">
                <div className="flex items-center gap-1.5 text-sm font-bold text-sky-700">
                  <PinIcon size={13} />
                  {PROFILE.location}
                </div>
                <div className="text-[10px] text-slate-500">{PROFILE.metro}</div>
              </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats strip */}
        <Reveal delay={120}>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-900/[0.10] bg-slate-900/10 sm:mt-16 lg:mt-8 lg:grid-cols-4">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-1 bg-white/75 px-5 py-4 sm:px-6 sm:py-5 lg:py-4"
              >
                <CountUp
                  value={s.value}
                  decimals={s.decimals}
                  suffix={s.suffix}
                  className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
                />
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <button
        onClick={() => scrollToSection("education")}
        aria-label="Scroll to education"
        className="scroll-cue absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-slate-400 transition hover:text-slate-700 lg:block"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 4v16m0 0-6-6m6 6 6-6" />
        </svg>
      </button>
    </section>
  );
}
