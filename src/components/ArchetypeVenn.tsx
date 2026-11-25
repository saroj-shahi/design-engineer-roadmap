import { useId, useState } from "react";
import { skillMap, type ArchetypeId, type SkillRegion } from "../data/research";

/* Geometry in viewBox units. Three equal circles, each pair overlapping by ~half a radius. */
const R = 165;
const C: Record<ArchetypeId, { x: number; y: number }> = {
  de: { x: 300, y: 195 },
  meta: { x: 212, y: 350 },
  ax: { x: 388, y: 350 },
};
const ALL: ArchetypeId[] = ["de", "meta", "ax"];
const W = 600;
const H = 540;

/** Where each region's label sits (checked to fall inside exactly that region). */
const anchor: Record<string, { x: number; y: number }> = {
  de: { x: 300, y: 98 },
  meta: { x: 120, y: 428 },
  ax: { x: 480, y: 428 },
  "de-meta": { x: 228, y: 256 },
  "de-ax": { x: 372, y: 256 },
  "meta-ax": { x: 300, y: 432 },
  core: { x: 300, y: 303 },
};
const code: Record<ArchetypeId, string> = { de: "DE", meta: "META", ax: "AX" };

const overlaps = skillMap.filter((r) => r.sets.length > 1);
const marker = (r: SkillRegion) => String(overlaps.indexOf(r) + 1);

/** Skill map: the three archetypes as overlapping fields, with a written key that carries every label.
 *  The selected archetype (from the tabs below) is outlined in accent; hovering a key row or a region
 *  lights that region up. */
export function ArchetypeVenn({ selected }: { selected: string }) {
  const uid = useId().replace(/:/g, "");
  const [hot, setHot] = useState<string | null>(null);
  const id = (s: string) => `${uid}-${s}`;

  return (
    <div className="grid-12 gap-y-10">
      <figure className="card col-span-4 lg:col-span-7">
        <figcaption className="card-head label">
          <span>Skill map</span>
        </figcaption>
        <div className="plate-field p-3 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby={id("title")}
          className="mx-auto block h-auto w-full max-w-[760px] overflow-visible"
          onPointerLeave={() => setHot(null)}
        >
          <title id={id("title")}>
            Venn diagram of the Design Engineer, Meta-Designer and AX Designer archetypes. Each has its own skills, each pair shares
            one, and all three share a core of taste and problem framing. The key lists every region.
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
            <pattern id={id("hatch")} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--ink)" strokeWidth="1" strokeOpacity="0.28" />
            </pattern>
          </defs>

          {/* Regions: clip by every circle the region is in, mask out the ones it isn't. */}
          {skillMap.map((r) => {
            const on = hot === r.id;
            const isSel = r.sets.length === 1 && r.sets[0] === selected;
            const fill = on
              ? "color-mix(in srgb, var(--accent) 26%, transparent)"
              : r.id === "core"
                ? `url(#${id("hatch")})`
                : isSel
                  ? "color-mix(in srgb, var(--accent) 9%, transparent)"
                  : "transparent";
            const shape = (
              <rect
                width={W}
                height={H}
                fill={fill}
                mask={`url(#${id(`out-${r.id}`)})`}
                className="transition-[fill] duration-500"
                onPointerEnter={() => setHot(r.id)}
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
                strokeWidth={on ? 2 : 1}
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
                className="transition-[stroke] duration-500"
              />
            );
          })}

          {/* Labels */}
          <g pointerEvents="none" aria-hidden>
            {ALL.map((s) => (
              <text
                key={s}
                x={anchor[s].x}
                y={anchor[s].y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={s === selected ? "var(--accent-ink)" : "var(--ink)"}
                style={{ fontFamily: "var(--font-display)", fontStretch: "62%", fontWeight: 600, fontSize: 40, letterSpacing: "-0.02em" }}
              >
                {code[s]}
              </text>
            ))}
            {overlaps.map((r) => {
              const a = anchor[r.id];
              const on = hot === r.id;
              return (
                <g key={r.id} transform={`translate(${a.x} ${a.y})`}>
                  <rect x="-15" y="-15" width="30" height="30" fill={on ? "var(--accent)" : "var(--ink)"} className="transition-[fill] duration-500" />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={on ? "var(--on-accent)" : "var(--paper)"}
                    style={{ fontFamily: "var(--font-mono)", fontSize: 17 }}
                  >
                    {marker(r)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        </div>
      </figure>

      {/* Key: carries all the words, so the diagram stays legible at phone width. */}
      <div className="col-span-4 lg:col-span-5 lg:col-start-8 lg:self-center" onPointerLeave={() => setHot(null)}>
        <p className="label mb-4 text-ink-3">Key</p>
        <ul className="border-t border-ink">
          {skillMap
            .filter((r) => r.sets.length === 1)
            .map((r) => {
              const s = r.sets[0];
              return (
                <li
                  key={r.id}
                  onPointerEnter={() => setHot(r.id)}
                  className={`grid grid-cols-[3.5rem_1fr] gap-x-3 border-b border-line py-4 transition-colors duration-500 ${hot === r.id ? "bg-sunken" : ""}`}
                >
                  <span className={`label pt-1 ${s === selected ? "text-accent-ink" : "text-ink"}`}>{code[s]}</span>
                  <div>
                    <p className="font-medium tracking-tight text-ink">
                      {r.name} <span className="font-normal text-ink-3">· {r.detail}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{r.skills?.join(" / ")}</p>
                  </div>
                </li>
              );
            })}
          {overlaps.map((r) => (
            <li
              key={r.id}
              onPointerEnter={() => setHot(r.id)}
              className={`grid grid-cols-[3.5rem_1fr] gap-x-3 border-b border-line py-4 transition-colors duration-500 ${hot === r.id ? "bg-sunken" : ""}`}
            >
              <span className="pt-0.5">
                <span className={`label inline-grid size-6 place-items-center ${hot === r.id ? "bg-accent text-[var(--on-accent)]" : "bg-ink text-paper"}`}>
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
