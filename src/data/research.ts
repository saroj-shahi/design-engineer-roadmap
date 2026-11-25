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
  id: string;
  name: string;
  short: string;
  focus: string;
  deliverable: string;
  signals: string;
  skills: string[];
  skillStats?: { label: string; value: number }[];
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

export interface Pattern {
  code: string;
  name: string;
}

export interface PatternCategory {
  id: string;
  name: string;
  objective: string;
  patterns: Pattern[];
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

export interface Month {
  month: number;
  focus: string;
  deliverable: string;
  guardrail: string;
  aiPolicy: "none" | "read" | "assist" | "oversee" | "production" | "position";
}

export interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
}

/* ───────────── §1 Macro market ───────────── */

export const heroMetrics: Metric[] = [
  {
    value: "−48%",
    label: "Design hiring at 12 tech majors vs. 2019",
    scope: "12 tech majors, June 2026",
    source: "SignalFire, State of Talent 2026",
    basis: "analytics",
  },
  {
    value: "55%",
    label: "Share of tech-major hiring that is software engineers (46% in 2019)",
    scope: "Tech majors, 2026",
    source: "SignalFire, State of Talent 2026",
    basis: "analytics",
  },
  {
    value: "50%",
    label: "Designers shipping AI-generated code to production",
    scope: "Q1 2026 survey",
    source: "Designer Fund / Foundation Capital",
    basis: "survey",
  },
  {
    value: "20%",
    label: "Designers who say first production builds match their designs",
    scope: "Product designer survey",
    source: "CollabSoft",
    basis: "survey",
  },
];

export const marketMetrics: Metric[] = [
  { value: "−48%", label: "Design hiring at tech majors vs. 2019", scope: "12 tech majors, June 2026", source: "SignalFire", basis: "analytics" },
  { value: "−22%", label: "Design hiring at early-stage startups vs. 2019", scope: "Startup cohort, June 2026", source: "SignalFire", basis: "analytics" },
  { value: "−39%", label: "Product management hiring at tech majors", scope: "Tech majors vs. 2019", source: "SignalFire", basis: "analytics" },
  { value: "−36%", label: "Marketing hiring at tech majors", scope: "Tech majors vs. 2019", source: "SignalFire", basis: "analytics" },
  { value: "−11% / +7%", label: "Software engineering hiring: majors / startups", scope: "vs. 2019", source: "SignalFire", basis: "analytics" },
  { value: "−65% / −76%", label: "Entry-level hiring: majors / startups", scope: "Tech-wide, June 2026", source: "SignalFire", basis: "analytics" },
  { value: "−25%", label: "Front-end share of engineering hiring vs. 2022", scope: "Engineering roles, June 2026", source: "SignalFire", basis: "analytics" },
  { value: "12.6–13%", label: "Annual design attrition (≈9% for engineers)", scope: "2026", source: "SignalFire", basis: "analytics" },
  { value: "3,423 vs. 20,726", label: "US postings: Design Engineer vs. Product Design", scope: "US postings, Oct 2026 (+15% MoM combined with AI PD)", source: "Academy UX (aggregator)", basis: "analytics" },
  { value: "97%", label: "Design Engineer roles requiring senior level (median 57 days open)", scope: "European listings, July 2026", source: "Hymera", basis: "analytics" },
  { value: "+6%", label: "US web & interface designers, 132,700 → 140,800", scope: "2025 → 2035, SOC 15-1255", source: "US BLS projection", basis: "projection" },
];

export const orgFlattening = [
  { value: "12", label: "Engineers per EM at tech majors", delta: "+14% vs. 2019" },
  { value: "15", label: "Engineers per EM at startups", delta: "+34% vs. 2019" },
  { value: "+22%", label: "More engineers supported per PM", delta: "vs. 2019" },
];

export const handoffCases = [
  {
    org: "Prelude",
    what: "Onboarding software, after adopting design-in-code workflows",
    stats: [
      { from: "31 days", to: "13 days", label: "Avg. feature delivery" },
      { from: "5+", to: "1", label: "Handoff cycles per feature" },
    ],
  },
  {
    org: "Alan",
    what: "French health insurer, non-engineers paired with engineering setup crews",
    stats: [{ from: "", to: "283", label: "Production PRs authored by non-engineers (through Nov 2025)" }],
  },
];

