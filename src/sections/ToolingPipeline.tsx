import { useState, type CSSProperties } from "react";
import { roleStacks, toolStages } from "../data/research";
import { Section, SectionHeader, TabPanel, useTabList } from "../components/ui";
import { Glyph, type GlyphName } from "../components/icons";

const stageGlyph: Record<number, GlyphName> = { 1: "frame", 2: "roundtrip", 3: "branch", 4: "blocks", 5: "spark" };

export function ToolingPipeline() {
  const [roleId, setRoleId] = useState("de");
  const role = roleStacks.find((r) => r.id === roleId)!;

  return (
    <Section id="tooling">
      <SectionHeader
        id="tooling"
        glyph="pipeline"
        title={["The right tool", <em>for each step.</em>]}
        lede="Pick your role to see the tools for each step of the work. Choose one set and stick with it. Too many tools slow you down."
      />

      <div className="grid-12 gap-y-6">
        <div className="card col-span-4 p-4 sm:p-5 lg:col-span-8">
          <RoleMatrix value={roleId} onChange={setRoleId} />
        </div>
        <p className="col-span-4 self-end text-sm leading-relaxed text-ink-3 lg:col-span-3 lg:col-start-10">
          Each row is a role; each column a pipeline stage. A filled cell means the role's recommended stack works in that stage,
          and the figure is how many of that stage's tools it uses. Stage 04, app builders, sits outside every recommended stack.
          Pick a row to see its chain.
        </p>
      </div>

      <TabPanel idPrefix="role" id={roleId} className="mt-12">
        <div className="card grid-12 gap-y-6 px-5 py-6 sm:px-7">
          <p className="label col-span-4 text-ink-3 lg:col-span-2">Recommended chain</p>
          <ol className="col-span-4 flex flex-wrap items-baseline gap-x-3 gap-y-2 lg:col-span-10">
            {role.chain.map((c, i) => (
              <li key={c} className="flex items-baseline gap-3">
                <span className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-none tracking-tight text-ink">{c}</span>
                {i < role.chain.length - 1 && (
                  <span aria-hidden className="font-mono text-sm text-accent">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="col-span-4 max-w-[60ch] text-sm leading-relaxed text-ink-2 lg:col-span-6 lg:col-start-3">{role.summary}</p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {toolStages.map((s, i) => {
            const on = role.stages.includes(s.id);
            const highlighted = role.toolsByStage[s.id] ?? [];
            return (
              <li
                key={s.id}
                aria-label={`Stage ${s.id}: ${s.name}${on ? ", in your stack" : ""}`}
                className={`panel-in group relative flex flex-col p-5 ${on ? "card card-lift" : "card-empty"}`}
                style={{ animationDelay: `${i * 70}ms` } as CSSProperties}
              >
                <div className="flex items-start justify-between gap-3">
                  <Glyph name={stageGlyph[s.id]} on={on} className={`!size-14 ${on ? "text-ink" : "text-ink-3"}`} />
                  <span className={`label ${on ? "text-accent-ink" : "text-ink-3"}`}>{on ? "In stack" : "Outside"}</span>
                </div>
                <span className={`numeral mt-5 text-[3.5rem] transition-colors duration-700 ${on ? "text-ink" : "text-ink-3"}`}>0{s.id}</span>
                <h3 className={`mt-4 text-[1.0625rem] font-medium leading-snug tracking-tight transition-colors duration-700 ${on ? "text-ink" : "text-ink-3"}`}>{s.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-1">
                  {s.tools.map((t) => {
                    const hit = highlighted.includes(t);
                    return (
                      <li
                        key={t}
                        className={`border px-1.5 py-[3px] font-mono text-[11px] leading-4 transition-colors duration-500 ${
                          hit ? "border-accent text-accent-ink" : "border-line text-ink-3"
                        }`}
                      >
                        {t}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-ink-2">{s.capabilities}</p>
                <div className="mt-auto pt-6">
                  <div className={`border-t pt-4 transition-colors duration-700 ${on ? "border-ink" : "border-line"}`}>
                    <span className={`label mb-1.5 block ${on ? "text-accent-ink" : "text-ink-3"}`}>Human guardrail</span>
                    <p className={`text-xs leading-relaxed ${on ? "text-ink" : "text-ink-3"}`}>{s.guardrail}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </TabPanel>
    </Section>
  );
}

/** Role × stage matrix. Every row is a tab; the selected row drives the chain and the stage cards below. */
function RoleMatrix({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { listProps, tabProps } = useTabList({ ids: roleStacks.map((r) => r.id), value, onChange, idPrefix: "role", orientation: "vertical" });
  const cols = "grid grid-cols-[minmax(6.5rem,1.4fr)_repeat(5,minmax(0,1fr))] gap-x-1 sm:gap-x-1.5";

  return (
    <div>
      <div aria-hidden className={`${cols} border-b-2 border-edge pb-3`}>
        <span className="label self-end text-ink-3">Role</span>
        {toolStages.map((s) => (
          <span key={s.id} className="flex min-w-0 flex-col">
            <span className="label text-ink">0{s.id}</span>
            <span className="mt-1 hidden text-xs leading-tight text-ink-3 sm:line-clamp-2">{s.name}</span>
          </span>
        ))}
      </div>
      <div {...listProps} aria-label="Your role" className="flex flex-col">
        {roleStacks.map((r, i) => {
          const on = r.id === value;
          return (
            <button
              key={r.id}
              {...tabProps(r.id, i)}
              className={`group ${cols} items-center border-b border-line py-1.5 text-left transition-colors duration-500 ${on ? "bg-surface" : "hover:bg-sunken"}`}
            >
              <span className={`flex items-center gap-2 pr-2 text-sm leading-tight sm:text-[0.9375rem] ${on ? "font-medium text-ink" : "text-ink-2"}`}>
                <span aria-hidden className={`tick shrink-0 text-accent transition-transform duration-500 ease-silk ${on ? "scale-100" : "scale-0"}`} />
                {r.label}
              </span>
              {toolStages.map((s) => {
                const n = r.toolsByStage[s.id]?.length ?? 0;
                const has = r.stages.includes(s.id);
                return (
                  <span
                    key={s.id}
                    aria-hidden
                    className={`grid h-10 place-items-center font-mono text-sm tabular transition-colors duration-500 ${
                      has ? (on ? "bg-accent text-[var(--on-accent)]" : "bg-ink text-paper") : "border border-dashed border-line-strong"
                    }`}
                  >
                    {has ? n : ""}
                  </span>
                );
              })}
              <span className="sr-only">
                , works in stages {r.stages.join(", ")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
