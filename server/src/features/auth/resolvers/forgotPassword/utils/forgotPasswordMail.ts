import { sendMail } from "@lib/mailService";
import { URL } from "node:url";
import { MailError } from "@utils/Errors";
import { urls } from "@utils/ClientUrls";

const forgotPasswordMail = async (email: string, token: string) => {
  try {
    const { href } = new URL(`${urls.resetPassword}?tId=${token}`);

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
          <p>Hi,</p>
          <p>
            A request has been made to reset your Fawller Speaks Admin Console password.
          </p>
          <p>
            You can click the link below to proceed with the request:
          </p>
          <p>
            <a
              href=${href}
              style="
                background-color: #7dd1f3;
                border-radius: 5px;
                padding: 20px;
                display: inline-block;
                color: #404040;
                font-weight: bold;
                text-decoration: none;
              "
            >
              Reset Password
            </a>
          </p>
          <p>
            Please take note that this link will only be valid for 5 minutes.
          </p>
          <div style="margin-top: 60px">
            <p>
              <strong>Didn't make this request?</strong>
            </p>
            <p>
              Please ensure your e-mail address is secure and proceed to the console to change your password.
            </p>
          </div>
        </div>
      </div>
    `;

    const text = `
      Fawller Speaks
      --------------

      A request has been made to reset your Fawller Speaks Admin Console password.

      You can copy the link below and paste in your browser to proceed with the request:
      ${href}
      please take note that this link will only be valid for 5 minutes.

      Didn't make this request?
      Please ensure your e-mail address is secure and proceed to the console to change your password.
    `;

    const subject = "Fawller Speaks Admin Reset Password";

    await sendMail({ to: email, subject, text, html });
  } catch (err) {
    throw new MailError(
      "Unable to send password reset link. Please try again later"
    );
  }
};

export default forgotPasswordMail;
