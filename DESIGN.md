# DESIGN.md

Visual design system, token contract, and Visual QA standards for the **Design Engineer Field Guide**.

## 1. Visual identity: "Plum Dusk"

- **Aesthetic:** One dark theme. An aubergine ground (`--desk`) with a faint rose glow at the top, soft cards (`--card`) with a `1px` border (`--edge`) and `20px` radius (`--radius`), quiet blurred shadows (`--sh-1`, `--sh-2`), and a single rose accent (`--accent`). There is no light theme and no theme toggle.
- **Main brand mark:** `BrandMark` in `src/components/Nav.tsx` and `public/favicon.svg` — a 32×32 artboard frame with four corner handles compiling into an accent code slash and angle bracket (`/>`), paired with the stacked `Design Engineer` / `Field Guide · 2026` lockup.
- **Grid:** 12-column desktop / 4-column mobile grid (`.wrap` max `1440px` + `.grid-12`, responsive `--gutter`: `16px` / `24px` / `40px`). Press `Alt+G` to inspect the live column overlay.
- **Navigation:** a slim sticky top bar with pill links and a `⌘K` / `Ctrl+K` search (`src/components/QuickFind.tsx`). The Start page opens with the headline, a search field and question chips, then reads as four chapters with a sticky chapter rail on desktop.

## 2. Color tokens

Never hard-code hex/rgb values in JSX or CSS outside the `:root` block in `src/index.css`. Tokens are declared **once**; `public/theme-init.js` clears any light/dark choice saved by older versions.

| Role | Token | Value | Usage |
| :--- | :--- | :--- | :--- |
| Page ground | `--desk` | `#140f19` | Body background |
| Paper / surface | `--paper`, `--surface` | `#181220`, `#1a1421` | Dialogs, inset panels |
| Card | `--card` | `#1c1623` | Cards, nav, SVG plate masks |
| Sunken | `--sunken` | `#251d2d` | Hover fills on secondary controls |
| Ink | `--ink`, `--ink-2`, `--ink-3` | `#efe8f4`, `#cfc5d8`, `#a99db4` | Headings, body, metadata |
| Border | `--edge` | `#3a2f45` | Card and control borders |
| Hairlines | `--line`, `--line-strong` | `rgba(239,232,244,.10/.28)` | Internal rules, dividers |
| Accent | `--accent`, `--accent-ink` | `#ff93b5`, `#ffa9c4` | `--accent` for fills/bars; `--accent-ink` for small text |
| Accent tint | `--accent-soft` | `#33202d` | Active nav pill, selected bands |
| Text on accent | `--on-accent` | `#140f19` | Ink on rose fills |
| Raised bands | `--inverse-bg`, `--inverse-fg` | `#2a2133`, `#efe8f4` | `.card-head`, `.card-tab`, active tabs, footer |
| Radii | `--radius`, `--radius-s`, `--radius-xs` | `20px`, `12px`, `8px` | Cards, controls, small chips |

- Use `bg-inverse text-on-inverse` for card heads, active segmented/shelf tabs and SVG title bars. Never use `bg-edge text-card` for text.
- On accent bands where a glyph inherits band colour, scope `[--accent:currentColor]` so accent strokes stay legible.

## 3. Typography & orphan/widow hygiene

- **Families:** `Bricolage Grotesque` (display, numerals), `DM Sans` (reading, UI) and `DM Mono` (`.label` metadata, code, tabular numbers), loaded from Google Fonts in `index.html`.
- **Scale classes (`src/index.css`):**
  - `.hero-title` — Start page headline (`clamp(2.75rem, 6.4vw, 5.5rem)`, tight `-0.045em` tracking)
  - `.display-xl`, `.display-l`, `.display-m` — Page, section and card titles (`font-weight: 600`, `text-wrap: balance`)
  - `.numeral` — Tabular lining numerals (`line-height: 0.9`)
  - `.font-display` — Mid-size callouts and quotes (`font-weight: 600`, `text-wrap: pretty`)
  - `.lede` — Intro copy (`max-width: 44ch`, `text-wrap: pretty`)
  - `.label` — `12px` (`0.75rem`) mixed-case mono, `letter-spacing: 0.01em`
- **Orphan & measure discipline:**
  - `h1–h6` and `.card-foot` use `text-wrap: balance`.
  - `p`, `dd`, `.font-display`, `.lede`, and card descriptions use `text-wrap: pretty`.
  - Keep prose blocks between `44ch` and `62ch` (`.prose-measure`).
  - Use non-breaking spaces (`\u00A0`) for tight lockups prone to 1-word hangs (e.g., `starting\u00A0out`, `new\u00A0role`, `Talent\u00A02026`, `→\u00A0140,800`).

