"use client";

import { useEffect, useRef } from "react";
import type { GitHubData } from "@/lib/github";
import { LANGUAGE_COLORS, MAIN_PROJECTS, PROFILE } from "@/lib/data";
import { ease, phase, useFigureClock } from "@/lib/figure";
import { CommitIcon, GitHubIcon, RepoIcon, TagIcon } from "../icons";
import { formatDate, SpotlightCard, TimeAgo, useNow } from "../ui";
import { cn, EXTERNAL } from "@/lib/cn";

const TYPE_AT = 350;
const TYPE_FOR = 1700;
const CELL_STEP = 22;
const UNTIL = TYPE_AT + TYPE_FOR + 53 * CELL_STEP + 400;

const CARD = "rounded-[22px] bg-white/55 shadow-[0_14px_40px_rgba(30,80,150,0.10)]";
const PAD = "p-4 desk:p-[clamp(12px,2.1vh,30px)]";
const TITLE = "flex items-center gap-2 text-[14px] font-bold text-ink desk:text-[clamp(13px,1.85vh,20px)]";

const LEVELS = ["rgba(20,48,74,0.08)", "#bae6fd", "#7dd3fc", "#38bdf8", "#0284c7"];

const FRESH_DAYS = 14;

const PROJECT_NAMES: Record<string, string> = Object.fromEntries(
  MAIN_PROJECTS.map((project) => [project.repo, project.name])
);

