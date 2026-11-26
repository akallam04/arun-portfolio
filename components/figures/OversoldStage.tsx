"use client";

import { useEffect, useImperativeHandle, useState } from "react";
import { clamp01, phase, useFigureClock } from "@/lib/figure";
import type { StageProps } from "../project/ProjectBody";
import { PauseIcon, PlayIcon } from "../icons";
import { Segmented, SmallButton, StageHeader, TwoWaySwitch } from "./StageControls";
import { cn } from "@/lib/cn";

type Scenario = "lastUnit" | "cart";
type Manual = {
  scenario: Scenario;
  fixed: boolean;
  m0: number;
  at: number;
  playing: boolean;
  speed: 1 | 0.5;
  card?: number;
} | null;

/** Saved runs from the Oversold walkthrough and results README. */
const RACE = {
  released: { sentA: 0.005, sentB: 0.014, endA: 127.1, endB: 127.1, max: 127.1 },
  fixed: { endA: 121, endB: 128, max: 128 },
};
const RELEASES = [
  { name: "2.19.0", lastUnit: 30, cart: 30 },
  { name: "2.21.2", lastUnit: 28, cart: 30 },
  { name: "2.22.0", lastUnit: 29, cart: 30 },
];
const FIX = { lastUnit: "#17420", cart: "#16961" };

const RACE_REAL = 2600;
const STRIP_STEP = 22;
const CART_LEN = 2600;

const A_START = 400;
const A_STRIPS = A_START + RACE_REAL + 400;
const B_AT = 6200;
const B_START = B_AT + 400;
const B_STRIPS = B_START + RACE_REAL + 300;
const C_AT = 11000;
const C_STRIPS = C_AT + CART_LEN + 200;
const D_AT = 16000;
const D_STRIPS = D_AT + CART_LEN + 200;
const LOOP = 20500;

type View = {
  scenario: Scenario;
  fixed: boolean;
  m: number;
  cart: number;
  strips: number;
  playing: boolean;
  lit: number;
};

function autoView(T: number): View {
  if (T < B_AT) {
    const m = clamp01((T - A_START) / RACE_REAL) * RACE.released.max;
    const strips = Math.max(0, Math.floor((T - A_STRIPS) / STRIP_STEP) + 1);
    return { scenario: "lastUnit", fixed: false, m, cart: 0, strips, playing: true, lit: T < A_STRIPS ? 1 : 0 };
  }
  if (T < C_AT) {
    const m = clamp01((T - B_START) / RACE_REAL) * RACE.fixed.max;
    const strips = Math.max(0, Math.floor((T - B_STRIPS) / STRIP_STEP) + 1);
    return { scenario: "lastUnit", fixed: true, m, cart: 0, strips, playing: true, lit: 2 };
  }
  if (T < D_AT) {
    const strips = Math.max(0, Math.floor((T - C_STRIPS) / STRIP_STEP) + 1);
    return { scenario: "cart", fixed: false, m: 0, cart: clamp01((T - C_AT) / CART_LEN), strips, playing: true, lit: T < C_STRIPS ? 1 : 0 };
  }
  const strips = Math.max(0, Math.floor((T - D_STRIPS) / STRIP_STEP) + 1);
  return { scenario: "cart", fixed: true, m: 0, cart: clamp01((T - D_AT) / CART_LEN), strips, playing: true, lit: 2 };
}

function raceMs(manual: NonNullable<Manual>, t: number) {
  const max = manual.fixed ? RACE.fixed.max : RACE.released.max;
  if (!manual.playing) return manual.m0;
  return Math.min(max, manual.m0 + ((t - manual.at) / RACE_REAL) * max * manual.speed);
}

function manualUntil(manual: NonNullable<Manual>) {
  if (manual.scenario === "cart") return manual.at + CART_LEN + 100;
  if (!manual.playing) return manual.at;
  const max = manual.fixed ? RACE.fixed.max : RACE.released.max;
  return manual.at + ((max - manual.m0) / (max * manual.speed)) * RACE_REAL + 50;
}

