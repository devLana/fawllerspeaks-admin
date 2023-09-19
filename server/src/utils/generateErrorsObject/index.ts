import type { ValidationErrorItem } from "joi";

type ErrorResult = Record<string, string>;

const generateErrorsObject = (errorList: ValidationErrorItem[]) => {
  return errorList.reduce<ErrorResult>((errors, errorItem) => {
    const errorsMap = { ...errors };
    const [field] = errorItem.path;
    const key = `${field}Error`;
    const value = errorItem.message;

    if (Object.hasOwn(errorsMap, key)) return errorsMap;

    errorsMap[key] = value;

    return errorsMap;
  }, {});
};

export default generateErrorsObject;
