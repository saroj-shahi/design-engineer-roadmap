/* ─────────────────────────────────────────────────────────────
   Monochrome geometric brand & app marks (24×24 grid).
   Uses currentColor so every logo adapts automatically to light,
   dark, accent, and inverted surfaces with crisp contrast.
   Purely decorative when paired with visible brand text.
   ───────────────────────────────────────────────────────────── */

export type BrandId =
  | "figma"
  | "claude"
  | "codex"
  | "vercel"
  | "v0"
  | "cursor"
  | "react"
  | "typescript"
  | "tailwind"
  | "html5"
  | "css3"
  | "javascript"
  | "git"
  | "github"
  | "google"
  | "replit"
  | "lovable"
  | "bolt"
  | "linear"
  | "raycast"
  | "profound"
  | "microsoft"
  | "radix"
  | "mdn"
  | "roadmapsh";

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true,
  focusable: false,
} as const;

const marks: Record<BrandId, () => JSX.Element> = {
  figma: () => (
    <g stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round">
      <path d="M9 3h3v6H9a3 3 0 0 1 0-6Z" />
      <path d="M12 3h3a3 3 0 0 1 0 6h-3V3Z" />
      <path d="M9 9h3v6H9a3 3 0 0 1 0-6Z" />
      <circle cx="15" cy="12" r="3" />
      <path d="M9 15h3v3a3 3 0 1 1-3-3Z" />
    </g>
  ),
  claude: () => (
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </g>
  ),
  codex: () => (
    <g stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round">
      <polygon points="12,3 19.8,7.5 19.8,16.5 12,21 4.2,16.5 4.2,7.5" />
      <path d="M12 3v6M19.8 7.5L14.6 10.5M19.8 16.5L14.6 13.5M12 21v-6M4.2 16.5L9.4 13.5M4.2 7.5L9.4 10.5" />
      <polygon points="12,9 14.6,10.5 14.6,13.5 12,15 9.4,13.5 9.4,10.5" fill="currentColor" fillOpacity="0.2" />
    </g>
  ),
  vercel: () => <path d="M12 4L21.5 20H2.5L12 4Z" fill="currentColor" />,
  v0: () => (
    <g fill="currentColor">
      <path d="M2.5 7h2.7l3 8.2L11.2 7h2.6L9.4 18H7L2.5 7Z" />
      <path d="M14.5 7h5.8c.7 0 1.2.5 1.2 1.2v8.6c0 .7-.5 1.2-1.2 1.2h-5.8c-.7 0-1.2-.5-1.2-1.2V8.2c0-.7.5-1.2 1.2-1.2Zm1.3 2.3v6.4h3.2V9.3h-3.2Z" />
    </g>
  ),
  cursor: () => (
    <g stroke="currentColor" strokeWidth="1.75" strokeLinejoin="miter">
      <polygon points="12,2.5 20.5,7.25 20.5,16.75 12,21.5 3.5,16.75 3.5,7.25" />
      <polygon points="12,12 20.5,7.25 12,2.5 3.5,7.25" fill="currentColor" fillOpacity="0.22" stroke="none" />
      <path d="M12 12V21.5M12 12L20.5 7.25M12 12L3.5 7.25" />
    </g>
  ),
  react: () => (
    <g stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
    </g>
  ),
  typescript: () => (
    <g>
      <rect x="2.5" y="2.5" width="19" height="19" stroke="currentColor" strokeWidth="1.75" />
      <text
        x="12.5"
        y="16.5"
        textAnchor="middle"
        fill="currentColor"
        fontSize="10.5"
        fontWeight="700"
        fontFamily="var(--font-mono)"
      >
        TS
      </text>
    </g>
  ),
  javascript: () => (
    <g>
      <rect x="2.5" y="2.5" width="19" height="19" stroke="currentColor" strokeWidth="1.75" />
      <text
        x="12.5"
        y="16.5"
        textAnchor="middle"
        fill="currentColor"
        fontSize="10.5"
        fontWeight="700"
        fontFamily="var(--font-mono)"
      >
        JS
      </text>
    </g>
  ),
  tailwind: () => (
    <path
      d="M12 6c-2.8 0-4.55 1.4-5.25 4.2 1.05-1.4 2.275-1.925 3.675-1.575.8.2 1.37.78 2 1.42C13.45 11.09 14.65 12.3 17.25 12.3c2.8 0 4.55-1.4 5.25-4.2-1.05 1.4-2.275 1.925-3.675 1.575-.8-.2-1.37-.78-2-1.42C15.8 7.21 14.6 6 12 6ZM6.75 12.3c-2.8 0-4.55 1.4-5.25 4.2 1.05-1.4 2.275-1.925 3.675-1.575.8.2 1.37.78 2 1.42 1.025 1.045 2.225 2.255 4.825 2.255 2.8 0 4.55-1.4 5.25-4.2-1.05 1.4-2.275 1.925-3.675 1.575-.8-.2-1.37-.78-2-1.42-1.025-1.045-2.225-2.255-4.825-2.255Z"
      fill="currentColor"
    />
  ),
  html5: () => (
    <g stroke="currentColor" strokeWidth="1.75" strokeLinejoin="miter">
      <path d="M4 3h16l-1.5 15.5L12 21l-6.5-2.5L4 3Z" />
      <path d="M15.5 8H8.5l.4 3.5h6.2l-.6 4.5-2.5.8-2.5-.8-.2-1.8" strokeLinecap="square" />
    </g>
  ),
  css3: () => (
    <g stroke="currentColor" strokeWidth="1.75" strokeLinejoin="miter">
      <path d="M4 3h16l-1.5 15.5L12 21l-6.5-2.5L4 3Z" />
      <path d="M8.5 8h7l-.4 3.5H9.5m5.6 0l-.6 4.5-2.5.8-2.5-.8" strokeLinecap="square" />
    </g>
  ),
  git: () => (
    <g stroke="currentColor" strokeWidth="1.75">
      <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
      <path d="M12 6.5v11M12 10.5l3.2 3.2" />
      <circle cx="12" cy="10" r="1.4" fill="currentColor" />
      <circle cx="12" cy="16" r="1.4" fill="currentColor" />
      <circle cx="15.5" cy="13.8" r="1.4" fill="currentColor" />
    </g>
  ),
  github: () => (
    <path
      fill="currentColor"
      d="M12 2.25a9.75 9.75 0 0 0-3.08 19c.49.09.67-.21.67-.47v-1.66c-2.72.59-3.3-1.31-3.3-1.31-.44-1.13-1.08-1.43-1.08-1.43-.89-.6.07-.59.07-.59.98.07 1.5 1 1.5 1 .87 1.5 2.29 1.07 2.85.82.09-.63.34-1.07.62-1.31-2.17-.25-4.46-1.09-4.46-4.83 0-1.07.38-1.94 1.01-2.62-.1-.25-.44-1.24.1-2.59 0 0 .82-.26 2.68 1a9.35 9.35 0 0 1 4.88 0c1.86-1.26 2.68-1 2.68-1 .54 1.35.2 2.34.1 2.59.63.68 1.01 1.55 1.01 2.62 0 3.75-2.29 4.58-4.47 4.82.35.3.66.9.66 1.81v2.68c0 .26.18.57.68.47a9.75 9.75 0 0 0-3.09-19Z"
    />
  ),
  google: () => (
    <path
      fill="currentColor"
      d="M12.2 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9h-9Zm-6.8 4.4a6.4 6.4 0 0 1 0-5.2V6.9H2.3a10 10 0 0 0 0 10.2l3.1-2.5ZM12.2 5.9c1.4 0 2.6.5 3.6 1.4l2.7-2.7A9.9 9.9 0 0 0 2.3 6.9l3.1 2.5c.8-2.1 2.7-3.5 6.8-3.5Zm0 12.2c-4.1 0-6-1.4-6.8-3.5l-3.1 2.5a9.9 9.9 0 0 0 16.2 2l-3.1-2.4c-.9.6-2 1.4-3.2 1.4Z"
    />
  ),
  replit: () => (
    <g fill="currentColor">
      <rect x="4" y="3" width="8" height="6" />
      <rect x="12" y="9" width="8" height="6" />
      <rect x="4" y="15" width="8" height="6" />
    </g>
  ),
  lovable: () => (
    <path
      fill="currentColor"
      d="M12 20.5 4.4 13a4.9 4.9 0 0 1 0-7 4.9 4.9 0 0 1 7 0l.6.7.6-.7a4.9 4.9 0 0 1 7 0 4.9 4.9 0 0 1 0 7L12 20.5Z"
    />
  ),
  bolt: () => <path fill="currentColor" d="M13.8 2.5L4.5 13.5h6.3L9.8 21.5l9.7-11h-6.3l.6-8Z" />,
  linear: () => (
    <g stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.5 14.5l4 4M4.2 10.2l9.6 9.6M7.2 6.8l10 10" />
    </g>
  ),
  raycast: () => (
    <g fill="currentColor">
      <path d="M6.5 15.5 3 12l2.2-2.2 3.5 3.5-2.2 2.2Zm4.5 4.5-2.2-2.2 3.5-3.5 2.2 2.2L11 20Zm-2.5-9.5L13 6l5 5-4.5 4.5-5-5ZM16.5 4.5 19.5 7.5 17.8 9.2 14.8 6.2 16.5 4.5Z" />
    </g>
  ),
  profound: () => (
    <g fill="currentColor">
      <rect x="4" y="4" width="6.5" height="6.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" />
      <path d="M13.5 13.5h6.5v6.5h-6.5z" fillOpacity="0.3" />
    </g>
  ),
  microsoft: () => (
    <g fill="currentColor">
      <rect x="3" y="3" width="8.2" height="8.2" />
      <rect x="12.8" y="3" width="8.2" height="8.2" />
      <rect x="3" y="12.8" width="8.2" height="8.2" />
      <rect x="12.8" y="12.8" width="8.2" height="8.2" />
    </g>
  ),
  radix: () => (
    <g fill="currentColor">
      <rect x="5" y="3" width="5.5" height="5.5" />
      <circle cx="15.75" cy="5.75" r="2.75" />
      <path d="M10.5 10.5v10.5A5.25 5.25 0 0 1 10.5 10.5Z" />
      <rect x="13" y="10.5" width="5.5" height="10.5" />
    </g>
  ),
  mdn: () => (
    <g fill="currentColor">
      <path d="M3 18.5V5.5h3.2l3.3 5.5 3.3-5.5H16v13h-2.8V10l-3.7 5.8L5.8 10v8.5H3Z" />
      <path d="M18.2 18.5V5.5H21v13h-2.8Z" opacity="0.55" />
    </g>
  ),
  roadmapsh: () => (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
      <rect x="3" y="3" width="18" height="18" />
      <path d="M8 17V7h4.5a2.5 2.5 0 0 1 0 5H8m3.5 0L16 17" />
    </g>
  ),
};

