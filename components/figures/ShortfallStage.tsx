"use client";

import { useEffect, useImperativeHandle, useState } from "react";
import { clamp01, ease, phase, useFigureClock } from "@/lib/figure";
import type { StageProps } from "../project/ProjectBody";
import { CheckIcon, CloseIcon } from "../icons";
import { PlayPause, SmallButton, StageHeader } from "./StageControls";
import { cn } from "@/lib/cn";

type Run = "released" | "fixed";
type Manual = {
  released: number | null;
  fixed: number | null;
  row: number | null;
  rowsAt: number | null;
  focus: number;
} | null;

const LINES = [
  { text: "reading the checkout code", start: 250, end: 1250 },
  { text: "writing a test: two shoppers, last item", start: 1450, end: 2750 },
  { text: "running it on a local copy via Oversold", start: 2950, end: 4150 },
];

const RUN_FOR = 700;
const AUTO_RELEASED = 4350;
const AUTO_FIXED = 5300;
const STAMP_FOR = 450;
const ROWS_AT = 7000;
const DOT_STEP = 55;
const ROW_GAP = 260;
const ROWS_FOR = 3 * ROW_GAP + 10 * DOT_STEP + 250;
const NOTE_AT = ROWS_AT + ROWS_FOR + 300;
const CARD3_AT = 11000;
const LOOP = 15000;
const FADE_AT = LOOP - 500;

const TRIALS = [
  {
    label: "Test grid, no AI",
    hits: 10,
    note: "A fixed list of 32 test shapes, shuffled each trial. It was designed knowing what these bugs look like.",
  },
  {
    label: "Claude Haiku 5.5",
    hits: 3,
    note: "The main trials, with no bug report. Each try took about 4 minutes.",
  },
  {
    label: "Haiku, couldn't stop early",
    hits: 7,
    note: "A follow-up set in advance: the same agent had to use its whole budget.",
  },
  {
    label: "Claude Sonnet 5.5",
    hits: 9,
    note: "A follow-up set in advance: a bigger model on the same prompt, at about 40 US cents a try.",
  },
];
const FOLLOW_UP = "Follow-ups were set in advance. Neither gap passed the planned test.";

type RunState = "idle" | "running" | "done";

function runState(start: number | null, t: number): RunState {
  if (start === null || t < start) return "idle";
  return t < start + RUN_FOR ? "running" : "done";
}

function Terminal({ time, still }: { time: number; still: boolean }) {
  const blink = Math.floor(time / 450) % 2 === 0;
  return (
    <div className="rounded-[16px] border border-slate-900/[0.10] bg-[#0f2a43]/[0.92] px-3 py-2 font-mono text-[12px] leading-[1.55] text-sky-100 desk:px-[clamp(10px,1.5vh,18px)] desk:py-[clamp(6px,1.1vh,12px)] desk:text-[clamp(12px,1.7vh,18px)]">
      {LINES.map((line, i) => {
        const p = still ? 1 : phase(time, line.start, line.end - line.start);
        const shown = still ? line.text : line.text.slice(0, Math.floor(line.text.length * p));
        const typing = !still && time >= line.start && time < line.end + (i === LINES.length - 1 ? 900 : 200);
        return (
          <p key={line.text} className="whitespace-pre-wrap" style={{ opacity: still || time >= line.start ? 1 : 0 }}>
            <span className="text-sky-400" aria-hidden="true">
              ›{" "}
            </span>
            {shown}
            {typing && blink ? <span className="ml-px inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] bg-sky-300/80" /> : null}
          </p>
        );
      })}
    </div>
  );
}

function ResultPanel({ title, state, good }: { title: string; state: RunState; good: boolean }) {
  const done = state === "done";
  return (
    <div
      className={cn(
        "glass-soft flex min-w-0 flex-col justify-between rounded-[16px] px-3 py-2 transition-colors duration-300 desk:px-[clamp(10px,1.4vh,18px)] desk:py-[clamp(6px,1.1vh,13px)]",
        done && (good ? "border-emerald-500/50 bg-emerald-50/80" : "border-red-400/50 bg-red-50/80")
      )}
    >
      <p className="text-[12.5px] font-semibold leading-snug text-ink desk:text-[clamp(12px,1.55vh,17px)]">{title}</p>
      <div className="mt-1 grid text-[14px] font-bold desk:text-[clamp(12.5px,1.75vh,19px)]">
        <p
          aria-hidden={!done}
          className={cn("flex items-center gap-1.5 [grid-area:1/1]", good ? "text-good-strong" : "text-bad-strong", !done && "invisible")}
        >
          {good ? <CheckIcon size={15} /> : <CloseIcon size={15} />}
          {good ? "Rule held" : "Rule broken"}
        </p>
        <p aria-hidden={state !== "running"} className={cn("text-accent-strong [grid-area:1/1]", state !== "running" && "invisible")}>
          Running the test
        </p>
        <p aria-hidden={state !== "idle"} className={cn("font-medium text-muted [grid-area:1/1]", state !== "idle" && "invisible")}>
          Not run yet
        </p>
      </div>
    </div>
  );
}

