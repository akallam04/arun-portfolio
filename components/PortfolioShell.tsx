"use client";

import { useEffect, useState } from "react";
import { Background } from "./Background";
import { Nav } from "./Nav";
import { MobileDock } from "./MobileDock";
import { CommandPalette } from "./CommandPalette";
import { Hero } from "./Hero";
import { Education } from "./Education";
import { Skills } from "./Skills";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

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

  // A small hello for anyone who opens devtools.
  useEffect(() => {
    console.log(
      "%c Hey, fellow dev 👋 %c\n\nThis site is hand-built with Next.js + Tailwind. No UI kits, no animation libs.\nSource: https://github.com/akallam04/arun-portfolio\nLet's talk: akallam04@gmail.com",
      "background:#60a5fa;color:#05070c;font-weight:bold;padding:4px 8px;border-radius:4px",
      "color:#9ca3af"
    );
  }, []);

  return (
    <div className="min-h-screen text-white">
      <Background />
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      {paletteOpen && (
        <CommandPalette onClose={() => setPaletteOpen(false)} />
      )}

      <main className="pt-14">
        <Hero />
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
