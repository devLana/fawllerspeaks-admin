import * as yup from "yup";

export const metadataValidator = yup
  .object({
    title: yup
      .string()
      .required("Enter post title")
      .trim("Enter post title")
      .max(255, "Post title can not be more than 255 characters"),
    description: yup
      .string()
      .trim("Enter post description")
      .required("Enter post description")
      .max(255, "Post description can not be more than 255 characters"),
    excerpt: yup
      .string()
      .trim("Enter post excerpt")
      .required("Enter post excerpt")
      .max(300, "Post excerpt can not be more than 300 characters"),
  })
  .required("Provide post metadata");
