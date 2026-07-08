import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:7692/",
  documents: ["src/**/*.{ts,tsx}"],
  ignoreNoDocuments: true,
  generates: {
    "src/types/graphql.ts": {
      plugins: ["typescript-operations"],
      config: { nonOptionalTypename: true, skipTypeNameForRoot: true },
    },
  },
};

export default config;
