import { useState, type CSSProperties } from "react";
import { comparison } from "../data/research";
import { Section, SectionHeader, TabPanel, Tabs, useMediaQuery } from "../components/ui";

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
        glyph="compare"
        plate="Two roles"
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

    </Section>
  );
}
