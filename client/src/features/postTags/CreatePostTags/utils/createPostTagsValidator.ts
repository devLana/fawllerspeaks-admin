import * as yup from "yup";

export const createPostTagsValidator = (inputs: number[]) => {
  const schemaObject: Record<string, yup.StringSchema<string>> = {};

  for (const val of inputs) {
    const key = `post-tag-${val}`;
    const value = yup
      .string()
      .trim("Enter post tag")
      .required("Enter post tag");

    schemaObject[key] = value;
  }

  return yup.object(schemaObject).required("Provide post tags");
};
