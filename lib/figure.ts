import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const mediaSubscribers = new Map<string, (onChange: () => void) => () => void>();

function subscribeMedia(query: string) {
  let subscribe = mediaSubscribers.get(query);
  if (!subscribe) {
    subscribe = (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    };
    mediaSubscribers.set(query, subscribe);
  }
  return subscribe;
}

export function useMedia(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export function useReducedMotion() {
  return useMedia("(prefers-reduced-motion: reduce)", false);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function usePageVisible() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );
}

const RESTART_EVENT = "figures:restart";

export function restartFigures(page?: string) {
  window.dispatchEvent(new CustomEvent(RESTART_EVENT, { detail: { page } }));
}

export type FigureClock<T extends Element> = {
  ref: RefObject<T | null>;
  t: number;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  togglePause: () => void;
  seek: (ms: number) => void;
  restart: () => void;
  reduced: boolean;
  started: boolean;
};

export function useFigureClock<T extends Element = HTMLDivElement>(
  options: { until?: number; page?: string; active?: boolean; onRestart?: () => void } = {},
): FigureClock<T> {
  const { until, page, active = true, onRestart } = options;
  const onRestartRef = useRef(onRestart);
  useEffect(() => {
    onRestartRef.current = onRestart;
  });
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();
  const pageVisible = usePageVisible();
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [t, setT] = useState(0);
  const elapsed = useRef(0);
  const finished = until !== undefined && t >= until;
  const running = active && inView && pageVisible && !paused && !reduced && !finished;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.33) {
          setInView(true);
          setStarted(true);
        } else if (!entry.isIntersecting) {
          setInView(false);
        }
      },
      { threshold: [0, 0.33] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current += Math.min(Math.max(now - last, 0), 100);
      last = now;
      const next = until === undefined ? elapsed.current : Math.min(elapsed.current, until);
      setT(next);
      if (until === undefined || next < until) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, until]);

  const seek = useCallback((ms: number) => {
    elapsed.current = Math.max(0, ms);
    setT(elapsed.current);
  }, []);

  const restart = useCallback(() => {
    elapsed.current = 0;
    setT(0);
    setPaused(false);
  }, []);

  useEffect(() => {
    const onRestart = (event: Event) => {
      const target = (event as CustomEvent<{ page?: string }>).detail?.page;
      if (target === undefined || target === page) {
        restart();
        onRestartRef.current?.();
      }
    };
    window.addEventListener(RESTART_EVENT, onRestart);
    return () => window.removeEventListener(RESTART_EVENT, onRestart);
  }, [page, restart]);

  const togglePause = useCallback(() => setPaused((value) => !value), []);

  return { ref, t, paused, setPaused, togglePause, seek, restart, reduced, started };
}

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function ease(value: number) {
  const x = clamp01(value);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function phase(t: number, start: number, duration: number) {
  return clamp01((t - start) / duration);
}

export type Pt = [number, number];

export function along(points: Pt[], progress: number): Pt {
  const lengths: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const length = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    lengths.push(length);
    total += length;
  }
  let distance = clamp01(progress) * total;
  for (let i = 1; i < points.length; i++) {
    const length = lengths[i - 1];
    if (distance <= length || i === points.length - 1) {
      const k = length === 0 ? 0 : Math.min(1, distance / length);
      return [
        points[i - 1][0] + (points[i][0] - points[i - 1][0]) * k,
        points[i - 1][1] + (points[i][1] - points[i - 1][1]) * k,
      ];
    }
    distance -= length;
  }
  return points[points.length - 1];
}

/** Runs fn when the tour or a replay restarts the figures on this page. */
export function useRestartListener(page: string, fn: () => void) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  useEffect(() => {
    const onRestart = (event: Event) => {
      const target = (event as CustomEvent<{ page?: string }>).detail?.page;
      if (target === undefined || target === page) fnRef.current();
    };
    window.addEventListener(RESTART_EVENT, onRestart);
    return () => window.removeEventListener(RESTART_EVENT, onRestart);
  }, [page]);
}

/** True while at least a third of the element is on screen and the tab is visible. */
export function useInView<T extends Element>(ref: RefObject<T | null>, threshold = 0.33) {
  const [inView, setInView] = useState(false);
  const pageVisible = usePageVisible();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= threshold) setInView(true);
        else if (!entry.isIntersecting) setInView(false);
      },
      { threshold: [0, threshold] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView && pageVisible;
}

/** A clock that ticks every animation frame while running, for small moving parts. */
export function useTicker(running: boolean) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const start = performance.now();
    const tick = (time: number) => {
      setNow(time - start);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);
  return now;
}