/* ---------- race pieces ---------- */

type Side = { leg: "out" | "db" | "back" | "home" | null; p: number; done: boolean; turnedAway: boolean; end: number };

function side(m: number, end: number, turnedAway: boolean): Side {
  if (m <= 0) return { leg: null, p: 0, done: false, turnedAway, end };
  if (m < 24) return { leg: "out", p: m / 24, done: false, turnedAway, end };
  if (m < 52) return { leg: "db", p: (m - 24) / 28, done: false, turnedAway, end };
  const backStart = end - 30;
  if (m < backStart) return { leg: null, p: 0, done: false, turnedAway, end };
  if (m < end - 15) return { leg: "back", p: (m - backStart) / 15, done: false, turnedAway, end };
  if (m < end) return { leg: "home", p: (m - (end - 15)) / 15, done: false, turnedAway, end };
  return { leg: null, p: 0, done: true, turnedAway, end };
}

function Phone({ name, s, pressed }: { name: string; s: Side; pressed: boolean }) {
  const away = s.done && s.turnedAway;
  return (
    <div className="glass-soft flex w-[clamp(112px,30vw,150px)] shrink-0 flex-col items-center rounded-[18px] px-2 pb-2 pt-1.5 desk:w-[clamp(96px,14.5vh,190px)] desk:px-[clamp(6px,1vh,12px)] desk:pb-[clamp(5px,0.9vh,12px)]">
      <p className="text-[12px] font-medium text-muted desk:text-[clamp(12px,1.45vh,15px)]">{name}</p>
      <p className="mt-1 text-[12px] font-semibold text-ink desk:text-[clamp(12px,1.45vh,16px)]">1 left in stock</p>
      <div className="mt-1.5 grid w-full place-items-center text-center">
        <p
          aria-hidden={!s.done}
          className={cn(
            "text-[12px] font-semibold leading-tight [grid-area:1/1] desk:text-[clamp(12px,1.4vh,15px)]",
            away ? "text-bad-strong" : "text-good-strong",
            !s.done && "invisible"
          )}
        >
          {away ? "Not enough stock available" : "Order confirmed"}, after {Math.round(s.end)} ms
        </p>
        <span
          aria-hidden={s.done}
          className={cn(
            "w-full rounded-xl px-2 py-1.5 text-[12px] font-semibold text-white transition-colors [grid-area:1/1] desk:py-[clamp(4px,0.85vh,10px)] desk:text-[clamp(12px,1.45vh,16px)]",
            pressed ? "bg-accent-strong" : "bg-accent",
            s.done && "invisible"
          )}
          style={{ transform: pressed ? "scale(0.96)" : undefined }}
        >
          Place order
        </span>
      </div>
    </div>
  );
}

function Box({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "glass-soft shrink-0 rounded-[14px] px-2.5 py-2 text-center text-[12.5px] font-semibold text-ink desk:px-[clamp(8px,1.3vh,16px)] desk:py-[clamp(5px,1.1vh,13px)] desk:text-[clamp(12px,1.55vh,17px)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function Glow() {
  return (
    <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_5px_rgba(14,165,233,0.22),0_0_14px_4px_rgba(14,165,233,0.45)]" />
  );
}

function Wire({ p, vertical }: { p: number | null; vertical?: boolean }) {
  return (
    <div className={cn("relative", vertical ? "h-6 w-px self-center" : "h-px min-w-3 flex-1")}>
      <span
        className={cn(
          "absolute border-slate-900/30",
          vertical ? "inset-y-0 left-0 border-l-2 border-dotted" : "inset-x-0 top-0 border-t-2 border-dotted"
        )}
      />
      {p !== null ? (
        <span className="absolute" style={vertical ? { top: `${p * 100}%`, left: 1 } : { left: `${p * 100}%`, top: 1 }}>
          <Glow />
        </span>
      ) : null}
    </div>
  );
}

