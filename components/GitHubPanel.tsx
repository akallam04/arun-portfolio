"use client";

import { useEffect, useState } from "react";
import {
  GITHUB_FALLBACK,
  LANGUAGE_COLORS,
  PROFILE,
} from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { CountUp, Reveal, SpotlightCard } from "./ui";
import { CommitIcon, GitHubIcon, RepoIcon, UsersIcon } from "./icons";

type GitHubData = {
  repos: number;
  followers: number;
  languages: { name: string; count: number }[];
  latestRepo: string;
  latestUrl: string;
  latestAgo?: string;
  live: boolean;
};

const CACHE_KEY = "gh-stats-v1";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function relativeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "a month ago" : `${months} months ago`;
}

function useGitHubData(): GitHubData {
  const [data, setData] = useState<GitHubData>({
    ...GITHUB_FALLBACK,
    live: false,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Date.now() - parsed.at <= CACHE_TTL) {
            if (!cancelled) setData(parsed.data as GitHubData);
            return;
          }
        }
      } catch {}

      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${PROFILE.githubUser}`),
          fetch(
            `https://api.github.com/users/${PROFILE.githubUser}/repos?per_page=100&sort=pushed`
          ),
        ]);
        if (!userRes.ok || !reposRes.ok) return;
        const user = await userRes.json();
        const repos: Array<{
          language: string | null;
          name: string;
          html_url: string;
          pushed_at: string;
          fork: boolean;
        }> = await reposRes.json();

        const counts = new Map<string, number>();
        for (const r of repos) {
          if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
        }
        const languages = [...counts.entries()]
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const latest = repos[0];
        const next: GitHubData = {
          repos: user.public_repos ?? GITHUB_FALLBACK.repos,
          followers: user.followers ?? GITHUB_FALLBACK.followers,
          languages: languages.length ? languages : GITHUB_FALLBACK.languages,
          latestRepo: latest?.name ?? GITHUB_FALLBACK.latestRepo,
          latestUrl: latest?.html_url ?? GITHUB_FALLBACK.latestUrl,
          latestAgo: latest ? relativeAgo(latest.pushed_at) : undefined,
          live: true,
        };
        if (!cancelled) {
          setData(next);
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ at: Date.now(), data: next })
            );
          } catch {}
        }
      } catch {
        // Keep the static snapshot; the panel still renders honestly.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

function LanguageDonut({
  languages,
}: {
  languages: { name: string; count: number }[];
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const total = languages.reduce((s, l) => s + l.count, 0) || 1;
  const r = 50;
  const C = 2 * Math.PI * r;
  const gap = 3; // px gap between segments

  const fracs = languages.map((l) => l.count / total);
  const segments = languages.map((l, i) => ({
    ...l,
    frac: fracs[i],
    dash: Math.max(fracs[i] * C - gap, 2),
    offset: -fracs.slice(0, i).reduce((a, b) => a + b, 0) * C,
    color: LANGUAGE_COLORS[l.name] ?? LANGUAGE_COLORS.Other,
  }));

  return (
    <div ref={ref} className="flex items-center gap-5 sm:gap-7">
      <div className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="11"
          />
          {segments.map((s) => (
            <circle
              key={s.name}
              className="donut-seg"
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={
                inView ? `${s.dash} ${C - s.dash}` : `0.5 ${C - 0.5}`
              }
              strokeDashoffset={s.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <GitHubIcon size={20} className="text-white/60" />
          <span className="mt-1 text-[9px] uppercase tracking-wider text-white/35">
            languages
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {segments.map((s) => (
          <div key={s.name} className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: s.color }}
            />
            <span className="flex-1 truncate text-sm text-white/65">
              {s.name}
            </span>
            <span className="font-mono text-xs text-white/40">
              {Math.round(s.frac * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Live GitHub footprint, rendered at the bottom of the Projects section. */
export function GitHubPanel() {
  const data = useGitHubData();

  return (
    <Reveal>
      <SpotlightCard className="bg-white/[0.03] p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <GitHubIcon size={20} className="text-white/70" />
            <h3 className="text-lg font-bold text-white sm:text-xl">
              GitHub, live
            </h3>
            <span
              className={
                data.live
                  ? "flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300"
                  : "rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/40"
              }
            >
              {data.live && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
              {data.live ? "Live API" : "Snapshot"}
            </span>
          </div>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/40 transition hover:text-white/80"
          >
            @{PROFILE.githubUser} →
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
          <div className="grid grid-cols-2 content-center gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-[#070a11]/70 px-4 py-3.5">
              <div className="flex items-center gap-2 text-white/40">
                <RepoIcon size={14} />
                <span className="text-xs">Public repos</span>
              </div>
              <CountUp
                value={data.repos}
                className="mt-1 block text-2xl font-bold text-white"
              />
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-[#070a11]/70 px-4 py-3.5">
              <div className="flex items-center gap-2 text-white/40">
                <UsersIcon size={14} />
                <span className="text-xs">Followers</span>
              </div>
              <CountUp
                value={data.followers}
                className="mt-1 block text-2xl font-bold text-white"
              />
            </div>
            <a
              href={data.latestUrl}
              target="_blank"
              rel="noreferrer"
              className="col-span-2 rounded-xl border border-white/[0.08] bg-[#070a11]/70 px-4 py-3.5 transition hover:border-white/20"
            >
              <div className="flex items-center gap-2 text-white/40">
                <CommitIcon size={14} />
                <span className="text-xs">Latest push</span>
              </div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono text-sm font-semibold text-white">
                  {data.latestRepo}
                </span>
                {data.latestAgo && (
                  <span className="text-xs text-white/35">{data.latestAgo}</span>
                )}
              </div>
            </a>
          </div>

          <LanguageDonut languages={data.languages} />
        </div>
      </SpotlightCard>
    </Reveal>
  );
}
