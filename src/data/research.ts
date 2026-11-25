/**
 * Structured research data.
 * Single source of truth: "The 2026 Product Design Evolution" research brief.
 * Every figure here maps to a line in that document. Do not add numbers that
 * are not in the source; edit here and the UI updates everywhere.
 */

/* ───────────── Types ───────────── */

export type BasisKind = "survey" | "analytics" | "projection" | "case";

export interface Metric {
  value: string;
  label: string;
  scope: string;
  source: string;
  basis: BasisKind;
}

export interface Archetype {
  id: ArchetypeId;
  name: string;
  short: string;
  focus: string;
  deliverable: string;
  signals: string;
  skills: string[];
  skillStats?: { label: string; value: number }[];
  /** Titles job posts use for this kind of work. The role names above are this guide's own. */
  aka: string[];
  /** Plain "this fits you if…" line, and which Track A option its plan uses. */
  fitsIf: string;
  plan: "pde" | "meta";
}

export interface CompareRow {
  dimension: string;
  traditional: string;
  hybrid: string;
}

export interface Skill {
  name: string;
  detail: string;
  tags?: string[];
}

export interface Protocol {
  id: string;
  name: string;
  owner: string;
  role: string;
  ux: string;
}

export interface PatternCategory {
  id: string;
  name: string;
  objective: string;
  patterns: string[];
}

export interface ToolStage {
  id: number;
  name: string;
  tools: string[];
  capabilities: string;
  guardrail: string;
}

export interface RoleStack {
  id: string;
  label: string;
  chain: string[];
  summary: string;
  stages: number[];
  /** Tools from the chain that sit in each stage, for highlighting. */
  toolsByStage: Record<number, string[]>;
}

/** A free or paid place to learn a step's skills. Links are checked by hand; recheck before release. */
export interface Resource {
  label: string;
  url: string;
  cost: "free" | "paid";
}

