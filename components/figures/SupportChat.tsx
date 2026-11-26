"use client";

import { useState } from "react";
import { along, clamp01, ease, useFigureClock, type FigureClock, type Pt } from "@/lib/figure";
import { PauseButton } from "../ui";
import { cn } from "@/lib/cn";

type Choice = "yes" | "cond" | "no";
type Pick = { choice: Choice; at: number };
type NodeId = "msg" | "route" | "tools" | "gate" | "run" | "verify" | "none" | "reply";
type EdgeId = "e1" | "e2" | "e3" | "e4" | "e5" | "e6" | "e7" | "e8";
type NodeState = "idle" | "seen" | "held" | "ok" | "off" | "lit";

const ORDER: Choice[] = ["yes", "cond", "no"];

const CHIPS: { choice: Choice; text: string }[] = [
  { choice: "yes", text: "Yes, cancel it" },
  { choice: "no", text: "No, keep it" },
  { choice: "cond", text: "Only if the refund is today" },
];

const ANSWERS: Record<Choice, string> = {
  yes: "Done. Order #1042 is cancelled.",
  no: "Okay, order #1042 stays as it is.",
  cond: "I can't act on a yes with a condition. Should I cancel order #1042 now, yes or no?",
};

const ASK = "Hi, can you cancel order #1042?";
const AGENT_ASK = "I can cancel order #1042. Nothing changes until you say yes. Cancel it?";

const TIPS: Partial<Record<NodeId, string>> = {
  tools: "Proposes a change",
  gate: "Held for a clear yes",
};

type Layout = {
  w: number;
  h: number;
  nodes: Record<NodeId, { x: number; y: number; w: number; label: string }>;
  edges: Record<EdgeId, Pt[]>;
  ask: Pt[][];
  yes: Pt[][];
  no: Pt[][];
};

const NODE_H = 26;

const WIDE: Layout = {
  w: 480,
  h: 92,
  nodes: {
    msg: { x: 31.5, y: 22, w: 63, label: "Message" },
    route: { x: 111, y: 22, w: 50, label: "Route" },
    tools: { x: 202, y: 22, w: 86, label: "Order tools" },
    gate: { x: 290, y: 22, w: 44, label: "Gate" },
    run: { x: 369, y: 22, w: 68, label: "Run once" },
    verify: { x: 453, y: 22, w: 54, label: "Verify" },
    none: { x: 352, y: 70, w: 96, label: "Nothing runs" },
    reply: { x: 453, y: 70, w: 48, label: "Reply" },
  },
  edges: {
    e1: [[63, 22], [86, 22]],
    e2: [[136, 22], [159, 22]],
    e3: [[245, 22], [268, 22]],
    e4: [[312, 22], [335, 22]],
    e5: [[403, 22], [426, 22]],
    e6: [[453, 35], [453, 57]],
    e7: [[290, 35], [290, 70], [304, 70]],
    e8: [[400, 70], [429, 70]],
  },
  ask: [
    [[31.5, 22], [111, 22]],
    [[111, 22], [202, 22]],
    [[202, 22], [290, 22]],
  ],
  yes: [
    [[290, 22], [369, 22]],
    [[369, 22], [453, 22]],
    [[453, 22], [453, 70]],
  ],
  no: [
    [[290, 22], [290, 70], [352, 70]],
    [[352, 70], [453, 70]],
  ],
};

const NARROW: Layout = {
  w: 320,
  h: 110,
  nodes: {
    msg: { x: 31.5, y: 16, w: 63, label: "Message" },
    route: { x: 113, y: 16, w: 50, label: "Route" },
    tools: { x: 206, y: 16, w: 86, label: "Order tools" },
    gate: { x: 296, y: 16, w: 44, label: "Gate" },
    none: { x: 48, y: 68, w: 96, label: "Nothing runs" },
    run: { x: 148, y: 68, w: 68, label: "Run once" },
    verify: { x: 227, y: 68, w: 54, label: "Verify" },
    reply: { x: 296, y: 68, w: 48, label: "Reply" },
  },
  edges: {
    e1: [[63, 16], [88, 16]],
    e2: [[138, 16], [163, 16]],
    e3: [[249, 16], [274, 16]],
    e4: [[296, 29], [296, 42], [148, 42], [148, 55]],
    e5: [[182, 68], [200, 68]],
    e6: [[254, 68], [272, 68]],
    e7: [[296, 29], [296, 42], [48, 42], [48, 55]],
    e8: [[48, 81], [48, 98], [296, 98], [296, 81]],
  },
  ask: [
    [[31.5, 16], [113, 16]],
    [[113, 16], [206, 16]],
    [[206, 16], [296, 16]],
  ],
  yes: [
    [[296, 16], [296, 42], [148, 42], [148, 68]],
    [[148, 68], [227, 68]],
    [[227, 68], [296, 68]],
  ],
  no: [
    [[296, 16], [296, 42], [48, 42], [48, 68]],
    [[48, 68], [48, 98], [296, 98], [296, 68]],
  ],
};

