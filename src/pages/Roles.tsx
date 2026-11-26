import { Archetypes, HandoffEconomics } from "../sections/Hero";
import { NextPage } from "../components/ui";

export function Roles({ role }: { role?: string }) {
  return (
    <>
      <Archetypes role={role} />
      <HandoffEconomics />
      <NextPage to="plan" title="Your six-month plan" note="Turn the role you picked into steps: month by month if you already work as a designer, or stage by stage if you're starting out." />
    </>
  );
}