export const adoptionShift = {
  before: {
    label: "Figma 2025 AI report",
    rows: [
      { who: "Developers prompting AI for code", value: 68 },
      { who: "Developers using AI for core tasks", value: 59 },
      { who: "Designers using AI for core tasks", value: 31 },
      { who: "Designers using AI for first UI drafts", value: 22 },
    ],
  },
  after: {
    label: "Q1 2026 (Designer Fund / Foundation Capital)",
    rows: [
      { who: "Designers shipping AI code to production", value: 50 },
      { who: "…of whom use the “Design Engineer” title", value: 20 },
      { who: "Teams where PMs/engineers now generate UI", value: 40 },
    ],
  },
};

/* ───────────── §2 Archetypes ───────────── */

export const archetypes: Archetype[] = [
  {
    id: "de",
    name: "Design Engineer",
    short: "Owns the diff",
    focus: "Product or Brand/Web track",
    fitsIf: "you care about the last 10% of polish, already tinker in code, and want to own what actually ships.",
    plan: "pde",
    deliverable:
      "Merged PRs in production codebases. Direct ownership of UI components, design tokens, responsive states, and visual fidelity inside the git diff.",
    signals: "High demand at Vercel, Cursor, Replit, Linear, Lovable, Raycast, and Profound.",
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
    short: "Encodes the system",
    focus: "Governance & guardrails",
    fitsIf: "you think in systems, enjoy tokens and governance, and want to set the rules other people (and AI) build with.",
    plan: "meta",
    deliverable:
      "Multi-surface design-system governance, Figma MCP data architecture, component constraints, and AI-ready design guardrails.",
    signals:
      "Required in orgs running 1:15 to 1:20 designer-to-engineer ratios (product-led orgs sit at 1:2 to 1:9).",
    skills: [
      "Large-scale systems architecture",
      "Business logic comprehension",
      "Design token taxonomy",
      "Guardrails for non-designer UI generation",
    ],
  },
  {
    id: "ax",
    name: "Agentic Experience (AX) Designer",
    short: "Orchestrates the agent",
    focus: "AI product design",
    fitsIf: "you're drawn to AI products and research, and to designing for trust, uncertainty and handover between people and agents.",
    plan: "meta",
    deliverable:
      "Intent-first user flows, human-in-the-loop delegation interfaces, confidence transparency, and probabilistic failure-recovery frameworks.",
    signals: "Deployed across AI-native SaaS, autonomous workflow suites, and complex conversational systems.",
    skills: [
      "AI trust architecture",
      "Edge-case orchestration",
      "Behavioral UX testing",
      "Probabilistic error mitigation",
      "Co-agency UX",
    ],
  },
];

/* ───────────── §3.4 Comparison ───────────── */

export const comparison: CompareRow[] = [
  {
    dimension: "Primary artifacts",
    traditional: "Research decks, personas, empathy maps, static wireframes, non-functional Figma prototypes.",
    hybrid: "Live web apps, public GitHub repos, token systems, functional production code.",
  },
  {
    dimension: "Core skill assessment",
    traditional: "Visual polish, UX research methods, static design tool proficiency (Figma).",
    hybrid: "Code quality (HTML/CSS/JS/React), component architecture, ARIA compliance, design tokens, AI tool usage.",
  },
  {
    dimension: "Iteration velocity",
    traditional: "Dependent on engineering availability to translate static designs into software.",
    hybrid: "High functional autonomy: from visual concept to working browser code independently.",
  },
  {
    dimension: "Interview focus",
    traditional: "Portfolio walkthroughs, visual design critiques, whiteboard wireframing.",
    hybrid: "Codebase reviews, architecture walkthroughs, AI workflow fluency demos, technical trade-off discussions.",
  },
];

export const basisLabel: Record<BasisKind, string> = {
  survey: "Survey",
  analytics: "Talent analytics",
  projection: "Gov. projection",
  case: "Case study",
};

/* ───────────── §5 Skills architecture ───────────── */

export const coreSkills: Skill[] = [
  {
    name: "Problem framing & business alignment",
    detail: "Structure ambiguous business challenges into actionable product initiatives while managing multi-stakeholder requirements.",
    tags: ["Strategy"],
  },
  {
    name: "Human craft, visual taste & curation",
    detail:
      "Visual hierarchy, micro-interaction polish, typography, and judgment. Still essential when first drafts are generated. Over 80% of designers rely on their own taste and quality bar rather than delegating design decisions to tools.",
    tags: ["Craft"],
  },
  {
    name: "Systems architecture & data logic",
    detail: "Understand back-end business logic, relational data structures, and edge-case handling, backed by systematic behavioral user testing.",
    tags: ["Systems"],
  },
];

