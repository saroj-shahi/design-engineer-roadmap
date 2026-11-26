import { Archetypes, Evidence, HandoffProblem } from "../sections/Hero";
import { NextPage } from "../components/ui";

/** Why → which → proof: the handoff problem, the three roles that answer it, then the data. */
export function Roles({ role }: { role?: string }) {
  return (
    <>
      <Archetypes role={role} intro={<HandoffProblem />} />
      <Evidence />
      <NextPage to="plan" title="Your six-month plan" note="Turn the role you picked into steps: month by month if you already work as a designer, or stage by stage if you're starting out." />
    </>
  );
}
