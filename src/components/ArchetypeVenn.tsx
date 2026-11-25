import { useId, useState } from "react";
import { skillMap, type ArchetypeId, type SkillRegion } from "../data/research";

/* Geometry in viewBox units (divisible by 4 per diagram-design type-venn).
   Three equal circles with generous outer margin so full role names sit cleanly
   outside the strokes — never crossing a circle outline. */
const W = 680;
const H = 592;
const R = 152;
const C: Record<ArchetypeId, { x: number; y: number }> = {
  de: { x: 340, y: 212 },
  meta: { x: 256, y: 356 },
  ax: { x: 424, y: 356 },
};
const ALL: ArchetypeId[] = ["de", "meta", "ax"];

/** Outside-stroke set labels (title + track subtitle) cleanly outside circle bounds (bottom edge = 508). */
const setLabel: Record<ArchetypeId, { x: number; y: number; align: "middle" | "start" | "end"; name: string; sub: string }> = {
  de: { x: 340, y: 28, align: "middle", name: "Design Engineer", sub: "CODE TRACK" },
  meta: { x: 96, y: 542, align: "start", name: "Meta-Designer", sub: "SYSTEMS TRACK" },
  ax: { x: 584, y: 542, align: "end", name: "AX Designer", sub: "AI AGENT TRACK" },
};

const anchor: Record<string, { x: number; y: number }> = {
  "de-meta": { x: 268, y: 268 },
  "de-ax": { x: 412, y: 268 },
  "meta-ax": { x: 340, y: 428 },
  core: { x: 340, y: 312 },
};
const code: Record<ArchetypeId, string> = { de: "DE", meta: "META", ax: "AX" };

const overlaps = skillMap.filter((r) => r.sets.length > 1);
const marker = (r: SkillRegion) => String(overlaps.indexOf(r) + 1);

/** Skill map: the three archetypes as overlapping fields, with a written key that carries every detail.
 *  Follows diagram-design Venn grammar: full role labels sit outside the circle strokes, subtle
 *  compoundable fills clarify intersections, and coral accents the single focal core (plus hover). */