export const engineeringSkills: Skill[] = [
  {
    name: "Semantic HTML & modern CSS",
    detail: "Semantic HTML5 with Flexbox and Grid layout algorithms. The roadmap builds this by hand first, with no AI and no frameworks.",
    tags: ["HTML5", "CSS Grid", "Flexbox"],
  },
  {
    name: "DevTools inspection",
    detail: "Use browser Developer Tools for real-time layout and network debugging.",
    tags: ["DevTools"],
  },
  {
    name: "JavaScript & React",
    detail: "State, DOM events, async data (async/await, fetch), and component trees with props, state, and hooks.",
    tags: ["JS", "React"],
  },
  {
    name: "TypeScript",
    detail: "Type-safety fundamentals for component props and data. Named in 42% of Design Engineer listings.",
    tags: ["TypeScript"],
  },
  {
    name: "Tailwind CSS",
    detail: "Utility-first styling. Part of the standardized React + TypeScript + Tailwind stack.",
    tags: ["Tailwind"],
  },
  {
    name: "ARIA accessibility",
    detail: "Write accessible UI components and verify ARIA attributes, including when auditing AI-generated pull requests.",
    tags: ["ARIA", "WCAG"],
  },
  {
    name: "Design tokens",
    detail: "Token architecture and taxonomy that both humans and AI coding tools read from. Clean token structure determines AI output quality.",
    tags: ["Tokens", "Figma MCP"],
  },
  {
    name: "Git & PR literacy",
    detail: "Branching, rebase, merge conflicts, reviewing AI-generated diffs, and running pull request workflows inside production codebases.",
    tags: ["Git", "PRs"],
  },
];

export const axShift = {
  from: "Interface Architecture",
  to: "Experience Orchestration",
  summary:
    "Deliverables move from static screen layouts toward trust frameworks, autonomy policies, and escalation paths.",
};

export const agentMaturity = [
  { level: 1, label: "No adoption", value: 21, detail: "Have not deployed AI agents." },
  { level: 2, label: "Piloting", value: 68, detail: "Piloting agents in sandboxes, no live production." },
  { level: 3, label: "Production", value: 11, detail: "Autonomous agents live in production with enterprise trust governance." },
];

export const axDomains: Skill[] = [
  {
    name: "Shared control & delegation governance",
    detail: "Autonomy Dials let users move from manual control to full automation, with delegation boundaries set by task risk.",
    tags: ["Autonomy Dial"],
  },
  {
    name: "Trust & transparency surfaces",
    detail: "Real-time visibility into each of an agent's capability layers: perception, reasoning, memory, and agency.",
    tags: ["Intent Preview", "Confidence Signal"],
  },
  {
    name: "Failure recovery & escalation choreography",
    detail: "Action Audits with reversible execution windows and explicit undo, plus Escalation Pathways that hand control to humans when confidence thresholds fail.",
    tags: ["Action Audit", "Escalation"],
  },
  {
    name: "Relationship UX & trust calibration",
    detail: "Onboard users on how far to trust an agent, avoid the text-based “uncanny valley” of conversational tropes, and give plain-language Explainable Rationales.",
    tags: ["Explainable Rationale"],
  },
];

export const agentLayers = [
  { id: "perception", name: "Perception", surfaces: ["Active context indicators", "Tool badges", "Input boundaries"] },
  { id: "reasoning", name: "Reasoning", surfaces: ["Expandable thinking panels", "Step-by-step plan previews"] },
  { id: "memory", name: "Memory", surfaces: ["Editable context panels", "Historical user preference logs"] },
  { id: "agency", name: "Agency", surfaces: ["Status timelines: proposed vs. completed actions", "Intent Previews", "Confidence Signals"] },
];

export const protocols: Protocol[] = [
  {
    id: "mcp",
    name: "MCP",
    owner: "Model Context Protocol · Anthropic",
    role: "Open standard connecting AI agents to external data sources, enterprise tools, APIs, and file repositories.",
    ux: "Defines which live product context, design-system variables, and Figma tokens (via Figma MCP) an agent can read and modify.",
  },
  {
    id: "agui",
    name: "AG-UI",
    owner: "CopilotKit",
    role: "Event stream protocol carrying ~16 structured event types over HTTP/SSE or WebSockets between backend agents and frontends.",
    ux: "Enables real-time UI streaming, live status updates, tool execution states, and inline agent feedback loops.",
  },
  {
    id: "a2a",
    name: "A2A",
    owner: "Agent-to-Agent Protocol · Google",
    role: "Communication layer for context handoffs, status reporting, and task delegation across multi-agent networks.",
    ux: "Dictates how multi-agent workflows, inter-agent delegation states, and handoff approvals are shown to end users.",
  },
  {
    id: "a2ui",
    name: "A2UI",
    owner: "Agent-to-User Interface · Google",
    role: "Declarative schema letting backend agents request and instantiate UI components from an approved design-system library.",
    ux: "Agents render secure, accessible, brand-compliant components instead of arbitrary or unstyled HTML.",
  },
  {
    id: "llms",
    name: "llms.txt",
    owner: "& tool manifests",
    role: "Machine-readable context files optimized for LLM parsing and automated developer-tool indexing.",
    ux: "Standardizes design-system component docs and properties for consumption by coding agents.",
  },
];

