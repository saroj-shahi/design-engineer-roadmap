// Renders a printable PDF of each plan from src/data/research.ts:
//   public/plans/track-a-design-engineer.pdf
//   public/plans/track-a-meta-designer.pdf
//   public/plans/track-b-starting-out.pdf
// Run with `npm run pdfs` after changing plan data (needs `npx playwright install chromium` once).
// The page is light, not Plum Dusk dark, so it reads and prints well on paper.
import { chromium } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { PLAN_PDFS } from "../../src/data/planPdfs.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const data = await import(pathToFileURL(path.join(root, "src/data/research.ts")).href);
const {
  aiPolicyLabel,
  beginnerContext,
  beginnerStack,
  icGrowth,
  interviewFocus,
  juniorChecklist,
  launchStages,
  leverageHabits,
  planFor,
  readinessItems,
  trackAOptions,
} = data;

const SITE = "https://design-engineer-roadmap.vercel.app/";
const SITE_HOST = SITE.replace(/^https:\/\//, "").replace(/\/$/, "");
const AUTHOR = { name: "Saroj Shahi", url: "https://sarojshahi.com" };
// The dark app icon (public/favicon.svg), used as the brand mark on the cover and in the page footer.
const MARK = (await readFile(path.join(root, "public/favicon.svg"), "utf8")).replace(/<!--[\s\S]*?-->/g, "").trim();
const mark = (size) => MARK.replace("<svg ", `<svg width="${size}" height="${size}" aria-hidden="true" `);
const pad = (n) => String(n).padStart(2, "0");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tags = (items) => `<p class="tags">${items.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</p>`;
const checks = (items) =>
  `<ol class="checks">${items.map((c) => `<li><span class="box" aria-hidden="true"></span><div><b>${esc(c.title)}</b><p>${esc(c.detail)}</p></div></li>`).join("")}</ol>`;

const field = (label, body, cls = "") => `<div class="field ${cls}"><p class="eyebrow">${esc(label)}</p>${body}</div>`;

function topics(groups) {
  return groups
    .map(
      (g) =>
        `<div class="topic"><p class="topic-head">${esc(g.source)} · ${esc(g.area)}</p><ul class="tick">${g.topics
          .map((t) => `<li><span class="box" aria-hidden="true"></span><span>${esc(t)}</span></li>`)
          .join("")}</ul></div>`,
    )
    .join("");
}

function resources(rs) {
  return `<ul class="res">${rs
    .map((r) => `<li><a href="${esc(r.url)}">${esc(r.label)}</a> <span class="cost">${esc(r.cost)}</span><br /><span class="url">${esc(r.url)}</span></li>`)
    .join("")}</ul>`;
}

/** One month or stage, kept on its own page. */
function step({ kicker, title, note, lead, fields, start, doneWhen, roadmapTopics, resources: rs }) {
  return `<section class="step">
    <header class="step-head"><span>${esc(kicker)}</span>${note ? `<span>${esc(note)}</span>` : ""}</header>
    <h2>${esc(title)}</h2>
    ${lead ? `<p class="lead">${esc(lead)}</p>` : ""}
    ${fields ? `<div class="fields">${fields}</div>` : ""}
    <div class="fields two">
      ${field("Start here", `<p>${esc(start)}</p>`)}
      ${field("Done when", `<p>${esc(doneWhen)}</p>`)}
    </div>
    ${field("Roadmap topics", `<div class="topics">${topics(roadmapTopics)}</div>`)}
    ${rs.length ? field("Resources", resources(rs)) : ""}
  </section>`;
}

function trackA(option) {
  const o = trackAOptions.find((x) => x.id === option);
  const months = planFor(option);
  const intro =
    option === "pde"
      ? "Six months, from browser basics to merged pull requests in a real product. Learn the browser before AI tools. Apply each month in your current job or in side projects — the plan uses React, TypeScript and Tailwind."
      : "Months 1–3 are the same for both Track A options: enough front-end to review AI code. Months 4–6 switch to design systems AI tools can read, and to trust flows for AI agents.";
  const overview = `<table class="overview"><thead><tr><th>Month</th><th>Step</th><th>AI use</th><th>Result</th></tr></thead><tbody>${months
    .map((m) => `<tr><td class="num">${pad(m.month)}</td><td>${esc(m.title)}</td><td>${esc(aiPolicyLabel[m.aiPolicy])}</td><td>${esc(m.build)}</td></tr>`)
    .join("")}</tbody></table>`;

  const cover = `<section class="cover">
    <header class="brand">
      <span class="brand-mark">${mark(36)}</span>
      <span class="brand-name"><b>Design Engineer</b><span>Field Guide · <em>2026</em></span></span>
      <a class="brand-url" href="${SITE}">${SITE_HOST}</a>
    </header>
    <p class="kicker">Track A · Working designer</p>
    <h1>${esc(o.name)}<br /><em>six-month plan</em></h1>
    <p class="lead">${esc(intro)}</p>
    ${field("Best for", `<p>${esc(o.for)}</p>`)}
    ${field("Stack", tags(o.stack))}
    ${field("Your plan at a glance", `<p class="small">Built on your UX &amp; Product Design base, then six months one step at a time.</p>${overview}`)}
    <p class="small muted">Interactive version, with checklists that save your progress: <a href="${SITE}#/plan/a/${option}/m1">${SITE}#/plan/a/${option}/m1</a></p>
  </section>`;

  const steps = months
    .map((m) =>
      step({
        kicker: `Month ${pad(m.month)} of ${pad(months.length)}`,
        note: aiPolicyLabel[m.aiPolicy],
        title: m.title,
        lead: m.fromCode,
        fields: [
          field("Learning focus", `<p class="focus">${esc(m.focus)}</p>`),
          field("Practical deliverable", `<p>${esc(m.deliverable)}</p>`),
          field(`Guardrail · ${aiPolicyLabel[m.aiPolicy]}`, `<p>${esc(m.guardrail)}</p>`, "guard"),
        ].join(""),
        ...m,
      }),
    )
    .join("");

  const extras = `<section class="step">
    <header class="step-head"><span>After the plan</span></header>
    <h2>Using it in your current job</h2>
    <p class="lead">Most designers build hybrid scope right where they already work, before any title changes.</p>
    ${checks(leverageHabits)}
    <h2 class="h2-gap">Show your work — at work or on the market</h2>
    <p class="lead">Useful for team demos, promotion cases or job applications.</p>
    ${checks(readinessItems)}
    <div class="callout">
      <p class="eyebrow">If you do interview</p>
      <p class="focus">${esc(interviewFocus.hybrid)}</p>
      <p class="small">Alongside the usual: ${esc(interviewFocus.traditional)}</p>
    </div>
    ${credits(`${SITE}#/plan/a/${option}/m1`)}
  </section>`;

  return { title: `Track A · ${o.name} — six-month plan`, body: cover + steps + extras };
}

function trackB() {
  const overview = `<table class="overview"><thead><tr><th>Stage</th><th>Step</th><th>Result</th></tr></thead><tbody>${launchStages
    .map((s) => `<tr><td class="num">${pad(s.n)}</td><td>${esc(s.name)}</td><td>${esc(s.output)}</td></tr>`)
    .join("")}</tbody></table>`;
  const market = `<table class="overview"><tbody>${beginnerContext
    .map((c) => `<tr><td class="num big">${esc(c.value)}</td><td>${esc(c.label)}<br /><span class="url">${esc(c.source)}</span></td></tr>`)
    .join("")}</tbody></table>`;

  const cover = `<section class="cover">
    <header class="brand">
      <span class="brand-mark">${mark(36)}</span>
      <span class="brand-name"><b>Design Engineer</b><span>Field Guide · <em>2026</em></span></span>
      <a class="brand-url" href="${SITE}">${SITE_HOST}</a>
    </header>
    <p class="kicker">Track B · Starting out</p>
    <h1>Your first role,<br /><em>four-stage plan</em></h1>
    <p class="lead">Get your first role, with code in your portfolio. Stage 1 is your UX &amp; Product Design base; then move through the other three stages in order.</p>
    ${field("Your plan at a glance", overview)}
    ${field(
      "One focused stack, in order",
      `<div class="stack">${beginnerStack
        .map((p, i) => `<div><p class="topic-head">${pad(i + 1)} — ${esc(p.phase)}</p>${tags(p.tools)}</div>`)
        .join("")}</div>`,
    )}
    <p class="small muted">Interactive version, with checklists that save your progress: <a href="${SITE}#/plan/b/s1">${SITE}#/plan/b/s1</a></p>
  </section>`;

  const steps = launchStages
    .map((s) =>
      step({
        kicker: `Stage ${pad(s.n)} of ${pad(launchStages.length)}`,
        note: s.output,
        title: s.name,
        lead: s.detail,
        ...s,
      }),
    )
    .join("");

  const extras = `<section class="step">
    <header class="step-head"><span>After the plan</span></header>
    <h2>The market you're entering</h2>
    <p class="lead">Seed-stage startups (young companies on their first funding round) have the highest design hiring rate (25%). With 300–800 applications per job post, a portfolio with something that runs helps you get noticed.</p>
    ${market}
    <h2 class="h2-gap">What reviewers check in a junior portfolio</h2>
    ${checks(juniorChecklist)}
    <h2 class="h2-gap">Your first year on the job</h2>
    ${checks(icGrowth.map((g) => ({ title: g.name, detail: g.detail })))}
    ${credits(`${SITE}#/plan/b/s1`)}
  </section>`;

  return { title: "Track B · Starting out — four-stage plan", body: cover + steps + extras };
}

/** Closing credits: who made it, where the figures come from, and where the live guide is. */
const credits = (planUrl) => `<section class="credits">
  <span class="brand-mark">${mark(28)}</span>
  <div>
    <p class="eyebrow">About this guide</p>
    <p><b>Design Engineer Field Guide · 2026</b>, created by <a href="${AUTHOR.url}">${AUTHOR.name}</a> (${AUTHOR.url.replace("https://", "")}).</p>
    <p>Figures come from “The 2026 Product Design Evolution” research brief. Roadmap topics are drawn from roadmap.sh. Full sources and method: <a href="${SITE}#/sources">${SITE_HOST}/#/sources</a></p>
    <p>Interactive plan, with ticks saved in your browser: <a href="${planUrl}">${planUrl.replace("https://", "")}</a></p>
  </div>
</section>`;

const CSS = `
  @page { size: A4; margin: 18mm 16mm 20mm; }
  :root { --ink: #1c1623; --ink-2: #3d3346; --ink-3: #6b5f76; --line: #e4dce9; --soft: #f7f2f9; --accent: #b0285c; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font: 10pt/1.5 "DM Sans", system-ui, sans-serif; color: var(--ink-2); }
  a { color: var(--accent); text-decoration: none; }
  h1, h2 { font-family: "Bricolage Grotesque", sans-serif; color: var(--ink); letter-spacing: -0.02em; text-wrap: balance; }
  h1 { font-size: 34pt; line-height: 1; margin: 6mm 0 6mm; }
  h1 em, h2 em { font-style: normal; color: var(--accent); }
  h2 { font-size: 20pt; line-height: 1.1; margin: 3mm 0 3mm; }
  .h2-gap { margin-top: 9mm; }
  p { margin: 0; text-wrap: pretty; }
  ul { margin: 0; padding-left: 4.5mm; }
  li { margin: 0.6mm 0; }
  .kicker, .eyebrow, .step-head, .topic-head, .cost, .url, .num, th { font-family: "DM Mono", monospace; }
  .brand { display: flex; align-items: center; gap: 3mm; padding-bottom: 4mm; border-bottom: 1px solid var(--line); }
  .brand-mark { display: inline-flex; flex-shrink: 0; }
  .brand-name { display: flex; flex-direction: column; line-height: 1.15; }
  .brand-name b { font-family: "Bricolage Grotesque", sans-serif; font-weight: 600; font-size: 12pt; color: var(--ink); letter-spacing: -0.01em; }
  .brand-name span { font-family: "DM Mono", monospace; font-size: 8pt; color: var(--ink-3); }
  .brand-name em { font-style: normal; color: var(--accent); }
  .brand-url { margin-left: auto; font-family: "DM Mono", monospace; font-size: 8pt; color: var(--ink-3); }
  .credits { display: grid; grid-template-columns: 9mm 1fr; gap: 4mm; margin-top: 10mm; padding-top: 5mm; border-top: 1px solid var(--ink); font-size: 8.5pt; break-inside: avoid; }
  .credits p { margin-top: 1mm; }
  .credits b { color: var(--ink); }
  .kicker { margin-top: 12mm; font-size: 9pt; color: var(--accent); text-transform: uppercase; letter-spacing: 0.06em; }
  .lead { font-size: 11.5pt; line-height: 1.5; color: var(--ink); max-width: 150mm; margin-bottom: 5mm; }
  .small { font-size: 8.5pt; }
  .muted { color: var(--ink-3); margin-top: 6mm; }
  .eyebrow { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-3); margin-bottom: 1.5mm; }
  .field { margin-top: 5mm; break-inside: avoid; }
  .fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; }
  .fields.two { grid-template-columns: 1fr 1fr; }
  .fields .field { margin-top: 3mm; }
  .focus { font-family: "Bricolage Grotesque", sans-serif; font-weight: 600; font-size: 12.5pt; line-height: 1.25; color: var(--ink); }
  .guard { border-left: 2px solid var(--accent); padding-left: 3mm; }
  .guard .eyebrow { color: var(--accent); }
  .guard p:last-child { color: var(--ink); }
  .tags { display: flex; flex-wrap: wrap; gap: 1.5mm; }
  .tag { border: 1px solid var(--line); background: var(--soft); border-radius: 99px; padding: 0.6mm 2.4mm; font-size: 8.5pt; color: var(--ink); }
  .overview { width: 100%; border-collapse: collapse; margin-top: 2mm; font-size: 9pt; }
  .overview th { text-align: left; font-size: 7.5pt; font-weight: 400; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-3); padding: 1.5mm 2mm; border-bottom: 1px solid var(--ink); }
  .overview td { padding: 2mm; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--ink); }
  .overview .num { color: var(--accent); width: 14mm; }
  .overview .big { font-family: "Bricolage Grotesque", sans-serif; font-weight: 600; font-size: 16pt; width: 34mm; white-space: nowrap; }
  .stack { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; }
  .stack .topic-head { margin-bottom: 1.5mm; }
  .step { break-before: page; }
  .step-head { display: flex; justify-content: space-between; gap: 4mm; font-size: 8pt; color: #fff; background: var(--ink); border-radius: 2mm; padding: 2mm 3.5mm; }
  .step-head span:last-child { color: #ffb3cb; }
  .step-head span:only-child { color: #fff; }
  .topics { columns: 2; column-gap: 6mm; }
  .topic { break-inside: avoid; margin-bottom: 3mm; }
  .topic-head { font-size: 8pt; color: var(--accent); margin-bottom: 0.8mm; }
  .tick { list-style: none; padding: 0; font-size: 9pt; }
  .tick li { display: grid; grid-template-columns: 4.6mm 1fr; align-items: start; margin: 1.2mm 0; break-inside: avoid; }
  .tick .box { width: 3mm; height: 3mm; margin-top: 0.7mm; border-width: 1px; }
  .res { list-style: none; padding: 0; font-size: 9.5pt; }
  .res li { margin-bottom: 1.8mm; break-inside: avoid; }
  .res a { color: var(--ink); font-weight: 600; }
  .cost { font-size: 7pt; text-transform: uppercase; color: var(--ink-3); border: 1px solid var(--line); border-radius: 99px; padding: 0 1.6mm; }
  .url { font-size: 7.5pt; color: var(--ink-3); word-break: break-all; }
  .checks { list-style: none; padding: 0; margin-top: 2mm; }
  .checks li { display: grid; grid-template-columns: 6mm 1fr; gap: 2mm; padding: 2.5mm 0; border-bottom: 1px solid var(--line); break-inside: avoid; }
  .checks b { color: var(--ink); font-weight: 600; }
  .checks p { font-size: 9pt; margin-top: 0.5mm; }
  .box { width: 3.6mm; height: 3.6mm; border: 1.2px solid var(--ink-3); border-radius: 0.8mm; margin-top: 0.8mm; }
  .callout { margin-top: 9mm; padding: 5mm 6mm; border-radius: 3mm; background: var(--soft); border: 1px solid var(--line); break-inside: avoid; }
  .callout .eyebrow { color: var(--accent); }
  .callout .small { margin-top: 2mm; }
`;

const FONTS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=DM+Mono:wght@400;500&display=swap";

const docs = { "a-pde": () => trackA("pde"), "a-meta": () => trackA("meta"), b: trackB };

await mkdir(path.join(root, "public/plans"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();

for (const pdf of PLAN_PDFS) {
  const { title, body } = docs[pdf.id]();
  await page.setContent(
    `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>${esc(title)} | Design Engineer Field Guide</title>
     <link rel="stylesheet" href="${FONTS}" /><style>${CSS}</style></head><body>${body}</body></html>`,
    { waitUntil: "networkidle" },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(root, "public", pdf.file),
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    // Header/footer templates can't load web fonts, so they use the system monospace.
    footerTemplate: `<div style="width:100%;padding:0 16mm;display:flex;align-items:center;gap:6px;white-space:nowrap;font:7pt Menlo,'SF Mono',Consolas,monospace;color:#6b5f76;-webkit-print-color-adjust:exact">
      ${mark(11)}<span>Design Engineer Field Guide · 2026</span><span>·</span><span>${SITE_HOST}</span>
      <span style="margin-left:auto"><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    tagged: true,
    outline: true,
  });
  console.log(`Rendered public/${pdf.file}`);
}

await browser.close();
