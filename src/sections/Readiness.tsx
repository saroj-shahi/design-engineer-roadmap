import { useEffect, useRef, useState } from "react";
import { juniorChecklist, readinessItems, type ChecklistItem } from "../data/research";
import { CheckRow, Section, SectionHeader, Tabs, navigate, pageHref, parseStringArray, usePersistentSet, useSaveNote, type Track } from "../components/ui";
import { Glyph } from "../components/icons";

/** One checklist per track, each with its own saved ticks. Chapter 05 links here instead of repeating them. */
const lists: Record<
  Track,
  {
    key: string;
    items: ChecklistItem[];
    who: string;
    lede: string;
    start: string;
    readyLabel: string;
    ready: string;
    almostNote: (title: string) => string;
  }
> = {
  a: {
    key: "de-guide:readiness",
    items: readinessItems,
    who: "Working designer",
    lede: "Concrete proof you can work across design and code — to demo to your team, support a promotion case, or share when you're ready for a new\u00A0role.",
    start: "Start with one live demo. It's the quickest proof to share with teammates or reviewers.",
    readyLabel: "Ready to ship",
    ready: "Every item checked. Bring this workflow into your team's next project — or, if you're looking to move, send about 20 focused applications to teams that hire hybrids.",
    almostNote: (title) => `One item left: “${title}”. Close that gap next.`,
  },
  b: {
    key: "de-guide:junior-checklist",
    items: juniorChecklist,
    who: "Starting out",
    lede: "Three small steps you can take this week, then what screeners look for in a junior portfolio alongside your case studies.",
    start: "Tick items as you go. The first one needs no code and fits in an evening: pick an app you use daily and note where it fails a new user.",
    readyLabel: "Ready to apply",
    ready: "Every item checked. Aim at small startups, agencies and industry B2B companies, not only big tech.",
    almostNote: (title) => `One item left: “${title}”. Finish it before you apply.`,
  },
};

/** Status line by share of items done. Mid-way notes name the first unticked item, so they fit either track's list. */
function levelFor(done: number, total: number, list: (typeof lists)[Track], next?: ChecklistItem) {
  if (done === 0) return { label: "First step", note: list.start };
  if (done === total || !next) return { label: list.readyLabel, note: list.ready };
  if (done === total - 1) return { label: "Almost ready", note: list.almostNote(next.title) };
  if (done >= total / 2) return { label: "Getting close", note: `${done * 2 === total ? "Halfway there" : "Over halfway"}. Next up: “${next.title}”.` };
  return { label: "Foundations", note: `Keep going. Next up: “${next.title}”.` };
}

/** One-time move of ticks from the old Track A copy of this list (same ids; "aiproof" became "ai"). */
function migrateHybridPortfolio() {
  try {
    const old = localStorage.getItem("de-guide:hybrid-portfolio");
    if (!old) return;
    const cur = new Set<string>(parseStringArray(localStorage.getItem("de-guide:readiness")));
    for (const id of parseStringArray(old)) cur.add(id === "aiproof" ? "ai" : id);
    localStorage.setItem("de-guide:readiness", JSON.stringify([...cur]));
    localStorage.removeItem("de-guide:hybrid-portfolio");
  } catch {
    /* storage unavailable or malformed: nothing to move */
  }
}
migrateHybridPortfolio();

