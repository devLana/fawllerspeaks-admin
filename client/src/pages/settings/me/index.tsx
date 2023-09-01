import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import useGetUserInfo from "@hooks/useGetUserInfo";
import useStatusAlert from "@features/settings/Profile/useStatusAlert";
import UserAvatar from "@components/UserAvatar";
import settingsLayout from "@utils/settings/settingsLayout";
import NextLink from "@components/NextLink";
import { type NextPageWithLayout } from "@types";

const Me: NextPageWithLayout = () => {
  const user = useGetUserInfo();
  const [statusMessage, setStatusMessage] = useStatusAlert();

  return (
    <>
      <Stack direction="row" spacing={4} alignItems="center">
        <UserAvatar
          sx={{
            width: { xs: 100, md: 115 },
            height: { xs: 100, md: 115 },
            fontSize: "2rem",
          }}
          user={user}
        />
        <Stack>
          <Typography gutterBottom sx={{ wordBreak: "break-word" }}>
            {user?.firstName ?? "Unknown"} {user?.lastName ?? "User"}
          </Typography>
          <NextLink href="/settings/me/edit">Edit Profile</NextLink>
        </Stack>
      </Stack>
      {statusMessage && (
        <Snackbar
          message={statusMessage}
          open={true}
          onClose={() => setStatusMessage(null)}
        />
      )}
    </>
  );
};

Me.layout = settingsLayout("My profile", { title: "Admin Profile" });

export default Me;
