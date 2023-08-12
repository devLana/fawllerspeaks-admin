import Typography from "@mui/material/Typography";

import RootLayout from "@layouts/RootLayout";
import SettingsMenuList from "@components/Settings/SettingsMenuList";
import uiLayout from "@utils/uiLayout";
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
