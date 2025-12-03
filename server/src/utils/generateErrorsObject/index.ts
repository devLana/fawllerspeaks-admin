import type { ValidationErrorItem } from "joi";

const generateErrorsObject = (errorList: ValidationErrorItem[]) => {
  return errorList.reduce<Record<string, string>>((errors, errorItem) => {
    const errorsMap = { ...errors };
    const value = errorItem.message;
    let field: string;

    if (errorItem.context?.label && errorItem.context.label.includes(".")) {
      field = errorItem.context.key as string;
    } else {
      [field] = errorItem.path as string[];
    }

    const key = `${field}Error`;

    if (Object.hasOwn(errorsMap, key)) return errorsMap;

    errorsMap[key] = value;

    return errorsMap;
  }, {});
};

export default generateErrorsObject;
