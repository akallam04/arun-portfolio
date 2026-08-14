"use client";

import { useEffect, useRef } from "react";

/**
 * The hero background is Arun's own agent architecture, running.
 *
 * It is the Shopify support agent's LangGraph topology: a request is
 * sanitized, routed by intent, served by RAG retrieval or MCP tools, then
 * grounding-verified before it may answer. Requests are drawn as packets
 * travelling the real edges. Prompt injections die at the sanitize guard,
 * ungrounded drafts bounce off verify and get re-drafted. Nothing here is
 * decoration: every node and edge exists in the repo.
 */

type Node = { id: string; label: string; x: number; y: number; pulse: number };
type Kind = "ok" | "blocked" | "retry";
type Packet = { path: number[]; leg: number; t: number; speed: number; kind: Kind; dead: number };

const LABELS: Record<string, string> = {
  in: "request",
  san: "sanitize",
  route: "route",
  rag: "retrieve",
  tool: "mcp tools",
  ref: "refuse",
  ver: "verify",
  out: "respond",
};

// id -> [x, y] in normalized space, for wide and narrow layouts.
const WIDE: Record<string, [number, number]> = {
  in: [0.05, 0.5],
  san: [0.19, 0.5],
  route: [0.33, 0.5],
  rag: [0.5, 0.26],
  tool: [0.5, 0.52],
  ref: [0.42, 0.84],
  ver: [0.67, 0.38],
  out: [0.85, 0.38],
};
const NARROW: Record<string, [number, number]> = {
  in: [0.5, 0.05],
  san: [0.5, 0.18],
  route: [0.5, 0.33],
  rag: [0.24, 0.5],
  tool: [0.62, 0.5],
  ref: [0.85, 0.28],
  ver: [0.43, 0.68],
  out: [0.43, 0.88],
};

const ORDER = ["in", "san", "route", "rag", "tool", "ref", "ver", "out"];
const idx = (id: string) => ORDER.indexOf(id);

const EDGES: [number, number][] = [
  [idx("in"), idx("san")],
  [idx("san"), idx("route")],
  [idx("san"), idx("ref")],
  [idx("route"), idx("rag")],
  [idx("route"), idx("tool")],
  [idx("rag"), idx("ver")],
  [idx("tool"), idx("ver")],
  [idx("ver"), idx("out")],
  [idx("ver"), idx("route")],
];

const PATHS: { path: string[]; kind: Kind; weight: number }[] = [
  { path: ["in", "san", "route", "rag", "ver", "out"], kind: "ok", weight: 4 },
  { path: ["in", "san", "route", "tool", "ver", "out"], kind: "ok", weight: 4 },
  { path: ["in", "san", "ref"], kind: "blocked", weight: 2 },
  {
    path: ["in", "san", "route", "rag", "ver", "route", "tool", "ver", "out"],
    kind: "retry",
    weight: 1,
  },
];

const SKY = "2,132,199";
const OK = "5,150,105";
const STOP = "220,38,38";