export const agentArchitectureTerms = ["Prompt chaining", "Routing", "RAG", "Memory orchestration", "Fault tolerance"];

export const patternCategories: PatternCategory[] = [
  {
    id: "supervision",
    name: "Supervision & Control",
    objective:
      "Calibrate human oversight dynamically, hand off control cleanly, and tier approvals by risk: auto-approve low-risk reversible actions, require synchronous approval for high-risk ones.",
    patterns: [
      { code: "HITL", name: "Human-in-the-Loop" },
      { code: "HOTL", name: "Human-on-the-Loop" },
      { code: "MIP", name: "Mixed-Initiative Interfaces" },
      { code: "MON", name: "Monitoring & Control" },
      { code: "AQE", name: "Approval Queues & Escalation Chains" },
    ],
  },
  {
    id: "transparency",
    name: "Transparency & Reasoning",
    objective:
      "Expose agent reasoning steps, data sources, uncertainty, and context limits without overwhelming the user's cognitive capacity.",
    patterns: [
      { code: "PDP", name: "Progressive Disclosure" },
      { code: "CVP", name: "Confidence Visualization" },
      { code: "ASP", name: "Agent Status & Activity" },
      { code: "TTP", name: "Trust & Transparency" },
      { code: "VRP", name: "Visual Reasoning Panels" },
      { code: "CWM", name: "Context Window Management" },
    ],
  },
  {
    id: "interaction",
    name: "Interaction & Modality",
    objective:
      "Move beyond text chat into runtime-rendered UI widgets, low-latency voice, multi-agent collaboration surfaces, and context-aware modal transitions.",
    patterns: [
      { code: "GenUI", name: "Generative UI" },
      { code: "RVA", name: "Realtime Voice Agents" },
      { code: "CIP/CHI", name: "Conversational & Chat Patterns" },
      { code: "ACX", name: "Agent Collaboration UX" },
      { code: "AIP", name: "Adaptive Patterns" },
      { code: "AAP", name: "Ambient Patterns" },
      { code: "MMIP", name: "Multimodal Patterns" },
      { code: "CPX", name: "Cross-Platform Patterns" },
    ],
  },
  {
    id: "trust",
    name: "Trust, Privacy & Compliance",
    objective:
      "Fail gracefully, comply with GDPR/CCPA/AI Acts, offer granular data controls, and keep every AI interaction state accessible.",
    patterns: [
      { code: "ERP", name: "Error Handling & Recovery" },
      { code: "OEP", name: "Onboarding & Education" },
      { code: "PbD", name: "Privacy-by-Design" },
      { code: "GPC", name: "Granular Privacy Controls" },
      { code: "PCC", name: "Progressive Consent" },
      { code: "TDH", name: "Transparent Data Handling" },
      { code: "UPD", name: "User Empowerment Dashboards" },
      { code: "RCX", name: "Regulatory Compliance" },
      { code: "APT", name: "Advanced Privacy UX" },
      { code: "AAD", name: "Accessibility in Agent Design" },
    ],
  },
];

/* ───────────── §6 Tooling ───────────── */

