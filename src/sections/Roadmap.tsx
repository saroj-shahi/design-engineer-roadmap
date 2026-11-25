import { useState, type CSSProperties } from "react";
import {
  aiPolicyLabel,
  beginnerContext,
  beginnerStack,
  comparison,
  hybridPortfolio,
  icGrowth,
  juniorChecklist,
  launchStages,
  leverageHabits,
  sixMonthPlan,
  trackAOptions,
} from "../data/research";
import { CheckRow, Eyebrow, Meter, Section, SectionHeader, SubHead, Tag, usePersistentSet, useTabList } from "../components/ui";

type Track = "a" | "b";

export function Roadmap() {
  const [track, setTrack] = useState<Track>("a");
  const tracks = [
    { id: "a" as const, kicker: "Track A", title: "I'm a practising product designer", sub: "Evolve into a hybrid role" },
    { id: "b" as const, kicker: "Track B", title: "I'm starting out", sub: "Launch as a code-literate builder" },
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
        index="05"
        kicker="Dual career roadmap"
        folio="p. 05 / 06"
        title={["Two starting points.", <>One destination: <em>shipping.</em></>]}
        lede="Pick the journey that matches where you are today. Checklists are saved in this browser and nowhere else."
      />

      <div {...listProps} aria-label="Career track" className="grid border-y border-ink sm:grid-cols-2">
        {tracks.map((t, i) => {
          const on = track === t.id;
          return (
            <button
              key={t.id}
              {...tabProps(t.id, i)}
              className={`group relative isolate flex min-h-[15rem] flex-col overflow-hidden p-5 text-left transition-colors duration-700 ease-silk sm:min-h-[19rem] sm:p-8 ${
                i === 1 ? "border-t border-ink sm:border-l sm:border-t-0" : ""
              } ${on ? "text-on-inverse" : "text-ink"}`}
            >
              <span
                aria-hidden
                className={`absolute inset-0 -z-10 origin-bottom bg-inverse transition-transform duration-[900ms] ease-silk ${on ? "scale-y-100" : "scale-y-0"}`}
              />
              <span className="flex items-baseline justify-between">
                <span className={`label ${on ? "text-inverse-muted" : "text-ink-3"}`}>{t.kicker}</span>
                <span className={`label ${on ? "text-inverse-accent" : "text-ink-3"}`}>{on ? "Reading" : "Select"}</span>
              </span>
              <span className="numeral mt-auto text-[clamp(4rem,8vw,7rem)]">{t.id.toUpperCase()}</span>
              <span className="mt-4 block font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.05] tracking-tight">{t.title}</span>
              <span className={`mt-2 block text-sm ${on ? "text-inverse-muted" : "text-ink-3"}`}>{t.sub}</span>
            </button>
          );
        })}
      </div>

      <div {...panelProps(track)} key={track} className="panel-in mt-24 focus-visible:outline-offset-8">
        {track === "a" ? <TrackA /> : <TrackB />}
      </div>
    </Section>
  );
}

/* ───────────── Track A ───────────── */

