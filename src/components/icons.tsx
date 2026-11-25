/* ─────────────────────────────────────────────────────────────
   Field Guide glyphs. 24×24 grid, 1.5 stroke, square caps, miter
   joins: drafted like the rules and ticks around them, no radii.
   Colour comes from currentColor and --accent, so both themes work.
   Motion lives in index.css under .glyph and only moves sub-paths.
   ───────────────────────────────────────────────────────────── */

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
      <g id="mark-de-selection">
        <rect className="g-select" x="9.25" y="7.5" width="5.5" height="9" fill="var(--accent)" stroke="none" />
      </g>
      <g id="mark-de-brackets">
        <path className="g-left" d="M7.5 6.5L2 12l5.5 5.5" />
        <path className="g-right" d="M16.5 6.5L22 12l-5.5 5.5" />
      </g>
      <g id="mark-de-caret">
        <path className="g-caret" d="M12 7v10" stroke="var(--accent)" />
      </g>
    </>
  );
}

/** Meta-Designer — encodes the system. Four modules; one is the token the others inherit from. */
function SystemMark() {
  return (
    <>
      <g id="mark-meta-modules">
        <rect className="g-tl" x="3.75" y="3.75" width="7" height="7" />
        <rect className="g-tr" x="13.25" y="3.75" width="7" height="7" />
        <rect className="g-bl" x="3.75" y="13.25" width="7" height="7" />
      </g>
      <g id="mark-meta-token">
        <rect className="g-br g-token" x="13.25" y="13.25" width="7" height="7" stroke="var(--accent)" fill="var(--accent)" />
      </g>
    </>
  );
}

/** AX Designer — orchestrates the agent. A conductor node and three agents on one orbit. */
function OrbitMark() {
  return (
    <>
      <g id="mark-ax-orbit">
        <circle cx="12" cy="12" r="8" strokeOpacity="0.3" strokeDasharray="1.5 2.5" strokeLinecap="butt" />
      </g>
      <g id="mark-ax-agents" className="g-agents">
        <path d="M12 8.5V5.75M15.03 13.75l2.39 1.38M8.97 13.75l-2.39 1.38" strokeOpacity="0.55" />
        <circle cx="12" cy="4" r="1.75" fill="var(--paper)" />
        <circle cx="18.93" cy="16" r="1.75" fill="var(--paper)" />
        <circle cx="5.07" cy="16" r="1.75" fill="var(--paper)" />
      </g>
      <g id="mark-ax-conductor">
        <circle className="g-halo" cx="12" cy="12" r="4.5" fill="var(--accent)" stroke="none" />
        <circle cx="12" cy="12" r="2.5" fill="var(--accent)" stroke="var(--accent)" />
      </g>
    </>
  );
}

const marks = { de: DiffMark, meta: SystemMark, ax: OrbitMark } as const;
export type ArchetypeId = keyof typeof marks;

export function ArchetypeGlyph({ id, on = false, className = "" }: { id: string; on?: boolean; className?: string }) {
  const Mark = marks[id as ArchetypeId];
  if (!Mark) return null;
  return (
    <svg {...base} data-on={on} className={`glyph glyph-mark glyph-${id} ${className}`}>
      <Mark />
    </svg>
  );
}
