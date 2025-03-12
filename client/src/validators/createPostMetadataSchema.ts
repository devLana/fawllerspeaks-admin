import * as yup from "yup";
import * as metadataSchema from "./postMetadataBaseSchema";

export const create = yup
  .object({
    description: metadataSchema.description(yup.string()),
    excerpt: metadataSchema.excerpt(yup.string()),
  })
  .concat(metadataSchema.base);

export const draft = yup
  .object({
    description: metadataSchema.descriptionDraft(yup.string()),
    excerpt: metadataSchema.excerptDraft(yup.string()),
  })
  .concat(metadataSchema.base);
