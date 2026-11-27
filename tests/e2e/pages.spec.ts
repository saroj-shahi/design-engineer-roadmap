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
      // Compare with the device viewport, not innerWidth: on phones a too-wide element widens the
      // layout viewport itself (the page zooms out), which would hide the overflow from innerWidth.
      const device = page.viewportSize()!.width;
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(innerWidth, "layout viewport should match the device width").toBe(device);
      expect(scrollWidth).toBeLessThanOrEqual(device);
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

    test("links to each destination once in the page body", async ({ page }) => {
      await fresh(page, r.path);
      // Navigation (breadcrumbs, shelves, the plan map, the page directory, NextPage) and glossary cross-references don't count (DESIGN.md §4a).
      const repeated = await page.evaluate(() => {
        const seen = new Map<string, number>();
        for (const a of document.querySelectorAll<HTMLAnchorElement>("main a[href]")) {
          if (!a.getClientRects().length || a.closest("[data-nav], [data-xref]")) continue;
          const href = a.getAttribute("href")!;
          seen.set(href, (seen.get(href) ?? 0) + 1);
        }
        return [...seen].filter(([, n]) => n > 1).map(([h, n]) => `${h} ×${n}`);
      });
      expect(repeated).toEqual([]);
    });

    test("gives every control a 44px tap area on phones", async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "mobile", "touch targets are checked on the phone project");
      await fresh(page, r.path);
      await revealAll(page);
      // Probe the real hit area with elementFromPoint, so the `hit` utility's ::after counts and covered edges don't.
      // Links inside running text are exempt (WCAG 2.5.8 inline exception).
      const small = await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        const sel = "a[href], button, [role=tab], summary, label, input:not([type=checkbox]):not([type=radio]):not([type=hidden])";
        const out: string[] = [];
        for (const el of document.querySelectorAll<HTMLElement>(sel)) {
          const box = el.getBoundingClientRect();
          if (!box.width || !box.height || el.matches(":disabled") || el.closest("[aria-hidden=true], [inert], .sr-only")) continue;
          if (el instanceof HTMLLabelElement && (el.querySelector("a, button") || (el.control && !["checkbox", "radio"].includes((el.control as HTMLInputElement).type)))) continue;
          if (el.matches("a") && getComputedStyle(el).display === "inline") {
            let block = el.parentElement;
            while (block && getComputedStyle(block).display.startsWith("inline")) block = block.parentElement;
            if (block && (block.textContent || "").trim().length > (el.textContent || "").trim().length + 2) continue;
          }
          el.scrollIntoView({ block: "center", inline: "center" });
          const r = el.getBoundingClientRect();
          const owns = (x: number, y: number) => {
            const hit = document.elementFromPoint(x, y);
            return !!hit && (el.contains(hit) || (el instanceof HTMLLabelElement && hit.closest("label") === el));
          };
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          if (!owns(cx, cy)) continue; // centre covered (e.g. by the sticky bar); measured on another route
          let top = cy, bottom = cy, left = cx, right = cx;
          while (top > r.top - 30 && owns(cx, top - 1)) top--;
          while (bottom < r.bottom + 30 && owns(cx, bottom + 1)) bottom++;
          while (left > r.left - 30 && owns(left - 1, cy)) left--;
          while (right < r.right + 30 && owns(right + 1, cy)) right++;
          const w = Math.round(right - left + 1), h = Math.round(bottom - top + 1);
          if (w < 44 || h < 44) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40)}" ${w}×${h}`);
        }
        return [...new Set(out)];
      });
      expect(small).toEqual([]);
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

test("social image and app icons are served at the right sizes", async ({ page, request }) => {
  await page.goto("/#/");
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(og).toMatch(/\/og-image\.png/);
  const png = (await (await request.get(new URL(og!).pathname)).body());
  // PNG header: width and height are big-endian at bytes 16 and 20.
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  for (const [file, size] of [["/apple-touch-icon.png", 180], ["/icon-192.png", 192], ["/icon-512.png", 512], ["/icon-maskable-512.png", 512]] as const) {
    const b = await (await request.get(file)).body();
    expect([b.readUInt32BE(16), b.readUInt32BE(20)], file).toEqual([size, size]);
  }
  const ico = await (await request.get("/favicon.ico")).body();
  expect(ico.readUInt16LE(4), "favicon.ico frames").toBe(2);
  const manifest = await (await request.get("/site.webmanifest")).json();
  expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === "maskable")).toBe(true);
});