export const toolStages: ToolStage[] = [
  {
    id: 1,
    name: "Visual Prototyping",
    tools: ["Claude Design", "Figma Make", "Google Stitch"],
    capabilities: "Prompt-driven interface creation, visual direction exploration, deck generation, interactive prototypes, canvas explorations.",
    guardrail:
      "Treat output as visual exploration, not final layout. Manually verify real-content scalability, edge states, and accessibility.",
  },
  {
    id: 2,
    name: "Design-Code Context & Roundtrips",
    tools: ["Figma MCP", "Codex (Figma integration)", "Claude Code (Figma plugin/MCP)"],
    capabilities:
      "Bidirectional sync: agents extract Figma tokens, variables, and Code Connect components, or convert code back to editable Figma layers.",
    guardrail:
      "Agents mirror their input. Unstructured Figma files produce poor code, so keep token structures and component naming clean.",
  },
  {
    id: 3,
    name: "Production UI & Repo Work",
    tools: ["Codex", "Claude Code", "v0 (Vercel)", "Cursor"],
    capabilities: "Production diffs, multi-file refactors, React component generation (v0), inline editing (Cursor), GitHub PR generation.",
    guardrail:
      "Requires front-end literacy to audit PRs, inspect test coverage, verify ARIA tags, and protect codebase architecture.",
  },
  {
    id: 4,
    name: "App Builders (MVPs & Demos)",
    tools: ["Replit (Agent 4 & Design Canvas)", "Lovable", "Bolt"],
    capabilities: "Rapid full-stack apps, database integrations, admin dashboards, and proof-of-concept software.",
    guardrail:
      "Audit for unstyled default components, missing empty/error states, weak visual hierarchy, and security vulnerabilities.",
  },
  {
    id: 5,
    name: "Creative Production Workflows",
    tools: ["Claude Creative Connectors", "Adobe Firefly AI Assistant"],
    capabilities:
      "Batch media manipulation, asset resizing, color grading, and creative scripting across Photoshop, Illustrator, Premiere, Blender.",
    guardrail:
      "Built for asset production, not app UI. Inspect outputs for visual artifacts, destructive edits, and IP compliance.",
  },
];

export const roleStacks: RoleStack[] = [
  {
    id: "junior",
    label: "Student / Junior",
    chain: ["Figma", "Claude Design / Figma Make / Stitch", "Cursor (basic React/CSS)"],
    summary:
      "Learn core principles in Figma, prototype fast with Claude Design, Figma Make, or Stitch, and use Cursor to learn basic front-end implementation.",
    stages: [1, 3],
    toolsByStage: { 1: ["Claude Design", "Figma Make", "Google Stitch"], 3: ["Cursor"] },
  },
  {
    id: "mid",
    label: "Mid-level",
    chain: ["Figma", "Figma MCP", "v0 (React UI)", "Cursor / Claude Code"],
    summary:
      "Pair Figma with Figma MCP for design-system extraction, use v0 for React structure, and manage revisions and PRs in Cursor, Codex, or Claude Code.",
    stages: [2, 3],
    toolsByStage: { 2: ["Figma MCP"], 3: ["v0 (Vercel)", "Cursor", "Claude Code", "Codex"] },
  },
  {
    id: "senior",
    label: "Senior / Lead",
    chain: ["Figma Tokens · Variables · Code Connect", "Figma MCP", "Codex / Claude Code / v0 / Cursor"],
    summary:
      "Standardize the org's system with Figma variables and Code Connect linked to Figma MCP. Set shared code-gen workflows; keep Figma Make or Claude Design for early exploration.",
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
      "End-to-end: explore in Claude Design, prototype in Figma Make, generate components in v0, and ship production PRs via Codex or Claude Code paired with Figma MCP.",
    stages: [1, 2, 3],
    toolsByStage: {
      1: ["Claude Design", "Figma Make"],
      2: ["Figma MCP"],
      3: ["v0 (Vercel)", "Codex", "Claude Code", "Cursor"],
    },
  },
  {
    id: "creative",
    label: "Creative Production",
    chain: ["Adobe Creative Cloud", "Firefly AI Assistant", "Claude Creative Connectors"],
    summary:
      "Maximize production throughput with Claude Creative Connectors and Firefly AI Assistant inside native design, 3D, and media tools.",
    stages: [5],
    toolsByStage: { 5: ["Claude Creative Connectors", "Adobe Firefly AI Assistant"] },
  },
];

/* ───────────── §3 Track A: practicing designers ───────────── */

export const trackAOptions = [
  {
    id: "pde",
    name: "Product Design Engineer",
    for: "Visual craft, micro-interactions, component systems, and direct codebase ownership.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Git", "AI-native IDEs"],
  },
  {
    id: "meta",
    name: "Meta-Designer / AX Designer",
    for: "Systemic abstraction, research synthesis, business strategy, and complex workflow orchestration.",
    stack: [
      "Design systems as machine-readable AI pipelines (tokens + Figma MCP)",
      "Trust & failure-recovery protocols for agents",
      "Enough front-end literacy to audit AI code",
    ],
  },
];

