# Persona usability and content review — 27 Nov 2026

Reviewers (saved in `.claude/agents/`, live-tested with `scripts/ux/look.mjs` against the dev server):

| Agent | Persona | Device | Verdict in one line |
|---|---|---|---|
| `persona-student-mobile` | Priya, 19, visual comm student | Phone | Would tap "I'm starting out", then likely quit on the long plan page |
| `persona-frontend-developer` | Marcus, 34, frontend dev | Laptop | Content is accurate, but the paths only run designer → code |
| `persona-senior-career-changer` | Linda, 52, print/brand designer | Laptop, 125% zoom | Warm tone, but no sign the plan fits her background or a full-time job; small text tires her |
| `persona-design-manager` | Daniel, 44, Head of Design | Laptop | Fine to share with a team, but not for a leadership deck: 5 of 7 sources unlinked, no hire-vs-upskill help |
| `persona-esl-switcher` | Ama, 29, content specialist, ESL | Android | AX role becomes clear with effort; idioms and "handoff" metaphors need translating; no path for non-designers |
| `content-editor` | Senior content/docs writer | Both | Naming drift, Track B called "six-month", and several figures hard-coded in JSX or missing `basis` |

## Cross-cutting themes (how many reviewers hit each)

1. **Data integrity / traceability** (editor, Daniel): figures in JSX, missing `basis`, unlinked sources.
2. **Entry points only fit designers** (Marcus, Ama, Linda, Daniel): no developer, non-designer, mid-career or manager signal.
3. **Plan page friction** (Priya, Linda, Marcus, editor): "six-month" label for Track B, PDF block above the plan, first step buried, no time estimate, no skip-ahead.
4. **Jargon and idioms** (Ama, Priya, Linda, editor): "handoff", "delta", "focal contraction", PR, HEART, RICE, seed-stage.
5. **Legibility** (Linda): 10–11px mono labels and `text-xs` chart captions.
6. **Naming consistency** (editor): stage vs section, track labels, role names, Checklist naming, title case.

## Prioritized plan

### P0 — correctness and trust (do first; small, high impact)

| # | Change | Where | Source |
|---|---|---|---|
| 1 | Move hard-coded figures into `research.ts` with `basis` + source: "1 in 5" (stated two ways — pick one wording), "nearly all", "40% of teams", "20%". | `Hero.tsx:202`, `HeroStage.tsx:26`, `HandoffFlow.tsx:42`, `SkillsExplorer.tsx:44`, `AdoptionDumbbell.tsx:50` | Editor |
| 2 | Add `basis` to unbased data or flag it: DE `skillStats`, `agentMaturity`, "Over 80%", "20% feel isolated", "25%" seed-stage, `beginnerContext`. Fix "1 designer in 5" / "1 in 5 builds" to one claim. | `research.ts:273-276, 293, 369, 430, 1058, 1065-1068, 1209` | Editor |
| 3 | Fix Checklist month references that are wrong for the Meta/AX plan ("Month 5 of the plan"). | `research.ts:1297-1298` | Editor (verified) |
| 4 | Fix the misleading dumbbell comparison ("AI code vs. first UI drafts", +46 pts compares different tasks). Relabel. | `AdoptionDumbbell.tsx:21` | Editor |
| 5 | Rename Plan title "Your six-month plan" → "Your plan" (Track B is four stages). | `ui.tsx:747`, `Roles.tsx:10`, `App.tsx` titles | Editor, Ama (verified) |
| 6 | Source links: add URLs for Figma, CollabSoft, BLS, Academy UX, Hymera, or label "cited in brief, no public link". Show "Last updated" + author on Sources. Tier primary data vs commentary. | `research.ts:1306-1313`, `Sources.tsx` | Daniel (verified) |
| 7 | Render final stat values in markup (no "−0%" before animation); keep the count-up only under reduced-motion: no-preference. | `#/jobs` stat counters | Daniel, Priya |
| 8 | Fix duplicated accessible name ("See the plan for this role" ×2) from the roll animation. | `Hero.tsx:414` | Editor |

