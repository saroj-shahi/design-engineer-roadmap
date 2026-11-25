# DESIGN.md

Visual design system, token contract, and Visual QA standards for the **Design Engineer Field Guide**.

## 1. Visual identity: "Swiss print on bone stock"

- **Aesthetic:** Editorial print specimen on a dot-grid drafting desk (`--desk` + radial dot matrix), crisp cards (`--card`) framed by `2px` hairline rules (`--edge`), **zero border radii anywhere**, hard unblurred offset shadows (`--sh-1`, `--sh-2`, `--sh-accent`), and a single functional accent (`--accent`, vermilion orange-red).
- **Main brand mark:** `BrandMark` in `src/components/Nav.tsx` and `public/favicon.svg` — a 32×32 geometric artboard frame with four vector corner handles compiling directly into an accent code slash and angle bracket (`/>`), paired with the stacked `Design Engineer` / `FIELD GUIDE · 2026` lockup.
- **Grid:** 12-column desktop / 4-column mobile Swiss grid (`.wrap` max `1440px` + `.grid-12`, responsive `--gutter`: `16px` / `24px` / `40px`). Press `Alt+G` to inspect the live column overlay.

## 2. Color tokens & light/dark parity

Never hard-code hex/rgb values in JSX or CSS outside `:root` blocks in `src/index.css`.

> **Critical rule — Dark mode is declared twice in `src/index.css`:**
> 1. `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }`
> 2. `:root[data-theme="dark"] { ... }`
>
> **Always update both blocks together.** `public/theme-init.js` applies the saved theme before first paint to prevent flashes.

| Role | Token | Light | Dark | Usage |
| :--- | :--- | :--- | :--- | :--- |
| Desk canvas | `--desk` | `#e2dfd6` | `#060606` | Page background with dot matrix |
| Paper / surface | `--paper`, `--surface` | `#f4f3ef`, `#f9f8f5` | `#0a0a0a`, `#111110` | Subtle inset panels & sticky bars |
| Card stock | `--card` | `#f7f6f2` | `#131312` | Card fills, nav bar, SVG plate masks |
| Sunken hover | `--sunken` | `#e9e7e0` | `#1a1a18` | Hover fills on secondary buttons/rows |
| Primary / secondary / muted ink | `--ink`, `--ink-2`, `--ink-3` | `#111111`, `#3d3c38`, `#605e58` | `#edebe5`, `#bab8b0`, `#85837c` | Headings, body, metadata labels |
| Borders & hard shadow | `--edge`, `--hard` | `#111111`, `#111111` | `#8f8c84`, `#3d3b37` | **Borders and offset shadows only** |
| Hairlines | `--line`, `--line-strong` | `rgba(17,17,17,.14/.5)` | `rgba(255,255,255,.12/.38)` | Internal rules, dividers, strokes |
| Accent & accessible ink | `--accent`, `--accent-ink` | `#ff3b00`, `#b82a00` | `#ff4a12`, `#ff7a4d` | `--accent` for fills/bars; `--accent-ink` for small text on `--card` |
| Text on accent | `--on-accent` | `#111111` | `#0a0a0a` | High-contrast ink on orange-red fills |
| Inverted bands & surfaces | `--inverse-bg`, `--inverse-fg` | `#111111`, `#f4f3ef` | `#edebe5`, `#0a0a0a` | **Filled dark headers, active tabs, footer** |

### Contrast contract for filled header bands & active tabs

- **Never** use `bg-edge text-card` for filled bands or active buttons. In dark mode `--edge` (`#8f8c84`) on `--card` (`#131312`) drops to ~5.5:1 muddy mid-gray.
- **Always** use `bg-inverse text-on-inverse` (`--inverse-bg` / `--inverse-fg`) for `.card-head`, `.card-tab`, active segmented/shelf tabs, and dark SVG titlebars (`HandoffPlate`, `ProtocolArchitecture`) so contrast remains ≥16:1 in both themes.
- On dark/accent bands where a glyph inherits band color, scope `[--accent:currentColor]` so accent strokes stay legible against both light and dark band fills.

## 3. Typography & orphan/widow hygiene

