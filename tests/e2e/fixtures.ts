import { test as base, expect, type Page } from "@playwright/test";

/** Every route a reader can land on, with the page title it should get. */
export const routes = [
  { path: "/#/", name: "Start", title: /Design Engineer Field Guide \| 2026/ },
  { path: "/#/jobs", name: "Jobs", title: /^Is my job going away \|/ },
  { path: "/#/roles/de", name: "Roles · Design Engineer", title: /^Design Engineer \|/ },
  { path: "/#/roles/meta", name: "Roles · Meta-Designer", title: /^Meta-Designer/ },
  { path: "/#/roles/ax", name: "Roles · AX Designer", title: /^Agentic Experience/ },
  { path: "/#/plan/a/pde/m1", name: "Plan · Track A month 1", title: /^Month 1 · Track A/ },
  { path: "/#/plan/a/meta/m4", name: "Plan · Meta month 4", title: /^Month 4 · Track A/ },
  { path: "/#/plan/b/s1", name: "Plan · Track B stage 1", title: /^Stage 1 · Track B/ },
  { path: "/#/ready/a", name: "Checklist · Track A", title: /^Track A — Readiness checklist/ },
  { path: "/#/ready/b", name: "Checklist · Track B", title: /^Track B — Readiness checklist/ },
  { path: "/#/library/compare", name: "Library · Compare", title: /^Design vs\. Design \+ Code/ },
  { path: "/#/library/skills", name: "Library · Skills", title: /^Skills \|/ },
  { path: "/#/library/tools", name: "Library · Tools", title: /^Tools \|/ },
  { path: "/#/library/roadmaps", name: "Library · Roadmaps", title: /Roadmaps? \|/ },
  { path: "/#/library/roadmaps/frontend", name: "Library · Frontend roadmap", title: /^Frontend Roadmap/ },
  { path: "/#/library/glossary", name: "Library · Glossary", title: /^Glossary/ },
  { path: "/#/sources", name: "Sources", title: /^Sources and method/ },
] as const;

/** Fails the test on any uncaught page error or console error, so regressions can't hide. */
export const test = base.extend<{ errors: string[] }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(`console: ${m.text()}`);
      });
      await use(errors);
      expect(errors, "page should log no errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Start every test from a clean slate: no saved ticks, track or plan route. */
export async function fresh(page: Page, path: string) {
  await page.addInitScript(() => {
    try {
      if (!sessionStorage.getItem("__e2e_cleared")) {
        localStorage.clear();
        sessionStorage.setItem("__e2e_cleared", "1");
      }
    } catch {
      /* storage blocked */
    }
  });
  await page.goto(path);
  await expect(page.locator("main h1").first()).toBeVisible();
}

/** Mark every scroll-reveal element as revealed so measurements see the final layout. */
export async function revealAll(page: Page) {
  await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in")));
}
