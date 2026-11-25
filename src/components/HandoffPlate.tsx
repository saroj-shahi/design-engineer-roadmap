import { type CSSProperties } from "react";
import { usePointerParallax } from "./ui";

/* ─────────────────────────────────────────────────────────────
   Plate I — "Handoff, collapsed."
   A design frame and the code that builds it, stacked on one
   desk. The handoff that used to sit between them is struck out.
   Layers sit at different depths; the cursor nudges them 1–7px
   (parallax), the code layer breathes, and both settle on hover.
   ───────────────────────────────────────────────────────────── */

const mono = { fontFamily: "var(--font-mono)", fontStretch: "87.5%" } as const;

export function HandoffPlate({ className = "" }: { className?: string }) {
  const { ref, onPointerMove, onPointerLeave } = usePointerParallax<SVGSVGElement>();

  return (
    <figure className={`card handoff-plate ${className}`}>
      <div className="card-head label">
        <span>Handoff, collapsed</span>
        <span>Plate 01</span>
      </div>
      <svg
        ref={ref}
        viewBox="0 0 400 400"
        className="plate-field block h-auto w-full"
        role="img"
        aria-labelledby="handoff-plate-title"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <title id="handoff-plate-title">
          A design frame and the code component that builds it, stacked together. The handoff between them is crossed out.
        </title>

        {/* Background: crop marks for the plate */}
        <g id="layer-ground" className="plx" style={{ "--depth": 1 } as CSSProperties} stroke="var(--ink-3)" strokeWidth="1.5" fill="none">
          <path d="M16 30V16h14M370 16h14v14M384 370v14h-14M30 384H16v-14" />
        </g>

        {/* Midground: the design frame */}
        <g id="layer-frame" className="plx" style={{ "--depth": 2.5 } as CSSProperties}>
          <text x="40" y="50" fontSize="11" fill="var(--ink-3)" style={mono}>
            FRAME / HERO
          </text>
          <rect x="46" y="66" width="220" height="164" fill="var(--hard)" />
          <rect x="40" y="60" width="220" height="164" fill="var(--card)" stroke="var(--edge)" strokeWidth="2" />
          <rect x="56" y="78" width="96" height="12" fill="var(--ink)" />
          <rect x="56" y="100" width="168" height="6" fill="var(--ink-3)" opacity="0.55" />
          <rect x="56" y="112" width="132" height="6" fill="var(--ink-3)" opacity="0.55" />
          <g id="frame-image" stroke="var(--line-strong)" strokeWidth="1.5" fill="none">
            <rect x="56" y="130" width="88" height="78" />
            <path d="M56 130l88 78M144 130l-88 78" />
          </g>
          {/* Redline on the button */}
          <g id="frame-redline" stroke="var(--accent)" strokeWidth="1.5">
            <path d="M160 160h84M160 155v10M244 155v10" />
            <text x="202" y="152" textAnchor="middle" fontSize="10" fill="var(--accent-ink)" stroke="none" style={mono}>
              84
            </text>
          </g>
          <rect x="160" y="174" width="84" height="28" fill="var(--accent)" fillOpacity="0.16" stroke="var(--accent)" strokeWidth="2" />
          <text x="202" y="192" textAnchor="middle" fontSize="11" fill="var(--accent-ink)" style={mono}>
            SHIP
          </text>
        </g>

        {/* The handoff, struck out */}
        <g id="layer-handoff" className="plx" style={{ "--depth": 4 } as CSSProperties}>
          <path d="M244 188h30v-34" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" />
          <rect x="262" y="128" width="112" height="26" fill="var(--card)" stroke="var(--edge)" strokeWidth="2" />
          <text x="318" y="145" textAnchor="middle" fontSize="11" fill="var(--ink-3)" style={{ ...mono, letterSpacing: "0.08em" }}>
            HANDOFF
          </text>
          <path className="handoff-strike" d="M268 141h100" stroke="var(--accent)" strokeWidth="3" pathLength={1} strokeDasharray="1" />
        </g>

        {/* Foreground: the component in code, sitting on the frame */}
        <g id="layer-code" className="plx" style={{ "--depth": 5.5 } as CSSProperties}>
          <g className="plate-float">
          <g transform="translate(14 24)">
            <rect x="138" y="198" width="240" height="172" fill="var(--hard)" />
            <rect x="130" y="190" width="240" height="172" fill="var(--card)" stroke="var(--edge)" strokeWidth="2" />
            <g id="code-titlebar">
              <rect x="130" y="190" width="240" height="26" fill="var(--edge)" />
              <rect x="142" y="200" width="6" height="6" fill="var(--card)" />
              <rect x="153" y="200" width="6" height="6" fill="var(--card)" />
              <rect x="164" y="200" width="6" height="6" fill="none" stroke="var(--card)" strokeWidth="1.5" />
              <text x="184" y="207" fontSize="10" fill="var(--card)" style={mono}>
                Button.tsx
              </text>
            </g>
            <g id="code-lines" fontSize="12.5" style={mono}>
              <rect x="132" y="232" width="10" height="84" fill="var(--accent)" fillOpacity="0.16" />
              {["+", "+", "+", "+"].map((d, i) => (
                <text key={i} x="134" y={246 + i * 21} fontSize="10" fill="var(--accent-ink)">
                  {d}
                </text>
              ))}
              <text x="150" y="246" fill="var(--ink)">
                {"<"}
                <tspan fill="var(--accent-ink)">Button</tspan>
              </text>
              <text x="166" y="267" fill="var(--ink-2)">
                {"variant="}
                <tspan fill="var(--ink)">"primary"</tspan>
              </text>
              <text x="166" y="288" fill="var(--ink-2)">
                {"onClick={ship}"}
              </text>
              <text x="150" y="309" fill="var(--ink)">
                {">Ship</"}
                <tspan fill="var(--accent-ink)">Button</tspan>
                {">"}
              </text>
              <rect className="plate-caret" x="296" y="298" width="2" height="14" fill="var(--accent)" />
            </g>
            <g id="code-status" fontSize="10" style={mono}>
              <path d="M130 334h240" stroke="var(--line)" strokeWidth="1.5" />
              <rect x="146" y="343" width="8" height="8" fill="var(--accent)" />
              <text x="162" y="351" fill="var(--ink-3)">
                PR #128 · READY TO MERGE
              </text>
            </g>
          </g>
          </g>
        </g>

        {/* Nearest: the builder's cursor */}
        <g id="layer-cursor" className="plx" style={{ "--depth": 8 } as CSSProperties}>
          <g className="plate-float plate-float-late">
            <path d="M330 270l0 30 8-8 6 13 6-3-6-13 11 0z" fill="var(--ink)" stroke="var(--card)" strokeWidth="2" strokeLinejoin="miter" />
          </g>
        </g>
      </svg>
      <figcaption className="card-foot bg-card text-xs leading-relaxed text-ink-2">
        Design frame and production component stacked in one workflow — no redline translation layer between them.
      </figcaption>
    </figure>
  );
}
