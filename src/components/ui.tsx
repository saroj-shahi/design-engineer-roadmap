import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { basisLabel, type BasisKind } from "../data/research";
import { ArrowGlyph, Glyph, type GlyphName } from "./icons";

/* ───────── Motion plumbing ───────── */

const prefersReducedMotion = () =>
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
      for (const m of muts) m.addedNodes.forEach((n) => n instanceof HTMLElement && (n.matches("[data-reveal]") ? io.observe(n) : scan(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
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
        <span key={i} className="mask-line" style={{ "--i": i } as CSSProperties}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Counts the numeric part of a figure like "−48%" or "3,423" up from zero when it scrolls in.
 *  Renders the real figure first; only zeroes it (before paint) once motion is known to be allowed,
 *  and snaps back to the real figure for print. */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useLayoutEffect(() => {
    const el = ref.current;
    const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!el || !match || prefersReducedMotion()) {
      setShown(value);
      return;
    }
    const [, pre, num, post] = match;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const grouped = num.includes(",");
    setShown(`${pre}0${post}`);
    let raf = 0;
    const finish = () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      setShown(value);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const n = target * (1 - Math.pow(1 - p, 4));
          setShown(`${pre}${grouped ? Math.round(n).toLocaleString("en-US") : n.toFixed(decimals)}${post}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
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
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/** Pulls its child toward the pointer with a weighted lag. Inert on touch and reduced motion. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength * 1.2;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="inline-block transition-transform duration-700 ease-silk"
    >
      {children}
    </span>
  );
}

/** Label that rolls up to a duplicate on hover. Parent must carry the `group` class. */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  );
}

/* ───────── Layout ───────── */

export function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative ${className}`}>
      <div className="wrap pb-24 sm:pb-36">{children}</div>
    </section>
  );
}

/** Page opener: monumental title, optional glyph plate, lede offset to the right. */
export function SectionHeader({
  id,
  title,
  lede,
  glyph,
  level = "h2",
}: {
  id: string;
  title: ReactNode[];
  lede?: ReactNode;
  glyph?: GlyphName;
  level?: "h1" | "h2";
}) {
  return (
    <header className="mb-16 pt-10 sm:mb-24">
      <div className="grid-12 gap-y-10">
        <Lines as={level} id={`${id}-title`} lines={title} className={`display-xl col-span-4 text-ink ${glyph ? "lg:col-span-8" : "lg:col-span-11"}`} />
        {glyph && <Plate glyph={glyph} className="self-end max-lg:hidden lg:col-span-3 lg:col-start-10" />}
      </div>
      {lede && (
        <div className="grid-12 mt-8 sm:mt-12">
          <p data-reveal className="lede col-span-4 lg:col-span-5 lg:col-start-7">
            {lede}
          </p>
        </div>
      )}
    </header>
  );
}

/** Specimen plate: one chapter glyph drawn large on a blueprint field. Hover plays its gesture. */
export function Plate({ glyph, className = "" }: { glyph: GlyphName; className?: string }) {
  return (
    <figure aria-hidden data-reveal className={`card card-lift group ${className}`} style={{ "--d": "200ms" } as CSSProperties}>
      <div className="plate-field grid aspect-square place-items-center">
        <Glyph name={glyph} className="glyph-xl !size-[62%] text-ink" />
      </div>
    </figure>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label mb-4 text-ink-3 ${className}`}>{children}</p>;
}

/** Subsection heading: sits on a heavy rule, one step below the page title and above card titles. */
export function SubHead({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="mb-10 grid-12 gap-y-3 border-t-2 border-edge pt-6 sm:mb-14 sm:pt-8" data-n={n}>
      <div className="col-span-4 lg:col-span-12">
        <Lines as="h2" lines={[title]} className="display-l text-ink" />
        {note && (
          <p data-reveal className="prose-measure mt-4 leading-relaxed text-ink-2">
            {note}
          </p>
        )}
      </div>
    </div>
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
    <span className={`inline-flex max-w-full items-center border px-1.5 py-[3px] font-mono text-[11px] leading-4 tracking-tight ${tones[tone]}`}>
      {children}
    </span>
  );
}

const basisStyle: Record<BasisKind, string> = {
  survey: "text-ink-3",
  analytics: "text-ink-3",
  projection: "text-ink-3",
  case: "text-ink-3",
};

/** `onBand` takes the text colour of a filled band (e.g. a card head) instead of the muted ink. */
export function BasisBadge({ basis, onBand = false }: { basis: BasisKind; onBand?: boolean }) {
  return (
    <span className={`label inline-flex items-center gap-1.5 whitespace-nowrap ${onBand ? "text-current" : basisStyle[basis]}`}>
      <span aria-hidden className={`size-[5px] bg-current`} />
      {basisLabel[basis]}
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
        "aria-controls": `${idPrefix}-panel-${id}`,
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
    underline: "flex gap-8 overflow-x-auto no-scrollbar border-b border-line",
    segmented: "inline-flex max-w-full overflow-x-auto no-scrollbar border-2 border-edge bg-card shadow-[var(--sh-1)]",
    list: orientation === "vertical" ? "flex flex-col border-t border-line" : "grid grid-flow-col auto-cols-[minmax(13rem,1fr)] overflow-x-auto no-scrollbar border-t border-line",
  }[variant];

  return (
    <div {...listProps} aria-label={label} className={`${wrap} ${className}`}>
      {items.map((t, idx) => {
        const selected = t.id === value;
        const base = {
          underline: `group relative -mb-px shrink-0 pb-3 pt-1 label transition-colors duration-500 ${
            selected ? "text-ink" : "text-ink-3 hover:text-ink"
          }`,
          segmented: `shrink-0 h-11 px-4 label transition-colors duration-300 ease-silk border-r-2 border-edge last:border-r-0 ${
            selected ? "bg-edge text-card" : "text-ink-3 hover:text-ink hover:bg-sunken"
          }`,
          list:
            orientation === "vertical"
              ? `group relative flex items-baseline gap-4 border-b border-line py-4 text-left transition-colors duration-500 ${
                  selected ? "text-ink" : "text-ink-3 hover:text-ink"
                }`
              : `group relative border-r border-line py-5 pr-6 text-left transition-colors duration-500 last:border-r-0 [&:not(:first-child)]:pl-5 ${
                  selected ? "text-ink" : "text-ink-3 hover:text-ink"
                }`,
        }[variant];
        return (
          <button key={t.id} {...tabProps(t.id, idx)} className={base}>
            {variant === "list" && orientation === "vertical" ? (
              <>
                {t.sub && <span className="label w-8 shrink-0 text-ink-3">{t.sub}</span>}
                <span className={`font-display text-2xl leading-tight tracking-tight transition-transform duration-700 ease-silk ${selected ? "translate-x-2" : "group-hover:translate-x-1"}`}>
                  {t.label}
                </span>
                <span aria-hidden className={`tick ml-auto self-center text-accent transition-transform duration-500 ease-silk ${selected ? "scale-100" : "scale-0"}`} />
              </>
            ) : variant === "list" ? (
              <>
                {t.sub && <span className={`label block ${selected ? "text-accent-ink" : "text-ink-3"}`}>{t.sub}</span>}
                <span className="mt-2 block text-[1.0625rem] font-medium leading-snug tracking-tight">{t.label}</span>
                <span aria-hidden className={`absolute -top-px left-0 right-0 h-[2px] origin-left bg-accent transition-transform duration-700 ease-silk ${selected ? "scale-x-100" : "scale-x-0"}`} />
              </>
            ) : (
              <>
                <span className="block">{t.label}</span>
                {t.sub && <span className="mt-0.5 block font-mono text-[11px] normal-case tracking-normal text-ink-3">{t.sub}</span>}
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
      className={`panel-in focus-visible:outline-offset-8 ${className}`}
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
  meta,
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  meta?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="group flex w-full items-center gap-4 py-5 text-left"
        >
          <span className="flex-1 text-base font-medium text-ink">{summary}</span>
          {meta && <span className="hidden sm:block">{meta}</span>}
          <span aria-hidden className="relative block size-3 shrink-0 text-ink-3 transition-colors duration-500 group-hover:text-accent">
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
            <span className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-700 ease-silk ${open ? "scale-y-0" : ""}`} />
          </span>
        </button>
      </h3>
      <div id={id} hidden={!open} className="pb-6">
        {open && <div className="panel-in">{children}</div>}
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
      <label htmlFor={id} className="group grid cursor-pointer grid-cols-[2.25rem_1fr_auto] items-start gap-x-3 py-5">
        <input id={id} type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
        <span className="label pt-1 text-ink-3 tabular">{index !== undefined ? String(index).padStart(2, "0") : ""}</span>
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
          className={`relative mt-0.5 grid size-5 place-items-center border transition-colors duration-500 ease-silk peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
            checked ? "border-accent bg-accent" : "border-line-strong group-hover:border-ink"
          }`}
        >
          <svg viewBox="0 0 12 12" className="size-3 text-[var(--on-accent)]" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2.5 6.5l2.2 2.2L9.5 3.5" pathLength={1} strokeDasharray={1} strokeDashoffset={checked ? 0 : 1} className="transition-[stroke-dashoffset] duration-500 ease-silk" />
          </svg>
        </span>
      </label>
    </li>
  );
}

/* ───────── Persisted checklist state ───────── */

export function usePersistentSet(key: string) {
  const [set, setSet] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(key);
      return new Set(raw ? (JSON.parse(raw) as string[]) : []);
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
  const reset = () => {
    setSet(new Set());
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  };
  return { set, toggle, reset };
}

/* ───────── Reader's track: shared, persisted, deep-linkable ─────────
   One stored choice per key, kept in localStorage and broadcast so every
   component reading it stays in sync. Deep links like #roadmap/b,
   #roadmap/a/meta or #readiness/b write the choice, then scroll there. */

const STORE_EVENT = "de-guide:store";
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
  window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { key, value } }));
}

