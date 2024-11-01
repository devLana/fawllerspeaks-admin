import { type TypePolicy } from "@apollo/client";

export const Post: TypePolicy = { keyFields: ["url", ["slug"]] };
