import { Readiness } from "../sections/Readiness";
import { NextPage } from "../components/ui";

export function Ready() {
  return (
    <div className="pt-8 sm:pt-12">
      <Readiness />
      <NextPage to="library" title="Go deeper in the library" note="Compare roles, browse skills and tools, or look up a term." />
    </div>
  );
}
