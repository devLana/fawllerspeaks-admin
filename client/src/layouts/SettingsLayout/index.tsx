import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import SettingsLayoutMenu from "./components/SettingsLayoutMenu";

export interface SettingsLayoutProps {
  pageHeading: string;
  children: React.ReactElement;
}

const SettingsLayout = ({ pageHeading, children }: SettingsLayoutProps) => {
  return (
    <Box
      sx={theme => ({
        [theme.breakpoints.up("md")]: {
          display: "flex",
          columnGap: 5,
        },
      })}
    >
      <SettingsLayoutMenu />
      <Divider
        orientation="vertical"
        flexItem
        light
        sx={theme => ({ [theme.breakpoints.down("md")]: { display: "none" } })}
      />
      <Box
        sx={theme => ({
          [theme.breakpoints.up("md")]: { maxWidth: 550, mx: "auto" },
        })}
      >
        <Typography variant="h1" gutterBottom>
          {pageHeading}
        </Typography>
        {children}
      </Box>
    </Box>
  );
};

export default SettingsLayout;