export const sixMonthPlan: Month[] = [
  {
    month: 1,
    focus: "HTML5, CSS layout algorithms (Flexbox, Grid), and DevTools layout inspection.",
    deliverable: "3 static, fully responsive landing pages, built from scratch without frameworks.",
    guardrail: "Zero AI code generation, zero CSS frameworks. Build manual layout-debugging muscle memory.",
    aiPolicy: "none",
  },
  {
    month: 2,
    focus: "Vanilla JS (DOM, events, async/await, fetch), then React (composition, props, state, hooks).",
    deliverable: "Read, navigate, and modify an existing multi-component React tree.",
    guardrail: "Prioritize reading and adjusting real code structures over memorizing syntax.",
    aiPolicy: "read",
  },
  {
    month: 3,
    focus: "Tailwind CSS, design token architecture, TypeScript fundamentals.",
    deliverable: "Build and deploy 1 custom utility tool or live interactive web app.",
    guardrail: "Freely use AI coding tools (Cursor, Claude Code) to speed up syntax and components.",
    aiPolicy: "assist",
  },
  {
    month: 4,
    focus: "AI-native repo management, complex app state, agentic UI interaction patterns.",
    deliverable: "Deploy a multi-page app, e.g. an agentic dashboard or SaaS interface with auth.",
    guardrail: "Configure Cursor (Design Mode) or Claude Code. Keep personal oversight of architecture and AI edge-case logic.",
    aiPolicy: "oversee",
  },
  {
    month: 5,
    focus: "Production Git (branching, rebase, conflicts), design-system integration, peer code review.",
    deliverable: "Submit 1–3 production PRs: CSS bugs, accessibility states, or component variants.",
    guardrail: "Take real front-end QA tasks at work, or contribute to open-source UI libraries.",
    aiPolicy: "production",
  },
  {
    month: 6,
    focus: "Hybrid positioning, portfolio built on live code, targeted applications.",
    deliverable: "Rebuild portfolio around live software, public GitHub repos, and merged PRs.",
    guardrail: "~20 highly targeted applications to hybrid-friendly teams, not high-volume generic ones.",
    aiPolicy: "position",
  },
];

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
    title: "Pre-program design systems into org AI tools",
    detail:
      "Link token repos, accessibility rules, and component docs to AI coding tools via Figma MCP or shared workspace prompts, so PMs and engineers generate UI against your standards.",
  },
  {
    id: "nonengpr",
    title: "Institute the “non-engineer PR” workflow",
    detail:
      "Partner with front-end leads to review and merge small visual PRs: micro-copy, spacing, hover states, token fixes. Mirrors Alan's setup-crew model.",
  },
  {
    id: "upstream",
    title: "Shift time upstream to ambiguous problem framing",
    detail:
      "Reinvest hours saved on routine layouts into business logic, trust architecture for AI features, and validating real user workflows.",
  },
  {
    id: "isolation",
    title: "Actively counteract workflow isolation",
    detail:
      "20% of designers report feeling isolated (up from 5% in 2025). Ground your leverage in cross-functional decision clarity and user outcomes, not screen volume.",
  },
];

export const hybridPortfolio: ChecklistItem[] = [
  { id: "demo", title: "10-second live interactive demos", detail: "Deploy links (Vercel, GitHub Pages) so hiring managers test interactions in a browser immediately." },
  { id: "repo", title: "Public GitHub repositories", detail: "Let engineers inspect component structure, state management, CSS architecture, and ARIA properties." },
  { id: "writeup", title: "Concise technical & design writeups", detail: "2–3 paragraphs: product intent, key design decisions, engineering trade-offs, planned iterations." },
  { id: "aiproof", title: "Explicit AI workflow proof", detail: "Documented evidence of directing Cursor or Claude Code to build production-grade features." },
];

/* ───────────── §4 Track B: beginners ───────────── */

export const beginnerContext = [
  { value: "−65%", label: "Entry hiring at tech majors" },
  { value: "−76%", label: "Junior hiring at startups" },
  { value: "300–800", label: "Applications per posting" },
  { value: "~90%", label: "Hiring managers expecting a strong junior portfolio" },
];

