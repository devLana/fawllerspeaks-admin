import { URL } from "node:url";

import mailService from ".";
import mailTemplate from "./mailTemplate";
import { MailError } from "@lib/Errors";
import { urls } from "@lib/ClientUrls";

const forgotPasswordMail = async (email: string, token: string) => {
  try {
    const { href } = new URL(`${urls.resetPassword}?tId=${token}`);

    const body = `
      <p style="margin-bottom:15px">
        A request has been made to reset the password of your Fawller Speaks admin dashboard account.
      </p>
      <p style="margin-bottom:25px">
        You can click the link below to proceed with your password reset:
      </p>
      <p style="margin-bottom:25px">
        <a href="${href}" style="background-color:#7dd1f3;border-radius:5px;padding:20px;display:inline-block;color:#404040;font-weight:bold;text-decoration:none">Reset Password</a>
      </p>
      <p style="margin-bottom:15px">
        Please take note that this link will only be valid for the next 5 minutes.
      </p>
      <p style="margin-bottom:15px">
        <strong>If you were not the one who initiated this request, please ensure that your e-mail address is secure and ignore this email.</strong>
      </p>
      <p>
        <strong>Optionally, you can proceed to the admin dashboard to change your password.</strong>
      </p>
    `;

    const text = `
      Fawller Speaks

      ---

      A request has been made to reset the password of your Fawller Speaks admin dashboard account.

      You can click the link below to proceed with your password reset:
      ${href}

      Please take note that this link will only be valid for the next 5 minutes.

      If you were not the one who initiated this request, please ensure that your e-mail address is secure and ignore this email.

      Optionally, you can proceed to the admin dashboard to change your password.
    `;

    const subject = "Fawller Speaks Admin Reset Password";
    const html = mailTemplate(body);

    await mailService.send({ to: email, subject, html, text });
  } catch (e) {
    const msg = `Unable to send password reset link. Please try again later`;

    throw new MailError(
      `${msg}${e instanceof Error ? `. Error: ${e.message}` : ""}`,
    );
  }
};

export default forgotPasswordMail;
