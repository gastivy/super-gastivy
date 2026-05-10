import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".tanstack/**",
      "src/routeTree.gen.ts",
      "bun.lock",
      "package-lock.json",
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Main config for all source files
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
    },

    plugins: {
      react,
      "simple-import-sort": simpleImportSort,
      prettier: prettierPlugin,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      // Prettier
      "prettier/prettier": "error",

      // React
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // Import sorting with path alias groups:
      // 1. Side effects (import "...")
      // 2. Node built-ins (import fs from "node:...")
      // 3. React packages
      // 4. External packages (non-alias)
      // 5. Internal path aliases (@pages, @components, etc.)
      // 6. Parent imports (../)
      // 7. Relative imports (./)
      // 8. CSS/SCSS imports
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Side effect imports
            ["^\\u0000"],

            // Node.js built-ins prefixed with `node:`
            ["^node:"],

            // React-related packages
            ["^react"],

            // External packages (not path aliases)
            [
              "^@?(?!pages|assets|components|containers|constants|custom-types|hooks|libs|modules|styles)\\w",
            ],

            // Internal path aliases
            [
              "^@(pages|assets|components|containers|constants|custom-types|hooks|libs|modules|styles)",
            ],

            // Parent imports
            ["^\\.\\.(?!/?$)", "^\\./(?=.*/)(?!/?$)"],

            // Relative imports
            ["^\\."],

            // CSS/SCSS imports
            [".+\\.s?css$"],
          ],
        },
      ],

      "simple-import-sort/exports": "error",

      // General
      "no-console": "error",
    },
  },

  // Prettier config must be last to override other formatting rules
  prettierConfig
);
