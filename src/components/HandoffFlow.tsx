import type { CSSProperties } from "react";
import { Glyph, type GlyphName } from "./icons";

interface Step {
  who: string;
  name: string;
  out: string;
  glyph: GlyphName;
}

const before: Step[] = [
  { who: "Designer", name: "Design in Figma", out: "Static mock", glyph: "frame" },
  { who: "Designer", name: "Spec & redlines (notes on the design)", out: "Ticket", glyph: "ruler" },
  { who: "Engineer", name: "Build in code", out: "First build", glyph: "terminal" },
  { who: "Both", name: "QA & review", out: "Bug list", glyph: "check" },
];

const after: Step[] = [
  { who: "Designer", name: "Explore in browser", out: "Live draft", glyph: "browser" },
  { who: "Shared", name: "Build component", out: "Real UI", glyph: "blocks" },
  { who: "Engineer", name: "Review code", out: "Approved PR", glyph: "branch" },
  { who: "Team", name: "Ship", out: "Production", glyph: "launch" },
];

/** Before / after workflow change framed as a Swiss specimen plate.
 *  Per diagram-design focal discipline, coral accents ONLY the bottleneck removed
 *  (the handoff point and rework loop in Before); After reads in calm solid ink. */
export function HandoffFlow() {
  return (
    <figure aria-labelledby="handoff-flow-cap" className="relative rounded-card border border-edge bg-card shadow-1">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)] transition-colors duration-[250ms] ease-silk group-hover/card:bg-accent-soft group-hover/card:text-accent-ink group-[.is-on]/card:bg-accent-soft group-[.is-on]/card:text-accent-ink font-mono text-label font-normal">
        <h3 className="m-0">How the work changes · Before → after</h3>
        <span className="hidden sm:inline">Handoff removed</span>
      </div>

      <div className="plate-field space-y-10 px-4 py-6 sm:px-6 sm:py-8">
        <Row
          tag="Before"
          title="The handoff"
          steps={before}
          handoffAfter={1}
          loop="Rework loop: builds often need another pass to match the design"
          bottleneck
        />
        <div className="border-t-2 border-dashed border-line-strong pt-8">
          <Row
            tag="After"
            title="One codebase"
            steps={after}
            owner="Designer and engineer share the same repository"
            loop="Fast iteration inside the same PR"
            solidLast
          />
        </div>
      </div>

      <figcaption id="handoff-flow-cap" className="rounded-b-[calc(var(--radius-card)-1px)] border-t border-line px-[1.125rem] py-3 text-balance bg-card text-sm leading-relaxed text-ink-2">
        <strong className="font-medium text-ink">Before:</strong> two specialists separated by a spec wall, with extra rework rounds when
        details don't survive the jump between tools. <strong className="font-medium text-ink">After:</strong> both work in the same
        codebase, so decisions happen once in the browser.
      </figcaption>
    </figure>
  );
}

