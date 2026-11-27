import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { Nav } from "./components/Nav";
import { navPages, pageHref, pages, planFromParts, useRevealObserver, useRoute, type Route } from "./components/ui";
import { Home } from "./pages/Home";
import { Footer } from "./sections/Footer";

const Jobs = lazy(() => import("./pages/Jobs").then((m) => ({ default: m.Jobs })));
const Roles = lazy(() => import("./pages/Roles").then((m) => ({ default: m.Roles })));
const Plan = lazy(() => import("./pages/Plan").then((m) => ({ default: m.Plan })));
const Ready = lazy(() => import("./pages/Ready").then((m) => ({ default: m.Ready })));
const Library = lazy(() => import("./pages/Library").then((m) => ({ default: m.Library })));
const Sources = lazy(() => import("./pages/Sources").then((m) => ({ default: m.Sources })));

const BASE = import.meta.env.BASE_URL || "/";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <section aria-labelledby="err-title" className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-24 pt-20 sm:pb-36 sm:pt-28">
        <p className="font-mono text-label font-normal text-accent-ink">Something went wrong</p>
        <h1 id="err-title" className="font-display text-display-xl text-balance mt-4 text-ink">
          This page hit an <em>unexpected error.</em>
        </h1>
        <p className="max-w-[44ch] text-lede text-pretty text-ink-2 mt-8">Reload the page or return to the start of the guide.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button type="button" onClick={() => window.location.reload()} className="relative isolate inline-flex h-12 items-center gap-3 overflow-hidden rounded-full bg-accent pl-[1.375rem] pr-5 text-[0.9375rem] font-semibold tracking-[-0.005em] text-on-accent transition-[translate,box-shadow,color] duration-[260ms] ease-spring before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:bg-ink before:transition-transform before:duration-[550ms] before:ease-silk before:content-[''] hover:shadow-accent hover:before:translate-y-0 focus-visible:shadow-accent focus-visible:before:translate-y-0 active:translate-y-px motion-reduce:active:translate-y-0">
            Reload page
          </button>
          <a href={`${BASE}#/`} className="relative isolate inline-flex h-12 items-center gap-3 overflow-hidden rounded-full pl-[1.375rem] pr-5 text-[0.9375rem] font-semibold tracking-[-0.005em] text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] transition-[box-shadow,color] duration-[260ms] ease-spring before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:bg-sunken before:transition-transform before:duration-[550ms] before:ease-silk before:content-[''] hover:shadow-[inset_0_0_0_1px_var(--accent)] hover:before:translate-y-0 focus-visible:before:translate-y-0">
            Back to start
          </a>
        </div>
      </section>
    );
  }
}

