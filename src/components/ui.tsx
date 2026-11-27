import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { basisLabel, type BasisKind } from "../data/research";
import { BrandLogosFor } from "./BrandLogo";
import { ArrowGlyph, BasisGlyph, ExternalGlyph } from "./icons";

/* ───────── Motion plumbing ───────── */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** One observer for the whole page: anything with [data-reveal] gets .is-in once it enters the viewport,
 *  including nodes mounted later (tab panels, filtered lists). */
export function useRevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    const scan = (root: ParentNode) =>
      root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            if (n.matches("[data-reveal]:not(.is-in)")) io.observe(n);
            scan(n);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

/** Shared rAF-throttled pointer parallax that writes --px and --py in [-1, 1] and skips reduced motion / touch. */
export function usePointerParallax<T extends Element>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onPointerMove = (e: PointerEvent<T>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch" || prefersReducedMotion()) return;
    pos.current = { x: e.clientX, y: e.clientY };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const node = ref.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      const s = (node as unknown as HTMLElement).style;
      s.setProperty("--px", (((pos.current.x - r.left) / r.width) * 2 - 1).toFixed(3));
      s.setProperty("--py", (((pos.current.y - r.top) / r.height) * 2 - 1).toFixed(3));
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    const node = ref.current;
    if (!node) return;
    const s = (node as unknown as HTMLElement).style;
    s.setProperty("--px", "0");
    s.setProperty("--py", "0");
  };

  return { ref, onPointerMove, onPointerLeave };
}

