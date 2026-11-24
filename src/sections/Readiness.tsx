import { readinessItems } from "../data/research";
import { CheckRow, Section, SectionHeader, usePersistentSet } from "../components/ui";

const levels = [
  { min: 0, label: "Not started", note: "Start with one live demo. It's the fastest signal a reviewer can check." },
  { min: 1, label: "Foundations", note: "Keep going. Engineering evaluators will look for the repo next." },
  { min: 3, label: "Getting close", note: "Your evidence is forming. Close the remaining gaps before applying." },
  { min: 5, label: "Almost ready", note: "One item left. Finish it before your ~20 targeted applications." },
  { min: 6, label: "Interview-ready", note: "Every item checked. Aim at hybrid-friendly teams with targeted applications." },
];

export function Readiness() {
  const { set, toggle, reset } = usePersistentSet("de-guide:readiness");
  const done = set.size;
  const total = readinessItems.length;
  const pct = Math.round((done / total) * 100);
  const level = [...levels].reverse().find((l) => done >= l.min)!;
  const r = 52;
  const c = 2 * Math.PI * r;

  return (
    <Section id="readiness">
      <SectionHeader
        id="readiness"
        index="06"
        kicker="Self-assessment"
        title={
          <>
            Is your portfolio <span className="italic">ready to ship?</span>
          </>
        }
        lede="Tick what's true today. Progress saves in this browser only; nothing is sent anywhere."
      />

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="rounded-md lg:sticky lg:top-24 border border-line bg-surface p-6">
            <div className="flex items-center gap-5">
              <svg viewBox="0 0 120 120" className="size-28 shrink-0 -rotate-90" role="img" aria-label={`${pct}% ready`}>
                <circle cx="60" cy="60" r={r} fill="none" stroke="var(--sunken)" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r={r}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={c * (1 - done / total)}
                  style={{ transition: "stroke-dashoffset 600ms cubic-bezier(.2,.7,.2,1)" }}
                />
              </svg>
              <div>
                <p className="font-serif text-5xl leading-none tabular">{pct}%</p>
                <p className="mt-1 font-mono text-xs text-ink-3 tabular">
                  {done}/{total} complete
                </p>
              </div>
            </div>
            <div aria-live="polite" className="mt-6 border-t border-line pt-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent-ink">{level.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{level.note}</p>
            </div>
            <button
              type="button"
              onClick={reset}
              disabled={done === 0}
              className="mt-5 text-xs text-ink-3 underline underline-offset-4 transition-colors hover:text-ink disabled:no-underline disabled:opacity-40"
            >
              Reset checklist
            </button>
          </div>
        </div>

        <ul className="border-t border-line lg:col-span-8">
          {readinessItems.map((it, i) => (
            <CheckRow key={it.id} index={i + 1} checked={set.has(it.id)} onToggle={() => toggle(it.id)} title={it.title} detail={it.detail} />
          ))}
        </ul>
      </div>
    </Section>
  );
}
