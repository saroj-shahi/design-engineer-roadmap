# Design Engineer Field Guide

A static, five-page field guide for designers moving into design engineering ("Designer → Design Engineer · 2026"). React 18 + TypeScript + Vite 5 + Tailwind v4. No backend, no router library, no tests.

## Commands

- `npm run dev`: dev server. For previews use the `dev` config in `.claude/launch.json` (port 5173, strict).
- `npm run typecheck`: `tsc -b`. Run it after every change; `noUnusedLocals`/`noUnusedParameters` are on, so dead imports fail.
- `npm run build`: typecheck + production build to `dist/`.

## Layout

- `src/App.tsx`: shell. Picks the page from the route, sets `document.title`, skip link, Alt+G grid overlay.
- `src/pages/*`: one file per page (`Home`, `Roles`, `Plan`, `Ready`, `Library`). Pages are thin; they compose sections.
- `src/sections/*`: the real content blocks (`Hero`, `Roadmap`, `Readiness`, `Comparison`, `SkillsExplorer`, `ToolingPipeline`, `Footer`).
- `src/components/ui.tsx`: shared primitives and hooks: `Section`, `SectionHeader`, `Tabs`/`TabPanel`/`useTabList`, `Disclosure`, `CheckRow`, `Tag`, `BasisBadge`, the router, theme, and persisted state. Check here before writing a new primitive.
- `src/components/*`: larger illustrations/widgets (`HeroStage`, `MarketShiftChart`, `ArchetypeVenn`, `HandoffFlow`, `HandoffPlate`, `AdoptionDumbbell`, `AiAutonomyRamp`, `ProtocolArchitecture`, `RoadmapMap`, `Nav`, `icons`).
- `src/data/research.ts`: all content data and types.
- `src/index.css`: design tokens, Tailwind `@theme` mapping, and global component classes.

## Content rules

- `src/data/research.ts` is the single source of truth, drawn from "The 2026 Product Design Evolution" research brief. **Never invent figures, stats, or sources.** Every number must trace to that brief; change data there, not in JSX.
- Each `Metric` carries a `basis` (`survey | analytics | projection | case`); keep it honest and render it with `BasisBadge`.
- Copy is plain and direct, and must not slight designers or developers: frame the role as a bridge, not one side catching up to the other.

## Routing and state

- Hash router in `ui.tsx` (`useRoute`, `pageHref`, `parseRoute`) so it works on any static host. Routes look like `#/plan/a/meta`, `#/ready/b`, `#/library/skills`.
- URL sub-parts write reader choices (track `a|b`, Track A option `pde|meta`) into storage. Old single-page anchors (`#roadmap`, `#skills`, …) map through the `legacy` table; keep them working.
- Adding a page means: add it to `Page` and `pages` in `ui.tsx`, render it in `App.tsx`, and it appears in `Nav` automatically.
- Use `navigate(hash, { replace: true })` to reflect a choice in the URL without adding history.
- Persisted state uses `localStorage` keys prefixed `de-guide:` via `useStoredChoice` / `usePersistentSet`. Always wrap storage access in try/catch; the page must work with storage blocked.

## Design system

"Swiss print on bone stock": one accent (`--accent`, orange-red), hairline rules, **no border radii**, hard unblurred offset shadows (`--sh-1`, `--sh-2`), 12-column grid (`.wrap` + `.grid-12`).

- Use the tokens (`bg-paper`, `text-ink-2`, `border-line`, `bg-accent`, …) via Tailwind; never hard-code colors.
- Dark mode is defined twice in `index.css`: under `prefers-color-scheme: dark` (guarded by `:root:not([data-theme="light"])`) and under `:root[data-theme="dark"]`. **Change a token in both blocks.** `index.html` applies the saved theme before first paint.
- Motion goes inside `@media (prefers-reduced-motion: no-preference)`. Use `--ease`, `--ease-in-out`, `--spring`, `--dur`.

## Accessibility

Treat it as a requirement, not polish: keyboard-reachable everything, real `button`/`a` elements, ARIA tabs via `useTabList`, `aria-hidden` on decoration, visible focus. Keyboard shortcuts need a modifier (WCAG 2.1.4), as Alt+G does.

## Verifying changes

Run `npm run typecheck`, then check the change in the preview at both light and dark, desktop and ~375px wide.

## Git

Commit messages: imperative, sentence case, no prefix (e.g. "Replace the side rail with a sticky top nav"). No Claude attribution lines.