/** Headline revealed line by line through overflow masks. */
export function Lines({
  lines,
  as: Tag = "span",
  className = "",
  id,
  delay = 0,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  id?: string;
  delay?: number;
}) {
  return (
    <Tag id={id} className={className} data-reveal="lines" style={{ "--d": `${delay}ms` } as CSSProperties}>
      {lines.map((l, i) => (
        <span key={i} className="-mx-[0.08em] -mb-[0.2em] block overflow-hidden px-[0.08em] pb-[0.2em]" style={{ "--i": i } as CSSProperties}>
          <span className="block translate-y-[105%] transition-transform duration-[1100ms] ease-silk [transition-delay:calc(var(--i,0)*80ms+var(--d,0ms))] in-[.is-in]:translate-y-0 motion-reduce:translate-y-0 print:translate-y-0">{l}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Counts the numeric part of a figure like "−48%" or "3,423" up from zero when it scrolls in.
 *  The real figure is always in the markup (and in an sr-only copy for assistive tech), so no-JS,
 *  reduced-motion and text snapshots never see a placeholder like "−0%". Only when motion is
 *  allowed is the visual copy hidden until it scrolls in, then counted up; it snaps to the real
 *  figure for print. */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const [waiting, setWaiting] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
    setShown(value);
    setWaiting(false);
    if (!el || !match || prefersReducedMotion()) return;
    const [, pre, num, post] = match;
    const target = parseFloat(num.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const grouped = num.includes(",");
    const format = (n: number) => {
      const s = grouped
        ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : n.toFixed(decimals);
      // Never show a signed zero such as "−0%".
      return `${parseFloat(s.replace(/,/g, "")) === 0 ? pre.replace(/[−+-]/g, "") : pre}${s}${post}`;
    };
    // Hide the visual copy (visibility, so it keeps its size) until it scrolls in; the text stays the real figure.
    setWaiting(true);
    let raf = 0;
    const finish = () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      setWaiting(false);
      setShown(value);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.max(0, Math.min(1, (t - start) / dur));
          if (p >= 1) {
            setShown(value);
            return;
          }
          setShown(format(target * (1 - Math.pow(1 - p, 4))));
          raf = requestAnimationFrame(tick);
        };
        setShown(format(0));
        setWaiting(false);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    window.addEventListener("beforeprint", finish);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("beforeprint", finish);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className={waiting ? "invisible" : undefined}>
        {shown}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/** Label that rolls up to a duplicate on hover. Parent must carry the `group` class. Both copies share one grid cell,
 *  so a label that wraps onto two lines keeps its full height; the duplicate is hidden from screen readers. */
export function Roll({ children }: { children: string }) {
  const move = "[grid-area:1/1] transition-transform duration-[650ms] ease-silk";
  return (
    <span className="relative inline-grid overflow-hidden">
      <span className={`${move} group-hover:-translate-y-full group-focus-visible:-translate-y-full`}>{children}</span>
      <span aria-hidden="true" className={`${move} translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0`}>{children}</span>
    </span>
  );
}

/* ───────── Links and actions (DESIGN.md §4a) ───────── */

/** Card link recipe (DESIGN.md §4a): a whole card that goes somewhere. Lifts on hover, rings on focus
 *  (including a focused input inside it), stays still with reduced motion. Add layout classes after it. */
export const cardLink =
  "rounded-card border border-edge bg-card shadow-1 group/card transition-[translate,box-shadow,border-color,opacity] duration-[260ms] ease-spring hover:-translate-y-[3px] hover:border-line-strong hover:shadow-2 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink has-[>input:focus-visible]:outline-2 has-[>input:focus-visible]:outline-offset-4 has-[>input:focus-visible]:outline-accent-ink motion-reduce:hover:translate-y-0";

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Inline link inside running prose or a note. Internal hrefs stay in the tab; external ones open a new tab,
 *  add ↗ and say so to screen readers. The `hit` utility grows the tap area to 44px so short links stay easy to tap. */
export function TextLink({
  href,
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: ReactMouseEvent<HTMLAnchorElement>) => void;
}) {
  const ext = isExternal(href);
  return (
    <a
      href={href}
      onClick={onClick}
      {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`hit text-ink underline decoration-accent/60 decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-300 hover:decoration-accent hover:decoration-2 group-hover:decoration-2 focus-visible:decoration-2 ${className}`}
    >
      {children}
      {ext && (
        <>
          <ExternalGlyph className="ml-0.5 inline !size-[0.85em] align-[-0.05em] text-ink-3" />
          <span className="sr-only"> (opens in new tab)</span>
        </>
      )}
    </a>
  );
}

/** Pill classes for actions. Exported so a `<button>` that acts as a section's main step can match. */
export const actionClass = (variant: "primary" | "secondary") =>
  `group relative isolate inline-flex min-h-12 max-w-full items-center gap-3 overflow-hidden rounded-full py-2.5 pl-[1.375rem] pr-5 text-left text-[0.9375rem] leading-tight font-semibold tracking-[-0.005em] transition-[translate,box-shadow,color] duration-[260ms] ease-spring before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:transition-transform before:duration-[550ms] before:ease-silk before:content-[''] hover:before:translate-y-0 focus-visible:before:translate-y-0 active:translate-y-px motion-reduce:active:translate-y-0 ${
    variant === "primary"
      ? "bg-accent text-on-accent before:bg-ink hover:shadow-accent focus-visible:shadow-accent"
      : "text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] before:bg-sunken hover:shadow-[inset_0_0_0_1px_var(--accent)]"
  }`;

/** A section's next step: filled accent pill (primary) or outline pill (secondary), label + →. At least 48px tall.
 *  An external href opens a new tab and swaps → for ↗. */
export function ActionLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const ext = isExternal(href);
  return (
    <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${actionClass(variant)} ${className}`}>
      <Roll>{children}</Roll>
      {ext ? (
        <>
          <ExternalGlyph className="shrink-0" />
          <span className="sr-only"> (opens in new tab)</span>
        </>
      ) : (
        <ArrowGlyph className="shrink-0" />
      )}
    </a>
  );
}

/* ───────── Layout ───────── */

export function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative ${className}`}>
      <div data-wrap className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-24 sm:pb-36">{children}</div>
    </section>
  );
}

/** Page opener: monumental title, optional glyph plate, lede offset to the right. */
export function SectionHeader({
  id,
  title,
  lede,
  level = "h2",
}: {
  id: string;
  title: ReactNode[];
  lede?: ReactNode;
  level?: "h1" | "h2";
}) {
  // Page titles share one layout on every page: title on the left, lede aligned to its baseline on the right.
  if (level === "h1") return <PageHeader id={`${id}-title`} title={title} lede={lede} />;
  // Section openers (Library shelves) mirror the page header: title left, lede on the right at its baseline.
  return (
    <header className="mb-12 pt-10 sm:mb-16">
      <div className="grid grid-cols-4 gap-x-4 gap-y-6 lg:grid-cols-12 lg:gap-x-6">
        <Lines as="h2" id={`${id}-title`} lines={title} className="col-span-4 font-display text-display-l text-balance text-ink lg:col-span-7" />
        {lede && (
          <p data-reveal className="col-span-4 max-w-[44ch] self-end text-lede text-pretty text-ink-2 lg:col-span-4 lg:col-start-9">
            {lede}
          </p>
        )}
      </div>
    </header>
  );
}

/** The one page-title layout (Roles, Plan, Checklist, Library): display title left, lede on the right at its baseline. */
export function PageHeader({ id, title, lede, children }: { id: string; title: ReactNode[]; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-10 pt-10 sm:mb-14">
      <div className="grid grid-cols-4 gap-x-4 gap-y-8 lg:grid-cols-12 lg:gap-x-6">
        <Lines as="h1" id={id} lines={title} className="col-span-4 font-display text-display-xl text-balance text-ink lg:col-span-7" />
        {lede && (
          <p data-reveal className="col-span-4 max-w-[44ch] self-end text-lede text-pretty text-ink-2 lg:col-span-4 lg:col-start-9">
            {lede}
          </p>
        )}
      </div>
      {children}
    </header>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-label font-normal mb-4 text-ink-3 ${className}`}>{children}</p>;
}

/** The one section-title style used across every page: a hairline rule, an optional accent eyebrow,
 *  a display-l heading, an optional note, and an optional action aligned to the right. */
export function SubHead({
  title,
  eyebrow,
  note,
  action,
  id,
  n,
  as = "h2",
  className = "",
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  note?: ReactNode;
  action?: ReactNode;
  id?: string;
  n?: string;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={`mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-line pt-6 sm:mb-14 sm:pt-8 ${className}`} data-n={n}>
      <div className="min-w-0 max-w-[62rem]">
        {eyebrow && <p className="font-mono text-label font-normal mb-3 text-accent-ink">{eyebrow}</p>}
        <Lines as={as} id={id} lines={[title]} className="font-display text-display-l text-balance text-ink" />
        {note && (
          <p data-reveal className="max-w-[62ch] text-pretty mt-4 leading-relaxed text-ink-2">
            {note}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ───────── Interaction hint ─────────
   One small, consistent cue for anything you can explore: a pointer mark plus a short instruction.
   Mouse and trackpad readers see `children`; touch readers see `touch` (defaults to `children`).
   `keys` adds keyboard shortcuts as <kbd> chips, shown only where there is a fine pointer. */

/** Copies the full URL for a deep link (a plan month, a stage, a key figure) so it can be shared. The result is announced
 *  in a polite live region; if the clipboard is blocked, it says so instead of failing silently. `iconOnly` keeps the
 *  label for screen readers only and shows the result in a small bubble, for tight spots such as card bands. */
export function CopyLink({
  hash,
  label = "Copy link",
  className = "",
  iconOnly = false,
}: {
  hash: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${location.origin}${location.pathname}${location.search}${hash}`);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 3000);
  };
  return (
    <span className={`inline-flex items-center gap-x-2 ${iconOnly ? "relative" : ""} ${className}`}>
      <button
        type="button"
        onClick={copy}
        title={iconOnly ? label : undefined}
        className="hit inline-flex items-center gap-1.5 font-mono text-label font-normal transition-colors hover:text-accent-ink"
      >
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" className="size-3.5 shrink-0">
          <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
          <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
        </svg>
        {iconOnly ? <span className="sr-only">{label}</span> : label}
      </button>
      <span
        role="status"
        aria-live="polite"
        className={`font-mono text-label font-normal ${
          iconOnly
            ? "absolute right-0 top-full z-10 mt-2 w-max max-w-[11rem] rounded-chip border border-line bg-card px-2 py-1 text-ink shadow-1 empty:border-0 empty:p-0 empty:shadow-none"
            : ""
        }`}
      >
        {status === "copied" ? "Link copied" : status === "failed" ? "Couldn't copy. Use the address bar." : ""}
      </span>
    </span>
  );
}

