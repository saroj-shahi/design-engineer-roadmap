import { useState, type CSSProperties } from "react";
import {
  adoptionShift,
  archetypes,
  handoffCases,
  heroMetrics,
  marketMetrics,
  orgFlattening,
  titleReality,
} from "../data/research";
import { ArchetypeVenn } from "../components/ArchetypeVenn";
import { HandoffFlow } from "../components/HandoffFlow";
import { HandoffPlate } from "../components/HandoffPlate";
import { HeroStage } from "../components/HeroStage";
import { ArchetypeGlyph, ArrowGlyph } from "../components/icons";
import { BasisBadge, CountUp, Disclosure, Eyebrow, Lines, Roll, TRACK_A_OPTION_KEY, Tag, useMediaQuery, useStoredChoice, useTabList, useTrack } from "../components/ui";

export function Hero() {
  return (
    <section id="shift" aria-labelledby="shift-title" className="relative">
      <div id="top" className="wrap pt-5 sm:pt-8">
        <div className="grid-12 mt-6 gap-y-10 sm:mt-10 lg:items-end">
          <div className="@container col-span-4 lg:col-span-5 lg:row-start-1">
            <Lines
              as="h1"
              id="shift-title"
              delay={150}
              className="hero-title text-ink"
              lines={["The handoff", "is shrinking.", <em className="text-accent">Design and code</em>, "now meet earlier."]}
            />
          </div>

          <div className="col-span-4 lg:col-span-5 lg:row-start-2">
            <p className="lede !max-w-[38ch] !text-ink" data-reveal style={{ "--d": "500ms" } as CSSProperties}>
              AI tools make it faster to turn a design into working code, so more designers now build alongside developers. This guide
              shows three roles growing out of that shift, and a six-month path into one.
            </p>
            <nav aria-label="Start here" className="mt-8 grid gap-4 sm:grid-cols-2" data-reveal style={{ "--d": "650ms" } as CSSProperties}>
              <EntryCard href="#/roles" who="I'm a designer" what="Find the role that fits you" />
              <EntryCard href="#/plan/b" who="I'm starting out" what="Start the beginner track" />
            </nav>
            <a href="#/ready" className="hit link-ul-static mt-6 inline-block text-[0.9375rem] font-medium text-ink" data-reveal style={{ "--d": "700ms" } as CSSProperties}>
              Or check if your portfolio is ready
            </a>
          </div>

          <div className="col-span-4 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center" data-reveal style={{ "--d": "350ms" } as CSSProperties}>
            <HeroStage />
          </div>
        </div>
      </div>

      {/* The short answer, then one index card per statistic */}
      <div className="wrap mt-24 sm:mt-32">
        {/* The question an anxious reader brings, answered before the hard numbers */}
        <div data-reveal className="card card-accent grid gap-y-6 lg:grid-cols-12">
          <p className="card-head label lg:col-span-12">
            <span>Is my job going away?</span>
          </p>
          <div className="px-5 sm:px-7 lg:col-span-4 lg:pb-7">
            <p className="numeral text-[clamp(4rem,8vw,7rem)] text-accent">+6%</p>
            <p className="mt-3 max-w-[30ch] text-sm leading-snug text-ink-2">US web & interface design jobs, 2025 → 2035</p>
            <p className="label mt-2 text-ink-3">US BLS projection</p>
          </div>
          <div className="px-5 pb-7 sm:px-7 lg:col-span-8 lg:pl-0 lg:pt-1">
            <p className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] tracking-tight text-ink">No, but it's changing.</p>
            <p className="mt-4 max-w-[58ch] leading-relaxed text-ink-2">
              Big-tech hiring for some design roles is down. But design jobs overall are still projected to grow, and half of designers
              already ship some AI-generated code. Your design skills still matter most; what's growing is demand for designers who can
              also work in code with developers. The rest of this guide shows how.
            </p>
            <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-ink-3">{titleReality}</p>
            <a href="#/roles" className="hit link-ul-static mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink group">
              See the three roles <ArrowGlyph />
            </a>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 sm:mt-10">
          {heroMetrics.map((m, i) => (
            <div
              key={m.label}
              data-reveal
              style={{ "--i": i } as CSSProperties}
              className="card card-lift flex min-h-[17rem] flex-col sm:min-h-[21rem]"
            >
              <dt className="order-3 mt-4 max-w-[26ch] px-4 text-sm leading-snug text-ink-2 sm:px-5">{m.label}</dt>
              <dd className="card-head label order-1">
                                <BasisBadge basis={m.basis} onBand />
              </dd>
              <dd className={`numeral order-2 mt-auto px-4 pt-8 text-[clamp(3rem,6vw,6.25rem)] sm:px-5 ${i === 0 ? "text-accent" : "text-ink"}`}>
                <CountUp value={m.value} />
              </dd>
              <dd className="card-foot label order-4 mt-5 text-ink-3 sm:px-5">{m.source}</dd>
            </div>
          ))}
        </dl>
      </div>

    </section>
  );
}

