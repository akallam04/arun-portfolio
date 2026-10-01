"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Background } from "./Background";
import { IntroOverlay } from "./IntroOverlay";
import { Nav } from "./Nav";
import { MobileDock } from "./MobileDock";
import { Hero } from "./Hero";
import { AgentGraph } from "./AgentGraph";
import { Education } from "./Education";
import { Skills } from "./Skills";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

// Not needed for first paint: fetched when the page goes idle (so ⌘K still
// opens instantly) and rendered only while open.
const loadPalette = () =>
  import("./CommandPalette").then((m) => m.CommandPalette);
const CommandPalette = dynamic(loadPalette, { ssr: false });

export function PortfolioShell() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Global ⌘K / Ctrl+K shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const warm = () => void loadPalette();
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(warm, 2500);
    return () => window.clearTimeout(t);
  }, []);

  // A small hello for anyone who opens devtools.
  useEffect(() => {
    console.log(
      "%c Hey, fellow dev 👋 %c\n\nThis site is hand-built with Next.js + Tailwind. No UI kits, no animation libs.\nSource: https://github.com/akallam04/arun-portfolio\nLet's talk: akallam04@gmail.com",
      "background:#60a5fa;color:#05070c;font-weight:bold;padding:4px 8px;border-radius:4px",
      "color:#9ca3af"
    );
  }, []);

  return (
    <div className="min-h-screen text-slate-900">
      <Background />
      <IntroOverlay />
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      {paletteOpen && (
        <CommandPalette onClose={() => setPaletteOpen(false)} />
      )}

      <main id="main" tabIndex={-1} className="pt-14">
        <Hero />
        <AgentGraph />
        <Education />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>

      <Footer />
      <MobileDock />
    </div>
  );
}
