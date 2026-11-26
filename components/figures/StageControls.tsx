"use client";

import type { ReactNode } from "react";
import { PauseIcon, PlayIcon } from "../icons";
import { cn } from "@/lib/cn";

const TEXT = "text-[13px] desk:text-[clamp(12px,1.6vh,17px)]";

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex shrink-0 rounded-xl border border-slate-900/[0.10] bg-white/55 p-0.5"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "whitespace-nowrap rounded-[10px] px-2.5 py-1 font-semibold transition-colors desk:px-[clamp(8px,1.2vh,14px)] desk:py-[clamp(3px,0.6vh,7px)]",
              TEXT,
              active ? "bg-white text-accent-strong shadow-[0_2px_10px_rgba(30,80,150,0.14)]" : "text-ink-2 hover:text-ink"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function TwoWaySwitch({
  off,
  on,
  checked,
  onChange,
}: {
  off: string;
  on: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={on}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-slate-900/[0.10] bg-white/55 px-2.5 py-1 font-semibold transition-colors hover:border-accent/40 desk:py-[clamp(3px,0.6vh,7px)]",
        TEXT
      )}
    >
      <span className={cn("transition-colors", checked ? "text-muted" : "text-ink")} aria-hidden="true">
        {off}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-accent" : "bg-slate-400/70"
        )}
      >
        <span
          className="absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: `translateX(${checked ? 18 : 2}px)` }}
        />
      </span>
      <span className={cn("transition-colors", checked ? "text-accent-strong" : "text-muted")} aria-hidden="true">
        {on}
      </span>
    </button>
  );
}

export function SmallButton({
  onClick,
  pressed,
  children,
  label,
  className,
}: {
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-2.5 py-1 font-semibold transition-colors desk:py-[clamp(3px,0.6vh,7px)]",
        TEXT,
        pressed
          ? "border-accent bg-accent text-white"
          : "border-slate-900/[0.10] bg-white/70 text-ink-2 hover:border-accent/40 hover:text-accent-strong",
        className
      )}
    >
      {children}
    </button>
  );
}

export function PlayPause({ paused, onClick }: { paused: boolean; onClick: () => void }) {
  return (
    <SmallButton onClick={onClick}>
      {paused ? <PlayIcon size={12} /> : <PauseIcon size={12} />}
      {paused ? "Play" : "Pause"}
    </SmallButton>
  );
}

export function StageHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-900/[0.06] px-3 py-2.5 desk:gap-[clamp(6px,1vh,12px)] desk:px-[clamp(12px,1.8vh,24px)] desk:py-[clamp(7px,1.2vh,14px)]">
      {children}
    </div>
  );
}
