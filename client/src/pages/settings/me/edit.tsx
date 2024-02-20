import useGetUserInfo from "@hooks/useGetUserInfo";
import EditProfileForm from "@features/settings/editProfile/components/EditProfileForm";
import settingsLayout from "@utils/settings/settingsLayout";
import type { NextPageWithLayout } from "@types";

const EditMe: NextPageWithLayout = () => {
  const user = useGetUserInfo();

  return (
    <EditProfileForm
      firstName={user?.firstName ?? ""}
      lastName={user?.lastName ?? ""}
      userImage={user?.image ?? ""}
    />
  );
};

EditMe.layout = settingsLayout("Edit your profile", {
  title: "Edit Admin Profile",
});

export default EditMe;
