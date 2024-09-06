import ChangePasswordForm from "@features/settings/changePassword/components/ChangePasswordForm";
import settingsLayout from "@layouts/SettingsLayout/utils/settingsLayout";
import type { NextPageWithLayout } from "@types";

const ChangePassword: NextPageWithLayout = () => <ChangePasswordForm />;

ChangePassword.layout = settingsLayout("Change your password", {
  title: "Change Password",
});

export default ChangePassword;
