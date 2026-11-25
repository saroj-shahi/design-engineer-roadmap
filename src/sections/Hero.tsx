import { useState, type CSSProperties } from "react";
import {
  adoptionShift,
  archetypes,
  handoffCases,
  heroMetrics,
  marketMetrics,
  orgFlattening,
  patternCategories,
  sources,
} from "../data/research";
import { ArchetypeVenn } from "../components/ArchetypeVenn";
import { HandoffFlow } from "../components/HandoffFlow";
import { HandoffPlate } from "../components/HandoffPlate";
import { HeroStage } from "../components/HeroStage";
import { ArchetypeGlyph, ArrowGlyph } from "../components/icons";
import { BasisBadge, CountUp, Disclosure, Eyebrow, FolderTab, Lines, Magnetic, Roll, Tag, useMediaQuery, useTabList } from "../components/ui";

const patternCount = patternCategories.reduce((n, c) => n + c.patterns.length, 0);

export function Hero() {
  return (
    <section id="shift" aria-labelledby="shift-title" className="relative">
      <div id="top" className="wrap pt-5 sm:pt-8">
        {/* Running head */}
        <div className="grid-12 label gap-y-2 text-ink-3" data-reveal>
          <p className="col-span-1 text-accent-ink lg:col-span-2">[00]</p>
          <p className="col-span-3 text-ink lg:col-span-4">Product Designer → Design Engineer, Meta-Designer, AX</p>
          <p className="hidden lg:col-span-3 lg:block">Vol. 01 — November 2026</p>
          <p className="hidden text-right lg:col-span-3 lg:block">Six chapters</p>
        </div>

        <div className="grid-12 mt-10 gap-y-10 sm:mt-14 lg:items-end">
          <div className="col-span-4 lg:col-span-5 lg:row-start-1">
            <Lines
              as="h1"
              id="shift-title"
              delay={150}
              className="hero-title text-ink"
              lines={["The handoff", "is gone.", <em className="text-accent">Builders</em>, "took its place."]}
            />
          </div>

          <div className="col-span-4 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center" data-reveal style={{ "--d": "350ms" } as CSSProperties}>
            <HeroStage />
          </div>

          <div className="col-span-4 lg:col-span-5 lg:row-start-2">
            <p className="lede !max-w-[38ch] !text-ink" data-reveal style={{ "--d": "500ms" } as CSSProperties}>
              AI made interface code cheap to write, so the people who design now ship it too. This guide shows the three roles that
              came out of that shift, and a six-month path into one.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5" data-reveal style={{ "--d": "650ms" } as CSSProperties}>
              <Magnetic>
                <a href="#roadmap" className="btn group">
                  <Roll>Find your path</Roll>
                  <ArrowGlyph />
                </a>
              </Magnetic>
              <a href="#readiness" className="hit link-ul-static text-[0.9375rem] font-medium text-ink">
                Check your portfolio
              </a>
            </div>
            <p className="label mt-9 flex flex-wrap gap-x-4 gap-y-1 text-ink-3" data-reveal style={{ "--d": "750ms" } as CSSProperties}>
              <span>06 chapters</span>
              <span aria-hidden>·</span>
              <span>{patternCount} named patterns</span>
              <span aria-hidden>·</span>
              <span>{sources.length} sources</span>
              <span aria-hidden>·</span>
              <span>Rev. 2026.11</span>
            </p>
          </div>
        </div>
      </div>

      {/* Figures: one index card per statistic */}
      <div className="wrap mt-24 sm:mt-32">
        <dl className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {heroMetrics.map((m, i) => (
            <div
              key={m.label}
              data-reveal
              style={{ "--i": i } as CSSProperties}
              className="card card-lift flex min-h-[17rem] flex-col sm:min-h-[21rem]"
            >
              <dt className="order-3 mt-4 max-w-[26ch] px-4 text-sm leading-snug text-ink-2 sm:px-5">{m.label}</dt>
              <dd className="card-head label order-1">
                <span>Fig. 0{i + 1}</span>
                {i === 0 && <span>Lead</span>}
              </dd>
              <dd className={`numeral order-2 mt-auto px-4 pt-8 text-[clamp(3rem,6vw,6.25rem)] sm:px-5 ${i === 0 ? "text-accent" : "text-ink"}`}>
                <CountUp value={m.value} />
              </dd>
              <dd className="card-foot label order-4 mt-5 text-ink-3 sm:px-5">{m.source}</dd>
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
  return (
    <div className="wrap py-24 sm:py-36">
      <div className="grid-12 gap-y-16">
        <div className="col-span-4 lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <Eyebrow className="text-accent-ink">[01.a] — Economics of handoff collapse</Eyebrow>
            <Lines as="h2" className="display-l text-ink" lines={["Handoffs are", "the bottleneck."]} />
            <p className="mt-8 max-w-[42ch] leading-relaxed text-ink-2" data-reveal>
              Nearly every designer and developer in Figma's 2025 research names handoff as a primary bottleneck. Half the
              developers cite mismatched design assumptions. One designer in five sees a first build that matches the design;
              another quarter get there only after repeated rework.
            </p>
            <div data-reveal className="mt-10 max-w-[440px]">
              <HandoffPlate />
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-24 lg:col-span-7 lg:col-start-6">
          <HandoffFlow />

          {/* Case studies */}
          {/* Case cards stack as you scroll (desktop) */}
          <div className="space-y-8">
            {handoffCases.map((c, i) => (
              <article
                key={c.org}
                data-reveal
                style={{ "--i": i } as CSSProperties}
                className="card lg:sticky lg:top-[calc(2rem+var(--i)*16px)]"
              >
                <p className="card-head label">
                  <span>Case 0{i + 1}</span>
                  <span>Before → after</span>
                </p>
                <div className="px-5 pb-7 pt-5 sm:px-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="display-m">{c.org}</h3>
                  <BasisBadge basis="case" />
                </div>
                <p className="mt-2 text-sm text-ink-3">{c.what}</p>
                <dl className="mt-8 grid gap-8 sm:grid-cols-2">
                  {c.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="label text-ink-3">{s.label}</dt>
                      <dd className="mt-3 flex items-baseline gap-3">
                        {s.from && (
                          <>
                            <span className="numeral text-4xl text-ink-3 line-through decoration-1">{s.from}</span>
                            <span aria-hidden className="font-mono text-ink-3">→</span>
                            <span className="sr-only"> to </span>
                          </>
                        )}
                        <span className="numeral text-[clamp(3rem,5vw,4.5rem)] text-accent">{s.to}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                </div>
              </article>
            ))}
          </div>

          {/* Adoption */}
          <div className="card">
            <div className="card-head label">
              <h3>AI adoption: divergence, then convergence</h3>
              <span className="hidden sm:block">% of respondents</span>
            </div>
            <div className="grid gap-12 px-5 py-7 sm:grid-cols-2 sm:gap-8 sm:px-7">
              {[adoptionShift.before, adoptionShift.after].map((g, gi) => (
                <figure key={g.label}>
                  <figcaption className="label mb-6 flex items-center gap-2 text-ink-3">
                    <span aria-hidden className={`tick ${gi === 0 ? "text-ink-3" : "text-accent"}`} />
                    {g.label}
                  </figcaption>
                  <ul className="space-y-6">
                    {g.rows.map((r, ri) => (
                      <li key={r.who} data-reveal="bar" style={{ "--i": ri } as CSSProperties}>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-sm leading-snug text-ink-2">{r.who}</span>
                          <span className="numeral text-3xl text-ink">{r.value}</span>
                        </div>
                        <div className="bar-track mt-2" aria-hidden>
                          <span className={`bar-fill ${gi === 1 ? "!bg-accent" : ""}`} style={{ width: `${r.value}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </figure>
              ))}
            </div>
          </div>

          {/* Org flattening */}
          <div data-reveal className="card">
            <h3 className="card-head label">Org-chart flattening</h3>
            <div className="px-5 pb-6 pt-5 sm:px-7">
              <p className="max-w-[52ch] text-sm text-ink-2">
                Coordination roles compress into senior “Super ICs” and unified “Product Builder” roles.
              </p>
            <dl className="mt-6 grid grid-cols-3 border-t border-line">
              {orgFlattening.map((o, i) => (
                <div key={o.label} className={`flex flex-col pt-5 ${i > 0 ? "border-l border-line pl-3 sm:pl-5" : "pr-3"}`}>
                  <dt className="order-2 mt-3 text-xs leading-snug text-ink-2 sm:text-sm">{o.label}</dt>
                  <dd className="numeral order-1 text-[clamp(2.5rem,4.5vw,4rem)]">{o.value}</dd>
                  <dd className="label order-3 mt-3 text-accent-ink">{o.delta}</dd>
                </div>
              ))}
            </dl>
            </div>
          </div>

          <div className="card px-5 sm:px-7 [&>div]:border-b-0">
            <Disclosure summary="Every market figure, with scope and source" meta={<Tag>{marketMetrics.length} rows</Tag>}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <caption className="sr-only">Industry metrics 2025–2026</caption>
                  <thead>
                    <tr className="label border-b border-ink text-ink-3">
                      <th scope="col" className="py-3 pr-4 font-normal">Figure</th>
                      <th scope="col" className="py-3 pr-4 font-normal">Metric</th>
                      <th scope="col" className="py-3 pr-4 font-normal">Scope</th>
                      <th scope="col" className="py-3 font-normal">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketMetrics.map((m) => (
                      <tr key={m.label} className="border-b border-line align-top last:border-0">
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
  );
}

function Archetypes() {
  const [sel, setSel] = useState(archetypes[0].id);
  const a = archetypes.find((x) => x.id === sel)!;
  const isLg = useMediaQuery("(min-width: 1024px)");
  const { listProps, tabProps, panelProps } = useTabList({
    ids: archetypes.map((x) => x.id),
    value: sel,
    onChange: setSel,
    idPrefix: "arch",
    orientation: isLg ? "horizontal" : "vertical",
  });
  return (
    <div className="wrap pb-24 sm:pb-36">
      <header className="mb-14 pt-10 sm:mb-20">
        <FolderTab index="01.b">
          <p className="label text-ink">Three emerging archetypes</p>
        </FolderTab>
        <div className="grid-12 mt-10 gap-y-8 sm:mt-14">
          <Lines as="h2" id="archetypes-title" className="display-xl col-span-4 lg:col-span-7" lines={["One role,", <>split <em>three ways.</em></>]} />
          <p data-reveal className="lede col-span-4 self-end lg:col-span-4 lg:col-start-9">
            Static handoffs are fading, so the generalist is specialising. Pick an archetype to see what it ships, where it is
            hiring, and what sets it apart.
          </p>
        </div>
      </header>

      <div className="mb-20 sm:mb-28">
        <ArchetypeVenn selected={sel} />
      </div>

      {/* Archetype cards: tab sticks out of each; the chosen one is pressed into the desk */}
      <div {...listProps} aria-label="Role archetypes" className="grid gap-x-6 gap-y-10 pt-7 lg:grid-cols-3">
        {archetypes.map((x, i) => {
          const on = x.id === sel;
          return (
            <button
              key={x.id}
              {...tabProps(x.id, i)}
              className={`card card-lift group flex flex-col p-5 text-left sm:min-h-[17rem] sm:p-6 ${on ? "card-on" : ""}`}
            >
              <span className="card-tab label tabular">0{i + 1}</span>
              <span className="flex items-start justify-between gap-4">
                <ArchetypeGlyph id={x.id} on={on} className={`glyph-xl !size-20 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`} />
                <span className={`label ${on ? "text-accent-ink" : "text-ink-3"}`}>{on ? "Open ↓" : "Pick"}</span>
              </span>
              <span className={`display-m mt-auto pt-6 transition-colors sm:pt-10 duration-300 ${on ? "text-ink" : "text-ink-2 group-hover:text-ink"}`}>{x.name}</span>
              <span className="mt-3 text-sm text-ink-2">{x.focus}</span>
              <span className="label mt-5 border-t border-line pt-3 text-ink-3">{x.short}</span>
            </button>
          );
        })}
      </div>

      <div {...panelProps(a.id)} key={a.id} className="card mt-10 focus-visible:outline-offset-8">
        <p className="card-head label">
          <span>{a.name}</span>
          <span className="hidden sm:inline">{a.short}</span>
        </p>
        <div className="grid-12 stagger gap-y-10 px-5 py-8 sm:px-8 sm:py-10">
        <div className="col-span-4 lg:col-span-5" style={{ "--i": 0 } as CSSProperties}>
          <Eyebrow>Core deliverable & scope</Eyebrow>
          <p className="font-display text-[1.75rem] leading-[1.15] tracking-tight text-ink">{a.deliverable}</p>
        </div>
        <div className="col-span-4 lg:col-span-3 lg:col-start-7" style={{ "--i": 1 } as CSSProperties}>
          <Eyebrow>Market signal</Eyebrow>
          <p className="leading-relaxed text-ink-2">{a.signals}</p>
        </div>
        <div className="col-span-4 lg:col-span-3 lg:col-start-10" style={{ "--i": 2 } as CSSProperties}>
          <Eyebrow>Skill differentiators</Eyebrow>
          {a.skillStats ? (
            <>
              <ul className="space-y-5">
                {a.skillStats.map((s) => (
                  <li key={s.label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-ink-2">{s.label}</span>
                      <span className="numeral text-2xl">{s.value}%</span>
                    </div>
                    <div className="bar-track mt-1.5" aria-hidden>
                      <span className="bar-fill !bg-accent" style={{ width: `${s.value}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="label mt-5 !normal-case !tracking-normal text-ink-3">Share of Design Engineer listings requiring each. Git workflows also cited.</p>
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