## 4. CSS layering & component architecture

- Wrap custom component classes (`.btn`, `.card`, `.card-head`, `.card-foot`, `.lede`, `.input-line`, `.bar-fill`, `.glyph-*`) inside `@layer components` in `src/index.css`. This lets Tailwind v4 utilities override sizing, spacing, and color cleanly **without `!important`**.
- **Card anatomy:**
  - `.card` (`1px solid var(--edge)`, `--radius`, `--sh-1`) + optional `.card-lift` (rises `3px` to `--sh-2` on hover; `.card-on` marks the selected card with an accent border and `--sh-accent`).
  - Sibling cards in a grid must share bottom CTA/footer baselines: use `flex h-full flex-col`, `flex-1` on the expanding description, and `mt-auto` + fixed/minimum height on `.card-foot` (e.g., `min-h-[3.5rem] flex items-center` on Home stat cards).
- **Shared primitives (`src/components/ui.tsx`):** Reuse `Tag`, `BasisBadge`, `CheckRow`, `TopicCheckbox`, `Tabs`, `Disclosure`, `Meter`, `ContextBar`, and `NextPage` instead of duplicating markup.

## 5. Iconography & brand logos

- **Workbench glyphs (`src/components/icons.tsx`):** Drafted on a `24×24` grid, `strokeLinecap="square"`, `strokeLinejoin="miter"`, `strokeWidth: 1.5` (rendered at `2` normally, `1.25` via `.glyph-xl` when enlarged). Accent marks the moving or focal sub-path.
  - **Metric & basis icons:** `BasisBadge` uses `BasisGlyph` (`trendDown`, `survey`, `forecast`, `caseStudy`); Home and Track B stat cards pair larger `Glyph` marks (`trendDown`, `shareBar`, `survey`, `forecast`, `stack`).
  - **People & role icons:** Cards representing personas or roles (`EntryCard`, Track A/B cards, Roles cards/detail header, `Comparison` cards, `ToolingPipeline` role matrix/header, `Readiness` track buttons, `HandoffFlow` steps) use `Glyph name="user"` (single role) or `Glyph name="users"` (team/shared).
- **App & brand logos (`src/components/BrandLogo.tsx`):** Monochrome `24×24` geometric SVGs using `currentColor` so they adapt to card and accent surfaces with ≥3:1 contrast. `Tag` automatically detects and prepends logos when passed a string label, with deduplication rules (`Tailwind CSS` → Tailwind only, `v0 (Vercel)` → `v0` only, `GitHub` → GitHub only).

## 6. Responsive rhythm, motion & accessibility

- **Mobile (`~375px`):**
  - Top nav uses proportional columns (`grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,1.45fr)_minmax(0,1.15fr)]`) so 9-letter `CHECKLIST` has generous clearance from `LIBRARY`.
  - Five-item mobile 2-column grids (`Library` shelf nav, `PlanRoadmapBase` tabs) apply `max-sm:last:col-span-2` so the 5th item spans full width instead of leaving an orphan half-row.
  - Zero horizontal document overflow (`scrollWidth <= innerWidth`) across all pages.
- **Motion:** Gate all non-essential transforms and keyframe animations inside `@media (prefers-reduced-motion: no-preference)` using `--ease`, `--ease-in-out`, `--spring`, and `--dur`. Under `prefers-reduced-motion: reduce`, keep state changes legible via color/opacity while disabling translation.
- **Accessibility:**
  - All decorative SVGs (`Glyph`, `BrandLogo`, `BrandMark`, icons paired with text) MUST have `aria-hidden="true"` and `focusable="false"`.
  - Informative SVG diagrams (`HeroStage`, `MarketShiftChart`, `ArchetypeVenn`, `AdoptionDumbbell`, `HandoffPlate`, `ProtocolArchitecture`) provide `role="img"` + `<title>` / `<figcaption>` and semantic keyboard controls where interactive.
  - All interactive targets maintain ≥44px hit area (via `min-h-11` or `.hit`), visible `:focus-visible` outlines, real `<button>`/`<a>` elements, WAI-ARIA tabs via `useTabList`, and modifier-gated shortcuts (WCAG 2.1.4, e.g., `Alt+G`).
