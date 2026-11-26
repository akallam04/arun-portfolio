"use client";

import type { ProofCard as Card } from "@/lib/data";
import { SpotlightCard } from "../ui";
import { cn } from "@/lib/cn";

export function ProofCard({
  card,
  lit,
  onPick,
  className,
}: {
  card: Card;
  lit: boolean;
  onPick?: () => void;
  className?: string;
}) {
  return (
    <SpotlightCard
      data-lit={lit}
      tabIndex={onPick ? 0 : undefined}
      onMouseEnter={onPick}
      onFocus={onPick}
      className={cn(
        "rounded-[20px] bg-white/55 shadow-[0_14px_40px_rgba(30,80,150,0.10)] outline-offset-2",
        className
      )}
      contentClassName="flex h-full flex-col justify-center px-4 py-3.5 desk:px-[clamp(14px,2vh,26px)] desk:py-[clamp(10px,1.7vh,22px)]"
    >
      <span className="lit-layer pointer-events-none absolute inset-0 rounded-[20px]" />
      <p className="relative text-[13px] font-semibold leading-snug text-accent-strong desk:text-[clamp(12px,1.6vh,17px)]">
        {card.label}
      </p>
      <p
        className="relative mt-1 text-[30px] font-extrabold leading-none tracking-[-0.02em] text-ink tabular-nums desk:mt-[clamp(3px,0.7vh,10px)] desk:text-[clamp(24px,4.5vh,60px)]"
        style={{ fontStretch: "116%" }}
      >
        {card.value}
      </p>
      <p className="relative mt-1.5 text-[14px] leading-snug text-ink-2 desk:mt-[clamp(4px,0.8vh,10px)] desk:text-[clamp(12.5px,1.72vh,19px)]">
        {card.text}
      </p>
    </SpotlightCard>
  );
}
