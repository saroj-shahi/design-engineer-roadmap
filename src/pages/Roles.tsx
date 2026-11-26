import { Archetypes, CaseStudies, HandoffProblem } from "../sections/Hero";
import { NextPage } from "../components/ui";

/** Why → which → proof: the handoff problem, the three roles that answer it, then two teams that did it. */
export function Roles({ role }: { role?: string }) {
  return (
    <>
      <Archetypes role={role} intro={<HandoffProblem />} />
      <CaseStudies />
      <NextPage to="plan" title="Your six-month plan" note="Turn the role you picked into steps: month by month if you already work as a designer, or stage by stage if you're starting out." />
    </>
  );
}
