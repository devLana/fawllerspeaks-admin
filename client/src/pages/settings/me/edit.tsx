import EditProfileForm from "@features/settings/editProfile/components/EditProfileForm";
import settingsLayout from "@layouts/SettingsLayout/utils/settingsLayout";
import type { NextPageWithLayout } from "@types";

const EditMe: NextPageWithLayout = () => <EditProfileForm />;

EditMe.layout = settingsLayout("Edit your profile", {
  title: "Edit Admin Profile",
});

export default EditMe;