/** A persisted single choice (track, option…) that stays in sync across components. */
export function useStoredChoice<T extends string>(key: string, fallback: T, allowed: readonly T[]) {
  const [value, setValue] = useState<T>(() => readStored(key, fallback, allowed));
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ key: string; value: string }>).detail;
      if (d?.key === key && allowed.includes(d.value as T)) setValue(d.value as T);
    };
    window.addEventListener(STORE_EVENT, on);
    return () => window.removeEventListener(STORE_EVENT, on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = (v: T) => {
    setValue(v);
    writeStored(key, v);
  };
  return [value, set] as const;
}

export function useTrack() {
  return useStoredChoice<Track>(TRACK_KEY, "a", ["a", "b"]);
}

/* ───────── Pages (hash router) ─────────
   Five pages, one question each. Routes are hashes (#/plan/b) so the site
   works on any static host. Sub-parts carry choices: #/plan/a/meta picks
   Track A + the Meta option, #/ready/b the starter checklist,
   #/library/skills a Library tab. Old single-page anchors still resolve. */

export type Page = "home" | "roles" | "plan" | "ready" | "library";
export const pages: { id: Page; label: string; title: string }[] = [
  { id: "home", label: "Start", title: "Start here" },
  { id: "roles", label: "Roles", title: "Which role fits you" },
  { id: "plan", label: "Plan", title: "Your six-month plan" },
  { id: "ready", label: "Ready?", title: "Am I ready to apply?" },
  { id: "library", label: "Library", title: "Reference library" },
];
export const pageHref = (id: Page, ...parts: string[]) => (id === "home" ? "#/" : `#/${[id, ...parts].join("/")}`);

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

