// Renders the social preview and app icons from their sources:
//   scripts/og/og-image.html -> public/og-image.png (1200×630)
//   public/favicon.svg       -> public/apple-touch-icon.png (180), icon-192.png, icon-512.png,
//                               icon-maskable-512.png, favicon.ico (16 + 32)
// Run with `npm run icons` (needs `npx playwright install chromium` once).
import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pub = (f) => path.join(root, "public", f);
const BG = "#1c1623";

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

// 1. Open Graph / Twitter card
await page.setViewportSize({ width: 1200, height: 630 });
await page.goto("file://" + path.join(root, "scripts/og/og-image.html"));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: pub("og-image.png"), clip: { x: 0, y: 0, width: 1200, height: 630 } });

// 2. Icons from the SVG mark. `pad` shrinks the mark inside a solid tile (iOS and maskable icons
//    are cropped by the OS, so they get a full-bleed background and a safe-zone margin).
const svg = await readFile(pub("favicon.svg"), "utf8");
// On a solid tile the OS draws the rounded shape, so drop the SVG's own rounded plate and its outline.
const markOnly = svg.replace(/<rect class="bg"[^>]*\/>\s*/, "").replace(/<rect class="ink" x="1\.5"[^>]*\/>\s*/, "");
async function icon(size, { pad = 0, tile = false } = {}) {
  const src = tile ? markOnly : svg;
  await page.setViewportSize({ width: size, height: size });
  const inner = size - pad * 2;
  await page.setContent(
    `<html><body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:${tile ? BG : "transparent"}">
       <div style="width:${inner}px;height:${inner}px">${src.replace("<svg ", `<svg width="${inner}" height="${inner}" `)}</div>
     </body></html>`,
  );
  return page.screenshot({ omitBackground: !tile, clip: { x: 0, y: 0, width: size, height: size } });
}

await writeFile(pub("apple-touch-icon.png"), await icon(180, { pad: 22, tile: true }));
await writeFile(pub("icon-192.png"), await icon(192));
await writeFile(pub("icon-512.png"), await icon(512));
await writeFile(pub("icon-maskable-512.png"), await icon(512, { pad: 96, tile: true }));

// 3. favicon.ico: an ICO container holding PNG frames at 16 and 32 px.
const frames = [await icon(16), await icon(32)];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = 6 + 16 * frames.length;
const entries = frames.map((png, i) => {
  const size = [16, 32][i];
  const e = Buffer.alloc(16);
  e.writeUInt8(size, 0);
  e.writeUInt8(size, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
await writeFile(pub("favicon.ico"), Buffer.concat([header, ...entries, ...frames]));

await browser.close();
console.log("Rendered og-image.png, apple-touch-icon.png, icon-192/512, icon-maskable-512 and favicon.ico");
