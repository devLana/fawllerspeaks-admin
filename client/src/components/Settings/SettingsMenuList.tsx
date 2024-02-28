import MenuList from "@mui/material/MenuList";

import SettingsMenuItem from "./SettingsMenuItem";
import { settingsLinks } from "@utils/settings/settingsLinks";

const SettingsMenuList = () => (
  <nav aria-label="Settings">
    <MenuList sx={{ py: 0 }}>
      {settingsLinks.map(link => (
        <SettingsMenuItem key={link.label} {...link} />
      ))}
    </MenuList>
  </nav>
);

export default SettingsMenuList;
