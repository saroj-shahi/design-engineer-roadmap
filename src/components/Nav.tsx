import { useEffect, useRef } from "react";
import { Glyph, type GlyphName } from "./icons";
import { FindDialog } from "./QuickFind";
import { navPages, pageHref, type Page } from "./ui";

const BASE = import.meta.env.BASE_URL || "/";

const pageGlyph: Record<Page, GlyphName> = {
  home: "shift",
  jobs: "forecast",
  roles: "eye",
  plan: "route",
  ready: "check",
  library: "library",
  sources: "library",
};

/** Drives the reading progress bar directly via ref so scrolling never re-renders Nav. */
function useScrollProgressRef() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : null;
    ro?.observe(document.documentElement);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro?.disconnect();
    };
  }, []);
  return barRef;
}

export function Nav({ page }: { page: Page | null }) {
  const barRef = useScrollProgressRef();
  const rootPrefix = page === null ? BASE : "";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--desk)_82%,transparent)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-[1440px] px-(--gutter) grid grid-cols-[1fr_auto] grid-rows-[3.5rem_3rem] items-center gap-x-4 sm:gap-x-6 lg:h-16 lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-1">
        <a
          href={`${rootPrefix}${pageHref("home")}`}
          aria-label="Design Engineer Field Guide — Home"
          className="group flex items-center gap-2.5 self-stretch text-ink"
        >
          <BrandMark />
          <span className="flex flex-col leading-none">
            <span className="font-display font-semibold tracking-[-0.02em] text-pretty text-[1.0625rem] text-ink transition-colors duration-300 group-hover:text-accent-ink">Design Engineer</span>
            <span className="font-mono text-label font-normal mt-1 text-ink-3">
              Field Guide · <span className="text-accent-ink">2026</span>
            </span>
          </span>
        </a>

        <nav
          aria-label="Pages"
          className="col-span-2 row-start-2 -mx-[var(--gutter)] flex h-12 items-center justify-between gap-0.5 sm:gap-1 overflow-x-auto border-t border-line px-[var(--gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:mx-0 lg:h-auto lg:justify-center lg:border-t-0 lg:px-0"
        >
          {navPages.map((p) => {
            const on = page === p.id;
            return (
              <a
                key={p.id}
                href={`${rootPrefix}${pageHref(p.id)}`}
                aria-current={on ? "page" : undefined}
                className={`nav-link group relative flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full focus-visible:outline-offset-[-2px] px-2 text-[13px] transition-colors duration-300 sm:px-4 sm:text-sm ${
                  on ? "bg-accent-soft text-accent-ink" : "text-ink-2 hover:bg-sunken hover:text-ink"
                }`}
              >
                <span aria-hidden className="hidden xl:contents">
                  <Glyph name={pageGlyph[p.id]} on={on} className="!size-4" />
                </span>
                <span>{p.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-1 self-stretch">
          <FindDialog />
        </div>
      </div>
      <div aria-hidden className="absolute inset-x-0 -bottom-px h-0.5">
        <div ref={barRef} className="h-0.5 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
    </header>
  );
}

/** Bespoke Design × Code emblem: a vector selection frame with corner handles compiling into a code bracket. */
function BrandMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="brand-mark size-8 shrink-0 text-ink"
    >
      {/* Design frame + vector corner anchor handles */}
      <g className="bm-frame" stroke="currentColor" strokeLinecap="square" strokeLinejoin="miter">
        <rect x="4.5" y="6.5" width="13.5" height="19" rx="2" strokeWidth="2" />
        <rect x="2.75" y="4.75" width="3.5" height="3.5" fill="var(--card)" strokeWidth="1.5" />
        <rect x="16.25" y="4.75" width="3.5" height="3.5" fill="var(--card)" strokeWidth="1.5" />
        <rect x="2.75" y="23.75" width="3.5" height="3.5" fill="var(--card)" strokeWidth="1.5" />
        <rect x="16.25" y="23.75" width="3.5" height="3.5" fill="var(--card)" strokeWidth="1.5" />
      </g>
      {/* Overlap field where design meets code */}
      <polygon className="bm-merge" points="13,10 18,10 25,16 18,22 13,22" fill="var(--accent)" fillOpacity="0.18" />
      {/* Code slash + closing angle bracket */}
      <path className="bm-slash" d="M10.75 20.5L14.5 11.5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="square" />
      <path
        className="bm-code"
        d="M20.5 9.5L27 16L20.5 22.5"
        stroke="var(--accent)"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
