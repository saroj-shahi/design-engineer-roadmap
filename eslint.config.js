import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "playwright-report", "test-results", "blob-report", "public"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-refresh": reactRefresh },
    extends: [reactHooks.configs.flat.recommended, jsxA11y.flatConfigs.recommended],
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // Sideways-scrolling regions must take focus so keyboard users can scroll them (axe: scrollable-region-focusable).
      "jsx-a11y/no-noninteractive-tabindex": ["error", { tags: [], roles: ["tabpanel", "region"] }],
      // Only flag the DOM attribute; FindBox's own `autoFocus` prop focuses the input when the search dialog opens.
      "jsx-a11y/no-autofocus": ["error", { ignoreNonDOM: true }],
    },
  },
  {
    files: ["tests/**/*.ts", "scripts/**/*.{js,mjs}", "*.{js,ts}"],
    // Playwright scripts and specs also run callbacks in the page (page.evaluate), hence browser globals.
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
);
