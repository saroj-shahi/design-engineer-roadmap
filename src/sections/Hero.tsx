import { useEffect, type CSSProperties, type ReactNode } from "react";
import {
  archetypes,
  forLeads,
  handoffCases,
  handoffFindings,
  heroMetrics,
  marketMetrics,
  orgFlattening,
  skipAheadMonth,
  startAudience,
  titleReality,
} from "../data/research";
import { AdoptionDumbbell } from "../components/AdoptionDumbbell";
import { ArchetypeVenn } from "../components/ArchetypeVenn";
import { HandoffFlow } from "../components/HandoffFlow";
import { HeroStage } from "../components/HeroStage";
import { ArchetypeGlyph, ArrowGlyph, Glyph, type GlyphName } from "../components/icons";

const heroMetricGlyphs: GlyphName[] = ["trendDown", "shareBar", "survey", "forecast"];
import { BasisBadge, CountUp, Eyebrow, PageHeader, Roll, SubHead, Tag, jumpTo, navigate, pageHref, planHref, useMediaQuery, useTabList } from "../components/ui";

/** Quiet inline text link with a growing underline. */
const textLink =
  "relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] font-medium text-ink";

/** Opening of the Start page: a split hero. Words, search and the reader's questions on the left;
 *  the before/now stage (how work moved) on the right, so the idea is shown as well as told. */
export function HeroIntro({ children }: { children?: ReactNode }) {
  return (
    <div className="grid items-center gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <p className="inline-flex items-center gap-2 rounded-full border border-edge bg-card/60 py-1.5 pl-2.5 pr-3.5 font-mono text-label text-ink-2">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          Design Engineer Field Guide · 2026
        </p>
        <h1 id="shift-title" className="mt-5 font-display text-hero text-balance text-ink lg:text-[clamp(2.75rem,4.6vw,4.25rem)]">
          <em className="text-accent">Design and code</em> now meet earlier.
        </h1>
        <p className="mt-5 max-w-[54ch] text-lede text-pretty text-ink-2">
          Designers and developers now pass less work back and forth. AI tools make it faster to turn a design into working code, so more
          designers build alongside developers. Whether you're
          upskilling in your current role or aiming for a new one, this guide maps three roles and a step-by-step plan.
        </p>
        {children}
      </div>
      <div className="min-w-0">
        <HeroStage />
      </div>
    </div>
  );
}

/** Primary call to action under the hero: scroll to the two starting doors. */
export function ChoosePathButton() {
  return (
    <button type="button" onClick={() => jumpTo("start-here")} className="relative isolate inline-flex h-12 items-center gap-3 overflow-hidden rounded-full bg-accent pl-[1.375rem] pr-5 text-[0.9375rem] font-semibold tracking-[-0.005em] text-on-accent transition-[translate,box-shadow,color] duration-[260ms] ease-spring before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:bg-ink before:transition-transform before:duration-[550ms] before:ease-silk before:content-[''] hover:shadow-accent hover:before:translate-y-0 focus-visible:shadow-accent focus-visible:before:translate-y-0 active:translate-y-px motion-reduce:active:translate-y-0 group">
          <span>Find your starting point</span>
          <span aria-hidden className="font-mono text-sm transition-transform duration-300 motion-safe:group-hover:translate-y-0.5">↓</span>
        </button>
  );
}

/** Chapter: the two starting doors. */
export function StartHere() {
  return (
    <>
      <nav aria-label="Start here" className="grid gap-6 md:grid-cols-2">
        <EntryCard
          href="#/roles"
          who="I'm a working designer"
          meta="Track A · Working designer"
          what="Upskill in your role, or grow into a hybrid one"
          detail="Compare Design Engineer, Meta-Designer and AX Designer, then follow a six-month plan from browser basics to real pull requests — at your current company or your next one."
          welcome={startAudience.a}
          tools={["Figma", "React", "TypeScript", "Tailwind CSS", "Cursor", "Claude Code"]}
          cta="Explore the three roles"
        />
        <EntryCard
          href="#/plan/b"
          who="I'm starting out"
          meta="Track B · Starting out"
          what="Start the beginner track"
          detail="Follow a four-stage plan: build your UX and product design base first, prototype in real code, ship for real users and aim at teams hiring juniors."
          welcome={startAudience.b}
          tools={["Figma", "Claude Design", "HTML5", "React", "Tailwind CSS", "Cursor"]}
          cta="Open the beginner plan"
        />
      </nav>
      <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-5 text-sm text-ink-3">
        <p>
          {startAudience.fromCode.lead}{" "}
          <a href={pageHref("roles", "de")} className={textLink}>{startAudience.fromCode.role}</a>, or{" "}
          <a href={planHref({ track: "a", option: "pde", month: skipAheadMonth })} className={textLink}>{startAudience.fromCode.plan}</a>.
        </p>
        <p>
          {startAudience.leads.lead}{" "}
          <a href={pageHref("jobs")} className={textLink}>{startAudience.leads.jobs}</a> and{" "}
          <a href={pageHref("roles")} className={textLink}>{startAudience.leads.roles}</a>.
        </p>
      </div>
    </>
  );
}

