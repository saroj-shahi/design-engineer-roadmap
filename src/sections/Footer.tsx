import { pageHref } from "../components/ui";
import { ExternalGlyph } from "../components/icons";

/** Quiet text link for the footer: muted until hovered or focused. */
const link = "group inline-flex min-h-11 items-center gap-1 text-ink-2 transition-colors duration-300 hover:text-ink focus-visible:text-ink";

/** One slim row: who made it, where the sources live, and a way back up. */
export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-line">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-(--gutter) py-6 font-mono text-label text-ink-3">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>Design Engineer Field Guide</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            Created by
            <a href="https://sarojshahi.com" target="_blank" rel="noopener noreferrer author" className={link}>
              Saroj Shahi
              <ExternalGlyph className="text-ink-3 transition-colors duration-300 group-hover:text-accent-ink" />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </span>
        </p>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <a href={pageHref("sources")} className={link}>
            Sources and method
          </a>
          <a href="https://github.com/saroj-shahi/design-engineer-roadmap" target="_blank" rel="noopener noreferrer" className={link}>
            Source on GitHub
            <ExternalGlyph className="text-ink-3 transition-colors duration-300 group-hover:text-accent-ink" />
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          <a href="https://buymeacoffee.com/sarojshahi" target="_blank" rel="noopener noreferrer" className={link}>
            Buy me a coffee
            <ExternalGlyph className="text-ink-3 transition-colors duration-300 group-hover:text-accent-ink" />
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          <a
            href="#main"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0 });
              document.getElementById("main")?.focus({ preventScroll: true });
            }}
            className={link}
          >
            Back to top
            <span aria-hidden className="transition-transform duration-500 ease-silk motion-safe:group-hover:-translate-y-0.5">
              ↑
            </span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
