import { sources } from "../data/research";
import { Lines } from "../components/ui";

export function Footer() {
  return (
    <footer className="relative z-[1] bg-ink text-paper">
      <div className="wrap pb-10 pt-20 sm:pt-32">
        <Lines
          as="p"
          className="display-xxl"
          lines={["Learn the browser.", <em className="text-accent">Then direct the AI.</em>]}
        />

        <div className="grid-12 mt-24 gap-y-12 border-t border-paper/20 pt-8 sm:mt-36">
          <p className="label col-span-4 text-paper/50 lg:col-span-3">Sources cited in the research brief</p>
          <ul className="col-span-4 grid gap-x-6 gap-y-2 text-sm text-paper/80 sm:grid-cols-2 lg:col-span-9">
            {sources.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="label pt-0.5 tabular text-paper/40">{String(i + 1).padStart(2, "0")}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid-12 mt-16 gap-y-6 border-t border-paper/20 pt-8">
          <p className="label col-span-4 text-paper/50 lg:col-span-3">Method</p>
          <p className="col-span-4 max-w-[62ch] text-xs leading-relaxed text-paper/60 lg:col-span-6">
            Figures are reproduced from “The 2026 Product Design Evolution” research brief with their original scope and vintage. Base
            wages (BLS) and total pay (Glassdoor) are different measures and are never charted together. Single job listings are
            examples, not market benchmarks.
          </p>
        </div>

        <div className="label mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-paper/20 pt-5 text-paper/50">
          <span>Field Guide — Ed. 2026 · Rev. 11</span>
          <span>Set in Instrument Serif, DM Sans & JetBrains Mono</span>
          <span className="hidden lg:inline">
            Press <kbd className="border border-paper/30 px-1.5 py-0.5 text-paper">G</kbd> to show the grid
          </span>
          <a href="#top" className="group flex items-center gap-2 text-paper">
            <span className="link-ul">Back to top</span>
            <span aria-hidden className="transition-transform duration-700 ease-silk group-hover:-translate-y-1">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
