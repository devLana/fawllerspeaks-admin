import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import useGetUserInfo from "@hooks/session/useGetUserInfo";
import useStatusAlert from "@hooks/profile/useStatusAlert";
import UserAvatar from "@components/ui/UserAvatar";
import NextLink from "@components/ui/NextLink";
import settingsLayout from "@utils/layouts/settingsLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import { type NextPageWithLayout } from "@types";

const Me: NextPageWithLayout = () => {
  const { alert, setAlert } = useStatusAlert();
  const user = useGetUserInfo();

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", pt: 2, columnGap: 4 }}>
        <UserAvatar
          sx={{
            width: { width: 100, md: 115 },
            height: { height: 100, md: 115 },
            fontSize: "2em",
          }}
        />
        <Stack>
          <Typography gutterBottom sx={{ wordBreak: "break-word" }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <NextLink href="/settings/me/edit">Edit Profile</NextLink>
        </Stack>
      </Box>
      <Snackbar
        message={alert.message}
        open={alert.open}
        onClose={handleCloseAlert({ ...alert, open: false }, setAlert)}
      />
    </>
  );
};

Me.layout = settingsLayout("My profile", { title: "Admin Profile" });

export default Me;