export function Readiness({ track }: { track: Track | null }) {
  const saveNote = useSaveNote();
  const pick = (t: Track) => navigate(pageHref("ready", t), { replace: true });
  return (
    <Section id="readiness">
      <SectionHeader
        id="readiness"
        level="h1"
        title={["How do I know", <em>I'm ready?</em>]}
        lede={`Tick what's true today. ${saveNote}`}
      />

      {track ? (
        <>
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <Tabs
              idPrefix="ready"
              label="Checklist for"
              variant="segmented"
              value={track}
              onChange={(v) => pick(v as Track)}
              items={[
                { id: "a", label: "Working designer" },
                { id: "b", label: "Starting out" },
              ]}
            />
            <p className="text-sm text-ink-3">Same track as your plan.</p>
          </div>
          {/* Keyed by track so each list loads its own saved ticks */}
          <Checklist key={track} track={track} />
        </>
      ) : (
        <div className="mb-10">
          <p className="mb-4 text-ink-2">Pick your track to see your checklist.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => pick("a")} className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] font-mono text-label font-normal inline-flex h-11 items-center gap-2 rounded-full border border-edge bg-card px-4 text-ink hover:bg-sunken">
              <Glyph name="user" className="!size-4" />
              <span>I'm a working designer</span>
            </button>
            <button type="button" onClick={() => pick("b")} className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] font-mono text-label font-normal inline-flex h-11 items-center gap-2 rounded-full border border-edge bg-card px-4 text-ink hover:bg-sunken">
              <Glyph name="user" className="!size-4" />
              <span>I'm starting out</span>
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}

function Checklist({ track }: { track: Track }) {
  const list = lists[track];
  const { set, toggle, reset, restore } = usePersistentSet(list.key);
  const [undo, setUndo] = useState<"idle" | "offer" | "restored">("idle");
  const prev = useRef<Set<string>>(new Set());
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const clear = () => {
    prev.current = new Set(set);
    reset();
    setUndo("offer");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setUndo("idle"), 10000);
  };
  const undoClear = () => {
    restore(prev.current);
    setUndo("restored");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setUndo("idle"), 10000);
  };
  const total = list.items.length;
  const done = list.items.filter((it) => set.has(it.id)).length;
  const pct = Math.round((done / total) * 100);
  const level = levelFor(done, total, list, list.items.find((it) => !set.has(it.id)));

  return (
    <div role="tabpanel" id={`ready-panel-${track}`} aria-labelledby={`ready-tab-${track}`} tabIndex={0} className="animate-panel-in motion-reduce:animate-fade-in grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 gap-y-12">
      <div className="col-span-4 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
        <div className="relative rounded-card border border-edge bg-card shadow-1 group p-6 sm:p-8">
          <div className="flex justify-end">
            <Glyph name="check" on={done === total} className="glyph-xl !size-16 text-ink" />
          </div>
          {done === 0 ? (
            /* Empty state: a giant "0%" reads as a verdict, so invite the first tick instead. */
            <p className="mt-4 font-display text-display-l text-balance text-ink">
              Not started yet <span className="mt-3 block font-sans text-lede font-normal text-ink-2">Tick items as you go.</span>
            </p>
          ) : (
            <p className="font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums mt-4 flex items-start text-[clamp(7rem,15vw,13rem)] text-ink">
              <span className="tabular-nums">{pct}</span>
              <span aria-hidden className="mt-[0.12em] text-[0.35em] text-accent">%</span>
              <span className="sr-only">percent ready</span>
            </p>
          )}
          <div className="mt-6 flex gap-1" aria-hidden>
            {list.items.map((it, i) => (
              <span key={it.id} className="relative h-2 flex-1 bg-line">
                <span
                  className={`absolute inset-0 origin-left bg-accent transition-transform duration-700 ease-silk ${set.has(it.id) ? "scale-x-100" : "scale-x-0"}`}
                  style={{ transitionDelay: `${i * 40}ms` }}
                />
              </span>
            ))}
          </div>
          <p className="font-mono text-label font-normal mt-3 tabular-nums text-ink-3">
            {String(done).padStart(2, "0")} / {String(total).padStart(2, "0")} complete
          </p>
          <div className="mt-10 border-t border-ink pt-5">
            <p className="font-mono text-label font-normal text-accent-ink">{level.label}</p>
            <p className="mt-2 max-w-[34ch] font-display font-semibold tracking-[-0.02em] text-pretty text-[1.625rem] leading-[1.15] text-ink">{level.note}</p>
          </div>
          <div aria-live="polite" className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1">
            {undo === "offer" && (
              <>
                <p className="font-mono text-label font-normal text-ink-2">Checklist cleared.</p>
                <button type="button" onClick={undoClear} className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] font-mono text-label font-normal bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]">
                  Undo
                </button>
              </>
            )}
            {undo === "restored" && <p className="font-mono text-label font-normal text-ink-2">Ticks restored.</p>}
          </div>
          <button
            type="button"
            onClick={clear}
            disabled={done === 0}
            className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] font-mono text-label font-normal bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] mt-2 text-ink-3 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-50 group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]"
          >
            Reset checklist
          </button>
        </div>
      </div>

      <div className="col-span-4 self-start lg:col-span-7 lg:col-start-6">
        <p className="mb-5 max-w-[52ch] leading-relaxed text-pretty text-ink-2">{list.lede}</p>
        <ul className="relative rounded-card border border-edge bg-card shadow-1 px-5 sm:px-6 [&>li:last-child]:border-b-0">
          {list.items.map((it, i) => (
            <CheckRow key={it.id} index={i + 1} checked={set.has(it.id)} onToggle={() => toggle(it.id)} title={it.title} detail={it.detail} />
          ))}
        </ul>
      </div>
    </div>
  );
}