/** Ordered keyword patterns so specific brands (e.g. "v0", "github", "claude") match before generic ones. */
const patterns: [BrandId, RegExp][] = [
  ["v0", /\bv0\b/i],
  ["vercel", /\bvercel\b/i],
  ["github", /\bgithub\b/i],
  ["git", /\bgit\b/i],
  ["claude", /\b(claude|anthropic)\b/i],
  ["codex", /\b(codex|openai)\b/i],
  ["figma", /\bfigma\b/i],
  ["cursor", /\bcursor\b/i],
  ["google", /\b(google|stitch|pair)\b/i],
  ["replit", /\breplit\b/i],
  ["lovable", /\blovable\b/i],
  ["bolt", /\bbolt\b/i],
  ["linear", /\blinear\b/i],
  ["raycast", /\braycast\b/i],
  ["profound", /\bprofound\b/i],
  ["react", /\breact\b/i],
  ["typescript", /\btypescript\b/i],
  ["tailwind", /\btailwind\b/i],
  ["html5", /\bhtml5?\b/i],
  ["css3", /\bcss3?\b/i],
  ["javascript", /\b(javascript|js)\b/i],
  ["microsoft", /\bmicrosoft\b/i],
  ["radix", /\bradix\b/i],
  ["mdn", /\bmdn\b/i],
  ["roadmapsh", /roadmap\.sh/i],
];

