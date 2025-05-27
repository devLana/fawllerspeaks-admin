import * as yup from "yup";

import * as metadataSchema from "./postMetadataBaseSchema";
import type { PostStatus } from "@apiTypes";

export const edit = (status: PostStatus) => {
  return yup
    .object({
      description: yup
        .string()
        .ensure()
        .when("editStatus", {
          is: true,
          then: schema => metadataSchema.description(schema),
          otherwise(schema) {
            if (status === "Draft") metadataSchema.descriptionDraft(schema);
            return metadataSchema.description(schema);
          },
        }),
      excerpt: yup
        .string()
        .ensure()
        .when("editStatus", {
          is: true,
          then: schema => metadataSchema.excerpt(schema),
          otherwise(schema) {
            if (status === "Draft") metadataSchema.excerptDraft(schema);
            return metadataSchema.excerpt(schema);
          },
        }),
      editStatus: yup.boolean().defined(),
    })
    .concat(metadataSchema.base);
};