export function AgentGraph() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let raf = 0;
    let running = true;
    let last = performance.now();
    let spawnIn = 300;
    const pointer = { x: -9999, y: -9999, on: false };

    const layout = () => {
      const host = canvas.parentElement!;
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const map = w < 700 ? NARROW : WIDE;
      nodes = ORDER.map((id) => ({
        id,
        label: LABELS[id],
        x: map[id][0] * w,
        y: map[id][1] * h,
        pulse: 0,
      }));
    };

    const pick = () => {
      const total = PATHS.reduce((s, p) => s + p.weight, 0);
      let r = Math.random() * total;
      for (const p of PATHS) {
        r -= p.weight;
        if (r <= 0) return p;
      }
      return PATHS[0];
    };

    const spawn = () => {
      const chosen = pick();
      packets.push({
        path: chosen.path.map(idx),
        leg: 0,
        t: 0,
        speed: 0.55 + Math.random() * 0.3,
        kind: chosen.kind,
        dead: 0,
      });
    };

    const tint = (k: Kind) => (k === "blocked" ? STOP : k === "retry" ? "217,119,6" : SKY);

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);

      // edges
      for (const [a, b] of EDGES) {
        const n1 = nodes[a];
        const n2 = nodes[b];
        const back = b === idx("route") && a === idx("ver");
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        if (back) {
          const mx = (n1.x + n2.x) / 2;
          const my = (n1.y + n2.y) / 2 - Math.min(w, h) * 0.12;
          ctx.quadraticCurveTo(mx, my, n2.x, n2.y);
        } else {
          ctx.lineTo(n2.x, n2.y);
        }
        ctx.strokeStyle = `rgba(${SKY},${back ? 0.18 : 0.3})`;
        ctx.lineWidth = 1;
        if (back) ctx.setLineDash([4, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // nodes
      for (const n of nodes) {
        const hovered =
          pointer.on && Math.hypot(pointer.x - n.x, pointer.y - n.y) < 42;
        const base = n.id === "ref" ? STOP : n.id === "out" ? OK : SKY;
        const r = 6 + n.pulse * 8;

        if (n.pulse > 0.01) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${base},${0.16 * n.pulse})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${base},${0.5 + n.pulse * 0.5})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${base},${0.65 + n.pulse * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = `${hovered ? 700 : 600} 11px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(15,42,67,${hovered ? 0.9 : 0.58 + n.pulse * 0.3})`;
        ctx.fillText(n.label, n.x, n.y + 19);
        n.pulse = Math.max(0, n.pulse - dt * 1.6);
      }

      // packets
      for (const p of packets) {
        if (p.dead > 0) {
          const n = nodes[p.path[p.path.length - 1]];
          ctx.beginPath();
          ctx.arc(n.x, n.y, 5 + (1 - p.dead) * 16, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${STOP},${p.dead * 0.5})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
          continue;
        }
        const a = nodes[p.path[p.leg]];
        const b = nodes[p.path[p.leg + 1]];
        if (!b) continue;
        const back =
          p.path[p.leg + 1] === idx("route") && p.path[p.leg] === idx("ver");
        let x: number;
        let y: number;
        if (back) {
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2 - Math.min(w, h) * 0.12;
          const u = 1 - p.t;
          x = u * u * a.x + 2 * u * p.t * mx + p.t * p.t * b.x;
          y = u * u * a.y + 2 * u * p.t * my + p.t * p.t * b.y;
        } else {
          x = a.x + (b.x - a.x) * p.t;
          y = a.y + (b.y - a.y) * p.t;
        }
        const c = tint(p.kind);
        const g = ctx.createRadialGradient(x, y, 0, x, y, 13);
        g.addColorStop(0, `rgba(${c},0.5)`);
        g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},0.95)`;
        ctx.fill();
      }
    };

    const step = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      spawnIn -= dt * 1000;
      if (spawnIn <= 0 && packets.length < 6) {
        spawn();
        spawnIn = 900 + Math.random() * 900;
      }

      for (const p of packets) {
        if (p.dead > 0) {
          p.dead -= dt * 1.1;
          continue;
        }
        const a = nodes[p.path[p.leg]];
        const b = nodes[p.path[p.leg + 1]];
        if (!b) continue;
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        p.t += (p.speed * 210 * dt) / len;
        if (p.t >= 1) {
          p.t = 0;
          b.pulse = 1;
          p.leg++;
          if (p.leg >= p.path.length - 1) {
            p.dead = p.kind === "blocked" ? 1 : 0.001;
          }
        }
      }
      packets = packets.filter((p) => p.dead <= 0 || p.dead > 0.02);
      packets = packets.filter(
        (p) => !(p.leg >= p.path.length - 1 && p.dead <= 0.02)
      );

      draw(dt);
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
    };
    const onLeave = () => {
      pointer.on = false;
    };

    layout();
    window.addEventListener("resize", layout);
    const host = canvas.parentElement!;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    if (reduced) {
      // Static topology: the architecture still reads, nothing moves.
      draw(0);
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          const was = running;
          running = entry.isIntersecting;
          if (running && !was) {
            last = performance.now();
            raf = requestAnimationFrame(step);
          }
        },
        { threshold: 0 }
      );
      io.observe(canvas);
      raf = requestAnimationFrame(step);
      return () => {
        running = false;
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", layout);
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
      };
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      aria-label="Live agent pipeline"
      className="relative border-y border-slate-900/[0.07] bg-white/35 backdrop-blur-sm"
    >
      <div className="mx-auto w-full max-w-6xl px-5 pb-5 pt-6 sm:px-8">
        <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-sky-500/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
            </span>
            Live topology
          </span>
          <span className="text-xs text-slate-500">
            my Shopify support agent, as it actually runs: requests are
            sanitized, routed by intent, answered from RAG or MCP tools, then
            grounding-checked before they may reply
          </span>
        </div>
        <div className="relative h-[190px] w-full sm:h-[210px] lg:h-[230px]">
          <canvas
            ref={ref}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> request
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" /> prompt
            injection refused before any model call
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" /> ungrounded
            draft sent back to re-route
          </span>
        </div>
      </div>
    </section>
  );
}
