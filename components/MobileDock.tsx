"use client";

import { SECTIONS, type SectionKey } from "@/lib/data";
import { scrollToSection, useActiveSection } from "@/lib/hooks";
import { cn } from "./ui";
import {
  BriefcaseIcon,
  CapIcon,
  FolderIcon,
  HomeIcon,
  MailIcon,
  SparkIcon,
} from "./icons";

const ICONS: Record<SectionKey, React.ComponentType<{ size?: number }>> = {
  home: HomeIcon,
  education: CapIcon,
  skills: SparkIcon,
  experience: BriefcaseIcon,
  projects: FolderIcon,
  contact: MailIcon,
};

/** App-style bottom navigation, mobile/tablet only. */
export function MobileDock() {
  const active = useActiveSection();
  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),12px)] lg:hidden"
    >
      <div className="flex items-center gap-1 rounded-2xl border border-white/[0.10] bg-[#0a0d14]/85 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {SECTIONS.map((s) => {
          const Icon = ICONS[s.key];
          const isActive = active === s.key;
          return (
            <button
              key={s.key}
              onClick={() => scrollToSection(s.key)}
              aria-label={s.label}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative flex h-11 w-11 flex-col items-center justify-center rounded-xl transition-all",
                isActive
                  ? "bg-white/[0.12] text-white"
                  : "text-white/40 active:bg-white/[0.06]"
              )}
            >
              <Icon size={19} />
              <span
                className={cn(
                  "absolute bottom-1 h-1 w-1 rounded-full bg-emerald-400 transition-all",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