export function Hint({
  children,
  touch,
  keys,
  className = "",
}: {
  children: ReactNode;
  touch?: ReactNode;
  keys?: string[];
  className?: string;
}) {
  return (
    // A caller that hides the hint at some sizes (e.g. "hidden sm:inline-flex") owns the display value.
    <span className={`${/(^|\s)hidden(\s|$)/.test(className) ? "" : "inline-flex"} items-center gap-1.5 font-mono text-label font-normal text-current opacity-80 ${className}`}>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-3.5 shrink-0">
        <path d="M5.5 2.5v7.2l1.9-1.6 1.4 3.4 1.5-.6-1.4-3.3h2.6L5.5 2.5Z" strokeLinejoin="round" />
      </svg>
      <span className="pointer-coarse:hidden">{children}</span>
      <span className="hidden pointer-coarse:inline">{touch ?? children}</span>
      {keys && (
        <span className="ml-1 inline-flex gap-1 pointer-coarse:hidden">
          {keys.map((k) => (
            <kbd key={k} className="rounded-[4px] border border-current/30 px-1 py-px font-mono text-xs leading-none">
              {k}
            </kbd>
          ))}
        </span>
      )}
    </span>
  );
}

/* ───────── Tags ───────── */

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "solid" }) {
  const tones = {
    neutral: "border-line-strong text-ink-2",
    accent: "border-accent text-accent-ink",
    solid: "border-ink bg-ink text-paper",
  };
  return (
    <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-[3px] font-mono text-xs leading-4 tracking-tight ${tones[tone]}`}>
      {typeof children === "string" && <BrandLogosFor text={children} max={2} className="size-3.5" letters={false} />}
      <span>{children}</span>
    </span>
  );
}

/** `onBand` takes the text colour of a filled band (e.g. a card head) instead of the muted ink. */
export function BasisBadge({ basis, onBand = false }: { basis: BasisKind; onBand?: boolean }) {
  return (
    <span className={`font-mono text-label font-normal inline-flex items-center gap-1.5 whitespace-nowrap ${onBand ? "text-current [&_.glyph-accent]:stroke-current" : "text-ink-3"}`}>
      <BasisGlyph basis={basis} className={`size-3.5 ${onBand ? "[--accent:currentColor]" : ""}`} />
      <span>{basisLabel[basis]}</span>
    </span>
  );
}

/* ───────── Tabs (WAI-ARIA tabs pattern, roving tabindex) ───────── */

/** Shared tab behaviour for every tablist on the page: roving tabindex, arrows by orientation, Home/End.
 *  Spread `listProps` on the tablist, `tabProps(id, i)` on each tab and `panelProps(id)` on the panel. */
export function useTabList({
  ids,
  value,
  onChange,
  idPrefix,
  orientation = "horizontal",
}: {
  ids: string[];
  value: string;
  onChange: (id: string) => void;
  idPrefix: string;
  orientation?: "horizontal" | "vertical";
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    // Step from the focused tab (it can differ from the selected one), falling back to the selection.
    const focused = refs.current.findIndex((el) => el === document.activeElement);
    const i = focused >= 0 ? focused : ids.indexOf(value);
    const fwd = orientation === "vertical" ? ["ArrowDown", "ArrowRight"] : ["ArrowRight"];
    const back = orientation === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft"];
    let n = -1;
    if (fwd.includes(e.key)) n = (i + 1) % ids.length;
    else if (back.includes(e.key)) n = (i - 1 + ids.length) % ids.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = ids.length - 1;
    if (n < 0) return;
    e.preventDefault();
    onChange(ids[n]);
    refs.current[n]?.focus();
  };

  return {
    listProps: { role: "tablist", "aria-orientation": orientation, onKeyDown } as const,
    tabProps: (id: string, idx: number) =>
      ({
        ref: (el: HTMLButtonElement | null) => {
          refs.current[idx] = el;
        },
        role: "tab",
        type: "button",
        id: `${idPrefix}-tab-${id}`,
        "aria-selected": id === value,
        "aria-controls": id === value ? `${idPrefix}-panel-${id}` : undefined,
        tabIndex: id === value ? 0 : -1,
        onClick: () => onChange(id),
      }) as const,
    panelProps: (id: string) =>
      ({ role: "tabpanel", id: `${idPrefix}-panel-${id}`, "aria-labelledby": `${idPrefix}-tab-${id}`, tabIndex: 0 }) as const,
  };
}

export interface TabItem {
  id: string;
  label: ReactNode;
  sub?: ReactNode;
}

export function Tabs({
  items,
  value,
  onChange,
  label,
  idPrefix,
  variant = "underline",
  orientation = "horizontal",
  className = "",
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  idPrefix: string;
  variant?: "underline" | "segmented" | "list";
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  const { listProps, tabProps } = useTabList({ ids: items.map((t) => t.id), value, onChange, idPrefix, orientation });

  const wrap = {
    underline: "flex gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-line",
    segmented: "inline-flex max-w-full gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-ctl border border-edge bg-card p-1",
    list: orientation === "vertical" ? "flex flex-col border-t border-line" : "grid grid-flow-col auto-cols-[minmax(13rem,1fr)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-t border-line",
  }[variant];

  return (
    <div {...listProps} aria-label={label} className={`${wrap} ${className}`}>
      {items.map((t, idx) => {
        const selected = t.id === value;
        const base = {
          underline: `group relative -mb-px shrink-0 pb-3 pt-1 focus-visible:outline-offset-[-2px] font-mono text-label font-normal transition-colors duration-500 ${
            selected ? "text-ink" : "text-ink-3 hover:text-ink"
          }`,
          segmented: `shrink-0 h-11 rounded-chip px-4 focus-visible:outline-offset-[-2px] font-mono text-label font-normal transition-colors duration-300 ease-silk ${
            selected ? "bg-inverse text-on-inverse" : "text-ink-3 hover:text-ink hover:bg-sunken"
          }`,
          list:
            orientation === "vertical"
              ? `group relative flex items-baseline gap-4 border-b border-line py-4 text-left transition-colors duration-500 ${
                  selected ? "text-ink" : "text-ink-3 hover:text-ink"
                }`
              : `group relative border-r border-line py-5 pr-6 text-left focus-visible:outline-offset-[-2px] transition-colors duration-500 last:border-r-0 [&:not(:first-child)]:pl-5 ${
                  selected ? "text-ink" : "text-ink-3 hover:text-ink"
                }`,
        }[variant];
        return (
          <button key={t.id} {...tabProps(t.id, idx)} className={base}>
            {variant === "list" && orientation === "vertical" ? (
              <>
                {t.sub && <span className="font-mono text-label font-normal w-8 shrink-0 text-ink-3">{t.sub}</span>}
                <span className={`font-display font-semibold tracking-[-0.02em] text-pretty text-2xl leading-tight transition-transform duration-700 ease-silk ${selected ? "motion-safe:translate-x-2" : "motion-safe:group-hover:translate-x-1"}`}>
                  {t.label}
                </span>
                <span aria-hidden className={`inline-block size-[7px] shrink-0 rounded-full bg-current ml-auto self-center text-accent transition-transform duration-500 ease-silk ${selected ? "scale-100" : "scale-0"}`} />
              </>
            ) : variant === "list" ? (
              <>
                {t.sub && <span className={`font-mono text-label font-normal block ${selected ? "text-accent-ink" : "text-ink-3"}`}>{t.sub}</span>}
                <span className="mt-2 block text-[1.0625rem] font-medium leading-snug tracking-tight">{t.label}</span>
                <span aria-hidden className={`absolute -top-px left-0 right-0 h-[2px] origin-left bg-accent transition-transform duration-700 ease-silk ${selected ? "scale-x-100" : "scale-x-0"}`} />
              </>
            ) : (
              <>
                <span className="block">{t.label}</span>
                {t.sub && <span className="mt-0.5 block font-mono text-xs normal-case tracking-normal text-ink-3">{t.sub}</span>}
                {variant === "underline" && (
                  <span aria-hidden className={`absolute bottom-0 left-0 right-0 h-px origin-left bg-ink transition-transform duration-700 ease-silk ${selected ? "scale-x-100" : "scale-x-0"}`} />
                )}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ idPrefix, id, children, className = "" }: { idPrefix: string; id: string; children: ReactNode; className?: string }) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-tab-${id}`}
      tabIndex={0}
      className={`animate-panel-in motion-reduce:animate-fade-in focus-visible:outline-offset-8 ${className}`}
      key={id}
    >
      {children}
    </div>
  );
}