/** Returns up to `max` distinct brand IDs mentioned in a label (ordered by appearance in `text`). */
export function detectBrands(text: string, max = 3): BrandId[] {
  const hits: { id: BrandId; index: number }[] = [];
  for (const [id, re] of patterns) {
    const m = re.exec(text);
    if (!m) continue;
    // Avoid double-matching "git" inside "github", "vercel" inside "v0 (Vercel)", or "css" inside "Tailwind CSS".
    if (id === "git" && hits.some((h) => h.id === "github")) continue;
    if (id === "vercel" && hits.some((h) => h.id === "v0")) continue;
    if (id === "css3" && hits.some((h) => h.id === "tailwind")) continue;
    hits.push({ id, index: m.index });
  }
  hits.sort((a, b) => a.index - b.index);
  return hits.slice(0, max).map((h) => h.id);
}

export function detectBrand(text: string): BrandId | null {
  return detectBrands(text, 1)[0] ?? null;
}

export function BrandLogo({ brand, className = "size-3.5" }: { brand: BrandId; className?: string }) {
  const Draw = marks[brand];
  return (
    <svg {...svgProps} className={`inline-block shrink-0 ${className}`}>
      <Draw />
    </svg>
  );
}

export function BrandLogosFor({ text, max = 2, className = "size-3.5" }: { text: string; max?: number; className?: string }) {
  const ids = detectBrands(text, max);
  if (ids.length === 0) return null;
  return (
    <span aria-hidden="true" className="inline-flex shrink-0 items-center gap-1">
      {ids.map((id) => (
        <BrandLogo key={id} brand={id} className={className} />
      ))}
    </span>
  );
}
