import settingsLayout from "@utils/settings/settingsLayout";
import { type NextPageWithLayout } from "@types";

const EditMe: NextPageWithLayout = () => {
  return <div />;
};

EditMe.layout = settingsLayout("Edit your profile", {
  title: "Edit Admin Profile",
});

export default EditMe;