function GridOverlay({ on }: { on: boolean }) {
  return (
    <div aria-hidden className="grid-overlay" data-on={on}>
      <div className="mx-auto w-full max-w-[1440px] px-(--gutter) h-full">
        <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 h-full">
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
      if (!e.altKey || e.metaKey || e.ctrlKey || (e.target instanceof Element && e.target.closest("input, textarea, [contenteditable]"))) return;
      if (e.code === "KeyG") {
        e.preventDefault();
        setGrid((g) => !g);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Each page gets its own document title & meta description, naming the sub-state where there is one.
  const title = titleFor(route);
  const description = descriptionFor(route);
  useEffect(() => {
    document.title = title;
    const meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description;
  }, [title, description]);

  // Keep client-side NotFound routes out of search indexes.
  useEffect(() => {
    const selector = 'meta[name="robots"][data-not-found]';
    const existing = document.head.querySelector(selector);
    if (route.notFound) {
      if (!existing) {
        const meta = document.createElement("meta");
        meta.name = "robots";
        meta.content = "noindex, nofollow";
        meta.setAttribute("data-not-found", "");
        document.head.appendChild(meta);
      }
    } else if (existing) {
      existing.remove();
    }
  }, [route.notFound]);

  // On a page change, move focus to the new page's heading so screen readers announce it.
  // Skip on initial mount (StrictMode-safe) and when a child deep link already moved focus inside <main>.
  const pageKey = route.notFound ? "404" : route.page;
  const prevPageKey = useRef(pageKey);
  useEffect(() => {
    if (prevPageKey.current === pageKey) return;
    prevPageKey.current = pageKey;
    const main = document.getElementById("main");
    if (main && document.activeElement && main.contains(document.activeElement) && document.activeElement !== main) return;
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
        className="font-mono text-label font-normal sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <GridOverlay on={grid} />
      <div aria-hidden className="grain" />
      <Nav page={route.notFound ? null : route.page} />
      <div>
        <main id="main" tabIndex={-1} className="relative z-[1] outline-none" key={pageKey}>
          <ErrorBoundary>
            {route.notFound ? (
              <NotFound />
            ) : (
              <Suspense fallback={<div className="mx-auto w-full max-w-[1440px] px-(--gutter) py-24 font-mono text-label font-normal text-ink-3">Loading…</div>}>
                {route.page === "home" && <Home />}
                {route.page === "jobs" && <Jobs figure={route.parts[0]} />}
                {route.page === "roles" && <Roles role={route.parts[0]} />}
                {route.page === "plan" && <Plan parts={route.parts} />}
                {route.page === "ready" && <Ready parts={route.parts} />}
                {route.page === "library" && <Library shelf={route.parts[0]} term={route.parts[1]} />}
                {route.page === "sources" && <Sources />}
              </Suspense>
            )}
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </>
  );
}

const SITE = "Design Engineer Field Guide";

const roleTitles: Record<string, string> = {
  de: "Design Engineer",
  meta: "Meta-Designer & Systems Architect",
  ax: "Agentic Experience (AX) Designer",
};

const shelfTitles: Record<string, string> = {
  compare: "Design vs. Design + Code",
  skills: "Skills",
  tools: "Tools",
  roadmaps: "Roadmaps",
  glossary: "Glossary",
};

function titleFor(route: Route) {
  if (route.notFound) return `Page Not Found | ${SITE}`;
  if (route.page === "home") return `${SITE} | 2026 Roles, Skills & Roadmap`;
  const p = pages.find((x) => x.id === route.page)!;
  if (route.page === "roles") {
    const roleName = route.parts[0] ? roleTitles[route.parts[0]] : null;
    return roleName ? `${roleName} | ${SITE}` : `Design Engineer, Meta-Designer & AX Roles | ${SITE}`;
  }
  if (route.page === "plan") {
    const plan = planFromParts(route.parts);
    if (plan) {
      const step = plan.track === "a" ? `Month ${plan.month} · Track A` : `Stage ${plan.stage} · Track B`;
      return `${step} — ${p.title} | ${SITE}`;
    }
  }
  if (route.page === "ready" && (route.parts[0] === "a" || route.parts[0] === "b")) {
    return `Track ${route.parts[0].toUpperCase()} — ${p.title} | ${SITE}`;
  }
  if (route.page === "library") {
    const shelf = route.parts[0] ?? "compare";
    if (shelf === "roadmaps") {
      const label = route.parts[1]
        ? route.parts[1]
            .split("-")
            .map((w) => (w === "ux" || w === "ai" ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
            .join(" ")
        : null;
      return label ? `${label} Roadmap | ${SITE}` : `Roadmaps | ${SITE}`;
    }
    return `${shelfTitles[shelf] ?? p.title} | ${SITE}`;
  }
  return `${p.title} | ${SITE}`;
}

function descriptionFor(route: Route) {
  if (route.notFound) return "That page does not exist in the Design Engineer Field Guide.";
  switch (route.page) {
    case "jobs":
      return "Is design work going away? The 2026 hiring data for designers, engineers and PMs, how teams are changing, and every market figure with its source.";
    case "roles":
      return "Compare Design Engineer, Meta-Designer, and Agentic Experience (AX) Designer roles, deliverables, skill signals, and handoff economics.";
    case "plan":
      return "Follow a six-month plan for working designers (Track A) or a four-stage plan for people starting out (Track B), with paired roadmap.sh topics.";
    case "ready":
      return "Interactive proof-of-work readiness checklist for designers shipping code in their current role or preparing for hybrid roles.";
    case "library":
      return "Reference library comparing traditional and hybrid design work, layered skills, AI tooling pipelines, 8 roadmap.sh tracks, and a plain-English glossary.";
    case "sources":
      return "Every source and article behind the Design Engineer Field Guide's figures, and how the research brief's data is used.";
    default:
      return "Practical 2026 guide for designers upskilling into code or Design Engineer, Meta-Designer and AX Designer roles: market data, skills, tooling, and a six-month plan.";
  }
}

/** Shown for any hash that names no page. Keeps the bad URL so the reader can see what went wrong. */
function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-24 pt-20 sm:pb-36 sm:pt-28">
      <p className="font-mono text-label font-normal text-accent-ink">Page not found</p>
      <h1 id="nf-title" className="font-display text-display-xl text-balance mt-4 text-ink">
        That page <em>doesn't exist.</em>
      </h1>
      <p className="max-w-[44ch] text-lede text-pretty text-ink-2 mt-8">
        The link may be mistyped or out of date. Pick one of the guide's five pages instead.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {navPages.map((p) => (
          <li key={p.id}>
            <a href={`${BASE}${pageHref(p.id)}`} className="relative rounded-card border border-edge bg-card shadow-1 group/card transition-[translate,box-shadow,border-color,opacity] duration-[260ms] ease-spring hover:-translate-y-[3px] hover:border-line-strong hover:shadow-2 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink has-[>input:focus-visible]:outline-2 has-[>input:focus-visible]:outline-offset-4 has-[>input:focus-visible]:outline-accent-ink motion-reduce:hover:translate-y-0 group flex h-full flex-col p-5">
              <span className="font-mono text-label font-normal text-ink-3">{p.label}</span>
              <span className="mt-3 block text-[1.0625rem] font-medium leading-snug tracking-tight text-ink">{p.title}</span>
              <span className="font-mono text-label font-normal mt-auto pt-6 text-accent-ink">Open →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
