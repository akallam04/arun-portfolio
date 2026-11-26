"use client";

import type { ReactNode } from "react";
import { PROFILE } from "@/lib/data";
import { ChatIcon, FileIcon, GitHubIcon, LinkedInIcon, PlayIcon } from "../icons";
import { cn, EXTERNAL } from "@/lib/cn";
import { useSite } from "../site/SiteContext";

const BUTTON =
  "inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[15px] font-semibold transition-colors desk:h-[clamp(40px,6vh,62px)] desk:px-[clamp(14px,2vh,24px)] desk:text-[clamp(14px,1.95vh,20px)]";

function IconButton({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      <a
        href={href}
        {...EXTERNAL}
        aria-label={label}
        className={cn(
          BUTTON,
          "glass w-11 justify-center px-0 text-ink hover:text-accent-strong desk:w-[clamp(40px,6vh,62px)] desk:px-0"
        )}
      >
        {children}
      </a>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-900/[0.08] bg-white px-2 py-1 text-[12px] font-medium text-ink shadow-[0_8px_22px_rgba(30,80,150,0.16)] group-focus-within:block group-hover:block"
      >
        {label}
      </span>
    </span>
  );
}

export function HomeActions() {
  const { agentEnabled, openAgent, startTour } = useSite();
  return (
    <div className="flex flex-wrap items-center gap-2.5 desk:gap-[clamp(8px,1.4vh,14px)]">
      <button
        type="button"
        onClick={startTour}
        className={cn(BUTTON, "bg-accent text-white shadow-[0_10px_28px_rgba(2,132,199,0.32)] hover:bg-accent-strong")}
      >
        <PlayIcon size={14} />
        Start the 60-second tour
      </button>
      <a href={PROFILE.resume} {...EXTERNAL} className={cn(BUTTON, "glass text-ink hover:text-accent-strong")}>
        <FileIcon size={16} className="text-accent-strong" />
        Resume
      </a>
      {agentEnabled ? (
        <button type="button" onClick={() => openAgent()} className={cn(BUTTON, "glass text-ink hover:text-accent-strong")}>
          <ChatIcon size={16} className="text-accent-strong" />
          Ask my agent
        </button>
      ) : null}
      <span className="flex gap-2.5 desk:gap-[clamp(8px,1.4vh,14px)]">
        <IconButton href={PROFILE.github} label="GitHub">
          <GitHubIcon size={18} />
        </IconButton>
        <IconButton href={PROFILE.linkedin} label="LinkedIn">
          <LinkedInIcon size={18} />
        </IconButton>
      </span>
    </div>
  );
}
