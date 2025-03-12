import * as yup from "yup";

export const base = yup
  .object({
    title: yup
      .string()
      .trim()
      .required("Enter post title")
      .max(255, "Post title cannot be more than 255 characters"),
    tagIds: yup
      .array(yup.string().ensure().uuid("Only uuids allowed"))
      .max(5, "Only a maximum of 5 post tags can be selected")
      .defined(),
    imageBanner: yup
      .mixed<File>()
      .defined()
      .nullable()
      .test("is-image-file", "Only image files can be uploaded", value => {
        if (!value) return true;
        return value instanceof File && value.type.startsWith("image/");
      }),
  })
  .required("Provide post metadata");

export const description = (schema: yup.StringSchema) => {
  return schema
    .trim()
    .required("Enter post description")
    .max(255, "Post description cannot be more than 255 characters");
};

export const descriptionDraft = (schema: yup.StringSchema) => {
  return schema
    .transform((value: string) => {
      if (value.length === 0 || value.trim().length === 0) return value;
      return value.trim();
    })
    .defined()
    .test("no-whitespace", "Enter post description", value => {
      return value.length === 0 ? true : !!value.trim();
    })
    .max(255, "Post description cannot be more than 255 characters");
};

export const excerpt = (schema: yup.StringSchema) => {
  return schema
    .trim()
    .required("Enter post excerpt")
    .max(300, "Post excerpt cannot be more than 300 characters");
};

export const excerptDraft = (schema: yup.StringSchema) => {
  return schema
    .transform((value: string) => {
      if (value.length === 0 || value.trim().length === 0) return value;
      return value.trim();
    })
    .defined()
    .test("no-whitespace", "Enter post excerpt", value => {
      return value.length === 0 ? true : !!value.trim();
    })
    .max(300, "Post excerpt cannot be more than 300 characters");
};
