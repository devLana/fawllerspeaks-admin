import { mailService } from ".";
import { mailTemplate } from "./mailTemplate";
import { urls } from "@lib/ClientUrls";
import { MailError } from "@lib/Errors";

export const resetPasswordMail = async (email: string) => {
  const body = `
    <p>
      The password for your admin dashboard has been reset. You can now go ahead and
      <a href="${urls.login}" target="__blank" rel="nofollow noopener noreferrer" style="color:#6a6a6a;font-weight:bold;text-decoration:underline">login</a>
      with your new password.
    </p>
    <p style="margin:15px 0">
      <strong>If you were not the one who initiated this request, please take the following steps to secure your account:</strong>
    </p>
    <ol style="margin:0;list-style-type:lower-roman">
      <li>Make sure your e-mail address and e-mail address password are secure</li>
      <li style="margin:10px 0">
        Head over to the dashboard and
        <a href="${urls.forgotPassword}" target="__blank" rel="nofollow noopener noreferrer" style="color:#6a6a6a;font-weight:bold;text-decoration:underline">reset your account's password</a>
      </li>
      <li>
        If you are experiencing any other issues, you can reach out to support at
        <a style="color:#6a6a6a;font-weight:bold;text-decoration:underline" href="mailto:info@fawllerspeaks.com">info@fawllerspeaks.com</a>.
      </li>
    </ol>
  `;

  const text = `
    Fawller Speaks

    ---

    The password for your admin dashboard has been reset. You can now go ahead and log in with your new password at ${urls.login}.

    If you were not the one who initiated this request, please take the following steps to secure your account:

      - Make sure your e-mail address and e-mail address password are secure

      - Head over to the dashboard and reset your password at ${urls.forgotPassword}

      - If you are experiencing any other issues, you can reach out to support at info@fawllerspeaks.com
  `;

  const subject = "Fawller Speaks Admin Password Reset";
  const html = mailTemplate(body);

  try {
    await mailService.send({ to: email, subject, html, text });
  } catch (e) {
    const msg = `Password has been reset for user with email ${email} but a confirmation mail could not be sent`;

    throw new MailError(
      `${msg}${e instanceof Error ? `. Error: ${e.message}` : ""}`,
    );
  }
};
