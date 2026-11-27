import { useState, type CSSProperties } from "react";
import {
  agentLayers,
  axDomains,
  axShift,
  coreSkills,
  engineeringSkills,
  patternCategories,
  protocols,
  teamsWhereOthersCreateUi,
  type Skill,
} from "../data/research";
import { BrandLogosFor } from "../components/BrandLogo";
import { Glyph, type GlyphName } from "../components/icons";
import { ProtocolArchitecture } from "../components/ProtocolArchitecture";
import { cardLink, Disclosure, Lines, Section, SectionHeader, TabPanel, Tabs, Tag, TextLink, pageHref, useTabList } from "../components/ui";

const patternTotal = patternCategories.reduce((n, c) => n + c.patterns.length, 0);

const domains = [
  { id: "core", glyph: "eye" as GlyphName, label: "Core design & judgment", sub: "Layer 01", items: coreSkills.map((s) => s.name) },
  { id: "eng", glyph: "terminal" as GlyphName, label: "Front-end & repo fluency", sub: "Layer 02", items: engineeringSkills.map((s) => s.name) },
  { id: "ax", glyph: "orbit" as GlyphName, label: "Agentic experience & protocols", sub: "Layer 03", items: [...axDomains.map((s) => s.name), "Protocols: " + protocols.map((p) => p.name).join(", ")] },
  { id: "patterns", glyph: "library" as GlyphName, label: "Human-AI pattern library", sub: "Appendix", items: [`${patternTotal} named patterns in ${patternCategories.length} families`] },
];