export interface Month {
  month: number;
  /** Short name for the roadmap map. */
  title: string;
  /** Topics from `focus`, one per map leaf. */
  learn: string[];
  /** Short form of `deliverable` for the map. */
  build: string;
  focus: string;
  deliverable: string;
  guardrail: string;
  aiPolicy: "none" | "read" | "assist" | "oversee" | "production" | "position";
  /** A concrete first task for the month. */
  start: string;
  /** How to tell you're ready to move on. */
  doneWhen: string;
  resources: Resource[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
}

/* ───────────── §1 Macro market ───────────── */

const designHiringBigTech: Metric = {
  value: "−48%",
  label: "Design hiring at 12 big tech companies, compared with 2019",
  scope: "12 big tech companies, June 2026",
  source: "SignalFire, State of Talent 2026",
  basis: "analytics",
};

const designerJobsOutlook: Metric = {
  value: "+6%",
  label: "US web and interface designers, 132,700 → 140,800",
  scope: "2025 → 2035, SOC 15-1255",
  source: "US BLS projection",
  basis: "projection",
};

export const heroMetrics: Metric[] = [
  designHiringBigTech,
  {
    value: "55%",
    label: "Share of big tech hires who are software engineers (46% in 2019)",
    scope: "Big tech companies, 2026",
    source: "SignalFire, State of Talent 2026",
    basis: "analytics",
  },
  {
    value: "50%",
    label: "Designers who ship AI-written code to real products",
    scope: "Q1 2026 survey",
    source: "Designer Fund / Foundation Capital",
    basis: "survey",
  },
  designerJobsOutlook,
];

const usJobPostsMetric: Metric = {
  value: "3,423 vs. 20,726",
  label: "US job posts: Design Engineer vs. Product Designer",
  scope: "US job posts, Oct 2026 (+15% month on month, with AI product design roles)",
  source: "Academy UX (aggregator)",
  basis: "analytics",
};

const seniorDeShareMetric: Metric = {
  value: "97%",
  label: "Design Engineer roles that ask for senior level (open 57 days on average)",
  scope: "European job posts, July 2026",
  source: "Hymera",
  basis: "analytics",
};

export const marketMetrics: Metric[] = [
  designHiringBigTech,
  { value: "−22%", label: "Design hiring at early-stage startups, compared with 2019", scope: "Startup group, June 2026", source: "SignalFire", basis: "analytics" },
  { value: "−39%", label: "Product manager hiring at big tech", scope: "Big tech, compared with 2019", source: "SignalFire", basis: "analytics" },
  { value: "−36%", label: "Marketing hiring at big tech", scope: "Big tech, compared with 2019", source: "SignalFire", basis: "analytics" },
  { value: "−11% / +7%", label: "Software engineer hiring: big tech / startups", scope: "Compared with 2019", source: "SignalFire", basis: "analytics" },
  { value: "−65% / −76%", label: "Entry-level hiring: big tech / startups", scope: "All of tech, June 2026", source: "SignalFire", basis: "analytics" },
  { value: "−25%", label: "Front-end share of engineering hiring, compared with 2022", scope: "Engineering roles, June 2026", source: "SignalFire", basis: "analytics" },
  { value: "12.6–13%", label: "Designers who leave their job each year (about 9% for engineers)", scope: "2026", source: "SignalFire", basis: "analytics" },
  usJobPostsMetric,
  seniorDeShareMetric,
  designerJobsOutlook,
];

/** What the job-post numbers mean for a working designer. Figures from `marketMetrics`. */
const [dePosts, pdPosts] = usJobPostsMetric.value.split(" vs. ");

export const titleReality = `Design Engineer is still a small, senior title: about ${dePosts} US job posts against ${pdPosts} for Product Designer, and ${seniorDeShareMetric.value} of European listings ask for senior level. For most designers, the first step is hybrid work in the job they already have, not a new title.`;

/** Structured hiring-shift series derived directly from `marketMetrics`, sorted high to low. */
export interface HiringShiftRow {
  label: string;
  value: number;
  display: string;
  source: string;
  focal?: boolean;
}

export const hiringShiftSeries: HiringShiftRow[] = [
  { label: "Software eng., startups", value: 7, display: "+7%", source: "SignalFire vs. 2019" },
  { label: "Web & interface design (2025–35)", value: 6, display: "+6%", source: "US BLS projection" },
  { label: "Software eng., big tech", value: -11, display: "−11%", source: "SignalFire vs. 2019" },
  { label: "Design, early-stage startups", value: -22, display: "−22%", source: "SignalFire vs. 2019" },
  { label: "Front-end share of eng. hiring", value: -25, display: "−25%", source: "SignalFire vs. 2022" },
  { label: "Marketing, big tech", value: -36, display: "−36%", source: "SignalFire vs. 2019" },
  { label: "Product manager, big tech", value: -39, display: "−39%", source: "SignalFire vs. 2019" },
  { label: "Design, big tech", value: -48, display: "−48%", source: "SignalFire vs. 2019", focal: true },
];

export const orgFlattening = [
  { value: "12", label: "Engineers per engineering manager at big tech", delta: "+14% vs. 2019" },
  { value: "15", label: "Engineers per engineering manager at startups", delta: "+34% vs. 2019" },
  { value: "+22%", label: "More engineers per product manager", delta: "vs. 2019" },
];

export const handoffCases = [
  {
    org: "Prelude",
    what: "Onboarding software company. Designers started working directly in code.",
    stats: [
      { from: "31 days", to: "13 days", label: "Average time to ship a feature" },
      { from: "5+", to: "1", label: "Handoff rounds per feature" },
    ],
  },
  {
    org: "Alan",
    what: "French health insurer. Non-engineers ship code with help from an engineering setup team.",
    stats: [{ from: "", to: "283", label: "Code changes (PRs) shipped by non-engineers (to Nov 2025)" }],
  },
];

export const adoptionShift = {
  before: {
    label: "Figma 2025 AI report",
    rows: [
      { who: "Developers who ask AI to write code", value: 68 },
      { who: "Developers who use AI for core work", value: 59 },
      { who: "Designers who use AI for core work", value: 31 },
      { who: "Designers who use AI for first UI drafts", value: 22 },
    ],
  },
  after: {
    label: "Q1 2026 (Designer Fund / Foundation Capital)",
    rows: [
      { who: "Designers who ship AI-written code to real products", value: 50 },
      { who: "…of whom use the “Design Engineer” title", value: 20 },
      { who: "Teams where PMs or engineers now create UI", value: 40 },
    ],
  },
};

/* ───────────── §2 Archetypes ───────────── */

export const archetypes: Archetype[] = [
  {
    id: "de",
    name: "Design Engineer",
    short: "Ships the code",
    focus: "Product or brand and web work",
    aka: ["Design Engineer", "UX Engineer", "Design Technologist", "Front-end Designer"],
    fitsIf: "you care about the last 10% of polish, already play with code, and want to own what ships.",
    plan: "pde",
    deliverable:
      "Code changes merged into the real product. You own the UI components, design tokens, screen sizes and visual quality in the code itself.",
    signals: "In high demand at Vercel, Cursor, Replit, Linear, Lovable, Raycast and Profound.",
    skills: ["Visual craft & taste", "React", "TypeScript", "Git workflows", "Live code portfolio"],
    skillStats: [
      { label: "Visual craft / taste", value: 79 },
      { label: "React", value: 46 },
      { label: "Live code portfolio", value: 46 },
      { label: "TypeScript", value: 42 },
    ],
  },
  {
    id: "meta",
    name: "Meta-Designer / Systems Architect",
    short: "Sets the rules",
    focus: "Design systems and rules",
    aka: ["Design Systems Designer", "Design Systems Engineer", "Design Ops"],
    fitsIf: "you think in systems, enjoy tokens and rules, and want to shape what other people (and AI) build with.",
    plan: "meta",
    deliverable:
      "A design system that works across many products. You set up Figma so AI tools can read it, limit how components can be used, and write rules AI must follow.",
    signals:
      "Needed where one designer supports 15 to 20 engineers. In product-led companies, it is 1 designer to 2 to 9 engineers.",
    skills: [
      "Designing large systems",
      "Understanding business rules",
      "Naming and structuring design tokens",
      "Rules for UI made by non-designers",
    ],
  },
  {
    id: "ax",
    name: "Agentic Experience (AX) Designer",
    short: "Designs the agent",
    focus: "AI product design",
    aka: ["AI Product Designer", "Conversational / AI UX Designer"],
    fitsIf: "you like AI products and research, and want to design for trust, uncertainty and handover between people and AI.",
    plan: "meta",
    deliverable:
      "Flows that start from what the user wants. Screens where people approve AI actions, see how sure the AI is, and recover when it gets things wrong.",
    signals: "Used in AI-first software, automated workflow tools and complex chat products.",
    skills: [
      "Designing for trust in AI",
      "Planning for edge cases",
      "Testing how people behave",
      "Reducing AI mistakes",
      "Sharing control between people and AI",
    ],
  },
];

/* ───────────── §3.4 Comparison ───────────── */

export const interviewFocus: CompareRow = {
  dimension: "Interview focus",
  traditional: "Portfolio walkthroughs, visual design critiques and whiteboard wireframes.",
  hybrid: "Code reviews, walkthroughs of how you built things, live AI workflow demos and talks about technical trade-offs.",
};

export const comparison: CompareRow[] = [
  {
    dimension: "What carries over",
    traditional: "Research, problem framing, visual craft, typography and judgment about what to build.",
    hybrid: "The same foundation. Code is added on top of it, not instead of it.",
  },
  {
    dimension: "Primary artifacts",
    traditional: "Research findings, personas, journey maps, wireframes and interactive Figma prototypes.",
    hybrid: "Live web apps, public GitHub repos, token systems and working production code.",
  },
  {
    dimension: "What gets tested",
    traditional: "Visual craft, UX research methods and fluency in design tools like Figma.",
    hybrid: "Code quality (HTML, CSS, JS, React), component structure, accessibility (ARIA), design tokens and AI tools.",
  },
  {
    dimension: "How fast work moves",
    traditional: "Engineers build the design in code. Speed depends on how smooth the handoff is.",
    hybrid: "You take an idea from visual design to working code, with engineers reviewing.",
  },
  interviewFocus,
];

export const basisLabel: Record<BasisKind, string> = {
  survey: "Survey",
  analytics: "Hiring data",
  projection: "Gov. forecast",
  case: "Case study",
};

/* ───────────── §5 Skills architecture ───────────── */

export const coreSkills: Skill[] = [
  {
    name: "Problem framing & business goals",
    detail: "Turn messy business problems into clear product work. Balance what different people need.",
    tags: ["Strategy"],
  },
  {
    name: "Human craft, visual taste & curation",
    detail:
      "Visual hierarchy, small interaction details, typography and judgment. These still matter when AI makes the first draft. Over 80% of designers still rely on their own judgment over AI (AI in Design Report 2026).",
    tags: ["Craft"],
  },
  {
    name: "Systems thinking & data logic",
    detail: "Understand the business rules behind the product, how data connects, and edge cases. Check your thinking with real user testing.",
    tags: ["Systems"],
  },
];

export const engineeringSkills: Skill[] = [
  {
    name: "Semantic HTML & modern CSS",
    detail: "Meaningful HTML with Flexbox and Grid for layout. The roadmap builds this by hand first, with no AI and no frameworks.",
    tags: ["HTML5", "CSS Grid", "Flexbox"],
  },
  {
    name: "DevTools inspection",
    detail: "Use the browser's Developer Tools to find and fix layout and loading problems as they happen.",
    tags: ["DevTools"],
  },
  {
    name: "JavaScript & React",
    detail: "State, clicks and other events, loading data (async/await, fetch), and React components with props, state and hooks.",
    tags: ["JS", "React"],
  },
  {
    name: "TypeScript",
    detail: "Basic types for component props and data. 42% of Design Engineer job posts ask for it.",
    tags: ["TypeScript"],
  },
  {
    name: "Tailwind CSS",
    detail: "Style with small ready-made classes. Part of the common React + TypeScript + Tailwind setup.",
    tags: ["Tailwind"],
  },
  {
    name: "ARIA accessibility",
    detail: "Build components everyone can use. Check ARIA labels, including in code changes that AI wrote.",
    tags: ["ARIA", "WCAG"],
  },
  {
    name: "Design tokens",
    detail: "Name and organize tokens so people and AI coding tools can both read them. Clean tokens lead to better AI output.",
    tags: ["Tokens", "Figma MCP"],
  },
  {
    name: "Git & pull requests",
    detail: "Branches, rebasing, merge conflicts and pull requests (PRs) in real codebases. Includes reviewing changes AI made.",
    tags: ["Git", "PRs"],
  },
];

export const axShift = {
  from: "Designing screens",
  to: "Also designing how AI behaves",
  summary:
    "Screens still matter. The work grows to include rules for trust, how much the AI can do alone, and when it must ask a person.",
};

export const agentMaturity = [
  { level: 1, label: "Not using agents", value: 21, detail: "Have not set up any AI agents." },
  { level: 2, label: "Testing", value: 68, detail: "Testing agents in safe test spaces. Nothing live yet." },
  { level: 3, label: "Live", value: 11, detail: "Agents run on their own in real products, with company rules for trust." },
];

export const axDomains: Skill[] = [
  {
    name: "Sharing control",
    detail: "An Autonomy Dial lets users choose between doing it themselves and full automation. Riskier tasks get tighter limits.",
    tags: ["Autonomy Dial"],
  },
  {
    name: "Showing what the agent is doing",
    detail: "Let people see, in real time, what the agent notices, thinks, remembers and does.",
    tags: ["Intent Preview", "Confidence Signal"],
  },
  {
    name: "Recovering from mistakes",
    detail: "Action Audits show what the agent did and give a time window to undo it. Escalation Pathways hand control to a person when the agent is unsure.",
    tags: ["Action Audit", "Escalation"],
  },
  {
    name: "Building the right level of trust",
    detail: "Teach users how far to trust an agent. Avoid fake, overly human chat. Explain the agent's choices in plain words.",
    tags: ["Explainable Rationale"],
  },
];

export const agentLayers = [
  { id: "perception", name: "Perception", surfaces: ["What the agent can see right now", "Tool badges", "Clear input limits"] },
  { id: "reasoning", name: "Reasoning", surfaces: ["Expandable “thinking” panels", "Step-by-step plan previews"] },
  { id: "memory", name: "Memory", surfaces: ["Context panels you can edit", "Saved user preferences"] },
  { id: "agency", name: "Agency", surfaces: ["Timelines: planned vs. done actions", "Intent Previews", "Confidence Signals"] },
];

export const protocols: Protocol[] = [
  {
    id: "mcp",
    name: "MCP",
    owner: "Model Context Protocol · Anthropic",
    role: "An open standard that connects AI agents to outside data, tools, APIs and files.",
    ux: "Decides which product data, design-system values and Figma tokens an agent can read and change. Figma MCP does this for Figma files.",
  },
  {
    id: "agui",
    name: "AG-UI",
    owner: "CopilotKit",
    role: "Sends live updates from an agent to the app's screen. It uses about 16 standard event types.",
    ux: "Lets the screen update live: status, tools in progress and inline agent feedback.",
  },
  {
    id: "a2a",
    name: "A2A",
    owner: "Agent-to-Agent Protocol · Google",
    role: "Lets AI agents pass tasks, context and status updates to each other.",
    ux: "Shapes how users see agents hand work to each other, and where they approve handoffs.",
  },
  {
    id: "a2ui",
    name: "A2UI",
    owner: "Agent-to-User Interface · Google",
    role: "Lets an agent ask for UI components from an approved design system and show them.",
    ux: "Agents show safe, accessible, on-brand components instead of random or unstyled HTML.",
  },
  {
    id: "llms",
    name: "llms.txt",
    owner: "& tool manifests",
    role: "Plain text files written so AI models and coding tools can read them easily.",
    ux: "Gives coding agents your design-system component docs in one standard format.",
  },
];

export const patternCategories: PatternCategory[] = [
  {
    id: "supervision",
    name: "Supervision & Control",
    objective:
      "Decide how closely people watch the agent, and hand over control cleanly. Low-risk actions that can be undone run on their own. High-risk actions wait for a person to approve.",
    patterns: ["Human-in-the-loop", "Human-on-the-loop", "Approval queues & escalation"],
  },
  {
    id: "transparency",
    name: "Transparency & Reasoning",
    objective:
      "Show the agent's steps, sources, doubts and limits. Keep it simple enough that people aren't overwhelmed.",
    patterns: ["Agent status & activity", "Confidence visualization"],
  },
  {
    id: "interaction",
    name: "Interaction & Modality",
    objective:
      "Go beyond text chat: UI the agent builds on the fly, fast voice, spaces where several agents work together, and smooth switches between modes.",
    patterns: ["Generative UI"],
  },
  {
    id: "trust",
    name: "Trust, Privacy & Compliance",
    objective:
      "Fail gently, follow privacy laws (GDPR, CCPA, AI Acts), give users fine control over their data, and keep every AI state accessible.",
    patterns: ["Error handling & recovery", "Progressive consent"],
  },
];

/* ───────────── §6 Tooling ───────────── */

export const toolStages: ToolStage[] = [
  {
    id: 1,
    name: "Visual Prototyping",
    tools: ["Claude Design", "Figma Make", "Google Stitch"],
    capabilities: "Make screens from a prompt, explore visual directions, create decks, and build clickable prototypes.",
    guardrail:
      "Treat the output as a sketch, not a final layout. Check it yourself with real content, edge cases and accessibility.",
  },
  {
    id: 2,
    name: "Moving Between Design and Code",
    tools: ["Figma MCP", "Codex (Figma integration)", "Claude Code (Figma plugin/MCP)"],
    capabilities:
      "Works both ways. Agents read Figma tokens, variables and Code Connect components, or turn code back into editable Figma layers.",
    guardrail:
      "Agents copy what they get. Messy Figma files give poor code, so keep tokens and component names clean.",
  },
  {
    id: 3,
    name: "Production UI & Code",
    tools: ["Codex", "Claude Code", "v0 (Vercel)", "Cursor"],
    capabilities: "Real code changes across many files, React components (v0), inline edits (Cursor) and GitHub pull requests.",
    guardrail:
      "You need front-end skills to review the PRs, check tests and ARIA labels, and keep the code well structured.",
  },
  {
    id: 4,
    name: "App Builders (MVPs & Demos)",
    tools: ["Replit (Agent 4 & Design Canvas)", "Lovable", "Bolt"],
    capabilities: "Quick full apps with databases, admin dashboards and proof-of-concept software.",
    guardrail:
      "Check for plain default components, missing empty and error states, weak visual hierarchy and security holes.",
  },
];

export const roleStacks: RoleStack[] = [
  {
    id: "junior",
    label: "Student / Junior",
    chain: ["Figma", "Claude Design / Figma Make / Stitch", "Cursor (basic React/CSS)"],
    summary:
      "Learn the basics in Figma. Prototype fast with Claude Design, Figma Make or Stitch. Use Cursor to learn basic front-end code.",
    stages: [1, 3],
    toolsByStage: { 1: ["Claude Design", "Figma Make", "Google Stitch"], 3: ["Cursor"] },
  },
  {
    id: "mid",
    label: "Mid-level",
    chain: ["Figma", "Figma MCP", "v0 (React UI)", "Cursor / Claude Code"],
    summary:
      "Use Figma MCP so AI tools can read your design system. Use v0 to start React components. Handle changes and PRs in Cursor, Codex or Claude Code.",
    stages: [2, 3],
    toolsByStage: { 2: ["Figma MCP"], 3: ["v0 (Vercel)", "Cursor", "Claude Code", "Codex"] },
  },
  {
    id: "senior",
    label: "Senior / Lead",
    chain: ["Figma Tokens · Variables · Code Connect", "Figma MCP", "Codex / Claude Code / v0 / Cursor"],
    summary:
      "Set up the team's system with Figma variables and Code Connect, linked through Figma MCP. Agree on shared AI code workflows. Keep Figma Make or Claude Design for early ideas.",
    stages: [1, 2, 3],
    toolsByStage: {
      1: ["Claude Design", "Figma Make"],
      2: ["Figma MCP"],
      3: ["Codex", "Claude Code", "v0 (Vercel)", "Cursor"],
    },
  },
  {
    id: "de",
    label: "Design Engineer",
    chain: ["Claude Design", "Figma Make", "v0", "Codex / Claude Code / Cursor → PRs"],
    summary:
      "Start to finish: explore in Claude Design, prototype in Figma Make, make components in v0, then ship PRs with Codex or Claude Code and Figma MCP.",
    stages: [1, 2, 3],
    toolsByStage: {
      1: ["Claude Design", "Figma Make"],
      2: ["Figma MCP"],
      3: ["v0 (Vercel)", "Codex", "Claude Code", "Cursor"],
    },
  },
];

/* ───────────── §3 Track A: practicing designers ───────────── */

export const trackAOptions = [
  {
    id: "pde",
    name: "Product Design Engineer",
    for: "Visual craft, small interaction details, component systems and owning the code.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Git", "AI code editors (Cursor, Claude Code)"],
  },
  {
    id: "meta",
    name: "Meta-Designer / AX Designer",
    for: "Systems thinking, research, business strategy and designing complex workflows.",
    stack: [
      "Design systems AI tools can read (tokens + Figma MCP)",
      "Plans for trust and recovery when agents fail",
      "Enough front-end skill to review AI code",
    ],
  },
];

