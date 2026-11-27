import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ChoosePathButton, HeroIntro, JobsShortAnswer, StartHere } from "../sections/Hero";
import { articles, sources } from "../data/research";
import { FindBox } from "../components/QuickFind";
import { ResumeCard } from "../components/ResumeCard";
import { Glyph, type GlyphName } from "../components/icons";
import { cardLink, ActionLink, SubHead, jumpTo, pageHref, type Page } from "../components/ui";

/** What's on each page, in the reader's words: one question per page. */
const inside: { to: Page; glyph: GlyphName; question: string; answer: string }[] = [
  {
    to: "jobs",
    glyph: "forecast",
    question: "Is my job going away?",
    answer: "The hiring data for designers, how teams are changing, and every figure with its source.",
  },
  { to: "roles", glyph: "eye", question: "Which role fits you?", answer: "Three ways design and code meet, what each covers, and who it suits." },
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
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ChoosePathButton />
              <ActionLink href={pageHref("sources")} variant="secondary">{`Built from ${sources.length} sources and ${articles.length} articles`}</ActionLink>
            </div>
            <ResumeCard />
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
            title={
              <>
                Where are you <em>starting from?</em>
              </>
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
            title={
              <>
                Five questions, one page <em>for each</em>
              </>
            }
            note="Read in any order. Each page answers one question, and the detail stays tucked away until you ask for it."
          >
            {/* A directory of the guide's pages (the same set as the top nav), so it counts as navigation. */}
            <ul data-nav aria-label="Pages in this guide" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
              {inside.map((x, i) => (
                <li
                  key={x.to}
                  data-reveal
                  style={{ "--i": i } as CSSProperties}
                  className={i < 2 ? "xl:col-span-3" : i === inside.length - 1 ? "sm:col-span-2 xl:col-span-2" : "xl:col-span-2"}
                >
                  <a href={pageHref(x.to)} className={`relative ${cardLink} group flex h-full flex-col p-5 sm:p-6`}>
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
