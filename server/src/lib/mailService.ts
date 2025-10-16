import nodemailer, { type Transporter, type SendMailOptions } from "nodemailer";
import { env } from "@lib/env";

const mailTransporter: Transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.NAME === "production",
  auth: { user: env.MAIL_USER, pass: env.MAIL_PASSWORD },
});

export const sendMail = (options: Omit<SendMailOptions, "from">) => {
  const { html, subject, to, text } = options;

  return mailTransporter.sendMail({
    from: env.MAIL_USER,
    to,
    subject,
    text,
    html,
  });
};

export default mailTransporter;
