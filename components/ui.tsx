"use client";

import React, { useRef, useSyncExternalStore } from "react";
import {
  BookIcon,
  ChartIcon,
  FlaskIcon,
  GitHubIcon,
  PauseIcon,
  PlayIcon,
  PlayCircleIcon,
  TagIcon,
} from "./icons";
import type { LinkIcon } from "@/lib/data";
import { cn, EXTERNAL } from "@/lib/cn";


export function SpotlightCard({
  className,
  blur = true,
  contentClassName,
  children,
  ...rest
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onMouseMove"> & {
  blur?: boolean;
  contentClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  return (
    <div
      {...rest}
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        "spotlight-card relative overflow-hidden rounded-2xl border border-slate-900/[0.10]",
        blur && "backdrop-blur-xl",
        className
      )}
    >
      <div className="spotlight-glow pointer-events-none absolute inset-0" />
      <div className="glass-glare pointer-events-none absolute inset-0" />
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  );
}

export const GLASS_CARD = "bg-white/55 shadow-[0_14px_40px_rgba(30,80,150,0.10)]";

export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-slate-900/[0.09] bg-white/60 px-2.5 py-1 text-[13px] leading-5 text-ink-2 desk:text-[clamp(12px,1.55vh,16px)]",
        className
      )}
    >
      {children}
    </span>
  );
}

const LINK_ICONS: Record<LinkIcon, React.ReactNode> = {
  demo: <PlayCircleIcon size={15} />,
  code: <GitHubIcon size={15} />,
  doc: <BookIcon size={15} />,
  results: <ChartIcon size={15} />,
  release: <TagIcon size={15} />,
  test: <FlaskIcon size={15} />,
};

export function IconLinkButton({
  href,
  label,
  icon,
  srLabel,
}: {
  href: string;
  label: string;
  icon: LinkIcon;
  srLabel?: string;
}) {
  return (
    <a
      href={href}
      {...EXTERNAL}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-900/[0.10] bg-white/60 px-3 py-2 text-[14px] font-semibold text-ink shadow-[0_6px_18px_rgba(30,80,150,0.08)] transition-colors hover:border-accent/40 hover:bg-white/85 hover:text-accent-strong desk:px-[clamp(10px,1.3vh,16px)] desk:py-[clamp(6px,1vh,11px)] desk:text-[clamp(13px,1.6vh,17px)]"
    >
      <span className="text-accent-strong" aria-hidden="true">
        {LINK_ICONS[icon]}
      </span>
      {label}
      {srLabel ? <span className="sr-only">, {srLabel}</span> : null}
    </a>
  );
}

export function PauseButton({
  paused,
  onClick,
  className,
}: {
  paused: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-900/[0.10] bg-white/70 px-2.5 py-1 text-[13px] font-semibold text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-strong",
        className
      )}
    >
      {paused ? <PlayIcon size={12} /> : <PauseIcon size={12} />}
      {paused ? "Play" : "Pause"}
    </button>
  );
}

const subscribeNever = () => () => {};

export function useMounted() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );
}

let clientNow: number | null = null;

function readNow() {
  if (clientNow === null) clientNow = Date.now();
  return clientNow;
}

/** The time when the page first rendered in the browser. Null during server rendering and hydration. */
export function useNow() {
  return useSyncExternalStore(subscribeNever, readNow, () => null);
}

let introAtLoad: boolean | null = null;

function readIntro() {
  if (introAtLoad === null) {
    const state = document.documentElement.getAttribute("data-intro");
    introAtLoad = state === "wait" || state === "play" || state === "glide";
  }
  return introAtLoad;
}

/** True when the first-visit intro was still playing as the page hydrated. */
export function useIntroActive() {
  return useSyncExternalStore(subscribeNever, readIntro, () => false);
}

export function useShortcutLabel() {
  return useSyncExternalStore(
    subscribeNever,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K"),
    () => "Ctrl K"
  );
}

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export function formatDate(iso: string) {
  return DATE.format(new Date(iso));
}

/** Relative time for the last 30 days, then a plain date such as "Nov 25, 2026". */
export function timeAgo(iso: string, now = Date.now()) {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs >= 86400 * 30) return formatDate(iso);
  if (abs < 60) return "just now";
  if (abs < 3600) return RELATIVE.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return RELATIVE.format(Math.round(seconds / 3600), "hour");
  return RELATIVE.format(Math.round(seconds / 86400), "day");
}

export function TimeAgo({ iso, prefix = "" }: { iso: string; prefix?: string }) {
  const mounted = useMounted();
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {mounted ? `${prefix}${timeAgo(iso)}` : " "}
    </time>
  );
}
