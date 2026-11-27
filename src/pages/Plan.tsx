import { Roadmap } from "../sections/Roadmap";
import { NextPage, planFromParts } from "../components/ui";

export function Plan({ parts }: { parts: string[] }) {
  return (
    <div className="pt-8 sm:pt-12">
      <Roadmap plan={planFromParts(parts)} />
      <NextPage
        to="ready"
        title="How do I know I'm ready?"
        note="Check your proof of work — whether you're shipping in your current role or sharing a portfolio."
      />
    </div>
  );
}
