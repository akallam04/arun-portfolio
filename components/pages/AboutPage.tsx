"use client";

import { ABOUT } from "@/lib/data";
import { clamp01, ease, phase, useFigureClock } from "@/lib/figure";
import { ArrowRightIcon, PinIcon } from "../icons";
import { SpotlightCard } from "../ui";

const UNTIL = 2600;

function GateIcon({ p }: { p: number }) {
  const angle = -78 + 78 * ease(p);
  const closed = p >= 1;
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      <rect x="7" y="14" width="6" height="26" rx="2" fill="#0284c7" />
      <rect x="38" y="26" width="4" height="14" rx="1.5" fill="rgba(20,48,74,0.28)" />
      <g transform={`rotate(${angle} 10 18)`}>
        <rect x="10" y="15.5" width="31" height="5" rx="2.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1.6" />
        <rect x="17" y="15.5" width="4" height="5" fill="#ef4444" opacity="0.85" />
        <rect x="27" y="15.5" width="4" height="5" fill="#ef4444" opacity="0.85" />
      </g>
      <circle cx="10" cy="18" r="2.6" fill="#ffffff" stroke="#0284c7" strokeWidth="1.4" />
      <circle cx="40" cy="10" r="3" fill={closed ? "#10b981" : "rgba(20,48,74,0.18)"} style={{ transition: "fill 300ms" }} />
    </svg>
  );
}

function StampIcon({ p }: { p: number }) {
  const drop = ease(phase(p, 0, 0.55));
  const scale = 1.35 - 0.35 * drop;
  const check = ease(phase(p, 0.5, 0.5));
  const length = 24;
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      <g transform={`translate(24 24) scale(${scale}) translate(-24 -24)`} opacity={0.25 + 0.75 * drop}>
        <circle cx="24" cy="24" r="17" fill="#ecfdf5" stroke="#10b981" strokeWidth="2.2" />
        <circle cx="24" cy="24" r="13" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2.6" opacity="0.7" />
      </g>
      <path
        d="M16.5 24.5l5 5 10-11"
        fill="none"
        stroke="#047857"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - check)}
      />
    </svg>
  );
}

function BalanceIcon({ p }: { p: number }) {
  const tilt = -14 * ease(p);
  const rad = (tilt * Math.PI) / 180;
  const left = { x: 24 - 15 * Math.cos(rad), y: 16 - 15 * Math.sin(rad) };
  const right = { x: 24 + 15 * Math.cos(rad), y: 16 + 15 * Math.sin(rad) };
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      <path d="M24 17 L18 41 H30 Z" fill="rgba(2,132,199,0.14)" stroke="#0284c7" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="#0369a1" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="24" cy="16" r="2.4" fill="#0369a1" />
      {[left, right].map((end, i) => (
        <g key={i}>
          <line x1={end.x} y1={end.y} x2={end.x} y2={end.y + 8} stroke="rgba(20,48,74,0.45)" strokeWidth="1.2" />
          <path
            d={`M${end.x - 6} ${end.y + 8} H${end.x + 6} Q${end.x} ${end.y + 14} ${end.x - 6} ${end.y + 8} Z`}
            fill={i === 1 ? "#e0f2fe" : "#ffffff"}
            stroke="#0284c7"
            strokeWidth="1.3"
          />
        </g>
      ))}
    </svg>
  );
}

const ICONS = { gate: GateIcon, stamp: StampIcon, balance: BalanceIcon } as const;

