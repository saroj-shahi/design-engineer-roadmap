import { useId, useMemo, useState } from "react";
import {
  agentArchitectureTerms,
  agentLayers,
  agentMaturity,
  axDomains,
  axShift,
  coreSkills,
  engineeringSkills,
  patternCategories,
  protocols,
  type Skill,
} from "../data/research";
import { Disclosure, Eyebrow, Section, SectionHeader, TabPanel, Tabs, Tag } from "../components/ui";

const domains = [
  { id: "core", label: "Core design & judgment", sub: "Layer 1" },
  { id: "eng", label: "Front-end & repo fluency", sub: "Layer 2" },
  { id: "ax", label: "Agentic experience & protocols", sub: "Layer 3" },
  { id: "patterns", label: "Human-AI pattern library", sub: "Reference" },
];

export function SkillsExplorer() {
  const [tab, setTab] = useState("core");
  return (
    <Section id="skills" className="bg-surface/40">
      <SectionHeader
        id="skills"
        index="03"
        kicker="Skills architecture"
        title={
          <>
            Human discernment, technical fluency, <span className="italic">system orchestration.</span>
          </>
        }
        lede="Modern product design is a layered stack. Explore each layer, from durable judgment down to the protocols agents speak."
      />

      <Tabs idPrefix="skills" label="Skill domains" value={tab} onChange={setTab} items={domains} variant="list" />

      <div className="mt-10">
        {tab === "core" && (
          <TabPanel idPrefix="skills" id="core">
            <SkillGrid skills={coreSkills} cols="md:grid-cols-3" large />
            <p className="prose-measure mt-6 text-sm leading-relaxed text-ink-3">
              These remain the differentiator when first drafts are automated: 40% of teams report PMs and engineers now generate UI
              directly with AI.
            </p>
          </TabPanel>
        )}
        {tab === "eng" && (
          <TabPanel idPrefix="skills" id="eng">
            <SkillGrid skills={engineeringSkills} cols="sm:grid-cols-2 lg:grid-cols-4" />
            <p className="prose-measure mt-6 text-sm leading-relaxed text-ink-3">
              Standardize on React + TypeScript + Tailwind CSS. Learn the browser before the AI: the 6-month plan keeps AI code
              generation off entirely in month one.
            </p>
          </TabPanel>
        )}
        {tab === "ax" && (
          <TabPanel idPrefix="skills" id="ax">
            <AxPanel />
          </TabPanel>
        )}
        {tab === "patterns" && (
          <TabPanel idPrefix="skills" id="patterns">
            <PatternLibrary />
          </TabPanel>
        )}
      </div>
    </Section>
  );
}

