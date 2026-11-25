import { sources, worksCited } from "../data/research";
import { ExternalGlyph } from "../components/icons";

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-block py-2">
      <span className="link-ul">{children}</span>
      <ExternalGlyph className="ml-1 text-inverse-muted transition-colors duration-300 group-hover:text-inverse-accent" />
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative z-[1] bg-inverse text-on-inverse">
      <div className="wrap pb-10 pt-10 sm:pt-14">
        {/* Sources stay one click away instead of filling every page */}
        <details className="group/src border-t border-inverse-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 [&::-webkit-details-marker]:hidden">
            <span className="text-base font-medium">Sources and method</span>
            <span className="label text-inverse-muted">
              {sources.length} sources · {worksCited.length} articles
              <span aria-hidden className="ml-3 inline-block transition-transform duration-300 group-open/src:rotate-45">+</span>
            </span>
          </summary>
        <div className="grid-12 gap-y-12 border-t border-inverse-line pt-8">
          <p className="label col-span-4 text-inverse-muted lg:col-span-3">Sources cited in the research brief</p>
          <ul className="col-span-4 grid gap-x-6 gap-y-1 text-sm text-on-inverse sm:grid-cols-2 lg:col-span-9">
            {sources.map((s, i) => (
              <li key={s.label} className="flex items-start gap-3">
                <span className="label pt-2.5 tabular text-inverse-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className={s.url ? "" : "py-2"}>{s.url ? <ExtLink href={s.url}>{s.label}</ExtLink> : s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid-12 mt-16 gap-y-6 border-t border-inverse-line pt-8">
          <p className="label col-span-4 text-inverse-muted lg:col-span-3">Works cited</p>
          <ol className="col-span-4 grid gap-x-6 gap-y-1 text-sm text-on-inverse sm:grid-cols-2 lg:col-span-9">
            {worksCited.map((w, i) => (
              <li key={w.url} className="flex items-start gap-3">
                <span className="label pt-2.5 tabular text-inverse-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <ExtLink href={w.url}>{w.title}</ExtLink>
                  <span className="-mt-1 block truncate pb-1 font-mono text-[11px] text-inverse-muted">
                    {hostnameOf(w.url)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid-12 mt-16 gap-y-6 border-t border-inverse-line pt-8">
          <p className="label col-span-4 text-inverse-muted lg:col-span-3">Method</p>
          <p className="col-span-4 max-w-[62ch] text-xs leading-relaxed text-inverse-muted lg:col-span-6">
            Figures are reproduced from “The 2026 Product Design Evolution” research brief with their original scope and vintage. Case
            studies describe single organizations and are not market benchmarks.
          </p>
        </div>
        </details>

        <div className="label mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-inverse-line pt-5 text-inverse-muted">
          <span className="flex items-baseline gap-2">
            Created by
            <a href="https://sarojshahi.com" target="_blank" rel="noopener noreferrer author" className="hit group inline-flex items-baseline text-on-inverse">
              <span className="link-ul">Saroj Shahi</span>
              <ExternalGlyph className="ml-1 text-inverse-muted transition-colors duration-300 group-hover:text-inverse-accent" />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </span>
          <span className="hidden lg:inline">
            Press <kbd className="border border-inverse-line px-1.5 py-0.5 text-on-inverse">Alt</kbd> <kbd className="border border-inverse-line px-1.5 py-0.5 text-on-inverse">G</kbd> to show the grid
          </span>
          <a href="#main" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); document.getElementById("main")?.focus({ preventScroll: true }); }} className="hit group flex items-center gap-2 text-on-inverse">
            <span className="link-ul">Back to top</span>
            <span aria-hidden className="transition-transform duration-700 ease-silk motion-safe:group-hover:-translate-y-1">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
