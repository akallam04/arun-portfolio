import type { RepoStatus } from "@/lib/github";
import { cn, EXTERNAL } from "@/lib/cn";

const CHIP =
  "inline-flex items-center gap-1.5 rounded-xl border border-slate-900/[0.09] bg-white/60 px-2.5 py-1 text-[13px] font-medium text-ink-2 desk:text-[clamp(12px,1.55vh,16px)]";

export function LiveChips({ status, label }: { status?: RepoStatus; label: string }) {
  if (!status) return null;
  const { release, ci } = status;
  if (!release && !ci) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label={`${label} on GitHub`}>
      {release ? (
        <li>
          <a href={release.url} {...EXTERNAL} className={cn(CHIP, "hover:text-ink")}>
            <span className="h-2 w-2 rounded-full bg-good" aria-hidden="true" />
            Release {release.tag}
          </a>
        </li>
      ) : null}
      {ci ? (
        <li>
          <a href={ci.url} {...EXTERNAL} className={cn(CHIP, "hover:text-ink")}>
            <span
              aria-hidden="true"
              className={cn(
                "h-2 w-2 rounded-full",
                ci.state === "passing" ? "bg-good" : ci.state === "failing" ? "bg-bad" : "bg-slate-400"
              )}
            />
            {ci.state === "passing" ? "CI passing" : ci.state === "failing" ? "CI failing" : "CI running"}
          </a>
        </li>
      ) : null}
    </ul>
  );
}
