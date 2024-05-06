import * as yup from "yup";

export const postMetadataValidator = yup
  .object({
    title: yup.string().required("Enter post title").trim("Enter post title"),
    description: yup
      .string()
      .trim("Enter post description")
      .required("Enter post description"),
    excerpt: yup
      .string()
      .trim("Enter post excerpt")
      .required("Enter post excerpt"),
  })
  .required("Provide post metadata");