function DbLabel({ text, tone, shake }: { text: string; tone: "plain" | "bad" | "good"; shake: number }) {
  return (
    <p
      className={cn(
        "mt-1.5 rounded-xl border px-2.5 py-1 text-center text-[13px] font-bold transition-colors desk:px-[clamp(8px,1.3vh,16px)] desk:py-[clamp(3px,0.65vh,8px)] desk:text-[clamp(12px,1.7vh,19px)]",
        tone === "bad"
          ? "border-red-400/60 bg-red-50 text-bad-strong"
          : tone === "good"
            ? "border-emerald-500/50 bg-emerald-50 text-good-strong"
            : "border-slate-900/[0.12] bg-white text-ink"
      )}
      style={{ transform: shake ? `translateX(${shake}px)` : undefined }}
    >
      {text}
    </p>
  );
}

function Database({ label }: { label: React.ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="relative w-[clamp(84px,24vw,104px)] desk:w-[clamp(76px,11vh,140px)]">
        <svg viewBox="0 0 100 80" className="block w-full" aria-hidden="true">
          <path
            d="M6 14v48c0 7 19.7 12 44 12s44-5 44-12V14"
            fill="rgba(255,255,255,0.75)"
            stroke="rgba(20,48,74,0.28)"
            strokeWidth="1.5"
          />
          <ellipse cx="50" cy="14" rx="44" ry="10" fill="rgba(240,248,255,0.95)" stroke="rgba(20,48,74,0.28)" strokeWidth="1.5" />
        </svg>
        <p className="absolute inset-x-0 top-[38%] px-1 text-center text-[12px] font-medium leading-tight text-ink-2 desk:text-[clamp(12px,1.4vh,15px)]">
          Shared database
        </p>
      </div>
      {label}
    </div>
  );
}

function Race({ m, fixed }: { m: number; fixed: boolean }) {
  const a = fixed ? side(m, RACE.fixed.endA, false) : side(m, RACE.released.endA, false);
  const b = fixed ? side(m, RACE.fixed.endB, true) : side(m, RACE.released.endB, false);
  const pressed = m > 0 && m < 6;
  const first = fixed ? RACE.fixed.endA : RACE.released.endA;
  const flipped = m >= first;
  const shakeP = clamp01((m - first) / 6);
  const shake = !fixed && flipped && shakeP < 1 ? 4 * Math.sin(shakeP * Math.PI * 6) * (1 - shakeP) : 0;
  const label = (
    <DbLabel
      text={!flipped ? "1 item left" : fixed ? "1 order for 1 item" : "2 orders for 1 item"}
      tone={!flipped ? "plain" : fixed ? "good" : "bad"}
      shake={shake}
    />
  );
  const wire = (s: Side, near: "phone" | "server") => {
    if (near === "phone") return s.leg === "out" ? s.p : s.leg === "home" ? 1 - s.p : null;
    return s.leg === "db" ? s.p : s.leg === "back" ? 1 - s.p : null;
  };
  const flip = (value: number | null) => (value === null ? null : 1 - value);
  return (
    <>
      <div className="hidden items-center sm:flex" aria-hidden="true">
        <Phone name="Shopper A" s={a} pressed={pressed} />
        <Wire p={wire(a, "phone")} />
        <Box>Server 1</Box>
        <Wire p={wire(a, "server")} />
        <Database label={label} />
        <Wire p={flip(wire(b, "server"))} />
        <Box>Server 2</Box>
        <Wire p={flip(wire(b, "phone"))} />
        <Phone name="Shopper B" s={b} pressed={pressed} />
      </div>
      <div className="grid grid-cols-2 justify-items-center gap-x-3 sm:hidden" aria-hidden="true">
        <Phone name="Shopper A" s={a} pressed={pressed} />
        <Phone name="Shopper B" s={b} pressed={pressed} />
        <Wire vertical p={wire(a, "phone")} />
        <Wire vertical p={wire(b, "phone")} />
        <Box>Server 1</Box>
        <Box>Server 2</Box>
        <Wire vertical p={wire(a, "server")} />
        <Wire vertical p={wire(b, "server")} />
        <div className="col-span-2">
          <Database label={label} />
        </div>
      </div>
    </>
  );
}