function TrackA() {
  const [choice, setChoice] = useState(trackAOptions[0].id);
  const [month, setMonth] = useState(1);
  const habits = usePersistentSet("de-guide:habits");
  const portfolio = usePersistentSet("de-guide:hybrid-portfolio");
  const m = sixMonthPlan[month - 1];
  const interview = comparison.find((r) => r.dimension === "Interview focus")!;
  const months = useTabList({
    ids: sixMonthPlan.map((x) => String(x.month)),
    value: String(month),
    onChange: (id) => setMonth(Number(id)),
    idPrefix: "month",
  });

  return (
    <div className="space-y-28">
      {/* Track chooser */}
      <div>
        <SubHead n="A.1" title="Choose your evolution track" />
        <fieldset className="min-w-0">
          <legend className="sr-only">Evolution track</legend>
          <div className="grid border-t border-ink md:grid-cols-2">
            {trackAOptions.map((o, i) => {
              const on = choice === o.id;
              return (
                <label
                  key={o.id}
                  className={`group relative cursor-pointer border-b border-line py-7 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent md:py-9 ${
                    i === 1 ? "md:border-l md:pl-8" : "md:pr-8"
                  }`}
                >
                  <input type="radio" name="trackA" value={o.id} checked={on} onChange={() => setChoice(o.id)} className="sr-only" />
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
            ? "Follow the full six-month plan below to reach production pull requests."
            : "Use the six-month plan below for the front-end literacy you need to audit AI-generated code, then apply it to tokens, Figma MCP context and agent trust protocols."}
        </p>
      </div>

      {/* 6-month timeline */}
      <div>
        <SubHead n="A.2" title="A six-month technical transition" note="Browser standards first, AI acceleration second. Standardised on React, TypeScript and Tailwind." />

        <div {...months.listProps} aria-label="Month" className="grid grid-cols-6 border-t border-ink">
          {sixMonthPlan.map((x, i) => {
            const on = month === x.month;
            const done = x.month < month;
            return (
              <button
                key={x.month}
                {...months.tabProps(String(x.month), i)}
                className={`group relative pb-5 pt-4 text-left ${i > 0 ? "border-l border-line pl-2 sm:pl-4" : ""}`}
              >
                <span aria-hidden className={`absolute -top-px left-0 right-0 h-[3px] origin-left transition-transform duration-700 ease-silk ${on ? "scale-x-100 bg-accent" : done ? "scale-x-100 bg-ink" : "scale-x-0 bg-ink"}`} />
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
          className="stagger grid gap-y-10 border-y border-line py-10 md:grid-cols-12 md:gap-x-6"
        >
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
        </div>
        <div className="mt-5 flex items-center justify-between">
          <StepButton disabled={month === 1} onClick={() => setMonth((v) => Math.max(1, v - 1))}>
            ← Previous
          </StepButton>
          <span className="label tabular text-ink-3">
            {String(month).padStart(2, "0")} / 06
          </span>
          <StepButton disabled={month === 6} onClick={() => setMonth((v) => Math.min(6, v + 1))}>
            Next →
          </StepButton>
        </div>
      </div>

      {/* Leverage + portfolio */}
      <div className="grid gap-y-24 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
          <SubHead n="A.3" title="In-role leverage" />
          <Meter value={habits.set.size} max={leverageHabits.length} label="Habits in place" />
          <ul className="mt-6 border-t border-ink">
            {leverageHabits.map((h, i) => (
              <CheckRow key={h.id} index={i + 1} checked={habits.set.has(h.id)} onToggle={() => habits.toggle(h.id)} title={h.title} detail={h.detail} />
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <SubHead n="A.4" title="Hybrid portfolio & interviews" />
          <Meter value={portfolio.set.size} max={hybridPortfolio.length} label="Portfolio components" />
          <ul className="mt-6 border-t border-ink">
            {hybridPortfolio.map((h, i) => (
              <CheckRow key={h.id} index={i + 1} checked={portfolio.set.has(h.id)} onToggle={() => portfolio.toggle(h.id)} title={h.title} detail={h.detail} />
            ))}
          </ul>
          <div className="mt-10 bg-inverse p-6 text-on-inverse sm:p-8">
            <p className="label mb-4 text-inverse-accent">Expect in interviews</p>
            <p className="font-display text-[1.625rem] leading-[1.15] tracking-tight">{interview.hybrid}</p>
            <p className="mt-4 text-sm leading-relaxed text-inverse-muted">Instead of: {interview.traditional}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepButton({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="hit group label text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30">
      <span className="link-ul-static">{children}</span>
    </button>
  );
}

/* ───────────── Track B ───────────── */

function TrackB() {
  const [stage, setStage] = useState(1);
  const junior = usePersistentSet("de-guide:junior-checklist");
  const s = launchStages[stage - 1];
  const stages = useTabList({
    ids: launchStages.map((x) => String(x.n)),
    value: String(stage),
    onChange: (id) => setStage(Number(id)),
    idPrefix: "launch",
  });

  return (
    <div className="space-y-28">
      <div>
        <dl className="grid grid-cols-2 border-y border-ink md:grid-cols-4">
          {beginnerContext.map((c, i) => (
            <div
              key={c.label}
              data-reveal
              style={{ "--i": i } as CSSProperties}
              className={`flex flex-col py-6 sm:py-8 ${i % 2 === 1 ? "border-l border-line pl-4 sm:pl-6" : "pr-4 md:pr-6"} ${
                i === 2 ? "border-t border-line md:border-l md:border-t-0 md:pl-6" : ""
              } ${i === 3 ? "border-t border-line md:border-t-0" : ""}`}
            >
              <dt className="order-2 mt-3 text-sm text-ink-2">{c.label}</dt>
              <dd className="numeral order-1 text-[clamp(3rem,6vw,5.5rem)]">{c.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-3">
          AI now handles basic interface assembly, so static-only UI portfolios rarely clear screening. Position yourself as a
          code-literate product builder.
        </p>
      </div>

      {/* 4-stage plan */}
      <div>
        <SubHead n="B.1" title="A four-stage launch plan" />
        <div {...stages.listProps} aria-label="Launch stage" className="grid border-t border-ink md:grid-cols-4">
          {launchStages.map((x, i) => {
            const on = stage === x.n;
            return (
              <button
                key={x.n}
                {...stages.tabProps(String(x.n), i)}
                className={`group relative flex h-full w-full flex-col border-b border-line py-6 text-left md:px-5 md:first:pl-0 ${i > 0 ? "md:border-l" : ""}`}
              >
                  <span aria-hidden className={`absolute -top-px left-0 right-0 h-[3px] origin-left bg-accent transition-transform duration-700 ease-silk ${on ? "scale-x-100" : "scale-x-0"}`} />
                  <span className={`label ${on ? "text-accent-ink" : "text-ink-3"}`}>Stage 0{x.n}</span>
                  <span className={`mt-3 font-display text-2xl leading-tight tracking-tight transition-colors duration-500 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>{x.name}</span>
                  <span className="mt-4 text-xs text-ink-3">{x.output}</span>
              </button>
            );
          })}
        </div>
        <div {...stages.panelProps(String(stage))} key={stage} className="panel-in grid-12 border-b border-line py-10">
          <p className="label col-span-4 text-ink-3 lg:col-span-3">
            Stage 0{s.n} — {s.name}
          </p>
          <p className="col-span-4 mt-3 max-w-[60ch] text-lg leading-relaxed text-ink lg:col-span-8 lg:col-start-5 lg:mt-0">{s.detail}</p>
        </div>
      </div>

      {/* Stack */}
      <div>
        <SubHead n="B.2" title="One focused stack, in order" note="Resist tool sprawl. Learn the fundamentals before AI screen generation." />
        <ol className="grid border-t border-ink md:grid-cols-3">
          {beginnerStack.map((p, i) => (
            <li key={p.phase} className={`border-b border-line py-6 ${i > 0 ? "md:border-l md:pl-6" : "md:pr-6"}`}>
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
          <SubHead n="B.3" title="Junior portfolio screening" />
          <Meter value={junior.set.size} max={juniorChecklist.length} label="Screening criteria met" />
          <ul className="mt-6 border-t border-ink">
            {juniorChecklist.map((h, i) => (
              <CheckRow key={h.id} index={i + 1} checked={junior.set.has(h.id)} onToggle={() => junior.toggle(h.id)} title={h.title} detail={h.detail} />
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <SubHead n="B.4" title="Year one: IC1 → IC2" />
          <ol className="border-t border-ink">
            {icGrowth.map((g, i) => (
              <li key={g.name} className="grid grid-cols-[3rem_1fr] gap-x-3 border-b border-line py-6" data-reveal style={{ "--i": i } as CSSProperties}>
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
