import { useId } from "react";
import { adoptionBasis, adoptionShift, deTitleShare, shipsAiCode, teamsWhereOthersCreateUi } from "../data/research";
import { BasisBadge } from "./ui";

/* Shared 0-100% dumbbell + bar chart per diagram-design type-bar:
   Top band compares Developers vs Designers on the exact same 0-100% scale (hollow vs solid
   dots with >=3:1 ink stroke and connector); bottom band shows Q1 2026 convergence on the same axis. */
const W = 840;
const H = 372;
const PLOT_L = 344;
const PLOT_R = 796;
const TICKS = [0, 25, 50, 75, 100];
const xOf = (pct: number) => Math.round(PLOT_L + (pct / 100) * (PLOT_R - PLOT_L));

const devCode = adoptionShift.before.rows[0].value; // 68
const devCore = adoptionShift.before.rows[1].value; // 59
const desCore = adoptionShift.before.rows[2].value; // 31
const desDraft = adoptionShift.before.rows[3].value; // 22

/* Row 2 pairs two different tasks (writing code vs. drafting UI), so it is labelled per group
   and shows no gap: the points are not a like-for-like difference. */
const dumbbells = [
  { lines: ["Use AI for core work"], designer: desCore, developer: devCore, y: 84, sameTask: true },
  { lines: ["Developers: AI writes code", "Designers: AI drafts UI"], designer: desDraft, developer: devCode, y: 136, sameTask: false },
];

const convergence = adoptionShift.after.rows.map((r, i) => ({
  label: r.who,
  value: r.value,
  focal: i === 0,
  y: 222 + i * 40,
}));

