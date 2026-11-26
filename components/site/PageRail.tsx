"use client";

import { PAGES, type PageId } from "@/lib/pages";
import { cn } from "@/lib/cn";

export function PageRail({ current }: { current: PageId }) {
  return (
    <nav
      aria-label="Pages"
      className="glass fixed right-[clamp(10px,1.1vw,22px)] top-1/2 z-40 hidden -translate-y-1/2 rounded-xl px-1 py-2 lg:block"
    >
      <ul className="flex flex-col items-center">
        {PAGES.map((page) => {
          const active = page.id === current;
          return (
            <li key={page.id} className="group relative">
              <a
                href={`#${page.id}`}
                aria-label={page.label}
                aria-current={active ? "page" : undefined}
                className="flex h-[clamp(18px,2.6vh,28px)] w-6 items-center justify-center rounded-lg"
              >
                <span
                  className={cn(
                    "block w-[3px] rounded-full transition-[height,background-color] duration-300",
                    active ? "h-[clamp(14px,2.2vh,22px)] bg-accent" : "h-[6px] bg-slate-900/25 group-hover:bg-slate-900/45"
                  )}
                />
              </a>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-slate-900/[0.08] bg-white/95 px-2.5 py-1 text-[13px] font-medium text-ink shadow-[0_8px_22px_rgba(30,80,150,0.14)] group-focus-within:block group-hover:block"
              >
                {page.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
