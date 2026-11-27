# Improvement plan, round 2 — 27 Nov 2026

Follows [the round 1 review](2026-11-27-persona-review.md). All 27 round-one items shipped in `78d50cd`, and the source fixes and phone charts in `1b6402d`. The same six agents (`.claude/agents/`) then re-tested the live site with `scripts/ux/look.mjs`.

## Where each reader stands now

| Reader | Round 1 | Round 2 |
|---|---|---|
| Priya, 19, student, phone | Would quit on the plan page | Feels informed; first step and checklist feel doable |
| Marcus, 34, frontend developer | Unsure the guide was for him | Would stay; developer path still feels like a footnote |
| Linda, 52, print/brand designer | Didn't see herself; small text tiring | Feels welcome; 12px grey labels still tiring; no time estimate |
| Daniel, 44, Head of Design | Not deck-ready; unlinked sources | Shareable; brief itself has no author/date; leads block thin |
| Ama, 29, content specialist, ESL | Not sure she was invited | Sure she's Track B; handoff jargon and long glossary remain |
| Content editor | Naming drift, unsourced figures | Fixes held; repetition, label drift, two over-claiming visuals |

## Prioritized plan

### P0 — correctness (visuals or data that claim more than they show)

| # | Change | Where | From |
|---|---|---|---|
| 1 | Retitle the adoption chart: "divergence, then convergence" can't be shown because 2025 and 2026 rows measure different things. E.g. "How designers and developers use AI, 2025 and 2026". Change "focal share" → "survey share". | `AdoptionDumbbell.tsx:39, :282` | Editor |
| 2 | Fix tools pipeline numbering: the last chain link is labelled "04" but holds step 03 tools, while step 04 shows as excluded. | `ToolingPipeline.tsx` | Editor |
| 3 | Fix the MCP protocol card: MCP doesn't "decide" which tokens an agent can change. "Defines how an agent asks for data. What it can read or change depends on the server you connect." Add client/server line to the MCP glossary entry. | `research.ts:520, :1694` | Marcus |
| 4 | Data flags: "In high demand at Vercel…" → "Hiring at…"; "40%… with AI" must match the data label ("Teams where PMs or engineers now create UI"); "~90%" is second-hand → basis `commentary` or cite the primary source; "Junior hiring at startups" → "Entry-level hiring"; add population to the 12.6–13% attrition scope; add URL to "Over 80%". | `research.ts:312, :1165, :1167, :202, :408`, `SkillsExplorer.tsx:44` | Editor |
| 5 | Re-check the "See the plan for this role" link's accessible name in a browser (round 1 reported it read once; round 2 flags it as doubled). Fix with `aria-hidden` on the duplicate if it is doubled. | `Hero.tsx:520` | Editor |
| 6 | Track B base column and Stage 1 list nearly the same topics. Merge them, or say "Stage 1 works through the base". | Plan, Track B | Editor |
| 7 | Remove the duplicate SignalFire entry (primary source 01 and works cited 02); check the "29 articles" count. | `#/sources` | Editor |

### P1 — reader paths

| # | Change | From |
|---|---|---|
| 8 | Developer entry on Start: promote "Coming from code?" from a muted footnote to a button-weight link (no third track). | Marcus |
| 9 | Month 3 for developers: say it starts with design tokens and type scale work, and mark TypeScript basics "skip if you code". | Marcus |
| 10 | `#/plan` with no track picked: show Track B's first step as a teaser (or preselect from stored choice). Same for `#/ready`: preview the first "This week" item. | Priya |
| 11 | For design leads: add a "For design leads" link on Start pointing to the Roles leads section; add a decision rule (when to hire vs upskill) and level expectations, each sourced or labelled as the guide's view; a "share the Track A PDF with your team" line on Plan. | Daniel |
| 12 | Jobs: one short paragraph for experienced or print/brand designers (no new figures); one sentence on the entry route for beginners next to the "small, senior title" figure. | Linda, Priya |
| 13 | Roles: a two-sentence plain "A day in this role" at the top of each role tab, before the diagram. | Linda |
| 14 | Month 1 label: alongside "Optional if you already code", add "Start here if you don't code". | Linda |

