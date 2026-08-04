"use client";

import React, { useRef } from "react";

/**
 * Wraps a control so it leans toward the cursor and springs back on leave.
 * Inert on touch devices (mouse events simply never fire).
 */
export function Magnetic({
  children,
  strength = 0.28,
  max = 8,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    const cl = (v: number) => Math.max(-max, Math.min(max, v));
    el.style.transform = `translate(${cl(dx)}px, ${cl(dy)}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        display: "inline-block",
        transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}