function SkillGrid({ skills, cols, large = false }: { skills: Skill[]; cols: string; large?: boolean }) {
  return (
    <ul className={`grid gap-px overflow-hidden rounded-md border border-line bg-line ${cols}`}>
      {skills.map((s, i) => (
        <li key={s.name} className="flex flex-col bg-surface p-5 sm:p-6">
          <span className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
          <h3 className={`mt-3 ${large ? "font-serif text-2xl leading-tight" : "font-medium"} text-ink`}>{s.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{s.detail}</p>
          {s.tags && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {s.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function AxPanel() {
  const [layer, setLayer] = useState(agentLayers[0].id);
  const L = agentLayers.find((l) => l.id === layer)!;

  return (
    <div className="space-y-14">
      {/* Shift */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>The discipline shift</Eyebrow>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-serif text-3xl leading-tight sm:text-4xl">
            <span className="text-ink-3 line-through decoration-1">{axShift.from}</span>
            <span aria-hidden className="text-accent">→</span>
            <span className="sr-only">shifts to</span>
            <span className="italic">{axShift.to}</span>
          </p>
          <p className="prose-measure mt-4 leading-relaxed text-ink-2">{axShift.summary}</p>
        </div>
        <figure className="lg:col-span-5">
          <figcaption className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-3">Enterprise agent maturity</figcaption>
          <div className="flex h-9 overflow-hidden rounded-sm border border-line" role="img" aria-label="21% no adoption, 68% piloting, 11% in production">
            {agentMaturity.map((m) => (
              <div
                key={m.level}
                className={`flex items-center justify-center font-mono text-xs ${
                  m.level === 3 ? "bg-accent text-white" : m.level === 2 ? "bg-line-strong text-ink" : "bg-sunken text-ink-2"
                }`}
                style={{ width: `${m.value}%` }}
              >
                {m.value}%
              </div>
            ))}
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            {agentMaturity.map((m) => (
              <div key={m.level} className="flex gap-3">
                <dt className="w-32 shrink-0 font-mono text-xs text-ink-3">
                  L{m.level} · {m.label}
                </dt>
                <dd className="text-ink-2">{m.detail}</dd>
              </div>
            ))}
          </dl>
        </figure>
      </div>

      {/* Capability layer explorer */}
      <div>
        <Eyebrow>Trust & transparency surfaces · by capability layer</Eyebrow>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Tabs
              idPrefix="layer"
              label="Agent capability layer"
              variant="segmented"
              value={layer}
              onChange={setLayer}
              items={agentLayers.map((l) => ({ id: l.id, label: l.name }))}
            />
            <p className="mt-4 text-sm leading-relaxed text-ink-2">
              Each layer of an agent needs a visible surface. Select a layer to see what the interface should expose.
            </p>
          </div>
          <TabPanel idPrefix="layer" id={layer} className="lg:col-span-8">
            {/* Mock agent panel: illustrates where each surface lives */}
            <div className="overflow-hidden rounded-md border border-line bg-surface">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 font-mono text-[11px] text-ink-3">
                <span className="size-2 rounded-full bg-accent" aria-hidden />
                agent://{L.id}
                <span className="ml-auto">layer {agentLayers.findIndex((l) => l.id === layer) + 1}/4</span>
              </div>
              <ul className="divide-y divide-line">
                {L.surfaces.map((s, i) => (
                  <li key={s} className="flex items-center gap-4 px-4 py-3.5">
                    <span className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-ink">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabPanel>
        </div>
      </div>

      {/* Four competency domains */}
      <div>
        <Eyebrow>Four AX governance domains</Eyebrow>
        <SkillGrid skills={axDomains} cols="sm:grid-cols-2" />
      </div>

      {/* Protocols */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>Protocol literacy</Eyebrow>
          <h3 className="font-serif text-3xl leading-tight">Ground the interface in how agents actually talk.</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">Backend concepts worth knowing:</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {agentArchitectureTerms.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
        <div className="border-t border-line lg:col-span-8">
          {protocols.map((p, i) => (
            <Disclosure
              key={p.id}
              defaultOpen={i === 0}
              summary={
                <span className="flex items-baseline gap-3">
                  <code className="font-mono text-base text-accent-ink">{p.name}</code>
                  <span className="text-sm font-normal text-ink-3">{p.owner}</span>
                </span>
              }
            >
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-3">Architectural role</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-2">{p.role}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-accent-ink">What it means for design</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink">{p.ux}</dd>
                </div>
              </dl>
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
}

function PatternLibrary() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const searchId = useId();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return patternCategories
      .filter((c) => !cat || c.id === cat)
      .map((c) => ({
        ...c,
        patterns: c.patterns.filter(
          (p) => !needle || p.name.toLowerCase().includes(needle) || p.code.toLowerCase().includes(needle) || c.name.toLowerCase().includes(needle),
        ),
      }))
      .filter((c) => c.patterns.length > 0);
  }, [q, cat]);

  const count = results.reduce((n, c) => n + c.patterns.length, 0);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <label htmlFor={searchId} className="sr-only">
            Search patterns
          </label>
          <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <input
            id={searchId}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search e.g. “consent”, HITL, voice"
            className="w-full rounded-md border border-line bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
          <FilterChip on={cat === null} onClick={() => setCat(null)}>
            All
          </FilterChip>
          {patternCategories.map((c) => (
            <FilterChip key={c.id} on={cat === c.id} onClick={() => setCat(cat === c.id ? null : c.id)}>
              {c.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="mt-4 font-mono text-xs text-ink-3" aria-live="polite">
        {count} named mechanisms shown · drawn from a 32-pattern taxonomy
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-line-strong p-10 text-center">
          <p className="text-ink">No patterns match “{q}”.</p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCat(null);
            }}
            className="mt-3 text-sm text-accent-ink underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {results.map((c) => (
            <article key={c.id} className="fade-in rounded-md border border-line bg-surface p-5">
              <h3 className="font-serif text-2xl leading-tight">{c.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.objective}</p>
              <ul className="mt-5 divide-y divide-line border-t border-line">
                {c.patterns.map((p) => (
                  <li key={p.code} className="flex items-center gap-3 py-2">
                    <code className="w-16 shrink-0 font-mono text-[11px] text-accent-ink">{p.code}</code>
                    <span className="text-sm text-ink">{p.name}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        on ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink-2 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
