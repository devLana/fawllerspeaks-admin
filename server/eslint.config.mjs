import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  extends: [
    js.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
  ],
  basePath: "src",
  files: ["**/*.ts"],
  ignores: ["types/resolverTypes.ts"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: { projectService: true },
  },
  rules: {
    /* Turned off EsLint Rules */
    "no-unused-private-class-members": 0,
    "no-fallthrough": 0,

    /* ESLint Possible Problems Rules */
    "no-await-in-loop": 2,
    "no-duplicate-imports": [2, { includeExports: true }],
    "no-promise-executor-return": 2,
    "no-sparse-arrays": 1,
    "no-unreachable-loop": 1,
    "no-use-before-define": [1, { functions: false, classes: false }],
    "require-atomic-updates": 2,

    /* ESLint Suggestions */
    "accessor-pairs": [2, { enforceForClassMembers: true }],
    "default-case": 1,
    eqeqeq: 2,
    "grouped-accessor-pairs": [1, "setBeforeGet", { enforceForTSTypes: true }],
    "guard-for-in": 1,
    "no-extra-boolean-cast": 1,
    "no-lonely-if": 1,
    "no-loop-func": 2,
    "no-param-reassign": [2, { props: true }],
    "no-unneeded-ternary": 1,
    "object-shorthand": 1,
    "prefer-object-has-own": 1,
    yoda: 1,

    /* TypeScript Optional Rules */
    "@typescript-eslint/consistent-type-exports": 1,
    "@typescript-eslint/consistent-type-imports": [
      1,
      { fixStyle: "inline-type-imports" },
    ],
    "@typescript-eslint/method-signature-style": 1,
    "@typescript-eslint/no-import-type-side-effects": 2,
    "@typescript-eslint/no-unnecessary-parameter-property-assignment": 2,
    "@typescript-eslint/no-unsafe-type-assertion": 2,
    "@typescript-eslint/prefer-readonly": 1,
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
    "@typescript-eslint/no-floating-promises": [1, { ignoreIIFE: true }],
    "@typescript-eslint/no-inferrable-types": 1,
    "@typescript-eslint/no-misused-promises": [
      1,
      { checksVoidReturn: { arguments: false } },
    ],

    /* TypeScript Stylistic Rules */
    "@typescript-eslint/array-type": [1, { default: "array-simple" }],
    "@typescript-eslint/consistent-type-definitions": [1, "interface"],

    /* TypeScript Extension Rules that extend Eslint Rules */
    "@typescript-eslint/class-methods-use-this": 1,
    "@typescript-eslint/default-param-last": 1,
    "@typescript-eslint/max-params": [1, { max: 4 }],
    "@typescript-eslint/no-shadow": [2, { ignoreTypeValueShadow: false }],
    "@typescript-eslint/no-unused-private-class-members": 2,
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
});
