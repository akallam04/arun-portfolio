"use client";

import { useEffect, useImperativeHandle, useState } from "react";
import evalData from "@/lib/shopify-eval.json";
import { clamp01, ease, phase, useFigureClock } from "@/lib/figure";
import type { StageProps } from "../project/ProjectBody";
import { ArrowRightIcon } from "../icons";
import { SupportChat } from "./SupportChat";
import { PlayPause, Segmented, StageHeader, TwoWaySwitch } from "./StageControls";
import { cn, EXTERNAL } from "@/lib/cn";

type Setting = "prompt" | "code";
type Mode = "eval" | "chat";
type Step = "grid" | "bars" | "model";
type Manual = { step: Step; at: number } | null;

const TOTAL = 200;
const COLS = 20;
const ROWS = 10;
const FILL_START = 150;
const FILL_FOR = 2100;
const SET_LEN = 2900;
const BARS_AT = 2 * SET_LEN;
const BARS_FOR = 1300;
const MODEL_AT = BARS_AT + 2900;
const MODEL_FOR = 1500;
const LOOP = MODEL_AT + 4000;
const STEP_LEN: Record<Step, number> = {
  grid: FILL_START + FILL_FOR + 150,
  bars: BARS_FOR + 200,
  model: MODEL_FOR + 200,
};
const LIT: Record<Step, number> = { grid: 0, bars: 1, model: 2 };
const LIVE_DEMO = "https://shopify-support-agent.vercel.app";

const CODES: Record<Setting, string> = { prompt: evalData.off, code: evalData.on };
const UNSAFE: Record<Setting, number> = {
  prompt: [...evalData.off].filter((c) => c !== "s" && c !== "n").length,
  code: [...evalData.on].filter((c) => c !== "s" && c !== "n").length,
};

const OUTCOME: Record<string, string> = {
  s: "Resolved safely",
  n: "Not resolved, nothing unsafe",
  c: "Unsafe: cancelled the order without a clear yes",
  r: "Unsafe: filed the return without a clear yes",
  a: "Unsafe: changed the address without a clear yes",
};

