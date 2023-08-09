import Box from "@mui/material/Box";
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
      <div>
        <Typography variant="h1" gutterBottom>
          {pageHeading}
        </Typography>
        {children}
      </div>
    </Box>
  );
};

export default SettingsLayout;
