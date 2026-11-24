import { sources } from "../data/research";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <p className="font-serif text-3xl leading-tight">
            Learn the browser.
            <br />
            <span className="italic text-accent">Then direct the AI.</span>
          </p>
        </div>
        <div className="lg:col-span-8">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-3">Sources cited in the research brief</p>
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm text-ink-2 sm:grid-cols-2">
            {sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="prose-measure mt-6 text-xs leading-relaxed text-ink-3">
            Figures are reproduced from “The 2026 Product Design Evolution” research brief with their original scope and vintage. Base
            wages (BLS) and total pay (Glassdoor) are different measures and are never charted together. Single job listings are
            examples, not market benchmarks.
          </p>
        </div>
      </div>
    </footer>
  );
}
