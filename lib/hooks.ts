"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { SectionKey } from "./data";

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MQ).matches,
    () => false
  );
}

/** Tracks which `section[data-key]` currently crosses the middle of the viewport. */
export function useActiveSection() {
  const [active, setActive] = useState<SectionKey>("home");
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-key]")
    );
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const key = e.target.getAttribute("data-key") as SectionKey | null;
            if (key) setActive(key);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);
  return active;
}

/**
 * Scripted equivalent of clicking `<a href="#key">`. No explicit behavior:
 * `scrollIntoView` then follows `html { scroll-behavior }`, which is smooth
 * normally and instant under prefers-reduced-motion.
 */
export function scrollToSection(key: SectionKey) {
  document.getElementById(key)?.scrollIntoView({ block: "start" });
  history.replaceState(null, "", `#${key}`);
}

/** One-shot in-view flag for scroll reveal / chart draw triggers. */
export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true once running in the browser. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

const isApplePlatform = () =>
  /mac|iphone|ipad|ipod/i.test(
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ||
      navigator.platform ||
      navigator.userAgent
  );

/**
 * The palette shortcut as this visitor would type it: "⌘K" on Apple
 * devices, "Ctrl K" elsewhere. Server HTML says "⌘K"; the client swaps it
 * right after hydration.
 */
export function useShortcutLabel() {
  return useSyncExternalStore(
    noopSubscribe,
    () => (isApplePlatform() ? "⌘K" : "Ctrl\u00A0K"),
    () => "⌘K"
  );
}

/**
 * Counts from 0 to `target` with an ease-out curve once `start` is true.
 *
 * Server HTML (and no-JS / crawler reads) carries the final `target`, so
 * the page text is never "0 Internships". After hydration the number rests
 * at 0 until `start`, then counts up. Reduced motion shows `target` only.
 */
export function useCountUp(target: number, start: boolean, duration = 1200) {
  const hydrated = useHydrated();
  const reduced = usePrefersReducedMotion();
  // null until the first animation frame has run.
  const [animated, setAnimated] = useState<number | null>(null);

  useEffect(() => {
    if (!start || reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setAnimated(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration, reduced]);

  if (!hydrated || reduced) return target;
  if (!start) return 0;
  return animated ?? 0;
}

const SCRAMBLE_CHARS = "ΛΞΦ01<>/#&+*";

/** Resolves scrambled glyphs into `text`, left to right, once `active`. */
export function useScramble(text: string, active: boolean) {
  const [out, setOut] = useState(text);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active || reduced) {
      setOut(text);
      return;
    }
    let frame = 0;
    const totalFrames = Math.max(12, text.length * 2.2);
    const id = window.setInterval(() => {
      frame++;
      const locked = Math.floor((frame / totalFrames) * text.length);
      if (locked >= text.length) {
        setOut(text);
        window.clearInterval(id);
        return;
      }
      setOut(
        text
          .split("")
          .map((c, i) =>
            i < locked || c === " "
              ? c
              : SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ]
          )
          .join("")
      );
    }, 28);
    return () => window.clearInterval(id);
  }, [text, active, reduced]);

  return out;
}

/** Types, holds, deletes, and cycles through `words`. */
export function useTypewriter(
  words: string[],
  { typeMs = 55, deleteMs = 30, holdMs = 1900 } = {}
) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const word = words[wordIdx % words.length];
    let delay = deleting ? deleteMs : typeMs;
    if (!deleting && text === word) delay = holdMs;
    else if (deleting && text === "") delay = 350;

    const t = window.setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => window.clearTimeout(t);
  }, [text, deleting, wordIdx, words, typeMs, deleteMs, holdMs, reduced]);

  return reduced ? words[0] : text;
}