const MOVE = 550;
const HOLD = 250;
const LEAVE_MSG = 400;
const AT_GATE = LEAVE_MSG + 3 * MOVE + 2 * HOLD;
const SHOW_AGENT_ASK = AT_GATE + 150;
const SHOW_CHIPS = SHOW_AGENT_ASK + 350;
const WAIT = 4000;
const AUTO_AT = SHOW_CHIPS + WAIT;
const HOLD_END = 3400;
const FADE = 400;

function branchTimes(choice: Choice) {
  const legs = choice === "yes" ? 3 : 2;
  const reply = 150 + legs * MOVE + (legs - 1) * HOLD;
  return { legs, reply, answer: reply + 150 };
}

function loopLength(pick: Pick) {
  return pick.at + branchTimes(pick.choice).answer + HOLD_END;
}

function autoPick(loop: number): Pick {
  return { choice: ORDER[loop % ORDER.length], at: AUTO_AT };
}

function locate(t: number, picks: Record<number, Pick>) {
  let start = 0;
  for (let loop = 0; loop < 10000; loop++) {
    const pick = picks[loop] ?? autoPick(loop);
    const length = loopLength(pick);
    if (t < start + length) return { loop, local: t - start, pick };
    start += length;
  }
  return { loop: 0, local: 0, pick: autoPick(0) };
}

type Frame = {
  light: { leg: Pt[]; progress: number } | null;
  nodes: Record<NodeId, NodeState>;
  taken: EdgeId[];
  showAsk: boolean;
  showAgentAsk: boolean;
  showChips: boolean;
  showReply: boolean;
  showAnswer: boolean;
  waiting: boolean;
  choice: Choice;
  pressed: Choice | null;
  fade: number;
  caption: string;
};

const BRANCH_EDGES: Record<Choice, EdgeId[]> = {
  yes: ["e4", "e5", "e6"],
  no: ["e7", "e8"],
  cond: ["e7", "e8"],
};

const CAPTIONS = {
  ask: "The customer asks for a change.",
  tools: "Order tools propose the change.",
  gate: "The gate holds it for a clear yes.",
  yes: "A clear yes: the change runs once, then it is verified.",
  no: "No change was approved, so nothing runs.",
  cond: "A yes with a condition is not a clear yes, so nothing runs.",
};

function frame(local: number, pick: Pick, layout: Layout): Frame {
  const decided = local >= pick.at;
  const since = local - pick.at;
  const branch = branchTimes(pick.choice);
  const yes = pick.choice === "yes";
  const total = loopLength(pick);
  const fade = clamp01((local - (total - FADE)) / FADE);

  const askArrive = (i: number) => LEAVE_MSG + (i + 1) * MOVE + i * HOLD;
  const askLeave = (i: number) => LEAVE_MSG + i * (MOVE + HOLD);

  let light: Frame["light"] = null;
  for (let i = 0; i < 3; i++) {
    if (local >= askLeave(i) && local < askArrive(i)) {
      light = { leg: layout.ask[i], progress: (local - askLeave(i)) / MOVE };
    }
  }
  const legs = yes ? layout.yes : layout.no;
  if (decided) {
    for (let i = 0; i < legs.length; i++) {
      const leave = 150 + i * (MOVE + HOLD);
      if (since >= leave && since < leave + MOVE) {
        light = { leg: legs[i], progress: (since - leave) / MOVE };
      }
    }
  }

  const nodes: Record<NodeId, NodeState> = {
    msg: local >= 100 ? "seen" : "idle",
    route: local >= askArrive(0) ? "seen" : "idle",
    tools: local >= askArrive(1) ? "seen" : "idle",
    gate: local >= AT_GATE ? (decided ? "seen" : "held") : "idle",
    run: "idle",
    verify: "idle",
    none: "idle",
    reply: "idle",
  };
  const askEdges: EdgeId[] = ["e1", "e2", "e3"];
  const taken: EdgeId[] = askEdges.filter((_, i) => local >= askArrive(i));
  if (decided) {
    const edges = BRANCH_EDGES[pick.choice];
    edges.forEach((edge, i) => {
      if (since >= 150 + (i + 1) * MOVE + i * HOLD) taken.push(edge);
    });
    const arrive = (i: number) => since >= 150 + (i + 1) * MOVE + i * HOLD;
    if (yes) {
      if (arrive(0)) nodes.run = "ok";
      if (arrive(1)) nodes.verify = "ok";
      if (arrive(2)) nodes.reply = "lit";
    } else {
      if (arrive(0)) nodes.none = "off";
      if (arrive(1)) nodes.reply = "lit";
    }
  }

  let caption = CAPTIONS.ask;
  if (local >= askArrive(1)) caption = CAPTIONS.tools;
  if (local >= AT_GATE) caption = CAPTIONS.gate;
  if (decided && since >= 150 + MOVE) caption = CAPTIONS[pick.choice];

  return {
    light,
    nodes,
    taken,
    showAsk: local >= 100,
    showAgentAsk: local >= SHOW_AGENT_ASK,
    showChips: local >= SHOW_CHIPS,
    showReply: decided,
    showAnswer: decided && since >= branch.answer,
    waiting: local >= SHOW_CHIPS && !decided,
    choice: pick.choice,
    pressed: decided ? pick.choice : null,
    fade,
    caption,
  };
}

