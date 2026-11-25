import { juniorChecklist, readinessItems, type ChecklistItem } from "../data/research";
import { CheckRow, Section, SectionHeader, Tabs, usePersistentSet, useTrack, type Track } from "../components/ui";
import { Glyph } from "../components/icons";

/** One checklist per track, each with its own saved ticks. Chapter 05 links here instead of repeating them. */
const lists: Record<Track, { key: string; items: ChecklistItem[]; who: string; lede: string; start: string; ready: string }> = {
  a: {
    key: "de-guide:readiness",
    items: readinessItems,
    who: "Working designer",
    lede: "Proof a hiring team can open: something that runs, the code behind it, and evidence you can build with AI.",
    start: "Start with one live demo. It's the quickest signal a reviewer can check.",
    ready: "Every item checked. Send about 20 careful applications to teams that hire hybrids.",
  },
  b: {
    key: "de-guide:junior-checklist",
    items: juniorChecklist,
    who: "Starting out",
    lede: "What screeners look for in a junior portfolio alongside your case studies.",
    start: "Start with the first item. It needs no code: open each case study with who you are and the problem you solved.",
    ready: "Every item checked. Aim at seed-stage startups, small agencies and industry B2B companies, not only big tech.",
  },
};

/** Status line by share of items done. Mid-way notes name the first unticked item, so they fit either track's list. */
function levelFor(done: number, total: number, list: (typeof lists)[Track], next?: ChecklistItem) {
  if (done === 0) return { label: "Not started", note: list.start };
  if (done === total || !next) return { label: "Ready to apply", note: list.ready };
  if (done === total - 1) return { label: "Almost ready", note: `One item left: “${next.title}”. Finish it before you apply.` };
  if (done >= total / 2) return { label: "Getting close", note: `${done * 2 === total ? "Halfway there" : "Over halfway"}. Next up: “${next.title}”.` };
  return { label: "Foundations", note: `Keep going. Next up: “${next.title}”.` };
}

/** One-time move of ticks from the old Track A copy of this list (same ids; "aiproof" became "ai"). */
function migrateHybridPortfolio() {
  try {
    const old = localStorage.getItem("de-guide:hybrid-portfolio");
    if (!old) return;
    const cur = new Set<string>(JSON.parse(localStorage.getItem("de-guide:readiness") ?? "[]"));
    for (const id of JSON.parse(old) as string[]) cur.add(id === "aiproof" ? "ai" : id);
    localStorage.setItem("de-guide:readiness", JSON.stringify([...cur]));
    localStorage.removeItem("de-guide:hybrid-portfolio");
  } catch {
    /* storage unavailable or malformed: nothing to move */
  }
}
migrateHybridPortfolio();

export function Readiness() {
  const [track, setTrack] = useTrack();
  return (
    <Section id="readiness">
      <SectionHeader
        id="readiness"
        level="h1"
        glyph="check"
        title={["Is your portfolio", <em>ready to ship?</em>]}
        lede="Tick what's true today. Progress is saved in this browser only; nothing is sent anywhere."
      />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Tabs
          idPrefix="ready"
          label="Checklist for"
          variant="segmented"
          value={track}
          onChange={(v) => setTrack(v as Track)}
          items={[
            { id: "a", label: "Working designer" },
            { id: "b", label: "Starting out" },
          ]}
        />
        <p className="text-sm text-ink-3">Matches the track you picked in your plan.</p>
      </div>

      {/* Keyed by track so each list loads its own saved ticks */}
      <Checklist key={track} track={track} />
    </Section>
  );
}

function Checklist({ track }: { track: Track }) {
  const list = lists[track];
  const { set, toggle, reset } = usePersistentSet(list.key);
  const total = list.items.length;
  const done = list.items.filter((it) => set.has(it.id)).length;
  const pct = Math.round((done / total) * 100);
  const level = levelFor(done, total, list, list.items.find((it) => !set.has(it.id)));

  return (
    <div role="tabpanel" id={`ready-panel-${track}`} aria-labelledby={`ready-tab-${track}`} tabIndex={0} className="panel-in grid-12 gap-y-12">
      <div className="col-span-4 lg:col-span-4">
        <div className="card group p-6 sm:p-8 lg:sticky lg:top-24">
          <div className="flex justify-end">
            <Glyph name="check" on={done === total} className="glyph-xl !size-16 text-ink" />
          </div>
          <p className="numeral mt-4 flex items-start text-[clamp(7rem,15vw,13rem)] text-ink">
            <span className="tabular">{pct}</span>
            <span aria-hidden className="mt-[0.12em] text-[0.35em] text-accent">%</span>
            <span className="sr-only">percent ready</span>
          </p>
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
          <p className="label mt-3 tabular text-ink-3">
            {String(done).padStart(2, "0")} / {String(total).padStart(2, "0")} complete
          </p>
          <div aria-live="polite" className="mt-10 border-t border-ink pt-5">
            <p className="label text-accent-ink">{level.label}</p>
            <p className="mt-2 max-w-[34ch] font-display text-[1.625rem] leading-[1.15] tracking-tight text-ink">{level.note}</p>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={done === 0}
            className="hit label link-ul-static mt-8 text-ink-3 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            Reset checklist
          </button>
        </div>
      </div>

      <div className="col-span-4 self-start lg:col-span-7 lg:col-start-6">
        <p className="mb-5 max-w-[56ch] leading-relaxed text-ink-2">{list.lede}</p>
        <ul className="card px-5 sm:px-6 [&>li:last-child]:border-b-0">
          {list.items.map((it, i) => (
            <CheckRow key={it.id} index={i + 1} checked={set.has(it.id)} onToggle={() => toggle(it.id)} title={it.title} detail={it.detail} />
          ))}
        </ul>
      </div>
    </div>
  );
}
