import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { archetypes, glossary, planFor } from "../data/research";
import { jumpTo, navigate, pageHref, pages } from "./ui";

/** One place the reader can go: a page, a section of Start, a role, a plan month, a shelf or a glossary term. */
interface Destination {
  label: string;
  group: string;
  hint?: string;
  href: string;
  /** Section id on the Start page to scroll to after arriving. */
  jump?: string;
}

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** The questions the Start page answers, in the reader's words. Shared with the Start page's chips. */
export const startQuestions: { label: string; href: string; jump?: string }[] = [
  { label: "Is my job going away?", href: pageHref("home"), jump: "jobs" },
  { label: "Where do I start?", href: pageHref("home"), jump: "start-here" },
  { label: "Which direction fits me?", href: pageHref("roles") },
  { label: "What do I do next?", href: pageHref("plan") },
  { label: "How do I know I'm ready?", href: pageHref("ready") },
  { label: "I want the detail", href: pageHref("library") },
];

function useDestinations(): Destination[] {
  return useMemo(() => {
    const list: Destination[] = [];
    for (const q of startQuestions) list.push({ label: q.label, group: "Questions", href: q.href, jump: q.jump });
    for (const p of pages) list.push({ label: p.title, group: "Pages", hint: p.label, href: pageHref(p.id) });
    for (const a of archetypes) list.push({ label: a.name, group: "Roles", hint: a.short, href: pageHref("roles", a.id) });
    for (const m of planFor("pde"))
      list.push({ label: `Month ${m.month}: ${m.title}`, group: "Plan · Design Engineer", hint: m.build, href: `#/plan/a/pde/m${m.month}` });
    for (const m of planFor("meta").filter((m) => m.month >= 4))
      list.push({ label: `Month ${m.month}: ${m.title}`, group: "Plan · Meta-Designer / AX", hint: m.build, href: `#/plan/a/meta/m${m.month}` });
    list.push({ label: "Beginner track (Track B)", group: "Plan", hint: "4 stages", href: "#/plan/b" });
    for (const [id, label] of [
      ["compare", "Compare roles"],
      ["skills", "Skills"],
      ["tools", "Tools"],
      ["roadmaps", "Roadmaps"],
      ["glossary", "Glossary"],
    ] as const)
      list.push({ label, group: "Library", href: pageHref("library", id) });
    for (const g of glossary)
      list.push({ label: g.term, group: "Glossary", hint: g.meaning, href: pageHref("library", "glossary", slugify(g.term)) });
    return list;
  }, []);
}

function go(d: Destination) {
  navigate(d.href);
  if (d.jump) {
    const id = d.jump;
    // Let the Start page mount before scrolling to the section.
    window.setTimeout(() => jumpTo(id), 80);
  }
}

/** Search field with a results list (ARIA combobox). Used on the Start page and inside the ⌘K dialog. */
export function FindBox({ autoFocus = false, onDone, large = false }: { autoFocus?: boolean; onDone?: () => void; large?: boolean }) {
  const all = useDestinations();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const results = useMemo(() => {
    const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return all
      .filter((d) => {
        const hay = `${d.label} ${d.group} ${d.hint ?? ""}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      })
      .slice(0, 8);
  }, [q, all]);

  const open = results.length > 0;
  const pick = (d: Destination) => {
    go(d);
    setQ("");
    onDone?.();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      pick(results[Math.min(active, results.length - 1)]);
    } else if (e.key === "Escape" && q) {
      e.preventDefault();
      e.stopPropagation();
      setQ("");
    }
  };

  return (
    <div className="relative text-left">
      <label htmlFor={inputId} className="sr-only">
        Search the guide
      </label>
      <div
        className={`flex items-center gap-3 rounded-[var(--radius-s)] border border-edge bg-card pl-4 pr-2 transition-colors focus-within:border-accent ${
          large ? "h-14" : "h-12"
        }`}
      >
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px] shrink-0 text-ink-3">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open ? `${listId}-${Math.min(active, results.length - 1)}` : undefined}
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKey}
          placeholder="Try “React”, “month 4” or “MCP”"
          className={`min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3 ${large ? "text-base" : "text-[0.9375rem]"}`}
        />
        <kbd className="hidden rounded-md border border-edge px-2 py-0.5 font-mono text-xs text-ink-3 sm:inline">⌘K</kbd>
      </div>
      <ul
        id={listId}
        role="listbox"
        aria-label="Results"
        className={`${open ? "" : "hidden"} absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-[22rem] overflow-y-auto rounded-[var(--radius-s)] border border-edge bg-card p-1.5 shadow-[var(--sh-2)]`}
      >
        {results.map((d, i) => (
          <li
            key={`${d.group}-${d.label}`}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => pick(d)}
            onMouseEnter={() => setActive(i)}
            className={`flex cursor-pointer items-baseline justify-between gap-4 rounded-[var(--radius-xs)] px-3 py-2.5 ${i === active ? "bg-sunken" : ""}`}
          >
            <span className="min-w-0">
              <span className="block truncate text-[0.9375rem] text-ink">{d.label}</span>
              {d.hint && <span className="mt-0.5 block truncate text-xs text-ink-3">{d.hint}</span>}
            </span>
            <span className="label shrink-0 text-ink-3">{d.group}</span>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {q.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
      </p>
    </div>
  );
}

/** ⌘K / Ctrl+K dialog. The shortcut needs a modifier so it never fires on plain typing (WCAG 2.1.4). */
export function FindDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group flex h-10 items-center gap-2 rounded-full border border-edge px-3 text-sm text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
      >
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="max-sm:sr-only">Search</span>
        <kbd className="hidden font-mono text-xs text-ink-3 lg:inline">⌘K</kbd>
      </button>
      <dialog
        ref={ref}
        aria-label="Search the guide"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === ref.current) setOpen(false);
        }}
        className="find-dialog m-0 mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] overflow-visible bg-transparent p-0 text-ink"
      >
        {open && (
          <div className="rounded-[var(--radius)] border border-edge bg-paper p-4 shadow-[var(--sh-2)]">
            <FindBox autoFocus large onDone={() => setOpen(false)} />
            <p className="label mt-3 px-1 text-ink-3">↑↓ to move · Enter to open · Esc to close</p>
          </div>
        )}
      </dialog>
    </>
  );
}