/** The short answer to "Is my job going away?". On Start it links on to the Jobs page and the roles. */
export function JobsShortAnswer({ more = false }: { more?: boolean }) {
  return (
    <div data-reveal className="relative rounded-card border border-edge bg-card shadow-1 border-[color-mix(in_srgb,var(--accent)_45%,var(--edge))]! shadow-accent! grid gap-y-6 lg:grid-cols-12">
        <p className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal lg:col-span-12">
          <span>The short answer</span>
        </p>
        {/* The answer leads in reading order (and on phones); on desktop the +6% figure sits to its left. */}
        <div className="px-5 sm:px-7 lg:order-2 lg:col-span-8 lg:pl-0 lg:pb-7 lg:pt-1">
          <p className="font-display font-semibold tracking-[-0.02em] text-pretty text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] text-ink">No, but it's changing.</p>
          <p className="mt-4 max-w-[58ch] leading-relaxed text-ink-2">
            Big-tech hiring for some design roles is down. But design jobs overall are still projected to grow, and half of surveyed designers
            already ship some AI-generated code. Your design skills still matter most; what's growing is demand for designers who can
            also work in code with developers. The rest of this guide shows how.
          </p>
          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-ink-3">{titleReality}</p>
          <p className="mt-3 text-sm text-ink-2">
            Just starting out?{" "}
            <a href={pageHref("plan", "b")} className="font-medium text-accent-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-current">
              See the Track B plan
            </a>
          </p>
          {more && (
            <span className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              <a href={pageHref("jobs")} className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink group group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]">
                See the full jobs outlook <ArrowGlyph />
              </a>
              <a href={pageHref("roles")} className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink group group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]">
                See the three roles <ArrowGlyph />
              </a>
            </span>
          )}
        </div>
        <div className="px-5 pb-7 sm:px-7 lg:order-1 lg:col-span-4">
          <p className="font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums text-[clamp(4rem,8vw,7rem)] text-accent">+6%</p>
          <p className="mt-3 max-w-[30ch] text-sm leading-snug text-ink-2">US web & interface design jobs, 2025 → 2035</p>
          <p className="font-mono text-label font-normal mt-2 text-ink-3">US BLS projection</p>
        </div>
      </div>
  );
}

/** One card per headline statistic. */
export function JobsFigures() {
  return (
      <dl className="grid grid-cols-2 gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-4">
        {heroMetrics.map((m, i) => (
          <div
            key={m.label}
            data-reveal
            style={{ "--i": i } as CSSProperties}
            className="relative rounded-card border border-edge bg-card shadow-1 group flex min-h-[17rem] flex-col sm:min-h-[21rem]"
          >
            <dt className="order-4 mt-4 flex-1 max-w-[26ch] px-4 text-sm leading-snug text-pretty text-ink-2 sm:px-5">{m.label}</dt>
            <dd className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal order-1 rounded-t-[calc(var(--radius-card)-1px)]">
              <BasisBadge basis={m.basis} onBand />
            </dd>
            <dd aria-hidden="true" className="order-2 flex items-center justify-between px-4 pt-5 sm:px-5 sm:pt-6">
              <Glyph name={heroMetricGlyphs[i] ?? "survey"} className="glyph-xl size-11 text-ink sm:size-12" />
            </dd>
            <dd className={`font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums order-3 mt-auto px-4 pt-6 text-[clamp(3rem,5vw,5rem)] sm:px-5 ${i === 0 ? "text-accent" : "text-ink"}`}>
              <CountUp value={m.value} />
            </dd>
            <dd className="rounded-b-[calc(var(--radius-card)-1px)] border-t border-line px-[1.125rem] py-3 text-balance font-mono text-label font-normal order-5 mt-5 flex min-h-[3.5rem] items-center text-ink-3 sm:px-5">{m.source}</dd>
          </div>
        ))}
      </dl>
  );
}

