import { Resend } from "resend";
import type {
  ResendConfig,
  MailProvider,
  SendOptions,
} from "types/mailService";

export default class ResendProvider implements MailProvider {
  private client: Resend;

  constructor(protected readonly config: ResendConfig) {
    this.client = new Resend(config.RESEND_API_KEY);
  }

  async sendMail({ to, subject, html, text }: SendOptions): Promise<void> {
    const { error } = await this.client.emails.send({
      from: this.config.RESEND_FROM,
      to,
      subject,
      html,
      text,
    });

    if (error) throw new Error(`Resend error: ${error.message}`);
  }
}
