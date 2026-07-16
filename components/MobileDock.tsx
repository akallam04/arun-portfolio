"use client";

import Dock from "./lightswind/dock";
import { SECTIONS, type SectionKey } from "@/lib/data";
import { scrollToSection, useActiveSection } from "@/lib/hooks";
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

/** App-style magnifying bottom dock, mobile/tablet only. */
export function MobileDock() {
  const active = useActiveSection();

  const dockItems = SECTIONS.map((s) => {
    const Icon = ICONS[s.key];
    return {
      icon: <Icon size={19} />,
      label: s.label,
      onClick: () => scrollToSection(s.key),
      active: active === s.key,
    };
  });

  return (
    <Dock
      items={dockItems}
      position="bottom"
      magnification={62}
      baseItemSize={44}
      className="lg:hidden"
    />
  );
}
