import * as yup from "yup";

export const editPostTagSchema = yup
  .object({
    name: yup
      .string()
      .trim("Enter post tag name")
      .required("Enter new post tag name"),
  })
  .required("Provide new post tag name");
