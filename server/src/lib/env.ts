import * as dotenv from "dotenv";
import joi from "joi";

interface BaseEnvVars {
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  CIPHER_ALGORITHM: string;
  CIPHER_KEY: string;
  CIPHER_IV: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

interface LocalEnvVars extends BaseEnvVars {
  NAME: "development" | "test";
  PG_CONNECTION_STRING: never;
}

interface LiveEnvVars extends BaseEnvVars {
  NAME: "production" | "demo";
  PG_CONNECTION_STRING: string;
}

type EnvVars = LocalEnvVars | LiveEnvVars;
type EnvKeys = keyof EnvVars;

type EnvObject = {
  [Key in EnvKeys]?: string;
};

dotenv.config();

export const rawEnv: EnvObject = {
  NAME: process.env.NODE_ENV,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  CIPHER_ALGORITHM: process.env.CIPHER_ALGORITHM,
  CIPHER_KEY: process.env.CIPHER_KEY,
  CIPHER_IV: process.env.CIPHER_IV,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  PG_CONNECTION_STRING: process.env.PG_CONNECTION_STRING,
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
      "string.only": `NODE_ENV must be initialized with one of 'production', 'demo', 'development', 'test'`,
    }),
  MAIL_HOST: joi.string().required().trim().messages({
    "any.required": "MAIL_HOST environment variable is required",
    "string.empty": "MAIL_HOST environment variable not provided",
  }),
  MAIL_PORT: joi
    .string()
    .required()
    .trim()
    .custom((value: string, helpers) => {
      const num = Number(value);
      return !Number.isFinite(num) ? helpers.error("number.base") : num;
    })
    .messages({
      "any.required": "MAIL_PORT environment variable is required",
      "string.empty": "MAIL_PORT environment variable not provided",
      "number.base": `MAIL_PORT environment variable is not a valid port number`,
    }),
  MAIL_USER: joi.string().required().trim().messages({
    "any.required": "MAIL_USER environment variable is required",
    "string.empty": "MAIL_USER environment variable not provided",
  }),
  MAIL_PASSWORD: joi.string().required().trim().messages({
    "any.required": "MAIL_PASSWORD environment variable is required",
    "string.empty": "MAIL_PASSWORD environment variable not provided",
  }),
  ACCESS_TOKEN_SECRET: joi.string().required().trim().messages({
    "any.required": "ACCESS_TOKEN_SECRET environment variable is required",
    "string.empty": "ACCESS_TOKEN_SECRET environment variable not provided",
  }),
  REFRESH_TOKEN_SECRET: joi.string().required().trim().messages({
    "any.required": "REFRESH_TOKEN_SECRET environment variable is required",
    "string.empty": "REFRESH_TOKEN_SECRET environment variable not provided",
  }),
  CIPHER_ALGORITHM: joi.string().required().trim().messages({
    "any.required": "CIPHER_ALGORITHM environment variable is required",
    "string.empty": "CIPHER_ALGORITHM environment variable not provided",
  }),
  CIPHER_KEY: joi.string().required().trim().messages({
    "any.required": "CIPHER_KEY environment variable is required",
    "string.empty": "CIPHER_KEY environment variable not provided",
  }),
  CIPHER_IV: joi.string().required().trim().messages({
    "any.required": "CIPHER_IV environment variable is required",
    "string.empty": "CIPHER_IV environment variable not provided",
  }),
  SUPABASE_SERVICE_ROLE_KEY: joi.string().required().trim().messages({
    "any.required":
      "SUPABASE_SERVICE_ROLE_KEY environment variable is required",
    "string.empty":
      "SUPABASE_SERVICE_ROLE_KEY environment variable not provided",
  }),
  PG_CONNECTION_STRING: joi.string().when("NAME", {
    is: joi.string().valid("production", "demo"),
    then: joi.string().required().trim().messages({
      "any.required": "PG_CONNECTION_STRING environment variable is required",
      "string.empty": "PG_CONNECTION_STRING environment variable not provided",
    }),
    otherwise: joi.forbidden().messages({
      "any.unknown":
        "PG_CONNECTION_STRING is not needed in development or test environments",
    }),
  }),
});

const { error, value } = schema.validate(rawEnv, { abortEarly: false });

if (error) {
  // Collect all errors in a readable format
  const errors = error.details.reduce<EnvObject>((errs, errorItem) => {
    const errorsMap = { ...errs };
    const { message } = errorItem;
    const [field] = errorItem.path as EnvKeys[];

    if (Object.hasOwn(errorsMap, field)) return errorsMap;

    errorsMap[field] = message;
    return errorsMap;
  }, {});

  console.error("Environment variable validation failed:");

  Object.values(errors).forEach(errorMsg => {
    console.error(errorMsg);
  });

  process.exit(1);
}

export const env: EnvVars = value;
