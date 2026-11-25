import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { pages, useRevealObserver, useRoute } from "./components/ui";
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

  // Each page gets its own document title.
  useEffect(() => {
    const p = pages.find((x) => x.id === route.page)!;
    document.title = route.page === "home" ? "Designer → Design Engineer · 2026 Field Guide" : `${p.title} · Design Engineer Field Guide`;
  }, [route.page]);

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
      <Nav page={route.page} grid={grid} onToggleGrid={() => setGrid((g) => !g)} />
      <div>
        <main id="main" tabIndex={-1} className="relative z-[1] outline-none" key={route.page}>
          {route.page === "home" && <Home />}
          {route.page === "roles" && <Roles />}
          {route.page === "plan" && <Plan />}
          {route.page === "ready" && <Ready />}
          {route.page === "library" && <Library shelf={route.parts[0]} />}
        </main>
        <Footer />
      </div>
    </>
  );
}
