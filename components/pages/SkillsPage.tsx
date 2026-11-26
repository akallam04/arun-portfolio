"use client";

import { useEffect, useRef, useState } from "react";
import { SKILL_GROUPS, SKILL_TARGETS, type SkillTarget } from "@/lib/data";
import { useInView, useReducedMotion, useRestartListener, useTicker } from "@/lib/figure";
import { ArrowRightIcon, PauseIcon, PlayIcon } from "../icons";
import { cn } from "@/lib/cn";

type Active =
  | { kind: "skill"; name: string }
  | { kind: "target"; id: SkillTarget }
  | { kind: "group"; name: string }
  | null;

type Curve = { key: string; x1: number; y1: number; yg: number; c1: number; c2: number; x2: number; y2: number };

const ALL_SKILLS = SKILL_GROUPS.flatMap((group) => group.skills);
const AUTO_SKILLS = ALL_SKILLS.filter((skill) => skill.targets.length > 0).map((skill) => skill.name);
const TARGET = new Map(SKILL_TARGETS.map((target) => [target.id, target]));
const AUTO_STEP = 2500;
const RESUME_AFTER = 6000;

function same(a: Active, b: Active) {
  if (a === null || b === null) return a === b;
  if (a.kind !== b.kind) return false;
  if (a.kind === "target" && b.kind === "target") return a.id === b.id;
  return (a as { name: string }).name === (b as { name: string }).name;
}

function pairsFor(active: Active): [string, SkillTarget][] {
  if (!active) return [];
  if (active.kind === "skill") {
    const skill = ALL_SKILLS.find((item) => item.name === active.name);
    return (skill?.targets ?? []).map((id) => [active.name, id]);
  }
  if (active.kind === "target") {
    return ALL_SKILLS.filter((skill) => skill.targets.includes(active.id)).map((skill) => [skill.name, active.id]);
  }
  const group = SKILL_GROUPS.find((item) => item.name === active.name);
  return (group?.skills ?? []).flatMap((skill) => skill.targets.map((id) => [skill.name, id] as [string, SkillTarget]));
}