export function ArchetypeVenn({ selected }: { selected: string }) {
  const uid = useId().replace(/:/g, "");
  const [hot, setHot] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const activeRegion = hot ?? pinned;

  const keyProps = (rid: string) => ({
    type: "button" as const,
    "aria-pressed": pinned === rid,
    onPointerEnter: () => setHot(rid),
    onFocus: () => setHot(rid),
    onBlur: () => setHot(pinned),
    onClick: () => {
      const next = pinned === rid ? null : rid;
      setPinned(next);
      setHot(next);
    },
  });
  const id = (s: string) => `${uid}-${s}`;

  return (
    <div className="grid-12 gap-y-10">
      <figure className="card col-span-4 flex flex-col shadow-[var(--sh-1)] lg:col-span-7">
        <figcaption className="card-head label">
          <span>Skill map · three overlapping roles</span>
          <span className="hidden sm:inline">Hover or tap a region</span>
        </figcaption>
        <div className="plate-field flex-1 p-3 sm:p-6">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-labelledby={id("title")}
            className="mx-auto block h-auto w-full max-w-[720px] overflow-visible"
            onPointerLeave={() => setHot(pinned)}
          >
            <title id={id("title")}>
              Venn diagram of the Design Engineer, Meta-Designer and AX Designer archetypes. Each has its own skills, each pair shares
              one, and all three share a focal core of visual taste and problem framing. The key lists every region.
            </title>
            <defs>
              {ALL.map((s) => (
                <clipPath key={s} id={id(`clip-${s}`)}>
                  <circle cx={C[s].x} cy={C[s].y} r={R} />
                </clipPath>
              ))}
              {skillMap.map((r) => {
                const out = ALL.filter((s) => !r.sets.includes(s));
                return (
                  <mask key={r.id} id={id(`out-${r.id}`)} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
                    <rect width={W} height={H} fill="white" />
                    {out.map((s) => (
                      <circle key={s} cx={C[s].x} cy={C[s].y} r={R} fill="black" />
                    ))}
                  </mask>
                );
              })}
              <pattern id={id("hatch")} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="var(--accent)" strokeWidth="1.25" strokeOpacity="0.45" />
              </pattern>
            </defs>

            {/* Subtle compoundable base tints so pairwise overlaps naturally read deeper */}
            {ALL.map((s) => (
              <circle
                key={`base-${s}`}
                cx={C[s].x}
                cy={C[s].y}
                r={R}
                fill="var(--ink)"
                fillOpacity="0.045"
                pointerEvents="none"
              />
            ))}

            {/* Interactive regions: clip by every circle the region is in, mask out the ones it isn't. */}
            {skillMap.map((r) => {
              const on = activeRegion === r.id;
              const isCore = r.id === "core";
              const isSel = r.sets.length === 1 && r.sets[0] === selected;
              const fill = on
                ? "color-mix(in srgb, var(--accent) 26%, transparent)"
                : isCore
                  ? `url(#${id("hatch")})`
                  : isSel
                    ? "color-mix(in srgb, var(--ink) 7%, transparent)"
                    : "transparent";
              const shape = (
                <rect
                  width={W}
                  height={H}
                  fill={fill}
                  mask={`url(#${id(`out-${r.id}`)})`}
                  className="cursor-pointer transition-[fill] duration-300"
                  onPointerEnter={() => setHot(r.id)}
                  onClick={() => {
                    const next = pinned === r.id ? null : r.id;
                    setPinned(next);
                    setHot(next);
                  }}
                />
              );
              return (
                <g key={r.id} data-region={r.id}>
                  {r.sets.reduceRight<JSX.Element>(
                    (inner, s) => (
                      <g clipPath={`url(#${id(`clip-${s}`)})`}>{inner}</g>
                    ),
                    shape,
                  )}
                </g>
              );
            })}

            {/* Outlines on top */}
            {ALL.map((s) => {
              const on = s === selected;
              return (
                <circle
                  key={s}
                  cx={C[s].x}
                  cy={C[s].y}
                  r={R}
                  fill="none"
                  stroke={on ? "var(--accent)" : "var(--ink)"}
                  strokeWidth={on ? 2.25 : 1.25}
                  strokeOpacity={on ? 1 : 0.7}
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                  className="transition-[stroke] duration-300"
                />
              );
            })}

            {/* Outside-stroke set labels (never cross circle strokes) */}
            <g pointerEvents="none" aria-hidden>
              {ALL.map((s) => {
                const l = setLabel[s];
                const isSel = s === selected;
                return (
                  <g key={`lbl-${s}`}>
                    <text
                      x={l.x}
                      y={l.y}
                      textAnchor={l.align}
                      fill={isSel ? "var(--accent-ink)" : "var(--ink)"}
                      style={{ fontFamily: "var(--font-display)", fontStretch: "72%", fontWeight: 600, fontSize: 24, letterSpacing: "-0.015em" }}
                    >
                      {l.name}
                    </text>
                    <text
                      x={l.x}
                      y={l.y + 18}
                      textAnchor={l.align}
                      fill="var(--ink-3)"
                      style={{ fontFamily: "var(--font-mono)", fontStretch: "87.5%", fontSize: 11, letterSpacing: "0.08em" }}
                    >
                      {l.sub}
                    </text>
                  </g>
                );
              })}

              {/* Overlap markers: coral marks the single focal sweet spot (4 · Shared core) */}
              {overlaps.map((r) => {
                const a = anchor[r.id];
                const isCore = r.id === "core";
                const on = activeRegion === r.id;
                const accentBox = on || isCore;
                return (
                  <g key={r.id} transform={`translate(${a.x} ${a.y})`}>
                    <rect
                      x={isCore ? -18 : -14}
                      y={isCore ? -18 : -14}
                      width={isCore ? 36 : 28}
                      height={isCore ? 36 : 28}
                      fill={accentBox ? "var(--accent)" : "var(--card)"}
                      stroke={accentBox ? "var(--edge)" : "var(--ink)"}
                      strokeWidth="1.75"
                      className="transition-[fill] duration-300"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={accentBox ? "var(--on-accent)" : "var(--ink)"}
                      style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: isCore ? 16 : 14 }}
                    >
                      {marker(r)}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        <div className="card-foot flex flex-wrap items-center justify-between gap-3 bg-card text-xs text-ink-2">
          {(() => {
            const focused = skillMap.find((r) => r.id === activeRegion) ?? skillMap.find((r) => r.id === "core")!;
            const isOverlap = focused.sets.length > 1;
            const badge = isOverlap ? `${marker(focused)} · ` : `${code[focused.sets[0]]} · `;
            return (
              <span className="flex items-center gap-2">
                <span aria-hidden className="inline-block size-3 shrink-0 border border-edge bg-accent" />
                <span>
                  <strong className="font-medium text-ink">
                    {badge}
                    {focused.name}:
                  </strong>{" "}
                  {focused.detail}
                </span>
              </span>
            );
          })()}
          <span className="label text-ink-3">Outline = selected role</span>
        </div>
      </figure>

      {/* Key: carries all the words, so the diagram stays legible at phone width. */}
      <div className="col-span-4 lg:col-span-5 lg:col-start-8 lg:self-center" onPointerLeave={() => setHot(pinned)}>
        <p className="label mb-4 text-ink-3">Key</p>
        <ul className="border-t border-ink">
          {skillMap
            .filter((r) => r.sets.length === 1)
            .map((r) => {
              const s = r.sets[0];
              return (
                <li key={r.id} className="border-b border-line">
                  <button
                    {...keyProps(r.id)}
                    className={`grid w-full grid-cols-[3.5rem_1fr] gap-x-3 px-2 py-4 text-left transition-colors duration-300 ${activeRegion === r.id ? "bg-sunken" : ""}`}
                  >
                    <span className={`label pt-1 ${s === selected ? "text-accent-ink" : "text-ink"}`}>{code[s]}</span>
                    <div>
                      <p className="font-medium tracking-tight text-ink">
                        {r.name} <span className="font-normal text-ink-3">· {r.detail}</span>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-2">{r.skills?.join(" / ")}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          {overlaps.map((r) => {
            const isCore = r.id === "core";
            const on = activeRegion === r.id;
            return (
              <li key={r.id} className="border-b border-line">
                <button
                  {...keyProps(r.id)}
                  className={`grid w-full grid-cols-[3.5rem_1fr] gap-x-3 px-2 py-4 text-left transition-colors duration-300 ${on ? "bg-sunken" : ""}`}
                >
                  <span className="pt-0.5">
                    <span
                      className={`label inline-grid size-6 place-items-center border ${
                        on || isCore ? "border-edge bg-accent text-[var(--on-accent)]" : "border-ink bg-card text-ink"
                      }`}
                    >
                      {marker(r)}
                    </span>
                  </span>
                  <div>
                    <p className="font-medium tracking-tight text-ink">
                      {r.name}{" "}
                      <span className="font-normal text-ink-3">· {r.sets.length === 3 ? "all three" : r.sets.map((s) => code[s]).join(" + ")}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{r.detail}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