### P1 — widen who the guide welcomes (biggest UX gain)

| # | Change | Source |
|---|---|---|
| 9 | Add audience signals on Start: under Track A, "Print, brand and editorial designers fit here too"; under Track B, "No design job or degree needed"; a line for developers ("Coming from code? Start at…") and for leads ("Leading a team? Start with Jobs and Roles"). Copy only, no new stats. | Linda, Ama, Marcus, Daniel |
| 10 | Developer path: "Already code? Start at Month 3" on Track A, mark Months 1–2 skippable; a "coming from code" line on the DE role; developer-side "What carries over" on Compare. | Marcus |
| 11 | Restructure the Plan page: plan first, "Take a plan with you" PDFs after it; for Track B put "Your first step this week" + free tools at the top. | Priya, Editor |
| 12 | Time per month/stage: **gap** — no hours-per-week in the brief. Either source it or add an honest "go at your own pace; months are a guide" line. | Linda, Ama |
| 13 | Free/paid tags on tools (Cursor, Claude Code, v0, etc.) — only if verifiable; otherwise "check pricing". | Ama, Priya |
| 14 | A short "For design leads" block on Roles/Compare (hire vs upskill, JD bullets from existing Interview focus / What gets evaluated). Brief-backed only. | Daniel |

### P2 — plain language and consistency

| # | Change | Source |
|---|---|---|
| 15 | Rewrite hero h1 metaphor ("The handoff is shrinking") into a plain line, or add a plain subline right under it. | Ama, Priya |
| 16 | Idiom sweep: "last 10% of polish", "own what ships", "widen your scope", "mass applying", "handoff wall", "Workflow delta", "Focal contraction", "Spotify or Uber redesigns". | Ama, Editor |
| 17 | Define on first use or add to glossary: PR, HEART, RICE/Kano, OKRs, seed-stage, Vite, CLAUDE.md, plan mode, llms.txt, Autonomy Dial, UX Engineer / Design Technologist, "AI off". | Ama, Linda, Editor, Marcus |
| 18 | Naming rules: "stage" only for Track B (roadmap.sh → "sections"); "Track A · Working designer" / "Track B · Starting out"; full role names once, short names after; "Checklist" in UI; sentence case on tool steps; numbers spelled out in prose. Add these to DESIGN.md/AGENTS.md. | Editor |
| 19 | Library labels: "Compare roles" → "Design vs. design + code" (or make it compare three roles); "Pick your level" → "Pick your level or role"; fix matrix "3 1 , works in steps 1, 3"; align shelf titles with labels. | Editor |
| 20 | Add "surveyed" to the 50% AI-code figure; "Three roles where design and code meet" instead of "growing". | Editor |

### P3 — polish

| # | Change | Source |
|---|---|---|
| 21 | Minimum text size 12–13px for badges, tab sub-labels and chart captions; check contrast. | Linda |
| 22 | QuickFind: rank exact glossary matches first, let titles wrap, show ↑↓ ↵ hint. | Priya, Marcus |
| 23 | Track B checklist: add early "this week" items, friendlier empty state than "0% ready". | Priya |
| 24 | Jobs: a "Just starting? See the Track B plan" link next to the 97% senior figure; lead with "No, but it's changing". | Priya, Linda |
| 25 | Mobile Home: three repeats of the same five questions (nav, chips, cards) — drop chips or cards on phone. | Priya |
| 26 | Glossary page weight on mobile (~33,000px, ~370 controls): group or paginate by topic. | Ama |
| 27 | Copy-link control on plan months and figures. | Daniel |

## Gaps that need the brief (do not invent)

- Hours per week per month/stage.
- Any data on mid-career, print/brand or developer-to-design transitions.
- Tool pricing.
- Public URLs for five of the seven sources.
