import * as yup from "yup";

export const createPostTagsSchema = (inputs: number[]) => {
  const schemaObject: Record<string, yup.StringSchema<string>> = {};

  for (const val of inputs) {
    const value = yup
      .string()
      .trim("Enter post tag")
      .required("Enter post tag");

    schemaObject[`post-tag-${val}`] = value;
  }

  return yup.object(schemaObject).required("Provide post tags");
};
