import { sources, worksCited } from "../data/research";
import { pageHref } from "../components/ui";
import { ExternalGlyph } from "../components/icons";

export function Footer() {
  return (
    <footer className="relative z-[1] bg-inverse text-on-inverse">
      <div className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-10 pt-10 sm:pt-14">
        {/* Sources and method live on their own page; the footer points to it. */}
        <a
          href={pageHref("sources")}
          className="group flex items-center justify-between gap-4 border-t border-inverse-line py-6 focus-visible:outline-offset-[-2px]"
        >
          <span className="text-base font-medium transition-colors duration-300 group-hover:text-inverse-accent">Sources and method</span>
          <span className="flex items-center gap-3 font-mono text-label font-normal text-inverse-muted">
            {sources.length} sources · {worksCited.length} articles
            <span aria-hidden className="transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-inverse-accent">→</span>
          </span>
        </a>

        <div className="font-mono text-label font-normal mt-10 flex flex-wrap items-baseline justify-between gap-4 border-t border-inverse-line pt-5 text-inverse-muted">
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