/* ───────── Accordion ───────── */

export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  meta,
  headingLevel: Heading = "h3",
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Pass `open` + `onOpenChange` to control the disclosure from the parent. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  meta?: ReactNode;
  headingLevel?: "h2" | "h3" | "h4";
}) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = (next: (o: boolean) => boolean) => {
    const v = next(open);
    setOpenState(v);
    onOpenChange?.(v);
  };
  const id = useId();
  return (
    <div className="border-b border-line">
      <Heading>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="group flex w-full items-center gap-4 py-5 text-left"
        >
          <span className="flex-1 text-base font-medium text-ink transition-colors duration-300 group-hover:text-accent-ink">{summary}</span>
          {meta && <span className="hidden sm:block">{meta}</span>}
          <span aria-hidden className="relative block size-3 shrink-0 text-ink-3 transition-colors duration-500 group-hover:text-accent">
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
            <span className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-700 ease-silk ${open ? "scale-y-0" : ""}`} />
          </span>
        </button>
      </Heading>
      <div id={id} hidden={!open} className="pb-6">
        {open && <div className="animate-panel-in motion-reduce:animate-fade-in">{children}</div>}
      </div>
    </div>
  );
}

/* ───────── Checklist row ───────── */

export function CheckRow({
  checked,
  onToggle,
  title,
  detail,
  index,
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  detail: string;
  index?: number;
}) {
  const id = useId();
  return (
    <li className="border-b border-line">
      <label htmlFor={id} className="group -mx-3 grid cursor-pointer grid-cols-[2.25rem_1fr_auto] items-start gap-x-3 rounded-ctl px-3 py-5 transition-colors duration-300 hover:bg-sunken/60">
        <input id={id} type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
        <span className="font-mono text-label font-normal pt-1 text-ink-3 tabular-nums">{index !== undefined ? String(index).padStart(2, "0") : ""}</span>
        <span>
          <span className={`block text-[1.0625rem] font-medium leading-snug tracking-tight transition-colors duration-500 ${checked ? "text-ink-3" : "text-ink"}`}>
            <span className={`bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_55%] bg-no-repeat transition-[background-size] duration-700 ease-silk ${checked ? "bg-[length:100%_1px]" : ""}`}>
              {title}
            </span>
          </span>
          <span className="mt-1.5 block max-w-[60ch] text-sm leading-relaxed text-ink-2">{detail}</span>
        </span>
        <span
          aria-hidden
          className={`relative mt-0.5 grid size-5 place-items-center rounded-[6px] border transition-colors duration-500 ease-silk peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
            checked ? "border-accent bg-accent" : "border-line-strong group-hover:border-ink"
          }`}
        >
          <svg viewBox="0 0 12 12" className="size-3 text-on-accent" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M2.5 6.5l2.2 2.2L9.5 3.5" pathLength={1} strokeDasharray={1} strokeDashoffset={checked ? 0 : 1} className="transition-[stroke-dashoffset] duration-500 ease-silk" />
          </svg>
        </span>
      </label>
    </li>
  );
}

/** Compact topic checkbox shared by Plan, PlanRoadmapBase, and Library → Roadmaps. */
export function TopicCheckbox({
  checked,
  onToggle,
  label,
  meta,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  meta?: string;
}) {
  return (
    <label className="group flex min-h-11 cursor-pointer items-start gap-2.5 py-3">
      <input type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
      <span
        aria-hidden
        className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors duration-300 ease-silk peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
          checked ? "border-accent bg-accent" : "border-line-strong group-hover:border-ink"
        }`}
      >
        <svg viewBox="0 0 12 12" className="size-2.5 text-on-accent" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path
            d="M2.5 6.5l2.2 2.2L9.5 3.5"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={checked ? 0 : 1}
            className="transition-[stroke-dashoffset] duration-300 ease-silk"
          />
        </svg>
      </span>
      <span className="min-w-0 flex-1 text-sm leading-snug">
        <span className={`transition-colors duration-300 ${checked ? "text-ink-3 line-through" : "text-ink-2 group-hover:text-ink"}`}>
          {label}
        </span>
        {meta && <span className="font-mono text-label font-normal ml-2 text-ink-3">· {meta}</span>}
      </span>
    </label>
  );
}

