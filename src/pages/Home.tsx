import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ChoosePathButton, HeroIntro, JobsShortAnswer, StartHere } from "../sections/Hero";
import { sources, worksCited } from "../data/research";
import { FindBox, startQuestions } from "../components/QuickFind";
import { ArrowGlyph, Glyph, type GlyphName } from "../components/icons";
import { SubHead, jumpTo, pageHref, type Page } from "../components/ui";

/** What's on each page, in the reader's words: one question per page. */
const inside: { to: Page; glyph: GlyphName; question: string; answer: string }[] = [
  { to: "jobs", glyph: "forecast", question: "Is my job going away?", answer: "The hiring data for designers, how teams are changing, and every figure with its source." },
  { to: "roles", glyph: "eye", question: "Which role fits me?", answer: "Three ways design and code meet, what each covers, and who it suits." },
  { to: "plan", glyph: "route", question: "What do I do next?", answer: "A step-by-step plan — whether you're upskilling at work or starting out." },
  { to: "ready", glyph: "check", question: "How do I know I'm ready?", answer: "A short proof-of-work checklist for your current team or a job search." },
  { to: "library", glyph: "library", question: "I want the detail", answer: "Role comparison, skills, tools, roadmap.sh topics and a glossary." },
];

/** The Start page reads as a short story; the rail marks the chapter in view. */
const chapters = [
  { id: "start-here", label: "Where you start" },
  { id: "jobs", label: "Jobs" },
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

function Chapter({
  id,
  n,
  label,
  title,
  note,
  action,
  children,
}: {
  id: string;
  n: number;
  label: string;
  title: ReactNode;
  note?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32">
      <SubHead id={`${id}-title`} eyebrow={`${String(n).padStart(2, "0")} · ${label}`} title={title} note={note} action={action} />
      {children}
    </section>
  );
}

export function Home() {
  const current = useChapterInView(chapters.map((c) => c.id));
  return (
    <>
      <section aria-labelledby="shift-title" className="relative isolate overflow-x-clip">
        {/* Faint drafting grid behind the hero, fading out toward the content */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:radial-gradient(70%_70%_at_50%_30%,black,transparent)] opacity-60"
        />
        <div className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-16 pt-10 sm:pb-24 sm:pt-12">
          <HeroIntro>
            <div className="mt-7 max-w-[38rem]">
              <FindBox large />
            </div>
            {/* Phones skip the chips: the nav and the "What's inside" cards already offer the same questions. */}
            <ul aria-label="Common questions" className="mt-3 hidden max-w-[40rem] flex-wrap gap-2 sm:flex">
              {startQuestions.map((q) => (
                <li key={q.label}>
                  {q.jump ? (
                    <button
                      type="button"
                      onClick={() => jumpTo(q.jump!)}
                      className="inline-flex min-h-10 items-center rounded-full border border-edge bg-card/40 px-4 text-sm text-ink-2 transition-colors hover:border-accent hover:text-ink"
                    >
                      {q.label}
                    </button>
                  ) : (
                    <a
                      href={q.href}
                      className="inline-flex min-h-10 items-center rounded-full border border-edge bg-card/40 px-4 text-sm text-ink-2 transition-colors hover:border-accent hover:text-ink"
                    >
                      {q.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ChoosePathButton />
              <a href={pageHref("sources")} className="group inline-flex items-center gap-2 text-sm text-ink-3 transition-colors hover:text-ink">
                Built from {sources.length} sources and {worksCited.length} articles
                <ArrowGlyph />
              </a>
            </div>
          </HeroIntro>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] px-(--gutter) flex gap-14 pb-24 sm:pb-32">
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
          <Chapter
            id="start-here"
            n={1}
            label="Where you start"
            title={<>Where are you <em>starting from?</em></>}
            action={
              <a href="#/ready" className="relative after:absolute after:-inset-x-2 after:-inset-y-[15px] after:content-[''] group bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]">
                <span>Or open the Checklist</span>
                <ArrowGlyph />
              </a>
            }
          >
            <StartHere />
          </Chapter>

          <Chapter id="jobs" n={2} label="Jobs" title="Is my job going away?">
            <JobsShortAnswer more />
          </Chapter>

          <Chapter
            id="inside"
            n={3}
            label="What's inside"
            title={<>Five questions, one page <em>for each.</em></>}
            note="Read in any order. Each page answers one question, and the detail stays tucked away until you ask for it."
          >
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
              {inside.map((x, i) => (
                <li key={x.to} data-reveal style={{ "--i": i } as CSSProperties} className={i < 2 ? "xl:col-span-3" : i === inside.length - 1 ? "sm:col-span-2 xl:col-span-2" : "xl:col-span-2"}>
                  <a href={pageHref(x.to)} className="relative rounded-card border border-edge bg-card shadow-1 group/card transition-[translate,box-shadow,border-color,opacity] duration-[260ms] ease-spring hover:-translate-y-[3px] hover:border-line-strong hover:shadow-2 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink has-[>input:focus-visible]:outline-2 has-[>input:focus-visible]:outline-offset-4 has-[>input:focus-visible]:outline-accent-ink motion-reduce:hover:translate-y-0 group flex h-full flex-col p-5 sm:p-6">
                    <Glyph name={x.glyph} className="size-12 text-ink" />
                    <span className="font-display text-display-m text-balance mt-8 block text-ink">{x.question}</span>
                    <span className="mt-3 block flex-1 text-sm leading-relaxed text-pretty text-ink-2">{x.answer}</span>
                    <span className="font-mono text-label font-normal mt-6 text-accent-ink">Open →</span>
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
