import { useState, type CSSProperties } from "react";
import { ArrowBackGlyph, ArrowGlyph, ExternalGlyph, Glyph } from "../components/icons";
import { RoadmapMap } from "../components/RoadmapMap";
import {
  aiPolicyLabel,
  beginnerContext,
  beginnerStack,
  comparison,
  icGrowth,
  launchStages,
  leverageHabits,
  planFor,
  sixMonthPlan,
  trackAOptions,
  type Resource,
} from "../data/research";
import { CheckRow, Eyebrow, Meter, pageHref, Section, SectionHeader, SubHead, Tag, TRACK_A_OPTION_KEY, replaceHash, usePersistentSet, useStoredChoice, useTabList, useTrack, type Track } from "../components/ui";


/** Bring a step's detail into view after it is picked on the map. */
function showDetail(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/** The six months fall into three two-month phases; notes are the months' own AI policies. */
const phases = [
  { name: "Foundations", months: [1, 2] },
  { name: "Acceleration", months: [3, 4] },
  { name: "Production", months: [5, 6] },
].map((p) => ({ ...p, note: p.months.map((m) => aiPolicyLabel[sixMonthPlan[m - 1].aiPolicy]).join(" → ") }));

export function Roadmap() {
  const [track, setTrackStored] = useTrack();
  const setTrack = (t: Track) => {
    setTrackStored(t);
    replaceHash(`#/plan/${t}`);
  };
  const tracks = [
    { id: "a" as const, glyph: "stairs" as const, kicker: "Track A", title: "I'm a practising product designer", sub: "Evolve into a hybrid role" },
    { id: "b" as const, glyph: "launch" as const, kicker: "Track B", title: "I'm starting out", sub: "Get your first role, with code in your portfolio" },
  ];
  const { listProps, tabProps, panelProps } = useTabList({
    ids: tracks.map((t) => t.id),
    value: track,
    onChange: (id) => setTrack(id as Track),
    idPrefix: "track",
  });

  return (
    <Section id="roadmap">
      <SectionHeader
        id="roadmap"
        level="h1"
        glyph="route"
        title={["Your plan,", <em>step by step.</em>]}
        lede="Pick where you are today. The plan changes to match. Your ticks are saved in this browser only."
      />

      <div {...listProps} aria-label="Career track" className="grid gap-6 sm:grid-cols-2">
        {tracks.map((t, i) => {
          const on = track === t.id;
          return (
            <button
              key={t.id}
              {...tabProps(t.id, i)}
              className={`card card-lift group relative isolate flex min-h-[15rem] flex-col overflow-hidden p-5 text-left transition-colors duration-700 ease-silk sm:min-h-[19rem] sm:p-8 ${
                on ? "card-on text-on-inverse" : "text-ink"
              }`}
            >
              <span
                aria-hidden
                className={`absolute inset-0 -z-10 origin-bottom bg-inverse transition-transform duration-[900ms] ease-silk ${on ? "scale-y-100" : "scale-y-0"}`}
              />
              <span className={`label ${on ? "text-inverse-muted" : "text-ink-3"}`}>{t.kicker}</span>
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

      <p className="mt-6 text-sm text-ink-3">
        New to a term like PR, tokens or MCP?{" "}
        <a href={pageHref("library", "glossary")} className="hit link-ul-static font-medium text-ink">
          See the glossary
        </a>
      </p>

      <div {...panelProps(track)} key={track} className="panel-in mt-24 focus-visible:outline-offset-8 sm:mt-32">
        {track === "a" ? <TrackA /> : <TrackB />}
      </div>
    </Section>
  );
}

/* ───────────── Track A ───────────── */

function TrackA() {
  const [choice, setChoice] = useStoredChoice(TRACK_A_OPTION_KEY, "pde", ["pde", "meta"]);
  const [month, setMonth] = useState(1);
  const habits = usePersistentSet("de-guide:habits");
  const plan = planFor(choice);
  const m = plan[month - 1];
  const interview = comparison.find((r) => r.dimension === "Interview focus")!;
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
                  <input type="radio" name="trackA" value={o.id} checked={on} onChange={() => setChoice(o.id as "pde" | "meta")} className="sr-only" />
                  <span className="flex items-start gap-4">
                    <span aria-hidden className={`mt-2 grid size-4 shrink-0 place-items-center border transition-colors duration-500 ${on ? "border-accent" : "border-line-strong group-hover:border-ink"}`}>
                      <span className={`size-2 bg-accent transition-transform duration-500 ease-silk ${on ? "scale-100" : "scale-0"}`} />
                    </span>
                    <span className={`display-m transition-colors duration-500 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>{o.name}</span>
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
      <div>
        <SubHead n="A.map" title="Your plan at a glance" note="Six months, one step at a time. Pick a month to open its details." />
        <RoadmapMap
          label="Six-month plan"
          leftLabel="Learn"
          rightLabel="Build"
          active={String(month)}
          onPick={(id) => {
            setMonth(Number(id));
            showDetail("month-detail");
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
      <div id="month-detail" className="scroll-mt-24">
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
            const done = x.month < month;
            return (
              <button
                key={x.month}
                {...months.tabProps(String(x.month), i)}
                className={`card card-lift group relative overflow-hidden px-2 pb-4 pt-4 text-left sm:px-4 ${on ? "card-on" : ""}`}
              >
                <span aria-hidden className={`absolute left-0 right-0 top-0 h-[4px] origin-left transition-transform duration-700 ease-silk ${on ? "scale-x-100 bg-accent" : done ? "scale-x-100 bg-ink" : "scale-x-0 bg-ink"}`} />
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
        <div className="mt-5 flex items-center justify-between">
          <StepButton disabled={month === 1} onClick={() => setMonth((v) => Math.max(1, v - 1))} dir="back">
            Previous
          </StepButton>
          <span className="label tabular text-ink-3">
            {String(month).padStart(2, "0")} / 06
          </span>
          <StepButton disabled={month === 6} onClick={() => setMonth((v) => Math.min(6, v + 1))} dir="next">
            Next
          </StepButton>
        </div>
      </div>

      {/* Leverage + portfolio */}
      <div className="grid gap-y-24 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
          <SubHead n="A.3" title="Using it in your current job" />
          <Meter value={habits.set.size} max={leverageHabits.length} label="Habits in place" />
          <ul className="card mt-6 px-5 sm:px-6 [&>li:last-child]:border-b-0">
            {leverageHabits.map((h, i) => (
              <CheckRow key={h.id} index={i + 1} checked={habits.set.has(h.id)} onToggle={() => habits.toggle(h.id)} title={h.title} detail={h.detail} />
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <SubHead n="A.4" title="Hybrid portfolio & interviews" />
          <ChecklistLink href="#/ready/a" title="Your portfolio checklist" detail="Live demo, public repo, writeup, proof you build with AI, and more. Track it on the Ready? page." />
          <div className="mt-10 border-2 border-edge bg-inverse p-6 text-on-inverse shadow-[var(--sh-accent)] sm:p-8">
            <p className="label mb-4 text-inverse-accent">Expect in interviews</p>
            <p className="font-display text-[1.625rem] leading-[1.15] tracking-tight">{interview.hybrid}</p>
            <p className="mt-4 text-sm leading-relaxed text-inverse-muted">Alongside the usual: {interview.traditional}</p>
          </div>
        </div>
      </div>
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
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {resources.map((r) => (
              <li key={r.url} className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="group min-w-0 text-ink">
                  <span className="link-ul">{r.label}</span>
                  <ExternalGlyph className="ml-1 text-ink-3 transition-colors duration-300 group-hover:text-accent-ink" />
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

function StepButton({ disabled, onClick, children, dir }: { disabled: boolean; onClick: () => void; children: string; dir: "back" | "next" }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="hit group label flex items-center gap-1.5 text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30">
      {dir === "back" && <ArrowBackGlyph />}
      <span className="link-ul-static">{children}</span>
      {dir === "next" && <ArrowGlyph />}
    </button>
  );
}

/* ───────────── Track B ───────────── */

function TrackB() {
  const [stage, setStage] = useState(1);
  const s = launchStages[stage - 1];
  const stages = useTabList({
    ids: launchStages.map((x) => String(x.n)),
    value: String(stage),
    onChange: (id) => setStage(Number(id)),
    idPrefix: "launch",
  });

  return (
    <div className="space-y-24 sm:space-y-36">
      {/* Map of the whole plan */}
      <div>
        <SubHead n="B.map" title="Your plan at a glance" note="Four stages, in order. Pick a stage to open its details." />
        <RoadmapMap
          label="Four-stage launch plan"
          leftLabel="Focus"
          rightLabel="Result"
          active={String(stage)}
          onPick={(id) => {
            setStage(Number(id));
            showDetail("stage-detail");
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
      <div id="stage-detail" className="scroll-mt-24">
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
                  <span className={`label ${on ? "text-accent-ink" : "text-ink-3"}`}>Stage 0{x.n}</span>
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
      </div>

      <div>
        <SubHead n="B.2" title="The market you're entering" note="Seed-stage startups (young companies on their first funding round) have the highest design hiring rate (25%). With 300–800 applicants per role, a portfolio with something that runs is one way to stand out." />
        <dl className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {beginnerContext.map((c, i) => (
            <div
              key={c.label}
              data-reveal
              style={{ "--i": i } as CSSProperties}
              className="card card-lift flex flex-col p-4 sm:p-6"
            >
              <dt className="order-2 mt-3 text-sm text-ink-2">{c.label}</dt>
              <dd className="numeral order-1 text-[clamp(3rem,6vw,5.5rem)]">{c.value}</dd>
              <dd className="label order-3 mt-auto pt-4 text-ink-3">{c.source}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Stack */}
      <div>
        <SubHead n="B.3" title="One focused stack, in order" />
        <ol className="grid gap-4 md:grid-cols-3">
          {beginnerStack.map((p, i) => (
            <li key={p.phase} className="card card-lift p-5 sm:p-6">
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
        <div className="lg:col-span-6">
          <SubHead n="B.4" title="Junior portfolio screening" />
          <ChecklistLink href="#/ready/b" title="Your screening checklist" detail="Clear scope, how your thinking changed, a live build, easy access. Tick it off on the Ready? page." />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <SubHead n="B.5" title="Your first year on the job" />
          <ol className="space-y-4">
            {icGrowth.map((g, i) => (
              <li key={g.name} className="card card-lift grid grid-cols-[3rem_1fr] gap-x-3 p-5" data-reveal style={{ "--i": i } as CSSProperties}>
                <span className="numeral text-4xl text-accent">{i + 1}</span>
                <div>
                  <h4 className="text-[1.0625rem] font-medium tracking-tight text-ink">{g.name}</h4>
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
