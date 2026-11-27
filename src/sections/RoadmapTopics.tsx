import { useState, type CSSProperties } from "react";
import { BrandLogo, BrandLogosFor } from "../components/BrandLogo";
import { ExternalGlyph } from "../components/icons";
import {
  Eyebrow,
  Section,
  SectionHeader,
  SubHead,
  Tag,
  TopicCheckbox,
  navigate,
  pageHref,
  usePersistentSet,
  useSaveNote,
  useTabList,
} from "../components/ui";
import {
  companionRoadmaps,
  countRoadmapTopics,
  externalRoadmaps,
  type ExternalRoadmap,
  type RoadmapGroup,
} from "../data/roadmaps";

const STORAGE_KEY = "de-guide:roadmap-topics";
const topicKey = (slug: string, milestoneId: string, item: string) => `${slug}:${milestoneId}:${item}`;

const groupMeta: Record<RoadmapGroup, { label: string; note: string }> = {
  design: {
    label: "Design craft & systems",
    note: "Foundational UX, product design and design system curricula.",
  },
  "engineering-ai": {
    label: "Front-end & AI workflows",
    note: "Web engineering, AI product building, prompting, agents and coding tools.",
  },
};

const totalTopicsAll = externalRoadmaps.reduce((n, r) => n + countRoadmapTopics(r), 0);