export const sixMonthPlan: Month[] = [
  {
    month: 1,
    title: "Browser basics",
    learn: ["Semantic HTML", "Flexbox", "CSS Grid", "DevTools"],
    build: "3 responsive landing pages",
    focus: "HTML, CSS layout (Flexbox, Grid) and checking layouts in DevTools.",
    deliverable: "3 responsive landing pages, built from scratch with no frameworks.",
    guardrail: "No AI code and no CSS frameworks. Learn to fix layouts by hand.",
    aiPolicy: "none",
    start: "Pick a landing page you like and rebuild its layout from a blank HTML file.",
    doneWhen: "You can rebuild a layout from a screenshot and fix it at phone width without help.",
    resources: [
      { label: "MDN: Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", cost: "free" },
      { label: "Josh W. Comeau: Interactive guide to Flexbox", url: "https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/", cost: "free" },
      { label: "Josh W. Comeau: Interactive guide to CSS Grid", url: "https://www.joshwcomeau.com/css/interactive-guide-to-grid/", cost: "free" },
      { label: "Chrome DevTools docs", url: "https://developer.chrome.com/docs/devtools", cost: "free" },
    ],
  },
  {
    month: 2,
    title: "JavaScript & React",
    learn: ["DOM & events", "async/await & fetch", "Components & props", "State & hooks"],
    build: "Change an existing React app",
    focus: "Plain JavaScript (DOM, events, async/await, fetch), then React (components, props, state, hooks).",
    deliverable: "Read, find your way around and change an existing React app.",
    guardrail: "Focus on reading and changing real code, not memorizing syntax.",
    aiPolicy: "read",
    start: "Run a small open-source React app on your computer, then change one piece of text and one style.",
    doneWhen: "You can find where a piece of UI lives in the code and change how it behaves.",
    resources: [
      { label: "The Modern JavaScript Tutorial", url: "https://javascript.info/", cost: "free" },
      { label: "React docs: Learn React", url: "https://react.dev/learn", cost: "free" },
    ],
  },
  {
    month: 3,
    title: "Styling & types",
    learn: ["Tailwind CSS", "Design tokens", "TypeScript basics"],
    build: "Launch 1 small tool or web app",
    focus: "Tailwind CSS, design tokens and TypeScript basics.",
    deliverable: "Build and launch 1 small tool or live web app.",
    guardrail: "You can now spot when AI output is wrong, so use AI coding tools (Cursor, Claude Code) freely to write code faster.",
    aiPolicy: "assist",
    start: "Turn the colors, spacing and type of one month-1 page into design tokens.",
    doneWhen: "Your tool is live at a public link, and you can explain every file in it.",
    resources: [
      { label: "Tailwind CSS docs", url: "https://tailwindcss.com/docs", cost: "free" },
      { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", cost: "free" },
      { label: "React TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app/", cost: "free" },
      { label: "Design Tokens Community Group (W3C)", url: "https://www.designtokens.org/", cost: "free" },
    ],
  },
  {
    month: 4,
    title: "Building with AI",
    learn: ["Components & variants", "Tokens in code", "Empty, loading & error states", "Deploying"],
    build: "Live component library",
    focus: "Building components with AI help: variants, every state, tokens in code, and deploying.",
    deliverable: "A small component library (button, input, card, dialog) built on your tokens, with every state, live at a public link.",
    guardrail: "Set up Cursor or Claude Code. You still decide the structure and check every state the AI skips.",
    aiPolicy: "oversee",
    start: "List the components you use most in your Figma work, and build the first one with all its states.",
    doneWhen: "Each component has hover, focus, disabled, empty and error states, and works with a keyboard.",
    resources: [
      { label: "WAI-ARIA patterns for components", url: "https://www.w3.org/WAI/ARIA/apg/patterns/", cost: "free" },
      { label: "Radix Primitives docs", url: "https://www.radix-ui.com/primitives/docs/overview/introduction", cost: "free" },
      { label: "Figma: How designers can use Claude Code", url: "https://www.figma.com/resource-library/claude-code-for-designers/", cost: "free" },
      { label: "Getting started with Vercel", url: "https://vercel.com/docs/getting-started-with-vercel", cost: "free" },
    ],
  },
  {
    month: 5,
    title: "Real codebases",
    learn: ["Branches & rebasing", "Merge conflicts", "Design system in code", "Reviewing code"],
    build: "1–3 merged PRs",
    focus: "Git at work (branches, rebasing, conflicts), using the design system in code, and reviewing others' code.",
    deliverable: "Get 1–3 PRs into a real product: CSS bugs, accessibility fixes or component variants.",
    guardrail: "Pick up real front-end fixes at work, or help with open-source UI libraries.",
    aiPolicy: "production",
    start: "Ask a front-end lead which small UI bugs they'd review from you. No access at work? Filter an open-source UI library's issues by “good first issue”.",
    doneWhen: "At least one pull request is merged after a real review.",
    resources: [
      { label: "Pro Git book", url: "https://git-scm.com/book/en/v2", cost: "free" },
      { label: "GitHub Skills", url: "https://learn.github.com/skills", cost: "free" },
      { label: "Good First Issue", url: "https://goodfirstissue.dev/", cost: "free" },
      { label: "First Contributions", url: "https://github.com/firstcontributions/first-contributions", cost: "free" },
    ],
  },
  {
    month: 6,
    title: "Portfolio & applications",
    learn: ["Live-code portfolio", "Public GitHub repos", "~20 focused applications"],
    build: "Portfolio of live apps & merged PRs",
    focus: "Show yourself as a hybrid, build a portfolio of live code and apply with focus.",
    deliverable: "Rebuild your portfolio around live apps, public GitHub repos and merged PRs.",
    guardrail: "Send about 20 careful applications to teams that hire hybrids. Skip mass applying.",
    aiPolicy: "position",
    start: "Pick your two strongest projects and write a 2–3 paragraph write-up for each.",
    doneWhen: "Every item on the portfolio checklist is ticked.",
    resources: [
      { label: "Design engineering resources", url: "https://designengineering.arun.is/", cost: "free" },
    ],
  },
];

/** The Meta-Designer / AX option shares months 1–3, then turns to systems AI can read and agent trust flows. */
const metaMonths: Month[] = [
  {
    month: 4,
    title: "Systems AI can read",
    learn: ["Token naming & structure", "Figma variables", "Code Connect", "Figma MCP"],
    build: "Tokens wired from Figma to code",
    focus: "Name and structure design tokens, set up Figma variables and Code Connect, and connect them to an AI coding tool through Figma MCP.",
    deliverable: "A small design system whose tokens and components an AI coding tool can read and use correctly.",
    guardrail: "Test it: ask an AI tool to build a screen from your system, then fix the names or docs wherever it went wrong.",
    aiPolicy: "oversee",
    start: "Audit one Figma file: list every color and spacing value that isn't a variable yet.",
    doneWhen: "An AI tool builds a screen using only your tokens and components.",
    resources: [
      { label: "Figma: Guide to variables", url: "https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma", cost: "free" },
      { label: "Figma: Code Connect docs", url: "https://developers.figma.com/docs/code-connect/", cost: "free" },
      { label: "Figma: Guide to the Figma MCP server", url: "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server", cost: "free" },
      { label: "Design Tokens Community Group (W3C)", url: "https://www.designtokens.org/", cost: "free" },
    ],
  },
  {
    month: 5,
    title: "Agent trust flows",
    learn: ["Approval & escalation", "Showing confidence", "Undo & recovery", "Reviewing AI code"],
    build: "Trust flows + 1 merged PR",
    focus: "Design how an AI feature asks for approval, shows how sure it is, and recovers from mistakes. Keep reviewing AI-written UI code.",
    deliverable: "Approval, status, error and undo states for one agent feature, prototyped in code, plus one merged PR that fixes tokens or accessibility.",
    guardrail: "Start from the Human-AI pattern library in Library → Skills, and test the flows with real users.",
    aiPolicy: "production",
    start: "Pick one AI feature you use daily and map every point where it acts without asking you.",
    doneWhen: "Every risky action in your flow has an approval step, a visible status and a way to undo it.",
    resources: [
      { label: "Google PAIR: People + AI Guidebook", url: "https://pair.withgoogle.com/guidebook", cost: "free" },
      { label: "Microsoft: Guidelines for Human-AI Interaction", url: "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/", cost: "free" },
      { label: "WAI-ARIA patterns for components", url: "https://www.w3.org/WAI/ARIA/apg/patterns/", cost: "free" },
    ],
  },
  {
    month: 6,
    title: "Portfolio & applications",
    learn: ["Systems case study", "Live prototypes", "~20 focused applications"],
    build: "Portfolio of systems & trust work",
    focus: "Show yourself as a systems and AI-product hybrid, with live links behind every claim.",
    deliverable: "Rebuild your portfolio around your design system, your trust flows and any merged PRs.",
    guardrail: "Send about 20 careful applications to teams that hire hybrids. Skip mass applying.",
    aiPolicy: "position",
    start: "Write a short case study showing an AI tool using your system: what broke, what you fixed.",
    doneWhen: "Every item on the portfolio checklist is ticked.",
    resources: [
      { label: "Design engineering resources", url: "https://designengineering.arun.is/", cost: "free" },
    ],
  },
];

/** The six months for a Track A option. */
export const planFor = (option: "pde" | "meta"): Month[] =>
  option === "meta" ? [...sixMonthPlan.slice(0, 3), ...metaMonths] : sixMonthPlan;

export const aiPolicyLabel: Record<Month["aiPolicy"], string> = {
  none: "AI off",
  read: "Read first",
  assist: "AI assist",
  oversee: "AI + oversight",
  production: "Real PRs",
  position: "Go to market",
};

export const leverageHabits: ChecklistItem[] = [
  {
    id: "preprogram",
    title: "Load your design system into the team's AI tools",
    detail:
      "Connect tokens, accessibility rules and component docs to AI coding tools, through Figma MCP or shared prompts. Then PMs and engineers make UI that follows your standards.",
  },
  {
    id: "nonengpr",
    title: "Start a “non-engineer PR” habit",
    detail:
      "Agree with front-end leads to review and merge your small visual fixes: copy, spacing, hover states and tokens. This copies Alan's setup-team model.",
  },
  {
    id: "upstream",
    title: "Spend saved time on the unclear problems",
    detail:
      "Use the hours you save on routine layouts for business rules, trust in AI features and testing real user workflows.",
  },
  {
    id: "isolation",
    title: "Don't work alone",
    detail:
      "20% of designers feel isolated (up from 5% in 2025). Measure your value by clear team decisions and user results, not by the number of screens.",
  },
];

/* ───────────── §4 Track B: beginners ───────────── */

export const beginnerContext = [
  { value: "−65%", label: "Entry-level hiring at big tech", source: "SignalFire" },
  { value: "−76%", label: "Junior hiring at startups", source: "SignalFire" },
  { value: "300–800", label: "Applications per job post", source: "Personal.ink; Bootcamp (Medium)" },
  { value: "~90%", label: "Hiring managers who expect a strong junior portfolio", source: "UX Pilot, citing State of UX Hiring" },
];

export interface LaunchStage {
  n: number;
  learn: string[];
  name: string;
  detail: string;
  output: string;
  start: string;
  doneWhen: string;
  resources: Resource[];
}

export const launchStages: LaunchStage[] = [
  {
    n: 1,
    learn: ["Usability", "Accessibility (WCAG)", "Typography", "Information architecture", "Interaction patterns"],
    name: "Learn the lasting basics",
    detail:
      "Before you use AI screen tools, learn usability, accessibility (WCAG), typography, information architecture and interaction patterns. Take real products apart to see where they fail and why.",
    output: "Basics you can explain",
    start: "Pick an app you use daily and write down three places it fails a new user, and why.",
    doneWhen: "You can explain a usability or accessibility problem, and its fix, in plain words. Covered this in school or a bootcamp? Check yourself against this and move on.",
    resources: [
      { label: "NN/g: 10 usability heuristics", url: "https://www.nngroup.com/articles/ten-usability-heuristics/", cost: "free" },
      { label: "WebAIM: WCAG 2 checklist", url: "https://webaim.org/standards/wcag/checklist", cost: "free" },
      { label: "Butterick's Practical Typography", url: "https://practicaltypography.com/", cost: "free" },
      { label: "Laws of UX", url: "https://lawsofux.com/", cost: "free" },
    ],
  },
  {
    n: 2,
    learn: ["HTML & CSS", "AI prototyping tools", "Prototypes that run in a browser"],
    name: "Prototype in code",
    detail:
      "Learn HTML and CSS first, then add one AI prototyping tool (Figma Make or v0, for example). Knowing the basics is what lets you judge what the AI makes. Build prototypes that run in a browser.",
    output: "Working prototypes in a browser",
    start: "Rebuild one screen from a past case study in plain HTML and CSS, then use one AI tool to extend it.",
    doneWhen: "A prototype runs in the browser at a link you can share.",
    resources: [
      { label: "MDN: Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", cost: "free" },
      { label: "web.dev: Learn CSS", url: "https://web.dev/learn/css", cost: "free" },
      { label: "GitHub Pages quickstart", url: "https://docs.github.com/en/pages/quickstart", cost: "free" },
    ],
  },
  {
    n: 3,
    learn: ["Local businesses", "Community groups", "Open-source projects", "Small SaaS"],
    name: "Ship real work for real users",
    detail:
      "Skip made-up Spotify or Uber redesigns. Solve real problems for local businesses, community groups, open-source projects or small SaaS. Start small: one group, one problem, a handful of real users. Test it live and write down how feedback changed your mind.",
    output: "Live work with proof from real users",
    start: "Ask one local business, club or open-source project what slows them down each week.",
    doneWhen: "Real people used what you built, and you can show what changed because of their feedback.",
    resources: [
      { label: "Good First Issue", url: "https://goodfirstissue.dev/", cost: "free" },
      { label: "First Contributions", url: "https://github.com/firstcontributions/first-contributions", cost: "free" },
    ],
  },
  {
    n: 4,
    learn: ["3–4 short case studies", "Seed-stage startups", "Small agencies", "Industry B2B companies"],
    name: "Aim at the right employers",
    detail:
      "Write 3–4 short, easy-to-scan case studies. Aim them at early (seed-stage) startups, which hire the most designers relative to size (25%). Also try small agencies and industry-focused B2B companies, not only big tech junior programs.",
    output: "A portfolio aimed at where hiring happens",
    start: "Rewrite the opening of your best case study: who you are, the problem, and what you did.",
    doneWhen: "Every item on the portfolio checklist is ticked.",
    resources: [
      { label: "Design engineering resources", url: "https://designengineering.arun.is/", cost: "free" },
    ],
  },
];

export const beginnerStack = [
  { phase: "Explore", tools: ["Figma", "Claude Design", "Figma Make", "Google Stitch"] },
  { phase: "Build", tools: ["HTML5 & CSS3", "React", "Tailwind CSS"] },
  { phase: "Execute", tools: ["Cursor"] },
];

export const juniorChecklist: ChecklistItem[] = [
  {
    id: "context",
    title: "Clear context and scope up front",
    detail: "Say who you are, the exact problem and what you did, before any visuals. Mark personal and school work as practice projects.",
  },
  {
    id: "changed",
    title: "Show how your thinking changed",
    detail: "Share raw findings, ideas you dropped and test results that made you change course. Show the messy path honestly.",
  },
  {
    id: "functional",
    title: "Working proof",
    detail: "Link to live apps (Vercel, Lovable, React builds) or videos that show real interactions.",
  },
  {
    id: "friction",
    title: "Easy to open, tightly focused",
    detail: "No passwords, broken links or clutter. Keep a small toolset: Figma plus Claude Design, Figma Make or Stitch to explore; React, Tailwind and Cursor to build.",
  },
];

export const icGrowth = [
  {
    name: "Deliver reliably",
    detail: "Ship good, accessible components on time, without seniors stepping in or asking for the same visual fixes.",
  },
  {
    name: "Talk easily across teams",
    detail: "Reach out to front-end engineers and PMs early. Ask for technical reviews soon. Treat code reviews as a way to learn.",
  },
  {
    name: "Work on your own when things are unclear",
    detail: "Move from small, clear UI tasks to whole features: research, edge cases, accessibility checks and launch.",
  },
];

/* ───────────── Self-assessment ───────────── */

export const readinessItems: ChecklistItem[] = [
  { id: "demo", title: "A live demo that works in 10 seconds", detail: "A link a reviewer can open and use right away." },
  { id: "repo", title: "A public GitHub repository", detail: "Clear components, state, CSS structure and ARIA labels." },
  { id: "writeup", title: "A 2–3 paragraph design and code write-up", detail: "What you wanted, your decisions, trade-offs and next steps." },
  { id: "ai", title: "Proof of an AI-assisted workflow", detail: "Show you guided Cursor or Claude Code to ship real features." },
  { id: "access", title: "Easy to open", detail: "No password walls, no broken links, no clutter." },
  { id: "scope", title: "Honest about your role", detail: "Say exactly what you did. Label made-up projects clearly." },
  { id: "deployed", title: "A live project you built and launched", detail: "Components with every state and layouts that fit any screen, live on Vercel or similar. Month 4 of the plan." },
  { id: "merged", title: "A merged pull request in a real codebase", detail: "Even a small UI fix in your team's code or an open-source project counts. Month 5 of the plan." },
];

export interface Source {
  label: string;
  url?: string;
}

export const sources: Source[] = [
  { label: "SignalFire, State of Talent Report 2026", url: "https://www.signalfire.com/blog/signalfire-state-of-talent-report-2026" },
  { label: "Figma 2025 trend & AI research" },
  { label: "CollabSoft" },
  { label: "Designer Fund / Foundation Capital, Q1 2026 survey", url: "https://designerfund.com/blog/how-figma-midjourney-and-databricks-harness-ai-in-design" },
  { label: "US BLS Employment Projections · SOC 15-1255" },
  { label: "Academy UX (job aggregator), Oct 2026" },
  { label: "Hymera recruiting analysis, July 2026" },
];

export const worksCited: { title: string; url: string }[] = [
  { title: "Is design engineer a real job? Why the role exists now - Modeinspect", url: "https://modeinspect.com/design-engineer/why-design-engineers-now" },
  { title: "SignalFire State of Talent Report 2026", url: "https://www.signalfire.com/blog/signalfire-state-of-talent-report-2026" },
  { title: "The Next Curve: Why the Design Engineer is the Future of Product Creation", url: "https://medium.com/@moeinsaboohi96/the-next-curve-why-the-design-engineer-is-the-future-of-product-creation-87dc0199ff03" },
  { title: "From UX Designer to UX Engineer: The Hybrid Role AI Just Made Inevitable", url: "https://www.designsystemscollective.com/from-ux-designer-to-ux-engineer-the-hybrid-role-ai-just-made-inevitable-e75090f37e02" },
  { title: "Designer hiring at big tech is down 48% since 2019 — Design Bootcamp", url: "https://medium.com/design-bootcamp/designer-hiring-at-big-tech-is-down-48-since-2019-new-job-titles-keep-appearing-d02260aa305f" },
  { title: "Craft - AI in Design Report 2026", url: "https://stateofaidesign.com/chapters/craft" },
  { title: "State of UX 2026 — NN/g", url: "https://www.nngroup.com/articles/state-of-ux-2026/" },
  { title: "Is it realistic to land a junior UX/UI job in 2026? - Mate academy", url: "https://mate.academy/en/answers/ui-ux-design/uxui-junior-market-2026" },
  { title: "Entry Level UI UX Jobs in 2026 Are Disappearing | by Ahnaf Tahmid", url: "https://medium.com/design-bootcamp/entry-level-ui-ux-jobs-in-2026-are-disappearing-364d3b5e04ee" },
  { title: "Being a Product Designer in 2026 Without Losing Your Mind - Medium", url: "https://medium.com/design-bootcamp/being-a-product-designer-in-2026-without-losing-your-mind-5ca7f4e683b6" },
  { title: "What a Junior Product Designer Portfolio Needs in 2026 (Hiring Manager Checklist)", url: "https://fueler.io/blog/what-a-junior-product-designer-portfolio-needs" },
  { title: "SignalFire data shows engineering hiring is more resilient than almost anyone expected", url: "https://startupfortune.com/signalfire-data-shows-engineering-hiring-is-more-resilient-than-almost-anyone-expected/" },
  { title: "UX Designer Demand and Hiring Market Outlook for Employers 2026", url: "https://designcareers.aiga.org/career-resources/hire-designers-11/ux-designer-hiring-market-demand-and-supply-2026-158" },
  { title: "How Figma, Midjourney, Databricks, and Modyfi Harness AI with Design", url: "https://designerfund.com/blog/how-figma-midjourney-and-databricks-harness-ai-in-design" },
  { title: "Careers at Profound", url: "https://www.tryprofound.com/careers" },
  { title: "Careers at Raycast: Build, Innovate, and Work from Anywhere", url: "https://www.raycast.com/careers" },
  { title: "Best AI Tools for Designers in 2026: Choose by Workflow - The Crit", url: "https://thecrit.co/resources/best-ai-coding-tools-designers-2026" },
  { title: "On the hunt for the elusive product-led employer | Melio's R&D blog", url: "https://medium.com/meliopayments/on-the-hunt-for-the-elusive-product-led-employer-106da39537e1" },
  { title: "Interleavings: Notes & Thoughts on Recent Reads, 9 November 2026", url: "https://sajithpai.com/interleavings-notes-thoughts-on-recent-reads-9-november-2026/" },
  { title: "AX Design Explained: The 2026 Guide to Agentic Experience", url: "https://www.pixelmojo.io/blogs/what-is-ax-design-complete-guide-agentic-experience-2026" },
  { title: "Agentic UI/UX Design Patterns", url: "https://agentic-design.ai/patterns/ui-ux-patterns" },
  { title: "Design Team Promotion Framework: Timelines, KPIs, and What It Really Takes to Grow", url: "https://medium.muz.li/design-team-promotion-framework-timelines-kpis-and-what-it-really-takes-to-grow-028ac1f98ebf" },
  { title: "What is the best AI for designers? 2026 tools compared - Modeinspect", url: "https://modeinspect.com/blog/best-ai-tools-for-designers" },
  { title: "12 designer portfolio examples that landed interviews (2026)", url: "https://personal.ink/blog/designer-portfolio-examples-2026/" },
  { title: "Best AI Tools for Product Design in 2026 - Mowgli", url: "https://mowgli.ai/blog/best-ai-tools-product-design-2026" },
  { title: "12 Best Product Design Portfolios Analyzed for UX - UX Pilot", url: "https://uxpilot.ai/blogs/product-design-portfolio-case-studies" },
  { title: "Product Design Portfolios with Case Studies", url: "https://www.productdesignportfolios.com/portfolios/content/case-studies" },
  { title: "Product Designer Portfolio: What Hiring Managers Actually Look For", url: "https://www.ayoubka.com/post/product-designer-portfolio-guide" },
  { title: "Best Product Designer Portfolios 2026 — Examples & Inspiration", url: "https://jobroadmaps.com/portfolios/product-designer" },
];

/* ───────── Skill map: where the three archetypes overlap ───────── */

export type ArchetypeId = "de" | "meta" | "ax";

export interface SkillRegion {
  id: string;
  sets: ArchetypeId[];
  name: string;
  detail: string;
  skills?: string[];
}

export const skillMap: SkillRegion[] = [
  {
    id: "de",
    sets: ["de"],
    name: "Design Engineer",
    detail: "Code track",
    skills: ["Real-world React & TypeScript", "Git & pull requests", "Modern CSS & Tailwind", "AI code editors: Cursor, v0, Codex"],
  },
  {
    id: "meta",
    sets: ["meta"],
    name: "Meta-Designer",
    detail: "Systems track",
    skills: ["Design token structure", "System rules for consistency and accessibility", "Connecting Figma to AI (Figma MCP)", "Turning business rules into design rules"],
  },
  {
    id: "ax",
    sets: ["ax"],
    name: "AX Designer",
    detail: "AI agent track",
    skills: ["Designing for trust and transparency", "Controls for how much AI acts alone", "Recovering from AI mistakes", "Agent protocols: MCP, AG-UI, A2A, A2UI"],
  },
  { id: "de-meta", sets: ["de", "meta"], name: "Code meets system", detail: "Connecting design tokens to real components." },
  { id: "de-ax", sets: ["de", "ax"], name: "UI built live", detail: "Screens the AI puts together while the app runs." },
  { id: "meta-ax", sets: ["meta", "ax"], name: "Rules for agents", detail: "Prompts and limits that keep agents using your system." },
  {
    id: "core",
    sets: ["de", "meta", "ax"],
    name: "Shared core",
    detail: "Visual taste and a sense for quality. Framing problems around business results you can measure.",
  },
];

/* ───────── Glossary: plain meanings for terms used on the site ───────── */

export const glossary: { term: string; meaning: string }[] = [
  { term: "AI agent", meaning: "An AI tool that takes steps on its own, like editing files or booking things." },
  { term: "AX (Agentic Experience)", meaning: "Design for products where AI agents act for the user, not just answer questions." },
  { term: "MCP (Model Context Protocol)", meaning: "A standard way for AI tools to read data from other apps, like your Figma files." },
  { term: "Figma MCP", meaning: "Lets AI coding tools read your Figma designs, tokens and components directly." },
  { term: "A2A (Agent-to-Agent)", meaning: "A standard that lets AI agents pass tasks and updates to each other." },
  { term: "AG-UI", meaning: "A standard for sending live updates from an AI agent to the app screen." },
  { term: "A2UI (Agent-to-User Interface)", meaning: "A standard that lets an agent show approved design-system components to users." },
  { term: "HITL / HOTL", meaning: "Human-in-the-loop: a person approves each step. Human-on-the-loop: a person watches and can step in." },
  { term: "Guardrail", meaning: "A rule or limit that keeps people or AI from going off track." },
  { term: "Component", meaning: "A reusable piece of UI, like a button or card, built once and used everywhere." },
  { term: "Design tokens", meaning: "Named values for colors, spacing and type that design and code share." },
  { term: "Token taxonomy", meaning: "How you name and group design tokens so people and AI can find them." },
  { term: "Code Connect", meaning: "A Figma feature that links design components to the matching components in code." },
  { term: "Repo (repository)", meaning: "The folder that holds a project's code and its full history of changes." },
  { term: "Diff", meaning: "A view of exactly which lines of code were added, changed or removed." },
  { term: "PR (pull request)", meaning: "A request to add your code changes to the main project, so others can review them." },
  { term: "Merge", meaning: "Accepting a pull request so its changes become part of the main code." },
  { term: "ARIA", meaning: "Code labels that help screen readers explain your interface to people who can't see it." },
  { term: "IC (individual contributor)", meaning: "Someone who does the hands-on work rather than managing people." },
  { term: "Super IC", meaning: "A senior hands-on expert who covers work once split across several roles." },
  { term: "Product-led company", meaning: "A company where the product itself drives growth, so design gets more weight." },
  { term: "Seed-stage startup", meaning: "A young company on its first round of outside funding, usually with a small team." },
  { term: "WCAG", meaning: "The Web Content Accessibility Guidelines: the standard checklist for making sites usable by everyone." },
  { term: "SaaS", meaning: "Software as a service: software you use in the browser on a subscription, like Figma or Notion." },
  { term: "B2B", meaning: "Business to business: products sold to companies rather than to individual people." },
];
