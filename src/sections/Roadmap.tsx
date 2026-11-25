import { type CSSProperties } from "react";
import { ArrowBackGlyph, ArrowGlyph, ExternalGlyph, Glyph } from "../components/icons";
import { RoadmapMap } from "../components/RoadmapMap";
import {
  aiPolicyLabel,
  beginnerContext,
  beginnerStack,
  icGrowth,
  interviewFocus,
  launchStages,
  leverageHabits,
  planFor,
  sixMonthPlan,
  trackAOptions,
  type Resource,
} from "../data/research";
import {
  CheckRow,
  ContextBar,
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
    <span aria-hidden className={`label shrink-0 ${className}`}>
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
    { id: "a" as const, glyph: "stairs" as const, kicker: "Track A", title: "I'm a practising product designer", sub: "Evolve into a hybrid role" },
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
            { label: `Track A · ${trackAOptions.find((o) => o.id === plan.option)?.name ?? ""}` },
            { label: `Month ${plan.month} of ${MONTHS}` },
          ]
        : [{ label: "Plan" }, { label: "Track B · Starting out" }, { label: `Stage ${plan.stage} of ${STAGES}` }];
  const jumps =
    track === "a"
      ? [
          { id: "plan-map", label: "Map" },
          { id: "month-detail", label: "This month" },
          { id: "plan-habits", label: "Habits" },
          { id: "plan-portfolio", label: "Portfolio" },
        ]
      : [
          { id: "plan-map", label: "Map" },
          { id: "stage-detail", label: "This stage" },
          { id: "plan-market", label: "Market" },
          { id: "plan-stack", label: "Stack" },
          { id: "plan-portfolio", label: "Portfolio" },
          { id: "plan-first-year", label: "First year" },
        ];

  return (
    <Section id="roadmap">
      <SectionHeader
        id="roadmap"
        level="h1"
        glyph="route"
        title={["Your plan,", <em>step by step.</em>]}
        lede={`Pick where you are today. The plan changes to match. ${saveNote}`}
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
              className={`card card-lift group relative isolate flex min-h-[15rem] flex-col overflow-hidden p-5 text-left transition-colors duration-700 ease-silk sm:min-h-[19rem] sm:p-8 ${
                on ? "card-on text-on-inverse" : "text-ink"
              }`}
            >
              <span
                aria-hidden
                className={`absolute inset-0 -z-10 origin-bottom bg-inverse transition-transform duration-[900ms] ease-silk ${on ? "scale-y-100" : "scale-y-0"}`}
              />
              <span className="flex items-start justify-between gap-4">
                <span className={`label ${on ? "text-inverse-muted" : "text-ink-3"}`}>{t.kicker}</span>
                {on && <SelectedMark className="text-inverse-accent">Your track</SelectedMark>}
              </span>
              <span className="mt-auto flex items-end justify-between gap-4">
                <span className="numeral text-[clamp(4rem,8vw,7rem)]">{t.id.toUpperCase()}</span>
                <Glyph name={t.glyph} on={on} className="glyph-xl !size-20 sm:!size-28" />
              </span>
              <span className="mt-4 block font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.05] tracking-tight">{t.title}</span>
              <span className={`mt-2 block text-sm ${on ? "text-inverse-muted" : "text-ink-3"}`}>{t.sub}</span>
            </button>
          );
        })}
      </div>

      {track === null && <p className="mt-6 text-[1.0625rem] font-medium tracking-tight text-ink">Pick where you are today to see your plan.</p>}

      <p className="mt-6 text-sm text-ink-3">
        New to a term like PR, tokens or MCP?{" "}
        <a href={pageHref("library", "glossary")} className="hit link-ul-static font-medium text-ink">
          See the glossary
        </a>
      </p>

      {plan && (
        <>
          {/* Spacer, not a wrapper: the bar must sit directly in the section so it sticks through the whole plan. */}
          <div aria-hidden className="h-16 sm:h-24" />
          <ContextBar trail={trail} jumps={jumps} />
          <div {...panelProps(plan.track)} key={plan.track} className="panel-in mt-16 focus-visible:outline-offset-8 sm:mt-24">
            {plan.track === "a" ? <TrackA plan={plan} /> : <TrackB stage={plan.stage} />}
          </div>
        </>
      )}
    </Section>
  );
}

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
        <SubHead n="A.1" title="Choose your track" />
        <fieldset className="min-w-0">
          <legend className="sr-only">Evolution track</legend>
          <div className="grid gap-6 md:grid-cols-2">
            {trackAOptions.map((o) => {
              const on = choice === o.id;
              return (
                <label
                  key={o.id}
                  className={`card card-lift group relative cursor-pointer p-6 sm:p-8 ${on ? "card-on" : ""}`}
                >
                  <input type="radio" name="trackA" value={o.id} checked={on} onChange={() => go({ ...route, option: o.id as TrackAOption })} className="sr-only" />
                  <span className="flex items-start gap-4">
                    <span aria-hidden className={`mt-2 grid size-4 shrink-0 place-items-center border transition-colors duration-500 ${on ? "border-accent" : "border-line-strong group-hover:border-ink"}`}>
                      <span className={`size-2 bg-accent transition-transform duration-500 ease-silk ${on ? "scale-100" : "scale-0"}`} />
                    </span>
                    <span className={`display-m min-w-0 flex-1 transition-colors duration-500 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>{o.name}</span>
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
        <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-3" aria-live="polite">
          {choice === "pde"
            ? "Six months, from browser basics to merged pull requests in a real product."
            : "Months 1–3 are the same for both options: enough front-end to review AI code. Months 4–6 switch to design systems AI tools can read, and to trust flows for AI agents."}
        </p>
      </div>

      {/* Map of the whole plan */}
      <div id="plan-map">
        <SubHead n="A.map" title="Your plan at a glance" note="Six months, one step at a time. Pick a month to open its details." />
        <RoadmapMap
          label="Six-month plan"
          leftLabel="Learn"
          rightLabel="Build"
          active={String(month)}
          hrefFor={(id) => planHref({ ...route, month: Number(id) })}
          onPick={(id) => {
            setMonth(Number(id));
            jumpTo("month-detail");
          }}
          steps={plan.map((x) => ({
            id: String(x.month),
            kicker: `Month ${x.month}`,
            title: x.title,
            note: aiPolicyLabel[x.aiPolicy],
            left: x.learn,
            right: x.build,
          }))}
        />
      </div>

      {/* 6-month timeline */}
      <div id="month-detail" className="scroll-mt-36 lg:scroll-mt-32">
        <SubHead n="A.2" title="A six-month technical transition" note="Learn the browser before AI tools. The plan uses React, TypeScript and Tailwind." />

        <ol aria-label="Phases" className="mb-3 grid grid-cols-6 gap-x-2">
          {phases.map((p) => {
            const on = p.months.includes(month);
            return (
              <li key={p.name} className="col-span-2">
                <span aria-hidden className={`block h-2 border-x border-t transition-colors duration-500 ${on ? "border-accent" : "border-line-strong"}`} />
                <p className={`label mt-2 transition-colors duration-500 ${on ? "text-accent-ink" : "text-ink-3"}`}>
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
                className={`card card-lift group relative overflow-hidden px-2 pb-4 pt-4 text-left sm:px-4 ${on ? "card-on" : ""}`}
              >
                <span aria-hidden className={`absolute left-0 right-0 top-0 h-[4px] origin-left bg-accent transition-transform duration-700 ease-silk ${on ? "scale-x-100" : "scale-x-0"}`} />
                <span className={`numeral block text-[clamp(2rem,4.5vw,4rem)] transition-colors duration-500 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>
                  {String(x.month).padStart(2, "0")}
                </span>
                <span className={`label mt-2 hidden sm:block ${on ? "text-accent-ink" : "text-ink-3"}`}>{aiPolicyLabel[x.aiPolicy]}</span>
                <span className="sr-only">Month {x.month}</span>
              </button>
            );
          })}
        </div>

        <div
          {...months.panelProps(String(month))}
          key={month}
          className="card mt-6"
        >
          <p className="card-head label">
            <span>Month {String(m.month).padStart(2, "0")}</span>
            <span>{aiPolicyLabel[m.aiPolicy]}</span>
          </p>
          <div className="stagger grid gap-y-10 px-5 py-8 sm:px-7 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-4" style={{ "--i": 0 } as CSSProperties}>
            <Eyebrow>Learning focus</Eyebrow>
            <p className="font-display text-[1.625rem] leading-[1.15] tracking-tight text-ink">{m.focus}</p>
          </div>
          <div className="md:col-span-4" style={{ "--i": 1 } as CSSProperties}>
            <Eyebrow>Practical deliverable</Eyebrow>
            <p className="leading-relaxed text-ink-2">{m.deliverable}</p>
          </div>
          <div className="border-l border-accent pl-4 md:col-span-4" style={{ "--i": 2 } as CSSProperties}>
            <Eyebrow className="!text-accent-ink">Guardrail · {aiPolicyLabel[m.aiPolicy]}</Eyebrow>
            <p className="leading-relaxed text-ink">{m.guardrail}</p>
          </div>
          <StartAndDone start={m.start} doneWhen={m.doneWhen} resources={m.resources} />
          </div>
        </div>
        <StepNav
          n={month}
          total={MONTHS}
          unit="month"
          onStep={setMonth}
          doneHref={pageHref("ready", "a")}
        />
      </div>

      {/* Leverage + portfolio */}
      <div className="grid gap-y-24 lg:grid-cols-12 lg:gap-x-6">
        <div id="plan-habits" className="lg:col-span-5">
          <SubHead n="A.3" title="Using it in your current job" />
          <Meter value={habitsDone} max={leverageHabits.length} label="Habits in place" />
          <ul className="card mt-6 px-5 sm:px-6 [&>li:last-child]:border-b-0">
            {leverageHabits.map((h, i) => (
              <CheckRow key={h.id} index={i + 1} checked={habits.set.has(h.id)} onToggle={() => habits.toggle(h.id)} title={h.title} detail={h.detail} />
            ))}
          </ul>
        </div>
        <div id="plan-portfolio" className="lg:col-span-6 lg:col-start-7">
          <SubHead n="A.4" title="Hybrid portfolio & interviews" />
          <ChecklistLink href={pageHref("ready", "a")} title="Your portfolio checklist" detail="Live demo, public repo, writeup, proof you build with AI, and more. Track it on the Checklist page." />
          <div className="mt-10 border-2 border-edge bg-inverse p-6 text-on-inverse shadow-[var(--sh-accent)] sm:p-8">
            <p className="label mb-4 text-inverse-accent">Expect in interviews</p>
            <p className="font-display text-[1.625rem] leading-[1.15] tracking-tight">{interviewFocus.hybrid}</p>
            <p className="mt-4 text-sm leading-relaxed text-inverse-muted">Alongside the usual: {interviewFocus.traditional}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Previous / Next under a step's detail. At the last step, Next becomes a link on to the checklist. */
function StepNav({ n, total, unit, onStep, doneHref }: { n: number; total: number; unit: "month" | "stage"; onStep: (n: number) => void; doneHref: string }) {
  return (
    <div className="mt-5 flex items-center justify-between gap-4">
      <StepButton disabled={n === 1} reason={`You're on the first ${unit}`} onClick={() => onStep(Math.max(1, n - 1))} dir="back">
        Previous
      </StepButton>
      <span className="label tabular text-ink-3">
        {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      {n < total ? (
        <StepButton disabled={false} onClick={() => onStep(n + 1)} dir="next">
          Next
        </StepButton>
      ) : (
        <a href={doneHref} className="hit group label flex items-center gap-1.5 text-ink">
          <span className="link-ul-static">Check your portfolio</span>
          <ArrowGlyph />
        </a>
      )}
    </div>
  );
}


function ChecklistLink({ href, title, detail }: { href: string; title: string; detail: string }) {
  return (
    <a href={href} className="card card-lift group mt-6 flex items-start gap-5 p-5 sm:p-6">
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

/** The first task for a step, the sign you can move on, and where to learn it. Spans a 12-column row. */
function StartAndDone({ start, doneWhen, resources }: { start: string; doneWhen: string; resources: Resource[] }) {
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
      {resources.length > 0 && (
        <div className="border-t border-line pt-5 md:col-span-12">
          <Eyebrow>Learn from</Eyebrow>
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {resources.map((r) => (
              <li key={r.url} className="flex items-center justify-between gap-3 border-b border-line">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 min-w-0 flex-1 items-center py-2.5 text-ink">
                  <span className="link-ul">{r.label}</span>
                  <ExternalGlyph className="ml-1 shrink-0 text-ink-3 transition-colors duration-300 group-hover:text-accent-ink" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
                <span className={`label shrink-0 ${r.cost === "free" ? "text-ink-3" : "text-accent-ink"}`}>{r.cost === "free" ? "Free" : "Paid"}</span>
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
      className="hit group label flex items-center gap-1.5 text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
    >
      {dir === "back" && <ArrowBackGlyph />}
      <span className="link-ul-static">{children}</span>
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
      {/* Map of the whole plan */}
      <div id="plan-map">
        <SubHead n="B.map" title="Your plan at a glance" note="Four stages, in order. Pick a stage to open its details." />
        <RoadmapMap
          label="Four-stage launch plan"
          leftLabel="Focus"
          rightLabel="Result"
          active={String(stage)}
          hrefFor={(id) => planHref({ track: "b", stage: Number(id) })}
          onPick={(id) => {
            setStage(Number(id));
            jumpTo("stage-detail");
          }}
          steps={launchStages.map((x) => ({
            id: String(x.n),
            kicker: `Stage ${x.n}`,
            title: x.name,
            left: x.learn,
            right: x.output,
          }))}
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
                className={`card card-lift group relative flex h-full w-full flex-col overflow-hidden p-5 text-left ${on ? "card-on" : ""}`}
              >
                  <span aria-hidden className={`absolute left-0 right-0 top-0 h-[4px] origin-left bg-accent transition-transform duration-700 ease-silk ${on ? "scale-x-100" : "scale-x-0"}`} />
                  <span className="flex items-start justify-between gap-3">
                    <span className={`label ${on ? "text-accent-ink" : "text-ink-3"}`}>Stage 0{x.n}</span>
                    {on && <SelectedMark className="text-accent-ink">Selected</SelectedMark>}
                  </span>
                  <span className={`mt-3 font-display text-2xl leading-tight tracking-tight transition-colors duration-500 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>{x.name}</span>
                  <span className="mt-4 text-xs text-ink-3">{x.output}</span>
              </button>
            );
          })}
        </div>
        <div {...stages.panelProps(String(stage))} key={stage} className="card panel-in grid-12 mt-6 px-5 py-8 sm:px-7">
          <p className="label col-span-4 text-ink-3 lg:col-span-3">
            Stage 0{s.n} — {s.name}
          </p>
          <p className="col-span-4 mt-3 max-w-[60ch] text-lg leading-relaxed text-ink lg:col-span-8 lg:col-start-5 lg:mt-0">{s.detail}</p>
          <div className="col-span-4 mt-10 grid gap-y-8 lg:col-span-8 lg:col-start-5 md:grid-cols-12 md:gap-x-6">
            <StartAndDone start={s.start} doneWhen={s.doneWhen} resources={s.resources} />
          </div>
        </div>
        <StepNav n={stage} total={STAGES} unit="stage" onStep={setStage} doneHref={pageHref("ready", "b")} />
      </div>

      <div id="plan-market">
        <SubHead n="B.2" title="The market you're entering" note="Seed-stage startups (young companies on their first funding round) have the highest design hiring rate (25%). With 300–800 applicants per role, a portfolio with something that runs is one way to stand out." />
        <dl className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {beginnerContext.map((c, i) => (
            <div
              key={c.label}
              data-reveal
              style={{ "--i": i } as CSSProperties}
              className="card flex flex-col p-4 sm:p-6"
            >
              <dt className="order-2 mt-3 text-sm text-ink-2">{c.label}</dt>
              <dd className="numeral order-1 whitespace-nowrap text-[clamp(2.25rem,4.5vw,4.5rem)]">{c.value}</dd>
              <dd className="label order-3 mt-auto pt-4 text-ink-3">{c.source}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Stack */}
      <div id="plan-stack">
        <SubHead n="B.3" title="One focused stack, in order" />
        <ol className="grid gap-4 md:grid-cols-3">
          {beginnerStack.map((p, i) => (
            <li key={p.phase} className="card p-5 sm:p-6">
              <span className="label text-ink-3">
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
          <SubHead n="B.4" title="Junior portfolio screening" />
          <ChecklistLink href={pageHref("ready", "b")} title="Your screening checklist" detail="Clear scope, how your thinking changed, a live build, easy access. Tick it off on the Checklist page." />
        </div>
        <div id="plan-first-year" className="lg:col-span-5 lg:col-start-8">
          <SubHead n="B.5" title="Your first year on the job" />
          <ol className="space-y-4">
            {icGrowth.map((g, i) => (
              <li key={g.name} className="card grid grid-cols-[3rem_1fr] gap-x-3 p-5" data-reveal style={{ "--i": i } as CSSProperties}>
                <span className="numeral text-4xl text-accent">{i + 1}</span>
                <div>
                  <h3 className="text-[1.0625rem] font-medium tracking-tight text-ink">{g.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{g.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
