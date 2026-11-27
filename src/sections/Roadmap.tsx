import { type CSSProperties } from "react";
import { ArrowBackGlyph, ArrowGlyph, DownloadGlyph, Glyph, type GlyphName } from "../components/icons";
import { BrandLogosFor } from "../components/BrandLogo";
import { PlanRoadmapBase, type BaseRoadmapItem } from "../components/PlanRoadmapBase";
import { RoadmapMap } from "../components/RoadmapMap";
import {
  aiPolicyLabel,
  applicationsPerPost,
  beginnerContext,
  beginnerStack,
  icGrowth,
  interviewFocus,
  launchStages,
  leverageHabits,
  planFor,
  planPace,
  sixMonthPlan,
  skipAheadMonth,
  codeSkipLabels,
  forLeads,
  toolPricingNote,
  trackAOptions,
  trackBCostNote,
  type PlanTopicGroup,
  type Resource,
} from "../data/research";
import { PLAN_PDFS, type PlanPdfId } from "../data/planPdfs";
import {
  cardLink,
  BasisBadge,
  CheckRow,
  ContextBar,
  CopyLink,
  Eyebrow,
  jumpTo,
  Meter,
  navigate,
  pageHref,
  planHref,
  Section,
  SectionHeader,
  SubHead,
  Tag,
  TextLink,
  TopicCheckbox,
  usePersistentSet,
  useSaveNote,
  useTabList,
  type PlanRoute,
  type Track,
  type TrackAOption,
} from "../components/ui";

type PlanA = Extract<PlanRoute, { track: "a" }>;

/** Change what the plan shows. A change of view, so it replaces the history entry. */
const go = (p: PlanRoute) => navigate(planHref(p), { replace: true });

/** The six months fall into three two-month phases; notes are the months' own AI policies. */
const phases = [
  { name: "Foundations", months: [1, 2] },
  { name: "Acceleration", months: [3, 4] },
  { name: "Production", months: [5, 6] },
].map((p) => ({ ...p, note: p.months.map((m) => aiPolicyLabel[sixMonthPlan[m - 1].aiPolicy]).join(" → ") }));

const MONTHS = sixMonthPlan.length;
const STAGES = launchStages.length;

/** Visible third cue for a selected card, beside fill and offset. State itself is announced by the control. */
function SelectedMark({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span aria-hidden className={`font-mono text-label font-normal shrink-0 ${className}`}>
      ✓ {children}
    </span>
  );
}

