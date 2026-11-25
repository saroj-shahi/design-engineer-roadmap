import { useId } from "react";
import { adoptionShift } from "../data/research";

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

const dumbbells = [
  { label: "Use AI for core work", designer: desCore, developer: devCore, y: 84 },
  { label: "AI code vs. first UI drafts", designer: desDraft, developer: devCode, y: 136 },
];

const convergence = adoptionShift.after.rows.map((r, i) => ({
  label: r.who,
  value: r.value,
  focal: i === 0,
  y: 222 + i * 40,
}));

export function AdoptionDumbbell() {
  const uid = useId().replace(/:/g, "");
  return (
    <figure className="card">
      <div className="card-head label">
        <h4 className="m-0">AI adoption: divergence, then convergence</h4>
        <span className="hidden sm:block">Shared 0–100% scale</span>
      </div>

      <div className="plate-field overflow-x-auto px-4 py-5 sm:px-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby={`${uid}-title`}
          className="mx-auto block h-auto w-full min-w-[580px] max-w-[840px]"
        >
          <title id={`${uid}-title`}>
            Shared 0 to 100 percent chart comparing 2025 developer and designer AI adoption gaps (core work 31% vs 59%, drafts vs code
            22% vs 68%) with Q1 2026 convergence (50% of designers ship AI-written code, 40% of teams have PMs or engineers creating UI,
            20% of those designers use the Design Engineer title).
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
                  style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}
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
            style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em" }}
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
              <g key={d.label}>
                <text
                  x={PLOT_L - 14}
                  y={d.y + 4}
                  textAnchor="end"
                  fill="var(--ink)"
                  style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500 }}
                >
                  {d.label}
                </text>
                {/* Connector drawn before dots; uses --line-strong (>=3.3:1 in both themes) */}
                <line x1={xLeft} y1={d.y} x2={xRight} y2={d.y} stroke="var(--line-strong)" strokeWidth="2" />
                {/* Gap label centered above connector */}
                <text
                  x={(xLeft + xRight) / 2}
                  y={d.y - 11}
                  textAnchor="middle"
                  fill="var(--ink-3)"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                >
                  +{gap} pts
                </text>
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
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11.5 }}
                >
                  {d.designer}%
                </text>
                <text
                  x={xRight + 12}
                  y={d.y + 4}
                  textAnchor="start"
                  fill="var(--accent-ink)"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 600 }}
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
            style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em" }}
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
                  {c.label}
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
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: c.focal ? 600 : 400 }}
                >
                  {c.value}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="card-foot flex flex-wrap items-center justify-between gap-3 bg-card text-xs text-ink-2">
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
        <span className="label text-ink-3">% of respondents</span>
      </figcaption>
    </figure>
  );
}
