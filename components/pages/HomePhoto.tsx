"use client";

import Image from "next/image";
import { useRef } from "react";
import profilePhoto from "@/public/arun-profile.jpeg";
import { PROFILE } from "@/lib/data";

export function HomePhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    node.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      data-tour-target
      className="spotlight-card relative aspect-[4/5] w-[220px] overflow-hidden rounded-3xl border border-white/80 bg-sky-100 shadow-[0_24px_60px_rgba(30,80,150,0.25)] sm:w-[260px] desk:w-[49.6vh]"
    >
      <Image
        src={profilePhoto}
        alt={`Photo of ${PROFILE.fullName}`}
        preload
        fetchPriority="high"
        quality={90}
        sizes="(min-width: 1024px) 50vh, 260px"
        className="h-full w-full object-cover object-[50%_34%]"
      />
      <div className="photo-glare pointer-events-none absolute inset-0" aria-hidden="true" />
    </div>
  );
}
