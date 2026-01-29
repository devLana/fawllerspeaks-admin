import type { MailProvider, SendOptions } from "types/mailService";
import GmailProvider from "./MailProviders/Gmail";
import ResendProvider from "./MailProviders/Resend";
import { env } from "@lib/env";

const createMailProvider = (): MailProvider => {
  switch (env.NAME) {
    case "development":
    case "test": {
      return new GmailProvider({
        LOCAL_MAIL_HOST: env.LOCAL_MAIL_HOST,
        LOCAL_MAIL_PORT: env.LOCAL_MAIL_PORT,
        LOCAL_MAIL_USER: env.LOCAL_MAIL_USER,
        LOCAL_MAIL_PASSWORD: env.LOCAL_MAIL_PASSWORD,
      });
    }

    case "demo":
    case "production": {
      return new ResendProvider({
        RESEND_API_KEY: env.RESEND_API_KEY,
        RESEND_FROM: env.RESEND_FROM,
      });
    }

    default:
      throw new Error(`Unsupported environment`);
  }
};

class MailService {
  private provider: MailProvider;

  constructor() {
    this.provider = createMailProvider();
  }

  async send(options: SendOptions): Promise<void> {
    await this.provider.sendMail(options);
  }
}

const mailService = new MailService();

export default mailService;
