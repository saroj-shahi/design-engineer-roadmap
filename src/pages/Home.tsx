import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { HeroIntro, JobsAnswer, ShiftStage, StartHere } from "../sections/Hero";
import { FindBox, startQuestions } from "../components/QuickFind";
import { Glyph, type GlyphName } from "../components/icons";
import { jumpTo, pageHref, type Page } from "../components/ui";

/** What's on each page, in the reader's words: one question per page. */
const inside: { to: Page; glyph: GlyphName; question: string; answer: string }[] = [
  { to: "roles", glyph: "eye", question: "Which direction fits me?", answer: "Three ways design and code meet, what each covers, and who it suits." },
  { to: "plan", glyph: "route", question: "What do I do next?", answer: "A step-by-step plan — whether you're upskilling at work or starting out." },
  { to: "ready", glyph: "check", question: "How do I know I'm ready?", answer: "A short proof-of-work checklist for your current team or a job search." },
  { to: "library", glyph: "library", question: "I want the detail", answer: "Role comparison, skills, tools, roadmap.sh topics and a glossary." },
];

/** The Start page reads as a short story; the rail marks the chapter in view. */
const chapters = [
  { id: "shift", label: "The shift" },
  { id: "start-here", label: "Where you start" },
  { id: "jobs", label: "Is my job going away?" },
  { id: "inside", label: "What's inside" },
] as const;

function useChapterInView(ids: readonly string[]) {
  const [current, setCurrent] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setCurrent(hit.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return current;
}

function Chapter({ id, n, label, children }: { id: string; n: number; label: string; children: ReactNode }) {
  return (
    <section id={id} aria-label={label} className="scroll-mt-32">
      <p className="label mb-5 text-accent-ink">
        {String(n).padStart(2, "0")} · {label}
      </p>
      {children}
    </section>
  );
}

export function Home() {
  const current = useChapterInView(chapters.map((c) => c.id));
  return (
    <>
      <section aria-labelledby="shift-title" className="wrap pb-16 pt-14 sm:pb-24 sm:pt-20">
        <HeroIntro>
          <div className="mx-auto mt-10 max-w-[40rem]">
            <FindBox large />
          </div>
          <ul aria-label="Common questions" className="mt-5 flex flex-wrap justify-center gap-2">
            {startQuestions.map((q) => (
              <li key={q.label}>
                {q.jump ? (
                  <button
                    type="button"
                    onClick={() => jumpTo(q.jump!)}
                    className="inline-flex min-h-10 items-center rounded-full border border-edge px-4 text-sm text-ink-2 transition-colors hover:border-accent hover:text-ink"
                  >
                    {q.label}
                  </button>
                ) : (
                  <a
                    href={q.href}
                    className="inline-flex min-h-10 items-center rounded-full border border-edge px-4 text-sm text-ink-2 transition-colors hover:border-accent hover:text-ink"
                  >
                    {q.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </HeroIntro>
      </section>

      <div className="wrap flex gap-14 pb-24 sm:pb-32">
        <nav aria-label="Chapters" className="hidden w-52 shrink-0 lg:block">
          <ol className="sticky top-28 border-l border-line">
            {chapters.map((c, i) => {
              const on = c.id === current;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(c.id)}
                    aria-current={on ? "true" : undefined}
                    className={`-ml-px block w-full border-l-2 py-2 pl-4 text-left text-sm transition-colors duration-300 ${
                      on ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink"
                    }`}
                  >
                    <span className={`font-mono text-xs ${on ? "text-accent-ink" : ""}`}>{String(i + 1).padStart(2, "0")}</span> {c.label}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex min-w-0 flex-1 flex-col gap-24 sm:gap-32">
          <Chapter id="shift" n={1} label="The shift">
            <ShiftStage />
          </Chapter>

          <Chapter id="start-here" n={2} label="Where you start">
            <StartHere />
          </Chapter>

          <Chapter id="jobs" n={3} label="Is my job going away?">
            <JobsAnswer />
          </Chapter>

          <Chapter id="inside" n={4} label="What's inside">
            <h2 id="inside-title" className="display-l text-ink" data-reveal>
              Four questions, one page <em>for each.</em>
            </h2>
            <p className="mt-5 max-w-[52ch] leading-relaxed text-ink-2" data-reveal>
              Read in any order. Each page answers one question, and the detail stays tucked away until you ask for it.
            </p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {inside.map((x, i) => (
                <li key={x.to} data-reveal style={{ "--i": i } as CSSProperties}>
                  <a href={pageHref(x.to)} className="card card-lift group flex h-full flex-col p-5 sm:p-6">
                    <Glyph name={x.glyph} className="size-12 text-ink" />
                    <span className="display-m mt-8 block text-ink">{x.question}</span>
                    <span className="mt-3 block flex-1 text-sm leading-relaxed text-pretty text-ink-2">{x.answer}</span>
                    <span className="label mt-6 text-accent-ink">Open →</span>
                  </a>
                </li>
              ))}
            </ul>
          </Chapter>
        </div>
      </div>
    </>
  );
}