/** One of the two "start here" doors below the hero: a spacious, labelled entry card. */
function EntryCard({
  href,
  who,
  meta,
  what,
  detail,
  welcome,
  tools,
  cta,
}: {
  href: string;
  who: string;
  meta: string;
  what: string;
  detail: string;
  welcome: string;
  tools: string[];
  cta: string;
}) {
  return (
    <a href={href} className="relative rounded-card border border-edge bg-card shadow-1 group/card transition-[translate,box-shadow,border-color,opacity] duration-[260ms] ease-spring hover:-translate-y-[3px] hover:border-line-strong hover:shadow-2 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink has-[>input:focus-visible]:outline-2 has-[>input:focus-visible]:outline-offset-4 has-[>input:focus-visible]:outline-accent-ink motion-reduce:hover:translate-y-0 group flex h-full flex-col">
      <span className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
        <span className="inline-flex items-center gap-1.5">
          <Glyph name="user" className="!size-3.5 [--accent:currentColor]" />
          <span>{who}</span>
        </span>
        <span>{meta}</span>
      </span>
      <span className="flex flex-1 flex-col p-6 sm:p-8">
        <span className="font-display text-display-m text-balance text-ink">{what}</span>
        <span className="mt-3 max-w-[48ch] text-sm leading-relaxed text-ink-2">{detail}</span>
        <span className="mt-3 max-w-[48ch] text-sm leading-relaxed text-ink">{welcome}</span>
        <span className="mt-5 flex flex-wrap gap-1.5">
          {tools.map((tool) => (
            <Tag key={tool}>{tool}</Tag>
          ))}
        </span>
        <span className="mt-auto block pt-6">
          <span className="font-mono text-label font-normal flex items-center justify-between gap-3 border-t border-line pt-4 text-accent-ink">
            <span>{cta}</span>
            <ArrowGlyph className="shrink-0 text-ink" />
          </span>
        </span>
      </span>
    </a>
  );
}

/** Why the roles exist: the handoff problem. Shown on Roles before the role picker. */
export function HandoffProblem() {
  return (
    <section aria-labelledby="handoff-title">
      <SubHead
        id="handoff-title"
        title="Why: handoffs are the bottleneck."
        note={`All three roles grow from the same problem. Moving a design from Figma into code takes time, and details can get lost between tools. In Figma's 2025 research, ${handoffFindings.handoffImprovable.value.toLowerCase()} designers and developers said the handoff could be improved, and ${handoffFindings.firstBuildMatchText}. The fix belongs in the process.`}
      />
      <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 gap-y-16">
        <div className="col-span-4 space-y-24 sm:space-y-32 lg:col-span-12">
          <HandoffFlow />
        </div>
      </div>
    </section>
  );
}

