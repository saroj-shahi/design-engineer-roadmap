import { Comparison } from "../sections/Comparison";
import { SkillsExplorer } from "../sections/SkillsExplorer";
import { ToolingPipeline } from "../sections/ToolingPipeline";
import { glossary } from "../data/research";
import { Lines, NextPage, Tabs, pageHref } from "../components/ui";

const shelves = [
  { id: "compare", label: "Compare roles" },
  { id: "skills", label: "Skills" },
  { id: "tools", label: "Tools" },
  { id: "glossary", label: "Glossary" },
] as const;
type Shelf = (typeof shelves)[number]["id"];

/** Reference material, one shelf at a time. The shelf lives in the URL (#/library/skills). */
export function Library({ shelf: raw }: { shelf?: string }) {
  const shelf: Shelf = shelves.some((s) => s.id === raw) ? (raw as Shelf) : "compare";
  return (
    <div className="pt-8 sm:pt-12">
      <header className="wrap pb-12 pt-10 sm:pb-16">
        <Lines as="h1" id="library-title" className="display-xl text-ink" lines={["Go deeper,", <em>when you want to.</em>]} />
        <p className="lede mt-8" data-reveal>
          You don't need any of this to start. Open a shelf when a question comes up.
        </p>
        <div className="mt-10">
          <Tabs
            idPrefix="shelf"
            label="Library shelf"
            variant="segmented"
            value={shelf}
            onChange={(id) => {
              location.hash = pageHref("library", id);
            }}
            items={shelves.map((s) => ({ id: s.id, label: s.label }))}
          />
        </div>
      </header>

      <div role="tabpanel" id={`shelf-panel-${shelf}`} aria-labelledby={`shelf-tab-${shelf}`} key={shelf} className="panel-in">
        {shelf === "compare" && <Comparison />}
        {shelf === "skills" && <SkillsExplorer />}
        {shelf === "tools" && <ToolingPipeline />}
        {shelf === "glossary" && <Glossary />}
      </div>
      <NextPage to="plan" title="Back to your plan" note="Pick up where you left off, one month or stage at a time." />
    </div>
  );
}

function Glossary() {
  const terms = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <section aria-labelledby="glossary-title" className="wrap pb-24 sm:pb-36">
      <h2 id="glossary-title" className="display-l text-ink">
        Plain words for <em>the jargon.</em>
      </h2>
      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {terms.map((g) => (
          <div key={g.term} className="card p-5">
            <dt className="font-display text-[1.5rem] leading-tight tracking-tight text-ink">{g.term}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink-2">{g.meaning}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
