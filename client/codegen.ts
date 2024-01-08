import { type CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:7692/",
  generates: {
    "src/types/": {
      preset: "client",
      plugins: [],
      config: { enumsAsTypes: true },
      presetConfig: { gqlTagName: "codeGenGQL" },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