/* ───────── Persisted checklist state ───────── */

/** Safely parses a JSON string array from storage, rejecting non-arrays and non-string entries. */
export function parseStringArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function usePersistentSet(key: string) {
  const [set, setSet] = useState<Set<string>>(() => {
    try {
      return new Set(parseStringArray(localStorage.getItem(key)));
    } catch {
      return new Set();
    }
  });
  const toggle = (id: string) =>
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(key, JSON.stringify([...next]));
      } catch {
        /* storage unavailable: state stays in memory */
      }
      return next;
    });
  /** Put back a set captured before a reset (undo). */
  const restore = (prev: Set<string>) => {
    setSet(new Set(prev));
    try {
      localStorage.setItem(key, JSON.stringify([...prev]));
    } catch {
      /* ignore */
    }
  };
  const reset = () => {
    setSet(new Set());
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  };
  return { set, toggle, reset, restore };
}

/* ───────── Reader's track: shared, persisted, deep-linkable ─────────
   One stored choice per key, kept in localStorage. Deep links like #roadmap/b,
   #roadmap/a/meta or #readiness/b write the choice, then scroll there. */

export type Track = "a" | "b";
export const TRACK_KEY = "de-guide:track";
export const TRACK_A_OPTION_KEY = "de-guide:track-a-option";

function readStored<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the choice lives for this page view only */
  }
}

