import EditProfileForm from "@features/settings/editProfile/EditProfileForm";
import settingsLayout from "@utils/layouts/settingsLayout";
import type { NextPageWithLayout } from "@types";

const EditMe: NextPageWithLayout = () => <EditProfileForm />;

EditMe.layout = settingsLayout("Edit your profile", {
  title: "Edit Admin Profile",
});

export default EditMe;
