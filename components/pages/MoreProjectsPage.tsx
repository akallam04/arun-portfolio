import { MORE_PROJECTS, OPENAUTODATA } from "@/lib/data";
import { AutodataLoop } from "../figures/AutodataLoop";
import { GitHubIcon, PlayCircleIcon, SparkIcon } from "../icons";
import { Chip, SpotlightCard, TimeAgo } from "../ui";
import { cn, EXTERNAL } from "@/lib/cn";

const LINK =
  "inline-flex items-center gap-1.5 rounded-xl border border-slate-900/[0.10] bg-white/65 px-2.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:border-accent/40 hover:text-accent-strong desk:px-[clamp(9px,1.3vh,14px)] desk:py-[clamp(4px,0.75vh,9px)] desk:text-[clamp(12.5px,1.6vh,16px)]";

const CARD = "h-full rounded-[22px] bg-white/55 shadow-[0_14px_40px_rgba(30,80,150,0.10)]";

function Links({
  name,
  code,
  live,
  updated,
}: {
  name: string;
  code: string;
  live?: { label: string; href: string };
  updated?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {live ? (
        <a href={live.href} {...EXTERNAL} className={LINK}>
          <PlayCircleIcon size={14} className="text-accent-strong" />
          {live.label}
          <span className="sr-only">, {name}</span>
        </a>
      ) : null}
      <a href={code} {...EXTERNAL} className={LINK}>
        <GitHubIcon size={14} className="text-accent-strong" />
        Code
        <span className="sr-only">, {name}</span>
      </a>
      {updated ? (
        <span className="ml-auto text-[13px] text-muted desk:text-[clamp(12px,1.5vh,15px)]">
          <TimeAgo iso={updated} prefix="Updated " />
        </span>
      ) : null}
    </div>
  );
}