function still(choice: Choice): Frame {
  const yes = choice === "yes";
  return {
    light: null,
    nodes: {
      msg: "seen",
      route: "seen",
      tools: "seen",
      gate: "seen",
      run: yes ? "ok" : "idle",
      verify: yes ? "ok" : "idle",
      none: yes ? "idle" : "off",
      reply: "lit",
    },
    taken: ["e1", "e2", "e3", ...BRANCH_EDGES[choice]],
    showAsk: true,
    showAgentAsk: true,
    showChips: true,
    showReply: true,
    showAnswer: true,
    waiting: false,
    choice,
    pressed: choice,
    fade: 0,
    caption: CAPTIONS[choice],
  };
}

const NODE_STYLE: Record<NodeState, { fill: string; stroke: string; text: string; width: number }> = {
  idle: { fill: "rgba(255,255,255,0.92)", stroke: "rgba(20,48,74,0.22)", text: "#29445f", width: 1 },
  seen: { fill: "rgba(255,255,255,0.96)", stroke: "#0284c7", text: "#14304a", width: 1.4 },
  held: { fill: "#e0f2fe", stroke: "#0284c7", text: "#0369a1", width: 2 },
  ok: { fill: "#ecfdf5", stroke: "#10b981", text: "#047857", width: 1.6 },
  off: { fill: "#f1f5f9", stroke: "rgba(20,48,74,0.35)", text: "#586982", width: 1.4 },
  lit: { fill: "#0284c7", stroke: "#0369a1", text: "#ffffff", width: 1.4 },
};

