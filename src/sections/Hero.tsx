import { type CSSProperties } from "react";
import {
  archetypes,
  handoffCases,
  heroMetrics,
  marketMetrics,
  orgFlattening,
  titleReality,
} from "../data/research";
import { AdoptionDumbbell } from "../components/AdoptionDumbbell";
import { ArchetypeVenn } from "../components/ArchetypeVenn";
import { HandoffFlow } from "../components/HandoffFlow";
import { HandoffPlate } from "../components/HandoffPlate";
import { HeroStage } from "../components/HeroStage";
import { MarketShiftChart } from "../components/MarketShiftChart";
import { ArchetypeGlyph, ArrowGlyph, Glyph, type GlyphName } from "../components/icons";

const heroMetricGlyphs: GlyphName[] = ["trendDown", "shareBar", "survey", "forecast"];
import { BasisBadge, CountUp, Disclosure, Eyebrow, Lines, Roll, Tag, jumpTo, navigate, pageHref, useMediaQuery, useTabList } from "../components/ui";

export function Hero() {
  return (
    <section id="shift" aria-labelledby="shift-title" className="relative">
      <div id="top" className="wrap pt-8 sm:pt-12 lg:pt-14">
        <div className="grid-12 gap-y-10 lg:items-center">
          <div className="col-span-4 flex flex-col gap-7 lg:col-span-5">
            <div className="@container">
              <h1 id="shift-title" className="hero-title text-ink">
                <span className="block">The handoff</span>
                <span className="block">is shrinking.</span>
                <span className="block"><em className="text-accent-ink">Design and code</em></span>
                <span className="block">now meet earlier.</span>
              </h1>
              <p className="lede mt-6 max-w-[40ch] text-ink sm:mt-7">
                AI tools make it faster to turn a design into working code, so more designers now build alongside developers. Whether you're
                upskilling in your current role or aiming for a new one, this guide maps three paths and a six-month plan.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => jumpTo("start-here")}
                className="btn group"
              >
                <span>Choose your path</span>
                <span aria-hidden className="font-mono text-sm transition-transform duration-300 motion-safe:group-hover:translate-y-0.5">↓</span>
              </button>
            </div>
          </div>

          <div className="col-span-4 lg:col-span-7">
            <HeroStage />
          </div>
        </div>
      </div>

      {/* Dedicated starting-point section below the hero */}
      <div id="start-here" className="wrap mt-16 scroll-mt-32 sm:mt-24">
        <div className="border-t-2 border-edge pt-8 sm:pt-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label text-accent-ink">Start here</p>
              <h2 className="display-l mt-2 text-ink">
                Where are you <em>starting from?</em>
              </h2>
            </div>
            <a href="#/ready" className="hit group link-ul-static inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
              <span>Or open the readiness checklist</span>
              <ArrowGlyph />
            </a>
          </div>

          <nav aria-label="Start here" className="grid gap-6 md:grid-cols-2">
            <EntryCard
              href="#/roles"
              who="I'm a working designer"
              meta="Track A · 6 months"
              what="Upskill in your role, or grow into a hybrid one"
              detail="Compare Design Engineer, Meta-Designer and AX Designer, then follow a six-month plan from browser basics to real pull requests — at your current company or your next one."
              tools={["Figma", "React", "TypeScript", "Tailwind CSS", "Cursor", "Claude Code"]}
              cta="Explore the three roles"
            />
            <EntryCard
              href="#/plan/b"
              who="I'm starting out"
              meta="Track B · 4 stages"
              what="Start the beginner track"
              detail="Build your UX and Product Design base first, prototype in real code, ship for real users and aim at teams hiring juniors."
              tools={["Figma", "Claude Design", "HTML5", "React", "Tailwind CSS", "Cursor"]}
              cta="Open the beginner plan"
            />
          </nav>
        </div>
      </div>

      {/* The short answer, then one index card per statistic */}
      <div className="wrap mt-20 sm:mt-28">
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
              className="card group flex min-h-[17rem] flex-col sm:min-h-[21rem]"
            >
              <dt className="order-4 mt-4 flex-1 max-w-[26ch] px-4 text-sm leading-snug text-pretty text-ink-2 sm:px-5">{m.label}</dt>
              <dd className="card-head label order-1">
                <BasisBadge basis={m.basis} onBand />
              </dd>
              <dd aria-hidden="true" className="order-2 flex items-center justify-between px-4 pt-5 sm:px-5 sm:pt-6">
                <Glyph name={heroMetricGlyphs[i] ?? "survey"} className="glyph-xl size-11 text-ink sm:size-12" />
              </dd>
              <dd className={`numeral order-3 mt-auto px-4 pt-6 text-[clamp(3rem,6vw,6.25rem)] sm:px-5 ${i === 0 ? "text-accent" : "text-ink"}`}>
                <CountUp value={m.value} />
              </dd>
              <dd className="card-foot label order-5 mt-5 flex min-h-[3.5rem] items-center text-ink-3 sm:px-5">{m.source}</dd>
            </div>
          ))}
        </dl>

        <MarketShiftChart />
      </div>

    </section>
  );
}

