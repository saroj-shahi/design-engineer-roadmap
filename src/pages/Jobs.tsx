import { JobsFigures, JobsShortAnswer, MarketTable, TeamShift } from "../sections/Hero";
import { MarketShiftChart } from "../components/MarketShiftChart";
import { NextPage, PageHeader, SubHead } from "../components/ui";

/** "Is my job going away?": the short answer first, then the hiring data, how teams are changing, and every figure. */
export function Jobs() {
  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-24 pt-8 sm:pb-32 sm:pt-12">
        <PageHeader
          id="jobs-title"
          title={["Is my job", <em>going away?</em>]}
          lede="The short answer first, then the hiring data behind it. Every figure keeps its source and scope, and says whether it is hiring data, a survey or a forecast."
        />

        {/* The card carries its own "The short answer" band and headline, so this section needs no heading of its own. */}
        <section aria-label="The short answer" className="mt-4">
          <JobsShortAnswer />
          <div className="mt-8 sm:mt-10">
            <JobsFigures />
          </div>
        </section>

        <section aria-labelledby="jobs-shift-title" className="mt-24 sm:mt-32">
          <SubHead
            id="jobs-shift-title"
            eyebrow="01 · Hiring"
            title={<>Where hiring grew, <em>and where it shrank.</em></>}
            note="Change in hiring by role and company size (mostly compared with 2019), next to the US government's forecast for web and interface design jobs."
          />
          <MarketShiftChart />
        </section>

        <section aria-labelledby="jobs-teams-title" className="mt-24 sm:mt-32">
          <SubHead
            id="jobs-teams-title"
            eyebrow="02 · Teams"
            title={<>How teams are <em>changing.</em></>}
            note="AI use by designers and developers is converging, and teams are getting flatter. Both point toward people who can work across design and code."
          />
          <TeamShift />
        </section>

        <section aria-labelledby="jobs-table-title" className="mt-24 sm:mt-32">
          <SubHead id="jobs-table-title" eyebrow="03 · Every figure" title="Every market figure, with scope and source" />
          <MarketTable />
        </section>
      </div>
      <NextPage to="roles" title="Which role fits you?" note="Three roles where design and code meet. See what each one involves and who it suits." />
    </>
  );
}
