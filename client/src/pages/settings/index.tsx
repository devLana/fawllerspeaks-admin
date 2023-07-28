import settingsLayout from "@utils/settingsLayout.tsx";
import { type NextPageWithLayout } from "@types";

const Settings: NextPageWithLayout = () => <div>Settings Page</div>;

Settings.layout = settingsLayout("Settings", { title: "Settings" });

export default Settings;
