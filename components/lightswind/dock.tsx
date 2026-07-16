"use client";

import React, { useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "../ui";

export type DockItem = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  /** Highlights the item and shows the active dot. */
  active?: boolean;
};

type DockProps = {
  items: DockItem[];
  position?: "bottom";
  /** Item size in px at the magnification peak. */
  magnification?: number;
  /** Item size in px at rest. */
  baseItemSize?: number;
  className?: string;
};

const GAP = 4; // px between items (gap-1)
const PAD = 6; // px bar padding (p-1.5)
const RANGE = 96; // px falloff radius for the magnification curve

/**
 * macOS-style dock: items magnify under the pointer or finger and push
 * their neighbors aside, with a label bubble over the nearest item.
 * Hand-rolled (no framer-motion) but keeps the lightswind Dock API.
 */
export default function Dock({
  items,
  position = "bottom",
  magnification = 64,
  baseItemSize = 44,
  className,
}: DockProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [pointerX, setPointerX] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  // Item centers use the resting layout so the curve stays stable while
  // widths animate around it.
  const centerOf = (i: number) =>
    PAD + i * (baseItemSize + GAP) + baseItemSize / 2;

  const sizeOf = (i: number) => {
    if (reduced || pointerX === null) return baseItemSize;
    const d = Math.abs(pointerX - centerOf(i));
    const falloff = Math.max(0, 1 - (d / RANGE) ** 2);
    return Math.round(baseItemSize + (magnification - baseItemSize) * falloff);
  };

  const nearest = (() => {
    if (reduced || pointerX === null) return null;
    let best: number | null = null;
    let bestD = RANGE;
    items.forEach((_, i) => {
      const d = Math.abs(pointerX - centerOf(i));
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  })();

  const track = (clientX: number) => {
    const bar = barRef.current;
    if (!bar) return;
    setPointerX(clientX - bar.getBoundingClientRect().left);
  };

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-50 flex justify-center px-4",
        position === "bottom" &&
          "bottom-0 pb-[max(env(safe-area-inset-bottom),12px)]",
        className
      )}
    >
      <div
        ref={barRef}
        onPointerMove={(e) => track(e.clientX)}
        onPointerLeave={() => setPointerX(null)}
        onTouchStart={(e) => track(e.touches[0].clientX)}
        onTouchMove={(e) => track(e.touches[0].clientX)}
        onTouchEnd={() => setPointerX(null)}
        onTouchCancel={() => setPointerX(null)}
        style={{ touchAction: "none" }}
        className="relative flex items-end gap-1 rounded-2xl border border-white/[0.10] bg-[#0a0d14]/85 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        {nearest !== null && (
          <div
            className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-lg border border-white/[0.12] bg-[#0a0d14]/95 px-2.5 py-1 text-[11px] font-medium text-white/85 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            style={{
              left: centerOf(nearest),
              transform: "translateX(-50%)",
              transition: "left 120ms ease-out",
            }}
          >
            {items[nearest].label}
          </div>
        )}

        {items.map((item, i) => {
          const s = sizeOf(i);
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              aria-label={item.label}
              aria-current={item.active ? "true" : undefined}
              className={cn(
                "relative flex items-center justify-center rounded-xl",
                item.active
                  ? "bg-white/[0.12] text-white"
                  : "text-white/40 active:bg-white/[0.06]"
              )}
              style={{
                width: s,
                height: s,
                transition:
                  "width 150ms ease-out, height 150ms ease-out, background-color 150ms",
              }}
            >
              <span
                className="flex items-center justify-center"
                style={{
                  transform: `scale(${s / baseItemSize})`,
                  transition: "transform 150ms ease-out",
                }}
              >
                {item.icon}
              </span>
              <span
                className={cn(
                  "absolute bottom-1 h-1 w-1 rounded-full bg-emerald-400 transition-opacity",
                  item.active ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
