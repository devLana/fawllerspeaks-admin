import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";

import SettingsMenuList from "@components/Settings/SettingsMenuList";
import SettingsMenu from "./SettingsMenu";

const mqInput = (theme: Theme) => theme.breakpoints.up("md");

const SettingsLayoutMenu = () => {
  const isMdScreen = useMediaQuery(mqInput);

  return (
    <Box sx={theme => ({ [theme.breakpoints.down("md")]: { mb: 2 } })}>
      {isMdScreen ? <SettingsMenuList /> : <SettingsMenu />}
    </Box>
  );
};

export default SettingsLayoutMenu;
