# Design Engineer Field Guide

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-support-ff813f?logo=buymeacoffee&logoColor=white)](https://buymeacoffee.com/sarojshahi)

A static, six-page field guide for designers upskilling into code or growing into **Design Engineer**, **Meta-Designer**, and **Agentic Experience (AX) Designer** roles in 2026. Built with React 18, TypeScript, Vite 5, and Tailwind CSS v4.

- **Production:** https://design-engineer-roadmap.vercel.app/
- **Hosting:** Vercel (static build from `dist/`, security headers in `vercel.json`, hash routing `#/...`)

## What's inside

1. **Start (`#/`)** — Market overview, interactive before/after handoff stage, Track A (working designers upskilling at work or targeting a hybrid role) vs. Track B (beginners starting out), and key 2026 metrics.
2. **Roles (`#/roles`)** — Interactive comparison of Design Engineer, Meta-Designer / Systems Architect, and AX Designer, skill overlap Venn diagram, and handoff case studies.
3. **Plan (`#/plan`)** — Six-month skill ramp with AI guardrail progression (`Track A`: Product Design Engineer or Meta-Designer / AX) and a four-stage beginner plan (`Track B`), paired with interactive `roadmap.sh` base topic checklists.
4. **Checklist (`#/ready`)** — Track-specific, locally persisted proof-of-work readiness checklists for team demos, promotion cases, or hybrid portfolios.
5. **Library (`#/library`)** — Side-by-side role comparison, layered skills & agent protocol architecture, role-based AI tooling pipeline with brand marks, 8 full `roadmap.sh` topic syllabi, and a plain-English glossary.

6. **Sources (`#/sources`)** — Where the figures come from, linked from the footer.

## Local development

```bash
npm install
npm run dev        # Start Vite dev server at http://localhost:5173/
npm run typecheck  # Strict TypeScript check (tsc -b)
npm run build      # Typecheck + production bundle -> dist/
npm run preview    # Preview the built dist/ bundle locally
npm run check      # Lint, format check, typecheck and build
npm run test:e2e   # Playwright tests (first run: npx playwright install chromium)
```

## Documentation for contributors & agents

- **[AGENTS.md](AGENTS.md)** — Canonical architecture map, content rules, routing/storage conventions, and verification workflow for coding agents.
- **[DESIGN.md](DESIGN.md)** — Plum Dusk dark design system tokens, contrast contract, typography & orphan rules, iconography, brand marks, and accessibility standards.
- **[CLAUDE.md](CLAUDE.md)** — Quick reference and persona review agent configuration (`.claude/agents/`).

## License and credits

- Code is released under the [MIT License](LICENSE).
- Figures and sources are drawn from "The 2026 Product Design Evolution" research brief. See the Sources page in the guide.
- Topic outlines follow [roadmap.sh](https://roadmap.sh). Check its terms before reusing that content.
- Product names and logos shown in the tooling pipeline belong to their owners and are used only to identify those products.