- **Families:** Variable `Archivo` (condensed `font-stretch: 62%–80%` for display/numerals; `100%` width for body reading) and `Martian Mono` (`font-stretch: 87.5%`) for uppercase `.label` metadata, code, and tabular numbers. Metric-matched `@font-face` fallbacks prevent CLS during font swap.
- **Scale classes (`src/index.css`):**
  - `.hero-title` — Container-queried hero display (`clamp(3.75rem, 18cqi, 7.25rem)`)
  - `.display-xl`, `.display-l`, `.display-m` — Monumental page, section, and card display titles (`text-wrap: balance`)
  - `.numeral` — Condensed tabular lining numerals (`line-height: 0.85`)
  - `.font-display` — Mid-size callouts and quotes (`font-stretch: 80%`, `font-weight: 550`, `text-wrap: pretty`)
  - `.lede` — Intro copy (`max-width: 44ch`, `text-wrap: pretty`)
  - `.label` — `11px` (`0.6875rem`) uppercase mono, `letter-spacing: 0.08em`
- **Orphan & measure discipline:**
  - `h1–h6` and `.card-foot` use `text-wrap: balance`.
  - `p`, `dd`, `.font-display`, `.lede`, and card descriptions use `text-wrap: pretty`.
  - Keep prose blocks between `44ch` and `62ch` (`.prose-measure`).
  - Use non-breaking spaces (`\u00A0`) for tight lockups prone to 1-word hangs (e.g., `starting\u00A0out`, `new\u00A0role`, `Talent\u00A02026`, `→\u00A0140,800`).

## 4. CSS layering & component architecture

- Wrap custom component classes (`.btn`, `.card`, `.card-head`, `.card-foot`, `.lede`, `.input-line`, `.bar-fill`, `.glyph-*`) inside `@layer components` in `src/index.css`. This lets Tailwind v4 utilities override sizing, spacing, and color cleanly **without `!important`**.
- **Card anatomy:**
  - `.card` (`2px solid var(--edge)`, `--sh-1`) + optional `.card-lift` (lifts `-2px, -2px` to `--sh-2` on hover; presses `+4px, +4px` on `.card-on` or `:active`).
  - Sibling cards in a grid must share bottom CTA/footer baselines: use `flex h-full flex-col`, `flex-1` on the expanding description, and `mt-auto` + fixed/minimum height on `.card-foot` (e.g., `min-h-[3.5rem] flex items-center` on Home stat cards).
- **Shared primitives (`src/components/ui.tsx`):** Reuse `Tag`, `BasisBadge`, `CheckRow`, `TopicCheckbox`, `Tabs`, `Disclosure`, `Meter`, `ContextBar`, and `NextPage` instead of duplicating markup.

## 5. Iconography & brand logos

- **Workbench glyphs (`src/components/icons.tsx`):** Drafted on a `24×24` grid, `strokeLinecap="square"`, `strokeLinejoin="miter"`, `strokeWidth: 1.5` (rendered at `2` normally, `1.25` via `.glyph-xl` when enlarged). Accent marks the moving or focal sub-path.
  - **Metric & basis icons:** `BasisBadge` uses `BasisGlyph` (`trendDown`, `survey`, `forecast`, `caseStudy`); Home and Track B stat cards pair larger `Glyph` marks (`trendDown`, `shareBar`, `survey`, `forecast`, `stack`).
  - **People & role icons:** Cards representing personas or roles (`EntryCard`, Track A/B cards, Roles cards/detail header, `Comparison` cards, `ToolingPipeline` role matrix/header, `Readiness` track buttons, `HandoffFlow` steps) use `Glyph name="user"` (single role) or `Glyph name="users"` (team/shared).
- **App & brand logos (`src/components/BrandLogo.tsx`):** Monochrome `24×24` geometric SVGs using `currentColor` so they adapt to light, dark, and accent surfaces with ≥3:1 contrast. `Tag` automatically detects and prepends logos when passed a string label, with deduplication rules (`Tailwind CSS` → Tailwind only, `v0 (Vercel)` → `v0` only, `GitHub` → GitHub only).

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