export function RoadmapTopics({ slug }: { slug?: string }) {
  const active: ExternalRoadmap =
    externalRoadmaps.find((r) => r.slug === slug) ?? externalRoadmaps[0];
  const [query, setQuery] = useState("");
  const [searchAll, setSearchAll] = useState(false);
  const [undoSet, setUndoSet] = useState<Set<string> | null>(null);
  const ticks = usePersistentSet(STORAGE_KEY);
  const saveNote = useSaveNote();

  const selectRoadmap = (nextSlug: string) => {
    setUndoSet(null);
    navigate(pageHref("library", "roadmaps", nextSlug), { replace: true });
  };

  const { listProps, tabProps, panelProps } = useTabList({
    ids: externalRoadmaps.map((r) => r.slug),
    value: active.slug,
    onChange: selectRoadmap,
    idPrefix: "ext-roadmap",
  });

  const activeTotal = countRoadmapTopics(active);
  const activeDone = active.milestones.reduce(
    (sum, m) =>
      sum +
      m.branches.reduce(
        (bSum, b) =>
          bSum + b.items.filter((item) => ticks.set.has(topicKey(active.slug, m.id, item))).length,
        0,
      ),
    0,
  );
  const activePct = activeTotal > 0 ? Math.round((activeDone / activeTotal) * 100) : 0;

  const needle = query.trim().toLowerCase();

  const resetActive = () => {
    const prev = new Set(ticks.set);
    const next = new Set(
      [...ticks.set].filter((k) => !k.startsWith(`${active.slug}:`)),
    );
    ticks.restore(next);
    setUndoSet(prev);
  };

  const undoReset = () => {
    if (!undoSet) return;
    ticks.restore(undoSet);
    setUndoSet(null);
  };

  const crossMatches =
    needle && searchAll
      ? externalRoadmaps
          .map((r) => {
            const hits: { milestoneId: string; milestoneTitle: string; item: string }[] = [];
            for (const m of r.milestones) {
              const mMatch =
                m.title.toLowerCase().includes(needle) ||
                m.summary.toLowerCase().includes(needle);
              for (const b of m.branches) {
                const bMatch = b.heading?.toLowerCase().includes(needle) ?? false;
                for (const item of b.items) {
                  if (mMatch || bMatch || item.toLowerCase().includes(needle)) {
                    hits.push({ milestoneId: m.id, milestoneTitle: m.title, item });
                  }
                }
              }
            }
            return { roadmap: r, hits };
          })
          .filter((entry) => entry.hits.length > 0)
      : [];

  const filteredMilestones = active.milestones
    .map((m) => {
      if (!needle) return m;
      const mMatch =
        m.title.toLowerCase().includes(needle) ||
        m.summary.toLowerCase().includes(needle);
      if (mMatch) return m;
      const branches = m.branches
        .map((b) => {
          if (b.heading?.toLowerCase().includes(needle)) return b;
          const items = b.items.filter((item) => item.toLowerCase().includes(needle));
          return { ...b, items };
        })
        .filter((b) => b.items.length > 0);
      return { ...m, branches };
    })
    .filter((m) => m.branches.length > 0);

  return (
    <Section id="roadmaps">
      <SectionHeader
        id="roadmaps"
        title={["Topic roadmaps,", <em>from roadmap.sh.</em>]}
        lede={`${externalRoadmaps.length} full topic syllabi (${totalTopicsAll} topics) plus ${companionRoadmaps.length} companion skill tracks from roadmap.sh — mapped to the roles in this guide. ${saveNote}`}
      />

      {/* Roadmap selector grouped into Design vs Code & AI */}
      <div {...listProps} aria-label="Official roadmap.sh tracks" className="space-y-8">
        {(["design", "engineering-ai"] as const).map((group) => {
          const items = externalRoadmaps.filter((r) => r.group === group);
          return (
            <div key={group}>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-label font-normal text-ink">{groupMeta[group].label}</p>
                <p className="text-xs text-ink-3">{groupMeta[group].note}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((r) => {
                  const idx = externalRoadmaps.findIndex((x) => x.slug === r.slug);
                  const on = r.slug === active.slug;
                  const total = countRoadmapTopics(r);
                  const done = r.milestones.reduce(
                    (s, m) =>
                      s +
                      m.branches.reduce(
                        (bs, b) =>
                          bs +
                          b.items.filter((item) => ticks.set.has(topicKey(r.slug, m.id, item)))
                            .length,
                        0,
                      ),
                    0,
                  );
                  return (
                    <button
                      key={r.slug}
                      {...tabProps(r.slug, idx)}
                      className={`rounded-card border border-edge bg-card shadow-1 group/card transition-[translate,box-shadow,border-color,opacity] duration-[260ms] ease-spring hover:-translate-y-[3px] hover:border-line-strong hover:shadow-2 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink has-[>input:focus-visible]:outline-2 has-[>input:focus-visible]:outline-offset-4 has-[>input:focus-visible]:outline-accent-ink motion-reduce:hover:translate-y-0 group relative flex h-full flex-col overflow-hidden p-4 text-left transition-colors duration-300 ${
                        on ? "is-on translate-y-0! border-accent! shadow-accent!" : ""
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-x-5 -top-px h-[3px] origin-left rounded-full bg-accent transition-transform duration-500 ease-silk ${
                          on ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`font-mono text-label font-normal ${on ? "text-accent-ink" : "text-ink-3"}`}>
                          {r.milestones.length} sections
                        </span>
                        <span className="font-mono text-label font-normal tabular-nums text-ink-3">
                          {done > 0 ? `${done}/${total}` : `${total} topics`}
                        </span>
                      </span>
                      <span
                        className={`mt-2.5 flex items-center gap-2 font-display font-semibold tracking-[-0.02em] text-pretty text-[1.375rem] leading-[1.08] transition-colors duration-300 ${
                          on ? "text-ink" : "text-ink-2 group-hover:text-ink"
                        }`}
                      >
                        <BrandLogosFor text={r.shortTitle} max={1} className="size-4 text-accent-ink" />
                        <span>{r.shortTitle}</span>
                      </span>
                      <span className="mt-2 block text-xs leading-snug text-ink-3">
                        {r.fits[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active roadmap specimen plate + milestone spine */}
      <div
        {...panelProps(active.slug)}
        key={active.slug}
        className="animate-panel-in motion-reduce:animate-fade-in mt-12 focus-visible:outline-offset-8 sm:mt-16"
      >
        <div className="relative rounded-card border border-edge bg-card shadow-1">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
            <span>roadmap.sh/{active.slug}</span>
            <span className="tabular-nums">
              {active.milestones.length} sections · {activeTotal} topics
            </span>
          </div>

          <div className="grid gap-8 px-5 py-7 sm:px-7 sm:py-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="font-display text-display-m text-balance text-ink">{active.title}</h3>
              <p className="mt-3 max-w-[58ch] leading-relaxed text-ink-2">{active.tagline}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="font-mono text-label font-normal mr-1 text-ink-3">Best for</span>
                {active.fits.map((f) => (
                  <Tag key={f} tone="accent">
                    {f}
                  </Tag>
                ))}
              </div>

              {active.related.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-3">
                  <span className="font-mono text-label font-normal">Connects to</span>
                  {active.related.map((relSlug) => {
                    const rel = externalRoadmaps.find((x) => x.slug === relSlug);
                    if (!rel) return null;
                    return (
                      <button
                        key={relSlug}
                        type="button"
                        onClick={() => selectRoadmap(relSlug)}
                        className="inline-flex min-h-6 items-center relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] font-medium text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]"
                      >
                        {rel.shortTitle}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between gap-6 border-t border-line pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
              <div>
                <div className="font-mono text-label font-normal flex items-baseline justify-between text-ink-3">
                  <span>Topics covered</span>
                  <span className="tabular-nums text-ink">
                    {activeDone} / {activeTotal} ({activePct}%)
                  </span>
                </div>
                <div
                  className="relative overflow-hidden rounded-full bg-line mt-3 h-2"
                  role="progressbar"
                  aria-label={`${active.title} topics covered`}
                  aria-valuenow={activeDone}
                  aria-valuemin={0}
                  aria-valuemax={activeTotal}
                >
                  <div
                    className="absolute inset-y-0 left-0 origin-left rounded-full bg-ink transition-transform duration-[1300ms] ease-silk [transition-delay:calc(var(--i,0)*70ms)] [[data-reveal=bar]:not(.is-in)_&]:scale-x-0 motion-reduce:transition-none !bg-accent transition-[width] duration-500"
                    style={{ width: `${activePct}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  {activeDone > 0 && (
                    <button
                      type="button"
                      onClick={resetActive}
                      className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] font-mono text-label font-normal bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] text-ink-3 hover:text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]"
                    >
                      Clear {active.shortTitle} ticks
                    </button>
                  )}
                  {undoSet && (
                    <button
                      type="button"
                      onClick={undoReset}
                      className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] font-mono text-label font-normal bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] text-accent-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]"
                    >
                      Undo clear
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                <span className="text-xs text-ink-3">Interactive diagram & study guides</span>
                <a
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent font-semibold tracking-[-0.005em] text-on-accent transition-[translate,box-shadow,color] duration-[260ms] ease-spring before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:bg-ink before:transition-transform before:duration-[550ms] before:ease-silk before:content-[''] hover:shadow-accent hover:before:translate-y-0 focus-visible:shadow-accent focus-visible:before:translate-y-0 active:translate-y-px motion-reduce:active:translate-y-0 h-10 px-4 text-sm"
                >
                  <BrandLogo brand="roadmapsh" className="size-4" />
                  <span>Open on roadmap.sh</span>
                  <ExternalGlyph className="size-3.5" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="rounded-b-[calc(var(--radius-card)-1px)] border-t border-line text-balance flex flex-wrap items-end justify-between gap-4 bg-surface/60 px-5 py-4 sm:px-7">
            <div className="w-full max-w-md">
              <label htmlFor="roadmap-topic-filter" className="font-mono text-label font-normal block text-ink-3">
                {searchAll ? "Filter across all 8 roadmaps" : `Filter topics in ${active.title}`}
              </label>
              <input
                id="roadmap-topic-filter"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. BJ Fogg, Design Tokens, HEART, MCP, Grid…"
                autoComplete="off"
                className="w-full rounded-none border-0 border-b border-line-strong bg-transparent tracking-[-0.01em] text-ink transition-colors duration-[400ms] ease-silk placeholder:text-ink-3 focus:border-accent-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink py-2 text-base"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pb-1">
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-ink-2 transition-colors hover:text-ink">
                <input
                  type="checkbox"
                  checked={searchAll}
                  onChange={(e) => setSearchAll(e.target.checked)}
                  className="size-4 accent-[var(--accent)]"
                />
                <span>Search all {externalRoadmaps.length} roadmaps</span>
              </label>
              {needle && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] font-mono text-label font-normal bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cross-roadmap search results OR active roadmap milestone spine */}
        {needle && searchAll ? (
          <div className="mt-10 space-y-6">
            <p aria-live="polite" className="font-mono text-label font-normal text-ink-3">
              {crossMatches.reduce((n, e) => n + e.hits.length, 0)} matching topics across{" "}
              {crossMatches.length} {crossMatches.length === 1 ? "roadmap" : "roadmaps"}
            </p>
            {crossMatches.length === 0 ? (
              <div className="relative rounded-card border border-edge bg-card shadow-1 p-6">
                <p className="text-ink-2">No topic matches “{query.trim()}”.</p>
              </div>
            ) : (
              crossMatches.map(({ roadmap, hits }) => (
                <div key={roadmap.slug} className="relative rounded-card border border-edge bg-card shadow-1">
                  <div className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchAll(false);
                        selectRoadmap(roadmap.slug);
                      }}
                      className="hover:underline"
                    >
                      {roadmap.title} →
                    </button>
                    <span className="tabular-nums">{hits.length} matches</span>
                  </div>
                  <ul className="divide-y divide-line px-5 sm:px-6">
                    {hits.map((h) => {
                      const k = topicKey(roadmap.slug, h.milestoneId, h.item);
                      const checked = ticks.set.has(k);
                      return (
                        <li key={k} className="py-2.5">
                          <TopicCheckbox
                            checked={checked}
                            onToggle={() => ticks.toggle(k)}
                            label={h.item}
                            meta={h.milestoneTitle}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        ) : filteredMilestones.length === 0 ? (
          <div className="relative rounded-card border border-edge bg-card shadow-1 mt-10 p-6">
            <p className="text-ink-2">
              No topic in {active.title} matches “{query.trim()}”.
            </p>
            <div className="mt-4 flex flex-wrap gap-5">
              <button
                type="button"
                onClick={() => setSearchAll(true)}
                className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] font-mono text-label font-normal bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] text-accent-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]"
              >
                Search all {externalRoadmaps.length} roadmaps instead
              </button>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] font-mono text-label font-normal bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]"
              >
                Clear filter
              </button>
            </div>
          </div>
        ) : (
          <ol
            aria-label={`${active.title} sections`}
            className="relative mt-10 space-y-6 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-[2px] before:bg-edge sm:before:left-6"
          >
            {filteredMilestones.map((m, i) => {
              const stageItems = m.branches.flatMap((b) => b.items);
              const stageDone = stageItems.filter((item) =>
                ticks.set.has(topicKey(active.slug, m.id, item)),
              ).length;
              const stageComplete = stageItems.length > 0 && stageDone === stageItems.length;

              return (
                <li
                  key={m.id}
                  className="relative pl-12 sm:pl-16"
                  style={{ "--i": i } as CSSProperties}
                >
                  {/* Spine node badge */}
                  <span
                    aria-hidden
                    className={`font-mono text-label font-normal absolute left-0 top-5 grid size-10 place-items-center rounded-full border border-edge tabular-nums sm:size-12 ${
                      stageComplete
                        ? "bg-accent text-on-accent"
                        : "bg-card text-ink"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <article className="relative rounded-card border border-edge bg-card shadow-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
                      <div className="min-w-0">
                        <h3 className="font-display font-semibold tracking-[-0.02em] text-pretty text-[1.5rem] leading-[1.08] text-ink">
                          {m.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-2">{m.summary}</p>
                      </div>
                      <span
                        className={`font-mono text-label font-normal shrink-0 tabular-nums ${
                          stageComplete ? "text-accent-ink" : "text-ink-3"
                        }`}
                      >
                        {stageDone} / {stageItems.length}
                      </span>
                    </div>

                    <div
                      className={`grid gap-x-8 gap-y-6 px-5 py-5 sm:px-6 ${
                        m.branches.length > 1 ? "md:grid-cols-2" : ""
                      }`}
                    >
                      {m.branches.map((branch, bi) => (
                        <div key={branch.heading ?? bi}>
                          {branch.heading && (
                            <Eyebrow className="!mb-2.5">{branch.heading}</Eyebrow>
                          )}
                          <ul className="divide-y divide-line border-t border-line">
                            {branch.items.map((item) => {
                              const k = topicKey(active.slug, m.id, item);
                              return (
                                <li key={k} className="py-1.5">
                                  <TopicCheckbox
                                    checked={ticks.set.has(k)}
                                    onToggle={() => ticks.toggle(k)}
                                    label={item}
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Additional skill-specific roadmaps discovered on roadmap.sh */}
      <div className="mt-24 sm:mt-32">
        <SubHead
          n="R.2"
          title="More skill roadmaps on roadmap.sh"
          note="Focused single-skill guides from roadmap.sh that pair directly with the months and stages in your plan."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {companionRoadmaps.map((c, i) => (
            <li key={c.slug} data-reveal style={{ "--i": i } as CSSProperties}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-card border border-edge bg-card shadow-1 group/card transition-[translate,box-shadow,border-color,opacity] duration-[260ms] ease-spring hover:-translate-y-[3px] hover:border-line-strong hover:shadow-2 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink has-[>input:focus-visible]:outline-2 has-[>input:focus-visible]:outline-offset-4 has-[>input:focus-visible]:outline-accent-ink motion-reduce:hover:translate-y-0 group flex h-full flex-col p-5"
              >
                <span className="font-mono text-label font-normal text-ink-3">{c.category}</span>
                <span className="mt-2.5 flex items-center justify-between gap-2 font-display font-semibold tracking-[-0.02em] text-pretty text-[1.375rem] leading-tight text-ink">
                  <span className="inline-flex items-center gap-2">
                    <BrandLogosFor text={c.title} max={1} className="size-4 text-ink-2" />
                    <span>{c.title}</span>
                  </span>
                  <ExternalGlyph className="shrink-0 text-ink-3 transition-colors duration-300 group-hover:text-accent-ink" />
                </span>
                <span className="mt-2 flex-1 text-xs leading-relaxed text-ink-2">
                  {c.summary}
                </span>
                <span className="font-mono text-label font-normal mt-4 border-t border-line pt-3 text-accent-ink">
                  {c.planLink}
                </span>
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
