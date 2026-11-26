import { useState, type CSSProperties } from "react";
import { roleStacks, toolStages } from "../data/research";
import { BrandLogosFor } from "../components/BrandLogo";
import { Section, SectionHeader, TabPanel, Tag, useTabList } from "../components/ui";
import { Glyph, type GlyphName } from "../components/icons";

const stageGlyph: Record<number, GlyphName> = { 1: "frame", 2: "roundtrip", 3: "branch", 4: "blocks" };

export function ToolingPipeline() {
  const [roleId, setRoleId] = useState("de");
  const role = roleStacks.find((r) => r.id === roleId)!;

  return (
    <Section id="tooling">
      <SectionHeader
        id="tooling"
        title={["The right tool", <em>for each step.</em>]}
        lede="Pick your role to see the tools for each step of the work. Choose one set and stick with it. Too many tools slow you down."
      />

      <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 gap-y-6">
        <div className="relative rounded-card border border-edge bg-card shadow-1 col-span-4 p-4 sm:p-5 lg:col-span-8">
          <RoleMatrix value={roleId} onChange={setRoleId} />
        </div>
        <p className="col-span-4 self-end text-sm leading-relaxed text-ink-3 lg:col-span-3 lg:col-start-10">
          Each row is a role; each column a pipeline stage. A filled cell means the role's recommended stack works in that stage,
          and the figure is how many of that stage's tools it uses. Stage 04, app builders, sits outside every recommended stack.
          Pick a row to see its chain.
        </p>
      </div>

      <TabPanel idPrefix="role" id={roleId} className="mt-12">
        <div className="relative rounded-card border border-edge bg-card shadow-1">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
            <span className="inline-flex items-center gap-1.5">
              <Glyph name="user" className="!size-3.5 [--accent:currentColor]" />
              <span>Recommended pipeline · {role.label}</span>
            </span>
            <span>{role.stages.length} of {toolStages.length} stages active</span>
          </div>
          <div className="plate-field px-5 py-6 sm:px-7">
            <ol aria-label={`${role.label} recommended tool chain`} className="flex flex-wrap items-center gap-3">
              {role.chain.map((c, i) => {
                const isLast = i === role.chain.length - 1;
                return (
                  <li key={c} className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2 ${
                        isLast ? "border-edge bg-accent text-on-accent" : "border-edge bg-card text-ink"
                      }`}
                    >
                      <span className={`font-mono text-label font-normal tabular-nums ${isLast ? "text-on-accent" : "text-ink-3"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <BrandLogosFor text={c} max={3} className="size-4 sm:size-[1.125rem]" />
                      <span className="font-display font-semibold tracking-[-0.02em] text-pretty text-[clamp(1.375rem,2.2vw,2rem)] leading-none">{c}</span>
                    </span>
                    {!isLast && (
                      <span aria-hidden className="font-mono text-base text-ink-3">
                        →
                      </span>
                    )}
                  </li>
                );
              })}
              <li className="ml-auto hidden items-center gap-2 border border-dashed border-line-strong bg-card/80 px-3 py-2 text-xs text-ink-3 lg:inline-flex">
                <span className="font-mono text-label font-normal">Stage 04</span>
                <span>App builders excluded</span>
              </li>
            </ol>
          </div>
          <p className="rounded-b-[calc(var(--radius-card)-1px)] border-t border-line px-[1.125rem] py-3 text-balance bg-card text-sm leading-relaxed text-ink-2">{role.summary}</p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolStages.map((s, i) => {
            const on = role.stages.includes(s.id);
            const highlighted = role.toolsByStage[s.id] ?? [];
            return (
              <li
                key={s.id}
                aria-label={`Stage ${s.id}: ${s.name}${on ? ", in your stack" : ""}`}
                className={`animate-panel-in motion-reduce:animate-fade-in group relative flex flex-col p-5 ${on ? "relative rounded-card border border-edge bg-card shadow-1" : "relative rounded-card border border-dashed border-line-strong bg-transparent shadow-none"}`}
                style={{ animationDelay: `${i * 70}ms` } as CSSProperties}
              >
                <div className="flex items-start justify-between gap-3">
                  <Glyph name={stageGlyph[s.id]} on={on} className={`!size-14 ${on ? "text-ink" : "text-ink-3"}`} />
                  <span className={`font-mono text-label font-normal ${on ? "text-accent-ink" : "text-ink-3"}`}>{on ? "In stack" : "Outside"}</span>
                </div>
                <span className={`font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums mt-5 text-[3.5rem] transition-colors duration-700 ${on ? "text-ink" : "text-ink-3"}`}>0{s.id}</span>
                <h3 className={`mt-4 text-[1.0625rem] font-medium leading-snug tracking-tight transition-colors duration-700 ${on ? "text-ink" : "text-ink-3"}`}>{s.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {s.tools.map((t) => {
                    const hit = highlighted.includes(t);
                    return (
                      <li key={t}>
                        <Tag tone={hit ? "accent" : "neutral"}>{t}</Tag>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-ink-2">{s.capabilities}</p>
                <div className="mt-auto pt-6">
                  <div className={`border-t pt-4 transition-colors duration-700 ${on ? "border-ink" : "border-line"}`}>
                    <span className={`font-mono text-label font-normal mb-1.5 block ${on ? "text-accent-ink" : "text-ink-3"}`}>Human guardrail</span>
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
  const cols = "grid grid-cols-[minmax(6.5rem,1.4fr)_repeat(4,minmax(0,1fr))] gap-x-1 sm:gap-x-1.5";

  return (
    <div>
      <div aria-hidden className={`${cols} border-b-2 border-edge pb-3`}>
        <span className="font-mono text-label font-normal self-end text-ink-3">Role</span>
        {toolStages.map((s) => (
          <span key={s.id} className="flex min-w-0 flex-col">
            <span className="font-mono text-label font-normal text-ink">0{s.id}</span>
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
                <span aria-hidden className={`inline-block size-[7px] shrink-0 rounded-full bg-current text-accent transition-transform duration-500 ease-silk ${on ? "scale-100" : "scale-0"}`} />
                <Glyph name="user" className={`!size-3.5 shrink-0 ${on ? "text-ink" : "text-ink-3"}`} />
                <span>{r.label}</span>
              </span>
              {toolStages.map((s) => {
                const n = r.toolsByStage[s.id]?.length ?? 0;
                const has = r.stages.includes(s.id);
                return (
                  <span
                    key={s.id}
                    aria-hidden
                    className={`grid h-10 place-items-center font-mono text-sm tabular-nums transition-colors duration-500 ${
                      has ? (on ? "bg-accent text-on-accent" : "bg-ink text-paper") : "border border-dashed border-line-strong"
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