export function ShortfallStage({ onLit, api }: StageProps) {
  const [manual, setManual] = useState<Manual>(null);

  const until = (() => {
    if (!manual) return undefined;
    const ends = [manual.released, manual.fixed].filter((v): v is number => v !== null).map((v) => v + RUN_FOR + 60);
    if (manual.released !== null && manual.fixed !== null) {
      ends.push(Math.max(manual.released, manual.fixed) + RUN_FOR + STAMP_FOR + 60);
    }
    if (manual.rowsAt !== null) ends.push(manual.rowsAt + ROWS_FOR + 60);
    return ends.length ? Math.max(...ends) : 0;
  })();

  const clock = useFigureClock<HTMLDivElement>({
    page: "shortfall",
    until,
    onRestart: () => setManual(null),
  });
  const { ref, t, paused, togglePause, reduced } = clock;
  const T = t % LOOP;
  const auto = manual === null && !reduced;

  const released: RunState = reduced
    ? manual === null || manual.released !== null
      ? "done"
      : "idle"
    : auto
      ? runState(AUTO_RELEASED, T)
      : runState(manual?.released ?? null, t);
  const fixed: RunState = reduced
    ? manual === null || manual.fixed !== null
      ? "done"
      : "idle"
    : auto
      ? runState(AUTO_FIXED, T)
      : runState(manual?.fixed ?? null, t);
  const both = released === "done" && fixed === "done";
  const one = (released === "done") !== (fixed === "done") && released !== "running" && fixed !== "running";
  const stampAt = auto ? AUTO_FIXED + RUN_FOR : manual && manual.released !== null && manual.fixed !== null ? Math.max(manual.released, manual.fixed) + RUN_FOR : 0;
  const stamp = !both ? 0 : reduced ? 1 : ease(phase(auto ? T : t, stampAt, STAMP_FOR));

  const rowsTime = auto ? T - ROWS_AT : manual?.rowsAt !== null && manual?.rowsAt !== undefined ? t - manual.rowsAt : Infinity;
  const showAllRows = reduced || (!auto && (manual?.rowsAt === null || manual?.rowsAt === undefined));
  const selected = manual?.row ?? null;
  const noteText = selected !== null ? TRIALS[selected].note : FOLLOW_UP;
  const noteShown = selected !== null || reduced || !auto || T >= NOTE_AT;

  const lit = reduced ? -1 : auto ? (T < ROWS_AT ? 0 : T < CARD3_AT ? 1 : 2) : manual!.focus;
  const fade = auto ? clamp01((T - FADE_AT) / 500) : 0;
  const termTime = auto ? T : 99999;

  useEffect(() => {
    onLit(lit);
  }, [lit, onLit]);

  const base = (): NonNullable<Manual> =>
    manual ?? {
      released: released === "idle" ? null : -RUN_FOR,
      fixed: fixed === "idle" ? null : -RUN_FOR,
      row: null,
      rowsAt: null,
      focus: 0,
    };

  const run = (which: Run) => {
    const next = base();
    setManual({ ...next, [which]: t, focus: 0 });
    clock.setPaused(false);
  };

  const pickRow = (index: number) => {
    const next = base();
    setManual({ ...next, row: next.row === index ? null : index, focus: 1 });
  };

  useImperativeHandle(api, () => ({
    pick: (card: number) => {
        if (card === 0) {
          if (manual && manual.focus === 0) return;
          setManual({ released: t, fixed: t + RUN_FOR + 250, row: null, rowsAt: null, focus: 0 });
        } else if (card === 1) {
          if (manual && manual.focus === 1) return;
          setManual({ ...base(), row: null, rowsAt: t, focus: 1 });
        } else {
          if (manual && manual.focus === 2) return;
          setManual({ ...base(), focus: 2 });
        }
        clock.setPaused(false);
    },
  }));

  return (
    <div ref={ref} className="flex min-h-0 flex-1 flex-col">
      <StageHeader>
        <span className="text-[13px] font-semibold text-ink desk:text-[clamp(12px,1.6vh,17px)]">Run the credit check</span>
        <span className="flex-1" />
        <SmallButton onClick={() => run("released")} pressed={released !== "idle"}>
          Run on the shop as released
        </SmallButton>
        <SmallButton onClick={() => run("fixed")} pressed={fixed !== "idle"}>
          Run with the community&apos;s fix
        </SmallButton>
        {auto ? <PlayPause paused={paused} onClick={togglePause} /> : null}
      </StageHeader>

      <div
        className="grid min-h-0 flex-1 gap-3 px-3 pb-3 pt-2.5 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] desk:gap-[clamp(10px,1.8vh,26px)] desk:px-[clamp(12px,1.8vh,24px)] desk:pb-[clamp(8px,1.4vh,18px)] desk:pt-[clamp(6px,1.1vh,14px)]"
        style={{ opacity: 1 - fade }}
      >
        <div className="flex min-w-0 flex-col justify-center gap-2.5 desk:gap-[clamp(6px,1.2vh,16px)]">
          <Terminal time={termTime} still={reduced || !auto} />
          <div className="grid grid-cols-2 gap-2.5 desk:gap-[clamp(6px,1.2vh,14px)]">
            <ResultPanel title="Shop as released" state={released} good={false} />
            <ResultPanel title="Shop with the community's fix" state={fixed} good />
          </div>
          <div className="grid min-h-[2.6em] place-items-center text-center">
            <p
              aria-hidden={!both}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border-2 border-accent bg-white/85 px-3.5 py-1 text-[15px] font-extrabold text-accent-strong [grid-area:1/1] desk:px-[clamp(12px,1.8vh,22px)] desk:py-[clamp(3px,0.7vh,8px)] desk:text-[clamp(13px,2vh,23px)]",
                !both && "invisible"
              )}
              style={{ opacity: stamp, transform: `rotate(-2deg) scale(${0.85 + 0.15 * stamp})`, fontStretch: "112%" }}
            >
              <CheckIcon size={16} />
              Counts as reproduced
            </p>
            <p
              aria-hidden={!one}
              className={cn(
                "max-w-[34ch] text-[13px] font-semibold leading-snug text-ink-2 [grid-area:1/1] desk:text-[clamp(12px,1.6vh,17px)]",
                !one && "invisible"
              )}
            >
              Needs both: it fails as released and passes with the fix.
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-2 desk:gap-[clamp(5px,1.05vh,14px)]">
          <p className="text-[13px] font-semibold text-ink desk:text-[clamp(12px,1.6vh,17px)]">
            Trials that reproduced all 3 bug scenarios
          </p>
          <ul className="grid gap-1 desk:gap-[clamp(2px,0.6vh,8px)]">
            {TRIALS.map((row, r) => {
              const rowStart = r * ROW_GAP;
              const active = selected === r;
              return (
                <li key={row.label}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => pickRow(r)}
                    className={cn(
                      "w-full rounded-xl border px-2 py-1 text-left transition-colors desk:px-[clamp(6px,1vh,12px)] desk:py-[clamp(3px,0.6vh,7px)]",
                      active ? "border-accent bg-sky-50/90" : "border-transparent hover:border-accent/30 hover:bg-white/60"
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-2 text-[13px] desk:text-[clamp(12px,1.5vh,16.5px)]">
                      <span className={cn("truncate", active ? "font-semibold text-ink" : "text-ink-2")}>{row.label}</span>
                      <span
                        className="shrink-0 font-bold tabular-nums text-ink"
                        style={{ opacity: showAllRows ? 1 : phase(rowsTime, rowStart + 10 * DOT_STEP, 250) }}
                      >
                        {row.hits} of 10
                      </span>
                    </span>
                    <span className="mt-1 flex gap-[5px] desk:gap-[clamp(3px,0.55vh,7px)]" aria-hidden="true">
                      {Array.from({ length: 10 }, (_, c) => {
                        const on = showAllRows || rowsTime >= rowStart + c * DOT_STEP;
                        const hit = c < row.hits;
                        return (
                          <span
                            key={c}
                            className={cn(
                              "block h-3 w-3 rounded-full border transition-colors duration-200 desk:h-[clamp(9px,1.7vh,20px)] desk:w-[clamp(9px,1.7vh,20px)]",
                              on && hit ? "border-accent bg-accent" : on ? "border-slate-900/30 bg-white" : "border-slate-900/10 bg-slate-900/[0.04]"
                            )}
                          />
                        );
                      })}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="grid">
            {[FOLLOW_UP, ...TRIALS.map((row) => row.note)].map((text) => (
              <p
                key={text}
                aria-hidden={text !== noteText || !noteShown}
                className={cn(
                  "text-[12.5px] leading-snug [grid-area:1/1] desk:text-[clamp(12px,1.45vh,15.5px)]",
                  text === FOLLOW_UP ? "text-muted" : "text-ink-2",
                  (text !== noteText || !noteShown) && "invisible"
                )}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
