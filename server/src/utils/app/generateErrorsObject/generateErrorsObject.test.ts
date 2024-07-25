import { test, expect } from "@jest/globals";
import Joi, { type ValidationError } from "joi";

import generateErrorsObject from ".";

const schema = Joi.object().keys({
  stringField: Joi.string().required().messages({
    "any.required": "string field required",
  }),
  numberField: Joi.number().required().messages({
    "any.required": "number field required",
  }),
  booleanField: Joi.boolean().required().messages({
    "any.required": "boolean field required",
  }),
  arrayField: Joi.array().required().messages({
    "any.required": "array field required",
  }),
  arrayItems: Joi.array().items(
    Joi.string().trim().messages({ "string.empty": "array items required" })
  ),
  nestedObjectField: Joi.object().keys({
    nestedField: Joi.string().required().messages({
      "any.required": "nested field required",
    }),
  }),
  objectField: Joi.object().keys({}).required().messages({
    "any.required": "object field required",
  }),
});

test("Utils | Generate user input validation error object", () => {
  return schema
    .validateAsync(
      { nestedObjectField: {}, arrayItems: ["", ""] },
      { abortEarly: false }
    )
    .catch((err: ValidationError) => {
      const errResult = generateErrorsObject(err.details);

      expect(errResult).toStrictEqual({
        stringFieldError: "string field required",
        numberFieldError: "number field required",
        booleanFieldError: "boolean field required",
        arrayItemsError: "array items required",
        arrayFieldError: "array field required",
        nestedFieldError: "nested field required",
        objectFieldError: "object field required",
      });
    });
});
