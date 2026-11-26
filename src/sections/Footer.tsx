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
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[0%_1px] bg-position-[100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk group-hover:bg-size-[100%_1px] group-hover:bg-position-[0%_100%] group-focus-visible:bg-size-[100%_1px] group-focus-visible:bg-position-[0%_100%]">{children}</span>
      <ExternalGlyph className="ml-1 text-inverse-muted transition-colors duration-300 group-hover:text-inverse-accent" />
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative z-[1] bg-inverse text-on-inverse">
      <div className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-10 pt-10 sm:pt-14">
        {/* Sources stay one click away instead of filling every page */}
        <details className="group/src border-t border-inverse-line">
          <summary className="group flex cursor-pointer list-none items-center justify-between gap-4 py-6 [&::-webkit-details-marker]:hidden">
            <span className="text-base font-medium transition-colors duration-300 group-hover:text-inverse-accent">Sources and method</span>
            <span className="font-mono text-label font-normal text-inverse-muted">
              {sources.length} sources · {worksCited.length} articles
              <span aria-hidden className="ml-3 inline-block transition-[transform,color] duration-300 group-hover:text-inverse-accent group-open/src:rotate-45">+</span>
            </span>
          </summary>
        <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 gap-y-12 border-t border-inverse-line pt-8">
          <p className="font-mono text-label font-normal col-span-4 text-inverse-muted lg:col-span-3">Sources cited in the research brief</p>
          <ul className="col-span-4 grid gap-x-6 gap-y-1 text-sm text-on-inverse sm:grid-cols-2 lg:col-span-9">
            {sources.map((s, i) => (
              <li key={s.label} className="flex items-start gap-3">
                <span className="font-mono text-label font-normal pt-2.5 tabular-nums text-inverse-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className={s.url ? "" : "py-2"}>{s.url ? <ExtLink href={s.url}>{s.label}</ExtLink> : s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 mt-16 gap-y-6 border-t border-inverse-line pt-8">
          <p className="font-mono text-label font-normal col-span-4 text-inverse-muted lg:col-span-3">Works cited</p>
          <ol className="col-span-4 grid gap-x-6 gap-y-1 text-sm text-on-inverse sm:grid-cols-2 lg:col-span-9">
            {worksCited.map((w, i) => (
              <li key={w.url} className="flex items-start gap-3">
                <span className="font-mono text-label font-normal pt-2.5 tabular-nums text-inverse-muted">{String(i + 1).padStart(2, "0")}</span>
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

        <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 mt-16 gap-y-6 border-t border-inverse-line pt-8">
          <p className="font-mono text-label font-normal col-span-4 text-inverse-muted lg:col-span-3">Method</p>
          <p className="col-span-4 max-w-[62ch] text-xs leading-relaxed text-inverse-muted lg:col-span-6">
            Figures are reproduced from “The 2026 Product Design Evolution” research brief with their original scope and vintage. Case
            studies describe single organizations and are not market benchmarks.
          </p>
        </div>
        </details>

        <div className="font-mono text-label font-normal mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-inverse-line pt-5 text-inverse-muted">
          <span className="flex items-baseline gap-2">
            Created by
            <a href="https://sarojshahi.com" target="_blank" rel="noopener noreferrer author" className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] group inline-flex items-baseline text-on-inverse">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[0%_1px] bg-position-[100%_100%] pb-0.5 transition-[background-size,color] duration-[600ms] ease-silk hover:bg-size-[100%_1px] hover:bg-position-[0%_100%] focus-visible:bg-size-[100%_1px] focus-visible:bg-position-[0%_100%] data-[on=true]:bg-size-[100%_1px] data-[on=true]:bg-position-[0%_100%] group-hover:bg-size-[100%_1px] group-hover:bg-position-[0%_100%] group-focus-visible:bg-size-[100%_1px] group-focus-visible:bg-position-[0%_100%]">Saroj Shahi</span>
              <ExternalGlyph className="ml-1 text-inverse-muted transition-colors duration-300 group-hover:text-inverse-accent" />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </span>
          <span className="hidden lg:inline">
            Press <kbd className="border border-inverse-line px-1.5 py-0.5 text-on-inverse">Alt</kbd> <kbd className="border border-inverse-line px-1.5 py-0.5 text-on-inverse">G</kbd> to show the grid
          </span>
          <a href="#main" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); document.getElementById("main")?.focus({ preventScroll: true }); }} className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] group flex items-center gap-2 text-on-inverse">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[0%_1px] bg-position-[100%_100%] pb-0.5 transition-[background-size,color] duration-[600ms] ease-silk hover:bg-size-[100%_1px] hover:bg-position-[0%_100%] focus-visible:bg-size-[100%_1px] focus-visible:bg-position-[0%_100%] data-[on=true]:bg-size-[100%_1px] data-[on=true]:bg-position-[0%_100%] group-hover:bg-size-[100%_1px] group-hover:bg-position-[0%_100%] group-focus-visible:bg-size-[100%_1px] group-focus-visible:bg-position-[0%_100%]">Back to top</span>
            <span aria-hidden className="transition-transform duration-700 ease-silk motion-safe:group-hover:-translate-y-1">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
