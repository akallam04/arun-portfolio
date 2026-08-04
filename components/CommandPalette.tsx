"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PROFILE, PROJECTS, SECTIONS } from "@/lib/data";
import { scrollToSection } from "@/lib/hooks";
import { cn } from "./ui";
import {
  BriefcaseIcon,
  CapIcon,
  CheckIcon,
  CopyIcon,
  ExternalIcon,
  FileIcon,
  FolderIcon,
  GitHubIcon,
  HomeIcon,
  LinkedInIcon,
  MailIcon,
  SearchIcon,
  SparkIcon,
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

const SECTION_ICONS: Record<string, React.ReactNode> = {
  home: <HomeIcon size={16} />,
  education: <CapIcon size={16} />,
  skills: <SparkIcon size={16} />,
  experience: <BriefcaseIcon size={16} />,
  projects: <FolderIcon size={16} />,
  contact: <MailIcon size={16} />,
};

/** Rendered only while open, so state resets naturally on each mount. */
export function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const copy = useCallback(async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1200);
    } catch {}
  }, []);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = SECTIONS.map((s) => ({
      id: `nav-${s.key}`,
      group: "Navigate",
      label: s.label,
      hint: "Jump to section",
      keywords: `go section ${s.label}`,
      icon: SECTION_ICONS[s.key],
      run: () => {
        onClose();
        // Let the dialog unmount before smooth-scrolling.
        window.setTimeout(() => scrollToSection(s.key), 60);
      },
    }));

    const links: Command[] = [
      {
        id: "link-github",
        group: "Links",
        label: "GitHub profile",
        hint: "github.com/akallam04",
        keywords: "code repos open source",
        icon: <GitHubIcon size={16} />,
        run: () => {
          window.open(PROFILE.github, "_blank", "noreferrer");
        },
      },
      {
        id: "link-linkedin",
        group: "Links",
        label: "LinkedIn",
        hint: "linkedin.com/in/akallam3",
        keywords: "connect network",
        icon: <LinkedInIcon size={16} />,
        run: () => {
          window.open(PROFILE.linkedin, "_blank", "noreferrer");
        },
      },
      {
        id: "link-resume",
        group: "Links",
        label: "View resume",
        hint: "PDF",
        keywords: "cv download",
        icon: <FileIcon size={16} />,
        run: () => {
          window.open(PROFILE.resume, "_blank", "noreferrer");
        },
      },
      ...PROJECTS.filter((p) => p.live).map((p) => ({
        id: `link-live-${p.name}`,
        group: "Links",
        label: `Open ${p.name}`,
        hint: p.liveLabel ?? "Live app",
        keywords: `project demo ${p.tags.join(" ")}`,
        icon: <ExternalIcon size={16} />,
        run: () => {
          window.open(p.live!, "_blank", "noreferrer");
        },
      })),
    ];

    const actions: Command[] = [
      {
        id: "act-email",
        group: "Actions",
        label: "Send me an email",
        hint: PROFILE.email,
        keywords: "contact mail hire reach out",
        icon: <MailIcon size={16} />,
        run: () => {
          window.location.href = `mailto:${PROFILE.email}`;
        },
      },
      {
        id: "act-copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: PROFILE.email,
        keywords: "clipboard contact",
        icon:
          copiedId === "act-copy-email" ? (
            <CheckIcon size={16} className="text-emerald-600" />
          ) : (
            <CopyIcon size={16} />
          ),
        run: () => copy("act-copy-email", PROFILE.email),
      },
      {
        id: "act-copy-phone",
        group: "Actions",
        label: "Copy phone number",
        hint: PROFILE.phone,
        keywords: "clipboard call contact",
        icon:
          copiedId === "act-copy-phone" ? (
            <CheckIcon size={16} className="text-emerald-600" />
          ) : (
            <CopyIcon size={16} />
          ),
        run: () => copy("act-copy-phone", PROFILE.phone),
      },
    ];

    return [...nav, ...links, ...actions];
  }, [onClose, copy, copiedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""} ${c.group}`
        .toLowerCase()
        .includes(q)
    );
  }, [commands, query]);

  // Lock body scroll and focus the input for the lifetime of the dialog.
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.documentElement.style.overflow = "";
      window.clearTimeout(t);
    };
  }, []);

  // Keep the highlighted row in view.
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

  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-900/25 backdrop-blur-sm"
      />
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-900/[0.12] bg-white/85 shadow-[0_24px_70px_rgba(30,80,150,0.28)] backdrop-blur-2xl"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-slate-900/[0.08] px-4">
          <SearchIcon size={16} className="shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Jump to a section, open a link, copy contact info…"
            className="palette-input h-12 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            aria-label="Search commands"
          />
          <kbd className="shrink-0 rounded border border-slate-400/40 bg-white/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-slate-400">
              No matches for “{query}”
            </div>
          )}
          {filtered.map((c, i) => {
            const showGroup = c.group !== lastGroup;
            lastGroup = c.group;
            return (
              <React.Fragment key={c.id}>
                {showGroup && (
                  <div className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 first:pt-1">
                    {c.group}
                  </div>
                )}
                <button
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
                        ? "border-sky-500/40 bg-sky-500/10 text-sky-700"
                        : "border-slate-400/30 bg-white/60 text-slate-500"
                    )}
                  >
                    {c.icon}
                  </span>
                  <span
                    className={cn(
                      "flex-1 truncate text-sm",
                      i === index ? "text-slate-900" : "text-slate-600"
                    )}
                  >
                    {c.label}
                  </span>
                  {c.hint && (
                    <span className="hidden max-w-[40%] truncate text-xs text-slate-400 sm:block">
                      {c.hint}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-4 border-t border-slate-900/[0.08] px-4 py-2.5 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-slate-400/40 bg-white/60 px-1 py-0.5 font-mono text-[9px]">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-slate-400/40 bg-white/60 px-1 py-0.5 font-mono text-[9px]">↵</kbd>
            select
          </span>
        </div>
      </div>
    </div>
  );
}
