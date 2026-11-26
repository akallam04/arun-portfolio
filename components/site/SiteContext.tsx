"use client";

import { createContext, useContext } from "react";
import type { PageId } from "@/lib/pages";

export type SiteApi = {
  agentEnabled: boolean;
  current: PageId;
  goTo: (page: PageId) => void;
  openPalette: () => void;
  openAgent: (question?: string) => void;
  startTour: () => void;
  replayRace: () => void;
};

export const SiteContext = createContext<SiteApi | null>(null);

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("useSite must be used inside SiteShell");
  return value;
}
