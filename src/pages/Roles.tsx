import { useEffect } from "react";
import { Archetypes, CaseStudies, ForLeads, HandoffProblem } from "../sections/Hero";
import { NextPage } from "../components/ui";

/** Why → which → proof: the handoff problem, the three roles that answer it, then two teams that did it.
 *  `#/roles/leads` lands on the section for design leads. */
export function Roles({ role }: { role?: string }) {
  const leads = role === "leads";
  useEffect(() => {
    if (!leads) return;
    // Instant, like the role picker's arrival scroll: a long smooth scroll can be cut short while the page settles.
    const id = requestAnimationFrame(() => {
      const el = document.getElementById("leads");
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (window.innerWidth >= 1024 ? 96 : 120), behavior: "instant" as ScrollBehavior });
    });
    return () => cancelAnimationFrame(id);
  }, [leads]);
  return (
    <>
      <Archetypes role={leads ? undefined : role} intro={<HandoffProblem />} />
      <CaseStudies />
      <ForLeads />
      <NextPage
        to="plan"
        title="Your plan"
        note="Turn the role you picked into steps: month by month if you already work as a designer, or stage by stage if you're starting out."
      />
    </>
  );
}