function Row({
  tag,
  title,
  steps,
  handoffAfter,
  owner,
  loop,
  bottleneck = false,
  solidLast = false,
}: {
  tag: string;
  title: string;
  steps: Step[];
  handoffAfter?: number;
  owner?: string;
  loop: string;
  bottleneck?: boolean;
  solidLast?: boolean;
}) {
  return (
    <div data-reveal>
      <p className="font-mono text-label font-normal mb-4 flex items-center gap-3 text-ink-3">
        <span className={bottleneck ? "text-accent-ink" : "text-ink"}>{tag}</span>
        <span className="text-ink-2">{title}</span>
      </p>

      {owner && (
        <div className="mb-3 hidden sm:block">
          <span aria-hidden className="block h-2 border-x border-t border-ink" />
          <p className="font-mono text-label font-normal mt-1.5 text-ink-2">{owner}</p>
        </div>
      )}

      <ol className="relative grid gap-7 sm:grid-cols-4">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          const handoff = handoffAfter === i;
          const solid = solidLast && last;
          return (
            <li
              key={s.name}
              style={{ "--i": i } as CSSProperties}
              className={`rounded-card border border-edge bg-card shadow-1 shadow-none! group relative flex min-h-[10rem] flex-col p-3 sm:min-h-[11.5rem] sm:p-3.5 ${
                solid ? "!bg-inverse text-on-inverse" : "text-ink"
              }`}
            >
              <span className={`font-mono text-label font-normal inline-flex items-center gap-1.5 ${solid ? "text-inverse-muted" : "text-ink-3"}`}>
                <Glyph
                  name={s.who === "Both" || s.who === "Shared" || s.who === "Team" ? "users" : "user"}
                  className={`!size-3.5 ${solid ? "[--accent:currentColor]" : ""}`}
                />
                <span>
                  {String(i + 1).padStart(2, "0")} · {s.who}
                </span>
              </span>
              <Glyph name={s.glyph} className="mt-3.5 !size-9 sm:!size-11" />
              <span className="mt-auto pt-3 font-display font-semibold tracking-[-0.02em] text-pretty text-[1.25rem] leading-[1.06]">{s.name}</span>
              <span
                className={`mt-2 inline-block self-start border px-1.5 py-0.5 font-mono text-xs leading-tight ${
                  solid ? "border-inverse-line text-inverse-muted" : "border-line text-ink-3"
                }`}
              >
                {s.out}
              </span>

              {/* Connector to the next step: calm ink arrow, or focal dashed accent wall at the handoff */}
              {!last &&
                (handoff ? (
                  <span aria-hidden className="absolute -bottom-7 left-0 right-0 h-7 sm:-right-7 sm:bottom-0 sm:left-auto sm:top-0 sm:h-auto sm:w-7">
                    <span className="absolute left-1/2 top-0 h-full border-l-2 border-dashed border-accent max-sm:hidden" />
                    <span className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-accent sm:hidden" />
                    <span className="font-mono text-label font-normal absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-1 py-0.5 text-accent-ink sm:rotate-180 sm:[writing-mode:vertical-rl]">
                      Handoff
                    </span>
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="absolute -bottom-7 left-4 grid h-7 place-items-center font-mono text-sm text-ink-3 sm:-right-7 sm:bottom-auto sm:left-auto sm:top-1/2 sm:h-auto sm:w-7 sm:-translate-y-1/2"
                  >
                    <span className="sm:hidden">↓</span>
                    <span className="max-sm:hidden">→</span>
                  </span>
                ))}
              {handoff && <span className="sr-only">Here the designer hands the work to the engineer.</span>}
            </li>
          );
        })}
      </ol>

      {/* Return loop: Before loops back across the handoff point (accent); After iterates tightly inside code (ink) */}
      <div className="mt-2 hidden grid-cols-4 gap-7 sm:grid" aria-hidden>
        {bottleneck ? (
          <div className="relative col-span-3 col-start-2 h-6 border-x border-b border-dashed border-accent">
            <svg aria-hidden="true" viewBox="0 0 10 8" focusable="false" className="absolute -left-[5.5px] -top-2 h-2 w-2.5 text-accent"><path d="M5 0 10 8H0z" fill="currentColor" /></svg>
          </div>
        ) : (
          <div className="relative col-span-2 col-start-2 h-5 border-x border-b border-ink-3">
            <svg aria-hidden="true" viewBox="0 0 10 8" focusable="false" className="absolute -left-[5.5px] -top-2 h-2 w-2.5 text-ink-3"><path d="M5 0 10 8H0z" fill="currentColor" /></svg>
          </div>
        )}
      </div>
      <p className={`font-mono text-label font-normal mt-3 flex items-center gap-2 sm:justify-end ${bottleneck ? "text-accent-ink" : "text-ink-3"}`}>
        <span aria-hidden className="font-mono">↺</span> {loop}
      </p>
    </div>
  );
}