/** How teams are changing: AI adoption by designers and developers, and flatter org charts. */
export function TeamShift() {
  return (
    <div className="grid grid-flow-dense gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-12 [&>*]:min-w-0">
          <AdoptionDumbbell className="md:col-span-2 lg:col-span-8" />

          {/* Org flattening */}
          <div data-reveal className="relative rounded-card border border-edge bg-card shadow-1 flex flex-col md:col-span-2 lg:col-span-4">
            <h3 className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">Org-chart flattening</h3>
            <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6">
              <p className="max-w-[52ch] text-sm text-ink-2">
                Teams are getting flatter: more people per manager, and more senior hands-on roles that span design and code.
              </p>
              <dl className="mt-auto grid grid-cols-3 border-t border-line pt-1">
                {orgFlattening.map((o, i) => (
                  <div key={o.label} className={`flex flex-col px-3 pt-5 first:pl-0 last:pr-0 sm:px-4 ${i > 0 ? "border-l border-line" : ""}`}>
                    <dt className="order-2 mt-3 text-xs leading-snug text-ink-2 sm:text-sm">{o.label}</dt>
                    <dd className="font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums order-1 text-[clamp(2.25rem,3.2vw,3.25rem)]">{o.value}</dd>
                    <dd className="font-mono text-label font-normal order-3 mt-3 text-accent-ink">{o.delta}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
    </div>
  );
}

/** Two teams that moved designers into code, before and after. Shown on Roles after the roles. */
export function CaseStudies() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-24 sm:pb-36">
      <section aria-labelledby="cases-title">
        <SubHead id="cases-title" title={<>Teams that <em>closed the gap</em></>} note="Two single-company case studies: what changed when designers started working in code. They are examples, not market benchmarks." />
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-12 [&>*]:min-w-0">
          {handoffCases.map((c, i) => (
            <article
              key={c.org}
              data-reveal
              style={{ "--i": i } as CSSProperties}
              className="relative rounded-card border border-edge bg-card shadow-1 flex flex-col lg:col-span-6"
            >
              <p className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
                <span>Case 0{i + 1}</span>
                <span>Before → after</span>
              </p>
              <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-display-m text-balance">{c.org}</h3>
                  <BasisBadge basis="case" />
                </div>
                <p className="mt-2 text-sm text-ink-3">{c.what}</p>
                <dl className="mt-auto grid gap-6 pt-6 sm:grid-cols-2">
                  {c.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="font-mono text-label font-normal text-ink-3">{s.label}</dt>
                      <dd className="mt-3 flex flex-wrap items-baseline gap-x-3 whitespace-nowrap">
                        {s.from && (
                          <>
                            <span className="font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums text-[clamp(1.5rem,2vw,2rem)] text-ink-3 line-through decoration-1">{s.from}</span>
                            <span aria-hidden className="font-mono text-ink-3">→</span>
                            <span className="sr-only"> to </span>
                          </>
                        )}
                        <span className="font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums text-[clamp(2.25rem,3vw,3rem)] text-accent">{s.to}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Hire or upskill: a short block for design leads, built from content used elsewhere in the guide. */
export function ForLeads() {
  const cards = [
    { ...forLeads.upskill, href: pageHref("plan", "a"), cta: "See the Track A plan" },
    { ...forLeads.hire, href: pageHref("jobs"), cta: "See the jobs outlook" },
  ];
  return (
    <div className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-24 sm:pb-36">
      <section aria-labelledby="leads-title">
        <SubHead id="leads-title" title={<>For <em>design leads</em></>} note={forLeads.intro} />
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-12 [&>*]:min-w-0">
          {cards.map((c) => (
            <article key={c.title} className="relative rounded-card border border-edge bg-card shadow-1 flex flex-col p-5 sm:p-6 lg:col-span-4">
              <h3 className="font-display text-display-m text-balance text-ink inline-flex items-start gap-2.5">
                <Glyph name="users" className="mt-1 !size-6 shrink-0" />
                <span>{c.title}</span>
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-2">{c.detail}</p>
              <a href={c.href} className={`${textLink} mt-6 inline-flex items-center gap-2 self-start text-[0.9375rem] group`}>
                {c.cta} <ArrowGlyph />
              </a>
            </article>
          ))}
          <article className="relative rounded-card border border-edge bg-card shadow-1 flex flex-col p-5 sm:p-6 lg:col-span-4">
            <h3 className="text-[1.0625rem] font-medium tracking-tight text-ink">{forLeads.jobPostTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-2">
              {forLeads.jobPost.map((b) => (
                <li key={b} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-[1.0625rem] font-medium tracking-tight text-ink">{forLeads.interviewTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">{forLeads.interview}</p>
          </article>
        </div>
      </section>
    </div>
  );
}

/** Every market figure in one table, with scope and source. */
export function MarketTable() {
  return (
          <div data-reveal className="relative min-w-0 rounded-card border border-edge bg-card shadow-1">
            <h3 className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">Industry figures, 2025–2026</h3>
            <div className="px-5 pb-4 sm:px-6">
              <div tabIndex={0} role="region" aria-label="Every market figure (scrolls sideways)" className="overflow-x-auto rounded-chip focus-visible:outline-offset-[-2px]">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <caption className="sr-only">Industry metrics 2025–2026</caption>
                  <thead>
                    <tr className="font-mono text-label font-normal border-b border-line-strong text-ink-3">
                      <th scope="col" className="py-3 pr-4 font-normal">Figure</th>
                      <th scope="col" className="py-3 pr-4 font-normal">Metric</th>
                      <th scope="col" className="py-3 pr-4 font-normal">Scope</th>
                      <th scope="col" className="py-3 font-normal">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketMetrics.map((m) => (
                      <tr key={m.label} className="border-b border-line align-top last:border-0">
                        <td className="whitespace-nowrap py-3 pr-4 font-mono tabular-nums text-ink">{m.value}</td>
                        <td className="py-3 pr-4 text-ink-2">{m.label}</td>
                        <td className="py-3 pr-4 text-ink-3">{m.scope}</td>
                        <td className="py-3 text-ink-3">{m.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
  );
}

const shortRoleName: Record<string, string> = { de: "Design Engineer", meta: "Meta-Designer", ax: "AX Designer" };

export function Archetypes({ role, intro }: { role?: string; intro?: ReactNode }) {
  const sel = archetypes.find((x) => x.id === role)?.id ?? archetypes[0].id;
  const a = archetypes.find((x) => x.id === sel)!;
  const sharesPlanWith = archetypes.filter((x) => x.plan === a.plan && x.id !== a.id).map((x) => shortRoleName[x.id] ?? x.name);
  const isLg = useMediaQuery("(min-width: 1024px)");
  const { listProps, tabProps, panelProps } = useTabList({
    ids: archetypes.map((x) => x.id),
    value: sel,
    onChange: (id) => navigate(pageHref("roles", id), { replace: true }),
    idPrefix: "arch",
    orientation: isLg ? "vertical" : "horizontal",
  });
  // A link to one role (#/roles/meta) lands on the picker, below the intro. Runs once, on arrival only.
  useEffect(() => {
    if (!role || !intro) return;
    const id = requestAnimationFrame(() => {
      if (window.scrollY > 0) return;
      const el = document.getElementById("roles-pick");
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top - (window.innerWidth >= 1024 ? 96 : 120), behavior: "instant" as ScrollBehavior });
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div id="archetypes" className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-24 pt-8 sm:pb-36 sm:pt-12">
      <PageHeader
        id="roles-title"
        title={["Which role", <>fits <em>you?</em></>]}
        lede="Three roles where design and code meet. First, the problem they solve. Then pick the one that fits your team or where you want to grow — you don't need a new title to work this way."
      />

      {intro && <div className="mb-24 sm:mb-36">{intro}</div>}

      <SubHead id="roles-pick" title={<>Three roles that <em>close the gap</em></>} note="Pick one to see what it involves, the titles it goes by and where it's in demand." />

      {/* One surface: the role list on the left stays in view while the chosen role's detail reads on the right. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="sticky top-[104px] z-20 -mx-[var(--gutter)] bg-[color-mix(in_srgb,var(--desk)_88%,transparent)] px-[var(--gutter)] py-2 backdrop-blur-md lg:top-24 lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div
            {...listProps}
            aria-label="Role archetypes"
            className="grid grid-cols-3 gap-1 rounded-full border border-edge bg-card p-1 lg:flex lg:flex-col lg:gap-2 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
          >
            {archetypes.map((x, i) => {
              const on = x.id === sel;
              return (
                <button
                  key={x.id}
                  {...tabProps(x.id, i)}
                  className={`group relative flex min-h-10 min-w-0 items-center justify-center gap-3 rounded-full px-1 text-center text-xs transition-colors sm:px-2 sm:text-sm duration-300 lg:justify-start lg:rounded-ctl lg:border lg:p-4 lg:text-left ${
                    on
                      ? "bg-accent text-on-accent lg:border-accent lg:bg-accent-soft lg:text-ink"
                      : "text-ink-2 hover:bg-sunken hover:text-ink lg:border-edge lg:bg-card"
                  }`}
                >
                  <ArchetypeGlyph
                    id={x.id}
                    on={on}
                    className={`glyph-xl hidden !size-11 shrink-0 lg:block ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`}
                  />
                  <span className="truncate lg:hidden">{shortRoleName[x.id] ?? x.name}</span>
                  <span className="hidden min-w-0 lg:block">
                    <span className="block font-display font-semibold tracking-[-0.02em] text-pretty text-[1.0625rem] leading-tight">{x.name}</span>
                    <span className={`mt-1 block text-[13px] ${on ? "text-accent-ink" : "text-ink-3"}`}>
                      {x.short} · {x.focus}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div {...panelProps(a.id)} key={a.id} className="relative rounded-card border border-edge bg-card shadow-1 animate-panel-in motion-reduce:animate-fade-in focus-visible:outline-offset-8">
          <div className="flex flex-col gap-6 border-b border-line px-5 py-7 sm:px-8 sm:py-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-label font-normal inline-flex items-center gap-1.5 text-accent-ink">
                <Glyph name="user" className="!size-3.5 [--accent:currentColor]" />
                <span>{a.short}</span>
              </span>
              <span className="font-mono text-label font-normal text-ink-3">{a.focus}</span>
            </div>
            <h3 className="font-display text-display-m text-balance text-ink">{a.name}</h3>
            <p className="max-w-[60ch] font-display font-semibold tracking-[-0.02em] text-pretty text-[clamp(1.25rem,1.8vw,1.625rem)] leading-[1.2] text-ink">
              <span className="text-accent-ink">This fits you if</span> {a.fitsIf}
            </p>
            {a.fromCode && (
              <p className="max-w-[60ch] text-sm leading-relaxed text-ink-2">
                <span className="font-medium text-ink">Coming from code? </span>
                {a.fromCode}{" "}
                <a href={planHref({ track: "a", option: a.plan, month: skipAheadMonth })} className={textLink}>
                  Start the plan at Month&nbsp;{skipAheadMonth}
                </a>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={`#/plan/a/${a.plan}`} className="relative isolate inline-flex h-12 items-center gap-3 overflow-hidden rounded-full bg-accent pl-[1.375rem] pr-5 text-[0.9375rem] font-semibold tracking-[-0.005em] text-on-accent transition-[translate,box-shadow,color] duration-[260ms] ease-spring before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:bg-ink before:transition-transform before:duration-[550ms] before:ease-silk before:content-[''] hover:shadow-accent hover:before:translate-y-0 focus-visible:shadow-accent focus-visible:before:translate-y-0 active:translate-y-px motion-reduce:active:translate-y-0 group">
                <Roll>See the plan for this role</Roll>
                <ArrowGlyph />
              </a>
              <a href="#/plan/b/s1" className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]">
                Starting out? See the beginner plan <ArrowGlyph />
              </a>
            </div>
            {sharesPlanWith.length > 0 && (
              <p className="text-sm text-ink-3">Shares a six-month plan with the {sharesPlanWith.join(" and ")} role.</p>
            )}
          </div>

          <div className="[&>*]:animate-panel-in [&>*]:[animation-delay:calc(var(--i,0)*60ms)] motion-reduce:[&>*]:animate-fade-in px-5 py-7 sm:px-8 sm:py-9" style={{ "--i": 0 } as CSSProperties}>
            <Eyebrow>Core deliverable & scope</Eyebrow>
            <p className="max-w-[44ch] font-display font-semibold tracking-[-0.02em] text-pretty text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.2] text-ink">{a.deliverable}</p>
          </div>

          <div className="[&>*]:animate-panel-in [&>*]:[animation-delay:calc(var(--i,0)*60ms)] motion-reduce:[&>*]:animate-fade-in grid border-t border-line sm:grid-cols-2">
            <div className="px-5 py-7 sm:px-8 sm:py-9" style={{ "--i": 1 } as CSSProperties}>
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
            <div className="border-t border-line px-5 py-7 sm:border-l sm:border-t-0 sm:px-8 sm:py-9" style={{ "--i": 2 } as CSSProperties}>
              <Eyebrow>Skill differentiators</Eyebrow>
              {a.skillStats ? (
                <>
                  <ul className="space-y-5">
                    {a.skillStats.map((s) => (
                      <li key={s.label}>
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="text-ink-2">{s.label}</span>
                          <span className="font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums text-2xl">{s.value}%</span>
                        </div>
                        <div className="relative h-1.5 overflow-hidden rounded-full bg-line mt-1.5" aria-hidden>
                          <span className="absolute inset-y-0 left-0 origin-left rounded-full bg-ink transition-transform duration-[1300ms] ease-silk [transition-delay:calc(var(--i,0)*70ms)] [[data-reveal=bar]:not(.is-in)_&]:scale-x-0 motion-reduce:transition-none !bg-accent" style={{ width: `${s.value}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="font-mono text-label font-normal mt-5 text-ink-3">Share of Design Engineer listings requiring each. Git workflows also cited.</p>
                  {a.skillStatsBasis && (
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <BasisBadge basis={a.skillStatsBasis} />
                      {a.skillStatsSource && <span className="font-mono text-label font-normal text-ink-3">{a.skillStatsSource}</span>}
                    </p>
                  )}
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

      {/* The overlap map, always open: it shows how the three roles share skills */}
      <section aria-labelledby="overlap-title" className="mt-16 sm:mt-24">
        <SubHead id="overlap-title" title={<>How the three roles <em>overlap</em></>} />
        <ArchetypeVenn selected={sel} />
      </section>
    </div>
  );
}
