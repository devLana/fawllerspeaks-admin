import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";

import SettingsMenuList from "./SettingsMenuList";
import SettingsMenu from "./SettingsMenu";

const SettingsLayoutMenu = () => {
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  return (
    <Box sx={theme => ({ [theme.breakpoints.down("md")]: { mb: 2 } })}>
      {mdAbove ? <SettingsMenuList /> : <SettingsMenu />}
    </Box>
  );
};

export default SettingsLayoutMenu;
