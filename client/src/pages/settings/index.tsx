import Typography from "@mui/material/Typography";

import settingsLayout from "@utils/settingsLayout.tsx";
import { type NextPageWithLayout } from "@types";

const Settings: NextPageWithLayout = () => (
  <Typography variant="h2">Manage Your Account Settings</Typography>
);

Settings.layout = settingsLayout("Settings", { title: "Account Settings" });

export default Settings;
