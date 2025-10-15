import { sendMail } from "@lib/mailService";
import { MailError } from "@utils/Errors";
import { urls } from "@utils/ClientUrls";

const sessionMail = async (email: string) => {
  const html = `
    <div
      style="
        font-family: Verdana, sans-serif;
        color: #404040;
        text-align: center;
        background-color: #fff;
        max-width: 900px;
        margin: 0 auto;
        padding: 10px;
      "
    >
      <h1 style="color: #7dd1f3">Fawller Speaks</h1>
      <div>
        <p>
          Suspicious activity has been detected on your account at <strong style="color: #6a6a6a">${email}</strong>.
        </p>
        <p>
          As a result, all active sessions on this account have been closed and you will need to <a href=${urls.login} style="color: #6a6a6a; font-weight: bold">log in</a> again to continue using the admin console.
        </p>
        <p>
          We advice that you also <a href=${urls.forgotPassword} style="color: #6a6a6a; font-weight: bold">change your password</a> to keep your account secure.
        </p>
      </div>
    </div>
`;

  const text = `
    Fawller Speaks
    --------------

    Suspicious activity has been detected on your account at ${email}.

    As a result, all active sessions on this account have been closed and you will need to log in again at ${urls.login} to continue using the admin console.

    We advice that you also change your password at ${urls.forgotPassword} to keep your account secure.
  `;

  const subject = "Fawller Speaks Admin Activity";

  try {
    await sendMail({ to: email, subject, text, html });
  } catch (err) {
    throw new MailError("Unable to send mail. Please try again later");
  }
};

export default sessionMail;