### P2 — plain language and consistency

| # | Change | From |
|---|---|---|
| 15 | Handoff jargon: "Why: handoffs are the bottleneck" → "Why: passing work from designer to developer is slow"; gloss "redlines" (notes on a design); replace "close the gap"; "handoff economics" in the Roles meta description → plain words. | Ama, Editor |
| 16 | Define "agent" on first use on `#/roles/ax` ("An agent is an AI that does tasks for you, not only chat"); plain intros for "Escalation pathways" and "Action audits". | Ama |
| 17 | "Meta-Designer" in one form everywhere; "Systems Architect" only under Common titles. | Editor |
| 18 | "Track" only for A/B: Venn labels "CODE TRACK / SYSTEMS TRACK / AI AGENT TRACK" → "Code focus" etc. | Editor |
| 19 | One wording per page across nav, Home cards, h1, NextPage and `<title>` ("Which role fits you?" vs "me"); restore "?" in "Is my job going away?" tab title. | Editor |
| 20 | Show the "small, senior title" paragraph in full on Jobs only; one line + link on Home and Roles. | Editor |
| 21 | Heading punctuation: no trailing periods on h2s; one "Before → after" style. | Editor |
| 22 | "Design vs. design + code" in sentence case everywhere (tab, `<title>`, meta, NextPage, Compare column labels). | Editor |
| 23 | Checklist toggle shows "Track A · Working designer / Track B · Starting out"; "both Track A plans" → "Track A (either role)"; "works in 10 seconds" → "anyone can use in seconds"; plainer meta description. | Editor |
| 24 | Plan copy: drop the repeated "Pick where you are today" from the lede; same at-a-glance column headers for both tracks; "Junior portfolio screening" → "What reviewers check in a junior portfolio"; "applicants per role" → match "Applications per job post". | Editor |
| 25 | Start: move "Or open the Checklist" below the track cards; drop duplicate "TS" chip next to "TypeScript"; Track A card should mention the design base before the six months; meta description covers both tracks. | Editor |
| 26 | Remaining idioms: "land a junior job", "stand out", "Ship real work" → "Publish real work"; split the three-number `titleReality` sentence. | Ama |

### P3 — legibility and polish

| # | Change | From |
|---|---|---|
| 27 | Raise reading labels to 13–14px and use `text-ink-2` (not `text-ink-3`) where readers need the text; fix the two remaining `text-[11px]` markers. | Linda |
| 28 | Tablet widths (640–1023px) still show SVG chart labels at 7–11px: use the HTML chart variants up to 1024px or enlarge labels. | Round 2 check |
| 29 | Glossary on phones (~16,000px, 165 terms): collapse every group by default or show 10 per group with "Show all". | Ama |
| 30 | Search results: trim descriptions at sentence ends; label each result with its page or shelf, not only "Glossary". | Priya |
| 31 | Jobs figures: a one-line plain caption under each big number. | Priya |
| 32 | Label plan PDFs "for print or desktop". | Priya |
| 33 | Glossary: link "Design tokens" to "Semantic tokens" and mention the W3C DTCG format. | Marcus |
| 34 | Tools: "Some tools have free plans; we did not check their limits." | Ama |

## Blocked on the research brief (do not invent)

- Hours per week for each month or stage.
- Tool prices and free-tier limits.
- Data on career moves (from code, mid-career, print/brand).
- An author, publisher and date for the research brief itself, shown on Sources.
- Levelling expectations and a hire-vs-upskill decision rule, unless labelled as the guide's own view.

## How to re-run the review

Start the dev server (`dev` in `.claude/launch.json`), then ask for the agents by name: `persona-student-mobile`, `persona-frontend-developer`, `persona-senior-career-changer`, `persona-design-manager`, `persona-esl-switcher`, `content-editor` (plus the older `persona-beginner` and `persona-practicing-designer`).
