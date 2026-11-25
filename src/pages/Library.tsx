import { Comparison } from "../sections/Comparison";
import { SkillsExplorer } from "../sections/SkillsExplorer";
import { ToolingPipeline } from "../sections/ToolingPipeline";
import { glossary } from "../data/research";
import { useEffect, useState } from "react";
import { ContextBar, Lines, NextPage, jumpTo, lastPlanHref, navigate, pageHref } from "../components/ui";

const shelves = [
  { id: "compare", label: "Compare roles" },
  { id: "skills", label: "Skills" },
  { id: "tools", label: "Tools" },
  { id: "glossary", label: "Glossary" },
] as const;
type Shelf = (typeof shelves)[number]["id"];

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const sortedGlossary = [...glossary].sort((a, b) => a.term.localeCompare(b.term));

/** Reference material, one shelf at a time. The shelf lives in the URL (#/library/skills). */
export function Library({ shelf: raw, term }: { shelf?: string; term?: string }) {
  const shelf: Shelf = shelves.some((s) => s.id === raw) ? (raw as Shelf) : "compare";
  const shelfLabel = shelves.find((s) => s.id === shelf)!.label;
  const open = shelf === "glossary" && term ? glossary.find((g) => slugify(g.term) === term) : undefined;
  const trail = [
    { label: "Library", href: pageHref("library") },
    { label: shelfLabel, href: open ? pageHref("library", shelf) : undefined },
    ...(open ? [{ label: open.term }] : []),
  ];
  return (
    <div className="pt-8 sm:pt-12">
      <header className="wrap pb-12 pt-10 sm:pb-16">
        <Lines as="h1" id="library-title" className="display-xl text-ink" lines={["Go deeper,", <em>when you want to.</em>]} />
        <p className="lede mt-8" data-reveal>
          You don't need any of this to start. Open a shelf when a question comes up.
        </p>
        <nav aria-label="Library shelves" className="mt-10 grid max-w-full grid-cols-2 border-2 border-edge bg-card shadow-[var(--sh-1)] sm:inline-flex">
          {shelves.map((s) => {
            const selected = s.id === shelf;
            return (
              <a
                key={s.id}
                href={pageHref("library", s.id)}
                aria-current={selected ? "page" : undefined}
                className={`label flex min-h-11 shrink-0 items-center justify-center border-edge px-4 text-center transition-colors duration-300 ease-silk max-sm:odd:border-r-2 max-sm:[&:nth-child(-n+2)]:border-b-2 sm:border-r-2 sm:last:border-r-0 ${
                  selected ? "bg-edge text-card" : "text-ink-3 hover:bg-sunken hover:text-ink"
                }`}
              >
                {s.label}
              </a>
            );
          })}
        </nav>
      </header>

      {/* The sticky bar needs a tall parent; shelf sections keep their own .wrap, so neutralise the nested gutters. */}
      <div className="wrap [&_.wrap]:!max-w-none [&_.wrap]:!px-0">
        <ContextBar trail={trail} />
        <div key={shelf} className="panel-in">
          {shelf === "compare" && <Comparison />}
          {shelf === "skills" && <SkillsExplorer />}
          {shelf === "tools" && <ToolingPipeline />}
          {shelf === "glossary" && <Glossary term={term} />}
        </div>
      </div>
      <NextPage to="plan" href={lastPlanHref()} title="Back to your plan" note="Pick up where you left off, one month or stage at a time." />
    </div>
  );
}

function Glossary({ term }: { term?: string }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const terms = needle
    ? sortedGlossary.filter((g) => g.term.toLowerCase().includes(needle) || g.meaning.toLowerCase().includes(needle))
    : sortedGlossary;

  useEffect(() => {
    if (term) jumpTo(`term-${term}`);
  }, [term]);

  return (
    <section aria-labelledby="glossary-title" className="pb-24 sm:pb-36">
      <h2 id="glossary-title" className="display-l mt-10 text-ink">
        Plain words for <em>the jargon.</em>
      </h2>
      <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-2">
        <div className="w-full max-w-md">
          <label htmlFor="glossary-filter" className="label block text-ink-3">
            Filter terms
          </label>
          <input id="glossary-filter" type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" className="input-line" />
        </div>
        <p aria-live="polite" className="label pb-3 text-ink-3">
          {terms.length} {terms.length === 1 ? "term" : "terms"}
        </p>
      </div>
      {terms.length === 0 ? (
        <div className="mt-10">
          <p className="text-ink-2">No term matches “{q.trim()}”.</p>
          <button type="button" onClick={() => setQ("")} className="hit label link-ul-static mt-3 text-ink">
            Clear filter
          </button>
        </div>
      ) : (
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((g) => {
            const slug = slugify(g.term);
            const href = pageHref("library", "glossary", slug);
            return (
              <div key={g.term} id={`term-${slug}`} className={`card p-5 ${slug === term ? "!border-accent" : ""}`}>
                <dt className="font-display text-[1.5rem] leading-tight tracking-tight text-ink">
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(href, { replace: true });
                    }}
                    className="hover:text-accent-ink"
                  >
                    {g.term}
                  </a>
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-2">{g.meaning}</dd>
              </div>
            );
          })}
        </dl>
      )}
    </section>
  );
}
