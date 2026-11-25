import { Archetypes, HandoffEconomics } from "../sections/Hero";
import { NextPage } from "../components/ui";

export function Roles({ role }: { role?: string }) {
  return (
    <>
      <Archetypes role={role} />
      <HandoffEconomics />
      <NextPage to="plan" title="Your six-month plan" note="Turn the role you picked into steps, one month at a time." />
    </>
  );
}
