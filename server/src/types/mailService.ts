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
