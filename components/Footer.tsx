"use client";

import { PROFILE } from "@/lib/data";
import { GitHubIcon, LinkedInIcon, ArrowUpIcon } from "./icons";

export function Footer() {
  return (
    <footer className="border-t border-slate-900/[0.07] pb-28 pt-8 lg:pb-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
        <div className="text-center text-xs text-slate-400 sm:text-left">
          © {new Date().getFullYear()} {PROFILE.name}
          <span className="mx-2 text-slate-900/15">·</span>
          Designed &amp; built in Next.js + Tailwind
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-1 hidden items-center gap-1.5 text-[11px] text-slate-400 lg:flex">
            <kbd className="rounded border border-slate-400/40 bg-white/60 px-1.5 py-0.5 font-mono text-[9px]">
              ⌘K
            </kbd>
            anywhere
          </span>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-400/30 bg-white/55 text-slate-500 transition hover:border-sky-500/50 hover:text-slate-900"
          >
            <GitHubIcon size={15} />
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-400/30 bg-white/55 text-slate-500 transition hover:border-sky-500/50 hover:text-slate-900"
          >
            <LinkedInIcon size={15} />
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-400/30 bg-white/55 text-slate-500 transition hover:border-sky-500/50 hover:text-slate-900"
          >
            <ArrowUpIcon size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
