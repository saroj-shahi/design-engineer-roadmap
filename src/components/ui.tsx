import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { basisLabel, type BasisKind } from "../data/research";

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

/** Counts the numeric part of a figure like "−48%" or "3,423" up from zero when it scrolls in. */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  const [shown, setShown] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || prefersReducedMotion()) {
      setShown(value);
      return;
    }
    const [, pre, num, post] = match;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const grouped = num.includes(",");
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 4);
          const n = target * eased;
          const str = grouped ? Math.round(n).toLocaleString("en-US") : n.toFixed(decimals);
          setShown(`${pre}${str}${post}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

/** Chapter opener: running head on a hairline, monumental title, lede offset to the right. */
export function SectionHeader({
  id,
  index,
  kicker,
  title,
  lede,
  folio,
}: {
  id: string;
  index: string;
  kicker: string;
  title: ReactNode[];
  lede?: ReactNode;
  folio?: string;
}) {
  return (
    <header className="mb-16 sm:mb-24">
      <div className="relative pt-4">
        <span aria-hidden data-reveal="rule" className="absolute inset-x-0 top-0 h-px bg-ink" />
        <div className="grid-12 label text-ink-3">
          <p className="col-span-1 text-accent-ink lg:col-span-2">[{index}]</p>
          <p className="col-span-3 text-ink lg:col-span-4">{kicker}</p>
          <p className="hidden lg:col-span-3 lg:block">Field Guide — Ed. 2026</p>
          <p className="hidden text-right lg:col-span-3 lg:block">{folio}</p>
        </div>
      </div>
      <div className="grid-12 mt-10 sm:mt-16">
        <Lines as="h2" id={`${id}-title`} lines={title} className="display-xl col-span-4 text-ink lg:col-span-11" />
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

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label mb-4 text-ink-3 ${className}`}>{children}</p>;
}

export function SubHead({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="mb-8 grid-12 gap-y-3">
      <p className="label col-span-4 pt-2 text-accent-ink lg:col-span-2">[{n}]</p>
      <div className="col-span-4 lg:col-span-10">
        <Lines as="h3" lines={[title]} className="display-m text-ink" />
        {note && (
          <p data-reveal className="prose-measure mt-3 text-sm text-ink-3">
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
    <span className={`inline-flex max-w-full items-center border px-1.5 py-[3px] font-mono text-[10.5px] leading-4 tracking-tight ${tones[tone]}`}>
      {children}
    </span>
  );
}

const basisStyle: Record<BasisKind, string> = {
  base: "text-ink-2",
  total: "text-ink",
  single: "text-accent-ink",
  survey: "text-ink-3",
  analytics: "text-ink-3",
  projection: "text-ink-3",
  case: "text-ink-3",
};

export function BasisBadge({ basis }: { basis: BasisKind }) {
  return (
    <span className={`label inline-flex items-center gap-1.5 whitespace-nowrap !text-[10px] ${basisStyle[basis]}`}>
      <span aria-hidden className={`size-[5px] ${basis === "single" ? "bg-accent" : "bg-current"}`} />
      {basisLabel[basis]}
    </span>
  );
}

/* ───────── Tabs (WAI-ARIA tabs pattern, roving tabindex) ───────── */

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
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.findIndex((t) => t.id === value);
    const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    const prev = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    let n = -1;
    if (e.key === next || (orientation === "vertical" && e.key === "ArrowRight")) n = (i + 1) % items.length;
    else if (e.key === prev || (orientation === "vertical" && e.key === "ArrowLeft")) n = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = items.length - 1;
    if (n < 0) return;
    e.preventDefault();
    onChange(items[n].id);
    refs.current[n]?.focus();
  };

  const wrap = {
    underline: "flex gap-8 overflow-x-auto no-scrollbar border-b border-line",
    segmented: "inline-flex max-w-full overflow-x-auto no-scrollbar border border-line-strong",
    list: orientation === "vertical" ? "flex flex-col border-t border-line" : "grid grid-flow-col auto-cols-[minmax(13rem,1fr)] overflow-x-auto no-scrollbar border-t border-line",
  }[variant];

  return (
    <div role="tablist" aria-label={label} aria-orientation={orientation} onKeyDown={onKeyDown} className={`${wrap} ${className}`}>
      {items.map((t, idx) => {
        const selected = t.id === value;
        const base = {
          underline: `group relative -mb-px shrink-0 pb-3 pt-1 label transition-colors duration-500 ${
            selected ? "text-ink" : "text-ink-3 hover:text-ink"
          }`,
          segmented: `shrink-0 h-10 px-4 label transition-colors duration-500 ease-silk border-r border-line-strong last:border-r-0 ${
            selected ? "bg-ink text-paper" : "text-ink-3 hover:text-ink hover:bg-sunken"
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
          <button
            key={t.id}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            role="tab"
            type="button"
            id={`${idPrefix}-tab-${t.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={base}
          >
            {variant === "list" && orientation === "vertical" ? (
              <>
                {t.sub && <span className="label w-8 shrink-0 text-ink-3">{t.sub}</span>}
                <span className={`font-serif text-2xl leading-tight tracking-tight transition-transform duration-700 ease-silk ${selected ? "translate-x-2" : "group-hover:translate-x-1"}`}>
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
