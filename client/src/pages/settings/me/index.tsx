import * as React from "react";

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
  const [isOpen, setIsOpen] = React.useState(false);

  const statusMessage = useStatusAlert(setIsOpen);
  const user = useGetUserInfo();

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
      <Snackbar
        message={statusMessage}
        open={isOpen}
        onClose={handleCloseAlert<boolean>(false, setIsOpen)}
      />
    </>
  );
};

Me.layout = settingsLayout("My profile", { title: "Admin Profile" });

export default Me;