export function MoreProjectsPage({
  pushed,
  external,
}: {
  pushed: Record<string, string>;
  external: Record<string, string>;
}) {
  const [cefr, ...rest] = MORE_PROJECTS;
  return (
    <section id="more-projects" data-page aria-labelledby="more-projects-title" className="page">
      <div className="page-inner gap-4 desk:gap-[clamp(10px,2.2vh,32px)]">
        <h2 id="more-projects-title" className="heading text-[40px] text-ink desk:text-[clamp(40px,7.4vh,104px)]">
          More projects
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 desk:min-h-0 desk:flex-1 desk:grid-cols-12 desk:grid-rows-[minmax(0,1.35fr)_minmax(0,1fr)] desk:gap-[clamp(10px,1.9vh,26px)]">
          <li id={OPENAUTODATA.id} className="min-h-0 sm:col-span-2 desk:col-span-8">
            <SpotlightCard
              data-tour-target
              className={CARD}
              contentClassName="grid h-full gap-4 p-5 desk:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] desk:grid-rows-[minmax(0,1fr)_auto] desk:gap-x-[clamp(14px,2.2vw,40px)] desk:gap-y-[clamp(6px,1.2vh,16px)] desk:p-[clamp(12px,2.2vh,30px)]"
            >
              <div className="min-w-0 desk:self-center">
                <p className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-sky-50/80 px-2 py-0.5 text-[12.5px] font-semibold text-accent-strong desk:text-[clamp(12px,1.5vh,16px)]">
                  <SparkIcon size={13} />
                  {OPENAUTODATA.badge}
                </p>
                <h3
                  className="mt-2 text-[26px] font-extrabold leading-tight tracking-[-0.01em] text-ink desk:mt-[clamp(3px,0.9vh,12px)] desk:text-[clamp(21px,4vh,54px)]"
                  style={{ fontStretch: "114%" }}
                >
                  {OPENAUTODATA.name}
                </h3>
                <p className="mt-1 text-[16px] font-semibold leading-snug text-ink desk:text-[clamp(13.5px,2vh,23px)]">
                  {OPENAUTODATA.tagline}
                </p>
                <p className="mt-1.5 text-[14.5px] leading-snug text-ink-2 desk:mt-[clamp(3px,0.7vh,10px)] desk:text-[clamp(12.5px,1.72vh,19px)]">
                  {OPENAUTODATA.line}
                </p>
                <p className="mt-1.5 text-[13px] leading-snug text-muted desk:mt-[clamp(3px,0.7vh,10px)] desk:text-[clamp(12px,1.55vh,17px)]">
                  {OPENAUTODATA.team} {OPENAUTODATA.part}
                </p>
              </div>
              <div className="glass-soft flex min-w-0 flex-col justify-center-safe rounded-[18px] p-3 desk:p-[clamp(7px,1.4vh,20px)]">
                <p className="mb-1.5 text-[12.5px] font-semibold text-ink desk:mb-[clamp(2px,0.8vh,10px)] desk:text-[clamp(12px,1.55vh,17px)]">
                  One question through the loop
                </p>
                <AutodataLoop />
              </div>
              <div className="flex flex-wrap items-center gap-2 desk:col-span-2">
                <ul className="flex flex-wrap gap-1.5" aria-label={`${OPENAUTODATA.name} is built with`}>
                  {OPENAUTODATA.tech.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
                <div className="min-w-[12rem] flex-1">
                  <Links
                    name={OPENAUTODATA.name}
                    code={OPENAUTODATA.code}
                    live={OPENAUTODATA.live}
                    updated={external[OPENAUTODATA.repo]}
                  />
                </div>
              </div>
            </SpotlightCard>
          </li>

          <li id={cefr.id} className="min-h-0 sm:col-span-2 desk:col-span-4">
            <SpotlightCard
              className={CARD}
              contentClassName="flex h-full flex-col justify-between gap-4 p-5 desk:gap-[clamp(10px,1.8vh,24px)] desk:p-[clamp(14px,2.6vh,34px)]"
            >
              <div>
                <h3
                  className="text-[24px] font-extrabold leading-tight tracking-[-0.01em] text-ink desk:text-[clamp(20px,3.6vh,46px)]"
                  style={{ fontStretch: "114%" }}
                >
                  {cefr.name}
                </h3>
                <p className="mt-2 max-w-[40ch] text-[16px] leading-snug text-ink-2 desk:text-[clamp(14px,2.2vh,25px)]">
                  {cefr.line}
                </p>
              </div>
              <div className="flex flex-col gap-2.5 desk:gap-[clamp(6px,1.2vh,14px)]">
                <ul className="flex flex-wrap gap-1.5" aria-label={`${cefr.name} is built with`}>
                  {cefr.tech.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
                <Links name={cefr.name} code={cefr.code} live={cefr.live} updated={pushed[cefr.repo]} />
              </div>
            </SpotlightCard>
          </li>

          {rest.map((project) => (
            <li key={project.id} id={project.id} className="min-h-0 desk:col-span-3">
              <SpotlightCard
                className={CARD}
                contentClassName="flex h-full flex-col justify-between gap-3 p-4 desk:gap-[clamp(6px,1.3vh,18px)] desk:p-[clamp(12px,2.1vh,28px)]"
              >
                <div>
                  <h3
                    className="text-[19px] font-extrabold leading-tight text-ink desk:text-[clamp(15px,2.35vh,30px)]"
                    style={{ fontStretch: "112%" }}
                  >
                    {project.name}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] leading-snug text-ink-2 desk:mt-[clamp(3px,0.8vh,10px)] desk:text-[clamp(12.5px,1.7vh,18px)]">
                    {project.line}
                  </p>
                </div>
                <div className="flex flex-col gap-2 desk:gap-[clamp(5px,0.9vh,12px)]">
                  <ul className={cn("flex flex-wrap gap-1.5")} aria-label={`${project.name} is built with`}>
                    {project.tech.map((item) => (
                      <li key={item}>
                        <Chip>{item}</Chip>
                      </li>
                    ))}
                  </ul>
                  <Links name={project.name} code={project.code} live={project.live} updated={pushed[project.repo]} />
                </div>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
