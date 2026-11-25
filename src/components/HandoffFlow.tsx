import type { CSSProperties } from "react";

interface Step {
  who: string;
  name: string;
}

const before: Step[] = [
  { who: "Designer", name: "Design in Figma" },
  { who: "Designer", name: "Spec & redlines" },
  { who: "Engineer", name: "Rebuild in code" },
  { who: "Both", name: "QA & review" },
];

const after: Step[] = [
  { who: "Builder", name: "Explore in the browser" },
  { who: "Builder", name: "Build the component" },
  { who: "Builder", name: "Review the PR" },
  { who: "Builder", name: "Ship" },
];

/** Before / after process diagram for the thesis of chapter 01: the handoff, and what replaces it. */
export function HandoffFlow() {
  return (
    <figure aria-labelledby="handoff-flow-cap">
      <div className="flex items-baseline justify-between border-t border-ink pt-4">
        <h3 className="label text-ink">How work moves</h3>
        <span className="label hidden text-ink-3 sm:block">Before → after</span>
      </div>

      <Row
        tag="Before"
        title="The handoff"
        steps={before}
        handoffAfter={1}
        loop="Rework loop: only 1 in 5 first builds match the design"
      />
      <Row tag="After" title="The builder" steps={after} owner="One builder owns every step" loop="Iterate inside the diff" solidLast />

      <figcaption id="handoff-flow-cap" className="mt-6 max-w-[60ch] text-sm leading-relaxed text-ink-3">
        Before: two people, a spec in the middle, and rework when the build drifts from the design. After: one person carries
        intent from exploration to a merged pull request.
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
  solidLast = false,
}: {
  tag: string;
  title: string;
  steps: Step[];
  handoffAfter?: number;
  owner?: string;
  loop: string;
  solidLast?: boolean;
}) {
  return (
    <div className="mt-8" data-reveal>
      <p className="label mb-4 flex gap-3 text-ink-3">
        <span className="text-accent-ink">{tag}</span>
        <span className="text-ink">{title}</span>
      </p>

      {owner && (
        <div className="mb-3 hidden sm:block">
          <span aria-hidden className="block h-2 border-x border-t border-accent" />
          <p className="label mt-2 text-accent-ink">{owner}</p>
        </div>
      )}

      <ol className="relative grid gap-8 sm:grid-cols-4">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          const handoff = handoffAfter === i;
          const solid = solidLast && last;
          return (
            <li
              key={s.name}
              style={{ "--i": i } as CSSProperties}
              className={`relative flex min-h-[6.5rem] flex-col border p-3 sm:p-4 ${solid ? "border-inverse bg-inverse text-on-inverse" : "border-line-strong bg-surface text-ink"}`}
            >
              <span className={`label ${solid ? "text-inverse-muted" : "text-ink-3"}`}>
                {String(i + 1).padStart(2, "0")} · {s.who}
              </span>
              <span className="mt-auto pt-4 font-display text-[1.375rem] leading-[1.05]">{s.name}</span>

              {/* Connector to the next step: arrow, or a handoff line where ownership changes hands */}
              {!last &&
                (handoff ? (
                  <span aria-hidden className="absolute -bottom-8 left-0 right-0 h-8 sm:-right-8 sm:bottom-0 sm:left-auto sm:top-0 sm:h-auto sm:w-8">
                    <span className="absolute left-1/2 top-0 h-full border-l border-dashed border-accent max-sm:hidden" />
                    <span className="absolute left-0 right-0 top-1/2 border-t border-dashed border-accent sm:hidden" />
                    <span className="label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper px-1 text-accent-ink">Handoff</span>
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="absolute -bottom-8 left-4 grid h-8 place-items-center font-mono text-sm text-ink-3 sm:-right-8 sm:bottom-auto sm:left-auto sm:top-1/2 sm:h-auto sm:w-8 sm:-translate-y-1/2"
                  >
                    <span className="sm:hidden">↓</span>
                    <span className="max-sm:hidden">→</span>
                  </span>
                ))}
              {handoff && <span className="sr-only">Handoff to the engineer.</span>}
            </li>
          );
        })}
      </ol>

      {/* Loop: a dashed return path under the last two steps (desktop), a plain line on phones */}
      <div className="mt-2 hidden grid-cols-4 gap-8 sm:grid" aria-hidden>
        <div className="relative col-span-2 col-start-3 h-6 border-x border-b border-dashed border-accent">
          <span className="absolute -left-[5px] -top-2 font-mono text-[11px] leading-none text-accent">▲</span>
        </div>
      </div>
      <p className="label mt-3 flex items-center gap-2 text-accent-ink sm:justify-end">
        <span aria-hidden className="font-mono">↺</span> {loop}
      </p>
    </div>
  );
}
