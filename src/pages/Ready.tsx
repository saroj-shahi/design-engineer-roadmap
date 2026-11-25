import { Readiness } from "../sections/Readiness";
import { NextPage, trackFromPart } from "../components/ui";

export function Ready({ parts = [] }: { parts?: string[] }) {
  return (
    <div className="pt-8 sm:pt-12">
      <Readiness track={trackFromPart(parts[0])} />
      <NextPage to="library" title="Go deeper in the library" note="Compare roles, browse skills and tools, or look up a term." />
    </div>
  );
}
