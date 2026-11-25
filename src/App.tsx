import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { useDeepLinks, useRevealObserver } from "./components/ui";
import { Hero } from "./sections/Hero";
import { Comparison } from "./sections/Comparison";
import { SkillsExplorer } from "./sections/SkillsExplorer";
import { ToolingPipeline } from "./sections/ToolingPipeline";
import { Roadmap } from "./sections/Roadmap";
import { Readiness } from "./sections/Readiness";
import { Footer } from "./sections/Footer";

function GridOverlay({ on }: { on: boolean }) {
  return (
    <div aria-hidden className="grid-overlay" data-on={on}>
      <div className="wrap h-full">
        <div className="grid-12 h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={i >= 4 ? "hidden lg:block" : ""} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useRevealObserver();
  useDeepLinks();
  const [grid, setGrid] = useState(false);

  // Alt+G highlights the 12-column structure the page is set on. A modifier keeps it from
  // firing on stray keystrokes or dictated words (WCAG 2.1.4); e.code survives macOS Option glyphs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (!e.altKey || e.metaKey || e.ctrlKey || t.closest("input, textarea, [contenteditable]")) return;
      if (e.code === "KeyG") {
        e.preventDefault();
        setGrid((g) => !g);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <GridOverlay on={grid} />
      <div aria-hidden className="grain" />
      <Nav grid={grid} onToggleGrid={() => setGrid((g) => !g)} />
      <div className="with-rail">
        <main id="main" className="relative z-[1]">
          <Hero />
          <Comparison />
          <SkillsExplorer />
          <ToolingPipeline />
          <Roadmap />
          <Readiness />
        </main>
        <Footer />
      </div>
    </>
  );
}