/** One of the two "start here" doors below the hero: a spacious, labelled entry card. */
function EntryCard({
  href,
  who,
  meta,
  what,
  detail,
  tools,
  cta,
}: {
  href: string;
  who: string;
  meta: string;
  what: string;
  detail: string;
  tools: string[];
  cta: string;
}) {
  return (
    <a href={href} className="card card-lift group flex h-full flex-col">
      <span className="card-head label">
        <span className="inline-flex items-center gap-1.5">
          <Glyph name="user" className="!size-3.5 [--accent:currentColor]" />
          <span>{who}</span>
        </span>
        <span>{meta}</span>
      </span>
      <span className="flex flex-1 flex-col p-6 sm:p-8">
        <span className="display-m text-ink">{what}</span>
        <span className="mt-3 max-w-[48ch] text-sm leading-relaxed text-ink-2">{detail}</span>
        <span className="mt-5 flex flex-wrap gap-1.5">
          {tools.map((tool) => (
            <Tag key={tool}>{tool}</Tag>
          ))}
        </span>
        <span className="mt-auto block pt-6">
          <span className="label flex items-center justify-between gap-3 border-t border-line pt-4 text-accent-ink">
            <span>{cta}</span>
            <ArrowGlyph className="shrink-0 text-ink" />
          </span>
        </span>
      </span>
    </a>
  );
}

