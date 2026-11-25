/* ─────────────────────────────────────────────────────────────
   Field Guide glyphs. 24×24 grid, 1.5 stroke, square caps, miter
   joins: drafted like the rules and ticks around them, no radii.
   Colour comes from currentColor and --accent, so both themes work.
   Motion lives in index.css under .glyph and only moves sub-paths.
   ───────────────────────────────────────────────────────────── */

import type { ArchetypeId } from "../data/research";

type GlyphProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
  focusable: false,
};

/** Forward arrow. On hover of the parent .group the shaft lengthens and the head travels with it. */
export function ArrowGlyph({ className = "" }: GlyphProps) {
  return (
    <svg {...base} className={`glyph glyph-arrow ${className}`}>
      <path className="g-shaft" d="M3.75 12H18" />
      <path className="g-head" d="M13 7l5 5-5 5" />
    </svg>
  );
}

/** Backward arrow: the same drawing, mirrored. */
export function ArrowBackGlyph({ className = "" }: GlyphProps) {
  return (
    <svg {...base} className={`glyph glyph-arrow glyph-arrow-back ${className}`}>
      <path className="g-shaft" d="M20.25 12H6" />
      <path className="g-head" d="M11 7l-5 5 5 5" />
    </svg>
  );
}

/** Leaves the page. The head lifts up-right while the shaft reaches after it. */
export function ExternalGlyph({ className = "" }: GlyphProps) {
  return (
    <svg {...base} className={`glyph glyph-ext ${className}`}>
      <path className="g-shaft" d="M6.5 17.5L16.5 7.5" />
      <path className="g-head" d="M9 7h8v8" />
    </svg>
  );
}

/* ───────── Archetype marks ─────────
   One mark per hybrid role. Each has a rest pose, a hover gesture
   (via .group:hover) and a selected state (data-on="true"). */

/** Design Engineer — owns the diff. A tag pair with a live caret and a text selection between them. */
function DiffMark() {
  return (
    <>
      <g>
        <rect className="g-select" x="9.25" y="7.5" width="5.5" height="9" fill="var(--accent)" stroke="none" />
      </g>
      <g>
        <path className="g-left" d="M7.5 6.5L2 12l5.5 5.5" />
        <path className="g-right" d="M16.5 6.5L22 12l-5.5 5.5" />
      </g>
      <g>
        <path className="g-caret" d="M12 7v10" stroke="var(--accent)" />
      </g>
    </>
  );
}

/** Meta-Designer — encodes the system. Four modules; one is the token the others inherit from. */
function SystemMark() {
  return (
    <>
      <g>
        <rect className="g-tl" x="3.75" y="3.75" width="7" height="7" />
        <rect className="g-tr" x="13.25" y="3.75" width="7" height="7" />
        <rect className="g-bl" x="3.75" y="13.25" width="7" height="7" />
      </g>
      <g>
        <rect className="g-br g-token" x="13.25" y="13.25" width="7" height="7" stroke="var(--accent)" fill="var(--accent)" />
      </g>
    </>
  );
}

/** AX Designer — orchestrates the agent. A conductor node and three agents on one orbit. */
function OrbitMark() {
  return (
    <>
      <g>
        <circle cx="12" cy="12" r="8" strokeOpacity="0.3" strokeDasharray="1.5 2.5" strokeLinecap="butt" />
      </g>
      <g className="g-agents">
        <path d="M12 8.5V5.75M15.03 13.75l2.39 1.38M8.97 13.75l-2.39 1.38" strokeOpacity="0.55" />
        <circle cx="12" cy="4" r="1.75" fill="var(--paper)" />
        <circle cx="18.93" cy="16" r="1.75" fill="var(--paper)" />
        <circle cx="5.07" cy="16" r="1.75" fill="var(--paper)" />
      </g>
      <g>
        <circle className="g-halo" cx="12" cy="12" r="4.5" fill="var(--accent)" stroke="none" />
        <circle cx="12" cy="12" r="2.5" fill="var(--accent)" stroke="var(--accent)" />
      </g>
    </>
  );
}

const marks: Record<ArchetypeId, () => JSX.Element> = { de: DiffMark, meta: SystemMark, ax: OrbitMark };

