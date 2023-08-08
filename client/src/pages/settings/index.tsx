import Typography from "@mui/material/Typography";

import RootLayout from "@layouts/RootLayout";
import SettingsMenu from "@components/SettingsMenu";
import uiLayout from "@utils/uiLayout";
import { type NextPageWithLayout } from "@types";

const Settings: NextPageWithLayout = () => (
  <>
    <Typography variant="h1" gutterBottom>
      Manage Your Account Settings
    </Typography>
    <SettingsMenu />
  </>
);

Settings.layout = uiLayout(RootLayout, { title: "Account Settings" });

export default Settings;
