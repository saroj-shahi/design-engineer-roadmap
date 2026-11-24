import { useEffect, useRef, useState } from "react";

export const navSections = [
  { id: "shift", label: "Shift" },
  { id: "compare", label: "Compare" },
  { id: "skills", label: "Skills" },
  { id: "tooling", label: "Tooling" },
  { id: "roadmap", label: "Roadmap" },
  { id: "readiness", label: "Readiness" },
];

export function Nav({ grid, onToggleGrid }: { grid: boolean; onToggleGrid: () => void }) {
  const [active, setActive] = useState("shift");
  const [progress, setProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  // Keep the active link visible in the horizontally scrolling mobile nav.
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: link.offsetLeft - nav.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
      // Active = last section whose top has crossed 40% of the viewport.
      const line = window.innerHeight * 0.4;
      let current = navSections[0].id;
      for (const s of navSections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const pct = String(Math.round(progress * 100)).padStart(3, "0");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="wrap grid h-12 grid-cols-[auto_1fr] items-center gap-6 lg:grid-cols-12 lg:gap-6">
        <a href="#top" className="group label flex items-center gap-2.5 text-ink lg:col-span-3">
          <span aria-hidden className="tick text-accent transition-transform duration-700 ease-silk group-hover:rotate-45" />
          <span>DE/26</span>
          <span className="hidden text-ink-3 xl:inline">— Field Guide</span>
        </a>
        <nav ref={navRef} aria-label="Sections" className="no-scrollbar -mr-4 flex gap-5 overflow-x-auto pr-4 lg:col-span-7 lg:mr-0 lg:justify-between lg:pr-0">
          {navSections.map((s, i) => {
            const on = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={`label flex shrink-0 items-baseline gap-1.5 transition-colors duration-500 ${on ? "text-ink" : "text-ink-3 hover:text-ink"}`}
              >
                <span className={`tabular transition-colors duration-500 ${on ? "text-accent-ink" : ""}`}>0{i + 1}</span>
                <span className="link-ul" data-on={on}>
                  {s.label}
                </span>
              </a>
            );
          })}
        </nav>
        <div className="label hidden items-center justify-end gap-5 text-ink-3 lg:col-span-2 lg:flex">
          <button
            type="button"
            onClick={onToggleGrid}
            aria-pressed={grid}
            title="Show the 12-column grid (G)"
            className={`link-ul transition-colors ${grid ? "text-accent-ink" : "hover:text-ink"}`}
          >
            Grid
          </button>
          <span className="tabular text-ink" aria-hidden>
            {pct}%
          </span>
        </div>
      </div>
      <div aria-hidden className="absolute inset-x-0 -bottom-px h-px">
        <div className="h-px origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  );
}
