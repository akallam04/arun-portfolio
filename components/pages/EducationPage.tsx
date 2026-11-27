"use client";

import { BEYOND_CLASS, COURSEWORK, EDUCATION, OPENAUTODATA, schoolProgress } from "@/lib/data";
import { ease, phase, useFigureClock } from "@/lib/figure";
import { ArrowRightIcon, CalendarIcon, CapIcon, GitHubIcon, PinIcon, SparkIcon } from "../icons";
import { SpotlightCard, useNow } from "../ui";
import { cn, EXTERNAL } from "@/lib/cn";

const RING_AT = 300;
const RING_FOR = 1500;
const SHINE_AT = 900;
const SHINE_FOR = 900;
const UNTIL = Math.max(RING_AT + RING_FOR, SHINE_AT + SHINE_FOR + 300) + 100;

const CARD = "rounded-[24px] bg-white/55 shadow-[0_14px_40px_rgba(30,80,150,0.10)]";

function Badge({ children, shine }: { children: React.ReactNode; shine: number | null }) {
  return (
    <span className="relative inline-flex overflow-hidden rounded-xl border border-accent/25 bg-white/85 px-3 py-1.5 text-[14px] font-bold text-ink shadow-[0_6px_18px_rgba(30,80,150,0.08)] desk:px-[clamp(10px,1.5vh,16px)] desk:py-[clamp(4px,0.8vh,9px)] desk:text-[clamp(13px,1.85vh,20px)]">
      {children}
      {shine !== null ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{ transform: `translateX(${-120 + 340 * shine}%) skewX(-12deg)`, opacity: shine > 0 && shine < 1 ? 0.9 : 0 }}
        />
      ) : null}
    </span>
  );
}

function Seal({ p }: { p: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative aspect-square w-[132px] shrink-0 desk:w-[clamp(112px,23vh,280px)]">
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <circle cx="60" cy="60" r="57" fill="rgba(255,255,255,0.7)" stroke="rgba(2,132,199,0.22)" strokeWidth="1" />
        <circle cx="60" cy="60" r="53" fill="none" stroke="rgba(2,132,199,0.35)" strokeWidth="1" strokeDasharray="1.5 3.2" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(20,48,74,0.09)" strokeWidth="7" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#seal-grad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${Math.max(p * c, 0.01)} ${c}`}
          transform="rotate(-90 60 60)"
        />
        <defs>
          <linearGradient id="seal-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <CapIcon size={18} className="text-accent-strong" />
        <span
          className="mt-0.5 text-[16px] font-extrabold leading-tight text-ink desk:text-[clamp(14px,2.3vh,26px)]"
          style={{ fontStretch: "110%" }}
        >
          {EDUCATION.graduation}
        </span>
        <span className="text-[12px] font-medium text-muted desk:text-[clamp(12px,1.5vh,16px)]">Graduation</span>
      </div>
    </div>
  );
}

