"use client";

import { useEffect, useState } from "react";
import { CONTACT_ITEMS, PROFILE } from "@/lib/data";
import { CopyButton, Reveal, SectionHeader, SpotlightCard } from "./ui";
import { FileIcon, MailIcon, PinIcon } from "./icons";

function LocalTime() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      timeZone: PROFILE.timeZone,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <SpotlightCard className="bg-white/55 p-6">
      <div className="flex items-center gap-2 text-slate-500">
        <PinIcon size={14} />
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          {PROFILE.location}
        </span>
      </div>
      <div className="mt-3 font-mono text-3xl font-bold tabular-nums text-slate-900">
        {now ?? "--:--:--"}
      </div>
      <div className="mt-1 text-xs text-slate-400">my local time (MST)</div>
      <div className="mt-5 flex items-center gap-2 border-t border-slate-900/[0.07] pt-4">
        <span className="relative inline-flex h-2 w-2">
          <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-500/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-sm text-slate-600">Replies within hours</span>
      </div>
    </SpotlightCard>
  );
}

/** Stylized Arizona silhouette with a glowing marker on the Phoenix valley. */
function ArizonaCard() {
  return (
    <SpotlightCard className="bg-white/55 p-6">
      <div className="flex items-center gap-5">
        <svg
          viewBox="0 0 100 122"
          className="h-28 w-auto shrink-0"
          role="img"
          aria-label="Map of Arizona with a marker on Tempe"
        >
          <path
            d="M16 6 H92 V116 H42 L26 102 L26 92 L20 86 L20 70 L14 64 L14 48 L10 42 L10 30 L16 24 Z"
            fill="rgba(2,132,199,0.10)"
            stroke="rgba(2,132,199,0.50)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle
            cx="48"
            cy="64"
            r="10"
            fill="none"
            stroke="rgba(5,150,105,0.40)"
            strokeWidth="1"
          />
          <circle cx="48" cy="64" r="4" fill="#059669">
            <animate
              attributeName="opacity"
              values="1;0.45;1"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Based in
          </div>
          <div className="mt-1 text-xl font-bold text-slate-900">
            Tempe, Arizona
          </div>
          <div className="mt-0.5 text-sm text-slate-500">{PROFILE.metro}</div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-sky-600/30 bg-sky-500/10 px-2.5 py-1 text-[11px] text-sky-700">
            <PinIcon size={11} />
            Local to Phoenix-area teams
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      data-key="contact"
      className="scroll-mt-20 py-20 sm:py-24 lg:flex lg:min-h-[calc(100svh-56px)] lg:items-center lg:py-12"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeader index="05" title="Contact" />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div>
            <Reveal>
              <p className="mb-6 text-lg text-slate-500 sm:mb-8 sm:text-xl">
                Let&rsquo;s connect. I reply fast.
              </p>
            </Reveal>

            <div>
              {CONTACT_ITEMS.map((item, i) => (
                <Reveal key={item.label} delay={i * 80}>
                  <div className="flex items-center justify-between gap-3 border-b border-slate-900/[0.07] py-4 sm:py-5">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {item.label}
                      </div>
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                        className="mt-1 block truncate text-base font-semibold text-slate-700 transition hover:text-slate-900 sm:text-2xl"
                      >
                        {item.value}
                      </a>
                    </div>
                    {"copy" in item && item.copy && (
                      <CopyButton value={item.copy} />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 active:scale-[0.97] sm:px-7"
                >
                  <MailIcon size={15} />
                  Send email
                </a>
                <a
                  href={PROFILE.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-400/40 bg-white/60 px-6 py-3 text-sm text-slate-700 transition hover:bg-slate-900/[0.06] hover:text-slate-900 sm:px-7"
                >
                  <FileIcon size={15} />
                  Download resume
                </a>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-4">
            <Reveal delay={120}>
              <LocalTime />
            </Reveal>
            <Reveal delay={200}>
              <ArizonaCard />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
