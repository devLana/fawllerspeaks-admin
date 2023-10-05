import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import SettingsLayoutMenu from "./components/SettingsLayoutMenu";

export interface SettingsLayoutProps {
  pageHeading: string;
  children: React.ReactElement;
}

const SettingsLayout = ({ pageHeading, children }: SettingsLayoutProps) => (
  <Box columnGap={{ md: 5 }} display={{ md: "flex" }}>
    <SettingsLayoutMenu />
    <Divider
      orientation="vertical"
      flexItem
      light
      sx={theme => ({ [theme.breakpoints.down("md")]: { display: "none" } })}
    />
    <div>
      <Typography variant="h1" gutterBottom>
        {pageHeading}
      </Typography>
      {children}
    </div>
  </Box>
);

export default SettingsLayout;