function Cart({ p, fixed }: { p: number; fixed: boolean }) {
  const line1 = phase(p, 0.05, 0.12);
  const line2 = phase(p, 0.2, 0.12);
  const total = phase(p, 0.36, 0.12);
  const send = p >= 0.5 && p < 0.78 ? (p - 0.5) / 0.28 : null;
  const done = p >= 0.8;
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center" aria-hidden="true">
      <div className="glass-soft w-full max-w-[240px] shrink-0 rounded-[18px] px-3 py-2 desk:max-w-none desk:w-[clamp(170px,26vh,300px)] desk:px-[clamp(10px,1.5vh,18px)] desk:py-[clamp(6px,1.2vh,14px)]">
        <p className="text-[12px] font-medium text-muted desk:text-[clamp(12px,1.45vh,15px)]">One shopper&apos;s cart</p>
        <div className="mt-1 grid gap-0.5 text-[12.5px] text-ink desk:text-[clamp(12px,1.55vh,17px)]">
          <p className="flex justify-between gap-2" style={{ opacity: line1 }}>
            <span>4 single widgets</span>
            <span className="tabular-nums text-muted">4</span>
          </p>
          <p className="flex justify-between gap-2" style={{ opacity: line2 }}>
            <span>2 two-packs</span>
            <span className="tabular-nums text-muted">4</span>
          </p>
          <p className="flex justify-between gap-2 border-t border-slate-900/10 pt-0.5 font-bold" style={{ opacity: total }}>
            <span>Needs</span>
            <span className="tabular-nums">8 widgets</span>
          </p>
        </div>
        <div className="mt-1.5 grid text-center">
          <p
            className={cn(
              "text-[12px] font-semibold leading-tight [grid-area:1/1] desk:text-[clamp(12px,1.4vh,15px)]",
              fixed ? "text-good-strong" : "text-bad-strong",
              !done && "invisible"
            )}
          >
            {fixed ? "Not enough stock available" : "Order confirmed, after 140 ms"}
          </p>
          <span
            className={cn(
              "rounded-xl bg-accent px-2 py-1 text-[12px] font-semibold text-white [grid-area:1/1] desk:text-[clamp(12px,1.45vh,16px)]",
              done && "invisible"
            )}
          >
            Place order
          </span>
        </div>
      </div>
      <div className="hidden w-full min-w-6 flex-1 sm:block">
        <Wire p={send} />
      </div>
      <Database
        label={
          <DbLabel
            text={!done ? "6 widgets in stock" : fixed ? "Cart refused" : "8 held, 6 in stock"}
            tone={!done ? "plain" : fixed ? "good" : "bad"}
            shake={0}
          />
        }
      />
    </div>
  );
}

