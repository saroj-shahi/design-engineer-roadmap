import { useEffect, useRef, useState } from "react";

export const navSections = [
  { id: "shift", label: "Shift" },
  { id: "compare", label: "Compare" },
  { id: "skills", label: "Skills" },
  { id: "tooling", label: "Tooling" },
  { id: "roadmap", label: "Roadmap" },
  { id: "readiness", label: "Readiness" },
];

export function Nav() {
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

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2 font-mono text-xs tracking-tight text-ink">
          <span aria-hidden className="grid size-5 place-items-center rounded-[3px] bg-ink text-[10px] text-paper">
            DE
          </span>
          <span className="hidden sm:inline">field-guide/2026</span>
        </a>
        <nav ref={navRef} aria-label="Sections" className="no-scrollbar -mr-4 flex flex-1 justify-start gap-1 overflow-x-auto pr-4 sm:justify-end">
          {navSections.map((s, i) => {
            const on = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={`shrink-0 rounded px-2.5 py-1.5 text-sm transition-colors ${
                  on ? "bg-surface text-ink shadow-[0_0_0_1px_var(--line)]" : "text-ink-3 hover:text-ink"
                }`}
              >
                <span className="mr-1 hidden font-mono text-[10px] text-ink-3 md:inline">0{i + 1}</span>
                {s.label}
              </a>
            );
          })}
        </nav>
      </div>
      <div aria-hidden className="h-px bg-transparent">
        <div className="h-px origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  );
}
