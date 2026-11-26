"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { PAGES } from "@/lib/pages";
import { useSite } from "./site/SiteContext";
import { cn } from "@/lib/cn";
import {
  BriefcaseIcon,
  CapIcon,
  ChatIcon,
  CheckIcon,
  CopyIcon,
  FileIcon,
  FolderIcon,
  GitHubIcon,
  HomeIcon,
  MailIcon,
  PlayCircleIcon,
  SearchIcon,
  SparkIcon,
  UsersIcon,
} from "./icons";

type Command = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  icon: React.ReactNode;
  run: () => void | Promise<void>;
};

const PAGE_ICONS: Record<string, React.ReactNode> = {
  home: <HomeIcon size={16} />,
  about: <UsersIcon size={16} />,
  shopify: <FolderIcon size={16} />,
  oversold: <FolderIcon size={16} />,
  shortfall: <FolderIcon size={16} />,
  "more-projects": <FolderIcon size={16} />,
  experience: <BriefcaseIcon size={16} />,
  education: <CapIcon size={16} />,
  skills: <SparkIcon size={16} />,
  github: <GitHubIcon size={16} />,
  contact: <MailIcon size={16} />,
};

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const site = useSite();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {}
  }, []);

  const commands = useMemo<Command[]>(() => {
    const later = (fn: () => void) => () => {
      onClose();
      window.setTimeout(fn, 60);
    };
    const pages: Command[] = PAGES.map((page) => ({
      id: `page-${page.id}`,
      group: "Go to",
      label: page.label,
      keywords: `go page ${page.label} ${page.nav}`,
      icon: PAGE_ICONS[page.id],
      run: later(() => site.goTo(page.id)),
    }));

    const actions: Command[] = [
      {
        id: "resume",
        group: "Actions",
        label: "Open resume",
        hint: "PDF",
        keywords: "cv",
        icon: <FileIcon size={16} />,
        run: () => {
          window.open(PROFILE.resume, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "copy-email",
        group: "Actions",
        label: copied ? "Copied" : "Copy email",
        hint: PROFILE.email,
        keywords: "clipboard contact mail",
        icon: copied ? <CheckIcon size={16} className="text-good-strong" /> : <CopyIcon size={16} />,
        run: copyEmail,
      },
      {
        id: "replay-race",
        group: "Actions",
        label: "Replay the race",
        hint: "Oversold",
        keywords: "oversold race replay",
        icon: <PlayCircleIcon size={16} />,
        run: later(site.replayRace),
      },
      ...(site.agentEnabled
        ? [
            {
              id: "ask-agent",
              group: "Actions",
              label: "Ask my agent",
              keywords: "chat question ai",
              icon: <ChatIcon size={16} />,
              run: later(() => site.openAgent()),
            },
          ]
        : []),
      {
        id: "tour",
        group: "Actions",
        label: "Take the 60-second tour",
        keywords: "tour walk through",
        icon: <PlayCircleIcon size={16} />,
        run: later(site.startTour),
      },
    ];

    return [...pages, ...actions];
  }, [onClose, site, copied, copyEmail]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""} ${c.group}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);

    const trapTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'input, button:not([disabled]):not([tabindex="-1"]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;
      const inside = !!current && panelRef.current.contains(current);
      if (!inside) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", trapTab);

    return () => {
      document.documentElement.style.overflow = "";
      window.clearTimeout(timer);
      window.removeEventListener("keydown", trapTab);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${index}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[index]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const groups: { name: string; items: { c: Command; i: number }[] }[] = [];
  filtered.forEach((c, i) => {
    const last = groups[groups.length - 1];
    if (last && last.name === c.group) last.items.push({ c, i });
    else groups.push({ name: c.group, items: [{ c, i }] });
  });
  const optionId = (i: number) => `palette-option-${i}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-900/25"
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-lg overflow-hidden rounded-[22px] border border-slate-900/[0.12] bg-white/90 shadow-[0_24px_70px_rgba(30,80,150,0.28)] backdrop-blur-2xl"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-slate-900/[0.08] px-4 transition-colors focus-within:bg-sky-50/80 focus-within:shadow-[inset_0_-2px_0_#0ea5e9]">
          <SearchIcon size={16} className="shrink-0 text-muted" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={filtered[index] ? optionId(index) : undefined}
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Go to a page or run an action"
            className="palette-input h-12 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
            aria-label="Search commands"
          />
          <kbd className="shrink-0 rounded-lg border border-slate-900/[0.12] bg-white/70 px-1.5 py-0.5 text-[12px] text-muted">
            Esc
          </kbd>
        </div>

        <div
          ref={listRef}
          id="palette-list"
          role="listbox"
          aria-label="Commands"
          className="max-h-[50vh] overflow-y-auto overscroll-contain p-2"
        >
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-[14px] text-muted">No matches for “{query}”</div>
          )}
          {groups.map((g, gi) => (
            <div key={g.name + g.items[0].i} role="group" aria-labelledby={`palette-group-${gi}`}>
              <div
                id={`palette-group-${gi}`}
                className={cn("px-3 pb-1 text-[13px] font-semibold text-muted", gi === 0 ? "pt-1" : "pt-3")}
              >
                {g.name}
              </div>
              {g.items.map(({ c, i }) => (
                <button
                  key={c.id}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === index}
                  tabIndex={-1}
                  data-idx={i}
                  onClick={() => c.run()}
                  onMouseMove={() => setIndex(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    i === index ? "bg-sky-600/10" : "bg-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
                      i === index
                        ? "border-sky-500/40 bg-sky-500/10 text-accent-strong"
                        : "border-slate-900/[0.10] bg-white/70 text-muted"
                    )}
                  >
                    {c.icon}
                  </span>
                  <span className={cn("flex-1 truncate text-[15px]", i === index ? "text-ink" : "text-ink-2")}>
                    {c.label}
                  </span>
                  {c.hint && (
                    <span className="hidden max-w-[45%] truncate text-[13px] text-muted sm:block">{c.hint}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="sr-only" aria-live="polite">
          {copied ? "Email copied to clipboard" : ""}
        </div>

        <div className="flex items-center gap-4 border-t border-slate-900/[0.08] px-4 py-2.5 text-[12px] text-muted">
          <span>Arrow keys to move</span>
          <span>Enter to run</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
