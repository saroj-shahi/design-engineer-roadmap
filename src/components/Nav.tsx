import { useEffect, useState } from "react";
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

export function Nav({ page }: { page: Page }) {
  const progress = useScrollProgress();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-edge bg-card">
      <div className="wrap grid grid-cols-[1fr_auto] grid-rows-[3rem_3rem] items-center gap-x-4 sm:gap-x-6 lg:h-16 lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-1">
        <a href={pageHref("home")} className="group label flex items-center gap-2.5 self-stretch text-ink">
          <span aria-hidden className="tick text-accent transition-transform duration-700 ease-silk group-hover:rotate-45" />
          <span>Field Guide</span>
        </a>

        <nav
          aria-label="Pages"
          className="col-span-2 row-start-2 -mx-[var(--gutter)] grid h-12 grid-cols-5 border-t border-line lg:static lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:mx-0 lg:flex lg:h-auto lg:items-center lg:gap-1.5 lg:self-stretch lg:border-t-0"
        >
          {pages.map((p) => {
            const on = page === p.id;
            return (
              <a
                key={p.id}
                href={pageHref(p.id)}
                aria-current={on ? "page" : undefined}
                className={`nav-link group label relative flex min-h-11 items-center justify-center gap-2 text-center transition-colors duration-300 lg:h-10 lg:border-2 lg:px-3 ${
                  on
                    ? "text-ink lg:border-edge lg:bg-accent lg:text-[var(--on-accent)]"
                    : "text-ink-3 hover:text-ink lg:border-transparent lg:hover:border-edge lg:hover:bg-sunken"
                }`}
              >
                <span aria-hidden className="hidden lg:contents">
                  <Glyph name={pageGlyph[p.id]} on={on} className="!size-5" />
                </span>
                <span>{p.label}</span>
                {on && <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-accent lg:hidden" />}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-1 self-stretch">
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
