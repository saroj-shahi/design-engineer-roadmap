import { useState } from "react";
import { compBenchmarks, compCaveat, compContext, comparison } from "../data/research";
import { BasisBadge, Eyebrow, Section, SectionHeader, TabPanel, Tabs, useMediaQuery } from "../components/ui";

type View = "focus" | "table";

export function Comparison() {
  const [view, setView] = useState<View>("focus");
  const [dim, setDim] = useState(0);
  const row = comparison[dim];
  const isLg = useMediaQuery("(min-width: 1024px)");

  return (
    <Section id="compare">
      <SectionHeader
        id="compare"
        index="02"
        kicker="Role comparison"
        title={
          <>
            Traditional UX Designer vs. <span className="italic">Design Engineer</span>
          </>
        }
        lede="How evaluation changes when the portfolio is running software instead of static frames."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Tabs
          idPrefix="cmpview"
          label="Comparison view"
          variant="segmented"
          value={view}
          onChange={(v) => setView(v as View)}
          items={[
            { id: "focus", label: "Focus" },
            { id: "table", label: "Full matrix" },
          ]}
        />
        <p className="font-mono text-xs text-ink-3">Use ← → to move between dimensions</p>
      </div>

      {view === "focus" ? (
        <TabPanel idPrefix="cmpview" id="focus">
          <div className="grid gap-6 lg:grid-cols-12">
            <Tabs
              idPrefix="cmpdim"
              label="Comparison dimension"
              variant="list"
              orientation={isLg ? "vertical" : "horizontal"}
              value={String(dim)}
              onChange={(v) => setDim(Number(v))}
              className="lg:col-span-4"
              items={comparison.map((r, i) => ({ id: String(i), label: r.dimension, sub: isLg ? `0${i + 1}` : undefined }))}
            />
            <div
              role="tabpanel"
              id={`cmpdim-panel-${dim}`}
              aria-labelledby={`cmpdim-tab-${dim}`}
              tabIndex={0}
              key={row.dimension}
              className="fade-in grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:col-span-8"
            >
              <div className="bg-surface p-6 sm:p-8">
                <Eyebrow>Traditional UX Designer</Eyebrow>
                <p className="text-lg leading-relaxed text-ink-2">{row.traditional}</p>
              </div>
              <div className="relative bg-surface p-6 sm:p-8">
                <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-accent" />
                <Eyebrow>
                  <span className="text-accent-ink">Hybrid UX / Design Engineer</span>
                </Eyebrow>
                <p className="text-lg leading-relaxed text-ink">{row.hybrid}</p>
              </div>
            </div>
          </div>
        </TabPanel>
      ) : (
        <TabPanel idPrefix="cmpview" id="table">
          <div className="overflow-x-auto rounded-md border border-line bg-surface">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Traditional UX Designer vs. Hybrid UX / Design Engineer</caption>
              <thead>
                <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-ink-3">
                  <th scope="col" className="w-1/5 p-4 font-normal">Dimension</th>
                  <th scope="col" className="p-4 font-normal">Traditional UX Designer</th>
                  <th scope="col" className="p-4 font-normal text-accent-ink">Hybrid UX / Design Engineer</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r) => (
                  <tr key={r.dimension} className="border-b border-line align-top last:border-0">
                    <th scope="row" className="p-4 font-medium text-ink">{r.dimension}</th>
                    <td className="p-4 leading-relaxed text-ink-2">{r.traditional}</td>
                    <td className="p-4 leading-relaxed text-ink">{r.hybrid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>
      )}

      <CompensationPanel />
    </Section>
  );
}

function CompensationPanel() {
  const [basis, setBasis] = useState<"base" | "total">("total");
  const rows = compBenchmarks.filter((b) => b.basis === basis).sort((a, b) => a.value - b.value);
  const max = 160000;

  return (
    <div className="mt-16 grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Eyebrow>02.b · Compensation realities</Eyebrow>
        <h3 className="font-serif text-3xl leading-tight tracking-tight">Code skills carry a measurable premium.</h3>
        <p className="mt-4 leading-relaxed text-ink-2">
          Wages and total pay are different measures. Toggle the basis; bars only compare figures from the same dataset.
        </p>
        <aside className="mt-6 rounded-md border border-dashed border-line-strong p-4 text-sm leading-relaxed text-ink-2">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-accent-ink">Data caveat</p>
          {compCaveat}
        </aside>
      </div>

      <div className="lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            idPrefix="comp"
            label="Compensation basis"
            variant="segmented"
            value={basis}
            onChange={(v) => setBasis(v as "base" | "total")}
            items={[
              { id: "total", label: "Total pay · Glassdoor" },
              { id: "base", label: "Base wage · BLS" },
            ]}
          />
          <BasisBadge basis={basis} />
        </div>

        <TabPanel idPrefix="comp" id={basis} className="mt-6">
          <ul className="space-y-5">
            {rows.map((r) => {
              const hybrid = r.role === "UX Engineer" || r.role === "Software Developer";
              return (
                <li key={r.role}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className={`text-sm ${hybrid ? "font-medium text-ink" : "text-ink-2"}`}>{r.role}</span>
                    <span className="font-mono text-sm tabular text-ink">{r.display}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-sm bg-sunken" aria-hidden>
                    <div
                      className={`h-full rounded-sm transition-[width] duration-500 ease-out ${hybrid ? "bg-accent" : "bg-line-strong"}`}
                      style={{ width: `${(r.value / max) * 100}%` }}
                    />
                  </div>
                  {r.note && <p className="mt-1.5 text-xs text-ink-3">{r.note}</p>}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 font-mono text-[10px] text-ink-3">
            US annual median · Source: {rows[0]?.source}
          </p>
        </TabPanel>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {compContext.map((c) => (
            <div key={c.label} className="grid gap-2 py-4 sm:grid-cols-12 sm:gap-4">
              <div className="sm:col-span-4">
                <p className="text-sm font-medium text-ink">{c.label}</p>
                <div className="mt-1.5">
                  <BasisBadge basis={c.basis} />
                </div>
              </div>
              <div className="sm:col-span-8">
                <p className="font-mono text-sm text-ink">{c.value}</p>
                <p className="mt-1 text-xs text-ink-3">
                  {c.note ? `${c.note} ` : ""}
                  {c.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