/** The reader's saved track, or null if they haven't picked one. No silent default. */
export function readStoredTrack(): Track | null {
  const v = readStored<Track | "none">(TRACK_KEY, "none", ["a", "b", "none"]);
  return v === "none" ? null : v;
}

/* ───────── Pages (hash router) ─────────
   Five pages, one question each. Routes are hashes so the site works on any
   static host. The URL is the source of truth for where the reader is and what
   is selected; storage only remembers the last choice to fill in a bare URL.

     #/roles/{de|meta|ax}            selected role
     #/plan/a/{pde|meta}/m{1-6}      Track A, option, month
     #/plan/b/s{1-4}                 Track B, stage
     #/ready/{a|b}                   checklist for a track
     #/library/{shelf}[/{term}]      shelf, optional glossary term

   Rule: a change of place (page, shelf) is a link that pushes history; a change
   of view inside a place (track, month, stage, role) calls navigate(…, { replace: true }).
   Old single-page anchors still resolve through `legacy`. */

export type Page = "home" | "jobs" | "roles" | "plan" | "ready" | "library" | "sources";
/** `nav: false` keeps a page out of the top nav (it is linked from the footer and search instead). */
export const pages: { id: Page; label: string; title: string; nav?: boolean }[] = [
  { id: "home", label: "Start", title: "Start here" },
  { id: "jobs", label: "Jobs", title: "Is my job going away?" },
  { id: "roles", label: "Roles", title: "Which role fits you?" },
  { id: "plan", label: "Plan", title: "Your plan" },
  { id: "ready", label: "Checklist", title: "How do I know I'm ready?" },
  { id: "library", label: "Library", title: "Reference library" },
  { id: "sources", label: "Sources", title: "Sources and method", nav: false },
];
/** The six pages in the top nav, in reading order. */
export const navPages = pages.filter((p) => p.nav !== false);
export const pageHref = (id: Page, ...parts: string[]) => (id === "home" ? "#/" : `#/${[id, ...parts].join("/")}`);

export interface Route {
  page: Page;
  parts: string[];
  /** The hash named a page that doesn't exist. */
  notFound?: boolean;
}

const legacy: Record<string, string> = {
  "#top": "#/",
  "#shift": "#/",
  "#archetypes": "#/roles",
  "#roadmap": "#/plan",
  "#readiness": "#/ready",
  "#compare": "#/library/compare",
  "#skills": "#/library/skills",
  "#tooling": "#/library/tools",
};

const BASE = import.meta.env.BASE_URL || "/";
const isAppBasePath = (pathname: string) =>
  pathname === BASE || pathname === `${BASE}index.html` || (BASE.endsWith("/") && BASE.length > 1 && pathname === BASE.slice(0, -1));

function parseRoute(hash: string): Route | null {
  if (typeof location !== "undefined" && !isAppBasePath(location.pathname)) {
    return { page: "home", parts: [], notFound: true };
  }
  let h = hash;
  const old = h.match(/^#(roadmap|readiness)\/(.+)$/);
  if (old) h = `#/${old[1] === "roadmap" ? "plan" : "ready"}/${old[2]}`;
  else if (legacy[h]) h = legacy[h];
  if (h === "" || h === "#" || h === "#/") return { page: "home", parts: [] };
  if (!h.startsWith("#/")) return null; // a plain in-page anchor such as #main
  const [first = "", ...parts] = h.slice(2).split("/").filter(Boolean);
  const page = pages.find((p) => p.id === first)?.id;
  if (!page) return { page: "home", parts: [], notFound: true };
  return { page, parts };
}

/* ── Plan sub-route ── */

export type TrackAOption = "pde" | "meta";
export type PlanRoute = { track: "a"; option: TrackAOption; month: number } | { track: "b"; stage: number };

const clampStep = (raw: string | undefined, prefix: string, max: number) => {
  const n = Number(raw?.startsWith(prefix) ? raw.slice(1) : NaN);
  return Number.isInteger(n) && n >= 1 && n <= max ? n : 1;
};

/** Reads #/plan/… parts. Returns null when no track is named. */
export function planFromParts(parts: string[]): PlanRoute | null {
  const [track, b, c] = parts;
  if (track === "a") {
    const option: TrackAOption =
      b === "pde" || b === "meta" ? b : readStored<TrackAOption>(TRACK_A_OPTION_KEY, "pde", ["pde", "meta"]);
    return { track: "a", option, month: clampStep(c, "m", 6) };
  }
  if (track === "b") return { track: "b", stage: clampStep(b, "s", 4) };
  return null;
}

export const planHref = (p: PlanRoute) => (p.track === "a" ? `#/plan/a/${p.option}/m${p.month}` : `#/plan/b/s${p.stage}`);

export const PLAN_ROUTE_KEY = "de-guide:plan-route";

/** Where "back to your plan" should go: the last plan the reader looked at, else the bare plan page. */
export function lastPlanHref() {
  try {
    const saved = localStorage.getItem(PLAN_ROUTE_KEY);
    if (saved) {
      const r = parseRoute(saved);
      if (r && !r.notFound && r.page === "plan") {
        const plan = planFromParts(r.parts);
        if (plan) return planHref(plan);
      }
    }
  } catch {
    /* ignore */
  }
  return pageHref("plan");
}

/** Track from a #/ready/{a|b} or #/plan/{a|b} part, or null. */
export const trackFromPart = (part: string | undefined): Track | null => (part === "a" || part === "b" ? part : null);

/** Fills in a bare or partial URL from stored choices, so the address bar always names what's shown. */
function canonical(r: Route): string | null {
  if (r.notFound) return null;
  if (r.page === "plan") {
    const plan = planFromParts(r.parts);
    if (plan) return planHref(plan);
    const saved = lastPlanHref();
    if (saved !== pageHref("plan")) return saved;
    const t = readStoredTrack();
    return t ? planHref(t === "a" ? { track: "a", option: readStored<TrackAOption>(TRACK_A_OPTION_KEY, "pde", ["pde", "meta"]), month: 1 } : { track: "b", stage: 1 }) : null;
  }
  if (r.page === "ready" && !trackFromPart(r.parts[0])) {
    const t = readStoredTrack();
    return t ? pageHref("ready", t) : null;
  }
  return null;
}

/** Remember the choices a URL carries, so a bare #/plan or #/ready can be filled in next time. */
function remember(r: Route) {
  if (r.notFound) return;
  if (r.page === "plan") {
    const plan = planFromParts(r.parts);
    if (!plan) return;
    writeStored(TRACK_KEY, plan.track);
    if (plan.track === "a") writeStored(TRACK_A_OPTION_KEY, plan.option);
    try {
      localStorage.setItem(PLAN_ROUTE_KEY, planHref(plan));
    } catch {
      /* ignore */
    }
  } else if (r.page === "ready") {
    const t = trackFromPart(r.parts[0]);
    if (t) writeStored(TRACK_KEY, t);
  }
}

const NAV_EVENT = "de-guide:navigate";
const SCROLL_PREFIX = "de-guide:scroll:";

/** Change the URL from code. `replace` swaps the current history entry (a change of view, not of place). */
export function navigate(hash: string, { replace = false }: { replace?: boolean } = {}) {
  if (hash === location.hash && isAppBasePath(location.pathname)) return;
  const target = isAppBasePath(location.pathname) ? hash : `${BASE}${hash}`;
  try {
    if (replace) history.replaceState(null, "", target);
    else history.pushState(null, "", target);
  } catch {
    location.hash = hash; // falls back to a normal hashchange
    return;
  }
  window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: { replace } }));
}

