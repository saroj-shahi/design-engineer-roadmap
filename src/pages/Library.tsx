import { Comparison } from "../sections/Comparison";
import { RoadmapTopics } from "../sections/RoadmapTopics";
import { SkillsExplorer } from "../sections/SkillsExplorer";
import { ToolingPipeline } from "../sections/ToolingPipeline";
import { glossary, glossaryTopicLabel, type GlossaryTopic } from "../data/research";
import { externalRoadmaps } from "../data/roadmaps";
import { useEffect, useState } from "react";
import { ContextBar, NextPage, PageHeader, SubHead, jumpTo, lastPlanHref, navigate, pageHref } from "../components/ui";

const shelves = [
  { id: "compare", label: "Compare roles" },
  { id: "skills", label: "Skills" },
  { id: "tools", label: "Tools" },
  { id: "roadmaps", label: "Roadmaps" },
  { id: "glossary", label: "Glossary" },
] as const;
type Shelf = (typeof shelves)[number]["id"];

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const sortedGlossary = [...glossary].sort((a, b) => a.term.localeCompare(b.term));

/** Reference material, one shelf at a time. The shelf lives in the URL (#/library/skills). */
export function Library({ shelf: raw, term }: { shelf?: string; term?: string }) {
  const shelf: Shelf = shelves.some((s) => s.id === raw) ? (raw as Shelf) : "compare";
  const shelfLabel = shelves.find((s) => s.id === shelf)!.label;
  const openTerm = shelf === "glossary" && term ? glossary.find((g) => slugify(g.term) === term) : undefined;
  const openRoadmap = shelf === "roadmaps" ? externalRoadmaps.find((r) => r.slug === term) : undefined;
  const subLabel = openTerm?.term ?? openRoadmap?.title;
  const trail = [
    { label: "Library", href: pageHref("library") },
    { label: shelfLabel, href: subLabel ? pageHref("library", shelf) : undefined },
    ...(subLabel ? [{ label: subLabel }] : []),
  ];
  return (
    <div className="pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-[1440px] px-(--gutter)">
      <PageHeader
        id="library-title"
        title={["Go deeper,", <em>when you want to.</em>]}
        lede="You don't need any of this to start. Open a shelf when a question comes up."
      >
        <nav aria-label="Library shelves" className="mt-10 grid max-w-full grid-cols-2 gap-1 rounded-ctl border border-edge bg-card p-1 sm:inline-flex">
          {shelves.map((s) => {
            const selected = s.id === shelf;
            return (
              <a
                key={s.id}
                href={pageHref("library", s.id)}
                aria-current={selected ? "page" : undefined}
                className={`font-mono text-label font-normal flex min-h-11 shrink-0 items-center justify-center border-edge px-4 text-center transition-colors duration-300 ease-silk rounded-chip max-sm:last:col-span-2 ${
                  selected ? "bg-inverse text-on-inverse" : "text-ink-3 hover:bg-sunken hover:text-ink"
                }`}
              >
                {s.label}
              </a>
            );
          })}
        </nav>
      </PageHeader>
      </div>

      {/* The sticky bar needs a tall parent; shelf sections keep their own .wrap, so neutralise the nested gutters. */}
      <div className="mx-auto w-full max-w-[1440px] px-(--gutter) [&_.wrap]:!max-w-none [&_.wrap]:!px-0">
        <ContextBar trail={trail} />
        <div key={shelf} className="animate-panel-in motion-reduce:animate-fade-in">
          {shelf === "compare" && <Comparison />}
          {shelf === "skills" && <SkillsExplorer />}
          {shelf === "tools" && <ToolingPipeline />}
          {shelf === "roadmaps" && <RoadmapTopics slug={term} />}
          {shelf === "glossary" && <Glossary term={term} />}
        </div>
      </div>
      <NextPage to="plan" href={lastPlanHref()} title="Back to your plan" note="Pick up where you left off, one month or stage at a time." />
    </div>
  );
}

