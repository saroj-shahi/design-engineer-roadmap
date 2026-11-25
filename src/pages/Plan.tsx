import { Roadmap } from "../sections/Roadmap";
import { NextPage } from "../components/ui";

export function Plan() {
  return (
    <div className="pt-8 sm:pt-12">
      <Roadmap />
      <NextPage to="ready" title="Am I ready to apply?" note="Check your portfolio against what reviewers open first." />
    </div>
  );
}
