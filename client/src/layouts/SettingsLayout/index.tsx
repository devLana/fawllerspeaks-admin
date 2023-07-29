import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import SettingsNavLinks from "./components/SettingsNavLinks";

export interface SettingsLayoutProps {
  pageHeading: string;
  children: React.ReactElement;
}

const SettingsLayout = ({ pageHeading, children }: SettingsLayoutProps) => {
  return (
    <>
      <Typography variant="h1">{pageHeading}</Typography>
      <Box
        sx={theme => ({
          mt: 3,
          [theme.breakpoints.up("md")]: {
            display: "flex",
            columnGap: 3,
            mt: 5,
          },
        })}
      >
        <SettingsNavLinks />
        <Divider sx={{ mt: 1, mb: 5, display: { md: "none" } }} />
        <Box
          sx={{
            display: { md: "flex" },
            alignItems: { md: "center" },
            justifyContent: { md: "center" },
            borderLeft: { md: 1 },
            borderColor: { md: "divider" },
            pl: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default SettingsLayout;
