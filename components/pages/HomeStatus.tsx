"use client";

import { HOME, schoolProgress } from "@/lib/data";
import { ease, phase, useFigureClock } from "@/lib/figure";
import { CapIcon } from "../icons";
import { useIntroActive, useNow } from "../ui";

const FILL_AT = 250;
const FILL_FOR = 1400;

export function HomeStatus() {
  const now = useNow();
  const mounted = now !== null;
  const introActive = useIntroActive();
  const clock = useFigureClock<HTMLDivElement>({ until: FILL_AT + 700 + FILL_FOR + 100, page: "home", replay: true });
  const { ref, t, reduced } = clock;
  const start = FILL_AT + (introActive && clock.runs <= 1 ? 700 : 0);
  const target = now !== null ? schoolProgress(now) : 0;
  const p = reduced ? target : target * ease(phase(t, start, FILL_FOR));
  const dot = mounted && (reduced || t >= start);
  const percent = `${(p * 100).toFixed(2)}%`;

  return (
    <div
      ref={ref}
      className="glass max-w-[560px] rounded-[22px] px-4 py-3.5 desk:max-w-none desk:px-[clamp(14px,2vh,24px)] desk:py-[clamp(10px,1.8vh,20px)]"
    >
      <div className="flex items-start gap-3 desk:gap-[clamp(10px,1.6vh,18px)]">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-100 text-accent-strong shadow-[inset_0_0_0_1px_rgba(2,132,199,0.15)] desk:h-[clamp(36px,5.4vh,56px)] desk:w-[clamp(36px,5.4vh,56px)]"
          aria-hidden="true"
        >
          <CapIcon size={20} />
        </span>
        <div className="min-w-0">
          <p
            className="text-[16px] font-bold leading-tight text-ink desk:text-[clamp(14px,2.1vh,22px)]"
            style={{ fontStretch: "110%" }}
          >
            {HOME.status.title}
          </p>
          <p className="mt-1 text-[14px] leading-snug text-ink-2 desk:text-[clamp(13px,1.8vh,19px)]">
            {HOME.status.text}
          </p>
        </div>
      </div>
      <div className="mt-2.5 desk:mt-[clamp(6px,1.3vh,16px)]" aria-hidden="true">
        <div className="relative h-[18px]">
          {mounted ? (
            <span
              className="absolute bottom-0 -translate-x-1/2 text-[12px] font-semibold text-accent-strong transition-opacity duration-300 desk:text-[clamp(12px,1.45vh,15px)]"
              style={{ left: `clamp(22px, ${(target * 100).toFixed(2)}%, calc(100% - 22px))`, opacity: dot && p >= target - 0.001 ? 1 : 0 }}
            >
              Today
            </span>
          ) : null}
        </div>
        <div className="relative mt-1 h-[5px] overflow-x-clip rounded-full bg-slate-900/[0.09]">
          <span
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-sky-300 to-accent"
            style={{ transform: `scaleX(${p})` }}
          />
          {mounted ? (
            <span className="absolute inset-0" style={{ transform: `translateX(${percent})` }}>
              <span
                className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(14,165,233,0.2),0_0_14px_4px_rgba(14,165,233,0.45)] transition-opacity duration-300"
                style={{ opacity: dot ? 1 : 0 }}
              />
            </span>
          ) : null}
        </div>
        <div className="mt-1.5 flex justify-between text-[12px] text-muted desk:text-[clamp(12px,1.45vh,15px)]">
          <span>{HOME.status.from}</span>
          <span>{HOME.status.to}</span>
        </div>
      </div>
      <p className="sr-only">
        At Arizona State from {HOME.status.from} to {HOME.status.to}.
      </p>
    </div>
  );
}
