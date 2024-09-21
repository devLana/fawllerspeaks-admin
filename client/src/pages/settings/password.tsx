import ChangePasswordForm from "@features/settings/changePassword/ChangePasswordForm";
import settingsLayout from "@utils/layouts/settingsLayout";
import type { NextPageWithLayout } from "@types";

const ChangePassword: NextPageWithLayout = () => <ChangePasswordForm />;

ChangePassword.layout = settingsLayout("Change your password", {
  title: "Change Password",
});

export default ChangePassword;