export function AdoptionDumbbell({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <figure className={`relative rounded-card border border-edge bg-card shadow-1 ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
        <h3 className="m-0">AI adoption: divergence, then convergence</h3>
        <span className="flex items-center gap-4">
          <span className="hidden sm:block">Shared 0–100% scale</span>
          {adoptionBasis.before === adoptionBasis.after && <BasisBadge basis={adoptionBasis.before} onBand />}
        </span>
      </div>

      <div tabIndex={0} role="region" aria-label="AI adoption chart (scrolls sideways)" className="plate-field overflow-x-auto px-4 py-5 sm:px-6 focus-visible:outline-offset-[-2px]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby={`${uid}-title`}
          className="mx-auto block h-auto w-full min-w-[580px] max-w-[840px]"
        >
          <title id={`${uid}-title`}>
            {`Shared 0 to 100 percent chart of 2025 AI use: for core work, designers ${desCore}% vs developers ${devCore}%; for different tasks, developers who ask AI to write code ${devCode}% and designers who use AI for first UI drafts ${desDraft}%. Then Q1 2026 survey: ${shipsAiCode.value}% of surveyed designers ship AI-written code, ${teamsWhereOthersCreateUi.value}% of teams have PMs or engineers creating UI, ${deTitleShare.value}% of those designers use the Design Engineer title.`}
          </title>

          {/* Vertical 0-100% gridlines */}
          {TICKS.map((t) => {
            const x = xOf(t);
            const isFloor = t === 0;
            return (
              <g key={t}>
                <line
                  x1={x}
                  y1={42}
                  x2={x}
                  y2={334}
                  stroke={isFloor ? "var(--ink-3)" : "var(--line)"}
                  strokeWidth={isFloor ? 1.25 : 1}
                />
                <text
                  x={x}
                  y={354}
                  textAnchor="middle"
                  fill="var(--ink-3)"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
                >
                  {t}%
                </text>
              </g>
            );
          })}

          {/* Band 1 header: 2025 divergence */}
          <text
            x={8}
            y={46}
            fill="var(--ink-3)"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em" }}
          >
            2025 DIVERGENCE · {adoptionShift.before.label.toUpperCase()}
          </text>

          {/* Dumbbell rows */}
          {dumbbells.map((d) => {
            const xDes = xOf(d.designer);
            const xDev = xOf(d.developer);
            const xLeft = Math.min(xDes, xDev);
            const xRight = Math.max(xDes, xDev);
            const gap = d.developer - d.designer;
            return (
              <g key={d.lines.join(" ")}>
                <text
                  x={PLOT_L - 14}
                  y={d.y + 4 - (d.lines.length - 1) * 8}
                  textAnchor="end"
                  fill="var(--ink)"
                  style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500 }}
                >
                  {d.lines.map((l, i) => (
                    <tspan key={l} x={PLOT_L - 14} dy={i === 0 ? 0 : 16}>
                      {l}
                    </tspan>
                  ))}
                </text>
                {/* Connector drawn before dots; uses --line-strong (>=3.3:1 in both themes) */}
                <line x1={xLeft} y1={d.y} x2={xRight} y2={d.y} stroke="var(--line-strong)" strokeWidth="2" />
                {/* Gap label centered above connector */}
                {d.sameTask && (
                  <text
                    x={(xLeft + xRight) / 2}
                    y={d.y - 11}
                    textAnchor="middle"
                    fill="var(--ink-3)"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
                  >
                    +{gap} pts
                  </text>
                )}
                {/* Designers (hollow reference dot) */}
                <circle cx={xDes} cy={d.y} r={6.5} fill="var(--card)" stroke="var(--ink-2)" strokeWidth="2" />
                {/* Developers (solid accent focal dot with 1.25px ink outline for >=3:1 non-text contrast) */}
                <circle cx={xDev} cy={d.y} r={6.5} fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.25" />
                {/* Outside endpoint labels */}
                <text
                  x={xLeft - 12}
                  y={d.y + 4}
                  textAnchor="end"
                  fill="var(--ink-2)"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
                >
                  {d.designer}%
                </text>
                <text
                  x={xRight + 12}
                  y={d.y + 4}
                  textAnchor="start"
                  fill="var(--accent-ink)"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600 }}
                >
                  {d.developer}%
                </text>
              </g>
            );
          })}

          {/* Divider between 2025 and 2026 */}
          <line x1={8} y1={174} x2={PLOT_R} y2={174} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Band 2 header: Q1 2026 convergence */}
          <text
            x={8}
            y={198}
            fill="var(--accent-ink)"
            style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em" }}
          >
            2026 CONVERGENCE · {adoptionShift.after.label.toUpperCase()}
          </text>

          {/* Shared-scale bars */}
          {convergence.map((c) => {
            const w = xOf(c.value) - PLOT_L;
            return (
              <g key={c.label}>
                <text
                  x={PLOT_L - 14}
                  y={c.y + 15}
                  textAnchor="end"
                  fill={c.focal ? "var(--ink)" : "var(--ink-2)"}
                  style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: c.focal ? 600 : 400 }}
                >
                  {/* Long labels break onto two lines so they never run past the left edge of the chart. */}
                  {(() => {
                    const label = c.label.replace(/ /g, " ");
                    if (label.length <= 44) return c.label;
                    const mid = label.lastIndexOf(" ", Math.ceil(label.length / 2));
                    return (
                      <>
                        <tspan x={PLOT_L - 14} dy={-7.5}>{label.slice(0, mid)}</tspan>
                        <tspan x={PLOT_L - 14} dy={15}>{label.slice(mid + 1)}</tspan>
                      </>
                    );
                  })()}
                </text>
                <rect x={PLOT_L} y={c.y} width={w} height={22} fill="var(--card)" />
                <rect
                  x={PLOT_L}
                  y={c.y}
                  width={w}
                  height={22}
                  fill={c.focal ? "var(--accent)" : "var(--ink)"}
                  fillOpacity={c.focal ? 0.22 : 0.14}
                  stroke={c.focal ? "var(--accent)" : "var(--ink-3)"}
                  strokeWidth={c.focal ? 2 : 1.25}
                />
                <text
                  x={PLOT_L + w + 10}
                  y={c.y + 15}
                  textAnchor="start"
                  fill={c.focal ? "var(--accent-ink)" : "var(--ink-2)"}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: c.focal ? 600 : 400 }}
                >
                  {c.value}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="rounded-b-[calc(var(--radius-card)-1px)] border-t border-line px-[1.125rem] py-3 text-balance flex flex-wrap items-center justify-between gap-3 bg-card text-sm text-ink-2">
        <span className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <span className="inline-flex items-center gap-2">
            <svg aria-hidden viewBox="0 0 14 14" className="size-3.5 shrink-0">
              <circle cx="7" cy="7" r="5" fill="var(--card)" stroke="var(--ink-2)" strokeWidth="2" />
            </svg>
            <span>Designers (2025)</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <svg aria-hidden viewBox="0 0 14 14" className="size-3.5 shrink-0">
              <circle cx="7" cy="7" r="5" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.25" />
            </svg>
            <span>Developers (2025)</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="inline-block h-3 w-4 border-2 border-accent bg-accent/20" />
            <span>Q1 2026 focal share</span>
          </span>
        </span>
        <span className="font-mono text-label font-normal text-ink-3">% of respondents</span>
      </figcaption>
    </figure>
  );
}
