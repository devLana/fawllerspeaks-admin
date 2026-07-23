import { mailService } from ".";
import { mailTemplate } from "./mailTemplate";
import { MailError } from "@lib/Errors";
import { urls } from "@lib/ClientUrls";

export const sessionMail = async (email: string) => {
  const body = `
    <p>
      <strong>Suspicious activity has been detected on your Fawller Speaks admin dashboard account</strong>.
    </p>
    <p style="margin:15px 0">
      As a result, all active sessions for your account have been closed and you will need to <a href="${urls.login}" target="__blank" rel="nofollow noopener noreferrer" style="color:#6a6a6a;font-weight:bold">log in</a> again to continue using the dashboard.
    </p>
    <p style="margin-bottom:15px">
      <strong>We advice that you take the following steps to keep your account secure:</strong>
    </p>
    <ol style="margin:0;list-style-type:lower-roman">
      <li style="margin-bottom:10px">Make sure your e-mail address and e-mail address password are secure</li>
      <li>Optionally, you can
        <a href=${urls.forgotPassword} target="__blank" rel="nofollow noopener noreferrer" style="color:#6a6a6a;font-weight:bold">reset your account's password</a>
      </li>
    </ol>
  `;

  const text = `
    Fawller Speaks

    ---

    Suspicious activity has been detected on your Fawller Speaks admin dashboard account</strong>.

    As a result, all active sessions for your account have been closed and you will need to log in again at ${urls.login} to continue using the dashboard.

    We advice that you take the following steps to keep your account secure:
      - Make sure your e-mail address and e-mail address password are secure
      - Optionally, you can reset your account's password at ${urls.forgotPassword}
  `;

  const subject = "Fawller Speaks Admin Activity";
  const html = mailTemplate(body);

  try {
    await mailService.send({ to: email, subject, html, text });
  } catch (e) {
    const msg = "Unable to send mail. Please try again later";

    throw new MailError(
      `${msg}${e instanceof Error ? `. Error: ${e.message}` : ""}`,
    );
  }
};
