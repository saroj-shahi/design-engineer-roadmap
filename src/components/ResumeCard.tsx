import { useState } from "react";
import { trackAOptions } from "../data/research";
import { PLAN_TOPICS_KEY, checklists, planProgress, readTicks, upNext } from "./progress";
import { ActionLink, Meter, TextLink, lastPlanRoute, pageHref, planFromParts, planHref, readStoredTrack } from "./ui";

/**
 * "Pick up where you left off" for a returning reader, built only from what this browser already saved
 * (last plan step, topic ticks, checklist ticks). A first visit, or blocked storage, renders nothing.
 */
export function ResumeCard() {
  const [state] = useState(() => {
    const track = readStoredTrack();
    if (!track) return null;
    const saved = lastPlanRoute();
    const route = saved?.track === track ? saved : planFromParts([track])!;
    const option = route.track === "a" ? route.option : "pde";
    const steps = planProgress(track, option, readTicks(PLAN_TOPICS_KEY));
    const list = checklists[track];
    const ticks = readTicks(list.key);
    return {
      track,
      route,
      steps,
      next: upNext(steps),
      checkDone: list.items.filter((it) => ticks.has(it.id)).length,
      checkTotal: list.items.length,
    };
  });
  if (!state) return null;

  const { track, route, steps, next, checkDone, checkTotal } = state;
  const done = steps.reduce((s, x) => s + x.done, 0);
  const total = steps.reduce((s, x) => s + x.total, 0);
  const allDone = total > 0 && done === total;
  const last = steps.find((s) => planHref(s.route) === planHref(route)) ?? steps[0];
  const who = route.track === "a" ? `Track A · ${trackAOptions.find((o) => o.id === route.option)?.name ?? "Working designer"}` : "Track B · Starting out";

  const headline = next ? `Pick up at ${next.label}: ${next.title}` : allDone ? "Every plan topic is ticked" : `Back to ${last.label}: ${last.title}`;
  const cta = next
    ? { href: planHref(next.route), label: `Continue ${next.label}` }
    : allDone
      ? { href: pageHref("ready", track), label: "Finish your checklist" }
      : { href: planHref(last.route), label: `Open ${last.label}` };
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <section
      aria-labelledby="resume-title"
      className="relative mt-10 max-w-[44rem] rounded-card border border-[color-mix(in_srgb,var(--accent)_45%,var(--edge))] bg-card p-5 shadow-1 sm:p-6"
    >
      <p className="font-mono text-label font-normal text-ink-3">Welcome back · {who}</p>
      <h2
        id="resume-title"
        className="mt-2 font-display text-[clamp(1.375rem,2.2vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pretty text-ink"
      >
        {headline}
      </h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <div className="font-mono text-label font-normal flex items-baseline justify-between text-ink-3">
            <span>Plan topics</span>
            <span className="tabular-nums text-ink">
              {done} / {total}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Plan topics ticked"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={total}
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
          >
            <span className="block h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <Meter value={checkDone} max={checkTotal} label="Checklist" />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ActionLink variant="secondary" href={cta.href}>
          {cta.label}
        </ActionLink>
        {!allDone && <TextLink href={pageHref("ready", track)}>Open your checklist</TextLink>}
      </div>
    </section>
  );
}