export function SkillsExplorer() {
  const [tab, setTab] = useState("core");
  return (
    <Section id="skills">
      <SectionHeader
        id="skills"
        title={["What to learn,", <em>layer by layer</em>]}
        lede="Start with the judgment AI can't replace, add front-end skills, then learn to design products that use AI agents."
      />

      <LayerStack value={tab} onChange={setTab} />

      <div className="mt-14 sm:mt-20">
        {tab === "core" && (
          <TabPanel idPrefix="skills" id="core">
            <SkillLedger skills={coreSkills} large />
            <Footnote>
              These still set you apart when AI makes the first draft. In a Q1 2026 Designer Fund / Foundation Capital survey, {teamsWhereOthersCreateUi.value}% of
              teams said PMs or engineers now create UI. Browse full topic syllabi in{" "}
              the <TextLink href={pageHref("library", "roadmaps")}>UX Design and Product Design roadmaps</TextLink>
              .
            </Footnote>
          </TabPanel>
        )}
        {tab === "eng" && (
          <TabPanel idPrefix="skills" id="eng">
            <SkillLedger skills={engineeringSkills} />
            <Footnote>
              Standardize on React, TypeScript and Tailwind CSS. Learn the browser before the AI: the six-month plan keeps AI code
              generation switched off for all of month one. See full topic checklists in{" "}
              the <TextLink href={pageHref("library", "roadmaps")}>Frontend and Design System roadmaps</TextLink>
              .
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
    <div {...listProps} aria-label="Skill layers" className="flex flex-col gap-3">
      {domains.map((d, i) => {
        const on = d.id === value;
        const appendix = d.id === "patterns";
        return (
          <button
            key={d.id}
            {...tabProps(d.id, i)}
            style={{ "--step": i } as CSSProperties}
            className={`group relative grid grid-cols-[4.5rem_1fr] items-baseline gap-x-4 px-4 py-5 text-left sm:grid-cols-[6rem_1fr_auto] sm:px-6 lg:ml-[calc(var(--step)*(100%_+_24px)/12)] ${
              appendix && !on ? "relative rounded-card border border-dashed border-line-strong bg-transparent shadow-none mt-4 text-ink-3 hover:text-ink" : `relative ${cardLink} ${appendix ? "mt-4" : ""}`
            } ${on ? "is-on translate-y-0! border-accent! shadow-accent! text-ink" : "text-ink-3 hover:text-ink"}`}
          >
            <span aria-hidden className={`absolute -left-px inset-y-5 w-[3px] origin-top rounded-full bg-accent transition-transform duration-700 ease-silk ${on ? "scale-y-100" : "scale-y-0"}`} />
            <span className="flex flex-col gap-3 self-start">
              <span className={`font-mono text-label font-normal ${on ? "text-accent-ink" : "text-ink-3"}`}>{d.sub}</span>
              <Glyph name={d.glyph} on={on} className={`!size-12 sm:!size-14 ${on ? "text-ink" : "text-ink-3 group-hover:text-ink"}`} />
            </span>
            <span className="min-w-0">
              <span className="font-display text-display-m text-balance block">{d.label}</span>
              <span className={`mt-2 block text-sm leading-relaxed ${on ? "text-ink-2" : "text-ink-3"}`}>{d.items.join(" / ")}</span>
            </span>
            <span aria-hidden className={`font-mono text-label font-normal hidden self-center sm:block ${on ? "text-ink" : "text-ink-3"}`}>
              {on ? "Reading ↓" : appendix ? "Slot" : "Open"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 mt-8">
      <p className="col-span-4 flex gap-3 text-sm leading-relaxed text-ink-2 lg:col-span-6 lg:col-start-7">
        <span aria-hidden className="font-mono text-accent-ink">*</span>
        <span>{children}</span>
      </p>
    </div>
  );
}

/** Skills as an index ledger: number, name, explanation, tags — one hairline row each. */
function SkillLedger({ skills, large = false }: { skills: Skill[]; large?: boolean }) {
  return (
    <ol className="[&>*]:animate-panel-in [&>*]:[animation-delay:calc(var(--i,0)*60ms)] motion-reduce:[&>*]:animate-fade-in space-y-4">
      {skills.map((s, i) => (
        <li
          key={s.name}
          className="relative rounded-card border border-edge bg-card shadow-1 grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 group gap-y-3 px-5 py-7 sm:px-7 sm:py-9 lg:sticky lg:top-[calc(7.5rem+var(--i)*14px)]"
          style={{ "--i": i } as CSSProperties}
        >
          <h3
            className={`col-span-4 tracking-tight text-ink transition-transform duration-700 ease-silk motion-safe:group-hover:translate-x-2 lg:col-span-5 ${
              large ? "font-display text-display-m text-balance" : "font-display font-semibold tracking-[-0.02em] text-pretty text-[1.75rem] leading-[1.05]"
            }`}
          >
            {s.name}
          </h3>
          <p className="col-span-4 max-w-[56ch] leading-relaxed text-ink-2 lg:col-span-5">
            {s.detail}
            {s.source && (
              <>
                {" "}Source: <TextLink href={s.source.url}>{s.source.label}</TextLink>.
              </>
            )}
          </p>
          {s.tags && (
            <div className="col-span-4 flex flex-wrap content-start gap-1.5 lg:col-span-2 lg:justify-end">
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
  const [protoId, setProtoId] = useState(protocols[0].id);
  const L = agentLayers.find((l) => l.id === layer)!;
  const layerIndex = agentLayers.findIndex((l) => l.id === layer);

  return (
    <div className="space-y-24 sm:space-y-36">
      {/* Shift */}
      <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 gap-y-12">
        <div className="col-span-4 lg:col-span-7">
          <p className="font-display text-display-l text-balance">
            <span className="block text-ink-3">{axShift.from}</span>
            <span className="sr-only">grows to include</span>
            <span className="mt-2 flex items-baseline gap-4">
              <span aria-hidden className="font-mono text-[0.4em] text-accent">↳</span>
              <em>{axShift.to}</em>
            </span>
          </p>
          <p className="mt-8 max-w-[52ch] leading-relaxed text-ink-2">{axShift.summary}</p>
        </div>
      </div>

      {/* Capability layer explorer */}
      <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 gap-y-8">
        <div className="col-span-4 lg:col-span-4">
          <h3 className="font-display text-display-m text-balance mb-8 text-ink">Trust and transparency, layer by layer</h3>
          <Tabs
            idPrefix="layer"
            label="Agent capability layer"
            variant="list"
            orientation="vertical"
            value={layer}
            onChange={setLayer}
            items={agentLayers.map((l, i) => ({ id: l.id, label: l.name, sub: `L${i + 1}` }))}
          />
          <p className="mt-5 max-w-[36ch] text-sm leading-relaxed text-ink-2">
            Every layer of an agent needs a surface the user can see. Pick a layer to list what the interface should expose.
          </p>
        </div>
        <TabPanel idPrefix="layer" id={layer} className="col-span-4 lg:col-span-7 lg:col-start-6">
          {/* Specimen of an agent console, showing where each surface lives */}
          <div className="relative rounded-card border border-edge bg-card shadow-1">
            <div className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal !justify-start">
              <span className="inline-block size-[7px] shrink-0 rounded-full bg-current text-card" aria-hidden />
              <span>agent://{L.id}</span>
              <span className="ml-auto tabular-nums">
                layer {String(layerIndex + 1).padStart(2, "0")} / {String(agentLayers.length).padStart(2, "0")}
              </span>
            </div>
            <ul className="[&>*]:animate-panel-in [&>*]:[animation-delay:calc(var(--i,0)*60ms)] motion-reduce:[&>*]:animate-fade-in">
              {L.surfaces.map((s, i) => (
                <li key={s} className="flex items-baseline gap-5 border-b border-line px-4 py-5 last:border-b-0" style={{ "--i": i } as CSSProperties}>
                  <span className="font-mono text-label font-normal text-ink-3 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display font-semibold tracking-[-0.02em] text-pretty text-[1.625rem] leading-tight text-ink">{s}</span>
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
      <div>
        <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 mb-8 gap-y-4">
          <div className="col-span-4 lg:col-span-5">
            <Lines as="h3" className="font-display text-display-m text-balance" lines={["Ground the interface in how agents", <em>actually talk.</em>]} />
          </div>
          <p className="col-span-4 self-end text-sm leading-relaxed text-ink-2 lg:col-span-6 lg:col-start-7">
            Four open protocols split the job: two connect the agent to the screen (AG-UI, A2UI) and two connect it to tools and peer
            agents (MCP, A2A). Pick any bridge in the diagram or open the rows below.
          </p>
        </div>

        <ProtocolArchitecture activeId={protoId} onSelect={setProtoId} />

        <div className="relative rounded-card border border-edge bg-card shadow-1 px-5 sm:px-6 [&>div:last-child]:border-b-0">
          {protocols.map((p, i) => (
            <Disclosure
              key={p.id}
              headingLevel="h4"
              defaultOpen={i === 0}
              summary={
                <span className="flex items-center gap-4">
                  <code className={`font-mono text-base ${protoId === p.id ? "text-accent-ink" : "text-ink"}`}>{p.name}</code>
                  <span className="font-mono text-label font-normal inline-flex items-center gap-1.5 text-ink-3">
                    <BrandLogosFor text={p.owner} max={1} className="size-3.5" />
                    <span>{p.owner}</span>
                  </span>
                </span>
              }
            >
              <dl className="grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-label font-normal text-ink-3">Architectural role</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-2">{p.role}</dd>
                </div>
                <div className="border-l border-accent pl-4">
                  <dt className="font-mono text-label font-normal text-accent-ink">What it means for design</dt>
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
    <div className="font-mono text-label font-normal mb-6 flex gap-6 text-ink-3">
      <span className="text-accent-ink">[{n}]</span>
      <span className="text-ink">{text}</span>
    </div>
  );
}

function PatternLibrary() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {patternCategories.map((c) => (
        <article key={c.id} className="relative rounded-card border border-edge bg-card shadow-1 p-6 sm:p-8">
          <h3 className="font-display text-display-m text-balance">{c.name}</h3>
          <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-ink-2">{c.objective}</p>
          <ul className="mt-6 border-t border-line">
            {c.patterns.map((p) => (
              <li key={p} className="border-b border-line py-2.5 text-[0.9375rem] text-ink last:border-b-0">
                {p}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
