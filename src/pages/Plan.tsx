import { Roadmap } from "../sections/Roadmap";
import { NextPage, planFromParts } from "../components/ui";

export function Plan({ parts }: { parts: string[] }) {
  return (
    <div className="pt-8 sm:pt-12">
      <Roadmap plan={planFromParts(parts)} />
      <NextPage to="ready" title="Am I ready to apply?" note="Check your portfolio against what reviewers open first." />
    </div>
  );
}
