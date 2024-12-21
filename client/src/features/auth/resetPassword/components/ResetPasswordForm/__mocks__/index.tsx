import type { ResetPasswordFormProps as Props } from "types/auth/resetPassword";

const ResetPasswordForm = ({ email }: Pick<Props, "email">) => (
  <form aria-labelledby="page-title">
    <label htmlFor="email">E-Mail</label>
    <input id="email" autoComplete="email" value={email} readOnly />
  </form>
);

export default ResetPasswordForm;
