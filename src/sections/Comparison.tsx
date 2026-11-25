import { useState, type CSSProperties } from "react";
import { compBenchmarks, compCaveat, compContext, comparison } from "../data/research";
import { BasisBadge, Eyebrow, Lines, Section, SectionHeader, TabPanel, Tabs, useMediaQuery } from "../components/ui";

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
        folio="p. 02 / 06"
        title={["Traditional UX", <>vs. <em>Design Engineer</em></>]}
        lede="How evaluation changes when the portfolio is running software instead of static frames."
      />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Tabs
          idPrefix="cmpview"
          label="Comparison view"
          variant="segmented"
          value={view}
          onChange={(v) => setView(v as View)}
          items={[
            { id: "focus", label: "One at a time" },
            { id: "table", label: "Full matrix" },
          ]}
        />
        <p className="label hidden text-ink-3 sm:block">← → to step through dimensions</p>
      </div>

      {view === "focus" ? (
        <TabPanel idPrefix="cmpview" id="focus">
          <div className="grid-12 gap-y-8">
            <Tabs
              idPrefix="cmpdim"
              label="Comparison dimension"
              variant="list"
              orientation={isLg ? "vertical" : "horizontal"}
              value={String(dim)}
              onChange={(v) => setDim(Number(v))}
              className="col-span-4 lg:col-span-4"
              items={comparison.map((r, i) => ({ id: String(i), label: r.dimension, sub: String(i + 1).padStart(2, "0") }))}
            />
            <div
              role="tabpanel"
              id={`cmpdim-panel-${dim}`}
              aria-labelledby={`cmpdim-tab-${dim}`}
              tabIndex={0}
              key={row.dimension}
              className="stagger col-span-4 lg:col-span-7 lg:col-start-6"
            >
              <div className="card card-flat" style={{ "--i": 0 } as CSSProperties}>
                <p className="card-head label !bg-sunken !text-ink-3">
                  <span>Before · Traditional UX Designer</span>
                </p>
                <p className="max-w-[48ch] px-5 py-6 text-lg leading-relaxed text-ink-3 sm:px-7">{row.traditional}</p>
              </div>
              <div className="card card-accent mt-8" style={{ "--i": 1 } as CSSProperties}>
                <p className="card-head label !bg-accent !text-[var(--on-accent)]">
                  <span>After · Hybrid UX / Design Engineer</span>
                  <span className="tabular">{String(dim + 1).padStart(2, "0")}</span>
                </p>
                <p className="px-5 py-7 font-display text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.08] tracking-tight text-ink sm:px-7">{row.hybrid}</p>
              </div>
            </div>
          </div>
        </TabPanel>
      ) : (
        <TabPanel idPrefix="cmpview" id="table">
          <div className="card overflow-x-auto px-5 sm:px-7">
            <table className="w-full min-w-[720px] text-left">
              <caption className="sr-only">Traditional UX Designer vs. Hybrid UX / Design Engineer</caption>
              <thead>
                <tr className="label border-b-2 border-edge text-ink-3">
                  <th scope="col" className="w-[22%] py-3 pr-6 font-normal">Dimension</th>
                  <th scope="col" className="py-3 pr-6 font-normal">Traditional UX Designer</th>
                  <th scope="col" className="py-3 font-normal text-accent-ink">Hybrid UX / Design Engineer</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r, i) => (
                  <tr key={r.dimension} className="border-b border-line align-top">
                    <th scope="row" className="py-6 pr-6 font-normal">
                      <span className="label mr-3 text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-display text-2xl leading-tight tracking-tight text-ink">{r.dimension}</span>
                    </th>
                    <td className="py-6 pr-6 text-sm leading-relaxed text-ink-3">{r.traditional}</td>
                    <td className="py-6 leading-relaxed text-ink">{r.hybrid}</td>
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
  const rows = compBenchmarks.filter((b) => b.basis === basis).sort((a, b) => b.value - a.value);
  const max = 160000;

  return (
    <div className="grid-12 mt-28 gap-y-14 sm:mt-40">
      <div className="col-span-4 lg:col-span-4">
        <div className="lg:sticky lg:top-24">
          <Eyebrow className="!text-accent-ink">[02.b] — Compensation realities</Eyebrow>
          <Lines as="h3" className="display-l" lines={["Code skills", "carry a", <em>measurable premium.</em>]} />
          <p className="mt-8 max-w-[40ch] leading-relaxed text-ink-2" data-reveal>
            Wages and total pay are different measures. Switch the basis; the bars only ever compare figures from the same dataset.
          </p>
          <aside className="card card-accent mt-8 text-sm leading-relaxed text-ink-2" data-reveal>
            <p className="card-head label">Data caveat</p>
            <p className="px-5 py-4">{compCaveat}</p>
          </aside>
        </div>
      </div>

      <div className="col-span-4 lg:col-span-7 lg:col-start-6">
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

        <TabPanel idPrefix="comp" id={basis} className="mt-10">
          <ul className="card px-5 sm:px-6 [&>li:last-child]:border-b-0">
            {rows.map((r, i) => {
              const hybrid = r.role === "UX Engineer" || r.role === "Software Developer";
              return (
                <li key={r.role} className="border-b border-line py-5" data-reveal="bar" style={{ "--i": i } as CSSProperties}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className={`text-[1.0625rem] tracking-tight ${hybrid ? "font-medium text-ink" : "text-ink-2"}`}>{r.role}</span>
                    <span className={`numeral text-[clamp(2rem,3.2vw,3rem)] ${hybrid ? "text-ink" : "text-ink-3"}`}>{r.display}</span>
                  </div>
                  <div className="bar-track mt-3 !h-[5px]" aria-hidden>
                    <span className={`bar-fill ${hybrid ? "!bg-accent" : "!bg-ink-3"}`} style={{ width: `${(r.value / max) * 100}%` }} />
                  </div>
                  {r.note && <p className="mt-2 text-xs text-ink-3">{r.note}</p>}
                </li>
              );
            })}
          </ul>
          <p className="label mt-4 text-ink-3">US annual median · Source: {rows[0]?.source}</p>
        </TabPanel>

        <div className="mt-16 grid gap-6">
          {compContext.map((c) => (
            <div key={c.label} className="card card-lift grid gap-3 p-5 sm:grid-cols-12 sm:gap-6 sm:p-6" data-reveal>
              <div className="sm:col-span-5">
                <p className="font-medium tracking-tight text-ink">{c.label}</p>
                <div className="mt-2">
                  <BasisBadge basis={c.basis} />
                </div>
              </div>
              <div className="sm:col-span-7">
                <p className="font-display text-2xl leading-tight tracking-tight text-ink">{c.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-3">
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