export const launchStages = [
  {
    n: 1,
    name: "Master durable fundamentals",
    detail:
      "Before using AI screen generators: usability principles, WCAG accessibility, typography, information architecture, interaction patterns. Deconstruct real products to find workflow failures and system logic.",
    output: "Fundamentals you can explain, not just apply",
  },
  {
    n: 2,
    name: "Develop code-literate prototyping",
    detail:
      "Learn HTML5 and CSS3 alongside AI prototyping tools (Figma Make, v0, Lovable, Bolt, Cursor). Build functional, stateful browser prototypes instead of canvas drawings.",
    output: "Stateful prototypes running in a browser",
  },
  {
    n: 3,
    name: "Ship real solutions for real users",
    detail:
      "Skip speculative Spotify or Uber redesigns. Solve real problems for local businesses, community orgs, open-source projects, or niche SaaS. Test live and document how feedback changed your assumptions.",
    output: "Live work with real-user evidence",
  },
  {
    n: 4,
    name: "Package for targeted funnels",
    detail:
      "3–4 concise, skimmable case studies aimed at seed-stage startups (highest relative design hiring rate, 25%), boutique agencies, and vertical B2B, not only big-tech junior portals.",
    output: "A portfolio aimed at where hiring happens",
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
    title: "Immediate context & explicit scope",
    detail: "Who you are, the exact problem, and your personal responsibilities, before any visuals. Label personal and academic work as speculative.",
  },
  {
    id: "changed",
    title: "Evidence of changed thinking",
    detail: "Raw findings, discarded directions, and validation results that forced revisions. Reflective, not a sanitized linear process.",
  },
  {
    id: "functional",
    title: "Functional proof over static mockups",
    detail: "Links to live deployed apps (Vercel, Lovable, React builds) or video walkthroughs of real interaction states.",
  },
  {
    id: "friction",
    title: "Zero-friction access & discipline",
    detail: "No passwords, broken links, or clutter. A focused toolchain: Figma + Claude Design / Figma Make / Stitch to explore; React, Tailwind, Cursor to build.",
  },
];

export const icGrowth = [
  {
    name: "Consistent execution reliability",
    detail: "Ship quality, accessible components on schedule without constant senior intervention or repeated visual corrections.",
  },
  {
    name: "Frictionless cross-functional communication",
    detail: "Work proactively with front-end engineers and PMs. Seek technical reviews early; treat code reviews as learning.",
  },
  {
    name: "Independent autonomy in ambiguity",
    detail: "Graduate from well-defined UI tickets to end-to-end features: discovery, edge cases, accessibility validation, deployment.",
  },
];

/* ───────────── Self-assessment ───────────── */

