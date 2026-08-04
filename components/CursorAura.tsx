"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A soft sky-glow that trails the cursor and blooms over interactive
 * elements. Desktop fine-pointer only; never touches the native cursor.
 */
export function CursorAura() {
  const [enabled, setEnabled] = useState(false);
  const haloRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    const enableRaf = requestAnimationFrame(() => setEnabled(true));

    const pos = { x: -200, y: -200 };
    const halo = { x: -200, y: -200 };
    const ring = { x: -200, y: -200 };
    let hot = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      hot = !!(e.target as HTMLElement).closest(
        'a, button, [role="button"], input, textarea'
      );
    };

    const tick = () => {
      halo.x += (pos.x - halo.x) * 0.12;
      halo.y += (pos.y - halo.y) * 0.12;
      ring.x += (pos.x - ring.x) * 0.28;
      ring.y += (pos.y - ring.y) * 0.28;
      if (haloRef.current)
        haloRef.current.style.transform = `translate(${halo.x}px, ${halo.y}px) translate(-50%, -50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%) scale(${hot ? 1.8 : 1})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(enableRaf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={haloRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] h-44 w-44 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(56,150,235,0.16) 0%, transparent 65%)",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[91] h-5 w-5 rounded-full border border-sky-500/50 bg-sky-400/10 transition-[width,height] duration-200"
        style={{ transitionProperty: "none" }}
      />
    </>
  );
}
