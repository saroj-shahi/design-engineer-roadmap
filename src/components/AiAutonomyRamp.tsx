import { aiPolicyLabel, type Month } from "../data/research";

/* 6-step AI autonomy ramp synced with Track A's active month.
   Visualizes the guide's core rule: zero AI code generation in Month 1, ramping step by step
   to supervised production PRs by Months 5-6. */
const LEVEL: Record<Month["aiPolicy"], { height: number; tag: string }> = {
  none: { height: 0, tag: "0% AI" },
  read: { height: 20, tag: "Read only" },
  assist: { height: 42, tag: "Assisted" },
  oversee: { height: 64, tag: "Directed" },
  production: { height: 84, tag: "Production" },
  position: { height: 100, tag: "Live demo" },
};

export function AiAutonomyRamp({
  plan,
  activeMonth,
  onSelect,
}: {
  plan: Month[];
  activeMonth: number;
  onSelect: (month: number) => void;
}) {
  const current = plan[activeMonth - 1];
  return (
    <figure className="card mb-6" aria-labelledby="ai-ramp-caption">
      <div className="card-head label">
        <span>AI guardrail ramp · Months 01–06</span>
        <span>Month 0{activeMonth}: {aiPolicyLabel[current.aiPolicy]}</span>
      </div>

      <div className="plate-field px-4 py-5 sm:px-6">
        {/* Three 2-month phase brackets */}
        <div className="mb-3 grid grid-cols-6 gap-2 text-center" aria-hidden>
          {["Foundations", "Acceleration", "Production"].map((phase, idx) => {
            const on = activeMonth === idx * 2 + 1 || activeMonth === idx * 2 + 2;
            return (
              <div key={phase} className="col-span-2">
                <span className={`block h-1.5 border-x border-t ${on ? "border-accent" : "border-line-strong"}`} />
                <span className={`label mt-1 block ${on ? "text-accent-ink" : "text-ink-3"}`}>{phase}</span>
              </div>
            );
          })}
        </div>

        {/* Interactive 6-step staircase */}
        <div role="group" aria-label="AI autonomy by month" className="grid grid-cols-6 items-end gap-1.5 sm:gap-3">
          {plan.map((m) => {
            const on = m.month === activeMonth;
            const cfg = LEVEL[m.aiPolicy];
            return (
              <button
                key={m.month}
                type="button"
                aria-pressed={on}
                aria-label={`Month ${m.month}: ${aiPolicyLabel[m.aiPolicy]} (${m.title})`}
                onClick={() => onSelect(m.month)}
                className="group flex min-w-0 flex-col items-stretch text-left focus-visible:outline-offset-4"
              >
                <span className="flex h-24 items-end sm:h-32">
                  {cfg.height === 0 ? (
                    <span
                      className={`grid h-8 w-full place-items-center border-2 border-dashed font-mono text-[10px] uppercase tracking-wider transition-colors duration-300 ${
                        on ? "border-accent bg-accent/15 text-accent-ink" : "border-line-strong bg-card text-ink-3 group-hover:border-ink"
                      }`}
                    >
                      <span className="hidden sm:inline">Manual</span>
                      <span className="sm:hidden">0%</span>
                    </span>
                  ) : (
                    <span
                      style={{ height: `${cfg.height}%` }}
                      className={`relative flex w-full flex-col justify-between overflow-hidden border-2 p-1 transition-colors duration-300 sm:p-2 ${
                        on
                          ? "border-edge bg-accent text-[var(--on-accent)] shadow-[var(--sh-1)]"
                          : "border-ink-3 bg-card text-ink group-hover:border-ink group-hover:bg-sunken"
                      }`}
                    >
                      <span className={`hidden font-mono text-[10px] leading-tight sm:block ${on ? "text-[var(--on-accent)]" : "text-ink-3"}`}>
                        {cfg.tag}
                      </span>
                      <span className={`hidden font-mono text-[10px] uppercase leading-tight tracking-wide md:block ${on ? "text-[var(--on-accent)]" : "text-ink-2"}`}>
                        {m.title}
                      </span>
                    </span>
                  )}
                </span>
                <span
                  className={`mt-2 flex items-baseline justify-between border-t-2 pt-1.5 font-mono text-[11px] tabular ${
                    on ? "border-accent font-medium text-accent-ink" : "border-edge text-ink-3 group-hover:text-ink"
                  }`}
                >
                  <span>M0{m.month}</span>
                  <span className="hidden text-[10px] md:inline">{cfg.height}%</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <figcaption id="ai-ramp-caption" className="card-foot bg-card text-xs leading-relaxed text-ink-2">
        <strong className="font-medium text-ink">Month 0{current.month} guardrail:</strong> {current.guardrail}
      </figcaption>
    </figure>
  );
}
