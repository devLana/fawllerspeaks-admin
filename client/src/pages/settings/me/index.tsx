import settingsLayout from "@utils/settings/settingsLayout";
import { type NextPageWithLayout } from "@types";

const Me: NextPageWithLayout = () => {
  return <div />;
};

Me.layout = settingsLayout("My profile", { title: "Admin Profile" });

export default Me;
