import { useEffect, useRef, useState } from "react";
import { Glyph, type GlyphName } from "./icons";
import { pageHref, pages, useTheme, type Page } from "./ui";

const pageGlyph: Record<Page, GlyphName> = {
  home: "shift",
  roles: "eye",
  plan: "route",
  ready: "check",
  library: "library",
};

/** Reading progress through the current page (0–1). */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
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
  return progress;
}

export function Nav({ page, grid, onToggleGrid }: { page: Page; grid: boolean; onToggleGrid: () => void }) {
  const progress = useScrollProgress();
  const navRef = useRef<HTMLElement>(null);

  // Keep the current page visible in the horizontally scrolling phone bar.
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: link.offsetLeft - nav.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" });
  }, [page]);

  return (
    <>
      <PageRail page={page} progress={progress} grid={grid} onToggleGrid={onToggleGrid} />
      <header className="sticky top-0 z-40 border-b-2 border-edge bg-card lg:hidden">
        <div className="wrap grid h-12 grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">
          <a href={pageHref("home")} className="group label flex items-center gap-2.5 self-stretch text-ink">
            <span aria-hidden className="tick text-accent transition-transform duration-700 ease-silk group-hover:rotate-45" />
            <span>DE/26</span>
          </a>
          <nav ref={navRef} aria-label="Pages" className="no-scrollbar flex gap-5 self-stretch overflow-x-auto">
            {pages.map((p) => {
              const on = page === p.id;
              return (
                <a
                  key={p.id}
                  href={pageHref(p.id)}
                  aria-current={on ? "page" : undefined}
                  className={`label flex shrink-0 items-center transition-colors duration-300 ${on ? "text-ink" : "text-ink-3 hover:text-ink"}`}
                >
                  <span className="link-ul" data-on={on}>
                    {p.label}
                  </span>
                </a>
              );
            })}
          </nav>
          <ThemeToggle className="-mr-2 grid size-11 place-items-center" />
        </div>
        <div aria-hidden className="absolute inset-x-0 -bottom-0.5 h-0.5">
          <div className="h-0.5 origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>
    </>
  );
}

/** Desktop spine: one cell per page, icon and name always visible; the current page is pressed in orange. */
function PageRail({ page, progress, grid, onToggleGrid }: { page: Page; progress: number; grid: boolean; onToggleGrid: () => void }) {
  return (
    <aside className="rail hidden flex-col lg:flex" aria-label="Site">
      <a href={pageHref("home")} className="group grid h-16 shrink-0 place-items-center border-b-2 border-edge" aria-label="DE/26 Field Guide: start page">
        <span aria-hidden className="tick !size-3 text-accent transition-transform duration-500 ease-silk group-hover:rotate-45" />
      </a>
      <nav aria-label="Pages" className="flex flex-1 flex-col">
        {pages.map((p) => {
          const on = page === p.id;
          return (
            <a
              key={p.id}
              href={pageHref(p.id)}
              aria-current={on ? "page" : undefined}
              className={`group relative flex flex-col items-center gap-2 border-b-2 border-edge px-1 py-4 text-center transition-colors duration-300 ${
                on ? "bg-accent text-[var(--on-accent)]" : "text-ink-3 hover:bg-sunken hover:text-ink"
              }`}
            >
              <Glyph name={pageGlyph[p.id]} on={on} className="!size-6" />
              <span className="font-mono text-[10px] leading-none tracking-tight">{p.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="border-t-2 border-edge">
        <ThemeToggle className="grid h-12 w-full place-items-center border-b-2 border-edge hover:bg-sunken" />
        <button
          type="button"
          onClick={onToggleGrid}
          aria-pressed={grid}
          title="Show the 12-column grid (Alt+G)"
          aria-keyshortcuts="Alt+G"
          className={`label grid h-12 w-full place-items-center transition-colors ${grid ? "bg-ink text-paper" : "text-ink-3 hover:text-ink"}`}
        >
          Grid
        </button>
      </div>
      <span aria-hidden className="absolute inset-y-0 right-[-2px] w-0.5 origin-top bg-accent" style={{ transform: `scaleY(${progress})` }} />
    </aside>
  );
}

/** Light / dark switch. The label names the theme it switches to. */
function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`group text-ink transition-colors ${className}`}
    >
      <Glyph name="theme" on={theme === "dark"} className="!size-6" />
    </button>
  );
}
