import AxeBuilder from "@axe-core/playwright";
import { expect, fresh, revealAll, routes, test } from "./fixtures";

/** WCAG 2.2 A/AA scan of every route, with all scroll reveals finished. */
for (const r of routes) {
  test(`${r.name} has no WCAG A/AA violations`, async ({ page }) => {
    await fresh(page, r.path);
    await revealAll(page);
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const summary = results.violations.map(
      (v) =>
        `${v.id} (${v.impact}): ${v.nodes.length}× — ${v.nodes
          .slice(0, 3)
          .map((n) => n.target.join(" "))
          .join(" | ")}`,
    );
    expect(summary).toEqual([]);
  });
}

test("every visible control shows a pointer cursor", async ({ page }) => {
  for (const path of ["/#/", "/#/roles/de", "/#/plan/a/pde/m1", "/#/ready/a", "/#/library/glossary"]) {
    await fresh(page, path);
    const bad = await page.evaluate(() =>
      [...document.querySelectorAll("a[href], button:not(:disabled), summary, [role=tab], [role=button]")]
        .filter((e) => e.getClientRects().length && getComputedStyle(e).cursor !== "pointer")
        .map((e) => `${e.tagName} "${(e.textContent || "").trim().slice(0, 30)}"`),
    );
    expect(bad, path).toEqual([]);
  }
});

test("keyboard focus is always visible", async ({ page, browserName }, info) => {
  test.skip(info.project.name === "mobile", "keyboard focus is a desktop concern");
  void browserName;
  await fresh(page, "/#/roles/de");
  const missing: string[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const ring = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
      const shadow = cs.boxShadow !== "none";
      return { ok: ring || shadow, name: `${el.tagName} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}"` };
    });
    if (r && !r.ok) missing.push(r.name);
  }
  expect(missing).toEqual([]);
});
