import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { basisLabel, type BasisKind } from "../data/research";

/* ───────── Layout ───────── */

export function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`border-t border-line ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  id,
  index,
  kicker,
  title,
  lede,
}: {
  id: string;
  index: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <header className="mb-10 grid gap-6 sm:mb-14 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-3">
          <span className="text-accent">{index}</span> · {kicker}
        </p>
      </div>
      <div className="lg:col-span-9">
        <h2 id={`${id}-title`} className="font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
          {title}
        </h2>
        {lede && <p className="prose-measure mt-4 text-lg leading-relaxed text-ink-2">{lede}</p>}
      </div>
    </header>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{children}</p>;
}

/* ───────── Tags ───────── */

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "solid" }) {
  const tones = {
    neutral: "border-line text-ink-2 bg-surface",
    accent: "border-accent/40 text-accent-ink bg-accent-soft",
    solid: "border-ink bg-ink text-paper",
  };
  return (
    <span className={`inline-flex max-w-full items-center rounded-[3px] border px-1.5 py-0.5 font-mono text-[11px] leading-4 ${tones[tone]}`}>
      {children}
    </span>
  );
}

const basisStyle: Record<BasisKind, string> = {
  base: "border-line-strong text-ink-2",
  total: "border-ink text-ink",
  single: "border-dashed border-accent text-accent-ink",
  survey: "border-line text-ink-3",
  analytics: "border-line text-ink-3",
  projection: "border-line text-ink-3",
  case: "border-line text-ink-3",
};

export function BasisBadge({ basis }: { basis: BasisKind }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${basisStyle[basis]}`}>
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
    underline: "flex gap-6 overflow-x-auto no-scrollbar border-b border-line",
    segmented: "inline-flex rounded-md border border-line bg-sunken p-1 gap-1 max-w-full overflow-x-auto no-scrollbar",
    list: orientation === "vertical" ? "flex flex-col border-l border-line" : "flex overflow-x-auto no-scrollbar border-b border-line",
  }[variant];

  return (
    <div role="tablist" aria-label={label} aria-orientation={orientation} onKeyDown={onKeyDown} className={`${wrap} ${className}`}>
      {items.map((t, idx) => {
        const selected = t.id === value;
        const base = {
          underline: `-mb-px shrink-0 border-b-2 pb-3 pt-1 text-sm font-medium transition-colors ${
            selected ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink"
          }`,
          segmented: `shrink-0 rounded px-3 py-1.5 text-sm font-medium transition-all ${
            selected ? "bg-surface text-ink shadow-[0_1px_0_var(--line-strong),0_0_0_1px_var(--line)]" : "text-ink-3 hover:text-ink"
          }`,
          list:
            orientation === "vertical"
              ? `-ml-px border-l-2 py-3 pl-4 pr-2 text-left transition-colors ${
                  selected ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink hover:border-line-strong"
                }`
              : `-mb-px shrink-0 border-b-2 px-3 pb-3 pt-1 text-left text-sm transition-colors ${
                  selected ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink"
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
            <span className="block">{t.label}</span>
            {t.sub && <span className="mt-0.5 block font-mono text-[11px] text-ink-3">{t.sub}</span>}
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
      className={`fade-in focus-visible:outline-offset-4 ${className}`}
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
          className="group flex w-full items-center gap-4 py-4 text-left"
        >
          <span className="flex-1 text-base font-medium text-ink">{summary}</span>
          {meta && <span className="hidden sm:block">{meta}</span>}
          <span
            aria-hidden
            className={`grid size-6 shrink-0 place-items-center rounded-full border border-line font-mono text-xs text-ink-3 transition-transform duration-200 group-hover:border-ink group-hover:text-ink ${open ? "rotate-45" : ""}`}
          >
            +
          </span>
        </button>
      </h3>
      <div id={id} hidden={!open} className="pb-5">
        {open && <div className="fade-in">{children}</div>}
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
    <li className="border-b border-line last:border-b-0">
      <label htmlFor={id} className="group flex cursor-pointer gap-4 py-4">
        <input id={id} type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
        <span
          aria-hidden
          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-[4px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
            checked ? "border-accent bg-accent text-white" : "border-line-strong bg-surface group-hover:border-ink"
          }`}
        >
          <svg viewBox="0 0 12 12" className={`size-3 transition-opacity ${checked ? "opacity-100" : "opacity-0"}`} fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2.5 6.5l2.2 2.2L9.5 3.5" />
          </svg>
        </span>
        <span className="flex-1">
          <span className="flex items-baseline gap-2">
            {index !== undefined && <span className="font-mono text-xs text-ink-3">{String(index).padStart(2, "0")}</span>}
            <span className={`font-medium transition-colors ${checked ? "text-ink-3 line-through decoration-line-strong" : "text-ink"}`}>{title}</span>
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-2">{detail}</span>
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

export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs text-ink-3">
        <span>{label}</span>
        <span className="tabular text-ink">
          {value}/{max}
        </span>
      </div>
      <div
        className="mt-2 h-1 overflow-hidden rounded-full bg-sunken"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
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
