import { useState } from "react";
import {
  adoptionShift,
  archetypes,
  handoffCases,
  heroMetrics,
  marketMetrics,
  orgFlattening,
} from "../data/research";
import { BasisBadge, Disclosure, Eyebrow, SectionHeader, Tag } from "../components/ui";

export function Hero() {
  return (
    <section id="shift" aria-labelledby="shift-title">
      <div id="top" className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-24 lg:px-8">
        {/* Masthead */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-ink-3">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            Field guide · 2026 edition
          </span>
          <span aria-hidden>/</span>
          <span>Product Designer → Design Engineer, Meta-Designer, AX</span>
        </div>

        <h1 id="shift-title" className="mt-8 max-w-4xl font-serif text-[clamp(2.75rem,7vw,5.75rem)] leading-[0.95] tracking-tight text-ink">
          The handoff collapsed.
          <br />
          <span className="italic text-accent">Builders</span> took its place.
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <p className="prose-measure text-lg leading-relaxed text-ink-2 lg:col-span-7">
            AI made writing interface code fast and cheap. Human-to-human design-to-engineering handoffs stayed slow and
            expensive. That gap is splitting the monolithic Product Designer into hybrid roles that own the code diff, encode
            the system, or orchestrate the agent.
          </p>
          <div className="flex items-end gap-3 lg:col-span-5 lg:justify-end">
            <a href="#roadmap" className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85">
              Pick your roadmap <span aria-hidden>→</span>
            </a>
            <a href="#readiness" className="inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink">
              Self-assess
            </a>
          </div>
        </div>

        {/* Data strip */}
        <dl className="mt-14 grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
          {heroMetrics.map((m) => (
            <div key={m.label} className="flex flex-col border-b border-r border-line bg-surface/60 p-4 sm:p-6">
              <dt className="order-2 mt-2 text-sm leading-snug text-ink-2">{m.label}</dt>
              <dd className="order-1 font-serif text-5xl leading-none tracking-tight text-ink tabular sm:text-6xl">{m.value}</dd>
              <dd className="order-3 mt-auto pt-4 font-mono text-[10px] uppercase tracking-wider text-ink-3">{m.source}</dd>
            </div>
          ))}
        </dl>
      </div>

      <HandoffEconomics />
      <Archetypes />
    </section>
  );
}

function HandoffEconomics() {
  const maxBefore = 100;
  return (
    <div className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>01.a · Economics of handoff collapse</Eyebrow>
            <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
              Handoffs are the bottleneck. Removing them shows up in cycle time.
            </h2>
            <p className="prose-measure mt-4 leading-relaxed text-ink-2">
              Nearly all designers and developers in Figma's 2025 research name handoff as a primary bottleneck; 50% of developers
              cite mismatched design assumptions. Only 20% of designers see first builds match their designs. Another 25% get there
              only after repeated rework.
            </p>

            <div className="mt-8 space-y-6">
              {handoffCases.map((c) => (
                <div key={c.org} className="rounded-md border border-line bg-surface p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-medium">{c.org}</h3>
                    <BasisBadge basis="case" />
                  </div>
                  <p className="mt-1 text-sm text-ink-3">{c.what}</p>
                  <dl className="mt-4 grid gap-3">
                    {c.stats.map((s) => (
                      <div key={s.label} className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                        <dt className="text-sm text-ink-2">{s.label}</dt>
                        <dd className="font-mono text-sm tabular">
                          {s.from && (
                            <>
                              <span className="text-ink-3 line-through decoration-line-strong">{s.from}</span>
                              <span aria-hidden className="mx-1.5 text-ink-3">→</span>
                              <span className="sr-only"> to </span>
                            </>
                          )}
                          <span className="font-medium text-accent-ink">{s.to}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Eyebrow>AI adoption: divergence, then convergence</Eyebrow>
            <div className="grid gap-8 sm:grid-cols-2">
              {[adoptionShift.before, adoptionShift.after].map((g, gi) => (
                <figure key={g.label}>
                  <figcaption className="mb-4 flex items-center gap-2 font-mono text-xs text-ink-3">
                    <span className={`size-2 rounded-full ${gi === 0 ? "bg-line-strong" : "bg-accent"}`} aria-hidden />
                    {g.label}
                  </figcaption>
                  <ul className="space-y-4">
                    {g.rows.map((r) => (
                      <li key={r.who}>
                        <div className="flex items-baseline justify-between gap-3 text-sm">
                          <span className="text-ink-2">{r.who}</span>
                          <span className="font-mono tabular text-ink">{r.value}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 rounded-full bg-sunken" aria-hidden>
                          <div
                            className={`h-full rounded-full ${gi === 0 ? (r.who.startsWith("Dev") ? "bg-ink-3" : "bg-line-strong") : "bg-accent"}`}
                            style={{ width: `${(r.value / maxBefore) * 100}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </figure>
              ))}
            </div>

            <div className="mt-10 rounded-md border border-line">
              <div className="border-b border-line px-5 py-3">
                <Eyebrow>Org-chart flattening</Eyebrow>
                <p className="-mt-1 text-sm text-ink-2">
                  Coordination roles compress into senior “Super ICs” and unified “Product Builder” roles.
                </p>
              </div>
              <dl className="grid grid-cols-3 divide-x divide-line">
                {orgFlattening.map((o) => (
                  <div key={o.label} className="flex flex-col p-4 sm:p-5">
                    <dt className="order-2 mt-1 text-xs leading-snug text-ink-2 sm:text-sm">{o.label}</dt>
                    <dd className="order-1 font-serif text-3xl tabular sm:text-4xl">{o.value}</dd>
                    <dd className="order-3 mt-2 font-mono text-[10px] text-accent-ink">{o.delta}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6">
              <Disclosure summary="All market metrics, with scope and source" meta={<Tag>{marketMetrics.length} rows</Tag>}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <caption className="sr-only">Industry metrics 2025–2026</caption>
                    <thead>
                      <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-ink-3">
                        <th scope="col" className="py-2 pr-4 font-normal">Figure</th>
                        <th scope="col" className="py-2 pr-4 font-normal">Metric</th>
                        <th scope="col" className="py-2 pr-4 font-normal">Scope</th>
                        <th scope="col" className="py-2 font-normal">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketMetrics.map((m) => (
                        <tr key={m.label} className="border-b border-line last:border-0 align-top">
                          <td className="whitespace-nowrap py-3 pr-4 font-mono tabular text-ink">{m.value}</td>
                          <td className="py-3 pr-4 text-ink-2">{m.label}</td>
                          <td className="py-3 pr-4 text-ink-3">{m.scope}</td>
                          <td className="py-3 text-ink-3">{m.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Archetypes() {
  const [sel, setSel] = useState(archetypes[0].id);
  const a = archetypes.find((x) => x.id === sel)!;
  return (
    <div className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeader
          id="archetypes"
          index="01.b"
          kicker="Three emerging archetypes"
          title={
            <>
              One role, split <span className="italic">three ways.</span>
            </>
          }
          lede="As static artifact handoffs decline, the Product Designer is specializing. Select an archetype to compare its deliverable, market signal, and skill differentiators."
        />

        <div role="tablist" aria-label="Role archetypes" className="grid gap-3 md:grid-cols-3">
          {archetypes.map((x, i) => {
            const on = x.id === sel;
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                id={`arch-tab-${x.id}`}
                aria-selected={on}
                aria-controls={`arch-panel-${x.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setSel(x.id)}
                onKeyDown={(e) => {
                  const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
                  if (!d) return;
                  e.preventDefault();
                  const n = archetypes[(i + d + archetypes.length) % archetypes.length];
                  setSel(n.id);
                  document.getElementById(`arch-tab-${n.id}`)?.focus();
                }}
                className={`group relative rounded-md border p-5 text-left transition-all duration-200 ${
                  on ? "border-ink bg-surface shadow-[0_1px_0_var(--line-strong)]" : "border-line bg-transparent hover:border-line-strong hover:bg-surface/60"
                }`}
              >
                <span className="flex items-center justify-between font-mono text-[11px] text-ink-3">
                  <span>0{i + 1}</span>
                  <span className={`transition-colors ${on ? "text-accent-ink" : ""}`}>{x.short}</span>
                </span>
                <span className="mt-6 block font-serif text-2xl leading-tight text-ink">{x.name}</span>
                <span className="mt-1 block text-sm text-ink-3">{x.focus}</span>
                <span aria-hidden className={`absolute inset-x-5 bottom-0 h-0.5 bg-accent transition-transform duration-300 origin-left ${on ? "scale-x-100" : "scale-x-0"}`} />
              </button>
            );
          })}
        </div>

        <div role="tabpanel" id={`arch-panel-${a.id}`} aria-labelledby={`arch-tab-${a.id}`} tabIndex={0} key={a.id} className="fade-in mt-3 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
          <div className="bg-surface p-6">
            <Eyebrow>Core deliverable & scope</Eyebrow>
            <p className="leading-relaxed text-ink">{a.deliverable}</p>
          </div>
          <div className="bg-surface p-6">
            <Eyebrow>Market signal</Eyebrow>
            <p className="leading-relaxed text-ink">{a.signals}</p>
          </div>
          <div className="bg-surface p-6">
            <Eyebrow>Skill differentiators</Eyebrow>
            {a.skillStats ? (
              <>
                <ul className="space-y-3">
                  {a.skillStats.map((s) => (
                    <li key={s.label}>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink-2">{s.label}</span>
                        <span className="font-mono tabular">{s.value}%</span>
                      </div>
                      <div className="mt-1 h-1 rounded-full bg-sunken" aria-hidden>
                        <div className="h-full rounded-full bg-accent" style={{ width: `${s.value}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-[10px] text-ink-3">Share of Design Engineer listings requiring each. Git workflows also cited.</p>
              </>
            ) : (
              <ul className="flex flex-wrap gap-1.5">
                {a.skills.map((s) => (
                  <li key={s}>
                    <Tag>{s}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