export function EducationPage() {
  const now = useNow();
  const { ref, t, reduced } = useFigureClock<HTMLDivElement>({ until: UNTIL, page: "education", replay: true });
  const target = now !== null ? schoolProgress(now) : 0;
  const ring = reduced ? target : target * ease(phase(t, RING_AT, RING_FOR));
  const shine = (delay: number) => (reduced ? null : phase(t, SHINE_AT + delay, SHINE_FOR));

  return (
    <section id="education" data-page aria-labelledby="education-title" className="page">
      <div className="page-inner gap-4 desk:gap-[clamp(10px,2.2vh,32px)]">
        <h2 id="education-title" className="heading text-[40px] text-ink desk:text-[clamp(40px,7.4vh,104px)]">
          Education
        </h2>
        <div
          ref={ref}
          className="grid gap-4 desk:min-h-0 desk:flex-1 desk:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] desk:grid-rows-[minmax(0,1fr)_auto] desk:gap-[clamp(12px,2.2vh,30px)]"
        >
          <SpotlightCard
            data-tour-target
            className={cn(CARD, "desk:col-start-1 desk:row-start-1")}
            contentClassName="flex h-full flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between desk:gap-[clamp(14px,2.4vh,32px)] desk:p-[clamp(16px,3vh,40px)]"
          >
            <div className="min-w-0">
              <h3
                className="text-[24px] font-extrabold leading-[1.05] text-ink desk:text-[clamp(22px,4vh,52px)]"
                style={{ fontStretch: "114%" }}
              >
                {EDUCATION.school}
              </h3>
              <p className="mt-1.5 text-[17px] font-semibold text-ink-2 desk:mt-[clamp(4px,1vh,12px)] desk:text-[clamp(15px,2.3vh,26px)]">
                {EDUCATION.degree}
              </p>
              <ul className="mt-2 grid gap-1 text-[14px] text-muted desk:mt-[clamp(6px,1.2vh,14px)] desk:gap-[clamp(2px,0.6vh,8px)] desk:text-[clamp(13px,1.8vh,19px)]">
                <li className="flex items-center gap-1.5">
                  <PinIcon size={14} className="shrink-0 text-accent-strong" />
                  {EDUCATION.place}
                </li>
                <li className="flex items-center gap-1.5">
                  <CalendarIcon size={14} className="shrink-0 text-accent-strong" />
                  {EDUCATION.dates}
                </li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-2 desk:mt-[clamp(8px,1.8vh,22px)]">
                <Badge shine={shine(0)}>
                  GPA <span className="ml-1 tabular-nums">{EDUCATION.gpa}</span>
                </Badge>
                <Badge shine={shine(260)}>{EDUCATION.honors}</Badge>
              </div>
            </div>
            <div className="flex justify-center">
              <Seal p={ring} />
              <p className="sr-only">Graduating in {EDUCATION.graduation}.</p>
            </div>
          </SpotlightCard>

          <SpotlightCard
            data-tour-target
            className={cn(CARD, "desk:col-start-2 desk:row-span-2 desk:row-start-1")}
            contentClassName="flex h-full flex-col p-5 desk:justify-center desk:p-[clamp(16px,2.8vh,40px)]"
          >
            <h3 className="text-[15px] font-bold text-ink desk:text-[clamp(14px,2.1vh,24px)]">Coursework</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-3 desk:mt-[clamp(8px,1.8vh,24px)] desk:gap-[clamp(10px,1.6vw,28px)]">
              {COURSEWORK.map((group) => (
                <div key={group.name} className="min-w-0">
                  <h4 className="text-[13px] font-semibold text-accent-strong desk:text-[clamp(12.5px,1.75vh,19px)]">
                    {group.name}
                  </h4>
                  <ul className="mt-1.5 grid gap-1.5 desk:mt-[clamp(4px,1vh,12px)] desk:gap-[clamp(4px,1.1vh,13px)]">
                    {group.courses.map((course) => (
                      <li
                        key={course.name}
                        className="rounded-xl border border-slate-900/[0.09] bg-white/75 px-3 py-2 text-[14px] leading-snug text-ink shadow-[0_4px_14px_rgba(30,80,150,0.05)] desk:px-[clamp(9px,1.5vh,18px)] desk:py-[clamp(5px,1.25vh,15px)] desk:text-[clamp(12.5px,1.95vh,21px)]"
                      >
                        {course.name}

                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard
            className={cn(CARD, "desk:col-start-1 desk:row-start-2")}
            contentClassName="flex h-full flex-col justify-center p-5 desk:p-[clamp(16px,3vh,40px)]"
          >
            <p className="flex items-center gap-2 text-[15px] font-bold text-ink desk:text-[clamp(14px,2.1vh,24px)]">
              <SparkIcon size={16} className="text-accent-strong" />
              {BEYOND_CLASS.title}
            </p>
            <p className="mt-2 text-[15px] leading-snug text-ink-2 desk:mt-[clamp(6px,1.2vh,14px)] desk:text-[clamp(13.5px,2vh,22px)]">
              {BEYOND_CLASS.text}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 desk:mt-[clamp(8px,1.8vh,22px)]">
              <a
                href={`#${OPENAUTODATA.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(2,132,199,0.25)] hover:bg-accent-strong desk:px-[clamp(12px,1.6vh,18px)] desk:py-[clamp(6px,1vh,11px)] desk:text-[clamp(13px,1.75vh,18px)]"
              >
                See the project
                <ArrowRightIcon size={14} />
              </a>
              <a
                href={OPENAUTODATA.code}
                {...EXTERNAL}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-900/[0.10] bg-white/70 px-3.5 py-2 text-[14px] font-semibold text-ink hover:text-accent-strong desk:px-[clamp(12px,1.6vh,18px)] desk:py-[clamp(6px,1vh,11px)] desk:text-[clamp(13px,1.75vh,18px)]"
              >
                <GitHubIcon size={14} className="text-accent-strong" />
                Code
                <span className="sr-only">, OpenAutodata</span>
              </a>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
