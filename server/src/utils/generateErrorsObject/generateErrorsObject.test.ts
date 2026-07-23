import { test, expect } from "@jest/globals";
import Joi, { ValidationError } from "joi";

import { generateErrorsObject } from ".";

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
    Joi.string().trim().messages({ "string.empty": "array items required" }),
  ),
  objectField: Joi.object().keys({}).required().messages({
    "any.required": "object field required",
  }),
  nestedObjectField: Joi.object().keys({
    nestedField: Joi.string().required().messages({
      "any.required": "nested field required",
    }),
  }),
});

test("@utils | Generate user input validation error object", async () => {
  try {
    const rawObj = { nestedObjectField: {}, arrayItems: ["", ""] };
    await schema.validateAsync(rawObj, { abortEarly: false });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errResult = generateErrorsObject(err.details);

      expect(errResult).toStrictEqual({
        stringFieldError: "string field required",
        numberFieldError: "number field required",
        booleanFieldError: "boolean field required",
        arrayItemsError: "array items required",
        arrayFieldError: "array field required",
        objectFieldError: "object field required",
        nestedFieldError: "nested field required",
      });
    }
  }
});
