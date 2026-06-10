"use client";

import {
  CORE_STACK,
  HERO_STATS,
  PROFILE,
  TYPED_ROLES,
} from "@/lib/data";
import { scrollToSection, useTypewriter } from "@/lib/hooks";
import { CountUp, Reveal } from "./ui";
import {
  FileIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  PinIcon,
} from "./icons";

function AvailabilityBadge() {
  return (
    <div className="group inline-flex w-fit cursor-default items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-2 text-xs text-emerald-300 transition-all duration-300 hover:border-emerald-400/45 hover:shadow-[0_0_24px_rgba(52,211,153,0.18)] sm:text-sm">
      <span className="relative inline-flex h-2 w-2">
        <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {PROFILE.availability}
    </div>
  );
}

export function Hero() {
  const typed = useTypewriter(TYPED_ROLES);

  return (
    <section
      id="home"
      data-key="home"
      className="relative flex min-h-[calc(100svh-56px)] scroll-mt-14 items-center"
    >
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Text block first on mobile so the pitch is above the fold */}
          <div className="flex flex-col gap-6 sm:gap-7">
            <Reveal>
              <AvailabilityBadge />
            </Reveal>

            <Reveal delay={80}>
              <h1 className="text-[clamp(38px,9vw,72px)] font-bold leading-[1.04] tracking-tight">
                <span className="block text-white">{PROFILE.shortName}</span>
                <span className="gradient-name block">{PROFILE.lastName}</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-lg leading-relaxed text-white/70 sm:text-2xl">
                CS student at ASU. I build{" "}
                <span className="font-semibold text-white">
                  {typed}
                  <span className="caret" aria-hidden="true" />
                </span>
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div>
                <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  Core Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {CORE_STACK.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg border border-white/[0.09] bg-white/[0.04] px-2.5 py-1 text-xs text-white/60 transition hover:border-white/20 hover:text-white/85 sm:px-3 sm:py-1.5 sm:text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.97] sm:px-6"
                >
                  <MailIcon size={15} />
                  Email me
                </a>
                <a
                  href={PROFILE.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm text-white/65 transition hover:border-white/25 hover:bg-white/[0.09] hover:text-white sm:px-5"
                >
                  <FileIcon size={15} />
                  Resume
                </a>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-white/65 transition hover:border-white/25 hover:bg-white/[0.09] hover:text-white"
                >
                  <GitHubIcon size={17} />
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-white/65 transition hover:border-white/25 hover:bg-white/[0.09] hover:text-white"
                >
                  <LinkedInIcon size={17} />
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <p className="hidden items-center gap-2 text-xs text-white/30 lg:flex">
                Press
                <kbd className="rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-white/50">
                  ⌘K
                </kbd>
                to navigate anywhere
              </p>
            </Reveal>
          </div>

          {/* Photo with floating badges */}
          <Reveal delay={200} className="mx-auto w-full max-w-xs sm:max-w-sm">
            <div className="relative">
              <div className="absolute -inset-px rounded-[26px] bg-gradient-to-br from-blue-500/40 via-transparent to-purple-500/40" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avatar.jpg"
                  alt={PROFILE.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070c]/45 via-transparent to-transparent" />
              </div>

              <div className="float-slow absolute -right-3 top-6 rounded-xl border border-white/[0.12] bg-[#0a0d14]/90 px-3.5 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:-right-6">
                <div className="text-sm font-bold text-white">ASU &rsquo;27</div>
                <div className="text-[10px] text-white/45">B.S. Computer Science</div>
              </div>

              <div className="float-slower absolute -left-3 bottom-8 rounded-xl border border-blue-400/25 bg-[#0a0d14]/90 px-3.5 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:-left-6">
                <div className="flex items-center gap-1.5 text-sm font-bold text-blue-300">
                  <PinIcon size={13} />
                  {PROFILE.location}
                </div>
                <div className="text-[10px] text-white/45">{PROFILE.metro}</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats strip */}
        <Reveal delay={120}>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:mt-16 lg:grid-cols-4">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-1 bg-[#070a11]/90 px-5 py-4 sm:px-6 sm:py-5"
              >
                <CountUp
                  value={s.value}
                  decimals={s.decimals}
                  suffix={s.suffix}
                  className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
                />
                <span className="text-xs text-white/40">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <button
        onClick={() => scrollToSection("education")}
        aria-label="Scroll to education"
        className="scroll-cue absolute bottom-20 left-1/2 hidden -translate-x-1/2 text-white/30 transition hover:text-white/70 lg:block"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 4v16m0 0-6-6m6 6 6-6" />
        </svg>
      </button>
    </section>
  );
}
