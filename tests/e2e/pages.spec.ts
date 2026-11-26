import { expect, fresh, revealAll, routes, test } from "./fixtures";

for (const r of routes) {
  test.describe(r.name, () => {
    test("renders with a title, one h1 and no errors", async ({ page }) => {
      await fresh(page, r.path);
      await expect(page).toHaveTitle(r.title);
      await expect(page.locator("main h1")).toHaveCount(1);
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(40);
    });

    test("never scrolls sideways", async ({ page }) => {
      await fresh(page, r.path);
      await revealAll(page);
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });

    test("crops no text and keeps rounded corners clean", async ({ page }) => {
      await fresh(page, r.path);
      await revealAll(page);
      await page.waitForTimeout(400);
      const problems = await page.evaluate(() => {
        const out: string[] = [];
        const name = (el: Element) => `${el.tagName.toLowerCase()} "${(el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40)}"`;
        const all = [...document.querySelectorAll("main *, header *, footer *")].filter((e) => e.getClientRects().length);
        for (const el of all) {
          const cs = getComputedStyle(el);
          if (cs.textOverflow === "ellipsis" || el.closest("svg")) continue;
          if (el.clientWidth <= 1 || el.clientHeight <= 1) continue; // visually hidden (sr-only)
          if (!(el.textContent || "").trim()) continue;
          // Intentional masks: a button's colour wipe waits below it, and rolling labels keep an aria-hidden duplicate below.
          const cls = el.getAttribute("class") || "";
          if (cls.includes("before:translate-y-[101%]") || el.querySelector(":scope > [aria-hidden]")) continue;
          if (el.closest("[class*='before:translate-y-[101%]']")) continue;
          const clipX = /hidden|clip/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1;
          const clipY = /hidden|clip/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2;
          if (clipX || clipY) out.push(`clipped ${clipX ? "x" : ""}${clipY ? "y" : ""}: ${name(el)}`);
        }
        for (const p of all) {
          const pcs = getComputedStyle(p);
          const pr = parseFloat(pcs.borderTopLeftRadius);
          if (!(pr > 4) || /hidden|clip/.test(pcs.overflow)) continue;
          const bw = parseFloat(pcs.borderTopWidth) || 0;
          const pb = p.getBoundingClientRect();
          for (const c of p.querySelectorAll("*")) {
            const ccs = getComputedStyle(c);
            const painted = ccs.backgroundColor !== "rgba(0, 0, 0, 0)" || ccs.backgroundImage !== "none";
            if (!painted || c.closest("svg")) continue;
            const cb = c.getBoundingClientRect();
            if (cb.width < 2 || cb.height < 2) continue; // thin accent bars count too
            const at = (x: boolean, y: boolean, r: string) => x && y && parseFloat(r) < pr - bw - 3;
            const L = Math.abs(cb.left - pb.left - bw) < 2, R = Math.abs(pb.right - bw - cb.right) < 2;
            const T = Math.abs(cb.top - pb.top - bw) < 2, B = Math.abs(pb.bottom - bw - cb.bottom) < 2;
            if (at(L, T, ccs.borderTopLeftRadius) || at(R, T, ccs.borderTopRightRadius) || at(L, B, ccs.borderBottomLeftRadius) || at(R, B, ccs.borderBottomRightRadius))
              out.push(`square corner inside rounded ${name(p)}: ${name(c)}`);
          }
        }
        return [...new Set(out)];
      });
      expect(problems).toEqual([]);
    });
  });
}

test("an unknown route shows the not-found page and noindex", async ({ page }) => {
  await page.goto("/#/nope");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("doesn't exist");
  await expect(page).toHaveTitle(/Page Not Found/);
  await expect(page.locator('meta[name="robots"][data-not-found]')).toHaveAttribute("content", "noindex, nofollow");
});

test("works with storage blocked", async ({ page }) => {
  await page.addInitScript(() => {
    const deny = () => {
      throw new Error("blocked");
    };
    Object.defineProperty(window, "localStorage", { get: deny });
    Object.defineProperty(window, "sessionStorage", { get: deny });
  });
  for (const path of ["/#/", "/#/plan/a/pde/m1", "/#/ready/a", "/#/library/glossary"]) {
    await page.goto(path);
    await expect(page.locator("main h1")).toBeVisible();
  }
});

test("library shelves line up with the page title and breadcrumb", async ({ page }) => {
  for (const shelf of ["compare", "skills", "tools", "roadmaps/ux-design", "glossary"]) {
    await page.goto(`/#/library/${shelf}`);
    const h1 = page.locator("#library-title");
    const h2 = page.locator("main h2").first();
    await expect(h2).toBeVisible();
    const [a, b] = await Promise.all([h1.boundingBox(), h2.boundingBox()]);
    expect(Math.abs((a?.x ?? 0) - (b?.x ?? 0)), shelf).toBeLessThanOrEqual(1);
  }
});
