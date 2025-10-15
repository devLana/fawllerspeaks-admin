import { sendMail } from "@lib/mailService";
import { urls } from "@utils/ClientUrls";
import { MailError } from "@utils/Errors";

const generatePasswordMail = async (email: string, password: string) => {
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
          A request has been made for a log in password on your new admin console account.
        </p>
        <p>
          Please copy the password below and head over to the <a href=${urls.login} style="color: #6a6a6a; font-weight: bold">admin console log in page</a> to log in.
        </p>
        <p>
          You will be mandated to change this password to your preferred password upon your first log in attempt.
        </p>
      </div>
      <div style="margin-top: 25px">
        <span>Password:</span>
        <span
          style="
            background-color: #7dd1f3;
            border-radius: 5px;
            padding: 20px;
            display: inline-block;
            color: #404040;
            font-weight: bold;
            letter-spacing: 0.5px;
          "
        >
          ${password}
        </span>
      </div>
      <div style="margin-top: 25px">
        <p>
          <strong>Didn't make this request?</strong>
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
        </p>
      </div>
    </div>
  `;

  const text = `
    Fawller Speaks
    --------------

    A request has been made for a log in password on your new admin console account.

    Please copy the password below and head over to the admin console login page at ${urls.login} to log in.

    You will be mandated to change this password to your preferred password upon your first log in attempt.

    Password: ${password}

    Didn't make this request?
    Please ensure your e-mail address is secure and open a ticket at info@fawllerspeaks.com
  `;

  const subject = "Fawller Speaks Admin New Login Password";

  try {
    await sendMail({ to: email, subject, text, html });
  } catch {
    throw new MailError(
      "Unable to send confirmation mail. Please try again later"
    );
  }
};

export default generatePasswordMail;
