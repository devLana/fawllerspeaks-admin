import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import useGetUserInfo from "@hooks/useGetUserInfo";
import useStatusAlert from "@features/settings/Profile/useStatusAlert";
import UserAvatar from "@components/UserAvatar";
import NextLink from "@components/NextLink";
import settingsLayout from "@utils/settings/settingsLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import { type NextPageWithLayout } from "@types";

const Me: NextPageWithLayout = () => {
  const { alert, setAlert } = useStatusAlert();
  const user = useGetUserInfo();

  return (
    <>
      <Stack direction="row" spacing={4} alignItems="center" pt={2}>
        <UserAvatar
          sx={{
            width: { xs: 100, md: 115 },
            height: { xs: 100, md: 115 },
            fontSize: "2rem",
          }}
        />
        <Stack>
          <Typography gutterBottom sx={{ wordBreak: "break-word" }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <NextLink href="/settings/me/edit">Edit Profile</NextLink>
        </Stack>
      </Stack>
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
