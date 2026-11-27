# Contributing

Thanks for helping. Fixes to content, accessibility and bugs are welcome. For a big change, please open an issue first so we can agree on the direction.

## Set up

```bash
npm install
npm run dev
```

Read [AGENTS.md](AGENTS.md) for how the code is laid out and [DESIGN.md](DESIGN.md) for the design system.

## Content rules

- All figures, roles, plans and glossary entries live in `src/data/research.ts`. Change data there, not in JSX.
- Never invent a figure or a source. Every number needs a source and an honest `basis`.
- Keep copy plain and direct. Treat the role as a bridge between design and code. Don't slight designers or developers.

## Before you open a pull request

```bash
npm run format
npm run check
npm run test:e2e   # first run: npx playwright install chromium
```

Then look at the page at about 1280px and 375px wide. If you changed plan data, run `npm run pdfs` so the downloads stay in sync.

## Commits

Use the imperative and sentence case, with no prefix. For example: `Fix glossary search on mobile`.

By contributing, you agree your work is released under the [MIT License](LICENSE).
