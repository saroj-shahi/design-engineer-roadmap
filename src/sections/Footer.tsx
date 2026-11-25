import { sources, worksCited } from "../data/research";
import { Lines } from "../components/ui";
import { ExternalGlyph } from "../components/icons";

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group">
      <span className="link-ul">{children}</span>
      <ExternalGlyph className="ml-1 text-inverse-muted transition-colors duration-300 group-hover:text-inverse-accent" />
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative z-[1] bg-inverse text-on-inverse">
      <div className="wrap pb-10 pt-20 sm:pt-32">
        <Lines
          as="p"
          className="display-xxl"
          lines={["Learn the browser.", <em className="text-inverse-accent">Then direct the AI.</em>]}
        />

        <div className="grid-12 mt-24 gap-y-12 border-t border-inverse-line pt-8 sm:mt-36">
          <p className="label col-span-4 text-inverse-muted lg:col-span-3">Sources cited in the research brief</p>
          <ul className="col-span-4 grid gap-x-6 gap-y-2 text-sm text-on-inverse sm:grid-cols-2 lg:col-span-9">
            {sources.map((s, i) => (
              <li key={s.label} className="flex gap-3">
                <span className="label pt-0.5 tabular text-inverse-muted">{String(i + 1).padStart(2, "0")}</span>
                <span>{s.url ? <ExtLink href={s.url}>{s.label}</ExtLink> : s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid-12 mt-16 gap-y-6 border-t border-inverse-line pt-8">
          <p className="label col-span-4 text-inverse-muted lg:col-span-3">Works cited</p>
          <ol className="col-span-4 grid gap-x-6 gap-y-2 text-sm text-on-inverse sm:grid-cols-2 lg:col-span-9">
            {worksCited.map((w, i) => (
              <li key={w.url} className="flex gap-3">
                <span className="label pt-0.5 tabular text-inverse-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <ExtLink href={w.url}>{w.title}</ExtLink>
                  <span className="mt-0.5 block truncate font-mono text-[11px] text-inverse-muted">
                    {new URL(w.url).hostname.replace(/^www\./, "")}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid-12 mt-16 gap-y-6 border-t border-inverse-line pt-8">
          <p className="label col-span-4 text-inverse-muted lg:col-span-3">Method</p>
          <p className="col-span-4 max-w-[62ch] text-xs leading-relaxed text-inverse-muted lg:col-span-6">
            Figures are reproduced from “The 2026 Product Design Evolution” research brief with their original scope and vintage. Base
            wages (BLS) and total pay (Glassdoor) are different measures and are never charted together. Single job listings are
            examples, not market benchmarks.
          </p>
        </div>

        <div className="label mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-inverse-line pt-5 text-inverse-muted">
          <span>Field Guide — Ed. 2026 · Rev. 11</span>
          <span>Set in Archivo &amp; Martian Mono</span>
          <span className="hidden lg:inline">
            Press <kbd className="border border-inverse-line px-1.5 py-0.5 text-on-inverse">Alt</kbd> <kbd className="border border-inverse-line px-1.5 py-0.5 text-on-inverse">G</kbd> to show the grid
          </span>
          <a href="#top" className="hit group flex items-center gap-2 text-on-inverse">
            <span className="link-ul">Back to top</span>
            <span aria-hidden className="transition-transform duration-700 ease-silk group-hover:-translate-y-1">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
