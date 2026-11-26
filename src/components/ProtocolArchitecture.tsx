import { useId } from "react";
import { protocols } from "../data/research";
import { Hint } from "./ui";

/* Interactive 4-protocol architecture diagram (diagram-design type-architecture).
   Maps the four protocols in src/data/research.ts into one clear topology:
     User & UI  <-- AG-UI (live stream) / A2UI (approved components) -->  AI Agent  <-- MCP (tools/data) / A2A (peer agents) --> External world
   Clicking a protocol chip selects it and explains its role and UX impact in the plate footer. */

const bridges: { id: string; label: string; sub: string }[] = [
  { id: "agui", label: "AG-UI", sub: "Live state stream" },
  { id: "a2ui", label: "A2UI", sub: "Approved UI components" },
  { id: "mcp", label: "MCP", sub: "Tools, Figma & data" },
  { id: "a2a", label: "A2A", sub: "Peer agent handoff" },
];

export function ProtocolArchitecture({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const active = protocols.find((p) => p.id === activeId) ?? protocols[0];

  return (
    <figure className="relative rounded-card border border-edge bg-card shadow-1 mb-8" aria-labelledby={`${uid}-cap`}>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
        <span>Agent protocol topology</span>
        <Hint touch="Tap a protocol">Click a protocol to inspect it</Hint>
      </div>

      <div className="plate-field overflow-x-auto px-4 py-5 sm:px-6">
        <svg
          viewBox="0 0 880 276"
          role="img"
          aria-labelledby={`${uid}-title`}
          className="mx-auto block h-auto w-full min-w-[640px] max-w-[880px]"
        >
          <title id={`${uid}-title`}>
            Architecture diagram connecting User and UI on the left to the AI Agent hub in the center via AG-UI (live state stream)
            and A2UI (approved design-system components), and connecting the AI Agent hub to Tools and Data on the upper right via MCP
            and to Other Agents on the lower right via A2A.
          </title>

          {/* Left node: User & UI */}
          <rect x="20" y="68" width="156" height="148" fill="var(--card)" stroke="var(--edge)" strokeWidth="2" />
          <rect x="20" y="68" width="156" height="26" fill="var(--inverse-bg)" />
          <text x="32" y="85" fill="var(--inverse-fg)" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em" }}>
            SURFACE
          </text>
          <text x="32" y="132" fill="var(--ink)" style={{ fontFamily: "var(--font-display)", fontStretch: "72%", fontWeight: 600, fontSize: 22 }}>
            User &amp; UI
          </text>
          <text x="32" y="156" fill="var(--ink-2)" style={{ fontFamily: "var(--font-sans)", fontSize: 12 }}>
            Approvals, live state,
          </text>
          <text x="32" y="174" fill="var(--ink-2)" style={{ fontFamily: "var(--font-sans)", fontSize: 12 }}>
            design-system cards
          </text>

          {/* Center focal hub: AI Agent */}
          <rect x="360" y="60" width="168" height="164" fill="var(--hard)" />
          <rect x="356" y="56" width="168" height="164" fill="var(--card)" stroke="var(--edge)" strokeWidth="2" />
          <rect x="356" y="56" width="168" height="28" fill="var(--accent)" />
          <text x="368" y="74" fill="var(--on-accent)" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", fontWeight: 600 }}>
            ORCHESTRATOR
          </text>
          <text x="368" y="122" fill="var(--ink)" style={{ fontFamily: "var(--font-display)", fontStretch: "72%", fontWeight: 600, fontSize: 26 }}>
            AI Agent
          </text>
          <text x="368" y="148" fill="var(--ink-2)" style={{ fontFamily: "var(--font-sans)", fontSize: 12 }}>
            Plans steps, calls tools,
          </text>
          <text x="368" y="166" fill="var(--ink-2)" style={{ fontFamily: "var(--font-sans)", fontSize: 12 }}>
            streams UI updates
          </text>
          <text x="368" y="198" fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
            HITL / HOTL GUARDRAILS
          </text>

          {/* Top-right node: Tools & Data */}
          <rect x="704" y="48" width="156" height="84" fill="var(--card)" stroke="var(--edge)" strokeWidth="2" />
          <text x="716" y="72" fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em" }}>
            CONTEXT
          </text>
          <text x="716" y="98" fill="var(--ink)" style={{ fontFamily: "var(--font-display)", fontStretch: "72%", fontWeight: 600, fontSize: 20 }}>
            Tools &amp; Data
          </text>
          <text x="716" y="117" fill="var(--ink-2)" style={{ fontFamily: "var(--font-sans)", fontSize: 11.5 }}>
            Figma, repos, APIs
          </text>

          {/* Bottom-right node: Other Agents */}
          <rect x="704" y="152" width="156" height="84" fill="var(--card)" stroke="var(--edge)" strokeWidth="2" />
          <text x="716" y="176" fill="var(--ink-3)" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em" }}>
            PEERS
          </text>
          <text x="716" y="202" fill="var(--ink)" style={{ fontFamily: "var(--font-display)", fontStretch: "72%", fontWeight: 600, fontSize: 20 }}>
            Other Agents
          </text>
          <text x="716" y="221" fill="var(--ink-2)" style={{ fontFamily: "var(--font-sans)", fontSize: 11.5 }}>
            Specialist workflows
          </text>

          {/* 4 interactive protocol bridges */}
          {bridges.map((b) => {
            const on = active.id === b.id;
            const lineY = b.id === "agui" || b.id === "mcp" ? 96 : 192;
            const x1 = b.id === "agui" || b.id === "a2ui" ? 176 : 524;
            const x2 = b.id === "agui" || b.id === "a2ui" ? 356 : 704;
            const midX = (x1 + x2) / 2;
            return (
              <g
                key={b.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${b.label}: ${b.sub}`}
                onClick={() => onSelect(b.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(b.id);
                  }
                }}
                className="cursor-pointer outline-none [&:focus-visible>rect:last-of-type]:stroke-accent-ink [&:focus-visible>rect:last-of-type]:stroke-[3] [&:hover>rect:last-of-type]:stroke-accent [&>rect:last-of-type]:transition-[stroke,fill] [&>rect:last-of-type]:duration-300"
              >
                <line
                  x1={x1}
                  y1={lineY}
                  x2={x2}
                  y2={lineY}
                  stroke={on ? "var(--accent)" : "var(--line-strong)"}
                  strokeWidth={on ? 2.5 : 1.5}
                  strokeDasharray={on ? undefined : "4 4"}
                />
                {/* Endpoint squares */}
                <rect x={x1 - 3} y={lineY - 3} width="6" height="6" fill={on ? "var(--accent)" : "var(--ink)"} />
                <rect x={x2 - 3} y={lineY - 3} width="6" height="6" fill={on ? "var(--accent)" : "var(--ink)"} />

                {/* Protocol badge */}
                <rect
                  x={midX - 66}
                  y={lineY - 24}
                  width="132"
                  height="48"
                  fill={on ? "var(--accent)" : "var(--card)"}
                  stroke={on ? "var(--edge)" : "var(--ink)"}
                  strokeWidth={on ? 2 : 1.25}
                />
                <text
                  x={midX}
                  y={lineY - 4}
                  textAnchor="middle"
                  fill={on ? "var(--on-accent)" : "var(--ink)"}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }}
                >
                  {b.label}
                </text>
                <text
                  x={midX}
                  y={lineY + 13}
                  textAnchor="middle"
                  fill={on ? "var(--on-accent)" : "var(--ink-3)"}
                  style={{ fontFamily: "var(--font-sans)", fontSize: 10.5 }}
                >
                  {b.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption id={`${uid}-cap`} className="rounded-b-[calc(var(--radius-card)-1px)] border-t border-line px-[1.125rem] py-3 text-balance grid gap-4 bg-card text-sm sm:grid-cols-2">
        <div>
          <span className="font-mono text-label font-normal text-ink-3">
            {active.name} · {active.owner}
          </span>
          <p className="mt-1 leading-relaxed text-ink-2">{active.role}</p>
        </div>
        <div className="border-l-2 border-accent pl-3.5">
          <span className="font-mono text-label font-normal text-accent-ink">Design impact</span>
          <p className="mt-1 leading-relaxed text-ink">{active.ux}</p>
        </div>
      </figcaption>
    </figure>
  );
}
