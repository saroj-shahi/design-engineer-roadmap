import { articles, lastUpdated, sources, worksCited } from "../data/research";
import { NextPage, PageHeader, SubHead, TextLink } from "../components/ui";

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const lastUpdatedLabel = new Date(`${lastUpdated}T00:00:00Z`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Every source behind the guide's figures, plus how they are used. Linked from the footer and from search. */
export function Sources() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-24 pt-8 sm:pb-32 sm:pt-12">
      <PageHeader
        id="sources-title"
        title={["Sources", <em>and method.</em>]}
        lede={`Every figure in this guide traces to one research brief. Here are the ${sources.length} data sources it cites and ${articles.length} articles behind it.`}
      >
        <p className="mt-8 font-mono text-label font-normal text-ink-3">
          Last updated <time dateTime={lastUpdated}>{lastUpdatedLabel}</time>
        </p>
      </PageHeader>

      <section aria-labelledby="method-title" className="mt-4">
        <SubHead id="method-title" eyebrow="01 · Method" title="How the figures are used" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="relative rounded-card border border-edge bg-card p-6 shadow-1 sm:p-7">
            <p className="font-mono text-label text-accent-ink">Scope and vintage</p>
            <p className="mt-3 max-w-[56ch] leading-relaxed text-ink-2">
              Figures are reproduced from “The 2026 Product Design Evolution” research brief with their original scope and vintage.
            </p>
          </div>
          <div className="relative rounded-card border border-edge bg-card p-6 shadow-1 sm:p-7">
            <p className="font-mono text-label text-accent-ink">Case studies</p>
            <p className="mt-3 max-w-[56ch] leading-relaxed text-ink-2">Case studies describe single organizations and are not market benchmarks.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="cited-title" className="mt-20 sm:mt-28">
        <SubHead
          id="cited-title"
          eyebrow="02 · Primary data"
          title="Data sources cited in the research brief"
          action={<span className="font-mono text-label text-ink-3">{sources.length} sources</span>}
        />
        <ol className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((s, i) => (
            <li key={s.label} className="flex items-start gap-4 border-t border-line py-4">
              <span className="w-7 shrink-0 pt-0.5 font-mono text-label tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 leading-snug">
                {s.url ? (
                  <>
                    <TextLink href={s.url}>{s.label}</TextLink>
                    {/* An article that is also this source is merged here, so each URL appears once on the page. */}
                    {worksCited
                      .filter((w) => w.url === s.url)
                      .map((w) => (
                        <span key={w.url} className="mt-1 block font-mono text-label font-normal text-ink-3">
                          Also cited as “{w.title}”
                        </span>
                      ))}
                  </>
                ) : (
                  <>
                    <span className="text-ink-2">{s.label}</span>
                    <span className="mt-1 block font-mono text-label font-normal text-ink-3">Cited in the research brief · no public link</span>
                  </>
                )}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="works-title" className="mt-20 sm:mt-28">
        <SubHead
          id="works-title"
          eyebrow="03 · Commentary"
          title="Works cited: articles and commentary"
          action={<span className="font-mono text-label text-ink-3">{articles.length} articles</span>}
        />
        <ol className="grid gap-x-6 sm:grid-cols-2">
          {articles.map((w, i) => (
            <li key={w.url} className="flex items-start gap-4 border-t border-line py-4">
              <span className="w-7 shrink-0 pt-0.5 font-mono text-label tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 leading-snug">
                <TextLink href={w.url}>{w.title}</TextLink>
                <span className="mt-1 block break-all font-mono text-xs text-ink-3">{hostnameOf(w.url)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-20 [&>div]:max-w-none [&>div]:px-0 sm:mt-28">
        <NextPage to="home" title="Back to the start" note="Pick a path, or ask the guide a question." />
      </div>
    </div>
  );
}
