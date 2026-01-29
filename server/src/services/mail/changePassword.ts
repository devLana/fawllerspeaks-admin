import mailService from ".";
import mailTemplate from "./mailTemplate";
import { MailError } from "@lib/Errors";
import { urls } from "@lib/ClientUrls";

const changePasswordMail = async (email: string) => {
  const body = `
    <p>Your password has been successfully changed.</p>
    <p style="margin:15px 0">
      <strong>If you were not the one who initiated this request, please take the following steps to secure your account:</strong>
    </p>
    <ol style="margin:0;list-style-type:lower-roman">
      <li>Make sure your e-mail address and e-mail address password are secure</li>
      <li style="margin:10px 0">
        Head over to the dashboard and
        <a href=${urls.forgotPassword} target="__blank" rel="nofollow noopener noreferrer" style="color:#6a6a6a;font-weight:bold;text-decoration:underline">reset your account's password</a>
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

    Your password has been successfully changed.

    If you were not the one who initiated this request, please take the following steps to secure your account:

      - Make sure your e-mail address and e-mail address password are secure

      - Head over to the dashboard and reset your password at ${urls.forgotPassword}

      - If you are experiencing any other issues, you can reach out to support at info@fawllerspeaks.com
  `;

  const subject = "Fawller Speaks Admin Password Change";
  const html = mailTemplate(body);

  try {
    await mailService.send({ to: email, subject, html, text });
  } catch (e) {
    const msg = `Unable to send mail notification confirming the change of user password`;

    throw new MailError(
      `${msg}${e instanceof Error ? `. Error: ${e.message}` : ""}`,
    );
  }
};

export default changePasswordMail;
