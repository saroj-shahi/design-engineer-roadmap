import { readinessItems } from "../data/research";
import { CheckRow, Section, SectionHeader, usePersistentSet } from "../components/ui";

const levels = [
  { min: 0, label: "Not started", note: "Start with one live demo. It's the quickest signal a reviewer can check." },
  { min: 1, label: "Foundations", note: "Keep going. Engineering reviewers will ask for the repo next." },
  { min: 3, label: "Getting close", note: "The evidence is forming. Close the remaining gaps before you apply." },
  { min: 5, label: "Almost ready", note: "One item left. Finish it before your ~20 targeted applications." },
  { min: 6, label: "Interview-ready", note: "Every item checked. Aim at hybrid-friendly teams with targeted applications." },
];

export function Readiness() {
  const { set, toggle, reset } = usePersistentSet("de-guide:readiness");
  const done = set.size;
  const total = readinessItems.length;
  const pct = Math.round((done / total) * 100);
  const level = [...levels].reverse().find((l) => done >= l.min)!;

  return (
    <Section id="readiness">
      <SectionHeader
        id="readiness"
        index="06"
        kicker="Self-assessment"
        folio="p. 06 / 06"
        title={["Is your portfolio", <em>ready to ship?</em>]}
        lede="Tick what's true today. Progress is saved in this browser only; nothing is sent anywhere."
      />

      <div className="grid-12 gap-y-12">
        <div className="col-span-4 lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <p className="label text-ink-3">Readiness</p>
            <p className="numeral mt-4 flex items-start text-[clamp(7rem,15vw,13rem)] text-ink">
              <span className="tabular">{pct}</span>
              <span aria-hidden className="mt-[0.12em] text-[0.35em] text-accent">%</span>
              <span className="sr-only">percent ready</span>
            </p>
            <div className="mt-6 flex gap-1" aria-hidden>
              {readinessItems.map((it, i) => (
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
              <p className="mt-2 max-w-[34ch] font-serif text-[1.625rem] leading-[1.15] tracking-tight text-ink">{level.note}</p>
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

        <ul className="col-span-4 border-t border-ink lg:col-span-7 lg:col-start-6">
          {readinessItems.map((it, i) => (
            <CheckRow key={it.id} index={i + 1} checked={set.has(it.id)} onToggle={() => toggle(it.id)} title={it.title} detail={it.detail} />
          ))}
        </ul>
      </div>
    </Section>
  );
}
