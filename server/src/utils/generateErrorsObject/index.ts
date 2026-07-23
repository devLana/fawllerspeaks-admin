import type { ValidationErrorItem } from "joi";

export const generateErrorsObject = (errorList: ValidationErrorItem[]) => {
  return errorList.reduce<Record<string, string>>((errors, errorItem) => {
    const { context, path, message } = errorItem;
    let field: string | number | undefined;

    if (context?.label?.includes(".")) {
      field = context.key;
    } else {
      [field] = path;
    }

    if (typeof field !== "string" || !field) return errors;

    const key = `${field}Error`;

    if (Object.hasOwn(errors, key)) return errors;

    return { ...errors, [key]: message };
  }, {});
};
