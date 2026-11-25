import type { CSSProperties, MouseEvent } from "react";

export interface MapStep {
  id: string;
  /** Small label above the title, e.g. "Month 1". */
  kicker: string;
  title: string;
  /** Extra line under the title, e.g. the month's AI policy. */
  note?: string;
  left: string[];
  right: string;
}

/**
 * roadmap.sh-style map: steps run down a central spine; topics branch left, the result branches right.
 * On narrow screens the spine moves to the left edge and both branches stack under each step.
 * Steps are links to their own URL. A plain click hands the id back so the page can switch in place
 * and bring the detail into view; modifier-clicks (new tab, copy link) behave as normal links.
 */
export function RoadmapMap({
  steps,
  active,
  onPick,
  hrefFor,
  leftLabel,
  rightLabel,
  label,
}: {
  steps: MapStep[];
  active: string;
  onPick: (id: string) => void;
  hrefFor: (id: string) => string;
  leftLabel: string;
  rightLabel: string;
  label: string;
}) {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-2" aria-hidden>
        <span className="flex items-center gap-2">
          <span className="rm-key rm-key-node" /> Step
        </span>
        <span className="flex items-center gap-2">
          <span className="rm-key rm-key-leaf" /> {leftLabel}
        </span>
        <span className="flex items-center gap-2">
          <span className="rm-key rm-key-out" /> {rightLabel}
        </span>
      </div>

      <ol className="rm" aria-label={label}>
        {steps.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id} className="rm-row" data-reveal style={{ "--i": i } as CSSProperties}>
              <a
                href={hrefFor(s.id)}
                aria-current={on ? "step" : undefined}
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  onPick(s.id);
                }}
                className={`rm-node card card-lift block ${on ? "card-on rm-node-on" : ""}`}
              >
                <span className="label block text-ink-3">{s.kicker}</span>
                <span className="mt-1.5 block font-display text-[1.375rem] font-medium leading-[1.1] tracking-tight text-ink">{s.title}</span>
                {s.note && <span className="mt-2 block text-xs text-ink-3">{s.note}</span>}
              </a>

              <ul className="rm-branch rm-left" aria-label={`${s.title}: ${leftLabel.toLowerCase()}`}>
                {s.left.map((t) => (
                  <li key={t} className="rm-leaf">
                    {t}
                  </li>
                ))}
              </ul>

              <div className="rm-branch rm-right">
                <p className="rm-out">
                  <span className="sr-only">{rightLabel}: </span>
                  {s.right}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
