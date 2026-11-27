# DESIGN.md

Visual design system, token contract, and Visual QA standards for the **Design Engineer Field Guide**.

## 1. Visual identity: "Plum Dusk"

- **Aesthetic:** One dark theme. An aubergine ground (`--desk`) with a faint rose glow at the top, soft cards (`--card`) with a `1px` border (`--edge`) and `20px` radius (`--radius`), quiet blurred shadows (`--sh-1`, `--sh-2`), and a single rose accent (`--accent`). There is no light theme and no theme toggle.
- **Main brand mark:** `BrandMark` in `src/components/Nav.tsx` and `public/favicon.svg` — a 32×32 artboard frame with four corner handles compiling into an accent code slash and angle bracket (`/>`), paired with the stacked `Design Engineer` / `Field Guide · 2026` lockup.
- **Grid:** 12-column desktop / 4-column mobile grid (`.wrap` max `1440px` + `.grid-12`, responsive `--gutter`: `16px` / `24px` / `40px`). Press `Alt+G` to inspect the live column overlay.
- **Navigation:** a slim sticky top bar with pill links and a `⌘K` / `Ctrl+K` search (`src/components/QuickFind.tsx`). The Start page opens with the headline and a search field, then reads as four chapters with a sticky chapter rail on desktop.

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
| Raised bands | `--inverse-bg`, `--inverse-fg` | `#2a2133`, `#efe8f4` | Card head bands (`bg-inverse text-on-inverse`), active tabs |
| Radii | `--radius`, `--radius-s`, `--radius-xs` | `20px`, `12px`, `8px` | Cards, controls, small chips |

- Use `bg-inverse text-on-inverse` for card heads, active segmented/shelf tabs and SVG title bars. Never use `bg-edge text-card` for text.
- On accent bands where a glyph inherits band colour, scope `[--accent:currentColor]` so accent strokes stay legible.

## 3. Typography & orphan/widow hygiene

- **Families:** `Bricolage Grotesque` (display, numerals), `DM Sans` (reading, UI) and `DM Mono` (`font-mono text-label` metadata, code, tabular numbers), self-hosted through Fontsource (`@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/dm-sans`, `@fontsource/dm-mono`), imported in `src/main.tsx`. The CSP allows fonts and styles from `'self'` only.
- **Type scale (Tailwind `@theme` text sizes in `src/index.css`; each carries its own line-height, tracking and weight):**
  - `font-display text-hero` — Start page headline (`clamp(2.75rem, 6.4vw, 5.5rem)`, `-0.045em` tracking)
  - `font-display text-display-xl` / `text-display-l` / `text-display-m` — page, section and card titles (`600`, add `text-balance`)
  - `font-display font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums` — big numerals
  - `text-lede max-w-[44ch] text-pretty text-ink-2` — intro copy
  - `font-mono text-label` — `13px` mixed-case mono metadata, `0.01em` tracking
  - `text-xs` — redefined in `@theme` to `13px` (line-height `1.4`) for small notes, tags and badges
- **Reading sizes and the 12px floor:** text a reader needs (labels, captions, notes, tags) renders at `13px` or more: `text-xs` and `text-label` are both `13px`, and captions and compact chart rows use `text-sm` (`14px`). Never use `text-[10px]`, `text-[11px]` or `text-[12px]`. `12px` is the hard floor, used only by chart text: SVG chart labels use `fontSize` ≥ `12` (viewBox units) and `HeroStage` container-query sizes clamp with `max(12px, …)`. Below `1024px` (phones and tablets) charts switch to their HTML variants (`lg:` breakpoint) so SVG labels never shrink under `12px`; the e2e chart check runs at phone and `768px`.
- **Ink for reading vs. metadata:** captions, notes, card descriptions and glossary text use `text-ink-2`. Keep `text-ink-3` for truly secondary metadata (mono eyebrows, counts, sources, dates) and dimmed inactive states. Muted text (`--ink-3` on `--card`, `--inverse-muted` on `--inverse-bg`) stays above 4.5:1, so small labels never need a lighter tint.
- **Orphan & measure discipline:**
  - `h1–h6` use `text-wrap: balance` (base styles); card footers add `text-balance`.
  - `p` and `dd` use `text-wrap: pretty` (base styles); display callouts and ledes add `text-pretty`.
  - Keep prose blocks between `44ch` and `62ch` (`.prose-measure`).
  - Use non-breaking spaces (`\u00A0`) for tight lockups prone to 1-word hangs (e.g., `starting\u00A0out`, `new\u00A0role`, `Talent\u00A02026`, `→\u00A0140,800`).

## 4. Tailwind-first styling

- **Components are styled with Tailwind utilities in JSX.** There are no custom component classes (`.card`, `.btn`, `.label`, `.display-*` were removed). Tokens and scales live in `src/index.css`:
  - `:root` holds the raw colour tokens; `@theme inline` maps them to colour utilities (`bg-card`, `text-ink-2`, `border-edge`, `bg-inverse`…).
  - `@theme` defines the scales: text sizes (`text-label`, `text-lede`, `text-hero`, `text-display-*`), radii (`rounded-card` 20px, `rounded-ctl` 12px, `rounded-chip` 8px), shadows (`shadow-1`, `shadow-2`, `shadow-accent`), easing (`ease-silk`, `ease-spring`) and animations (`animate-panel-in`, `animate-fade-in`).
  - Custom utilities: `@utility plate-field` (the blueprint field behind diagrams) and `@utility hit` (44×44px minimum tap area).
