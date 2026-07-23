import * as dotenv from "dotenv";
import joi from "joi";
import type { EnvObject, EnvVars } from "@appTypes/environment";

dotenv.config();

const rawEnv: EnvObject = {
  NAME: process.env["NODE_ENV"],
  LOCAL_MAIL_HOST: process.env["LOCAL_MAIL_HOST"],
  LOCAL_MAIL_PORT: process.env["LOCAL_MAIL_PORT"],
  LOCAL_MAIL_USER: process.env["LOCAL_MAIL_USER"],
  LOCAL_MAIL_PASSWORD: process.env["LOCAL_MAIL_PASSWORD"],
  ACCESS_TOKEN_SECRET: process.env["ACCESS_TOKEN_SECRET"],
  REFRESH_TOKEN_SECRET: process.env["REFRESH_TOKEN_SECRET"],
  SUPABASE_SERVICE_ROLE_KEY: process.env["SUPABASE_SERVICE_ROLE_KEY"],
  PG_CONNECTION_STRING: process.env["PG_CONNECTION_STRING"],
  RESEND_API_KEY: process.env["RESEND_API_KEY"],
  RESEND_FROM: process.env["RESEND_FROM"],
};

const schema = joi.object<EnvVars>({
  NAME: joi
    .string()
    .required()
    .trim()
    .valid("production", "demo", "development", "test")
    .messages({
      "any.required": "NODE_ENV environment variable is required",
      "string.empty": "NODE_ENV environment variable not provided",
      "string.only": `NODE_ENV must be initialized with one of the following values: 'production', 'demo', 'development' or 'test'`,
    }),
  ACCESS_TOKEN_SECRET: joi.string().required().trim().messages({
    "any.required": "ACCESS_TOKEN_SECRET environment variable is required",
    "string.empty": "ACCESS_TOKEN_SECRET environment variable not provided",
  }),
  REFRESH_TOKEN_SECRET: joi.string().required().trim().messages({
    "any.required": "REFRESH_TOKEN_SECRET environment variable is required",
    "string.empty": "REFRESH_TOKEN_SECRET environment variable not provided",
  }),
  SUPABASE_SERVICE_ROLE_KEY: joi.string().required().trim().messages({
    "any.required": `SUPABASE_SERVICE_ROLE_KEY environment variable is required`,
    "string.empty": `SUPABASE_SERVICE_ROLE_KEY environment variable not provided`,
  }),
  LOCAL_MAIL_HOST: joi.string().when("NAME", {
    is: joi.string().valid("development", "test"),
    then: joi.string().required().trim().messages({
      "any.required": "LOCAL_MAIL_HOST environment variable is required",
      "string.empty": "LOCAL_MAIL_HOST environment variable not provided",
    }),
    otherwise: joi.any().forbidden().messages({
      "any.unknown": `LOCAL_MAIL_HOST is not needed in production or demo environments`,
    }),
  }),
  LOCAL_MAIL_PORT: joi.string().when("NAME", {
    is: joi.string().valid("development", "test"),
    then: joi
      .string()
      .required()
      .trim()
      .custom((value: string, helpers) => {
        const num = Number(value);
        return !Number.isFinite(num) ? helpers.error("number.base") : num;
      })
      .messages({
        "any.required": "LOCAL_MAIL_PORT environment variable is required",
        "string.empty": "LOCAL_MAIL_PORT environment variable not provided",
        "number.base": `LOCAL_MAIL_PORT environment variable is not a valid port number`,
      }),
    otherwise: joi.any().forbidden().messages({
      "any.unknown": `LOCAL_MAIL_PORT is not needed in production or demo environments`,
    }),
  }),
  LOCAL_MAIL_USER: joi.string().when("NAME", {
    is: joi.string().valid("development", "test"),
    then: joi.string().required().trim().messages({
      "any.required": "LOCAL_MAIL_USER environment variable is required",
      "string.empty": "LOCAL_MAIL_USER environment variable not provided",
    }),
    otherwise: joi.any().forbidden().messages({
      "any.unknown": `LOCAL_MAIL_USER is not needed in production or demo environments`,
    }),
  }),
  LOCAL_MAIL_PASSWORD: joi.string().when("NAME", {
    is: joi.string().valid("development", "test"),
    then: joi.string().required().trim().messages({
      "any.required": "LOCAL_MAIL_PASSWORD environment variable is required",
      "string.empty": "LOCAL_MAIL_PASSWORD environment variable not provided",
    }),
    otherwise: joi.any().forbidden().messages({
      "any.unknown": `LOCAL_MAIL_PASSWORD is not needed in production or demo environments`,
    }),
  }),
  PG_CONNECTION_STRING: joi.string().when("NAME", {
    is: joi.string().valid("production", "demo"),
    then: joi.string().required().trim().messages({
      "any.required": "PG_CONNECTION_STRING environment variable is required",
      "string.empty": "PG_CONNECTION_STRING environment variable not provided",
    }),
    otherwise: joi.any().forbidden().messages({
      "any.unknown": `PG_CONNECTION_STRING is not needed in development or test environments`,
    }),
  }),
  RESEND_API_KEY: joi.string().when("NAME", {
    is: joi.string().valid("production", "demo"),
    then: joi.string().required().trim().messages({
      "any.required": "RESEND_API_KEY environment variable is required",
      "string.empty": "RESEND_API_KEY environment variable not provided",
    }),
    otherwise: joi.any().forbidden().messages({
      "any.unknown": `RESEND_API_KEY is not needed in development or test environments`,
    }),
  }),
  RESEND_FROM: joi.string().when("NAME", {
    is: joi.string().valid("production", "demo"),
    then: joi.string().required().trim().messages({
      "any.required": "RESEND_FROM environment variable is required",
      "string.empty": "RESEND_FROM environment variable not provided",
    }),
    otherwise: joi.any().forbidden().messages({
      "any.unknown": `RESEND_FROM is not needed in development or test environments`,
    }),
  }),
});

const result = schema.validate(rawEnv, { abortEarly: false });

if (result.error) {
  // Collect all errors in a readable format
  const errors = result.error.details.reduce((errs, errorItem) => {
    const { message, path } = errorItem;
    const [field] = path;

    if (typeof field !== "string" || Object.hasOwn(errs, field)) return errs;

    return { ...errs, [field]: message };
  }, {});

  console.error("Environment variable validation failed:");

  Object.values(errors).forEach(errorMsg => {
    console.error(errorMsg);
  });

  process.exit(1);
}

export const env = result.value;