/**
 * Current route. Fills in bare URLs from stored choices, remembers choices the URL carries,
 * and handles scroll: a new page starts at the top, Back/Forward restores where the reader was.
 * Call it once (App) and pass what pages need down as props.
 */
export function useRoute() {
  const [route, setRoute] = useState<Route>(() => {
    const r = parseRoute(location.hash) ?? { page: "home" as Page, parts: [] };
    const fix = canonical(r);
    if (fix) {
      try {
        history.replaceState(null, "", fix);
      } catch {
        /* ignore */
      }
      return parseRoute(fix) ?? r;
    }
    return r;
  });
  const routeRef = useRef(route);
  routeRef.current = route;

  useEffect(() => {
    try {
      history.scrollRestoration = "manual";
    } catch {
      /* ignore */
    }
    let fromLink = false; // set by clicks on in-app links, so popstate/hashchange can tell them from Back/Forward
    let current = location.pathname + location.hash;

    const saveScroll = () => {
      try {
        sessionStorage.setItem(SCROLL_PREFIX + current, String(Math.round(window.scrollY)));
      } catch {
        /* ignore */
      }
    };

    const apply = (kind: "link" | "history" | "replace" | "push") => {
      const r = parseRoute(location.hash);
      if (!r) return;
      const fix = canonical(r);
      if (fix && fix !== location.hash) {
        try {
          history.replaceState(null, "", fix);
        } catch {
          /* ignore */
        }
      }
      const final = (fix ? parseRoute(fix) : null) ?? r;
      remember(final);
      current = location.pathname + location.hash;
      const prev = routeRef.current;
      const pageChanged =
        prev.page !== final.page ||
        prev.notFound !== final.notFound ||
        (final.page === "library" && prev.parts[0] !== final.parts[0]);
      routeRef.current = final;
      setRoute(final);
      if (kind === "history") {
        let y = 0;
        try {
          const parsed = Number(sessionStorage.getItem(SCROLL_PREFIX + current) ?? 0);
          y = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
        } catch {
          /* ignore */
        }
        // Wait for the page to render before restoring.
        requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior })));
      } else if (pageChanged) {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    };

    remember(routeRef.current);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#'], a[href^='/#']");
      if (a && !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        saveScroll();
        fromLink = true;
      }
    };
    const onHash = () => {
      if (location.pathname + location.hash === current) {
        fromLink = false;
        return;
      }
      const kind = fromLink ? "link" : "history";
      fromLink = false;
      apply(kind);
    };
    const onNav = (e: Event) => {
      fromLink = false;
      const replace = (e as CustomEvent<{ replace: boolean }>).detail?.replace;
      if (!replace) saveScroll();
      apply(replace ? "replace" : "push");
    };
    const onPop = () => {
      // Link clicks fire popstate before hashchange; read and clear fromLink here so they scroll to top.
      if (location.pathname + location.hash !== current) {
        const kind = fromLink ? "link" : "history";
        fromLink = false;
        apply(kind);
      }
    };
    let t = 0;
    const onScroll = () => {
      clearTimeout(t);
      t = window.setTimeout(saveScroll, 150);
    };

    document.addEventListener("click", onClick, false);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onPop);
    window.addEventListener(NAV_EVENT, onNav);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, false);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener(NAV_EVENT, onNav);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);
  return route;
}

