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
    <header className="sticky top-0 z-40 border-b-2 border-edge bg-card">
      <div className="wrap grid h-12 grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6 lg:h-16 lg:grid-cols-[1fr_auto_1fr]">
        <a href={pageHref("home")} className="group label flex items-center gap-2.5 self-stretch text-ink">
          <span aria-hidden className="tick text-accent transition-transform duration-700 ease-silk group-hover:rotate-45" />
          <span>DE/26</span>
          <span className="hidden text-ink-3 xl:inline">· Field Guide</span>
        </a>

        <nav ref={navRef} aria-label="Pages" className="no-scrollbar flex items-center gap-5 self-stretch overflow-x-auto lg:gap-1.5">
          {pages.map((p) => {
            const on = page === p.id;
            return (
              <a
                key={p.id}
                href={pageHref(p.id)}
                aria-current={on ? "page" : undefined}
                className={`nav-link group label flex shrink-0 items-center gap-2 transition-colors duration-300 lg:h-10 lg:border-2 lg:px-3 ${
                  on
                    ? "text-ink lg:border-edge lg:bg-accent lg:text-[var(--on-accent)]"
                    : "text-ink-3 hover:text-ink lg:border-transparent lg:hover:border-edge lg:hover:bg-sunken"
                }`}
              >
                <span aria-hidden className="hidden lg:contents">
                  <Glyph name={pageGlyph[p.id]} on={on} className="!size-5" />
                </span>
                <span className="link-ul lg:!bg-none" data-on={on}>
                  {p.label}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-1 self-stretch">
          <button
            type="button"
            onClick={onToggleGrid}
            aria-pressed={grid}
            title="Show the 12-column grid (Alt+G)"
            aria-keyshortcuts="Alt+G"
            className={`label hidden h-10 px-3 transition-colors lg:block ${grid ? "bg-ink text-paper" : "text-ink-3 hover:text-ink"}`}
          >
            Grid
          </button>
          <ThemeToggle className="-mr-2 grid size-11 place-items-center lg:mr-0 lg:size-10 lg:hover:bg-sunken" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-x-0 -bottom-0.5 h-0.5">
        <div className="h-0.5 origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
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
