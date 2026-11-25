import { useEffect, useRef, useState } from "react";
import { Nav } from "./components/Nav";
import { pageHref, pages, planFromParts, useRevealObserver, useRoute, type Route } from "./components/ui";
import { Home } from "./pages/Home";
import { Roles } from "./pages/Roles";
import { Plan } from "./pages/Plan";
import { Ready } from "./pages/Ready";
import { Library } from "./pages/Library";
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
  const route = useRoute();
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

  // Each page gets its own document title, naming the sub-state where there is one.
  const title = titleFor(route);
  useEffect(() => {
    document.title = title;
  }, [title]);

  // On a page change, move focus to the new page's heading so screen readers announce it.
  const pageKey = route.notFound ? "404" : route.page;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const h1 = document.querySelector<HTMLElement>("main h1");
    if (!h1) return;
    h1.setAttribute("tabindex", "-1");
    h1.focus({ preventScroll: true });
  }, [pageKey]);

  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <GridOverlay on={grid} />
      <div aria-hidden className="grain" />
      <Nav page={route.page} />
      <div>
        <main id="main" tabIndex={-1} className="relative z-[1] outline-none" key={pageKey}>
          {route.notFound ? (
            <NotFound />
          ) : (
            <>
              {route.page === "home" && <Home />}
              {route.page === "roles" && <Roles role={route.parts[0]} />}
              {route.page === "plan" && <Plan parts={route.parts} />}
              {route.page === "ready" && <Ready parts={route.parts} />}
              {route.page === "library" && <Library shelf={route.parts[0]} term={route.parts[1]} />}
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

const SITE = "Design Engineer Field Guide";

function titleFor(route: Route) {
  if (route.notFound) return `Page not found · ${SITE}`;
  if (route.page === "home") return "Designer → Design Engineer · 2026 Field Guide";
  const p = pages.find((x) => x.id === route.page)!;
  if (route.page === "plan") {
    const plan = planFromParts(route.parts);
    if (plan) {
      const step = plan.track === "a" ? `Month ${plan.month} · Track A` : `Stage ${plan.stage} · Track B`;
      return `${step} · ${p.title} · ${SITE}`;
    }
  }
  if (route.page === "ready" && (route.parts[0] === "a" || route.parts[0] === "b")) {
    return `Track ${route.parts[0].toUpperCase()} · ${p.title} · ${SITE}`;
  }
  return `${p.title} · ${SITE}`;
}

/** Shown for any hash that names no page. Keeps the bad URL so the reader can see what went wrong. */
function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="wrap pb-24 pt-20 sm:pb-36 sm:pt-28">
      <p className="label text-accent-ink">Page not found</p>
      <h1 id="nf-title" className="display-xl mt-4 text-ink">
        That page <em>doesn't exist.</em>
      </h1>
      <p className="lede mt-8">
        The link may be mistyped or out of date. Pick one of the guide's five pages instead.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {pages.map((p) => (
          <li key={p.id}>
            <a href={pageHref(p.id)} className="card card-lift group flex h-full flex-col p-5">
              <span className="label text-ink-3">{p.label}</span>
              <span className="mt-3 block text-[1.0625rem] font-medium leading-snug tracking-tight text-ink">{p.title}</span>
              <span className="label mt-auto pt-6 text-accent-ink">Open →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
