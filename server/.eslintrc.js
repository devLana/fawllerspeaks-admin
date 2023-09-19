module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["tsconfig.eslint.json"],
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: [
    "build/",
    "jest.config.ts",
    "babel.config.json",
    "**/types/resolverTypes.ts",
  ],
  rules: {
    // Disable ESLint Rules for TypeScript Extensions Below
    "default-param-last": 0,
    "no-dupe-class-members": 0,
    "no-redeclare": 0,
    "no-shadow": 0,

    // ESLint Rules
    "no-duplicate-imports": [2, { includeExports: true }],
    "no-promise-executor-return": 2,
    "no-sparse-arrays": 1,
    "no-unreachable": 1,
    "no-unreachable-loop": 1,
    "no-use-before-define": [
      1,
      {
        functions: false,
        classes: false,
      },
    ],
    "require-atomic-updates": 2,

    // ESLint Suggestions
    "accessor-pairs": [2, { enforceForClassMembers: true }],
    "default-case": 1,
    eqeqeq: 1,
    "guard-for-in": 1,
    "max-params": [1, 4],
    "no-extra-boolean-cast": 1,
    "no-lonely-if": 1,
    "no-param-reassign": [2, { props: true }],
    "no-unneeded-ternary": 1,
    "object-shorthand": 1,
    "prefer-destructuring": 1,
    yoda: 1,

    // TypeScript Rules
    "@typescript-eslint/array-type": 1,
    "@typescript-eslint/consistent-type-assertions": 2,
    "@typescript-eslint/consistent-type-definitions": [1, "interface"],
    "@typescript-eslint/consistent-type-exports": 1,
    "@typescript-eslint/consistent-type-imports": [
      1,
      { prefer: "type-imports" },
    ],
    "@typescript-eslint/method-signature-style": 1,
    "@typescript-eslint/no-floating-promises": [1, { ignoreIIFE: true }],
    "@typescript-eslint/no-inferrable-types": 1,
    "@typescript-eslint/no-misused-promises": [
      1,
      { checksVoidReturn: { arguments: false } },
    ],
    "@typescript-eslint/no-redundant-type-constituents": 1,
    "@typescript-eslint/no-unnecessary-qualifier": 1,

    // TypeScript Extensions
    "@typescript-eslint/default-param-last": 1,
    "@typescript-eslint/no-dupe-class-members": 1,
    "@typescript-eslint/no-redeclare": [1, { ignoreDeclarationMerge: true }],
    "@typescript-eslint/no-shadow": [2, { ignoreTypeValueShadow: false }],
    "@typescript-eslint/no-unused-vars": [1, { argsIgnorePattern: "^_+" }],
  },
};
