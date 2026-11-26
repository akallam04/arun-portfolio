import { cacheLife } from "next/cache";
import snapshot from "./github-snapshot.json";

export const OWNER = "akallam04";

export const EXCLUDE: string[] = ["akallam04"];

const EXCLUDE_PATTERNS = [/professor\s*dm/i, /professordm/i];

export const MAIN_REPOS = ["shopify-support-agent", "oversold", "shortfall"] as const;

/** Team repos shown on the site but kept out of the repo lists, languages and commits. */
export const EXTERNAL_REPOS = ["ritvikreddygangula/Open-AutoData"] as const;

export type Commit = {
  repo: string;
  message: string;
  sha: string;
  url: string;
  date: string;
};

export type CiState = "passing" | "failing" | "running";

export type RepoStatus = {
  repo: string;
  url: string;
  release: { tag: string; url: string } | null;
  ci: { state: CiState; url: string } | null;
  lastCommit: string | null;
};

export type CalendarDay = { date: string; count: number; level: number };

export type GitHubData = {
  source: "live" | "snapshot";
  updatedAt: string;
  publicRepos: number;
  languages: { name: string; count: number }[];
  nowBuilding: {
    repo: string;
    repoUrl: string;
    message: string;
    sha: string;
    url: string;
    date: string;
  } | null;
  commits: Commit[];
  main: Record<string, RepoStatus>;
  pushed: Record<string, string>;
  external: Record<string, string>;
  calendar: { total: number; weeks: CalendarDay[][] } | null;
};

type ApiRepo = {
  name: string;
  html_url: string;
  owner: { login: string };
  fork: boolean;
  archived: boolean;
  language: string | null;
  description: string | null;
  pushed_at: string;
};

type ApiCommit = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } | null; committer: { date: string } | null };
};

type ApiRelease = { tag_name: string; html_url: string };

type ApiRuns = {
  workflow_runs: { status: string; conclusion: string | null; html_url: string }[];
};

type ApiCalendar = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
        };
      };
    };
  };
};

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function headers(token: string) {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
    Authorization: `Bearer ${token}`,
  };
}

async function rest<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, { headers: headers(token) });
  if (!response.ok) throw new Error(`GitHub ${response.status} for ${path}`);
  return (await response.json()) as T;
}

async function optionalRest<T>(path: string, token: string): Promise<T | null> {
  const response = await fetch(`https://api.github.com${path}`, { headers: headers(token) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub ${response.status} for ${path}`);
  return (await response.json()) as T;
}

function firstLine(message: string) {
  return message.split("\n")[0].trim();
}

export function isExcluded(repo: Pick<ApiRepo, "name" | "description" | "owner" | "fork" | "archived">) {
  if (repo.owner.login !== OWNER || repo.fork || repo.archived) return true;
  if (EXCLUDE.includes(repo.name)) return true;
  const text = `${repo.name} ${repo.description ?? ""}`;
  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(text));
}

function ciState(runs: ApiRuns | null): RepoStatus["ci"] {
  const run = runs?.workflow_runs?.[0];
  if (!run) return null;
  if (run.status !== "completed") return { state: "running", url: run.html_url };
  if (run.conclusion === "success") return { state: "passing", url: run.html_url };
  if (run.conclusion === "failure" || run.conclusion === "timed_out") {
    return { state: "failing", url: run.html_url };
  }
  return null;
}

async function loadCalendar(token: string): Promise<GitHubData["calendar"]> {
  const query = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: OWNER } }),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as ApiCalendar;
  const calendar = body.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return null;
  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVELS[day.contributionLevel] ?? 0,
      })),
    ),
  };
}

async function loadLive(token: string): Promise<GitHubData> {
  const all = await rest<ApiRepo[]>(`/users/${OWNER}/repos?per_page=100&sort=pushed`, token);
  const repos = all
    .filter((repo) => !isExcluded(repo))
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));

  const recent = repos.slice(0, 5).map((repo) => repo.name);
  const commitRepos = Array.from(new Set([...recent, ...MAIN_REPOS]));
  const commitLists = await Promise.all(
    commitRepos.map(async (name) => ({
      name,
      commits: await rest<ApiCommit[]>(`/repos/${OWNER}/${name}/commits?per_page=3`, token),
    })),
  );
  const byRepo = new Map(commitLists.map((entry) => [entry.name, entry.commits]));

  const commits: Commit[] = commitLists
    .filter((entry) => recent.includes(entry.name))
    .flatMap((entry) =>
      entry.commits.map((commit) => ({
        repo: entry.name,
        message: firstLine(commit.commit.message),
        sha: commit.sha.slice(0, 7),
        url: commit.html_url,
        date: commit.commit.author?.date ?? commit.commit.committer?.date ?? "",
      })),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const main: Record<string, RepoStatus> = {};
  await Promise.all(
    MAIN_REPOS.map(async (name) => {
      const [release, runs] = await Promise.all([
        optionalRest<ApiRelease>(`/repos/${OWNER}/${name}/releases/latest`, token),
        optionalRest<ApiRuns>(`/repos/${OWNER}/${name}/actions/runs?branch=main&per_page=1`, token),
      ]);
      const latest = byRepo.get(name)?.[0];
      main[name] = {
        repo: name,
        url: `https://github.com/${OWNER}/${name}`,
        release: release ? { tag: release.tag_name, url: release.html_url } : null,
        ci: ciState(runs),
        lastCommit: latest?.commit.author?.date ?? latest?.commit.committer?.date ?? null,
      };
    }),
  );

  const top = repos[0];
  const topCommit = top ? byRepo.get(top.name)?.[0] : undefined;

  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const languages = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 5);

  const calendar = await loadCalendar(token).catch(() => null);
  const fallback = (snapshot as GitHubData).external ?? {};
  const external: Record<string, string> = {};
  await Promise.all(
    EXTERNAL_REPOS.map(async (full) => {
      const repo = await optionalRest<Pick<ApiRepo, "pushed_at">>(`/repos/${full}`, token).catch(() => null);
      const pushedAt = repo?.pushed_at ?? fallback[full];
      if (pushedAt) external[full] = pushedAt;
    }),
  );

  return {
    source: "live",
    updatedAt: new Date().toISOString(),
    publicRepos: repos.length,
    languages,
    nowBuilding:
      top && topCommit
        ? {
            repo: top.name,
            repoUrl: top.html_url,
            message: firstLine(topCommit.commit.message),
            sha: topCommit.sha.slice(0, 7),
            url: topCommit.html_url,
            date: topCommit.commit.author?.date ?? top.pushed_at,
          }
        : null,
    commits,
    main: Object.fromEntries(MAIN_REPOS.filter((name) => main[name]).map((name) => [name, main[name]])),
    pushed: Object.fromEntries(repos.map((repo) => [repo.name, repo.pushed_at])),
    external,
    calendar: calendar ?? (snapshot as GitHubData).calendar,
  };
}

export async function getGitHubData(): Promise<GitHubData> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 86400 });
  const token = process.env.GITHUB_TOKEN;
  if (!token) return snapshot as GitHubData;
  try {
    return await loadLive(token);
  } catch {
    return snapshot as GitHubData;
  }
}
