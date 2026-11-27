import { useEffect, useId, useState } from "react";
import { BrandLogosFor } from "./BrandLogo";
import { cardLink, Eyebrow, SubHead, Tag, TextLink, TopicCheckbox, pageHref, usePersistentSet, useTabList } from "./ui";
import {
  countRoadmapTopics,
  externalRoadmaps,
  type ExternalRoadmap,
  type RoadmapMilestone,
} from "../data/roadmaps";

const STORAGE_KEY = "de-guide:roadmap-topics";
const topicKey = (slug: string, milestoneId: string, item: string) => `${slug}:${milestoneId}:${item}`;

export interface BaseRoadmapItem {
  slug: string;
  role: "Base" | "Build layer" | "Systems & AI";
}

/**
 * Interactive roadmap.sh skill-base explorer embedded directly inside Track A and Track B plans.
 * Shares topic tick state (`de-guide:roadmap-topics`) with Library → Roadmaps.
 */
export function PlanRoadmapBase({
  id,
  n,
  title,
  note,
  items,
}: {
  id: string;
  n: string;
  title: string;
  note: string;
  items: BaseRoadmapItem[];
}) {
  const entries = items
    .map((item) => {
      const roadmap = externalRoadmaps.find((r) => r.slug === item.slug);
      return roadmap ? { ...item, roadmap } : null;
    })
    .filter((x): x is BaseRoadmapItem & { roadmap: ExternalRoadmap } => x !== null);

  const [activeSlug, setActiveSlug] = useState(entries[0]?.slug ?? "ux-design");
  const [query, setQuery] = useState("");
  const [openStages, setOpenStages] = useState<Set<string>>(() => new Set());
  const ticks = usePersistentSet(STORAGE_KEY);
  const filterId = useId();

  // Keep activeSlug valid if the reader switches Track A option (e.g. pde <-> meta).
  useEffect(() => {
    if (!entries.some((e) => e.slug === activeSlug) && entries[0]) {
      setActiveSlug(entries[0].slug);
      setOpenStages(new Set());
      setQuery("");
    }
  }, [activeSlug, entries]);

  const current = entries.find((e) => e.slug === activeSlug) ?? entries[0];
  if (!current) return null;

  const { roadmap } = current;
  const total = countRoadmapTopics(roadmap);
  const done = roadmap.milestones.reduce(
    (sum, m) =>
      sum +
      m.branches.reduce(
        (bSum, b) =>
          bSum + b.items.filter((item) => ticks.set.has(topicKey(roadmap.slug, m.id, item))).length,
        0,
      ),
    0,
  );
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const { listProps, tabProps, panelProps } = useTabList({
    ids: entries.map((e) => e.slug),
    value: roadmap.slug,
    onChange: (next) => {
      setActiveSlug(next);
      setOpenStages(new Set());
      setQuery("");
    },
    idPrefix: `plan-base-${id}`,
  });

  const needle = query.trim().toLowerCase();
  const filteredMilestones: RoadmapMilestone[] = roadmap.milestones
    .map((m) => {
      if (!needle) return m;
      const mMatch =
        m.title.toLowerCase().includes(needle) || m.summary.toLowerCase().includes(needle);
      if (mMatch) return m;
      const branches = m.branches
        .map((b) => {
          if (b.heading?.toLowerCase().includes(needle)) return b;
          return { ...b, items: b.items.filter((item) => item.toLowerCase().includes(needle)) };
        })
        .filter((b) => b.items.length > 0);
      return { ...m, branches };
    })
    .filter((m) => m.branches.length > 0);

  const allExpanded =
    filteredMilestones.length > 0 && filteredMilestones.every((m) => openStages.has(m.id));

  const toggleStage = (stageId: string) =>
    setOpenStages((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });

  const toggleAll = () => {
    if (allExpanded) setOpenStages(new Set());
    else setOpenStages(new Set(filteredMilestones.map((m) => m.id)));
  };

  return (
    <div id={id} className="scroll-mt-36 lg:scroll-mt-32">
      <SubHead n={n} title={title} note={note} />

      {/* Roadmap selector tabs */}
      <div
        {...listProps}
        aria-label="Base roadmaps for this plan"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {entries.map((entry, idx) => {
          const on = entry.slug === roadmap.slug;
          const rTotal = countRoadmapTopics(entry.roadmap);
          const rDone = entry.roadmap.milestones.reduce(
            (s, m) =>
              s +
              m.branches.reduce(
                (bs, b) =>
                  bs +
                  b.items.filter((item) => ticks.set.has(topicKey(entry.slug, m.id, item))).length,
                0,
              ),
            0,
          );
          return (
            <button
              key={entry.slug}
              {...tabProps(entry.slug, idx)}
              className={`${cardLink} group relative flex h-full min-h-[6.75rem] flex-col overflow-hidden p-4 text-left transition-colors duration-300 max-sm:last:col-span-2 ${
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
                <span
                  className={`font-mono text-label font-normal ${
                    entry.role === "Base"
                      ? "text-accent-ink"
                      : on
                        ? "text-ink"
                        : "text-ink-3"
                  }`}
                >
                  {entry.role}
                </span>
                <span className="font-mono text-label font-normal tabular-nums text-ink-3">
                  {rDone > 0 ? `${rDone}/${rTotal}` : `${rTotal}`}
                </span>
              </span>
              <span
                className={`mt-2 flex items-center gap-1.5 font-display font-semibold tracking-[-0.02em] text-pretty text-[1.25rem] leading-[1.1] transition-colors duration-300 ${
                  on ? "text-ink" : "text-ink-2 group-hover:text-ink"
                }`}
              >
                <BrandLogosFor text={entry.roadmap.shortTitle} max={1} className="size-3.5 text-accent-ink" />
                <span>{entry.roadmap.shortTitle}</span>
              </span>
              <span className="mt-1.5 block text-xs text-ink-2">
                {entry.roadmap.milestones.length} sections
              </span>
            </button>
          );
        })}
      </div>

      {/* Active base roadmap specimen panel */}
      <div
        {...panelProps(roadmap.slug)}
        key={roadmap.slug}
        className="relative rounded-card border border-edge bg-card shadow-1 animate-panel-in motion-reduce:animate-fade-in mt-5 focus-visible:outline-offset-8"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
          <span>
            {current.role} · roadmap.sh/{roadmap.slug}
          </span>
          <span className="tabular-nums">
            {done} / {total} topics ({pct}%)
          </span>
        </div>

        <div className="px-5 py-6 sm:px-7">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0 max-w-[60ch]">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-display text-display-m text-balance text-ink">{roadmap.title}</h3>
                <Tag tone={current.role === "Base" ? "accent" : "neutral"}>{current.role}</Tag>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{roadmap.tagline}</p>
            </div>

            {/* One link per roadmap: the Library page carries the roadmap.sh link, so it isn't repeated here. */}
            <p className="font-mono text-label font-normal">
              <TextLink href={pageHref("library", "roadmaps", roadmap.slug)}>See the full {roadmap.shortTitle} roadmap</TextLink>
            </p>
          </div>

          {/* Progress + filter + expand controls */}
          <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-12 sm:items-end">
            <div className="sm:col-span-5">
              <label htmlFor={filterId} className="font-mono text-label font-normal block text-ink-3">
                Filter {roadmap.shortTitle} topics
              </label>
              <input
                id={filterId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections or topics…"
                autoComplete="off"
                className="min-h-11 w-full rounded-none border-0 border-b border-line-strong bg-transparent py-3 text-xl tracking-[-0.01em] text-ink transition-colors duration-[400ms] ease-silk placeholder:text-ink-3 focus:border-accent-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink !py-1.5 !text-sm"
              />
            </div>

            <div className="sm:col-span-4">
              <div className="font-mono text-label font-normal flex items-baseline justify-between text-ink-3">
                <span>Progress</span>
                <span className="tabular-nums text-ink">
                  {done} / {total}
                </span>
              </div>
              <div
                className="relative overflow-hidden rounded-full bg-line mt-2 h-2"
                role="progressbar"
                aria-label={`${roadmap.title} base topics covered`}
                aria-valuenow={done}
                aria-valuemin={0}
                aria-valuemax={total}
              >
                <div
                  className="absolute inset-y-0 left-0 origin-left rounded-full bg-ink transition-transform duration-[1300ms] ease-silk [transition-delay:calc(var(--i,0)*70ms)] [[data-reveal=bar]:not(.is-in)_&]:scale-x-0 motion-reduce:transition-none !bg-accent transition-[width] duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 sm:col-span-3 sm:justify-end">
              {needle ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="hit font-mono text-label font-normal bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]"
                >
                  Clear filter
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleAll}
                  className="hit font-mono text-label font-normal bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] text-ink-3 hover:text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]"
                >
                  {allExpanded ? "Collapse all" : "Expand all"}
                </button>
              )}
            </div>
          </div>

          {/* Stage accordions */}
          {filteredMilestones.length === 0 ? (
            <p className="mt-6 text-sm text-ink-2">
              No topic in {roadmap.title} matches “{query.trim()}”.
            </p>
          ) : (
            <ol className="mt-6 grid gap-3 md:grid-cols-2">
              {filteredMilestones.map((m, i) => {
                const isOpen = Boolean(needle) || openStages.has(m.id);
                const stageItems = m.branches.flatMap((b) => b.items);
                const stageDone = stageItems.filter((item) =>
                  ticks.set.has(topicKey(roadmap.slug, m.id, item)),
                ).length;
                const stageComplete = stageItems.length > 0 && stageDone === stageItems.length;
                const panelId = `base-${id}-${roadmap.slug}-${m.id}`;

                return (
                  <li
                    key={m.id}
                    className={`border border-line bg-surface/60 transition-colors duration-300 ${
                      isOpen ? "md:col-span-2 border-line-strong bg-card" : ""
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleStage(m.id)}
                      className="group flex w-full items-start gap-3 px-4 py-3.5 text-left"
                    >
                      <span
                        className={`font-mono text-label font-normal mt-0.5 grid size-6 shrink-0 place-items-center border tabular-nums ${
                          stageComplete
                            ? "border-accent bg-accent text-on-accent"
                            : "border-line-strong text-ink-3 group-hover:border-ink group-hover:text-ink"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display font-semibold tracking-[-0.02em] text-pretty text-[1.125rem] leading-snug text-ink">
                          {m.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ink-2">
                          {m.summary}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3 pt-1">
                        <span
                          className={`font-mono text-label font-normal tabular-nums ${
                            stageComplete ? "text-accent-ink" : "text-ink-3"
                          }`}
                        >
                          {stageDone}/{stageItems.length}
                        </span>
                        <span
                          aria-hidden
                          className="relative block size-3 text-ink-3 transition-colors group-hover:text-accent-ink"
                        >
                          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                          <span
                            className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
                              isOpen ? "scale-y-0" : ""
                            }`}
                          />
                        </span>
                      </span>
                    </button>

                    <div id={panelId} hidden={!isOpen} className="border-t border-line px-4 py-4">
                      {isOpen && (
                        <div
                          className={`animate-panel-in motion-reduce:animate-fade-in grid gap-x-8 gap-y-5 ${
                            m.branches.length > 1 ? "sm:grid-cols-2" : ""
                          }`}
                        >
                          {m.branches.map((branch, bi) => (
                            <div key={branch.heading ?? bi}>
                              {branch.heading && (
                                <Eyebrow className="!mb-2">{branch.heading}</Eyebrow>
                              )}
                              <ul className="divide-y divide-line border-t border-line">
                                {branch.items.map((item) => {
                                  const key = topicKey(roadmap.slug, m.id, item);
                                  return (
                                    <li key={key}>
                                      <TopicCheckbox checked={ticks.set.has(key)} onToggle={() => ticks.toggle(key)} label={item} />
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
