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
    <SpotlightCard className="bg-white/[0.03] p-6">
      <div className="flex items-center gap-2 text-white/40">
        <PinIcon size={14} />
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          {PROFILE.location}
        </span>
      </div>
      <div className="mt-3 font-mono text-3xl font-bold tabular-nums text-white">
        {now ?? "--:--:--"}
      </div>
      <div className="mt-1 text-xs text-white/35">my local time (MST)</div>
      <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4">
        <span className="relative inline-flex h-2 w-2">
          <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-sm text-white/55">
          Usually responds within a day
        </span>
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
              <p className="mb-6 text-lg text-white/45 sm:mb-8 sm:text-xl">
                Let&rsquo;s connect — I respond quickly.
              </p>
            </Reveal>

            <div>
              {CONTACT_ITEMS.map((item, i) => (
                <Reveal key={item.label} delay={i * 80}>
                  <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-4 sm:py-5">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                        {item.label}
                      </div>
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                        className="mt-1 block truncate text-base font-semibold text-white/75 transition hover:text-white sm:text-2xl"
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
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.97] sm:px-7"
                >
                  <MailIcon size={15} />
                  Send email
                </a>
                <a
                  href={PROFILE.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-6 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white sm:px-7"
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
              <SpotlightCard className="bg-white/[0.03] p-6">
                <div className="mb-3 text-3xl leading-none text-white/15">&ldquo;</div>
                <p className="text-base leading-relaxed text-white/50">
                  Building clean products that work reliably and look great
                  doing it.
                </p>
                <div className="mt-4 text-sm font-semibold text-white/35">
                  — {PROFILE.firstName}
                </div>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