function Glossary({ term }: { term?: string }) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<GlossaryTopic | "all">("all");
  const needle = q.trim().toLowerCase();
  const terms = sortedGlossary.filter(
    (g) =>
      (topic === "all" || g.topic === topic) &&
      (!needle || g.term.toLowerCase().includes(needle) || g.meaning.toLowerCase().includes(needle)),
  );
  const topics: { id: GlossaryTopic | "all"; label: string }[] = [
    { id: "all", label: "All" },
    ...(Object.keys(glossaryTopicLabel) as GlossaryTopic[]).map((id) => ({ id, label: glossaryTopicLabel[id] })),
  ];
  const openTerm = (name: string) => {
    setQ("");
    setTopic("all");
    navigate(pageHref("library", "glossary", slugify(name)), { replace: true });
  };

  useEffect(() => {
    if (term) jumpTo(`term-${term}`);
  }, [term]);

  return (
    <section aria-labelledby="glossary-title" className="pb-24 sm:pb-36">
      <SubHead
        id="glossary-title"
        title={<>Plain words for <em>the jargon.</em></>}
        note="Skip what you know. Look a term up when it comes up in a course, a job post or a team meeting."
        className="mt-10 !mb-0"
      />
      <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-2">
        <div className="w-full max-w-md">
          <label htmlFor="glossary-filter" className="font-mono text-label font-normal block text-ink-3">
            Filter terms
          </label>
          <input id="glossary-filter" type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" className="w-full rounded-none border-0 border-b border-line-strong bg-transparent py-3 text-xl tracking-[-0.01em] text-ink transition-colors duration-[400ms] ease-silk placeholder:text-ink-3 focus:border-accent-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink" />
        </div>
        <div role="group" aria-label="Show terms by topic" className="flex flex-wrap gap-2 pb-2">
          {topics.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={topic === l.id}
              onClick={() => setTopic(l.id)}
              className={`inline-flex min-h-10 items-center rounded-full border px-4 font-mono text-label font-normal transition-colors duration-300 ${
                topic === l.id ? "border-accent bg-accent-soft text-accent-ink" : "border-edge text-ink-2 hover:border-accent hover:text-ink"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="font-mono text-label font-normal pb-3 text-ink-3">
          {terms.length} {terms.length === 1 ? "term" : "terms"}
        </p>
      </div>
      {terms.length === 0 ? (
        <div className="mt-10">
          <p className="text-ink-2">{needle ? <>No term matches “{q.trim()}”.</> : "No terms here yet."}</p>
          <button type="button" onClick={() => { setQ(""); setTopic("all"); }} className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] font-mono text-label font-normal bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] mt-3 text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]">
            Clear filter
          </button>
        </div>
      ) : (
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((g) => {
            const slug = slugify(g.term);
            const href = pageHref("library", "glossary", slug);
            return (
              <div key={g.term} id={`term-${slug}`} className={`relative rounded-card border border-edge bg-card shadow-1 p-5 ${slug === term ? "!border-accent" : ""}`}>
                <dt className="font-display font-semibold tracking-[-0.02em] text-pretty text-[1.5rem] leading-tight text-ink">
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
                {g.see && g.see.length > 0 && (
                  <dd className="mt-3 text-sm text-ink-3">
                    See{" "}
                    {g.see.map((name, i) => (
                      <span key={name}>
                        {i > 0 && ", "}
                        <a
                          href={pageHref("library", "glossary", slugify(name))}
                          onClick={(e) => {
                            e.preventDefault();
                            openTerm(name);
                          }}
                          className="bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] text-ink hover:text-accent-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]"
                        >
                          {name}
                        </a>
                      </span>
                    ))}
                  </dd>
                )}
                <dd className="font-mono text-label font-normal mt-4 text-ink-3">{glossaryTopicLabel[g.topic]}</dd>
              </div>
            );
          })}
        </dl>
      )}
    </section>
  );
}
