import Typography from "@mui/material/Typography";

import RootLayout from "@layouts/RootLayout";
import SettingsMenuList from "@layouts/SettingsLayout/components/SettingsMenuList";
import uiLayout from "@utils/layouts/uiLayout";
import { type NextPageWithLayout } from "@types";

const Settings: NextPageWithLayout = () => (
  <>
    <Typography variant="h1" gutterBottom>
      Manage your account settings
    </Typography>
    <SettingsMenuList />
  </>
);

Settings.layout = uiLayout(RootLayout, { title: "Account Settings" });

export default Settings;
