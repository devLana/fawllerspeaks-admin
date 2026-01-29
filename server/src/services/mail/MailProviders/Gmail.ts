import nodemailer, { type Transporter } from "nodemailer";
import type {
  LocalMailConfig,
  MailProvider,
  SendOptions,
} from "types/mailService";

export default class GmailProvider implements MailProvider {
  private transporter: Transporter;

  constructor(protected readonly config: LocalMailConfig) {
    this.transporter = nodemailer.createTransport({
      secure: true,
      host: config.LOCAL_MAIL_HOST,
      port: config.LOCAL_MAIL_PORT,
      auth: { user: config.LOCAL_MAIL_USER, pass: config.LOCAL_MAIL_PASSWORD },
    });
  }

  async sendMail({ html, subject, to, text }: SendOptions): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.LOCAL_MAIL_USER,
      to,
      subject,
      html,
      text,
    });
  }
}
