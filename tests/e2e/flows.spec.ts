import { expect, fresh, test } from "./fixtures";

test.describe("navigation", () => {
  test("top nav reaches every page and marks the current one", async ({ page }) => {
    await fresh(page, "/#/");
    const nav = page.getByRole("navigation", { name: "Pages" });
    for (const [label, url] of [
      ["Roles", /#\/roles/],
      ["Plan", /#\/plan/],
      ["Checklist", /#\/ready/],
      ["Library", /#\/library/],
      ["Start", /#\/$/],
    ] as const) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(url);
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
      await expect(page.locator("main h1")).toBeVisible();
    }
  });

  test("back and forward move between pages", async ({ page }) => {
    await fresh(page, "/#/");
    await page.getByRole("navigation", { name: "Pages" }).getByRole("link", { name: "Roles", exact: true }).click();
    await expect(page).toHaveURL(/#\/roles/);
    await page.goBack();
    await expect(page).toHaveURL(/#\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/#\/roles/);
  });

  test("skip link moves focus to the main content", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "keyboard only");
    await fresh(page, "/#/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });
});

test.describe("sources", () => {
  test("the footer links to the Sources page, which lists sources and works cited", async ({ page }) => {
    await fresh(page, "/#/roles/de");
    await page.getByRole("contentinfo").getByRole("link", { name: /Sources and method/ }).click();
    await expect(page).toHaveURL(/#\/sources$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sources");
    await expect(page.getByRole("heading", { name: "Sources cited in the research brief" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Works cited" })).toBeVisible();
    expect(await page.locator("main a[target=_blank]").count()).toBeGreaterThan(5);
  });

  test("Sources stays out of the top nav but is in search", async ({ page }) => {
    await fresh(page, "/#/");
    await expect(page.getByRole("navigation", { name: "Pages" }).getByRole("link", { name: "Sources" })).toHaveCount(0);
    const box = page.locator("main").getByRole("combobox", { name: "Search the guide" });
    await box.fill("sources and method");
    await box.press("Enter");
    await expect(page).toHaveURL(/#\/sources$/);
  });
});

test.describe("search", () => {
  test("the Start page field finds a plan month and opens it", async ({ page }) => {
    await fresh(page, "/#/");
    const box = page.locator("main").getByRole("combobox", { name: "Search the guide" });
    await box.fill("month 4");
    await expect(page.locator("main").getByRole("option").first()).toContainText("Month 4");
    await box.press("Enter");
    await expect(page).toHaveURL(/#\/plan\/a\/pde\/m4/);
  });

  test("⌘K / Ctrl+K opens search anywhere and Escape closes it", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "keyboard shortcut");
    await fresh(page, "/#/library/compare");
    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "Search the guide" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("combobox")).toBeFocused();
    await page.keyboard.type("glossary");
    await expect(dialog.getByRole("option").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("the Search button opens the dialog and a result navigates", async ({ page }) => {
    await fresh(page, "/#/");
    await page.getByRole("button", { name: /Search/ }).first().click();
    const dialog = page.getByRole("dialog", { name: "Search the guide" });
    await dialog.getByRole("combobox").fill("AX Designer");
    await dialog.getByRole("option").first().click();
    await expect(page).toHaveURL(/#\/roles\/ax/);
    await expect(dialog).toBeHidden();
  });
});

test.describe("start page", () => {
  test("question chips jump to their chapter or open their page", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "chips are hidden on phones; the nav and cards carry the same questions");
    await fresh(page, "/#/");
    await page.getByRole("button", { name: "Where do I start?" }).click();
    await expect(page.locator("#start-here")).toBeInViewport();
    await page.getByRole("list", { name: "Common questions" }).getByRole("link", { name: "Is my job going away?" }).click();
    await expect(page).toHaveURL(/#\/jobs$/);
    await expect(page.locator("main h1")).toContainText("Is my job");
  });

  test("chapter rail follows the reader on desktop", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "rail is desktop only");
    await fresh(page, "/#/");
    const rail = page.getByRole("navigation", { name: "Chapters" });
    await rail.getByRole("button", { name: /What's inside/ }).click();
    await expect(rail.getByRole("button", { name: /What's inside/ })).toHaveAttribute("aria-current", "true");
  });

  test("before/now stage toggles", async ({ page }) => {
    await fresh(page, "/#/");
    const before = page.getByRole("button", { name: "Before", exact: true });
    await before.click();
    await expect(before).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Now", exact: true }).click();
    await expect(page.getByRole("button", { name: "Now", exact: true })).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("roles", () => {
  test("picking a role updates the URL and the detail", async ({ page }) => {
    await fresh(page, "/#/roles/de");
    await page.getByRole("tab", { name: /\(?AX\)? Designer/ }).click();
    await expect(page).toHaveURL(/#\/roles\/ax/);
    await expect(page.getByRole("tabpanel")).toContainText("Agentic Experience (AX) Designer");
    await expect(page.getByRole("tabpanel").getByRole("link", { name: /See the plan for this role/ })).toBeVisible();
  });

  test("arrow keys move between roles", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "keyboard only");
    await fresh(page, "/#/roles/de");
    await page.getByRole("tab", { name: /Design Engineer/ }).first().focus();
    await page.keyboard.press("ArrowDown");
    await expect(page).toHaveURL(/#\/roles\/meta/);
  });

  test("overlap map and case studies are open, not hidden", async ({ page }) => {
    await fresh(page, "/#/roles/de");
    await expect(page.getByRole("heading", { name: /How the three roles overlap/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Teams that closed the gap/ })).toBeVisible();
  });

  test("the jobs page keeps every market figure in the open", async ({ page }) => {
    await fresh(page, "/#/jobs");
    await expect(page.getByRole("heading", { name: "Every market figure, with scope and source" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Every market figure (scrolls sideways)" })).toBeVisible();
  });
});

test.describe("checklist", () => {
  test("ticks are saved across reloads", async ({ page }) => {
    await fresh(page, "/#/ready/a");
    const first = page.getByRole("checkbox").first();
    await first.check({ force: true });
    await expect(first).toBeChecked();
    await page.reload();
    await expect(page.getByRole("checkbox").first()).toBeChecked();
  });

  test("switching track changes the list and the URL", async ({ page }) => {
    await fresh(page, "/#/ready/a");
    await page.getByRole("tab", { name: "Starting out" }).click();
    await expect(page).toHaveURL(/#\/ready\/b/);
    await expect(page.getByText("Clear context and scope up front")).toBeVisible();
  });
});

test.describe("plan", () => {
  test("next step moves to the following month", async ({ page }) => {
    await fresh(page, "/#/plan/a/pde/m1");
    await page.getByRole("button", { name: /^Next/ }).first().click();
    await expect(page).toHaveURL(/#\/plan\/a\/pde\/m2/);
  });

  test("each plan downloads as a PDF", async ({ page }) => {
    await fresh(page, "/#/plan/b/s1");
    const links = page.locator("a[download]");
    await expect(links).toHaveCount(3);
    for (const name of [/Design Engineer/, /Meta-Designer/, /Starting out/]) {
      const link = page.getByRole("link", { name: new RegExp(`Download .*${name.source}`) });
      const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
      expect(download.suggestedFilename()).toMatch(/\.pdf$/);
      const res = await page.request.get((await link.getAttribute("href"))!);
      expect(res.headers()["content-type"]).toContain("application/pdf");
      expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
    }
  });
});

test.describe("glossary", () => {
  test("filters by text and by topic, and cross-links open the term", async ({ page }) => {
    await fresh(page, "/#/library/glossary");
    const count = page.getByText(/^\d+ terms?$/);
    const total = Number((await count.textContent())?.split(" ")[0]);
    expect(total).toBeGreaterThan(100);

    await page.getByLabel("Filter terms").fill("contrast");
    await expect.poll(async () => Number((await count.textContent())?.split(" ")[0])).toBeLessThan(total);
    await page.getByLabel("Filter terms").fill("");

    const topics = page.getByRole("group", { name: "Show terms by topic" });
    const second = topics.getByRole("button").nth(1);
    await second.click();
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect.poll(async () => Number((await count.textContent())?.split(" ")[0])).toBeLessThan(total);

    await topics.getByRole("button", { name: "All" }).click();
    const see = page.locator("dd", { hasText: /^See / }).first().getByRole("link").first();
    const target = (await see.textContent())!.trim();
    await see.click();
    const slug = target.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    await expect(page).toHaveURL(new RegExp(`#/library/glossary/${slug}$`));
    await expect(page.locator(`#term-${slug}`)).toBeInViewport();
  });
});
