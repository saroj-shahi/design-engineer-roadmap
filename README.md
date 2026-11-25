# Design Engineer Field Guide

A static, five-page field guide for designers moving into design engineering (**Designer → Design Engineer · 2026**). Built with React 18, TypeScript, Vite 5, and Tailwind CSS v4.

- **Production:** https://design-engineer-roadmap.vercel.app/
- **Hosting:** Vercel (static build from `dist/`, security headers in `vercel.json`, hash routing `#/...`)

## Local development

```bash
npm install
npm run dev        # http://localhost:5173/
npm run typecheck  # tsc -b
npm run build      # tsc -b && vite build -> dist/
npm run preview    # preview production build locally
```

## Architecture & conventions

See [CLAUDE.md](CLAUDE.md) for the project layout, content rules (`src/data/research.ts`), hash routing, Swiss print design tokens, and accessibility requirements.
