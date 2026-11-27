import { useId } from "react";
import { hiringShiftSeries } from "../data/research";
import { BasisBadge } from "./ui";

/* Zero-anchored diverging horizontal bar chart (-60% to +20%, per diagram-design type-bar).
   All figures trace directly to marketMetrics in src/data/research.ts, sorted high -> low. */
const W = 920;
const H = 412;
const PLOT_L = 264;
const PLOT_R = 872;
const MIN_V = -60;
const MAX_V = 20;
const SPAN = MAX_V - MIN_V;
const TOP = 42;
const ROW_H = 38;
const BAR_H = 22;
const TICKS = [-60, -40, -20, 0, 20];

const xOf = (v: number) => PLOT_L + ((v - MIN_V) / SPAN) * (PLOT_R - PLOT_L);
const ZERO_X = xOf(0);
const PLOT_B = TOP + hiringShiftSeries.length * ROW_H + 6;

export function MarketShiftChart() {
  const uid = useId().replace(/:/g, "");
  return (
    <figure className="relative rounded-card border border-edge bg-card shadow-1 mt-8 sm:mt-10" data-reveal>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
        <span>Hiring shift across tech roles</span>
        <BasisBadge basis="analytics" onBand />
      </div>

      <div className="plate-field px-4 py-5 sm:px-6 sm:py-6">
        {/* Compact zero-anchored list for narrow phones so every bar and label fits cleanly without horizontal scroll */}
        <ul aria-label="Hiring shift across tech roles" className="space-y-3 lg:hidden">
          {hiringShiftSeries.map((row) => {
            const positive = row.value > 0;
            const focal = Boolean(row.focal);
            const pctWidth = (Math.abs(row.value) / 60) * 100;
            return (
              <li key={row.label} className="border-b border-line pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className={focal ? "font-semibold text-ink" : "text-ink-2"}>{row.label}</span>
                  <span
                    className={`font-mono tabular-nums ${
                      focal ? "font-semibold text-accent-ink" : positive ? "font-semibold text-ink" : "text-ink-2"
                    }`}
                  >
                    {row.display}
                  </span>
                </div>
                <div className="mt-1.5 grid grid-cols-[3fr_1fr] items-center" aria-hidden>
                  <div className="flex justify-end border-r-[1.5px] border-ink pr-px">
                    {!positive && (
                      <span
                        style={{ width: `${pctWidth}%` }}
                        className={`block h-3.5 ${
                          focal ? "border-2 border-accent bg-accent/25" : "border border-ink-3 bg-ink/15"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex justify-start pl-px">
                    {positive && (
                      <span
                        style={{ width: `${(row.value / 20) * 100}%` }}
                        className="block h-3.5 border border-ink bg-ink"
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby={`${uid}-title`}
          className="mx-auto hidden h-auto w-full max-w-[920px] lg:block"
        >
          <title id={`${uid}-title`}>
            Diverging bar chart comparing tech hiring changes on a shared -60% to +20% scale, sorted high to low: startup software
            engineering +7%, US BLS web and interface design outlook +6%, big-tech software engineering -11%, startup design -22%,
            front-end share of engineering hiring -25%, big-tech marketing -36%, big-tech product management -39%, and big-tech
            design -48%.
          </title>

          {/* Column header labels */}
          <text
            x={PLOT_L - 12}
            y={24}
            textAnchor="end"
            fill="var(--ink-3)"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em" }}
          >
            ROLE / BENCHMARK
          </text>
          <text
            x={ZERO_X - 8}
            y={24}
            textAnchor="end"
            fill="var(--ink-3)"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em" }}
          >
            ← CONTRACTION
          </text>
          <text
            x={ZERO_X + 8}
            y={24}
            textAnchor="start"
            fill="var(--ink-3)"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em" }}
          >
            GROWTH →
          </text>

          {/* Gridlines & 0% baseline */}
          {TICKS.map((t) => {
            const x = xOf(t);
            const isZero = t === 0;
            return (
              <g key={t}>
                <line
                  x1={x}
                  y1={TOP - 6}
                  x2={x}
                  y2={PLOT_B}
                  stroke={isZero ? "var(--ink)" : "var(--line)"}
                  strokeWidth={isZero ? 1.5 : 1}
                />
                <text
                  x={x}
                  y={PLOT_B + 20}
                  textAnchor="middle"
                  fill={isZero ? "var(--ink)" : "var(--ink-3)"}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: isZero ? 500 : 400 }}
                >
                  {t > 0 ? `+${t}%` : `${t}%`}
                </text>
              </g>
            );
          })}

          {/* Rows */}
          {hiringShiftSeries.map((row, i) => {
            const y = TOP + i * ROW_H;
            const cy = y + BAR_H / 2;
            const xVal = xOf(row.value);
            const xStart = Math.min(ZERO_X, xVal);
            const w = Math.abs(xVal - ZERO_X);
            const positive = row.value > 0;
            const focal = Boolean(row.focal);

            return (
              <g key={row.label}>
                {/* Subtle row guide */}
                {i > 0 && (
                  <line x1={8} y1={y - 8} x2={PLOT_R} y2={y - 8} stroke="var(--line)" strokeWidth="0.75" strokeOpacity="0.65" />
                )}
                {/* Category label */}
                <text
                  x={PLOT_L - 12}
                  y={cy + 4}
                  textAnchor="end"
                  fill={focal ? "var(--ink)" : "var(--ink-2)"}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13.5,
                    fontWeight: focal ? 600 : 400,
                  }}
                >
                  {row.label}
                </text>

                {/* Opaque paper mask prevents dot-grid bleed under translucent bar fills */}
                <rect x={xStart} y={y} width={w} height={BAR_H} fill="var(--card)" />
                <rect
                  x={xStart}
                  y={y}
                  width={w}
                  height={BAR_H}
                  fill={focal ? "var(--accent)" : positive ? "var(--ink)" : "var(--ink)"}
                  fillOpacity={focal ? 0.22 : positive ? 0.88 : 0.12}
                  stroke={focal ? "var(--accent)" : positive ? "var(--ink)" : "var(--ink-3)"}
                  strokeWidth={focal ? 2 : 1.25}
                />

                {/* Value label placed outside the bar end */}
                <text
                  x={positive ? xVal + 8 : xVal - 8}
                  y={cy + 4}
                  textAnchor={positive ? "start" : "end"}
                  fill={focal ? "var(--accent-ink)" : positive ? "var(--ink)" : "var(--ink-2)"}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: focal || positive ? 600 : 400,
                  }}
                >
                  {row.display}
                </text>
              </g>
            );
          })}

          {/* Axis title */}
          <text
            x={(PLOT_L + PLOT_R) / 2}
            y={H - 10}
            textAnchor="middle"
            fill="var(--ink-3)"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em" }}
          >
            CHANGE IN HIRING / 10-YEAR OUTLOOK (%) · ZERO-ANCHORED SCALE
          </text>
        </svg>
      </div>

      <figcaption className="rounded-b-[calc(var(--radius-card)-1px)] border-t border-line px-[1.125rem] py-3 text-balance flex flex-wrap items-center justify-between gap-3 bg-card text-sm text-ink-2">
        <span className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="inline-block h-3 w-4 border-2 border-accent bg-accent/20" />
            <span>Biggest drop (−48% big-tech design hiring)</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="inline-block h-3 w-4 border border-ink bg-ink" />
            <span>Net growth</span>
          </span>
        </span>
        <span className="font-mono text-label font-normal text-ink-3">Sorted high → low · SignalFire 2026 &amp; US BLS</span>
      </figcaption>
    </figure>
  );
}