/** One of the two "start here" doors in the hero: a big, labelled tap target. */
function EntryCard({ href, who, what }: { href: string; who: string; what: string }) {
  return (
    <a href={href} className="card card-lift group flex flex-col">
      <span className="card-head label">{who}</span>
      <span className="flex items-center justify-between gap-3 px-4 py-4 font-display text-[1.375rem] font-medium leading-[1.1] tracking-tight text-ink sm:px-5 sm:py-5">
        {what}
        <ArrowGlyph />
      </span>
    </a>
  );
}

export function HandoffEconomics() {
  return (
    <div className="wrap py-24 sm:py-36">
      <div className="grid-12 gap-y-16">
        <div className="col-span-4 lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <Lines as="h2" className="display-l text-ink" lines={["Handoffs are", "the bottleneck."]} />
            <p className="mt-8 max-w-[42ch] leading-relaxed text-ink-2" data-reveal>
              Moving a design from Figma into code takes time, and details can get lost between tools. In Figma's 2025
              research, nearly all designers and developers said the handoff could be improved. Only 1 designer in 5 sees a first build that
              matches the design. The fix belongs in the process.
            </p>
            <div data-reveal className="mt-10 max-w-[440px]">
              <HandoffPlate />
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-24 sm:space-y-32 lg:col-span-7 lg:col-start-6">
          <HandoffFlow />

          {/* Evidence: opened on request so the page stays short */}
          <div className="border-t-2 border-edge [&>div]:border-b-0">
          <Disclosure summary="See the evidence: case studies and survey data">
          <div className="space-y-12 pt-2">
          <div className="space-y-8">
            {handoffCases.map((c, i) => (
              <article
                key={c.org}
                data-reveal
                style={{ "--i": i } as CSSProperties}
                className="card"
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
                Teams are getting flatter: more people per manager, and more senior hands-on roles that span design and code.
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
            <Disclosure summary="Every market figure, with scope and source">
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
          </Disclosure>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Archetypes() {
  const [sel, setSel] = useState(archetypes[0].id);
  const [, setTrack] = useTrack();
  const [, setOption] = useStoredChoice(TRACK_A_OPTION_KEY, "pde", ["pde", "meta"]);
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
    <div id="archetypes" className="wrap pb-24 pt-8 sm:pb-36 sm:pt-12">
      <header className="mb-12 pt-10 sm:mb-16">
        <div className="grid-12 gap-y-8">
          <Lines as="h1" id="roles-title" className="display-xl col-span-4 lg:col-span-7" lines={["Which role", <>fits <em>you?</em></>]} />
          <p data-reveal className="lede col-span-4 self-end lg:col-span-4 lg:col-start-9">
            Three roles are growing where design and code meet. Pick the one that sounds most like you to see what it does, and how
            to get there.
          </p>
        </div>
      </header>

      {/* Archetype cards: tab sticks out of each; the chosen one is pressed into the desk */}
      <div {...listProps} aria-label="Role archetypes" className="grid gap-x-6 gap-y-10 lg:grid-cols-3">
        {archetypes.map((x, i) => {
          const on = x.id === sel;
          return (
            <button
              key={x.id}
              {...tabProps(x.id, i)}
              className={`card card-lift group flex flex-col p-5 text-left sm:min-h-[17rem] sm:p-6 ${on ? "card-on" : ""}`}
            >
              <ArchetypeGlyph id={x.id} on={on} className={`glyph-xl !size-20 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`} />
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
        <div className="flex flex-col gap-5 border-b-2 border-dashed border-edge bg-accent-soft px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[60ch] font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15] tracking-tight text-ink">
            <span className="text-accent-ink">This fits you if</span> {a.fitsIf}
          </p>
          <a
            href={`#/plan/a/${a.plan}`}
            onClick={() => {
              setTrack("a");
              setOption(a.plan);
            }}
            className="btn group shrink-0"
          >
            <Roll>See the plan for this role</Roll>
            <ArrowGlyph />
          </a>
        </div>
        <div className="grid-12 stagger gap-y-10 px-5 py-8 sm:px-8 sm:py-10">
        <div className="col-span-4 lg:col-span-5" style={{ "--i": 0 } as CSSProperties}>
          <Eyebrow>Core deliverable & scope</Eyebrow>
          <p className="font-display text-[1.75rem] leading-[1.15] tracking-tight text-ink">{a.deliverable}</p>
        </div>
        <div className="col-span-4 lg:col-span-3 lg:col-start-7" style={{ "--i": 1 } as CSSProperties}>
          <Eyebrow>Search job boards for</Eyebrow>
          <ul className="mb-8 flex flex-wrap gap-1.5">
            {a.aka.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
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

      {/* The overlap map, for readers who want it */}
      <div className="mt-12 border-t-2 border-edge [&>div]:border-b-0">
        <Disclosure summary="How the three roles overlap">
          <ArchetypeVenn selected={sel} />
        </Disclosure>
      </div>
    </div>
  );
}
