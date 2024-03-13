import sgMail from "@sendgrid/mail";
import { urls } from "@utils/ClientUrls";
import { MailError } from "@utils/Errors";

const resetPasswordMail = async (email: string) => {
  const errorMsg =
    "Your password has been reset but we are unable to send a confirmation mail at this time";

  if (!process.env.SEND_GRID_API_KEY) {
    throw new MailError(errorMsg);
  }

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
      <p>
        Your password has been reset. You can now go ahead and <a href=${urls.login} style="color: #6a6a6a; font-weight: bold">log in</a> to the admin console with your new password.
      </p>
      <div style="margin-top: 60px">
        <p>
          <strong>Didn't reset your password?</strong>
        </p>
        <p>
          Please ensure your e-mail address is secure and open a ticket at
          <a
            style="color: #6a6a6a; font-weight: bold"
            href="mailto:info@fawllerspeaks.com"
          >
            info@fawllerspeaks.com
          </a>.
        </p>
      </div>
    </div>
  `;

  const text = `
    Fawller Speaks
    --------------

    Your password has been reset. You can now go ahead and log in to the admin console at ${urls.login} with your new password.

    Didn't reset your password?
    Please ensure your e-mail address is secure and open a ticket at info@fawllerspeaks.com.
  `;

  const mail = {
    to: email,
    from: "info@fawllerspeaks.com",
    subject: "Fawller Speaks Admin Password Reset",
    text,
    html,
  };

  try {
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    await sgMail.send(mail);
  } catch {
    throw new MailError(errorMsg);
  }
};

export default resetPasswordMail;
