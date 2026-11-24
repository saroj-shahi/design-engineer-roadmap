import { useState } from "react";
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
        title={
          <>
            Five stages. Every one needs <span className="italic">a human check.</span>
          </>
        }
        lede="Pick your role to light up the stages and tools in your recommended stack. Standardize on one chain to avoid tool fatigue."
      />

      <Tabs
        idPrefix="role"
        label="Your role"
        variant="segmented"
        value={roleId}
        onChange={setRoleId}
        items={roleStacks.map((r) => ({ id: r.id, label: r.label }))}
      />

      <TabPanel idPrefix="role" id={roleId} className="mt-6">
        <div className="rounded-md border border-line bg-surface p-5 sm:p-6">
          <Eyebrow>Recommended chain · {role.label}</Eyebrow>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
            {role.chain.map((c, i) => (
              <li key={c} className="flex items-center gap-2">
                <span className="rounded-[3px] border border-ink bg-ink px-2 py-1 font-mono text-xs text-paper">{c}</span>
                {i < role.chain.length - 1 && (
                  <span aria-hidden className="font-mono text-ink-3">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="prose-measure mt-4 text-sm leading-relaxed text-ink-2">{role.summary}</p>
        </div>

        <ol className="relative mt-8 grid gap-3 lg:grid-cols-5">
          {/* connector rail */}
          <span aria-hidden className="absolute left-0 right-0 top-[18px] hidden h-px bg-line lg:block" />
          {toolStages.map((s) => {
            const on = role.stages.includes(s.id);
            const highlighted = role.toolsByStage[s.id] ?? [];
            return (
              <li
                key={s.id}
                aria-label={`Stage ${s.id}: ${s.name}${on ? ", in your stack" : ""}`}
                className={`relative flex flex-col transition-opacity duration-300 ${on ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
              >
                <span
                  className={`relative z-10 grid size-9 place-items-center rounded-full border font-mono text-xs transition-colors duration-300 ${
                    on ? "border-accent bg-accent text-white" : "border-line-strong bg-paper text-ink-3"
                  }`}
                >
                  {s.id}
                </span>
                <div className={`mt-3 flex flex-1 flex-col rounded-md border p-4 transition-colors duration-300 ${on ? "border-ink bg-surface" : "border-line bg-transparent"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium leading-snug text-ink">{s.name}</h3>
                  </div>
                  <p className={`mt-1 font-mono text-[10px] uppercase tracking-wider ${on ? "text-accent-ink" : "text-ink-3"}`}>
                    {on ? "In your stack" : "Outside this stack"}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1">
                    {s.tools.map((t) => {
                      const hit = highlighted.includes(t);
                      return (
                        <li
                          key={t}
                          className={`rounded-[3px] border px-1.5 py-0.5 font-mono text-[10.5px] leading-4 ${
                            hit ? "border-accent/50 bg-accent-soft text-accent-ink" : "border-line text-ink-3"
                          }`}
                        >
                          {t}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 text-xs leading-relaxed text-ink-2">{s.capabilities}</p>
                  <div className={`mt-auto pt-4`}>
                    <div className={`rounded border-l-2 py-2 pl-3 pr-2 text-xs leading-relaxed ${on ? "border-accent bg-accent-soft/60 text-ink" : "border-line-strong text-ink-3"}`}>
                      <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-wider">Human guardrail</span>
                      {s.guardrail}
                    </div>
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
