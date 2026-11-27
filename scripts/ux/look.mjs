#!/usr/bin/env node
// Usability probe for persona review agents.
// Opens one route of the running dev server, optionally performs a few steps,
// then prints what a reader sees (headings, visible text, controls) and saves a screenshot.
//
// Usage:
//   node scripts/ux/look.mjs <hash-route> [--mobile] [--out <dir>] [--click "<visible text>"]... [--type "<text>"] [--key "<key>"] [--chars <n>]
// Examples:
//   node scripts/ux/look.mjs "#/" --mobile
//   node scripts/ux/look.mjs "#/plan/b" --click "Stage 2"
//   node scripts/ux/look.mjs "#/" --key "Meta+K" --type "token"
// Env: UX_BASE (default http://localhost:5173)
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const route = args.find((a) => a.startsWith("#")) ?? "#/";
const mobile = args.includes("--mobile");
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const steps = [];
for (let i = 0; i < args.length; i++) {
  if (["--click", "--type", "--key"].includes(args[i])) steps.push([args[i].slice(2), args[i + 1]]);
}
const out = opt("--out") ?? "/tmp/ux-look";
const maxChars = Number(opt("--chars") ?? 12000);
const base = process.env.UX_BASE ?? "http://localhost:5173";

mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext(mobile ? { ...devices["Pixel 7"] } : { viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

await page.goto(base + "/" + route, { waitUntil: "networkidle" });
for (const [kind, val] of steps) {
  try {
    if (kind === "click") await page.getByText(val, { exact: false }).first().click({ timeout: 4000 });
    if (kind === "type") await page.keyboard.type(val);
    if (kind === "key") await page.keyboard.press(val);
    await page.waitForTimeout(400);
    console.log(`step ok: ${kind} ${val}`);
  } catch (e) {
    console.log(`STEP FAILED: ${kind} "${val}" — ${e.message.split("\n")[0]}`);
  }
}

const info = await page.evaluate(() => {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden";
  };
  const headings = [...document.querySelectorAll("h1,h2,h3")].filter(vis).map((h) => `${h.tagName.toLowerCase()}: ${h.innerText.trim().replace(/\s+/g, " ")}`);
  const controls = [...document.querySelectorAll("a[href],button,[role=tab],input,select,summary")]
    .filter(vis)
    .map(
      (el) =>
        `${el.getAttribute("role") ?? el.tagName.toLowerCase()}: ${(el.innerText || el.getAttribute("aria-label") || el.getAttribute("placeholder") || "").trim().replace(/\s+/g, " ").slice(0, 80)}${el.getAttribute("aria-selected") === "true" || el.getAttribute("aria-current") ? " [current]" : ""}`,
    )
    .filter((s) => !s.endsWith(": "));
  const main = document.querySelector("main") ?? document.body;
  return { title: document.title, url: location.hash, height: document.documentElement.scrollHeight, headings, controls, text: main.innerText };
});

const shot = join(out, `${route.replace(/[^a-z0-9]+/gi, "_") || "home"}${mobile ? "_mobile" : ""}${steps.length ? "_steps" : ""}.png`);
await page.screenshot({ path: shot, fullPage: false });
await browser.close();

console.log(
  `TITLE: ${info.title}\nURL: ${info.url}\nVIEWPORT: ${mobile ? "Pixel 7 phone" : "1280x800 desktop"}\nPAGE HEIGHT: ${info.height}px\nSCREENSHOT (first screen): ${shot}`,
);
if (errors.length) console.log(`CONSOLE ERRORS:\n- ${errors.join("\n- ")}`);
console.log(`\nHEADINGS:\n${info.headings.join("\n")}`);
console.log(`\nCONTROLS (${info.controls.length}):\n${[...new Set(info.controls)].slice(0, 80).join("\n")}`);
console.log(`\nVISIBLE TEXT (first ${maxChars} chars):\n${info.text.slice(0, maxChars)}`);
