import { useState, type CSSProperties } from "react";
import { roleStacks, toolStages } from "../data/research";
import { Eyebrow, Section, SectionHeader, TabPanel, Tabs } from "../components/ui";

export function ToolingPipeline() {
  const [roleId, setRoleId] = useState("de");
  const role = roleStacks.find((r) => r.id === roleId)!;

  return (
    <Section id="tooling">
      <SectionHeader
        id="tooling"
        index="04"
        kicker="2026 tooling pipeline"
        folio="p. 04 / 06"
        title={["Five stages.", <>Each needs a <em>human check.</em></>]}
        lede="Pick your role to light up the stages and tools in your recommended stack. Commit to one chain; tool sprawl costs more than it saves."
      />

      <div className="grid-12 gap-y-8">
        <div className="col-span-4 lg:col-span-4">
          <Eyebrow>Your role</Eyebrow>
          <Tabs idPrefix="role" label="Your role" variant="segmented" value={roleId} onChange={setRoleId} items={roleStacks.map((r) => ({ id: r.id, label: r.label }))} />
        </div>
      </div>

      <TabPanel idPrefix="role" id={roleId} className="mt-12">
        <div className="grid-12 gap-y-6 border-t border-ink pt-6">
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

        <ol className="mt-14 grid border-y border-line lg:grid-cols-5">
          {toolStages.map((s, i) => {
            const on = role.stages.includes(s.id);
            const highlighted = role.toolsByStage[s.id] ?? [];
            return (
              <li
                key={s.id}
                aria-label={`Stage ${s.id}: ${s.name}${on ? ", in your stack" : ""}`}
                className={`panel-in relative flex flex-col border-line py-8 transition-colors duration-700 lg:px-5 lg:first:pl-0 lg:last:pr-0 ${
                  i > 0 ? "border-t lg:border-l lg:border-t-0" : ""
                }`}
                style={{ animationDelay: `${i * 70}ms` } as CSSProperties}
              >
                <span aria-hidden className={`absolute -top-px left-0 right-0 h-[2px] origin-left bg-accent transition-transform duration-1000 ease-silk ${on ? "scale-x-100" : "scale-x-0"}`} />
                <div className="flex items-baseline justify-between">
                  <span className={`numeral text-[4.5rem] transition-colors duration-700 ${on ? "text-ink" : "text-ink-3"}`}>0{s.id}</span>
                  <span className={`label ${on ? "text-accent-ink" : "text-ink-3"}`}>{on ? "In stack" : "Outside"}</span>
                </div>
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
