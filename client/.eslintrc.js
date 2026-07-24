module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "next/core-web-vitals",
  ],
  ignorePatterns: [
    "next.config.js",
    "vitest.config.mts",
    "src/types/graphql.ts",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    projectService: true,
  },
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)",
        "__mocks__/**/*",
      ],
      extends: ["plugin:testing-library/react"],
      rules: {
        "@typescript-eslint/unbound-method": 0,
        "@typescript-eslint/no-confusing-void-expression": [
          1,
          { ignoreVoidReturningFunctions: true },
        ],
        "testing-library/no-debugging-utils": 2,
        "testing-library/no-global-regexp-flag-in-query": 1,
      },
    },
  ],
  rules: {
    /* ESLint Possible Problems Rules */
    "array-callback-return": [2, { checkForEach: true }],
    "no-await-in-loop": 2,
    "no-constant-binary-expression": 2,
    "no-duplicate-imports": [2, { includeExports: true }],
    "no-promise-executor-return": 2,
    "no-sparse-arrays": 1,
    "no-unmodified-loop-condition": 1,
    "no-unreachable-loop": 1,
    "require-atomic-updates": 2,

    /* ESLint Suggestions */
    "accessor-pairs": [2, { enforceForClassMembers: true }],
    "block-scoped-var": 2,
    "default-case": 1,
    eqeqeq: 2,
    "guard-for-in": 1,
    "no-console": 1,
    "no-continue": 1,
    "no-else-return": [1, { allowElseIf: false }],
    "no-extra-boolean-cast": 1,
    "no-lonely-if": 1,
    "no-loop-func": 2,
    "no-negated-condition": 1,
    "no-param-reassign": [2, { props: true }],
    "no-unneeded-ternary": 1,
    "no-useless-return": 1,
    "object-shorthand": 1,
    "prefer-object-has-own": 1,
    yoda: 1,

    /* TypeScript Optional Rules */
    "@typescript-eslint/consistent-type-exports": 1,
    "@typescript-eslint/consistent-type-imports": 1,
    // "@typescript-eslint/consistent-type-imports": [
    //   1,
    //   { fixStyle: "inline-type-imports" },
    // ],
    "@typescript-eslint/method-signature-style": 1,
    "@typescript-eslint/no-import-type-side-effects": 2,
    "@typescript-eslint/no-unsafe-type-assertion": 2,
    "@typescript-eslint/promise-function-async": 2,
    "@typescript-eslint/require-array-sort-compare": [
      1,
      { ignoreStringArrays: true },
    ],
    "@typescript-eslint/strict-void-return": [2, { allowReturnAny: true }],

    /* TypeScript Strict Rules */
    "@typescript-eslint/no-confusing-void-expression": [
      1,
      { ignoreArrowShorthand: true },
    ],
    "@typescript-eslint/no-floating-promises": [2, { ignoreIIFE: true }],
    "@typescript-eslint/no-misused-promises": [
      1,
      { checksVoidReturn: { attributes: false } },
    ],

    /* TypeScript Stylistic Rules */
    "@typescript-eslint/array-type": [1, { default: "array-simple" }],
    "@typescript-eslint/consistent-type-definitions": 1,
    "@typescript-eslint/no-empty-function": [1, { allow: ["arrowFunctions"] }],

    /* TypeScript Extension Rules that extend Eslint Rules */
    "@typescript-eslint/default-param-last": 2,
    "@typescript-eslint/max-params": 2,
    "@typescript-eslint/no-unused-vars": [
      1,
      { argsIgnorePattern: "^_+", varsIgnorePattern: "^_+" },
    ],
    "@typescript-eslint/no-use-before-define": [
      2,
      { functions: false, ignoreTypeReferences: false },
    ],
    "@typescript-eslint/prefer-destructuring": 1,
  },
};