function Donut({ languages, draw }: { languages: GitHubData["languages"]; draw: number }) {
  const total = languages.reduce((sum, language) => sum + language.count, 0) || 1;
  const r = 50;
  const C = 2 * Math.PI * r;
  const gap = 3;
  const fracs = languages.map((language) => language.count / total);
  const starts = fracs.map((_, i) => fracs.slice(0, i).reduce((sum, frac) => sum + frac, 0));
  const segments = languages.map((language, i) => ({
    ...language,
    dash: Math.max(fracs[i] * C - gap, 2) * draw,
    offset: -starts[i] * C,
    color: LANGUAGE_COLORS[language.name] ?? LANGUAGE_COLORS.Other,
  }));
  return (
    <div className="flex items-center gap-5 desk:gap-[clamp(12px,2.4vh,32px)]">
      <div className="relative h-28 w-28 shrink-0 desk:h-[clamp(70px,11.5vh,180px)] desk:w-[clamp(70px,11.5vh,180px)]">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(15,42,67,0.08)" strokeWidth="11" />
          {segments.map((segment) => (
            <circle
              key={segment.name}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={segment.color}
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={`${Math.max(segment.dash, 0.01)} ${C}`}
              strokeDashoffset={segment.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <GitHubIcon size={20} className="text-ink-2" />
          <span className="mt-1 text-[12px] text-muted">Languages</span>
        </div>
      </div>
      <ul className="grid min-w-0 flex-1 grid-cols-1 gap-x-4 desk:grid-cols-2 gap-y-1.5 desk:gap-y-[clamp(3px,0.75vh,10px)]">
        {segments.map((segment) => (
          <li key={segment.name} className="flex min-w-0 items-center gap-2 text-[14px] desk:text-[clamp(12.5px,1.7vh,18px)]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-[4px]" style={{ background: segment.color }} aria-hidden="true" />
            <span className="flex-1 text-ink-2">{segment.name}</span>
            <span className="tabular-nums text-muted">
              {segment.count} {segment.count === 1 ? "repo" : "repos"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GitHubPage({ data }: { data: GitHubData }) {
  const { ref, t, reduced } = useFigureClock<HTMLDivElement>({ until: UNTIL, page: "github", replay: true });
  const typed = reduced ? 1 : phase(t, TYPE_AT, TYPE_FOR);
  const message = data.nowBuilding?.message ?? "";
  const shown = message.slice(0, Math.ceil(message.length * typed));
  const draw = reduced ? 1 : ease(phase(t, 200, 1100));
  const cellsFrom = TYPE_AT + 200;
  const heatRef = useRef<HTMLDivElement>(null);
  const now = useNow();
  const mounted = now !== null;
  const latest = data.nowBuilding;
  const fresh = now !== null && latest !== null && now - new Date(latest.date).getTime() <= FRESH_DAYS * 86400 * 1000;

  useEffect(() => {
    const node = heatRef.current;
    if (node && node.scrollWidth > node.clientWidth) node.scrollLeft = node.scrollWidth;
  }, []);

  return (
    <section id="github" data-page aria-labelledby="github-title" className="page">
      <div className="page-inner gap-4 desk:gap-[clamp(10px,2.2vh,30px)]">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <h2 id="github-title" className="heading text-[40px] text-ink desk:text-[clamp(40px,7.4vh,104px)]">
            Live from GitHub
          </h2>
          <p className="text-[15px] text-muted desk:text-[clamp(13px,1.9vh,22px)]">Updates every 15 minutes</p>
        </div>

        <div
          ref={ref}
          className="grid gap-4 desk:min-h-0 desk:flex-1 desk:grid-cols-12 desk:grid-rows-[auto_auto_minmax(0,1fr)] desk:gap-[clamp(10px,1.9vh,26px)]"
        >
          <SpotlightCard data-tour-target className={cn(CARD, "desk:col-span-7")} contentClassName={cn(PAD, "h-full")}>
            <p className={TITLE}>
              <CommitIcon size={16} className="text-accent-strong" />
              {fresh ? "Now building" : "Latest work"}
              {latest && mounted && !fresh ? (
                <span className="font-medium text-muted">
                  <time dateTime={latest.date}>{formatDate(latest.date)}</time>
                </span>
              ) : null}
            </p>
            {latest ? (
              <div className="mt-2 desk:mt-[clamp(4px,1vh,14px)]">
                <a
                  href={latest.repoUrl}
                  {...EXTERNAL}
                  className="text-[20px] font-extrabold text-ink hover:text-accent-strong desk:text-[clamp(17px,2.8vh,38px)]"
                  style={{ fontStretch: "112%" }}
                >
                  {latest.repo}
                </a>
                <a
                  href={latest.url}
                  {...EXTERNAL}
                  className="mt-1 grid text-[15px] text-ink-2 hover:text-ink desk:text-[clamp(13px,1.9vh,21px)]"
                >
                  <span className="text-ink-2/30 [grid-area:1/1]" aria-hidden="true">
                    {message}
                    <span className="caret invisible" />
                  </span>
                  <span className="[grid-area:1/1]">
                    <span aria-hidden="true">{shown}</span>
                    <span className="sr-only">{message}</span>
                    {reduced ? null : <span className="caret" aria-hidden="true" />}
                  </span>
                </a>
                <p className="mt-1 text-[13px] text-muted desk:text-[clamp(12px,1.55vh,16px)]">
                  <span className="font-mono">{latest.sha}</span>
                  {fresh ? (
                    <>
                      {" "}
                      <TimeAgo iso={latest.date} />
                    </>
                  ) : null}
                </p>
              </div>
            ) : null}
          </SpotlightCard>

          <SpotlightCard className={cn(CARD, "desk:col-span-5")} contentClassName={cn(PAD, "flex h-full flex-col")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className={TITLE}>
                <GitHubIcon size={16} className="text-accent-strong" />
                <a href={PROFILE.github} {...EXTERNAL} className="hover:text-accent-strong">
                  github.com/{PROFILE.githubUser}
                </a>
              </p>
              <p className="inline-flex items-center gap-1.5 rounded-xl border border-slate-900/[0.09] bg-white/70 px-2.5 py-1 text-[13px] font-semibold text-ink desk:text-[clamp(12px,1.6vh,16px)]">
                <RepoIcon size={14} className="text-accent-strong" />
                <span className="tabular-nums">{data.publicRepos}</span> public repos
              </p>
            </div>
            <div className="mt-3 flex flex-1 items-center desk:mt-[clamp(6px,1.2vh,18px)]">
              <Donut languages={data.languages} draw={draw} />
            </div>
          </SpotlightCard>

          <SpotlightCard className={cn(CARD, "desk:col-span-12")} contentClassName={PAD}>
            <p className={TITLE}>
              <RepoIcon size={16} className="text-accent-strong" />
              Recent commits
            </p>
            <ul className="mt-2 grid gap-1.5 desk:mt-[clamp(5px,1vh,14px)] desk:gap-[clamp(3px,0.7vh,10px)]">
              {data.commits.map((commit, i) => (
                <li key={commit.url} className={cn(i >= 3 && "short:hidden")}>
                  <a
                    href={commit.url}
                    {...EXTERNAL}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-xl bg-white/50 px-3 py-1.5 text-[13px] transition-colors hover:bg-white/80 desk:grid desk:grid-cols-[minmax(0,13em)_minmax(0,1fr)_auto] desk:px-[clamp(8px,1.3vh,16px)] desk:py-[clamp(3px,0.7vh,10px)] desk:text-[clamp(12px,1.6vh,17px)]"
                  >
                    <span className="font-semibold text-ink">{commit.repo}</span>
                    <span className="order-last w-full text-ink-2 desk:order-none desk:w-auto">{commit.message}</span>
                    <span className="flex items-baseline gap-2 text-muted">
                      <span className="font-mono text-[12px] desk:text-[clamp(12px,1.45vh,15px)]">{commit.sha}</span>
                      <span className="whitespace-nowrap">
                        <TimeAgo iso={commit.date} />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </SpotlightCard>

          {data.calendar ? (
            <SpotlightCard className={cn(CARD, "desk:col-span-7")} contentClassName={cn(PAD, "flex h-full flex-col")}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className={TITLE}>Contributions in the last year</p>
                <p className="text-[13px] text-ink-2 desk:text-[clamp(12px,1.6vh,17px)]">
                  <span className="font-bold tabular-nums text-ink">{data.calendar.total.toLocaleString("en-US")}</span>{" "}
                  contributions
                </p>
              </div>
              <div ref={heatRef} className="no-scrollbar mt-2 overflow-x-auto desk:mt-auto desk:pt-[clamp(6px,1.2vh,16px)]">
                <div
                  className="mx-auto flex w-max gap-[2px] desk:gap-[clamp(2px,0.28vh,4px)]"
                  role="img"
                  aria-label={`${data.calendar.total} contributions in the last year`}
                >
                  {data.calendar.weeks.map((week, w) => (
                    <div key={w} className="flex flex-col gap-[2px] desk:gap-[clamp(2px,0.28vh,4px)]">
                      {week.map((day) => (
                        <span
                          key={day.date}
                          title={`${day.count} on ${day.date}`}
                          className="block h-[9px] w-[9px] rounded-[2px] desk:h-[clamp(6px,1.2vh,16px)] desk:w-[clamp(6px,1.2vh,16px)]"
                          style={{
                            background:
                              reduced || t >= cellsFrom + w * CELL_STEP ? (LEVELS[day.level] ?? LEVELS[0]) : LEVELS[0],
                            transition: "background-color 260ms ease",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          ) : null}

          <SpotlightCard
            className={cn(CARD, data.calendar ? "desk:col-span-5" : "desk:col-span-12")}
            contentClassName={cn(PAD, "h-full")}
          >
            <p className={TITLE}>Main projects</p>
            <ul className="mt-2 grid gap-1.5 desk:mt-[clamp(5px,1vh,14px)] desk:gap-[clamp(3px,0.7vh,10px)]">
              {Object.values(data.main).map((repo) => (
                <li
                  key={repo.repo}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-white/55 px-3 py-1.5 text-[13px] desk:px-[clamp(8px,1.3vh,16px)] desk:py-[clamp(3px,0.7vh,10px)] desk:text-[clamp(12px,1.6vh,17px)]"
                >
                  <a href={repo.url} {...EXTERNAL} className="min-w-0 flex-1 font-semibold text-ink hover:text-accent-strong">
                    {PROJECT_NAMES[repo.repo] ?? repo.repo}
                  </a>
                  {repo.release ? (
                    <a href={repo.release.url} {...EXTERNAL} className="inline-flex items-center gap-1 text-ink-2 hover:text-ink">
                      <TagIcon size={13} className="text-accent-strong" />
                      {repo.release.tag}
                    </a>
                  ) : null}
                  {repo.ci ? (
                    <a href={repo.ci.url} {...EXTERNAL} className="inline-flex items-center gap-1.5 text-ink-2 hover:text-ink">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          repo.ci.state === "passing" ? "bg-good" : repo.ci.state === "failing" ? "bg-bad" : "bg-slate-400"
                        )}
                        aria-hidden="true"
                      />
                      {repo.ci.state === "passing" ? "CI passing" : repo.ci.state === "failing" ? "CI failing" : "CI running"}
                    </a>
                  ) : null}
                  {repo.lastCommit ? (
                    <span className="text-muted">
                      <TimeAgo iso={repo.lastCommit} />
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
