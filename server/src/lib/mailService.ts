import nodemailer, { type Transporter, type SendMailOptions } from "nodemailer";
import { nodeEnv } from "../utils/app/nodeEnv";

const mailTransporter: Transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: nodeEnv === "production",
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
});

export const sendMail = (options: Omit<SendMailOptions, "from">) => {
  const { html, subject, to, text } = options;

  return mailTransporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
  });
};

export default mailTransporter;
