# AGENTS.md

Instructions for AI coding agents working in the **Design Engineer Field Guide** repository.

## Project overview

A static, six-page interactive field guide (**Design Engineer Field Guide · 2026**) built with **React 18 + TypeScript + Vite 5 + Tailwind CSS v4**. No backend, no external router library, no test runner.

- **Audience:** Serves **both** working product designers upskilling inside their current role and designers aiming for a new hybrid role (`Track A`), plus beginners/career-switchers breaking into their first role (`Track B`). Never drift back to job-search-only framing on Home, Roles, Track A, or Checklist.
- **Design system:** Read [DESIGN.md](DESIGN.md) before changing layout, colors, typography, cards, icons, or CSS.
- **Claude-specific setup:** See [CLAUDE.md](CLAUDE.md) and `.claude/agents/` for persona review agents and dev launch config.

## Commands

```bash
npm run dev        # Vite dev server (http://localhost:5173/)
npm run typecheck  # tsc -b (strict; noUnusedLocals & noUnusedParameters are on)
npm run build      # tsc -b && vite build -> dist/
npm run preview    # Preview production build locally
npm run test:e2e   # Playwright: routes, a11y (axe), layout and flows at desktop + phone
```

Always run `npm run typecheck` (or `npm run build`) after edits.

## Architecture & file map

- `index.html`, `public/site.webmanifest`, `public/favicon.svg`, `public/404.html`: SEO metadata, Open Graph, Twitter/X Card, JSON-LD `@graph` (`WebSite` + `LearningResource`), theme-aware SVG favicon, and pre-paint theme init (`public/theme-init.js`).
- `src/App.tsx`: App shell, hash route dispatch, dynamic `document.title` and `<meta name="description">`, skip link, error boundary, `Alt+G` 12-column grid overlay.
- `src/pages/*`: Thin page composers — `Home`, `Jobs`, `Roles`, `Plan`, `Ready`, `Library`, `Sources`.
- `src/sections/*`: Content blocks — `Hero` (includes `Archetypes` and `HandoffEconomics`), `Roadmap` (Track A & Track B), `Readiness`, `Comparison`, `SkillsExplorer`, `ToolingPipeline`, `RoadmapTopics`, `Footer`.
- `src/components/ui.tsx`: Shared primitives (`Section`, `SectionHeader`, `SubHead`, `Tabs`, `TabPanel`, `useTabList`, `Disclosure`, `CheckRow`, `TopicCheckbox`, `Tag`, `BasisBadge`, `ContextBar`, `Meter`, `NextPage`), hash router (`useRoute`, `pageHref`, `navigate`, `planFromParts`), theme hook, and safe `localStorage` helpers (`usePersistentSet`). **Check here before writing a new primitive.**
- `src/components/icons.tsx`: 24×24 Swiss geometric glyphs (`Glyph`, `ArchetypeGlyph`, `BasisGlyph`, `ArrowGlyph`, `ArrowBackGlyph`, `ExternalGlyph`), including metric icons (`trendDown`, `shareBar`, `survey`, `forecast`, `caseStudy`, `stack`) and persona/role icons (`user`, `users`).
- `src/components/BrandLogo.tsx`: 25 monochrome `currentColor` app/brand marks (`BrandLogo`, `BrandLogosFor`, `detectBrands`) automatically wired into `Tag`, `ToolingPipeline`, resource links, protocol owners, and `roadmap.sh` links.
- `src/components/Nav.tsx`: Sticky header, `BrandMark` (Design × Code emblem + wordmark lockup), responsive 5-page nav, ⌘K search (`QuickFind.tsx`), scroll progress bar.
- `src/components/*`: Data visualizations and interactive modules (`HeroStage`, `MarketShiftChart`, `ArchetypeVenn`, `HandoffFlow`, `AdoptionDumbbell`, `ProtocolArchitecture`, `PlanRoadmapBase`, `RoadmapMap`).
- `src/data/research.ts`: Single source of truth for all statistics, roles, plans, checklists, skills, tooling, protocols, sources, and glossary.
- `src/data/roadmaps.ts`: Structured `roadmap.sh` curricula (8 core syllabi + companion skill roadmaps) shared between `PlanRoadmapBase` and `Library → Roadmaps`.
- `src/index.css`: Design tokens (one dark Plum Dusk set), `@theme` scales (text, radii, shadows, animations) for Tailwind utilities, typography wrapping rules, and reduced-motion-safe animations.

## Non-negotiable content rules