export function AboutPage() {
  const { ref, t, reduced } = useFigureClock<HTMLUListElement>({ until: UNTIL, page: "about" });
  return (
    <section id="about" data-page aria-labelledby="about-title" className="page">
      <div className="page-inner gap-4 desk:gap-[clamp(10px,2.2vh,32px)]">
        <h2 id="about-title" className="heading text-[40px] text-ink desk:text-[clamp(40px,7.4vh,104px)]">
          About me
        </h2>
        <div className="flex flex-col gap-6 desk:min-h-0 desk:flex-1 desk:justify-center desk:gap-[clamp(14px,3.4vh,52px)]">
          <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8 desk:gap-[clamp(28px,4vw,80px)]">
            <SpotlightCard
              className="rounded-[24px] bg-white/55 shadow-[0_14px_40px_rgba(30,80,150,0.10)] sm:min-w-[300px] desk:min-w-[clamp(320px,44vh,520px)]"
              contentClassName="p-5 desk:p-[clamp(16px,2.8vh,34px)]"
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-full bg-sky-100 text-[16px] font-extrabold tracking-[0.02em] text-accent-strong shadow-[inset_0_0_0_1px_rgba(2,132,199,0.18)] desk:h-[clamp(42px,6.4vh,68px)] desk:w-[clamp(42px,6.4vh,68px)] desk:text-[clamp(15px,2.2vh,24px)]"
                style={{ fontStretch: "112%" }}
                aria-hidden="true"
              >
                {ABOUT.card.monogram}
              </span>
              <p className="mt-3 text-[24px] font-semibold leading-tight text-ink desk:mt-[clamp(10px,1.8vh,22px)] desk:text-[clamp(22px,3.55vh,38px)]">
                {ABOUT.card.name}
              </p>
              <p className="mt-1 text-[16px] text-ink-2 desk:mt-[clamp(3px,0.7vh,8px)] desk:text-[clamp(14px,2.1vh,23px)]">
                {ABOUT.card.goesBy}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[15px] text-muted desk:mt-[clamp(6px,1.2vh,14px)] desk:text-[clamp(13px,1.9vh,21px)]">
                <PinIcon size={15} className="shrink-0 text-accent-strong" />
                {ABOUT.card.place}
              </p>
            </SpotlightCard>
            <p className="max-w-[60ch] text-[18px] leading-relaxed text-ink-2 desk:text-[clamp(16px,2.5vh,27px)]">
              {ABOUT.body}
            </p>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-accent-strong desk:text-[clamp(14px,2vh,22px)]">How I work</h3>
            <ul
              ref={ref}
              data-tour-target
              className="mt-3 grid gap-3 rounded-[24px] sm:grid-cols-3 desk:mt-[clamp(8px,1.5vh,20px)] desk:gap-[clamp(12px,2vh,28px)]"
            >
              {ABOUT.ways.map((way, i) => {
                const Icon = ICONS[way.icon];
                const p = reduced ? 1 : clamp01(phase(t, 250 + i * 450, 1300));
                return (
                  <li key={way.title}>
                    <SpotlightCard
                      className="h-full rounded-[22px] bg-white/55 shadow-[0_14px_40px_rgba(30,80,150,0.10)]"
                      contentClassName="flex h-full flex-col p-4 desk:p-[clamp(14px,2.6vh,34px)]"
                    >
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 p-1.5 shadow-[inset_0_0_0_1px_rgba(2,132,199,0.14)] desk:h-[clamp(40px,6.6vh,76px)] desk:w-[clamp(40px,6.6vh,76px)]">
                        <Icon p={p} />
                      </span>
                      <p
                        className="mt-3 text-[18px] font-extrabold leading-tight text-ink desk:mt-[clamp(8px,1.6vh,20px)] desk:text-[clamp(16px,2.5vh,30px)]"
                        style={{ fontStretch: "112%" }}
                      >
                        {way.title}
                      </p>
                      <p className="mt-1.5 flex-1 text-[15px] leading-snug text-ink-2 desk:mt-[clamp(4px,1vh,12px)] desk:text-[clamp(13px,1.9vh,21px)]">
                        {way.text}
                      </p>
                      <a
                        href={way.link.href}
                        className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg text-[14px] font-semibold text-accent-strong hover:text-ink desk:mt-[clamp(8px,1.5vh,18px)] desk:text-[clamp(13px,1.8vh,19px)]"
                      >
                        {way.link.label}
                        <ArrowRightIcon size={14} />
                      </a>
                    </SpotlightCard>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