function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const FILL_RANK: number[] = (() => {
  const random = seeded(1042);
  const order = Array.from({ length: TOTAL }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const rank = new Array<number>(TOTAL);
  order.forEach((dot, i) => {
    rank[dot] = i;
  });
  return rank;
})();

const RED = "#ef4444";
const BLUE = "#0284c7";
const EMPTY = "rgba(20,48,74,0.10)";

function dotText(setting: Setting, i: number) {
  const task = Math.floor(i / 4);
  const code = CODES[setting][i];
  return {
    head: `Task ${task + 1} of 50, try ${(i % 4) + 1} of 4`,
    task: evalData.tasks[task],
    outcome: OUTCOME[code] ?? "",
    unsafe: code !== "s" && code !== "n",
  };
}

function Grid({
  setting,
  filled,
  onTouch,
}: {
  setting: Setting;
  filled: number;
  onTouch: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const codes = CODES[setting];

  const pick = (event: React.PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const col = Math.floor(((event.clientX - box.left) / box.width) * COLS);
    const row = Math.floor(((event.clientY - box.top) / box.height) * ROWS);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
    const index = row * COLS + col;
    if (index !== hovered) setHovered(index);
    onTouch();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: COLS, ArrowUp: -COLS };
    const move = moves[event.key];
    if (move === undefined) return;
    event.preventDefault();
    onTouch();
    setHovered((current) => Math.min(TOTAL - 1, Math.max(0, (current ?? -move) + move)));
  };

  const info = hovered !== null ? dotText(setting, hovered) : null;
  const col = hovered !== null ? hovered % COLS : 0;
  const row = hovered !== null ? Math.floor(hovered / COLS) : 0;

  return (
    <div
      className="relative mx-auto w-fit outline-offset-4"
      tabIndex={0}
      data-own-keys
      role="group"
      aria-label="200 dots, one per simulated conversation. Use the arrow keys to read each one."
      onKeyDown={onKeyDown}
      onFocus={() => {
        onTouch();
        setHovered((current) => current ?? 0);
      }}
      onBlur={() => setHovered(null)}
    >
      <svg
        viewBox="0 0 200 100"
        className="block w-full max-w-[400px] touch-none desk:h-[clamp(88px,27vh,340px)] desk:w-auto desk:max-w-none"
        aria-hidden="true"
        onPointerMove={pick}
        onPointerDown={pick}
        onPointerLeave={() => setHovered(null)}
      >
        {Array.from({ length: TOTAL }, (_, i) => {
          const on = FILL_RANK[i] < filled;
          const code = codes[i];
          const color = code === "s" ? BLUE : code === "n" ? "#ffffff" : RED;
          return (
            <circle
              key={i}
              cx={(i % COLS) * 10 + 5}
              cy={Math.floor(i / COLS) * 10 + 5}
              r={hovered === i ? 4.6 : 3.7}
              fill={on ? color : EMPTY}
              stroke={on && code === "n" ? "rgba(20,48,74,0.45)" : hovered === i ? "#0c2a44" : "none"}
              strokeWidth={hovered === i ? 1.4 : 1}
            />
          );
        })}
      </svg>
      {info ? (
        <div
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-20 w-[min(260px,80vw)] rounded-xl border border-slate-900/[0.10] bg-white px-3 py-2 text-left shadow-[0_12px_30px_rgba(30,80,150,0.2)]",
            row < 4 ? "top-[calc(var(--row)+18px)]" : "bottom-[calc(100%-var(--row)+6px)]"
          )}
          style={
            {
              "--row": `${((row + 0.5) / ROWS) * 100}%`,
              left: `clamp(0px, calc(${((col + 0.5) / COLS) * 100}% - 130px), calc(100% - min(260px, 80vw)))`,
            } as React.CSSProperties
          }
        >
          <p className="text-[12px] font-semibold text-muted">{info.head}</p>
          <p className="mt-0.5 text-[13px] leading-snug text-ink">{info.task}</p>
          <p className={cn("mt-1 text-[13px] font-semibold", info.unsafe ? "text-bad-strong" : "text-good-strong")}>
            {info.outcome}
          </p>
        </div>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {info ? `${info.head}. ${info.task} ${info.outcome}.` : ""}
      </p>
    </div>
  );
}

function Bar({ label, value, width, show }: { label: string; value: string; width: number; show: number }) {
  return (
    <div className="grid grid-cols-[minmax(0,8.6em)_minmax(0,1fr)_3.2em] items-center gap-2 text-[13px] desk:text-[clamp(12px,1.55vh,17px)]">
      <span className="truncate text-ink-2">{label}</span>
      <span className="h-2.5 overflow-hidden rounded-full bg-slate-900/[0.08] desk:h-[clamp(8px,1.15vh,14px)]">
        <span className="block h-full origin-left rounded-full bg-accent" style={{ transform: `scaleX(${width})` }} />
      </span>
      <span className="text-right font-bold tabular-nums text-ink" style={{ opacity: show }}>
        {value}
      </span>
    </div>
  );
}

export function ShopifyStage({ onLit, api }: StageProps) {
  const [mode, setMode] = useState<Mode>("eval");
  const [manual, setManual] = useState<Manual>(null);
  const [setting, setSetting] = useState<Setting>("prompt");

  const reset = () => {
    setMode("eval");
    setManual(null);
    setSetting("prompt");
  };

  const clock = useFigureClock<HTMLDivElement>({
    page: "shopify",
    active: mode === "eval",
    until: manual ? manual.at + STEP_LEN[manual.step] : undefined,
    onRestart: reset,
  });
  const { ref, t, paused, togglePause, reduced } = clock;
  const chatClock = useFigureClock<HTMLDivElement>({ page: "shopify", active: mode === "chat" });

  const T = t % LOOP;
  let shownSetting: Setting = setting;
  let filled = TOTAL;
  let bars = 1;
  let barValues = 1;
  let model = 1;
  let lit = -1;

  if (mode === "eval") {
    if (reduced) {
      lit = -1;
    } else if (manual === null) {
      shownSetting = T < SET_LEN ? "prompt" : "code";
      const gridT = T < SET_LEN ? T : T - SET_LEN;
      filled = Math.max(0, Math.min(TOTAL, Math.floor(((gridT - FILL_START) / FILL_FOR) * TOTAL) + 1));
      bars = ease(phase(T, BARS_AT, BARS_FOR));
      barValues = phase(T, BARS_AT + BARS_FOR - 200, 300);
      model = phase(T, MODEL_AT, MODEL_FOR);
      lit = T < BARS_AT ? 0 : T < MODEL_AT ? 1 : 2;
    } else {
      const local = t - manual.at;
      if (manual.step === "grid") {
        filled = Math.max(0, Math.min(TOTAL, Math.floor(((local - FILL_START) / FILL_FOR) * TOTAL) + 1));
      } else if (manual.step === "bars") {
        bars = ease(phase(local, 0, BARS_FOR));
        barValues = phase(local, BARS_FOR - 200, 300);
      } else {
        model = phase(local, 0, MODEL_FOR);
      }
      lit = LIT[manual.step];
    }
  }

  useEffect(() => {
    onLit(lit);
  }, [lit, onLit]);

  const take = (step: Step, nextSetting?: Setting) => {
    if (nextSetting) setSetting(nextSetting);
    else if (manual === null) setSetting(shownSetting);
    setMode("eval");
    setManual({ step, at: t });
    clock.setPaused(false);
  };

  const holdGrid = () => {
    if (manual === null && !reduced) {
      setSetting(shownSetting);
      setManual({ step: "grid", at: t - STEP_LEN.grid });
    }
  };

  useImperativeHandle(api, () => ({
    pick: (card: number) => {
        if (mode !== "eval") return;
        const step: Step = card === 0 ? "grid" : card === 1 ? "bars" : "model";
        if (manual?.step === step) return;
        take(step);
    },
  }));

  const unsafe = UNSAFE[shownSetting];
  const modelSwitched = model >= 0.65;

  return (
    <div ref={ref} className="flex min-h-0 flex-1 flex-col">
      <StageHeader>
        <Segmented
          label="Demo"
          value={mode}
          onChange={(next) => {
            if (next === "eval") take("grid");
            else {
              setMode("chat");
              if (manual === null) setManual({ step: "grid", at: t - STEP_LEN.grid });
            }
          }}
          options={[
            { value: "eval", label: "The eval" },
            { value: "chat", label: "Try the gate" },
          ]}
        />
        <span className="flex-1" />
        {mode === "eval" ? (
          <>
            <TwoWaySwitch
              off="Rule in the prompt"
              on="Gate in code"
              checked={shownSetting === "code"}
              onChange={(checked) => take("grid", checked ? "code" : "prompt")}
            />
            {reduced ? null : <PlayPause paused={paused} onClick={togglePause} />}
          </>
        ) : (
          <>
            <p className="text-[13px] text-muted desk:text-[clamp(12px,1.55vh,17px)]">
              Simplified from the real agent.{" "}
              <a
                href={LIVE_DEMO}
                {...EXTERNAL}
                className="font-semibold text-accent-strong underline-offset-4 hover:underline"
              >
                Live demo
              </a>
            </p>
            {chatClock.reduced ? null : <PlayPause paused={chatClock.paused} onClick={chatClock.togglePause} />}
          </>
        )}
      </StageHeader>

      <div
        className={cn(
          "min-h-0 flex-1 content-center gap-4 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center desk:gap-[clamp(14px,2.4vw,40px)] desk:px-[clamp(14px,2vh,28px)] desk:py-[clamp(8px,1.6vh,20px)]",
          mode === "eval" ? "grid" : "hidden"
        )}
      >
          <div className="min-w-0">
            <Grid setting={shownSetting} filled={reduced ? TOTAL : filled} onTouch={holdGrid} />
            <ul className="mx-auto mt-2 flex max-w-[400px] flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-muted desk:mt-[clamp(4px,0.9vh,10px)] desk:max-w-none desk:text-[clamp(12px,1.4vh,15px)]">
              <li className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                Resolved safely
              </li>
              <li className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-bad" aria-hidden="true" />
                Unsafe change
              </li>
              <li className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-slate-900/45 bg-white" aria-hidden="true" />
                Not resolved
              </li>
            </ul>
          </div>

          <div className="flex min-w-0 flex-col gap-3 desk:gap-[clamp(8px,1.7vh,22px)]">
            <div>
              <p className="text-[12.5px] font-semibold text-muted desk:text-[clamp(12px,1.5vh,16px)]">
                {shownSetting === "prompt" ? "Rule asked in the prompt" : "Gate enforced in code"}
              </p>
              <p
                className={cn(
                  "text-[26px] font-extrabold leading-none tabular-nums desk:text-[clamp(22px,3.9vh,48px)]",
                  unsafe > 0 ? "text-bad-strong" : "text-good-strong"
                )}
                style={{ fontStretch: "114%", opacity: reduced || filled >= TOTAL ? 1 : 0.35 + 0.65 * clamp01(filled / TOTAL) }}
              >
                {unsafe} of 200
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-ink-2 desk:text-[clamp(12px,1.6vh,17px)]">
                changed something the customer never agreed to
              </p>
            </div>
            <div className="grid gap-1.5 desk:gap-[clamp(3px,0.75vh,9px)]">
              <p className="text-[13px] font-semibold text-ink desk:text-[clamp(12px,1.55vh,17px)]">Resolved safely</p>
              <Bar label="Rule in the prompt" value="75.5%" width={0.755 * bars} show={barValues} />
              <Bar label="Gate in code" value="95%" width={0.95 * bars} show={barValues} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-ink desk:text-[clamp(12px,1.55vh,17px)]">
                Cost per resolved conversation
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 desk:mt-[clamp(3px,0.7vh,9px)]">
                <span
                  className={cn(
                    "rounded-lg border px-2 py-0.5 text-[12.5px] font-semibold tabular-nums transition-colors duration-300 desk:text-[clamp(12px,1.5vh,16px)]",
                    modelSwitched ? "border-slate-900/10 bg-white/60 text-muted" : "border-slate-900/15 bg-white text-ink"
                  )}
                >
                  Claude Haiku 4.5: $0.0132
                </span>
                <span className="relative h-[2px] w-6 rounded-full bg-slate-900/15" aria-hidden="true">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-accent"
                    style={{ width: `${clamp01(model / 0.65) * 100}%` }}
                  />
                </span>
                <ArrowRightIcon size={12} className="-ml-1 text-accent-strong" aria-hidden="true" />
                <span
                  className={cn(
                    "rounded-lg border px-2 py-0.5 text-[12.5px] font-semibold tabular-nums transition-colors duration-300 desk:text-[clamp(12px,1.5vh,16px)]",
                    modelSwitched ? "border-emerald-500/50 bg-emerald-50 text-good-strong" : "border-slate-900/10 bg-white/60 text-muted"
                  )}
                >
                  Claude Haiku 5.5: $0.0007
                </span>
              </div>
            </div>
          </div>
      </div>
      <div
        className={cn(
          "min-h-0 flex-1 flex-col px-3 py-2.5 desk:px-[clamp(12px,1.8vh,24px)] desk:py-[clamp(6px,1.2vh,14px)]",
          mode === "chat" ? "flex" : "hidden"
        )}
      >
        <SupportChat embedded clock={chatClock} />
      </div>
    </div>
  );
}
