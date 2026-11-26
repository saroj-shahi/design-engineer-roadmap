# Design Engineer Field Guide

A static, five-page field guide for designers upskilling into code or moving into **Design Engineer**, **Meta-Designer**, and **AX Designer** roles (**Design Engineer Field Guide · 2026**). React 18 + TypeScript + Vite 5 + Tailwind v4. No backend, no router library, no tests.

See **[AGENTS.md](AGENTS.md)** for full cross-agent instructions and **[DESIGN.md](DESIGN.md)** for the complete Plum Dusk design system, color tokens, typography rules, and Visual QA checklist.

## Commands

- `npm run dev`: dev server. For previews use the `dev` config in `.claude/launch.json` (port 5173, strict).
- `npm run typecheck`: `tsc -b`. Run after every change; `noUnusedLocals`/`noUnusedParameters` are on, so dead imports fail.
- `npm run build`: typecheck + production build to `dist/`.

## Layout

- `index.html`, `public/site.webmanifest`, `public/favicon.svg`, `public/404.html`: SEO metadata, Open Graph, Twitter/X, JSON-LD `@graph` (`WebSite` + `LearningResource`), dark Design × Code SVG favicon.
- `src/App.tsx`: shell. Picks the page from the hash route, syncs `document.title` (`Page | Design Engineer Field Guide`) and `<meta name="description">`, skip link, error boundary, `Alt+G` grid overlay.
- `src/pages/*`: thin page composers (`Home`, `Roles`, `Plan`, `Ready`, `Library`).
- `src/sections/*`: content blocks (`Hero`, `Roadmap`, `RoadmapTopics`, `Readiness`, `Comparison`, `SkillsExplorer`, `ToolingPipeline`, `Footer`).
- `src/components/ui.tsx`: shared primitives and hooks (`Section`, `SectionHeader`, `SubHead`, `Tabs`/`TabPanel`/`useTabList`, `Disclosure`, `CheckRow`, `TopicCheckbox`, `Tag`, `BasisBadge`, `ContextBar`, `Meter`, `NextPage`, hash router, persisted state). Check here before writing a new primitive.
- `src/components/icons.tsx` & `src/components/BrandLogo.tsx`: 24×24 Swiss geometric glyphs (including metric/basis icons and `user`/`users` role icons) and 25 monochrome `currentColor` app/brand marks.
- `src/components/*`: interactive diagrams & widgets (`Nav` with `BrandMark`, `QuickFind` (⌘K search), `HeroStage`, `MarketShiftChart`, `ArchetypeVenn`, `HandoffFlow`, `HandoffPlate`, `AdoptionDumbbell`, `AiAutonomyRamp`, `ProtocolArchitecture`, `PlanRoadmapBase`, `RoadmapMap`).
- `src/data/research.ts`: single source of truth for all research brief figures, roles, plans, checklists, tooling, and glossary.
- `src/data/roadmaps.ts`: structured `roadmap.sh` curricula (8 tracks + companion skill tracks).
- `src/index.css`: design tokens, Tailwind `@theme` mapping, `@layer components` primitives, typography wrapping (`balance`/`pretty`), and animations.

## Content rules

- `src/data/research.ts` is the single source of truth, drawn from "The 2026 Product Design Evolution" research brief. **Never invent figures, stats, or sources.** Every number must trace to that brief; change data there, not in JSX.
- **Glossary exception:** `glossary` entries may also draw on well-established outside standards and common design knowledge (e.g., WCAG contrast ratios and levels, Hick's and Fitts's laws, IC levels). Keep them accurate to the original source, and hedge where practice varies (e.g., "varies by company"). This exception covers definitions only. Market stats, metrics and claims elsewhere on the site still need the brief.
- Each `Metric` carries a `basis` (`survey | analytics | projection | case`); keep it honest and render it with `BasisBadge`.
- Copy is plain and direct, and must not slight designers or developers: frame the role as a bridge, not one side catching up to the other.
- Track A serves **both** working designers upskilling in their current role and those preparing for a new hybrid role — never assume every reader is job-hunting.

## Routing and state

- Hash router in `ui.tsx` (`useRoute`, `pageHref`, `parseRoute`) so it works on any static host. Routes look like `#/roles/de`, `#/plan/a/meta/m4`, `#/ready/b`, `#/library/roadmaps/frontend`.
- URL sub-parts write reader choices (track `a|b`, Track A option `pde|meta`) into storage. Keep the `legacy` anchor table working.
- Adding a page means: add it to `Page` and `pages` in `ui.tsx`, render it in `App.tsx`, and add its title/description in `titleFor`/`descriptionFor`; it appears in `Nav` automatically.
- Use `navigate(hash, { replace: true })` to reflect a view choice in the URL without adding history.
- Persisted state uses `localStorage` keys prefixed `de-guide:` via `usePersistentSet` and helpers in `ui.tsx`. Always wrap storage access in `try/catch`; the page must work with storage blocked.

## Design system & accessibility (summary — full spec in DESIGN.md)

- "Plum Dusk": **one dark theme only** (no light theme, no toggle), one rose accent (`--accent`), soft radii (`--radius`, `--radius-s`, `--radius-xs`), quiet shadows (`--sh-1`, `--sh-2`), 12-column grid (`.wrap` + `.grid-12`). Fonts: Bricolage Grotesque / DM Sans / DM Mono.
- Use semantic tokens via Tailwind; never hard-code colors. Use `bg-inverse text-on-inverse` (never `bg-edge text-card`) for raised header bands and active tabs.
- Tokens live once, in the `:root` block of `index.css`.
- Motion goes inside `@media (prefers-reduced-motion: no-preference)`.
- Accessibility is a requirement: keyboard-reachable everything, native `<button>`/`<a>`, ARIA tabs via `useTabList`, `aria-hidden="true"` + `focusable="false"` on decorative SVGs, visible `:focus-visible`, modifier-gated shortcuts (WCAG 2.1.4).

## Persona review agents

- `.claude/agents/persona-practicing-designer.md` (**Maya**, Track A — upskilling at work or evolving into a hybrid role)
- `.claude/agents/persona-beginner.md` (**Sam**, Track B — starting out and aiming for a first role)

## Verifying changes

Run `npm run typecheck` and `npm run build`, then check the preview at desktop (`~1280px`) and mobile (`~375px`).

## Git

Commit messages: imperative, sentence case, no prefix (e.g., `Replace the side rail with a sticky top nav`). Never include AI agent attribution lines or `Co-Authored-By:` trailers. Never attribute work to an AI agent anywhere: not as commit author or committer, and not in commit messages, PR titles or bodies, comments, or footers. This applies on every surface, including the mobile app. Commit as the repository owner (set `git config user.name` and `user.email` to match the owner's earlier commits before the first commit).
