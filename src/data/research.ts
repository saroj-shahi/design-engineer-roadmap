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

/** Relevant syllabus slice from an official roadmap.sh track, paired with a month or stage. */
export interface PlanTopicGroup {
  /** Matches a roadmap slug in `#/library/roadmaps/<slug>`. */
  slug: string;
  source: string;
  area: string;
  topics: string[];
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
  roadmapTopics: PlanTopicGroup[];
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
  label: "Design hiring at 12 big tech companies, compared with\u00A02019",
  scope: "12 big tech companies, June 2026",
  source: "SignalFire, State of Talent\u00A02026",
  basis: "analytics",
};

const designerJobsOutlook: Metric = {
  value: "+6%",
  label: "US web and interface designers, 132,700 →\u00A0140,800",
  scope: "2025 → 2035, SOC 15-1255",
  source: "US BLS projection",
  basis: "projection",
};

export const heroMetrics: Metric[] = [
  designHiringBigTech,
  {
    value: "55%",
    label: "Share of big tech hires who are software engineers (46% in\u00A02019)",
    scope: "Big tech companies, 2026",
    source: "SignalFire, State of Talent\u00A02026",
    basis: "analytics",
  },
  {
    value: "50%",
    label: "Designers who ship AI-written code to real\u00A0products",
    scope: "Q1 2026 survey",
    source: "Designer Fund / Foundation\u00A0Capital",
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
      "Code changes merged into the real product. You own the UI components, design tokens, screen sizes and visual quality in the code\u00A0itself.",
    signals: "In high demand at Vercel, Cursor, Replit, Linear, Lovable, Raycast and Profound.",
    skills: ["Visual craft & taste", "React", "TypeScript", "Git workflows", "Live code demos & PRs"],
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
    dimension: "What gets evaluated",
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
    learn: ["Semantic HTML & forms", "Flexbox, CSS Grid & breakpoints", "Typography, color & hierarchy", "Browser DevTools"],
    build: "3 responsive landing pages",
    focus: "HTML, CSS layout (Flexbox, Grid) and checking layouts in DevTools.",
    deliverable: "3 responsive landing pages, built from scratch with no frameworks.",
    guardrail: "No AI code and no CSS frameworks. Learn to fix layouts by hand.",
    aiPolicy: "none",
    start: "Pick a landing page you like and rebuild its layout from a blank HTML file.",
    doneWhen: "You can rebuild a layout from a screenshot and fix it at phone width without help.",
    roadmapTopics: [
      {
        slug: "frontend",
        source: "Frontend",
        area: "Internet & Core Web Trio",
        topics: [
          "How Browsers Parse & Render Pages",
          "Semantic HTML, Forms & Validation",
          "CSS Layouts (Flexbox, Grid) & Responsive Design",
          "DevTools Inspection & Box Model",
        ],
      },
      {
        slug: "product-design",
        source: "Product Design",
        area: "Build the Interface",
        topics: [
          "Color, Typography, Layout & Grid",
          "Visual Hierarchy & Responsive Breakpoints",
          "Inclusive Design & Accessibility Basics",
        ],
      },
    ],
    resources: [
      { label: "MDN: Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", cost: "free" },
      { label: "roadmap.sh: Frontend Developer roadmap", url: "https://roadmap.sh/frontend", cost: "free" },
      { label: "Josh W. Comeau: Interactive guide to Flexbox", url: "https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/", cost: "free" },
      { label: "Josh W. Comeau: Interactive guide to CSS Grid", url: "https://www.joshwcomeau.com/css/interactive-guide-to-grid/", cost: "free" },
      { label: "Chrome DevTools docs", url: "https://developer.chrome.com/docs/devtools", cost: "free" },
    ],
  },
  {
    month: 2,
    title: "JavaScript & React",
    learn: ["DOM, events & async/fetch", "React components, props & hooks", "Interface states & motion", "API & data constraints"],
    build: "Change an existing React app",
    focus: "Plain JavaScript (DOM, events, async/await, fetch), then React (components, props, state, hooks).",
    deliverable: "Read, find your way around and change an existing React app.",
    guardrail: "Focus on reading and changing real code, not memorizing syntax.",
    aiPolicy: "read",
    start: "Run a small open-source React app on your computer, then change one piece of text and one style.",
    doneWhen: "You can find where a piece of UI lives in the code and change how it behaves.",
    roadmapTopics: [
      {
        slug: "frontend",
        source: "Frontend",
        area: "JavaScript & React Core",
        topics: [
          "JavaScript DOM, Events, Fetch & async/await",
          "Package Managers (npm, pnpm)",
          "React (Components, Props, State, Hooks)",
        ],
      },
      {
        slug: "product-design",
        source: "Product Design",
        area: "Interaction & Engineering Constraints",
        topics: [
          "Interface States (Hover, Focus, Active, Disabled)",
          "Micro-interactions & Motion Principles",
          "API & Data Limitations",
        ],
      },
    ],
    resources: [
      { label: "The Modern JavaScript Tutorial", url: "https://javascript.info/", cost: "free" },
      { label: "React docs: Learn React", url: "https://react.dev/learn", cost: "free" },
      { label: "roadmap.sh: JavaScript roadmap", url: "https://roadmap.sh/javascript", cost: "free" },
      { label: "roadmap.sh: React roadmap", url: "https://roadmap.sh/react", cost: "free" },
    ],
  },
  {
    month: 3,
    title: "Styling & types",
    learn: ["Tailwind CSS & Vite", "Design tokens & dark mode", "TypeScript basics", "Type, color & spacing scales"],
    build: "Launch 1 small tool or web app",
    focus: "Tailwind CSS, design tokens and TypeScript basics.",
    deliverable: "Build and launch 1 small tool or live web app.",
    guardrail: "You can now spot when AI output is wrong, so use AI coding tools (Cursor, Claude Code) freely to write code faster.",
    aiPolicy: "assist",
    start: "Turn the colors, spacing and type of one month-1 page into design tokens.",
    doneWhen: "Your tool is live at a public link, and you can explain every file in it.",
    roadmapTopics: [
      {
        slug: "frontend",
        source: "Frontend",
        area: "Styling, Types & Build Tools",
        topics: [
          "Tailwind CSS Utility Architecture",
          "TypeScript Type Checking for Props & Data",
          "Bundlers (Vite) & Deployment (Vercel, Netlify)",
        ],
      },
      {
        slug: "design-system",
        source: "Design System",
        area: "Defining Design Tokens",
        topics: [
          "Functional Colors & Accessibility Contrast",
          "Dark Mode Tokens",
          "Units, Grid, Breakpoints & Spacing",
          "Responsive Type Scale & Readability",
        ],
      },
    ],
    resources: [
      { label: "Tailwind CSS docs", url: "https://tailwindcss.com/docs", cost: "free" },
      { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", cost: "free" },
      { label: "roadmap.sh: TypeScript roadmap", url: "https://roadmap.sh/typescript", cost: "free" },
      { label: "roadmap.sh: Design System roadmap", url: "https://roadmap.sh/design-system", cost: "free" },
      { label: "React TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app/", cost: "free" },
      { label: "Design Tokens Community Group (W3C)", url: "https://www.designtokens.org/", cost: "free" },
    ],
  },
  {
    month: 4,
    title: "Building with AI",
    learn: ["Core UI primitives & variants", "Tokens in code & WCAG/ARIA", "Empty, loading & error states", "Plan mode, CLAUDE.md & deploy"],
    build: "Live component library",
    focus: "Building components with AI help: variants, every state, tokens in code, and deploying.",
    deliverable: "A small component library (button, input, card, dialog) built on your tokens, with every state, live at a public link.",
    guardrail: "Set up Cursor or Claude Code. You still decide the structure and check every state the AI skips.",
    aiPolicy: "oversee",
    start: "List the components you use most in your Figma work, and build the first one with all its states.",
    doneWhen: "Each component has hover, focus, disabled, empty and error states, and works with a keyboard.",
    roadmapTopics: [
      {
        slug: "design-system",
        source: "Design System",
        area: "Core Components & Accessibility",
        topics: [
          "Core Primitives (Button, Card, Input, Select, Modal, Tabs, Toast)",
          "Accessibility Testing & Keyboard Navigation",
          "Component Catalog & Documentation",
        ],
      },
      {
        slug: "claude-code",
        source: "Claude Code",
        area: "Daily Workflow & Context",
        topics: [
          "Plan Mode, Rewind & Permission Controls",
          "Structuring CLAUDE.md for Project Conventions",
          "Spec-Driven Prompts & Context Grounding",
        ],
      },
    ],
    resources: [
      { label: "WAI-ARIA patterns for components", url: "https://www.w3.org/WAI/ARIA/apg/patterns/", cost: "free" },
      { label: "Radix Primitives docs", url: "https://www.radix-ui.com/primitives/docs/overview/introduction", cost: "free" },
      { label: "Figma: How designers can use Claude Code", url: "https://www.figma.com/resource-library/claude-code-for-designers/", cost: "free" },
      { label: "roadmap.sh: Claude Code roadmap", url: "https://roadmap.sh/claude-code", cost: "free" },
      { label: "roadmap.sh: Prompt & Context Engineering", url: "https://roadmap.sh/prompt-engineering", cost: "free" },
      { label: "Getting started with Vercel", url: "https://vercel.com/docs/getting-started-with-vercel", cost: "free" },
    ],
  },
  {
    month: 5,
    title: "Real codebases",
    learn: ["Git branches, rebasing & PRs", "Linters, tests & performance", "Edge cases & launch readiness", "Code review in real repos"],
    build: "1–3 merged PRs",
    focus: "Git at work (branches, rebasing, conflicts), using the design system in code, and reviewing others' code.",
    deliverable: "Get 1–3 PRs into a real product: CSS bugs, accessibility fixes or component variants.",
    guardrail: "Pick up real front-end fixes at work, or help with open-source UI libraries.",
    aiPolicy: "production",
    start: "Ask a front-end lead which small UI bugs they'd review from you. No access at work? Filter an open-source UI library's issues by “good first issue”.",
    doneWhen: "At least one pull request is merged after a real review.",
    roadmapTopics: [
      {
        slug: "frontend",
        source: "Frontend",
        area: "Git, Testing & Quality Gates",
        topics: [
          "Git, GitHub & Pull Requests",
          "Linters & Formatters (ESLint, Prettier, Biome)",
          "Testing (Vitest, Playwright) & Lighthouse Performance",
        ],
      },
      {
        slug: "product-design",
        source: "Product Design",
        area: "Working with Engineering",
        topics: [
          "Stack & Platform Constraints",
          "Edge Cases & Interface States",
          "Launch Readiness & Developer Collaboration",
        ],
      },
    ],
    resources: [
      { label: "Pro Git book", url: "https://git-scm.com/book/en/v2", cost: "free" },
      { label: "GitHub Skills", url: "https://learn.github.com/skills", cost: "free" },
      { label: "roadmap.sh: Git and GitHub roadmap", url: "https://roadmap.sh/git-github", cost: "free" },
      { label: "roadmap.sh: Code Review roadmap", url: "https://roadmap.sh/code-review", cost: "free" },
      { label: "Good First Issue", url: "https://goodfirstissue.dev/", cost: "free" },
      { label: "First Contributions", url: "https://github.com/firstcontributions/first-contributions", cost: "free" },
    ],
  },
  {
    month: 6,
    title: "Proof & positioning",
    learn: ["Live demos & clean repos", "Problem framing & HEART metrics", "Accessibility & security polish", "Internal case or ~20 applications"],
    build: "Live work, write-ups & merged PRs",
    focus: "Package what you've built so teammates, managers or hiring teams can see the impact — whether you're expanding your current role or looking for a new one.",
    deliverable: "Document two live builds and your merged PRs for an internal demo, promotion case, or updated portfolio.",
    guardrail: "Staying in your role? Share a demo with your design and engineering leads to widen your scope. Looking to move? Send ~20 careful applications to teams that hire hybrids instead of mass applying.",
    aiPolicy: "position",
    start: "Pick your two strongest builds and write a 2–3 paragraph write-up of the problem, trade-offs and result.",
    doneWhen: "Every item on the readiness checklist is ticked.",
    roadmapTopics: [
      {
        slug: "product-design",
        source: "Product Design",
        area: "Framing Outcomes & Impact",
        topics: [
          "Problem Statements, Product Vision & Success Metrics",
          "Critiques, Trade-offs & Decision Rationale",
          "Product Analytics, HEART Framework & A/B Testing",
        ],
      },
      {
        slug: "frontend",
        source: "Frontend",
        area: "Production Polish",
        topics: [
          "Accessibility (WCAG, ARIA, Keyboard Navigation)",
          "Web Security (HTTPS, CSP) & Core Web Vitals",
          "Clean Public Repos & Live Serverless Deployment",
        ],
      },
    ],
    resources: [
      { label: "Design engineering resources", url: "https://designengineering.arun.is/", cost: "free" },
      { label: "roadmap.sh: Product Design roadmap", url: "https://roadmap.sh/product-design", cost: "free" },
      { label: "roadmap.sh: Frontend Performance best practices", url: "https://roadmap.sh/frontend-performance-best-practices", cost: "free" },
    ],
  },
];

/** The Meta-Designer / AX option shares months 1–3, then turns to systems AI can read and agent trust flows. */
const metaMonths: Month[] = [
  {
    month: 4,
    title: "Systems AI can read",
    learn: ["Visual audit & token taxonomy", "Figma variables & Code Connect", "Figma MCP & CLAUDE.md rules", "Governance & contribution docs"],
    build: "Tokens wired from Figma to code",
    focus: "Name and structure design tokens, set up Figma variables and Code Connect, and connect them to an AI coding tool through Figma MCP.",
    deliverable: "A small design system whose tokens and components an AI coding tool can read and use correctly.",
    guardrail: "Test it: ask an AI tool to build a screen from your system, then fix the names or docs wherever it went wrong.",
    aiPolicy: "oversee",
    start: "Audit one Figma file: list every color and spacing value that isn't a variable yet.",
    doneWhen: "An AI tool builds a screen using only your tokens and components.",
    roadmapTopics: [
      {
        slug: "design-system",
        source: "Design System",
        area: "Audit, Language & Tokens",
        topics: [
          "Performing a Visual Audit & Component Inventory",
          "Design Principles, Writing Guidelines & Terminology",
          "Token Taxonomy (Color, Dark Mode, Spacing, Typography, Icons)",
          "Semantic Versioning, PR Templates & Contribution Governance",
        ],
      },
      {
        slug: "prompt-engineering",
        source: "Prompt & Context",
        area: "Context Layers for Design Systems",
        topics: [
          "Context Sources, Context Layers & Failure Modes",
          "CLAUDE.md & AGENTS.md System Instructions",
          "MCP Tool Descriptions & Spec-Driven Prompts",
          "Context Compaction & Keeping Rules Lean",
        ],
      },
    ],
    resources: [
      { label: "Figma: Guide to variables", url: "https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma", cost: "free" },
      { label: "Figma: Code Connect docs", url: "https://developers.figma.com/docs/code-connect/", cost: "free" },
      { label: "Figma: Guide to the Figma MCP server", url: "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server", cost: "free" },
      { label: "roadmap.sh: Design System roadmap", url: "https://roadmap.sh/design-system", cost: "free" },
      { label: "roadmap.sh: Prompt & Context Engineering", url: "https://roadmap.sh/prompt-engineering", cost: "free" },
      { label: "Design Tokens Community Group (W3C)", url: "https://www.designtokens.org/", cost: "free" },
    ],
  },
  {
    month: 5,
    title: "Agent trust flows",
    learn: ["Agent loop, MCP & memory", "Approval, confidence & undo", "Decision making & cognitive load", "HITL evals, sandboxing & 1 PR"],
    build: "Trust flows + 1 merged PR",
    focus: "Design how an AI feature asks for approval, shows how sure it is, and recovers from mistakes. Keep reviewing AI-written UI code.",
    deliverable: "Approval, status, error and undo states for one agent feature, prototyped in code, plus one merged PR that fixes tokens or accessibility.",
    guardrail: "Start from the Human-AI pattern library in Library → Skills, and test the flows with real users.",
    aiPolicy: "production",
    start: "Pick one AI feature you use daily and map every point where it acts without asking you.",
    doneWhen: "Every risky action in your flow has an approval step, a visible status and a way to undo it.",
    roadmapTopics: [
      {
        slug: "ai-agents",
        source: "AI Agents",
        area: "Agent Loop, Memory & Safety",
        topics: [
          "4-Step Agent Loop (Perception, Plan, Act, Reflect)",
          "MCP Hosts, Clients & Servers + Tool Schemas",
          "Short-Term vs Long-Term Agent Memory",
          "Human-in-the-Loop Evaluation & Tool Sandboxing",
          "Prompt Injection, PII Redaction & Red-Team Testing",
        ],
      },
      {
        slug: "ux-design",
        source: "UX Design",
        area: "Decision Making & Cognitive Load",
        topics: [
          "Dual Process Theory & CREATE Action Funnel",
          "Status Reports, Clear Actions & Avoiding Cognitive Overhead",
          "Make Progress & Completion Clearly Visible",
          "Incremental A/B Testing & Gathering Lessons",
        ],
      },
    ],
    resources: [
      { label: "Google PAIR: People + AI Guidebook", url: "https://pair.withgoogle.com/guidebook", cost: "free" },
      { label: "Microsoft: Guidelines for Human-AI Interaction", url: "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/", cost: "free" },
      { label: "roadmap.sh: AI Agents roadmap", url: "https://roadmap.sh/ai-agents", cost: "free" },
      { label: "roadmap.sh: UX Design roadmap", url: "https://roadmap.sh/ux-design", cost: "free" },
      { label: "WAI-ARIA patterns for components", url: "https://www.w3.org/WAI/ARIA/apg/patterns/", cost: "free" },
    ],
  },
  {
    month: 6,
    title: "Proof & adoption",
    learn: ["Systems & adoption case study", "Component health & OKRs", "Live trust-flow prototypes", "Team rollout or ~20 applications"],
    build: "Systems rollout & trust-flow demos",
    focus: "Show the impact of your system and AI-product work with live links behind every claim — to drive team adoption or anchor a hybrid portfolio.",
    deliverable: "Package your AI-readable design system, trust flows and merged PRs as an internal rollout deck or live portfolio.",
    guardrail: "Growing in your current role? Run a working session so your team adopts the tokens and MCP setup. Looking to move? Send ~20 careful applications to teams hiring hybrids.",
    aiPolicy: "position",
    start: "Write a short case study showing an AI tool using your system: what broke, what you fixed, and what it saves the team.",
    doneWhen: "Every item on the readiness checklist is ticked.",
    roadmapTopics: [
      {
        slug: "design-system",
        source: "Design System",
        area: "Governance & Health Metrics",
        topics: [
          "System Roadmap, Milestones & Adoption",
          "Component, Tooling & Health Analytics",
          "Documentation, Open Hours & Contribution Guidelines",
        ],
      },
      {
        slug: "product-design",
        source: "Product Design",
        area: "Strategy & Stakeholder Proof",
        topics: [
          "Business Metrics & OKRs",
          "Stakeholder Alignment & DesignOps",
          "Assumption Mapping & Risk Identification",
        ],
      },
    ],
    resources: [
      { label: "Design engineering resources", url: "https://designengineering.arun.is/", cost: "free" },
      { label: "roadmap.sh: Design System roadmap", url: "https://roadmap.sh/design-system", cost: "free" },
      { label: "roadmap.sh: AI Agents roadmap", url: "https://roadmap.sh/ai-agents", cost: "free" },
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
  position: "Prove impact",
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
  roadmapTopics: PlanTopicGroup[];
  resources: Resource[];
}

export const launchStages: LaunchStage[] = [
  {
    n: 1,
    learn: ["Decision making & UX patterns", "Research, personas & JTBD", "IA, user flows & wireframing", "Typography, layout & WCAG", "Usability & heuristic critique"],
    name: "Learn the lasting basics",
    detail:
      "Before you use AI screen tools, learn usability, accessibility (WCAG), typography, information architecture and interaction patterns. Take real products apart to see where they fail and why.",
    output: "Basics you can explain",
    start: "Pick an app you use daily and write down three places it fails a new user, and why.",
    doneWhen: "You can explain a usability or accessibility problem, and its fix, in plain words. Covered this in school or a bootcamp? Check yourself against this and move on.",
    roadmapTopics: [
      {
        slug: "ux-design",
        source: "UX Design",
        area: "Decision Making, Flows & UX Patterns",
        topics: [
          "BJ Fogg's Behavior Model & Dual Process Theory",
          "Target Outcome, Target Actor & Target Action",
          "Good Layout Rules, User Stories & Simple Flowcharts",
          "Clear Distractions, Avoid Choice & Cognitive Overload",
        ],
      },
      {
        slug: "product-design",
        source: "Product Design",
        area: "Foundations, IA & Visual Craft",
        topics: [
          "User-Centered Design & Functionality over Polish",
          "Site Maps, Navigation, User Flows & Task Flows",
          "Color, Typography, Layout, Grid & Visual Hierarchy",
          "Usability Testing & Accessibility Testing",
        ],
      },
    ],
    resources: [
      { label: "roadmap.sh: UX Design roadmap", url: "https://roadmap.sh/ux-design", cost: "free" },
      { label: "roadmap.sh: Product Design roadmap", url: "https://roadmap.sh/product-design", cost: "free" },
      { label: "NN/g: 10 usability heuristics", url: "https://www.nngroup.com/articles/ten-usability-heuristics/", cost: "free" },
      { label: "WebAIM: WCAG 2 checklist", url: "https://webaim.org/standards/wcag/checklist", cost: "free" },
      { label: "Butterick's Practical Typography", url: "https://practicaltypography.com/", cost: "free" },
      { label: "Laws of UX", url: "https://lawsofux.com/", cost: "free" },
    ],
  },
  {
    n: 2,
    learn: ["Semantic HTML, Flexbox & Grid", "Browser DevTools", "App scoping & AI prototyping", "v0, Figma Make & Cursor", "Live browser prototypes"],
    name: "Prototype in code",
    detail:
      "Learn HTML and CSS first, then add one AI prototyping tool (Figma Make or v0, for example). Knowing the basics is what lets you judge what the AI makes. Build prototypes that run in a browser.",
    output: "Working prototypes in a browser",
    start: "Rebuild one screen from a past case study in plain HTML and CSS, then use one AI tool to extend it.",
    doneWhen: "A prototype runs in the browser at a link you can share.",
    roadmapTopics: [
      {
        slug: "frontend",
        source: "Frontend",
        area: "HTML, CSS & Browser Basics",
        topics: [
          "Semantic HTML, Forms & Validation",
          "CSS Flexbox, Grid & Responsive Design",
          "Browsers, DevTools & GitHub Pages / Vercel Deploy",
        ],
      },
      {
        slug: "ai-product-builder",
        source: "AI Product Builder",
        area: "Prototyping & Generation",
        topics: [
          "Problem Definition, App Anatomy & Feature Scoping",
          "Choosing a Prototype Tool (v0, Figma Make, Lovable, Bolt)",
          "Targeted Changes vs Structural Refactors in Cursor",
        ],
      },
    ],
    resources: [
      { label: "roadmap.sh: Frontend Developer roadmap", url: "https://roadmap.sh/frontend", cost: "free" },
      { label: "roadmap.sh: AI Product Builder roadmap", url: "https://roadmap.sh/ai-product-builder", cost: "free" },
      { label: "MDN: Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", cost: "free" },
      { label: "web.dev: Learn CSS", url: "https://web.dev/learn/css", cost: "free" },
      { label: "GitHub Pages quickstart", url: "https://docs.github.com/en/pages/quickstart", cost: "free" },
    ],
  },
  {
    n: 3,
    learn: ["Interviews & contextual inquiry", "Local orgs, OSS & small SaaS", "Usability testing & critiques", "Analytics, HEART & A/B testing"],
    name: "Ship real work for real users",
    detail:
      "Skip made-up Spotify or Uber redesigns. Solve real problems for local businesses, community groups, open-source projects or small SaaS. Start small: one group, one problem, a handful of real users. Test it live and write down how feedback changed your mind.",
    output: "Live work with proof from real users",
    start: "Ask one local business, club or open-source project what slows them down each week.",
    doneWhen: "Real people used what you built, and you can show what changed because of their feedback.",
    roadmapTopics: [
      {
        slug: "product-design",
        source: "Product Design",
        area: "Discover, Validate & Measure",
        topics: [
          "Interviews, Contextual Inquiry & Session Recordings",
          "Personas, Jobs-to-be-Done & Problem Statements",
          "Usability Testing, Critiques & UX Benchmarking",
          "Product Analytics, HEART Framework & A/B Testing",
        ],
      },
      {
        slug: "ai-product-builder",
        source: "AI Product Builder",
        area: "Testing, Git & Live Launch",
        topics: [
          "User Testing with Live Prototypes",
          "Change Management with GitHub Pull Requests",
          "Serverless Hosting (Vercel, Cloudflare) & Real Data",
        ],
      },
    ],
    resources: [
      { label: "roadmap.sh: Product Design roadmap", url: "https://roadmap.sh/product-design", cost: "free" },
      { label: "roadmap.sh: UX Design roadmap", url: "https://roadmap.sh/ux-design", cost: "free" },
      { label: "Good First Issue", url: "https://goodfirstissue.dev/", cost: "free" },
      { label: "First Contributions", url: "https://github.com/firstcontributions/first-contributions", cost: "free" },
    ],
  },
  {
    n: 4,
    learn: ["Product sense, OKRs & RICE/Kano", "3–4 outcome-led case studies", "Feasibility specs & edge cases", "Seed startups, agencies & B2B"],
    name: "Aim at the right employers",
    detail:
      "Write 3–4 short, easy-to-scan case studies. Aim them at early (seed-stage) startups, which hire the most designers relative to size (25%). Also try small agencies and industry-focused B2B companies, not only big tech junior programs.",
    output: "A portfolio aimed at where hiring happens",
    start: "Rewrite the opening of your best case study: who you are, the problem, and what you did.",
    doneWhen: "Every item on the portfolio checklist is ticked.",
    roadmapTopics: [
      {
        slug: "product-design",
        source: "Product Design",
        area: "Strategy & Team Readiness",
        topics: [
          "Product Sense, Business Metrics & OKRs",
          "Prioritization Frameworks (Kano, RICE, MoSCoW)",
          "Feasibility Specs, Edge Cases & Developer Collaboration",
          "Design Systems & Multi-Platform Thinking",
        ],
      },
      {
        slug: "ux-design",
        source: "UX Design",
        area: "Impact & Business Framing",
        topics: [
          "Business Model Canvas, Lean Canvas & SWOT Analysis",
          "Customer Experience Maps & Process Flowcharts",
          "Gather Lessons, Prioritize & Show Measured Impact",
        ],
      },
    ],
    resources: [
      { label: "Design engineering resources", url: "https://designengineering.arun.is/", cost: "free" },
      { label: "roadmap.sh: Product Design roadmap", url: "https://roadmap.sh/product-design", cost: "free" },
      { label: "roadmap.sh: Design System roadmap", url: "https://roadmap.sh/design-system", cost: "free" },
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
  { id: "demo", title: "A live demo that works in 10 seconds", detail: "A link a teammate, manager or reviewer can open and use right away." },
  { id: "repo", title: "A clean GitHub repository (public or team)", detail: "Clear components, state, CSS structure and ARIA labels others can read and review." },
  { id: "writeup", title: "A 2–3 paragraph design and code write-up", detail: "What you wanted, your decisions, trade-offs and next steps." },
  { id: "ai", title: "Proof of an AI-assisted workflow", detail: "Show you guided Cursor or Claude Code to ship real features." },
  { id: "access", title: "Easy to open", detail: "No broken links, setup hoops or clutter — anyone you share it with can try it right away." },
  { id: "scope", title: "Honest about your role", detail: "Say clearly what you designed, built and reviewed — and label practice projects as such." },
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

/* ───────── Glossary: plain meanings for design, code, team and AI terms ───────── */

export type GlossaryTopic = "design" | "code" | "team" | "ai";

export const glossaryTopicLabel: Record<GlossaryTopic, string> = {
  design: "Design",
  code: "Code",
  team: "Team and product",
  ai: "AI",
};

/** `see` names other glossary terms to cross-link; each must match a `term` exactly. */
export const glossary: { term: string; topic: GlossaryTopic; meaning: string; see?: string[] }[] = [
  { term: "Design Engineer", topic: "design", meaning: "A designer who also builds the real interface in code and owns how it looks and works once it ships. See the Roles page.", see: ["Meta-Designer", "AX (Agentic Experience)"] },
  { term: "Meta-Designer", topic: "design", meaning: "A designer who builds the system others design with: tokens, components and the rules people and AI follow. See the Roles page.", see: ["Design Engineer", "Design system"] },
  { term: "UX (user experience)", topic: "design", meaning: "How it feels to use a product from start to finish, including whether it solves the problem.", see: ["UI (user interface)"] },
  { term: "UI (user interface)", topic: "design", meaning: "The screens, buttons, text and controls people see and touch.", see: ["UX (user experience)"] },
  { term: "UX research", topic: "design", meaning: "Learning about users and their needs through interviews, surveys, testing and data.", see: ["User interview", "Usability testing"] },
  { term: "User interview", topic: "design", meaning: "A one-to-one conversation to learn how someone does a task and where it gets hard.", see: ["UX research", "Pain point"] },
  { term: "Pain point", topic: "design", meaning: "A moment where using a product frustrates or blocks someone.", see: ["Journey map"] },
  { term: "Persona", topic: "design", meaning: "A short profile of a typical user, based on research, used to guide decisions.", see: ["UX research"] },
  { term: "Journey map", topic: "design", meaning: "A timeline of what a user does, thinks and feels while using a product or service.", see: ["Pain point", "Service blueprint"] },
  { term: "Service blueprint", topic: "design", meaning: "A diagram of a service that shows what users see and what happens behind the scenes to make it work.", see: ["Journey map"] },
  { term: "Usability testing", topic: "design", meaning: "Watching real people try to use your design to find where they get stuck.", see: ["Heuristic evaluation"] },
  { term: "Heuristic evaluation", topic: "design", meaning: "Checking a design against a list of well-known usability rules, without needing users.", see: ["Usability testing"] },
  { term: "Affinity mapping", topic: "design", meaning: "Grouping research notes by theme, often on sticky notes, to spot patterns.", see: ["Research synthesis"] },
  { term: "Research synthesis", topic: "design", meaning: "Turning raw research notes into clear findings and next steps.", see: ["Affinity mapping"] },
  { term: "Qualitative vs quantitative", topic: "design", meaning: "Qualitative research explains why, through interviews and observation. Quantitative measures how many, through numbers.", see: ["UX research", "A/B test"] },
  { term: "Information architecture (IA)", topic: "design", meaning: "Deciding where content goes and what to call it, like a menu structure or sitemap.", see: ["User flow"] },
  { term: "User flow", topic: "design", meaning: "The steps a person takes to finish a task, like signing up or checking out.", see: ["Information architecture (IA)"] },
  { term: "Design brief", topic: "design", meaning: "A short description of the problem, the audience and the goals for a piece of design work.", see: ["PRD (product requirements document)"] },
  { term: "Wireframe", topic: "design", meaning: "A simple, low-detail sketch of a screen that shows layout and content, not style.", see: ["Fidelity (lo-fi / hi-fi)"] },
  { term: "Mockup", topic: "design", meaning: "A static, detailed picture of a screen that shows how it will look.", see: ["Prototype"] },
  { term: "Prototype", topic: "design", meaning: "A clickable model of a design that you can test before anything is built.", see: ["Usability testing"] },
  { term: "Fidelity (lo-fi / hi-fi)", topic: "design", meaning: "How close a design is to the final product. Lo-fi is rough; hi-fi looks real.", see: ["Wireframe", "Mockup"] },
  { term: "Moodboard", topic: "design", meaning: "A collection of images, colors and type used to set a visual direction." },
  { term: "Affordance", topic: "design", meaning: "What an object lets you do, like a button that can be pressed. The visual cue that shows it, like a raised edge, is called a signifier." },
  { term: "Visual hierarchy", topic: "design", meaning: "Using size, weight, color and space so the most important thing is seen first." },
  { term: "Grid (layout)", topic: "design", meaning: "A set of columns and rows used to line up content consistently.", see: ["Gutter", "CSS Grid"] },
  { term: "Gutter", topic: "design", meaning: "The gap between columns in a grid.", see: ["Grid (layout)"] },
  { term: "Whitespace", topic: "design", meaning: "Empty space around and between elements. It helps content breathe and read clearly." },
  { term: "Typeface vs font", topic: "design", meaning: "A typeface is the family, like Inter. A font is one style of it, like Inter Bold." },
  { term: "Kerning", topic: "design", meaning: "The space between two specific letters, adjusted so a word looks evenly spaced.", see: ["Tracking", "Leading"] },
  { term: "Tracking", topic: "design", meaning: "The spacing across all the letters in a word or block of text.", see: ["Kerning", "Leading"] },
  { term: "Leading", topic: "design", meaning: "The space between lines of text. In CSS it is called line height.", see: ["Kerning", "Tracking"] },
  { term: "Contrast ratio", topic: "design", meaning: "A score for how different text and background colors are. WCAG sets minimums so text stays readable.", see: ["WCAG"] },
  { term: "Responsive design", topic: "design", meaning: "Layouts that adapt to different screen sizes, from phone to desktop.", see: ["Breakpoint", "Mobile-first"] },
  { term: "Breakpoint", topic: "design", meaning: "A screen width where the layout changes, like moving from one column to two.", see: ["Responsive design"] },
  { term: "Mobile-first", topic: "design", meaning: "Designing for small screens first, then adding more for larger ones.", see: ["Responsive design"] },
  { term: "Frame", topic: "design", meaning: "A container in Figma that holds a screen or a part of one, like an artboard.", see: ["Auto Layout"] },
  { term: "Auto Layout", topic: "design", meaning: "A Figma setting that makes a frame grow, shrink and space its contents automatically, like CSS Flexbox.", see: ["Frame", "Flexbox"] },
  { term: "Component", topic: "design", meaning: "A reusable piece of UI, like a button or card, built once and used everywhere.", see: ["Variants", "Props"] },
  { term: "Variants", topic: "design", meaning: "Versions of one Figma component, like a button's sizes and states. In code these are usually props.", see: ["Component", "Props"] },
  { term: "Interaction states", topic: "design", meaning: "How an element looks as people use it: hovered, focused with a keyboard, pressed or disabled. Not the same as state in code.", see: ["State (code)"] },
  { term: "Design system", topic: "design", meaning: "A shared set of components, tokens, patterns and guidelines that teams build from.", see: ["Style guide", "Component library", "Design tokens"] },
  { term: "Style guide", topic: "design", meaning: "Brand rules, like colors, type and tone of voice. A design system usually includes one.", see: ["Design system"] },
  { term: "Atomic design", topic: "design", meaning: "A way of building interfaces from small parts up: atoms, molecules, organisms, templates and pages.", see: ["Component"] },
  { term: "Design tokens", topic: "design", meaning: "Names for design choices, like \"color-brand\" instead of a hex code, shared by design and code so one change updates everywhere.", see: ["Semantic tokens", "Figma variables", "CSS custom properties"] },
  { term: "Semantic tokens", topic: "design", meaning: "Tokens named by purpose, like \"color-danger\", that point to raw values, like \"red-500\". Teams often layer them: raw values, then purpose tokens, then component tokens.", see: ["Design tokens", "Theming"] },
  { term: "Theming", topic: "design", meaning: "Swapping token values to change a product's look, like light and dark mode or a different brand.", see: ["Semantic tokens"] },
  { term: "Figma variables", topic: "design", meaning: "Saved values in Figma, like colors and spacing, that can switch by mode. They are the Figma side of design tokens.", see: ["Design tokens", "CSS custom properties"] },
  { term: "Dev Mode", topic: "design", meaning: "A Figma view for developers that shows measurements, tokens and code hints for a design.", see: ["Handoff", "Code Connect"] },
  { term: "Code Connect", topic: "design", meaning: "A Figma feature that links design components to the matching components in code.", see: ["Dev Mode", "Component library"] },
  { term: "Microcopy", topic: "design", meaning: "Small bits of interface text, like button labels, hints and error messages.", see: ["Empty state"] },
  { term: "Empty state", topic: "design", meaning: "What a screen shows when there is no content yet, like an empty inbox.", see: ["Microcopy"] },
  { term: "CTA (call to action)", topic: "design", meaning: "The main action you want someone to take, like \"Sign up\" or \"Buy now\"." },
  { term: "Micro-interaction", topic: "design", meaning: "A small, focused moment of feedback, like a like-button animation or a toggle sliding.", see: ["Easing"] },
  { term: "Easing", topic: "design", meaning: "How an animation speeds up or slows down, so motion feels natural.", see: ["Micro-interaction"] },
  { term: "Accessibility (a11y)", topic: "design", meaning: "Making products usable by people with disabilities, and easier for everyone. \"a11y\" is shorthand.", see: ["WCAG", "Alt text", "ARIA"] },
  { term: "WCAG", topic: "design", meaning: "The Web Content Accessibility Guidelines: testable rules for making web content accessible.", see: ["Accessibility (a11y)", "Contrast ratio"] },
  { term: "Alt text", topic: "design", meaning: "A short text description of an image that screen readers read aloud.", see: ["Accessibility (a11y)"] },
  { term: "Design principles", topic: "design", meaning: "A short list of agreed beliefs that guide design decisions across a team." },
  { term: "Design critique", topic: "design", meaning: "A structured feedback session where the team reviews work against its goals." },
  { term: "Portfolio", topic: "design", meaning: "A collection of your best work that shows how you think and what you can do.", see: ["Case study"] },
  { term: "Case study", topic: "design", meaning: "A story about one project that walks through the problem, your process and the outcome.", see: ["Portfolio"] },
  { term: "Handoff", topic: "design", meaning: "The point where design and engineering agree on what to build: specs, states, edge cases and open questions. It works best as an ongoing conversation, not a one-time drop.", see: ["Dev Mode", "Design QA", "Edge case"] },
  { term: "Design QA", topic: "design", meaning: "Checking the built product against the design before it ships.", see: ["Handoff"] },
  { term: "Design debt", topic: "design", meaning: "Inconsistencies and shortcuts in a design that pile up and need fixing later.", see: ["Tech debt"] },
  { term: "DesignOps", topic: "design", meaning: "The people, tools and processes that help a design team work well as it grows." },
  { term: "Front end vs back end", topic: "code", meaning: "The front end is the part of a product people see and use. The back end is the hidden part, like servers and databases, that stores data and does the work.", see: ["API"] },
  { term: "HTML", topic: "code", meaning: "The code that gives a web page its structure, like headings, lists and buttons.", see: ["Semantic HTML"] },
  { term: "Semantic HTML", topic: "code", meaning: "Using the HTML element that matches the meaning, like <button> for a button, so browsers and screen readers understand it.", see: ["HTML", "ARIA"] },
  { term: "ARIA", topic: "code", meaning: "Attributes added to HTML that tell screen readers what a custom control is and what state it is in. Semantic HTML often needs none.", see: ["Semantic HTML", "Accessibility (a11y)"] },
  { term: "CSS", topic: "code", meaning: "The code that styles a web page: colors, type, spacing and layout.", see: ["CSS custom properties", "Tailwind CSS"] },
  { term: "CSS custom properties", topic: "code", meaning: "Variables in CSS, like --color-brand, that hold a value used across a site. This is a common way design tokens reach code.", see: ["Design tokens", "Figma variables"] },
  { term: "Tailwind CSS", topic: "code", meaning: "A CSS approach where you style elements with small ready-made class names, like \"p-4\" for padding, right in the markup.", see: ["CSS"] },
  { term: "Flexbox", topic: "code", meaning: "A CSS layout tool that lines items up in one direction, a row or a column.", see: ["CSS Grid", "Auto Layout"] },
  { term: "CSS Grid", topic: "code", meaning: "A CSS layout tool that places items in rows and columns at once, good for whole-page layouts.", see: ["Flexbox", "Grid (layout)"] },
  { term: "px vs rem", topic: "code", meaning: "Units for size in CSS. A px is fixed; a rem scales with the reader's text size setting." },
  { term: "SVG", topic: "code", meaning: "An image format made of shapes and lines, so it stays sharp at any size." },
  { term: "JavaScript", topic: "code", meaning: "The code that makes web pages interactive, like menus that open or forms that check input.", see: ["TypeScript"] },
  { term: "TypeScript", topic: "code", meaning: "JavaScript with types added, so mistakes like a missing value are caught before the code runs.", see: ["JavaScript"] },
  { term: "Framework (e.g. React)", topic: "code", meaning: "Ready-made code that developers build apps on, using reusable components. React is technically a library, but you'll hear both words.", see: ["Component library", "Props"] },
  { term: "Component library", topic: "code", meaning: "The coded versions of a design system's components that developers import and use.", see: ["Design system", "Storybook"] },
  { term: "Storybook", topic: "code", meaning: "A tool for building, viewing and documenting coded components on their own, outside the app.", see: ["Component library"] },
  { term: "Props", topic: "code", meaning: "Settings passed into a code component, like a button's label or size. Think of them as Figma component properties.", see: ["Variants", "Component"] },
  { term: "State (code)", topic: "code", meaning: "Data that changes while an app runs, like whether a menu is open. Not the same as interaction states in design.", see: ["Interaction states"] },
  { term: "API", topic: "code", meaning: "A defined way for one piece of software to ask another for data or actions.", see: ["Front end vs back end"] },
  { term: "Terminal", topic: "code", meaning: "A text window where you type commands to run tools, like starting a project on your computer. Also called the command line.", see: ["npm", "Localhost"] },
  { term: "npm", topic: "code", meaning: "A tool and online store for packages: ready-made code other people wrote that you add to a project.", see: ["Terminal"] },
  { term: "Localhost", topic: "code", meaning: "A private preview of a website that only your computer can see while you build it.", see: ["Terminal", "Deploy"] },
  { term: "Git", topic: "code", meaning: "A tool that tracks every change to a project's files, so you can review or undo them.", see: ["Repo (repository)", "Commit"] },
  { term: "Repo (repository)", topic: "code", meaning: "A project's folder of files plus every past version of them. GitHub is a common place to keep one online.", see: ["Git"] },
  { term: "Commit", topic: "code", meaning: "A saved snapshot of your changes in Git, with a short message about what changed.", see: ["Git", "Branch"] },
  { term: "Branch", topic: "code", meaning: "A separate line of work, so your changes stay apart from the main version until they are merged.", see: ["Commit", "Merge"] },
  { term: "Diff", topic: "code", meaning: "A view of what changed between two versions of a file, usually red for removed lines and green for added ones.", see: ["PR (pull request)"] },
  { term: "PR (pull request)", topic: "code", meaning: "A request that says \"here are my changes, please review them and add them to the project.\"", see: ["Code review", "Diff", "Merge"] },
  { term: "Code review", topic: "code", meaning: "When teammates read a pull request, leave comments and approve it before it is merged.", see: ["PR (pull request)"] },
  { term: "Merge", topic: "code", meaning: "Combining the changes from a branch or pull request into the shared version of the project.", see: ["Branch", "PR (pull request)"] },
  { term: "Staging vs production", topic: "code", meaning: "Staging is a private test copy of the product. Production is the live version real users see.", see: ["Deploy"] },
  { term: "Deploy", topic: "code", meaning: "Publishing code so it goes live on the internet.", see: ["Staging vs production", "CI/CD"] },
  { term: "CI/CD", topic: "code", meaning: "Automated steps that test and publish code every time changes are merged.", see: ["Deploy"] },
  { term: "Feature flag", topic: "code", meaning: "A switch that turns a feature on or off for some users without a new release.", see: ["A/B test"] },
  { term: "Bug", topic: "code", meaning: "Something in the product that doesn't work as intended." },
  { term: "Tech debt", topic: "code", meaning: "Shortcuts in code that make future changes slower until someone cleans them up.", see: ["Design debt"] },
  { term: "Stakeholder", topic: "team", meaning: "Anyone with a say in or a stake in the work, like product managers, leaders or clients." },
  { term: "Cross-functional team", topic: "team", meaning: "A team that mixes roles, like design, engineering and product, working toward one goal.", see: ["Product trio"] },
  { term: "Product trio", topic: "team", meaning: "The product manager, designer and engineering lead who shape a product area together.", see: ["Cross-functional team"] },
  { term: "PRD (product requirements document)", topic: "team", meaning: "A document that explains what to build, for whom and why.", see: ["Design brief"] },
  { term: "MVP (minimum viable product)", topic: "team", meaning: "The smallest version of a product that can be shipped to learn from real users." },
  { term: "Discovery", topic: "team", meaning: "Early work to understand the problem and users before deciding what to build.", see: ["Double Diamond"] },
  { term: "Double Diamond", topic: "team", meaning: "A process shaped like two diamonds. First explore the problem widely and define it. Then explore solutions widely and pick one.", see: ["Discovery"] },
  { term: "Design sprint", topic: "team", meaning: "A short workshop, often five days, that goes from a problem to a tested prototype.", see: ["Prototype", "Sprint"] },
  { term: "JTBD (jobs to be done)", topic: "team", meaning: "A way of framing needs by the goal a person is trying to get done, not by who they are.", see: ["Persona"] },
  { term: "A/B test", topic: "team", meaning: "Showing two versions to different users to see which works better.", see: ["Conversion rate", "Feature flag"] },
  { term: "Funnel", topic: "team", meaning: "The steps users go through toward a goal, and where they drop off along the way.", see: ["Conversion rate"] },
  { term: "Conversion rate", topic: "team", meaning: "The share of people who complete a goal, like signing up or buying.", see: ["Funnel"] },
  { term: "Retention", topic: "team", meaning: "How many users keep coming back over time." },
  { term: "KPI (key performance indicator)", topic: "team", meaning: "A number a team tracks to see whether it is meeting its goals.", see: ["OKR (objectives and key results)"] },
  { term: "OKR (objectives and key results)", topic: "team", meaning: "A goal-setting method: a clear objective plus measurable results that show progress.", see: ["KPI (key performance indicator)"] },
  { term: "North Star metric", topic: "team", meaning: "The one number a product team treats as the best sign of value delivered to users." },
  { term: "NPS (Net Promoter Score)", topic: "team", meaning: "A survey score based on how likely people are to recommend a product." },
  { term: "Agile", topic: "team", meaning: "A way of working in short cycles, shipping small pieces and adjusting as you learn.", see: ["Sprint"] },
  { term: "Sprint", topic: "team", meaning: "A fixed, short period, often one or two weeks, where a team finishes a set of work.", see: ["Agile", "Backlog"] },
  { term: "Backlog", topic: "team", meaning: "The ordered list of work a team plans to do.", see: ["Ticket"] },
  { term: "Ticket", topic: "team", meaning: "A task in a tracker like Jira or Linear, describing one piece of work.", see: ["Acceptance criteria"] },
  { term: "Acceptance criteria", topic: "team", meaning: "The conditions a piece of work must meet to count as done.", see: ["Ticket"] },
  { term: "Standup", topic: "team", meaning: "A short daily team check-in on progress and blockers." },
  { term: "Retro (retrospective)", topic: "team", meaning: "A team meeting after a sprint or project to discuss what went well and what to change." },
  { term: "Edge case", topic: "team", meaning: "An unusual situation a design must still handle, like a very long name or no internet.", see: ["Handoff"] },
  { term: "Single source of truth", topic: "team", meaning: "One agreed place where a piece of information lives, so everyone uses the same version." },
  { term: "Dogfooding", topic: "team", meaning: "Using your own product day to day to find problems before users do." },
  { term: "IC (individual contributor)", topic: "team", meaning: "Someone who does the hands-on work rather than managing people.", see: ["Super IC"] },
  { term: "Super IC", topic: "team", meaning: "A senior hands-on person with wide scope and no direct reports. Some teams use it for people who work across design and code.", see: ["IC (individual contributor)"] },
  { term: "Product-led company", topic: "team", meaning: "A company that grows mainly through people trying and using the product, rather than through sales calls.", see: ["SaaS"] },
  { term: "Seed-stage startup", topic: "team", meaning: "A young company on its first round of money from outside investors, usually with a small team." },
  { term: "SaaS", topic: "team", meaning: "Software as a service: software you use in the browser on a subscription, like Figma or Notion.", see: ["B2B"] },
  { term: "B2B", topic: "team", meaning: "Business to business: products sold to companies rather than to individual people.", see: ["SaaS"] },
  { term: "LLM (large language model)", topic: "ai", meaning: "The kind of AI behind chat tools that reads and writes text.", see: ["Prompt", "Hallucination"] },
  { term: "Prompt", topic: "ai", meaning: "The instructions or question you give an AI tool.", see: ["LLM (large language model)"] },
  { term: "AI agent", topic: "ai", meaning: "An AI tool that can carry out a task with several steps on its own, like editing files, instead of only chatting.", see: ["AX (Agentic Experience)", "Guardrail"] },
  { term: "AX (Agentic Experience)", topic: "ai", meaning: "Design for products where AI agents act for the user, not just answer questions.", see: ["AI agent", "Human-in-the-loop (HITL)"] },
  { term: "Vibe coding", topic: "ai", meaning: "Building software mostly by describing what you want to an AI tool, then refining what it makes. You don't need a coding background to try it.", see: ["Prompt"] },
  { term: "Hallucination", topic: "ai", meaning: "When an AI tool states something false as if it were true.", see: ["Eval"] },
  { term: "Context window", topic: "ai", meaning: "How much text an AI model can take in at once, including your prompt and files." },
  { term: "Eval", topic: "ai", meaning: "A repeatable test that checks how well an AI feature performs.", see: ["Hallucination"] },
  { term: "Guardrail", topic: "ai", meaning: "A limit built into a product or AI tool that stops a risky action or asks a person to approve it.", see: ["Human-in-the-loop (HITL)"] },
  { term: "Human-in-the-loop (HITL)", topic: "ai", meaning: "A person approves each step before the AI acts.", see: ["Human-on-the-loop (HOTL)", "Guardrail"] },
  { term: "Human-on-the-loop (HOTL)", topic: "ai", meaning: "The AI acts on its own while a person watches and can step in.", see: ["Human-in-the-loop (HITL)"] },
  { term: "MCP (Model Context Protocol)", topic: "ai", meaning: "A standard that lets AI tools connect to other apps, to read their data and take actions.", see: ["Figma MCP"] },
  { term: "Figma MCP", topic: "ai", meaning: "Lets AI coding tools read your Figma designs, tokens and components directly.", see: ["MCP (Model Context Protocol)", "Code Connect"] },
  { term: "Token taxonomy", topic: "design", meaning: "How design tokens are named, grouped and layered. Clear names help both people and AI tools pick the right one.", see: ["Semantic tokens", "Design tokens"] },
  { term: "A2A (Agent-to-Agent)", topic: "ai", meaning: "A standard that lets AI agents pass tasks and updates to each other.", see: ["MCP (Model Context Protocol)"] },
  { term: "AG-UI", topic: "ai", meaning: "A standard for sending live updates from an AI agent to the app screen.", see: ["A2UI (Agent-to-User Interface)"] },
  { term: "A2UI (Agent-to-User Interface)", topic: "ai", meaning: "A standard that lets an agent show users only components from an approved design system.", see: ["AG-UI", "Design system"] },
];
