import type { CSSProperties } from "react";
import { Hero } from "../sections/Hero";
import { Glyph, type GlyphName } from "../components/icons";
import { pageHref, type Page } from "../components/ui";

/** What's on each page, in the reader's words: one question per page. */
const inside: { to: Page; glyph: GlyphName; question: string; answer: string }[] = [
  { to: "roles", glyph: "eye", question: "Which direction fits me?", answer: "Three ways design and code meet, what each covers, and who it suits." },
  { to: "plan", glyph: "route", question: "What do I do next?", answer: "A step-by-step plan — whether you're upskilling at work or starting\u00A0out." },
  { to: "ready", glyph: "check", question: "How do I know I'm ready?", answer: "A short proof-of-work checklist for your current team or a job\u00A0search." },
  { to: "library", glyph: "library", question: "I want the detail", answer: "Role comparison, skills, tools, roadmap.sh topics and a glossary." },
];

export function Home() {
  return (
    <>
      <Hero />
      <section aria-labelledby="inside-title" className="wrap pb-24 pt-20 sm:pb-32 sm:pt-28">
        <h2 id="inside-title" className="display-l text-ink" data-reveal>
          Four questions, one page <em>for each.</em>
        </h2>
        <p className="mt-5 max-w-[52ch] leading-relaxed text-ink-2" data-reveal>
          Read in any order. Each page answers one question, and the detail stays tucked away until you ask for it.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {inside.map((x, i) => (
            <li key={x.to} data-reveal style={{ "--i": i } as CSSProperties}>
              <a href={pageHref(x.to)} className="card card-lift group flex h-full flex-col p-5 sm:p-6">
                <Glyph name={x.glyph} className="size-14 text-ink" />
                <span className="display-m mt-8 block text-ink">{x.question}</span>
                <span className="mt-3 block flex-1 text-sm leading-relaxed text-pretty text-ink-2">{x.answer}</span>
                <span className="label mt-6 text-accent-ink">Open →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
