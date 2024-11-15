import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import SettingsLayoutMenu from "./components/SettingsLayoutMenu";

export interface SettingsLayoutProps {
  pageHeading: string;
  children: React.ReactElement;
}

const SettingsLayout = ({ pageHeading, children }: SettingsLayoutProps) => (
  <Box sx={{ display: { md: "flex" }, columnGap: { md: 2 } }}>
    <SettingsLayoutMenu />
    <Divider
      orientation="vertical"
      flexItem
      light
      sx={theme => ({ [theme.breakpoints.down("md")]: { display: "none" } })}
    />
    <Box sx={{ flexGrow: { md: 1 } }}>
      <Typography variant="h1" gutterBottom id="page-title">
        {pageHeading}
      </Typography>
      {children}
    </Box>
  </Box>
);

export default SettingsLayout;