export function Roadmap({ plan }: { plan: PlanRoute | null }) {
  const track = plan?.track ?? null;
  const saveNote = useSaveNote();
  const setTrack = (t: Track) => {
    if (t === track) return;
    if (t === "a") navigate(pageHref("plan", "a"), { replace: true });
    else go({ track: "b", stage: 1 });
  };
  const tracks = [
    { id: "a" as const, glyph: "stairs" as const, kicker: "Track A", title: "I'm a working designer", sub: "Upskill in your current job, or grow into a hybrid role" },
    { id: "b" as const, glyph: "launch" as const, kicker: "Track B", title: "I'm starting out", sub: "Get your first role, with code in your portfolio" },
  ];
  const { listProps, tabProps, panelProps } = useTabList({
    ids: tracks.map((t) => t.id),
    value: track ?? "",
    onChange: (id) => setTrack(id as Track),
    idPrefix: "track",
  });

  const trail =
    plan === null
      ? []
      : plan.track === "a"
        ? [
            { label: "Plan" },
            { label: "Track A · Working designer" },
            { label: trackAOptions.find((o) => o.id === plan.option)?.name ?? "" },
            { label: `Month ${plan.month} of ${MONTHS}` },
          ]
        : [{ label: "Plan" }, { label: "Track B · Starting out" }, { label: `Stage ${plan.stage} of ${STAGES}` }];
  const jumps =
    track === "a"
      ? [
          { id: "plan-map", label: "Map" },
          { id: "month-detail", label: "This month" },
          { id: "plan-habits", label: "Habits" },
          { id: "plan-portfolio", label: "Show work" },
          { id: "plan-base", label: "Skill base" },
        ]
      : [
          { id: "plan-map", label: "Map" },
          { id: "stage-detail", label: "This stage" },
          { id: "plan-market", label: "Market" },
          { id: "plan-stack", label: "Stack" },
          { id: "plan-portfolio", label: "Portfolio" },
          { id: "plan-first-year", label: "First year" },
          { id: "plan-base", label: "Skill base" },
        ];

  return (
    <Section id="roadmap">
      <SectionHeader
        id="roadmap"
        level="h1"
        title={["Your plan,", <em>step by step.</em>]}
        lede={`Already work as a designer? Choose Track A, then a role. Starting out? Choose Track B. The plan changes to match. ${planPace} ${saveNote}`}
      />

      <div {...listProps} aria-label="Career track" className="grid gap-6 sm:grid-cols-2">
        {tracks.map((t, i) => {
          const on = track === t.id;
          return (
            <button
              key={t.id}
              {...tabProps(t.id, i)}
              // With nothing picked, keep the first card reachable by Tab.
              tabIndex={on || (track === null && i === 0) ? 0 : -1}
              className={`${cardLink} group relative isolate flex min-h-[15rem] flex-col overflow-hidden p-5 text-left transition-colors duration-700 ease-silk sm:min-h-[19rem] sm:p-8 ${
                on ? "is-on translate-y-0! border-accent! shadow-accent! text-on-inverse" : "text-ink"
              }`}
            >
              <span
                aria-hidden
                className={`absolute inset-0 -z-10 origin-bottom bg-inverse transition-transform duration-[900ms] ease-silk ${on ? "scale-y-100" : "scale-y-0"}`}
              />
              <span className="flex items-start justify-between gap-4">
                <span className={`font-mono text-label font-normal inline-flex items-center gap-1.5 ${on ? "text-inverse-muted" : "text-ink-3"}`}>
                  <Glyph name="user" className={`!size-3.5 ${on ? "[--accent:currentColor]" : ""}`} />
                  <span>{t.kicker}</span>
                </span>
                {on && <SelectedMark className="text-inverse-accent">Your track</SelectedMark>}
              </span>
              <span className="mt-auto flex items-end justify-between gap-4">
                <span className="font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums text-[clamp(4rem,8vw,7rem)]">{t.id.toUpperCase()}</span>
                <Glyph name={t.glyph} on={on} className="glyph-xl !size-20 sm:!size-28" />
              </span>
              <span className="mt-4 block font-display font-semibold tracking-[-0.02em] text-pretty text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.05]">{t.title}</span>
              <span className={`mt-2 block text-sm ${on ? "text-inverse-muted" : "text-ink-3"}`}>{t.sub}</span>
            </button>
          );
        })}
      </div>

      {track === null && (
        <>
          <p className="mt-6 text-[1.0625rem] font-medium tracking-tight text-ink">Pick where you are today to see your plan.</p>
          {/* A taste of each plan before a track is picked: its very first task. */}
          <ul aria-label="The first step in each plan" className="mt-4 grid gap-6 sm:grid-cols-2">
            {[
              { kicker: "Track A · First step", text: sixMonthPlan[0].start },
              { kicker: "Track B · First step this week", text: launchStages[0].start },
            ].map((x) => (
              <li key={x.kicker} className="border-l border-accent pl-4">
                <span className="font-mono text-label font-normal block text-ink-3">{x.kicker}</span>
                <span className="mt-1.5 block leading-relaxed text-ink-2">{x.text}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-line pt-5 text-sm text-ink-2">
        <p>
          New to a term like PR, tokens or MCP? <TextLink href={pageHref("library", "glossary")}>See the glossary</TextLink>
        </p>
      </div>

      {plan && (
        <>
          {/* Spacer, not a wrapper: the bar must sit directly in the section so it sticks through the whole plan. */}
          <div aria-hidden className="h-16 sm:h-24" />
          <ContextBar trail={trail} jumps={jumps} />
          <div {...panelProps(plan.track)} key={plan.track} className="animate-panel-in motion-reduce:animate-fade-in mt-16 focus-visible:outline-offset-8 sm:mt-24">
            {plan.track === "a" ? <TrackA plan={plan} /> : <TrackB stage={plan.stage} />}
          </div>
        </>
      )}

      <PlanDownloads current={plan ? (plan.track === "a" ? `a-${plan.option}` : "b") : null} />
    </Section>
  );
}

/** A printable PDF of each plan, for reading offline or sharing. Files come from `npm run pdfs`. */
function PlanDownloads({ current }: { current: PlanPdfId | null }) {
  return (
    <div className="mt-24 sm:mt-36">
      <SubHead n="PDF" title="Take a plan with you" note={`A printable copy of each plan, with every month or stage, its topics and resources. Your ticks stay here in the browser. ${forLeads.sharePdf}`} />
      <ul className="grid gap-4 sm:grid-cols-3">
        {PLAN_PDFS.map((p) => {
          const on = current === p.id;
          return (
            <li key={p.id} className="flex">
              <a
                href={`${import.meta.env.BASE_URL}${p.file}`}
                download
                type="application/pdf"
                className={`${cardLink} group flex w-full items-start gap-4 p-5 ${on ? "is-on border-accent! shadow-accent!" : ""}`}
              >
                <DownloadGlyph className={`!size-8 shrink-0 ${on ? "text-accent-ink" : "text-ink"}`} />
                <span className="min-w-0 flex-1">
                  <span className={`font-mono text-label font-normal block ${on ? "text-accent-ink" : "text-ink-3"}`}>
                    {on ? "Your plan · PDF for print or desktop" : "PDF · A4 · for print or desktop"}
                  </span>
                  <span className="mt-1.5 block text-[1.0625rem] font-medium tracking-tight text-pretty text-ink">
                    <span className="sr-only">Download </span>
                    {p.label}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const trackABaseRoadmaps: Record<TrackAOption, BaseRoadmapItem[]> = {
  pde: [
    { slug: "ux-design", role: "Base" },
    { slug: "product-design", role: "Base" },
    { slug: "design-system", role: "Build layer" },
    { slug: "frontend", role: "Build layer" },
    { slug: "claude-code", role: "Systems & AI" },
  ],
  meta: [
    { slug: "ux-design", role: "Base" },
    { slug: "product-design", role: "Base" },
    { slug: "design-system", role: "Systems & AI" },
    { slug: "prompt-engineering", role: "Systems & AI" },
    { slug: "ai-agents", role: "Systems & AI" },
  ],
};

const trackBBaseRoadmaps: BaseRoadmapItem[] = [
  { slug: "ux-design", role: "Base" },
  { slug: "product-design", role: "Base" },
  { slug: "frontend", role: "Build layer" },
  { slug: "ai-product-builder", role: "Build layer" },
  { slug: "design-system", role: "Build layer" },
];

/* ───────────── Track A ───────────── */

function TrackA({ plan: route }: { plan: PlanA }) {
  const { option: choice, month } = route;
  const habits = usePersistentSet("de-guide:habits");
  const plan = planFor(choice);
  const m = plan[month - 1];
  const habitsDone = leverageHabits.filter((h) => habits.set.has(h.id)).length;
  const setMonth = (n: number) => go({ ...route, month: n });
  const months = useTabList({
    ids: plan.map((x) => String(x.month)),
    value: String(month),
    onChange: (id) => setMonth(Number(id)),
    idPrefix: "month",
  });

  return (
    <div className="space-y-24 sm:space-y-36">
      {/* Track chooser */}
      <div>
        <SubHead n="A.1" title="Choose your role" note="These match the roles on the Roles page. Meta-Designers and AX Designers share one plan." />
        <fieldset className="min-w-0">
          <legend className="sr-only">Role</legend>
          <div className="grid gap-6 md:grid-cols-2">
            {trackAOptions.map((o) => {
              const on = choice === o.id;
              return (
                <label
                  key={o.id}
                  className={`${cardLink} group relative cursor-pointer p-6 sm:p-8 ${on ? "is-on translate-y-0! border-accent! shadow-accent!" : ""}`}
                >
                  <input type="radio" name="trackA" value={o.id} checked={on} onChange={() => go({ ...route, option: o.id as TrackAOption })} className="sr-only" />
                  <span className="flex items-start gap-4">
                    <span aria-hidden className={`mt-2 grid size-4 shrink-0 place-items-center border transition-colors duration-500 ${on ? "border-accent" : "border-line-strong group-hover:border-ink"}`}>
                      <span className={`size-2 bg-accent transition-transform duration-500 ease-silk ${on ? "scale-100" : "scale-0"}`} />
                    </span>
                    <span className={`font-display text-display-m text-balance min-w-0 flex-1 inline-flex items-start gap-2.5 transition-colors duration-500 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>
                      <Glyph name="user" className="mt-0.5 !size-6 shrink-0" />
                      <span>{o.name}</span>
                    </span>
                    {on && <SelectedMark className="mt-2 text-accent-ink">Selected</SelectedMark>}
                  </span>
                  <span className="mt-4 block pl-8 text-sm leading-relaxed text-ink-2">Best for: {o.for}</span>
                  <span className="mt-5 flex flex-wrap gap-1.5 pl-8">
                    {o.stack.map((s) => (
                      <Tag key={s} tone={on ? "accent" : "neutral"}>
                        {s}
                      </Tag>
                    ))}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-2" aria-live="polite">
          {choice === "pde"
            ? "Six months, from browser basics to merged pull requests in a real product."
            : "Months 1–3 match the Design Engineer plan: enough front-end to review AI code. Months 4–6 turn to design systems AI tools can read, and to trust flows for AI agents."}
        </p>
      </div>

      {/* Map of the whole plan, starting from the shared UX & Product Design base */}
      <div id="plan-map">
        <SubHead n="A.map" title="Your plan at a glance" note="Your UX & Product Design base comes first, then six months, one step at a time. Pick the base or any month to open its details." />
        <RoadmapMap
          label="Six-month plan"
          leftLabel="Learn"
          rightLabel="Result"
          active={String(month)}
          hrefFor={(id) => (id === "base" ? pageHref("library", "roadmaps", "ux-design") : planHref({ ...route, month: Number(id) }))}
          onPick={(id) => {
            if (id === "base") {
              jumpTo("plan-base");
              return;
            }
            setMonth(Number(id));
            jumpTo("month-detail");
          }}
          steps={[
            {
              id: "base",
              kicker: "Base · Foundation",
              title: "UX & Product Design",
              note: "Open base checklists ↓",
              base: "UX Design · Product Design",
              foundation: true,
              left: [
                "Decision making & UX patterns",
                "Research, personas & JTBD",
                "IA, user flows & wireframing",
                "Visual craft, layout & WCAG",
                "Usability & A/B impact testing",
              ],
              right: "The design base for code and AI work",
            },
            ...plan.map((x) => ({
              id: String(x.month),
              kicker: `Month ${x.month}`,
              title: x.title,
              note: aiPolicyLabel[x.aiPolicy],
              base: x.roadmapTopics.map((g) => g.source).join(" · "),
              left: x.learn,
              right: x.build,
            })),
          ]}
        />
      </div>

      {/* 6-month timeline */}
      <div id="month-detail" className="scroll-mt-36 lg:scroll-mt-32">
        <SubHead n="A.2" title="Month by month" note="The same six months in detail. The bar on each month shows how much AI you use: none in month one, more each month after. Apply each month in your current job or in side projects — the plan uses React, TypeScript and Tailwind." />

        <ol aria-label="Phases" className="mb-3 grid grid-cols-6 gap-x-2">
          {phases.map((p) => {
            const on = p.months.includes(month);
            return (
              <li key={p.name} className="col-span-2">
                <span aria-hidden className={`block h-2 border-x border-t transition-colors duration-500 ${on ? "border-accent" : "border-line-strong"}`} />
                <p className={`font-mono text-label font-normal mt-2 transition-colors duration-500 ${on ? "text-accent-ink" : "text-ink-3"}`}>
                  {p.name} <span className="sr-only">: months {p.months.join(" and ")}</span>
                </p>
                <p className={`mt-1 text-xs leading-snug transition-colors duration-500 ${on ? "text-ink" : "text-ink-3"}`}>{p.note}</p>
              </li>
            );
          })}
        </ol>
        <div {...months.listProps} aria-label="Month" className="mt-4 grid grid-cols-6 gap-1.5 sm:gap-3">
          {plan.map((x, i) => {
            const on = month === x.month;
            return (
              <button
                key={x.month}
                {...months.tabProps(String(x.month), i)}
                className={`${cardLink} group relative overflow-hidden px-2 pb-4 pt-4 text-left sm:px-4 ${on ? "is-on translate-y-0! border-accent! shadow-accent!" : ""}`}
              >
                <span aria-hidden className={`absolute left-0 right-0 top-0 h-[4px] origin-left bg-accent transition-transform duration-700 ease-silk ${on ? "scale-x-100" : "scale-x-0"}`} />
                <span className={`font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums block text-[clamp(2rem,4.5vw,4rem)] transition-colors duration-500 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>
                  {String(x.month).padStart(2, "0")}
                </span>
                <span className={`font-mono text-label font-normal mt-2 hidden sm:block ${on ? "text-accent-ink" : "text-ink-3"}`}>{aiPolicyLabel[x.aiPolicy]}</span>
                <span aria-hidden className="mt-3 flex gap-0.5 sm:gap-1">
                  {plan.slice(1).map((_, k) => (
                    <span key={k} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${k < i ? (on ? "bg-accent" : "bg-ink-3") : "bg-line"}`} />
                  ))}
                </span>
                <span className="sr-only">
                  Month {x.month}
                  {x.month === 1 ? `, ${codeSkipLabels.startHere.toLowerCase()}` : ""}
                  {x.month < skipAheadMonth ? `, ${codeSkipLabels.optional.toLowerCase()}` : ""}
                </span>
              </button>
            );
          })}
        </div>

        {month < skipAheadMonth && (
          <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l border-accent pl-4 text-sm leading-relaxed text-ink-2">
            <span>
              <span className="font-medium text-ink">Already code?</span> Months 1–{skipAheadMonth - 1} cover browser basics and JavaScript & React, so you can skip them.
            </span>
            <TextLink
              href={planHref({ ...route, month: skipAheadMonth })}
              onClick={(e) => {
                e.preventDefault();
                setMonth(skipAheadMonth);
                // This link unmounts once the month changes, so hand focus to the new month's tab.
                requestAnimationFrame(() => document.getElementById(`month-tab-${skipAheadMonth}`)?.focus());
              }}
              className="font-medium"
            >
              Start at Month {skipAheadMonth}
            </TextLink>
          </p>
        )}

        <div
          {...months.panelProps(String(month))}
          key={month}
          className="relative rounded-card border border-edge bg-card shadow-1 mt-6"
        >
          <p className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
            <span>
              Month {String(m.month).padStart(2, "0")}
              {m.month === 1 && ` · ${codeSkipLabels.startHere}`}
              {m.month < skipAheadMonth && ` · ${codeSkipLabels.optional}`}
            </span>
            <span>{aiPolicyLabel[m.aiPolicy]}</span>
          </p>
          <CopyLink hash={planHref({ ...route, month: m.month })} label={`Copy link to Month ${m.month}`} className="flex-wrap px-5 pt-5 text-ink-3 sm:px-7" />
          {m.fromCode && <p className="mx-5 mt-5 max-w-[70ch] border-l border-accent pl-4 text-sm leading-relaxed text-ink-2 sm:mx-7">{m.fromCode}</p>}
          <div className="[&>*]:animate-panel-in [&>*]:[animation-delay:calc(var(--i,0)*60ms)] motion-reduce:[&>*]:animate-fade-in grid gap-y-10 px-5 py-8 sm:px-7 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-4" style={{ "--i": 0 } as CSSProperties}>
            <Eyebrow>Learning focus</Eyebrow>
            <p className="font-display font-semibold tracking-[-0.02em] text-pretty text-[1.625rem] leading-[1.15] text-ink">{m.focus}</p>
          </div>
          <div className="md:col-span-4" style={{ "--i": 1 } as CSSProperties}>
            <Eyebrow>Practical deliverable</Eyebrow>
            <p className="leading-relaxed text-ink-2">{m.deliverable}</p>
          </div>
          <div className="border-l border-accent pl-4 md:col-span-4" style={{ "--i": 2 } as CSSProperties}>
            <Eyebrow className="!text-accent-ink">Guardrail · {aiPolicyLabel[m.aiPolicy]}</Eyebrow>
            <p className="leading-relaxed text-ink">{m.guardrail}</p>
          </div>
          <StartAndDone stepKey={`a-${choice}-m${m.month}`} start={m.start} doneWhen={m.doneWhen} topics={m.roadmapTopics} resources={m.resources} />
          </div>
        </div>
        <StepNav
          n={month}
          total={MONTHS}
          unit="month"
          onStep={setMonth}
        />
      </div>

      {/* Leverage + proof of work */}
      <div className="grid gap-y-24 lg:grid-cols-12 lg:gap-x-6">
        <div id="plan-habits" className="lg:col-span-5">
          <SubHead n="A.3" title="Using it in your current job" note="Most designers build hybrid scope right where they already work, before any title changes." />
          <Meter value={habitsDone} max={leverageHabits.length} label="Habits in place" />
          <ul className="relative rounded-card border border-edge bg-card shadow-1 mt-6 px-5 sm:px-6 [&>li:last-child]:border-b-0">
            {leverageHabits.map((h, i) => (
              <CheckRow key={h.id} index={i + 1} checked={habits.set.has(h.id)} onToggle={() => habits.toggle(h.id)} title={h.title} detail={h.detail} />
            ))}
          </ul>
        </div>
        <div id="plan-portfolio" className="lg:col-span-6 lg:col-start-7">
          <SubHead n="A.4" title="Show your work — at work or on the market" />
          <ChecklistLink href={pageHref("ready", "a")} title="Your checklist" detail="Live demo, clean repo, short write-up, merged PR and proof you build with AI. Useful for team demos, promotion cases or job applications." />
          <div className="mt-10 rounded-card border border-accent/40 bg-inverse p-6 text-on-inverse shadow-accent sm:p-8">
            <p className="font-mono text-label font-normal mb-4 text-inverse-accent">If you do interview</p>
            <p className="font-display font-semibold tracking-[-0.02em] text-pretty text-[1.625rem] leading-[1.15]">{interviewFocus.hybrid}</p>
            <p className="mt-4 text-sm leading-relaxed text-inverse-muted">Alongside the usual: {interviewFocus.traditional}</p>
          </div>
        </div>
      </div>

      {/* Full interactive roadmap base checklists */}
      <PlanRoadmapBase
        id="plan-base"
        n="A.base"
        title="Every topic behind this plan"
        note={
          choice === "pde"
            ? "UX Design and Product Design are your foundation. Open any stage to audit what you know and tick off Design Systems, Frontend and Claude Code topics."
            : "UX Design and Product Design are your foundation. Open any stage to audit what you know and tick off Design Systems, Prompt & Context and AI Agents topics."
        }
        items={trackABaseRoadmaps[choice]}
      />
    </div>
  );
}

/** Previous / Next under a step's detail. At the last step, Next moves on to "Show your work", where the checklist card is
 *  (a jump, not a second link to the checklist). */
function StepNav({ n, total, unit, onStep }: { n: number; total: number; unit: "month" | "stage"; onStep: (n: number) => void }) {
  return (
    <div className="mt-5 flex items-center justify-between gap-4">
      <StepButton disabled={n === 1} reason={`You're on the first ${unit}`} onClick={() => onStep(Math.max(1, n - 1))} dir="back">
        Previous
      </StepButton>
      <span className="font-mono text-label font-normal tabular-nums text-ink-3">
        {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      {n < total ? (
        <StepButton disabled={false} onClick={() => onStep(n + 1)} dir="next">
          Next
        </StepButton>
      ) : (
        <StepButton disabled={false} onClick={() => jumpTo("plan-portfolio")} dir="next">
          Show your work
        </StepButton>
      )}
    </div>
  );
}


function ChecklistLink({ href, title, detail }: { href: string; title: string; detail: string }) {
  return (
    <a href={href} className={`relative ${cardLink} group mt-6 flex items-start gap-5 p-5 sm:p-6`}>
      <Glyph name="check" className="!size-12 shrink-0 text-ink" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3 text-[1.0625rem] font-medium tracking-tight text-ink">
          {title}
          <ArrowGlyph />
        </span>
        <span className="mt-1.5 block text-sm leading-relaxed text-ink-2">{detail}</span>
      </span>
    </a>
  );
}

/** The first task for a step, the sign you can move on, paired roadmap.sh topics, and where to learn it. Spans a 12-column row. */
function StartAndDone({
  stepKey,
  start,
  doneWhen,
  topics,
  resources,
}: {
  stepKey: string;
  start: string;
  doneWhen: string;
  topics: PlanTopicGroup[];
  resources: Resource[];
}) {
  const planTicks = usePersistentSet("de-guide:plan-topics");
  const totalTopics = topics.reduce((sum, g) => sum + g.topics.length, 0);
  const doneTopics = topics.reduce(
    (sum, g) => sum + g.topics.filter((t) => planTicks.set.has(`${stepKey}:${g.slug}:${t}`)).length,
    0,
  );

  return (
    <>
      <div className="border-t border-line pt-5 md:col-span-6">
        <Eyebrow>Start with</Eyebrow>
        <p className="leading-relaxed text-ink">{start}</p>
      </div>
      <div className="border-t border-line pt-5 md:col-span-6">
        <Eyebrow>Move on when</Eyebrow>
        <p className="leading-relaxed text-ink-2">{doneWhen}</p>
      </div>
      {topics.length > 0 && (
        <div className="border-t border-line pt-5 md:col-span-12">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <Eyebrow className="!mb-0">Key topics to cover · from roadmap.sh</Eyebrow>
            <span className="font-mono text-label font-normal tabular-nums text-ink-3">
              {doneTopics} / {totalTopics} ticked
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {topics.map((g) => (
              <div key={`${g.slug}-${g.area}`} className="border border-line bg-surface/60 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                  <div>
                    <span className="font-mono text-label font-normal block text-accent-ink">{g.source} roadmap</span>
                    <span className="mt-0.5 block text-sm font-medium text-ink">{g.area}</span>
                  </div>
                </div>
                <ul className="mt-2 divide-y divide-line">
                  {g.topics.map((t) => {
                    const key = `${stepKey}:${g.slug}:${t}`;
                    return (
                      <li key={key}>
                        <TopicCheckbox checked={planTicks.set.has(key)} onToggle={() => planTicks.toggle(key)} label={t} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-2">
            Every topic, section by section: <TextLink href={pageHref("library", "roadmaps")}>see the full roadmap.sh checklists</TextLink>
          </p>
        </div>
      )}
      {resources.length > 0 && (
        <div className="border-t border-line pt-5 md:col-span-12">
          <Eyebrow>Learn from</Eyebrow>
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {resources.map((r) => (
              <li key={r.url} className="flex items-center justify-between gap-3 border-b border-line">
                <span className="inline-flex min-h-11 min-w-0 flex-1 items-center gap-2 py-2.5">
                  <BrandLogosFor text={`${r.label} ${r.url}`} max={1} className="size-4 shrink-0 text-ink-2" />
                  <TextLink href={r.url}>{r.label}</TextLink>
                </span>
                <span className={`font-mono text-label font-normal shrink-0 ${r.cost === "free" ? "text-ink-3" : "text-accent-ink"}`}>{r.cost === "free" ? "Free" : "Paid"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function StepButton({
  disabled,
  reason,
  onClick,
  children,
  dir,
}: {
  disabled: boolean;
  /** Shown as a tooltip while disabled, so the reader knows why. */
  reason?: string;
  onClick: () => void;
  children: string;
  dir: "back" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? reason : undefined}
      className="hit group font-mono text-label font-normal flex items-center gap-1.5 text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
    >
      {dir === "back" && <ArrowBackGlyph />}
      <span className="bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]">{children}</span>
      {dir === "next" && <ArrowGlyph />}
    </button>
  );
}

/* ───────────── Track B ───────────── */

function TrackB({ stage }: { stage: number }) {
  const s = launchStages[stage - 1];
  const setStage = (n: number) => go({ track: "b", stage: n });
  const stages = useTabList({
    ids: launchStages.map((x) => String(x.n)),
    value: String(stage),
    onChange: (id) => setStage(Number(id)),
    idPrefix: "launch",
  });

  return (
    <div className="space-y-24 sm:space-y-36">
      {/* The very first thing to do, before the map and the detail */}
      <div className="rounded-card border border-accent/40 bg-inverse p-6 text-on-inverse shadow-accent sm:p-8">
        <p className="font-mono text-label font-normal mb-4 text-inverse-accent">Your first step this week</p>
        <p className="max-w-[44ch] font-display font-semibold tracking-[-0.02em] text-pretty text-[1.625rem] leading-[1.15]">{launchStages[0].start}</p>
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-inverse-muted">
          {trackBCostNote}
        </p>
        {stage !== 1 && (
          <button
            type="button"
            onClick={() => {
              setStage(1);
              jumpTo("stage-detail");
            }}
            className="hit group mt-5 inline-flex items-center gap-1.5 font-mono text-label font-normal text-on-inverse"
          >
            <span className="bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]">
              Open Stage 1
            </span>
            <ArrowGlyph />
          </button>
        )}
      </div>

      {/* Map of the whole plan, starting from the shared UX & Product Design base */}
      <div id="plan-map">
        <SubHead n="B.map" title="Your plan at a glance" note="Stage 1 is the UX & Product Design base that all three roles share. Then move through the other three stages in order. Pick any stage to open its details." />
        <RoadmapMap
          label="Four-stage launch plan"
          leftLabel="Learn"
          rightLabel="Result"
          active={String(stage)}
          hrefFor={(id) => planHref({ track: "b", stage: Number(id) })}
          onPick={(id) => {
            setStage(Number(id));
            jumpTo("stage-detail");
          }}
          steps={[
            ...launchStages.map((x) => ({
              id: String(x.n),
              kicker: x.n === 1 ? "Stage 1 · Your base" : `Stage ${x.n}`,
              title: x.name,
              base: x.roadmapTopics.map((g) => g.source).join(" · "),
              left: x.learn,
              right: x.output,
            })),
          ]}
        />
      </div>

      {/* 4-stage plan */}
      <div id="stage-detail" className="scroll-mt-36 lg:scroll-mt-32">
        <SubHead n="B.1" title="A four-stage launch plan" />
        <div {...stages.listProps} aria-label="Launch stage" className="grid gap-4 md:grid-cols-4">
          {launchStages.map((x, i) => {
            const on = stage === x.n;
            return (
              <button
                key={x.n}
                {...stages.tabProps(String(x.n), i)}
                className={`${cardLink} group relative flex h-full w-full flex-col overflow-hidden p-5 text-left ${on ? "is-on translate-y-0! border-accent! shadow-accent!" : ""}`}
              >
                  <span aria-hidden className={`absolute left-0 right-0 top-0 h-[4px] origin-left bg-accent transition-transform duration-700 ease-silk ${on ? "scale-x-100" : "scale-x-0"}`} />
                  <span className="flex items-start justify-between gap-3">
                    <span className={`font-mono text-label font-normal ${on ? "text-accent-ink" : "text-ink-3"}`}>Stage 0{x.n}</span>
                    {on && <SelectedMark className="text-accent-ink">Selected</SelectedMark>}
                  </span>
                  <span className={`mt-3 font-display font-semibold tracking-[-0.02em] text-pretty text-2xl leading-tight transition-colors duration-500 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>{x.name}</span>
                  <span className="mt-4 text-xs text-ink-2">{x.output}</span>
              </button>
            );
          })}
        </div>
        <div {...stages.panelProps(String(stage))} key={stage} className="relative rounded-card border border-edge bg-card shadow-1 animate-panel-in motion-reduce:animate-fade-in grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 mt-6 px-5 py-8 sm:px-7">
          <div className="col-span-4 flex flex-col items-start gap-3 lg:col-span-3">
            <p className="font-mono text-label font-normal text-ink-3">
              Stage 0{s.n} — {s.name}
            </p>
            <CopyLink hash={planHref({ track: "b", stage: s.n })} label={`Copy link to Stage ${s.n}`} className="flex-wrap text-ink-3" />
          </div>
          <p className="col-span-4 mt-3 max-w-[60ch] text-lg leading-relaxed text-ink lg:col-span-8 lg:col-start-5 lg:mt-0">{s.detail}</p>
          <div className="col-span-4 mt-10 grid gap-y-8 lg:col-span-8 lg:col-start-5 md:grid-cols-12 md:gap-x-6">
            <StartAndDone stepKey={`b-s${s.n}`} start={s.start} doneWhen={s.doneWhen} topics={s.roadmapTopics} resources={s.resources} />
          </div>
        </div>
        <StepNav n={stage} total={STAGES} unit="stage" onStep={setStage} />
      </div>

      <div id="plan-market">
        <SubHead n="B.2" title="The market you're entering" note={
            <>
              Small startups and agencies are often the most open to first-time designers. With{" "}
              {applicationsPerPost.value} applications per job post, a portfolio with something that runs helps you get noticed.{" "}
              <TextLink href={pageHref("jobs")}>See the full jobs outlook</TextLink>
              .
            </>
          }
        />
        <dl className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {beginnerContext.map((c, i) => {
            const icon: GlyphName = (["trendDown", "trendDown", "stack", "survey"] as const)[i] ?? "survey";
            return (
              <div
                key={c.label}
                data-reveal
                style={{ "--i": i } as CSSProperties}
                className="relative rounded-card border border-edge bg-card shadow-1 group flex flex-col p-4 sm:p-6"
              >
                <dd aria-hidden="true" className="order-1 mb-5">
                  <Glyph name={icon} className="glyph-xl !size-10 text-ink" />
                </dd>
                <dt className="order-3 mt-3 text-sm text-ink-2">{c.label}</dt>
                <dd className="font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums order-2 whitespace-nowrap text-[clamp(2.25rem,4.5vw,4.5rem)]">{c.value}</dd>
                <dd className="font-mono text-label font-normal order-4 mt-auto flex flex-col items-start gap-1.5 pt-4 text-ink-3">
                  <BasisBadge basis={c.basis} />
                  <span>{c.source}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {/* Stack */}
      <div id="plan-stack">
        <SubHead n="B.3" title="One focused stack, in order" note={toolPricingNote} />
        <ol className="grid gap-4 md:grid-cols-3">
          {beginnerStack.map((p, i) => (
            <li key={p.phase} className="relative rounded-card border border-edge bg-card shadow-1 p-5 sm:p-6">
              <span className="font-mono text-label font-normal text-ink-3">
                0{i + 1} — {p.phase}
              </span>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tools.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-y-24 lg:grid-cols-12 lg:gap-x-6">
        <div id="plan-portfolio" className="lg:col-span-6">
          <SubHead n="B.4" title="What reviewers check in a junior portfolio" />
          <ChecklistLink href={pageHref("ready", "b")} title="Your checklist" detail="Clear scope, how your thinking changed, a live build, easy access. Tick it off on the Checklist page." />
        </div>
        <div id="plan-first-year" className="lg:col-span-5 lg:col-start-8">
          <SubHead n="B.5" title="Your first year on the job" />
          <ol className="space-y-4">
            {icGrowth.map((g, i) => (
              <li key={g.name} className="relative rounded-card border border-edge bg-card shadow-1 grid grid-cols-[3rem_1fr] gap-x-3 p-5" data-reveal style={{ "--i": i } as CSSProperties}>
                <span className="font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums text-4xl text-accent">{i + 1}</span>
                <div>
                  <h3 className="text-[1.0625rem] font-medium tracking-tight text-ink">{g.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{g.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Full interactive roadmap base checklists */}
      <PlanRoadmapBase
        id="plan-base"
        n="B.base"
        title="Every topic behind this plan"
        note="Stage 1 works through the UX Design and Product Design checklists here. Later stages layer Frontend, AI Product Builder and Design Systems. Expand any stage to tick off topics as you learn."
        items={trackBBaseRoadmaps}
      />
    </div>
  );
}