/* ───────── Storage status ─────────
   One probe for the whole page. When storage is blocked, copy that promises
   "saved in this browser" must say so instead. */

let storageProbe: boolean | null = null;
export function storageAvailable() {
  if (storageProbe !== null) return storageProbe;
  try {
    const k = "de-guide:probe";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    storageProbe = true;
  } catch {
    storageProbe = false;
  }
  return storageProbe;
}

/** Plain sentence about where ticks are kept, true to whether storage works. */
export function useSaveNote() {
  return storageAvailable()
    ? "Your ticks are saved in this browser only; nothing is sent anywhere."
    : "Your browser is blocking storage, so ticks clear when you leave this page.";
}

/* ───────── Context bar ─────────
   Sticky strip under the nav on long pages: where you are (trail) and jump
   links to the page's parts. Jumps are buttons, not #anchors, so they never
   overwrite the route in the address bar. */

export function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = prefersReducedMotion();
  const top = el.getBoundingClientRect().top + window.scrollY - (window.innerWidth >= 1024 ? 128 : 152);
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function ContextBar({
  trail,
  jumps = [],
  label = "You are here",
}: {
  trail: { label: string; href?: string }[];
  jumps?: { id: string; label: string }[];
  label?: string;
}) {
  return (
    <div className="sticky top-24 z-30 -mx-[var(--gutter)] border-b border-line bg-paper/95 px-[var(--gutter)] backdrop-blur-[2px] lg:top-16">
      <div className="flex min-h-11 items-center gap-6">
        <nav data-nav aria-label={label} className="min-w-0 flex-1">
          <ol className="font-mono text-label font-normal flex min-w-0 items-center gap-2 text-ink-3">
            {trail.map((t, i) => {
              const last = i === trail.length - 1;
              return (
                <li key={i} className={`flex min-w-0 items-center gap-2 ${last ? "" : "shrink-0 max-sm:[&:not(:first-child)]:hidden"}`}>
                  {i > 0 && <span aria-hidden className={last ? "" : "max-sm:hidden"}>›</span>}
                  {t.href && !last ? (
                    <a href={t.href} className="hit bg-[linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[100%_1px,0%_1px] bg-position-[0_100%,100%_100%] pb-0.5 transition-[background-size] duration-[600ms] ease-silk hover:bg-size-[100%_1px,100%_1px] hover:bg-position-[0_100%,0_100%] focus-visible:bg-size-[100%_1px,100%_1px] focus-visible:bg-position-[0_100%,0_100%] text-ink-2 hover:text-ink group-hover:bg-size-[100%_1px,100%_1px] group-hover:bg-position-[0_100%,0_100%] group-focus-visible:bg-size-[100%_1px,100%_1px] group-focus-visible:bg-position-[0_100%,0_100%]">
                      {t.label}
                    </a>
                  ) : (
                    <span aria-current={last ? "location" : undefined} className={`truncate ${last ? "text-ink" : ""}`}>
                      {t.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {jumps.length > 0 && (
          <nav aria-label="On this page" className="hidden shrink-0 md:block">
            <ul className="font-mono text-label font-normal flex items-center gap-4 text-ink-3">
              {jumps.map((j) => (
                <li key={j.id}>
                  <button type="button" onClick={() => jumpTo(j.id)} className="hit bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-size-[0%_1px] bg-position-[100%_100%] pb-0.5 transition-[background-size,color] duration-[600ms] ease-silk hover:bg-size-[100%_1px] hover:bg-position-[0%_100%] focus-visible:bg-size-[100%_1px] focus-visible:bg-position-[0%_100%] data-[on=true]:bg-size-[100%_1px] data-[on=true]:bg-position-[0%_100%] text-ink-3 hover:text-ink group-hover:bg-size-[100%_1px] group-hover:bg-position-[0%_100%] group-focus-visible:bg-size-[100%_1px] group-focus-visible:bg-position-[0%_100%]">
                    {j.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

/** Segmented meter: one cell per item, filled cells in accent. */
export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div>
      <div className="font-mono text-label font-normal flex items-baseline justify-between text-ink-3">
        <span>{label}</span>
        <span className="tabular-nums text-ink">
          {String(value).padStart(2, "0")} / {String(max).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-3 flex gap-1" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <span
              className={`absolute inset-0 origin-left bg-accent transition-transform duration-700 ease-silk ${i < value ? "scale-x-100" : "scale-x-0"}`}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** End-of-page signpost: the one obvious next step. */
export function NextPage({ to, href, title, note }: { to: Page; href?: string; title: string; note: string }) {
  return (
    <div data-nav className="mx-auto w-full max-w-[1440px] px-(--gutter) pb-24 sm:pb-32">
      <a href={href ?? pageHref(to)} className={`relative ${cardLink} group flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8`}>
        <span>
          <span className="font-mono text-label font-normal text-accent-ink">Next</span>
          <span className="font-display text-display-m text-balance mt-3 block text-ink">{title}</span>
          <span className="mt-3 block max-w-[52ch] text-ink-2">{note}</span>
        </span>
        <span className="font-mono text-label font-normal flex items-center gap-2 text-ink">
          Continue <ArrowGlyph />
        </span>
      </a>
    </div>
  );
}
