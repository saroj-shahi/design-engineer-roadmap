/* Reader progress, read from the ticks already saved in this browser. Pure helpers: no new storage. */
import { juniorChecklist, launchStages, planFor, readinessItems, type ChecklistItem, type PlanTopicGroup } from "../data/research";
import { parseStringArray, type PlanRoute, type Track, type TrackAOption } from "./ui";

/** Ticks for the roadmap.sh topics under each plan month or stage. */
export const PLAN_TOPICS_KEY = "de-guide:plan-topics";

/** Each track's proof-of-work checklist and where its ticks are kept. */
export const checklists: Record<Track, { key: string; items: ChecklistItem[] }> = {
  a: { key: "de-guide:readiness", items: readinessItems },
  b: { key: "de-guide:junior-checklist", items: juniorChecklist },
};

/** Storage prefix for one month or stage's topic ticks. */
export const stepKeyFor = (p: PlanRoute) => (p.track === "a" ? `a-${p.option}-m${p.month}` : `b-s${p.stage}`);

export interface StepProgress {
  route: PlanRoute;
  /** "Month 3" or "Stage 2". */
  label: string;
  title: string;
  done: number;
  total: number;
}

const tally = (stepKey: string, groups: PlanTopicGroup[], ticks: Set<string>) => ({
  done: groups.reduce((s, g) => s + g.topics.filter((t) => ticks.has(`${stepKey}:${g.slug}:${t}`)).length, 0),
  total: groups.reduce((s, g) => s + g.topics.length, 0),
});

/** Every month (Track A) or stage (Track B) of a plan, with its topic tally. */
export function planProgress(track: Track, option: TrackAOption, ticks: Set<string>): StepProgress[] {
  if (track === "a") {
    return planFor(option).map((m) => {
      const route: PlanRoute = { track: "a", option, month: m.month };
      return { route, label: `Month ${m.month}`, title: m.title, ...tally(stepKeyFor(route), m.roadmapTopics, ticks) };
    });
  }
  return launchStages.map((s) => {
    const route: PlanRoute = { track: "b", stage: s.n };
    return { route, label: `Stage ${s.n}`, title: s.name, ...tally(stepKeyFor(route), s.roadmapTopics, ticks) };
  });
}

/**
 * The step to work on next: the first unfinished one, counting from the earliest step the reader has ticked anything in
 * (so skipping ahead to Month 3 doesn't send them back to Month 1). Null before any tick, and once every step is done.
 */
export function upNext(steps: StepProgress[]): StepProgress | null {
  const from = steps.findIndex((s) => s.done > 0);
  if (from < 0) return null;
  return steps.slice(from).find((s) => s.done < s.total) ?? null;
}

/** Reads a saved tick set once, outside React. Empty when storage is blocked. */
export function readTicks(key: string): Set<string> {
  try {
    return new Set(parseStringArray(localStorage.getItem(key)));
  } catch {
    return new Set();
  }
}