function parseRoute(hash: string): { page: Page; parts: string[] } | null {
  let h = hash;
  const old = h.match(/^#(roadmap|readiness)\/(.+)$/);
  if (old) h = `#/${old[1] === "roadmap" ? "plan" : "ready"}/${old[2]}`;
  else if (legacy[h]) h = legacy[h];
  if (h === "" || h === "#") return { page: "home", parts: [] };
  if (!h.startsWith("#/")) return null; // a plain in-page anchor such as #main
  const [first = "", ...parts] = h.slice(2).split("/").filter(Boolean);
  const page = (pages.find((p) => p.id === first)?.id ?? "home") as Page;
  return { page, parts };
}

/** Current page + sub-parts. Applies choices carried in the URL and scrolls to the top on page change. */
export function useRoute() {
  const [route, setRoute] = useState(() => parseRoute(location.hash) ?? { page: "home" as Page, parts: [] });
  useEffect(() => {
    const apply = (initial = false) => {
      const r = parseRoute(location.hash);
      if (!r) return;
      const [a, b] = r.parts;
      if ((r.page === "plan" || r.page === "ready") && (a === "a" || a === "b")) writeStored(TRACK_KEY, a);
      if (r.page === "plan" && a === "a" && (b === "pde" || b === "meta")) writeStored(TRACK_A_OPTION_KEY, b);
      setRoute((prev) => {
        if (!initial && prev.page !== r.page) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        return r;
      });
    };
    apply(true);
    const onHash = () => apply();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

/** Point the address bar at the current choice without adding history entries or jumping. */
export function replaceHash(hash: string) {
  try {
    history.replaceState(null, "", hash);
  } catch {
    /* ignore */
  }
}

/* ───────── Theme ─────────
   "light" | "dark" chosen by the reader, saved under de-guide:theme.
   With no saved choice the page follows the system setting. index.html
   applies the saved choice before first paint so there is no flash. */

export type Theme = "light" | "dark";
const THEME_KEY = "de-guide:theme";
const systemTheme = (): Theme =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const set = document.documentElement.dataset.theme;
    return set === "light" || set === "dark" ? set : systemTheme();
  });

  // Follow the system while the reader hasn't chosen.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch {
        /* ignore */
      }
      if (!saved) setTheme(systemTheme());
    };
    const onPick = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    mq.addEventListener("change", on);
    window.addEventListener("de-guide:theme", onPick);
    return () => {
      mq.removeEventListener("change", on);
      window.removeEventListener("de-guide:theme", onPick);
    };
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable: applies for this page view */
    }
    window.dispatchEvent(new CustomEvent<Theme>("de-guide:theme", { detail: next }));
  };
  return { theme, toggle };
}

/** Segmented meter: one cell per item, filled cells in accent. */
export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div>
      <div className="label flex items-baseline justify-between text-ink-3">
        <span>{label}</span>
        <span className="tabular text-ink">
          {String(value).padStart(2, "0")} / {String(max).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-3 flex gap-1" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className="relative h-1.5 flex-1 bg-line">
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
export function NextPage({ to, title, note }: { to: Page; title: string; note: string }) {
  return (
    <div className="wrap pb-24 sm:pb-32">
      <a href={pageHref(to)} className="card card-lift group flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <span>
          <span className="label text-accent-ink">Next</span>
          <span className="display-m mt-3 block text-ink">{title}</span>
          <span className="mt-3 block max-w-[52ch] text-ink-2">{note}</span>
        </span>
        <span className="label flex items-center gap-2 text-ink">
          Continue <ArrowGlyph />
        </span>
      </a>
    </div>
  );
}
