import { useState } from "react";
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
import { CheckRow, Eyebrow, Meter, Section, SectionHeader, Tag, usePersistentSet } from "../components/ui";

type Track = "a" | "b";

export function Roadmap() {
  const [track, setTrack] = useState<Track>("a");
  const tracks = [
    { id: "a" as const, kicker: "Track A", title: "I'm a practicing product designer", sub: "Evolve into a hybrid role" },
    { id: "b" as const, kicker: "Track B", title: "I'm starting out", sub: "Launch as a code-literate builder" },
  ];

  return (
    <Section id="roadmap" className="bg-surface/40">
      <SectionHeader
        id="roadmap"
        index="05"
        kicker="Dual career roadmap"
        title={
          <>
            Two starting points. <span className="italic">One destination:</span> shipping.
          </>
        }
        lede="Choose the journey that matches where you are today. Checklists save in this browser."
      />

      <div role="tablist" aria-label="Career track" className="grid gap-3 sm:grid-cols-2">
        {tracks.map((t, i) => {
          const on = track === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`track-tab-${t.id}`}
              aria-selected={on}
              aria-controls={`track-panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setTrack(t.id)}
              onKeyDown={(e) => {
                if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
                e.preventDefault();
                const n = tracks[(i + 1) % 2];
                setTrack(n.id);
                document.getElementById(`track-tab-${n.id}`)?.focus();
              }}
              className={`flex items-center gap-4 rounded-md border p-5 text-left transition-all duration-200 ${
                on ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink hover:border-line-strong"
              }`}
            >
              <span className={`grid size-10 shrink-0 place-items-center rounded-full border font-mono text-sm ${on ? "border-paper/30" : "border-line-strong"}`}>
                {t.id.toUpperCase()}
              </span>
              <span>
                <span className={`block font-mono text-[11px] uppercase tracking-wider ${on ? "text-paper/60" : "text-ink-3"}`}>{t.kicker}</span>
                <span className="block text-lg font-medium leading-snug">{t.title}</span>
                <span className={`block text-sm ${on ? "text-paper/70" : "text-ink-3"}`}>{t.sub}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`track-panel-${track}`}
        aria-labelledby={`track-tab-${track}`}
        key={track}
        className="fade-in mt-12"
      >
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

  return (
    <div className="space-y-16">
      {/* Track chooser */}
      <div>
        <SubHead n="A.1" title="Choose your evolution track" />
        <fieldset className="min-w-0">
          <legend className="sr-only">Evolution track</legend>
          <div className="grid gap-3 md:grid-cols-2">
            {trackAOptions.map((o) => {
              const on = choice === o.id;
              return (
                <label
                  key={o.id}
                  className={`relative cursor-pointer rounded-md border p-5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                    on ? "border-ink bg-surface" : "border-line hover:border-line-strong"
                  }`}
                >
                  <input type="radio" name="trackA" value={o.id} checked={on} onChange={() => setChoice(o.id)} className="sr-only" />
                  <span className="flex items-center gap-3">
                    <span aria-hidden className={`grid size-4 place-items-center rounded-full border ${on ? "border-accent" : "border-line-strong"}`}>
                      <span className={`size-2 rounded-full bg-accent transition-transform ${on ? "scale-100" : "scale-0"}`} />
                    </span>
                    <span className="font-serif text-2xl leading-tight">{o.name}</span>
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-ink-2">Best for: {o.for}</span>
                  <span className="mt-4 flex flex-wrap gap-1.5">
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
        <p className="prose-measure mt-4 text-sm text-ink-3" aria-live="polite">
          {choice === "pde"
            ? "Follow the full 6-month plan below to reach production PRs."
            : "Use the 6-month plan below to build the front-end literacy you need to audit AI-generated code, then apply it to tokens, Figma MCP context, and agent trust protocols."}
        </p>
      </div>

      {/* 6-month timeline */}
      <div>
        <SubHead n="A.2" title="6-month technical transition" note="Browser standards first, AI acceleration second. Standardized on React, TypeScript, Tailwind." />

        <div role="tablist" aria-label="Month" className="grid grid-cols-6 border-b border-line">
          {sixMonthPlan.map((x, i) => {
            const on = month === x.month;
            const done = x.month < month;
            return (
              <button
                key={x.month}
                type="button"
                role="tab"
                id={`month-tab-${x.month}`}
                aria-selected={on}
                aria-controls={`month-panel-${x.month}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setMonth(x.month)}
                onKeyDown={(e) => {
                  const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                  if (!d) return;
                  e.preventDefault();
                  const n = ((i + d + 6) % 6) + 1;
                  setMonth(n);
                  document.getElementById(`month-tab-${n}`)?.focus();
                }}
                className="group relative -mb-px pb-4 pt-2 text-left"
              >
                <span className={`block font-mono text-[10px] uppercase tracking-wider ${on ? "text-accent-ink" : "text-ink-3"}`}>
                  <span className="hidden sm:inline">Month </span>M{x.month}
                </span>
                <span className={`mt-1 hidden text-xs sm:block ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}>{aiPolicyLabel[x.aiPolicy]}</span>
                <span
                  aria-hidden
                  className={`absolute bottom-0 left-0 right-1 h-0.5 transition-colors ${on ? "bg-accent" : done ? "bg-ink-3" : "bg-transparent group-hover:bg-line-strong"}`}
                />
              </button>
            );
          })}
        </div>

        <div role="tabpanel" id={`month-panel-${month}`} aria-labelledby={`month-tab-${month}`} tabIndex={0} key={month} className="fade-in mt-6 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
          <div className="bg-surface p-6">
            <Eyebrow>Learning focus</Eyebrow>
            <p className="leading-relaxed text-ink">{m.focus}</p>
          </div>
          <div className="bg-surface p-6">
            <Eyebrow>Practical deliverable</Eyebrow>
            <p className="leading-relaxed text-ink">{m.deliverable}</p>
          </div>
          <div className="relative bg-surface p-6">
            <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-accent" />
            <Eyebrow>
              <span className="text-accent-ink">Guardrail · {aiPolicyLabel[m.aiPolicy]}</span>
            </Eyebrow>
            <p className="leading-relaxed text-ink">{m.guardrail}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonth((v) => Math.max(1, v - 1))}
            disabled={month === 1}
            className="rounded border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line"
          >
            ← Previous
          </button>
          <span className="font-mono text-xs text-ink-3">{month} / 6</span>
          <button
            type="button"
            onClick={() => setMonth((v) => Math.min(6, v + 1))}
            disabled={month === 6}
            className="rounded border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Leverage + portfolio */}
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SubHead n="A.3" title="In-role leverage checklist" />
          <Meter value={habits.set.size} max={leverageHabits.length} label="Habits in place" />
          <ul className="mt-2">
            {leverageHabits.map((h, i) => (
              <CheckRow key={h.id} index={i + 1} checked={habits.set.has(h.id)} onToggle={() => habits.toggle(h.id)} title={h.title} detail={h.detail} />
            ))}
          </ul>
        </div>
        <div>
          <SubHead n="A.4" title="Hybrid portfolio & interview guide" />
          <Meter value={portfolio.set.size} max={hybridPortfolio.length} label="Portfolio components" />
          <ul className="mt-2">
            {hybridPortfolio.map((h, i) => (
              <CheckRow key={h.id} index={i + 1} checked={portfolio.set.has(h.id)} onToggle={() => portfolio.toggle(h.id)} title={h.title} detail={h.detail} />
            ))}
          </ul>
          <div className="mt-6 rounded-md border border-line bg-surface p-5">
            <Eyebrow>Expect in interviews</Eyebrow>
            <p className="text-sm leading-relaxed text-ink">{interview.hybrid}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-3">Instead of: {interview.traditional}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Track B ───────────── */

function TrackB() {
  const [stage, setStage] = useState(1);
  const junior = usePersistentSet("de-guide:junior-checklist");
  const s = launchStages[stage - 1];

  return (
    <div className="space-y-16">
      <dl className="grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
        {beginnerContext.map((c) => (
          <div key={c.label} className="flex flex-col border-b border-r border-line bg-surface p-4 sm:p-5">
            <dt className="order-2 mt-1 text-sm text-ink-2">{c.label}</dt>
            <dd className="order-1 font-serif text-4xl tabular">{c.value}</dd>
          </div>
        ))}
      </dl>
      <p className="prose-measure -mt-12 text-sm leading-relaxed text-ink-3">
        AI now handles basic interface assembly, so static-only UI portfolios rarely clear screening. Position yourself as a code-literate
        product builder.
      </p>

      {/* 4-stage plan */}
      <div>
        <SubHead n="B.1" title="Four-stage launch plan" />
        <ol className="grid gap-3 md:grid-cols-4">
          {launchStages.map((x) => {
            const on = stage === x.n;
            return (
              <li key={x.n}>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls="launch-detail"
                  onClick={() => setStage(x.n)}
                  className={`flex h-full w-full flex-col rounded-md border p-4 text-left transition-all ${
                    on ? "border-ink bg-surface" : "border-line hover:border-line-strong"
                  }`}
                >
                  <span className={`font-mono text-[11px] ${on ? "text-accent-ink" : "text-ink-3"}`}>Stage {x.n}</span>
                  <span className="mt-2 font-medium leading-snug text-ink">{x.name}</span>
                  <span className="mt-3 text-xs text-ink-3">{x.output}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div id="launch-detail" key={stage} className="fade-in mt-3 rounded-md border border-line bg-surface p-6" aria-live="polite">
          <Eyebrow>
            Stage {s.n} · {s.name}
          </Eyebrow>
          <p className="prose-measure leading-relaxed text-ink">{s.detail}</p>
        </div>
      </div>

      {/* Stack */}
      <div>
        <SubHead n="B.2" title="One focused stack, in order" note="Resist tool sprawl. Learn fundamentals before AI screen generation." />
        <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
          {beginnerStack.map((p, i) => (
            <li key={p.phase} className="bg-surface p-5">
              <span className="font-mono text-[11px] text-ink-3">
                0{i + 1} · {p.phase}
              </span>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tools.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SubHead n="B.3" title="Junior portfolio screening checklist" />
          <Meter value={junior.set.size} max={juniorChecklist.length} label="Screening criteria met" />
          <ul className="mt-2">
            {juniorChecklist.map((h, i) => (
              <CheckRow key={h.id} index={i + 1} checked={junior.set.has(h.id)} onToggle={() => junior.toggle(h.id)} title={h.title} detail={h.detail} />
            ))}
          </ul>
        </div>
        <div>
          <SubHead n="B.4" title="Year one: IC1 → IC2" />
          <ol className="relative space-y-6 border-l border-line pl-6">
            {icGrowth.map((g, i) => (
              <li key={g.name} className="relative">
                <span aria-hidden className="absolute -left-[31px] top-0.5 grid size-3.5 place-items-center rounded-full border border-accent bg-paper">
                  <span className="size-1.5 rounded-full bg-accent" />
                </span>
                <p className="font-mono text-[11px] text-ink-3">Milestone {i + 1}</p>
                <h4 className="mt-1 font-medium text-ink">{g.name}</h4>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{g.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function SubHead({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="mb-5">
      <p className="font-mono text-[11px] text-accent-ink">{n}</p>
      <h3 className="mt-1 font-serif text-3xl leading-tight tracking-tight">{title}</h3>
      {note && <p className="prose-measure mt-2 text-sm text-ink-3">{note}</p>}
    </div>
  );
}

