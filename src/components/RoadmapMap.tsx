import type { CSSProperties, MouseEvent } from "react";
import { cardLink } from "./ui";

export interface MapStep {
  id: string;
  /** Small label above the title, e.g. "Month 1". */
  kicker: string;
  title: string;
  /** Extra line under the title, e.g. the month's AI policy. */
  note?: string;
  /** Paired roadmap.sh base label shown on the node, e.g. "UX Design · Product Design". */
  base?: string;
  /** Renders the step as the shared foundation/base anchor at the top of the spine. */
  foundation?: boolean;
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
        {steps.some((s) => s.foundation) && (
          <span className="flex items-center gap-2">
            <span className="rm-key rm-key-base" /> Base
          </span>
        )}
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

      <ol data-nav className="rm" aria-label={label}>
        {steps.map((s, i) => {
          const on = s.id === active;
          const isBase = Boolean(s.foundation);
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
                className={`rm-node relative ${cardLink} block ${
                  isBase ? "rm-node-base" : on ? "is-on translate-y-0! border-accent! shadow-accent! rm-node-on" : ""
                }`}
              >
                <span className={`font-mono text-label font-normal block ${isBase ? "text-inverse-accent" : "text-ink-3"}`}>{s.kicker}</span>
                <span
                  className={`mt-1.5 block font-display font-semibold tracking-[-0.02em] text-pretty text-[1.375rem] leading-[1.1] ${
                    isBase ? "text-on-inverse" : "text-ink"
                  }`}
                >
                  {s.title}
                </span>
                {s.note && (
                  <span className={`mt-2 block text-xs ${isBase ? "text-inverse-muted" : "text-ink-2"}`}>
                    {s.note}
                  </span>
                )}
                {s.base && (
                  <span
                    className={`font-mono text-label font-normal mt-2.5 block border-t pt-2 ${
                      isBase
                        ? "border-inverse-line text-inverse-muted"
                        : "border-line text-ink-3"
                    }`}
                  >
                    {s.base}
                  </span>
                )}
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
