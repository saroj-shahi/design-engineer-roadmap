/**
 * Topic curricula sourced from official roadmaps on roadmap.sh.
 * Kept separate from `research.ts` so statistical figures from the 2026 research
 * brief remain isolated from external syllabus trees.
 */

export type RoadmapGroup = "design" | "engineering-ai";

export interface TopicBranch {
  /** Sub-group heading inside a milestone (omit when topics sit directly under the milestone). */
  heading?: string;
  items: string[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  summary: string;
  branches: TopicBranch[];
}

export interface ExternalRoadmap {
  slug: string;
  title: string;
  shortTitle: string;
  url: string;
  group: RoadmapGroup;
  tagline: string;
  /** Which roles or tracks in this guide benefit most from this roadmap. */
  fits: string[];
  /** Slugs of other roadmaps in this list that connect directly to this one. */
  related: string[];
  milestones: RoadmapMilestone[];
}

export interface CompanionRoadmap {
  slug: string;
  title: string;
  url: string;
  category: "Design & Web" | "Front-end Code" | "AI Tooling";
  summary: string;
  planLink: string;
}

export const externalRoadmaps: ExternalRoadmap[] = [
  {
    slug: "ux-design",
    title: "UX Design",
    shortTitle: "UX Design",
    url: "https://roadmap.sh/ux-design",
    group: "design",
    tagline:
      "Behavioral psychology, product framing, conceptual design, wireframing, UX patterns and experimentation.",
    fits: ["Track B · Beginners", "AX Designer", "All designers"],
    related: ["product-design", "design-system", "ai-product-builder", "frontend"],
    milestones: [
      {
        id: "decision-making",
        title: "Human Decision Making",
        summary: "How people weigh choices, react intuitively, and respond to friction or prompts.",
        branches: [
          {
            heading: "Frameworks",
            items: [
              "BJ Fogg's Behavior Model",
              "CREATE Action Funnel",
              "Spectrum of Thinking Interventions",
              "Dual Process Theory",
            ],
          },
          {
            heading: "Key concepts",
            items: [
              "Nudge Theory",
              "Persuasive Technology",
              "Behavioral Science",
              "Behavioral Economics",
              "Behavior Design",
            ],
          },
        ],
      },
      {
        id: "behavior-change",
        title: "Behavior Change Strategies",
        summary: "Classifying user behaviors and choosing between defaults, habit loops and conscious action.",
        branches: [
          {
            heading: "Classifying behavior & shortcuts",
            items: [
              "BJ Fogg's Behavior Grid",
              "Defaulting",
              "Making it Incidental",
              "Automate the Act of Repetition",
            ],
          },
          {
            heading: "Existing habits",
            items: [
              "Help user avoid the cue",
              "Replace the routine",
              "Use consciousness to interfere",
              "Mindfulness to avoid acting on the cue",
              "Crowd out old habit with new behavior",
            ],
          },
          {
            heading: "New habits & conscious action",
            items: [
              "Nir Eyal's Hook Model",
              "Cue-Routine-Reward Model",
              "Educate & encourage user",
              "Help user think about their action",
            ],
          },
        ],
      },
      {
        id: "understanding-product",
        title: "Understanding the Product",
        summary: "Clarifying target outcomes, defining users, and mapping the business model before drawing screens.",
        branches: [
          {
            heading: "Clarify product & users",
            items: [
              "Target Outcome",
              "Target Actor",
              "Target Action",
              "Create User Personas",
            ],
          },
          {
            heading: "Existing business model",
            items: ["Business Model Canvas", "Lean Canvas"],
          },
          {
            heading: "New business model",
            items: [
              "Business Model Inspirator",
              "Competitor Analysis",
              "Porter's Five Forces Model",
              "SWOT Analysis",
            ],
          },
        ],
      },
      {
        id: "conceptual-design",
        title: "Conceptual Design",
        summary: "Turning requirements into user stories, flows, wireframes and clear layout rules.",
        branches: [
          {
            heading: "Backlog & clarity rules",
            items: [
              "Product Backlog & User Stories",
              "Keep it short and simple",
              "Make it easy to understand and complete",
              "Make progress visible to user",
              "Make progress meaningful to reward user",
              "Make successful completion clearly visible",
            ],
          },
          {
            heading: "Wireframing",
            items: ["Figma", "Sketch", "Balsamiq", "Good Layout Rules"],
          },
          {
            heading: "Deliverables & process models",
            items: [
              "Customer Experience Map (Mel Edwards)",
              "Simple Flowchart",
              "Event-driven Process Chain Model (EPC)",
              "Business Process Model & Notation (BPMN)",
            ],
          },
        ],
      },
      {
        id: "prototyping",
        title: "Prototyping",
        summary: "Testing ideas interactively before engineering commits to production code.",
        branches: [
          {
            items: [
              "Interactive clickable prototypes",
              "Rapid validation of flows & states",
              "Validating layout & comprehension with users",
            ],
          },
        ],
      },
      {
        id: "ux-best-practices",
        title: "UX Best Practices & Patterns",
        summary: "Designing for scarce attention, intuitive trust, low cognitive load and effortless follow-through.",
        branches: [
          {
            heading: "Patterns for scarce attention",
            items: [
              "Call to Action",
              "How-to-Tips",
              "Status Reports",
              "Reminders & Planning Prompts",
            ],
          },
          {
            heading: "Patterns for repeat engagement",
            items: [
              "Behavior Change Games",
              "Decision-Making Support",
              "Gamification",
              "Goal Trackers",
              "Reminders",
              "Social Sharing",
              "Tutorials & Planners",
            ],
          },
          {
            heading: "Attention & intuitive reaction",
            items: [
              "Tell user what the action is and ask for it",
              "Clear the page of distractions",
              "Make it clear where to act",
              "Make UI professional and clean",
              "Deploy strong authority on subject",
              "Be authentic and personal",
              "Deploy social proof",
            ],
          },
          {
            heading: "Conscious evaluation & urgency",
            items: [
              "Prime user-relevant associations",
              "Avoid direct payments friction",
              "Avoid choice overload",
              "Avoid cognitive overhead",
              "Leverage loss-aversion",
              "Use peer comparisons & competition",
              "Frame text to avoid temporal myopia",
              "Remind of prior commitment to act",
              "Make commitment to friends",
              "Make reward scarce",
            ],
          },
          {
            heading: "Make action effortless",
            items: [
              "Elicit implementation intentions",
              "Default everything",
              "Lessen the burden of action / info",
            ],
          },
        ],
      },
      {
        id: "measuring-impact",
        title: "Measuring the Impact",
        summary: "Validating design changes through controlled experiments and feeding findings back into the product.",
        branches: [
          {
            heading: "Testing & iteration",
            items: [
              "Incremental A/B Testing",
              "Multivariate Testing",
              "Gather Lessons",
              "Prioritize & Integrate",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "product-design",
    title: "Product Design",
    shortTitle: "Product Design",
    url: "https://roadmap.sh/product-design",
    group: "design",
    tagline:
      "End-to-end digital product design: discovery, framing, strategy, UI craft, engineering collaboration, systems and measurement.",
    fits: ["Track B · Beginners", "Design Engineer", "Meta-Designer"],
    related: ["ux-design", "design-system", "frontend", "ai-product-builder"],
    milestones: [
      {
        id: "foundations",
        title: "Foundations",
        summary: "Role boundaries, product success criteria and timeless design principles.",
        branches: [
          {
            heading: "Introduction",
            items: ["Product Design vs UX", "Product Design vs UI"],
          },
          {
            heading: "Defining success",
            items: [
              "Goal Setting",
              "Product Vision",
              "Value Proposition",
              "Product-Market Fit",
              "Success Metrics",
            ],
          },
          {
            heading: "Design principles",
            items: [
              "User-Centered Design",
              "Functionality over Polish",
              "Consistency & Coherence",
              "Collaboration by Design",
              "Iteration over Perfection",
            ],
          },
        ],
      },
      {
        id: "discover",
        title: "Discover",
        summary: "Collecting behavioral evidence, mapping user context and organizing research so teams can act on it.",
        branches: [
          {
            heading: "Gathering information",
            items: [
              "Interviews",
              "Surveys",
              "Contextual Inquiry",
              "Heatmaps",
              "Session Recordings",
            ],
          },
          {
            heading: "Mapping & organizing",
            items: [
              "Journey Mapping",
              "Task Analysis",
              "Synthesizing Research",
              "Research Repository",
            ],
          },
        ],
      },
      {
        id: "define",
        title: "Define",
        summary: "Framing clear problems and prioritizing opportunities against user and business value.",
        branches: [
          {
            heading: "Framing the problem",
            items: [
              "Personas",
              "Empathy Maps",
              "Jobs-to-be-Done (JTBD)",
              "Problem Statements",
              "How Might We Questions",
            ],
          },
          {
            heading: "Prioritizing opportunities",
            items: [
              "Product Sense",
              "Business & User Needs",
              "Opportunity Solution Trees",
              "Prioritization Frameworks (Kano, RICE, MoSCoW)",
            ],
          },
        ],
      },
      {
        id: "strategy-planning",
        title: "Strategy & Planning",
        summary: "Connecting design work to OKRs, cross-functional rituals and explicit risk assumptions.",
        branches: [
          {
            heading: "Business & team alignment",
            items: [
              "Business Understanding",
              "Product Strategy",
              "Business Metrics & OKRs",
              "Stakeholder Alignment",
              "Agile UX & Lean UX",
              "Design Workshops & Sprints",
            ],
          },
          {
            heading: "Managing risk",
            items: ["Assumption Mapping", "Risk Identification"],
          },
        ],
      },
      {
        id: "design-experience",
        title: "Design the Experience",
        summary: "Structuring information architecture and moving from early sketches to testable prototypes.",
        branches: [
          {
            heading: "Information architecture",
            items: [
              "Site Maps",
              "Navigation",
              "Content Organization",
              "User Flows",
              "Task Flows",
            ],
          },
          {
            heading: "Ideation",
            items: [
              "Brainstorming",
              "Mind Maps",
              "Sketching",
              "Wireframing",
              "Prototyping",
            ],
          },
        ],
      },
      {
        id: "validate",
        title: "Validate",
        summary: "Stress-testing flows for usability, accessibility and quality before building.",
        branches: [
          {
            heading: "Testing & review",
            items: [
              "Usability Testing",
              "Accessibility Testing",
              "UX Benchmarking",
              "Expert Review",
              "Critiques & Reviews",
            ],
          },
        ],
      },
      {
        id: "build-interface",
        title: "Build the Interface",
        summary: "Visual foundations, reusable components, motion, UX writing, ethics and AI-assisted design.",
        branches: [
          {
            heading: "Visual & interface design",
            items: [
              "Color, Typography, Layout & Grid",
              "Icons & Visual Hierarchy",
              "Components & UI Patterns",
              "Design Tokens",
              "Interface States",
            ],
          },
          {
            heading: "Motion, content & responsibility",
            items: [
              "Micro-interactions & Motion Principles",
              "UX Writing, Voice & Tone, Microcopy",
              "Inclusive Design & Ethical Design",
              "AI-Assisted Design",
            ],
          },
        ],
      },
      {
        id: "working-with-engineering",
        title: "Working with Engineering",
        summary: "Understanding real stack constraints, specifying edge cases and partnering through launch.",
        branches: [
          {
            heading: "Constraints & feasibility",
            items: [
              "Stack & Platform Constraints",
              "API & Data Limitations",
              "Performance Constraints",
              "Feasibility Assessment & Specs",
            ],
          },
          {
            heading: "Handoff & collaboration",
            items: [
              "Edge Cases & States",
              "Handoff Tools (Figma Dev Mode, Zeplin)",
              "Launch Readiness",
              "Developer Collaboration",
            ],
          },
        ],
      },
      {
        id: "ship-scale",
        title: "Ship & Scale",
        summary: "Scaling quality across teams, platforms and design systems.",
        branches: [
          {
            items: ["Design Systems", "DesignOps", "Multi-platform Design"],
          },
        ],
      },
      {
        id: "measure-iterate",
        title: "Measure & Iterate",
        summary: "Tracking product performance after launch and iterating with experiments.",
        branches: [
          {
            items: [
              "Product Analytics",
              "HEART Framework",
              "A/B Testing",
              "Feature Flags",
              "Continuous Improvement",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "design-system",
    title: "Design System",
    shortTitle: "Design System",
    url: "https://roadmap.sh/design-system",
    group: "design",
    tagline:
      "Auditing existing UI, defining design language and tokens, building core components, release tooling and governance.",
    fits: ["Meta-Designer", "Design Engineer", "Track A · Month 3–4"],
    related: ["product-design", "frontend", "ux-design", "prompt-engineering"],
    milestones: [
      {
        id: "ds-basics",
        title: "Understand the Basics & Terminology",
        summary: "Distinguishing design systems from UI kits and agreeing on shared vocabulary across teams.",
        branches: [
          {
            heading: "Core concepts",
            items: [
              "What is a Design System? & Why build one",
              "Design System vs Component Library",
              "Atomic Design",
              "Stakeholders Involved in Building",
              "Design System Examples",
            ],
          },
          {
            heading: "Shared terminology",
            items: [
              "Component & Component Library",
              "Design Language & Guidelines",
              "Pattern, Token & UI Kit",
              "Pilot & Governance",
            ],
          },
        ],
      },
      {
        id: "ds-audit",
        title: "Strategy & Existing Design Analysis",
        summary: "Deciding whether to start fresh or extract from live products through a structured visual audit.",
        branches: [
          {
            heading: "Approach & audit",
            items: [
              "Making from Scratch vs Existing Design",
              "Performing a Visual Audit",
              "Identify Existing Design Process",
              "A/B Tests & Regional Requirements",
              "Audit Documentation",
            ],
          },
          {
            heading: "Inventory elements & components",
            items: [
              "Icons, Sizing & Visual Forms",
              "Color, Spacing & Typography",
              "Avatars, Banners, Badges, Cards, Forms, Buttons, Dropdowns",
            ],
          },
        ],
      },
      {
        id: "ds-language",
        title: "Creating Design Language",
        summary: "Codifying brand principles, writing voice, logo rules and accessibility standards.",
        branches: [
          {
            heading: "Brand & voice",
            items: [
              "Design Principles & Vision",
              "Writing Guidelines & Tone of Voice",
              "Terminology & Microcopy Guidelines",
            ],
          },
          {
            heading: "Logo & accessibility guidelines",
            items: [
              "Monochrome, Small-Use & Placement Rules",
              "Logo Usage & File Formats",
              "Accessibility Guidelines",
              "User Onboarding Guidelines",
            ],
          },
        ],
      },
      {
        id: "ds-tokens",
        title: "Defining Design Tokens",
        summary: "Turning color, layout, typography and iconography decisions into machine-readable tokens.",
        branches: [
          {
            heading: "Colors & layout",
            items: [
              "Functional Colors & Accessibility Contrast",
              "Dark Mode Tokens",
              "Units, Grid, Breakpoints & Spacing",
            ],
          },
          {
            heading: "Typography & iconography",
            items: [
              "Responsive Type Scale, Readability & Performance",
              "Icon Style, Naming, Sizes & Grid Relation",
              "Icon Accessibility, Keywords & Reserved Icons",
            ],
          },
        ],
      },
      {
        id: "ds-components",
        title: "Creating Core Components",
        summary: "Shipping accessible, documented primitives that cover day-to-day product UI.",
        branches: [
          {
            heading: "Display & actions",
            items: [
              "Avatar, Banner, Badge, Icon",
              "Button, Card, Carousel, List",
              "Loading Indicator, Toast, Tooltip",
            ],
          },
          {
            heading: "Inputs & navigation",
            items: [
              "Input Text & Textarea",
              "Checkbox, Radio & Switch",
              "Select & Dropdown",
              "Modal & Tabs",
            ],
          },
        ],
      },
      {
        id: "ds-tooling-ops",
        title: "Tooling, Releases & Governance",
        summary: "Running the design system like an internal product with testing, versioning and adoption metrics.",
        branches: [
          {
            heading: "Design & dev tooling",
            items: [
              "Design Editor, Plugins & Design Version Control",
              "Component Catalog & Documentation",
              "Code Style, Unit Testing & Accessibility Testing",
              "Semantic Versioning & Release Strategy",
              "Commit Guidelines, PR Templates & Contribution Guidelines",
            ],
          },
          {
            heading: "Project management & adoption",
            items: [
              "Roadmap, Milestones & Ticketing",
              "Component, Tooling & Health Analytics",
              "Community Meetings, Open Hours & FAQs",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "frontend",
    title: "Frontend Developer",
    shortTitle: "Frontend",
    url: "https://roadmap.sh/frontend",
    group: "engineering-ai",
    tagline:
      "Core web standards, Git, Tailwind, React, TypeScript, testing, accessibility, performance and AI-assisted development.",
    fits: ["Design Engineer", "Track A · Month 1–5", "Track B · Stage 2"],
    related: ["design-system", "product-design", "claude-code", "ai-product-builder"],
    milestones: [
      {
        id: "fe-web-core",
        title: "Internet & Core Web Trio",
        summary: "How browsers load pages, semantic HTML, modern CSS layouts and vanilla JavaScript.",
        branches: [
          {
            heading: "How the web works",
            items: [
              "HTTP, DNS, Domains & Hosting",
              "How Browsers Parse & Render Pages",
            ],
          },
          {
            heading: "HTML, CSS & JavaScript",
            items: [
              "Semantic HTML, Forms & Validation",
              "CSS Layouts (Flexbox, Grid) & Responsive Design",
              "JavaScript DOM, Events, Fetch & async/await",
            ],
          },
        ],
      },
      {
        id: "fe-workflow",
        title: "Git, Packages, Tailwind & React",
        summary: "The everyday stack used across modern design engineering codebases.",
        branches: [
          {
            heading: "Workflow & styling",
            items: [
              "Git, GitHub & Pull Requests",
              "Package Managers (npm, pnpm, yarn, Bun)",
              "Tailwind CSS",
            ],
          },
          {
            heading: "Frameworks & types",
            items: [
              "React (Components, Props, State, Hooks)",
              "TypeScript Type Checking",
              "SSR & SSG (Next.js, Astro, React Router)",
            ],
          },
        ],
      },
      {
        id: "fe-ai-dev",
        title: "AI in Frontend Development",
        summary: "Using coding agents effectively while maintaining code quality and review discipline.",
        branches: [
          {
            items: [
              "AI-Assisted Coding (Claude Code, Cursor, Copilot)",
              "AI Code Reviews, Refactoring & Docs Generation",
              "Prompting Techniques, Agents, MCP & Skills",
              "Model APIs (Anthropic, OpenAI, Gemini)",
            ],
          },
        ],
      },
      {
        id: "fe-quality",
        title: "Build Tools, Testing, Security & Shipping",
        summary: "Bundling, linting, automated testing, accessibility, performance and deployment.",
        branches: [
          {
            heading: "Tooling & testing",
            items: [
              "Bundlers (Vite, esbuild, Rollup)",
              "Linters & Formatters (ESLint, Prettier, Biome)",
              "Testing (Vitest, Playwright, Cypress)",
            ],
          },
          {
            heading: "Quality & production",
            items: [
              "Accessibility (WCAG, ARIA, Keyboard Navigation)",
              "Performance (Lighthouse, DevTools, Caching)",
              "Web Security (HTTPS, CORS, CSP, OWASP)",
              "Deployment (Vercel, Netlify, Cloudflare, GitHub Pages)",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-product-builder",
    title: "AI Product Builder",
    shortTitle: "AI Product Builder",
    url: "https://roadmap.sh/ai-product-builder",
    group: "engineering-ai",
    tagline:
      "Going from problem definition to live deployed software with AI prototyping tools, coding agents, testing and hosting.",
    fits: ["Track B · Stage 2–3", "Design Engineer", "Product Designers shipping code"],
    related: ["product-design", "frontend", "claude-code", "prompt-engineering"],
    milestones: [
      {
        id: "apb-scope",
        title: "Definition & Scope",
        summary: "Scoping the problem, app anatomy and stack constraints before prompting an AI tool.",
        branches: [
          {
            items: [
              "Problem Definition",
              "App Anatomy",
              "Feature Scoping",
              "Tech Stack & Constraints",
            ],
          },
        ],
      },
      {
        id: "apb-prototype",
        title: "1. Prototyping",
        summary: "Choosing the right prototype fidelity and gathering fast user feedback.",
        branches: [
          {
            items: ["Choose a Prototype Tool", "Feedback & Validation"],
          },
        ],
      },
      {
        id: "apb-generate-refine",
        title: "2. Generation & 3. Refinement",
        summary: "Knowing when to use visual app builders versus full coding agents and core web fundamentals.",
        branches: [
          {
            heading: "AI app builders & coding agents",
            items: [
              "AI App Builders (Lovable, Replit, Claude Design, v0, Bolt)",
              "CLI Coding Agents (Claude Code, Codex, Gemini CLI)",
              "Editor Copilots (Cursor, GitHub Copilot)",
              "Targeted Change vs Structural Refactor",
            ],
          },
          {
            heading: "Learn by need",
            items: [
              "HTML / CSS / JavaScript",
              "React",
              "Browsers & DevTools",
              "Node.js basics",
            ],
          },
        ],
      },
      {
        id: "apb-collab-deploy",
        title: "4. Collaboration & 5. Deployment",
        summary: "Testing real user flows, managing changes in Git and shipping to live hosting and databases.",
        branches: [
          {
            heading: "Testing & change management",
            items: [
              "User Testing",
              "Unit, Integration & E2E Testing",
              "Change Management & CI (GitHub, GitLab)",
            ],
          },
          {
            heading: "Deployment & data",
            items: [
              "Serverless Hosting (Vercel, Cloudflare)",
              "PaaS & Cloud (Railway, Render, AWS, GCP, Azure)",
              "Databases (Supabase, PostgreSQL, MongoDB)",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "prompt-engineering",
    title: "Prompt & Context Engineering",
    shortTitle: "Prompt & Context",
    url: "https://roadmap.sh/prompt-engineering",
    group: "engineering-ai",
    tagline:
      "Structuring prompts, grounding context layers, CLAUDE.md/AGENTS.md conventions, evals and defending against prompt injection.",
    fits: ["Meta-Designer", "AX Designer", "Design Engineer"],
    related: ["ai-agents", "claude-code", "design-system", "ai-product-builder"],
    milestones: [
      {
        id: "pe-llm-basics",
        title: "Introduction & LLM Basics",
        summary: "Understanding how models tokenize, reason, hallucinate and trade cost against capability.",
        branches: [
          {
            heading: "Core terminology",
            items: [
              "Prompt vs Context Engineering",
              "Tokens, Context Window & Hallucination",
              "Fine-Tuning vs Prompt Engineering",
              "RAG, Embeddings & Agents",
            ],
          },
          {
            heading: "Model choices",
            items: [
              "Reasoning vs Standard Models",
              "Open vs Closed Models",
              "Model Size, Cost & Capabilities",
            ],
          },
        ],
      },
      {
        id: "pe-prompting",
        title: "Prompt Engineering Basics",
        summary: "Writing clear, structured prompts with reliable outputs and tool definitions.",
        branches: [
          {
            heading: "Structure & approaches",
            items: [
              "Delimiters, XML Tags & Prompt Templates",
              "Zero-Shot, Few-Shot & System Prompting",
              "Chain of Thought (CoT) & Tree of Thoughts (ToT)",
              "Self-Consistency & Structured Outputs",
            ],
          },
          {
            heading: "Tools, specs & multimodal",
            items: [
              "Tool Calling & MCP Tool Descriptions",
              "Spec-Driven Prompts & Prompt Chaining",
              "Classification, Routing & Effort Levels",
              "Multimodal Inputs",
            ],
          },
        ],
      },
      {
        id: "pe-context",
        title: "Context Engineering Basics",
        summary: "Managing what enters the context window so agents stay accurate instead of drifting.",
        branches: [
          {
            heading: "Anatomy & retrieval",
            items: [
              "Context Sources & Context Layers",
              "Context Failure Modes & Context Rot",
              "Context Grounding & Agentic Search",
              "Just-in-Time Retrieval",
            ],
          },
          {
            heading: "Memory, compaction & multi-agent",
            items: [
              "Memory & State",
              "CLAUDE.md & AGENTS.md",
              "Context Compaction & Budgeting",
              "Prompt Caching",
              "Context Isolation & Briefing Subagents",
            ],
          },
        ],
      },
      {
        id: "pe-eval-safety",
        title: "Evaluation, Iteration & Security",
        summary: "Measuring prompt quality over time and defending against injection attacks.",
        branches: [
          {
            heading: "Evaluation",
            items: [
              "Building Eval Sets",
              "LLM-as-Judge",
              "Regression Testing & Prompt Versioning",
            ],
          },
          {
            heading: "Security & safety",
            items: [
              "Prompt Injection & Indirect Injection",
              "Jailbreaks",
              "Output Validation & Context Security",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-agents",
    title: "AI Agents",
    shortTitle: "AI Agents",
    url: "https://roadmap.sh/ai-agents",
    group: "engineering-ai",
    tagline:
      "How autonomous agents perceive, plan, call tools via MCP, retain memory, get evaluated and stay within safety guardrails.",
    fits: ["AX Designer", "Track A · Meta/AX Month 5", "Meta-Designer"],
    related: ["prompt-engineering", "claude-code", "ux-design"],
    milestones: [
      {
        id: "ag-fundamentals",
        title: "Prerequisites & LLM Fundamentals",
        summary: "Technical baselines and generation parameters that shape how an agent responds.",
        branches: [
          {
            items: [
              "Git, Terminal & REST APIs",
              "Tokenization, Context Windows & Pricing",
              "Generation Controls (Temperature, Top-p, Max Length)",
              "Streamed vs Unstreamed Responses",
              "Embeddings, Vector Search & RAG",
            ],
          },
        ],
      },
      {
        id: "ag-loop",
        title: "AI Agents 101 & The Agent Loop",
        summary: "The four-step cycle that separates an acting agent from a single chat completion.",
        branches: [
          {
            heading: "Core loop",
            items: [
              "1. Perception / User Input",
              "2. Reason and Plan",
              "3. Acting / Tool Invocation",
              "4. Observation & Reflection",
            ],
          },
          {
            heading: "Harness & use cases",
            items: [
              "Harness Engineering",
              "Code Generation, Research & Assistant Workflows",
            ],
          },
        ],
      },
      {
        id: "ag-tools-mcp",
        title: "Tools, Actions & MCP",
        summary: "Defining reliable tool schemas and exposing external apps through Model Context Protocol.",
        branches: [
          {
            heading: "Tool contracts",
            items: [
              "Tool Name, Description & Input/Output Schema",
              "Error Handling & Usage Examples",
              "Web Search, Code Execution, APIs & File Access",
            ],
          },
          {
            heading: "Model Context Protocol (MCP)",
            items: [
              "MCP Hosts, Clients & Servers",
              "Creating Local & Remote MCP Servers",
            ],
          },
        ],
      },
      {
        id: "ag-memory-arch",
        title: "Agent Memory & Architectures",
        summary: "Short-term vs long-term memory and choosing the simplest orchestration pattern that works.",
        branches: [
          {
            heading: "Memory",
            items: [
              "Short-Term (In-Prompt) vs Long-Term Memory",
              "Episodic vs Semantic Memory",
              "User Profile Storage, Compression & Forgetting",
            ],
          },
          {
            heading: "Architectures & frameworks",
            items: [
              "ReAct, Planner-Executor & RAG Agents",
              "DAG, Self-Critique & Multi-Agent Patterns",
              "Native Function Calling vs Frameworks (LangGraph, CrewAI, AutoGen)",
            ],
          },
        ],
      },
      {
        id: "ag-eval-sec",
        title: "Evaluation, Observability & Security",
        summary: "Keeping live agents trustworthy through HITL evals, tracing, sandboxing and red-teaming.",
        branches: [
          {
            heading: "Testing & observability",
            items: [
              "Tool Unit Tests & Flow Integration Tests",
              "Human-in-the-Loop Evaluation",
              "Tracing & Eval Tools (LangSmith, DeepEval, Ragas, LangFuse)",
            ],
          },
          {
            heading: "Security & ethics",
            items: [
              "Prompt Injection & Jailbreak Defenses",
              "Tool Sandboxing & Permissioning",
              "Data Privacy & PII Redaction",
              "Bias Guardrails & Red-Team Testing",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "claude-code",
    title: "Claude Code",
    shortTitle: "Claude Code",
    url: "https://roadmap.sh/claude-code",
    group: "engineering-ai",
    tagline:
      "Practical coding-agent workflows: Plan mode, CLAUDE.md, Skills, Hooks, MCP servers, context control, worktrees and PR reviews.",
    fits: ["Design Engineer", "Track A · Month 3–5", "Meta-Designer"],
    related: ["frontend", "prompt-engineering", "ai-product-builder", "ai-agents"],
    milestones: [
      {
        id: "cc-basics",
        title: "Coding Agent Concepts & Surfaces",
        summary: "Understanding the agentic loop and choosing between CLI, editor extensions, desktop and cloud.",
        branches: [
          {
            items: [
              "Claude Code vs Codex vs Cursor",
              "Agentic Loop & Permission Modes",
              "Surfaces (CLI, Desktop, Web, Editor Extensions)",
              "Core Concepts: CLAUDE.md, Skills, Hooks, MCP, Plugins, Subagents",
            ],
          },
        ],
      },
      {
        id: "cc-workflow",
        title: "Daily Workflow & Configuration",
        summary: "Steering sessions with Plan mode, rewind, structured memory files and reusable skills.",
        branches: [
          {
            heading: "Session & workflow controls",
            items: [
              "Plan Mode, Auto Mode & Permission Controls",
              "Session Management (Resume, Rewind, /compact, /clear)",
              "Slash Commands (/init, /context, /memory, /plan, /code-review)",
            ],
          },
          {
            heading: "Project instructions & automation",
            items: [
              "Structuring CLAUDE.md (Project & Global)",
              "Creating & Using Skills",
              "Hooks (Events, Matchers, Inputs & Outputs)",
            ],
          },
        ],
      },
      {
        id: "cc-scale",
        title: "MCP, Scaling, Code Review & Security",
        summary: "Connecting design tools with MCP, isolating parallel work with git worktrees and reviewing PRs safely.",
        branches: [
          {
            heading: "Integrations & scaling",
            items: [
              "Connecting Tools & Design Systems with MCP",
              "Context Budgeting, Prompt Caching & Thinking Effort",
              "Git Worktrees, Subagents & Headless Mode",
              "CI/CD (Agent SDK, GitHub Actions)",
            ],
          },
          {
            heading: "Review & safety",
            items: [
              "Code Review on Pull Requests",
              "Sandboxing & Security Best Practices",
            ],
          },
        ],
      },
    ],
  },
];

/** Additional official skill roadmaps on roadmap.sh that support specific months and stages of the guide. */
export const companionRoadmaps: CompanionRoadmap[] = [
  {
    slug: "html",
    title: "HTML",
    url: "https://roadmap.sh/html",
    category: "Design & Web",
    summary: "Semantic structure, forms, tables, media and built-in accessibility.",
    planLink: "Track A · Month 1",
  },
  {
    slug: "css",
    title: "CSS",
    url: "https://roadmap.sh/css",
    category: "Design & Web",
    summary: "Cascade, Flexbox, Grid, responsive units, custom properties and modern layout.",
    planLink: "Track A · Month 1",
  },
  {
    slug: "javascript",
    title: "JavaScript",
    url: "https://roadmap.sh/javascript",
    category: "Front-end Code",
    summary: "DOM manipulation, events, Promises, async/await, fetch and modules.",
    planLink: "Track A · Month 2",
  },
  {
    slug: "react",
    title: "React",
    url: "https://roadmap.sh/react",
    category: "Front-end Code",
    summary: "Components, props, state, hooks, routing, forms and state management.",
    planLink: "Track A · Month 2",
  },
  {
    slug: "typescript",
    title: "TypeScript",
    url: "https://roadmap.sh/typescript",
    category: "Front-end Code",
    summary: "Static types for component props, interfaces, unions, generics and narrowing.",
    planLink: "Track A · Month 3",
  },
  {
    slug: "git-github",
    title: "Git and GitHub",
    url: "https://roadmap.sh/git-github",
    category: "Front-end Code",
    summary: "Commits, branches, rebasing, resolving merge conflicts and pull requests.",
    planLink: "Track A · Month 5",
  },
  {
    slug: "code-review",
    title: "Code Review",
    url: "https://roadmap.sh/code-review",
    category: "Front-end Code",
    summary: "Reviewing diffs clearly, catching regressions and collaborating in real repos.",
    planLink: "Track A · Month 5",
  },
  {
    slug: "frontend-performance-best-practices",
    title: "Frontend Performance",
    url: "https://roadmap.sh/frontend-performance-best-practices",
    category: "Design & Web",
    summary: "Core Web Vitals (LCP, INP, CLS), asset budgets, fonts and rendering speed.",
    planLink: "Track A · Month 4–5",
  },
  {
    slug: "cursor",
    title: "Cursor",
    url: "https://roadmap.sh/cursor",
    category: "AI Tooling",
    summary: "AI-first editor workflows, inline edits, rules files and codebase context.",
    planLink: "Track A · Month 3–4",
  },
  {
    slug: "codex",
    title: "Codex",
    url: "https://roadmap.sh/codex",
    category: "AI Tooling",
    summary: "Using OpenAI's coding agent for scoped tasks, Figma workflows and PRs.",
    planLink: "Track A · Month 4–5",
  },
];

/** Count every individual topic item inside a roadmap. */
export function countRoadmapTopics(r: ExternalRoadmap): number {
  return r.milestones.reduce(
    (sum, m) => sum + m.branches.reduce((bSum, b) => bSum + b.items.length, 0),
    0,
  );
}