function Arrow({ points, taken }: { points: Pt[]; taken: boolean }) {
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");
  const [x2, y2] = points[points.length - 1];
  const [x1, y1] = points[points.length - 2];
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 5;
  const head = `M${x2} ${y2} L${x2 - size * Math.cos(angle - 0.5)} ${y2 - size * Math.sin(angle - 0.5)} L${x2 - size * Math.cos(angle + 0.5)} ${y2 - size * Math.sin(angle + 0.5)} Z`;
  const color = taken ? "#0284c7" : "rgba(20,48,74,0.28)";
  return (
    <g style={{ transition: "opacity 300ms" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
      <path d={head} fill={color} />
    </g>
  );
}

function Trace({
  layout,
  f,
  className,
  onTip,
}: {
  layout: Layout;
  f: Frame;
  className: string;
  onTip: (node: NodeId | null) => void;
}) {
  const point = f.light ? along(f.light.leg, ease(f.light.progress)) : null;
  return (
    <svg
      viewBox={`0 0 ${layout.w} ${layout.h}`}
      className={className}
      role="img"
      aria-label="Trace of the agent's path. Message, Route, Order tools, then Gate. After a clear yes: Run once, Verify, Reply. After a no, an unclear answer or a yes with a condition: Nothing runs, then Reply."
    >
      {(Object.keys(layout.edges) as EdgeId[]).map((id) => (
        <Arrow key={id} points={layout.edges[id]} taken={f.taken.includes(id)} />
      ))}
      {point ? (
        <g>
          <circle cx={point[0]} cy={point[1]} r={10} fill="#0ea5e9" opacity={0.2} />
          <circle cx={point[0]} cy={point[1]} r={4.5} fill="#0284c7" />
        </g>
      ) : null}
      {(Object.keys(layout.nodes) as NodeId[]).map((id) => {
        const node = layout.nodes[id];
        const state = f.nodes[id];
        const style = NODE_STYLE[state];
        const tip = TIPS[id];
        return (
          <g
            key={id}
            tabIndex={tip ? 0 : undefined}
            role={tip ? "note" : undefined}
            aria-label={tip ? `${node.label}: ${tip}` : undefined}
            onMouseEnter={tip ? () => onTip(id) : undefined}
            onMouseLeave={tip ? () => onTip(null) : undefined}
            onFocus={tip ? () => onTip(id) : undefined}
            onBlur={tip ? () => onTip(null) : undefined}
            className={tip ? "cursor-help outline-none" : undefined}
          >
            <rect
              x={node.x - node.w / 2}
              y={node.y - NODE_H / 2}
              width={node.w}
              height={NODE_H}
              rx={8}
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth={style.width}
              style={{ transition: "fill 300ms, stroke 300ms" }}
            />
            {state === "held" ? (
              <rect
                x={node.x - node.w / 2 - 4}
                y={node.y - NODE_H / 2 - 4}
                width={node.w + 8}
                height={NODE_H + 8}
                rx={11}
                fill="none"
                stroke="#0284c7"
                strokeOpacity={0.35}
                strokeWidth={2}
              />
            ) : null}
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fontSize={12.6}
              fontWeight={600}
              fill={style.text}
              style={{ transition: "fill 300ms" }}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Bubble({
  from,
  show,
  variants,
  active = 0,
}: {
  from: "customer" | "agent";
  show: boolean;
  variants: string[];
  active?: number;
}) {
  return (
    <li
      className={cn(
        "flex transition-opacity duration-300",
        from === "customer" ? "justify-end" : "justify-start",
        show ? "opacity-100" : "opacity-0"
      )}
      aria-hidden={!show}
    >
      <div className={cn("grid max-w-[86%]", from === "customer" ? "justify-items-end" : "justify-items-start")}>
        {variants.map((text, i) => (
          <p
            key={text}
            aria-hidden={i !== active}
            className={cn(
              "rounded-2xl px-3.5 py-2 text-[14px] leading-snug [grid-area:1/1] desk:px-[clamp(12px,1.6vh,22px)] desk:py-[clamp(6px,1vh,13px)] desk:text-[clamp(13px,1.85vh,23px)] short:py-[4px]",
              from === "customer"
                ? "rounded-br-md bg-accent text-white"
                : "rounded-bl-md border border-slate-900/[0.08] bg-white/90 text-ink",
              i !== active && "invisible"
            )}
          >
            {text}
          </p>
        ))}
      </div>
    </li>
  );
}

const CHOICES: Choice[] = ["yes", "no", "cond"];
const CAPTION_TEXTS = ["Pick a reply to try it", ...Object.values(CAPTIONS)];

export function SupportChat({
  embedded = false,
  clock: external,
}: {
  embedded?: boolean;
  clock?: FigureClock<HTMLDivElement>;
}) {
  const own = useFigureClock<HTMLDivElement>({ page: "shopify", active: !external });
  const { ref, t, paused, togglePause, setPaused, reduced } = external ?? own;
  const [picks, setPicks] = useState<Record<number, Pick>>({});
  const [stillChoice, setStillChoice] = useState<Choice>("yes");
  const [tip, setTip] = useState<NodeId | null>(null);
  const where = locate(t, picks);
  const wide = reduced ? still(stillChoice) : frame(where.local, where.pick, WIDE);
  const narrow = reduced ? still(stillChoice) : frame(where.local, where.pick, NARROW);
  const f = wide;
  const interactive = reduced || f.waiting;

  const choose = (choice: Choice) => {
    if (reduced) {
      setStillChoice(choice);
      return;
    }
    if (!f.waiting) return;
    setPicks((current) => ({ ...current, [where.loop]: { choice, at: where.local } }));
    setPaused(false);
  };

  const tipNode = tip ? WIDE.nodes[tip] : null;

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <div
        ref={ref}
        className={cn("flex flex-1 flex-col", embedded ? "" : "glass rounded-[22px]")}
        role="group"
        aria-label="Support chat demo"
      >
        {embedded ? null : (
          <div className="flex items-center gap-2 pb-1.5">
            <span className="text-[14px] font-bold text-ink desk:text-[clamp(13px,1.75vh,19px)]">Support chat</span>
            <span className="ml-auto" />
            {reduced ? null : <PauseButton paused={paused} onClick={togglePause} />}
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between gap-3 desk:gap-[clamp(6px,1.5vh,20px)] short:gap-1.5">
          <ol className="flex flex-col gap-2 desk:gap-[clamp(4px,0.8vh,12px)]" style={{ opacity: 1 - f.fade }}>
            <Bubble from="customer" show={f.showAsk} variants={[ASK]} />
            <Bubble from="agent" show={f.showAgentAsk} variants={[AGENT_ASK]} />
            <li
              className={cn("transition-opacity duration-300", f.showChips ? "opacity-100" : "opacity-0")}
              aria-hidden={!f.showChips}
            >
              <div className="flex flex-wrap justify-end gap-1.5" role="group" aria-label="Reply options">
                {CHIPS.map((chip) => {
                  const pressed = f.pressed === chip.choice;
                  return (
                    <button
                      key={chip.choice}
                      type="button"
                      aria-pressed={pressed}
                      aria-disabled={!interactive}
                      tabIndex={f.showChips ? 0 : -1}
                      onClick={() => choose(chip.choice)}
                      className={cn(
                        "rounded-xl border px-2.5 py-1.5 text-[13px] font-semibold transition-colors desk:px-[clamp(10px,1.2vh,16px)] desk:py-[clamp(6px,0.9vh,11px)] desk:text-[clamp(12px,1.7vh,20px)] short:py-[4px]",
                        pressed
                          ? "border-accent bg-accent text-white"
                          : interactive
                            ? "border-accent/45 bg-white/90 text-accent-strong hover:bg-white"
                            : "border-slate-900/[0.10] bg-white/60 text-muted"
                      )}
                    >
                      {chip.text}
                    </button>
                  );
                })}
              </div>
            </li>
            <Bubble
              from="customer"
              show={f.showReply}
              variants={CHOICES.map((choice) => CHIPS.find((chip) => chip.choice === choice)?.text ?? "")}
              active={CHOICES.indexOf(f.choice)}
            />
            <Bubble
              from="agent"
              show={f.showAnswer}
              variants={CHOICES.map((choice) => ANSWERS[choice])}
              active={CHOICES.indexOf(f.choice)}
            />
          </ol>

          <div>
            <div className="mb-1.5 grid text-[13px] text-muted desk:text-[clamp(12px,1.6vh,19px)]">
              {CAPTION_TEXTS.map((text) => {
                const current = f.waiting ? "Pick a reply to try it" : f.caption;
                return (
                  <p key={text} className={cn("[grid-area:1/1]", text !== current && "invisible")} aria-hidden={text !== current}>
                    {text}
                  </p>
                );
              })}
            </div>
            <div className="relative mx-auto w-full desk:w-fit desk:max-w-full">
              <Trace
                layout={WIDE}
                f={wide}
                className="hidden h-auto w-full sm:block desk:h-[clamp(88px,15vh,150px)] desk:w-auto desk:max-w-full"
                onTip={setTip}
              />
              <Trace layout={NARROW} f={narrow} className="block w-full sm:hidden" onTip={setTip} />
              {tipNode && tip ? (
                <span
                  role="tooltip"
                  className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-slate-900/[0.08] bg-white px-2 py-1 text-[12px] font-medium text-ink shadow-[0_8px_22px_rgba(30,80,150,0.16)] sm:block"
                  style={{
                    left: `${(tipNode.x / WIDE.w) * 100}%`,
                    top: `calc(${((tipNode.y - NODE_H / 2) / WIDE.h) * 100}% - 6px)`,
                  }}
                >
                  {TIPS[tip]}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <ol className="sr-only">
        <li>The customer asks: {ASK}</li>
        <li>The agent routes the message and its order tools propose the change.</li>
        <li>The gate holds the change. The agent asks: {AGENT_ASK}</li>
        <li>After a clear yes, the change runs once, is verified, and the agent replies: {ANSWERS.yes}</li>
        <li>After a no, the agent replies: {ANSWERS.no}</li>
        <li>After a yes with a condition, nothing runs and the agent replies: {ANSWERS.cond}</li>
      </ol>
    </div>
  );
}
