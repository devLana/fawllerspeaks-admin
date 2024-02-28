module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "next/core-web-vitals",
  ],
  ignorePatterns: ["next.config.js", "vitest.config.mts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    project: "tsconfig.json",
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
      rules: { "testing-library/no-global-regexp-flag-in-query": 1 },
    },
  ],
  rules: {
    /* Disable ESLint Rules for {TypeScript Extension Rules} Below */
    "default-param-last": 0,
    "no-dupe-class-members": 0,
    "no-empty-function": 0,
    "no-redeclare": 0,
    "no-shadow": 0,
    "no-unused-vars": 0,

    /* ESLint Rules */
    "no-duplicate-imports": [2, { includeExports: true }],
    "no-promise-executor-return": 2,
    "no-sparse-arrays": 1,
    "no-unreachable": 1,
    "no-unreachable-loop": 1,
    "no-use-before-define": [1, { functions: false, classes: false }],
    "require-atomic-updates": 2,

    /* ESLint Suggestions */
    "accessor-pairs": [2, { enforceForClassMembers: true }],
    "default-case": 1,
    eqeqeq: 1,
    "guard-for-in": 1,
    "max-params": [1, 3],
    "no-console": 1,
    "no-extra-boolean-cast": 1,
    "no-lonely-if": 1,
    "no-param-reassign": [2, { props: true }],
    "no-unneeded-ternary": 1,
    "object-shorthand": 1,
    "prefer-destructuring": 1,
    "prefer-object-has-own": 1,
    yoda: 1,

    /* TypeScript Rules */
    "@typescript-eslint/array-type": 1,
    "@typescript-eslint/consistent-type-assertions": 2,
    "@typescript-eslint/consistent-type-definitions": [1, "interface"],
    "@typescript-eslint/consistent-type-exports": 1,
    "@typescript-eslint/consistent-type-imports": [
      1,
      { prefer: "type-imports" },
    ],
    "@typescript-eslint/method-signature-style": 1,
    "@typescript-eslint/no-floating-promises": [2, { ignoreIIFE: true }],
    "@typescript-eslint/no-inferrable-types": 1,
    "@typescript-eslint/no-misused-promises": [
      1,
      { checksVoidReturn: { attributes: false } },
    ],
    "@typescript-eslint/no-redundant-type-constituents": 1,
    "@typescript-eslint/no-unnecessary-qualifier": 1,

    /* TypeScript Extension Rules */
    "@typescript-eslint/default-param-last": 1,
    "@typescript-eslint/no-dupe-class-members": 1,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-redeclare": [1, { ignoreDeclarationMerge: true }],
    "@typescript-eslint/no-shadow": [2, { ignoreTypeValueShadow: false }],
    "@typescript-eslint/no-unused-vars": [
      1,
      { argsIgnorePattern: "^_+", varsIgnorePattern: "^_+" },
    ],
  },
};
