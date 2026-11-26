"use client";

import { useEffect, useRef, useState } from "react";
import {
  AGENT_LIMITS,
  AGENT_SOURCES,
  SUGGESTED_QUESTIONS,
  type AgentMessage,
  type AgentReply,
  type AgentSourceId,
} from "@/lib/agent-sources";
import { CheckIcon, CloseIcon, SendIcon } from "../icons";
import { cn, EXTERNAL } from "@/lib/cn";

type Turn =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; sources: AgentSourceId[]; checked: boolean; error?: boolean };

const STEPS = ["Read question", "Pick facts", "Write answer", "Check numbers"];

let askedThisVisit = 0;
let savedTurns: Turn[] = [];

export function AgentPanel({
  initialQuestion,
  onClose,
}: {
  initialQuestion?: string;
  onClose: () => void;
}) {
  const [turns, setTurns] = useState<Turn[]>(savedTurns);
  const [input, setInput] = useState(initialQuestion ?? "");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(-1);
  const [asked, setAsked] = useState(askedThisVisit);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const left = AGENT_LIMITS.perVisit - asked;

  useEffect(() => {
    savedTurns = turns;
  }, [turns]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'textarea, input, button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      } else if (!panelRef.current.contains(current)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const small = window.matchMedia("(max-width: 639px)").matches;
    if (small) document.documentElement.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      if (small) document.documentElement.style.overflow = "";
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [turns, busy]);

  const ask = async (question: string) => {
    const text = question.trim().slice(0, AGENT_LIMITS.questionChars);
    if (!text || busy || left <= 0) return;
    askedThisVisit += 1;
    setAsked(askedThisVisit);
    const history: AgentMessage[] = [...turns, { role: "user", content: text } as Turn]
      .slice(-AGENT_LIMITS.history)
      .map((turn) => ({ role: turn.role, content: turn.content }));
    setTurns((current) => [...current, { role: "user", content: text }]);
    setInput("");
    setBusy(true);
    setStep(0);
    const timers = [700, 1500, 2400].map((delay, i) => window.setTimeout(() => setStep(i + 1), delay));
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const body = (await response.json().catch(() => null)) as (AgentReply & { error?: string }) | null;
      if (!response.ok || !body || body.error) {
        throw new Error(body?.error ?? "The agent could not answer right now.");
      }
      setStep(4);
      setTurns((current) => [
        ...current,
        { role: "assistant", content: body.answer, sources: body.sources ?? [], checked: body.checked },
      ]);
    } catch (error) {
      setTurns((current) => [
        ...current,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "The agent could not answer right now.",
          sources: [],
          checked: false,
          error: true,
        },
      ]);
    } finally {
      timers.forEach((timer) => window.clearTimeout(timer));
      setBusy(false);
      window.setTimeout(() => setStep(-1), 600);
    }
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-title"
      className="glass fixed inset-0 z-[90] flex flex-col bg-white/80 sm:inset-auto sm:bottom-4 sm:right-4 sm:top-[calc(var(--nav-top)+var(--nav-h)+12px)] sm:w-[min(440px,calc(100vw-32px))] sm:rounded-[22px] lg:right-16"
    >
      <div className="flex items-start gap-3 border-b border-slate-900/[0.07] px-5 pb-3 pt-4">
        <div className="min-w-0 flex-1">
          <h2 id="agent-title" className="heading text-[22px] text-ink">
            Ask my agent
          </h2>
          <p className="mt-1.5 text-[14px] leading-snug text-ink-2">
            Answers only from the project data on this site. Every number is checked before you see it.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-900/[0.10] bg-white/70 text-ink-2 hover:text-ink"
        >
          <CloseIcon size={16} />
        </button>
      </div>

      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {turns.length === 0 ? (
          <div>
            <p className="text-[14px] text-muted">Try one of these:</p>
            <ul className="mt-2 flex flex-col items-start gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <li key={question}>
                  <button
                    type="button"
                    onClick={() => ask(question)}
                    disabled={busy || left <= 0}
                    className="rounded-xl border border-accent/30 bg-white/80 px-3 py-2 text-left text-[14px] font-medium text-accent-strong hover:bg-white disabled:opacity-50"
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <ol className="flex flex-col gap-3">
          {turns.map((turn, i) =>
            turn.role === "user" ? (
              <li key={i} className="flex justify-end">
                <p className="max-w-[88%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2 text-[14px] leading-snug text-white">
                  {turn.content}
                </p>
              </li>
            ) : (
              <li key={i} className="flex flex-col items-start gap-2">
                <p
                  className={cn(
                    "max-w-[94%] rounded-2xl rounded-bl-md border px-3.5 py-2.5 text-[14px] leading-relaxed",
                    turn.error
                      ? "border-bad/30 bg-red-50/90 text-bad-strong"
                      : "border-slate-900/[0.08] bg-white/90 text-ink"
                  )}
                >
                  {turn.content}
                </p>
                {turn.sources.length || turn.checked ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {turn.checked ? (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-600/25 bg-emerald-500/10 px-2 py-0.5 text-[12px] font-semibold text-good-strong">
                        <CheckIcon size={12} />
                        Numbers checked
                      </span>
                    ) : null}
                    {turn.sources.slice(0, 3).map((id) => {
                      const source = AGENT_SOURCES[id];
                      if (!source) return null;
                      const external = source.href.startsWith("http");
                      return (
                        <a
                          key={id}
                          href={source.href}
                          {...(external ? EXTERNAL : {})}
                          onClick={external ? undefined : onClose}
                          className="rounded-lg border border-slate-900/[0.10] bg-white/80 px-2 py-0.5 text-[12px] font-medium text-accent-strong hover:bg-white"
                        >
                          {source.label}
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </li>
            )
          )}
        </ol>
        {busy || step >= 0 ? (
          <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="Agent progress">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={cn(
                  "rounded-lg border px-2 py-1 text-[12px] font-semibold transition-colors",
                  i < step
                    ? "border-accent/40 bg-sky-50 text-accent-strong"
                    : i === step
                      ? "border-accent bg-accent text-white"
                      : "border-slate-900/[0.10] bg-white/70 text-muted"
                )}
              >
                {label}
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      <form
        className="border-t border-slate-900/[0.07] px-5 pb-4 pt-3"
        onSubmit={(event) => {
          event.preventDefault();
          ask(input);
        }}
      >
        <label htmlFor="agent-input" className="sr-only">
          Your question
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id="agent-input"
            ref={inputRef}
            rows={2}
            value={input}
            maxLength={AGENT_LIMITS.questionChars}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                ask(input);
              }
            }}
            placeholder="Ask about my projects, skills or experience"
            disabled={left <= 0}
            className="min-h-[52px] flex-1 resize-none rounded-xl border border-slate-900/[0.12] bg-white/85 px-3 py-2 text-[15px] text-ink outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
          <button
            type="submit"
            disabled={busy || !input.trim() || left <= 0}
            className="inline-flex h-[52px] items-center gap-1.5 rounded-xl bg-accent px-4 text-[14px] font-semibold text-white hover:bg-accent-strong disabled:opacity-50"
          >
            <SendIcon size={15} />
            Ask
          </button>
        </div>
        <p className="mt-2 text-[12px] text-muted">
          {left > 0
            ? `${left} of ${AGENT_LIMITS.perVisit} questions left this visit.`
            : "That's the limit for this visit. The project pages have the full details."}
        </p>
        <p className="mt-1 text-[12px] text-muted">
          Runs on Claude Haiku 5.5. It can be wrong, so the project pages are the source.
        </p>
      </form>
    </div>
  );
}
