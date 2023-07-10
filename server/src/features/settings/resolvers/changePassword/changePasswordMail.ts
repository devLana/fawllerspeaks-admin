import sgMail from "@sendgrid/mail";
import { MailError } from "@utils";

const changePasswordMail = async (email: string) => {
  const errorMsg =
    "Unable to send password change confirmation mail. Please try again later";

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
      "
    >
      <h1 style="color: #7dd1f3">Fawller Speaks</h1>
      <p>Your password has been successfully changed.</p>
      <div style="margin-top: 60px">
        <p>
          <strong>Didn't change your password?</strong>
        </p>
        <p>
          If you didn't carry out this action, please open a ticket at
          <a
            style="color: #6a6a6a; font-weight: bold"
            href="mailto:info@fawllerspeaks.com"
            >info@fawllerspeaks.com</a
          >.
        </p>
      </div>
    </div>
  `;

  const text = `
    Fawller Speaks
    --------------

    Your password has been successfully changed.

    Didn't reset your password?
    If you didn't carry out this action, please open a ticket at info@fawllerspeaks.com.
  `;

  const mail = {
    to: email,
    from: "info@fawllerspeaks.com",
    subject: "Fawller Speaks Admin Password Change",
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

export default changePasswordMail;
