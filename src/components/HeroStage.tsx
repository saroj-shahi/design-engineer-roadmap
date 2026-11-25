import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { Glyph, ArchetypeGlyph, type GlyphName } from "./icons";
import { archetypes } from "../data/research";

const tagline = (id: string) => archetypes.find((a) => a.id === id)?.short ?? "";

/* ─────────────────────────────────────────────────────────────
   Hero stage: the whole thesis in one move.
   Before — a designer makes it in Figma, an engineer builds it from a
   spec, and a handoff sits between them. Now — the two cards meet in
   one shared codebase, the handoff is struck out, and three design
   roles branch from it. Neither role is cast as the problem: the
   handoff is.
   Positions live in CSS (container-query units) so the same scene
   recomposes for phone and desktop; see .hs-* in index.css.
   ───────────────────────────────────────────────────────────── */

type Phase = "before" | "after";

const captions: Record<Phase, ReactNode> = {
  before: (
    <>
      <strong className="font-medium text-ink">Before:</strong> a designer makes the screen in Figma, then an engineer rebuilds it from a
      spec. Even with great people on both sides, only 1 in 5 first builds match the design.
    </>
  ),
  after: (
    <>
      <strong className="font-medium text-ink">Now:</strong> designers and engineers work in the same code. Designers shape the UI;
      engineers review it and own the system. Three roles grow from this.
    </>
  ),
};

export function HeroStage() {
  const [phase, setPhase] = useState<Phase>("before");
  const touched = useRef(false);
  const canvas = useRef<HTMLDivElement>(null);

  // Play the shift once, ~1.6s after the stage is mostly on screen, so readers see "before" first.
  // Any click on the toggle takes over.
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || touched.current) return;
        io.disconnect();
        t = window.setTimeout(() => {
          if (!touched.current) setPhase("after");
        }, 1600);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const pick = (p: Phase) => {
    touched.current = true;
    setPhase(p);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = canvas.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const onLeave = () => {
    canvas.current?.style.setProperty("--px", "0");
    canvas.current?.style.setProperty("--py", "0");
  };

  return (
    <figure className="hs-wrap" aria-labelledby="hero-stage-caption">
      <div className="mb-4 flex items-center justify-end gap-4">
        <div role="group" aria-label="Show the way work moved" className="inline-flex border-2 border-edge bg-card shadow-[var(--sh-1)]">
          {(["before", "after"] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={phase === p}
              onClick={() => pick(p)}
              className={`label h-10 border-edge px-3 transition-colors duration-300 first:border-r-2 sm:px-4 ${
                phase === p ? (p === "after" ? "bg-accent text-[var(--on-accent)]" : "bg-edge text-card") : "text-ink-3 hover:bg-sunken hover:text-ink"
              }`}
            >
              {p === "before" ? "Before" : "Now"}
            </button>
          ))}
        </div>
      </div>

      <div ref={canvas} className="hs-canvas plate-field" data-phase={phase} onPointerMove={onMove} onPointerLeave={onLeave} aria-hidden>
        {/* Connectors: the handoff (before) and the branching tree (now). Two drawings, one per layout. */}
        {(["wide", "narrow"] as const).map((v) => (
          <svg key={v} className={`hs-lines hs-lines-${v}`} viewBox={v === "wide" ? "0 0 100 71.43" : "0 0 100 125"} preserveAspectRatio="none">
            <path
              className="hs-handoff"
              d={v === "wide" ? "M34 14H50V40H66" : "M25.5 34V67H52"}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="5 5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="hs-tree"
              d={v === "wide" ? "M50 22V32H18.5V42M50 32V42M50 32H81.5V42" : "M50 34V42H17.5V50M50 42V50M50 42H82.5V50"}
              fill="none"
              stroke="var(--edge)"
              strokeWidth={v === "wide" ? 0.3 : 0.55}
              strokeLinecap="square"
              pathLength={1}
              strokeDasharray="1"
            />
          </svg>
        ))}

        {/* The handoff tag: struck out, then dropped */}
        <div className="hs-tag">
          <span className="hs-tag-box label">
            Handoff
            <span className="hs-strike" />
          </span>
          <span className="hs-tag-sub label">spec · redlines · back-and-forth</span>
        </div>

        <StageCard className="hs-designer" depth={3} head="Step 1 · Designer" glyph="frame" title="Designs it" sub="Screens in Figma" />
        <StageCard
          className="hs-engineer"
          depth={5}
          head="Step 2 · Engineer"
          glyph="terminal"
          title="Builds it"
          sub="In code, from a spec"
        />
        <StageCard className="hs-builder card-accent" depth={4} head="Now · One codebase" glyph="shift" on title="Built together" sub="Designers in code, engineers reviewing" accent />

        {[
          { id: "de", title: "Design Engineer", sub: tagline("de") },
          { id: "meta", title: "Meta-Designer", sub: tagline("meta") },
          { id: "ax", title: "AX Designer", sub: tagline("ax") },
        ].map((a, i) => (
          <div key={a.id} className={`hs-card hs-arch hs-a${i + 1} card`} style={{ "--i": i, "--depth": 6 + i } as CSSProperties}>
            <div className="hs-body">
              <ArchetypeGlyph id={a.id} on className="hs-glyph text-ink" />
              <p className="hs-title mt-auto">{a.title}</p>
              <p className="hs-sub">{a.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <figcaption id="hero-stage-caption" aria-live="polite" className="mt-5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-2">
        {captions[phase]}
      </figcaption>
    </figure>
  );
}

function StageCard({
  className,
  depth,
  head,
  glyph,
  title,
  sub,
  on = false,
  accent = false,
}: {
  className: string;
  depth: number;
  head: string;
  glyph: GlyphName;
  title: string;
  sub: ReactNode;
  on?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`hs-card card ${className}`} style={{ "--depth": depth } as CSSProperties}>
      <p className={`card-head label ${accent ? "!bg-accent !text-[var(--on-accent)]" : ""}`}>{head}</p>
      <div className="hs-body hs-body-row">
        <Glyph name={glyph} on={on} className="hs-glyph text-ink" />
        <div className="min-w-0">
          <p className="hs-title">{title}</p>
          <p className="hs-sub">{sub}</p>
        </div>
      </div>
    </div>
  );
}