function bezier(curve: Curve, u: number) {
  const mid = (curve.c1 + curve.c2) / 2;
  const p0 = [curve.c1, curve.yg];
  const p1 = [mid, curve.yg];
  const p2 = [mid, curve.y2];
  const p3 = [curve.c2, curve.y2];
  const a = (1 - u) ** 3;
  const b = 3 * (1 - u) ** 2 * u;
  const c = 3 * (1 - u) * u ** 2;
  const d = u ** 3;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

function Dots({ curves }: { curves: Curve[] }) {
  const now = useTicker(curves.length > 0);
  return (
    <>
      {curves.map((curve, i) => {
        const u = (((now / 1600 + i * 0.17) % 1) + 1) % 1;
        const [x, y] = bezier(curve, u);
        return (
          <g key={`${curve.key}-dot`}>
            <circle cx={x} cy={y} r={6} fill="#0ea5e9" opacity={0.18} />
            <circle cx={x} cy={y} r={2.8} fill="#0284c7" />
          </g>
        );
      })}
    </>
  );
}

export function SkillsPage() {
  const [hover, setHover] = useState<Active>(null);
  const [pinned, setPinned] = useState<Active>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [idle, setIdle] = useState(true);
  const [note, setNote] = useState<SkillTarget | null>(null);
  const [curves, setCurves] = useState<Curve[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef(new Map<string, HTMLElement>());
  const targetRefs = useRef(new Map<SkillTarget, HTMLElement>());
  const noteTimer = useRef<number | undefined>(undefined);
  const resumeTimer = useRef<number | undefined>(undefined);

  const [autoIndex, setAutoIndex] = useState(0);
  const reduced = useReducedMotion();
  const inView = useInView(mapRef);
  const touched = hover !== null || pinned !== null;
  const autoplay = !reduced && !userPaused && !touched && idle;

  useEffect(() => {
    if (!autoplay || !inView) return;
    const timer = window.setInterval(() => setAutoIndex((i) => (i + 1) % AUTO_SKILLS.length), AUTO_STEP);
    return () => window.clearInterval(timer);
  }, [autoplay, inView]);

  useRestartListener("skills", () => {
    setHover(null);
    setPinned(null);
    setUserPaused(false);
    setIdle(true);
    setAutoIndex(0);
    window.clearTimeout(resumeTimer.current);
  });

  const busy = () => {
    window.clearTimeout(resumeTimer.current);
    setIdle(false);
  };
  const rest = () => {
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setIdle(true), RESUME_AFTER);
  };
  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);

  const autoSkill = AUTO_SKILLS[autoIndex];
  const active: Active = pinned ?? hover ?? (autoplay ? { kind: "skill", name: autoSkill } : null);
  const pairs = pairsFor(active);
  const litSkills = new Set(pairs.map(([skill]) => skill));
  const litTargets = new Set(pairs.map(([, id]) => id));
  if (active?.kind === "skill") litSkills.add(active.name);
  if (active?.kind === "target") litTargets.add(active.id);
  if (active?.kind === "group") SKILL_GROUPS.find((g) => g.name === active.name)?.skills.forEach((s) => litSkills.add(s.name));
  const anyLit = active !== null;
  const pairKey = pairs.map(([skill, id]) => `${skill}>${id}`).join("|");

  useEffect(() => {
    const measure = () => {
      const map = mapRef.current;
      const channel = channelRef.current;
      if (!map || !channel || !pairKey || channel.offsetWidth === 0) {
        setCurves([]);
        return;
      }
      const box = map.getBoundingClientRect();
      const lane = channel.getBoundingClientRect();
      const next: Curve[] = [];
      for (const key of pairKey.split("|")) {
        const [skill, id] = key.split(">") as [string, SkillTarget];
        const chip = skillRefs.current.get(skill);
        const from = chip?.getBoundingClientRect();
        const to = targetRefs.current.get(id)?.getBoundingClientRect();
        if (!chip || !from || !to || to.width === 0 || from.width === 0) continue;
        const row = chip.closest("ul");
        const gap = row ? parseFloat(getComputedStyle(row).rowGap) || 6 : 6;
        next.push({
          key,
          x1: from.right - box.left,
          y1: from.top + from.height / 2 - box.top,
          yg: from.bottom - box.top + gap / 2,
          c1: lane.left - box.left,
          c2: lane.right - box.left,
          x2: to.left - box.left - 3,
          y2: to.top + to.height / 2 - box.top,
        });
      }
      setCurves(next);
    };
    const frame = requestAnimationFrame(measure);
    const map = mapRef.current;
    const observer = new ResizeObserver(() => measure());
    if (map) observer.observe(map);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pairKey]);

  const pointTo = (next: Active) => {
    busy();
    setHover(next);
    window.clearTimeout(noteTimer.current);
    if (next && next.kind !== "target") setNote(null);
    if (next?.kind === "target") {
      const id = next.id;
      noteTimer.current = window.setTimeout(() => setNote(id), 160);
    }
  };

  const focusTo = (next: Active) => {
    busy();
    setHover(next);
    window.clearTimeout(noteTimer.current);
    setNote(next?.kind === "target" ? next.id : null);
  };

  const pin = (next: Active) => {
    const unpin = same(pinned, next);
    setPinned(unpin ? null : next);
    if (unpin) rest();
    else busy();
    if (next?.kind !== "target") setNote(null);
    if (next?.kind === "target") setNote(next.id);
  };

  useEffect(() => () => window.clearTimeout(noteTimer.current), []);

  const noteTarget =
    active?.kind === "target" ? TARGET.get(active.id) : active === null && note ? TARGET.get(note) : undefined;
  const liveText =
    active?.kind === "skill"
      ? `${active.name}: ${pairs.map(([, id]) => TARGET.get(id)?.name).join(", ") || "not linked to a project"}`
      : active?.kind === "target"
        ? `${TARGET.get(active.id)?.name}: ${pairs.map(([skill]) => skill).join(", ")}`
        : "";

  const projects = SKILL_TARGETS.filter((target) => target.kind === "project");
  const work = SKILL_TARGETS.filter((target) => target.kind === "work");

  const targetItem = (target: (typeof SKILL_TARGETS)[number]) => {
    const lit = litTargets.has(target.id);
    return (
      <li key={target.id}>
        <a
          href={target.href}
          ref={(node) => {
            if (node) targetRefs.current.set(target.id, node);
            else targetRefs.current.delete(target.id);
          }}
          onMouseEnter={() => pointTo({ kind: "target", id: target.id })}
          onFocus={() => focusTo({ kind: "target", id: target.id })}
          onBlur={() => {
                              setHover(null);
                              if (!pinned) rest();
                            }}
          className={cn(
            "skill-chip block rounded-xl border px-3 py-1.5 text-[14px] font-semibold transition-[opacity,background-color,border-color,color] duration-200 desk:px-[clamp(9px,1.3vh,16px)] desk:py-[clamp(3px,0.62vh,8px)] desk:text-[clamp(12.5px,1.68vh,18px)]",
            lit
              ? "border-accent bg-white text-accent-strong shadow-[0_0_0_3px_rgba(2,132,199,0.15)]"
              : anyLit
                ? "border-slate-900/[0.05] bg-white/85 text-ink/40"
                : "border-slate-900/[0.10] bg-white/85 text-ink hover:border-accent/40"
          )}
        >
          {target.name}
        </a>
      </li>
    );
  };

  return (
    <section id="skills" data-page aria-labelledby="skills-title" className="page">
      <div className="page-inner gap-4 desk:gap-[clamp(10px,2vh,28px)]">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h2 id="skills-title" className="heading text-[40px] text-ink desk:text-[clamp(40px,7.4vh,104px)]">
              Skills
            </h2>
            <p className="mt-2 text-[16px] text-ink-2 desk:mt-[clamp(4px,1vh,14px)] desk:text-[clamp(14px,2.1vh,24px)]">
              Point at a skill to see where I used it.
            </p>
          </div>
          {reduced ? null : (
            <div className="hidden items-center gap-2 lg:flex">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted desk:text-[clamp(12px,1.6vh,17px)]" aria-live="polite">
                <span className={cn("h-2 w-2 rounded-full", autoplay ? "bg-good" : "bg-slate-400")} aria-hidden="true" />
                {autoplay ? "Playing" : userPaused ? "Paused" : "Paused while you look"}
              </span>
              <button
                type="button"
                onClick={() => setUserPaused((value) => !value)}
                aria-pressed={userPaused}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-900/[0.10] bg-white/75 px-2.5 py-1 text-[13px] font-semibold text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-strong desk:text-[clamp(12px,1.6vh,17px)]"
              >
                {userPaused ? <PlayIcon size={12} /> : <PauseIcon size={12} />}
                {userPaused ? "Play" : "Pause"}
              </button>
            </div>
          )}
        </div>

        <div
          ref={mapRef}
          data-tour-target
          className="glass relative grid gap-6 rounded-[26px] p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_clamp(120px,9vw,220px)_minmax(250px,24%)] lg:gap-0 desk:min-h-0 desk:flex-1 desk:content-center desk:p-[clamp(16px,2.8vh,44px)]"
          onMouseLeave={() => {
            setHover(null);
            if (!pinned) rest();
          }}
        >
          <svg className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block" aria-hidden="true">
            {curves.map((curve) => {
              const mid = (curve.c1 + curve.c2) / 2;
              const drop = `M${curve.x1} ${curve.y1} C${curve.x1 + 3.5} ${curve.y1}, ${curve.x1 + 2.5} ${curve.yg}, ${curve.x1 + 9} ${curve.yg}`;
              return (
                <path
                  key={curve.key}
                  d={`${drop} L${curve.c1} ${curve.yg} C${mid} ${curve.yg}, ${mid} ${curve.y2}, ${curve.c2} ${curve.y2} L${curve.x2} ${curve.y2}`}
                  fill="none"
                  stroke="#0284c7"
                  strokeOpacity={0.5}
                  strokeWidth={1.6}
                />
              );
            })}
            {reduced ? null : <Dots curves={curves} />}
          </svg>

          <div className="relative z-[1] grid content-center gap-4 desk:gap-[clamp(8px,1.7vh,24px)]">
            {SKILL_GROUPS.map((group) => {
              const groupActive = active?.kind === "group" && active.name === group.name;
              const open = active?.kind === "skill" && group.skills.some((s) => s.name === active.name) ? active.name : null;
              const openTargets = open ? pairs.map(([, id]) => TARGET.get(id)?.name).filter(Boolean) : [];
              return (
                <div key={group.name}>
                  <button
                    type="button"
                    onClick={() => pin({ kind: "group", name: group.name })}
                    onFocus={() => focusTo({ kind: "group", name: group.name })}
                    onBlur={() => {
                              setHover(null);
                              if (!pinned) rest();
                            }}
                    aria-pressed={groupActive}
                    className={cn(
                      "rounded-lg px-1 text-[14px] font-bold transition-colors desk:text-[clamp(12.5px,1.75vh,19px)]",
                      groupActive ? "text-accent-strong" : "text-ink hover:text-accent-strong"
                    )}
                  >
                    {group.name}
                  </button>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5 desk:mt-[clamp(3px,0.7vh,10px)] desk:gap-[clamp(5px,0.75vh,10px)]">
                    {group.skills.map((skill) => {
                      const lit = litSkills.has(skill.name);
                      return (
                        <li key={skill.name}>
                          <button
                            type="button"
                            ref={(node) => {
                              if (node) skillRefs.current.set(skill.name, node);
                              else skillRefs.current.delete(skill.name);
                            }}
                            aria-pressed={pinned?.kind === "skill" && pinned.name === skill.name}
                            onMouseEnter={() => pointTo({ kind: "skill", name: skill.name })}
                            onFocus={() => focusTo({ kind: "skill", name: skill.name })}
                            onBlur={() => {
                              setHover(null);
                              if (!pinned) rest();
                            }}
                            onClick={() => pin({ kind: "skill", name: skill.name })}
                            className={cn(
                              "skill-chip flex h-[30px] items-center rounded-xl border px-2.5 text-[13.5px] font-medium transition-[opacity,background-color,border-color,color] duration-200 desk:h-[clamp(26px,3.7vh,42px)] desk:px-[clamp(8px,1.2vh,14px)] desk:text-[clamp(12px,1.68vh,18px)]",
                              lit
                                ? "border-accent bg-accent text-white"
                                : anyLit
                                  ? "border-slate-900/[0.05] bg-white/85 text-ink-2/40"
                                  : "border-slate-900/[0.10] bg-white/85 text-ink-2 hover:border-accent/40 hover:text-ink"
                            )}
                          >
                            {skill.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {open ? (
                    <p className="mt-2 rounded-xl border border-accent/25 bg-white/85 px-3 py-2 text-[14px] text-ink-2 lg:hidden">
                      <span className="font-semibold text-ink">{open}:</span>{" "}
                      {openTargets.length ? openTargets.join(", ") : "not linked to a project on this site"}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div ref={channelRef} className="hidden lg:block" aria-hidden="true" />

          <div className="relative z-[1] flex flex-col justify-center gap-3 desk:gap-[clamp(6px,1.4vh,18px)]">
            <div>
              <h3 className="text-[13px] font-bold text-muted desk:text-[clamp(12px,1.55vh,17px)]">Projects</h3>
              <ul className="mt-1.5 grid gap-1.5 desk:mt-[clamp(3px,0.6vh,8px)] desk:gap-[clamp(3px,0.55vh,8px)]" aria-label="Projects">
                {projects.map(targetItem)}
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-muted desk:text-[clamp(12px,1.55vh,17px)]">Work</h3>
              <ul className="mt-1.5 grid gap-1.5 desk:mt-[clamp(3px,0.6vh,8px)] desk:gap-[clamp(3px,0.55vh,8px)]" aria-label="Work">
                {work.map(targetItem)}
              </ul>
            </div>
            <div className="glass-soft hidden min-h-[clamp(52px,8.4vh,96px)] rounded-[16px] px-3 py-2 lg:block desk:px-[clamp(10px,1.4vh,16px)] desk:py-[clamp(6px,1.1vh,12px)]">
              {noteTarget ? (
                <>
                  <p className="text-[13px] leading-snug text-ink-2 desk:text-[clamp(12px,1.55vh,16.5px)]">
                    <span className="font-semibold text-ink">{noteTarget.name}.</span> {noteTarget.note}
                  </p>
                  <a
                    href={noteTarget.href}
                    className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-accent-strong hover:text-ink desk:text-[clamp(12px,1.55vh,16.5px)]"
                  >
                    Go to it
                    <ArrowRightIcon size={13} />
                  </a>
                </>
              ) : (
                <p className="text-[13px] leading-snug text-muted desk:text-[clamp(12px,1.55vh,16.5px)]">
                  Point at a project or job to see its skills.
                </p>
              )}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {pinned || hover ? liveText : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
