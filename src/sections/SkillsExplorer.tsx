import { useId, useMemo, useState, type CSSProperties } from "react";
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
import { Disclosure, Eyebrow, Lines, Section, SectionHeader, TabPanel, Tabs, Tag, useTabList } from "../components/ui";

const patternTotal = patternCategories.reduce((n, c) => n + c.patterns.length, 0);

const domains = [
  { id: "core", label: "Core design & judgment", sub: "Layer 01", items: coreSkills.map((s) => s.name) },
  { id: "eng", label: "Front-end & repo fluency", sub: "Layer 02", items: engineeringSkills.map((s) => s.name) },
  { id: "ax", label: "Agentic experience & protocols", sub: "Layer 03", items: [...axDomains.map((s) => s.name), "Protocols: " + protocols.map((p) => p.name).join(", ")] },
  { id: "patterns", label: "Human-AI pattern library", sub: "Appendix", items: [`${patternTotal} named patterns in ${patternCategories.length} families`] },
];

export function SkillsExplorer() {
  const [tab, setTab] = useState("core");
  return (
    <Section id="skills">
      <SectionHeader
        id="skills"
        index="03"
        kicker="Skills architecture"
        folio="p. 03 / 06"
        title={["Discernment,", "fluency,", <em>orchestration.</em>]}
        lede="Product design is now a layered stack. Work down it, from durable judgment to the protocols agents use to talk to each other."
      />

      <LayerStack value={tab} onChange={setTab} />

      <div className="mt-14 sm:mt-20">
        {tab === "core" && (
          <TabPanel idPrefix="skills" id="core">
            <SkillLedger skills={coreSkills} large />
            <Footnote>
              These stay the differentiator once first drafts are automated: 40% of teams report PMs and engineers now generate UI
              directly with AI.
            </Footnote>
          </TabPanel>
        )}
        {tab === "eng" && (
          <TabPanel idPrefix="skills" id="eng">
            <SkillLedger skills={engineeringSkills} />
            <Footnote>
              Standardise on React, TypeScript and Tailwind CSS. Learn the browser before the AI: the six-month plan keeps AI code
              generation switched off for all of month one.
            </Footnote>
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

/** The skills stack drawn as offset plates: each layer sits one grid column further in, so the page
 *  reads top-down from durable judgment to protocols. Each plate is a tab for the panel below. */
function LayerStack({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { listProps, tabProps } = useTabList({ ids: domains.map((d) => d.id), value, onChange, idPrefix: "skills", orientation: "vertical" });
  return (
    <div {...listProps} aria-label="Skill layers" className="flex flex-col">
      {domains.map((d, i) => {
        const on = d.id === value;
        const appendix = d.id === "patterns";
        return (
          <button
            key={d.id}
            {...tabProps(d.id, i)}
            style={{ "--step": i } as CSSProperties}
            className={`group relative -mt-px grid grid-cols-[4.5rem_1fr] items-baseline gap-x-4 border px-4 py-5 text-left transition-colors duration-500 sm:grid-cols-[6rem_1fr_auto] sm:px-6 lg:ml-[calc(var(--step)*(100%_+_24px)/12)] ${
              appendix ? "mt-4 border-dashed" : ""
            } ${on ? "z-[1] border-ink bg-surface text-ink" : "border-line-strong text-ink-3 hover:text-ink"}`}
          >
            <span aria-hidden className={`absolute inset-y-0 left-0 w-[3px] origin-top bg-accent transition-transform duration-700 ease-silk ${on ? "scale-y-100" : "scale-y-0"}`} />
            <span className={`label ${on ? "text-accent-ink" : "text-ink-3"}`}>{d.sub}</span>
            <span className="min-w-0">
              <span className="display-m block">{d.label}</span>
              <span className={`mt-2 block text-sm leading-relaxed ${on ? "text-ink-2" : "text-ink-3"}`}>{d.items.join(" / ")}</span>
            </span>
            <span aria-hidden className={`label hidden self-center sm:block ${on ? "text-ink" : "text-ink-3"}`}>
              {on ? "Reading ↓" : "Open"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-12 mt-8">
      <p className="col-span-4 flex gap-3 text-sm leading-relaxed text-ink-3 lg:col-span-6 lg:col-start-7">
        <span aria-hidden className="font-mono text-accent-ink">*</span>
        <span>{children}</span>
      </p>
    </div>
  );
}

/** Skills as an index ledger: number, name, explanation, tags — one hairline row each. */
function SkillLedger({ skills, large = false }: { skills: Skill[]; large?: boolean }) {
  return (
    <ol className="stagger border-t border-ink">
      {skills.map((s, i) => (
        <li key={s.name} className="grid-12 group gap-y-3 border-b border-line py-7 sm:py-9" style={{ "--i": i } as CSSProperties}>
          <span className="label col-span-1 pt-2 text-ink-3 tabular">{String(i + 1).padStart(2, "0")}</span>
          <h3
            className={`col-span-3 tracking-tight text-ink transition-transform duration-700 ease-silk group-hover:translate-x-2 lg:col-span-4 ${
              large ? "display-m" : "font-display text-[1.75rem] leading-[1.05]"
            }`}
          >
            {s.name}
          </h3>
          <p className="col-span-3 col-start-2 max-w-[56ch] leading-relaxed text-ink-2 lg:col-span-5 lg:col-start-auto">{s.detail}</p>
          {s.tags && (
            <div className="col-span-3 col-start-2 flex flex-wrap content-start gap-1.5 lg:col-span-2 lg:col-start-auto lg:justify-end">
              {s.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function AxPanel() {
  const [layer, setLayer] = useState(agentLayers[0].id);
  const L = agentLayers.find((l) => l.id === layer)!;
  const layerIndex = agentLayers.findIndex((l) => l.id === layer);

  return (
    <div className="space-y-28">
      {/* Shift */}
      <div className="grid-12 gap-y-12">
        <div className="col-span-4 lg:col-span-7">
          <Eyebrow>The discipline shift</Eyebrow>
          <p className="display-l">
            <span className="block text-ink-3 line-through decoration-[0.04em]">{axShift.from}</span>
            <span className="sr-only">shifts to</span>
            <span className="mt-2 flex items-baseline gap-4">
              <span aria-hidden className="font-mono text-[0.4em] text-accent">↳</span>
              <em>{axShift.to}</em>
            </span>
          </p>
          <p className="mt-8 max-w-[52ch] leading-relaxed text-ink-2">{axShift.summary}</p>
        </div>
        <figure className="col-span-4 self-end lg:col-span-4 lg:col-start-9">
          <figcaption className="label mb-4 text-ink-3">Enterprise agent maturity</figcaption>
          <div className="flex h-24 border border-ink" role="img" aria-label="21% no adoption, 68% piloting, 11% in production">
            {agentMaturity.map((m) => (
              <div
                key={m.level}
                className={`flex items-end p-2 ${m.level === 3 ? "bg-accent text-[var(--on-accent)]" : m.level === 2 ? "bg-ink text-paper" : "text-ink"} ${
                  m.level > 1 ? "border-l border-ink" : ""
                }`}
                style={{ width: `${m.value}%` }}
              >
                <span className="numeral text-2xl">{m.value}</span>
              </div>
            ))}
          </div>
          <dl className="mt-5 text-sm">
            {agentMaturity.map((m) => (
              <div key={m.level} className="flex gap-3 border-b border-line py-2.5">
                <dt className="label w-28 shrink-0 pt-0.5 text-ink-3">
                  L{m.level} · {m.label}
                </dt>
                <dd className="text-ink-2">{m.detail}</dd>
              </div>
            ))}
          </dl>
        </figure>
      </div>

      {/* Capability layer explorer */}
      <div className="grid-12 gap-y-8">
        <div className="col-span-4 lg:col-span-4">
          <Eyebrow>Trust & transparency, by capability layer</Eyebrow>
          <Tabs
            idPrefix="layer"
            label="Agent capability layer"
            variant="list"
            orientation="vertical"
            value={layer}
            onChange={setLayer}
            items={agentLayers.map((l, i) => ({ id: l.id, label: l.name, sub: `L${i + 1}` }))}
          />
          <p className="mt-5 max-w-[36ch] text-sm leading-relaxed text-ink-3">
            Every layer of an agent needs a surface the user can see. Pick a layer to list what the interface should expose.
          </p>
        </div>
        <TabPanel idPrefix="layer" id={layer} className="col-span-4 lg:col-span-7 lg:col-start-6">
          {/* Specimen of an agent console, showing where each surface lives */}
          <div className="border border-ink bg-surface">
            <div className="label flex items-center gap-3 border-b border-ink px-4 py-3 text-ink-3">
              <span className="tick text-accent" aria-hidden />
              <span className="text-ink">agent://{L.id}</span>
              <span className="ml-auto tabular">
                layer {String(layerIndex + 1).padStart(2, "0")} / {String(agentLayers.length).padStart(2, "0")}
              </span>
            </div>
            <ul className="stagger">
              {L.surfaces.map((s, i) => (
                <li key={s} className="flex items-baseline gap-5 border-b border-line px-4 py-5 last:border-b-0" style={{ "--i": i } as CSSProperties}>
                  <span className="label text-ink-3 tabular">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[1.625rem] leading-tight tracking-tight text-ink">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabPanel>
      </div>

      {/* Four competency domains */}
      <div>
        <SubLabel n="03.c" text="Four AX governance domains" />
        <SkillLedger skills={axDomains} />
      </div>

      {/* Protocols */}
      <div className="grid-12 gap-y-10">
        <div className="col-span-4 lg:col-span-4">
          <Eyebrow>Protocol literacy</Eyebrow>
          <Lines as="h3" className="display-m" lines={["Ground the interface", "in how agents", <em>actually talk.</em>]} />
          <p className="mt-6 text-sm leading-relaxed text-ink-2">Back-end concepts worth knowing:</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {agentArchitectureTerms.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
        <div className="col-span-4 border-t border-ink lg:col-span-7 lg:col-start-6">
          {protocols.map((p, i) => (
            <Disclosure
              key={p.id}
              defaultOpen={i === 0}
              summary={
                <span className="flex items-baseline gap-4">
                  <code className="font-mono text-base text-ink">{p.name}</code>
                  <span className="label text-ink-3">{p.owner}</span>
                </span>
              }
            >
              <dl className="grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="label text-ink-3">Architectural role</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-2">{p.role}</dd>
                </div>
                <div className="border-l border-accent pl-4">
                  <dt className="label text-accent-ink">What it means for design</dt>
                  <dd className="mt-2 leading-relaxed text-ink">{p.ux}</dd>
                </div>
              </dl>
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubLabel({ n, text }: { n: string; text: string }) {
  return (
    <div className="label mb-6 flex gap-6 text-ink-3">
      <span className="text-accent-ink">[{n}]</span>
      <span className="text-ink">{text}</span>
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
  const total = patternCategories.reduce((n, c) => n + c.patterns.length, 0);

  return (
    <div>
      <div className="grid-12 gap-y-6">
        <div className="col-span-4 lg:col-span-5">
          <label htmlFor={searchId} className="label block text-ink-3">
            Search the taxonomy
          </label>
          <input
            id={searchId}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="consent, HITL, voice…"
            className="input-line mt-1"
          />
        </div>
        <div role="group" aria-label="Filter by category" className="col-span-4 flex flex-wrap content-end gap-x-5 lg:col-span-6 lg:col-start-7">
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

      <p className="label mt-8 text-ink-3" aria-live="polite">
        <span className="tabular text-ink">{String(count).padStart(2, "0")}</span> of {total} named mechanisms shown
      </p>

      {results.length === 0 ? (
        <div className="mt-6 border-y border-line py-16">
          <p className="display-m text-ink">Nothing matches “{q}”.</p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCat(null);
            }}
            className="link-ul-static label mt-6 text-ink"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid border-t border-ink md:grid-cols-2">
          {results.map((c, i) => (
            <article
              key={c.id}
              className={`panel-in border-b border-line py-8 md:py-10 ${i % 2 === 0 ? "md:border-r md:pr-8" : "md:pl-8"}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <h3 className="display-m">{c.name}</h3>
              <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-ink-2">{c.objective}</p>
              <ul className="mt-6 border-t border-line">
                {c.patterns.map((p) => (
                  <li key={p.code} className="group flex items-baseline gap-4 border-b border-line py-2.5 last:border-b-0">
                    <code className="w-14 shrink-0 font-mono text-[11px] text-accent-ink">{p.code}</code>
                    <span className="text-[0.9375rem] text-ink transition-transform duration-500 ease-silk group-hover:translate-x-1">{p.name}</span>
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
      className={`label flex min-h-11 items-center gap-2 transition-colors duration-500 ${on ? "text-ink" : "text-ink-3 hover:text-ink"}`}
    >
      <span aria-hidden className={`tick transition-transform duration-500 ease-silk ${on ? "scale-100 text-accent" : "scale-0"}`} />
      <span className="link-ul" data-on={on}>
        {children}
      </span>
    </button>
  );
}
