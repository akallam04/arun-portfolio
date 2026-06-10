"use client";

import React, { useRef, useState } from "react";
import { useCountUp, useInView } from "@/lib/hooks";
import { CheckIcon, CopyIcon } from "./icons";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Chip({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  /** Shrinks the chip on lg+ screens so dense sections fit one viewport; mobile unchanged. */
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-white/65 sm:px-3 sm:text-sm",
        compact && "lg:px-2.5 lg:py-0.5 lg:text-xs"
      )}
    >
      {children}
    </span>
  );
}

/** Card with a radial highlight that follows the pointer (desktop only). */
export function SpotlightCard({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
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
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        "spotlight-card relative overflow-hidden rounded-2xl border border-white/[0.08] backdrop-blur-xl",
        className
      )}
      style={style}
    >
      <div className="spotlight-glow pointer-events-none absolute inset-0" />
      <div className="relative">{children}</div>
    </div>
  );
}

/** Scroll-reveal wrapper: fades + slides in once when it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "reveal-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  index,
  title,
  compact = false,
}: {
  index: string;
  title: string;
  /** Tightens the header on lg+ so the section content fits one viewport; mobile unchanged. */
  compact?: boolean;
}) {
  return (
    <Reveal>
      <div
        className={cn(
          "mb-8 flex items-center gap-3 sm:mb-10 sm:gap-4",
          compact && "lg:mb-6"
        )}
      >
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/25">
          {index}
        </span>
        <h2
          className={cn(
            "text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl",
            compact && "lg:text-4xl"
          )}
        >
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/[0.12] to-transparent" />
      </div>
    </Reveal>
  );
}

export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const current = useCountUp(value, inView);
  return (
    <span ref={ref} className={className}>
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {}
      }}
      aria-label={`${label} ${value}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/45 transition hover:bg-white/[0.09] hover:text-white/80"
    >
      {copied ? (
        <>
          <CheckIcon size={13} className="text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <CopyIcon size={13} />
          {label}
        </>
      )}
    </button>
  );
}