1. **Zero invented data:** Every figure, stat, percentage, company example, and citation must trace to `src/data/research.ts` ("The 2026 Product Design Evolution" brief). Edit data in `research.ts`, never hard-code numbers in JSX.
   - *Glossary exception:* `glossary` entries may also draw on well-established outside standards and common design knowledge (e.g., WCAG contrast ratios and levels, Hick's and Fitts's laws, IC levels). Keep them accurate to the original source, and hedge where practice varies. This covers definitions only; market stats and claims elsewhere still need the brief.
2. **Honest metric basis:** Every `Metric` carries `basis: "survey" | "analytics" | "projection" | "case" | "commentary"` and renders through `BasisBadge`. `commentary` is for figures reported second-hand in blogs or articles rather than a primary dataset.
3. **Respectful bridge tone:** Plain, direct prose. Never frame designers as "catching up" or engineers as gatekeepers; frame hybrid work as shrinking the handoff.
4. **Dual Track A framing:** Track A copy (`Home`, `Roles`, `Plan`, `Ready`, `Comparison`) must serve working designers upskilling in their current job **and** those preparing for a new role.

## Naming rules (copy)

- **Months and stages:** Track A has six **months**; Track B has four **stages**. Use "stage" only for Track B. Groups inside a roadmap.sh roadmap are **sections**; the four columns on the Tools shelf are **steps**.
- **Track labels:** always "Track A · Working designer" and "Track B · Starting out" (tags, breadcrumbs, PDF labels, search).
- **Role names:** spell a role out in full once, on the Roles page (e.g. "Agentic Experience (AX) Designer"). Everywhere else use the short names with these capitals: "Design Engineer", "Meta-Designer", "AX Designer".
- **Checklist:** "Checklist" in nav, buttons and other UI labels; "readiness checklist" only inside sentences.
- **Case:** sentence case for tool step names and UI labels ("Moving between design and code").
- **Numbers:** spell out one to nine in prose ("six-month plan", "four-stage plan", "three roles"). Figures, stats and short meta labels keep digits.
- **"Track":** only for Track A and Track B. Role emphasis is a **focus** ("Code focus", "Systems focus", "AI agent focus"); roadmap.sh syllabi are **roadmaps**.
- **Meta-Designer:** always "Meta-Designer". "Systems Architect" appears only in that role's Common titles.
- **One wording per page:** the page title in `pages` (ui.tsx), the Start page card, the h1, `NextPage` and `<title>` use the same words, with the question mark: "Is my job going away?", "Which role fits you?" (address the reader as "you", not "me"), "How do I know I'm ready?". Nav keeps its one-word labels.
- **Library shelf names:** "Design vs. design + code" in sentence case everywhere (tab, `<title>`, search, NextPage).
- **Headings:** no trailing period on h2s (h1 display lines may keep one); before/after labels read "Before → after".
- **Small, senior title:** the full `titleReality` paragraph (with its figures) appears on Jobs only; elsewhere use the one-line `titleRealityShort` next to a single link to Jobs.
- **Plain words:** no idioms or metaphors a non-native reader would need to decode; define jargon on first use or add it to the glossary.

## Routing, storage & SEO rules

- **Hash routing:** All in-app routes use `#/...` (`#/roles/de`, `#/plan/a/pde/m1`, `#/plan/b/s1`, `#/ready/a`, `#/library/roadmaps/frontend`). Keep the `legacy` anchor map in `ui.tsx` working.
- **History discipline:** Navigating to a new page or library shelf pushes history (plain `<a href>`). Switching tabs/months/stages/roles within a page calls `navigate(hash, { replace: true })`.
- **Resilient storage:** Prefix all `localStorage` keys with `de-guide:` and wrap every read/write in `try/catch` so the site works cleanly with storage blocked.
- **Titles & meta:** Keep route titles on the `Page | Design Engineer Field Guide` pattern in `App.tsx`, and keep `index.html`, `site.webmanifest`, and `404.html` synchronized.

## Verification checklist

Before finishing any UI or content change:
1. Run `npm run typecheck`, `npm run build` and `npm run test:e2e` with zero errors or failures.
2. Check rendered views at desktop (`~1280px`) and mobile (`~375px`) (the site has one dark theme).
3. Confirm zero horizontal overflow, zero console/network errors, high-contrast headers/tabs, clean keyboard focus order, and no orphan-word regressions.

## Git rules

- Commit messages: imperative, sentence case, no prefix (e.g., `Align home stat card footers across breakpoints`).
- Never include AI agent attribution lines or `Co-Authored-By:` trailers for AI tools/models.
- Never attribute work to an AI agent anywhere: not as commit author or committer, and not in commit messages, PR text, comments, or footers, on any surface including the mobile app. Commit as the repository owner (match the owner's earlier commits in `git config user.name`/`user.email`).
