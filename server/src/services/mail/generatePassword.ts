import mailService from ".";
import mailTemplate from "./mailTemplate";
import { urls } from "@lib/ClientUrls";
import { MailError } from "@lib/Errors";

const generatePasswordMail = async (email: string, password: string) => {
  const body = `
    <p>
      You have requested a new auto generated log in password for your admin dashboard.
    </p>
    <p style="margin:15px 0">
      Please copy your new password below and head over to the <a href="${urls.login}" target="_blank" rel="nofollow noopener noreferrer" style="color:#6a6a6a;font-weight:bold">dashboard</a> to log in.
    </p>
    <p>
      Upon initial login attempt, you will be required to register your account and change to your preferred password.
    </p>
    <div style="margin:25px 0">
      <span>New Password:</span>
      <span style="background-color:#7dd1f3;border-radius:5px;padding:20px;display:inline-block;color:#404040;font-weight:bold;letter-spacing:0.5px">${password}</span>
    </div>
    <p>
      <strong>If you were not the one who initiated this request, please ensure that your e-mail address is secure and ignore this email.</strong>
    </p>
  `;

  const text = `
    Fawller Speaks

    ---

    You have requested a new auto generated log in password for your admin dashboard.

    Please copy your new password below and head over to the dashboard to login at ${urls.login}.

    Upon initial login attempt, you will be required to register your account and change to your preferred password.

    New password: ${password}

    If you were not the one who initiated this request, please ensure that your e-mail address is secure and ignore this email.
  `;

  const subject = "Fawller Speaks Admin New Login Password";
  const html = mailTemplate(body);

  try {
    await mailService.send({ to: email, subject, html, text });
  } catch (e) {
    const msg = `A confirmation mail could not be sent for the generation of a password for user with email ${email}`;

    throw new MailError(
      `${msg}${e instanceof Error ? `. Error: ${e.message}` : ""}`,
    );
  }
};

export default generatePasswordMail;