export function ArchetypeGlyph({ id, on = false, className = "" }: { id: string; on?: boolean; className?: string }) {
  const Mark = marks[id as ArchetypeId];
  if (!Mark) return null;
  return (
    <svg {...base} data-on={on} className={`glyph glyph-mark glyph-${id} ${className}`}>
      <Mark />
    </svg>
  );
}

/* ───────── Workbench glyph library ─────────
   Chapter, stage, layer, track and process-step marks. Same grid and
   pen as the archetype marks; each has one hover gesture on a sub-path
   (see .glyph-<name> in index.css). Accent marks the part that moves. */

const A = "var(--accent)";
const tint = { fill: A, fillOpacity: 0.18, stroke: A } as const;

const library = {
  /** Handoff, collapsed: the build square slides onto the design square. */
  shift: () => (
    <>
      <rect className="g-back" x="3.75" y="3.75" width="11" height="11" />
      <rect className="g-front" x="9.25" y="9.25" width="11" height="11" {...tint} />
    </>
  ),
  /** Two roles side by side; on hover the bars trade height. */
  compare: () => (
    <>
      <path d="M2.75 20.25h18.5" />
      <rect className="g-a" x="5" y="8" width="5" height="12.25" />
      <rect className="g-b" x="14" y="12" width="5" height="8.25" {...tint} />
    </>
  ),
  /** The skills stack as offset plates; they spread on hover. */
  layers: () => (
    <>
      <rect className="g-l1" x="3.75" y="3.75" width="12" height="4.5" />
      <rect className="g-l2" x="6" y="9.75" width="12" height="4.5" />
      <rect className="g-l3" x="8.25" y="15.75" width="12" height="4.5" {...tint} />
    </>
  ),
  /** Three stations on one line; a work item travels the pipe on hover. */
  pipeline: () => (
    <>
      <path d="M4 12h16" />
      <rect x="2.25" y="10.25" width="3.5" height="3.5" fill="var(--card)" />
      <rect x="10.25" y="10.25" width="3.5" height="3.5" fill="var(--card)" />
      <rect x="18.25" y="10.25" width="3.5" height="3.5" fill={A} stroke={A} />
      <rect className="g-dot" x="3.25" y="11.25" width="1.5" height="1.5" fill={A} stroke="none" />
    </>
  ),
  /** A stepped route to a flag; the flag lifts on hover. */
  route: () => (
    <>
      <path d="M3.75 20.25h4.5v-5.5h5v-5.5h4.75" />
      <path d="M18 20.25V2.75" />
      <path className="g-flag" d="M18 3h4l-1.5 2.25L22 7.5h-4z" fill={A} stroke={A} />
    </>
  ),
  /** A checkbox whose tick redraws on hover. */
  check: () => (
    <>
      <rect className="g-box" x="3.75" y="3.75" width="16.5" height="16.5" />
      <path className="g-tick" d="M7.75 12.25l3 3 5.75-6.25" stroke={A} pathLength={1} strokeDasharray="1" />
    </>
  ),
  /** An artboard with crop marks that pull outward on hover. */
  frame: () => (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" {...tint} />
      <path className="g-tl" d="M6.5 2.5v2M2.5 6.5h2" />
      <path className="g-tr" d="M17.5 2.5v2M21.5 6.5h-2" />
      <path className="g-bl" d="M6.5 21.5v-2M2.5 17.5h2" />
      <path className="g-br" d="M17.5 21.5v-2M21.5 17.5h-2" />
    </>
  ),
  /** Design ↔ code roundtrip; the two arrows trade places. */
  roundtrip: () => (
    <>
      <path className="g-out" d="M3.75 8.5h15m-3.5-3.5l3.5 3.5-3.5 3.5" />
      <path className="g-back" d="M20.25 15.5h-15m3.5-3.5l-3.5 3.5 3.5 3.5" stroke={A} />
    </>
  ),
  /** A branch that merges back into main on hover. */
  branch: () => (
    <>
      <path d="M7 6.5v11" />
      <rect x="4.75" y="2.25" width="4.5" height="4.5" />
      <rect x="4.75" y="17.25" width="4.5" height="4.5" />
      <g className="g-branch">
        <path d="M17 9.5v2.25L9.25 18" stroke={A} />
        <rect x="14.75" y="5" width="4.5" height="4.5" {...tint} />
      </g>
    </>
  ),
  /** Blocks assembling: the top block drops into place on hover. */
  blocks: () => (
    <>
      <rect x="3.75" y="13" width="7.5" height="7.5" />
      <rect x="12.75" y="13" width="7.5" height="7.5" />
      <rect className="g-top" x="8.25" y="3" width="7.5" height="7.5" {...tint} />
    </>
  ),
  /** Judgment: an eye with a square pupil that glances on hover. */
  eye: () => (
    <>
      <path d="M2.75 12S6.5 5.75 12 5.75 21.25 12 21.25 12 17.5 18.25 12 18.25 2.75 12 2.75 12z" />
      <rect className="g-pupil" x="9.75" y="9.75" width="4.5" height="4.5" fill={A} stroke={A} />
    </>
  ),
  /** Repo fluency: a terminal with a cursor that blinks on hover. */
  terminal: () => (
    <>
      <rect x="2.75" y="4.25" width="18.5" height="15.5" />
      <path d="M6.5 9.25l2.75 2.75-2.75 2.75" />
      <path className="g-cursor" d="M11.5 15.25h5" stroke={A} />
    </>
  ),
  /** Agent orchestration: the AX orbit, reused. */
  orbit: () => <OrbitMark />,
  /** The pattern library: a 3×3 specimen tray that flickers on hover. */
  library: () => (
    <>
      {[3.75, 10, 16.25].flatMap((y, r) =>
        [3.75, 10, 16.25].map((x, c) => (
          <rect
            key={`${r}${c}`}
            className={(r + c) % 2 ? "g-odd" : "g-even"}
            x={x}
            y={y}
            width="4"
            height="4"
            {...(r === 1 && c === 1 ? { fill: A, stroke: A } : {})}
          />
        )),
      )}
    </>
  ),
  /** Track A, evolve: stairs with an arrow climbing off the top step. */
  stairs: () => (
    <>
      <path d="M3.75 20.25h4.5v-4.5h4.5v-4.5h4.5" />
      <g className="g-up">
        <path d="M13.5 10.5l6.75-6.75" stroke={A} />
        <path d="M15 3.75h5.25V9" stroke={A} />
      </g>
    </>
  ),
  /** Track B, launch: a start key whose play mark nudges forward. */
  launch: () => (
    <>
      <rect x="3.75" y="3.75" width="16.5" height="16.5" />
      <path className="g-play" d="M10 8.25l5.75 3.75L10 15.75z" fill={A} stroke={A} />
    </>
  ),
  /** Spec & redlines: a ruler under a dimension line that measures on hover. */
  ruler: () => (
    <>
      <rect x="2.75" y="11" width="18.5" height="7.5" />
      <path d="M6.5 11v3M10.25 11v2M14 11v3M17.75 11v2" />
      <path className="g-dim" d="M2.75 6.25h18.5M2.75 4.5v3.5M21.25 4.5v3.5" stroke={A} />
    </>
  ),
  /** Theme: a disc lit on one half; the lit half turns over with the theme. */
  theme: () => (
    <>
      <circle className="g-ring" cx="12" cy="12" r="8.25" />
      <path className="g-half" d="M12 3.75a8.25 8.25 0 0 1 0 16.5z" fill="currentColor" />
      <path d="M12 2v3M12 19v3" stroke={A} />
    </>
  ),
  /** Explore in the browser: a window whose hero block builds out on hover. */
  browser: () => (
    <>
      <rect x="2.75" y="3.75" width="18.5" height="16.5" />
      <path d="M2.75 8.25h18.5" />
      <path d="M5.5 6h.5M8 6h.5M10.5 6h.5" />
      <rect className="g-hero" x="6" y="11.25" width="12" height="3.5" {...tint} />
      <path d="M6 17.5h7" />
    </>
  ),
} as const;

export type GlyphName = keyof typeof library;

export function Glyph({ name, on = false, className = "", title }: { name: GlyphName; on?: boolean; className?: string; title?: string }) {
  const Draw = library[name];
  const extra = name === "orbit" ? "glyph-ax" : "";
  return (
    <svg
      {...base}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      data-on={on}
      className={`glyph glyph-lib glyph-${name} ${extra} ${className}`}
    >
      {title && <title>{title}</title>}
      <Draw />
    </svg>
  );
}
