/** Printable copies of each plan, rendered into `public/plans/` by `npm run pdfs` (scripts/pdf/render.mjs). */
export const PLAN_PDFS = [
  { id: "a-pde", file: "plans/track-a-design-engineer.pdf", label: "Track A · Design Engineer" },
  { id: "a-meta", file: "plans/track-a-meta-designer.pdf", label: "Track A · Meta-Designer or AX Designer" },
  { id: "b", file: "plans/track-b-starting-out.pdf", label: "Track B · Starting out" },
] as const;

export type PlanPdfId = (typeof PLAN_PDFS)[number]["id"];