export function HandoffEconomics() {
  return (
    <div className="wrap pb-24 sm:pb-36">
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
                  <h4 className="display-m">{c.org}</h4>
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
          <AdoptionDumbbell />

          {/* Org flattening */}
          <div data-reveal className="card">
            <h4 className="card-head label">Org-chart flattening</h4>
            <div className="px-5 pb-6 pt-5 sm:px-7">
              <p className="max-w-[52ch] text-sm text-ink-2">
                Teams are getting flatter: more people per manager, and more senior hands-on roles that span design and code.
              </p>
            <dl className="mt-6 grid grid-cols-3 border-t border-line">
              {orgFlattening.map((o, i) => (
                <div key={o.label} className={`flex flex-col pt-5 px-3 sm:px-5 first:pl-0 last:pr-0 ${i > 0 ? "border-l border-line" : ""}`}>
                  <dt className="order-2 mt-3 text-xs leading-snug text-ink-2 sm:text-sm">{o.label}</dt>
                  <dd className="numeral order-1 text-[clamp(2.5rem,4.5vw,4rem)]">{o.value}</dd>
                  <dd className="label order-3 mt-3 text-accent-ink">{o.delta}</dd>
                </div>
              ))}
            </dl>
            </div>
          </div>

          <div className="card px-5 sm:px-7 [&>div]:border-b-0">
            <Disclosure headingLevel="h4" summary="Every market figure, with scope and source">
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

export function Archetypes({ role }: { role?: string }) {
  const sel = archetypes.find((x) => x.id === role)?.id ?? archetypes[0].id;
  const a = archetypes.find((x) => x.id === sel)!;
  const isLg = useMediaQuery("(min-width: 1024px)");
  const { listProps, tabProps, panelProps } = useTabList({
    ids: archetypes.map((x) => x.id),
    value: sel,
    onChange: (id) => navigate(pageHref("roles", id), { replace: true }),
    idPrefix: "arch",
    orientation: isLg ? "horizontal" : "vertical",
  });
  return (
    <div id="archetypes" className="wrap pb-24 pt-8 sm:pb-36 sm:pt-12">
      <header className="mb-12 pt-10 sm:mb-16">
        <div className="grid-12 gap-y-8">
          <Lines as="h1" id="roles-title" className="display-xl col-span-4 lg:col-span-7" lines={["Which role", <>fits <em>you?</em></>]} />
          <p data-reveal className="lede col-span-4 self-end lg:col-span-4 lg:col-start-9">
            Three directions are growing where design and code meet. You don't need a new title to work this way — pick the one that fits
            your team or where you want to grow.
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
              {on && <span className="label mb-3 text-accent-ink">✓ Selected</span>}
              <ArchetypeGlyph id={x.id} on={on} className={`glyph-xl !size-20 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`} />
              <span className={`display-m mt-auto pt-6 transition-colors sm:pt-10 duration-300 ${on ? "text-ink" : "text-ink-2 group-hover:text-ink"}`}>{x.name}</span>
              <span className="mt-3 text-sm text-ink-2">{x.focus}</span>
              <span className="label mt-5 flex items-center gap-1.5 border-t border-line pt-3 text-ink-3">
                <Glyph name="user" className="!size-3.5 text-ink-2" />
                <span>{x.short}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div {...panelProps(a.id)} key={a.id} className="card mt-10 focus-visible:outline-offset-8">
        <p className="card-head label">
          <span className="inline-flex items-center gap-1.5">
            <Glyph name="user" className="!size-3.5 [--accent:currentColor]" />
            <span>{a.name}</span>
          </span>
          <span className="hidden sm:inline">{a.short}</span>
        </p>
        <div className="flex flex-col gap-5 border-b-2 border-dashed border-edge bg-accent-soft px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[60ch] font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15] tracking-tight text-ink">
            <span className="text-accent-ink">This fits you if</span> {a.fitsIf}
          </p>
          <div className="flex shrink-0 flex-col items-start gap-3">
          <a
            href={`#/plan/a/${a.plan}`}
            className="btn group"
          >
            <Roll>See the plan for this role</Roll>
            <ArrowGlyph />
          </a>
          <a href="#/plan/b/s1" className="hit link-ul-static inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
            Starting out? See the beginner plan <ArrowGlyph />
          </a>
          </div>
        </div>
        <div className="grid-12 stagger gap-y-10 px-5 py-8 sm:px-8 sm:py-10">
        <div className="col-span-4 lg:col-span-5" style={{ "--i": 0 } as CSSProperties}>
          <Eyebrow>Core deliverable & scope</Eyebrow>
          <p className="font-display text-[1.75rem] leading-[1.15] tracking-tight text-ink">{a.deliverable}</p>
        </div>
        <div className="col-span-4 lg:col-span-3 lg:col-start-7" style={{ "--i": 1 } as CSSProperties}>
          <Eyebrow>Common titles</Eyebrow>
          <ul className="mb-8 flex flex-wrap gap-1.5">
            {a.aka.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
          <Eyebrow>Market signal</Eyebrow>
          <p className="leading-relaxed text-ink-2">{a.signals}</p>
          {a.id === "de" && (
            <ul aria-label="Companies hiring Design Engineers" className="mt-4 flex flex-wrap gap-1.5">
              {["Vercel", "Cursor", "Replit", "Linear", "Lovable", "Raycast", "Profound"].map((co) => (
                <li key={co}>
                  <Tag>{co}</Tag>
                </li>
              ))}
            </ul>
          )}
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
        <Disclosure headingLevel="h2" summary="How the three roles overlap">
          <ArchetypeVenn selected={sel} />
        </Disclosure>
      </div>
    </div>
  );
}
