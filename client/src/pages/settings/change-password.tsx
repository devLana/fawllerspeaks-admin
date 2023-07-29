import settingsLayout from "@utils/settingsLayout.tsx";
import { type NextPageWithLayout } from "@types";

const ChangePassword: NextPageWithLayout = () => {
  return <form></form>;
};

ChangePassword.layout = settingsLayout("Change your password", {
  title: "Change Password",
});

export default ChangePassword;