- **What stays as plain CSS:** base element styles, the `[data-reveal]` scroll-reveal hooks, the film grain and `Alt+G` grid overlay, the `⌘K` dialog backdrop, glyph micro-gestures (`.glyph-*` / `.g-*`), and the two diagram systems whose choreography needs selectors utilities can't express (`HeroStage` `.hs-*`, `RoadmapMap` `.rm-*`).
- **Card recipe:** `relative rounded-card border border-edge bg-card shadow-1`. Head band: `flex items-center justify-between gap-3 border-b border-line bg-inverse px-[1.125rem] py-2.5 text-on-inverse rounded-t-[calc(var(--radius-card)-1px)]` with `font-mono text-label`. Hover-lift cards add `group/card … hover:-translate-y-[3px] hover:shadow-2`; a selected card adds `is-on border-accent! shadow-accent!` so its head tints via `group-[.is-on]/card:`.
  - Sibling cards in a grid must share bottom CTA/footer baselines: use `flex h-full flex-col`, `flex-1` on the expanding description, and `mt-auto` + a minimum height on the footer (e.g., `min-h-[3.5rem] flex items-center` on Home stat cards).
- **Shared primitives (`src/components/ui.tsx`):** Reuse `SubHead`, `SectionHeader`, `Tag`, `BasisBadge`, `CheckRow`, `TopicCheckbox`, `Tabs`, `Disclosure`, `Meter`, `ContextBar`, `NextPage`, `TextLink` and `ActionLink` instead of duplicating markup.

## 4a. Links and actions

Every link on the site is one of five kinds. Nothing else: no ad-hoc link classes in JSX.

| Kind | Use for | Look | Primitive |
|---|---|---|---|
| **Nav** | Top bar, footer | Pill links (`Nav`), quiet footer row | `Nav`, `Footer` |
| **Primary action** | The one next step of a section | Filled accent pill, label + `→` | `ActionLink variant="primary"` |
| **Secondary action** | An optional alternative beside a primary | Outline pill, label + `→` | `ActionLink variant="secondary"` |
| **Card link** | A whole card that goes somewhere (entry cards, track cards, roadmap cards) | The card is the `<a>`; one `→` in its footer; no other links inside | `cardLink` class recipe |
| **Inline link** | A link inside running prose or a note | `text-ink`, accent underline (`decoration-accent/60`, 1px, `underline-offset-[3px]`), rule thickens on hover; external links add `↗` and "(opens in new tab)" for screen readers | `TextLink` |

**Density rules**

1. **One link per destination per screen.** A page links to the same place once in its body. Nav, footer, breadcrumbs, `NextPage` and directory blocks marked as navigation (the Start page's "What's inside" cards, the plan map) don't count. If two spots need the same destination, keep the one closest to the decision and make the other plain text.
2. **At most one primary and one secondary action per section.** More choices become a card grid or a list, not a row of buttons.
3. **No link-only lines of navigation inside content** ("See X, or Y, or Z"). Point to one place.
4. **Prose links are rare:** at most one inline link per paragraph, and never on a figure or heading.
5. **Headings are not links.** Shareable anchors use `CopyLink iconOnly` beside the heading.
6. **Cross-references** (glossary "See", related topics) cap at three per item.
7. **Repeat sources once:** each source URL appears once per page.
8. Labels say where the link goes ("See the Track B plan"), never "click here" or "learn more".

## 4b. Interaction states

- **Baseline (`@layer base` in `src/index.css`):** every link, button, summary, tab, option and checkbox label shows a pointer; disabled controls show `not-allowed`. One focus ring everywhere: `2px` `--accent-ink` outline, `3px` offset, following the element's own radius (never override `border-radius` on focus).
- **Hover recipes:** pills and chips `hover:bg-sunken hover:text-ink`; cards lift (`hover:-translate-y-[3px] hover:shadow-2 hover:border-line-strong`); underline links grow their rule on `hover:` and on the parent's `group-hover:`; list rows wash with `hover:bg-sunken/60`. Selected states use the accent (`border-accent`, `bg-accent-soft`, `aria-pressed`/`aria-selected`).
- **Hints:** anything explorable that isn't an obvious button carries a `Hint` (`src/components/ui.tsx`): a pointer mark plus a short instruction, with `touch` wording for coarse pointers and optional `keys` shown as `<kbd>` chips. Used on the before/now stage, the role overlap map, the agent protocol map, the AI guardrail ramp and the role comparison.

## 5. Iconography & brand logos

- **Workbench glyphs (`src/components/icons.tsx`):** Drafted on a `24×24` grid, `strokeLinecap="square"`, `strokeLinejoin="miter"`, `strokeWidth: 1.5` (rendered at `2` normally, `1.25` via `.glyph-xl` when enlarged). Accent marks the moving or focal sub-path.
  - **Metric & basis icons:** `BasisBadge` uses `BasisGlyph` (`trendDown`, `survey`, `forecast`, `caseStudy`, and `library` for `commentary`); Home and Track B stat cards pair larger `Glyph` marks (`trendDown`, `shareBar`, `survey`, `forecast`, `stack`).
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
  - Informative SVG diagrams (`HeroStage`, `MarketShiftChart`, `ArchetypeVenn`, `AdoptionDumbbell`, `ProtocolArchitecture`) provide `role="img"` + `<title>` / `<figcaption>` and semantic keyboard controls where interactive.
  - All interactive targets maintain ≥44px hit area (via `min-h-11` or the `hit` utility, which adds an invisible `::after` so small text and icon buttons keep their visual size; keep neighbouring hit areas from overlapping), visible `:focus-visible` outlines, real `<button>`/`<a>` elements, WAI-ARIA tabs via `useTabList`, and modifier-gated shortcuts (WCAG 2.1.4, e.g., `Alt+G`).
