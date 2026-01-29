interface BaseEnvVars {
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

interface LocalEnvVars extends BaseEnvVars {
  NAME: "development" | "test";
  LOCAL_MAIL_HOST: string;
  LOCAL_MAIL_PORT: number;
  LOCAL_MAIL_USER: string;
  LOCAL_MAIL_PASSWORD: string;
  PG_CONNECTION_STRING?: never;
  RESEND_API_KEY?: never;
  RESEND_FROM?: never;
}

interface LiveEnvVars extends BaseEnvVars {
  NAME: "production" | "demo";
  PG_CONNECTION_STRING: string;
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  LOCAL_MAIL_HOST?: never;
  LOCAL_MAIL_PORT?: never;
  LOCAL_MAIL_USER?: never;
  LOCAL_MAIL_PASSWORD?: never;
}

export type EnvVars = LocalEnvVars | LiveEnvVars;
export type EnvKeys = keyof EnvVars;

export type EnvObject = {
  [Key in EnvKeys]?: string;
};

export interface SendOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}

export interface MailProvider {
  sendMail: (options: SendOptions) => Promise<void>;
}

export interface LocalMailConfig {
  LOCAL_MAIL_HOST: string;
  LOCAL_MAIL_PORT: number;
  LOCAL_MAIL_USER: string;
  LOCAL_MAIL_PASSWORD: string;
}

export interface ResendConfig {
  RESEND_API_KEY: string;
  RESEND_FROM: string;
}
