import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BrandLogo } from "./BrandLogo";
import { Glyph, ArchetypeGlyph, type GlyphName } from "./icons";
import { Hint, prefersReducedMotion, usePointerParallax } from "./ui";
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
  const [phase, setPhase] = useState<Phase>(() => (prefersReducedMotion() ? "after" : "before"));
  const [userPicked, setUserPicked] = useState(false);
  const touched = useRef(false);
  const { ref: canvas, onPointerMove, onPointerLeave } = usePointerParallax<HTMLDivElement>();

  // Play the shift once, ~1.6s after the stage is mostly on screen, so readers see "before" first.
  // Skipped under prefers-reduced-motion; any click on the toggle takes over.
  useEffect(() => {
    if (prefersReducedMotion()) return;
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
  }, [canvas]);

  const pick = (p: Phase) => {
    touched.current = true;
    setUserPicked(true);
    setPhase(p);
  };

  return (
    <figure className="relative rounded-card border border-edge bg-card flex h-full flex-col shadow-2" aria-labelledby="hero-stage-caption">
      <div className="flex items-center justify-between gap-4 rounded-t-[calc(var(--radius-card)-1px)] border-b border-line bg-card px-4 py-2 sm:px-5">
        <span className="font-mono text-label font-normal flex items-center gap-2 text-ink-3">
          <span aria-hidden className="inline-block size-[7px] shrink-0 rounded-full bg-current text-accent" />
          <span>How work moved</span>
        </span>
        <Hint touch="Tap to compare" className="ml-auto hidden text-ink-3 md:inline-flex">Compare</Hint>
        <div role="group" aria-label="Show the way work moved" className="inline-flex gap-1 rounded-full border border-edge bg-card p-1">
          {(["before", "after"] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={phase === p}
              onClick={() => pick(p)}
              className={`font-mono text-label font-normal h-11 border-edge px-3.5 transition-colors duration-300 rounded-full sm:h-9 sm:px-4 ${
                phase === p ? (p === "after" ? "bg-accent text-on-accent" : "bg-inverse text-on-inverse") : "text-ink-3 hover:bg-sunken hover:text-ink"
              }`}
            >
              {p === "before" ? "Before" : "Now"}
            </button>
          ))}
        </div>
      </div>

      <div className="hs-wrap flex-1">
        <div ref={canvas} className="hs-canvas plate-field" data-phase={phase} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} aria-hidden>
        {/* Connectors: the handoff (before) and the branching tree (now). Two drawings, one per layout. */}
        {(["wide", "narrow"] as const).map((v) => (
          <svg key={v} className={`hs-lines hs-lines-${v}`} viewBox={v === "wide" ? "0 0 100 71.43" : "0 0 100 96"} preserveAspectRatio="none">
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
          <span className="hs-tag-box font-mono text-label font-normal">
            Handoff
            <span className="hs-strike" />
          </span>
          <span className="hs-tag-sub font-mono text-label font-normal">spec · redlines · back-and-forth</span>
        </div>

        <StageCard
          className="hs-designer"
          depth={3}
          head="Step 1 · Designer"
          glyph="frame"
          title="Designs it"
          sub={
            <span className="inline-flex items-center gap-1">
              <span>Screens in</span>
              <BrandLogo brand="figma" className="size-[1.05em]" />
              <span>Figma</span>
            </span>
          }
        />
        <StageCard
          className="hs-engineer"
          depth={5}
          head="Step 2 · Engineer"
          glyph="terminal"
          title="Builds it"
          sub="In code, from a spec"
        />
        <StageCard className="hs-builder border-[color-mix(in_srgb,var(--accent)_45%,var(--edge))]! shadow-accent!" depth={4} head="Now · One codebase" glyph="shift" on title="Built together" sub="Designers in code, engineers reviewing" accent />

        {[
          { id: "de", title: "Design Engineer", sub: tagline("de") },
          { id: "meta", title: "Meta-Designer", sub: tagline("meta") },
          { id: "ax", title: "AX Designer", sub: tagline("ax") },
        ].map((a, i) => (
          <div key={a.id} className={`hs-card hs-arch hs-a${i + 1} relative rounded-card border border-edge bg-card shadow-1`} style={{ "--i": i, "--depth": 6 + i } as CSSProperties}>
            <div className="hs-body">
              <ArchetypeGlyph id={a.id} on className="hs-glyph text-ink" />
              <p className="hs-title mt-auto">{a.title}</p>
              <p className="hs-sub">{a.sub}</p>
            </div>
          </div>
        ))}
        </div>
      </div>

      <figcaption id="hero-stage-caption" aria-live={userPicked ? "polite" : undefined} className="rounded-b-[calc(var(--radius-card)-1px)] border-t border-line text-balance bg-card px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink-2 sm:px-5 sm:py-4">
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
    <div className={`hs-card relative rounded-card border border-edge bg-card shadow-1 ${className}`} style={{ "--depth": depth } as CSSProperties}>
      <p className={`hs-head flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal ${accent ? "bg-accent! text-on-accent!" : ""}`}>{head}</p>
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
