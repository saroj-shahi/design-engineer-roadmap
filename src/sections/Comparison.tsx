import { useState, type CSSProperties } from "react";
import { comparison } from "../data/research";
import { Glyph } from "../components/icons";
import { Hint, Section, SectionHeader, TabPanel, Tabs, useMediaQuery } from "../components/ui";

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
        glyph="compare"
        title={["What changes", <>when you <em>build it too.</em></>]}
        lede="Two valid ways to do design work, side by side — how they differ day to day and when teams evaluate them."
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
        {view === "focus" && <Hint keys={["←", "→"]} touch="Tap a dimension" className="hidden text-ink-3 sm:inline-flex">Pick a dimension, or step with</Hint>}
      </div>

      {view === "focus" ? (
        <TabPanel idPrefix="cmpview" id="focus">
          <div className="grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 gap-y-8">
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
              className="[&>*]:animate-panel-in [&>*]:[animation-delay:calc(var(--i,0)*60ms)] motion-reduce:[&>*]:animate-fade-in col-span-4 lg:col-span-7 lg:col-start-6"
            >
              {/* Two valid paths given equal weight: same card, same type size */}
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { who: "Design-first UX designer", text: row.traditional },
                  { who: "Design engineer (design + code)", text: row.hybrid },
                ].map((c, i) => (
                  <div key={c.who} className="relative rounded-card border border-edge bg-card shadow-1 flex flex-col" style={{ "--i": i } as CSSProperties}>
                    <p className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
                      <span className="inline-flex items-center gap-1.5">
                        <Glyph name="user" className="!size-3.5 [--accent:currentColor]" />
                        <span>{c.who}</span>
                      </span>
                    </p>
                    <p className="px-5 py-6 font-display font-semibold tracking-[-0.02em] text-pretty text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15] text-ink sm:px-6">{c.text}</p>
                  </div>
                ))}
              </div>
              <p className="font-mono text-label font-normal mt-5 text-ink-3" style={{ "--i": 2 } as CSSProperties}>
                {String(dim + 1).padStart(2, "0")} / {String(comparison.length).padStart(2, "0")} · {row.dimension}
              </p>
            </div>
          </div>
        </TabPanel>
      ) : (
        <TabPanel idPrefix="cmpview" id="table">
          <div className="relative rounded-card border border-edge bg-card shadow-1 overflow-x-auto px-5 sm:px-7">
            <table className="w-full min-w-[720px] text-left">
              <caption className="sr-only">Design-first UX designer and design engineer, compared</caption>
              <thead>
                <tr className="font-mono text-label font-normal border-b-2 border-edge text-ink-3">
                  <th scope="col" className="w-[22%] py-3 pr-6 font-normal">Dimension</th>
                  <th scope="col" className="py-3 pr-6 font-normal">Design-first UX designer</th>
                  <th scope="col" className="py-3 font-normal">Design engineer (design + code)</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r) => (
                  <tr key={r.dimension} className="border-b border-line align-top">
                    <th scope="row" className="py-6 pr-6 font-normal">
                      <span className="font-display font-semibold tracking-[-0.02em] text-pretty text-2xl leading-tight text-ink">{r.dimension}</span>
                    </th>
                    <td className="py-6 pr-6 leading-relaxed text-ink-2">{r.traditional}</td>
                    <td className="py-6 leading-relaxed text-ink-2">{r.hybrid}</td>
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