function Strips({ scenario, fixed, filled }: { scenario: Scenario; fixed: boolean; filled: number }) {
  const rows = fixed
    ? [{ name: `2.22.0 + fix ${FIX[scenario]}`, red: 0 }]
    : RELEASES.map((release) => ({ name: release.name, red: scenario === "lastUnit" ? release.lastUnit : release.cart }));
  const title =
    scenario === "lastUnit"
      ? fixed
        ? "Last unit sold twice, with its community fix"
        : "Last unit sold twice, 30 runs per Medusa release"
      : fixed
        ? "Cart of 8 accepted, with its community fix"
        : "Cart of 8 accepted with 6 in stock, 30 runs per Medusa release";
  return (
    <div className="min-w-0">
      <p className="text-[12.5px] font-semibold text-ink desk:text-[clamp(12px,1.55vh,17px)]">{title}</p>
      <ul className="mt-1 grid gap-1 desk:gap-[clamp(2px,0.5vh,6px)]">
        {rows.map((row, r) => (
          <li
            key={row.name}
            className={cn(
              "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 text-[12.5px] desk:text-[clamp(12px,1.5vh,16px)]",
              fixed ? "sm:grid-cols-[13.5em_minmax(0,auto)_auto]" : "sm:grid-cols-[8.6em_minmax(0,auto)_auto]"
            )}
          >
            <span className="truncate text-ink-2">Medusa {row.name}</span>
            <span className="order-last col-span-2 flex flex-wrap gap-[3px] sm:order-none sm:col-span-1 desk:gap-[clamp(2px,0.35vh,4px)]" aria-hidden="true">
              {Array.from({ length: 30 }, (_, i) => {
                const index = r * 30 + i;
                return (
                  <span
                    key={i}
                    className={cn(
                      "block h-[7px] w-[7px] rounded-full desk:h-[clamp(6px,1vh,12px)] desk:w-[clamp(6px,1vh,12px)]",
                      index >= filled ? "bg-slate-900/[0.09]" : i < row.red ? "bg-bad" : fixed ? "bg-good" : "bg-accent"
                    )}
                  />
                );
              })}
            </span>
            <span
              className={cn("text-right font-bold tabular-nums", row.red > 0 ? "text-bad-strong" : "text-good-strong")}
              style={{ opacity: filled >= (r + 1) * 30 ? 1 : 0.25 }}
            >
              {row.red} of 30{fixed ? " oversold" : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OversoldStage({ onLit, api }: StageProps) {
  const [manual, setManual] = useState<Manual>(null);
  const clock = useFigureClock<HTMLDivElement>({
    page: "oversold",
    until: manual ? manualUntil(manual) : undefined,
    onRestart: () => setManual(null),
  });
  const { ref, t, reduced } = clock;

  let view: View;
  if (reduced) {
    const scenario = manual?.scenario ?? "lastUnit";
    const fixed = manual?.fixed ?? false;
    const max = fixed ? RACE.fixed.max : RACE.released.max;
    view = {
      scenario,
      fixed,
      m: manual && scenario === "lastUnit" ? manual.m0 : max,
      cart: 1,
      strips: 90,
      playing: false,
      lit: -1,
    };
  } else if (manual === null) {
    view = autoView(t % LOOP);
  } else {
    const m = manual.scenario === "lastUnit" ? raceMs(manual, t) : 0;
    view = {
      scenario: manual.scenario,
      fixed: manual.fixed,
      m,
      cart: manual.scenario === "cart" ? clamp01((t - manual.at) / CART_LEN) : 0,
      strips: 90,
      playing: manual.playing && t < manualUntil(manual) - 50,
      lit: manual.card ?? (manual.fixed ? 2 : 1),
    };
  }

  useEffect(() => {
    onLit(view.lit);
  }, [view.lit, onLit]);

  const max = view.fixed ? RACE.fixed.max : RACE.released.max;

  const choose = (scenario: Scenario, fixed: boolean, opts: { m0?: number; playing?: boolean; card?: number } = {}) => {
    setManual({
      scenario,
      fixed,
      m0: opts.m0 ?? 0,
      at: t,
      playing: opts.playing ?? true,
      speed: manual?.speed ?? 1,
      card: opts.card,
    });
    clock.setPaused(false);
  };

  const togglePlay = () => {
    if (view.scenario !== "lastUnit") return;
    if (view.playing) {
      setManual({ scenario: view.scenario, fixed: view.fixed, m0: view.m, at: t, playing: false, speed: manual?.speed ?? 1 });
    } else {
      const from = view.m >= max - 0.05 ? 0 : view.m;
      choose(view.scenario, view.fixed, { m0: from, playing: true });
    }
  };

  const setSpeed = () => {
    const speed: 1 | 0.5 = (manual?.speed ?? 1) === 1 ? 0.5 : 1;
    setManual({ scenario: view.scenario, fixed: view.fixed, m0: view.m, at: t, playing: view.playing, speed });
    clock.setPaused(false);
  };

  useImperativeHandle(api, () => ({
    pick: (card: number) => {
        if (card === 0) {
          if (manual?.card === 0) return;
          choose("lastUnit", false, { m0: RACE.released.max, playing: false, card: 0 });
        } else if (card === 1) {
          if (manual && manual.scenario === "lastUnit" && !manual.fixed && manual.playing) return;
          choose("lastUnit", false);
        } else {
          if (manual && manual.fixed && manual.playing) return;
          choose(view.scenario, true);
        }
    },
  }));

  const speedHalf = (manual?.speed ?? 1) === 0.5;
  const marks = view.fixed
    ? { left: null, right: "A confirmed at 121 ms, B turned away at 128 ms" }
    : { left: "Sent 0.01 ms apart", right: "Both confirmed at 127 ms" };

  return (
    <div ref={ref} className="flex min-h-0 flex-1 flex-col">
      <StageHeader>
        <Segmented
          label="Scenario"
          value={view.scenario}
          onChange={(scenario) => choose(scenario, view.fixed)}
          options={[
            { value: "lastUnit", label: "Last unit, two servers" },
            { value: "cart", label: "Multi-line cart" },
          ]}
        />
        <span className="flex-1" />
        <TwoWaySwitch
          off="As released"
          on="With its community fix"
          checked={view.fixed}
          onChange={(fixed) => choose(view.scenario, fixed)}
        />
      </StageHeader>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 px-3 pb-3 pt-2 desk:gap-[clamp(6px,1.3vh,18px)] desk:px-[clamp(12px,1.8vh,24px)] desk:pb-[clamp(8px,1.4vh,18px)] desk:pt-[clamp(6px,1vh,12px)]">
        {view.scenario === "lastUnit" ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 desk:gap-[clamp(6px,1vh,12px)]">
              {reduced ? null : (
                <>
                  <SmallButton onClick={togglePlay} label={view.playing ? "Pause the race" : "Play the race"}>
                    {view.playing ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
                    {view.playing ? "Pause" : "Play"}
                  </SmallButton>
                  <SmallButton onClick={setSpeed} pressed={speedHalf} label="Half speed">
                    0.5x
                  </SmallButton>
                </>
              )}
              <input
                type="range"
                min={0}
                max={max}
                step={0.1}
                value={Math.min(max, view.m)}
                aria-label="Race time in milliseconds"
                aria-valuetext={`${view.m.toFixed(1)} ms`}
                onChange={(event) =>
                  setManual({
                    scenario: "lastUnit",
                    fixed: view.fixed,
                    m0: Number(event.currentTarget.value),
                    at: t,
                    playing: false,
                    speed: manual?.speed ?? 1,
                  })
                }
                className="race-scrubber min-w-0 flex-1"
              />
              <span className="w-[5.2em] shrink-0 text-right text-[13px] font-bold tabular-nums text-ink desk:text-[clamp(12px,1.6vh,17px)]">
                {view.m.toFixed(1)} ms
              </span>
            </div>
            <div className="flex justify-between gap-3 text-[12px] font-medium text-accent-strong desk:text-[clamp(12px,1.4vh,15px)]">
              <span>{marks.left ?? ""}</span>
              <span className="text-right">{marks.right}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {reduced ? null : (
              <SmallButton onClick={() => choose("cart", view.fixed)} label="Replay the checkout">
                <PlayIcon size={12} />
                Replay
              </SmallButton>
            )}
            <p className="text-[12.5px] text-ink-2 desk:text-[clamp(12px,1.55vh,17px)]">
              One checkout, with nothing else happening at the same time.
            </p>
          </div>
        )}

        {view.scenario === "lastUnit" ? <Race m={view.m} fixed={view.fixed} /> : <Cart p={view.cart} fixed={view.fixed} />}

        <Strips scenario={view.scenario} fixed={view.fixed} filled={view.strips} />
      </div>
    </div>
  );
}
