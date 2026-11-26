"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, navFor, type PageId } from "@/lib/pages";
import { PROFILE } from "@/lib/data";
import { CloseIcon, MenuIcon, PlayIcon } from "../icons";
import { cn, EXTERNAL } from "@/lib/cn";

export function FloatingNav({ current, onStartTour }: { current: PageId; onStartTour: () => void }) {
  const active = navFor(current);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (sheetRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="pointer-events-auto relative w-full max-w-[560px] lg:w-auto lg:max-w-none">
      <nav aria-label="Main" className="glass flex h-[var(--nav-h)] items-center gap-1 rounded-2xl pl-4 pr-1.5 lg:pl-5">
        <a
          href="#home"
          className="mr-auto whitespace-nowrap pr-2 text-[17px] font-extrabold tracking-[-0.01em] text-ink desk:text-[clamp(16px,2.3vh,22px)] lg:mr-3"
          style={{ fontStretch: "118%" }}
        >
          {PROFILE.name}
        </a>
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.target}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-3 py-1.5 text-[14px] font-medium transition-colors desk:px-[clamp(9px,1.3vh,15px)] desk:py-[clamp(5px,0.9vh,9px)] desk:text-[clamp(13px,1.75vh,17px)]",
                    isActive
                      ? "bg-white/90 text-accent-strong shadow-[0_4px_14px_rgba(30,80,150,0.12)]"
                      : "text-ink-2 hover:bg-white/60 hover:text-ink"
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={onStartTour}
          className="ml-1 hidden items-center gap-1.5 rounded-xl border border-slate-900/[0.10] bg-white/70 px-3 py-1.5 text-[14px] font-semibold text-ink transition-colors hover:border-accent/40 hover:text-accent-strong lg:inline-flex desk:px-[clamp(10px,1.5vh,16px)] desk:py-[clamp(5px,0.9vh,9px)] desk:text-[clamp(13px,1.75vh,17px)]"
        >
          <PlayIcon size={12} className="text-accent-strong" />
          Tour
        </button>
        <a
          href={PROFILE.resume}
          {...EXTERNAL}
          className="ml-1 hidden items-center rounded-xl bg-accent px-3.5 py-1.5 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(2,132,199,0.28)] transition-colors hover:bg-accent-strong sm:inline-flex desk:px-[clamp(12px,1.6vh,18px)] desk:py-[clamp(6px,1vh,10px)] desk:text-[clamp(13px,1.75vh,17px)]"
        >
          Resume
        </a>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((value) => !value)}
          className="ml-1 inline-flex h-10 items-center gap-2 rounded-xl border border-slate-900/[0.10] bg-white/70 px-3 text-[14px] font-semibold text-ink lg:hidden"
        >
          {open ? <CloseIcon size={16} /> : <MenuIcon size={16} />}
          Menu
        </button>
      </nav>
      <div
        ref={sheetRef}
        id="nav-sheet"
        hidden={!open}
        className="glass absolute inset-x-0 top-[calc(100%+8px)] rounded-[20px] p-2 lg:hidden"
      >
        <ul className="grid gap-1">
          <li>
            <a
              href="#home"
              onClick={() => setOpen(false)}
              aria-current={active === "home" ? "page" : undefined}
              className={cn(
                "block rounded-xl px-4 py-3 text-[16px] font-medium",
                active === "home" ? "bg-white/90 text-accent-strong" : "text-ink hover:bg-white/60"
              )}
            >
              Home
            </a>
          </li>
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.target}`}
                onClick={() => setOpen(false)}
                aria-current={item.id === active ? "page" : undefined}
                className={cn(
                  "block rounded-xl px-4 py-3 text-[16px] font-medium",
                  item.id === active ? "bg-white/90 text-accent-strong" : "text-ink hover:bg-white/60"
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="mt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onStartTour();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-900/[0.10] bg-white/80 px-4 py-3 text-[16px] font-semibold text-ink"
            >
              <PlayIcon size={13} className="text-accent-strong" />
              Tour
            </button>
            <a
              href={PROFILE.resume}
              {...EXTERNAL}
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-accent px-4 py-3 text-center text-[16px] font-semibold text-white"
            >
              Resume
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