export const readinessItems: ChecklistItem[] = [
  { id: "demo", title: "10-second live browser demo", detail: "A deployed link a reviewer can open and use instantly." },
  { id: "repo", title: "Public GitHub repository", detail: "Readable components, state, CSS architecture, and ARIA properties." },
  { id: "writeup", title: "2–3 paragraph design + engineering writeup", detail: "Intent, decisions, trade-offs, and next iterations." },
  { id: "ai", title: "Demonstrated AI-assisted workflow", detail: "Evidence you directed Cursor or Claude Code to ship real features." },
  { id: "access", title: "Zero-friction access", detail: "No password walls, no broken links, no clutter." },
  { id: "scope", title: "Honest scope labeling", detail: "Your exact role stated; speculative work labeled as such." },
  { id: "deployed", title: "A multi-page app you built and deployed", detail: "Routing, state and responsive layouts, live on Vercel or similar. Month 4 of the plan." },
  { id: "merged", title: "A merged pull request in a real codebase", detail: "Even a small UI fix in your team's repo or an open-source project. Month 5 of the plan." },
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
  { title: "GenFaceUI: Meta-Design of Generative Personalized Facial ... - arXiv", url: "https://arxiv.org/html/2602.11055v1" },
  { title: "GenFaceUI: Meta-Design of Generative Personalized Facial", url: "https://yate.fun/assets/pdf/ge2026genfaceui.pdf" },
  { title: "Best remote Design Process employees for hire in Oct 2026", url: "https://himalayas.app/talent/design-process" },
  { title: "Best remote Dashboard Design employees for hire in Oct 2026", url: "https://himalayas.app/talent/dashboard-design" },
  { title: "Product Designer – Canva — Relocate.me - IT Jobs Abroad", url: "https://relocate.me/australia/sydney/canva/product-designer-4247" },
  { title: "The Next Curve: Why the Design Engineer is the Future of Product", url: "https://medium.com/@moeinsaboohi96/the-next-curve-why-the-design-engineer-is-the-future-of-product-creation-87dc0199ff03" },
  { title: "From UX Designer to UX Engineer: The Hybrid Role AI Just Made", url: "https://www.designsystemscollective.com/from-ux-designer-to-ux-engineer-the-hybrid-role-ai-just-made-inevitable-e75090f37e02" },
  { title: "Designer hiring at big tech is down 48% since 2019 — Design Bootcamp", url: "https://medium.com/design-bootcamp/designer-hiring-at-big-tech-is-down-48-since-2019-new-job-titles-keep-appearing-d02260aa305f" },
  { title: "Craft - AI in Design Report 2026", url: "https://stateofaidesign.com/chapters/craft" },
  { title: "State of UX 2026 — NN/g", url: "https://www.nngroup.com/articles/state-of-ux-2026/" },
  { title: "Is it realistic to land a junior UX/UI job in 2026? - Mate academy", url: "https://mate.academy/en/answers/ui-ux-design/uxui-junior-market-2026" },
  { title: "Entry Level UI UX Jobs in 2026 Are Disappearing | by Ahnaf Tahmid", url: "https://medium.com/design-bootcamp/entry-level-ui-ux-jobs-in-2026-are-disappearing-364d3b5e04ee" },
  { title: "Being a Product Designer in 2026 Without Losing Your Mind - Medium", url: "https://medium.com/design-bootcamp/being-a-product-designer-in-2026-without-losing-your-mind-5ca7f4e683b6" },
  { title: "What a Junior Product Designer Portfolio Needs in 2026 (Hiring", url: "https://fueler.io/blog/what-a-junior-product-designer-portfolio-needs" },
  { title: "Software Engineer Jobs at Startups | RFS", url: "https://www.recruitingfromscratch.com/roles/software-engineer" },
  { title: "SignalFire data shows engineering hiring is more resilient than", url: "https://startupfortune.com/signalfire-data-shows-engineering-hiring-is-more-resilient-than-almost-anyone-expected/" },
  { title: "Why storytelling is now the most valuable skill in tech : r/UXDesign", url: "https://www.reddit.com/r/UXDesign/comments/1x63dvr/why_storytelling_is_now_the_most_valuable_skill/" },
  { title: "UX Designer Demand and Hiring Market Outlook for Employers 2026", url: "https://designcareers.aiga.org/career-resources/hire-designers-11/ux-designer-hiring-market-demand-and-supply-2026-158" },
  { title: "How Figma, Midjourney, Databricks, and Modyfi Harness AI with", url: "https://designerfund.com/blog/how-figma-midjourney-and-databricks-harness-ai-in-design" },
  { title: "Careers at Profound", url: "https://www.tryprofound.com/careers" },
  { title: "Careers at Raycast: Build, Innovate, and Work from Anywhere", url: "https://www.raycast.com/careers" },
  { title: "Best AI Tools for Designers in 2026: Choose by Workflow - The Crit", url: "https://thecrit.co/resources/best-ai-coding-tools-designers-2026" },
  { title: "On the hunt for the elusive product-led employer | Melio's R&D blog", url: "https://medium.com/meliopayments/on-the-hunt-for-the-elusive-product-led-employer-106da39537e1" },
  { title: "Interleavings: Notes & Thoughts on Recent Reads, 9 November 2026", url: "https://sajithpai.com/interleavings-notes-thoughts-on-recent-reads-9-november-2026/" },
  { title: "One system, one conversation. Designing LowerOS for borrowers", url: "https://laurabsteele.com/portfolio/lower-end-to-end" },
  { title: "AX Design Explained: The 2026 Guide to Agentic Experience", url: "https://www.pixelmojo.io/blogs/what-is-ax-design-complete-guide-agentic-experience-2026" },
  { title: "Agentic UI/UX Design Patterns", url: "https://agentic-design.ai/patterns/ui-ux-patterns" },
  { title: "Design Team Promotion Framework: Timelines, KPIs, and What It", url: "https://medium.muz.li/design-team-promotion-framework-timelines-kpis-and-what-it-really-takes-to-grow-028ac1f98ebf" },
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
    skills: ["Production React & TypeScript", "Git & pull requests", "Modern CSS & Tailwind", "AI IDE fluency: Cursor, v0, Codex"],
  },
  {
    id: "meta",
    sets: ["meta"],
    name: "Meta-Designer",
    detail: "Systems track",
    skills: ["Design token architecture", "System-level governance & accessibility guardrails", "Figma MCP integration", "Business logic encoding"],
  },
  {
    id: "ax",
    sets: ["ax"],
    name: "AX Designer",
    detail: "Agentic track",
    skills: ["Trust & transparency architecture", "Human-in-the-loop autonomy controls", "Failure recovery choreography", "Agent protocol literacy: MCP, AG-UI, A2A, A2UI"],
  },
  { id: "de-meta", sets: ["de", "meta"], name: "Code–system bridge", detail: "Wiring design tokens into production components." },
  { id: "de-ax", sets: ["de", "ax"], name: "Dynamic runtime execution", detail: "Generative UI that is composed and rendered at runtime." },
  { id: "meta-ax", sets: ["meta", "ax"], name: "Context & guardrail protocol", detail: "Prompt rules and constraints that keep agents on-system." },
  {
    id: "core",
    sets: ["de", "meta", "ax"],
    name: "Shared core",
    detail: "Visual taste and quality discernment, plus framing problems against measurable business outcomes.",
  },
];
